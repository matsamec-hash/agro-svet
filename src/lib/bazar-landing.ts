/**
 * Pure helpers for the bazar path-based landing pages
 * (`/bazar/kategorie/[kat]/` and `/bazar/kategorie/[kat]/[znacka]/`).
 *
 * SEO goal: turn the query-string category/brand filters (which Google does not
 * index as landing pages) into crawlable, path-based pages with unique titles,
 * H1, intro copy and canonical URLs. Mirrors the existing `/bazar/kraj/[slug]/`
 * region-landing pattern.
 *
 * Everything here is pure (no DB, no Astro) so it is unit-testable.
 */
import { CATEGORIES, BRANDS } from "./bazar-constants";

export interface CategoryEntry {
  value: string;
  label: string;
}
export interface BrandEntry {
  value: string;
  label: string;
}

export function findCategory(
  slug: string | undefined,
): CategoryEntry | undefined {
  if (!slug) return undefined;
  return CATEGORIES.find((c) => c.value === slug);
}

export function findBrand(slug: string | undefined): BrandEntry | undefined {
  if (!slug) return undefined;
  return BRANDS.find((b) => b.value === slug);
}

/**
 * Unique, keyword-relevant intro copy per category so the landing pages are not
 * thin content. High-value categories get bespoke prose; the rest fall back to
 * a category-name template.
 */
const CATEGORY_INTROS: Record<string, string> = {
  traktory:
    "Ojeté i nové traktory od soukromých hospodářů i autorizovaných dealerů — " +
    "od malotraktorů po výkonné kolové stroje. Filtrujte podle značky, roku " +
    "výroby, výkonu (koní) a motohodin a kontaktujte prodejce napřímo, bez provize.",
  kombajny:
    "Sklízecí mlátičky a kombajny na obilí, kukuřici i řepku z druhé ruky i nové. " +
    "Porovnejte značky, roky výroby, motohodiny a záběr žací lišty přímo v inzerátech od majitelů.",
  "zpracovani-pudy":
    "Pluhy, podmítače, kypřiče, rotační brány, kompaktomaty a válce pro základní " +
    "i mělké zpracování půdy. Nové i ojeté stroje s uvedeným pracovním záběrem a stavem.",
  seti:
    "Secí stroje mechanické, pneumatické i přesné, secí kombinace a sázeče brambor. " +
    "Vyberte podle pracovního záběru a značky a domluvte se s prodejcem napřímo.",
  hnojeni:
    "Rozmetadla minerálních i statkových hnojiv, cisterny a aplikátory kejdy. " +
    "Ojeté i nové stroje s uvedeným objemem nádrže a pracovním záběrem.",
  "ochrana-rostlin":
    "Postřikovače nesené, tažené i samojízdné pro chemickou ochranu porostů. " +
    "Filtrujte podle záběru, objemu nádrže a značky.",
  "sklizen-picnin":
    "Žací stroje, obraceče, shrnovače, lisy válcové i hranolové, obalovače a " +
    "řezačky pro sklizeň pícnin a slámy. Ojeté i nové stroje od hospodářů i dealerů.",
  "sklizen-okopanin":
    "Sklízeče brambor a řepy, vyoravače a další technika pro sklizeň okopanin. " +
    "Nové i použité stroje s uvedeným stavem a rokem výroby.",
  manipulace:
    "Čelní, teleskopické, kolové, kloubové i smykové nakladače pro manipulaci a " +
    "nakládání na farmě. Filtrujte podle značky, nosnosti a roku výroby.",
  doprava:
    "Návěsy sklápěcí, valníkové i s posuvným dnem, cisterny na vodu a přepravníky " +
    "zrna. Ojeté i nové stroje s uvedenou nosností.",
  "staj-chov":
    "Krmné vozy, dojicí roboti, podestýlače a další technika pro stáj a chov " +
    "hospodářských zvířat. Nové i použité stroje přímo od prodejců.",
  "komunal-les":
    "Mulčovače, štěpkovače, lesní vyvážečky a komunální technika. Ojeté i nové " +
    "stroje pro údržbu zeleně a práci v lese.",
  "nahradni-dily":
    "Náhradní díly na traktory, kombajny a zemědělské stroje — nové i použité, " +
    "od soukromých prodejců i specializovaných obchodů.",
  pozemky:
    "Zemědělské pozemky, orná půda, louky a pastviny k prodeji i pronájmu. " +
    "Nabídky přímo od vlastníků i realitních zprostředkovatelů.",
  zvirata:
    "Hospodářská zvířata — skot, prasata, ovce, drůbež i další — z chovů po celé " +
    "České republice. Kontakt přímo na chovatele.",
};

export function categoryIntro(entry: CategoryEntry): string {
  return (
    CATEGORY_INTROS[entry.value] ??
    `Aktuální inzeráty z kategorie ${entry.label.toLowerCase()} — nové i ojeté ` +
      `zboží od soukromých prodejců i dealerů. Filtrujte podle značky, ceny a ` +
      `lokality a kontaktujte prodejce napřímo, bez provize.`
  );
}

/** SEO <title> for a category landing page. */
export function categoryTitle(entry: CategoryEntry): string {
  return `${entry.label} — bazar zemědělské techniky | inzeráty`;
}

/** SEO <title> for a category × brand landing page. */
export function categoryBrandTitle(
  cat: CategoryEntry,
  brand: BrandEntry,
): string {
  return `${brand.label} ${entry_lc(cat)} — bazar a inzeráty`;
}

/** SEO meta description for a category landing page (count-aware). */
export function categoryDescription(entry: CategoryEntry, count: number): string {
  const lead =
    count > 0 ? `${count} aktivních inzerátů` : "Inzeráty a nabídky";
  return `${lead} v kategorii ${entry.label.toLowerCase()} na agro-svět bazaru. Nové i ojeté zboží přímo od prodejců, bez provize. Vložte inzerát zdarma.`;
}

/** SEO meta description for a category × brand landing page (count-aware). */
export function categoryBrandDescription(
  cat: CategoryEntry,
  brand: BrandEntry,
  count: number,
): string {
  const lead = count > 0 ? `${count} inzerátů` : "Inzeráty";
  return `${lead} ${brand.label} v kategorii ${cat.label.toLowerCase()} na agro-svět bazaru. Ojeté i nové stroje ${brand.label} přímo od prodejců.`;
}

/** Lower-cased category label for natural-reading titles ("Zetor traktory"). */
function entry_lc(entry: CategoryEntry): string {
  return entry.label.toLowerCase();
}
