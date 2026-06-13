// Cross-brand competitor finder for stroje model pages.
// Returns models in the same category from different brands within ±15% power range.
// Preference: current production over historical, closer power_hp first.

import type { StrojFlatModel, StrojKategorie } from './stroje';
import { getAllModels } from './stroje';
import type { Locale } from '../i18n/config';

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

interface ImplementSourceModel {
  slug: string;
  brand_slug: string;
  /** Reálná kategorie (subcategory) — NE top-level funkční skupina. */
  effective_category: StrojKategorie;
  pracovni_zaber_m: number | null;
  year_to: number | null;
}

/**
 * Cross-brand konkurenti pro nářadí — párováno dle pracovního záběru (m).
 * Mirror findCompetitors, ale osa = pracovni_zaber_m a match na effective_category
 * (nářadí je v datech pod funkční skupinou category, reálná kategorie je effective_category).
 * Preference: current production když zdroj current, pak blízkost záběru, tiebreak značka.
 * Dedup: 1 model na konkurenční značku.
 */
export function findImplementCompetitors(
  source: ImplementSourceModel,
  options: CompetitorOptions = {},
): StrojFlatModel[] {
  if (source.pracovni_zaber_m === null) return [];
  const { tolerancePct = 25, limit = 6 } = options;

  const minZ = source.pracovni_zaber_m * (1 - tolerancePct / 100);
  const maxZ = source.pracovni_zaber_m * (1 + tolerancePct / 100);
  // year_to may be undefined (field absent from YAML) or null — both mean "current production".
  const sourceIsCurrent = source.year_to == null;

  const candidates = getAllModels().filter(
    (m) =>
      m.effective_category === source.effective_category &&
      m.brand_slug !== source.brand_slug &&
      m.pracovni_zaber_m !== null &&
      (m.pracovni_zaber_m as number) >= minZ &&
      (m.pracovni_zaber_m as number) <= maxZ,
  );

  candidates.sort((a, b) => {
    const aCurrent = a.year_to == null;
    const bCurrent = b.year_to == null;
    if (aCurrent !== bCurrent) {
      if (sourceIsCurrent) return aCurrent ? -1 : 1;
      return aCurrent ? 1 : -1;
    }
    const aDiff = Math.abs((a.pracovni_zaber_m ?? 0) - (source.pracovni_zaber_m ?? 0));
    const bDiff = Math.abs((b.pracovni_zaber_m ?? 0) - (source.pracovni_zaber_m ?? 0));
    if (aDiff !== bDiff) return aDiff - bDiff;
    return a.brand_slug.localeCompare(b.brand_slug);
  });

  const byBrand = new Map<string, StrojFlatModel>();
  for (const c of candidates) {
    if (!byBrand.has(c.brand_slug)) byBrand.set(c.brand_slug, c);
    if (byBrand.size >= limit) break;
  }
  return [...byBrand.values()];
}

/** Generate a use-case description from power range + category. Static, factual.
 *  cs branch is byte-identical to the original; sk and uk add localized variants. */
export function useCaseDescription(
  category: StrojKategorie,
  powerHp: number | null,
  locale: Locale = 'cs',
): string | null {
  const pick = (cs: string, sk: string, uk: string): string =>
    locale === 'sk' ? sk : locale === 'uk' ? uk : cs;
  if (category === 'traktory' && powerHp !== null) {
    if (powerHp < 50) {
      return pick(
        'Kompaktní traktor pro malé hospodářství, sady, vinice a komunální využití. Vhodný pro výměru do přibližně 30 hektarů.',
        'Kompaktný traktor pre malé hospodárstvo, sady, vinice a komunálne využitie. Vhodný pre výmeru do približne 30 hektárov.',
        'Компактний трактор для невеликого господарства, садів, виноградників і комунального використання. Підходить для площі приблизно до 30 гектарів.',
      );
    }
    if (powerHp < 90) {
      return pick(
        'Univerzální traktor pro menší a střední farmy s výměrou 30–100 hektarů. Zvládne polní práci s lehčími agregáty, sklizeň trávy a manipulaci s nakladačem.',
        'Univerzálny traktor pre menšie a stredné farmy s výmerou 30–100 hektárov. Zvládne poľnú prácu s ľahšími agregátmi, zber trávy a manipuláciu s nakladačom.',
        'Універсальний трактор для невеликих і середніх ферм площею 30–100 гектарів. Упорається з польовими роботами з легшими агрегатами, заготівлею трав і навантажувальними роботами.',
      );
    }
    if (powerHp < 160) {
      return pick(
        'Středně výkonný traktor pro farmy s výměrou 100–300 hektarů. Optimální pro orbu, secí kombinace, polní postřik a lisování.',
        'Stredne výkonný traktor pre farmy s výmerou 100–300 hektárov. Optimálny na orbu, sejacie kombinácie, poľný postrek a lisovanie.',
        'Трактор середньої потужності для ферм площею 100–300 гектарів. Оптимальний для оранки, посівних комбінацій, польового обприскування та пресування.',
      );
    }
    if (powerHp < 250) {
      return pick(
        'Výkonný traktor pro velké farmy s výměrou 300–600 hektarů. Plný potenciál uplatní u širokých secích kombinací, kypřičů a samochodných postřikovačů.',
        'Výkonný traktor pre veľké farmy s výmerou 300–600 hektárov. Plný potenciál uplatní pri širokých sejacích kombináciách, kypričoch a samohybných postrekovačoch.',
        'Потужний трактор для великих ферм площею 300–600 гектарів. Повний потенціал розкриває з широкозахватними посівними комбінаціями, культиваторами та самохідними обприскувачами.',
      );
    }
    return pick(
      'Vlajkový traktor pro velkovýrobu s výměrou nad 500 hektarů. Určen pro nejširší agregace, autonomní řízení a maximální denní produktivitu na poli.',
      'Vlajkový traktor pre veľkovýrobu s výmerou nad 500 hektárov. Určený pre najširšie agregácie, autonómne riadenie a maximálnu dennú produktivitu na poli.',
      'Флагманський трактор для великотоварного виробництва площею понад 500 гектарів. Призначений для найширших агрегацій, автономного керування та максимальної денної продуктивності в полі.',
    );
  }
  if (category === 'kombajny' && powerHp !== null) {
    if (powerHp < 250) {
      return pick(
        'Kompaktní sklízecí mlátička pro střední farmy s plochou obilnin do 200 hektarů. Záběr žacího stolu typicky 5–6 m.',
        'Kompaktný kombajn pre stredné farmy s plochou obilnín do 200 hektárov. Záber žacieho stola typicky 5–6 m.',
        'Компактний зернозбиральний комбайн для середніх ферм із площею зернових до 200 гектарів. Ширина захвату жниварки зазвичай 5–6 м.',
      );
    }
    if (powerHp < 400) {
      return pick(
        'Středně výkonná sklízecí mlátička pro farmy s plochou obilnin 200–500 hektarů. Záběr 6–9 m, kapacita zásobníku obvykle 8 000–10 000 l.',
        'Stredne výkonný kombajn pre farmy s plochou obilnín 200–500 hektárov. Záber 6–9 m, kapacita zásobníka obvykle 8 000–10 000 l.',
        'Зернозбиральний комбайн середньої потужності для ферм із площею зернових 200–500 гектарів. Ширина захвату 6–9 м, об’єм бункера зазвичай 8 000–10 000 л.',
      );
    }
    if (powerHp < 600) {
      return pick(
        'Výkonná sklízecí mlátička pro velké farmy s plochou obilnin nad 500 hektarů. Záběr 9–12 m, kapacita zásobníku 10 000–14 000 l.',
        'Výkonný kombajn pre veľké farmy s plochou obilnín nad 500 hektárov. Záber 9–12 m, kapacita zásobníka 10 000–14 000 l.',
        'Потужний зернозбиральний комбайн для великих ферм із площею зернових понад 500 гектарів. Ширина захвату 9–12 м, об’єм бункера 10 000–14 000 л.',
      );
    }
    return pick(
      'Vlajková sklízecí mlátička pro velkovýrobu — největší záběry (12 m+), zásobník 14 000+ l, určeno pro nejvyšší denní produktivitu na rozsáhlých polích.',
      'Vlajkový kombajn pre veľkovýrobu — najväčšie zábery (12 m+), zásobník 14 000+ l, určené pre najvyššiu dennú produktivitu na rozsiahlych poliach.',
      'Флагманський зернозбиральний комбайн для великотоварного виробництва — найбільша ширина захвату (12 м+), бункер 14 000+ л, призначений для найвищої денної продуктивності на великих полях.',
    );
  }
  return null;
}
