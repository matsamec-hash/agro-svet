// Lokalizace českých datových polí katalogu strojů (`engine`, `youtube_title`).
//
// PROČ TOKENY A NE PŘEKLAD: distinktních hodnot je jen 91 a jsou striktně
// formulkové — „Deutz F3L 912, 3-válec vzduchem chlazený 2,8 L". Typová
// označení (F3L 912, PowerTech PSS, Stage V, turbo, intercooler, common rail)
// jsou mezinárodní a překládat se NESMÍ; česká je jen hrstka slov okolo.
// Slovníkový překlad by je zbytečně rozházel a nešel by ověřit testem.
//
// Kanonická hodnota v YAML zůstává česky (je to zdroj pro cs web); tahle
// vrstva ji přepisuje až při čtení pro daný locale.

type TokenMap = { re: RegExp; to: string }[];

/** `N-válec` → jazyková podoba. $1 = počet válců. */
const CYLINDERS: Record<string, string> = {
  sk: '$1-valec',
  pl: '$1-cylindrowy',
  uk: '$1-циліндровий',
};

const TOKENS: Record<string, TokenMap> = {
  sk: [
    { re: /vzduchem chlazený/gi, to: 'vzduchom chladený' },
    { re: /přímý vstřik/gi, to: 'priamy vstrek' },
    { re: /Dřevoplynový/g, to: 'Drevoplynový' },
    { re: /benzín \/ nafta/gi, to: 'benzín / nafta' },
  ],
  pl: [
    { re: /vzduchem chlazený/gi, to: 'chłodzony powietrzem' },
    { re: /přímý vstřik/gi, to: 'wtrysk bezpośredni' },
    { re: /Dřevoplynový/g, to: 'Gazogeneratorowy' },
    { re: /benzín \/ nafta/gi, to: 'benzyna / olej napędowy' },
  ],
  uk: [
    { re: /vzduchem chlazený/gi, to: 'повітряне охолодження' },
    { re: /přímý vstřik/gi, to: 'безпосереднє впорскування' },
    { re: /Dřevoplynový/g, to: 'Газогенераторний' },
    { re: /benzín \/ nafta/gi, to: 'бензин / дизель' },
  ],
};

/** Přepíše český popis motoru do daného jazyka. cs a neznámé locale vrací beze změny. */
export function localizeEngine(engine: string, locale: string): string {
  if (locale === 'cs' || !TOKENS[locale]) return engine;
  let out = engine.replace(/(\d+)-válec/g, CYLINDERS[locale]);
  for (const { re, to } of TOKENS[locale]) out = out.replace(re, to);
  return out;
}

// ── Titulky videí ────────────────────────────────────────────────────────────
// `youtube_title` je popiska odkazu na YouTube. Z 23 titulků je jen 5 českých
// (zbytek jsou anglické/značkové názvy, které se nepřekládají), takže mapa
// klíčovaná přesnou cs hodnotou je čitelnější než další tokenizér.
const VIDEO_TITLES: Record<string, Record<string, string>> = {
  'Case IH Axial-Flow 9250 – sklizeň': {
    sk: 'Case IH Axial-Flow 9250 – zber',
    pl: 'Case IH Axial-Flow 9250 – żniwa',
    uk: 'Case IH Axial-Flow 9250 – збирання',
  },
  'John Deere řada W – animace': {
    sk: 'John Deere rad W – animácia',
    pl: 'John Deere seria W – animacja',
    uk: 'John Deere серія W – анімація',
  },
  'Zetor Crystal s českým komentářem': {
    sk: 'Zetor Crystal s českým komentárom',
    pl: 'Zetor Crystal z czeskim komentarzem',
    uk: 'Zetor Crystal з чеським коментарем',
  },
  'Zetor 7745 v práci': {
    sk: 'Zetor 7745 v práci',
    pl: 'Zetor 7745 w pracy',
    uk: 'Zetor 7745 у роботі',
  },
  'Zetor 7711 s balíky': {
    sk: 'Zetor 7711 s balíkmi',
    pl: 'Zetor 7711 z belami',
    uk: 'Zetor 7711 з тюками',
  },
  'Zetor 12145 – odvoz tritikále': {
    sk: 'Zetor 12145 – odvoz tritikale',
    pl: 'Zetor 12145 – transport pszenżyta',
    uk: 'Zetor 12145 – вивезення тритикале',
  },
  'Sklizeň řepky s John Deere S': {
    sk: 'Zber repky s John Deere S',
    pl: 'Żniwa rzepaku z John Deere S',
    uk: 'Збирання ріпаку з John Deere S',
  },
  'New Holland CR11 při žních 2025': {
    sk: 'New Holland CR11 pri žatve 2025',
    pl: 'New Holland CR11 podczas żniw 2025',
    uk: 'New Holland CR11 на жнивах 2025',
  },
  'Claas Jaguar – 50 let': {
    sk: 'Claas Jaguar – 50 rokov',
    pl: 'Claas Jaguar – 50 lat',
    uk: 'Claas Jaguar – 50 років',
  },
};

/** Přeloží titulek videa. Neznámý titulek se vrací beze změny (raději cs než výmysl). */
export function localizeVideoTitle(title: string, locale: string): string {
  if (locale === 'cs') return title;
  return VIDEO_TITLES[title]?.[locale] ?? title;
}
