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

const encyklopedie = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/encyklopedie' }),
  schema: z.object({
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
  }),
});

const znacky = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/znacky' }),
  schema: z.object({
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
  }),
});

const puda = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/puda' }),
  schema: z.object({
    title: z.string(),
    popis: z.string(),
  }),
});

export const collections = { novinky, encyklopedie, znacky, puda };
