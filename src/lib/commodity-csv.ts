// CSV export cenových řad komodit. Stažitelný soubor je to, co dělá ze
// „stránky s grafem" datovou sadu: Google Dataset Search i AI asistenti berou
// Dataset s `distribution` vážněji než pouhý HTML graf, a čtenář si data
// odnese do Excelu místo opisování z obrázku.

export interface CommoditySeries {
  name: string;
  unit: string;
  data: Array<{ label: string; value: number }>;
}

const HEADER = ['komodita', 'obdobi', 'jednotka', 'hodnota'];

function csvCell(v: string | number): string {
  const s = String(v);
  return /[",;\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

/**
 * Dlouhý (tidy) formát — jeden řádek = jedno měření. Zvládne libovolný počet
 * komodit s různě dlouhými řadami, na rozdíl od široké tabulky, kde by chybějící
 * měsíce dělaly díry.
 *
 * Oddělovač je STŘEDNÍK, ne čárka: český Excel otevírá čárkové CSV jako jeden
 * sloupec. BOM na začátku ze stejného důvodu — bez něj Excel rozbije diakritiku.
 */
export function commodityCsv(series: CommoditySeries[]): string {
  const lines = [HEADER.join(';')];
  for (const s of series) {
    for (const point of s.data) {
      lines.push([s.name, point.label, s.unit, point.value].map(csvCell).join(';'));
    }
  }
  return `﻿${lines.join('\n')}\n`;
}

export const CSV_HEADERS = {
  'content-type': 'text/csv; charset=utf-8',
  // Řady se obnovují měsíčně (`npm run stats:refresh`); deploy purge invaliduje hned.
  'cache-control': 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800',
} as const;
