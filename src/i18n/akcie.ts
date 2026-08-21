// Copy sekce /akcie/ (přehled akcií agro firem + profil firmy).
//
// Sekce byla do 2026-08 čistě česká — natvrdo psané řetězce v šabloně, žádná
// locale větev. Obsah je přitom jurisdikčně neutrální (kurz John Deere je
// v Praze i ve Varšavě stejný), takže na rozdíl od /dotace nebo /kalkulacka
// nejde o „nepřeložitelné", jen se na to nikdy nedošlo.
//
// Locale bez vlastní varianty dostane cs (viz `content` na konci souboru) —
// stejný fallback jako i18n/dotace.ts. Launch řídí LAUNCHED_PREFIXES; dokud
// tam locale není, tenhle soubor se pro něj stejně nepoužije.
import type { Locale } from './config';

export interface AkcieCopy {
  /** Formátování čísel (kurz, kapitalizace) — cs-CZ používá jinou mezeru než pl-PL. */
  numberLocale: string;
  /** Zkratka miliardy v „≈ 51 mld. USD" (cs „mld.“ vs pl „mld“). */
  bln: string;

  // ── společné (hub i detail) ──
  crumbAria: string;
  crumbHome: string;
  crumbData: string;
  crumbAkcie: string;

  // ── hub /akcie/ ──
  metaTitle: string;
  metaDescription: string;
  crumbSelf: string;
  eyebrow: string;
  /** H1 se skládá z `h1` + žlutě zvýrazněného `h1mark`. */
  h1: string;
  h1mark: string;
  lede: string;
  disclaimerStrong: string;
  disclaimerText: string;
  kategorie: Record<'technika' | 'agrochemie' | 'komodity', string>;
  hubNote: string;
  hubCrossSales: string;
  hubCrossSalesNote: string;
  hubCrossCountries: string;
  hubCrossCountriesNote: string;
  hubCrossPrices: string;
  hubCrossData: string;

  // ── detail /akcie/<ticker>/ ──
  /** `{name}` a `{ticker}` se nahradí. */
  detailTitleTpl: string;
  /** `{name}` a `{profil}` se nahradí. */
  detailDescriptionTpl: string;
  detailDisclaimerStrong: string;
  detailDisclaimerText: string;
  metricsTitle: string;
  mCap: string;
  mPe: string;
  mDiv: string;
  mInd: string;
  range52: string;
  chartTitle: string;
  chartRangesAria: string;
  chartLoading: string;
  chartSource: string;
  /** aria-label SVG grafu. */
  chartAria: string;
  /** Přípona za procentem: „+3,4 % za období“. */
  chartPeriodSuffix: string;
  profileTitle: string;
  factHq: string;
  factFounded: string;
  factCeo: string;
  factRevenue: string;
  brandsTitleMulti: string;
  brandsTitleSingle: string;
  brandsLede: string;
  brandsModels: string;
  brandsProfile: string;
  logoAlt: string;
  achievementsTitle: string;
  linksTitle: string;
  linkWeb: string;
  linkCountry: string;
  linkAll: string;
  linkSales: string;
}

const cs: AkcieCopy = {
  numberLocale: 'cs-CZ',
  bln: 'mld.',

  crumbAria: 'Cesta',
  crumbHome: 'Domů',
  crumbData: 'Data',
  crumbAkcie: 'Akcie',

  metaTitle: 'Akcie zemědělských firem — John Deere, Bayer, AGCO a další | agro-svět',
  metaDescription:
    'Přehled akcií firem navázaných na zemědělství — technika (John Deere, AGCO, CNH), agrochemie a osiva (Bayer, BASF, Corteva) i komodity. Profily a burzovní symboly. Není investiční doporučení.',
  crumbSelf: 'Akcie agro firem',
  eyebrow: 'Datová sekce · Trhy',
  h1: 'Akcie zemědělských firem',
  h1mark: 'na burze',
  lede:
    'Kdo stojí za technikou, osivy a hnojivy na vašich polích — a jak si vedou na burze. Přehled veřejně obchodovaných firem z agrosektoru: výrobci strojů, agrochemie i zpracovatelé komodit, z USA i Evropy.',
  disclaimerStrong: '⚠️ Není investiční doporučení.',
  disclaimerText:
    'Tato stránka je informační přehled firem navázaných na zemědělství. Neobsahuje nákupní ani prodejní doporučení. Investice do akcií jsou rizikové; před rozhodnutím se poraďte s licencovaným poradcem. Případné kurzy jsou orientační a zpožděné.',
  kategorie: {
    technika: 'Zemědělská technika',
    agrochemie: 'Agrochemie, osiva a hnojiva',
    komodity: 'Komodity a zpracování',
  },
  hubNote:
    '📈 <strong>Živé denní kurzy</strong> a 3měsíční trendy u každé firmy; klikněte na kartu pro <strong>interaktivní graf</strong> vývoje kurzu a klíčové ukazatele.',
  hubCrossSales: 'Prodeje zemědělské techniky',
  hubCrossSalesNote: 'kolik strojů se prodá po zemích',
  hubCrossCountries: 'Profily zemí',
  hubCrossCountriesNote: 'zemědělství jednotlivých trhů',
  hubCrossPrices: 'Ceny zemědělských komodit',
  hubCrossData: 'Datová sekce agro-svět',

  detailTitleTpl: '{name} ({ticker}) — akcie, kurz a profil firmy | agro-svět',
  detailDescriptionTpl:
    '{name}: kurz akcie, tržní kapitalizace, sídlo, ředitel, obrat a co firma dělá v zemědělství. {profil}',
  detailDisclaimerStrong: '⚠️ Není investiční doporučení.',
  detailDisclaimerText:
    'Informační profil firmy. Kurz a ukazatele jsou orientační a zpožděné (fundamenty Finnhub, graf kurzu Yahoo Finance). Investice do akcií jsou rizikové.',
  metricsTitle: 'Klíčové ukazatele',
  mCap: 'Tržní kapitalizace',
  mPe: 'P/E (TTM)',
  mDiv: 'Dividendový výnos',
  mInd: 'Odvětví',
  range52: '52týdenní rozpětí',
  chartTitle: 'Vývoj kurzu',
  chartRangesAria: 'Období grafu',
  chartLoading: 'Načítám graf…',
  chartSource: 'Zdroj: Yahoo Finance · zpožděno',
  chartAria: 'Graf vývoje kurzu',
  chartPeriodSuffix: ' % za období',
  profileTitle: 'Co firma dělá',
  factHq: 'Centrála',
  factFounded: 'Založeno',
  factCeo: 'Ředitel (CEO)',
  factRevenue: 'Roční obrat',
  brandsTitleMulti: 'Značky této firmy u nás',
  brandsTitleSingle: 'Modely této značky u nás',
  brandsLede: 'Prohlédněte si katalog strojů a profil značky přímo na agro-svět:',
  brandsModels: 'Modely →',
  brandsProfile: 'Profil značky →',
  logoAlt: 'Logo',
  achievementsTitle: 'Největší úspěchy a milníky',
  linksTitle: 'Odkazy',
  linkWeb: 'Oficiální web firmy',
  linkCountry: 'Zemědělství — profil země, kde firma sídlí',
  linkAll: 'Všechny akcie zemědělských firem',
  linkSales: 'Prodeje zemědělské techniky v Evropě',
};

const pl: AkcieCopy = {
  numberLocale: 'pl-PL',
  bln: 'mld',

  crumbAria: 'Ścieżka',
  crumbHome: 'Główna',
  crumbData: 'Dane',
  crumbAkcie: 'Akcje',

  metaTitle: 'Akcje spółek rolniczych — John Deere, Bayer, AGCO i inne | agro-svět',
  metaDescription:
    'Przegląd akcji spółek powiązanych z rolnictwem — maszyny (John Deere, AGCO, CNH), agrochemia i nasiona (Bayer, BASF, Corteva) oraz surowce rolne. Profile i symbole giełdowe. To nie jest rekomendacja inwestycyjna.',
  crumbSelf: 'Akcje spółek rolniczych',
  eyebrow: 'Sekcja danych · Rynki',
  h1: 'Akcje spółek rolniczych',
  h1mark: 'na giełdzie',
  lede:
    'Kto stoi za maszynami, nasionami i nawozami na Twoich polach — i jak radzą sobie na giełdzie. Przegląd spółek notowanych publicznie z sektora rolnego: producenci maszyn, agrochemia i przetwórcy surowców, z USA i z Europy.',
  disclaimerStrong: '⚠️ To nie jest rekomendacja inwestycyjna.',
  disclaimerText:
    'Ta strona to informacyjny przegląd spółek powiązanych z rolnictwem. Nie zawiera rekomendacji kupna ani sprzedaży. Inwestycje w akcje są ryzykowne; przed decyzją skonsultuj się z licencjonowanym doradcą. Podawane kursy mają charakter orientacyjny i są opóźnione.',
  kategorie: {
    technika: 'Maszyny rolnicze',
    agrochemie: 'Agrochemia, nasiona i nawozy',
    komodity: 'Surowce i przetwórstwo',
  },
  hubNote:
    '📈 <strong>Bieżące kursy dzienne</strong> i 3-miesięczne trendy przy każdej spółce; kliknij kartę, aby zobaczyć <strong>interaktywny wykres</strong> notowań i kluczowe wskaźniki.',
  hubCrossSales: 'Sprzedaż maszyn rolniczych',
  hubCrossSalesNote: 'ile maszyn sprzedaje się w poszczególnych krajach',
  hubCrossCountries: 'Profile krajów',
  hubCrossCountriesNote: 'rolnictwo poszczególnych rynków',
  hubCrossPrices: 'Ceny surowców rolnych',
  hubCrossData: 'Sekcja danych agro-svět.cz',

  detailTitleTpl: '{name} ({ticker}) — akcje, kurs i profil spółki | agro-svět',
  detailDescriptionTpl:
    '{name}: kurs akcji, kapitalizacja rynkowa, siedziba, prezes, przychody i czym spółka zajmuje się w rolnictwie. {profil}',
  detailDisclaimerStrong: '⚠️ To nie jest rekomendacja inwestycyjna.',
  detailDisclaimerText:
    'Informacyjny profil spółki. Kurs i wskaźniki są orientacyjne i opóźnione (dane fundamentalne Finnhub, wykres notowań Yahoo Finance). Inwestycje w akcje są ryzykowne.',
  metricsTitle: 'Kluczowe wskaźniki',
  mCap: 'Kapitalizacja rynkowa',
  mPe: 'C/Z (TTM)',
  mDiv: 'Stopa dywidendy',
  mInd: 'Branża',
  range52: 'Zakres 52-tygodniowy',
  chartTitle: 'Wykres notowań',
  chartRangesAria: 'Okres wykresu',
  chartLoading: 'Wczytuję wykres…',
  chartSource: 'Źródło: Yahoo Finance · z opóźnieniem',
  chartAria: 'Wykres notowań akcji',
  chartPeriodSuffix: ' % w okresie',
  profileTitle: 'Czym zajmuje się spółka',
  factHq: 'Centrala',
  factFounded: 'Założono',
  factCeo: 'Prezes (CEO)',
  factRevenue: 'Roczne przychody',
  brandsTitleMulti: 'Marki tej spółki u nas',
  brandsTitleSingle: 'Modele tej marki u nas',
  brandsLede: 'Zobacz katalog maszyn i profil marki na agro-svět.cz:',
  brandsModels: 'Modele →',
  brandsProfile: 'Profil marki →',
  logoAlt: 'Logo',
  achievementsTitle: 'Największe osiągnięcia i kamienie milowe',
  linksTitle: 'Linki',
  linkWeb: 'Oficjalna strona spółki',
  linkCountry: 'Rolnictwo — profil kraju, w którym spółka ma siedzibę',
  linkAll: 'Wszystkie akcje spółek rolniczych',
  linkSales: 'Sprzedaż maszyn rolniczych w Europie',
};

/** sk/uk zatím nemají přeložený overlay firem → dostávají cs (a nejsou launchnuté). */
export const content: Record<Locale, AkcieCopy> = { cs, pl, sk: cs, uk: cs };

export function akcieCopy(locale: string): AkcieCopy {
  return content[locale as Locale] ?? cs;
}
