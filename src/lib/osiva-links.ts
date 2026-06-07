import type { Skupina } from './plodiny';

export interface OsivaLink {
  href: string;
  label: string;
  /** rel atribut; undefined = followed (vlastní síť dle Kontraktu sítě). */
  rel?: string;
  external?: boolean;
}

/**
 * Síťová synergie místo e-shopu: odkaz na vlastní adresář prodejců + na
 * farmakrty.cz (precizní zemědělství / farma Samec, vlastní síť → followed).
 * Žádné ceny, žádný sitewide spam — blok jen na stránkách plodin/odrůd.
 */
export function osivaLinksFor(_skupina: Skupina): OsivaLink[] {
  return [
    { href: '/prodejci/', label: 'Adresář prodejců osiv a agro vstupů' },
    { href: 'https://farmakrty.cz/', label: 'Farma Samec — precizní zemědělství', external: true },
  ];
}
