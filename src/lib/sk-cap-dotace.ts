// Kalkulačka priamych platieb SPP 2023–2027 pre Slovensko (Strategický plán SR).
//
// Sadzby sú ORIENTAČNÉ aktuály 2024 z oficiálneho Excelu PPA "Sadzby priamych
// platieb pre rok 2024" (apa.sk/sadzby). Záväzné sú sadzby PPA — UI musí jasne
// označiť "orientačné" a smerovať na apa.sk.
//
// Čo kalkulačka NEPOKRÝVA (zámerne mimo V1):
// - ANC (oblasti s prírodnými obmedzeniami) — v SR samostatne v rámci rozvoja
//   vidieka, per-ha sadzba nedohľadateľná (len poznámka v UI).
// - Platby na zviera (dojnice ~270,95 €/ks, ovce/kozy ~24,15 €/ks 2024) — kalkulačka
//   je plošná (€/ha).
// - AEKO, welfare zvierat, investičné intervencie (tie sú v sekcii /dotace).

export interface VcsSektorSk {
  slug: string;
  name: string;
  /** Sadzba €/ha. */
  sazba: number;
  /** Popis do tooltipu. */
  description: string;
}

export const SAZBY_SK = {
  biss: 103.80,            // zdroj: oficiálny PPA Excel "Sadzby 2024", 2024
  crissTier1: 79,          // zdroj: oficiálny PPA Excel "Sadzby 2024", 2024
  crissTier1MaxHa: 100.99, // zdroj: oficiálny PPA Excel "Sadzby 2024", 2024
  crissTier2: 40,          // zdroj: oficiálny PPA Excel "Sadzby 2024", 2024
  crissTier2MaxHa: 150,    // nad 150 ha = 0
  ekoMimoChvu: 60.36,      // ekoschéma mimo CHVÚ, zdroj: oficiálny PPA Excel "Sadzby 2024", 2024
  ekoChvu: 110.45,         // ekoschéma v CHVÚ, zdroj: oficiálny PPA Excel "Sadzby 2024", 2024
  mlady: 88.15,            // €/ha — zdroj: oficiálny PPA Excel "Sadzby 2024", 2024
  mladyMaxHa: 28,          // strop — single-source (Vestník MPRV SR); Excel drží len sadzby
} as const;

export const VCS_SEKTORY_SK: VcsSektorSk[] = [
  { slug: 'cukrova-repa', name: 'Cukrová repa', sazba: 477.80, description: 'Viazaná podpora na pestovanie cukrovej repy.' }, // 2024 PPA Excel
  { slug: 'bielkoviny', name: 'Bielkovinové plodiny', sazba: 69.90, description: 'Sója, hrach, bôb, šošovica a ďalšie bielkovinové plodiny.' }, // 2024 PPA Excel
  { slug: 'chmel', name: 'Chmeľ', sazba: 880, description: 'Plocha chmeľnice min. 0,3 ha.' }, // 2024 PPA Excel
  { slug: 'ovocie', name: 'Ovocie (vybrané druhy)', sazba: 554.35, description: 'Ovocné sady vybraných druhov s vysokou prácnosťou, min. 0,3 ha.' }, // 2024 PPA Excel
  { slug: 'zelenina-pracna', name: 'Zelenina (prácna)', sazba: 455, description: 'Vybrané druhy zeleniny s prácnosťou, min. 0,3 ha.' }, // 2024 PPA Excel
  { slug: 'zelenina-vysoko-pracna', name: 'Zelenina (vysoko prácna)', sazba: 685, description: 'Vybrané druhy zeleniny s vysokou prácnosťou, min. 0,3 ha.' }, // 2024 PPA Excel
];

export function getVcsSektorSk(slug: string): VcsSektorSk | undefined {
  return VCS_SEKTORY_SK.find((s) => s.slug === slug);
}

export interface CapInputSk {
  /** Celková výmera v ha. */
  totalHa: number;
  /** Plocha v chránenom vtáčom území (≤ totalHa). 0 = mimo CHVÚ. */
  chvuHa: number;
  /** Mladý poľnohospodár (do 40 rokov, prvý podnik). */
  mladyPolnohospodar: boolean;
  /** Plochy vo VCS sektoroch, kľúč = sektor slug. */
  vcsHa: Record<string, number>;
}

export interface CapBreakdownItemSk {
  key: string;
  label: string;
  ha: number;
  /** Sadzba €/ha (pre CRISS/eko zmiešané = priemer). */
  sazba: number;
  amount: number;
  note?: string;
}

export interface CapResultSk {
  items: CapBreakdownItemSk[];
  total: number;
  perHa: number;
}

export function calculateCapSk(input: CapInputSk): CapResultSk {
  const items: CapBreakdownItemSk[] = [];
  const ha = Math.max(0, input.totalHa);
  if (ha <= 0) return { items: [], total: 0, perHa: 0 };

  // 1. BISS — celá výmera
  items.push({
    key: 'biss',
    label: 'Základná podpora príjmu (BISS)',
    ha,
    sazba: SAZBY_SK.biss,
    amount: ha * SAZBY_SK.biss,
    note: 'Vypláca sa na všetku spôsobilú poľnohospodársku plochu.',
  });

  // 2. CRISS — dvojstupňová (tier1 do 100,99 ha; tier2 100,99–150 ha)
  const tier1Ha = Math.min(ha, SAZBY_SK.crissTier1MaxHa);
  const tier2Ha = Math.max(0, Math.min(ha, SAZBY_SK.crissTier2MaxHa) - SAZBY_SK.crissTier1MaxHa);
  const crissAmount = tier1Ha * SAZBY_SK.crissTier1 + tier2Ha * SAZBY_SK.crissTier2;
  const crissHa = tier1Ha + tier2Ha;
  items.push({
    key: 'criss',
    label: 'Redistributívna platba (CRISS)',
    ha: crissHa,
    sazba: crissHa > 0 ? crissAmount / crissHa : 0,
    amount: crissAmount,
    note: `${SAZBY_SK.crissTier1} €/ha do ${SAZBY_SK.crissTier1MaxHa} ha, ${SAZBY_SK.crissTier2} €/ha do ${SAZBY_SK.crissTier2MaxHa} ha; nad ${SAZBY_SK.crissTier2MaxHa} ha sa neposkytuje.`,
  });

  // 3. Ekoschéma — plocha v CHVÚ vyššou sadzbou, zvyšok nižšou
  const chvuHa = Math.max(0, Math.min(input.chvuHa, ha));
  const mimoHa = ha - chvuHa;
  const ekoAmount = chvuHa * SAZBY_SK.ekoChvu + mimoHa * SAZBY_SK.ekoMimoChvu;
  items.push({
    key: 'eko',
    label: 'Celofarmská ekoschéma',
    ha,
    sazba: ha > 0 ? ekoAmount / ha : 0,
    amount: ekoAmount,
    note: `${SAZBY_SK.ekoChvu} €/ha v CHVÚ, ${SAZBY_SK.ekoMimoChvu} €/ha mimo CHVÚ.`,
  });

  // 4. Mladý poľnohospodár — max 28 ha
  if (input.mladyPolnohospodar) {
    const mladyHa = Math.min(ha, SAZBY_SK.mladyMaxHa);
    items.push({
      key: 'mlady',
      label: 'Platba pre mladých poľnohospodárov',
      ha: mladyHa,
      sazba: SAZBY_SK.mlady,
      amount: mladyHa * SAZBY_SK.mlady,
      note: `Do 40 rokov, prvý podnik. Max ${SAZBY_SK.mladyMaxHa} ha.`,
    });
  }

  // 5. VCS — viazané platby na plochu
  for (const [slug, vcsHa] of Object.entries(input.vcsHa ?? {})) {
    if (!vcsHa || vcsHa <= 0) continue;
    const sektor = getVcsSektorSk(slug);
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

export function formatEur(n: number): string {
  return n.toLocaleString('sk-SK', { maximumFractionDigits: 0 }) + ' €';
}
