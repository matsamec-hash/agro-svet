/**
 * Bezpečnostní hlavičky. Stejná pětice, jakou má zbytek portfolia — nález 10
 * z revize 32 domén (18. 9. 2026), agro-svet.cz neměl ani jednu.
 *
 * ‼️ Sází je aplikace, ne proxy. Coolify staví web nixpackem a spouští
 * `node ./dist/server/entry.mjs`, takže mezi Node a Traefikem není žádný
 * nginx, do kterého by šlo sáhnout.
 *
 * ⛔ A proto taky platí JEN na routy renderované na vyžádání. Prerendered
 *    stránky (~4 500 souborů: /plodiny/, /odrudy/, /farmy/, /kolik-stoji/,
 *    /prehled/, /bazar/*, /widget/) servíruje statický handler node adaptéru,
 *    který middleware vůbec nevolá. Adaptérová volba `staticHeaders` to
 *    NEŘEŠÍ — zapisuje do `dist/_headers.json` výhradně Content-Security-Policy
 *    (viz @astrojs/node/dist/index.js, hook `astro:build:done`), takže s ní
 *    vznikne prázdné `[]`. Na zbytek musí Cloudflare Transform Rule.
 *
 * Dvě odchylky od portfoliové pětice, obě záměrné:
 *
 * ‼️ `geolocation=(self)`, NE `geolocation=()` — HomeWeather na homepage,
 *    /puda/ i /statistiky/ má tlačítko „Moje pole", které volá
 *    `navigator.geolocation.getCurrentPosition`. Prázdný seznam by ho umlčel.
 *
 * ‼️ `X-Frame-Options` NEDOSTANE /widget/ — /widget/ceny-komodit/ je
 *    chrome-less widget schválně určený k vložení přes <iframe> na CIZÍ weby
 *    (podpora agro-svetu přes síť portálů). DENY by ho vypnul všude.
 */
export const SECURITY_HEADERS: ReadonlyArray<readonly [string, string]> = [
  ['Strict-Transport-Security', 'max-age=31536000; includeSubDomains'],
  ['X-Content-Type-Options', 'nosniff'],
  ['Referrer-Policy', 'strict-origin-when-cross-origin'],
  ['Permissions-Policy', 'camera=(), microphone=(), geolocation=(self), payment=()'],
];

/** True pro cesty, které se smějí vykreslit v cizím iframu. */
export function isEmbeddablePath(pathname: string): boolean {
  return pathname.startsWith('/widget/');
}

function setHeaders(response: Response, pathname: string): void {
  for (const [key, value] of SECURITY_HEADERS) response.headers.set(key, value);
  if (!isEmbeddablePath(pathname)) response.headers.set('X-Frame-Options', 'DENY');
}

/** Nasadí hlavičky na hotovou odpověď. Obvykle mutuje a vrací tutéž Response —
 *  VŽDY ale používej návratovou hodnotu.
 *
 *  ‼️ `Response.redirect()` (a `Response.error()`) vrací odpověď s NEMĚNNÝMI
 *  hlavičkami — `headers.set` hodí `TypeError: immutable`. Endpointy, které
 *  ji vracely (19×, mj. /api/bazar/reports — formulář podle DSA čl. 16), tak
 *  od zavedení hlaviček 18. 9. 2026 končily HTTP 500. Takovou odpověď proto
 *  zkopírujeme (tělo, status i hlavičky zůstanou) a hlavičky nasadíme na kopii. */
export function applySecurityHeaders(response: Response, pathname: string): Response {
  try {
    setHeaders(response, pathname);
    return response;
  } catch (err) {
    if (!(err instanceof TypeError)) throw err;
    const copy = new Response(response.body, response);
    setHeaders(copy, pathname);
    return copy;
  }
}
