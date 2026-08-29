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
  de: '$1-Zylinder',
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
  de: [
    { re: /vzduchem chlazený/gi, to: 'luftgekühlt' },
    { re: /přímý vstřik/gi, to: 'Direkteinspritzung' },
    { re: /Dřevoplynový/g, to: 'Holzgas' },
    { re: /benzín \/ nafta/gi, to: 'Benzin / Diesel' },
  ],
};

/** Přepíše český popis motoru do daného jazyka. cs a neznámé locale vrací beze změny. */
export function localizeEngine(engine: string, locale: string): string {
  if (locale === 'cs' || !TOKENS[locale]) return engine;
  let out = engine.replace(/(\d+)-válec/g, CYLINDERS[locale]);
  for (const { re, to } of TOKENS[locale]) out = out.replace(re, to);
  return out;
}

// ── Popisné názvy sérií a modelů ─────────────────────────────────────────────
// Naprostá většina `name` v katalogu jsou typová označení (ZA-V 1400, 8R 410),
// která se NEPŘEKLÁDAJÍ. Hrstka jich ale česky POPISUJE, co to je („Předradličky",
// „Orební tělesa") — a ty pak česky svítily i na /sk /pl /uk /de stránkách
// (např. /de/stroje/pluhy/ vypisovalo „Lemken Předradličky"). Distinktních
// hodnot je 10, proto mapa klíčovaná přesnou cs hodnotou, ne tokenizér.
const NAMES: Record<string, Record<string, string>> = {
  // modely
  'Dieselross G25 (dřevoplynový)': {
    sk: 'Dieselross G25 (drevoplynový)', pl: 'Dieselross G25 (gazogeneratorowy)',
    uk: 'Dieselross G25 (газогенераторний)', de: 'Dieselross G25 (Holzgas)',
  },
  'Krájecí kotouče': {
    sk: 'Krájacie kotúče', pl: 'Kroje tarczowe', uk: 'Дискові ножі', de: 'Scheibensech',
  },
  'Orební tělesa': {
    sk: 'Orebné telesá', pl: 'Korpusy płużne', uk: 'Плужні корпуси', de: 'Pflugkörper',
  },
  'Předradličky': {
    sk: 'Predradličky', pl: 'Przedpłużki', uk: 'Передплужники', de: 'Vorschäler',
  },
  'VarioPack přední': {
    sk: 'VarioPack predný', pl: 'VarioPack przedni', uk: 'VarioPack передній', de: 'VarioPack Front',
  },
  'VarioPack pluhový pěch': {
    sk: 'VarioPack pluhový pech', pl: 'VarioPack wał doprawiający',
    uk: 'VarioPack плужний коток', de: 'VarioPack Pflugpacker',
  },
  // série
  '9RX 4-track (2015–2021, samostatná řada)': {
    sk: '9RX 4-track (2015–2021, samostatný rad)', pl: '9RX 4-track (2015–2021, osobna seria)',
    uk: '9RX 4-track (2015–2021, окрема серія)', de: '9RX 4-track (2015–2021, eigene Baureihe)',
  },
  'Příslušenství pluhů': {
    sk: 'Príslušenstvo pluhov', pl: 'Osprzęt do pługów', uk: 'Приладдя до плугів', de: 'Pflugzubehör',
  },
  'UR I — Unifikovaná řada I (1962–1998)': {
    sk: 'UR I — Unifikovaný rad I (1962–1998)', pl: 'UR I — Ujednolicona seria I (1962–1998)',
    uk: 'UR I — Уніфікована серія I (1962–1998)', de: 'UR I — Einheitsbaureihe I (1962–1998)',
  },
  'UR II — Unifikovaná řada II (1968–2002)': {
    sk: 'UR II — Unifikovaný rad II (1968–2002)', pl: 'UR II — Ujednolicona seria II (1968–2002)',
    uk: 'UR II — Уніфікована серія II (1968–2002)', de: 'UR II — Einheitsbaureihe II (1968–2002)',
  },
  'Kola pro nesený pluh': {
    sk: 'Kolesá pre nesený pluh', pl: 'Koła do pługa zawieszanego',
    uk: 'Колеса для навісного плуга', de: 'Räder für Anbaupflug',
  },
  'Podrývák k pluhu': {
    sk: 'Podrývač k pluhu', pl: 'Głębosz do pługa',
    uk: 'Глибокорозпушувач до плуга', de: 'Untergrundlockerer für den Pflug',
  },
  'SlurryKit pro Heliodor 9': {
    sk: 'SlurryKit pre Heliodor 9', pl: 'SlurryKit do Heliodor 9',
    uk: 'SlurryKit для Heliodor 9', de: 'SlurryKit für Heliodor 9',
  },
  'Stopové válce': {
    sk: 'Stopové valce', pl: 'Wały śladowe', uk: 'Слідові котки', de: 'Spurpacker',
  },
  'Steiger (kloubové, 1990–dosud)': {
    sk: 'Steiger (kĺbové, 1990–dosiaľ)', pl: 'Steiger (przegubowe, 1990–obecnie)',
    uk: 'Steiger (шарнірні, 1990–дотепер)', de: 'Steiger (Knicklenker, 1990–heute)',
  },
  'MK / M5N Series (úzké, 2014–dosud)': {
    sk: 'MK / M5N Series (úzke, 2014–dosiaľ)', pl: 'MK / M5N Series (wąskie, 2014–obecnie)',
    uk: 'MK / M5N Series (вузькі, 2014–дотепер)', de: 'MK / M5N Series (Schmalspur, 2014–heute)',
  },
  'Profile (rozmetadla statková)': {
    sk: 'Profile (rozmetadlá maštaľných hnojív)', pl: 'Profile (rozrzutniki obornika)',
    uk: 'Profile (розкидачі органічних добрив)', de: 'Profile (Stalldungstreuer)',
  },
  'Profile (krmné vozy)': {
    sk: 'Profile (kŕmne vozy)', pl: 'Profile (wozy paszowe)',
    uk: 'Profile (кормороздавачі)', de: 'Profile (Futtermischwagen)',
  },
  'Solitair (secí kombinace)': {
    sk: 'Solitair (sejacie kombinácie)', pl: 'Solitair (agregaty siewne)',
    uk: 'Solitair (посівні комбінації)', de: 'Solitair (Sämaschinenkombinationen)',
  },
  'Válce': {
    sk: 'Valce', pl: 'Wały', uk: 'Котки', de: 'Walzen',
  },
};

/** Přeloží popisný název série/modelu. Typová označení projdou beze změny. */
export function localizeName(name: string, locale: string): string {
  if (locale === 'cs') return name;
  return NAMES[name]?.[locale] ?? name;
}

// ── Výčtové hodnoty ve `specs` ───────────────────────────────────────────────
// Pět hodnot typu závěsu je v datech uložených jako slug bez diakritiky
// („neseny", „tazene"), takže je NENAJDE žádný písmenkový detektor češtiny —
// a v tabulce Technické údaje svítily i pod /de a /pl. cs se nemění.
const SPEC_VALUES: Record<string, Record<string, string>> = {
  neseny: { sk: 'nesený', pl: 'zawieszany', uk: 'навісний', de: 'Anbau' },
  nesene: { sk: 'nesené', pl: 'zawieszane', uk: 'навісні', de: 'Anbau' },
  tazeny: { sk: 'ťahaný', pl: 'ciągniony', uk: 'причіпний', de: 'gezogen' },
  tazene: { sk: 'ťahané', pl: 'ciągnione', uk: 'причіпні', de: 'gezogen' },
  samojizdny: { sk: 'samochodný', pl: 'samojezdny', uk: 'самохідний', de: 'selbstfahrend' },
};

/** Přeloží výčtovou hodnotu ve `specs`. Neznámou vrací beze změny. */
export function localizeSpecValue(value: string, locale: string): string {
  if (locale === 'cs') return value;
  return SPEC_VALUES[value]?.[locale] ?? value;
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
    de: 'Case IH Axial-Flow 9250 – Ernte',
  },
  'John Deere řada W – animace': {
    sk: 'John Deere rad W – animácia',
    pl: 'John Deere seria W – animacja',
    uk: 'John Deere серія W – анімація',
    de: 'John Deere Baureihe W – Animation',
  },
  'Zetor Crystal s českým komentářem': {
    sk: 'Zetor Crystal s českým komentárom',
    pl: 'Zetor Crystal z czeskim komentarzem',
    uk: 'Zetor Crystal з чеським коментарем',
    de: 'Zetor Crystal mit tschechischem Kommentar',
  },
  'Zetor 7745 v práci': {
    sk: 'Zetor 7745 v práci',
    pl: 'Zetor 7745 w pracy',
    uk: 'Zetor 7745 у роботі',
    de: 'Zetor 7745 im Einsatz',
  },
  'Zetor 7711 s balíky': {
    sk: 'Zetor 7711 s balíkmi',
    pl: 'Zetor 7711 z belami',
    uk: 'Zetor 7711 з тюками',
    de: 'Zetor 7711 mit Ballen',
  },
  'Zetor 12145 – odvoz tritikále': {
    sk: 'Zetor 12145 – odvoz tritikale',
    pl: 'Zetor 12145 – transport pszenżyta',
    uk: 'Zetor 12145 – вивезення тритикале',
    de: 'Zetor 12145 – Triticale-Abfuhr',
  },
  'Sklizeň řepky s John Deere S': {
    sk: 'Zber repky s John Deere S',
    pl: 'Żniwa rzepaku z John Deere S',
    uk: 'Збирання ріпаку з John Deere S',
    de: 'Rapsernte mit John Deere S',
  },
  'New Holland CR11 při žních 2025': {
    sk: 'New Holland CR11 pri žatve 2025',
    pl: 'New Holland CR11 podczas żniw 2025',
    uk: 'New Holland CR11 на жнивах 2025',
    de: 'New Holland CR11 bei der Ernte 2025',
  },
  'Claas Jaguar – 50 let': {
    sk: 'Claas Jaguar – 50 rokov',
    pl: 'Claas Jaguar – 50 lat',
    uk: 'Claas Jaguar – 50 років',
    de: 'Claas Jaguar – 50 Jahre',
  },
};

/** Přeloží titulek videa. Neznámý titulek se vrací beze změny (raději cs než výmysl). */
export function localizeVideoTitle(title: string, locale: string): string {
  if (locale === 'cs') return title;
  return VIDEO_TITLES[title]?.[locale] ?? title;
}
