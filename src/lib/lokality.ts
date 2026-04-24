import jsyaml from 'js-yaml';

export interface Okres {
  slug: string;
  name: string;
}

export interface Kraj {
  slug: string;
  name: string;
  okresy: Okres[];
}

interface LokalityYaml {
  kraje: Kraj[];
}

const raw = import.meta.glob('/src/data/lokality.yaml', {
  eager: true,
  query: '?raw',
  import: 'default',
}) as Record<string, string>;

let cachedKraje: Kraj[] | null = null;

function load(): Kraj[] {
  if (cachedKraje) return cachedKraje;
  const firstRaw = Object.values(raw)[0];
  if (!firstRaw) {
    throw new Error('[lokality] Missing src/data/lokality.yaml');
  }
  const parsed = jsyaml.load(firstRaw) as LokalityYaml;
  cachedKraje = parsed.kraje.map(k => ({
    slug: String(k.slug),
    name: k.name,
    okresy: k.okresy.map(o => ({ slug: String(o.slug), name: o.name })),
  }));
  cachedKraje.sort((a, b) => a.name.localeCompare(b.name, 'cs'));
  return cachedKraje;
}

export function getKraje(): Kraj[] {
  return load();
}

export function getKraj(slug: string): Kraj | undefined {
  return load().find(k => k.slug === slug);
}

export function getOkresy(krajSlug: string): Okres[] {
  return getKraj(krajSlug)?.okresy ?? [];
}

export function getOkres(krajSlug: string, okresSlug: string): Okres | undefined {
  return getOkresy(krajSlug).find(o => o.slug === okresSlug);
}

export function formatLokalita(krajSlug?: string | null, okresSlug?: string | null): string {
  if (!krajSlug) return '';
  const kraj = getKraj(krajSlug);
  if (!kraj) return '';
  if (!okresSlug) return kraj.name;
  const okres = getOkres(krajSlug, okresSlug);
  return okres ? `${okres.name}, ${kraj.name}` : kraj.name;
}
