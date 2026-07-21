import { CATEGORIES, BRANDS } from './bazar-constants';

/** Strukturovaná data inzerátu vytažená AI (OpenAI) z Bazoš textu. */
export interface StructuredListing {
  title: string;
  description: string;
  brand: string | null; // slug z BRANDS nebo null
  category: string; // slug z CATEGORIES
  type: string | null; // model/typ (volný text, např. "6210R")
  year: number | null; // rok výroby
  hours: number | null; // motohodiny
  powerHp: number | null; // výkon v koních
  features: string[]; // klíčová výbava
}

/** Funkce, která pošle prompt do LLM a vrátí textovou odpověď. Injektovatelné kvůli testům. */
export type LlmClient = (prompt: string) => Promise<string>;

const MODEL = 'gpt-4o-mini';
const BRAND_SLUGS: string[] = BRANDS.map((b) => b.value).filter((v) => v !== 'jina');
const CATEGORY_SLUGS: string[] = CATEGORIES.map((c) => c.value);

export function buildStructurePrompt(title: string, description: string): string {
  return [
    'Jsi asistent pro český zemědělský inzertní portál. Z inzerátu vytáhni strukturovaná',
    'data a přepiš text. Vrať POUZE validní JSON objekt, nic jiného.',
    '',
    'Pravidla:',
    `- "brand": přesně jeden slug z tohoto seznamu: ${BRAND_SLUGS.join(', ')}. Když značku nelze určit, null.`,
    `- "category": přesně jeden slug z: ${CATEGORY_SLUGS.join(', ')}. Vyber nejbližší.`,
    '- "type": model/typ stroje (např. "6210R"), jinak null.',
    '- "year": rok výroby jako číslo. NEHÁDEJ — jen když je uveden nebo jasně odvoditelný, jinak null.',
    '- "hours": motohodiny jako číslo (např. z "8251 mth"), jinak null.',
    '- "powerHp": výkon v koních jako číslo. Když není uveden, smíš ho ODVODIT z modelu (např. John Deere 6210R ≈ 210, Zetor 7211 ≈ 72). Jinak null.',
    '- "features": pole krátkých řetězců s klíčovou výbavou, max 10 položek.',
    '- "title": stručný výstižný SEO titulek (zachovej značku i model).',
    '- "description": čtivý, originální, SEO-laděný popis v češtině. Zachovej VŠECHNA fakta, nic si nevymýšlej.',
    '',
    'Formát: {"title","description","brand","category","type","year","hours","powerHp","features"}',
    '',
    `Původní titulek: ${title}`,
    `Původní popis: ${description}`,
  ].join('\n');
}

export function parseStructureResponse(raw: string): Record<string, unknown> | null {
  const m = raw.match(/\{[\s\S]*\}/);
  if (!m) return null;
  try {
    const o = JSON.parse(m[0]);
    return typeof o === 'object' && o !== null ? (o as Record<string, unknown>) : null;
  } catch {
    return null;
  }
}

function coerceNum(v: unknown): number | null {
  if (typeof v === 'number' && Number.isFinite(v)) return v;
  if (typeof v === 'string') {
    const n = parseInt(v.replace(/[^\d]/g, ''), 10);
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

/** Default LLM klient — OpenAI Chat Completions přes fetch (žádná SDK závislost). */
async function openaiClient(apiKey: string, prompt: string): Promise<string> {
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'content-type': 'application/json', authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      model: MODEL,
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
      temperature: 0.3,
    }),
  });
  if (!res.ok) throw new Error(`OpenAI API ${res.status}`);
  const data = await res.json();
  return data?.choices?.[0]?.message?.content ?? '';
}

/**
 * Vytáhne strukturovaná data přes AI. Bez apiKey (nebo při chybě) vrací `fallback`
 * (deterministická značka/kategorie/motohodiny) + původní text.
 */
export async function structureListing(opts: {
  title: string;
  description: string;
  apiKey: string;
  fallback: { brand: string | null; category: string; hours: number | null };
  llm?: LlmClient;
}): Promise<StructuredListing> {
  const base: StructuredListing = {
    title: opts.title,
    description: opts.description,
    brand: opts.fallback.brand,
    category: opts.fallback.category,
    type: null,
    year: null,
    hours: opts.fallback.hours,
    powerHp: null,
    features: [],
  };
  if (!opts.apiKey) return base;
  const llm = opts.llm ?? ((p: string) => openaiClient(opts.apiKey, p));
  try {
    const o = parseStructureResponse(await llm(buildStructurePrompt(opts.title, opts.description)));
    if (!o) return base;
    const brand = typeof o.brand === 'string' && BRAND_SLUGS.includes(o.brand) ? o.brand : base.brand;
    const category = typeof o.category === 'string' && CATEGORY_SLUGS.includes(o.category) ? o.category : base.category;
    return {
      title: typeof o.title === 'string' && o.title.trim() ? o.title.trim() : base.title,
      description:
        typeof o.description === 'string' && o.description.trim() ? o.description.trim() : base.description,
      brand,
      category,
      type: typeof o.type === 'string' && o.type.trim() ? o.type.trim() : null,
      year: coerceNum(o.year),
      hours: coerceNum(o.hours) ?? base.hours,
      powerHp: coerceNum(o.powerHp),
      features: Array.isArray(o.features)
        ? o.features.filter((f): f is string => typeof f === 'string' && f.trim().length > 0).slice(0, 10)
        : [],
    };
  } catch {
    return base;
  }
}
