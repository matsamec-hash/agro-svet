import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';
import {
  PHOTO_CREDITS,
  creditFor,
  creditFromArticle,
  creditsFor,
  canonicalPath,
  isSynthetic,
  licenseUrlFor,
  requiresAuthor,
} from '../../src/lib/photo-credit';
import yaml from 'js-yaml';

/**
 * Rohatka atribuce fotek.
 *
 * Fotka pod CC BY / CC BY-SA vyžaduje jméno autora, název licence a odkaz na
 * licenci. „Wikimedia Commons" je zdroj, ne autor — přesně na téhle vadě stála
 * advokátní výzva PhotoClaim (52-06966, 2 169,95 EUR) proti svetovestadiony.cz.
 *
 * 10. 9. 2026 sneseno na nulu: každý obrázek v `public/images`, na který se
 * někde odkazuje, má buď dohledatelného autora, nebo licenci bez povinné
 * atribuce (Unsplash/Pexels/Pixabay/volné dílo). Loga značek žádnou výjimku
 * nemají — ochranná známka neříká nic o autorských právech k souboru.
 * Nová fotka ani logo bez doloženého původu tedy neprojde.
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
    // Neznámý název licence odkaz nedostane — radši nic než odkaz jinam.
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

  it('každé logo značky má doloženou licenci z Commons', async () => {
    const { ZNACKA_LOGO, ZNACKA_LOGO_LICENCE } = await import('../../src/lib/agro-integrace');
    for (const [slug, path] of Object.entries(ZNACKA_LOGO)) {
      const l = ZNACKA_LOGO_LICENCE[slug];
      expect(l, `${slug} — logo bez záznamu o licenci`).toBeTruthy();
      expect(l!.source, slug).toMatch(/^https:\/\/commons\.wikimedia\.org\/wiki\/File:/);
      if (requiresAuthor(l!.license)) expect(l!.author, slug).toBeTruthy();
      expect(existsSync(join(ROOT, 'public', path)), `${slug} — soubor ${path} chybí`).toBe(true);
    }
  });

  it('plodiny s CC licencí mají vyplněného autora (jinak vyjde „Foto: CC BY-SA 3.0")', () => {
    for (const slug of ['kvetak', 'tritikale', 'zeli', 'jetel']) {
      const c = creditFor(`/images/plodiny/${slug}.jpg`);
      expect(c, slug).toBeTruthy();
      if (requiresAuthor(c!.license)) expect(c!.author, slug).toBeTruthy();
    }
  });
});

/**
 * Cover fotky článků. Zdroj pravdy je sloupec `articles.featured_image_credit`
 * — CMS do něj zapisuje banku, jméno fotografa a odkaz na originál. Web ho do
 * 9/2026 nečetl a licenci si HÁDAL z názvu souboru; hádání zůstává jen jako
 * fallback pro starší soubory.
 */
describe('kredit z databáze článků', () => {
  it('objekt z CMS má přednost před hádáním z názvu souboru', () => {
    const c = creditFromArticle(
      {
        provider: 'pexels',
        source_url: 'https://www.pexels.com/photo/brown-cattle-30685678/',
        photographer_name: 'Roman Biernacki',
        photographer_url: 'https://www.pexels.com/@szafran',
      },
      'https://cdn.samecdigital.com/1777293361099-pexels-30685678__v-w1600.webp',
    );
    // Z názvu souboru se dá poznat jen banka; jméno fotografa nese databáze.
    expect(c?.author).toBe('Roman Biernacki');
    expect(c?.license).toBe('Pexels License');
    expect(c?.source).toContain('pexels.com/photo/');
  });

  it('licence vyplněná v řádku přebije provider (Commons nemá jednu licenci)', () => {
    const c = creditFromArticle({
      provider: 'wikimedia-commons',
      license: 'CC BY-SA 4.0',
      photographer_name: 'MarcelX42',
      source_url: 'https://commons.wikimedia.org/wiki/File:Fendt_1050_Vario_Agritechnica_2023_(DSC05113).jpg',
    });
    expect(c?.license).toBe('CC BY-SA 4.0');
    expect(c?.licenseUrl).toBe('https://creativecommons.org/licenses/by-sa/4.0/');
    expect(requiresAuthor(c!.license)).toBe(true);
    expect(c?.author).toBe('MarcelX42');
  });

  it('starý prostý text „Foto: Pexels" je zdroj, ne jméno fotografa', () => {
    const c = creditFromArticle('Foto: Pexels', '/images/telata.webp');
    expect(c?.author).toBe('');
    expect(c?.license).toBe('Pexels License');
  });

  it('prázdný sloupec spadne zpět na registr', () => {
    expect(creditFromArticle(null, '/images/telata.webp')?.author).toBe('Susanne Nilsson');
    expect(creditFromArticle({}, '/images/telata.webp')?.author).toBe('Susanne Nilsson');
    expect(creditFromArticle(null, null)).toBeNull();
  });

  it('samotný odkaz na zdroj se za kredit nevydává', () => {
    // „Wikimedia Commons" místo jména autora byla přesně ta vada, za kterou
    // přišla výzva — řádek jen s URL proto kredit nedělá.
    const c = creditFromArticle(
      { source_url: 'https://commons.wikimedia.org/wiki/File:Cokoli.jpg' },
      '/images/telata.webp',
    );
    expect(c?.author).toBe('Susanne Nilsson');
  });
});

/**
 * AI snímky plemen. Licence „Synthetic — illustrative only" atribuci
 * nevyžaduje, takže je `requiresAuthor()` pustí a souhrnný blok „Fotografie"
 * je vynechá — o obrázku by se pak čtenář nedozvěděl vůbec nic. Plaketku
 * „AI ilustrace" vykresluje `AiIllustrationBadge.astro` podle `isSynthetic()`,
 * takže příznak musí sedět ve VŠECH jazykových overlayích: jinak by cizojazyčná
 * verze téhož plemene ukázala ilustraci jako fotografii.
 */
describe('AI generované fotky plemen', () => {
  const AI_SLUGS = [
    'belgicke-modrobile', 'bile-otcovske', 'bile-uslechtile', 'brown-swiss',
    'ceska-landrasa', 'czech-moravsky-kun', 'gasconne', 'merinolandschaf',
    'slezsky-norik', 'valaska',
  ];

  function syntheticIn(dir: string): { slug: string; credit?: string }[] {
    const out: { slug: string; credit?: string }[] = [];
    const walk = (n: unknown) => {
      if (Array.isArray(n)) return n.forEach(walk);
      if (!n || typeof n !== 'object') return;
      const o = n as Record<string, unknown>;
      if (isSynthetic(o.image_license as string)) {
        out.push({ slug: String(o.slug), credit: o.image_credit as string | undefined });
      }
      Object.values(o).forEach(walk);
    };
    for (const f of readdirSync(join(ROOT, dir))) {
      if (!/\.ya?ml$/.test(f)) continue;
      walk(yaml.load(readFileSync(join(ROOT, dir, f), 'utf8')));
    }
    return out;
  }

  it('isSynthetic pozná licenci i kredit generátoru', () => {
    expect(isSynthetic('Synthetic — illustrative only')).toBe(true);
    expect(isSynthetic('AI-generated (gpt-image-1)')).toBe(true);
    expect(isSynthetic('CC BY-SA 4.0')).toBe(false);
    expect(isSynthetic('Public domain')).toBe(false);
    expect(isSynthetic(null)).toBe(false);
  });

  it('všech 10 snímků je označených, a to ve všech jazycích', () => {
    for (const dir of ['src/data/plemena', 'src/data/plemena-de', 'src/data/plemena-pl', 'src/data/plemena-sk', 'src/data/plemena-uk']) {
      const found = syntheticIn(dir);
      expect(found.map((x) => x.slug).sort(), dir).toEqual(AI_SLUGS);
      // Kredit musí říct, co obrázek vyrobilo — „ilustrace" bez původu je málo.
      for (const x of found) expect(x.credit, `${dir}/${x.slug}`).toMatch(/AI-generated/i);
    }
  });

  it('AI snímek se nedostane do souhrnného bloku jako by ho někdo vyfotil', () => {
    expect(creditsFor(['/images/plemena/hovezi/brown-swiss.webp'])).toHaveLength(0);
  });
});
