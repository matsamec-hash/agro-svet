// Rozumné rozsahy podle jednotky — odchytí chyby jednotek/řádů.
const RANGES = {
  't/ha': [0.1, 20],
  'mil. ha': [0, 500],
  'mld €': [0, 2000],
  '1000 ks': [0, 5_000_000],
  '%': [0, 100],
  'kg/ha': [0, 1000],
};

/** Vrátí pole textových problémů (prázdné = OK). */
export function sanityCheck(indicator) {
  const problems = [];
  const { latest, series, unit, key } = indicator;
  const range = RANGES[unit];
  if (range && (latest.value < range[0] || latest.value > range[1])) {
    problems.push(`${key}: latest.value ${latest.value} ${unit} mimo rozumný rozsah ${range[0]}–${range[1]}`);
  }
  const lastInSeries = series[series.length - 1];
  if (lastInSeries && Math.abs(lastInSeries.value - latest.value) > Math.abs(latest.value) * 0.001 + 1e-9) {
    problems.push(`${key}: latest.value (${latest.value}) ≠ poslední bod series (${lastInSeries.value})`);
  }
  return problems;
}
