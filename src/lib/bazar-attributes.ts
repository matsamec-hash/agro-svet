export type AttrType = 'bool' | 'enum' | 'number';

export interface AttrDef {
  key: string;
  label: string;
  type: AttrType;
  options?: string[];
  optionLabels?: Record<string, string>;
  unit?: string;
  categories: string[]; // konkrétní kategorie nebo ['*'] = sdílené
  filter?: boolean; // default true
  seoLanding?: boolean; // default false
}

/** Strojní kategorie — atributy jako klimatizace/pohon/TP-SPZ dávají smysl jen tady
 * (ne u zvířat, pozemků, osiv, služeb). Používá se jako „skupina strojů" ve slovníku. */
export const MACHINE_CATEGORIES = [
  'traktory','kombajny','zpracovani-pudy','seti','hnojeni','ochrana-rostlin',
  'sklizen-picnin','sklizen-okopanin','manipulace','doprava','komunal-les','staj-chov',
];

export const ATTRIBUTES: AttrDef[] = [
  // Sdílené — stav platí obecně (i díly/příslušenství/osivo); zbytek jen skupina strojů
  { key: 'stav', label: 'Stav', type: 'enum', options: ['nove','pouzite','repasovane'], optionLabels: { nove:'Nové', pouzite:'Použité', repasovane:'Repasované' }, categories: ['*'] },
  { key: 'klimatizace', label: 'Klimatizace', type: 'bool', categories: MACHINE_CATEGORIES, seoLanding: true },
  { key: 'pohon', label: 'Pohon', type: 'enum', options: ['2x4','4x4'], optionLabels: { '2x4':'2×4', '4x4':'4×4' }, categories: MACHINE_CATEGORIES, seoLanding: true },
  { key: 'tp_spz', label: 'TP a SPZ', type: 'bool', categories: ['traktory','doprava','manipulace','komunal-les'], seoLanding: true },
  { key: 'celni_nakladac', label: 'Čelní nakladač', type: 'bool', categories: ['traktory','manipulace'], seoLanding: true },
  // traktory
  { key: 'prevodovka', label: 'Převodovka', type: 'enum', options: ['manual','powershift','cvt'], optionLabels: { manual:'Manuální', powershift:'Powershift', cvt:'CVT / plynulá' }, categories: ['traktory'] },
  { key: 'pocet_valcu', label: 'Počet válců', type: 'number', unit: 'ks', categories: ['traktory'] },
  { key: 'palivo', label: 'Palivo', type: 'enum', options: ['nafta','benzin','elektro'], optionLabels: { nafta:'Nafta', benzin:'Benzin', elektro:'Elektro' }, categories: ['traktory'] },
  { key: 'odpruzena_naprava', label: 'Odpružená náprava', type: 'bool', categories: ['traktory'] },
  { key: 'odpruzena_kabina', label: 'Odpružená kabina', type: 'bool', categories: ['traktory'] },
  { key: 'tribodovy_zaves', label: 'Tříbodový závěs', type: 'bool', categories: ['traktory'] },
  { key: 'vyvodovka_pto', label: 'Vývodovka (PTO)', type: 'bool', categories: ['traktory'] },
  // kombajny
  { key: 'sirka_listy_m', label: 'Šířka lišty', type: 'number', unit: 'm', categories: ['kombajny'] },
  { key: 'drtic_slamy', label: 'Drtič slámy', type: 'bool', categories: ['kombajny'] },
  { key: 'gps_navadeni', label: 'GPS navádění', type: 'bool', categories: ['kombajny'] },
  { key: 'pocet_klasu', label: 'Počet klasů', type: 'number', unit: 'ks', categories: ['kombajny'] },
  // zpracovani-pudy
  { key: 'zavesnost', label: 'Zavěšení', type: 'enum', options: ['nesene','tazene','navesne','samojizdne'], optionLabels: { nesene:'Nesené', tazene:'Tažené', navesne:'Návěsné', samojizdne:'Samojízdné' }, categories: ['zpracovani-pudy','seti','hnojeni','ochrana-rostlin'] },
  { key: 'typ_naradi', label: 'Typ nářadí', type: 'enum', options: ['pluh','podmitac','kompaktor','brany','hloubkovy_kypric'], optionLabels: { pluh:'Pluh', podmitac:'Podmítač', kompaktor:'Kompaktor', brany:'Brány', hloubkovy_kypric:'Hloubkový kypřič' }, categories: ['zpracovani-pudy'] },
  // seti
  { key: 'typ_secky', label: 'Typ secího stroje', type: 'enum', options: ['mechanicka','pneumaticka'], optionLabels: { mechanicka:'Mechanická', pneumaticka:'Pneumatická' }, categories: ['seti'] },
  { key: 'pocet_radku', label: 'Počet řádků', type: 'number', unit: 'ks', categories: ['seti','sklizen-okopanin'] },
  // hnojeni
  { key: 'typ_hnojeni', label: 'Typ', type: 'enum', options: ['rozmetadlo','aplikator_kejdy','aplikator_hnoje'], optionLabels: { rozmetadlo:'Rozmetadlo', aplikator_kejdy:'Aplikátor kejdy', aplikator_hnoje:'Aplikátor hnoje' }, categories: ['hnojeni'] },
  // sklizen-picnin
  { key: 'typ_picnin', label: 'Typ stroje', type: 'enum', options: ['zaci_secka','obracec','shrnovac','lis','rezacka'], optionLabels: { zaci_secka:'Žací sečka', obracec:'Obraceč', shrnovac:'Shrnovač', lis:'Lis', rezacka:'Řezačka' }, categories: ['sklizen-picnin'] },
  // sklizen-okopanin
  { key: 'typ_okopanin', label: 'Typ stroje', type: 'enum', options: ['vyoravac','sklizec','nakladac'], optionLabels: { vyoravac:'Vyorávač', sklizec:'Sklízeč', nakladac:'Nakladač' }, categories: ['sklizen-okopanin'] },
  // manipulace
  { key: 'typ_manipulace', label: 'Typ manipulátoru', type: 'enum', options: ['celni_nakladac','teleskop','vzv','kloubovy_nakladac'], optionLabels: { celni_nakladac:'Čelní nakladač', teleskop:'Teleskopický', vzv:'VZV', kloubovy_nakladac:'Kloubový nakladač' }, categories: ['manipulace'] },
  { key: 'vyska_zdvihu_m', label: 'Výška zdvihu', type: 'number', unit: 'm', categories: ['manipulace'] },
  // doprava
  { key: 'typ_dopravy', label: 'Typ', type: 'enum', options: ['naves','prives','cisterna','valnik','sklapec'], optionLabels: { naves:'Návěs', prives:'Přívěs', cisterna:'Cisterna', valnik:'Valník', sklapec:'Sklápěč' }, categories: ['doprava'] },
  { key: 'pocet_naprav', label: 'Počet náprav', type: 'number', unit: 'ks', categories: ['doprava'] },
  // komunal-les
  { key: 'typ_komunal', label: 'Typ', type: 'enum', options: ['mulcovac','stepkovac','freza','radlice'], optionLabels: { mulcovac:'Mulčovač', stepkovac:'Štěpkovač', freza:'Fréza', radlice:'Radlice' }, categories: ['komunal-les'] },
  // staj-chov
  { key: 'typ_staj', label: 'Typ', type: 'enum', options: ['krmny_voz','dojeni','ustajeni','napajeni','ventilace'], optionLabels: { krmny_voz:'Krmný vůz', dojeni:'Dojení', ustajeni:'Ustájení', napajeni:'Napájení', ventilace:'Ventilace' }, categories: ['staj-chov'] },
  // nahradni-dily
  { key: 'urceno_pro', label: 'Určeno pro', type: 'enum', options: ['traktor','kombajn','naradi','naves','ostatni'], optionLabels: { traktor:'Traktor', kombajn:'Kombajn', naradi:'Nářadí', naves:'Návěs', ostatni:'Ostatní' }, categories: ['nahradni-dily','prislusenstvi'] },
  // osiva-hnojiva
  { key: 'druh_osiva', label: 'Druh', type: 'enum', options: ['osivo','hnojivo','postrik'], optionLabels: { osivo:'Osivo', hnojivo:'Hnojivo', postrik:'Postřik' }, categories: ['osiva-hnojiva'] },
  // pozemky
  { key: 'vymera_ha', label: 'Výměra', type: 'number', unit: 'ha', categories: ['pozemky'] },
  { key: 'druh_pozemku', label: 'Druh pozemku', type: 'enum', options: ['orna','louka','pastvina','les','sad','zahrada'], optionLabels: { orna:'Orná půda', louka:'Louka', pastvina:'Pastvina', les:'Les', sad:'Sad', zahrada:'Zahrada' }, categories: ['pozemky'] },
  // zvirata
  { key: 'druh_zvirete', label: 'Druh', type: 'enum', options: ['skot','prasata','ovce','kozy','kone','drubez','ostatni'], optionLabels: { skot:'Skot', prasata:'Prasata', ovce:'Ovce', kozy:'Kozy', kone:'Koně', drubez:'Drůbež', ostatni:'Ostatní' }, categories: ['zvirata'] },
  { key: 'plemeno', label: 'Plemeno', type: 'enum', options: ['jine'], optionLabels: { jine:'Jiné / neuvedeno' }, categories: ['zvirata'] },
  { key: 'pohlavi', label: 'Pohlaví', type: 'enum', options: ['samec','samice'], optionLabels: { samec:'Samec', samice:'Samice' }, categories: ['zvirata'] },
  { key: 'stari_mesice', label: 'Stáří', type: 'number', unit: 'měs.', categories: ['zvirata'] },
  { key: 'brezost', label: 'Březost', type: 'bool', categories: ['zvirata'] },
  // sluzby
  { key: 'typ_sluzby', label: 'Typ služby', type: 'enum', options: ['servis','doprava','prace_strojem','poradenstvi','ostatni'], optionLabels: { servis:'Servis', doprava:'Doprava', prace_strojem:'Práce strojem', poradenstvi:'Poradenství', ostatni:'Ostatní' }, categories: ['sluzby'] },
];

export function attributesForCategory(category: string): AttrDef[] {
  return ATTRIBUTES.filter((a) => a.categories.includes('*') || a.categories.includes(category));
}

export function attrDef(key: string): AttrDef | undefined {
  return ATTRIBUTES.find((a) => a.key === key);
}

/** Ponechá jen atributy platné pro kategorii a hodnoty odpovídající typu. Neznámé/nevalidní zahodí. */
export function validateAttributes(category: string, raw: Record<string, unknown>): Record<string, unknown> {
  const allowed = new Map(attributesForCategory(category).map((a) => [a.key, a]));
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(raw ?? {})) {
    const def = allowed.get(key);
    if (!def) continue;
    if (def.type === 'bool') {
      if (value === true || value === 'true') out[key] = true;
      else if (value === false || value === 'false') continue; // false = neuvádět
    } else if (def.type === 'enum') {
      const v = String(value);
      if (def.options?.includes(v)) out[key] = v;
    } else if (def.type === 'number') {
      const n = typeof value === 'number' ? value : parseInt(String(value).replace(/[^\d-]/g, ''), 10);
      if (Number.isFinite(n)) out[key] = n;
    }
  }
  return out;
}
