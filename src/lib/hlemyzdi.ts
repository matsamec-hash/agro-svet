// Datová vrstva sekce „Chov hlemýžďů" (/chov-hlemyzdu/).
// Obsah žije v src/data/hlemyzdi.json (16 článků: 1 pillar + 15 podstránek).
// Stejný princip jako src/lib/vcelarstvi.ts — statická data, žádná runtime DB.
import data from '../data/hlemyzdi.json';

export interface HlemyzdiArticle {
  slug: string;
  title: string;
  perex: string;
  content: string;            // HTML fragment (renderuje se přes set:html)
  seo_title: string;
  seo_description: string;
  featured_image_url: string;
  featured_image_alt: string;
  tags: string[];
  group: 'pillar' | 'zaklady' | 'rozhodovani' | 'produkty' | 'aktualne';
  order: number;
}

const ARTICLES = data as HlemyzdiArticle[];

export function getAllHlemyzdi(): HlemyzdiArticle[] {
  return [...ARTICLES].sort((a, b) => a.order - b.order);
}

export function getHlemyzdiBySlug(slug: string): HlemyzdiArticle | undefined {
  return ARTICLES.find((a) => a.slug === slug);
}

export function getPillar(): HlemyzdiArticle {
  return ARTICLES.find((a) => a.group === 'pillar') ?? getAllHlemyzdi()[0];
}

// Skupiny pro rozcestník (hub). Pořadí skupin = pořadí na stránce.
export const HLEMYZDI_GROUPS: { key: HlemyzdiArticle['group']; label: string; desc: string }[] = [
  { key: 'zaklady', label: 'Základy chovu', desc: 'Druhy, vybavení, krmení, rozmnožování, nemoci a zimování.' },
  { key: 'produkty', label: 'Co se ze šneků vyrábí', desc: 'Sliz (mucin), maso a escargot, šnečí kaviár, ulity.' },
  { key: 'rozhodovani', label: 'Legislativa a ekonomika', desc: 'Co vyřešit se zákonem a jestli se chov vyplatí.' },
  { key: 'aktualne', label: 'Aktuálně a kde u nás', desc: 'Clarksonova farma a přehled českých šnečích farem.' },
];

export function getHlemyzdiByGroup(group: HlemyzdiArticle['group']): HlemyzdiArticle[] {
  return getAllHlemyzdi().filter((a) => a.group === group);
}

// „Související v sekci" — pár dalších článků (bez aktuálního), pro patičku detailu.
export function getRelatedHlemyzdi(slug: string, limit = 4): HlemyzdiArticle[] {
  return getAllHlemyzdi().filter((a) => a.slug !== slug && a.group !== 'pillar').slice(0, limit);
}
