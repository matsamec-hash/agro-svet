export interface DecisionRow {
  /** Typ techniky/investice, jak ji hledá zemědělec. */
  strojTyp: string;
  /** Slug existujícího dotačního titulu (== filename v src/content/dotace). */
  titulSlug: string;
  /** Intervence kód (zobrazení). */
  intervence: string;
  /** Odkaz na relevantní kategorii strojů (existující ruta /stroje/...). */
  strojeHref: string;
  /** Klíčové omezení (1 věta). */
  omezeni: string;
}

export interface EligibilityGroup {
  label: string;
  popis: string;
}

export const DECISION_ROWS: DecisionRow[] = [
  {
    strojTyp: 'Traktor, secí stroj, sklízeč, postřikovač',
    titulSlug: 'investice-do-zemedelskych-podniku-33-73',
    intervence: '33.73',
    strojeHref: '/stroje/traktory/',
    omezeni: 'Mobilní stroje smí tvořit max. 49 % způsobilých výdajů projektu.',
  },
  {
    strojTyp: 'Technologie snižující emise (aplikace kejdy, hadicové aplikátory)',
    titulSlug: 'technologie-snizujici-emise-37-73',
    intervence: '37.73',
    strojeHref: '/stroje/aplikatory-kejda/',
    omezeni: 'Cíleno na technologie snižující emise GHG a NH3.',
  },
  {
    strojTyp: 'Linka a technologie na zpracování zemědělských produktů',
    titulSlug: 'investice-do-zpracovani-zemedelskych-produktu-34-73',
    intervence: '34.73',
    strojeHref: '/stroje/',
    omezeni: 'Zpracování produktů a uvedení na trh, ne primární zemědělská výroba.',
  },
  {
    strojTyp: 'Diverzifikace — agroturistika, řemeslo, služby na farmě',
    titulSlug: 'investice-do-nezemedelskych-cinnosti-45-73',
    intervence: '45.73',
    strojeHref: '/stroje/',
    omezeni: 'Nezemědělské činnosti zemědělce, ne zemědělská prvovýroba.',
  },
  {
    strojTyp: 'Inovativní technologie zpracování (ve spolupráci s výzkumem)',
    titulSlug: 'inovace-pri-zpracovani-zemedelskych-produktu-51-77',
    intervence: '51.77',
    strojeHref: '/stroje/',
    omezeni: 'Vyžaduje uskupení výrobce a výzkumné instituce; inovace nová pro odvětví.',
  },
  {
    strojTyp: 'Lesní cesty a sklady dříví',
    titulSlug: 'investice-do-lesnicke-infrastruktury-36-73',
    intervence: '36.73',
    strojeHref: '/stroje/lesni-vyvazecky/',
    omezeni: 'Lesnická infrastruktura, ne mobilní lesní technika.',
  },
  {
    strojTyp: 'Obnova lesa po kalamitě (zalesnění, ochrana porostů)',
    titulSlug: 'investice-do-obnovy-kalamitnich-ploch-38-73',
    intervence: '38.73',
    strojeHref: '/stroje/stepkovace/',
    omezeni: 'Obnova kalamitami poškozených lesních ploch.',
  },
];

export const ELIGIBILITY: EligibilityGroup[] = [
  {
    label: 'Zemědělský podnikatel',
    popis:
      'Fyzická i právnická osoba evidovaná podle zákona č. 252/1997 Sb., o zemědělství, provozující zemědělskou výrobu.',
  },
  {
    label: 'Mladý začínající zemědělec',
    popis:
      'Do 40 let a poprvé v čele podniku — bonifikace u investičních titulů a samostatné tituly na zahájení činnosti.',
  },
  {
    label: 'Malé hospodářství do 150 ha',
    popis:
      'U titulu 33.73 platí výjimka z pravidla 49 % na mobilní stroje — traktor lze dotovat ve vyšším podílu.',
  },
  {
    label: 'Vlastník či nájemce lesa',
    popis:
      'Pro lesnické tituly (36.73, 38.73) žádají držitelé lesů hospodařící podle lesního hospodářského plánu nebo osnovy.',
  },
];
