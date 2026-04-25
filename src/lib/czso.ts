// CZSO DataStat API — Czech Statistical Office
// Free, no auth, CSV format
// Docs: https://csu.gov.cz/zakladni-informace-pro-pouziti-api-datastatu

const BASE = 'https://data.csu.gov.cz/api/dotaz/v1/data/vybery';

function parseCSV(csv: string): string[][] {
  const lines = csv.trim().split('\n');
  return lines.map(line => {
    const cols: string[] = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') { inQuotes = !inQuotes; continue; }
      if (ch === ',' && !inQuotes) { cols.push(current.trim()); current = ''; continue; }
      current += ch;
    }
    cols.push(current.trim());
    return cols;
  });
}

async function fetchSelection(code: string): Promise<string[][]> {
  const res = await fetch(`${BASE}/${code}?format=CSV`);
  if (!res.ok) throw new Error(`CZSO ${code}: ${res.status}`);
  const csv = await res.text();
  const rows = parseCSV(csv);
  return rows.slice(1); // skip header
}

// ── Commodity Prices (monthly, CZK) ──
export interface CommodityPrice {
  name: string;
  unit: string;
  month: string;
  price: number;
}

const COMMODITY_MAP: Record<string, string> = {
  'Pšenice potravinářská [t]': 'Pšenice',
  'Ječmen sladovnický [t]': 'Ječmen',
  'Semeno řepky olejné [t]': 'Řepka',
  'Kukuřice krmná [t]': 'Kukuřice',
  'Mléko kravské Q. tř. j. [tis. l.]': 'Mléko',
  'Prasata jatečná v živém [t]': 'Vepřové',
  'Býci jateční v živém [t]': 'Hovězí',
  'Vejce slepičí konzumní tříděná [tis. ks]': 'Vejce',
  'Semeno máku [t]': 'Mák',
};

export async function getCommodityPrices(): Promise<CommodityPrice[]> {
  const rows = await fetchSelection('CEN0203BT02');
  const items: CommodityPrice[] = [];
  for (const row of rows) {
    // cols: Ukazatel, Stát, Kraj, Reprezentant, Měsíce, Hodnota
    if (row[1] !== 'Česko' || row[2] !== '') continue;
    const repr = row[3];
    const name = COMMODITY_MAP[repr];
    if (!name) continue;
    const val = parseFloat(row[5]);
    if (isNaN(val)) continue;
    const unit = repr.includes('[tis. l.]') ? 'Kč/tis. l' : 'Kč/t';
    items.push({ name, unit, month: row[4], price: val });
  }
  return items;
}

// Get latest price + YoY change for each commodity
export interface CommodityStat {
  name: string;
  unit: string;
  price: number;
  month: string;
  prevYearPrice: number | null;
  change: number | null; // percent
}

export async function getCommodityStats(): Promise<CommodityStat[]> {
  const all = await getCommodityPrices();
  const byName = new Map<string, CommodityPrice[]>();
  for (const p of all) {
    if (!byName.has(p.name)) byName.set(p.name, []);
    byName.get(p.name)!.push(p);
  }

  const MONTH_ORDER = ['leden','únor','březen','duben','květen','červen','červenec','srpen','září','říjen','listopad','prosinec'];

  function parseMonth(m: string): { month: number; year: number } | null {
    const parts = m.trim().split(' ');
    if (parts.length < 2) return null;
    const monthName = parts[0].toLowerCase();
    const year = parseInt(parts[1]);
    const idx = MONTH_ORDER.indexOf(monthName);
    if (idx === -1 || isNaN(year)) return null;
    return { month: idx, year };
  }

  const results: CommodityStat[] = [];
  const order = ['Pšenice','Ječmen','Řepka','Kukuřice','Mléko','Vepřové','Hovězí','Vejce','Mák'];

  for (const name of order) {
    const prices = byName.get(name);
    if (!prices || prices.length === 0) continue;

    // Sort by date descending
    prices.sort((a, b) => {
      const pa = parseMonth(a.month);
      const pb = parseMonth(b.month);
      if (!pa || !pb) return 0;
      return pb.year * 12 + pb.month - (pa.year * 12 + pa.month);
    });

    const latest = prices[0];
    const latestDate = parseMonth(latest.month);

    // Find same month previous year
    let prevYearPrice: number | null = null;
    if (latestDate) {
      const prev = prices.find(p => {
        const d = parseMonth(p.month);
        return d && d.month === latestDate.month && d.year === latestDate.year - 1;
      });
      if (prev) prevYearPrice = prev.price;
    }

    results.push({
      name,
      unit: latest.unit,
      price: latest.price,
      month: latest.month,
      prevYearPrice,
      change: prevYearPrice ? Math.round((latest.price / prevYearPrice - 1) * 1000) / 10 : null,
    });
  }

  return results;
}

// ── Fuel Prices (weekly, CZK/l) ──
export interface FuelPrice {
  fuel: string;
  week: string;
  price: number;
}

export async function getFuelPrices(): Promise<FuelPrice[]> {
  const rows = await fetchSelection('CENPHMTT01');
  const items: FuelPrice[] = [];
  for (const row of rows) {
    if (row[0] !== 'Průměrná cena pohonných hmot (Kč/litr)') continue;
    const val = parseFloat(row[4]);
    if (isNaN(val)) continue;
    let fuel = row[3];
    if (fuel.includes('Natural 95')) fuel = 'Natural 95';
    else if (fuel.includes('nafta')) fuel = 'Nafta';
    else if (fuel === 'LPG') fuel = 'LPG';
    else continue;
    items.push({ fuel, week: row[2].trim(), price: val });
  }
  return items;
}

export interface FuelStat {
  fuel: string;
  price: number;
  week: string;
}

export async function getLatestFuelPrices(): Promise<FuelStat[]> {
  const all = await getFuelPrices();

  function weekSort(w: string): number {
    const m = w.match(/(\d+)\.\s*týden\s+(\d+)/);
    if (!m) return 0;
    return parseInt(m[2]) * 100 + parseInt(m[1]);
  }

  all.sort((a, b) => weekSort(b.week) - weekSort(a.week));
  const seen = new Set<string>();
  const results: FuelStat[] = [];
  for (const f of all) {
    if (seen.has(f.fuel)) continue;
    seen.add(f.fuel);
    results.push({ fuel: f.fuel, price: f.price, week: f.week });
  }
  return results;
}

// ── Livestock Numbers ──
export interface LivestockStat {
  animal: string;
  count: number;
  date: string;
}

export async function getLivestockStats(): Promise<LivestockStat[]> {
  const rows = await fetchSelection('WZEM02AT01');
  const items: LivestockStat[] = [];
  for (const row of rows) {
    if (row[1] !== 'Česko') continue;
    const val = parseFloat(row[3]);
    if (isNaN(val)) continue;
    let animal = '';
    if (row[0].includes('turů')) animal = 'Skot';
    else if (row[0].includes('prasat')) animal = 'Prasata';
    else continue;
    items.push({ animal, count: Math.round(val), date: row[2] });
  }
  // Return latest 2 per animal
  const result: LivestockStat[] = [];
  for (const a of ['Skot', 'Prasata']) {
    const filtered = items.filter(i => i.animal === a);
    result.push(...filtered.slice(-2));
  }
  return result;
}

// Plná historie stavů zvířat (skot, prasata) — bez truncace, pro slope chart.
export async function getLivestockHistorical(): Promise<LivestockStat[]> {
  const rows = await fetchSelection('WZEM02AT01');
  const items: LivestockStat[] = [];
  for (const row of rows) {
    if (row[1] !== 'Česko') continue;
    const val = parseFloat(row[3]);
    if (isNaN(val)) continue;
    let animal = '';
    if (row[0].includes('turů')) animal = 'Skot';
    else if (row[0].includes('prasat')) animal = 'Prasata';
    else continue;
    items.push({ animal, count: Math.round(val), date: row[2] });
  }
  return items;
}

// ── Crop Production (tonnes) ──
export interface CropProduction {
  crop: string;
  year: string;
  tonnes: number;
}

export async function getCropProduction(): Promise<CropProduction[]> {
  const rows = await fetchSelection('WZEM03AT01');
  const CROPS = ['Pšenice', 'Ječmen', 'Řepka', 'Kukuřice na zeleno', 'Řepa cukrová', 'Brambory'];
  const items: CropProduction[] = [];
  for (const row of rows) {
    if (row[2] !== 'Česko' || row[3] !== '') continue;
    const crop = row[4].trim();
    if (!CROPS.includes(crop)) continue;
    const val = parseFloat(row[5]);
    if (isNaN(val)) continue;
    items.push({ crop, year: row[1], tonnes: Math.round(val) });
  }
  return items;
}

// ── Crop Areas (hectares) ──
export interface CropArea {
  crop: string;
  year: string;
  hectares: number;
}

export async function getCropAreas(): Promise<CropArea[]> {
  const rows = await fetchSelection('ZEM03CT01');
  const CROPS_MAP: Record<string, string> = {
    'Osevní plocha celkem': 'Celkem',
    '- Obiloviny celkem': 'Obiloviny',
    '- Pšenice': 'Pšenice',
    '- Ječmen': 'Ječmen',
    '- Řepka': 'Řepka',
    '- Kukuřice na zrno': 'Kukuřice',
  };
  const items: CropArea[] = [];
  for (const row of rows) {
    if (row[1] !== 'Česko') continue;
    const rawCrop = row[2].trim();
    const crop = CROPS_MAP[rawCrop];
    if (!crop) continue;
    const val = parseFloat(row[4]);
    if (isNaN(val)) continue;
    items.push({ crop, year: row[3], hectares: Math.round(val) });
  }
  return items;
}

// ── Fertilizer Prices (annual, CZK/t) ──
export interface FertilizerPrice {
  name: string;
  year: string;
  price: number;
}

export async function getFertilizerPrices(): Promise<FertilizerPrice[]> {
  const rows = await fetchSelection('CEN0203ET03');
  const FERT_MAP: Record<string, string> = {
    'Průmyslová hnojiva - ledek amonný s vápencem 27% [t]': 'Ledek amonný 27%',
    'Průmyslová hnojiva - močovina [t]': 'Močovina',
    'Průmyslová hnojiva - DAM 390 [t]': 'DAM 390',
    'Průmyslová hnojiva - NPK(15:15:15) [t]': 'NPK 15-15-15',
    'Průmyslová hnojiva - amofos [t]': 'Amofos',
    'Průmyslová hnojiva - síran amonný 21% [t]': 'Síran amonný 21%',
  };
  const items: FertilizerPrice[] = [];
  for (const row of rows) {
    if (row[1] !== 'Česko') continue;
    const name = FERT_MAP[row[2]];
    if (!name) continue;
    const val = parseFloat(row[4]);
    if (isNaN(val)) continue;
    items.push({ name, year: row[3], price: Math.round(val) });
  }
  return items;
}

// ── Regional crop data (per kraj) ──

const REGION_NAMES = [
  'Hlavní město Praha','Středočeský kraj','Jihočeský kraj','Plzeňský kraj',
  'Karlovarský kraj','Ústecký kraj','Liberecký kraj','Královéhradecký kraj',
  'Pardubický kraj','Kraj Vysočina','Jihomoravský kraj','Olomoucký kraj',
  'Zlínský kraj','Moravskoslezský kraj',
];

export interface RegionCrop {
  region: string;
  crop: string;
  year: string;
  tonnes: number;
}

export async function getRegionalCropData(): Promise<RegionCrop[]> {
  const rows = await fetchSelection('WZEM03AT01');
  const CROPS = ['Obiloviny na zrno','Pšenice','Ječmen','Řepka','Brambory','Řepa cukrová','Kukuřice na zeleno'];
  const items: RegionCrop[] = [];
  for (const row of rows) {
    if (row[2] !== 'Česko') continue;
    const region = row[3];
    if (!region || !REGION_NAMES.includes(region)) continue;
    const crop = row[4].trim();
    if (!CROPS.includes(crop)) continue;
    const val = parseFloat(row[5]);
    if (isNaN(val)) continue;
    items.push({ region, crop, year: row[1], tonnes: Math.round(val) });
  }
  return items;
}

// ── Time series for charts ──

const MONTH_LABELS = ['leden','únor','březen','duben','květen','červen','červenec','srpen','září','říjen','listopad','prosinec'];
const MONTH_SHORT = ['Led','Úno','Bře','Dub','Kvě','Čvn','Čvc','Srp','Zář','Říj','Lis','Pro'];

function parseMonthStr(m: string): { month: number; year: number } | null {
  const parts = m.trim().split(' ');
  if (parts.length < 2) return null;
  const idx = MONTH_LABELS.indexOf(parts[0].toLowerCase());
  const year = parseInt(parts[1]);
  if (idx === -1 || isNaN(year)) return null;
  return { month: idx, year };
}

export interface TimeSeriesPoint {
  label: string;
  value: number;
  sortKey: number;
}

export interface CommodityTimeSeries {
  name: string;
  unit: string;
  data: TimeSeriesPoint[];
}

export async function getCommodityTimeSeries(months = 12): Promise<CommodityTimeSeries[]> {
  const all = await getCommodityPrices();
  const byName = new Map<string, CommodityPrice[]>();
  for (const p of all) {
    if (!byName.has(p.name)) byName.set(p.name, []);
    byName.get(p.name)!.push(p);
  }

  const chartCommodities = ['Pšenice', 'Ječmen', 'Řepka', 'Kukuřice'];
  const results: CommodityTimeSeries[] = [];

  for (const name of chartCommodities) {
    const prices = byName.get(name);
    if (!prices) continue;
    const sorted = prices
      .map(p => {
        const d = parseMonthStr(p.month);
        if (!d) return null;
        return { label: `${MONTH_SHORT[d.month]} ${d.year}`, value: p.price, sortKey: d.year * 12 + d.month };
      })
      .filter(Boolean) as TimeSeriesPoint[];
    sorted.sort((a, b) => a.sortKey - b.sortKey);
    results.push({ name, unit: 'Kč/t', data: sorted.slice(-months) });
  }
  return results;
}

export async function getFuelTimeSeries(weeks = 52): Promise<TimeSeriesPoint[]> {
  const all = await getFuelPrices();
  const nafta = all.filter(f => f.fuel === 'Nafta');

  function weekSort(w: string): number {
    const m = w.match(/(\d+)\.\s*týden\s+(\d+)/);
    if (!m) return 0;
    return parseInt(m[2]) * 100 + parseInt(m[1]);
  }

  const sorted = nafta
    .map(f => ({ label: f.week.replace(/\s*týden\s*/, '/'), value: f.price, sortKey: weekSort(f.week) }))
    .sort((a, b) => a.sortKey - b.sortKey);
  return sorted.slice(-weeks);
}

export interface FertilizerTimeSeries {
  name: string;
  data: { year: string; price: number }[];
}

export async function getFertilizerTimeSeries(): Promise<FertilizerTimeSeries[]> {
  const all = await getFertilizerPrices();
  const byName = new Map<string, { year: string; price: number }[]>();
  for (const f of all) {
    if (!byName.has(f.name)) byName.set(f.name, []);
    byName.get(f.name)!.push({ year: f.year, price: f.price });
  }
  const results: FertilizerTimeSeries[] = [];
  for (const [name, data] of byName) {
    data.sort((a, b) => parseInt(a.year) - parseInt(b.year));
    results.push({ name, data });
  }
  return results;
}

// Vrací full historii pro všech 9 komodit z COMMODITY_MAP. Použito pro long-term annotated graf.
export async function getCommodityFullSeries(): Promise<CommodityTimeSeries[]> {
  const all = await getCommodityPrices();
  const byName = new Map<string, CommodityPrice[]>();
  for (const p of all) {
    if (!byName.has(p.name)) byName.set(p.name, []);
    byName.get(p.name)!.push(p);
  }

  const ALL_NAMES = ['Pšenice','Ječmen','Řepka','Kukuřice','Mléko','Vepřové','Hovězí','Vejce','Mák'];
  const results: CommodityTimeSeries[] = [];

  for (const name of ALL_NAMES) {
    const prices = byName.get(name);
    if (!prices || prices.length === 0) continue;
    const sorted = prices
      .map(p => {
        const d = parseMonthStr(p.month);
        if (!d) return null;
        return { label: `${MONTH_SHORT[d.month]} ${d.year}`, value: p.price, sortKey: d.year * 12 + d.month };
      })
      .filter(Boolean) as TimeSeriesPoint[];
    sorted.sort((a, b) => a.sortKey - b.sortKey);
    const unit = prices[0].unit;
    results.push({ name, unit, data: sorted });
  }
  return results;
}
