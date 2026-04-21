// Coherent color system for categories (fixed, meaningful) and tags (hashed palette).

export interface ColorPair {
  bg: string;
  fg: string;
  border: string;
}

const CATEGORY_COLORS: Record<string, ColorPair> = {
  technika: { bg: '#E3F2FD', fg: '#0D47A1', border: '#90CAF9' },
  dotace: { bg: '#FFF9C4', fg: '#5D4E00', border: '#FDD835' },
  trh: { bg: '#E8F5E9', fg: '#1B5E20', border: '#81C784' },
  legislativa: { bg: '#F3E5F5', fg: '#4A148C', border: '#BA68C8' },
  znacky: { bg: '#FFEBEE', fg: '#B71C1C', border: '#EF9A9A' },
  novinky: { bg: '#ECEFF1', fg: '#37474F', border: '#B0BEC5' },
};

const TAG_PALETTE: ColorPair[] = [
  { bg: '#FEF3E2', fg: '#7A3500', border: '#FBCFA0' }, // warm orange
  { bg: '#E8F4FD', fg: '#0B5394', border: '#9FCDF0' }, // soft blue
  { bg: '#E8F7EC', fg: '#1E7030', border: '#A9D9B5' }, // soft green
  { bg: '#F3E8FD', fg: '#5E2B97', border: '#C9A6E8' }, // soft purple
  { bg: '#FDEAEA', fg: '#8F1E1E', border: '#ECACAC' }, // soft red
  { bg: '#FDF7E3', fg: '#6B4F00', border: '#E8D480' }, // soft amber
  { bg: '#EEF2F7', fg: '#37465C', border: '#B9C4D6' }, // neutral cool
  { bg: '#FDEAF6', fg: '#902862', border: '#EDB4D4' }, // soft pink
];

function hashString(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

export function getCategoryColor(cat: string | null | undefined): ColorPair {
  if (!cat) return CATEGORY_COLORS.novinky;
  return CATEGORY_COLORS[cat.toLowerCase()] ?? CATEGORY_COLORS.novinky;
}

export function getTagColor(tag: string): ColorPair {
  const idx = hashString(tag.toLowerCase()) % TAG_PALETTE.length;
  return TAG_PALETTE[idx];
}

export function categoryStyle(cat: string | null | undefined): string {
  const c = getCategoryColor(cat);
  return `background:${c.bg}; color:${c.fg}; border-color:${c.border};`;
}

export function tagStyle(tag: string): string {
  const c = getTagColor(tag);
  return `background:${c.bg}; color:${c.fg}; border-color:${c.border};`;
}
