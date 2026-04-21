import { getAllModels, getModelBySlug } from './stroje';
import { getAllPlemena } from './plemena';

export interface ModelOption {
  slug: string;
  label: string;
  brand_slug: string;
  brand_name: string;
  category: string;
  series_slug: string;
  series_name: string;
  power_hp: number | null;
}

export interface PlemenoOption {
  slug: string;
  label: string;
  druh_slug: string;
  druh_name: string;
}

export function getModelOptions(): ModelOption[] {
  return getAllModels().map((m) => ({
    slug: m.slug,
    label: `${m.brand_name} ${m.name}`,
    brand_slug: m.brand_slug,
    brand_name: m.brand_name,
    category: m.category,
    series_slug: m.series_slug,
    series_name: m.series_name,
    power_hp: m.power_hp,
  }));
}

export function getPlemenoOptions(): PlemenoOption[] {
  return getAllPlemena().map((p) => ({
    slug: p.slug,
    label: p.name,
    druh_slug: p.druh_slug,
    druh_name: p.druh_name,
  }));
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
