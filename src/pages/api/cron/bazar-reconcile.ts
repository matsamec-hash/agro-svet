// GET /api/cron/bazar-reconcile — externí cron à 3 min (cron-job.org) s
// Authorization: Bearer ${CRON_SECRET}. Napáruje Fio platby na pending ordery.
import type { APIRoute } from 'astro';
import { createServerClient } from '../../../lib/supabase';
import { getEnvVar } from '../../../lib/env';
import { fetchFioTransactions } from '../../../lib/fio';
import { buildInvoicePdf } from '../../../lib/invoice-pdf';
import { getPlanInfo } from '../../../lib/bazar-featured-pricing';
import type { FeaturedPlan } from '../../../lib/bazar-featured';
import { Resend } from 'resend';

export const prerender = false;
const FROM = 'Agro-svět bazar <bazar@mail.agro-svet.cz>';
const ACCOUNTING_BCC = 'info@samecdigital.com';

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json', 'cache-control': 'no-store' } });
}

export const GET: APIRoute = async ({ request }) => {
  const auth = request.headers.get('authorization') ?? '';
  const secret = getEnvVar('CRON_SECRET');
  if (!secret || auth !== `Bearer ${secret}`) return json({ error: 'unauthorized' }, 401);

  const sb = createServerClient();
  const now = new Date();

  const cutoff = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000).toISOString();
  await sb.from('bazar_featured_orders').update({ status: 'failed', admin_note: 'auto-expired (14d)' })
    .eq('status', 'pending').lt('created_at', cutoff);

  let txs;
  try { txs = await fetchFioTransactions(2, now); }
  catch (e: any) { console.error('[reconcile] fio fetch', e); return json({ error: 'fio_error', message: e.message }, 502); }

  const activated: string[] = [];
  const mismatched: string[] = [];

  for (const tx of txs) {
    try {
      // Jen příchozí CZK platby (parser už dropuje odchozí/bez VS).
      if (tx.currency !== 'CZK') continue;

      // Rychlý skip: tato Fio transakce už spárovaná (idempotence napříč běhy).
      const { data: dup } = await sb.from('bazar_featured_orders')
        .select('id').eq('fio_transaction_id', tx.id).limit(1).maybeSingle();
      if (dup) continue;

      // Najdi pending order podle VS.
      const { data: order } = await sb.from('bazar_featured_orders')
        .select('id, listing_id, user_id, plan, days, price_czk, buyer_name, buyer_ico, buyer_address, vs')
        .eq('vs', Number(tx.vs)).eq('status', 'pending').maybeSingle();
      if (!order) continue;

      // Přesná shoda částky — jinak nechat pending + upozornit admina (neaktivovat).
      if (order.price_czk !== tx.amountCzk) {
        mismatched.push(order.id);
        await sb.from('bazar_featured_orders')
          .update({ admin_note: `Částka nesouhlasí: přišlo ${tx.amountCzk} ${tx.currency}, čekáno ${order.price_czk} Kč (fio tx ${tx.id})` })
          .eq('id', order.id).eq('status', 'pending');
        continue;
      }

      // ── CLAIM (atomicky, once-only) ──────────────────────────────────────
      // Podmínka status='pending' + kontrola vrácené řádky zabrání dvojímu
      // zpracování při souběžných bězích. `bazar_extend_featured` je aditivní,
      // takže NESMÍ proběhnout 2× — proto claim PŘED jakýmkoli side-effectem.
      const { data: claimed } = await sb.from('bazar_featured_orders')
        .update({ status: 'paid', paid_at: now.toISOString(), fio_transaction_id: tx.id })
        .eq('id', order.id).eq('status', 'pending')
        .select('id').maybeSingle();
      if (!claimed) continue; // už zabrané jinou instancí

      // ── PROVISIONING (best-effort, izolované) ────────────────────────────
      // Order je už 'paid' → i při selhání se platba NEztratí a NEzpracuje 2×.
      // Nedodělek (chybí featured_until/faktura) flagne admin_note pro ruční dořešení.
      try {
        const { data: rpcRows, error: rpcErr } = await sb.rpc('bazar_extend_featured', {
          p_listing_id: order.listing_id, p_days: order.days, p_plan: order.plan as FeaturedPlan,
        });
        if (rpcErr || !rpcRows?.length) throw new Error(`extend rpc: ${rpcErr?.message ?? 'no rows'}`);
        const featuredUntil: string = rpcRows[0].featured_until;

        const { data: invNo } = await sb.rpc('bazar_next_invoice_number');
        const invoiceNumber = String(invNo);
        const planInfo = getPlanInfo(order.plan as FeaturedPlan);
        const { data: owner } = await sb.from('bazar_users').select('email').eq('id', order.user_id).maybeSingle();
        const buyerEmail = owner?.email ?? '';
        const pdf = await buildInvoicePdf({
          invoiceNumber, issueDate: now, planLabel: planInfo.label, days: order.days,
          amountCzk: order.price_czk, vs: order.vs, buyerName: order.buyer_name,
          buyerIco: order.buyer_ico, buyerAddress: order.buyer_address, buyerEmail,
        });
        const pdfPath = `${order.user_id}/${invoiceNumber}.pdf`;
        await sb.storage.from('invoices').upload(pdfPath, pdf, { contentType: 'application/pdf', upsert: true });

        await sb.from('bazar_featured_orders').update({
          featured_until_after: featuredUntil, invoice_number: invoiceNumber, invoice_pdf_path: pdfPath,
        }).eq('id', order.id);

        try {
          const resendKey = getEnvVar('RESEND_API_KEY');
          if (resendKey && buyerEmail) {
            const resend = new Resend(resendKey);
            await resend.emails.send({
              from: FROM, to: buyerEmail, bcc: ACCOUNTING_BCC,
              subject: `Topování aktivováno + faktura ${invoiceNumber}`,
              text: `Děkujeme, platba dorazila. Topování inzerátu je aktivní do ${new Date(featuredUntil).toLocaleDateString('cs-CZ')}.\nV příloze faktura ${invoiceNumber}.`,
              attachments: [{ filename: `faktura-${invoiceNumber}.pdf`, content: Buffer.from(pdf).toString('base64') }],
            });
          } else if (!buyerEmail) {
            console.error('[reconcile] chybí e-mail kupujícího pro order', order.id);
          }
        } catch (e) { console.error('[reconcile] email', e); }

        activated.push(order.id);
      } catch (provErr: any) {
        console.error('[reconcile] provisioning selhal', order.id, provErr);
        await sb.from('bazar_featured_orders')
          .update({ admin_note: `PAID, ale provisioning selhal (${provErr?.message ?? 'err'}) — dořešit ručně (fio tx ${tx.id})` })
          .eq('id', order.id);
      }
    } catch (txErr) {
      // Jeden špatný záznam nesmí zabít celou dávku.
      console.error('[reconcile] chyba ve zpracování tx', (tx as any)?.id, txErr);
    }
  }

  return json({ ok: true, activated: activated.length, mismatched: mismatched.length, scanned: txs.length });
};
