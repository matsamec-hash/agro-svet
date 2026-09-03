import { describe, it, expect } from 'vitest';
import { parseZnaky, maZnaky, prvniVeta, popisOdstavce } from '../../src/lib/odruda-znaky';
import { readFileSync, readdirSync } from 'node:fs';
import { CS_ONLY_PLODINY } from '../../src/lib/plodiny';

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

// Regresní stráž nad REÁLNÝMI daty ÚKZÚZ. Drží laťku pokrytí — kdyby úprava parseru
// začala znaky ztrácet, test spadne.
//
// ‼️ Laťka je ROZDĚLENÁ na polní plodiny a zeleninu a nesmí se slít do jedné. Popisy
// zeleniny jsou stavěné jinak (ÚKZÚZ u nich neuvádí výšku rostlin ani výnos, zato
// popisuje tvar a barvu plodu), takže společný průměr by laťku pro obilniny stáhl
// dolů a stráž by přestala být citlivá právě tam, kde je dat nejvíc.
describe('parseZnaky nad reálnými daty ÚKZÚZ', () => {
  const dir = 'src/data/plodiny/odrudy';
  const nacti = (zelenina: boolean) => {
    const popisy: string[] = [];
    for (const f of readdirSync(dir)) {
      if (CS_ONLY_PLODINY.has(f.replace(/\.json$/, '')) !== zelenina) continue;
      const j = JSON.parse(readFileSync(`${dir}/${f}`, 'utf-8'));
      for (const o of (Array.isArray(j) ? j : (j.odrudy ?? []))) if (o.popis) popisy.push(o.popis);
    }
    return popisy;
  };
  const polni = nacti(false);
  const zelenina = nacti(true);
  const pct = (popisy: string[], f: (x: ReturnType<typeof parseZnaky>) => boolean) =>
    Math.round((popisy.map((p) => parseZnaky(p)).filter(f).length * 100) / popisy.length);

  it('dataset má očekávaný rozsah', () => {
    expect(polni.length).toBeGreaterThan(2600);
    expect(zelenina.length).toBeGreaterThan(1300);
  });

  it('pokrytí znaků u polních plodin neklesne pod dosaženou laťku', () => {
    expect(pct(polni, (x) => Boolean(x.ranost))).toBeGreaterThanOrEqual(95);
    expect(pct(polni, (x) => Boolean(x.vyska))).toBeGreaterThanOrEqual(78);
    expect(pct(polni, (x) => x.vynos.length > 0)).toBeGreaterThanOrEqual(93);
    expect(pct(polni, (x) => x.odolnosti.length > 0)).toBeGreaterThanOrEqual(58);
    expect(pct(polni, maZnaky)).toBeGreaterThanOrEqual(96);
  });

  it('pokrytí znaků u zeleniny neklesne pod dosaženou laťku', () => {
    // Naměřeno 2026-09 nad 1 445 popisy: ranost 90, odolnosti 34, maZnaky 91.
    // `vyska` (7 %) a `vynos` (8 %) se ZÁMĚRNĚ netestují — ÚKZÚZ je u zeleniny
    // v popisu neuvádí, takže laťka by hlídala vlastnost, kterou data nemají.
    expect(pct(zelenina, (x) => Boolean(x.ranost))).toBeGreaterThanOrEqual(85);
    expect(pct(zelenina, (x) => x.odolnosti.length > 0)).toBeGreaterThanOrEqual(30);
    expect(pct(zelenina, maZnaky)).toBeGreaterThanOrEqual(88);
  });

  it('nikdy nevrátí prázdnou/uťatou úroveň ani slepenec chorob', () => {
    for (const p of [...polni, ...zelenina]) {
      for (const o of parseZnaky(p).odolnosti) {
        expect(o.uroven.length).toBeGreaterThan(3);
        expect(o.choroba).not.toMatch(/^\s|\.$/);
        expect(o.choroba).not.toMatch(/\bproti\b/); // slepené dvě choroby
        expect(o.choroba.length).toBeLessThanOrEqual(80);
      }
    }
  });
});
