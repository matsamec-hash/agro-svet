// JSON-LD structured data helpers — schema.org markup pro Google rich results.
// Konzistentní formát napříč pages, jeden zdroj pravdy.
import { SITE_URL } from './config';

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'agro-svět.cz',
    alternateName: 'agro-svet.cz',
    url: SITE_URL + '/',
    logo: `${SITE_URL}/icon-512.png`,
    description:
      'Zemědělský portál — encyklopedie traktorů a kombajnů, plemena hospodářských zvířat, agro bazar zdarma a aktuální novinky.',
    inLanguage: 'cs-CZ',
  };
}

export function breadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: it.url.startsWith('http') ? it.url : `${SITE_URL}${it.url}`,
    })),
  };
}

export interface BazarListingForSchema {
  id: string;
  title: string;
  description: string | null;
  price: number | null;
  category: string;
  brand: string | null;
  location: string;
  created_at: string;
  year_of_manufacture?: number | null;
  power_hp?: number | null;
  hours_operated?: number | null;
}

export function bazarListingProductSchema(
  listing: BazarListingForSchema,
  imageUrls: string[],
  sellerName: string,
) {
  const url = `${SITE_URL}/bazar/${listing.id}/`;
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: listing.title,
    url,
    description: listing.description ?? listing.title,
    category: listing.category,
    sku: listing.id,
  };
  if (listing.brand) schema.brand = { '@type': 'Brand', name: listing.brand };
  if (imageUrls.length > 0) schema.image = imageUrls;
  if (listing.price) {
    schema.offers = {
      '@type': 'Offer',
      price: listing.price,
      priceCurrency: 'CZK',
      availability: 'https://schema.org/InStock',
      itemCondition: 'https://schema.org/UsedCondition',
      url,
      seller: { '@type': 'Person', name: sellerName },
      areaServed: { '@type': 'Country', name: 'Česká republika' },
    };
  }
  return schema;
}

export interface MachineModelForSchema {
  brandName: string;
  brandSlug: string;
  seriesName: string;
  modelName: string;
  modelSlug: string;
  category: 'traktory' | 'kombajny';
  url: string;
  description?: string;
  imageUrl?: string;
}

export function machineProductSchema(m: MachineModelForSchema) {
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: m.modelName,
    url: m.url.startsWith('http') ? m.url : `${SITE_URL}${m.url}`,
    brand: { '@type': 'Brand', name: m.brandName },
    category: m.category === 'traktory' ? 'Traktor' : 'Kombajn',
    isRelatedTo: { '@type': 'Thing', name: m.seriesName },
  };
  if (m.description) schema.description = m.description;
  if (m.imageUrl) schema.image = m.imageUrl.startsWith('http') ? m.imageUrl : `${SITE_URL}${m.imageUrl}`;
  return schema;
}
