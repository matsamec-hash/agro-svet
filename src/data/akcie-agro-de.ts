// Německý overlay kurátorských textů k akciím agro firem (src/data/akcie-agro.ts).
//
// Overlay, ne druhá databáze — vzor akcie-agro-sk. Klíčem je ticker, doplňují se
// JEN textová pole. Faktická data (ticker, burza, měna, kategorie, CEO, rok
// založení, web) jsou jazykově neutrální a zůstávají v jediném zdroji.
//
// `sidlo` a `obrat` tu jsou proto, že obsahují česká slova: názvy zemí
// a zkratky řádů („mld." -> „Mrd.", „bil." -> „Bio.").  Vlastní město a číslo
// se nemění.
//
// Chybějící ticker není chyba — akcieText() spadne zpět na češtinu. Kompletnost
// hlídá tests/i18n/akcie-sk-overlay.test.ts (běží přes všechny launchnuté locale).
import type { AkcieTextOverlay } from './akcie-agro-pl';

export const AKCIE_DE: Record<string, AkcieTextOverlay> = {
  "DE": {
    profil: "Weltmarktführer in der Landtechnik — Traktoren, Mähdrescher und Präzisionslandwirtschaft.",
    popis: "Der größte Landtechnikhersteller der Welt. Neben Traktoren und Mähdreschern liefert das Unternehmen Bau- und Forstmaschinen und gilt als Wegbereiter der Präzisionslandwirtschaft mit Spurführung, Telemetrie und autonomen Maschinen.",
    uspechy: [
      "Erfindung des selbstreinigenden Stahlpflugs (1837)",
      "Vorreiter der Präzisionslandwirtschaft — Spurführung und der autonome 8R",
      "Wertvollste Landtechnikmarke der Welt",
    ],
    sidlo: "Moline, Illinois (USA)",
    obrat: "≈ 51 Mrd. USD (2023)",
  },
  "AGCO": {
    profil: "Muttergesellschaft der Marken Fendt, Massey Ferguson und Valtra.",
    popis: "US-Konzern, der mehrere europäische und weltweite Landtechnikmarken bündelt. Das Flaggschiff Fendt zählt zur technologischen Spitze, Massey Ferguson und Valtra decken breite Marktsegmente ab. Die Präzisionstechnik läuft unter der Plattform Fuse und PTx.",
    uspechy: [
      "Aufbau des Portfolios aus Fendt, Massey Ferguson und Valtra",
      "Fendt als Technologieführer mit dem Vario-Getriebe",
      "Übernahme von Präzisionstechnik mit PTx Trimble",
    ],
    sidlo: "Duluth, Georgia (USA)",
    obrat: "≈ 14,4 Mrd. USD (2023)",
  },
  "CNH": {
    profil: "Eigentümer der Marken Case IH, New Holland und Steyr.",
    popis: "Multinationaler Hersteller von Landtechnik und Baumaschinen. Case IH und New Holland gehören bei Traktoren wie Mähdreschern zur Weltspitze; das Unternehmen investiert stark in Präzisionslandwirtschaft, unter anderem durch die Übernahme von Raven.",
    uspechy: [
      "Case IH Axial-Flow — der prägende Rotormähdrescher",
      "New Holland T6.180 — erster reiner Methantraktor",
      "Übernahme von Raven Industries für die Präzisionstechnik",
    ],
    sidlo: "Basildon (Vereinigtes Königreich) / London",
    obrat: "≈ 24 Mrd. USD (2023)",
  },
  "KUBTY": {
    profil: "Japanischer Hersteller von Kompakttraktoren und Kommunaltechnik.",
    popis: "Japanischer Konzern und Weltmarktführer bei Kompakt- und Subkompakttraktoren; daneben Motoren, Kommunaltechnik, Pumpen und Wasserwirtschaftssysteme. In Europa wächst die Marke auch im Segment der Standardtraktoren mit der Baureihe M.",
    uspechy: [
      "Weltmarktführer bei Kompakttraktoren",
      "Ausbau ins Standardtraktorensegment mit der Baureihe M7",
      "Eigene, ausgesprochen zuverlässige Dieselmotoren",
    ],
    sidlo: "Osaka (Japan)",
    obrat: "≈ 2,7 Bio. JPY (2023)",
  },
  "TSCO": {
    profil: "Größte US-Einzelhandelskette für Hof- und Landbedarf.",
    popis: "Größte Einzelhandelskette der USA für Landwirtschaft und ländlichen Lebensstil — über 2.200 Filialen mit Bedarf für Hof, Tierhaltung, Garten und Haus.",
    uspechy: [
      "Über 2.200 Filialen in den USA",
      "Marktführer im Segment Rural Lifestyle",
    ],
    sidlo: "Brentwood, Tennessee (USA)",
    obrat: "≈ 14,6 Mrd. USD (2023)",
  },
  "TWI": {
    profil: "Räder und Reifen für Landmaschinen und Geländefahrzeuge.",
    popis: "Hersteller von Rädern, Reifen und Fahrwerken für Land-, Gelände- und Baumaschinen. In Lizenz werden auch Goodyear Farm Tires gefertigt.",
    uspechy: [
      "Goodyear Farm Tires in Lizenzfertigung",
      "Kompletträder für Großtraktoren und Mähdrescher",
    ],
    sidlo: "Quincy, Illinois (USA)",
    obrat: "≈ 1,8 Mrd. USD (2023)",
  },
  "BAYN.DE": {
    profil: "Crop-Science-Sparte mit Saatgut und Pflanzenschutz nach der Monsanto-Übernahme; dazu Pharma.",
    popis: "Deutscher Konzern, dessen Sparte Crop Science mit Saatgut und Pflanzenschutzmitteln nach der Übernahme von Monsanto zur Weltspitze zählt. Daneben Pharmazeutika und rezeptfreie Gesundheitsprodukte.",
    uspechy: [
      "Übernahme von Monsanto 2018 — Weltspitze bei Saatgut und Pflanzenschutz",
      "Erfindung des Aspirins",
      "Digitalplattform Climate FieldView",
    ],
    sidlo: "Leverkusen (Deutschland)",
    obrat: "≈ 47,6 Mrd. EUR (2023)",
  },
  "BAS.DE": {
    profil: "Größter Chemiekonzern der Welt; Agrarsparte mit Pflanzenschutz und Saatgut.",
    popis: "Größter Chemiekonzern der Welt. Die Sparte Agricultural Solutions liefert Pflanzenschutzmittel, Saatgut und digitale Lösungen für den Ackerbau.",
    uspechy: [
      "Größter Chemiekonzern der Welt",
      "Verbund — die integrierte Produktion am Standort Ludwigshafen",
      "Fungizide sowie Raps- und Sojasaatgut",
    ],
    sidlo: "Ludwigshafen (Deutschland)",
    obrat: "≈ 68,9 Mrd. EUR (2023)",
  },
  "CTVA": {
    profil: "Reines Agrarunternehmen mit Pioneer-Saatgut und Pflanzenschutz, abgespalten von DowDuPont.",
    popis: "Reines Agrarunternehmen, entstanden durch Abspaltung von DowDuPont — Saatgut unter der Marke Pioneer sowie Pflanzenschutzmittel.",
    uspechy: [
      "Pioneer-Saatgut — Weltspitze bei Mais und Soja",
      "Entstehung eines reinen Agrarunternehmens 2019",
    ],
    sidlo: "Indianapolis, Indiana (USA)",
    obrat: "≈ 17,2 Mrd. USD (2023)",
  },
  "KWS.DE": {
    profil: "Deutscher Saatgutzüchter für Zuckerrübe, Mais und Getreide.",
    popis: "Deutsches Familienunternehmen der Pflanzenzüchtung und Weltmarktführer bei der Zuckerrübe; daneben Mais, Getreide und Raps.",
    uspechy: [
      "Weltmarktführer in der Zuckerrübenzüchtung",
      "Über 165 Jahre unabhängige Pflanzenzüchtung",
    ],
    sidlo: "Einbeck (Deutschland)",
    obrat: "≈ 1,68 Mrd. EUR (2022/23)",
  },
  "NTR": {
    profil: "Größter Düngemittelproduzent der Welt mit eigenem Agrarhandelsnetz.",
    popis: "Kanadischer Konzern — größter Produzent von Kali- und weiteren Düngemitteln weltweit und zugleich das größte Agrarhandelsnetz mit Nutrien Ag Solutions.",
    uspechy: [
      "Fusion von Agrium und PotashCorp 2018",
      "Größter Kaliproduzent der Welt",
    ],
    sidlo: "Saskatoon (Kanada)",
    obrat: "≈ 29 Mrd. USD (2023)",
  },
  "YAR.OL": {
    profil: "Europäischer Marktführer bei Stickstoffdüngern.",
    popis: "Norwegischer Marktführer bei Stickstoffdüngern in Europa und Wegbereiter von kohlenstoffarmem, sogenanntem grünem Ammoniak.",
    uspechy: [
      "Europäischer Marktführer bei Stickstoffdüngern",
      "Vorreiter bei grünem Ammoniak und der Dekarbonisierung",
    ],
    sidlo: "Oslo (Norwegen)",
    obrat: "≈ 15,5 Mrd. USD (2023)",
  },
  "MOS": {
    profil: "Phosphat- und Kalidünger.",
    popis: "Führender Produzent konzentrierter Phosphat- und Kalidünger für den Pflanzenbau.",
    uspechy: [
      "Einer der größten Phosphat- und Kaliproduzenten weltweit",
      "Mosaic Fertilizantes in Brasilien",
    ],
    sidlo: "Tampa, Florida (USA)",
    obrat: "≈ 13,7 Mrd. USD (2023)",
  },
  "CF": {
    profil: "Produzent von Stickstoffdüngern und Ammoniak.",
    popis: "Führender nordamerikanischer Produzent von Stickstoffdüngern und Ammoniak; investiert in kohlenstoffarmes blaues und grünes Ammoniak, auch als Kraftstoff.",
    uspechy: [
      "Führender Ammoniakproduzent Nordamerikas",
      "Projekte für kohlenstoffarmes Ammoniak",
    ],
    sidlo: "Northbrook, Illinois (USA)",
    obrat: "≈ 6,6 Mrd. USD (2023)",
  },
  "ADM": {
    profil: "Verarbeitung und Handel mit Agrarrohstoffen — Ölsaaten und Getreide.",
    popis: "Einer der weltgrößten Verarbeiter und Händler von Agrarrohstoffen — Ölsaaten, Getreide, Stärke, Futtermittel und Lebensmittelzutaten. Der Beiname lautet Supermarket to the World.",
    uspechy: [
      "Globales Netz zur Verarbeitung von Ölsaaten und Getreide",
      "Ausbau von Pflanzenproteinen und Bioprodukten",
    ],
    sidlo: "Chicago, Illinois (USA)",
    obrat: "≈ 93,9 Mrd. USD (2023)",
  },
  "BG": {
    profil: "Globaler Händler und Verarbeiter von Ölsaaten und Getreide.",
    popis: "Einer der weltgrößten Händler und Verarbeiter von Ölsaaten, allen voran Soja, und pflanzlichen Ölen; ein zentrales Bindeglied zwischen Landwirtschaft und Lebensmittelindustrie. Der Zusammenschluss mit Viterra macht das Unternehmen zu einem der größten Rohstoffhändler überhaupt.",
    uspechy: [
      "Weltspitze in der Verarbeitung von Soja und Ölsaaten",
      "Zusammenschluss mit Viterra im globalen Rohstoffhandel",
    ],
    sidlo: "St. Louis, Missouri (USA)",
    obrat: "≈ 59,5 Mrd. USD (2023)",
  },
};
