import { describe, it, expect } from 'vitest';
import { metricStat, rankOf, convert, unitOf, colorScale, METRIC_DEFS, type Row } from './map';

const rows: Row[] = [
  { code: 'CZ', cap: 260 },
  { code: 'NL', cap: 430 },
  { code: 'UA', cap: null },
];
const cap = METRIC_DEFS.find((m) => m.key === 'cap')!;
const size = METRIC_DEFS.find((m) => m.key === 'size')!;

describe('metricStat', () => {
  it('ignoruje null a počítá min/max/avg', () => {
    const s = metricStat(rows, 'cap');
    expect(s.min).toBe(260);
    expect(s.max).toBe(430);
    expect(Math.round(s.avg)).toBe(345);
  });
});

describe('rankOf', () => {
  it('řadí sestupně, přeskakuje null', () => {
    expect(rankOf(rows, 'cap', 'NL')).toEqual([1, 2]);
    expect(rankOf(rows, 'cap', 'CZ')).toEqual([2, 2]);
    expect(rankOf(rows, 'cap', 'UA')).toBeNull();
  });
});

describe('convert', () => {
  it('CZK násobí kurzem u currency metrik, jinak beze změny', () => {
    expect(convert(100, cap, 'czk', 25)).toBe(2500);
    expect(convert(100, size, 'czk', 25)).toBe(100);
    expect(convert(100, cap, 'eur', 25)).toBe(100);
  });
});

describe('unitOf', () => {
  it('mění € na Kč jen v CZK u currency metrik', () => {
    expect(unitOf(cap, 'czk')).toBe('Kč/ha');
    expect(unitOf(cap, 'eur')).toBe('€/ha');
    expect(unitOf(size, 'czk')).toBe('ha');
  });
});

describe('colorScale', () => {
  it('krajní body škály', () => {
    expect(colorScale(0)).toBe('rgb(240,249,236)');
    expect(colorScale(1)).toBe('rgb(0,68,27)');
  });
});
