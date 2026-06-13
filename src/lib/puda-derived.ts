// src/lib/puda-derived.ts
// Pure derived próza + čísla pro /puda. locale param: 'cs' | 'sk'.
// cs větve = doslovné originály (byte-identita); sk = lokalizováno.

export interface PudaSeriesPoint { year: number; value: number; }
export interface PudaData {
  generated: string;
  cena: { unit: string; agriprod: string; series: PudaSeriesPoint[] };
  najem: { unit: string; agriprod: string; series: PudaSeriesPoint[] };
  plodiny: { crop: string; hectares: number }[];
}

function num(n: number, locale: 'cs' | 'sk'): string {
  return new Intl.NumberFormat(locale === 'sk' ? 'sk-SK' : 'cs-CZ').format(n);
}

export interface PudaBigNumbers {
  cena: number; cenaYear: number;
  najem: number; najemYear: number;
  rustPct: number; rustFrom: number;
}

export function pudaBigNumbers(d: PudaData, _locale: 'cs' | 'sk'): PudaBigNumbers {
  const cs = d.cena.series, ns = d.najem.series;
  const cenaLast = cs.at(-1)!, cenaFirst = cs[0];
  const najemLast = ns.at(-1)!;
  const rustPct = Math.round((cenaLast.value / cenaFirst.value - 1) * 100);
  return {
    cena: cenaLast.value, cenaYear: cenaLast.year,
    najem: najemLast.value, najemYear: najemLast.year,
    rustPct, rustFrom: cenaFirst.year,
  };
}

export function pudaCenaInsight(d: PudaData, locale: 'cs' | 'sk'): string {
  const bn = pudaBigNumbers(d, locale);
  if (locale === 'sk') {
    return `Z ${num(d.cena.series[0].value, locale)} €/ha v roku ${bn.rustFrom} na `
      + `${num(bn.cena, locale)} €/ha v roku ${bn.cenaYear} — rast o ${bn.rustPct} % za sledované obdobie.`;
  }
  return `Z ${num(d.cena.series[0].value, locale)} €/ha na ${num(bn.cena, locale)} €/ha — růst o ${bn.rustPct} %.`;
}
