// scripts/lib/puda-sk.mjs
// Pure transform helpery pro SK /puda fetcher. Žádné side-effecty (testovatelné).

/** Z pickSeries výstupu [{time,value}] udělá [{year:Number,value}]. */
function toYearSeries(series) {
  return series.map((p) => ({ year: parseInt(p.time), value: p.value }));
}

/**
 * Sestaví payload pro agro-puda-sk.json.
 * @param cena   pickSeries výstup apri_lprc ARAXIB EUR_HA (2017+)
 * @param najem  pickSeries výstup apri_lrnt ARA_J0000 EUR_HA
 * @param plodiny [{crop, year, hectares}] (více let; vybere se nejnovější)
 * @param generated ISO timestamp
 */
export function buildPudaPayload({ cena, najem, plodiny, generated }) {
  // plodiny: vybrat nejnovější rok, seřadit sestupně dle hectares
  let plodinyOut = [];
  if (plodiny.length) {
    const latestYear = plodiny.reduce((max, p) => (p.year > max ? p.year : max), plodiny[0].year);
    plodinyOut = plodiny
      .filter((p) => p.year === latestYear)
      .map((p) => ({ crop: p.crop, hectares: p.hectares }))
      .sort((a, b) => b.hectares - a.hectares);
  }
  return {
    generated,
    cena: { unit: 'EUR/ha', agriprod: 'ARAXIB', series: toYearSeries(cena) },
    najem: { unit: 'EUR/ha/rok', agriprod: 'ARA_J0000', series: toYearSeries(najem) },
    plodiny: plodinyOut,
  };
}
