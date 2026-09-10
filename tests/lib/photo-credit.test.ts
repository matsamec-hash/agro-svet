import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';
import {
  PHOTO_CREDITS,
  creditFor,
  creditsFor,
  canonicalPath,
  licenseUrlFor,
  requiresAuthor,
  isTrademark,
} from '../../src/lib/photo-credit';

/**
 * Rohatka atribuce fotek.
 *
 * Fotka pod CC BY / CC BY-SA vyžaduje jméno autora, název licence a odkaz na
 * licenci. „Wikimedia Commons" je zdroj, ne autor — přesně na téhle vadě stála
 * advokátní výzva PhotoClaim (52-06966, 2 169,95 EUR) proti svetovestadiony.cz.
 *
 * 10. 9. 2026 sneseno na nulu: každý obrázek v `public/images`, na který se
 * někde odkazuje, má buď dohledatelného autora, nebo licenci bez povinné
 * atribuce (Unsplash/Pexels/Pixabay/volné dílo), nebo je to logo značky.
 * Nová fotka bez atribuce tedy neprojde.
 */
const LIMIT_BEZ_KREDITU = 0;

const ROOT = join(import.meta.dirname, '../..');

/** Lokální obrázky, na které se někde v `src/` odkazuje (bez SVG a OG kartiček). */
function referencedImages(): string[] {
  const found = new Set<string>();
  const walk = (dir: string) => {
    for (const e of readdirSync(dir, { withFileTypes: true })) {
      if (e.name === 'node_modules' || e.name.startsWith('.')) continue;
      const p = join(dir, e.name);
      if (e.isDirectory()) {
        walk(p);
        continue;
      }
      if (!/\.(ts|tsx|astro|md|mdx|yaml|yml|json)$/.test(e.name)) continue;
      // Registr sám je seznam kreditů, ne místo užití.
      if (relative(ROOT, p) === 'src/lib/photo-credit.ts') continue;
      const txt = readFileSync(p, 'utf8');
      // (?<![\w.]) — ať se do seznamu nechytí cesta uvnitř cizí URL
      // (`https://www.deere.cz/assets/images/...` je odkaz na zdroj, ne náš soubor).
      for (const m of txt.matchAll(/(?<![\w.])\/images\/[A-Za-z0-9._\-/]+\.(?:webp|jpe?g|png)/g)) {
        found.add(m[0]);
      }
    }
  };
  walk(join(ROOT, 'src'));
  // Jen soubory, které na disku opravdu jsou — v komentářích se cesty uvádějí
  // jako příklad („např. /images/stroje/wikimedia/zetor-7745-1.jpg") a takový
  // obrázek se nikomu nezobrazí.
  return [...found].filter((p) => existsSync(join(ROOT, 'public', p)));
}

describe('atribuce fotek', () => {
  it('počet použitých obrázků bez uvedeného autora neroste', () => {
    const used = referencedImages();
    // Pojistka proti tomu, aby test tiše prošel na prázdném seznamu.
    expect(used.length).toBeGreaterThan(150);

    const bez = used.filter((path) => {
      if (isTrademark(path)) return false; // loga značek = ochranné známky, ne fotky
      const c = creditFor(path);
      if (!c) return true;
      if (!requiresAuthor(c.license)) return false;
      return !c.author;
    });

    expect(bez, `bez atribuce:\n${bez.join('\n')}`).toHaveLength(LIMIT_BEZ_KREDITU);
  });

  it('každý obrázek s povinnou atribucí má i odkaz na licenci a na zdroj', () => {
    const bad: string[] = [];
    for (const [path, c] of Object.entries(PHOTO_CREDITS)) {
      if (!requiresAuthor(c.license)) continue;
      const licenseUrl = c.licenseUrl ?? licenseUrlFor(c.license);
      if (!licenseUrl && !c.source) bad.push(`${path} — ani odkaz na licenci, ani na zdroj`);
      if (!c.license) bad.push(`${path} — chybí název licence`);
    }
    expect(bad, bad.join('\n')).toHaveLength(0);
  });

  it('autor nesmí být jen zdroj („Wikimedia Commons", „Own work")', () => {
    for (const [path, c] of Object.entries(PHOTO_CREDITS)) {
      expect(c.author, path).not.toMatch(/^(wikimedia commons|commons|own work|vlastní dílo|unknown)$/i);
    }
  });

  it('každý kreditovaný lokální obrázek na disku existuje', () => {
    const chybi = Object.keys(PHOTO_CREDITS)
      .filter((p) => p.startsWith('/images/'))
      .filter((p) => !existsSync(join(ROOT, 'public', p)) && !existsSync(join(ROOT, 'public', p.replace(/(\.[a-z0-9]+)$/, '__v-w800$1'))));
    expect(chybi, chybi.join('\n')).toHaveLength(0);
  });

  it('licenceUrlFor sestaví odkaz včetně jurisdikčních portů', () => {
    expect(licenseUrlFor('CC BY-SA 4.0')).toBe('https://creativecommons.org/licenses/by-sa/4.0/');
    expect(licenseUrlFor('CC BY 2.0')).toBe('https://creativecommons.org/licenses/by/2.0/');
    expect(licenseUrlFor('CC BY-SA 3.0 de')).toBe('https://creativecommons.org/licenses/by-sa/3.0/de/');
    expect(licenseUrlFor('CC0')).toBe('https://creativecommons.org/publicdomain/zero/1.0/');
    expect(licenseUrlFor('Editorial / press use')).toBeUndefined();
  });

  it('requiresAuthor pozná licence bez povinné atribuce', () => {
    expect(requiresAuthor('CC BY-SA 4.0')).toBe(true);
    expect(requiresAuthor('Public domain')).toBe(false);
    expect(requiresAuthor('Unsplash License')).toBe(false);
    expect(requiresAuthor('Pexels License')).toBe(false);
    expect(requiresAuthor('')).toBe(true);
  });

  it('creditFor snese responzivní variantu i URL fotobanky', () => {
    expect(creditFor('/images/telata__v-w800.webp')?.author).toBe('Susanne Nilsson');
    expect(canonicalPath('/images/telata__v-w800.webp')).toBe('/images/telata.webp');
    // Cover z CMS pojmenovaný podle fotobanky → licence bez povinné atribuce.
    const stock = creditFor('https://cdn.samecdigital.com/1777293361099-pexels-30685678__v-w1600.webp');
    expect(stock?.license).toBe('Pexels License');
    expect(requiresAuthor(stock!.license)).toBe(false);
  });

  it('cover článků z Commons má autora, ne jen odkaz na soubor', () => {
    const fendt = creditFor('https://cdn.samecdigital.com/rehost-fendt-1050-vario-rekordni-priplatek__v-w1600.webp');
    expect(fendt?.author).toBe('MarcelX42');
    expect(fendt?.license).toBe('CC BY-SA 4.0');
    const jd = creditFor('https://cdn.samecdigital.com/rehost-john-deere-9rx-dotace-2025__v-w1600.webp');
    expect(jd?.author).toBe('JDDeutschland');
  });

  it('creditsFor deduplikuje a vynechá licence bez povinné atribuce', () => {
    const out = creditsFor([
      '/images/telata.webp',
      '/images/telata__v-w400.webp', // tatáž fotka jinou variantou
      '/images/traktor.webp', // Unsplash → do bloku nepatří
      null,
    ]);
    expect(out).toHaveLength(1);
    expect(out[0]!.author).toBe('Susanne Nilsson');
  });

  it('plodiny s CC licencí mají vyplněného autora (jinak vyjde „Foto: CC BY-SA 3.0")', () => {
    for (const slug of ['kvetak', 'tritikale', 'zeli', 'jetel']) {
      const c = creditFor(`/images/plodiny/${slug}.jpg`);
      expect(c, slug).toBeTruthy();
      if (requiresAuthor(c!.license)) expect(c!.author, slug).toBeTruthy();
    }
  });
});
