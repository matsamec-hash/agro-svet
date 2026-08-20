import { describe, it, expect } from 'vitest';
import { formatYearRange, familyLabel, localizePresentToken, getBrand, getAllBrands } from '../../src/lib/stroje';

// Regrese: „dosud"/„N. řada" se dřív vracely česky i pro sk/pl/uk.
describe('stroje lib — locale-aware rozsahy a labely', () => {
  it('formatYearRange překládá otevřený konec dle locale', () => {
    expect(formatYearRange(2012, null)).toBe('2012–dosud');
    expect(formatYearRange(2012, null, 'cs')).toBe('2012–dosud');
    expect(formatYearRange(2012, null, 'pl')).toBe('2012–obecnie');
    expect(formatYearRange(2012, null, 'sk')).toBe('2012–súčasnosť');
    expect(formatYearRange(2012, null, 'uk')).toBe('2012–дотепер');
  });

  it('uzavřený rozsah a prázdný vstup jsou locale-nezávislé', () => {
    expect(formatYearRange(2012, 2021, 'pl')).toBe('2012–2021');
    expect(formatYearRange(null, 2021, 'pl')).toBe('');
  });

  it('neznámé locale padá na cs', () => {
    expect(formatYearRange(2012, null, 'de')).toBe('2012–dosud');
  });

  it('familyLabel číselné rodiny lokalizuje, nečíselné ne', () => {
    expect(familyLabel('6', 'cs')).toBe('6. řada');
    expect(familyLabel('6', 'pl')).toBe('Seria 6');
    expect(familyLabel('6', 'sk')).toBe('6. rad');
    expect(familyLabel('6', 'uk')).toBe('Серія 6');
    expect(familyLabel('steiger', 'pl')).toBe('Steiger');
  });

  // 102 ze 424 názvů řad má „(2012–dosud)" zapečené přímo v názvu, ne v šabloně —
  // uniklo to i do <title> a meta description sk/pl/uk stránek řad.
  it('localizePresentToken přepíše dosud v názvech řad, cs nechá být', () => {
    const mk = () => ({
      slug: 'x', name: 'X', categories: {
        traktory: { name: 'Traktory', series: [
          { slug: 'a', name: '6R Series (2012–dosud)' },
          { slug: 'b', name: '5 Series (1990–2005)' },
        ] },
      },
    }) as any;
    expect(localizePresentToken(mk(), 'cs').categories.traktory.series[0].name).toBe('6R Series (2012–dosud)');
    expect(localizePresentToken(mk(), 'pl').categories.traktory.series[0].name).toBe('6R Series (2012–obecnie)');
    expect(localizePresentToken(mk(), 'sk').categories.traktory.series[0].name).toBe('6R Series (2012–súčasnosť)');
    expect(localizePresentToken(mk(), 'uk').categories.traktory.series[0].name).toBe('6R Series (2012–дотепер)');
    // uzavřený rozsah zůstává netknutý
    expect(localizePresentToken(mk(), 'pl').categories.traktory.series[1].name).toBe('5 Series (1990–2005)');
  });

  it('getBrand nemutuje cs data přes locale variantu (žádný sdílený objekt)', () => {
    const pl = getBrand('john-deere', 'pl');
    const cs = getBrand('john-deere', 'cs');
    const find = (b: any) => b!.categories.traktory.series.find((s: any) => s.slug === '6m');
    expect(find(pl)!.name).toContain('obecnie');
    expect(find(cs)!.name).toContain('dosud');
  });

  // Regresní síto nad reálnými daty: kdyby někdo přidal řadu s „(2020–dosud)"
  // v názvu (a to je dnes tvar 102 ze 424), nesmí to projet do ne-cs locale.
  it('žádný název řady ani značky neobsahuje "dosud" pod sk/pl/uk', () => {
    for (const loc of ['sk', 'pl', 'uk'] as const) {
      const offenders: string[] = [];
      for (const b of getAllBrands(loc)) {
        for (const cat of Object.values(b.categories ?? {}) as any[]) {
          for (const s of cat.series ?? []) {
            if (String(s.name).includes('dosud')) offenders.push(`${loc}/${b.slug}/${s.slug}: ${s.name}`);
          }
        }
      }
      expect(offenders, `${loc} má české "dosud" v názvech řad`).toEqual([]);
    }
  });

  it('cs si "dosud" v názvech řad ponechává (není to překlep, ale zdrojová data)', () => {
    const withDosud = getAllBrands('cs').flatMap((b) =>
      Object.values(b.categories ?? {}).flatMap((c: any) =>
        (c.series ?? []).filter((s: any) => String(s.name).includes('dosud'))));
    expect(withDosud.length).toBeGreaterThan(50);
  });
});
