// Auto-generates FAQ Q&A from structured StrojModel data.
// Only emits a question when the underlying datum exists — no template padding.
// Returns null if fewer than 3 valid Q&A — short FAQ blocks read as thin content.

import type { FaqItem } from './structured-data';
import type { StrojBrand, StrojModel, StrojKategorie } from './stroje';

interface ModelFaqInput {
  brand: Pick<StrojBrand, 'name'>;
  model: StrojModel;
  category: StrojKategorie;
  /** Pretty label for category in singular ("traktor", "kombajn", "stroj"). */
  categorySingular: string;
  /** Live count of bazar listings for this model. Optional. */
  bazarCount?: number;
}

const VEHICLE_CATEGORIES = new Set<StrojKategorie>(['traktory', 'kombajny']);

function fmtNumber(n: number): string {
  return n.toLocaleString('cs-CZ');
}

function yearPhrase(model: StrojModel): string | null {
  if (!model.year_from) return null;
  if (model.year_to) return `${model.year_from}–${model.year_to}`;
  return `od roku ${model.year_from}`;
}

export function generateModelFaq({
  brand,
  model,
  category,
  categorySingular,
  bazarCount,
}: ModelFaqInput): FaqItem[] | null {
  const fullName = `${brand.name} ${model.name}`;
  const items: FaqItem[] = [];

  // Power — most-asked question for vehicles + self-propelled machines.
  if (model.power_hp) {
    const kwPart = model.power_kw ? ` (${model.power_kw} kW)` : '';
    const enginePart = model.engine ? ` Pohání ho ${model.engine}.` : '';
    items.push({
      q: `Jaký výkon má ${fullName}?`,
      a: `${fullName} má jmenovitý výkon ${model.power_hp} koní${kwPart}.${enginePart}`,
    });
  }

  // Weight.
  if (model.weight_kg) {
    items.push({
      q: `Kolik váží ${fullName}?`,
      a: `Provozní hmotnost ${fullName} je přibližně ${fmtNumber(model.weight_kg)} kg. Konkrétní hmotnost se může lišit podle vybavení a osazené zátěže.`,
    });
  }

  // Production years.
  const yr = yearPhrase(model);
  if (yr) {
    if (model.year_to) {
      items.push({
        q: `V jakých letech se ${fullName} vyráběl?`,
        a: `${fullName} se vyráběl v letech ${yr}. Na sekundárním trhu (bazar) zůstává běžně dostupný a náhradní díly jsou stále nabízeny.`,
      });
    } else {
      items.push({
        q: `Vyrábí se ${fullName} stále?`,
        a: `Ano, ${fullName} je v aktuální výrobní nabídce — vyrábí se ${yr} a patří mezi modely, které lze nově objednat.`,
      });
    }
  }

  // Transmission (vehicles).
  if (model.transmission && VEHICLE_CATEGORIES.has(category)) {
    items.push({
      q: `Jakou převodovku má ${fullName}?`,
      a: `${fullName} má převodovku: ${model.transmission}.`,
    });
  }

  // Combine-specific: cutting width.
  if (category === 'kombajny' && model.cutting_width_m) {
    items.push({
      q: `Jaký záběr žacího stolu má ${fullName}?`,
      a: `${fullName} pracuje se žacím stolem o záběru až ${model.cutting_width_m} m. Konkrétní záběr záleží na zvoleném adaptéru a typu plodiny.`,
    });
  }

  // Combine-specific: grain tank.
  if (category === 'kombajny' && model.grain_tank_l) {
    items.push({
      q: `Jak velký je zásobník zrna u ${fullName}?`,
      a: `Zásobník zrna ${fullName} pojme ${fmtNumber(model.grain_tank_l)} litrů. Vyplatí se zejména na velkých půdních blocích, kde delší interval vyložení snižuje prostoje.`,
    });
  }

  // Implement-specific: working width.
  if (model.pracovni_zaber_m) {
    items.push({
      q: `Jaký pracovní záběr má ${fullName}?`,
      a: `Pracovní záběr ${fullName} je ${model.pracovni_zaber_m} m. Záběr ovlivňuje rychlost zpracování plochy a požadavky na výkon agregovaného traktoru.`,
    });
  }

  // Implement-specific: required tractor power.
  if (model.prikon_traktor_hp_min || model.prikon_traktor_hp_max) {
    const min = model.prikon_traktor_hp_min;
    const max = model.prikon_traktor_hp_max;
    const range = min && max ? `${min}–${max}` : (min ?? max);
    items.push({
      q: `Jaký traktor potřebuje ${fullName}?`,
      a: `Pro agregaci ${fullName} výrobce doporučuje traktor s výkonem ${range} koní. Slabší traktor sníží pracovní rychlost; výrazně silnější traktor nepřinese plný benefit a může přetížit záběs.`,
    });
  }

  // Implement-specific: hitch type.
  if (model.typ_zavesu) {
    const labels: Record<string, string> = {
      neseny: 'nesený (tříbodový závěs)',
      tazeny: 'tažený za horní oj',
      poloneseny: 'polonesený (kombinace nese/táhne)',
      samojizdny: 'samojízdný (vlastní pohon)',
      navesny: 'návěsný',
    };
    const label = labels[model.typ_zavesu] ?? model.typ_zavesu;
    items.push({
      q: `Jak se ${fullName} připojuje k traktoru?`,
      a: `${fullName} je ${label}. Při výběru traktoru tomu odpovídá kategorie tříbodového závěsu a hydraulická kapacita.`,
    });
  }

  // Bazar availability — closing CTA-style question.
  if (bazarCount !== undefined && bazarCount > 0) {
    const inflect = bazarCount === 1 ? 'jeden inzerát' : bazarCount < 5 ? `${bazarCount} inzeráty` : `${bazarCount} inzerátů`;
    items.push({
      q: `Lze koupit ${fullName} v bazaru?`,
      a: `Ano, v Agro bazaru je aktuálně ${inflect} ${categorySingular === 'traktor' ? 'tohoto traktoru' : categorySingular === 'kombajn' ? 'této sklízecí mlátičky' : `tohoto stroje`}. Kontakt přímo na prodejce, bez provize.`,
    });
  }

  // Quality gate: don't emit FAQ schema for thin content.
  if (items.length < 3) return null;
  return items;
}
