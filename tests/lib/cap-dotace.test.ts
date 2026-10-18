import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import {
  calculateCap, formatKc, SAZBY, LIMITY, CIS_PLODINY, CIS_ZVIRATA, KRAJE, ROK_SAZEB, KURZ_CZK_EUR, ZALOHA_PROCENT, ZDROJE,
} from '../../src/lib/cap-dotace';

const find = (r: ReturnType<typeof calculateCap>, key: string) => r.items.find((i) => i.key === key);

describe('sazby přímých plateb 2026 (MZe, 2. 10. 2026)', () => {
  it('rok, kurz a zálohy podle tiskové zprávy MZe', () => {
    expect(ROK_SAZEB).toBe(2026);
    expect(KURZ_CZK_EUR).toBe(24.44);
    expect(ZALOHA_PROCENT).toBe(75);
    expect(ZDROJE.sazby.url).toMatch(/^https:\/\/mze\.gov\.cz\//);
  });

  it('plošné sazby v Kč/ha', () => {
    expect(SAZBY).toEqual({
      biss: 1631.69,
      maliZemedelci: 6873.79,
      redistributivni: 3426.29,
      mladyZemedelec: 2389.20,
      ekoZakladni: 1547.14,
      ekoPremiova: 18263.22,
      noveKrajinnePrvky: 10558.08,
      udrzbaKrajinnychPrvku: 37882.00,
      hospodareniZivinami: 202.36,
      pasoveStridani: 7626.02,
    });
  });

  it('CIS plodiny v Kč/ha', () => {
    const map = Object.fromEntries(CIS_PLODINY.map((p) => [p.slug, p.sazba]));
    expect(map).toEqual({
      'ovoce-vvp': 15696.34,
      chmel: 14729.01,
      'zelenina-vvp': 13065.77,
      'brambory-skrob': 12701.67,
      'ovoce-vp': 9655.53,
      'cukrova-repa': 6477.08,
      'zelenina-vp': 4676.59,
      bilkoviny: 1428.42,
    });
  });

  it('CIS zvířata v Kč/ks', () => {
    const map = Object.fromEntries(CIS_ZVIRATA.map((z) => [z.slug, z.sazba]));
    expect(map).toEqual({ dojnice: 3415.97, 'masna-telata': 3212.63, 'bahnice-kozy': 520.57 });
  });

  it('len přadný a krmné plodiny v CIS nejsou', () => {
    const slugs = CIS_PLODINY.map((p) => p.slug);
    expect(slugs).not.toContain('len');
    expect(slugs).not.toContain('krmne');
    for (const p of CIS_PLODINY) expect(p.name).not.toMatch(/^Len\b|krmné/i);
  });

  it('kraje zůstávají pro bazar a farmy (14)', () => {
    expect(KRAJE).toHaveLength(14);
  });
});

describe('vymyšlené sazby se nevrací', () => {
  const ROOT = path.resolve(__dirname, '../..');
  const FILES = [
    'src/lib/cap-dotace.ts',
    'src/components/calc/DotaceCapCz.astro',
    'src/i18n/kalkulacka/dotace-cap.ts',
  ];
  // BISS 2150, „CISS“ 1450, EKO 1300 / 2400, ANC 4500 / 2000, VCS chmel 13000 …
  const FORBIDDEN = [/\b2150\b/, /\b1450\b/, /\b2400\b/, /\b1300\b/, /\b4500\b/, /4 500 Kč/, /2 000 Kč/, /\bCISS\b/, /\bVCS:/, /ancHorska|ancOA|ancSV/, /Len přadný/i, /Krmné plodiny/i];

  for (const f of FILES) {
    it(`${f} neobsahuje vymyšlené sazby`, () => {
      const src = fs.readFileSync(path.join(ROOT, f), 'utf8');
      const hits = FORBIDDEN.filter((re) => re.test(src)).map(String);
      expect(hits).toEqual([]);
    });
  }

  it('žádná sazba ani položka výpočtu není 2150, 1450 nebo 2400', () => {
    const all = [...Object.values(SAZBY), ...CIS_PLODINY.map((p) => p.sazba), ...CIS_ZVIRATA.map((z) => z.sazba)];
    for (const bad of [2150, 1450, 2400, 1300, 4500, 2000]) expect(all).not.toContain(bad);
    const r = calculateCap({ totalHa: 200, ornaHa: 150, mladyZemedelec: true, ekoZakladni: true, ekoPremiovaNpHa: 5 });
    for (const it of r.items) expect([2150, 1450, 2400, 1300]).not.toContain(it.sazba);
  });
});

describe('calculateCap — běžné přímé platby', () => {
  it('prázdný výsledek pro 0 ha', () => {
    const r = calculateCap({ totalHa: 0 });
    expect(r.items).toEqual([]);
    expect(r.total).toBe(0);
    expect(r.perHa).toBe(0);
  });

  it('pod 1 ha žádné plošné platby', () => {
    const r = calculateCap({ totalHa: 0.8, ekoZakladni: true });
    expect(r.items).toEqual([]);
    expect(r.warnings.join(' ')).toMatch(/1 ha/);
  });

  it('BISS + redistributivní platba pro 100 ha', () => {
    const r = calculateCap({ totalHa: 100 });
    expect(find(r, 'biss')!.amount).toBeCloseTo(163169, 2);
    expect(find(r, 'redistributivni')!.amount).toBeCloseTo(342629, 2);
    expect(r.total).toBeCloseTo(505798, 2);
    expect(r.perHa).toBeCloseTo(5057.98, 2);
  });

  it('redistributivní platba jen na prvních 150 ha', () => {
    const r = calculateCap({ totalHa: 500 });
    const red = find(r, 'redistributivni')!;
    expect(LIMITY.redistributivniMaxHa).toBe(150);
    expect(red.mnozstvi).toBe(150);
    expect(red.amount).toBeCloseTo(150 * 3426.29, 2);
    expect(find(r, 'biss')!.mnozstvi).toBe(500);
  });

  it('mladý zemědělec nejvýš na 90 ha', () => {
    const r = calculateCap({ totalHa: 120, mladyZemedelec: true });
    const m = find(r, 'mlady')!;
    expect(LIMITY.mladyMaxHa).toBe(90);
    expect(m.mnozstvi).toBe(90);
    expect(m.amount).toBeCloseTo(90 * 2389.2, 2);
  });

  it('základní ekoplatba na celou výměru, jen když je zaškrtnutá', () => {
    expect(find(calculateCap({ totalHa: 40 }), 'eko-zakladni')).toBeUndefined();
    const r = calculateCap({ totalHa: 40, ekoZakladni: true });
    expect(find(r, 'eko-zakladni')!.amount).toBeCloseTo(40 * 1547.14, 2);
  });

  it('prémiová ekoplatba jen na neprodukční plochy, nejvýš do 10 % orné půdy, plus prémiové pásy', () => {
    const r = calculateCap({ totalHa: 100, ornaHa: 80, ekoZakladni: true, ekoPremiovaNpHa: 12, ekoPremiovaPasyHa: 1.5 });
    const p = find(r, 'eko-premiova')!;
    expect(p.mnozstvi).toBeCloseTo(8 + 1.5, 6); // 10 % z 80 ha = 8 ha
    expect(p.amount).toBeCloseTo(9.5 * 18263.22, 2);
    expect(r.warnings.join(' ')).toMatch(/10 %/);
  });

  it('nástavby ekoplatby bez základní ekoplatby se nepočítají', () => {
    const r = calculateCap({ totalHa: 100, ornaHa: 80, ekoPremiovaNpHa: 5, udrzbaKpHa: 1, ziviny: true });
    expect(r.items.some((i) => i.key.startsWith('eko-'))).toBe(false);
    expect(r.warnings.join(' ')).toMatch(/základní ekoplatbu/);
  });

  it('nové krajinné prvky nejvýš na 50 % orné půdy, údržba KP, živiny na ornou půdu', () => {
    const r = calculateCap({ totalHa: 10, ornaHa: 2, ekoZakladni: true, noveKpHa: 3, udrzbaKpHa: 0.4, ziviny: true });
    expect(find(r, 'eko-nove-kp')!.mnozstvi).toBe(1);
    expect(find(r, 'eko-udrzba-kp')!.amount).toBeCloseTo(0.4 * 37882, 2);
    expect(find(r, 'eko-ziviny')!.amount).toBeCloseTo(2 * 202.36, 2);
  });

  it('pásové střídání jen od 4 ha', () => {
    expect(find(calculateCap({ totalHa: 50, ornaHa: 50, ekoZakladni: true, pasoveStridaniHa: 3 }), 'eko-pasove')).toBeUndefined();
    const r = calculateCap({ totalHa: 50, ornaHa: 50, ekoZakladni: true, pasoveStridaniHa: 6 });
    expect(find(r, 'eko-pasove')!.amount).toBeCloseTo(6 * 7626.02, 2);
  });

  it('CIS plodiny na hektar, minimum 1 ha', () => {
    const r = calculateCap({ totalHa: 30, ornaHa: 20, cisHa: { chmel: 5, 'ovoce-vvp': 0.5, neexistuje: 3 } });
    expect(find(r, 'cis-chmel')!.amount).toBeCloseTo(5 * 14729.01, 2);
    expect(find(r, 'cis-ovoce-vvp')).toBeUndefined();
    expect(r.items.some((i) => i.key === 'cis-neexistuje')).toBe(false);
    expect(r.warnings.join(' ')).toMatch(/minimální výměra/);
  });

  it('CIS zvířata na kus — dojnice 2–10 ks, nad 10 se schématem kvality; bahnice od 14 ks', () => {
    const a = calculateCap({ totalHa: 50, cisKs: { dojnice: 8, 'masna-telata': 20, 'bahnice-kozy': 10 } });
    expect(find(a, 'cis-dojnice')!.amount).toBeCloseTo(8 * 3415.97, 2);
    expect(find(a, 'cis-dojnice')!.jednotka).toBe('ks');
    expect(find(a, 'cis-masna-telata')!.amount).toBeCloseTo(20 * 3212.63, 2);
    expect(find(a, 'cis-bahnice-kozy')).toBeUndefined();

    const b = calculateCap({ totalHa: 50, cisKs: { dojnice: 40 } });
    expect(find(b, 'cis-dojnice')).toBeUndefined();
    const c = calculateCap({ totalHa: 50, cisKs: { dojnice: 40, 'bahnice-kozy': 14 }, dojniceSchemaKvality: true });
    expect(find(c, 'cis-dojnice')!.amount).toBeCloseTo(40 * 3415.97, 2);
    expect(find(c, 'cis-bahnice-kozy')!.amount).toBeCloseTo(14 * 520.57, 2);
  });
});

describe('calculateCap — platba pro malé zemědělce', () => {
  it('nejvýš na 4 ha a nahrazuje všechny ostatní přímé platby', () => {
    const r = calculateCap({ totalHa: 8, ornaHa: 8, maliZemedelec: true, mladyZemedelec: true, ekoZakladni: true, cisHa: { chmel: 2 } });
    expect(r.items).toHaveLength(1);
    expect(r.items[0].key).toBe('mali');
    expect(r.items[0].mnozstvi).toBe(4);
    expect(r.total).toBeCloseTo(4 * 6873.79, 2);
    expect(r.alternativa!.total).toBeGreaterThan(0);
  });

  it('nad 10 ha nelze — spočítají se běžné platby', () => {
    const r = calculateCap({ totalHa: 12, maliZemedelec: true });
    expect(find(r, 'mali')).toBeUndefined();
    expect(find(r, 'biss')).toBeDefined();
    expect(r.warnings[0]).toMatch(/10 ha/);
  });

  it('podnik do 10 ha dostane srovnání s platbou pro malé zemědělce', () => {
    const r = calculateCap({ totalHa: 3 });
    expect(r.alternativa!.total).toBeCloseTo(3 * 6873.79, 2);
    expect(calculateCap({ totalHa: 11 }).alternativa).toBeUndefined();
  });
});

describe('formatKc', () => {
  it('celé koruny', () => {
    expect(formatKc(163169.4)).toMatch(/163\s169 Kč/);
  });
});
