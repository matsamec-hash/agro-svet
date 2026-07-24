/**
 * Kanonické kategorie novinek. Jen tyto slugy mají stránku
 * `/novinky/kategorie/<slug>/` — vše ostatní vede na 404, proto se surové
 * hodnoty z DB (kde vznikají nekonzistentně: „Zemědělství" vs „zemědělství"
 * vs „Novinky a zprávy" apod.) musí normalizovat přes `newsCategorySlug`.
 */
export const NEWS_CATEGORIES = ['technika', 'dotace', 'trh', 'legislativa', 'znacky', 'novinky'] as const;

const CANONICAL = new Set<string>(NEWS_CATEGORIES);

/**
 * Zmapuje surovou hodnotu `articles.category` na kanonický slug kategorie.
 * Odstraní diakritiku + velikost písmen; zná-li výsledek kanonickou kategorii,
 * vrátí ji, jinak spadne do obecné „novinky" (nikdy negeneruje 404 odkaz).
 */
export function newsCategorySlug(raw: string | null | undefined): string {
  if (!raw) return 'novinky';
  const norm = raw
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim();
  return CANONICAL.has(norm) ? norm : 'novinky';
}
