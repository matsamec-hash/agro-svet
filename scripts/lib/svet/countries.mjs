// Registr zemí pro datovou sekci /svet/.
//   geo = Eurostat kód — pro detailní harmonizovaná evropská data (EU-27 + EFTA + kandidáti).
//         POZOR: Eurostat používá EL pro Řecko (ne GR) a UK pro V. Británii (ne GB).
//   wb  = World Bank ISO2 kód — globální/paritní zdroj (i USA, UA). Řecko = GR, V. Británie = GB.
// Země mimo Eurostat (USA, příp. UA) dostanou jen World Bank ukazatele — orchestrátor
// prázdné Eurostat série bez chyby přeskočí.
export const COUNTRIES = [
  // — velká agrární trojka (fáze 1) —
  { slug: 'nemecko',        geo: 'DE', wb: 'DE', nameCs: 'Německo',        flag: '🇩🇪' },
  { slug: 'francie',        geo: 'FR', wb: 'FR', nameCs: 'Francie',        flag: '🇫🇷' },
  { slug: 'velka-britanie', geo: 'UK', wb: 'GB', nameCs: 'Velká Británie', flag: '🇬🇧' },
  // — zbytek EU-27 —
  { slug: 'polsko',      geo: 'PL', wb: 'PL', nameCs: 'Polsko',      flag: '🇵🇱' },
  { slug: 'spanelsko',   geo: 'ES', wb: 'ES', nameCs: 'Španělsko',   flag: '🇪🇸' },
  { slug: 'italie',      geo: 'IT', wb: 'IT', nameCs: 'Itálie',      flag: '🇮🇹' },
  { slug: 'nizozemsko',  geo: 'NL', wb: 'NL', nameCs: 'Nizozemsko',  flag: '🇳🇱' },
  { slug: 'rakousko',    geo: 'AT', wb: 'AT', nameCs: 'Rakousko',    flag: '🇦🇹' },
  { slug: 'belgie',      geo: 'BE', wb: 'BE', nameCs: 'Belgie',      flag: '🇧🇪' },
  { slug: 'dansko',      geo: 'DK', wb: 'DK', nameCs: 'Dánsko',      flag: '🇩🇰' },
  { slug: 'irsko',       geo: 'IE', wb: 'IE', nameCs: 'Irsko',       flag: '🇮🇪' },
  { slug: 'svedsko',     geo: 'SE', wb: 'SE', nameCs: 'Švédsko',     flag: '🇸🇪' },
  { slug: 'finsko',      geo: 'FI', wb: 'FI', nameCs: 'Finsko',      flag: '🇫🇮' },
  { slug: 'portugalsko', geo: 'PT', wb: 'PT', nameCs: 'Portugalsko', flag: '🇵🇹' },
  { slug: 'recko',       geo: 'EL', wb: 'GR', nameCs: 'Řecko',       flag: '🇬🇷' },
  { slug: 'madarsko',    geo: 'HU', wb: 'HU', nameCs: 'Maďarsko',    flag: '🇭🇺' },
  { slug: 'rumunsko',    geo: 'RO', wb: 'RO', nameCs: 'Rumunsko',    flag: '🇷🇴' },
  { slug: 'bulharsko',   geo: 'BG', wb: 'BG', nameCs: 'Bulharsko',   flag: '🇧🇬' },
  { slug: 'slovensko',   geo: 'SK', wb: 'SK', nameCs: 'Slovensko',   flag: '🇸🇰' },
  { slug: 'slovinsko',   geo: 'SI', wb: 'SI', nameCs: 'Slovinsko',   flag: '🇸🇮' },
  { slug: 'chorvatsko',  geo: 'HR', wb: 'HR', nameCs: 'Chorvatsko',  flag: '🇭🇷' },
  { slug: 'litva',       geo: 'LT', wb: 'LT', nameCs: 'Litva',       flag: '🇱🇹' },
  { slug: 'lotyssko',    geo: 'LV', wb: 'LV', nameCs: 'Lotyšsko',    flag: '🇱🇻' },
  { slug: 'estonsko',    geo: 'EE', wb: 'EE', nameCs: 'Estonsko',    flag: '🇪🇪' },
  { slug: 'lucembursko', geo: 'LU', wb: 'LU', nameCs: 'Lucembursko', flag: '🇱🇺' },
  { slug: 'kypr',        geo: 'CY', wb: 'CY', nameCs: 'Kypr',        flag: '🇨🇾' },
  { slug: 'malta',       geo: 'MT', wb: 'MT', nameCs: 'Malta',       flag: '🇲🇹' },
  // — EFTA + další Evropa —
  { slug: 'svycarsko',   geo: 'CH', wb: 'CH', nameCs: 'Švýcarsko',   flag: '🇨🇭' },
  { slug: 'norsko',      geo: 'NO', wb: 'NO', nameCs: 'Norsko',      flag: '🇳🇴' },
  { slug: 'ukrajina',    geo: 'UA', wb: 'UA', nameCs: 'Ukrajina',    flag: '🇺🇦' },
  // — mimo Evropu (jen World Bank) —
  { slug: 'usa',         geo: 'US', wb: 'US', nameCs: 'USA',         flag: '🇺🇸' },
];

// Referenční země (ČR) — vždy přítomná pro srovnání, sestavuje se taky.
export const REFERENCE = { slug: 'cesko', geo: 'CZ', wb: 'CZ', nameCs: 'Česko', flag: '🇨🇿' };

export function bySlug(slug) {
  return [REFERENCE, ...COUNTRIES].find((c) => c.slug === slug);
}
