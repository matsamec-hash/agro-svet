// Registr zemí pro datovou sekci /svet/. geo = Eurostat kód, faostat = FAOSTAT area code,
// usda = příznak že primární zdroj je USDA (USA). Fáze 1 = DE/FR/UK; další se přidávají sem.
export const COUNTRIES = [
  { slug: 'nemecko',        geo: 'DE', faostat: 79,  usda: false, nameCs: 'Německo',        flag: '🇩🇪' },
  { slug: 'francie',        geo: 'FR', faostat: 68,  usda: false, nameCs: 'Francie',        flag: '🇫🇷' },
  { slug: 'velka-britanie', geo: 'UK', faostat: 229, usda: false, nameCs: 'Velká Británie', flag: '🇬🇧' },
];

// Referenční země (ČR) — vždy přítomná pro srovnání, sestavuje se taky.
export const REFERENCE = { slug: 'cesko', geo: 'CZ', faostat: 167, usda: false, nameCs: 'Česko', flag: '🇨🇿' };

export function bySlug(slug) {
  return [REFERENCE, ...COUNTRIES].find((c) => c.slug === slug);
}
