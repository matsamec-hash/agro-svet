import { describe, it, expect } from 'vitest';
import { SEASONS, seasonOfMonth, getSeason } from '../../src/lib/sezona';
import { cropsSownInMonth, cropsHarvestedInMonth, cropsSownInSeason, cropsHarvestedInSeason } from '../../src/lib/sezona';

describe('sezona — definice a seasonOfMonth', () => {
  it('má 4 sezóny se správnými slugy a měsíci', () => {
    expect(SEASONS.map((s) => s.slug)).toEqual(['jaro', 'leto', 'podzim', 'zima']);
    expect(getSeason('jaro')!.months).toEqual([3, 4, 5]);
    expect(getSeason('leto')!.months).toEqual([6, 7, 8]);
    expect(getSeason('podzim')!.months).toEqual([9, 10, 11]);
    expect(getSeason('zima')!.months).toEqual([12, 1, 2]);
  });

  it('seasonOfMonth správně mapuje hranice', () => {
    expect(seasonOfMonth(2)).toBe('zima');
    expect(seasonOfMonth(3)).toBe('jaro');
    expect(seasonOfMonth(5)).toBe('jaro');
    expect(seasonOfMonth(6)).toBe('leto');
    expect(seasonOfMonth(8)).toBe('leto');
    expect(seasonOfMonth(9)).toBe('podzim');
    expect(seasonOfMonth(11)).toBe('podzim');
    expect(seasonOfMonth(12)).toBe('zima');
    expect(seasonOfMonth(1)).toBe('zima');
  });

  it('getSeason vrací undefined pro neznámý slug', () => {
    expect(getSeason('foo')).toBeUndefined();
  });
});

describe('sezona — crop filtry (reálná plodiny data)', () => {
  it('cropsSownInMonth(3) obsahuje jecmen-jarni', () => {
    expect(cropsSownInMonth(3).map((p) => p.slug)).toContain('jecmen-jarni');
  });

  it('cropsSownInMonth(9) obsahuje psenice-ozima, ne jecmen-jarni', () => {
    const slugs = cropsSownInMonth(9).map((p) => p.slug);
    expect(slugs).toContain('psenice-ozima');
    expect(slugs).not.toContain('jecmen-jarni');
  });

  it('cropsHarvestedInMonth(8) obsahuje brambory', () => {
    expect(cropsHarvestedInMonth(8).map((p) => p.slug)).toContain('brambory');
  });

  it('cropsSownInSeason(jaro) obsahuje jarní obiloviny', () => {
    const slugs = cropsSownInSeason('jaro').map((p) => p.slug);
    expect(slugs).toContain('jecmen-jarni');
    expect(slugs).toContain('psenice-jarni');
  });

  it('cropsHarvestedInSeason(podzim) obsahuje kukurice', () => {
    expect(cropsHarvestedInSeason('podzim').map((p) => p.slug)).toContain('kukurice');
  });

  it('filtry vrací plodiny seřazené dle name (cs)', () => {
    const arr = cropsSownInSeason('jaro');
    const names = arr.map((p) => p.name);
    expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b, 'cs')));
  });
});

import { SEASON_CONTENT, seasonWorkLinks, seasonLead, seasonFaq } from '../../src/lib/sezona';
import { akceInSeason } from '../../src/lib/sezona';
import type { Akce } from '../../src/lib/akce';

describe('sezona — editorial obsah', () => {
  it('každá sezóna má lead, ≥1 work link a ≥2 FAQ', () => {
    for (const s of SEASONS) {
      expect(seasonLead(s.slug).length).toBeGreaterThan(20);
      expect(seasonWorkLinks(s.slug).length).toBeGreaterThanOrEqual(1);
      expect(seasonFaq(s.slug).length).toBeGreaterThanOrEqual(2);
    }
  });

  it('work linky míří na existující sekce (/jak-na-to/ nebo /pruvodce/)', () => {
    for (const s of SEASONS) {
      for (const l of seasonWorkLinks(s.slug)) {
        expect(l.href).toMatch(/^\/(jak-na-to|pruvodce)\//);
        expect(l.label.length).toBeGreaterThan(3);
      }
    }
  });

  it('FAQ položky mají q i a', () => {
    for (const f of seasonFaq('jaro')) {
      expect(f.q.length).toBeGreaterThan(5);
      expect(f.a.length).toBeGreaterThan(10);
    }
  });
});

// Minimální Akce fixture — akceInSeason čte jen pristi_vyskyt (+ vrací celý objekt).
function mkAkce(slug: string, pristi_vyskyt: string | null): Akce {
  return { slug, nazev: slug, pristi_vyskyt } as unknown as Akce;
}

describe('sezona — akceInSeason', () => {
  const now = new Date('2026-04-15T10:00:00Z'); // duben = jaro

  it('zahrne akci, jejíž pristi_vyskyt padá do měsíců sezóny a je v budoucnu', () => {
    const akce = [mkAkce('jarni-trh', '2026-05-10')]; // květen ∈ jaro
    expect(akceInSeason(akce, 'jaro', now).map((a) => a.slug)).toEqual(['jarni-trh']);
  });

  it('vynechá akci mimo měsíce sezóny', () => {
    const akce = [mkAkce('letni-akce', '2026-07-10')]; // červenec ∉ jaro
    expect(akceInSeason(akce, 'jaro', now)).toEqual([]);
  });

  it('vynechá akci v minulosti (pristi_vyskyt < now)', () => {
    const akce = [mkAkce('probehla', '2026-03-01')]; // březen ∈ jaro, ale < 15.4.
    expect(akceInSeason(akce, 'jaro', now)).toEqual([]);
  });

  it('vynechá akci s pristi_vyskyt null', () => {
    expect(akceInSeason([mkAkce('bez-data', null)], 'jaro', now)).toEqual([]);
  });

  it('seřadí výsledek vzestupně dle pristi_vyskyt', () => {
    const akce = [mkAkce('pozdejsi', '2026-05-20'), mkAkce('drivejsi', '2026-04-20')];
    expect(akceInSeason(akce, 'jaro', now).map((a) => a.slug)).toEqual(['drivejsi', 'pozdejsi']);
  });

  it('respektuje hranice sezóny (zima = 12,1,2)', () => {
    const winterNow = new Date('2026-01-10T10:00:00Z');
    const akce = [mkAkce('unor', '2026-02-05'), mkAkce('brezen', '2026-03-05')];
    expect(akceInSeason(akce, 'zima', winterNow).map((a) => a.slug)).toEqual(['unor']);
  });
});
