/**
 * Import registrovaných odrůd z ÚKZÚZ → src/data/plodiny/odrudy/<plodina>.json
 *
 * Zdroj: ido.ukzuz.cz (ExtJS 7 SPA „Databáze odrůd").
 * Fallback: roční PDF „Seznam odrůd" z ukzuz.gov.cz (ruční, není-li endpoint dostupný).
 *
 * DISCOVERY (2026-06-07, ověřeno zvenčí):
 *   Endpoint:  GET https://ido.ukzuz.cz/ido/api/varieties?page=<n>&limit=100&lang=cs
 *   Odpověď:   { page, count, limit, lang, total, values:[…], nextUrl, lastUrl, … }
 *   1 stránka = max 100 záznamů (limit>100 → {status,message,errors}); total ~11715,
 *   tj. ~118 stránek. Stránkuje se přes `nextUrl` (absolutní cesta) nebo ?page.
 *   Server-side filtr dle druhu se zvenčí NEPODAŘILO aktivovat (parametry
 *   filter/query/speciesName se ignorují → vrací celý set), proto se filtruje
 *   KLIENTSKY dle pole `speciesName` (case-insensitive substring na <ukzuz_druh>).
 *
 *   Tvar 1 záznamu (relevantní pole):
 *     currentName    string   — aktuální (registrovaný) název odrůdy
 *     proposedName   string   — navržený název (fallback, je-li currentName prázdné)
 *     speciesName    string   — druh plodiny (např. „Oves setý")
 *     regDecisionDate string  — datum registrace „YYYY-MM-DD" (→ rok_registrace)
 *     subjects[]     array     — vztahy; udržovatel = relationType===0 / relationName „Udržovatel"
 *   Záznamy bez registrace (jen žádost) mají regDecisionDate=null — vynechávají se.
 *   ÚKZÚZ nemá samostatná pole „typ"/„ranost" v této odpovědi → zůstávají null
 *   (doplní se kurátorovanou enrichment vrstvou, viz OdrudaEnrichment v src/lib/plodiny.ts).
 *
 * Spuštění:
 *   npx tsx scripts/import-odrudy.ts <plodina_slug> <ukzuz_druh>   — legacy, SUBSTRING
 *     např.: npx tsx scripts/import-odrudy.ts oves "Oves setý"
 *   npx tsx scripts/import-odrudy.ts <plodina_slug>                — PŘESNÝ match dle mapy
 *   npx tsx scripts/import-odrudy.ts --all                         — všechny plodiny z mapy
 *
 * ‼️ Substring na `speciesName` sbírá cizí druhy: needle „salát" chytne i „Okurka
 * (salátová)" a „Řepa salátová", „květák" chytne „Brokolice (květáková)". Proto má
 * `scripts/plodiny-druhy.json` u každé plodiny VÝČET PŘESNÝCH názvů druhů z ÚKZÚZ
 * a nové plodiny se importují jen tímto režimem. Legacy substring zůstal kvůli
 * 18 původním polním plodinám, u kterých je ověřeno, že nic cizího nenabírá.
 *
 * Generovaný JSON se COMMITUJE (data v repu = build bez síťové závislosti).
 */
import { writeFileSync, mkdirSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

export interface OdrudaFaktaOut {
  slug: string;
  name: string;
  plodina_slug: string;
  rok_registrace: number | null;
  udrzovatel: string | null;
  typ: string | null;
  ranost: string | null;
  /**
   * Oficiální popis odrůdy z ÚKZÚZ (pole `description`) — faktická agronomická
   * próza (typ/ranost/odolnosti/výnos). Slouží jako enrichment bez halucinací:
   * lib z něj v build() odvodí enrichment.popis → odrůda dostane indexovanou URL.
   */
  popis: string | null;
  zdroj_url: string;
}

export function slugifyOdruda(name: string): string {
  return name
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** Vytáhne udržovatele ze `subjects[]` ÚKZÚZ záznamu (relationType 0 / „Udržovatel"). */
function extractUdrzovatel(raw: Record<string, unknown>): string | null {
  const subjects = raw.subjects;
  if (Array.isArray(subjects)) {
    const u = subjects.find(
      (s) =>
        s &&
        typeof s === 'object' &&
        ((s as Record<string, unknown>).relationType === 0 ||
          (s as Record<string, unknown>).relationName === 'Udržovatel'),
    ) as Record<string, unknown> | undefined;
    const n = u?.name;
    if (n) return String(n).trim();
  }
  return null;
}

/**
 * Čistá mapovací funkce — testovatelná bez sítě.
 * Akceptuje jak skutečná pole ÚKZÚZ API (currentName / speciesName /
 * regDecisionDate / subjects[]), tak zjednodušené aliasy (nazev / rokRegistrace /
 * udrzovatel / typ / ranost) používané v testech a PDF fallbacku.
 */
export function normalizeOdruda(raw: Record<string, unknown>, plodinaSlug: string): OdrudaFaktaOut {
  // `||` (ne `??`): currentName může být prázdný řetězec → musí propadnout na proposedName.
  const name = String(
    raw.currentName || raw.nazev || raw.name || raw.proposedName || '',
  ).trim();

  // rok registrace: alias rokRegistrace/rok_registrace, jinak rok z regDecisionDate
  const rokAlias = raw.rokRegistrace ?? raw.rok_registrace;
  const rokSource = rokAlias ?? raw.regDecisionDate;
  const rok_registrace = rokSource
    ? Number(String(rokSource).replace(/\D/g, '').slice(0, 4)) || null
    : null;

  const udrzovatel = raw.udrzovatel
    ? String(raw.udrzovatel).trim()
    : extractUdrzovatel(raw);

  const popisSrc = raw.description ?? raw.popis;
  const popis = popisSrc && String(popisSrc).trim() ? String(popisSrc).trim() : null;

  return {
    slug: slugifyOdruda(name),
    name,
    plodina_slug: plodinaSlug,
    rok_registrace,
    udrzovatel,
    typ: raw.typ ? String(raw.typ).trim() : null,
    ranost: raw.ranost ? String(raw.ranost).trim() : null,
    popis,
    zdroj_url: 'https://ido.ukzuz.cz/ido/',
  };
}

/**
 * Stáhne raw záznamy z ÚKZÚZ store endpointu (viz DISCOVERY).
 * Stránkuje (limit=100) a filtruje klientsky dle `speciesName` ~ <ukzuzDruh>.
 * Bere jen REGISTROVANÉ odrůdy (regDecisionDate != null).
 */
/** Přesný match dle výčtu názvů druhů (case-insensitive, trim). */
export function exactMatcher(druhy: string[]): (speciesName: string) => boolean {
  const set = new Set(druhy.map((d) => d.trim().toLowerCase()));
  return (s) => set.has(s.trim().toLowerCase());
}

/** Legacy substring match — jen pro 18 původních polních plodin. */
export function substringMatcher(needle: string): (speciesName: string) => boolean {
  const n = needle.toLowerCase();
  return (s) => s.toLowerCase().includes(n);
}

async function fetchRaw(matches: (speciesName: string) => boolean): Promise<Record<string, unknown>[]> {

  // Lokální cache: IDO_CACHE=cesta k JSON poli všech raw záznamů (jedno stažení
  // → generace všech plodin bez opakovaného volání ÚKZÚZ). Filtruje stejně.
  const cachePath = process.env.IDO_CACHE;
  if (cachePath) {
    const arr = JSON.parse(readFileSync(cachePath, 'utf8')) as Record<string, unknown>[];
    return arr.filter((v) => matches(String(v.speciesName ?? '')) && v.regDecisionDate);
  }

  const base = 'https://ido.ukzuz.cz/ido/api/varieties';
  const out: Record<string, unknown>[] = [];
  let page = 1;
  let total = Infinity;

  while ((page - 1) * 100 < total) {
    const url = `${base}?page=${page}&limit=100&lang=cs`;
    const res = await fetch(url, {
      headers: { Accept: 'application/json', 'User-Agent': 'Mozilla/5.0 (agro-svet importer)' },
    });
    if (!res.ok) {
      throw new Error(
        `ÚKZÚZ ${res.status} (${url}) — zkontroluj endpoint nebo použij PDF fallback z ukzuz.gov.cz`,
      );
    }
    const json = (await res.json()) as { total?: number; values?: Record<string, unknown>[] };
    total = typeof json.total === 'number' ? json.total : 0;
    const values = json.values ?? [];
    if (values.length === 0) break;
    for (const v of values) {
      if (matches(String(v.speciesName ?? '')) && v.regDecisionDate) out.push(v);
    }
    page += 1;
  }
  return out;
}

/** Mapa plodina_slug → PŘESNÉ názvy druhů v ÚKZÚZ (viz hlavička). */
function loadDruhyMap(): Record<string, string[]> {
  return JSON.parse(
    readFileSync(resolve('scripts/plodiny-druhy.json'), 'utf8'),
  ) as Record<string, string[]>;
}

async function importPlodina(
  plodinaSlug: string,
  matches: (speciesName: string) => boolean,
): Promise<number> {
  const raw = await fetchRaw(matches);
  const seen = new Set<string>();
  const odrudy = raw
    .map((r) => normalizeOdruda(r, plodinaSlug))
    .filter((o) => o.name && o.slug)
    .filter((o) => (seen.has(o.slug) ? false : (seen.add(o.slug), true)))
    .sort((a, b) => a.name.localeCompare(b.name, 'cs'));
  const out = resolve(`src/data/plodiny/odrudy/${plodinaSlug}.json`);
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, JSON.stringify(odrudy, null, 2) + '\n');
  console.log(`✓ ${odrudy.length} odrůd → ${out}`);
  return odrudy.length;
}

async function main() {
  const args = process.argv.slice(2);

  if (args[0] === '--all') {
    const map = loadDruhyMap();
    let total = 0;
    for (const [slug, druhy] of Object.entries(map)) {
      total += await importPlodina(slug, exactMatcher(druhy));
    }
    console.log(`\n✓ celkem ${total} odrůd v ${Object.keys(map).length} plodinách`);
    return;
  }

  const [plodinaSlug, ukzuzDruh] = args;
  if (!plodinaSlug) {
    console.error('Použití:');
    console.error('  npx tsx scripts/import-odrudy.ts --all');
    console.error('  npx tsx scripts/import-odrudy.ts <plodina_slug>            (přesný match z mapy)');
    console.error('  npx tsx scripts/import-odrudy.ts <plodina_slug> <druh>     (legacy substring)');
    process.exit(1);
  }

  if (ukzuzDruh) {
    await importPlodina(plodinaSlug, substringMatcher(ukzuzDruh));
    return;
  }

  const map = loadDruhyMap();
  const druhy = map[plodinaSlug];
  if (!druhy) {
    console.error(
      `Plodina „${plodinaSlug}" není v scripts/plodiny-druhy.json — doplň výčet přesných názvů druhů, nebo použij legacy režim s needle.`,
    );
    process.exit(1);
  }
  await importPlodina(plodinaSlug, exactMatcher(druhy));
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}
