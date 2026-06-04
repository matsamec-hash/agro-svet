// Auto-generates FAQ Q&A from structured StrojModel data.
// Only emits a question when the underlying datum exists — no template padding.
// Returns null if fewer than 3 valid Q&A — short FAQ blocks read as thin content.
//
// Locale-aware: cs větve jsou DOSLOVNÉ originály (byte-identita konstrukcí),
// sk přidáno přes helper L(cs, sk). Default locale='cs' → cs užití beze změny.

import type { FaqItem } from './structured-data';
import type { StrojBrand, StrojModel, StrojKategorie } from './stroje';
import type { Locale } from '../i18n/config';

interface ModelFaqInput {
  brand: Pick<StrojBrand, 'name'>;
  model: StrojModel;
  category: StrojKategorie;
  /** Pretty label for category in singular ("traktor", "kombajn", "stroj"). */
  categorySingular: string;
  /** Live count of bazar listings for this model. Optional. */
  bazarCount?: number;
  /** Locale for the generated prose. Default 'cs' (byte-identické s původním). */
  locale?: Locale;
}

const VEHICLE_CATEGORIES = new Set<StrojKategorie>(['traktory', 'kombajny']);

export function generateModelFaq({
  brand,
  model,
  category,
  categorySingular,
  bazarCount,
  locale = 'cs',
}: ModelFaqInput): FaqItem[] | null {
  const isSk = locale === 'sk';
  const L = (cs: string, sk: string): string => (isSk ? sk : cs);
  const fmtNumber = (n: number): string => n.toLocaleString(isSk ? 'sk-SK' : 'cs-CZ');

  const fullName = `${brand.name} ${model.name}`;
  const items: FaqItem[] = [];

  const yearPhrase = (): string | null => {
    if (!model.year_from) return null;
    if (model.year_to) return `${model.year_from}–${model.year_to}`;
    return L(`od roku ${model.year_from}`, `od roku ${model.year_from}`);
  };

  // Power — most-asked question for vehicles + self-propelled machines.
  if (model.power_hp) {
    const kwPart = model.power_kw ? ` (${model.power_kw} kW)` : '';
    const enginePart = model.engine
      ? L(` Pohání ho ${model.engine}.`, ` Poháňa ho ${model.engine}.`)
      : '';
    items.push({
      q: L(`Jaký výkon má ${fullName}?`, `Aký výkon má ${fullName}?`),
      a: L(
        `${fullName} má jmenovitý výkon ${model.power_hp} koní${kwPart}.${enginePart}`,
        `${fullName} má menovitý výkon ${model.power_hp} koní${kwPart}.${enginePart}`,
      ),
    });
  }

  // Weight.
  if (model.weight_kg) {
    items.push({
      q: L(`Kolik váží ${fullName}?`, `Koľko váži ${fullName}?`),
      a: L(
        `Provozní hmotnost ${fullName} je přibližně ${fmtNumber(model.weight_kg)} kg. Konkrétní hmotnost se může lišit podle vybavení a osazené zátěže.`,
        `Prevádzková hmotnosť ${fullName} je približne ${fmtNumber(model.weight_kg)} kg. Konkrétna hmotnosť sa môže líšiť podľa výbavy a osadenej záťaže.`,
      ),
    });
  }

  // Production years.
  const yr = yearPhrase();
  if (yr) {
    if (model.year_to) {
      items.push({
        q: L(`V jakých letech se ${fullName} vyráběl?`, `V akých rokoch sa ${fullName} vyrábal?`),
        a: L(
          `${fullName} se vyráběl v letech ${yr}. Na sekundárním trhu (bazar) zůstává běžně dostupný a náhradní díly jsou stále nabízeny.`,
          `${fullName} sa vyrábal v rokoch ${yr}. Na sekundárnom trhu (bazár) zostáva bežne dostupný a náhradné diely sú stále ponúkané.`,
        ),
      });
    } else {
      items.push({
        q: L(`Vyrábí se ${fullName} stále?`, `Vyrába sa ${fullName} stále?`),
        a: L(
          `Ano, ${fullName} je v aktuální výrobní nabídce — vyrábí se ${yr} a patří mezi modely, které lze nově objednat.`,
          `Áno, ${fullName} je v aktuálnej výrobnej ponuke — vyrába sa ${yr} a patrí medzi modely, ktoré možno novo objednať.`,
        ),
      });
    }
  }

  // Transmission (vehicles).
  if (model.transmission && VEHICLE_CATEGORIES.has(category)) {
    items.push({
      q: L(`Jakou převodovku má ${fullName}?`, `Akú prevodovku má ${fullName}?`),
      a: L(
        `${fullName} má převodovku: ${model.transmission}.`,
        `${fullName} má prevodovku: ${model.transmission}.`,
      ),
    });
  }

  // Combine-specific: cutting width.
  if (category === 'kombajny' && model.cutting_width_m) {
    items.push({
      q: L(`Jaký záběr žacího stolu má ${fullName}?`, `Aký záber žacieho stola má ${fullName}?`),
      a: L(
        `${fullName} pracuje se žacím stolem o záběru až ${model.cutting_width_m} m. Konkrétní záběr záleží na zvoleném adaptéru a typu plodiny.`,
        `${fullName} pracuje so žacím stolom so záberom až ${model.cutting_width_m} m. Konkrétny záber závisí od zvoleného adaptéra a typu plodiny.`,
      ),
    });
  }

  // Combine-specific: grain tank.
  if (category === 'kombajny' && model.grain_tank_l) {
    items.push({
      q: L(`Jak velký je zásobník zrna u ${fullName}?`, `Aký veľký je zásobník zrna pri ${fullName}?`),
      a: L(
        `Zásobník zrna ${fullName} pojme ${fmtNumber(model.grain_tank_l)} litrů. Vyplatí se zejména na velkých půdních blocích, kde delší interval vyložení snižuje prostoje.`,
        `Zásobník zrna ${fullName} pojme ${fmtNumber(model.grain_tank_l)} litrov. Oplatí sa najmä na veľkých pôdnych blokoch, kde dlhší interval vyloženia znižuje prestoje.`,
      ),
    });
  }

  // Implement-specific: working width.
  if (model.pracovni_zaber_m) {
    items.push({
      q: L(`Jaký pracovní záběr má ${fullName}?`, `Aký pracovný záber má ${fullName}?`),
      a: L(
        `Pracovní záběr ${fullName} je ${model.pracovni_zaber_m} m. Záběr ovlivňuje rychlost zpracování plochy a požadavky na výkon agregovaného traktoru.`,
        `Pracovný záber ${fullName} je ${model.pracovni_zaber_m} m. Záber ovplyvňuje rýchlosť spracovania plochy a požiadavky na výkon agregovaného traktora.`,
      ),
    });
  }

  // Implement-specific: required tractor power.
  if (model.prikon_traktor_hp_min || model.prikon_traktor_hp_max) {
    const min = model.prikon_traktor_hp_min;
    const max = model.prikon_traktor_hp_max;
    const range = min && max ? `${min}–${max}` : (min ?? max);
    items.push({
      q: L(`Jaký traktor potřebuje ${fullName}?`, `Aký traktor potrebuje ${fullName}?`),
      a: L(
        `Pro agregaci ${fullName} výrobce doporučuje traktor s výkonem ${range} koní. Slabší traktor sníží pracovní rychlost; výrazně silnější traktor nepřinese plný benefit a může přetížit záběs.`,
        `Pre agregáciu ${fullName} výrobca odporúča traktor s výkonom ${range} koní. Slabší traktor zníži pracovnú rýchlosť; výrazne silnejší traktor neprinesie plný benefit a môže preťažiť záves.`,
      ),
    });
  }

  // Implement-specific: hitch type.
  if (model.typ_zavesu) {
    const labelsCs: Record<string, string> = {
      neseny: 'nesený (tříbodový závěs)',
      tazeny: 'tažený za horní oj',
      poloneseny: 'polonesený (kombinace nese/táhne)',
      samojizdny: 'samojízdný (vlastní pohon)',
      navesny: 'návěsný',
    };
    const labelsSk: Record<string, string> = {
      neseny: 'nesený (trojbodový záves)',
      tazeny: 'ťahaný za horné oje',
      poloneseny: 'polonesený (kombinácia nesie/ťahá)',
      samojizdny: 'samohybný (vlastný pohon)',
      navesny: 'návesový',
    };
    const labels = isSk ? labelsSk : labelsCs;
    const label = labels[model.typ_zavesu] ?? model.typ_zavesu;
    items.push({
      q: L(`Jak se ${fullName} připojuje k traktoru?`, `Ako sa ${fullName} pripája k traktoru?`),
      a: L(
        `${fullName} je ${label}. Při výběru traktoru tomu odpovídá kategorie tříbodového závěsu a hydraulická kapacita.`,
        `${fullName} je ${label}. Pri výbere traktora tomu zodpovedá kategória trojbodového závesu a hydraulická kapacita.`,
      ),
    });
  }

  // Bazar availability — closing CTA-style question.
  if (bazarCount !== undefined && bazarCount > 0) {
    const inflect = isSk
      ? bazarCount === 1 ? 'jeden inzerát' : bazarCount < 5 ? `${bazarCount} inzeráty` : `${bazarCount} inzerátov`
      : bazarCount === 1 ? 'jeden inzerát' : bazarCount < 5 ? `${bazarCount} inzeráty` : `${bazarCount} inzerátů`;
    const what = isSk
      ? categorySingular === 'traktor' ? 'tohto traktora' : categorySingular === 'kombajn' ? 'tohto kombajnu' : 'tohto stroja'
      : categorySingular === 'traktor' ? 'tohoto traktoru' : categorySingular === 'kombajn' ? 'této sklízecí mlátičky' : 'tohoto stroje';
    items.push({
      q: L(`Lze koupit ${fullName} v bazaru?`, `Dá sa kúpiť ${fullName} v bazári?`),
      a: L(
        `Ano, v Agro bazaru je aktuálně ${inflect} ${what}. Kontakt přímo na prodejce, bez provize.`,
        `Áno, v Agro bazári je aktuálne ${inflect} ${what}. Kontakt priamo na predajcu, bez provízie.`,
      ),
    });
  }

  // Quality gate: don't emit FAQ schema for thin content.
  if (items.length < 3) return null;
  return items;
}
