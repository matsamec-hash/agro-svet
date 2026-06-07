// JSON-LD structured data helpers — schema.org markup pro Google rich results.
// Konzistentní formát napříč pages, jeden zdroj pravdy.
import { SITE_URL } from './config';

export interface BreadcrumbItem {
  name: string;
  url: string;
}

// Stabilní @id kotvy pro sitewide entity. Všechna ostatní schémata (NewsArticle
// publisher, WebPage isPartOf, …) na ně odkazují přes { '@id': … } místo aby
// duplikovala celý objekt — Google pak nody slučuje do jedné entity (silnější
// E-E-A-T / Knowledge Graph signál).
export const ORG_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

const ORG_DESCRIPTION =
  'Zemědělský portál — encyklopedie traktorů a kombajnů, plemena hospodářských zvířat, agro bazar zdarma a aktuální novinky.';

// Sitewide @graph emitovaný v Layout.astro na KAŽDÉ stránce. Definuje kanonickou
// Organization + WebSite entitu jednou; ostatní stránky už jen referencují @id.
export function siteSchemaGraph() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': ORG_ID,
        name: 'agro-svět.cz',
        alternateName: 'agro-svet.cz',
        url: SITE_URL + '/',
        logo: {
          '@type': 'ImageObject',
          url: `${SITE_URL}/icon-512.png`,
          width: 512,
          height: 512,
        },
        description: ORG_DESCRIPTION,
        parentOrganization: {
          '@type': 'Organization',
          name: 'Samec Digital s.r.o.',
          legalName: 'Samec Digital s.r.o.',
          url: 'https://samecdigital.com/',
          identifier: {
            '@type': 'PropertyValue',
            propertyID: 'IČO',
            value: '29547539',
          },
          address: {
            '@type': 'PostalAddress',
            streetAddress: 'Na Břehu 378',
            postalCode: '387 11',
            addressLocality: 'Katovice',
            addressCountry: 'CZ',
          },
        },
        contactPoint: {
          '@type': 'ContactPoint',
          contactType: 'customer support',
          email: 'info@samecdigital.com',
          availableLanguage: ['Czech', 'Slovak'],
        },
      },
      {
        '@type': 'WebSite',
        '@id': WEBSITE_ID,
        name: 'agro-svět.cz',
        alternateName: 'agro-svet.cz',
        url: SITE_URL + '/',
        // Dvojjazyčný portál — WebSite entita je sdílená (stejné @id) napříč cs i sk
        // URL, proto deklarujeme oba jazyky polem místo jediné hodnoty. Per-page jazyk
        // řeší <html lang> + page-level inLanguage (Article/CollectionPage).
        inLanguage: ['cs-CZ', 'sk-SK'],
        description: ORG_DESCRIPTION,
        publisher: { '@id': ORG_ID },
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: `${SITE_URL}/hledat/?q={search_term_string}`,
          },
          'query-input': 'required name=search_term_string',
        },
      },
    ],
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
  /** BCP-47 language of the page (e.g. 'cs-CZ', 'sk-SK'). Default cs → no inLanguage
   *  emitted (byte-identický s původním výstupem). */
  lang?: string;
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
  // Some callers pass modelName already prefixed with brand (encyklopedie content),
  // others pass just the bare model (stroje [brand]/[series]/[model] route).
  // Detect duplicate prefix to avoid "Zetor Zetor Proxima 120".
  const fullName = m.modelName.toLowerCase().startsWith(m.brandName.toLowerCase())
    ? m.modelName
    : `${m.brandName} ${m.modelName}`;
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Thing',
    additionalType: isVehicle ? 'https://schema.org/Vehicle' : `https://agro-svet.cz/stroje/${m.category}/`,
    name: fullName,
    url,
    category: categoryLabel,
  };

  // Only emit inLanguage for non-default locales — keeps cs output byte-identical.
  if (m.lang && m.lang !== 'cs-CZ') schema.inLanguage = m.lang;
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

export interface ExpertReviewInput {
  /** Page URL of the review (typically the encyklopedie detail). */
  url: string;
  /** Reviewed model — schema.org Thing. */
  itemName: string;
  itemUrl: string;
  itemImageUrl?: string;
  itemCategory?: string;
  itemBrand?: string;
  /** Editorial rating, 1–5 (decimals allowed: 4.5). */
  rating: number;
  /** Short verdict paragraph. */
  verdict: string;
  /** Optional plusses / minuses summarised as a sentence each. */
  pros?: string[];
  cons?: string[];
  /** ISO 8601 date when the review was published / last updated. */
  datePublished?: string;
  dateModified?: string;
  authorName?: string;
}

// Editorial Review of a machine model. Mapped to schema.org Review with
// itemReviewed pointing at a Thing/Vehicle entity. Doesn't claim user-generated
// AggregateRating — that requires real review collection infrastructure.
export function expertReviewSchema(r: ExpertReviewInput) {
  const reviewUrl = r.url.startsWith('http') ? r.url : `${SITE_URL}${r.url}`;
  const itemUrl = r.itemUrl.startsWith('http') ? r.itemUrl : `${SITE_URL}${r.itemUrl}`;
  const itemImageUrl = r.itemImageUrl
    ? (r.itemImageUrl.startsWith('http') ? r.itemImageUrl : `${SITE_URL}${r.itemImageUrl}`)
    : undefined;
  const reviewBody = [
    r.verdict,
    r.pros && r.pros.length > 0 ? `Plusy: ${r.pros.join('; ')}.` : null,
    r.cons && r.cons.length > 0 ? `Mínusy: ${r.cons.join('; ')}.` : null,
  ].filter(Boolean).join(' ');
  return {
    '@context': 'https://schema.org',
    '@type': 'Review',
    url: reviewUrl,
    name: `Hodnocení redakce — ${r.itemName}`,
    reviewBody,
    inLanguage: 'cs-CZ',
    datePublished: r.datePublished ?? new Date().toISOString().slice(0, 10),
    ...(r.dateModified ? { dateModified: r.dateModified } : {}),
    author: {
      '@type': 'Organization',
      name: r.authorName ?? 'Redakce agro-svět.cz',
      url: SITE_URL,
    },
    publisher: {
      '@type': 'Organization',
      name: 'agro-svět.cz',
      url: SITE_URL,
    },
    reviewRating: {
      '@type': 'Rating',
      ratingValue: r.rating,
      bestRating: 5,
      worstRating: 1,
    },
    itemReviewed: {
      '@type': 'Thing',
      name: r.itemName,
      url: itemUrl,
      ...(itemImageUrl ? { image: itemImageUrl } : {}),
      ...(r.itemBrand ? { brand: { '@type': 'Brand', name: r.itemBrand } } : {}),
      ...(r.itemCategory ? { category: r.itemCategory } : {}),
    },
    ...(r.pros && r.pros.length > 0 ? { positiveNotes: { '@type': 'ItemList', itemListElement: r.pros.map((p, i) => ({ '@type': 'ListItem', position: i + 1, name: p })) } } : {}),
    ...(r.cons && r.cons.length > 0 ? { negativeNotes: { '@type': 'ItemList', itemListElement: r.cons.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c })) } } : {}),
  };
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

export interface VideoObjectInput {
  /** YouTube video ID (e.g. "K3WmtzFIUbA"). */
  youtubeId: string;
  name: string;
  description: string;
  /** Page URL where the video is embedded. */
  pageUrl: string;
  /** Optional ISO 8601 upload date; defaults to lastVerified or today. */
  uploadDate?: string;
}

export function videoObjectSchema(v: VideoObjectInput) {
  const thumbnail = `https://i.ytimg.com/vi/${v.youtubeId}/hqdefault.jpg`;
  return {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: v.name,
    description: v.description,
    thumbnailUrl: thumbnail,
    uploadDate: v.uploadDate ?? new Date().toISOString().slice(0, 10),
    contentUrl: `https://www.youtube.com/watch?v=${v.youtubeId}`,
    embedUrl: `https://www.youtube-nocookie.com/embed/${v.youtubeId}`,
    inLanguage: 'cs-CZ',
  };
}

export interface HowToStep {
  name: string;
  text: string;
}

export interface HowToInput {
  name: string;
  description: string;
  /** Absolute or site-relative URL of the HowTo page. */
  url: string;
  imageUrl?: string;
  /** ISO 8601 duration, e.g. "PT30M" or "PT2H". */
  totalTime?: string;
  tools?: string[];
  supplies?: string[];
  steps: HowToStep[];
}

export function howToSchema(h: HowToInput) {
  const url = h.url.startsWith('http') ? h.url : `${SITE_URL}${h.url}`;
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: h.name,
    description: h.description,
    inLanguage: 'cs-CZ',
  };
  if (h.imageUrl) schema.image = h.imageUrl.startsWith('http') ? h.imageUrl : `${SITE_URL}${h.imageUrl}`;
  if (h.totalTime) schema.totalTime = h.totalTime;
  if (h.tools && h.tools.length > 0) {
    schema.tool = h.tools.map((t) => ({ '@type': 'HowToTool', name: t }));
  }
  if (h.supplies && h.supplies.length > 0) {
    schema.supply = h.supplies.map((s) => ({ '@type': 'HowToSupply', name: s }));
  }
  schema.step = h.steps.map((s, i) => ({
    '@type': 'HowToStep',
    position: i + 1,
    name: s.name,
    text: s.text,
    url: `${url}#krok-${i + 1}`,
  }));
  return schema;
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

export interface OdrudaDatasetInput {
  /** Název odrůdy (např. "Annie"). */
  odrudaName: string;
  /** Název plodiny (např. "Pšenice ozimá"). */
  plodinaName: string;
  /** Slug plodiny pro odkaz na pillar (isPartOf). */
  plodinaSlug: string;
  /** URL detailu odrůdy (absolutní nebo site-relativní). */
  url: string;
  /** Popis odrůdy (oficiální próza z ÚKZÚZ / enrichment). */
  description: string;
  udrzovatel?: string | null;
  rokRegistrace?: number | null;
  typ?: string | null;
  ranost?: string | null;
  vlastnosti?: Record<string, string | number>;
  odolnosti?: Record<string, string | number>;
  /** Odkaz na zdrojový záznam ÚKZÚZ. */
  zdrojUrl?: string | null;
}

// Odrůda = záznam v databázi odrůd ÚKZÚZ → Dataset je nejpřesnější schema.org
// typ (schema.org nemá PlantVariety). Strukturovaná agronomická pole jdou do
// variableMeasured (PropertyValue), creator = ÚKZÚZ (autorita dat), isPartOf
// odkazuje na kolekci odrůd plodiny. Entity-rich, validní bez Product požadavků.
export function odrudaDatasetSchema(d: OdrudaDatasetInput) {
  const url = d.url.startsWith('http') ? d.url : `${SITE_URL}${d.url}`;
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    name: `${d.odrudaName} — odrůda (${d.plodinaName})`,
    description: d.description,
    url,
    inLanguage: 'cs-CZ',
    isAccessibleForFree: true,
    creator: {
      '@type': 'GovernmentOrganization',
      name: 'Ústřední kontrolní a zkušební ústav zemědělský',
      alternateName: 'ÚKZÚZ',
      url: 'https://www.ukzuz.cz/',
    },
    isPartOf: {
      '@type': 'Dataset',
      name: `Odrůdy plodiny ${d.plodinaName}`,
      url: `${SITE_URL}/plodiny/${d.plodinaSlug}/`,
    },
  };

  schema.keywords = [
    d.odrudaName,
    d.plodinaName,
    'odrůda',
    d.udrzovatel,
    d.typ,
    d.ranost,
  ].filter(Boolean);

  const vars: Array<Record<string, unknown>> = [];
  if (d.rokRegistrace) vars.push({ '@type': 'PropertyValue', name: 'Rok registrace', value: d.rokRegistrace });
  if (d.typ) vars.push({ '@type': 'PropertyValue', name: 'Typ', value: d.typ });
  if (d.ranost) vars.push({ '@type': 'PropertyValue', name: 'Ranost', value: d.ranost });
  if (d.udrzovatel) vars.push({ '@type': 'PropertyValue', name: 'Udržovatel', value: d.udrzovatel });
  for (const [name, value] of Object.entries(d.vlastnosti ?? {})) {
    vars.push({ '@type': 'PropertyValue', name, value });
  }
  for (const [name, value] of Object.entries(d.odolnosti ?? {})) {
    vars.push({ '@type': 'PropertyValue', name, value });
  }
  if (vars.length > 0) schema.variableMeasured = vars;

  if (d.zdrojUrl) schema.isBasedOn = d.zdrojUrl;

  return schema;
}

/**
 * Ořízne text na čistou hranici pro meta description — nikdy uprostřed slova.
 * Pokud věta končí v poslední třetině limitu, ukončí na ní (bez výpustky);
 * jinak ořízne na poslední celé slovo, odstraní koncovou interpunkci/mezeru
 * a přidá výpustku „…". Text kratší než limit vrací beze změny.
 */
export function truncateAtBoundary(text: string, max = 155): string {
  // Sjednotí vnitřní bílé znaky (ÚKZÚZ popisy mají zalomení řádků) na jednu mezeru.
  const t = text.replace(/\s+/g, ' ').trim();
  if (t.length <= max) return t;
  const slice = t.slice(0, max);

  // Preferuj ukončení na hranici věty, pokud je rozumně blízko limitu.
  const sentenceEnd = Math.max(slice.lastIndexOf('. '), slice.lastIndexOf('! '), slice.lastIndexOf('? '));
  if (sentenceEnd >= max * 0.6) {
    return slice.slice(0, sentenceEnd + 1).trim();
  }
  // Jinak ořízni na poslední celé slovo + výpustka.
  const lastSpace = slice.lastIndexOf(' ');
  const base = lastSpace > 0 ? slice.slice(0, lastSpace) : slice;
  return base.replace(/[\s.,;:–—-]+$/, '') + '…';
}

export interface FarmForSchema {
  slug: string;
  name: string;
  description: string;
  region: string;
  address?: string | null;
  lat: number;
  lng: number;
  products: string[]; // human labely
  eco: boolean;
  tel?: string | null;
  web?: string | null;
  email?: string | null;
  imageUrls?: string[];
}

// LocalBusiness/GroceryStore pro farmu prodávající ze dvora. Bez Offer cen
// (nemáme transakční data) — makesOffer drží sortiment jako Product nody,
// což je entity-rich a validní bez Product Snippet požadavků.
export function farmLocalBusinessSchema(f: FarmForSchema) {
  const url = `${SITE_URL}/farmy/${f.slug}/`;
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'GroceryStore',
    name: f.name,
    url,
    description: f.description,
    geo: { '@type': 'GeoCoordinates', latitude: f.lat, longitude: f.lng },
    areaServed: { '@type': 'AdministrativeArea', name: f.region },
  };
  if (f.address) {
    schema.address = {
      '@type': 'PostalAddress',
      streetAddress: f.address,
      addressRegion: f.region,
      addressCountry: 'CZ',
    };
  }
  if (f.tel) schema.telephone = f.tel;
  if (f.email) schema.email = f.email;
  const sameAs = [f.web].filter(Boolean) as string[];
  if (sameAs.length > 0) schema.sameAs = sameAs;
  if (f.imageUrls && f.imageUrls.length > 0) schema.image = f.imageUrls.map((u) => (u.startsWith('http') ? u : `${SITE_URL}${u}`));
  if (f.products.length > 0) {
    schema.makesOffer = f.products.map((p) => ({
      '@type': 'Offer',
      itemOffered: { '@type': 'Product', name: p },
    }));
  }
  if (f.eco) {
    schema.additionalProperty = [{ '@type': 'PropertyValue', name: 'Ekologické zemědělství', value: 'Ano' }];
  }
  return schema;
}
