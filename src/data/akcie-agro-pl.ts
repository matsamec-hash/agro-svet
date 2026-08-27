// Polský overlay kurátorských textů k akciím agro firem (src/data/akcie-agro.ts).
//
// Overlay, ne druhá databáze: klíčem je ticker, doplňují se JEN textová pole.
// Faktická data (ticker, burza, měna, kategorie, CEO, rok založení, web) jsou
// jazykově neutrální a zůstávají v jediném zdroji — kdyby se sem zkopírovala,
// začne se to rozcházet.
//
// `sidlo` a `obrat` tu jsou proto, že obsahují česká slova: názvy zemí
// („Japonsko“, „Německo“) a zkratky řádů („mld.“, „bil.“ vs polské „mld“, „bln“).
// Vlastní město a číslo se nemění.
//
// Chybějící ticker není chyba — akcieText() spadne zpět na češtinu. Sekce se
// pro pl launchne až tehdy, když je overlay kompletní (hlídá to test
// tests/i18n/akcie-pl-overlay.test.ts).

import { AKCIE_SK } from './akcie-agro-sk';
import { AKCIE_UK } from './akcie-agro-uk';

export interface AkcieTextOverlay {
  profil?: string;
  popis?: string;
  uspechy?: string[];
  sidlo?: string;
  obrat?: string;
}

export const AKCIE_PL: Record<string, AkcieTextOverlay> = {
  DE: {
    profil: 'Światowy lider maszyn rolniczych — ciągniki, kombajny, rolnictwo precyzyjne.',
    popis:
      'Największy producent maszyn rolniczych na świecie. Poza ciągnikami i kombajnami dostarcza maszyny budowlane i leśne, jest też pionierem rolnictwa precyzyjnego (naprowadzanie GPS, telematyka, maszyny autonomiczne).',
    uspechy: [
      'Wynalezienie samooczyszczającego się pługa stalowego (1837)',
      'Pionier rolnictwa precyzyjnego — naprowadzanie GPS, autonomiczny ciągnik 8R',
      'Najbardziej wartościowa marka maszyn rolniczych na świecie',
    ],
    sidlo: 'Moline, Illinois (USA)',
    obrat: '≈ 51 mld USD (2023)',
  },
  AGCO: {
    profil: 'Właściciel marek Fendt, Massey Ferguson i Valtra.',
    popis:
      'Amerykański koncern skupiający premium europejskie i światowe marki maszyn. Flagowy Fendt należy do czołówki technologicznej, Massey Ferguson i Valtra pokrywają szeroki segment. Rolnictwo precyzyjne rozwija na platformie Fuse/PTx.',
    uspechy: [
      'Zbudowanie portfolio Fendt + Massey Ferguson + Valtra',
      'Fendt jako lider technologiczny (Vario CVT)',
      'Przejęcie technologii precyzyjnych (PTx Trimble)',
    ],
    sidlo: 'Duluth, Georgia (USA)',
    obrat: '≈ 14,4 mld USD (2023)',
  },
  CNH: {
    profil: 'Właściciel marek Case IH, New Holland i Steyr.',
    popis:
      'Międzynarodowy producent maszyn rolniczych i budowlanych. Marki Case IH i New Holland należą do światowej czołówki w ciągnikach i kombajnach; spółka mocno inwestuje w rolnictwo precyzyjne (przejęcie Raven).',
    uspechy: [
      'Case IH Axial-Flow — kultowy kombajn rotorowy',
      'New Holland — pierwszy ciągnik w pełni zasilany metanem T6.180',
      'Przejęcie Raven Industries (rolnictwo precyzyjne)',
    ],
    sidlo: 'Basildon (Wielka Brytania) / Londyn',
    obrat: '≈ 24 mld USD (2023)',
  },
  KUBTY: {
    profil: 'Japoński producent ciągników kompaktowych i maszyn użytkowych.',
    popis:
      'Japoński koncern — światowy lider ciągników kompaktowych i subkompaktowych, a także silników, maszyn użytkowych, pomp i systemów wodociągowych. W Europie rośnie również w segmencie ciągników pełnowymiarowych (seria M).',
    uspechy: [
      'Światowy lider ciągników kompaktowych',
      'Ekspansja w ciągnikach pełnowymiarowych (seria M7)',
      'Własne, niezawodne silniki wysokoprężne',
    ],
    sidlo: 'Osaka (Japonia)',
    obrat: '≈ 2,7 bln JPY (2023)',
  },
  TSCO: {
    profil: 'Największa amerykańska sieć zaopatrzenia gospodarstw i wiejskiego stylu życia.',
    popis:
      'Największa amerykańska sieć handlu detalicznego skierowana do rolników i wiejskiego stylu życia — ponad 2 200 sklepów z zaopatrzeniem dla gospodarstwa, zwierząt, ogrodu i domu.',
    uspechy: ['Ponad 2 200 sklepów w USA', 'Lider handlu w segmencie „rural lifestyle“'],
    sidlo: 'Brentwood, Tennessee (USA)',
    obrat: '≈ 14,6 mld USD (2023)',
  },
  TWI: {
    profil: 'Koła i opony do maszyn rolniczych i terenowych.',
    popis:
      'Producent kół, opon i podwozi do maszyn rolniczych, terenowych i budowlanych. Na licencji produkuje także Goodyear Farm Tires.',
    uspechy: ['Goodyear Farm Tires (produkcja licencyjna)', 'Kompletne koła do dużych ciągników i kombajnów'],
    sidlo: 'Quincy, Illinois (USA)',
    obrat: '≈ 1,8 mld USD (2023)',
  },
  'BAYN.DE': {
    profil: 'Dywizja Crop Science (nasiona, środki ochrony) po przejęciu Monsanto; także farmacja.',
    popis:
      'Niemiecki koncern — dywizja Crop Science (nasiona, środki ochrony roślin) po przejęciu Monsanto należy do światowych liderów. Poza tym farmacja i produkty zdrowotne (Aspirin).',
    uspechy: [
      'Przejęcie Monsanto (2018) — lider w nasionach i ochronie roślin',
      'Wynalezienie aspiryny',
      'Platforma cyfrowa Climate FieldView',
    ],
    sidlo: 'Leverkusen (Niemcy)',
    obrat: '≈ 47,6 mld EUR (2023)',
  },
  'BAS.DE': {
    profil: 'Największy koncern chemiczny świata; dywizja rolnicza — środki ochrony i nasiona.',
    popis:
      'Największy koncern chemiczny świata. Dywizja rolnicza (Agricultural Solutions) dostarcza środki ochrony roślin, nasiona i rozwiązania cyfrowe.',
    uspechy: [
      'Największy koncern chemiczny świata',
      'Verbund — zintegrowana produkcja',
      'Fungicydy oraz nasiona rzepaku i soi',
    ],
    sidlo: 'Ludwigshafen (Niemcy)',
    obrat: '≈ 68,9 mld EUR (2023)',
  },
  CTVA: {
    profil: 'Spółka czysto rolnicza (nasiona Pioneer + środki ochrony), wydzielona z DowDuPont.',
    popis:
      'Spółka czysto rolnicza, powstała przez wydzielenie z DowDuPont — nasiona (marka Pioneer) i środki ochrony roślin.',
    uspechy: ['Nasiona Pioneer — światowa czołówka w kukurydzy i soi', 'Powstanie czystego gracza rolniczego (2019)'],
    sidlo: 'Indianapolis, Indiana (USA)',
    obrat: '≈ 17,2 mld USD (2023)',
  },
  'KWS.DE': {
    profil: 'Niemiecki hodowca nasion (burak cukrowy, kukurydza, zboża).',
    popis:
      'Niemiecki rodzinny hodowca nasion — światowy lider w hodowli buraka cukrowego, poza tym kukurydza, zboża i rzepak.',
    uspechy: ['Światowy lider w hodowli buraka cukrowego', 'Ponad 165 lat niezależnej hodowli'],
    sidlo: 'Einbeck (Niemcy)',
    obrat: '≈ 1,68 mld EUR (2022/23)',
  },
  NTR: {
    profil: 'Największy na świecie producent nawozów i sieć detalu rolniczego.',
    popis:
      'Kanadyjski gigant — największy na świecie producent nawozów potasowych i innych, a zarazem największa sieć detalu rolniczego (Nutrien Ag Solutions).',
    uspechy: ['Fuzja Agrium + PotashCorp (2018)', 'Największy producent nawozów potasowych na świecie'],
    sidlo: 'Saskatoon (Kanada)',
    obrat: '≈ 29 mld USD (2023)',
  },
  'YAR.OL': {
    profil: 'Europejski lider nawozów azotowych.',
    popis: 'Norweski lider nawozów azotowych w Europie, pionier niskoemisyjnego („zielonego“) amoniaku.',
    uspechy: ['Europejski lider nawozów azotowych', 'Pionier zielonego amoniaku (dekarbonizacja)'],
    sidlo: 'Oslo (Norwegia)',
    obrat: '≈ 15,5 mld USD (2023)',
  },
  MOS: {
    profil: 'Nawozy fosforowe i potasowe.',
    popis: 'Czołowy światowy producent skoncentrowanych nawozów fosforowych i potasowych dla produkcji roślinnej.',
    uspechy: ['Jeden z największych producentów fosforanów i nawozów potasowych', 'Mosaic Fertilizantes (Brazylia)'],
    sidlo: 'Tampa, Floryda (USA)',
    obrat: '≈ 13,7 mld USD (2023)',
  },
  CF: {
    profil: 'Producent nawozów azotowych i amoniaku.',
    popis:
      'Czołowy północnoamerykański producent nawozów azotowych i amoniaku; inwestuje w niskoemisyjny („niebieski“/„zielony“) amoniak jako paliwo.',
    uspechy: ['Czołowy producent amoniaku w Ameryce Północnej', 'Projekty niskoemisyjnego amoniaku'],
    sidlo: 'Northbrook, Illinois (USA)',
    obrat: '≈ 6,6 mld USD (2023)',
  },
  ADM: {
    profil: 'Przetwórstwo i handel surowcami rolnymi (rośliny oleiste, zboża).',
    popis:
      'Jeden z największych na świecie przetwórców i handlowców surowcami rolnymi — rośliny oleiste, zboża, skrobie, pasze i żywność. Nazywany „supermarket to the world“.',
    uspechy: ['Globalna sieć przetwórstwa roślin oleistych i zbóż', 'Rozwój białek roślinnych i bioproduktów'],
    sidlo: 'Chicago, Illinois (USA)',
    obrat: '≈ 93,9 mld USD (2023)',
  },
  BG: {
    profil: 'Globalny handlowiec i przetwórca roślin oleistych i zbóż.',
    popis:
      'Jeden z największych na świecie handlowców i przetwórców roślin oleistych (zwłaszcza soi) oraz olejów roślinnych; kluczowy gracz między rolnikami a przemysłem spożywczym. Połączenie z Viterrą czyni z niego jednego z największych handlowców surowcami.',
    uspechy: ['Światowa czołówka w przetwórstwie soi i roślin oleistych', 'Połączenie z Viterra (globalny handel surowcami)'],
    sidlo: 'St. Louis, Missouri (USA)',
    obrat: '≈ 59,5 mld USD (2023)',
  },
};

/** Overlaye podle locale. cs = žádný overlay (zdroj je akcie-agro.ts).
 *  Dispatcher bydlí tady z historických důvodů (pl byl první overlay);
 *  další jazyky se přidávají importem, ne kopií akcieText(). */
const OVERLAYS: Record<string, Record<string, AkcieTextOverlay>> = { pl: AKCIE_PL, sk: AKCIE_SK, uk: AKCIE_UK };

/**
 * Vrátí textové pole firmy v daném jazyce; bez overlaye padá na české originály.
 * Vždycky použij tohle, ne `a.profil` přímo — jinak se do /pl vrátí čeština.
 */
export function akcieText<T extends AkcieTextOverlay>(a: T, locale: string): T {
  const o = OVERLAYS[locale]?.[(a as unknown as { ticker: string }).ticker];
  return o ? { ...a, ...o } : a;
}
