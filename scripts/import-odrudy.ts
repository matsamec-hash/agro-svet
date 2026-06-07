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
 * Spuštění: npx tsx scripts/import-odrudy.ts <plodina_slug> <ukzuz_druh>
 *   např.:  npx tsx scripts/import-odrudy.ts oves "Oves setý"
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
async function fetchRaw(ukzuzDruh: string): Promise<Record<string, unknown>[]> {
  const needle = ukzuzDruh.toLowerCase();

  // Lokální cache: IDO_CACHE=cesta k JSON poli všech raw záznamů (jedno stažení
  // → generace všech plodin bez opakovaného volání ÚKZÚZ). Filtruje stejně.
  const cachePath = process.env.IDO_CACHE;
  if (cachePath) {
    const arr = JSON.parse(readFileSync(cachePath, 'utf8')) as Record<string, unknown>[];
    return arr.filter(
      (v) => String(v.speciesName ?? '').toLowerCase().includes(needle) && v.regDecisionDate,
    );
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
      const species = String(v.speciesName ?? '').toLowerCase();
      if (species.includes(needle) && v.regDecisionDate) out.push(v);
    }
    page += 1;
  }
  return out;
}

async function main() {
  const [plodinaSlug, ukzuzDruh] = process.argv.slice(2);
  if (!plodinaSlug || !ukzuzDruh) {
    console.error('Použití: npx tsx scripts/import-odrudy.ts <plodina_slug> <ukzuz_druh>');
    console.error('Příklad: npx tsx scripts/import-odrudy.ts oves "Oves setý"');
    process.exit(1);
  }
  const raw = await fetchRaw(ukzuzDruh);
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
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}
