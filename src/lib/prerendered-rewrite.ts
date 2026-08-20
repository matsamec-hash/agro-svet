/**
 * Rozpozná Astro chybu „rewrite na prerenderovanou routu".
 *
 * Middleware pro non-cs locale rewritne `/pl/<cesta>` na kanonickou cs routu.
 * U sekcí s `export const prerender = true` (/zebricky, /plodiny,
 * /chov-hlemyzdu, …) to Astro odmítne — prerenderovaná stránka je v build čase
 * zkompilovaná do HTML a za běhu se nedá vyrenderovat. Takový případ je
 * cs-only obsah → patří 302 na cs URL, ne 500.
 *
 * POZOR: Astro tuhle chybu časem PŘEJMENOVALO. Dřív šlo o hlášku
 * „unable to find a component instance", dnes je to `ForbiddenRewrite`
 * („You tried to rewrite the on-demand route … with the static route …").
 * Middleware kontroloval jen staré znění, takže upgrade Astra tiše proměnil
 * všechny tyhle 302 na 500 (/sk/plodiny/, /pl/zebricky/, /pl/chov-hlemyzdu/ …).
 * 500 přitom crawleru říká „zkus to znovu", ne „tady nic není".
 *
 * Žije ve vlastním modulu (ne v middleware.ts), aby šel testovat — middleware
 * importuje `astro:middleware`, které mimo Astro build neexistuje.
 */
export function isPrerenderedRewriteError(err: unknown): boolean {
  if (!(err instanceof Error)) return false;
  return (
    err.name === 'ForbiddenRewrite' ||
    err.message.includes('unable to find a component instance') ||
    err.message.includes('is marked as prerendered')
  );
}
