// Oznámení závadného inzerátu (DSA čl. 16) — důvody a validace formuláře.
// Sdílí to formulář /bazar/nahlasit/ i endpoint /api/bazar/reports.
//
// Náležitosti oznámení podle čl. 16 odst. 2 DSA:
//   a) odůvodnění, proč je obsah nezákonný  → description (povinné, min. délka)
//   b) přesné elektronické umístění (URL)   → listing (URL nebo UUID inzerátu, povinné)
//   c) jméno a e-mail oznamovatele          → povinné, KROMĚ oznámení o trestných
//      činech podle čl. 3–7 směrnice 2011/93/EU (důvod CSAM_REASON)
//   d) prohlášení o dobré víře              → good_faith (povinné vždy)

/** Důvod pro trestné činy podle čl. 3–7 směrnice 2011/93/EU — jméno a e-mail nepovinné. */
export const CSAM_REASON = 'zneuzivani-deti';

export const REPORT_REASONS: ReadonlyArray<{ value: string; label: string }> = [
  { value: 'padelek', label: 'Padělek nebo neoriginální díly vydávané za originální' },
  { value: 'podvod', label: 'Podvod nebo scam (nereálná cena, platba předem, falešné kontakty)' },
  { value: 'mlm-pujcky', label: 'MLM, půjčky, pyramida, „práce z domova"' },
  { value: 'leciva-or', label: 'Léčiva nebo přípravky na ochranu rostlin bez oprávnění (mimo profesionální uživatele, neregistrované)' },
  { value: 'osiva-hnojiva', label: 'Osiva nebo hnojiva v rozporu s registrem ÚKZÚZ' },
  { value: 'zvirata-cites', label: 'Zvířata bez veterinárního osvědčení / chráněné druhy bez CITES / mrtvá zvířata' },
  { value: 'zbrane', label: 'Zbraně, střelivo, výbušniny v rozporu se zákonem' },
  { value: 'erotika-tabak', label: 'Erotika, tabák, alkohol, drogy, e-cigarety' },
  { value: 'autorska-prava', label: 'Porušení autorských / průmyslových / osobnostních práv (kradené fotky, padělané logo)' },
  { value: 'spam-duplicita', label: 'Spam, duplicitní inzerát, klamavý obsah' },
  { value: CSAM_REASON, label: 'Sexuální zneužívání nebo vykořisťování dětí, dětská pornografie (jméno a e-mail nejsou povinné)' },
  { value: 'nezakonny-obsah', label: 'Jiný nezákonný obsah' },
  { value: 'jine', label: 'Jiné (uveďte v popisu)' },
];

export const ALLOWED_REASONS: ReadonlySet<string> = new Set(REPORT_REASONS.map((r) => r.value));

export const DESCRIPTION_MIN = 20;
export const DESCRIPTION_MAX = 4000;
export const NAME_MAX = 200;
export const EMAIL_MAX = 254;

export const GOOD_FAITH_STATEMENT =
  'Prohlašuji v dobré víře, že informace a tvrzení v tomto oznámení jsou přesné a úplné.';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const UUID_IN_PATH_RE = /^\/bazar\/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})\/?$/i;
const EMAIL_RE = /^[^\s@<>"',;]+@[^\s@<>"',;]+\.[^\s@<>"',;]+$/;

export function isUuid(s: string): boolean {
  return UUID_RE.test(s);
}

/**
 * Z toho, co oznamovatel vložil (UUID nebo URL inzerátu na našem webu), vytáhne
 * UUID inzerátu. Cizí doména, jiná cesta nebo nesmysl → null.
 */
export function parseListingRef(raw: string, siteUrl: string): string | null {
  const s = raw.trim();
  if (!s) return null;
  if (isUuid(s)) return s.toLowerCase();
  let u: URL;
  try {
    u = new URL(s);
  } catch {
    return null;
  }
  if (u.protocol !== 'https:' && u.protocol !== 'http:') return null;
  const ourHost = new URL(siteUrl).hostname.replace(/^www\./, '');
  if (u.hostname.replace(/^www\./, '') !== ourHost) return null;
  const m = u.pathname.match(UUID_IN_PATH_RE);
  return m ? m[1].toLowerCase() : null;
}

/** Kanonická URL inzerátu — jediná URL, která smí jít do e-mailů oznamovateli. */
export function listingUrlFor(listingId: string, siteUrl: string): string {
  return `${siteUrl.replace(/\/$/, '')}/bazar/${listingId}/`;
}

export type ReportErrorCode =
  | 'reason'
  | 'listing'
  | 'description'
  | 'description-long'
  | 'name'
  | 'name-long'
  | 'email'
  | 'good-faith';

export interface ValidReport {
  listingId: string;
  reason: string;
  description: string;
  reporterName: string | null;
  reporterEmail: string | null;
}

export type ReportValidation =
  | { ok: true; data: ValidReport }
  | { ok: false; error: ReportErrorCode };

/** Validace polí formuláře. Pořadí kontrol = pořadí polí ve formuláři. */
export function validateReport(form: FormData, siteUrl: string): ReportValidation {
  const get = (k: string) => (form.get(k)?.toString() ?? '').trim();

  const listingId = parseListingRef(get('listing_id'), siteUrl);
  if (!listingId) return { ok: false, error: 'listing' };

  const reason = get('reason');
  if (!ALLOWED_REASONS.has(reason)) return { ok: false, error: 'reason' };

  const description = get('description');
  if (description.length > DESCRIPTION_MAX) return { ok: false, error: 'description-long' };
  if (description.length < DESCRIPTION_MIN) return { ok: false, error: 'description' };

  const contactRequired = reason !== CSAM_REASON;

  const name = get('reporter_name').replace(/\s+/g, ' ');
  if (name.length > NAME_MAX) return { ok: false, error: 'name-long' };
  if (contactRequired && name.length < 2) return { ok: false, error: 'name' };

  const email = get('reporter_email').toLowerCase();
  if (email && (email.length > EMAIL_MAX || !EMAIL_RE.test(email))) return { ok: false, error: 'email' };
  if (contactRequired && !email) return { ok: false, error: 'email' };

  const goodFaith = get('good_faith');
  if (!goodFaith) return { ok: false, error: 'good-faith' };

  return {
    ok: true,
    data: {
      listingId,
      reason,
      description,
      reporterName: name || null,
      reporterEmail: email || null,
    },
  };
}
