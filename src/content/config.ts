import { defineCollection, z } from 'astro:content';

const novinky = defineCollection({
  type: 'content',
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
  type: 'content',
  schema: z.object({
    name: z.string(),
    slug: z.string(),
    znacka: z.string(),
    kategorie: z.enum(['traktor', 'kombajn', 'stroj', 'puda-technika']),
    vykon: z.string(),
    hmotnost: z.string(),
    rok_uvedeni: z.number(),
    popis: z.string(),
    heroImage: z.string().optional(),
    highlights: z.array(z.string()),
  }),
});

const znacky = defineCollection({
  type: 'content',
  schema: z.object({
    name: z.string(),
    slug: z.string(),
    logo: z.string().optional(),
    zeme: z.string(),
    zalozena: z.number(),
    popis: z.string(),
    website: z.string().optional(),
    kategorie: z.array(z.string()),
  }),
});

const puda = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    popis: z.string(),
  }),
});

export const collections = { novinky, encyklopedie, znacky, puda };
