// Registr zemí pro datovou sekci /svet/.
//   geo = Eurostat kód (DE/FR/UK/CZ) — pro detailní harmonizovaná evropská data
//   wb  = World Bank ISO2 kód (DE/FR/GB/US/CZ) — globální/paritní zdroj (i USA)
// Fáze 1 = DE/FR/UK; další země se přidávají sem.
export const COUNTRIES = [
  { slug: 'nemecko',        geo: 'DE', wb: 'DE', nameCs: 'Německo',        flag: '🇩🇪' },
  { slug: 'francie',        geo: 'FR', wb: 'FR', nameCs: 'Francie',        flag: '🇫🇷' },
  { slug: 'velka-britanie', geo: 'UK', wb: 'GB', nameCs: 'Velká Británie', flag: '🇬🇧' },
];

// Referenční země (ČR) — vždy přítomná pro srovnání, sestavuje se taky.
export const REFERENCE = { slug: 'cesko', geo: 'CZ', wb: 'CZ', nameCs: 'Česko', flag: '🇨🇿' };

export function bySlug(slug) {
  return [REFERENCE, ...COUNTRIES].find((c) => c.slug === slug);
}
