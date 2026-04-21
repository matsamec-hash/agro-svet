import { getAllModels, getModelBySlug } from './stroje';
import { getAllPlemena } from './plemena';

export interface ModelOption {
  slug: string;
  label: string;       // "John Deere 6430 Premium" — used for search
  name: string;        // "6430 Premium" — model name without brand prefix
  brand_slug: string;
  brand_name: string;
  category: string;
  series_slug: string;
  series_name: string;
  power_hp: number | null;
  year_from: number | null;
  year_to: number | null;
}

export interface PlemenoOption {
  slug: string;
  label: string;
  name: string;
  druh_slug: string;
  druh_name: string;
  brand_slug?: string;  // unused for plemena but keeps picker happy
  series_slug?: string;
}

export function getModelOptions(): ModelOption[] {
  return getAllModels().map((m) => ({
    slug: m.slug,
    label: `${m.brand_name} ${m.name}`,
    name: m.name,
    brand_slug: m.brand_slug,
    brand_name: m.brand_name,
    category: m.category,
    series_slug: m.series_slug,
    series_name: m.series_name,
    power_hp: m.power_hp,
    year_from: m.year_from,
    year_to: m.year_to,
  }));
}

export function getPlemenoOptions(): PlemenoOption[] {
  // Group plemena by druh: use druh_slug as "brand_slug" so picker groups them
  return getAllPlemena().map((p) => ({
    slug: p.slug,
    label: p.name,
    name: p.name,
    druh_slug: p.druh_slug,
    druh_name: p.druh_name,
    brand_slug: p.druh_slug,
    brand_name: p.druh_name,
    series_slug: '',
    series_name: '',
  } as unknown as PlemenoOption));
}

export function resolveModelLabel(modelSlug: string | null | undefined): { label: string; url: string } | null {
  if (!modelSlug) return null;
  const m = getModelBySlug(modelSlug);
  if (!m) return null;
  const short = m.slug.startsWith(m.brand_slug + '-') ? m.slug.slice(m.brand_slug.length + 1) : m.slug;
  return {
    label: `${m.brand_name} ${m.name}`,
    url: `/stroje/${m.brand_slug}/${m.series_slug}/${short}/`,
  };
}
