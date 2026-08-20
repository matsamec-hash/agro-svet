import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { podobneOdrudy, skoreShody } from '../../src/lib/odruda-podobnost';
import { parseZnaky } from '../../src/lib/odruda-znaky';

const k = (slug: string, popis: string, rok?: number) => ({ slug, name: slug, popis, rok_registrace: rok ?? null });

describe('skoreShody', () => {
  it('shodná ranost a užití váží víc než shodná výška', () => {
    const a = parseZnaky('Pekařská poloraná odrůda. Rostliny jsou středně vysoké.');
    const stejnaRanost = parseZnaky('Pekařská poloraná odrůda. Rostliny jsou vysoké.');
    const stejnaVyska = parseZnaky('Krmná pozdní odrůda. Rostliny jsou středně vysoké.');
    expect(skoreShody(a, stejnaRanost)).toBeGreaterThan(skoreShody(a, stejnaVyska));
  });

  it('sdílená odolnost proti stejné chorobě skóruje, různá úroveň méně', () => {
    const a = parseZnaky('Odrůda je odolná proti napadení padlím travním.');
    const shodna = parseZnaky('Odrůda je odolná proti napadení padlím travním.');
    const jinaUroven = parseZnaky('Odrůda je náchylná proti napadení padlím travním.');
    const bezShody = parseZnaky('Odrůda je odolná proti napadení rzí plevovou.');
    expect(skoreShody(a, shodna)).toBeGreaterThan(skoreShody(a, jinaUroven));
    expect(skoreShody(a, jinaUroven)).toBeGreaterThan(skoreShody(a, bezShody));
  });

  it('je symetrické a k sobě samému nejvyšší', () => {
    const a = parseZnaky('Pekařská poloraná odrůda. Rostliny jsou středně vysoké.');
    const b = parseZnaky('Krmná pozdní odrůda. Rostliny jsou vysoké.');
    expect(skoreShody(a, b)).toBe(skoreShody(b, a));
    expect(skoreShody(a, a)).toBeGreaterThan(skoreShody(a, b));
  });
});

describe('podobneOdrudy', () => {
  const kandidati = [
    k('alfa', 'Pekařská poloraná odrůda. Rostliny jsou středně vysoké.', 2020),
    k('beta', 'Pekařská poloraná odrůda. Rostliny jsou vysoké.', 2018),
    k('gama', 'Krmná pozdní odrůda. Rostliny jsou nízké.', 2015),
    k('delta', 'Krmná pozdní odrůda. Rostliny jsou nízké.', 2019),
  ];

  it('řadí podle shody znaků, ne podle abecedy', () => {
    const out = podobneOdrudy('psenice-ozima', kandidati[2], kandidati, 3);
    expect(out[0].slug).toBe('delta'); // stejná ranost i užití i výška
    expect(out.map((o) => o.slug)).not.toContain('gama'); // sebe sama vyřadí
  });

  it('různé odrůdy dostanou různý seznam (žádný duplicitní blok)', () => {
    const a = podobneOdrudy('p', kandidati[0], kandidati, 2).map((o) => o.slug);
    const b = podobneOdrudy('p', kandidati[2], kandidati, 2).map((o) => o.slug);
    expect(a).not.toEqual(b);
  });

  it('bez znaků padá na abecedu (zachová dosavadní chování)', () => {
    const bezPopisu = [k('cecko', ''), k('acko', ''), k('becko', '')];
    const out = podobneOdrudy('p', k('zulu', ''), bezPopisu, 3);
    expect(out.map((o) => o.slug)).toEqual(['acko', 'becko', 'cecko']);
  });

  it('je deterministické — stejný vstup, stejné pořadí', () => {
    const a = podobneOdrudy('p', kandidati[0], kandidati, 3).map((o) => o.slug);
    const b = podobneOdrudy('p', kandidati[0], kandidati, 3).map((o) => o.slug);
    expect(a).toEqual(b);
  });

  it('respektuje limit a nikdy nevrací sebe sama', () => {
    const out = podobneOdrudy('p', kandidati[0], kandidati, 2);
    expect(out).toHaveLength(2);
    expect(out.every((o) => o.slug !== 'alfa')).toBe(true);
  });
});

// Skutečný dopad: dnes všech 1051 stránek kukuřice linkuje na TYCHŽ 6 odrůd
// (prvních podle abecedy), takže 1045 odrůd nedostane žádný interní odkaz.
describe('nad reálnými daty ÚKZÚZ', () => {
  const load = (f: string) => {
    const j = JSON.parse(readFileSync(`src/data/plodiny/odrudy/${f}`, 'utf-8'));
    return (Array.isArray(j) ? j : (j.odrudy ?? [])).filter((o: any) => o.popis);
  };

  it('pokrývá výrazně víc odrůd než abecední top-6', () => {
    const od = load('psenice-ozima.json');
    const cil = new Set<string>();
    for (const o of od) for (const p of podobneOdrudy('psenice-ozima', o, od, 6)) cil.add(p.slug);
    // abecední varianta by pokryla přesně 6
    expect(cil.size).toBeGreaterThan(od.length * 0.8);
  });

  // Nejhorší případ: 1051 odrůd, spousta shodných profilů → bez rozprostření
  // shodného skóre by odkaz dostalo jen 357 z nich.
  it('kukuřice — rozprostření drží pokrytí vysoko i u 1051 odrůd', () => {
    const od = load('kukurice.json');
    const cil = new Set<string>();
    for (const o of od) for (const p of podobneOdrudy('kukurice', o, od, 6)) cil.add(p.slug);
    expect(cil.size).toBeGreaterThan(od.length * 0.9);
  });

  it('každá odrůda dostane plný počet návrhů', () => {
    const od = load('jecmen-jarni.json');
    for (const o of od.slice(0, 40)) expect(podobneOdrudy('jecmen-jarni', o, od, 6)).toHaveLength(6);
  });

  it('všechny datové soubory projdou bez výjimky', () => {
    for (const f of readdirSync('src/data/plodiny/odrudy')) {
      const od = load(f);
      if (od.length < 2) continue;
      expect(() => podobneOdrudy(f, od[0], od, 6)).not.toThrow();
    }
  });
});
