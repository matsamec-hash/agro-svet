// Cross-brand competitor finder for stroje model pages.
// Returns models in the same category from different brands within ±15% power range.
// Preference: current production over historical, closer power_hp first.

import type { StrojFlatModel, StrojKategorie } from './stroje';
import { getAllModels } from './stroje';

interface CompetitorOptions {
  /** Tolerance in percent of source power_hp (e.g. 15 → ±15%). */
  tolerancePct?: number;
  /** Max number of competitors to return. */
  limit?: number;
}

interface SourceModel {
  slug: string;
  brand_slug: string;
  category: StrojKategorie;
  power_hp: number | null;
  year_to: number | null;
}

export function findCompetitors(
  source: SourceModel,
  options: CompetitorOptions = {},
): StrojFlatModel[] {
  if (source.power_hp === null) return [];
  const { tolerancePct = 15, limit = 6 } = options;

  const minHp = source.power_hp * (1 - tolerancePct / 100);
  const maxHp = source.power_hp * (1 + tolerancePct / 100);

  const sourceIsCurrent = source.year_to === null;

  const candidates = getAllModels().filter(
    (m) =>
      m.category === source.category &&
      m.brand_slug !== source.brand_slug &&
      m.power_hp !== null &&
      m.power_hp >= minHp &&
      m.power_hp <= maxHp,
  );

  candidates.sort((a, b) => {
    // Prefer current models when source is current; reversed for historical sources.
    const aCurrent = a.year_to === null;
    const bCurrent = b.year_to === null;
    if (aCurrent !== bCurrent) {
      if (sourceIsCurrent) return aCurrent ? -1 : 1;
      return aCurrent ? 1 : -1;
    }
    // Then by closeness to source power.
    const aDiff = Math.abs((a.power_hp ?? 0) - (source.power_hp ?? 0));
    const bDiff = Math.abs((b.power_hp ?? 0) - (source.power_hp ?? 0));
    if (aDiff !== bDiff) return aDiff - bDiff;
    // Tiebreak: brand alphabetical for deterministic SSR (same output across requests).
    return a.brand_slug.localeCompare(b.brand_slug);
  });

  // Deduplicate by brand — show one model per competing brand.
  const byBrand = new Map<string, StrojFlatModel>();
  for (const c of candidates) {
    if (!byBrand.has(c.brand_slug)) byBrand.set(c.brand_slug, c);
    if (byBrand.size >= limit) break;
  }
  return [...byBrand.values()];
}

/** Generate a use-case description from power range + category. Static, factual. */
export function useCaseDescription(category: StrojKategorie, powerHp: number | null): string | null {
  if (category === 'traktory' && powerHp !== null) {
    if (powerHp < 50) {
      return 'Kompaktní traktor pro malé hospodářství, sady, vinice a komunální využití. Vhodný pro výměru do přibližně 30 hektarů.';
    }
    if (powerHp < 90) {
      return 'Univerzální traktor pro menší a střední farmy s výměrou 30–100 hektarů. Zvládne polní práci s lehčími agregáty, sklizeň trávy a manipulaci s nakladačem.';
    }
    if (powerHp < 160) {
      return 'Středně výkonný traktor pro farmy s výměrou 100–300 hektarů. Optimální pro orbu, secí kombinace, polní postřik a lisování.';
    }
    if (powerHp < 250) {
      return 'Výkonný traktor pro velké farmy s výměrou 300–600 hektarů. Plný potenciál uplatní u širokých secích kombinací, kypřičů a samochodných postřikovačů.';
    }
    return 'Vlajkový traktor pro velkovýrobu s výměrou nad 500 hektarů. Určen pro nejširší agregace, autonomní řízení a maximální denní produktivitu na poli.';
  }
  if (category === 'kombajny' && powerHp !== null) {
    if (powerHp < 250) {
      return 'Kompaktní sklízecí mlátička pro střední farmy s plochou obilnin do 200 hektarů. Záběr žacího stolu typicky 5–6 m.';
    }
    if (powerHp < 400) {
      return 'Středně výkonná sklízecí mlátička pro farmy s plochou obilnin 200–500 hektarů. Záběr 6–9 m, kapacita zásobníku obvykle 8 000–10 000 l.';
    }
    if (powerHp < 600) {
      return 'Výkonná sklízecí mlátička pro velké farmy s plochou obilnin nad 500 hektarů. Záběr 9–12 m, kapacita zásobníku 10 000–14 000 l.';
    }
    return 'Vlajková sklízecí mlátička pro velkovýrobu — největší záběry (12 m+), zásobník 14 000+ l, určeno pro nejvyšší denní produktivitu na rozsáhlých polích.';
  }
  return null;
}
