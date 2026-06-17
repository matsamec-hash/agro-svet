// src/lib/chart-line.ts
// Sdílená čistá SVG matematika liniového grafu (UK data-huby /puda, /statistiky).
export interface ChartSeriesPoint { year: number; value: number; }

export interface LineChartPoint extends ChartSeriesPoint { x: number; y: number; }
export interface LineChart {
  points: LineChartPoint[];
  path: string;
  area: string;
  pad: { l: number; r: number; t: number; b: number };
  w: number; h: number; plotW: number; plotH: number;
}

/** Čistá matematika liniového grafu (w=1200×h=360). */
export function buildLineChart(
  data: ChartSeriesPoint[],
  opts: { max: number; ticks: number[]; min?: number },
): LineChart {
  const min = opts.min ?? 0;
  const w = 1200, h = 360;
  const pad = { l: 50, r: 20, t: 20, b: 30 };
  const plotW = w - pad.l - pad.r;
  const plotH = h - pad.t - pad.b;
  const yearMin = data[0].year;
  const yearSpan = (data.at(-1)!.year - yearMin) || 1;
  const points: LineChartPoint[] = data.map((d) => {
    const x = pad.l + ((d.year - yearMin) / yearSpan) * plotW;
    const y = pad.t + plotH - ((d.value - min) / (opts.max - min)) * plotH;
    return { ...d, x, y };
  });
  const path = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
  const last = points[points.length - 1];
  const first = points[0];
  const area = `${path} L${last.x.toFixed(1)},${(pad.t + plotH).toFixed(1)} L${first.x.toFixed(1)},${(pad.t + plotH).toFixed(1)} Z`;
  return { points, path, area, pad, w, h, plotW, plotH };
}
