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
  /** Cenové rozpětí z aktivních bazarových inzerátů (CZK). Optional. */
  priceStats?: { min: number; max: number; count: number };
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
  priceStats,
  locale = 'cs',
}: ModelFaqInput): FaqItem[] | null {
  const isSk = locale === 'sk';
  const isUk = locale === 'uk';
  const isPl = locale === 'pl';
  const L = (cs: string, sk: string, uk: string, pl: string): string => (isSk ? sk : isUk ? uk : isPl ? pl : cs);
  const fmtNumber = (n: number): string =>
    n.toLocaleString(isSk ? 'sk-SK' : isUk ? 'uk-UA' : isPl ? 'pl-PL' : 'cs-CZ');

  const fullName = `${brand.name} ${model.name}`;
  const items: FaqItem[] = [];

  const yearPhrase = (): string | null => {
    if (!model.year_from) return null;
    if (model.year_to) return `${model.year_from}–${model.year_to}`;
    return L(`od roku ${model.year_from}`, `od roku ${model.year_from}`, `з ${model.year_from} року`, `od ${model.year_from} roku`);
  };

  // Power — most-asked question for vehicles + self-propelled machines.
  if (model.power_hp) {
    const kwPart = model.power_kw ? ` (${model.power_kw} kW)` : '';
    const enginePart = model.engine
      ? L(` Pohání ho ${model.engine}.`, ` Poháňa ho ${model.engine}.`, ` Його приводить у рух ${model.engine}.`, ` Napędza go silnik ${model.engine}.`)
      : '';
    items.push({
      q: L(`Jaký výkon má ${fullName}?`, `Aký výkon má ${fullName}?`, `Яку потужність має ${fullName}?`, `Jaką moc ma ${fullName}?`),
      a: L(
        `${fullName} má jmenovitý výkon ${model.power_hp} koní${kwPart}.${enginePart}`,
        `${fullName} má menovitý výkon ${model.power_hp} koní${kwPart}.${enginePart}`,
        `${fullName} має номінальну потужність ${model.power_hp} к.с.${kwPart}.${enginePart}`,
        `${fullName} ma moc nominalną ${model.power_hp} KM${kwPart}.${enginePart}`,
      ),
    });
  }

  // Weight.
  if (model.weight_kg) {
    items.push({
      q: L(`Kolik váží ${fullName}?`, `Koľko váži ${fullName}?`, `Скільки важить ${fullName}?`, `Ile waży ${fullName}?`),
      a: L(
        `Provozní hmotnost ${fullName} je přibližně ${fmtNumber(model.weight_kg)} kg. Konkrétní hmotnost se může lišit podle vybavení a osazené zátěže.`,
        `Prevádzková hmotnosť ${fullName} je približne ${fmtNumber(model.weight_kg)} kg. Konkrétna hmotnosť sa môže líšiť podľa výbavy a osadenej záťaže.`,
        `Робоча маса ${fullName} становить приблизно ${fmtNumber(model.weight_kg)} кг. Конкретна маса може відрізнятися залежно від комплектації та встановленого баласту.`,
        `Masa eksploatacyjna ${fullName} wynosi około ${fmtNumber(model.weight_kg)} kg. Konkretna masa może się różnić w zależności od wyposażenia i zamontowanego balastu.`,
      ),
    });
  }

  // Production years.
  const yr = yearPhrase();
  if (yr) {
    if (model.year_to) {
      items.push({
        q: L(`V jakých letech se ${fullName} vyráběl?`, `V akých rokoch sa ${fullName} vyrábal?`, `У які роки випускався ${fullName}?`, `W jakich latach produkowano ${fullName}?`),
        a: L(
          `${fullName} se vyráběl v letech ${yr}. Na sekundárním trhu (bazar) zůstává běžně dostupný a náhradní díly jsou stále nabízeny.`,
          `${fullName} sa vyrábal v rokoch ${yr}. Na sekundárnom trhu (bazár) zostáva bežne dostupný a náhradné diely sú stále ponúkané.`,
          `${fullName} випускався у ${yr} роках. На вторинному ринку залишається загальнодоступним, а запасні частини й досі пропонуються.`,
          `${fullName} był produkowany w latach ${yr}. Na rynku wtórnym (giełda) pozostaje powszechnie dostępny, a części zamienne są nadal oferowane.`,
        ),
      });
    } else {
      items.push({
        q: L(`Vyrábí se ${fullName} stále?`, `Vyrába sa ${fullName} stále?`, `Чи ${fullName} досі випускається?`, `Czy ${fullName} jest nadal produkowany?`),
        a: L(
          `Ano, ${fullName} je v aktuální výrobní nabídce — vyrábí se ${yr} a patří mezi modely, které lze nově objednat.`,
          `Áno, ${fullName} je v aktuálnej výrobnej ponuke — vyrába sa ${yr} a patrí medzi modely, ktoré možno novo objednať.`,
          `Так, ${fullName} є в актуальній виробничій пропозиції — випускається ${yr} і належить до моделей, які можна замовити як нові.`,
          `Tak, ${fullName} jest w aktualnej ofercie produkcyjnej — produkowany jest ${yr} i należy do modeli, które można nowo zamówić.`,
        ),
      });
    }
  }

  // Transmission (vehicles).
  if (model.transmission && VEHICLE_CATEGORIES.has(category)) {
    items.push({
      q: L(`Jakou převodovku má ${fullName}?`, `Akú prevodovku má ${fullName}?`, `Яку коробку передач має ${fullName}?`, `Jaką skrzynię biegów ma ${fullName}?`),
      a: L(
        `${fullName} má převodovku: ${model.transmission}.`,
        `${fullName} má prevodovku: ${model.transmission}.`,
        `${fullName} має коробку передач: ${model.transmission}.`,
        `${fullName} ma skrzynię biegów: ${model.transmission}.`,
      ),
    });
  }

  // Combine-specific: cutting width.
  if (category === 'kombajny' && model.cutting_width_m) {
    items.push({
      q: L(`Jaký záběr žacího stolu má ${fullName}?`, `Aký záber žacieho stola má ${fullName}?`, `Яку ширину захвату жниварки має ${fullName}?`, `Jaką szerokość roboczą hederem ma ${fullName}?`),
      a: L(
        `${fullName} pracuje se žacím stolem o záběru až ${model.cutting_width_m} m. Konkrétní záběr záleží na zvoleném adaptéru a typu plodiny.`,
        `${fullName} pracuje so žacím stolom so záberom až ${model.cutting_width_m} m. Konkrétny záber závisí od zvoleného adaptéra a typu plodiny.`,
        `${fullName} працює з жниваркою із шириною захвату до ${model.cutting_width_m} м. Конкретна ширина захвату залежить від обраної жниварки та типу культури.`,
        `${fullName} pracuje z hederem o szerokości roboczej do ${model.cutting_width_m} m. Konkretna szerokość robocza zależy od wybranego adaptera i rodzaju uprawy.`,
      ),
    });
  }

  // Combine-specific: grain tank.
  if (category === 'kombajny' && model.grain_tank_l) {
    items.push({
      q: L(`Jak velký je zásobník zrna u ${fullName}?`, `Aký veľký je zásobník zrna pri ${fullName}?`, `Який об'єм бункера для зерна у ${fullName}?`, `Jak duży jest zbiornik ziarna w ${fullName}?`),
      a: L(
        `Zásobník zrna ${fullName} pojme ${fmtNumber(model.grain_tank_l)} litrů. Vyplatí se zejména na velkých půdních blocích, kde delší interval vyložení snižuje prostoje.`,
        `Zásobník zrna ${fullName} pojme ${fmtNumber(model.grain_tank_l)} litrov. Oplatí sa najmä na veľkých pôdnych blokoch, kde dlhší interval vyloženia znižuje prestoje.`,
        `Бункер для зерна ${fullName} вміщує ${fmtNumber(model.grain_tank_l)} літрів. Це вигідно насамперед на великих полях, де довший інтервал між вивантаженнями зменшує простої.`,
        `Zbiornik ziarna ${fullName} mieści ${fmtNumber(model.grain_tank_l)} litrów. Opłaca się szczególnie na dużych polach, gdzie dłuższy odstęp opróżniania zmniejsza przestoje.`,
      ),
    });
  }

  // Implement-specific: working width.
  if (model.pracovni_zaber_m) {
    items.push({
      q: L(`Jaký pracovní záběr má ${fullName}?`, `Aký pracovný záber má ${fullName}?`, `Яку робочу ширину захвату має ${fullName}?`, `Jaką szerokość roboczą ma ${fullName}?`),
      a: L(
        `Pracovní záběr ${fullName} je ${model.pracovni_zaber_m} m. Záběr ovlivňuje rychlost zpracování plochy a požadavky na výkon agregovaného traktoru.`,
        `Pracovný záber ${fullName} je ${model.pracovni_zaber_m} m. Záber ovplyvňuje rýchlosť spracovania plochy a požiadavky na výkon agregovaného traktora.`,
        `Робоча ширина захвату ${fullName} становить ${model.pracovni_zaber_m} м. Ширина захвату впливає на швидкість обробітку площі та вимоги до потужності агрегованого трактора.`,
        `Szerokość robocza ${fullName} wynosi ${model.pracovni_zaber_m} m. Szerokość robocza wpływa na szybkość uprawy powierzchni i wymagania co do mocy agregowanego ciągnika.`,
      ),
    });
  }

  // Implement-specific: required tractor power.
  if (model.prikon_traktor_hp_min || model.prikon_traktor_hp_max) {
    const min = model.prikon_traktor_hp_min;
    const max = model.prikon_traktor_hp_max;
    const range = min && max ? `${min}–${max}` : (min ?? max);
    items.push({
      q: L(`Jaký traktor potřebuje ${fullName}?`, `Aký traktor potrebuje ${fullName}?`, `Який трактор потрібен для ${fullName}?`, `Jakiego ciągnika wymaga ${fullName}?`),
      a: L(
        `Pro agregaci ${fullName} výrobce doporučuje traktor s výkonem ${range} koní. Slabší traktor sníží pracovní rychlost; výrazně silnější traktor nepřinese plný benefit a může přetížit záběs.`,
        `Pre agregáciu ${fullName} výrobca odporúča traktor s výkonom ${range} koní. Slabší traktor zníži pracovnú rýchlosť; výrazne silnejší traktor neprinesie plný benefit a môže preťažiť záves.`,
        `Для агрегатування ${fullName} виробник рекомендує трактор потужністю ${range} к.с. Слабший трактор знизить робочу швидкість; значно потужніший трактор не дасть повної віддачі та може перевантажити зчіпку.`,
        `Do agregowania ${fullName} producent zaleca ciągnik o mocy ${range} KM. Słabszy ciągnik obniży prędkość roboczą; znacznie mocniejszy ciągnik nie przyniesie pełnych korzyści i może przeciążyć TUZ.`,
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
    const labelsUk: Record<string, string> = {
      neseny: 'навісний (триточкове навішування)',
      tazeny: 'причіпний (за верхнє дишло)',
      poloneseny: 'напівнавісний (комбінація несе/тягне)',
      samojizdny: 'самохідний (власний привід)',
      navesny: 'напівпричіпний',
    };
    const labelsPl: Record<string, string> = {
      neseny: 'zawieszany (trzypunktowy układ zawieszenia)',
      tazeny: 'przyczepiany (za górny zaczep)',
      poloneseny: 'półzawieszany (kombinacja niesienia i ciągnięcia)',
      samojizdny: 'samojezdny (własny napęd)',
      navesny: 'półprzyczepiany',
    };
    const labels = isSk ? labelsSk : isUk ? labelsUk : isPl ? labelsPl : labelsCs;
    const label = labels[model.typ_zavesu] ?? model.typ_zavesu;
    items.push({
      q: L(`Jak se ${fullName} připojuje k traktoru?`, `Ako sa ${fullName} pripája k traktoru?`, `Як ${fullName} приєднується до трактора?`, `Jak ${fullName} jest podłączany do ciągnika?`),
      a: L(
        `${fullName} je ${label}. Při výběru traktoru tomu odpovídá kategorie tříbodového závěsu a hydraulická kapacita.`,
        `${fullName} je ${label}. Pri výbere traktora tomu zodpovedá kategória trojbodového závesu a hydraulická kapacita.`,
        `${fullName} — ${label}. Під час вибору трактора цьому відповідає категорія триточкового навішування та гідравлічна продуктивність.`,
        `${fullName} jest ${label}. Przy wyborze ciągnika należy sprawdzić kategorię TUZ i wydajność hydrauliki.`,
      ),
    });
  }

  // Price — from active bazar listings. Naplňuje „cena" dotazy.
  if (priceStats) {
    const lo = fmtNumber(priceStats.min);
    const hi = fmtNumber(priceStats.max);
    const rangePhrase = priceStats.min === priceStats.max ? `${lo} Kč` : `${lo} – ${hi} Kč`;
    items.push({
      q: L(`Kolik stojí ${fullName}?`, `Koľko stojí ${fullName}?`, `Скільки коштує ${fullName}?`, `Ile kosztuje ${fullName}?`),
      a: L(
        `Podle aktuálních inzerátů v Agro bazaru se ${fullName} prodává za ${rangePhrase}. Cena se liší podle roku výroby, počtu motohodin a stavu stroje.`,
        `Podľa aktuálnych inzerátov v Agro bazári sa ${fullName} predáva za ${rangePhrase}. Cena sa líši podľa roku výroby, počtu motohodín a stavu stroja.`,
        `За актуальними оголошеннями в Агро базарі ${fullName} продається за ${rangePhrase}. Ціна залежить від року випуску, кількості мотогодин і стану машини.`,
        `Według aktualnych ogłoszeń w Agro giełdzie ${fullName} sprzedawany jest za ${rangePhrase}. Cena zależy od roku produkcji, liczby motogodzin i stanu maszyny.`,
      ),
    });
  }

  // Bazar availability — closing CTA-style question.
  if (bazarCount !== undefined && bazarCount > 0) {
    const ukPlural = (n: number): string => {
      const mod10 = n % 10;
      const mod100 = n % 100;
      if (mod10 === 1 && mod100 !== 11) return 'оголошення';
      if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return 'оголошення';
      return 'оголошень';
    };
    const plPlural = (n: number): string => {
      const mod10 = n % 10, mod100 = n % 100;
      if (mod10 === 1 && mod100 !== 11) return 'ogłoszenie';
      if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return 'ogłoszenia';
      return 'ogłoszeń';
    };
    const inflect = isSk
      ? bazarCount === 1 ? 'jeden inzerát' : bazarCount < 5 ? `${bazarCount} inzeráty` : `${bazarCount} inzerátov`
      : isUk
        ? bazarCount === 1 ? 'одне оголошення' : `${bazarCount} ${ukPlural(bazarCount)}`
        : isPl
          ? bazarCount === 1 ? 'jedno ogłoszenie' : `${bazarCount} ${plPlural(bazarCount)}`
          : bazarCount === 1 ? 'jeden inzerát' : bazarCount < 5 ? `${bazarCount} inzeráty` : `${bazarCount} inzerátů`;
    const what = isSk
      ? categorySingular === 'traktor' ? 'tohto traktora' : categorySingular === 'kombajn' ? 'tohto kombajnu' : 'tohto stroja'
      : isUk
        ? categorySingular === 'traktor' ? 'цього трактора' : categorySingular === 'kombajn' ? 'цього комбайна' : 'цієї машини'
        : isPl
          ? categorySingular === 'traktor' ? 'tego ciągnika' : categorySingular === 'kombajn' ? 'tego kombajnu' : 'tej maszyny'
          : categorySingular === 'traktor' ? 'tohoto traktoru' : categorySingular === 'kombajn' ? 'této sklízecí mlátičky' : 'tohoto stroje';
    items.push({
      q: L(`Lze koupit ${fullName} v bazaru?`, `Dá sa kúpiť ${fullName} v bazári?`, `Чи можна купити ${fullName} на ринку вживаної техніки?`, `Czy można kupić ${fullName} na giełdzie używanych maszyn?`),
      a: L(
        `Ano, v Agro bazaru je aktuálně ${inflect} ${what}. Kontakt přímo na prodejce, bez provize.`,
        `Áno, v Agro bazári je aktuálne ${inflect} ${what}. Kontakt priamo na predajcu, bez provízie.`,
        `Так, в Агро базарі наразі ${inflect} ${what}. Контакт безпосередньо з продавцем, без комісії.`,
        `Tak, w Agro giełdzie jest aktualnie ${inflect} ${what}. Kontakt bezpośrednio ze sprzedawcą, bez prowizji.`,
      ),
    });
  }

  // Quality gate: don't emit FAQ schema for thin content.
  if (items.length < 3) return null;
  return items;
}
