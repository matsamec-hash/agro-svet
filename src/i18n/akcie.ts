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
  /** Sekce „kdo značku prodává a servisuje v ČR" — obsah je český, ale nadpis
   *  ne (na /sk a /pl se zobrazuje ve zdejším jazyce). */
  repTitle: string;
  repLede: string;
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
  repTitle: 'Zastoupení v Česku',
  repLede: 'Prodej a servis v ČR zajišťuje:',
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
  repTitle: 'Przedstawicielstwo w Czechach',
  repLede: 'Sprzedaż i serwis w Czechach zapewnia:',
  achievementsTitle: 'Największe osiągnięcia i kamienie milowe',
  linksTitle: 'Linki',
  linkWeb: 'Oficjalna strona spółki',
  linkCountry: 'Rolnictwo — profil kraju, w którym spółka ma siedzibę',
  linkAll: 'Wszystkie akcje spółek rolniczych',
  linkSales: 'Sprzedaż maszyn rolniczych w Europie',
};

const sk: AkcieCopy = {
  numberLocale: 'sk-SK',
  bln: 'mld.',
  crumbAria: 'Cesta',
  crumbHome: 'Domov',
  crumbData: 'Dáta',
  crumbAkcie: 'Akcie',
  metaTitle: 'Akcie poľnohospodárskych firiem — John Deere, Bayer, AGCO a ďalší | agro-svět',
  metaDescription:
    'Prehľad akcií firiem naviazaných na poľnohospodárstvo — technika (John Deere, AGCO, CNH), agrochémia a osivá (Bayer, BASF, Corteva) aj komodity. Profily a burzové symboly. Nie je investičné odporúčanie.',
  crumbSelf: 'Akcie agro firiem',
  eyebrow: 'Dátová sekcia · Trhy',
  h1: 'Akcie poľnohospodárskych firiem',
  h1mark: 'na burze',
  lede:
    'Kto stojí za technikou, osivami a hnojivami na vašich poliach — a ako sa im darí na burze. Prehľad verejne obchodovaných firiem z agrosektora: výrobcovia strojov, agrochémie aj spracovatelia komodít, zo Spojených štátov aj Európy.',
  disclaimerStrong: '⚠️ Nie je investičné odporúčanie.',
  disclaimerText:
    'Táto stránka je informačný prehľad firiem naviazaných na poľnohospodárstvo. Neobsahuje nákupné ani predajné odporúčania. Investície do akcií sú rizikové; pred rozhodnutím sa poraďte s licencovaným poradcom. Prípadné kurzy sú orientačné a oneskorené.',
  kategorie: {
    technika: 'Poľnohospodárska technika',
    agrochemie: 'Agrochémia, osivá a hnojivá',
    komodity: 'Komodity a spracovanie',
  },
  hubNote:
    '📈 <strong>Živé denné kurzy</strong> a 3-mesačné trendy pri každej firme; kliknite na kartu pre <strong>interaktívny graf</strong> vývoja kurzu a kľúčové ukazovatele.',
  hubCrossSales: 'Predaje poľnohospodárskej techniky',
  hubCrossSalesNote: 'koľko strojov sa predá podľa krajín',
  hubCrossCountries: 'Profily krajín',
  hubCrossCountriesNote: 'poľnohospodárstvo jednotlivých trhov',
  hubCrossPrices: 'Ceny poľnohospodárskych komodít',
  hubCrossData: 'Dátová sekcia agro-svět',
  detailTitleTpl: '{name} ({ticker}) — akcie, kurz a profil spoločnosti | agro-svět',
  detailDescriptionTpl:
    '{name}: kurz akcie, trhová kapitalizácia, sídlo, riaditeľ, obrat a čo firma robí v poľnohospodárstve. {profil}',
  detailDisclaimerStrong: '⚠️ Nie je investičné odporúčanie.',
  detailDisclaimerText:
    'Informačný profil firmy. Kurz a ukazovatele sú orientačné a oneskorené (fundamenty Finnhub, graf kurzu Yahoo Finance). Investície do akcií sú rizikové.',
  metricsTitle: 'Kľúčové ukazovatele',
  mCap: 'Trhová kapitalizácia',
  mPe: 'P/E (TTM)',
  mDiv: 'Dividendový výnos',
  mInd: 'Odvetvie',
  range52: '52-týždňové rozpätie',
  chartTitle: 'Vývoj kurzu',
  chartRangesAria: 'Obdobie grafu',
  chartLoading: 'Načítavam graf…',
  chartSource: 'Zdroj: Yahoo Finance · oneskorené',
  chartAria: 'Graf vývoja kurzu',
  chartPeriodSuffix: ' % za obdobie',
  profileTitle: 'Čo firma robí',
  factHq: 'Centrála',
  factFounded: 'Založené',
  factCeo: 'Riaditeľ (CEO)',
  factRevenue: 'Ročný obrat',
  brandsTitleMulti: 'Značky tejto firmy u nás',
  brandsTitleSingle: 'Modely tejto značky u nás',
  brandsLede: 'Prezrite si katalóg strojov a profil značky priamo na agro-svět:',
  brandsModels: 'Modely →',
  brandsProfile: 'Profil značky →',
  logoAlt: 'Logo',
  repTitle: 'Zastúpenie v Česku',
  repLede: 'Predaj a servis v ČR zabezpečuje:',
  achievementsTitle: 'Najväčšie úspechy a míľniky',
  linksTitle: 'Odkazy',
  linkWeb: 'Oficiálna webstránka firmy',
  linkCountry: 'Poľnohospodárstvo — profil krajiny, kde firma sídli',
  linkAll: 'Všetky akcie poľnohospodárskych firiem',
  linkSales: 'Predaje poľnohospodárskej techniky v Európe',
};

const uk: AkcieCopy = {
  numberLocale: 'uk-UA',
  bln: 'млрд',
  crumbAria: 'Шлях',
  crumbHome: 'Головна',
  crumbData: 'Дані',
  crumbAkcie: 'Акції',
  metaTitle: 'Акції аграрних компаній — John Deere, Bayer, AGCO та інші | agro-svět',
  metaDescription:
    'Огляд акцій компаній, пов’язаних із сільським господарством — техніка (John Deere, AGCO, CNH), агрохімія та насіння (Bayer, BASF, Corteva) і сировина. Профілі та біржові символи. Не є інвестиційною порадою.',
  crumbSelf: 'Акції аграрних компаній',
  eyebrow: 'Датова секція · Ринки',
  h1: 'Акції аграрних компаній',
  h1mark: 'на біржі',
  lede:
    'Хто стоїть за технікою, насінням і добривами на ваших полях — і як вони представлені на біржі. Огляд публічних компаній агросектору: виробники техніки, агрохімії та переробники сировини зі Сполучених Штатів і Європи.',
  disclaimerStrong: '⚠️ Не є інвестиційною порадою.',
  disclaimerText:
    'Ця сторінка — інформаційний огляд компаній, пов’язаних із сільським господарством. Не містить рекомендацій щодо купівлі чи продажу. Інвестиції в акції ризиковані; перед рішенням проконсультуйтеся з ліцензованим радником. Курси можуть бути орієнтовними та із затримкою.',
  kategorie: {
    technika: 'Сільськогосподарська техніка',
    agrochemie: 'Агрохімія, насіння та добрива',
    komodity: 'Сировина та переробка',
  },
  hubNote:
    '📈 <strong>Живі денні котирування</strong> і 3-місячні тренди для кожної компанії; натисніть на картку для <strong>інтерактивного графіка</strong> динаміки курсу та ключових показників.',
  hubCrossSales: 'Продажі сільськогосподарської техніки',
  hubCrossSalesNote: 'скільки техніки продається по країнах',
  hubCrossCountries: 'Профілі країн',
  hubCrossCountriesNote: 'агросектор окремих ринків',
  hubCrossPrices: 'Ціни сільськогосподарської сировини',
  hubCrossData: 'Датова секція agro-svět',
  detailTitleTpl: '{name} ({ticker}) — акції, курс і профіль компанії | agro-svět',
  detailDescriptionTpl:
    '{name}: курс акції, ринкова капіталізація, штаб-квартира, директор, обіг і чим займається компанія в агросекторі. {profil}',
  detailDisclaimerStrong: '⚠️ Не є інвестиційною порадою.',
  detailDisclaimerText:
    'Інформаційний профіль компанії. Курс і показники орієнтовні та із затримкою (фундаментальні дані Finnhub, графік курсу Yahoo Finance). Інвестиції в акції ризиковані.',
  metricsTitle: 'Ключові показники',
  mCap: 'Ринкова капіталізація',
  mPe: 'P/E (TTM)',
  mDiv: 'Дивідендна дохідність',
  mInd: 'Сектор',
  range52: '52-тижневий діапазон',
  chartTitle: 'Динаміка курсу',
  chartRangesAria: 'Період графіка',
  chartLoading: 'Завантаження графіка…',
  chartSource: 'Джерело: Yahoo Finance · із затримкою',
  chartAria: 'Графік динаміки курсу',
  chartPeriodSuffix: ' % за період',
  profileTitle: 'Чим займається компанія',
  factHq: 'Штаб-квартира',
  factFounded: 'Засновано',
  factCeo: 'Директор (CEO)',
  factRevenue: 'Річний обіг',
  brandsTitleMulti: 'Бренди цієї компанії в Україні',
  brandsTitleSingle: 'Моделі цього бренду в Україні',
  brandsLede: 'Ознайомтеся з каталогом техніки та профілем бренду безпосередньо на agro-svět:',
  brandsModels: 'Моделі →',
  brandsProfile: 'Профіль бренду →',
  logoAlt: 'Логотип',
  repTitle: 'Представництво в Україні',
  repLede: 'Продаж і сервіс в Україні забезпечує:',
  achievementsTitle: 'Найбільші досягнення та віхи',
  linksTitle: 'Посилання',
  linkWeb: 'Офіційний сайт компанії',
  linkCountry: 'Сільське господарство — профіль країни, де розташована компанія',
  linkAll: 'Усі акції аграрних компаній',
  linkSales: 'Продажі сільськогосподарської техніки в Європі',
};

const de: AkcieCopy = {
  numberLocale: 'de-DE',
  bln: 'Mrd.',

  crumbAria: 'Pfad',
  crumbHome: 'Startseite',
  crumbData: 'Daten',
  crumbAkcie: 'Aktien',

  metaTitle: 'Aktien von Agrarunternehmen — John Deere, Bayer, AGCO und weitere | agro-svět',
  metaDescription:
    'Übersicht der börsennotierten Unternehmen des Agrarsektors — Landtechnik (John Deere, AGCO, CNH), Agrarchemie und Saatgut (Bayer, BASF, Corteva) sowie Rohstoffhandel. Profile und Börsenkürzel. Keine Anlageempfehlung.',
  crumbSelf: 'Aktien von Agrarunternehmen',
  eyebrow: 'Datenbereich · Märkte',
  h1: 'Aktien von Agrarunternehmen',
  h1mark: 'an der Börse',
  lede:
    'Wer hinter Technik, Saatgut und Dünger auf Ihren Feldern steht — und wie sich diese Unternehmen an der Börse schlagen. Eine Übersicht der börsennotierten Firmen des Agrarsektors: Maschinenbauer, Agrarchemie und Rohstoffverarbeiter aus Europa und den USA.',
  disclaimerStrong: '⚠️ Keine Anlageempfehlung.',
  disclaimerText:
    'Diese Seite ist eine informative Übersicht über Unternehmen mit Bezug zur Landwirtschaft. Sie enthält weder Kauf- noch Verkaufsempfehlungen. Aktieninvestitionen sind mit Risiken verbunden; holen Sie vor einer Entscheidung den Rat einer zugelassenen Beratung ein. Angezeigte Kurse sind unverbindlich und zeitverzögert.',
  kategorie: {
    technika: 'Landtechnik',
    agrochemie: 'Agrarchemie, Saatgut und Dünger',
    komodity: 'Rohstoffe und Verarbeitung',
  },
  hubNote:
    '📈 <strong>Tagesaktuelle Kurse</strong> und Dreimonatstrends zu jedem Unternehmen; ein Klick auf die Karte öffnet den <strong>interaktiven Kursverlauf</strong> und die wichtigsten Kennzahlen.',
  hubCrossSales: 'Maschinenverkäufe',
  hubCrossSalesNote: 'wie viele Maschinen je Land verkauft werden',
  hubCrossCountries: 'Länderprofile',
  hubCrossCountriesNote: 'die Landwirtschaft der einzelnen Märkte',
  hubCrossPrices: 'Preise für Agrarrohstoffe',
  hubCrossData: 'Datenbereich von agro-svět',

  detailTitleTpl: '{name} ({ticker}) — Aktie, Kurs und Unternehmensprofil | agro-svět',
  detailDescriptionTpl:
    '{name}: Aktienkurs, Marktkapitalisierung, Sitz, Vorstandsvorsitz, Umsatz und was das Unternehmen in der Landwirtschaft macht. {profil}',
  detailDisclaimerStrong: '⚠️ Keine Anlageempfehlung.',
  detailDisclaimerText:
    'Informatives Unternehmensprofil. Kurs und Kennzahlen sind unverbindlich und zeitverzögert (Fundamentaldaten von Finnhub, Kursverlauf von Yahoo Finance). Aktieninvestitionen sind mit Risiken verbunden.',
  metricsTitle: 'Wichtige Kennzahlen',
  mCap: 'Marktkapitalisierung',
  mPe: 'KGV (TTM)',
  mDiv: 'Dividendenrendite',
  mInd: 'Branche',
  range52: '52-Wochen-Spanne',
  chartTitle: 'Kursverlauf',
  chartRangesAria: 'Zeitraum des Diagramms',
  chartLoading: 'Diagramm wird geladen…',
  chartSource: 'Quelle: Yahoo Finance · zeitverzögert',
  chartAria: 'Diagramm des Kursverlaufs',
  chartPeriodSuffix: ' % im Zeitraum',
  profileTitle: 'Was das Unternehmen macht',
  factHq: 'Hauptsitz',
  factFounded: 'Gegründet',
  factCeo: 'Vorstandsvorsitz (CEO)',
  factRevenue: 'Jahresumsatz',
  brandsTitleMulti: 'Marken dieses Unternehmens im Katalog',
  brandsTitleSingle: 'Modelle dieser Marke im Katalog',
  brandsLede: 'Sehen Sie sich Maschinenkatalog und Markenprofil direkt auf agro-svět an:',
  brandsModels: 'Modelle →',
  brandsProfile: 'Markenprofil →',
  logoAlt: 'Logo',
  repTitle: 'Vertretung im deutschsprachigen Raum',
  repLede: 'Vertrieb und Service übernimmt:',
  achievementsTitle: 'Die wichtigsten Erfolge und Meilensteine',
  linksTitle: 'Links',
  linkWeb: 'Offizielle Website des Unternehmens',
  linkCountry: 'Landwirtschaft — Profil des Landes, in dem das Unternehmen sitzt',
  linkAll: 'Alle Aktien von Agrarunternehmen',
  linkSales: 'Verkäufe von Landmaschinen in Europa',
};

export const content: Record<Locale, AkcieCopy> = { cs, pl, sk, uk, de };

export function akcieCopy(locale: string): AkcieCopy {
  return content[locale as Locale] ?? cs;
}
