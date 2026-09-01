import type { Locale } from '../config';
import type { CalcMeta } from './types';

export interface PrevodyHmotnostContent extends CalcMeta {
  converterHeading: string;
  converterCaption: string;
  defaultCommodity: string;
  ui: { inputLabel: string; commodityLabel: string; unitSelectLabel: string; commoditySelectLabel: string };
  unitNames: Record<string, string>;
  commodityNames: Record<string, string>;
  numberLocale: 'cs-CZ' | 'sk-SK' | 'pl-PL' | 'uk-UA' | 'de-DE';
  /** Lokalizovaný blok „další stránky" — jen locale, které ho mají přeložený
   *  (pl). Bez něj stránka renderuje výchozí cs seznam (cs/sk/uk beze změny). */
  related?: { heading: string; items: { href: string; label: string }[] };
  /** Referenční tabulky + blok převodu výnosů. Volitelné se stejnou logikou
   *  jako `related`: locale bez překladu (sk/uk) renderuje cs blok, takže se
   *  jeho výstup nemění. Bez tohohle byla /pl stránka z poloviny česky. */
  sections?: {
    refHeading: string;
    tables: { caption: string; rows: [string, string][] }[];
    yieldHeading: string;
    yieldLede: string;
    yieldCols: [string, string, string, string];
    yieldRows: [string, string, string, string][];
    faqHeading: string;
  };
}

// ‼️ Mapa je ZÁMĚRNĚ Partial: locale bez překladu tu klíč prostě NEMÁ.
// Dřív tu stálo `uk: {} as XContent` — platný TypeScript, ale za běhu prázdný
// objekt, na který `content[locale] ?? content.cs` NESÁHNE (`{}` je truthy).
// Stránka pak četla `c.title` = undefined, Astro na tom utne SSR stream
// a URL vrátí HTTP 500. Deset /uk a /pl kalkulaček takhle padalo na produkci.
export const content: Partial<Record<Locale, PrevodyHmotnostContent>> = {
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
    sections: {
      refHeading: 'Referenční tabulka — nejčastější převody',
      tables: [
        { caption: 'Tuna (t) na další jednotky', rows: [
          ['1 t', '= 1 000 kg'], ['1 t', '= 10 q (metrických centů)'],
          ['1 t', '≈ 2 204,6 lb (anglických liber)'], ['1 t pšenice / sója', '≈ 36,7 bušlu'],
          ['1 t kukuřice / žito', '≈ 39,4 bušlu'], ['1 t ječmen', '≈ 45,9 bušlu'],
          ['1 t oves', '≈ 68,9 bušlu'],
        ] },
        { caption: 'Bušl (USDA standard) — kg / lb', rows: [
          ['Pšenice / sója', '27,2155 kg / 60 lb'], ['Kukuřice / žito', '25,4012 kg / 56 lb'],
          ['Řepka (canola)', '22,6796 kg / 50 lb'], ['Ječmen', '21,7724 kg / 48 lb'],
          ['Oves', '14,5150 kg / 32 lb'],
        ] },
        { caption: 'Cent (q) a libra (lb)', rows: [
          ['1 q', '= 100 kg = 0,1 t'], ['10 q', '= 1 t'], ['1 lb', '= 0,4536 kg'],
          ['1 kg', '= 2,2046 lb'], ['1 US short ton', '= 907,18 kg = 2 000 lb'],
          ['1 UK long ton', '= 1 016 kg = 2 240 lb'],
        ] },
        { caption: 'Hektolitrová váha pro výkup', rows: [
          ['Pšenice potrav.', '78–84 kg/hl (třída A/E)'], ['Pšenice krmná', 'pod 74 kg/hl'],
          ['Ječmen sladovnický', 'min. 64 kg/hl'], ['Ječmen krmný', '62–66 kg/hl'],
          ['Žito potrav.', '72+ kg/hl'], ['Oves potrav.', '50+ kg/hl'],
          ['Řepka ozimá', 'min. 62 kg/hl'],
        ] },
      ],
      yieldHeading: 'Převod výnosů: bušl/akr ↔ t/hektar',
      yieldLede: 'Pro porovnání US a EU výnosů. CBOT publikuje výnosy v bushel/acre, EU statistiky v t/ha. Násobicí faktor záleží na komoditě (kvůli různé hmotnosti bušlu a převodu akr→ha).',
      yieldCols: ['Komodita', 'bu/ac → t/ha', 'Příklad US výnos', 'Ekvivalent CZ'],
      yieldRows: [
        ['Pšenice / sója', '× 0,06725', '50 bu/ac', '≈ 3,36 t/ha'],
        ['Kukuřice / žito', '× 0,06277', '175 bu/ac', '≈ 10,98 t/ha'],
        ['Řepka (canola)', '× 0,05604', '40 bu/ac', '≈ 2,24 t/ha'],
        ['Ječmen', '× 0,05381', '80 bu/ac', '≈ 4,30 t/ha'],
        ['Oves', '× 0,03587', '70 bu/ac', '≈ 2,51 t/ha'],
      ],
      faqHeading: 'Časté otázky',
    },
    related: {
      heading: 'Další užitečné stránky',
      items: [
        { href: '/kalkulacka/prevody-jednotek/', label: '📐 Převody jednotek plochy' },
        { href: '/slovnik/tuna/', label: '⚖️ Tuna (t) — detail jednotky' },
        { href: '/slovnik/q-cent/', label: '⚖️ Cent (q) — detail jednotky' },
        { href: '/slovnik/busl/', label: '🌾 Bušl — detail s USDA tabulkou' },
        { href: '/slovnik/hektolitr/', label: '🌾 Hektolitr — váha obilí' },
        { href: '/kalkulacka/naklady-na-hektar/', label: '💰 Náklady na hektar' },
      ],
    },
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
    sections: {
      refHeading: 'Referenčná tabuľka — najčastejšie prevody',
      tables: [
        { caption: 'Tona (t) na ďalšie jednotky', rows: [
          ['1 t', '= 1 000 kg'], ['1 t', '= 10 q (metrických centov)'],
          ['1 t', '≈ 2 204,6 lb (libier)'], ['1 t pšenice / sóje', '≈ 36,7 bušla'],
          ['1 t kukurice / raže', '≈ 39,4 bušla'], ['1 t jačmeňa', '≈ 45,9 bušla'],
          ['1 t ovsa', '≈ 68,9 bušla'],
        ] },
        { caption: 'Bušel (štandard USDA) — kg / lb', rows: [
          ['Pšenica / sója', '27,2155 kg / 60 lb'], ['Kukurica / raž', '25,4012 kg / 56 lb'],
          ['Repka (canola)', '22,6796 kg / 50 lb'], ['Jačmeň', '21,7724 kg / 48 lb'],
          ['Ovos', '14,5150 kg / 32 lb'],
        ] },
        { caption: 'Metrický cent (q) a libra (lb)', rows: [
          ['1 q', '= 100 kg = 0,1 t'], ['10 q', '= 1 t'], ['1 lb', '= 0,4536 kg'],
          ['1 kg', '= 2,2046 lb'], ['1 US short ton', '= 907,18 kg = 2 000 lb'],
          ['1 UK long ton', '= 1 016 kg = 2 240 lb'],
        ] },
        { caption: 'Hektolitrová hmotnosť pri výkupe', rows: [
          ['Pšenica potravinárska', '78–84 kg/hl (trieda A/E)'], ['Pšenica kŕmna', 'pod 74 kg/hl'],
          ['Jačmeň sladovnícky', 'min. 64 kg/hl'], ['Jačmeň kŕmny', '62–66 kg/hl'],
          ['Raž potravinárska', '72+ kg/hl'], ['Ovos potravinársky', '50+ kg/hl'],
          ['Repka ozimná', 'min. 62 kg/hl'],
        ] },
      ],
      yieldHeading: 'Prevod úrod: bušel/aker ↔ t/hektár',
      yieldLede: 'Na porovnanie úrod z USA a EÚ. CBOT publikuje úrody v bushel/acre, štatistiky EÚ v t/ha. Násobiteľ závisí od komodity (rôzna hmotnosť bušla a prevod aker→ha).',
      yieldCols: ['Komodita', 'bu/ac → t/ha', 'Príklad úrody USA', 'Ekvivalent v t/ha'],
      yieldRows: [
        ['Pšenica / sója', '× 0,06725', '50 bu/ac', '≈ 3,36 t/ha'],
        ['Kukurica / raž', '× 0,06277', '175 bu/ac', '≈ 10,98 t/ha'],
        ['Repka (canola)', '× 0,05604', '40 bu/ac', '≈ 2,24 t/ha'],
        ['Jačmeň', '× 0,05381', '80 bu/ac', '≈ 4,30 t/ha'],
        ['Ovos', '× 0,03587', '70 bu/ac', '≈ 2,51 t/ha'],
      ],
      faqHeading: 'Časté otázky',
    },
    related: {
      heading: 'Ďalšie užitočné stránky',
      items: [
        { href: '/sk/kalkulacka/prevody-jednotek/', label: '📐 Prevody jednotiek plochy' },
        { href: '/sk/slovnik/tuna/', label: '⚖️ Tona (t) — detail jednotky' },
        { href: '/sk/slovnik/q-cent/', label: '⚖️ Cent (q) — detail jednotky' },
        { href: '/sk/slovnik/busl/', label: '🌾 Bušel — detail s tabuľkou USDA' },
        { href: '/sk/slovnik/hektolitr/', label: '🌾 Hektoliter — hmotnosť obilia' },
        { href: '/sk/kalkulacka/naklady-na-hektar/', label: '💰 Náklady na hektár' },
      ],
    },
  },
  pl: {
    title: 'Przelicznik jednostek masy — tona, q, kg, buszel, funt',
    metaDescription: 'Kalkulator online do przeliczania masy w rolnictwie: tona ↔ kwintal (q) ↔ kilogram ↔ buszel (pszenica, kukurydza, soja) ↔ funt. Masa buszla według towaru (standard USDA).',
    h1: 'Przeliczniki jednostek masy',
    crumb: 'Jednostki masy',
    kicker: 'Kalkulator · jednostki masy',
    lede: 'Tona, kwintal, kilogram, funt i buszel (z wyborem towaru) — natychmiastowe przeliczenie dla rolników, maklerów towarowych i czytelników raportów USDA. Buszel ma różną masę zależnie od uprawy, kalkulator liczy to dokładnie według standardu USDA.',
    converterHeading: 'Kalkulator masy online',
    converterCaption: 'Wskazówka: wybierz towar z listy poniżej, aby dostosować masę buszla (pszenica 27,2 kg, kukurydza 25,4 kg, owies 14,5 kg…).',
    defaultCommodity: 'pszenica',
    ui: { inputLabel: 'Podaj masę', commodityLabel: 'Towar (dla buszla)', unitSelectLabel: 'Wybierz jednostkę', commoditySelectLabel: 'Wybierz towar dla buszla' },
    unitNames: { kg: 'kilogram', q: 'kwintal', t: 'tona', lb: 'funt (pound)', bu: 'buszel (bushel)' },
    commodityNames: { wheat: 'pszenica', corn: 'kukurydza', soy: 'soja', barley: 'jęczmień', oats: 'owies', rye: 'żyto', canola: 'rzepak (canola)' },
    numberLocale: 'pl-PL',
    faq: [
      { q: 'Ile to 1 tona w kilogramach i kwintalach?', a: '1 tona (t) = 1 000 kg = 10 kwintali (q). Tona to dominująca jednostka w rolnictwie dla plonów (t/ha), cen skupu i wydajności maszyn. Uwaga — amerykańska short ton (907 kg) i brytyjska long ton (1 016 kg) to inne jednostki.' },
      { q: 'Ile to 1 buszel pszenicy w kg?', a: '1 buszel (bushel) pszenicy = 27,2155 kg = 60 funtów amerykańskich. Soja ma taką samą masę (27,2 kg), kukurydza 25,4 kg, jęczmień 21,8 kg, owies 14,5 kg. Buszel to jednostka objętościowa o stałej masie dla każdego towaru według standardu USDA.' },
      { q: 'Jak przeliczyć cenę z CBOT (¢/buszel) na zł/t?', a: 'Przykład pszenica 600 ¢/bu: 6,00 USD ÷ 27,2155 kg × 1 000 = 220,4 USD/t. Przy kursie 4,00 zł/USD ≈ 882 zł/t (przed transportem i marżami). Dla kukurydzy dziel przez 25,4 zamiast 27,2.' },
      { q: 'Jaka jest różnica między q a t?', a: 'Kwintal (q) = 100 kg, tona (t) = 1 000 kg. 1 t = 10 q. Plony można podawać w obu: 6 t/ha = 60 q/ha. Ceny towarów dziś zwykle w zł/t, ale niektórzy rolnicy nadal liczą w zł/q.' },
      { q: 'Ile kg to 1 funt (pound, lb)?', a: '1 funt (lb) = 0,45359237 kg, praktycznie 0,4536 kg. Szybki szacunek: lb × 0,5 ≈ kg. Funt używany jest w raportach USDA, na kontraktach CBOT (olej sojowy w ¢/lb, live cattle w ¢/lb) oraz w amerykańskich tabelach paszowych.' },
      { q: 'Czym jest masa hektolitrowa zboża?', a: 'Masa 100 litrów zboża w kg — parametr jakościowy przy skupie. Pszenica konsumpcyjna 78+ kg/hl, paszowa poniżej 74 kg/hl. Wyższa masa hl = lepsza skrobia/olej, wyższa cena.' },
    ],
    related: {
      heading: 'Inne przydatne strony',
      items: [
        { href: '/pl/kalkulacka/prevody-jednotek/', label: '📐 Przelicznik jednostek powierzchni' },
        { href: '/pl/slovnik/', label: '⚖️ Słownik — jednostki i miary' },
        { href: '/pl/stroje/', label: '🚜 Katalog ciągników i maszyn' },
      ],
    },
    sections: {
      refHeading: 'Tabela przeliczeniowa — najczęstsze przeliczenia',
      tables: [
        { caption: 'Tona (t) na inne jednostki', rows: [
          ['1 t', '= 1 000 kg'], ['1 t', '= 10 q (kwintali)'],
          ['1 t', '≈ 2 204,6 lb (funtów)'], ['1 t pszenicy / soi', '≈ 36,7 buszla'],
          ['1 t kukurydzy / żyta', '≈ 39,4 buszla'], ['1 t jęczmienia', '≈ 45,9 buszla'],
          ['1 t owsa', '≈ 68,9 buszla'],
        ] },
        { caption: 'Buszel (standard USDA) — kg / lb', rows: [
          ['Pszenica / soja', '27,2155 kg / 60 lb'], ['Kukurydza / żyto', '25,4012 kg / 56 lb'],
          ['Rzepak (canola)', '22,6796 kg / 50 lb'], ['Jęczmień', '21,7724 kg / 48 lb'],
          ['Owies', '14,5150 kg / 32 lb'],
        ] },
        { caption: 'Kwintal (q) i funt (lb)', rows: [
          ['1 q', '= 100 kg = 0,1 t'], ['10 q', '= 1 t'], ['1 lb', '= 0,4536 kg'],
          ['1 kg', '= 2,2046 lb'], ['1 US short ton', '= 907,18 kg = 2 000 lb'],
          ['1 UK long ton', '= 1 016 kg = 2 240 lb'],
        ] },
        { caption: 'Masa hektolitrowa przy skupie', rows: [
          ['Pszenica konsumpcyjna', '78–84 kg/hl (klasa A/E)'], ['Pszenica paszowa', 'poniżej 74 kg/hl'],
          ['Jęczmień browarny', 'min. 64 kg/hl'], ['Jęczmień paszowy', '62–66 kg/hl'],
          ['Żyto konsumpcyjne', '72+ kg/hl'], ['Owies konsumpcyjny', '50+ kg/hl'],
          ['Rzepak ozimy', 'min. 62 kg/hl'],
        ] },
      ],
      yieldHeading: 'Przeliczanie plonów: buszel/akr ↔ t/hektar',
      yieldLede: 'Do porównywania plonów z USA i UE. CBOT podaje plony w bushel/acre, statystyki UE w t/ha. Mnożnik zależy od towaru (różna masa buszla i przeliczenie akr→ha).',
      yieldCols: ['Towar', 'bu/ac → t/ha', 'Przykładowy plon USA', 'Odpowiednik w t/ha'],
      yieldRows: [
        ['Pszenica / soja', '× 0,06725', '50 bu/ac', '≈ 3,36 t/ha'],
        ['Kukurydza / żyto', '× 0,06277', '175 bu/ac', '≈ 10,98 t/ha'],
        ['Rzepak (canola)', '× 0,05604', '40 bu/ac', '≈ 2,24 t/ha'],
        ['Jęczmień', '× 0,05381', '80 bu/ac', '≈ 4,30 t/ha'],
        ['Owies', '× 0,03587', '70 bu/ac', '≈ 2,51 t/ha'],
      ],
      faqHeading: 'Częste pytania',
    },
  },
  // Fáze 3g: DE/AT. Hmotnost bushelu je standard USDA a je stejná všude —
  // překládají se jen názvy komodit a popisy. Doppelzentner (dt) je v Německu
  // běžnější zápis než „q", proto je uvedený obojí.
  de: {
    title: 'Masseeinheiten umrechnen — Tonne, Doppelzentner, kg, Bushel, Pfund',
    metaDescription: 'Online-Rechner für Massen in der Landwirtschaft: Tonne ↔ Doppelzentner (dt) ↔ Kilogramm ↔ Bushel (Weizen, Mais, Soja) ↔ Pfund. Bushel-Gewicht je Kultur nach USDA-Standard.',
    h1: 'Masseeinheiten umrechnen',
    crumb: 'Masseeinheiten',
    kicker: 'Rechner · Masseeinheiten',
    lede: 'Tonne, Doppelzentner, Kilogramm, Pfund und Bushel (mit Auswahl der Kultur) — sofortige Umrechnung für Landwirte, Händler und Leser von USDA-Berichten. Ein Bushel wiegt je nach Kultur unterschiedlich, der Rechner berücksichtigt das nach USDA-Standard.',
    converterHeading: 'Online-Umrechner für Massen',
    converterCaption: 'Tipp: Kultur unten auswählen, um das Bushel-Gewicht anzupassen (Weizen 27,2 kg, Mais 25,4 kg, Hafer 14,5 kg …).',
    defaultCommodity: 'Weizen',
    ui: { inputLabel: 'Masse eingeben', commodityLabel: 'Kultur (für Bushel)', unitSelectLabel: 'Einheit wählen', commoditySelectLabel: 'Kultur für Bushel wählen' },
    unitNames: { kg: 'Kilogramm', q: 'Doppelzentner', t: 'Tonne', lb: 'Pfund (pound)', bu: 'Bushel' },
    commodityNames: { wheat: 'Weizen', corn: 'Mais', soy: 'Soja', barley: 'Gerste', oats: 'Hafer', rye: 'Roggen', canola: 'Raps (Canola)' },
    numberLocale: 'de-DE',
    faq: [
      { q: 'Wie viel sind 1 Tonne in Kilogramm und Doppelzentnern?', a: '1 Tonne (t) = 1 000 kg = 10 Doppelzentner (dt, auch q). Die Tonne ist die übliche Einheit für Erträge (t/ha), Erzeugerpreise und Maschinenleistung. Achtung: die US short ton (907 kg) und die britische long ton (1 016 kg) sind andere Einheiten.' },
      { q: 'Wie viel wiegt 1 Bushel Weizen in kg?', a: '1 Bushel Weizen = 27,2155 kg = 60 amerikanische Pfund. Soja wiegt gleich viel (27,2 kg), Mais 25,4 kg, Gerste 21,8 kg, Hafer 14,5 kg. Der Bushel ist ein Volumenmaß mit je Kultur festgelegtem Gewicht nach USDA-Standard.' },
      { q: 'Wie rechnet man CBOT-Preise (¢/Bushel) in Euro je Tonne um?', a: 'Beispiel Weizen 600 ¢/bu: 6,00 USD ÷ 27,2155 kg × 1 000 = 220,4 USD/t. Bei einem Kurs von 1,08 USD/EUR ergibt das rund 204 EUR/t — vor Fracht und Handelsspanne. Für Mais statt durch 27,2 durch 25,4 teilen.' },
      { q: 'Was ist der Unterschied zwischen dt und t?', a: 'Ein Doppelzentner (dt) = 100 kg, eine Tonne (t) = 1 000 kg, also 1 t = 10 dt. Erträge lassen sich in beidem angeben: 6 t/ha = 60 dt/ha. Erzeugerpreise werden heute meist in EUR/t genannt, in der Praxis rechnen viele Betriebe weiterhin in dt.' },
      { q: 'Wie viel kg sind 1 Pfund (pound, lb)?', a: '1 Pfund (lb) = 0,45359237 kg, praktisch 0,4536 kg. Faustregel: lb × 0,5 ≈ kg. Das Pfund begegnet einem in USDA-Berichten, bei CBOT-Kontrakten (Sojaöl in ¢/lb, live cattle in ¢/lb) und in amerikanischen Fütterungstabellen. Nicht zu verwechseln mit dem alten deutschen Pfund von 500 g.' },
      { q: 'Was sagt das Hektolitergewicht aus?', a: 'Die Masse von 100 Litern Getreide in Kilogramm — ein Qualitätsparameter bei der Übernahme. Brotweizen ab 78 kg/hl, Futterweizen unter 74 kg/hl. Höheres hl-Gewicht bedeutet mehr Stärke beziehungsweise Öl und einen besseren Preis.' },
    ],
    related: {
      heading: 'Weitere nützliche Seiten',
      items: [
        { href: '/de/kalkulacka/prevody-jednotek/', label: '📐 Flächeneinheiten umrechnen' },
        { href: '/de/slovnik/', label: '⚖️ Fachbegriffe — Einheiten und Maße' },
        { href: '/de/stroje/', label: '🚜 Traktoren- und Maschinenkatalog' },
      ],
    },
    sections: {
      refHeading: 'Referenztabelle — die häufigsten Umrechnungen',
      tables: [
        { caption: 'Tonne (t) in andere Einheiten', rows: [
          ['1 t', '= 1 000 kg'], ['1 t', '= 10 dt (Doppelzentner)'],
          ['1 t', '≈ 2 204,6 lb (Pfund)'], ['1 t Weizen / Soja', '≈ 36,7 Bushel'],
          ['1 t Mais / Roggen', '≈ 39,4 Bushel'], ['1 t Gerste', '≈ 45,9 Bushel'],
          ['1 t Hafer', '≈ 68,9 Bushel'],
        ] },
        { caption: 'Bushel (USDA-Standard) — kg / lb', rows: [
          ['Weizen / Soja', '27,2155 kg / 60 lb'], ['Mais / Roggen', '25,4012 kg / 56 lb'],
          ['Raps (Canola)', '22,6796 kg / 50 lb'], ['Gerste', '21,7724 kg / 48 lb'],
          ['Hafer', '14,5150 kg / 32 lb'],
        ] },
        { caption: 'Doppelzentner (dt) und Pfund (lb)', rows: [
          ['1 dt', '= 100 kg = 0,1 t'], ['10 dt', '= 1 t'], ['1 lb', '= 0,4536 kg'],
          ['1 kg', '= 2,2046 lb'], ['1 US short ton', '= 907,18 kg = 2 000 lb'],
          ['1 UK long ton', '= 1 016 kg = 2 240 lb'],
        ] },
        { caption: 'Hektolitergewicht bei der Übernahme', rows: [
          ['Brotweizen', '78–84 kg/hl (A/E-Qualität)'], ['Futterweizen', 'unter 74 kg/hl'],
          ['Braugerste', 'mindestens 64 kg/hl'], ['Futtergerste', '62–66 kg/hl'],
          ['Brotroggen', 'ab 72 kg/hl'], ['Schälhafer', 'ab 50 kg/hl'],
          ['Winterraps', 'mindestens 62 kg/hl'],
        ] },
      ],
      yieldHeading: 'Erträge umrechnen: Bushel je Acre ↔ t je Hektar',
      yieldLede: 'Zum Vergleich von US- und EU-Erträgen. Das USDA gibt Erträge in Bushel je Acre an, die EU-Statistik in t/ha. Der Faktor hängt von der Kultur ab (unterschiedliches Bushel-Gewicht plus Umrechnung Acre → Hektar).',
      yieldCols: ['Kultur', 'bu/ac → t/ha', 'Beispielertrag USA', 'Entspricht in t/ha'],
      yieldRows: [
        ['Weizen / Soja', '× 0,06725', '50 bu/ac', '≈ 3,36 t/ha'],
        ['Mais / Roggen', '× 0,06277', '175 bu/ac', '≈ 10,98 t/ha'],
        ['Raps (Canola)', '× 0,05604', '40 bu/ac', '≈ 2,24 t/ha'],
        ['Gerste', '× 0,05381', '80 bu/ac', '≈ 4,30 t/ha'],
        ['Hafer', '× 0,03587', '70 bu/ac', '≈ 2,51 t/ha'],
      ],
      faqHeading: 'Häufige Fragen',
    },
  },
  // Ukrajinsky: центнер (ц) je v UA standardní jednotka výnosu (ц/га), proto
  // je zmíněný explicitně. Ceny se v příkladu přepočítávají přes USD/t, ne
  // přes hřivnu — kurz je pohyblivý a stránka by jinak zastarala.
  uk: {
    title: 'Переведення одиниць маси — тонна, центнер, кг, бушель, фунт',
    metaDescription: 'Онлайн-калькулятор маси в агросекторі: тонна ↔ центнер (ц) ↔ кілограм ↔ бушель (пшениця, кукурудза, соя) ↔ фунт. Маса бушеля за культурою згідно зі стандартом USDA.',
    h1: 'Переведення одиниць маси',
    crumb: 'Одиниці маси',
    kicker: 'Калькулятор · одиниці маси',
    lede: 'Тонна, центнер, кілограм, фунт і бушель (з вибором культури) — миттєве переведення для аграріїв, трейдерів і читачів звітів USDA. Бушель важить по-різному залежно від культури, калькулятор рахує це за стандартом USDA.',
    converterHeading: 'Онлайн-конвертер маси',
    converterCaption: 'Порада: виберіть культуру зі списку нижче, щоб задати масу бушеля (пшениця 27,2 кг, кукурудза 25,4 кг, овес 14,5 кг…).',
    defaultCommodity: 'пшениця',
    ui: { inputLabel: 'Введіть масу', commodityLabel: 'Культура (для бушеля)', unitSelectLabel: 'Виберіть одиницю', commoditySelectLabel: 'Виберіть культуру для бушеля' },
    unitNames: { kg: 'кілограм', q: 'центнер', t: 'тонна', lb: 'фунт (pound)', bu: 'бушель (bushel)' },
    commodityNames: { wheat: 'пшениця', corn: 'кукурудза', soy: 'соя', barley: 'ячмінь', oats: 'овес', rye: 'жито', canola: 'ріпак (canola)' },
    numberLocale: 'uk-UA',
    faq: [
      { q: 'Скільки це 1 тонна в кілограмах і центнерах?', a: '1 тонна (т) = 1 000 кг = 10 центнерів (ц). Тонна — основна одиниця для врожаю, закупівельних цін і продуктивності техніки. Увага: американська short ton (907 кг) і британська long ton (1 016 кг) — це інші одиниці.' },
      { q: 'Скільки важить 1 бушель пшениці в кг?', a: '1 бушель пшениці = 27,2155 кг = 60 американських фунтів. Соя важить стільки ж (27,2 кг), кукурудза 25,4 кг, ячмінь 21,8 кг, овес 14,5 кг. Бушель — це одиниця обʼєму з фіксованою масою для кожної культури за стандартом USDA.' },
      { q: 'Як перевести ціну з CBOT (¢/бушель) у USD за тонну?', a: 'Приклад для пшениці 600 ¢/бушель: 6,00 USD ÷ 27,2155 кг × 1 000 = 220,4 USD/т — до фрахту й маржі трейдера. Для кукурудзи діліть на 25,4 замість 27,2. Перерахунок у гривню робіть за поточним курсом.' },
      { q: 'Чим відрізняється центнер від тонни?', a: 'Центнер (ц) = 100 кг, тонна (т) = 1 000 кг, тобто 1 т = 10 ц. В Україні врожайність традиційно наводять у центнерах з гектара: 60 ц/га = 6 т/га. Експортні контракти оперують тоннами.' },
      { q: 'Скільки кілограмів в одному фунті (pound, lb)?', a: '1 фунт (lb) = 0,45359237 кг, практично 0,4536 кг. Швидка оцінка: lb × 0,5 ≈ кг. Фунт трапляється у звітах USDA, у контрактах CBOT (соєва олія в ¢/lb, live cattle в ¢/lb) та в американських кормових таблицях.' },
      { q: 'Що таке натура зерна?', a: 'Маса 100 літрів зерна в кілограмах — показник якості при прийманні на елеватор. Продовольча пшениця від 78 кг/гл, фуражна — менш ніж 74 кг/гл. Вища натура означає більше крохмалю чи олії та кращу ціну.' },
    ],
    related: {
      heading: 'Інші корисні сторінки',
      items: [
        { href: '/uk/kalkulacka/prevody-jednotek/', label: '📐 Переведення одиниць площі' },
        { href: '/uk/slovnik/', label: '⚖️ Словник — одиниці та виміри' },
        { href: '/uk/stroje/', label: '🚜 Каталог тракторів і техніки' },
      ],
    },
    sections: {
      refHeading: 'Довідкова таблиця — найчастіші переведення',
      tables: [
        { caption: 'Тонна (т) в інші одиниці', rows: [
          ['1 т', '= 1 000 кг'], ['1 т', '= 10 ц (центнерів)'],
          ['1 т', '≈ 2 204,6 фунта'], ['1 т пшениці / сої', '≈ 36,7 бушеля'],
          ['1 т кукурудзи / жита', '≈ 39,4 бушеля'], ['1 т ячменю', '≈ 45,9 бушеля'],
          ['1 т вівса', '≈ 68,9 бушеля'],
        ] },
        { caption: 'Бушель (стандарт USDA) — кг / фунти', rows: [
          ['Пшениця / соя', '27,2155 кг / 60 lb'], ['Кукурудза / жито', '25,4012 кг / 56 lb'],
          ['Ріпак (canola)', '22,6796 кг / 50 lb'], ['Ячмінь', '21,7724 кг / 48 lb'],
          ['Овес', '14,5150 кг / 32 lb'],
        ] },
        { caption: 'Центнер (ц) і фунт (lb)', rows: [
          ['1 ц', '= 100 кг = 0,1 т'], ['10 ц', '= 1 т'], ['1 lb', '= 0,4536 кг'],
          ['1 кг', '= 2,2046 lb'], ['1 US short ton', '= 907,18 кг = 2 000 lb'],
          ['1 UK long ton', '= 1 016 кг = 2 240 lb'],
        ] },
        { caption: 'Натура зерна при прийманні', rows: [
          ['Пшениця продовольча', '78–84 кг/гл'], ['Пшениця фуражна', 'менш ніж 74 кг/гл'],
          ['Ячмінь пивоварний', 'від 64 кг/гл'], ['Ячмінь фуражний', '62–66 кг/гл'],
          ['Жито продовольче', 'від 72 кг/гл'], ['Овес продовольчий', 'від 50 кг/гл'],
          ['Ріпак озимий', 'від 62 кг/гл'],
        ] },
      ],
      yieldHeading: 'Переведення врожайності: бушель/акр ↔ т/га',
      yieldLede: 'Для порівняння врожайності США та ЄС. USDA наводить урожайність у бушелях на акр, статистика ЄС — у тоннах на гектар. Множник залежить від культури (різна маса бушеля плюс переведення акр → гектар).',
      yieldCols: ['Культура', 'бушель/акр → т/га', 'Приклад урожайності США', 'Відповідник у т/га'],
      yieldRows: [
        ['Пшениця / соя', '× 0,06725', '50 бушелів/акр', '≈ 3,36 т/га'],
        ['Кукурудза / жито', '× 0,06277', '175 бушелів/акр', '≈ 10,98 т/га'],
        ['Ріпак (canola)', '× 0,05604', '40 бушелів/акр', '≈ 2,24 т/га'],
        ['Ячмінь', '× 0,05381', '80 бушелів/акр', '≈ 4,30 т/га'],
        ['Овес', '× 0,03587', '70 бушелів/акр', '≈ 2,51 т/га'],
      ],
      faqHeading: 'Часті запитання',
    },
  },
};
