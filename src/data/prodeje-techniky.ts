// Datový model sekce „Prodeje zemědělské techniky" (/data/prodeje-techniky/).
// ‼️ ZÁSADA: jen REÁLNÁ, publikovaná a citovaná čísla registrací. Kde údaj není ověřený,
// hodnota je null a v UI se zobrazí „—" (nikdy nedopisovat odhady jako fakt).
// approx: true = hodnota dopočtená z publikované meziroční změny (ne přímo uvedené číslo).

export interface Zdroj {
  label: string;
  url: string;
}

export interface RokRegistrace {
  rok: number;
  /** Počet nově registrovaných zemědělských traktorů. null = zatím neověřeno. */
  traktory: number | null;
  /** true = dopočet z publikované % změny, ne přímo uvedené číslo. */
  approx?: boolean;
}

export interface ZnackaPodil {
  znacka: string;
  podil?: number; // % market share
  kusy?: number;
  rok: number;
}

export interface Zeme {
  kod: string; // ISO-ish slug
  nazev: string;
  vlajka: string;
  urad: string; // registrační autorita
  roky: RokRegistrace[];
  znacky?: ZnackaPodil[]; // pořadí značek (nejnovější dostupný rok)
  znackyRok?: number;
  zdroje: Zdroj[];
  poznamka?: string;
}

// ── Nové registrace zemědělských traktorů (ověřená publikovaná data) ──────────
export const ZEME: Zeme[] = [
  {
    kod: 'eu',
    nazev: 'Evropa (CEMA)',
    vlajka: '🇪🇺',
    urad: 'CEMA — European Agricultural Machinery',
    roky: [
      { rok: 2022, traktory: null },
      { rok: 2023, traktory: 157100, approx: true },
      { rok: 2024, traktory: 144400 },
    ],
    zdroje: [
      { label: 'CEMA — European tractor registrations at 10-year low in 2024 (04/2025)', url: 'https://www.cema-agri.org/publication/news/1093-european-tractor-registrations-at-10-year-low-in-2024-1' },
    ],
    poznamka: 'CEMA za rok 2024 uvádí 144 400 zemědělských traktorů (z 204 500 registrovaných traktorů celkem), −8,1 % r/r a nejnižší počet od roku 2014. Údaj za 2023 je dopočten z uvedené meziroční změny.',
  },
  {
    kod: 'de',
    nazev: 'Německo',
    vlajka: '🇩🇪',
    urad: 'VDMA / KBA',
    roky: [
      { rok: 2022, traktory: null },
      { rok: 2023, traktory: 30345 },
      { rok: 2024, traktory: 29291 },
    ],
    znacky: [
      { znacka: 'Fendt', podil: 25.2, kusy: 7394, rok: 2024 },
      { znacka: 'John Deere', rok: 2024 },
      { znacka: 'Deutz-Fahr', rok: 2024 },
      { znacka: 'Claas', rok: 2024 },
      { znacka: 'New Holland', rok: 2024 },
    ],
    znackyRok: 2024,
    zdroje: [
      { label: 'top agrar — Traktor-Zulassungen 2024 (VDMA)', url: 'https://www.topagrar.com/technik/news/traktor-zulassungen-2024-weniger-traktoren-gekauft-fendt-fuehrt-a-20010672.html' },
    ],
    poznamka: '2024: 29 291 traktorů (−3,4 %). Trhu dlouhodobě dominuje Fendt — v 2024 s 7 394 kusy a podílem 25,2 %.',
  },
  {
    kod: 'fr',
    nazev: 'Francie',
    vlajka: '🇫🇷',
    urad: 'AXEMA',
    roky: [
      { rok: 2022, traktory: null },
      { rok: 2023, traktory: 29485, approx: true },
      { rok: 2024, traktory: 26507 },
    ],
    zdroje: [
      { label: 'Terre-net — Immatriculations de tracteurs −10,1 % en 2024 (AXEMA)', url: 'https://www.terre-net.fr/parts-de-marche-tracteurs/article/877017/les-immatriculations-de-tracteurs-ont-devisse-de-10-1-en-2024' },
    ],
    poznamka: '2024: 26 507 traktorů (standardní + vinařské/sadové), −10,1 % r/r. Údaj za 2023 dopočten z meziroční změny.',
  },
  {
    kod: 'it',
    nazev: 'Itálie',
    vlajka: '🇮🇹',
    urad: 'FederUnacoma',
    roky: [
      { rok: 2022, traktory: null },
      { rok: 2023, traktory: 17613 },
      { rok: 2024, traktory: 15448 },
    ],
    zdroje: [
      { label: 'FederUnacoma — Immatricolazioni macchine agricole 2024', url: 'https://www.federunacoma.it/it/Immatricolazioni-macchine-agricole-in-Italia-nel-2024/n14716' },
    ],
    poznamka: '2024: 15 448 traktorů (−12,3 %) — nejhorší výsledek od roku 1952. Kombajny: 266 ks (−31,8 %, z 390 v 2023).',
  },
  {
    kod: 'pl',
    nazev: 'Polsko',
    vlajka: '🇵🇱',
    urad: 'PIGMiUR / CEPiK',
    roky: [
      { rok: 2022, traktory: null },
      { rok: 2023, traktory: 10278 },
      { rok: 2024, traktory: 8537 },
    ],
    znacky: [
      { znacka: 'John Deere', podil: 14.3, rok: 2024 },
      { znacka: 'Kubota', podil: 12.5, rok: 2024 },
      { znacka: 'New Holland', podil: 12.3, rok: 2024 },
      { znacka: 'Deutz-Fahr', podil: 8.7, rok: 2024 },
      { znacka: 'Case IH', podil: 7.6, rok: 2024 },
    ],
    znackyRok: 2024,
    zdroje: [
      { label: 'farmer.pl — Spadek sprzedaży ciągników 2024', url: 'https://www.farmer.pl/technika-rolnicza/maszyny-rolnicze/niemal-17-proc-spadek-sprzedazy-ciagnikow-w-2024-r,156816.html' },
      { label: 'Wieści Rolnicze — Najpopularniejsze marki 2024', url: 'https://wiescirolnicze.pl/ciagniki/najpopularniejsze-marki-ciagnikow-od-poczatku-2024-w-polsce/' },
    ],
    poznamka: '2024: 8 537 traktorů (−16,8 %). Nejsilnější značka John Deere (14,3 %), následují Kubota a New Holland. Nejprodávanější model 2023: John Deere 6155M.',
  },
  {
    kod: 'uk',
    nazev: 'Spojené království',
    vlajka: '🇬🇧',
    urad: 'AEA (Agricultural Engineers Association)',
    roky: [
      { rok: 2022, traktory: null },
      { rok: 2023, traktory: 11771, approx: true },
      { rok: 2024, traktory: 10241 },
    ],
    zdroje: [
      { label: 'AEA — UK Agricultural Tractor Registrations December 2024', url: 'https://aea.uk.com/news/uk-agricultural-tractor-registrations-december-2024/' },
    ],
    poznamka: '2024: 10 241 traktorů nad 50 koní (−13 %) — nejnižší počet od roku 1998. Průměrný výkon vzrostl na 179,7 koní. Údaj za 2023 dopočten z meziroční změny.',
  },
  {
    kod: 'cz',
    nazev: 'Česko',
    vlajka: '🇨🇿',
    urad: 'SDA (Svaz dovozců automobilů)',
    roky: [
      { rok: 2022, traktory: 6276 },
      { rok: 2023, traktory: 5954 },
      { rok: 2024, traktory: null },
    ],
    znacky: [
      { znacka: 'John Deere', podil: 25, rok: 2023 },
      { znacka: 'Case IH', rok: 2023 },
      { znacka: 'New Holland', rok: 2023 },
      { znacka: 'Fendt', rok: 2023 },
      { znacka: 'Deutz-Fahr', rok: 2023 },
    ],
    znackyRok: 2023,
    zdroje: [
      { label: 'SDA / autofoxnews — Registrace traktorů ČR 2023', url: 'https://www.autofoxnews.com/sda-registrace-novych-traktoru-v-cesku-v-roce-2023-klesly-o-51-na-5954-coz-predstavuje-druhy-nejlepsi-vysledek-od-roku-2008-3400-po-rekordnim-roce-2022-6276-za-poslednich-10-15-let-se-trh-FL005201.html' },
      { label: 'Mechanizaceweb — Statistika registrací traktorů v ČR 2023', url: 'https://mechanizaceweb.cz/statistka-registraci-traktoru-v-cr-v-roce-2023/' },
    ],
    poznamka: '2023: 5 954 traktorů (−5,1 %) — druhý nejlepší výsledek od 2008, po rekordním 2022 (6 276). Segmentu nad 50 koní vévodí John Deere (25 %), pod 50 koní indická značka Solis (32 %).',
  },
];

// ── Kombajny (řídká data — jen ověřené) ───────────────────────────────────────
export const KOMBAJNY_ZDROJE: Zdroj[] = [
  { label: 'FederUnacoma — Itálie 2024 (mietitrebbie)', url: 'https://www.federunacoma.it/it/Immatricolazioni-macchine-agricole-in-Italia-nel-2024/n14716' },
];

export interface KombajnRok {
  zeme: string;
  vlajka: string;
  rok: number;
  kusy: number;
  zmena?: string;
}

export const KOMBAJNY: KombajnRok[] = [
  { zeme: 'Itálie', vlajka: '🇮🇹', rok: 2024, kusy: 266, zmena: '−31,8 %' },
  { zeme: 'Itálie', vlajka: '🇮🇹', rok: 2023, kusy: 390 },
];

export const SEKCE_AKTUALIZOVANO = '2026-08-02';
