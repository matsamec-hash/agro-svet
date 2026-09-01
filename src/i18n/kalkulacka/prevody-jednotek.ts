import type { Locale } from '../config';
import type { CalcMeta } from './types';

export interface PrevodyJednotekContent extends CalcMeta {
  converterHeading: string;
  converterCaption: string;
  ui: { inputLabel: string; unitSelectLabel: string };
  /** Popisek odkazu v kartě jednotky. Bez něj se použije cs „detail". */
  cardLinkLabel?: string;
  unitNames: Record<string, string>;
  numberLocale: 'cs-CZ' | 'sk-SK' | 'pl-PL' | 'uk-UA' | 'de-DE';
  /** Lokalizovaný blok „další stránky" — jen locale, které ho mají přeložený
   *  (pl). Bez něj stránka renderuje výchozí cs seznam (cs/sk/uk beze změny). */
  related?: { heading: string; items: { href: string; label: string }[] };
  /** Vizuální srovnání + referenční tabulky + karty jednotek. Volitelné se
   *  stejnou logikou jako `related`: locale bez překladu (sk/uk) renderuje cs
   *  blok, takže se jejich výstup nemění. Bez tohohle byla /pl stránka
   *  z poloviny česky — přeložený byl jen hero, převodník a FAQ otázky. */
  sections?: {
    comparisonsHeading: string;
    comparisonsCaption: string;
    comparisons: { emoji: string; name: string; m2: number; slug?: string; credit?: string }[];
    cmpText?: { pickerLabel: string; selectAria: string; frameIs: string; yourInput: string; tileIs: string; shownFirst: string };
    refHeading: string;
    tables: { caption: string; rows: [string, string][] }[];
    contextHeading: string;
    cards: { title: string; href: string; text: string }[];
    faqHeading: string;
  };
}

// ‼️ Mapa je ZÁMĚRNĚ Partial: locale bez překladu tu klíč prostě NEMÁ.
// Dřív tu stálo `uk: {} as XContent` — platný TypeScript, ale za běhu prázdný
// objekt, na který `content[locale] ?? content.cs` NESÁHNE (`{}` je truthy).
// Stránka pak četla `c.title` = undefined, Astro na tom utne SSR stream
// a URL vrátí HTTP 500. Deset /uk a /pl kalkulaček takhle padalo na produkci.
export const content: Partial<Record<Locale, PrevodyJednotekContent>> = {
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
    sections: {
      comparisonsHeading: 'Kolik to je? Názorné srovnání',
      comparisonsCaption:
        'Plocha se vykreslí jako mřížka referenčních dlaždic — čím víc se jich vejde, tím jsou menší. Orientační rozměry: parkovací místo ≈ 12,5 m², tenisový kurt ≈ 261 m², hokejové kluziště ≈ 1 800 m², fotbalové hřiště ≈ 7 140 m² (0,71 ha), Staroměstské náměstí ≈ 9 000 m², Václavské náměstí ≈ 45 000 m², Pražský hrad ≈ 70 000 m².',
      comparisons: [
        { emoji: '🅿️', name: 'parkovací místo', m2: 12.5, slug: 'parkovaci-misto', credit: 'Foto: Gabriel Picard, CC BY-SA 4.0' },
        { emoji: '🎾', name: 'tenisový kurt', m2: 261, slug: 'tenisovy-kurt', credit: 'Foto: KeepActive Australia, CC BY-SA 4.0' },
        { emoji: '🏒', name: 'hokejové kluziště', m2: 1800, slug: 'hokejove-kluziste', credit: 'Foto: Frettie, CC BY-SA 3.0' },
        { emoji: '⚽', name: 'fotbalové hřiště', m2: 7140, slug: 'fotbalove-hriste', credit: 'Foto: Stephen Kennard, CC BY-SA 3.0' },
        { emoji: '🏛️', name: 'Staroměstské náměstí', m2: 9000, slug: 'staromestske-nam', credit: 'Foto: A.Savin, FAL' },
        { emoji: '🏙️', name: 'Václavské náměstí', m2: 45000, slug: 'vaclavske-nam', credit: 'Foto: Slyronit, CC BY-SA 4.0' },
        { emoji: '🏰', name: 'Pražský hrad', m2: 70000, slug: 'prazsky-hrad', credit: 'Foto: Dietmar Rabich, CC BY-SA 4.0' },
      ],
      cmpText: {
        pickerLabel: 'Porovnat s', selectAria: 'Vyber srovnávací objekt',
        frameIs: 'Rámeček =', yourInput: 'zelená plocha = vaše zadání',
        tileIs: '1 dlaždice =', shownFirst: 'zobrazeno prvních {n} z {total}',
      },
      refHeading: 'Referenční tabulka — nejčastější převody',
      tables: [
        { caption: 'Hektar (ha) na další jednotky', rows: [
          ['1 ha', '= 10 000 m²'], ['1 ha', '= 100 a (arů)'], ['1 ha', '= 0,01 km²'],
          ['1 ha', '≈ 2,471 akru'], ['1 ha', '≈ 1,738 jitra'], ['1 ha', '≈ 3,476 korce / strychu'],
          ['1 ha', '≈ 3,917 pruského morgenu'],
        ] },
        { caption: 'Ar (a) na další jednotky', rows: [
          ['1 a', '= 100 m²'], ['1 a', '= 0,01 ha'], ['1 a', '≈ 0,0247 akru'],
          ['100 a', '= 1 ha'], ['4 a', '= 400 m² (malá zahrada)'], ['10 a', '= 1 000 m² (větší zahrada)'],
        ] },
        { caption: 'Akr (acre) na další jednotky', rows: [
          ['1 akr', '= 4 046,86 m²'], ['1 akr', '≈ 0,4047 ha'], ['1 akr', '≈ 40,47 a'],
          ['1 akr', '= 4 840 yard²'], ['2,471 akru', '= 1 ha'], ['640 akrů', '= 1 mile² (US section)'],
        ] },
        { caption: 'Historické české jednotky', rows: [
          ['1 jitro', '= 5 754 m² = 0,5755 ha'], ['1 korec', '= 2 877 m² = 0,288 ha'],
          ['1 strych', '= 2 877 m² (= korec)'], ['2 korce', '= 1 jitro'],
          ['1 lán', '≈ 64 korců ≈ 18 ha'], ['1 morgen (pruský)', '= 2 553 m² = 0,255 ha'],
        ] },
      ],
      contextHeading: 'K čemu jsou jednotlivé jednotky dobré?',
      cards: [
        { title: 'Hektar (ha)', href: '/slovnik/hektar/', text: 'Standardní jednotka v zemědělství a lesnictví. Používá se pro výměru farem, dotace na hektar (BISS, CISS, EKO), výnosy plodin (t/ha) i ceny postřiků (l/ha). 1 ha = fotbalové hřiště 1,5×.' },
        { title: 'Ar (a)', href: '/slovnik/ar/', text: 'Jednotka pro drobné pozemky — zahrady, malé parcely, vinice malých vinařů. 1 ar = čtverec 10 × 10 m. V katastru nemovitostí přetrvává v běžné řeči, oficiálně se eviduje v m².' },
        { title: 'Metr čtvereční (m²)', href: '/slovnik/metr-ctvrecni/', text: 'Základní SI jednotka. Oficiální zápis v katastru nemovitostí, sazba daně z nemovitých věcí, výměra stavebních parcel, bytů a hal. Univerzální napříč obory.' },
        { title: 'Akr (acre)', href: '/slovnik/akr/', text: 'Anglosaská jednotka pro USA, UK, Kanadu, Austrálii. Pro CZ farmáře relevantní při čtení USDA dat (výnosy v bu/ac), CBOT cenotvorby a při exportu komodit.' },
        { title: 'Jitro, korec, strych', href: '/slovnik/jitro/', text: 'Historické české jednotky před metrickou reformou (1919). Setkáte se s nimi v katastrálních zápisech, gruntovních knihách, urbářích a rodinných kronikách. Pro dědická řízení a genealogii nutné znát.' },
        { title: 'Morgen', href: '/slovnik/morgen/', text: 'Historická německá jednotka. Pruský morgen ≈ 0,255 ha, rakouský ≈ 0,575 ha (rovná se českému jitru). Setkáte se v pohraničí (Sudety, jižní Morava), na pruských mapách a při nákupu pozemků v severním Německu.' },
      ],
      faqHeading: 'Časté otázky',
    },
    related: {
      heading: 'Další užitečné stránky',
      items: [
        { href: '/slovnik/?kategorie=jednotky', label: '📐 Slovník — všechny jednotky a měření' },
        { href: '/kalkulacka/naklady-na-hektar/', label: '🌾 Kalkulačka nákladů na hektar' },
        { href: '/kalkulacka/dotace-cap/', label: '💶 Kalkulačka dotací CAP 2024' },
        { href: '/slovnik/hektar/', label: '🟨 Hektar (ha) — detail jednotky' },
        { href: '/slovnik/q-cent/', label: '⚖️ Cent (q) — jednotka výnosu' },
      ],
    },
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
    sections: {
      comparisonsHeading: 'Koľko to je? Názorné porovnanie',
      comparisonsCaption:
        'Plocha sa vykreslí ako mriežka referenčných dlaždíc — čím viac sa ich zmestí, tým sú menšie. Orientačné rozmery: parkovacie miesto ≈ 12,5 m², tenisový kurt ≈ 261 m², hokejové klzisko ≈ 1 800 m², futbalové ihrisko ≈ 7 140 m² (0,71 ha). Pražské objekty slúžia len ako mierka veľkosti: Staromestské námestie ≈ 9 000 m², Václavské námestie ≈ 45 000 m², Pražský hrad ≈ 70 000 m².',
      comparisons: [
        { emoji: '🅿️', name: 'parkovacie miesto', m2: 12.5, slug: 'parkovaci-misto', credit: 'Foto: Gabriel Picard, CC BY-SA 4.0' },
        { emoji: '🎾', name: 'tenisový kurt', m2: 261, slug: 'tenisovy-kurt', credit: 'Foto: KeepActive Australia, CC BY-SA 4.0' },
        { emoji: '🏒', name: 'hokejové klzisko', m2: 1800, slug: 'hokejove-kluziste', credit: 'Foto: Frettie, CC BY-SA 3.0' },
        { emoji: '⚽', name: 'futbalové ihrisko', m2: 7140, slug: 'fotbalove-hriste', credit: 'Foto: Stephen Kennard, CC BY-SA 3.0' },
        { emoji: '🏛️', name: 'Staromestské námestie v Prahe', m2: 9000, slug: 'staromestske-nam', credit: 'Foto: A.Savin, FAL' },
        { emoji: '🏙️', name: 'Václavské námestie v Prahe', m2: 45000, slug: 'vaclavske-nam', credit: 'Foto: Slyronit, CC BY-SA 4.0' },
        { emoji: '🏰', name: 'Pražský hrad', m2: 70000, slug: 'prazsky-hrad', credit: 'Foto: Dietmar Rabich, CC BY-SA 4.0' },
      ],
      cmpText: {
        pickerLabel: 'Porovnať s', selectAria: 'Vyber porovnávací objekt',
        frameIs: 'Rámček =', yourInput: 'zelená plocha = tvoje zadanie',
        tileIs: '1 dlaždica =', shownFirst: 'zobrazených prvých {n} z {total}',
      },
      refHeading: 'Referenčná tabuľka — najčastejšie prevody',
      tables: [
        { caption: 'Hektár (ha) na ďalšie jednotky', rows: [
          ['1 ha', '= 10 000 m²'], ['1 ha', '= 100 á (árov)'], ['1 ha', '= 0,01 km²'],
          ['1 ha', '≈ 2,471 akra'], ['1 ha', '≈ 1,738 jutra'],
          ['1 ha', '≈ 3,476 korca'], ['1 ha', '≈ 3,917 pruského morgenu'],
        ] },
        { caption: 'Ár (á) na ďalšie jednotky', rows: [
          ['1 á', '= 100 m²'], ['1 á', '= 0,01 ha'], ['1 á', '≈ 0,0247 akra'],
          ['100 á', '= 1 ha'], ['4 á', '= 400 m² (malá záhrada)'], ['10 á', '= 1 000 m² (väčšia záhrada)'],
        ] },
        { caption: 'Aker (acre) na ďalšie jednotky', rows: [
          ['1 aker', '= 4 046,86 m²'], ['1 aker', '≈ 0,4047 ha'], ['1 aker', '≈ 40,47 á'],
          ['1 aker', '= 4 840 yardov²'], ['2,471 akra', '= 1 ha'], ['640 akrov', '= 1 míľa² (US section)'],
        ] },
        // Slovensko bolo súčasťou Rakúsko-Uhorska, takže jutro/korec sa používali
        // rovnako ako v českých krajinách; uhorské jutro (hold) je špecifikum juhu.
        { caption: 'Historické jednotky (Rakúsko-Uhorsko)', rows: [
          ['1 katastrálne jutro', '= 5 755 m² = 0,5755 ha'],
          ['1 korec', '= 2 877 m² = 0,288 ha'],
          ['2 korce', '= 1 jutro'],
          ['1 uhorské jutro (hold)', '= 5 755 m² (1 200 štvorcových siah)'],
          ['1 štvorcová siaha', '≈ 3,6 m²'],
          ['1 pruský morgen', '= 2 553 m² = 0,255 ha'],
        ] },
      ],
      contextHeading: 'Na čo sú jednotlivé jednotky dobré?',
      cards: [
        { title: 'Hektár (ha)', href: '/slovnik/hektar/', text: 'Štandardná jednotka v poľnohospodárstve a lesníctve. Používa sa na výmeru fariem, priame platby na hektár, úrody plodín (t/ha) aj dávky postrekov (l/ha). 1 ha = približne 1,5 futbalového ihriska.' },
        { title: 'Ár (á)', href: '/slovnik/ar/', text: 'Jednotka pre drobné pozemky — záhrady, malé parcely, vinice malých vinárov. 1 ár = štvorec 10 × 10 m. V bežnej reči pretrváva, v katastri sa eviduje v m².' },
        { title: 'Meter štvorcový (m²)', href: '/slovnik/metr-ctvrecni/', text: 'Základná jednotka SI. Oficiálny zápis v katastri nehnuteľností, základ dane z nehnuteľností, výmera stavebných parciel, bytov a hál.' },
        { title: 'Aker (acre)', href: '/slovnik/akr/', text: 'Anglosaská jednotka používaná v USA, Spojenom kráľovstve, Kanade a Austrálii. Pre slovenského farmára dôležitá pri čítaní dát USDA (úrody v bu/ac), cenotvorby CBOT a pri exporte komodít.' },
        { title: 'Jutro a korec', href: '/slovnik/jitro/', text: 'Historické jednotky z čias Rakúsko-Uhorska, pred metrickou reformou. Štandardizované hodnoty: katastrálne jutro = 0,5755 ha, korec = 0,288 ha. Stretneš sa s nimi v starých pozemkových knihách a rodinných kronikách.' },
        { title: 'Morgen', href: '/slovnik/morgen/', text: 'Historická nemecká jednotka. Pruský morgen ≈ 0,255 ha, rakúsky ≈ 0,575 ha (rovná sa jutru). Objavuje sa na starých nemeckých mapách a v dokumentoch z pohraničia.' },
      ],
      faqHeading: 'Časté otázky',
    },
    related: {
      heading: 'Ďalšie užitočné stránky',
      items: [
        { href: '/sk/slovnik/', label: '📐 Slovník — jednotky a merania' },
        { href: '/sk/kalkulacka/naklady-na-hektar/', label: '🌾 Kalkulačka nákladov na hektár' },
        { href: '/sk/kalkulacka/prevody-hmotnost/', label: '⚖️ Prevody jednotiek hmotnosti' },
        { href: '/sk/slovnik/hektar/', label: '🟨 Hektár (ha) — detail jednotky' },
        { href: '/sk/slovnik/q-cent/', label: '⚖️ Cent (q) — jednotka úrody' },
      ],
    },
  },
  pl: {
    title: 'Przelicznik jednostek powierzchni — hektar, ar, m², akr, morga',
    metaDescription:
      'Kalkulator online do przeliczania jednostek powierzchni: hektar ↔ ar ↔ m² ↔ km² ↔ akr ↔ morga. Natychmiastowy wynik, dla rolników, geodetów i ewidencji gruntów.',
    h1: 'Przeliczniki jednostek powierzchni',
    crumb: 'Jednostki powierzchni',
    kicker: 'Kalkulator · jednostki i pomiary',
    lede:
      'Wpisz wartość w dowolnej jednostce i od razu zobaczysz przeliczenie na wszystkie pozostałe — hektary, ary, metry kwadratowe, akry oraz jednostki historyczne. Kalkulator działa bez rejestracji, obliczenia wykonują się w przeglądarce.',
    converterHeading: 'Kalkulator jednostek powierzchni online',
    converterCaption:
      'Wskazówka: kliknij w pole z wartością i pisz — wszystkie przeliczenia aktualizują się na żywo. Dla jednostek historycznych użyto wartości standaryzowanych z 1764 roku, warianty regionalne mogły się nieznacznie różnić.',
    ui: { inputLabel: 'Wpisz wartość', unitSelectLabel: 'Wybierz jednostkę' },
    unitNames: {
      m2: 'metr kwadratowy', a: 'ar', ha: 'hektar', km2: 'kilometr kwadratowy',
      acre: 'akr (acre)', jitro: 'jitro (austro-węgierskie)', korec: 'korzec (czeski)',
      strych: 'strych (czeski)', morgen: 'morga pruska',
    },
    numberLocale: 'pl-PL',
    faq: [
      { q: 'Ile to 1 hektar w m² i arach?', a: '1 hektar (ha) = 10 000 m² = 100 arów (a) = 0,01 km². Hektar to kwadrat o boku 100 × 100 metrów. W rolnictwie hektar jest standardową jednostką powierzchni pól, dopłat na hektar oraz plonów (t/ha).' },
      { q: 'Ile m² to 1 ar?', a: '1 ar (a) = 100 m² = kwadrat 10 × 10 m = 0,01 hektara. 100 arów tworzy jeden hektar. Ar używa się głównie do powierzchni ogrodów, małych działek i w zapisach ewidencyjnych.' },
      { q: 'Ile to 1 akr w hektarach?', a: '1 akr (acre) = 4 046,86 m² = 0,4047 hektara = około 40,5 ara. Akr to jednostka anglosaska używana w USA, Wielkiej Brytanii, Kanadzie i Australii. Aby przeliczyć akry na hektary, pomnóż wartość przez 0,4047.' },
      { q: 'Jak przeliczyć buszle na tony z hektara?', a: 'Zależy od towaru. Dla pszenicy i soi: bu/ac × 0,0673 = t/ha. Dla kukurydzy: bu/ac × 0,0628 = t/ha. Przykład: 175 bu/ac kukurydzy ≈ 11 t/ha. CBOT publikuje plony USA w buszlach na akr, UE w t/ha.' },
      { q: 'Czym są jitro, korzec i strych? Jak duże są?', a: 'Historyczne czeskie jednostki powierzchni sprzed reformy metrycznej. Wartości standaryzowane z 1764 roku: austro-węgierskie jitro = 0,5755 ha (5 754 m²), praski korzec = strych = 0,288 ha (2 877 m²). Wciąż pojawiają się w starszych zapisach ewidencyjnych.' },
      { q: 'Dlaczego istnieje masa hektolitrowa zboża?', a: 'Masa hektolitrowa (kg/hl) to parametr jakościowy — masa 100 litrów zboża. Wyższa masa hl = wyższa zawartość skrobi/oleju, lepsza jakość młynarska. Pszenica 78+ kg/hl = klasa konsumpcyjna, < 74 kg/hl = paszowa. Różnica ceny może być znacząca.' },
    ],
    related: {
      heading: 'Inne przydatne strony',
      items: [
        { href: '/pl/kalkulacka/prevody-hmotnost/', label: '⚖️ Przelicznik jednostek masy' },
        { href: '/pl/slovnik/', label: '📐 Słownik — jednostki i miary' },
        { href: '/pl/stroje/', label: '🚜 Katalog ciągników i maszyn' },
      ],
    },
    sections: {
      comparisonsHeading: 'Ile to jest? Porównanie poglądowe',
      comparisonsCaption:
        'Powierzchnia rysowana jest jako siatka kafelków odniesienia — im więcej się ich mieści, tym są mniejsze. Wymiary orientacyjne: miejsce parkingowe ≈ 12,5 m², kort tenisowy ≈ 261 m², lodowisko hokejowe ≈ 1 800 m², boisko piłkarskie ≈ 7 140 m² (0,71 ha). Obiekty praskie służą tylko jako skala wielkości: Rynek Staromiejski ≈ 9 000 m², plac Wacława ≈ 45 000 m², Zamek Praski ≈ 70 000 m².',
      // Zdjęcia leżą pod /images/srovnani/<slug> — te same pliki co w cs, więc
      // obiekty zostają, tłumaczone są tylko nazwy. Praskie punkty są wyraźnie
      // opisane jako praskie, żeby nie sugerowały polskiej lokalizacji.
      comparisons: [
        { emoji: '🅿️', name: 'miejsce parkingowe', m2: 12.5, slug: 'parkovaci-misto', credit: 'Foto: Gabriel Picard, CC BY-SA 4.0' },
        { emoji: '🎾', name: 'kort tenisowy', m2: 261, slug: 'tenisovy-kurt', credit: 'Foto: KeepActive Australia, CC BY-SA 4.0' },
        { emoji: '🏒', name: 'lodowisko hokejowe', m2: 1800, slug: 'hokejove-kluziste', credit: 'Foto: Frettie, CC BY-SA 3.0' },
        { emoji: '⚽', name: 'boisko piłkarskie', m2: 7140, slug: 'fotbalove-hriste', credit: 'Foto: Stephen Kennard, CC BY-SA 3.0' },
        { emoji: '🏛️', name: 'Rynek Staromiejski w Pradze', m2: 9000, slug: 'staromestske-nam', credit: 'Foto: A.Savin, FAL' },
        { emoji: '🏙️', name: 'plac Wacława w Pradze', m2: 45000, slug: 'vaclavske-nam', credit: 'Foto: Slyronit, CC BY-SA 4.0' },
        { emoji: '🏰', name: 'Zamek Praski', m2: 70000, slug: 'prazsky-hrad', credit: 'Foto: Dietmar Rabich, CC BY-SA 4.0' },
      ],
      cmpText: {
        pickerLabel: 'Porównaj z', selectAria: 'Wybierz obiekt porównawczy',
        frameIs: 'Ramka =', yourInput: 'zielone pole = twoja wartość',
        tileIs: '1 kafelek =', shownFirst: 'pokazano pierwsze {n} z {total}',
      },
      refHeading: 'Tabela przeliczeniowa — najczęstsze przeliczenia',
      tables: [
        { caption: 'Hektar (ha) na inne jednostki', rows: [
          ['1 ha', '= 10 000 m²'], ['1 ha', '= 100 a (arów)'], ['1 ha', '= 0,01 km²'],
          ['1 ha', '≈ 2,471 akra'], ['1 ha', '≈ 1,786 morgi nowopolskiej'],
          ['1 ha', '≈ 3,917 morgi pruskiej'], ['1 ha', '≈ 1,738 morgi austriackiej'],
        ] },
        { caption: 'Ar (a) na inne jednostki', rows: [
          ['1 a', '= 100 m²'], ['1 a', '= 0,01 ha'], ['1 a', '≈ 0,0247 akra'],
          ['100 a', '= 1 ha'], ['4 a', '= 400 m² (mały ogród)'], ['10 a', '= 1 000 m² (większy ogród)'],
        ] },
        { caption: 'Akr (acre) na inne jednostki', rows: [
          ['1 akr', '= 4 046,86 m²'], ['1 akr', '≈ 0,4047 ha'], ['1 akr', '≈ 40,47 a'],
          ['1 akr', '= 4 840 jardów²'], ['2,471 akra', '= 1 ha'], ['640 akrów', '= 1 mila² (US section)'],
        ] },
        // Polskie jednostki historyczne różnią się według zaboru — to dla
        // polskiego czytelnika istotniejsze niż czeskie jitro/korzec.
        { caption: 'Historyczne jednostki polskie (wg zaboru)', rows: [
          ['1 morga nowopolska', '= 5 599 m² = 0,56 ha'],
          ['1 włóka nowopolska', '= 30 morgów ≈ 16,8 ha'],
          ['1 morga pruska', '= 2 553 m² = 0,255 ha'],
          ['1 morga austriacka (jutrzyna)', '= 5 755 m² = 0,5755 ha'],
          ['1 pręt kwadratowy nowopolski', '≈ 18,66 m²'],
          ['300 prętów²', '= 1 morga nowopolska'],
        ] },
      ],
      contextHeading: 'Do czego służą poszczególne jednostki?',
      cards: [
        { title: 'Hektar (ha)', href: '/slovnik/hektar/', text: 'Standardowa jednostka w rolnictwie i leśnictwie. Używana do powierzchni gospodarstw, dopłat bezpośrednich ARiMR, plonów (t/ha) i dawek środków ochrony (l/ha). 1 ha = około 1,5 boiska piłkarskiego.' },
        { title: 'Ar (a)', href: '/slovnik/ar/', text: 'Jednostka dla małych działek — ogrody, ogródki działkowe, małe winnice. 1 ar = kwadrat 10 × 10 m. W mowie potocznej wciąż powszechna, w ewidencji gruntów zapisuje się w m² lub ha.' },
        { title: 'Metr kwadratowy (m²)', href: '/slovnik/metr-ctvrecni/', text: 'Podstawowa jednostka SI. Oficjalny zapis w księgach wieczystych i ewidencji gruntów, podstawa podatku od nieruchomości, powierzchnia działek budowlanych, mieszkań i hal.' },
        { title: 'Akr (acre)', href: '/slovnik/akr/', text: 'Jednostka anglosaska używana w USA, Wielkiej Brytanii, Kanadzie i Australii. Dla polskiego rolnika istotna przy czytaniu danych USDA (plony w bu/ac), notowań CBOT i przy eksporcie towarów.' },
        { title: 'Morga i włóka', href: '/slovnik/jitro/', text: 'Historyczne jednostki używane na ziemiach polskich przed reformą metryczną. Ich wielkość zależy od zaboru: morga nowopolska ≈ 0,56 ha, pruska ≈ 0,255 ha, austriacka ≈ 0,5755 ha. Spotkasz je w starych księgach wieczystych, aktach notarialnych i kronikach rodzinnych.' },
        { title: 'Morga pruska', href: '/slovnik/morgen/', text: 'Niemiecka jednostka historyczna (Morgen) ≈ 0,255 ha. Dominuje w dokumentach z zaboru pruskiego — Wielkopolska, Pomorze, Śląsk — oraz na dawnych mapach niemieckich. Przydatna przy badaniu starych zapisów gruntowych.' },
      ],
      faqHeading: 'Częste pytania',
    },
  },
  // Fáze 3g: DE/AT. Sada jednotek v převodníku je PEVNÁ (m², a, ha, km², akr,
  // jitro, korec, strych, morgen) — historické jednotky se nepřejmenovávají na
  // Tagwerk apod., to by byl jiný převodní poměr. Rakouské jitro ALE Joch je,
  // takže se tak i jmenuje. Referenční tabulka navíc uvádí Tagwerk, Joch
  // a preußischer Morgen jako informaci, ne jako položku převodníku.
  de: {
    title: 'Flächeneinheiten umrechnen — Hektar, Ar, m², Acre, Joch, Morgen',
    metaDescription:
      'Online-Rechner für Flächeneinheiten: Hektar ↔ Ar ↔ m² ↔ km² ↔ Acre ↔ Joch ↔ Morgen. Sofortiges Ergebnis, für Landwirte, Vermesser und Grundbuchauszüge in Deutschland und Österreich.',
    h1: 'Flächeneinheiten umrechnen',
    crumb: 'Flächeneinheiten',
    kicker: 'Rechner · Einheiten und Maße',
    lede:
      'Wert in einer beliebigen Einheit eingeben und sofort die Umrechnung in alle anderen sehen — Hektar, Ar, Quadratmeter, Acre sowie historische Einheiten. Der Rechner läuft ohne Anmeldung, gerechnet wird im Browser.',
    converterHeading: 'Online-Umrechner für Flächeneinheiten',
    converterCaption:
      'Tipp: ins Wertfeld klicken und tippen — alle Umrechnungen aktualisieren sich live. Für historische Einheiten gelten die 1764 standardisierten Werte; regionale Varianten konnten leicht abweichen.',
    ui: { inputLabel: 'Wert eingeben', unitSelectLabel: 'Einheit wählen' },
    cardLinkLabel: 'Details',
    unitNames: {
      m2: 'Quadratmeter', a: 'Ar', ha: 'Hektar', km2: 'Quadratkilometer',
      acre: 'Acre', jitro: 'Joch (österreichisch)', korec: 'Korec (tschechisch)',
      strych: 'Strych (tschechisch)', morgen: 'preußischer Morgen',
    },
    numberLocale: 'de-DE',
    faq: [
      { q: 'Wie viel sind 1 Hektar in m² und Ar?', a: '1 Hektar (ha) = 10 000 m² = 100 Ar (a) = 0,01 km². Ein Hektar ist ein Quadrat von 100 × 100 Metern. In der Landwirtschaft ist der Hektar die Standardeinheit für Schlaggrößen, Direktzahlungen je Hektar und Erträge (t/ha).' },
      { q: 'Wie viele m² hat 1 Ar?', a: '1 Ar (a) = 100 m² = Quadrat von 10 × 10 m = 0,01 Hektar. 100 Ar ergeben einen Hektar. In Österreich und Süddeutschland ist das Ar bei Gärten und kleinen Parzellen noch geläufig.' },
      { q: 'Wie viel ist 1 Acre in Hektar?', a: '1 Acre = 4 046,86 m² = 0,4047 Hektar = rund 40,5 Ar. Der Acre ist die angelsächsische Einheit in den USA, Großbritannien, Kanada und Australien. Zum Umrechnen Acre mit 0,4047 multiplizieren.' },
      { q: 'Wie rechnet man Bushel je Acre in Tonnen je Hektar um?', a: 'Je nach Kultur. Für Weizen und Soja: bu/ac × 0,0673 = t/ha. Für Mais: bu/ac × 0,0628 = t/ha. Beispiel: 175 bu/ac Mais ≈ 11 t/ha. Das USDA veröffentlicht Erträge in Bushel je Acre, die EU in t/ha.' },
      { q: 'Was ist ein Joch, ein Tagwerk und ein Morgen?', a: 'Historische Flächenmaße vor der metrischen Reform. Das österreichische Joch (auch niederösterreichisches Joch) = 5 755 m² = 0,5755 ha, das bayerische Tagwerk = 3 407 m² = 0,3407 ha, der preußische Morgen = 2 553 m² = 0,2553 ha. Alle drei stehen für die Fläche, die ein Gespann an einem Tag pflügen konnte — daher die Unterschiede.' },
      { q: 'Wozu dient das Hektolitergewicht bei Getreide?', a: 'Das Hektolitergewicht (kg/hl) ist ein Qualitätsmerkmal — die Masse von 100 Litern Getreide. Höheres hl-Gewicht bedeutet mehr Stärke beziehungsweise Öl und bessere Mahlqualität. Weizen ab 78 kg/hl gilt als Brotweizen, unter 74 kg/hl als Futterweizen.' },
    ],
    related: {
      heading: 'Weitere nützliche Seiten',
      items: [
        { href: '/de/kalkulacka/prevody-hmotnost/', label: '⚖️ Masseeinheiten umrechnen' },
        { href: '/de/slovnik/', label: '📐 Fachbegriffe — Einheiten und Maße' },
        { href: '/de/stroje/', label: '🚜 Traktoren- und Maschinenkatalog' },
      ],
    },
    sections: {
      comparisonsHeading: 'Wie viel ist das? Anschaulicher Vergleich',
      comparisonsCaption:
        'Die Fläche wird als Raster aus Referenzkacheln gezeichnet — je mehr hineinpassen, desto kleiner sind sie. Richtwerte: Parkplatz ≈ 12,5 m², Tennisplatz ≈ 261 m², Eishockeyfeld ≈ 1 800 m², Fußballfeld ≈ 7 140 m² (0,71 ha). Die Prager Objekte dienen nur als Größenmaßstab: Altstädter Ring ≈ 9 000 m², Wenzelsplatz ≈ 45 000 m², Prager Burg ≈ 70 000 m².',
      // Fotky leží pod /images/srovnani/<slug> — tytéž soubory jako v cs, takže
      // objekty zůstávají a překládají se jen názvy. Pražské body jsou výslovně
      // označené jako pražské, ať nevypadají jako německé či rakouské.
      comparisons: [
        { emoji: '🅿️', name: 'Parkplatz', m2: 12.5, slug: 'parkovaci-misto', credit: 'Foto: Gabriel Picard, CC BY-SA 4.0' },
        { emoji: '🎾', name: 'Tennisplatz', m2: 261, slug: 'tenisovy-kurt', credit: 'Foto: KeepActive Australia, CC BY-SA 4.0' },
        { emoji: '🏒', name: 'Eishockeyfeld', m2: 1800, slug: 'hokejove-kluziste', credit: 'Foto: Frettie, CC BY-SA 3.0' },
        { emoji: '⚽', name: 'Fußballfeld', m2: 7140, slug: 'fotbalove-hriste', credit: 'Foto: Stephen Kennard, CC BY-SA 3.0' },
        { emoji: '🏛️', name: 'Altstädter Ring in Prag', m2: 9000, slug: 'staromestske-nam', credit: 'Foto: A.Savin, FAL' },
        { emoji: '🏙️', name: 'Wenzelsplatz in Prag', m2: 45000, slug: 'vaclavske-nam', credit: 'Foto: Slyronit, CC BY-SA 4.0' },
        { emoji: '🏰', name: 'Prager Burg', m2: 70000, slug: 'prazsky-hrad', credit: 'Foto: Dietmar Rabich, CC BY-SA 4.0' },
      ],
      cmpText: {
        pickerLabel: 'Vergleichen mit', selectAria: 'Vergleichsobjekt wählen',
        frameIs: 'Rahmen =', yourInput: 'grüne Fläche = deine Eingabe',
        tileIs: '1 Kachel =', shownFirst: 'erste {n} von {total} angezeigt',
      },
      refHeading: 'Referenztabelle — die häufigsten Umrechnungen',
      tables: [
        { caption: 'Hektar (ha) in andere Einheiten', rows: [
          ['1 ha', '= 10 000 m²'], ['1 ha', '= 100 a (Ar)'], ['1 ha', '= 0,01 km²'],
          ['1 ha', '≈ 2,471 Acre'], ['1 ha', '≈ 1,738 Joch (österreichisch)'],
          ['1 ha', '≈ 2,935 Tagwerk (bayerisch)'], ['1 ha', '≈ 3,917 preußische Morgen'],
        ] },
        { caption: 'Ar (a) in andere Einheiten', rows: [
          ['1 a', '= 100 m²'], ['1 a', '= 0,01 ha'], ['1 a', '≈ 0,0247 Acre'],
          ['100 a', '= 1 ha'], ['4 a', '= 400 m² (kleiner Garten)'], ['10 a', '= 1 000 m² (größerer Garten)'],
        ] },
        { caption: 'Acre in andere Einheiten', rows: [
          ['1 Acre', '= 4 046,86 m²'], ['1 Acre', '≈ 0,4047 ha'], ['1 Acre', '≈ 40,47 a'],
          ['1 Acre', '= 4 840 Quadratyard'], ['2,471 Acre', '= 1 ha'], ['640 Acre', '= 1 Quadratmeile (US section)'],
        ] },
        // Historické jednotky DE/AT — pro německého čtenáře podstatnější než
        // české jitro a korec, které v převodníku zůstávají označené jako české.
        { caption: 'Historische Einheiten in Deutschland und Österreich', rows: [
          ['1 Joch (Österreich)', '= 5 755 m² = 0,5755 ha'],
          ['1 Tagwerk (Bayern)', '= 3 407 m² = 0,3407 ha'],
          ['1 preußischer Morgen', '= 2 553 m² = 0,2553 ha'],
          ['1 Hufe (Bauernstelle)', '≈ 30 Morgen ≈ 7,5 ha'],
          ['1 Quadratrute (preußisch)', '≈ 14,18 m²'],
          ['180 Quadratruten', '= 1 preußischer Morgen'],
        ] },
      ],
      contextHeading: 'Wofür sind die einzelnen Einheiten gut?',
      cards: [
        { title: 'Hektar (ha)', href: '/slovnik/hektar/', text: 'Standardeinheit in Land- und Forstwirtschaft. Sie bestimmt Betriebsgrößen, Direktzahlungen je Hektar, Erträge (t/ha) und Aufwandmengen im Pflanzenschutz (l/ha). 1 ha entspricht etwa 1,4 Fußballfeldern.' },
        { title: 'Ar (a)', href: '/slovnik/ar/', text: 'Einheit für kleine Flächen — Gärten, Hausparzellen, Weinbergsflächen kleiner Winzer. 1 Ar = Quadrat von 10 × 10 m. In Österreich im Sprachgebrauch weiterhin verbreitet, im Grundbuch wird in m² geführt.' },
        { title: 'Quadratmeter (m²)', href: '/slovnik/metr-ctvrecni/', text: 'SI-Basiseinheit der Fläche. Amtlicher Eintrag im Liegenschaftskataster, Grundlage der Grundsteuer, Maß für Baugrundstücke, Wohnungen und Hallen. Fachübergreifend universell.' },
        { title: 'Acre', href: '/slovnik/akr/', text: 'Angelsächsische Einheit für USA, Großbritannien, Kanada und Australien. Für Betriebe hier vor allem beim Lesen von USDA-Daten (Erträge in bu/ac), CBOT-Notierungen und im Exportgeschäft relevant.' },
        { title: 'Joch und Tagwerk', href: '/slovnik/jitro/', text: 'Historische Maße im Alpenraum und in Süddeutschland. Österreichisches Joch ≈ 0,5755 ha, bayerisches Tagwerk ≈ 0,3407 ha. Beide begegnen einem in alten Grundbuchauszügen, Erbteilungen und Hofchroniken.' },
        { title: 'Morgen', href: '/slovnik/morgen/', text: 'Preußischer Morgen ≈ 0,2553 ha. Er dominiert in Unterlagen aus Norddeutschland, Brandenburg und Schlesien sowie auf alten preußischen Katasterkarten. Beim Kauf älterer Flächen hilfreich zu kennen.' },
      ],
      faqHeading: 'Häufige Fragen',
    },
  },
  // Ukrajinština: „сотка" (= ар) je v UA běžná jednotka pro zahrady a přídomkové
  // pozemky, proto je v FAQ i v tabulce zmíněná výslovně. Historická jednotka
  // není české jitro, ale десятина (1,0925 ha) — ta v převodníku není, tabulka
  // ji proto uvádí jako referenci.
  uk: {
    title: 'Переведення одиниць площі — гектар, ар, м², акр, десятина',
    metaDescription:
      'Онлайн-калькулятор переведення одиниць площі: гектар ↔ ар (сотка) ↔ м² ↔ км² ↔ акр. Миттєвий результат — для аграріїв, землевпорядників і роботи з витягами.',
    h1: 'Переведення одиниць площі',
    crumb: 'Одиниці площі',
    kicker: 'Калькулятор · одиниці та виміри',
    lede:
      'Введіть значення в будь-якій одиниці й одразу побачите переведення в усі інші — гектари, ари (сотки), квадратні метри, акри та історичні одиниці. Калькулятор працює без реєстрації, обчислення виконуються у браузері.',
    converterHeading: 'Онлайн-конвертер одиниць площі',
    converterCaption:
      'Порада: клацніть у поле зі значенням і почніть друкувати — усі переведення оновлюються наживо. Для історичних одиниць використано стандартизовані значення 1764 року, регіональні варіанти могли трохи відрізнятися.',
    ui: { inputLabel: 'Введіть значення', unitSelectLabel: 'Виберіть одиницю' },
    cardLinkLabel: 'детальніше',
    unitNames: {
      m2: 'квадратний метр', a: 'ар', ha: 'гектар', km2: 'квадратний кілометр',
      acre: 'акр (acre)', jitro: 'йітро (австро-угорське)', korec: 'корець (чеський)',
      strych: 'стрих (чеський)', morgen: 'прусський морген',
    },
    numberLocale: 'uk-UA',
    faq: [
      { q: 'Скільки це 1 гектар у м² та арах?', a: '1 гектар (га) = 10 000 м² = 100 арів (соток) = 0,01 км². Гектар — це квадрат 100 × 100 метрів. В агросекторі це стандартна одиниця для площі полів, ставок оренди паю та врожайності (т/га).' },
      { q: 'Скільки м² в одному арі (сотці)?', a: '1 ар (а) = 100 м² = квадрат 10 × 10 м = 0,01 гектара. В Україні ар зазвичай називають соткою: 100 соток = 1 гектар. Присадибні ділянки й городи міряють саме в сотках.' },
      { q: 'Скільки це 1 акр у гектарах?', a: '1 акр (acre) = 4 046,86 м² = 0,4047 гектара = приблизно 40,5 сотки. Акр — англосаксонська одиниця, яку використовують США, Велика Британія, Канада й Австралія. Щоб перевести акри в гектари, помножте значення на 0,4047.' },
      { q: 'Як перевести бушелі на акр у тонни з гектара?', a: 'Залежить від культури. Для пшениці та сої: бушель/акр × 0,0673 = т/га. Для кукурудзи: × 0,0628. Приклад: 175 бушелів/акр кукурудзи ≈ 11 т/га. USDA публікує врожайність у бушелях на акр, ЄС — у т/га.' },
      { q: 'Що таке десятина і скільки вона має?', a: 'Історична одиниця площі, поширена в Україні до метричної реформи. Казенна десятина = 10 925 м² = 1,0925 га (2 400 квадратних сажнів). Трапляється у старих документах на землю, церковних книгах і родинних архівах. Господарська десятина була більшою — до 1,45 га.' },
      { q: 'Навіщо потрібна натура зерна?', a: 'Натура (кг/гл) — це маса 100 літрів зерна, показник якості при прийманні. Вища натура означає більший вміст крохмалю чи олії та кращі млинарські властивості. Пшениця від 78 кг/гл — продовольча, менш ніж 74 кг/гл — фуражна.' },
    ],
    related: {
      heading: 'Інші корисні сторінки',
      items: [
        { href: '/uk/kalkulacka/prevody-hmotnost/', label: '⚖️ Переведення одиниць маси' },
        { href: '/uk/slovnik/', label: '📐 Словник — одиниці та виміри' },
        { href: '/uk/stroje/', label: '🚜 Каталог тракторів і техніки' },
      ],
    },
    sections: {
      comparisonsHeading: 'Скільки це? Наочне порівняння',
      comparisonsCaption:
        'Площа малюється як сітка з еталонних плиток — що більше їх уміщується, то вони дрібніші. Орієнтовні розміри: паркомісце ≈ 12,5 м², тенісний корт ≈ 261 м², хокейний майданчик ≈ 1 800 м², футбольне поле ≈ 7 140 м² (0,71 га). Празькі обʼєкти наведені лише як масштаб: Староміська площа ≈ 9 000 м², Вацлавська площа ≈ 45 000 м², Празький град ≈ 70 000 м².',
      comparisons: [
        { emoji: '🅿️', name: 'паркомісце', m2: 12.5, slug: 'parkovaci-misto', credit: 'Фото: Gabriel Picard, CC BY-SA 4.0' },
        { emoji: '🎾', name: 'тенісний корт', m2: 261, slug: 'tenisovy-kurt', credit: 'Фото: KeepActive Australia, CC BY-SA 4.0' },
        { emoji: '🏒', name: 'хокейний майданчик', m2: 1800, slug: 'hokejove-kluziste', credit: 'Фото: Frettie, CC BY-SA 3.0' },
        { emoji: '⚽', name: 'футбольне поле', m2: 7140, slug: 'fotbalove-hriste', credit: 'Фото: Stephen Kennard, CC BY-SA 3.0' },
        { emoji: '🏛️', name: 'Староміська площа в Празі', m2: 9000, slug: 'staromestske-nam', credit: 'Фото: A.Savin, FAL' },
        { emoji: '🏙️', name: 'Вацлавська площа в Празі', m2: 45000, slug: 'vaclavske-nam', credit: 'Фото: Slyronit, CC BY-SA 4.0' },
        { emoji: '🏰', name: 'Празький град', m2: 70000, slug: 'prazsky-hrad', credit: 'Фото: Dietmar Rabich, CC BY-SA 4.0' },
      ],
      cmpText: {
        pickerLabel: 'Порівняти з', selectAria: 'Виберіть обʼєкт для порівняння',
        frameIs: 'Рамка =', yourInput: 'зелена площа = ваше значення',
        tileIs: '1 плитка =', shownFirst: 'показано перші {n} з {total}',
      },
      refHeading: 'Довідкова таблиця — найчастіші переведення',
      tables: [
        { caption: 'Гектар (га) в інші одиниці', rows: [
          ['1 га', '= 10 000 м²'], ['1 га', '= 100 арів (соток)'], ['1 га', '= 0,01 км²'],
          ['1 га', '≈ 2,471 акра'], ['1 га', '≈ 0,9153 казенної десятини'],
          ['1 га', '≈ 3,917 прусського моргена'],
        ] },
        { caption: 'Ар (сотка) в інші одиниці', rows: [
          ['1 сотка', '= 100 м²'], ['1 сотка', '= 0,01 га'], ['1 сотка', '≈ 0,0247 акра'],
          ['100 соток', '= 1 га'], ['6 соток', '= 600 м² (класична дача)'], ['25 соток', '= 2 500 м² (садиба)'],
        ] },
        { caption: 'Акр (acre) в інші одиниці', rows: [
          ['1 акр', '= 4 046,86 м²'], ['1 акр', '≈ 0,4047 га'], ['1 акр', '≈ 40,47 сотки'],
          ['1 акр', '= 4 840 квадратних ярдів'], ['2,471 акра', '= 1 га'], ['640 акрів', '= 1 квадратна миля (US section)'],
        ] },
        { caption: 'Історичні одиниці, поширені в Україні', rows: [
          ['1 казенна десятина', '= 10 925 м² = 1,0925 га'],
          ['1 господарська десятина', '≈ 14 567 м² ≈ 1,4567 га'],
          ['1 квадратний сажень', '≈ 4,552 м²'],
          ['2 400 кв. сажнів', '= 1 казенна десятина'],
          ['1 морг (галицький)', '≈ 5 755 м² ≈ 0,5755 га'],
          ['1 прусський морген', '= 2 553 м² = 0,2553 га'],
        ] },
      ],
      contextHeading: 'Для чого потрібна кожна одиниця?',
      cards: [
        { title: 'Гектар (га)', href: '/slovnik/hektar/', text: 'Стандартна одиниця в агросекторі та лісівництві. Нею міряють площу господарств, орендні ставки за пай, урожайність (т/га) і норми внесення (л/га). 1 га — це приблизно 1,4 футбольного поля.' },
        { title: 'Ар (сотка)', href: '/slovnik/ar/', text: 'Одиниця для невеликих ділянок — городи, присадибні ділянки, дачі. 1 сотка = квадрат 10 × 10 м. У побуті домінує саме сотка, у документах площу записують у гектарах або м².' },
        { title: 'Квадратний метр (м²)', href: '/slovnik/metr-ctvrecni/', text: 'Базова одиниця СІ. Офіційний запис у Державному земельному кадастрі, основа для плати за землю, площа будівельних ділянок, квартир і ангарів.' },
        { title: 'Акр (acre)', href: '/slovnik/akr/', text: 'Англосаксонська одиниця для США, Великої Британії, Канади й Австралії. Для українського аграрія важлива при читанні даних USDA (урожайність у бушелях на акр), котирувань CBOT і в експортних контрактах.' },
        { title: 'Десятина', href: '/slovnik/jitro/', text: 'Історична одиниця площі до метричної реформи. Казенна десятина ≈ 1,0925 га, господарська — до 1,4567 га. Трапляється у старих документах на землю, метричних книгах і родинних архівах.' },
        { title: 'Морген і морг', href: '/slovnik/morgen/', text: 'Прусський морген ≈ 0,2553 га, галицький морг ≈ 0,5755 га. Перший трапляється в німецьких документах, другий — у документах із західних областей часів Австро-Угорщини.' },
      ],
      faqHeading: 'Часті запитання',
    },
  },
};
