import type { Locale } from '../config';
import type { CalcMeta, CalcCurrency } from './types';
import type { EmisniNorma } from '../../lib/diesel-calc';

export interface UsporaNaftyContent extends CalcMeta, CalcCurrency {
  form: {
    tractorA: string; tractorB: string;
    power: string; norma: string; ownConsumption: string; ownConsumptionHint: string;
    contextLegend: string; hours: string; price: string; investDiff: string; submit: string;
    phPowerA: string; phPowerB: string; phOwnConsumption: string; phHours: string; phPrice: string; phInvest: string;
  };
  result: {
    yearlyKicker: string; consumption: string; yearly: string; costs: string;
    fiveYear: string; payback: string; tractorACard: string; tractorBCard: string;
  };
  js: { perYear: string; vsA: string; unitL: string; unitLh: string; months: string; years: string; alertFill: string };
  normaLabels: Record<EmisniNorma, string>;
  hpUnit: string;
  disclaimer: string;
  howItWorks: { heading: string; intro: string; bullets: { strong: string; rest: string }[]; outro: string };
  related: { heading: string; links: { href: string; label: string }[] };
  defaults: { hours: number; price: number };
}

export const content: Record<Locale, UsporaNaftyContent> = {
  cs: {
    title: 'Kalkulačka úspory nafty mezi traktory',
    metaDescription: 'Spočítejte, kolik ušetříte na naftě při výměně traktoru — porovnání spotřeby dvou modelů, roční náklady a doba návratnosti investice.',
    h1: 'Kolik ušetříte výměnou traktoru',
    crumb: 'Úspora nafty',
    kicker: 'Kalkulačka · Úspora nafty',
    lede: 'Porovnání spotřeby a ročních nákladů na naftu mezi dvěma traktory. Roční úspora, 5letá úspora a doba návratnosti, pokud znáte rozdíl pořizovacích cen.',
    currency: 'CZK',
    numberLocale: 'cs-CZ',
    form: {
      tractorA: 'Traktor A (stávající)', tractorB: 'Traktor B (nový / cílový)',
      power: 'Výkon (k)', norma: 'Emisní norma', ownConsumption: 'Vlastní spotřeba (l/h)', ownConsumptionHint: '— volitelné',
      contextLegend: 'Provoz', hours: 'Roční využití (motohodin)', price: 'Cena nafty (Kč/l)', investDiff: 'Rozdíl ceny B vs A (Kč)', submit: 'Spočítat úsporu →',
      phPowerA: 'např. 130', phPowerB: 'např. 150', phOwnConsumption: 'přepíše odhad', phHours: 'např. 800', phPrice: 'např. 32', phInvest: 'kolik B stojí navíc',
    },
    result: {
      yearlyKicker: 'Roční úspora', consumption: 'Spotřeba:', yearly: 'Roční:', costs: 'Náklady:',
      fiveYear: 'Úspora za 5 let', payback: 'Návratnost investice', tractorACard: 'Traktor A', tractorBCard: 'Traktor B',
    },
    js: { perYear: ' / rok', vsA: ' proti A', unitL: 'l', unitLh: 'l/h', months: 'měsíců', years: 'let', alertFill: 'Vyplňte výkon obou traktorů, roční využití a cenu nafty.' },
    normaLabels: {
      'pre-tier2': 'Před 2006 (Tier 1/Stage I-II)', 'tier3': 'Tier 3 (2006–2011, EGR)',
      'stage3b': 'Stage IIIB (2011–2014, DPF)', 'stage4': 'Stage IV (2014–2019, SCR)', 'stage5': 'Stage V (2020+, DPF + SCR)',
    },
    hpUnit: 'k',
    disclaimer: '⚠️ Orientační odhad podle DLG profi-testových průměrů. Reálná spotřeba ±20 % podle typu práce, údržby a stylu jízdy. Nezahrnuje AdBlue (~4 % nafty navíc) ani jiné provozní náklady (oleje, filtry, servis).',
    howItWorks: {
      heading: 'Jak kalkulačka funguje',
      intro: 'Spotřeba se odhaduje podle <strong>specifické spotřeby paliva</strong> (g/kWh) typické pro danou emisní normu motoru:',
      bullets: [
        { strong: 'Před 2006 (Tier 1/Stage I-II):', rest: ' ~260 g/kWh — staré motory bez after-treatment' },
        { strong: 'Tier 3 (2006–2011):', rest: ' ~240 g/kWh — EGR, bez DPF' },
        { strong: 'Stage IIIB (2011–2014):', rest: ' ~230 g/kWh — DPF povinný' },
        { strong: 'Stage IV (2014–2019):', rest: ' ~215 g/kWh — SCR (AdBlue) snížil spotřebu' },
        { strong: 'Stage V (2020+):', rest: ' ~210 g/kWh — optimalizovaná SCR + DPF' },
      ],
      outro: 'Pro průměrnou práci se počítá s ~60 % zatížením nominálního výkonu (mix tah + PTO + transport). Pokud znáte měřenou spotřebu vlastního stroje, přepište výchozí odhad v poli „Vlastní spotřeba".',
    },
    related: {
      heading: 'Související',
      links: [
        { href: '/kalkulacka/dotace-cap/', label: 'Kalkulačka dotací CAP 2024' },
        { href: '/kalkulacka/leasing-traktoru/', label: 'Kalkulačka leasingu traktoru' },
        { href: '/kalkulacka/naklady-na-hektar/', label: 'Kalkulačka nákladů na hektar' },
        { href: '/slovnik/adblue/', label: 'Co je AdBlue (slovník)' },
        { href: '/slovnik/emisni-normy-stage/', label: 'Emisní normy Stage / Tier (slovník)' },
      ],
    },
    defaults: { hours: 800, price: 32 },
    faq: [
      { q: 'Jak přesná je odhadovaná spotřeba?', a: 'Spotřeba vychází z DLG profi-testů a OECD traktorových testů — průměry pro průměrné využití (~60 % nominálního výkonu, mix tah/PTO/transport). Reálná spotřeba se může lišit o ±20 % podle typu práce, kvality údržby a zkušenosti řidiče. Pro přesný odhad sledujte spotřebu na vlastním stroji aspoň 100 motohodin.' },
      { q: 'Proč je nový traktor Stage V úspornější než starší Stage IV?', a: 'Stage V (od 2020) má optimalizovanou kombinaci DPF + SCR a vylepšené motorové mapy. Specifická spotřeba klesla z ~215 g/kWh (Stage IV) na ~210 g/kWh (Stage V). Rozdíl 2–3 % se projeví na celoroční úspoře desítkami tisíc Kč u stroje s 800+ motohodin/rok.' },
      { q: 'Zahrnuje kalkulačka AdBlue?', a: 'Ne — kalkulačka počítá jen naftu. AdBlue je 3–5 % objemu nafty (~15 Kč/l v IBC), takže přidejte cca 4 % k vypočteným ročním nákladům, pokud chcete kompletní obraz provozních nákladů.' },
      { q: 'Kolik let návratnosti je rozumné?', a: 'Návratnost <3 roky je excellent (kupte hned). 3–5 let je rozumná (vyplatí se, pokud plánujete stroj držet 10+ let). 5–10 let je hraniční (zvažte i jiné faktory — komfort, technologie, servis). Nad 10 let se úspora nafty nezaplatí — investice musí zaplatit jiné benefity (precision farming, vyšší výkon).' },
      { q: 'Co když mám velmi specifické využití (např. jen tah)?', a: 'V poli "spotřeba l/h" můžete přepsat výchozí odhad vlastním údajem. Pokud znáte měřenou spotřebu z vašeho aktuálního stroje při typické práci, použijte tu. Pro nový stroj odhadněte na základě DLG testů konkrétního modelu (Profi DLG Test publikuje detailní data).' },
    ],
  },
  sk: {
    title: 'Kalkulačka úspory nafty medzi traktormi',
    metaDescription: 'Vypočítajte, koľko ušetríte na nafte pri výmene traktora — porovnanie spotreby dvoch modelov, ročné náklady a doba návratnosti investície.',
    h1: 'Koľko ušetríte výmenou traktora',
    crumb: 'Úspora nafty',
    kicker: 'Kalkulačka · Úspora nafty',
    lede: 'Porovnanie spotreby a ročných nákladov na naftu medzi dvoma traktormi. Ročná úspora, 5-ročná úspora a doba návratnosti, ak poznáte rozdiel obstarávacích cien.',
    currency: 'EUR',
    numberLocale: 'sk-SK',
    form: {
      tractorA: 'Traktor A (súčasný)', tractorB: 'Traktor B (nový / cieľový)',
      power: 'Výkon (k)', norma: 'Emisná norma', ownConsumption: 'Vlastná spotreba (l/h)', ownConsumptionHint: '— voliteľné',
      contextLegend: 'Prevádzka', hours: 'Ročné využitie (motohodín)', price: 'Cena nafty (€/l)', investDiff: 'Rozdiel ceny B vs A (€)', submit: 'Vypočítať úsporu →',
      phPowerA: 'napr. 130', phPowerB: 'napr. 150', phOwnConsumption: 'prepíše odhad', phHours: 'napr. 800', phPrice: 'napr. 1,3', phInvest: 'o koľko B stojí viac',
    },
    result: {
      yearlyKicker: 'Ročná úspora', consumption: 'Spotreba:', yearly: 'Ročne:', costs: 'Náklady:',
      fiveYear: 'Úspora za 5 rokov', payback: 'Návratnosť investície', tractorACard: 'Traktor A', tractorBCard: 'Traktor B',
    },
    js: { perYear: ' / rok', vsA: ' proti A', unitL: 'l', unitLh: 'l/h', months: 'mesiacov', years: 'rokov', alertFill: 'Vyplňte výkon oboch traktorov, ročné využitie a cenu nafty.' },
    normaLabels: {
      'pre-tier2': 'Pred 2006 (Tier 1/Stage I–II)', 'tier3': 'Tier 3 (2006–2011, EGR)',
      'stage3b': 'Stage IIIB (2011–2014, DPF)', 'stage4': 'Stage IV (2014–2019, SCR)', 'stage5': 'Stage V (2020+, DPF + SCR)',
    },
    hpUnit: 'k',
    disclaimer: '⚠️ Orientačný odhad podľa priemerov DLG profi-testov. Reálna spotreba ±20 % podľa typu práce, údržby a štýlu jazdy. Nezahŕňa AdBlue (~4 % nafty navyše) ani iné prevádzkové náklady (oleje, filtre, servis).',
    howItWorks: {
      heading: 'Ako kalkulačka funguje',
      intro: 'Spotreba sa odhaduje podľa <strong>špecifickej spotreby paliva</strong> (g/kWh) typickej pre danú emisnú normu motora:',
      bullets: [
        { strong: 'Pred 2006 (Tier 1/Stage I–II):', rest: ' ~260 g/kWh — staré motory bez after-treatmentu' },
        { strong: 'Tier 3 (2006–2011):', rest: ' ~240 g/kWh — EGR, bez DPF' },
        { strong: 'Stage IIIB (2011–2014):', rest: ' ~230 g/kWh — DPF povinný' },
        { strong: 'Stage IV (2014–2019):', rest: ' ~215 g/kWh — SCR (AdBlue) znížil spotrebu' },
        { strong: 'Stage V (2020+):', rest: ' ~210 g/kWh — optimalizovaná SCR + DPF' },
      ],
      outro: 'Pre priemernú prácu sa počíta s ~60 % zaťažením nominálneho výkonu (mix ťah + PTO + transport). Ak poznáte meranú spotrebu vlastného stroja, prepíšte východiskový odhad v poli „Vlastná spotreba".',
    },
    related: {
      heading: 'Súvisiace',
      links: [
        { href: '/kalkulacka/leasing-traktoru/', label: 'Kalkulačka leasingu traktora' },
        { href: '/kalkulacka/naklady-na-hektar/', label: 'Kalkulačka nákladov na hektár' },
        { href: '/kalkulacka/prevody-jednotek/', label: 'Prevody jednotiek plochy' },
        { href: '/kalkulacka/prevody-hmotnost/', label: 'Prevody jednotiek hmotnosti' },
        { href: '/slovnik/adblue/', label: 'Čo je AdBlue (slovník)' },
      ],
    },
    defaults: { hours: 800, price: 1.3 },
    faq: [
      { q: 'Aká presná je odhadovaná spotreba?', a: 'Spotreba vychádza z DLG profi-testov a OECD traktorových testov — priemery pre priemerné využitie (~60 % nominálneho výkonu, mix ťah/PTO/transport). Reálna spotreba sa môže líšiť o ±20 % podľa typu práce, kvality údržby a skúseností vodiča. Pre presný odhad sledujte spotrebu na vlastnom stroji aspoň 100 motohodín.' },
      { q: 'Prečo je nový traktor Stage V úspornejší než starší Stage IV?', a: 'Stage V (od 2020) má optimalizovanú kombináciu DPF + SCR a vylepšené motorové mapy. Špecifická spotreba klesla z ~215 g/kWh (Stage IV) na ~210 g/kWh (Stage V). Rozdiel 2–3 % sa prejaví na celoročnej úspore desiatkami tisíc € u stroja s 800+ motohodinami/rok.' },
      { q: 'Zahŕňa kalkulačka AdBlue?', a: 'Nie — kalkulačka počíta len naftu. AdBlue je 3–5 % objemu nafty, takže pridajte cca 4 % k vypočítaným ročným nákladom, ak chcete kompletný obraz prevádzkových nákladov.' },
      { q: 'Koľko rokov návratnosti je rozumné?', a: 'Návratnosť <3 roky je excelentná (kúpte hneď). 3–5 rokov je rozumná (oplatí sa, ak plánujete stroj držať 10+ rokov). 5–10 rokov je hraničná (zvážte aj iné faktory — komfort, technológie, servis). Nad 10 rokov sa úspora nafty nezaplatí — investíciu musia zaplatiť iné benefity (precision farming, vyšší výkon).' },
      { q: 'Čo ak mám veľmi špecifické využitie (napr. len ťah)?', a: 'V poli "spotreba l/h" môžete prepísať východiskový odhad vlastným údajom. Ak poznáte meranú spotrebu z vášho aktuálneho stroja pri typickej práci, použite ju. Pre nový stroj odhadnite na základe DLG testov konkrétneho modelu (Profi DLG Test publikuje detailné dáta).' },
    ],
  },
  uk: {} as UsporaNaftyContent,
};
