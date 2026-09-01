// Kalkulačka návratnosti stroje — „koupit vs. platit službu".
// Sdílený i18n základ (base) + per-stroj overrides → cs/sk parita klíčů drží
// automaticky (test kalkulacka.test.ts). Defaulty (čísla) jsou mimo i18n.
import type { Locale } from '../config';
import type { CalcMeta, CalcCurrency } from './types';

export interface NavratnostContent extends CalcMeta, CalcCurrency {
  /** Skloňovaný název stroje pro nadpisy ("kombajn"). */
  noun: string;
  /** Jednotka množství ("ha", "balíků"). */
  unit: string;
  /** Sekce formuláře. */
  sectionA: string;
  sectionB: string;
  form: {
    qty: string;
    serviceRate: string;
    price: string;
    years: string;
    residual: string;
    fuel: string;
    fuelPrice: string;
    maint: string;
    labor: string;
    fixed: string;
    extra: string;
    yearsUnit: string;
  };
  result: {
    ownAnnual: string;
    serviceAnnual: string;
    ownPerUnit: string;
    servicePerUnit: string;
    breakeven: string;
    lifeDiff: string;
  };
  js: {
    buy: string;
    service: string;
    saveYear: string;
    overLife: string;
    breakevenUnit: string;
    neverPays: string;
    perYear: string;
  };
  cta: { kicker: string; heading: string; catalog: string; compare: string; costs: string };
}

export interface MachineDefaults {
  qty: number;
  serviceRate: number;
  price: number;
  years: number;
  residual: number; // %
  fuel: number; // l/jednotku
  fuelPrice: number; // Kč/l
  maint: number; // Kč/jednotku
  labor: number; // Kč/jednotku
  fixed: number; // % z ceny / rok
  extra: number; // služby pro ostatní (jednotek/rok)
  qtyMax: number;
}

// ── sdílené labely ────────────────────────────────────────────────────────
const baseCs = {
  currency: 'CZK' as const,
  numberLocale: 'cs-CZ' as const,
  kicker: 'Investice · ekonomika stroje',
  sectionA: 'Vaše pole a služba',
  sectionB: 'Vlastní stroj',
  form: {
    qty: 'Kolik toho ročně zpracujete',
    serviceRate: 'Cena služby (na zakázku)',
    price: 'Pořizovací cena stroje',
    years: 'Jak dlouho stroj plánujete používat',
    residual: 'Zůstatková hodnota po dosloužení',
    fuel: 'Spotřeba nafty',
    fuelPrice: 'Cena nafty',
    maint: 'Údržba a opravy',
    labor: 'Obsluha (mzda)',
    fixed: 'Fixní náklady ročně (pojištění, garáž, kapitál)',
    extra: 'Navíc odsloužíte pro ostatní (příjem)',
    yearsUnit: 'let',
  },
  result: {
    ownAnnual: 'Vlastní stroj — náklad/rok',
    serviceAnnual: 'Služba — náklad/rok',
    ownPerUnit: 'Vlastní — náklad',
    servicePerUnit: 'Služba — cena',
    breakeven: 'Bod zvratu (vyplatí se koupit od)',
    lifeDiff: 'Rozdíl za celou dobu',
  },
  js: {
    buy: 'Vyplatí se KOUPIT',
    service: 'Levnější je SLUŽBA',
    saveYear: 'Ušetříte',
    overLife: 'za celou dobu',
    breakevenUnit: 'ročně',
    neverPays: 'Sazba služby je nižší než vaše provozní náklady — vlastní stroj se v tomto případě nevyplatí.',
    perYear: '/rok',
  },
  cta: {
    kicker: 'Ještě vybíráte stroj?',
    heading: 'Projděte katalog strojů nebo si porovnejte náklady na hektar',
    catalog: 'Katalog strojů',
    compare: 'Návratnost dalších strojů',
    costs: 'Náklady na hektar',
  },
  faq: [
    { q: 'Jak kalkulačka počítá?', a: 'Porovná roční náklad vlastního stroje (odpis + fixní náklady + provoz na jednotku × množství, minus případný příjem ze služeb pro ostatní) s cenou služby na zakázku (sazba × množství). Bod zvratu je množství, od kterého je vlastnictví levnější.' },
    { q: 'Co je bod zvratu?', a: 'Množství práce za rok, při kterém se roční náklad vlastního stroje rovná ceně služby. Nad tímto množstvím se vyplatí koupit, pod ním je levnější platit službu.' },
    { q: 'Jak počítáte odpis?', a: 'Rovnoměrně: (pořizovací cena − zůstatková hodnota) ÷ počet let používání. Je to zjednodušení skutečného poklesu hodnoty, ale pro rozhodnutí koupit/služba dostačuje.' },
    { q: 'Jsou výsledky přesné?', a: 'Jsou orientační — slouží k rychlému porovnání. Nezahrnují daně, dotace na techniku ani riziko prostojů. Před investicí si nechte spočítat detailní kalkulaci.' },
  ],
};

const baseSk = {
  currency: 'CZK' as const, // ČR nástroj; sk verzia zdieľa CZK
  numberLocale: 'sk-SK' as const,
  kicker: 'Investícia · ekonomika stroja',
  sectionA: 'Vaše pole a služba',
  sectionB: 'Vlastný stroj',
  form: {
    qty: 'Koľko ročne spracujete',
    serviceRate: 'Cena služby (na zákazku)',
    price: 'Obstarávacia cena stroja',
    years: 'Ako dlho stroj plánujete používať',
    residual: 'Zostatková hodnota po doslúžení',
    fuel: 'Spotreba nafty',
    fuelPrice: 'Cena nafty',
    maint: 'Údržba a opravy',
    labor: 'Obsluha (mzda)',
    fixed: 'Fixné náklady ročne (poistenie, garáž, kapitál)',
    extra: 'Navyše odslúžite pre ostatných (príjem)',
    yearsUnit: 'rokov',
  },
  result: {
    ownAnnual: 'Vlastný stroj — náklad/rok',
    serviceAnnual: 'Služba — náklad/rok',
    ownPerUnit: 'Vlastný — náklad',
    servicePerUnit: 'Služba — cena',
    breakeven: 'Bod zvratu (oplatí sa kúpiť od)',
    lifeDiff: 'Rozdiel za celú dobu',
  },
  js: {
    buy: 'Oplatí sa KÚPIŤ',
    service: 'Lacnejšia je SLUŽBA',
    saveYear: 'Ušetríte',
    overLife: 'za celú dobu',
    breakevenUnit: 'ročne',
    neverPays: 'Sadzba služby je nižšia než vaše prevádzkové náklady — vlastný stroj sa v tomto prípade neoplatí.',
    perYear: '/rok',
  },
  cta: {
    kicker: 'Ešte vyberáte stroj?',
    heading: 'Prejdite katalóg strojov alebo si porovnajte náklady na hektár',
    catalog: 'Katalóg strojov',
    compare: 'Návratnosť ďalších strojov',
    costs: 'Náklady na hektár',
  },
  faq: [
    { q: 'Ako kalkulačka počíta?', a: 'Porovná ročný náklad vlastného stroja (odpis + fixné náklady + prevádzka na jednotku × množstvo, mínus prípadný príjem zo služieb pre ostatných) s cenou služby na zákazku (sadzba × množstvo). Bod zvratu je množstvo, od ktorého je vlastníctvo lacnejšie.' },
    { q: 'Čo je bod zvratu?', a: 'Množstvo práce za rok, pri ktorom sa ročný náklad vlastného stroja rovná cene služby. Nad ním sa oplatí kúpiť, pod ním je lacnejšie platiť službu.' },
    { q: 'Ako počítate odpis?', a: 'Rovnomerne: (obstarávacia cena − zostatková hodnota) ÷ počet rokov používania. Je to zjednodušenie, ale na rozhodnutie kúpiť/služba postačuje.' },
    { q: 'Sú výsledky presné?', a: 'Sú orientačné — slúžia na rýchle porovnanie. Nezahŕňajú dane, dotácie ani riziko prestojov. Pred investíciou si nechajte spočítať detailnú kalkuláciu.' },
  ],
};

// ── per-stroj overrides ─────────────────────────────────────────────────────
interface MachineOverride {
  cs: { title: string; metaDescription: string; h1: string; crumb: string; lede: string; noun: string; unit: string };
  sk: { title: string; metaDescription: string; h1: string; crumb: string; lede: string; noun: string; unit: string };
  defaults: MachineDefaults;
}

const MACHINES: Record<string, MachineOverride> = {
  kombajn: {
    cs: {
      title: 'Vyplatí se koupit kombajn? Kalkulačka návratnosti | agro-svět',
      metaDescription: 'Spočítejte si, jestli se vám vyplatí koupit vlastní kombajn, nebo platit sklizeň jako službu. Zadáte hektary, sazbu a cenu stroje — kalkulačka najde bod zvratu.',
      h1: 'Vyplatí se koupit kombajn?',
      crumb: 'Návratnost kombajnu',
      lede: 'Koupit vlastní kombajn, nebo si nechat sklidit na zakázku? Zadejte, kolik hektarů ročně sklízíte, cenu služby a cenu stroje — kalkulačka spočítá bod zvratu a poradí.',
      noun: 'kombajn', unit: 'ha',
    },
    sk: {
      title: 'Oplatí sa kúpiť kombajn? Kalkulačka návratnosti | agro-svět',
      metaDescription: 'Vypočítajte si, či sa vám oplatí kúpiť vlastný kombajn, alebo platiť zber ako službu. Zadáte hektáre, sadzbu a cenu stroja — kalkulačka nájde bod zvratu.',
      h1: 'Oplatí sa kúpiť kombajn?',
      crumb: 'Návratnosť kombajnu',
      lede: 'Kúpiť vlastný kombajn, alebo si nechať pozberať na zákazku? Zadajte, koľko hektárov ročne zberáte, cenu služby a cenu stroja — kalkulačka spočíta bod zvratu.',
      noun: 'kombajn', unit: 'ha',
    },
    defaults: { qty: 250, serviceRate: 2300, price: 8000000, years: 10, residual: 30, fuel: 18, fuelPrice: 36, maint: 400, labor: 250, fixed: 2, extra: 0, qtyMax: 2000 },
  },
  postrikovac: {
    cs: {
      title: 'Vyplatí se koupit postřikovač? Kalkulačka návratnosti | agro-svět',
      metaDescription: 'Vlastní samojízdný postřikovač, nebo aplikace na zakázku? Kalkulačka spočítá bod zvratu podle vašich hektarů, sazby služby a ceny stroje.',
      h1: 'Vyplatí se koupit postřikovač?',
      crumb: 'Návratnost postřikovače',
      lede: 'Pořídit vlastní samojízdný postřikovač, nebo platit aplikaci na zakázku? Zadejte ošetřenou plochu, sazbu a cenu stroje a zjistěte, co se vám vyplatí.',
      noun: 'postřikovač', unit: 'ha',
    },
    sk: {
      title: 'Oplatí sa kúpiť postrekovač? Kalkulačka návratnosti | agro-svět',
      metaDescription: 'Vlastný samochodný postrekovač, alebo aplikácia na zákazku? Kalkulačka spočíta bod zvratu podľa vašich hektárov, sadzby služby a ceny stroja.',
      h1: 'Oplatí sa kúpiť postrekovač?',
      crumb: 'Návratnosť postrekovača',
      lede: 'Kúpiť vlastný samochodný postrekovač, alebo platiť aplikáciu na zákazku? Zadajte ošetrenú plochu, sadzbu a cenu stroja a zistite, čo sa vám oplatí.',
      noun: 'postrekovač', unit: 'ha',
    },
    defaults: { qty: 500, serviceRate: 500, price: 4500000, years: 10, residual: 30, fuel: 4, fuelPrice: 36, maint: 120, labor: 100, fixed: 2, extra: 0, qtyMax: 4000 },
  },
  lis: {
    cs: {
      title: 'Vyplatí se koupit lis na balíky? Kalkulačka návratnosti | agro-svět',
      metaDescription: 'Vlastní lis na balíky, nebo lisování na zakázku? Kalkulačka spočítá bod zvratu podle počtu balíků za rok, ceny za balík a ceny stroje.',
      h1: 'Vyplatí se koupit lis na balíky?',
      crumb: 'Návratnost lisu',
      lede: 'Koupit vlastní lis, nebo si nechat slisovat na zakázku? Zadejte počet balíků za rok, cenu za balík a cenu stroje — kalkulačka najde bod zvratu.',
      noun: 'lis', unit: 'balíků',
    },
    sk: {
      title: 'Oplatí sa kúpiť lis na balíky? Kalkulačka návratnosti | agro-svět',
      metaDescription: 'Vlastný lis na balíky, alebo lisovanie na zákazku? Kalkulačka spočíta bod zvratu podľa počtu balíkov za rok, ceny za balík a ceny stroja.',
      h1: 'Oplatí sa kúpiť lis na balíky?',
      crumb: 'Návratnosť lisu',
      lede: 'Kúpiť vlastný lis, alebo si nechať slisovať na zákazku? Zadajte počet balíkov za rok, cenu za balík a cenu stroja — kalkulačka nájde bod zvratu.',
      noun: 'lis', unit: 'balíkov',
    },
    defaults: { qty: 6000, serviceRate: 25, price: 1800000, years: 10, residual: 25, fuel: 0.4, fuelPrice: 36, maint: 6, labor: 4, fixed: 2, extra: 0, qtyMax: 40000 },
  },
  secacka: {
    cs: {
      title: 'Vyplatí se koupit secí stroj? Kalkulačka návratnosti | agro-svět',
      metaDescription: 'Vlastní secí stroj, nebo setí na zakázku? Kalkulačka spočítá bod zvratu podle osetých hektarů za rok, sazby služby a ceny stroje.',
      h1: 'Vyplatí se koupit secí stroj?',
      crumb: 'Návratnost secího stroje',
      lede: 'Pořídit vlastní secí stroj (secí kombinaci), nebo si nechat zaset na zakázku? Zadejte, kolik hektarů ročně sejete, cenu služby a cenu stroje — kalkulačka najde bod zvratu.',
      noun: 'secí stroj', unit: 'ha',
    },
    sk: {
      title: 'Oplatí sa kúpiť sejačku? Kalkulačka návratnosti | agro-svět',
      metaDescription: 'Vlastná sejačka, alebo sejba na zákazku? Kalkulačka spočíta bod zvratu podľa osiatych hektárov za rok, sadzby služby a ceny stroja.',
      h1: 'Oplatí sa kúpiť sejačku?',
      crumb: 'Návratnosť sejačky',
      lede: 'Kúpiť vlastnú sejačku (sejaciu kombináciu), alebo si nechať zasiať na zákazku? Zadajte, koľko hektárov ročne sejete, cenu služby a cenu stroja — kalkulačka nájde bod zvratu.',
      noun: 'sejačka', unit: 'ha',
    },
    defaults: { qty: 300, serviceRate: 900, price: 2200000, years: 12, residual: 30, fuel: 12, fuelPrice: 36, maint: 120, labor: 150, fixed: 2, extra: 0, qtyMax: 3000 },
  },
  rozmetadlo: {
    cs: {
      title: 'Vyplatí se koupit rozmetadlo hnojiv? Kalkulačka návratnosti | agro-svět',
      metaDescription: 'Vlastní rozmetadlo hnojiv, nebo hnojení na zakázku? Kalkulačka spočítá bod zvratu podle ošetřených hektarů za rok, sazby služby a ceny stroje.',
      h1: 'Vyplatí se koupit rozmetadlo?',
      crumb: 'Návratnost rozmetadla',
      lede: 'Koupit vlastní rozmetadlo hnojiv, nebo platit hnojení na zakázku? Zadejte, kolik hektarů ročně pohnojíte, cenu služby a cenu stroje — kalkulačka najde bod zvratu.',
      noun: 'rozmetadlo', unit: 'ha',
    },
    sk: {
      title: 'Oplatí sa kúpiť rozmetadlo hnojív? Kalkulačka návratnosti | agro-svět',
      metaDescription: 'Vlastné rozmetadlo hnojív, alebo hnojenie na zákazku? Kalkulačka spočíta bod zvratu podľa ošetrených hektárov za rok, sadzby služby a ceny stroja.',
      h1: 'Oplatí sa kúpiť rozmetadlo?',
      crumb: 'Návratnosť rozmetadla',
      lede: 'Kúpiť vlastné rozmetadlo hnojív, alebo platiť hnojenie na zákazku? Zadajte, koľko hektárov ročne pohnojíte, cenu služby a cenu stroja — kalkulačka nájde bod zvratu.',
      noun: 'rozmetadlo', unit: 'ha',
    },
    defaults: { qty: 500, serviceRate: 300, price: 650000, years: 10, residual: 25, fuel: 3, fuelPrice: 36, maint: 40, labor: 60, fixed: 2, extra: 0, qtyMax: 4000 },
  },
  telehandler: {
    cs: {
      title: 'Vyplatí se koupit telehandler? Kalkulačka návratnosti | agro-svět',
      metaDescription: 'Vlastní teleskopický manipulátor, nebo práce na zakázku? Kalkulačka spočítá bod zvratu podle odpracovaných hodin za rok, sazby služby a ceny stroje.',
      h1: 'Vyplatí se koupit telehandler?',
      crumb: 'Návratnost telehandleru',
      lede: 'Pořídit vlastní teleskopický manipulátor, nebo si najímat manipulaci na hodiny? Zadejte, kolik hodin ročně stroj potřebujete, cenu služby za hodinu a cenu stroje — kalkulačka najde bod zvratu.',
      noun: 'telehandler', unit: 'hodin',
    },
    sk: {
      title: 'Oplatí sa kúpiť telehandler? Kalkulačka návratnosti | agro-svět',
      metaDescription: 'Vlastný teleskopický manipulátor, alebo práca na zákazku? Kalkulačka spočíta bod zvratu podľa odpracovaných hodín za rok, sadzby služby a ceny stroja.',
      h1: 'Oplatí sa kúpiť telehandler?',
      crumb: 'Návratnosť telehandlera',
      lede: 'Kúpiť vlastný teleskopický manipulátor, alebo si najímať manipuláciu na hodiny? Zadajte, koľko hodín ročne stroj potrebujete, cenu služby za hodinu a cenu stroja — kalkulačka nájde bod zvratu.',
      noun: 'telehandler', unit: 'hodín',
    },
    defaults: { qty: 400, serviceRate: 900, price: 2800000, years: 10, residual: 35, fuel: 6, fuelPrice: 36, maint: 150, labor: 250, fixed: 3, extra: 0, qtyMax: 3000 },
  },
};

// ‼️ Mapa je ZÁMĚRNĚ Partial: locale bez překladu tu klíč prostě NEMÁ.
// Dřív tu stálo `uk: {} as XContent` — platný TypeScript, ale za běhu prázdný
// objekt, na který `content[locale] ?? content.cs` NESÁHNE (`{}` je truthy).
// Stránka pak četla `c.title` = undefined, Astro na tom utne SSR stream
// a URL vrátí HTTP 500. Deset /uk a /pl kalkulaček takhle padalo na produkci.
function build(slug: string): Partial<Record<Locale, NavratnostContent>> {
  const m = MACHINES[slug];
  return {
    cs: { ...baseCs, ...m.cs },
    sk: { ...baseSk, ...m.sk },
  };
}

export const defaults: Record<string, MachineDefaults> = {
  kombajn: MACHINES.kombajn.defaults,
  postrikovac: MACHINES.postrikovac.defaults,
  lis: MACHINES.lis.defaults,
  secacka: MACHINES.secacka.defaults,
  rozmetadlo: MACHINES.rozmetadlo.defaults,
  telehandler: MACHINES.telehandler.defaults,
};

export const kombajn = build('kombajn');
export const postrikovac = build('postrikovac');
export const lis = build('lis');
export const secacka = build('secacka');
export const rozmetadlo = build('rozmetadlo');
export const telehandler = build('telehandler');
