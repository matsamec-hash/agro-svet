// Pure JSON-stat helpers pro Eurostat SK fetcher. Žádné side-effecty (testovatelné).

/** Stride dimenze = součin velikostí všech NÁSLEDUJÍCÍCH dimenzí (řád dle data.id). */
export function strides(size) {
  const s = new Array(size.length).fill(1);
  for (let i = size.length - 2; i >= 0; i--) s[i] = s[i + 1] * size[i + 1];
  return s;
}

/**
 * Vytáhne časovou řadu z JSON-stat odpovědi pro fixní souřadnice ostatních dimenzí.
 * @param json Eurostat JSON-stat objekt (.id, .size, .dimension, .value)
 * @param fixed { dimId: categoryCode } pro všechny dimenze KROMĚ 'time'
 * @returns [{ time, value }] seřazené dle time labelu (chronologicky), jen body s hodnotou
 */
export function pickSeries(json, fixed) {
  const { id, size, dimension, value } = json;
  const st = strides(size);
  const timePos = id.indexOf('time');
  if (timePos === -1) return [];
  const timeCat = dimension.time.category;
  const timeIndex = timeCat.index;
  const timeLabel = timeCat.label ?? {};

  // Bázový offset z fixních dimenzí
  let base = 0;
  for (let i = 0; i < id.length; i++) {
    const dim = id[i];
    if (dim === 'time') continue;
    const code = fixed[dim];
    const ci = dimension[dim]?.category?.index?.[code];
    if (ci === undefined) return []; // požadovaný kód v datasetu chybí
    base += ci * st[i];
  }

  const out = [];
  for (const [code, ti] of Object.entries(timeIndex)) {
    const flat = base + ti * st[timePos];
    const v = value?.[String(flat)];
    if (v === undefined || v === null) continue;
    out.push({ time: timeLabel[code] ?? code, value: v });
  }
  out.sort((a, b) => a.time.localeCompare(b.time));
  return out;
}

/** Vrátí % meziroční změnu posledních dvou bodů řady, nebo null. */
export function yoyChange(series) {
  if (series.length < 2) return null;
  const last = series[series.length - 1];
  const prev = series[series.length - 2];
  if (!prev.value) return null;
  return Math.round((last.value / prev.value - 1) * 1000) / 10;
}
