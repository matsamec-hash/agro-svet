import { describe, it, expect } from 'vitest';
import { datasetSchema, breadcrumbSchema } from '../../src/lib/structured-data';

describe('datasetSchema', () => {
  const base = {
    name: 'Zemědělská data — Španělsko',
    description: 'Produkce, půda a ekonomika zemědělství ve Španělsku.',
    url: '/svet/spanelsko/',
    countryName: 'Španělsko',
    keywords: ['zemědělství', 'Španělsko', 'Eurostat'],
    temporalCoverage: '2010/2025',
    dateModified: '2026-06-20',
    variables: [
      { name: 'Výnos pšenice', unitText: 't/ha' },
      { name: 'Stavy skotu', unitText: 'tis. ks' },
    ],
    sources: [{ name: 'Eurostat', url: 'https://ec.europa.eu/eurostat' }, { name: 'World Bank' }],
  };

  it('vytvoří validní Dataset node s absolutní URL', () => {
    const s = datasetSchema(base) as any;
    expect(s['@type']).toBe('Dataset');
    expect(s['@context']).toBe('https://schema.org');
    expect(s.url).toBe('https://agro-svet.cz/svet/spanelsko/');
    expect(s.isAccessibleForFree).toBe(true);
    expect(s.inLanguage).toBe('cs-CZ');
    expect(s.spatialCoverage).toEqual({ '@type': 'Place', name: 'Španělsko' });
    expect(s.publisher).toEqual({ '@id': 'https://agro-svet.cz/#organization' });
  });

  it('mapuje proměnné na PropertyValue s jednotkou', () => {
    const s = datasetSchema(base) as any;
    expect(s.variableMeasured).toHaveLength(2);
    expect(s.variableMeasured[0]).toEqual({ '@type': 'PropertyValue', name: 'Výnos pšenice', unitText: 't/ha' });
  });

  it('mapuje zdroje na creator Organization; url volitelná', () => {
    const s = datasetSchema(base) as any;
    expect(s.creator).toHaveLength(2);
    expect(s.creator[0]).toEqual({ '@type': 'Organization', name: 'Eurostat', url: 'https://ec.europa.eu/eurostat' });
    expect(s.creator[1]).toEqual({ '@type': 'Organization', name: 'World Bank' });
  });

  it('vynechá volitelná pole když chybí', () => {
    const s = datasetSchema({ name: 'X', description: 'Y', url: '/svet/x/', countryName: 'X' }) as any;
    expect(s.keywords).toBeUndefined();
    expect(s.variableMeasured).toBeUndefined();
    expect(s.creator).toBeUndefined();
    expect(s.temporalCoverage).toBeUndefined();
  });
});

describe('breadcrumbSchema (svet použití)', () => {
  it('pořadí + absolutní URL', () => {
    const b = breadcrumbSchema([
      { name: 'Domů', url: '/' },
      { name: 'Zemědělství ve světě', url: '/svet/' },
      { name: 'Španělsko', url: '/svet/spanelsko/' },
    ]) as any;
    expect(b.itemListElement).toHaveLength(3);
    expect(b.itemListElement[2].position).toBe(3);
    expect(b.itemListElement[1].item).toBe('https://agro-svet.cz/svet/');
  });
});
