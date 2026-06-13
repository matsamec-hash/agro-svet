import { describe, it, expect } from 'vitest';
import {
  listChoroby,
  getChoroba,
  chorobaSlugForChip,
  isChorobaIndexable,
  listIndexableChoroby,
  chorobaChipsForPlodina,
  type ChorobaEntry,
} from '../../src/lib/choroby';
import { listPlodiny } from '../../src/lib/plodiny';

describe('choroby lib — jádro', () => {
  it('listChoroby vrací neprázdný seznam seřazený dle name (cs)', () => {
    const all = listChoroby();
    expect(all.length).toBeGreaterThan(0);
    const names = all.map((c) => c.name);
    expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b, 'cs')));
  });

  it('getChoroba dohledá entitu dle slugu, neznámý slug → undefined', () => {
    const first = listChoroby()[0];
    expect(getChoroba(first.slug)?.name).toBe(first.name);
    expect(getChoroba('neexistuje')).toBeUndefined();
  });

  it('každá entita má slug, name, popis a alespoň jeden alias', () => {
    for (const c of listChoroby()) {
      expect(c.slug).toMatch(/^[a-z0-9-]+$/);
      expect(c.name.length).toBeGreaterThan(0);
      expect(c.popis.trim().length).toBeGreaterThan(0);
      expect(c.aliases.length).toBeGreaterThan(0);
    }
  });

  it('žádné dva sloty nemají kolidující slug', () => {
    const slugs = listChoroby().map((c) => c.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });
});

describe('choroby lib — mapování chipů na entity', () => {
  it('chorobaSlugForChip mapuje přesný alias (i s okolními mezerami)', () => {
    expect(chorobaSlugForChip('padlí travní')).toBe('padli-travni');
    expect(chorobaSlugForChip('  padlí travní  ')).toBe('padli-travni');
  });

  it('varianty rzí napříč plodinami spadají do jedné entity', () => {
    expect(chorobaSlugForChip('rezi')).toBe('rzi-obilovin');
    expect(chorobaSlugForChip('rezi (pšeničná, žlutá)')).toBe('rzi-obilovin');
    expect(chorobaSlugForChip('rzi (korunková, stéblová)')).toBe('rzi-obilovin');
  });

  it('nenamapovaný chip vrací undefined', () => {
    expect(chorobaSlugForChip('zcela neznámá choroba xyz')).toBeUndefined();
  });

  it('každý alias se mapuje právě na jednu existující entitu', () => {
    const slugs = new Set(listChoroby().map((c) => c.slug));
    for (const c of listChoroby()) {
      for (const a of c.aliases) {
        expect(chorobaSlugForChip(a)).toBe(c.slug);
        expect(slugs.has(chorobaSlugForChip(a)!)).toBe(true);
      }
    }
  });
});

describe('choroby lib — reverzní index nad reálnými daty', () => {
  it('padlí travní agreguje více obilnin', () => {
    const padli = getChoroba('padli-travni');
    expect(padli).toBeTruthy();
    expect(padli!.plodiny.length).toBeGreaterThanOrEqual(5);
    expect(padli!.plodiny.some((p) => p.plodina_slug === 'oves')).toBe(true);
  });

  it('postižené plodiny jsou seřazené dle name a bez duplicit', () => {
    for (const c of listChoroby()) {
      const names = c.plodiny.map((p) => p.plodina_name);
      expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b, 'cs')));
      const slugs = c.plodiny.map((p) => p.plodina_slug);
      expect(new Set(slugs).size).toBe(slugs.length);
    }
  });

  it('reverzní index odpovídá chipům v datech plodin', () => {
    // Pro vzorovou plodinu: každý její chip, který se mapuje, musí mít danou
    // plodinu uvedenou v reverzním indexu té choroby.
    for (const p of listPlodiny()) {
      for (const chip of p.choroby ?? []) {
        const slug = chorobaSlugForChip(chip);
        if (!slug) continue;
        const entry = getChoroba(slug)!;
        expect(entry.plodiny.some((x) => x.plodina_slug === p.slug)).toBe(true);
      }
    }
  });
});

describe('choroby lib — anti-thin guardrail', () => {
  it('entita s popisem a ≥1 plodinou je indexovatelná', () => {
    const padli = getChoroba('padli-travni')!;
    expect(isChorobaIndexable(padli)).toBe(true);
  });

  it('entita bez plodin není indexovatelná', () => {
    const fake: ChorobaEntry = {
      slug: 'x', name: 'X', popis: 'Popis.', aliases: ['x'], plodiny: [],
    };
    expect(isChorobaIndexable(fake)).toBe(false);
  });

  it('entita s prázdným popisem není indexovatelná', () => {
    const fake: ChorobaEntry = {
      slug: 'x', name: 'X', popis: '   ', aliases: ['x'],
      plodiny: [{ plodina_slug: 'oves', plodina_name: 'Oves', chip: 'x' }],
    };
    expect(isChorobaIndexable(fake)).toBe(false);
  });

  it('listIndexableChoroby vrací jen indexovatelné', () => {
    const idx = listIndexableChoroby();
    expect(idx.length).toBeGreaterThan(0);
    expect(idx.every(isChorobaIndexable)).toBe(true);
  });
});

describe('choroby lib — chipy pro pillar', () => {
  it('chip mapovaný na indexovatelnou chorobu nese slug', () => {
    const chips = chorobaChipsForPlodina('psenice-ozima');
    expect(chips.length).toBeGreaterThan(0);
    const linked = chips.find((c) => c.slug);
    expect(linked).toBeTruthy();
    expect(getChoroba(linked!.slug!)).toBeTruthy();
  });

  it('zachová všechny původní chipy plodiny (i bez odkazu)', () => {
    const p = listPlodiny().find((x) => x.slug === 'psenice-ozima')!;
    const chips = chorobaChipsForPlodina('psenice-ozima');
    expect(chips.map((c) => c.chip)).toEqual(p.choroby);
  });

  it('neznámá plodina vrací prázdné pole', () => {
    expect(chorobaChipsForPlodina('neexistuje')).toEqual([]);
  });
});
