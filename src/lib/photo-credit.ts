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
const NO_ATTRIBUTION = /^(public domain|cc0|volné dílo|unsplash|pexels|pixabay|synthetic|vlastní grafika)/i;

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

// ---------------------------------------------------------------------------
// „Public domain" — proč a kde
// ---------------------------------------------------------------------------

/**
 * Štítek „Public domain" na Wikimedia Commons je tvrzení o právním stavu
 * v zemi původu a v USA. Do ČR se převzít nedá — italská fotka volná po
 * 20 letech je u nás pořád chráněná. Doložitelné je jen to, co ke štítku
 * dodá KONKRÉTNÍ důvod a jurisdikci; proto tahle tabulka a rohatka nad ní.
 *
 * Kategorie, které 23. 9. 2026 na webu zůstaly. Všechno ostatní odešlo:
 *   • PD-US-expired a PD-USGov-USDA — volné v USA, v ČR neprokázané,
 *   • zdroj bez konkrétního souboru („https://www.usda.gov/"),
 *   • „Author assumed" — Commons si autorem sám není jistý.
 */
export interface PdDuvod {
  /** Šablona na Commons, ze které volnost plyne. */
  sablona: string;
  /** Proč je dílo volné — česky, ať to unese i právník. */
  duvod: string;
  /** Kde tenhle důvod platí. */
  jurisdikce: string;
}

const PD_LOGO: PdDuvod = {
  sablona: 'PD-textlogo / PD-shape',
  duvod:
    'Logo tvoří jen text v běžném písmu a jednoduché geometrické tvary. Není to jedinečný ' +
    'výsledek tvůrčí činnosti autora (§ 2 odst. 1 autorského zákona), autorské právo tedy ' +
    'nevzniklo. Ochranná známka zůstává v platnosti — logo užíváme k označení výrobce ' +
    'a jeho strojů, což dovoluje § 10 odst. 3 zák. č. 441/2003 Sb.',
  jurisdikce: 'celosvětově — autorské dílo nevzniklo',
};

const PD_AUTOR: PdDuvod = {
  sablona: 'PD-self / PD-user / PD-author / PD-PDphoto.org',
  duvod:
    'Autor snímek sám uvolnil do volného díla. Šablona obsahuje i podpůrné svolení pro ' +
    'právní řády, které úplné vzdání se majetkových práv neumožňují (mj. ČR) — tam se ' +
    'prohlášení čte jako bezúplatná licence k jakémukoli užití.',
  jurisdikce: 'celosvětově — prohlášení autora',
};

const PD_LHUTA: PdDuvod = {
  sablona: 'PD-old / PD-scan / PD-Art',
  duvod:
    'Botanické tabule z let 1793–1897. Autoři předloh zemřeli před více než 70 lety ' +
    '(O. W. Thomé † 1925, F. E. Köhler † 1904, A. Masclef † 1911, W. Woodville † 1805), ' +
    'majetková práva tedy zanikla podle § 27 autorského zákona. Věrný sken dvourozměrné ' +
    'předlohy nezakládá nová práva.',
  jurisdikce: 'ČR a EU — § 27 autorského zákona, 70 let po smrti autora',
};

/** Cesta k obrázku → důvod, proč je volný. Klíče jsou bez varianty `__v-w800`. */
export const PD_DUVODY: Record<string, PdDuvod> = {

  // Loga výrobců: 18 × šablona PD-textlogo / PD-shape.
  '/images/znacky/amazone.png': PD_LOGO, // PD-textlogo
  '/images/znacky/case-ih.png': PD_LOGO, // PD-textlogo
  '/images/znacky/claas.svg': PD_LOGO, // PD-textlogo
  '/images/znacky/deutz-fahr.svg': PD_LOGO, // PD-textlogo
  '/images/znacky/fendt.svg': PD_LOGO, // PD-textlogo
  '/images/znacky/horsch.svg': PD_LOGO, // PD-textlogo
  '/images/znacky/jcb.svg': PD_LOGO, // PD-textlogo
  '/images/znacky/john-deere.png': PD_LOGO, // PD-textlogo
  '/images/znacky/krone.svg': PD_LOGO, // PD-textlogo
  '/images/znacky/kubota.svg': PD_LOGO, // PD-textlogo
  '/images/znacky/kuhn.svg': PD_LOGO, // PD-textlogo
  '/images/znacky/kverneland.svg': PD_LOGO, // PD-shape
  '/images/znacky/manitou.svg': PD_LOGO, // PD-textlogo
  '/images/znacky/new-holland.png': PD_LOGO, // PD-textlogo
  '/images/znacky/pottinger.svg': PD_LOGO, // PD-textlogo
  '/images/znacky/vaderstad.svg': PD_LOGO, // PD-textlogo
  '/images/znacky/valtra.png': PD_LOGO, // PD-textlogo
  '/images/znacky/zetor.png': PD_LOGO, // pd-textlogo

  // Uvolnil sám autor: 21 × šablona PD-self / PD-user / PD-author / PD-PDphoto.org.
  '/images/historie/zetor-3011.jpg': PD_AUTOR, // PD-self
  '/images/historie/zetor-50-super.jpg': PD_AUTOR, // PD-self
  '/images/plemena/kone/arab.webp': PD_AUTOR, // PD-author-FlickrPDM
  '/images/plemena/kone/ardenny.webp': PD_AUTOR, // PD-self
  '/images/plemena/kone/fjordsky-kun.webp': PD_AUTOR, // PD-user-w
  '/images/plemena/ovce/charollais.webp': PD_AUTOR, // PD-self
  '/images/plodiny/kapusta.jpg': PD_AUTOR, // PD-self
  '/images/plodiny/rajce.jpg': PD_AUTOR, // PD-self
  '/images/plodiny/redkvicka.jpg': PD_AUTOR, // PD-self
  '/images/plodiny/slunecnice.jpg': PD_AUTOR, // PD-PDphoto.org
  '/images/plodiny/tykev.jpg': PD_AUTOR, // PD-self
  '/images/stroje/amazone/amazone-ux.webp': PD_AUTOR, // self
  '/images/stroje/claas/claas-ares.jpg': PD_AUTOR, // PD-author
  '/images/stroje/joskin/joskin-komfort-2.webp': PD_AUTOR, // self
  '/images/stroje/kubota/kubota-dc-105k.webp': PD_AUTOR, // PD-self
  '/images/stroje/valtra/valtra-t-gen1.jpg': PD_AUTOR, // PD-self
  '/images/stroje/zetor/zetor-forterra.jpg': PD_AUTOR, // PD-user
  '/images/stroje/zetor/zetor-proxima-gen1.jpg': PD_AUTOR, // PD-self
  '/images/vcelarstvi/vybaveni/langstroth.webp': PD_AUTOR, // PD-user-he
  '/images/vcelarstvi/vybaveni/mezistena.webp': PD_AUTOR, // PD-user-en
  '/images/vcelarstvi/vybaveni/vcelarsky-oblek.webp': PD_AUTOR, // PD-self

  // Uplynulá doba ochrany: 15 × šablona PD-old / PD-scan / PD-Art (botanické tabule 1793–1897).
  '/images/plodiny/bob-zahradni.jpg': PD_LHUTA, // PD-old
  '/images/plodiny/celer.jpg': PD_LHUTA, // PD-scan
  '/images/plodiny/cesnek.jpg': PD_LHUTA, // PD-Art
  '/images/plodiny/cukrovka.jpg': PD_LHUTA, // PD-Art
  '/images/plodiny/hrach.jpg': PD_LHUTA, // PD-scan
  '/images/plodiny/kukurice.jpg': PD_LHUTA, // PD-old
  '/images/plodiny/mak.jpg': PD_LHUTA, // PD-scan
  '/images/plodiny/mrkev.jpg': PD_LHUTA, // PD-scan + GFDL
  '/images/plodiny/okurka.jpg': PD_LHUTA, // PD-scan
  '/images/plodiny/oves.jpg': PD_LHUTA, // PD-scan
  '/images/plodiny/psenice-jarni.jpg': PD_LHUTA, // PD-scan
  '/images/plodiny/psenice-ozima.jpg': PD_LHUTA, // PD-scan
  '/images/plodiny/repka-jarni.jpg': PD_LHUTA, // PD-old
  '/images/plodiny/repka-ozima.jpg': PD_LHUTA, // PD-old
  '/images/plodiny/vojteska.jpg': PD_LHUTA, // PD-Art
};

/** Vrátí doložený důvod volnosti, nebo null (= štítek „Public domain" bez opory). */
export function pdDuvodFor(path: string | null | undefined): PdDuvod | null {
  if (!path) return null;
  return PD_DUVODY[canonicalPath(path)] ?? null;
}

/** Je licence pouhý štítek „volné dílo" bez uvedení konkrétního důvodu? */
export function jePouhePd(license: string | undefined | null): boolean {
  return /^(public domain|volné dílo|pd)$/i.test((license ?? '').trim());
}

/**
 * Zástupný obrázek s logem webu. Leží tam, kde původní fotka odešla kvůli
 * nedoloženému oprávnění, ale cesta musela zůstat (hero článku drží CMS).
 */
export const ZASTUPNY: PhotoCredit = {
  author: 'agro-svet.cz',
  license: 'Vlastní grafika',
  source: '',
};

export const EXTRA_CREDITS: Record<string, PhotoCredit> = {
  // Homepage / rozcestníky — ImageAccordion, hero fotky sekcí.
  '/images/telata.webp': {
    author: 'Susanne Nilsson',
    license: 'CC BY-SA 2.0',
    source: 'https://commons.wikimedia.org/wiki/File:2_Calves_in_Denmark_(9515170125).jpg',
  },
  // Dlaždice ImageAccordionu a hubu /data. Do 23. 9. 2026 se vedly jako
  // „Unsplash License" se zdrojem na stránku licence — tedy bez údaje, KTERÁ
  // fotka to je. Historie repa přitom pamatovala tři konkrétní hotlinky na
  // images.unsplash.com; po stažení originálů a porovnání otisků vyšlo najevo,
  // že lokální soubory jsou JINÉ snímky (traktor: u nás Fendt na strništi,
  // na Unsplash rýžové pole v Indii, odchylka 36/64). Štítek nedokládal nic.
  //
  // Všechny nahrazeny ověřenými snímky z Commons — každý před nasazením
  // vizuálně zkontrolovaný, licence jen CC0 / CC BY / CC BY-SA s verzí.
  // Kde se nic vhodného nenašlo, zůstává ZASTUPNY (logo webu):
  //   /images/stroje.webp            — jen záložní OG kartička, logo stačí
  //   /images/novinky/dotace-49-75   — u „mladého zemědělce" byli všichni
  //                                    kandidáti identifikovatelní lidé
  '/images/traktor.webp': {
    author: 'Petar Milošević',
    license: 'CC BY-SA 4.0',
    source: 'https://commons.wikimedia.org/wiki/File:Tractor_New_Holland_T6.165_plowing_(Zadobrova,_Ljubljana).jpg',
  },
  '/images/kombajn.webp': {
    author: 'Graham Robson',
    license: 'CC BY-SA 2.0',
    source: 'https://commons.wikimedia.org/wiki/File:Harvesting_wheat_at_New_Barns_-_geograph.org.uk_-_4682011.jpg',
  },
  '/images/stroje.webp': ZASTUPNY,
  '/images/data-hub/dotace.webp': {
    author: 'Ksheera Piraati',
    license: 'CC BY 4.0',
    source: 'https://commons.wikimedia.org/wiki/File:Young_seedling_of_tomato_emerging_from_soil_-_India.jpg',
  },
  '/images/data-hub/kalkulacka-cap.webp': {
    author: 'Dietmar Rabich',
    license: 'CC BY-SA 4.0',
    source: 'https://commons.wikimedia.org/wiki/File:D%C3%BClmen,_Kirchspiel,_Dernekamp,_Getreide_bei_Sonnenaufgang_--_2021_--_8812.jpg',
  },
  '/images/data-hub/profily-zemi.webp': {
    author: 'Roman Eisele',
    license: 'CC BY-SA 4.0',
    source: 'https://commons.wikimedia.org/wiki/File:Neckargerach_-_Mittelberg_-_Westhang_an_Oktoberabend.jpg',
  },
  '/images/data-hub/srovnani-zemi.webp': {
    author: 'Trevor Littlewood',
    license: 'CC BY-SA 2.0',
    source: 'https://commons.wikimedia.org/wiki/File:Hedge_dividing_two_fields_-_geograph.org.uk_-_5925522.jpg',
  },
  '/images/data-hub/trhy-komodity.webp': {
    author: 'Brieuc Daniel',
    license: 'CC BY-SA 3.0',
    source: 'https://commons.wikimedia.org/wiki/File:Golden_Summer_(76909415).jpeg',
  },
  '/images/data-hub/zemedelska-puda.webp': {
    author: 'Dietmar Rabich',
    license: 'CC BY-SA 4.0',
    source: 'https://commons.wikimedia.org/wiki/File:Dorsten,_Lembeck,_Felder_--_2026_--_0372.jpg',
  },
  // /novinky — cover fotky článků o 8. kole PRV. Dřív tu ležely snímky
  // označené „Public domain" se zdrojem `https://www.usda.gov/` — tedy odkazem
  // na titulní stranu úřadu, ne na konkrétní soubor. Bez čísla snímku a bez
  // licenční stránky se původ nedal doložit, takže fotky 23. 9. 2026 odešly
  // a na jejich cestách teď leží zástupný obrázek s logem
  // (`scripts/make-zastupny-obrazek.mjs`). Cesta zůstala, protože hero článku
  // je uložené v CMS.
  '/images/novinky/dotace-34-73.jpg': {
    author: 'U.S. Department of Agriculture',
    license: 'CC BY 2.0',
    source: 'https://commons.wikimedia.org/wiki/File:The_processing_plant_at_Lakota_Foods_(15690553980).jpg',
  },
  '/images/novinky/dotace-38-73.jpg': {
    author: 'UuMUfQ',
    license: 'CC BY-SA 4.0',
    source: 'https://commons.wikimedia.org/wiki/File:Wartenberg_Angersbach_Clearcut_Area_Bark_Beetle_Cleanup_2022.png',
  },
  '/images/novinky/dotace-39-73.jpg': {
    author: 'ZO CSOP Vlasim',
    license: 'CC BY-SA 3.0',
    source: 'https://commons.wikimedia.org/wiki/File:P%C3%A9%C4%8De_o_nelesn%C3%AD_zele%C5%88.JPG',
  },
  '/images/novinky/dotace-44-73.jpg': {
    author: 'Radosław Botev',
    license: 'CC BY-SA 4.0',
    source: 'https://commons.wikimedia.org/wiki/File:Low_Tatras_-_forests_(1).jpg',
  },
  '/images/novinky/dotace-49-75.jpg': ZASTUPNY,
  '/images/novinky/dotace-prv-8-kolo.webp': {
    author: 'Dietmar Rabich',
    license: 'CC BY-SA 4.0',
    source: 'https://commons.wikimedia.org/wiki/File:D%C3%BClmen,_Kirchspiel,_B%C3%B6rnste,_Feldweg_--_2017_--_3180-6.jpg',
  },
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

/**
 * Odkaz na KONKRÉTNÍ fotku vytěžený z názvu souboru. Samotné „Pexels License"
 * se zdrojem na stránku licence neříká, která fotka to je — a 23. 9. 2026 se
 * u tří snímků ukázalo, že štítek fotobanky nemusí sedět vůbec. ID naštěstí
 * v názvu je, tak z něj odkaz postavíme.
 *
 *   1777040807501-pexels-18838679.webp          → pexels.com/photo/18838679/
 *   1777140968908-unsplash-QvkAQTNj4zk.webp     → unsplash.com/photos/QvkAQTNj4zk
 *   1777057259380-drone-eft-75HRJ8os80k-unsplash.webp → tentýž tvar, jen zezadu
 *   1777041233333-pixabay-2638559.webp          → pixabay.com/images/id-2638559/
 */
function stockSourceFrom(name: string): string | null {
  const bez = name.replace(/__v-w\d+(?=\.[a-z0-9]+$)/i, '').replace(/\.[a-z0-9]+$/i, '');
  let m = /(?:^|-)pexels-(\d{3,})(?:-|$)/i.exec(bez);
  if (m) return `https://www.pexels.com/photo/${m[1]}/`;
  m = /(?:^|-)pixabay-(\d{3,})(?:-|$)/i.exec(bez);
  if (m) return `https://pixabay.com/images/id-${m[1]}/`;
  // ID na Unsplash má 11 znaků a smí obsahovat „-", takže délku fixujeme —
  // jinak by se do něj u názvu „drone-eft-75HRJ8os80k-unsplash" nacpal i slug.
  m = /(?:^|-)unsplash-([A-Za-z0-9_-]{11})(?:-|$)/.exec(bez) ?? /-([A-Za-z0-9_-]{11})-unsplash(?:-|$)/.exec(bez);
  if (m) return `https://unsplash.com/photos/${m[1]}`;
  return null;
}

function stockCreditFor(path: string): PhotoCredit | null {
  const name = path.split('/').pop() ?? '';
  for (const [re, license, url] of STOCK_BANKS) {
    if (!re.test(name)) continue;
    // Zdroj = konkrétní fotka, když ji z názvu poznáme; jinak aspoň text licence.
    return { author: '', license, licenseUrl: url, source: stockSourceFrom(name) ?? url };
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
