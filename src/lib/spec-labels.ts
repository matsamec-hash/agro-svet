export const SPEC_LABELS: Record<string, string> = {
  pocet_radlic: 'Počet radlic',
  otocny: 'Otočný',
  pracovni_hloubka_cm: 'Pracovní hloubka (cm)',
  typ_telesa: 'Typ tělesa',
  objem_nadrze_l: 'Objem nádrže (l)',
  zaber_ramen_m: 'Záběr ramen (m)',
  typ_ramen: 'Typ ramen',
  typ_komory: 'Typ komory',
  prumer_baliku_cm: 'Průměr balíku (cm)',
  sirka_baliku_cm: 'Šířka balíku (cm)',
  balic_integrovany: 'Integrovaný balič',
  rozmer_baliku_cm: 'Rozměr balíku (cm)',
  ridlost: 'Hustota lisování',
  pocet_radku: 'Počet řádků',
  rozteč_radku_cm: 'Rozteč řádků (cm)',
  typ_botky: 'Typ botky',
  objem_zasobniku_l: 'Objem zásobníku (l)',
  nosnost_kose_kg: 'Nosnost koše (kg)',
  zaber_aplikace_m: 'Záběr aplikace (m)',
  objem_l: 'Objem (l)',
  typ_aplikatoru: 'Typ aplikátoru',
  typ_zacky: 'Typ žačky',
  mackac: 'Mačkač',
  poloha: 'Poloha',
  nosnost_kg: 'Nosnost (kg)',
  vyska_zdvihu_m: 'Výška zdvihu (m)',
  dosah_m: 'Dosah (m)',
  nosnost_t: 'Nosnost (t)',
  objem_korby_m3: 'Objem korby (m³)',
  pocet_naprav: 'Počet náprav',
  sklapeni: 'Sklápění',
  objem_m3: 'Objem (m³)',
  pocet_sneku: 'Počet šneků',
  samochodny: 'Samojízdný',
  zaber_m: 'Pracovní záběr (m)',
  typ_noze: 'Typ nože',
  hydraulika_l_min: 'Hydraulika (l/min)',
  kabina: 'Kabina',
  strip_till: 'Strip-till',
  sektor: 'Sektor',
};

function prettify(key: string): string {
  return key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' ');
}

export function getSpecLabel(key: string): string {
  return SPEC_LABELS[key] ?? prettify(key);
}

export function formatSpecValue(value: unknown): string {
  if (value === null || value === undefined) return '—';
  if (typeof value === 'boolean') return value ? 'Ano' : 'Ne';
  if (typeof value === 'number') return value.toString().replace('.', ',');
  return String(value);
}
