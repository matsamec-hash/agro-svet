// Cluster chorob a škůdců. Kurátorovaná entitní vrstva (src/data/choroby/*.yaml)
// + reverzní index: která plodina kterou chorobu má. Volné textové chipy z YAML
// plodin (`choroby: string[]`) se mapují na entity přes přesné aliasy. Žádná DB,
// vše compile-time přes import.meta.glob.

import { listPlodiny } from './plodiny';

/** Kurátorovaná entita choroby/škůdce (YAML). */
export interface ChorobaYaml {
  slug: string;
  name: string;
  /** Latinský (vědecký) název patogenu/škůdce. */
  latinsky?: string;
  /** Původce — delší popis patogenu. */
  puvodce?: string;
  /** Faktický popis — povinný pro indexaci (anti-thin). */
  popis: string;
  /** Doporučená ochrana. */
  ochrana?: string;
  /**
   * Přesné textové chipy tak, jak se vyskytují v `choroby` u plodin. Spojují
   * volný formát YAML plodin s touto entitou (reverzní index). Po trim().
   */
  aliases: string[];
  faq?: { q: string; a: string }[];
}

/** Odkaz na postiženou plodinu v rámci jedné choroby. */
export interface ChorobaPlodinaRef {
  plodina_slug: string;
  plodina_name: string;
  /** Původní chip text u dané plodiny (zachová lokální nuanci). */
  chip: string;
}

/** Choroba spojená se seznamem postižených plodin (reverzní index). */
export interface ChorobaEntry extends ChorobaYaml {
  plodiny: ChorobaPlodinaRef[];
}

/** Chip na pillar stránce plodiny + případný odkaz na detail choroby. */
export interface ChorobaChip {
  chip: string;
  /** Slug indexovatelné choroby, na kterou chip odkazuje (jinak undefined). */
  slug?: string;
}

const chorobyModules = import.meta.glob('/src/data/choroby/*.yaml', {
  eager: true,
  import: 'default',
}) as Record<string, ChorobaYaml>;

function normChip(s: string): string {
  return s.trim();
}

let aliasIndexCache: Map<string, string> | null = null;

/** Mapa normalizovaný alias → slug choroby. Hlídá kolize aliasů. */
function aliasIndex(): Map<string, string> {
  if (aliasIndexCache) return aliasIndexCache;
  const map = new Map<string, string>();
  for (const c of Object.values(chorobyModules)) {
    for (const a of c.aliases ?? []) {
      const key = normChip(a);
      if (!key) continue;
      const existing = map.get(key);
      if (existing && existing !== c.slug) {
        throw new Error(
          `Alias choroby "${a}" je přiřazen dvěma entitám: ${existing} a ${c.slug}`,
        );
      }
      map.set(key, c.slug);
    }
  }
  aliasIndexCache = map;
  return map;
}

/** Vrátí slug choroby pro daný chip plodiny, pokud existuje mapování. */
export function chorobaSlugForChip(chip: string): string | undefined {
  return aliasIndex().get(normChip(chip));
}

let cache: ChorobaEntry[] | null = null;

function build(): ChorobaEntry[] {
  if (cache) return cache;
  const bySlug = new Map<string, ChorobaEntry>();
  for (const c of Object.values(chorobyModules)) {
    if (bySlug.has(c.slug)) {
      throw new Error(`Duplicitní slug choroby: ${c.slug}`);
    }
    bySlug.set(c.slug, { ...c, plodiny: [] });
  }
  // Reverzní index: projdi plodiny a jejich chipy, přiřaď k entitám.
  for (const p of listPlodiny()) {
    const seen = new Set<string>(); // jedna plodina → jedna choroba max 1×
    for (const chip of p.choroby ?? []) {
      const slug = chorobaSlugForChip(chip);
      if (!slug) continue;
      const entry = bySlug.get(slug);
      if (!entry || seen.has(slug)) continue;
      seen.add(slug);
      entry.plodiny.push({ plodina_slug: p.slug, plodina_name: p.name, chip: normChip(chip) });
    }
  }
  for (const entry of bySlug.values()) {
    entry.plodiny.sort((a, b) => a.plodina_name.localeCompare(b.plodina_name, 'cs'));
  }
  cache = Array.from(bySlug.values()).sort((a, b) => a.name.localeCompare(b.name, 'cs'));
  return cache;
}

export function listChoroby(): ChorobaEntry[] {
  return build();
}

export function getChoroba(slug: string): ChorobaEntry | undefined {
  return build().find((c) => c.slug === slug);
}

/**
 * Anti-thin guardrail: choroba dostane vlastní indexovanou stránku jen když má
 * faktický popis a alespoň jednu navázanou plodinu.
 */
export function isChorobaIndexable(c: ChorobaEntry): boolean {
  return Boolean(c.popis && c.popis.trim().length > 0) && c.plodiny.length >= 1;
}

export function listIndexableChoroby(): ChorobaEntry[] {
  return build().filter(isChorobaIndexable);
}

/**
 * Chipy „Choroby a škůdci" pro pillar stránku plodiny. Chip dostane odkaz jen
 * tehdy, mapuje-li se na indexovatelnou chorobu (jinak zůstává prostý text).
 */
export function chorobaChipsForPlodina(plodinaSlug: string): ChorobaChip[] {
  const p = listPlodiny().find((x) => x.slug === plodinaSlug);
  if (!p || !p.choroby) return [];
  const indexable = new Set(listIndexableChoroby().map((c) => c.slug));
  return p.choroby.map((chip) => {
    const slug = chorobaSlugForChip(chip);
    return slug && indexable.has(slug) ? { chip, slug } : { chip };
  });
}
