// Kalkulačka priamych platieb SPP 2023–2027 pre Slovensko (Strategický plán SR).
//
// Sadzby za rok 2025 — posledný rok, za ktorý PPA zverejnila všetky sadzby:
// PPA „Sadzby priamych platieb pre rok 2025“ (xlsx, 24. 2. 2026) na apa.sk/priame-podpory/sadzby;
// sadzbu pre mladého poľnohospodára oznámilo MPRV SR vo Vestníku č. 4/2026 (č. 3477/2026).
// Pre rok 2026 PPA k 23. 9. 2026 zverejnila len časť sadzieb (BISS, CRISS, mlieko,
// ovce a kozy, chmeľ, cukrová repa), preto kalkulačka zostáva pri roku 2025.
// Pravidlá: nariadenie vlády SR č. 436/2022 Z. z. v znení účinnom od 26. 4. 2025.
//
// Čo kalkulačka NEPOKRÝVA:
// - ANC (oblasti s prírodnými obmedzeniami) — v SR samostatne v rámci rozvoja vidieka.
// - Platby na zviera (viazaná podpora na dojnice 276,02 €/ks a ovce a kozy 24,96 €/ks za rok 2025)
//   a podporu pastevného chovu — kalkulačka je plošná (€/ha).
// - Zníženie BISS nad 60 000 € (po odpočte nákladov práce) — len upozornenie.
// - AEKO, welfare zvierat, investičné intervencie (tie sú v sekcii /dotace).

export const ROK_SAZIEB_SK = 2025;

export const ZDROJE_SK = {
  sadzby: {
    label: 'PPA, Sadzby priamych platieb pre rok 2025 (24. 2. 2026)',
    url: 'https://www.apa.sk/priame-podpory/sadzby',
  },
  nariadenie: {
    label: 'Nariadenie vlády SR č. 436/2022 Z. z. o priamych platbách',
    url: 'https://www.slov-lex.sk/ezbierky/pravne-predpisy/SK/ZZ/2022/436/',
  },
} as const;

/** Sadzby za rok 2026, ktoré PPA zverejnila k 23. 9. 2026 (zatiaľ neúplné). */
export const SADZBY_SK_2026_CIASTOCNE = {
  biss: 117.31,
  crissTier1: 87.80,
  crissTier2: 43.50,
} as const;

export interface VcsSektorSk {
  slug: string;
  name: string;
  /** Sadzba €/ha za rok 2025. */
  sazba: number;
  /** Popis do tooltipu. */
  description: string;
}

export const SAZBY_SK = {
  biss: 105.05,            // PPA, Sadzby 2025
  crissTier1: 79.70,       // PPA, Sadzby 2025 — interval do 100,99 ha
  crissTier1MaxHa: 100.99, // § 7 ods. 2 písm. a) NV 436/2022
  crissTier2: 38.00,       // PPA, Sadzby 2025 — interval od 101 ha
  crissTier2MaxHa: 150.99, // § 7 ods. 2 NV 436/2022 (od roku 2024; predtým 150 ha)
  ekoMimoChvu: 58.06,      // PPA, Sadzby 2025 — ekoschéma mimo chráneného územia
  ekoChvu: 93.15,          // PPA, Sadzby 2025 — ekoschéma v chránenom území
  mlady: 108.89,           // PPA, Sadzby 2025; Vestník MPRV SR č. 4/2026
  mladyMaxHa: 100,         // § 8 ods. 8 NV 436/2022
  minVymeraHa: 1,          // § 3 ods. 1 NV 436/2022
  bissZnizenieOdEur: 60000, // § 5 ods. 2 NV 436/2022 — po odpočte nákladov práce
} as const;

export const VCS_SEKTORY_SK: VcsSektorSk[] = [
  { slug: 'cukrova-repa', name: 'Cukrová repa', sazba: 565.00, description: 'Súvislá plocha najmenej 0,3 ha (§ 27).' },
  { slug: 'bielkoviny', name: 'Bielkovinové plodiny', sazba: 75.77, description: 'Bôb, cícer, ďatelina, fazuľa, hrach, lucerna, lupina, sója, šošovica, vika (príloha č. 6); súvislá plocha najmenej 0,3 ha.' },
  { slug: 'chmel', name: 'Chmeľ', sazba: 880.00, description: 'Súvislá plocha chmeľnice najmenej 0,3 ha (§ 26).' },
  { slug: 'ovocie', name: 'Ovocie (vybrané druhy)', sazba: 531.92, description: 'Vybrané druhy ovocia podľa prílohy č. 7, súvislá plocha najmenej 0,3 ha.' },
  { slug: 'zelenina-pracna', name: 'Zelenina (prácna)', sazba: 490.00, description: 'Vybrané druhy prácnej zeleniny podľa prílohy č. 8, súvislá plocha najmenej 0,3 ha.' },
  { slug: 'zelenina-vysoko-pracna', name: 'Zelenina (vysoko prácna)', sazba: 688.00, description: 'Vybrané druhy vysoko prácnej zeleniny podľa prílohy č. 8, súvislá plocha najmenej 0,3 ha.' },
];

export function getVcsSektorSk(slug: string): VcsSektorSk | undefined {
  return VCS_SEKTORY_SK.find((s) => s.slug === slug);
}

export interface CapInputSk {
  /** Celková oprávnená výmera v ha. */
  totalHa: number;
  /** Orná pôda v chránenom území (CHVÚ alebo územie európskeho významu, § 2 písm. c) NV 436/2022), ha. */
  chvuHa: number;
  /** Mladý poľnohospodár (najviac 40 rokov v roku podania žiadosti, nový podnik). */
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
  /** Upozornenia — čo kalkulačka nezohľadnila. */
  warnings: string[];
}

const skNum = (n: number) => n.toLocaleString('sk-SK', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export function calculateCapSk(input: CapInputSk): CapResultSk {
  const items: CapBreakdownItemSk[] = [];
  const warnings: string[] = [];
  const ha = Math.max(0, input.totalHa);
  if (ha <= 0) return { items: [], total: 0, perHa: 0, warnings };
  if (ha < SAZBY_SK.minVymeraHa) {
    warnings.push(`Priama platba sa poskytne až od ${SAZBY_SK.minVymeraHa} ha oprávnenej plochy.`);
    return { items: [], total: 0, perHa: 0, warnings };
  }

  // 1. BISS — celá výmera
  const bissAmount = ha * SAZBY_SK.biss;
  items.push({
    key: 'biss',
    label: 'Základná podpora príjmu (BISS)',
    ha,
    sazba: SAZBY_SK.biss,
    amount: bissAmount,
    note: 'Vypláca sa na všetku oprávnenú poľnohospodársku plochu.',
  });
  if (bissAmount > SAZBY_SK.bissZnizenieOdEur) {
    warnings.push('BISS nad 60 000 € sa po odpočte nákladov práce znižuje o 85 % a nad 100 000 € o 100 % (§ 5 NV 436/2022) — kalkulačka zníženie nepočíta.');
  }

  // 2. CRISS — dvojstupňová (do 100,99 ha; od 101 ha do 150,99 ha)
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
    note: `${skNum(SAZBY_SK.crissTier1)} €/ha do ${skNum(SAZBY_SK.crissTier1MaxHa)} ha, ${skNum(SAZBY_SK.crissTier2)} €/ha od 101 ha do ${skNum(SAZBY_SK.crissTier2MaxHa)} ha; nad ${skNum(SAZBY_SK.crissTier2MaxHa)} ha sa neposkytuje (§ 7).`,
  });

  // 3. Ekoschéma — orná pôda v chránenom území vyššou sadzbou, zvyšok nižšou
  const chvuHa = Math.max(0, Math.min(input.chvuHa, ha));
  const mimoHa = ha - chvuHa;
  const ekoAmount = chvuHa * SAZBY_SK.ekoChvu + mimoHa * SAZBY_SK.ekoMimoChvu;
  items.push({
    key: 'eko',
    label: 'Celofarmová ekoschéma',
    ha,
    sazba: ha > 0 ? ekoAmount / ha : 0,
    amount: ekoAmount,
    note: `${skNum(SAZBY_SK.ekoChvu)} €/ha na ornej pôde v chránenom území, ${skNum(SAZBY_SK.ekoMimoChvu)} €/ha mimo neho; ak podnik dodržiava postupy ekoschémy (§ 10–12).`,
  });

  // 4. Mladý poľnohospodár — najviac 100 ha
  if (input.mladyPolnohospodar) {
    const mladyHa = Math.min(ha, SAZBY_SK.mladyMaxHa);
    items.push({
      key: 'mlady',
      label: 'Platba pre mladých poľnohospodárov',
      ha: mladyHa,
      sazba: SAZBY_SK.mlady,
      amount: mladyHa * SAZBY_SK.mlady,
      note: `Najviac 40 rokov v roku podania žiadosti, nový podnik; najviac ${SAZBY_SK.mladyMaxHa} ha a päť rokov (§ 8).`,
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
  return { items, total, perHa, warnings };
}

export function formatEur(n: number): string {
  return n.toLocaleString('sk-SK', { maximumFractionDigits: 0 }) + ' €';
}
