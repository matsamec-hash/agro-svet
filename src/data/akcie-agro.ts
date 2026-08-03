// Kurátorovaný seznam akcií firem navázaných na zemědělství (US + EU).
// Statická (kurátorská) pole = ověřená data k ~2024/25; VOLATILNÍ čísla (kurz,
// tržní kap., P/E, 52t rozpětí) tahá živě Finnhub — nejsou tu natvrdo.
// Kurzy NEJSOU investiční doporučení (viz disclaimer).

export interface CzZastoupeni {
  name: string;
  url: string;
}

export interface AgroAkcie {
  ticker: string;        // primární burzovní symbol (Finnhub)
  nazev: string;
  burza: string;
  mena: string;
  kategorie: 'technika' | 'agrochemie' | 'komodity';
  zeme: string;          // vlajka
  profil: string;        // krátký (do karty)
  web: string;
  // ── kurátorský detail (volitelné) ──
  popis?: string;        // delší popis, co firma dělá
  sidlo?: string;        // město, země (centrála)
  zalozeno?: number;
  reditel?: string;      // CEO
  obrat?: string;        // orientační roční obrat s rokem
  uspechy?: string[];    // největší milníky
  czZastoupeni?: CzZastoupeni[]; // zastoupení / distributor v ČR (jen ověřené)
}

export const KATEGORIE_LABEL: Record<AgroAkcie['kategorie'], string> = {
  technika: 'Zemědělská technika',
  agrochemie: 'Agrochemie, osiva a hnojiva',
  komodity: 'Komodity a zpracování',
};

export const AKCIE: AgroAkcie[] = [
  // ── Technika ──
  {
    ticker: 'DE', nazev: 'Deere & Company (John Deere)', burza: 'NYSE', mena: 'USD', kategorie: 'technika', zeme: '🇺🇸', web: 'https://www.deere.com',
    profil: 'Světová jednička v zemědělské technice — traktory, kombajny, precizní zemědělství.',
    popis: 'Největší výrobce zemědělské techniky na světě. Kromě traktorů a kombajnů dodává stavební a lesnickou techniku a je průkopníkem precizního zemědělství (GPS navádění, telematika, autonomní stroje).',
    sidlo: 'Moline, Illinois (USA)', zalozeno: 1837, reditel: 'John C. May', obrat: '≈ 51 mld. USD (2023)',
    uspechy: ['Vynález samočisticího ocelového pluhu (1837)', 'Průkopník precizního zemědělství — GPS navádění, autonomní traktor 8R', 'Nejhodnotnější značka zemědělské techniky na světě'],
    czZastoupeni: [{ name: 'STROM Praha', url: 'https://www.strompraha.cz' }],
  },
  {
    ticker: 'AGCO', nazev: 'AGCO Corporation', burza: 'NYSE', mena: 'USD', kategorie: 'technika', zeme: '🇺🇸', web: 'https://www.agcocorp.com',
    profil: 'Matka značek Fendt, Massey Ferguson a Valtra.',
    popis: 'Americký koncern sdružující prémiové evropské i světové značky techniky. Vlajkový Fendt patří k technologické špičce, Massey Ferguson a Valtra pokrývají široký segment. Rozvíjí precizní zemědělství pod platformou Fuse/PTx.',
    sidlo: 'Duluth, Georgia (USA)', zalozeno: 1990, reditel: 'Eric Hansotia', obrat: '≈ 14,4 mld. USD (2023)',
    uspechy: ['Vybudování portfolia Fendt + Massey Ferguson + Valtra', 'Fendt jako technologický lídr (Vario CVT)', 'Akvizice precizních technologií (PTx Trimble)'],
    czZastoupeni: [{ name: 'Agromex, s.r.o. (značky koncernu AGCO — Fendt aj.)', url: 'https://agromex.cz' }],
  },
  {
    ticker: 'CNH', nazev: 'CNH Industrial', burza: 'NYSE', mena: 'USD', kategorie: 'technika', zeme: '🇬🇧', web: 'https://www.cnhindustrial.com',
    profil: 'Vlastník značek Case IH, New Holland a Steyr.',
    popis: 'Nadnárodní výrobce zemědělské a stavební techniky. Značky Case IH a New Holland patří ke světové špičce v traktorech i sklízecích mlátičkách; silně investuje do precizního zemědělství (akvizice Raven).',
    sidlo: 'Basildon (UK) / Londýn', zalozeno: 2013, reditel: 'Gerrit Marx', obrat: '≈ 24 mld. USD (2023)',
    uspechy: ['Case IH Axial-Flow — ikonický rotorový kombajn', 'New Holland — první čistě metanový traktor T6.180', 'Akvizice Raven Industries (precizní zemědělství)'],
    czZastoupeni: [{ name: 'AGROTEC a.s.', url: 'https://www.agrotec.cz' }],
  },
  {
    ticker: 'KUBTY', nazev: 'Kubota Corporation', burza: 'OTC / Tokyo 6326', mena: 'USD', kategorie: 'technika', zeme: '🇯🇵', web: 'https://www.kubota.com',
    profil: 'Japonský výrobce kompaktních traktorů a užitkové techniky.',
    popis: 'Japonský koncern — světová jednička v kompaktních a sub-kompaktních traktorech, dále motory, užitková technika, čerpadla a vodohospodářské systémy. V Evropě roste i v segmentu plnohodnotných traktorů (řada M).',
    sidlo: 'Ósaka (Japonsko)', zalozeno: 1890, reditel: 'Yuichi Kitao', obrat: '≈ 2,7 bil. JPY (2023)',
    uspechy: ['Světová jednička v kompaktních traktorech', 'Expanze do plnohodnotných traktorů (řada M7)', 'Vlastní spolehlivé dieselové motory'],
    czZastoupeni: [{ name: 'Kubota Česká republika (K.B.T. PROFTECH s.r.o.)', url: 'https://www.kubota.cz' }],
  },
  {
    ticker: 'TSCO', nazev: 'Tractor Supply Company', burza: 'NASDAQ', mena: 'USD', kategorie: 'technika', zeme: '🇺🇸', web: 'https://www.tractorsupply.com',
    profil: 'Největší US řetězec potřeb pro farmy a venkovský životní styl.',
    popis: 'Největší americký maloobchodní řetězec zaměřený na farmáře a venkovský životní styl — přes 2 200 prodejen s potřebami pro hospodářství, zvířata, zahradu a dům.',
    sidlo: 'Brentwood, Tennessee (USA)', zalozeno: 1938, reditel: 'Hal Lawton', obrat: '≈ 14,6 mld. USD (2023)',
    uspechy: ['Přes 2 200 prodejen v USA', 'Jednička v „rural lifestyle" retailu'],
  },
  {
    ticker: 'TWI', nazev: 'Titan International', burza: 'NYSE', mena: 'USD', kategorie: 'technika', zeme: '🇺🇸', web: 'https://www.titan-intl.com',
    profil: 'Kola a pneumatiky pro zemědělské a terénní stroje.',
    popis: 'Výrobce kol, pneumatik a podvozků pro zemědělské, terénní a stavební stroje. Pod licencí vyrábí i Goodyear Farm Tires.',
    sidlo: 'Quincy, Illinois (USA)', zalozeno: 1890, reditel: 'Paul Reitz', obrat: '≈ 1,8 mld. USD (2023)',
    uspechy: ['Goodyear Farm Tires (licenční výroba)', 'Kompletní kola pro velké traktory a kombajny'],
  },

  // ── Agrochemie, osiva, hnojiva ──
  {
    ticker: 'BAYN.DE', nazev: 'Bayer AG', burza: 'Xetra', mena: 'EUR', kategorie: 'agrochemie', zeme: '🇩🇪', web: 'https://www.bayer.com',
    popis: 'Německý koncern — divize Crop Science (osiva, přípravky na ochranu rostlin) je po akvizici Monsanta jednou z jedniček světa. Dále farmacie a spotřební zdraví (Aspirin).',
    profil: 'Crop Science divize (osiva, přípravky) po akvizici Monsanta; také farma.',
    sidlo: 'Leverkusen (Německo)', zalozeno: 1863, reditel: 'Bill Anderson', obrat: '≈ 47,6 mld. EUR (2023)',
    uspechy: ['Akvizice Monsanto (2018) — jednička v osivech a ochraně rostlin', 'Vynález Aspirinu', 'Digitální platforma Climate FieldView'],
    czZastoupeni: [{ name: 'Bayer — Crop Science Česká republika', url: 'https://www.cropscience.bayer.cz' }],
  },
  {
    ticker: 'BAS.DE', nazev: 'BASF SE', burza: 'Xetra', mena: 'EUR', kategorie: 'agrochemie', zeme: '🇩🇪', web: 'https://www.basf.com',
    popis: 'Největší chemický koncern světa. Zemědělská divize (Agricultural Solutions) dodává přípravky na ochranu rostlin, osiva a digitální řešení.',
    profil: 'Největší chemička světa; agro divize — přípravky a osiva.',
    sidlo: 'Ludwigshafen (Německo)', zalozeno: 1865, reditel: 'Markus Kamieth', obrat: '≈ 68,9 mld. EUR (2023)',
    uspechy: ['Největší chemička světa', 'Verbund — integrovaná výroba', 'Fungicidy a osiva řepky/sóji'],
    czZastoupeni: [{ name: 'BASF — Agro Česká republika (ochrana rostlin)', url: 'https://www.agro.basf.cz/cs/' }],
  },
  {
    ticker: 'CTVA', nazev: 'Corteva Agriscience', burza: 'NYSE', mena: 'USD', kategorie: 'agrochemie', zeme: '🇺🇸', web: 'https://www.corteva.com',
    popis: 'Čistě zemědělská firma vzniklá odštěpením z DowDuPont — osiva (značka Pioneer) a přípravky na ochranu rostlin.',
    profil: 'Čistě zemědělská firma (osiva Pioneer + přípravky), odštěpená z DowDuPont.',
    sidlo: 'Indianapolis, Indiana (USA)', zalozeno: 2019, reditel: 'Chuck Magro', obrat: '≈ 17,2 mld. USD (2023)',
    uspechy: ['Osiva Pioneer — světová špička v kukuřici a sóji', 'Vznik čistého agro hráče (2019)'],
    czZastoupeni: [{ name: 'Corteva Agriscience Czech s.r.o. (osiva Pioneer)', url: 'https://www.corteva.cz' }],
  },
  {
    ticker: 'KWS.DE', nazev: 'KWS Saat SE', burza: 'Xetra', mena: 'EUR', kategorie: 'agrochemie', zeme: '🇩🇪', web: 'https://www.kws.com',
    popis: 'Německý rodinný šlechtitel osiv — světová jednička ve šlechtění cukrové řepy, dále kukuřice, obiloviny a řepka.',
    profil: 'Německý šlechtitel osiv (cukrovka, kukuřice, obiloviny).',
    sidlo: 'Einbeck (Německo)', zalozeno: 1856, reditel: 'Felix Büchting', obrat: '≈ 1,68 mld. EUR (2022/23)',
    uspechy: ['Světová jednička ve šlechtění cukrové řepy', 'Přes 165 let nezávislého šlechtění'],
    czZastoupeni: [{ name: 'KWS OSIVA s.r.o.', url: 'https://www.kws.com/cz/cs/' }],
  },
  {
    ticker: 'NTR', nazev: 'Nutrien', burza: 'NYSE', mena: 'USD', kategorie: 'agrochemie', zeme: '🇨🇦', web: 'https://www.nutrien.com',
    popis: 'Kanadský gigant — největší světový producent draselných (potash) a dalších hnojiv, zároveň největší agro-maloobchodní síť (Nutrien Ag Solutions).',
    profil: 'Největší světový producent hnojiv a agro-maloobchodní sítě.',
    sidlo: 'Saskatoon (Kanada)', zalozeno: 2018, reditel: 'Ken Seitz', obrat: '≈ 29 mld. USD (2023)',
    uspechy: ['Fúze Agrium + PotashCorp (2018)', 'Největší producent potaše na světě'],
  },
  {
    ticker: 'YAR.OL', nazev: 'Yara International', burza: 'Oslo', mena: 'NOK', kategorie: 'agrochemie', zeme: '🇳🇴', web: 'https://www.yara.com',
    popis: 'Norská jednička v dusíkatých hnojivech v Evropě, průkopník nízkouhlíkového („zeleného") čpavku.',
    profil: 'Evropská jednička v dusíkatých hnojivech.',
    sidlo: 'Oslo (Norsko)', zalozeno: 1905, reditel: 'Svein Tore Holsether', obrat: '≈ 15,5 mld. USD (2023)',
    uspechy: ['Evropská jednička v dusíkatých hnojivech', 'Průkopník zeleného čpavku (dekarbonizace)'],
    czZastoupeni: [{ name: 'Yara Agri Czech Republic s.r.o.', url: 'https://www.yaraagri.cz' }],
  },
  {
    ticker: 'MOS', nazev: 'The Mosaic Company', burza: 'NYSE', mena: 'USD', kategorie: 'agrochemie', zeme: '🇺🇸', web: 'https://www.mosaicco.com',
    profil: 'Fosfátová a draselná hnojiva.',
    popis: 'Přední světový producent koncentrovaných fosfátových a draselných hnojiv pro rostlinnou výrobu.',
    sidlo: 'Tampa, Florida (USA)', zalozeno: 2004, reditel: 'Bruce Bodine', obrat: '≈ 13,7 mld. USD (2023)',
    uspechy: ['Jeden z největších producentů fosfátů a potaše', 'Mosaic Fertilizantes (Brazílie)'],
  },
  {
    ticker: 'CF', nazev: 'CF Industries', burza: 'NYSE', mena: 'USD', kategorie: 'agrochemie', zeme: '🇺🇸', web: 'https://www.cfindustries.com',
    profil: 'Producent dusíkatých hnojiv a čpavku.',
    popis: 'Přední severoamerický producent dusíkatých hnojiv a čpavku; investuje do nízkouhlíkového a „modrého/zeleného" čpavku jako paliva.',
    sidlo: 'Northbrook, Illinois (USA)', zalozeno: 1946, reditel: 'Tony Will', obrat: '≈ 6,6 mld. USD (2023)',
    uspechy: ['Přední producent čpavku v Severní Americe', 'Projekty nízkouhlíkového čpavku'],
  },

  // ── Komodity a zpracování ──
  {
    ticker: 'ADM', nazev: 'Archer-Daniels-Midland', burza: 'NYSE', mena: 'USD', kategorie: 'komodity', zeme: '🇺🇸', web: 'https://www.adm.com',
    profil: 'Zpracování a obchod se zemědělskými komoditami (olejniny, obiloviny).',
    popis: 'Jeden z největších světových zpracovatelů a obchodníků se zemědělskými komoditami — olejniny, obiloviny, škroby, krmiva i lidská výživa. Přezdívka „supermarket to the world".',
    sidlo: 'Chicago, Illinois (USA)', zalozeno: 1902, reditel: 'Juan Luciano', obrat: '≈ 93,9 mld. USD (2023)',
    uspechy: ['Globální síť zpracování olejnin a obilovin', 'Rozvoj rostlinných proteinů a bioproduktů'],
  },
  {
    ticker: 'BG', nazev: 'Bunge Global', burza: 'NYSE', mena: 'USD', kategorie: 'komodity', zeme: '🇺🇸', web: 'https://www.bunge.com',
    profil: 'Globální obchodník a zpracovatel olejnin a obilovin.',
    popis: 'Jeden z největších světových obchodníků a zpracovatelů olejnin (zejména sója) a rostlinných olejů; klíčový hráč mezi farmáři a potravinářstvím. Spojení s Viterrou z něj dělá jednoho z největších obchodníků s komoditami.',
    sidlo: 'St. Louis, Missouri (USA)', zalozeno: 1818, reditel: 'Greg Heckman', obrat: '≈ 59,5 mld. USD (2023)',
    uspechy: ['Světová špička ve zpracování sóji a olejnin', 'Spojení s Viterra (globální obchod s komoditami)'],
  },
];

export interface AkcieKurz {
  ticker: string;
  cena: number;
  mena: string;
  zmenaPct: number | null;
  cas: string;
}
