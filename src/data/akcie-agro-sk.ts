// Slovenský overlay kurátorských textů k akciím agro firem (src/data/akcie-agro.ts).
//
// Overlay, ne druhá databáze — vzor akcie-agro-sk. Klíčem je ticker, doplňují se
// JEN textová pole. Faktická data (ticker, burza, měna, kategorie, CEO, rok
// založení, web) jsou jazykově neutrální a zůstávají v jediném zdroji.
//
// `sidlo` a `obrat` tu jsou proto, že obsahují česká slova: názvy zemí
// a zkratky řádů. Vlastní město a číslo se nemění.
//
// Chybějící ticker není chyba — akcieText() spadne zpět na češtinu. Kompletnost
// hlídá tests/i18n/akcie-sk-overlay.test.ts.
import type { AkcieTextOverlay } from './akcie-agro-pl';

export const AKCIE_SK: Record<string, AkcieTextOverlay> = {
  "DE": {
    profil: "Svetová jednotka v poľnohospodárskej technike — traktory, kombajny, precízne poľnohospodárstvo.",
    popis: "Najväčší výrobca poľnohospodárskej techniky na svete. Okrem traktorov a kombajnov dodáva stavebnú a lesnícku techniku a je priekopníkom precízneho poľnohospodárstva (GPS navádzanie, telematika, autonómne stroje).",
    uspechy: [
      "Vynález samočistiaceho oceľového pluhu (1837)",
      "Priekopník precízneho poľnohospodárstva — GPS navádzanie, autonómny traktor 8R",
      "Najhodnotnejšia značka poľnohospodárskej techniky na svete"
    ],
    sidlo: "Moline, Illinois (USA)",
    obrat: "≈ 51 mld. USD (2023)"
  },
  "AGCO": {
    profil: "Matka značiek Fendt, Massey Ferguson a Valtra.",
    popis: "Americký koncern združujúci prémiové európske aj svetové značky techniky. Vlajkový Fendt patrí k technologickej špičke, Massey Ferguson a Valtra pokrývajú široký segment. Rozvíja precízne poľnohospodárstvo pod platformou Fuse/PTx.",
    uspechy: [
      "Vybudovanie portfólia Fendt + Massey Ferguson + Valtra",
      "Fendt ako technologický líder (Vario CVT)",
      "Akvizícia precíznych technológií (PTx Trimble)"
    ],
    sidlo: "Duluth, Georgia (USA)",
    obrat: "≈ 14,4 mld. USD (2023)"
  },
  "CNH": {
    profil: "Vlastník značiek Case IH, New Holland a Steyr.",
    popis: "Nadnárodný výrobca poľnohospodárskej a stavebnej techniky. Značky Case IH a New Holland patria k svetovej špičke v traktoroch aj kombajnoch; výrazne investuje do precízneho poľnohospodárstva (akvizícia Raven).",
    uspechy: [
      "Case IH Axial-Flow — ikonický rotačný kombajn",
      "New Holland — prvý čisto metánový traktor T6.180",
      "Akvizícia Raven Industries (precízne poľnohospodárstvo)"
    ],
    sidlo: "Basildon (UK) / Londýn",
    obrat: "≈ 24 mld. USD (2023)"
  },
  "KUBTY": {
    profil: "Japonský výrobca kompaktných traktorov a úžitkovej techniky.",
    popis: "Japonský koncern — svetová jednotka v kompaktných a subkompaktných traktoroch, ďalej motory, úžitková technika, čerpadlá a vodohospodárske systémy. V Európe rastie aj v segmente plnohodnotných traktorov (rada M).",
    uspechy: [
      "Svetová jednotka v kompaktných traktoroch",
      "Expanzia do plnohodnotných traktorov (rada M7)",
      "Vlastné spoľahlivé dieselové motory"
    ],
    sidlo: "Ósaka (Japonsko)",
    obrat: "≈ 2,7 bil. JPY (2023)"
  },
  "TSCO": {
    profil: "Najväčší americký reťazec potrieb pre farmy a vidiecky životný štýl.",
    popis: "Najväčší americký maloobchodný reťazec zameraný na farmárov a vidiecky životný štýl — viac ako 2 200 predajní s potrebami pre hospodárstvo, zvieratá, záhradu a dom.",
    uspechy: [
      "Viac ako 2 200 predajní v USA",
      "Jednotka v „rural lifestyle\" retaili"
    ],
    sidlo: "Brentwood, Tennessee (USA)",
    obrat: "≈ 14,6 mld. USD (2023)"
  },
  "TWI": {
    profil: "Kolesá a pneumatiky pre poľnohospodárske a terénne stroje.",
    popis: "Výrobca kolies, pneumatík a podvozkov pre poľnohospodárske, terénne a stavebné stroje. Pod licenciou vyrába aj Goodyear Farm Tires.",
    uspechy: [
      "Goodyear Farm Tires (licenčná výroba)",
      "Kompletné kolesá pre veľké traktory a kombajny"
    ],
    sidlo: "Quincy, Illinois (USA)",
    obrat: "≈ 1,8 mld. USD (2023)"
  },
  "BAYN.DE": {
    profil: "Divízia Crop Science (osivá, prípravky) po akvizícii Monsanta; tiež farmácia.",
    popis: "Nemecký koncern — divízia Crop Science (osivá, prípravky na ochranu rastlín) je po akvizícii Monsanta jednou z jednotiek sveta. Ďalej farmácia a spotrebné zdravie (Aspirin).",
    uspechy: [
      "Akvizícia Monsanto (2018) — jednotka v osivách a ochrane rastlín",
      "Vynález Aspirinu",
      "Digitálna platforma Climate FieldView"
    ],
    sidlo: "Leverkusen (Nemecko)",
    obrat: "≈ 47,6 mld. EUR (2023)"
  },
  "BAS.DE": {
    profil: "Najväčšia chemická spoločnosť sveta; agro divízia — prípravky a osivá.",
    popis: "Najväčší chemický koncern sveta. Poľnohospodárska divízia (Agricultural Solutions) dodáva prípravky na ochranu rastlín, osivá a digitálne riešenia.",
    uspechy: [
      "Najväčšia chemická spoločnosť sveta",
      "Verbund — integrovaná výroba",
      "Fungicídy a osivá repky/soje"
    ],
    sidlo: "Ludwigshafen (Nemecko)",
    obrat: "≈ 68,9 mld. EUR (2023)"
  },
  "CTVA": {
    profil: "Čisto poľnohospodárska firma (osivá Pioneer + prípravky), oddelená zo spoločnosti DowDuPont.",
    popis: "Čisto poľnohospodárska firma vzniknutá oddelením zo spoločnosti DowDuPont — osivá (značka Pioneer) a prípravky na ochranu rastlín.",
    uspechy: [
      "Osivá Pioneer — svetová špička v kukurici a sóji",
      "Vznik čisto agro hráča (2019)"
    ],
    sidlo: "Indianapolis, Indiana (USA)",
    obrat: "≈ 17,2 mld. USD (2023)"
  },
  "KWS.DE": {
    profil: "Nemecký šľachtiteľ osív (cukrová repa, kukurica, obilniny).",
    popis: "Nemecký rodinný šľachtiteľ osív — svetová jednotka v šľachtení cukrovej repy, ďalej kukurice, obilnín a repky.",
    uspechy: [
      "Svetová jednotka v šľachtení cukrovej repy",
      "Viac ako 165 rokov nezávislého šľachtenia"
    ],
    sidlo: "Einbeck (Nemecko)",
    obrat: "≈ 1,68 mld. EUR (2022/23)"
  },
  "NTR": {
    profil: "Najväčší svetový producent hnojív a agro-maloobchodnej siete.",
    popis: "Kanadský gigant — najväčší svetový producent draselných (potash) a ďalších hnojív, zároveň najväčšia agro-maloobchodná sieť (Nutrien Ag Solutions).",
    uspechy: [
      "Fúzia Agrium + PotashCorp (2018)",
      "Najväčší producent potaše na svete"
    ],
    sidlo: "Saskatoon (Kanada)",
    obrat: "≈ 29 mld. USD (2023)"
  },
  "YAR.OL": {
    profil: "Európska jednotka v dusíkatých hnojivách.",
    popis: "Nórska jednotka v dusíkatých hnojivách v Európe, priekopník nízkouhlíkového („zeleného\") čpavku.",
    uspechy: [
      "Európska jednotka v dusíkatých hnojivách",
      "Priekopník zeleného čpavku (dekarbonizácia)"
    ],
    sidlo: "Oslo (Nórsko)",
    obrat: "≈ 15,5 mld. USD (2023)"
  },
  "MOS": {
    profil: "Fosfátové a draselné hnojivá.",
    popis: "Popredný svetový producent koncentrovaných fosfátových a draselných hnojív pre rastlinnú výrobu.",
    uspechy: [
      "Jeden z najväčších producentov fosfátov a potaše",
      "Mosaic Fertilizantes (Brazília)"
    ],
    sidlo: "Tampa, Florida (USA)",
    obrat: "≈ 13,7 mld. USD (2023)"
  },
  "CF": {
    profil: "Producent dusíkatých hnojív a čpavku.",
    popis: "Popredný severoamerický producent dusíkatých hnojív a čpavku; investuje do nízkouhlíkového a „modrého/zeleného“ čpavku ako paliva.",
    uspechy: [
      "Popredný producent čpavku v Severnej Amerike",
      "Projekty nízkouhlíkového čpavku"
    ],
    sidlo: "Northbrook, Illinois (USA)",
    obrat: "≈ 6,6 mld. USD (2023)"
  },
  "ADM": {
    profil: "Spracovanie a obchod so poľnohospodárskymi komoditami (olejniny, obilniny).",
    popis: "Jeden z najväčších svetových spracovateľov a obchodníkov s poľnohospodárskymi komoditami — olejniny, obilniny, škroby, krmivá aj ľudská výživa. Prezývka „supermarket sveta\".",
    uspechy: [
      "Globálna sieť spracovania olejnín a obilnín",
      "Rozvoj rastlinných proteínov a bioproduktov"
    ],
    sidlo: "Chicago, Illinois (Spojené štáty)",
    obrat: "≈ 93,9 mld. USD (2023)"
  },
  "BG": {
    profil: "Globálny obchodník a spracovateľ olejnín a obilnín.",
    popis: "Jeden z najväčších svetových obchodníkov a spracovateľov olejnín (najmä sóje) a rastlinných olejov; kľúčový hráč medzi farmármi a potravinárstvom. Spojenie s Viterrou z neho robí jedného z najväčších obchodníkov s komoditami.",
    uspechy: [
      "Svetová špička v spracovaní sóje a olejnín",
      "Spojenie s Viterra (globálny obchod s komoditami)"
    ],
    sidlo: "St. Louis, Missouri (Spojené štáty)",
    obrat: "≈ 59,5 mld. USD (2023)"
  }
};
