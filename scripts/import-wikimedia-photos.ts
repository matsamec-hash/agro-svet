/**
 * Import legálních fotek strojů z Wikimedia Commons — s licenční kontrolou a atribucí.
 *
 * NEPÍŠE přímo do katalogu (human-in-the-loop kvůli kurátorství). Stáhne kandidáty,
 * uloží je do public/images/stroje/wikimedia/, a vytiskne YAML `gallery:` snippet
 * + review manifest, který USER schválí a vloží do src/data/stroje/<brand>.yaml.
 *
 * Použití:
 *   npx tsx scripts/import-wikimedia-photos.ts "New Holland CR11" new-holland-cr11 [max]
 *   npx tsx scripts/import-wikimedia-photos.ts "Zetor 7745" zetor-7745 3
 *
 * Bezpečnostní pravidla:
 *  - jen volné licence (CC0, CC-BY, CC-BY-SA, public domain) — copyrighted se zahodí
 *  - povinná atribuce (autor + licence + odkaz na file page) → uloží se do snippetu
 *  - thumbnaily max 1280px (repo bloat + memory: image >2000px limit)
 *  - popisný User-Agent (Wikimedia API to vyžaduje)
 */
import { writeFile, mkdir } from 'node:fs/promises';
import { join } from 'node:path';

const API = 'https://commons.wikimedia.org/w/api.php';
const UA = 'agro-svet.cz photo importer (matsamec@gmail.com) - editorial machine catalog';
const OUT_DIR = 'public/images/stroje/wikimedia';
const THUMB_W = 1280;

// Akceptované licence (prefix match na LicenseShortName, case-insensitive).
const OK_LICENSE = [/^cc0/i, /^cc[- ]?by/i, /^public domain/i, /^pd/i];

interface Candidate {
  title: string;
  descriptionUrl: string;
  thumbUrl: string;
  mime: string;
  width: number;
  author: string | null;
  license: string | null;
  licenseUrl: string | null;
}

function stripHtml(s: string | undefined): string | null {
  if (!s) return null;
  return s.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim() || null;
}

function licenseOk(lic: string | null): boolean {
  if (!lic) return false;
  return OK_LICENSE.some((re) => re.test(lic));
}

async function search(query: string, limit: number): Promise<Candidate[]> {
  const url = `${API}?${new URLSearchParams({
    action: 'query',
    generator: 'search',
    gsrsearch: `${query} filetype:bitmap`,
    gsrnamespace: '6',
    gsrlimit: String(limit * 3), // over-fetch; filtrujeme licence + mime
    prop: 'imageinfo',
    iiprop: 'url|extmetadata|mime|size',
    iiurlwidth: String(THUMB_W),
    format: 'json',
    origin: '*',
  })}`;
  const res = await fetch(url, { headers: { 'User-Agent': UA } });
  if (!res.ok) throw new Error(`Wikimedia search HTTP ${res.status}`);
  const json: any = await res.json();
  const pages = json?.query?.pages ?? {};
  const out: Candidate[] = [];
  for (const p of Object.values<any>(pages)) {
    const ii = p.imageinfo?.[0];
    if (!ii) continue;
    if (!/^image\/(jpeg|png)$/.test(ii.mime)) continue;
    const em = ii.extmetadata ?? {};
    const license = stripHtml(em.LicenseShortName?.value);
    if (!licenseOk(license)) continue;
    out.push({
      title: p.title,
      descriptionUrl: ii.descriptionurl,
      thumbUrl: ii.thumburl ?? ii.url,
      mime: ii.mime,
      width: ii.thumbwidth ?? ii.width ?? 0,
      author: stripHtml(em.Artist?.value),
      license,
      licenseUrl: stripHtml(em.LicenseUrl?.value),
    });
  }
  return out;
}

async function download(url: string, dest: string): Promise<void> {
  const res = await fetch(url, { headers: { 'User-Agent': UA } });
  if (!res.ok) throw new Error(`download HTTP ${res.status} for ${url}`);
  const buf = Buffer.from(await res.arrayBuffer());
  await writeFile(dest, buf);
}

async function main() {
  const [query, slug, maxArg] = process.argv.slice(2);
  if (!query || !slug) {
    console.error('Usage: tsx scripts/import-wikimedia-photos.ts "<model name>" <slug> [max]');
    process.exit(1);
  }
  const max = Math.max(1, Math.min(6, Number(maxArg) || 3));
  await mkdir(OUT_DIR, { recursive: true });

  console.log(`\n🔎 Hledám na Wikimedia Commons: "${query}" (licence CC/PD only)…`);
  const candidates = (await search(query, max)).slice(0, max);
  if (candidates.length === 0) {
    console.log('⚠️  Žádné volně licencované fotky nenalezeny. Zkus jiný název nebo vlastní foto.');
    return;
  }

  const gallery: any[] = [];
  const ext = (mime: string) => (mime === 'image/png' ? 'png' : 'jpg');
  for (let i = 0; i < candidates.length; i++) {
    const c = candidates[i];
    const fname = `${slug}-${i + 1}.${ext(c.mime)}`;
    const dest = join(OUT_DIR, fname);
    await download(c.thumbUrl, dest);
    console.log(`  ✓ ${fname}  ←  ${c.title}`);
    console.log(`      autor: ${c.author ?? '—'} | licence: ${c.license} | ${c.descriptionUrl}`);
    gallery.push({
      src: `/images/stroje/wikimedia/${fname}`,
      author: c.author,
      license: c.license,
      source_url: c.descriptionUrl,
    });
  }

  // Review manifest (pro USER schválení) + hotový YAML snippet.
  const manifestDir = 'scripts/wikimedia-staging';
  await mkdir(manifestDir, { recursive: true });
  await writeFile(join(manifestDir, `${slug}.json`), JSON.stringify({ slug, query, gallery }, null, 2));

  const yaml = [
    `            gallery:`,
    ...gallery.flatMap((g) => [
      `              - src: ${g.src}`,
      `                author: ${JSON.stringify(g.author ?? '')}`,
      `                license: ${JSON.stringify(g.license ?? '')}`,
      `                source_url: ${g.source_url}`,
    ]),
  ].join('\n');

  console.log(`\n📋 YAML snippet do src/data/stroje/<brand>.yaml pod model "${slug}" (odsazení uprav dle sousedů):\n`);
  console.log(yaml);
  console.log(`\n🖼️  Fotky staženy do ${OUT_DIR}/ — PROHLÉDNI je, než vložíš do katalogu.`);
  console.log(`   Manifest: ${manifestDir}/${slug}.json\n`);
}

main().catch((e) => {
  console.error('❌', e.message);
  process.exit(1);
});
