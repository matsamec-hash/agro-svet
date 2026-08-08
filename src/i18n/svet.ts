// Překladové mapy pro sekci /svet (sk, pl). Čeština zůstává zdrojem pravdy v datech
// (map-metrics.json / profily) a v src/lib/svet/render.ts; tenhle modul jen překrývá
// viditelné labely při renderu podle locale. Klíče (metric key, slug země, indikátor)
// jsou jazykově neutrální → lookup je bezpečný.
//
// ‼️ YMYL: poznámky a zdroje u dotačních/ekonomických metrik (cap_payments) jsou
// přeloženy DOSLOVA z české verze — čísla, jednotky ani právní citace neměnit.

export type SvetLang = 'sk' | 'pl';
type T = { sk: string; pl: string };

const pick = <V>(map: Record<string, V>, key: string): V | undefined => map[key];

/** Vrátí sk/pl variantu, nebo `fallback` (typicky česká hodnota z dat) když chybí. */
export function loc(map: Record<string, T>, key: string, lang: SvetLang, fallback: string): string {
  const e = pick(map, key);
  return e ? e[lang] : fallback;
}

// ── Názvy zemí (nominativ), keyed slugem ──────────────────────────────────────
export const COUNTRY_NAMES: Record<string, T> = {
  island: { sk: 'Island', pl: 'Islandia' },
  norsko: { sk: 'Nórsko', pl: 'Norwegia' },
  svedsko: { sk: 'Švédsko', pl: 'Szwecja' },
  finsko: { sk: 'Fínsko', pl: 'Finlandia' },
  estonsko: { sk: 'Estónsko', pl: 'Estonia' },
  lotyssko: { sk: 'Lotyšsko', pl: 'Łotwa' },
  litva: { sk: 'Litva', pl: 'Litwa' },
  irsko: { sk: 'Írsko', pl: 'Irlandia' },
  'velka-britanie': { sk: 'Veľká Británia', pl: 'Wielka Brytania' },
  dansko: { sk: 'Dánsko', pl: 'Dania' },
  nizozemsko: { sk: 'Holandsko', pl: 'Holandia' },
  nemecko: { sk: 'Nemecko', pl: 'Niemcy' },
  polsko: { sk: 'Poľsko', pl: 'Polska' },
  belgie: { sk: 'Belgicko', pl: 'Belgia' },
  lucembursko: { sk: 'Luxembursko', pl: 'Luksemburg' },
  cesko: { sk: 'Česko', pl: 'Czechy' },
  slovensko: { sk: 'Slovensko', pl: 'Słowacja' },
  ukrajina: { sk: 'Ukrajina', pl: 'Ukraina' },
  francie: { sk: 'Francúzsko', pl: 'Francja' },
  svycarsko: { sk: 'Švajčiarsko', pl: 'Szwajcaria' },
  rakousko: { sk: 'Rakúsko', pl: 'Austria' },
  madarsko: { sk: 'Maďarsko', pl: 'Węgry' },
  rumunsko: { sk: 'Rumunsko', pl: 'Rumunia' },
  portugalsko: { sk: 'Portugalsko', pl: 'Portugalia' },
  spanelsko: { sk: 'Španielsko', pl: 'Hiszpania' },
  italie: { sk: 'Taliansko', pl: 'Włochy' },
  slovinsko: { sk: 'Slovinsko', pl: 'Słowenia' },
  chorvatsko: { sk: 'Chorvátsko', pl: 'Chorwacja' },
  bulharsko: { sk: 'Bulharsko', pl: 'Bułgaria' },
  recko: { sk: 'Grécko', pl: 'Grecja' },
  kypr: { sk: 'Cyprus', pl: 'Cypr' },
  malta: { sk: 'Malta', pl: 'Malta' },
  usa: { sk: 'USA', pl: 'USA' },
};

// ── Labely 15 indikátorů (profily zemí), keyed klíčem indikátoru ──────────────
export const INDICATOR_LABELS: Record<string, T> = {
  wheat_yield: { sk: 'Výnos pšenice', pl: 'Plon pszenicy' },
  maize_yield: { sk: 'Výnos kukurice', pl: 'Plon kukurydzy' },
  barley_yield: { sk: 'Výnos jačmeňa', pl: 'Plon jęczmienia' },
  rapeseed_yield: { sk: 'Výnos repky', pl: 'Plon rzepaku' },
  cereal_yield: { sk: 'Výnos obilnín', pl: 'Plon zbóż' },
  cattle_count: { sk: 'Stavy hovädzieho dobytka', pl: 'Pogłowie bydła' },
  pigs_count: { sk: 'Stavy ošípaných', pl: 'Pogłowie świń' },
  ag_land: { sk: 'Poľnohospodárska plocha', pl: 'Powierzchnia użytków rolnych' },
  arable_land: { sk: 'Orná pôda', pl: 'Grunty orne' },
  farm_count: { sk: 'Počet poľnohospodárskych podnikov', pl: 'Liczba gospodarstw rolnych' },
  organic_share: { sk: 'Podiel ekoplochy na PP', pl: 'Udział powierzchni ekologicznej' },
  ag_output_value: { sk: 'Hodnota poľnohospodárskej produkcie', pl: 'Wartość produkcji rolnej' },
  ag_value_added_gdp: { sk: 'Podiel poľnohospodárstva na HDP', pl: 'Udział rolnictwa w PKB' },
  ag_employment: { sk: 'Zamestnanosť v poľnohospodárstve', pl: 'Zatrudnienie w rolnictwie' },
  fert_use: { sk: 'Spotreba hnojív', pl: 'Zużycie nawozów' },
};

// ── Labely 12 metrik mapy (překrývá cs label z map-metrics.json) ──────────────
export const METRIC_LABELS: Record<string, T> = {
  cap_payments: { sk: 'Priame platby SPP (Ø)', pl: 'Płatności bezpośrednie WPR (Ø)' },
  land_price: { sk: 'Cena poľnohospodárskej pôdy', pl: 'Cena ziemi rolnej' },
  rent: { sk: 'Nájomné za pôdu', pl: 'Czynsz dzierżawny' },
  wheat_yield: { sk: 'Výnos pšenice', pl: 'Plon pszenicy' },
  maize_yield: { sk: 'Výnos kukurice', pl: 'Plon kukurydzy' },
  cattle_count: { sk: 'Stavy hovädzieho dobytka', pl: 'Pogłowie bydła' },
  pigs_count: { sk: 'Stavy ošípaných', pl: 'Pogłowie świń' },
  ag_land: { sk: 'Poľnohospodárska plocha', pl: 'Powierzchnia użytków rolnych' },
  farm_count: { sk: 'Počet poľnohospodárskych podnikov', pl: 'Liczba gospodarstw rolnych' },
  organic_share: { sk: 'Podiel ekoplochy na PP', pl: 'Udział powierzchni ekologicznej' },
  ag_value_added_gdp: { sk: 'Podiel poľnohospodárstva na HDP', pl: 'Udział rolnictwa w PKB' },
  ag_employment: { sk: 'Zamestnanosť v poľnohospodárstve', pl: 'Zatrudnienie w rolnictwie' },
};

// ── Poznámky metrik („i" vysvětlení). YMYL cap_payments přeloženo doslova. ─────
export const METRIC_NOTES: Record<string, T> = {
  cap_payments: {
    sk: 'Orientačný priemer = ročná národná obálka priamych platieb ÷ poľnohospodárska plocha. Skutočná sadzba na hektár sa pri jednotlivých platbách (BISS, eko-schémy, ANC…) líši; krajiny mimo EÚ bez platieb.',
    pl: 'Orientacyjna średnia = roczna krajowa koperta płatności bezpośrednich ÷ powierzchnia użytków rolnych. Rzeczywista stawka na hektar różni się dla poszczególnych płatności (BISS, ekoschematy, ONW…); kraje spoza UE bez płatności.',
  },
  land_price: {
    sk: 'Priemerná trhová cena ornej pôdy za hektár. Pri niektorých krajinách sú dostupné len regionálne dáta.',
    pl: 'Średnia rynkowa cena gruntów ornych za hektar. Dla niektórych krajów dostępne są tylko dane regionalne.',
  },
  rent: {
    sk: 'Priemerné ročné nájomné za hektár poľnohospodárskej pôdy.',
    pl: 'Średni roczny czynsz dzierżawny za hektar użytków rolnych.',
  },
  wheat_yield: {
    sk: 'Priemerný výnos pšenice v tonách na hektár zberovej plochy.',
    pl: 'Średni plon pszenicy w tonach na hektar powierzchni zbioru.',
  },
  maize_yield: {
    sk: 'Priemerný výnos kukurice (na zrno) v tonách na hektár.',
    pl: 'Średni plon kukurydzy (na ziarno) w tonach na hektar.',
  },
  cattle_count: {
    sk: 'Celkové stavy hovädzieho dobytka v krajine (v miliónoch kusov).',
    pl: 'Całkowite pogłowie bydła w kraju (w milionach sztuk).',
  },
  pigs_count: {
    sk: 'Celkové stavy ošípaných v krajine (v miliónoch kusov).',
    pl: 'Całkowite pogłowie świń w kraju (w milionach sztuk).',
  },
  ag_land: {
    sk: 'Rozloha poľnohospodárskej pôdy — orná pôda, trvalé kultúry a pasienky (v miliónoch hektárov).',
    pl: 'Powierzchnia użytków rolnych — grunty orne, uprawy trwałe i pastwiska (w milionach hektarów).',
  },
  farm_count: {
    sk: 'Počet poľnohospodárskych podnikov v krajine (v miliónoch).',
    pl: 'Liczba gospodarstw rolnych w kraju (w milionach).',
  },
  organic_share: {
    sk: 'Podiel plochy v ekologickom poľnohospodárstve na celkovej poľnohospodárskej ploche (%).',
    pl: 'Udział powierzchni w rolnictwie ekologicznym w całkowitej powierzchni użytków rolnych (%).',
  },
  ag_value_added_gdp: {
    sk: 'Podiel poľnohospodárstva (pridaná hodnota) na hrubom domácom produkte (%).',
    pl: 'Udział rolnictwa (wartość dodana) w produkcie krajowym brutto (%).',
  },
  ag_employment: {
    sk: 'Podiel pracujúcich v poľnohospodárstve na celkovej zamestnanosti (%).',
    pl: 'Udział pracujących w rolnictwie w całkowitym zatrudnieniu (%).',
  },
};

// ── Zdroj u cap_payments (YMYL — právní citace přeložena přesně) ──────────────
export const METRIC_SOURCE: Record<string, T> = {
  cap_payments: {
    sk: 'Priame platby: Príloha V nariadenia (EÚ) 2021/2115 (rok 2027); poľnohosp. plocha: World Bank',
    pl: 'Płatności bezpośrednie: Załącznik V rozporządzenia (UE) 2021/2115 (rok 2027); użytki rolne: World Bank',
  },
};

// ── Balíčky indikátorů (profily) ──────────────────────────────────────────────
export const PACKAGE_LABELS: Record<string, T> = {
  produkce: { sk: 'Produkcia', pl: 'Produkcja' },
  puda: { sk: 'Pôda a štruktúra fariem', pl: 'Ziemia i struktura gospodarstw' },
  ekonomika: { sk: 'Ekonomika a príjmy', pl: 'Ekonomia i dochody' },
  obchod: { sk: 'Obchod a vstupy', pl: 'Handel i środki produkcji' },
};

// ── Skupiny metrik (přepínač v mapě) ──────────────────────────────────────────
export const GROUP_LABELS: Record<string, T> = {
  Podpory: { sk: 'Podpory', pl: 'Wsparcie' },
  Ceny: { sk: 'Ceny', pl: 'Ceny' },
  Produkce: { sk: 'Produkcia', pl: 'Produkcja' },
  Struktura: { sk: 'Štruktúra', pl: 'Struktura' },
  Ekonomika: { sk: 'Ekonomika', pl: 'Gospodarka' },
};

// ── Regiony Evropy (insight v mapě). Bez „Evropa" — to se skládá zvlášť. ───────
export const REGION_LABELS: Record<string, T> = {
  'Jižní': { sk: 'Južná', pl: 'Południowa' },
  'Pobaltí': { sk: 'Pobaltie', pl: 'Kraje bałtyckie' },
  'Severní': { sk: 'Severná', pl: 'Północna' },
  'Střední': { sk: 'Stredná', pl: 'Środkowa' },
  'Východní': { sk: 'Východná', pl: 'Wschodnia' },
  'Západní': { sk: 'Západná', pl: 'Zachodnia' },
};
