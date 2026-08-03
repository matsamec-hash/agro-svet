// Kurátorovaný seznam akcií firem navázaných na zemědělství (US + EU).
// Content-first: profily a tickery jsou statické; denní kurzy se doplní přes free API
// (cron → cache) po napojení klíče. Kurzy NEJSOU investiční doporučení (viz disclaimer).

export interface AgroAkcie {
  ticker: string;        // primární burzovní symbol
  isin?: string;
  nazev: string;
  burza: string;         // NYSE / NASDAQ / Xetra / Oslo / Tokyo
  mena: string;          // USD / EUR / NOK / JPY
  kategorie: 'technika' | 'agrochemie' | 'komodity';
  zeme: string;          // vlajka
  profil: string;        // 1 věta, faktická
  web: string;
}

export const KATEGORIE_LABEL: Record<AgroAkcie['kategorie'], string> = {
  technika: 'Zemědělská technika',
  agrochemie: 'Agrochemie, osiva a hnojiva',
  komodity: 'Komodity a zpracování',
};

export const AKCIE: AgroAkcie[] = [
  // ── Technika ──
  { ticker: 'DE', nazev: 'Deere & Company (John Deere)', burza: 'NYSE', mena: 'USD', kategorie: 'technika', zeme: '🇺🇸', web: 'https://www.deere.com', profil: 'Světová jednička v zemědělské technice — traktory, kombajny, precizní zemědělství.' },
  { ticker: 'AGCO', nazev: 'AGCO Corporation', burza: 'NYSE', mena: 'USD', kategorie: 'technika', zeme: '🇺🇸', web: 'https://www.agcocorp.com', profil: 'Matka značek Fendt, Massey Ferguson a Valtra.' },
  { ticker: 'CNH', nazev: 'CNH Industrial', burza: 'NYSE', mena: 'USD', kategorie: 'technika', zeme: '🇬🇧', web: 'https://www.cnhindustrial.com', profil: 'Vlastník značek Case IH, New Holland a Steyr.' },
  { ticker: 'KUBTY', nazev: 'Kubota Corporation', burza: 'OTC / Tokyo 6326', mena: 'USD', kategorie: 'technika', zeme: '🇯🇵', web: 'https://www.kubota.com', profil: 'Japonský výrobce kompaktních traktorů a užitkové techniky.' },
  { ticker: 'TSCO', nazev: 'Tractor Supply Company', burza: 'NASDAQ', mena: 'USD', kategorie: 'technika', zeme: '🇺🇸', web: 'https://www.tractorsupply.com', profil: 'Největší US řetězec potřeb pro farmy a venkovský životní styl.' },
  { ticker: 'TWI', nazev: 'Titan International', burza: 'NYSE', mena: 'USD', kategorie: 'technika', zeme: '🇺🇸', web: 'https://www.titan-intl.com', profil: 'Kola a pneumatiky pro zemědělské a terénní stroje.' },

  // ── Agrochemie, osiva, hnojiva ──
  { ticker: 'BAYN.DE', nazev: 'Bayer AG', burza: 'Xetra', mena: 'EUR', kategorie: 'agrochemie', zeme: '🇩🇪', web: 'https://www.bayer.com', profil: 'Crop Science divize (osiva, přípravky) po akvizici Monsanta; také farma.' },
  { ticker: 'BAS.DE', nazev: 'BASF SE', burza: 'Xetra', mena: 'EUR', kategorie: 'agrochemie', zeme: '🇩🇪', web: 'https://www.basf.com', profil: 'Největší chemička světa; agro divize — přípravky a osiva.' },
  { ticker: 'CTVA', nazev: 'Corteva Agriscience', burza: 'NYSE', mena: 'USD', kategorie: 'agrochemie', zeme: '🇺🇸', web: 'https://www.corteva.com', profil: 'Čistě zemědělská firma (osiva Pioneer + přípravky), odštěpená z DowDuPont.' },
  { ticker: 'KWS.DE', nazev: 'KWS Saat SE', burza: 'Xetra', mena: 'EUR', kategorie: 'agrochemie', zeme: '🇩🇪', web: 'https://www.kws.com', profil: 'Německý šlechtitel osiv (cukrovka, kukuřice, obiloviny).' },
  { ticker: 'NTR', nazev: 'Nutrien', burza: 'NYSE', mena: 'USD', kategorie: 'agrochemie', zeme: '🇨🇦', web: 'https://www.nutrien.com', profil: 'Největší světový producent hnojiv a agro-maloobchodní sítě.' },
  { ticker: 'YAR.OL', nazev: 'Yara International', burza: 'Oslo', mena: 'NOK', kategorie: 'agrochemie', zeme: '🇳🇴', web: 'https://www.yara.com', profil: 'Evropská jednička v dusíkatých hnojivech.' },
  { ticker: 'MOS', nazev: 'The Mosaic Company', burza: 'NYSE', mena: 'USD', kategorie: 'agrochemie', zeme: '🇺🇸', web: 'https://www.mosaicco.com', profil: 'Fosfátová a draselná hnojiva.' },
  { ticker: 'CF', nazev: 'CF Industries', burza: 'NYSE', mena: 'USD', kategorie: 'agrochemie', zeme: '🇺🇸', web: 'https://www.cfindustries.com', profil: 'Producent dusíkatých hnojiv a čpavku.' },

  // ── Komodity a zpracování ──
  { ticker: 'ADM', nazev: 'Archer-Daniels-Midland', burza: 'NYSE', mena: 'USD', kategorie: 'komodity', zeme: '🇺🇸', web: 'https://www.adm.com', profil: 'Zpracování a obchod se zemědělskými komoditami (olejniny, obiloviny).' },
  { ticker: 'BG', nazev: 'Bunge Global', burza: 'NYSE', mena: 'USD', kategorie: 'komodity', zeme: '🇺🇸', web: 'https://www.bunge.com', profil: 'Globální obchodník a zpracovatel olejnin a obilovin.' },
];

// Snapshot kurzů (denní, doplněný cronem po napojení API). Prázdné = kurzy zatím nejsou.
export interface AkcieKurz {
  ticker: string;
  cena: number;
  mena: string;
  zmenaPct: number | null;
  cas: string; // ISO
}
