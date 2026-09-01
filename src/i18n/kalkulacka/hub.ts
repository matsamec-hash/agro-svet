import type { Locale } from '../config';

export interface HubCard {
  slug: string;
  name: string;
  short: string;
  description: string;
  icon: string;
}

export interface HubContent {
  title: string;
  metaDescription: string;
  kicker: string;
  h1: string;
  lede: string;
  ctaOpen: string; // "Otevřít kalkulačku →"
  /** ItemList JSON-LD name (drží cs původní hodnotu kvůli byte-identitě). */
  itemListName: string;
  cards: HubCard[];
}

// ‼️ Mapa je ZÁMĚRNĚ Partial: locale bez překladu tu klíč prostě NEMÁ.
// Dřív tu stálo `uk: {} as XContent` — platný TypeScript, ale za běhu prázdný
// objekt, na který `content[locale] ?? content.cs` NESÁHNE (`{}` je truthy).
// Stránka pak četla `c.title` = undefined, Astro na tom utne SSR stream
// a URL vrátí HTTP 500. Deset /uk a /pl kalkulaček takhle padalo na produkci.
export const content: Partial<Record<Locale, HubContent>> = {
  cs: {
    title: 'Kalkulačky pro zemědělce — převody jednotek, leasing, náklady',
    metaDescription:
      'Interaktivní kalkulačky: převody jednotek plochy (ha, ar, m², akr, jitro), leasing traktoru, provozní náklady na hektar, dotace CAP a úspora nafty.',
    kicker: 'Nástroje · ekonomika farmy',
    h1: 'Kalkulačky pro zemědělce',
    lede: 'Otevřené, transparentní nástroje pro plánování investic a denního provozu. Spočítejte si splátky a náklady před tím, než zavoláte dealerovi — výsledky jsou jen pro orientaci, finální nabídku vždy ověřte u poskytovatele.',
    ctaOpen: 'Otevřít kalkulačku →',
    itemListName: 'Zemědělské kalkulačky',
    cards: [
      { slug: 'prevody-jednotek', name: 'Převody jednotek plochy', short: 'Převody jednotek', description: 'Hektar, ar, m², km², akr a historické jednotky (jitro, korec, strych, morgen) — okamžitý přepočet pro zemědělce, katastr i genealogii.', icon: '📐' },
      { slug: 'prevody-hmotnost', name: 'Převody jednotek hmotnosti', short: 'Převody hmotnosti', description: 'Tuna, metrický cent, kilogram, libra a bušl (pšenice, kukuřice, sója) — pro výkup, CBOT futures a porovnání US/EU výnosů.', icon: '⚖️' },
      { slug: 'leasing-traktoru', name: 'Kalkulačka leasingu traktoru', short: 'Leasing traktoru', description: 'Spočítejte měsíční splátku, celkové náklady a RPSN. Porovnání ČSOB Leasing, John Deere Financial, AGRI CS a AGROTEC.', icon: '💳' },
      { slug: 'naklady-na-hektar', name: 'Kalkulačka provozních nákladů na hektar', short: 'Náklady na hektar', description: 'Spotřeba nafty, výkon plochy a obsluha — celkové Kč/ha pro orbu, secí, postřik nebo sklizeň.', icon: '🌾' },
      { slug: 'dotace-cap', name: 'Kalkulačka dotací CAP 2024', short: 'Dotace CAP', description: 'Spočítejte přímé platby SZP 2023–2027: BISS, CISS, EKO, ANC i VCS pro citlivé sektory (chmel, ovoce, cukrová řepa…).', icon: '💶' },
      { slug: 'uspora-nafty', name: 'Kalkulačka úspory nafty', short: 'Úspora nafty', description: 'Porovnejte spotřebu dvou traktorů, roční náklady na naftu a dobu návratnosti investice. Podle emisní normy nebo vlastní měřené spotřeby.', icon: '⛽' },
      { slug: 'navratnost-kombajnu', name: 'Vyplatí se koupit kombajn?', short: 'Návratnost kombajnu', description: 'Koupit vlastní kombajn, nebo platit sklizeň jako službu? Zadejte hektary, sazbu a cenu stroje — kalkulačka najde bod zvratu.', icon: '🌾' },
      { slug: 'navratnost-postrikovace', name: 'Vyplatí se koupit postřikovač?', short: 'Návratnost postřikovače', description: 'Vlastní samojízdný postřikovač, nebo aplikace na zakázku? Spočítejte si bod zvratu podle ošetřené plochy.', icon: '💧' },
      { slug: 'navratnost-lisu', name: 'Vyplatí se koupit lis na balíky?', short: 'Návratnost lisu', description: 'Vlastní lis, nebo lisování na zakázku? Zadejte počet balíků za rok, cenu za balík a cenu stroje.', icon: '🎡' },
      { slug: 'navratnost-seciho-stroje', name: 'Vyplatí se koupit secí stroj?', short: 'Návratnost secího stroje', description: 'Vlastní secí kombinace, nebo setí na zakázku? Zadejte oseté hektary za rok, sazbu a cenu stroje.', icon: '🌱' },
      { slug: 'navratnost-rozmetadla', name: 'Vyplatí se koupit rozmetadlo?', short: 'Návratnost rozmetadla', description: 'Vlastní rozmetadlo hnojiv, nebo hnojení na zakázku? Zadejte pohnojené hektary za rok, sazbu a cenu stroje.', icon: '🧪' },
      { slug: 'navratnost-telehandleru', name: 'Vyplatí se koupit telehandler?', short: 'Návratnost telehandleru', description: 'Vlastní teleskopický manipulátor, nebo práce na zakázku? Zadejte odpracované hodiny za rok, sazbu a cenu stroje.', icon: '🏗️' },
    ],
  },
  sk: {
    title: 'Kalkulačky pre poľnohospodárov — prevody jednotiek, leasing, náklady',
    metaDescription:
      'Interaktívne kalkulačky: prevody jednotiek plochy (ha, ár, m², aker), leasing traktora, prevádzkové náklady na hektár a úspora nafty.',
    kicker: 'Nástroje · ekonomika farmy',
    h1: 'Kalkulačky pre poľnohospodárov',
    lede: 'Otvorené, transparentné nástroje na plánovanie investícií a dennej prevádzky. Vypočítajte si splátky a náklady skôr, než zavoláte predajcovi — výsledky sú len orientačné, finálnu ponuku vždy overte u poskytovateľa.',
    ctaOpen: 'Otvoriť kalkulačku →',
    itemListName: 'Poľnohospodárske kalkulačky',
    cards: [
      { slug: 'prevody-jednotek', name: 'Prevody jednotiek plochy', short: 'Prevody jednotiek', description: 'Hektár, ár, m², km², aker a historické jednotky — okamžitý prepočet pre poľnohospodárov, kataster aj genealógiu.', icon: '📐' },
      { slug: 'prevody-hmotnost', name: 'Prevody jednotiek hmotnosti', short: 'Prevody hmotnosti', description: 'Tona, metrický cent, kilogram, libra a bušel (pšenica, kukurica, sója) — pre výkup, CBOT futures a porovnanie US/EÚ výnosov.', icon: '⚖️' },
      { slug: 'leasing-traktoru', name: 'Kalkulačka leasingu traktora', short: 'Leasing traktora', description: 'Vypočítajte mesačnú splátku, celkové náklady a RPMN anuitnou metódou.', icon: '💳' },
      { slug: 'naklady-na-hektar', name: 'Kalkulačka prevádzkových nákladov na hektár', short: 'Náklady na hektár', description: 'Spotreba nafty, výkon plochy a obsluha — celkové €/ha pre orbu, sejbu, postrek alebo zber.', icon: '🌾' },
      { slug: 'uspora-nafty', name: 'Kalkulačka úspory nafty', short: 'Úspora nafty', description: 'Porovnajte spotrebu dvoch traktorov, ročné náklady na naftu a dobu návratnosti investície. Podľa emisnej normy alebo vlastnej meranej spotreby.', icon: '⛽' },
      { slug: 'navratnost-kombajnu', name: 'Oplatí sa kúpiť kombajn?', short: 'Návratnosť kombajnu', description: 'Kúpiť vlastný kombajn, alebo platiť zber ako službu? Zadajte hektáre, sadzbu a cenu stroja — kalkulačka nájde bod zvratu.', icon: '🌾' },
      { slug: 'navratnost-postrikovace', name: 'Oplatí sa kúpiť postrekovač?', short: 'Návratnosť postrekovača', description: 'Vlastný samochodný postrekovač, alebo aplikácia na zákazku? Spočítajte si bod zvratu podľa ošetrenej plochy.', icon: '💧' },
      { slug: 'navratnost-lisu', name: 'Oplatí sa kúpiť lis na balíky?', short: 'Návratnosť lisu', description: 'Vlastný lis, alebo lisovanie na zákazku? Zadajte počet balíkov za rok, cenu za balík a cenu stroja.', icon: '🎡' },
      { slug: 'navratnost-seciho-stroje', name: 'Oplatí sa kúpiť sejačku?', short: 'Návratnosť sejačky', description: 'Vlastná sejacia kombinácia, alebo sejba na zákazku? Zadajte osiate hektáre za rok, sadzbu a cenu stroja.', icon: '🌱' },
      { slug: 'navratnost-rozmetadla', name: 'Oplatí sa kúpiť rozmetadlo?', short: 'Návratnosť rozmetadla', description: 'Vlastné rozmetadlo hnojív, alebo hnojenie na zákazku? Zadajte pohnojené hektáre za rok, sadzbu a cenu stroja.', icon: '🧪' },
      { slug: 'navratnost-telehandleru', name: 'Oplatí sa kúpiť telehandler?', short: 'Návratnosť telehandlera', description: 'Vlastný teleskopický manipulátor, alebo práca na zákazku? Zadajte odpracované hodiny za rok, sadzbu a cenu stroja.', icon: '🏗️' },
    ],
  },
};
