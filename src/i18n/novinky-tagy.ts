// Překlad ŠTÍTKŮ a KATEGORIÍ novinek pro ne-cs jazyky.
//
// PROČ NE V DATABÁZI: `articles.tags` a `articles.category` slouží ZÁROVEŇ
// české verzi — přepsat je polsky by rozbilo cs. Tabulka `article_translations`
// sloupce pro štítky ani kategorii nemá, takže oprava v datech by znamenala
// migraci schématu na produkci. Mapa v kódu je bezpečnější a vratná.
//
// PROČ NE V ui/*.ts: bylo by to ~40 klíčů × 4 jazyky navíc v paritním testu,
// přestože uk novinky vůbec nezobrazuje (HIDDEN_NEWS_CATEGORIES).
//
// Klíč = přesná cs hodnota z DB. Co tu není, propadne beze změny (raději
// český štítek než vymyšlený překlad).

type TagMap = Record<string, string>;

const PL: TagMap = {
  // kategorie
  'Zemědělství': 'Rolnictwo',
  'zemědělství': 'rolnictwo',
  // štítky
  'udržitelné zemědělství': 'zrównoważone rolnictwo',
  'udržitelnost': 'zrównoważony rozwój',
  'klimatické změny': 'zmiany klimatu',
  'české zemědělství': 'czeskie rolnictwo',
  'mladí zemědělci': 'młodzi rolnicy',
  'precizní zemědělství': 'rolnictwo precyzyjne',
  'zemědělské inovace': 'innowacje rolnicze',
  'ekologické zemědělství': 'rolnictwo ekologiczne',
  'pěstování': 'uprawa',
  'půda': 'gleba',
  'zemědělské dotace': 'dopłaty rolnicze',
  'český venkov': 'czeska wieś',
  'přímé platby': 'płatności bezpośrednie',
  'české farmy': 'czeskie gospodarstwa',
  'česká krajina': 'czeski krajobraz',
  'česká farma': 'czeskie gospodarstwo',
  'zemědělská produkce': 'produkcja rolna',
  'zemědělská budoucnost': 'przyszłość rolnictwa',
  'lanýže': 'trufle',
  'sklizeň': 'zbiór',
  'podpora farmářů': 'wsparcie rolników',
  'ekologická udržitelnost': 'zrównoważenie ekologiczne',
  'generační obměna': 'wymiana pokoleniowa',
  'generační výměna v zemědělství': 'wymiana pokoleniowa w rolnictwie',
  'podpora mladých farmářů': 'wsparcie młodych rolników',
  'zemědělství ČR': 'rolnictwo w Czechach',
  'udržitelné zemědělské praktiky': 'zrównoważone praktyki rolnicze',
  'snižování emisí': 'redukcja emisji',
  'biodiverzita v zemědělství': 'bioróżnorodność w rolnictwie',
  'inovace v zemědělství': 'innowacje w rolnictwie',
  'dotační program': 'program dopłat',
  'alternativní pohony': 'napędy alternatywne',
  'úrodnost': 'żyzność',
  'genetická modifikace': 'modyfikacja genetyczna',
  'obnovitelné zdroje': 'odnawialne źródła energii',
  'energetická úspora': 'oszczędność energii',
  'ekologické praktiky': 'praktyki ekologiczne',
  'speciální plodiny': 'rośliny specjalne',
  'výzvy': 'wyzwania',
  'místní produkce': 'produkcja lokalna',
  'lokální produkty': 'produkty lokalne',
  'mladí lidé': 'młodzi ludzie',
  'žádost o dotaci': 'wniosek o dopłatę',
  'zemědělské podnikání': 'przedsiębiorczość rolna',
  'technologická inovace': 'innowacja technologiczna',
  'odrůdy': 'odmiany',
  'tradiční plodiny': 'rośliny tradycyjne',
  'kulturní dědictví': 'dziedzictwo kulturowe',
  'udržitelné pěstování': 'zrównoważona uprawa',
  'ekologie': 'ekologia',
  'Novinky a zprávy': 'Aktualności',
};

const SK: TagMap = {
  'Zemědělství': 'Poľnohospodárstvo',
  'zemědělství': 'poľnohospodárstvo',
  'udržitelné zemědělství': 'udržateľné poľnohospodárstvo',
  'udržitelnost': 'udržateľnosť',
  'klimatické změny': 'klimatické zmeny',
  'české zemědělství': 'české poľnohospodárstvo',
  'mladí zemědělci': 'mladí poľnohospodári',
  'precizní zemědělství': 'presné poľnohospodárstvo',
  'zemědělské inovace': 'poľnohospodárske inovácie',
  'ekologické zemědělství': 'ekologické poľnohospodárstvo',
  'pěstování': 'pestovanie',
  'půda': 'pôda',
  'zemědělské dotace': 'poľnohospodárske dotácie',
  'český venkov': 'český vidiek',
  'přímé platby': 'priame platby',
  'české farmy': 'české farmy',
  'česká krajina': 'česká krajina',
  'česká farma': 'česká farma',
  'zemědělská produkce': 'poľnohospodárska produkcia',
  'zemědělská budoucnost': 'budúcnosť poľnohospodárstva',
  'lanýže': 'hľuzovky',
  'sklizeň': 'zber',
  'podpora farmářů': 'podpora farmárov',
  'ekologická udržitelnost': 'ekologická udržateľnosť',
  'generační obměna': 'generačná obmena',
  'generační výměna v zemědělství': 'generačná výmena v poľnohospodárstve',
  'podpora mladých farmářů': 'podpora mladých farmárov',
  'zemědělství ČR': 'poľnohospodárstvo ČR',
  'udržitelné zemědělské praktiky': 'udržateľné poľnohospodárske praktiky',
  'snižování emisí': 'znižovanie emisií',
  'biodiverzita v zemědělství': 'biodiverzita v poľnohospodárstve',
  'inovace v zemědělství': 'inovácie v poľnohospodárstve',
  'dotační program': 'dotačný program',
  'alternativní pohony': 'alternatívne pohony',
  'úrodnost': 'úrodnosť',
  'genetická modifikace': 'genetická modifikácia',
  'obnovitelné zdroje': 'obnoviteľné zdroje',
  'energetická úspora': 'úspora energie',
  'ekologické praktiky': 'ekologické praktiky',
  'speciální plodiny': 'špeciálne plodiny',
  'výzvy': 'výzvy',
  'místní produkce': 'miestna produkcia',
  'lokální produkty': 'lokálne produkty',
  'mladí lidé': 'mladí ľudia',
  'žádost o dotaci': 'žiadosť o dotáciu',
  'zemědělské podnikání': 'poľnohospodárske podnikanie',
  'technologická inovace': 'technologická inovácia',
  'odrůdy': 'odrody',
  'tradiční plodiny': 'tradičné plodiny',
  'kulturní dědictví': 'kultúrne dedičstvo',
  'udržitelné pěstování': 'udržateľné pestovanie',
  'ekologie': 'ekológia',
  'Novinky a zprávy': 'Novinky a správy',
};

const MAPS: Record<string, TagMap> = { pl: PL, sk: SK };

/** Lokalizovaný štítek/kategorie; cs a neznámé hodnoty vrací vstup beze změny. */
export function localizedTag(locale: string, tag: string): string {
  if (locale === 'cs') return tag;
  return MAPS[locale]?.[tag] ?? tag;
}
