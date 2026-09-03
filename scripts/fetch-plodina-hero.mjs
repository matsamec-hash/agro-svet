/**
 * Stáhne hero obrázek plodiny z Wikimedia Commons a doplní atribuci do YAML.
 *
 * Postup: cs.wikipedia REST summary článku (odkaz je v `wikipedia:` v YAML) → lead image;
 * když chybí, zkusí en verzi přes langlinks; když ani ta není nebo licence není volná,
 * hledá přímo na Commons. Vždy se ověří licence z extmetadata a bere se jen VOLNÁ.
 * Pak download → sips resize na šířku 1200 px, q80 → public/images/plodiny/<slug>.jpg
 * → zápis hero_image / hero_author / hero_license / hero_source do YAML.
 *
 * ‼️ Wikimedia od 8/2026 rate-limituje serverové IP (viz reference-wikimedia-commons-nahledy-a-rate-limit).
 * Proto DELAY mezi requesty a popisný User-Agent. Pouštět z lokálu, ne z CI.
 * ‼️ REST API připojuje k URL obrázku UTM parametry — název souboru se musí brát z pathname,
 * jinak se Commons ptáme na neexistující soubor a vrátí prázdná metadata.
 *
 * Spuštění: node scripts/fetch-plodina-hero.mjs <slug> [<slug>...]
 *           node scripts/fetch-plodina-hero.mjs --missing              (jen plodiny bez hero_image)
 *           node scripts/fetch-plodina-hero.mjs <slug> --file "<název na Commons>"
 *
 * ‼️ Fulltext na Commons hledá i v NÁZVECH souborů, takže české jméno plodiny může vytáhnout
 * úplně jinou entitu — „Kadeřávek" vrátil portrét člověka toho příjmení. Když automat sáhne
 * vedle, vybrat soubor ručně přes --file (licence se ověřuje i tak).
 */
import { readFileSync, writeFileSync, existsSync, readdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

const UA = 'agro-svet.cz hero image sourcing (https://agro-svet.cz; kontakt info@agro-svet.cz)';
const DELAY = 1500;
const DIR = 'src/data/plodiny';
const OUT = 'public/images/plodiny';

/** Licence, které smíme použít. Cokoli jiného se zahodí — radši žádný obrázek než sporný. */
const FREE = [/^public domain/i, /^pd([ -]|$)/i, /^cc0/i, /^cc[ -]by(-sa)?[ -]?[0-9.]*$/i];
const isFree = (short) => Boolean(short) && FREE.some((re) => re.test(short.trim()));

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const get = async (url) => {
  const res = await fetch(url, { headers: { 'User-Agent': UA, Accept: 'application/json' } });
  if (res.status === 429) throw new Error('429 rate limit — zvyš DELAY a spusť znovu');
  if (!res.ok) throw new Error(`HTTP ${res.status} ${url}`);
  return res.json();
};

const clean = (v) =>
  (v ?? '')
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#0?39;/g, "'")
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&nbsp;/g, ' ')
    // podpis na Commons často nese časové razítko („Rasbak 13:13, 20 May 2007 (UTC)")
    .replace(/\s*\d{1,2}:\d{2},\s*\d{1,2}\s+\w+\s+\d{4}\s*\(UTC\)\s*$/, '')
    .trim();

/** Zapíše hero_* pole hned za řádek `skupina:` (stejné pořadí jako u polních plodin). */
function writeHero(path, text, fields) {
  const cleaned = text.split('\n').filter((l) => !/^hero_(image|author|license|source):/.test(l));
  const at = cleaned.findIndex((l) => l.startsWith('skupina:'));
  if (at < 0) throw new Error(`${path}: chybí řádek skupina:`);
  cleaned.splice(at + 1, 0,
    `hero_image: ${fields.image}`,
    `hero_author: ${JSON.stringify(fields.author ?? '')}`,
    `hero_license: ${JSON.stringify(fields.license)}`,
    `hero_source: ${JSON.stringify(fields.source)}`,
  );
  writeFileSync(path, cleaned.join('\n'));
}

/** Ověří licenci souboru na Commons; když je volná, stáhne ho a zapíše atribuci. */
async function downloadIfFree(slug, path, text, fileName) {
  const info = await get(
    `https://commons.wikimedia.org/w/api.php?action=query&titles=${encodeURIComponent('File:' + fileName)}` +
      `&prop=imageinfo&iiprop=extmetadata|url&format=json&origin=*`,
  );
  await sleep(DELAY);
  const page = Object.values(info.query?.pages ?? {})[0];
  const meta = page?.imageinfo?.[0]?.extmetadata;
  if (!meta) return false;

  const license = clean(meta.LicenseShortName?.value);
  // ‼️ Pole Artist je volný text — nahrávající do něj běžně píšou celý text licence,
  // prosby i vlastní e-mail. Bereme jen první řádek a tvrdě omezujeme délku, ať se
  // do atribuce na webu nedostane cizí kontakt ani odstavec právního textu.
  const author = clean(meta.Artist?.value).split('\n')[0].trim().slice(0, 80);
  if (!isFree(license)) return false;

  const src = page.imageinfo[0].url;
  const tmp = `/tmp/hero-${slug}${new URL(src).pathname.match(/\.\w+$/)?.[0] ?? '.jpg'}`;
  const bin = await fetch(src, { headers: { 'User-Agent': UA } });
  if (!bin.ok) return false;
  writeFileSync(tmp, Buffer.from(await bin.arrayBuffer()));
  await sleep(DELAY);

  execFileSync('sips',
    ['-s', 'format', 'jpeg', '-s', 'formatOptions', '80', '-Z', '1200', tmp, '--out', `${OUT}/${slug}.jpg`],
    { stdio: 'ignore' });
  writeHero(path, text, {
    image: `/images/plodiny/${slug}.jpg`,
    author,
    license,
    source: `https://commons.wikimedia.org/wiki/File:${fileName.replace(/ /g, '_')}`,
  });
  console.log(`  ${slug}: ✓ ${license}${author ? ` · ${author}` : ''}  [${fileName}]`);
  return true;
}

/** Vyhledá na Commons soubory k názvu a vrátí jejich jména (bez prefixu File:). */
async function commonsSearch(query) {
  const j = await get(
    `https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch=` +
      `${encodeURIComponent(query)}&srnamespace=6&srlimit=12&format=json&origin=*`,
  );
  await sleep(DELAY);
  return (j.query?.search ?? [])
    .map((x) => x.title.replace(/^File:/, ''))
    .filter((n) => /\.(jpe?g|png)$/i.test(n));
}

async function leadImageFileName(title) {
  let s = await get(`https://cs.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`);
  await sleep(DELAY);
  let file = s.originalimage?.source ?? s.thumbnail?.source;
  if (!file) {
    const ll = await get(
      `https://cs.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(title)}` +
        `&prop=langlinks&lllang=en&format=json&origin=*`,
    );
    await sleep(DELAY);
    const en = Object.values(ll.query?.pages ?? {})[0]?.langlinks?.[0]?.['*'];
    if (en) {
      s = await get(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(en)}`);
      await sleep(DELAY);
      file = s.originalimage?.source ?? s.thumbnail?.source;
    }
  }
  if (!file) return null;
  return decodeURIComponent(new URL(file).pathname.split('/').pop().replace(/^\d+px-/, ''));
}

async function one(slug, explicitFile) {
  const path = `${DIR}/${slug}.yaml`;
  if (!existsSync(path)) return console.log(`  ${slug}: ⚠ chybí ${path}`);
  const text = readFileSync(path, 'utf8');
  const wiki = text.match(/^wikipedia:\s*(\S+)$/m)?.[1];
  if (!wiki) return console.log(`  ${slug}: ⚠ chybí wikipedia: odkaz, přeskakuji`);
  const title = decodeURIComponent(wiki.split('/wiki/')[1]);

  if (explicitFile) {
    if (await downloadIfFree(slug, path, text, explicitFile)) return;
    return console.log(`  ${slug}: ⛔ „${explicitFile}" nemá volnou licenci nebo neexistuje`);
  }

  const lead = await leadImageFileName(title);
  if (lead && (await downloadIfFree(slug, path, text, lead))) return;

  const hits = (await commonsSearch(title)).filter((n) => n !== lead);
  for (const n of hits) if (await downloadIfFree(slug, path, text, n)) return;
  console.log(`  ${slug}: ⛔ nic s volnou licencí (lead + ${hits.length} kandidátů z Commons)`);
}

const argv = process.argv.slice(2);
const fileIdx = argv.indexOf('--file');
const explicitFile = fileIdx >= 0 ? argv[fileIdx + 1] : null;
if (fileIdx >= 0) argv.splice(fileIdx, 2);
const slugs =
  argv[0] === '--missing'
    ? readdirSync(DIR).filter((f) => f.endsWith('.yaml')).map((f) => f.replace(/\.yaml$/, ''))
        .filter((s) => !/^hero_image:/m.test(readFileSync(`${DIR}/${s}.yaml`, 'utf8')))
    : argv;
if (!slugs.length) { console.error('Použití: node scripts/fetch-plodina-hero.mjs <slug>... | --missing'); process.exit(1); }
console.log(`hero obrázky pro ${slugs.length} plodin:`);
for (const s of slugs) {
  try { await one(s, explicitFile); } catch (e) { console.log(`  ${s}: ⚠ ${e.message}`); }
}
