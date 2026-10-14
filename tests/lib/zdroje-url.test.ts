import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import yaml from 'js-yaml';
import matter from 'gray-matter';

/**
 * Rohatka na odkazy na zdroje (audit 14. 10. 2026: 28 z 37 `sourceUrl` v encyklopedii
 * vracelo 404 a stovky `url:` u řad/modelů v katalogu byly vymyšlené nebo vedly na
 * homepage výrobce). Síť se tu nevolá — hlídáme jen to, co jde poznat ze samotného textu:
 *  - žádná prázdná URL, žádný placeholder (example.com, localhost, TODO),
 *  - jen https a syntakticky platná URL bez mezer,
 *  - zdroj tvrzení (sourceUrl, url u modelu/řady, sources[].url) není holá homepage,
 *  - wikipedia vede na článek, wikidata na položku Q…,
 *  - žádný návrat ke vzorům URL, které se v auditu ukázaly jako mrtvé/vymyšlené.
 * Funkčnost odkazů (HTTP) se ověřuje ručně přes zdroje-audit, ne v CI.
 */

const ROOT = process.cwd();

/** Klíče, jejichž hodnota je odkaz. Atribuce fotek (image_credit_url, galerie…) hlídá atribuce-fotek.test.ts. */
const URL_KLIC = /(^url$|Url$|_url$|^website$|^wikipedia$|^wikidata$)/;
const FOTO_KLIC = /^(image_credit_url|image_url|hero_credit_url|hero_image|src|source_url)$/;
/** Klíče, které nesou zdroj tvrzení — ty nesmí být jen homepage. */
const ZDROJ_KLIC = /^(url|sourceUrl|zdrojUrl|zdrojMereniUrl)$/;

const PLACEHOLDER = /(example\.(com|org|net)|localhost|127\.0\.0\.1|\btodo\b|\bxxx\b|lorem)/i;

/** Vzory, které audit 14. 10. 2026 našel mrtvé nebo vymyšlené. Návrat = regrese. */
const MRTVE_VZORY: RegExp[] = [
  /caseih\.com\/emea\//,
  /fendt\.com\/(cz|de)\/(traktory|traktoren|kombajny|maehdrescher)\//,
  /deere\.(cz|de)\/(cs|de)\/(traktory|traktoren|sklizen|ernte)\//,
  /kubota\.de\//,
  /kubota\.cz\/produkty\//,
  /masseyferguson\.com\/(cs-cz|de-de)\//,
  /newholland\.com\/cs-cz\//,
  /newholland\.com\/eu\/(cs-cz|de-de)\//,
  /valtra\.(cz|de)\/(traktory|traktoren)\//,
  /zetor\.com\/cs\//,
  /claas\.com\/cs-cz\/(produkty|zemedelske-stroje\/(traktory\/axion-900|sklizen))/,
  /deutz-fahr\.com\/cs-cz\//,
  /landmaschinen\.krone\.de/,
  /bednar-machinery\.com/,
  /amazone\.de\/de\/produkte\//,
  /manitou\.com\/en\/products\//,
  /horsch\.com\/en\/products\/(crop-care|sowing|tillage|seeding)\//,
  /vaderstad\.com\/en\/products\//,
  /kverneland\.com\/products\//,
  /kuhn\.com\/en-int\/products\//,
  /poettinger\.at\/cs_cz\/produkty\//,
  /jcb\.com\/en-gb\/products\/(compact-wheel-loaders|loadall|telescopic-wheel-loaders)\//,
  /joskin\.com\/en\/range\//,
];

type Odkaz = { soubor: string; cesta: string; klic: string; hodnota: unknown };

function soubory(dir: string, re: RegExp): string[] {
  const out: string[] = [];
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) out.push(...soubory(p, re));
    else if (re.test(e)) out.push(p);
  }
  return out;
}

function sber(data: unknown, soubor: string, out: Odkaz[], cesta: string[] = []) {
  if (Array.isArray(data)) return data.forEach((v, i) => sber(v, soubor, out, [...cesta, String(i)]));
  if (!data || typeof data !== 'object' || data instanceof Date) return;
  for (const [k, v] of Object.entries(data as Record<string, unknown>)) {
    // galerie/fotky mají vlastní test atribuce
    if (k === 'galerie' || k === 'gallery' || k === 'heroCredit' || k === 'model3d') continue;
    if (URL_KLIC.test(k) && !FOTO_KLIC.test(k)) {
      out.push({ soubor, cesta: [...cesta, k].join('.'), klic: k, hodnota: v });
    }
    if (v && typeof v === 'object') sber(v, soubor, out, [...cesta, k]);
  }
}

function vsechnyOdkazy(): Odkaz[] {
  const out: Odkaz[] = [];
  const content = join(ROOT, 'src/content');
  for (const d of readdirSync(content)) {
    if (!/^(encyklopedie|znacky)(-[a-z]{2})?$/.test(d)) continue;
    for (const f of soubory(join(content, d), /\.md$/)) {
      sber(matter(readFileSync(f, 'utf8')).data, f.slice(ROOT.length + 1), out);
    }
  }
  for (const f of soubory(join(ROOT, 'src/data/stroje'), /\.ya?ml$/)) {
    sber(yaml.load(readFileSync(f, 'utf8')), f.slice(ROOT.length + 1), out);
  }
  return out;
}

const ODKAZY = vsechnyOdkazy();
const popis = (o: Odkaz) => `${o.soubor} ${o.cesta} = ${JSON.stringify(o.hodnota)}`;

describe('odkazy na zdroje (encyklopedie, značky, katalog strojů)', () => {
  it('sběr něco našel (test neběží naprázdno)', () => {
    expect(ODKAZY.length).toBeGreaterThan(500);
    expect(ODKAZY.some((o) => o.klic === 'sourceUrl')).toBe(true);
    expect(ODKAZY.some((o) => o.klic === 'url' && o.soubor.includes('src/data/stroje/'))).toBe(true);
  });

  it('žádná prázdná URL ani placeholder', () => {
    const spatne = ODKAZY.filter(
      (o) => typeof o.hodnota !== 'string' || o.hodnota.trim() === '' || PLACEHOLDER.test(o.hodnota),
    );
    expect(spatne.map(popis)).toEqual([]);
  });

  it('jen platné https URL bez mezer', () => {
    const spatne = ODKAZY.filter((o) => {
      const v = String(o.hodnota);
      if (!/^https:\/\/[^\s"'<>]+$/.test(v)) return true;
      try {
        return new URL(v).protocol !== 'https:';
      } catch {
        return true;
      }
    });
    expect(spatne.map(popis)).toEqual([]);
  });

  it('zdroj tvrzení není holá homepage', () => {
    const spatne = ODKAZY.filter((o) => {
      if (!ZDROJ_KLIC.test(o.klic) && !/sources\.\d+\.url$/.test(o.cesta)) return false;
      const u = new URL(String(o.hodnota));
      const segmenty = u.pathname.split('/').filter(Boolean);
      // /cs-cz, /en/, /de-de … je pořád homepage
      return segmenty.length === 0 || (segmenty.length === 1 && /^[a-z]{2}([-_][a-z]{2})?$/i.test(segmenty[0]));
    });
    expect(spatne.map(popis)).toEqual([]);
  });

  it('wikipedia vede na článek, wikidata na položku', () => {
    const spatne = ODKAZY.filter(
      (o) =>
        (o.klic === 'wikipedia' && !/^https:\/\/[a-z]{2,3}\.wikipedia\.org\/wiki\/[^/?#]+$/.test(String(o.hodnota))) ||
        (o.klic === 'wikidata' && !/^https:\/\/www\.wikidata\.org\/wiki\/Q\d+$/.test(String(o.hodnota))),
    );
    expect(spatne.map(popis)).toEqual([]);
  });

  it('žádný vzor URL, který audit 14. 10. 2026 našel mrtvý nebo vymyšlený', () => {
    const spatne = ODKAZY.filter((o) => MRTVE_VZORY.some((re) => re.test(String(o.hodnota))));
    expect(spatne.map(popis)).toEqual([]);
  });

  it('cizí (ne-výrobcův) zdroj v encyklopedii nese sourceName, ať trust bar netvrdí „specifikace výrobce“', () => {
    const CIZI = /(tractordata\.com|web\.archive\.org|wikipedia\.org)/;
    const spatne: string[] = [];
    const content = join(ROOT, 'src/content');
    for (const d of readdirSync(content)) {
      if (!/^encyklopedie(-[a-z]{2})?$/.test(d)) continue;
      for (const f of soubory(join(content, d), /\.md$/)) {
        const fm = matter(readFileSync(f, 'utf8')).data as { sourceUrl?: string; sourceName?: string };
        if (fm.sourceUrl && CIZI.test(fm.sourceUrl) && !fm.sourceName) spatne.push(`${f.slice(ROOT.length + 1)} ${fm.sourceUrl}`);
      }
    }
    expect(spatne).toEqual([]);
  });
});
