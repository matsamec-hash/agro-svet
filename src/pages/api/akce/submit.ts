// src/pages/api/akce/submit.ts
import type { APIRoute } from 'astro';
import { validateAkceInput, slugifyAkce, type AkceInput } from '../../../lib/akce';
import { insertSubmission } from '../../../lib/akce-supabase';
import { geocode } from '../../../lib/geocode';
import { sendSubmissionConfirmation, notifyModerator } from '../../../lib/akce-email';
import { getEnvVar } from '../../../lib/env';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const form = await request.formData();

  // Honeypot — boti vyplní; lidé ne (pole je skryté CSS).
  if (String(form.get('web_url') ?? '').trim() !== '') {
    return json({ ok: true });
  }

  const druh = String(form.get('druh') ?? 'jednorazova') as AkceInput['druh'];
  const dny = form.getAll('dny_v_tydnu').map((d) => Number(d)).filter((n) => n >= 1 && n <= 7);

  const input: AkceInput = {
    nazev: String(form.get('nazev') ?? '').trim(),
    typ: String(form.get('typ') ?? '') as AkceInput['typ'],
    druh,
    zacatek: druh === 'jednorazova' ? toIso(form.get('zacatek')) : undefined,
    konec: druh === 'jednorazova' ? toIso(form.get('konec')) : undefined,
    dny_v_tydnu: druh === 'opakovana' ? dny : undefined,
    cas_od: druh === 'opakovana' ? str(form.get('cas_od')) : undefined,
    cas_do: druh === 'opakovana' ? str(form.get('cas_do')) : undefined,
    plati_od: druh === 'opakovana' ? str(form.get('plati_od')) : undefined,
    plati_do: druh === 'opakovana' ? str(form.get('plati_do')) : undefined,
    misto_nazev: str(form.get('misto_nazev')),
    adresa: str(form.get('adresa')),
    obec: String(form.get('obec') ?? '').trim(),
    kraj_slug: String(form.get('kraj_slug') ?? '').trim(),
    okres_slug: String(form.get('okres_slug') ?? '').trim(),
    poradatel: str(form.get('poradatel')),
    web: str(form.get('web')),
    telefon: str(form.get('telefon')),
    email: String(form.get('email') ?? '').trim(),
    popis: String(form.get('popis') ?? '').trim(),
  };

  const v = validateAkceInput(input);
  if (!v.ok) return json({ ok: false, errors: v.errors }, 400);

  let lat: number | null = null, lng: number | null = null;
  try {
    const geo = await geocode({ location: input.obec });
    if (geo) { lat = geo.lat; lng = geo.lng; }
  } catch (e) { console.error('[akce/submit] geocode failed', e); }

  const suffix = cryptoSuffix();
  const slug = slugifyAkce(input.nazev, input.obec, suffix);

  let id: string;
  try {
    const res = await insertSubmission({ ...input, slug, lat, lng });
    id = res.id;
  } catch (e) {
    console.error('[akce/submit] insert failed', e);
    return json({ ok: false, errors: ['Uložení se nezdařilo, zkuste to prosím znovu.'] }, 500);
  }

  const apiKey = getEnvVar('RESEND_API_KEY') ?? '';
  sendSubmissionConfirmation(apiKey, input.email, input.nazev).catch((e) => console.error('[akce/submit] mail', e));
  notifyModerator(apiKey, input.nazev, input.obec).catch((e) => console.error('[akce/submit] mail', e));

  return json({ ok: true, id });
};

function str(v: FormDataEntryValue | null): string | undefined {
  const s = String(v ?? '').trim();
  return s === '' ? undefined : s;
}
function toIso(v: FormDataEntryValue | null): string | undefined {
  const s = String(v ?? '').trim();
  if (!s) return undefined;
  const d = new Date(s);
  return isNaN(d.getTime()) ? undefined : d.toISOString();
}
function cryptoSuffix(): string {
  const bytes = new Uint8Array(2);
  crypto.getRandomValues(bytes);
  return Array.from(bytes).map((b) => b.toString(16).padStart(2, '0')).join('');
}
function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });
}
