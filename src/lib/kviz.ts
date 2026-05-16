// Kvíz znalostí o historii a technologiích zemědělských značek.
// Statický set otázek — 15+ otázek, každá multi-choice s 4 možnostmi.
// Hodnocení: 0–5 → "Začátečník", 6–10 → "Hospodář", 11–14 → "Expert", 15+ → "Legenda".

export interface QuizOption {
  text: string;
  /** Volitelný kratší vysvětlovací popisek za "Správně!" / "Špatně" hláškou. */
  hint?: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: QuizOption[];
  /** Index správné odpovědi (0-based). */
  correct: number;
  /** Vysvětlení po odpovědi — proč je to tak. Krátké, 2-3 věty. */
  explanation: string;
  /** Volitelný link na detailní zdroj v rámci agro-svět. */
  sourceUrl?: string;
  sourceLabel?: string;
}

export const KVIZ_HISTORIE: QuizQuestion[] = [
  {
    id: 'q1',
    question: 'Která značka jako první uvedla bezstupňovou CVT převodovku do sériového traktoru?',
    options: [
      { text: 'John Deere' },
      { text: 'Fendt' },
      { text: 'Massey Ferguson' },
      { text: 'Case IH' },
    ],
    correct: 1,
    explanation: 'Fendt uvedl Vario CVT v roce 1995 v modelu Favorit 926 Vario. Stal se standardem prémiových traktorů — ostatní výrobci přidali vlastní CVT (JD AutoPowr, NH Auto Command, Case CVX) až po 2000.',
    sourceUrl: '/slovnik/cvt-prevodovka/',
    sourceLabel: 'CVT převodovka',
  },
  {
    id: 'q2',
    question: 'V jakém roce John Deere vyrobil svůj první ocelový pluh?',
    options: [
      { text: '1810' },
      { text: '1837' },
      { text: '1865' },
      { text: '1900' },
    ],
    correct: 1,
    explanation: 'John Deere (kovář z Grand Detour, Illinois) zkonstruoval první ocelový pluh v roce 1837. Tento pluh dokázal obracet těžkou prérijní půdu Středozápadu — díky tomu se Deere stal základem americké zemědělské revoluce.',
    sourceUrl: '/znacky/john-deere/',
    sourceLabel: 'John Deere',
  },
  {
    id: 'q3',
    question: 'Co je AdBlue?',
    options: [
      { text: 'Modrá olejová barva pro stříkání traktorů' },
      { text: 'Chladicí kapalina pro dieselové motory' },
      { text: '32,5% vodný roztok močoviny, který redukuje NOx emise' },
      { text: 'Aditivum proti zamrznutí nafty' },
    ],
    correct: 2,
    explanation: 'AdBlue je 32,5% vodný roztok močoviny (chemicky CO(NH₂)₂ + H₂O), který se vstřikuje do výfuku dieselových motorů. V SCR katalyzátoru reaguje s NOx → neškodný dusík a vodu. Standard od emisní normy Stage IV.',
    sourceUrl: '/slovnik/adblue/',
    sourceLabel: 'AdBlue',
  },
  {
    id: 'q4',
    question: 'Kolik let trvalo Zetoru, než postavil první milion traktorů?',
    options: [
      { text: '20 let (1946–1966)' },
      { text: '40 let (1946–1986)' },
      { text: '30 let (1946–1976)' },
      { text: '50 let (1946–1996)' },
    ],
    correct: 2,
    explanation: 'Zetor vyrobil milióntý traktor v roce 1976 — 30 let od založení (1946). V té době byl Zetor jeden z největších výrobců traktorů v Evropě a klíčový exportér do RVHP zemí, Indie, Iráku a Etiopie.',
    sourceUrl: '/znacky/zetor/',
    sourceLabel: 'Zetor',
  },
  {
    id: 'q5',
    question: 'Která značka tvrdí, že vynalezla tříbodový hydraulický závěs (Ferguson System)?',
    options: [
      { text: 'John Deere' },
      { text: 'Massey Ferguson (původně Harry Ferguson)' },
      { text: 'Fiat' },
      { text: 'International Harvester' },
    ],
    correct: 1,
    explanation: 'Harry Ferguson (severoírský konstruktér) patentoval Ferguson System v 30. letech 20. století — tříbodový hydraulický závěs s automatickou regulací zatížení. V roce 1953 se firma sloučila s Massey-Harris → Massey-Ferguson. Tříbod je dodnes standard.',
    sourceUrl: '/slovnik/tribod/',
    sourceLabel: 'Tříbodový závěs',
  },
  {
    id: 'q6',
    question: 'Jaký je rozdíl mezi PTO 540 a 540E (Economy)?',
    options: [
      { text: '540E má vyšší kroutivý moment' },
      { text: '540E drží 540 ot/min při nižších otáčkách motoru → úspora paliva' },
      { text: '540E je elektrické provedení místo mechanického' },
      { text: '540E je novější bezpečnostní standard' },
    ],
    correct: 1,
    explanation: 'PTO 540E (Economy) drží standardních 540 ot/min, ale motor traktoru běží na úsporných ~1500 ot/min místo plných 2100 ot/min. Úspora paliva 10–15 % při lehkých PTO úkolech (mulčování, sečení). Nevhodné pro vysoké zatížení.',
    sourceUrl: '/slovnik/pto/',
    sourceLabel: 'PTO (Vývodový hřídel)',
  },
  {
    id: 'q7',
    question: 'Která země je tradičním výrobcem značky Fendt?',
    options: [
      { text: 'Itálie' },
      { text: 'Německo' },
      { text: 'Švédsko' },
      { text: 'Rakousko' },
    ],
    correct: 1,
    explanation: 'Fendt je německý výrobce z bavorského Marktoberdorfu (založen 1930 jako Xaver Fendt KG). Od roku 1997 součást amerického koncernu AGCO. Známý CVT převodovkou Vario, prémiovou kvalitou a charakteristickou zelenou barvou.',
    sourceUrl: '/znacky/fendt/',
    sourceLabel: 'Fendt',
  },
  {
    id: 'q8',
    question: 'Co znamená zkratka ISOBUS?',
    options: [
      { text: 'Mezinárodní systém ovládání palivového vstřiku' },
      { text: 'Standardizovaná komunikační sběrnice mezi traktorem a nářadím (ISO 11783)' },
      { text: 'Italský systém pro hodnocení traktorů' },
      { text: 'Elektronická navigace zemědělských dronů' },
    ],
    correct: 1,
    explanation: 'ISOBUS (ISO 11783) je mezinárodní standard pro komunikaci mezi traktorem a nářadím. Před ISOBUSem měl každý výrobce vlastní kabel/protokol. Dnes umožňuje ovládat secí stroj Lemken z displeje traktoru Fendt — jedno UI, jedna kabeláž.',
    sourceUrl: '/slovnik/isobus/',
    sourceLabel: 'ISOBUS',
  },
  {
    id: 'q9',
    question: 'Jaká přesnost má RTK GPS, který se používá v auto-steering systémech?',
    options: [
      { text: '~1 metr' },
      { text: '~30 cm' },
      { text: '~2–3 cm' },
      { text: '~5 mm' },
    ],
    correct: 2,
    explanation: 'RTK (Real-Time Kinematic) GPS dosahuje přesnosti 2–3 cm pomocí korekčního signálu z fixní referenční stanice. Standard pro auto-steering (autonomní řízení), variable rate aplikace a controlled traffic farming.',
    sourceUrl: '/slovnik/gps-rtk/',
    sourceLabel: 'RTK GPS',
  },
  {
    id: 'q10',
    question: 'Která česká plodina má nejvyšší VCS sazbu (Voluntary Coupled Support) v rámci CAP 2024?',
    options: [
      { text: 'Cukrová řepa (~7500 Kč/ha)' },
      { text: 'Chmel (~13 000 Kč/ha)' },
      { text: 'Brambory na škrob (~5500 Kč/ha)' },
      { text: 'Ovoce (~6500 Kč/ha)' },
    ],
    correct: 1,
    explanation: 'Chmel má nejvyšší VCS sazbu ~13 000 Kč/ha — strategická plodina pro CZ pivovarnictví. Na druhém místě je polní zelenina (~9000 Kč/ha), pak cukrová řepa (~7500 Kč/ha) a ovoce (~6500 Kč/ha).',
    sourceUrl: '/kalkulacka/dotace-cap/',
    sourceLabel: 'Kalkulačka dotací CAP',
  },
  {
    id: 'q11',
    question: 'Co je BISS v kontextu zemědělských dotací?',
    options: [
      { text: 'Britský systém ekologického zemědělství' },
      { text: 'Základní platba CAP 2024 (~2150 Kč/ha)' },
      { text: 'Certifikace bezpečnosti zemědělské techniky' },
      { text: 'Bavorský zemědělský standard' },
    ],
    correct: 1,
    explanation: 'BISS (Basic Income Support for Sustainability) je hlavní přímá platba CAP 2024 — ~2150 Kč/ha na všechnu způsobilou plochu. Nahradila dřívější SAPS. Pro farmu 100 ha = 215 000 Kč/rok jen BISS, plus další složky.',
    sourceUrl: '/slovnik/biss/',
    sourceLabel: 'BISS',
  },
  {
    id: 'q12',
    question: 'Která značka byla průkopníkem Quadtrac systému (gumové pásy místo kol u velkých traktorů)?',
    options: [
      { text: 'John Deere' },
      { text: 'Case IH' },
      { text: 'New Holland' },
      { text: 'Caterpillar' },
    ],
    correct: 1,
    explanation: 'Case IH uvedla Steiger Quadtrac s gumovými pásy v roce 1996 — čtyři nezávislé gumové pásy místo kol. Snižuje tlak na půdu, zlepšuje trakci. Konkurenční systémy: JD 9RX (od 2017), Challenger MT800 (od 1996).',
    sourceUrl: '/zebricky/traktory-nad-250-koni/',
    sourceLabel: 'Žebříček traktorů nad 250 koní',
  },
  {
    id: 'q13',
    question: 'Co je LPIS?',
    options: [
      { text: 'Lokální platforma pro investiční služby v zemědělství' },
      { text: 'Centrální evidence zemědělské půdy v ČR' },
      { text: 'Logistický systém pro distribuci paliv' },
      { text: 'Letecký průzkum stavu úrody' },
    ],
    correct: 1,
    explanation: 'LPIS (Land Parcel Identification System) je veřejná evidence způsobilé zemědělské půdy v ČR. Spravuje ÚKZÚZ, používá SZIF pro kontrolu dotací. Každý pozemek má unikátní LPIS blok. Bez aktuálního LPIS nelze podat žádost o dotace.',
    sourceUrl: '/slovnik/lpis/',
    sourceLabel: 'LPIS',
  },
  {
    id: 'q14',
    question: 'Která země je tradičním výrobcem značky Kubota?',
    options: [
      { text: 'Čína' },
      { text: 'Korea' },
      { text: 'Japonsko' },
      { text: 'Indie' },
    ],
    correct: 2,
    explanation: 'Kubota je japonský výrobce z Osaky (založena 1890). Dominantní v segmentu kompaktních traktorů (20–100 koní) a komunální techniky. V Evropě silně rostoucí značka, hlavně pro sady, vinohrady a komunální použití.',
    sourceUrl: '/znacky/kubota/',
    sourceLabel: 'Kubota',
  },
  {
    id: 'q15',
    question: 'Co je Stage V v zemědělství?',
    options: [
      { text: 'Fáze růstu obilovin (5. vývojové stadium)' },
      { text: 'Nejpřísnější aktuální emisní norma pro mimosilniční dieselové motory (od 2020)' },
      { text: 'Pátá generace satelitních zemědělských dat' },
      { text: 'Stupeň zralosti kompostu' },
    ],
    correct: 1,
    explanation: 'Stage V je nejpřísnější aktuální emisní norma EU pro mimosilniční dieselové motory (NRMM) — od ledna 2020 povinné pro nové traktory. Vyžaduje DPF + SCR + filtr pro PM nano částice. USA paralela: Tier 4 Final.',
    sourceUrl: '/slovnik/emisni-normy-stage/',
    sourceLabel: 'Emisní normy Stage / Tier',
  },
  {
    id: 'q16',
    question: 'Jaký je největší výrobce zemědělské techniky na světě podle obratu?',
    options: [
      { text: 'CNH Industrial (Case IH + New Holland)' },
      { text: 'AGCO (Fendt + Massey Ferguson + Valtra)' },
      { text: 'John Deere' },
      { text: 'CLAAS' },
    ],
    correct: 2,
    explanation: 'John Deere (Deere & Company) je dlouhodobě největší výrobce zemědělské techniky — obrat přes 60 miliard dolarů ročně, sídlo Moline, Illinois. CNH Industrial (Case + New Holland) druhý ~30 mld $, AGCO třetí ~15 mld $.',
    sourceUrl: '/znacky/',
    sourceLabel: 'Přehled značek',
  },
];

export function getLevel(score: number, total: number): { name: string; description: string; emoji: string } {
  const pct = (score / total) * 100;
  if (pct >= 90) return { name: 'Legenda', description: 'Vy jste živá encyklopedie zemědělské techniky. Klobouk dolů!', emoji: '🏆' };
  if (pct >= 70) return { name: 'Expert', description: 'Skvělé! V hospodářství i technice se vyznáte víc než většina.', emoji: '🎓' };
  if (pct >= 50) return { name: 'Hospodář', description: 'Solidní výsledek — základy historie a techniky máte v malíku.', emoji: '👨‍🌾' };
  if (pct >= 30) return { name: 'Učedník', description: 'Pár věcí už víte. Mrkněte na encyklopedii a slovník — uvidíte výrazné zlepšení.', emoji: '📚' };
  return { name: 'Začátečník', description: 'Žádný strach — všechno se dá naučit. Začněte u našich žebříčků a slovníku.', emoji: '🌱' };
}
