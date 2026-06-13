import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const novinky = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/novinky' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishDate: z.date(),
    category: z.enum(['technika', 'dotace', 'trh', 'legislativa', 'znacky']),
    tags: z.array(z.string()),
    znacka: z.string().optional(),
    model: z.string().optional(),
    heroImage: z.string().optional(),
    featured: z.boolean().default(false),
  }),
});

const encyklopedieSchema = () =>
  z.object({
    name: z.string(),
    slug: z.string(),
    znacka: z.string(),
    kategorie: z.enum(['traktor', 'kombajn', 'stroj', 'puda-technika']),
    // Display strings (UI), kept for backwards compatibility.
    vykon: z.string(),
    hmotnost: z.string(),
    rok_uvedeni: z.number(),
    popis: z.string(),
    heroImage: z.string().optional(),
    highlights: z.array(z.string()),
    // Structured numeric fields — feed Vehicle JSON-LD when present.
    powerHp: z.number().optional(),
    powerKw: z.number().optional(),
    weightKg: z.number().optional(),
    yearTo: z.number().optional(),
    engine: z.string().optional(),
    transmission: z.string().optional(),
    seriesName: z.string().optional(),
    // FAQ — generates FAQPage JSON-LD + on-page Q&A section.
    faq: z.array(z.object({ q: z.string(), a: z.string() })).optional(),
    // Editorial trust signals.
    lastVerified: z.date().optional(),
    sourceUrl: z.string().optional(),
    // Volitelný YouTube embed — feeduje VideoObject JSON-LD + lazy facade na detailu.
    youtubeId: z.string().optional(),
    youtubeTitle: z.string().optional(),
    // Volitelná redakční recenze — feeduje Review JSON-LD + on-page verdict card.
    // Plnit jen u modelů, které redakce skutečně posoudila. Mimo CMS prozatím
    // ručně z odborné rešerše, ne user-generated.
    recenze: z.object({
      hodnoceni: z.number().min(1).max(5),
      verdikt: z.string(),
      plusy: z.array(z.string()).optional(),
      minusy: z.array(z.string()).optional(),
      datum: z.date().optional(),
    }).optional(),
  });

const encyklopedie = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/encyklopedie' }),
  schema: encyklopedieSchema(),
});

// SK-localizovaná overlay kolekce encyklopedie (slug = REUSE cs slug). Držené
// zvlášť, aby cs-facing getCollection('encyklopedie') zůstalo nedotčené.
const encyklopedieSk = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/encyklopedie-sk' }),
  schema: encyklopedieSchema(),
});

// UK-localizovaná overlay kolekce encyklopedie (slug = REUSE cs slug).
const encyklopedieUk = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/encyklopedie-uk' }),
  schema: encyklopedieSchema(),
});

const znackySchema = () =>
  z.object({
    name: z.string(),
    slug: z.string(),
    logo: z.string().optional(),
    zeme: z.string(),
    zalozena: z.number(),
    popis: z.string(),
    website: z.string().optional(),
    kategorie: z.array(z.string()),
    /** Wikipedia article URL (cs preferred). Used in JSON-LD sameAs. */
    wikipedia: z.string().optional(),
    /** Wikidata entity URL (Qxxxxx). Knowledge graph anchor. */
    wikidata: z.string().optional(),
    /** Datum poslední redakční revize obsahu (E-E-A-T signál). */
    aktualizovano: z.date().optional(),
    /** Zakladatel — feeduje schema.org Organization.founder (Person). */
    founder: z.object({
      name: z.string(),
      birth: z.string().optional(),
      death: z.string().optional(),
      note: z.string().optional(),
    }).optional(),
    /** Vizuální časová osa značky (rok + událost). Render jako vertical timeline. */
    timeline: z.array(z.object({
      year: z.number(),
      label: z.string(),
      detail: z.string().optional(),
    })).optional(),
    /** Snapshot stat-karty (aktuální klíčové ukazatele). */
    snapshot: z.array(z.object({
      label: z.string(),
      value: z.string(),
    })).optional(),
    /** Finanční ukazatele po fiskálních letech — render jako tabulka. */
    financials: z.array(z.object({
      year: z.number(),
      revenue: z.string().optional(),
      netIncome: z.string().optional(),
      note: z.string().optional(),
    })).optional(),
    /** Citované zdroje (jako reference na Wikipedii). */
    sources: z.array(z.object({
      title: z.string(),
      url: z.string(),
    })).optional(),
  });

const znacky = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/znacky' }),
  schema: znackySchema(),
});

// SK-localized brand profiles (overlay collection — kept separate so cs-facing
// getCollection('znacky') listings/sitemap/llms stay untouched).
const znackySk = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/znacky-sk' }),
  schema: znackySchema(),
});

// UK-localized brand profiles (overlay collection).
const znackyUk = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/znacky-uk' }),
  schema: znackySchema(),
});

const pudaSchema = () =>
  z.object({
    title: z.string(),
    popis: z.string(),
  });

const puda = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/puda' }),
  schema: pudaSchema(),
});

// SK-localized článková kolekce o pôde (overlay). Držené zvlášť, aby cs-facing
// getCollection('puda') zůstalo nedotčené. Slug = REUSE cs slug.
const pudaSk = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/puda-sk' }),
  schema: pudaSchema(),
});

// SZIF dotační tituly — evergreen průvodci. Žádná automatizace: SZIF nemá API,
// cyklus výzev je pomalý (2× ročně), takže ruční revize 2-4× ročně stačí.
const dotaceSchema = () =>
  z.object({
    name: z.string(),
    slug: z.string(),
    /** Intervence kód SP SZP 2023-2027, např. "33.73". */
    intervence: z.string(),
    popis: z.string(),
    /** % dotace pro rostlinnou výrobu. */
    procentoRostlinna: z.number().optional(),
    /** % dotace pro živočišnou výrobu. */
    procentoZivocisna: z.number().optional(),
    /** Maximální výše dotace na projekt (Kč / €). */
    stropDotace: z.number().optional(),
    /** Minimální způsobilé výdaje (Kč / €). */
    minVydaje: z.number().optional(),
    /** Kdo může žádat. */
    zadatel: z.string(),
    /** True = výdaje na mobilní stroje max 49 % způsobilých výdajů. */
    strojeMax49: z.boolean().default(false),
    /** Odkaz na primární zdroj (Pravidla SZIF / MZe / PPA). */
    primarniZdroj: z.string(),
    aktualizovano: z.date(),
    highlights: z.array(z.string()),
    faq: z.array(z.object({ q: z.string(), a: z.string() })).optional(),
    /** Per-titul cílené cross-linky (stroje/howto/srovnání). První = primární. */
    relatedLinks: z
      .array(z.object({ href: z.string(), label: z.string() }))
      .optional(),
  });

const dotace = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/dotace' }),
  schema: dotaceSchema(),
});

// SK-localized dotační tituly (overlay collection — PPA SR výzvy).
// Držené zvlášť, aby cs-facing getCollection('dotace') zůstalo nedotčené.
const dotaceSk = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/dotace-sk' }),
  schema: dotaceSchema(),
});

// HowTo průvodci — krok-za-krokem návody pro AI Overviews a voice search.
// Strukturované kroky ve frontmatteru feedují HowTo JSON-LD i on-page seznam.
const howtoSchema = () =>
  z.object({
    title: z.string(),
    slug: z.string(),
    description: z.string(),
    heroImage: z.string().optional(),
    datePublished: z.date(),
    lastVerified: z.date().optional(),
    /** ISO 8601 duration, např. "PT30M", "PT2H". Feeduje HowTo.totalTime. */
    totalTime: z.string().optional(),
    /** Volné textové vyjádření náročnosti — zobrazeno v UI. */
    obtiznost: z.string().optional(),
    /** Nářadí potřebné k provedení. */
    tools: z.array(z.string()).optional(),
    /** Spotřební materiál. */
    supplies: z.array(z.string()).optional(),
    steps: z.array(z.object({ name: z.string(), text: z.string() })),
    faq: z.array(z.object({ q: z.string(), a: z.string() })).optional(),
    /** Volitelný odkaz na související hub (např. /kalkulacka/, /dotace/). */
    relatedUrl: z.string().optional(),
    relatedLabel: z.string().optional(),
  });

const howto = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/howto' }),
  schema: howtoSchema(),
});

// SK-localizovaná overlay kolekce howto (slug = REUSE cs slug). Držené zvlášť,
// aby cs-facing getCollection('howto') zůstalo nedotčené. Chybějící sk slug
// pod /sk = 404 (žádný cs leak).
const howtoSk = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/howto-sk' }),
  schema: howtoSchema(),
});

// UK-localizovaná overlay kolekce howto (slug = REUSE cs slug). Chybějící uk
// slug pod /uk = 404 (žádný cs leak). 2 jurisdikční návody (registrace-vcelaru,
// jak-naplanovat-dotaci-na-techniku) záměrně NEpřeloženy → UK jurisdikční fáze.
const howtoUk = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/howto-uk' }),
  schema: howtoSchema(),
});

export const collections = { novinky, encyklopedie, encyklopedieSk, encyklopedieUk, znacky, znackySk, znackyUk, puda, pudaSk, dotace, dotaceSk, howto, howtoSk, howtoUk };
