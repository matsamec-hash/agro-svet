import { describe, it, expect } from 'vitest';
import { odrudaDatasetSchema, truncateAtBoundary } from '../../src/lib/structured-data';

describe('odrudaDatasetSchema', () => {
  const base = {
    odrudaName: 'Annie',
    plodinaName: 'Pšenice ozimá',
    plodinaSlug: 'psenice-ozima',
    url: '/plodiny/psenice-ozima/annie/',
    description: 'Pekařsky kvalitní odrůda ozimé pšenice s vysokou výnosností.',
    udrzovatel: 'Selgen a.s.',
    rokRegistrace: 2018,
    typ: 'pekařská',
    ranost: 'poloraná',
    vlastnosti: { 'Výška rostlin': 'střední', 'HTZ': '45 g' },
    odolnosti: { 'Padlí': '7' },
    zdrojUrl: 'https://ido.ukzuz.cz/ido/...',
  };

  it('vrací Dataset s absolutní url, názvem, popisem a jazykem', () => {
    const s = odrudaDatasetSchema(base) as any;
    expect(s['@context']).toBe('https://schema.org');
    expect(s['@type']).toBe('Dataset');
    expect(s.url).toBe('https://agro-svet.cz/plodiny/psenice-ozima/annie/');
    expect(s.name).toContain('Annie');
    expect(s.description).toBe(base.description);
    expect(s.inLanguage).toBe('cs-CZ');
    expect(s.isAccessibleForFree).toBe(true);
  });

  it('uvádí ÚKZÚZ jako creator a plodinu jako isPartOf', () => {
    const s = odrudaDatasetSchema(base) as any;
    expect(s.creator.alternateName).toBe('ÚKZÚZ');
    expect(s.isPartOf.url).toBe('https://agro-svet.cz/plodiny/psenice-ozima/');
  });

  it('mapuje fakta a vlastnosti/odolnosti do variableMeasured', () => {
    const s = odrudaDatasetSchema(base) as any;
    const names = s.variableMeasured.map((v: any) => v.name);
    expect(names).toContain('Rok registrace');
    expect(names).toContain('Typ');
    expect(names).toContain('Udržovatel');
    expect(names).toContain('Výška rostlin');
    expect(names).toContain('Padlí');
    expect(s.variableMeasured.every((v: any) => v['@type'] === 'PropertyValue')).toBe(true);
  });

  it('zahrnuje klíčová slova a zdroj přes isBasedOn', () => {
    const s = odrudaDatasetSchema(base) as any;
    expect(s.keywords).toContain('Annie');
    expect(s.keywords).toContain('Pšenice ozimá');
    expect(s.isBasedOn).toBe(base.zdrojUrl);
  });

  it('vynechá volitelná pole když chybí', () => {
    const s = odrudaDatasetSchema({
      odrudaName: 'X',
      plodinaName: 'Žito',
      plodinaSlug: 'zito',
      url: '/plodiny/zito/x/',
      description: 'Popis.',
    }) as any;
    expect(s.variableMeasured).toBeUndefined();
    expect(s.isBasedOn).toBeUndefined();
  });
});

describe('truncateAtBoundary', () => {
  it('vrací text beze změny když je kratší než limit', () => {
    expect(truncateAtBoundary('Krátký popis.', 155)).toBe('Krátký popis.');
  });

  it('sjednotí vnitřní zalomení řádků na jednu mezeru', () => {
    expect(truncateAtBoundary('První řádek.\nDruhý  řádek.', 155)).toBe('První řádek. Druhý řádek.');
  });

  it('ořezává na hranici slova, ne uprostřed slova', () => {
    const text = 'Odrůda ozimé pšenice vhodná pro pekařské zpracování a vysokou výnosnost v podmínkách.';
    const out = truncateAtBoundary(text, 40);
    expect(out.length).toBeLessThanOrEqual(41); // + ellipsis
    expect(out.endsWith('…')).toBe(true);
    // poslední slovo nesmí být rozseknuté → před … je celé slovo z originálu
    const lastWord = out.replace(/…$/, '').trim().split(' ').pop()!;
    expect(text).toContain(lastWord);
  });

  it('nekončí mezerou ani interpunkcí před výpustkou', () => {
    const text = 'Slovo jedna, slovo dva, slovo tři, slovo čtyři, slovo pět, slovo šest.';
    const out = truncateAtBoundary(text, 30);
    expect(out).not.toMatch(/[\s,;:–-]…$/);
  });

  it('ukončí na hranici věty bez výpustky, pokud věta končí blízko limitu', () => {
    const text = 'První věta je tady hotová. A druhá věta už je úplně navíc a zbytečná pro popis.';
    const out = truncateAtBoundary(text, 30);
    expect(out).toBe('První věta je tady hotová.');
    expect(out.endsWith('…')).toBe(false);
  });

  it('ořízne přesah z reálného ÚKZÚZ popisu (>155) na čisté slovo', () => {
    const text = 'Odrůda je středně raná až poloraná, vhodná do všech výrobních oblastí, s dobrou odolností proti poléhání a vysokou pekařskou jakostí třídy A, registrovaná v České republice.';
    const out = truncateAtBoundary(text, 155);
    expect(out.length).toBeLessThanOrEqual(156);
    expect(out.endsWith('…')).toBe(true);
    expect(out).not.toMatch(/\s…$/); // mezera před výpustkou je odstraněná
    const lastWord = out.replace(/…$/, '').trim().split(' ').pop()!;
    expect(text).toContain(lastWord);
  });
});
