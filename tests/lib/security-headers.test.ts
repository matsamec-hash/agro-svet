import { describe, it, expect } from 'vitest';
import {
  SECURITY_HEADERS,
  applySecurityHeaders,
  isEmbeddablePath,
} from '../../src/lib/security-headers';

/**
 * Revize 32 domén (18. 9. 2026), nález 10: agro-svet.cz neměl ani jednu
 * bezpečnostní hlavičku. Test drží pětici i obě odchylky, které se při
 * kopírování z jiného webu portfolia velmi snadno ztratí.
 */
describe('bezpečnostní hlavičky', () => {
  const nasad = (pathname: string) =>
    applySecurityHeaders(new Response('ok'), pathname).headers;

  it('běžná stránka dostane všech pět', () => {
    const h = nasad('/stroje/traktory/');
    expect(h.get('Strict-Transport-Security')).toBe('max-age=31536000; includeSubDomains');
    expect(h.get('X-Content-Type-Options')).toBe('nosniff');
    expect(h.get('Referrer-Policy')).toBe('strict-origin-when-cross-origin');
    expect(h.get('X-Frame-Options')).toBe('DENY');
    expect(h.get('Permissions-Policy')).toBeTruthy();
  });

  it('‼️ geolokace zůstává povolená pro vlastní origin — HomeWeather má „Moje pole"', () => {
    // geolocation=() by tlačítko na homepage, /puda/ i /statistiky/ umlčelo.
    expect(nasad('/').get('Permissions-Policy')).toContain('geolocation=(self)');
    expect(nasad('/').get('Permissions-Policy')).not.toContain('geolocation=()');
  });

  it('‼️ /widget/ smí do cizího iframu, takže nedostane X-Frame-Options', () => {
    // /widget/ceny-komodit/ se vkládá na cizí weby; DENY by ho vypnul všude.
    expect(isEmbeddablePath('/widget/ceny-komodit/')).toBe(true);
    expect(nasad('/widget/ceny-komodit/').get('X-Frame-Options')).toBeNull();
    // Ostatní hlavičky ale dostane i widget.
    expect(nasad('/widget/ceny-komodit/').get('X-Content-Type-Options')).toBe('nosniff');
  });

  it('stránka, která widget jen popisuje, embedovatelná není', () => {
    expect(isEmbeddablePath('/widgety/')).toBe(false);
    expect(nasad('/widgety/').get('X-Frame-Options')).toBe('DENY');
  });

  it('hlavičky se sázejí i na redirect a na chybovou odpověď', () => {
    const redirect = applySecurityHeaders(
      new Response(null, { status: 308, headers: { Location: '/kalkulacka/' } }),
      '/kombajn',
    );
    expect(redirect.headers.get('X-Frame-Options')).toBe('DENY');
    expect(redirect.headers.get('Location')).toBe('/kalkulacka/');

    const forbidden = applySecurityHeaders(new Response('Forbidden', { status: 403 }), '/admin/');
    expect(forbidden.headers.get('Referrer-Policy')).toBe('strict-origin-when-cross-origin');
  });

  it('seznam neobsahuje X-Frame-Options — ten se řeší zvlášť kvůli widgetu', () => {
    expect(SECURITY_HEADERS.map(([k]) => k)).not.toContain('X-Frame-Options');
  });
});
