// Německá sada kvízu historie a technologií (trh Německo + Rakousko).
//
// 13 ze 16 otázek je jazykově neutrálních (historie značek, technika) → přeložené.
// 3 otázky byly vázané na ČESKOU jurisdikci a jsou NAHRAZENÉ, ne přeložené:
//   q10  VCS chmel v Kč        -> gekoppelte Einkommensstützung (Mutterkühe/-schafe)
//   q11  BISS ~2150 Kč/ha      -> Einkommensgrundstützung 152,44 €/ha (2025)
//   q13  LPIS pod ÚKZÚZ/SZIF   -> Feldblock a FLIK v InVeKoS
// Sazby jsou tytéž jako v tabulce na /de/direktzahlungen/ — kdyby se tam
// aktualizovaly, musí se změnit i tady, jinak si web protiřečí.
//
// ‼️ sourceUrl musí mířit jen do launchnutých DE sekcí. cs verze odkazuje na
// /kalkulacka/dotace-cap/, což pro de launchnuté není → nahrazeno
// /direktzahlungen/. Pořadí otázek i index správné odpovědi odpovídají cs.
import type { QuizQuestion } from './kviz';

export const KVIZ_HISTORIE_DE: QuizQuestion[] = [
  {
    id: 'q1',
    question: `Welche Marke brachte als erste ein stufenloses CVT-Getriebe in einen Serientraktor?`,
    options: [{ text: `John Deere` }, { text: `Fendt` }, { text: `Massey Ferguson` }, { text: `Case IH` }],
    correct: 1,
    explanation: `Fendt stellte das Vario-CVT 1995 im Favorit 926 Vario vor. Es wurde zum Standard der Premiumklasse — die übrigen Hersteller zogen mit eigenen Lösungen (JD AutoPowr, NH Auto Command, Case CVX) erst nach 2000 nach.`,
    sourceUrl: '/slovnik/cvt-prevodovka/',
    sourceLabel: `CVT-Getriebe`,
  },
  {
    id: 'q2',
    question: `In welchem Jahr baute John Deere seinen ersten Stahlpflug?`,
    options: [{ text: `1810` }, { text: `1837` }, { text: `1865` }, { text: `1900` }],
    correct: 1,
    explanation: `John Deere, Schmied in Grand Detour im US-Bundesstaat Illinois, konstruierte den ersten Stahlpflug 1837. Er bewältigte den schweren Prärieboden des Mittleren Westens, an dem gusseiserne Pflüge scheiterten — die Grundlage des späteren Konzerns.`,
    sourceUrl: '/znacky/john-deere/',
    sourceLabel: `John Deere`,
  },
  {
    id: 'q3',
    question: `Was ist AdBlue?`,
    options: [
      { text: `Blaue Öllackfarbe für Traktoren` },
      { text: `Kühlflüssigkeit für Dieselmotoren` },
      { text: `32,5-prozentige wässrige Harnstofflösung zur Reduktion von Stickoxiden` },
      { text: `Additiv gegen das Ausflocken von Diesel im Winter` },
    ],
    correct: 2,
    explanation: `AdBlue ist eine 32,5-prozentige wässrige Harnstofflösung, die in den Abgasstrang eingespritzt wird. Im SCR-Katalysator reagiert sie mit den Stickoxiden zu Stickstoff und Wasser. Seit der Abgasstufe Stage IV gehört sie zum Standard.`,
    sourceUrl: '/slovnik/adblue/',
    sourceLabel: `AdBlue`,
  },
  {
    id: 'q4',
    question: `Wie lange brauchte Zetor bis zum millionsten Traktor?`,
    options: [{ text: `20 Jahre (1946–1966)` }, { text: `40 Jahre (1946–1986)` }, { text: `30 Jahre (1946–1976)` }, { text: `50 Jahre (1946–1996)` }],
    correct: 2,
    explanation: `Zetor baute den millionsten Traktor 1976, dreißig Jahre nach der Gründung 1946. Der Hersteller aus Brünn war damals einer der größten Traktorproduzenten Europas und exportierte in großem Umfang nach Indien, in den Nahen Osten und nach Afrika.`,
    sourceUrl: '/znacky/zetor/',
    sourceLabel: `Zetor`,
  },
  {
    id: 'q5',
    question: `Wer gilt als Erfinder der Dreipunkthydraulik?`,
    options: [{ text: `John Deere` }, { text: `Massey Ferguson, ursprünglich Harry Ferguson` }, { text: `Fiat` }, { text: `International Harvester` }],
    correct: 1,
    explanation: `Der nordirische Konstrukteur Harry Ferguson meldete das Ferguson-System in den 1930er-Jahren zum Patent an — die Dreipunkthydraulik mit automatischer Zugkraftregelung. 1953 fusionierte sein Unternehmen mit Massey-Harris zu Massey-Ferguson. Der Dreipunkt ist bis heute Standard.`,
    sourceUrl: '/slovnik/tribod/',
    sourceLabel: `Dreipunkthydraulik`,
  },
  {
    id: 'q6',
    question: `Worin unterscheiden sich Zapfwelle 540 und 540E (Economy)?`,
    options: [
      { text: `540E überträgt ein höheres Drehmoment` },
      { text: `540E hält 540 min⁻¹ bei niedrigerer Motordrehzahl und spart dadurch Kraftstoff` },
      { text: `540E ist elektrisch statt mechanisch angetrieben` },
      { text: `540E ist eine neuere Sicherheitsnorm` },
    ],
    correct: 1,
    explanation: `Die Zapfwelle 540E hält dieselben 540 min⁻¹, der Motor läuft dabei aber bei rund 1.500 statt 2.100 min⁻¹. Bei leichten Zapfwellenarbeiten wie Mulchen oder Mähen spart das 10 bis 15 % Kraftstoff; für hohe Lasten ist sie ungeeignet.`,
    sourceUrl: '/slovnik/pto/',
    sourceLabel: `Zapfwelle`,
  },
  {
    id: 'q7',
    question: `Aus welchem Land stammt die Marke Fendt?`,
    options: [{ text: `Italien` }, { text: `Deutschland` }, { text: `Schweden` }, { text: `Österreich` }],
    correct: 1,
    explanation: `Fendt ist ein deutscher Hersteller aus Marktoberdorf im Allgäu, gegründet 1930 als Xaver Fendt KG. Seit 1997 gehört die Marke zum US-Konzern AGCO. Bekannt ist sie für das Vario-Getriebe und ihr charakteristisches Naturgrün.`,
    sourceUrl: '/znacky/fendt/',
    sourceLabel: `Fendt`,
  },
  {
    id: 'q8',
    question: `Wofür steht ISOBUS?`,
    options: [
      { text: `Internationales System zur Regelung der Kraftstoffeinspritzung` },
      { text: `Genormte Kommunikationsschnittstelle zwischen Traktor und Anbaugerät nach ISO 11783` },
      { text: `Italienisches Bewertungssystem für Traktoren` },
      { text: `Navigationssystem für Agrardrohnen` },
    ],
    correct: 1,
    explanation: `ISOBUS nach ISO 11783 ist der internationale Standard für die Kommunikation zwischen Traktor und Anbaugerät. Vor ihm hatte jeder Hersteller eigene Stecker und Protokolle; heute lässt sich eine Lemken-Sämaschine über das Terminal eines Fendt bedienen — ein Kabel, eine Bedienoberfläche.`,
    sourceUrl: '/slovnik/isobus/',
    sourceLabel: `ISOBUS`,
  },
  {
    id: 'q9',
    question: `Welche Genauigkeit erreicht RTK-GPS in Spurführungssystemen?`,
    options: [{ text: `etwa 1 Meter` }, { text: `etwa 30 cm` }, { text: `2 bis 3 cm` }, { text: `etwa 5 mm` }],
    correct: 2,
    explanation: `Real Time Kinematic erreicht über Korrekturdaten einer Referenzstation 2 bis 3 cm Genauigkeit — und, praktisch noch wichtiger, dieselbe Spur im Folgejahr. Das ist Voraussetzung für Controlled Traffic Farming, kamerafreies Hacken und Strip-Till.`,
    sourceUrl: '/slovnik/gps-rtk/',
    sourceLabel: `RTK-GPS`,
  },
  {
    id: 'q10',
    question: `Für welche Tiere zahlt Deutschland die höchste gekoppelte Einkommensstützung je Tier?`,
    options: [
      { text: `Mutterschafe und -ziegen (rund 36 €/Tier)` },
      { text: `Mutterkühe (rund 89 €/Tier)` },
      { text: `Mastschweine (rund 45 €/Tier)` },
      { text: `Legehennen (rund 12 €/Tier)` },
    ],
    correct: 1,
    explanation: `Deutschland koppelt Direktzahlungen nur an zwei Tierkategorien: Mutterkühe mit 89,37 €/Tier ab drei Tieren sowie Mutterschafe und -ziegen mit 36,14 €/Tier ab sechs Tieren (Antragsjahr 2025). Für Schweine und Geflügel gibt es keine gekoppelte Stützung.`,
    sourceUrl: '/direktzahlungen/',
    sourceLabel: `Direktzahlungen — Beträge je Hektar`,
  },
  {
    id: 'q11',
    question: `Was ist die Einkommensgrundstützung für Nachhaltigkeit (BISS)?`,
    options: [
      { text: `Ein britisches System für den ökologischen Landbau` },
      { text: `Die Basisdirektzahlung der GAP, in Deutschland 152,44 €/ha im Antragsjahr 2025` },
      { text: `Eine Sicherheitszertifizierung für Landmaschinen` },
      { text: `Ein bayerischer Agrarstandard` },
    ],
    correct: 1,
    explanation: `Die Einkommensgrundstützung ist die wichtigste Direktzahlung der GAP und wird auf alle förderfähigen Hektar gezahlt — 152,44 €/ha für das Antragsjahr 2025. Sie löste 2023 die frühere Basisprämie ab. Für einen Betrieb mit 100 ha sind das gut 15.000 € allein aus dieser Komponente.`,
    sourceUrl: '/slovnik/biss/',
    sourceLabel: `Einkommensgrundstützung`,
  },
  {
    id: 'q12',
    question: `Welche Marke führte als erste das Quadtrac-System mit vier Gummiraupen ein?`,
    options: [{ text: `John Deere` }, { text: `Case IH` }, { text: `New Holland` }, { text: `Caterpillar` }],
    correct: 1,
    explanation: `Case IH stellte den Steiger Quadtrac mit vier unabhängigen Gummiraupen 1996 vor. Die Bauweise senkt den Bodendruck und verbessert die Traktion. Konkurrenzsysteme sind der John Deere 9RX ab 2017 und der Challenger MT800 ebenfalls ab 1996.`,
    sourceUrl: '/zebricky/traktory-nad-250-koni/',
    sourceLabel: `Rangliste der Traktoren über 250 PS`,
  },
  {
    id: 'q13',
    question: `Was ist ein Feldblock?`,
    options: [
      { text: `Eine Plattform für Investitionsdienstleistungen in der Landwirtschaft` },
      { text: `Die von Dauergrenzen umschlossene Bezugsfläche im Flächenidentifizierungssystem` },
      { text: `Ein Logistiksystem für die Kraftstoffverteilung` },
      { text: `Ein Verfahren der Luftbildauswertung zur Ertragsschätzung` },
    ],
    correct: 1,
    explanation: `Der Feldblock ist die von dauerhaften Grenzen — Wegen, Gewässern, Waldrändern — umschlossene Bezugsfläche im Flächenidentifizierungssystem des InVeKoS. Er trägt eine eindeutige Kennung, den FLIK, und bildet die Grundlage jeder Flächenangabe im Sammelantrag. Der einzelne bewirtschaftete Teil darin heißt Schlag.`,
    sourceUrl: '/slovnik/lpis/',
    sourceLabel: `Feldblock und FLIK`,
  },
  {
    id: 'q14',
    question: `Aus welchem Land stammt die Marke Kubota?`,
    options: [{ text: `China` }, { text: `Korea` }, { text: `Japan` }, { text: `Indien` }],
    correct: 2,
    explanation: `Kubota ist ein japanischer Hersteller aus Osaka, gegründet 1890. Die Marke dominiert das Segment der Kompakttraktoren von 20 bis 100 PS und ist in Europa vor allem im Obst- und Weinbau sowie im Kommunalbereich stark gewachsen.`,
    sourceUrl: '/znacky/kubota/',
    sourceLabel: `Kubota`,
  },
  {
    id: 'q15',
    question: `Was bedeutet Stage V in der Landtechnik?`,
    options: [
      { text: `Das fünfte Entwicklungsstadium des Getreides` },
      { text: `Die derzeit strengste EU-Abgasstufe für mobile Maschinen, verbindlich seit 2020` },
      { text: `Die fünfte Generation landwirtschaftlicher Satellitendaten` },
      { text: `Ein Reifegrad von Kompost` },
    ],
    correct: 1,
    explanation: `Stage V ist die derzeit strengste EU-Abgasstufe für mobile Maschinen und Geräte und gilt seit Januar 2020 für neue Traktoren. Sie verlangt Partikelfilter und SCR-Technik und begrenzt erstmals auch die Partikelanzahl. Das US-Pendant ist Tier 4 Final.`,
    sourceUrl: '/slovnik/emisni-normy-stage/',
    sourceLabel: `Abgasstufen Stage und Tier`,
  },
  {
    id: 'q16',
    question: `Wer ist der weltweit größte Landtechnikhersteller nach Umsatz?`,
    options: [
      { text: `CNH Industrial (Case IH und New Holland)` },
      { text: `AGCO (Fendt, Massey Ferguson und Valtra)` },
      { text: `John Deere` },
      { text: `CLAAS` },
    ],
    correct: 2,
    explanation: `John Deere, die Deere & Company mit Sitz in Moline im US-Bundesstaat Illinois, ist seit Langem der größte Landtechnikhersteller der Welt mit einem Umsatz von über 50 Milliarden Dollar. Es folgen CNH Industrial und AGCO mit deutlichem Abstand.`,
    sourceUrl: '/znacky/',
    sourceLabel: `Übersicht der Marken`,
  },
];

/** Úrovně hodnocení. Prahy (%) jsou shodné s cs, mění se jen texty. */
export const LEVELS_DE = [
  { min: 90, name: 'Legende', description: 'Sie sind ein wandelndes Lexikon der Landtechnik. Hut ab!', emoji: '🏆' },
  { min: 70, name: 'Experte', description: 'Ausgezeichnet — in Betrieb und Technik kennen Sie sich besser aus als die meisten.', emoji: '🎓' },
  { min: 50, name: 'Landwirt', description: 'Solides Ergebnis: Die Grundlagen von Geschichte und Technik sitzen.', emoji: '👨‍🌾' },
  { min: 30, name: 'Lehrling', description: 'Einiges wissen Sie schon. Ein Blick in Enzyklopädie und Glossar bringt Sie spürbar weiter.', emoji: '📚' },
  { min: 0, name: 'Einsteiger', description: 'Kein Grund zur Sorge — alles lässt sich lernen. Fangen Sie bei den Ranglisten und dem Glossar an.', emoji: '🌱' },
];
