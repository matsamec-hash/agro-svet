import { describe, it, expect } from 'vitest';
import { znackySrovnani, srovnaniStrings, fill } from '../../src/i18n/znacky-srovnani';
import { brandComparisonInsights, brandStats, brandPairs } from '../../src/lib/brand-comparator';
import { getBrand } from '../../src/lib/stroje';
import { locales } from '../../src/i18n/config';

// Písmena, která čeština má a cílový jazyk NE → marker uniklé české prózy.
const CZ_ONLY: Record<string, string> = { sk: 'ěřů', pl: 'ěřůčšžďťň', uk: 'ěřůčšž' };

describe('znacky-srovnani — jazykový balík', () => {
  it('všechny locale mají kompletní sadu klíčů (žádný cs fallback v runtime)', () => {
    const csKeys = Object.keys(znackySrovnani.cs).sort();
    for (const loc of locales) {
      expect(Object.keys(znackySrovnani[loc]).sort(), `locale ${loc}`).toEqual(csKeys);
      for (const [k, v] of Object.entries(znackySrovnani[loc])) {
        expect(typeof v, `${loc}.${k}`).toBe('string');
        expect((v as string).trim().length, `${loc}.${k} je prázdný`).toBeGreaterThan(0);
      }
    }
  });

  it('non-cs texty nejsou jen zkopírovaná čeština', () => {
    for (const loc of ['sk', 'pl', 'uk'] as const) {
      const same = Object.keys(znackySrovnani.cs).filter(
        (k) => (znackySrovnani[loc] as Record<string, string>)[k] === (znackySrovnani.cs as Record<string, string>)[k],
      );
      // Pár klíčů se legitimně shoduje (např. sk „Značky"), ale ne většina.
      expect(same.length, `${loc} má ${same.length} identických klíčů s cs`).toBeLessThan(6);
    }
  });

  it('fill dosadí placeholdery a neznámé nechá být', () => {
    expect(fill('{a} vs {b}', { a: 'X', b: 'Y' })).toBe('X vs Y');
    expect(fill('{a} vs {chybi}', { a: 'X' })).toBe('X vs {chybi}');
  });
});

describe('brandComparisonInsights — lokalizovaný generátor', () => {
  const pair = brandPairs(1)[0];

  it('vrací text v požadovaném jazyce bez českých zbytků', () => {
    for (const loc of ['sk', 'pl', 'uk'] as const) {
      const a = getBrand(pair.a.slug, loc)!;
      const b = getBrand(pair.b.slug, loc)!;
      const ins = brandComparisonInsights(a, brandStats(a), b, brandStats(b), loc);
      const blob = [ins.tldr, ins.verdictA, ins.verdictB, ins.shortDescription,
                    ...ins.faqs.flatMap((f) => [f.q, f.a])].join(' ');
      // značky/modely mohou obsahovat cokoli → kontroluj jen znaky typické pro čj
      for (const ch of CZ_ONLY[loc]) {
        expect(blob.includes(ch), `${loc}: uniklá čeština („${ch}") v: ${blob.slice(0, 120)}`).toBe(false);
      }
      expect(ins.faqs).toHaveLength(4);
    }
  });

  it('cs zůstává beze změny (výchozí locale)', () => {
    const a = getBrand(pair.a.slug)!;
    const b = getBrand(pair.b.slug)!;
    const ins = brandComparisonInsights(a, brandStats(a), b, brandStats(b));
    expect(ins.tldr).toContain('modelů');
    expect(ins.shortDescription).toContain('Srovnání značek');
  });

  it('žádný text neobsahuje nedosazený placeholder', () => {
    for (const loc of locales) {
      const a = getBrand(pair.a.slug, loc)!;
      const b = getBrand(pair.b.slug, loc)!;
      const ins = brandComparisonInsights(a, brandStats(a), b, brandStats(b), loc);
      const blob = [ins.tldr, ins.verdictA, ins.verdictB, ins.shortDescription,
                    ...ins.faqs.flatMap((f) => [f.q, f.a])].join(' ');
      expect(blob, `${loc} má nedosazený {placeholder}`).not.toMatch(/\{[a-z]+\}/i);
    }
  });

  it('„český původ" se pozná i u lokalizované země (Czechy/Чехія…)', () => {
    const t = srovnaniStrings('pl');
    const bednar = getBrand('bednar', 'pl');
    if (!bednar) return; // značka nemusí v datech být
    expect(['Czechy', 'Česko', 'Чехія', 'Čechy']).toContain(bednar.country);
    const other = getBrand('vaderstad', 'pl');
    if (!other) return;
    const ins = brandComparisonInsights(bednar, brandStats(bednar), other, brandStats(other), 'pl');
    expect(ins.tldr + ins.verdictA).toContain(t.edgeCzechOrigin.slice(0, 20));
  });
});
