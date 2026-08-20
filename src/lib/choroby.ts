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
  /** Detailní příznaky (podle fází / orgánů rostliny). */
  priznaky?: string;
  /** Hostitelé — napadené plodiny a druhy. */
  hostitele?: string[];
  /** Podmínky šíření / epidemiologie (teplota, vlhkost, infekce). */
  sireni?: string;
  /** Škodlivost — dopad na výnos, práh ošetření. */
  skodlivost?: string;
  /** Životní cyklus patogenu, přezimování, zdroj infekce. */
  cyklus?: string;
  /** Registrované fungicidní účinné látky (látka + příklad přípravku). */
  ucinne_latky?: { latka: string; pripravky?: string }[];
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

// Per-locale prose overlay: /src/data/choroby/<locale>/<slug>.yaml.
// `aliases` a `latinsky` zůstávají z cs — aliasy jsou mapovací klíče na chipy
// plodin, latina je mezinárodní. `ucinne_latky` taky (názvy účinných látek).
const chorobyOverlayModules = import.meta.glob('/src/data/choroby/*/*.yaml', {
  eager: true,
  import: 'default',
}) as Record<string, Partial<ChorobaYaml>>;

const CHOROBA_OVERLAY_FIELDS = [
  'name', 'puvodce', 'popis', 'priznaky', 'hostitele',
  'sireni', 'skodlivost', 'cyklus', 'ochrana', 'faq',
  // ‼️ `ucinne_latky` jsem původně z overlaye vyloučil s tím, že jsou to
  // mezinárodní názvy. Chyba: 38 z 39 záznamů neslo českou prózu („např.
  // Amistar", „měďnaté přípravky"). Navíc jsou obchodní názvy přípravků
  // NÁRODNÍ (registrace se liší) — PL overlay proto nese jen účinné látky.
  'ucinne_latky',
] as const;

/** cs choroba + overlay → lokalizovaná. Nemutuje base. Exportováno kvůli testům. */
export function applyChorobaOverlay(base: ChorobaYaml, ov: Partial<ChorobaYaml> | null): ChorobaYaml {
  if (!ov) return base;
  const out = { ...base } as any;
  for (const f of CHOROBA_OVERLAY_FIELDS) {
    if (ov[f] !== undefined) out[f] = ov[f];
  }
  return out as ChorobaYaml;
}

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
const cacheByLocale = new Map<string, ChorobaEntry[]>();

function build(locale: string = 'cs'): ChorobaEntry[] {
  if (locale === 'cs') {
    if (cache) return cache;
  } else {
    const hit = cacheByLocale.get(locale);
    if (hit) return hit;
  }
  const bySlug = new Map<string, ChorobaEntry>();
  for (const base of Object.values(chorobyModules)) {
    if (bySlug.has(base.slug)) {
      throw new Error(`Duplicitní slug choroby: ${base.slug}`);
    }
    const ov = locale === 'cs'
      ? null
      : (chorobyOverlayModules[`/src/data/choroby/${locale}/${base.slug}.yaml`] ?? null);
    bySlug.set(base.slug, { ...applyChorobaOverlay(base, ov), plodiny: [] });
  }
  // Reverzní index: projdi plodiny a jejich chipy, přiřaď k entitám.
  // ‼️ Mapuje se přes cs chip (choroby_cs), protože aliasy jsou cs; zobrazuje
  // se lokalizovaný chip na stejném indexu. Bez toho by pod /pl nesedělo nic.
  for (const p of listPlodiny(locale)) {
    const seen = new Set<string>(); // jedna plodina → jedna choroba max 1×
    const chips = p.choroby ?? [];
    const chipsCs = p.choroby_cs ?? chips;
    for (let i = 0; i < chips.length; i++) {
      const slug = chorobaSlugForChip(chipsCs[i] ?? chips[i]);
      if (!slug) continue;
      const entry = bySlug.get(slug);
      if (!entry || seen.has(slug)) continue;
      seen.add(slug);
      entry.plodiny.push({ plodina_slug: p.slug, plodina_name: p.name, chip: normChip(chips[i]) });
    }
  }
  const coll = locale === 'cs' ? 'cs' : locale;
  for (const entry of bySlug.values()) {
    entry.plodiny.sort((a, b) => a.plodina_name.localeCompare(b.plodina_name, coll));
  }
  const out = Array.from(bySlug.values()).sort((a, b) => a.name.localeCompare(b.name, coll));
  if (locale === 'cs') cache = out;
  else cacheByLocale.set(locale, out);
  return out;
}

export function listChoroby(locale: string = 'cs'): ChorobaEntry[] {
  return build(locale);
}

export function getChoroba(slug: string, locale: string = 'cs'): ChorobaEntry | undefined {
  return build(locale).find((c) => c.slug === slug);
}

/**
 * Anti-thin guardrail: choroba dostane vlastní indexovanou stránku jen když má
 * faktický popis a alespoň jednu navázanou plodinu.
 */
export function isChorobaIndexable(c: ChorobaEntry): boolean {
  return Boolean(c.popis && c.popis.trim().length > 0) && c.plodiny.length >= 1;
}

export function listIndexableChoroby(locale: string = 'cs'): ChorobaEntry[] {
  return build(locale).filter(isChorobaIndexable);
}

/**
 * Chipy „Choroby a škůdci" pro pillar stránku plodiny. Chip dostane odkaz jen
 * tehdy, mapuje-li se na indexovatelnou chorobu (jinak zůstává prostý text).
 */
export function chorobaChipsForPlodina(plodinaSlug: string, locale: string = 'cs'): ChorobaChip[] {
  const p = listPlodiny(locale).find((x) => x.slug === plodinaSlug);
  if (!p || !p.choroby) return [];
  const indexable = new Set(listIndexableChoroby(locale).map((c) => c.slug));
  // Chip se ZOBRAZUJE lokalizovaný, ale MAPUJE se přes cs originál na stejném
  // indexu (aliasy entit jsou cs). U cs jsou obě pole totožná.
  const chipsCs = p.choroby_cs ?? p.choroby;
  return p.choroby.map((chip, i) => {
    const slug = chorobaSlugForChip(chipsCs[i] ?? chip);
    return slug && indexable.has(slug) ? { chip, slug } : { chip };
  });
}
