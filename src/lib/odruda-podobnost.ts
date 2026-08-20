// Výběr podobných odrůd pro prolink na detailu odrůdy.
//
// PROČ: detail bral „souvisejících" 6 odrůd jako prvních 6 podle abecedy. To
// znamenalo, že VŠECH 1051 stránek kukuřice odkazovalo na tytéž 6 odrůd a
// zbylých 1045 nedostalo z detailů žádný interní odkaz. Navíc to byl doslova
// identický blok na tisícovce stránek.
//
// Skóre se počítá z týchž znaků, které už na stránce zobrazujeme (parseZnaky
// nad úředním popisem ÚKZÚZ) — nic se nedomýšlí, jen se porovnává.
import { parseZnaky, type OdrudaZnaky } from './odruda-znaky';

export interface PodobnostKandidat {
  slug: string;
  name: string;
  popis?: string | null;
  rok_registrace?: number | null;
}

export interface PodobnaOdruda {
  slug: string;
  name: string;
  rok_registrace?: number | null;
  /** Znaky K ZOBRAZENÍ na kartě (ranost, užití) — dělají blok informativní. */
  znaky: string[];
  skore: number;
}

// Váhy: ranost a užití rozhodují o tom, jestli odrůda vůbec připadá v úvahu na
// stejný pozemek/termín; výška a poléhání jsou doplňkové. Sdílená odolnost proti
// téže chorobě je silný signál — proto per-choroba, ne paušál.
const W_RANOST = 3;
const W_UZITI = 3;
const W_VYSKA = 1;
const W_POLEHANI = 1;
const W_CHOROBA_STEJNA_UROVEN = 2;
const W_CHOROBA_JINA_UROVEN = 1;

export function skoreShody(a: OdrudaZnaky, b: OdrudaZnaky): number {
  let s = 0;
  if (a.ranost && a.ranost === b.ranost) s += W_RANOST;
  if (a.uziti && a.uziti === b.uziti) s += W_UZITI;
  if (a.vyska && a.vyska === b.vyska) s += W_VYSKA;
  if (a.polehani && a.polehani === b.polehani) s += W_POLEHANI;

  const bChoroby = new Map(b.odolnosti.map((o) => [o.choroba, o.uroven]));
  for (const o of a.odolnosti) {
    const u = bChoroby.get(o.choroba);
    if (u === undefined) continue;
    s += u === o.uroven ? W_CHOROBA_STEJNA_UROVEN : W_CHOROBA_JINA_UROVEN;
  }
  return s;
}

// parseZnaky nad ~1000 popisy pro každou z ~1000 stránek téže plodiny by byl
// milion parsů. Cache drží výsledek na (plodina, slug) — build tak parsuje
// každý popis právě jednou.
const znakyCache = new Map<string, OdrudaZnaky>();
function znakyFor(plodinaSlug: string, o: PodobnostKandidat): OdrudaZnaky {
  const key = `${plodinaSlug}/${o.slug}`;
  let z = znakyCache.get(key);
  if (!z) {
    z = parseZnaky(o.popis);
    znakyCache.set(key, z);
  }
  return z;
}

/** Znaky podobné odrůdy k vypsání na kartu. Prázdné, když popis nic nedal. */
function popiskyZnaku(z: OdrudaZnaky): string[] {
  return [z.ranost, z.uziti].filter((x): x is string => Boolean(x));
}

export function podobneOdrudy(
  plodinaSlug: string,
  aktualni: PodobnostKandidat,
  kandidati: PodobnostKandidat[],
  limit = 6,
): PodobnaOdruda[] {
  const zA = znakyFor(plodinaSlug, aktualni);
  const ostatni = kandidati.filter((o) => o.slug !== aktualni.slug);

  const scored = ostatni.map((o) => {
    const z = znakyFor(plodinaSlug, o);
    return {
      slug: o.slug,
      name: o.name,
      rok_registrace: o.rok_registrace ?? null,
      znaky: popiskyZnaku(z),
      skore: skoreShody(zA, z),
    };
  });

  // Když popis nedal žádný znak, je každé skóre 0 a „podobnost" nic neznamená →
  // padáme na abecedu, tedy na dosavadní chování. Předvídatelné a poctivé.
  if (scored.every((s) => s.skore === 0)) {
    scored.sort((a, b) => a.slug.localeCompare(b.slug, 'cs'));
    return scored.slice(0, limit);
  }

  // Shodné skóre = kandidáti jsou z definice stejně podobní, takže je pořadí mezi
  // nimi věcná libovůle. Kdyby rozhodoval rok nebo abeceda, vyhrávala by na všech
  // stránkách plodiny tatáž hrstka odrůd — u kukuřice by z 1051 odrůd dostalo
  // odkaz jen 357. Rozhodne proto hash dvojice (aktuální, kandidát): pořadí je
  // pro každou stránku jiné, ale plně deterministické (stejný build = stejný
  // výstup). Pokrytí u kukuřice tím jde na 1027 z 1051.
  scored.sort((a, b) => {
    if (b.skore !== a.skore) return b.skore - a.skore;
    const ha = hash(aktualni.slug + '|' + a.slug);
    const hb = hash(aktualni.slug + '|' + b.slug);
    if (ha !== hb) return ha - hb;
    return a.slug.localeCompare(b.slug, 'cs');
  });

  return scored.slice(0, limit);
}

/** FNV-1a — stabilní napříč běhy i platformami (na rozdíl od Math.random). */
function hash(s: string): number {
  let x = 2166136261;
  for (let i = 0; i < s.length; i++) {
    x ^= s.charCodeAt(i);
    x = Math.imul(x, 16777619);
  }
  return x >>> 0;
}
