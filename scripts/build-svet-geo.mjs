// Build hranic regionů zemí pro choropleth mapy /svet/[slug]/.
//
// ZDROJ: Natural Earth 1:10m Admin 1 – States, Provinces (public domain,
// https://www.naturalearthdata.com/about/terms-of-use/), verze v5.1.2.
// ‼️ Dřív GISCO NUTS 2021 — podmínky GISCO pro statistické jednotky zakazují
// komerční použití (audit licencí 2026-10-15, foto-audit/de/rizika/B-licence-dat.md).
// Volně použitelná NUTS geometrie neexistuje, proto se régiony NUTS SKLÁDAJÍ ze
// správních jednotek Natural Earth (kraje, vojvodství, departementy, provincie…):
// každá jednotka se v tabulce níž přiřadí ke svému NUTS kódu a sousední jednotky
// se sloučí (dissolve). Data (Eurostat FSS) zůstávají na NUTS kódech beze změny.
//
// Kde se NUTS régiony ze správních jednotek Natural Earth složit nedají, mapa není:
//  - Portugalsko: NUTS-2 (Norte, Centro, AML, Alentejo) protínají distrikty (Lisboa,
//    Setúbal, Santarém, Aveiro…), Natural Earth nic jemnějšího nemá → bez regionální mapy.
//  - Polsko: PL91 (Warszawski stołeczny) a PL92 (Mazowiecki regionalny) jsou dělené po
//    powiatech, Natural Earth má jen celé vojvodství → jeden région PL9 (NUTS-1
//    „Makroregion województwo mazowieckie" = přesně Mazovské vojvodství).
//
// Projekce EPSG:3035 (rovnoplochá) → areaKm2 je skutečná rozloha a SVG se kreslí
// rovnou z rovinných souřadnic. Hranice se zjednodušují po obloucích (simplifyShared),
// takže sousední régiony na sebe sedí bez mezer.
//
// Spuštění: node scripts/build-svet-geo.mjs   (výstup se commituje)
//   NE_ADMIN1=/cesta/ne_10m_admin_1_states_provinces.geojson … místo stahování
// Po změně geometrie pusť i `node scripts/build-svet-regions.mjs` (uaa_share = UAA / rozloha).
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { tmpdir } from 'node:os';
import { laea3035, polygonsOf, snapRing, dissolve, simplifyShared, ringsToPath, signedArea, loadJson } from './lib/svet/geo.mjs';

const NE_VERSION = 'v5.1.2';
const NE_ADMIN1 = process.env.NE_ADMIN1
  || `https://raw.githubusercontent.com/nvkelso/natural-earth-vector/${NE_VERSION}/geojson/ne_10m_admin_1_states_provinces.geojson`;

const VIEW_W = 1000; // šířka viewBoxu; výška dopočtena dle poměru stran
const GRID = 1; // m — mřížka pro sloučení sdílených vrcholů
const EPS = 1500; // m — tolerance Douglas–Peucker (≈ 1–3 px podle velikosti země)
const DROP = '__drop__';

// pomocníci pro přiřazení: podle ISO 3166-2, podle pole `region` v Natural Earth
const byIso = (table) => (p) => table[p.iso_3166_2];
const trim = (s) => (s ?? '').trim();

/**
 * Každá země: slug, ISO-A2 kódy vrstvy Natural Earth, názvy régionů (oficiální názvy NUTS)
 * a funkce assign(properties) → NUTS kód | DROP. Jednotka, kterou assign nezná, zastaví build.
 */
const COUNTRIES = [
  {
    slug: 'francie', iso: ['FR'], level: 1,
    names: { FR1: 'Ile-de-France', FRB: 'Centre — Val de Loire', FRC: 'Bourgogne-Franche-Comté', FRD: 'Normandie', FRE: 'Hauts-de-France', FRF: 'Grand Est', FRG: 'Pays de la Loire', FRH: 'Bretagne', FRI: 'Nouvelle-Aquitaine', FRJ: 'Occitanie', FRK: 'Auvergne-Rhône-Alpes', FRL: 'Provence-Alpes-Côte d’Azur', FRM: 'Corse' },
    // departementy (NUTS-3) → régiony (NUTS-1) podle pole region_cod; zámoří (FRY) mimo
    assign: (p) => ({ 'FR-IDF': 'FR1', 'FR-CVL': 'FRB', 'FR-BFC': 'FRC', 'FR-NOR': 'FRD', 'FR-HDF': 'FRE', 'FR-GES': 'FRF', 'FR-PDL': 'FRG', 'FR-BRE': 'FRH', 'FR-NAQ': 'FRI', 'FR-OCC': 'FRJ', 'FR-ARA': 'FRK', 'FR-PAC': 'FRL', 'FR-COR': 'FRM', 'FR-GUA': DROP, 'FR-GUF': DROP, 'FR-MTQ': DROP, 'FR-MAY': DROP, 'FR-LRE': DROP })[trim(p.region_cod)],
  },
  {
    slug: 'nemecko', iso: ['DE'], level: 1,
    names: { DE1: 'Baden-Württemberg', DE2: 'Bayern', DE3: 'Berlin', DE4: 'Brandenburg', DE5: 'Bremen', DE6: 'Hamburg', DE7: 'Hessen', DE8: 'Mecklenburg-Vorpommern', DE9: 'Niedersachsen', DEA: 'Nordrhein-Westfalen', DEB: 'Rheinland-Pfalz', DEC: 'Saarland', DED: 'Sachsen', DEE: 'Sachsen-Anhalt', DEF: 'Schleswig-Holstein', DEG: 'Thüringen' },
    assign: byIso({ 'DE-BW': 'DE1', 'DE-BY': 'DE2', 'DE-BE': 'DE3', 'DE-BB': 'DE4', 'DE-HB': 'DE5', 'DE-HH': 'DE6', 'DE-HE': 'DE7', 'DE-MV': 'DE8', 'DE-NI': 'DE9', 'DE-NW': 'DEA', 'DE-RP': 'DEB', 'DE-SL': 'DEC', 'DE-SN': 'DED', 'DE-ST': 'DEE', 'DE-SH': 'DEF', 'DE-TH': 'DEG' }),
  },
  {
    slug: 'polsko', iso: ['PL'], level: 2,
    names: { PL21: 'Małopolskie', PL22: 'Śląskie', PL41: 'Wielkopolskie', PL42: 'Zachodniopomorskie', PL43: 'Lubuskie', PL51: 'Dolnośląskie', PL52: 'Opolskie', PL61: 'Kujawsko-pomorskie', PL62: 'Warmińsko-mazurskie', PL63: 'Pomorskie', PL71: 'Łódzkie', PL72: 'Świętokrzyskie', PL81: 'Lubelskie', PL82: 'Podkarpackie', PL84: 'Podlaskie', PL9: 'Mazowieckie' },
    assign: byIso({ 'PL-MA': 'PL21', 'PL-SL': 'PL22', 'PL-WP': 'PL41', 'PL-ZP': 'PL42', 'PL-LB': 'PL43', 'PL-DS': 'PL51', 'PL-OP': 'PL52', 'PL-KP': 'PL61', 'PL-WN': 'PL62', 'PL-PM': 'PL63', 'PL-LD': 'PL71', 'PL-SK': 'PL72', 'PL-LU': 'PL81', 'PL-PK': 'PL82', 'PL-PD': 'PL84', 'PL-MZ': 'PL9' }),
  },
  {
    slug: 'slovensko', iso: ['SK'], level: 2,
    names: { SK01: 'Bratislavský kraj', SK02: 'Západné Slovensko', SK03: 'Stredné Slovensko', SK04: 'Východné Slovensko' },
    assign: byIso({ 'SK-BL': 'SK01', 'SK-TA': 'SK02', 'SK-TC': 'SK02', 'SK-NI': 'SK02', 'SK-ZI': 'SK03', 'SK-BC': 'SK03', 'SK-PV': 'SK04', 'SK-KI': 'SK04' }),
  },
  {
    slug: 'spanelsko', iso: ['ES'], level: 2,
    names: { ES11: 'Galicia', ES12: 'Principado de Asturias', ES13: 'Cantabria', ES21: 'País Vasco', ES22: 'Comunidad Foral de Navarra', ES23: 'La Rioja', ES24: 'Aragón', ES30: 'Comunidad de Madrid', ES41: 'Castilla y León', ES42: 'Castilla-La Mancha', ES43: 'Extremadura', ES51: 'Cataluña', ES52: 'Comunitat Valenciana', ES53: 'Illes Balears', ES61: 'Andalucía', ES62: 'Región de Murcia' },
    // provincie → autonomní společenství; Kanárské ostrovy, Ceuta a Melilla mimo (jako dřív)
    assign: (p) => (['ES-TF', 'ES-GC', 'ES-CE', 'ES-ML'].includes(p.iso_3166_2) ? DROP : ({ 'ES.GA': 'ES11', 'ES.AS': 'ES12', 'ES.CB': 'ES13', 'ES.PV': 'ES21', 'ES.NA': 'ES22', 'ES.LO': 'ES23', 'ES.AR': 'ES24', 'ES.MD': 'ES30', 'ES.CL': 'ES41', 'ES.CM': 'ES42', 'ES.EX': 'ES43', 'ES.CT': 'ES51', 'ES.VC': 'ES52', 'ES.PM': 'ES53', 'ES.AN': 'ES61', 'ES.MU': 'ES62' })[trim(p.region_cod)]),
  },
  {
    slug: 'italie', iso: ['IT'], level: 2,
    names: { ITC1: 'Piemonte', ITC2: 'Valle d’Aosta/Vallée d’Aoste', ITC3: 'Liguria', ITC4: 'Lombardia', ITF1: 'Abruzzo', ITF2: 'Molise', ITF3: 'Campania', ITF4: 'Puglia', ITF5: 'Basilicata', ITF6: 'Calabria', ITG1: 'Sicilia', ITG2: 'Sardegna', ITH1: 'Provincia Autonoma di Bolzano/Bozen', ITH2: 'Provincia Autonoma di Trento', ITH3: 'Veneto', ITH4: 'Friuli-Venezia Giulia', ITH5: 'Emilia-Romagna', ITI1: 'Toscana', ITI2: 'Umbria', ITI3: 'Marche', ITI4: 'Lazio' },
    // provincie → regiony; Trentino-Alto Adige je v NUTS rozdělené na dvě autonomní provincie
    assign: (p) => (p.iso_3166_2 === 'IT-BZ' ? 'ITH1' : p.iso_3166_2 === 'IT-TN' ? 'ITH2' : ({ 'IT-21': 'ITC1', 'IT-23': 'ITC2', 'IT-42': 'ITC3', 'IT-25': 'ITC4', 'IT-65': 'ITF1', 'IT-67': 'ITF2', 'IT-72': 'ITF3', 'IT-75': 'ITF4', 'IT-77': 'ITF5', 'IT-78': 'ITF6', 'IT-82': 'ITG1', 'IT-88': 'ITG2', 'IT-34': 'ITH3', 'IT-36': 'ITH4', 'IT-45': 'ITH5', 'IT-52': 'ITI1', 'IT-55': 'ITI2', 'IT-57': 'ITI3', 'IT-62': 'ITI4' })[trim(p.region_cod)]),
  },
  {
    slug: 'nizozemsko', iso: ['NL'], level: 2,
    names: { NL11: 'Groningen', NL12: 'Friesland (NL)', NL13: 'Drenthe', NL21: 'Overijssel', NL22: 'Gelderland', NL23: 'Flevoland', NL31: 'Utrecht', NL32: 'Noord-Holland', NL33: 'Zuid-Holland', NL34: 'Zeeland', NL41: 'Noord-Brabant', NL42: 'Limburg (NL)' },
    // karibské zvláštní obce (Bonaire, Sint Eustatius, Saba) mimo
    assign: byIso({ 'NL-GR': 'NL11', 'NL-FR': 'NL12', 'NL-DR': 'NL13', 'NL-OV': 'NL21', 'NL-GE': 'NL22', 'NL-FL': 'NL23', 'NL-UT': 'NL31', 'NL-NH': 'NL32', 'NL-ZH': 'NL33', 'NL-ZE': 'NL34', 'NL-NB': 'NL41', 'NL-LI': 'NL42', 'NL-BQ1': DROP, 'NL-BQ2': DROP, 'NL-BQ3': DROP }),
  },
  {
    slug: 'rakousko', iso: ['AT'], level: 2,
    names: { AT11: 'Burgenland', AT12: 'Niederösterreich', AT13: 'Wien', AT21: 'Kärnten', AT22: 'Steiermark', AT31: 'Oberösterreich', AT32: 'Salzburg', AT33: 'Tirol', AT34: 'Vorarlberg' },
    assign: byIso({ 'AT-1': 'AT11', 'AT-3': 'AT12', 'AT-9': 'AT13', 'AT-2': 'AT21', 'AT-6': 'AT22', 'AT-4': 'AT31', 'AT-5': 'AT32', 'AT-7': 'AT33', 'AT-8': 'AT34' }),
  },
  {
    slug: 'belgie', iso: ['BE'], level: 2,
    names: { BE10: 'Région de Bruxelles-Capitale/ Brussels Hoofdstedelijk Gewest', BE21: 'Prov. Antwerpen', BE22: 'Prov. Limburg (BE)', BE23: 'Prov. Oost-Vlaanderen', BE24: 'Prov. Vlaams-Brabant', BE25: 'Prov. West-Vlaanderen', BE31: 'Prov. Brabant Wallon', BE32: 'Prov. Hainaut', BE33: 'Prov. Liège', BE34: 'Prov. Luxembourg (BE)', BE35: 'Prov. Namur' },
    assign: byIso({ 'BE-BRU': 'BE10', 'BE-VAN': 'BE21', 'BE-VLI': 'BE22', 'BE-VOV': 'BE23', 'BE-VBR': 'BE24', 'BE-VWV': 'BE25', 'BE-WBR': 'BE31', 'BE-WHT': 'BE32', 'BE-WLG': 'BE33', 'BE-WLX': 'BE34', 'BE-WNA': 'BE35' }),
  },
  {
    slug: 'dansko', iso: ['DK'], level: 2,
    names: { DK01: 'Hovedstaden', DK02: 'Sjælland', DK03: 'Syddanmark', DK04: 'Midtjylland', DK05: 'Nordjylland' },
    assign: byIso({ 'DK-84': 'DK01', 'DK-85': 'DK02', 'DK-83': 'DK03', 'DK-82': 'DK04', 'DK-81': 'DK05' }),
  },
  {
    slug: 'irsko', iso: ['IE'], level: 2,
    names: { IE04: 'Northern and Western', IE05: 'Southern', IE06: 'Eastern and Midland' },
    // hrabství podle starých regionálních úřadů (pole region); Louth patří od NUTS 2016
    // do Mid-East (IE062), tedy IE06, ne do Border
    assign: (p) => (p.name === 'Louth' ? 'IE06' : ({ Border: 'IE04', West: 'IE04', Dublin: 'IE06', 'Mid-East': 'IE06', Midlands: 'IE06', 'Mid-West': 'IE05', 'South-East': 'IE05', 'South-West': 'IE05' })[trim(p.region)]),
  },
  {
    slug: 'svedsko', iso: ['SE'], level: 2,
    names: { SE11: 'Stockholm', SE12: 'Östra Mellansverige', SE21: 'Småland med öarna', SE22: 'Sydsverige', SE23: 'Västsverige', SE31: 'Norra Mellansverige', SE32: 'Mellersta Norrland', SE33: 'Övre Norrland' },
    assign: byIso({ 'SE-AB': 'SE11', 'SE-C': 'SE12', 'SE-D': 'SE12', 'SE-E': 'SE12', 'SE-T': 'SE12', 'SE-U': 'SE12', 'SE-F': 'SE21', 'SE-G': 'SE21', 'SE-H': 'SE21', 'SE-I': 'SE21', 'SE-K': 'SE22', 'SE-M': 'SE22', 'SE-N': 'SE23', 'SE-O': 'SE23', 'SE-S': 'SE31', 'SE-W': 'SE31', 'SE-X': 'SE31', 'SE-Y': 'SE32', 'SE-Z': 'SE32', 'SE-AC': 'SE33', 'SE-BD': 'SE33' }),
  },
  {
    slug: 'finsko', iso: ['FI', 'AX'], level: 2,
    names: { FI19: 'Länsi-Suomi', FI1B: 'Helsinki-Uusimaa', FI1C: 'Etelä-Suomi', FI1D: 'Pohjois- ja Itä-Suomi', FI20: 'Åland' },
    // maakunnat → NUTS-2 (2021); Åland má v Natural Earth vlastní ISO kód AX (obce)
    assign: (p) => (p.iso_a2 === 'AX' ? 'FI20' : ({ 'FI-17': 'FI19', 'FI-11': 'FI19', 'FI-08': 'FI19', 'FI-03': 'FI19', 'FI-12': 'FI19', 'FI-18': 'FI1B', 'FI-19': 'FI1C', 'FI-06': 'FI1C', 'FI-16': 'FI1C', 'FI-09': 'FI1C', 'FI-02': 'FI1C', 'FI-04': 'FI1D', 'FI-15': 'FI1D', 'FI-13': 'FI1D', 'FI-05': 'FI1D', 'FI-07': 'FI1D', 'FI-14': 'FI1D', 'FI-10': 'FI1D' })[p.iso_3166_2]),
  },
  {
    slug: 'recko', iso: ['GR'], level: 2,
    names: { EL30: 'Attiki', EL41: 'Voreio Aigaio', EL42: 'Notio Aigaio', EL43: 'Kriti', EL51: 'Anatoliki Makedonia, Thraki', EL52: 'Kentriki Makedonia', EL53: 'Dytiki Makedonia', EL54: 'Ipeiros', EL61: 'Thessalia', EL62: 'Ionia Nisia', EL63: 'Dytiki Elláda', EL64: 'Sterea Elláda', EL65: 'Peloponnisos' },
    // periferie → NUTS-2 (kódy EL); Agion Oros je v NUTS součástí Kentriki Makedonia
    assign: byIso({ 'GR-A1': 'EL30', 'GR-K': 'EL41', 'GR-L': 'EL42', 'GR-M': 'EL43', 'GR-A': 'EL51', 'GR-B': 'EL52', 'GR-69': 'EL52', 'GR-C': 'EL53', 'GR-D': 'EL54', 'GR-E': 'EL61', 'GR-F': 'EL62', 'GR-G': 'EL63', 'GR-H': 'EL64', 'GR-J': 'EL65' }),
  },
  {
    slug: 'madarsko', iso: ['HU'], level: 2,
    names: { HU11: 'Budapest', HU12: 'Pest', HU21: 'Közép-Dunántúl', HU22: 'Nyugat-Dunántúl', HU23: 'Dél-Dunántúl', HU31: 'Észak-Magyarország', HU32: 'Észak-Alföld', HU33: 'Dél-Alföld' },
    // župy a města se župním právem podle pole region (NUTS-2 2016); Közép-Magyarország
    // je od NUTS 2021 rozdělené na Budapešť a Pest (Érd leží v Pest)
    assign: (p) => (p.iso_3166_2 === 'HU-BU' ? 'HU11' : ({ 'Central Hungary': 'HU12', 'Central Transdanubia': 'HU21', 'Western Transdanubia': 'HU22', 'Southern Transdanubia': 'HU23', 'Northern Hungary': 'HU31', 'Northern Great Plain': 'HU32', 'Great Southern Plain': 'HU33' })[trim(p.region)]),
  },
  {
    slug: 'rumunsko', iso: ['RO'], level: 2,
    names: { RO11: 'Nord-Vest', RO12: 'Centru', RO21: 'Nord-Est', RO22: 'Sud-Est', RO31: 'Sud-Muntenia', RO32: 'Bucureşti-Ilfov', RO41: 'Sud-Vest Oltenia', RO42: 'Vest' },
    assign: (p) => ({ BH: 'RO11', BN: 'RO11', CJ: 'RO11', MM: 'RO11', SM: 'RO11', SJ: 'RO11', AB: 'RO12', BV: 'RO12', CV: 'RO12', HR: 'RO12', MS: 'RO12', SB: 'RO12', BC: 'RO21', BT: 'RO21', IS: 'RO21', NT: 'RO21', SV: 'RO21', VS: 'RO21', BR: 'RO22', BZ: 'RO22', CT: 'RO22', GL: 'RO22', TL: 'RO22', VN: 'RO22', AG: 'RO31', CL: 'RO31', DB: 'RO31', GR: 'RO31', IL: 'RO31', PH: 'RO31', TR: 'RO31', B: 'RO32', IF: 'RO32', DJ: 'RO41', GJ: 'RO41', MH: 'RO41', OT: 'RO41', VL: 'RO41', AR: 'RO42', CS: 'RO42', HD: 'RO42', TM: 'RO42' })[p.iso_3166_2.replace('RO-', '')],
  },
  {
    slug: 'bulharsko', iso: ['BG'], level: 2,
    names: { BG31: 'Severozapaden', BG32: 'Severen tsentralen', BG33: 'Severoiztochen', BG34: 'Yugoiztochen', BG41: 'Yugozapaden', BG42: 'Yuzhen tsentralen' },
    assign: (p) => ({ '05': 'BG31', 12: 'BG31', '06': 'BG31', 15: 'BG31', 11: 'BG31', '04': 'BG32', '07': 'BG32', 18: 'BG32', 17: 'BG32', 19: 'BG32', '03': 'BG33', '08': 'BG33', 27: 'BG33', 25: 'BG33', '02': 'BG34', 20: 'BG34', 28: 'BG34', 24: 'BG34', 22: 'BG41', 23: 'BG41', '01': 'BG41', 14: 'BG41', 10: 'BG41', 16: 'BG42', 26: 'BG42', 13: 'BG42', 21: 'BG42', '09': 'BG42' })[p.iso_3166_2.replace('BG-', '')],
  },
  {
    slug: 'slovinsko', iso: ['SI'], level: 2,
    names: { SI03: 'Vzhodna Slovenija', SI04: 'Zahodna Slovenija' },
    // obce podle statistického regionu (pole region): Zahodna = Osrednjeslovenska, Gorenjska,
    // Goriška, Obalno-kraška. Litija a Šmartno pri Litiji přešly 2015 do Zasavske → Vzhodna.
    assign: (p) => (['SI-060', 'SI-194'].includes(p.iso_3166_2) ? 'SI03'
      : ['Osrednjeslovenska', 'Gorenjska', 'Goriška', 'Obalno-kraška'].includes(trim(p.region)) ? 'SI04'
      : ['Pomurska', 'Podravska', 'Koroška', 'Savinjska', 'Zasavska', 'Spodnjeposavska', 'Jugovzhodna Slovenija', 'Notranjsko-kraška'].includes(trim(p.region)) ? 'SI03'
      : undefined),
  },
  {
    slug: 'chorvatsko', iso: ['HR'], level: 2,
    names: { HR02: 'Panonska Hrvatska', HR03: 'Jadranska Hrvatska', HR05: 'Grad Zagreb', HR06: 'Sjeverna Hrvatska' },
    // župy → NUTS-2 2021 (HR-12 je v Natural Earth omylem dvakrát — druhá je Požeško-slavonska, obě HR02)
    assign: (p) => ({ 21: 'HR05', 20: 'HR06', '05': 'HR06', '06': 'HR06', '02': 'HR06', '01': 'HR06', '07': 'HR02', 10: 'HR02', 11: 'HR02', 12: 'HR02', 14: 'HR02', 16: 'HR02', '04': 'HR02', '03': 'HR02', '08': 'HR03', '09': 'HR03', 13: 'HR03', 15: 'HR03', 17: 'HR03', 18: 'HR03', 19: 'HR03' })[p.iso_3166_2.replace('HR-', '')],
  },
  {
    slug: 'litva', iso: ['LT'], level: 2,
    names: { LT01: 'Sostinės regionas', LT02: 'Vidurio ir vakarų Lietuvos regionas' },
    assign: (p) => (p.iso_3166_2 === 'LT-VL' ? 'LT01' : 'LT02'),
  },
  // --- Mimo EU: data FSS 2016 (UK) na NUTS-1 ---
  {
    slug: 'velka-britanie', iso: ['GB'], level: 1,
    names: { UKC: 'North East (England)', UKD: 'North West (England)', UKE: 'Yorkshire and the Humber', UKF: 'East Midlands (England)', UKG: 'West Midlands (England)', UKH: 'East of England', UKI: 'London', UKJ: 'South East (England)', UKK: 'South West (England)', UKL: 'Wales', UKM: 'Scotland', UKN: 'Northern Ireland' },
    // Skotsko, Wales, Severní Irsko podle geonunit; anglické regiony podle pole region
    assign: (p) => ({ Scotland: 'UKM', Wales: 'UKL', 'Northern Ireland': 'UKN' })[p.geonunit]
      ?? ({ 'North East': 'UKC', 'North West': 'UKD', 'Yorkshire and the Humber': 'UKE', 'East Midlands': 'UKF', 'West Midlands': 'UKG', East: 'UKH', 'Greater London': 'UKI', 'South East': 'UKJ', 'South West': 'UKK' })[trim(p.region)],
  },
];

const ne = await loadJson(NE_ADMIN1, { cacheFile: process.env.NE_ADMIN1 ? undefined : join(tmpdir(), `ne_10m_admin_1_${NE_VERSION}.geojson`) });

for (const c of COUNTRIES) {
  // 1) přiřazení jednotek Natural Earth k NUTS kódům
  const units = new Map(); // code → [polygon (prstence v EPSG:3035)]
  for (const f of ne.features.filter((f) => c.iso.includes(f.properties.iso_a2))) {
    const code = c.assign(f.properties);
    if (code === DROP) continue;
    if (!code || !c.names[code]) throw new Error(`${c.slug}: jednotka ${f.properties.adm1_code} ${f.properties.name} (${f.properties.iso_3166_2}, region=${f.properties.region}) nemá NUTS kód`);
    if (!units.has(code)) units.set(code, []);
    for (const poly of polygonsOf(f.geometry)) {
      units.get(code).push(poly.map((ring) => snapRing(ring.map(([lon, lat]) => laea3035(lon, lat)), GRID)));
    }
  }
  const missing = Object.keys(c.names).filter((k) => !units.has(k));
  if (missing.length) throw new Error(`${c.slug}: régiony bez geometrie: ${missing.join(', ')}`);

  // 2) sloučení jednotek do régionů + rozloha (EPSG:3035 je rovnoplochá)
  const merged = {};
  const areaKm2 = {};
  for (const [code, polys] of units) {
    merged[code] = dissolve(polys);
    areaKm2[code] = Math.round(merged[code].reduce((s, r) => s + signedArea(r), 0) / 1e6);
  }

  // 3) zjednodušení se sdílenými hranicemi
  const simp = simplifyShared(merged, EPS, { minArea: 4e6 /* < 4 km² — drobné ostrůvky */ });

  // 4) sdílená transformace do SVG (y dolů)
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (const rings of Object.values(simp)) for (const r of rings) for (const [x, y] of r) {
    if (x < minX) minX = x; if (x > maxX) maxX = x;
    if (y < minY) minY = y; if (y > maxY) maxY = y;
  }
  const scale = VIEW_W / (maxX - minX);
  const H = Math.round((maxY - minY) * scale);
  const toPx = (rings) => rings.map((r) => r.map(([x, y]) => [(x - minX) * scale, (maxY - y) * scale]));

  const out = {
    _comment: `Hranice ${c.slug} pro choropleth /svet/. Zdroj: Natural Earth ${NE_VERSION} 1:10m Admin 1 (public domain), správní jednotky sloučené do régionů NUTS-${c.level} (2021), EPSG:3035. Build: scripts/build-svet-geo.mjs.`,
    slug: c.slug,
    viewBox: `0 0 ${VIEW_W} ${H}`,
    boundarySource: 'naturalearth',
    regions: Object.keys(c.names)
      .map((code) => ({ code, name: c.names[code], areaKm2: areaKm2[code], path: ringsToPath(toPx(simp[code])) }))
      .sort((a, b) => a.name.localeCompare(b.name)),
  };
  const empty = out.regions.filter((r) => !r.path);
  if (empty.length) throw new Error(`${c.slug}: régiony bez cesty po zjednodušení: ${empty.map((r) => r.code).join(', ')}`);

  const outPath = `src/data/svet/regions/${c.slug}-geo.json`;
  mkdirSync(dirname(outPath), { recursive: true });
  const json = JSON.stringify(out);
  writeFileSync(outPath, json + '\n');
  console.log(`${c.slug}: ${out.regions.length} régionů → ${outPath} (${(json.length / 1024).toFixed(0)} kB), viewBox ${out.viewBox}`);
}
