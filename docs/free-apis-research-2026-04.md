# Free veřejně dostupné API pro agro-svet.cz — research

Sestavil: deep research pro budoucí integrace na agro-svet.cz
Datum: duben 2026
Metoda: WebSearch napříč CZ/EU/world zdroji, ověřeno proti aktuálním dokumentacím
Existující integrace: ČSÚ DataStat (`src/lib/czso.ts`) — ceny komodit, paliv, hnojiv, sklizeň, stavy zvířat, regionální data

---

## TL;DR — TOP 10 doporučení (podle relevance)

| # | API | Co přidá | Free? | Use case |
|---|-----|----------|-------|----------|
| 1 | **ČSÚ DataStat — další tabulky** | rozšíření existující integrace o úrodu/výnosy z hektaru, mléčnost, drůbež | Free, no auth | `/statistiky/` rozšíření |
| 2 | **Open-Meteo Forecast + Historical** | aktuální + historické počasí pro 14 krajů ČR, srážky, sucho, soil moisture | Free, no key | `/pocasi/`, dashboard "Počasí dnes" |
| 3 | **DG AGRI Agri-food Data Portal** | EU ceny mléka/obilí/masa per členský stát, srovnání ČR vs. EU | Free, no auth, REST/JSON | `/statistiky/eu-srovnani/` |
| 4 | **ČHMÚ OpenData** | české hydro/meteo data, srážky, vodní stav, fenologie | Free, no auth, JSON/CSV | regionální "Sucho v ČR" mapa |
| 5 | **Eurostat REST/JSON-stat** | dlouhodobé EU řady (apro_cpsh, apro_mt, ef_kvaareg) | Free, no key | long-term trendy, srovnání |
| 6 | **NASA POWER (agroclimatology)** | globální solar/teploty/srážky/ET pro libovolný bod, 1981→ | Free, no auth | "Klima vašeho pole" widget |
| 7 | **Wikidata SPARQL** | metadata o plemenech (Limousine, Holštýn, Kladrubák atd.), strojích, značkách | Free, no auth | obohacení `/plemena/`, `/znacky/`, `/stroje/` |
| 8 | **VÚMOP WMS/WFS (SOWAC-GIS)** | eroze, BPEJ, KPP, půdní mapy jako WMS dlaždice | Free, no auth | mapové overlay v `/puda/` |
| 9 | **eAGRI veřejný LPIS export** | DPB shapefile celé ČR týdenně, ekologické farmy | Free, no auth, SHP | "kde jsou eko farmy" mapa |
| 10 | **FAOSTAT** | světové stavy zvířat, sklizně, srovnání ČR ve světě | Free, JWT (60 min) | dlouhodobé světové trendy |

---

## 1. Česká republika — primární zdroje

### 1.1 ČSÚ DataStat (rozšíření současné integrace)

- **URL**: `https://data.csu.gov.cz/api/dotaz/v1/data/vybery/{KOD}?format=CSV`
- **Docs**: <https://csu.gov.cz/zakladni-informace-pro-pouziti-api-datastatu>
- **Auth**: žádná
- **Formáty**: CSV, JSON-stat, XLSX, HTML
- **Update**: měsíční až roční (dle datasetu)
- **CZ jazyk**: ano, parametr `&jazyk=cs` (default)

**Aktuálně používané kódy** (v `src/lib/czso.ts`):
- `CEN0203BT02` — ceny zemědělských výrobců (komodity, měsíčně)
- `CENPHMTT01` — ceny PHM (týdně)
- `WZEM02AT01` — stavy hospodářských zvířat (skot, prasata)
- `WZEM03AT01` — sklizeň plodin (regionální)
- `ZEM03CT01` — osevní plochy
- `CEN0203ET03` — ceny průmyslových hnojiv (ročně)

**Doporučené další kódy k probádání**:
- `ZEM01` — výnosy z hektaru (t/ha) podle plodiny
- `WZEM01` — drůbež a vejce (chybí ve stávajícím dashboardu)
- `ZEM07` — produkce mléka, mléčnost
- `CRU01` — investice v zemědělství
- `PRA01` — pracovní síla v zemědělství
- `CEN0204` — spotřebitelské ceny potravin (link mezi farmou a obchodem)

**Use case**: `/statistiky/` další karty, `/statistiky/mleko/`, `/statistiky/drubez/` nové podstránky.

**Quick win**: Stejný `fetchSelection()` helper, jen přidat nové konstanty + parsing.

---

### 1.2 ČHMÚ OpenData

- **URL**: `https://opendata.chmi.cz/`
- **Auth**: žádná
- **Formáty**: JSON (current), CSV (historical), ZIP archivy
- **Update**: real-time pro aktuální stanice (10 min), denně pro recent, ročně pro historical
- **CZ jazyk**: data ano, struktura adresářů anglicky

**Klíčové cesty**:
- `/meteorology/climate/now/data/` — aktuální stav meteostanic, JSON
- `/meteorology/climate/recent/data/` — denní/hodinová data poslední rok+
- `/meteorology/climate/historical/data/` — celá historie 10-min/hod/den/měs
- `/hydrology/now/data/` — vodní stavy, průtoky JSON per stanice
- `/meteorology/phenology/` — fenologická pozorování (kvetení, sklizeň)
- `/meteorology/floods/` — povodňové reporty
- `/air_quality/` — kvalita ovzduší CSV

**Komplikace**: Není to klasické API ale file directory listing — je třeba parser HTML indexu a jednou za den fetch JSON souborů. Filenames následují konvenci `{stationId}_{period}.json`.

**Use case**:
- `/pocasi/` nová sekce s aktuálními teplotami a srážkami v krajích
- `/sucho/` mapa s aktuálním stavem půdní vlhkosti
- Fenologická data → "kdy se kde sklízí" widget

---

### 1.3 eAGRI veřejný LPIS

- **URL**: `https://mze.gov.cz/public/portal/mze/farmar/LPIS/uzivatelske-prirucky/prirucky-pro-verejny-lpis/export-dat-lpis`
- **Veřejná aplikace**: <https://mze.gov.cz/public/app/lpisext/lpis/verejny2/plpis/>
- **Auth**: pro export žádná, pro detail farmáře e-identita
- **Formáty**: SHP (shapefile), generováno týdně
- **Také WMS/WFS**: ano, pro overlay v mapě

**Co obsahuje**:
- DPB (díly půdních bloků) — geometry + plocha + kultura + ekologie flag
- Celá ČR, ~1,5M DPB
- Eko farmy (filter)

**Use case**:
- Mapa "kde jsou eko farmy v ČR" v sekci `/eko-farmy/`
- Statistika "kolik ha eko v okrese X"
- Overlay LPIS na ortofoto v `/puda/`

**Komplikace**: SHP nelze přímo do prohlížeče → musí se konvertovat na GeoJSON (mapshaper, ogr2ogr) na build time, případně Mapbox vector tiles.

---

### 1.4 ČÚZK Geoportal (ortofoto + katastr)

- **REST endpoint (ortofoto)**: `https://ags.cuzk.gov.cz/arcgis1/rest/services/ORTOFOTO/MapServer`
- **WMS katastr**: `http://services.cuzk.cz/wms/local-km-wms.asp`
- **Open Data**: <https://ags.cuzk.gov.cz/opendata/>
- **Auth**: žádná
- **Licence**: CC BY 4.0
- **Formáty**: WMS (PNG dlaždice), WMTS, REST, SHP/GeoPackage downloads
- **Souřadnicový systém**: S-JTSK Krovak East North (EPSG:5514) i Web Mercator

**Use case**:
- Background ortofoto pro `/puda/` map widget
- Katastrální překryv pro "kde je můj pozemek" nástroj
- Static export tilek do CDN (zlevnění hostingu, žádný traffic na ČÚZK)

**Quick win**: Dlaždice přímo do Leaflet/MapLibre přes XYZ template — ~10 řádků kódu.

---

### 1.5 VÚMOP — SOWAC-GIS / Monitoring eroze

- **Geoportál**: <https://geoportal.vumop.cz/>
- **Monitoring eroze**: <https://me.vumop.cz/>
- **Půda v mapách**: <https://mapy.vumop.cz/>
- **Auth**: žádná pro WMS, kontakt `data@vumop.cz` pro batch download
- **Formáty**: WMS (JPEG/PNG/GIF), souřadnice S-JTSK / WGS-84

**Klíčové vrstvy**:
- Vodní eroze (G — průměrná dlouhodobá ztráta půdy)
- Větrná eroze
- BPEJ (bonitované půdně-ekologické jednotky) — kvalita půdy 5-cifernou kódem
- KPP (Komplexní průzkum půd) — půdní typ, hloubka, zrnitost

**Use case**:
- `/puda/eroze/` mapa "ohrožení erozí v okrese"
- BPEJ kalkulačka pro stránky o ceně půdy
- Půdní typ widget per kraj

---

### 1.6 INTERSUCHO (CzechGlobe)

- **URL**: <https://www.intersucho.cz/>
- **Auth**: web zdarma, pro raw data kontakt
- **Update**: denně (mapa), týdně (komplet vegetační indexy)
- **Resolution**: 0,25 km² (500x500 m)

**Co poskytuje**:
- Půdní vlhkost (model SoilClim, povrchová + profil 0-100 cm)
- Aktuální stupeň sucha 0-5
- Vegetační indexy (NDVI, VHI ze satelitů)
- Weekly expert reporty

**Komplikace**: Veřejné API neoznámeno, primárně web mapa. Pro integraci by bylo třeba kontaktovat tým CzechGlobe (Brno).

**Use case**: Widget "Aktuální sucho v ČR" na home + `/pocasi/sucho/`.

---

### 1.7 data.gov.cz / NKOD

- **URL**: <https://data.gov.cz/datasets>
- **SPARQL endpoint**: <https://data.gov.cz/ldf/nkod-sparql-ldf>
- **Auth**: žádná
- **Formáty**: DCAT-AP (RDF), per-dataset různé (CSV, JSON, SHP)

**Co najdete**:
- 281 datasetů v tématu "Zemědělství, rybolov, lesnictví a potravinářství"
- 211 z toho publikuje MZe
- Katalog katalogu — odkaz na původní zdroj

**Use case**: Sekundární zdroj — najít "co všechno o tom existuje" pro nové podstránky.

---

### 1.8 ÚKZÚZ, ČMSCH, SZIF — bohužel limitované

**ÚKZÚZ** (registr odrůd, hnojiva): API neexistuje veřejně, registry jen jako web search formuláře. Možno scrapovat HTML, ale bez záruky stability.

**ČMSCH** (plemenná kniha, kontroly užitkovosti): Data placená pro chovatele, veřejně jen ročenky v PDF. Pro `/plemena/` lépe Wikidata + ručně psané profily.

**SZIF** (dotace): Veřejný seznam příjemců dotací existuje (povinnost EU), ale není to API — jen web search a CSV exporty per rok. URL: `szif.cz` → "Příjemci dotací". Možno integrovat jako roční static dataset.

---

### 1.9 Burza Brno (komodity)

**URL**: <https://www.bcpb.cz/> — komoditní burza nemá veřejné API. Týdenní zpravodaje v PDF, lze parser, ale nestabilní.

**Alternativa**: ČSÚ `CEN0203BT02` (už integrováno) je oficiálnější.

---

## 2. EU zdroje

### 2.1 DG AGRI Agri-food Data Portal (TOP doporučení)

- **URL docs**: <https://agridata.ec.europa.eu/extensions/API_Documentation/API-Guide.html>
- **Per-sektor docs**:
  - Cereals: <https://agridata.ec.europa.eu/extensions/API_Documentation/cereals.html>
  - Beef: <https://agridata.ec.europa.eu/extensions/API_Documentation/Beef.html>
  - Milk: <https://agridata.ec.europa.eu/extensions/API_Documentation/milk.html>
  - Organic: <https://agridata.ec.europa.eu/extensions/API_Documentation/organic.html>
- **Auth**: žádná (otevřené REST), bez API key
- **Formát**: JSON, REST
- **Update**: týdenní (prices), měsíční (production)
- **CZ jazyk**: data anglicky, ale `memberStateCode=CZ` filter

**Příklad request** (cereal prices za ČR):
```
GET https://agridata.ec.europa.eu/api/cereal/prices?memberStateCodes=CZ&years=2025/2026
```

**Use case**:
- `/statistiky/eu-srovnani/` — ČR vs. PL/DE/FR ceny za stejnou komoditu
- Týdenní automatický refresh do Astro static build
- Karta "Mléko v EU" — průměrná cena EU vs. ČR

**Quick win**: Velmi snadné, JSON, no auth, dobře dokumentováno.

---

### 2.2 Eurostat REST/JSON-stat

- **URL**: `https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/{DATASET_CODE}`
- **Docs**: <https://ec.europa.eu/eurostat/web/user-guides/data-browser/api-data-access/api-getting-started/api>
- **Auth**: žádná
- **Formát**: JSON-stat (lightweight statistical JSON)
- **Update**: měsíční až roční

**Klíčové datasety pro zemědělství**:
- `apro_cpsh1` — sklizeň hlavních plodin per stát/rok
- `apro_mt_lscatl` — stavy skotu
- `apro_mt_pheggm` — produkce vajec
- `apro_mk_farm` — produkce mléka
- `ef_kvaareg` — agricultural holdings (kdo, kolik ha)
- `tag00099` — utilised agricultural area
- `aei_ps_inp` — input use indicator

**Příklad request**:
```
GET https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/apro_cpsh1?lang=EN&geo=CZ&time=2024
```

**Use case**:
- Long-term trendy (1990-2025) pro `/statistiky/historie/`
- Srovnání struktura českého zemědělství vs. EU27
- Datasety se hodí pro všechny existujicí statistické stránky

---

### 2.3 EU Open Data Portal

- **URL**: <https://data.europa.eu/>
- Spíš katalog než API, ale obsahuje DCAT-AP a SPARQL endpoint
- **Use case**: meta-discovery, najít CAP datasety

---

## 3. Mezinárodní

### 3.1 Open-Meteo (TOP doporučení)

- **URL**: `https://api.open-meteo.com/v1/forecast`
- **Historical**: `https://archive-api.open-meteo.com/v1/archive`
- **Climate**: `https://climate-api.open-meteo.com/v1/climate`
- **Docs**: <https://open-meteo.com/en/docs>
- **Auth**: žádná, no API key, no registration
- **Limit**: 10 000 requests/day per IP (free non-commercial)
- **Pro komerční použití**: placený plán nutný (agro-svet.cz může být na hraně, viz licence)
- **Formát**: JSON, CSV
- **Update**: hourly forecasts, denně historical
- **CZ jazyk**: pouze data values (žádné názvy)

**Příklad request**:
```
GET https://api.open-meteo.com/v1/forecast
  ?latitude=49.74&longitude=15.34
  &hourly=temperature_2m,precipitation,soil_moisture_0_to_1cm,et0_fao_evapotranspiration
  &daily=precipitation_sum,temperature_2m_max,temperature_2m_min
  &timezone=Europe/Prague
```

**Agri-relevantní parametry**:
- `soil_moisture_0_to_1cm`, `_1_to_3cm`, `_3_to_9cm`, `_9_to_27cm`, `_27_to_81cm`
- `soil_temperature_0cm`, `_6cm`, `_18cm`, `_54cm`
- `et0_fao_evapotranspiration` (referenční evapotranspirace)
- `vapour_pressure_deficit`
- `shortwave_radiation` (pro fotosyntézu)

**Use case**:
- Aktuální počasí widget v 14 krajských městech (Praha + 13 krajů)
- Historical chart "léta 2020 vs. 2025" pro `/statistiky/sucho/`
- Klimatická projekce 2025-2050 pro `/klimaticka-zmena/`

**Quick win**: 1 endpoint, JSON, žádná auth — 30 minut hotové.

**Pozor**: licence "free non-commercial". Pro web se zobrazovanou reklamou doporučuju attribuci a kontaktovat tvůrce kvůli "fair use" — open-meteo.com je velkorysé.

---

### 3.2 NASA POWER (agroclimatology)

- **URL**: `https://power.larc.nasa.gov/api/temporal/daily/point`
- **Docs**: <https://power.larc.nasa.gov/docs/services/api/temporal/daily/>
- **Auth**: žádná
- **Limit**: žádný explicitní (rate limit přes IP, fair use)
- **Formát**: JSON, CSV, ASCII
- **Resolution**: 0,5° × 0,625° meteo, 1°×1° solar
- **Coverage**: globální, 1981→ daily

**Příklad request** (Plzeň, agro params):
```
GET https://power.larc.nasa.gov/api/temporal/daily/point
  ?community=AG
  &parameters=T2M,T2M_MAX,T2M_MIN,PRECTOTCORR,RH2M,ALLSKY_SFC_SW_DWN
  &latitude=49.74&longitude=13.37
  &start=20250101&end=20251231
  &format=JSON
```

**AG community parametry** (specifické pro zemědělství):
- `T2M`, `T2M_MAX`, `T2M_MIN` — teplota
- `PRECTOTCORR` — korigované srážky
- `RH2M` — relativní vlhkost
- `ALLSKY_SFC_SW_DWN` — sluneční záření
- `WS2M` — vítr 2 m
- `GWETROOT`, `GWETPROF` — vlhkost půdy v root zone / profil
- `EVPTRNS` — evapotranspirace
- `T2MDEW` — rosný bod

**Use case**:
- "Klima vašeho pole" — input GPS, output 30-letý průměr + trend
- Long-term roční srážky/teploty per okres
- Solar radiation pro `/fotovoltaika-na-pude/` články

---

### 3.3 FAOSTAT

- **URL**: `https://fenixservices.fao.org/faostat/api/v1/`
- **Developer Portal**: <https://www.fao.org/statistics/highlights-archive/highlights-detail/faostat-launches-a-new-api-developer-portal-to-make-data-access-easier/en>
- **Auth**: JWT Bearer token (registrace zdarma, expirace 60 min)
- **Formát**: JSON, CSV
- **Update**: ročně (občas i čtvrtletně)
- **Coverage**: 245 zemí, od 1961

**Klíčové domains**:
- `QCL` — Crops and livestock products (production, area, yield)
- `PP` — Producer prices
- `RL` — Land use
- `RT` — Trade
- `EI` — Environmental indicators
- `GLW` — Livestock patterns

**Use case**:
- "ČR ve světě" karty — "8. největší producent X v EU"
- Long-term trendy 1961-2024 pro evergreen články
- Srovnání ČR vs. globální průměr

**Komplikace**: JWT refresh každou hodinu. Pro Astro static site: použít při buildu, ne za runtime.

---

### 3.4 World Bank Open Data

- **URL**: `https://api.worldbank.org/v2/`
- **Auth**: žádná
- **Formát**: JSON, XML
- **Use case**: Spíš makro indikátory (HDP zemědělství, zaměstnanost), méně relevantní pro magazín. Druhořadý zdroj.

---

### 3.5 OECD agri stats

- **URL**: `https://sdmx.oecd.org/public/rest/data/`
- **Auth**: žádná (SDMX REST)
- **Formát**: SDMX-JSON, CSV
- **Use case**: PSE/CSE indicators (podpora zemědělství), srovnání politik OECD zemí.

---

### 3.6 Wikidata SPARQL

- **URL**: `https://query.wikidata.org/sparql`
- **Auth**: žádná
- **Formát**: JSON (s headerem `Accept: application/sparql-results+json`)
- **Update**: kontinuální (community)
- **Limit**: 60 sec query timeout, fair use

**Příklad — všechna plemena hovězího skotu s českým labelem**:
```sparql
SELECT ?breed ?breedLabel ?image ?origin ?originLabel
WHERE {
  ?breed wdt:P31/wdt:P279* wd:Q4734646 .  # subclass of cattle breed
  OPTIONAL { ?breed wdt:P18 ?image }
  OPTIONAL { ?breed wdt:P495 ?origin }    # country of origin
  SERVICE wikibase:label { bd:serviceParam wikibase:language "cs,en" }
}
```

**Use case**:
- Obohacení `/plemena/` — fotka z Wiki Commons, rok vyšlechtění, země původu
- `/znacky/{brand}/` — historie firmy, sídlo, počet zaměstnanců
- `/stroje/` — links na specifikace strojů na Wikidata

**Quick win**: Pro CMS-like obohacení článků skvělé, query → JSON → mapping → JSX.

---

### 3.7 OpenWeatherMap (free tier)

- **Free**: 1 000 calls/day, current weather + 5-day forecast
- **API key**: ano (registrace)
- **Komentář**: Open-Meteo je lepší (no key, vyšší limit, agri-specific params). OWM doporučuji jen jako fallback.

---

### 3.8 Sentinel Hub (Copernicus Data Space)

- **URL**: <https://dataspace.copernicus.eu/analyse/apis/sentinel-hub>
- **Auth**: OAuth2, registrace zdarma
- **Free tier**: měsíční processing units quota (resetuje se 1. v měsíci), rate limit
- **Formát**: PNG/JPEG/TIFF (rendered), GeoJSON metadata

**Co poskytuje**:
- Sentinel-2 (10 m optical, ~5 dní revisit)
- Sentinel-1 (SAR radar)
- NDVI, EVI, custom evalscripts

**Use case**:
- Evergreen článek "Pole ČR z vesmíru" s aktuálním NDVI
- Detekce sklizňových oken (kdy se sklízí v okrese X)
- Ne pro per-page widget (drahé na PU), spíš pro one-off vizualizace

**Komplikace**: OAuth2 + processing units → není trivial. Pro Astro static site fetch při buildu, výsledek do `/public/`.

---

### 3.9 USDA NASS Quick Stats

- **URL**: `https://quickstats.nass.usda.gov/api`
- **Auth**: API key (zdarma)
- **Use case**: USA statistiky — pro srovnání "ČR vs. USA" v article stylu, ale ne primárně.

---

## 4. Specializované — méně priority

### 4.1 Pozemkovy.cz / FARMY.CZ Index

- **URL**: <https://www.farmy.cz/>
- **API**: žádné veřejné, ale zveřejňují **FARMY.CZ Index** ceny půdy ročně
- **Use case**: Manuálně copy-paste 1× ročně, už je v `puda-research-2026-04.md`

### 4.2 AgroBourse / Agroportal komoditní ceny

Žádný veřejný free API. Konkurenční zdroje, lépe spoléhat na ČSÚ + DG AGRI.

### 4.3 Reality kurzy ceny půdy

Bez API, jen web. Komerční datasety placené.

### 4.4 ČAZV (Česká akademie zemědělských věd)

Publikace v PDF, žádné API.

---

## 5. Co neexistuje / placené (chybí v ekosystému)

| Co bych chtěl | Status | Náhrada |
|---|---|---|
| API plemenných knih CMSCH per zvíře | Placené pro chovatele, ne veřejné | Wikidata + ručně |
| API SZIF výpis dotací real-time | Jen web search + roční CSV | Roční static dataset |
| API trh s pozemky (FARMY.CZ) | Žádné | Manual update 1×/rok |
| API ÚKZÚZ registr odrůd | Žádné, jen web | Scrape pomalu, nestabilní |
| API komoditní burza Brno | Žádné, jen PDF týdně | ČSÚ ceny |
| Real-time satellite NDVI ČR | Sentinel Hub, ale platit | Manual once-a-month |
| API cen agro služeb (orba, žně) | Neexistuje | Krajské zem. agentury (manual) |
| API počty traktorů registrovaných | ČR neevidovala public | Importy přes ČSÚ zahraniční obchod |

---

## 6. Quick wins — APIs integrovatelné za 30 min

### 6.1 Open-Meteo current weather widget (15 min)

```ts
// src/lib/weather.ts
const KRAJSKA_MESTA = [
  { name: 'Praha', lat: 50.08, lon: 14.43 },
  { name: 'Brno', lat: 49.20, lon: 16.61 },
  // ...14 krajů
];

export async function getCurrentWeather() {
  const url = new URL('https://api.open-meteo.com/v1/forecast');
  // batch request s arrays
  url.searchParams.set('latitude', KRAJSKA_MESTA.map(k => k.lat).join(','));
  url.searchParams.set('longitude', KRAJSKA_MESTA.map(k => k.lon).join(','));
  url.searchParams.set('current', 'temperature_2m,precipitation,relative_humidity_2m');
  url.searchParams.set('timezone', 'Europe/Prague');
  const res = await fetch(url);
  return res.json();
}
```

Komponenta `<KrajePocasi/>` na home.

---

### 6.2 DG AGRI ceny mléka EU vs. ČR (20 min)

```ts
const url = 'https://agridata.ec.europa.eu/api/milk/rawMilkPrices?memberStateCodes=CZ,DE,PL,AT,FR';
const data = await fetch(url).then(r => r.json());
// → karta na /statistiky/komodity/mleko/
```

---

### 6.3 ČSÚ — drůbež a vejce karta (30 min)

Stejný `fetchSelection()` z `czso.ts`, jen nový kód `WZEM01AT01` (pokud existuje, jinak hledat v <https://data.csu.gov.cz/>) + parsing skopírovat z `getLivestockStats()`.

---

### 6.4 ČHMÚ aktuální srážky JSON (30 min)

Fetch `https://opendata.chmi.cz/meteorology/climate/now/data/`, parse HTML index, vyfiltrovat 14 krajských stanic, fetch JSON, agregovat → karta "Srážky tento týden v krajích".

---

### 6.5 Wikidata enrichment plemen (20 min per plemeno)

V `src/content/plemena/{slug}.md` doplnit Wikidata ID v frontmatteru, build-time SPARQL fetch fotky/země původu/roku → static obohacení.

---

## 7. Implementační doporučení

### 7.1 Cache strategy

Web Astro je static, build na Cloudflare. Pro APIs:
- **Build-time fetch** (preferováno): ČSÚ, DG AGRI, Eurostat, FAOSTAT, NASA POWER (long historical)
  - Hotov v `astro.config.mjs` getStaticPaths/Astro.props
  - Failover: cached JSON v `/data/` adresáři checked do gitu
- **Edge runtime fetch** (jen pokud reálně realtime): Open-Meteo current weather, ČHMÚ srážky
  - Cloudflare Workers s 10 min TTL
- **Nikdy client-side**: kvůli rate limits a CORS

### 7.2 Fallback pattern

Existující `czso.ts` nemá fallback. Doporučuju:

```ts
async function fetchWithFallback<T>(
  url: string,
  fallbackPath: string,
): Promise<T> {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`${res.status}`);
    return await res.json();
  } catch (e) {
    // Build-time: try cached file
    const fs = await import('node:fs/promises');
    const cached = await fs.readFile(fallbackPath, 'utf-8');
    return JSON.parse(cached);
  }
}
```

Tím se vyřeší známý problém `/statistiky/` blokuje `npm run build` (CZSO timeout) zmíněný v memory.

### 7.3 Atribuce

Většina těchto API vyžaduje attribuci. Doporučuju jednu sekci `/zdroje-dat/` (footer link) s výpisem všech zdrojů + licencí.

---

## 8. Priorita pro implementaci (subjektivní)

| Priorita | API | Ratio (use case × snadnost / cena) |
|---|---|---|
| P0 | Open-Meteo počasí widget | 30 min, vysoký engagement |
| P0 | DG AGRI EU srovnání | 1 h, unique content |
| P1 | ČSÚ rozšíření (drůbež, mléko, výnosy) | 2-3 h, completes statistiky |
| P1 | Wikidata plemena | 1 h per plemeno enrich |
| P2 | ČHMÚ srážky/sucho | 4 h (parsing) |
| P2 | NASA POWER long-term | 3 h, evergreen content |
| P2 | Eurostat long-term trendy | 4 h |
| P3 | LPIS eko mapa | 1 den (SHP→GeoJSON) |
| P3 | VÚMOP eroze WMS | 4 h (MapLibre setup) |
| P3 | ČÚZK ortofoto background | 2 h |
| P4 | FAOSTAT JWT integrace | 4 h |
| P4 | Sentinel Hub satelit | 1+ den |

---

## Sources

### CZ
- [ČSÚ DataStat API docs](https://csu.gov.cz/zakladni-informace-pro-pouziti-api-datastatu)
- [ČSÚ otevřená data](https://csu.gov.cz/otevrena_data)
- [data.gov.cz NKOD](https://data.gov.cz/datasets)
- [opendata.chmi.cz](https://opendata.chmi.cz/)
- [open-data-chmi.hub.arcgis.com](https://open-data-chmi.hub.arcgis.com/)
- [eAGRI veřejný LPIS](https://mze.gov.cz/public/portal/mze/farmar/LPIS/uzivatelske-prirucky/prirucky-pro-verejny-lpis/export-dat-lpis)
- [ČÚZK Open Data](https://ags.cuzk.gov.cz/opendata/)
- [VÚMOP geoportál](https://geoportal.vumop.cz/)
- [VÚMOP monitoring eroze](https://me.vumop.cz/)
- [INTERSUCHO](https://www.intersucho.cz/)

### EU
- [DG AGRI API Guide](https://agridata.ec.europa.eu/extensions/API_Documentation/API-Guide.html)
- [DG AGRI Cereals API](https://agridata.ec.europa.eu/extensions/API_Documentation/cereals.html)
- [DG AGRI Beef API](https://agridata.ec.europa.eu/extensions/API_Documentation/Beef.html)
- [DG AGRI Milk API](https://agridata.ec.europa.eu/extensions/API_Documentation/milk.html)
- [Eurostat API getting started](https://ec.europa.eu/eurostat/web/user-guides/data-browser/api-data-access/api-getting-started/api)

### World
- [Open-Meteo docs](https://open-meteo.com/en/docs)
- [Open-Meteo Historical](https://open-meteo.com/en/docs/historical-weather-api)
- [NASA POWER API](https://power.larc.nasa.gov/docs/services/api/)
- [NASA POWER Daily](https://power.larc.nasa.gov/docs/services/api/temporal/daily/)
- [FAOSTAT API portal](https://www.fao.org/statistics/highlights-archive/highlights-detail/faostat-launches-a-new-api-developer-portal-to-make-data-access-easier/en)
- [Wikidata SPARQL](https://query.wikidata.org/)
- [Sentinel Hub on CDSE](https://dataspace.copernicus.eu/analyse/apis/sentinel-hub)
- [Copernicus Quotas](https://documentation.dataspace.copernicus.eu/Quotas.html)
