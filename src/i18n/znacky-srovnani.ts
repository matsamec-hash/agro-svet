// Lokalizace stránek „značka vs značka" (/znacky/srovnani/<a>-vs-<b>/).
//
// PROČ: `/znacky` je launchnuté pro sk/pl/uk (detaily značek mají vlastní
// kolekce znacky-sk/pl/uk a jsou přeložené), ale srovnávací PODsekce zůstala
// „cs-only (v1)" — generátor v lib/brand-comparator.ts skládal věty natvrdo
// česky. Výsledek: 90 URL × 3 jazyky = 270 indexovaných stránek s českým
// titulkem, H1, H2 i tělem, přitom v sitemapě jako /sk|/pl|/uk.
//
// Názvy zemí se NEPŘEKLÁDAJÍ tady — `getBrand(slug, locale)` už vrací
// lokalizovanou `country` z overlaye /src/data/stroje/<locale>/<slug>.yaml
// (Německo / Nemecko / Niemcy / Німеччина). Stránka ho jen musela volat
// s locale, což nedělala.
//
// Jednotka výkonu zůstává „k" i v non-cs: celý katalog /stroje ji tak píše
// (např. /pl/stroje/traktory/ ukazuje „6–830 k"), takže lokalizovat ji jen
// na srovnávacích stránkách by uvnitř jednoho jazyka vytvořilo nekonzistenci.
import type { Locale } from './config';

export interface ZnackySrovnaniStrings {
  /** Výhody značky — vybírá je `edges()` podle statistik. */
  edgeHigherPower: string;
  edgeLowerPower: string;
  edgeCzechOrigin: string;
  edgeWiderRange: string;
  /** {year} */
  edgeTradition: string;
  /** {count} */
  edgeFallback: string;

  powerUnknown: string;
  /** {a}=značka, {edges}=spojené výhody */
  verdict: string;
  /** spojka mezi dvěma výhodami ve verdiktu */
  and: string;
  /** {a} {ca} {ma} {pa} {b} {cb} {mb} {pb} {ea} {eb} */
  tldr: string;
  /** {n} */
  models: string;

  faq1q: string; faq1a: string;
  faq2q: string; faq2a: string;
  faq3q: string; faq3a: string;
  faq4q: string; faq4aWinner: string; faq4aTie: string;
  shortDescription: string;

  // — chrome stránky —
  title: string;
  crumbBrands: string;
  crumbCompare: string;
  kicker: string;
  specHeading: string;
  specParam: string;
  duelsHeading: string;
  duelsOpen: string;
  decisionHeading: string;
  faqHeading: string;
  bazarKicker: string;
  bazarHeading: string;
  rowModelCount: string;
  rowPower: string;
  rowFounded: string;
  rowCountry: string;
  rowCategories: string;
  /** {year} — popisek v kartě značky */
  foundedIn: string;
  specNote: string;
  bazarNote: string;
  // — rozcestník /znacky/srovnani/ —
  hubTitle: string;
  hubDescription: string;
  hubPopular: string;
  hubCompare: string;
}

export const znackySrovnani: Record<Locale, ZnackySrovnaniStrings> = {
  cs: {
    edgeHigherPower: 'vyšší průměrný výkon — sedí na velké provozy a náročné nasazení',
    edgeLowerPower: 'nižší výkonovou třídu a dostupnost pro malé a střední farmy',
    edgeCzechOrigin: 'český původ — snazší servis a dostupnost dílů v ČR',
    edgeWiderRange: 'širší záběr kategorií strojů',
    edgeTradition: 'delší tradici (od roku {year})',
    edgeFallback: '{count} modelů v naší databázi',
    powerUnknown: 'neuvedeno',
    verdict: '{a} zvolte, když chcete {edges}.',
    and: ' a ',
    tldr: '{a} ({ca}, {ma} modelů, {pa}) vs {b} ({cb}, {mb} modelů, {pb}). Přednost {a}: {ea}; přednost {b}: {eb}.',
    models: '{n} modelů',
    faq1q: 'Je {a}, nebo {b} lepší?',
    faq1a: 'Záleží na využití. {va} {vb}',
    faq2q: 'Odkud pochází {a} a {b}?',
    faq2a: '{a} pochází z {ca} (značka od roku {fa}), {b} z {cb} (od roku {fb}).',
    faq3q: 'Kolik modelů {a} a {b} najdu na agro-svet.cz?',
    faq3a: '{a}: {ma} modelů ({pa}), {b}: {mb} modelů ({pb}).',
    faq4q: 'Která značka má vyšší výkon?',
    faq4aWinner: 'Nejvýkonnější model má {winner}.',
    faq4aTie: 'Obě značky nabízejí srovnatelný výkonový rozsah.',
    shortDescription: 'Srovnání značek {a} a {b}: výkon, počet modelů, pokryté kategorie a přímé souboje konkrétních modelů. Nezávislé porovnání na agro-svet.cz.',
    title: '{a} vs {b} — srovnání značek zemědělské techniky',
    crumbBrands: 'Značky',
    crumbCompare: 'Srovnání značek',
    kicker: 'Srovnání značek',
    specHeading: 'Značka vs značka',
    specParam: 'Parametr',
    duelsHeading: 'Přímé souboje modelů',
    duelsOpen: 'Otevřít',
    decisionHeading: 'Kdy {a}, kdy {b}',
    faqHeading: 'Časté otázky',
    bazarKicker: 'Bazar',
    bazarHeading: 'Prohlédnout {a} i {b} v bazaru',
    rowModelCount: 'Počet modelů',
    rowPower: 'Výkon',
    rowFounded: 'Založeno',
    rowCountry: 'Země původu',
    rowCategories: 'Kategorie strojů',
    foundedIn: 'založeno {year}',
    specNote: 'Data z databáze zemědělské techniky agro-svet.cz. „★" označuje vyšší hodnotu.',
    bazarNote: 'Aktuální nabídka ojetých strojů obou značek od prodejců i soukromníků.',
    hubTitle: 'Srovnání značek zemědělské techniky',
    hubDescription: 'Porovnejte značky traktorů a strojů vedle sebe — výkon, počet modelů, kategorie a přímé souboje konkrétních strojů.',
    hubPopular: 'Populární srovnání',
    hubCompare: 'Porovnat',
  },

  sk: {
    edgeHigherPower: 'vyšší priemerný výkon — sadne na veľké prevádzky a náročné nasadenie',
    edgeLowerPower: 'nižšiu výkonovú triedu a dostupnosť pre malé a stredné farmy',
    edgeCzechOrigin: 'český pôvod — jednoduchší servis a dostupnosť dielov v Česku a na Slovensku',
    edgeWiderRange: 'širší záber kategórií strojov',
    edgeTradition: 'dlhšiu tradíciu (od roku {year})',
    edgeFallback: '{count} modelov v našej databáze',
    powerUnknown: 'neuvedené',
    verdict: '{a} zvoľte, keď chcete {edges}.',
    and: ' a ',
    tldr: '{a} ({ca}, {ma} modelov, {pa}) vs {b} ({cb}, {mb} modelov, {pb}). Prednosť {a}: {ea}; prednosť {b}: {eb}.',
    models: '{n} modelov',
    faq1q: 'Je lepší {a}, alebo {b}?',
    faq1a: 'Závisí od využitia. {va} {vb}',
    faq2q: 'Odkiaľ pochádza {a} a {b}?',
    faq2a: '{a} pochádza z krajiny {ca} (značka od roku {fa}), {b} z krajiny {cb} (od roku {fb}).',
    faq3q: 'Koľko modelov {a} a {b} nájdem na agro-svet.cz?',
    faq3a: '{a}: {ma} modelov ({pa}), {b}: {mb} modelov ({pb}).',
    faq4q: 'Ktorá značka má vyšší výkon?',
    faq4aWinner: 'Najvýkonnejší model má {winner}.',
    faq4aTie: 'Obe značky ponúkajú porovnateľný výkonový rozsah.',
    shortDescription: 'Porovnanie značiek {a} a {b}: výkon, počet modelov, pokryté kategórie a priame súboje konkrétnych modelov. Nezávislé porovnanie na agro-svet.cz.',
    title: '{a} vs {b} — porovnanie značiek poľnohospodárskej techniky',
    crumbBrands: 'Značky',
    crumbCompare: 'Porovnanie značiek',
    kicker: 'Porovnanie značiek',
    specHeading: 'Značka vs značka',
    specParam: 'Parameter',
    duelsHeading: 'Priame súboje modelov',
    duelsOpen: 'Otvoriť',
    decisionHeading: 'Kedy {a}, kedy {b}',
    faqHeading: 'Časté otázky',
    bazarKicker: 'Bazár',
    bazarHeading: 'Pozrieť {a} aj {b} v bazári',
    rowModelCount: 'Počet modelov',
    rowPower: 'Výkon',
    rowFounded: 'Založené',
    rowCountry: 'Krajina pôvodu',
    rowCategories: 'Kategórie strojov',
    foundedIn: 'založené {year}',
    specNote: 'Dáta z databázy poľnohospodárskej techniky agro-svet.cz. „★" označuje vyššiu hodnotu.',
    bazarNote: 'Aktuálna ponuka jazdených strojov oboch značiek od predajcov aj súkromníkov.',
    hubTitle: 'Porovnanie značiek poľnohospodárskej techniky',
    hubDescription: 'Porovnajte značky traktorov a strojov vedľa seba — výkon, počet modelov, kategórie a priame súboje konkrétnych strojov.',
    hubPopular: 'Populárne porovnania',
    hubCompare: 'Porovnať',
  },

  pl: {
    edgeHigherPower: 'wyższą średnią moc — sprawdzi się w dużych gospodarstwach i przy ciężkiej pracy',
    edgeLowerPower: 'niższą klasę mocy i dostępność dla małych oraz średnich gospodarstw',
    edgeCzechOrigin: 'czeskie pochodzenie — łatwiejszy serwis i dostępność części w Europie Środkowej',
    edgeWiderRange: 'szerszy zakres kategorii maszyn',
    edgeTradition: 'dłuższą tradycję (od {year} roku)',
    edgeFallback: '{count} modeli w naszej bazie',
    powerUnknown: 'brak danych',
    verdict: '{a} wybierz, jeśli zależy ci na tym, co oferuje: {edges}.',
    and: ' oraz ',
    tldr: '{a} ({ca}, {ma} modeli, {pa}) vs {b} ({cb}, {mb} modeli, {pb}). Atut {a}: {ea}; atut {b}: {eb}.',
    models: '{n} modeli',
    faq1q: 'Co jest lepsze — {a} czy {b}?',
    faq1a: 'Zależy od zastosowania. {va} {vb}',
    faq2q: 'Skąd pochodzą marki {a} i {b}?',
    faq2a: '{a} pochodzi z kraju {ca} (marka od {fa} roku), {b} z kraju {cb} (od {fb} roku).',
    faq3q: 'Ile modeli {a} i {b} znajdę na agro-svet.cz?',
    faq3a: '{a}: {ma} modeli ({pa}), {b}: {mb} modeli ({pb}).',
    faq4q: 'Która marka ma wyższą moc?',
    faq4aWinner: 'Najmocniejszy model ma {winner}.',
    faq4aTie: 'Obie marki oferują porównywalny zakres mocy.',
    shortDescription: 'Porównanie marek {a} i {b}: moc, liczba modeli, obsługiwane kategorie i bezpośrednie starcia konkretnych modeli. Niezależne porównanie na agro-svet.cz.',
    title: '{a} vs {b} — porównanie marek maszyn rolniczych',
    crumbBrands: 'Marki',
    crumbCompare: 'Porównanie marek',
    kicker: 'Porównanie marek',
    specHeading: 'Marka vs marka',
    specParam: 'Parametr',
    duelsHeading: 'Bezpośrednie starcia modeli',
    duelsOpen: 'Otwórz',
    decisionHeading: 'Kiedy {a}, a kiedy {b}',
    faqHeading: 'Częste pytania',
    bazarKicker: 'Giełda',
    bazarHeading: 'Zobacz {a} i {b} na giełdzie',
    rowModelCount: 'Liczba modeli',
    rowPower: 'Moc',
    rowFounded: 'Założona',
    rowCountry: 'Kraj pochodzenia',
    rowCategories: 'Kategorie maszyn',
    foundedIn: 'założona w {year}',
    specNote: 'Dane z bazy maszyn rolniczych agro-svet.cz. „★" oznacza wyższą wartość.',
    bazarNote: 'Aktualna oferta używanych maszyn obu marek od dealerów i osób prywatnych.',
    hubTitle: 'Porównanie marek maszyn rolniczych',
    hubDescription: 'Porównaj marki ciągników i maszyn obok siebie — moc, liczba modeli, kategorie i bezpośrednie starcia konkretnych maszyn.',
    hubPopular: 'Popularne porównania',
    hubCompare: 'Porównaj',
  },

  uk: {
    edgeHigherPower: 'вищу середню потужність — підходить для великих господарств і важких робіт',
    edgeLowerPower: 'нижчий клас потужності та доступність для малих і середніх господарств',
    edgeCzechOrigin: 'чеське походження — простіший сервіс і доступність запчастин у Центральній Європі',
    edgeWiderRange: 'ширший спектр категорій техніки',
    edgeTradition: 'довшу традицію (з {year} року)',
    edgeFallback: '{count} моделей у нашій базі',
    powerUnknown: 'не вказано',
    verdict: '{a} обирайте, якщо вам потрібно: {edges}.',
    and: ' та ',
    tldr: '{a} ({ca}, моделей: {ma}, {pa}) vs {b} ({cb}, моделей: {mb}, {pb}). Перевага {a}: {ea}; перевага {b}: {eb}.',
    models: 'моделей: {n}',
    faq1q: 'Що краще — {a} чи {b}?',
    faq1a: 'Залежить від застосування. {va} {vb}',
    faq2q: 'Звідки походять марки {a} і {b}?',
    faq2a: '{a} походить з країни {ca} (марка з {fa} року), {b} — з країни {cb} (з {fb} року).',
    faq3q: 'Скільки моделей {a} і {b} є на agro-svet.cz?',
    faq3a: '{a}: моделей {ma} ({pa}), {b}: моделей {mb} ({pb}).',
    faq4q: 'Яка марка має вищу потужність?',
    faq4aWinner: 'Найпотужніша модель у марки {winner}.',
    faq4aTie: 'Обидві марки пропонують порівнянний діапазон потужності.',
    shortDescription: 'Порівняння марок {a} і {b}: потужність, кількість моделей, охоплені категорії та прямі зіставлення конкретних моделей. Незалежне порівняння на agro-svet.cz.',
    title: '{a} vs {b} — порівняння марок сільськогосподарської техніки',
    crumbBrands: 'Марки',
    crumbCompare: 'Порівняння марок',
    kicker: 'Порівняння марок',
    specHeading: 'Марка проти марки',
    specParam: 'Параметр',
    duelsHeading: 'Прямі зіставлення моделей',
    duelsOpen: 'Відкрити',
    decisionHeading: 'Коли {a}, а коли {b}',
    faqHeading: 'Часті запитання',
    bazarKicker: 'Барахолка',
    bazarHeading: 'Переглянути {a} і {b} на барахолці',
    rowModelCount: 'Кількість моделей',
    rowPower: 'Потужність',
    rowFounded: 'Засновано',
    rowCountry: 'Країна походження',
    rowCategories: 'Категорії техніки',
    foundedIn: 'засновано {year}',
    specNote: 'Дані з бази сільськогосподарської техніки agro-svet.cz. „★" позначає вище значення.',
    bazarNote: 'Актуальні пропозиції вживаної техніки обох марок від дилерів і приватних осіб.',
    hubTitle: 'Порівняння марок сільськогосподарської техніки',
    hubDescription: 'Порівняйте марки тракторів і техніки поруч — потужність, кількість моделей, категорії та прямі зіставлення конкретних машин.',
    hubPopular: 'Популярні порівняння',
    hubCompare: 'Порівняти',
  },
};

/** Dosadí {placeholdery}. Chybějící klíč nechá text beze změny (nespadne). */
export function fill(tpl: string, vars: Record<string, string | number>): string {
  return tpl.replace(/\{(\w+)\}/g, (m, k) => (k in vars ? String(vars[k]) : m));
}

export function srovnaniStrings(locale: Locale): ZnackySrovnaniStrings {
  return znackySrovnani[locale] ?? znackySrovnani.cs;
}
