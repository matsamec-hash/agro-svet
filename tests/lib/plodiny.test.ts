import { describe, it, expect } from 'vitest';
import {
  listPlodiny,
  getPlodina,
  SKUPINA_LABELS,
  isOdrudaIndexable,
  listIndexableOdrudy,
  getOdruda,
  listSkupiny,
  listPlodinyBySkupina,
  listUdrzovatele,
  getUdrzovatel,
  udrzovatelSlug,
  type Odruda,
} from '../../src/lib/plodiny';

describe('plodiny lib — jádro', () => {
  it('listPlodiny vrací neprázdný seznam seřazený dle name (cs)', () => {
    const all = listPlodiny();
    expect(all.length).toBeGreaterThan(0);
    const names = all.map((p) => p.name);
    expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b, 'cs')));
  });

  it('getPlodina spojí obohacující vrstvu s faktickými odrůdami', () => {
    const oves = getPlodina('oves');
    expect(oves).toBeTruthy();
    expect(oves!.name).toBeTruthy();
    expect(oves!.skupina).toBe('obiloviny');
    expect(oves!.odrudy.length).toBeGreaterThan(0);
  });

  it('odrůdy plodiny jsou seřazené dle name (cs)', () => {
    const oves = getPlodina('oves')!;
    const names = oves.odrudy.map((o) => o.name);
    expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b, 'cs')));
  });

  it('getPlodina vrací undefined pro neznámou plodinu', () => {
    expect(getPlodina('neexistuje')).toBeUndefined();
  });

  it('žádná plodina nemá rezervovaný slug "skupina"', () => {
    expect(listPlodiny().some((p) => p.slug === 'skupina')).toBe(false);
  });

  it('SKUPINA_LABELS pokrývá použité skupiny', () => {
    for (const p of listPlodiny()) {
      expect(SKUPINA_LABELS[p.skupina]).toBeTruthy();
    }
  });
});

describe('plodiny lib — guardrail indexovatelnosti (čisté chování)', () => {
  const enriched: Odruda = {
    slug: 'x',
    name: 'X',
    plodina_slug: 'oves',
    enrichment: { popis: 'Faktický popis odrůdy z ÚKZÚZ.' },
  };
  const bare: Odruda = { slug: 'y', name: 'Y', plodina_slug: 'oves' };

  it('odrůda s popisem v enrichmentu je indexovatelná', () => {
    expect(isOdrudaIndexable(enriched)).toBe(true);
  });

  it('odrůda bez enrichmentu není indexovatelná', () => {
    expect(isOdrudaIndexable(bare)).toBe(false);
  });

  it('prázdný popis / prázdné vlastnosti nestačí', () => {
    expect(isOdrudaIndexable({ ...bare, enrichment: { popis: '   ' } })).toBe(false);
    expect(isOdrudaIndexable({ ...bare, enrichment: { vlastnosti: {} } })).toBe(false);
    expect(isOdrudaIndexable({ ...bare, enrichment: { faq: [] } })).toBe(false);
  });

  it('vlastnosti nebo faq stačí k indexovatelnosti', () => {
    expect(isOdrudaIndexable({ ...bare, enrichment: { vlastnosti: { Typ: 'jarní' } } })).toBe(true);
    expect(isOdrudaIndexable({ ...bare, enrichment: { faq: [{ q: 'a', a: 'b' }] } })).toBe(true);
  });
});

describe('plodiny lib — guardrail nad reálnými daty', () => {
  it('build() odvodí enrichment.popis z faktického ÚKZÚZ popisu', () => {
    // Alespoň jedna odrůda v datech má oficiální popis → je indexovatelná.
    const idx = listIndexableOdrudy();
    expect(idx.length).toBeGreaterThan(0);
  });

  it('listIndexableOdrudy vrací jen indexovatelné a nese plodina kontext', () => {
    const idx = listIndexableOdrudy();
    expect(idx.every((e) => isOdrudaIndexable(e.odruda))).toBe(true);
    expect(idx.every((e) => typeof e.plodina_slug === 'string' && e.plodina_slug.length > 0)).toBe(true);
  });

  it('getOdruda najde konkrétní odrůdu v plodině', () => {
    const oves = getPlodina('oves')!;
    const first = oves.odrudy[0];
    expect(getOdruda('oves', first.slug)?.name).toBe(first.name);
  });
});

describe('plodiny lib — facety', () => {
  it('listSkupiny vrací použité skupiny s počty', () => {
    const sk = listSkupiny();
    expect(sk.find((s) => s.skupina === 'obiloviny')?.count).toBeGreaterThanOrEqual(1);
  });

  it('listPlodinyBySkupina filtruje dle skupiny', () => {
    const obi = listPlodinyBySkupina('obiloviny');
    expect(obi.length).toBeGreaterThan(0);
    expect(obi.every((p) => p.skupina === 'obiloviny')).toBe(true);
  });

  it('udrzovatelSlug je deterministický ASCII slug', () => {
    expect(udrzovatelSlug('Selgen, a.s.')).toBe('selgen-a-s');
    expect(udrzovatelSlug('KWS LOCHOW POLSKA Sp. z o.o.')).toBe('kws-lochow-polska-sp-z-o-o');
  });

  it('listUdrzovatele agreguje odrůdy a getUdrzovatel je dohledá', () => {
    const u = listUdrzovatele();
    expect(u.length).toBeGreaterThan(0);
    const withMany = u.find((x) => x.odrudy.length >= 2);
    expect(withMany).toBeTruthy();
    const fetched = getUdrzovatel(withMany!.slug);
    expect(fetched?.name).toBe(withMany!.name);
  });
});

import { osivaLinksFor } from '../../src/lib/osiva-links';

describe('osiva-links — síťová synergie', () => {
  it('vrací odkaz na adresář prodejců a na farmakrty (followed)', () => {
    const links = osivaLinksFor('obiloviny');
    expect(links.some((l) => l.href.includes('/prodejci'))).toBe(true);
    const fk = links.find((l) => l.href.includes('farmakrty.cz'));
    expect(fk).toBeTruthy();
    expect(fk!.rel).toBeUndefined(); // vlastní síť = followed, žádné nofollow
  });
});
