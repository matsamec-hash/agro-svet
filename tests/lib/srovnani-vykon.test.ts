import { describe, it, expect } from 'vitest';
import { getAllModels, type StrojFlatModel } from '../../src/lib/stroje';
import { findModelBySlug, buildComparisonRows } from '../../src/lib/comparator';
import { comparisonInsights } from '../../src/lib/comparison-insights';
import { activeLocales } from '../../src/i18n/config';

// /srovnani/<a>-vs-fastrac-2115/ vracelo 500 ve všech jazycích (240 URL):
// JCB Fastrac měl výkon jen ve `specs.power_hp`, takže `power_hp` byl
// undefined, ne null — a `aHp !== null` pak pustilo toLocaleString(undefined).

const isTractorOrCombine = (m: StrojFlatModel) =>
  m.effective_category === 'traktory' || m.effective_category === 'kombajny';

describe('srovnání strojů — výkon nikdy undefined', () => {
  it('každý model má power_hp/power_kw jako číslo nebo null', () => {
    for (const loc of activeLocales) {
      for (const m of getAllModels(loc)) {
        expect(m.power_hp === null || typeof m.power_hp === 'number', `${loc} ${m.slug} power_hp`).toBe(true);
        expect(m.power_kw === null || typeof m.power_kw === 'number', `${loc} ${m.slug} power_kw`).toBe(true);
      }
    }
  });

  it('JCB Fastrac má výkon na úrovni modelu', () => {
    const fastracs = getAllModels().filter((m) => m.slug.startsWith('fastrac-'));
    expect(fastracs.length).toBeGreaterThanOrEqual(12);
    for (const m of fastracs) expect(m.power_hp, m.slug).toBeGreaterThan(100);
    expect(findModelBySlug('fastrac-2115')?.year_to).toBe(2007);
  });

  it('dvojice z hlášení 500 se vygenerují ve všech jazycích', () => {
    const pairs: [string, string][] = [
      ['case-ih-7110', 'fastrac-2115'],
      ['fastrac-2170', 'fendt-dieselross-f6'],
      ['fastrac-2115', 'zetor-25'],
    ];
    for (const loc of activeLocales) {
      for (const [x, y] of pairs) {
        const a = findModelBySlug(x, loc);
        const b = findModelBySlug(y, loc);
        expect(a && b, `${loc} ${x} / ${y}`).toBeTruthy();
        expect(() => comparisonInsights(a!, b!, loc), `${loc} ${x}-vs-${y}`).not.toThrow();
      }
    }
  });

  it('comparisonInsights nespadne pro žádný traktor ani kombajn', () => {
    const all = getAllModels().filter(isTractorOrCombine);
    for (const loc of activeLocales) {
      const rows = buildComparisonRows('traktory', loc);
      for (const a of all) {
        const b = all.find((m) => m.brand_slug !== a.brand_slug && m.effective_category === a.effective_category);
        if (!b) continue;
        const la = findModelBySlug(a.slug, loc)!;
        const lb = findModelBySlug(b.slug, loc)!;
        expect(() => comparisonInsights(la, lb, loc), `${loc} ${a.slug} vs ${b.slug}`).not.toThrow();
        for (const r of rows) expect(() => r.get(la), `${loc} ${a.slug} ${r.label}`).not.toThrow();
      }
    }
  });
});
