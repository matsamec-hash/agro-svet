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

const VEHICLE_BAZAR_CATEGORIES = new Set(['traktory', 'kombajny']);

export function bazarListingProductSchema(
  listing: BazarListingForSchema,
  imageUrls: string[],
  sellerName: string,
) {
  const url = `${SITE_URL}/bazar/${listing.id}/`;
  const isVehicle = VEHICLE_BAZAR_CATEGORIES.has(listing.category);
  const hasPrice = !!listing.price;
  // Product Snippet requires offers/review/aggregateRating. Listings without price
  // emit Vehicle/Thing only (entity-rich, valid for indexing without rich-result errors).
  const typeWhenNoPrice = isVehicle ? 'Vehicle' : 'Thing';
  const typeWhenPriced = isVehicle ? ['Product', 'Vehicle'] : 'Product';
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': hasPrice ? typeWhenPriced : typeWhenNoPrice,
    name: listing.title,
    url,
    description: listing.description ?? listing.title,
    category: listing.category,
    sku: listing.id,
  };
  if (listing.brand) schema.brand = { '@type': 'Brand', name: listing.brand };
  if (imageUrls.length > 0) schema.image = imageUrls;

  if (isVehicle) {
    if (listing.year_of_manufacture) {
      schema.vehicleModelDate = String(listing.year_of_manufacture);
      schema.productionDate = String(listing.year_of_manufacture);
    }
    if (listing.hours_operated) {
      schema.mileageFromOdometer = {
        '@type': 'QuantitativeValue',
        value: listing.hours_operated,
        unitCode: 'HUR',
      };
    }
    if (listing.power_hp) {
      schema.vehicleEngine = {
        '@type': 'EngineSpecification',
        enginePower: { '@type': 'QuantitativeValue', value: listing.power_hp, unitCode: 'BHP' },
      };
    }
  }

  if (listing.price) {
    schema.offers = {
      '@type': 'Offer',
      price: listing.price,
      priceCurrency: 'CZK',
      availability: 'https://schema.org/InStock',
      itemCondition: 'https://schema.org/UsedCondition',
      url,
      seller: { '@type': 'Person', name: sellerName },
      areaServed: { '@type': 'Country', name: 'CZ' },
      hasMerchantReturnPolicy: {
        '@type': 'MerchantReturnPolicy',
        applicableCountry: 'CZ',
        returnPolicyCategory: 'https://schema.org/MerchantReturnNotPermitted',
      },
      shippingDetails: {
        '@type': 'OfferShippingDetails',
        shippingRate: { '@type': 'MonetaryAmount', value: 0, currency: 'CZK' },
        shippingDestination: { '@type': 'DefinedRegion', addressCountry: 'CZ' },
      },
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
  category: string;
  url: string;
  description?: string;
  imageUrl?: string;
  // Vehicle fields (only traktory + kombajny use Vehicle type)
  powerHp?: number | null;
  powerKw?: number | null;
  weightKg?: number | null;
  yearFrom?: number | null;
  yearTo?: number | null;
  engine?: string;
  transmission?: string;
}

// Categories that map to Schema.org Vehicle (self-propelled = vehicle).
// Pulled implements (pluhy, postrikovace-tazene, etc.) stay as Product only.
const VEHICLE_CATEGORIES = new Set([
  'traktory',
  'kombajny',
  'postrikovace-samojizdne',
  'rezacky-samojizdne',
  'sklizece-brambor',
  'sklizece-repy',
  'teleskopy',
  'kolove-nakladace',
  'kloubove-nakladace',
  'smykove-nakladace',
  'lesni-vyvazecky',
]);

export function machineProductSchema(m: MachineModelForSchema) {
  const isVehicle = VEHICLE_CATEGORIES.has(m.category);
  const url = m.url.startsWith('http') ? m.url : `${SITE_URL}${m.url}`;
  const categoryLabel = m.category === 'traktory' ? 'Traktor' : m.category === 'kombajny' ? 'Kombajn' : m.category;

  // Non-transactional catalog: avoid the entire Product hierarchy (Vehicle is a Product
  // subtype, so Google's Product Snippets validator triggers on it and demands
  // offers/review/aggregateRating which we don't have). Use Thing with additionalType
  // pointing at the schema.org Vehicle URL — keeps entity hint without inheriting
  // Product validation. Spec values go into additionalProperty (consumed by Knowledge
  // Graph / AI Overviews extractors without rich-result candidacy).
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Thing',
    additionalType: isVehicle ? 'https://schema.org/Vehicle' : `https://agro-svet.cz/stroje/${m.category}/`,
    name: `${m.brandName} ${m.modelName}`,
    url,
    category: categoryLabel,
  };

  if (m.description) schema.description = m.description;
  if (m.imageUrl) schema.image = m.imageUrl.startsWith('http') ? m.imageUrl : `${SITE_URL}${m.imageUrl}`;

  // Brand and series as Thing references (non-Product types).
  schema.subjectOf = {
    '@type': 'Brand',
    name: m.brandName,
    url: `${SITE_URL}/stroje/${m.brandSlug}/`,
  };
  if (m.seriesName) {
    schema.isPartOf = { '@type': 'Thing', name: m.seriesName };
  }

  // Vehicle/machine specs as PropertyValue pairs — entity-rich without Product type.
  const props: Array<Record<string, unknown>> = [];
  if (m.powerHp) props.push({ '@type': 'PropertyValue', name: 'Výkon', value: m.powerHp, unitCode: 'BHP', unitText: 'k' });
  if (m.powerKw) props.push({ '@type': 'PropertyValue', name: 'Výkon (kW)', value: m.powerKw, unitCode: 'KWT', unitText: 'kW' });
  if (m.weightKg) props.push({ '@type': 'PropertyValue', name: 'Hmotnost', value: m.weightKg, unitCode: 'KGM', unitText: 'kg' });
  if (m.engine) props.push({ '@type': 'PropertyValue', name: 'Motor', value: m.engine });
  if (m.transmission) props.push({ '@type': 'PropertyValue', name: 'Převodovka', value: m.transmission });
  if (m.yearFrom) {
    const yearValue = m.yearTo ? `${m.yearFrom}–${m.yearTo}` : `${m.yearFrom}–dosud`;
    props.push({ '@type': 'PropertyValue', name: 'Roky výroby', value: yearValue });
  }
  if (props.length > 0) schema.additionalProperty = props;

  return schema;
}

export interface FaqItem {
  q: string;
  a: string;
}

export function faqPageSchema(items: FaqItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((it) => ({
      '@type': 'Question',
      name: it.q,
      acceptedAnswer: { '@type': 'Answer', text: it.a },
    })),
  };
}

export interface ItemListEntry {
  url: string;
  name: string;
}

export function itemListSchema(entries: ItemListEntry[], listName?: string) {
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    numberOfItems: entries.length,
    itemListElement: entries.map((e, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: e.url.startsWith('http') ? e.url : `${SITE_URL}${e.url}`,
      name: e.name,
    })),
  };
  if (listName) schema.name = listName;
  return schema;
}
