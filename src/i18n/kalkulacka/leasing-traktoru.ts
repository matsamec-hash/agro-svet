import type { Locale } from '../config';
import type { CalcMeta, CalcCurrency } from './types';

export interface LeasingProvider { id: string; name: string; apr: number; note: string }

export interface LeasingContent extends CalcMeta, CalcCurrency {
  form: { price: string; downpayment: string; months: string; residual: string; monthsUnit: string };
  result: { headline: string; financed: string; total: string; interest: string; usedRate: string };
  js: { downHintPrefix: string; residualSuffix: string; noResidual: string; perAnnum: string; bestSuffix: string };
  cta: { kicker: string; heading: string; catalog: string; compare: string; costs: string };
  providers: LeasingProvider[];
  providerSection: { heading: string; lede: string; thProvider: string; thRate: string; thMonthly: string; thTotal: string; disclaimer: string } | null;
}

export const content: Record<Locale, LeasingContent> = {
  cs: {
    title: 'Kalkulačka leasingu traktoru — měsíční splátka a srovnání 2026',
    metaDescription: 'Spočítejte měsíční splátku, celkové přeplacení a RPSN leasingu traktoru. Srovnání ČSOB Leasing, John Deere Financial, AGRI CS a AGROTEC.',
    h1: 'Kalkulačka leasingu traktoru',
    crumb: 'Leasing traktoru',
    kicker: 'Kalkulačka · financování',
    lede: 'Zadejte cenu stroje, akontaci a dobu splácení. Spočítáme měsíční splátku, celkové přeplacení a porovnáme orientační nabídky čtyř poskytovatelů. Výsledky jsou orientační — finální nabídku vždy ověřte přímo u leasingové společnosti.',
    currency: 'CZK',
    numberLocale: 'cs-CZ',
    form: { price: 'Pořizovací cena stroje', downpayment: 'Akontace', months: 'Doba splácení', residual: 'Zůstatková hodnota (balónová splátka)', monthsUnit: 'měsíců' },
    result: { headline: 'Měsíční splátka (orientačně)', financed: 'Financovaná částka', total: 'Celkem zaplaceno', interest: 'Přeplaceno na úrocích', usedRate: 'Použitá sazba' },
    js: { downHintPrefix: '= ', residualSuffix: ' na konci', noResidual: 'Bez balónové splátky', perAnnum: ' % p.a.', bestSuffix: ' ★ nejnižší' },
    cta: { kicker: 'Ještě nevíte, který stroj?', heading: 'Projděte katalog traktorů nebo si dva modely porovnejte', catalog: 'Katalog traktorů', compare: 'Srovnání modelů', costs: 'Náklady na hektar' },
    providers: [
      { id: 'csob', name: 'ČSOB Leasing', apr: 6.9, note: 'Univerzální poskytovatel, financuje všechny značky.' },
      { id: 'jd', name: 'John Deere Financial', apr: 5.9, note: 'Captive financování — akční sazby na nové John Deere stroje.' },
      { id: 'agri-cs', name: 'AGRI CS Finance', apr: 7.5, note: 'Dealer financování pro Case IH, Steyr.' },
      { id: 'agrotec', name: 'AGROTEC FS', apr: 7.2, note: 'Financování New Holland přes dealerskou síť.' },
    ],
    providerSection: {
      heading: 'Srovnání poskytovatelů',
      lede: 'Stejné parametry, různé orientační sazby. Captive financování výrobců (John Deere, AGROTEC) bývá levnější na nových strojích dané značky, univerzální poskytovatelé jsou flexibilnější u ojetých.',
      thProvider: 'Poskytovatel', thRate: 'Sazba p.a.', thMonthly: 'Měsíční splátka', thTotal: 'Celkem zaplaceno',
      disclaimer: 'Sazby jsou orientační odhady pro rok 2026 a slouží pouze ke srovnání. Skutečná nabídka závisí na bonitě, výši akontace, zůstatkové hodnotě a aktuálních akčních kampaních. Agro-svět.cz není zprostředkovatel financování.',
    },
    faq: [
      { q: 'Jak se počítá měsíční splátka leasingu?', a: 'Splátka se počítá anuitní metodou — z financované částky (cena stroje minus akontace) se rozpočítá jistina a úrok rovnoměrně na celou dobu splácení. Vyšší akontace i kratší doba snižují celkové přeplacení, ale zvyšují měsíční zatížení.' },
      { q: 'Jaká je obvyklá akontace u leasingu zemědělské techniky?', a: 'Obvyklá akontace se pohybuje mezi 10 a 30 % z pořizovací ceny. Vyšší akontace snižuje úrokové náklady i riziko pro poskytovatele, takže často znamená i nižší sazbu.' },
      { q: 'Co je RPSN a proč je důležité?', a: 'RPSN (roční procentní sazba nákladů) zahrnuje kromě úroku i poplatky za uzavření a vedení smlouvy. Je to nejlepší ukazatel pro srovnání nabídek různých poskytovatelů — nižší RPSN znamená levnější financování.' },
      { q: 'Vyplatí se captive financování od výrobce?', a: 'Captive financování (John Deere Financial, AGROTEC FS) často nabízí akční sazby na nové stroje dané značky, které bankovní leasing nedokáže nabídnout. U ojetých strojů nebo cross-brand nákupu bývá univerzální poskytovatel flexibilnější.' },
    ],
  },
  sk: {
    title: 'Kalkulačka leasingu traktora — mesačná splátka a RPMN',
    metaDescription: 'Vypočítajte mesačnú splátku, celkové preplatenie a RPMN leasingu traktora. Anuitná metóda — zadajte cenu stroja, akontáciu a dobu splácania.',
    h1: 'Kalkulačka leasingu traktora',
    crumb: 'Leasing traktora',
    kicker: 'Kalkulačka · financovanie',
    lede: 'Zadajte cenu stroja, akontáciu a dobu splácania. Vypočítame mesačnú splátku, celkové preplatenie a úroky anuitnou metódou. Výsledky sú orientačné — finálnu ponuku vždy overte priamo u leasingovej spoločnosti.',
    currency: 'EUR',
    numberLocale: 'sk-SK',
    form: { price: 'Obstarávacia cena stroja', downpayment: 'Akontácia', months: 'Doba splácania', residual: 'Zostatková hodnota (balónová splátka)', monthsUnit: 'mesiacov' },
    result: { headline: 'Mesačná splátka (orientačne)', financed: 'Financovaná suma', total: 'Spolu zaplatené', interest: 'Preplatené na úrokoch', usedRate: 'Použitá sadzba' },
    js: { downHintPrefix: '= ', residualSuffix: ' na konci', noResidual: 'Bez balónovej splátky', perAnnum: ' % p.a.', bestSuffix: '' },
    cta: { kicker: 'Ešte neviete, ktorý stroj?', heading: 'Prejdite katalóg traktorov alebo si dva modely porovnajte', catalog: 'Katalóg traktorov', compare: 'Porovnanie modelov', costs: 'Náklady na hektár' },
    providers: [],
    providerSection: null,
    faq: [
      { q: 'Ako sa počíta mesačná splátka leasingu?', a: 'Splátka sa počíta anuitnou metódou — z financovanej sumy (cena stroja mínus akontácia) sa rozpočíta istina a úrok rovnomerne na celú dobu splácania. Vyššia akontácia aj kratšia doba znižujú celkové preplatenie, ale zvyšujú mesačné zaťaženie.' },
      { q: 'Aká je obvyklá akontácia pri leasingu poľnohospodárskej techniky?', a: 'Obvyklá akontácia sa pohybuje medzi 10 a 30 % z obstarávacej ceny. Vyššia akontácia znižuje úrokové náklady aj riziko pre poskytovateľa, takže často znamená aj nižšiu sadzbu.' },
      { q: 'Čo je RPMN a prečo je dôležitá?', a: 'RPMN (ročná percentuálna miera nákladov) zahŕňa okrem úroku aj poplatky za uzatvorenie a vedenie zmluvy. Je to najlepší ukazovateľ na porovnanie ponúk rôznych poskytovateľov — nižšia RPMN znamená lacnejšie financovanie.' },
      { q: 'Ako znížiť celkové preplatenie leasingu?', a: 'Najväčší vplyv má výška akontácie a dĺžka splácania: vyššia akontácia a kratšia doba znižujú zaplatené úroky. Balónová (zostatková) splátka zníži mesačnú splátku, ale celkové preplatenie zvyčajne zvýši. Porovnávajte ponuky podľa RPMN, nie len podľa sadzby.' },
    ],
  },
  uk: {} as LeasingContent,
};
