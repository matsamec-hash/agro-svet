import { describe, it, expect } from 'vitest';
import { isPrerenderedRewriteError } from '../../src/lib/prerendered-rewrite';

// Regrese: detekce téhle chyby už jednou tiše přestala platit, když Astro
// chybu přejmenovalo — všechny cs-only prerendered sekce pod locale prefixem
// začaly místo 302 vracet 500. Test drží obě znění.
describe('isPrerenderedRewriteError', () => {
  it('pozná dnešní ForbiddenRewrite (podle jména i podle zprávy)', () => {
    const e = new Error(
      "You tried to rewrite the on-demand route '/pl/zebricky/' with the static route '/zebricky/', when using the 'server' output.",
    );
    e.name = 'ForbiddenRewrite';
    expect(isPrerenderedRewriteError(e)).toBe(true);

    const byMessage = new Error(
      "The static route '/zebricky/' is rendered by the component 'src/pages/zebricky/index.astro', which is marked as prerendered.",
    );
    expect(isPrerenderedRewriteError(byMessage)).toBe(true);
  });

  it('pozná i starší znění Astra', () => {
    expect(isPrerenderedRewriteError(new Error('unable to find a component instance for route /zebricky/'))).toBe(true);
  });

  it('reálnou chybu stránky NEspolkne (musí zůstat 500)', () => {
    expect(isPrerenderedRewriteError(new TypeError("Cannot read properties of undefined (reading 'map')"))).toBe(false);
    expect(isPrerenderedRewriteError(new Error('Missing SUPABASE_URL or SUPABASE_ANON_KEY'))).toBe(false);
    expect(isPrerenderedRewriteError('nejsem Error')).toBe(false);
    expect(isPrerenderedRewriteError(undefined)).toBe(false);
  });
});
