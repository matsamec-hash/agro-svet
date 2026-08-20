import type { Locale } from '../config';
import type { CalcMeta } from './types';

export interface PrevodyJednotekContent extends CalcMeta {
  converterHeading: string;
  converterCaption: string;
  ui: { inputLabel: string; unitSelectLabel: string };
  unitNames: Record<string, string>;
  numberLocale: 'cs-CZ' | 'sk-SK' | 'pl-PL';
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
};
