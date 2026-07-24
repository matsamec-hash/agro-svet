import { attributesForCategory, type AttrDef } from './bazar-attributes';
import { findCategory } from './bazar-landing';

export interface LandingEntry {
  slug: string;                       // 'klimatizace' | 'pohon-4x4'
  def: AttrDef;
  value: true | string;               // bool → true, enum → hodnota
  label: string;                      // čitelný štítek (pro chip/H1)
  filter: Record<string, unknown>;    // pro .contains('attributes', filter)
}

/** SEO landing entries pro kategorii — jen atributy se `seoLanding: true`. */
export function landingEntriesForCategory(category: string): LandingEntry[] {
  const out: LandingEntry[] = [];
  for (const def of attributesForCategory(category)) {
    if (!def.seoLanding) continue;
    if (def.type === 'bool') {
      out.push({ slug: def.key, def, value: true, label: def.label, filter: { [def.key]: true } });
    } else if (def.type === 'enum') {
      for (const opt of def.options ?? []) {
        out.push({
          slug: `${def.key}-${opt}`,
          def,
          value: opt,
          label: `${def.label}: ${def.optionLabels?.[opt] ?? opt}`,
          filter: { [def.key]: opt },
        });
      }
    }
  }
  return out;
}

/** Slug → entry (nebo null, když neexistuje / není seoLanding / nepatří kategorii). */
export function parseAttributeLandingSlug(slug: string, category: string): LandingEntry | null {
  return landingEntriesForCategory(category).find((e) => e.slug === slug) ?? null;
}

/** SEO titulek landing stránky. */
export function attributeLandingTitle(category: string, entry: LandingEntry): string {
  const cat = findCategory(category);
  const catLabel = cat ? cat.label : category;
  return `${catLabel} — ${entry.label.toLowerCase()} | Agro bazar`;
}

/** Krátký úvodní text. */
export function attributeLandingIntro(category: string, entry: LandingEntry, count: number): string {
  const cat = findCategory(category);
  const catLabel = cat ? cat.label.toLowerCase() : category;
  const plural = count === 1 ? 'inzerát' : count >= 2 && count <= 4 ? 'inzeráty' : 'inzerátů';
  return `Nabídka v kategorii ${catLabel} s parametrem „${entry.label.toLowerCase()}". Aktuálně ${count} ${plural}.`;
}
