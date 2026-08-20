import { describe, it, expect } from 'vitest';
import { AREA_DEFAULTS, WEIGHT_DEFAULTS, areaDefaults, weightDefaults, NUMBER_LOCALE } from '../../src/i18n/prevodniky';
import { locales } from '../../src/i18n/config';

// Písmena, která daný jazyk NEMÁ → marker uniklé češtiny.
const CZ_ONLY: Record<string, string> = { sk: 'ěřů', pl: 'ěřůčšžďťň', uk: 'ěřůčšž' };

describe('prevodniky — výchozí stringy vložených převodníků', () => {
  it('každý locale má kompletní sadu klíčů', () => {
    for (const loc of locales) {
      expect(Object.keys(AREA_DEFAULTS[loc].unitNames).sort()).toEqual(Object.keys(AREA_DEFAULTS.cs.unitNames).sort());
      expect(Object.keys(WEIGHT_DEFAULTS[loc].unitNames).sort()).toEqual(Object.keys(WEIGHT_DEFAULTS.cs.unitNames).sort());
      expect(Object.keys(WEIGHT_DEFAULTS[loc].commodityNames).sort()).toEqual(Object.keys(WEIGHT_DEFAULTS.cs.commodityNames).sort());
      expect(NUMBER_LOCALE[loc]).toMatch(/^[a-z]{2}-[A-Z]{2}$/);
    }
  });

  it('non-cs názvy jednotek a komodit neobsahují české znaky', () => {
    for (const loc of ['sk', 'pl', 'uk'] as const) {
      const blob = [
        ...Object.values(AREA_DEFAULTS[loc].unitNames),
        ...Object.values(AREA_DEFAULTS[loc].ui),
        ...Object.values(WEIGHT_DEFAULTS[loc].unitNames),
        ...Object.values(WEIGHT_DEFAULTS[loc].commodityNames),
        ...Object.values(WEIGHT_DEFAULTS[loc].ui),
      ].join(' ');
      for (const ch of CZ_ONLY[loc]) {
        expect(blob.includes(ch), `${loc}: uniklá čeština („${ch}") v: ${blob.slice(0, 140)}`).toBe(false);
      }
    }
  });

  it('cs defaulty odpovídají původním hardcoded hodnotám (byte-identita)', () => {
    expect(AREA_DEFAULTS.cs.unitNames.m2).toBe('metr čtvereční');
    expect(AREA_DEFAULTS.cs.unitNames.jitro).toBe('rakouské/české jitro');
    expect(AREA_DEFAULTS.cs.ui.inputLabel).toBe('Zadej hodnotu');
    expect(WEIGHT_DEFAULTS.cs.unitNames.bu).toBe('bušl (bushel)');
    expect(WEIGHT_DEFAULTS.cs.commodityNames.canola).toBe('řepka (canola)');
    expect(WEIGHT_DEFAULTS.cs.ui.inputLabel).toBe('Zadej hmotnost');
  });

  it('neznámé locale spadne na cs (nespadne runtime)', () => {
    expect(areaDefaults('xx' as never)).toBe(AREA_DEFAULTS.cs);
    expect(weightDefaults('xx' as never)).toBe(WEIGHT_DEFAULTS.cs);
  });
});
