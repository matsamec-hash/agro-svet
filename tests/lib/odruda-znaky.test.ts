import { describe, it, expect } from 'vitest';
import { parseZnaky, maZnaky, prvniVeta, popisOdstavce } from '../../src/lib/odruda-znaky';
import { readFileSync, readdirSync } from 'node:fs';

// Reálné popisy ÚKZÚZ (zkopírované z src/data/plodiny/odrudy/*.json).
const GAUDIO = `Gaudio je pekařská poloraná odrůda.\r\nRostliny středně vysoké, středně odolné až odolné proti poléhání. Zrno středně velké.\r\nStředně odolná až odolná proti napadení padlím pšenice na listu, středně odolná proti napadení komplexem listových skvrnitostí, středně odolná proti napadení žlutou rzivostí pšenice.`;
const LESAN = `Lesan je středně raná odrůda.\r\nRostliny vysoké, klas dlouhý, řídký až středně hustý, hmotnost tisíce zrn nízká, aleuronová vrstva zrna tmavá, vývojový typ přesívkový.`;
const ORLANDO = `Orlando je poloraná odrůda pro výrobu škrobu.\r\nHlízy krátce oválné, středně velké.\r\nOdrůda slabě náchylná k napadení rakovinou brambor patotypu 1 a rezistentní proti napadení háďátkem bramborovým patotypu Ro 1. Méně odolná proti napadení virovými chorobami.\r\nVýnos hlíz nízký.\r\nVýnos škrobu vysoký.`;

describe('parseZnaky — extrakce znaků z popisu ÚKZÚZ', () => {
  it('vytěží ranost, užití, výšku a poléhání', () => {
    const z = parseZnaky(GAUDIO);
    expect(z.ranost).toBe('poloraná');
    expect(z.uziti).toBe('pekařská');
    expect(z.vyska).toBe('středně vysoké');
    expect(z.polehani).toBe('středně odolné až odolné');
  });

  it('rozparsuje výčet odolností na jednotlivé choroby', () => {
    const z = parseZnaky(GAUDIO);
    expect(z.odolnosti.length).toBe(3);
    expect(z.odolnosti[0]).toEqual({ choroba: 'padlím pšenice na listu', uroven: 'středně odolná až odolná' });
    expect(z.odolnosti.map((o) => o.choroba)).toContain('žlutou rzivostí pšenice');
  });

  it('„proti poléhání/vyzimování" nepovažuje za chorobu', () => {
    for (const o of parseZnaky(GAUDIO).odolnosti) {
      expect(o.choroba).not.toMatch(/poléhání|vyzimování/);
    }
  });

  it('vytěží výnosové a kvalitativní znaky', () => {
    const z = parseZnaky(ORLANDO);
    const m = new Map(z.vynos.map((v) => [v.znak, v.uroven]));
    expect(m.get('výnos hlíz')).toBe('nízký');
    expect(m.get('výnos škrobu')).toBe('vysoký');
  });

  it('zachytí účelové užití („pro výrobu škrobu")', () => {
    expect(parseZnaky(ORLANDO).ranost).toBe('poloraná');
    expect(parseZnaky(ORLANDO).uziti).toBeTruthy();
  });

  it('NEDOMÝŠLÍ chybějící znaky — co v textu není, nevrátí', () => {
    const z = parseZnaky(LESAN);
    expect(z.ranost).toBe('středně raná');
    expect(z.vyska).toBe('vysoké');
    // Lesan nemá v popisu odolnosti proti chorobám ani poléhání
    expect(z.odolnosti).toEqual([]);
    expect(z.polehani).toBeUndefined();
  });

  it('abiotické jevy nepatří mezi choroby a škůdce', () => {
    const z = parseZnaky('Odrůda středně odolná proti vymrzání, méně odolná proti napadení rzí travní, odolná proti vybíhání do květu.');
    expect(z.odolnosti.map((o) => o.choroba)).toEqual(['rzí travní']);
    expect(z.abioticke.map((a) => a.znak).sort()).toEqual(['vybíhání do květu', 'vymrzání']);
  });

  it('prázdný / chybějící popis → prázdný výsledek, ne pád', () => {
    for (const v of [undefined, null, '']) {
      const z = parseZnaky(v);
      expect(z.odolnosti).toEqual([]);
      expect(z.abioticke).toEqual([]);
      expect(z.vynos).toEqual([]);
      expect(maZnaky(z)).toBe(false);
    }
  });

  it('maZnaky rozliší, kdy má smysl kreslit sekci Vlastnosti', () => {
    expect(maZnaky(parseZnaky(LESAN))).toBe(true);
    expect(maZnaky(parseZnaky('Naprosto nestrukturovaný text bez znaků.'))).toBe(false);
  });

  it('prvniVeta / popisOdstavce rozdělí ÚKZÚZ blok na odstavce', () => {
    expect(prvniVeta(GAUDIO)).toBe('Gaudio je pekařská poloraná odrůda.');
    expect(popisOdstavce(GAUDIO)).toHaveLength(3);
    expect(popisOdstavce(ORLANDO)).toHaveLength(5);
    expect(popisOdstavce(undefined)).toEqual([]);
  });
});

// Regresní stráž nad REÁLNÝMI daty ÚKZÚZ (2710 popisů). Drží laťku pokrytí —
// kdyby úprava parseru začala znaky ztrácet, test spadne.
describe('parseZnaky nad reálnými daty ÚKZÚZ', () => {
  const popisy: string[] = [];
  const dir = 'src/data/plodiny/odrudy';
  for (const f of readdirSync(dir)) {
    const j = JSON.parse(readFileSync(`${dir}/${f}`, 'utf-8'));
    for (const o of (Array.isArray(j) ? j : (j.odrudy ?? []))) if (o.popis) popisy.push(o.popis);
  }

  it('dataset má očekávaný rozsah', () => {
    expect(popisy.length).toBeGreaterThan(2600);
  });

  it('pokrytí znaků neklesne pod dosaženou laťku', () => {
    const n = popisy.length;
    const z = popisy.map((p) => parseZnaky(p));
    const pct = (f: (x: ReturnType<typeof parseZnaky>) => boolean) =>
      Math.round((z.filter(f).length * 100) / n);
    expect(pct((x) => Boolean(x.ranost))).toBeGreaterThanOrEqual(95);
    expect(pct((x) => Boolean(x.vyska))).toBeGreaterThanOrEqual(78);
    expect(pct((x) => x.vynos.length > 0)).toBeGreaterThanOrEqual(93);
    expect(pct((x) => x.odolnosti.length > 0)).toBeGreaterThanOrEqual(58);
    expect(pct(maZnaky)).toBeGreaterThanOrEqual(96);
  });

  it('nikdy nevrátí prázdnou/uťatou úroveň ani slepenec chorob', () => {
    for (const p of popisy) {
      for (const o of parseZnaky(p).odolnosti) {
        expect(o.uroven.length).toBeGreaterThan(3);
        expect(o.choroba).not.toMatch(/^\s|\.$/);
        expect(o.choroba).not.toMatch(/\bproti\b/); // slepené dvě choroby
        expect(o.choroba.length).toBeLessThanOrEqual(80);
      }
    }
  });
});
