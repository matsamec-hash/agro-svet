import { locales, defaultLocale, isLocale, type Locale } from './config';
import { localizedTag } from './novinky-tagy';
import { ui } from './ui';

const SITE_ORIGIN = 'https://agro-svet.cz';

/** Odvodí locale z prefixu cesty. cs (default) nemá prefix. */
export function getLocaleFromUrl(url: URL): Locale {
  const seg = url.pathname.split('/')[1] ?? '';
  return isLocale(seg) && seg !== defaultLocale ? seg : defaultLocale;
}

/** Rozdělí pathname na locale + cs-root path (bez prefixu). */
export function stripLocale(pathname: string): { locale: Locale; path: string } {
  const seg = pathname.split('/')[1] ?? '';
  if (isLocale(seg) && seg !== defaultLocale) {
    const rest = pathname.slice(seg.length + 1) || '/';
    return { locale: seg, path: rest };
  }
  return { locale: defaultLocale, path: pathname };
}

/** Z cs-root path udělá lokalizovanou cestu. cs = beze změny. */
export function localizePath(locale: Locale, path: string): string {
  const clean = path.startsWith('/') ? path : `/${path}`;
  if (locale === defaultLocale) return clean;
  return `/${locale}${clean}`;
}

/** Per-locale launchnuté (přeložené → indexovatelné) prefixy. cs je default bez
 *  prefixu, gating se na něj neaplikuje. Zbytek dané /<locale> sekce zůstává
 *  noindex (servíruje cs tělo) dokud není lokalizován. */
export const LAUNCHED_PREFIXES: Record<Locale, string[]> = {
  cs: [],
  // '/' = SK homepage (HomeSk.astro — vlastní slovenský feed přes
  // article_translations + rozcestník). Byla hotová, ale negatovaná → noindex
  // a mimo sitemapu, takže 7k+ indexovaných /sk URL nemělo vstupní bod.
  // Všechny odkazy z HomeSk míří do launchnutých /sk sekcí (viz sk-launch.test.ts).
  sk: ['/', '/data', '/svet', '/slovnik', '/stroje', '/znacky', '/srovnani', '/novinky', '/kalkulacka', '/dotace', '/statistiky', '/puda', '/encyklopedie', '/plemena', '/vcelarstvi', '/jak-na-to', '/pruvodce', '/podminky-pouziti', '/zpracovani-osobnich-udaju', '/dsa-kontakt', '/redakce', '/hledat', '/zebricky', '/plodiny', '/choroby', '/sezona', '/akcie', '/kviz'],
  // '/' = UK homepage (HomeUk.astro — vlastní ukrajinský rozcestník na
  // statistiku, trh s půdou, dotace a slovník). Stejný případ jako sk: byla
  // hotová, ale negatovaná → noindex a mimo sitemapu, takže 6 956 /uk URL
  // nemělo vstupní bod.
  uk: ['/', '/stroje', '/srovnani', '/znacky', '/encyklopedie', '/jak-na-to', '/slovnik', '/puda', '/statistiky', '/dotace', '/hledat', '/zebricky', '/plodiny', '/choroby', '/akcie', '/kviz',
    '/podminky-pouziti', '/zpracovani-osobnich-udaju', '/dsa-kontakt', '/redakce',
    '/plemena', '/vcelarstvi'],
  // PL fáze 2: katalog (data-driven) + slovník + /puda + datová sekce
  // (/data hub + /statistiky). Data jsou česká (ČSÚ), servírovaná v PL jazyce
  // přes stat.*/data.hub./komodita. klíče. /dotace + /jak-na-to zůstávají cs
  // (PL má vlastní dotační systém / jiný how-to obsah) → pozdější fáze.
  // /encyklopedie LAUNCHNUTÉ: `encyklopediePl` overlay kolekce (42 md, plná parita
  // s cs/sk/uk) + pl klíče v ENC_COLLECTION/bcp47 ([slug].astro) + hub pl větev.
  // Kalkulačky: jen 2 UNIVERZÁLNÍ převodníky (plocha/hmotnost) — bez jurisdikce.
  // Finanční (leasing = čeští poskytovatelé, náklady/nafta = české ceny, CAP =
  // české sazby) + /kalkulacka hub zůstávají cs → potřebují PL data, ne překlad.
  // /vcelarstvi LAUNCHNUTÉ: `pl/` YAML overlay (6 včel + 10 vybavení + 7 medů), enum
  // hodnoty zůstávají kanonicky česky (CSS třídy + JSON-LD), překládá je *Label().
  // /doplaty-bezposrednie = PL-only landing (dopłaty bezpośrednie ARiMR), jurisdykčně
  // vázané, obsah přímo polsky (žádný cs ekvivalent → non-pl locale 404). Launchnuté
  // → index+self-canonical (noHreflang v Layoutu, žádné cross-locale alternates).
  // '/' = homepage indexable (má reálný PL feed přes article_translations).
  // '/novinky' = PL zpravodajský výpis (jen reálně přeložené články, žádný cs leak).
  // '/choroby' = atlas chorob polních plodin. Čistá agronomie, žádná jurisdikce
  // (patogeny nerespektují hranice) → pl overlay 11 entit, plná parita s cs.
  // '/sezona' = sezónní práce + kalendář setí a sklizně. ‼️ Měsíce se NEMĚNÍ —
  // na měsíční granularitě vycházejí pro ČR i PL stejně (Praha 50° / Varšava 52°),
  // ale stránka to pod ne-cs říká nahlas (sez.note), ať to nevypadá jako polsky
  // měřená data. Blok českých akcí se pod ne-cs skrývá celý.
  // Právní + redakční stránky: polské verze byly v kódu HOTOVÉ (isPl větve
  // v podminky-pouziti / zpracovani-osobnich-udaju / dsa-kontakt), jen nikdy
  // nelaunchnuté — takže /pl neměl polsky ani zásady zpracování údajů, ani
  // kontaktní bod podle DSA, ačkoliv sk je má. /redakce polskou větev nemělo
  // vůbec, doplněna (zdroje dat GUS/ARiMR, ne ČSÚ/MZe).
  // Provozovatel a sídlo zůstávají české — to je fakt, ne lokalizovatelný údaj.
  // '/kviz' = hub + kvíz historie značek. PL sada NENÍ překlad: 3 ze 16 otázek
  // byly vázané na české dotace (VCS chmel v Kč, BISS, LPIS/SZIF) a jsou
  // nahrazené polskými se skutečnými sazbami ARiMR. Zbylé dva kvízy
  // (jaký traktor / jaká včela) zůstávají cs — hub je pod pl nenabízí.
  // '/zebricky' = žebříčky odvozené z katalogu strojů (výkon, kategorie) —
  // žádná jurisdikce, jen strojní data. Na rozdíl od /pruvodce (Kč, SZIF) a
  // /prehled (české registrace), které pro pl NEjdou přeložit, jen nahradit.
  // '/plodiny' = jen ÚROVEŇ PLODINY (hub, pillar, faceta skupiny) — agronomie
  // (norma wysiewu, nawożenie, zmianowanie) je univerzální. DETAIL ODRŮDY
  // zůstává cs-only: je to úřední popis ÚKZÚZ k odrůdě registrované v ČR,
  // Polsko má vlastní registr (COBORU). Pillar proto pod ne-cs odrůdy nelinkuje
  // a sitemapa detaily do pl mirroru nepouští (isOdrudaDetailPath).
  pl: ['/', '/novinky', '/svet', '/stroje', '/znacky', '/srovnani', '/slovnik', '/puda', '/statistiky', '/data', '/kalkulacka/prevody-jednotek', '/kalkulacka/prevody-hmotnost', '/doplaty-bezposrednie', '/ekoschematy', '/encyklopedie', '/plemena', '/poradniki', '/vcelarstvi', '/choroby', '/plodiny', '/zebricky', '/kviz', '/podminky-pouziti', '/zpracovani-osobnich-udaju', '/dsa-kontakt', '/redakce', '/sezona', '/hledat', '/akcie'],

  // DE fáze 1 (trh: Německo + Rakousko). Launchnuté jen NEjurisdikční sekce —
  // katalog techniky je pan-evropský (tytéž značky, tytéž modely, tytéž
  // technické údaje), takže se překládá 1:1. NElaunchnuto záměrně:
  //   /statistiky, /data, /puda  → česká data (ČSÚ, FARMY.CZ index)
  //   /dotace, /kalkulacka/*     → české sazby a čeští poskytovatelé
  //   /novinky, /akce, /farmy    → český obsah vázaný na ČR
  //   /jak-na-to, /pruvodce      → návody psané pro české podmínky
  // Pro DE/AT vzniká vlastní obsah (Direktzahlungen/GAP DE, ÖPUL AT, Destatis /
  // Statistik Austria) — ne překlad českého. /slovnik, /encyklopedie a /plemena
  // čekají na de overlay dat (slovnik.de.ts, encyklopedieDe, plemena-de).
  // /znacky taky ne: profily značek jsou české .md (kolekce `znacky`) a overlay
  // `znackyDe` zatím neexistuje → launch by indexoval německou hlavičku nad
  // českým tělem. Přidat spolu s overlayem.
  // Fáze 2: +/znacky — profily 22 značek mají německý overlay (znacky-de),
  // stejně jako srovnávací podsekce /znacky/srovnani (znackySrovnani.de).
  // '/' = kurátovaný německý rozcestník (HomeDe), ne český feed → indexovatelné.
  // '/direktzahlungen' + '/oeko-regelungen' = DE-only landingy s německými
  // sazbami GAP (obdoba pl /doplaty-bezposrednie a /ekoschematy). Jurisdikčně
  // vázané, žádný cs ekvivalent → non-de locale na nich dostane 404.
  // Fáze 3a: +/zebricky (žebříčky nad katalogem strojů — žádná jurisdikce;
  // ‼️ vyžaduje de blok v tier-lists.i18n.ts, jinak by se pod německým
  // chrome vypsaly ČESKÉ názvy žebříčků — přesně past HomeDe/HomeUk)
  // + právní a redakční stránky. Ty de větev NEMĚLY vůbec, takže /de
  // neměl německy ani zásady zpracování údajů, ani kontaktní bod podle DSA.
  // Provozovatel a sídlo zůstávají české — to je fakt, ne lokalizovatelný údaj;
  // dozorový úřad je proto ÚOOÚ, stránka ale odkazuje i na německé zemské
  // úřady a rakouskou DSB (čl. 77 odst. 1 GDPR).
  // /hledat ZÁMĚRNĚ nelaunchnuté: je noindex a tahá české články z Supabase
  // + má natvrdo české labely („Všechny články") → launch by pod /de/
  // servíroval český obsah. Doplnit spolu s gatingem novinek a bazaru.
  de: ['/', '/stroje', '/srovnani', '/znacky', '/encyklopedie', '/direktzahlungen', '/oeko-regelungen',
    '/zebricky', '/podminky-pouziti', '/zpracovani-osobnich-udaju', '/dsa-kontakt', '/redakce'],
};

/** True, pokud cs-root cesta patří do launchnuté sekce daného locale. */
export function isLaunchedPath(locale: Locale, csRootPath: string): boolean {
  return (LAUNCHED_PREFIXES[locale] ?? []).some((p) => csRootPath === p || csRootPath.startsWith(`${p}/`));
}

/** Zpětně kompatibilní SK alias (volá ho Layout/sitemap; ponecháno kvůli minimal-diff). */
export const SK_LAUNCHED_PREFIXES = LAUNCHED_PREFIXES.sk;
export function isSkLaunchedPath(csRootPath: string): boolean {
  return isLaunchedPath('sk', csRootPath);
}

/** Cesty uvnitř launchnutých sekcí, které ALE pod locale prefixem NEfungují:
 *  jsou `prerender = true`, takže je middleware rewrite nepokryje a /sk|/uk|/pl
 *  varianta 302-uje zpátky na cs.
 *
 *  Musí se držet na cs ve VŠECH třech místech, jinak vzniká tichý rozpad:
 *  odkaz (localizeInternalHref), přepínač jazyka (langSwitchHref) a sitemapa.
 *  `/data/prodeje-techniky` sem patří od 2026-08-21 — `/data` je launchnuté pro
 *  sk i pl, takže hub /pl/data/ na tu stránku linkoval přes /pl/ (302) a sk
 *  varianta se dokonce dostala do sitemapy. pl to obcházelo hackem přímo
 *  v sitemap.xml.ts; sk a uk ne. */
export const PRERENDERED_ONLY_PATHS: string[] = ['/data/prodeje-techniky'];

/** Kvízy, které NEJSOU lokalizované — cílí na české podmínky (servisní síť
 *  značek, český chov včel), takže by pod locale prefixem nešlo o překlad, ale
 *  o jiná data. Zůstávají prerendered cs-only; hub /kviz/ lokalizovaný je
 *  a vypisuje jen kvízy dostupné v dané locale (viz kviz/index.astro). */
const CS_ONLY_QUIZZES = ['jaky-traktor-potrebujete', 'jaka-vcela-pro-vas', 'poznas-znacku'];

/** Detail odrůdy: /plodiny/<plodina>/<odruda>/ — tři segmenty, kde druhý není
 *  faceta `skupina`. Je to úřední popis ÚKZÚZ k odrůdě registrované v ČR, takže
 *  zůstává cs-only i tam, kde je /plodiny launchnuté. */
function isOdrudaDetailPath(csRootPath: string): boolean {
  const seg = csRootPath.split('/').filter(Boolean);
  return seg.length === 3 && seg[0] === 'plodiny' && seg[1] !== 'skupina';
}

/** True, pokud je cesta (nebo její podstrom) prerendered cs-only.
 *  Takové cesty se nelokalizují (pod prefixem 302 na cs) a nesmí se dostat ani
 *  do locale mirroru sitemapy — jinak sitemapa nabere tisíce redirectů. */
export function isPrerenderedOnlyPath(csRootPath: string): boolean {
  if (PRERENDERED_ONLY_PATHS.some((p) => csRootPath === p || csRootPath.startsWith(`${p}/`))) return true;
  if (isOdrudaDetailPath(csRootPath)) return true;
  const quiz = csRootPath.split('/').filter(Boolean);
  return quiz[0] === 'kviz' && quiz.length > 1 && CS_ONLY_QUIZZES.includes(quiz[1]);
}

/** Lokalizuje interní href pro daný locale POUZE u launchnutých (reálně
 *  renderovaných) sekcí; jinak vrací cs href beze změny. Pro cs no-op.
 *  Sdílené: nav/footer + huby/listingy + auto-linker. */
export function localizeInternalHref(locale: Locale, href: string): string {
  if (locale === defaultLocale) return href;
  const root = href.replace(/\/+$/, '') || '/';
  if (root === '/') return localizePath(locale, href);
  if (isLaunchedPath(locale, root) && !isPrerenderedOnlyPath(root)) return localizePath(locale, href);
  return href;
}

/** Zpětně kompatibilní alias (volá ho Layout/nav/footer). */
export const navHref = localizeInternalHref;

/** Cílová cesta přepínače jazyka. Když cílový locale danou cs-cestu nemá
 *  (skrytá novinková kategorie, nelaunchnutá sekce nebo prerendered-pod-/sk
 *  cesta), spadne na lokalizovaný hub místo 404 — uživatel reálně přepne jazyk
 *  místo přistání na chybě. cs je kanonické → vrací cestu beze změny.
 *  `hiddenNewsCats` = skryté novinkové kategorie cílového locale. */
export function langSwitchHref(target: Locale, path: string, hiddenNewsCats: string[]): string {
  if (target === defaultLocale) return localizePath(target, path);
  const catMatch = path.match(/^\/novinky\/kategorie\/([^/]+)\/?$/);
  if (catMatch && hiddenNewsCats.includes(catMatch[1])) return localizePath(target, '/novinky/');
  const root = path.replace(/\/+$/, '') || '/';
  if (root !== '/' && (!isLaunchedPath(target, root) || isPrerenderedOnlyPath(root))) {
    return localizePath(target, '/');
  }
  return localizePath(target, path);
}

/** Hreflang alternates pro daný pathname (přijímá i lokalizovaný). */
export function getAlternates(pathname: string): { hreflang: string; href: string }[] {
  const { path } = stripLocale(pathname);
  const list = locales.map((loc) => ({
    hreflang: loc as string,
    href: new URL(localizePath(loc, path), SITE_ORIGIN).toString(),
  }));
  list.push({ hreflang: 'x-default', href: new URL(localizePath(defaultLocale, path), SITE_ORIGIN).toString() });
  return list;
}

/** Překlad klíče s fallbackem locale → cs → klíč. */
export function t(locale: Locale, key: string): string {
  return ui[locale]?.[key] ?? ui[defaultLocale][key] ?? key;
}

export function useTranslations(locale: Locale) {
  return (key: string) => t(locale, key);
}

/** Lokalizovaný název kategorie novinek s fallbackem na surovou hodnotu.
 *  Reprodukuje původní `categoryLabels[category] ?? category`: pro známé
 *  kategorie vrátí překlad, pro neznámé surovou kategorii (ne klíč). */
export function localizedCategory(locale: Locale, category: string): string {
  const key = `nov.cat.${category}`;
  const val = t(locale, key);
  if (val !== key) return val;
  // Kategorie, které v DB nesou rovnou český NÁZEV (ne slug) — „Zemědělství",
  // „zemědělství" — klíč `nov.cat.*` nemají. Zkus mapu štítků, ať pod /pl a /sk
  // nezůstane česká kategorie; jinak vrať vstup beze změny.
  return localizedTag(locale, category);
}

/** Překlad s interpolací {token} → params[token]. Fallback locale→cs→klíč. */
export function tf(locale: Locale, key: string, params: Record<string, string | number>): string {
  const tmpl = ui[locale]?.[key] ?? ui[defaultLocale][key] ?? key;
  return tmpl.replace(/\{(\w+)\}/g, (_, k) => (k in params ? String(params[k]) : `{${k}}`));
}

/** Pluralizace.
 *  cs/sk: 1 / 2–4 / 5+. de: 1 / jinak plurál.
 *  uk (východoslovanská): one = n%10==1 & n%100!=11; few = n%10∈2..4 & n%100∉12..14;
 *  many = zbytek (0, 5–20, x5–x9, 11–14). Tři tvary se mapují na stejné `forms`
 *  (one = nominativ sg, few = tvar 2–4, many = genitiv pl). */
export function plural(
  locale: Locale,
  n: number,
  forms: { one: string; few: string; many: string },
): string {
  const abs = Math.abs(n);
  // de: germánská dvojtvarost — 1 = singulár, všechno ostatní (vč. 0) = plurál.
  // `few` se pro de nikdy nepoužije; v de.ts je proto few === many.
  if (locale === 'de') return abs === 1 ? forms.one : forms.many;
  if (locale === 'uk' || locale === 'pl') {
    const mod10 = abs % 10;
    const mod100 = abs % 100;
    if (mod10 === 1 && mod100 !== 11) return forms.one;
    if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return forms.few;
    return forms.many;
  }
  if (abs === 1) return forms.one;
  if (abs >= 2 && abs <= 4) return forms.few;
  return forms.many;
}

/** BCP-47 tag pro Intl a JSON-LD `inLanguage`.
 *  ‼️ Ternáře `locale === 'sk' ? 'sk-SK' : … : 'cs-CZ'` roztroušené po stránkách
 *  na pl ZAPOMÍNALY — /pl/znacky/<slug>/ pak psalo „Treść ostatnio zweryfikowana:
 *  květen 2026" (český měsíc). Používej tohle, ne vlastní ternář. */
export const BCP47: Record<Locale, string> = {
  cs: 'cs-CZ', sk: 'sk-SK', pl: 'pl-PL', uk: 'uk-UA', de: 'de-DE',
};
export function bcp47(locale: string): string {
  return BCP47[locale as Locale] ?? BCP47.cs;
}
