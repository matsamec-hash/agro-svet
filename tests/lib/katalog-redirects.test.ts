import { describe, it, expect } from 'vitest';
import { legacyRedirectTarget } from '../../src/lib/legacy-redirects';
import { REMOVED_MODEL_PAGES, RENAMED_MODEL_SLUGS } from '../../src/lib/katalog-redirects';
import { getAllBrands } from '../../src/lib/stroje';

// Živé stránky katalogu: /stroje/<značka>/, /stroje/<značka>/<řada>/, /stroje/<značka>/<řada>/<model>/.
function livePaths() {
  const brands = new Set<string>();
  const series = new Set<string>();
  const models = new Set<string>();
  const slugs = new Set<string>();
  for (const b of getAllBrands()) {
    brands.add(`/stroje/${b.slug}/`);
    for (const cat of Object.values(b.categories || {})) {
      for (const s of cat.series || []) {
        series.add(`/stroje/${b.slug}/${s.slug}/`);
        for (const m of s.models || []) {
          const short = m.slug.startsWith(b.slug + '-') ? m.slug.slice(b.slug.length + 1) : m.slug;
          models.add(`/stroje/${b.slug}/${s.slug}/${short}/`);
          slugs.add(m.slug);
        }
      }
    }
  }
  return { brands, series, models, slugs };
}

describe('katalog: 301 ze smazaných modelů', () => {
  const live = livePaths();

  it('zdroj přesměrování už není živá stránka modelu', () => {
    for (const from of Object.keys(REMOVED_MODEL_PAGES)) {
      expect(live.models.has(from + '/'), from).toBe(false);
    }
  });

  it('cíl přesměrování existuje (značka, řada nebo model)', () => {
    for (const [from, to] of Object.entries(REMOVED_MODEL_PAGES)) {
      const ok = live.models.has(to) || live.series.has(to) || live.brands.has(to);
      expect(ok, `${from} → ${to}`).toBe(true);
      expect(legacyRedirectTarget(from + '/')).toBe(to);
      expect(legacyRedirectTarget(from)).toBe(to);
    }
  });

  it('přejmenovaný slug zmizel a nový existuje', () => {
    for (const [oldSlug, newSlug] of Object.entries(RENAMED_MODEL_SLUGS)) {
      expect(live.slugs.has(oldSlug), oldSlug).toBe(false);
      expect(live.slugs.has(newSlug), newSlug).toBe(true);
    }
  });

  it('CLAAS Lexion 8900: jeden model v řadě 5000–8000', () => {
    expect(live.models.has('/stroje/claas/lexion-5000-8000/lexion-8900/')).toBe(true);
    expect(legacyRedirectTarget('/stroje/claas/lexion-400-500-600-700/lexion-8900/')).toBe('/stroje/claas/lexion-5000-8000/lexion-8900/');
    expect(legacyRedirectTarget('/stroje/claas/lexion-5000-8000/lexion-8900-new/')).toBe('/stroje/claas/lexion-5000-8000/lexion-8900/');
  });

  it('Kubota M8: M8-191/M8-211 → M8-181/M8-201', () => {
    expect(legacyRedirectTarget('/stroje/kubota/m8/m8-211/')).toBe('/stroje/kubota/m8/m8-201/');
    expect(legacyRedirectTarget('/stroje/kubota/m8/m8-191/')).toBe('/stroje/kubota/m8/m8-181/');
    expect(legacyRedirectTarget('/srovnani/john-deere-6r-215-vs-kubota-m8-211/')).toBe('/srovnani/john-deere-6r-215-vs-kubota-m8-201/');
  });

  it('srovnání s přejmenovaným modelem → kanonické srovnání s novým slugem', () => {
    expect(legacyRedirectTarget('/srovnani/claas-lexion-8900-new-vs-new-holland-cr11/')).toBe('/srovnani/claas-lexion-8900-vs-new-holland-cr11/');
    expect(legacyRedirectTarget('/srovnani/case-ih-9250-vs-claas-lexion-8900-new/')).toBe('/srovnani/case-ih-9250-vs-claas-lexion-8900/');
  });

  it.each([
    '/stroje/claas/lexion-5000-8000/lexion-8900/',
    '/stroje/claas/lexion-5000-8000/',
    '/srovnani/claas-lexion-8900-vs-new-holland-cr11/',
    '/srovnani/',
  ])('%s zůstává bez přesměrování', (path) => {
    expect(legacyRedirectTarget(path)).toBeNull();
  });
});
