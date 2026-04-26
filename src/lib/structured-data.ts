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
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': isVehicle ? ['Product', 'Vehicle'] : 'Product',
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

  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': isVehicle ? ['Product', 'Vehicle'] : 'Product',
    name: m.modelName,
    url,
    brand: { '@type': 'Brand', name: m.brandName },
    manufacturer: {
      '@type': 'Organization',
      name: m.brandName,
      url: `${SITE_URL}/stroje/${m.brandSlug}/`,
    },
    category: categoryLabel,
    model: m.modelName,
    isRelatedTo: { '@type': 'Thing', name: m.seriesName },
  };

  if (m.description) schema.description = m.description;
  if (m.imageUrl) schema.image = m.imageUrl.startsWith('http') ? m.imageUrl : `${SITE_URL}${m.imageUrl}`;

  if (isVehicle) {
    if (m.yearFrom) schema.productionDate = String(m.yearFrom);
    if (m.yearFrom && m.yearTo) schema.vehicleModelDate = `${m.yearFrom}/${m.yearTo}`;
    else if (m.yearFrom) schema.vehicleModelDate = String(m.yearFrom);
    if (m.transmission) schema.vehicleTransmission = m.transmission;
    if (m.weightKg) {
      schema.weight = { '@type': 'QuantitativeValue', value: m.weightKg, unitCode: 'KGM' };
    }

    const enginePower: Array<Record<string, unknown>> = [];
    if (m.powerHp) enginePower.push({ '@type': 'QuantitativeValue', value: m.powerHp, unitCode: 'BHP' });
    if (m.powerKw) enginePower.push({ '@type': 'QuantitativeValue', value: m.powerKw, unitCode: 'KWT' });
    if (enginePower.length > 0 || m.engine) {
      const engineSpec: Record<string, unknown> = { '@type': 'EngineSpecification' };
      if (enginePower.length > 0) engineSpec.enginePower = enginePower.length === 1 ? enginePower[0] : enginePower;
      if (m.engine) engineSpec.name = m.engine;
      schema.vehicleEngine = engineSpec;
    }
  }

  return schema;
}
