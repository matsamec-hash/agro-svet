// Jedno místo, které ke každému obrázku na webu vrátí autora, licenci a odkaz.
//
// Proč: fotka pod CC BY / CC BY-SA vyžaduje **jméno autora + název licence +
// odkaz na licenci**. „Foto: Wikimedia Commons" je zdroj, ne autor, a nestačí —
// přesně na téhle vadě stála advokátní výzva PhotoClaim (případ 52-06966,
// 2 169,95 EUR) proti svetovestadiony.cz. Kredity na agro-svetu do té doby
// existovaly roztroušeně v datech, ale řada stránek je nevykreslovala vůbec.
//
// Zdroj pravdy zůstávají datové soubory (`src/data/**`), aby kredit nemohl
// odejít od fotky. Registr je nad nimi jen index cesta → kredit; obrázky, které
// se v datech nevyskytují (dlaždice, hero fotky natvrdo v šablonách), mají
// ruční tabulku EXTRA níž.
//
// Konzumenti: `PhotoCredits.astro` (souhrnný blok „Fotografie") a test-rohatka
// `tests/lib/photo-credit.test.ts`, která hlídá, že počet nekreditovaných
// obrázků může jen klesat.

import { ZNACKA_LOGO, ZNACKA_LOGO_LICENCE } from './agro-integrace';

export interface PhotoCredit {
  /** Jméno autora tak, jak ho uvádí Commons. Prázdné jen u licencí bez atribuce. */
  author: string;
  /** Název licence („CC BY-SA 4.0", „Public domain", „Unsplash License"…). */
  license: string;
  /** Odkaz na text licence. U licencí bez atribuce může chybět. */
  licenseUrl?: string;
  /** Odkaz na soubor/stránku zdroje. */
  source?: string;
}

/** Licence, u kterých se atribuce nevyžaduje — netřeba autora, jen licenci. */
const NO_ATTRIBUTION = /^(public domain|cc0|volné dílo|unsplash|pexels|pixabay|synthetic)/i;

export function requiresAuthor(license: string | undefined | null): boolean {
  if (!license) return true;
  return !NO_ATTRIBUTION.test(license.trim());
}

/**
 * Fotka, kterou nevyfotil nikdo — vygeneroval ji model (dnes 10 plemen, licence
 * „Synthetic — illustrative only").
 *
 * Atribuci nevyžaduje, takže ji `requiresAuthor()` pouští dál a souhrnný blok
 * „Fotografie" ji vynechává — jenže tím o ní čtenář nezjistil vůbec nic
 * a u katalogu plemen si snadno splete ilustraci se snímkem zvířete. Proto
 * vlastní příznak: kde se taková fotka ukáže, musí u ní být vidět, že je to
 * ilustrace.
 */
export function isSynthetic(license: string | undefined | null): boolean {
  return /^synthetic|^ai[-\s]?gener/i.test((license ?? '').trim());
}

/** Z názvu licence odvodí odkaz na její text. Neznámou licenci nechá bez odkazu. */
export function licenseUrlFor(license: string | undefined | null): string | undefined {
  if (!license) return undefined;
  const l = license.trim();
  if (/^cc0/i.test(l)) return 'https://creativecommons.org/publicdomain/zero/1.0/';
  if (/^gfdl/i.test(l)) return 'https://www.gnu.org/licenses/fdl-1.3.html';
  // „CC BY-SA 3.0 de" / „CC BY-SA 3.0 at" → jurisdikční port má vlastní URL.
  const m = l.match(/^CC\s+(BY(?:-SA|-ND|-NC)?)\s+([0-9](?:\.[0-9])?)(?:\s+([a-z]{2}))?$/i);
  if (m) {
    const kind = m[1]!.toLowerCase();
    const ver = m[2]!.includes('.') ? m[2]! : `${m[2]}.0`;
    const port = m[3] ? `${m[3].toLowerCase()}/` : '';
    return `https://creativecommons.org/licenses/${kind}/${ver}/${port}`;
  }
  if (/^CC BY-SA$/i.test(l)) return 'https://creativecommons.org/licenses/by-sa/4.0/';
  return undefined;
}

// ---------------------------------------------------------------------------
// Sběr z datových souborů
// ---------------------------------------------------------------------------

// Vite plugin parsuje YAML při buildu → default export je hotový objekt.
// Globy schválně míří jen na soubory, které obrázky opravdu obsahují — ať se
// do bundlu netáhne 3 476 odrůd, které žádnou fotku nemají.
const dataModules = {
  ...import.meta.glob('/src/data/stroje/*.yaml', { eager: true, import: 'default' }),
  ...import.meta.glob('/src/data/stroje/*/*.yaml', { eager: true, import: 'default' }),
  ...import.meta.glob('/src/data/plemena*/*.yaml', { eager: true, import: 'default' }),
  ...import.meta.glob('/src/data/plodiny/*.yaml', { eager: true, import: 'default' }),
  ...import.meta.glob('/src/data/plodiny/*/*.yaml', { eager: true, import: 'default' }),
  ...import.meta.glob('/src/data/vcelarstvi/**/*.yaml', { eager: true, import: 'default' }),
  ...import.meta.glob('/src/data/agro-historie.json', { eager: true, import: 'default' }),
  ...import.meta.glob('/src/data/stroje-photos.json', { eager: true, import: 'default' }),
} as Record<string, unknown>;

const norm = (k: string) => k.toLowerCase().replace(/[^a-z]/g, '');

const IMG_KEY = /^(image|img|photo|foto|heroimage|localpath|thumbnail|cover|picture|src)(url|path|src)?$/;

function pick(node: Record<string, unknown>, test: (k: string) => boolean): string | undefined {
  for (const [k, v] of Object.entries(node)) {
    if (typeof v === 'string' && v.trim() && test(norm(k))) return v.trim();
  }
  return undefined;
}

/**
 * Kredit poskládaný z libovolné varianty pojmenování, kterou datové soubory
 * používají: `image_credit`/`imageCredit`/`hero_author`/`author`, k tomu
 * `*_license`, `*_source_url`/`*_credit_url`/`sourceUrl`.
 */
function creditOf(node: Record<string, unknown>): PhotoCredit | null {
  const nested = Object.entries(node).find(
    ([k, v]) => norm(k).includes('credit') && v && typeof v === 'object' && !Array.isArray(v),
  );
  const src = (nested?.[1] as Record<string, unknown>) ?? node;

  const author =
    pick(src, (k) => /(credit|author|autor|photographer)/.test(k) && !k.includes('url')) ??
    pick(node, (k) => /(credit|author|autor|photographer)/.test(k) && !k.includes('url')) ??
    '';
  const license =
    pick(src, (k) => /licen[sc]e/.test(k) && !k.includes('url')) ??
    pick(node, (k) => /licen[sc]e/.test(k) && !k.includes('url')) ??
    '';
  const source =
    pick(src, (k) => /(source|crediturl|licenceurl|licenseurl|fileurl)/.test(k)) ??
    pick(node, (k) => /(source|crediturl|licenceurl|licenseurl|fileurl)/.test(k)) ??
    undefined;

  if (!author && !license) return null;
  // Autor uvedený jen jako zdroj („Wikimedia Commons", „Own work") atribuci nesplní.
  const cleanAuthor = /^(wikimedia commons|commons|own work|vlastní dílo|unknown)$/i.test(author)
    ? ''
    : author;
  return { author: cleanAuthor, license, licenseUrl: licenseUrlFor(license), source };
}

/**
 * Cesta bez responzivního suffixu `__v-w800` a bez vlastní domény — táž fotka
 * chodí z DB jako absolutní URL a ze šablony jako relativní cesta.
 */
export function canonicalPath(path: string): string {
  return path
    .replace(/^https?:\/\/(?:www\.)?agro-svet\.cz/, '')
    .replace(/__v-w\d+(?=\.[a-zA-Z0-9]+$)/, '')
    .split('?')[0]!;
}

function collect(): Record<string, PhotoCredit> {
  const out: Record<string, PhotoCredit> = {};
  const visit = (node: unknown) => {
    if (Array.isArray(node)) {
      node.forEach(visit);
      return;
    }
    if (!node || typeof node !== 'object') return;
    const rec = node as Record<string, unknown>;
    const imgKey = Object.keys(rec).find(
      (k) => IMG_KEY.test(norm(k)) && typeof rec[k] === 'string' && (rec[k] as string).trim(),
    );
    if (imgKey) {
      const img = (rec[imgKey] as string).trim();
      if (img.startsWith('/') && !img.endsWith('.svg')) {
        const c = creditOf(rec);
        const key = canonicalPath(img);
        // První nález vyhrává; jazykové overlaye nesou tytéž kredity.
        if (c && !out[key]) out[key] = c;
      }
    }
    Object.values(rec).forEach(visit);
  };
  Object.values(dataModules).forEach(visit);
  return out;
}

// ---------------------------------------------------------------------------
// Obrázky mimo datové soubory (natvrdo v šablonách, generované skripty)
// ---------------------------------------------------------------------------

/**
 * Kredity k obrázkům, které nemají záznam v `src/data/**`. Původ je dohledaný
 * z commitů, které je přidaly, a ze skriptů, které je stahovaly
 * (`scripts/druhy-zvirat-photos.mjs`, `scripts/srovnani-photos.mjs`).
 */
/** Dlaždice druhů zvířat — jeden snímek, dva výřezy (square + wide). */
const DRUHY_CREDITS: Record<string, PhotoCredit> = Object.fromEntries(
  (
    [
      ['hovezi', 'Ernst Vikne', 'CC BY-SA 2.0', 'Cow_horned_portrait.jpg'],
      ['ovce', 'stanze from Eure, France, Normandie', 'CC BY-SA 2.0', 'Sheep_portrait_-_Flickr_-_stanzebla.jpg'],
      ['kone', 'Tsaag Valren', 'CC BY-SA 4.0', 'Quarter_Horse_Belle_face.jpg'],
      ['prasata', 'Steve Evans from Citizen of the World', 'CC BY 2.0', 'Iowa_Pig_(7341687640).jpg'],
    ] as const
  ).flatMap(([slug, author, license, file]) => {
    const credit: PhotoCredit = {
      author,
      license,
      source: `https://commons.wikimedia.org/wiki/File:${file}`,
    };
    return [
      [`/images/druhy/${slug}.webp`, credit],
      [`/images/druhy/wide/${slug}.webp`, credit],
    ];
  }),
);

export const EXTRA_CREDITS: Record<string, PhotoCredit> = {
  // Homepage / rozcestníky — ImageAccordion, hero fotky sekcí.
  '/images/telata.webp': {
    author: 'Susanne Nilsson',
    license: 'CC BY-SA 2.0',
    source: 'https://commons.wikimedia.org/wiki/File:2_Calves_in_Denmark_(9515170125).jpg',
  },
  '/images/traktor.webp': { author: '', license: 'Unsplash License', source: 'https://unsplash.com/license' },
  '/images/kombajn.webp': { author: '', license: 'Unsplash License', source: 'https://unsplash.com/license' },
  '/images/stroje.webp': { author: '', license: 'Unsplash License', source: 'https://unsplash.com/license' },
  '/images/bazar.webp': { author: '', license: 'Unsplash License', source: 'https://unsplash.com/license' },

  // /data — hub dlaždice, Unsplash (atribuce se nevyžaduje).
  '/images/data-hub/dotace.webp': { author: '', license: 'Unsplash License', source: 'https://unsplash.com/license' },
  '/images/data-hub/kalkulacka-cap.webp': { author: '', license: 'Unsplash License', source: 'https://unsplash.com/license' },
  '/images/data-hub/profily-zemi.webp': { author: '', license: 'Unsplash License', source: 'https://unsplash.com/license' },
  '/images/data-hub/srovnani-zemi.webp': { author: '', license: 'Unsplash License', source: 'https://unsplash.com/license' },
  '/images/data-hub/trhy-komodity.webp': { author: '', license: 'Unsplash License', source: 'https://unsplash.com/license' },
  '/images/data-hub/zemedelska-puda.webp': { author: '', license: 'Unsplash License', source: 'https://unsplash.com/license' },

  // /novinky — cover fotky článků o 8. kole PRV. US-gov (USDA/NRCS, US Forest
  // Service, NPS, USDA FPAC) → volné dílo, atribuce se nevyžaduje.
  '/images/novinky/dotace-34-73.jpg': { author: '', license: 'Public domain', source: 'https://www.usda.gov/' },
  '/images/novinky/dotace-38-73.jpg': { author: '', license: 'Public domain', source: 'https://www.usda.gov/' },
  '/images/novinky/dotace-39-73.jpg': { author: '', license: 'Public domain', source: 'https://www.usda.gov/' },
  '/images/novinky/dotace-44-73.jpg': { author: '', license: 'Public domain', source: 'https://www.usda.gov/' },
  '/images/novinky/dotace-49-75.jpg': { author: '', license: 'Public domain', source: 'https://www.usda.gov/' },
  '/images/novinky/dotace-prv-8-kolo.webp': { author: '', license: 'Unsplash License', source: 'https://unsplash.com/license' },

  // /chov-hlemyzdu — úvodní fotky článků. Původně hotlink na images.pexels.com;
  // staženo k sobě, protože cizí server ukládal návštěvníkovi cookies Cloudflare
  // ještě před souhlasem. Pexels License atribuci nevyžaduje, zdroj vedeme kvůli
  // dohledatelnosti.
  '/images/hlemyzdi/chov-hlemyzdu-kompletni-pruvodce.webp': { author: '', license: 'Pexels License', licenseUrl: 'https://www.pexels.com/license/', source: 'https://www.pexels.com/photo/3977265/' },
  '/images/hlemyzdi/cim-krmit-hlemyzde.webp': { author: '', license: 'Pexels License', licenseUrl: 'https://www.pexels.com/license/', source: 'https://www.pexels.com/photo/25384646/' },
  '/images/hlemyzdi/clarksonova-farma-hlemyzdi-sliz.webp': { author: '', license: 'Pexels License', licenseUrl: 'https://www.pexels.com/license/', source: 'https://www.pexels.com/photo/17953065/' },
  '/images/hlemyzdi/co-potrebujes-k-chovu-hlemyzdu.webp': { author: '', license: 'Pexels License', licenseUrl: 'https://www.pexels.com/license/', source: 'https://www.pexels.com/photo/8425102/' },
  '/images/hlemyzdi/co-se-z-hlemyzdu-vyrabi.webp': { author: '', license: 'Pexels License', licenseUrl: 'https://www.pexels.com/license/', source: 'https://www.pexels.com/photo/8250714/' },
  '/images/hlemyzdi/ekonomika-chovu-hlemyzdu.webp': { author: '', license: 'Pexels License', licenseUrl: 'https://www.pexels.com/license/', source: 'https://www.pexels.com/photo/35471644/' },
  '/images/hlemyzdi/hlemyzdi-sliz-mucin-jak-vznika.webp': { author: '', license: 'Pexels License', licenseUrl: 'https://www.pexels.com/license/', source: 'https://www.pexels.com/photo/35333031/' },
  '/images/hlemyzdi/jaky-druh-hlemyzde-chovat.webp': { author: '', license: 'Pexels License', licenseUrl: 'https://www.pexels.com/license/', source: 'https://www.pexels.com/photo/34325970/' },
  '/images/hlemyzdi/legislativa-hygiena-chov-hlemyzdu-cr.webp': { author: '', license: 'Pexels License', licenseUrl: 'https://www.pexels.com/license/', source: 'https://www.pexels.com/photo/12674838/' },
  '/images/hlemyzdi/nemoci-predatori-chyby-chov-hlemyzdu.webp': { author: '', license: 'Pexels License', licenseUrl: 'https://www.pexels.com/license/', source: 'https://www.pexels.com/photo/7898266/' },
  '/images/hlemyzdi/sezonnost-zimovani-chov-hlemyzdu.webp': { author: '', license: 'Pexels License', licenseUrl: 'https://www.pexels.com/license/', source: 'https://www.pexels.com/photo/39249/' },
  '/images/hlemyzdi/sneci-farmy-v-cr.webp': { author: '', license: 'Pexels License', licenseUrl: 'https://www.pexels.com/license/', source: 'https://www.pexels.com/photo/34018929/' },
  '/images/hlemyzdi/sneci-kaviar-vajicka-delikatesa.webp': { author: '', license: 'Pexels License', licenseUrl: 'https://www.pexels.com/license/', source: 'https://www.pexels.com/photo/35587616/' },
  '/images/hlemyzdi/sneci-maso-escargot-chov.webp': { author: '', license: 'Pexels License', licenseUrl: 'https://www.pexels.com/license/', source: 'https://www.pexels.com/photo/13189279/' },
  '/images/hlemyzdi/ulity-vedlejsi-produkty-hlemyzdu.webp': { author: '', license: 'Pexels License', licenseUrl: 'https://www.pexels.com/license/', source: 'https://www.pexels.com/photo/7855589/' },
  '/images/hlemyzdi/zivotni-cyklus-rozmnozovani-hlemyzdu.webp': { author: '', license: 'Pexels License', licenseUrl: 'https://www.pexels.com/license/', source: 'https://www.pexels.com/photo/36235066/' },

  // /plemena — dlaždice druhů (scripts/druhy-zvirat-photos.mjs, Wikimedia Commons).
  // Čtvercová i „wide" varianta jsou výřezy z téhož snímku → týž kredit.
  ...DRUHY_CREDITS,

  // /kalkulacka/prevody-jednotek — vizuální srovnání plochy (scripts/srovnani-photos.mjs).
  '/images/srovnani/parkovaci-misto.webp': {
    author: 'Gabriel Picard',
    license: 'CC BY-SA 4.0',
    source: 'https://commons.wikimedia.org/wiki/File:Aerial_view_of_an_empty_car_parking_lot.jpg',
  },
  '/images/srovnani/tenisovy-kurt.webp': {
    author: 'KeepActive Australia from Melbourne, VIC, Australia',
    license: 'CC BY-SA 4.0',
    source:
      'https://commons.wikimedia.org/wiki/File:Empty_clay_tennis_court_in_Melbourne_Australia_looking_down_the_middle.jpg',
  },
  '/images/srovnani/hokejove-kluziste.webp': {
    author: 'Frettie',
    license: 'CC BY-SA 3.0',
    source:
      'https://commons.wikimedia.org/wiki/File:Ice_rink_in_Mann%2BHummel_Arena_T%C5%99eb%C3%AD%C4%8D,_T%C5%99eb%C3%AD%C4%8D_District.jpg',
  },
  '/images/srovnani/fotbalove-hriste.webp': {
    author: 'Stephen Kennard',
    license: 'CC BY-SA 3.0',
    source: 'https://commons.wikimedia.org/wiki/File:Aerial_view_of_the_Chatham_Town_FC_football_pitch.jpg',
  },
  '/images/srovnani/staromestske-nam.webp': {
    author: 'A.Savin',
    license: 'FAL',
    licenseUrl: 'https://artlibre.org/licence/lal/en/',
    source: 'https://commons.wikimedia.org/wiki/File:Prague_07-2016_View_from_Old_Town_Hall_Tower_img3.jpg',
  },
  '/images/srovnani/vaclavske-nam.webp': {
    author: 'Slyronit',
    license: 'CC BY-SA 4.0',
    source: 'https://commons.wikimedia.org/wiki/File:Wenceslas_Square,_Prague.jpg',
  },
  '/images/srovnani/prazsky-hrad.webp': {
    author: 'Dietmar Rabich',
    license: 'CC BY-SA 4.0',
    source: 'https://commons.wikimedia.org/wiki/File:Prag,_Prager_Burg,_Veitsdom_--_2019_--_6690.jpg',
  },

  // /novinky — cover fotky článků. Zdroj pravdy je sloupec
  // `articles.featured_image_credit` (viz `creditFromArticle` níž); tenhle
  // seznam je záložní pro případ, že řádek v databázi kredit nemá.
  // (Dřív tu stálo, že CMS pole pro kredit vůbec nemá — mělo ho 28 z 38
  // publikovaných článků, jen ho web nečetl.)
  'https://cdn.samecdigital.com/rehost-fendt-1050-vario-rekordni-priplatek.webp': {
    author: 'MarcelX42',
    license: 'CC BY-SA 4.0',
    source: 'https://commons.wikimedia.org/wiki/File:Fendt_1050_Vario_Agritechnica_2023_(DSC05113).jpg',
  },
  'https://cdn.samecdigital.com/rehost-john-deere-9rx-dotace-2025.webp': {
    author: 'JDDeutschland',
    license: 'CC BY-SA 4.0',
    source: 'https://commons.wikimedia.org/wiki/File:9RX_830.jpg',
  },
};

/**
 * Fotobanky bez povinné atribuce. CMS pipeline pojmenovává nahrané soubory
 * `<timestamp>-<banka>-<id>__v-w<width>.webp`, takže původ jde poznat z názvu.
 * Bez tohohle by každý nový článek vypadal jako obrázek bez kreditu.
 */
const STOCK_BANKS: [RegExp, string, string][] = [
  [/(^|[-/])unsplash([-.]|$)|unsplash\.com/i, 'Unsplash License', 'https://unsplash.com/license'],
  [/(^|[-/])pexels([-.]|$)|pexels\.com/i, 'Pexels License', 'https://www.pexels.com/license/'],
  [/(^|[-/])pixabay([-.]|$)|pixabay\.com/i, 'Pixabay Content License', 'https://pixabay.com/service/license-summary/'],
];

function stockCreditFor(path: string): PhotoCredit | null {
  const name = path.split('/').pop() ?? '';
  for (const [re, license, url] of STOCK_BANKS) {
    if (re.test(name)) return { author: '', license, licenseUrl: url, source: url };
  }
  return null;
}

/**
 * Loga značek. Dřív byla z kontroly vyjmutá jako „ochranné známky" — jenže
 * ochranná známka neříká nic o autorských právech k tomu souboru a stará sada
 * v `/images/stroje/brands/` byla stažená z webů výrobců bez záznamu o původu.
 * Teď jsou všechna z Commons s doloženou licencí a projdou stejnou rohatkou
 * jako fotky; výjimka žádná není.
 */
const LOGO_CREDITS: Record<string, PhotoCredit> = Object.fromEntries(
  Object.entries(ZNACKA_LOGO).map(([slug, path]) => {
    const l = ZNACKA_LOGO_LICENCE[slug];
    return [canonicalPath(path), { author: l?.author ?? '', license: l?.license ?? '', source: l?.source }];
  }),
);

const DATA_CREDITS = collect();

/**
 * Všechny známé kredity — datové soubory mají přednost před ruční tabulkou.
 * Odkaz na text licence se dopočítá z jejího názvu, ať ho nemusí opisovat
 * každý záznam; ruční `licenseUrl` (např. FAL) má přednost.
 */
export const PHOTO_CREDITS: Record<string, PhotoCredit> = Object.fromEntries(
  Object.entries({ ...EXTRA_CREDITS, ...LOGO_CREDITS, ...DATA_CREDITS }).map(([k, c]) => [
    k,
    { ...c, licenseUrl: c.licenseUrl ?? licenseUrlFor(c.license) },
  ]),
);

/**
 * Název souboru na Commons z libovolného tvaru odkazu. Táž fotka se na webu
 * vyskytuje pod třemi adresami — lokální kopií, rehostem na cdn.samecdigital.com
 * a přímým `upload.wikimedia.org` (tak to má starší kopie DB) — a všechny tři
 * musí trefit tentýž kredit.
 */
export function commonsFileFrom(url: string): string | null {
  const patterns = [
    /\/wiki\/(?:File|Datei|Soubor):(.+)$/,
    /Special:FilePath\/([^?]+)/,
    /upload\.wikimedia\.org\/wikipedia\/commons\/(?:thumb\/)?.\/..\/(.+?)(?:\/\d+px-.*)?$/,
  ];
  for (const re of patterns) {
    const m = url.match(re);
    if (m) return decodeURIComponent(m[1]!.split('?')[0]!).replace(/_/g, ' ');
  }
  return null;
}

/** Sekundární index: název souboru na Commons → kredit. */
const BY_COMMONS_FILE: Record<string, PhotoCredit> = (() => {
  const out: Record<string, PhotoCredit> = {};
  for (const c of Object.values(PHOTO_CREDITS)) {
    if (!c.source) continue;
    const file = commonsFileFrom(c.source);
    if (file && !out[file]) out[file] = c;
  }
  return out;
})();

/** Kredit k jedné cestě (snese responzivní variantu i přímý odkaz na Commons). */
export function creditFor(path: string | null | undefined): PhotoCredit | null {
  if (!path) return null;
  const key = canonicalPath(path);
  const direct = PHOTO_CREDITS[key];
  if (direct) return direct;
  const file = commonsFileFrom(key);
  if (file && BY_COMMONS_FILE[file]) return BY_COMMONS_FILE[file]!;
  return stockCreditFor(key);
}

// ---------------------------------------------------------------------------
// Kredit z databáze článků
// ---------------------------------------------------------------------------

/**
 * Licence fotobanky podle jejího názvu v `articles.featured_image_credit`.
 *
 * Jen banky, které mají JEDNU licenci pro celý katalog. Wikimedia Commons tu
 * schválně není — na Commons má každý soubor licenci vlastní, z názvu „commons"
 * se odvodit nedá a uhodnutá licence je horší než žádná. Takový řádek musí mít
 * `license` vyplněnou přímo.
 */
const PROVIDER_LICENSE: Record<string, { license: string; licenseUrl: string }> = {
  unsplash: { license: 'Unsplash License', licenseUrl: 'https://unsplash.com/license' },
  pexels: { license: 'Pexels License', licenseUrl: 'https://www.pexels.com/license/' },
  pixabay: { license: 'Pixabay Content License', licenseUrl: 'https://pixabay.com/service/license-summary/' },
};

/** Tvar sloupce `articles.featured_image_credit` (jsonb). Starší řádky nesou prostý text. */
export type ArticleImageCredit =
  | string
  | {
      provider?: string | null;
      source_url?: string | null;
      photographer_name?: string | null;
      photographer_url?: string | null;
      /** Název licence u zdrojů, kde ji provider neurčuje (Commons, vlastní snímky). */
      license?: string | null;
    }
  | null
  | undefined;

/**
 * Kredit ke cover fotce článku ze sloupce `articles.featured_image_credit`.
 *
 * ‼️ Tenhle sloupec je zdroj pravdy — CMS ho plní při výběru fotky z banky
 * a nese jméno fotografa (28 z 38 publikovaných článků). Web ho do 9/2026
 * vůbec nečetl a spoléhal se jen na `stockCreditFor()`, který licenci HÁDÁ
 * z názvu souboru („…-pexels-30685678__v-w1600.webp"). Hádání zůstává jako
 * fallback pro starší soubory, ale vyplněný sloupec má vždycky přednost —
 * jméno fotografa se z názvu souboru dozvědět nedá.
 *
 * Prostý text (dva staré řádky „Foto: Pexels") se bere jako název zdroje bez
 * autora; licenci k němu dohledá `PROVIDER_LICENSE` podle názvu banky.
 */
export function creditFromArticle(
  credit: ArticleImageCredit,
  imageUrl?: string | null,
): PhotoCredit | null {
  const fallback = () => creditFor(imageUrl);

  if (typeof credit === 'string') {
    const text = credit.trim();
    if (!text) return fallback();
    const provider = Object.keys(PROVIDER_LICENSE).find((p) => new RegExp(`\\b${p}\\b`, 'i').test(text));
    // „Foto: Pexels" není jméno fotografa, jen banka — autor zůstane prázdný,
    // ať se do kreditu nedostane zdroj vydávaný za autora.
    if (provider) return { author: '', ...PROVIDER_LICENSE[provider]! };
    return fallback();
  }

  if (credit && typeof credit === 'object') {
    const provider = (credit.provider ?? '').toLowerCase();
    const known = PROVIDER_LICENSE[provider];
    const explicit = (credit.license ?? '').trim();
    const license = explicit || known?.license || '';
    const author = (credit.photographer_name ?? '').trim();
    const source = (credit.source_url ?? '').trim() || undefined;
    // Samotný odkaz na zdroj kredit není („Wikimedia Commons" byla přesně ta
    // vada, za kterou přišla výzva). Bez licence i bez autora se padá zpátky
    // na registr, ať z toho nevznikne prázdná plaketka.
    if (license || author) {
      return {
        author,
        license,
        licenseUrl: explicit ? licenseUrlFor(explicit) : known?.licenseUrl,
        source,
      };
    }
  }

  return fallback();
}

/**
 * Kredity pro seznam obrázků — deduplikované podle (autor, licence, zdroj),
 * v pořadí prvního výskytu. Licence bez povinné atribuce se do bloku
 * nevypisují: u Unsplash/Pexels/volného díla nemá co splňovat.
 */
export function creditsFor(paths: (string | PhotoCredit | null | undefined)[]): PhotoCredit[] {
  const seen = new Set<string>();
  const out: PhotoCredit[] = [];
  for (const p of paths) {
    // Hotový kredit (z databáze) se nedohledává znovu podle cesty k souboru.
    const c = typeof p === 'object' && p !== null ? p : creditFor(p);
    if (!c || !requiresAuthor(c.license)) continue;
    const key = `${c.author}|${c.license}|${c.source ?? ''}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(c);
  }
  return out;
}
