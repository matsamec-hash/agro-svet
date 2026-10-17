import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// DSA čl. 16 — oznámení závadného inzerátu (/api/bazar/reports): náležitosti
// podle odst. 2, potvrzení o přijetí podle odst. 4. Supabase a Resend mockované.

const REPORT_ID = '11111111-2222-4333-8444-555555555555';
const LISTING_ID = 'aaaaaaaa-bbbb-4ccc-8ddd-eeeeeeeeeeee';

const h = vi.hoisted(() => ({
  listingExists: true,
  insertError: null as null | { message: string },
  inserted: [] as Record<string, unknown>[],
  updates: [] as { patch: Record<string, unknown>; col: string; val: unknown }[],
  sent: [] as Record<string, any>[],
  sendError: null as null | { message: string },
  confirmationFails: false,
}));

vi.mock('../src/lib/supabase', () => ({
  createServerClient: () => ({
    from(table: string) {
      if (table === 'bazar_listings') {
        return {
          select: () => ({
            eq: () => ({
              maybeSingle: async () => ({ data: h.listingExists ? { id: LISTING_ID } : null, error: null }),
            }),
          }),
        };
      }
      if (table === 'bazar_reports') {
        return {
          insert: (row: Record<string, unknown>) => {
            h.inserted.push(row);
            return {
              select: () => ({
                single: async () =>
                  h.insertError ? { data: null, error: h.insertError } : { data: { id: REPORT_ID }, error: null },
              }),
            };
          },
          update: (patch: Record<string, unknown>) => ({
            eq: async (col: string, val: unknown) => {
              h.updates.push({ patch, col, val });
              return { error: null };
            },
          }),
        };
      }
      throw new Error(`unexpected table ${table}`);
    },
  }),
}));

vi.mock('resend', () => ({
  Resend: class {
    emails = {
      send: async (msg: Record<string, any>) => {
        h.sent.push(msg);
        const isConfirmation = msg.to !== 'info@samecdigital.com';
        if (isConfirmation && h.confirmationFails) return { data: null, error: { message: 'boom' } };
        return { data: { id: 'email-id' }, error: h.sendError };
      },
    };
  },
}));

vi.mock('../src/lib/edge-throttle', () => ({
  edgeThrottle: async () => ({ ok: true, remaining: 2, retryAfterS: 0 }),
}));

import { POST } from '../src/pages/api/bazar/reports';
import { parseListingRef, validateReport, CSAM_REASON, GOOD_FAITH_STATEMENT } from '../src/lib/bazar-report';
import { buildReportConfirmationEmail } from '../src/lib/bazar-report-email';

const VALID: Record<string, string> = {
  listing_id: `https://agro-svet.cz/bazar/${LISTING_ID}/`,
  reason: 'podvod',
  description: 'Inzerent chce zálohu předem na zahraniční účet a cena je nereálná.',
  reporter_name: 'Jan Novák',
  reporter_email: 'Jan.Novak@Example.cz',
  good_faith: '1',
};

function formOf(fields: Record<string, string | undefined>): FormData {
  const fd = new FormData();
  for (const [k, v] of Object.entries(fields)) if (v !== undefined) fd.set(k, v);
  return fd;
}

async function submit(fields: Record<string, string | undefined>) {
  const request = new Request('https://agro-svet.cz/api/bazar/reports/', {
    method: 'POST',
    body: formOf(fields),
  });
  const res = await POST({ request, locals: {}, clientAddress: '203.0.113.7' } as any);
  return { res, location: new URL(res.headers.get('location') ?? 'https://x.invalid/') };
}

async function flush() {
  // Odesílání e-mailů běží na pozadí (fire-and-forget) — nech doběhnout mikroúlohy.
  for (let i = 0; i < 10; i++) await new Promise((r) => setTimeout(r, 0));
}

const origKey = process.env.RESEND_API_KEY;
beforeEach(() => {
  h.listingExists = true;
  h.insertError = null;
  h.inserted = [];
  h.updates = [];
  h.sent = [];
  h.sendError = null;
  h.confirmationFails = false;
  process.env.RESEND_API_KEY = 're_test';
  vi.spyOn(console, 'error').mockImplementation(() => {});
});
afterEach(() => {
  if (origKey === undefined) delete process.env.RESEND_API_KEY;
  else process.env.RESEND_API_KEY = origKey;
  vi.restoreAllMocks();
});

describe('POST /api/bazar/reports — náležitosti podle čl. 16 odst. 2 DSA', () => {
  it.each([
    ['chybí jméno', { reporter_name: undefined }, 'name'],
    ['jméno jen z mezer', { reporter_name: '   ' }, 'name'],
    ['chybí e-mail', { reporter_email: undefined }, 'email'],
    ['neplatný e-mail', { reporter_email: 'jan@' }, 'email'],
    ['chybí prohlášení o dobré víře', { good_faith: undefined }, 'good-faith'],
    ['chybí odůvodnění', { description: undefined }, 'description'],
    ['příliš krátké odůvodnění', { description: 'je to podvod' }, 'description'],
    ['příliš dlouhé odůvodnění', { description: 'x'.repeat(4001) }, 'description-long'],
    ['chybí URL inzerátu', { listing_id: undefined }, 'listing'],
    ['URL z cizí domény', { listing_id: `https://evil.example/bazar/${LISTING_ID}/` }, 'listing'],
    ['URL jiné stránky bazaru', { listing_id: 'https://agro-svet.cz/bazar/kategorie/traktory/' }, 'listing'],
    ['neznámý důvod', { reason: 'neco' }, 'reason'],
  ])('%s → odmítne (err=%s) a nic neuloží ani nepošle', async (_label, patch, code) => {
    const { res, location } = await submit({ ...VALID, ...patch });
    await flush();
    expect(res.status).toBe(303);
    expect(location.pathname).toBe('/bazar/nahlasit/');
    expect(location.searchParams.get('err')).toBe(code);
    expect(h.inserted).toHaveLength(0);
    expect(h.sent).toHaveLength(0);
  });

  it('neexistující inzerát → err=listing-not-found', async () => {
    h.listingExists = false;
    const { location } = await submit(VALID);
    expect(location.searchParams.get('err')).toBe('listing-not-found');
    expect(h.inserted).toHaveLength(0);
  });

  it('platné oznámení uloží se jménem, e-mailem, dobrou vírou a kanonickou URL', async () => {
    const { res, location } = await submit(VALID);
    await flush();
    expect(res.status).toBe(303);
    expect(location.searchParams.get('ok')).toBe('1');
    expect(location.searchParams.get('id')).toBe(REPORT_ID);
    expect(location.searchParams.get('potvrzeni')).toBe('1');
    expect(h.inserted).toHaveLength(1);
    expect(h.inserted[0]).toMatchObject({
      listing_id: LISTING_ID,
      listing_url: `https://agro-svet.cz/bazar/${LISTING_ID}/`,
      reason: 'podvod',
      description: VALID.description,
      reporter_name: 'Jan Novák',
      reporter_email: 'jan.novak@example.cz',
      good_faith: true,
    });
    expect(typeof h.inserted[0].reporter_ip_hash).toBe('string');
  });

  it('pošle adminovi upozornění a oznamovateli potvrzení o přijetí (čl. 16 odst. 4)', async () => {
    await submit(VALID);
    await flush();
    expect(h.sent).toHaveLength(2);
    const admin = h.sent.find((m) => m.to === 'info@samecdigital.com')!;
    const confirm = h.sent.find((m) => m.to === 'jan.novak@example.cz')!;
    expect(admin.html).toContain('Jan Novák');
    expect(admin.html).toContain('Prohlášení o dobré víře:</strong> ano');

    expect(confirm.subject).toContain(REPORT_ID);
    expect(confirm.html).toContain(`potvrzujeme přijetí oznámení č. <strong>${REPORT_ID}</strong>`);
    expect(confirm.html).toContain(`https://agro-svet.cz/bazar/${LISTING_ID}/`);
    expect(confirm.text).toContain('Posoudíme ho bez zbytečného odkladu a o rozhodnutí vás budeme informovat.');
    expect(confirm.replyTo).toBe('info@samecdigital.com');

    // Doklad o odeslání potvrzení.
    expect(h.updates).toHaveLength(1);
    expect(h.updates[0].col).toBe('id');
    expect(h.updates[0].val).toBe(REPORT_ID);
    expect(typeof h.updates[0].patch.confirmation_sent_at).toBe('string');
  });

  it('potvrzení neobsahuje volný text oznamovatele (ochrana proti spam relay)', async () => {
    await submit({
      ...VALID,
      reporter_name: 'KUPTE LEVNE https://spam.example',
      description: 'Navštivte https://spam.example a získejte bonus 1000 Kč hned teď!!!',
    });
    await flush();
    const confirm = h.sent.find((m) => m.to === 'jan.novak@example.cz')!;
    for (const part of [confirm.subject, confirm.html, confirm.text]) {
      expect(part).not.toContain('spam.example');
      expect(part).not.toContain('KUPTE');
      expect(part).not.toContain('bonus');
    }
  });

  it('když potvrzení selže, confirmation_sent_at se nenastaví', async () => {
    h.confirmationFails = true;
    const { location } = await submit(VALID);
    await flush();
    expect(location.searchParams.get('ok')).toBe('1');
    expect(h.updates).toHaveLength(0);
  });

  it('chyba při ukládání → err=server, žádné e-maily', async () => {
    h.insertError = { message: 'column "good_faith" does not exist' };
    const { location } = await submit(VALID);
    await flush();
    expect(location.searchParams.get('err')).toBe('server');
    expect(h.sent).toHaveLength(0);
  });

  it(`důvod ${CSAM_REASON} (směrnice 2011/93/EU) nevyžaduje jméno ani e-mail`, async () => {
    const { location } = await submit({
      ...VALID,
      reason: CSAM_REASON,
      reporter_name: '',
      reporter_email: '',
    });
    await flush();
    expect(location.searchParams.get('ok')).toBe('1');
    expect(location.searchParams.get('potvrzeni')).toBeNull();
    expect(h.inserted[0]).toMatchObject({ reason: CSAM_REASON, reporter_name: null, reporter_email: null, good_faith: true });
    // Jen upozornění adminovi, potvrzení není kam poslat.
    expect(h.sent).toHaveLength(1);
    expect(h.sent[0].to).toBe('info@samecdigital.com');
    expect(h.updates).toHaveLength(0);
  });

  it(`i u důvodu ${CSAM_REASON} je prohlášení o dobré víře povinné`, async () => {
    const { location } = await submit({ ...VALID, reason: CSAM_REASON, good_faith: undefined });
    expect(location.searchParams.get('err')).toBe('good-faith');
  });

  it('honeypot → předstírá úspěch, nic neuloží', async () => {
    const { location } = await submit({ ...VALID, website: 'http://bot' });
    await flush();
    expect(location.searchParams.get('ok')).toBe('1');
    expect(h.inserted).toHaveLength(0);
    expect(h.sent).toHaveLength(0);
  });
});

describe('parseListingRef', () => {
  const S = 'https://agro-svet.cz';
  it.each([
    [LISTING_ID, LISTING_ID],
    [LISTING_ID.toUpperCase(), LISTING_ID],
    [`https://agro-svet.cz/bazar/${LISTING_ID}/`, LISTING_ID],
    [`https://www.agro-svet.cz/bazar/${LISTING_ID}`, LISTING_ID],
    [`https://agro-svet.cz/bazar/${LISTING_ID}/?utm_source=x#foto`, LISTING_ID],
    [`  https://agro-svet.cz/bazar/${LISTING_ID}/  `, LISTING_ID],
  ])('%s → UUID', (raw, expected) => {
    expect(parseListingRef(raw, S)).toBe(expected);
  });
  it.each([
    [''],
    ['nesmysl'],
    [`https://agro-svet.cz.evil.example/bazar/${LISTING_ID}/`],
    [`https://evil.example/?u=https://agro-svet.cz/bazar/${LISTING_ID}/`],
    [`javascript:alert(1)//${LISTING_ID}`],
    [`https://agro-svet.cz/bazar/prodejce/${LISTING_ID}/`],
    ['https://agro-svet.cz/bazar/'],
  ])('%s → null', (raw) => {
    expect(parseListingRef(raw, S)).toBeNull();
  });
});

describe('validateReport', () => {
  it('ořízne mezery a e-mail převede na malá písmena', () => {
    const v = validateReport(formOf({ ...VALID, reporter_name: '  Jan   Novák ', reporter_email: ' JAN@EXAMPLE.CZ ' }), 'https://agro-svet.cz');
    expect(v.ok).toBe(true);
    if (v.ok) {
      expect(v.data.reporterName).toBe('Jan Novák');
      expect(v.data.reporterEmail).toBe('jan@example.cz');
    }
  });
  it('odmítne e-mail se znaky pro HTML injection', () => {
    const v = validateReport(formOf({ ...VALID, reporter_email: 'a"><img src=x>@example.cz' }), 'https://agro-svet.cz');
    expect(v).toEqual({ ok: false, error: 'email' });
  });
  it('prohlášení o dobré víře odpovídá znění čl. 16 odst. 2 písm. d) DSA', () => {
    expect(GOOD_FAITH_STATEMENT).toBe('Prohlašuji v dobré víře, že informace a tvrzení v tomto oznámení jsou přesné a úplné.');
  });
});

describe('buildReportConfirmationEmail', () => {
  it('obsahuje číslo oznámení, URL a slib posouzení', () => {
    const { subject, html, text } = buildReportConfirmationEmail({
      reportId: REPORT_ID,
      listingUrl: `https://agro-svet.cz/bazar/${LISTING_ID}/`,
    });
    expect(subject).toBe(`Potvrzení přijetí oznámení č. ${REPORT_ID}`);
    expect(text).toContain(`potvrzujeme přijetí oznámení č. ${REPORT_ID} k inzerátu https://agro-svet.cz/bazar/${LISTING_ID}/.`);
    expect(html).toContain(`href="https://agro-svet.cz/bazar/${LISTING_ID}/"`);
  });
});
