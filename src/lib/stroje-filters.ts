import type { StrojKategorie } from './stroje';

export type FilterSpec = {
  key: string;
  label: string;
  type: 'number_range' | 'enum' | 'boolean';
  options?: { value: string; label: string }[];
  unit?: string;
  source: 'top' | 'specs';
};

export const SUBCATEGORY_FILTERS: Partial<Record<StrojKategorie, FilterSpec[]>> = {
  pluhy: [
    { key: 'pocet_radlic', label: 'Počet radlic', type: 'number_range', source: 'specs' },
    { key: 'otocny', label: 'Otočný', type: 'boolean', source: 'specs' },
    { key: 'pracovni_zaber_m', label: 'Pracovní záběr (m)', type: 'number_range', unit: 'm', source: 'top' },
  ],
  'lisy-valcove': [
    { key: 'typ_komory', label: 'Typ komory', type: 'enum', options: [
      { value: 'variabilní', label: 'Variabilní' },
      { value: 'pevná', label: 'Pevná' },
    ], source: 'specs' },
    { key: 'balic_integrovany', label: 'Integrovaný balič', type: 'boolean', source: 'specs' },
    { key: 'prumer_baliku_cm', label: 'Průměr balíku (cm)', type: 'number_range', unit: 'cm', source: 'specs' },
  ],
  'lisy-hranolove': [
    { key: 'rozmer_baliku_cm', label: 'Rozměr balíku', type: 'enum', options: [
      { value: '80x90', label: '80×90 cm' },
      { value: '120x90', label: '120×90 cm' },
      { value: '120x130', label: '120×130 cm' },
    ], source: 'specs' },
  ],
  teleskopy: [
    { key: 'nosnost_kg', label: 'Nosnost (kg)', type: 'number_range', unit: 'kg', source: 'specs' },
    { key: 'vyska_zdvihu_m', label: 'Výška zdvihu (m)', type: 'number_range', unit: 'm', source: 'specs' },
    { key: 'dosah_m', label: 'Dosah (m)', type: 'number_range', unit: 'm', source: 'specs' },
  ],
  'celni-nakladace': [
    { key: 'nosnost_kg', label: 'Nosnost (kg)', type: 'number_range', unit: 'kg', source: 'specs' },
    { key: 'vyska_zdvihu_m', label: 'Výška zdvihu (m)', type: 'number_range', unit: 'm', source: 'specs' },
  ],
  'postrikovace-nesene': [
    { key: 'objem_nadrze_l', label: 'Objem nádrže (l)', type: 'number_range', unit: 'l', source: 'specs' },
    { key: 'zaber_ramen_m', label: 'Záběr ramen (m)', type: 'number_range', unit: 'm', source: 'specs' },
  ],
  'postrikovace-tazene': [
    { key: 'objem_nadrze_l', label: 'Objem nádrže (l)', type: 'number_range', unit: 'l', source: 'specs' },
    { key: 'zaber_ramen_m', label: 'Záběr ramen (m)', type: 'number_range', unit: 'm', source: 'specs' },
  ],
  'postrikovace-samojizdne': [
    { key: 'objem_nadrze_l', label: 'Objem nádrže (l)', type: 'number_range', unit: 'l', source: 'specs' },
    { key: 'zaber_ramen_m', label: 'Záběr ramen (m)', type: 'number_range', unit: 'm', source: 'specs' },
  ],
  'cisterny-kejda': [
    { key: 'objem_l', label: 'Objem (l)', type: 'number_range', unit: 'l', source: 'specs' },
    { key: 'typ_aplikatoru', label: 'Typ aplikátoru', type: 'enum', options: [
      { value: 'botky', label: 'Botky' },
      { value: 'hadicovy', label: 'Hadicový' },
      { value: 'diskovy injektor', label: 'Diskový injektor' },
    ], source: 'specs' },
  ],
  'rozmetadla-mineralni': [
    { key: 'nosnost_kose_kg', label: 'Nosnost koše (kg)', type: 'number_range', unit: 'kg', source: 'specs' },
    { key: 'zaber_aplikace_m', label: 'Záběr aplikace (m)', type: 'number_range', unit: 'm', source: 'specs' },
  ],
  'navesy-sklapeci': [
    { key: 'nosnost_t', label: 'Nosnost (t)', type: 'number_range', unit: 't', source: 'specs' },
    { key: 'objem_korby_m3', label: 'Objem korby (m³)', type: 'number_range', unit: 'm³', source: 'specs' },
    { key: 'pocet_naprav', label: 'Počet náprav', type: 'enum', options: [
      { value: '1', label: '1' }, { value: '2', label: '2' }, { value: '3', label: '3' },
    ], source: 'specs' },
  ],
  'krmne-vozy': [
    { key: 'objem_m3', label: 'Objem (m³)', type: 'number_range', unit: 'm³', source: 'specs' },
    { key: 'pocet_sneku', label: 'Počet šneků', type: 'enum', options: [
      { value: '1', label: '1' }, { value: '2', label: '2' }, { value: '3', label: '3' },
    ], source: 'specs' },
  ],
  'mulcovace': [
    { key: 'zaber_m', label: 'Pracovní záběr (m)', type: 'number_range', unit: 'm', source: 'specs' },
    { key: 'typ_noze', label: 'Typ nože', type: 'enum', options: [
      { value: 'kladivka', label: 'Kladívka' },
      { value: 'cepy', label: 'Cepy' },
      { value: 'noze', label: 'Nože' },
    ], source: 'specs' },
  ],
};

export function getFiltersFor(subcategory: StrojKategorie): FilterSpec[] {
  return SUBCATEGORY_FILTERS[subcategory] ?? [];
}
