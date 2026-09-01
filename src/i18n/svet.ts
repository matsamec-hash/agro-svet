// Překladové mapy pro sekci /svet (sk, pl, de, uk). Čeština zůstává zdrojem pravdy
// v datech (map-metrics.json / profily) a v src/lib/svet/render.ts; tenhle modul jen
// překrývá viditelné labely při renderu podle locale. Klíče (metric key, slug země,
// indikátor) jsou jazykově neutrální → lookup je bezpečný.
//
// ‼️ YMYL: poznámky a zdroje u dotačních/ekonomických metrik (cap_payments) jsou
// přeloženy DOSLOVA z české verze — čísla, jednotky ani právní citace neměnit.
//
// ‼️ 2026-09-01: `SvetLang` byl natvrdo `'sk' | 'pl'` a všechny helpery měly
// strážce `if (locale !== 'sk' && locale !== 'pl') return m`. Přidat jazyk tedy
// neznamenalo doplnit data, ale najít pět různých podmínek — a dokud se nenajdou
// všechny, nový jazyk TIŠE dostane české hodnoty. Teď je to jedna množina.
import type { Locale } from './config';

export const SVET_LANGS = ['sk', 'pl', 'de', 'uk'] as const;
export type SvetLang = (typeof SVET_LANGS)[number];
type T = Record<SvetLang, string>;

/** True, když se pro daný locale mají labely překrývat (cs je zdroj dat). */
export function isSvetLang(locale: string): locale is SvetLang {
  return (SVET_LANGS as readonly string[]).includes(locale);
}

const pick = <V>(map: Record<string, V>, key: string): V | undefined => map[key];

/** Vrátí variantu pro jazyk, nebo `fallback` (typicky česká hodnota z dat) když chybí. */
export function loc(map: Record<string, T>, key: string, lang: SvetLang, fallback: string): string {
  // ‼️ Volající sem občas pošlou i 'cs' (`locale as SvetLang`). Chybějící jazyk
  // proto vrací fallback — tj. českou hodnotu z dat — místo undefined, které by
  // v šabloně utnulo SSR stream.
  const v = pick(map, key)?.[lang];
  return typeof v === 'string' && v !== '' ? v : fallback;
}

/** Země, se kterou se na /svet/srovnani poměřuje zbytek („vs ČR").
 *  ‼️ Není to kosmetika: německému čtenáři neříká „o 12 % víc než v Česku" nic,
 *  zatímco „než v Deutschland" ano. cs/sk/pl zůstávají u Česka záměrně —
 *  sk a pl verze s tím byly nasazené a jejich výstup se tím nemění. */
export const SVET_REFERENCE: Record<Locale, string> = {
  cs: 'cesko', sk: 'cesko', pl: 'cesko', de: 'nemecko', uk: 'ukrajina',
};

// ── Názvy zemí (nominativ), keyed slugem ──────────────────────────────────────
export const COUNTRY_NAMES: Record<string, T> = {
  island: { sk: 'Island', pl: 'Islandia', de: 'Island', uk: 'Ісландія' },
  norsko: { sk: 'Nórsko', pl: 'Norwegia', de: 'Norwegen', uk: 'Норвегія' },
  svedsko: { sk: 'Švédsko', pl: 'Szwecja', de: 'Schweden', uk: 'Швеція' },
  finsko: { sk: 'Fínsko', pl: 'Finlandia', de: 'Finnland', uk: 'Фінляндія' },
  estonsko: { sk: 'Estónsko', pl: 'Estonia', de: 'Estland', uk: 'Естонія' },
  lotyssko: { sk: 'Lotyšsko', pl: 'Łotwa', de: 'Lettland', uk: 'Латвія' },
  litva: { sk: 'Litva', pl: 'Litwa', de: 'Litauen', uk: 'Литва' },
  irsko: { sk: 'Írsko', pl: 'Irlandia', de: 'Irland', uk: 'Ірландія' },
  'velka-britanie': { sk: 'Veľká Británia', pl: 'Wielka Brytania', de: 'Vereinigtes Königreich', uk: 'Велика Британія' },
  dansko: { sk: 'Dánsko', pl: 'Dania', de: 'Dänemark', uk: 'Данія' },
  nizozemsko: { sk: 'Holandsko', pl: 'Holandia', de: 'Niederlande', uk: 'Нідерланди' },
  nemecko: { sk: 'Nemecko', pl: 'Niemcy', de: 'Deutschland', uk: 'Німеччина' },
  polsko: { sk: 'Poľsko', pl: 'Polska', de: 'Polen', uk: 'Польща' },
  belgie: { sk: 'Belgicko', pl: 'Belgia', de: 'Belgien', uk: 'Бельгія' },
  lucembursko: { sk: 'Luxembursko', pl: 'Luksemburg', de: 'Luxemburg', uk: 'Люксембург' },
  cesko: { sk: 'Česko', pl: 'Czechy', de: 'Tschechien', uk: 'Чехія' },
  slovensko: { sk: 'Slovensko', pl: 'Słowacja', de: 'Slowakei', uk: 'Словаччина' },
  ukrajina: { sk: 'Ukrajina', pl: 'Ukraina', de: 'Ukraine', uk: 'Україна' },
  francie: { sk: 'Francúzsko', pl: 'Francja', de: 'Frankreich', uk: 'Франція' },
  svycarsko: { sk: 'Švajčiarsko', pl: 'Szwajcaria', de: 'Schweiz', uk: 'Швейцарія' },
  rakousko: { sk: 'Rakúsko', pl: 'Austria', de: 'Österreich', uk: 'Австрія' },
  madarsko: { sk: 'Maďarsko', pl: 'Węgry', de: 'Ungarn', uk: 'Угорщина' },
  rumunsko: { sk: 'Rumunsko', pl: 'Rumunia', de: 'Rumänien', uk: 'Румунія' },
  portugalsko: { sk: 'Portugalsko', pl: 'Portugalia', de: 'Portugal', uk: 'Португалія' },
  spanelsko: { sk: 'Španielsko', pl: 'Hiszpania', de: 'Spanien', uk: 'Іспанія' },
  italie: { sk: 'Taliansko', pl: 'Włochy', de: 'Italien', uk: 'Італія' },
  slovinsko: { sk: 'Slovinsko', pl: 'Słowenia', de: 'Slowenien', uk: 'Словенія' },
  chorvatsko: { sk: 'Chorvátsko', pl: 'Chorwacja', de: 'Kroatien', uk: 'Хорватія' },
  bulharsko: { sk: 'Bulharsko', pl: 'Bułgaria', de: 'Bulgarien', uk: 'Болгарія' },
  recko: { sk: 'Grécko', pl: 'Grecja', de: 'Griechenland', uk: 'Греція' },
  kypr: { sk: 'Cyprus', pl: 'Cypr', de: 'Zypern', uk: 'Кіпр' },
  malta: { sk: 'Malta', pl: 'Malta', de: 'Malta', uk: 'Мальта' },
  usa: { sk: 'USA', pl: 'USA', de: 'USA', uk: 'США' },
};

// ── Labely 15 indikátorů (profily zemí), keyed klíčem indikátoru ──────────────
export const INDICATOR_LABELS: Record<string, T> = {
  wheat_yield: { sk: 'Výnos pšenice', pl: 'Plon pszenicy', de: 'Weizenertrag', uk: 'Урожайність пшениці' },
  maize_yield: { sk: 'Výnos kukurice', pl: 'Plon kukurydzy', de: 'Maisertrag', uk: 'Урожайність кукурудзи' },
  barley_yield: { sk: 'Výnos jačmeňa', pl: 'Plon jęczmienia', de: 'Gerstenertrag', uk: 'Урожайність ячменю' },
  rapeseed_yield: { sk: 'Výnos repky', pl: 'Plon rzepaku', de: 'Rapsertrag', uk: 'Урожайність ріпаку' },
  cereal_yield: { sk: 'Výnos obilnín', pl: 'Plon zbóż', de: 'Getreideertrag', uk: 'Урожайність зернових' },
  cattle_count: { sk: 'Stavy hovädzieho dobytka', pl: 'Pogłowie bydła', de: 'Rinderbestand', uk: 'Поголів’я ВРХ' },
  pigs_count: { sk: 'Stavy ošípaných', pl: 'Pogłowie świń', de: 'Schweinebestand', uk: 'Поголів’я свиней' },
  ag_land: { sk: 'Poľnohospodárska plocha', pl: 'Powierzchnia użytków rolnych', de: 'Landwirtschaftliche Fläche', uk: 'Сільськогосподарські угіддя' },
  arable_land: { sk: 'Orná pôda', pl: 'Grunty orne', de: 'Ackerland', uk: 'Рілля' },
  farm_count: { sk: 'Počet poľnohospodárskych podnikov', pl: 'Liczba gospodarstw rolnych', de: 'Zahl der Betriebe', uk: 'Кількість господарств' },
  organic_share: { sk: 'Podiel ekoplochy na PP', pl: 'Udział powierzchni ekologicznej', de: 'Anteil Ökofläche an der LF', uk: 'Частка органічних площ' },
  ag_output_value: { sk: 'Hodnota poľnohospodárskej produkcie', pl: 'Wartość produkcji rolnej', de: 'Wert der Agrarproduktion', uk: 'Вартість аграрної продукції' },
  ag_value_added_gdp: { sk: 'Podiel poľnohospodárstva na HDP', pl: 'Udział rolnictwa w PKB', de: 'Anteil der Landwirtschaft am BIP', uk: 'Частка сільського господарства у ВВП' },
  ag_employment: { sk: 'Zamestnanosť v poľnohospodárstve', pl: 'Zatrudnienie w rolnictwie', de: 'Beschäftigung in der Landwirtschaft', uk: 'Зайнятість у сільському господарстві' },
  fert_use: { sk: 'Spotreba hnojív', pl: 'Zużycie nawozów', de: 'Düngemitteleinsatz', uk: 'Використання добрив' },
};

// ── Labely 12 metrik mapy (překrývá cs label z map-metrics.json) ──────────────
export const METRIC_LABELS: Record<string, T> = {
  cap_payments: { sk: 'Priame platby SPP (Ø)', pl: 'Płatności bezpośrednie WPR (Ø)', de: 'GAP-Direktzahlungen (Ø)', uk: 'Прямі виплати САП (Ø)' },
  land_price: { sk: 'Cena poľnohospodárskej pôdy', pl: 'Cena ziemi rolnej', de: 'Bodenpreis (Ackerland)', uk: 'Ціна сільськогосподарської землі' },
  rent: { sk: 'Nájomné za pôdu', pl: 'Czynsz dzierżawny', de: 'Pachtpreis', uk: 'Орендна плата за землю' },
  wheat_yield: { sk: 'Výnos pšenice', pl: 'Plon pszenicy', de: 'Weizenertrag', uk: 'Урожайність пшениці' },
  maize_yield: { sk: 'Výnos kukurice', pl: 'Plon kukurydzy', de: 'Maisertrag', uk: 'Урожайність кукурудзи' },
  cattle_count: { sk: 'Stavy hovädzieho dobytka', pl: 'Pogłowie bydła', de: 'Rinderbestand', uk: 'Поголів’я ВРХ' },
  pigs_count: { sk: 'Stavy ošípaných', pl: 'Pogłowie świń', de: 'Schweinebestand', uk: 'Поголів’я свиней' },
  ag_land: { sk: 'Poľnohospodárska plocha', pl: 'Powierzchnia użytków rolnych', de: 'Landwirtschaftliche Fläche', uk: 'Сільськогосподарські угіддя' },
  farm_count: { sk: 'Počet poľnohospodárskych podnikov', pl: 'Liczba gospodarstw rolnych', de: 'Zahl der Betriebe', uk: 'Кількість господарств' },
  organic_share: { sk: 'Podiel ekoplochy na PP', pl: 'Udział powierzchni ekologicznej', de: 'Anteil Ökofläche an der LF', uk: 'Частка органічних площ' },
  ag_value_added_gdp: { sk: 'Podiel poľnohospodárstva na HDP', pl: 'Udział rolnictwa w PKB', de: 'Anteil der Landwirtschaft am BIP', uk: 'Частка сільського господарства у ВВП' },
  ag_employment: { sk: 'Zamestnanosť v poľnohospodárstve', pl: 'Zatrudnienie w rolnictwie', de: 'Beschäftigung in der Landwirtschaft', uk: 'Зайнятість у сільському господарстві' },
};

// ── Poznámky metrik („i" vysvětlení). YMYL cap_payments přeloženo doslova. ─────
export const METRIC_NOTES: Record<string, T> = {
  cap_payments: {
    sk: 'Orientačný priemer = ročná národná obálka priamych platieb ÷ poľnohospodárska plocha. Skutočná sadzba na hektár sa pri jednotlivých platbách (BISS, eko-schémy, ANC…) líši; krajiny mimo EÚ bez platieb.',
    pl: 'Orientacyjna średnia = roczna krajowa koperta płatności bezpośrednich ÷ powierzchnia użytków rolnych. Rzeczywista stawka na hektar różni się dla poszczególnych płatności (BISS, ekoschematy, ONW…); kraje spoza UE bez płatności.',
    de: 'Orientierungswert = jährliche nationale Obergrenze der Direktzahlungen ÷ landwirtschaftliche Fläche. Der tatsächliche Satz je Hektar unterscheidet sich nach Zahlungsart (Einkommensgrundstützung, Öko-Regelungen, Ausgleichszulage …); Länder außerhalb der EU ohne Zahlungen.',
    uk: 'Орієнтовне середнє = річний національний конверт прямих виплат ÷ сільськогосподарські угіддя. Фактична ставка на гектар відрізняється за окремими виплатами (BISS, екосхеми, ANC…); країни поза ЄС — без виплат.',
  },
  land_price: {
    sk: 'Priemerná trhová cena ornej pôdy za hektár. Pri niektorých krajinách sú dostupné len regionálne dáta.',
    pl: 'Średnia rynkowa cena gruntów ornych za hektar. Dla niektórych krajów dostępne są tylko dane regionalne.',
    de: 'Durchschnittlicher Marktpreis für Ackerland je Hektar. Für einige Länder liegen nur regionale Daten vor.',
    uk: 'Середня ринкова ціна ріллі за гектар. Для деяких країн доступні лише регіональні дані.',
  },
  rent: {
    sk: 'Priemerné ročné nájomné za hektár poľnohospodárskej pôdy.',
    pl: 'Średni roczny czynsz dzierżawny za hektar użytków rolnych.',
    de: 'Durchschnittlicher jährlicher Pachtpreis je Hektar landwirtschaftlicher Fläche.',
    uk: 'Середня річна орендна плата за гектар сільськогосподарських угідь.',
  },
  wheat_yield: {
    sk: 'Priemerný výnos pšenice v tonách na hektár zberovej plochy.',
    pl: 'Średni plon pszenicy w tonach na hektar powierzchni zbioru.',
    de: 'Durchschnittlicher Weizenertrag in Tonnen je Hektar Erntefläche.',
    uk: 'Середня врожайність пшениці в тоннах на гектар зібраної площі.',
  },
  maize_yield: {
    sk: 'Priemerný výnos kukurice (na zrno) v tonách na hektár.',
    pl: 'Średni plon kukurydzy (na ziarno) w tonach na hektar.',
    de: 'Durchschnittlicher Maisertrag (Körnermais) in Tonnen je Hektar.',
    uk: 'Середня врожайність кукурудзи (на зерно) в тоннах на гектар.',
  },
  cattle_count: {
    sk: 'Celkové stavy hovädzieho dobytka v krajine (v miliónoch kusov).',
    pl: 'Całkowite pogłowie bydła w kraju (w milionach sztuk).',
    de: 'Gesamter Rinderbestand des Landes (in Millionen Stück).',
    uk: 'Загальне поголів’я великої рогатої худоби в країні (у мільйонах голів).',
  },
  pigs_count: {
    sk: 'Celkové stavy ošípaných v krajine (v miliónoch kusov).',
    pl: 'Całkowite pogłowie świń w kraju (w milionach sztuk).',
    de: 'Gesamter Schweinebestand des Landes (in Millionen Stück).',
    uk: 'Загальне поголів’я свиней у країні (у мільйонах голів).',
  },
  ag_land: {
    sk: 'Rozloha poľnohospodárskej pôdy — orná pôda, trvalé kultúry a pasienky (v miliónoch hektárov).',
    pl: 'Powierzchnia użytków rolnych — grunty orne, uprawy trwałe i pastwiska (w milionach hektarów).',
    de: 'Landwirtschaftlich genutzte Fläche — Ackerland, Dauerkulturen und Grünland (in Millionen Hektar).',
    uk: 'Площа сільськогосподарських угідь — рілля, багаторічні насадження та пасовища (у мільйонах гектарів).',
  },
  farm_count: {
    sk: 'Počet poľnohospodárskych podnikov v krajine (v miliónoch).',
    pl: 'Liczba gospodarstw rolnych w kraju (w milionach).',
    de: 'Zahl der landwirtschaftlichen Betriebe im Land (in Millionen).',
    uk: 'Кількість сільськогосподарських підприємств у країні (у мільйонах).',
  },
  organic_share: {
    sk: 'Podiel plochy v ekologickom poľnohospodárstve na celkovej poľnohospodárskej ploche (%).',
    pl: 'Udział powierzchni w rolnictwie ekologicznym w całkowitej powierzchni użytków rolnych (%).',
    de: 'Anteil der ökologisch bewirtschafteten Fläche an der gesamten landwirtschaftlichen Fläche (%).',
    uk: 'Частка площ під органічним виробництвом у загальній площі сільськогосподарських угідь (%).',
  },
  ag_value_added_gdp: {
    sk: 'Podiel poľnohospodárstva (pridaná hodnota) na hrubom domácom produkte (%).',
    pl: 'Udział rolnictwa (wartość dodana) w produkcie krajowym brutto (%).',
    de: 'Anteil der Landwirtschaft (Bruttowertschöpfung) am Bruttoinlandsprodukt (%).',
    uk: 'Частка сільського господарства (додана вартість) у валовому внутрішньому продукті (%).',
  },
  ag_employment: {
    sk: 'Podiel pracujúcich v poľnohospodárstve na celkovej zamestnanosti (%).',
    pl: 'Udział pracujących w rolnictwie w całkowitym zatrudnieniu (%).',
    de: 'Anteil der in der Landwirtschaft Beschäftigten an der Gesamtbeschäftigung (%).',
    uk: 'Частка зайнятих у сільському господарстві в загальній зайнятості (%).',
  },
};

// ── Zdroj u cap_payments (YMYL — právní citace přeložena přesně) ──────────────
export const METRIC_SOURCE: Record<string, T> = {
  cap_payments: {
    sk: 'Priame platby: Príloha V nariadenia (EÚ) 2021/2115 (rok 2027); poľnohosp. plocha: World Bank',
    pl: 'Płatności bezpośrednie: Załącznik V rozporządzenia (UE) 2021/2115 (rok 2027); użytki rolne: World Bank',
    de: 'Direktzahlungen: Anhang V der Verordnung (EU) 2021/2115 (Jahr 2027); landwirtschaftliche Fläche: World Bank',
    uk: 'Прямі виплати: Додаток V Регламенту (ЄС) 2021/2115 (2027 рік); сільськогосподарські угіддя: World Bank',
  },
};

// ── Balíčky indikátorů (profily) ──────────────────────────────────────────────
export const PACKAGE_LABELS: Record<string, T> = {
  produkce: { sk: 'Produkcia', pl: 'Produkcja', de: 'Produktion', uk: 'Виробництво' },
  puda: { sk: 'Pôda a štruktúra fariem', pl: 'Ziemia i struktura gospodarstw', de: 'Boden und Betriebsstruktur', uk: 'Земля та структура господарств' },
  ekonomika: { sk: 'Ekonomika a príjmy', pl: 'Ekonomia i dochody', de: 'Wirtschaft und Einkommen', uk: 'Економіка та доходи' },
  obchod: { sk: 'Obchod a vstupy', pl: 'Handel i środki produkcji', de: 'Handel und Betriebsmittel', uk: 'Торгівля та засоби виробництва' },
};

// ── Skupiny metrik (přepínač v mapě) ──────────────────────────────────────────
export const GROUP_LABELS: Record<string, T> = {
  Podpory: { sk: 'Podpory', pl: 'Wsparcie', de: 'Förderung', uk: 'Підтримка' },
  Ceny: { sk: 'Ceny', pl: 'Ceny', de: 'Preise', uk: 'Ціни' },
  Produkce: { sk: 'Produkcia', pl: 'Produkcja', de: 'Produktion', uk: 'Виробництво' },
  Struktura: { sk: 'Štruktúra', pl: 'Struktura', de: 'Struktur', uk: 'Структура' },
  Ekonomika: { sk: 'Ekonomika', pl: 'Gospodarka', de: 'Wirtschaft', uk: 'Економіка' },
};

// ── Regiony Evropy (label v panelu mapy). Plná fráze vč. „Evropa" — data drží jen
// holé „Střední"/„Severní"…; klient dřív skládal „+ 'ní Evropa'" (bug: „Středníní
// Evropa"). Nově se region přeloží na plnou frázi na serveru pro VŠECHNY locale. ──
export const REGION_LABELS: Record<string, Record<Locale, string>> = {
  'Jižní': { cs: 'Jižní Evropa', sk: 'Južná Európa', pl: 'Europa Południowa', de: 'Südeuropa', uk: 'Південна Європа' },
  'Pobaltí': { cs: 'Pobaltí', sk: 'Pobaltie', pl: 'Kraje bałtyckie', de: 'Baltikum', uk: 'Країни Балтії' },
  'Severní': { cs: 'Severní Evropa', sk: 'Severná Európa', pl: 'Europa Północna', de: 'Nordeuropa', uk: 'Північна Європа' },
  'Střední': { cs: 'Střední Evropa', sk: 'Stredná Európa', pl: 'Europa Środkowa', de: 'Mitteleuropa', uk: 'Центральна Європа' },
  'Východní': { cs: 'Východní Evropa', sk: 'Východná Európa', pl: 'Europa Wschodnia', de: 'Osteuropa', uk: 'Східна Європа' },
  'Západní': { cs: 'Západní Evropa', sk: 'Západná Európa', pl: 'Europa Zachodnia', de: 'Westeuropa', uk: 'Західна Європа' },
};

// ── Metriky regionální mapy (/svet/<slug> RegionMap) — 6 klíčů, label + popis ──
type RegionMetricT = Record<SvetLang, { label: string; desc: string }>;
export const REGION_METRIC: Record<string, RegionMetricT> = {
  cattle_density: {
    sk: { label: 'Hustota dobytka', desc: 'Kusy hovädzieho dobytka na hektár poľnohospodárskej plochy' },
    pl: { label: 'Gęstość bydła', desc: 'Sztuki bydła na hektar użytków rolnych' },
    de: { label: 'Viehdichte', desc: 'Rinder je Hektar landwirtschaftlicher Fläche' },
    uk: { label: 'Щільність поголів’я', desc: 'Голів великої рогатої худоби на гектар сільськогосподарських угідь' },
  },
  arable_share: {
    sk: { label: 'Podiel ornej pôdy', desc: 'Orná pôda ako podiel poľnohospodárskej plochy (UAA)' },
    pl: { label: 'Udział gruntów ornych', desc: 'Grunty orne jako udział w użytkach rolnych (UAA)' },
    de: { label: 'Ackerlandanteil', desc: 'Ackerland als Anteil der landwirtschaftlichen Fläche (LF)' },
    uk: { label: 'Частка ріллі', desc: 'Рілля як частка сільськогосподарських угідь (UAA)' },
  },
  grassland_share: {
    sk: { label: 'Podiel trávnych porastov', desc: 'Trvalé trávne porasty ako podiel UAA' },
    pl: { label: 'Udział trwałych użytków zielonych', desc: 'Trwałe użytki zielone jako udział w UAA' },
    de: { label: 'Grünlandanteil', desc: 'Dauergrünland als Anteil der LF' },
    uk: { label: 'Частка багаторічних трав', desc: 'Постійні пасовища та сіножаті як частка UAA' },
  },
  uaa_share: {
    sk: { label: 'Podiel poľnohospodárskej pôdy', desc: 'Poľnohospodárska plocha (UAA) ako podiel rozlohy regiónu' },
    pl: { label: 'Udział użytków rolnych', desc: 'Użytki rolne (UAA) jako udział w powierzchni regionu' },
    de: { label: 'Anteil landwirtschaftlicher Fläche', desc: 'Landwirtschaftliche Fläche (LF) als Anteil der Regionsfläche' },
    uk: { label: 'Частка сільгоспугідь', desc: 'Сільськогосподарські угіддя (UAA) як частка площі регіону' },
  },
  cattle: {
    sk: { label: 'Stavy dobytka', desc: 'Počet kusov hovädzieho dobytka (v tisícoch)' },
    pl: { label: 'Pogłowie bydła', desc: 'Liczba sztuk bydła (w tysiącach)' },
    de: { label: 'Rinderbestand', desc: 'Zahl der Rinder (in Tausend)' },
    uk: { label: 'Поголів’я ВРХ', desc: 'Кількість голів великої рогатої худоби (у тисячах)' },
  },
  uaa: {
    sk: { label: 'Poľnohospodárska plocha', desc: 'Využitá poľnohospodárska plocha (UAA), v tisícoch hektárov' },
    pl: { label: 'Użytki rolne', desc: 'Wykorzystywana powierzchnia użytków rolnych (UAA), w tysiącach hektarów' },
    de: { label: 'Landwirtschaftliche Fläche', desc: 'Landwirtschaftlich genutzte Fläche (LF), in Tausend Hektar' },
    uk: { label: 'Сільськогосподарські угіддя', desc: 'Використовувані сільськогосподарські угіддя (UAA), у тисячах гектарів' },
  },
};

/** Přeloží label+desc regionální metriky (cs beze změny). */
export function localizeRegionMetric<M extends { key: string; label: string; desc?: string }>(m: M, locale: string): M {
  if (!isSvetLang(locale)) return m;
  const e = REGION_METRIC[m.key];
  if (!e) return m;
  const t = e[locale];
  return { ...m, label: t.label, ...(m.desc != null ? { desc: t.desc } : {}) };
}

// ── Poznámka o granularitě (NUTS) pro RegionMap default (když data nemají regionNote) ──
export const REGION_LEVEL_NOTE: Record<'NUTS1' | 'NUTS2', Record<Locale, string>> = {
  NUTS2: {
    cs: 'úroveň régionů (NUTS-2). Nižší jednotky (NUTS-3) nemají v Eurostatu regionální data — připraveno pro navazující napojení.',
    sk: 'úroveň regiónov (NUTS-2). Nižšie jednotky (NUTS-3) nemajú v Eurostate regionálne dáta — pripravené pre nadväzujúce napojenie.',
    pl: 'poziom regionów (NUTS-2). Niższe jednostki (NUTS-3) nie mają danych regionalnych w Eurostacie — przygotowane do dalszego podłączenia.',
    de: 'Regionsebene (NUTS-2). Für kleinere Einheiten (NUTS-3) liegen bei Eurostat keine regionalen Daten vor — für eine spätere Anbindung vorbereitet.',
    uk: 'рівень регіонів (NUTS-2). Для менших одиниць (NUTS-3) Євростат регіональних даних не має — підготовлено для подальшого підключення.',
  },
  NUTS1: {
    cs: 'úroveň régionů (NUTS-1), agregováno z NUTS-2. Nižší jednotky (NUTS-3) nemají v Eurostatu regionální data — připraveno pro navazující napojení.',
    sk: 'úroveň regiónov (NUTS-1), agregované z NUTS-2. Nižšie jednotky (NUTS-3) nemajú v Eurostate regionálne dáta — pripravené pre nadväzujúce napojenie.',
    pl: 'poziom regionów (NUTS-1), zagregowane z NUTS-2. Niższe jednostki (NUTS-3) nie mają danych regionalnych w Eurostacie — przygotowane do dalszego podłączenia.',
    de: 'Regionsebene (NUTS-1), aggregiert aus NUTS-2. Für kleinere Einheiten (NUTS-3) liegen bei Eurostat keine regionalen Daten vor — für eine spätere Anbindung vorbereitet.',
    uk: 'рівень регіонів (NUTS-1), агреговано з NUTS-2. Для менших одиниць (NUTS-3) Євростат регіональних даних не має — підготовлено для подальшого підключення.',
  },
};

/** Plná fráze regionu ve zvoleném locale; fallback = holá hodnota.
 *  ‼️ Mapa, ne řetězený ternář — chybějící jazyk pak vrátí undefined (viditelné)
 *  místo tichého pádu do češtiny. */
export function regionPhrase(region: string | undefined, locale: string): string {
  if (!region) return '';
  const e = REGION_LABELS[region];
  if (!e) return region;
  return e[locale as Locale] ?? e.cs;
}

// ── Helpery pro hromadnou lokalizaci dat mapy (server-side overlay) ───────────
type MetricLike = { key: string; label: string; unit?: string; group?: string; note?: string; source?: string; sourceUrl?: string; [k: string]: unknown };

/** Přeloží label/note/source/group metriky (cs se vrací beze změny). */
export function localizeMetric<M extends MetricLike>(m: M, locale: string): M {
  if (!isSvetLang(locale)) return m;
  const lang = locale;
  return {
    ...m,
    label: loc(METRIC_LABELS, m.key, lang, m.label),
    ...(m.note != null ? { note: loc(METRIC_NOTES, m.key, lang, m.note) } : {}),
    ...(m.source != null ? { source: loc(METRIC_SOURCE, m.key, lang, m.source) } : {}),
    ...(m.group != null ? { group: loc(GROUP_LABELS, m.group, lang, m.group) } : {}),
  };
}

/** Přeloží name+region země (cs beze změny, jen region → plná fráze). */
export function localizeCountry<C extends { slug: string; name: string; region?: string; [k: string]: unknown }>(c: C, locale: string): C {
  const name = isSvetLang(locale) ? loc(COUNTRY_NAMES, c.slug, locale, c.name) : c.name;
  return { ...c, name, ...(c.region != null ? { region: regionPhrase(c.region, locale) } : {}) };
}
