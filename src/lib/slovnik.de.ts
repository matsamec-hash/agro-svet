// Německá (de) varianta slovníku — trh Německo + Rakousko.
// 306 hesel, slug/kategorie/related identické s CS (SLOVNIK), pořadí taktéž.
// ‼️ NENÍ to překlad. Jurisdikčně vázaná hesla jsou NAHRAZENA německým
// a rakouským ekvivalentem, ne přeložena: DZES→GLÖZ, jednotná žádost→
// Sammelantrag/MFA, AEKO→AUM/ÖPUL, LPIS→Feldblock, ÚKZÚZ→BVL/BAES,
// ČSCHM→Deutscher Imkerbund/Biene Österreich, robota→Frondienst/Robot,
// grunt→Bauerngut (Anerbenrecht vs. Realteilung), žentour→Göpel.
// Ceny v Kč jsou převedené na € tam, kde je položka celoevropská, a vypuštěné
// tam, kde je trh jiný. Registrace přípravků je NÁRODNÍ → uvádíme účinné
// látky (INN), ne české obchodní názvy.
import type { SlovnikTerm, SlovnikKategorie } from './slovnik';

export const SLOVNIK_DE: SlovnikTerm[] = [
  {
    "slug": "adblue",
    "term": "AdBlue",
    "alias": [
      "DEF",
      "Harnstofflösung",
      "Diesel Exhaust Fluid"
    ],
    "kategorie": "pohon",
    "shortDef": "AdBlue ist eine 32,5-prozentige wässrige Harnstofflösung, die in den Abgasstrang von Dieselmotoren eingespritzt wird, wo sie Stickoxide (NOx) zu unschädlichem Stickstoff und Wasser reduziert.",
    "longDef": "AdBlue ist der Handelsname einer wässrigen Harnstofflösung (CO(NH₂)₂) in einer Konzentration von 32,5 %. Sie wird in Systemen der selektiven katalytischen Reduktion (SCR) von Dieselmotoren eingesetzt — eingespritzt wird sie vor dem SCR-Katalysator, wo sie mit den Stickoxiden im Abgas reagiert.\n\nOhne funktionierendes AdBlue drosselt ein moderner Traktor (ab Abgasstufe Stage IV / Tier 4 Final) die Leistung oder schaltet ganz ab — das Steuergerät erkennt einen niedrigen Füllstand oder minderwertiges AdBlue und aktiviert den sogenannten Notlauf (limp mode).\n\nDer Verbrauch liegt typischerweise bei 3 bis 5 % des Dieselverbrauchs (auf 100 l Kraftstoff etwa 3 bis 5 l AdBlue). Der Preis bewegt sich im IBC-Container (1 000 l) bei rund 0,60 bis 1,00 €/l, im 10-Liter-Kanister auch bei 1,50 €/l und mehr.\n\nAchten Sie auf die Qualität — verunreinigtes AdBlue (Staub, organische Verunreinigungen) zerstört den teuren SCR-Katalysator (Reparatur ab etwa 4 000 €). Die Norm ISO 22241 legt die Reinheit fest — kaufen Sie stets mit Zertifikat.",
    "related": [
      "scr-katalyzator",
      "emisni-normy-stage",
      "dpf"
    ],
    "externalUrl": "https://de.wikipedia.org/wiki/AdBlue",
    "externalLabel": "Wikipedia: AdBlue"
  },
  {
    "slug": "dpf",
    "term": "DPF",
    "alias": [
      "Diesel Particulate Filter",
      "Dieselpartikelfilter"
    ],
    "kategorie": "pohon",
    "shortDef": "Der DPF (Dieselpartikelfilter) ist ein Partikelfilter im Abgasstrang von Dieselmotoren, der Ruß zurückhält und ihn bei der sogenannten Regeneration periodisch abbrennt.",
    "longDef": "Der DPF ist ein poröser Keramikfilter (typischerweise Cordierit oder Siliciumcarbid), der hinter dem Turbolader sitzt. Er hält Feinstaubpartikel (PM, Ruß) aus dem Abgas zurück — ohne ihn würde ein moderner Diesel die Emissionsgrenzwerte der Stufen Stage IV und Stage V nicht einhalten.\n\nDer Filter setzt sich allmählich zu und muss regeneriert werden — der Ruß wird zu CO₂ abgebrannt. Dafür gibt es drei Wege:\n1. **Passive Regeneration** — bei hoher Abgastemperatur (über 600 °C, etwa unter Volllast) brennt der Ruß von selbst ab.\n2. **Aktive Regeneration** — das Steuergerät spritzt eine kleine Menge Kraftstoff ein, um die Abgastemperatur anzuheben (läuft automatisch im Hintergrund).\n3. **Serviceregeneration** — versagen die ersten beiden (kurze Fahrten, geringe Last), ist ein Werkstattbesuch nötig.\n\nBei Traktoren ist der dritte Fall selten — ein Traktor arbeitet meist über lange Stunden unter Last. Probleme treten vor allem bei Traktoren im kommunalen Kleineinsatz auf (kurze Starts, niedrige Temperatur).\n\nLebensdauer des DPF: 8 000 bis 15 000 Betriebsstunden je nach Marke und Wartung. Ein Austausch kostet etwa 3 000 bis 8 000 €. Vom Ausbau (DPF delete) ist abzuraten — er ist unzulässig, mindert den Wiederverkaufswert und kann bei einer Kontrolle zu Bußgeldern führen.",
    "related": [
      "adblue",
      "scr-katalyzator",
      "emisni-normy-stage"
    ],
    "externalUrl": "https://de.wikipedia.org/wiki/Dieselpartikelfilter",
    "externalLabel": "Wikipedia: Dieselpartikelfilter"
  },
  {
    "slug": "scr-katalyzator",
    "term": "SCR-Katalysator",
    "alias": [
      "Selective Catalytic Reduction",
      "selektive katalytische Reduktion"
    ],
    "kategorie": "pohon",
    "shortDef": "SCR ist ein System zur Minderung der Stickoxide (NOx) im Abgas von Dieselmotoren durch Einspritzen von AdBlue in einen speziellen Katalysator.",
    "longDef": "Die selektive katalytische Reduktion (SCR) ist eine Abgasnachbehandlung, die NOx (Stickoxide) zu unschädlichem Stickstoff (N₂) und Wasser (H₂O) reduziert. Das Prinzip:\n\n1. AdBlue (32,5 % Harnstoff) wird vor dem SCR-Katalysator eingespritzt.\n2. Die hohe Abgastemperatur spaltet den Harnstoff zu Ammoniak (NH₃) auf.\n3. NH₃ reagiert im Katalysator in Gegenwart von Edelmetallen (Vanadium, Wolfram) mit den Stickoxiden — es entstehen N₂ und H₂O.\n\nSCR ist die vorherrschende Technik für die Abgasstufen Stage IV (ab 2014) und Stage V (ab 2020) bei Landmaschinen. Die Alternative war AGR (Abgasrückführung) plus DPF, die allerdings zu höherem Kraftstoffverbrauch führt — deshalb setzten Hersteller wie Fendt, John Deere und New Holland vorrangig auf SCR.\n\nDie Lebensdauer des SCR-Katalysators liegt bei 8 000 bis 15 000 Betriebsstunden, ein Austausch bei etwa 4 000 bis 10 000 €. Hauptrisiko ist verunreinigtes AdBlue (Fremdstoffe, falsche Konzentration) — der Katalysator kann dadurch binnen weniger Dutzend Stunden zerstört werden.",
    "related": [
      "adblue",
      "dpf",
      "emisni-normy-stage"
    ]
  },
  {
    "slug": "emisni-normy-stage",
    "term": "Abgasstufen Stage / Tier",
    "alias": [
      "Stage I",
      "Stage V",
      "Tier 4 Final",
      "Abgasnorm"
    ],
    "kategorie": "regulace",
    "shortDef": "Stage (EU) und Tier (USA) sind schrittweise verschärfte Abgasnormen für Dieselmotoren mobiler Maschinen — von Stage I (1999) bis zur heutigen Stage V (2020).",
    "longDef": "Die Abgasnormen für Dieselmotoren mobiler Maschinen (NRMM — Non-Road Mobile Machinery) heißen in der EU Stage, in den USA Tier. Geregelt werden die Grenzwerte für Partikel (PM), Stickoxide (NOx), Kohlenwasserstoffe (HC) und Kohlenmonoxid (CO).\n\nDie wichtigsten Stufen für Traktoren in der EU:\n- **Stage I** (1999–2001): Grundgrenzwerte, ohne DPF und SCR.\n- **Stage II** (2001–2006): mäßige Senkung von NOx und PM.\n- **Stage IIIA** (2006–2011): weitere Senkung, Motor mit AGR.\n- **Stage IIIB** (2011–2014): DPF verpflichtend.\n- **Stage IV** (2014–2019): SCR (AdBlue) verpflichtend.\n- **Stage V** (ab 2020): am strengsten, DPF plus SCR plus Filterung feinster Partikel.\n\nFür den Gebrauchtkauf: Modelle vor Stage IIIB (bis 2011) haben typischerweise keinen DPF — geringeres Wartungsrisiko, dafür höherer Verbrauch und höhere Emissionen. Modelle ab Stage V (2020+) sind am saubersten, haben aber einen aufwendigen Abgasstrang mit teurer Wartung.\n\nDie US-Stufen laufen parallel: Tier 1 entspricht etwa Stage I, Tier 4 Final etwa Stage IV. Ein Gegenstück zu Stage V gibt es in den USA nicht — die amerikanischen Normen blieben bei Tier 4 Final.",
    "related": [
      "adblue",
      "dpf",
      "scr-katalyzator"
    ]
  },
  {
    "slug": "common-rail",
    "term": "Common Rail",
    "alias": [
      "CRDi",
      "Common-Rail-Einspritzung"
    ],
    "kategorie": "pohon",
    "shortDef": "Common Rail ist ein Einspritzsystem für Dieselmotoren mit einer gemeinsamen Hochdruckleiste (Rail), die den Kraftstoff zu elektronisch gesteuerten Injektoren führt.",
    "longDef": "Common Rail ist ein Einspritzsystem für Dieselmotoren, das sich seit dem Ende der 1990er-Jahre durchgesetzt hat. Das Grundprinzip: Der Kraftstoff steht unter hohem Druck (1 500 bis 2 500 bar) dauerhaft in einer gemeinsamen Leiste (Rail), und elektronisch gesteuerte Injektoren dosieren sehr genaue Mengen in den Zylinder.\n\nVorteile gegenüber älteren Systemen (Pumpe-Düse):\n- Bis zu fünf bis sieben Einspritzungen je Arbeitstakt (Vor-, Haupt- und Nacheinspritzung) — ruhigerer Lauf, saubere Verbrennung.\n- Höherer Einspritzdruck — feinere Zerstäubung, geringere Partikelemission.\n- Elektronische Steuerung — Kennfelder lassen sich leicht an verschiedene Abgasstufen anpassen.\n\nNachteile:\n- Empfindlich gegenüber der Kraftstoffqualität — Wasser oder Schmutz zerstören die Injektoren (600 bis 1 600 € je Stück).\n- Hohe Drücke — eine defekte Hochdruckpumpe ist teuer (ab etwa 2 000 €).\n- Die Diagnose erfordert Herstellersoftware.\n\nCommon Rail ist heute Standard bei allen modernen Traktoren ab Stage IV. Bei guter Kraftstoffqualität hält das System über 10 000 Betriebsstunden.",
    "related": [
      "dpf",
      "common-rail-tlak"
    ]
  },
  {
    "slug": "isobus",
    "term": "ISOBUS",
    "alias": [
      "ISO 11783",
      "Tractor-Implement Bus"
    ],
    "kategorie": "precise-farming",
    "shortDef": "ISOBUS ist ein genormter Datenbus zwischen Traktor und Anbaugerät (Feldspritze, Sämaschine, Presse), der den Datenaustausch und die Bedienung über ein einziges Terminal ermöglicht.",
    "longDef": "ISOBUS (ISO 11783) ist der internationale Standard für die Kommunikation zwischen Traktor, Anbaugerät und Terminal in der Kabine. Vor ISOBUS hatte jeder Gerätehersteller ein eigenes Kabel und Protokoll — eine Sämaschine von John Deere ließ sich nicht ohne kompletten Elektroniktausch an einen Traktor von New Holland hängen.\n\nWas ISOBUS ermöglicht:\n- **UT (Universal Terminal)** — eine Anzeige in der Kabine für alle ISOBUS-Geräte. Hängt man eine Sämaschine von Lemken an einen Fendt, erscheint deren Bedienoberfläche auf dem Fendt-Display.\n- **TC-BAS (Task Controller Basic)** — Erfassung der bearbeiteten Fläche und des Materialverbrauchs.\n- **TC-GEO (Task Controller Geo)** — Applikationskarten nach GPS-Position (teilflächenspezifische Ausbringung).\n- **TC-SC (Section Control)** — automatisches Abschalten von Teilbreiten am Vorgewende und bei Überlappung.\n- **TIM (Tractor Implement Management)** — das Anbaugerät steuert den Traktor (Geschwindigkeit, Heckhubwerk) je nach Arbeitssituation.\n\nISOBUS-Funktionen sind lizenziert — der Traktorhersteller berechnet UT, TC-BAS, TC-GEO und weitere einzeln (etwa 200 bis 3 000 € je Funktion). Prüfen Sie vor dem Kauf in der AEF-Datenbank (aef-online.org), ob die Kombination aus Traktor und Gerät zertifiziert ist.",
    "related": [
      "gps-rtk",
      "auto-steering",
      "variable-rate"
    ],
    "externalUrl": "https://www.aef-online.org/",
    "externalLabel": "AEF-Datenbank"
  },
  {
    "slug": "gps-rtk",
    "term": "RTK-GPS",
    "alias": [
      "RTK",
      "Real-Time Kinematic"
    ],
    "kategorie": "precise-farming",
    "shortDef": "RTK ist eine GPS-Technik mit einer Genauigkeit von 2 bis 3 cm mithilfe eines Korrektursignals von einer Referenzstation. Der Standard für die automatische Lenkung von Traktoren.",
    "longDef": "RTK (Real-Time Kinematic) ist eine GPS-Technik mit zentimetergenauer Positionsbestimmung. Ein einfacher GPS-Empfänger erreicht 1 bis 5 Meter, EGNOS/SBAS etwa 0,5 bis 1 Meter. RTK kommt auf 2 bis 3 Zentimeter, indem es das GPS-Signal mit dem einer ortsfesten Referenzstation bekannter Position vergleicht. Die Korrektur wird über das Mobilfunknetz (NTRIP) oder eine Funkstrecke übertragen.\n\nIn der Landwirtschaft ist RTK entscheidend für:\n- **Automatische Lenkung** (Auto-Steering) — exakt parallele Spuren, weder Überlappung noch Fehlstellen.\n- **Teilflächenspezifische Ausbringung** — genaue Dosierung von Dünger und Pflanzenschutz nach Karte.\n- **Strip-Till und CTF** (Controlled Traffic Farming) — wiederholte Überfahrten in denselben Spuren zur Begrenzung der Bodenverdichtung.\n\nIm deutschsprachigen Raum stehen mehrere Korrekturdienste zur Verfügung: der amtliche **SAPOS** der Landesvermessung in Deutschland (je nach Bundesland teils kostenfrei), **APOS** in Österreich sowie die Netze der Hersteller (John Deere StarFire, Trimble VRS Now, Topcon TopNET Live) für etwa 500 bis 1 500 € im Jahr.\n\nAlternative: eine eigene Basisstation (etwa 2 000 bis 6 000 € einmalig) — sie lohnt sich für größere Betriebe mit mehreren Maschinen.",
    "related": [
      "isobus",
      "auto-steering",
      "variable-rate"
    ],
    "externalUrl": "https://de.wikipedia.org/wiki/Real_Time_Kinematic",
    "externalLabel": "Wikipedia: Real Time Kinematic"
  },
  {
    "slug": "auto-steering",
    "term": "Automatische Lenkung",
    "alias": [
      "Auto-Steering",
      "Spurführung",
      "AutoTrac",
      "IntelliSteer"
    ],
    "kategorie": "precise-farming",
    "shortDef": "Die automatische Lenkung führt den Traktor mit RTK-Genauigkeit selbsttätig auf einer programmierten Spur — der Fahrer legt die Spuren fest, die Maschine hält sie selbst.",
    "longDef": "Die automatische Lenkung (Auto-Steering; Markennamen: John Deere AutoTrac, Trimble Autopilot, Case IH AccuGuide, New Holland IntelliSteer) hält den Traktor selbsttätig auf einer per GPS programmierten Spur, ohne dass der Fahrer eingreifen muss. Pedale, Aushebung und das Wenden am Vorgewende bleiben beim Fahrer.\n\nDie Bestandteile:\n1. **GPS-Empfänger** mit RTK-Korrektur (zentimetergenau).\n2. **Terminal** zur Spurplanung (AB-Linien, Kurven, Konturen).\n3. **Lenkaktor** — ein Elektromotor an der Lenksäule oder ein Hydraulikventil in der Lenkung.\n\nDie wichtigsten Vorteile:\n- **Keine Überlappung** — die Bahnen von Feldspritze oder Sämaschine überschneiden sich nicht, das spart 5 bis 15 % Pflanzenschutzmittel oder Saatgut.\n- **Weniger Ermüdung** — eine Zwölfstundenschicht ohne dauerhafte Konzentration auf die Spur.\n- **Arbeit bei Nacht und Nebel** — die Genauigkeit hängt nicht von der Sicht ab.\n- **Höhere Schlagkraft** — breitere Geräte lassen sich schneller fahren.\n\nKosten: etwa 6 000 bis 20 000 € zum Nachrüsten, 4 000 bis 10 000 € als Werksausstattung. Die Amortisation liegt bei Betrieben ab etwa 100 Hektar typischerweise bei zwei bis vier Jahren.",
    "related": [
      "gps-rtk",
      "isobus",
      "variable-rate"
    ]
  },
  {
    "slug": "variable-rate",
    "term": "Teilflächenspezifische Ausbringung",
    "alias": [
      "VRA",
      "Variable Rate Application",
      "Applikationskarten"
    ],
    "kategorie": "precise-farming",
    "shortDef": "Die teilflächenspezifische Ausbringung ändert die Menge an Dünger, Saatgut oder Pflanzenschutzmittel nach einer GPS-Karte mit unterschiedlichen Werten für einzelne Teilflächen des Schlags.",
    "longDef": "Die teilflächenspezifische Ausbringung (VRA — Variable Rate Application) ist das Kernprinzip des Precision Farming: Dünger, Saatgut, Pflanzenschutzmittel oder Wasser werden nach dem tatsächlichen Bedarf jeder Teilfläche ausgebracht statt in einer einheitlichen Menge über den ganzen Schlag.\n\nDatengrundlagen für die Karten:\n- **Bodenuntersuchungen** im Raster (10×10 oder 30×30 m) — Karten für pH, P, K und organische Substanz.\n- **Ertragskarten** vom Mähdrescher — wo tatsächlich am meisten geerntet wird.\n- **Satellitenbilder** (Sentinel-2, Planet) — NDVI als Maß der Biomasse.\n- **Drohnen** mit Multispektralkamera — Auflösung bis in den Zentimeterbereich.\n\nDer Ablauf:\n1. Datenerfassung, Auswertung in einer Ackerschlagkartei oder Farmsoftware (Climate FieldView, John Deere Operations Center, NEXT Farming, Agrar-Office).\n2. Export der Applikationskarte als ISO-XML oder Shapefile.\n3. Import ins Terminal in der Kabine (ISOBUS TC-GEO).\n4. Während der Fahrt ändert die Maschine die Menge selbsttätig nach GPS-Position.\n\nTypisch sind 10 bis 25 % Düngereinsparung ohne Ertragsverlust, teils sogar mit höherem Ertrag. Die Amortisation des Gesamtsystems (RTK, ISOBUS-fähiges Gerät, Software) liegt bei Betrieben ab etwa 150 Hektar bei zwei bis fünf Jahren.",
    "related": [
      "isobus",
      "gps-rtk",
      "auto-steering"
    ]
  },
  {
    "slug": "cvt-prevodovka",
    "term": "Stufenloses Getriebe (CVT)",
    "alias": [
      "Continuously Variable Transmission",
      "stufenloses Getriebe",
      "Vario",
      "AutoPowr",
      "TTV"
    ],
    "kategorie": "technologie",
    "shortDef": "Ein CVT ist ein stufenloses Getriebe, das die Übersetzung ohne Gangwechsel kontinuierlich verändert. Bei Premiumtraktoren der Standard.",
    "longDef": "Das stufenlose Getriebe (CVT — Continuously Variable Transmission) verändert die Übersetzung kontinuierlich, ohne diskrete Gangstufen. Bei Traktoren ist es typischerweise eine Kombination aus hydrostatischem und mechanischem Zweig (leistungsverzweigtes Getriebe, power split).\n\nDie wichtigsten Vorteile:\n- **Optimale Motordrehzahl** — der Fahrer gibt die gewünschte Geschwindigkeit vor, das Getriebe hält den Motor selbsttätig im wirtschaftlichen Bereich (meist 1 500 bis 1 800 min⁻¹).\n- **Ruckfreies Anfahren und Verzögern** — kein Zugkraftunterbruch, schonender für stoßempfindliche Geräte wie Pressen und Sämaschinen.\n- **Tempomat** — hält die Geschwindigkeit auch bei wechselndem Gelände und wechselnder Last.\n- **Reversieren ohne Kupplung** — beim Arbeiten mit dem Frontlader schneller als eine hydraulische Wendeschaltung.\n\nDie wichtigsten Bauarten:\n- **Fendt Vario** — der Wegbereiter (1995), das am längsten gebaute CVT, hohe Zuverlässigkeit.\n- **John Deere AutoPowr / IVT** — ab der Baureihe 7R.\n- **Case IH CVXDrive** — Puma, Magnum.\n- **New Holland Auto Command** — T6, T7, T8.\n- **Deutz-Fahr TTV**.\n- **Massey Ferguson Dyna-VT** — 6S, 7S, 8S.\n\nNachteile: höherer Anschaffungspreis (etwa 8 000 bis 20 000 € Aufpreis gegenüber Lastschaltung), aufwendigerer Service und Empfindlichkeit gegenüber verschmutztem Hydrauliköl.",
    "related": [
      "powershift",
      "hydrostat"
    ]
  },
  {
    "slug": "powershift",
    "term": "Lastschaltgetriebe (Powershift)",
    "alias": [
      "Teillastschaltung",
      "Vollpowershift",
      "PowrQuad"
    ],
    "kategorie": "technologie",
    "shortDef": "Ein Lastschaltgetriebe hat mechanische Gangstufen, schaltet sie aber über hydraulische Lamellenkupplungen unter Last, ohne dass gekuppelt werden muss.",
    "longDef": "Das Lastschaltgetriebe (Powershift) hat mechanische Gangstufen wie ein Schaltgetriebe, wechselt sie aber unter Last, ohne dass der Fahrer kuppelt. Möglich machen das hydraulische Lamellenkupplungen, die während des Schaltvorgangs die Drehzahlen beider Wellen angleichen (in etwa 0,3 Sekunden).\n\nDie wichtigsten Vorteile:\n- **Schalten unter voller Last** — weder Geschwindigkeit noch Zugkraft brechen ein, ideal beim Pflügen und bei schwerer Zugarbeit.\n- **Einfacher als ein CVT** — weniger Bauteile, günstigerer Service.\n- **Lebensdauer** — typischerweise über 10 000 Betriebsstunden ohne große Instandsetzung.\n\nBauarten:\n- **Teillastschaltung** — ein Teil der Gänge wird von Hand geschaltet, ein Teil unter Last (etwa 24×24 mit vierstufiger Lastschaltung).\n- **Vollpowershift** — alle 16 bis 24 Gänge schalten unter Last (etwa John Deere PowrQuad, Case IH Maxxum ActiveDrive).\n\nNachteile gegenüber dem CVT: Der Fahrer muss den Gang selbst wählen — oder sich auf die Automatik verlassen, die gelegentlich unpassend schaltet — und der Motor läuft nicht immer in der optimalen Drehzahl.\n\nPreislich liegt es etwa 4 000 bis 12 000 € unter einem vergleichbaren CVT. Es lohnt sich bei Traktoren, deren Hauptaufgabe Pflügen und ähnlich gleichmäßige Zugarbeit ist.",
    "related": [
      "cvt-prevodovka",
      "hydrostat"
    ]
  },
  {
    "slug": "hydrostat",
    "term": "Hydrostatisches Getriebe",
    "alias": [
      "HST",
      "Hydrostat"
    ],
    "kategorie": "technologie",
    "shortDef": "Ein hydrostatisches Getriebe überträgt die Leistung über eine Hydraulikpumpe und einen Hydraulikmotor — die Geschwindigkeit ändert sich stufenlos über Joystick oder Pedal. Verbreitet bei Kleintraktoren und Mähdreschern.",
    "longDef": "Das hydrostatische Getriebe (HST — Hydrostatic Transmission) überträgt die Motorleistung über eine Hydraulikpumpe auf einen Hydraulikmotor, der die Räder antreibt. Die Geschwindigkeit ändert sich über das Fördervolumen der Pumpe — stufenlos von voller Rückwärtsfahrt über null bis zur vollen Vorwärtsfahrt.\n\nHauptanwendungen in der Landwirtschaft:\n- **Kleintraktoren** (Kompakttraktoren von 25 bis 60 PS, etwa Kubota L-Serie) — Bedienung per Pedal oder Joystick, geeignet für ständigen Geschwindigkeitswechsel beim Laden oder Mähen.\n- **Mähdrescher** — hydrostatischer Fahrantrieb bei mechanischem Antrieb der Arbeitsorgane.\n- **Lader** (Hof- und Radlader) — hier ist HST Standard.\n- **Kommunaltechnik** — Mäher, Geräteträger.\n\nVorteile: einfache Bedienung, kein Schalten, feinfühliges Rangieren. Nachteile: geringerer Wirkungsgrad als ein mechanisches Getriebe (15 bis 25 % Verlust), ungeeignet für schwere Zugarbeit auf dem Feld (das Öl erwärmt sich rasch, die Leistung fällt ab).\n\nBei großen Ackerschleppern ab 100 PS wird HST nicht als alleiniger Fahrantrieb eingesetzt — dort übernimmt ein leistungsverzweigtes CVT, das den Hydrostaten mit einem mechanischen Zweig kombiniert und dadurch deutlich effizienter ist.",
    "related": [
      "cvt-prevodovka",
      "powershift"
    ]
  },
  {
    "slug": "npk-hnojivo",
    "term": "NPK-Dünger",
    "alias": [
      "NPK",
      "Mineraldünger",
      "Volldünger"
    ],
    "kategorie": "hnojivo",
    "shortDef": "NPK ist ein Mineraldünger mit den drei Hauptnährstoffen Stickstoff (N), Phosphor (P) und Kalium (K). Die Bezeichnung 15-15-15 bedeutet je 15 % der drei Nährstoffe.",
    "longDef": "Der NPK-Dünger ist ein mineralischer Mehrnährstoffdünger mit den drei Hauptnährstoffen Stickstoff (N), Phosphor (P) und Kalium (K) in unterschiedlichen Verhältnissen.\n\nDie Bezeichnung nennt die Gehalte in Prozent. Beispiele:\n- **NPK 15-15-15** — ausgewogen, universell einsetzbar.\n- **NPK 11-44-11** — Unterfußdüngung zur Saat (hoher Phosphoranteil für die Wurzelentwicklung).\n- **NPK 8-20-30** — Herbstdüngung zu Wintergetreide (wenig N, viel K).\n- **NPK 20-10-10** — Frühjahrsgabe zu Weizen.\n\nWichtig: P wird als **P₂O₅** angegeben, K als **K₂O** — nicht als reines Element. Für die Umrechnung gilt:\n- 1 kg P entspricht 2,29 kg P₂O₅\n- 1 kg K entspricht 1,20 kg K₂O\n\nSpurennährstoffe (S, Mg, Ca, B, Zn, Cu) enthalten die Plus-Varianten (etwa NPK + S oder NPK mit Mikronährstoffen). Der Preis für NPK 15-15-15 bewegt sich je nach Saison und Herkunft bei etwa 500 bis 750 € je Tonne.\n\nFür die teilflächenspezifische Ausbringung nach GPS-Karte braucht es einen Düngerstreuer oder eine Sämaschine mit ISOBUS TC-GEO.",
    "related": [
      "variable-rate",
      "pH-pudy",
      "mocovina"
    ]
  },
  {
    "slug": "mocovina",
    "term": "Harnstoff",
    "alias": [
      "Urea",
      "Carbamid",
      "Harnstoffdünger"
    ],
    "kategorie": "hnojivo",
    "shortDef": "Harnstoff (chemisch Urea, CO(NH₂)₂) ist der konzentrierteste Stickstoffdünger — er enthält 46 % N und ist je Einheit Stickstoff der günstigste.",
    "longDef": "Harnstoff (Urea, Carbamid) ist eine organische Verbindung der Formel CO(NH₂)₂. Als Dünger ist er die konzentrierteste Stickstoffquelle mit 46 % N. Hergestellt wird er großtechnisch aus synthetischem Ammoniak und CO₂.\n\nDie wichtigsten Eigenschaften:\n- **Günstigster Preis je Einheit Stickstoff** — typischerweise 15 bis 20 % preiswerter als Ammonsulfat oder Ammonnitrat, bezogen auf das Kilogramm N.\n- **Verzögerte Wirkung** — der Stickstoff muss zunächst enzymatisch zu Ammonium umgesetzt und anschließend nitrifiziert werden (etwa ein bis drei Wochen).\n- **Verlustrisiko durch Ausgasung** — bei Ausbringung auf die Oberfläche und warmer, trockener Witterung können 10 bis 30 % des Stickstoffs als NH₃ entweichen. Abhilfe schaffen die Einarbeitung oder ein Ureasehemmer (NBPT). ‼️ In Deutschland schreibt die Düngeverordnung seit 2020 vor, Harnstoff entweder unverzüglich einzuarbeiten oder mit Ureasehemmer auszubringen.\n\nAnwendung:\n- Frühjahrsgabe zu Winterweizen: 100 bis 250 kg/ha (entspricht 46 bis 115 kg N/ha).\n- Zu Mais als Unterfuß- und Reihendüngung: 200 bis 500 kg/ha.\n- Als Blattdünger in Lösung: 5 bis 15 kg/ha.\n\nHarnstoff ist zugleich der Grundstoff für AdBlue (32,5-prozentige Lösung) — dieselbe Verbindung, aber in höherer Reinheit.",
    "related": [
      "npk-hnojivo",
      "adblue"
    ]
  },
  {
    "slug": "pH-pudy",
    "term": "Boden-pH",
    "alias": [
      "pH-Wert des Bodens",
      "Bodenreaktion"
    ],
    "kategorie": "agrotechnika",
    "shortDef": "Der Boden-pH misst die Bodenreaktion — unter 7 sauer, über 7 alkalisch. Für die meisten Ackerkulturen liegt das Optimum bei pH 6,0 bis 7,0. Korrigiert wird über Kalkung oder ansäuernde Dünger.",
    "longDef": "Der pH-Wert des Bodens ist das logarithmische Maß der Konzentration von Wasserstoffionen (H⁺). Die Skala reicht von 0 bis 14, neutral ist 7. Böden in Mitteleuropa sind wegen der Niederschläge und der Kalkauswaschung überwiegend schwach sauer (pH 5,5 bis 6,8).\n\nOptimaler pH-Wert der wichtigsten Kulturen:\n- **Weizen, Gerste, Mais**: 6,0 bis 7,0\n- **Zuckerrübe**: 6,5 bis 7,5 (empfindlich gegenüber Versauerung)\n- **Kartoffeln**: 5,5 bis 6,5 (vertragen schwach sauer)\n- **Luzerne, Klee**: 6,5 bis 7,0\n- **Heidelbeere, Preiselbeere**: 4,5 bis 5,5 (brauchen sauren Boden)\n\nFolgen eines falschen pH-Werts:\n- **Zu sauer** (unter 5,5): blockiert die Aufnahme von P, K und Mg, mobilisiert toxisches Aluminium und Mangan, hemmt das Bodenleben. Abhilfe: Kalkung mit kohlensaurem Kalk (CaCO₃) oder Dolomitkalk, 2 bis 6 t/ha.\n- **Zu alkalisch** (über 7,5): blockiert die Aufnahme der Spurennährstoffe (Fe, Mn, Zn, B). Abhilfe: Ammonsulfat, elementarer Schwefel, organische Substanz.\n\nMessung: Bodenuntersuchung in einem akkreditierten Labor — in Deutschland die LUFA der Landwirtschaftskammern, in Österreich die AGES. Rechnen Sie mit etwa 20 bis 60 € je Probe und planen Sie eine Untersuchung alle vier bis sechs Jahre ein.\n\nFür die teilflächenspezifische Kalkung werden die Proben im Raster (etwa 30×30 m) gezogen — daraus entsteht eine pH-Karte und daraus die Applikationskarte für den Kalkstreuer.",
    "related": [
      "npk-hnojivo",
      "variable-rate"
    ]
  },
  {
    "slug": "mezi-plodiny",
    "term": "Zwischenfrüchte",
    "alias": [
      "Zwischenfrucht",
      "Begrünung",
      "Cover Crops"
    ],
    "kategorie": "agrotechnika",
    "shortDef": "Zwischenfrüchte werden zwischen zwei Hauptkulturen gesät, um die Bodenfruchtbarkeit zu verbessern, vor Erosion zu schützen und Stickstoff zu binden. Bestandteil der Öko-Regelungen und des ÖPUL.",
    "longDef": "Zwischenfrüchte werden in der Zeit zwischen der Ernte der Hauptkultur und der nächsten Aussaat angebaut, häufig über den Winter oder in der Sommerbrache. Sie dienen:\n\n1. **Dem Erosionsschutz** — sie decken die Oberfläche in der Zeit von Starkregen und Wind ab.\n2. **Der Stickstoffbindung** (bei Leguminosen: Wicke, Erbse, Lupine) — Knöllchenbakterien binden Luftstickstoff.\n3. **Der Nährstoffmobilisierung** — ein tiefreichendes Wurzelwerk erschließt P und K aus tieferen Schichten.\n4. **Dem Humusaufbau** — die eingearbeitete Biomasse bildet Humus.\n5. **Der Unterdrückung von Unkraut und Krankheiten** — sie stören den Entwicklungszyklus mancher Unkräuter.\n6. **Der Kohlenstoffbindung** — der Kohlenstoff wird dauerhaft im Boden festgelegt.\n\nTypische Arten: Weißer Senf (rasch, günstig), Phacelia (schnellwüchsig, gut für die Sommerbrache), Winterwicke mit Roggen (winterhart, vor einer Sommerung), Inkarnatklee (N-Bindung, Futter), Buchweizen (kurze Sommerzwischenfrucht) sowie Ölrettich.\n\nFörderrechtlich sind Zwischenfrüchte in **Deutschland** Bestandteil der Öko-Regelung ÖR 2 (Vielfältige Kulturen) und der GLÖZ-Standards, in **Österreich** der ÖPUL-Maßnahme Begrünung von Ackerflächen — dort mit gestaffelten Sätzen je nach Begrünungsvariante (Mulchsaat, Direktsaat, Untersaaten). Die genauen Beträge nennen der Bundesanzeiger beziehungsweise die AMA-Merkblätter.",
    "related": [
      "eko-platba",
      "biopasy",
      "cap-2024"
    ]
  },
  {
    "slug": "biopasy",
    "term": "Blühstreifen",
    "alias": [
      "Blühfläche",
      "Biodiversitätsfläche",
      "Randstreifen"
    ],
    "kategorie": "agrotechnika",
    "shortDef": "Blühstreifen sind nicht produktiv genutzte Streifen zwischen den Hauptkulturen, angelegt für Biodiversität, Insekten, Vögel und Niederwild. Bestandteil der Öko-Regelungen und des ÖPUL.",
    "longDef": "Blühstreifen sind nicht produktive Streifen auf Ackerflächen (typischerweise 6 bis 20 Meter breit), die Wildtieren als Rückzugsraum dienen — Bestäubern, Niederwild und Vögeln. Sie können mit besonderen Mischungen aus blühenden Pflanzen eingesät oder als selbstbegrünende Brache belassen werden.\n\nTypen:\n- **Blühstreifen für Bestäuber** — Mischung blühender Arten (Phacelia, Sonnenblume, Buchweizen, Klee, Esparsette). Entscheidend für Honigbienen und Wildbestäuber.\n- **Äsungsstreifen** — für Rebhuhn, Fasan und Hase, mit Getreide, Sonnenblume und Mais.\n- **Grasstreifen** — gegen Erosion, entlang von Gewässern.\n- **Randstreifen am Schlagrand** — 6 bis 12 Meter breit, in mehreren Förderprogrammen vorgeschrieben.\n\nFörderrechtlich:\n- In **Deutschland** sind Blühstreifen die Öko-Regelung ÖR 1b (Blühstreifen auf Ackerland) und ÖR 1c (in Dauerkulturen); die nicht produktive Ackerfläche selbst deckt ÖR 1a ab, gestaffelt nach Flächenanteil.\n- In **Österreich** gehören sie zu den Biodiversitätsflächen des ÖPUL, seit 2025 ergänzt um die Maßnahme Nichtproduktive Ackerflächen und Agroforststreifen.\n- Zusätzlich zählen sie zu den Flächen, die der GLÖZ-Standard 8 verlangt.\n\nPraktische Regeln: Ein Blühstreifen darf während der Brut- und Setzzeit nicht gemäht und nicht mit Pflanzenschutzmitteln behandelt werden; die Pflege erfolgt einmal jährlich durch Mulchen oder Mahd. Die genauen Fristen unterscheiden sich je Bundesland beziehungsweise Programm.",
    "related": [
      "mezi-plodiny",
      "eko-platba",
      "cap-2024"
    ]
  },
  {
    "slug": "cap-2024",
    "term": "GAP 2023–2027",
    "alias": [
      "Gemeinsame Agrarpolitik",
      "Common Agricultural Policy",
      "GAP-Strategieplan"
    ],
    "kategorie": "dotace",
    "shortDef": "Die GAP 2023–2027 ist die Förderperiode der Gemeinsamen Agrarpolitik der EU. Die Direktzahlungen bestehen aus Einkommensgrundstützung, Umverteilung, Junglandwirteförderung, Öko-Regelungen und gekoppelter Stützung.",
    "longDef": "Die Gemeinsame Agrarpolitik (GAP) ist das wichtigste Finanzinstrument der EU zur Förderung der Landwirtschaft. Die laufende Periode 2023 bis 2027 brachte eine grundlegende Reform — mehr Gewicht auf Umweltleistungen, Umverteilung zugunsten kleinerer Betriebe und Erhalt der natürlichen Ressourcen. Jeder Mitgliedstaat setzt sie über einen eigenen **nationalen Strategieplan** um, weshalb sich die Beträge zwischen Deutschland und Österreich deutlich unterscheiden.\n\n**Deutschland** (endgültige Einheitsbeträge Antragsjahr 2025, bekannt gemacht im Bundesanzeiger):\n1. **Einkommensgrundstützung für Nachhaltigkeit** — 152,44 €/ha auf alle förderfähigen Hektar.\n2. **Umverteilungseinkommensstützung** — 68,05 €/ha für den 1. bis 40. Hektar, 40,83 €/ha für den 41. bis 60. Hektar; ab dem 61. Hektar entfällt sie.\n3. **Einkommensstützung für Junglandwirte** — 120,64 €/ha, höchstens 120 ha, für fünf Jahre.\n4. **Öko-Regelungen** — sieben freiwillige Maßnahmen mit eigenen Beträgen.\n5. **Gekoppelte Einkommensstützung** — Mutterkühe 89,37 €/Tier, Mutterschafe und -ziegen 36,14 €/Tier.\n\n**Österreich** (Richtwerte des Strategieplans für die gesamte Periode):\n1. **Basiseinkommensstützung** — rund 208 €/ha Heimgutfläche, rund 41 €/ha Almweidefläche.\n2. **Umverteilung** — rund 44 €/ha für den 1. bis 20., rund 22 €/ha für den 21. bis 40. Hektar.\n3. **Junglandwirte** — rund 66 €/ha, höchstens 40 ha, für fünf Jahre.\n4. **ÖPUL** — das Agrarumweltprogramm der zweiten Säule.\n5. **Gekoppelte Stützung Almauftrieb** — rund 100 €/RGVE für Kühe sowie Zuchtschafe und -ziegen, rund 50 €/RGVE für sonstige Rinder.\n\n‼️ Ein wesentlicher Unterschied: Deutschland macht die **endgültigen** Beträge jährlich im Bundesanzeiger bekannt, Österreich nennt **Richtwerte** für die Periode. Verbindlich ist in beiden Fällen erst der Bescheid der Bewilligungsstelle beziehungsweise der AMA.\n\nDer Antrag wird einmal jährlich im Sammelantrag gestellt (Deutschland über die Portale der Länder, Österreich über eAMA), üblicherweise bis Mitte Mai.",
    "related": [
      "eko-platba",
      "mezi-plodiny",
      "biopasy"
    ],
    "externalUrl": "https://www.bmel.de/DE/themen/landwirtschaft/eu-agrarpolitik-und-foerderung/gap/gap-reform.html",
    "externalLabel": "BMEL — GAP-Reform"
  },
  {
    "slug": "eko-platba",
    "term": "Öko-Regelungen",
    "alias": [
      "Eco-Schemes",
      "Ökoregelungen",
      "ÖR"
    ],
    "kategorie": "dotace",
    "shortDef": "Die Öko-Regelungen sind der freiwillige Umweltteil der Direktzahlungen. In Deutschland gibt es sieben Maßnahmen mit eigenen Beträgen je Hektar, in Österreich übernimmt diese Rolle das ÖPUL.",
    "longDef": "Die Öko-Regelungen (Eco-Schemes) sind der freiwillige Umweltbestandteil der Direktzahlungen der ersten Säule. Sie honorieren Leistungen, die über die verpflichtende Konditionalität hinausgehen.\n\nIn **Deutschland** gibt es sieben Öko-Regelungen (geplante Beträge Antragsjahr 2025 laut BMLEH):\n- **ÖR 1a** Nichtproduktive Ackerflächen — gestaffelt: 1 300 €/ha bis 1 % der Ackerfläche, 500 €/ha über 1 bis 2 %, 300 €/ha über 2 bis 6 %.\n- **ÖR 1b** Blühstreifen auf Ackerland — 200 €/ha.\n- **ÖR 1c** Blühstreifen in Dauerkulturen — 200 €/ha.\n- **ÖR 1d** Altgrasstreifen im Dauergrünland — 900 / 400 / 200 €/ha, ebenfalls gestaffelt.\n- **ÖR 2** Vielfältige Kulturen im Ackerbau — 60 €/ha.\n- **ÖR 3** Agroforstwirtschaft — 200 €/ha Gehölzfläche.\n- **ÖR 4** Extensivierung des gesamten Dauergrünlands — 100 €/ha.\n- **ÖR 5** Kennarten im Dauergrünland — 225 €/ha.\n- **ÖR 6** Verzicht auf chemisch-synthetische Pflanzenschutzmittel — 150 €/ha in Dauerkulturen, 50 €/ha in übrigen Kulturen.\n- **ÖR 7** Extensive Bewirtschaftung in Natura-2000-Gebieten — 40 €/ha.\n\n‼️ Die Beträge sind **geplant**, nicht endgültig — sie werden nach der tatsächlich beantragten Fläche berechnet. Steigt die Beteiligung, sinkt der Betrag je Hektar.\n\nIn **Österreich** gibt es keine gesonderten Öko-Regelungen der ersten Säule; die Rolle übernimmt das **ÖPUL** in der zweiten Säule mit den Basismodulen UBB und Biologische Wirtschaftsweise sowie zahlreichen Zuschlägen.\n\nOb sich die Teilnahme lohnt, hängt vom Aufwand ab: Übersteigt der Betrag je Hektar die Kosten aus Saatgut, Aussaat und Pflege sowie den entgangenen Ertrag, ist sie wirtschaftlich. Bei ÖR 1a mit gestaffeltem Satz lohnen sich vor allem die ersten Prozent der Ackerfläche.",
    "related": [
      "cap-2024",
      "mezi-plodiny",
      "biopasy"
    ]
  },
  {
    "slug": "lpis",
    "term": "Feldblockkataster (InVeKoS)",
    "alias": [
      "InVeKoS",
      "FLIK",
      "Feldblock",
      "LPIS"
    ],
    "kategorie": "dotace",
    "shortDef": "Das Feldblockkataster ist die amtliche Referenz der landwirtschaftlichen Flächen. Jeder Feldblock hat eine eindeutige Kennung (FLIK), auf die sich Förderanträge und Kontrollen beziehen.",
    "longDef": "Das System zur Identifizierung landwirtschaftlicher Parzellen (EU-weit LPIS — Land Parcel Identification System) ist Teil des **Integrierten Verwaltungs- und Kontrollsystems (InVeKoS)**. Es ist die amtliche Referenz dafür, welche Flächen förderfähig sind.\n\nIn **Deutschland** heißt die Einheit **Feldblock** und trägt eine eindeutige Kennung, den **FLIK** (Flächenidentifikator). Geführt wird das Kataster von den Ländern; jedes Bundesland betreibt ein eigenes Portal (etwa FIONA in Baden-Württemberg, iBALIS in Bayern, ELAN in Nordrhein-Westfalen). In **Österreich** führt die AMA das Referenzsystem, die Einheit heißt **Feldstück** und wird über eAMA verwaltet.\n\nWas hinterlegt ist:\n- **Grenzen des Feldblocks** im GIS, aus Luftbildern abgeleitet.\n- **Nutzungsart** — Ackerland, Dauergrünland, Dauerkultur, sonstige Fläche.\n- **Fläche** in Hektar.\n- **Landschaftselemente** im Block — Einzelbaum, Hecke, Feldrain, Feuchtgebiet. Sie sind geschützt und zählen zur förderfähigen Fläche.\n- **Gebietskulissen** — benachteiligtes Gebiet, Natura 2000, rote Gebiete nach Düngeverordnung, erosionsgefährdete Flächen (CC-Wasser, CC-Wind).\n\nDie Grenzen sind über die Geoportale der Länder beziehungsweise über INSPIRE öffentlich einsehbar.\n\nWichtig: Der Feldblock ist die **Referenzfläche**, der Schlag die tatsächlich bewirtschaftete Einheit. Ein Feldblock kann mehrere Schläge verschiedener Betriebe enthalten. Weicht die beantragte Fläche von der Referenz ab, folgen Rückfragen und mögliche Kürzungen — die Pflege der Daten ist deshalb Voraussetzung für jeden Förderantrag.",
    "related": [
      "cap-2024",
      "biss",
      "dpb"
    ],
    "externalUrl": "https://www.bmel.de/DE/themen/landwirtschaft/eu-agrarpolitik-und-foerderung/direktzahlungen/",
    "externalLabel": "BMEL — Direktzahlungen"
  },
  {
    "slug": "biss",
    "term": "Einkommensgrundstützung",
    "alias": [
      "Basic Income Support for Sustainability",
      "BISS",
      "Basisprämie"
    ],
    "kategorie": "dotace",
    "shortDef": "Die Einkommensgrundstützung für Nachhaltigkeit ist die wichtigste Direktzahlung der GAP — sie wird auf alle förderfähigen Hektar gezahlt und löste die frühere Basisprämie ab.",
    "longDef": "Die Einkommensgrundstützung für Nachhaltigkeit (EU-Kürzel BISS — Basic Income Support for Sustainability) ist die Basis der Direktzahlungen der ersten Säule. Sie wird auf jeden förderfähigen Hektar gezahlt, der im Referenzsystem (Feldblockkataster) geführt wird, und ersetzte zum Antragsjahr 2023 die frühere Basisprämie.\n\n**Deutschland**: 152,44 €/ha für das Antragsjahr 2025 (endgültiger Einheitsbetrag, bekannt gemacht im Bundesanzeiger). Der Betrag sinkt von Jahr zu Jahr, weil der feste nationale Finanzrahmen durch die tatsächlich beantragte Fläche geteilt und Geld in die Öko-Regelungen umgeschichtet wird — 2023 lag er noch bei 170,93 €/ha.\n\n**Österreich**: rund 208 €/ha Heimgutfläche, rund 41 €/ha Almweidefläche (Richtwerte des GAP-Strategieplans).\n\nVoraussetzungen für den Anspruch:\n1. **Aktiver Landwirt** — tatsächliche landwirtschaftliche Tätigkeit, nicht bloßes Halten von Flächen.\n2. **Sammelantrag** — einmal jährlich, in Deutschland über das Portal des jeweiligen Bundeslandes, in Österreich über eAMA; Frist üblicherweise Mitte Mai.\n3. **Mindestfläche** — je nach Mitgliedstaat ein Hektar oder ein Mindestbetrag.\n4. **Konditionalität** — Einhaltung der GLÖZ-Standards und der Grundanforderungen an die Betriebsführung (GAB).\n\nAusgezahlt wird in der Regel ab Dezember des Antragsjahres. Werden bei einer Kontrolle Abweichungen festgestellt, drohen Kürzungen und die Rückforderung bereits gezahlter Beträge.",
    "related": [
      "cap-2024",
      "lpis",
      "eko-platba"
    ]
  },
  {
    "slug": "dpb",
    "term": "Schlag",
    "alias": [
      "Feldstück",
      "Bewirtschaftungseinheit",
      "Teilschlag"
    ],
    "kategorie": "dotace",
    "shortDef": "Der Schlag ist die kleinste Bewirtschaftungseinheit — eine zusammenhängende Fläche eines Betriebs mit einer Kultur. Er ist die Grundlage des Förderantrags innerhalb des Feldblocks.",
    "longDef": "Der Schlag ist die eigentliche Bewirtschaftungseinheit: eine zusammenhängende, von einem Betrieb bewirtschaftete Fläche mit einer Kultur. In Österreich heißt die entsprechende Einheit **Feldstück**, unterteilt in **Schläge**.\n\nDer Unterschied zum Feldblock ist wesentlich: Der **Feldblock** ist die amtliche Referenzfläche aus Luftbildern, dauerhaft und unabhängig vom Bewirtschafter. Der **Schlag** ist das, was ein Betrieb im laufenden Jahr tatsächlich darauf anbaut. Ein Feldblock kann mehrere Schläge verschiedener Betriebe enthalten, und die Schlaggrenzen wechseln mit der Fruchtfolge.\n\nBeispiel: Ein Betrieb bewirtschaftet fünf Felder — jedes ist ein Schlag. Ist ein Feld zur Hälfte mit Zuckerrüben und zur Hälfte mit Weizen bestellt, sind es zwei Schläge (dieselbe Nutzungsart Ackerland, aber unterschiedliche Kulturen).\n\nDer Schlag ist maßgeblich für:\n- **Direktzahlungen** — die Flächen aller Schläge werden für die Einkommensgrundstützung summiert.\n- **Gekoppelte Stützung** und Öko-Regelungen — teils schlagbezogen zu beantragen.\n- **Benachteiligte Gebiete** — die Gebietskulisse gilt flächenscharf.\n- **Erosionsschutz** — die Einstufung nach Wasser- und Winderosion (CC-Wasser, CC-Wind) bestimmt Auflagen zur Bodenbearbeitung.\n- **Düngeplanung** — die Düngeverordnung verlangt schlagbezogene Aufzeichnungen.\n\nDie Schlagdaten werden im Sammelantrag jährlich neu erklärt; die Feldblockgrenzen pflegt dagegen die Verwaltung.",
    "related": [
      "lpis",
      "biss",
      "cap-2024"
    ]
  },
  {
    "slug": "ttp",
    "term": "Dauergrünland",
    "alias": [
      "Grünland",
      "Wiese",
      "Weide",
      "permanent grassland"
    ],
    "kategorie": "agrotechnika",
    "shortDef": "Dauergrünland ist eine Fläche mit Gras oder anderen Grünfutterpflanzen, die fünf Jahre oder länger nicht in die Fruchtfolge einbezogen war. Eine eigene Nutzungsart mit besonderem Schutz.",
    "longDef": "Dauergrünland ist eine Fläche mit Gras oder anderen Grünfutterpflanzen, die seit mindestens fünf Jahren nicht mehr Teil der Fruchtfolge war — also weder umgebrochen noch mit einer anderen Kultur bestellt wurde. Im Referenzsystem ist es eine eigene Nutzungsart, getrennt vom Ackerland.\n\nDie Regeln der GAP 2023–2027:\n- **Umbruchverbot** — Dauergrünland darf nur mit Genehmigung umgebrochen werden, und in der Regel nur gegen Anlage einer Ersatzfläche. Der GLÖZ-Standard 1 verpflichtet die Mitgliedstaaten, das Verhältnis von Dauergrünland zur landwirtschaftlichen Fläche zu erhalten; sinkt es um mehr als 5 %, greifen Wiederansaatpflichten.\n- **Umweltsensibles Dauergrünland** in Natura-2000-Gebieten — absolutes Umbruchverbot (GLÖZ 9).\n- **Mindesttätigkeit** — wird die Fläche nicht beweidet, ist mindestens ein jährlicher Schnitt oder Mulchgang nötig, damit sie förderfähig bleibt.\n- **Öko-Regelungen** — für Dauergrünland gibt es in Deutschland eigene Maßnahmen: ÖR 1d (Altgrasstreifen), ÖR 4 (Extensivierung des gesamten Dauergrünlands) und ÖR 5 (Kennarten).\n- **Benachteiligte Gebiete** — Grünland in Berggebieten erhält die höchsten Ausgleichszulagen; in Österreich richtet sie sich nach der Erschwernis über den Berghöfekataster.\n\nDauergrünland hat hohen ökologischen Wert — Artenvielfalt, Wasserrückhalt und Kohlenstoffspeicherung im Boden. Ein Umbruch setzt große Mengen gebundenen Kohlenstoffs frei, weshalb der Schutz europaweit verankert ist.",
    "related": [
      "lpis",
      "cap-2024",
      "pastvina"
    ]
  },
  {
    "slug": "pto",
    "term": "Zapfwelle",
    "alias": [
      "Power Take-Off",
      "PTO",
      "Nebenabtrieb"
    ],
    "kategorie": "technologie",
    "shortDef": "Die Zapfwelle ist der Nebenabtrieb am Traktor zum Antrieb von Anbaugeräten — Sämaschine, Mähwerk, Presse, Feldspritze. Die Normdrehzahlen sind 540 und 1 000 min⁻¹.",
    "longDef": "Die Zapfwelle (englisch Power Take-Off, PTO) ist eine rotierende Welle am Heck — bei modernen Traktoren auch an der Front —, die die Motorleistung auf das angebaute Gerät überträgt: Mähwerk, Presse, Sämaschine, Feldspritze, Mulcher oder gezogener Erntetechnik.\n\nNormdrehzahlen:\n- **540 min⁻¹** — die älteste Norm, bis heute für leichtere Geräte (Mulcher, Mähwerk, kleine Feldspritzen).\n- **1 000 min⁻¹** — für schwere Geräte (Pressen, gezogene Erntemaschinen, große Feldspritzen).\n- **540E (Economy)** — Sparstufe: Der Motor läuft bei etwa 1 500 min⁻¹, die Zapfwelle hält dennoch 540 — das spart 10 bis 15 % Kraftstoff.\n- **1000E** — dasselbe Prinzip für die 1 000er-Drehzahl.\n\nWellenprofile:\n- **6 Keile** — Standard für 540 min⁻¹.\n- **21 Keile** — für 1 000 min⁻¹, höhere Festigkeit.\n\nSicherheit: Die Zapfwelle ist eines der gefährlichsten Bauteile am Traktor — eine rotierende Welle mit über 10 m/s Umfangsgeschwindigkeit erfasst Kleidung und kann tödliche Verletzungen verursachen. Der Schutz an Traktor und Gelenkwelle ist vorgeschrieben und muss vollständig sein; vor dem An- und Abbauen ist der Motor abzustellen.\n\nManche modernen Traktoren haben eine **Zapfwellenautomatik**, die die Zapfwelle beim Ausheben des Hubwerks oder beim Anhalten selbsttätig abschaltet.",
    "related": [
      "hydraulika-traktor",
      "tribod"
    ]
  },
  {
    "slug": "tribod",
    "term": "Dreipunkthydraulik",
    "alias": [
      "Dreipunktaufhängung",
      "Dreipunkt",
      "three-point hitch"
    ],
    "kategorie": "technologie",
    "shortDef": "Die Dreipunkthydraulik ist die genormte Aufnahme für Anbaugeräte am Heck oder an der Front des Traktors — zwei Unterlenker und ein Oberlenker.",
    "longDef": "Die Dreipunkthydraulik ist die wichtigste Normung der Landtechnik überhaupt: Sie erlaubt, praktisch jedes Anbaugerät an praktisch jeden Traktor zu hängen. Erfunden hat sie Harry Ferguson in den 1930er-Jahren (Ferguson-System).\n\nDie Bauteile:\n- **Zwei Unterlenker** — hydraulisch ausgehoben, sie bestimmen die Arbeitshöhe des Geräts.\n- **Ein Oberlenker** — längenverstellbar, er bestimmt die Neigung des Geräts.\n- **Stabilisatoren** — sie begrenzen die seitliche Beweglichkeit.\n\nKategorien nach Tragfähigkeit und Bolzendurchmesser:\n- **Kat. I** — kleine Traktoren bis etwa 40 PS, Bolzen 22 mm.\n- **Kat. II** — mittlere Traktoren von 40 bis 100 PS, Bolzen 28 mm.\n- **Kat. III** — große Traktoren von 80 bis 225 PS, Bolzen 36 mm.\n- **Kat. IV** — die größten ab 180 PS, Bolzen 45 mm.\n- **Kat. III-N und IV-N** — schmalere Ausführungen für bessere Handhabung.\n\nDie Hubkraft wird an den Koppelpunkten angegeben — typischerweise etwa 3 500 kg bei Kat. II, 6 500 kg bei Kat. III und über 12 000 kg bei Kat. IV. Wichtig ist die Unterscheidung zwischen der Hubkraft an den Koppelpunkten und der geringeren Hubkraft im gesamten Hubbereich.\n\nDie **Fronthydraulik** ist bei Premiumtraktoren heute üblich: Sie erlaubt Kombinationen aus Front- und Heckgerät in einer Überfahrt und steigert damit die Schlagkraft erheblich.",
    "related": [
      "pto",
      "hydraulika-traktor"
    ]
  },
  {
    "slug": "hydraulika-traktor",
    "term": "Traktorhydraulik",
    "alias": [
      "Hydrauliksystem",
      "Load Sensing",
      "LS",
      "PFC"
    ],
    "kategorie": "technologie",
    "shortDef": "Die Traktorhydraulik versorgt Hubwerk, externe Steuergeräte für Anbaugeräte und häufig auch die Lenkung. Moderne Systeme arbeiten lastabhängig (Load Sensing).",
    "longDef": "Das Hydrauliksystem des Traktors versorgt:\n1. **Das Hubwerk** — Ausheben der Anbaugeräte.\n2. **Die externen Steuergeräte** (SCV — Selective Control Valves) — hydraulische Funktionen am Gerät, etwa Klappen der Feldspritze, Zylinder, Winden.\n3. **Die Lenkhilfe**.\n4. **Zapfwellenkupplung, Differenzialsperre und Allradzuschaltung.**\n\nBauarten:\n- **Offener Kreislauf (Open Center)** — die Pumpe fördert dauerhaft den vollen Volumenstrom, der Überschuss läuft in den Tank zurück. Einfach, aber wenig effizient; für leichte Geräte ausreichend.\n- **Geschlossener Kreislauf mit Load Sensing (LS)** — heutiger Standard: Die Pumpe liefert nur so viel Druck und Volumenstrom, wie das Gerät anfordert. Das spart 5 bis 15 % Kraftstoff.\n- **PFC (Pressure Flow Compensation)** — die Premiumvariante des Load Sensing mit noch feinerer Regelung.\n\nDie wichtigsten Kennwerte:\n- **Maximaler Druck** — typischerweise 200 bar bei kleinen, bis 250 bar bei großen Traktoren.\n- **Maximaler Volumenstrom** — 60 l/min bei Kleintraktoren, über 200 l/min bei Spitzenmodellen.\n- **Zahl der Steuergeräte** — zwei sind Standard, vier bis sechs bei Premiumtraktoren für aufwendige Geräte.\n\nBeim Öl teilen sich Getriebe und Hydraulik bei vielen Traktoren denselben Kreislauf (UTTO — Universal Tractor Transmission Oil); der Wechsel steht alle 1 500 bis 3 000 Betriebsstunden an. Mischen mit ATF oder Motoröl ist nicht zulässig — die Additivpakete sind nicht kompatibel.",
    "related": [
      "tribod",
      "pto"
    ]
  },
  {
    "slug": "hektar",
    "term": "Hektar (ha)",
    "alias": [
      "ha",
      "Flächeneinheit"
    ],
    "kategorie": "jednotky",
    "shortDef": "Der Hektar (ha) ist eine Flächeneinheit von 10 000 m², also einem Quadrat von 100 × 100 m. In der Landwirtschaft die Standardeinheit für Flächen, Förderung und Erträge.",
    "longDef": "Der Hektar (ha) ist die Flächeneinheit des metrischen Systems: 1 ha = 10 000 m² = 100 Ar. Anschaulich ein Quadrat von 100 × 100 Metern oder etwa anderthalb Fußballfelder.\n\nIn der Landwirtschaft ist der Hektar die Bezugsgröße für:\n- **Betriebsfläche** — ganze Betriebe werden in Hektar gemessen.\n- **Förderung** — €/ha (Einkommensgrundstützung 152,44 €/ha in Deutschland 2025).\n- **Erträge** — t/ha oder dt/ha (1 dt = 100 kg).\n- **Düngung** — kg/ha.\n- **Pflanzenschutz** — l/ha.\n- **Flächenleistung von Maschinen** — ha/h (eine Feldspritze mit 24 m Arbeitsbreite bei 12 km/h schafft theoretisch knapp 29 ha/h).\n\nUmrechnungen:\n- 1 km² = 100 ha\n- 1 Acre (USA/GB) = 0,4047 ha\n- 1 Morgen (historisch, regional verschieden) = 0,25 bis 0,36 ha\n- 1 Tagwerk (Bayern, historisch) = 0,3407 ha\n- 1 Joch (Österreich, historisch) = 0,5755 ha\n\nZur Einordnung: Der durchschnittliche landwirtschaftliche Betrieb in Deutschland bewirtschaftet gut 60 Hektar, in Österreich rund 24 Hektar — beides deutlich weniger als in Tschechien, wo der Durchschnitt über 130 Hektar liegt.",
    "related": [
      "ar",
      "akr",
      "metr-ctvrecni",
      "kilometr-ctvrecni",
      "q-cent",
      "cap-2024"
    ]
  },
  {
    "slug": "q-cent",
    "term": "Dezitonne (dt)",
    "alias": [
      "dt",
      "Doppelzentner",
      "dz",
      "Zentner"
    ],
    "kategorie": "jednotky",
    "shortDef": "Die Dezitonne (dt) ist eine Masseneinheit von 100 kg. In der Landwirtschaft die übliche Einheit für Erträge und Erzeugerpreise — Weizen mit 80 dt/ha entspricht 8 t/ha.",
    "longDef": "Die Dezitonne (dt) ist eine Masseneinheit von 100 Kilogramm, also einem Zehntel einer Tonne. Sie ist in der deutschsprachigen Agrarstatistik die Standardeinheit; die ältere Bezeichnung **Doppelzentner (dz)** meint dasselbe und ist noch geläufig. Der historische **Zentner** dagegen wog nur 50 kg — bei alten Angaben lohnt der genaue Blick.\n\nVerwendung:\n- **Erträge**: Winterweizen 70 bis 90 dt/ha, Körnermais 90 bis 120 dt/ha, Winterraps 35 bis 45 dt/ha, Zuckerrübe 700 bis 800 dt/ha. Es gilt 1 dt/ha = 100 kg/ha = 0,1 t/ha.\n- **Erzeugerpreise**: Sie werden meist in €/t angegeben, im Handel und in der Beratung aber häufig in €/dt umgerechnet — 220 €/t entsprechen 22 €/dt.\n- **Futterbedarf**: Eine Milchkuh nimmt je nach Leistung 55 bis 70 dt Trockenmasse im Jahr auf.\n\nIm internationalen Handel wird ausschließlich in **metrischen Tonnen** gerechnet (1 t = 1 000 kg = 10 dt). In den USA sind dagegen **Bushel je Acre** üblich; zur Umrechnung von Weizen gilt etwa 1 bu/ac = 0,0672 t/ha.\n\nRechenbeispiel: 100 ha Weizen mit 80 dt/ha ergeben 800 t Erntemenge. Bei 220 €/t sind das 176 000 € Erlös.\n\nBei sehr ertragreichen Kulturen (Silomais, Grassilage) wird in t/ha gerechnet — Angaben wie 450 dt/ha Silomais wären unhandlich.",
    "related": [
      "tuna",
      "kilogram",
      "hektolitr",
      "busl",
      "hektar"
    ]
  },
  {
    "slug": "ar",
    "term": "Ar (a)",
    "alias": [
      "a",
      "Hundert Quadratmeter"
    ],
    "kategorie": "jednotky",
    "shortDef": "Das Ar (a) ist eine Flächeneinheit von 100 m², also ein Quadrat von 10 × 10 m. 100 Ar ergeben einen Hektar. Üblich für Gärten, Parzellen und kleine Grundstücke.",
    "longDef": "Das Ar ist eine Flächeneinheit, abgeleitet vom lateinischen *area*. 1 Ar = 100 m², also ein Quadrat mit 10 Metern Seitenlänge. Im SI ist das Ar eine zugelassene Einheit außerhalb des Systems, im Grundstückswesen weiterhin gebräuchlich.\n\nUmrechnungen:\n- **1 a = 100 m²**\n- **1 a = 0,01 ha** (100 a = 1 ha)\n- **1 a ≈ 0,0247 Acre** (1 Acre ≈ 40,47 a)\n\nVerwendet wird das Ar vor allem:\n- **Im Grundbuch und Kataster** — Gartenflächen, Baugrundstücke und kleine landwirtschaftliche Parzellen. In Österreich ist die Angabe in Ar im Grundbuch verbreiteter als in Deutschland, wo überwiegend Quadratmeter verwendet werden.\n- **Im Garten- und Sonderkulturbau** — Anbaustreifen, Obstanlagen, Weinbau kleiner Betriebe.\n\nZur Anschauung:\n- **Tennisplatz** (Einzel, 23,77 × 8,23 m) ≈ 2 a\n- **Olympiabecken** (50 × 25 m) = 12,5 a\n- **Fußballfeld** (105 × 68 m) ≈ 71 a, also 0,71 ha\n- **Durchschnittlicher Hausgarten** = 4 bis 10 a\n\nEingeführt wurde das Ar 1795 in Frankreich als Teil des metrischen Systems. Es löste im deutschsprachigen Raum die regional sehr unterschiedlichen älteren Flächenmaße ab — den **Morgen**, das bayerische **Tagwerk** und das österreichische **Joch**.",
    "related": [
      "hektar",
      "metr-ctvrecni",
      "korec",
      "strych"
    ]
  },
  {
    "slug": "akr",
    "term": "Acre",
    "alias": [
      "Akre",
      "englischer Acre"
    ],
    "kategorie": "jednotky",
    "shortDef": "Der Acre ist eine angelsächsische Flächeneinheit von 4 046,86 m², also 0,4047 Hektar. In den USA, Großbritannien, Kanada und Australien die übliche Einheit für landwirtschaftliche Flächen.",
    "longDef": "Der Acre ist ein traditionelles angelsächsisches Flächenmaß, heute exakt definiert als **4 046,8564224 m²** (internationaler Acre). In den USA und Großbritannien ist er bis heute die vorherrschende Einheit für landwirtschaftliche Flächen und Immobilien.\n\nGenaue Umrechnungen:\n- **1 Acre = 4 046,86 m²**\n- **1 Acre = 0,4047 ha** (etwa 40,5 Ar)\n- **1 Hektar = 2,4711 Acre**\n- **1 Quadratmeile = 640 Acre** (eine Section im US-Township-System)\n\nZur Herkunft: Der mittelalterliche Acre war die Fläche, die ein Mann mit einem Ochsengespann an einem Tag pflügen konnte — daraus die Form von einem Furlong Länge mal einer Chain Breite (220 × 22 Yards = 4 840 Quadratyards).\n\nIn der Praxis:\n- **USA**: Der durchschnittliche Betrieb bewirtschaftet etwa 440 Acre, also rund 180 ha. Große Industriebetriebe kommen auf über 10 000 Acre.\n- **Großbritannien**: Ein typischer englischer Betrieb umfasst rund 88 ha, also etwa 217 Acre.\n- **Bodenmarkt**: US-Ackerland wird in USD je Acre gehandelt, im Mittleren Westen typischerweise zwischen 4 000 und 10 000 USD.\n- **Erträge**: Das USDA veröffentlicht in Bushel je Acre — Weizen etwa 50 bu/ac, Mais etwa 175 bu/ac.\n\nFür mitteleuropäische Betriebe ist der Acre vor allem beim Auswerten internationaler Marktdaten relevant. Zur Umrechnung von Maiserträgen gilt etwa: Bushel je Acre mal 0,0628 ergibt Tonnen je Hektar; bei Weizen ist der Faktor 0,0672.\n\nAchtung: Es gab regionale Varianten — der schottische Acre maß 5 080 m², der irische 6 555 m². Beide sind heute außer Gebrauch, tauchen aber in alten Urkunden auf.",
    "related": [
      "hektar",
      "morgen",
      "busl",
      "metr-ctvrecni"
    ]
  },
  {
    "slug": "metr-ctvrecni",
    "term": "Quadratmeter (m²)",
    "alias": [
      "m²",
      "qm",
      "Quadratmeter"
    ],
    "kategorie": "jednotky",
    "shortDef": "Der Quadratmeter (m²) ist die SI-Einheit der Fläche — ein Quadrat von 1 × 1 m. 10 000 m² ergeben einen Hektar. Universell für Bauflächen, Parzellen und Gebäude.",
    "longDef": "Der Quadratmeter (m², umgangssprachlich auch qm) ist die abgeleitete SI-Einheit des Flächeninhalts: die Fläche eines Quadrats mit einem Meter Seitenlänge.\n\nUmrechnungen:\n- **1 m² = 0,01 a** (100 m² = 1 Ar)\n- **1 m² = 0,0001 ha** (10 000 m² = 1 Hektar)\n- **1 m² = 0,000001 km²**\n- **1 m² ≈ 10,764 sq ft** (Quadratfuß)\n- **1 m² ≈ 1,196 sq yd** (Quadratyard)\n\nVerwendung in Landwirtschaft und Grundstückswesen:\n- **Baugrundstücke** — das Kataster führt Grundstücke in Quadratmetern.\n- **Grundsteuer** — die Bemessung erfolgt flächenbezogen je Quadratmeter und Nutzungsart.\n- **Gewächshäuser und Folientunnel** — die Kapazität wird in m² Anbaufläche angegeben.\n- **Tierhaltung** — die Mindestflächen je Tier nach den Haltungsvorgaben sind m²-Werte je Tierplatz.\n- **Lagerhallen** — Fahrsilos, Heulager und Maschinenhallen in m².\n\nZur Anschauung:\n- **Stellplatz für einen Pkw**: 12,5 m² (2,5 × 5 m)\n- **Kleine Wohnung**: 25 bis 35 m²\n- **Tennisplatz** (Einzel): 261 m²\n- **Fußballfeld**: 7 140 m², also rund 0,71 ha\n\nFür die Umrechnung größerer Flächen in Hektar genügt die Division durch 10 000: 5 000 m² sind 0,5 ha, 25 000 m² sind 2,5 ha.\n\nSiehe auch [[ar]] (100 m²), [[hektar]] (10 000 m²), [[kilometr-ctvrecni]] (1 000 000 m²).",
    "related": [
      "ar",
      "hektar",
      "kilometr-ctvrecni"
    ]
  },
  {
    "slug": "kilometr-ctvrecni",
    "term": "Quadratkilometer (km²)",
    "alias": [
      "km²",
      "qkm"
    ],
    "kategorie": "jednotky",
    "shortDef": "Der Quadratkilometer (km²) ist eine Flächeneinheit von 1 × 1 km, also 100 Hektar oder 1 000 000 m². Üblich für Wälder, Gemarkungen, Landkreise und Einzugsgebiete.",
    "longDef": "Der Quadratkilometer (km²) ist die abgeleitete SI-Einheit für große Flächen: das Quadrat mit einem Kilometer Seitenlänge, also 1 000 × 1 000 Meter.\n\nUmrechnungen:\n- **1 km² = 1 000 000 m²**\n- **1 km² = 100 ha**\n- **1 km² = 10 000 a**\n- **1 km² ≈ 247,1 Acre**\n- **1 Quadratmeile ≈ 2,59 km²**\n\nVerwendung:\n- **Forstwirtschaft** — Forstbetriebsflächen, Einzugsgebiete, Schutzgebiete (Naturpark, Nationalpark).\n- **Gemarkungen** — eine durchschnittliche Gemarkung umfasst wenige Quadratkilometer.\n- **Extensives Grünland** — Almflächen und Bergweiden werden in km² erfasst.\n- **Amtliche Statistik** — Destatis und Statistik Austria weisen Bodennutzung in km² und Hektar aus.\n- **Klima- und Wetterdaten** — Niederschlag und Temperatur werden auf ein km²-Raster interpoliert.\n\nZur Einordnung:\n- **Deutschland** hat 357 596 km², davon rund 165 000 km² landwirtschaftliche Fläche (etwa 46 %).\n- **Österreich** hat 83 879 km², davon rund 26 000 km² landwirtschaftliche Fläche — der Rest ist überwiegend Wald und Hochgebirge.\n- **Nationalpark Bayerischer Wald**: 243 km²\n- **Nationalpark Hohe Tauern** (Österreich): 1 856 km², das größte Schutzgebiet der Alpen.\n\nSiehe auch [[hektar]] (0,01 km²), [[metr-ctvrecni]], [[ar]].",
    "related": [
      "hektar",
      "metr-ctvrecni",
      "ar"
    ]
  },
  {
    "slug": "hektolitr",
    "term": "Hektoliter (hl)",
    "alias": [
      "hl",
      "Hektolitergewicht",
      "HLG"
    ],
    "kategorie": "jednotky",
    "shortDef": "Der Hektoliter (hl) ist eine Volumeneinheit von 100 Litern. In der Landwirtschaft entscheidend für das Hektolitergewicht des Getreides (kg/hl) — ein Qualitätsmerkmal für die Vermarktung.",
    "longDef": "Der Hektoliter (hl) ist eine Volumeneinheit von **100 Litern**, also 0,1 m³. Er ist eine zugelassene Einheit außerhalb des SI und in Landwirtschaft, Brauwesen und Getränkehandel weit verbreitet.\n\nUmrechnungen:\n- **1 hl = 100 l = 0,1 m³**\n- **1 hl ≈ 22 imperiale Gallonen, 26,4 US-Gallonen**\n- **1 hl ≈ 2,84 US-Bushel** (je nach Ware)\n\nIn der Landwirtschaft zählt vor allem das **Hektolitergewicht (HLG)** — die Masse in Kilogramm, die 100 Liter Getreide wiegen. Es ist ein zentrales **Qualitätsmerkmal** bei der Vermarktung:\n\n| Kultur | Übliches HLG | Futterware | Qualitätsware |\n|---|---|---|---|\n| **Winterweizen** | 76–82 kg/hl | unter 75 | ab 77 (A- und E-Weizen) |\n| **Braugerste** | 64–68 kg/hl | unter 62 | mindestens 64 |\n| **Futtergerste** | 62–66 kg/hl | üblich | — |\n| **Roggen** | 70–76 kg/hl | unter 68 | ab 72 |\n| **Hafer** | 48–52 kg/hl | unter 45 | ab 50 |\n| **Winterraps** | 64–68 kg/hl | — | mindestens 62 |\n| **Triticale** | 70–76 kg/hl | üblich | — |\n\n**Warum das HLG zählt:** Ein höheres Hektolitergewicht bedeutet mehr Stärke beziehungsweise Öl, weniger Spelzen und Bruch und eine bessere Mahlqualität. Mühlen und Mälzereien staffeln den Preis nach dem HLG zusammen mit Feuchte, Protein und Fallzahl.\n\nWirtschaftliche Wirkung: Fällt Weizen mit 74 kg/hl aus der A-Qualität in die Futterware, kostet das je nach Marktlage 20 bis 40 €/t. Bei 50 ha und 8 t/ha sind das 8 000 bis 16 000 € Unterschied — bei identischer Erntemenge.\n\nGemessen wird das HLG mit einer Schüttdichtewaage nach ISO 7971, im Mähdrescher näherungsweise über Sensoren des Ertragsmonitors.\n\nSiehe auch [[busl]] (das US-Gegenstück), [[q-cent]], [[tuna]], [[kilogram]].",
    "related": [
      "busl",
      "q-cent",
      "tuna",
      "kilogram",
      "yield-monitor"
    ]
  },
  {
    "slug": "busl",
    "term": "Bushel (bu)",
    "alias": [
      "bushel",
      "bu",
      "US-Bushel"
    ],
    "kategorie": "jednotky",
    "shortDef": "Der Bushel (bu) ist eine angelsächsische Volumen- und Masseneinheit für Getreide. Ein US-Bushel Weizen wiegt 27,2155 kg, Mais 25,4 kg. Die Preiseinheit an der Börse in Chicago.",
    "longDef": "Der Bushel (bu) ist eine traditionelle angelsächsische Einheit, die in der Landwirtschaft in zwei Formen vorkommt:\n\n1. **Volumen-Bushel** = 35,2391 Liter (USA, dry bushel), 36,3687 Liter (Großbritannien, imperial)\n2. **Massen-Bushel** — je Ware fest definiert (USDA-Standard)\n\n| Ware | kg je Bushel | lb je Bushel |\n|---|---|---|\n| **Weizen** | 27,2155 | 60 |\n| **Sojabohne** | 27,2155 | 60 |\n| **Mais** | 25,4012 | 56 |\n| **Gerste** | 21,7724 | 48 |\n| **Hafer** | 14,5150 | 32 |\n| **Roggen** | 25,4012 | 56 |\n| **Raps (Canola)** | 22,6796 | 50 |\n\n**Warum der Bushel auch hier zählt:**\n- **CBOT (Chicago Board of Trade)** — die Weltmarktpreise für Weizen, Mais und Sojabohnen werden in US-Cent je Bushel notiert. Die Bewegungen dort schlagen mit ein bis zwei Tagen Verzögerung auf die europäischen Notierungen an der MATIF durch.\n- **USDA-WASDE-Berichte** — die monatlichen globalen Schätzungen zu Ernte und Beständen erscheinen in Millionen Bushel.\n- **Welthandel** — amerikanische Sojabohnen und Mais werden je Bushel gehandelt.\n\nUmrechnung **Bushel je Acre in Tonnen je Hektar** (zum Vergleich amerikanischer und europäischer Erträge):\n- **Weizen**: bu/ac × 0,06725 = t/ha (50 bu/ac entsprechen etwa 3,36 t/ha)\n- **Mais**: bu/ac × 0,06277 = t/ha (175 bu/ac entsprechen etwa 10,98 t/ha)\n- **Sojabohne**: bu/ac × 0,06725 = t/ha\n\nBeispiel für die Umrechnung einer CBOT-Notierung:\n- Weizen 600 Cent je Bushel entsprechen 6,00 USD je Bushel\n- 6,00 USD ÷ 27,2155 kg × 1 000 = **220,4 USD je Tonne**\n- bei einem Kurs von 0,92 €/USD sind das rund **203 €/t** — vor Fracht und Handelsspanne\n\nAchtung: Der britische imperial bushel ist etwa 3 % größer als der amerikanische. Im Agrarhandel dominiert der US-Standard.\n\nSiehe auch [[hektolitr]] (das europäische Qualitätsmaß), [[q-cent]], [[tuna]], [[akr]].",
    "related": [
      "hektolitr",
      "q-cent",
      "tuna",
      "libra",
      "akr"
    ]
  },
  {
    "slug": "jitro",
    "term": "Joch",
    "alias": [
      "Jitro",
      "niederösterreichisches Joch",
      "Jugerum"
    ],
    "kategorie": "jednotky",
    "shortDef": "Das Joch ist ein historisches mitteleuropäisches Flächenmaß von rund 0,5755 ha (1 600 Quadratklafter). Die Fläche, die ein Ochsengespann an einem Tag pflügt. In Österreich bis 1875 das amtliche Flächenmaß.",
    "longDef": "Das Joch (lateinisch *jugerum*, tschechisch *jitro*) ist ein traditionelles mitteleuropäisches Flächenmaß, dessen Größe regional stark schwankte. In der Habsburgermonarchie galt ab 1764 das vereinheitlichte **niederösterreichische Joch = 1 600 Quadratklafter = 5 754,642 m², also rund 0,5755 ha**.\n\nDie wichtigsten Varianten:\n- **Niederösterreichisches (österreichisches) Joch**: 5 754,64 m² = **0,5755 ha** — der Standard in der gesamten Monarchie, also auch in Böhmen, Mähren und Ungarn.\n- **Preußischer Morgen**: 2 553 m², rund 0,255 ha — deutlich kleiner, siehe [[morgen]].\n- **Bayerisches Tagwerk**: 3 407 m², rund 0,3407 ha.\n\nZur Etymologie: Das Joch bezeichnet die Fläche, die ein Gespann (ein Joch Ochsen) an einem Tag pflügen konnte. Mit einem hölzernen Hakenpflug waren das etwa ein halber Hektar.\n\n**Warum das Joch bis heute begegnet:**\n- **Grundbuch und Kataster** — Eintragungen des 19. und frühen 20. Jahrhunderts nennen Joch und Quadratklafter. Bei Erbfällen und Grundstücksübertragungen tauchen sie weiterhin auf.\n- **Familiengedächtnis** — bäuerliche Familien in Österreich erinnern Flächen ihrer Vorfahren in Joch.\n- **Historische Karten** — der Franziszeische Kataster (1817–1861) verzeichnet die Flächen in Joch und Quadratklafter; er ist die Grundlage vieler heutiger Grenzverläufe.\n\nUmrechnungen:\n- **1 Joch = 0,5755 ha = 57,55 a = 5 754,64 m²**\n- **1 Joch ≈ 1,422 Acre**\n- **1 ha = 1,738 Joch**\n\nMit der Einführung des metrischen Systems in Österreich-Ungarn (verbindlich ab 1876) wurde das Joch durch Hektar und Ar abgelöst. In alten Grundbuchsauszügen bleibt es rechtlich relevant.\n\nSiehe auch [[hektar]], [[ar]], [[korec]], [[strych]], [[lan]], [[morgen]].",
    "related": [
      "hektar",
      "korec",
      "strych",
      "lan",
      "morgen"
    ]
  },
  {
    "slug": "lan",
    "term": "Hufe",
    "alias": [
      "Lán",
      "Hube",
      "Mansus",
      "Königshufe"
    ],
    "kategorie": "jednotky",
    "shortDef": "Die Hufe ist ein mittelalterliches Flächenmaß von etwa 16 bis 24 ha — die Fläche eines Bauernhofs, der eine Familie ernährte. Zugleich eine soziale und steuerliche Einheit des Dorfes.",
    "longDef": "Die Hufe (lateinisch *mansus*, tschechisch *lán*) ist ein mittelalterliches Flächenmaß und zugleich die grundlegende wirtschaftliche und soziale Einheit des Dorfes. Ihre Größe schwankte erheblich nach Region, Zeit und Art, lag aber typischerweise bei **16 bis 24 Hektar** — der Fläche, die eine Bauernfamilie ernährte.\n\nDie wichtigsten Formen:\n- **Bauernhufe** — 16 bis 20 ha, der Hof eines abgabepflichtigen Bauern.\n- **Königshufe** — etwas größer, 19 bis 24 ha, in königlichen Gründungsdörfern.\n- **Waldhufe** — ein langgestreckter Streifen vom Bach bis zum Waldrand, typisch für die Waldhufendörfer in Mittelgebirgen und im böhmischen Grenzraum.\n- **Halbe Hufe** — 8 bis 10 ha, kleinere Stellen.\n- **Viertelhufe** — 4 bis 5 ha, Kleinbauern und Kätner.\n\nDie Hufe war die Bemessungsgrundlage für Abgaben und Frondienste: Für eine ganze Hufe waren typischerweise drei Frontage in der Woche zu leisten. Der **Hufner** (Vollbauer) stand an der Spitze der dörflichen Sozialordnung, darunter Halbhufner, Kätner und schließlich die Häusler ohne Land.\n\nEine Hufe bestand nicht aus einem einzigen Stück, sondern aus vielen Streifen, die über die Dorfflur verteilt lagen — die **Dreifelderwirtschaft** (Winterung, Sommerung, Brache) verlangte Anteile in jedem der drei Felder. Diese Gemengelage wurde erst durch die Flurbereinigung des 19. und 20. Jahrhunderts aufgelöst.\n\nHeute begegnet die Hufe vor allem:\n- **In der Familienforschung** — Kirchenbücher und Grundbücher führen Vorfahren als Hufner, Halbhufner oder Häusler.\n- **In der Ortsgeschichte** — die mittelalterliche Dorfstruktur lässt sich aus den Hufen rekonstruieren.\n- **In Flurnamen** — Bezeichnungen wie „Hufenweg\" oder „Auf den Hufen\" halten sich bis heute.\n\nSiehe auch [[jitro]], [[korec]], [[strych]], [[hektar]].",
    "related": [
      "jitro",
      "korec",
      "strych",
      "hektar"
    ]
  },
  {
    "slug": "korec",
    "term": "Scheffel",
    "alias": [
      "Korec",
      "Scheffel Aussaat",
      "Metze"
    ],
    "kategorie": "jednotky",
    "shortDef": "Der Scheffel ist ein historisches Flächenmaß von rund 0,29 ha — die Fläche, auf der ein Scheffel Saatgut ausgesät wurde. Ein Maß, das von der Saatmenge auf die Fläche schloss.",
    "longDef": "Der Scheffel (tschechisch *korec*) ist ein historisches Maß, das ursprünglich ein **Hohlmaß für Getreide** war (regional 50 bis 220 Liter) und daraus abgeleitet ein Flächenmaß wurde: die Fläche, auf der ein Scheffel Saatgut ausgesät wurde.\n\nIn den böhmischen Ländern galt der **Prager Scheffel** mit 2 877,32 m², also rund **0,288 ha**. Im deutschen Sprachraum schwankten die Werte erheblich — der preußische Scheffel als Flächenmaß (Scheffelsaat) lag bei etwa 0,25 ha, der bayerische bei anderen Werten.\n\nDas Prinzip, die Fläche über die Saatmenge zu bemessen, war praktisch: Ein Bauer wusste, wie viel Saatgut sein Feld brauchte, lange bevor jemand es vermessen hatte. Der Nachteil liegt auf der Hand — je nach Bodengüte und Saatstärke meinte derselbe Scheffel unterschiedlich viel Fläche. Genau deshalb wurde das Maß in der Habsburgermonarchie 1764 auf einen festen Wert normiert.\n\nVerhältnis zu den anderen historischen Maßen:\n- **1 Joch = 2 Scheffel** (in der böhmischen Normierung)\n- **1 Hufe = 60 bis 64 Scheffel**, also etwa 17 bis 18 ha\n- **3,5 Scheffel ≈ 1 Hektar**\n\nUmrechnungen:\n- **1 Prager Scheffel = 0,2877 ha = 28,77 a = 2 877 m²**\n- **1 Prager Scheffel ≈ 0,711 Acre**\n\nMit der metrischen Reform verschwand der Scheffel als Flächenmaß. In Grundbüchern vor 1869, in Urbaren und in der Familienforschung ist er weiterhin anzutreffen — und in Flurnamen wie „Scheffelacker\".\n\nSiehe auch [[strych]] (weitgehend gleichbedeutend), [[jitro]], [[lan]], [[hektar]], [[ar]].",
    "related": [
      "strych",
      "jitro",
      "lan",
      "hektar",
      "ar"
    ]
  },
  {
    "slug": "strych",
    "term": "Strich (Strych)",
    "alias": [
      "Strych",
      "Strich",
      "Scheffelmaß"
    ],
    "kategorie": "jednotky",
    "shortDef": "Der Strich ist ein historisches mitteleuropäisches Flächenmaß von rund 0,29 ha, weitgehend gleichbedeutend mit dem Scheffel. Der Name kommt vom abgestrichenen Hohlmaß für Saatgut.",
    "longDef": "Der Strich (tschechisch *strych*) ist ein historisches Flächenmaß der böhmischen Länder und Mitteleuropas. Der Name geht auf das deutsche Wort *Strich* zurück — das Hohlmaß wurde beim Abmessen von Getreide mit einem Streichholz glatt **abgestrichen**, damit es weder gehäuft noch zu knapp gefüllt war.\n\nIn der böhmischen Normierung ab 1764 war der Strich mit **2 877 m², also rund 0,288 ha**, praktisch gleichbedeutend mit dem [[korec|Scheffel]]. Beide bezeichneten die Fläche, auf der die entsprechende Saatmenge ausgebracht wurde.\n\nRegionale Varianten:\n- **Böhmischer/Prager Strich**: 2 877 m², rund 0,288 ha\n- **Mährischer Strich**: 1 920 bis 2 880 m² — deutlich schwankend\n- **Schlesischer Strich**: nach den theresianischen Patenten dem böhmischen angeglichen\n\nIn Teilen Südostmährens und der heutigen Slowakei war der Strich kleiner als der böhmische Scheffel (rund 0,2 ha) — bei Archivquellen ist die örtliche Definition deshalb immer zu prüfen.\n\nVerhältnis zu anderen Maßen:\n- **1 Strich = 1 Scheffel** (böhmische Normierung)\n- **2 Strich = 1 Joch** (rund 0,575 ha)\n- **64 Strich = 1 Hufe** (rund 18 ha)\n- **3,48 Strich = 1 Hektar**\n\nHistorisch verwendet wurde der Strich im **Theresianischen Kataster** (1748) für Äcker, Wiesen und Weiden sowie in den Urbaren des 17. und 18. Jahrhunderts als Grundlage der Abgaben.\n\nMit der metrischen Reform verlor der Strich seine Gültigkeit. Für das Lesen alter Urkunden, Grundbucheinträge und Flurnamen bleibt er relevant.\n\nSiehe auch [[korec]], [[jitro]], [[lan]], [[hektar]].",
    "related": [
      "korec",
      "jitro",
      "lan",
      "hektar"
    ]
  },
  {
    "slug": "tuna",
    "term": "Tonne (t)",
    "alias": [
      "t",
      "metrische Tonne",
      "Megagramm"
    ],
    "kategorie": "jednotky",
    "shortDef": "Die Tonne (t) ist eine Masseneinheit von 1 000 kg, also 10 Dezitonnen. In der Landwirtschaft die Standardeinheit für Erträge (t/ha), Erzeugerpreise (€/t) und Maschinenkapazitäten.",
    "longDef": "Die metrische Tonne (Zeichen **t**, im SI auch Megagramm, Mg) ist eine Masseneinheit von 1 000 Kilogramm. Sie ist eine zugelassene Einheit außerhalb des SI und in Landwirtschaft, Handel und Industrie die praktische Bezugsgröße.\n\nUmrechnungen:\n- **1 t = 1 000 kg = 10 dt**\n- **1 t ≈ 2 204,62 lb**\n- **1 t ≈ 1,1023 US short tons** (1 short ton = 907,18 kg)\n- **1 t ≈ 0,9842 long tons** (1 long ton = 1 016 kg)\n- **1 t Weizen ≈ 36,7 Bushel**\n- **1 t Mais ≈ 39,4 Bushel**\n\nVerwendung:\n- **Erträge** — t/ha ist die gebräuchlichste Angabe. Winterweizen 7 bis 9 t/ha, Körnermais 9 bis 12 t/ha, Winterraps 3,5 bis 4,5 t/ha, Zuckerrübe 70 bis 80 t/ha.\n- **Erzeugerpreise** — €/t. Zur Einordnung bewegte sich Brotweizen zuletzt im Bereich von 190 bis 240 €/t.\n- **Wirtschaftsdünger** — Gülle wird in m³/ha, Festmist in t/ha ausgebracht (typisch 15 bis 30 t/ha).\n- **Maschinenkapazität** — ein Muldenkipper fasst 14 bis 24 t, ein Korntank im Mähdrescher 8 bis 14 m³, also etwa 6 bis 11 t Getreide.\n- **Welthandel** — die Notierungen an MATIF und im FOB-Handel laufen in €/t und USD/t.\n\nRechenbeispiele:\n- 50 ha Weizen mit 8 t/ha ergeben 400 t — etwa acht Bahnwaggons zu 50 t.\n- 100 ha Mais mit 11 t/ha ergeben 1 100 t — rund 45 Muldenkipperfuhren zu 25 t.\n\n**Vorsicht bei angelsächsischen Quellen:** Die amerikanische *short ton* wiegt nur 907 kg, die britische *long ton* 1 016 kg. In USDA-Berichten ist stets zu prüfen, welche Tonne gemeint ist — an CBOT und MATIF sowie im EU-Handel gilt ausschließlich die metrische Tonne.\n\nSiehe auch [[q-cent]] (0,1 t), [[kilogram]], [[busl]].",
    "related": [
      "q-cent",
      "kilogram",
      "busl",
      "hektolitr"
    ]
  },
  {
    "slug": "kilogram",
    "term": "Kilogramm (kg)",
    "alias": [
      "kg",
      "Kilo"
    ],
    "kategorie": "jednotky",
    "shortDef": "Das Kilogramm (kg) ist die SI-Basiseinheit der Masse. In der Landwirtschaft maßgeblich für Düngermengen (kg/ha), Tiergewichte, Futterpreise und Gebindegrößen.",
    "longDef": "Das Kilogramm (kg) ist die **SI-Basiseinheit der Masse**. Seit 2019 ist es über die Planck-Konstante definiert (h = 6,62607015 × 10⁻³⁴ J·s); zuvor galt der in Sèvres bei Paris verwahrte Urkilogramm-Prototyp.\n\nUmrechnungen:\n- **1 kg = 1 000 g**\n- **1 kg = 0,001 t = 0,01 dt**\n- **1 kg ≈ 2,2046 lb**\n- **1 kg ≈ 35,274 oz**\n\nVerwendung in der Landwirtschaft:\n- **Düngung** — kg/ha Reinnährstoff. Beispiel: Winterweizen 160 bis 200 kg N/ha, Mais 150 bis 200 kg N/ha. ‼️ Kilogramm Nährstoff ist nicht gleich Kilogramm Dünger: KAS enthält 27 % N, für 180 kg N/ha braucht es also rund 665 kg KAS/ha. Die Düngeverordnung begrenzt die Menge über die Düngebedarfsermittlung.\n- **Pflanzenschutz** — kg/ha bei granulierten Mitteln und Beizen; Wirkstoffmengen werden in g/ha angegeben.\n- **Tiergewichte** — Kälber 35 bis 45 kg bei der Geburt, Milchkühe 600 bis 750 kg, Zuchtbullen über 1 000 kg.\n- **Futterpreise** — €/kg bei Mineralfutter und Kraftfutterergänzungen, €/t bei Mischfutter.\n- **Saatgut** — Winterweizen 160 bis 220 kg/ha, Mais dagegen nur 20 bis 28 kg/ha, weil das Korn ungleich größer ist.\n- **Gebinde** — Düngersäcke zu 25 oder 50 kg, Big Bags zu 500 bis 1 200 kg, Silageballen 600 bis 900 kg.\n\n**Lebendmasse und Schlachtgewicht:**\n- **Lebendmasse** — das Gewicht des Tieres auf der Waage.\n- **Schlachtgewicht** — das Gewicht des Schlachtkörpers.\n- Die Ausschlachtung liegt beim Rind bei 55 bis 60 %, beim Schwein bei 75 bis 80 %, beim Geflügel bei rund 70 %.\n\nZur Anschauung: Ein Sack Zement wiegt 25 kg, ein Big Bag Dünger 600 kg, ein Kalb 40 kg, eine Milchkuh 650 kg, ein Großtraktor der Klasse Fendt 1050 rund 13 000 kg und ein voll beladenes Güllefass bis 30 000 kg.\n\nSiehe auch [[tuna]] (1 000 kg), [[q-cent]] (100 kg).",
    "related": [
      "tuna",
      "q-cent",
      "libra",
      "hektolitr"
    ]
  },
  {
    "slug": "libra",
    "term": "Pfund (pound, lb)",
    "alias": [
      "pound",
      "lb",
      "englisches Pfund"
    ],
    "kategorie": "jednotky",
    "shortDef": "Das angelsächsische Pfund (lb) ist eine Masseneinheit von 0,4536 kg. Üblich in den USA, Großbritannien, Kanada und Australien — man begegnet ihm in USDA-Berichten und CBOT-Notierungen.",
    "longDef": "Das Pfund (englisch *pound*, Kurzzeichen *lb* vom lateinischen *libra*) ist eine traditionelle angelsächsische Masseneinheit. Das seit 1959 international definierte Pfund wiegt genau **0,45359237 kg**.\n\n‼️ Nicht zu verwechseln mit dem deutschen **Pfund**, das umgangssprachlich 500 g meint — im Handel zwischen beiden Größen sorgt das regelmäßig für Missverständnisse.\n\nUmrechnungen:\n- **1 lb = 0,4536 kg**\n- **1 lb = 16 oz**\n- **1 kg ≈ 2,2046 lb**\n- **1 short ton (USA)** = 2 000 lb = 907,18 kg\n- **1 long ton (GB)** = 2 240 lb = 1 016 kg\n- **1 Bushel Weizen** = 60 lb = 27,2155 kg\n\nWo das Pfund in der Landwirtschaft begegnet:\n- **USDA-Berichte** — WASDE und ERS notieren einige Waren in Cent je Pfund (Baumwolle, Butter, Käse).\n- **CBOT-Terminkontrakte** — Sojaöl wird in Cent je Pfund notiert, ebenso Lebendrind (live cattle).\n- **Futtermittel und Ergänzer** — amerikanische Quellen geben Rationen in lb je Tier und Tag an.\n- **Zuchtdaten** — US-Herdbücher führen Gewichte in Pfund.\n\nUmrechnung von Börsennotierungen:\n- Sojaöl 50 Cent/lb entsprechen 0,50 USD/lb × 2,2046 = **1,10 USD/kg**, also 1 100 USD/t.\n- Lebendrind 200 Cent/lb entsprechen **4,41 USD/kg** Lebendmasse.\n\nEine praktische Faustregel: **lb halbieren** ergibt einen groben Kilogrammwert. 2 000 lb sind demnach etwa 1 000 kg — tatsächlich 907 kg, für eine Überschlagsrechnung reicht es.\n\nSiehe auch [[kilogram]], [[tuna]], [[busl]] (60 lb bei Weizen).",
    "related": [
      "kilogram",
      "tuna",
      "busl"
    ]
  },
  {
    "slug": "morgen",
    "term": "Morgen",
    "alias": [
      "preußischer Morgen",
      "Tagwerk",
      "Juchart"
    ],
    "kategorie": "jednotky",
    "shortDef": "Der Morgen ist ein historisches deutsches Flächenmaß — die Fläche, die ein Gespann an einem Vormittag pflügt. Der preußische Morgen maß 0,2553 ha, das bayerische Tagwerk 0,3407 ha.",
    "longDef": "Der Morgen ist das klassische deutsche Flächenmaß: die Fläche, die ein Gespann an einem Vormittag — einem Morgen — pflügen konnte. Weil Böden, Pflüge und Gespanne verschieden waren, unterschied sich das Maß von Land zu Land erheblich. Vor der Reichseinigung 1871 hatte praktisch jedes deutsche Territorium seinen eigenen Morgen.\n\nDie wichtigsten Varianten:\n- **Preußischer (Magdeburger) Morgen**: 2 553,2 m², rund **0,2553 ha** — der verbreitetste.\n- **Bayerisches Tagwerk**: 3 407,3 m², rund **0,3407 ha**.\n- **Sächsischer Morgen**: 2 767 m², rund 0,277 ha.\n- **Hessischer Morgen**: 2 500 m², im 19. Jahrhundert auf glatte 0,25 ha gerundet.\n- **Württembergischer Morgen**: 3 152 m², rund 0,315 ha.\n- **Badische Juchart**: 3 600 m², rund 0,36 ha.\n- **Österreichisches Joch**: 5 754,6 m², rund 0,5755 ha — mehr als doppelt so groß wie der preußische Morgen, siehe [[jitro]].\n\nMit der metrischen Reform im Deutschen Reich (1872) wurde der Morgen als amtliches Maß abgeschafft. In der Umgangssprache hält er sich bis heute — **besonders im Norden und Osten Deutschlands** rechnen ältere Landwirte Flächen selbstverständlich in Morgen, und in Grundbüchern des 19. Jahrhunderts ist er die Regel.\n\nUmrechnungen für den preußischen Morgen:\n- **1 Morgen = 0,2553 ha = 25,53 a = 2 553 m²**\n- **1 Morgen ≈ 0,631 Acre**\n- **4 Morgen ≈ 1 ha**\n- **1 ha = 3,92 Morgen**\n\n‼️ Beim Lesen alter Karten und Urkunden ist stets zuerst zu klären, aus welchem Territorium sie stammen — der Unterschied zwischen preußischem Morgen und österreichischem Joch beträgt mehr als das Doppelte.\n\nSiehe auch [[jitro]] (österreichisches Joch), [[akr]], [[hektar]], [[korec]].",
    "related": [
      "jitro",
      "akr",
      "hektar",
      "korec"
    ]
  },
  {
    "slug": "turbodmychadlo",
    "term": "Turbolader",
    "alias": [
      "Turbo",
      "Abgasturbolader",
      "ATL"
    ],
    "kategorie": "pohon",
    "shortDef": "Der Turbolader nutzt die Energie der Abgase, um eine Turbine anzutreiben, die Luft in den Zylinder verdichtet — mehr Leistung aus demselben Hubraum.",
    "longDef": "Der Turbolader besteht aus zwei auf einer Welle sitzenden Laufrädern: einer Turbine auf der Abgasseite und einem Verdichter auf der Ansaugseite. Die Abgase treiben die Turbine an — mit Drehzahlen bis über 200 000 min⁻¹ —, die gemeinsame Welle treibt den Verdichter, der die Ansaugluft vor dem Zylinder verdichtet.\n\nWas das für den Motor bedeutet:\n- **30 bis 50 % mehr Leistung** aus demselben Hubraum gegenüber einem Saugmotor.\n- **Höheres Drehmoment im unteren Drehzahlbereich** — entscheidend für Zugarbeit.\n- **Bessere Leistung in Höhenlagen** — die Aufladung gleicht die dünnere Luft aus.\n\nModerne Traktormotoren nutzen:\n- **VTG** (variable Turbinengeometrie) — verstellbare Leitschaufeln liefern über einen breiten Drehzahlbereich den passenden Ladedruck.\n- **Zweistufige Aufladung** bei Spitzenmotoren (Fendt 1000, John Deere 9R) — ein kleiner Lader für niedrige, ein großer für hohe Drehzahlen.\n- **Ladeluftkühler** hinter dem Verdichter — er kühlt die verdichtete, heiße Luft, was die Füllung dichter und die Leistung höher macht.\n\nZur Wartung: Der Turbolader wird über den Motorölkreislauf geschmiert, regelmäßige Ölwechsel sind deshalb entscheidend. Nach Volllast sollte der Motor 30 bis 60 Sekunden nachlaufen, bevor er abgestellt wird — sonst steht das Öl in den heißen Lagern und verkokt. Bei guter Wartung hält ein Turbolader über 10 000 Betriebsstunden.",
    "related": [
      "common-rail",
      "dpf"
    ]
  },
  {
    "slug": "egr",
    "term": "Abgasrückführung (AGR)",
    "alias": [
      "EGR",
      "Exhaust Gas Recirculation",
      "AGR"
    ],
    "kategorie": "pohon",
    "shortDef": "Die Abgasrückführung (AGR, englisch EGR) führt einen Teil der Abgase zurück in den Ansaugtrakt — das senkt die Verbrennungstemperatur und damit die Bildung von Stickoxiden.",
    "longDef": "Die Abgasrückführung (AGR) leitet 5 bis 30 % der Abgase zurück in den Ansaugtrakt. Der Grund: Die rückgeführten Abgase senken die Verbrennungstemperatur, und weniger Hitze bedeutet weniger Stickoxide (NOx).\n\nEinsatz bei Traktoren:\n- **Stage IIIA bis IIIB** (2006 bis 2014): der Hauptweg zur NOx-Minderung, kombiniert mit DPF.\n- **Ab Stage IV** (2014): AGR wird durch SCR (AdBlue) ergänzt oder weitgehend ersetzt, weil SCR wirksamer ist.\n\nNachteile der AGR:\n- **Ruß im Ansaugtrakt** — die rückgeführten Abgase enthalten Partikel, die sich im AGR-Ventil und im Saugrohr ablagern. Nach 5 000 bis 8 000 Betriebsstunden ist meist eine Reinigung fällig (einige hundert Euro).\n- **Leistungsverlust von 3 bis 5 %** — die rückgeführten Abgase senken den Sauerstoffanteil.\n- **2 bis 4 % höherer Verbrauch** gegenüber einem Motor ohne AGR.\n\nGenau deshalb setzten die Hersteller bei Stage V vorrangig auf SCR: Der Anschaffungspreis liegt höher, die Betriebskosten dagegen niedriger — weniger Kraftstoff und weniger Reparaturen.",
    "related": [
      "scr-katalyzator",
      "dpf",
      "emisni-normy-stage"
    ]
  },
  {
    "slug": "biopal",
    "term": "Biodiesel",
    "alias": [
      "FAME",
      "B7",
      "B100",
      "Biokraftstoff"
    ],
    "kategorie": "pohon",
    "shortDef": "Biodiesel ist ein Kraftstoff aus Pflanzenölen (Rapsmethylester, FAME). In Deutschland und Österreich enthält gewöhnlicher Dieselkraftstoff bis zu 7 % FAME (B7).",
    "longDef": "Biodiesel ist ein erneuerbarer Kraftstoff, gewonnen durch Umesterung von Pflanzenölen — in Mitteleuropa überwiegend Raps, in den USA Soja, in Asien Palmöl — oder von tierischen Fetten mit Methanol. Das Ergebnis heißt FAME (Fatty Acid Methyl Ester); aus Raps spricht man von **RME**, Rapsmethylester.\n\nIn Europa:\n- **B7** — bis zu 7 % FAME im gewöhnlichen Dieselkraftstoff nach EN 590. Das ist der Standard an jeder Tankstelle und mit allen modernen Motoren verträglich.\n- **B10** — bis zu 10 %, in Deutschland seit 2024 als eigene Sorte zugelassen, aber nicht für alle Fahrzeuge freigegeben.\n- **B30 und B100** — höhere Anteile oder reiner Biodiesel nach EN 14214. Sie verlangen geeignete Dichtungen und ein angepasstes Ölwechselintervall; der Heizwert liegt etwa 7 % niedriger, der Verbrauch entsprechend höher.\n\nFür den Betrieb:\n- Der Dieselkraftstoff von der Tankstelle enthält in Deutschland und Österreich stets FAME-Anteile.\n- **Reiner Rapsmethylester aus eigener Erzeugung** ist möglich, verlangt aber sorgfältige Reinigung — verunreinigter Kraftstoff zerstört die Common-Rail-Injektoren.\n- **Stage-V-Motoren** sind für B7 freigegeben; höhere Anteile brauchen die ausdrückliche Freigabe des Herstellers.\n\nZu beachten: FAME ist hygroskopisch und altert schneller als fossiler Diesel. Bei Lagerung über mehrere Monate — etwa im Hoftank über den Winter — droht Wasserabscheidung und Bakterienbewuchs (Dieselpest). Der Tank sollte deshalb regelmäßig entwässert werden.",
    "related": [
      "common-rail"
    ]
  },
  {
    "slug": "powr-quad",
    "term": "PowrQuad / Lastschaltstufen",
    "alias": [
      "Power Shuttle",
      "IVT",
      "AutoPowr",
      "AutoQuad"
    ],
    "kategorie": "technologie",
    "shortDef": "PowrQuad ist ein Getriebe von John Deere mit vier mechanischen Gruppen und je vier lastschaltbaren Stufen — 16 Gänge vorwärts und rückwärts. Eine Bauform des Lastschaltgetriebes.",
    "longDef": "PowrQuad ist die Bezeichnung von John Deere für ein Getriebe mit vier mechanischen Gruppen (A bis D) und je vier hydraulisch lastschaltbaren Stufen — daraus ergeben sich 16 Gänge vorwärts und 16 rückwärts, mit Kriechgruppe auch 24×24.\n\nDie Getriebestufen von John Deere, vom Einstieg zum Spitzenmodell:\n1. **SyncReverser** — handgeschaltet, mechanische Wendeschaltung.\n2. **PowrReverser** — handgeschaltet, hydraulische Wendeschaltung (Power Shuttle).\n3. **PowrQuad** — vier Gruppen mal vier Lastschaltstufen, Standard der Baureihe 6M.\n4. **AutoQuad** — PowrQuad mit automatischer Stufenwahl.\n5. **AutoPowr / IVT** — vollständig stufenlos, in 6R, 7R und 8R.\n\nDie Gegenstücke der Wettbewerber:\n- Case IH Maxxum **ActiveDrive 8** (16×8 Lastschaltung)\n- New Holland **Range Command** (16×6)\n- Deutz-Fahr **Powershift**\n- Fendt setzt durchgängig auf das stufenlose **Vario**\n\nIn der Praxis ist PowrQuad der Kompromiss zwischen Preis und Komfort: einige tausend Euro günstiger als ein stufenloses Getriebe, schaltet aber unter Last. Es lohnt sich besonders dort, wo gleichmäßige Zugarbeit überwiegt — Pflügen, Grubbern, schwere Bodenbearbeitung.",
    "related": [
      "cvt-prevodovka",
      "powershift"
    ]
  },
  {
    "slug": "nase-fronta",
    "term": "Fronthydraulik",
    "alias": [
      "Frontkraftheber",
      "Frontzapfwelle",
      "Front-Dreipunkt"
    ],
    "kategorie": "technologie",
    "shortDef": "Die Fronthydraulik ist ein zusätzlicher Dreipunktkraftheber an der Front des Traktors — sie erlaubt Kombinationen aus Front- und Heckgerät in einer Überfahrt.",
    "longDef": "Die Fronthydraulik (Frontkraftheber) ist das vordere Gegenstück zum Heckkraftheber, montiert vor der Vorderachse. Häufig wird sie mit einer **Frontzapfwelle** kombiniert.\n\nTypische Kombinationen:\n- **Frontmähwerk und Heckmähwerk** — die Schmetterlingskombination verdoppelt die Arbeitsbreite in einer Überfahrt.\n- **Frontpacker und Heckgrubber** — Rückverfestigung und Bodenbearbeitung gleichzeitig.\n- **Fronttank und Heck-Sämaschine** — der Fronttank verlagert Gewicht nach vorn und erhöht das Fassungsvermögen.\n- **Frontseilwinde** — in der Forstwirtschaft und im Berggebiet.\n\nKennwerte:\n- **Hubkraft** typischerweise 2 000 bis 5 000 kg — deutlich weniger als am Heck (6 000 bis 12 000 kg).\n- **Hubweg** kürzer, rund 700 mm.\n- **Frontzapfwelle** mit denselben Normdrehzahlen (540 und 1 000 min⁻¹).\n\nZu den Kosten: Ab Werk kostet die Fronthydraulik etwa 3 000 bis 8 000 € Aufpreis, eine Nachrüstung (etwa von Sauter, Hauer oder Zuidberg) 2 500 bis 7 000 € zuzüglich Montage.\n\nWirtschaftlich lohnt sie sich vor allem im Grünlandbetrieb ab etwa 100 Hektar Mähfläche sowie überall dort, wo sich zwei Arbeitsgänge in einer Überfahrt zusammenlegen lassen. Zu bedenken ist die zusätzliche Vorderachslast und die dadurch veränderte Gewichtsverteilung.",
    "related": [
      "tribod",
      "pto"
    ]
  },
  {
    "slug": "ndvi",
    "term": "NDVI-Index",
    "alias": [
      "Normalized Difference Vegetation Index",
      "Vegetationsindex"
    ],
    "kategorie": "precise-farming",
    "shortDef": "Der NDVI ist ein Vegetationsindex aus Satellitendaten, berechnet aus dem Verhältnis von rotem und nahinfrarotem Licht. Die Werte reichen von 0 (nackter Boden) bis 1 (dichter, gesunder Bestand).",
    "longDef": "Der NDVI (Normalized Difference Vegetation Index) ist der bekannteste Vegetationsindex der Fernerkundung. Die Formel lautet NDVI = (NIR − ROT) / (NIR + ROT), wobei NIR das nahe Infrarot und ROT den roten Spektralbereich bezeichnet.\n\nDas Prinzip: Gesunde Pflanzen reflektieren nahes Infrarot stark (wegen der Zellstruktur der Blätter) und absorbieren rotes Licht (wegen des Chlorophylls). Nackter Boden oder geschädigte Pflanzen reflektieren beides ähnlich — der Index fällt.\n\nDie Wertebereiche:\n- **unter 0**: Wasser, Schnee, Wolken.\n- **0 bis 0,2**: nackter Boden, Gestein.\n- **0,2 bis 0,4**: lückige Vegetation, junger Bestand.\n- **0,4 bis 0,6**: mittlere Bestandesdichte.\n- **0,6 bis 0,8**: dichter, gesunder Bestand im Vegetationshöhepunkt.\n- **über 0,8**: sehr dichte Vegetation, Wald.\n\nAnwendung in der Landwirtschaft:\n- **Applikationskarten** für die teilflächenspezifische Düngung — wo der Index niedrig ist, kann gezielt mehr Stickstoff gegeben werden. ‼️ Die Umkehrung ist nicht immer richtig: Ein niedriger Wert kann auch auf Staunässe oder einen flachgründigen Standort hindeuten, wo mehr Dünger nichts bringt.\n- **Bestandesentwicklung** — Vergleich des Wachstums mit dem Erwartungswert.\n- **Stresserkennung** — ein Einbruch mitten in der Vegetationszeit weist auf Trockenheit oder Krankheit hin.\n\nDatenquellen:\n- **Sentinel-2** (ESA, kostenfrei) — 10 m Auflösung, alle fünf Tage eine Aufnahme. Der Standard in Europa.\n- **Planet Labs** (kostenpflichtig) — 3 m Auflösung, tägliche Aufnahmen.\n- **Drohnen** mit Multispektralkamera — eigene Befliegung mit Auflösungen im Zentimeterbereich.\n\nZu beachten: Bei sehr dichten Beständen gerät der NDVI in die Sättigung und unterscheidet kaum noch. Dort sind Indizes wie der REIP oder NDRE aussagekräftiger.",
    "related": [
      "variable-rate",
      "gps-rtk"
    ]
  },
  {
    "slug": "ctf",
    "term": "Controlled Traffic Farming (CTF)",
    "alias": [
      "CTF",
      "kontrollierte Spurführung",
      "feste Fahrgassen"
    ],
    "kategorie": "precise-farming",
    "shortDef": "Beim Controlled Traffic Farming fahren alle Maschinen — Traktor, Feldspritze, Mähdrescher — dauerhaft in denselben festen Spuren. Der übrige Schlag bleibt unbefahren und damit unverdichtet.",
    "longDef": "Controlled Traffic Farming (CTF) verfolgt einen einfachen Gedanken: Die von Rädern verdichtete Fläche wird auf feste, dauerhaft genutzte Fahrgassen begrenzt. Alle Maschinen fahren in denselben Spuren, der übrige Schlag wird nie befahren.\n\nVoraussetzungen:\n- **RTK-Lenkung** mit Zentimetergenauigkeit — ohne sie treffen die Räder die Spur nicht zuverlässig.\n- **Abgestimmte Arbeitsbreiten** — sie müssen ganzzahlige Vielfache voneinander sein, etwa 12 m Sämaschine, 12 m Schneidwerk und 36 m Feldspritze.\n- **Einheitliche Spurweite** aller Maschinen — üblich sind 2,25 m oder 3,00 m.\n\nVorteile:\n- **60 bis 80 % weniger verdichtete Fläche.**\n- **5 bis 15 % höhere Erträge** durch bessere Bodenstruktur zwischen den Spuren.\n- **Geringerer Kraftstoffbedarf** — weniger Aufwand zur Lockerung verdichteter Böden.\n- **Bessere Wasserinfiltration** und dadurch weniger Erosion.\n\nNachteile:\n- **Hohe Anfangsinvestition** — RTK-System und die Vereinheitlichung des Maschinenparks (Spurweite, Arbeitsbreiten) können mehrere zehntausend Euro kosten.\n- **Bindung beim Maschinenwechsel** — jede neue Maschine muss ins Spurmaß passen.\n- **Große, möglichst regelmäßig geschnittene Schläge** sind Voraussetzung für die Wirtschaftlichkeit; in kleinstrukturierten Regionen ist CTF deshalb kaum verbreitet.\n\nIn Mitteleuropa findet sich CTF vor allem in Ostdeutschland mit seinen großen Schlägen, während es in Süddeutschland und Österreich die Ausnahme bleibt.",
    "related": [
      "gps-rtk",
      "auto-steering",
      "variable-rate"
    ]
  },
  {
    "slug": "yield-monitor",
    "term": "Ertragsmessung (Yield Monitor)",
    "alias": [
      "Ertragsmonitor",
      "Ertragskartierung",
      "yield mapping"
    ],
    "kategorie": "precise-farming",
    "shortDef": "Der Ertragsmonitor misst im Mähdrescher laufend den Kornfluss und die GPS-Position — daraus entsteht eine Ertragskarte des Schlags.",
    "longDef": "Der Ertragsmonitor ist ein System im Mähdrescher, das während der Ernte fortlaufend erfasst:\n1. **Die Kornmenge** im Elevator (über einen Prall- oder optischen Sensor).\n2. **Die Kornfeuchte** (kapazitiv oder über NIR) — zur Umrechnung auf einheitliche Feuchte.\n3. **Schneidwerksbreite und Fahrgeschwindigkeit** — daraus die je Sekunde geerntete Fläche.\n4. **Die GPS-Position** im Sekundentakt.\n\nDas Ergebnis sind Punktdaten (Länge, Breite, kg je Fläche), die zu einer **Ertragskarte des Schlags** interpoliert werden.\n\nDie wichtigsten Systeme:\n- **John Deere Operations Center**\n- **Case IH AFS und New Holland IntelliView** — gemeinsame Plattform im CNH-Konzern.\n- **Claas TELEMATICS**\n- **Trimble und andere herstellerübergreifende Lösungen**\n\nWarum die Karte zählt: Ein Mähdrescher ohne Ertragsmessung ist nur eine Erntemaschine, kein Datenlieferant. Die Ertragskarte einer Saison ist die Grundlage der teilflächenspezifischen Düngung im Folgejahr — mehr Phosphor und Kalium dorthin, wo tatsächlich entzogen wurde, weniger dorthin, wo der Ertrag ohnehin begrenzt ist.\n\nPraktische Hinweise: Der Monitor muss einmal je Saison und Frucht gegen eine geeichte Waage kalibriert werden (die Abweichung liegt dann bei ein bis drei Prozent). Der Feuchtesensor ist täglich zu reinigen — ein verstaubter Sensor verschiebt sämtliche Werte. Randbeete und Wendevorgänge sollten aus der Auswertung herausgefiltert werden, sonst verzerren sie die Karte.",
    "related": [
      "variable-rate",
      "gps-rtk",
      "ndvi"
    ]
  },
  {
    "slug": "dap",
    "term": "DAP (Diammonphosphat)",
    "alias": [
      "DAP",
      "Diammonphosphat",
      "18-46-0"
    ],
    "kategorie": "hnojivo",
    "shortDef": "DAP (Diammonphosphat) ist ein granulierter Dünger mit 18 % Stickstoff und 46 % Phosphat (P₂O₅) — die wichtigste konzentrierte Phosphorquelle im Ackerbau.",
    "longDef": "DAP ist ein hochkonzentrierter Phosphatdünger (Diammonphosphat, chemisch (NH₄)₂HPO₄) mit 18 % N und 46 % P₂O₅. Hergestellt wird er aus Phosphorsäure und Ammoniak.\n\nAnwendung:\n- **Unterfußdüngung zur Saat** — 100 bis 200 kg/ha, mit dem Saatgut in die Reihe abgelegt. Der hohe Phosphatanteil fördert die Wurzelentwicklung der Jungpflanze, besonders bei Mais auf kalten Frühjahrsböden.\n- **Herbstdüngung zu Wintergetreide** — 150 bis 300 kg/ha, eingearbeitet. Phosphat ist im Boden kaum beweglich und wird deshalb tief und rechtzeitig abgelegt.\n- **Frühjahrsdüngung** — seltener, da Phosphat an der Oberfläche wenig wirksam ist.\n\nEigenschaften:\n- **Leicht saure Reaktion** in der Rhizosphäre — günstig auf neutralen bis leicht alkalischen Böden.\n- **Hohe Wasserlöslichkeit** — sofort pflanzenverfügbar, anders als bei Rohphosphaten.\n- **Preis**: je nach Marktlage etwa 550 bis 800 €/t.\n\n‼️ Auf alkalischen Böden (pH über 7,5) geht Phosphat rasch in schwer lösliche Calciumverbindungen über und wird unwirksam. Dort ist MAP (Monoammonphosphat) mit seiner stärker sauren Reaktion die bessere Wahl.\n\nZu beachten ist außerdem die Düngeverordnung: Die Phosphatdüngung ist an den Bodengehalt gebunden — bei hoher Versorgungsstufe darf nur noch die Abfuhr ersetzt werden, in Gebieten mit Phosphatbelastung gelten zusätzliche Einschränkungen.",
    "related": [
      "npk-hnojivo",
      "pH-pudy"
    ]
  },
  {
    "slug": "roundup",
    "term": "Glyphosat (Roundup)",
    "alias": [
      "Glyphosat",
      "Roundup",
      "Totalherbizid"
    ],
    "kategorie": "agrotechnika",
    "shortDef": "Glyphosat (Handelsname Roundup) ist ein nicht selektives, systemisches Herbizid — es erfasst alle grünen Pflanzen. Das weltweit meistverwendete Herbizid, in der EU bis Ende 2033 genehmigt.",
    "longDef": "Glyphosat ist der weltweit meistverwendete Herbizidwirkstoff, vermarktet unter der Marke Roundup und zahlreichen Generika. Es wirkt **nicht selektiv** — es erfasst jede grüne Pflanze — und **systemisch**: Es wird über das Blatt aufgenommen und bis in die Wurzeln verlagert, weshalb es auch Wurzelunkräuter wie Quecke und Distel erfasst.\n\nAnwendung:\n- **Vor der Saat** — Beseitigung von Ausfall und Unkraut auf der Stoppel, insbesondere im pfluglosen Anbau.\n- **Vor dem Auflaufen** der Kultur.\n- **Auf Nichtkulturland** und im Forst gegen Konkurrenzvegetation.\n\n**Zulassungslage:**\n- Die **EU** hat den Wirkstoff im November 2023 bis zum **15. Dezember 2033** erneut genehmigt.\n- **Deutschland** schränkt die Anwendung national ein: Die Pflanzenschutz-Anwendungsverordnung verbietet den Einsatz in Naturschutzgebieten, auf Gewässerrandstreifen und auf Nichtkulturland; die **Sikkation** vor der Ernte ist untersagt, ebenso die Anwendung durch Privatpersonen im Haus- und Kleingarten.\n- **Österreich** hat ein Teilverbot: Die Anwendung ist auf öffentlichen Flächen sowie für Privatanwender untersagt, die Sikkation vor der Ernte ebenfalls.\n- **Im Ökolandbau** ist Glyphosat vollständig ausgeschlossen.\n\nZur Kontroverse: Die IARC der WHO stufte Glyphosat 2015 als „wahrscheinlich krebserzeugend beim Menschen\" (Gruppe 2A) ein, während EFSA und ECHA nach ihren Bewertungen kein unannehmbares Risiko sahen — die Bewertungen unterscheiden sich methodisch, weil die IARC das Gefahrenpotenzial, die EU-Behörden das Risiko unter zugelassenen Anwendungsbedingungen beurteilen.\n\nZur Praxis: Der Anwender braucht einen **Sachkundenachweis Pflanzenschutz**, und die Anwendung ist in der Schlagkartei zu dokumentieren. Der Preis liegt je nach Formulierung und Gebinde bei etwa 6 bis 12 €/l bei Aufwandmengen von 2 bis 4 l/ha.",
    "related": [
      "mezi-plodiny"
    ]
  },
  {
    "slug": "jednotna-zadost",
    "term": "Sammelantrag",
    "alias": [
      "Mehrfachantrag",
      "MFA",
      "Flächenantrag",
      "Agrarantrag"
    ],
    "kategorie": "dotace",
    "shortDef": "Der Sammelantrag ist der jährliche Förderantrag, der alle flächenbezogenen Zahlungen bündelt — Einkommensgrundstützung, Umverteilung, Junglandwirte, Öko-Regelungen und Ausgleichszulage.",
    "longDef": "Der Sammelantrag — in Österreich **Mehrfachantrag Flächen (MFA)** — ist der zentrale jährliche Förderantrag. Er bündelt sämtliche flächenbezogenen Zahlungen in einem Vorgang, statt sie einzeln beantragen zu lassen.\n\nWas er enthält:\n- **Betriebsdaten** und Betriebsnummer.\n- **Flächenverzeichnis** — alle bewirtschafteten Schläge mit Feldblockbezug, Nutzungsart und Kultur.\n- **Einkommensgrundstützung** und **Umverteilungseinkommensstützung**.\n- **Öko-Regelungen** — die Auswahl der Maßnahmen ist jährlich neu zu treffen.\n- **Ausgleichszulage** für benachteiligte Gebiete.\n- **Gekoppelte Einkommensstützung** — Mutterkühe, Mutterschafe und -ziegen; in Österreich der Almauftrieb.\n- **Junglandwirteförderung.**\n- **Agrarumwelt- und Klimamaßnahmen** beziehungsweise ÖPUL-Maßnahmen (mehrjährige Verpflichtungen).\n\nAntragstellung:\n- **Frist**: in Deutschland üblicherweise der 15. Mai, in Österreich Mitte April; verspätete Anträge werden mit einem Abschlag je Werktag belegt.\n- **Weg**: ausschließlich elektronisch — in Deutschland über das Portal des jeweiligen Bundeslandes (etwa FIONA, iBALIS, ELAN, Agrarantrag), in Österreich über **eAMA**.\n- **Unterstützung**: die Landwirtschaftskammern und die Ämter für Landwirtschaft beraten; daneben gibt es private Antragsteller.\n\nNach der Antragstellung:\n- **Frühjahr und Sommer**: Abgleich der Angaben mit dem Referenzsystem und **flächenmonitoring per Satellit** (Copernicus/Sentinel) — Abweichungen werden dem Betrieb zur Klärung vorgelegt, häufig mit der Möglichkeit einer Nachmeldung per Foto-App.\n- **Ab Dezember**: Auszahlung der Direktzahlungen.\n- **Sanktionen**: Bei fehlerhaften Angaben oder Verstößen gegen die Konditionalität drohen Kürzungen und Rückforderungen.",
    "related": [
      "biss",
      "cap-2024",
      "lpis"
    ]
  },
  {
    "slug": "aeko",
    "term": "Agrarumwelt- und Klimamaßnahmen (AUM)",
    "alias": [
      "AUM",
      "AUKM",
      "Agrarumweltprogramm",
      "ÖPUL"
    ],
    "kategorie": "dotace",
    "shortDef": "Die Agrarumwelt- und Klimamaßnahmen sind mehrjährige freiwillige Verpflichtungen der zweiten Säule für umweltschonende Bewirtschaftung — mit höheren Sätzen, aber strengeren Auflagen als die Öko-Regelungen.",
    "longDef": "Die Agrarumwelt- und Klimamaßnahmen (AUM, teils AUKM) sind Förderprogramme der **zweiten Säule** der GAP. Anders als die Öko-Regelungen, die jährlich neu gewählt werden, verpflichtet sich der Betrieb hier für **mehrere Jahre** — üblicherweise fünf.\n\nIn **Deutschland** werden sie von den Ländern ausgestaltet, die Programme heißen je nach Land unterschiedlich (etwa KULAP in Bayern und Thüringen, FAKT in Baden-Württemberg, AUKM in Niedersachsen). Typische Maßnahmen:\n- **Extensive Grünlandnutzung** — späte Schnittzeitpunkte nach der Brut, begrenzter Viehbesatz.\n- **Blühflächen und Blühstreifen** — mehrjährig, mit vorgegebenen Mischungen.\n- **Ökologischer Landbau** — Einführung und Beibehaltung, gestaffelt nach Kultur.\n- **Umwandlung von Acker in Grünland** — Ausgleich für den Ertragsverzicht.\n- **Erhalt von Streuobstwiesen.**\n- **Gewässerschutz** — Verzicht auf Dünger und Pflanzenschutz in Randstreifen.\n\nIn **Österreich** übernimmt diese Rolle das **ÖPUL** mit den Basismodulen UBB und Biologische Wirtschaftsweise sowie zahlreichen Zuschlägen — siehe die eigene Übersicht der ÖPUL-Prämien.\n\nDie Regeln:\n- **Mehrjährige Bindung** — wer vorzeitig aussteigt, muss die bereits erhaltenen Zahlungen in der Regel zurückzahlen.\n- **Kombinierbarkeit** — nicht alle Maßnahmen lassen sich miteinander oder mit Öko-Regelungen kombinieren; die Programme enthalten Ausschlusslisten.\n- **Vor-Ort-Kontrollen** ergänzend zur Satellitenüberwachung.\n\nFür wen sich das lohnt: Betriebe mit langfristiger Ausrichtung auf Grünland, Ökolandbau oder Gewässerschutz. Für einen intensiv wirtschaftenden Ackerbaubetrieb ist der Verwaltungsaufwand oft höher als der Zusatzertrag gegenüber den Öko-Regelungen — die Empfehlung lautet, zunächst die Öko-Regelungen auszuschöpfen und AUM gezielt dort zu ergänzen, wo sie zur Betriebsstruktur passen.",
    "related": [
      "cap-2024",
      "eko-platba",
      "biopasy"
    ]
  },
  {
    "slug": "gaec",
    "term": "GLÖZ-Standards",
    "alias": [
      "GLÖZ",
      "GAEC",
      "Konditionalität",
      "Cross Compliance"
    ],
    "kategorie": "regulace",
    "shortDef": "Die GLÖZ-Standards (guter landwirtschaftlicher und ökologischer Zustand) sind die verpflichtenden Mindestanforderungen für jeden Empfänger von Direktzahlungen. Verstöße führen zu Kürzungen.",
    "longDef": "GLÖZ steht für den **guten landwirtschaftlichen und ökologischen Zustand** (EU-weit GAEC — Good Agricultural and Environmental Conditions). Zusammen mit den Grundanforderungen an die Betriebsführung (GAB) bilden die GLÖZ-Standards die **Konditionalität**, die jeder Empfänger von Direktzahlungen einhalten muss. Sie löste ab 2023 das frühere Cross Compliance ab.\n\nDie neun Standards:\n- **GLÖZ 1**: Erhalt des Dauergrünlands — das Verhältnis zur landwirtschaftlichen Fläche darf gegenüber dem Referenzjahr nicht um mehr als 5 % sinken.\n- **GLÖZ 2**: Schutz von Feuchtgebieten und Mooren.\n- **GLÖZ 3**: Verbot des Abbrennens von Stoppelfeldern.\n- **GLÖZ 4**: Pufferstreifen entlang von Gewässern — dort kein Dünger und kein Pflanzenschutz.\n- **GLÖZ 5**: Erosionsschutz — Bewirtschaftungsauflagen auf erosionsgefährdeten Hängen, in Deutschland nach den Kulissen CC-Wasser und CC-Wind.\n- **GLÖZ 6**: Mindestbodenbedeckung in der sensibelsten Jahreszeit — in Deutschland auf mindestens 80 % der Ackerfläche zwischen dem 15. November und dem 15. Januar.\n- **GLÖZ 7**: Fruchtwechsel auf Ackerland — auf jedem Schlag muss im Jahresvergleich die Hauptkultur wechseln, mit Ausnahmen etwa für Mais und Gras.\n- **GLÖZ 8**: Nichtproduktive Flächen und Landschaftselemente — mindestens 4 % des Ackerlands, sowie das Verbot, Hecken und Bäume während der Brutzeit zu schneiden.\n- **GLÖZ 9**: Umbruchverbot für umweltsensibles Dauergrünland in Natura-2000-Gebieten.\n\nBei Verstößen wird die Direktzahlung gekürzt — je nach Schwere, Ausmaß und Dauer typischerweise um 1 bis 5 %, bei Vorsatz auch deutlich mehr, im Wiederholungsfall zusätzlich.\n\nKontrolliert wird über Vor-Ort-Kontrollen bei einem Teil der Betriebe sowie über die flächendeckende **Satellitenüberwachung**, die Verstöße gegen Bodenbedeckung und Fruchtwechsel aus der Ferne erkennt.",
    "related": [
      "cap-2024",
      "biss",
      "mezi-plodiny"
    ]
  },
  {
    "slug": "natura-2000",
    "term": "Natura 2000",
    "alias": [
      "FFH-Gebiet",
      "Vogelschutzgebiet",
      "SPA"
    ],
    "kategorie": "regulace",
    "shortDef": "Natura 2000 ist das europäische Schutzgebietsnetz. Für Landwirte bedeutet es Auflagen — Umbruchverbot für Grünland, Einschränkungen bei Dünger und Pflanzenschutz — zugleich aber höhere Fördersätze.",
    "longDef": "Natura 2000 ist das Netz von Schutzgebieten der EU, gegründet auf zwei Richtlinien: die **Fauna-Flora-Habitat-Richtlinie** (1992) und die **Vogelschutzrichtlinie** (1979). Ziel ist der Erhalt der biologischen Vielfalt in den Lebensräumen und für die Arten von europäischer Bedeutung.\n\nZwei Gebietstypen:\n- **FFH-Gebiete** — Schutz von Lebensraumtypen sowie Pflanzen- und Tierarten außer Vögeln.\n- **Vogelschutzgebiete (SPA)** — Brut- und Rastgebiete gefährdeter Vogelarten.\n\nZum Umfang: In **Deutschland** umfasst Natura 2000 rund 15,5 % der Landfläche, in **Österreich** etwa 15 % — in beiden Ländern liegt ein erheblicher Teil auf landwirtschaftlich genutzten Flächen, vor allem auf Grünland.\n\nWas das für den Betrieb bedeutet:\n- **Umbruchverbot für Dauergrünland** — der GLÖZ-9-Standard gilt hier absolut, strenger als außerhalb.\n- **Auflagen zu Dünger und Pflanzenschutz** — je nach Gebietsverordnung Einschränkungen oder Verbote.\n- **Schnittzeitpunkte** — in Wiesenbrütergebieten häufig erst nach dem 15. Juni oder später, damit Kiebitz, Braunkehlchen und Wachtelkönig ausbrüten können.\n- **Verschlechterungsverbot** — jede Maßnahme, die den Erhaltungszustand verschlechtern könnte, ist mit der Naturschutzbehörde abzustimmen.\n\nDem stehen Fördermöglichkeiten gegenüber:\n- **Natura-2000-Ausgleich** — eine eigene Zahlung der zweiten Säule für die aus der Gebietsverordnung folgenden Bewirtschaftungsnachteile.\n- **Höhere Sätze** bei den Agrarumweltmaßnahmen für Flächen im Schutzgebiet.\n- **Vertragsnaturschutz** — Verträge mit der Naturschutzverwaltung über konkrete Pflegeleistungen.\n\n‼️ Vor Kauf oder Pacht einer Fläche im Natura-2000-Gebiet lohnt der Blick in die **Gebietsverordnung und den Managementplan** — die Auflagen können den wirtschaftlichen Wert der Fläche erheblich verändern.",
    "related": [
      "cap-2024",
      "lpis",
      "aeko"
    ]
  },
  {
    "slug": "organicka-hmota",
    "term": "Organische Bodensubstanz",
    "alias": [
      "Humus",
      "Humusgehalt",
      "Bodenkohlenstoff"
    ],
    "kategorie": "agrotechnika",
    "shortDef": "Die organische Bodensubstanz (Humus) ist abgestorbenes pflanzliches und tierisches Material im Boden. Der wichtigste Kennwert der Bodenfruchtbarkeit — sie hält Wasser und Nährstoffe und stabilisiert das Gefüge.",
    "longDef": "Die organische Bodensubstanz (OBS, umgangssprachlich Humus) umfasst alle abgestorbenen und teilweise umgesetzten Reste von Pflanzen, Wurzeln, Bodenorganismen und Tieren. Gemessen wird sie als Humusgehalt in Prozent der Trockenmasse des Oberbodens.\n\nTypische Gehalte:\n- **Ackerland in Mitteleuropa**: 1,5 bis 3 % — im Zuge der Intensivierung von früher 3 bis 4 % gesunken.\n- **Dauergrünland**: 4 bis 8 %, wegen der ständigen Durchwurzelung und fehlenden Bodenbearbeitung.\n- **Waldboden**: 8 bis 15 %.\n- **Schwarzerde** (Magdeburger Börde, Marchfeld): 3 bis 4 % — die besten Ackerböden der Region.\n- **Moorböden**: über 15 %, hier ist der Erhalt eine Klimafrage.\n\nDie Funktionen:\n- **Wasserspeicherung** — jedes Prozent OBS speichert grob 15 Liter Wasser je Quadratmeter zusätzlich.\n- **Nährstoffvorrat** — beim Abbau werden N, P und S nachgeliefert; ein Boden mit 2 % Humus setzt jährlich etwa 30 bis 60 kg N/ha frei.\n- **Bodengefüge** — Humus verkittet die Krümel und macht den Boden bearbeitbar und tragfähig.\n- **Bodenleben** — Nahrungsgrundlage für Bakterien, Pilze und Regenwürmer.\n- **Kohlenstoffspeicherung** — ein Prozentpunkt mehr Humus in 30 cm Krume bindet rund 30 t Kohlenstoff je Hektar.\n\nHumusaufbau gelingt über eingearbeitete Zwischenfrüchte, Stallmist (25 bis 40 t/ha im Abstand von drei bis vier Jahren), Kompost, reduzierte Bodenbearbeitung und den zeitweiligen Anbau von Feldgras. Humusabbau fördern dagegen intensive Bodenbearbeitung, enge Fruchtfolgen mit hoher Abfuhr und Erosion.\n\n‼️ Humusaufbau ist langsam: 0,1 Prozentpunkte in fünf bis zehn Jahren gelten schon als guter Erfolg. Verloren geht Humus dagegen binnen weniger Jahre — der Aufwand steht in keinem Verhältnis zum Tempo des Abbaus.",
    "related": [
      "mezi-plodiny",
      "pH-pudy"
    ]
  },
  {
    "slug": "eroze-pudy",
    "term": "Bodenerosion",
    "alias": [
      "Wassererosion",
      "Winderosion",
      "Bodenabtrag"
    ],
    "kategorie": "agrotechnika",
    "shortDef": "Bodenerosion ist der Abtrag des Oberbodens durch Wasser oder Wind. Sie trifft einen erheblichen Teil der Ackerflächen und ist die wichtigste Ursache dauerhaften Ertragsverlusts.",
    "longDef": "Bodenerosion ist ein natürlicher Vorgang, den intensive Bewirtschaftung stark beschleunigt. Zwei Formen sind maßgeblich:\n\n**Wassererosion** (die häufigere):\n- Regentropfen zerschlagen die Bodenaggregate, das Wasser schwemmt die Teilchen hangabwärts — der Abtrag liegt bei 2 bis 50 t Boden je Hektar und Jahr.\n- Am stärksten gefährdet sind Hanglagen über 8 %, lange Schläge in Gefällerichtung sowie Reihenkulturen wie Mais, Zuckerrübe und Kartoffeln mit später Bodenbedeckung.\n- Nach Starkregen über 50 mm in der Stunde kann der Abtrag an einem einzigen Tag 100 t/ha übersteigen — sichtbar an Rillen und Gräben im Schlag.\n\n**Winderosion**:\n- Betrifft trockene, leichte Böden mit wenig Struktur — in Deutschland vor allem die Sandböden Nordostdeutschlands, in Österreich das Marchfeld und das nördliche Burgenland.\n- Der Abtrag ist mit 1 bis 10 t/ha und Jahr geringer, aber stetig.\n\nDie Folgen:\n- **Verlust der fruchtbarsten Schicht** — der Oberboden trägt den meisten Humus und die meisten Nährstoffe.\n- **Dauerhafte Ertragsminderung** von 5 bis 25 %.\n- **Gewässerbelastung** — mit dem Boden gelangt Phosphat in Bäche und Seen und begünstigt die Eutrophierung.\n- **Schäden in Ortslagen** — abgeschwemmter Schlamm verstopft Kanäle und dringt in Keller ein.\n\nSchutzmaßnahmen — nach GLÖZ 5 auf gefährdeten Flächen verpflichtend:\n- **Bewirtschaftung quer zum Hang** statt in Gefällerichtung.\n- **Mulch- und Direktsaat** — die Rückstände an der Oberfläche brechen die Aufprallenergie des Regens.\n- **Zwischenfrüchte über Winter** — Bodenbedeckung in der kritischen Zeit.\n- **Begrünte Abflussrinnen und Randstreifen** entlang von Gewässern.\n- **Windschutzhecken** gegen Winderosion.\n\nWer die Auflagen der Erosionsschutzkulisse nicht einhält, muss mit Kürzungen der Direktzahlungen rechnen.",
    "related": [
      "mezi-plodiny",
      "organicka-hmota",
      "gaec"
    ]
  },
  {
    "slug": "allwheel-drive",
    "term": "Allradantrieb",
    "alias": [
      "MFWD",
      "Allrad",
      "4WD",
      "Vorderradantrieb"
    ],
    "kategorie": "technologie",
    "shortDef": "Der Allradantrieb treibt zusätzlich die Vorderachse an — mehr Zugkraft, weniger Schlupf, bessere Traktion auf nassem Boden. Bei modernen Traktoren praktisch durchgängig Standard.",
    "longDef": "Der Allradantrieb beim Traktor (technisch **MFWD** — Mechanical Front Wheel Drive) treibt zusätzlich die gelenkte Vorderachse an. Seit den 1990er-Jahren ist er bei allen Traktoren über etwa 50 PS Standard.\n\nAufbau:\n- **Mechanischer Antrieb** über eine Gelenkwelle vom Getriebe zum Vorderachsdifferenzial.\n- **Zuschaltbare Kupplung** — der Fahrer kann den Allrad abschalten. Auf der Straße spart das Kraftstoff und verhindert Verspannungen im Antriebsstrang.\n- **Gleich große Räder** vorn und hinten bei Knicklenkern und einigen Großtraktoren (Fendt 1000, John Deere 9R) — beste Traktion, aber größerer Wendekreis.\n\nEin wichtiger Unterschied zum Pkw: Vorder- und Hinterachse laufen nicht frei gegeneinander, sondern mit einem konstruktiv festgelegten **Vorlauf** der Vorderachse von etwa 1 bis 5 %. Er sorgt dafür, dass die Vorderräder leicht ziehen. Ein zu großer Vorlauf durch falsche Reifengrößen führt zu Verspannung, erhöhtem Reifenverschleiß und Schäden im Antriebsstrang.\n\nVorteile:\n- **25 bis 40 % mehr Zugkraft** gegenüber reinem Hinterradantrieb.\n- **Bessere Steigfähigkeit** — entscheidend im Grünland der Berglagen und in der Forstwirtschaft.\n- **Weniger Schlupf** — das schont den Boden und spart Kraftstoff bei schwerer Zugarbeit.\n\nNachteile: höherer Anschaffungspreis, mehr wartungsrelevante Bauteile und ein höherer Verbrauch auf der Straße — weshalb sich der Allrad dort abschalten lässt.\n\nErgänzend wirken die **Differenzialsperren** an Vorder- und Hinterachse, die der Fahrer bei Traktionsverlust im nassen Boden zuschaltet. Sie dürfen nur geradeaus und nicht auf befestigter Fahrbahn genutzt werden.",
    "related": [
      "cvt-prevodovka",
      "tribod"
    ]
  },
  {
    "slug": "duala",
    "term": "Zwillingsbereifung",
    "alias": [
      "Zwillingsräder",
      "Duals",
      "Doppelbereifung"
    ],
    "kategorie": "technologie",
    "shortDef": "Die Zwillingsbereifung montiert zwei Räder je Achsseite — sie halbiert den Bodendruck und erhöht die Tragfähigkeit. Bei Großtraktoren im Feldeinsatz üblich.",
    "longDef": "Die Zwillingsbereifung (Duals) montiert zwei Räder nebeneinander auf jeder Achsseite statt eines einzelnen. Bei Traktoren über etwa 250 PS ist sie im Feldeinsatz nahezu die Regel.\n\nDas Prinzip: Zwei Räder verdoppeln die Aufstandsfläche und halbieren damit den Bodendruck. Ein Traktor von 12 Tonnen erzeugt auf Einzelbereifung schnell 1,5 bar Kontaktflächendruck, mit Zwillingen sinkt er auf etwa 0,7 bis 1,0 bar — die Grenze, ab der Unterbodenverdichtung deutlich zunimmt.\n\nEinsatz:\n- **Großtraktoren ab 250 PS** — Fendt 900 und 1000, John Deere 8R und 9R, New Holland T9, Case IH Steiger.\n- **Wechselräder** — die Zwillinge werden nur für die Feldarbeit montiert; für die Straßenfahrt kommen sie ab, weil die Gesamtbreite sonst über 3,00 m liegt.\n- **Dreifachbereifung** bei den größten Maschinen — in Europa eine Ausnahme, in Nordamerika verbreiteter.\n\n‼️ **Straßenverkehr**: In Deutschland und Österreich darf ein land- oder forstwirtschaftliches Fahrzeug bis 3,00 m breit sein; darüber ist eine Ausnahmegenehmigung nötig, und über 3,50 m kommen Begleitfahrzeuge hinzu. Wer mit überbreiter Zwillingsbereifung ohne Genehmigung auf die Straße fährt, riskiert Bußgeld und die Untersagung der Weiterfahrt. Die Montage erfolgt deshalb unmittelbar vor dem Feldeinsatz — mit Schnellkupplungssystemen dauert das nur wenige Minuten.\n\nDie Alternative sind **Breitreifen** mit niedrigem Reifeninnendruck oder ein **Reifendruckregelsystem**, das den Druck für Feld und Straße getrennt einstellt. Es kostet weniger Umbauzeit, erreicht aber nicht die Tragfähigkeit echter Zwillinge.",
    "related": [
      "allwheel-drive"
    ]
  },
  {
    "slug": "rotor-kombajn",
    "term": "Rotormähdrescher",
    "alias": [
      "Axialflussdrescher",
      "Axial-Flow",
      "Rotordreschwerk"
    ],
    "kategorie": "technologie",
    "shortDef": "Der Rotormähdrescher nutzt einen längs eingebauten Rotor statt Dreschtrommel und Schüttlern — höherer Durchsatz, schonendere Kornbehandlung, mehr Leistung.",
    "longDef": "Ein klassischer Mähdrescher hat eine quer eingebaute **Dreschtrommel** und **Hordenschüttler** zur Trennung von Korn und Stroh. Der Rotormähdrescher ersetzt beides durch einen einzigen **längs eingebauten Rotor**, durch den der gesamte Erntegutstrom läuft.\n\nVorteile:\n- **15 bis 25 % mehr Durchsatz** gegenüber einem Schüttlerdrescher vergleichbarer Größe.\n- **Weniger Bruchkorn** — das Gut wird auf längerem Weg schonender behandelt.\n- **Bessere Abscheidung bei feuchten Bedingungen** — nach Regen oder bei Morgentau.\n- **Einfachere Mechanik** — weniger bewegte Teile und Keilriemen als bei Schüttlern.\n\nNachteile:\n- **Höherer Kraftstoffbedarf** — der Rotor braucht mehr Antriebsleistung.\n- **Stärker zerschlagenes Stroh** — wer langes, pressfähiges Stroh für Einstreu braucht, fährt mit dem Schüttlerdrescher besser.\n- **Höherer Anschaffungspreis**, etwa 10 bis 20 % über einem vergleichbaren Schüttlerdrescher.\n\nDie wichtigsten Bauarten:\n- **Case IH Axial-Flow** — der Wegbereiter seit 1977, ein Rotor.\n- **John Deere S-Serie** — Einrotor.\n- **New Holland CR** — Twin Rotor mit zwei parallelen Rotoren.\n- **Fendt IDEAL** — Doppelrotor mit Helix-Geometrie.\n- **Claas Lexion APS Hybrid** — der Kompromiss: klassische Dreschtrommel mit Beschleuniger und nachgeschalteter Rotorabscheidung.\n\nIn Mitteleuropa hält sich der Schüttlerdrescher besser als in Nordamerika, weil Stroh hier als Einstreu und Futter einen Wert hat. Für Betriebe mit Viehhaltung ist das oft das entscheidende Argument.",
    "related": [
      "kombajn-trida",
      "mlatecka"
    ]
  },
  {
    "slug": "kombajn-trida",
    "term": "Mähdrescherklasse",
    "alias": [
      "Leistungsklasse",
      "Klasse"
    ],
    "kategorie": "technologie",
    "shortDef": "Die Mähdrescherklasse (III bis X+) beschreibt Größe und Durchsatz — abgeleitet aus Dreschwerksfläche und Schüttlerzahl beziehungsweise Rotorgröße. Höhere Klasse bedeutet mehr Durchsatz.",
    "longDef": "Die Klasseneinteilung der Mähdrescher ist die europäische Einordnung nach Durchsatz und Größe des Dreschwerks. Maßgeblich sind die **Dreschwerksfläche** und die **Zahl der Schüttler** beziehungsweise bei Rotormaschinen die Rotorgröße.\n\nEine grobe Übersicht:\n- **Klasse III**: 100 bis 120 kW (135 bis 160 PS), Schneidwerk 4 m, Korntank 4 500 l.\n- **Klasse IV**: 120 bis 155 kW, Schneidwerk 4,5 bis 5 m, Korntank 5 500 l.\n- **Klasse V**: 155 bis 185 kW, Schneidwerk 5 bis 6 m, Korntank 6 500 l.\n- **Klasse VI**: 185 bis 230 kW, Schneidwerk 6 bis 7,5 m, Korntank 7 500 l.\n- **Klasse VII**: 230 bis 270 kW, Schneidwerk 7,5 bis 9 m, Korntank 9 000 l.\n- **Klasse VIII**: 270 bis 330 kW, Schneidwerk 9 bis 10,5 m, Korntank 10 500 l.\n- **Klasse IX**: 330 bis 400 kW, Schneidwerk 10,5 bis 12 m, Korntank 12 000 l.\n- **Klasse X und darüber**: über 400 kW, Schneidwerk 12 bis 18 m, Korntank über 14 000 l.\n\nZur Einordnung nach Betriebsgröße:\n- **50 bis 200 ha Getreide**: Klasse IV bis V (Claas Avero und Tucano, John Deere T-Serie, Case IH Axial-Flow 5000).\n- **200 bis 500 ha**: Klasse VI bis VII (Claas Trion, John Deere T670, New Holland CX).\n- **500 bis 1 500 ha**: Klasse VIII bis IX (Claas Lexion 7000 und 8000, John Deere S790, Fendt IDEAL 8).\n- **Über 1 500 ha oder Lohnunternehmen**: Klasse X (Claas Lexion 8900, John Deere X9, Fendt IDEAL 10T, New Holland CR11).\n\n‼️ Eine höhere Klasse ist nicht automatisch die bessere Wahl. Ein überdimensionierter Mähdrescher bindet Kapital, das im Erntefenster nicht ausgelastet wird. Die Faustregel lautet: Die Maschine sollte die Erntefläche in etwa zehn bis vierzehn nutzbaren Tagen schaffen — mehr Reserve kostet mehr, als der gewonnene Spielraum wert ist.",
    "related": [
      "rotor-kombajn"
    ]
  },
  {
    "slug": "header",
    "term": "Schneidwerk",
    "alias": [
      "Vorsatzgerät",
      "Header",
      "Getreideschneidwerk"
    ],
    "kategorie": "technologie",
    "shortDef": "Das Schneidwerk ist das Vorsatzgerät des Mähdreschers — es schneidet den Bestand und führt ihn dem Dreschwerk zu. Die Arbeitsbreite reicht je nach Klasse von 4 bis 18 m.",
    "longDef": "Das Schneidwerk (Vorsatzgerät) ist der abnehmbare vordere Teil des Mähdreschers. Für die verschiedenen Kulturen gibt es **eigene Bauarten**:\n\n**Getreide- und Rapsschneidwerk** (Universalschneidwerk):\n- Arbeitsbreite 4 bis 18 m je nach Maschinenklasse.\n- **Vario-Schneidwerk** mit verschiebbarem Messerbalken — der Tisch lässt sich um 70 bis 90 cm verlängern, was bei Raps den Ausfall deutlich mindert und bei Getreide den Gutfluss verbessert.\n- **Rapsausrüstung** mit Seitenmessern und verlängertem Tisch.\n\n**Maispflücker**:\n- Vier-, sechs-, acht- und zwölfreihige Ausführungen.\n- Pflückwalzen statt Messerbalken — der Kolben wird abgerissen, die Pflanze bleibt stehen oder wird gehäckselt.\n\n**Pick-up**:\n- Nimmt zuvor geschwadetes Gut auf, ohne neu zu schneiden. Bei Raps im Schwaddrusch und bei Grassamen.\n\n**Sonnenblumenvorsatz**:\n- Mit Pflückblechen, die nur den Korb erfassen.\n\nZur Auswahl:\n- **Die Arbeitsbreite muss zur Maschinenklasse passen** — ein zu breites Schneidwerk zwingt zu langsamerer Fahrt und bringt keinen Mehrdurchsatz.\n- **Transport**: Jedes Schneidwerk über 3,00 m Breite braucht für die Straßenfahrt einen **Schneidwerkswagen**; Klappschneidwerke sind die Ausnahme.\n\nViele Betriebe fahren zwei Vorsätze — Getreide und Mais — mit Schnellkupplung, der Wechsel dauert wenige Minuten.",
    "related": [
      "kombajn-trida",
      "rotor-kombajn"
    ]
  },
  {
    "slug": "orba",
    "term": "Pflügen",
    "alias": [
      "Grundbodenbearbeitung",
      "wendende Bodenbearbeitung",
      "Pflug"
    ],
    "kategorie": "agrotechnika",
    "shortDef": "Das Pflügen wendet den Boden mit dem Pflug in 20 bis 35 cm Tiefe. Die klassische Grundbodenbearbeitung — sie vergräbt Ernterückstände, unterdrückt Unkraut und lockert.",
    "longDef": "Das Pflügen ist die traditionsreichste Form der Bodenbearbeitung: Der Pflug schneidet eine 20 bis 35 cm starke Schicht ab und wendet sie.\n\n**Pflugbauarten**:\n- **Anbaupflug** — im Dreipunkt getragen, bis etwa vier Schare.\n- **Aufsattelpflug** — größere Pflüge mit fünf bis zwölf Scharen, teilweise auf einem Stützrad abgestützt.\n- **Variopflug** — die Arbeitsbreite je Schar lässt sich während der Fahrt verstellen.\n- **Drehpflug (Volldrehpflug)** — die Schare werden am Vorgewende gedreht, sodass in beiden Richtungen zur selben Seite gewendet wird. Er hinterlässt keine Furchen und Beete und ist heute die Regel.\n\n**Arbeitstiefe**:\n- **Flach (15 bis 20 cm)** — Stoppelbearbeitung nach der Ernte.\n- **Mittel (20 bis 28 cm)** — der Standard vor Wintergetreide.\n- **Tief (28 bis 35 cm)** — gegen Verdichtungen, nur gelegentlich und mit hohem Zugkraftbedarf.\n\n**Kraftstoffbedarf** als Anhalt:\n- Dreischariger Pflug an einem 100-PS-Traktor: 12 bis 18 l/ha.\n- Fünfschariger an 200 PS: 18 bis 25 l/ha.\n- Achtschariger an 350 PS: 22 bis 30 l/ha.\n\n**Alternativen**:\n- **Direktsaat** — ohne Bodenbearbeitung, die Sämaschine legt direkt in die Stoppel ab.\n- **Mulchsaat** — flache Bearbeitung mit Grubber oder Scheibenegge statt Pflug.\n- **Streifenbearbeitung (Strip-Till)** — nur der Saatstreifen wird bearbeitet, der Zwischenraum bleibt unberührt.\n\n‼️ Der Pflug ist nicht per se schlecht: Er ist das wirksamste Mittel gegen Wurzelunkräuter, im Ökolandbau oft unverzichtbar und bei starker Verunkrautung die sicherste Lösung. Sein Nachteil ist der hohe Energiebedarf und die Beschleunigung des Humusabbaus durch die starke Durchlüftung.",
    "related": [
      "mezi-plodiny",
      "eroze-pudy"
    ]
  },
  {
    "slug": "no-till",
    "term": "Direktsaat",
    "alias": [
      "No-Till",
      "Nulltillage",
      "pfluglos"
    ],
    "kategorie": "agrotechnika",
    "shortDef": "Bei der Direktsaat entfällt jede Bodenbearbeitung — die Sämaschine legt das Saatgut unmittelbar in die Stoppel der Vorfrucht ab. Das spart Kraftstoff und schützt vor Erosion.",
    "longDef": "Die Direktsaat (No-Till) verzichtet vollständig auf die Bodenbearbeitung. Gesät wird unmittelbar in die Stoppel oder in die abgestorbene Zwischenfrucht, mit einer **Scheiben- oder Zinkensämaschine**, die einen schmalen Schlitz öffnet.\n\nVorteile:\n- **50 bis 80 % weniger Kraftstoff** gegenüber der Pflugvariante.\n- **Deutlich weniger Erosion** — die Oberfläche bleibt bedeckt.\n- **Humusaufbau** — die Rückstände werden an der Oberfläche umgesetzt statt eingemischt.\n- **Bessere Wasserinfiltration und Tragfähigkeit** — durchgängige Regenwurmgänge bleiben erhalten.\n- **Weniger Arbeitsgänge** — ein Überfahren statt drei bis fünf.\n\nNachteile:\n- **Höherer Herbizidbedarf** — ohne mechanische Unkrautbekämpfung wächst die Abhängigkeit von Glyphosat, was im Ökolandbau Direktsaat praktisch ausschließt.\n- **Langsamere Erwärmung im Frühjahr** — die Mulchauflage hält den Boden kühl, was bei Mais und Zuckerrübe zum Problem werden kann.\n- **Krankheitsdruck** — auf der Oberfläche verbleibende Rückstände sind Infektionsquelle, etwa für Fusariosen nach Mais.\n- **Spezielle Sämaschine nötig** — Horsch Avatar, Väderstad Rapid, John Deere 750A und vergleichbare Maschinen sind eine erhebliche Investition.\n\nIn Mitteleuropa funktioniert Direktsaat am besten auf **trockeneren Standorten mit tragfähigen Böden** — Ostdeutschland, das nördliche Burgenland, das Marchfeld. Auf schweren, kalten und nassen Böden im Voralpenraum stößt sie an Grenzen.\n\nEmpfehlenswert ist ein Einstieg auf **einem Teilschlag über zwei bis drei Jahre**: Im ersten Jahr fällt der Ertrag oft um 5 bis 10 %, danach stabilisiert er sich, und der Bodenzustand verbessert sich über mehrere Jahre spürbar.",
    "related": [
      "orba",
      "eroze-pudy"
    ]
  },
  {
    "slug": "pre-emergence",
    "term": "Vorauflaufbehandlung",
    "alias": [
      "Vorauflauf",
      "VA",
      "pre-emergence"
    ],
    "kategorie": "agrotechnika",
    "shortDef": "Die Vorauflaufbehandlung erfolgt nach der Saat, aber vor dem Auflaufen von Kultur und Unkraut. Sie erfasst keimende Unkräuter, bevor sie sich etablieren.",
    "longDef": "Die Vorauflaufbehandlung (Kürzel VA) ist eine Herbizidstrategie: Das Mittel wird **nach der Saat, aber vor dem Auflaufen** von Kultur und Unkraut ausgebracht. Es legt einen Wirkstofffilm auf den Boden, den die keimenden Unkräuter mit dem Keimling aufnehmen.\n\n**Wichtige Wirkstoffe**:\n- **Pendimethalin** — in Getreide, Raps und Sonnenblume.\n- **Prosulfocarb** — gegen Ackerfuchsschwanz und Windhalm im Getreide.\n- **Flufenacet** — Standard gegen Ungräser im Wintergetreide.\n- **Metribuzin** — in Kartoffeln und Sojabohne.\n- **S-Metolachlor und Terbuthylazin** — in Mais.\n\n**Zeitpunkt und Bedingungen**:\n- **0 bis 3 Tage nach der Saat**, je nach Auflaufgeschwindigkeit.\n- **Der Boden muss feucht sein** — auf trockenem Boden wirkt Vorauflauf kaum, weil der Wirkstoff nicht in die Keimzone gelangt.\n- **Ein feinkrümeliges, rückverfestigtes Saatbett** ist Voraussetzung; auf grobscholligem Boden bleiben Lücken im Wirkstofffilm.\n\nVorteile:\n- **Erfasst 70 bis 90 % der Unkräuter**, bevor sie Konkurrenz ausüben.\n- **Entlastet die Nachauflaufbehandlung** und damit den gesamten Herbizidaufwand.\n- **Wirkt gegen Ungräser**, bei denen Nachauflaufmittel wegen Resistenzen zunehmend versagen — beim Ackerfuchsschwanz ist der Vorauflauf inzwischen das Rückgrat der Bekämpfung.\n\nGrenzen:\n- **Trockenheit** kann die Wirkung völlig ausbleiben lassen.\n- **Verträglichkeit** — bei zu flacher Saat oder Starkregen nach der Anwendung sind Schäden an der Kultur möglich.\n- Die **Zulassung ist national geregelt**; Aufwandmengen, Auflagen zu Abstandsflächen und Anwendungszeitpunkte sind dem jeweils gültigen Register zu entnehmen (Deutschland BVL, Österreich BAES).",
    "related": [
      "orba",
      "roundup"
    ]
  },
  {
    "slug": "osevni-postup",
    "term": "Fruchtfolge",
    "alias": [
      "Fruchtwechsel",
      "Rotation",
      "Anbaufolge"
    ],
    "kategorie": "agrotechnika",
    "shortDef": "Die Fruchtfolge ist der geplante Wechsel der Kulturen auf einem Schlag über mehrere Jahre. Das zentrale Prinzip nachhaltiger Bewirtschaftung — sie verbessert den Boden und mindert Unkraut- und Krankheitsdruck.",
    "longDef": "Die Fruchtfolge ist der planmäßige Wechsel der Kulturen auf demselben Schlag über mehrere Jahre. Sie ist eines der ältesten und zugleich wirksamsten Instrumente des Ackerbaus — bereits die mittelalterliche Dreifelderwirtschaft (Winterung, Sommerung, Brache) folgte diesem Gedanken.\n\n**Eine typische mitteleuropäische Fruchtfolge** über vier Jahre:\n1. **Winterraps** — tiefwurzelnd, gute Vorfrucht, lockert den Boden.\n2. **Winterweizen** — profitiert vom Vorfruchtwert des Rapses.\n3. **Zuckerrübe oder Kartoffeln** — Hackfrucht, unterbricht den Ungrasdruck.\n4. **Sommergerste oder Mais** — schließt den Kreis.\n\nHäufig ergänzt um **Leguminosen** (Erbse, Ackerbohne, Sojabohne) oder mehrjähriges **Feldfutter** (Luzerne, Kleegras), das Stickstoff bindet und den Humusgehalt hebt.\n\n**Die Grundsätze**:\n- **Keine Kultur unmittelbar nach sich selbst** — sonst steigt der Druck bodenbürtiger Krankheiten (Halmbruch und Schwarzbeinigkeit bei Weizen, Kohlhernie bei Raps).\n- **Tief- und Flachwurzler abwechseln** — das erschließt verschiedene Bodenschichten.\n- **Leguminosen einbauen** — sie sparen 30 bis 60 kg N/ha für die Folgefrucht.\n- **Winterungen und Sommerungen mischen** — das bricht den Zyklus spezialisierter Ungräser wie des Ackerfuchsschwanzes.\n\n**Förderrechtlich**:\n- Der **GLÖZ-7-Standard** verlangt den Fruchtwechsel auf Ackerland — auf jedem Schlag muss die Hauptkultur im Jahresvergleich wechseln, mit definierten Ausnahmen.\n- Die Öko-Regelung **ÖR 2** honoriert eine vielfältige Fruchtfolge mit mindestens fünf Hauptkulturen und einem Mindestanteil Leguminosen.\n\n**Die Folgen zu enger Fruchtfolgen**: Kurzfristig kann sich der Anbau der wirtschaftlich stärksten Kultur lohnen. Über fünf bis zehn Jahre sinken die Erträge jedoch um 15 bis 25 %, weil sich Krankheiten, Ungräser und Bodenmüdigkeit aufbauen — ein Effekt, der sich mit Chemie nur teuer und unvollständig auffangen lässt.\n\nEine durchdachte Fruchtfolge ist damit die wirksamste **kostenlose** ackerbauliche Maßnahme überhaupt.",
    "related": [
      "mezi-plodiny",
      "eko-platba",
      "gaec"
    ]
  },
  {
    "slug": "section-control",
    "term": "Teilbreitenschaltung (Section Control)",
    "alias": [
      "Section Control",
      "TC-SC",
      "automatische Teilbreitenschaltung"
    ],
    "kategorie": "precise-farming",
    "shortDef": "Die Teilbreitenschaltung schaltet Sektionen von Feldspritze, Sämaschine oder Düngerstreuer per GPS automatisch ab — am Vorgewende, im Keil und bei Überlappung. Das spart 5 bis 15 % Betriebsmittel.",
    "longDef": "Die automatische Teilbreitenschaltung (ISOBUS-Funktion **TC-SC** — Task Controller Section Control) schaltet einzelne Sektionen eines Geräts anhand der GPS-Position und der bereits behandelten Fläche selbsttätig ab und wieder zu.\n\n**Anwendung**:\n- **Feldspritze** — ein Gestänge von 24 bis 36 m ist in 6 bis 48 Sektionen unterteilt, bei Einzeldüsenschaltung sogar je Düse. Am Vorgewende, im Keil und an unregelmäßigen Schlagrändern schalten die überlappenden Sektionen ab.\n- **Sämaschine** — Abschaltung einzelner Reihen oder Sektionen im bereits gesäten Bereich.\n- **Düngerstreuer** — Grenzstreuen und Anpassung des Streubilds nach Position.\n\n**Wie es funktioniert**:\n1. Der RTK-Empfänger liefert die Position auf wenige Zentimeter genau.\n2. Der Task Controller führt eine **Applikationskarte des bereits Behandelten**.\n3. Beim nächsten Überfahren schaltet er die Sektionen ab, die in bereits behandeltes Gebiet geraten würden.\n\n**Einsparung**:\n- **Feldspritze**: 5 bis 15 % — bei rechteckigen Schlägen am unteren, bei kleinteiligen und unregelmäßigen Flächen am oberen Ende.\n- **Dünger**: 5 bis 10 %.\n- **Saatgut**: 3 bis 8 %.\n\n**Wirtschaftlichkeit** am Beispiel eines Betriebs mit 200 ha: Bei Pflanzenschutzkosten von etwa 250 €/ha und 10 % Einsparung ergeben sich rund 5 000 € im Jahr. Dem stehen die Kosten der Nachrüstung und der ISOBUS-Lizenz gegenüber — die Amortisation liegt typischerweise bei zwei bis fünf Jahren.\n\nÜber die reine Kostenersparnis hinaus verringert die Teilbreitenschaltung Überdosierungen und damit das Risiko von Rückständen und Kulturschäden — ein zunehmend wichtiges Argument gegenüber Behörden und Abnehmern.",
    "related": [
      "isobus",
      "gps-rtk",
      "variable-rate"
    ]
  },
  {
    "slug": "leasing-vs-uver",
    "term": "Leasing und Darlehen",
    "alias": [
      "Finanzierungsleasing",
      "Operating Leasing",
      "Investitionsdarlehen"
    ],
    "kategorie": "dotace",
    "shortDef": "Leasing und Darlehen sind die beiden Wege, eine Maschine zu finanzieren. Leasing ist die Nutzungsüberlassung gegen Rate, das Darlehen ein Bankkredit — sie unterscheiden sich in Eigentum, Bilanzwirkung und Flexibilität.",
    "longDef": "Für die Finanzierung von Landmaschinen stehen im Wesentlichen drei Wege offen:\n\n**Finanzierungsleasing** — die Leasinggesellschaft bleibt Eigentümerin, der Betrieb zahlt Raten und übernimmt die Maschine am Ende zum Restwert.\n\n**Operating Leasing (Mietkauf ohne Übernahme)** — reine Nutzungsüberlassung über drei bis fünf Jahre, die Maschine geht danach zurück. Der Betrieb trägt kein Restwertrisiko.\n\n**Investitionsdarlehen** — ein klassischer Bankkredit; die Maschine gehört sofort dem Betrieb und dient als Sicherheit.\n\n| | Finanzierungsleasing | Operating Leasing | Darlehen |\n|---|---|---|---|\n| **Eigentum während der Laufzeit** | Leasinggeber | Leasinggeber | Betrieb |\n| **Eigentum danach** | Betrieb (Restwert) | Leasinggeber | Betrieb |\n| **Bilanz** | je nach Gestaltung außerhalb | außerhalb | aktiviert, Abschreibung |\n| **Anzahlung** | 0 bis 30 % | 0 bis 30 % | 0 bis 20 % |\n| **Restwertrisiko** | beim Betrieb | beim Leasinggeber | beim Betrieb |\n| **Laufzeit** | 24 bis 84 Monate | 24 bis 60 Monate | 12 bis 96 Monate |\n| **Flexibilität** | gering, Vorfälligkeit teuer | gering | höher, Umschuldung möglich |\n\n**Zur Einordnung**:\n- Das **Finanzierungsleasing** ist in der Landwirtschaft der häufigste Weg — planbare Raten, kein Eigenkapitaleinsatz.\n- Das **Darlehen** lohnt bei hohem Eigenkapitalanteil und langfristig genutzten Maschinen, weil die Gesamtzinslast meist niedriger liegt.\n- Das **Operating Leasing** passt für Lohnunternehmen, die Maschinen intensiv nutzen und regelmäßig erneuern.\n\n**Förderdarlehen** sollten stets geprüft werden: In Deutschland bietet die **Rentenbank** zinsverbilligte Programme für Landwirtschaft, Wachstum und Energieeffizienz, in Österreich gibt es die **Agrarinvestitionskredite (AIK)** mit Zinsenzuschuss. Beide liegen regelmäßig unter den Konditionen der Herstellerbanken.\n\n**Herstellerfinanzierung** (John Deere Financial, CNH Capital, AGCO Finance) wirbt häufig mit Aktionszinsen auf Neumaschinen. Der niedrige Zins wird jedoch gelegentlich über einen geringeren Nachlass auf den Kaufpreis gegenfinanziert — beides sollte deshalb immer zusammen verhandelt und gegen ein Bankangebot gerechnet werden.",
    "related": [
      "cap-2024"
    ]
  },
  {
    "slug": "rolnicke-pravidla-silnicni",
    "term": "Straßenverkehrsregeln für Traktoren",
    "alias": [
      "StVZO",
      "Überbreite",
      "Hauptuntersuchung",
      "Führerschein T"
    ],
    "kategorie": "regulace",
    "shortDef": "Auf öffentlichen Straßen gelten für Traktoren Grenzen bei Breite, Höhe und Länge, Kennzeichnungspflichten für Anbaugeräte sowie eigene Führerscheinklassen und Untersuchungsfristen.",
    "longDef": "Der Betrieb von Traktoren auf öffentlichen Straßen ist in **Deutschland** über StVZO und StVO geregelt, in **Österreich** über das Kraftfahrgesetz (KFG).\n\n**Abmessungen (Deutschland)**:\n- **Breite**: allgemein 2,55 m; für land- und forstwirtschaftliche Fahrzeuge und Anbaugeräte sind unter Auflagen **bis 3,00 m** zulässig. Darüber ist eine **Ausnahmegenehmigung** nach § 70 StVZO beziehungsweise § 29 StVO erforderlich, ab etwa 3,50 m kommen Begleitfahrzeuge hinzu.\n- **Höhe**: 4,00 m.\n- **Länge**: Zug mit Anhänger bis 18,00 m; darüber hinaus gelten Sonderregelungen.\n\nIn **Österreich** liegt die Grenze ebenfalls bei 2,55 m, für landwirtschaftliche Fahrzeuge sind 3,00 m zulässig; darüber braucht es eine Bewilligung nach § 104 KFG.\n\n**Kennzeichnung überbreiter Geräte**:\n- **Warntafeln** nach DIN 11030 — rot-weiß schraffiert, an den äußeren Begrenzungen.\n- **Begrenzungsleuchten** und Rückstrahler, bei Dunkelheit und schlechter Sicht zwingend.\n- **Rundumkennleuchte** für Fahrzeuge mit Überbreite.\n- Der Sichtbereich des Fahrers darf nicht durch Frontanbaugeräte verdeckt werden — andernfalls sind Spiegel oder eine Einweisung nötig.\n\n**Führerscheinklassen (Deutschland)**:\n- **Klasse L** — Zugmaschinen bis 40 km/h bauartbedingter Höchstgeschwindigkeit im land- und forstwirtschaftlichen Einsatz, ab 16 Jahren.\n- **Klasse T** — Zugmaschinen bis 60 km/h, ab 16 Jahren (bis 40 km/h) beziehungsweise 18 Jahren.\nIn **Österreich** entspricht dem die **Klasse F**.\n\n**Technische Überwachung**:\n- In **Deutschland** sind land- und forstwirtschaftliche Zugmaschinen **bis 40 km/h von der wiederkehrenden Hauptuntersuchung befreit**; über 40 km/h ist sie alle zwei Jahre fällig. Anhänger unterliegen eigenen Fristen.\n- In **Österreich** gilt die **wiederkehrende Begutachtung nach § 57a KFG** („Pickerl\") auch für Zugmaschinen, mit eigenen Intervallen.\n\n**Versicherung**: Eine Kfz-Haftpflicht ist Pflicht; grüne Kennzeichen kennzeichnen in Deutschland die steuerbefreite land- und forstwirtschaftliche Nutzung — sie ist an diesen Zweck gebunden, gewerbliche Fahrten sind damit unzulässig.\n\n‼️ Die Angaben sind ein Überblick. Maßgeblich sind die jeweils geltenden Fassungen von StVZO, StVO und KFG sowie die Auflagen der zuständigen Straßenverkehrsbehörde.",
    "related": [
      "allwheel-drive",
      "duala"
    ]
  },
  {
    "slug": "ozim-jarin",
    "term": "Winterung und Sommerung",
    "alias": [
      "Winterfrucht",
      "Sommerfrucht",
      "Winterung",
      "Sommerung"
    ],
    "kategorie": "agrotechnika",
    "shortDef": "Winterungen werden im Herbst gesät, Sommerungen im Frühjahr. Winterungen nutzen die Winterfeuchte und bringen höhere Erträge, Sommerungen haben einen kürzeren Zyklus und ein höheres Trockenheitsrisiko.",
    "longDef": "Die Kulturen werden nach dem Saatzeitpunkt unterschieden:\n\n**Winterungen** (Aussaat September bis Oktober):\n- **Winterweizen** — die wichtigste Getreideart Mitteleuropas.\n- **Wintergerste** — früh räumend, gute Vorfrucht für Raps.\n- **Winterraps** — die bedeutendste Ölfrucht.\n- **Winterroggen** — verträgt leichte, trockene Standorte.\n- **Triticale** — Kreuzung aus Weizen und Roggen, robust und anspruchslos.\n\nVorteile der Winterungen:\n- Sie nutzen die **Winterfeuchte** und liefern dadurch stabilere Erträge.\n- **Frühere Ernte** (Juli) — das schafft Zeit für Zwischenfrüchte.\n- **15 bis 30 % höherer Ertrag** als die entsprechende Sommerung.\n- Bessere Bodenbedeckung über den Winter, was dem GLÖZ-6-Standard entgegenkommt.\n\nRisiken: **Auswinterung** in schneearmen Kahlfrösten, **Schneckenfraß** im feuchten Herbst sowie ein höherer Krankheitsdruck durch die lange Vegetationszeit.\n\n**Sommerungen** (Aussaat März bis Mai):\n- **Sommergerste** — die bevorzugte Braugerste.\n- **Sommerweizen** — Nischenkultur, oft als Ersatz nach Auswinterung.\n- **Mais** — als Körner- und Silomais.\n- **Sojabohne und Sonnenblume** — Sommerölfrüchte mit wachsender Bedeutung.\n- **Kartoffeln und Zuckerrübe** — Hackfrüchte.\n- **Erbse und Ackerbohne** — Körnerleguminosen.\n\nVorteile der Sommerungen:\n- **Kurzer Zyklus** von drei bis vier Monaten.\n- **Flexibilität** — die Anbauentscheidung fällt erst im Frühjahr, näher am Markt.\n- **Kein Auswinterungsrisiko.**\n- Sie brechen den Zyklus von Ungräsern, die auf Winterungen spezialisiert sind — beim Ackerfuchsschwanz ein zentrales Instrument.\n\nRisiken: **Frühsommertrockenheit** im Mai und Juni kann den Ertrag stark drücken, und die Arbeitsspitzen ballen sich in kurzer Zeit.\n\nIn der Praxis überwiegen in Mitteleuropa die Winterungen mit etwa zwei Dritteln der Ackerfläche; der Anteil der Sommerungen steigt dort, wo Resistenzen bei Ungräsern zum Fruchtwechsel zwingen.",
    "related": [
      "osevni-postup",
      "orba"
    ]
  },
  {
    "slug": "lav-can",
    "term": "Kalkammonsalpeter (KAS)",
    "alias": [
      "KAS",
      "CAN",
      "Calcium Ammonium Nitrate",
      "Ammonsalpeter"
    ],
    "kategorie": "hnojivo",
    "shortDef": "Kalkammonsalpeter (KAS) ist ein granulierter Stickstoffdünger mit 27 % N und einem Kalkanteil. Der meistverwendete Stickstoffdünger in Mitteleuropa — rasch wirksam und lagersicher.",
    "longDef": "Kalkammonsalpeter (KAS, englisch CAN — Calcium Ammonium Nitrate) ist der Standard-Stickstoffdünger im deutschsprachigen Raum. Er enthält **27 % N**, davon je zur Hälfte Nitrat (NO₃⁻) und Ammonium (NH₄⁺), dazu etwa 12 % CaO und teilweise MgO aus dem Kalk- beziehungsweise Dolomitanteil.\n\nVorteile gegenüber Harnstoff:\n- **Sofortige Wirkung** — die Nitrathälfte ist unmittelbar pflanzenverfügbar, ohne Umsetzung im Boden.\n- **Keine Ausgasungsverluste** — anders als Harnstoff entweicht kein Ammoniak, eine Einarbeitung ist nicht nötig. Damit erfüllt KAS die Anforderungen der Düngeverordnung ohne Zusatzmaßnahmen.\n- **Wirkt auch bei Trockenheit** — Harnstoff braucht Feuchtigkeit für die Hydrolyse, KAS nicht.\n- **Lagersicher** — der Kalkanteil macht ihn im Gegensatz zu reinem Ammonnitrat nicht brand- und explosionsfördernd. Die Lagerung unterliegt dennoch der Gefahrstoffverordnung: getrennt von Brennbarem, kühl und trocken.\n\nAnwendung:\n- **Frühjahrsgabe zu Wintergetreide** — 200 bis 400 kg/ha, entsprechend 54 bis 108 kg N/ha, meist in zwei bis drei Teilgaben.\n- **Kopfdüngung zu Mais und Sommerungen** — 150 bis 250 kg/ha.\n- **Grünlanddüngung** nach jedem Schnitt.\n\nPreislich liegt KAS je Kilogramm Stickstoff etwa 10 bis 20 % über Harnstoff, gleicht das aber durch die geringeren Verluste und den Wegfall der Einarbeitung häufig aus. Die Bezugspreise bewegen sich je nach Marktlage bei etwa 300 bis 450 €/t.\n\nZu beachten: Die Ausbringmenge ist über die **Düngebedarfsermittlung** nach Düngeverordnung zu begrenzen; in nitratbelasteten Gebieten (roten Gebieten) gelten zusätzlich 20 % Abschlag und verschärfte Sperrfristen.",
    "related": [
      "mocovina",
      "npk-hnojivo",
      "pH-pudy"
    ]
  },
  {
    "slug": "dam-390",
    "term": "AHL (Ammoniumnitrat-Harnstoff-Lösung)",
    "alias": [
      "AHL",
      "UAN",
      "Flüssigdünger",
      "DAM"
    ],
    "kategorie": "hnojivo",
    "shortDef": "AHL ist ein flüssiger Stickstoffdünger mit 28 bis 32 % N aus Harnstoff, Ammonnitrat und Wasser. Ausgebracht wird er mit der Feldspritze — schnell, gleichmäßig und staubfrei.",
    "longDef": "Die Ammoniumnitrat-Harnstoff-Lösung (AHL, englisch UAN) ist der verbreitetste Flüssigdünger Europas. Übliche Handelsformen sind **AHL 28** und **AHL 32** mit 28 beziehungsweise 32 % N. Die Zusammensetzung besteht etwa zur Hälfte aus Harnstoff, zu einem Viertel aus Ammonnitrat und zu einem Viertel aus Wasser — der Stickstoff liegt damit in drei Formen vor: Amid, Ammonium und Nitrat.\n\nAusbringung:\n- **Feldspritze mit Schleppschläuchen oder Mehrlochdüsen** — niemals mit gewöhnlichen Flachstrahldüsen, weil die feine Verteilung auf dem Blatt Verätzungen verursacht.\n- **Aufwandmenge** 100 bis 250 l/ha, entsprechend etwa 35 bis 90 kg N/ha.\n- **Zeitpunkte**: Frühjahrsgaben zu Getreide, Kopfdüngung, dazu Blattdüngung in stark verdünnter Form.\n\nVorteile:\n- **Sehr gleichmäßige Verteilung** — keine Streubildabweichungen wie beim Düngerstreuer, besonders wertvoll bei großen Arbeitsbreiten.\n- **Hohe Schlagkraft** — mit einer 30-m-Spritze sind über 100 ha am Tag möglich.\n- **Tankmischung** mit Pflanzenschutzmitteln und Mikronährstoffen möglich, was Überfahrten spart.\n- **Kein Staub und keine Sackware** — Lagerung im IBC oder im Hoftank.\n\nNachteile und Auflagen:\n- **Verätzungsgefahr** bei Temperaturen über etwa 20 °C, praller Sonne oder taunassem Bestand.\n- **Korrosiv** — eigene Tanks, Pumpen und Leitungen sind nötig, Edelstahl oder geeigneter Kunststoff.\n- ‼️ **Ausbringtechnik ist vorgeschrieben**: Die Düngeverordnung verlangt für flüssige Stickstoffdünger eine streifenförmige Ablage; bei der Lagerung greifen die Anforderungen an Anlagen zum Umgang mit wassergefährdenden Stoffen (AwSV), also Auffangwanne und Anzeigepflicht.\n\nJe Einheit Stickstoff ist AHL meist etwas günstiger als granulierte Dünger; die Investition in Tank und Ausbringtechnik amortisiert sich ab mittlerer Betriebsgröße.",
    "related": [
      "mocovina",
      "lav-can",
      "npk-hnojivo"
    ]
  },
  {
    "slug": "vapneni",
    "term": "Kalkung",
    "alias": [
      "Kalken",
      "Erhaltungskalkung",
      "Gesundungskalkung"
    ],
    "kategorie": "agrotechnika",
    "shortDef": "Die Kalkung bringt kalkhaltige Stoffe in den Boden ein, um den pH-Wert anzuheben und Calcium zu ergänzen. Eine langfristige Grundlage der Bodenfruchtbarkeit — je nach pH alle vier bis acht Jahre.",
    "longDef": "Die Kalkung dient drei Zielen zugleich:\n1. **Anhebung des pH-Werts** in den für die Kultur optimalen Bereich.\n2. **Ergänzung von Calcium** als Nährstoff — die Pflanzen entziehen jährlich mehrere Dutzend Kilogramm je Hektar, dazu kommen Auswaschungsverluste.\n3. **Verbesserung des Bodengefüges** — Calcium verkittet die Tonteilchen zu stabilen Krümeln, was Verschlämmung und Erosion mindert.\n\nDie wichtigsten Kalkformen:\n- **Kohlensaurer Kalk (CaCO₃)** — der Standard, günstig und mild, Wirkung über mehrere Monate; Aufwand 2 bis 6 t/ha.\n- **Kohlensaurer Magnesiumkalk (Dolomit)** — für magnesiumarme Böden.\n- **Branntkalk (CaO)** — schnell und aggressiv wirksam, Aufwand 0,8 bis 2,5 t/ha; er verbessert zugleich die Krümelstruktur schwerer Böden, darf aber nicht auf junge Bestände.\n- **Mischkalk und Konverterkalk** — Nebenprodukte der Stahlerzeugung, oft mit Spurennährstoffen.\n- **Carbokalk** — Rückstand der Zuckererzeugung, günstig und mit organischer Substanz.\n\nWann gekalkt wird:\n- Die **Bodenuntersuchung alle vier bis sechs Jahre** liefert pH-Wert und Bodenart — beide zusammen bestimmen den Bedarf, denn ein Sandboden braucht bei gleichem pH deutlich weniger Kalk als ein Tonboden.\n- **Unter pH 5,5** ist eine Gesundungskalkung fällig, aufgeteilt auf zwei Gaben in aufeinanderfolgenden Jahren.\n- **Im Optimalbereich** genügt die Erhaltungskalkung, die lediglich Entzug und Auswaschung ausgleicht.\n- **Über dem Optimum** wird nicht gekalkt — zu hohe pH-Werte blockieren die Aufnahme von Mangan, Zink und Bor.\n\nDer beste Zeitpunkt ist der Sommer nach der Ernte auf der Stoppel, mit anschließender flacher Einarbeitung. Kalk sollte nicht gemeinsam mit Harnstoff oder Gülle ausgebracht werden — das begünstigt Ammoniakverluste.\n\nWirtschaftlich zählt die Kalkung zu den lohnendsten Maßnahmen überhaupt: Eine Anhebung um 0,5 pH-Einheiten bringt auf versauerten Standorten regelmäßig 5 bis 15 % Mehrertrag, bei überschaubaren Kosten von etwa 150 bis 400 €/ha je Gabe.",
    "related": [
      "pH-pudy",
      "organicka-hmota"
    ]
  },
  {
    "slug": "pluh",
    "term": "Pflug (Bauarten und Kennwerte)",
    "alias": [
      "Drehpflug",
      "Anbaupflug",
      "Aufsattelpflug"
    ],
    "kategorie": "technologie",
    "shortDef": "Der Pflug wendet den Boden in 20 bis 35 cm Tiefe. Es gibt Anbau-, Aufsattel- und gezogene Ausführungen mit 2 bis 12 Scharen, heute nahezu durchgängig als Drehpflug.",
    "longDef": "Der Pflug ist das klassische Gerät der wendenden Grundbodenbearbeitung.\n\n**Nach der Anbauart**:\n- **Anbaupflug** — vollständig im Dreipunkt getragen, bis etwa fünf Schare, für Traktoren von 80 bis 150 PS.\n- **Aufsattelpflug** — das hintere Ende stützt sich auf einem eigenen Rad ab, fünf bis acht Schare, für 130 bis 220 PS.\n- **Gezogener Pflug** — vollständig auf eigenen Rädern, acht bis zwölf Schare, ab etwa 250 PS.\n\n**Nach der Arbeitsweise**:\n- **Beetpflug** — wendet nur in eine Richtung und hinterlässt Beete und Furchen. Heute die Ausnahme.\n- **Drehpflug (Volldrehpflug)** — der Pflugkörper dreht sich am Vorgewende um 180°, sodass in beiden Fahrtrichtungen zur selben Seite gewendet wird. Das ergibt eine ebene Fläche ohne Beete und ist heute Standard.\n- **Vario-Pflug** — die Arbeitsbreite je Schar lässt sich während der Fahrt zwischen etwa 30 und 55 cm verstellen. Das erlaubt die Anpassung an Bodenart, Zugkraft und Schlagform.\n\n**Kennwerte**:\n- **Scharzahl** — 3 (leicht), 4 bis 5 (mittel), 6 bis 8 (schwer), 8 bis 12 (sehr schwer).\n- **Arbeitsbreite je Schar** — 35 bis 55 cm; die Gesamtbreite ergibt sich aus Scharzahl mal Breite.\n- **Arbeitstiefe** — 20 bis 35 cm, hydraulisch oder mechanisch eingestellt.\n- **Steinsicherung** — mechanisch über Scherbolzen oder hydraulisch (Non-Stop); auf steinigen Böden ist die hydraulische Variante ihren Aufpreis wert.\n\n**Wichtige Hersteller**: Lemken (Juwel, EurOpal), Pöttinger (Servo), Kverneland, Kuhn (Vari-Master), Amazone (Cayron), Vogel & Noot.\n\nZur Einordnung der Zugkraft gilt als Faustregel etwa **30 bis 40 PS je Schar**, je nach Bodenart und Arbeitstiefe. Ein zu schwacher Traktor führt zu Schlupf, hohem Kraftstoffverbrauch und Bodenverdichtung durch wiederholtes Durchdrehen.",
    "related": [
      "orba",
      "tribod",
      "no-till"
    ]
  },
  {
    "slug": "kompaktomat",
    "term": "Saatbettkombination",
    "alias": [
      "Kompaktor",
      "Kreiselegge",
      "Scheibenegge-Kombination"
    ],
    "kategorie": "technologie",
    "shortDef": "Die Saatbettkombination vereint mehrere Werkzeuge in einem Gerät — Scheiben oder Zinken, Krümler und Packerwalze — und bereitet das Saatbett in einer Überfahrt.",
    "longDef": "Die Saatbettkombination fasst mehrere Arbeitsschritte in einem Gerät zusammen: **Scheiben oder Zinken, Krümler und eine rückverfestigende Walze**. Ziel ist ein fertiges Saatbett in einer einzigen Überfahrt.\n\n**Typische Arbeitsbreite**: 3 bis 8 m, passend zu Traktoren von 100 bis 250 PS.\n\n**Der Aufbau von vorn nach hinten**:\n1. **Scheiben** (40 bis 55 cm Durchmesser) oder **Zinken** — sie schneiden Ernterückstände und lockern 5 bis 15 cm tief.\n2. **Tiefenlockerungszinken** (optional) — brechen Verdichtungen unterhalb der Bearbeitungssohle.\n3. **Krümelwalzen und Striegel** — zerkleinern Kluten und ebnen ein.\n4. **Packerwalze** (Crosskill, Keilring, Cambridge) — verfestigt rück und stellt den kapillaren Anschluss zum Unterboden her, damit das Saatgut Wasser bekommt.\n\n**Einsatz**:\n- **Saatbettbereitung** — ersetzt Egge, Krümler und Walze in einem Gang.\n- **Stoppelbearbeitung** unmittelbar nach der Ernte, um Ausfallgetreide zum Keimen zu bringen.\n- **Ersatz des Pfluges** im Mulchsaatverfahren.\n\nVorteile: eine Überfahrt statt drei bis vier, dadurch 40 bis 60 % weniger Kraftstoff, deutlich höhere Flächenleistung und weniger Verdichtung durch wiederholte Überfahrten.\n\n**Wichtige Hersteller**: Horsch (Terrano, Joker, Tiger), Lemken (Karat, Heliodor, Kompaktor), Väderstad (Carrier, TopDown, NZ), Amazone (Catros, Certos), Köckerling (Allrounder, Quadro), Kuhn (Optimer, Performer), Pöttinger (Terradisc, Synkro).\n\nZur Abgrenzung: Die **Kreiselegge** ist ein zapfwellengetriebenes Gerät, das den Boden aktiv durchmischt — sie liefert das feinste Saatbett, braucht aber viel Leistung. Passive Kombinationen sind sparsamer und schneller, hinterlassen aber eine gröbere Struktur.",
    "related": [
      "orba",
      "no-till",
      "organicka-hmota"
    ]
  },
  {
    "slug": "mulcovac",
    "term": "Mulchgerät (Mulcher)",
    "alias": [
      "Schlegelmulcher",
      "Sichelmulcher",
      "Mulcher"
    ],
    "kategorie": "technologie",
    "shortDef": "Das Mulchgerät zerkleinert Pflanzenmasse — Stoppeln, Ernterückstände, Aufwuchs und leichtes Gehölz. Angetrieben über die Zapfwelle, angebaut im Dreipunkt.",
    "longDef": "Der Mulcher zerkleinert Pflanzenmasse mit rotierenden Schlegeln oder Messern und legt sie gleichmäßig auf der Fläche ab.\n\n**Zwei Bauarten**:\n- **Schlegelmulcher** — waagerechte Welle mit pendelnd aufgehängten Schlegeln. Er zerkleinert sehr fein, arbeitet auch in dichtem Aufwuchs und ist der Standard für Stoppeln und Ernterückstände.\n- **Sichelmulcher** — senkrechte Wellen mit frei schwingenden Messern. Er braucht weniger Leistung und arbeitet schneller, zerkleinert aber gröber. Verbreitet in der Landschaftspflege und im Grünland.\n\n**Arbeitsbreiten**:\n- **1,2 bis 2 m** — Obst- und Weinbau, Kommunaltechnik.\n- **2,5 bis 4 m** — Ackerbau.\n- **4 bis 8 m** — Großbetriebe und Lohnunternehmen, meist als Klappausführung.\n\n**Einsatz**:\n- **Stoppelmulchen** nach der Getreideernte — beschleunigt den Strohabbau und regt Ausfallgetreide zum Keimen an.\n- **Grünlandpflege** — Nachmulchen von Weideresten und Geilstellen, ein bis zwei Mal jährlich.\n- **Zwischenfrüchte** vor der Einarbeitung.\n- **Maisstoppeln** — das feine Zerschlagen der Stängel ist die wirksamste Maßnahme gegen den **Maiszünsler** und mindert zugleich das Fusariumrisiko der Folgefrucht. In mehreren Regionen ist die Stoppelbearbeitung nach Mais deshalb behördlich vorgeschrieben.\n- **Blühflächen und Brachen** — der vorgeschriebene Pflegeschnitt, außerhalb der Brut- und Setzzeit.\n\n**Antrieb**: Zapfwelle mit 540 oder 1 000 min⁻¹, Leistungsbedarf je nach Breite etwa 40 bis 150 PS.\n\n**Wichtige Hersteller**: Müthing, Maschio Gaspardo, Kuhn, Berti, Vogel & Noot, Fella.\n\n‼️ Sicherheit: Mulcher schleudern Steine mit hoher Energie fort. Der Schutzbehang muss vollständig sein, und Personen dürfen sich nicht im Gefahrenbereich aufhalten.",
    "related": [
      "pto",
      "tribod",
      "orba"
    ]
  },
  {
    "slug": "naves-sklapeci",
    "term": "Kipper (Muldenkipper)",
    "alias": [
      "Dreiseitenkipper",
      "Muldenkipper",
      "Anhänger"
    ],
    "kategorie": "technologie",
    "shortDef": "Der Kipper ist der zentrale Transportanhänger der Landwirtschaft, hydraulisch kippbar — als Dreiseitenkipper nach hinten und zu beiden Seiten.",
    "longDef": "Der Kipper ist die wichtigste Transporteinheit im landwirtschaftlichen Betrieb. Der **Dreiseitenkipper** kann nach hinten und zu beiden Seiten abkippen, der **Hinterkipper** nur nach hinten — dafür ist er günstiger und bei großen Nutzlasten stabiler.\n\n**Nutzlastklassen**:\n- **8 t** — Einachser für kleinere Betriebe, ab etwa 80 PS.\n- **12 bis 16 t** — Tandem, der Standard mittlerer Betriebe, ab etwa 130 PS.\n- **18 bis 24 t** — Tandem oder Tridem für Großbetriebe, ab etwa 180 PS.\n- **über 24 t** — Lohnunternehmen und Erntelogistik.\n\n**Bauweise**:\n- **Mulde** aus Stahl oder Aluminium; Aluminium spart mehrere hundert Kilogramm Eigengewicht.\n- **Achsen** — Einzelachse, Tandem oder Tridem; ab drei Achsen meist mit Zwangs- oder Nachlauflenkung, die den Reifenverschleiß und die Narbenschäden im Grünland deutlich mindert.\n- **Bremsen** — Druckluft ist ab mittleren Nutzlasten Standard; für Straßenfahrten über 40 km/h sind zusätzliche Anforderungen zu erfüllen.\n- **Hydraulik** — Kippzylinder sowie Bedienung von Bordwänden und Rückwand.\n\n**Einsatz**: Abfuhr von Getreide vom Mähdrescher, Transport von Silage, Hackfrüchten, Dünger und Kalk sowie Erd- und Schüttguttransport.\n\n**Wichtige Hersteller**: Krampe, Fliegl, Brantner, Joskin, Strautmann, Hawe, Annaburger.\n\n‼️ Zur Straßenzulassung: Maßgeblich sind das **zulässige Gesamtgewicht**, die **Stützlast** der Anhängung und die **bauartbedingte Höchstgeschwindigkeit** (25, 40 oder 60 km/h). Ein überladener Kipper ist der häufigste Beanstandungsgrund bei Kontrollen — und bei einem Unfall entfällt der Versicherungsschutz.",
    "related": [
      "pto",
      "tribod"
    ]
  },
  {
    "slug": "kukurice-silazni",
    "term": "Silomais",
    "alias": [
      "Silomais",
      "Ganzpflanzensilage",
      "Maissilage"
    ],
    "kategorie": "plodiny",
    "shortDef": "Silomais wird als ganze Pflanze geerntet — Kolben, Stängel und Blätter — noch unreif gehäckselt und siliert. Das wichtigste Grundfutter der Rinderhaltung und ein Hauptsubstrat der Biogaserzeugung.",
    "longDef": "Silomais wird als **Ganzpflanze** geerntet, im Unterschied zum Körnermais, bei dem nur das Korn gedroschen wird. Er ist das wichtigste Grundfutter in der Rinderhaltung und zugleich das meistgenutzte Substrat in Biogasanlagen.\n\n**Anbau**:\n- **Saat**: Ende April bis Mitte Mai, sobald der Boden in 5 cm Tiefe etwa 8 bis 10 °C erreicht.\n- **Saatstärke**: 85 000 bis 110 000 Körner/ha.\n- **Düngung**: 150 bis 200 kg N/ha, dazu Phosphat und Kalium; Mais verwertet organische Dünger besonders gut, Gülle und Gärreste decken einen großen Teil des Bedarfs.\n- **Pflanzenschutz**: Vorauflauf gegen keimende Unkräuter, bei Bedarf Nachauflauf; regional Bekämpfung des Maiszünslers mit Trichogramma-Schlupfwespen oder Insektiziden.\n- **Ernte**: Mitte September bis Oktober bei **32 bis 35 % Trockenmasse** der Gesamtpflanze — das ist das Fenster für eine stabile Silierung.\n\n**Erträge**: 40 bis 60 t Frischmasse je Hektar, entsprechend 14 bis 20 t Trockenmasse.\n\n**Ernte und Silierung**:\n- **Selbstfahrender Feldhäcksler** (Claas Jaguar, John Deere 8000/9000, New Holland FR, Krone BiG X) — er häckselt, bricht das Korn im **Corncracker** auf und bläst das Gut auf den Transportwagen.\n- **Häcksellänge** 6 bis 20 mm je nach Trockenmasse und Verwendung.\n- **Silo** — das Gut wird im Fahrsilo in dünnen Schichten verteilt und intensiv verdichtet; entscheidend ist der **Luftabschluss**, weil jede verbleibende Luft zu Nacherwärmung und Verlusten führt.\n- **Abdeckung** mit Unterzieh- und Silofolie, beschwert mit Sandsäcken oder Reifen.\n- **Gärung** über vier bis sechs Wochen zu einem stabilen, milchsauren Futter.\n\nDas Kornaufschließen ist qualitätsentscheidend: Nicht aufgebrochene Körner werden vom Rind unverdaut ausgeschieden — die Kontrolle des Häckselguts während der Ernte gehört deshalb zur Routine.",
    "related": [
      "osevni-postup",
      "orba"
    ]
  },
  {
    "slug": "repka-ozima",
    "term": "Winterraps",
    "alias": [
      "Raps",
      "Ölsaat",
      "oilseed rape"
    ],
    "kategorie": "plodiny",
    "shortDef": "Winterraps ist die wichtigste Ölfrucht Mitteleuropas. Er liefert 3,5 bis 4,5 t/ha und wird zu Speiseöl, Biodiesel und Rapsschrot als Eiweißfuttermittel verarbeitet.",
    "longDef": "Winterraps (Brassica napus) ist die bedeutendste Ölfrucht des deutschsprachigen Raums. In **Deutschland** stehen rund 1,1 Millionen Hektar Raps, in **Österreich** etwa 40 000 Hektar — dort begrenzen Klima und Fruchtfolge die Fläche stärker.\n\n**Anbau**:\n- **Saat**: Mitte August bis Anfang September. Das Zeitfenster ist eng — jede Woche Verspätung kostet Ertrag, weil der Bestand vor Winter eine kräftige Blattrosette und eine ausreichend dicke Wurzel bilden muss.\n- **Saatstärke**: 30 bis 45 Körner/m² bei Hybriden, mehr bei Liniensorten.\n- **Düngung**: Phosphat und Kalium im Herbst; im Frühjahr 150 bis 200 kg N/ha in zwei Gaben, dazu Schwefel, den Raps in großen Mengen braucht.\n- **Pflanzenschutz**: Im Herbst gegen **Rapserdfloh** und **Schnecken**, dazu Wachstumsregler und Fungizid gegen die Wurzelhals- und Stängelfäule; im Frühjahr gegen **Rapsglanzkäfer** und **Stängelrüssler** sowie zur Blüte gegen **Weißstängeligkeit** und Alternaria.\n- **Ernte**: Ende Juni bis Ende Juli mit dem Rapsschneidwerk (verlängerter Tisch mit Seitenmessern), um Ausfall zu mindern.\n\n**Erträge**: im Mittel 3,5 t/ha, auf guten Standorten 4,5 t/ha und mehr.\n\n**Verwertung**: Etwa 60 % gehen in die Biodieselerzeugung, der Rest in Speiseöl. Als Koppelprodukt fällt **Rapsschrot** an — nach Soja das wichtigste heimische Eiweißfuttermittel, was den Raps auch futterbaulich wertvoll macht.\n\n**Vorfruchtwert**: Raps ist eine ausgezeichnete Vorfrucht für Weizen — die tiefe Pfahlwurzel erschließt den Unterboden, und die frühe Ernte lässt Zeit für die Bestellung. Der Weizen nach Raps bringt regelmäßig 5 bis 10 % Mehrertrag gegenüber Weizen nach Weizen.\n\n**Aktuelle Herausforderungen**: Seit dem EU-weiten Verbot der neonikotinoiden Beizen ist der Rapserdfloh im Herbst deutlich schwerer zu beherrschen, und bei den Behandlungen im Frühjahr nehmen Resistenzen zu. Der Anbau ist dadurch riskanter geworden — bei Preisen von rund 400 bis 500 €/t bleibt Raps dennoch eine der wirtschaftlich stärksten Ackerkulturen.",
    "related": [
      "osevni-postup",
      "ozim-jarin",
      "orba"
    ]
  },
  {
    "slug": "sojaova-bob",
    "term": "Sojabohne",
    "alias": [
      "Soja",
      "Glycine max",
      "soybean"
    ],
    "kategorie": "plodiny",
    "shortDef": "Die Sojabohne ist die weltweit wichtigste Körnerleguminose. In Mitteleuropa eine wachsende Kultur mit hohem Eiweißgehalt (40 %), die Luftstickstoff bindet.",
    "longDef": "Die Sojabohne (Glycine max) ist die bedeutendste Eiweiß- und Ölpflanze der Welt. Im deutschsprachigen Raum wächst die Fläche seit Jahren — **Österreich** ist mit rund 90 000 Hektar einer der größten Sojaerzeuger der EU, in **Deutschland** stehen etwa 45 000 Hektar, überwiegend in Bayern und Baden-Württemberg.\n\n**Anbau**:\n- **Saat**: Ende April bis Mitte Mai, sobald der Boden 10 °C erreicht. Sojabohne ist frostempfindlich.\n- **Saatstärke**: 55 bis 70 Körner/m², etwa 110 bis 140 kg/ha.\n- ‼️ **Impfung ist zwingend**: Das Saatgut muss mit *Bradyrhizobium japonicum* geimpft werden. Diese Knöllchenbakterien kommen in mitteleuropäischen Böden nicht natürlich vor — ohne Impfung bindet die Pflanze keinen Stickstoff und der Ertrag bricht um 30 bis 50 % ein.\n- **Düngung**: nur Phosphat und Kalium. **Keine Stickstoffdüngung** — sie unterdrückt die Knöllchenbildung.\n- **Pflanzenschutz**: Vorauflauf gegen Unkraut, im Nachauflauf nur wenige zugelassene Mittel — die Unkrautbekämpfung ist die größte Herausforderung im Sojaanbau.\n- **Ernte**: Ende September bis Mitte Oktober mit Flexschneidwerk, weil die untersten Hülsen sehr tief ansetzen.\n\n**Erträge**: 2,5 bis 3,5 t/ha, auf guten Standorten mit ausreichender Wasserversorgung auch darüber.\n\n**Inhaltsstoffe**: rund 40 % Eiweiß und 20 % Öl — die höchste Eiweißdichte aller Ackerkulturen.\n\n**Wirtschaftlichkeit**: Die Erzeugerpreise liegen meist bei 450 bis 600 €/t, für **Speisesoja und Bio** deutlich darüber. Hinzu kommt in beiden Ländern die **gekoppelte Stützung beziehungsweise Förderung für Eiweißpflanzen**, die den Deckungsbeitrag spürbar hebt.\n\n**Warum die Fläche wächst**: Die EU will die Abhängigkeit von Sojaimporten aus Südamerika verringern, wo der Anbau mit Entwaldung verbunden ist — die **EU-Entwaldungsverordnung** verschärft die Anforderungen an importierte Ware zusätzlich. Heimische Soja ist damit auch ein Vermarktungsargument. Agronomisch bringt sie 40 bis 60 kg N/ha für die Folgefrucht und lockert enge Getreidefruchtfolgen auf.\n\n**Risiken**: Trockenheit während der Blüte im Juli, die Weißstängeligkeit (Sclerotinia) in engen Fruchtfolgen mit Raps sowie Taubenfraß nach der Saat.",
    "related": [
      "osevni-postup",
      "cap-2024"
    ]
  },
  {
    "slug": "vojteska",
    "term": "Luzerne",
    "alias": [
      "Medicago sativa",
      "Alfalfa",
      "Blaue Luzerne"
    ],
    "kategorie": "plodiny",
    "shortDef": "Die Luzerne ist eine mehrjährige Futterleguminose mit hohem Eiweißgehalt. Sie wird drei- bis viermal jährlich geschnitten, bindet Stickstoff und verbessert die Bodenstruktur nachhaltig.",
    "longDef": "Die Luzerne (Medicago sativa) ist die leistungsfähigste Futterleguminose des gemäßigten Klimas. Sie bleibt **drei bis fünf Jahre** auf demselben Schlag und wird jährlich drei- bis viermal geschnitten.\n\n**Anbau**:\n- **Saat**: Frühjahr (April) oder Spätsommer (August), als Reinsaat oder als Untersaat in Getreide.\n- **Saatstärke**: 25 bis 30 kg/ha. Die Impfung mit *Sinorhizobium meliloti* ist auf Flächen ohne Luzernehistorie nötig.\n- **Boden**: Luzerne verlangt einen **pH-Wert über 6,5** und keine Staunässe — auf sauren oder vernässten Böden versagt sie. Eine Kalkung vor der Aussaat ist oft die entscheidende Maßnahme.\n- **Düngung**: nur Phosphat, Kalium und Schwefel; Stickstoff bindet sie selbst, 200 bis 300 kg N/ha im Jahr.\n\n**Schnittzeitpunkte**:\n- **Erster Schnitt**: Mitte bis Ende Mai zu Beginn der Blüte — der Kompromiss zwischen Ertrag und Eiweißgehalt.\n- **Zweiter Schnitt**: Ende Juni.\n- **Dritter Schnitt**: Mitte August.\n- **Vierter Schnitt**: nur bei kräftigem Bestand; ein später Schnitt schwächt die Winterhärte, weshalb bis Mitte September Schluss sein sollte.\n\n**Ertrag**: 10 bis 14 t Trockenmasse je Hektar und Jahr, mit rund 18 bis 22 % Rohprotein.\n\n**Verwertung**: Anwelksilage im Fahrsilo oder in Ballen, Heu sowie Trocknung zu Pellets und Cobs für die Mischfutterindustrie.\n\n**Wert in der Fruchtfolge** — hier liegt der eigentliche Nutzen:\n- **Stickstoffbindung** von 200 bis 300 kg N/ha jährlich; die Folgefrucht profitiert von 60 bis 100 kg N/ha.\n- **Pfahlwurzel bis in 3 m Tiefe** — sie durchbricht Verdichtungen und erschließt Nährstoffe aus dem Unterboden.\n- **Humusaufbau** — nach drei Jahren Luzerne ist der Humusgehalt messbar höher.\n- **Unterbrechung von Krankheitszyklen** in getreidelastigen Fruchtfolgen.\n\nWeizen nach Luzerne gehört zu den ertragreichsten Stellungen der gesamten Fruchtfolge. Förderrechtlich zählt Luzerne zu den Eiweißpflanzen und erfüllt zugleich Anforderungen an die Fruchtartenvielfalt.",
    "related": [
      "osevni-postup",
      "organicka-hmota",
      "mezi-plodiny"
    ]
  },
  {
    "slug": "telematika",
    "term": "Telematik",
    "alias": [
      "JDLink",
      "AFS Connect",
      "Fendt Connect",
      "Flottenmanagement"
    ],
    "kategorie": "precise-farming",
    "shortDef": "Telematik überträgt Maschinendaten über das Mobilfunknetz — Position, Betriebsstunden, Verbrauch und Fehlermeldungen. Bei Premiumtraktoren seit Jahren Standard.",
    "longDef": "Telematik in der Landwirtschaft verbindet die Ortung mit den **technischen Daten der Maschine** aus dem CAN-Bus. Die Maschine sendet sie über Mobilfunk an eine Plattform, auf der Betriebsleiter und Händler den Zustand in nahezu Echtzeit sehen.\n\n**Die wichtigsten Plattformen**:\n- **John Deere Operations Center** mit JDLink — die umfangreichste Lösung, mit Agrardaten, Auftragsverwaltung und vorausschauender Wartung.\n- **Case IH AFS Connect** und **New Holland PLM Connect** — die gemeinsame Plattform des CNH-Konzerns.\n- **Fendt Connect** und **AGCO Fuse** — für Fendt, Massey Ferguson und Valtra.\n- **Claas TELEMATICS** — mit Schwerpunkt auf Ernteauswertung.\n- **365FarmNet** und **NEXT Farming** — herstellerübergreifende Lösungen, die auch ältere Maschinen einbinden.\n\n**Was erfasst wird**: Position und Fahrspur, Betriebsstunden, Kraftstoffverbrauch je Hektar und Stunde, Motorlast und Drehzahl, Fehlercodes mit sofortiger Meldung, Füllstände von AdBlue und der Zustand des Partikelfilters, bei Mähdreschern zusätzlich die Ertragsdaten. Über **Geofences** lässt sich eine Warnung auslösen, wenn eine Maschine ein festgelegtes Gebiet verlässt — in der Praxis der wirksamste Diebstahlschutz.\n\n**Kosten**: Bei Neumaschinen sind die ersten Jahre meist im Kaufpreis enthalten, danach fallen je nach Anbieter und Umfang etwa 100 bis 500 € je Maschine und Jahr an.\n\n**Nutzen nach Betriebsgröße**: Für kleinere Betriebe mit ein bis zwei Maschinen bleibt der Zusatznutzen überschaubar. Ab etwa drei Maschinen und mehreren Fahrern zahlt sich die Auswertung aus — Leerlaufanteile, Verbrauchsvergleiche zwischen Fahrern und die vorausschauende Wartung sind messbare Größen. Für **Lohnunternehmen** ist die minutengenaue Abrechnung je Kunde das entscheidende Argument.\n\n‼️ **Datenhoheit**: Wem die Maschinendaten gehören, ist vertraglich geregelt und nicht selbstverständlich. Der **EU Data Act** stärkt seit 2025 den Anspruch der Nutzer auf Zugang zu den von ihren Geräten erzeugten Daten und auf deren Weitergabe an Dritte. Der Blick in die Nutzungsbedingungen lohnt sich, bevor Agrardaten in eine Herstellerplattform fließen.",
    "related": [
      "isobus",
      "gps-rtk",
      "yield-monitor"
    ]
  },
  {
    "slug": "autonomni-traktor",
    "term": "Autonomer Traktor",
    "alias": [
      "fahrerloser Traktor",
      "Feldroboter",
      "autonomous tractor"
    ],
    "kategorie": "precise-farming",
    "shortDef": "Ein autonomer Traktor arbeitet ohne Fahrer auf dem Feld — mit RTK-Ortung, LiDAR, Kameras und Bildauswertung. Technisch vorgeführt, kommerziell erst am Anfang.",
    "longDef": "Der autonome Traktor ist die nächste Stufe des Precision Farming: Die Maschine arbeitet **ohne Fahrer in der Kabine**. Zusammen kommen dafür:\n- **RTK-Ortung** für die zentimetergenaue Spur,\n- **LiDAR** zur räumlichen Erfassung und Hinderniserkennung,\n- **Kameras mit Bildauswertung** zur Unterscheidung von Kultur, Unkraut und Hindernis,\n- **Mobilfunkanbindung** für Fernüberwachung und Eingriff.\n\n**Der Stand der Technik**:\n- **John Deere** stellte 2022 einen autonomen 8R vor und kündigte für die zweite Generation den Serieneinsatz an; verfügbar ist er zunächst in Nordamerika.\n- **AGCO und Fendt** verfolgen mit dem Konzept **Xaver** einen anderen Weg — mehrere kleine, leichte Roboter statt einer großen Maschine.\n- **Kleinroboter** wie Naio Oz und Dino oder der Farmdroid FD20 zur Aussaat und Hacke von Zuckerrüben sind in Europa **bereits im praktischen Einsatz**, vor allem im Ökolandbau und im Gemüsebau.\n- **Nachrüstlösungen** verwandeln bestehende Traktoren in teilautonome Maschinen.\n\n**Was der Verbreitung entgegensteht**:\n- **Rechtsrahmen** — die EU-Maschinenverordnung (2023/1230), die ab Januar 2027 gilt, schafft erstmals einen Rahmen für Maschinen mit selbstlernendem Verhalten. Bis dahin bewegen sich autonome Feldmaschinen in einer Grauzone, und der Betrieb auf öffentlichen Straßen bleibt ausgeschlossen.\n- **Sicherheit** — ein Feld ist kein abgeschlossener Raum. Die zuverlässige Erkennung von Menschen, Wild und Hindernissen ist die eigentliche technische Hürde.\n- **Wirtschaftlichkeit** — der Aufpreis rechnet sich bislang nur, wo Arbeitskräfte knapp und die Flächen groß sind.\n- **Haftung** — wer haftet bei einem Schaden ohne Fahrer? Diese Frage ist versicherungsrechtlich noch nicht abschließend geklärt.\n\n**Realistische Einordnung**: Für die kommenden Jahre bringen **teilautonome Funktionen** den größten Nutzen — automatische Lenkung, Teilbreitenschaltung, automatisches Vorgewendemanagement. Sie liefern einen erheblichen Teil des Nutzens zu einem Bruchteil der Kosten und sind heute verfügbar.",
    "related": [
      "auto-steering",
      "gps-rtk",
      "telematika",
      "isobus"
    ]
  },
  {
    "slug": "drony-zemedelstvi",
    "term": "Drohnen in der Landwirtschaft",
    "alias": [
      "UAV",
      "Agrardrohne",
      "Flugdrohne"
    ],
    "kategorie": "precise-farming",
    "shortDef": "Drohnen dienen in der Landwirtschaft der Bestandsüberwachung (Multispektralaufnahmen), der Ausbringung (Nützlinge, Saatgut) sowie dem Wildtierschutz vor der Mahd.",
    "longDef": "Drohnen erfüllen in der Landwirtschaft im Wesentlichen drei Aufgaben:\n\n### 1. Bestandsüberwachung — der verbreitetste Einsatz\n- **Multispektralaufnahmen** mit RGB- und NIR-Kamera zur Berechnung von NDVI und verwandten Indizes.\n- **Flughöhe** 50 bis 120 m, Leistung 50 bis 200 ha je Stunde.\n- Aus den Karten entstehen **Applikationskarten** für die teilflächenspezifische Düngung.\n- Übliche Geräte: DJI Mavic 3 Multispectral, DJI Phantom 4 Multispectral, senseFly eBee.\n\n### 2. Ausbringung\n- **Trichogramma-Schlupfwespen gegen den Maiszünsler** — dies ist in Deutschland und Österreich der mit Abstand häufigste Ausbringungseinsatz und praxisreif.\n- **Aussaat von Zwischenfrüchten** in stehende Bestände.\n- ‼️ **Pflanzenschutzmittel per Drohne**: Die EU-Richtlinie 2009/128/EG verbietet die **Ausbringung aus der Luft** grundsätzlich. Ausnahmen sind eng begrenzt und genehmigungspflichtig — in der Praxis vor allem im Steillagenweinbau. Die pauschale Ausbringung mit Sprühdrohnen, wie sie in Asien üblich ist, ist hier nicht zulässig.\n\n### 3. Wildtierschutz und Kontrolle\n- **Wärmebildkameras zur Rehkitzrettung** vor der ersten Mahd — der wirksamste und inzwischen breit geförderte Einsatz. In Deutschland gibt es dafür ein eigenes Bundesförderprogramm; die Suche ist zudem rechtlich geboten, weil das Vermähen von Kitzen als Verstoß gegen das Tierschutzgesetz gilt.\n- **Kontrolle von Zäunen, Weidevieh und Hochwasserlagen.**\n\n### Rechtsrahmen\nEs gilt die EU-Drohnenverordnung, umgesetzt vom **LBA** in Deutschland und der **Austro Control** in Österreich:\n- **Offene Kategorie** (A1, A2, A3) für Drohnen unter 25 kg in Sichtweite.\n- **Kompetenznachweis** für den Fernpiloten, online zu erwerben.\n- **Registrierung des Betreibers** verpflichtend, dazu eine **Haftpflichtversicherung**.\n- Ausbringungsflüge fallen in die **spezielle Kategorie** und brauchen eine Betriebsgenehmigung.\n\nFür einen Betrieb mittlerer Größe ist die Wärmebilddrohne zur Kitzrettung meist der Einstieg mit dem klarsten Nutzen — sie verhindert Tierleid, Rechtsverstöße und Futterverunreinigung durch Kadaver im Silo.",
    "related": [
      "ndvi",
      "variable-rate",
      "section-control"
    ]
  },
  {
    "slug": "sp-szp-2023-2027",
    "term": "GAP-Strategieplan 2023–2027",
    "alias": [
      "Nationaler Strategieplan",
      "GAP-Strategieplan",
      "GSP"
    ],
    "kategorie": "dotace",
    "shortDef": "Der GAP-Strategieplan ist die nationale Umsetzung der EU-Agrarpolitik. Jeder Mitgliedstaat legt darin fest, wie er die Mittel auf Direktzahlungen, Öko-Regelungen und ländliche Entwicklung verteilt.",
    "longDef": "Der GAP-Strategieplan ist das von der Europäischen Kommission genehmigte Programmdokument, mit dem jeder Mitgliedstaat die Gemeinsame Agrarpolitik für die Periode 2023 bis 2027 national ausgestaltet. Er ist der Grund, warum sich Fördersätze und Auflagen zwischen den Ländern erheblich unterscheiden, obwohl der Rahmen derselbe ist.\n\n**Deutschland** — der GAP-Strategieplan verteilt jährlich rund sechs Milliarden Euro:\n\n*Erste Säule (Direktzahlungen):*\n- **Einkommensgrundstützung** — 152,44 €/ha (Antragsjahr 2025).\n- **Umverteilungseinkommensstützung** — 68,05 €/ha für den 1. bis 40., 40,83 €/ha für den 41. bis 60. Hektar.\n- **Junglandwirteförderung** — 120,64 €/ha, höchstens 120 ha.\n- **Öko-Regelungen** — sieben Maßnahmen, für die rund 23 % der Mittel der ersten Säule vorgesehen sind.\n- **Gekoppelte Einkommensstützung** — Mutterkühe, Mutterschafe und -ziegen.\n\n*Zweite Säule (ländliche Entwicklung):* Die Länder setzen sie über eigene Programme um — Agrarumwelt- und Klimamaßnahmen, Ausgleichszulage für benachteiligte Gebiete, Ökolandbauförderung, Investitionsförderung, Tierwohlmaßnahmen und Vertragsnaturschutz.\n\n**Österreich** — der Strategieplan setzt stärker auf die zweite Säule, was zur kleinstrukturierten und stark von Grünland und Bergland geprägten Landwirtschaft passt:\n- **Basiseinkommensstützung** rund 208 €/ha Heimgut, rund 41 €/ha Almweide.\n- **Umverteilung** rund 44 beziehungsweise 22 €/ha für die ersten 40 Hektar.\n- **Junglandwirte** rund 66 €/ha.\n- **ÖPUL** als umfangreiches Agrarumweltprogramm mit hoher Beteiligung.\n- **Ausgleichszulage** nach dem Berghöfekataster, der die Bewirtschaftungserschwernis abbildet.\n\n**Für die Praxis** heißt das vor allem: Die maßgeblichen Regeln stehen nicht in der EU-Verordnung, sondern im nationalen Strategieplan und den darauf gestützten Richtlinien — in Deutschland zusätzlich in den Programmen der einzelnen Bundesländer. Wer Flächen über Landesgrenzen hinweg bewirtschaftet, muss mit unterschiedlichen Auflagen und Sätzen rechnen.",
    "related": [
      "cap-2024",
      "biss",
      "aeko",
      "jednotna-zadost"
    ]
  },
  {
    "slug": "intervence-33-73",
    "term": "Investitionsförderung (AFP)",
    "alias": [
      "AFP",
      "Agrarinvestitionsförderungsprogramm",
      "Investitionsförderung",
      "LIP"
    ],
    "kategorie": "dotace",
    "shortDef": "Die Investitionsförderung bezuschusst Investitionen in Ställe, Technik und Anlagen. Der Zuschuss beträgt je nach Programm 20 bis 40 % der förderfähigen Kosten, mit Aufschlägen für Junglandwirte und besonderes Tierwohl.",
    "longDef": "Die einzelbetriebliche Investitionsförderung ist das wichtigste Investitionsprogramm der zweiten Säule. In **Deutschland** heißt sie **Agrarinvestitionsförderungsprogramm (AFP)** und wird über die Gemeinschaftsaufgabe Agrarstruktur und Küstenschutz von Bund und Ländern getragen; in **Österreich** ist es die **Investitionsförderung** nach der LE-Sonderrichtlinie, abgewickelt über die AMA.\n\n**Was gefördert wird**:\n- **Stallbauten** — Neubau und Umbau, insbesondere mit erhöhten Tierwohlstandards.\n- **Anlagen zur Lagerung** — Güllelager, Fahrsilos, Lagerhallen, Getreidetrocknung.\n- **Emissionsmindernde Technik** — bodennahe Gülleausbringung, Abluftreinigung.\n- **Anlagen zur Bewässerung und zum Erosionsschutz.**\n- **Digitalisierung und Präzisionstechnik** — teils über eigene Programmteile.\n\n‼️ **Wichtige Einschränkung**: Reine **Maschinenkäufe wie Traktoren oder Mähdrescher sind im AFP grundsätzlich nicht förderfähig**. Gefördert werden bauliche Investitionen und fest installierte Technik. Für einzelne Maschinen gibt es eigene, engere Programme — etwa die Förderung emissionsarmer Ausbringtechnik.\n\n**Fördersätze**:\n- **Basisförderung**: in der Regel 20 %, bei besonderer Tierwohlausrichtung bis 40 % der förderfähigen Kosten.\n- **Junglandwirtezuschlag** für Betriebsleiterinnen und Betriebsleiter bis 40 Jahre in den ersten Jahren.\n- **Ober- und Untergrenzen** je Vorhaben und Förderperiode, die sich zwischen den Bundesländern beziehungsweise Programmen unterscheiden.\n\n**Der Ablauf**:\n1. **Planung** mit Kostenschätzung und Nachweis der Wirtschaftlichkeit (Prosperitätsprüfung).\n2. **Antrag** vor Beginn des Vorhabens.\n3. ‼️ **Kein vorzeitiger Maßnahmenbeginn** — wer vor dem Bewilligungsbescheid bestellt oder baut, verliert den Anspruch vollständig. Das ist der mit Abstand häufigste Fehler.\n4. **Bewilligung**, dann Umsetzung innerhalb der gesetzten Frist.\n5. **Verwendungsnachweis** mit Rechnungen und Zahlungsbelegen.\n6. **Zweckbindung** über mehrere Jahre — eine vorzeitige Veräußerung führt zur Rückforderung.\n\nDie Beratung durch die Landwirtschaftskammer oder ein spezialisiertes Büro ist üblich; die Antragsunterlagen sind umfangreich und die Bewertungskriterien unterscheiden sich je Bundesland und Programmjahr.",
    "related": [
      "sp-szp-2023-2027",
      "cap-2024",
      "aeko"
    ]
  },
  {
    "slug": "agrarni-komora",
    "term": "Landwirtschaftskammer",
    "alias": [
      "LWK",
      "Bauernverband",
      "Landwirtschaftskammer Österreich",
      "DBV"
    ],
    "kategorie": "regulace",
    "shortDef": "Die Landwirtschaftskammern sind die berufsständischen Selbstverwaltungskörperschaften der Landwirtschaft — sie beraten, bilden aus und vertreten die Interessen des Berufsstands.",
    "longDef": "Die Interessenvertretung der Landwirtschaft ist im deutschsprachigen Raum zweigeteilt: in **Kammern** als Körperschaften des öffentlichen Rechts und in **Verbände** als freiwillige Zusammenschlüsse.\n\n**Deutschland**:\n- **Landwirtschaftskammern** bestehen in Niedersachsen, Nordrhein-Westfalen, Schleswig-Holstein, Rheinland-Pfalz, dem Saarland, Hamburg und Bremen. Sie sind Körperschaften des öffentlichen Rechts, in denen die Mitgliedschaft der Betriebe gesetzlich begründet ist. In den übrigen Ländern übernehmen die **Landesanstalten und Ämter für Landwirtschaft** diese Aufgaben.\n- **Der Deutsche Bauernverband (DBV)** mit seinen Landesbauernverbänden ist die freiwillige politische Interessenvertretung.\n\n**Österreich**:\n- Die **Landwirtschaftskammern** der Bundesländer und die **Landwirtschaftskammer Österreich (LKÖ)** als Dachorganisation. Die Mitgliedschaft ist auch hier gesetzlich, die Kammern werden von den Landwirten in Kammerwahlen bestimmt.\n\n**Die Aufgaben der Kammern**:\n- **Beratung** — Betriebswirtschaft, Pflanzenbau, Tierhaltung, Förderanträge, Bauen, Recht.\n- **Ausbildung** — Berufsausbildung, Meisterprüfung, Sachkundenachweise für Pflanzenschutz und Tierhaltung.\n- **Hoheitliche Aufgaben** — je nach Land etwa die Buchführung, Bodenuntersuchungen und die Mitwirkung bei Förderverfahren.\n- **Versuchswesen** — Landessortenversuche, deren Ergebnisse die Grundlage regionaler Sortenempfehlungen sind.\n- **Interessenvertretung** gegenüber Land, Bund und der EU, in Brüssel über den Dachverband **COPA-COGECA**.\n\n**Warum das für den Betrieb zählt**: Die **Landessortenversuche** und die regionalen Anbauempfehlungen der Kammern sind für Sortenwahl und Pflanzenschutz die belastbarste unabhängige Datengrundlage — im Unterschied zu Herstellerangaben. Auch die Beratung bei Förderanträgen und beim Bauen wird intensiv genutzt.\n\nDaneben gibt es fachliche Verbände (Erzeugerringe, Maschinenringe, Zuchtverbände) sowie Interessenvertretungen mit anderer Ausrichtung, etwa die **Arbeitsgemeinschaft bäuerliche Landwirtschaft (AbL)**, die stärker kleinere und bäuerliche Betriebe vertritt.",
    "related": [
      "sp-szp-2023-2027",
      "cap-2024"
    ]
  },
  {
    "slug": "siloky-balik",
    "term": "Siloballen",
    "alias": [
      "Rundballensilage",
      "Ballensilage",
      "Wickelballen"
    ],
    "kategorie": "agrotechnika",
    "shortDef": "Siloballen sind in Folie gewickelte Ballen aus angewelktem Futter. Eine flexible Alternative zum Fahrsilo, besonders für kleinere Betriebe und für Restflächen.",
    "longDef": "Die Ballensilage ist die Alternative zum Fahrsilo: Das angewelkte Futter wird zu Rundballen gepresst und sofort in Folie gewickelt, wo es milchsauer vergärt.\n\n**Der Ablauf**:\n1. **Mähen** mit Aufbereiter, der die Halme anknickt und das Abtrocknen beschleunigt.\n2. **Anwelken** auf dem Schwad über 6 bis 24 Stunden auf **30 bis 45 % Trockenmasse** — trockener als beim Fahrsilo, weil sonst Sickersaft in der Folie steht.\n3. **Zetten und Schwaden** für ein gleichmäßiges Schwad.\n4. **Pressen** zu Rundballen von 1,2 bis 1,5 m Durchmesser, 500 bis 900 kg je Ballen.\n5. **Wickeln** möglichst **innerhalb von zwei Stunden** nach dem Pressen, mit **mindestens sechs Lagen** Folie — bei feuchterem Gut und für längere Lagerung acht Lagen.\n6. **Lagern** auf ebener, sauberer Fläche, geschützt vor Vogel- und Nagerschäden.\n\n**Kosten je Ballen**: Folie etwa 4 bis 7 €, Arbeit und Maschinen 8 bis 15 € — zusammen rund 12 bis 22 € je Ballen. Bezogen auf die Trockenmasse liegt die Ballensilage damit deutlich über dem Fahrsilo, das jedoch eine Bauinvestition von mehreren zehntausend Euro voraussetzt.\n\n**Wann Ballen die bessere Wahl sind**:\n- **Kleinere und mittlere Betriebe**, für die ein Fahrsilo nicht ausgelastet wäre.\n- **Verstreut liegende oder kleine Flächen** — jede Fuhre kann einzeln siliert werden.\n- **Restflächen und späte Schnitte**, die im Fahrsilo die Gesamtqualität verschlechtern würden.\n- **Pachtflächen ohne bauliche Perspektive.**\n- **Verkauf von Futter** an andere Betriebe.\n\n**Maschinen**: Rundballenpressen von Krone, Claas, McHale, Kuhn und Pöttinger; Wickler als Einzelmaschine oder als **Press-Wickel-Kombination**, die beides in einem Arbeitsgang erledigt und den kritischen Zeitverzug zwischen Pressen und Wickeln praktisch beseitigt.\n\n‼️ **Folienentsorgung**: Silofolie ist gewerblicher Abfall und muss über Rücknahmesysteme entsorgt werden — Verbrennen auf dem Hof ist verboten und wird geahndet.",
    "related": [
      "osevni-postup",
      "vojteska"
    ]
  },
  {
    "slug": "dojirna",
    "term": "Melkstand (Bauarten)",
    "alias": [
      "Melkstand",
      "Melkkarussell",
      "Melkroboter",
      "AMS"
    ],
    "kategorie": "technologie",
    "shortDef": "Der Melkstand ist die Melktechnik im Milchviehbetrieb — vom Fischgrätenmelkstand über den Side-by-Side bis zum Karussell und zum Melkroboter. Die Wahl bestimmt Arbeitszeit, Tierwohl und Investition.",
    "longDef": "Die Melktechnik ist die zentrale Investitionsentscheidung eines Milchviehbetriebs.\n\n### 1. Fischgrätenmelkstand\n- Die Kühe stehen schräg zur Melkgrube.\n- Größen von 2×4 bis 2×12 Plätzen, Leistung 60 bis 80 Kühe je Stunde.\n- Für Bestände von 40 bis 150 Kühen.\n- Bewährt, übersichtlich und vergleichsweise günstig; der Melker sieht das Euter gut.\n\n### 2. Side-by-Side (Parallelmelkstand)\n- Die Kühe stehen quer zur Grube, gemolken wird zwischen den Hinterbeinen.\n- Größen von 2×8 bis 2×24, Leistung 100 bis 140 Kühe je Stunde.\n- Für Bestände ab etwa 120 Kühen.\n- Kompakter und schneller als der Fischgrätenstand, dafür schlechtere Sicht auf das Tier.\n\n### 3. Melkkarussell\n- Die Kühe stehen auf einer drehenden Plattform mit 24 bis 80 Plätzen.\n- Leistung 150 bis 300 Kühe je Stunde.\n- Erst ab mehreren hundert Kühen sinnvoll, weil die Investition sehr hoch ist und ein kontinuierlicher Tierfluss vorausgesetzt wird.\n\n### 4. Melkroboter (automatisches Melksystem, AMS)\n- Die Kühe kommen selbstständig, zwei- bis dreimal täglich.\n- Eine Box bedient 55 bis 70 Kühe.\n- Investition von etwa 150 000 bis 200 000 € je Box zuzüglich Umbau.\n- **Vorteile**: keine festen Melkzeiten, hoher Arbeitszeitgewinn, tierindividuelle Daten zu Leistung, Zellzahl und Wiederkauverhalten, oft eine leichte Leistungssteigerung durch häufigeres Melken.\n- **Voraussetzungen**: ein für den Kuhverkehr passender Stall, verlässliche Technikbetreuung und die Bereitschaft, mit Daten zu arbeiten. Der Roboter ersetzt nicht die Tierbeobachtung — er verlagert sie.\n\n**Wichtige Hersteller**: Lely (Astronaut), DeLaval (VMS), GEA (DairyRobot, DairyProQ), Boumatic, Fullwood, Happel.\n\n**Zur Einordnung**: In Deutschland und Österreich wächst der Anteil automatischer Melksysteme seit Jahren deutlich; bei Neu- und Umbauten in Familienbetrieben ist der Roboter inzwischen häufig die erste Wahl, weil die Arbeitszeitbindung im Melkstand für viele Betriebsleiter der entscheidende Faktor ist. Für sehr große Bestände bleiben Karussell und Side-by-Side wirtschaftlich überlegen.",
    "related": [
      "telematika",
      "rijnost",
      "usni-znamka"
    ]
  },
  {
    "slug": "uhor",
    "term": "Brache",
    "alias": [
      "Brachland",
      "Schwarzbrache",
      "Stilllegung"
    ],
    "kategorie": "historie",
    "shortDef": "Die Brache ist zeitweilig unbestelltes Ackerland, das sich erholen und Nährstoffe sammeln soll. In der historischen Dreifelderwirtschaft lag ein Drittel der Fläche jährlich brach; heute lebt sie in den nichtproduktiven Flächen der GAP fort.",
    "longDef": "Als Brache bezeichnet man Ackerland, das **zeitweilig nicht bestellt wird**, damit sich Nährstoffvorrat, Wasserhaushalt und Struktur des Bodens erholen. Bis ins 19. Jahrhundert war sie tragende Säule des europäischen Ackerbaus.\n\n**Die Dreifelderwirtschaft** (siehe [[trojhonny-system]]):\n- 1. Feld: Wintergetreide — Roggen oder Weizen\n- 2. Feld: Sommergetreide — Hafer oder Gerste\n- 3. Feld: **Brache**, beweidet oder geschwarzt\n\nEin Drittel der Fläche lag also jedes Jahr still. Ohne Mineraldünger war das die einzige Möglichkeit, die Fruchtbarkeit zu halten. Auf der Brache wurde in der Regel Vieh geweidet, das den Boden zugleich düngte, und mehrfach gepflügt, um Unkraut zu unterdrücken — daher der Ausdruck Schwarzbrache.\n\n**Das Ende der Brache** brachten zwei Entwicklungen: die Erkenntnisse Justus von Liebigs zur Mineraldüngung ab den 1840er-Jahren und die Ammoniaksynthese von Haber und Bosch 1909. Schon vorher hatte die **Norfolker Fruchtfolge** — Klee, Weizen, Rüben, Gerste — gezeigt, dass eine Fruchtfolge mit Leguminosen und Hackfrüchten die Brache vollständig ersetzen kann.\n\n**Formen der Brache heute:**\n- **Grüne Brache** — Selbstbegrünung oder eingesäte Blühmischung; die übliche Form der nichtproduktiven Fläche\n- **Schwarzbrache** — gepflügt und unbewachsen; aus Sicht des Erosionsschutzes heute problematisch und praktisch verschwunden\n- **Blühflächen und Blühstreifen** — gezielt für Bestäuber und Niederwild angelegt, siehe [[biopasy]]\n- **Rotationsbrache** und **Dauerbrache** je nach Verpflichtungsdauer\n\n**Der agrarpolitische Rahmen**: Nach **GLÖZ 8** müssen Ackerbaubetriebe einen Mindestanteil nichtproduktiver Flächen und Landschaftselemente vorhalten. Nach dem Ukrainekrieg wurde die Vorgabe mehrfach ausgesetzt und 2024 gelockert; seither lässt sie sich auch über den Anbau von Zwischenfrüchten oder Leguminosen erfüllen, statt zwingend über Stilllegung. Wer darüber hinausgeht, kann in Deutschland die **Öko-Regelung 1a** für zusätzliche nichtproduktive Ackerflächen und **1b** für Blühstreifen nutzen.\n\nÖkologisch ist die Brache eine der wirksamsten Einzelmaßnahmen überhaupt: Sie bietet Feldvögeln wie Feldlerche und Rebhuhn Deckung und Nahrung in einer Jahreszeit, in der geschlossene Getreidebestände beides verwehren.\n\nSiehe auch [[trojhonny-system]], [[osevni-postup]], [[mezi-plodiny]], [[biopasy]], [[regenerativni-zemedelstvi]].",
    "related": [
      "trojhonny-system",
      "osevni-postup",
      "mezi-plodiny",
      "biopasy",
      "regenerativni-zemedelstvi"
    ]
  },
  {
    "slug": "trojhonny-system",
    "term": "Dreifelderwirtschaft",
    "alias": [
      "Dreifelderwechsel",
      "Dreizelgenwirtschaft"
    ],
    "kategorie": "historie",
    "shortDef": "Die Dreifelderwirtschaft teilte die Ackerflur in Winterung, Sommerung und Brache, die jährlich rotierten. Sie prägte Europa vom 9. bis ins 19. Jahrhundert.",
    "longDef": "Die Dreifelderwirtschaft ist die mittelalterliche und frühneuzeitliche Anbauordnung, die die ältere Zweifelderwirtschaft ablöste. Sie entstand in karolingischer Zeit und bestimmte den europäischen Ackerbau fast tausend Jahre lang.\n\n**Das Prinzip:** Die Ackerflur des Dorfes wurde in drei **Zelgen** oder **Gewanne** geteilt:\n- **Winterung** — Roggen oder Weizen, im Herbst gesät\n- **Sommerung** — Hafer oder Gerste, im Frühjahr gesät\n- **Brache** — unbestellt, beweidet, mehrfach gepflügt\n\nJedes Jahr rückte jede Zelge eine Position weiter. Damit standen zwei Drittel der Fläche in Nutzung statt der Hälfte wie zuvor — ein erheblicher Produktivitätssprung, der das Bevölkerungswachstum des Hochmittelalters trug.\n\n**Der Flurzwang war die eigentliche Fessel.** Jeder Bauer hatte schmale Streifen in allen drei Zelgen verteilt. Weil die Brache gemeinsam beweidet wurde und alle über dieselben Wege fuhren, musste das ganze Dorf zur selben Zeit dasselbe tun: gemeinsam säen, gemeinsam ernten, gemeinsam auftreiben. Einzelne konnten nichts ändern — auch dann nicht, wenn sie es besser gewusst hätten.\n\n**Wie es endete**, verlief in Deutschland und Österreich unterschiedlich, aber mit demselben Ergebnis:\n- **Albrecht Daniel Thaer** brachte ab 1800 mit seiner „rationellen Landwirtschaft\" die englische **Norfolker Fruchtfolge** — Klee, Weizen, Rüben, Gerste — in den deutschen Sprachraum und zeigte, dass eine Fruchtfolge mit Futterleguminosen und Hackfrüchten die Brache vollständig ersetzt\n- Die **Gemeinheitsteilungen und Separationen** ab dem frühen 19. Jahrhundert in Preußen und den deutschen Staaten sowie die **Kommassierungen** in Österreich lösten Flurzwang und Gemengelage auf und legten den Besitz zu geschlossenen Grundstücken zusammen\n- Die **Bauernbefreiung** machte den Bauern zum Eigentümer, der über seine Fläche selbst entscheiden konnte, siehe [[robota]]\n- **Justus von Liebigs** Mineraldüngerlehre ab 1840 und später die Ammoniaksynthese lösten schließlich die Bindung an die tierische Düngung\n\n**Was davon geblieben ist:** Der Gedanke der Brache ist heute in den nichtproduktiven Flächen nach GLÖZ 8 wieder da — allerdings aus dem entgegengesetzten Grund. Damals war sie eine Notwendigkeit der Nährstoffversorgung, heute ist sie eine bewusste Leistung für Biodiversität. Siehe [[uhor]].\n\nIm Kartenbild ist die alte Ordnung vielerorts noch sichtbar: Flurnamen wie **Oberzelg**, **Brachzelg** oder **Winterfeld** verweisen unmittelbar auf die drei Zelgen des Dorfes.",
    "related": [
      "uhor",
      "osevni-postup",
      "mez",
      "lan"
    ]
  },
  {
    "slug": "mez",
    "term": "Feldrain",
    "alias": [
      "Rain",
      "Feldhecke",
      "Knick",
      "Ackerrandstreifen"
    ],
    "kategorie": "historie",
    "shortDef": "Der Feldrain ist ein schmaler Gras- oder Gehölzstreifen zwischen zwei Schlägen. Historisch markierte er Eigentumsgrenzen, heute zählt er als geschützter Landschaftsbestandteil für Biodiversität und Erosionsschutz.",
    "longDef": "Der Feldrain ist ein **schmaler Gras- oder Gehölzstreifen zwischen zwei Ackerschlägen**. Ursprünglich war er die sichtbare Eigentumsgrenze in der Gewannflur und zugleich Schutz gegen Bodenabtrag.\n\n**Historische Funktionen:**\n- **Grenzmarkierung** zwischen den Parzellen, oft mit Grenzsteinen an den Ecken\n- **Landschaftselement** und Lebensraum für Wild, Vögel und Insekten\n- **Weg** für Gespanne — breitere Raine dienten als Feldwege\n- **Weide** für Kleinvieh, solange die Äcker bestellt waren\n\n**Der große Verlust im 20. Jahrhundert** verlief in West und Ost auf unterschiedlichen Wegen zum selben Ergebnis. In der Bundesrepublik und in Österreich beseitigte die **Flurbereinigung** beziehungsweise **Kommassierung** ab den 1950er-Jahren einen großen Teil der Raine, um zerstückelten Besitz zu maschinengerechten Schlägen zusammenzulegen. In der DDR schuf die Kollektivierung zu LPG und Volksgütern Schläge von oft mehreren hundert Hektar für Großtechnik. Die Folgen waren in beiden Fällen dieselben: verstärkte Wasser- und Winderosion, Rückgang der Artenvielfalt, Verlust von Rückzugsräumen und ein trockeneres, windoffeneres Landschaftsklima.\n\n**Die Rückkehr seit den 1990er-Jahren:**\n- **Gesetzlicher Schutz**: Feldhecken, Feldgehölze und Raine sind nach § 30 BNatSchG und den Naturschutzgesetzen der Länder geschützte Biotope. In Schleswig-Holstein genießen die **Knicks** einen eigenen, besonders strengen Schutz\n- **GLÖZ 8** rechnet Hecken, Feldraine und Baumreihen als Landschaftselemente auf die nichtproduktiven Flächen an — und **GLÖZ 8 verbietet zugleich ihre Beseitigung**\n- **Agrarumweltmaßnahmen** und die **Öko-Regelung 1b** fördern Blühstreifen und Randstrukturen\n- **Erosionsschutz**: In den nach Erosionsgefährdung eingestuften Gebieten verlangt **GLÖZ 5** Maßnahmen, für die Raine quer zum Hang eines der wirksamsten Mittel sind\n\n**Breiten in der Praxis**: klassischer Rain 1 bis 3 m; breiter Saum mit Sträuchern wie Schlehe, Hundsrose und Weißdorn 5 bis 10 m; Feldgehölz ab 10 m; Biotopverbund-Korridor ab 20 m.\n\nSiehe auch [[biopasy]], [[eroze-pudy]], [[trojhonny-system]], [[gaec]], [[lan]].",
    "related": [
      "biopasy",
      "eroze-pudy",
      "trojhonny-system",
      "gaec",
      "lan"
    ]
  },
  {
    "slug": "robota",
    "term": "Frondienst und Robot",
    "alias": [
      "Frondienst",
      "Robot",
      "Scharwerk",
      "Grundherrschaft"
    ],
    "kategorie": "historie",
    "shortDef": "Frondienst — in Österreich Robot genannt — war die unbezahlte Arbeitspflicht der grundholden Bauern für die Herrschaft. Sie endete 1848 mit der Grundentlastung.",
    "longDef": "Frondienst bezeichnet die unentgeltliche Arbeitspflicht, die grundholde Bauern der Grundherrschaft schuldeten — dem Adel, den Klöstern oder dem Landesfürsten. In den habsburgischen Ländern hieß dieselbe Sache **Robot**, vom slawischen Wort für schwere Arbeit; der Begriff war im gesamten Donauraum amtlich und ist bis heute in Österreich geläufig.\n\n**Die Formen** richteten sich nach der Größe der Hofstelle, siehe [[grunt]]:\n- **Zugrobot** oder **Spanndienst** — Arbeit mit Pferde- oder Ochsengespann: Pflügen, Fuhren, Ernte. Sie traf die Vollbauern\n- **Handrobot** oder **Handdienst** — Arbeit ohne Gespann: Hacken, Jäten, Mähen, Heuen. Sie traf Häusler und Kleinstellenbesitzer\n- **Ungemessene Robot** — ohne festgelegte Obergrenze; die drückendste Form, gegen die sich die Reformen zuerst richteten\n\nDazu kamen Naturalabgaben wie der **Zehnt** sowie Geldzinse.\n\n**Die Reformen im Habsburgerreich** verliefen in Etappen und blieben lange auf halbem Weg stehen:\n- **1775 — Robotpatent Maria Theresias**: Es staffelte die Robotpflicht nach der Größe der Hofstelle in feste Klassen und deckelte sie. Erstmals war die Robot damit messbar und einklagbar\n- **1781 — Aufhebung der Leibeigenschaft durch Joseph II.**: Der Bauer durfte den Grund verlassen, frei heiraten und seine Kinder ein Handwerk lernen lassen. **Die Robot selbst blieb bestehen** — ein Unterschied, der bis heute regelmäßig verwechselt wird\n- **1789 — Steuer- und Urbarialpatent**: der Versuch, die Robot in eine Geldabgabe umzuwandeln; nach Josephs Tod 1790 weitgehend zurückgenommen\n- **1848 — Grundentlastung**: Auf Antrag des schlesischen Bauernsohns und Reichstagsabgeordneten **Hans Kudlich** beschloss der österreichische Reichstag am 7. September 1848 die Aufhebung des Untertänigkeitsverhältnisses. Die Grundherren wurden entschädigt, ein Drittel trug der Bauer, ein Drittel das Land, ein Drittel entfiel\n\n**In den deutschen Staaten** begann der Weg früher und dauerte länger. Die **preußischen Reformen** unter Stein und Hardenberg leiteten ihn 1807 mit dem Oktoberedikt ein; die praktische Ablösung zog sich über die **Regulierungsedikte** von 1811 und 1821 bis weit in die 1850er-Jahre. Bezahlt wurde in Land oder Geld — viele Bauern traten bis zu einem Drittel ihrer Fläche an den Gutsherrn ab, was die ostelbische Großgüterstruktur erst richtig entstehen ließ.\n\n**Die Folgen** waren tiefgreifend: ein freier Bodenmarkt, die Zusammenlegung der Fluren, die Landflucht der überzähligen Landbevölkerung in die Industriestädte und nach Amerika — und ein Bauernstand, der zum ersten Mal für eigene Rechnung wirtschaftete.\n\n**Eine sprachliche Fußnote:** Aus demselben Wortstamm stammt das Wort **Roboter**, das Karel Čapek 1920 in seinem Drama R.U.R. prägte.",
    "related": [
      "grunt",
      "lan",
      "trojhonny-system",
      "mez"
    ]
  },
  {
    "slug": "grunt",
    "term": "Bauerngut",
    "alias": [
      "Hof",
      "Hofstelle",
      "Anwesen",
      "Grund"
    ],
    "kategorie": "historie",
    "shortDef": "Das Bauerngut ist die bäuerliche Hofstelle mit Wohnhaus, Ställen, Scheune und den zugehörigen Feldern — bis ins 20. Jahrhundert die Grundeinheit der ländlichen Gesellschaft.",
    "longDef": "Das Bauerngut umfasst die gesamte Hofstelle: Wohnhaus, Stallungen, Scheune, Speicher, Hofraum, Garten, Obstanger und die zugehörigen Feldstücke in der Dorfflur.\n\n**Die Größenstufen** hatten überall eigene Namen, meinten aber dasselbe Gefüge: **Vollbauer**, **Hufner** oder **Ganzlehner** mit einer vollen Hufe von rund 15 bis 30 ha; **Halbbauer** oder **Halblehner**; **Kossäte**, **Kätner** oder **Häusler** mit wenig Land; **Büdner** und **Inleute** ganz ohne Grund. Diese Stufung bestimmte nicht nur den Wohlstand, sondern auch das Stimmrecht in der Gemeinde und den Umfang der Robotpflicht, siehe [[robota]].\n\n**Die folgenreichste Unterscheidung im deutschen Sprachraum ist das Erbrecht** — sie prägt die Agrarstruktur bis heute:\n\nIm **Anerbenrecht**, verbreitet in Norddeutschland, Westfalen, Bayern und Österreich, ging der Hof **ungeteilt an einen Erben**. Die Geschwister wurden abgefunden und mussten in Handwerk, Dienst oder Auswanderung ausweichen. Das erhielt lebensfähige Betriebe — und erzeugte zugleich eine ständige Abwanderung.\n\nIm **Realteilungsgebiet**, vor allem in Baden-Württemberg, Hessen, der Pfalz und Teilen Frankens, wurde **unter allen Kindern geteilt**. Über Generationen entstanden Betriebe aus Dutzenden winziger, weit verstreuter Parzellen. Genau daraus erklärt sich die kleinteilige Agrarstruktur Südwestdeutschlands, die enorme Bedeutung der Flurbereinigung dort und die frühe Blüte des Genossenschaftswesens — allein hätte niemand Maschinen anschaffen können.\n\n**Das Altenteil** — regional auch Auszug, Ausgedinge oder Leibgeding — war der vertraglich gesicherte Anspruch des übergebenden Bauern auf Wohnung, Verpflegung und Versorgung bis zum Lebensende. Oft stand dafür ein eigenes **Altenteilerhaus** auf dem Hof. Diese Regelung war Jahrhunderte lang die Altersversorgung des Bauernstandes und ist als Institution bis heute im Höferecht verankert.\n\n**Rechtlich** wird das Anerbenrecht in Deutschland durch die **Höfeordnung** in den nördlichen Bundesländern und die Landesgesetze im Süden fortgeführt; in Österreich gilt das **Anerbengesetz** und für Tirol und Kärnten eigene Höfegesetze. Ihr Zweck ist unverändert: den Hof als wirtschaftliche Einheit über den Erbfall zu retten.\n\nIn Familiennamen und Flurnamen hat das Bauerngut überall Spuren hinterlassen — **Hofer**, **Huber** vom Hufner, **Meier** vom Verwalter, **Bauer**, **Lehner** vom Lehen.",
    "related": [
      "lan",
      "robota",
      "trojhonny-system",
      "mez",
      "jitro"
    ]
  },
  {
    "slug": "zentour",
    "term": "Göpel",
    "alias": [
      "Roßwerk",
      "Göpelwerk",
      "Pferdegöpel"
    ],
    "kategorie": "historie",
    "shortDef": "Der Göpel ist ein von Zugtieren im Kreis angetriebenes Getriebe — die Kraftquelle des Bauernhofs vor Dampfmaschine und Elektromotor.",
    "longDef": "Der Göpel wandelt die Zugkraft von Pferden oder Ochsen in eine Drehbewegung um. Das Tier läuft an einem Ausleger auf einer Kreisbahn von sechs bis zehn Metern Durchmesser und dreht dabei eine stehende Welle; ein Getriebe übersetzt die langsame Umdrehung von drei bis acht je Minute auf die Arbeitsdrehzahl der angeschlossenen Maschine.\n\n**Angetrieben wurden damit:**\n- die **Dreschmaschine** — die mit Abstand wichtigste Anwendung, siehe [[mlat]]\n- die **Schrotmühle** für Futtergetreide, siehe [[srotovnik]]\n- **Häckselmaschine**, **Rübenschneider** und **Obstpresse**\n- **Wasserpumpen** und in Bergbaurevieren die Förderung aus dem Schacht\n\n**Zwei Bauformen**: Beim älteren **stehenden Göpel** kreist das Tier um die Maschine herum, die in der Mitte steht — das verlangt viel Platz. Der **liegende Göpel** ab dem 18. Jahrhundert überträgt die Kraft über eine waagerechte Welle in einen Nebenraum. Erst er machte das **Göpelhaus** möglich, jenen charakteristischen runden oder vieleckigen Anbau an der Scheune, in dem die Pferde bei jedem Wetter im Trockenen liefen.\n\n**Zur Leistung**: Ein Pferd liefert im Göpel dauerhaft etwa 0,5 bis 0,8 PS. Ein Gespann reichte für eine kleine Dreschmaschine mit rund 100 kg Getreide je Stunde — verglichen mit dem Dreschflegel ein gewaltiger Fortschritt, verglichen mit der späteren Dampfdreschmaschine winzig.\n\n**Die Ablösung** verlief in zwei Wellen: Ab etwa 1870 verdrängte die **Lokomobile**, die fahrbare Dampfmaschine, den Göpel beim Dreschen. Mit der **Elektrifizierung des ländlichen Raums** zwischen 1920 und 1950 verschwand er dann endgültig — der Elektromotor leistete mehr, kostete kein Futter und brauchte keinen Menschen, der die Pferde führte.\n\n**Erhalten** sind Göpelhäuser noch vereinzelt in Norddeutschland, im Alpenvorland und in Österreich; funktionsfähige Göpel zeigen Freilichtmuseen. Das Wort lebt im **Flurnamen** weiter und in der Redensart, jemand laufe „wie ein Göpelpferd im Kreis\".",
    "related": [
      "grunt",
      "robota",
      "mlat",
      "zne"
    ]
  },
  {
    "slug": "mlat",
    "term": "Tenne",
    "alias": [
      "Dreschtenne",
      "Dreschboden",
      "Diele"
    ],
    "kategorie": "historie",
    "shortDef": "Die Tenne ist die feste Dreschfläche in der Scheune — bis ins 19. Jahrhundert der Mittelpunkt der winterlichen Hofarbeit.",
    "longDef": "Die Tenne ist die befestigte, ebene Fläche in der Mitte der Scheune, auf der das Getreide gedroschen wurde — also Korn, Stroh und Spreu getrennt wurden.\n\n**Der Bau** folgte überall derselben Logik: gestampfter Lehm, oft mit Kalk oder Ochsenblut gehärtet, seltener Bohlen oder Pflaster; beiderseits die **Bansen**, in denen die ungedroschenen Garben lagerten; und an beiden Enden ein großes Tor. Die gegenüberliegenden Tore waren kein Zufall — der **Durchzug** trug beim Worfeln die leichte Spreu fort, während das schwere Korn zu Boden fiel.\n\n**Das Dreschen mit dem Flegel** war Winterarbeit von November bis März. Ein Drescher schaffte am Tag 50 bis 80 kg Korn. Mehrere Drescher schlugen im Wechsel und in festem Rhythmus — bei vier Männern der sogenannte Vierschlag, dessen Takt in Volksliedern nachklingt. Es war die zuverlässigste Beschäftigung des Winterhalbjahrs und zugleich der Grund, warum ein Hof überhaupt so viele Leute über den Winter halten konnte.\n\n**Die Ablösung** kam in drei Schritten. Ab dem frühen 19. Jahrhundert übernahm die **Göpeldreschmaschine** mit 200 bis 500 kg je Stunde, siehe [[zentour]]. Ab etwa 1870 zog die **Dampfdreschmaschine** mit der Lokomobile von Hof zu Hof und schaffte über eine Tonne je Stunde — gedroschen wurde nun in wenigen Tagen im Hof statt monatelang in der Scheune. Und ab den 1950er-Jahren verlagerte der **Mähdrescher** den Vorgang endgültig aufs Feld.\n\n**Die soziale Folge** wird oft übersehen: Mit dem Wegfall der winterlichen Dreschzeit verlor das Landgesinde seine Beschäftigung im Winterhalbjahr. Die Dreschmaschine hat die Landflucht des 19. Jahrhunderts mit angetrieben.\n\nDie Tenne selbst wurde zur Maschinenhalle, zum Lager — oder abgerissen. Erhalten ist das Wort in Flurnamen, im **Tennentor** der Fachwerkscheune und in der Redensart, etwas werde „auf die Tenne gebracht\".",
    "related": [
      "zentour",
      "grunt",
      "zne",
      "rotor-kombajn"
    ]
  },
  {
    "slug": "zne",
    "term": "Ernte",
    "alias": [
      "Erntezeit",
      "Getreideernte",
      "Mahd"
    ],
    "kategorie": "historie",
    "shortDef": "Die Ernte ist der Höhepunkt des Landwirtschaftsjahres — vom Getreideschnitt mit Sichel und Sense bis zum heutigen Mähdrusch.",
    "longDef": "Die Getreideernte fällt in Mitteleuropa auf Juli und August: zuerst Wintergerste, dann Winterraps und Winterweizen, zuletzt Hafer und Sommergetreide. Über Jahrhunderte war sie die arbeitsintensivste und riskanteste Zeit des Jahres — der Ertrag eines ganzen Jahres entschied sich in wenigen Wochen.\n\n**Die Handernte** kannte zwei Werkzeuge: die **Sichel**, bis ins 17. Jahrhundert vorherrschend und vor allem von Frauen geführt, und die **Sense**, die zwar mehr Fläche schaffte, aber mehr Ausfall verursachte. Ein Mäher bewältigte 0,3 bis 0,5 ha am Tag. Gearbeitet wurde in Kolonnen: Mäher, dahinter die Aufnehmerin, dann die Binder, die die Garben schnürten, und schließlich die Aufsteller, die sie zu **Hocken** oder **Puppen** zusammenstellten. Nach ein bis zwei Wochen Nachtrocknung ging das Getreide in die Scheune und wurde dort über den Winter gedroschen, siehe [[mlat]].\n\n**Die Mechanisierung** verlief in klaren Sprüngen: der **Mähbalken** ab der Mitte des 19. Jahrhunderts, der **Mähbinder** ab den 1880er-Jahren, der die Garben selbsttätig band, und schließlich der **Mähdrescher**, der Schneiden, Dreschen und Reinigen in einem Arbeitsgang vereint und sich in Deutschland und Österreich ab den 1950er-Jahren durchsetzte.\n\n**Der Größenvergleich macht den Umbruch greifbar:** Ein moderner Mähdrescher erntet fünf bis zehn Hektar in der Stunde. Was ein Mäher mit der Sense in drei Jahren schaffte, erledigt er an einem Tag.\n\n**Was sich nicht geändert hat, ist das Wetterrisiko.** Ein Gewitter kann den Bestand ins **Lager** legen, Hagel vernichtet ihn in Minuten, und anhaltende Nässe führt zu **Auswuchs** — das Korn keimt in der Ähre, die Fallzahl fällt, und aus Brotweizen wird Futterweizen. Genau deshalb ist die Erntelogistik heute auf Geschwindigkeit ausgelegt: Jeder trockene Tag zählt.\n\n**Im Brauchtum** ist die Ernte tief verankert. Das **Erntedankfest** am ersten Sonntag im Oktober, die geschmückte **Erntekrone**, die der Gutsherrschaft oder heute der Gemeinde überreicht wird, und der letzte Halm, der stehen blieb — Bräuche, die vom Alpenraum bis an die Nordsee in Varianten überall vorkommen.",
    "related": [
      "mlat",
      "kombajn-trida",
      "rotor-kombajn",
      "grunt"
    ]
  },
  {
    "slug": "regenerativni-zemedelstvi",
    "term": "Regenerative Landwirtschaft",
    "alias": [
      "regenerativer Ackerbau",
      "Aufbauende Landwirtschaft"
    ],
    "kategorie": "precise-farming",
    "shortDef": "Die regenerative Landwirtschaft stellt den Bodenaufbau ins Zentrum — Humusmehrung, dauerhafte Bodenbedeckung und lebendige Durchwurzelung statt bloßer Schadensbegrenzung.",
    "longDef": "Regenerative Landwirtschaft ist kein geschützter Begriff und kein Zertifizierungssystem, sondern ein Bündel von Grundsätzen, deren gemeinsamer Nenner der **Bodenaufbau** ist. Anders als der Ökolandbau, der über eine EU-Verordnung definiert ist, lässt sie sich konventionell wie ökologisch betreiben.\n\n**Die fünf Grundsätze**, auf die sich die Praxis weitgehend geeinigt hat:\n1. **Bodenstörung minimieren** — reduzierte oder pfluglose Bearbeitung, damit Pilzgeflechte und Gefüge erhalten bleiben\n2. **Boden dauerhaft bedeckt halten** — Zwischenfrüchte, Untersaaten, Mulchauflage; nackter Boden ist der Ausgangspunkt fast aller Probleme\n3. **Lebende Wurzeln möglichst ganzjährig** — Wurzelausscheidungen ernähren das Bodenleben; ein Boden ohne Wurzel ist ein Boden ohne Nahrung\n4. **Vielfalt erhöhen** — weite Fruchtfolgen, Mischkulturen, artenreiche Zwischenfruchtmischungen\n5. **Tiere integrieren**, wo möglich — Weidegang und Wirtschaftsdünger schließen den Nährstoffkreislauf\n\n**Was belegt ist und was nicht** — hier lohnt Nüchternheit. Gut belegt sind die Wirkungen auf **Aggregatstabilität, Infiltration, Erosionsschutz und Wasserhaltefähigkeit**; das sind unmittelbar messbare, praktisch spürbare Effekte, die gerade in Trockenjahren zählen. Deutlich schwächer belegt sind die oft genannten Zahlen zum **Humusaufbau**: Die Zuwächse sind in gemäßigten Klimaten langsam, standortabhängig und in Feldversuchen erst über Jahrzehnte sicher nachweisbar. Wer regenerative Landwirtschaft als schnelle Klimalösung verkauft, überzieht.\n\n**Die praktischen Hürden** sind real: In den ersten Jahren der Umstellung sinken die Erträge häufig, weil der Stickstoff zunächst in der aufgebauten organischen Substanz gebunden wird. Die pfluglose Bestellung erhöht den Druck durch Ungräser und Schnecken. Und ohne Pflug steigt in der Umstellungsphase oft der Herbizidbedarf — ein Zielkonflikt, der offen benannt gehört.\n\n**Förderrechtlich** sind viele Einzelbausteine in Deutschland anrechenbar: Bodenbedeckung nach GLÖZ 6, Fruchtwechsel nach GLÖZ 7, die **Öko-Regelung 2** für vielfältige Kulturen sowie zahlreiche Agrarumweltmaßnahmen der Länder.",
    "related": [
      "no-till",
      "ctf",
      "mezi-plodiny",
      "organicka-hmota",
      "karbonove-zemedelstvi",
      "biouhel",
      "mykorhiza"
    ]
  },
  {
    "slug": "karbonove-zemedelstvi",
    "term": "Carbon Farming",
    "alias": [
      "Klimaschutzlandwirtschaft",
      "Kohlenstoffbindung im Boden",
      "Humuszertifikate"
    ],
    "kategorie": "precise-farming",
    "shortDef": "Carbon Farming bezeichnet Bewirtschaftungsverfahren, die Kohlenstoff im Boden und in Gehölzen binden — seit 2024 mit einem EU-Rechtsrahmen für die Zertifizierung.",
    "longDef": "Carbon Farming fasst landwirtschaftliche Verfahren zusammen, die der Atmosphäre Kohlenstoff entziehen und ihn im Boden oder in Gehölzen festlegen oder Emissionen vermeiden: Humusaufbau über Zwischenfrüchte und organische Düngung, reduzierte Bodenbearbeitung, Agroforst, Wiedervernässung von Mooren und der Erhalt von Dauergrünland.\n\n**Der Rechtsrahmen ist neu.** Die EU hat 2024 die **Verordnung über einen Zertifizierungsrahmen für dauerhafte Kohlenstoffentnahmen, Carbon Farming und Kohlenstoffspeicherung in Produkten (CRCF)** verabschiedet. Sie schafft erstmals EU-weit einheitliche Kriterien für die Anerkennung von Kohlenstoffentnahmen. Bis dahin waren nur freiwillige, privat betriebene Systeme mit sehr unterschiedlicher Qualität im Markt.\n\n**Die vier Kriterien**, an denen sich jedes seriöse System messen lassen muss, sind zugleich die Schwachstellen der bisherigen Angebote:\n\n**Quantifizierung** — die Kohlenstoffbindung muss belastbar messbar sein. Humusveränderungen sind kleine Differenzen zwischen großen Zahlen; sie zuverlässig zu messen verlangt viele Proben, einheitliche Tiefen und lange Zeiträume.\n\n**Zusätzlichkeit** — honoriert werden darf nur, was ohne die Förderung nicht geschehen wäre. Wer ohnehin Zwischenfrüchte anbaut, erzeugt keine zusätzliche Bindung.\n\n**Dauerhaftigkeit** — der wunde Punkt. Bodenkohlenstoff ist **reversibel**: Ein einziger Umbruch kann die Bindung von zwanzig Jahren binnen weniger Jahre wieder freisetzen. Deshalb verlangt die CRCF Überwachung und Vorkehrungen für den Fall der Freisetzung.\n\n**Vermeidung von Doppelzählung** — dieselbe Tonne darf nicht zugleich in der nationalen Klimabilanz und in einem verkauften Zertifikat stehen.\n\n**Für den Betrieb** heißt das praktisch: Angebote für Humuszertifikate sind sorgfältig zu prüfen. Zu klären sind Vertragslaufzeit — oft zwanzig Jahre und mehr —, die Folgen bei Flächenverkauf oder Pachtende, wer die Messkosten trägt, und ob Rückzahlungspflichten bestehen, falls der Kohlenstoff wieder freigesetzt wird. Erlöse liegen bislang meist im Bereich weniger Dutzend Euro je Tonne CO₂ und tragen einen Betriebszweig nicht allein.\n\n**Der ehrlichste Zugang** ist deshalb, die Maßnahmen zuerst wegen ihres **ackerbaulichen Nutzens** zu machen — Wasserhaltefähigkeit, Erosionsschutz, Bodenleben — und den Zertifikatserlös als Zubrot zu betrachten, nicht als Geschäftsmodell.",
    "related": [
      "regenerativni-zemedelstvi",
      "no-till",
      "organicka-hmota",
      "biouhel",
      "ttp",
      "vapneni"
    ]
  },
  {
    "slug": "strip-till",
    "term": "Streifenbearbeitung (Strip-Till)",
    "alias": [
      "Strip-Till",
      "Streifenlockerung"
    ],
    "kategorie": "agrotechnika",
    "shortDef": "Beim Strip-Till wird nur der Saatstreifen bearbeitet und gedüngt, während der Zwischenraum unberührt und bedeckt bleibt.",
    "longDef": "Strip-Till bearbeitet ausschließlich einen 15 bis 25 cm breiten **Streifen**, in den anschließend gesät wird. Der Bereich dazwischen bleibt unbearbeitet und von Mulch oder Zwischenfruchtresten bedeckt. Das Verfahren steht damit zwischen der ganzflächigen Bearbeitung und der Direktsaat und verbindet Vorzüge beider.\n\n**Der Streifen** wird von einem Zinken auf 20 bis 30 cm gelockert, von Ernterückständen freigeräumt und von Wellscheiben rückverfestigt. Er trocknet ab und erwärmt sich rasch — das ist bei Mais und Rüben entscheidend, die auf kalte Böden empfindlich reagieren und in reiner Direktsaat oft ungleichmäßig auflaufen.\n\n**Der eigentliche Trumpf ist die Unterfußdüngung.** Beim Bearbeiten wird der Dünger — meist Stickstoff und Phosphor, zunehmend auch **Gülle mit Injektionstechnik** — in 15 bis 20 cm Tiefe in ein Band unter die spätere Saatreihe abgelegt. Die junge Wurzel findet ihn genau dort, wo sie hinwächst. Das erhöht die Nährstoffeffizienz spürbar, senkt Ammoniakverluste und ist bei Gülle zugleich ein Weg, die Vorgaben zur bodennahen Ausbringung zu erfüllen.\n\n**Was der unbearbeitete Zwischenraum leistet**: Er hält die Mulchdecke, bremst Erosion und Verschlämmung erheblich, speichert Wasser und ist tragfähiger bei der Überfahrt. Auf erosionsgefährdeten Hanglagen — nach **GLÖZ 5** ein Thema mit rechtlicher Relevanz — ist Strip-Till in Mais und Rüben eines der wirksamsten verfügbaren Verfahren.\n\n**Die Voraussetzung ist Präzision.** Streifen und spätere Saatreihe müssen exakt zusammenfallen; ohne **RTK-Spurführung** ist das nicht sicher zu machen, siehe [[rtk-baze]]. Gearbeitet wird entweder im Herbst mit Saat im Frühjahr oder unmittelbar vor der Saat.\n\n**Grenzen**: hoher Zugkraftbedarf, teure Technik, und auf staunassen oder stark verdichteten Böden ist das Verfahren nicht die richtige Antwort — dort muss zuerst die Ursache behoben werden.",
    "related": [
      "no-till",
      "orba",
      "regenerativni-zemedelstvi",
      "ctf",
      "gps-rtk",
      "eroze-pudy"
    ]
  },
  {
    "slug": "biouhel",
    "term": "Pflanzenkohle",
    "alias": [
      "Biochar",
      "Biokohle",
      "Terra-Preta-Substrat"
    ],
    "kategorie": "hnojivo",
    "shortDef": "Pflanzenkohle entsteht durch Pyrolyse von Biomasse unter Luftabschluss; sie ist extrem stabil und bindet Kohlenstoff langfristig.",
    "longDef": "Pflanzenkohle entsteht, wenn Biomasse — Holz, Ernterückstände, Gärreste — bei 400 bis 700 °C **unter Luftabschluss** verkohlt wird. Das Ergebnis ist ein poröser, kohlenstoffreicher Feststoff mit einer inneren Oberfläche von mehreren hundert Quadratmetern je Gramm.\n\n**Die Idee stammt aus dem Amazonasgebiet**: Die **Terra Preta**, jahrhundertealte, von Menschen geschaffene Schwarzerden, verdanken ihre außergewöhnliche Fruchtbarkeit einem hohen Anteil an Holzkohle — ein Beleg dafür, dass der eingebrachte Kohlenstoff über Jahrhunderte stabil bleibt.\n\n**Was sie leistet und was nicht** — hier gehen Anspruch und Beleglage auseinander:\n\nGut belegt ist die **Kohlenstoffstabilität**: Anders als Humus wird Pflanzenkohle von Mikroorganismen kaum abgebaut und bleibt über Jahrhunderte im Boden. Das macht sie zu einer der wenigen wirklich **dauerhaften** Kohlenstoffsenken in der Landwirtschaft — und deshalb zur bevorzugten Methode im entstehenden Zertifikatsmarkt, siehe [[karbonove-zemedelstvi]].\n\nEbenfalls belegt sind die physikalischen Wirkungen: **Wasserhalte- und Sorptionsvermögen** steigen, was auf leichten Sandböden spürbar ist.\n\nDeutlich uneinheitlicher ist die Beleglage zum **Ertrag**. In tropischen, stark verwitterten Böden sind erhebliche Zuwächse dokumentiert; in mitteleuropäischen, ohnehin gut versorgten Ackerböden fallen die Effekte klein aus oder bleiben aus. Wer sie hier einsetzt, sollte es wegen der Kohlenstoffbindung tun, nicht wegen des erwarteten Mehrertrags.\n\n**Wichtig für die Anwendung**: Frische Pflanzenkohle ist zunächst **nährstoffleer** und kann Nährstoffe binden, statt sie abzugeben — sie sollte deshalb vor der Ausbringung mit Kompost oder Gülle **aufgeladen** werden.\n\n**Rechtlich** ist Vorsicht geboten und die Lage differenziert: In der EU ist Pflanzenkohle als **Futtermittelzusatzstoff** zugelassen und wird in der Tierhaltung sowie in der Einstreu und Güllebehandlung eingesetzt. Für die Verwendung als Düngemittel oder Bodenhilfsstoff gelten die düngemittelrechtlichen Vorgaben; maßgeblich sind Ausgangsmaterial, Schadstoffgehalte — vor allem PAK und Schwermetalle — und die Einhaltung anerkannter Qualitätsstandards wie des **European Biochar Certificate (EBC)**. Nicht jede selbst hergestellte Holzkohle ist verkehrsfähig.",
    "related": [
      "organicka-hmota",
      "regenerativni-zemedelstvi",
      "karbonove-zemedelstvi",
      "pH-pudy",
      "vapneni"
    ]
  },
  {
    "slug": "mykorhiza",
    "term": "Mykorrhiza",
    "alias": [
      "Mykorrhizapilze",
      "arbuskuläre Mykorrhiza",
      "AMF"
    ],
    "kategorie": "agrotechnika",
    "shortDef": "Die Mykorrhiza ist die Symbiose zwischen Pilzen und Pflanzenwurzeln — der Pilz erschließt Nährstoffe und Wasser, die Pflanze liefert Zucker.",
    "longDef": "Mykorrhiza bezeichnet die Lebensgemeinschaft von Bodenpilzen mit Pflanzenwurzeln. Der Pilz durchzieht mit seinen feinen Hyphen ein Bodenvolumen, das die Wurzel selbst nie erreichen könnte, und liefert daraus **Phosphor, Zink, Kupfer und Wasser**; im Gegenzug erhält er bis zu 20 % der von der Pflanze gebildeten Assimilate.\n\n**Für den Ackerbau zählt die arbuskuläre Mykorrhiza (AMF)**, die mit rund 80 % aller Landpflanzen eine Symbiose eingeht — darunter Getreide, Mais, Sonnenblume, Leguminosen und Kartoffel.\n\n**Eine wichtige Ausnahme, die in der Fruchtfolgeplanung zählt**: **Kreuzblütler wie Raps und Senf sowie Gänsefußgewächse wie Zuckerrübe und Spinat gehen keine Mykorrhiza ein.** Nach diesen Kulturen ist das Pilzgeflecht im Boden entsprechend schwach ausgeprägt, was sich auf die Phosphorversorgung der Folgekultur — besonders bei Mais in kalten Frühjahren — spürbar auswirken kann.\n\n**Der größte Nutzen liegt beim Phosphor.** Er ist im Boden kaum beweglich; um die Wurzel entsteht rasch eine Verarmungszone. Die Pilzhyphen überbrücken diese Zone und erschließen Phosphor aus einem Vielfachen des Volumens. Bei niedriger Phosphorversorgung kann die Mykorrhiza einen erheblichen Teil der Aufnahme leisten — bei hoher Düngung stellt die Pflanze die Symbiose dagegen weitgehend ein, weil sie den Aufwand nicht mehr braucht.\n\nDaraus folgt der praktische Punkt: **Hohe Phosphordüngung unterdrückt die Mykorrhiza.** Wer sie fördern will, düngt bedarfsgerecht statt großzügig.\n\n**Was das Pilzgeflecht sonst noch schädigt**: intensive, wendende Bodenbearbeitung, die die Hyphennetze mechanisch zerreißt; lange bewuchslose Phasen ohne Wirtspflanze; sowie einzelne Fungizide.\n\n**Was es fördert**: reduzierte Bearbeitung, ganzjährige Durchwurzelung über Zwischenfrüchte und weite, mykorrhizafreundliche Fruchtfolgen — genau die Grundsätze der [[regenerativni-zemedelstvi]].\n\n**Zu Impfpräparaten** ist Zurückhaltung angebracht: In mitteleuropäischen Ackerböden sind Mykorrhizapilze natürlich vorhanden, sodass eine Impfung meist keinen zusätzlichen Effekt bringt. Sinnvoll ist sie in Substratkulturen, in der Rekultivierung und im Gartenbau.",
    "related": [
      "regenerativni-zemedelstvi",
      "no-till",
      "strip-till",
      "organicka-hmota",
      "biouhel",
      "npk-hnojivo"
    ]
  },
  {
    "slug": "tmr",
    "term": "TMR — Totale Mischration",
    "alias": [
      "TMR",
      "Mischration",
      "Teil-TMR",
      "PMR"
    ],
    "kategorie": "chov",
    "shortDef": "Bei der TMR werden alle Futterkomponenten zu einer homogenen Mischung verarbeitet, sodass die Kuh nicht selektieren kann.",
    "longDef": "Bei der Totalen Mischration werden Grundfutter, Kraftfutter, Mineralstoffe und Zusätze im **Futtermischwagen** zu einer gleichmäßigen Mischung verarbeitet und als einziges Futter vorgelegt.\n\n**Der entscheidende Punkt ist die Verhinderung der Selektion.** Wird Kraftfutter getrennt gefüttert, frisst die Kuh es zuerst und in großer Menge — der Pansen-pH fällt schlagartig ab, und es droht eine **subakute Pansenazidose (SARA)**. In der Mischration nimmt sie mit jedem Bissen dasselbe Verhältnis von Struktur und Energie auf; der pH-Wert bleibt stabil, die Pansenmikroben arbeiten gleichmäßig.\n\n**Die Mischqualität entscheidet über den Erfolg** — und hier wird am meisten falsch gemacht. Zu kurze Mischzeit lässt Nester bestehen, zu lange zerstört die Struktur. Kontrolliert wird mit der **Schüttelbox nach Penn State**, die die Ration in Fraktionen trennt: Als Richtwert sollen etwa 3 bis 8 % auf dem obersten Sieb über 19 mm liegen, 30 bis 50 % auf dem mittleren und der Rest darunter. Zu wenig Langfaser bedeutet fehlende Wiederkauanregung, zu viel bedeutet, dass die Kuh doch selektiert und den groben Rest liegen lässt.\n\n**Die Trockensubstanz** der Gesamtration sollte bei 40 bis 50 % liegen. Zu nass senkt die Aufnahme, zu trocken begünstigt das Aussortieren. Bei sehr trockenen Rationen hilft Wasserzugabe.\n\n**Die Teil-TMR (PMR)** ist die in Deutschland verbreitetste Variante: Eine Grundration für ein mittleres Leistungsniveau wird am Trog vorgelegt, das leistungsabhängige Kraftfutter kommt über Abrufstation oder Melkroboter dazu. Das verbindet die Vorteile der Mischration mit der Möglichkeit, einzeltierbezogen zu ergänzen — bei automatischen Melksystemen ist es ohnehin die einzig mögliche Lösung, weil das Kraftfutter im Roboter den Besuchsanreiz liefert.\n\n**Praktisch wichtig**: mehrmals täglich anschieben, Restfutter kontrollieren und Nacherwärmung im Sommer im Blick behalten — eine sich erwärmende Ration wird sofort schlechter gefressen.",
    "related": [
      "dojirna",
      "kukurice-silazni",
      "vojteska",
      "siloky-balik",
      "oteleni"
    ]
  },
  {
    "slug": "oteleni",
    "term": "Abkalbung",
    "alias": [
      "Kalbung",
      "Geburt",
      "Kalbeverlauf"
    ],
    "kategorie": "chov",
    "shortDef": "Die Abkalbung ist der kritischste Moment im Produktionszyklus der Kuh — hier entscheidet sich der Verlauf der gesamten folgenden Laktation.",
    "longDef": "Die Trächtigkeit dauert beim Rind rund 280 Tage, je nach Rasse zwischen 275 und 290. Die Abkalbung selbst verläuft in drei Phasen: Öffnungsphase mit Unruhe und Absetzen des Beckenbandes, Austreibungsphase mit dem Erscheinen der Fruchtblase und schließlich der Nachgeburtsphase.\n\n**Wann eingegriffen werden muss** ist die wichtigste praktische Frage. Faustregel: Zeigt sich die Fruchtblase und geht es innerhalb von **zwei Stunden** nicht voran, ist nachzuschauen. Die normale Lage ist Vorderendlage mit beiden Vorderbeinen voran und dem Kopf darauf; bei Hinterendlage, abgebogenem Kopf oder untergeschlagenen Beinen ist tierärztliche Hilfe nötig. **Zu frühes und zu kräftiges Ziehen** richtet mehr Schaden an als Geduld.\n\n**Die Schwergeburt** ist der teuerste Einzelfall in der Milchviehhaltung. Sie erhöht das Risiko für Nachgeburtsverhaltung, Gebärmutterentzündung und verzögerte Wiederbelegung erheblich, und sie kostet Kalb und Kuh Leistung. Die Hauptursachen sind bekannt und weitgehend vermeidbar: **Überkonditionierung** der Trockensteher, siehe [[bcs-body-condition]], ein zu schwer bemuskelter Bulle bei zu jungen Färsen und ein zu niedriges Erstkalbealter bei zu geringem Gewicht.\n\n**Die Trockensteherfütterung** ist der wirksamste Hebel: Eine energiearme, strukturreiche Ration in der Trockenphase und gezielte Mineralversorgung in den letzten drei Wochen beugen Milchfieber vor — der Calciummangel unmittelbar nach der Geburt, der Festliegen verursacht und die Immunabwehr schwächt. Anionische Salze oder eine calciumarme Vorbereitungsration sind hier Standard.\n\n**Unmittelbar nach der Geburt** zählen drei Dinge: Atemwege freimachen und die Atmung kontrollieren, das Kalb von der Mutter trockenlecken lassen oder abtrocknen — und die **Kolostrumgabe innerhalb der ersten zwei Stunden**, siehe [[kolostrum-mlezivo]]. Der Nabel wird desinfiziert.\n\n**Rechtlich** ist jede Kalbung binnen sieben Tagen in der Rinderdatenbank zu melden, siehe [[usni-znamka]]; Totgeburten ebenso.",
    "related": [
      "rijnost",
      "inseminace",
      "jalovice",
      "usni-znamka",
      "dojirna",
      "tmr"
    ]
  },
  {
    "slug": "rijnost",
    "term": "Brunst",
    "alias": [
      "Rausche",
      "Östrus",
      "Brunsterkennung"
    ],
    "kategorie": "chov",
    "shortDef": "Die Brunst ist die Phase der Paarungsbereitschaft; ihre zuverlässige Erkennung ist der Flaschenhals der Herdenfruchtbarkeit.",
    "longDef": "Der Brunstzyklus des Rindes dauert im Mittel **21 Tage**, mit einer Spanne von 18 bis 24. Die eigentliche Brunst — die Duldungsphase — währt nur **6 bis 18 Stunden**, bei modernen Hochleistungskühen eher am unteren Rand.\n\n**Das sicherste Anzeichen ist der Duldungsreflex**: Die Kuh bleibt stehen, wenn eine andere aufspringt. Alle übrigen Zeichen — vermehrte Aktivität, Unruhe, Brüllen, glasiger Schleimfaden, gerötete Scheide, Aufspringen auf andere Tiere, abgeriebene Schwanzwurzel — sind Nebenbrunstzeichen und können auch ohne Ovulation auftreten.\n\n**Der richtige Besamungszeitpunkt** folgt aus der Physiologie: Die Ovulation erfolgt etwa 24 bis 30 Stunden nach Brunstbeginn, die Eizelle ist nur 6 bis 12 Stunden befruchtungsfähig, und die Spermien brauchen 6 bis 8 Stunden zur Kapazitation. Daraus ergibt sich die klassische **Morgen-Abend-Regel**: Morgens beobachtete Brunst wird abends besamt, abends beobachtete am nächsten Morgen.\n\n**Warum das in der Praxis so schwierig ist:** Die Brunstdauer hat sich mit steigender Leistung verkürzt, und ein erheblicher Teil der Brunsten läuft **nachts** ab. Bei rein visueller Beobachtung werden je nach Betrieb nur 40 bis 60 % der Brunsten erkannt — jede übersehene kostet 21 Tage Zwischenkalbezeit und damit bares Geld.\n\n**Die Technik hat das grundlegend verändert.** **Aktivitätsmesser** an Halsband oder Fußband erkennen die brunstbedingte Bewegungszunahme; moderne Sensoren werten zusätzlich Wiederkauzeit und Fressverhalten aus und erreichen Erkennungsraten über 90 %. **Bolus- und Ohrsensoren** messen zusätzlich die Körpertemperatur. Für die Betriebe, bei denen auch das nicht reicht, gibt es **Terminbesamungsprogramme** wie Ovsynch, die den Zyklus hormonell synchronisieren und eine Besamung zu festem Termin ohne Brunstbeobachtung erlauben.\n\n**Die Kennzahlen**, an denen die Herdenfruchtbarkeit gemessen wird, sind die **Rastzeit** von der Kalbung bis zur ersten Besamung, die **Güstzeit** bis zur erfolgreichen Besamung, die **Zwischenkalbezeit** mit einem Zielwert um 380 bis 400 Tage und der **Besamungsindex**.",
    "related": [
      "inseminace",
      "oteleni",
      "jalovice",
      "dojirna"
    ]
  },
  {
    "slug": "inseminace",
    "term": "Künstliche Besamung",
    "alias": [
      "KB",
      "Besamung",
      "gesextes Sperma"
    ],
    "kategorie": "chov",
    "shortDef": "Die künstliche Besamung ist das zentrale Werkzeug der Rinderzucht — über neunzig Prozent der deutschen Milchkühe werden künstlich besamt.",
    "longDef": "Bei der künstlichen Besamung wird tiefgefrorenes Sperma eines Zuchtbullen in die Gebärmutter der brünstigen Kuh eingebracht. In der deutschen und österreichischen Milchviehhaltung ist sie der Regelfall; der Natursprung spielt praktisch nur noch in der Mutterkuhhaltung eine Rolle.\n\n**Warum sie den Zuchtfortschritt trägt**: Ein einzelner Bulle kann jährlich Zehntausende Nachkommen zeugen. Das erlaubt eine sehr scharfe Selektion auf der väterlichen Seite — der weitaus größte Teil des genetischen Fortschritts einer Population läuft über die Bullen. Hinzu kommt der **Seuchenschutz**: Ohne Tierkontakt entfällt der wichtigste Übertragungsweg für Deckinfektionen, und die Besamungsstationen unterliegen strengen Gesundheitsauflagen.\n\n**Zwei Techniken haben die Praxis in den letzten Jahren umgekrempelt:**\n\n**Gesextes Sperma** ist nach Geschlecht sortiert und liefert mit etwa 90 % Sicherheit weibliche Kälber. Damit lässt sich die Nachzucht aus den genetisch besten Kühen erzeugen — und der Rest der Herde mit **Fleischrassen** anpaaren, deren Kälber deutlich höhere Erlöse bringen. Diese Kombination hat die Kälberverwertung grundlegend verändert und zugleich das Problem der schlecht verwertbaren Milchrassebullenkälber entschärft; siehe [[krizeni-plemen]]. Zu beachten ist die etwas geringere Befruchtungsrate, weshalb gesextes Sperma vorzugsweise bei Färsen und in gut geführten Brunsten eingesetzt wird.\n\n**Die genomische Selektion** hat seit etwa 2010 den Zuchtfortschritt beschleunigt: Junge Bullen werden anhand ihres Genoms bewertet und eingesetzt, ohne dass erst die Leistung ihrer Töchter abgewartet werden muss. Das **Generationsintervall** hat sich dadurch etwa halbiert.\n\n**Praktisch** zählt die Sorgfalt: Die Pistole wird auf Körpertemperatur vorgewärmt, das Pailletten-Auftauen bei 35 bis 37 °C, die Verarbeitung innerhalb weniger Minuten und die Ablage im Gebärmutterkörper. In Deutschland darf die Besamung von Tierärzten, stationsgebundenen Besamungstechnikern oder **Eigenbestandsbesamern** mit entsprechendem Sachkundenachweis durchgeführt werden. Jede Besamung ist zu dokumentieren — sie ist zugleich die Abstammungsgrundlage für das [[plemenna-kniha]].",
    "related": [
      "rijnost",
      "oteleni",
      "jalovice",
      "usni-znamka"
    ]
  },
  {
    "slug": "jalovice",
    "term": "Färse",
    "alias": [
      "Kalbin",
      "Jungrind",
      "Zuchtfärse"
    ],
    "kategorie": "chov",
    "shortDef": "Die Färse ist ein weibliches Rind vom Absetzen bis zur ersten Kalbung — die längste Kostenphase und zugleich die Zukunft der Herde.",
    "longDef": "Als Färse — in Österreich **Kalbin** — bezeichnet man ein weibliches Rind, das noch nicht gekalbt hat. Die Aufzuchtphase reicht vom Absetzen bis zur ersten Abkalbung und ist wirtschaftlich eine reine Investitionsphase: Es entstehen zwei Jahre lang nur Kosten.\n\n**Die Aufzuchtkosten** liegen in Deutschland als Richtwert bei 1.800 bis 2.400 € je Färse. Sie sind erst im Laufe der **zweiten Laktation** wieder erwirtschaftet — deshalb ist jede Kuh, die vor diesem Punkt abgeht, ein Verlustgeschäft, siehe [[brakace]].\n\n**Das Erstkalbealter ist die zentrale Stellschraube**, und zwar in beide Richtungen. Der Zielwert liegt bei **24 bis 26 Monaten**. Jeder Monat darüber kostet zusätzliche Aufzuchtkosten ohne Gegenwert — bei 100 Färsen und drei Monaten Verzögerung summiert sich das erheblich. Zugleich darf nicht zu früh gekalbt werden: Entscheidend ist nicht das Alter, sondern das **Gewicht**. Zur Erstbelegung sollte die Färse etwa 55 bis 60 % des ausgewachsenen Gewichts erreicht haben, zur Kalbung rund 85 %. Bei Holstein heißt das grob 400 kg zur Belegung mit 15 Monaten und 600 kg zur Kalbung.\n\nDaraus folgt die Aufzuchtstrategie: **zügige, aber nicht verfettende Zunahmen** von 750 bis 850 g täglich. Zu geringe Zunahmen verzögern die Zuchtreife; zu hohe führen zur **Verfettung des Eutergewebes** in der sensiblen Phase zwischen drei und neun Monaten und senken die spätere Milchleistung dauerhaft.\n\n**Zur Anpaarung**: Färsen werden mit **kalbeleichten Bullen** angepaart — das Becken ist noch enger, und eine Schwergeburt bei der Erstkalbung wirkt sich auf die gesamte weitere Nutzung aus. Gesextes Sperma wird bevorzugt bei Färsen eingesetzt, weil sie die besten Fruchtbarkeitswerte der Herde haben.\n\n**Die Weide** ist für Färsen aus Tierwohl- und Kostensicht ideal — sie brauchen keine Hochleistungsration, entwickeln auf der Weide gute Klauen und Fundamente und nutzen Grünlandflächen, die sonst schwer zu verwerten sind.",
    "related": [
      "oteleni",
      "rijnost",
      "inseminace",
      "usni-znamka",
      "tmr"
    ]
  },
  {
    "slug": "usni-znamka",
    "term": "Ohrmarke",
    "alias": [
      "Tierkennzeichnung",
      "HI-Tier",
      "Rinderpass"
    ],
    "kategorie": "chov",
    "shortDef": "Die Ohrmarke ist die gesetzlich vorgeschriebene, lebenslange Kennzeichnung jedes Nutztieres und die Grundlage der Rückverfolgbarkeit.",
    "longDef": "Jedes Rind, Schaf, jede Ziege und jedes Schwein muss gekennzeichnet und in einer zentralen Datenbank registriert sein. Die Ohrmarke trägt einen Ländercode und eine eindeutige Nummer; beim Rind wird sie in **beide Ohren** eingezogen.\n\n**Die Fristen sind knapp und werden kontrolliert**: Beim Rind ist die Kennzeichnung **innerhalb von sieben Tagen nach der Geburt** vorzunehmen und die Geburt binnen sieben Tagen zu melden — spätestens jedoch bevor das Tier den Betrieb verlässt. Jede Bewegung, jeder Zu- und Abgang, jeder Tod ist ebenfalls binnen sieben Tagen zu melden.\n\n**Die Datenbanken** sind national: In Deutschland läuft alles über **HI-Tier**, das Herkunftssicherungs- und Informationssystem für Tiere, betrieben von den Ländern. In Österreich übernimmt das die **Rinderdatenbank der AMA** beziehungsweise das **Veterinärinformationssystem VIS**. Jeder Betrieb hat eine Registriernummer, über die sein Tierbestand geführt wird.\n\n**Der Rinderpass** begleitet in Deutschland jedes Rind: Er wird nach der Geburtsmeldung ausgestellt, bei jedem Besitzerwechsel weitergegeben und beim Schlachten eingezogen.\n\n**Wozu der Aufwand dient**, wurde in den Krisen der 1990er-Jahre schmerzhaft klar. Nach BSE und der Maul- und Klauenseuche zeigte sich, dass ohne lückenlose Rückverfolgbarkeit weder Seuchenbekämpfung noch Verbrauchervertrauen möglich sind. Heute stützen sich darauf die Tierseuchenbekämpfung mit Sperrbezirken und Handelsbeschränkungen, die **Rindfleischetikettierung** mit Angabe von Geburts-, Mast- und Schlachtland, die Kontrolle tierbezogener Prämien und die Abwicklung von Entschädigungen aus der Tierseuchenkasse.\n\n**Praktisch relevant**: Verlorene Ohrmarken sind unverzüglich nachzubestellen und einzuziehen — ein Tier ohne Kennzeichnung darf den Betrieb nicht verlassen und ist bei Kontrollen ein Verstoß gegen die Konditionalität mit unmittelbarer Kürzung der Direktzahlungen. Bei Rindern ersetzt zunehmend die **elektronische Ohrmarke** die konventionelle, was zugleich Herdenmanagement und Sensorik erleichtert.",
    "related": [
      "oteleni",
      "inseminace",
      "jalovice",
      "lpis"
    ]
  },
  {
    "slug": "krmne-davky",
    "term": "Rationsgestaltung",
    "alias": [
      "Futterration",
      "Rationsberechnung",
      "Fütterungsplan"
    ],
    "kategorie": "chov",
    "shortDef": "Die Rationsgestaltung stellt die Futtermischung so zusammen, dass sie Bedarf und Aufnahmevermögen des Tieres zugleich trifft.",
    "longDef": "Die Ration muss zwei Bedingungen gleichzeitig erfüllen: Sie muss den **Bedarf** an Energie, Eiweiß, Mineralstoffen und Vitaminen decken — und sie muss in die **Trockenmasseaufnahme** passen, die das Tier physisch leisten kann. Genau in diesem Spannungsfeld liegt die eigentliche Aufgabe.\n\n**Die Größen**, mit denen im deutschsprachigen Raum gerechnet wird: Energie als **MJ NEL** beim Rind, siehe [[nel]]; Eiweiß als **nutzbares Rohprotein nXP** mit der **ruminalen Stickstoffbilanz RNB** als Ausgleichsgröße, siehe [[pdi]]; dazu Strukturwirksamkeit, Stärke und Zucker, Rohfaser sowie Mengen- und Spurenelemente.\n\n**Ein Rechenbeispiel macht das Problem greifbar**: Eine Kuh mit 40 kg Milch braucht über 160 MJ NEL täglich. Fressen kann sie etwa 23 kg Trockenmasse. Die Ration muss also über 7 MJ NEL je kg TM liefern — mit Grundfutter allein nicht zu erreichen. Also steigt der Kraftfutteranteil, und damit steigt das Risiko einer **Pansenazidose**. Die Rationsgestaltung im Hochleistungsbereich ist deshalb immer eine Gratwanderung zwischen Energiedichte und Strukturversorgung.\n\n**Deshalb wird nach Leistungsgruppen gefüttert**: Frischmelker, Hochleistung, Spätlaktation, Trockensteher und Vorbereiter haben grundverschiedene Anforderungen. Eine einzige Ration für alle führt dazu, dass die einen hungern und die anderen verfetten.\n\n**Die Grundlage jeder Berechnung ist die Futteranalyse.** Silagen schwanken erheblich in Energie, Eiweiß und Trockensubstanz; wer mit Tabellenwerten statt mit eigenen Analysen rechnet, rechnet an der Wirklichkeit vorbei. Berechnet wird mit Rationsprogrammen, kontrolliert wird am Tier — über Milchleistung und Inhaltsstoffe aus der Milchleistungsprüfung, Körperkondition, Kotbeschaffenheit, Wiederkauaktivität und Restfutter.\n\n**Rechtlich** ist zu beachten, dass die Fütterung unmittelbar in die **Stoffstrombilanz** nach Düngeverordnung eingeht: Eine an den Bedarf angepasste, nicht überversorgte Ration senkt die Stickstoff- und Phosphorausscheidung messbar und ist damit zugleich ein Instrument des Nährstoffmanagements.",
    "related": [
      "tmr",
      "kukurice-silazni",
      "vojteska",
      "oteleni",
      "siloky-balik"
    ]
  },
  {
    "slug": "kombajner",
    "term": "Mähdrescherfahrer",
    "alias": [
      "Drescher",
      "Maschinenführer",
      "Combine Operator"
    ],
    "kategorie": "slang",
    "shortDef": "Der Mähdrescherfahrer führt den Mähdrescher durch die Ernte — die sichtbarste und anspruchsvollste Saisonarbeit auf dem Betrieb.",
    "longDef": "Der Mähdrescherfahrer bedient die Erntemaschine während der wenigen Wochen, in denen sich der Jahresertrag entscheidet. Formal firmiert die Tätigkeit als Fachkraft Agrarservice oder Landmaschinenführer; im Sprachgebrauch heißt er schlicht Drescher.\n\n**Der Arbeitsrhythmus** ist extrem ungleich verteilt. In der Ernte von Juli bis September sind zwölf bis sechzehn Stunden täglich über mehrere Wochen die Regel, oft ohne freien Tag; außerhalb der Saison fährt derselbe Mann Schlepper, wartet Maschinen oder arbeitet in der Werkstatt. Bei Lohnunternehmen zieht die Kolonne von Betrieb zu Betrieb, teils quer durch mehrere Bundesländer.\n\n**Was den Unterschied macht**, sind drei Fähigkeiten, die zusammenkommen müssen:\n\n**Die Maschineneinstellung.** Trommeldrehzahl, Korbabstand, Windmenge und Siebstellung müssen zur Frucht, zur Reife und zur Tageszeit passen — und im Verlauf eines Tages mehrfach nachgeführt werden. Eine falsche Einstellung kostet entweder Bruchkorn oder Ausdrusch­verluste, und beides sieht man erst, wenn man aussteigt und nachschaut.\n\n**Die Beurteilung des Bestandes.** Wann ist das Korn trocken genug, wann steht der Tau noch, wie hoch wird bei Lagergetreide geschnitten, wann lohnt es sich abends noch weiterzufahren. Das Feuchtemessgerät liefert Zahlen, die Entscheidung trifft der Fahrer.\n\n**Die Logistik.** Der Korntank fasst je nach Maschine 9 bis 16 m³ und ist bei gutem Bestand in zwanzig Minuten voll. Steht kein Überladewagen bereit, steht die Maschine — und eine stehende Maschine ist in der Ernte der teuerste Zustand überhaupt.\n\n**Rechtlich** ist die Sache klarer geregelt als oft angenommen: Für Überführungsfahrten auf öffentlichen Straßen gilt Führerscheinklasse T beziehungsweise L, für überbreite Maschinen ist eine Ausnahmegenehmigung nötig, und die Schneidwerke müssen für den Transport auf dem Wagen verladen werden. Die Arbeitszeitregelungen kennen für die Erntezeit Ausnahmen, aber keine Aufhebung.\n\n**Der Beruf hat ein Nachwuchsproblem.** Die Saisonspitzen, die Verantwortung für Maschinen im Wert einer halben Million Euro und die Konkurrenz besser planbarer Arbeitszeiten machen die Suche schwer. Viele Betriebe und Lohnunternehmen arbeiten deshalb mit Saisonkräften aus Ost- und Südosteuropa.",
    "related": [
      "traktorista",
      "kombajn-trida",
      "rotor-kombajn",
      "zne",
      "header"
    ]
  },
  {
    "slug": "traktorista",
    "term": "Schlepperfahrer",
    "alias": [
      "Traktorist",
      "Trecker­fahrer",
      "Landmaschinenführer"
    ],
    "kategorie": "slang",
    "shortDef": "Der Schlepperfahrer bedient den Traktor mit allen Anbaugeräten — vom Pflügen über Säen und Pflanzenschutz bis zum Transport.",
    "longDef": "Der Schlepperfahrer — je nach Region auch Traktorist oder Treckerfahrer — ist die vielseitigste Arbeitskraft des landwirtschaftlichen Betriebs. Der formale Ausbildungsweg führt über den **Landwirt** oder die **Fachkraft Agrarservice**, ein Ausbildungsberuf, der eigens auf Maschinenführung und Lohnarbeit zugeschnitten ist.\n\n**Das Aufgabenspektrum** umspannt das ganze Jahr: Bodenbearbeitung und Aussaat im Frühjahr, Düngung und Pflanzenschutz in der Vegetation, Futter- und Getreideernte im Sommer, Stoppelbearbeitung, Gülleausbringung und Zwischenfruchtsaat im Herbst, dazu über den Winter Transport, Winterdienst und Werkstatt.\n\n**Der Beruf hat sich in zwanzig Jahren stark verändert.** Zum handwerklichen Können — Hydraulik verstehen, Geräte richtig einstellen, Störungen im Feld beheben — sind Anforderungen getreten, die früher nichts mit dem Schlepper zu tun hatten:\n- **Bedienung der Terminals** und Kalibrierung von Sensoren\n- **ISOBUS**-Geräteanbindung und Fehlersuche, wenn Maschine und Terminal einander nicht erkennen\n- **Spurführung** mit RTK und das Anlegen von Referenzlinien, siehe [[rtk-baze]]\n- **Applikationskarten** einlesen und die Umsetzung kontrollieren, siehe [[mapa-vra]]\n- **Dokumentation**, die unmittelbar in die gesetzlich verlangten Aufzeichnungen läuft, siehe [[fmis]]\n\n**Rechtlich** braucht er die Führerscheinklasse T, für die Ausbringung von Pflanzenschutzmitteln zwingend den **Sachkundenachweis Pflanzenschutz** mit verpflichtender Fortbildung alle drei Jahre, und für den gewerblichen Gütertransport gegebenenfalls weitere Qualifikationen. Die Lenk- und Ruhezeitenregelungen kennen für die Landwirtschaft Ausnahmen — sie gelten aber nicht unbegrenzt und werden bei Straßenfahrten kontrolliert.\n\n**Die Nachwuchslage** ist angespannt. Der Altersdurchschnitt ist hoch, viele Betriebe finden keine qualifizierten Bewerber und greifen auf Lohnunternehmen oder Saisonkräfte aus dem europäischen Ausland zurück. Zugleich verschiebt die Technik das Anforderungsprofil: Wer heute in den Beruf einsteigt, arbeitet weniger mit dem Lenkrad und mehr mit dem Display.",
    "related": [
      "kombajner",
      "cvt-prevodovka",
      "orba",
      "autonomni-traktor",
      "gps-rtk"
    ]
  },
  {
    "slug": "srotovnik",
    "term": "Schrotmühle",
    "alias": [
      "Getreidemühle",
      "Hammermühle",
      "Quetsche",
      "Schroter"
    ],
    "kategorie": "slang",
    "shortDef": "Die Schrotmühle zerkleinert Getreide und Körnerleguminosen zu Futterschrot — die Grundlage der hofeigenen Futteraufbereitung.",
    "longDef": "Die Schrotmühle mahlt Getreide, Mais und Körnerleguminosen zu Schrot. Der Grund ist verdauungsphysiologisch: Ein ganzes Korn passiert den Verdauungstrakt von Schwein und Geflügel weitgehend unverwertet, weil die harte Schale nicht aufgeschlossen wird. Erst die Zerkleinerung macht die Stärke zugänglich.\n\n**Drei Bauarten mit unterschiedlichem Zweck:**\n\nDie **Hammermühle** schlägt das Korn mit rotierenden Schlägern gegen ein Siebkorb; die Lochweite des Siebes bestimmt die Feinheit. Sie ist robust, universell und die verbreitetste Bauart — aber staubintensiv und energiehungrig.\n\nDie **Walzenmühle** oder **Quetsche** drückt das Korn zwischen zwei Walzen platt. Sie liefert ein sehr gleichmäßiges, gröberes Produkt bei deutlich geringerem Energiebedarf und ohne Feinstaub.\n\nDie **Scheibenmühle** arbeitet zwischen zwei geriffelten Scheiben und liegt dazwischen.\n\n**Der Mahlgrad ist die eigentliche Kunst — und dabei wird am meisten falsch gemacht.** Für **Schweine** gilt: nicht zu fein. Zu feines Schrot mit hohem Feinanteil erhöht nachweislich das Risiko von **Magenulzera**, weil die grobe Struktur fehlt, die den Mageninhalt schichtet. Empfohlen wird ein mittlerer Vermahlungsgrad um 600 bis 900 µm. Für **Rinder** genügt Quetschen; feines Mahlen ist hier sogar schädlich, weil die Stärke zu schnell im Pansen abgebaut wird und eine **Pansenazidose** auslöst.\n\n**Historisch** lief die Schrotmühle am [[zentour]], später an der Lokomobile und heute am Elektromotor oder der Zapfwelle. Auf vielen Betrieben ist sie Teil einer kompletten Anlage mit Waage, Mischer und Silo — der **hofeigenen Mischfutterherstellung**, die gegenüber Zukauffutter erhebliche Kosten spart, dafür aber eigene Verantwortung mit sich bringt.\n\n**Rechtlich** ist das kein Nebensache: Wer für den eigenen Bestand mischt, ist **Futtermittelunternehmer** im Sinne des EU-Futtermittelrechts. Daraus folgen Registrierungspflicht beim zuständigen Amt, Anforderungen an Hygiene und Rückverfolgbarkeit sowie Aufzeichnungen über zugekaufte Komponenten. Besondere Sorgfalt verlangt die Vermeidung von **Verschleppung** — Reste einer Mischung mit Zusatzstoffen dürfen nicht unkontrolliert in die nächste geraten.",
    "related": [
      "zentour",
      "krmne-davky",
      "kukurice-silazni",
      "grunt",
      "tmr"
    ]
  },
  {
    "slug": "zemak",
    "term": "Erdapfel",
    "alias": [
      "Kartoffel",
      "Grundbirne",
      "Krumbeere",
      "Herdöpfel"
    ],
    "kategorie": "slang",
    "shortDef": "Erdapfel ist die im süddeutschen und österreichischen Raum verbreitete Bezeichnung für die Kartoffel — eines der vielfältigsten Wörter der deutschen Sprache.",
    "longDef": "Für dieselbe Knolle kennt der deutsche Sprachraum mehr Bezeichnungen als für fast jedes andere Lebensmittel. Die Verteilung folgt keiner Laune, sondern den Wegen, auf denen die Pflanze im 18. Jahrhundert ins Land kam.\n\n**Die wichtigsten Namen und ihre Räume:**\n- **Kartoffel** — die Standardsprache und der Norden und Osten; abgeleitet vom italienischen *tartufolo*, der Trüffel, wegen der Ähnlichkeit der Knollen\n- **Erdapfel** — Österreich und Südbayern, Lehnübersetzung des französischen *pomme de terre*\n- **Grundbirne** und **Grumbeere**, **Krumbeere**, **Grumbeer** — Pfalz, Saarland, Hessen, Franken; über das Slawische bis ins Ungarische als *krumpli* weitergewandert\n- **Herdöpfel** und **Härdöpfel** — Schweiz und Alemannisch\n- **Bramburi** — im Egerland und angrenzenden Gebieten; das Wort verweist wörtlich auf **Brandenburg**, von wo die Knolle kam\n\n**Die Einführung** verlief zäh. Als Zierpflanze kam die Kartoffel im 16. Jahrhundert nach Europa, als Nahrungsmittel setzte sie sich erst zwei Jahrhunderte später durch — gegen erheblichen Widerstand. Friedrich II. von Preußen erließ ab 1756 mehrere **Kartoffelbefehle**; die Anekdote vom bewachten Kartoffelfeld, das die Bauern daraufhin für wertvoll hielten und bestahlen, ist gut erfunden, aber historisch nicht belegt. In Österreich förderte Maria Theresia den Anbau nach den Hungerjahren der 1770er-Jahre.\n\n**Warum sie sich schließlich durchsetzte**, ist schnell erklärt: Sie liefert je Hektar ein Vielfaches der Kalorien von Getreide, wächst auf ärmeren Böden, braucht keine Mühle und keinen Backofen — und sie steht **unter der Erde**, wo weder Hagel noch durchziehende Heere sie erreichen. Gerade das letzte Argument wog in den Kriegen des 18. Jahrhunderts schwer.\n\n**Die Kehrseite** zeigte sich, als sich der Anbau auf wenige Sorten stützte: Die **Kraut- und Knollenfäule** löste ab 1845 die große Hungersnot in Irland aus und traf auch Mitteleuropa schwer. Sie ist bis heute die wichtigste Krankheit im Kartoffelbau, siehe [[plisen-bramborova]].\n\nHeute stehen in Deutschland rund 260.000 Hektar Kartoffeln, in Österreich etwa 25.000 — mit deutlichem Schwerpunkt bei Verarbeitungsware für Pommes, Chips und Stärke.",
    "related": [
      "ozim-jarin",
      "osevni-postup",
      "npk-hnojivo",
      "plisen-bramborova",
      "mandelinka-bramborova"
    ]
  },
  {
    "slug": "plisen-bramborova",
    "term": "Kraut- und Knollenfäule",
    "alias": [
      "Phytophthora infestans",
      "Krautfäule",
      "Braunfäule"
    ],
    "kategorie": "ochrana",
    "shortDef": "Die Kraut- und Knollenfäule ist die wichtigste Kartoffelkrankheit weltweit — sie kann einen Bestand innerhalb von zwei Wochen vernichten.",
    "longDef": "Erreger ist *Phytophthora infestans*, biologisch kein echter Pilz, sondern ein **Oomycet** — verwandt mit Algen. Das ist keine Spitzfindigkeit: Es erklärt, warum viele Fungizide gegen ihn wirkungslos sind und eigene Wirkstoffgruppen nötig sind.\n\n**Historisch** löste der Erreger ab 1845 die **Große Hungersnot in Irland** aus, in deren Folge über eine Million Menschen starben und ebenso viele auswanderten. Auch Mitteleuropa traf die Epidemie schwer; sie ist einer der Gründe für die Agrarkrisen der 1840er-Jahre.\n\n**Das Schadbild**: graugrüne, später braunschwarze Flecken auf den Blättern, an deren Unterseite sich bei Feuchtigkeit ein weißer Sporenrasen zeigt. Der Bestand riecht charakteristisch faulig. An den Knollen entstehen eingesunkene, bleigraue Stellen mit rostbrauner Verfärbung im Inneren.\n\n**Warum es so schnell geht**: Bei feucht-milder Witterung um 15 bis 20 °C dauert ein Zyklus nur **vier bis sieben Tage**, und eine einzige befallene Pflanze setzt Millionen Sporen frei. Aus einem unauffälligen Herd wird binnen zwei Wochen ein vernichteter Schlag.\n\n**Die Bekämpfung ist konsequent vorbeugend.** Kurativ ist praktisch nichts zu erreichen. In der Praxis heißt das:\n- **Prognosemodelle** wie SIMPHYT und ISIP bestimmen den Spritzstart und die Abstände; behandelt wird nach Infektionsdruck, nicht nach Kalender\n- **Sieben bis zwölf Behandlungen** je Saison sind in feuchten Jahren normal, mit Abständen von sieben bis zehn Tagen\n- **Wirkstoffwechsel** ist zwingend — gegen Phenylamide bestehen seit den 1980er-Jahren verbreitete Resistenzen\n- **Im Ökolandbau** steht allein **Kupfer** zur Verfügung, begrenzt auf 4 kg/ha und Jahr; das reicht in schweren Jahren nicht, weshalb der Ökokartoffelbau erhebliche Ertragsrisiken trägt\n\n**Ackerbaulich** zählen gesundes Pflanzgut, das Beseitigen von **Abfallhaufen** als wichtigster Primärinfektionsquelle, weite Reihen und luftige Lagen für rasches Abtrocknen, das Entfernen von Durchwuchskartoffeln und eine rechtzeitige **Krautabtötung**, damit der Erreger nicht vom sterbenden Kraut in die Knollen wandert — siehe [[desikace]].",
    "related": [
      "fungicidy",
      "zemak",
      "mandelinka-bramborova",
      "desikace"
    ]
  },
  {
    "slug": "fuzarioza",
    "term": "Ährenfusariose",
    "alias": [
      "Fusarium",
      "Partieller Taubährigkeit",
      "Fusarium graminearum"
    ],
    "kategorie": "ochrana",
    "shortDef": "Die Ährenfusariose ist weniger ein Ertrags- als ein Qualitätsproblem: Der Pilz bildet Mykotoxine, für die gesetzliche Höchstgehalte gelten.",
    "longDef": "Verursacht wird die Ährenfusariose von mehreren *Fusarium*-Arten, in Mitteleuropa vor allem *F. graminearum* und *F. culmorum*. Befallene Ährchen bleichen vorzeitig aus, während der Rest der Ähre grün bleibt — daher der Name **partielle Taubährigkeit**. Bei feuchter Witterung zeigt sich an der Basis der Ährchen ein lachsrosa Sporenlager.\n\n**Der eigentliche Schaden ist nicht der Ertrag, sondern das Gift.** *Fusarium* bildet **Mykotoxine**, allen voran **Deoxynivalenol (DON)** und **Zearalenon (ZEA)**. Für sie gelten EU-weit **gesetzliche Höchstgehalte** in Lebensmitteln und Orientierungswerte in Futtermitteln. Eine Partie, die den DON-Grenzwert überschreitet, ist nicht verkehrsfähig — unabhängig davon, wie gut Ertrag und Hektolitergewicht sind. Schweine reagieren auf DON besonders empfindlich; schon geringe Gehalte senken Futteraufnahme und Fruchtbarkeit.\n\n**Das Infektionsfenster ist extrem eng.** Infiziert wird ausschließlich während der **Blüte**, BBCH 61 bis 69, und nur, wenn es in dieser Zeit regnet oder länger feucht ist. Regnet es zur Blüte nicht, gibt es praktisch keinen Befall — egal wie hoch der Ausgangsdruck war.\n\n**Die Bekämpfung ist zu drei Vierteln ackerbaulich**, und das ist der entscheidende Punkt:\n1. **Vorfrucht** — Mais ist der Risikofaktor Nummer eins, weil *Fusarium* auf Maisstoppeln überdauert. Weizen nach Mais bei pflugloser Bestellung ist die gefährlichste Konstellation überhaupt\n2. **Stoppelbearbeitung** — gründliches Zerkleinern und Einmischen der Maisstoppeln senkt das Inokulum erheblich; wendende Bearbeitung ist die sicherste Variante\n3. **Sortenwahl** — die Anfälligkeitseinstufungen des Bundessortenamtes unterscheiden sich stark\n4. **Fungizid zur Blüte** — mit Prothioconazol oder Metconazol, siehe [[prothiokonazol]], ausgebracht innerhalb weniger Tage nach dem infektionsgünstigen Regen; Prognosemodelle der Länderdienste unterstützen die Terminierung\n\nEin Fungizid allein kann eine falsche Fruchtfolge nicht ausgleichen — es senkt den DON-Gehalt typischerweise um die Hälfte, nicht auf null.",
    "related": [
      "fungicidy",
      "ozim-jarin",
      "osevni-postup",
      "no-till",
      "septorioza",
      "rzi"
    ]
  },
  {
    "slug": "septorioza",
    "term": "Blattdürre (Septoria)",
    "alias": [
      "Zymoseptoria tritici",
      "Septoria-Blattdürre",
      "Blatt- und Spelzenbräune"
    ],
    "kategorie": "ochrana",
    "shortDef": "Die Blattdürre ist die wichtigste Weizenkrankheit Mitteleuropas — sie kostet unbehandelt 20 bis 50 % Ertrag und hat die Fungizidstrategie im Getreide grundlegend geprägt.",
    "longDef": "Erreger ist *Zymoseptoria tritici*, früher *Septoria tritici*. Die Blattdürre ist in Deutschland und Österreich die **wirtschaftlich bedeutendste Krankheit im Winterweizen**.\n\n**Das Schadbild** beginnt als blassgrüne, später hellbraune, längliche Flecken zwischen den Blattadern; darin bilden sich die dunklen **Pyknidien**, die mit bloßem Auge als schwarze Punkte erkennbar sind — sie sind das entscheidende Unterscheidungsmerkmal gegenüber physiologischen Blattflecken und gegenüber DTR.\n\n**Der Infektionsverlauf erklärt, warum die Krankheit so schwer zu fassen ist.** Die Sporen werden durch **Regentropfen von unten nach oben** gespritzt — nicht vom Wind getragen. Die Krankheit arbeitet sich also Blattetage für Blattetage nach oben, und zwar nur, wenn es regnet. Entscheidend ist die **lange latente Phase**: Zwischen Infektion und sichtbarem Fleck liegen je nach Temperatur **zwei bis vier Wochen**. Wer erst behandelt, wenn er etwas sieht, behandelt eine Infektion, die längst gelaufen ist.\n\nDaraus folgt die gesamte Bekämpfungsstrategie: Sie richtet sich nach **Niederschlagsereignissen und Blattetagenentwicklung**, nicht nach Symptomen. Die **Fahnenblattbehandlung** um BBCH 37 bis 39 ist die wichtigste Maßnahme überhaupt, denn Fahnenblatt und darunterliegendes Blatt leisten den größten Teil der Kornfüllung.\n\n**Die Resistenzgeschichte ist ein Lehrstück.** Zuerst fielen die **Strobilurine**: Die Mutation G143A hob ihre Wirkung ab 2002/2003 innerhalb weniger Jahre europaweit vollständig auf, siehe [[azoxystrobin]]. Danach ließ die Leistung der **Azole** schrittweise nach. Als 2019 auch noch **Chlorthalonil** als letzter breit verfügbarer Multisite-Partner die EU-Genehmigung verlor, verschärfte sich die Lage erheblich. Heute tragen **SDHI**-Wirkstoffe und das neuere **Fenpicoxamid** die Bekämpfung, ergänzt durch **Folpet** als Resistenzbremse.\n\n**Vorbeugend wirkt vor allem die Sortenwahl** — die Einstufungen des Bundessortenamtes weisen erhebliche Unterschiede aus — sowie eine spätere Saat, die dem Herbstbefall die Zeit nimmt, und eine nicht überzogene Bestandesdichte.",
    "related": [
      "fuzarioza",
      "rzi",
      "fungicidy",
      "ozim-jarin",
      "osevni-postup"
    ]
  },
  {
    "slug": "rzi",
    "term": "Roste",
    "alias": [
      "Gelbrost",
      "Braunrost",
      "Schwarzrost",
      "Puccinia"
    ],
    "kategorie": "ochrana",
    "shortDef": "Roste sind Pilzkrankheiten mit auffällig gefärbten Sporenlagern; der Gelbrost ist in Mitteleuropa der explosivste und gefährlichste von ihnen.",
    "longDef": "Roste sind obligat biotrophe Pilze der Gattung *Puccinia*, die auffällige, pulverige Sporenlager auf Blättern und Halmen bilden. Drei Arten sind im Getreide bedeutsam.\n\n**Gelbrost** (*Puccinia striiformis*) bildet zitronengelbe Pusteln, die auf entwickelten Blättern in **Streifen entlang der Blattadern** angeordnet sind — das sicherste Erkennungsmerkmal. Er ist der **gefährlichste** der drei: Er beginnt schon bei 10 bis 15 °C, also sehr früh im Frühjahr, breitet sich bei kühl-feuchter Witterung explosionsartig aus und kann in wenigen Wochen 40 bis 50 % Ertrag kosten. Ab 2011 sorgte die neue Rassengruppe **Warrior** dafür, dass zuvor als resistent geltende Sorten schlagartig anfällig wurden — ein Beispiel dafür, wie schnell Sortenresistenz zusammenbrechen kann.\n\n**Braunrost** (*P. triticina*) zeigt rostbraune, ungeordnet verteilte Pusteln. Er braucht Wärme von 15 bis 22 °C und tritt daher später auf, meist ab der Blüte. Weil er das Fahnenblatt in der Kornfüllung angreift, ist auch er ertragsrelevant.\n\n**Schwarzrost** (*P. graminis*) galt in Mitteleuropa lange als verschwunden, tritt seit einigen Jahren aber in warmen Sommern wieder auf.\n\n**Der Zwischenwirt** ist historisch aufschlussreich: Der Schwarzrost braucht für seinen vollständigen Zyklus die **Berberitze**. Deren großflächige Ausrottung im 19. und 20. Jahrhundert war eine der ersten organisierten Pflanzenschutzmaßnahmen der Geschichte.\n\n**Bekämpfung**: Roste gehören zu den wenigen Getreidekrankheiten, bei denen **Azole und Strobilurine noch zuverlässig wirken** — hier ist der Strobilurinanteil im Fungizid tatsächlich sinnvoll, anders als gegen [[septorioza]]. Weil sich Gelbrost so schnell aufbaut, ist eine kurative Behandlung bei Befallsbeginn möglich und wirksam; entscheidend ist die regelmäßige Bestandeskontrolle ab dem Schossen. Vorbeugend ist die Sortenresistenz der stärkste Hebel — mit dem genannten Vorbehalt, dass sie brechen kann.",
    "related": [
      "fuzarioza",
      "septorioza",
      "fungicidy",
      "ozim-jarin"
    ]
  },
  {
    "slug": "mandelinka-bramborova",
    "term": "Kartoffelkäfer",
    "alias": [
      "Leptinotarsa decemlineata",
      "Colorado potato beetle"
    ],
    "kategorie": "ochrana",
    "shortDef": "Der Kartoffelkäfer ist der wichtigste tierische Schädling der Kartoffel und weltweit berüchtigt für seine rasche Resistenzbildung.",
    "longDef": "*Leptinotarsa decemlineata* stammt aus Nordamerika, wo er ursprünglich an Wildnachtschatten lebte, und wurde Ende des 19. Jahrhunderts nach Europa eingeschleppt. Der gelb-schwarz längsgestreifte Käfer ist unverwechselbar; die Larven sind ziegelrot mit schwarzen Punktreihen.\n\n**Den Hauptschaden richten die Larven an.** Bei starkem Befall fressen sie den Bestand bis auf die Rippen kahl. Da der Ertrag unmittelbar von der grünen Blattfläche abhängt, führt Kahlfraß vor der Knollenbildung zu Totalausfall.\n\n**Der Zyklus**: Die Käfer überwintern im Boden und kommen im Mai bei etwa 15 °C Bodentemperatur an die Oberfläche. Jedes Weibchen legt 400 bis 800 Eier in Gelegen an die Blattunterseite. In Mitteleuropa entwickeln sich je nach Witterung eine bis zwei Generationen.\n\n**Die Bekämpfung** richtet sich gegen die **jungen Larvenstadien L1 und L2** — ältere Larven und die Käfer selbst sind deutlich schwerer zu erfassen. Als Bekämpfungsschwelle gelten grob **15 Larven je Pflanze** oder Befall an mehr als einem Drittel der Pflanzen.\n\n**Die Resistenzgeschichte ist beispiellos.** Der Kartoffelkäfer hat nacheinander Resistenzen gegen praktisch jede eingesetzte Wirkstoffgruppe entwickelt — DDT, Organophosphate, Carbamate, Pyrethroide und Neonikotinoide. Weltweit sind Resistenzen gegen über fünfzig Wirkstoffe dokumentiert. Er gilt damit als Musterbeispiel dafür, wie schnell ein Insekt mit vielen Nachkommen und mehreren Generationen je Jahr chemischen Druck beantwortet.\n\n**Daraus folgt ein striktes Resistenzmanagement**: Wirkungsweisen nach IRAC-Gruppen wechseln, innerhalb einer Generation **nie zweimal dieselbe Gruppe**, volle Aufwandmengen und Behandlung erst nach Schwellenüberschreitung.\n\n**Im Ökolandbau** wirkt *Bacillus thuringiensis* der Unterart *tenebrionis* gezielt gegen junge Larven, ebenso Spinosad. Ergänzend helfen weite Fruchtfolge — Kartoffeln möglichst weit vom Vorjahresschlag entfernt, denn die Käfer laufen zu Fuß —, frühe Sorten und das Absammeln in kleinen Beständen.",
    "related": [
      "zemak",
      "plisen-bramborova",
      "insekticidy"
    ]
  },
  {
    "slug": "msice-repna",
    "term": "Blattläuse an Rüben",
    "alias": [
      "Grüne Pfirsichblattlaus",
      "Myzus persicae",
      "Schwarze Bohnenblattlaus"
    ],
    "kategorie": "ochrana",
    "shortDef": "Blattläuse schaden an Zuckerrüben weniger durch das Saugen als durch die Übertragung der Vergilbungsviren — seit dem Verbot der Neonikotinoid-Beize das drängendste Problem des Rübenanbaus.",
    "longDef": "An Zuckerrüben treten vor allem die **Grüne Pfirsichblattlaus** (*Myzus persicae*) und die **Schwarze Bohnenblattlaus** (*Aphis fabae*) auf. Der direkte Saugschaden ist selten entscheidend — die eigentliche Gefahr ist die **Virusübertragung**.\n\n**Die Vergilbungsviren** — Beet Yellows Virus (BYV) und die Beet Mild Yellowing Viruses — verursachen ein Vergilben und Verdicken der älteren Blätter. Weil die Photosynthese zusammenbricht, sinken Rübenertrag und Zuckergehalt zugleich; **Verluste von 30 bis 50 % sind in starken Jahren belegt**. Eine Heilung gibt es nicht: Ist die Pflanze infiziert, bleibt sie es.\n\n**Warum das Thema so brisant geworden ist**: Bis 2018 hielt die neonikotinoide **Saatgutbeize** die Blattläuse in der empfindlichen Jugendphase zuverlässig fern. Mit dem EU-weiten Verbot der Freilandanwendung fiel dieser Schutz weg. Mehrere Mitgliedstaaten erteilten daraufhin **Notfallzulassungen** für die Rübenbeize — bis der **Europäische Gerichtshof 2023 entschied, dass genau das unzulässig ist**: Für ausdrücklich verbotene Anwendungen dürfen keine Notfallzulassungen mehr erteilt werden. Seither ist der Rübenanbau in Deutschland und Österreich auf Blattbehandlungen und ackerbauliche Maßnahmen angewiesen.\n\n**Die Bekämpfung** stützt sich damit auf:\n- **Monitoring** über Gelbschalen und die regionalen Warndienste, die den Zuflug melden\n- **Bekämpfungsschwellen**, die früh ansetzen, weil jede virusübertragende Laus zählt — die Schwelle liegt daher weit unter der eines reinen Saugschadens\n- **Selektive Wirkstoffe** wie Flonicamid und Spirotetramat, die Nützlinge schonen; breit wirkende Pyrethroide sind hier oft kontraproduktiv, weil sie Marienkäfer, Schwebfliegen und Schlupfwespen mit ausschalten und die Läuse zudem vielerorts resistent sind\n- **Toleranzzüchtung** — die aussichtsreichste Antwort: Erste Sorten mit Virustoleranz sind auf dem Markt und werden konsequent weiterentwickelt\n- **Ackerbaulich** frühe Saat für einen Entwicklungsvorsprung sowie das Beseitigen von Wirtspflanzen und Rübenmieten in der Umgebung",
    "related": [
      "insekticidy",
      "mandelinka-bramborova"
    ]
  },
  {
    "slug": "zavijec-kukuricny",
    "term": "Maiszünsler",
    "alias": [
      "Ostrinia nubilalis",
      "European corn borer"
    ],
    "kategorie": "ochrana",
    "shortDef": "Der Maiszünsler ist der wichtigste Maisschädling Mitteleuropas; seine Raupen fressen im Stängel und lassen die Pflanze knicken.",
    "longDef": "*Ostrinia nubilalis* ist ein unscheinbarer Kleinschmetterling, dessen Raupen sich in den Maisstängel bohren. Der Fraßgang unterbricht die Leitbahnen; die Pflanze knickt oberhalb der Bohrstelle ab, der Kolben bleibt klein oder fällt zu Boden.\n\n**Der zweite, oft unterschätzte Schaden**: Die Bohrlöcher sind Eintrittspforten für ***Fusarium***. Maiszünslerbefall und erhöhte **Mykotoxingehalte** im Erntegut hängen unmittelbar zusammen — bei Silomais für Milchkühe und bei Körnermais für Schweine ist das der wirtschaftlich schwerere Teil des Schadens.\n\n**Die Ausbreitung nach Norden** ist eine der deutlichsten Folgen des Klimawandels im Pflanzenschutz. Lange auf Süddeutschland, Österreich und den Oberrhein beschränkt, hat sich der Zünsler seit den 2000er-Jahren stetig nach Norden ausgedehnt und tritt inzwischen bis nach Norddeutschland auf.\n\n**Der Zyklus**: Die Raupen überwintern **in den Maisstoppeln** und verpuppen sich dort im Frühjahr. Die Falter fliegen ab Ende Juni und legen ihre Eier an die Blattunterseiten. Genau an diesem Punkt setzt die wirksamste Maßnahme an.\n\n**Die Stoppelbearbeitung ist die tragende Säule der Bekämpfung.** Gründliches **Zerschlagen der Maisstoppeln direkt nach der Ernte** mit Mulcher oder Stoppelbearbeitungsgerät, anschließendes tiefes Einarbeiten, tötet den überwiegenden Teil der überwinternden Raupen ab. In befallenen Regionen ordnen die Pflanzenschutzdienste der Länder das teils verbindlich an.\n\n**Der biologische Weg funktioniert hier ausgesprochen gut.** Die Schlupfwespe ***Trichogramma brassicae*** parasitiert die Eigelege. Ausgebracht wird sie in Kapseln, seit einigen Jahren überwiegend **per Drohne** — ein Verfahren, das im Mais inzwischen auf großer Fläche etabliert ist, keine Rückstände hinterlässt und in der Wirkung mit einer Insektizidbehandlung mithält. Der Termin richtet sich nach dem Flugverlauf aus Pheromon- und Lichtfallen.\n\n**Chemisch** stehen Diamide zur Verfügung; das Zeitfenster ist eng, weil nur die frisch geschlüpfte Raupe vor dem Einbohren erreichbar ist. Erschwerend kommt die Bestandeshöhe hinzu — im mannshohen Mais ist die Applikation ohne Spezialtechnik oder Drohne kaum noch möglich.",
    "related": [
      "fuzarioza",
      "insekticidy",
      "kukurice-silazni",
      "no-till"
    ]
  },
  {
    "slug": "fungicidy",
    "term": "Fungizide",
    "alias": [
      "fungicides",
      "Pilzbekämpfungsmittel",
      "Fungizidbehandlung"
    ],
    "kategorie": "ochrana",
    "shortDef": "Fungizide sind Pflanzenschutzmittel gegen Pilzkrankheiten. Wichtigste Klassen: Azole (DMI), Strobilurine (QoI), SDHI und Kontaktmittel. Eine Behandlung kostet als Richtwert 20 bis 100 €/ha.",
    "longDef": "Fungizide — von lateinisch *fungus* (Pilz) und *caedere* (töten) — sind **Pflanzenschutzmittel zum Schutz vor pilzlichen Krankheitserregern**. Grundlage ist EU-weit die Verordnung (EG) Nr. 1107/2009. Die **Zulassung der Mittel ist national**: In Deutschland erteilt sie das **BVL**, in Österreich das **BAES**. Wirkstoffe sind EU-weit genehmigt, Handelsnamen und zugelassene Indikationen unterscheiden sich dagegen von Land zu Land — maßgeblich ist immer die aktuelle Gebrauchsanleitung und das nationale Register.\n\n**Die wichtigsten Wirkstoffklassen:**\n\n**1. Azole (DMI — Demethylierungs-Inhibitoren):**\n- **Wirkungsweise**: Hemmung der Ergosterolbiosynthese in der Pilzzellmembran\n- **Wirkstoffe**: Tebuconazol, Prothioconazol, Metconazol, Mefentrifluconazol; Epoxiconazol ist in der EU nicht mehr genehmigt\n- **Spektrum**: breit — Septoria, Roste, Fusarium, Mehltau\n- **Systemisch**, mit kurativer Teilwirkung\n- **Resistenz**: Nach Jahrzehnten des Einsatzes ist die Leistung gegen Septoria deutlich zurückgegangen; als Mischpartner bleiben sie unverzichtbar\n- **Richtwert**: 15 bis 35 €/ha\n\n**2. Strobilurine (QoI — Quinone outside Inhibitors):**\n- **Wirkungsweise**: Blockade der mitochondrialen Atmungskette am Cytochrom b\n- **Wirkstoffe**: Azoxystrobin, Pyraclostrobin, Trifloxystrobin, Kresoxim-methyl\n- **Spektrum**: Mehltau und Roste — **gegen Septoria in Mitteleuropa praktisch wirkungslos**, seit dem Resistenzdurchbruch 2002/2003 durch die G143A-Mutation\n- **Nebeneffekt**: der bekannte **Greening-Effekt** — die Blätter bleiben sieben bis zehn Tage länger grün, was die Kornfüllung verlängern kann\n- **Richtwert**: 20 bis 50 €/ha\n\n**3. SDHI (Succinat-Dehydrogenase-Inhibitoren):**\n- **Wirkungsweise**: Blockade von Komplex II der Atmungskette\n- **Wirkstoffe**: Fluxapyroxad, Bixafen, Benzovindiflupyr, Fluopyram, Pydiflumetofen\n- **Spektrum**: Septoria, Fusarium, Mehltau, Roste — derzeit die leistungsstärkste Klasse im Getreide\n- **Resistenz**: erste Verschiebungen bei Septoria sind belegt, deshalb ausschließlich in Mischung mit einer zweiten Wirkungsweise einsetzen\n- **Richtwert**: 35 bis 65 €/ha\n- **Praxisstandard**: SDHI plus Azol ist die Basis der Blattbehandlung in Weizen\n\n**4. Fenpicoxamid (QiI) — neue Wirkungsweise:**\n- Erste Vertreterin einer eigenen Klasse (Quinone inside Inhibitor) im Getreide\n- Hohe Leistung gegen Septoria, bislang keine Resistenz bekannt\n- **Richtwert**: 50 bis 75 €/ha\n\n**5. Kontaktfungizide mit mehreren Angriffsorten (Multisite):**\n- **Folpet** — der wichtigste verbliebene Multisite-Partner im Getreide, wirkt resistenzbrechend als Mischpartner\n- **Kupfer** (Kupferhydroxid, -oxychlorid) — im ökologischen wie im konventionellen Anbau zugelassen, EU-Obergrenze 4 kg Kupfer je Hektar und Jahr; Einsatz gegen Kraut- und Knollenfäule sowie Falschen Mehltau\n- **Schwefel** — gegen Echten Mehltau und Spinnmilben, auch im Ökolandbau\n- **Mancozeb** — EU-weit **seit 2021 nicht mehr genehmigt**, die Aufbrauchfristen sind ausgelaufen\n- **Chlorthalonil** — seit 2019 EU-weit verboten; sein Wegfall hat die Resistenzstrategie im Weizen erheblich erschwert\n\n**6. Anilinopyrimidine**: Cyprodinil, Pyrimethanil — Methioninbiosynthese; gegen Halmbruch, Botrytis und Monilia\n\n**7. Cymoxanil**: kurze, kurative Wirkung von drei bis vier Tagen, stets in Kombination gegen Kraut- und Knollenfäule\n\n**8. Phenylamide** (Metalaxyl-M): spezifisch gegen Oomyceten, hoher Resistenzdruck seit den 1980er-Jahren\n\n**Applikationstechnik:**\n- **Anbauspritze** (600 bis 1.200 l Behälter) für kleinere Betriebe, **Anhängespritze** (1.500 bis 6.000 l) für mittlere, **Selbstfahrer** für große Schläge\n- Arbeitsbreiten von 18 bis 36 m sind heute Standard, in Fahrgassenabständen von 24 m oder mehr\n- **Wasseraufwand** 150 bis 300 l/ha bei 2 bis 4 bar\n- **Abdriftminderung**: In Deutschland regeln die Anwendungsbestimmungen des BVL verbindliche Abstandsauflagen zu Gewässern und Saumbiotopen; abdriftmindernde Düsen der Klassen 50 bis 90 % erlauben geringere Abstände\n\n**Zusatzstoffe**: Öle und Netzmittel verbessern Benetzung und Aufnahme, siehe [[adjuvant]]\n\n**Resistenzmanagement — die fünf Regeln:**\n1. In jeder Behandlung **mindestens zwei Wirkungsweisen** kombinieren\n2. Dieselbe Wirkungsweise **höchstens zweimal je Saison**, bei SDHI und Strobilurinen möglichst nur einmal\n3. **Wechsel** der Wirkstoffklassen zwischen den Behandlungen und Jahren\n4. **Resistente Sorten** nutzen — die günstigste Maßnahme überhaupt\n5. **Ackerbauliche Hebel**: Fruchtfolge, Stoppelbearbeitung, angepasste Bestandesdichte und Saattermin\n\n**Behandlungsschema Winterweizen (Orientierung):**\n- **T1** (BBCH 30 bis 32): Halmbruch und frühe Septoria — Azol, ggf. plus Folpet\n- **T2** (BBCH 37 bis 39): Fahnenblatt — SDHI plus Azol; **die wichtigste und rentabelste Behandlung**\n- **T3** (BBCH 61 bis 65): Ährenbehandlung gegen Fusarium — Azol, insbesondere Prothioconazol oder Metconazol\n- **Saisonkosten**: als Richtwert 100 bis 190 €/ha\n\n**Wirtschaftlichkeit**: In einem infektionsstarken Jahr kostet ein vollständiger Verzicht 30 bis 50 % Ertrag; eine alleinige Fahnenblattbehandlung sichert bereits einen Großteil davon. In trockenen Jahren mit geringem Krankheitsdruck kann sie umgekehrt die einzige lohnende Maßnahme sein — deshalb Entscheidungen an Bekämpfungsschwellen und Prognosemodellen ausrichten, nicht am Kalender.\n\n**Rechtlicher Rahmen**: Sachkundenachweis für Anwender, geprüfte Spritze mit Kontrolle alle drei Jahre, Aufzeichnungspflicht über alle Anwendungen, Rückstandshöchstgehalte (MRL) nach Verordnung (EG) Nr. 396/2005 sowie die Grundsätze des integrierten Pflanzenschutzes, die in Deutschland und Österreich verbindlich sind.\n\nSiehe auch [[plisen-bramborova]], [[fuzarioza]], [[septorioza]], [[rzi]], [[insekticidy]], [[herbicidy]].",
    "related": [
      "plisen-bramborova",
      "fuzarioza",
      "septorioza",
      "rzi",
      "insekticidy",
      "herbicidy"
    ]
  },
  {
    "slug": "herbicidy",
    "term": "Herbizide",
    "alias": [
      "herbicides",
      "Unkrautbekämpfungsmittel",
      "Unkrautvernichter"
    ],
    "kategorie": "ochrana",
    "shortDef": "Herbizide sind Mittel gegen Unkräuter und Ungräser. Glyphosat ist der weltweit meistverwendete Wirkstoff. Selektive Herbizide erfassen nur bestimmte Arten, Totalherbizide alles Grüne.",
    "longDef": "Herbizide — von lateinisch *herba* (Kraut) und *caedere* (töten) — sind **Mittel gegen Unkräuter und Ungräser** und der größte Teilmarkt im Pflanzenschutz. Ohne sie wären die heutigen Erträge auf großen Flächen nicht zu halten, denn mechanische Regulierung allein stößt bei Arbeitszeit und Witterungsfenstern schnell an Grenzen.\n\n**Einteilung nach Selektivität:**\n\n**Totalherbizide** erfassen alle grünen Pflanzen:\n- **Glyphosat** — siehe [[roundup]]\n- **Glufosinat** — in der EU seit 2018 **nicht mehr genehmigt**\n- **Diquat** — seit 2019 **nicht mehr genehmigt**\n- **Paraquat** — bereits seit 2007 verboten\n- **Pelargonsäure** — natürlicher Wirkstoff, nur kontaktwirksam, deutlich teurer\n\n**Selektive Herbizide** erfassen nur bestimmte Artengruppen:\n\n*Gegen zweikeimblättrige Unkräuter im Getreide*: Wuchsstoffe wie MCPA und 2,4-D, Sulfonylharnstoffe wie Tribenuron und Metsulfuron, Florasulam, Halauxifen\n\n*Gegen Ungräser im Getreide*: Pinoxaden, Mesosulfuron plus Iodosulfuron, Flufenacet plus Diflufenican im Vorauflauf, Prosulfocarb\n\n*Gegen Ungräser in zweikeimblättrigen Kulturen*: Quizalofop, Fluazifop, Clethodim, Cycloxydim\n\n*Vorauflauf*: Pendimethalin, S-Metolachlor, Flufenacet, Metribuzin — sie brauchen Bodenfeuchte, um zu wirken\n\n*Nachauflauf Mais*: Mesotrione, Tembotrione, Nicosulfuron, Dimethenamid-P; **Atrazin ist in der EU seit 2007 verboten**, in Deutschland sogar schon seit 1991\n\n**Wirkungsweisen nach HRAC-Gruppen:**\n- **Gruppe 1** — ACCase-Hemmer: Ungrasmittel, hoher Resistenzdruck\n- **Gruppe 2** — ALS-Hemmer (Sulfonylharnstoffe): weltweit die meisten Resistenzfälle\n- **Gruppe 5** — Photosystem-II-Hemmer: Triazine, Metribuzin\n- **Gruppe 9** — EPSPS-Hemmer: Glyphosat\n- **Gruppe 14** — PPO-Hemmer: Carfentrazone, Saflufenacil\n- **Gruppe 15** — Zellteilungshemmer: Flufenacet, S-Metolachlor\n- **Gruppe 27** — HPPD-Hemmer: Mesotrione, Tembotrione\n\n**Die wichtigsten Problemarten in Mitteleuropa:**\n\n*Im Getreide*: **Acker-Fuchsschwanz** (*Alopecurus myosuroides*) — das Leitunkraut schlechthin, mit weit verbreiteter Resistenz gegen ACCase- und ALS-Hemmer; **Gemeiner Windhalm** (*Apera spica-venti*), ebenfalls zunehmend resistent; **Klettenlabkraut** (*Galium aparine*); **Kamille-Arten**; **Klatschmohn**; **Kornblume**; **Gemeine Quecke** (*Elymus repens*)\n\n*Im Mais*: **Weißer Gänsefuß** (*Chenopodium album*), **Melden**, **Borstenhirsen** (*Setaria*), **Hühnerhirse** (*Echinochloa crus-galli*), zunehmend **Ambrosie** und **Samtpappel**\n\n*Im Raps*: **Kamille**, **Klettenlabkraut**, **Ausfallgetreide**, **Storchschnabel**\n\n*In Zuckerrüben*: **Gänsefuß**, **Melde**, **Windenknöterich**; klassisch über wiederholte Kleinstmengen im Nachauflauf, zunehmend über Hacktechnik mit Kamerasteuerung\n\n**Herbizidresistenz — das drängendste Problem:**\n\nIn Deutschland ist der Acker-Fuchsschwanz der Härtefall: Auf vielen Standorten mit engen Getreidefruchtfolgen und pflugloser Bestellung wirken weder ACCase- noch ALS-Hemmer noch zuverlässig. Weltweit gelten Amaranthus-Arten in den USA und Weidelgras in Australien als Musterbeispiele der Mehrfachresistenz.\n\n**Gegenstrategien** — chemisch allein nicht lösbar:\n1. **Fruchtfolge weiten**, Sommerungen und Blattfrüchte einbauen\n2. **Saattermin verschieben** — späte Saat des Winterweizens senkt den Fuchsschwanzdruck deutlich\n3. **Pflug wendend** einsetzen, zumindest gelegentlich\n4. **Falsches Saatbett** zum Auflaufenlassen und Abtöten\n5. **Wirkungsweisen wechseln und mischen**, volle Aufwandmenge statt Sparlösungen\n6. **Mechanische Verfahren** — Striegel, Hacke mit Kamerasteuerung, Bandspritzung\n7. **Samenernte verhindern** — Nester ausreißen, Erntegut trennen\n\n**Nichtchemische und neue Verfahren:**\n- **Striegel und Hacke** — im Ökolandbau Standard, im konventionellen Anbau mit RTK-Lenkung und Kamerasteuerung stark im Kommen\n- **Bandspritzung mit Hacke** — spart bis zu zwei Drittel des Mittels\n- **Punktapplikation** über Kameraerkennung — Einsparungen von 60 bis 90 % auf Stoppel und in Reihenkulturen\n- **Thermische Verfahren** und **Elektroherbizide** — für Sonderfälle\n\n**Anwendungstechnik**: 100 bis 300 l Wasser je Hektar; Bodenherbizide brauchen gute Verteilung und feuchten Boden, Blattherbizide feine Tropfen und wüchsige Bedingungen. Abstandsauflagen zu Gewässern und die Vorgaben zu abdriftmindernden Düsen sind verbindlich.\n\n**Kosten als Richtwert**: Getreide 60 bis 130 €/ha für das gesamte Programm, Mais 60 bis 110 €/ha, Zuckerrüben 130 bis 220 €/ha.\n\nSiehe auch [[roundup]], [[fungicidy]], [[insekticidy]], [[desikace]], [[ozim-jarin]].",
    "related": [
      "roundup",
      "fungicidy",
      "insekticidy",
      "desikace",
      "ozim-jarin"
    ]
  },
  {
    "slug": "insekticidy",
    "term": "Insektizide",
    "alias": [
      "insecticides",
      "Insektenbekämpfungsmittel",
      "Schädlingsbekämpfungsmittel"
    ],
    "kategorie": "ochrana",
    "shortDef": "Insektizide sind Mittel gegen Schadinsekten. Wichtigste Klassen: Pyrethroide, Diamide und Spinosyne — Neonikotinoide sind in der EU für Freilandanwendungen seit 2018 weitgehend verboten.",
    "longDef": "Insektizide — von lateinisch *insectum* und *caedere* — sind **Mittel gegen Schadinsekten**. Ihr Einsatz ist der konfliktreichste Bereich des Pflanzenschutzes, weil er unmittelbar den Schutz von Bienen und Nützlingen berührt.\n\n**Die wichtigsten Klassen nach IRAC-Gruppen:**\n\n**1. Pyrethroide** (Gruppe 3 — Natriumkanal-Modulatoren):\n- **Wirkstoffe**: Lambda-Cyhalothrin, Deltamethrin, Cypermethrin, Tau-Fluvalinat, Etofenprox\n- **Spektrum**: breit — Blattläuse, Käfer, Raupen, Wanzen\n- **Wirkung**: sehr schneller Knock-down, aber kurze Dauerwirkung von sieben bis zehn Tagen; die Wirkung lässt bei Temperaturen über 20 °C spürbar nach\n- **Resistenz**: ausgeprägt — bei Rapsglanzkäfer, Kartoffelkäfer und Getreideblattläusen vielerorts nicht mehr ausreichend\n- **Bienengefährdung**: als B1 bis B4 eingestuft; **nicht in blühende Bestände oder bei Bienenflug ausbringen**\n- **Richtwert**: 8 bis 20 €/ha\n\n**2. Neonikotinoide** (Gruppe 4 — Acetylcholinrezeptor-Agonisten):\n- **Wirkstoffe**: Imidacloprid, Thiamethoxam, Clothianidin, Acetamiprid\n- **EU-Stand**: Für Imidacloprid, Thiamethoxam und Clothianidin sind **alle Freilandanwendungen seit 2018 verboten**, ebenso die Beizung von Freilandkulturen. Der EuGH hat 2023 klargestellt, dass Mitgliedstaaten dafür auch **keine Notfallzulassungen** mehr erteilen dürfen — das betraf unmittelbar die Zuckerrübenbeizung. **Acetamiprid** ist weiterhin genehmigt, steht aber unter Beobachtung\n- **Grund**: hohe Bienentoxizität und Persistenz im Boden mit Aufnahme durch Folgekulturen\n- **Systemisch**: wandert in der Pflanze, wirkt zwei bis vier Wochen\n\n**3. Diamide** (Gruppe 28 — Ryanodinrezeptor-Modulatoren):\n- **Wirkstoffe**: Chlorantraniliprole, Cyantraniliprole\n- **Spektrum**: Raupen, Käferlarven, Maiszünsler, Kartoffelkäfer\n- **Bienensicherheit**: als bienenungefährlich (B4) eingestuft und daher ein zentraler Baustein im integrierten Pflanzenschutz\n- **Richtwert**: 40 bis 80 €/ha\n\n**4. Spinosyne** (Gruppe 5): Spinosad und Spinetoram, gewonnen aus dem Bodenbakterium *Saccharopolyspora spinosa*. Spinosad ist auch im Ökolandbau zugelassen. Für Bienen im Spritzbelag gefährlich, daher **abends nach dem Bienenflug** ausbringen\n\n**5. Selektive Wirkstoffe gegen saugende Schädlinge:**\n- **Flonicamid** (Gruppe 29) — stoppt die Nahrungsaufnahme von Blattläusen binnen Stunden, bienenungefährlich\n- **Spirotetramat** (Gruppe 23) — zweiseitig systemisch, wirkt auch an Wurzelläusen\n- **Pymetrozin** — in der EU seit 2020 nicht mehr genehmigt\n\n**6. Akarizide gegen Spinnmilben**: Hexythiazox, Abamectin, Spirodiclofen, Bifenazat, Acequinocyl\n\n**7. Biologische Mittel:**\n- ***Bacillus thuringiensis*** — je nach Unterart gegen Raupen (kurstaki), Käferlarven (tenebrionis) oder Mückenlarven (israelensis); für Wirbeltiere und Bienen unbedenklich, Wirkdauer nur drei bis sieben Tage\n- **Azadirachtin** aus dem Niembaum — Fraßhemmung und Entwicklungsstörung\n- **Pyrethrine** aus Chrysanthemen — sehr kurze Wirkung, im Ökolandbau zugelassen\n- ***Beauveria bassiana***, ***Metarhizium*** — entomopathogene Pilze\n- **Nützlingseinsatz** — im Gewächshaus längst Standard: Schlupfwespen gegen Weiße Fliege, Raubmilben gegen Spinnmilben; im Freiland Trichogramma-Schlupfwespen gegen den Maiszünsler, ausgebracht per Drohne\n\n**Bekämpfungsschwellen — Beispiele:**\n- **Kartoffelkäfer**: etwa 15 Larven je Pflanze beziehungsweise Befall an mehr als einem Drittel der Pflanzen; behandelt wird gegen junge Larvenstadien\n- **Rapsglanzkäfer**: im Knospenstadium je nach Bestandesentwicklung 5 bis 15 Käfer je Pflanze — bei kräftigen Beständen deutlich höher als früher angenommen\n- **Maiszünsler**: Behandlung sieben bis zehn Tage nach dem Flughöhepunkt aus Pheromon- oder Lichtfallen\n- **Getreideblattläuse**: zur Blüte und Milchreife bei Befall von mehr als 60 bis 70 % der Ähren\n\n**Bienenschutz — verbindlich, nicht freiwillig:**\nIn Deutschland regelt die **Bienenschutzverordnung** den Umgang mit bienengefährlichen Mitteln; in Österreich gelten entsprechende Landesbestimmungen. Die Kernregeln:\n1. Als **B1 eingestufte Mittel** dürfen nicht in blühende oder von Bienen beflogene Bestände ausgebracht werden — auch blühende Unkräuter im Bestand zählen dazu\n2. **B2-Mittel** nur nach dem täglichen Bienenflug, also am späten Abend\n3. **Tankmischungen** können die Bienengefährlichkeit erhöhen, selbst wenn beide Partner einzeln als ungefährlich gelten — insbesondere Pyrethroid plus Azol\n4. **Imker in der Umgebung informieren**\n5. Abstand zu blühenden Säumen und Blühstreifen einhalten\n\n**Resistenzmanagement**: Wirkungsweisen konsequent wechseln, dieselbe IRAC-Gruppe nicht zweimal hintereinander in derselben Generation einsetzen, volle Aufwandmengen verwenden und Schwellenwerte einhalten, statt vorbeugend zu spritzen.\n\n**Integrierter Pflanzenschutz** ist in der EU rechtlich verbindlich: Monitoring mit Gelbschalen, Pheromon- und Lichtfallen, Entscheidung nach Bekämpfungsschwelle, Nutzung von Fruchtfolge, Sortenwahl und Saatzeit, Förderung von Nützlingen durch Blühstreifen und Saumstrukturen — chemische Bekämpfung erst als letzte Stufe.\n\nSiehe auch [[mandelinka-bramborova]], [[msice-repna]], [[zavijec-kukuricny]], [[fungicidy]], [[herbicidy]].",
    "related": [
      "mandelinka-bramborova",
      "msice-repna",
      "zavijec-kukuricny",
      "fungicidy",
      "herbicidy"
    ]
  },
  {
    "slug": "desikace",
    "term": "Sikkation",
    "alias": [
      "desiccation",
      "Vorerntebehandlung",
      "Krautabtötung"
    ],
    "kategorie": "ochrana",
    "shortDef": "Sikkation ist das gezielte Abtöten des Bestandes vor der Ernte, um die Abreife zu vereinheitlichen und den Drusch zu erleichtern. In Deutschland ist sie im Getreide praktisch bedeutungslos, bei Kartoffeln dagegen unverzichtbar.",
    "longDef": "Sikkation — von lateinisch *desiccare* (austrocknen) — ist die **gezielte Abtötung des Bestandes vor der Ernte**. Ziel ist es, die Abreife zu vereinheitlichen, den Feuchtegehalt zu senken und den Drusch beziehungsweise die Rodung zu erleichtern.\n\n**Wozu Sikkation dient:**\n1. **Vereinheitlichung der Abreife** — Bestände reifen ungleichmäßig ab, etwa Raps zwischen Haupttrieb und Seitentrieben\n2. **Senkung der Kornfeuchte** und damit der Trocknungskosten\n3. **Erleichterung des Drusches** — trockenes Material läuft besser durch den Mähdrescher, mit weniger Verlusten\n4. **Krautabtötung bei Kartoffeln** — Voraussetzung für eine schalenfeste Knolle und Schutz vor der Übertragung der Krautfäule auf die Knollen\n5. **Miterfassung durchgewachsener Unkräuter**\n\n**Verfügbare Wirkstoffe und ihr Status:**\n\n- **Diquat** — jahrzehntelang der Standard bei Kartoffeln, in der EU **seit 2019 nicht mehr genehmigt**. Sein Wegfall hat die Krautabtötung grundlegend verändert\n- **Glufosinat** — in der EU **seit 2018 nicht mehr genehmigt**\n- **Carfentrazone-ethyl** und **Pyraflufen-ethyl** — PPO-Hemmer, die heute die chemische Krautabtötung bei Kartoffeln tragen; sie wirken rein über den Kontakt und benötigen daher gute Benetzung und meist zwei Überfahrten\n- **Pelargonsäure** — natürlicher Kontaktwirkstoff, auch im Ökolandbau nutzbar, hoher Wasseraufwand und hohe Kosten\n- **Glyphosat** — systemisch, für die Vorerntebehandlung technisch geeignet, in der Praxis aber weitgehend ausgeschlossen (siehe unten)\n\n**Warum Sikkation im deutschen Getreide praktisch keine Rolle spielt:**\nAnders als in Nordamerika oder Teilen Osteuropas ist die Vorerntebehandlung von Getreide mit Glyphosat hierzulande kein Standard. Die Anwendung von Glyphosat ist in Deutschland durch die **Pflanzenschutz-Anwendungsverordnung** stark eingeschränkt — unter anderem in Haus- und Kleingärten, auf öffentlichen Flächen sowie in Wasserschutz- und Naturschutzgebieten — und die Vorerntebehandlung ist nur in eng umgrenzten Ausnahmefällen zulässig. Entscheidend ist daneben der Markt: **Mühlen, Mälzereien und der Handel schließen Getreide aus sikkierten Beständen in ihren Lieferbedingungen regelmäßig aus.** Wer Backweizen oder Braugerste vermarktet, kann es sich schlicht nicht leisten. Die Abreife wird stattdessen über Sortenwahl, Saattermin und Bestandesführung gesteuert.\n\n**Kartoffeln — der eigentliche Anwendungsfall:**\nDie Krautabtötung erfolgt zwei bis drei Wochen vor der Rodung. Sie ist notwendig, damit die Schale abhärtet, die Knollen beim Roden nicht beschädigt werden und der Erreger der Kraut- und Braunfäule nicht vom absterbenden Kraut in die Knollen wandert. Nach dem Wegfall von Diquat hat sich ein **kombiniertes Verfahren** durchgesetzt:\n1. **Mechanisches Krautschlagen** mit dem Krautschläger als erster Schritt\n2. **Chemische Nachbehandlung** mit einem PPO-Hemmer gegen Wiederaustrieb und gegen die Stängelreste\n3. Alternativ **elektrische Krautabtötung** — Verfahren wie XPower arbeiten mit Hochspannung und sind auch im Ökolandbau zugelassen; hoher Anschaffungspreis, geringe Flächenleistung, aber kein Wirkstoffeintrag\n4. Rein **mechanische Verfahren** mit Krautschlägen und Krautziehen im Ökolandbau\n\nDie Krautabtötung ist damit deutlich teurer und aufwendiger geworden als in der Diquat-Ära — als Richtwert 60 bis 130 €/ha statt früher rund 25 €/ha.\n\n**Raps**: In Mitteleuropa wird Raps meist ohne Sikkation gedroschen. Gegen Schotenplatzen setzt die Praxis stattdessen auf **Schotenversiegelungsmittel** auf Basis von Klebstoffen oder auf **Seitenmesser am Schneidwerk** und ein Rapsschneidwerk mit verlängertem Tisch. Wo doch behandelt wird, geschieht das im Stadium BBCH 85 bis 87.\n\n**Sonnenblume, Körnerleguminosen, Lein**: Hier ist eine ungleichmäßige Abreife typisch und eine Vorerntebehandlung fachlich am ehesten begründbar — die verfügbaren Zulassungen sind allerdings eng und je nach Kultur und Land unterschiedlich.\n\n**Rechtlicher Hinweis**: Zulassungen für die Vorerntebehandlung sind **kulturspezifisch und national** und ändern sich häufig. Verbindlich sind allein das Zulassungsregister des BVL beziehungsweise des BAES und die Gebrauchsanleitung des Mittels; hinzu kommen Wartezeiten und die Rückstandshöchstgehalte. Bei Vertragsware entscheiden zusätzlich die Lieferbedingungen des Abnehmers.\n\nSiehe auch [[herbicidy]], [[roundup]], [[kukurice-silazni]], [[repka-ozima]].",
    "related": [
      "roundup",
      "herbicidy",
      "repka-ozima",
      "zemak",
      "plisen-bramborova"
    ]
  },
  {
    "slug": "psenice-ozima",
    "term": "Winterweizen",
    "alias": [
      "Triticum aestivum",
      "winter wheat"
    ],
    "kategorie": "plodiny",
    "shortDef": "Winterweizen ist die wichtigste Ackerkultur Deutschlands mit rund 2,7 Mio. ha. Saat im Herbst, Ernte im Juli, Ertrag 75 bis 80 dt/ha. Die Qualitätsgruppen E, A, B und C entscheiden über den Preis.",
    "longDef": "Winterweizen ist mit etwa **2,6 bis 2,8 Mio. Hektar** die mit Abstand wichtigste Ackerkultur Deutschlands; in Österreich stehen rund 270.000 ha. Der mehrjährige Durchschnittsertrag liegt in Deutschland bei **75 bis 80 dt/ha**, auf besten Standorten deutlich darüber.\n\n**Die Qualitätsgruppen sind der Kern der deutschen Weizenvermarktung** und unterscheiden sich klar vom übrigen Europa:\n\n| Gruppe | Bezeichnung | Rohprotein | Verwendung |\n|---|---|---|---|\n| **E** | Eliteweizen | ab ca. 14 % | Aufmischweizen, Export |\n| **A** | Qualitätsweizen | ab ca. 13 % | Brot- und Brötchenmehl |\n| **B** | Brotweizen | ab ca. 12 % | Standardbackware |\n| **C** | Keks- und Futterweizen | unter 12 % | Gebäck, Futter |\n\nNeben dem Protein zählen die **Fallzahl** als Maß für die Auswuchsfestigkeit — gefordert werden meist mindestens 220 Sekunden — und das **Hektolitergewicht** von mindestens 76 kg/hl. Reißt eine dieser Größen, rutscht die Partie in die nächste Gruppe oder in den Futterbereich; der Preisunterschied entscheidet über das Ergebnis des Schlages.\n\n**Anbau im Jahresverlauf:**\n- **Saat** von Ende September bis Ende Oktober; 280 bis 380 Körner/m² je nach Termin, 2 bis 4 cm tief. Späte Saat ist der wirksamste Hebel gegen Acker-Fuchsschwanz und Virusvektoren\n- **Vorfrucht**: Raps, Körnerleguminosen und Zuckerrüben sind günstig. **Mais ist die kritische Vorfrucht**, weil die Stoppeln Fusarium tragen — dann ist wendende Bodenbearbeitung oder zumindest gründliches Zerkleinern Pflicht\n- **Stickstoff** in drei Gaben — Andüngung zu Vegetationsbeginn, Schossergabe zu BBCH 31/32, Qualitätsgabe zum Ährenschieben. Die Gesamtmenge ergibt sich verbindlich aus der **Düngebedarfsermittlung** nach Düngeverordnung; in roten Gebieten ist sie um 20 % zu unterschreiten\n- **Fungizide** in ein bis drei Behandlungen; die Fahnenblattbehandlung ist die wichtigste, die Ährenbehandlung gegen Fusarium die qualitätsentscheidende\n- **Ernte** ab Ende Juli bei 14 % Kornfeuchte\n\n**Die wichtigsten Krankheiten** sind [[septorioza]] als Leitkrankheit, [[rzi]] und [[fuzarioza]]; bei den Ungräsern dominiert der Acker-Fuchsschwanz mit verbreiteter Herbizidresistenz.\n\n**Wirtschaftlich** ist Weizen eine Kultur mit schmaler Marge: Erlös und Direktkosten liegen eng beieinander, sodass Direktzahlungen und Qualitätszuschläge regelmäßig über das Ergebnis entscheiden. Preise bewegen sich als Richtwert zwischen 180 und 230 €/t, orientiert am [[matif]] zuzüglich Basis.",
    "related": [
      "ozim-jarin",
      "osevni-postup",
      "fungicidy",
      "septorioza",
      "fuzarioza",
      "hektolitr",
      "psenice-jarni"
    ]
  },
  {
    "slug": "psenice-jarni",
    "term": "Sommerweizen",
    "alias": [
      "spring wheat",
      "Triticum aestivum"
    ],
    "kategorie": "plodiny",
    "shortDef": "Sommerweizen ist in Deutschland eine Nischen- und Ersatzkultur mit rund 40.000 ha — meist gesät, wenn der Winterweizen ausgewintert ist.",
    "longDef": "Sommerweizen steht in Deutschland auf rund 30.000 bis 50.000 Hektar und ist damit eine ausgesprochene Nischenkultur. Seine Bedeutung schwankt stark von Jahr zu Jahr, denn er ist in erster Linie **Ersatzkultur**: Wenn Winterweizen ausgewintert ist oder eine nasse Herbstbestellung misslungen ist, wird im Frühjahr nachgesät.\n\n**Der Vergleich mit dem [[psenice-ozima]]:**\n\n| Merkmal | Winterweizen | Sommerweizen |\n|---|---|---|\n| Saat | Ende September bis Oktober | Februar bis Anfang April |\n| Vegetationszeit | 280–310 Tage | 110–140 Tage |\n| Ertrag | 75–80 dt/ha | 45–60 dt/ha |\n| Stickstoffbedarf | 180–220 kg N/ha | 120–160 kg N/ha |\n| Bestockung | stark | schwach |\n\n**Die kurze Vegetationszeit bestimmt alles.** Sommerweizen bestockt kaum, weshalb die Saatstärke mit 400 bis 500 Körnern/m² deutlich höher liegt. Er muss außerdem so früh wie möglich in den Boden — jede Woche Verzug ab Mitte März kostet spürbar Ertrag, weil die Kornfüllung dann in die Sommertrockenheit fällt.\n\n**Zwei Argumente sprechen unabhängig von der Ersatzfunktion für ihn:**\n\nErstens die **Backqualität**: Sommerweizensorten erreichen regelmäßig hohe Proteingehalte und gehören zu den stärksten Aufmischweizen; im Ökolandbau ist er deshalb eine feste Größe.\n\nZweitens die **Fruchtfolgewirkung**: Eine Sommerung in einer winterungslastigen Fruchtfolge unterbricht den Entwicklungszyklus des Acker-Fuchsschwanzes wirksamer als jede Herbizidstrategie. Auf Betrieben mit Resistenzproblemen gewinnt er gerade deshalb wieder an Bedeutung.\n\n**Die Schwäche** ist die Trockenheitsempfindlichkeit: Der flache Wurzelraum und die späte Kornfüllung machen ihn in trockenen Frühsommern anfällig — genau in den Jahren also, die häufiger werden.",
    "related": [
      "psenice-ozima",
      "ozim-jarin",
      "osevni-postup",
      "fungicidy",
      "hektolitr"
    ]
  },
  {
    "slug": "jecmen-sladovnicky",
    "term": "Braugerste",
    "alias": [
      "Malzgerste",
      "malting barley",
      "Sommerbraugerste"
    ],
    "kategorie": "plodiny",
    "shortDef": "Braugerste wird für die Malzherstellung angebaut und verlangt einen niedrigen Eiweißgehalt von 9,5 bis 11,5 % — das Gegenteil der Zuchtrichtung bei Brotgetreide.",
    "longDef": "Braugerste ist Gerste, die für die Malz- und damit Bierherstellung angebaut wird. In Deutschland stehen dafür rund 300.000 bis 400.000 Hektar, überwiegend als Sommergerste; Schwerpunkte sind Bayern, Baden-Württemberg und Sachsen-Anhalt, in Österreich das Wein- und Mühlviertel.\n\n**Die Qualitätsanforderungen laufen der übrigen Getreideproduktion entgegen** — und darin liegt die eigentliche Schwierigkeit im Anbau:\n\n| Merkmal | Anforderung |\n|---|---|\n| **Rohprotein** | **9,5 bis 11,5 %** — je niedriger, desto besser |\n| Vollgerstenanteil (Sieb 2,5 mm) | mindestens 90 % |\n| Keimfähigkeit | mindestens 95 % |\n| Hektolitergewicht | mindestens 64 kg/hl |\n| Feuchte | höchstens 14,5 % |\n| Besatz und Bruchkorn | streng begrenzt |\n\n**Warum niedriges Eiweiß?** Die Mälzerei braucht Stärke, die zu vergärbarem Zucker wird. Ein hoher Eiweißgehalt geht zulasten der Stärke, führt zu Trübungen im Bier und erschwert die Läuterung. Überschreitet eine Partie 11,5 %, wird sie zur Futtergerste — mit einem Preisabschlag, der die ganze Kalkulation kippt.\n\n**Daraus folgt eine ungewöhnliche Düngestrategie**: Der Stickstoff wird knapp bemessen, auf 60 bis 100 kg N/ha, und **vollständig früh** gegeben, bis spätestens Schossbeginn. Eine späte Gabe landet direkt im Korneiweiß. Braugerste ist damit die einzige Marktfrucht, bei der zu viel Stickstoff den Erlös senkt statt hebt. Ein weiterer, oft übersehener Punkt: Auch Trockenheit in der Kornfüllung treibt den Eiweißgehalt, weil weniger Stärke eingelagert wird — der Landwirt kann das nicht steuern.\n\n**Die Keimfähigkeit** ist die zweite Besonderheit. Malz entsteht durch kontrolliertes Keimen; ein Korn, das nicht keimt, ist wertlos. Deshalb darf bei der Trocknung **40 °C nicht überschritten** werden, und die Partie muss schonend behandelt und trocken gelagert werden.\n\n**Sortenwahl ist nicht frei.** In Deutschland empfiehlt der **Berliner Programm**-Ausschuss jährlich die von Mälzereien und Brauereien akzeptierten Sorten; wer eine nicht empfohlene Sorte anbaut, findet oft keinen Abnehmer. Der Anbau läuft überwiegend über **Anbauverträge** mit festgelegter Sorte, Qualität und Preisstaffel.\n\nWirtschaftlich lohnt Braugerste über den Qualitätszuschlag, der je nach Marktlage 20 bis 60 €/t über Futtergerste liegt — bei etwas geringerem Ertrag und deutlich höherem Risiko.",
    "related": [
      "jecmen-krmny",
      "psenice-ozima",
      "fungicidy",
      "hektolitr"
    ]
  },
  {
    "slug": "jecmen-krmny",
    "term": "Futtergerste",
    "alias": [
      "feed barley",
      "Wintergerste",
      "Hordeum vulgare"
    ],
    "kategorie": "plodiny",
    "shortDef": "Futtergerste ist die wichtigste heimische Futtergetreideart — in Deutschland überwiegend als Wintergerste mit rund 1,3 Mio. ha.",
    "longDef": "Futtergerste dient der Fütterung von Rindern, Schweinen und Geflügel. In Deutschland dominiert die **Wintergerste** mit rund 1,3 Mio. Hektar und Erträgen von 70 bis 75 dt/ha; Sommergerste außerhalb des Brausegments ist die Ausnahme.\n\n**Ihr großer ackerbaulicher Vorteil ist der Erntetermin.** Wintergerste ist die **erste Frucht des Jahres**, geerntet oft schon Anfang Juli. Daraus folgt eine ganze Kette von Möglichkeiten, die andere Kulturen nicht bieten:\n- Sie ist die **ideale Vorfrucht für Winterraps**, der früh gesät werden muss\n- Nach ihr bleibt Zeit für eine **Zwischenfrucht** mit voller Entwicklung — wichtig für GLÖZ 6 und GLÖZ 8\n- Sie **entzerrt die Erntespitze** und verteilt die Auslastung von Mähdrescher und Trocknung\n\n**Anbau**: Saat von Mitte September bis Anfang Oktober und damit ein bis zwei Wochen vor Winterweizen, weil Gerste vor Winter kräftig entwickelt sein muss; 280 bis 350 Körner/m². Der Stickstoffbedarf liegt bei 140 bis 180 kg N/ha nach Düngebedarfsermittlung.\n\n**Zwei- oder mehrzeilig** ist die zentrale Sortenfrage: **Mehrzeilige** Sorten bringen mehr Ertrag, **zweizeilige** ein gleichmäßigeres, schwereres Korn. Für die Fütterung zählt der Ertrag, weshalb mehrzeilige Sorten dominieren.\n\n**Futterwert**: rund 12 % Rohprotein und etwa 8,3 MJ NEL je kg Trockensubstanz. In der Rinderfütterung wird sie gequetscht eingesetzt, beim Schwein geschrotet — auf den richtigen Mahlgrad kommt es dabei an, siehe [[srotovnik]]. Gegenüber Mais liefert Gerste weniger Energie, dafür mehr Struktur und eine langsamer im Pansen abgebaute Stärke, was das Azidoserisiko senkt.\n\n**Krankheiten** unterscheiden sich deutlich vom Weizen: Netzflecken, Rhynchosporium, Zwergrost und die in den letzten Jahren stark gewachsene **Ramularia**, gegen die nach dem Wegfall von Chlorthalonil kaum noch wirksame Mittel zur Verfügung stehen. Hinzu kommt das **Gerstengelbverzwergungsvirus (BYDV)**, übertragen von Blattläusen im Herbst — seit dem Verbot der neonikotinoiden Beize ein ernstes Problem, dem vor allem über späte Saat und tolerante Sorten begegnet wird.",
    "related": [
      "jecmen-sladovnicky",
      "psenice-ozima",
      "tmr",
      "krmne-davky",
      "hektolitr"
    ]
  },
  {
    "slug": "zito-ozime",
    "term": "Winterroggen",
    "alias": [
      "Secale cereale",
      "Roggen",
      "rye"
    ],
    "kategorie": "plodiny",
    "shortDef": "Deutschland ist der größte Roggenproduzent der Welt. Roggen gedeiht auf leichten, sauren Sandböden, auf denen Weizen versagt, und liefert das Mehl für das deutsche Brot.",
    "longDef": "Winterroggen (*Secale cereale*) steht in Deutschland auf rund 500.000 bis 650.000 Hektar — **Deutschland ist damit der größte Roggenerzeuger der Welt**, gefolgt von Polen. Der Schwerpunkt liegt auf den leichten Sandböden Brandenburgs, Mecklenburg-Vorpommerns und Niedersachsens.\n\n**Warum gerade dort**: Roggen ist die anspruchsloseste Brotgetreideart. Sein tiefreichendes, feines Wurzelsystem erschließt Wasser und Nährstoffe, wo Weizen längst aufgibt; er verträgt saure Böden bis pH 5, ist außerordentlich winterhart und kommt mit 80 bis 130 kg N/ha aus. Auf einem märkischen Sandboden ist er nicht die zweite Wahl, sondern die einzig sinnvolle.\n\n**Der Hybridroggen** hat die Kultur seit den 1980er-Jahren verwandelt: Er bringt 20 bis 40 % mehr Ertrag als Populationssorten, sodass heute 60 bis 80 dt/ha erreichbar sind. Das Saatgut ist teuer und muss jedes Jahr neu gekauft werden, weil sich der Heterosiseffekt nicht vererbt — siehe [[f1-hybrid]].\n\n**Die Backeigenschaften** unterscheiden sich grundlegend vom Weizen. Roggen bildet **kein Klebergerüst**; sein Teig wird stattdessen von Schleimstoffen, den Pentosanen, getragen. Deshalb braucht Roggenbrot zwingend **Sauerteig** — die Säure hemmt den stärkeabbauenden Enzymkomplex, ohne den der Krumenaufbau zusammenbräche. Genau daran hängt die deutsche Brotkultur mit Vollkornbrot, Pumpernickel und Mischbroten.\n\n**Ein Punkt, der rechtlich an Gewicht gewonnen hat, ist das Mutterkorn.** Der Pilz *Claviceps purpurea* ersetzt einzelne Körner durch dunkle Sklerotien, die hochwirksame Alkaloide enthalten; im Mittelalter löste er als Antoniusfeuer verheerende Vergiftungen aus. Roggen ist als Fremdbefruchter mit offener Blüte besonders anfällig. Die EU hat die **Höchstgehalte für Mutterkornsklerotien und Mutterkornalkaloide** in Getreideerzeugnissen zuletzt deutlich verschärft — die Reinigung der Partie und die Sortenwahl sind damit keine Kür mehr, sondern Voraussetzung der Verkehrsfähigkeit.\n\n**Verwendung**: etwa zur Hälfte Brotgetreide, daneben Futter, Brennerei und in erheblichem Umfang **Biogas** — als Grünroggen im Ganzpflanzensilage-Verfahren mit anschließendem Mais als Zweitfrucht.",
    "related": [
      "psenice-ozima",
      "oves-jarni",
      "ozim-jarin",
      "rzi",
      "hektolitr"
    ]
  },
  {
    "slug": "oves-jarni",
    "term": "Hafer",
    "alias": [
      "Avena sativa",
      "oats",
      "Sommerhafer"
    ],
    "kategorie": "plodiny",
    "shortDef": "Hafer ist die anspruchsloseste Getreideart und die beste Gesundungsfrucht der Fruchtfolge — zugleich der Gewinner des Haferdrink-Booms.",
    "longDef": "Hafer (*Avena sativa*) steht in Deutschland auf rund 150.000 Hektar — nach jahrzehntelangem Rückgang seit einigen Jahren wieder mit steigender Tendenz. Ertragsniveau 45 bis 55 dt/ha.\n\n**Ackerbaulich ist er die wertvollste Gesundungsfrucht der Fruchtfolge.** Hafer ist **kein Wirt für Halmbruch, Schwarzbeinigkeit und Getreidezystennematoden** — jene Fußkrankheiten also, die sich in engen Weizen-Gersten-Fruchtfolgen aufbauen. Eine Haferpause senkt den Befallsdruck der Folgekulturen nachweislich; man erntet den Nutzen im Weizen danach.\n\nHinzu kommt: Er unterdrückt Unkraut sehr gut, verlangt kaum Pflanzenschutz — meist genügt eine Herbizidmaßnahme — und ist deshalb **im Ökolandbau eine Schlüsselkultur**.\n\n**Anbau**: früh säen ab Mitte März, sobald der Boden befahrbar ist; 350 bis 450 Körner/m². Der Stickstoffbedarf ist mit 80 bis 120 kg N/ha niedrig — und das ist wörtlich zu nehmen: Hafer wird bei zu viel Stickstoff sehr lang und **lagert**, wodurch Ertrag und Qualität zusammenbrechen.\n\n**Der Markt hat sich grundlegend verschoben.** Früher war Hafer vor allem Pferdefutter; heute geht der wertvollste Teil in die **Humanernährung** — Flocken, Müsli und vor allem **Haferdrink**, dessen Nachfrage in den letzten Jahren stark gewachsen ist und dessen Ökobilanz gegenüber Mandel- und Sojadrink als Verkaufsargument dient.\n\n**Für die Schälmühle** gelten allerdings eigene, strenge Kriterien: hoher **Schälhaferanteil** mit gleichmäßig großen Körnern, Hektolitergewicht möglichst über 52 kg/hl, geringer Besatz und einwandfreie Farbe. Nur eine Partie, die diese Anforderungen erfüllt, erzielt den Aufpreis — der Rest geht ins Futter.\n\n**Ernährungsphysiologisch** ist der Beta-Glucan-Gehalt der entscheidende Punkt: Für ihn ist eine cholesterolsenkende Wirkung gesundheitsbezogen zugelassen, was den Absatz maßgeblich trägt.",
    "related": [
      "psenice-ozima",
      "zito-ozime",
      "ozim-jarin",
      "hektolitr",
      "mezi-plodiny"
    ]
  },
  {
    "slug": "tritikale",
    "term": "Triticale",
    "alias": [
      "× Triticosecale",
      "Weizen-Roggen-Kreuzung"
    ],
    "kategorie": "plodiny",
    "shortDef": "Triticale ist die gezüchtete Kreuzung aus Weizen und Roggen — sie vereint den Ertrag des Weizens mit der Anspruchslosigkeit des Roggens.",
    "longDef": "Triticale (*× Triticosecale*) ist die erste vom Menschen geschaffene Getreideart überhaupt — eine Kreuzung aus **Weizen** (*Triticum*) und **Roggen** (*Secale*), deren Chromosomensatz durch Verdopplung fruchtbar gemacht wurde. Der Name setzt sich aus beiden Gattungsnamen zusammen.\n\n**Geschichte**: Der erste Bastard wurde 1875 in Schottland beschrieben, blieb aber steril. Erst mit der Colchicin-Behandlung in den 1930er-Jahren entstanden fruchtbare Linien; das mexikanische Zuchtzentrum **CIMMYT** machte daraus ab den 1960er-Jahren eine praxistaugliche Kultur. Heute stehen weltweit rund 15 Mio. Hektar — **Polen ist mit Abstand größter Erzeuger, Deutschland folgt** mit etwa 300.000 Hektar.\n\n**Was die Kreuzung leistet**, ist genau das, was von den Eltern zu erwarten war: den **Ertrag des Weizens** bei der **Anspruchslosigkeit des Roggens**. Triticale liefert auf leichten und sauren Böden 60 bis 80 dt/ha, wo Weizen deutlich abfällt, verträgt niedrige pH-Werte, ist winterhart und braucht mit 100 bis 140 kg N/ha weniger Stickstoff. Auch der Krankheitsdruck ist geringer: Septoria und Mehltau spielen kaum eine Rolle, sodass meist eine Fungizidbehandlung genügt oder ganz entfallen kann.\n\n**Verwendung**: Der weitaus größte Teil geht ins **Futter**. Triticale hat einen höheren Lysingehalt als Weizen und ist damit für Schweine und Geflügel ernährungsphysiologisch günstiger. Ein wachsender Anteil geht als **Ganzpflanzensilage** in Biogasanlagen und in die Rinderfütterung, weil Triticale eine hohe Massenleistung bei früher Erntereife bringt und danach noch eine Zweitfrucht möglich ist.\n\n**Für die Backwarenherstellung** taugt Triticale dagegen kaum: Der Kleber ist schwach und die Enzymaktivität hoch — die Nachteile beider Eltern statt ihrer Vorteile.\n\n**Ein Punkt, den man vom Roggen mitgeerbt hat**: Auch Triticale kann von **Mutterkorn** befallen werden, wenn auch schwächer als Roggen. Bei Futterware ist darauf zu achten, denn die Alkaloide sind auch für Nutztiere schädlich.\n\n**Im Ökolandbau** ist Triticale wegen der guten Unkrautunterdrückung, der geringen Ansprüche und der Standfestigkeit eine der beliebtesten Getreidearten.",
    "related": [
      "psenice-ozima",
      "zito-ozime",
      "jecmen-krmny",
      "ozim-jarin",
      "krmne-davky"
    ]
  },
  {
    "slug": "mak-ozimy",
    "term": "Mohn",
    "alias": [
      "Schlafmohn",
      "Papaver somniferum",
      "Graumohn",
      "Backmohn"
    ],
    "kategorie": "plodiny",
    "shortDef": "Mohn wird für Backmohn und Mohnöl angebaut. In Deutschland ist der Anbau nach dem Betäubungsmittelgesetz erlaubnispflichtig, in Österreich hat er lange Tradition.",
    "longDef": "Mohn (*Papaver somniferum*) wird in Mitteleuropa für **Backmohn** und **Mohnöl** angebaut. Der Ertrag liegt bei 6 bis 12 dt/ha.\n\n**Der wichtigste Unterschied zwischen Deutschland und Österreich ist rechtlicher Natur** — und er wird regelmäßig unterschätzt:\n\nIn **Deutschland** ist Schlafmohn dem **Betäubungsmittelgesetz** unterstellt. Der Anbau ist nur mit einer **Erlaubnis des Bundesinstituts für Arzneimittel und Medizinprodukte (BfArM)** zulässig, die an eine morphinarme Sorte, Anbaumeldung, Flächenkontrolle und Nachweispflichten gebunden ist. Der Anbau ohne Erlaubnis ist strafbar — auch im Hausgarten. Entsprechend klein ist die Fläche.\n\nIn **Österreich** hat der Mohnanbau dagegen eine ungebrochene Tradition, insbesondere im **Waldviertel**. Der **Waldviertler Graumohn** ist als geschützte Ursprungsbezeichnung eingetragen und ein Aushängeschild der Region; der Anbau ist über das Suchtmittelrecht geregelt, aber praktisch etabliert. Mohnzelten, Mohnnudeln und Mohnöl gehören zur regionalen Küche.\n\n**Anbau**: Winter- und Sommermohn sind möglich; Sommermohn wird sehr früh gesät, sobald der Boden befahrbar ist. Der Samen ist winzig, weshalb ein **feinkrümeliges, gut rückverfestigtes Saatbett** und eine Ablage von höchstens ein bis zwei Zentimetern entscheidend sind. Die Jugendentwicklung ist ausgesprochen schwach; **Verunkrautung ist das größte Anbaurisiko**, und die Zahl zugelassener Herbizide ist klein.\n\n**Ernte**: Gedroschen wird bei vollständig abgereiften, rasselnden Kapseln mit stark abgesenkter Trommeldrehzahl, weil das Korn sehr bruchempfindlich ist. Der Samen muss unmittelbar heruntergetrocknet werden — bei hohem Ölgehalt verdirbt er sonst rasch.\n\n**Verwendung**: Blaumohn für Backwaren, Graumohn vor allem in Österreich, dazu kaltgepresstes Mohnöl. Der Speisemohn selbst enthält nur Spuren an Alkaloiden; die EU hat gleichwohl **Richtwerte für Morphin in Mohnsamen** festgelegt, denen mit sauberer Erntetechnik und Reinigung begegnet wird.",
    "related": [
      "ozim-jarin",
      "slunecnice",
      "repka-ozima"
    ]
  },
  {
    "slug": "slunecnice",
    "term": "Sonnenblume",
    "alias": [
      "Helianthus annuus",
      "Sonnenblumenkerne"
    ],
    "kategorie": "plodiny",
    "shortDef": "Die Sonnenblume ist eine trockenheitstolerante Ölfrucht, deren Anbau in Mitteleuropa mit dem Klimawandel und dem Rapsrückgang zunimmt.",
    "longDef": "Die Sonnenblume (*Helianthus annuus*) wird als Ölfrucht angebaut. In Deutschland stand sie lange bei rund 25.000 Hektar, in den letzten Jahren mit deutlich steigender Tendenz; in Österreich ist sie im pannonischen Osten seit Langem etabliert. Erträge liegen bei 22 bis 30 dt/ha, der Ölgehalt bei 42 bis 48 %.\n\n**Warum sie an Bedeutung gewinnt**, hat drei Gründe, die zusammenwirken:\n- Sie ist mit ihrer bis zu zwei Meter tiefen **Pfahlwurzel deutlich trockenheitstoleranter** als Raps und passt damit zu wärmeren, trockeneren Sommern\n- Der **Winterrapsanbau** ist unter dem Druck von Erdfloh und Rapsglanzkäfer nach dem Wegfall der Neonikotinoidbeize schwieriger geworden, siehe [[drepcik]] — die Sonnenblume ist die naheliegende Sommerung als Alternative\n- Sie ist eine **hervorragende Vorfrucht**: Die Pfahlwurzel erschließt den Unterboden, sie hinterlässt viel organische Masse und passt in Fruchtfolgen mit hohem Getreideanteil\n\n**Anbau**: Saat als Einzelkorn ab Mitte April bei 8 bis 10 °C Bodentemperatur, 6 bis 8 Pflanzen je Quadratmeter bei 45 bis 75 cm Reihenabstand — die weite Reihe erlaubt mechanische Unkrautregulierung mit dem Hackgerät. Der Stickstoffbedarf ist mit 60 bis 100 kg N/ha niedrig; zu viel Stickstoff verlängert die Vegetation und verzögert die Abreife.\n\n**Sie ist eine ausgezeichnete Bienenweide** und blüht im Hochsommer, wenn nach der Rapsblüte oft ein Trachtloch klafft — siehe [[snuska]].\n\n**Die Risiken** liegen am Ende der Vegetation. **Sclerotinia**, dieselbe Weißfäule wie im Raps, kann Körbe und Stängel befallen, weshalb ausreichende Anbaupausen einzuhalten sind — siehe [[hlizenka]]. Und die **Abreife im Herbst** ist der eigentliche Engpass in Mitteleuropa: Sonnenblumen werden bei 9 bis 12 % Feuchte gedroschen, kommen aber oft nur mit 15 bis 20 % vom Feld und müssen dann getrocknet werden. Hinzu kommt Vogelfraß an reifenden Körben.\n\nUnterschieden werden **Linolsäure-Typen** für klassisches Speiseöl und **High-Oleic-Typen** mit hohem Ölsäureanteil, die hitzestabiler sind und meist über Anbauverträge mit Aufschlag laufen.",
    "related": [
      "repka-ozima",
      "ozim-jarin",
      "fungicidy",
      "desikace"
    ]
  },
  {
    "slug": "horcice",
    "term": "Senf",
    "alias": [
      "Sinapis alba",
      "Weißer Senf",
      "Gelbsenf",
      "Brassica juncea"
    ],
    "kategorie": "plodiny",
    "shortDef": "Senf wird als Gewürzpflanze und vor allem als Zwischenfrucht angebaut — mit nematodenresistenten Sorten ist er das Standardwerkzeug gegen Rübennematoden.",
    "longDef": "Angebaut werden vor allem **Weißer Senf** (*Sinapis alba*), auch Gelbsenf genannt, und **Brauner Senf** (*Brassica juncea*). Die weitaus größere Fläche entfällt dabei nicht auf den Körneranbau, sondern auf die Nutzung als **Zwischenfrucht**.\n\n**Als Zwischenfrucht** ist Senf die günstigste und schnellste Option überhaupt: Er läuft binnen weniger Tage auf, deckt den Boden in sechs Wochen vollständig ab, bindet 40 bis 80 kg Reststickstoff je Hektar und **friert zuverlässig ab**, sodass im Frühjahr eine Mulchdecke ohne weitere Maßnahme bereitliegt.\n\n**Der eigentliche Trumpf sind die nematodenresistenten Sorten.** Bestimmte Senf- und Ölrettichsorten regen die **Rübenzystennematode** *Heterodera schachtii* zum Schlüpfen an, lassen aber keine Vermehrung zu — der Besatz sinkt so um 50 bis 80 %. In Zuckerrübenfruchtfolgen ist das die wirksamste verfügbare Gegenmaßnahme und Bestandteil praktisch jedes Anbauvertrags. Die Resistenzeinstufung steht auf der Saatgutpackung und ist keine Selbstverständlichkeit — nicht resistente Sorten vermehren den Nematoden sogar.\n\n**Der große Vorbehalt**: Senf ist ein **Kreuzblütler** wie Raps. In rapsstarken Fruchtfolgen fördert er **Kohlhernie** und Sklerotinia und gehört dort nicht in die Zwischenfruchtmischung. Die Alternative ist [[svazenka]], die mit keiner Ackerkultur verwandt ist.\n\n**Als Körnerfrucht** liefert Senf 8 bis 15 dt/ha für Speisesenf, Gewürz und die Lebensmittelindustrie. Der Anbau ist anspruchslos, aber die Vermarktung eng — üblich sind Anbauverträge mit Verarbeitern. Deutschland importiert den weitaus größten Teil seines Senfsaatbedarfs, überwiegend aus Kanada und der Ukraine; der Lieferausfall nach 2022 hat das Thema regionaler Anbau spürbar belebt.\n\n**Förderrechtlich** zählt Senf als Zwischenfrucht zur Bodenbedeckung nach GLÖZ 6 und kann in Agrarumweltmaßnahmen sowie zur Erfüllung von GLÖZ 8 eingesetzt werden.",
    "related": [
      "mezi-plodiny",
      "repka-ozima",
      "ozim-jarin",
      "regenerativni-zemedelstvi",
      "osevni-postup"
    ]
  },
  {
    "slug": "cukrovka",
    "term": "Zuckerrübe",
    "alias": [
      "Beta vulgaris",
      "Rübe",
      "Zuckerrübenanbau"
    ],
    "kategorie": "plodiny",
    "shortDef": "Die Zuckerrübe ist die ertragsstärkste Ackerkultur Mitteleuropas und die einzige heimische Zuckerpflanze — angebaut fast ausschließlich im Vertrag mit der Zuckerfabrik.",
    "longDef": "Die Zuckerrübe (*Beta vulgaris* ssp. *vulgaris*) steht in Deutschland auf rund 400.000 Hektar, in Österreich auf etwa 35.000. Der Rübenertrag liegt bei 700 bis 850 dt/ha bei einem Zuckergehalt von 17 bis 19 % — je Hektar sind das 12 bis 15 Tonnen Zucker und damit die höchste Energieproduktion aller heimischen Ackerkulturen.\n\n**Die Vermarktung ist ein Sonderfall.** Rüben werden praktisch ausschließlich im **Anbauvertrag mit der Zuckerfabrik** erzeugt — in Deutschland vor allem Südzucker, Nordzucker und Pfeifer & Langen, in Österreich Agrana. Vertragsmenge, Lieferzeitfenster und Preisformel stehen vorher fest. Bezahlt wird nach **bereinigtem Zuckergehalt**, nicht nach Rübenmasse: Neben dem Zuckergehalt gehen die **Melassebildner** — Kalium, Natrium und Amino-Stickstoff — abzugswirksam in die Abrechnung ein.\n\nDaraus folgt eine Düngestrategie, die dem übrigen Ackerbau widerspricht: **Zu viel Stickstoff senkt den Erlös.** Er treibt zwar die Rübenmasse, drückt aber Zuckergehalt und Amino-Stickstoff in die falsche Richtung. Der Bedarf liegt deshalb bei nur 100 bis 150 kg N/ha, in einer einzigen frühen Gabe.\n\n**Anbau**: Einzelkornsaat ab Mitte März bei 5 bis 8 °C Bodentemperatur, 1,1 bis 1,3 Saateinheiten je Hektar bei 45 oder 50 cm Reihenabstand. Das Saatgut ist pilliert und wird geschält geliefert. Die Ernte läuft als **Kampagne** von September bis Dezember mit sechsreihigen Selbstfahrern.\n\n**Die drei großen aktuellen Probleme:**\n\n**Vergilbungsviren**, übertragen von Blattläusen — seit dem Wegfall der neonikotinoiden Beize das drängendste Thema; siehe [[msice-repna]].\n\n**Cercospora-Blattflecken**, die bei feucht-warmer Witterung den Blattapparat zerstören und deren Erreger zunehmend Resistenzen gegen Azole und Strobilurine zeigt.\n\n**SBR — Syndrome des Basses Richesses**, eine von der Schilf-Glasflügelzikade übertragene Bakteriose, die den Zuckergehalt drastisch senkt und sich seit einigen Jahren in Süddeutschland ausbreitet.\n\n**Fruchtfolge**: mindestens drei bis vier Jahre Anbaupause wegen der **Rübenzystennematode**; nematodenresistente Zwischenfrüchte sind Standard, siehe [[horcice]]. Nach dem Ende der EU-Zuckerquote 2017 steht der europäische Rübenanbau zudem im direkten Wettbewerb mit dem Weltmarkt.",
    "related": [
      "msice-repna",
      "ozim-jarin",
      "osevni-postup",
      "fungicidy"
    ]
  },
  {
    "slug": "hrach-set",
    "term": "Körnererbse",
    "alias": [
      "Futtererbse",
      "Pisum sativum",
      "Erbse"
    ],
    "kategorie": "plodiny",
    "shortDef": "Die Körnererbse ist die wichtigste heimische Körnerleguminose neben der Ackerbohne — eiweißreich, stickstoffbindend und mit hohem Vorfruchtwert.",
    "longDef": "Die Körnererbse (*Pisum sativum*) wird in Deutschland auf rund 100.000 Hektar angebaut, mit steigender Tendenz. Der Ertrag liegt bei 30 bis 45 dt/ha, der Rohproteingehalt bei 20 bis 25 %.\n\n**Ihr Wert liegt in der Fruchtfolge, nicht allein im Erlös.** Sie bindet über Knöllchenbakterien 100 bis 200 kg Luftstickstoff je Hektar und hinterlässt der Folgekultur 30 bis 50 kg. Der Weizen nach Erbse bringt regelmäßig 5 bis 10 % Mehrertrag und braucht weniger Stickstoff. Hinzu kommt: Als Blattfrucht unterbricht sie die Getreidefruchtfolge, senkt den Druck von Fußkrankheiten und schafft ein zusätzliches Zeitfenster für die mechanische Ungrasbekämpfung.\n\n**Anbau**: sehr frühe Saat ab Ende Februar oder Anfang März, sobald der Boden befahrbar ist — Erbsen vertragen Frost bis etwa −5 °C und nutzen die Frühjahrsfeuchte. 70 bis 90 Körner je Quadratmeter, 4 bis 6 cm tief. **Stickstoff wird nicht gedüngt**; eine Startgabe unterdrückt die Knöllchenbildung und ist damit kontraproduktiv.\n\n**Die Schwächen** sind gut bekannt:\n- **Selbstunverträglichkeit** — mindestens fünf bis sechs Jahre Anbaupause, sonst treten Fußkrankheiten und der Erbsenwurzelbohrer auf; das ist die härteste Beschränkung\n- **Schwache Standfestigkeit** — moderne halbblattlose Sorten stützen sich über Ranken gegenseitig und haben das erheblich verbessert\n- **Trockenheit zur Blüte** kostet Hülsen und Ertrag\n- **Ungleichmäßige Abreife** und Ernteverluste durch Platzen\n\n**Schaderreger**: Blattrandkäfer, dessen Larven an den Knöllchen fressen, Erbsenwickler und Blattläuse; bei den Pilzen Brennfleckenkrankheit und Falscher Mehltau.\n\n**Verwendung und Markt**: überwiegend Futter für Schweine und Geflügel als heimischer Sojaersatz, zunehmend aber auch **Humanernährung** — Erbsenprotein ist der Rohstoff vieler pflanzlicher Fleischalternativen, ein Markt mit deutlichem Wachstum. Gefördert wird der Anbau über die **gekoppelte Einkommensstützung für Leguminosen** sowie über Eiweißpflanzenprogramme der Bundesländer; zur Erfüllung von GLÖZ 8 ist sie ebenfalls anrechenbar.",
    "related": [
      "sojaova-bob",
      "vojteska",
      "osevni-postup",
      "mezi-plodiny",
      "ozim-jarin",
      "regenerativni-zemedelstvi"
    ]
  },
  {
    "slug": "len-set",
    "term": "Lein",
    "alias": [
      "Flachs",
      "Linum usitatissimum",
      "Öllein",
      "Faserlein"
    ],
    "kategorie": "plodiny",
    "shortDef": "Lein wird in zwei Nutzungsrichtungen angebaut: als Öllein für Leinsamen und Leinöl und als Faserlein für Textilien.",
    "longDef": "Lein (*Linum usitatissimum*) gehört zu den ältesten Kulturpflanzen Europas und wird in zwei klar getrennten Nutzungsrichtungen angebaut.\n\n**Öllein** liefert Samen mit 38 bis 45 % Öl. Der Ertrag liegt bei 15 bis 22 dt/ha. Das Öl ist außergewöhnlich reich an **Alpha-Linolensäure**, einer Omega-3-Fettsäure — Leinöl ist die konzentrierteste pflanzliche Quelle überhaupt. Genau diese Doppelbindungen machen es allerdings sehr oxidationsanfällig: Leinöl wird kalt gepresst, muss kühl und dunkel gelagert und rasch verbraucht werden. Technisch ist dieselbe Eigenschaft ein Vorteil — als **trocknendes Öl** ist Leinöl Grundstoff für Firnis, Ölfarbe und Linoleum, dessen Name unmittelbar davon stammt.\n\n**Faserlein** wird dichter gesät und wächst länger und unverzweigter, weil es auf die Stängelfaser ankommt. Er wird nicht gemäht, sondern **gerauft**, also mitsamt der Wurzel gezogen, damit die Faser über die volle Länge erhalten bleibt. Anschließend folgt die **Röste**: Der Stängel bleibt auf dem Feld liegen, damit Mikroorganismen die Pektine zersetzen, die Faser und Holzteil verbinden. Erst danach lassen sich die Fasern beim Brechen und Schwingen lösen. Aus ihnen entsteht **Leinen**.\n\n**Ein Hinweis zur Verwechslungsgefahr**: Öllein und Faserlein sind derselbe Art, aber unterschiedliche Sortentypen; sie lassen sich nicht gegeneinander austauschen. Und Leinsamen ist etwas anderes als **Leindotter** (*Camelina sativa*), eine ganz eigene Ölpflanze, die derzeit als Mischkulturpartner an Bedeutung gewinnt.\n\n**Anbau**: frühe Saat ab März, geringer Stickstoffbedarf von 40 bis 70 kg N/ha, da Lein sonst lagert. Die Jugendentwicklung ist schwach und die Zahl zugelassener Herbizide klein, weshalb **Verunkrautung das Hauptrisiko** ist. Die Ernte des Ölleins ist wegen der zähen Stängel anspruchsvoll und beansprucht Schneidwerk und Dreschwerk stark.\n\nIn Deutschland und Österreich ist Lein heute eine Nischenkultur mit wachsender Nachfrage aus der Naturkost- und Regionalitätsschiene.",
    "related": [
      "ozim-jarin",
      "mak-ozimy",
      "osevni-postup"
    ]
  },
  {
    "slug": "mastitida",
    "term": "Mastitis",
    "alias": [
      "Euterentzündung",
      "Gesäugeentzündung"
    ],
    "kategorie": "chov",
    "shortDef": "Mastitis ist die Entzündung des Euters, meist bakteriell bedingt. Sie ist das wirtschaftlich bedeutendste Gesundheitsproblem der Milchviehhaltung. Leitgröße ist die Zellzahl: über 200.000/ml subklinisch, über 400.000/ml nicht mehr lieferfähig.",
    "longDef": "Mastitis — von griechisch *mastos* (Brust) — ist die **Entzündung der Milchdrüse**. Sie verursacht in der Milchviehhaltung den größten Teil der krankheitsbedingten Verluste, über verworfene Milch, Behandlungskosten, Leistungseinbußen und vorzeitige Abgänge.\n\n**Formen**: Die **klinische Mastitis** zeigt sichtbare Veränderungen an Milch oder Euter — Flocken, wässrige Milch, Schwellung, Wärme, gestörtes Allgemeinbefinden. Die **subklinische Mastitis** ist unsichtbar und fällt nur über die Zellzahl auf; sie macht den weit überwiegenden Teil der Fälle aus und ist deshalb wirtschaftlich der größere Schaden.\n\n**Erreger**: kuhassoziiert übertragen sich *Staphylococcus aureus* und *Streptococcus agalactiae* beim Melken von Tier zu Tier; umweltassoziiert stammen *E. coli*, *Streptococcus uberis* und *Klebsiella* aus Liegeboxen und Einstreu. Die Unterscheidung entscheidet über die Gegenmaßnahmen: Melkhygiene gegen die einen, Stall- und Liegeflächenhygiene gegen die anderen.\n\n**Zellzahlen als Maßstab:**\n- unter 100.000/ml — eutergesund\n- 100.000 bis 200.000/ml — Verdachtsbereich\n- über 200.000/ml — subklinische Mastitis\n- **über 400.000/ml im geometrischen Mittel** — die Tankmilch ist nach Verordnung (EG) Nr. 853/2004 **nicht mehr verkehrsfähig**\n\n**Behandlung**: Antibiotika werden nach Erregernachweis und Resistenztest eingesetzt, intrazisternal und bei schwerem Verlauf zusätzlich systemisch, ergänzt durch entzündungshemmende Mittel. Wartezeiten für Milch und Fleisch sind einzuhalten und zu dokumentieren.\n\n**Wichtige rechtliche Änderung**: Seit Inkrafttreten der EU-Tierarzneimittelverordnung (EU) 2019/6 im Jahr 2022 dürfen Antibiotika **nicht mehr routinemäßig vorbeugend** eingesetzt werden. Das flächendeckende antibiotische Trockenstellen aller Kühe ist damit unzulässig; Standard ist das **selektive Trockenstellen** — antibiotisch nur bei nachweislich infizierten Vierteln, sonst allein mit einem internen Zitzenversiegler.\n\n**Vorbeugung — die wirksamen Hebel:**\n1. **Melkhygiene**: Vormelken, Zitzenreinigung, ein Tuch je Kuh, Zwischendesinfektion der Melkzeuge, Dippen nach dem Melken\n2. **Melktechnik**: jährliche Prüfung, Vakuum und Pulsation korrekt, Zitzengummis rechtzeitig wechseln\n3. **Sauber und trocken liegen** — Tiefboxen mit Sand oder Kalkstrohmatratze, häufiges Nachstreuen\n4. **Zucht**: Selektion auf niedrige Zellzahl und Eutergesundheit, in Deutschland über den Zuchtwert RZEuterfit\n5. **Fütterung und Trockenstehermanagement** — Selen und Vitamin E, ausgeglichene Kondition\n\n**Kosten**: Für einen klinischen Fall werden je nach Schwere 250 bis 500 € angesetzt; in einer Herde mit 100 Kühen summieren sich Mastitisverluste leicht auf einen fünfstelligen Betrag im Jahr. Konsequentes Management senkt die Neuinfektionsrate um die Hälfte und mehr — kaum eine andere Maßnahme im Milchviehbetrieb hat eine vergleichbare Rendite.\n\nSiehe auch [[oteleni]], [[dojirna]], [[ku-kontrola-uzitkovosti]], [[tmr]], [[bcs-body-condition]], [[transition-period]].",
    "related": [
      "oteleni",
      "dojirna",
      "tmr",
      "krmne-davky"
    ]
  },
  {
    "slug": "bcs-body-condition",
    "term": "BCS (Body Condition Score)",
    "alias": [
      "Body Condition Score",
      "Körperkondition",
      "BCS-Note"
    ],
    "kategorie": "chov",
    "shortDef": "Der BCS ist die visuelle Bewertung der Körperkondition auf einer Skala von 1 bis 5. Beim Abkalben liegt das Optimum der Milchkuh bei 3,25 bis 3,75 — zu fett bedeutet Schwergeburt und Ketose, zu mager bedeutet Leistungs- und Fruchtbarkeitsverluste.",
    "longDef": "Der Body Condition Score ist die **visuelle und tastende Beurteilung der Fettauflage** und damit der Energiereserven eines Tieres. Er ist eines der wenigen Managementinstrumente, das ohne Technik auskommt und trotzdem hoch aussagekräftig ist.\n\n**Die Skala** reicht beim Rind von 1 (extrem abgemagert) bis 5 (verfettet), in Vierteilschritten. Beurteilt werden Dornfortsätze, Querfortsätze, Hüft- und Sitzbeinhöcker sowie die Beckenregion um die Schwanzwurzel.\n\n**Zielwerte der Milchkuh im Laktationsverlauf:**\n\n| Zeitpunkt | BCS |\n|---|---|\n| Abkalbung | 3,25–3,75 |\n| 30 Tage nach Abkalbung | 2,75–3,00 |\n| Laktationshöhepunkt (etwa 100 Tage) | 2,75–3,00 |\n| 200 Tage | 3,00–3,25 |\n| Trockenstellen | 3,25–3,75 |\n\n**Die Folgen einer falschen Kondition:**\n\n*Zu mager beim Abkalben, unter 2,5*: geringe Milchleistung, schwache Immunabwehr, verzögerte Wiederaufnahme der Brunst, siehe [[rijnost]]\n\n*Zu fett, über 4,0*: Schwergeburten, verminderte Futteraufnahme in der kritischen Phase nach dem Kalben, dadurch tiefes Energiedefizit mit **Ketose** und **Fettleber**, häufiger Nachgeburtsverhaltung und Labmagenverlagerung\n\n**Die wichtigste Faustregel**: Ein Konditionsverlust von mehr als einem BCS-Punkt in den ersten 60 Tagen der Laktation ist ein Warnzeichen — dahinter steht ein Energiedefizit, das Stoffwechselerkrankungen und Fruchtbarkeitsprobleme nach sich zieht. Entscheidend ist deshalb nicht der Einzelwert, sondern der **Verlauf**.\n\n**Automatische Erfassung**: Dreidimensionale Kameras über dem Selektionstor oder am Melkroboter ermitteln den BCS täglich für jedes Tier und erkennen Trends, lange bevor sie dem Auge auffallen. Die Investition liegt im mittleren vierstelligen bis unteren fünfstelligen Eurobereich und rechnet sich vor allem in größeren Herden, in denen die regelmäßige Handbonitur ohnehin nicht mehr leistbar ist.\n\nSiehe auch [[oteleni]], [[rijnost]], [[mastitida]], [[ku-kontrola-uzitkovosti]], [[tmr]], [[transition-period]].",
    "related": [
      "oteleni",
      "rijnost",
      "mastitida",
      "tmr"
    ]
  },
  {
    "slug": "ku-kontrola-uzitkovosti",
    "term": "Milchleistungsprüfung (MLP)",
    "alias": [
      "MLP",
      "Milchkontrolle",
      "Leistungsprüfung"
    ],
    "kategorie": "chov",
    "shortDef": "Die Milchleistungsprüfung ist die regelmäßige Erfassung von Milchmenge und -inhaltsstoffen jeder einzelnen Kuh. In Deutschland führen sie die Landeskontrollverbände durch, in Österreich der LKV Austria — Grundlage für Zucht, Fütterung und Tiergesundheit.",
    "longDef": "Die Milchleistungsprüfung ist die **systematische Erfassung von Milchmenge und Inhaltsstoffen für jedes einzelne Tier**. Sie ist freiwillig, aber die Voraussetzung für Herdbuchzucht und die wichtigste Datenquelle im Milchviehbetrieb.\n\n**Träger**: In Deutschland führen die **Landeskontrollverbände (LKV)** der Bundesländer die Prüfung durch, koordiniert im Dachverband **DLQ**; die Zuchtwertschätzung übernimmt das **vit** in Verden. In Österreich liegt die Prüfung beim **LKV Austria**, die Auswertung bei **ZuchtData**. Die Verfahren richten sich nach den international abgestimmten **ICAR**-Regeln, was den Vergleich über Ländergrenzen hinweg erst möglich macht.\n\n**Ablauf**: In der Regel alle vier Wochen wird bei einer Melkzeit — oder nach dem A4-, AT- oder B-Verfahren abwechselnd — die Milchmenge jeder Kuh erfasst und eine Probe gezogen. Die Analyse erfolgt im akkreditierten Labor.\n\n**Erfasste Kennzahlen und ihre Zielbereiche beim Holstein:**\n\n| Parameter | Orientierung |\n|---|---|\n| Milchmenge | 25–40 kg/Tag |\n| Fett | 3,8–4,2 % |\n| Eiweiß | 3,2–3,5 % |\n| Zellzahl | unter 200.000/ml |\n| Harnstoff | 15–30 mg/100 ml |\n| Laktose | 4,7–5,0 % |\n\nHinzu kommen zunehmend Zusatzparameter aus derselben Probe: **Ketosescreening** über Aceton und Beta-Hydroxybutyrat, das Fett-Eiweiß-Verhältnis als Indikator für Pansenazidose oder Energiemangel sowie der Trächtigkeitstest aus der Milch.\n\n**Was mit den Daten geschieht:**\n1. **Zucht** — die Leistungen der Töchter bilden die Grundlage der Zuchtwertschätzung; ohne MLP gäbe es keine belastbaren Bullenzuchtwerte\n2. **Tiergesundheit** — steigende Zellzahl deutet auf [[mastitida]], das Fett-Eiweiß-Verhältnis auf Stoffwechselprobleme\n3. **Fütterungscontrolling** — der Harnstoffgehalt zeigt an, ob Energie und Rohprotein in der Ration zusammenpassen, siehe [[tmr]]\n4. **Selektionsentscheidungen** — welche Tiere gesext belegt, welche mit Fleischrassen angepaart und welche gemerzt werden\n\n**Beteiligung und Kosten**: In Deutschland nehmen rund achtzig Prozent der Milchkühe an der MLP teil; die Kosten liegen als Richtwert im niedrigen zweistelligen Eurobereich je Kuh und Jahr und werden in einigen Bundesländern bezuschusst.\n\n**Entwicklung**: Melkroboter und Inline-Sensoren erfassen Menge, Leitfähigkeit und teils Inhaltsstoffe bei **jedem** Gemelk. Sie ersetzen die MLP aber nicht — deren Wert liegt gerade in der unabhängigen, standardisierten und labortechnisch abgesicherten Messung, auf der die überbetriebliche Zuchtwertschätzung beruht.\n\nSiehe auch [[plemenna-kniha]], [[mastitida]], [[bcs-body-condition]], [[oteleni]], [[dojirna]], [[inseminace]].",
    "related": [
      "plemenna-kniha",
      "mastitida",
      "bcs-body-condition",
      "dojirna"
    ]
  },
  {
    "slug": "plemenna-kniha",
    "term": "Herdbuch",
    "alias": [
      "Zuchtbuch",
      "Zuchtverband",
      "Abstammungsnachweis"
    ],
    "kategorie": "chov",
    "shortDef": "Das Herdbuch ist das amtlich anerkannte Zuchtbuch einer Rasse — es dokumentiert Abstammung und Leistung und ist die Grundlage jeder Zuchtwertschätzung.",
    "longDef": "Das Herdbuch verzeichnet Abstammung, Leistungen und Bewertungen der Tiere einer Rasse. Geführt wird es von **anerkannten Zuchtverbänden**; Rechtsgrundlage ist die EU-**Tierzuchtverordnung (EU) 2016/1012**, ergänzt durch das nationale Tierzuchtrecht.\n\n**Die Anerkennung eines Zuchtverbandes** ist an klare Bedingungen geknüpft: ein festgelegtes Zuchtprogramm mit Zuchtziel, eine geordnete Zuchtbuchführung, Leistungsprüfung und Zuchtwertschätzung nach anerkannten Verfahren sowie die diskriminierungsfreie Aufnahme von Züchtern. Nur ein so anerkannter Verband darf **Zuchtbescheinigungen** ausstellen, die im EU-Binnenmarkt gelten.\n\n**Die Abteilungen** des Herdbuchs sind gestuft: Die **Hauptabteilung** nimmt Tiere auf, deren Eltern und Großeltern bereits eingetragen sind; **besondere Abteilungen** erlauben den kontrollierten Aufbau über mehrere Generationen und sind der Weg, auf dem neue Betriebe oder gefährdete Rassen Anschluss finden.\n\n**Wie die Kette funktioniert**, ist der eigentliche Punkt: Die Abstammung kommt aus der dokumentierten Besamung, siehe [[inseminace]]. Die Leistungsdaten kommen aus der Milchleistungsprüfung, siehe [[ku-kontrola-uzitkovosti]]. Beides zusammen ergibt in der Zuchtwertschätzung die Bullen- und Kuhzuchtwerte, auf deren Grundlage die nächste Generation angepaart wird. Fällt ein Glied dieser Kette aus, ist der Zuchtwert wertlos — deshalb sind Meldepflichten und Dokumentation kein Formalismus.\n\n**In Deutschland** führen die Landesverbände die Herdbücher, die Zuchtwertschätzung beim Rind übernimmt zentral das **vit** in Verden; in Österreich liegt sie bei **ZuchtData**. Bewertet werden längst nicht mehr nur Milchmenge und Inhaltsstoffe, sondern auch Exterieur, Eutergesundheit, Klauengesundheit, Fruchtbarkeit, Kalbeverlauf und **Nutzungsdauer** — Letztere hat erheblich an Gewicht gewonnen.\n\nEine besondere Rolle spielen Herdbücher bei **gefährdeten Nutztierrassen**: Ohne geordnete Zuchtbuchführung lässt sich weder die Inzucht steuern noch der Erhalt fördern.",
    "related": [
      "ku-kontrola-uzitkovosti",
      "inseminace",
      "jalovice",
      "usni-znamka",
      "f1-hybrid"
    ]
  },
  {
    "slug": "kolostrum-mlezivo",
    "term": "Kolostrum",
    "alias": [
      "Biestmilch",
      "Erstgemelk",
      "Kolostralmilch"
    ],
    "kategorie": "chov",
    "shortDef": "Kolostrum ist die erste Milch nach der Geburt; sie liefert dem Kalb die Antikörper, ohne die es keine Immunabwehr aufbaut.",
    "longDef": "Kolostrum ist das Erstgemelk nach der Kalbung — dickflüssig, gelblich und um ein Vielfaches konzentrierter als normale Milch.\n\n**Warum es lebenswichtig ist**: Beim Rind gelangen wegen des Baus der Plazenta **keine Antikörper von der Mutter auf das ungeborene Kalb**. Es kommt vollständig ohne Immunabwehr zur Welt. Die einzige Quelle sind die **Immunglobuline** im Kolostrum.\n\n**Das Zeitfenster ist eng und schließt sich unwiderruflich.** Die Darmwand des Kalbes kann große Eiweißmoleküle nur in den ersten Stunden unverdaut aufnehmen; die Aufnahmefähigkeit fällt rasch ab und ist nach etwa 24 Stunden praktisch erloschen. Wird sie verpasst, lässt sich das durch nichts nachholen — das Kalb bleibt für Wochen anfällig für Durchfall und Atemwegserkrankungen.\n\n**Die Regel lautet daher: vier Liter innerhalb der ersten zwei Stunden**, besser noch in der ersten. Trinkt das Kalb nicht selbst genug, wird gedrencht.\n\n**Die Qualität schwankt erheblich** — und sie lässt sich messen. Mit dem **Brix-Refraktometer** gilt ein Wert ab 22 % als gut; darunter liegendes Kolostrum sollte nicht als Erstgabe verwendet werden. Ältere Kühe liefern in der Regel besseres Kolostrum als Färsen, weil sie mehr Erreger kennengelernt haben. Gutes Kolostrum lässt sich portionsweise **einfrieren** und bei 40 °C schonend auftauen — jeder Milchviehbetrieb sollte einen Vorrat vorhalten.\n\n**Zur Hygiene**: Kolostrum ist ein idealer Nährboden. Es muss sauber gewonnen, sofort gekühlt oder verfüttert werden. Aus Sicht der Seuchenhygiene ist zudem zu beachten, dass **Paratuberkulose** über Kolostrum übertragen werden kann — Kolostrum von Tieren aus unklaren Beständen gehört nicht ins Kälberprogramm.\n\nDer Erfolg lässt sich überprüfen: Eine Blutprobe des Kalbes im Alter von ein bis sieben Tagen zeigt über den Gesamtprotein- oder Brix-Wert, ob die Antikörperübertragung gelungen ist.",
    "related": [
      "oteleni",
      "jalovice",
      "mastitida",
      "transition-period",
      "dojirna"
    ]
  },
  {
    "slug": "transition-period",
    "term": "Transitphase",
    "alias": [
      "Transitperiode",
      "Übergangsphase",
      "Frischmelkerphase"
    ],
    "kategorie": "chov",
    "shortDef": "Die Transitphase umfasst die drei Wochen vor und nach der Kalbung — in diesen sechs Wochen entstehen die meisten teuren Probleme der Laktation.",
    "longDef": "Als Transitphase bezeichnet man die Zeit von etwa drei Wochen vor bis drei Wochen nach der Kalbung. Sie ist die folgenreichste Phase im Jahr der Kuh: **Der überwiegende Teil aller Stoffwechsel- und Gesundheitsstörungen einer Laktation nimmt hier seinen Ausgang.**\n\n**Was in diesen Wochen zusammenfällt**, ist eine außergewöhnliche Häufung von Belastungen:\n- Die **Futteraufnahme sinkt** in den letzten Tagen vor der Kalbung um bis zu 30 %, weil der Pansen vom Kalb eingeengt wird\n- Unmittelbar nach der Kalbung **steigt der Energiebedarf sprunghaft** um ein Vielfaches\n- Der **Calciumbedarf** vervielfacht sich mit dem Einsetzen der Milchbildung binnen Stunden\n- Die **Immunabwehr** ist hormonell bedingt herabgesetzt\n- Die Pansenzotten müssen sich erst wieder auf die energiereiche Laktationsration umstellen\n\nDaraus entsteht das **negative Energiedefizit**: Die Kuh mobilisiert Körperfett und verliert an Kondition. Läuft das aus dem Ruder, folgen **Ketose**, **Fettleber**, **Labmagenverlagerung**, **Milchfieber**, **Nachgeburtsverhaltung** und Gebärmutterentzündung — und in der Folge eine verzögerte Wiederbelegung.\n\n**Was tatsächlich hilft**, ist gut belegt und im Kern einfach:\n1. **Kondition beim Trockenstellen steuern** — ein BCS von 3,25 bis 3,75, nicht darüber. Eine verfettete Kuh frisst nach der Kalbung schlechter und mobilisiert mehr, siehe [[bcs-body-condition]]\n2. **Vorbereitungsfütterung** in den letzten drei Wochen — die Pansenzotten anfüttern und den Calciumstoffwechsel über anionische Salze oder eine calciumarme Ration vorbereiten\n3. **Futteraufnahme maximieren** — großzügiger Fressplatz, immer frisches Futter, kein Umgruppieren kurz vor der Kalbung\n4. **Stressarme Haltung** — stabile Gruppen, weiche, saubere Liegeflächen, ausreichend Platz\n5. **Konsequente Frischmelkerkontrolle** in den ersten zwei Wochen: Temperatur, Pansenfüllung, Kotbeschaffenheit, Ketonkörper und Milchmenge\n\nBetriebe, die die Transitphase im Griff haben, unterscheiden sich von den übrigen weniger in der Spitzenleistung als in der **Zahl der Abgänge in den ersten sechzig Tagen** — und genau dort liegt der wirtschaftliche Unterschied.",
    "related": [
      "oteleni",
      "bcs-body-condition",
      "mastitida",
      "tmr",
      "kolostrum-mlezivo"
    ]
  },
  {
    "slug": "f1-hybrid",
    "term": "F1-Hybride",
    "alias": [
      "Hybride",
      "Heterosis",
      "Kreuzungstier"
    ],
    "kategorie": "chov",
    "shortDef": "Die F1-Hybride ist die erste Generation aus der Kreuzung zweier reiner Linien — sie zeigt den maximalen Heterosiseffekt, vererbt ihn aber nicht.",
    "longDef": "Als F1 bezeichnet man die **erste Tochtergeneration** aus der Kreuzung zweier genetisch verschiedener, in sich einheitlicher Elternlinien. Sie ist untereinander sehr gleichmäßig und zeigt den **maximalen Heterosiseffekt** — jene Leistungsüberlegenheit gegenüber dem Mittel der Eltern, die sich mit klassischer Selektion nicht erreichen lässt.\n\n**Der entscheidende Punkt ist die zweite Generation.** In der F2 spalten die Merkmale nach den Mendelschen Regeln wieder auf: Die Nachkommen werden ungleichmäßig, und der Heterosiseffekt halbiert sich. **Hybridsaatgut lässt sich deshalb nicht nachbauen** — wer F2-Saatgut aussät, erntet einen uneinheitlichen Bestand mit deutlich geringerer Leistung. Genau daraus folgt, dass Hybridsaatgut jedes Jahr neu gekauft werden muss; das ist keine vertragliche Willkür, sondern Biologie.\n\n**Wo Hybriden die Praxis bestimmen:**\n- **Mais** — praktisch vollständig auf Hybriden umgestellt, seit den 1930er-Jahren in den USA und ab den 1950er-Jahren in Europa; die Ertragssteigerung im Mais geht zu einem erheblichen Teil darauf zurück\n- **Roggen** — Hybridroggen bringt 20 bis 40 % Mehrertrag gegenüber Populationssorten, siehe [[zito-ozime]]\n- **Zuckerrübe, Sonnenblume, Raps** — bei Raps überwiegend Hybridsorten\n- **Geflügel** — Lege- und Masthybriden sind durchweg Mehrweg-Kreuzungen aus streng getrennten Elternlinien\n- **Schwein** — die Sau ist meist eine F1 aus Deutscher Landrasse und Deutschem Edelschwein, angepaart mit einem Endstufeneber\n\n**Warum Heterosis wirkt**, ist nicht abschließend geklärt; die verbreitetste Erklärung ist, dass sich rezessive Schwächen der einen Linie durch die intakten Allele der anderen ausgleichen. Am stärksten zeigt sich der Effekt bei **niedrig erblichen Merkmalen** — Fruchtbarkeit, Vitalität, Widerstandsfähigkeit —, also gerade dort, wo die Reinzucht nur langsam vorankommt.\n\n**Die Kehrseite** ist die Abhängigkeit: Wer auf Hybriden setzt, ist auf Saatgut- und Zuchtunternehmen angewiesen und kann keine eigene Nachzucht aufbauen. Für den Erhalt genetischer Vielfalt und im Ökolandbau, wo Nachbau eine Rolle spielt, sind Populationssorten deshalb weiterhin von Bedeutung.",
    "related": [
      "plemenna-kniha",
      "inseminace",
      "zito-ozime",
      "kukurice-silazni"
    ]
  },
  {
    "slug": "precision-livestock-farming",
    "term": "Precision Livestock Farming",
    "alias": [
      "PLF",
      "Präzisionstierhaltung",
      "Smart Farming im Stall"
    ],
    "kategorie": "precise-farming",
    "shortDef": "Precision Livestock Farming überwacht Tiere einzeln und laufend über Sensoren — und erkennt Erkrankungen, bevor sie sichtbar werden.",
    "longDef": "Precision Livestock Farming bezeichnet die kontinuierliche, automatisierte Überwachung einzelner Tiere über Sensoren. Der Grundgedanke folgt aus der Bestandsentwicklung: In einer Herde mit 30 Kühen kennt der Landwirt jedes Tier; bei 300 ist die tägliche Einzeltierbeurteilung schlicht nicht mehr leistbar. Die Technik ersetzt nicht das Auge — sie richtet es auf die richtigen Tiere.\n\n**Was gemessen wird**: Aktivität und Wiederkauzeit über Halsband, Ohr- oder Fußsensoren; Körpertemperatur über Bolus im Pansen oder Ohrsensor; Futter- und Wasseraufnahme über Wiegetröge und Tränkezähler; Milchmenge, Leitfähigkeit und teils Inhaltsstoffe bei jedem Gemelk; Gewicht und Körperkondition über 3D-Kameras; Lahmheit über Gangbildanalyse; im Schweine- und Geflügelstall zusätzlich Husten- und Geräuscherkennung sowie Bildanalyse des Verhaltens.\n\n**Der eigentliche Gewinn ist die Früherkennung.** Ein Tier, das erkrankt, verändert sein Verhalten typischerweise **zwölf bis achtundvierzig Stunden**, bevor klinische Symptome sichtbar werden: Es frisst weniger, wiederkaut kürzer, bewegt sich anders. Der Sensor bemerkt das, das Auge noch nicht. Früher behandelt heißt milderer Verlauf, kürzere Behandlungsdauer — und **weniger Antibiotikaeinsatz**, was angesichts der verschärften Vorgaben der EU-Tierarzneimittelverordnung unmittelbar zählt, siehe [[zaprahnuti]].\n\n**Der zweite Bereich ist die Fortpflanzung**: Die automatische Brunsterkennung erreicht Raten über 90 %, während die rein visuelle Beobachtung bei 40 bis 60 % liegt. Jede erkannte Brunst spart 21 Tage Zwischenkalbezeit.\n\n**Die Grenzen** liegen weniger in der Messtechnik als in der Auswertung: Zu viele Alarme führen dazu, dass sie ignoriert werden — die Alarmschwellen müssen betriebsindividuell eingestellt sein. Und die Anschaffungskosten rechnen sich in kleinen Beständen oft nicht.\n\n**Ein Aspekt, der an Bedeutung gewinnt**: PLF-Daten sind zunehmend auch **Nachweisinstrument**. Tierwohlprogramme, Molkereistandards und die staatliche Tierhaltungskennzeichnung verlangen Dokumentation; kontinuierlich erhobene Sensordaten liefern sie ohne zusätzlichen Aufwand.",
    "related": [
      "rijnost",
      "mastitida",
      "bcs-body-condition",
      "ku-kontrola-uzitkovosti",
      "transition-period",
      "dojirna"
    ]
  },
  {
    "slug": "satelity-zemedelstvi",
    "term": "Satellitendaten in der Landwirtschaft",
    "alias": [
      "Copernicus",
      "Sentinel",
      "Fernerkundung",
      "Flächenmonitoring"
    ],
    "kategorie": "precise-farming",
    "shortDef": "Satellitendaten liefern kostenlose, flächendeckende Aufnahmen für Bestandsführung und Ertragsschätzung — und sind seit 2023 Grundlage der amtlichen Flächenkontrolle.",
    "longDef": "Für die Landwirtschaft am wichtigsten sind die **Sentinel-Satelliten** des EU-Erdbeobachtungsprogramms **Copernicus**. **Sentinel-2** liefert optische Aufnahmen mit 10 bis 20 m Auflösung alle drei bis fünf Tage, **Sentinel-1** Radardaten, die auch durch Wolken hindurch messen — in Mitteleuropa mit seiner häufigen Bewölkung ein entscheidender Vorteil. **Alle Daten sind frei und kostenlos verfügbar.**\n\n**Was daraus abgeleitet wird**: Vegetationsindizes wie der **NDVI** als Maß für Biomasse und Vitalität, daraus Zonierungen für teilflächenspezifische Bewirtschaftung, siehe [[mapa-vra]], die Erkennung von Wachstumsunterschieden und Schadstellen, die Verfolgung des Bodenbedeckungsgrads sowie Ertragsschätzungen ganzer Regionen.\n\n**Die folgenreichste Anwendung ist jedoch amtlicher Natur — und sie betrifft jeden Antragsteller.** Mit der GAP-Reform 2023 ist das **flächendeckende Monitoring (Area Monitoring System, AMS)** verbindlich geworden. Die Zahlstellen werten die Sentinel-Daten für **alle beantragten Flächen** automatisiert aus und prüfen, ob die angegebene Nutzung und die Auflagen mit dem übereinstimmen, was der Satellit sieht: ob eine Fläche tatsächlich bewirtschaftet wurde, wann gemäht wurde, ob eine Zwischenfrucht steht, ob Bodenbedeckung nach GLÖZ 6 vorliegt.\n\nDas ist ein grundlegender Systemwechsel: **An die Stelle der Stichprobenkontrolle vor Ort ist die lückenlose Fernüberwachung getreten.** Nicht mehr wenige Prozent der Betriebe werden geprüft, sondern alle Flächen laufend. Der Ausgleich dafür ist die Möglichkeit zur **Nachbesserung**: Fällt eine Abweichung auf, wird der Betrieb — in Deutschland meist über eine App mit georeferenzierten Fotos — zur Klärung aufgefordert, bevor eine Sanktion greift.\n\n**Die Grenzen der Technik** sind zu kennen: Bewölkung schränkt optische Aufnahmen ein, die Auflösung reicht für kleinteilige Strukturen und schmale Streifen oft nicht, und Vegetationsindizes zeigen **dass** ein Bestand schwächer ist, nicht **warum**. Für die Ursachenklärung braucht es weiterhin den Blick ins Feld — und häufig den Spaten.",
    "related": [
      "ndvi",
      "variable-rate",
      "gps-rtk",
      "lpis",
      "karbonove-zemedelstvi",
      "telematika",
      "drony-zemedelstvi"
    ]
  },
  {
    "slug": "agrolesnictvi",
    "term": "Agroforstwirtschaft",
    "alias": [
      "Agroforst",
      "Agroforstsystem",
      "Alley Cropping"
    ],
    "kategorie": "precise-farming",
    "shortDef": "Agroforstwirtschaft kombiniert Gehölze mit Acker- oder Grünlandnutzung auf derselben Fläche — in Deutschland seit 2023 als Öko-Regelung förderfähig.",
    "longDef": "Agroforstwirtschaft bezeichnet die gezielte Kombination von **Gehölzen mit landwirtschaftlicher Nutzung auf derselben Fläche**. Die verbreitetste Form ist das **Alley Cropping**: Baumstreifen von wenigen Metern Breite wechseln sich mit breiten, maschinengerecht bewirtschafteten Ackerstreifen ab. Daneben gibt es **silvopastorale Systeme** mit Bäumen auf der Weide sowie die traditionellen **Streuobstwiesen**, die faktisch nichts anderes sind.\n\n**Was die Gehölze leisten:**\n- **Windschutz** — die wirksamste und am besten belegte Funktion; die Windgeschwindigkeit sinkt im Lee auf ein Vielfaches der Baumhöhe, was Verdunstung und Winderosion deutlich reduziert\n- **Erosionsschutz** quer zum Hang\n- **Erschließung tieferer Bodenschichten** — die Baumwurzeln holen Wasser und Nährstoffe aus Tiefen, die Ackerkulturen nicht erreichen, und geben sie über Laubfall an die Oberfläche zurück\n- **Beschattung und Kühlung** — in der Weidehaltung ein Tierwohlfaktor, der mit zunehmenden Hitzesommern an Gewicht gewinnt\n- **Biodiversität** — Strukturvielfalt für Vögel, Insekten und Niederwild\n- **Kohlenstoffbindung** in Holz und Boden, siehe [[karbonove-zemedelstvi]]\n- **Zusätzliche Erträge** — Wertholz, Energieholz aus Kurzumtrieb, Obst oder Nüsse\n\n**Die Kehrseite** ist ehrlich zu benennen: Die Gehölze konkurrieren um Licht, Wasser und Nährstoffe, sodass der Ertrag im unmittelbaren Randbereich sinkt. Der Nutzen entsteht aus der Summe beider Nutzungen und über lange Zeiträume — Agroforst rechnet sich nicht im ersten Jahr.\n\n**Rechtlich hat sich in Deutschland Entscheidendes geändert.** Lange galt: Wer Bäume pflanzte, riskierte, dass die Fläche als beihilfefähiges Ackerland eingestuft wurde und Direktzahlungen entfielen — ein wirksames Abschreckungsargument. Seit der GAP-Reform 2023 sind **Agroforstsysteme ausdrücklich beihilfefähig**, und Deutschland fördert sie über die **Öko-Regelung 3**. Voraussetzung ist ein Nutzungskonzept mit definierten Anforderungen an Streifenbreite, Flächenanteil und Anordnung; die Fläche behält ihren Status als Ackerland oder Dauergrünland.\n\nIn Österreich sind Agroforstflächen ebenfalls über den GAP-Strategieplan zugänglich; Streuobstflächen genießen zusätzlich landesrechtlichen Schutz.",
    "related": [
      "karbonove-zemedelstvi",
      "regenerativni-zemedelstvi",
      "eroze-pudy",
      "mez",
      "biopasy",
      "gaec"
    ]
  },
  {
    "slug": "hydroponie",
    "term": "Hydroponik",
    "alias": [
      "Hydrokultur",
      "erdelose Kultur",
      "NFT"
    ],
    "kategorie": "precise-farming",
    "shortDef": "Bei der Hydroponik wachsen Pflanzen ohne Boden in einer Nährlösung — hocheffizient beim Wasser, aber im EU-Ökolandbau nicht zulässig.",
    "longDef": "Hydroponik bezeichnet den Anbau ohne Boden: Die Wurzeln stehen in einer Nährlösung oder in einem inerten Substrat wie Steinwolle, Kokosfaser oder Perlit, das nur der Verankerung dient. Alle Nährstoffe werden über die Lösung zugeführt und laufend nachgeregelt.\n\n**Die gängigen Verfahren** sind das **NFT-System**, bei dem ein dünner Nährlösungsfilm durch flache Rinnen läuft, die **Deep Water Culture** mit belüfteten Wurzeln im Wasserbecken, die **Tropfbewässerung auf Substratmatten** — im Gewächshausgemüsebau der Standard — und die **Aeroponik**, bei der die Wurzeln in einem Nebel hängen.\n\n**Die Vorteile sind erheblich**: Der Wasserverbrauch sinkt gegenüber dem Feldanbau um bis zu 90 %, weil die Lösung im Kreislauf geführt wird. Die Nährstoffversorgung lässt sich exakt steuern, es gibt keine bodenbürtigen Krankheiten und keine Unkrautkonkurrenz, die Flächenproduktivität ist ein Vielfaches, und die Erzeugung ist ganzjährig planbar.\n\n**Die Grenzen ebenso**: hoher Energiebedarf für Beleuchtung, Klimatisierung und Pumpen; hohe Investitionskosten; und eine ausgeprägte **Störanfälligkeit** — fällt die Pumpe aus, sterben die Pflanzen binnen Stunden, weil kein Bodenwasserspeicher puffert. Hinzu kommt, dass sich ein Krankheitserreger im Kreislaufsystem in kürzester Zeit auf den gesamten Bestand verteilt, weshalb die Entkeimung der Lösung über UV oder Erhitzung sicherheitsrelevant ist.\n\n**Ein Punkt mit rechtlicher Tragweite, der oft überrascht**: Hydroponik ist im **EU-Ökolandbau nicht zulässig**. Die EU-Ökoverordnung verlangt ausdrücklich, dass Pflanzen **im lebenden Boden** wachsen; die Bodenbindung ist ein Grundprinzip. Erdelos erzeugtes Gemüse darf in der EU daher nicht als Bio vermarktet werden — anders als etwa in den USA, wo das zulässig ist. Wer entsprechende Importware im Regal sieht, sollte das im Blick behalten.\n\n**Wirtschaftlich** ist Hydroponik in Mitteleuropa bei hochpreisigen Kulturen etabliert — Tomate, Gurke, Paprika, Salat und Kräuter im Gewächshaus. Bei Grundnahrungsmitteln wie Getreide oder Kartoffeln ist sie energetisch und wirtschaftlich weit von der Konkurrenzfähigkeit entfernt.",
    "related": [
      "vertikalni-farma",
      "npk-hnojivo"
    ]
  },
  {
    "slug": "vertikalni-farma",
    "term": "Vertical Farming",
    "alias": [
      "vertikale Landwirtschaft",
      "Indoor Farming",
      "Plant Factory"
    ],
    "kategorie": "precise-farming",
    "shortDef": "Beim Vertical Farming wachsen Pflanzen in gestapelten Ebenen unter LED-Licht in vollständig kontrollierter Umgebung.",
    "longDef": "Vertical Farming stapelt Anbauflächen in mehreren Ebenen übereinander, in geschlossenen Gebäuden ohne Tageslicht. Licht liefern **LED-Module** mit auf die Pflanze abgestimmten Spektren; Temperatur, Luftfeuchte, CO₂-Gehalt und Nährlösung werden vollständig geregelt. Technisch beruht es auf der [[hydroponie]].\n\n**Was tatsächlich funktioniert**: Der Flächenertrag je Quadratmeter Grundfläche ist ein Vielfaches des Feldanbaus, der Wasserverbrauch sinkt drastisch, Pflanzenschutzmittel entfallen weitgehend, die Produktion ist ganzjährig und wetterunabhängig planbar, und die Anlage kann unmittelbar am Verbrauchsort in der Stadt stehen, was Transportwege und Frischeverluste minimiert.\n\n**Wo die Grenze verläuft, ist eine Energiefrage — und sie ist eindeutig.** Draußen liefert die Sonne die Energie umsonst. Im Vertical Farming muss jedes Photon erzeugt und jede Kilowattstunde bezahlt werden, dazu Kühlung, weil LEDs Abwärme produzieren. Daraus folgt eine klare Trennlinie:\n\n**Wirtschaftlich tragfähig** sind Kulturen mit hohem Wert je Kilogramm, kurzer Kulturdauer, geringer Wuchshöhe und hohem Wassergehalt: **Salate, Kräuter, Microgreens, Jungpflanzen und Setzlinge**. Genau darauf haben sich die überlebenden Betreiber konzentriert.\n\n**Nicht tragfähig** sind Grundnahrungsmittel. Weizen, Mais, Kartoffeln oder Zuckerrüben im Vertical Farming zu erzeugen ist technisch möglich und energetisch absurd — die Kalorien im Erzeugnis stehen in keinem Verhältnis zur eingesetzten Energie. Die gelegentlich zu lesende Vorstellung, Vertical Farming werde den Ackerbau ersetzen, ist damit erledigt.\n\n**Die Branche hat eine harte Konsolidierung hinter sich.** Nach einer Phase hoher Erwartungen und großer Finanzierungsrunden mussten zwischen 2022 und 2024 mehrere prominente Unternehmen in Europa und den USA aufgeben — steigende Strompreise trafen ein Geschäftsmodell, dessen größter Kostenblock die Energie ist. Erfolgreich sind heute vor allem Anlagen mit engem Sortiment, direkter Anbindung an den Handel und Zugang zu günstigem Strom.\n\n**Rechtlich** gilt dasselbe wie für die Hydroponik: Eine Bio-Zertifizierung nach EU-Ökoverordnung ist wegen der fehlenden Bodenbindung nicht möglich.",
    "related": [
      "hydroponie",
      "satelity-zemedelstvi",
      "precision-livestock-farming"
    ]
  },
  {
    "slug": "agro-iot",
    "term": "IoT in der Landwirtschaft",
    "alias": [
      "Internet der Dinge",
      "Agrar-IoT",
      "Sensorvernetzung"
    ],
    "kategorie": "precise-farming",
    "shortDef": "Agrar-IoT vernetzt Sensoren, Maschinen und Ställe zu einem System, das Daten selbsttätig erfasst und auswertet.",
    "longDef": "Das Internet der Dinge bezeichnet die Vernetzung physischer Geräte, die Daten erfassen, austauschen und darauf reagieren. In der Landwirtschaft betrifft das drei Bereiche.\n\n**Auf dem Feld**: Bodenfeuchte- und Temperatursensoren, Wetterstationen mit Blattnässemessung als Grundlage für Prognosemodelle, Füllstandsmelder an Silos und Tanks, Pheromonfallen mit automatischer Bilderkennung und GPS-Tracker an Maschinen und Anhängern.\n\n**Im Stall**: Aktivitäts- und Wiederkausensoren zur Brunst- und Krankheitserkennung, siehe [[rijnost]], Bolus- und Ohrsensoren für die Körpertemperatur, Klimasteuerungen, die Lüftung und Heizung selbsttätig regeln, Wiegesysteme und Tränkeüberwachung.\n\n**In der Maschine**: Telemetrie mit Positionen, Betriebsstunden, Kraftstoffverbrauch und Fehlercodes, dazu die Erfassung von Ertrag und Feuchte während der Ernte.\n\n**Der Punkt, an dem es in der Praxis scheitert, ist selten die Technik.** Drei Hürden bestimmen den Erfolg:\n\n**Die Netzabdeckung.** Ein Sensor mitten im Feld braucht eine Verbindung. Klassisches Mobilfunknetz ist auf vielen ländlichen Flächen unzuverlässig; verbreitet sind deshalb **LoRaWAN** und **NB-IoT**, die auf große Reichweite bei kleiner Datenmenge und langer Batterielaufzeit ausgelegt sind. Für einen Bodenfeuchtewert alle zehn Minuten reicht das vollkommen.\n\n**Die Datenintegration.** Sensoren verschiedener Hersteller liefern Daten in unterschiedliche Portale. Ohne Zusammenführung in einem [[fmis]] entsteht ein Flickenteppich aus Einzel-Apps, den niemand täglich öffnet — die häufigste Ursache dafür, dass Systeme nach einem Jahr ungenutzt bleiben.\n\n**Die Entscheidungsrelevanz.** Eine Zahl, aus der keine Handlung folgt, ist Datenmüll. Der Nutzen entsteht erst, wenn aus der Messung eine Empfehlung wird — und aus der Empfehlung eine Maßnahme.\n\n**Zur Datenhoheit** gilt dasselbe wie beim Farmmanagementsystem: Wem die erzeugten Daten gehören und wer sie auswerten oder weitergeben darf, regelt bislang vor allem der freiwillige EU-Verhaltenskodex zum Agrardatenaustausch. Ein Blick in die Vertragsbedingungen gehört vor jede Anschaffung.",
    "related": [
      "telematika",
      "precision-livestock-farming",
      "satelity-zemedelstvi",
      "gps-rtk",
      "variable-rate",
      "isobus",
      "yield-monitor"
    ]
  },
  {
    "slug": "carbon-credits",
    "term": "CO₂-Zertifikate",
    "alias": [
      "Klimazertifikate",
      "Humuszertifikate",
      "Carbon Credits"
    ],
    "kategorie": "precise-farming",
    "shortDef": "CO₂-Zertifikate verbriefen eine Tonne gebundenes oder vermiedenes Kohlendioxid und werden auf freiwilligen Märkten gehandelt — mit erheblichen Qualitätsunterschieden.",
    "longDef": "Ein CO₂-Zertifikat verbrieft die Bindung oder Vermeidung einer Tonne Kohlendioxidäquivalent. Käufer sind überwiegend Unternehmen, die ihre Emissionen freiwillig kompensieren wollen.\n\n**Zwei Märkte sind streng zu unterscheiden** — und ihre Verwechslung ist die Quelle vieler Missverständnisse:\n\nDer **verpflichtende Markt**, in Europa das **EU-Emissionshandelssystem (EU-ETS)**, betrifft Energiewirtschaft, Industrie und Luftverkehr. Die Landwirtschaft ist darin **nicht** einbezogen; landwirtschaftliche Zertifikate lassen sich dort nicht verkaufen.\n\nDer **freiwillige Markt** ist der, auf dem Humuszertifikate gehandelt werden. Er ist deutlich kleiner, preislich volatil und war lange unreguliert.\n\n**Die Kritik am freiwilligen Markt ist erheblich und berechtigt.** Untersuchungen zu internationalen Waldschutzprojekten haben gezeigt, dass ein großer Teil der verkauften Gutschriften keine reale zusätzliche Bindung repräsentierte. Übertragen auf landwirtschaftliche Humuszertifikate stellen sich dieselben Fragen: Wurde tatsächlich gemessen oder nur modelliert? War die Maßnahme zusätzlich? Bleibt der Kohlenstoff drin?\n\n**Genau hier setzt die EU an**: Mit dem 2024 verabschiedeten **CRCF-Zertifizierungsrahmen** entstehen erstmals verbindliche Anforderungen an Quantifizierung, Zusätzlichkeit, Dauerhaftigkeit und Nachhaltigkeit. Zugleich schränkt die **Green-Claims-Regulierung** ein, wie Unternehmen mit Kompensation werben dürfen — pauschale Aussagen wie klimaneutral geraten zunehmend unter Druck, was auf die Nachfrageseite zurückwirkt.\n\n**Für den Landwirt** bleibt die nüchterne Rechnung: Der Ertrag aus Zertifikaten ist derzeit gering, die vertraglichen Bindungen sind lang, und das Risiko der Rückabwicklung liegt in aller Regel beim Bewirtschafter. Vor der Unterschrift sind Laufzeit, Messverfahren, Kostenträger, Ausstiegsklauseln und die Folgen bei Pachtende oder Verkauf zu klären — am besten mit rechtlicher Beratung.\n\n**Der wichtigste Satz zum Schluss**: Ein Zertifikat ist immer nur so gut wie die Messung dahinter. Siehe [[karbonove-zemedelstvi]].",
    "related": [
      "karbonove-zemedelstvi",
      "regenerativni-zemedelstvi",
      "no-till",
      "mezi-plodiny",
      "biouhel",
      "ttp",
      "agrolesnictvi",
      "satelity-zemedelstvi"
    ]
  },
  {
    "slug": "matka",
    "term": "Bienenkönigin",
    "alias": [
      "Königin",
      "Weisel"
    ],
    "kategorie": "vcelarstvi",
    "shortDef": "Die Königin ist das einzige geschlechtsreife Weibchen im Volk; sie legt die Eier und hält das Volk über ihre Pheromone zusammen.",
    "longDef": "Die Königin entwickelt sich aus einem befruchteten Ei in einer Weiselzelle und benötigt dafür rund 16 Tage (Ei 3 Tage, Larve 5,5 Tage, Puppe 7,5 Tage). Von den Arbeiterinnen unterscheidet sie sich durch den deutlich verlängerten Hinterleib, fehlende Pollenhöschen und ein höheres Gewicht von 180 bis 300 mg.\n\nAuf dem Hochzeitsflug paart sie sich in der Regel mit 10 bis 20 Drohnen und speichert deren Samen in der Samenblase (Spermatheka). Dieser Vorrat reicht für drei bis fünf Jahre intensiver Eiablage. Eine leistungsfähige Königin legt in der Saison 1.500 bis 2.500 Eier täglich, ausnahmsweise bis zu 3.000.\n\nIn einem gesunden Volk gibt es immer nur eine Königin. Ihr Pheromoncocktail — die Weiselsubstanz, chemisch vor allem 9-Oxo-2-decensäure — unterdrückt bei den Arbeiterinnen die Entwicklung der Eierstöcke und hemmt den Bau von Weiselzellen. Lässt dieses Signal nach, kommt es zur stillen Umweiselung oder zum Schwarm.\n\nDer Imker beobachtet Alter und Legeleistung der Königin. Alte oder schadhafte Königinnen führen zum Abbau des Volkes und werden üblicherweise alle zwei bis drei Jahre ersetzt. Zuchtköniginnen werden von Züchtern im Zusetzkäfig versandt.",
    "related": [
      "delnice",
      "trubec",
      "materi-mrizka",
      "materi-kasicka",
      "rojeni",
      "snubni-prolet",
      "matka-neoplozena",
      "kladeni-matky"
    ]
  },
  {
    "slug": "delnice",
    "term": "Arbeiterin",
    "alias": [
      "Arbeitsbiene"
    ],
    "kategorie": "vcelarstvi",
    "shortDef": "Arbeiterinnen sind geschlechtlich unterentwickelte Weibchen, die die überwiegende Mehrheit des Volkes bilden und sämtliche Arbeiten im Stock und im Feld übernehmen.",
    "longDef": "Die Arbeiterin entwickelt sich aus einem befruchteten Ei in rund 21 Tagen (Ei 3 Tage, Larve 6 Tage, Puppe 12 Tage) und wiegt ausgewachsen etwa 90 bis 120 mg. In der Saison zählt ein Volk 40.000 bis 80.000 Arbeiterinnen, im Winter sinkt die Zahl auf 10.000 bis 20.000.\n\nEine Sommerbiene lebt vier bis sechs Wochen, eine Winterbiene vier bis sechs Monate. Die Aufgaben wechseln mit dem Alter: Junge Arbeiterinnen (1. bis 10. Tag) pflegen die Brut und füttern die Königin, im mittleren Alter (10. bis 20. Tag) nehmen sie Nektar ab, bauen Waben und halten Wache, ab dem 21. Tag fliegen sie als Sammlerinnen aus und tragen Nektar, Pollen, Harz und Wasser ein.\n\nArbeiterinnen verfügen über spezialisierte Organe: Körbchen an den Hinterbeinen für den Pollentransport, Wachsdrüsen am Hinterleib und eine Giftblase mit Stachel. Der Widerhakenstachel bleibt in der Haut von Säugetieren stecken. Anders als die Königin besitzen sie voll entwickelte Futtersaftdrüsen zur Erzeugung von Gelée royale.\n\nBleibt ein Volk längere Zeit weisellos, beginnen einzelne Arbeiterinnen nach drei bis vier Wochen, unbefruchtete Eier zu legen — es entstehen Drohnenmütterchen und damit ein drohnenbrütiges, verlorenes Volk.",
    "related": [
      "matka",
      "trubec",
      "vcelstvo",
      "pyl-rousky",
      "snuska",
      "vcelivosk"
    ]
  },
  {
    "slug": "trubec",
    "term": "Drohn",
    "alias": [
      "Drohnen"
    ],
    "kategorie": "vcelarstvi",
    "shortDef": "Der Drohn ist das Männchen der Honigbiene; seine einzige biologische Aufgabe ist die Begattung der Königin auf dem Hochzeitsflug.",
    "longDef": "Der Drohn entwickelt sich parthenogenetisch aus einem unbefruchteten Ei und benötigt dafür etwa 24 Tage. Ausgewachsen wiegt er 200 bis 250 mg. Drohnen besitzen weder Stachel noch Pollenkörbchen — sie können sich nicht selbst versorgen und sind vollständig auf die Vorräte des Volkes angewiesen.\n\nIn der Saison von April bis August leben 200 bis 1.500 Drohnen in einem Volk. An warmen, sonnigen Tagen verlassen sie den Stock und fliegen zu den Drohnensammelplätzen, wo sie auf Königinnen warten. Ein Drohn, der sich mit einer Königin paart, stirbt unmittelbar nach der Kopulation.\n\nAm Ende der Saison, meist im August und September, treiben die Arbeiterinnen die Drohnen aus dem Stock — die sogenannte Drohnenschlacht senkt den Verbrauch der Wintervorräte. Treten Drohnen außerhalb der üblichen Zeit oder in auffällig großer Zahl auf, kann das auf den Verlust der Königin oder auf Weisellosigkeit hindeuten.\n\nIn der Zucht spielt die Drohnenqualität eine Schlüsselrolle, denn Drohnen tragen das Erbgut weiter — auf dem freien Hochzeitsflug allerdings völlig unkontrolliert. Die kontrollierte Anpaarung auf einer Belegstelle oder mittels künstlicher Besamung ist deshalb das entscheidende Selektionswerkzeug.",
    "related": [
      "matka",
      "vcelstvo",
      "snubni-prolet",
      "oplodnacek",
      "trubcina"
    ]
  },
  {
    "slug": "vcelstvo",
    "term": "Bienenvolk",
    "alias": [
      "Volk",
      "Bien"
    ],
    "kategorie": "vcelarstvi",
    "shortDef": "Das Bienenvolk ist die biologische Einheit aus Königin, Arbeiterinnen und Drohnen, die als Superorganismus mit gemeinsamer Temperaturregelung und kollektiver Verteidigung funktioniert.",
    "longDef": "Ein Bienenvolk besteht aus einer einzigen Königin, saisonal 40.000 bis 80.000 Arbeiterinnen und einigen hundert bis tausend Drohnen. Als Ganzes hält es die Temperatur im Brutnest unabhängig von der Außenwitterung bei 34 bis 35 °C — die Arbeiterinnen erzeugen Wärme durch Muskelzittern und kühlen im Sommer umgekehrt durch Verdunstung von Wasser. Diese Thermoregulation ist Voraussetzung für eine gesunde Brutentwicklung.\n\nDie Verständigung im Volk läuft über chemische Signale — Weiselsubstanz, Nasonow-Duftstoff, das Alarmpheromon Isopentylacetat bei der Verteidigung — und über Bewegungssignale, allen voran den Schwänzeltanz. Der Verlust der Königin führt zu einem Pheromondefizit, das die Arbeiterinnen binnen Stunden bemerken; sie beginnen dann Nachschaffungszellen zu ziehen.\n\nDer Gesundheitszustand des Volkes ist die zentrale Größe für den Imker. Beurteilt werden Menge und Bild der Brut (verdeckelt oder offen, geschlossen oder lückig), das Verhalten am Flugloch, der Umfang der Wintervorräte und der Befall mit Parasiten, insbesondere der Varroamilbe. In der Saison wird das Volk üblicherweise alle sieben bis zehn Tage durchgesehen.\n\nEin starkes Volk mit 60.000 bis 80.000 Arbeiterinnen ist die Voraussetzung für einen wirtschaftlich interessanten Honigertrag. Der durchschnittliche Ertrag je Volk schwankt in Deutschland und Österreich je nach Jahr, Region und Trachtangebot erheblich und liegt meist in einer Größenordnung von 20 bis 40 kg.",
    "related": [
      "matka",
      "delnice",
      "trubec",
      "rojeni",
      "zazimovani",
      "ul-pojem"
    ]
  },
  {
    "slug": "plast",
    "term": "Wabe",
    "alias": [
      "Bienenwabe",
      "Wabenwerk"
    ],
    "kategorie": "vcelarstvi",
    "shortDef": "Die Wabe ist das System sechseckiger Wachszellen, das die Bienen als Lager für Honig und Pollen sowie als Kinderstube für die Brut bauen.",
    "longDef": "Die Wabe entsteht aus Wachsplättchen, die die Arbeiterinnen aus vier Paar Wachsdrüsen am Hinterleib ausschwitzen. Eine Arbeiterin erzeugt in ihrem Leben ein bis zwei Gramm Wachs; für ein Kilogramm Wabenbau verbraucht das Volk etwa sechs bis acht Kilogramm Honig. Gebaut wird vor allem bei gutem Nektarangebot und warmer Witterung.\n\nDie sechseckige Zelle ist geometrisch optimal — sie bietet maximales Volumen bei minimalem Materialeinsatz. Arbeiterinnenzellen messen im Durchmesser rund 5,2 bis 5,4 mm, Drohnenzellen 6,2 bis 6,9 mm. In der modernen Magazinbeute hängen die Waben senkrecht in Rähmchen.\n\nIm Brutraum dienen die Zellen der Eiablage und der Aufzucht der Larven. Im Honigraum sind sie mit reifem Honig gefüllt und mit einem Wachsdeckel verschlossen. Pollen wird als Bienenbrot in den Zellen unmittelbar am Brutnest eingelagert und dort in verschiedenfarbigen Schichten festgestampft.\n\nAlte, dunkle Waben mit eingelagerten Larvenhäutchen verschlechtern die Hygiene und erhöhen das Krankheitsrisiko. Imker erneuern deshalb jedes Jahr oder alle zwei Jahre einen Teil der Waben, vor allem im Brutraum. Ausgemusterte Waben werden eingeschmolzen, das Wachs wird verkauft oder zu Mittelwänden verarbeitet.",
    "related": [
      "vcelivosk",
      "vceli-plod",
      "mezistena-pojem",
      "vcelarsky-ramek"
    ]
  },
  {
    "slug": "vceli-dilo",
    "term": "Wabenbau",
    "alias": [
      "Bienenbau",
      "Wabenwerk"
    ],
    "kategorie": "vcelarstvi",
    "shortDef": "Als Wabenbau bezeichnet man die Gesamtheit aller Waben in der Beute — den Lebensraum des Volkes mit Brut- und Honigzonen.",
    "longDef": "Der Begriff Wabenbau umfasst alle Waben — Brutwaben wie Honigwaben — die in den Rähmchen des Brut- und Honigraums hängen. Die Qualität des Wabenbaus gehört zu den wichtigsten Merkmalen, die bei der Frühjahrsdurchsicht beurteilt werden.\n\nEin gesunder Bau ist geschlossen: Das Brutnest ist kompakt zusammenhängend, Honig und Pollen liegen gleichmäßig am Rand und im oberen Bereich der Waben. Lückige oder verstreute Brut deutet auf Krankheit — Faulbrut oder Sackbrut —, auf Probleme mit der Königin oder auf ungünstige äußere Bedingungen hin.\n\nAlte schwarze Waben werden im Brutraum alle ein bis zwei Jahre ersetzt; im Honigraum halten Waben länger, weil sich dort keine Larvenhäutchen ansammeln. Die regelmäßige Wabenerneuerung senkt die chemische Belastung — Rückstände von Akariziden reichern sich im Wachs an — und verbessert die Nesthygiene.\n\nDer Imker nutzt die Zahl der besetzten Waben als Maß für die Volksstärke: Ein starkes einwinterndes Volk besetzt in der Zander- oder Deutsch-Normalmaß-Beute etwa acht bis zehn Rähmchen. Eine mit Pollen gefüllte Wabe heißt Pollenwabe und bildet den Eiweißvorrat für die Frühjahrsentwicklung.",
    "related": [
      "plast",
      "vcelivosk",
      "vceli-plod",
      "ul-pojem",
      "vcelarsky-ramek"
    ]
  },
  {
    "slug": "vcelarsky-ramek",
    "term": "Rähmchen",
    "alias": [
      "Wabenrähmchen",
      "Rahmen"
    ],
    "kategorie": "vcelarstvi",
    "shortDef": "Das Rähmchen ist der hölzerne oder kunststoffene Träger, in dem die Bienen ihre Wabe bauen; sein Maß bestimmt das Beutensystem und erlaubt den Wabentausch ohne Beschädigung.",
    "longDef": "Ein Rähmchen besteht aus Ober- und Unterträger sowie zwei Seitenteilen. Genormte Maße sorgen dafür, dass Waben zwischen Beuten desselben Systems beliebig getauscht werden können. Im deutschsprachigen Raum am weitesten verbreitet sind Zandermaß (420 × 220 mm) und Deutsch Normalmaß (370 × 223 mm), daneben Dadant-Blatt und Langstroth; in Österreich ist zusätzlich das Zandermaß dominierend, historisch auch das Kuntzsch-Hochmaß. Honigraumrähmchen sind oft nur halb so hoch wie Brutraumrähmchen.\n\nDas Rähmchen wird mit drei bis vier Reihen Edelstahldraht bespannt, an denen die Mittelwand — eine vorgeprägte Wachsplatte als Bauvorlage — eingelötet wird. Alternativ gibt es Rähmchen mit Kunststoffmittelwand oder reine Anfangsstreifen für den Naturwabenbau.\n\nZwischen benachbarten Rähmchen wird der Bienenabstand (bee space) von 6 bis 9 mm eingehalten. Diesen Zusammenhang beschrieb der amerikanische Imker Lorenzo Langstroth 1851 — er ist die Grundlage der beweglichen Wabe. Ein kleinerer Abstand wird mit Propolis verkittet, ein größerer mit Wildbau ausgefüllt.\n\nRähmchen werden an den Seitenteilen angefasst, nicht allein am Oberträger — sonst reißt die Wabe aus. Der Handel liefert sie fertig oder als Bausatz.",
    "related": [
      "plast",
      "mezistena-pojem",
      "rozperka-pojem",
      "ul-pojem",
      "vceli-dilo"
    ]
  },
  {
    "slug": "nastavek",
    "term": "Zarge",
    "alias": [
      "Magazin",
      "Honigraumzarge"
    ],
    "kategorie": "vcelarstvi",
    "shortDef": "Die Zarge ist ein einzelner Kasten der Magazinbeute — meist als Honigraum aufgesetzt, um dem Volk Platz zum Einlagern des Honigs zu geben.",
    "longDef": "Das Magazinsystem — im deutschsprachigen Raum vor allem Zander, Dadant und Deutsch Normalmaß — erlaubt es, den Beutenraum durch Aufsetzen genormter Kästen beliebig zu erweitern. Die unterste Zarge ist der Brutraum, in dem die Brut aufgezogen wird und das Volk überwintert; die aufgesetzten Zargen bilden den Honigraum. Getrennt werden beide durch das Absperrgitter, das die Königin am Bestiften der Honigwaben hindert.\n\nJede Zarge fasst je nach Format acht bis elf Rähmchen. Bei guter Tracht wird das Volk durch Aufsetzen weiterer Honigräume erweitert. Zu frühes Erweitern bremst die Bruttätigkeit, zu spätes löst wegen Platzmangels Schwarmstimmung aus.\n\nZur Einwinterung werden die Honigräume abgenommen; das Volk sitzt dann auf einer oder zwei Bruträumen mit ausreichendem Wintervorrat von etwa 15 bis 20 kg Futter.\n\nZargen werden aus Holz — meist Fichte oder Weymouthskiefer — oder aus Styropor gefertigt. Styroporbeuten isolieren besser und sind leichter, aber mechanisch empfindlicher.",
    "related": [
      "ul-pojem",
      "materi-mrizka",
      "plodiste",
      "mednik",
      "zazimovani"
    ]
  },
  {
    "slug": "plodiste",
    "term": "Brutraum",
    "alias": [
      "Brutnest",
      "Bruteinheit"
    ],
    "kategorie": "vcelarstvi",
    "shortDef": "Der Brutraum ist der untere Teil der Beute, in dem die Königin stiftet, die Brut heranwächst und das Volk überwintert.",
    "longDef": "Der Brutraum ist das biologische Zentrum des Volkes. Hier legt die Königin ihre Eier in die Wachszellen, die Arbeiterinnen pflegen Larven und Puppen und halten die Temperatur im Brutnest bei 34 bis 35 °C. Ein gesundes Brutnest ist kugel- oder ellipsenförmig — die Brut sitzt in der Mitte, Honig- und Pollenvorräte umschließen sie seitlich und nach oben.\n\nIn modernen Magazinbeuten besteht der Brutraum je nach Betriebsweise aus einer Zarge (Dadant, ungeteilter Brutraum) oder zwei Zargen (Zander, Deutsch Normalmaß). In einteiligen Beuten liegen Brut- und Honigraum in einem Raum und werden nur durch das Absperrgitter getrennt.\n\nDie Größe des Brutraums beeinflusst Volksstärke und Überwinterung. Ein zu großer Raum kostet unnötig Energie zum Heizen, ein zu kleiner bremst die Entwicklung und begünstigt das Schwärmen.\n\nIm Frühjahr wird zuerst der Brutraum kontrolliert: Nach dem Winter sollten fünf bis sieben Waben mit lebender Brut und ausreichend Pollen besetzt sein. Fehlt außerhalb der Winterruhe und der Schwarmzeit jede Brut, deutet das auf Weisellosigkeit hin.",
    "related": [
      "ul-pojem",
      "nastavek",
      "mednik",
      "materi-mrizka",
      "vceli-plod",
      "matka"
    ]
  },
  {
    "slug": "mednik",
    "term": "Honigraum",
    "alias": [
      "Honigzarge",
      "Honigraumzarge"
    ],
    "kategorie": "vcelarstvi",
    "shortDef": "Der Honigraum ist der durch das Absperrgitter abgetrennte obere Teil der Beute, in dem die Bienen den überschüssigen Honig einlagern, der geerntet wird.",
    "longDef": "Der Honigraum wird über dem Brutraum aufgesetzt und durch das Absperrgitter von ihm getrennt. Arbeiterinnen passieren das Gitter mühelos, die Königin wegen ihres breiteren Hinterleibs nicht — so bleibt der Honigraum frei von Brut und der Honig sauber.\n\nWährend der Haupttracht, vor allem bei Raps und Linde, füllt sich der Honigraum rasch: Ein starkes Volk kann eine Zarge mit zehn Waben in weniger als zwei Wochen füllen. Bei sehr guter Tracht setzt man einen zweiten oder dritten Honigraum auf.\n\nGeschleudert wird meist zweimal je Saison — nach der Rapstracht im Juni und nach der Sommer- beziehungsweise Waldtracht im August. Vor dem Schleudern werden die Waben entdeckelt, mit Entdeckelungsgabel, Entdeckelungsmesser oder Dampf.\n\nZum Winter werden die Honigräume abgenommen und trocken gelagert; Feuchtigkeit würde zu Schimmel und zum Verderb von Honigresten führen. Im Herbst lässt man die ausgeschleuderten Waben oft kurz zum Ausschlecken zurückgeben.",
    "related": [
      "nastavek",
      "materi-mrizka",
      "plodiste",
      "medomet-pojem",
      "vytaceni-medu",
      "zaviceny-med"
    ]
  },
  {
    "slug": "materi-mrizka",
    "term": "Absperrgitter",
    "alias": [
      "Königinnenabsperrgitter",
      "Queen Excluder"
    ],
    "kategorie": "vcelarstvi",
    "shortDef": "Das Absperrgitter ist eine perforierte Platte mit Schlitzen von 4,1 bis 4,4 mm, die Arbeiterinnen passieren lässt, die Königin aber zurückhält und so Brut im Honigraum verhindert.",
    "longDef": "Das Absperrgitter wird zwischen Brut- und Honigraum eingelegt. Die Durchlässe sind auf die Breite der Arbeiterin von rund 4,5 mm ausgelegt; die Königin mit einer Hinterleibsbreite von 5,5 bis 6 mm passt nicht hindurch. Drohnen kommen in der Regel ebenfalls nicht oder nur mit Mühe durch.\n\nAngeboten werden Gitter aus Metall — Edelstahl oder verzinktes Blech — und aus Kunststoff. Metallgitter halten länger, Kunststoffgitter sind günstiger. Entscheidend ist die Maßhaltigkeit: Zu weite Schlitze halten die Königin nicht zurück, zu enge behindern die Arbeiterinnen und mindern den Honigeintrag.\n\nManche Imker arbeiten bewusst ohne Absperrgitter, weil es den Bienenverkehr bremst und den Trachteintrag geringfügig verringern kann. In der üblichen Betriebsweise gehört es dennoch zur Standardausrüstung, weil nur so brutfreier, sauberer Honig entsteht.\n\nDas Gitter muss regelmäßig von Propolis gereinigt werden, mit dem die Bienen die Schlitze verkitten.",
    "related": [
      "nastavek",
      "mednik",
      "plodiste",
      "matka"
    ]
  },
  {
    "slug": "materi-kasicka",
    "term": "Gelée royale",
    "alias": [
      "Weiselfuttersaft",
      "Royal Jelly",
      "Königinnenfuttersaft"
    ],
    "kategorie": "vcelarstvi",
    "shortDef": "Gelée royale ist der eiweißreiche Futtersaft aus den Futtersaft- und Oberkieferdrüsen der Arbeiterinnen, mit dem die Königin lebenslang und Arbeiterinnenlarven nur in den ersten drei Tagen versorgt werden.",
    "longDef": "Gelée royale ist eine weiße bis schwach gelbliche, charakteristisch sauer schmeckende Substanz. Sie besteht zu etwa 60 bis 70 % aus Wasser, zu 12 bis 15 % aus Eiweiß — vor allem den MRJP, den major royal jelly proteins, darunter das als Royalactin bekannte MRJP1 —, zu 5 bis 6 % aus Zuckern, zu 3 bis 6 % aus Fetten sowie aus verschiedenen B-Vitaminen.\n\nEntscheidend ist die Rolle bei der Kastendetermination: Aus genetisch identischen befruchteten Eiern entsteht bei ausschließlicher Fütterung mit Gelée royale eine Königin, bei Fütterung mit Pollen und Honig eine Arbeiterin. Als Schlüsselfaktor der Differenzierung gilt die 10-HDA, die trans-10-Hydroxy-2-decensäure.\n\nDie Erzeugung von Gelée royale ist die Grundlage der Königinnenzucht: In Weiselnäpfchen — Kunststoffnäpfchen nach chinesischer Art oder Nicot-System — werden ein bis zwei Tage alte Larven umgelarvt, worauf die Ammenbienen Futtersaft einlagern. Bei intensiver Betriebsweise lassen sich aus einem starken Volk 300 bis 500 g je Saison gewinnen.\n\nIm Handel wird Gelée royale als hochpreisiges Nahrungsergänzungsmittel sowie in Kosmetik und Apotheke angeboten. Der weit überwiegende Teil der in Europa verkauften Ware stammt aus China.",
    "related": [
      "matka",
      "delnice",
      "matecnik",
      "vcelstvo"
    ]
  },
  {
    "slug": "propolis-vcely",
    "term": "Propolis",
    "alias": [
      "Kittharz",
      "Bienenharz",
      "Stopfwachs"
    ],
    "kategorie": "vcelarstvi",
    "shortDef": "Propolis ist die Harzmasse, die Bienen von Knospen und Rinde sammeln, mit Wachs und Enzymen mischen und zum Abdichten und Desinfizieren der Beute verwenden.",
    "longDef": "Propolis — von griechisch pro polis, „vor der Stadt\" — sammeln die Arbeiterinnen vor allem an den Harzknospen von Pappeln, Birken, Rosskastanien und Nadelbäumen. Sie transportieren es im Körbchen am Hinterbein in den Stock, wo die Baubienen es übernehmen und mit Speichel und Enzymen bearbeiten.\n\nDie Zusammensetzung hängt stark von der Vegetation am Standort ab. Typisch sind 50 bis 55 % Harze und Balsame, 25 bis 35 % Wachs, rund 10 % ätherische Öle, 5 % Pollen sowie zahlreiche phenolische Verbindungen und Flavonoide. Die chemische Variabilität ist entsprechend groß.\n\nDie Bienen verkitten damit Ritzen in der Beute, verengen im Winter das Flugloch und mumifizieren tote Larven oder eingedrungene Fremdkörper — etwa eine Maus —, die sie nicht heraustragen können. Propolis wirkt so als natürliche Desinfektion; nachgewiesen sind antibakterielle, antimykotische und antivirale Effekte.\n\nGeerntet wird Propolis mit Kunststoffgittern, die unter den Deckel gelegt werden. Der Jahresertrag je Volk liegt bei 50 bis 150 g. Verwendet wird es in Nahrungsergänzungsmitteln, Tinkturen und Kosmetik; Rohpropolis wird je nach Reinheit im Bereich von etwa 10 bis 30 € je 100 g gehandelt.",
    "related": [
      "vcelstvo",
      "ul-pojem",
      "vceli-dilo"
    ]
  },
  {
    "slug": "vcelivosk",
    "term": "Bienenwachs",
    "alias": [
      "Wachs",
      "Beeswax",
      "Cera alba"
    ],
    "kategorie": "vcelarstvi",
    "shortDef": "Bienenwachs ist das feste Drüsensekret der Arbeiterinnen, aus dem die Waben gebaut werden; industriell dient es für Mittelwände, Kosmetik und Pharmazie.",
    "longDef": "Bienenwachs schwitzen Arbeiterinnen im Alter von 12 bis 18 Tagen aus vier Paar Wachsdrüsen an der Bauchseite des Hinterleibs aus. Die einzelnen Wachsplättchen wiegen etwa 0,8 mg und werden mit den Mandibeln zum Baumaterial der Wabe verarbeitet.\n\nChemisch ist es ein komplexes Gemisch aus Estern langkettiger Fettsäuren und Alkohole, Kohlenwasserstoffen, freien Säuren und Alkoholen. Der Schmelzpunkt liegt zwischen 62 und 65 °C, der Erstarrungspunkt ein bis zwei Grad darunter. Wachs ist wasserunlöslich, aber löslich in organischen Lösungsmitteln.\n\nBeim Einschmelzen alter Waben im Sonnenwachsschmelzer oder Dampfwachsschmelzer werden 60 bis 80 % der Wabenmasse als Wachs zurückgewonnen. Je Volk und Jahr lassen sich 0,2 bis 1 kg gewinnen, abhängig vom Umfang der Wabenerneuerung. Das Wachs wird zu Mittelwänden, Kerzen, Kosmetik und pharmazeutischen Grundlagen verarbeitet.\n\nRückstände von Pflanzenschutzmitteln und Akariziden — vor allem Fluvalinat und Coumaphos — reichern sich im Wachs an. Das ist eines der Hauptargumente für den konsequenten Wabenaustausch. Zugekaufte Mittelwände aus unklarer Quelle können belastetes Wachs enthalten und die Rückstände wieder ins Volk tragen; ein eigener Wachskreislauf ist deshalb der sicherste Weg.",
    "related": [
      "plast",
      "mezistena-pojem",
      "delnice",
      "vceli-dilo"
    ]
  },
  {
    "slug": "pyl-rousky",
    "term": "Pollen (Höschen)",
    "alias": [
      "Pollenhöschen",
      "Blütenpollen",
      "Bienenbrot"
    ],
    "kategorie": "vcelarstvi",
    "shortDef": "Pollen sammeln die Arbeiterinnen an den Staubbeuteln der Blüten, mischen ihn mit Speichel und Nektar, formen ihn zu Höschen und tragen ihn im Körbchen ein — er ist die wichtigste Eiweißquelle des Volkes.",
    "longDef": "Beim Blütenbesuch bürstet die Arbeiterin den Pollen mit den Beinbürsten zusammen, befeuchtet ihn mit Nektar oder Honig und formt daraus kompakte Höschen in den Körbchen (Corbicula) an den Hinterbeinen. Die Farbe der Höschen verrät die botanische Herkunft — gelb bei Raps, orange bei Mohn und Linde, ziegelrot bei Rosskastanie, weißlich bei Robinie.\n\nEin starkes Volk trägt täglich 20 bis 50 g Pollen ein; der Jahresbedarf wird auf 15 bis 20 kg je Volk geschätzt. Pollen ist die unersetzliche Eiweißquelle für die Brutpflege und die Erzeugung von Gelée royale — Pollenmangel im Frühjahr oder Spätsommer schwächt vor allem die Entwicklung der Winterbienen.\n\nGeerntet wird mit einer Pollenfalle am Flugloch, die die Höschen beim Einlaufen abstreift. Der Pollen muss sofort bei höchstens 40 °C getrocknet oder eingefroren und dicht verschlossen gelagert werden. Verkauft wird er als Nahrungsergänzungsmittel.\n\nDie Pollenanalyse — Melissopalynologie — erlaubt es, die botanische und geografische Herkunft von Honig und Propolis zu bestimmen. Sie ist das entscheidende Werkzeug bei der Prüfung von Sortenhonigen und beim Nachweis von Verfälschungen.",
    "related": [
      "snuska",
      "delnice",
      "plast",
      "vceli-plod"
    ]
  },
  {
    "slug": "snuska",
    "term": "Tracht",
    "alias": [
      "Haupttracht",
      "Nebentracht",
      "Trachtangebot"
    ],
    "kategorie": "vcelarstvi",
    "shortDef": "Tracht ist der Zeitraum, in dem Nektar oder Honigtau reichlich verfügbar sind und die Bienen sie aktiv eintragen und zu Honig verarbeiten.",
    "longDef": "Der Begriff Tracht bezeichnet sowohl die Quelle — die blühende Pflanze oder das Ausscheidungsprodukt von Blattläusen — als auch den Zeitraum des intensiven Eintrags. In Mitteleuropa unterscheidet man Frühjahrstracht (Obstblüte, Löwenzahn, Raps — April bis Juni), Sommertracht (Linde, Klee, Himbeere — Juni bis Juli) und ergänzende Spättracht (Buchweizen, Sonnenblume, Heide — August bis September).\n\nDie Trachtstärke misst man mit einer Stockwaage: Auflösungen von 100 g und feiner erlauben es, den täglichen Zuwachs aufzuzeichnen. Werte über 2 kg je Tag stehen für eine kräftige Tracht, über 5 kg je Tag für eine außergewöhnliche. Eine Rapstracht kann unter optimalen Bedingungen — großer Schlag, warme sonnige Tage — 30 bis 60 kg Honig je starkem Volk bringen.\n\nDie Waldtracht aus Honigtau von Blatt- und Schildläusen an Laub- und Nadelbäumen ist typisch für Mittelgebirge und Alpenraum — Schwarzwald, Bayerischer Wald, Waldviertel, Alpenvorland. Waldhonig ist dunkler, kräftiger im Geschmack und enthält weniger Saccharose als Blütenhonig.\n\nDas richtige Timing der Wanderung zu den Trachtquellen ist die Grundlage rentabler Imkerei. Zur Rapstracht sollten die Völker zwei bis drei Tage vor der Vollblüte am Standort stehen.",
    "related": [
      "nektar-pojem",
      "medovice-pojem",
      "medny-vynos-pojem",
      "kocovani",
      "medomet-pojem"
    ]
  },
  {
    "slug": "medovice-pojem",
    "term": "Honigtau",
    "alias": [
      "Waldtracht",
      "Honigtautracht",
      "Melezitosehonig"
    ],
    "kategorie": "vcelarstvi",
    "shortDef": "Honigtau ist das zuckerhaltige Ausscheidungsprodukt von Blatt-, Schild- und Rindenläusen, die am Phloem der Bäume saugen; die Bienen tragen ihn als Alternative zum Nektar ein.",
    "longDef": "Honigtau entsteht, wenn saugende Insekten — Blattläuse, Schildläuse, Blattflöhe — den zuckerreichen Phloemsaft der Bäume aufnehmen und den Überschuss an Kohlenhydraten als Tröpfchen wieder ausscheiden. Die Arbeiterinnen sammeln ihn von der Blattoberfläche oder direkt an den Läusen ein und verarbeiten ihn ähnlich wie Nektar.\n\nDie wichtigsten Quellen im deutschsprachigen Raum sind die Tannen- und Fichtenhonigtautracht — erzeugt vor allem von Lachniden wie Cinara — sowie Eichen- und Lindenhonigtau. Waldhonig ist dunkel, von braungelb bis fast schwarz, schmeckt harzig bis malzig-karamellig und enthält weniger Saccharose, dafür mehr Oligosaccharide und Mineralstoffe als Blütenhonig.\n\nFür die Überwinterung ist er ein Risiko: Der hohe Anteil unverdaulicher Dextrine belastet den Darm und führt bei Winterfütterung zur Ruhr. Deshalb wird Honigtauhonig im August aus den Honigräumen genommen und durch Zuckerlösung als Winterfutter ersetzt. Ein besonderer Fall ist der Melezitosehonig — er kristallisiert bereits in der Wabe und lässt sich nicht mehr schleudern, sondern nur pressen oder als Futter zurückgeben.\n\nWaldhonig erzielt im Direktverkauf regelmäßig deutlich höhere Preise als Blütenhonig und gilt geschmacklich als das hochwertigere Erzeugnis.",
    "related": [
      "snuska",
      "nektar-pojem",
      "zazimovani",
      "nosematoza"
    ]
  },
  {
    "slug": "nektar-pojem",
    "term": "Nektar",
    "alias": [
      "Blütennektar",
      "Nektartracht"
    ],
    "kategorie": "vcelarstvi",
    "shortDef": "Nektar ist die von den Nektarien blühender Pflanzen abgegebene Zuckerlösung — der Rohstoff, aus dem Blütenhonig entsteht.",
    "longDef": "Nektar wird von Nektarien gebildet, spezialisierten Drüsengeweben am Grund der Blütenblätter oder an extrafloralen Stellen wie Blattstielen und Nebenblättern. Seine Zusammensetzung schwankt stark: 5 bis 80 % Zucker — Saccharose, Fructose, Glucose —, dazu Wasser, Aminosäuren, Enzyme und Aromastoffe.\n\nDie Arbeiterin nimmt den Nektar in die Honigblase auf und übergibt ihn im Stock an die Stockbienen, die ihn wiederholt umtragen und dabei Enzyme — Invertase und Glucoseoxidase — zusetzen. Durch Ventilieren verdunstet das Wasser: Aus frischem Nektar mit 20 bis 80 % Wassergehalt wird reifer Honig mit höchstens 17 bis 18 %. Erst dann verdeckeln die Bienen die Zellen.\n\nWie ergiebig eine Nektartracht ist, hängt von Pflanzenart, Witterung und Bodenfeuchte ab. Raps gehört zu den wichtigsten Nektarpflanzen Mitteleuropas und liefert unter günstigen Bedingungen 100 bis 150 kg Nektar je Hektar. Weitere bedeutende Trachtpflanzen sind Linde, Robinie, Klee und Phacelia.\n\nDie Nektartracht unterscheidet sich von der Honigtautracht dadurch, dass der Rohstoff unmittelbar von der Pflanze stammt und nicht aus Insektenausscheidungen — das Ergebnis sind deutlich andere physikalische und sensorische Eigenschaften des Honigs.",
    "related": [
      "snuska",
      "medovice-pojem",
      "pyl-rousky",
      "zaviceny-med"
    ]
  },
  {
    "slug": "rojeni",
    "term": "Schwärmen",
    "alias": [
      "Schwarmtrieb",
      "Schwarmstimmung"
    ],
    "kategorie": "vcelarstvi",
    "shortDef": "Das Schwärmen ist die natürliche Vermehrung des Bienenvolkes: Die alte Königin verlässt mit einem Teil der Arbeiterinnen den Stock und gründet ein neues Nest.",
    "longDef": "Das Schwärmen ist eine evolutionär verankerte Vermehrungsstrategie. Ausgelöst wird es durch das Zusammentreffen mehrerer Faktoren: Platzmangel im Stock, nachlassende Weiselsubstanz einer älteren Königin, reichliche Drohnenbrut und passende Witterung von Ende Mai bis Juni. Die Arbeiterinnen beginnen Weiselzellen zu ziehen — für den Imker das erste sichtbare Signal.\n\nDer Vorschwarm zieht an einem warmen, sonnigen Tag um die Mittagszeit aus, meist an dem Tag, an dem die erste Weiselzelle verdeckelt wird. Mit der alten Königin verlassen 30 bis 50 % der Arbeiterinnen den Stock. Der Schwarm sammelt sich als Traube an einem Ast oder einer anderen Unterlage im Umkreis von bis zu 300 m und wartet dort ein bis drei Tage, bis die Spurbienen eine neue Behausung gefunden haben.\n\nDer Imker kann den Schwarm einfangen und daraus ein neues Volk bilden. Zieht der Schwarm ab, bleibt das Muttervolk mit den Weiselzellen zurück; die zuerst geschlüpfte Königin tötet ihre Konkurrentinnen in den übrigen Zellen ab. Nach Hochzeitsflug und Begattung nimmt sie die Eiablage auf.\n\nDie Schwarmkontrolle ist eine der zentralen Arbeiten der Saison. Vorbeugend wirken junge Königinnen, rechtzeitiges Erweitern mit Honigräumen, das Brechen von Weiselzellen sowie der vorweggenommene Schwarm in Form eines Ablegers.",
    "related": [
      "roj",
      "oddelek",
      "matecnik",
      "matka",
      "vcelstvo"
    ]
  },
  {
    "slug": "roj",
    "term": "Schwarm",
    "alias": [
      "Bienenschwarm",
      "Vorschwarm"
    ],
    "kategorie": "vcelarstvi",
    "shortDef": "Ein Schwarm ist die aus Königin und Arbeiterinnen bestehende Gruppe, die sich beim natürlichen Schwärmen vom Muttervolk trennt und eine neue Behausung sucht.",
    "longDef": "Ein ausziehender Schwarm besteht aus der Königin und rund 30 bis 50 % der Arbeiterinnen des Muttervolkes — also 10.000 bis 30.000 Bienen. Vor dem Abflug füllen die Arbeiterinnen ihre Honigblasen als Reisezehrung. Der Schwarm bildet zunächst eine Traube in unmittelbarer Nähe und bleibt dort von einer halben Stunde bis zu mehreren Stunden, bevor er zu der von den Spurbienen ausgewählten Behausung weiterzieht.\n\nZum Einfangen schlägt oder kehrt der Imker den Schwarm in eine leere Beute oder einen Schwarmfangkasten. Entscheidend ist, dass die Königin mitkommt — ohne sie verlässt der Schwarm den neuen Standort wieder. Für Schwärme in größerer Höhe gibt es Schwarmfangbeutel an Teleskopstangen.\n\nEin Schwarm hat einen erheblichen Vorteil: Die Bienen sind im besten Alter für die Wachsproduktion und bauen deshalb außerordentlich schnell neues Wabenwerk auf. Nachteilig sind der geringere Ertrag im ersten Jahr und die Notwendigkeit, anfangs zu füttern.\n\nIn der freien Natur beziehen Schwärme hohle Bäume, Dachzwischenräume oder Mauerhöhlen. Solche wildlebenden Völker sind in Mitteleuropa selten und überleben ohne Varroabehandlung meist nur wenige Jahre.",
    "related": [
      "rojeni",
      "oddelek",
      "matecnik",
      "matka",
      "vcelstvo"
    ]
  },
  {
    "slug": "oddelek",
    "term": "Ableger",
    "alias": [
      "Jungvolk",
      "Begattungsableger",
      "Nucleus"
    ],
    "kategorie": "vcelarstvi",
    "shortDef": "Der Ableger ist ein vom Imker künstlich gebildetes Jungvolk aus Brutwaben, Bienen und einer jungen Königin oder Weiselzelle — die kontrollierte Alternative zum Schwärmen.",
    "longDef": "Der Ableger ist die wichtigste Methode der kontrollierten Vermehrung ohne Schwarmverlust. Gebildet wird er aus üblicherweise drei bis sechs Waben mit Brut, Futter und aufsitzenden Bienen, entnommen aus einem oder mehreren starken Völkern. Dazu kommt entweder eine verdeckelte Weiselzelle aus der Zucht, eine zugekaufte begattete Königin oder eine unbegattete Königin.\n\nDer Ableger wird an einem neuen Standort aufgestellt oder mindestens drei Kilometer entfernt, damit die Flugbienen nicht ins Muttervolk zurückkehren. Ein weiselloser Ableger nimmt eine zugesetzte Königin an oder zieht sich aus junger Brut eigene Nachschaffungszellen.\n\nAbleger sind die Grundlage der modernen Königinnenzucht: Begattungsableger und Begattungskästchen nehmen die Zuchtköniginnen zur Anpaarung auf. In Deutschland läuft die Leistungsprüfung über die Landesverbände, die Arbeitsgemeinschaft Toleranzzucht und die zentrale Datenbank beebreed; in Österreich über Biene Österreich und die Carnica-Zuchtverbände.\n\nIm ersten Jahr bringt ein Ableger in der Regel keinen Ertrag — er ist die Reserve für die kommende Saison. Bei Verlust eines Wirtschaftsvolkes kann er es ersetzen oder mit einem geschwächten Volk vereinigt werden.",
    "related": [
      "rojeni",
      "roj",
      "matecnik",
      "matka",
      "oplodnacek"
    ]
  },
  {
    "slug": "matecnik",
    "term": "Weiselzelle",
    "alias": [
      "Königinnenzelle",
      "Weiselnäpfchen"
    ],
    "kategorie": "vcelarstvi",
    "shortDef": "Die Weiselzelle ist die vergrößerte Wachszelle, in der die Larve der künftigen Königin heranwächst und ausschließlich mit Gelée royale gefüttert wird.",
    "longDef": "Die Weiselzelle hat die Form einer Erdnussschale und hängt senkrecht nach unten, im Unterschied zu den waagerecht liegenden Arbeiterinnen- und Drohnenzellen. Ihre Länge erreicht 20 bis 25 mm. Der Napf wird aus Wachs geformt, bevor das Ei hineingelegt wird.\n\nMan unterscheidet drei Typen: Schwarmzellen am unteren Wabenrand, die die Schwarmvorbereitung anzeigen; Nachschaffungszellen, die nach dem Verlust der Königin notdürftig aus jungen Arbeiterinnenlarven bis zum dritten Tag gezogen werden; und Umweiselungszellen, die bei der stillen Umweiselung einer alternden Königin unauffällig mitten im Brutnest entstehen.\n\nNachschaffungszellen liefern weniger zuverlässige Königinnen als Schwarm- oder Zuchtzellen, weil die Larve erst verspätet — nach mehr als 24 Stunden — auf reine Gelée-royale-Fütterung umgestellt wird. Erfahrene Züchter arbeiten deshalb mit Umlarvlöffel und Zuchtnäpfchen.\n\nDie Königin schlüpft rund 16 Tage nach der Eiablage. Die ersten Tage bleibt sie im Stock und reift geschlechtlich heran; den Hochzeitsflug unternimmt sie bei günstiger Witterung nach sieben bis zehn Tagen.",
    "related": [
      "matka",
      "rojeni",
      "oddelek",
      "materi-kasicka",
      "snubni-prolet"
    ]
  },
  {
    "slug": "zavickovani",
    "term": "Verdeckelung",
    "alias": [
      "Verdeckeln",
      "Zellverdeckelung"
    ],
    "kategorie": "vcelarstvi",
    "shortDef": "Die Verdeckelung ist der Verschluss der Zelle mit einem Wachsdeckel — bei der Brut schließt sie die Puppe ein, beim Honig zeigt sie die Reife an, also unter 18 % Wasser.",
    "longDef": "Die Brut wird etwa am sechsten Tag nach der Eiablage verdeckelt, also nach drei Tagen als Ei und drei Tagen als Larve. Die Arbeiterinnen verschließen die Zelle mit einem flachen bis leicht gewölbten, luftdurchlässigen Wachsdeckel; darunter spinnt die Larve ihren Kokon und verpuppt sich. Gesunde verdeckelte Brut ist hell bräunlich und gleichmäßig gewölbt — eingesunkene, dunkle oder durchlöcherte Deckel sind ein Krankheitszeichen.\n\nBeim Honig ist die Verdeckelung das entscheidende Reifesignal: Die Bienen verschließen die Zelle erst, wenn der Wassergehalt unter 17 bis 18 % gesunken ist. Honig mit höherem Wassergehalt gärt. Daraus folgt die Faustregel, nur Waben zu schleudern, die zu mindestens zwei Dritteln verdeckelt sind — im Zweifel entscheidet das Refraktometer.\n\nHonigdeckel können trocken — weiß und luftunterlegt — oder nass anliegend sein. Trockene Deckel sind für den Verkauf von Wabenhonig gefragt. Zum Entdeckeln dienen Entdeckelungsgabel, Entdeckelungsmesser oder Dampfentdeckler.\n\nLückige oder auffällig veränderte verdeckelte Brut deutet je nach Bild auf Kalkbrut, Sackbrut oder Faulbrut hin und erfordert eine genaue Diagnose.",
    "related": [
      "vceli-plod",
      "zaviceny-med",
      "medomet-pojem",
      "vytaceni-medu"
    ]
  },
  {
    "slug": "vceli-plod",
    "term": "Bienenbrut",
    "alias": [
      "Brut",
      "Brutwabe"
    ],
    "kategorie": "vcelarstvi",
    "shortDef": "Bienenbrut ist die Sammelbezeichnung für Eier, Larven und Puppen in den Wabenzellen.",
    "longDef": "Die Entwicklung beginnt mit dem Ei, das die Königin auf den Zellboden heftet. Es ist walzenförmig, etwa 1,5 mm lang, weiß und steht am ersten Tag senkrecht. Nach drei Tagen schlüpft die Larve — eine kleine, gekrümmte, beinlose Made. Die Ammenbienen füttern sie zunächst mit Gelée royale, ab dem dritten Tag mit einem Gemisch aus Pollen und Honig.\n\nEin gesundes Brutnest ist geschlossen: Die Zellen sind gleichmäßig belegt, die Eier stehen mittig, die Larven sind perlweiß und glänzen. Ein löchriges Brutbild mit belegten und leeren Zellen im Wechsel weist auf das Flügeldeformationsvirus, auf Kalkbrut oder Sackbrut oder auf Probleme mit der Königin hin.\n\nDie Larvenzeit dauert bei der Arbeiterin sechs Tage, dann wird die Zelle verdeckelt. Verpuppung und Metamorphose brauchen weitere zwölf Tage — insgesamt 21 Tage vom Ei zur fertigen Arbeiterin. Der Drohn benötigt 24 Tage, die Königin nur 16.\n\nDas Brutnest ist eine Zone konstanter Temperatur: Die Arbeiterinnen halten 34 bis 35 °C. Abweichungen führen zu Entwicklungsschäden an Flügeln und Gliedmaßen und zu verkürzter Lebensdauer.",
    "related": [
      "zavickovani",
      "matka",
      "delnice",
      "plast",
      "mor-vceliho-plodu",
      "hniloba-plodu"
    ]
  },
  {
    "slug": "kladeni-matky",
    "term": "Eiablage der Königin",
    "alias": [
      "Bestiftung",
      "Stiften",
      "Oviposition"
    ],
    "kategorie": "vcelarstvi",
    "shortDef": "Die Eiablage ist der Vorgang, bei dem die Königin befruchtete oder unbefruchtete Eier in die Wabenzellen legt — das wichtigste Kennzeichen eines gesunden Volkes.",
    "longDef": "Eine begattete, leistungsfähige Königin legt in der Vollsaison von April bis August täglich 1.500 bis 2.500 Eier. In Arbeiterinnenzellen von 5,2 bis 5,4 mm Durchmesser legt sie befruchtete Eier, aus denen Arbeiterinnen werden; in die größeren Drohnenzellen von 6,2 bis 6,9 mm legt sie gezielt unbefruchtete Eier, aus denen Drohnen entstehen. Die Königin erkennt die Zellgröße mit den Vorderbeinen und steuert die Samenabgabe entsprechend.\n\nDas Bestiftungsbild beurteilt der Imker bei jeder Durchsicht: Eine gute Königin legt eine geschlossene Brutfläche ohne Lücken. Löchrige Brut deutet auf Krankheit oder auf eine Königin mit erschöpftem Samenvorrat hin. Bei Pollenmangel oder im Alter geht die Königin früher zu unregelmäßiger Eiablage über.\n\nDie Ammenbienen bereiten die Zellen vor und polieren sie; die Königin heftet das Ei mit einem klebrigen Sekret am Zellboden fest.\n\nDie Suche nach Eiern ist die einfachste Weiselprobe: Frische Stifte in den Zellen — gegen das Licht gehalten oder mit Lupe — beweisen, dass in den letzten drei Tagen eine legende Königin da war. Ältere Larven und verdeckelte Brut können noch von einer bereits verlorenen Königin stammen.",
    "related": [
      "matka",
      "vceli-plod",
      "zavickovani",
      "delnice",
      "trubcina"
    ]
  },
  {
    "slug": "varroaza",
    "term": "Varroose",
    "alias": [
      "Varroatose",
      "Varroa",
      "Varroa destructor"
    ],
    "kategorie": "vcelarstvi",
    "shortDef": "Die Varroose ist die wirtschaftlich bedeutendste Bienenkrankheit; die Milbe Varroa destructor schwächt die Brut und überträgt Viren.",
    "longDef": "Varroa destructor — 2000 als eigene Art von Varroa jacobsoni abgetrennt, die nur die Östliche Honigbiene Apis cerana befällt — ist eine aus Asien eingeschleppte ektoparasitische Milbe, die heute praktisch jedes Volk der Westlichen Honigbiene in Europa befällt. Das Weibchen ist rotbraun, oval, 1,1 × 1,6 mm groß und saugt am Fettkörper von Puppen und erwachsenen Bienen.\n\nDie Vermehrung findet in der verdeckelten Brut statt: Das Weibchen schlüpft kurz vor der Verdeckelung in die Zelle, legt ein männliches und vier bis fünf weibliche Eier; die fertigen Milben verlassen die Zelle zusammen mit der schlüpfenden Biene. Drohnenbrut wird bevorzugt, weil deren längere Entwicklungszeit mehr Nachkommen zulässt — genau darauf beruht das Ausschneiden der Drohnenbrut als biotechnische Maßnahme.\n\nUnbehandelt bricht ein Volk in der Regel innerhalb von zwei bis vier Jahren zusammen. Neben dem direkten Schaden schwächt die Milbe die Immunabwehr und überträgt Viren, allen voran das Flügeldeformationsvirus DWV. In Deutschland und Österreich hat sich das Behandlungskonzept aus Sommerbehandlung mit Ameisensäure nach der Abschleuderung und Restentmilbung mit Oxalsäure im brutfreien Winter durchgesetzt; zugelassen sind daneben Thymolpräparate sowie Amitraz- und Pyrethroidstreifen.\n\nDer Befall wird über den natürlichen Milbenfall auf der Bodeneinlage, über die Puderzuckermethode oder die Alkoholauswaschung überwacht. Als Handlungsschwelle gelten im Sommer etwa zehn Milben natürlicher Tagesfall oder rund drei Milben je hundert Bienen.",
    "related": [
      "klestik-vcely",
      "zazimovani",
      "vcelstvo",
      "vceli-plod"
    ],
    "externalUrl": "https://de.wikipedia.org/wiki/Varroamilbe",
    "externalLabel": "Wikipedia: Varroamilbe"
  },
  {
    "slug": "klestik-vcely",
    "term": "Varroamilbe",
    "alias": [
      "Varroa destructor",
      "Varroa-Milbe"
    ],
    "kategorie": "vcelarstvi",
    "shortDef": "Die Varroamilbe ist der ektoparasitische Erreger der Varroose, der am Fettkörper von Larven und erwachsenen Bienen saugt und unbehandelt zum Zusammenbruch des Volkes führt.",
    "longDef": "Die Varroamilbe gehört zur Ordnung der Milben und zur Familie Varroidae. Der wissenschaftliche Name Varroa destructor wurde im Jahr 2000 eingeführt, als die Art von Varroa jacobsoni abgetrennt wurde — Letztere befällt ausschließlich Apis cerana und pflanzt sich auf der Westlichen Honigbiene nicht fort. Das Weibchen ist abgeflacht, rotbraun, etwa 1,1 mm lang und 1,6 mm breit und mit bloßem Auge auf der Biene oder auf der Bodeneinlage zu erkennen.\n\nDer Lebenszyklus umfasst die phoretische Phase auf erwachsenen Bienen und die reproduktive Phase in der verdeckelten Brut. Das Weibchen schlüpft 24 bis 48 Stunden vor der Verdeckelung in die Zelle, legt zuerst ein unbefruchtetes Ei, aus dem das Männchen entsteht, dann vier bis fünf befruchtete. Das Männchen begattet seine Schwestern noch in der Zelle und stirbt dort.\n\nLange galt die Hämolymphe als Nahrung; neuere Untersuchungen zeigen, dass die Milbe vor allem am Fettkörper saugt. Das erklärt die starke Schwächung der Immunabwehr und der Überwinterungsfähigkeit. Die Milbe ist zugleich Hauptvektor des Flügeldeformationsvirus DWV und des Akuten Bienenparalyse-Virus.\n\nResistenzen gegen Pyrethroide wie Fluvalinat und Flumethrin sind in Europa seit den 1990er-Jahren belegt. Empfohlen werden deshalb der Wechsel der Wirkstoffgruppen und organische Säuren als erste Wahl, besonders in der brutfreien Zeit.",
    "related": [
      "varroaza",
      "zazimovani",
      "vceli-plod",
      "vcelstvo"
    ]
  },
  {
    "slug": "mor-vceliho-plodu",
    "term": "Amerikanische Faulbrut",
    "alias": [
      "AFB",
      "Bösartige Faulbrut",
      "Paenibacillus larvae"
    ],
    "kategorie": "vcelarstvi",
    "shortDef": "Die Amerikanische Faulbrut ist die gefährlichste bakterielle Brutkrankheit; sie wird von dem sporenbildenden Bakterium Paenibacillus larvae verursacht und ist anzeigepflichtig.",
    "longDef": "Erreger der Amerikanischen Faulbrut (AFB) ist Paenibacillus larvae. Die Sporen sind außerordentlich widerstandsfähig — sie überdauern jahrzehntelang in Wabenresten und überstehen auch das Erhitzen von Honig. Übertragen werden sie über kontaminierte Futtervorräte, Gerätschaften, alte Waben und über Räuberei.\n\nDie Symptome sind kennzeichnend: Die verdeckelte Brut verfärbt sich von hellbraun nach dunkelbraun, die Deckel sinken ein und werden durchlöchert. Die zersetzte Larve lässt sich mit einem Streichholz als zäher Faden aus der Zelle ziehen — die Streichholzprobe ist der klassische Feldtest. Der Geruch ist streng und leimartig.\n\nIn Deutschland ist die AFB eine anzeigepflichtige Tierseuche nach der Bienenseuchen-Verordnung. Bei amtlicher Feststellung legt das Veterinäramt um den Seuchenherd einen Sperrbezirk mit einem Radius von mindestens einem Kilometer fest; darin dürfen Völker, Bienen, Waben und Beuten weder hinein- noch herausverbracht werden. In Österreich gilt sie nach dem Bienenseuchengesetz ebenfalls als anzeigepflichtig und zieht ein Sperrgebiet nach sich. Eine Behandlung mit Antibiotika ist in der EU bei Bienen nicht zulässig; befallene Völker werden abgetötet, das Wabenwerk verbrannt, die Beuten werden desinfiziert.\n\nVorbeugend wirken die Desinfektion der Gerätschaften mit heißer Natronlauge oder Flamme, der Zukauf nur mit Gesundheitszeugnis und der konsequente Verzicht auf das Verfüttern von Fremdhonig.",
    "related": [
      "hniloba-plodu",
      "vceli-plod",
      "vcelstvo"
    ],
    "externalUrl": "https://de.wikipedia.org/wiki/Amerikanische_Faulbrut",
    "externalLabel": "Wikipedia: Amerikanische Faulbrut"
  },
  {
    "slug": "hniloba-plodu",
    "term": "Europäische Faulbrut",
    "alias": [
      "EFB",
      "Gutartige Faulbrut",
      "Melissococcus plutonius"
    ],
    "kategorie": "vcelarstvi",
    "shortDef": "Die Europäische Faulbrut befällt die offene Brut und wird von Melissococcus plutonius verursacht; sie ist weniger zerstörerisch als die Amerikanische Faulbrut, bei Stress aber sehr ansteckend.",
    "longDef": "Erreger der Europäischen Faulbrut (EFB) ist Melissococcus plutonius. Das Bakterium vermehrt sich im Darm der Larve und konkurriert mit ihr um Nährstoffe, sodass sie meist noch vor der Verdeckelung stirbt. Die Larven verfärben sich von perlweiß nach gelb und braun, liegen verdreht oder an die Zellwand gepresst statt gleichmäßig gerollt, und der Geruch ist säuerlich und weit schwächer als bei der Amerikanischen Faulbrut.\n\nAnders als die Amerikanische Faulbrut zählt die EFB in Deutschland nicht zu den anzeigepflichtigen Bienenseuchen der Bienenseuchen-Verordnung. Behandelt wird sie über imkerliche Maßnahmen — Kunstschwarmverfahren, vollständige Wabenerneuerung, Umweiselung. Antibiotika sind bei Bienen in der EU nicht zugelassen.\n\nBegünstigt wird ein Ausbruch durch Stress: schwache Tracht, kühle Witterung, Pollenmangel im Frühjahr, geschwächte Völker und starker Varroabefall. Bei günstiger Witterung und guter Tracht kann ein Volk auch spontan gesunden, weil die Arbeiterinnen die erkrankte Brut ausräumen — der Hygieneeigenschaft des Volkes kommt hier große Bedeutung zu.\n\nVorbeugend wirken regelmäßiger Wabenaustausch, Desinfektion der Gerätschaften und der Verzicht darauf, Waben zwischen verdächtigen Völkern zu tauschen.",
    "related": [
      "mor-vceliho-plodu",
      "vceli-plod",
      "varroaza"
    ]
  },
  {
    "slug": "nosematoza",
    "term": "Nosemose",
    "alias": [
      "Nosema",
      "Nosema apis",
      "Vairimorpha ceranae"
    ],
    "kategorie": "vcelarstvi",
    "shortDef": "Die Nosemose ist eine durch Mikrosporidien verursachte Darmerkrankung erwachsener Bienen, die zu Ruhr, Schwächung und verkürzter Lebensdauer führt.",
    "longDef": "Nosema apis ist der in Europa ursprünglich heimische Erreger, Nosema ceranae — heute meist als Vairimorpha ceranae geführt — stammt aus Asien und dominiert inzwischen in Mitteleuropa. Anders als N. apis verursacht sie kaum die typischen Kotspritzer am Flugloch, sondern eine schleichende Schwächung mit deutlich verkürzter Lebensdauer der Arbeiterinnen.\n\nDie Sporen werden oral über verunreinigtes Futter oder Wasser aufgenommen. Im Mitteldarm keimen sie und befallen die Epithelzellen, was die Nährstoffaufnahme herabsetzt. Befallene Bienen können die Brut schlechter pflegen und leben kürzer — eine Abwärtsspirale, die das ganze Volk schwächt.\n\nDie Diagnose erfolgt mikroskopisch aus dem Hinterleibshomogenat von 30 bis 60 Bienen, wobei die Sporenzahl je Biene bestimmt wird. Fumagillin ist in der EU nicht zugelassen, eine zugelassene medikamentöse Behandlung gibt es damit nicht. Die Bekämpfung stützt sich auf Hygiene, konsequente Wabenerneuerung, das Abflammen oder Behandeln der Beuten mit Essigsäure, starke Völker und eine sichere Einwinterung.\n\nHonigtauhonig als Winterfutter erhöht das Risiko deutlich, weil die unverdaulichen Dextrine den Darm belasten und Ruhr auslösen. Deshalb wird er im Spätsommer abgeerntet und durch Zuckerlösung ersetzt.",
    "related": [
      "vcelstvo",
      "zazimovani",
      "medovice-pojem"
    ]
  },
  {
    "slug": "medomet-pojem",
    "term": "Honigschleuder",
    "alias": [
      "Schleuder",
      "Radialschleuder",
      "Tangentialschleuder"
    ],
    "kategorie": "vcelarstvi",
    "shortDef": "Die Honigschleuder ist eine Zentrifuge, in der entdeckelte Waben rotieren und der Honig durch die Fliehkraft aus den Zellen geschleudert wird.",
    "longDef": "Die Honigschleuder arbeitet nach dem Prinzip der Zentrifugation. Die Waben stehen entweder radial — mit der Schmalseite zur Drehachse — oder tangential, also parallel zur Korbwand. Radialschleudern entleeren beide Wabenseiten gleichzeitig und sind bei größeren Imkereien üblich; bei Tangentialschleudern muss die Wabe zwischendurch gewendet werden.\n\nDie Größen reichen von der handbetriebenen Schleuder für zwei bis sechs Waben über kleine Motorschleudern für sechs bis zwölf Waben bis zu Anlagen für 24 bis 48 Waben. Berufsimkereien arbeiten mit Selbstwendeschleudern, elektronischer Drehzahlregelung über Frequenzumrichter und angeschlossenen Entdeckelungsmaschinen.\n\nDer an der Korbwand abfließende Honig sammelt sich am Boden und läuft über den Quetschhahn durch ein Doppelsieb in den Abfüllbehälter. Das Sieben entfernt Wachsteilchen, die anschließende Klärung von zwölf bis 24 Stunden lässt Luftbläschen und feine Schwebstoffe aufsteigen, die abgeschäumt werden.\n\nSchleuder und Zubehör müssen aus lebensmittelechtem Edelstahl bestehen; die Anforderungen an Räume und Geräte ergeben sich aus dem EU-Lebensmittelhygienerecht und sind Voraussetzung für die Vermarktung, etwa im Deutschen Imkerbund-Glas.",
    "related": [
      "vytaceni-medu",
      "zaviceny-med",
      "mednik",
      "pastovani-medu"
    ]
  },
  {
    "slug": "mezistena-pojem",
    "term": "Mittelwand",
    "alias": [
      "Wachsmittelwand",
      "Foundation"
    ],
    "kategorie": "vcelarstvi",
    "shortDef": "Die Mittelwand ist eine dünne, mit dem Sechseckmuster geprägte Wachsplatte, die als Bauvorlage ins Rähmchen eingelötet wird und die Zellgröße vorgibt.",
    "longDef": "Mittelwände werden aus Bienenwachs gewalzt oder gegossen; die Stärke liegt bei 0,8 bis 1,2 mm, das eingeprägte Muster gibt die Zellböden vor. Standardmittelwände für Arbeiterinnenbau haben eine Zellweite von rund 5,2 bis 5,4 mm; für den Honigraum werden auch dünnere Ausführungen verwendet.\n\nEingelötet wird die Mittelwand an drei bis vier waagerechte Drähte, entweder mit dem Trafo als Elektro-Einlöter oder mit dem Sporenrädchen. Die Befestigung muss fest sein — eine sich lösende oder durchhängende Mittelwand verzieht sich bei Sommerhitze und führt zu Wildbau.\n\nMittelwände lenken den Bau: Die Bienen bauen weniger überflüssige Drohnenzellen, das Wabenwerk wird gleichmäßig und lässt sich sauber schleudern. Mittelwände aus rückstandsgeprüftem Wachs sind hygienischer Standard, denn belastetes Wachs trägt Akarizidrückstände in das ganze Wabenwerk. Der eigene Wachskreislauf mit Umarbeitung des selbst gewonnenen Wachses ist deshalb die sicherste Lösung.\n\nAngeboten werden auch Kunststoffmittelwände mit Wachsauflage — sie sind haltbarer, werden von den Bienen aber schlechter angenommen als reine Wachsmittelwände.",
    "related": [
      "plast",
      "vcelivosk",
      "vcelarsky-ramek"
    ]
  },
  {
    "slug": "rozperka-pojem",
    "term": "Abstandshalter",
    "alias": [
      "Hoffmann-Seitenteile",
      "Rähmchenabstandshalter"
    ],
    "kategorie": "vcelarstvi",
    "shortDef": "Abstandshalter sind Einlagen oder Formgebungen am Rähmchen, die den Bienenabstand von 6 bis 9 mm zwischen benachbarten Waben sichern.",
    "longDef": "Unter Abstandshaltern versteht man alle konstruktiven Lösungen, die den bee space von 6 bis 9 mm einhalten — jenen Abstand, bei dem die Bienen den Zwischenraum weder mit Propolis verkitten noch mit Wildbau ausfüllen.\n\nAm weitesten verbreitet sind Hoffmann-Seitenteile: Die Oberkanten der Seitenteile sind so verbreitert, dass sich benachbarte Rähmchen von selbst auf den richtigen Abstand stellen. Alternativen sind eingelegte Metallabstandsstreifen, aufgesteckte Kunststoffclips oder feste Wabengassenschienen im Zargenfalz.\n\nEin falscher Abstand macht Ärger: Unter 6 mm verkitten die Bienen die Gassen und die Waben lassen sich kaum noch ziehen; über etwa 9,5 mm bauen sie Wildbau zwischen die Waben, den der Imker jedes Mal wegschneiden muss.\n\nIm Honigraum arbeiten viele Imker bewusst mit weiteren Wabengassen und dafür weniger Rähmchen je Zarge — etwa neun statt zehn. Die Bienen bauen die Waben dann dicker aus, was das Entdeckeln erleichtert und den Wachsertrag erhöht.",
    "related": [
      "vcelarsky-ramek",
      "ul-pojem",
      "vceli-dilo"
    ]
  },
  {
    "slug": "dymak",
    "term": "Smoker",
    "alias": [
      "Rauchbläser",
      "Imkerpfeife"
    ],
    "kategorie": "vcelarstvi",
    "shortDef": "Der Smoker erzeugt kühlen, dichten Rauch, den der Imker vor dem Öffnen ins Flugloch und unter den Deckel bläst, um das Volk ruhig zu stellen.",
    "longDef": "Der Smoker besteht aus einem Brennbehälter aus Edelstahl oder verzinktem Blech, einem Blasebalg aus Leder oder Kunststoff und einer Düse. Durch Schwelen organischen Materials — Sackleinen, Sisal, Hobelspäne, Heu, getrockneter Buchenschwamm — entsteht dichter, kühler Rauch. Er sollte 50 bis 60 °C nicht überschreiten; zu heißer Rauch versengt die Bienen und bewirkt das Gegenteil von Ruhe.\n\nDie Wirkung ist physiologisch: Die Bienen deuten den Rauch als Waldbrandsignal und beginnen, Honig aus den Waben aufzunehmen — instinktive Vorbereitung auf das Verlassen des Nestes. Mit voller Honigblase stechen sie schlechter und reagieren weniger auf Reize. Zusätzlich überdeckt der Rauch das Alarmpheromon Isopentylacetat.\n\nRichtig angewendet heißt: zwei bis drei Stöße ins Flugloch, kurz warten, dann beim Abheben des Deckels sparsam nachgeben. Zu viel Rauch stresst das Volk und stört die Duftorientierung. Ideal ist dichter, weißer, kühler Rauch; dünner, heißer, grauer Rauch ist wirkungslos.\n\nNach jedem Einsatz wird der Smoker gereinigt, weil Teerrückstände die Düse zusetzen. Zum Löschen wird die Düse verschlossen, damit die Glut von selbst erstickt — offenes Ausleeren ist besonders in trockenen Sommern eine Brandgefahr.",
    "related": [
      "smetacek",
      "ul-pojem"
    ]
  },
  {
    "slug": "smetacek",
    "term": "Abkehrbesen",
    "alias": [
      "Bienenbesen",
      "Abkehrbürste"
    ],
    "kategorie": "vcelarstvi",
    "shortDef": "Der Abkehrbesen ist eine weiche Bürste, mit der der Imker Bienen von den Waben streift — bei der Durchsicht und vor allem vor dem Schleudern.",
    "longDef": "Der Abkehrbesen gehört zur Grundausstattung. Früher wurden Gänse- oder Rosshaarfedern verwendet, heute überwiegen weiche Kunststoffborsten. Er muss stets sauber sein, denn Honig- oder Propolisreste verkleben die Borsten und reizen die Bienen durch fremde Gerüche.\n\nEingesetzt wird er, um Bienen von Waben zu streifen — bei der Suche nach der Königin, vor dem Abernten der Honigräume oder beim Umhängen von Waben. Die richtige Technik sind kurze, ruhige Striche von der Wabenmitte nach unten. Hastige oder ruckartige Bewegungen quetschen Bienen, setzen Alarmpheromon frei und machen das Volk aggressiv.\n\nAlternativen sind die Bienenflucht, die die Bienen über Nacht von selbst aus dem Honigraum abwandern lässt, sowie für größere Betriebe das Abblasen mit einem Laubbläser.\n\nZwischen verschiedenen Ständen sollte der Besen gereinigt oder gewechselt werden — bei Verdacht auf Faulbrut ist die Verschleppung über einen kontaminierten Besen ein realer Übertragungsweg.",
    "related": [
      "dymak",
      "ul-pojem"
    ]
  },
  {
    "slug": "ul-pojem",
    "term": "Beute",
    "alias": [
      "Bienenbeute",
      "Magazinbeute",
      "Bienenkasten"
    ],
    "kategorie": "vcelarstvi",
    "shortDef": "Die Beute ist die vom Imker bereitgestellte Behausung des Bienenvolkes; die moderne Magazinbeute mit beweglichen Waben erlaubt Durchsicht und Honigernte ohne Zerstörung des Baus.",
    "longDef": "Die Geschichte der Bienenwohnung reicht Jahrtausende zurück — von Klotzbeuten über Strohkörbe bis zur Ständerbeute. Die moderne Beute mit beweglichen Waben beruht auf dem von Lorenzo Langstroth 1851 beschriebenen Bienenabstand: Der Zwischenraum von 6 bis 9 mm erlaubt es, jede Wabe einzeln zu ziehen, ohne den Bau zu zerstören.\n\nIm deutschsprachigen Raum verbreitete Systeme sind die Zanderbeute (Rähmchen 420 × 220 mm, im Süden Deutschlands und in Österreich dominierend), das Deutsche Normalmaß (370 × 223 mm, vor allem im Norden), Dadant-Blatt mit ungeteiltem großem Brutraum sowie Langstroth. Daneben gibt es Einraumbeuten, Trogbeuten und die Bienenkiste für die wesensgemäße Imkerei.\n\nMaterialien: Fichten- oder Weymouthskiefernholz mit guten Wärmeeigenschaften, aber Anstrichbedarf; Styropor beziehungsweise Polystyrol — die Segeberger Beute ist der bekannteste Vertreter — mit hervorragender Dämmung und geringem Gewicht, dafür empfindlicher gegen mechanische Beschädigung.\n\nDer Stand steht am besten auf einem Gerüst in 30 bis 50 cm Höhe, mit dem Flugloch nach Süden oder Südosten, mittags leicht beschattet und mit freiem Anflug. Bei der Standortwahl zählen Wasserverfügbarkeit und Trachtangebot im Flugradius von drei bis fünf Kilometern; in Deutschland und Österreich ist die Aufstellung dem Veterinäramt beziehungsweise der Bezirksverwaltungsbehörde zu melden.",
    "related": [
      "nastavek",
      "plodiste",
      "mednik",
      "vcelarsky-ramek",
      "vceli-dilo",
      "cesno-pojem"
    ]
  },
  {
    "slug": "zazimovani",
    "term": "Einwinterung",
    "alias": [
      "Einfüttern",
      "Wintervorbereitung"
    ],
    "kategorie": "vcelarstvi",
    "shortDef": "Die Einwinterung umfasst alle Arbeiten am Ende der Saison, mit denen der Imker das Volk mit ausreichend Futter und behandelter Milbenlast in die Winterruhe schickt.",
    "longDef": "Zur Einwinterung gehören mehrere Schritte: die Beurteilung der Volksstärke und des Zustands der Königin, die Varroabehandlung — Ameisensäure im Spätsommer, Oxalsäure als Restentmilbung im brutfreien Zustand von November bis Dezember —, das Auffüttern auf 15 bis 20 kg Winterfutter, das Verengen des Fluglochs, das Abnehmen der Honigräume und die Kontrolle der Belüftung sowie des Mäusegitters.\n\nGefüttert wird mit Zuckerlösung im Gewichtsverhältnis 3:2 oder mit fertigem Futtersirup, ab Ende Juli bis spätestens Mitte September, damit die Bienen das Futter noch einlagern und verdeckeln können. Zu spätes Füttern führt zu unreifem, gärendem Winterfutter.\n\nDie Wintertraube bildet sich im unteren Teil des Brutnestes, sobald die Temperatur unter etwa 14 °C fällt. Die Arbeiterinnen erzeugen Wärme durch Muskelzittern und wandern vom kühlen Rand in die Mitte. Im Kern hält die Traube 20 bis 25 °C, bei Brut deutlich mehr.\n\nEntscheidend für den Erfolg sind gesunde Winterbienen: Arbeiterinnen, die keine Brut gepflegt haben, besitzen einen großen Fettkörper und überleben bis zu sechs Monate. Eine durch Varroa und Viren geschädigte Wintergeneration lässt das Volk noch vor der Frühjahrsentwicklung zusammenbrechen — deshalb ist der Zeitpunkt der Sommerbehandlung so wichtig.",
    "related": [
      "vyzimovani",
      "varroaza",
      "medovice-pojem",
      "nosematoza",
      "vcelstvo"
    ]
  },
  {
    "slug": "vyzimovani",
    "term": "Auswinterung",
    "alias": [
      "Frühjahrsdurchsicht",
      "Frühjahrsrevision"
    ],
    "kategorie": "vcelarstvi",
    "shortDef": "Die Auswinterung ist die erste Durchsicht nach dem Winter, meist Ende März bis Anfang April, bei der Königin, Futter und Brut kontrolliert werden.",
    "longDef": "Die Auswinterung findet an einem warmen, windstillen Tag bei über 12 bis 14 °C statt. Bei niedrigeren Temperaturen kühlt das geöffnete Brutnest aus und die Brut erfriert. Ziel ist es, eine legende Königin nachzuweisen sowie Volksstärke und Futtervorrat einzuschätzen.\n\nVorgehen: Deckel und Folie abnehmen, Futtertaschen entfernen, die oberen Waben ansehen. Ist das Brutnest geschlossen und aktiv, genügt oft der Blick auf zwei bis drei Waben. Gesucht werden Eier — gegen das Licht gehalten —, ein regelmäßiges Brutbild sowie Pollen- und Futtervorrat. Eine vollständige Zerlegung des Brutnestes ist bei kühler Witterung zu vermeiden.\n\nDer Gemüll auf der Bodeneinlage gibt zusätzlich Auskunft: Die Zahl der natürlich abgefallenen Milben über den Winter zeigt den Befallsdruck an. Die Breite des Gemüllstreifens verrät zudem, auf wie vielen Wabengassen das Volk gesessen hat.\n\nNach der Durchsicht werden Mäusegitter und Winterverengung entfernt, die Bodeneinlage gereinigt und der Boden gewechselt. Schwache oder weisellose Völker werden über die Zeitungspapiermethode vereinigt oder mit einer Reservekönigin beweiselt.",
    "related": [
      "zazimovani",
      "varroaza",
      "vcelstvo",
      "matka"
    ]
  },
  {
    "slug": "snubni-prolet",
    "term": "Hochzeitsflug",
    "alias": [
      "Begattungsflug",
      "Paarungsflug"
    ],
    "kategorie": "vcelarstvi",
    "shortDef": "Auf dem Hochzeitsflug paart sich die junge Königin mit 10 bis 20 Drohnen und legt damit den Samenvorrat für ihr ganzes Leben an.",
    "longDef": "Die junge Königin fliegt in der Regel sieben bis vierzehn Tage nach dem Schlupf aus. Voraussetzung ist ein warmer, sonniger Tag mit über 20 °C und schwachem Wind. Sie fliegt zu den Drohnensammelplätzen in ein bis fünf Kilometern Entfernung und in 10 bis 40 m Höhe, wo sich Drohnen aus vielen Völkern der Umgebung einfinden.\n\nDie Paarung erfolgt im Flug: Der Drohn setzt sich auf die Königin, stülpt sein Begattungsorgan aus und überträgt den Samen; unmittelbar danach stirbt er. Insgesamt paart sich die Königin auf einem bis drei Ausflügen mit 10 bis 20 Drohnen. Der Samen wandert in die Samenblase und reicht dort für drei bis fünf Jahre.\n\nSchlechtes Wetter kann den Hochzeitsflug verhindern. Bleibt die Königin länger als etwa drei Wochen unbegattet, wird sie zur Drohnenmutter und legt nur noch unbefruchtete Eier.\n\nDie kontrollierte Anpaarung ist die Grundlage der Zucht. Dafür gibt es Belegstellen an isolierten Standorten — in Deutschland vor allem die Inselbelegstellen in der Nordsee sowie Belegstellen in abgelegenen Mittelgebirgstälern, in Österreich Hochgebirgsbelegstellen. Alternativ wird die instrumentelle Besamung eingesetzt, die vollständige Kontrolle über die väterliche Seite gibt.",
    "related": [
      "matka",
      "trubec",
      "oplodnacek",
      "matka-neoplozena"
    ]
  },
  {
    "slug": "vceli-tanec",
    "term": "Bienentanz",
    "alias": [
      "Schwänzeltanz",
      "Rundtanz",
      "Waggle Dance"
    ],
    "kategorie": "vcelarstvi",
    "shortDef": "Der Bienentanz ist das Bewegungssignal, mit dem eine Sammlerin ihren Stockgenossinnen Entfernung, Richtung und Ergiebigkeit einer Futterquelle oder einer neuen Behausung mitteilt.",
    "longDef": "Entschlüsselt hat den Bienentanz der aus Wien stammende Zoologe Karl von Frisch, der dafür 1973 den Nobelpreis für Physiologie oder Medizin erhielt. Unterschieden werden zwei Grundformen: der Rundtanz für Quellen bis etwa 50 bis 100 m und der Schwänzeltanz für größere Entfernungen.\n\nBeim Schwänzeltanz läuft die Biene eine gerade Strecke und wackelt dabei mit dem Hinterleib, um dann abwechselnd links- und rechtsherum zum Ausgangspunkt zurückzukehren — die Figur einer liegenden Acht. Die Dauer der Schwänzelstrecke codiert die Entfernung, der Winkel der Strecke zur Senkrechten auf der Wabe entspricht dem Winkel zwischen Flugrichtung und Sonnenstand. Die Bienen rechnen dabei den Sonnenstand über die Tageszeit fort.\n\nDie Lebhaftigkeit des Tanzes signalisiert die Ergiebigkeit: Eine reiche, duftende Quelle löst intensiveres Tanzen aus und wirbt mehr Sammlerinnen an. Die Zuschauerinnen folgen der Tänzerin mit den Antennen und nehmen zugleich eine Duftprobe auf.\n\nDie Forschung geht weiter: Bei der Wahl einer neuen Nisthöhle entscheidet der Schwarm quasi demokratisch — die Tänze für die besseren Standorte werden von immer mehr Spurbienen übernommen, bis Einigkeit besteht. Dieses kollektive Entscheiden gilt heute als Modellfall der Schwarmintelligenz.",
    "related": [
      "snuska",
      "nektar-pojem",
      "vcelstvo"
    ],
    "externalUrl": "https://de.wikipedia.org/wiki/Schw%C3%A4nzeltanz",
    "externalLabel": "Wikipedia: Schwänzeltanz"
  },
  {
    "slug": "medny-vynos-pojem",
    "term": "Honigertrag",
    "alias": [
      "Honigernte",
      "Ertrag je Volk"
    ],
    "kategorie": "vcelarstvi",
    "shortDef": "Der Honigertrag ist die je Volk und Saison geerntete Honigmenge in Kilogramm — die zentrale wirtschaftliche Kennzahl der Imkerei.",
    "longDef": "Der Honigertrag hängt vom genetischen Potenzial der Königin, der Volksstärke, dem Trachtangebot und der Witterung ab. In Deutschland und Österreich liegt der Durchschnitt je nach Jahr meist zwischen 20 und 40 kg je Volk; in guten Raps- und Lindenlagen kann ein starkes Wirtschaftsvolk 60 bis 80 kg und mehr bringen, in einem verregneten Trachtjahr dagegen kaum die eigene Winterversorgung.\n\nEntscheidend ist die Dichte blühender Pflanzen im Flugradius von drei bis fünf Kilometern und deren zeitliche Verteilung. In ausgeräumten Ackerbaulandschaften mit Weizen und Mais entsteht nach der Rapsblüte ein Trachtloch — genau hier setzen Blühstreifen und Blühflächen der Öko-Regelungen und Agrarumweltmaßnahmen an, die zugleich Bestäubern und Imkern zugutekommen.\n\nDie Wanderung zu den Trachten erhöht den Ertrag, verlangt aber Organisation und körperlichen Einsatz: zum Raps im April und Mai, zur Linde und Robinie im Juni, in den Wald zur Honigtautracht im Sommer, zur Heide in der Lüneburger Heide im August und September.\n\nWirtschaftlich rechnet sich die Imkerei über Ertrag mal Preis abzüglich Kosten für Futter, Behandlungsmittel, Gläser und Wabenerneuerung. Im Direktverkauf erzielt das 500-Gramm-Glas deutscher Honig üblicherweise Preise im Bereich von sechs bis acht Euro, sodass ein Nebenerwerb meist ab einigen Dutzend Völkern trägt.",
    "related": [
      "snuska",
      "kocovani",
      "medomet-pojem",
      "vytaceni-medu"
    ]
  },
  {
    "slug": "pastovani-medu",
    "term": "Cremehonig",
    "alias": [
      "gerührter Honig",
      "Rühren",
      "Impfen des Honigs"
    ],
    "kategorie": "vcelarstvi",
    "shortDef": "Cremehonig entsteht durch gesteuerte Kristallisation: Der flüssige Honig wird mit feinkristallinem Impfhonig versetzt und gerührt, sodass eine streichzarte Konsistenz entsteht.",
    "longDef": "Die Kristallisation ist ein natürlicher physikalisch-chemischer Vorgang — die Glucose fällt aus der übersättigten Lösung aus. Wie schnell das geschieht, bestimmt das Verhältnis von Fructose zu Glucose: Robinienhonig mit hohem Fructoseanteil bleibt lange flüssig, Rapshonig mit hohem Glucoseanteil wird binnen zwei bis sechs Wochen fest.\n\nBeim Herstellen von Cremehonig wird dem flüssigen Honig ein Anteil von etwa 5 bis 10 % feinkristallinem Impfhonig zugesetzt. Die feinen Kristalle wirken als Kristallisationskeime; durch mehrfaches Rühren an aufeinanderfolgenden Tagen entstehen sehr kleine, gleichmäßige Kristalle und damit eine cremige, streichfähige Konsistenz.\n\nOptimal sind Raumtemperaturen von 14 bis 16 °C über ein bis zwei Wochen. Unter 10 °C läuft der Vorgang zu langsam, über 25 °C lösen sich die Kristalle wieder auf. Wichtig ist, beim Rühren keine Luft einzuschlagen — sonst wird der Honig hell und schaumig.\n\nCremehonig ist im deutschsprachigen Direktverkauf sehr gefragt, weil er nicht vom Brot läuft und sich gleichmäßig streichen lässt. Zu beachten ist, dass eine Erwärmung über 40 °C die Enzyme schädigt; die Anforderungen des Deutschen Imkerbundes an sein Warenzeichen begrenzen die Erwärmung ausdrücklich.",
    "related": [
      "zaviceny-med",
      "medomet-pojem",
      "nektar-pojem"
    ]
  },
  {
    "slug": "vytaceni-medu",
    "term": "Honigschleudern",
    "alias": [
      "Schleudern",
      "Honigernte"
    ],
    "kategorie": "vcelarstvi",
    "shortDef": "Beim Schleudern wird der reife Honig aus den entdeckelten Waben mit einer Zentrifuge herausgeschleudert und läuft in den Abfüllbehälter.",
    "longDef": "Vor dem Schleudern stehen mehrere Schritte: Die Honigwaben werden bienenfrei gemacht — mit Bienenflucht, Abkehrbesen oder Bläser —, in einen bienendichten Raum gebracht und entdeckelt, mit Entdeckelungsgabel, Entdeckelungsmesser oder Dampfentdeckler. Dann kommen sie in die Schleuder.\n\nGeschleudert wird zunächst langsam mit 70 bis 100 Umdrehungen je Minute, damit die Waben nicht brechen, danach mit der Arbeitsdrehzahl von 200 bis 500 Umdrehungen je nach Korbdurchmesser. In der Radialschleuder genügt ein Durchgang, in der Tangentialschleuder muss gewendet werden.\n\nDer frisch geschleuderte Honig läuft durch ein Doppelsieb und ruht anschließend 24 bis 48 Stunden im geschlossenen Klärbehälter. Luftbläschen und feine Wachsteilchen steigen auf und werden abgeschäumt, bevor abgefüllt wird.\n\nVor dem Abfüllen wird der Wassergehalt mit dem Refraktometer bestimmt. Die Honigverordnung, die die EU-Honigrichtlinie 2001/110/EG umsetzt, lässt höchstens 20 % Wasser zu; das Warenzeichen des Deutschen Imkerbundes verlangt strengere 18 %. Honig mit höherem Wassergehalt gärt und darf nicht als Honig in den Verkehr gebracht werden.",
    "related": [
      "medomet-pojem",
      "zaviceny-med",
      "mednik",
      "pastovani-medu"
    ]
  },
  {
    "slug": "vcelin",
    "term": "Bienenhaus",
    "alias": [
      "Bienenstand",
      "Bienenhütte",
      "Freistand"
    ],
    "kategorie": "vcelarstvi",
    "shortDef": "Das Bienenhaus ist ein überdachter Unterstand oder ein Gebäude, das die Völker vor Witterung, Räubern und Diebstahl schützt und zugleich Arbeitsraum und Lager bietet.",
    "longDef": "Das klassische Bienenhaus ist ein Holzgebäude, in dem die Beuten in Reihen stehen und die Fluglöcher nach außen zeigen. Diese Bauweise stammt aus der Zeit der Hinterbehandlungsbeuten und ist im Alpenraum und in Österreich noch weit verbreitet — sie erlaubt Arbeiten bei jedem Wetter und schützt Holzbeuten dauerhaft vor Regen und Schnee.\n\nDie moderne Betriebsweise mit Magazinbeuten arbeitet dagegen meist im Freistand: Die Beuten stehen einzeln auf Gerüsten oder Paletten, überdacht nur durch den Blechdeckel. Das ist billiger, flexibler und Voraussetzung für das Wandern. Für die Völker ist ein sonniger, windgeschützter Platz mit leichter Mittagsbeschattung und freiem Anflug wichtiger als ein Dach.\n\nRechtlich ist die Bienenhaltung in Deutschland grundsätzlich auch in Wohngebieten zulässig und gilt nicht als störende Tierhaltung. Abstände zu Nachbargrundstücken regeln die Nachbarrechtsgesetze der Bundesländer, in Österreich die Bienenzucht- beziehungsweise Landesgesetze; verbreitet ist die Auflage, entweder einen Mindestabstand einzuhalten oder eine mindestens zwei Meter hohe Hecke oder Wand vor dem Flugloch anzulegen, die die Bienen zum Hochfliegen zwingt.\n\nFür die Honigernte ist ein sauberer, bienendichter Schleuderraum nötig. Die Anforderungen ergeben sich aus dem EU-Lebensmittelhygienerecht; für die kleine Imkerei genügt in der Regel eine gut zu reinigende Küche, sofern sie während des Schleuderns ausschließlich dafür genutzt wird.",
    "related": [
      "ul-pojem",
      "kocovani",
      "medomet-pojem"
    ]
  },
  {
    "slug": "kocovani",
    "term": "Wandern",
    "alias": [
      "Wanderimkerei",
      "Trachtwanderung"
    ],
    "kategorie": "vcelarstvi",
    "shortDef": "Wandern heißt, die Völker den Trachten hinterherzufahren, um nacheinander verschiedene Nektar- und Honigtauquellen zu nutzen und den Ertrag zu steigern.",
    "longDef": "Das Wandern ist die wirksamste Methode, den Honigertrag zu steigern. Im deutschsprachigen Raum sind die klassischen Ziele der Raps im April und Mai, Robinie und Linde im Juni, der Wald zur Honigtautracht im Sommer, die Sonnenblume im August sowie die Heide in der Lüneburger Heide von August bis September.\n\nGefahren wird nachts, wenn alle Flugbienen im Stock sind. Das Flugloch wird mit einem belüfteten Gitterverschluss geschlossen, die Zargen werden mit Spanngurten oder Beutenklammern gesichert und die Beuten mit Gitterboden für ausreichenden Luftaustausch verladen. Der Transport sollte nicht länger als eine Nacht dauern — bei Hitze und Stau droht das Erstickungs- und Überhitzungsrisiko.\n\nAm neuen Standort bleibt das Flugloch noch ein bis zwei Stunden geschlossen, geöffnet wird am frühen Morgen. Wichtig ist die Entfernungsregel: Unter drei Kilometern finden die Flugbienen zum alten Platz zurück. Entweder man versetzt weniger als etwa 50 Meter — dann orientieren sie sich neu — oder mehr als drei Kilometer.\n\nRechtlich verlangt das Wandern gesunde Völker. In Deutschland ist beim Verbringen in einen anderen Landkreis ein amtstierärztliches Gesundheitszeugnis mitzuführen, das bescheinigt, dass der Bestand frei von Amerikanischer Faulbrut ist und nicht in einem Sperrbezirk liegt; in Österreich gelten entsprechende Bestimmungen der Landesgesetze. Zusätzlich braucht man die Erlaubnis des Grundeigentümers.",
    "related": [
      "snuska",
      "medny-vynos-pojem",
      "ul-pojem",
      "vcelin"
    ]
  },
  {
    "slug": "cmsch",
    "term": "Imkerverbände und Meldepflichten",
    "alias": [
      "Deutscher Imkerbund",
      "D.I.B.",
      "Biene Österreich",
      "Bestandsmeldung"
    ],
    "kategorie": "vcelarstvi",
    "shortDef": "Wer Bienen hält, muss den Bestand amtlich melden; die fachliche Vertretung übernehmen der Deutsche Imkerbund in Deutschland und Biene Österreich in Österreich.",
    "longDef": "Die Bienenhaltung ist meldepflichtig — unabhängig davon, ob sie gewerblich oder als Hobby betrieben wird. In Deutschland ist der Beginn der Haltung nach der Bienenseuchen-Verordnung dem zuständigen Veterinäramt anzuzeigen; zusätzlich ist der Bestand jährlich bei der Tierseuchenkasse des Bundeslandes zu melden, die im Seuchenfall Entschädigungen leistet. In Österreich sind Bienenstände und Völkerzahlen jährlich bis Ende April im Veterinärinformationssystem VIS zu erfassen.\n\nDie Interessenvertretung übernimmt in Deutschland der Deutsche Imkerbund (D.I.B.) mit seinen Landesverbänden und rund einer Million betreuter Völker. Er vergibt zugleich das bekannte Warenzeichen für das Einheitsglas, dessen Qualitätsanforderungen — etwa höchstens 18 % Wassergehalt und begrenzte Erwärmung — deutlich über der Honigverordnung liegen. In Österreich ist Biene Österreich der Dachverband von Österreichischem Imkerbund und Biene Österreich Erwerbsimkerbund.\n\nDie Zucht organisieren in Deutschland die Landesverbände gemeinsam mit der Arbeitsgemeinschaft Toleranzzucht; die Leistungsprüfungen laufen über die zentrale Datenbank beebreed des Länderinstituts für Bienenkunde in Hohen Neuendorf. Geprüft werden Honigertrag, Sanftmut, Wabensitz, Schwarmneigung und die Varroatoleranz über den Merkmalskomplex VSH.\n\nFörderung erhalten Imker über das nationale Bienenprogramm im Rahmen des GAP-Strategieplans — etwa Zuschüsse zu Geräten, zur Bekämpfung der Varroose, zur Königinnenzucht und zur Analytik.",
    "related": [
      "vcelstvo",
      "varroaza",
      "zazimovani"
    ],
    "externalUrl": "https://deutscherimkerbund.de/",
    "externalLabel": "Deutscher Imkerbund"
  },
  {
    "slug": "cesno-pojem",
    "term": "Flugloch",
    "alias": [
      "Einflugöffnung",
      "Flugspalt"
    ],
    "kategorie": "vcelarstvi",
    "shortDef": "Das Flugloch ist die Öffnung der Beute, durch die die Bienen ein- und ausfliegen; zugleich ist es die erste Verteidigungslinie des Volkes.",
    "longDef": "Das Flugloch liegt an der Vorderseite der Beute, meist als schmaler Spalt über die ganze Breite. Bei Magazinbeuten ist es typischerweise 10 bis 20 mm hoch und über einen Fluglochkeil oder Fluglochschieber in der Breite regulierbar.\n\nIm Sommer wird es weit geöffnet, damit der starke Flugbetrieb ungehindert läuft und die Beute gut ventiliert wird. Im Herbst wird es verengt, damit sich das Volk gegen Räuberei, Wespen und Hornissen leichter wehren kann; zum Winter kommt ein Mäusegitter davor, denn eine eingezogene Maus zerstört das Wabenwerk. Ganz verschlossen wird das Flugloch nur beim Transport.\n\nAls Verteidigungslinie funktioniert es über die Wächterbienen: Sie kontrollieren jede ankommende Biene über Geruch und Berührung. Fremde Sammlerinnen aus anderen Völkern, Wespen und Hornissen werden abgewehrt. Wie gut das gelingt, hängt unmittelbar von der Volksstärke ab — ein schwaches oder weiselloses Volk wird ausgeräubert.\n\nDie Beobachtung am Flugloch ist die schnellste Diagnose, ganz ohne die Beute zu öffnen: reger Anflug mit Pollenhöschen am Vormittag spricht für ein starkes Volk mit offener Brut; herausgetragene Larven, verkrüppelte Bienen, Kotspritzer am Flugbrett oder ein plötzlich stiller Stand sind Warnzeichen.",
    "related": [
      "ul-pojem",
      "nastavek",
      "zazimovani"
    ]
  },
  {
    "slug": "medocukrove-testo",
    "term": "Futterteig",
    "alias": [
      "Kandy",
      "Fondant",
      "Apifonda",
      "Winterfutterteig"
    ],
    "kategorie": "vcelarstvi",
    "shortDef": "Futterteig ist ein festes Zuckerfutter, das auf die Rähmchen gelegt wird, um im Winter oder zeitigen Frühjahr Vorräte zu ergänzen.",
    "longDef": "Futterteig — im Handel als Fondant oder unter Markennamen wie Apifonda erhältlich — besteht aus feinkristallinem Zucker mit einem geringen Wasseranteil von rund 8 bis 10 %, teils mit Zusatz von Invertzucker. Selbst hergestellt wird er aus Zucker und Wasser, die unter Rühren auf 118 bis 120 °C gekocht und beim Abkühlen zu einer plastischen Masse gerührt werden.\n\nGegeben wird er als Paket direkt auf die Oberträger unter der Folie oder in einer flachen Schale. Die Bienen tragen ihn langsam ab — er dient als Notreserve, wenn das Winterfutter knapp wird, oder als Reizfutter im Vorfrühling. Üblich sind ein bis zweieinhalb Kilogramm je Volk.\n\nDer entscheidende Vorteil gegenüber flüssigem Sirup: Im Winter müssten die Bienen aus Sirup das Wasser verdunsten, was die Luftfeuchte in der Beute erhöht und die Wintertraube belastet. Fester Teig bringt kaum Wasser ein und kann auch bei kühler Witterung aufgenommen werden.\n\nEin Hinweis zur Ehrlichkeit im Betrieb: Futterteig darf nur außerhalb der Trachtzeit und nie bei aufgesetztem Honigraum gegeben werden — sonst landet der Zucker im Honig, was als Verfälschung gilt. Honig, der aus Futterzucker stammt, ist nicht verkehrsfähig.",
    "related": [
      "zazimovani",
      "vyzimovani",
      "vcelstvo"
    ]
  },
  {
    "slug": "oplodnacek",
    "term": "Begattungskästchen",
    "alias": [
      "Begattungseinheit",
      "Apidea",
      "Kirchhainer",
      "Mini Plus"
    ],
    "kategorie": "vcelarstvi",
    "shortDef": "Das Begattungskästchen ist eine Kleinsteinheit mit wenigen Miniwaben, in der Königinnenzüchter junge Königinnen zur Anpaarung an eine Belegstelle bringen.",
    "longDef": "Ein Begattungskästchen ist eine Miniaturbeute, deren Wabenmaß etwa einem Drittel oder Viertel eines Normalrähmchens entspricht. Verbreitete Systeme sind Apidea, das Kirchhainer Begattungskästchen und Mini Plus — Letzteres arbeitet mit größeren Waben und kann als Kleinvolk überwintert werden.\n\nBesetzt wird es mit einer Handvoll junger Bienen von etwa 100 bis 300 g, etwas Futterteig und einer schlupfreifen Weiselzelle oder frisch geschlüpften unbegatteten Königin. Die Bienen pflegen die Königin während ihrer Reifezeit.\n\nSieben bis vierzehn Tage nach dem Schlupf fliegt die Königin zur Begattung aus. Steht das Kästchen auf einer Belegstelle — einer Insel oder einem abgeschirmten Gebirgstal —, sind im Umkreis nur Drohnen der ausgewählten Vatervölker unterwegs, sodass die Anpaarung kontrolliert erfolgt.\n\nNach der Begattung wird die Eiablage kontrolliert; zeigt die Königin binnen zehn Tagen ein geschlossenes Brutbild, wird sie gekäfigt und versandt oder in ein Wirtschaftsvolk umgeweiselt. Das Kästchen nimmt danach die nächste Zelle auf. Nachteil der kleinen Einheiten: Bei anhaltend schlechtem Wetter verhungern sie schnell und müssen nachgefüttert werden.",
    "related": [
      "matka",
      "snubni-prolet",
      "oddelek",
      "matka-neoplozena"
    ]
  },
  {
    "slug": "trubcina",
    "term": "Drohnenbau",
    "alias": [
      "Drohnenbrut",
      "Drohnenrahmen",
      "Baurahmen"
    ],
    "kategorie": "vcelarstvi",
    "shortDef": "Drohnenbau sind die größeren Wabenzellen von 6,2 bis 6,9 mm, in denen Drohnen heranwachsen — und die von der Varroamilbe zur Vermehrung bevorzugt werden.",
    "longDef": "Drohnenbau ist leicht zu erkennen: Die Zellen sind deutlich weiter als Arbeiterinnenzellen, und die verdeckelte Drohnenbrut wölbt sich kuppelförmig über die Wabenfläche. Die Königin erkennt die Zellweite mit den Vorderbeinen und legt dort gezielt unbefruchtete Eier.\n\nParasitologisch ist der Drohnenbau der neuralgische Punkt: Varroa destructor bevorzugt ihn deutlich, weil die längere Verdeckelungszeit der Drohnenbrut mehr Nachkommen zulässt. Genau darauf beruht das Ausschneiden der Drohnenbrut — ein Baurahmen wird im Brutraum angeboten, ausbauen und verdeckeln gelassen und dann herausgeschnitten. Diese biotechnische Maßnahme entnimmt dem Volk einen erheblichen Teil der Milbenpopulation ohne jede Chemie und ist im Frühjahr die wichtigste Ergänzung zur Sommerbehandlung.\n\nEin gewisser Anteil Drohnenbau gehört zu einem gesunden Volk und wird von den Bienen immer angelegt; wird er konsequent unterdrückt, bauen sie ihn an anderer Stelle als Wildbau. Übermäßig viel Drohnenbrut kostet dagegen Futter und Pflegeleistung.\n\nIn einem weisellosen Volk mit eierlegenden Arbeiterinnen ist die gesamte Brut Drohnenbrut, oft mehrere Eier je Zelle und buckelig verdeckelt — dieses Bild der Drohnenbrütigkeit zeigt eine schwere Störung an, die sich meist nur noch durch Auflösen des Volkes beheben lässt.",
    "related": [
      "trubec",
      "varroaza",
      "vceli-plod",
      "klestik-vcely"
    ]
  },
  {
    "slug": "matka-neoplozena",
    "term": "Unbegattete Königin",
    "alias": [
      "Jungfer",
      "virgine Königin",
      "Weisel unbegattet"
    ],
    "kategorie": "vcelarstvi",
    "shortDef": "Eine unbegattete Königin ist frisch geschlüpft oder noch in der Reifung und hat den Hochzeitsflug nicht hinter sich — sie kann daher keine befruchteten Eier legen.",
    "longDef": "Die unbegattete Königin ist das Zwischenstadium zwischen der Larve in der Weiselzelle und der legenden Königin. Nach dem Schlupf ist sie schlank, sehr beweglich und flüchtig, die Eierstöcke sind noch nicht ausgereift und die Samenblase ist leer.\n\nIn den ersten fünf bis sieben Tagen reift sie geschlechtlich heran. Sie läuft über die Waben, nimmt Futter von den Arbeiterinnen an und sucht die übrigen Weiselzellen auf, um die Rivalinnen durch die Zellwand abzustechen. Sind mehrere zugleich geschlüpft, kämpfen sie gegeneinander — bei Schwarmvölkern ein normaler Vorgang.\n\nDer Nachweis ist schwierig, weil eine Weiselprobe über Eier hier gerade nicht funktioniert. Man erkennt sie am schlanken Körper und am hastigen Laufen, am Fehlen des typischen Hofstaats und daran, dass das Volk trotz Weisellosigkeit keine Nachschaffungszellen zieht. Unerfahrene Imker übersehen sie leicht und setzen eine zweite Königin zu, die dann abgestochen wird.\n\nDer Versand unbegatteter Königinnen ist heikler als der begatteter: Die Bienen nehmen sie schlechter an. Züchter versenden deshalb in der Regel erst nach der Begattung, wenn die Königin einige Tage in Eiablage steht.",
    "related": [
      "matka",
      "snubni-prolet",
      "oplodnacek",
      "matecnik"
    ]
  },
  {
    "slug": "zaviceny-med",
    "term": "Verdeckelter Honig",
    "alias": [
      "reifer Honig",
      "Wabenhonig"
    ],
    "kategorie": "vcelarstvi",
    "shortDef": "Verdeckelter Honig ist mit einem Wachsdeckel verschlossener Honig in der Wabe — das natürliche Reifezeichen: Der Wassergehalt liegt unter 18 % und der Honig gärt nicht.",
    "longDef": "Das Verdeckeln ist der Qualitätsmaßstab, den die Bienen selbst anlegen: Erst wenn der Wassergehalt unter 17 bis 18 % gesunken ist, verschließen sie die Zelle. Honig mit mehr Wasser würde vergären, denn osmotolerante Hefen sind natürlicherweise in jedem Honig vorhanden.\n\nFür die Ernte gilt deshalb die Regel, nur Waben zu schleudern, die zu mindestens zwei Dritteln verdeckelt sind. Der Rest wird mit der Spritzprobe geprüft: Was beim kräftigen Schwung aus der Wabe fliegt, ist noch nicht reif. Verbindlich entscheidet das Refraktometer — die Honigverordnung lässt höchstens 20 % Wasser zu, das Warenzeichen des Deutschen Imkerbundes höchstens 18 %.\n\nWabenhonig — ganze verdeckelte Waben oder ausgeschnittene Stücke — ist die ursprünglichste Form der Vermarktung: ein Erzeugnis, das keine Maschine berührt hat. Er erzielt im Direktverkauf deutlich höhere Preise je Kilogramm als geschleuderter Honig, verlangt aber unbebrütete, frisch ausgebaute Waben und wird meist auf dünnen Mittelwänden oder im Naturbau erzeugt.\n\nGegorener Honig darf nicht als Honig in den Verkehr gebracht werden. Er lässt sich noch zu Met verarbeiten, dessen Herstellung aus vergorenem Honigwasser eine der ältesten alkoholischen Getränketraditionen Mitteleuropas ist.",
    "related": [
      "zavickovani",
      "medomet-pojem",
      "vytaceni-medu",
      "nektar-pojem"
    ]
  },
  {
    "slug": "dzes",
    "term": "GLÖZ – guter landwirtschaftlicher und ökologischer Zustand",
    "alias": [
      "GLÖZ",
      "GLÖZ-Standards"
    ],
    "kategorie": "regulace",
    "shortDef": "GLÖZ ist der Satz an Standards, mit denen Betriebe ihre Flächen in gutem landwirtschaftlichem und ökologischem Zustand halten müssen, um Direktzahlungen zu erhalten.",
    "longDef": "GLÖZ (guter landwirtschaftlicher und ökologischer Zustand, englisch GAEC) bezeichnet neun Standards, die jeder Betrieb einhalten muss, der Direktzahlungen oder flächenbezogene Zahlungen der zweiten Säule beantragt. Sie decken Bodenschutz, Gewässerschutz, den Erhalt von Dauergrünland und die biologische Vielfalt ab.\n\nZu den neun Standards zählen unter anderem der Erhalt des Dauergrünlands (GLÖZ 1), der Schutz von Mooren und Feuchtgebieten (GLÖZ 2), das Verbot des Abbrennens von Stoppelfeldern (GLÖZ 3), Pufferstreifen entlang von Gewässern (GLÖZ 5), eine Mindestbodenbedeckung im Winter (GLÖZ 6), der Fruchtwechsel auf Ackerland (GLÖZ 7) und nichtproduktive Flächen (GLÖZ 8).\n\nGLÖZ ist zusammen mit den Grundanforderungen an die Betriebsführung (GAB) Teil der Konditionalität. Verstöße führen zu Kürzungen der Prämie — kontrolliert wird durch die Länderbehörden in Deutschland beziehungsweise die AMA in Österreich.",
    "related": [
      "saps",
      "redistributivni-platba",
      "anc-platba",
      "podminenost"
    ],
    "externalUrl": "https://de.wikipedia.org/wiki/Cross_Compliance",
    "externalLabel": "Wikipedia: Cross Compliance",
    "faq": [
      {
        "q": "Wozu dient GLÖZ?",
        "a": "GLÖZ stellt sicher, dass landwirtschaftliche Flächen in einem Zustand erhalten bleiben, der sowohl für die Bewirtschaftung als auch für die Umwelt tragfähig ist."
      },
      {
        "q": "Welche Regeln umfasst GLÖZ?",
        "a": "Neun Standards zu Bodenschutz, Gewässerschutz, Erhalt von Dauergrünland, Fruchtwechsel und nichtproduktiven Flächen."
      }
    ]
  },
  {
    "slug": "saps",
    "term": "SAPS – einheitliche Flächenzahlung",
    "alias": [
      "SAPS",
      "Single Area Payment Scheme"
    ],
    "kategorie": "dotace",
    "shortDef": "SAPS war eine vereinfachte Direktzahlung rein nach Fläche, die nur in den 2004 und später beigetretenen Mitgliedstaaten galt — in Deutschland und Österreich kam sie nie zur Anwendung.",
    "longDef": "SAPS (Single Area Payment Scheme) war ein vereinfachtes System der Direktzahlungen, bei dem die Prämie ausschließlich nach der bewirtschafteten förderfähigen Fläche bemessen wurde, ohne historische Referenzmengen oder Zahlungsansprüche.\n\nEs stand nur den Mitgliedstaaten offen, die der EU 2004 oder später beigetreten sind — also etwa Tschechien, Polen, der Slowakei, Ungarn und den baltischen Staaten. Deutschland und Österreich haben SAPS nie angewendet: Beide setzten die Betriebsprämienregelung (SPS) mit Zahlungsansprüchen um, Deutschland ab 2005 im sogenannten Kombimodell mit schrittweiser Angleichung an eine regionale Einheitsprämie.\n\nMit der GAP-Reform endete SAPS zum Antragsjahr 2022. Seit 2023 gibt es EU-weit einheitlich die Einkommensgrundstützung für Nachhaltigkeit (BISS), sodass die Systeme in allen Mitgliedstaaten wieder dieselbe Grundstruktur haben.",
    "related": [
      "dzes",
      "redistributivni-platba",
      "anc-platba",
      "cap-2024"
    ],
    "externalUrl": "https://de.wikipedia.org/wiki/Gemeinsame_Agrarpolitik",
    "externalLabel": "Wikipedia: Gemeinsame Agrarpolitik",
    "faq": [
      {
        "q": "Wie wurde SAPS berechnet?",
        "a": "Allein nach der Größe der bewirtschafteten förderfähigen landwirtschaftlichen Fläche, ohne Zahlungsansprüche."
      },
      {
        "q": "Galt SAPS auch in Deutschland und Österreich?",
        "a": "Nein. SAPS stand nur den ab 2004 beigetretenen Mitgliedstaaten offen; Deutschland und Österreich nutzten die Betriebsprämienregelung."
      }
    ]
  },
  {
    "slug": "redistributivni-platba",
    "term": "Umverteilungseinkommensstützung",
    "alias": [
      "Umverteilungsprämie",
      "Umverteilungszahlung"
    ],
    "kategorie": "dotace",
    "shortDef": "Die Umverteilungseinkommensstützung ist ein Zuschlag auf die ersten Hektar eines Betriebs und stärkt damit gezielt kleine und mittlere Betriebe.",
    "longDef": "Die Umverteilungseinkommensstützung ist eine ergänzende Direktzahlung, die zusätzlich zur Einkommensgrundstützung nur auf die ersten Hektar eines Betriebs gezahlt wird. Da jeder Betrieb sie für dieselbe Hektarzahl erhält, fällt sie bei kleinen Betrieben je Hektar der Gesamtfläche viel stärker ins Gewicht als bei großen.\n\nIn Deutschland ist sie zweistufig gestaffelt: Für den 1. bis 40. Hektar gibt es 68,05 €/ha, für den 41. bis 60. Hektar 40,83 €/ha (Antragsjahr 2025); ab dem 61. Hektar entfällt sie. In Österreich wird sie ebenfalls zweistufig gewährt — für die ersten 20 Hektar und für die weiteren bis 40 Hektar.\n\nDeutschland hat die Umverteilung bewusst als Ersatz für eine Kappung großer Betriebe gewählt: Statt Zahlungen oberhalb einer Obergrenze zu streichen, wird der Sockel bei den ersten Hektaren angehoben.",
    "related": [
      "saps",
      "dzes",
      "anc-platba",
      "cap-2024"
    ],
    "externalUrl": "https://de.wikipedia.org/wiki/Direktzahlung_(Landwirtschaft)",
    "externalLabel": "Wikipedia: Direktzahlung",
    "faq": [
      {
        "q": "Wozu dient die Umverteilungseinkommensstützung?",
        "a": "Sie stärkt kleine und mittlere Betriebe, indem sie einen Zuschlag nur auf die ersten Hektar zahlt."
      },
      {
        "q": "Worin unterscheidet sie sich von der Einkommensgrundstützung?",
        "a": "Die Grundstützung wird auf alle förderfähigen Hektar gezahlt, die Umverteilung nur auf die ersten Hektar — in Deutschland bis zum 60. Hektar."
      }
    ]
  },
  {
    "slug": "nitratova-smernice",
    "term": "Nitratrichtlinie",
    "alias": [
      "Richtlinie 91/676/EWG"
    ],
    "kategorie": "regulace",
    "shortDef": "Die Nitratrichtlinie ist die EU-Vorschrift zum Schutz der Gewässer vor Nitrat aus der Landwirtschaft; Deutschland setzt sie über die Düngeverordnung um, Österreich über die NAPV.",
    "longDef": "Die Nitratrichtlinie (91/676/EWG) verpflichtet die Mitgliedstaaten, Grund- und Oberflächenwasser vor Verunreinigung durch Nitrat aus landwirtschaftlichen Quellen zu schützen. Kern ist ein verbindliches Aktionsprogramm mit Sperrfristen, Ausbringungsobergrenzen, Mindestlagerkapazitäten für Wirtschaftsdünger und Aufzeichnungspflichten.\n\nDie Richtlinie lässt zwei Wege zu: Entweder weist ein Mitgliedstaat gefährdete Gebiete aus und lässt das Aktionsprogramm nur dort gelten, oder er wendet es auf dem gesamten Staatsgebiet an. Deutschland ging den ersten Weg — die Düngeverordnung (DüV) gilt bundesweit, verschärfte Auflagen greifen zusätzlich in den ausgewiesenen roten Gebieten. Österreich wählte den zweiten Weg: Die Nitrat-Aktionsprogramm-Verordnung (NAPV) gilt im gesamten Bundesgebiet, gefährdete Gebiete werden dort gar nicht erst abgegrenzt.\n\nDie EU-Kommission hat Deutschland wegen unzureichender Umsetzung mehrfach verklagt; die Verschärfungen der DüV 2017 und 2020 gehen unmittelbar auf dieses Vertragsverletzungsverfahren zurück.",
    "related": [
      "zranitelne-oblasti",
      "dzes",
      "ekoschemata",
      "podminenost"
    ],
    "externalUrl": "https://de.wikipedia.org/wiki/Nitratrichtlinie",
    "externalLabel": "Wikipedia: Nitratrichtlinie",
    "faq": [
      {
        "q": "Was ist das Ziel der Nitratrichtlinie?",
        "a": "Der Schutz von Grund- und Oberflächenwasser vor Verunreinigung durch Nitrat aus landwirtschaftlichen Quellen."
      },
      {
        "q": "Wo gilt die Nitratrichtlinie?",
        "a": "In Deutschland über die Düngeverordnung bundesweit, mit verschärften Auflagen in den roten Gebieten; in Österreich über die NAPV auf dem gesamten Bundesgebiet."
      }
    ]
  },
  {
    "slug": "zranitelne-oblasti",
    "term": "Rote Gebiete (nitratbelastete Gebiete)",
    "alias": [
      "nitratbelastete Gebiete",
      "gefährdete Gebiete"
    ],
    "kategorie": "regulace",
    "shortDef": "Rote Gebiete sind in Deutschland die Flächen mit nachweislich zu hoher Nitratbelastung des Grundwassers, in denen verschärfte Düngeauflagen gelten.",
    "longDef": "Als rote Gebiete gelten in Deutschland jene Flächen, in denen das Grundwasser den Schwellenwert von 50 mg Nitrat je Liter überschreitet oder bei über 37,5 mg/l ein steigender Trend nachgewiesen ist. Die Ausweisung erfolgt durch die Bundesländer nach den bundesweit vereinheitlichten Vorgaben der Allgemeinen Verwaltungsvorschrift Gebietsausweisung (AVV GeA).\n\nIn diesen Gebieten greifen nach § 13a der Düngeverordnung deutlich schärfere Auflagen: Die Stickstoffdüngung ist um 20 % unter dem ermittelten Düngebedarf zu begrenzen (betriebsdurchschnittlich), Sperrfristen sind länger, auf stark hängigem Gelände und vor bestimmten Kulturen gelten zusätzliche Einschränkungen.\n\nÖsterreich kennt diese Abgrenzung nicht: Dort wurde das Nitrat-Aktionsprogramm von vornherein auf das gesamte Bundesgebiet gelegt, sodass für alle Betriebe dieselben Regeln gelten — dafür sind diese im Mittel weniger streng als die deutschen Auflagen in roten Gebieten.",
    "related": [
      "nitratova-smernice",
      "dzes",
      "ekoschemata",
      "podminenost"
    ],
    "externalUrl": "https://de.wikipedia.org/wiki/D%C3%BCngeverordnung",
    "externalLabel": "Wikipedia: Düngeverordnung",
    "faq": [
      {
        "q": "Was sind rote Gebiete?",
        "a": "Flächen mit nachweislich zu hoher Nitratbelastung des Grundwassers, in denen verschärfte Düngeauflagen gelten."
      },
      {
        "q": "Wie werden rote Gebiete abgegrenzt?",
        "a": "Über Nitratmesswerte im Grundwasser nach den einheitlichen Vorgaben der AVV GeA; die Ausweisung übernehmen die Bundesländer."
      }
    ]
  },
  {
    "slug": "anc-platba",
    "term": "Ausgleichszulage für benachteiligte Gebiete",
    "alias": [
      "Ausgleichszulage",
      "AZ",
      "ANC"
    ],
    "kategorie": "dotace",
    "shortDef": "Die Ausgleichszulage entschädigt Betriebe in Gebieten mit naturbedingten Nachteilen — Berglagen, flachgründige Böden, ungünstiges Klima — für ihre höheren Bewirtschaftungskosten.",
    "longDef": "Die Ausgleichszulage (EU-Kürzel ANC, areas with natural constraints) ist eine Flächenprämie der zweiten Säule für Betriebe, die in Gebieten mit naturbedingten oder anderen spezifischen Nachteilen wirtschaften: Berggebiete, Regionen mit kurzer Vegetationszeit, Hanglagen oder schwierigen Böden. Sie gleicht Mehrkosten und Ertragsnachteile aus und hält damit die Bewirtschaftung in Lagen aufrecht, die sonst aufgegeben würden.\n\nIn Deutschland wird die Ausgleichszulage von den Bundesländern ausgestaltet und über die Gemeinschaftsaufgabe Agrarstruktur und Küstenschutz (GAK) mitfinanziert — Fördersätze und Abgrenzung unterscheiden sich daher von Bundesland zu Bundesland.\n\nÖsterreich hat wegen seines hohen Berggebietsanteils das dichteste System: Die Höhe richtet sich nach den Punkten des Berghöfekatasters (BHK), das die Erschwernis jedes einzelnen Hofes bewertet — Hangneigung, Seehöhe, Wegverhältnisse, Klima. Die Zahlung ist zudem flächendegressiv.",
    "related": [
      "saps",
      "dzes",
      "redistributivni-platba",
      "cap-2024"
    ],
    "externalUrl": "https://de.wikipedia.org/wiki/Benachteiligtes_Gebiet",
    "externalLabel": "Wikipedia: Benachteiligtes Gebiet",
    "faq": [
      {
        "q": "Wozu dient die Ausgleichszulage?",
        "a": "Sie entschädigt Betriebe in benachteiligten Gebieten für höhere Kosten und geringere Erträge und erhält so die Bewirtschaftung."
      },
      {
        "q": "Welche Gebiete sind förderfähig?",
        "a": "Berggebiete und Regionen mit naturbedingten Nachteilen wie kurzer Vegetationszeit, starker Hangneigung oder schwierigen Böden."
      }
    ]
  },
  {
    "slug": "ekoschemata",
    "term": "Öko-Regelungen (Eco-Schemes)",
    "alias": [
      "Öko-Regelungen",
      "ÖR",
      "Eco-Schemes"
    ],
    "kategorie": "dotace",
    "shortDef": "Öko-Regelungen sind freiwillige einjährige Umweltmaßnahmen der ersten Säule, für die ein fester Anteil der Direktzahlungen reserviert ist.",
    "longDef": "Öko-Regelungen sind freiwillige, jährlich neu wählbare Umwelt- und Klimamaßnahmen innerhalb der Direktzahlungen. Wer teilnimmt, erhält einen Zuschlag je Hektar; wer nicht teilnimmt, verliert diesen Teil des Budgets. Sie kamen 2023 neu hinzu und ersetzen zusammen mit der verschärften Konditionalität das frühere Greening.\n\nDeutschland bietet sieben Öko-Regelungen an (ÖR 1 bis ÖR 7) — von nichtproduktiven Ackerflächen und Blühstreifen über vielfältige Kulturen im Ackerbau und Agroforstwirtschaft bis zum Verzicht auf chemisch-synthetische Pflanzenschutzmittel — und reserviert dafür rund ein Viertel der Direktzahlungsmittel.\n\nÖsterreich hat eine andere Architektur gewählt: Dort sind die Öko-Regelungen der ersten Säule als eigene Interventionen unmittelbar in das Agrarumweltprogramm ÖPUL 2023 eingebettet und werden gemeinsam mit ihm beantragt. Der reservierte Anteil liegt bei rund 15 % der Direktzahlungen — der Schwerpunkt der österreichischen Umweltförderung liegt traditionell in der zweiten Säule.",
    "related": [
      "podminenost",
      "ozeleneni",
      "prv",
      "cap-2024"
    ],
    "externalUrl": "https://de.wikipedia.org/wiki/Gemeinsame_Agrarpolitik",
    "externalLabel": "Wikipedia: Gemeinsame Agrarpolitik",
    "faq": [
      {
        "q": "Wozu dienen die Öko-Regelungen?",
        "a": "Sie honorieren freiwillige Umwelt- und Klimaleistungen, die über die verpflichtende Konditionalität hinausgehen."
      },
      {
        "q": "Welche Bedingungen gelten für eine Öko-Regelung?",
        "a": "Jede Öko-Regelung hat eigene Auflagen; die Teilnahme wird jährlich mit dem Sammelantrag neu beantragt und ist nicht mehrjährig gebunden."
      },
      {
        "q": "Worin unterscheiden sich Öko-Regelungen von ÖPUL oder AUM?",
        "a": "Öko-Regelungen gehören zur ersten Säule und gelten immer nur ein Jahr; ÖPUL und die deutschen Agrarumweltmaßnahmen sind mehrjährige Verpflichtungen der zweiten Säule."
      }
    ]
  },
  {
    "slug": "podminenost",
    "term": "Konditionalität",
    "alias": [
      "Cross Compliance",
      "Grundanforderungen"
    ],
    "kategorie": "regulace",
    "shortDef": "Konditionalität ist das Bündel aus Rechtsvorschriften und Flächenstandards, dessen Einhaltung Voraussetzung für den Erhalt der Agrarzahlungen ist.",
    "longDef": "Die Konditionalität verknüpft die Auszahlung der Agrarförderung mit der Einhaltung eines festen Regelwerks. Sie besteht aus zwei Teilen: den elf Grundanforderungen an die Betriebsführung (GAB), die auf bestehendes EU-Fachrecht zu Umwelt, Lebensmittelsicherheit, Tiergesundheit und Tierschutz verweisen, und den neun GLÖZ-Standards für den Zustand der Flächen.\n\nSeit 2023 kommt die soziale Konditionalität hinzu: Verstöße gegen arbeits- und sozialrechtliche Vorgaben bei Beschäftigten können ebenfalls zu Kürzungen führen.\n\nWer gegen die Konditionalität verstößt, verliert nicht die Förderfähigkeit, bekommt aber die Prämie gekürzt — je nach Schwere, Ausmaß, Dauer und Wiederholung des Verstoßes. Kontrolliert wird in Deutschland durch die Länderbehörden, in Österreich durch die Agrarmarkt Austria; ein wachsender Teil der Kontrollen läuft satellitengestützt über das Flächenmonitoring.",
    "related": [
      "ekoschemata",
      "ozeleneni",
      "prv",
      "gaec"
    ],
    "externalUrl": "https://de.wikipedia.org/wiki/Cross_Compliance",
    "externalLabel": "Wikipedia: Cross Compliance",
    "faq": [
      {
        "q": "Was ist Konditionalität in der Landwirtschaft?",
        "a": "Ein Bündel von Vorschriften und Flächenstandards, dessen Einhaltung Voraussetzung für den Erhalt der Agrarzahlungen ist."
      },
      {
        "q": "Welche Bereiche deckt die Konditionalität ab?",
        "a": "Umwelt- und Gewässerschutz, Lebensmittelsicherheit, Tiergesundheit und Tierschutz, den Zustand der Flächen sowie seit 2023 auch arbeits- und sozialrechtliche Vorgaben."
      },
      {
        "q": "Wie wird die Einhaltung kontrolliert?",
        "a": "Durch Vor-Ort-Kontrollen und zunehmend über satellitengestütztes Flächenmonitoring; zuständig sind in Deutschland die Länderbehörden, in Österreich die AMA."
      }
    ]
  },
  {
    "slug": "zastropovani",
    "term": "Kappung und Degression der Direktzahlungen",
    "alias": [
      "Kappung",
      "Degression"
    ],
    "kategorie": "dotace",
    "shortDef": "Kappung begrenzt die Direktzahlungen je Betrieb nach oben, Degression kürzt sie oberhalb bestimmter Schwellen stufenweise — beides ist für die Mitgliedstaaten freiwillig.",
    "longDef": "Kappung bedeutet, dass die Direktzahlungen eines Betriebs oberhalb eines Höchstbetrags gar nicht mehr ausgezahlt werden; Degression kürzt sie oberhalb festgelegter Schwellen prozentual, ohne sie ganz zu streichen. Beides zielt darauf, die Konzentration der Fördermittel bei wenigen sehr großen Betrieben zu begrenzen. Vor der Anwendung dürfen Lohnkosten abgezogen werden, damit arbeitsintensive Betriebe nicht benachteiligt werden.\n\nDie EU stellt beide Instrumente den Mitgliedstaaten frei und erlaubt ausdrücklich, statt ihrer eine ausreichend ausgestattete Umverteilungszahlung einzusetzen. Deutschland hat genau diesen Weg gewählt: Es gibt keine Kappung, dafür die zweistufige Umverteilungseinkommensstützung auf die ersten 60 Hektar.\n\nDas Ergebnis ist ähnlich, der Weg ein anderer: Die Kappung nimmt oben weg, die Umverteilung legt unten drauf. Politisch ist die Umverteilung leichter durchzusetzen, weil kein Betrieb eine Zahlung verliert, die er zuvor erhalten hat.",
    "related": [
      "prv",
      "redistributivni-platba",
      "ekoschemata",
      "cap-2024"
    ],
    "externalUrl": "https://de.wikipedia.org/wiki/Gemeinsame_Agrarpolitik",
    "externalLabel": "Wikipedia: Gemeinsame Agrarpolitik",
    "faq": [
      {
        "q": "Was bedeutet Kappung der Direktzahlungen?",
        "a": "Die Begrenzung der Direktzahlungen je Betrieb auf einen Höchstbetrag; darüber hinausgehende Beträge werden nicht ausgezahlt."
      },
      {
        "q": "Warum wird über Kappung diskutiert?",
        "a": "Weil sie die Konzentration der Fördermittel bei wenigen sehr großen Betrieben begrenzen soll."
      },
      {
        "q": "Gilt in Deutschland eine Kappung?",
        "a": "Nein. Deutschland hat auf Kappung und Degression verzichtet und setzt stattdessen die Umverteilungseinkommensstützung auf die ersten 60 Hektar ein."
      }
    ]
  },
  {
    "slug": "prv",
    "term": "Zweite Säule der GAP (ELER)",
    "alias": [
      "ELER",
      "ländliche Entwicklung",
      "2. Säule"
    ],
    "kategorie": "dotace",
    "shortDef": "Die zweite Säule finanziert aus dem ELER-Fonds die Entwicklung ländlicher Räume — Agrarumweltmaßnahmen, Ausgleichszulage, Investitionsförderung und Tierwohl.",
    "longDef": "Die zweite Säule der Gemeinsamen Agrarpolitik wird aus dem Europäischen Landwirtschaftsfonds für die Entwicklung des ländlichen Raums (ELER) gespeist und von den Mitgliedstaaten kofinanziert. Anders als die flächengebundenen Direktzahlungen der ersten Säule fördert sie gezielt Maßnahmen: mehrjährige Agrarumwelt- und Klimaverpflichtungen, ökologischen Landbau, Ausgleichszulage, Tierwohl, Investitionen in Betriebe und Verarbeitung sowie Dorfentwicklung und LEADER.\n\nIn Deutschland ist die Ausgestaltung Sache der Bundesländer: Jedes Land legt eigene Programme auf, ein großer Teil wird zusätzlich über die Gemeinschaftsaufgabe Agrarstruktur und Küstenschutz (GAK) von Bund und Ländern getragen. Die Fördersätze unterscheiden sich deshalb spürbar zwischen den Bundesländern.\n\nÖsterreich bündelt seine zweite Säule bundesweit einheitlich — mit dem Agrarumweltprogramm ÖPUL und der Ausgleichszulage als den beiden mit Abstand größten Posten. Seit 2023 sind beide Säulen im gemeinsamen GAP-Strategieplan zusammengefasst.",
    "related": [
      "ekoschemata",
      "podminenost",
      "zastropovani",
      "ozeleneni"
    ],
    "externalUrl": "https://de.wikipedia.org/wiki/Europ%C3%A4ischer_Landwirtschaftsfonds_f%C3%BCr_die_Entwicklung_des_l%C3%A4ndlichen_Raums",
    "externalLabel": "Wikipedia: ELER",
    "faq": [
      {
        "q": "Was ist die zweite Säule der GAP?",
        "a": "Der aus dem ELER finanzierte Teil der Agrarpolitik, der die Entwicklung ländlicher Räume und gezielte Maßnahmen statt reiner Flächenzahlungen fördert."
      },
      {
        "q": "Welche Ziele verfolgt die zweite Säule?",
        "a": "Wettbewerbsfähigkeit der Betriebe, Umwelt- und Klimaschutz, Tierwohl sowie die Lebensqualität in ländlichen Regionen."
      },
      {
        "q": "Wie wird die zweite Säule finanziert?",
        "a": "Aus EU-Mitteln des ELER mit nationaler Kofinanzierung — in Deutschland über die Länderprogramme und die GAK, in Österreich bundesweit einheitlich."
      }
    ]
  },
  {
    "slug": "platba-pro-mlade-zemedelce",
    "term": "Einkommensstützung für Junglandwirte",
    "alias": [
      "Junglandwirteprämie",
      "Junglandwirte-Zuschlag"
    ],
    "kategorie": "dotace",
    "shortDef": "Die Junglandwirteprämie ist ein befristeter Hektarzuschlag für Betriebsleiter bis 40 Jahre, der den Generationswechsel in der Landwirtschaft erleichtern soll.",
    "longDef": "Die Einkommensstützung für Junglandwirte ist ein Zuschlag zu den Direktzahlungen für Betriebsleiterinnen und Betriebsleiter, die höchstens 40 Jahre alt sind und den Betrieb erstmals führen. Sie soll die hohen Kosten des Einstiegs abfedern und dem Strukturproblem entgegenwirken, dass immer weniger Höfe einen Nachfolger finden.\n\nIn Deutschland beträgt sie im Antragsjahr 2025 120,64 €/ha für höchstens 120 Hektar und wird für längstens fünf Jahre ab der ersten Bewilligung gewährt. In Österreich liegt sie bei 66 €/ha und ist auf 40 Hektar begrenzt — die niedrigere Grenze spiegelt die deutlich kleinere Durchschnittsbetriebsgröße wider.\n\nErgänzt wird die Prämie in beiden Ländern durch Niederlassungsbeihilfen und höhere Fördersätze bei der Investitionsförderung der zweiten Säule.",
    "related": [
      "prv",
      "ekoschemata",
      "ozeleneni",
      "redistributivni-platba"
    ],
    "externalUrl": "https://de.wikipedia.org/wiki/Direktzahlung_(Landwirtschaft)",
    "externalLabel": "Wikipedia: Direktzahlung",
    "faq": [
      {
        "q": "Was ist die Junglandwirteprämie?",
        "a": "Ein befristeter Hektarzuschlag zu den Direktzahlungen für Betriebsleiter bis 40 Jahre, die erstmals einen Betrieb führen."
      },
      {
        "q": "Welche Voraussetzungen gelten?",
        "a": "Höchstalter 40 Jahre, erstmalige Betriebsleitung und in der Regel eine abgeschlossene fachliche Qualifikation; die Zahlung ist auf fünf Jahre befristet."
      },
      {
        "q": "Warum gibt es die Junglandwirteprämie?",
        "a": "Sie soll den Generationswechsel erleichtern, weil der Einstieg in die Landwirtschaft sehr kapitalintensiv ist."
      }
    ]
  },
  {
    "slug": "ozeleneni",
    "term": "Greening (bis 2022)",
    "alias": [
      "Greening",
      "Ökologisierung"
    ],
    "kategorie": "dotace",
    "shortDef": "Greening war die verpflichtende Umweltkomponente der Direktzahlungen von 2015 bis 2022; seit 2023 ist es in Konditionalität und Öko-Regelungen aufgegangen.",
    "longDef": "Greening bezeichnete jene 30 % der Direktzahlungen, die ab 2015 nur ausgezahlt wurden, wenn ein Betrieb drei Umweltauflagen erfüllte: Anbaudiversifizierung auf dem Ackerland, Erhalt des Dauergrünlands und Bereitstellung ökologischer Vorrangflächen auf mindestens 5 % der Ackerfläche.\n\nDie Bilanz fiel ernüchternd aus. Der Europäische Rechnungshof kam 2017 zu dem Ergebnis, dass Greening auf lediglich rund 5 % der Fläche zu tatsächlichen Änderungen der Bewirtschaftung führte — die meisten Betriebe erfüllten die Auflagen ohnehin schon. Kritisiert wurde vor allem, dass Zwischenfrüchte und stickstoffbindende Kulturen als Vorrangflächen zählten.\n\nZum Antragsjahr 2023 wurde Greening abgeschafft. Seine Bestandteile stecken heute in zwei Instrumenten: Die verpflichtenden Elemente wanderten in die GLÖZ-Standards der Konditionalität, die freiwillige Honorierung darüber hinausgehender Leistungen übernahmen die Öko-Regelungen.",
    "related": [
      "ekoschemata",
      "podminenost",
      "prv",
      "cap-2024"
    ],
    "externalUrl": "https://de.wikipedia.org/wiki/Greening_(Agrarpolitik)",
    "externalLabel": "Wikipedia: Greening",
    "faq": [
      {
        "q": "Was war Greening in der Landwirtschaft?",
        "a": "Die verpflichtende Umweltkomponente der Direktzahlungen von 2015 bis 2022, an die 30 % der Prämie gebunden waren."
      },
      {
        "q": "Was waren die Hauptelemente des Greenings?",
        "a": "Anbaudiversifizierung, Erhalt des Dauergrünlands und ökologische Vorrangflächen auf mindestens 5 % der Ackerfläche."
      },
      {
        "q": "Gibt es Greening noch?",
        "a": "Nein. Seit 2023 sind die verpflichtenden Teile in den GLÖZ-Standards aufgegangen, die freiwilligen in den Öko-Regelungen."
      }
    ]
  },
  {
    "slug": "diskovy-podmitac",
    "term": "Scheibenegge",
    "alias": [
      "Kurzscheibenegge",
      "Scheibengrubber"
    ],
    "kategorie": "technologie",
    "shortDef": "Die Scheibenegge ist ein Bodenbearbeitungsgerät für die flache Stoppelbearbeitung.",
    "longDef": "Die Scheibenegge arbeitet mit angestellten Hohlscheiben, die den Boden schneiden, mischen und rückverfestigen. Sie ist das Standardgerät für die **flache Stoppelbearbeitung** unmittelbar nach der Ernte: Sie bricht die Kapillarität, mischt Ernterückstände flach ein und regt Ausfallgetreide und Unkrautsamen zum Keimen an, damit sie in einem zweiten Arbeitsgang beseitigt werden können.\n\nDie heute verbreitete **Kurzscheibenegge** hat zwei Scheibenreihen an einzeln aufgehängten Zinken mit gummigefederter Lagerung und eine Nachlaufwalze. Sie arbeitet zwei bis acht Zentimeter tief, braucht viel Zugleistung je Meter Arbeitsbreite, ist dafür aber sehr flächenleistungsstark — Fahrgeschwindigkeiten von 12 bis 15 km/h sind üblich.\n\nGegenüber dem Grubber mischt sie intensiver und hinterlässt eine ebenere Oberfläche, arbeitet aber weniger tief und lockert kaum. Auf steinigen Böden ist sie weniger empfindlich als Zinkengeräte; bei feuchten, tonigen Böden neigt sie zum Verschmieren der Bearbeitungssohle.\n\nDie flache Stoppelbearbeitung ist zugleich eine Hygienemaßnahme: Sie fördert die Rotte der Ernterückstände und senkt damit den Infektionsdruck durch Fusarium in der Folgefrucht.",
    "related": [
      "radlickovy-kypric",
      "hloubkove-kypreni",
      "strniste"
    ],
    "externalUrl": "https://de.wikipedia.org/wiki/Scheibenegge",
    "externalLabel": "Wikipedia: Scheibenegge",
    "faq": [
      {
        "q": "Wozu dient eine Scheibenegge?",
        "a": "Zur flachen Stoppelbearbeitung: Sie mischt Ernterückstände ein, unterbricht die Kapillarität und regt Ausfallsamen zum Keimen an."
      },
      {
        "q": "Worin unterscheiden sich Scheibenegge und Grubber?",
        "a": "Die Scheibenegge mischt intensiv und arbeitet flach mit hoher Flächenleistung, der Grubber lockert tiefer und hinterlässt eine gröbere Struktur."
      }
    ]
  },
  {
    "slug": "radlickovy-kypric",
    "term": "Grubber",
    "alias": [
      "Zinkengrubber",
      "Flügelschargrubber",
      "Kultivator"
    ],
    "kategorie": "technologie",
    "shortDef": "Der Grubber lockert und mischt den Boden mit Zinken, ohne ihn zu wenden.",
    "longDef": "Der Grubber zieht federnde oder starre Zinken mit Scharen durch den Boden. Er lockert, mischt Ernterückstände ein und hinterlässt eine raue Oberfläche — im Unterschied zum Pflug wendet er nicht, im Unterschied zur Scheibenegge arbeitet er tiefer und lockert stärker.\n\nJe nach Scharform erfüllt er zwei verschiedene Aufgaben: **Flügelschare** schneiden ganzflächig und sind das Werkzeug der flachen Stoppelbearbeitung, bei der es auf vollständiges Durchschneiden der Wurzeln ankommt; **Schmalschare** lockern tiefer, bis etwa 30 cm, ohne viel Boden nach oben zu holen.\n\nEntscheidend für die Arbeitsqualität ist die Zahl der Zinkenbalken: Drei bis fünf Reihen mit ausreichendem Strichabstand verhindern Verstopfen bei viel Stroh. Eine Nachlaufwalze bricht Kluten und verfestigt rück, damit der Boden Anschluss ans Kapillarwasser behält.\n\nIn der pfluglosen Bestellung ist der Grubber das zentrale Gerät. Er verlangt allerdings mehr acker­bauliche Sorgfalt als der Pflug: Ausfallgetreide, Ungrassamen und Krankheitserreger bleiben an der Oberfläche, weshalb Fruchtfolge und Stoppelhygiene an Bedeutung gewinnen.",
    "related": [
      "diskovy-podmitac",
      "hloubkove-kypreni",
      "orba",
      "predsetova-priprava"
    ],
    "externalUrl": "https://de.wikipedia.org/wiki/Grubber",
    "externalLabel": "Wikipedia: Grubber",
    "faq": [
      {
        "q": "Wie arbeitet ein Grubber?",
        "a": "Zinken mit Scharen ziehen durch den Boden, lockern ihn und mischen Ernterückstände ein, ohne zu wenden."
      },
      {
        "q": "Wann wird der Grubber eingesetzt?",
        "a": "Zur Stoppelbearbeitung nach der Ernte und zur Grundbodenbearbeitung anstelle des Pfluges."
      }
    ]
  },
  {
    "slug": "teleskopicky-manipulator",
    "term": "Teleskoplader",
    "alias": [
      "Teleskopstapler",
      "Telehandler"
    ],
    "kategorie": "technologie",
    "shortDef": "Der Teleskoplader ist eine Hofmaschine mit ausfahrbarem Ausleger für Ladearbeiten in Höhe und Reichweite.",
    "longDef": "Der Teleskoplader ist die vielseitigste Maschine des Betriebshofs. Sein ausfahrbarer Ausleger erreicht Hubhöhen von sechs bis über zehn Metern und greift zugleich weit nach vorn — beides kann ein Frontlader nicht. Über die Schnellwechselplatte lassen sich Schaufel, Palettengabel, Ballenzange, Silageschneidzange, Kehrmaschine oder Arbeitsbühne aufnehmen.\n\nTypische Aufgaben sind das Stapeln von Rundballen, das Beschicken des Futtermischwagens, das Verladen von Getreide und Dünger, das Aufsetzen und Verdichten von Fahrsilos und Arbeiten am Gebäude.\n\nEntscheidend beim Kauf sind Hubhöhe, Nutzlast bei ausgefahrenem Ausleger — nicht die Maximallast bei eingezogenem — sowie Wendekreis und Bauhöhe, denn viele Ställe und Tore setzen enge Grenzen. Hoflader und Radlader sind wendiger und billiger, erreichen aber die Höhe nicht.\n\nSicherheitstechnisch ist der Teleskoplader nicht harmlos: Mit ausgefahrenem Ausleger verlagert sich der Schwerpunkt weit nach vorn, weshalb moderne Maschinen eine Lastmomentanzeige führen. Für den Einsatz als Arbeitsbühne gelten eigene Vorschriften der Unfallversicherung.",
    "related": [
      "celni-nakladac",
      "auto-steering",
      "telematika",
      "drony-zemedelstvi"
    ],
    "externalUrl": "https://de.wikipedia.org/wiki/Teleskoplader",
    "externalLabel": "Wikipedia: Teleskoplader",
    "faq": [
      {
        "q": "Was ist ein Teleskoplader?",
        "a": "Eine Hofmaschine mit ausfahrbarem Ausleger, die Lasten hoch und weit nach vorn bewegen kann."
      },
      {
        "q": "Was sind die Vorteile eines Teleskopladers?",
        "a": "Große Hubhöhe und Reichweite bei kompakten Außenmaßen sowie ein breites Anbaugeräteangebot über die Schnellwechselplatte."
      }
    ]
  },
  {
    "slug": "celni-nakladac",
    "term": "Frontlader",
    "alias": [
      "Traktorfrontlader"
    ],
    "kategorie": "technologie",
    "shortDef": "Der Frontlader ist ein am Traktor angebautes Ladegerät für Schaufel-, Gabel- und Ballenarbeiten.",
    "longDef": "Der Frontlader wird an der Vorderachse des Traktors angebaut und über die Traktorhydraulik betrieben. Er macht aus dem ohnehin vorhandenen Schlepper eine Lademaschine und ist deshalb auf kleinen und mittleren Betrieben die wirtschaftlichste Lösung für Hofarbeiten: Mist laden, Futter vorlegen, Silage entnehmen, Paletten und Ballen bewegen.\n\nWesentliche Ausstattungsmerkmale sind die **Parallelführung**, die das Werkzeug beim Heben in der Waage hält, die **Schwimmstellung** zum Abziehen von Flächen, die **Dritte Steuerfunktion** für hydraulische Anbaugeräte wie Ballen- oder Silagezangen sowie eine hydraulische Werkzeugverriegelung. Nachrüstbare Wiegeeinrichtungen erlauben es, Futtermengen direkt beim Laden zu erfassen.\n\nGegenüber Hof-, Rad- und Teleskoplader ist der Frontlader deutlich günstiger, aber langsamer und unhandlicher: Der Traktor ist lang, der Wendekreis groß und die Sicht nach vorn oben eingeschränkt. Wo täglich viele Stunden geladen wird, ist eine eigene Lademaschine wirtschaftlicher.\n\nZu beachten ist die Vorderachslast: Ein voll beladener Frontlader kann die zulässige Achslast überschreiten. Ein Heckballast ist deshalb nicht optional, sondern notwendig — er entlastet die Vorderachse und hält die Lenkfähigkeit.",
    "related": [
      "teleskopicky-manipulator",
      "telematika",
      "gps-rtk",
      "auto-steering"
    ],
    "externalUrl": "https://de.wikipedia.org/wiki/Frontlader",
    "externalLabel": "Wikipedia: Frontlader",
    "faq": [
      {
        "q": "Wofür wird ein Frontlader eingesetzt?",
        "a": "Für Hofarbeiten wie Mist und Futter laden, Silage entnehmen sowie Ballen und Paletten bewegen."
      },
      {
        "q": "Worin unterscheiden sich Frontlader und Teleskoplader?",
        "a": "Der Frontlader ist ein Traktoranbaugerät und günstiger; der Teleskoplader ist eine eigene Maschine mit größerer Hubhöhe, Reichweite und Wendigkeit."
      }
    ]
  },
  {
    "slug": "rozmetadlo-hnojiv",
    "term": "Düngerstreuer",
    "alias": [
      "Mineraldüngerstreuer",
      "Schleuderstreuer"
    ],
    "kategorie": "technologie",
    "shortDef": "Der Düngerstreuer verteilt mineralischen Dünger gleichmäßig über die Fläche.",
    "longDef": "Der Düngerstreuer bringt Mineraldünger flächig aus. Am weitesten verbreitet ist der **Zweischeiben-Schleuderstreuer**, bei dem zwei gegenläufige Wurfscheiben den Dünger auf 24 bis 54 m Arbeitsbreite verteilen. Für höchste Querverteilungsgenauigkeit oder sehr schmale Arbeitsbreiten gibt es daneben **pneumatische Streuer**, die den Dünger über Schläuche einzelnen Auslässen zuführen.\n\nEntscheidend für die Qualität ist die **Querverteilung**: Weil sich die Wurfbilder benachbarter Fahrgassen überlappen müssen, wirkt sich jede Abweichung sofort auf den Bestand aus — sichtbar als Streifen im Feld. Die Streutabelle des Herstellers gilt nur für die geprüfte Düngerqualität; bei abweichender Körnung, Schüttdichte oder Feuchte muss der Streuer nachjustiert werden. Prüfschalen oder mobile Prüfstände sind die einzige Möglichkeit, das wirklich zu kontrollieren.\n\n**Rechtlicher Rahmen in Deutschland**: Nach der Düngeverordnung müssen Geräte zur Ausbringung von Düngemitteln dem Stand der Technik entsprechen. Zu Gewässern sind Abstände einzuhalten — 3 m Regelabstand, 1 m bei Geräten mit **Grenzstreueinrichtung**, an stark geneigten Flächen deutlich mehr. Die ausgebrachten Mengen sind aufzuzeichnen und auf den Düngebedarf anzurechnen.\n\n**Präzisionstechnik**: Wiegerahmen regeln die Menge unabhängig von der Fahrgeschwindigkeit, **Section Control** schaltet Teilbreiten am Vorgewende ab, und über Applikationskarten lässt sich die Menge teilflächenspezifisch variieren — siehe [[variable-rate]] und [[n-senzor]].",
    "related": [
      "cisterna-na-kejdu",
      "npk-hnojivo",
      "mocovina",
      "adjuvant"
    ],
    "externalUrl": "https://de.wikipedia.org/wiki/D%C3%BCngerstreuer",
    "externalLabel": "Wikipedia: Düngerstreuer",
    "faq": [
      {
        "q": "Wie funktioniert ein Düngerstreuer?",
        "a": "Meist über zwei gegenläufige Wurfscheiben, die den Dünger auf große Arbeitsbreite verteilen; die Wurfbilder benachbarter Fahrgassen überlappen sich."
      },
      {
        "q": "Warum ist eine gleichmäßige Verteilung wichtig?",
        "a": "Ungleichmäßige Querverteilung führt zu sichtbaren Streifen im Bestand, ungleicher Abreife und Ertragsverlusten — und zu unnötigen Nährstoffverlusten."
      }
    ]
  },
  {
    "slug": "cisterna-na-kejdu",
    "term": "Güllefass",
    "alias": [
      "Gülletankwagen",
      "Pumptankwagen",
      "Gülleausbringung"
    ],
    "kategorie": "technologie",
    "shortDef": "Das Güllefass transportiert und verteilt Gülle und Gärreste. In Deutschland ist die bodennahe Ausbringung inzwischen Pflicht.",
    "longDef": "Das Güllefass transportiert flüssige Wirtschaftsdünger — Gülle, Jauche und Gärreste — und bringt sie auf die Fläche aus. Fassgrößen reichen von 8 m³ am Hoflader-Betrieb bis über 30 m³ beim Lohnunternehmer; bei großen Mengen arbeiten Verschlauchungssysteme mit Pumpe und Schlauchtrommel wirtschaftlicher, weil sie den Straßenverkehr und die Bodenbelastung sparen.\n\n**Die zentrale rechtliche Änderung in Deutschland**: Der breitflächige Prallteller ist Geschichte. Nach der Düngeverordnung ist die **bodennahe, streifenförmige Ausbringung** vorgeschrieben — auf **Ackerland seit Februar 2020**, auf **Grünland seit Februar 2025**. Zulässig sind Schleppschlauch, Schleppschuh und Injektion beziehungsweise Schlitztechnik. Auf unbestelltem Ackerland gilt zusätzlich die **Einarbeitungspflicht innerhalb einer Stunde**. In Österreich schreibt die Nitrat-Aktionsprogramm-Verordnung entsprechende emissionsmindernde Verfahren vor.\n\nDer Grund ist der **Ammoniakverlust**: Bei breitflächiger Ausbringung an einem warmen, windigen Tag entweicht ein erheblicher Teil des Ammoniumstickstoffs innerhalb weniger Stunden in die Luft. Bodennahe Verfahren legen die Gülle in schmalen Bändern unter den Bestand, wo weniger Oberfläche der Luft ausgesetzt ist. Was nicht verdunstet, wirkt als Dünger — die Auflage ist also zugleich betriebswirtschaftlich sinnvoll.\n\n**Weitere Vorgaben**: Sperrfristen von Herbst bis Winter, Obergrenze von 170 kg Stickstoff aus organischen Düngern je Hektar und Jahr im Betriebsdurchschnitt, Mindestlagerkapazität, Abstände zu Gewässern und Meldepflichten beim Zukauf. Moderne Fässer messen den Nährstoffgehalt per **NIRS-Sensor** während der Ausbringung und dokumentieren die tatsächlich ausgebrachte Menge — das erleichtert die Aufzeichnungspflicht erheblich.",
    "related": [
      "rozmetadlo-hnojiv",
      "digestat",
      "organicka-hmota",
      "strniste"
    ],
    "externalUrl": "https://de.wikipedia.org/wiki/G%C3%BClle",
    "externalLabel": "Wikipedia: Gülle",
    "faq": [
      {
        "q": "Wozu dient ein Güllefass?",
        "a": "Zum Transport und zur Ausbringung von Gülle und Gärresten als organischer Dünger."
      },
      {
        "q": "Wie wird Gülle heute ausgebracht?",
        "a": "Bodennah und streifenförmig mit Schleppschlauch, Schleppschuh oder Injektion — in Deutschland auf Ackerland seit 2020 und auf Grünland seit 2025 verpflichtend."
      }
    ]
  },
  {
    "slug": "svinovaci-lis",
    "term": "Rundballenpresse",
    "alias": [
      "Ballenpresse",
      "Pressе",
      "Press-Wickel-Kombination"
    ],
    "kategorie": "technologie",
    "shortDef": "Die Rundballenpresse verdichtet Halmgut zu zylindrischen Ballen und bindet sie mit Netz oder Folie.",
    "longDef": "Die Rundballenpresse nimmt Heu, Stroh oder Anwelkgut mit der Pick-up auf und verdichtet es in der Presskammer zu einem zylindrischen Ballen, der anschließend mit Netz, Garn oder Mantelfolie gebunden wird.\n\nUnterschieden werden zwei Bauarten: Die **Festkammerpresse** arbeitet mit gleichbleibendem Kammervolumen und erzeugt einen weichen Kern — gut für Anwelksilage, weil der Ballen sich beim Wickeln noch etwas setzt. Die **Variokammerpresse** verkleinert die Kammer während des Pressvorgangs und liefert durchgehend hohe Dichte, was bei Stroh und Heu Transport- und Lagerkosten spart.\n\nEin **Schneidrotor** mit 13 bis 25 Messern zerkleinert das Gut vor dem Pressen. Das erhöht die Ballendichte, verbessert die Verdichtung im Ballen und erleichtert später die Entnahme am Futtertisch.\n\nDie **Press-Wickel-Kombination** presst und wickelt in einem Arbeitsgang. Bei Silage ist das der entscheidende Vorteil: Je kürzer die Zeit zwischen Pressen und Luftabschluss, desto weniger Nacherwärmung und Fehlgärung. Für gute Silage sind mindestens sechs Folienlagen üblich.\n\nGegenüber der Quaderballenpresse ist die Rundballenpresse günstiger und für kleinere Mengen wirtschaftlicher; Quaderballen lassen sich dafür besser stapeln und transportieren.",
    "related": [
      "teleskopicky-manipulator",
      "cisterna-na-kejdu",
      "rozmetadlo-hnojiv",
      "hloubkove-kypreni"
    ],
    "externalUrl": "https://de.wikipedia.org/wiki/Ballenpresse",
    "externalLabel": "Wikipedia: Ballenpresse",
    "faq": [
      {
        "q": "Wie arbeitet eine Rundballenpresse?",
        "a": "Sie nimmt das Halmgut mit der Pick-up auf, verdichtet es in der Presskammer zu einem Zylinder und bindet ihn mit Netz oder Folie."
      },
      {
        "q": "Worin unterscheiden sich Festkammer- und Variokammerpresse?",
        "a": "Die Festkammerpresse erzeugt einen weicheren Kern und eignet sich gut für Silage, die Variokammerpresse presst durchgehend dichter — vorteilhaft bei Heu und Stroh."
      },
      {
        "q": "Was ist eine Press-Wickel-Kombination?",
        "a": "Eine Maschine, die den Ballen unmittelbar nach dem Pressen wickelt — entscheidend für die Silagequalität, weil der Luftabschluss sofort erfolgt."
      }
    ]
  },
  {
    "slug": "samochodna-rezacka",
    "term": "Feldhäcksler",
    "alias": [
      "Häcksler",
      "selbstfahrender Feldhäcksler"
    ],
    "kategorie": "technologie",
    "shortDef": "Der Feldhäcksler erntet Mais und Gras und zerkleinert sie in einem Arbeitsgang zu Silage.",
    "longDef": "Der selbstfahrende Feldhäcksler ist die leistungsstärkste Erntemaschine der Grünfutterernte. Er nimmt das Gut über ein Maisgebiss oder eine Gras-Pick-up auf, zieht es über Vorpresswalzen ein und zerkleinert es an der **Häckseltrommel** auf die eingestellte theoretische Häcksellänge. Über den Auswurfkrümmer wird es auf das nebenherfahrende Transportfahrzeug geblasen.\n\nMotorleistungen reichen von rund 400 bis über 1.100 PS; Durchsätze von 150 bis 250 t Frischmasse je Stunde sind in Mais keine Seltenheit. Diese Maschinen laufen deshalb fast ausschließlich im Lohnunternehmen oder in Maschinengemeinschaften.\n\nZwei Baugruppen entscheiden über die Silagequalität. Der **Corn Cracker** — zwei gegenläufige Reibwalzen mit Drehzahldifferenz — bricht die Maiskörner auf; ohne ihn laufen ganze Körner unverdaut durch das Tier. Und die **Häcksellänge** steuert den Kompromiss zwischen Verdichtbarkeit im Silo und Strukturwirkung im Pansen. Beim **Shredlage**-Verfahren wird länger gehäckselt und das Material zusätzlich längs aufgefasert, was mehr Struktur bei gleicher Aufschlussrate liefert.\n\nModerne Häcksler messen Ertrag und Trockenmasse per NIR-Sensor im Auswurfkanal und dosieren Siliermittel mengenabhängig — beides geht direkt als Karte in die Dokumentation und in die Rationsplanung ein.",
    "related": [
      "svinovaci-lis",
      "rozmetadlo-hnojiv",
      "cisterna-na-kejdu",
      "hloubkove-kypreni"
    ],
    "externalUrl": "https://de.wikipedia.org/wiki/Feldh%C3%A4cksler",
    "externalLabel": "Wikipedia: Feldhäcksler",
    "faq": [
      {
        "q": "Wie arbeitet ein Feldhäcksler?",
        "a": "Er nimmt das Erntegut auf, zieht es über Vorpresswalzen ein, zerkleinert es an der Häckseltrommel und bläst es auf ein Transportfahrzeug."
      },
      {
        "q": "Wofür wird ein Feldhäcksler eingesetzt?",
        "a": "Für die Ernte von Silomais und Grassilage sowie von Ganzpflanzensilage und Energiepflanzen."
      },
      {
        "q": "Was ist ein Corn Cracker?",
        "a": "Zwei gegenläufige Reibwalzen mit Drehzahldifferenz, die die Maiskörner aufbrechen und so erst verdaulich machen."
      }
    ]
  },
  {
    "slug": "pneumaticky-seci-stroj",
    "term": "Pneumatische Sämaschine",
    "alias": [
      "Drillmaschine",
      "Einzelkornsägerät"
    ],
    "kategorie": "technologie",
    "shortDef": "Die pneumatische Sämaschine verteilt das Saatgut über einen Luftstrom auf die Säschare und legt es gleichmäßig ab.",
    "longDef": "Bei der pneumatischen Sämaschine dosiert ein zentrales Dosierorgan das Saatgut aus einem großen Tank in einen Luftstrom, der es über den Verteilerkopf auf die einzelnen Säschare befördert. Das erlaubt große Tankvolumina, große Arbeitsbreiten und eine einfache Umstellung der Aussaatmenge vom Traktorterminal aus — anders als bei mechanischen Maschinen mit Nockenrad je Schar.\n\nZwei Bauarten sind zu unterscheiden. Die **Drillmaschine** legt das Saatgut als Band im Reihenabstand von 12 bis 15 cm ab und wird für Getreide, Raps und Feinsämereien eingesetzt. Die **Einzelkornsämaschine** vereinzelt jedes Korn über eine Unterdruck-Lochscheibe und legt es mit definiertem Abstand in der Reihe ab; sie ist bei Mais, Zuckerrüben, Sonnenblume und zunehmend auch bei Raps Standard, weil gleichmäßige Standräume den Ertrag messbar sichern.\n\nMit **Section Control** schaltet die Maschine Teilbreiten am Vorgewende und an Keilen automatisch ab, was Doppelsaat vermeidet. Über **teilflächenspezifische Saatstärke** wird die Aussaatmenge nach Bodengüte-Karte variiert — auf schwachen Partien dünner, auf starken dichter. Elektrisch angetriebene Dosierer sind hierfür Voraussetzung, weil sie unabhängig von der Fahrgeschwindigkeit geregelt werden.\n\nEntscheidend für den Feldaufgang bleibt trotz aller Technik die Ablagetiefe: gleichmäßig, in feuchten Boden, mit sicherem Bodenschluss durch die Druckrolle.",
    "related": [
      "radlickovy-kypric",
      "hloubkove-kypreni",
      "predsetova-priprava",
      "osevni-postup"
    ],
    "externalUrl": "https://de.wikipedia.org/wiki/S%C3%A4maschine",
    "externalLabel": "Wikipedia: Sämaschine",
    "faq": [
      {
        "q": "Wie funktioniert eine pneumatische Sämaschine?",
        "a": "Ein zentrales Dosierorgan gibt das Saatgut in einen Luftstrom, der es über einen Verteilerkopf auf die einzelnen Säschare befördert."
      },
      {
        "q": "Wofür wird sie eingesetzt?",
        "a": "Für die Aussaat von Getreide, Raps und Feinsämereien als Drillmaschine sowie für Mais und Rüben als Einzelkornsämaschine."
      },
      {
        "q": "Worin unterscheiden sich pneumatische und mechanische Sämaschinen?",
        "a": "Die pneumatische arbeitet mit Luftstrom und zentraler Dosierung, was große Arbeitsbreiten und elektronische Mengenregelung ermöglicht; die mechanische dosiert je Schar über Nockenräder."
      }
    ]
  },
  {
    "slug": "plecka",
    "term": "Hackgerät",
    "alias": [
      "Reihenhacke",
      "Maschinenhacke",
      "Scharhacke"
    ],
    "kategorie": "technologie",
    "shortDef": "Das Hackgerät bearbeitet den Boden zwischen den Reihen, zerstört Unkraut mechanisch und lockert die Oberfläche.",
    "longDef": "Das Hackgerät führt Gänsefußschare, Scheiben oder Fingerhacken zwischen den Kulturreihen durch den Boden. Es schneidet Unkräuter unterhalb des Vegetationspunktes ab, verschüttet Keimlinge und lockert die Krume, was die Verdunstung bremst und die Mineralisierung anregt.\n\nLange galt das Hacken als Werkzeug des Ökolandbaus. Zwei Entwicklungen haben es zurück in den konventionellen Ackerbau gebracht: die **Herbizidresistenzen**, die chemische Lösungen zunehmend versagen lassen, und die **Technik**, die das Verfahren erst schlagkräftig macht.\n\n**Die entscheidenden Techniksprünge:**\n- **Kamerasteuerung** — eine Kamera erkennt die Reihen und führt das Gerät über einen Verschiebrahmen zentimetergenau nach; damit sind Arbeitsgeschwindigkeiten von 8 bis 15 km/h möglich statt der früheren 3 bis 5 km/h\n- **RTK-Lenkung** — wird auf denselben Spuren gesät und gehackt, lässt sich der Abstand zur Reihe deutlich verringern\n- **Fingerhacke und Torsionshacke** — sie greifen in die Reihe hinein und erfassen auch Unkraut zwischen den Pflanzen\n- **Einzelpflanzenerkennung** — Kameras mit Bilderkennung unterscheiden Kultur- und Unkrautpflanze und steuern Hackmesser oder Punktapplikation an\n\n**Kombination statt Entweder-Oder**: In Zuckerrüben und Mais ist die **Bandspritzung mit gleichzeitigem Hacken** verbreitet — Herbizid nur auf das schmale Band über der Reihe, mechanisch dazwischen. Das spart bis zu zwei Drittel des Mittels bei gleicher Wirkung und ist in Deutschland auch mit Blick auf die **Öko-Regelung 6** (Verzicht auf chemisch-synthetische Pflanzenschutzmittel) interessant.\n\nGrenzen hat das Verfahren bei nasser Witterung — gehackte Unkräuter wachsen wieder an — und in Getreide mit engem Reihenabstand.",
    "related": [
      "radlickovy-kypric",
      "hloubkove-kypreni",
      "predsetova-priprava",
      "osevni-postup"
    ],
    "externalUrl": "https://de.wikipedia.org/wiki/Hackger%C3%A4t",
    "externalLabel": "Wikipedia: Hackgerät",
    "faq": [
      {
        "q": "Wie funktioniert ein Hackgerät?",
        "a": "Schare oder Scheiben laufen zwischen den Kulturreihen durch den Boden, schneiden Unkraut ab und lockern die Oberfläche."
      },
      {
        "q": "Wofür wird ein Hackgerät eingesetzt?",
        "a": "Zur mechanischen Unkrautregulierung in Reihenkulturen wie Mais, Zuckerrüben, Raps und Gemüse."
      },
      {
        "q": "Worin unterscheiden sich Hackgerät und Striegel?",
        "a": "Das Hackgerät arbeitet gezielt zwischen den Reihen, der Striegel ganzflächig und flach über den gesamten Bestand."
      }
    ]
  },
  {
    "slug": "planetova-prevodovka",
    "term": "Planetengetriebe",
    "alias": [
      "Umlaufgetriebe",
      "Planetenradgetriebe"
    ],
    "kategorie": "pohon",
    "shortDef": "Das Planetengetriebe überträgt Drehmoment über ein Sonnenrad, umlaufende Planetenräder und ein Hohlrad und erreicht hohe Übersetzungen auf engstem Raum.",
    "longDef": "Das Planetengetriebe besteht aus dem zentralen **Sonnenrad**, mehreren auf einem **Steg** gelagerten **Planetenrädern** und dem außen umschließenden **Hohlrad**. Je nachdem, welches der drei Elemente festgehalten, angetrieben oder abgetrieben wird, ergeben sich unterschiedliche Übersetzungen — mit ein und demselben Radsatz.\n\nDer entscheidende Vorteil ist die Leistungsverzweigung: Das Drehmoment verteilt sich auf mehrere Planetenräder gleichzeitig, sodass jeder Zahneingriff nur einen Bruchteil trägt. Dadurch überträgt ein Planetengetriebe bei gleicher Baugröße ein Vielfaches dessen, was ein Stirnradgetriebe schafft, und arbeitet dabei koaxial — Antrieb und Abtrieb liegen auf einer Achse.\n\nIn der Landtechnik steckt es an mehreren Stellen: in den **Endantrieben** der Traktorachsen, wo unmittelbar am Rad noch einmal stark untersetzt wird, in **Lastschaltgetrieben** als schaltbare Stufe, in **stufenlosen Getrieben** als Summierungsgetriebe zwischen hydrostatischem und mechanischem Leistungszweig sowie in Radnabenantrieben von Selbstfahrern.\n\nSiehe auch [[cvt-prevodovka]] und [[powershift]], die beide auf Planetensätzen aufbauen.",
    "related": [
      "cvt-prevodovka",
      "powershift",
      "auto-steering",
      "common-rail"
    ],
    "externalUrl": "https://de.wikipedia.org/wiki/Planetengetriebe",
    "externalLabel": "Wikipedia: Planetengetriebe",
    "faq": [
      {
        "q": "Wie funktioniert ein Planetengetriebe?",
        "a": "Planetenräder laufen zwischen einem zentralen Sonnenrad und einem äußeren Hohlrad um; je nachdem, welches Element festgehalten wird, ergibt sich eine andere Übersetzung."
      },
      {
        "q": "Wozu dient ein Planetengetriebe?",
        "a": "Es erreicht hohe Übersetzungen und Drehmomente auf engstem Raum bei koaxialer Bauweise."
      },
      {
        "q": "Worin unterscheidet es sich von einem normalen Getriebe?",
        "a": "Das Drehmoment verteilt sich auf mehrere Zahneingriffe gleichzeitig, wodurch es bei gleicher Baugröße deutlich mehr überträgt."
      }
    ]
  },
  {
    "slug": "dvouhmotovy-setrvacnik",
    "term": "Zweimassenschwungrad",
    "alias": [
      "ZMS",
      "Zweimassen-Schwungrad"
    ],
    "kategorie": "pohon",
    "shortDef": "Das Zweimassenschwungrad entkoppelt Motor und Getriebe über ein Federsystem und dämpft so die Drehschwingungen des Dieselmotors.",
    "longDef": "Das Zweimassenschwungrad (ZMS) teilt das klassische Schwungrad in zwei gegeneinander verdrehbare Massen, die über ein Bogenfeder-Dämpfersystem in einer Fettkammer verbunden sind. Die primäre Masse sitzt an der Kurbelwelle, die sekundäre trägt die Kupplung.\n\nDer Grund für den Aufwand liegt in der Physik des modernen Dieselmotors: Hohe Einspritzdrücke, hohe Zünddrücke und niedrige Nenndrehzahlen erzeugen kräftige Drehungleichförmigkeiten. Ein starres Schwungrad würde diese Schwingungen ungedämpft in den Antriebsstrang leiten — mit Getrieberasseln, Dröhnen im Fahrerhaus und erhöhtem Verschleiß an Zahnrädern und Lagern. Das ZMS verschiebt die kritische Resonanzfrequenz unter die Leerlaufdrehzahl, sodass sie im Betrieb gar nicht mehr durchfahren wird.\n\nErkauft wird das mit Kosten und Lebensdauer: Ein ZMS ist deutlich teurer als ein starres Schwungrad und ein Verschleißteil. Typische Anzeichen für einen Defekt sind Rasseln im Leerlauf, Rumpeln beim Abstellen des Motors und Vibrationen beim Anfahren. Beim Kupplungstausch wird es üblicherweise mitgewechselt, weil ein erneuter Ausbau des Getriebes den Großteil der Kosten verursacht.\n\nIn Traktoren ist es vor allem dort verbreitet, wo Motor und Getriebe direkt verschraubt sind; bei stufenlosen Getrieben mit hydrostatischem Zweig übernimmt teils die Hydraulik einen Teil der Dämpfung.",
    "related": [
      "planetova-prevodovka",
      "powershift",
      "common-rail",
      "emisni-normy-stage"
    ],
    "externalUrl": "https://de.wikipedia.org/wiki/Zweimassenschwungrad",
    "externalLabel": "Wikipedia: Zweimassenschwungrad",
    "faq": [
      {
        "q": "Wie funktioniert ein Zweimassenschwungrad?",
        "a": "Zwei gegeneinander verdrehbare Massen sind über Bogenfedern verbunden und dämpfen so die Drehschwingungen zwischen Motor und Getriebe."
      },
      {
        "q": "Wozu dient ein Zweimassenschwungrad?",
        "a": "Es hält die Drehungleichförmigkeiten des Dieselmotors vom Antriebsstrang fern und verringert Geräusche und Verschleiß."
      },
      {
        "q": "Woran erkennt man ein defektes ZMS?",
        "a": "An Rasseln im Leerlauf, Rumpeln beim Abstellen des Motors und Vibrationen beim Anfahren."
      }
    ]
  },
  {
    "slug": "load-sensing",
    "term": "Load-Sensing-Hydraulik",
    "alias": [
      "Load Sensing",
      "LS-Hydraulik",
      "bedarfsstromgeregelte Hydraulik"
    ],
    "kategorie": "pohon",
    "shortDef": "Die Load-Sensing-Hydraulik liefert nur so viel Ölstrom und Druck, wie der Verbraucher gerade benötigt, und spart damit Leistung und Kraftstoff.",
    "longDef": "Bei der Load-Sensing-Hydraulik meldet eine Steuerleitung den Lastdruck des jeweiligen Verbrauchers an eine **Verstellpumpe** zurück. Diese fördert daraufhin genau den Volumenstrom, der bei einem konstanten Differenzdruck von typischerweise 15 bis 25 bar über der Last benötigt wird. In Neutralstellung schwenkt sie fast auf null aus — die Hydraulik verbraucht dann praktisch keine Leistung mehr.\n\nDer Unterschied zum älteren **Konstantstromsystem** ist erheblich: Dort fördert eine Zahnradpumpe unabhängig vom Bedarf ständig die volle Menge; alles, was nicht gebraucht wird, geht über das Druckbegrenzungsventil zurück in den Tank und wird dabei vollständig in Wärme umgewandelt. Das kostet Kraftstoff und heizt das Öl auf.\n\nDer zweite große Vorteil ist die **lastunabhängige Bewegung**. Weil der Differenzdruck geregelt wird, fährt ein Zylinder bei gleicher Hebelstellung immer gleich schnell — egal ob er schwer oder leicht belastet ist. Bei **Load Sensing mit Druckwaagen** (LUDV) lassen sich zudem mehrere Verbraucher gleichzeitig proportional ansteuern, ohne dass der leichter belastete das gesamte Öl abzieht. Genau das braucht man beim Frontlader, wenn Heben und Kippen zusammenlaufen sollen.\n\nIn modernen Traktoren ist die Load-Sensing-Hydraulik mit Pumpenleistungen von 110 bis über 220 l/min Standard und Voraussetzung für anspruchsvolle Anbaugeräte.",
    "related": [
      "hydrostat",
      "cvt-prevodovka",
      "powershift",
      "auto-steering"
    ],
    "externalUrl": "https://de.wikipedia.org/wiki/Load-Sensing",
    "externalLabel": "Wikipedia: Load-Sensing",
    "faq": [
      {
        "q": "Wie funktioniert Load-Sensing-Hydraulik?",
        "a": "Eine Steuerleitung meldet den Lastdruck an die Verstellpumpe, die daraufhin genau den benötigten Ölstrom fördert."
      },
      {
        "q": "Welche Vorteile bietet Load Sensing?",
        "a": "Deutlich geringerer Leistungsbedarf und Ölerwärmung sowie lastunabhängige, feinfühlige Bewegungen mehrerer Verbraucher gleichzeitig."
      }
    ]
  },
  {
    "slug": "intercooler",
    "term": "Ladeluftkühler",
    "alias": [
      "Intercooler",
      "Zwischenkühler"
    ],
    "kategorie": "pohon",
    "shortDef": "Der Ladeluftkühler kühlt die vom Turbolader verdichtete Luft, bevor sie in den Motor gelangt.",
    "longDef": "Beim Verdichten im Turbolader erwärmt sich die Ansaugluft physikalisch bedingt stark — Austrittstemperaturen von 150 bis 200 °C sind normal. Warme Luft ist dünner, enthält also weniger Sauerstoff je Volumen. Der **Ladeluftkühler** senkt die Temperatur vor dem Einlass wieder auf 40 bis 60 °C und erhöht damit die Luftmasse im Zylinder erheblich.\n\nDaraus folgen drei Effekte: **mehr Leistung** bei gleichem Hubraum, weil mehr Kraftstoff sauber verbrannt werden kann; **geringere thermische Belastung** von Kolben, Ventilen und Turbolader; und **weniger Stickoxide**, weil die Verbrennungsspitzentemperatur sinkt. Der letzte Punkt ist der Grund, warum ohne Ladeluftkühlung die Abgasstufen der Reihe **Stage V** überhaupt nicht erreichbar wären.\n\nGebaut wird er meist als **Luft-Luft-Kühler** vor dem Wasserkühler im Kühlerpaket. In der Landtechnik ist dieses Paket aus Ladeluft-, Wasser-, Öl- und Klimakühler ein Wartungspunkt ersten Ranges: Spreu, Staub und Häckselgut setzen die Lamellen zu und lassen die Temperaturen steigen. Umkehrlüfter, die zyklisch die Drehrichtung wechseln und das Paket freiblasen, gehören deshalb bei Erntemaschinen zur Standardausstattung.\n\nSiehe auch [[turbodmychadlo]], [[vgt-turbo]] und [[emisni-normy-stage]].",
    "related": [
      "vgt-turbo",
      "cvt-prevodovka",
      "common-rail",
      "emisni-normy-stage"
    ],
    "externalUrl": "https://de.wikipedia.org/wiki/Ladeluftk%C3%BChler",
    "externalLabel": "Wikipedia: Ladeluftkühler",
    "faq": [
      {
        "q": "Wozu dient ein Ladeluftkühler?",
        "a": "Er kühlt die vom Turbolader verdichtete Luft, wodurch mehr Sauerstoff in den Zylinder gelangt und Leistung sowie Verbrennungsqualität steigen."
      },
      {
        "q": "Worin unterscheiden sich Luft-Luft- und Wasser-Ladeluftkühler?",
        "a": "Der Luft-Luft-Kühler nutzt den Fahrtwind, der wassergekühlte einen eigenen Kühlkreislauf — dieser reagiert schneller und baut kompakter."
      }
    ]
  },
  {
    "slug": "vgt-turbo",
    "term": "Turbolader mit variabler Turbinengeometrie (VTG)",
    "alias": [
      "VTG",
      "VGT",
      "variable Turbinengeometrie"
    ],
    "kategorie": "pohon",
    "shortDef": "Der VTG-Lader verstellt die Leitschaufeln der Turbine und liefert dadurch über den gesamten Drehzahlbereich den passenden Ladedruck.",
    "longDef": "Beim Turbolader mit variabler Turbinengeometrie sind vor dem Turbinenrad verstellbare **Leitschaufeln** angeordnet. Bei niedriger Drehzahl schließen sie und verengen den Querschnitt: Das Abgas strömt schneller und mit steilerem Winkel auf die Turbine, die dadurch schon bei geringem Massenstrom hochdreht. Bei hoher Drehzahl öffnen sie und geben den vollen Querschnitt frei, damit der Abgasgegendruck nicht überhandnimmt.\n\nDamit löst der VTG-Lader den klassischen Zielkonflikt: Eine kleine Turbine spricht früh an, begrenzt aber die Nennleistung; eine große liefert Nennleistung, hat aber ein ausgeprägtes Turboloch. Ein VTG-Lader deckt beides ab und macht das früher übliche **Wastegate** entbehrlich.\n\nFür den Traktor ist das mehr als Komfort. Der Motor liefert schon knapp über Leerlauf ein hohes Drehmoment, was das **Drehmomentplateau** breit macht und Motordrehzahlabsenkung überhaupt erst praktikabel: Arbeiten bei 1.400 bis 1.600 min⁻¹ statt bei Nenndrehzahl spart merklich Kraftstoff. Zusätzlich lässt sich über die Schaufelstellung gezielt Abgasgegendruck aufbauen — nötig für die Abgasrückführung und für die Regeneration des Partikelfilters.\n\nDer Preis ist Komplexität: Die Verstellmechanik arbeitet in heißem, rußhaltigem Abgas und kann verkoken oder festgehen. Regelmäßiger Ölwechsel und das Vermeiden von sofortigem Abstellen nach Volllast verlängern die Lebensdauer deutlich.",
    "related": [
      "intercooler",
      "common-rail",
      "emisni-normy-stage",
      "auto-steering"
    ],
    "externalUrl": "https://de.wikipedia.org/wiki/Turbolader",
    "externalLabel": "Wikipedia: Turbolader",
    "faq": [
      {
        "q": "Wie funktioniert variable Turbinengeometrie?",
        "a": "Verstellbare Leitschaufeln verändern den Anströmquerschnitt der Turbine — eng bei niedriger Drehzahl für schnellen Druckaufbau, weit bei hoher Drehzahl gegen Abgasgegendruck."
      },
      {
        "q": "Welche Vorteile hat VTG gegenüber einem festen Turbolader?",
        "a": "Früher Ladedruck ohne Turboloch bei zugleich voller Nennleistung, dazu ein breites Drehmomentplateau und Unterstützung von Abgasrückführung und Filterregeneration."
      }
    ]
  },
  {
    "slug": "posilovac-rizeni",
    "term": "Hydraulische Lenkung",
    "alias": [
      "Servolenkung",
      "Lenkhydraulik",
      "Orbitrol"
    ],
    "kategorie": "pohon",
    "shortDef": "Die hydraulische Lenkung überträgt die Lenkbewegung über Öldruck statt mechanisch und macht schwere Maschinen überhaupt erst lenkbar.",
    "longDef": "Beim Traktor ist die Lenkung heute durchweg **hydrostatisch**: Zwischen Lenkrad und Achse gibt es keine mechanische Verbindung mehr. Das Lenkrad treibt eine Dosierpumpe — das Lenkorbitrol —, die Öl proportional zum Drehwinkel zu den Lenkzylindern schickt. Das ist mehr als eine Kraftunterstützung wie in der Pkw-Servolenkung; ohne Öldruck steht die Lenkung.\n\nDeshalb schreibt die Bauartzulassung eine **Notlenkeigenschaft** vor: Fällt der Motor aus, muss sich das Fahrzeug noch mit erhöhtem, aber begrenztem Kraftaufwand lenken lassen. Das Orbitrol arbeitet dann als von Hand angetriebene Pumpe.\n\nDer eigentliche Gewinn liegt in der Freiheit der Anordnung: Weil nur Schläuche verlegt werden müssen, sind Knicklenkung, Allradlenkung und Hundegang konstruktiv überhaupt erst möglich. Und es ist die Voraussetzung für **automatische Lenksysteme** — ein elektrohydraulisches Ventil greift direkt in denselben Ölkreis ein, weshalb sich Spurführung ohne Umbau des Lenkgestänges nachrüsten lässt. Siehe [[auto-steering]].",
    "related": [
      "load-sensing",
      "cvt-prevodovka",
      "auto-steering",
      "teleskopicky-manipulator"
    ],
    "externalUrl": "https://de.wikipedia.org/wiki/Servolenkung",
    "externalLabel": "Wikipedia: Servolenkung",
    "faq": [
      {
        "q": "Wie funktioniert eine hydraulische Lenkung?",
        "a": "Das Lenkrad treibt eine Dosierpumpe, die Öl proportional zum Drehwinkel an die Lenkzylinder schickt — eine mechanische Verbindung zur Achse gibt es nicht."
      },
      {
        "q": "Was passiert bei Motorausfall?",
        "a": "Das Lenkorbitrol arbeitet als Handpumpe weiter; die vorgeschriebene Notlenkeigenschaft erlaubt das Lenken mit erhöhtem Kraftaufwand."
      }
    ]
  },
  {
    "slug": "predni-vyvodovy-hridel",
    "term": "Frontzapfwelle",
    "alias": [
      "vordere Zapfwelle",
      "Front-PTO"
    ],
    "kategorie": "pohon",
    "shortDef": "Die Frontzapfwelle überträgt die Motorleistung nach vorn auf Anbaugeräte am Fronthubwerk.",
    "longDef": "Die Frontzapfwelle führt die Motorleistung über einen eigenen Abtrieb an der Vorderseite des Traktors zu Geräten am Fronthubwerk. Sie dreht genormt mit 1.000 min⁻¹ und läuft — anders als die Heckzapfwelle — im Uhrzeigersinn von vorn gesehen, was bei der Auswahl der Gelenkwelle zu beachten ist.\n\nIhr eigentlicher Zweck ist die **Kombination von Arbeitsgängen**: Frontmähwerk und Heckmähwerk-Kombination in einer Überfahrt, Frontmulcher, kommunal die Schneefräse, die Kehrmaschine oder das Schneidwerk. In der Grünfutterernte bringt eine Front-Heck-Kombination die Flächenleistung fast auf das Doppelte, ohne dass ein zweiter Schlepper nötig wäre.\n\nTechnisch ist der Antrieb aufwendig, weil die Leistung an Motor und Vorderachse vorbei nach vorn geführt werden muss. Nachrüsten ist möglich, aber teuer; ab Werk bestellt ist sie deutlich günstiger. Zu prüfen sind die zulässige Vorderachslast — Fronthubwerk plus schweres Gerät gehen schnell an die Grenze — sowie eine ausreichend dimensionierte Rutschkupplung in der Gelenkwelle.\n\nSicherheitstechnisch gilt dasselbe wie hinten: Der Zapfwellenschutz muss vollständig und die Gelenkwelle mit intaktem Schutzrohr und gesicherter Kette montiert sein. Siehe auch [[pto]].",
    "related": [
      "load-sensing",
      "teleskopicky-manipulator",
      "celni-nakladac",
      "auto-steering"
    ],
    "externalUrl": "https://de.wikipedia.org/wiki/Zapfwelle",
    "externalLabel": "Wikipedia: Zapfwelle",
    "faq": [
      {
        "q": "Wozu dient die Frontzapfwelle?",
        "a": "Sie treibt Anbaugeräte am Fronthubwerk an, etwa Frontmähwerke, Mulcher oder kommunale Geräte."
      },
      {
        "q": "Worin unterscheiden sich Front- und Heckzapfwelle?",
        "a": "Die Frontzapfwelle sitzt vorn, dreht in der Gegenrichtung und läuft genormt mit 1.000 min⁻¹; die Heckzapfwelle bietet meist mehrere Drehzahlstufen und überträgt höhere Leistungen."
      }
    ]
  },
  {
    "slug": "smykovani",
    "term": "Schlupf",
    "alias": [
      "Radschlupf",
      "Triebkraftschlupf"
    ],
    "kategorie": "agrotechnika",
    "shortDef": "Schlupf ist der Anteil der Radumdrehung, der nicht in Vortrieb umgesetzt wird — zu wenig kostet Zugkraft, zu viel kostet Diesel und Boden.",
    "longDef": "Schlupf bezeichnet die Differenz zwischen der theoretischen Wegstrecke aus der Radumdrehung und der tatsächlich zurückgelegten Strecke, angegeben in Prozent. Ein Rad, das sich dreht ohne voranzukommen, hat 100 % Schlupf.\n\nDer wichtigste und am häufigsten missverstandene Punkt: **Schlupf ist nicht per se schlecht.** Der Reifen überträgt seine maximale Zugkraft erst bei einem gewissen Schlupf, weil sich die Stollen dabei in den Boden eingraben. Der **optimale Bereich liegt bei schwerer Zugarbeit zwischen 8 und 15 %**. Wer darunter bleibt, hat den Traktor zu schwer ballastiert und schleppt unnötiges Gewicht durchs Feld; wer darüber liegt, verbrennt Diesel für nichts und schmiert die Bodenoberfläche.\n\n**Was den Schlupf senkt:** niedrigerer Reifeninnendruck als der wichtigste Hebel, denn er vergrößert die Aufstandsfläche; ausreichende, aber nicht übertriebene Ballastierung; Zwillingsräder oder Breitreifen; Allradantrieb; und trockener, tragfähiger Boden.\n\nGemessen wird er von der Traktorelektronik aus dem Vergleich von Radar-Fahrgeschwindigkeit über Grund und Raddrehzahl. Viele Traktoren zeigen ihn im Terminal an oder regeln über die Zugkraftregelung des Hubwerks automatisch die Arbeitstiefe, sobald der eingestellte Grenzwert überschritten wird.",
    "related": [
      "load-sensing",
      "auto-steering",
      "hloubkove-kypreni",
      "predsetova-priprava"
    ],
    "externalUrl": "https://de.wikipedia.org/wiki/Schlupf_(Fahrzeugtechnik)",
    "externalLabel": "Wikipedia: Schlupf",
    "faq": [
      {
        "q": "Was ist Radschlupf beim Traktor?",
        "a": "Der Anteil der Radumdrehung, der nicht in Vortrieb umgesetzt wird — die Differenz zwischen theoretischer und tatsächlicher Wegstrecke."
      },
      {
        "q": "Wie hoch sollte der Schlupf sein?",
        "a": "Bei schwerer Zugarbeit sind 8 bis 15 % optimal; weniger bedeutet unnötigen Ballast, mehr bedeutet Kraftstoffverlust und Bodenschmieren."
      }
    ]
  },
  {
    "slug": "valeni",
    "term": "Walzen",
    "alias": [
      "Rückverfestigen",
      "Anwalzen"
    ],
    "kategorie": "agrotechnika",
    "shortDef": "Das Walzen verfestigt die Bodenoberfläche nach der Saat und stellt den Kapillaranschluss des Saatkorns her.",
    "longDef": "Beim Walzen wird die Bodenoberfläche mit einer Walze angedrückt. Der eigentliche Zweck ist nicht das Einebnen, sondern der **Kapillaranschluss**: Erst wenn das Saatkorn festen Kontakt zum Boden hat, kann Wasser aus tieferen Schichten nach oben zum Korn nachziehen. Auf einem zu lockeren Saatbett verdorrt der Keimling trotz Bodenfeuchte im Untergrund.\n\nWeitere Wirkungen sind das Andrücken von Steinen — wichtig vor der Mähdrusch- und der Futterernte, damit Steine nicht ins Schneidwerk geraten —, das Einebnen für einen ruhigen Maschinenlauf und die Frostschutzwirkung bei Wintergetreide, weil angedrückte Pflanzen weniger aufgefroren werden.\n\n**Bauarten**: Die glatte Walze verdichtet flächig, wird aber bei Nässe schmierig; die **Cambridge-Ringwalze** hinterlässt eine gerippte Oberfläche, die Erosion und Verschlämmung bremst; die **Prismenwalze** verfestigt streifenweise tiefer. Im Grünland dient das Frühjahrswalzen dem Andrücken der Grasnarbe nach dem Winter und dem Einebnen von Maulwurfshügeln — Erde in der Silage bedeutet Buttersäurebakterien und damit verdorbene Gärung.\n\n**Nicht walzen** sollte man bei zu nassem Boden — dann verschlämmt die Oberfläche und es entsteht eine Kruste, die den Aufgang behindert.",
    "related": [
      "predsetova-priprava",
      "setove-luzko",
      "utuzeni-pudy",
      "diskovy-podmitac"
    ],
    "externalUrl": "https://de.wikipedia.org/wiki/Walze_(Landwirtschaft)",
    "externalLabel": "Wikipedia: Walze",
    "faq": [
      {
        "q": "Wozu dient das Walzen?",
        "a": "Es stellt den Kapillaranschluss des Saatkorns her, ebnet die Oberfläche ein und drückt Steine an."
      },
      {
        "q": "Wann wird gewalzt?",
        "a": "Meist unmittelbar nach der Saat sowie im Frühjahr im Grünland und bei Wintergetreide nach dem Auffrieren."
      }
    ]
  },
  {
    "slug": "vysevek",
    "term": "Saatstärke",
    "alias": [
      "Aussaatmenge",
      "Saatmenge",
      "Körner je Quadratmeter"
    ],
    "kategorie": "agrotechnika",
    "shortDef": "Die Saatstärke ist die ausgebrachte Saatgutmenge je Flächeneinheit — richtig angegeben in Körnern je Quadratmeter, nicht in Kilogramm je Hektar.",
    "longDef": "Die Saatstärke bestimmt die angestrebte Bestandesdichte. Fachlich korrekt wird sie in **Körnern je Quadratmeter** angegeben, nicht in Kilogramm je Hektar — denn die nötige Kilogrammzahl hängt von der Tausendkornmasse und der Keimfähigkeit ab, die von Partie zu Partie erheblich schwanken.\n\nDie Umrechnung lautet:\n\n**kg/ha = (Körner/m² × TKM in Gramm) ÷ (Keimfähigkeit in % × 10)**\n\nBei 320 Körnern/m², einer Tausendkornmasse von 45 g und 95 % Keimfähigkeit ergeben sich rund 152 kg/ha. Dieselben 320 Körner/m² bei einer TKM von 52 g verlangen dagegen schon 175 kg/ha — wer stur nach Kilogramm sät, sät je nach Partie 15 % zu dünn oder zu dicht.\n\n**Orientierungswerte in Mitteleuropa**: Winterweizen 280 bis 380 Körner/m² je nach Saatzeit, Wintergerste 260 bis 320, Winterraps 30 bis 50 als Einzelkornsaat, Körnermais 7 bis 9 Pflanzen/m², Zuckerrüben rund 1,1 Einheiten/ha.\n\nDie **Saatzeit** ist der wichtigste Korrekturfaktor: Je später gesät wird, desto weniger Zeit bleibt für die Bestockung, desto höher muss die Saatstärke sein. Umgekehrt bestockt Weizen bei Frühsaat kräftig und braucht deutlich weniger Körner — dünne Frühsaaten sind zudem gesünder und standfester. Über **teilflächenspezifische Saat** lässt sich die Menge zusätzlich nach Bodengüte variieren.",
    "related": [
      "setove-luzko",
      "predsetova-priprava",
      "pneumaticky-seci-stroj",
      "osevni-postup"
    ],
    "externalUrl": "https://de.wikipedia.org/wiki/Aussaat",
    "externalLabel": "Wikipedia: Aussaat",
    "faq": [
      {
        "q": "Wie wird die Saatstärke berechnet?",
        "a": "kg/ha = (Körner je m² × Tausendkornmasse in g) ÷ (Keimfähigkeit in % × 10)."
      },
      {
        "q": "Warum ist die richtige Saatstärke wichtig?",
        "a": "Sie bestimmt die Bestandesdichte und damit Ertrag, Standfestigkeit und Krankheitsdruck — zu dicht führt zu Lager und Pilzbefall, zu dünn zu Ertragsverlust."
      }
    ]
  },
  {
    "slug": "hloubkove-kypreni",
    "term": "Tiefenlockerung",
    "alias": [
      "Untergrundlockerung",
      "Tieflockern"
    ],
    "kategorie": "agrotechnika",
    "shortDef": "Die Tiefenlockerung bricht Verdichtungen unterhalb der Bearbeitungstiefe auf, ohne den Boden zu wenden.",
    "longDef": "Bei der Tiefenlockerung ziehen schmale, kräftige Zinken in 35 bis 60 cm Tiefe durch den Boden und sprengen verdichtete Schichten auf, ohne die Bodenhorizonte zu vermischen. Klassische Anlässe sind Pflugsohlen, Fahrspurverdichtungen und Bearbeitungssohlen nach jahrelang gleicher Arbeitstiefe.\n\nDrei Bedingungen entscheiden über Erfolg oder Fehlschlag:\n1. **Der Boden muss trocken sein** — und zwar bis unter die Bearbeitungstiefe. Im feuchten Zustand wird die Scholle nur verschmiert und geschnitten statt gesprengt; der Schaden ist dann größer als der Nutzen\n2. **Die Verdichtung muss tatsächlich vorhanden sein** — nachgewiesen mit dem Spaten in einem Bodenprofil oder mit dem Penetrometer. Tiefenlockerung auf Verdacht kostet 20 bis 40 l Diesel je Hektar für nichts\n3. **Der Erfolg muss gesichert werden** — ein gelockerter Unterboden ist zunächst instabil. Ohne tiefwurzelnde Folgekultur und ohne konsequente Vermeidung schwerer Überfahrten sackt er innerhalb von ein bis zwei Jahren wieder zusammen, oft schlimmer als zuvor\n\nDie Tiefenlockerung gehört zu den zugkraftintensivsten Arbeiten überhaupt und verlangt schwere Schlepper mit entsprechender Ballastierung. Wirtschaftlich ist sie deshalb kein Routineverfahren, sondern eine gezielte Sanierungsmaßnahme.\n\nDie **biologische Alternative** ist billiger und nachhaltiger: Tiefwurzelnde Zwischenfrüchte wie Ölrettich, Lupine und Luzerne durchdringen Verdichtungen mit ihren Pfahlwurzeln und hinterlassen stabile, bis in den Unterboden reichende Bioporen — Wege, die Folgekulturen sofort nutzen. Siehe auch [[utuzeni-pudy]].",
    "related": [
      "predsetova-priprava",
      "utuzeni-pudy",
      "orba",
      "diskovy-podmitac"
    ],
    "externalUrl": "https://de.wikipedia.org/wiki/Tiefenlockerung",
    "externalLabel": "Wikipedia: Tiefenlockerung",
    "faq": [
      {
        "q": "Wozu dient die Tiefenlockerung?",
        "a": "Sie bricht Verdichtungen unterhalb der üblichen Bearbeitungstiefe auf und stellt Wasserdurchlässigkeit und Durchwurzelbarkeit wieder her."
      },
      {
        "q": "Worin unterscheiden sich Tiefenlockerung und Pflügen?",
        "a": "Die Tiefenlockerung lockert tief, ohne zu wenden; der Pflug wendet und mischt, arbeitet aber flacher."
      },
      {
        "q": "Wann ist Tiefenlockerung sinnvoll?",
        "a": "Nur bei nachgewiesener Verdichtung und bis in die Arbeitstiefe abgetrocknetem Boden — sonst richtet sie mehr Schaden als Nutzen an."
      }
    ]
  },
  {
    "slug": "predsetova-priprava",
    "term": "Saatbettbereitung",
    "alias": [
      "Saatbettvorbereitung",
      "Frühjahrsbestellung"
    ],
    "kategorie": "agrotechnika",
    "shortDef": "Die Saatbettbereitung ist die flache Bearbeitung unmittelbar vor der Saat, die das Saatbett für Keimung und Aufgang herstellt.",
    "longDef": "Die Saatbettbereitung ist der letzte Arbeitsgang vor der Saat. Sie arbeitet flach — in der Regel nur auf Saattiefe — und erzeugt das für die Kultur passende Saatbett.\n\nEingesetzt werden Kreiselegge, Federzinkenegge, Saatbettkombination oder — bei Mulchsaat — nur der Säschar selbst. Die **Kreiselegge** krümelt aktiv und ist auf schweren Böden unverzichtbar, kostet aber Zapfwellenleistung und zerstört bei zu intensiver Fahrweise das Gefüge; die **passive Saatbettkombination** ist sparsamer, verlangt aber gare Böden.\n\nDie wichtigste Regel lautet: **so flach wie möglich.** Jeder Zentimeter mehr trocknet den Boden zusätzlich aus. Im Frühjahr ist Wasser der begrenzende Faktor, nicht die Feinkrümeligkeit — ein zu fein gearbeitetes Saatbett verschlämmt beim nächsten Regen und bildet eine Kruste.\n\nDas Ideal ist ein Saatbett mit **feiner Krume unten und gröberen Aggregaten obenauf**: unten der feste, feuchte Anschluss für das Korn, oben eine grobe Schicht als Verdunstungsschutz und Erosionsbremse. Genau dieses Profil erzeugt die Kombination aus Zinkenwerkzeug und Nachlaufwalze in einer Überfahrt.\n\nIn der **Mulchsaat** entfällt die separate Saatbettbereitung ganz — gesät wird direkt in die von Zwischenfrucht oder Stoppel bedeckte Fläche, was Wasser und Diesel spart und die Erosion deutlich senkt.",
    "related": [
      "setove-luzko",
      "valeni",
      "diskovy-podmitac",
      "hloubkove-kypreni"
    ],
    "externalUrl": "https://de.wikipedia.org/wiki/Saatbett",
    "externalLabel": "Wikipedia: Saatbett",
    "faq": [
      {
        "q": "Was gehört zur Saatbettbereitung?",
        "a": "Die flache Bearbeitung unmittelbar vor der Saat mit Kreiselegge, Federzinkenegge oder Saatbettkombination, oft in Verbindung mit einer Nachlaufwalze."
      },
      {
        "q": "Warum ist sie wichtig?",
        "a": "Sie stellt die Bedingungen für gleichmäßige Keimung her — feiner, feuchter Anschluss unten, grobe Schutzschicht oben."
      }
    ]
  },
  {
    "slug": "setove-luzko",
    "term": "Saatbett",
    "alias": [
      "Saathorizont",
      "Ablagehorizont"
    ],
    "kategorie": "agrotechnika",
    "shortDef": "Das Saatbett ist die Bodenschicht, in die das Saatgut abgelegt wird — sie entscheidet über Keimung und Feldaufgang.",
    "longDef": "Das Saatbett ist die oberste, für die Saat vorbereitete Bodenschicht. Vier Bedingungen müssen zusammenkommen, damit ein Korn keimt: **Wasser, Wärme, Luft und Bodenschluss**. Fehlt eine davon, hilft die beste Sätechnik nichts.\n\nEntscheidend ist die **gleichmäßige Ablagetiefe**. Ungleiche Tiefe bedeutet ungleichen Aufgang, ungleiche Entwicklungsstadien und damit einen Bestand, der weder einheitlich zu düngen noch einheitlich zu behandeln oder zu ernten ist. Richtwerte sind 2 bis 4 cm bei Getreide, 1,5 bis 2 cm bei Raps, 4 bis 6 cm bei Mais und 2 bis 3 cm bei Zuckerrüben.\n\nDer klassische Fehler ist das **zu feine Saatbett**. Es sieht ordentlich aus, verschlämmt aber beim ersten Starkregen und bildet eine Kruste, die zarte Keimlinge — bei Raps und Rüben — nicht durchstoßen. Gröbere Aggregate an der Oberfläche sind hier ausdrücklich erwünscht.\n\nDer zweite häufige Fehler ist die Ablage in eine **trockene Schicht**. Wird bei Trockenheit zu flach gesät, liegt das Korn im Staub und keimt erst mit dem nächsten Niederschlag — teils ungleichmäßig über Wochen verteilt. Dann ist es besser, ein bis zwei Zentimeter tiefer in den feuchten Horizont zu säen.",
    "related": [
      "predsetova-priprava",
      "valeni",
      "utuzeni-pudy",
      "vysevek"
    ],
    "externalUrl": "https://de.wikipedia.org/wiki/Saatbett",
    "externalLabel": "Wikipedia: Saatbett",
    "faq": [
      {
        "q": "Wie tief soll das Saatgut abgelegt werden?",
        "a": "Richtwerte sind 2 bis 4 cm bei Getreide, 1,5 bis 2 cm bei Raps, 4 bis 6 cm bei Mais — entscheidend ist die Gleichmäßigkeit."
      },
      {
        "q": "Warum ist das Saatbett wichtig?",
        "a": "Es liefert Wasser, Wärme, Luft und Bodenschluss — die vier Voraussetzungen für gleichmäßige Keimung."
      }
    ]
  },
  {
    "slug": "kapilarita-pudy",
    "term": "Kapillarität des Bodens",
    "alias": [
      "Kapillarwasser",
      "kapillarer Aufstieg"
    ],
    "kategorie": "agrotechnika",
    "shortDef": "Die Kapillarität ist die Fähigkeit des Bodens, Wasser in feinen Poren entgegen der Schwerkraft nach oben zu leiten.",
    "longDef": "In feinen Bodenporen steigt Wasser durch Adhäsion an den Porenwänden und Kohäsion der Wassermoleküle gegen die Schwerkraft auf. Je feiner die Poren, desto höher der Aufstieg — im Sandboden nur wenige Dezimeter, im Schluffboden über zwei Meter. Deshalb sind **Schluff- und Lössböden die ertragssichersten**: Sie liefern Pflanzen auch in Trockenphasen noch Wasser aus dem Untergrund nach.\n\nAckerbaulich wird die Kapillarität in beide Richtungen genutzt.\n\n**Erhalten will man sie unter dem Saatkorn.** Nur ein rückverfestigter Anschluss lässt Wasser zum Korn nachziehen — genau das leistet die Nachlaufwalze, siehe [[valeni]].\n\n**Unterbrechen will man sie an der Oberfläche.** Eine durchgehende Kapillare bis nach oben pumpt Bodenwasser an die Luft, wo es verdunstet. Die flache Stoppelbearbeitung unmittelbar nach der Ernte kappt diese Verbindung und bewahrt Bodenfeuchte für die Folgekultur — das ist ihr Hauptzweck, nicht das Einmischen des Strohs.\n\nGestört wird die Kapillarität durch Verdichtungen und Bearbeitungssohlen: Sie unterbrechen den Porenzusammenhang, sodass das Wasser im Unterboden für die Wurzel unerreichbar bleibt. Siehe [[utuzeni-pudy]].",
    "related": [
      "utuzeni-pudy",
      "orba",
      "predsetova-priprava",
      "valeni"
    ],
    "externalUrl": "https://de.wikipedia.org/wiki/Kapillarit%C3%A4t",
    "externalLabel": "Wikipedia: Kapillarität",
    "faq": [
      {
        "q": "Was ist Kapillarität im Boden?",
        "a": "Die Fähigkeit, Wasser in feinen Poren entgegen der Schwerkraft nach oben zu leiten."
      },
      {
        "q": "Wie nutzt der Ackerbau die Kapillarität?",
        "a": "Unter dem Saatkorn wird sie durch Rückverfestigung erhalten, an der Oberfläche durch flache Stoppelbearbeitung unterbrochen, um Verdunstung zu bremsen."
      }
    ]
  },
  {
    "slug": "mineralizace-pudy",
    "term": "Mineralisierung",
    "alias": [
      "Stickstoffmineralisierung",
      "Umsetzung organischer Substanz"
    ],
    "kategorie": "agrotechnika",
    "shortDef": "Mineralisierung ist der mikrobielle Abbau organischer Substanz zu pflanzenverfügbaren mineralischen Nährstoffen.",
    "longDef": "Bei der Mineralisierung bauen Bodenmikroorganismen organische Substanz ab und setzen dabei Kohlendioxid, Wasser und **pflanzenverfügbare mineralische Nährstoffe** frei — beim Stickstoff über Ammonifikation zu Ammonium und weiter über Nitrifikation zu Nitrat.\n\nDas Tempo hängt vor allem von drei Faktoren ab: **Temperatur** — die Umsetzung verdoppelt sich grob je 10 °C —, **Bodenfeuchte** und dem **Kohlenstoff-Stickstoff-Verhältnis** des Materials. Unter einem C/N-Verhältnis von etwa 20 wird netto Stickstoff freigesetzt, darüber binden die Mikroorganismen ihn zunächst selbst: Diese **Stickstoff-Immobilisierung** erklärt, warum nach dem Einarbeiten von Stroh mit einem C/N-Verhältnis um 80 die Folgekultur zunächst Stickstoff vermisst.\n\nAckerbaulich ist das die zentrale Rechengröße der Düngeplanung. Aus Humus, Ernte- und Zwischenfruchtrückständen sowie organischer Düngung stammen erhebliche Stickstoffmengen, die im Herbst und Frühjahr freigesetzt werden. Die **Düngeverordnung** verlangt deshalb ausdrücklich, die Nachlieferung aus dem Boden und aus organischer Düngung im Düngebedarf anzurechnen.\n\nDas Risiko liegt im Herbst: Warme, feuchte Böden mineralisieren kräftig, während keine Kultur den Stickstoff aufnimmt — das freigesetzte Nitrat wird über Winter ausgewaschen. Genau dagegen wirken Zwischenfrüchte und Untersaaten, die den Stickstoff aufnehmen und im Frühjahr wieder abgeben.",
    "related": [
      "kapilarita-pudy",
      "organicka-hmota",
      "eroze-pudy",
      "orba"
    ],
    "externalUrl": "https://de.wikipedia.org/wiki/Mineralisation_(Boden)",
    "externalLabel": "Wikipedia: Mineralisation",
    "faq": [
      {
        "q": "Was ist Mineralisierung im Boden?",
        "a": "Der mikrobielle Abbau organischer Substanz zu mineralischen, pflanzenverfügbaren Nährstoffen."
      },
      {
        "q": "Wovon hängt die Mineralisierung ab?",
        "a": "Vor allem von Bodentemperatur, Feuchte, Durchlüftung und dem C/N-Verhältnis der organischen Substanz."
      },
      {
        "q": "Warum ist die Mineralisierung wichtig?",
        "a": "Sie liefert einen erheblichen Teil des Pflanzenstickstoffs und muss deshalb im Düngebedarf angerechnet werden."
      }
    ]
  },
  {
    "slug": "utuzeni-pudy",
    "term": "Bodenverdichtung",
    "alias": [
      "Verdichtung",
      "Bodendruck",
      "Unterbodenverdichtung"
    ],
    "kategorie": "agrotechnika",
    "shortDef": "Bodenverdichtung ist die Zusammenpressung des Bodengefüges durch Befahren oder Tritt; sie zerstört die groben Poren und behindert Wasser, Luft und Wurzeln.",
    "longDef": "Bodenverdichtung entsteht, wenn der Druck von Reifen, Ketten oder Klauen die Tragfähigkeit des Bodens übersteigt. Zuerst werden die **Grobporen** zusammengedrückt — genau jene Poren, die Wasser ableiten, Luft führen und den Wurzeln Wege bahnen. Das Ergebnis ist ein Boden, der bei Regen staut und bei Trockenheit hart wird.\n\nZu unterscheiden sind zwei Schäden. Die **Verdichtung der Krume** lässt sich durch Bearbeitung und Frostgare wieder beheben. Die **Unterbodenverdichtung** unterhalb der Bearbeitungstiefe ist dagegen praktisch **irreversibel** — sie ist mit vertretbarem Aufwand nicht mehr zu lösen und wirkt über Jahrzehnte.\n\nEntscheidend ist dabei eine oft missverstandene Regel: Der **Reifeninnendruck** bestimmt, wie stark die Krume leidet, die **Radlast** bestimmt, wie tief der Druck in den Unterboden reicht. Breitere Reifen allein retten den Unterboden also nicht — die Last muss sinken.\n\n**Was wirklich hilft:**\n1. **Bodenfeuchte abwarten** — der weitaus stärkste Hebel; ein Befahren bei zu nassem Boden macht jede Technik zunichte\n2. **Reifeninnendruck absenken**, mit Reifendruckregelanlage feldangepasst auf 0,8 bis 1,2 bar\n3. **Radlast begrenzen**, Zwillingsräder oder Bänder nutzen, Anhängerachsen mehrfach ausführen\n4. **Fahrspuren bündeln** — controlled traffic farming, siehe [[ctf]]\n5. **Gefüge stabilisieren** — Kalkung, Humusaufbau, tiefwurzelnde Zwischenfrüchte wie Ölrettich als biologische Lockerung\n\nRechtlich ist der Schutz vor Verdichtung in Deutschland keine Empfehlung: Das **Bundes-Bodenschutzgesetz** verpflichtet dazu, schädliche Bodenveränderungen zu vermeiden, und die gute fachliche Praxis nennt die Vermeidung von Verdichtungen ausdrücklich.",
    "related": [
      "orba",
      "predsetova-priprava",
      "hloubkove-kypreni",
      "ekoschemata"
    ],
    "externalUrl": "https://de.wikipedia.org/wiki/Bodenverdichtung",
    "externalLabel": "Wikipedia: Bodenverdichtung",
    "faq": [
      {
        "q": "Wodurch entsteht Bodenverdichtung?",
        "a": "Durch Befahren mit hoher Radlast oder zu hohem Reifendruck, vor allem bei zu feuchtem Boden."
      },
      {
        "q": "Welche Folgen hat Bodenverdichtung?",
        "a": "Grobporen werden zerstört, Wasser und Luft kommen nicht mehr durch, Wurzeln stoßen an eine Sperrschicht — Ertragsverluste und Staunässe sind die Folge."
      },
      {
        "q": "Wie lässt sich Bodenverdichtung vermeiden?",
        "a": "Vor allem durch Befahren nur bei tragfähigem Boden, abgesenkten Reifeninnendruck, begrenzte Radlasten und feste Fahrgassen."
      }
    ]
  },
  {
    "slug": "zelene-hnojeni",
    "term": "Gründüngung",
    "alias": [
      "Grünmasse-Düngung",
      "Untersaat als Gründüngung"
    ],
    "kategorie": "agrotechnika",
    "shortDef": "Gründüngung bedeutet, Pflanzen eigens anzubauen und einzuarbeiten, um dem Boden organische Substanz und Nährstoffe zuzuführen.",
    "longDef": "Bei der Gründüngung wird ein Bestand nicht zur Ernte, sondern zur **Einarbeitung in den Boden** angebaut. Genutzt werden vor allem Phacelia, Senf, Ölrettich, Buchweizen sowie Leguminosen wie Kleearten, Wicken und Lupinen — häufig als Mischung, weil unterschiedliche Wurzelsysteme mehr bewirken als jede Art für sich.\n\n**Was Gründüngung leistet:**\n- **Nährstoffe binden** — vor allem Nitrat, das sonst über Winter ausgewaschen würde, und es im Frühjahr wieder freisetzen\n- **Stickstoff sammeln** — Leguminosen binden über die Knöllchenbakterien Luftstickstoff und liefern je nach Bestand 40 bis über 100 kg N je Hektar\n- **Boden lockern** — Ölrettich und Lupine durchwurzeln Verdichtungen und hinterlassen stabile Poren\n- **Erosion verhindern** — eine geschlossene Bodenbedeckung über Winter ist der wirksamste Erosionsschutz überhaupt\n- **Humus aufbauen** und das Bodenleben mit frischer Nahrung versorgen\n- **Unkraut unterdrücken** durch Beschattung\n- **Nematoden bekämpfen** — resistente Ölrettich- und Senfsorten senken den Besatz an Rübenzystennematoden gezielt ab\n\n**Vorsicht bei der Fruchtfolge**: Senf und Ölrettich sind Kreuzblütler wie der Raps und können Kohlhernie und Sklerotinia fördern. In rapsstarken Fruchtfolgen gehören sie deshalb nicht in die Mischung — dort sind Phacelia, Leguminosen und Gräser die bessere Wahl.\n\n**Der agrarpolitische Rahmen**: Zwischenfrüchte und Untersaaten sind in Deutschland an mehreren Stellen verankert — als Bodenbedeckung nach **GLÖZ 6**, als Möglichkeit zur Erfüllung von **GLÖZ 8**, in den Agrarumweltmaßnahmen der Länder sowie in den roten Gebieten der Düngeverordnung, wo nach bestimmten Vorfrüchten Zwischenfrüchte vorgeschrieben sind.\n\nSiehe auch [[mezi-plodiny]], [[organicka-hmota]], [[eroze-pudy]], [[svazenka]].",
    "related": [
      "organicka-hmota",
      "eroze-pudy",
      "osevni-postup",
      "ekoschemata"
    ],
    "externalUrl": "https://de.wikipedia.org/wiki/Gr%C3%BCnd%C3%BCngung",
    "externalLabel": "Wikipedia: Gründüngung",
    "faq": [
      {
        "q": "Wozu dient die Gründüngung?",
        "a": "Sie bindet Restnährstoffe über Winter, baut Humus auf, lockert den Boden, unterdrückt Unkraut und schützt vor Erosion."
      },
      {
        "q": "Welche Pflanzen eignen sich zur Gründüngung?",
        "a": "Phacelia, Senf, Ölrettich und Buchweizen sowie Leguminosen wie Klee, Wicken und Lupinen — meist als Mischung."
      },
      {
        "q": "Worauf ist bei der Fruchtfolge zu achten?",
        "a": "Senf und Ölrettich sind Kreuzblütler wie Raps und können Kohlhernie fördern — in rapsstarken Fruchtfolgen gehören sie nicht in die Mischung."
      }
    ]
  },
  {
    "slug": "strniste",
    "term": "Stoppel",
    "alias": [
      "Stoppelfeld",
      "Stoppelacker",
      "Ernterückstände"
    ],
    "kategorie": "agrotechnika",
    "shortDef": "Die Stoppel sind die nach der Ernte auf dem Feld verbleibenden Halm- und Wurzelreste.",
    "longDef": "Als Stoppel bezeichnet man die stehen gebliebenen Halmreste und die Wurzelmasse nach dem Mähdrusch, zusammen mit dem verteilten Stroh und der Spreu.\n\nDie **Stoppelbearbeitung** unmittelbar nach der Ernte erfüllt vier Aufgaben zugleich:\n1. **Wasser halten** — die Kapillarverbindung zur Oberfläche wird gekappt, siehe [[kapilarita-pudy]]\n2. **Ausfallgetreide und Unkraut zum Keimen bringen**, um es in einem zweiten Gang zu beseitigen — der wirksamste nichtchemische Hebel gegen Ungräser\n3. **Strohrotte fördern** durch flaches Einmischen mit gutem Bodenkontakt\n4. **Krankheitsdruck senken** — Fusarium überdauert auf Maisstoppeln und Getreidestroh; deren Zerkleinerung ist die wichtigste vorbeugende Maßnahme gegen Ährenfusariose in der Folgekultur\n\nDie Faustregel lautet: **so früh und so flach wie möglich**, in einem zweiten Gang tiefer.\n\n**Rechtlich** ist Einiges festgelegt. Das **Abbrennen von Stoppelfeldern ist nach GLÖZ 3 verboten** — abgesehen von eng begrenzten pflanzenschutzfachlichen Ausnahmen. Und nach **GLÖZ 6** ist im Winter eine Mindestbodenbedeckung einzuhalten; stehende Stoppeln zählen dazu, was den Verzicht auf die winterliche Schwarzbrache zusätzlich absichert.\n\nEine späte Bearbeitung kann ökologisch begründet sein: Stoppelbrachen sind wichtige Nahrungsflächen für Feldvögel im Spätsommer.",
    "related": [
      "orba",
      "mulcovac",
      "kapilarita-pudy",
      "predsetova-priprava"
    ],
    "externalUrl": "https://de.wikipedia.org/wiki/Stoppelfeld",
    "externalLabel": "Wikipedia: Stoppelfeld",
    "faq": [
      {
        "q": "Was sind Stoppeln?",
        "a": "Die nach der Ernte auf dem Feld verbleibenden Halm- und Wurzelreste samt Stroh und Spreu."
      },
      {
        "q": "Warum wird die Stoppel bearbeitet?",
        "a": "Um Wasser zu halten, Ausfallsamen zum Keimen zu bringen, die Strohrotte zu fördern und den Krankheitsdruck zu senken."
      },
      {
        "q": "Darf man Stoppeln abbrennen?",
        "a": "Nein — das Abbrennen von Stoppelfeldern ist nach GLÖZ 3 verboten, von eng begrenzten Ausnahmen abgesehen."
      }
    ]
  },
  {
    "slug": "superfosfat",
    "term": "Superphosphat",
    "alias": [
      "Einfachsuperphosphat",
      "Triple-Superphosphat",
      "TSP"
    ],
    "kategorie": "hnojivo",
    "shortDef": "Superphosphat ist ein Phosphordünger aus Rohphosphat und Säure, dessen Phosphat wasserlöslich und damit sofort verfügbar ist.",
    "longDef": "Superphosphat entsteht durch den Aufschluss von Rohphosphat mit Säure. Das **Einfachsuperphosphat** wird mit Schwefelsäure hergestellt und enthält rund 18 % P₂O₅ sowie etwa 11 % Schwefel; das **Triple-Superphosphat** wird mit Phosphorsäure aufgeschlossen und kommt auf 45 bis 46 % P₂O₅, dafür ohne nennenswerten Schwefel.\n\nDer Aufschluss ist der eigentliche Punkt: Rohphosphat selbst ist so schwer löslich, dass Pflanzen es kaum nutzen können. Erst die Umwandlung in wasserlösliches Monocalciumphosphat macht den Phosphor verfügbar.\n\n**Phosphor in der Pflanze** ist der Energieträger — als ATP steckt er in jedem Stoffwechselvorgang — und maßgeblich für Wurzelentwicklung, Blütenbildung und Kornansatz. Mangel zeigt sich an **jungen Pflanzen** durch gehemmtes Wachstum und rötlich-violette Verfärbung, besonders bei Mais in kalten Frühjahren; kalter Boden bremst nämlich sowohl die Nachlieferung als auch die Wurzelaktivität.\n\n**Das große Problem des Phosphors ist die Festlegung.** Anders als Nitrat wandert er kaum, wird aber schnell an Calcium, Eisen und Aluminium gebunden. Die Verfügbarkeit ist bei **pH 6,0 bis 7,0** am höchsten; darunter und darüber sinkt sie deutlich. Kalkung ist deshalb oft wirksamer als eine weitere Phosphorgabe. Gedüngt wird nach Bodenuntersuchung und Gehaltsklasse; die Düngeverordnung begrenzt die Phosphatdüngung bei hohen Bodengehalten ausdrücklich.\n\nHinzu kommt die Rohstofffrage: Phosphat ist endlich und wird überwiegend importiert, weshalb die Rückgewinnung aus Klärschlamm in Deutschland ab bestimmten Anlagengrößen inzwischen gesetzlich verlangt wird.",
    "related": [
      "npk-hnojivo",
      "organicka-hmota",
      "rozmetadlo-hnojiv",
      "pH-pudy"
    ],
    "externalUrl": "https://de.wikipedia.org/wiki/Superphosphat",
    "externalLabel": "Wikipedia: Superphosphat",
    "faq": [
      {
        "q": "Was ist Superphosphat?",
        "a": "Ein Phosphordünger, der durch Aufschluss von Rohphosphat mit Säure entsteht und wasserlösliches, sofort verfügbares Phosphat liefert."
      },
      {
        "q": "Wofür braucht die Pflanze Phosphor?",
        "a": "Als Energieträger im Stoffwechsel sowie für Wurzelentwicklung, Blütenbildung und Kornansatz."
      },
      {
        "q": "Wann ist Phosphor am besten verfügbar?",
        "a": "Bei einem Boden-pH zwischen 6,0 und 7,0 — darunter und darüber wird er festgelegt."
      }
    ]
  },
  {
    "slug": "draselna-sul",
    "term": "Kaliumchlorid (60er Kali)",
    "alias": [
      "Kalisalz",
      "Muriate of Potash",
      "KCl"
    ],
    "kategorie": "hnojivo",
    "shortDef": "Kaliumchlorid ist der mengenmäßig wichtigste Kalidünger mit rund 60 % K₂O — preiswert, aber für chloridempfindliche Kulturen ungeeignet.",
    "longDef": "Kaliumchlorid, im Handel als **60er Kali** bekannt, ist mit rund 60 % K₂O der konzentrierteste und günstigste Kalidünger und deckt den weitaus größten Teil des weltweiten Kalibedarfs. In Deutschland wird es unter anderem in den Werken an Werra und Fulda gefördert.\n\n**Warum Kalium wichtig ist**: Es reguliert den Wasserhaushalt über die Spaltöffnungen, aktiviert zahlreiche Enzyme und steuert den Transport von Assimilaten in die Speicherorgane. Praktisch heißt das: Kaliumversorgte Bestände überstehen Trockenheit und Frost besser, lagern weniger und liefern höhere Zucker- und Stärkegehalte. Mangel zeigt sich zuerst an den **älteren Blättern** als Randnekrose, weil Kalium in der Pflanze verlagert wird.\n\n**Der entscheidende Haken ist das Chlorid.** Für **chloridempfindliche Kulturen** ist Kaliumchlorid ungeeignet oder darf nur weit vor der Saat im Herbst gegeben werden. Dazu zählen Kartoffeln — Chlorid senkt den Stärkegehalt und verschlechtert die Verarbeitungsqualität —, ferner Reben, Tabak, Obst, Beeren und viele Gemüsearten. Hier wird stattdessen **Kaliumsulfat** oder **Patentkali** eingesetzt, siehe [[kalimagnesia]].\n\nFür Getreide, Mais, Zuckerrüben, Raps und Grünland ist Kaliumchlorid dagegen die Standardlösung; Zuckerrüben und Grünland reagieren zudem positiv auf das mitgelieferte Natrium.\n\n**Düngeplanung**: Anders als beim Stickstoff schreibt die Düngeverordnung für Kalium keinen jährlichen Ausgleich vor, sondern eine Düngung nach **Bodenuntersuchung und Gehaltsklasse**. Auf Böden der Klasse C wird die Abfuhr ersetzt, bei A und B aufgedüngt, bei D und E ausgesetzt. Weil Kalium im Boden gebunden wird und kaum auswäscht, sind Vorratsdüngungen über mehrere Jahre möglich — auf leichten Sandböden allerdings nur eingeschränkt.",
    "related": [
      "npk-hnojivo",
      "rozmetadlo-hnojiv",
      "pH-pudy",
      "organicka-hmota"
    ],
    "externalUrl": "https://de.wikipedia.org/wiki/Kaliumchlorid",
    "externalLabel": "Wikipedia: Kaliumchlorid",
    "faq": [
      {
        "q": "Was ist 60er Kali?",
        "a": "Kaliumchlorid mit rund 60 % K₂O — der mengenmäßig wichtigste und günstigste Kalidünger."
      },
      {
        "q": "Wofür wird Kalium in der Pflanze gebraucht?",
        "a": "Für die Regulierung des Wasserhaushalts, die Enzymaktivierung und den Transport von Zucker und Stärke — es verbessert Trockenheits- und Frosttoleranz sowie Standfestigkeit."
      },
      {
        "q": "Für welche Kulturen ist Kaliumchlorid ungeeignet?",
        "a": "Für chloridempfindliche Kulturen wie Kartoffeln, Reben, Tabak, Obst und viele Gemüsearten — dort ist Kaliumsulfat oder Patentkali die richtige Wahl."
      }
    ]
  },
  {
    "slug": "kalimagnesia",
    "term": "Patentkali (Kaliumsulfat mit Magnesium)",
    "alias": [
      "Kalimagnesia",
      "Kaliumsulfat-Magnesium"
    ],
    "kategorie": "hnojivo",
    "shortDef": "Patentkali liefert Kalium, Magnesium und Schwefel in chloridfreier Sulfatform — die Wahl für chloridempfindliche Kulturen.",
    "longDef": "Patentkali ist ein chloridfreier Mehrnährstoffdünger mit rund **30 % K₂O, 10 % MgO und 42 % SO₃**. Alle drei Nährstoffe liegen in wasserlöslicher Sulfatform vor und sind damit sofort pflanzenverfügbar.\n\n**Der entscheidende Unterschied zu [[draselna-sul]]** ist das fehlende Chlorid. Damit ist Patentkali für alle chloridempfindlichen Kulturen geeignet: Kartoffeln, Reben, Obst, Beeren, Gemüse, Tabak und Hopfen. Auch im Ökolandbau ist es als Naturprodukt aus Kalirohsalz zugelassen — dort ist es die wichtigste zugelassene Kaliquelle überhaupt.\n\n**Magnesium** ist das Zentralatom des Chlorophylls; ohne Magnesium keine Photosynthese. Mangel äußert sich an den **älteren Blättern** als Aufhellung zwischen den Blattadern, während die Adern grün bleiben — beim Getreide als perlschnurartige Flecken, beim Mais als Streifen. Besonders gefährdet sind leichte, saure und stark ausgewaschene Böden sowie Böden mit hohem Kaliumangebot, weil Kalium und Magnesium sich bei der Aufnahme gegenseitig behindern.\n\n**Schwefel** ist seit den 1990er-Jahren zum limitierenden Nährstoff geworden. Die Entschwefelung von Kraftwerken und Industrie hat den atmosphärischen Eintrag von rund 50 kg auf wenige Kilogramm je Hektar und Jahr fallen lassen — Schwefel muss seither gedüngt werden, vor allem zu Raps, Getreide und Grünland.\n\nPatentkali ist je Nährstoffeinheit deutlich teurer als 60er Kali. Wirtschaftlich ist es überall dort, wo Chloridempfindlichkeit oder zugleich ein Magnesium- und Schwefelbedarf besteht — im Getreidebau bleibt die Kombination aus 60er Kali und einem schwefelhaltigen Stickstoffdünger meist günstiger.",
    "related": [
      "superfosfat",
      "draselna-sul",
      "dolomiticky-vapenec",
      "npk-hnojivo"
    ],
    "externalUrl": "https://de.wikipedia.org/wiki/Kaliumsulfat",
    "externalLabel": "Wikipedia: Kaliumsulfat",
    "faq": [
      {
        "q": "Wozu dient Patentkali?",
        "a": "Zur gleichzeitigen Versorgung mit Kalium, Magnesium und Schwefel in chloridfreier, sofort verfügbarer Sulfatform."
      },
      {
        "q": "Wann wird Patentkali eingesetzt?",
        "a": "Bei chloridempfindlichen Kulturen wie Kartoffeln, Reben, Obst und Gemüse sowie bei gleichzeitigem Magnesium- und Schwefelbedarf — und im Ökolandbau."
      },
      {
        "q": "Worin unterscheidet sich Patentkali von 60er Kali?",
        "a": "Patentkali ist chloridfrei und liefert zusätzlich Magnesium und Schwefel, enthält dafür weniger Kalium und ist teurer."
      }
    ]
  },
  {
    "slug": "dolomiticky-vapenec",
    "term": "Dolomitkalk",
    "alias": [
      "kohlensaurer Magnesiumkalk",
      "Magnesiumkalk"
    ],
    "kategorie": "hnojivo",
    "shortDef": "Dolomitkalk ist ein Kalkdünger aus gemahlenem Dolomitgestein, der zugleich Calcium und Magnesium liefert.",
    "longDef": "Dolomitkalk wird aus gemahlenem Dolomitgestein gewonnen, einem Doppelcarbonat von Calcium und Magnesium. Handelsüblich sind etwa 30 % CaO und 15 bis 20 % MgO. Er wirkt **langsam, aber lang anhaltend** — anders als Branntkalk, der rasch und heftig wirkt, aber die Bodenstruktur stärker belastet.\n\n**Warum gekalkt wird**: Der pH-Wert steuert praktisch alles im Boden. Er bestimmt die Verfügbarkeit fast aller Nährstoffe — Phosphor ist bei niedrigem pH festgelegt —, die Aktivität der Bodenlebewesen, die Stabilität der Krümelstruktur über die Bildung von Ton-Humus-Komplexen und die Löslichkeit von Aluminium, das im sauren Boden für die Wurzeln giftig wird. Zielwerte liegen je nach Bodenart bei pH 5,5 auf Sand bis 7,0 auf schwerem Ton.\n\nBöden versauern laufend — durch Auswaschung, saure Niederschläge, den Entzug mit der Ernte und besonders durch **physiologisch saure Stickstoffdünger**. Kalkung ist deshalb keine einmalige Sanierung, sondern eine Erhaltungsmaßnahme alle drei bis vier Jahre.\n\n**Der Vorzug des Dolomitkalks** liegt in der Magnesiumfracht. Er ist erste Wahl auf leichten, sauren, magnesiumarmen Standorten und im Grünland. Auf magnesiumreichen Böden ist er dagegen ungeeignet, denn ein Überschuss an Magnesium behindert umgekehrt die Kaliumaufnahme — das Verhältnis der Kationen zueinander zählt, nicht nur der Absolutgehalt.",
    "related": [
      "kalimagnesia",
      "superfosfat",
      "vapneni",
      "pH-pudy"
    ],
    "externalUrl": "https://de.wikipedia.org/wiki/Dolomit",
    "externalLabel": "Wikipedia: Dolomit",
    "faq": [
      {
        "q": "Wozu dient Dolomitkalk?",
        "a": "Er hebt den Boden-pH an und liefert dabei zugleich Calcium und Magnesium."
      },
      {
        "q": "Wann wird Dolomitkalk ausgebracht?",
        "a": "Meist im Herbst auf die Stoppel oder im zeitigen Frühjahr, üblicherweise alle drei bis vier Jahre nach Bodenuntersuchung."
      },
      {
        "q": "Worin unterscheidet er sich von normalem Kalk?",
        "a": "Er enthält zusätzlich Magnesium und ist deshalb auf magnesiumarmen, leichten Böden die bessere Wahl."
      }
    ]
  },
  {
    "slug": "digestat",
    "term": "Gärrest",
    "alias": [
      "Gärrückstand",
      "Gärprodukt",
      "Biogasgülle"
    ],
    "kategorie": "hnojivo",
    "shortDef": "Der Gärrest ist der bei der Biogaserzeugung verbleibende Rückstand — ein vollwertiger organischer Dünger mit hohem Anteil sofort verfügbaren Stickstoffs.",
    "longDef": "Gärrest ist das, was nach der anaeroben Vergärung von Gülle, Mist, Silomais und Reststoffen in der Biogasanlage übrig bleibt. Der Kohlenstoff ist weitgehend zu Methan umgesetzt, die **Nährstoffe bleiben vollständig erhalten** — Gärrest ist also kein Abfall, sondern ein Dünger, dessen Ausbringung fest in die Düngeplanung gehört.\n\n**Was ihn von Rohgülle unterscheidet:**\n- **Höherer Ammoniumanteil** — durch den Abbau organischer Substanz liegt mehr Stickstoff direkt pflanzenverfügbar vor, was den Düngewert erhöht, zugleich aber das Risiko von Ammoniakverlusten\n- **Höherer pH-Wert**, was diese Verlustneigung zusätzlich verstärkt — bodennahe Ausbringung und sofortige Einarbeitung sind hier noch wichtiger als bei Gülle\n- **Dünnflüssiger und homogener**, dringt schneller in den Boden ein\n- **Geruchsärmer** als unvergorene Gülle\n- **Weniger keimfähige Unkrautsamen**, sofern die Anlage bei entsprechender Temperatur und Verweilzeit betrieben wird\n\n**Rechtliche Einordnung in Deutschland**: Gärreste zählen zu den Wirtschaftsdüngern beziehungsweise — bei Einsatz nicht landwirtschaftlicher Substrate — zu den Düngemitteln nach Düngemittelverordnung. Sie fallen unter die **Obergrenze von 170 kg Stickstoff aus organischer Düngung je Hektar und Jahr**, unterliegen den Sperrfristen und der Aufzeichnungspflicht, und ihr **Nährstoffgehalt muss durch Analyse belegt** werden — Faustzahlen genügen nicht. Für den überbetrieblichen Transport gilt die Wirtschaftsdüngerverbringungsverordnung mit Melde- und Nachweispflichten.\n\nHäufig wird der Gärrest **separiert**: Die feste Phase ist phosphor- und humusreich und lässt sich wirtschaftlich über weite Strecken transportieren, die flüssige Phase ist stickstoffreich und wird betriebsnah ausgebracht. In Regionen mit hoher Viehdichte ist das oft der einzige Weg, die Nährstoffbilanz überhaupt einzuhalten.",
    "related": [
      "kejda",
      "hnuj",
      "organicka-hmota",
      "cisterna-na-kejdu"
    ],
    "externalUrl": "https://de.wikipedia.org/wiki/G%C3%A4rrest",
    "externalLabel": "Wikipedia: Gärrest",
    "faq": [
      {
        "q": "Was ist Gärrest?",
        "a": "Der nach der Vergärung in der Biogasanlage verbleibende Rückstand — ein organischer Dünger, in dem die Nährstoffe des Ausgangsmaterials vollständig erhalten sind."
      },
      {
        "q": "Wie wird Gärrest ausgebracht?",
        "a": "Bodennah mit Schleppschlauch, Schleppschuh oder Injektion; auf unbestelltem Ackerland ist die Einarbeitung innerhalb einer Stunde vorgeschrieben."
      },
      {
        "q": "Worin unterscheiden sich Gärrest und Gülle?",
        "a": "Der Gärrest hat einen höheren Ammoniumanteil und pH-Wert, ist dünnflüssiger und geruchsärmer — dafür verlustanfälliger bei der Ausbringung."
      }
    ]
  },
  {
    "slug": "kejda",
    "term": "Gülle",
    "alias": [
      "Flüssigmist",
      "Rindergülle",
      "Schweinegülle"
    ],
    "kategorie": "hnojivo",
    "shortDef": "Gülle ist der flüssige Wirtschaftsdünger aus Kot, Harn und Wasser — der wertvollste Nährstoffkreislauf des viehhaltenden Betriebs.",
    "longDef": "Gülle ist das Gemisch aus Kot, Harn, Futterresten und Reinigungswasser aus der Tierhaltung, mit einem Trockensubstanzgehalt von meist 4 bis 10 %.\n\nEntscheidend für die Düngewirkung ist die **Aufteilung des Stickstoffs**: Rund die Hälfte liegt als **Ammonium** vor und wirkt sofort wie Mineraldünger, der Rest ist organisch gebunden und wird über Jahre langsam nachgeliefert. Rindergülle enthält typischerweise etwa 4 kg Gesamt-N, 1,5 kg P₂O₅ und 5 kg K₂O je Kubikmeter, Schweinegülle mehr Stickstoff und Phosphor. Verbindlich sind allerdings nur eigene **Analysewerte** — Faustzahlen weichen leicht um ein Drittel ab.\n\n**Der kritische Punkt ist der Ammoniakverlust.** Bei breitflächiger Ausbringung an einem warmen, windigen Tag entweicht ein erheblicher Teil des Ammoniums binnen Stunden. Deshalb schreibt die Düngeverordnung die **bodennahe Ausbringung** vor — auf Ackerland seit 2020, auf Grünland seit 2025 — und auf unbestelltem Ackerland die **Einarbeitung innerhalb einer Stunde**. Ausgebracht wird am besten kühl, feucht und bedeckt, nie bei praller Sonne.\n\n**Der rechtliche Rahmen** ist eng: Obergrenze von 170 kg Stickstoff aus organischer Düngung je Hektar und Jahr im Betriebsdurchschnitt, Sperrfristen im Herbst und Winter, vorgeschriebene Mindestlagerkapazität, Verbot der Ausbringung auf wassergesättigten, überschwemmten, gefrorenen oder schneebedeckten Böden, Abstände zu Gewässern und Aufzeichnungspflicht. In den **roten Gebieten** gelten zusätzlich verschärfte Auflagen.\n\nRichtig eingesetzt ist Gülle kein Entsorgungsproblem, sondern der wertvollste Nährstoffkreislauf des Betriebs: Sie ersetzt Mineraldünger und führt dem Boden zugleich organische Substanz zu.",
    "related": [
      "digestat",
      "hnuj",
      "cisterna-na-kejdu",
      "organicka-hmota"
    ],
    "externalUrl": "https://de.wikipedia.org/wiki/G%C3%BClle",
    "externalLabel": "Wikipedia: Gülle",
    "faq": [
      {
        "q": "Was ist Gülle?",
        "a": "Flüssiger Wirtschaftsdünger aus Kot, Harn, Futterresten und Wasser aus der Tierhaltung."
      },
      {
        "q": "Wie wird Gülle ausgebracht?",
        "a": "Bodennah mit Schleppschlauch, Schleppschuh oder Injektion; auf unbestelltem Ackerland ist innerhalb einer Stunde einzuarbeiten."
      },
      {
        "q": "Worin unterscheiden sich Gülle und Festmist?",
        "a": "Gülle ist flüssig, wirkt über den hohen Ammoniumanteil schnell; Festmist ist strohhaltig, wirkt langsam und baut mehr Humus auf."
      }
    ]
  },
  {
    "slug": "hnuj",
    "term": "Stallmist",
    "alias": [
      "Festmist",
      "Mist",
      "Rottemist"
    ],
    "kategorie": "hnojivo",
    "shortDef": "Stallmist ist der feste Wirtschaftsdünger aus Kot, Harn und Einstreu — der wirksamste Humuslieferant der Landwirtschaft.",
    "longDef": "Stallmist entsteht aus Kot und Harn zusammen mit der Einstreu, meist Stroh. Der Trockensubstanzgehalt liegt bei 20 bis 25 %, das Kohlenstoff-Stickstoff-Verhältnis zwischen 15 und 25 zu 1.\n\n**Der entscheidende Unterschied zur Gülle** liegt in der Wirkungsdynamik. Nur etwa ein Viertel bis ein Drittel des Stickstoffs steht im ersten Jahr zur Verfügung, der Rest wird über Jahre langsam mineralisiert. Wer Stallmist nach Mineraldüngermaßstab bewertet, unterschätzt ihn — die Nachlieferung aus früheren Gaben muss im Düngebedarf angerechnet werden.\n\nDafür ist er der **wirksamste Humuslieferant** überhaupt. Das eingestreute Stroh liefert stabilen Kohlenstoff, der die Krümelstruktur aufbaut, die Wasserhaltefähigkeit erhöht und das Bodenleben ernährt. Kein Mineraldünger und keine Gülle leisten das im selben Maß; in der Humusbilanz ist Stallmist die stärkste positive Position.\n\n**Rotte und Lagerung** entscheiden über die Qualität. Beim Kompostieren steigt die Temperatur auf 55 bis 70 °C, was Unkrautsamen und Krankheitserreger abtötet und den Mist streufähig macht; dabei gehen allerdings Stickstoff und Masse verloren. Frischmist ist nährstoffreicher, aber schlechter zu verteilen. Die Lagerung auf einer dichten Platte mit Auffangbehälter für Sickersaft ist vorgeschrieben.\n\nRechtlich gelten dieselben Rahmenbedingungen wie für Gülle: Anrechnung auf die 170-kg-Grenze, Sperrfristen — für Festmist von Huf- und Klauentieren allerdings kürzer — und Aufzeichnungspflicht. Im **Ökolandbau** ist Stallmist der Dreh- und Angelpunkt der Nährstoffversorgung.",
    "related": [
      "kejda",
      "digestat",
      "organicka-hmota",
      "orba"
    ],
    "externalUrl": "https://de.wikipedia.org/wiki/Stallmist",
    "externalLabel": "Wikipedia: Stallmist",
    "faq": [
      {
        "q": "Wozu dient Stallmist?",
        "a": "Als organischer Dünger und vor allem als Humuslieferant, der Bodenstruktur, Wasserhaltefähigkeit und Bodenleben verbessert."
      },
      {
        "q": "Wie wird Stallmist ausgebracht?",
        "a": "Mit dem Stalldungstreuer flächig und anschließend eingearbeitet."
      },
      {
        "q": "Worin unterscheiden sich Stallmist und Kompost?",
        "a": "Stallmist ist frisches oder angerottetes Material, Kompost durchläuft eine vollständige, gesteuerte Heißrotte."
      }
    ]
  },
  {
    "slug": "kostni-moucka",
    "term": "Knochenmehl",
    "alias": [
      "Tiermehl",
      "Knochenmehldünger"
    ],
    "kategorie": "hnojivo",
    "shortDef": "Knochenmehl ist ein organischer Phosphordünger aus gemahlenen Tierknochen, der Phosphor und Calcium langsam freisetzt.",
    "longDef": "Knochenmehl wird aus entfetteten, sterilisierten und gemahlenen Tierknochen hergestellt. Es enthält rund 20 bis 30 % P₂O₅, etwa 30 % Calcium und je nach Verarbeitung 3 bis 5 % Stickstoff.\n\nDie Wirkung ist **ausgesprochen langsam**: Der Phosphor liegt als Calciumphosphat in der Knochenmatrix vor und muss erst mikrobiell erschlossen werden. Das dauert Monate bis Jahre und läuft in **sauren Böden deutlich schneller** als in kalkhaltigen — auf einem Boden mit pH 7,5 passiert lange Zeit fast nichts. Als Notdüngung bei akutem Phosphormangel taugt es deshalb nicht; sein Platz ist die langfristige Grundversorgung.\n\nDer wichtigste Anwendungsbereich ist der **Ökolandbau**, in dem wasserlösliche Mineralphosphate nicht zugelassen sind. Dort schließt Knochenmehl eine echte Lücke, denn Phosphor ist in vieharmen Biobetrieben oft der begrenzende Nährstoff.\n\n**Rechtlich** handelt es sich um ein tierisches Nebenprodukt nach der Verordnung (EG) Nr. 1069/2009. Als Folge der BSE-Krise ist die Verfütterung an Nutztiere weitgehend verboten, die Verwendung als Dünger dagegen zulässig — unter Auflagen: Zugelassen sind nur verarbeitete Produkte der Kategorien 2 und 3 aus registrierten Betrieben, und auf Flächen, die mit Knochen- oder Fleischknochenmehl gedüngt wurden, dürfen Nutztiere **mindestens 21 Tage lang nicht weiden**. Diese Weidesperre wird in der Praxis regelmäßig übersehen.",
    "related": [
      "hnuj",
      "organicka-hmota",
      "superfosfat",
      "npk-hnojivo"
    ],
    "externalUrl": "https://de.wikipedia.org/wiki/Knochenmehl",
    "externalLabel": "Wikipedia: Knochenmehl",
    "faq": [
      {
        "q": "Wozu wird Knochenmehl verwendet?",
        "a": "Als langsam wirkender organischer Phosphor- und Calciumdünger, vor allem im Ökolandbau."
      },
      {
        "q": "Wie wird Knochenmehl ausgebracht?",
        "a": "Flächig gestreut und eingearbeitet oder als Zuschlag im Kompost — wegen der langsamen Wirkung möglichst lange vor dem Bedarf."
      },
      {
        "q": "Gibt es rechtliche Auflagen?",
        "a": "Ja. Als tierisches Nebenprodukt darf nur verarbeitetes Material verwendet werden, und gedüngte Flächen dürfen mindestens 21 Tage nicht beweidet werden."
      }
    ]
  },
  {
    "slug": "listova-hnojiva",
    "term": "Blattdünger",
    "alias": [
      "Blattdüngung",
      "foliare Düngung"
    ],
    "kategorie": "hnojivo",
    "shortDef": "Blattdünger werden auf das Blatt gespritzt und wirken über die Blattoberfläche — schnell, aber nur in kleinen Mengen.",
    "longDef": "Blattdünger werden als Lösung auf den Bestand gespritzt und über Blattoberfläche und Spaltöffnungen aufgenommen. Die Wirkung setzt binnen Stunden bis Tagen ein und umgeht den Boden vollständig.\n\n**Ihre eigentliche Domäne sind die Mikronährstoffe.** Bor, Mangan, Zink, Kupfer und Molybdän werden in so kleinen Mengen gebraucht, dass eine Blattgabe den Bedarf tatsächlich decken kann — und sie sind es, die im Boden am häufigsten festgelegt sind: Mangan auf frisch gekalkten oder lockeren Böden, Bor bei Trockenheit und hohem pH. Raps und Zuckerrüben haben einen ausgeprägten Borbedarf, Getreide reagiert auf Mangan.\n\n**Bei den Hauptnährstoffen stößt das Verfahren an eine harte Grenze.** Die Aufnahmekapazität des Blattes ist begrenzt, und höhere Konzentrationen verbrennen es. Über eine Blattgabe lassen sich je Überfahrt nur wenige Kilogramm Stickstoff ausbringen, während ein Weizenbestand 200 kg braucht. Blattdüngung mit Harnstoff kann eine Spätgabe ergänzen und den Proteingehalt anheben — die Bodendüngung ersetzen kann sie nicht. Wer Blattdünger als Ersatz für eine versäumte Grunddüngung verkauft bekommt, sollte skeptisch sein.\n\n**Für die Wirkung entscheidend** sind die Bedingungen: kühl, hohe Luftfeuchte, morgens oder abends, damit die Lösung nicht sofort eintrocknet. Bei praller Sonne und trockener Luft bleibt sie wirkungslos oder verätzt. Die Mischbarkeit mit Pflanzenschutzmitteln ist vor jeder Tankmischung zu prüfen.\n\nAuch Blattdünger zählen zur Düngung und sind aufzeichnungspflichtig; die Nährstoffmengen sind im Düngebedarf anzurechnen.",
    "related": [
      "rozmetadlo-hnojiv",
      "kapilarita-pudy",
      "mineralizace-pudy",
      "npk-hnojivo"
    ],
    "externalUrl": "https://de.wikipedia.org/wiki/Bl%C3%A4tterd%C3%BCngung",
    "externalLabel": "Wikipedia: Blattdüngung",
    "faq": [
      {
        "q": "Wie werden Blattdünger ausgebracht?",
        "a": "Als Spritzlösung auf den Bestand, am besten bei kühler Witterung und hoher Luftfeuchte morgens oder abends."
      },
      {
        "q": "Wofür eignet sich Blattdüngung?",
        "a": "Vor allem für Mikronährstoffe wie Bor, Mangan und Zink sowie zur gezielten Ergänzung — die Grunddüngung über den Boden ersetzt sie nicht."
      }
    ]
  },
  {
    "slug": "sira-vyziva",
    "term": "Schwefelernährung",
    "alias": [
      "Schwefel",
      "Schwefeldüngung",
      "S-Versorgung"
    ],
    "kategorie": "hnojivo",
    "shortDef": "Schwefel ist Baustein der Aminosäuren und seit dem Rückgang der Luftverschmutzung ein regelmäßig zu düngender Hauptnährstoff.",
    "longDef": "Schwefel ist Bestandteil der Aminosäuren Cystein und Methionin und damit fast jedes Eiweißes. Er ist am Aufbau von Chlorophyll und zahlreichen Enzymen beteiligt und liefert bei Kreuzblütlern die Glucosinolate, die Raps und Senf ihren typischen Geschmack geben.\n\n**Warum er überhaupt zum Thema wurde**: Bis in die 1980er-Jahre lieferte die Luft alles Nötige — 50 bis 80 kg Schwefel je Hektar und Jahr fielen als saurer Regen aus Kraftwerken und Industrie an. Niemand düngte Schwefel. Mit der Rauchgasentschwefelung ist dieser Eintrag auf wenige Kilogramm gefallen. Der saure Regen verschwand, und Schwefel wurde binnen weniger Jahre vom Umweltproblem zum **Mangelnährstoff**.\n\n**Der Mangel sieht dem Stickstoffmangel ähnlich, ist aber genau andersherum verteilt.** Schwefel ist in der Pflanze kaum verlagerbar, deshalb vergilben zuerst die **jungen Blätter**; Stickstoffmangel beginnt umgekehrt an den alten. Wer das verwechselt und Stickstoff nachlegt, verschlimmert die Lage. Beim Raps kommen blassgelbe, löffelartig eingerollte Blätter und weißliche Blüten hinzu.\n\n**Bedarf**: Raps ist mit 50 bis 80 kg S/ha der mit Abstand hungrigste Verbraucher, Getreide braucht 20 bis 40 kg, Grünland etwa 30 kg. Gedüngt wird als **Sulfat** — nur diese Form ist direkt pflanzenverfügbar —, üblich über schwefelhaltige Stickstoffdünger wie schwefelsauren Ammoniak oder ASS, über Kieserit oder über [[kalimagnesia]]. Elementarer Schwefel muss erst mikrobiell zu Sulfat oxidiert werden und wirkt daher verzögert.\n\nSulfat ist wie Nitrat **auswaschungsgefährdet**, weshalb die Gabe ins Frühjahr zum Vegetationsbeginn gehört und nicht in den Herbst.",
    "related": [
      "npk-hnojivo",
      "mineralizace-pudy",
      "superfosfat",
      "draselna-sul"
    ],
    "externalUrl": "https://de.wikipedia.org/wiki/Schwefel",
    "externalLabel": "Wikipedia: Schwefel",
    "faq": [
      {
        "q": "Warum ist Schwefel für Pflanzen wichtig?",
        "a": "Er ist Baustein der Aminosäuren Cystein und Methionin und damit fast jedes Eiweißes, außerdem am Chlorophyllaufbau beteiligt."
      },
      {
        "q": "Wie zeigt sich Schwefelmangel?",
        "a": "An den JUNGEN Blättern durch Aufhellung — anders als Stickstoffmangel, der an den alten Blättern beginnt."
      }
    ]
  },
  {
    "slug": "padli-travni",
    "term": "Echter Mehltau des Getreides",
    "alias": [
      "Blumeria graminis",
      "Getreidemehltau"
    ],
    "kategorie": "ochrana",
    "shortDef": "Echter Mehltau überzieht Blätter und Halme mit weißem, abwischbarem Pilzrasen und zehrt an der Assimilationsfläche.",
    "longDef": "Erreger ist *Blumeria graminis*, ein obligat biotropher Pilz, der nur auf lebendem Gewebe wächst. Kennzeichnend ist der weiße, watteartige und **abwischbare** Belag auf der Blattoberseite — daran unterscheidet er sich vom Falschen Mehltau, der von der Blattunterseite kommt. Später bräunt der Rasen und bildet dunkle Kleistothezien.\n\nDer Pilz ist **wirtsspezialisiert**: Die Form auf Weizen befällt keine Gerste und umgekehrt. Ein Weizen neben einem befallenen Gerstenschlag ist deshalb nicht gefährdet.\n\n**Befallsfördernd** sind dichte, üppig mit Stickstoff versorgte Bestände, milde und wechselhafte Witterung mit 15 bis 22 °C und hoher Luftfeuchte — anders als bei den meisten Pilzkrankheiten ist **kein Blattnässefilm** nötig, was die Bekämpfung erschwert. Frühsaaten und enge Getreidefruchtfolgen erhöhen den Druck.\n\n**Vorbeugung wirkt hier besonders gut**, weil der Zusammenhang mit der Bestandesführung so eng ist: resistente Sorten wählen, die Saatstärke nicht überziehen, Stickstoff bedarfsgerecht und nicht in einer großen Frühgabe ausbringen.\n\n**Chemisch** wirken Azole, Strobilurine und die spezifischen Mehltaumittel; im Ökolandbau ist **Netzschwefel** zugelassen und gegen Mehltau tatsächlich wirksam. Der Erreger ist wegen seiner vielen Generationen je Saison ausgesprochen resistenzfreudig — Wirkstoffwechsel ist Pflicht. Behandelt wird nach Bekämpfungsschwelle, nicht vorbeugend.",
    "related": [
      "fungicidy",
      "psenice-ozima",
      "repka-ozima",
      "osevni-postup"
    ],
    "externalUrl": "https://de.wikipedia.org/wiki/Echte_Mehltaupilze",
    "externalLabel": "Wikipedia: Echter Mehltau",
    "faq": [
      {
        "q": "Wie erkennt man Echten Mehltau?",
        "a": "An weißem, watteartigem und abwischbarem Pilzrasen auf der Blattoberseite, der später bräunt."
      },
      {
        "q": "Wie wird Echter Mehltau bekämpft?",
        "a": "Über resistente Sorten, maßvolle Bestandesdichte und Stickstoffdüngung sowie gezielte Fungizide nach Bekämpfungsschwelle; im Ökolandbau mit Netzschwefel."
      }
    ]
  },
  {
    "slug": "hlizenka",
    "term": "Weißstängeligkeit",
    "alias": [
      "Sclerotinia sclerotiorum",
      "Rapskrebs",
      "Weißfäule"
    ],
    "kategorie": "ochrana",
    "shortDef": "Die Weißstängeligkeit ist die wichtigste Pilzkrankheit des Rapses; sie befällt den Stängel über abgefallene Blütenblätter und lässt ihn vorzeitig absterben.",
    "longDef": "Erreger ist *Sclerotinia sclerotiorum*, ein Pilz mit außerordentlich breitem Wirtskreis von über 400 Arten — Raps, Sonnenblume, Körnerleguminosen, Kartoffel und viele Gemüsearten. Der Befall zeigt sich als heller, ausgebleichter Stängelabschnitt; im Inneren findet man weißes Myzel und die schwarzen, rattenkotähnlichen **Sklerotien**, die den Pilz jahrelang überdauern lassen.\n\n**Der Infektionsweg ist der Schlüssel zum Verständnis.** Die Sklerotien keimen im Boden und bilden becherförmige Apothecien, die Sporen freisetzen. Diese Sporen können den Stängel nicht direkt befallen — sie brauchen zuerst eine Nährstoffbasis. Diese liefern die **abgefallenen Blütenblätter**, die in den Blattachseln hängen bleiben. Von dort wächst der Pilz in den Stängel ein.\n\nDaraus folgt unmittelbar der **Bekämpfungszeitpunkt**: die Vollblüte, BBCH 63 bis 67. Später ist es zu spät, früher zu früh. Ob eine Behandlung nötig ist, lässt sich mit dem **Petalentest** abschätzen, bei dem Blütenblätter bebrütet werden, oder über regionale Prognosemodelle, die Bodentemperatur, Feuchte und Blühverlauf verrechnen. Behandlungswürdig wird es bei feuchter Witterung während der Blüte und dichten Beständen.\n\n**Ackerbaulich** ist eine weite Fruchtfolge die einzige nachhaltige Antwort — mindestens vier Jahre Anbaupause und keine anfälligen Zwischenglieder wie Sonnenblume oder Körnerleguminosen. Die Sklerotien überdauern bis zu zehn Jahre im Boden. Ergänzend gibt es das biologische Präparat *Coniothyrium minitans*, ein Pilz, der die Sklerotien im Boden parasitiert und dessen Wirkung mit dem Ausbringungszeitpunkt lange vor der Kultur steht und fällt.",
    "related": [
      "fungicidy",
      "repka-ozima",
      "osevni-postup",
      "moreni-osiva"
    ],
    "externalUrl": "https://de.wikipedia.org/wiki/Sclerotinia_sclerotiorum",
    "externalLabel": "Wikipedia: Sclerotinia sclerotiorum",
    "faq": [
      {
        "q": "Wie erkennt man die Weißstängeligkeit?",
        "a": "An hellen, ausgebleichten Stängelabschnitten mit weißem Myzel und schwarzen Sklerotien im Inneren; befallene Pflanzen reifen vorzeitig ab."
      },
      {
        "q": "Wann wird gegen Sclerotinia behandelt?",
        "a": "In der Vollblüte des Rapses, BBCH 63 bis 67 — der Pilz dringt über abgefallene Blütenblätter in den Stängel ein."
      }
    ]
  },
  {
    "slug": "drepcik",
    "term": "Erdflöhe",
    "alias": [
      "Rapserdfloh",
      "Psylliodes chrysocephala",
      "Kohlerdflöhe"
    ],
    "kategorie": "ochrana",
    "shortDef": "Erdflöhe sind kleine springende Blattkäfer; der Rapserdfloh ist seit dem Verbot der Neonikotinoid-Beize der wichtigste Rapsschädling im Herbst.",
    "longDef": "Erdflöhe sind Blattkäfer aus der Familie Chrysomelidae, die bei Störung mit ihren kräftigen Hinterschenkeln wegspringen. Landwirtschaftlich bedeutsam sind vor allem der **Rapserdfloh** (*Psylliodes chrysocephala*) und die **Kohlerdflöhe** der Gattung *Phyllotreta*.\n\n**Zwei Schadbilder sind zu trennen**, und die Verwechslung ist folgenreich:\n\nDer **Lochfraß der Käfer** am Keimblatt sieht dramatisch aus, ist aber meist nur bei sehr jungen Beständen und starkem Befall wirklich ertragsrelevant. Er ist das, was man sieht.\n\nDer **Larvenfraß im Blattstiel und im Vegetationskegel** ist der eigentliche Schaden — und er ist unsichtbar. Die Larven minieren im Inneren, schwächen die Pflanze über den Winter und lassen sie im Frühjahr verzweigt und kümmerlich austreiben oder ganz ausfallen.\n\n**Warum das heute so wichtig ist**: Bis 2018 hielt die neonikotinoide Saatgutbeize den Rapserdfloh zuverlässig in Schach. Seit dem EU-Verbot der Freilandanwendung fehlt dieser Schutz, und der Käfer ist zum limitierenden Faktor des Rapsanbaus in Deutschland geworden. Verschärfend kommt hinzu, dass die verbliebenen **Pyrethroide vielerorts durch Resistenz versagen** — nachgewiesen sind sowohl Ziel- als auch Metabolismusresistenz.\n\n**Kontrolliert** wird über Gelbschalen; bekämpfungswürdig sind grob 50 Käfer in drei Wochen beziehungsweise mehr als 10 % zerstörte Blattfläche, bei den Larven über die Zahl je Pflanze nach Ausspülen. Wichtiger als jede Spritzung sind heute ackerbauliche Hebel: kräftige, zügig wachsende Bestände, angepasster Saattermin, gute Vorwinterentwicklung und weite Fruchtfolge.",
    "related": [
      "insekticidy",
      "repka-ozima",
      "osevni-postup",
      "predni-vyvodovy-hridel"
    ],
    "externalUrl": "https://de.wikipedia.org/wiki/Erdfl%C3%B6he",
    "externalLabel": "Wikipedia: Erdflöhe",
    "faq": [
      {
        "q": "Wie zeigt sich ein Erdflohbefall?",
        "a": "Als runder Lochfraß der Käfer an Keim- und Laubblättern sowie — schwerwiegender, aber unsichtbar — als Larvenfraß in Blattstiel und Vegetationskegel."
      },
      {
        "q": "Wie werden Erdflöhe bekämpft?",
        "a": "Über Gelbschalenkontrolle und gezielte Insektizide; wegen verbreiteter Pyrethroidresistenz sind kräftige Bestände, Saattermin und Fruchtfolge heute entscheidend."
      }
    ]
  },
  {
    "slug": "bazlivec-kukuricny",
    "term": "Westlicher Maiswurzelbohrer",
    "alias": [
      "Diabrotica virgifera virgifera",
      "Maiswurzelbohrer"
    ],
    "kategorie": "ochrana",
    "shortDef": "Der Westliche Maiswurzelbohrer ist ein eingeschleppter Käfer, dessen Larven die Maiswurzeln zerstören; die wirksamste Gegenmaßnahme ist der Fruchtwechsel.",
    "longDef": "*Diabrotica virgifera virgifera* stammt aus Nordamerika und wurde Anfang der 1990er-Jahre nach Europa eingeschleppt. In Deutschland trat er zuerst in Bayern und Baden-Württemberg auf, in Österreich ist er in den Maisbaugebieten seit Längerem etabliert.\n\n**Den Schaden richten die Larven an.** Sie fressen an den Maiswurzeln und zerstören das Wurzelwerk. Die Pflanzen können Wasser und Nährstoffe nicht mehr aufnehmen und kippen bei Wind um; das typische Bild ist der **Gänsehalswuchs** — umgeknickte Pflanzen, die sich wieder aufzurichten versuchen. Die Käfer selbst fressen an Narbenfäden und Pollen, was bei starkem Auftreten die Befruchtung stört.\n\n**Die Bekämpfung folgt unmittelbar aus der Biologie.** Der Käfer legt seine Eier fast ausschließlich in Maisbestände ab, und die Larven können sich **nur an Maiswurzeln entwickeln**. Steht im Folgejahr auf derselben Fläche kein Mais, verhungern sie. Ein einziger Fruchtwechsel unterbricht den Zyklus damit vollständig — deshalb ist der Verzicht auf Mais-Monokultur die mit Abstand wirksamste und billigste Maßnahme.\n\nGenau darauf setzt auch das amtliche Vorgehen: In befallenen Gebieten haben die Pflanzenschutzdienste der Länder in Deutschland und die Behörden in Österreich Allgemeinverfügungen erlassen, die den **Anbau von Mais nach Mais begrenzen** — je nach Region etwa auf höchstens zwei aufeinanderfolgende Jahre. Der Käfer war früher ein EU-Quarantäneschädling; seit 2014 gilt er als etabliert und wird nicht mehr auf Ausrottung, sondern auf Eindämmung bewirtschaftet.\n\n**Überwacht** wird mit Pheromonfallen. Insektizide gegen die Käfer und Bodengranulate gegen die Larven sind möglich, aber teuer und deutlich weniger zuverlässig als der Fruchtwechsel.",
    "related": [
      "insekticidy",
      "osevni-postup",
      "predni-vyvodovy-hridel",
      "psenice-ozima"
    ],
    "externalUrl": "https://de.wikipedia.org/wiki/Westlicher_Maiswurzelbohrer",
    "externalLabel": "Wikipedia: Westlicher Maiswurzelbohrer",
    "faq": [
      {
        "q": "Wie zeigt sich ein Befall mit dem Maiswurzelbohrer?",
        "a": "Durch zerstörte Wurzeln, umkippende Pflanzen und den typischen Gänsehalswuchs; die Käfer fressen zusätzlich an Narbenfäden."
      },
      {
        "q": "Wie wird der Maiswurzelbohrer bekämpft?",
        "a": "Vor allem über den Fruchtwechsel — die Larven entwickeln sich ausschließlich an Maiswurzeln, sodass eine maisfreie Kultur den Zyklus unterbricht."
      }
    ]
  },
  {
    "slug": "sviluska-chmelova",
    "term": "Gemeine Spinnmilbe",
    "alias": [
      "Tetranychus urticae",
      "Bohnenspinnmilbe",
      "Rote Spinne"
    ],
    "kategorie": "ochrana",
    "shortDef": "Die Gemeine Spinnmilbe saugt an Blättern von Hopfen, Gemüse und Zierpflanzen und verursacht Sprenkelung, Bronzefärbung und Blattfall.",
    "longDef": "*Tetranychus urticae* ist eine kaum einen halben Millimeter große Milbe mit sehr breitem Wirtskreis — Hopfen, Erdbeere, Gemüse, Obst, Zierpflanzen und im Gewächshaus praktisch alles. Sie saugt an der Blattunterseite; das Schadbild beginnt als feine helle Sprenkelung, geht in eine bronzefarbene Verfärbung über und endet bei starkem Befall in feinen Gespinsten und Blattfall.\n\n**Warm und trocken ist ihr Wetter.** Bei 30 °C dauert eine Generation nur etwa eine Woche, sodass sich innerhalb einer Saison zahllose Generationen aufbauen. Genau deshalb ist sie ein Gewächshausproblem ersten Ranges und im Freiland vor allem in Hitzesommern relevant.\n\n**Zwei Dinge machen die chemische Bekämpfung schwierig.** Erstens die Resistenz: Die kurze Generationsdauer lässt Resistenzen extrem schnell entstehen, gegen praktisch jede Akarizidgruppe gibt es dokumentierte Fälle. Zweitens — und das ist der häufigste Fehler in der Praxis — sind es oft **Insektizide gegen andere Schädlinge, die den Spinnmilbenbefall erst auslösen**: Breit wirkende Pyrethroide töten die natürlichen Gegenspieler, während die Milben selbst kaum getroffen werden. Der Befall explodiert danach.\n\n**Der biologische Weg funktioniert hier ausgesprochen gut.** Die Raubmilbe *Phytoseiulus persimilis* ist im Gewächshaus seit Jahrzehnten Standard und der Chemie überlegen. Im Freiland helfen ausreichende Wasserversorgung, hohe Luftfeuchte und der Verzicht auf nützlingsschädliche Mittel.",
    "related": [
      "padli-travni",
      "ucinna-latka",
      "rezistence-pesticidy"
    ],
    "externalUrl": "https://de.wikipedia.org/wiki/Gemeine_Spinnmilbe",
    "externalLabel": "Wikipedia: Gemeine Spinnmilbe",
    "faq": [
      {
        "q": "Wie erkennt man einen Spinnmilbenbefall?",
        "a": "An feiner heller Sprenkelung, später bronzefarbenen Blättern und bei starkem Befall an feinen Gespinsten."
      },
      {
        "q": "Wie beugt man Spinnmilben vor?",
        "a": "Durch ausreichende Wasserversorgung, hohe Luftfeuchte, Verzicht auf nützlingsschädliche Breitbandmittel und den Einsatz von Raubmilben."
      }
    ]
  },
  {
    "slug": "molice-sklenikova",
    "term": "Weiße Fliege",
    "alias": [
      "Trialeurodes vaporariorum",
      "Gewächshausmottenschildlaus"
    ],
    "kategorie": "ochrana",
    "shortDef": "Die Weiße Fliege saugt an Blattunterseiten, verschmutzt die Pflanze mit Honigtau und überträgt Viren — vor allem im Gewächshaus.",
    "longDef": "Die Gewächshausmottenschildlaus *Trialeurodes vaporariorum* ist ein etwa zwei Millimeter großes, weiß bestäubtes Insekt, das bei Berührung der Pflanze in Wolken auffliegt. Sie saugt an Blattunterseiten; alle Stadien vom Ei über die festsitzenden Larven bis zur Puppe sitzen dort dicht beieinander.\n\n**Der Schaden hat drei Ebenen.** Das Saugen selbst schwächt die Pflanze. Der ausgeschiedene **Honigtau** verklebt die Blätter und wird von Rußtaupilzen besiedelt, die die Photosynthese blockieren und die Ware unverkäuflich machen. Und die Tiere übertragen **Viren**, was bei Tomate und Gurke der wirtschaftlich schwerste Punkt ist.\n\n**Warum sie so hartnäckig ist**: Im beheizten Gewächshaus fehlt die Winterpause, sodass sich Generation um Generation ohne Unterbrechung aufbaut. Zugleich sitzen alle Stadien gleichzeitig auf der Pflanze, und die wachsbedeckten Puppen sind von Kontaktmitteln kaum zu erreichen — eine einzelne Behandlung erwischt nie den ganzen Befall. Resistenzen sind entsprechend weit verbreitet.\n\n**Der biologische Weg ist im Unterglasanbau längst Standard und der Chemie überlegen.** Die Schlupfwespe *Encarsia formosa* parasitiert die Larven; die parasitierten Puppen färben sich schwarz und sind so leicht zu kontrollieren. Ergänzt wird sie durch die Raubwanze *Macrolophus pygmaeus*. Wichtig ist der **frühe Einsatz** bei geringem Befall — bei einer bereits ausgebrochenen Massenvermehrung kommen die Nützlinge nicht mehr hinterher. Gelbtafeln dienen der Überwachung, nicht der Bekämpfung.",
    "related": [
      "insekticidy",
      "ucinna-latka",
      "rezistence-pesticidy"
    ],
    "externalUrl": "https://de.wikipedia.org/wiki/Gew%C3%A4chshausmottenschildlaus",
    "externalLabel": "Wikipedia: Weiße Fliege",
    "faq": [
      {
        "q": "Wie bekämpft man die Weiße Fliege?",
        "a": "Im Gewächshaus am wirksamsten biologisch mit der Schlupfwespe Encarsia formosa, eingesetzt früh und bei noch geringem Befall."
      },
      {
        "q": "Welche Pflanzen befällt die Weiße Fliege?",
        "a": "Vor allem Tomate, Gurke, Paprika und Zierpflanzen im Gewächshaus, im Sommer auch Freilandkulturen."
      }
    ]
  },
  {
    "slug": "strupovitost-jablone",
    "term": "Apfelschorf",
    "alias": [
      "Venturia inaequalis",
      "Schorf"
    ],
    "kategorie": "ochrana",
    "shortDef": "Der Apfelschorf ist die wichtigste Krankheit im Apfelanbau; er erzeugt olivbraune Flecken auf Blättern und verschorfte, unverkäufliche Früchte.",
    "longDef": "Erreger ist *Venturia inaequalis*. Auf den Blättern entstehen zunächst olivgrüne, samtige Flecken, die später dunkelbraun werden; auf den Früchten bilden sich verkorkte, rissige Schorfstellen. Die Frucht bleibt essbar, ist aber praktisch nicht mehr vermarktbar — der wirtschaftliche Schaden ist deshalb fast vollständig ein Qualitätsschaden.\n\n**Der Infektionszyklus bestimmt die gesamte Bekämpfungsstrategie.** Der Pilz überwintert im **Falllaub** am Boden und bildet dort Fruchtkörper. Im Frühjahr werden bei Regen Ascosporen ausgeschleudert, die die jungen Blätter infizieren — die **Primärinfektion**. Aus diesen Flecken entstehen dann über den Sommer laufend Konidien für die **Sekundärinfektionen**.\n\nOb eine Infektion zustande kommt, hängt von der **Blattnassdauer bei gegebener Temperatur** ab. Diesen Zusammenhang beschreibt die klassische **Mills-Tabelle**: bei 10 °C etwa 14 Stunden Blattnässe, bei 18 °C nur noch rund 8. Praktisch jede Obstbauberatung betreibt darauf aufbauende Warndienste mit Wetterstationen im Bestand; behandelt wird nach Infektionsereignis, nicht nach Kalender.\n\n**Die wirksamste Einzelmaßnahme kostet kein Fungizid**: die Reduktion des Falllaubs. Häckseln, Harnstoffbehandlung des Laubes im Herbst zur Beschleunigung der Rotte oder Abfahren senken das Ascosporenpotenzial im Frühjahr erheblich.\n\nHinzu kommen **schorfresistente Sorten** wie Topaz, Santana oder Rewena, die auf dem Vf-Resistenzgen beruhen — im Ökoanbau die Grundlage. Chemisch stehen Kontaktmittel wie Captan und im Ökoanbau Schwefel und Kupfer sowie systemische Mittel zur Verfügung; der Erreger ist resistenzfreudig, weshalb Wirkstoffwechsel und Kontaktpartner Pflicht sind.",
    "related": [
      "fungicidy",
      "ucinna-latka",
      "padli-travni"
    ],
    "externalUrl": "https://de.wikipedia.org/wiki/Apfelschorf",
    "externalLabel": "Wikipedia: Apfelschorf",
    "faq": [
      {
        "q": "Wie erkennt man Apfelschorf?",
        "a": "An olivgrünen bis dunkelbraunen samtigen Flecken auf den Blättern und verkorkten, rissigen Schorfstellen auf den Früchten."
      },
      {
        "q": "Wie wird Apfelschorf bekämpft?",
        "a": "Über Falllaubreduktion im Herbst, schorfresistente Sorten und Fungizidbehandlungen nach Infektionsereignissen aus dem Warndienst."
      }
    ]
  },
  {
    "slug": "obalec-jablecny",
    "term": "Apfelwickler",
    "alias": [
      "Cydia pomonella",
      "Obstmade"
    ],
    "kategorie": "ochrana",
    "shortDef": "Der Apfelwickler ist der bedeutendste Fruchtschädling im Apfelanbau — seine Raupe ist die klassische Made im Apfel.",
    "longDef": "*Cydia pomonella* ist ein unscheinbarer grauer Kleinschmetterling, dessen Raupe sich in die Frucht bohrt, zum Kernhaus vorfrisst und den charakteristischen, mit Kot gefüllten Fraßgang hinterlässt. Befallene Früchte fallen vorzeitig ab oder faulen sekundär — und sie sind vollständig unverkäuflich, weshalb schon geringe Befallsraten wirtschaftlich schmerzen.\n\n**Der Lebenszyklus**: Die Falter fliegen ab Mai, wenn die Abenddämmerungstemperatur etwa 15 °C überschreitet, und legen ihre Eier einzeln an Früchte und Blätter. Die schlüpfende Raupe hat nur ein kurzes Zeitfenster außerhalb der Frucht — **nur in dieser Phase ist sie überhaupt bekämpfbar**. Sobald sie eingebohrt ist, erreicht sie kein Kontaktmittel mehr. In Mitteleuropa treten je nach Witterung ein bis zwei Generationen auf, in warmen Jahren eine partielle dritte.\n\n**Deshalb ist das Timing alles.** Überwacht wird der Flug mit **Pheromonfallen**; der Behandlungstermin wird über Temperatursummenmodelle berechnet, die vom Flughöhepunkt aus den Schlupf der Räupchen vorhersagen. Wer nach Kalender spritzt, trifft regelmäßig daneben.\n\n**Zwei Verfahren haben den Obstbau verändert.** Die **Verwirrungsmethode** verteilt Pheromondispenser flächig im Bestand, sodass die Männchen die Weibchen nicht mehr finden — sie funktioniert nur bei ausreichender Flächengröße und geringem Ausgangsbefall, ist dann aber sehr wirksam und schont sämtliche Nützlinge. Und das **Granulovirus** (CpGV) ist ein hochspezifisches Virus, das ausschließlich Apfelwicklerraupen befällt, im Ökoanbau zugelassen ist und dort das Rückgrat der Bekämpfung bildet. In einigen Anlagen sind allerdings bereits virusresistente Apfelwicklerpopulationen aufgetreten, weshalb Isolatwechsel empfohlen wird.",
    "related": [
      "insekticidy",
      "ucinna-latka",
      "rezistence-pesticidy"
    ],
    "externalUrl": "https://de.wikipedia.org/wiki/Apfelwickler",
    "externalLabel": "Wikipedia: Apfelwickler",
    "faq": [
      {
        "q": "Wie erkennt man einen Apfelwicklerbefall?",
        "a": "An einem Bohrloch mit Kotauswurf an der Frucht und dem mit Kot gefüllten Fraßgang bis zum Kernhaus."
      },
      {
        "q": "Wie wird der Apfelwickler bekämpft?",
        "a": "Über Pheromonfallen und Prognosemodelle zum richtigen Termin, durch die Verwirrungsmethode sowie mit dem hochspezifischen Granulovirus."
      }
    ]
  },
  {
    "slug": "monilie",
    "term": "Monilia",
    "alias": [
      "Fruchtfäule",
      "Spitzendürre",
      "Monilinia"
    ],
    "kategorie": "ochrana",
    "shortDef": "Monilia verursacht an Obstgehölzen zwei Schadbilder: die Spitzendürre an Blüten und Trieben sowie die Fruchtfäule mit ringförmig angeordneten Sporenpolstern.",
    "longDef": "Hinter dem Namen stehen mehrere Arten der Gattung *Monilinia* mit zwei deutlich verschiedenen Schadbildern.\n\nDie **Spitzendürre**, verursacht vor allem von *Monilinia laxa*, befällt während der Blüte. Der Pilz dringt durch die Blüte in den Trieb ein; Blüten und Triebspitzen welken schlagartig und vertrocknen, bleiben aber am Baum hängen — das Bild erinnert an Frostschaden oder Feuerbrand. Betroffen sind vor allem Sauerkirsche, Zwetschge, Aprikose und Mandel.\n\nDie **Fruchtfäule** durch *Monilinia fructigena* befällt reifende Früchte. Kennzeichnend sind die **konzentrisch, in Ringen angeordneten gelblichen Sporenpolster** auf der faulenden Frucht. Daraus entstehen die eingetrockneten, schwarzen **Fruchtmumien**, die über Winter am Baum hängen bleiben.\n\n**Die entscheidende Eintrittspforte ist die Verletzung.** Intakte Fruchtschalen werden kaum befallen; Wespenfraß, Hagelschäden, Vogelpicken und vor allem die Bohrlöcher des [[obalec-jablecny]] öffnen den Weg. Deshalb ist eine wirksame Bekämpfung des Apfelwicklers zugleich eine Maßnahme gegen Monilia — ein Zusammenhang, der in der Praxis oft übersehen wird.\n\n**Die wichtigste Einzelmaßnahme ist hygienisch**: das konsequente Entfernen der Fruchtmumien und der befallenen Triebe im Winterschnitt. Jede am Baum verbliebene Mumie ist im Frühjahr eine Sporenquelle. Hinzu kommen ein luftiger Kronenschnitt für rasches Abtrocknen, die Vermeidung von Ernteverletzungen und bei der Spitzendürre eine Fungizidbehandlung während der Blüte, sofern es in dieser Phase feucht ist.",
    "related": [
      "fungicidy",
      "ucinna-latka",
      "padli-travni"
    ],
    "externalUrl": "https://de.wikipedia.org/wiki/Monilia",
    "externalLabel": "Wikipedia: Monilia",
    "faq": [
      {
        "q": "Wie erkennt man Monilia?",
        "a": "An welkenden, vertrockneten Blüten und Triebspitzen bei der Spitzendürre und an ringförmig angeordneten Sporenpolstern auf faulenden Früchten bei der Fruchtfäule."
      },
      {
        "q": "Wie wird Monilia bekämpft?",
        "a": "Vor allem durch konsequentes Entfernen der Fruchtmumien und befallener Triebe, luftigen Kronenschnitt, Vermeidung von Fruchtverletzungen und Blütenbehandlung bei feuchter Witterung."
      }
    ]
  },
  {
    "slug": "ochranna-lhuta",
    "term": "Wartezeit",
    "alias": [
      "Karenzzeit",
      "Wartefrist"
    ],
    "kategorie": "ochrana",
    "shortDef": "Die Wartezeit ist die Zeitspanne, die zwischen der letzten Anwendung eines Pflanzenschutzmittels und der Ernte einzuhalten ist.",
    "longDef": "Die Wartezeit legt fest, wie viele Tage zwischen der letzten Behandlung und der Ernte vergehen müssen. Sie ist so bemessen, dass die Rückstände bis zur Ernte unter den zulässigen **Rückstandshöchstgehalt (MRL)** nach Verordnung (EG) Nr. 396/2005 abgebaut sind.\n\n**Sie ist keine Empfehlung, sondern Bestandteil der Zulassung.** Die Wartezeit steht mittelspezifisch und kulturspezifisch in der Gebrauchsanleitung; dasselbe Mittel kann in Weizen 35 Tage und in Kartoffeln 14 Tage haben. Verbindlich sind allein die Angaben im Zulassungsregister von BVL beziehungsweise BAES.\n\nEinige Kennzeichnungen sind häufig missverstanden: **„F\" bedeutet, dass die Wartezeit durch die Anwendungsbestimmungen abgedeckt ist** — etwa weil die Anwendung so früh liegt, dass eine gesonderte Frist entbehrlich ist. **„N.A.\" heißt nicht anwendbar**, nicht „keine Wartezeit\".\n\nNeben der Erntewartezeit gibt es zwei weitere Fristen, die im Alltag oft untergehen: die **Wiederbetretungsfrist** für Beschäftigte, bis der Bestand ohne Schutzausrüstung betreten werden darf, und bei Grünland die **Wartezeit bis zur Beweidung oder Schnittnutzung**.\n\nWer die Wartezeit nicht einhält, riskiert nicht nur ein Bußgeld nach dem Pflanzenschutzgesetz, sondern auch Kürzungen bei den Direktzahlungen über die Konditionalität sowie — praktisch am schmerzhaftesten — die Zurückweisung der Partie durch den Abnehmer nach dessen Rückstandsanalyse.",
    "related": [
      "rezistence-pesticidy",
      "ucinna-latka",
      "fungicidy"
    ],
    "externalUrl": "https://de.wikipedia.org/wiki/Wartezeit_(Pflanzenschutz)",
    "externalLabel": "Wikipedia: Wartezeit",
    "faq": [
      {
        "q": "Wie wird die Wartezeit berechnet?",
        "a": "Von der letzten Anwendung des Mittels bis zur Ernte, in Tagen; maßgeblich ist die Angabe in der Gebrauchsanleitung."
      },
      {
        "q": "Warum gibt es Wartezeiten?",
        "a": "Damit die Rückstände bis zur Ernte unter den gesetzlichen Rückstandshöchstgehalt sinken."
      }
    ]
  },
  {
    "slug": "moreni-osiva",
    "term": "Saatgutbeizung",
    "alias": [
      "Beizung",
      "Saatgutbehandlung",
      "Beizmittel"
    ],
    "kategorie": "ochrana",
    "shortDef": "Die Beizung überzieht das Saatkorn mit einem Pflanzenschutzmittel und schützt Keimling und Jungpflanze in der empfindlichsten Phase.",
    "longDef": "Bei der Beizung wird das Saatgut vor der Aussaat mit einem Fungizid, Insektizid oder biologischen Präparat überzogen. Der große Vorteil liegt in der **Mengenrelation**: Wenige Gramm Wirkstoff je Hektar wirken genau dort, wo der Schaden entsteht, statt dass die gesamte Fläche behandelt wird. Gemessen an der Wirkstoffmenge je Hektar ist die Beizung damit das mit Abstand sparsamste Verfahren des Pflanzenschutzes.\n\n**Was sie leistet**: Sie bekämpft samenbürtige Krankheiten wie Steinbrand, Flugbrand, Streifenkrankheit und Schneeschimmel — Erreger, gegen die eine spätere Spritzung nichts mehr ausrichten kann — und schützt gegen bodenbürtige Auflaufkrankheiten. Bei Getreide ist sie in Deutschland und Österreich praktisch die Regel; im **Ökolandbau** ersetzen physikalische Verfahren wie die Heißwasser- oder Warmluftbehandlung sowie Präparate auf Basis von Gelbsenfmehl oder antagonistischen Mikroorganismen die chemische Beizung.\n\n**Der große Einschnitt bei den Insektizidbeizen**: Die neonikotinoiden Beizmittel mit Imidacloprid, Clothianidin und Thiamethoxam sind für Freilandkulturen in der EU **seit 2018 verboten**; der Europäische Gerichtshof hat 2023 klargestellt, dass die Mitgliedstaaten dafür auch keine Notfallzulassungen mehr erteilen dürfen. Ausgelöst wurde das Verbot unter anderem durch Bienenschäden bei der Maisaussaat, als **abgeriebener Beizstaub** in blühende Randstrukturen verweht wurde. Seither gelten strenge Anforderungen an die **Abriebfestigkeit** — geprüft nach dem Heubach-Verfahren — und an Sägeräte, deren Abluft nach unten in die Saatrille geführt werden muss.\n\n**Rechtliche Rahmenbedingungen**: Gebeizt werden darf nur in dafür ausgerüsteten Beizstellen mit geprüfter Technik; gebeiztes Saatgut ist zu kennzeichnen, gesondert zu lagern und darf **niemals verfüttert** werden. Zulassungen sind kulturspezifisch und national — maßgeblich sind die Register von BVL beziehungsweise BAES.",
    "related": [
      "ochranna-lhuta",
      "fungicidy",
      "insekticidy",
      "ucinna-latka"
    ],
    "externalUrl": "https://de.wikipedia.org/wiki/Beize_(Saatgut)",
    "externalLabel": "Wikipedia: Saatgutbeize",
    "faq": [
      {
        "q": "Warum wird Saatgut gebeizt?",
        "a": "Um Keimling und Jungpflanze vor samen- und bodenbürtigen Krankheiten sowie frühen Schädlingen zu schützen — mit minimalem Wirkstoffeinsatz je Hektar."
      },
      {
        "q": "Welche Mittel werden zur Beizung verwendet?",
        "a": "Vor allem Fungizide, daneben biologische Präparate; neonikotinoide Insektizidbeizen sind für Freilandkulturen in der EU seit 2018 verboten."
      },
      {
        "q": "Was ist der Unterschied zwischen chemischer und physikalischer Beizung?",
        "a": "Die chemische Beizung nutzt Pflanzenschutzmittel, die physikalische Heißwasser- oder Warmluftbehandlung — Letztere ist im Ökolandbau zugelassen."
      }
    ]
  },
  {
    "slug": "adjuvant",
    "term": "Zusatzstoff (Netzmittel)",
    "alias": [
      "Netzmittel",
      "Additiv",
      "Formulierungshilfsstoff"
    ],
    "kategorie": "ochrana",
    "shortDef": "Zusatzstoffe werden der Spritzbrühe beigemischt, um Benetzung, Haftung und Aufnahme des Wirkstoffs zu verbessern.",
    "longDef": "Zusatzstoffe sind selbst keine Pflanzenschutzmittel, verbessern aber deren Wirkung. Sie setzen die Oberflächenspannung der Spritzbrühe herab, sodass der Tropfen auf dem Blatt zerläuft statt abzuperlen, verbessern die Haftung gegen Abwaschen durch Regen und erleichtern das Durchdringen der Wachsschicht.\n\n**Die wichtigsten Gruppen:**\n- **Netzmittel** — meist Tenside; verbessern Benetzung und Verteilung, klassisch bei Herbiziden auf wachsigen Blättern\n- **Öladjuvantien** — Raps- oder Mineralöle; lösen die Wachsschicht an und verbessern die Aufnahme, wichtig bei Gräserherbiziden\n- **Ammoniumsulfat** — bindet Calcium- und Magnesiumionen im harten Wasser, die sonst Glyphosat inaktivieren\n- **Driftminderer** — vergrößern die Tropfen und senken den Feinanteil\n- **Entschäumer** und **pH-Puffer** — Letztere sind wichtig, weil manche Wirkstoffe bei hohem pH im Tank hydrolysieren\n\n**Zwei Punkte, die in der Praxis regelmäßig schiefgehen:**\n\nErstens sind viele Mittel **bereits fertig formuliert** und enthalten das nötige Adjuvans. Ein zusätzliches Netzmittel kann dann die Selektivität aufheben und die Kultur schädigen — Blattverbrennungen nach einer gut gemeinten Zugabe sind ein häufiger Schadensfall.\n\nZweitens sind Zusatzstoffe in Deutschland **zulassungspflichtig**: Sie müssen als Zusatzstoff im Verzeichnis des BVL geführt sein, und die Kombination muss von der Gebrauchsanleitung des Mittels gedeckt sein. Ein beliebiges Spülmittel ist keine zulässige Alternative.",
    "related": [
      "ucinna-latka",
      "fungicidy",
      "herbicidy",
      "insekticidy"
    ],
    "externalUrl": "https://de.wikipedia.org/wiki/Adjuvans",
    "externalLabel": "Wikipedia: Adjuvans",
    "faq": [
      {
        "q": "Wozu dienen Zusatzstoffe im Pflanzenschutz?",
        "a": "Sie verbessern Benetzung, Haftung und Aufnahme des Wirkstoffs und können die Abdrift verringern."
      },
      {
        "q": "Welche Arten von Zusatzstoffen gibt es?",
        "a": "Netzmittel, Öladjuvantien, Ammoniumsulfat als Wasserhärtekorrektur, Driftminderer, Entschäumer und pH-Puffer."
      }
    ]
  },
  {
    "slug": "rezistence-pesticidy",
    "term": "Resistenz gegen Pflanzenschutzmittel",
    "alias": [
      "Wirkungsverlust",
      "Resistenzentwicklung"
    ],
    "kategorie": "ochrana",
    "shortDef": "Resistenz ist die vererbte Fähigkeit eines Schadorganismus, eine Behandlung zu überleben, die ihn normalerweise abtöten würde.",
    "longDef": "Resistenz entsteht durch Selektion. In jeder Population gibt es einzelne Individuen mit einer zufälligen Mutation, die den Wirkstoff überstehen. Jede Behandlung entfernt die empfindlichen und lässt die widerstandsfähigen übrig — mit jeder Anwendung steigt ihr Anteil. **Der Wirkstoff erzeugt die Resistenz nicht, er wählt sie aus.**\n\nZwei Mechanismen sind zu unterscheiden. Bei der **Zielortresistenz** verändert eine Mutation den Angriffspunkt so, dass der Wirkstoff nicht mehr bindet — sie tritt oft sprunghaft auf und betrifft die gesamte Wirkstoffgruppe zugleich, weshalb ein Wechsel innerhalb der Gruppe nichts bringt. Bei der **metabolischen Resistenz** baut der Organismus den Wirkstoff schneller ab; sie entwickelt sich schleichend, kann aber mehrere unverwandte Gruppen zugleich erfassen.\n\n**Belegte Fälle in Mitteleuropa**: Acker-Fuchsschwanz und Windhalm gegen ACCase- und ALS-Hemmer, Septoria gegen Strobilurine mit dem Durchbruch 2002/2003, Rapsglanzkäfer und Rapserdfloh gegen Pyrethroide, Varroamilbe gegen Pyrethroide.\n\n**Die Gegenstrategie hat fünf Punkte, und der letzte ist der wichtigste:**\n1. **Wirkungsweisen wechseln** — orientiert an den Codes von HRAC bei Herbiziden, FRAC bei Fungiziden und IRAC bei Insektiziden, nicht am Handelsnamen\n2. **In Mischung** mit einem zweiten Wirkmechanismus behandeln\n3. **Volle Aufwandmenge** verwenden — reduzierte Mengen selektieren besonders scharf auf metabolische Resistenz\n4. **Nach Bekämpfungsschwelle** behandeln statt vorbeugend\n5. **Den Selektionsdruck ackerbaulich senken** — weite Fruchtfolge, Saattermin, resistente Sorten, mechanische Verfahren. Ohne diesen Punkt verlieren die anderen vier nur Zeit\n\nDie Zahl verfügbarer Wirkungsweisen wächst kaum noch, während laufend Wirkstoffe aus der Zulassung fallen. Resistenzmanagement ist deshalb keine Kür, sondern Bestandserhaltung.",
    "related": [
      "fungicidy",
      "herbicidy",
      "insekticidy",
      "moreni-osiva"
    ],
    "externalUrl": "https://de.wikipedia.org/wiki/Pestizidresistenz",
    "externalLabel": "Wikipedia: Pestizidresistenz",
    "faq": [
      {
        "q": "Wie entsteht Resistenz?",
        "a": "Durch Selektion — die Behandlung entfernt die empfindlichen Individuen, die zufällig widerstandsfähigen überleben und vermehren sich."
      },
      {
        "q": "Wie beugt man Resistenz vor?",
        "a": "Durch Wechsel und Mischung der Wirkungsweisen, volle Aufwandmengen, Behandlung nach Bekämpfungsschwelle und vor allem durch ackerbauliche Maßnahmen."
      }
    ]
  },
  {
    "slug": "ucinna-latka",
    "term": "Wirkstoff",
    "alias": [
      "aktiver Bestandteil",
      "Aktivsubstanz"
    ],
    "kategorie": "ochrana",
    "shortDef": "Der Wirkstoff ist der biologisch wirksame Bestandteil eines Pflanzenschutzmittels — EU-weit genehmigt, das fertige Mittel dagegen national zugelassen.",
    "longDef": "Der Wirkstoff ist die Substanz, die die eigentliche Wirkung gegen Pilz, Unkraut oder Schädling entfaltet. Im fertigen Mittel steckt er zusammen mit Formulierungshilfsstoffen, Lösungsmitteln und Netzmitteln, die Lagerfähigkeit, Mischbarkeit und Aufnahme bestimmen.\n\n**Die wichtigste rechtliche Unterscheidung — und die häufigste Verwechslung:**\n\nDer **Wirkstoff wird EU-weit genehmigt**, nach Verordnung (EG) Nr. 1107/2009 und auf Grundlage der Bewertung durch die EFSA, jeweils befristet und verlängerbar.\n\nDas **fertige Pflanzenschutzmittel wird national zugelassen** — in Deutschland durch das BVL, in Österreich durch das BAES. Erst diese Zulassung legt fest, in welcher Kultur, gegen welchen Schadorganismus, mit welcher Aufwandmenge, welchen Abstandsauflagen und welcher Wartezeit angewendet werden darf.\n\nDaraus folgt praktisch: **Derselbe Wirkstoff kann in Deutschland zugelassen sein und in Österreich nicht, oder in unterschiedlichen Kulturen.** Handelsnamen unterscheiden sich ohnehin von Land zu Land. Ein in einem Nachbarland gekauftes Mittel ist hier nicht automatisch anwendbar, und ein deutsches Beratungsempfehlungsschreiben gilt nicht ohne Weiteres in Österreich.\n\nDeshalb ist der Wirkstoffname — der internationale Freiname wie Prothioconazol oder Azoxystrobin — die einzige verlässliche Sprache über Ländergrenzen hinweg. Für die Anwendung selbst zählt aber immer die aktuelle Gebrauchsanleitung des konkreten Mittels und das jeweilige nationale Register.",
    "related": [
      "fungicidy",
      "herbicidy",
      "insekticidy",
      "adjuvant"
    ],
    "externalUrl": "https://de.wikipedia.org/wiki/Wirkstoff",
    "externalLabel": "Wikipedia: Wirkstoff",
    "faq": [
      {
        "q": "Was ist ein Wirkstoff im Pflanzenschutz?",
        "a": "Der biologisch wirksame Bestandteil eines Pflanzenschutzmittels, der gegen den Zielorganismus wirkt."
      },
      {
        "q": "Wer lässt Pflanzenschutzmittel zu?",
        "a": "Der Wirkstoff wird EU-weit genehmigt; das fertige Mittel wird national zugelassen — in Deutschland vom BVL, in Österreich vom BAES."
      }
    ]
  },
  {
    "slug": "azoxystrobin",
    "term": "Azoxystrobin",
    "alias": [
      "Strobilurin",
      "QoI-Fungizid"
    ],
    "kategorie": "ochrana",
    "shortDef": "Azoxystrobin ist ein breit wirkendes Strobilurin-Fungizid, das die Atmungskette der Pilze blockiert — gegen Septoria aber wirkungslos.",
    "longDef": "Azoxystrobin war 1996 das erste zugelassene Strobilurin und ist bis heute eines der weltweit meistverwendeten Fungizide. Vorbild waren die Strobilurine des Kiefernzapfenrüblings, eines Waldpilzes, der damit seine Konkurrenz abwehrt.\n\n**Wirkungsweise**: Es blockiert am Cytochrom-bc₁-Komplex die Atmungskette der Pilzzelle, die dadurch keine Energie mehr gewinnt. Der Angriffspunkt ist eng — genau das macht die Gruppe wirksam und zugleich resistenzanfällig.\n\n**Das Spektrum ist breit** und umfasst Roste, Echten Mehltau, Netzflecken, Ramularia, Alternaria sowie Krankheiten in Obst, Gemüse und Sonderkulturen. Azoxystrobin wirkt vorbeugend und ist im Blatt systemisch verteilbar.\n\n**Die entscheidende Einschränkung in Mitteleuropa:** Gegen die **Blattdürre des Weizens** (*Zymoseptoria tritici*) ist Azoxystrobin praktisch wirkungslos. Die Punktmutation **G143A** hat die Bindung an das Zielprotein aufgehoben und sich ab 2002/2003 innerhalb weniger Jahre in ganz Europa durchgesetzt. Wer ein Strobilurin gegen Septoria einsetzt, zahlt für eine Wirkung, die es nicht mehr gibt — im Getreide ist es deshalb heute Mischpartner für Roste, nicht Septoria-Baustein.\n\nDer oft beworbene **Greening-Effekt** — Bestände bleiben länger grün — ist real, hat aber zwei Seiten: Er kann die Kornfüllung verlängern, aber auch die Abreife verzögern und den Drusch erschweren.\n\nZulassungen sind kulturspezifisch und national; maßgeblich sind die Register von BVL und BAES.",
    "related": [
      "fungicidy",
      "ucinna-latka",
      "moreni-osiva",
      "rezistence-pesticidy"
    ],
    "externalUrl": "https://de.wikipedia.org/wiki/Azoxystrobin",
    "externalLabel": "Wikipedia: Azoxystrobin",
    "faq": [
      {
        "q": "Wogegen wirkt Azoxystrobin?",
        "a": "Gegen Roste, Echten Mehltau, Netzflecken, Ramularia und Alternaria sowie viele Krankheiten in Obst und Gemüse — gegen Septoria im Weizen jedoch nicht mehr."
      },
      {
        "q": "Wie wirkt Azoxystrobin?",
        "a": "Es blockiert die mitochondriale Atmungskette der Pilzzelle am Cytochrom-bc₁-Komplex."
      }
    ]
  },
  {
    "slug": "prothiokonazol",
    "term": "Prothioconazol",
    "alias": [
      "Triazol",
      "DMI-Fungizid"
    ],
    "kategorie": "ochrana",
    "shortDef": "Prothioconazol ist das wichtigste Azol im mitteleuropäischen Getreidebau und der Standard gegen Ährenfusariose.",
    "longDef": "Prothioconazol gehört zur Gruppe der Azole und hemmt die Ergosterolbiosynthese, also den Aufbau der Pilzzellmembran. Anders als ältere Triazole ist es ein **Triazolinthion** — chemisch eine eigene Untergruppe, die ihm ein etwas anderes Wirkungs- und Resistenzprofil verschafft.\n\n**Warum es im Getreide so zentral ist**: Sein Spektrum deckt Septoria, Roste, Halmbruch, Netzflecken und Rhynchosporium ab, im Raps zusätzlich Phoma und Sclerotinia. Vor allem aber ist es zusammen mit Metconazol der **Standard gegen Ährenfusariose**, und diese Anwendung hat eine Bedeutung, die über den Ertrag hinausgeht: Fusarium bildet **Mykotoxine**, allen voran Deoxynivalenol (DON), für die es in Lebens- und Futtermitteln gesetzliche Höchstgehalte gibt. Eine Partie, die den DON-Grenzwert überschreitet, ist nicht vermarktungsfähig — die Ährenbehandlung ist damit weniger eine Ertrags- als eine Qualitäts- und Verkehrsfähigkeitsfrage.\n\n**Der richtige Termin** ist eng: Behandelt wird zur Blüte, BBCH 61 bis 65, und zwar innerhalb weniger Tage nach einem infektionsgünstigen Regenereignis. Prognosemodelle der Länderdienste unterstützen die Entscheidung.\n\n**Zum Resistenzstatus**: Die Empfindlichkeit von Septoria gegenüber Azolen hat über die Jahre nachgelassen, Prothioconazol hält sich aber besser als ältere Vertreter. Es wird deshalb praktisch immer in Mischung mit einem SDHI oder einem Multisite-Partner eingesetzt — solo verschärft es den Selektionsdruck.\n\nEntscheidend bleibt: Die Fusariumbekämpfung ist zu drei Vierteln ackerbaulich. Vorfrucht — Mais ist die kritische —, Bodenbearbeitung mit Zerkleinerung der Stoppeln und Sortenwahl bestimmen den Ausgangsdruck; das Fungizid korrigiert nur den Rest.",
    "related": [
      "fungicidy",
      "ucinna-latka",
      "moreni-osiva",
      "rezistence-pesticidy"
    ],
    "externalUrl": "https://de.wikipedia.org/wiki/Prothioconazol",
    "externalLabel": "Wikipedia: Prothioconazol",
    "faq": [
      {
        "q": "Gegen welche Krankheiten wirkt Prothioconazol?",
        "a": "Gegen Septoria, Roste, Halmbruch, Netzflecken und Rhynchosporium im Getreide sowie Phoma und Sclerotinia im Raps — vor allem aber gegen Ährenfusariose."
      },
      {
        "q": "Wann wird Prothioconazol angewendet?",
        "a": "Gegen Fusarium zur Blüte in BBCH 61 bis 65, möglichst kurz nach einem infektionsgünstigen Regenereignis."
      }
    ]
  },
  {
    "slug": "jetel-lucni",
    "term": "Rotklee",
    "alias": [
      "Trifolium pratense",
      "Wiesenklee"
    ],
    "kategorie": "plodiny",
    "shortDef": "Rotklee ist eine mehrjährige Futterleguminose mit hohem Eiweißgehalt, die Luftstickstoff bindet und die Bodenstruktur verbessert.",
    "longDef": "Rotklee (*Trifolium pratense*) ist eine zwei- bis dreijährige Leguminose mit kräftiger Pfahlwurzel. Über die Symbiose mit Knöllchenbakterien der Gattung *Rhizobium* bindet ein Bestand **150 bis 250 kg Luftstickstoff je Hektar und Jahr** — die Grundlage der Nährstoffversorgung im Ökolandbau und ein erheblicher Vorfruchtwert auch im konventionellen Betrieb, wo 40 bis 80 kg N für die Folgekultur nachgeliefert werden.\n\n**Futterwert**: 16 bis 20 % Rohprotein in der Trockenmasse, hohe Schmackhaftigkeit, zwei bis vier Schnitte je Jahr. Meist wird er im **Kleegras** mit Deutschem Weidelgras oder Wiesenschwingel angebaut — die Mischung ist ertragssicherer, siliert besser und liefert ein günstigeres Energie-Eiweiß-Verhältnis als Reinsaat.\n\nDie Pfahlwurzel dringt tief ein und hinterlässt stabile Bioporen, die Verdichtungen durchbrechen. Als mehrjähriger Bestand unterdrückt Kleegras zudem Ungräser wirksam — im Ökolandbau der wichtigste Hebel gegen Acker-Fuchsschwanz.\n\n**Was zu beachten ist**: Rotklee ist **kleemüdigkeitsempfindlich**. Bei zu enger Wiederkehr treten Kleekrebs (*Sclerotinia trifoliorum*) und Nematoden auf; einzuhalten sind mindestens vier bis fünf Jahre Anbaupause. Beim Verfüttern an tragende Tiere sind die **Phytoöstrogene** zu beachten, die in großen Mengen die Fruchtbarkeit beeinträchtigen können, und beim Weiden von Frischbestand droht **Blähsucht (Tympanie)** — Klee sollte angewelkt oder zusammen mit strukturreichem Futter angeboten werden.\n\nFörderrechtlich zählt Kleegras zu den Leguminosen und kann in Deutschland zur Erfüllung von GLÖZ 8 sowie in Agrarumweltmaßnahmen genutzt werden.",
    "related": [
      "zelene-hnojeni",
      "hnuj",
      "organicka-hmota",
      "pH-pudy"
    ],
    "externalUrl": "https://de.wikipedia.org/wiki/Rot-Klee",
    "externalLabel": "Wikipedia: Rot-Klee",
    "faq": [
      {
        "q": "Wozu wird Rotklee angebaut?",
        "a": "Als eiweißreiches Futter und zur Stickstoffbindung — ein Bestand fixiert 150 bis 250 kg Luftstickstoff je Hektar und Jahr."
      },
      {
        "q": "Welche Ansprüche stellt Rotklee an den Boden?",
        "a": "Er bevorzugt tiefgründige, gut durchlüftete Böden mit einem pH um 6 bis 7 und verträgt Staunässe schlecht."
      }
    ]
  },
  {
    "slug": "lupina",
    "term": "Lupine",
    "alias": [
      "Süßlupine",
      "Blaue Lupine",
      "Lupinus"
    ],
    "kategorie": "plodiny",
    "shortDef": "Die Lupine ist eine eiweißreiche Körnerleguminose, die auch auf leichten, sauren Böden gedeiht, wo andere Leguminosen versagen.",
    "longDef": "Angebaut werden drei Arten: die **Blaue oder Schmalblättrige Lupine** (*Lupinus angustifolius*) als wichtigste in Mitteleuropa, die **Weiße Lupine** (*L. albus*) mit höherem Ertrag, aber größerer Anfälligkeit, und die **Gelbe Lupine** (*L. luteus*) für die leichtesten Standorte.\n\n**Ihre Nische ist eindeutig**: Sie ist die Leguminose für **leichte, saure Sandböden**. Wo die Ackerbohne zu trocken steht und die Erbse den pH nicht mag, liefert die Lupine noch. Sie erschließt mit ihrer kräftigen Pfahlwurzel zudem festgelegten Phosphor, den andere Kulturen nicht erreichen. Auf kalkhaltigen Böden über pH 6,5 versagt sie dagegen — Kalkchlorose.\n\n**Der Eiweißgehalt** liegt mit 32 bis 40 % in der Trockenmasse über dem der Ackerbohne und nahe an der Sojabohne, was sie für die heimische Eiweißversorgung interessant macht. Moderne **Süßlupinen** sind auf niedrigen Alkaloidgehalt gezüchtet und damit verfütterbar; Bitterlupinen sind es nicht.\n\n**Das größte Anbaurisiko ist die Anthraknose** (*Colletotrichum lupini*), eine samen- und wetterbürtige Pilzkrankheit, die Bestände vollständig vernichten kann. Sie hat den Lupinenanbau in Deutschland in den 1990er-Jahren fast zum Erliegen gebracht. Gegenmittel sind gesundes, geprüftes Saatgut, tolerante Sorten und weite Anbaupausen von mindestens vier Jahren.\n\nFörderrechtlich zählt die Lupine als Leguminose und kann zur Erfüllung von GLÖZ 8 sowie in Eiweißpflanzenförderprogrammen der Bundesländer genutzt werden.",
    "related": [
      "zelene-hnojeni",
      "organicka-hmota",
      "pH-pudy",
      "hnuj"
    ],
    "externalUrl": "https://de.wikipedia.org/wiki/Lupinen",
    "externalLabel": "Wikipedia: Lupinen",
    "faq": [
      {
        "q": "Wofür wird die Lupine angebaut?",
        "a": "Als eiweißreiches Futter, als Körnerleguminose für die Humanernährung und zur Gründüngung."
      },
      {
        "q": "Welche Vorteile hat der Lupinenanbau?",
        "a": "Sie bindet Luftstickstoff, gedeiht auf leichten sauren Böden, erschließt festgelegten Phosphor und hat einen sehr hohen Eiweißgehalt."
      }
    ]
  },
  {
    "slug": "bob-polni",
    "term": "Ackerbohne",
    "alias": [
      "Vicia faba",
      "Pferdebohne",
      "Puffbohne"
    ],
    "kategorie": "plodiny",
    "shortDef": "Die Ackerbohne ist die ertragsstärkste heimische Körnerleguminose — anspruchsvoll beim Wasser, dafür mit hohem Vorfruchtwert.",
    "longDef": "Die Ackerbohne (*Vicia faba*) ist eine großkörnige Leguminose mit einer Tausendkornmasse von 400 bis 700 g. Sie bindet über Knöllchenbakterien 100 bis 200 kg Luftstickstoff je Hektar und hinterlässt der Folgekultur 40 bis 60 kg — der Weizen nach Ackerbohne bringt regelmäßig 5 bis 10 % Mehrertrag gegenüber Weizen nach Weizen.\n\n**Der begrenzende Faktor ist Wasser.** Die Ackerbohne hat den höchsten Wasserbedarf aller heimischen Körnerleguminosen und reagiert auf Trockenheit während der Blüte mit massivem Blüten- und Hülsenabwurf. Ihre Standorte sind deshalb tiefgründige, wasserhaltende Böden in niederschlagssicheren Lagen — auf leichten Sandböden gehört stattdessen die [[lupina]] hin. Kalk verträgt sie gut, ein pH um 6,5 bis 7,5 ist ideal.\n\n**Der Eiweißgehalt** liegt bei 26 bis 32 %. In der Fütterung ist sie besonders für Wiederkäuer und Schweine geeignet; begrenzend sind Tannine und Vicin/Convicin, die in modernen Sorten deutlich abgesenkt sind.\n\n**Schaderreger**: Der **Schwarze Bohnenblattlaus** und der **Blattrandkäfer** sind die wichtigsten tierischen Schädlinge, bei den Pilzen Schokoladenflecken (*Botrytis fabae*) und Rost. Wie alle Leguminosen ist sie **selbstunverträglich** — mindestens vier bis fünf Jahre Anbaupause, sonst drohen Fußkrankheiten und Nematoden.\n\nEin unterschätzter Nebeneffekt: Die Ackerbohne ist eine ausgezeichnete **Bienenweide** und liefert in einer Zeit Tracht, in der nach der Rapsblüte oft ein Trachtloch klafft.",
    "related": [
      "zelene-hnojeni",
      "organicka-hmota",
      "hnuj",
      "pH-pudy"
    ],
    "externalUrl": "https://de.wikipedia.org/wiki/Ackerbohne",
    "externalLabel": "Wikipedia: Ackerbohne",
    "faq": [
      {
        "q": "Wofür wird die Ackerbohne angebaut?",
        "a": "Als eiweißreiches Futter für Wiederkäuer und Schweine, zunehmend auch für die Humanernährung, und wegen ihres hohen Vorfruchtwerts."
      },
      {
        "q": "Welchen Standort braucht die Ackerbohne?",
        "a": "Tiefgründige, wasserhaltende Böden in niederschlagssicheren Lagen — sie ist die trockenheitsempfindlichste heimische Körnerleguminose."
      }
    ]
  },
  {
    "slug": "proso",
    "term": "Rispenhirse",
    "alias": [
      "Panicum miliaceum",
      "Echte Hirse",
      "Millet"
    ],
    "kategorie": "plodiny",
    "shortDef": "Die Rispenhirse ist ein anspruchsloses, glutenfreies Sommergetreide mit sehr kurzer Vegetationszeit und geringem Wasserbedarf.",
    "longDef": "Die Rispenhirse (*Panicum miliaceum*) ist eine der ältesten Kulturpflanzen überhaupt — in Mitteleuropa seit der Bronzezeit belegt und bis ins Mittelalter ein Grundnahrungsmittel, das erst von Kartoffel und Weizen verdrängt wurde.\n\n**Ihre Stärken sind Trockenheitstoleranz und Schnelligkeit.** Als C4-Pflanze nutzt sie Wasser deutlich effizienter als Weizen und kommt mit einem Bruchteil des Bedarfs aus. Die Vegetationszeit beträgt nur 60 bis 90 Tage — kürzer als bei jeder anderen Getreideart. Das macht sie zur klassischen **Notfrucht**: Wenn ein Winterbestand ausgewintert ist oder eine Frühjahrsbestellung misslingt, lässt sich noch bis in den Juni Hirse säen und ernten.\n\nGenau darin liegt ihr wachsendes Interesse für Mitteleuropa. Mit zunehmenden Frühsommertrockenheiten rückt eine Kultur in den Blick, die geringe Ansprüche mit kurzer Standzeit verbindet.\n\n**Als glutenfreies Getreide** hat sie zudem einen sicheren Absatz in der Zöliakie- und Naturkostschiene, wo sie deutlich höhere Preise erzielt als Futtergetreide. Verwendet wird sie als Grütze, Mehl, in Flocken und Backwaren sowie als Vogelfutter.\n\n**Die Schwächen** sind eine ausgeprägte Kälteempfindlichkeit — gesät wird erst ab 12 °C Bodentemperatur — und die schwache Jugendentwicklung, die den Bestand gegenüber Unkraut anfällig macht. Zugelassene Herbizide gibt es kaum, weshalb ein sauberes Feld und mechanische Regulierung entscheidend sind.",
    "related": [
      "osevni-postup",
      "organicka-hmota",
      "pH-pudy",
      "hnuj"
    ],
    "externalUrl": "https://de.wikipedia.org/wiki/Rispenhirse",
    "externalLabel": "Wikipedia: Rispenhirse",
    "faq": [
      {
        "q": "Wofür wird Rispenhirse angebaut?",
        "a": "Für glutenfreie Lebensmittel, als Vogelfutter und als schnelle Notfrucht nach misslungener Bestellung."
      },
      {
        "q": "Welche Vorteile hat der Hirseanbau?",
        "a": "Sehr geringer Wasserbedarf, kurze Vegetationszeit von 60 bis 90 Tagen und niedrige Ansprüche an den Boden."
      }
    ]
  },
  {
    "slug": "cirok",
    "term": "Sorghum",
    "alias": [
      "Mohrenhirse",
      "Sorghum bicolor",
      "Sudangras"
    ],
    "kategorie": "plodiny",
    "shortDef": "Sorghum ist eine trockenheitstolerante C4-Pflanze, die in Mitteleuropa als klimawandelrobuste Alternative zum Silomais an Bedeutung gewinnt.",
    "longDef": "Sorghum (*Sorghum bicolor*) ist weltweit die fünftwichtigste Getreideart und in Afrika und Südasien Grundnahrungsmittel. In Mitteleuropa wird es fast ausschließlich als **Futter- und Energiepflanze** angebaut, in zwei Nutzungsrichtungen: **Körnersorghum** und die massewüchsigen **Sudangras- und Zuckerhirsetypen** für die Silage.\n\n**Warum es zunehmend interessiert**: Sorghum braucht etwa ein Drittel weniger Wasser als Mais für dieselbe Trockenmasse und hat ein bemerkenswertes Sicherheitsverhalten — bei Trockenstress stellt es das Wachstum vorübergehend ein und nimmt es nach Niederschlag wieder auf, statt endgültig abzureifen. In Trockenjahren, in denen der Silomais schon im Juli notreif ist, liefert Sorghum noch. Sein tiefes, feines Wurzelsystem verbessert zudem die Bodenstruktur.\n\nHinzu kommt ein Argument, das in Maisregionen zunehmend zählt: Sorghum ist **kein Wirt des Westlichen Maiswurzelbohrers** und damit ein wertvolles Fruchtfolgeglied dort, wo der Maisanbau amtlich begrenzt ist — siehe [[bazlivec-kukuricny]].\n\n**Die Grenzen** liegen in der Kälteempfindlichkeit — gesät wird erst ab 12 bis 14 °C Bodentemperatur, also nach dem Mais —, im geringeren Energiegehalt der Silage, weil der Kolbenanteil fehlt, und in der sehr schmalen Herbizidzulassung.\n\n**Ein Sicherheitshinweis zur Fütterung**: Junge Sorghumpflanzen und Wiederaustrieb nach Trockenstress oder Frost können **cyanogene Glykoside** enthalten, die Blausäure freisetzen. Grünfütterung und Beweidung sind erst ab einer Wuchshöhe von etwa 60 bis 80 cm unbedenklich; im Silierprozess baut sich die Blausäure ab.",
    "related": [
      "osevni-postup",
      "organicka-hmota",
      "pH-pudy",
      "hnuj"
    ],
    "externalUrl": "https://de.wikipedia.org/wiki/Mohrenhirse",
    "externalLabel": "Wikipedia: Mohrenhirse",
    "faq": [
      {
        "q": "Wofür wird Sorghum angebaut?",
        "a": "In Mitteleuropa vor allem als Silage für Rinderfütterung und Biogas, weltweit auch als Brotgetreide."
      },
      {
        "q": "Welche Vorteile hat Sorghum gegenüber Mais?",
        "a": "Deutlich geringerer Wasserbedarf, Erholung nach Trockenstress und keine Wirtseignung für den Maiswurzelbohrer."
      }
    ]
  },
  {
    "slug": "pohanka",
    "term": "Buchweizen",
    "alias": [
      "Fagopyrum esculentum",
      "Heidekorn"
    ],
    "kategorie": "plodiny",
    "shortDef": "Buchweizen ist ein glutenfreies Pseudogetreide mit sehr kurzer Vegetationszeit — zugleich eine der besten Bienenweiden im Spätsommer.",
    "longDef": "Buchweizen (*Fagopyrum esculentum*) ist trotz des Namens kein Getreide, sondern ein Knöterichgewächs und damit botanisch mit Rhabarber und Sauerampfer verwandt. Als **Pseudogetreide** liefert er stärkereiche Körner, ist aber vollständig **glutenfrei**.\n\n**Ernährungsphysiologisch** ist er bemerkenswert: hochwertiges Eiweiß mit allen essenziellen Aminosäuren, darunter das in Getreide fehlende Lysin, und ein hoher Gehalt an **Rutin**, einem Flavonoid mit gefäßschützender Wirkung, das ihn zur Rohstoffquelle für die Pharmazie macht.\n\n**Im Anbau ist er ein Sonderling.** Die Vegetationszeit beträgt nur 70 bis 100 Tage, weshalb er noch als **Zweitfrucht nach der Gerstenernte** gesät werden kann. Er gedeiht auf armen, sauren Sandböden, wo kaum etwas anderes wächst — historisch die Kultur der Heidegebiete, daher der Name Heidekorn. Stickstoff braucht er kaum; überversorgt neigt er zu Lager. Seine dichte Blattmasse und die Wurzelausscheidungen unterdrücken Unkraut wirksam, weshalb er auch als Zwischenfrucht und in Blühmischungen geschätzt wird.\n\n**Als Bienenweide** ist er herausragend: Er blüht von Juli bis September, also genau im spätsommerlichen Trachtloch, und liefert einen dunklen, kräftig-malzigen Sortenhonig.\n\n**Die Schwächen** sind ausgeprägt: äußerste **Frostempfindlichkeit** — schon leichter Frost vernichtet den Bestand —, ungleichmäßige Abreife, weil an derselben Pflanze gleichzeitig Blüten und reife Körner sitzen, und daraus folgend hohe Ernteverluste durch Ausfall. Herbizide sind praktisch nicht zugelassen.",
    "related": [
      "osevni-postup",
      "organicka-hmota",
      "pH-pudy",
      "hnuj"
    ],
    "externalUrl": "https://de.wikipedia.org/wiki/Echter_Buchweizen",
    "externalLabel": "Wikipedia: Buchweizen",
    "faq": [
      {
        "q": "Wofür wird Buchweizen angebaut?",
        "a": "Für glutenfreie Lebensmittel, als Rutinlieferant für die Pharmazie, als Zwischenfrucht und als Bienenweide."
      },
      {
        "q": "Wie wird Buchweizen angebaut?",
        "a": "Er wird spät gesät, kommt auf armen sauren Böden zurecht, braucht kaum Stickstoff und ist nach 70 bis 100 Tagen erntereif — er verträgt jedoch keinen Frost."
      }
    ]
  },
  {
    "slug": "svazenka",
    "term": "Phacelia",
    "alias": [
      "Rainfarn-Phazelie",
      "Büschelschön",
      "Phacelia tanacetifolia"
    ],
    "kategorie": "plodiny",
    "shortDef": "Phacelia ist die meistgenutzte Zwischenfrucht Mitteleuropas — mit keiner Ackerkultur verwandt und damit in jede Fruchtfolge passend.",
    "longDef": "Die Rainfarn-Phazelie (*Phacelia tanacetifolia*) ist eine einjährige Pflanze aus der Familie der Raublattgewächse. Sie ist die am weitesten verbreitete Zwischenfrucht in Deutschland und Österreich — aus einem Grund, der in der Praxis alles entscheidet.\n\n**Sie ist mit keiner heimischen Ackerkultur verwandt.** Weder mit Kreuzblütlern wie Raps, Senf und Ölrettich, noch mit Gräsern, noch mit Leguminosen, noch mit Rüben. Deshalb überträgt sie keine Fruchtfolgekrankheiten und vermehrt keine Nematoden — sie passt in jede Fruchtfolge, auch in die rapsstarke, in der Senf und Ölrettich wegen Kohlhernie und Sklerotinia ausscheiden. Genau darum ist sie so beliebt.\n\n**Was sie leistet**: rasche Jugendentwicklung und dichte Bodenbedeckung binnen sechs bis acht Wochen, wirksame Unkrautunterdrückung, Aufnahme von 40 bis 80 kg Reststickstoff je Hektar, der sonst über Winter ausgewaschen würde, feines Wurzelsystem für die Krümelstruktur und zuverlässiges **Abfrieren** bei etwa −5 bis −8 °C. Das Abfrieren ist ein praktischer Vorteil: Der Bestand muss im Frühjahr nicht mechanisch oder chemisch beseitigt werden, sondern bildet eine Mulchdecke für die Mulchsaat.\n\n**Als Bienenweide** ist sie außerordentlich ergiebig und blüht bis in den Herbst hinein — sie gehört zu den Standardkomponenten von Blühmischungen.\n\n**Förderrechtlich** ist sie in Deutschland an mehreren Stellen anrechenbar: als Winterbegrünung nach GLÖZ 6, zur Erfüllung von GLÖZ 8, in den Agrarumweltmaßnahmen der Länder und als vorgeschriebene Zwischenfrucht in den roten Gebieten nach Düngeverordnung.",
    "related": [
      "zelene-hnojeni",
      "osevni-postup",
      "organicka-hmota"
    ],
    "externalUrl": "https://de.wikipedia.org/wiki/Rainfarn-Phazelie",
    "externalLabel": "Wikipedia: Phacelia",
    "faq": [
      {
        "q": "Wozu dient Phacelia?",
        "a": "Als Zwischenfrucht zur Gründüngung, Nährstoffbindung und Unkrautunterdrückung sowie als hervorragende Bienenweide."
      },
      {
        "q": "Warum passt Phacelia in jede Fruchtfolge?",
        "a": "Weil sie mit keiner heimischen Ackerkultur verwandt ist und deshalb keine Fruchtfolgekrankheiten überträgt."
      }
    ]
  },
  {
    "slug": "cizrna",
    "term": "Kichererbse",
    "alias": [
      "Cicer arietinum"
    ],
    "kategorie": "plodiny",
    "shortDef": "Die Kichererbse ist eine trockenheitstolerante Körnerleguminose, die im Zuge des Klimawandels auch in Mitteleuropa erprobt wird.",
    "longDef": "Die Kichererbse (*Cicer arietinum*) gehört zu den ältesten Kulturpflanzen des Vorderen Orients. Ihr Anbauschwerpunkt liegt in Indien, der Türkei und rund ums Mittelmeer; nach Mitteleuropa kommt sie erst jetzt — getrieben von zwei Entwicklungen zugleich.\n\n**Die Nachfrage** ist in den letzten Jahren stark gestiegen, weil Hummus und pflanzliche Proteinprodukte in den Massenmarkt gewandert sind. Und **das Klima** kommt ihr entgegen: Sie ist deutlich trockenheitstoleranter als Erbse und Ackerbohne und verträgt Hitze in der Blüte, die der Ackerbohne die Hülsen kostet. In trockenen Weinbau- und Sommergebieten Deutschlands und Österreichs laufen entsprechend Anbauversuche mit ermutigenden Ergebnissen.\n\n**Wie jede Leguminose** bindet sie Luftstickstoff über Knöllchenbakterien — allerdings über einen eigenen, spezifischen Rhizobienstamm, der in mitteleuropäischen Böden nicht natürlich vorkommt. **Das Saatgut muss deshalb geimpft werden**; ohne Impfung bleibt die Knöllchenbildung aus und der Bestand hungert.\n\n**Ernährungsphysiologisch** liefert sie 20 bis 25 % Eiweiß, viel Ballaststoffe, Eisen und Folsäure.\n\n**Die Risiken sind erheblich.** Die **Askochyta-Blattfleckenkrankheit** (*Ascochyta rabiei*) kann bei feuchter Witterung ganze Bestände vernichten und ist der Hauptgrund, warum der Anbau nördlich der Alpen unsicher bleibt. Hinzu kommen eine schwache Jugendentwicklung mit entsprechendem Unkrautdruck, kaum zugelassene Herbizide, ungleichmäßige Abreife und die Notwendigkeit trockener Erntebedingungen. Kichererbsen brauchen einen warmen, trockenen Spätsommer — in einem nassen Jahr ist die Ernte verloren.",
    "related": [
      "hnuj",
      "zelene-hnojeni",
      "osevni-postup",
      "organicka-hmota"
    ],
    "externalUrl": "https://de.wikipedia.org/wiki/Kichererbse",
    "externalLabel": "Wikipedia: Kichererbse",
    "faq": [
      {
        "q": "Welchen Nährwert hat die Kichererbse?",
        "a": "20 bis 25 % Eiweiß sowie viel Ballaststoffe, Eisen und Folsäure."
      },
      {
        "q": "Lässt sich die Kichererbse in Mitteleuropa anbauen?",
        "a": "In warmen, trockenen Lagen ja — sie ist trockenheitstolerant, aber sehr anfällig für die Askochyta-Blattfleckenkrankheit bei feuchter Witterung."
      }
    ]
  },
  {
    "slug": "vdj",
    "term": "Großvieheinheit (GV)",
    "alias": [
      "GV",
      "Großvieheinheit",
      "Vieheinheit"
    ],
    "kategorie": "chov",
    "shortDef": "Die Großvieheinheit ist die Rechengröße, mit der Tierbestände unterschiedlicher Arten vergleichbar gemacht werden — 1 GV entspricht 500 kg Lebendgewicht.",
    "longDef": "Die Großvieheinheit (GV) ist eine Umrechnungsgröße: **1 GV entspricht 500 kg Lebendgewicht.** Damit lassen sich Rinder, Schweine, Schafe und Geflügel auf einen gemeinsamen Nenner bringen und Bestände sinnvoll vergleichen.\n\n**Gebräuchliche Umrechnungsschlüssel:**\n\n| Tierkategorie | GV |\n|---|---|\n| Milchkuh, Zuchtbulle | 1,0 |\n| Jungrind über 1 Jahr | 0,6 bis 0,7 |\n| Kalb bis 1/2 Jahr | 0,3 |\n| Zuchtsau mit Ferkeln | 0,3 |\n| Mastschwein | 0,12 |\n| Schaf, Ziege | 0,1 |\n| Legehenne | 0,0034 |\n\n**Wozu die Größe im Alltag gebraucht wird**, ist der eigentliche Punkt: Fast alle Vorgaben zur Tierhaltung sind nicht in Tierzahlen, sondern in **GV je Hektar** formuliert — die **Besatzdichte**.\n\nSie entscheidet über die Einhaltung der Obergrenze von 170 kg Stickstoff aus organischer Düngung je Hektar und Jahr nach Düngeverordnung, über die im **Ökolandbau** zulässige Höchstbesatzdichte von 2 GV je Hektar, über die Einstufung als landwirtschaftlicher oder gewerblicher Betrieb im Bau- und Steuerrecht, über die Schwellen des Immissionsschutz- und Genehmigungsrechts sowie über die Bemessung mancher Förderungen und der Beiträge zur Tierseuchenkasse.\n\nEine grobe, aber im Kopf brauchbare Faustzahl: **1 GV erzeugt rund 80 bis 100 kg Stickstoff im Wirtschaftsdünger je Jahr.** Wer also 170 kg N/ha nicht überschreiten will, landet ohne Gülleabgabe bei etwa zwei GV je Hektar.",
    "related": [
      "vykrm-skotu",
      "odchov-telat",
      "krizeni-plemen"
    ],
    "externalUrl": "https://de.wikipedia.org/wiki/Grovieheinheit",
    "externalLabel": "Wikipedia: Großvieheinheit",
    "faq": [
      {
        "q": "Wie wird die Großvieheinheit berechnet?",
        "a": "1 GV entspricht 500 kg Lebendgewicht; je Tierkategorie gelten feste Umrechnungsschlüssel — eine Milchkuh 1,0 GV, ein Mastschwein 0,12 GV."
      },
      {
        "q": "Wozu dient die Großvieheinheit?",
        "a": "Zur Berechnung der Besatzdichte je Hektar, an der Düngeverordnung, Ökoverordnung sowie Bau- und Genehmigungsrecht anknüpfen."
      }
    ]
  },
  {
    "slug": "ecm-mleko",
    "term": "ECM — energiekorrigierte Milch",
    "alias": [
      "ECM",
      "energiekorrigierte Milchmenge"
    ],
    "kategorie": "chov",
    "shortDef": "Die ECM rechnet die Milchmenge auf einen einheitlichen Fett- und Eiweißgehalt um und macht Leistungen erst wirklich vergleichbar.",
    "longDef": "Die energiekorrigierte Milch normiert die Milchmenge auf einen Standardgehalt von **4,0 % Fett und 3,4 % Eiweiß**. Erst dadurch werden Tiere, Herden und Rassen vergleichbar — denn Milch ist nicht gleich Milch.\n\n**Warum das nötig ist**, zeigt ein Beispiel: Eine Holsteinkuh mit 40 kg Milch bei 3,6 % Fett und 3,1 % Eiweiß und eine Fleckviehkuh mit 34 kg bei 4,3 % Fett und 3,6 % Eiweiß sehen im Kontrollbericht weit auseinander aus. Umgerechnet auf ECM liegen sie nahe beieinander — und für die Molkerei, die nach Inhaltsstoffen bezahlt, und für den Futtertisch, an dem Energie verbraucht wird, zählt genau das.\n\n**Die gebräuchliche Formel** lautet:\n\n**ECM = kg Milch × (0,38 × Fett % + 0,21 × Eiweiß % + 1,05) ÷ 3,28**\n\n**Wofür sie tatsächlich gebraucht wird:**\n- **Futtereffizienz** — kg ECM je kg aufgenommener Trockenmasse; ein Zielwert um 1,5 gilt als gut. Ohne Korrektur bewertet diese Kennzahl fettarme Milch systematisch zu gut\n- **Rassenvergleich** — Holstein gegen Fleckvieh oder Braunvieh lässt sich anders nicht seriös führen\n- **Emissionsrechnungen** — Treibhausgase je kg ECM sind der international übliche Bezug\n- **Rationsplanung und Herdencontrolling**\n\nIn der deutschen und österreichischen Milchleistungsprüfung wird die ECM standardmäßig ausgewiesen, siehe [[ku-kontrola-uzitkovosti]].",
    "related": [
      "laktacni-krivka",
      "vykrm-skotu",
      "odchov-telat",
      "krizeni-plemen"
    ],
    "faq": [
      {
        "q": "Wie wird ECM berechnet?",
        "a": "ECM = kg Milch × (0,38 × Fett % + 0,21 × Eiweiß % + 1,05) ÷ 3,28 — normiert auf 4,0 % Fett und 3,4 % Eiweiß."
      },
      {
        "q": "Wozu dient die ECM?",
        "a": "Sie macht Milchleistungen unterschiedlicher Tiere und Rassen vergleichbar und ist die Bezugsgröße für Futtereffizienz und Emissionsberechnungen."
      }
    ]
  },
  {
    "slug": "zaprahnuti",
    "term": "Trockenstellen",
    "alias": [
      "Trockenperiode",
      "Trockenstehzeit",
      "Galtzeit"
    ],
    "kategorie": "chov",
    "shortDef": "Das Trockenstellen ist die Melkpause vor der Kalbung, in der sich das Eutergewebe regeneriert — Zielgröße sind sechs bis acht Wochen.",
    "longDef": "Beim Trockenstellen wird die Kuh etwa **sechs bis acht Wochen vor dem errechneten Kalbetermin** nicht mehr gemolken. Die Zeit ist keine Pause im Betriebsablauf, sondern eine der wirtschaftlich wirksamsten Phasen überhaupt.\n\n**Was in dieser Zeit geschieht:** Das Drüsengewebe des Euters wird vollständig zurückgebildet und neu aufgebaut — ohne diesen Zyklus fällt die Leistung der Folgelaktation um 20 bis 30 %. Bestehende Euterinfektionen können ausheilen, und das Kalb legt in den letzten Wochen den größten Teil seines Wachstums zu.\n\n**Zu kurz oder zu lang ist beides schlecht.** Unter 40 Tagen reicht die Regeneration nicht; über 70 Tage verfettet die Kuh, was direkt in Schwergeburt, Ketose und Fettleber führt — siehe [[bcs-body-condition]].\n\n**Die rechtliche Lage hat sich grundlegend geändert.** Jahrzehntelang war das **antibiotische Trockenstellen aller Kühe** Standard. Seit dem Inkrafttreten der EU-Tierarzneimittelverordnung (EU) 2019/6 im Jahr 2022 ist der routinemäßige vorbeugende Einsatz von Antibiotika **nicht mehr zulässig**. Vorgeschrieben ist damit das **selektive Trockenstellen**: Antibiotika nur bei Tieren mit nachgewiesener Euterinfektion, entschieden anhand von Zellzahlverlauf, Vorgeschichte und bakteriologischer Untersuchung. Alle übrigen Kühe erhalten allein einen **internen Zitzenversiegler**, der den Strichkanal mechanisch verschließt und in den ersten Wochen nach dem Trockenstellen — der infektionsanfälligsten Phase — nachweislich gut schützt.\n\n**Praktisch wichtig**: abruptes Trockenstellen ist dem schrittweisen Ausmelken überlegen, die Energiedichte der Ration wird gesenkt, und die Tiere gehören in eine saubere, trockene, ruhige Gruppe. Etwa drei Wochen vor dem Kalben beginnt die Anfütterung der Vorbereitungsration, siehe [[transition-period]].",
    "related": [
      "laktacni-krivka",
      "vykrm-skotu",
      "odchov-telat",
      "krizeni-plemen"
    ],
    "faq": [
      {
        "q": "Was bedeutet Trockenstellen?",
        "a": "Die Melkpause von sechs bis acht Wochen vor der Kalbung, in der sich das Eutergewebe zurückbildet und neu aufbaut."
      },
      {
        "q": "Wie lange dauert die Trockenstehzeit?",
        "a": "In der Regel 42 bis 56 Tage — unter 40 Tagen reicht die Regeneration nicht, über 70 Tage droht Verfettung."
      },
      {
        "q": "Dürfen alle Kühe antibiotisch trockengestellt werden?",
        "a": "Nein. Seit der EU-Tierarzneimittelverordnung 2019/6 ist der routinemäßige vorbeugende Einsatz unzulässig — Standard ist das selektive Trockenstellen."
      }
    ]
  },
  {
    "slug": "stelivo",
    "term": "Einstreu",
    "alias": [
      "Streu",
      "Liegeflächenmaterial"
    ],
    "kategorie": "chov",
    "shortDef": "Einstreu ist das Material auf der Liegefläche, das Feuchtigkeit bindet, wärmt und die Gelenke schont — und über den Keimdruck die Eutergesundheit mitbestimmt.",
    "longDef": "Einstreu erfüllt vier Aufgaben zugleich: Sie **bindet Feuchtigkeit** aus Kot und Harn, **dämmt** gegen den kalten Boden, **polstert** die Liegefläche und schont Gelenke und Sprunggelenke, und sie sorgt für **Trittsicherheit**.\n\n**Die gebräuchlichen Materialien und ihr entscheidender Unterschied:**\n\n- **Stroh** — der Klassiker, gut saugfähig, warm, liefert wertvollen Festmist; verlangt aber viel Arbeit und ist als organisches Material ein guter Nährboden für Bakterien\n- **Sägespäne und Hobelspäne** — sehr saugfähig, sparsam im Verbrauch; Späne aus behandeltem Holz sind unzulässig\n- **Stroh-Kalk-Matratze** — der hohe pH-Wert des gelöschten Kalks hemmt das Bakterienwachstum spürbar\n- **Sand** — der eigentliche Sonderfall: Sand ist **anorganisch** und bietet Umweltkeimen wie *E. coli*, *Klebsiella* und *Streptococcus uberis* deshalb kaum Nährboden. In Studien zur Eutergesundheit schneidet Tiefsandbox regelmäßig am besten ab. Der Preis dafür sind Verschleiß an Entmistungstechnik und Pumpen und die Unverträglichkeit mit vielen Güllesystemen\n- **Separierte Gülle (Grünfaser)** — betriebseigen und billig, aber als warmes organisches Material hygienisch heikel; verlangt saubere Aufbereitung und tägliches Nachstreuen\n- **Gummimatten mit dünner Einstreu** — arbeitssparend, für die Klauengesundheit aber schlechter als eine echte Matratze\n\n**Der Zusammenhang, auf den es ankommt**: Die Liegefläche ist die Hauptquelle umweltassoziierter Euterentzündungen. Nicht das Material allein entscheidet, sondern **wie trocken und sauber es gehalten wird** — zweimal tägliches Abmisten und großzügiges Nachstreuen wirken stärker als die Wahl zwischen zwei Materialien. Siehe [[mastitida]] und [[hluboka-podestylka]].\n\nRechtlich verlangen die Tierschutz-Nutztierhaltungsverordnung und die EU-Ökoverordnung eine trockene, weiche Liegefläche; im Ökolandbau muss sie eingestreut sein.",
    "related": [
      "hluboka-podestylka",
      "laktacni-krivka",
      "vykrm-skotu",
      "odchov-telat"
    ],
    "faq": [
      {
        "q": "Welche Materialien werden als Einstreu verwendet?",
        "a": "Stroh, Säge- und Hobelspäne, Stroh-Kalk-Matratzen, Sand sowie separierte Gülle."
      },
      {
        "q": "Warum ist Einstreu wichtig?",
        "a": "Sie bindet Feuchtigkeit, dämmt, polstert die Liegefläche und bestimmt über den Keimdruck maßgeblich die Eutergesundheit mit."
      }
    ]
  },
  {
    "slug": "hluboka-podestylka",
    "term": "Tiefstreu",
    "alias": [
      "Tiefstreuverfahren",
      "Tretmist",
      "Kompoststall"
    ],
    "kategorie": "chov",
    "shortDef": "Bei der Tiefstreu liegen die Tiere auf einer Streumatratze, die nur nachgestreut und erst nach Wochen oder Monaten ausgemistet wird.",
    "longDef": "Beim Tiefstreuverfahren wird laufend frisches Stroh oder anderes Einstreumaterial nachgelegt, ohne den alten Bestand zu entfernen. Unter der trockenen Oberfläche setzt in der Matratze ein **aerober Rotteprozess** ein, der Wärme erzeugt und Feuchtigkeit bindet. Ausgemistet wird erst nach Wochen bis Monaten, in einem Zug.\n\nEingesetzt wird es in der Mutterkuhhaltung, in der Kälber- und Jungviehaufzucht, in der Bullenmast, in der Schaf- und Ziegenhaltung sowie in der Schweinehaltung auf Stroh. In der Milchviehhaltung findet sich die Variante des **Kompoststalls**, bei der eine tiefe Liegefläche aus Hackschnitzeln oder Sägespänen zweimal täglich mit einer Fräse aufgelockert wird — das hält die Rotte aerob und die Oberfläche trocken.\n\n**Vorteile**: hoher Liegekomfort und weiche Fläche, was Gelenk- und Klauengesundheit fördert; keine tägliche Entmistung; die Rottewärme hilft im Winter; und der entstehende **Festmist** ist ein humusreicher, gut lagerfähiger Dünger, siehe [[hnuj]].\n\n**Nachteile und Grenzen**: hoher Strohbedarf von grob 5 bis 15 kg je Großvieheinheit und Tag; hoher Flächenbedarf je Tier; und die entscheidende Bedingung — **die Matratze muss trocken bleiben**. Wird zu wenig nachgestreut oder gerät der Bereich am Futtertisch und an der Tränke zu nass, kippt die Rotte ins Anaerobe. Dann steigen Keimdruck und Ammoniakbildung, und aus dem Tierwohlvorteil wird ein Gesundheitsrisiko, vor allem für die Eutergesundheit.\n\nÜblich ist deshalb die Kombination aus einem eingestreuten Liegebereich und einem befestigten, planbefestigten oder perforierten Fress- und Laufbereich, der regelmäßig abgeschoben wird.",
    "related": [
      "stelivo",
      "hnuj",
      "odchov-telat",
      "vykrm-skotu"
    ],
    "externalUrl": "https://de.wikipedia.org/wiki/Einstreu",
    "externalLabel": "Wikipedia: Einstreu",
    "faq": [
      {
        "q": "Wie wird eine Tiefstreu gepflegt?",
        "a": "Es wird regelmäßig frisches Material nachgestreut, ohne die alte Schicht zu entfernen; ausgemistet wird erst nach Wochen bis Monaten."
      },
      {
        "q": "Welche Vorteile bietet die Tiefstreu?",
        "a": "Hoher Liegekomfort, Rottewärme im Winter, keine tägliche Entmistung und humusreicher Festmist als Dünger."
      },
      {
        "q": "Welches Material wird verwendet?",
        "a": "Meist Stroh, daneben Sägespäne, Hackschnitzel oder Miscanthus — entscheidend ist ausreichendes Saugvermögen."
      }
    ]
  },
  {
    "slug": "laktacni-krivka",
    "term": "Laktationskurve",
    "alias": [
      "Milchleistungskurve",
      "Laktationsverlauf"
    ],
    "kategorie": "chov",
    "shortDef": "Die Laktationskurve bildet den Verlauf der Milchleistung über die Laktation ab — steiler Anstieg, Höhepunkt und langsamer Abfall.",
    "longDef": "Die Laktationskurve zeigt die tägliche Milchmenge über die Standardlaktation von 305 Tagen. Sie hat einen typischen Verlauf: steiler Anstieg nach der Kalbung, **Höhepunkt zwischen dem 40. und 60. Tag**, danach ein gleichmäßiger Rückgang von etwa 6 bis 8 % je Monat — die **Persistenz**.\n\n**Der entscheidende Punkt liegt am Anfang.** Die Milchleistung steigt schneller als die Futteraufnahme, die ihr Maximum erst um den 70. bis 90. Tag erreicht. Dazwischen klafft ein **negatives Energiedefizit**: Die Kuh mobilisiert Körperfett und verliert an Kondition. Diese Phase entscheidet über Ketose, Fettleber, Klauengesundheit und darüber, ob die Kuh rechtzeitig wieder tragend wird — praktisch alle teuren Probleme der Laktation entstehen hier.\n\n**Was die Kurvenform verrät:**\n- **Hoher Höhepunkt, steiler Abfall** — die Kuh gibt viel, hält es aber nicht; oft Fütterungs- oder Gesundheitsprobleme\n- **Flacher Höhepunkt, gute Persistenz** — wirtschaftlich meist die bessere Kurve, weil die Belastung geringer und die Fruchtbarkeit besser ist\n- **Einbruch mitten in der Laktation** — Hinweis auf Krankheit, Futterwechsel oder Hitzestress\n\nAls Faustregel gilt: **Jedes Kilogramm mehr am Höhepunkt bringt rund 200 kg mehr über die Laktation.** Deshalb zielt das Management der Transitphase genau darauf. Siehe [[transition-period]] und [[bcs-body-condition]].\n\nDie Daten stammen aus der Milchleistungsprüfung; moderne Herdenmanagementprogramme legen die Ist-Kurve über eine Sollkurve und melden Abweichungen automatisch.",
    "related": [
      "ecm-mleko",
      "inseminace",
      "odchov-telat",
      "vykrm-skotu"
    ],
    "externalUrl": "https://de.wikipedia.org/wiki/Laktation",
    "externalLabel": "Wikipedia: Laktation",
    "faq": [
      {
        "q": "Wie verläuft die Laktationskurve?",
        "a": "Steiler Anstieg nach der Kalbung, Höhepunkt um den 40. bis 60. Tag, danach ein Rückgang von 6 bis 8 % je Monat."
      },
      {
        "q": "Wozu dient die Laktationskurve?",
        "a": "Zur Überwachung von Tiergesundheit und Fütterung — Abweichungen vom erwarteten Verlauf zeigen Probleme früh an."
      }
    ]
  },
  {
    "slug": "brakace",
    "term": "Merzung",
    "alias": [
      "Abgang",
      "Remontierung",
      "Selektion"
    ],
    "kategorie": "chov",
    "shortDef": "Merzung ist das gezielte Ausscheiden von Tieren aus der Herde wegen Leistung, Gesundheit oder Fruchtbarkeit.",
    "longDef": "Merzung bezeichnet das Ausscheiden eines Tieres aus dem Bestand. Die **Merzungsrate** — der Anteil der jährlich abgehenden Kühe — liegt in deutschen Milchviehherden bei 30 bis 35 %; die durchschnittliche Nutzungsdauer beträgt damit nur etwa 2,7 bis 3,3 Laktationen.\n\n**Die entscheidende Unterscheidung**, die in der Praxis oft untergeht:\n\nDie **freiwillige Merzung** ist eine Züchtungsentscheidung — ein Tier geht ab, weil ein besseres nachrückt. Sie ist Ausdruck von Zuchtfortschritt und wirtschaftlich sinnvoll.\n\nDie **unfreiwillige Merzung** ist ein Verlust. Das Tier muss gehen, weil es nicht mehr tragend wird, weil Euter oder Klauen nicht mehr mitmachen oder weil es krank ist. Hier gibt es keine Wahl.\n\n**Der eigentliche Kennwert ist deshalb nicht die Merzungsrate, sondern ihr Verhältnis.** Eine Herde mit 32 % Abgängen, von denen zwei Drittel freiwillig sind, ist gesund und züchterisch aktiv. Eine Herde mit denselben 32 %, von denen vier Fünftel auf Unfruchtbarkeit und Eutergesundheit entfallen, verliert Geld — dort ersetzt die Nachzucht nur, was vorzeitig kaputtgeht.\n\n**Die Wirtschaftlichkeit** hängt daran unmittelbar: Eine Färse hat ihre Aufzuchtkosten von grob 1.800 bis 2.400 € erst im Laufe der zweiten Laktation erwirtschaftet. Jede Kuh, die vorher abgeht, war ein Verlustgeschäft. Und die höchste Lebensleistung liegt in der dritten bis fünften Laktation — genau da, wo viele Herden ihre Tiere schon verloren haben.\n\nDeshalb hat die **Nutzungsdauer** in den Zuchtwerten von Fleckvieh und Holstein erheblich an Gewicht gewonnen.",
    "related": [
      "inseminace",
      "odchov-telat",
      "vykrm-skotu",
      "krizeni-plemen"
    ],
    "externalUrl": "https://de.wikipedia.org/wiki/Nutzungsdauer_(Tierhaltung)",
    "externalLabel": "Wikipedia: Nutzungsdauer",
    "faq": [
      {
        "q": "Was bedeutet Merzung?",
        "a": "Das Ausscheiden eines Tieres aus dem Bestand — freiwillig aus züchterischen Gründen oder unfreiwillig wegen Krankheit oder Unfruchtbarkeit."
      },
      {
        "q": "Wie hoch ist die Merzungsrate in Milchviehherden?",
        "a": "In Deutschland 30 bis 35 % je Jahr, was einer Nutzungsdauer von etwa drei Laktationen entspricht."
      }
    ]
  },
  {
    "slug": "vykrm-skotu",
    "term": "Rindermast",
    "alias": [
      "Bullenmast",
      "Mast",
      "Ochsenmast"
    ],
    "kategorie": "chov",
    "shortDef": "Die Rindermast ist die gezielte Ausmast von Rindern bis zur Schlachtreife — in Deutschland überwiegend als intensive Bullenmast.",
    "longDef": "Die Rindermast führt Rinder von der Aufzucht bis zur Schlachtreife. In Deutschland und Österreich dominiert die **intensive Bullenmast**: Aufstallung mit Maissilage-Kraftfutter-Ration, Schlachtung mit 16 bis 20 Monaten bei 700 bis 780 kg Lebendgewicht und einer Ausschlachtung um 57 bis 59 %.\n\n**Die Verfahren im Überblied:**\n- **Bullenmast** — die schnellste und futtereffizienteste Variante, weil Bullen die höchsten Tageszunahmen erreichen; Kastration ist hier unüblich\n- **Färsenmast** — geringere Zunahmen, dafür feineres, stärker marmoriertes Fleisch und höherer Erlös in der Direktvermarktung\n- **Ochsenmast** — extensiv auf der Weide, langsamer, in Deutschland eine Nische, aber im Bio- und Naturschutzbereich bedeutsam, weil Ochsen sich für die Landschaftspflege eignen\n- **Mutterkuhhaltung** — die Kälber bleiben bis zum Absetzen bei der Mutter; typisch für Grünlandregionen und die Basis der Qualitätsfleischprogramme\n\n**Die Kennzahlen, an denen sich alles entscheidet**: tägliche Zunahmen von 1.200 bis 1.600 g bei Bullen, Futterverwertung von 5,5 bis 7 kg Trockenmasse je kg Zuwachs, und die Einstufung nach dem **EUROP-Handelsklassenschema** — Fleischigkeit E bis P, Fettabdeckung 1 bis 5 —, die den Auszahlungspreis unmittelbar bestimmt.\n\n**Ein struktureller Zusammenhang, der zunehmend zählt**: Der weitaus größte Teil der Mastbullen stammt aus der Milchviehhaltung. Mit der Ausbreitung von gesextem Sperma und der Anpaarung von Fleischrassen auf Milchkühe verändert sich das Angebot spürbar — die Kälber werden fleischbetonter und wertvoller. Siehe [[krizeni-plemen]].\n\n**Rechtlich** gelten die Tierschutz-Nutztierhaltungsverordnung, Vorgaben zu Platzangebot und Bodengestaltung, Kennzeichnung und Registrierung jedes Tieres über die Ohrmarke sowie die Anforderungen an den Tiertransport.",
    "related": [
      "hluboka-podestylka",
      "odchov-telat",
      "brakace",
      "inseminace"
    ],
    "externalUrl": "https://de.wikipedia.org/wiki/Rindermast",
    "externalLabel": "Wikipedia: Rindermast",
    "faq": [
      {
        "q": "Wie läuft die Rindermast ab?",
        "a": "Über eine energie- und eiweißreiche Ration bis zur Schlachtreife, bei intensiver Bullenmast mit 16 bis 20 Monaten und 700 bis 780 kg."
      },
      {
        "q": "Welche Mastverfahren gibt es?",
        "a": "Bullenmast, Färsenmast, Ochsenmast auf der Weide sowie die Mutterkuhhaltung mit Kalb bei Fuß."
      }
    ]
  },
  {
    "slug": "odchov-telat",
    "term": "Kälberaufzucht",
    "alias": [
      "Kälberhaltung",
      "Aufzucht"
    ],
    "kategorie": "chov",
    "shortDef": "Die Kälberaufzucht umfasst die Versorgung von der Geburt bis zum Absetzen — die Phase, in der über die spätere Leistung entschieden wird.",
    "longDef": "Die Kälberaufzucht reicht von der Geburt bis zum Absetzen mit etwa zehn bis zwölf Wochen. Sie ist die folgenreichste Phase im Leben des Tieres: Studien zeigen, dass die **Tageszunahmen in den ersten acht Wochen mit der späteren Milchleistung der ersten Laktation zusammenhängen** — jedes zusätzliche Kilogramm Zuwachs schlägt sich später in mehreren hundert Kilogramm Milch nieder.\n\n**Die Kolostrumversorgung entscheidet über alles Weitere.** Das Kalb kommt ohne Antikörper zur Welt; die Darmwand kann Immunglobuline nur in den ersten Stunden aufnehmen, mit rasch fallender Rate. Die Regel lautet: **vier Liter hochwertiges Kolostrum innerhalb der ersten zwei Stunden.** Wer hier nachlässig ist, holt es nicht mehr auf — siehe [[kolostrum-mlezivo]].\n\n**Die Tränkephase** wird heute anders geführt als früher. Die lange übliche restriktive Tränke mit vier bis sechs Litern täglich gilt als überholt; empfohlen wird die **ad libitum oder erhöhte Tränke** mit acht bis zehn Litern in den ersten Wochen, danach schrittweise Abtränkung. Parallel muss ab der ersten Woche **Kraftfutter, Heu und Wasser** frei zugänglich sein, damit sich der Pansen entwickelt — ohne Festfutter bleibt er funktionslos.\n\n**Haltung**: In Deutschland und Österreich schreibt die Tierschutz-Nutztierhaltungsverordnung vor, dass Kälber **ab der dritten Lebenswoche in Gruppen** zu halten sind; Einzelhaltung ist nur in den ersten beiden Wochen zulässig. Bewährt haben sich Iglus im Freien: kühl, aber trocken und zugfrei — Kälber vertragen Kälte gut, Zugluft und Feuchtigkeit dagegen nicht.\n\nDie beiden großen Verlustursachen sind **Durchfall** in den ersten drei Wochen und **Atemwegserkrankungen** ab der vierten. Beide sind fast immer Folge von Kolostrummangel, Zugluft oder zu hoher Belegdichte.",
    "related": [
      "hluboka-podestylka",
      "laktacni-krivka",
      "vykrm-skotu",
      "brakace"
    ],
    "externalUrl": "https://de.wikipedia.org/wiki/Kalb",
    "externalLabel": "Wikipedia: Kalb",
    "faq": [
      {
        "q": "Wie läuft die Kälberaufzucht ab?",
        "a": "Kolostrum in den ersten Stunden, anschließend Tränkephase mit gleichzeitigem Angebot von Kraftfutter, Heu und Wasser bis zum Absetzen nach zehn bis zwölf Wochen."
      },
      {
        "q": "Ab wann müssen Kälber in Gruppen gehalten werden?",
        "a": "Ab der dritten Lebenswoche — Einzelhaltung ist nur in den ersten beiden Wochen zulässig."
      }
    ]
  },
  {
    "slug": "krizeni-plemen",
    "term": "Kreuzung",
    "alias": [
      "Gebrauchskreuzung",
      "Kreuzungszucht",
      "Hybridzucht"
    ],
    "kategorie": "chov",
    "shortDef": "Bei der Kreuzung werden zwei Rassen angepaart, um Heterosis und die Kombination gewünschter Eigenschaften zu nutzen.",
    "longDef": "Die Kreuzungszucht paart Tiere unterschiedlicher Rassen an, um zwei Effekte zu nutzen: die **Komplementarität** — jede Rasse bringt ihre Stärken ein — und die **Heterosis**, den Leistungsvorteil der Kreuzungstiere gegenüber dem Mittel der Elternrassen. Heterosis wirkt am stärksten bei niedrig erblichen Merkmalen: Fruchtbarkeit, Vitalität der Jungtiere, Nutzungsdauer und Krankheitsresistenz. Genau dort, wo die Reinzuchtselektion nur langsam vorankommt.\n\n**Wo sie in Mitteleuropa praktisch angewendet wird:**\n- **Gebrauchskreuzung in der Milchviehhaltung** — der stärkste Trend der letzten Jahre: Die genetisch besten Kühe werden mit **gesextem Sperma** belegt, um die Nachzucht zu sichern, der Rest mit **Fleischrassen** wie Weißblauen Belgiern, Limousin oder Angus. Die Kälber bringen deutlich mehr Erlös als reine Milchrassekälber, was zugleich das Tierwohlproblem der wenig verwertbaren Bullenkälber entschärft\n- **Mutterkuhhaltung** — Kreuzungskühe verbinden Milchleistung und Muttereigenschaften der einen mit Bemuskelung und Wüchsigkeit der anderen Rasse\n- **Schweinezucht** — hier ist die Kreuzung die Regel, nicht die Ausnahme: Die Sau ist meist eine F1-Kreuzung aus Deutscher Landrasse und Deutschem Edelschwein, angepaart mit einem Pietrain- oder Duroc-Eber. Siehe [[f1-hybrid]]\n- **Geflügel** — Lege- und Masthybriden sind durchweg Vierweg-Kreuzungen aus streng getrennten Elternlinien\n\n**Der Preis**: Heterosis ist in der **F1-Generation maximal** und geht in den Folgegenerationen zurück. Kreuzungstiere eignen sich deshalb nur begrenzt zur Weiterzucht, und der Betrieb bleibt auf den Zukauf von Elterntieren oder Sperma angewiesen. Zudem lassen sich Zuchtwerte über Rassegrenzen hinweg schwerer vergleichen.\n\n**Rechtlicher Rahmen**: Zuchtprogramme und Zuchtbuchführung sind in der EU über die Tierzuchtverordnung (EU) 2016/1012 geregelt; in Deutschland führen anerkannte Zuchtverbände die Zuchtbücher, siehe [[plemenna-kniha]].",
    "related": [
      "brakace",
      "inseminace",
      "odchov-telat",
      "vykrm-skotu"
    ],
    "externalUrl": "https://de.wikipedia.org/wiki/Kreuzung_(Genetik)",
    "externalLabel": "Wikipedia: Kreuzung",
    "faq": [
      {
        "q": "Was ist eine Gebrauchskreuzung?",
        "a": "Die Anpaarung zweier Rassen, deren Nachkommen unmittelbar genutzt und nicht weitergezüchtet werden — etwa Fleischrassenbullen auf Milchkühe."
      },
      {
        "q": "Wozu dient die Kreuzung?",
        "a": "Sie kombiniert die Stärken zweier Rassen und nutzt die Heterosis, die vor allem Fruchtbarkeit, Vitalität und Nutzungsdauer verbessert."
      },
      {
        "q": "Worin unterscheiden sich Kreuzung und Reinzucht?",
        "a": "Die Reinzucht verbessert eine Rasse über Generationen gezielt weiter; die Kreuzung nutzt einen sofortigen Leistungsvorteil, der sich aber nicht vererben lässt."
      }
    ]
  },
  {
    "slug": "n-senzor",
    "term": "N-Sensor",
    "alias": [
      "Stickstoffsensor",
      "Pflanzensensor",
      "Cropsensor"
    ],
    "kategorie": "precise-farming",
    "shortDef": "Der N-Sensor misst den Ernährungszustand des Bestandes im Überfahren und steuert die Stickstoffmenge in Echtzeit.",
    "longDef": "Der N-Sensor sitzt auf dem Traktordach und misst über die Reflexion des Bestandes dessen Biomasse und Chlorophyllgehalt. Daraus berechnet die Software eine Aufwandmenge, die der Düngerstreuer **während der Überfahrt** umsetzt — Messen und Düngen fallen in einen Arbeitsgang zusammen, ohne vorherige Kartierung.\n\n**Aktiv oder passiv** ist der wichtigste technische Unterschied: **Passive Sensoren** nutzen das Sonnenlicht und sind auf Tageslicht angewiesen; **aktive Sensoren** bringen ihre eigene Lichtquelle mit und arbeiten deshalb auch nachts und bei wechselnder Bewölkung — in der Praxis der entscheidende Vorteil, weil Düngefenster oft eng sind.\n\n**Zwei entgegengesetzte Strategien**, und genau hier liegt das häufigste Missverständnis:\n\nDie **Ausgleichsstrategie** gibt schwachen Teilflächen mehr — sie sollen aufholen. Sinnvoll, wenn die Schwäche auf Stickstoffmangel beruht.\n\nDie **Aufteilungsstrategie** gibt starken Teilflächen mehr — dort wird der Stickstoff auch in Ertrag umgesetzt. Sinnvoll, wenn die schwache Stelle aus einem anderen Grund schwach ist: Verdichtung, Trockenheit, Vernässung. Dorthin mehr Stickstoff zu geben, bringt nichts und wäscht aus.\n\nDer Sensor kann diesen Unterschied nicht sehen — er misst nur Grün. Die Entscheidung, welche Strategie gilt, muss der Betriebsleiter aus Schlagkenntnis treffen. Genau daran scheitern Ergebnisse in der Praxis häufiger als an der Technik.\n\n**Wo der Nutzen am größten ist**: in der Qualitätsgabe zu Weizen, weil ungleiche Bestände sonst ungleiche Proteingehalte liefern, und in der Rapsdüngung im Frühjahr, wo die vor Winter gebildete Biomasse stark schwankt. Typisch sind 5 bis 15 % Stickstoffeinsparung bei gleichem Ertrag und deutlich gleichmäßigerer Abreife — was zugleich die Dokumentation nach Düngeverordnung erleichtert.",
    "related": [
      "mapa-vra",
      "rtk-baze",
      "ec-pudy",
      "senzor-vlhkosti-pudy"
    ],
    "faq": [
      {
        "q": "Wozu dient ein N-Sensor?",
        "a": "Er misst den Ernährungszustand des Bestandes während der Überfahrt und steuert die Stickstoffmenge teilflächenspezifisch in Echtzeit."
      },
      {
        "q": "Wie funktioniert ein N-Sensor?",
        "a": "Über die Messung der Lichtreflexion des Bestandes, aus der Biomasse und Chlorophyllgehalt abgeleitet werden."
      }
    ]
  },
  {
    "slug": "mapa-vra",
    "term": "Applikationskarte",
    "alias": [
      "Streukarte",
      "VRA-Karte",
      "teilflächenspezifische Applikation"
    ],
    "kategorie": "precise-farming",
    "shortDef": "Die Applikationskarte enthält für jede Teilfläche eine eigene Aufwandmenge, die die Maschine positionsabhängig umsetzt.",
    "longDef": "Eine Applikationskarte teilt den Schlag in Zonen und weist jeder eine eigene Aufwandmenge zu. Das Terminal liest über GPS die aktuelle Position und stellt die Menge automatisch nach — **variable rate application**, VRA.\n\n**Der Unterschied zum [[n-senzor]]** ist grundlegend: Die Karte wird **vorher** erstellt und beruht auf Wissen über den Schlag; der Sensor misst **währenddessen** den aktuellen Zustand. Die Karte kennt die Bodengüte, sieht aber nicht den Bestand; der Sensor sieht den Bestand, kennt aber die Ursache nicht. Moderne Systeme kombinieren beides: Die Karte gibt den Rahmen vor, der Sensor korrigiert innerhalb dessen.\n\n**Datengrundlagen** sind Ertragskarten aus mehreren Jahren — die belastbarste Quelle, weil sie das tatsächliche Ergebnis zeigen —, Bodenscans der elektrischen Leitfähigkeit, georeferenzierte Bodenproben in Raster oder Zonen, Satelliten- und Drohnenaufnahmen sowie digitale Geländemodelle.\n\n**Angewendet** wird sie bei Grunddüngung mit Phosphor, Kalium und Kalk, bei der Saatstärke, bei Wachstumsreglern und bei der Stickstoffdüngung.\n\n**Der wichtigste praktische Punkt ist zugleich der am häufigsten übersehene**: Eine Karte ist nur so gut wie die Interpretation dahinter. Eine dauerhaft schwache Teilfläche kann an Nährstoffmangel liegen — dann hilft mehr Dünger — oder an Verdichtung, Vernässung oder geringer Gründigkeit. Im zweiten Fall ist mehr Dünger verschwendetes Geld und ein Auswaschungsrisiko. **Erst die Ursache klären, dann die Karte bauen.**\n\nBei Kalk und Grunddüngung ist der wirtschaftliche Nutzen am klarsten belegt, weil dort die Unterschiede im Boden groß und über Jahre stabil sind.",
    "related": [
      "n-senzor",
      "rtk-baze",
      "fmis",
      "ec-pudy"
    ],
    "faq": [
      {
        "q": "Wie entsteht eine Applikationskarte?",
        "a": "Aus Ertragskarten, Bodenscans, georeferenzierten Bodenproben und Satellitendaten, die zu Zonen mit eigener Aufwandmenge verrechnet werden."
      },
      {
        "q": "Wozu dient eine Applikationskarte?",
        "a": "Zur teilflächenspezifischen Ausbringung von Dünger, Saatgut oder Pflanzenschutzmitteln je nach Bedarf der jeweiligen Zone."
      }
    ]
  },
  {
    "slug": "rtk-baze",
    "term": "RTK-Basisstation",
    "alias": [
      "RTK",
      "Referenzstation",
      "Korrekturdienst"
    ],
    "kategorie": "precise-farming",
    "shortDef": "Die RTK-Basisstation liefert Korrekturdaten, die die Genauigkeit der Satellitennavigation von Metern auf ein bis zwei Zentimeter verbessern.",
    "longDef": "Ein GNSS-Empfänger allein erreicht eine Genauigkeit von einigen Metern, weil das Signal auf dem Weg durch Ionosphäre und Troposphäre verzögert wird. **Real Time Kinematic** löst das über eine zweite Antenne an einem exakt eingemessenen Festpunkt: Weil deren wahre Position bekannt ist, lässt sich der aktuelle Fehler berechnen und in Echtzeit an den Traktor senden. Das Ergebnis sind **ein bis zwei Zentimeter** absolute Genauigkeit — und, was praktisch noch wichtiger ist, **Jahr-zu-Jahr-Wiederholbarkeit**: Dieselbe Spur ist in der nächsten Saison wieder dieselbe.\n\n**Woher die Korrektur kommt**, ist eine Kostenfrage: aus einer **eigenen Basisstation** auf dem Hof mit Funkübertragung, ohne laufende Gebühren, aber begrenzter Reichweite; aus einem **Netzwerkdienst** über Mobilfunk, in Deutschland etwa SAPOS der Landesvermessung oder Anbieterdienste, in Österreich APOS; oder über neuere **satellitengestützte Korrekturdienste** ohne Bodenstation.\n\n**Was Zentimetergenauigkeit erst ermöglicht** — und was mit einfacher Spurführung nicht geht:\n- **Controlled Traffic Farming** mit dauerhaft festen Fahrgassen, siehe [[ctf]]\n- **Kamerafreies Hacken** exakt in der Saatspur, was den Abstand zur Reihe verringert und die mechanische Unkrautregulierung überhaupt erst schlagkräftig macht\n- **Strip-Till** — Düngerband und spätere Saatreihe müssen zusammenfallen\n- **Anschlussfahren ohne Überlappung**, was je nach Arbeitsbreite mehrere Prozent Betriebsmittel spart\n\nGerade der zweite Punkt hat Gewicht bekommen: Mit zunehmenden Herbizidresistenzen wird die mechanische Regulierung wichtiger, und die steht und fällt mit der Spurgenauigkeit.",
    "related": [
      "n-senzor",
      "mapa-vra",
      "fmis",
      "senzor-vlhkosti-pudy"
    ],
    "faq": [
      {
        "q": "Was ist eine RTK-Basisstation?",
        "a": "Eine Referenzstation an einem exakt bekannten Punkt, die Korrekturdaten für die Satellitennavigation liefert."
      },
      {
        "q": "Worin unterscheidet sich RTK von einfachem GPS?",
        "a": "RTK erreicht ein bis zwei Zentimeter Genauigkeit mit Jahr-zu-Jahr-Wiederholbarkeit, einfaches GPS nur einige Meter."
      }
    ]
  },
  {
    "slug": "fmis",
    "term": "Farmmanagement-Informationssystem (FMIS)",
    "alias": [
      "FMIS",
      "Ackerschlagkartei",
      "Farmmanagementsystem"
    ],
    "kategorie": "precise-farming",
    "shortDef": "Ein FMIS bündelt Schlagkartei, Planung, Dokumentation und Maschinendaten in einer Software — in Deutschland vor allem als Ackerschlagkartei bekannt.",
    "longDef": "Ein Farmmanagement-Informationssystem führt die Daten des Betriebs an einer Stelle zusammen: Schlagkartei mit Flächen und Kulturen, Maßnahmenplanung, Dokumentation aller Arbeitsgänge, Lagerverwaltung, Auswertung von Maschinendaten und betriebswirtschaftliche Schlagbilanzen.\n\n**In Deutschland und Österreich ist der Kern die Ackerschlagkartei — und die ist nicht freiwillig.** Aufzeichnungspflichten ergeben sich aus mehreren Rechtsquellen zugleich:\n- **Düngeverordnung** — Düngebedarfsermittlung vor jeder Düngung und Aufzeichnung jeder Maßnahme binnen zwei Tagen, dazu die jährliche Stoffstrombilanz für betroffene Betriebe\n- **Pflanzenschutzgesetz** — Dokumentation jeder Anwendung mit Mittel, Menge, Fläche, Datum und Anwender, aufzubewahren drei Jahre\n- **Konditionalität** — die Aufzeichnungen sind Prüfgegenstand bei Kontrollen; Mängel führen zu Kürzungen der Direktzahlungen\n- **QS, GlobalG.A.P. und Molkereistandards** mit eigenen, teils strengeren Anforderungen\n\nDas erklärt, warum sich die Systeme hier so stark verbreitet haben: Sie sind weniger Optimierungswerkzeug als **Nachweisinstrument**.\n\n**Der technische Knackpunkt sind die Schnittstellen.** Daten müssen zwischen Terminal, Maschinen verschiedener Hersteller und Software fließen. Dafür steht das ISOBUS-Datenformat **ISO-XML** zur Verfügung, in Deutschland ergänzt um die **agrirouter**-Plattform als herstellerneutrales Austauschdrehkreuz. In der Praxis bleibt der Datenaustausch trotzdem die größte Reibungsstelle — proprietäre Formate und unvollständige Implementierungen sind eher die Regel als die Ausnahme.\n\n**Zur Datenhoheit**: Wem die auf dem Schlag erzeugten Daten gehören und wer sie auswerten darf, regelt der EU-Verhaltenskodex zum Agrardatenaustausch — er ist allerdings freiwillig. Ein Blick in die Nutzungsbedingungen lohnt vor der Entscheidung für ein System.",
    "related": [
      "n-senzor",
      "mapa-vra",
      "rtk-baze",
      "ec-pudy"
    ],
    "faq": [
      {
        "q": "Was ist ein FMIS?",
        "a": "Eine Software, die Schlagkartei, Planung, gesetzliche Dokumentation und Maschinendaten des Betriebs zusammenführt."
      },
      {
        "q": "Warum braucht man eine Ackerschlagkartei?",
        "a": "Weil Düngeverordnung, Pflanzenschutzgesetz und Konditionalität die Aufzeichnung aller Maßnahmen verbindlich vorschreiben."
      }
    ]
  },
  {
    "slug": "ec-pudy",
    "term": "Elektrische Leitfähigkeit des Bodens (EC)",
    "alias": [
      "EC-Wert",
      "Bodenleitfähigkeit",
      "Bodenscan"
    ],
    "kategorie": "precise-farming",
    "shortDef": "Die elektrische Leitfähigkeit des Bodens wird flächendeckend gemessen und dient als Stellvertretergröße für Tongehalt und Wasserhaltevermögen.",
    "longDef": "Die elektrische Leitfähigkeit beschreibt, wie gut der Boden Strom leitet. Gemessen wird sie flächendeckend im Fahren, entweder mit erdberührten Messrädern oder berührungslos elektromagnetisch, oft in zwei Tiefenstufen gleichzeitig.\n\n**Was sie tatsächlich anzeigt** — und hier liegt der wichtigste Punkt: Die Leitfähigkeit misst **nicht** direkt Nährstoffe. Sie hängt vor allem ab von **Tongehalt**, **Bodenfeuchte**, **Salzgehalt** und **Temperatur**. In Mitteleuropa, wo Versalzung praktisch keine Rolle spielt, ist sie deshalb im Wesentlichen ein sehr guter **Stellvertreter für Tongehalt und Wasserhaltevermögen**. In ariden Ländern misst dieselbe Methode dagegen überwiegend Salz — Literatur von dort ist nicht übertragbar.\n\n**Warum sie trotzdem so nützlich ist**: Sie liefert in einer Überfahrt ein hochauflösendes Bild der Bodenvariabilität — Zehntausende Messpunkte je Hektar statt weniger Bodenproben. Daraus lassen sich **Bewirtschaftungszonen** ableiten, die weit realistischer sind als starre Raster.\n\nDer eigentliche wirtschaftliche Gewinn liegt in der **gezielten Beprobung**: Statt blind im Raster zu ziehen, werden Bodenproben nach Zonen genommen. Das liefert bei gleicher Probenzahl deutlich aussagekräftigere Werte, weil innerhalb einer Zone tatsächlich ähnliche Verhältnisse herrschen.\n\n**Wichtig für die Interpretation**: Absolutwerte sind kaum vergleichbar, weil die Messung von der Bodenfeuchte am Messtag abhängt. Aussagekräftig ist das **relative Muster innerhalb des Schlages** — und das bleibt über Jahre stabil, weil der Tongehalt sich nicht ändert. Ein Scan hält deshalb sehr lange.",
    "related": [
      "n-senzor",
      "mapa-vra",
      "senzor-vlhkosti-pudy",
      "fmis"
    ],
    "faq": [
      {
        "q": "Was misst die elektrische Leitfähigkeit des Bodens?",
        "a": "In Mitteleuropa vor allem Tongehalt und Wasserhaltevermögen — nicht direkt Nährstoffe."
      },
      {
        "q": "Wozu dient ein Bodenscan?",
        "a": "Zur Abgrenzung von Bewirtschaftungszonen und zur gezielten Bodenprobenahme statt blinder Rasterbeprobung."
      }
    ]
  },
  {
    "slug": "senzor-vlhkosti-pudy",
    "term": "Bodenfeuchtesensor",
    "alias": [
      "Tensiometer",
      "Bodenfeuchtemessung",
      "FDR-Sonde"
    ],
    "kategorie": "precise-farming",
    "shortDef": "Bodenfeuchtesensoren messen den Wassergehalt oder die Wasserspannung im Boden und liefern die Grundlage für Bewässerungsentscheidungen.",
    "longDef": "Bodenfeuchtesensoren erfassen, wie viel Wasser im Boden ist — und wichtiger noch, wie schwer die Pflanze es bekommt.\n\n**Zwei grundverschiedene Messprinzipien**, deren Unterschied entscheidend ist:\n\n**Volumetrische Sensoren** (FDR und TDR) messen über die Dielektrizitätskonstante den **Wassergehalt** in Volumenprozent. Sie liefern absolute Zahlen, brauchen aber eine bodenartspezifische Kalibrierung.\n\n**Tensiometer** messen die **Saugspannung** in Hektopascal, also die Kraft, mit der der Boden das Wasser festhält. Das ist physiologisch die relevantere Größe: Ein Sandboden mit 12 % Wasser kann der Pflanze mehr liefern als ein Tonboden mit 25 %, weil dieser das Wasser fester bindet. Richtwerte für den Bewässerungsstart liegen je nach Kultur und Boden bei 200 bis 500 hPa.\n\n**Richtig platzieren ist wichtiger als die Sensorwahl.** Gemessen wird in mindestens zwei Tiefen — im Hauptwurzelraum und darunter —, an einer für den Schlag repräsentativen Stelle und nicht in der Fahrgasse. Der tiefere Sensor beantwortet die eigentliche Frage: Ist das Wasser noch in der Wurzelzone oder schon darunter durchgesickert? Wer nur oberflächlich misst, bewässert regelmäßig zu viel.\n\n**In Mitteleuropa** wird kaum flächig bewässert; der Schwerpunkt liegt bei Kartoffeln, Gemüse, Obst, Hopfen und Sonderkulturen. Dort ist die Wirtschaftlichkeit klar, zumal die Wasserentnahme wasserrechtlich genehmigungspflichtig ist und in Trockenjahren zunehmend mengenmäßig beschränkt wird — belastbare Messdaten sind damit auch ein Argument gegenüber der Behörde.\n\nIm nicht bewässerten Ackerbau dienen dieselben Sensoren einem anderen Zweck: der **Befahrbarkeitsentscheidung**. Sie zeigen, ob der Boden tragfähig ist — der wirksamste Schutz gegen [[utuzeni-pudy]].",
    "related": [
      "n-senzor",
      "mapa-vra",
      "rtk-baze",
      "ec-pudy"
    ],
    "faq": [
      {
        "q": "Was misst ein Bodenfeuchtesensor?",
        "a": "Entweder den volumetrischen Wassergehalt oder — beim Tensiometer — die Saugspannung, also wie fest der Boden das Wasser hält."
      },
      {
        "q": "Wozu dienen Bodenfeuchtesensoren?",
        "a": "Zur Steuerung der Bewässerung und im nicht bewässerten Ackerbau zur Beurteilung der Befahrbarkeit."
      }
    ]
  },
  {
    "slug": "matif",
    "term": "MATIF (Euronext Paris)",
    "alias": [
      "MATIF",
      "Euronext Paris",
      "Pariser Warenterminbörse"
    ],
    "kategorie": "dotace",
    "shortDef": "Der MATIF ist der Warenterminmarkt der Euronext in Paris; sein Weizenkontrakt ist die maßgebliche Preisreferenz für Getreide in Europa.",
    "longDef": "Der MATIF — Marché à Terme International de France — ist der Warenterminmarkt der Börse **Euronext** in Paris. Auch wenn der Name historisch ist, hat er sich als Bezeichnung im Getreidehandel gehalten.\n\n**Warum er für deutsche und österreichische Landwirte zählt**: Der Kontrakt auf **Mahlweizen** (Blé de meunerie, Kürzel EBM) ist der Referenzpreis für Weizen in ganz Europa. Er lautet auf 50 Tonnen je Kontrakt, notiert in Euro je Tonne und wird physisch in Rouen erfüllt. Wer in Deutschland Getreide verkauft, verhandelt in aller Regel nicht über einen absoluten Preis, sondern über den **MATIF-Kurs plus oder minus eine Basis**, siehe [[bazicka-cena]]. Daneben werden Kontrakte auf Raps (Kürzel ECO, 50 t) sowie auf Mais und Braugerste gehandelt.\n\n**Wozu er dient**: Der Terminmarkt erlaubt es, einen Preis abzusichern, lange bevor die Ware existiert. Ein Landwirt, der im Februar den Erntepreis für September für auskömmlich hält, kann ihn über einen Verkauf am Terminmarkt festschreiben — steigt der Kurs, verliert er an der Börse und gewinnt beim physischen Verkauf, fällt er, ist es umgekehrt. Für die meisten Betriebe ist der einfachere Weg der **Vorkontrakt** beim Landhandel, siehe [[forwardovy-kontrakt]]; dieser wird jedoch vom Händler ebenfalls über den MATIF abgesichert und ist damit nur eine andere Verpackung desselben Mechanismus.\n\n**Was zu beachten ist**: Der direkte Handel am Terminmarkt verlangt ein Konto beim Broker und **Nachschusspflicht** — steigt der Kurs nach einem Verkauf, muss laufend Sicherheit nachgeschossen werden, auch wenn das Getreide noch auf dem Halm steht. Das hat schon Betriebe in Liquiditätsprobleme gebracht. Die Kontraktgröße von 50 Tonnen passt zudem nicht zu jeder Betriebsgröße.\n\n**Wichtig für die Einordnung**: Der MATIF-Kurs ist eine Notierung frei Rouen. Der Preis am eigenen Lager liegt darunter oder darüber, je nach Transportkosten, regionalem Angebot, Qualität und Lagerkapazität — genau diese Differenz ist die Basis.",
    "related": [
      "komoditni-burza",
      "forwardovy-kontrakt",
      "bazicka-cena",
      "intervencni-nakup"
    ],
    "externalUrl": "https://de.wikipedia.org/wiki/Euronext",
    "externalLabel": "Wikipedia: Euronext",
    "faq": [
      {
        "q": "Was ist der MATIF?",
        "a": "Der Warenterminmarkt der Euronext in Paris, dessen Mahlweizenkontrakt als europäische Preisreferenz für Getreide dient."
      },
      {
        "q": "Welche Waren werden am MATIF gehandelt?",
        "a": "Vor allem Mahlweizen und Raps, daneben Mais und Braugerste."
      },
      {
        "q": "Wie funktioniert der Handel am MATIF?",
        "a": "Über standardisierte Terminkontrakte, mit denen sich Preise für künftige Lieferungen absichern lassen — verbunden mit Sicherheitsleistung und Nachschusspflicht."
      }
    ]
  },
  {
    "slug": "intervencni-nakup",
    "term": "Öffentliche Intervention",
    "alias": [
      "Interventionsankauf",
      "Intervention"
    ],
    "kategorie": "dotace",
    "shortDef": "Bei der öffentlichen Intervention kauft die EU Agrarerzeugnisse zu einem festen Preis auf, wenn der Marktpreis darunter fällt, und stützt so den Markt von unten.",
    "longDef": "Die öffentliche Intervention ist ein Sicherheitsnetz der gemeinsamen Marktorganisation: Fällt der Marktpreis eines Erzeugnisses unter den festgelegten Interventionspreis, kauft die EU über die nationalen Zahlstellen bestimmte Mengen auf und lagert sie ein. Das nimmt Ware vom Markt und setzt dem Preisverfall eine Untergrenze.\n\nDie Intervention steht heute nur noch für wenige Erzeugnisse offen — vor allem Weichweizen, Hartweizen, Gerste, Mais, Rohreis, Rind- und Kalbfleisch, Butter und Magermilchpulver. Für Weichweizen liegt der Interventionspreis seit Jahren unverändert bei 101,31 €/t und damit weit unter dem üblichen Marktniveau, sodass das Instrument praktisch nur in schweren Krisen greift.\n\nSeit den Reformen der 1990er- und 2000er-Jahre wurde die Intervention stark zurückgefahren: Die einst berüchtigten Butterberge und Milchseen waren die Folge zu hoch angesetzter Interventionspreise. Ergänzt wird sie heute durch die private Lagerhaltung, bei der die EU nicht selbst kauft, sondern Lagerkosten bezuschusst.",
    "related": [
      "matif",
      "komoditni-burza",
      "bazicka-cena",
      "forwardovy-kontrakt"
    ],
    "externalUrl": "https://de.wikipedia.org/wiki/Intervention_(Agrarpolitik)",
    "externalLabel": "Wikipedia: Intervention",
    "faq": [
      {
        "q": "Wozu dient die öffentliche Intervention?",
        "a": "Sie stabilisiert den Markt, indem die EU Erzeugnisse zu einem festen Preis aufkauft, wenn der Marktpreis darunter fällt."
      },
      {
        "q": "Wie funktioniert die Intervention?",
        "a": "Die EU legt einen Interventionspreis fest; unterschreitet der Markt ihn, kaufen die nationalen Zahlstellen bestimmte Mengen auf und lagern sie ein."
      },
      {
        "q": "Welche Erzeugnisse sind interventionsfähig?",
        "a": "Vor allem Weichweizen, Hartweizen, Gerste, Mais, Rohreis, Rind- und Kalbfleisch, Butter und Magermilchpulver."
      }
    ]
  },
  {
    "slug": "komoditni-burza",
    "term": "Warenterminbörse",
    "alias": [
      "Rohstoffbörse",
      "Commodity Exchange"
    ],
    "kategorie": "dotace",
    "shortDef": "An der Warenterminbörse werden standardisierte Terminkontrakte auf Rohstoffe gehandelt — der Ort, an dem sich Agrarpreise weltweit bilden.",
    "longDef": "Eine Warenterminbörse ist ein organisierter Markt für **standardisierte Terminkontrakte** auf Rohstoffe. Standardisiert heißt: Menge, Qualität, Liefermonat und Lieferort sind festgelegt, sodass jeder Kontrakt mit jedem anderen austauschbar und damit jederzeit handelbar ist. Zwischen Käufer und Verkäufer tritt eine **Clearingstelle**, die für die Erfüllung einsteht — das Gegenparteirisiko entfällt.\n\n**Die für europäische Landwirte maßgeblichen Börsen:**\n- **Euronext Paris**, im Handel weiter MATIF genannt — Mahlweizen, Raps, Mais und Braugerste; die Referenz für Europa, siehe [[matif]]\n- **CME/CBOT Chicago** — Weizen, Mais, Sojabohnen; setzt das globale Preisniveau\n- **ICE** — Zucker, Kaffee, Kakao, Baumwolle\n\n**Zwei Gruppen mit gegensätzlichem Interesse machen den Markt:** **Hedger** — Landwirte, Händler, Mühlen — sichern sich gegen Preisänderungen ab und wollen Sicherheit. **Spekulanten** übernehmen genau dieses Risiko in der Hoffnung auf Gewinn. Ohne sie gäbe es keine Gegenseite für die Absicherung; die verbreitete Vorstellung, Spekulation sei am Terminmarkt ein Fremdkörper, verkennt ihre Funktion.\n\n**Nur ein sehr kleiner Teil der Kontrakte wird tatsächlich beliefert.** Die meisten werden vor Fälligkeit glattgestellt — der Gewinn oder Verlust an der Börse gleicht die Preisänderung im physischen Geschäft aus. Der Terminmarkt ist ein Preisinstrument, kein Warenlogistiksystem.\n\n**Für den einzelnen Betrieb** ist der direkte Zugang selten der richtige Weg: Kontraktgrößen von 50 Tonnen, Sicherheitsleistung und **Nachschusspflicht** passen nicht zu jedem Unternehmen. Der übliche Weg ist der [[forwardovy-kontrakt]] beim Landhandel — der Händler sichert seinerseits an der Börse ab, sodass derselbe Mechanismus wirkt, nur ohne Margin-Konto.",
    "related": [
      "matif",
      "intervencni-nakup",
      "bazicka-cena",
      "forwardovy-kontrakt"
    ],
    "externalUrl": "https://de.wikipedia.org/wiki/Warenterminb%C3%B6rse",
    "externalLabel": "Wikipedia: Warenterminbörse",
    "faq": [
      {
        "q": "Was ist eine Warenterminbörse?",
        "a": "Ein organisierter Markt für standardisierte Terminkontrakte auf Rohstoffe, abgesichert über eine Clearingstelle."
      },
      {
        "q": "Welche Rohstoffe werden dort gehandelt?",
        "a": "Agrarprodukte wie Weizen, Raps, Mais und Zucker sowie Energieträger und Metalle."
      },
      {
        "q": "Worin unterscheidet sich eine Warenterminbörse von einer Aktienbörse?",
        "a": "Sie handelt Kontrakte auf physische Rohstoffe mit festem Liefermonat, nicht Unternehmensanteile."
      }
    ]
  },
  {
    "slug": "bazicka-cena",
    "term": "Basis",
    "alias": [
      "Basispreis",
      "Basisdifferenz"
    ],
    "kategorie": "dotace",
    "shortDef": "Die Basis ist die Differenz zwischen dem lokalen Kassapreis und der Notierung am Terminmarkt.",
    "longDef": "Die Basis ist die Differenz zwischen dem **Preis am eigenen Standort** und der **Notierung am Terminmarkt**, üblicherweise dem MATIF. Sie ist die zweite Hälfte der Preisbildung, die im Gespräch über Getreidepreise regelmäßig übersehen wird: Der Terminmarkt bestimmt das Niveau, die Basis bestimmt, was davon beim einzelnen Betrieb ankommt.\n\n**Was die Basis bestimmt:**\n- **Transportkosten** zum Referenzort und zum nächsten Verwerter — der weitaus größte Einzelposten\n- **Regionales Angebot und Nachfrage** — in einer Veredelungsregion mit hohem Futterbedarf ist die Basis besser als in einer reinen Überschussregion\n- **Qualität** — Proteingehalt, Fallzahl, Hektolitergewicht und Besatz führen zu Zu- und Abschlägen\n- **Lager- und Zinskosten** über die Zeit\n- **Logistik und Erntedruck** — unmittelbar zur Ernte, wenn alle liefern wollen, ist die Basis am schwächsten\n\n**Praktische Bedeutung**: Die Basis schwankt weit weniger und viel berechenbarer als der Terminmarktkurs. Wer sie über mehrere Jahre notiert, erkennt schnell das jahreszeitliche Muster seines Standorts — typischerweise schwach zur Ernte, sich bis ins Frühjahr erholend. Genau daraus ergibt sich die Vermarktungsentscheidung: **Terminmarkt und Basis lassen sich getrennt vermarkten.** Der Preis kann über den Terminmarkt oder einen Vorkontrakt bereits gesichert sein, während die Ware eingelagert bleibt, um später eine bessere Basis mitzunehmen.\n\nGegen diese Rechnung stehen die Lagerkosten: Lagergeld beziehungsweise eigene Lagerkosten, Zins auf das gebundene Kapital, Schwund und Qualitätsrisiko. Erst wenn die erwartete Basisverbesserung diese Summe übersteigt, lohnt das Warten — siehe [[skladne]].",
    "related": [
      "matif",
      "komoditni-burza",
      "forwardovy-kontrakt",
      "intervencni-nakup"
    ],
    "externalUrl": "https://de.wikipedia.org/wiki/Basis_(Terminmarkt)",
    "externalLabel": "Wikipedia: Basis",
    "faq": [
      {
        "q": "Wie wird die Basis berechnet?",
        "a": "Als Differenz zwischen dem lokalen Kassapreis und der Notierung des entsprechenden Terminkontrakts."
      },
      {
        "q": "Wozu dient die Basis?",
        "a": "Sie zeigt, wie viel vom Weltmarktniveau am eigenen Standort tatsächlich ankommt, und ist damit die Grundlage jeder Vermarktungsentscheidung."
      },
      {
        "q": "Worin unterscheiden sich Basis und Terminmarktpreis?",
        "a": "Der Terminmarktpreis gilt für standardisierte Ware am Referenzort; die Basis bildet Transport, Qualität, regionales Angebot und Lagerkosten ab."
      }
    ]
  },
  {
    "slug": "forwardovy-kontrakt",
    "term": "Vorkontrakt (Forward)",
    "alias": [
      "Forward",
      "Vorverkauf",
      "Terminverkauf"
    ],
    "kategorie": "dotace",
    "shortDef": "Der Vorkontrakt ist ein individuell vereinbarter Vertrag über Lieferung einer bestimmten Menge zu einem festen Preis und Termin.",
    "longDef": "Beim Vorkontrakt vereinbaren Landwirt und Händler **jetzt** Menge, Qualität, Preis und Liefertermin für eine Lieferung in der Zukunft. In der Praxis ist das das meistgenutzte Instrument der Preisabsicherung in der deutschen und österreichischen Landwirtschaft — deutlich häufiger als der direkte Handel am Terminmarkt.\n\n**Der Unterschied zum Terminkontrakt**: Der Vorkontrakt ist eine **individuelle Vereinbarung** zwischen zwei Parteien mit frei verhandelbarer Menge — auch 30 oder 80 Tonnen — und ohne Nachschusspflicht. Der Terminkontrakt ist standardisiert, börsengehandelt, über die Clearingstelle abgesichert und jederzeit glattstellbar, verlangt dafür aber Sicherheitsleistungen. Für die meisten Betriebe ist der Vorkontrakt deshalb der praktikablere Weg; der Händler sichert seinerseits über den [[matif]] ab.\n\n**Das Risiko, das oft unterschätzt wird**: Der Vorkontrakt ist eine **feste Lieferverpflichtung**. Fällt die Ernte durch Trockenheit, Hagel oder Auswuchs schlechter aus als geplant, muss die zugesagte Menge trotzdem geliefert werden — notfalls durch Zukauf zum dann womöglich hohen Marktpreis. Daraus folgt die Faustregel, nur einen Teil der erwarteten Ernte vorzuverkaufen, etwa 30 bis 50 %, und diesen Anteil erst mit fortschreitender Ertragssicherheit zu erhöhen.\n\nEbenso wichtig ist die **Qualitätsklausel**: Wird Mahlweizen kontrahiert und die Partie erreicht die Fallzahl nicht, greifen Abschläge oder der Kontrakt muss anders erfüllt werden. Die Bedingungen zu Proteingehalt, Fallzahl, Feuchte und Besatz gehören deshalb ebenso sorgfältig gelesen wie der Preis — ebenso wie die Frage, wer bei Lieferverzug welche Kosten trägt und ob der Händler bei Ernteausfall auf die Erfüllung besteht.",
    "related": [
      "matif",
      "komoditni-burza",
      "bazicka-cena",
      "intervencni-nakup"
    ],
    "externalUrl": "https://de.wikipedia.org/wiki/Termingesch%C3%A4ft",
    "externalLabel": "Wikipedia: Termingeschäft",
    "faq": [
      {
        "q": "Was ist ein Vorkontrakt?",
        "a": "Eine individuelle Vereinbarung über die Lieferung einer bestimmten Menge zu festem Preis und Termin in der Zukunft."
      },
      {
        "q": "Worin unterscheiden sich Vorkontrakt und Terminkontrakt?",
        "a": "Der Vorkontrakt ist individuell zwischen zwei Parteien vereinbart und ohne Nachschusspflicht; der Terminkontrakt ist standardisiert, börsengehandelt und jederzeit glattstellbar."
      },
      {
        "q": "Welches Risiko birgt ein Vorkontrakt?",
        "a": "Es besteht eine feste Lieferpflicht — bei Ernteausfall muss die Menge notfalls zugekauft werden. Deshalb sollte nur ein Teil der erwarteten Ernte vorverkauft werden."
      }
    ]
  },
  {
    "slug": "skladne",
    "term": "Lagergeld",
    "alias": [
      "Lagerkosten",
      "Lagergebühr"
    ],
    "kategorie": "dotace",
    "shortDef": "Das Lagergeld ist die Gebühr, die ein Lagerhaus für die Einlagerung von Erntegut je Tonne und Zeiteinheit berechnet.",
    "longDef": "Das Lagergeld ist das Entgelt, das ein Landhandel, eine Genossenschaft oder ein Lagerhaus für die Aufbewahrung von Getreide, Ölsaaten oder anderen Erzeugnissen verlangt. Es deckt Miete, Energie, Belüftung, Umlagerung, Schädlingskontrolle und Versicherung ab und wird üblicherweise je Tonne und Monat abgerechnet, oft mit einigen lagergeldfreien Wochen direkt nach der Ernte.\n\nFür die Vermarktungsentscheidung ist es die entscheidende Rechengröße: Wer die Ernte einlagert und auf steigende Preise wartet, muss neben dem Lagergeld auch Zinskosten für das gebundene Kapital, den Schwund und mögliche Qualitätsabschläge gegenrechnen. Erst wenn der erwartete Preisanstieg diese Summe übersteigt, lohnt das Warten.\n\nGenau diese Kosten spiegeln sich in der Terminmarktkurve: Liegen die späteren Kontrakte über dem Kassapreis (Contango), bezahlt der Markt die Lagerhaltung. Betriebe mit eigenem Lager haben hier einen strukturellen Vorteil, weil bei ihnen nur die Grenzkosten anfallen.",
    "related": [
      "komoditni-burza",
      "forwardovy-kontrakt",
      "bazicka-cena",
      "intervencni-nakup"
    ],
    "externalUrl": "https://de.wikipedia.org/wiki/Lagerkosten",
    "externalLabel": "Wikipedia: Lagerkosten",
    "faq": [
      {
        "q": "Was ist Lagergeld?",
        "a": "Die Gebühr für die Einlagerung von Erntegut in einem fremden Lager, meist je Tonne und Monat abgerechnet."
      },
      {
        "q": "Wie hoch ist das Lagergeld?",
        "a": "Es hängt von Lagerdauer, Menge und Erzeugnis ab; üblich ist eine Abrechnung je Tonne und Monat nach einigen lagergeldfreien Wochen."
      },
      {
        "q": "Warum ist das Lagergeld wichtig?",
        "a": "Zusammen mit Zins, Schwund und Qualitätsrisiko entscheidet es darüber, ob sich das Warten auf einen höheren Preis überhaupt rechnet."
      }
    ]
  },
  {
    "slug": "susina",
    "term": "Trockensubstanz (TS)",
    "alias": [
      "Trockenmasse",
      "TM",
      "TS-Gehalt"
    ],
    "kategorie": "jednotky",
    "shortDef": "Die Trockensubstanz ist der Anteil eines Materials, der nach vollständigem Wasserentzug übrig bleibt — die einzige sinnvolle Bezugsgröße für Futter und Erntemengen.",
    "longDef": "Die Trockensubstanz ist das, was nach dem Trocknen bis zur Gewichtskonstanz — im Labor bei 105 °C — übrig bleibt, angegeben in Prozent der Frischmasse.\n\n**Warum ohne sie keine Aussage möglich ist**: Eine Tonne Grassilage mit 25 % TS und eine Tonne mit 40 % TS enthalten völlig verschiedene Futtermengen. Alle Rationsberechnungen, Nährstoffangaben und Ertragsvergleiche beziehen sich deshalb auf die Trockensubstanz, nicht auf die Frischmasse. Wer Futtermittel nach Frischgewicht vergleicht, vergleicht in Wahrheit Wassergehalte.\n\n**Die Zielwerte in der Praxis** sind eng und folgenreich:\n- **Grassilage 30 bis 40 %** — darunter drohen Sickersaft und Fehlgärung durch Buttersäurebakterien, darüber lässt sich das Silo nicht mehr verdichten und es kommt zu Nacherwärmung\n- **Maissilage 30 bis 35 %** — dasselbe Spannungsfeld\n- **Heu über 86 %**, sonst Schimmel und im Extremfall Selbstentzündung\n- **Getreide unter 14 %** für die Lagerung\n- **Gülle 4 bis 10 %**\n\n**Schnellbestimmung im Betrieb**: Mikrowelle oder Trockenschrank für Silage, Refraktometer bei Honig, Feuchtemessgerät beim Getreide. Am Feldhäcksler und am Güllefass messen NIRS-Sensoren die Trockensubstanz laufend im Gutstrom mit.\n\nEine Formulierung, die häufig Verwirrung stiftet: **„je kg TM\" und „je kg Frischmasse\" unterscheiden sich um den Faktor drei bis vier.** Bei Futtermittelanalysen und Preisvergleichen lohnt jedes Mal der Blick, welche Bezugsgröße gemeint ist.",
    "related": [
      "digestat",
      "kejda",
      "hnuj"
    ],
    "externalUrl": "https://de.wikipedia.org/wiki/Trockensubstanz",
    "externalLabel": "Wikipedia: Trockensubstanz",
    "faq": [
      {
        "q": "Wie wird die Trockensubstanz bestimmt?",
        "a": "Durch Trocknen einer Probe bis zur Gewichtskonstanz, im Labor bei 105 °C; im Betrieb behelfsmäßig mit Mikrowelle oder Trockenschrank."
      },
      {
        "q": "Warum ist die Trockensubstanz wichtig?",
        "a": "Weil Futterwert, Nährstoffgehalte und Erträge nur auf Trockensubstanz bezogen vergleichbar sind."
      }
    ]
  },
  {
    "slug": "nel",
    "term": "NEL — Nettoenergie Laktation",
    "alias": [
      "NEL",
      "Nettoenergie-Laktation",
      "MJ NEL"
    ],
    "kategorie": "jednotky",
    "shortDef": "NEL ist die im deutschsprachigen Raum verbindliche Energiekennzahl für Milchkuhfutter, angegeben in Megajoule je Kilogramm Trockensubstanz.",
    "longDef": "Die Nettoenergie Laktation gibt an, wie viel Energie eines Futtermittels der Milchkuh nach allen Verlusten tatsächlich für Erhaltung und Milchbildung zur Verfügung steht. Sie wird in **MJ NEL je kg Trockensubstanz** angegeben und ist in Deutschland, Österreich und der Schweiz das verbindliche System der Rinderfütterung.\n\n**Der Weg von der Brutto- zur Nettoenergie** erklärt, warum es mehrere Kennzahlen gibt: Von der Bruttoenergie des Futters gehen zuerst die Verluste über Kot ab, dann über Harn und die Gärgase des Pansens — übrig bleibt die umsetzbare Energie ME. Davon geht schließlich noch die Wärme ab, die bei der Verdauung selbst entsteht. Was danach bleibt, ist die NEL.\n\n**Orientierungswerte:**\n\n| Futtermittel | MJ NEL je kg TM |\n|---|---|\n| Maissilage | 6,4–6,8 |\n| Grassilage, 1. Schnitt früh | 6,2–6,6 |\n| Heu, mittleres Stadium | 5,2–5,8 |\n| Getreide, Weizen | 8,3–8,5 |\n| Rapsextraktionsschrot | 7,0–7,3 |\n| Stroh | 3,5–4,0 |\n\n**Der Bedarf**: Für die Erhaltung braucht eine Kuh von 650 kg rund 35 MJ NEL täglich, für jedes Kilogramm Milch mit 4 % Fett zusätzlich etwa 3,3 MJ. Eine Kuh mit 40 kg Milch kommt damit auf über 160 MJ NEL täglich — bei einer Trockenmasseaufnahme von 23 kg muss die Ration also über 7 MJ NEL je kg TM liefern. **Genau hier liegt die eigentliche Schwierigkeit der Hochleistungsfütterung**: Die Kuh kann körperlich nicht mehr fressen, also muss die Energiedichte steigen — was den Kraftfutteranteil hochtreibt und das Risiko einer Pansenazidose erhöht.\n\nErgänzend zur Energie wird die Eiweißversorgung über nXP und die ruminale Stickstoffbilanz RNB bewertet; im französischen System entspricht dem das [[pdi]].",
    "related": [
      "ecm-mleko",
      "laktacni-krivka",
      "krizeni-plemen",
      "vykrm-skotu"
    ],
    "externalUrl": "https://de.wikipedia.org/wiki/Nettoenergie-Laktation",
    "externalLabel": "Wikipedia: Nettoenergie-Laktation",
    "faq": [
      {
        "q": "Was bedeutet NEL?",
        "a": "Nettoenergie Laktation — die Energie eines Futtermittels, die der Milchkuh nach allen Verlusten für Erhaltung und Milchbildung bleibt."
      },
      {
        "q": "Wie hoch ist der NEL-Bedarf einer Milchkuh?",
        "a": "Rund 35 MJ täglich für die Erhaltung plus etwa 3,3 MJ je Kilogramm Milch."
      }
    ]
  },
  {
    "slug": "pdi",
    "term": "PDI — im Dünndarm verdauliches Protein",
    "alias": [
      "PDI",
      "nXP",
      "nutzbares Rohprotein"
    ],
    "kategorie": "jednotky",
    "shortDef": "PDI beziffert das im Dünndarm tatsächlich verdauliche Protein — im deutschsprachigen Raum entspricht ihm das nutzbare Rohprotein nXP.",
    "longDef": "PDI (protéines digestibles dans l'intestin) stammt aus dem französischen Bewertungssystem und beziffert das Protein, das dem Wiederkäuer im **Dünndarm** tatsächlich zur Verfügung steht. Im deutschsprachigen Raum entspricht ihm das **nutzbare Rohprotein am Dünndarm (nXP)**.\n\n**Warum Rohprotein allein nichts sagt** — das ist der eigentliche Punkt: Der Wiederkäuer verwertet nicht das gefütterte Eiweiß, sondern zwei ganz verschiedene Quellen. Zum einen das **Mikrobenprotein**, das die Pansenmikroben aus abgebautem Futtereiweiß und Energie selbst aufbauen und das später mitverdaut wird; es macht den größeren Teil aus. Zum anderen das **Durchflussprotein**, das den Pansen unabgebaut passiert.\n\nDaraus folgt eine Konsequenz, die in der Praxis entscheidet: **Die Mikroben brauchen Energie, um Eiweiß zu bauen.** Fehlt Energie in der Ration, wird überschüssiges Futtereiweiß im Pansen zu Ammoniak abgebaut, über die Leber zu Harnstoff umgebaut und ausgeschieden. Das kostet die Kuh Energie, belastet Leber und Fruchtbarkeit und landet als Stickstoff in der Gülle. Ein hoher **Milchharnstoffgehalt** zeigt genau das an — Eiweiß und Energie passen nicht zusammen.\n\n**Der zweite Kennwert** ist die **ruminale Stickstoffbilanz (RNB)**: Sie soll ausgeglichen bis leicht positiv sein. Stark positiv bedeutet Eiweißüberschuss und Stickstoffverlust, negativ bedeutet, dass den Mikroben Stickstoff fehlt und die Faserverdauung leidet.\n\n**Praktisch heißt das**: Nicht mehr Eiweiß füttern, sondern Eiweiß und Energie **synchronisieren**. Das spart teures Eiweißfutter, senkt die Stickstoffausscheidung — was direkt in die Stoffstrombilanz nach Düngeverordnung eingeht — und verbessert Gesundheit und Fruchtbarkeit zugleich.",
    "related": [
      "hnuj",
      "digestat",
      "kejda"
    ],
    "externalUrl": "https://de.wikipedia.org/wiki/Nutzbares_Rohprotein",
    "externalLabel": "Wikipedia: Nutzbares Rohprotein",
    "faq": [
      {
        "q": "Was ist PDI beziehungsweise nXP?",
        "a": "Das Protein, das dem Wiederkäuer im Dünndarm tatsächlich zur Verfügung steht — Mikrobenprotein plus unabgebautes Futterprotein."
      },
      {
        "q": "Warum reicht der Rohproteingehalt nicht aus?",
        "a": "Weil der Wiederkäuer vor allem Mikrobenprotein verwertet, dessen Bildung Energie erfordert — ohne passende Energie geht überschüssiges Eiweiß als Harnstoff verloren."
      }
    ]
  },
  {
    "slug": "vynos-t-ha",
    "term": "Ertrag (t/ha)",
    "alias": [
      "Flächenertrag",
      "Hektarertrag",
      "dt/ha"
    ],
    "kategorie": "jednotky",
    "shortDef": "Der Ertrag ist die geerntete Menge je Flächeneinheit — im deutschsprachigen Raum meist in Dezitonnen je Hektar angegeben.",
    "longDef": "Der Ertrag beziffert die geerntete Menge je Hektar. **Achtung bei der Einheit**: Im deutschsprachigen Raum ist die übliche Angabe **dt/ha** (Dezitonnen je Hektar, also 100 kg/ha) und nicht t/ha. Ein Weizenertrag von 80 dt/ha entspricht 8 t/ha — bei Vergleichen mit internationalen Quellen, die in t/ha rechnen, ist das die häufigste Fehlerquelle.\n\n**Orientierungswerte in Deutschland** im mehrjährigen Mittel: Winterweizen 75 bis 80 dt/ha, Wintergerste 70 bis 75, Winterraps 35 bis 38, Körnermais 90 bis 100, Zuckerrüben 700 bis 800 dt/ha. Österreich liegt wegen des höheren Anteils trockener und alpiner Lagen im Mittel darunter.\n\n**Zwei Angaben, die verwechselt werden**: Der Ertrag wird auf **Standardfeuchte** bezogen — 14 % bei Getreide, 9 % bei Raps, 14 % bei Körnermais. Frisch gedroschene Ware mit höherer Feuchte wiegt mehr, liefert aber nicht mehr Ertrag; die Abrechnung erfolgt nach Trocknung beziehungsweise mit Abzug.\n\n**Was den Ertrag begrenzt**, folgt dem **Minimumgesetz**: Es entscheidet der knappste Faktor, nicht die Summe aller Faktoren. In Mitteleuropa ist das zunehmend **Wasser**, gefolgt von Bodengüte, Fruchtfolge und Bestandesführung.\n\n**Der Ertrag allein ist keine betriebswirtschaftliche Größe.** Der höchste Ertrag ist selten der wirtschaftlichste — entscheidend sind Deckungsbeitrag und Grenzertrag: Ab einem gewissen Punkt kostet jede zusätzliche Einheit Dünger oder Pflanzenschutz mehr, als sie an Mehrertrag einbringt. Ertragskarten aus dem Mähdrescher liefern die Datengrundlage für [[mapa-vra]].",
    "related": [
      "osevni-postup",
      "strip-till",
      "mulcovac"
    ],
    "externalUrl": "https://de.wikipedia.org/wiki/Ertrag_(Landwirtschaft)",
    "externalLabel": "Wikipedia: Ertrag",
    "faq": [
      {
        "q": "Wie wird der Ertrag berechnet?",
        "a": "Als geerntete Menge geteilt durch die Fläche, bezogen auf die Standardfeuchte der jeweiligen Kultur."
      },
      {
        "q": "Was ist der Unterschied zwischen dt/ha und t/ha?",
        "a": "Eine Dezitonne sind 100 kg — 80 dt/ha entsprechen 8 t/ha. Im deutschsprachigen Raum ist dt/ha üblich."
      }
    ]
  },
  {
    "slug": "objemova-hmotnost-obili",
    "term": "Hektolitergewicht",
    "alias": [
      "hl-Gewicht",
      "Schüttdichte",
      "Testgewicht"
    ],
    "kategorie": "jednotky",
    "shortDef": "Das Hektolitergewicht ist die Masse von 100 Litern Getreide in Kilogramm — das schnellste Qualitätsmerkmal bei der Annahme.",
    "longDef": "Das Hektolitergewicht gibt an, wie viel 100 Liter Getreide wiegen, angegeben in **kg/hl**. Gemessen wird es mit einem genormten Schüttgewichtsmesser direkt an der Annahmestelle — es ist damit das schnellste und am häufigsten verwendete Qualitätsmerkmal überhaupt.\n\n**Was es aussagt**: Ein hohes Hektolitergewicht steht für gut ausgebildete, prall gefüllte Körner und damit für einen hohen Mehlausbeutewert. Niedrige Werte deuten auf Schmachtkorn nach Trockenheit oder Krankheitsbefall, auf Auswuchs oder auf hohen Besatzanteil.\n\n**Übliche Anforderungen:**\n\n| Getreide | kg/hl |\n|---|---|\n| Brotweizen | mind. 76–78 |\n| Roggen | mind. 71–73 |\n| Braugerste | mind. 66–68 |\n| Futtergerste | mind. 62–64 |\n| Hafer | mind. 50–52 |\n\n**Warum es wirtschaftlich unmittelbar zählt**: Bei den meisten Kontrakten für Brotweizen ist das Hektolitergewicht neben Proteingehalt und Fallzahl ein **Aufnahmekriterium**. Wird der Mindestwert unterschritten, geht die Partie mit Abschlag in den Futterbereich — der Preisunterschied zwischen Brot- und Futterweizen entscheidet dann über das Ergebnis des ganzen Schlages.\n\n**Was bei der Interpretation zu beachten ist**: Der Wert hängt von der Kornfeuchte ab — feuchtes Getreide schüttet lockerer und wiegt je Hektoliter weniger. Verglichen wird deshalb nur bei Standardfeuchte. Und die Schüttdichte reagiert empfindlich auf Besatz und Kornform; das Hektolitergewicht ersetzt weder Fallzahl noch Proteinbestimmung, sondern ergänzt sie.",
    "related": [
      "komoditni-burza",
      "intervencni-nakup",
      "matif",
      "forwardovy-kontrakt"
    ],
    "externalUrl": "https://de.wikipedia.org/wiki/Hektolitergewicht",
    "externalLabel": "Wikipedia: Hektolitergewicht",
    "faq": [
      {
        "q": "Wie wird das Hektolitergewicht gemessen?",
        "a": "Mit einem genormten Schüttgewichtsmesser, der die Masse von 100 Litern Getreide bestimmt."
      },
      {
        "q": "Warum ist das Hektolitergewicht wichtig?",
        "a": "Es ist ein Aufnahmekriterium bei Brotgetreide — wird der Mindestwert unterschritten, geht die Partie mit Abschlag in den Futterbereich."
      }
    ]
  },
  {
    "slug": "davka-l-ha",
    "term": "Wasseraufwandmenge (l/ha)",
    "alias": [
      "Wasseraufwand",
      "Brühemenge",
      "Ausbringmenge"
    ],
    "kategorie": "jednotky",
    "shortDef": "Die Wasseraufwandmenge ist die Menge Spritzbrühe je Hektar — sie bestimmt Benetzung und Eindringtiefe, nicht die Wirkstoffmenge.",
    "longDef": "Die Wasseraufwandmenge gibt an, wie viel Liter Spritzbrühe je Hektar ausgebracht werden. **Der wichtigste Punkt vorweg, weil er ständig verwechselt wird**: Sie ändert **nicht** die ausgebrachte Wirkstoffmenge. Die ist durch die Aufwandmenge des Mittels je Hektar festgelegt. Das Wasser ist nur das Transportmittel — es bestimmt, wie der Wirkstoff verteilt wird, nicht wie viel davon ankommt.\n\n**Was sie tatsächlich beeinflusst**: die Tropfenzahl und damit die Gleichmäßigkeit der Benetzung, die Eindringtiefe in dichte Bestände und die Abdriftneigung.\n\n**Übliche Bereiche und ihre Logik:**\n- **100 bis 150 l/ha** — systemische Blattherbizide auf niedrigen Beständen; wenig Wasser reicht, weil der Wirkstoff selbst wandert\n- **200 bis 300 l/ha** — Fungizide im Getreide; hier muss die Brühe bis ins Fahnenblatt und in dichte Bestände hinein\n- **300 bis 400 l/ha** — Bodenherbizide, die eine geschlossene Benetzung der Bodenoberfläche brauchen, sowie dichte Kartoffel- und Rübenbestände\n- **bis über 1.000 l/ha** — Obst- und Weinbau mit Gebläsespritzen im dreidimensionalen Bestand\n\n**Die verbreitete Sparlogik geht oft nach hinten los.** Weniger Wasser bedeutet weniger Nachfüllstopps und mehr Flächenleistung — aber bei Kontaktmitteln und dichten Beständen sinkt die Wirkung, weil schlicht zu wenige Tropfen je Blattfläche ankommen. Bei systemischen Mitteln ist die Reduktion dagegen meist unkritisch.\n\n**Verbindlich ist die Gebrauchsanleitung**: Sie nennt für jedes Mittel und jede Indikation einen zulässigen Bereich, oft mit Staffelung nach Bestandeshöhe. Zusammen mit der Düsenwahl bestimmt die Wasseraufwandmenge außerdem die Abdriftminderungsklasse — und damit die einzuhaltenden Abstände zu Gewässern und Saumbiotopen.",
    "related": [
      "herbicidy",
      "insekticidy",
      "fungicidy",
      "adjuvant"
    ],
    "externalUrl": "https://de.wikipedia.org/wiki/Feldspritze",
    "externalLabel": "Wikipedia: Feldspritze",
    "faq": [
      {
        "q": "Wie wird die Wasseraufwandmenge festgelegt?",
        "a": "Nach der Gebrauchsanleitung des Mittels, angepasst an Bestandesdichte und Zielfläche — sie ändert nicht die Wirkstoffmenge je Hektar."
      },
      {
        "q": "Welche Wasseraufwandmenge ist üblich?",
        "a": "100 bis 150 l/ha bei systemischen Herbiziden, 200 bis 300 l/ha bei Fungiziden im Getreide, 300 bis 400 l/ha bei Bodenherbiziden."
      }
    ]
  }
];

export const KATEGORIE_LABELS_DE: Record<SlovnikKategorie, string> = {
  technologie: 'Technik',
  pohon: 'Antrieb und Motor',
  hnojivo: 'Düngemittel',
  dotace: 'Förderung und Markt',
  agrotechnika: 'Ackerbau',
  regulace: 'Recht und Normen',
  'precise-farming': 'Präzisionslandwirtschaft',
  jednotky: 'Einheiten und Messgrößen',
  historie: 'Geschichte und historische Begriffe',
  chov: 'Tierhaltung',
  slang: 'Umgangssprache',
  ochrana: 'Pflanzenschutz',
  plodiny: 'Kulturen und Rohstoffe',
  vcelarstvi: 'Imkerei',
};
