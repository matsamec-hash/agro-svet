// Kalkulačka přímých plateb SZP v ČR — sazby za rok 2026.
//
// Sazby: ministr zemědělství je schválil 2. 10. 2026 (tisková zpráva MZe),
// přepočet kurzem ECB k 30. 9. 2026, 24,44 CZK/EUR; zálohy 75 %.
// Pravidla: nařízení vlády č. 83/2023 Sb. ve znění pro rok 2026 (NV 45/2026 Sb.),
// Metodická příručka MZe k přímým platbám 2026, brožura MZe „Přímé platby 2026“
// (08/2026) a informace SZIF k ekoplatbám. Odkazy v ZDROJE níže.
//
// Výpočet je orientační — závazná jsou rozhodnutí SZIF. Nepočítá krácení za
// porušení podmínek, kontroly ani II. pilíř (ANC, AEKO, ekologické zemědělství,
// Natura 2000, investice).

export const ROK_SAZEB = 2026;
/** Kurz ECB k 30. 9. 2026, kterým MZe přepočetlo sazby z EUR. */
export const KURZ_CZK_EUR = 24.44;
/** Výše záloh na přímé platby za rok 2026. */
export const ZALOHA_PROCENT = 75;

export const ZDROJE = {
  sazby: {
    label: 'MZe, tisková zpráva 2. 10. 2026 — sazby přímých plateb 2026',
    url: 'https://mze.gov.cz/public/portal/mze/tiskovy-servis/tiskove-zpravy/ministr-zemedelstvi-schvalil-sazby-primych-plateb-pro-letosni-rok-zemedelci-dostanou-75-procent-jako-zalohu',
  },
  narizeni: {
    label: 'Nařízení vlády č. 83/2023 Sb. o podmínkách přímých plateb',
    url: 'https://www.zakonyprolidi.cz/cs/2023-83',
  },
  prirucka: {
    label: 'MZe, Metodická příručka k přímým platbám 2026',
    url: 'https://mze.gov.cz/public/portal/-a99292---MRZkwwcD/aktualizovana-verze-metodicke-prirucky-k-podminkam-poskytovani-primych-plateb-v-ceske-republice-v-roce-2026',
  },
  brozura: {
    label: 'MZe, brožura Přímé platby 2026',
    url: 'https://mze.gov.cz/public/portal/mze/-a99316---KrY6RDzK/informacni-brozura-prime-platby-2026-aktualni-k-08-2026',
  },
  szifJednotnaZadost: {
    label: 'SZIF — Jednotná žádost',
    url: 'https://szif.gov.cz/cs/jednotna-zadost',
  },
  anc: {
    label: 'MZe, Metodika ANC 2026',
    url: 'https://mze.gov.cz/public/portal/mze/-a92572---1PhHkxR2/metodika-anc-2026',
  },
} as const;

// Kraje — sdílí je i bazar a adresář farem (lib/farmy.ts).
export type CzKraj =
  | 'praha' | 'stredocesky' | 'jihocesky' | 'plzensky' | 'karlovarsky'
  | 'ustecky' | 'liberecky' | 'kralovehradecky' | 'pardubicky' | 'vysocina'
  | 'jihomoravsky' | 'olomoucky' | 'zlinsky' | 'moravskoslezsky';

export interface KrajInfo {
  slug: CzKraj;
  name: string;
}

export const KRAJE: KrajInfo[] = [
  { slug: 'praha', name: 'Hlavní město Praha' },
  { slug: 'stredocesky', name: 'Středočeský kraj' },
  { slug: 'jihocesky', name: 'Jihočeský kraj' },
  { slug: 'plzensky', name: 'Plzeňský kraj' },
  { slug: 'karlovarsky', name: 'Karlovarský kraj' },
  { slug: 'ustecky', name: 'Ústecký kraj' },
  { slug: 'liberecky', name: 'Liberecký kraj' },
  { slug: 'kralovehradecky', name: 'Královéhradecký kraj' },
  { slug: 'pardubicky', name: 'Pardubický kraj' },
  { slug: 'vysocina', name: 'Vysočina' },
  { slug: 'jihomoravsky', name: 'Jihomoravský kraj' },
  { slug: 'olomoucky', name: 'Olomoucký kraj' },
  { slug: 'zlinsky', name: 'Zlínský kraj' },
  { slug: 'moravskoslezsky', name: 'Moravskoslezský kraj' },
];

/** Sazby přímých plateb za rok 2026 v Kč/ha (MZe, 2. 10. 2026). */
export const SAZBY = {
  biss: 1631.69,
  maliZemedelci: 6873.79,
  redistributivni: 3426.29,
  mladyZemedelec: 2389.20,
  ekoZakladni: 1547.14,
  ekoPremiova: 18263.22,
  noveKrajinnePrvky: 10558.08,
  udrzbaKrajinnychPrvku: 37882.00,
  hospodareniZivinami: 202.36,
  pasoveStridani: 7626.02,
} as const;

/** Limity podle NV č. 83/2023 Sb. */
export const LIMITY = {
  /** § 7 odst. 10, § 9 odst. 4, § 23 odst. 4 — minimální výměra 1 ha. */
  minVymeraHa: 1,
  /** § 9 odst. 3 — redistributivní platba nejvýše na 150 ha. */
  redistributivniMaxHa: 150,
  /** § 26 odst. 5 — mladý zemědělec nejvýše na 90 ha. */
  mladyMaxHa: 90,
  /** § 8 odst. 2 — platba pro malé zemědělce nejvýše na 4 ha. */
  maliMaxHa: 4,
  /** § 8 odst. 9 písm. b) — jen podnik s nejvýše 10 ha zemědělské půdy. */
  maliMaxVymeraPodnikuHa: 10,
  /** § 24 odst. 5 — prémiová ekoplatba na neprodukční plochy nejvýše do 10 % orné půdy (R, U, G). */
  ekoPremiovaMaxPodilOrne: 0.1,
  /** § 24b odst. 4 — nové krajinné prvky nejvýše na 50 % orné půdy. */
  noveKpMaxPodilOrne: 0.5,
  /** § 24c odst. 1 písm. b) — pásové střídání jen na DPB o výměře nejméně 4 ha. */
  pasoveStridaniMinDpbHa: 4,
  /** § 28–35 — minimální výměra pro každou plodinovou CIS 1 ha. */
  cisMinHa: 1,
  /** § 37 odst. 4 — dojnice: 2–10 ks, nad 10 ks jen se schématem kvality. */
  dojniceMinKs: 2,
  dojniceMaxBezSchematuKs: 10,
  /** § 38 odst. 5 — bahnice a kozy: nejméně 14 ks. */
  bahniceMinKs: 14,
} as const;

// ────────────────────────────────────────────────────────────────────
// Podpora příjmu vázaná na produkci (CIS) — dříve VCS
// ────────────────────────────────────────────────────────────────────

export interface CisPlodina {
  slug: string;
  name: string;
  description: string;
  /** Kč/ha za rok 2026. */
  sazba: number;
  /** Plodina musí být na standardní orné půdě (§ 28 odst. 1, § 32–35 odst. 1). */
  naOrnePude: boolean;
}

export const CIS_PLODINY: CisPlodina[] = [
  { slug: 'ovoce-vvp', name: 'Ovoce s velmi vysokou pracností', sazba: 15696.34, naOrnePude: false, description: 'Jabloň, meruňka, hrušeň, třešeň v evidenci ovocných sadů (§ 30).' },
  { slug: 'chmel', name: 'Chmel', sazba: 14729.01, naOrnePude: false, description: 'Chmelnice zapsaná v evidenci chmelnic (§ 29).' },
  { slug: 'zelenina-vvp', name: 'Zelenina s velmi vysokou pracností', sazba: 13065.77, naOrnePude: true, description: 'Např. zelí, květák, brokolice, mrkev, cibule, česnek, rajče, paprika, okurka, salát (§ 32).' },
  { slug: 'brambory-skrob', name: 'Brambory pro výrobu škrobu', sazba: 12701.67, naOrnePude: true, description: 'Se smlouvou s výrobcem bramborového škrobu (§ 28).' },
  { slug: 'ovoce-vp', name: 'Ovoce s vysokou pracností', sazba: 9655.53, naOrnePude: false, description: 'Švestka, broskvoň, višeň, rybíz, maliník, jahodník, angrešt, kanadská borůvka (§ 31).' },
  { slug: 'cukrova-repa', name: 'Cukrová řepa', sazba: 6477.08, naOrnePude: true, description: 'Výsev nejméně 0,8 výsevní jednotky na hektar (§ 34).' },
  { slug: 'zelenina-vp', name: 'Zelenina s vysokou pracností', sazba: 4676.59, naOrnePude: true, description: 'Kukuřice cukrová, tykev, hrách zahradní, fazol zahradní, celer naťový, špenát, petržel naťová (§ 33).' },
  { slug: 'bilkoviny', name: 'Bílkovinné plodiny', sazba: 1428.42, naOrnePude: true, description: 'Hrách vč. pelušky, bob, lupina, sója, vojtěška, jetel, štírovník, vičenec, tolice, komonice, vikev a jejich směsi (§ 35).' },
];

export interface CisZvire {
  slug: string;
  name: string;
  description: string;
  /** Kč/ks za rok 2026. */
  sazba: number;
}

export const CIS_ZVIRATA: CisZvire[] = [
  { slug: 'dojnice', name: 'Dojnice', sazba: 3415.97, description: 'Krávy v systému s tržní produkcí mléka k 31. 3.; 2–10 ks, nad 10 ks jen při zapojení do schématu kvality (§ 37).' },
  { slug: 'masna-telata', name: 'Telata masného typu', sazba: 3212.63, description: 'Telata narozená od 1. 3. předchozího roku do konce února, chovaná u žadatele aspoň měsíc (§ 36).' },
  { slug: 'bahnice-kozy', name: 'Bahnice a kozy', sazba: 520.57, description: 'Starší 1 roku, pasené od 15. 5. do 11. 9.; nejméně 14 ks (§ 38).' },
];

export function getCisPlodina(slug: string): CisPlodina | undefined {
  return CIS_PLODINY.find((s) => s.slug === slug);
}

export function getCisZvire(slug: string): CisZvire | undefined {
  return CIS_ZVIRATA.find((s) => s.slug === slug);
}

// ────────────────────────────────────────────────────────────────────
// Výpočet
// ────────────────────────────────────────────────────────────────────

export interface CapInput {
  /** Způsobilá zemědělská půda evidovaná v LPIS na žadatele (ha). */
  totalHa: number;
  /** Z toho orná půda — standardní orná půda, úhor, travní porost (kultury R, U, G), ha. */
  ornaHa?: number;
  /** Žádost o platbu pro malé zemědělce — vylučuje všechny ostatní přímé platby. */
  maliZemedelec?: boolean;
  mladyZemedelec?: boolean;
  /** Základní celofaremní ekoplatba (podmínka pro ostatní ekoplatby). */
  ekoZakladni?: boolean;
  /** Neprodukční plochy přihlášené do prémiové ekoplatby (ha, bez váhových koeficientů). */
  ekoPremiovaNpHa?: number;
  /** Ochranné pásy podél vody typu prémiový (ha). */
  ekoPremiovaPasyHa?: number;
  /** Nové krajinné prvky na orné půdě založené po 1. 1. 2025 (ha). */
  noveKpHa?: number;
  /** Krajinné prvky na orné půdě a TTP, o které se pečuje (ha). */
  udrzbaKpHa?: number;
  /** Udržitelné hospodaření s živinami — platí se na ornou půdu. */
  ziviny?: boolean;
  /** Díly půdních bloků s pásovým střídáním plodin (ha). */
  pasoveStridaniHa?: number;
  /** CIS plodiny, klíč = slug, hodnota = ha. */
  cisHa?: Record<string, number>;
  /** CIS zvířata, klíč = slug, hodnota = počet kusů. */
  cisKs?: Record<string, number>;
  /** Hospodářství zapojené do schématu kvality pro dojnice (příloha č. 21 NV 83/2023). */
  dojniceSchemaKvality?: boolean;
}

export interface CapBreakdownItem {
  key: string;
  label: string;
  /** Kolik ha nebo kusů se započítává. */
  mnozstvi: number;
  jednotka: 'ha' | 'ks';
  /** Kč za ha nebo kus. */
  sazba: number;
  amount: number;
  note?: string;
}

export interface CapResult {
  items: CapBreakdownItem[];
  total: number;
  /** Celkem na hektar způsobilé plochy (0, když plocha chybí). */
  perHa: number;
  /** Upozornění — co se nezapočítalo a proč. */
  warnings: string[];
  /** Druhá možnost pro podnik do 10 ha: platba pro malé zemědělce místo ostatních plateb, nebo naopak. */
  alternativa?: { label: string; total: number };
}

const fmtHa = (n: number) => n.toLocaleString('cs-CZ', { maximumFractionDigits: 2 });
const pos = (n: number | undefined) => (Number.isFinite(n) && (n as number) > 0 ? (n as number) : 0);

function item(key: string, label: string, mnozstvi: number, jednotka: 'ha' | 'ks', sazba: number, note?: string): CapBreakdownItem {
  return { key, label, mnozstvi, jednotka, sazba, amount: mnozstvi * sazba, note };
}

function finish(items: CapBreakdownItem[], ha: number, warnings: string[]): CapResult {
  const total = items.reduce((sum, it) => sum + it.amount, 0);
  return { items, total, perHa: ha > 0 ? total / ha : 0, warnings };
}

function maliZemedelciCastka(ha: number): number {
  return Math.min(ha, LIMITY.maliMaxHa) * SAZBY.maliZemedelci;
}

function lzeMaliZemedelec(ha: number): boolean {
  return ha >= LIMITY.minVymeraHa && ha <= LIMITY.maliMaxVymeraPodnikuHa;
}

/** Standardní režim: BISS + navazující platby, ekoplatby a CIS. */
function calculateStandard(input: CapInput, ha: number, orna: number): CapResult {
  const items: CapBreakdownItem[] = [];
  const warnings: string[] = [];
  const plochyOk = ha >= LIMITY.minVymeraHa;

  if (ha > 0 && !plochyOk) {
    warnings.push(`Plošné platby lze poskytnout až od ${LIMITY.minVymeraHa} ha způsobilé plochy.`);
  }

  if (plochyOk) {
    items.push(item('biss', 'Základní podpora příjmu (BISS)', ha, 'ha', SAZBY.biss,
      'Na způsobilou zemědělskou půdu v LPIS; minimum 1 ha (§ 7).'));

    const redHa = Math.min(ha, LIMITY.redistributivniMaxHa);
    items.push(item('redistributivni', 'Redistributivní platba (CRISS)', redHa, 'ha', SAZBY.redistributivni,
      `Jen na prvních ${LIMITY.redistributivniMaxHa} ha podniku (§ 9 odst. 3).`));

    if (input.mladyZemedelec) {
      const mHa = Math.min(ha, LIMITY.mladyMaxHa);
      items.push(item('mlady', 'Platba pro mladé zemědělce', mHa, 'ha', SAZBY.mladyZemedelec,
        `Nejvýše na ${LIMITY.mladyMaxHa} ha, pět let po sobě; v roce první žádosti nejvýše 40 let (§ 26).`));
    }

    const ekoNastavby = pos(input.ekoPremiovaNpHa) + pos(input.ekoPremiovaPasyHa) + pos(input.noveKpHa)
      + pos(input.udrzbaKpHa) + pos(input.pasoveStridaniHa) + (input.ziviny ? 1 : 0);

    if (input.ekoZakladni) {
      items.push(item('eko-zakladni', 'Základní celofaremní ekoplatba', ha, 'ha', SAZBY.ekoZakladni,
        'Na celou způsobilou výměru při splnění podmínek na všech dílech půdních bloků (§ 12–23).'));

      // Prémiová ekoplatba — neprodukční plochy nejvýš do 10 % orné půdy + prémiové pásy podél vody.
      const npHa = pos(input.ekoPremiovaNpHa);
      const pasyHa = pos(input.ekoPremiovaPasyHa);
      if (npHa > 0 || pasyHa > 0) {
        const npMax = orna * LIMITY.ekoPremiovaMaxPodilOrne;
        const npZapocet = Math.min(npHa, npMax);
        if (npHa > npMax) {
          warnings.push(`Prémiová ekoplatba: neprodukční plochy se započítávají nejvýš do 10 % orné půdy, tj. ${fmtHa(npMax)} ha.`);
        }
        const premHa = Math.min(npZapocet + pasyHa, orna);
        if (premHa > 0) {
          items.push(item('eko-premiova', 'Prémiová celofaremní ekoplatba', premHa, 'ha', SAZBY.ekoPremiova,
            'Jen na neprodukční plochy (nejvýš 10 % orné půdy) a ochranné pásy podél vody typu prémiový; podmínkou je vyčlenit 7 % neprodukčních ploch (§ 24).'));
        } else {
          warnings.push('Prémiová ekoplatba: zadejte výměru orné půdy (kultury R, U, G).');
        }
      }

      const noveHa = pos(input.noveKpHa);
      if (noveHa > 0) {
        const max = orna * LIMITY.noveKpMaxPodilOrne;
        const zapocet = Math.min(noveHa, max);
        if (noveHa > max) {
          warnings.push(`Nové krajinné prvky: platí se nejvýš na 50 % orné půdy, tj. ${fmtHa(max)} ha.`);
        }
        if (zapocet > 0) {
          items.push(item('eko-nove-kp', 'Ekoplatba — vytváření nových krajinných prvků', zapocet, 'ha', SAZBY.noveKrajinnePrvky,
            'Krajinné prvky na orné půdě založené a zapsané do LPIS po 1. 1. 2025; ne na plochu přihlášenou do prémiové ekoplatby (§ 24b).'));
        }
      }

      const udrzbaHa = Math.min(pos(input.udrzbaKpHa), ha);
      if (udrzbaHa > 0) {
        items.push(item('eko-udrzba-kp', 'Ekoplatba — údržba krajinných prvků', udrzbaHa, 'ha', SAZBY.udrzbaKrajinnychPrvku,
          'Krajinné prvky na orné půdě a trvalém travním porostu; ne na plochu přihlášenou do prémiové ekoplatby (§ 24d).'));
      }

      if (input.ziviny) {
        if (orna >= LIMITY.minVymeraHa) {
          items.push(item('eko-ziviny', 'Ekoplatba — udržitelné hospodaření s živinami', orna, 'ha', SAZBY.hospodareniZivinami,
            'Na ornou půdu; bilance N nejvýš 60 kg/ha a dodání P podle odběru (§ 24a).'));
        } else {
          warnings.push('Hospodaření s živinami se platí na ornou půdu, nejméně 1 ha — zadejte výměru orné půdy.');
        }
      }

      const pasHa = pos(input.pasoveStridaniHa);
      if (pasHa > 0) {
        const zapocet = Math.min(pasHa, orna);
        if (pasHa < LIMITY.pasoveStridaniMinDpbHa) {
          warnings.push(`Pásové střídání plodin se platí jen na díly půdních bloků o výměře nejméně ${LIMITY.pasoveStridaniMinDpbHa} ha (§ 24c).`);
        } else if (zapocet > 0) {
          if (pasHa > orna) warnings.push('Pásové střídání: výměra je omezená na zadanou ornou půdu.');
          items.push(item('eko-pasove', 'Ekoplatba — pásové střídání plodin', zapocet, 'ha', SAZBY.pasoveStridani,
            'DPB na standardní orné půdě od 4 ha se sklonitostí aspoň 3 %, nejméně 4 pásy plodin (§ 24c).'));
        } else {
          warnings.push('Pásové střídání: zadejte výměru orné půdy.');
        }
      }
    } else if (ekoNastavby > 0) {
      warnings.push('Prémiová ekoplatba, platby na krajinné prvky, živiny a pásové střídání vyžadují základní ekoplatbu — nezapočítány.');
    }

    // CIS — plodiny (Kč/ha), každá nejméně 1 ha.
    let cisNaOrne = 0;
    let cisCelkem = 0;
    for (const p of CIS_PLODINY) {
      const v = pos(input.cisHa?.[p.slug]);
      if (v <= 0) continue;
      if (v < LIMITY.cisMinHa) {
        warnings.push(`CIS ${p.name}: minimální výměra je ${LIMITY.cisMinHa} ha — nezapočítáno.`);
        continue;
      }
      const zapocet = Math.min(v, ha);
      cisCelkem += zapocet;
      if (p.naOrnePude) cisNaOrne += zapocet;
      items.push(item(`cis-${p.slug}`, `CIS: ${p.name}`, zapocet, 'ha', p.sazba, p.description));
    }
    if (cisCelkem > ha) {
      warnings.push('Plochy plodin v CIS dohromady přesahují celkovou výměru — zkontrolujte zadání.');
    }
    if (orna > 0 && cisNaOrne > orna) {
      warnings.push('Zelenina, cukrová řepa, škrobové brambory a bílkovinné plodiny musí být na standardní orné půdě — jejich součet přesahuje zadanou ornou půdu.');
    }
  }

  // CIS — zvířata (Kč/ks); nevyžadují plochu.
  for (const z of CIS_ZVIRATA) {
    const ks = Math.floor(pos(input.cisKs?.[z.slug]));
    if (ks <= 0) continue;
    if (z.slug === 'dojnice') {
      if (ks < LIMITY.dojniceMinKs) {
        warnings.push(`CIS dojnice: nejméně ${LIMITY.dojniceMinKs} kusy — nezapočítáno.`);
        continue;
      }
      if (ks > LIMITY.dojniceMaxBezSchematuKs && !input.dojniceSchemaKvality) {
        warnings.push(`CIS dojnice: nad ${LIMITY.dojniceMaxBezSchematuKs} kusů jen při zapojení hospodářství do schématu kvality (příloha č. 21 NV 83/2023) — nezapočítáno.`);
        continue;
      }
    }
    if (z.slug === 'bahnice-kozy' && ks < LIMITY.bahniceMinKs) {
      warnings.push(`CIS bahnice a kozy: nejméně ${LIMITY.bahniceMinKs} kusů — nezapočítáno.`);
      continue;
    }
    items.push(item(`cis-${z.slug}`, `CIS: ${z.name}`, ks, 'ks', z.sazba, z.description));
  }

  return finish(items, ha, warnings);
}

export function calculateCap(input: CapInput): CapResult {
  const ha = pos(input.totalHa);
  const orna = Math.min(pos(input.ornaHa), ha);

  if (input.maliZemedelec) {
    if (!lzeMaliZemedelec(ha)) {
      const res = calculateStandard(input, ha, orna);
      res.warnings.unshift(ha > LIMITY.maliMaxVymeraPodnikuHa
        ? `Platba pro malé zemědělce je jen pro podniky s nejvýše ${LIMITY.maliMaxVymeraPodnikuHa} ha zemědělské půdy — spočítány běžné platby.`
        : `Platba pro malé zemědělce vyžaduje nejméně ${LIMITY.minVymeraHa} ha způsobilé plochy.`);
      return res;
    }
    const mHa = Math.min(ha, LIMITY.maliMaxHa);
    const items = [item('mali', 'Platba pro malé zemědělce', mHa, 'ha', SAZBY.maliZemedelci,
      `Nejvýše na ${LIMITY.maliMaxHa} ha; nahrazuje BISS, redistributivní platbu, platbu pro mladé zemědělce, CIS i ekoplatby (§ 8).`)];
    const warnings = ['Při žádosti o platbu pro malé zemědělce nelze žádat o žádnou jinou přímou platbu — ostatní zadání se nepočítá. Platby II. pilíře (ANC, AEKO) zůstávají možné.'];
    const res = finish(items, ha, warnings);
    res.alternativa = { label: 'Běžné přímé platby místo platby pro malé zemědělce', total: calculateStandard(input, ha, orna).total };
    return res;
  }

  const res = calculateStandard(input, ha, orna);
  if (lzeMaliZemedelec(ha)) {
    res.alternativa = { label: `Platba pro malé zemědělce (nejvýše ${LIMITY.maliMaxHa} ha) místo všech ostatních přímých plateb`, total: maliZemedelciCastka(ha) };
  }
  return res;
}

export function formatKc(n: number): string {
  return Math.round(n).toLocaleString('cs-CZ') + ' Kč';
}

export function formatSazba(n: number): string {
  return n.toLocaleString('cs-CZ', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
