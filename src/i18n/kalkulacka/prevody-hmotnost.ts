import type { Locale } from '../config';
import type { CalcMeta } from './types';

export interface PrevodyHmotnostContent extends CalcMeta {
  converterHeading: string;
  converterCaption: string;
  defaultCommodity: string;
  ui: { inputLabel: string; commodityLabel: string; unitSelectLabel: string; commoditySelectLabel: string };
  unitNames: Record<string, string>;
  commodityNames: Record<string, string>;
  numberLocale: 'cs-CZ' | 'sk-SK';
}

export const content: Record<Locale, PrevodyHmotnostContent> = {
  cs: {
    title: 'Převody jednotek hmotnosti — tuna, q, kg, bušl, libra',
    metaDescription: 'Online kalkulačka pro převody hmotnosti v zemědělství: tuna ↔ metrický cent (q) ↔ kilogram ↔ bušl (pšenice, kukuřice, sója) ↔ libra. Hodnoty bušlu podle komodity (USDA standard).',
    h1: 'Převody jednotek hmotnosti',
    crumb: 'Převody hmotnosti',
    kicker: 'Kalkulačka · jednotky hmotnosti',
    lede: 'Tuna, metrický cent, kilogram, libra a bušl (s výběrem komodity) — okamžitý převod pro zemědělce, makléře komodit i čtenáře USDA reportů. Bušl má různou hmotnost podle plodiny, kalkulačka to počítá přesně podle USDA standardu.',
    converterHeading: 'Online převodník hmotnosti',
    converterCaption: 'Tip: vyber dropdown komodity dole, abys upravil hmotnost bušlu (pšenice 27,2 kg, kukuřice 25,4 kg, oves 14,5 kg…).',
    defaultCommodity: 'pšenice',
    ui: { inputLabel: 'Zadej hmotnost', commodityLabel: 'Komodita (pro bušl)', unitSelectLabel: 'Vyber jednotku', commoditySelectLabel: 'Vyber komoditu pro bušl' },
    unitNames: { kg: 'kilogram', q: 'metrický cent', t: 'tuna', lb: 'libra (pound)', bu: 'bušl (bushel)' },
    commodityNames: { wheat: 'pšenice', corn: 'kukuřice', soy: 'sója', barley: 'ječmen', oats: 'oves', rye: 'žito', canola: 'řepka (canola)' },
    numberLocale: 'cs-CZ',
    faq: [
      { q: 'Kolik je 1 tuna v kilogramech a centech?', a: '1 tuna (t) = 1 000 kg = 10 metrických centů (q). Tuna je dominantní jednotka v zemědělství pro výnosy (t/ha), výkupní ceny (Kč/t) a kapacity strojů. Pozor — americký short ton (907 kg) a britský long ton (1 016 kg) jsou jiné jednotky.' },
      { q: 'Kolik je 1 bušl pšenice v kg?', a: '1 bušl (bushel) pšenice = 27,2155 kg = 60 amerických liber. Sója má stejnou hmotnost (27,2 kg), kukuřice 25,4 kg, ječmen 21,8 kg, oves 14,5 kg. Bušl je objemová jednotka s pevnou hmotností pro každou komoditu podle USDA standardu.' },
      { q: 'Jak převést cenu z CBOT (¢/bušl) na CZ (Kč/t)?', a: 'Příklad pšenice 600 ¢/bu: 6,00 USD ÷ 27,2155 kg × 1 000 = 220,4 USD/t. Při kurzu 23 Kč/USD = 5 070 Kč/t (před dopravou a maržemi). Pro kukuřici děl 25,4 místo 27,2.' },
      { q: 'Jaký je rozdíl mezi q a t?', a: 'Metrický cent (q) = 100 kg, tuna (t) = 1 000 kg. 1 t = 10 q. V CZ se výnosy mohou udávat v obou: 6 t/ha = 60 q/ha. Ceny komodit dnes typicky v Kč/t, ale starší zemědělci ještě počítají v Kč/q (550 Kč/q = 5 500 Kč/t).' },
      { q: 'Kolik kg je 1 libra (pound, lb)?', a: '1 libra (lb) = 0,45359237 kg, prakticky 0,4536 kg. Rychlý odhad: lb × 0,5 ≈ kg. Libra se používá v USDA reportech, na CBOT futures (sójový olej v ¢/lb, live cattle v ¢/lb) a v amerických krmných tabulkách.' },
      { q: 'Co je hektolitrová váha obilí?', a: 'Hmotnost 100 litrů obilí v kg — kvalitativní parametr pro výkup. Pšenice potravinářská 78+ kg/hl, krmná pod 74 kg/hl. Vyšší hl váha = lepší škrob/olej, vyšší cena. Rozdíl ceny krmné a potravinářské třídy může být 1 500+ Kč/t.' },
    ],
  },
  sk: {
    title: 'Prevody jednotiek hmotnosti — tona, q, kg, bušel, libra',
    metaDescription: 'Online kalkulačka na prevody hmotnosti v poľnohospodárstve: tona ↔ metrický cent (q) ↔ kilogram ↔ bušel (pšenica, kukurica, sója) ↔ libra. Hodnoty bušla podľa komodity (USDA štandard).',
    h1: 'Prevody jednotiek hmotnosti',
    crumb: 'Prevody hmotnosti',
    kicker: 'Kalkulačka · jednotky hmotnosti',
    lede: 'Tona, metrický cent, kilogram, libra a bušel (s výberom komodity) — okamžitý prevod pre poľnohospodárov, komoditných maklérov aj čitateľov USDA reportov. Bušel má rôznu hmotnosť podľa plodiny, kalkulačka to počíta presne podľa USDA štandardu.',
    converterHeading: 'Online prevodník hmotnosti',
    converterCaption: 'Tip: vyber dropdown komodity dole, aby si upravil hmotnosť bušla (pšenica 27,2 kg, kukurica 25,4 kg, ovos 14,5 kg…).',
    defaultCommodity: 'pšenica',
    ui: { inputLabel: 'Zadaj hmotnosť', commodityLabel: 'Komodita (pre bušel)', unitSelectLabel: 'Vyber jednotku', commoditySelectLabel: 'Vyber komoditu pre bušel' },
    unitNames: { kg: 'kilogram', q: 'metrický cent', t: 'tona', lb: 'libra (pound)', bu: 'bušel (bushel)' },
    commodityNames: { wheat: 'pšenica', corn: 'kukurica', soy: 'sója', barley: 'jačmeň', oats: 'ovos', rye: 'raž', canola: 'repka (canola)' },
    numberLocale: 'sk-SK',
    faq: [
      { q: 'Koľko je 1 tona v kilogramoch a centoch?', a: '1 tona (t) = 1 000 kg = 10 metrických centov (q). Tona je dominantná jednotka v poľnohospodárstve pre výnosy (t/ha), výkupné ceny (€/t) a kapacity strojov. Pozor — americká short ton (907 kg) a britská long ton (1 016 kg) sú iné jednotky.' },
      { q: 'Koľko je 1 bušel pšenice v kg?', a: '1 bušel (bushel) pšenice = 27,2155 kg = 60 amerických libier. Sója má rovnakú hmotnosť (27,2 kg), kukurica 25,4 kg, jačmeň 21,8 kg, ovos 14,5 kg. Bušel je objemová jednotka s pevnou hmotnosťou pre každú komoditu podľa USDA štandardu.' },
      { q: 'Ako previesť cenu z CBOT (¢/bušel) na € (€/t)?', a: 'Príklad pšenica 600 ¢/bu: 6,00 USD ÷ 27,2155 kg × 1 000 = 220,4 USD/t. Pri kurze 0,92 €/USD ≈ 203 €/t (pred dopravou a maržami). Pre kukuricu deľ 25,4 namiesto 27,2.' },
      { q: 'Aký je rozdiel medzi q a t?', a: 'Metrický cent (q) = 100 kg, tona (t) = 1 000 kg. 1 t = 10 q. Výnosy sa môžu udávať v oboch: 6 t/ha = 60 q/ha. Ceny komodít dnes typicky v €/t, ale starší poľnohospodári ešte počítajú v €/q.' },
      { q: 'Koľko kg je 1 libra (pound, lb)?', a: '1 libra (lb) = 0,45359237 kg, prakticky 0,4536 kg. Rýchly odhad: lb × 0,5 ≈ kg. Libra sa používa v USDA reportoch, na CBOT futures (sójový olej v ¢/lb, live cattle v ¢/lb) a v amerických kŕmnych tabuľkách.' },
      { q: 'Čo je hektolitrová hmotnosť obilia?', a: 'Hmotnosť 100 litrov obilia v kg — kvalitatívny parameter pre výkup. Pšenica potravinárska 78+ kg/hl, kŕmna pod 74 kg/hl. Vyššia hl hmotnosť = lepší škrob/olej, vyššia cena.' },
    ],
  },
  uk: {} as PrevodyHmotnostContent,
};
