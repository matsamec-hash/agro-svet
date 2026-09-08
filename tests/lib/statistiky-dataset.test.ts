import { describe, it, expect } from 'vitest';
import { commodityDataset, temporalCoverageOf } from '../../src/lib/statistiky-dataset';

const SERIES = [
  { name: 'Pšenice', unit: 'Kč/t', data: [{ label: 'Led 2010' }, { label: 'Pro 2026' }] },
  { name: 'Mléko', unit: 'Kč/l', data: [{ label: 'Led 2015' }] },
];

const base = {
  name: 'Ceny zemědělských komodit',
  description: 'Měsíční ceny výrobců.',
  url: '/statistiky/',
  series: SERIES,
  dateModified: '2026-09-01T10:00:00Z',
  csvPath: '/statistiky/komodity.csv',
};

describe('commodityDataset', () => {
  it('vydá Dataset s licencí, zdrojem a stažitelnou distribucí', () => {
    const d = commodityDataset({ ...base, locale: 'cs' }) as Record<string, any>;
    expect(d['@type']).toBe('Dataset');
    expect(d.license).toBe('https://creativecommons.org/licenses/by/4.0/');
    expect(d.usageInfo).toBe('https://agro-svet.cz/data/licence/');
    expect(d.creator[0].name).toBe('Český statistický úřad');
    expect(d.distribution.map((x: any) => x.encodingFormat)).toEqual(['text/csv', 'application/json']);
    expect(d.distribution[0].contentUrl).toBe('https://agro-svet.cz/statistiky/komodity.csv');
  });

  it('temporalCoverage bere nejstarší a nejnovější rok napříč řadami', () => {
    expect(temporalCoverageOf(SERIES)).toBe('2010/2026');
    const d = commodityDataset({ ...base, locale: 'cs' }) as Record<string, any>;
    expect(d.temporalCoverage).toBe('2010/2026');
  });

  it('zvládne i roční labely bez měsíce (sk/pl)', () => {
    expect(temporalCoverageOf([{ name: 'X', unit: 'zł/t', data: [{ label: '2015' }, { label: '2024' }] }])).toBe('2015/2024');
  });

  it('dateModified je jen datum, ne celé ISO razítko', () => {
    const d = commodityDataset({ ...base, locale: 'cs' }) as Record<string, any>;
    expect(d.dateModified).toBe('2026-09-01');
  });

  it('cizí mutace hlásí vlastní jazyk, zemi i statistický úřad', () => {
    const sk = commodityDataset({ ...base, locale: 'sk', url: '/sk/statistiky/' }) as Record<string, any>;
    expect(sk.inLanguage).toBe('sk-SK');
    expect(sk.spatialCoverage.name).toBe('Slovensko');
    expect(sk.creator.map((c: any) => c.name)).toContain('Eurostat');
    // Slovenské CSV zatím neexistuje — nesmíme na něj odkazovat.
    expect(sk.distribution.map((x: any) => x.encodingFormat)).toEqual(['application/json']);
    expect(sk.distribution[0].contentUrl).toContain('commodity-data-sk.json');

    const pl = commodityDataset({ ...base, locale: 'pl', url: '/pl/statistiky/' }) as Record<string, any>;
    expect(pl.spatialCoverage.name).toBe('Polsko');
    expect(pl.creator[0].name).toBe('Główny Urząd Statystyczny');
  });

  it('ukrajinská mutace jsou česká data ukrajinsky — jazyk uk, země Česko', () => {
    const uk = commodityDataset({ ...base, locale: 'uk', url: '/uk/statistiky/' }) as Record<string, any>;
    expect(uk.inLanguage).toBe('uk-UA');
    expect(uk.spatialCoverage.name).toBe('Česko');
  });

  it('variableMeasured nese jednotku každé řady', () => {
    const d = commodityDataset({ ...base, locale: 'cs' }) as Record<string, any>;
    expect(d.variableMeasured).toContainEqual({ '@type': 'PropertyValue', name: 'Mléko', unitText: 'Kč/l' });
  });
});
