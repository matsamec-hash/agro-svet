// Deterministická extrakce znaků odrůdy z oficiálního popisu ÚKZÚZ.
//
// PROČ: `typ` a `ranost` jsou v datech ÚKZÚZ 100 % prázdné (3476/3476 null) a
// kurátorovaná YAML `enrichment` vrstva je zatím prázdná taky — takže všech
// 2710 indexovatelných odrůdových stránek zobrazovalo jen jeden odstavec prózy
// a dvouřádkovou tabulku. Popis ÚKZÚZ přitom má velmi konzistentní strukturu:
//
//   1. věta  „{Název} je [užití] {ranost} odrůda/hybrid …"
//   2. věta  „Rostliny {výška}, {odolnost proti poléhání}. Zrno {velikost}."
//   3. věta  „{úroveň} odolná proti napadení {choroba}, {úroveň} odolná proti …"
//   4.+      „Výnos {čeho} {úroveň}. Obsah {čeho} {úroveň}."
//
// Tenhle modul tu prózu POUZE strukturuje — nic nedopočítává ani nedomýšlí.
// Každý vrácený znak je doslovně přítomen ve zdrojovém textu. Když se vzor
// netrefí, pole prostě chybí (žádný odhad, žádný fallback na „střední").

export interface OdrudaZnaky {
  /** Ranost („středně raná", „polopozdní" …). */
  ranost?: string;
  /** Užití / směr („pekařská", „sladovnická", „pro výrobu škrobu" …). */
  uziti?: string;
  /** Výška rostlin („středně vysoké", „vysoké" …). */
  vyska?: string;
  /** Odolnost proti poléhání. */
  polehani?: string;
  /** Odolnosti proti chorobám/škůdcům — dvojice choroba → úroveň. */
  odolnosti: { choroba: string; uroven: string }[];
  /** Odolnosti proti ABIOTICKÝM / fyziologickým jevům (vymrzání, vybíhání do
   *  květu…). ÚKZÚZ je uvádí stejnou větnou konstrukcí jako choroby, ale do
   *  tabulky „chorob a škůdců" nepatří — patří mezi vlastnosti. */
  abioticke: { znak: string; uroven: string }[];
  /** Výnosové a kvalitativní znaky — „výnos zrna" → „vysoký". */
  vynos: { znak: string; uroven: string }[];
}

const RANOSTI = [
  'velmi raná', 'velmi raný', 'velmi časná',
  'středně raná', 'středně raný',
  'středně pozdní', 'středně pozdní',
  'polopozdní', 'poloraná', 'poloraný',
  'pozdní', 'raná', 'raný',
];

/** Odolnostní úrovně — také od nejdelší varianty. */
const ODOLNOSTI_UROVNE = [
  'středně odolná až odolná', 'středně odolný až odolný',
  'středně až méně odolná', 'středně až méně odolný',
  'méně odolná až středně odolná',
  'velmi odolná', 'velmi odolný',
  'středně odolná', 'středně odolný',
  'méně odolná', 'méně odolný',
  'slabě náchylná', 'slabě náchylný',
  'silně náchylná', 'silně náchylný',
  'rezistentní', 'náchylná', 'náchylný',
  'odolná', 'odolný',
];

function normalize(popis: string): string {
  return popis.replace(/\r\n|\r/g, '\n').replace(/[ \t]+/g, ' ').trim();
}

/** Najde první výskyt některé fráze ze slovníku (case-insensitive, nejdelší vyhrává). */
function findPhrase(haystack: string, phrases: string[]): string | undefined {
  const low = haystack.toLowerCase();
  let best: { idx: number; val: string } | undefined;
  for (const p of phrases) {
    const i = low.indexOf(p);
    if (i === -1) continue;
    // nejdřívější výskyt; při shodě pozice delší fráze
    if (!best || i < best.idx || (i === best.idx && p.length > best.val.length)) {
      best = { idx: i, val: p };
    }
  }
  return best?.val;
}

/**
 * Najde frázi, jejíž KONEC je nejblíž konci textu (při shodě delší vyhrává).
 * U odolností je určující kvalifikátor ten těsně před „proti" — v „…slabě
 * náchylná k napadení X a rezistentní proti napadení Y" patří k Y „rezistentní",
 * ne „slabě náchylná". Zároveň to u „Středně odolná až odolná" vybere celou
 * frázi (končí stejně jako holé „odolná", ale je delší).
 */
function findPhraseNearestEnd(haystack: string, phrases: string[]): string | undefined {
  const low = haystack.toLowerCase();
  let best: { end: number; val: string } | undefined;
  for (const p of phrases) {
    const i = low.lastIndexOf(p);
    if (i === -1) continue;
    const end = i + p.length;
    if (!best || end > best.end || (end === best.end && p.length > best.val.length)) {
      best = { end, val: p };
    }
  }
  return best?.val;
}

/** „Rostliny středně vysoké, středně odolné proti poléhání." → výška + poléhání. */
function parseMorfologie(text: string): { vyska?: string; polehani?: string } {
  const out: { vyska?: string; polehani?: string } = {};
  const mVyska = text.match(/Rostliny\s+((?:velmi\s+|středně\s+|polo)?[a-záčďéěíňóřšťúůýž]+(?:\s+až\s+(?:velmi\s+|středně\s+)?[a-záčďéěíňóřšťúůýž]+)?)/i);
  if (mVyska) {
    const cand = mVyska[1].trim().toLowerCase();
    if (/vysok|nízk|trpasl/.test(cand)) out.vyska = cand;
  }
  const mPol = text.match(/((?:velmi\s+|středně\s+|méně\s+|slabě\s+)*(?:odoln|náchyln)[a-záčďéěíňóřšťúůýž]*(?:\s+až\s+(?:velmi\s+|středně\s+|méně\s+)?(?:odoln|náchyln)[a-záčďéěíňóřšťúůýž]*)?)\s+proti\s+poléhání/i);
  if (mPol) out.polehani = mPol[1].trim().toLowerCase();
  return out;
}

/** Rozparsuje výčet odolností na dvojice choroba → úroveň (viz komentář uvnitř). */
/** Jevy, které nejsou choroba ani škůdce (řadí se mezi vlastnosti). */
const ABIOTICKE = /^(vymrz|vyzimován|vybíhání do květu|poléhání|lámání|mechanickému|přemrznutí|přezimován)/;

function parseOdolnosti(text: string): { biotic: { choroba: string; uroven: string }[]; abiotic: { znak: string; uroven: string }[] } {
  const out: { choroba: string; uroven: string }[] = [];
  const abiotic: { znak: string; uroven: string }[] = [];
  const seen = new Set<string>();
  // ÚKZÚZ řetězí odolnosti nekonzistentně — čárkou, spojkou „a", nebo vůbec
  // ničím („…plísní šedou méně až středně odolná proti napadení fomovým…").
  // Proto se nedělí na oddělovače, ale prochází se VŠECHNY značky „proti /
  // k [napadení]": úroveň = fráze nejblíž PŘED značkou, choroba = text po
  // značce až k další značce (s useknutím úrovně, která patří už další položce).
  for (const veta of text.split(/[.;]\s+|\n/)) {
    const markers = [...veta.matchAll(/\s+(?:proti|k)\s+(?:napadení\s+)?/gi)];
    for (let i = 0; i < markers.length; i++) {
      const m = markers[i];
      const prev = markers[i - 1];
      const zoneStart = i === 0 ? 0 : prev.index! + prev[0].length;
      const uroven = findPhraseNearestEnd(veta.slice(zoneStart, m.index!), ODOLNOSTI_UROVNE);
      if (!uroven) continue;

      const konec = i + 1 < markers.length ? markers[i + 1].index! : veta.length;
      let choroba = veta.slice(m.index! + m[0].length, konec).trim().toLowerCase();

      // Konec úseku patří už následující položce („…rzí plevovou a středně až
      // méně odolná" → choroba je jen „rzí plevovou").
      const nasl = findPhraseNearestEnd(choroba, ODOLNOSTI_UROVNE);
      if (nasl && choroba.endsWith(nasl)) {
        choroba = choroba.slice(0, choroba.length - nasl.length).replace(/\s+(?:a|,)\s*$/, '');
      }
      choroba = choroba.replace(/[.,\s]+$/, '').replace(/\s*\([^)]*\)\s*$/, '').trim();

      if (!choroba || choroba.length > 80 || seen.has(choroba)) continue;
      seen.add(choroba);
      // Poléhání řeší parseMorfologie (má vlastní řádek), ostatní abiotické
      // jevy jdou mezi vlastnosti — ne do tabulky chorob a škůdců.
      if (ABIOTICKE.test(choroba)) {
        if (!/^(poléhání|lámání|mechanickému)/.test(choroba)) abiotic.push({ znak: choroba, uroven });
        continue;
      }
      out.push({ choroba, uroven });
    }
  }
  return { biotic: out, abiotic };
}

/** „Výnos zrna vysoký", „Obsah škrobu středně vysoký" → strukturované dvojice. */
function parseVynos(text: string): { znak: string; uroven: string }[] {
  const out: { znak: string; uroven: string }[] = [];
  const seen = new Set<string>();
  const re = /\b((?:Výnos|Obsah|Hmotnost|Podíl|Stravitelnost|Objemová hmotnost|Číslo poklesu)\b[^,.;]*?)\s+((?:velmi\s+|středně\s+)?(?:vysok|nízk)[áýéo][a-záčďéěíňóřšťúůýž]*(?:\s+až\s+(?:velmi\s+|středně\s+)?(?:vysok|nízk)[áýéo][a-záčďéěíňóřšťúůýž]*)?)(?=[,.;]|$)/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    const znak = m[1].trim().toLowerCase().replace(/\s*-\s*$/, '');
    const uroven = m[2].trim().toLowerCase();
    if (znak.length > 90) continue;
    if (seen.has(znak)) continue;
    seen.add(znak);
    out.push({ znak, uroven });
  }
  return out;
}

/**
 * Hlavní vstupní bod. Vrací jen ty znaky, které jsou v textu doslovně obsažené.
 * Pro popis, který se vzorům nepodobá, vrátí prázdné pole/undefined — stránka
 * pak sekci prostě nevykreslí (žádné vymyšlené „střední" hodnoty).
 */
export function parseZnaky(popis: string | undefined | null): OdrudaZnaky {
  const empty: OdrudaZnaky = { odolnosti: [], abioticke: [], vynos: [] };
  if (!popis) return empty;
  const text = normalize(popis);
  const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
  const prvni = lines[0] ?? '';

  const ranost = findPhrase(prvni, RANOSTI) ?? findPhrase(text, RANOSTI);

  // Užití: přívlastek v 1. větě před raností („pekařská poloraná odrůda"),
  // nebo účelová fráze („pro výrobu škrobu", „pro pěstování na siláž").
  let uziti: string | undefined;
  const mUziti = prvni.match(/\bje\s+((?:[a-záčďéěíňóřšťúůýž]+\s+)*?)(?:velmi\s+|středně\s+|polo)?[a-záčďéěíňóřšťúůýž]*\s*(?:odrůda|hybrid)/i);
  if (mUziti && mUziti[1]) {
    const cand = mUziti[1].trim().toLowerCase();
    const bezRanosti = RANOSTI.reduce((s, r) => s.replace(r, ''), cand).replace(/\s+/g, ' ').trim();
    if (bezRanosti && bezRanosti.length <= 40) uziti = bezRanosti;
  }
  const mUcel = text.match(/\b(pro\s+(?:výrobu|pěstování|přímý)\s+[^,.;]{2,40})/i);
  if (!uziti && mUcel) uziti = mUcel[1].trim().toLowerCase();

  const morf = parseMorfologie(text);
  // Řádek s odolnostmi bývá 3. věta, ale kvůli variabilitě se parsuje celý text
  // (fráze „proti poléhání/vyzimování" se odfiltrují uvnitř parseOdolnosti).
  const { biotic, abiotic } = parseOdolnosti(text);
  const vynos = parseVynos(text);

  return {
    ...(ranost ? { ranost } : {}),
    ...(uziti ? { uziti } : {}),
    ...(morf.vyska ? { vyska: morf.vyska } : {}),
    ...(morf.polehani ? { polehani: morf.polehani } : {}),
    odolnosti: biotic,
    abioticke: abiotic,
    vynos,
  };
}

/** Má odrůda dost vytěženého, aby se vyplatilo vykreslit sekci „Vlastnosti"? */
export function maZnaky(z: OdrudaZnaky): boolean {
  return Boolean(z.ranost || z.uziti || z.vyska || z.polehani);
}

/** Věta 1 popisu — použitelná jako stručný lead pod nadpis. */
export function prvniVeta(popis: string | undefined | null): string | undefined {
  if (!popis) return undefined;
  const first = normalize(popis).split('\n')[0]?.trim();
  return first || undefined;
}

/** Popis rozdělený na odstavce (ÚKZÚZ ho dodává s \r\n mezi tematickými bloky). */
export function popisOdstavce(popis: string | undefined | null): string[] {
  if (!popis) return [];
  return normalize(popis).split('\n').map((l) => l.trim()).filter(Boolean);
}
