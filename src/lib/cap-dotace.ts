// Kalkulačka CAP dotací pro období 2023–2027 (Strategický plán SZP ČR).
//
// Sazby jsou ORIENTAČNÍ z veřejně dostupných materiálů SZIF / MZe k roku
// 2024. Oficiální sazby pro daný rok SZIF zveřejňuje až po uzávěrce
// kampaně. UI musí jasně označit „orientační" a směrovat k oficiálním
// zdrojům pro závazné částky.
//
// Co kalkulačka NEPOKRÝVÁ (záměrně mimo V1):
// - ANC pro chov hospodářských zvířat (LPIS bod 6 — odlišný program)
// - AEKO smlouvy (5-letá agro-environmentální opatření)
// - Investiční dotace (Intervence 33.73, 37.73, ad.)
// - Welfare zvířat (samostatná platba)
// - Bio prémie (BIO režimy)
// - Pojištění úrody (kompenzace)

export type AncCategory = 'none' | 'horska' | 'oa' | 'sv';
export type CzKraj =
  | 'praha' | 'stredocesky' | 'jihocesky' | 'plzensky' | 'karlovarsky'
  | 'ustecky' | 'liberecky' | 'kralovehradecky' | 'pardubicky' | 'vysocina'
  | 'jihomoravsky' | 'olomoucky' | 'zlinsky' | 'moravskoslezsky';

export interface KrajInfo {
  slug: CzKraj;
  name: string;
  /** Podíl ANC oblasti v kraji (orientační — pomáhá pre-fill checkboxu). */
  ancShare: 'high' | 'medium' | 'low';
}

export const KRAJE: KrajInfo[] = [
  { slug: 'praha', name: 'Hlavní město Praha', ancShare: 'low' },
  { slug: 'stredocesky', name: 'Středočeský kraj', ancShare: 'low' },
  { slug: 'jihocesky', name: 'Jihočeský kraj', ancShare: 'high' },
  { slug: 'plzensky', name: 'Plzeňský kraj', ancShare: 'high' },
  { slug: 'karlovarsky', name: 'Karlovarský kraj', ancShare: 'high' },
  { slug: 'ustecky', name: 'Ústecký kraj', ancShare: 'medium' },
  { slug: 'liberecky', name: 'Liberecký kraj', ancShare: 'high' },
  { slug: 'kralovehradecky', name: 'Královéhradecký kraj', ancShare: 'medium' },
  { slug: 'pardubicky', name: 'Pardubický kraj', ancShare: 'medium' },
  { slug: 'vysocina', name: 'Vysočina', ancShare: 'high' },
  { slug: 'jihomoravsky', name: 'Jihomoravský kraj', ancShare: 'low' },
  { slug: 'olomoucky', name: 'Olomoucký kraj', ancShare: 'medium' },
  { slug: 'zlinsky', name: 'Zlínský kraj', ancShare: 'high' },
  { slug: 'moravskoslezsky', name: 'Moravskoslezský kraj', ancShare: 'medium' },
];

// Sazby v Kč/ha (orientační 2024 hodnoty).
export const SAZBY = {
  biss: 2150,           // Základní platba (BISS)
  ciss: 1450,           // Redistributivní (CISS) — pro prvních 150 ha
  cissMaxHa: 150,
  ekoBasic: 1300,       // Základní EKO režim (greening replacement)
  ekoPremium: 2400,     // Premium EKO (víc praktik)
  mladyZemedelec: 1500, // CIS-YF — bonus pro mladého zemědělce
  mladyMaxHa: 150,
  // ANC sazby — průměr horní hraniční hodnoty
  ancHorska: 4500,
  ancOA: 2000,
  ancSV: 2000,
} as const;

// Citlivé sektory (VCS — Voluntary Coupled Support). Sazby ve Kč/ha.
export interface CitlivySektor {
  slug: string;
  name: string;
  /** Detailed CZ description for tooltip. */
  description: string;
  sazba: number;
}

export const CITLIVE_SEKTORY: CitlivySektor[] = [
  { slug: 'chmel', name: 'Chmel', sazba: 13000, description: 'Nejvyšší VCS sazba — strategická plodina pro CZ pivovarnictví.' },
  { slug: 'zelenina', name: 'Zelenina (polní)', sazba: 9000, description: 'Brambory na konzum, kořenová zelenina, listová zelenina apod.' },
  { slug: 'cukrovka', name: 'Cukrová řepa', sazba: 7500, description: 'VCS pro pěstitele cukrovky podle plochy.' },
  { slug: 'ovoce', name: 'Ovoce (sady)', sazba: 6500, description: 'Jabloně, hrušně, peckoviny a další ovocné sady.' },
  { slug: 'brambory-skrob', name: 'Brambory na škrob', sazba: 5500, description: 'Specializované odrůdy brambor pro škrobárenskou výrobu.' },
  { slug: 'bilkoviny', name: 'Bílkovinné plodiny', sazba: 2800, description: 'Sója, hrách setý, vikve, lupiny, fazole, peluška.' },
  { slug: 'len', name: 'Len přadný', sazba: 4500, description: 'VCS pro pěstitele lnu přadného.' },
  { slug: 'krmne', name: 'Krmné plodiny', sazba: 1100, description: 'Vojtěška, jetel, jeteloviny, trávy na orné půdě.' },
];

export function getCitlivySektor(slug: string): CitlivySektor | undefined {
  return CITLIVE_SEKTORY.find((s) => s.slug === slug);
}

// ────────────────────────────────────────────────────────────────────
// Calculation
// ────────────────────────────────────────────────────────────────────

export interface CapInput {
  /** Celková výměra hospodářství v ha. */
  totalHa: number;
  /** Plocha v ANC kategorii (může být ≤ totalHa). 0 = mimo ANC. */
  ancHa: number;
  ancCategory: AncCategory;
  /** Plochy v citlivých sektorech, klíč = sektor slug. */
  vcsHa: Record<string, number>;
  /** Premium EKO režim? (víc praktik = vyšší sazba) */
  ekoPremium: boolean;
  /** Mladý zemědělec (do 40 let, max 5 let od první žádosti). */
  mladyZemedelec: boolean;
}

export interface CapBreakdownItem {
  key: string;
  label: string;
  /** Kolik ha se započítává. */
  ha: number;
  /** Sazba v Kč/ha. */
  sazba: number;
  /** Celkem Kč. */
  amount: number;
  /** Vysvětlení do tooltip. */
  note?: string;
}

export interface CapResult {
  items: CapBreakdownItem[];
  total: number;
  perHa: number;
}

export function calculateCap(input: CapInput): CapResult {
  const items: CapBreakdownItem[] = [];
  const ha = Math.max(0, input.totalHa);

  if (ha <= 0) return { items: [], total: 0, perHa: 0 };

  // 1. BISS — všechna výměra
  items.push({
    key: 'biss',
    label: 'Základní platba (BISS)',
    ha,
    sazba: SAZBY.biss,
    amount: ha * SAZBY.biss,
    note: 'Vyplácí se na všechnu způsobilou zemědělskou plochu.',
  });

  // 2. CISS — prvních 150 ha
  const cissHa = Math.min(ha, SAZBY.cissMaxHa);
  items.push({
    key: 'ciss',
    label: 'Redistributivní platba (CISS)',
    ha: cissHa,
    sazba: SAZBY.ciss,
    amount: cissHa * SAZBY.ciss,
    note: `Podpora malých a středních farem — pouze prvních ${SAZBY.cissMaxHa} ha.`,
  });

  // 3. EKO-platba — všechna výměra (assumption: žadatel splňuje aspoň
  //    základní eko-režim; bez něj přijde o významnou část dotace)
  const ekoSazba = input.ekoPremium ? SAZBY.ekoPremium : SAZBY.ekoBasic;
  items.push({
    key: 'eko',
    label: input.ekoPremium ? 'EKO-platba (premium)' : 'EKO-platba (základní)',
    ha,
    sazba: ekoSazba,
    amount: ha * ekoSazba,
    note: input.ekoPremium
      ? 'Vyšší sazba za víc eko-praktik (meziplodiny, krycí plodiny, biopásy ad.).'
      : 'Základní EKO režim — povinný pro plnou výši dotací.',
  });

  // 4. ANC — pouze plocha v ANC kategorii
  if (input.ancHa > 0 && input.ancCategory !== 'none') {
    const ancSazba = input.ancCategory === 'horska'
      ? SAZBY.ancHorska
      : input.ancCategory === 'oa' ? SAZBY.ancOA
      : SAZBY.ancSV;
    const ancHa = Math.min(input.ancHa, ha);
    const label = input.ancCategory === 'horska'
      ? 'ANC — horská oblast'
      : input.ancCategory === 'oa' ? 'ANC — ostatní oblast'
      : 'ANC — specifické omezení';
    items.push({
      key: 'anc',
      label,
      ha: ancHa,
      sazba: ancSazba,
      amount: ancHa * ancSazba,
      note: 'Méně příznivé oblasti — kompenzace za přírodní omezení (orientační průměrná sazba).',
    });
  }

  // 5. Mladý zemědělec — prvních 150 ha
  if (input.mladyZemedelec) {
    const mladyHa = Math.min(ha, SAZBY.mladyMaxHa);
    items.push({
      key: 'mlady',
      label: 'Platba pro mladé zemědělce',
      ha: mladyHa,
      sazba: SAZBY.mladyZemedelec,
      amount: mladyHa * SAZBY.mladyZemedelec,
      note: `Pro zemědělce do 40 let, max 5 let od první žádosti. Pouze prvních ${SAZBY.mladyMaxHa} ha.`,
    });
  }

  // 6. VCS — citlivé sektory
  for (const [slug, vcsHa] of Object.entries(input.vcsHa ?? {})) {
    if (!vcsHa || vcsHa <= 0) continue;
    const sektor = getCitlivySektor(slug);
    if (!sektor) continue;
    const effectiveHa = Math.min(vcsHa, ha);
    items.push({
      key: `vcs-${slug}`,
      label: `VCS: ${sektor.name}`,
      ha: effectiveHa,
      sazba: sektor.sazba,
      amount: effectiveHa * sektor.sazba,
      note: sektor.description,
    });
  }

  const total = items.reduce((sum, it) => sum + it.amount, 0);
  const perHa = ha > 0 ? total / ha : 0;

  return { items, total, perHa };
}

export function formatKc(n: number): string {
  return n.toLocaleString('cs-CZ', { maximumFractionDigits: 0 }) + ' Kč';
}
