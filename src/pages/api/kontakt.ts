// POST /api/kontakt/ — kontaktní formulář (/kontakt/ a /<locale>/kontakt/).
//
// Pořadí: honeypot → validace → throttle → Resend → 303 zpátky na stránku
// v jazyce odesílatele s `?ok=1` nebo `?err=<kód>`. Nic se neukládá a
// návštěvníkovi se nic neposílá (viz lib/kontakt-email.ts).
//
// CSRF: Astro checkOrigin je vypnutý (astro.config.mjs), stejnou práci dělá
// host-based kontrola v middleware.ts. Formulář posílá na stejný host, takže
// projde; cross-site POST dostane 403 dřív, než se sem dostane.
import type { APIRoute } from 'astro';
import { getEnvVar } from '../../lib/env';
import { SITE_URL } from '../../lib/config';
import { edgeThrottle } from '../../lib/edge-throttle';
import { parseKontaktForm, sendKontaktEmail } from '../../lib/kontakt-email';
import { localizePath } from '../../i18n/utils';
import { defaultLocale, isLocale, type Locale } from '../../i18n/config';
import type { KontaktError } from '../../i18n/kontakt';

export const prerender = false;

export const THROTTLE_MAX = 5;
export const THROTTLE_WINDOW_S = 15 * 60;

/** 303 na lokalizovanou /kontakt/ (cs bez prefixu). Kotva #formular posune
 *  stránku k hlášce nad formulářem.
 *  ‼️ Ne `Response.redirect()`: ta vrací odpověď s NEMĚNNÝMI hlavičkami a
 *  middleware (applySecurityHeaders) do nich pak zapisuje. */
export function kontaktRedirect(locale: Locale, result: { ok: true } | { err: KontaktError }): Response {
  const url = new URL(`${SITE_URL}${localizePath(locale, '/kontakt/')}`);
  if ('ok' in result) url.searchParams.set('ok', '1');
  else url.searchParams.set('err', result.err);
  url.hash = 'formular';
  return new Response(null, {
    status: 303,
    headers: { Location: url.toString(), 'Cache-Control': 'no-store' },
  });
}

function formLocale(form: FormData | null): Locale {
  const v = form?.get('locale');
  return typeof v === 'string' && isLocale(v) ? v : defaultLocale;
}

function clientIp(request: Request, getAddress: () => string | undefined): string {
  const cf = request.headers.get('cf-connecting-ip');
  if (cf) return cf.trim();
  try {
    return getAddress() ?? 'unknown';
  } catch {
    return 'unknown';
  }
}

export const POST: APIRoute = async (context) => {
  const { request } = context;

  let form: FormData | null = null;
  try {
    form = await request.formData();
  } catch {
    // Ne-formulářové tělo (JSON, prázdné) — žádný prohlížečový odeslaný formulář.
    return kontaktRedirect(defaultLocale, { err: 'server' });
  }
  const locale = formLocale(form);

  // Honeypot: robot vyplní i pole skryté CSS. Předstíráme úspěch, ať nezkouší dál.
  const honeypot = form.get('website');
  if (typeof honeypot === 'string' && honeypot.trim() !== '') {
    return kontaktRedirect(locale, { ok: true });
  }

  const parsed = parseKontaktForm(form);
  if (!parsed.ok) return kontaktRedirect(locale, { err: parsed.error });

  // Throttle až po validaci: překlep v e-mailu nemá ubírat z limitu.
  const limit = await edgeThrottle({
    bucket: 'kontakt',
    key: clientIp(request, () => context.clientAddress),
    max: THROTTLE_MAX,
    windowS: THROTTLE_WINDOW_S,
  });
  if (!limit.ok) return kontaktRedirect(locale, { err: 'rate' });

  const sent = await sendKontaktEmail(getEnvVar('RESEND_API_KEY'), locale, parsed.value);
  if (!sent.ok) {
    console.error(`[api/kontakt] not delivered (${sent.reason}), locale=${locale}, topic=${parsed.value.topic}`);
    return kontaktRedirect(locale, { err: 'server' });
  }

  return kontaktRedirect(locale, { ok: true });
};
