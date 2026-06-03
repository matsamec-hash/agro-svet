import type { Locale } from '../config';
import type { CalcMeta } from './types';

export interface PrevodyJednotekContent extends CalcMeta {
  converterHeading: string;
  converterCaption: string;
  ui: { inputLabel: string; unitSelectLabel: string };
  unitNames: Record<string, string>;
  numberLocale: 'cs-CZ' | 'sk-SK';
}

export const content: Record<Locale, PrevodyJednotekContent> = {
  cs: {
    title: 'Převody jednotek plochy — hektar, ar, m², akr, jitro, korec',
    metaDescription:
      'Online kalkulačka pro převody jednotek plochy: hektar ↔ ar ↔ m² ↔ km² ↔ akr ↔ jitro ↔ korec ↔ strych ↔ morgen. Okamžitý výpočet, vhodné pro zemědělce, geodety i katastr.',
    h1: 'Převody jednotek plochy',
    crumb: 'Převody jednotek',
    kicker: 'Kalkulačka · jednotky a měření',
    lede:
      '\nZadej hodnotu v libovolné jednotce a okamžitě uvidíš převod do všech ostatních —\n        hektary, ary, metry čtvereční, akry i historické české jednotky (jitro, korec, strych) a pruský morgen.\n        Kalkulačka funguje bez registrace, čísla se počítají v prohlížeči.\n',
    converterHeading: 'Online převodník jednotek plochy',
    converterCaption:
      'Tip: klikni do pole s hodnotou a piš — všechny převody se aktualizují živě. Pro starší jednotky (jitro, korec, strych) jsou použité standardizované hodnoty z roku 1764, regionální varianty se mohly mírně lišit.',
    ui: { inputLabel: 'Zadej hodnotu', unitSelectLabel: 'Vyber jednotku' },
    unitNames: {
      m2: 'metr čtvereční', a: 'ar', ha: 'hektar', km2: 'kilometr čtvereční',
      acre: 'akr (acre)', jitro: 'rakouské/české jitro', korec: 'český korec',
      strych: 'český strych', morgen: 'pruský morgen',
    },
    numberLocale: 'cs-CZ',
    faq: [
      { q: 'Kolik je 1 hektar v m² a arech?', a: '1 hektar (ha) = 10 000 m² = 100 arů (a) = 0,01 km². Hektar je čtverec o straně 100 × 100 metrů. V zemědělství je hektar standardní jednotka pro výměru polí, dotace na hektar i výnosy plodin (t/ha).' },
      { q: 'Kolik m² je 1 ar?', a: '1 ar (a) = 100 m² = čtverec 10 × 10 m = 0,01 hektaru. 100 arů tvoří jeden hektar. Ar se v ČR používá hlavně pro výměru zahrad, malých parcel a v katastrálních zápisech.' },
      { q: 'Kolik je 1 akr v hektarech?', a: '1 akr (acre) = 4 046,86 m² = 0,4047 hektaru = přibližně 40,5 aru. Akr je anglosaská jednotka používaná v USA, UK, Kanadě a Austrálii. Pro převod akrů na hektary vynásob hodnotu číslem 0,4047.' },
      { q: 'Jak převést bušly na tuny z hektaru?', a: 'Záleží na komoditě. Pro pšenici a sóju: bu/ac × 0,0673 = t/ha. Pro kukuřici: bu/ac × 0,0628 = t/ha. Příklad: 175 bu/ac kukuřice ≈ 11 t/ha. CBOT publikuje US výnosy v bušlech na akr, EU v t/ha.' },
      { q: 'Co je jitro, korec a strych? Jak velké jsou?', a: 'Historické české jednotky plochy z doby před metrickou reformou (1919). Standardizované hodnoty z roku 1764: rakouské/české jitro = 0,5755 ha (5 754 m²), pražský korec = strych = 0,288 ha (2 877 m²). Stále se objevují v katastrálních zápisech a rodinné paměti.' },
      { q: 'Proč existuje hektolitrová váha obilí?', a: 'Hektolitrová váha (kg/hl) je kvalitativní parametr — hmotnost 100 litrů obilí. Vyšší hl váha = vyšší obsah škrobu/oleje, lepší mlynářská kvalita. Pšenice 78+ kg/hl = potravinářská třída, < 74 kg/hl = krmná. Rozdíl ceny může být 1500+ Kč/t.' },
    ],
  },
  sk: {
    title: 'Prevody jednotiek plochy — hektár, ár, m², aker, jitro, korec',
    metaDescription:
      'Online kalkulačka na prevody jednotiek plochy: hektár ↔ ár ↔ m² ↔ km² ↔ aker ↔ jitro ↔ korec ↔ strych ↔ morgen. Okamžitý výpočet, vhodné pre poľnohospodárov, geodetov aj kataster.',
    h1: 'Prevody jednotiek plochy',
    crumb: 'Prevody jednotiek',
    kicker: 'Kalkulačka · jednotky a meranie',
    lede:
      'Zadaj hodnotu v ľubovoľnej jednotke a okamžite uvidíš prevod do všetkých ostatných — hektáre, áre, metre štvorcové, akre aj historické jednotky (jitro, korec, strych) a pruský morgen. Kalkulačka funguje bez registrácie, čísla sa počítajú v prehliadači.',
    converterHeading: 'Online prevodník jednotiek plochy',
    converterCaption:
      'Tip: klikni do poľa s hodnotou a píš — všetky prevody sa aktualizujú naživo. Pre staršie jednotky (jitro, korec, strych) sú použité štandardizované hodnoty z roku 1764, regionálne varianty sa mohli mierne líšiť.',
    ui: { inputLabel: 'Zadaj hodnotu', unitSelectLabel: 'Vyber jednotku' },
    unitNames: {
      m2: 'meter štvorcový', a: 'ár', ha: 'hektár', km2: 'kilometer štvorcový',
      acre: 'aker (acre)', jitro: 'rakúsko-uhorské jitro', korec: 'korec',
      strych: 'strych', morgen: 'pruský morgen',
    },
    numberLocale: 'sk-SK',
    faq: [
      { q: 'Koľko je 1 hektár v m² aároch?', a: '1 hektár (ha) = 10 000 m² = 100 árov (a) = 0,01 km². Hektár je štvorec so stranou 100 × 100 metrov. V poľnohospodárstve je hektár štandardná jednotka na výmeru polí, dotácie na hektár aj výnosy plodín (t/ha).' },
      { q: 'Koľko m² je 1 ár?', a: '1 ár (a) = 100 m² = štvorec 10 × 10 m = 0,01 hektára. 100 árov tvorí jeden hektár. Ár sa používa najmä na výmeru záhrad, malých parciel a v katastrálnych zápisoch.' },
      { q: 'Koľko je 1 aker v hektároch?', a: '1 aker (acre) = 4 046,86 m² = 0,4047 hektára = približne 40,5 ára. Aker je anglosaská jednotka používaná v USA, UK, Kanade a Austrálii. Na prevod akrov na hektáre vynásob hodnotu číslom 0,4047.' },
      { q: 'Ako previesť bušly na tony z hektára?', a: 'Závisí od komodity. Pre pšenicu a sóju: bu/ac × 0,0673 = t/ha. Pre kukuricu: bu/ac × 0,0628 = t/ha. Príklad: 175 bu/ac kukurice ≈ 11 t/ha. CBOT publikuje US výnosy v bušloch na aker, EÚ v t/ha.' },
      { q: 'Čo je jitro, korec a strych? Aké sú veľké?', a: 'Historické jednotky plochy z čias pred metrickou reformou. Štandardizované hodnoty z roku 1764: rakúsko-uhorské jitro = 0,5755 ha (5 754 m²), korec = strych = 0,288 ha (2 877 m²). Stále sa objavujú v starších katastrálnych zápisoch a rodinnej pamäti.' },
      { q: 'Prečo existuje hektolitrová hmotnosť obilia?', a: 'Hektolitrová hmotnosť (kg/hl) je kvalitatívny parameter — hmotnosť 100 litrov obilia. Vyššia hl hmotnosť = vyšší obsah škrobu/oleja, lepšia mlynárska kvalita. Pšenica 78+ kg/hl = potravinárska trieda, < 74 kg/hl = kŕmna. Rozdiel ceny môže byť výrazný.' },
    ],
  },
  uk: {} as PrevodyJednotekContent,
};
