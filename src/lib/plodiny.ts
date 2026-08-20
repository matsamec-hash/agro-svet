// Compile-time data: YAML přes @modyfi/vite-plugin-yaml, JSON nativně. Žádná runtime DB.

export type Skupina =
  | 'obiloviny'
  | 'olejniny'
  | 'okopaniny'
  | 'luskoviny'
  | 'picniny';

export const SKUPINA_LABELS: Record<Skupina, string> = {
  obiloviny: 'Obiloviny',
  olejniny: 'Olejniny',
  okopaniny: 'Okopaniny',
  luskoviny: 'Luskoviny',
  picniny: 'Pícniny',
};

/** Faktická vrstva odrůdy — generovaná z ÚKZÚZ, commitovaná jako JSON. */
export interface OdrudaFakta {
  slug: string;
  name: string;
  plodina_slug: string;
  rok_registrace?: number | null;
  udrzovatel?: string | null;
  typ?: string | null;
  ranost?: string | null;
  /**
   * Oficiální popis odrůdy z ÚKZÚZ (faktická agronomická próza). build() z něj
   * odvodí enrichment.popis (pokud YAML enrichment popis nemá) → odrůda s
   * oficiálním popisem dostane vlastní indexovanou URL bez halucinací.
   */
  popis?: string | null;
  zdroj_url?: string | null;
}

/** Obohacení odrůdy — kurátorovaná/AI vrstva, volitelné. */
export interface OdrudaEnrichment {
  popis?: string;
  vlastnosti?: Record<string, string | number>;
  odolnosti?: Record<string, string | number>;
  doporuceni?: string;
  body?: string;
  faq?: { q: string; a: string }[];
}

/** Spojená odrůda (fakta + případné obohacení). */
export interface Odruda extends OdrudaFakta {
  enrichment?: OdrudaEnrichment;
}

export interface HowToStepData { name: string; text: string }

/** Obohacující vrstva plodiny (YAML). */
export interface PlodinaYaml {
  slug: string;
  name: string;
  name_plural: string;
  skupina: Skupina;
  description: string;
  vysevek?: string;
  hnojeni?: string;
  vynos_t_ha?: string;
  sklizen?: string;
  /** Měsíce setí (1–12), odvozené z osevni_postup "Setí". Pro crop-calendar. */
  seti_mesice?: number[];
  /** Měsíce sklizně (1–12), odvozené z pole `sklizen`. Pro crop-calendar. */
  sklizen_mesice?: number[];
  vyuziti?: string;
  choroby?: string[];
  /** cs originály chipů `choroby` — mapovací klíč na entitu choroby, když je
   *  `choroby` přeložené overlayem. U cs nedefinované (choroby už JSOU cs). */
  choroby_cs?: string[];
  osevni_postup?: HowToStepData[];
  wikipedia?: string;
  wikidata?: string;
  body?: string;
  faq?: { q: string; a: string }[];
  enrichment?: Record<string, OdrudaEnrichment>;
  hero_image?: string;    // /images/plodiny/<slug>.jpg
  hero_author?: string;   // může být prázdné u PD
  hero_license?: string;  // "Public domain" | "CC BY-SA 3.0" | ...
  hero_source?: string;   // URL na Wikimedia Commons soubor
}

/** Plodina spojená s odrůdami — to, co konzumují stránky. */
export interface Plodina extends PlodinaYaml {
  odrudy: Odruda[];
}

const yamlModules = import.meta.glob('/src/data/plodiny/*.yaml', {
  eager: true,
  import: 'default',
}) as Record<string, PlodinaYaml>;

// Per-locale prose overlay: /src/data/plodiny/<locale>/<slug>.yaml. Překládá se
// jen zobrazovaná próza — slug, skupina, hero_*, seti_mesice/sklizen_mesice a
// wikipedia zůstávají z cs, protože jsou to klíče (mapování, obrázky, kalendář).
// cs overlay neexistuje → cs větev je byte-identická s dosavadním chováním.
const plodinaOverlayModules = import.meta.glob('/src/data/plodiny/*/*.yaml', {
  eager: true,
  import: 'default',
}) as Record<string, Partial<PlodinaYaml>>;

// Pole, která overlay SMÍ přebít. Cokoliv jiného se z cs kopíruje beze změny —
// ať překlad nemůže rozbít mapování ani kalendář.
const PLODINA_OVERLAY_FIELDS = [
  'name', 'name_plural', 'description', 'vysevek', 'hnojeni',
  'vynos_t_ha', 'sklizen', 'vyuziti', 'osevni_postup', 'faq',
] as const;

/** cs plodina + overlay → lokalizovaná. Nemutuje base. Exportováno kvůli testům. */
export function applyPlodinaOverlay(base: PlodinaYaml, ov: Partial<PlodinaYaml> | null): PlodinaYaml {
  if (!ov) return base;
  const out = { ...base } as any;
  for (const f of PLODINA_OVERLAY_FIELDS) {
    if (ov[f] !== undefined) out[f] = ov[f];
  }
  // `choroby` jsou chipy mapované na entitu choroby PŘESNÝM aliasem, takže
  // překlad by mapování rozbil. Overlay drží stejné pořadí i délku → cs zůstává
  // mapovacím klíčem (choroby_cs) a zobrazuje se přeložený text.
  if (Array.isArray(ov.choroby) && Array.isArray(base.choroby) && ov.choroby.length === base.choroby.length) {
    out.choroby = ov.choroby;
    out.choroby_cs = base.choroby;
  }
  return out as PlodinaYaml;
}

const odrudyModules = import.meta.glob('/src/data/plodiny/odrudy/*.json', {
  eager: true,
  import: 'default',
}) as Record<string, OdrudaFakta[]>;

let cached: Plodina[] | null = null;
const cachedByLocale = new Map<string, Plodina[]>();

function buildOdrudyIndex(): Record<string, OdrudaFakta[]> {
  const byPlodina: Record<string, OdrudaFakta[]> = {};
  for (const arr of Object.values(odrudyModules)) {
    for (const o of arr) {
      (byPlodina[o.plodina_slug] ??= []).push(o);
    }
  }
  return byPlodina;
}

/**
 * Spojí kurátorovanou YAML enrichment vrstvu s oficiálním popisem z ÚKZÚZ.
 * YAML má přednost; chybí-li v YAML popis, použije se faktický popis z ÚKZÚZ.
 * Tím každá odrůda s oficiálním popisem získá enrichment (→ indexovatelnost).
 */
function mergeEnrichment(
  yamlEnrichment: OdrudaEnrichment | undefined,
  factualPopis: string | null | undefined,
): OdrudaEnrichment | undefined {
  const popis = factualPopis?.trim();
  if (!popis) return yamlEnrichment;
  return { ...(yamlEnrichment ?? {}), popis: yamlEnrichment?.popis ?? popis };
}

function build(locale: string = 'cs'): Plodina[] {
  if (locale === 'cs') {
    if (cached) return cached;
  } else {
    const hit = cachedByLocale.get(locale);
    if (hit) return hit;
  }
  const odrudyIndex = buildOdrudyIndex();
  const plodiny: Plodina[] = [];
  for (const base of Object.values(yamlModules)) {
    const ov = locale === 'cs'
      ? null
      : (plodinaOverlayModules[`/src/data/plodiny/${locale}/${base.slug}.yaml`] ?? null);
    const yaml = applyPlodinaOverlay(base, ov);
    if (yaml.slug === 'skupina') {
      throw new Error('Plodina nesmí mít rezervovaný slug "skupina"');
    }
    const fakta = odrudyIndex[yaml.slug] ?? [];
    const odrudy: Odruda[] = fakta.map((f) => ({
      ...f,
      enrichment: mergeEnrichment(yaml.enrichment?.[f.slug], f.popis),
    }));
    odrudy.sort((a, b) => a.name.localeCompare(b.name, 'cs'));
    plodiny.push({ ...yaml, odrudy });
  }
  plodiny.sort((a, b) => a.name.localeCompare(b.name, locale === 'cs' ? 'cs' : locale));
  if (locale === 'cs') cached = plodiny;
  else cachedByLocale.set(locale, plodiny);
  return plodiny;
}

export function listPlodiny(locale: string = 'cs'): Plodina[] {
  return build(locale);
}

export function getPlodina(slug: string, locale: string = 'cs'): Plodina | undefined {
  return build(locale).find((p) => p.slug === slug);
}

/**
 * Odrůda dostane vlastní indexovanou URL jen když má obohacení (popis / FAQ /
 * vlastnosti). Holé odrůdy z ÚKZÚZ žijí pouze jako řádek v tabulce na stránce
 * plodiny — žádné tenké duplikátní URL. Anti-thin guardrail.
 */
export function isOdrudaIndexable(o: Odruda): boolean {
  const e = o.enrichment;
  if (!e) return false;
  return Boolean(
    (e.popis && e.popis.trim().length > 0) ||
      (e.faq && e.faq.length > 0) ||
      (e.vlastnosti && Object.keys(e.vlastnosti).length > 0) ||
      (e.body && e.body.trim().length > 0),
  );
}

export function getOdruda(plodinaSlug: string, odrudaSlug: string): Odruda | undefined {
  return getPlodina(plodinaSlug)?.odrudy.find((o) => o.slug === odrudaSlug);
}

export interface IndexableOdrudaEntry {
  plodina_slug: string;
  plodina_name: string;
  odruda: Odruda;
}

export function listIndexableOdrudy(): IndexableOdrudaEntry[] {
  const out: IndexableOdrudaEntry[] = [];
  for (const p of build()) {
    for (const o of p.odrudy) {
      if (isOdrudaIndexable(o)) {
        out.push({ plodina_slug: p.slug, plodina_name: p.name, odruda: o });
      }
    }
  }
  return out;
}

export interface SkupinaEntry { skupina: Skupina; label: string; count: number }

export function listSkupiny(): SkupinaEntry[] {
  const counts = new Map<Skupina, number>();
  for (const p of build()) counts.set(p.skupina, (counts.get(p.skupina) ?? 0) + 1);
  return Array.from(counts.entries())
    .map(([skupina, count]) => ({ skupina, label: SKUPINA_LABELS[skupina], count }))
    .sort((a, b) => a.label.localeCompare(b.label, 'cs'));
}

export function listPlodinyBySkupina(skupina: Skupina): Plodina[] {
  return build().filter((p) => p.skupina === skupina);
}

/** Deterministický ASCII slug (bez diakritiky, jen [a-z0-9-]). */
export function udrzovatelSlug(name: string): string {
  return name
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    // Polská ł/Ł se NFD nerozkládá (samostatné písmeno) → explicitně na l
    .replace(/[łŁ]/g, 'l')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export interface UdrzovatelEntry {
  slug: string;
  name: string;
  odrudy: { plodina_slug: string; plodina_name: string; odruda: Odruda }[];
}

export function listUdrzovatele(): UdrzovatelEntry[] {
  const bySlug = new Map<string, UdrzovatelEntry>();
  for (const p of build()) {
    for (const o of p.odrudy) {
      const name = (o.udrzovatel ?? '').trim();
      if (!name) continue;
      const slug = udrzovatelSlug(name);
      if (!slug) continue;
      const entry = bySlug.get(slug) ?? { slug, name, odrudy: [] };
      entry.odrudy.push({ plodina_slug: p.slug, plodina_name: p.name, odruda: o });
      bySlug.set(slug, entry);
    }
  }
  return Array.from(bySlug.values()).sort((a, b) => a.name.localeCompare(b.name, 'cs'));
}

export function getUdrzovatel(slug: string): UdrzovatelEntry | undefined {
  return listUdrzovatele().find((u) => u.slug === slug);
}

/** Práh pro indexaci facetu udržovatele (anti-thin). */
export const UDRZOVATEL_INDEX_MIN = 2;

export function listIndexableUdrzovatele(): UdrzovatelEntry[] {
  return listUdrzovatele().filter((u) => u.odrudy.length >= UDRZOVATEL_INDEX_MIN);
}
