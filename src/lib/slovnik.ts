// Slovník zemědělských a technických pojmů — stub stránky pro AI Overviews
// a long-tail SEO ("co je AdBlue", "co znamená CVT", "jak funguje ISOBUS").
//
// Každý termín má:
// - slug (URL)
// - název + zkratka
// - krátká definice (1 věta)
// - rozšířený výklad (3-5 odstavců)
// - kategorie (technologie / pohon / hnojivo / dotace / agrotechnika / regulace)
// - související termíny (interní linking)
// - related URL (na encyklopedie / dotace / žebříčky)

export type SlovnikKategorie =
  | 'technologie' | 'pohon' | 'hnojivo' | 'dotace' | 'agrotechnika' | 'regulace' | 'precise-farming';

export interface SlovnikTerm {
  slug: string;
  term: string;
  /** Krátké zkrácení / alternativní pojmenování. */
  alias?: string[];
  kategorie: SlovnikKategorie;
  /** 1 věta — ideální pro AI Overviews. */
  shortDef: string;
  /** Plný výklad (markdown allowed v UI; tady jako paragrafy oddělené \n\n). */
  longDef: string;
  /** Související termíny (slug). UI rendrene jako odkazy. */
  related?: string[];
  /** Externí URL pro hlubší vysvětlení (Wikipedia, vendor docs). */
  externalUrl?: string;
  externalLabel?: string;
}

export const SLOVNIK: SlovnikTerm[] = [
  // ── POHON / MOTOR / EMISE ───────────────────────────────────────────
  {
    slug: 'adblue',
    term: 'AdBlue',
    alias: ['DEF', 'močovinová kapalina', 'Diesel Exhaust Fluid'],
    kategorie: 'pohon',
    shortDef: 'AdBlue je 32,5% vodný roztok močoviny, který se vstřikuje do výfuku dieselových motorů, kde redukuje oxidy dusíku (NOx) na neškodný dusík a vodu.',
    longDef: `AdBlue je obchodní název pro vodný roztok močoviny (CO(NH₂)₂) v koncentraci 32,5 %. Používá se v systémech selektivní katalytické redukce (SCR) u dieselových motorů — vstřikuje se před SCR katalyzátor, kde reaguje s oxidy dusíku z výfukových plynů.

Bez funkčního AdBlue moderní traktor (od emisní normy Stage IV / Tier 4 Final) sníží výkon nebo zcela vypne — řídicí jednotka detekuje nízkou hladinu nebo nekvalitní AdBlue a aktivuje tzv. "limp mode".

Spotřeba AdBlue je typicky 3–5 % objemu nafty (na 100 l nafty cca 3–5 l AdBlue). Cena se pohybuje kolem 15–25 Kč/l v IBC kontejnerech (1000 l), v 10litrových kanystrech až 40 Kč/l.

Pozor na kvalitu — kontaminované AdBlue (prach, organické nečistoty) zničí drahý SCR katalyzátor (oprava 100 000+ Kč). Norma ISO 22241 specifikuje čistotu — kupujte vždy s certifikátem.`,
    related: ['scr-katalyzator', 'emisni-normy-stage', 'dpf'],
    externalUrl: 'https://cs.wikipedia.org/wiki/AdBlue',
    externalLabel: 'Wikipedia: AdBlue',
  },
  {
    slug: 'dpf',
    term: 'DPF',
    alias: ['Diesel Particulate Filter', 'filtr pevných částic'],
    kategorie: 'pohon',
    shortDef: 'DPF (Diesel Particulate Filter) je filtr pevných částic ve výfuku dieselových motorů, který zachycuje saze a periodicky je vypaluje při tzv. regeneraci.',
    longDef: `DPF je porézní keramický filtr (typicky cordierit nebo karbid křemíku) instalovaný za turbodmychadlem. Zachycuje pevné částice (PM, saze) z výfukových plynů — bez něj by moderní diesel nesplnil emisní limity Stage IV / Stage V.

Filtr se postupně zanáší a musí se "regenerovat" — vypálit sazi na CO₂. Existují tři způsoby:
1. **Pasivní regenerace** — při vysoké teplotě výfuku (>600 °C, např. při plném tahu), saze se vypálí samy.
2. **Aktivní regenerace** — řídicí jednotka vstřikne malé množství nafty pro zvýšení teploty výfuku (běží automaticky na pozadí).
3. **Servisní regenerace** — pokud první dvě selžou (krátké jízdy, nízká zátěž), nutná návštěva servisu.

U traktorů je třetí scénář vzácný — traktor obvykle pracuje pod zátěží dlouhé hodiny. Problémy nastávají hlavně u traktorů na drobné komunální práce (krátké rozjezdy, nízká teplota).

Životnost DPF: 8 000–15 000 motohodin podle značky a údržby. Výměna stojí 80 000–200 000 Kč. Nedoporučujeme demontáž (DPF delete) — nelegální, znehodnocuje stroj při prodeji a hrozí pokuta při kontrole.`,
    related: ['adblue', 'scr-katalyzator', 'emisni-normy-stage'],
    externalUrl: 'https://cs.wikipedia.org/wiki/Filtr_pevn%C3%BDch_%C4%8D%C3%A1stic',
  },
  {
    slug: 'scr-katalyzator',
    term: 'SCR katalyzátor',
    alias: ['Selective Catalytic Reduction', 'selektivní katalytická redukce'],
    kategorie: 'pohon',
    shortDef: 'SCR je systém pro redukci oxidů dusíku (NOx) ve výfukových plynech dieselových motorů pomocí vstřiku AdBlue do speciálního katalyzátoru.',
    longDef: `Selektivní katalytická redukce (SCR) je technologie čištění výfukových plynů, která redukuje NOx (oxidy dusíku) na neškodný dusík (N₂) a vodu (H₂O). Princip:

1. AdBlue (32,5% močovina) se vstřikne před SCR katalyzátor.
2. Vysoká teplota výfuku rozkládá močovinu na amoniak (NH₃).
3. NH₃ reaguje v katalyzátoru s NOx za přítomnosti drahých kovů (vanad, wolfram) — vznikne N₂ a H₂O.

SCR je dominantní technologie pro emisní normy Stage IV (od 2014) a Stage V (od 2020) u zemědělských traktorů. Alternativa byla EGR (recirkulace výfukových plynů) + DPF, ale ta vede k vyšší spotřebě nafty (proto výrobci typu Fendt, JD, NH zvolili SCR jako primární cestu).

Životnost SCR katalyzátoru je 8 000–15 000 motohodin. Výměna 100 000–250 000 Kč. Hlavní riziko: kontaminace AdBlue (nečistoty, nesprávná koncentrace) → zničení v desítkách hodin.`,
    related: ['adblue', 'dpf', 'emisni-normy-stage'],
  },
  {
    slug: 'emisni-normy-stage',
    term: 'Emisní normy Stage / Tier',
    alias: ['Stage I', 'Stage V', 'Tier 4 Final'],
    kategorie: 'regulace',
    shortDef: 'Stage (EU) a Tier (USA) jsou postupně přitvrzované emisní normy pro vznětové motory mimosilničních strojů — od Stage I (1999) po současnou Stage V (2020).',
    longDef: `Emisní normy pro mimosilniční dieselové motory (NRMM — Non-Road Mobile Machinery) se v EU označují jako Stage, v USA jako Tier. Norma reguluje limity emisí pevných částic (PM), oxidů dusíku (NOx), uhlovodíků (HC) a oxidu uhelnatého (CO).

Hlavní milníky pro traktory v EU:
- **Stage I** (1999–2001): základní limity, bez DPF a SCR.
- **Stage II** (2001–2006): mírné snížení NOx + PM.
- **Stage IIIA** (2006–2011): další snížení, motor s EGR.
- **Stage IIIB** (2011–2014): povinný DPF.
- **Stage IV** (2014–2019): povinný SCR (AdBlue).
- **Stage V** (od 2020): nejpřísnější, povinný DPF + SCR + filtr pro PM nano.

Pro nákup ojetých strojů: model před Stage IIIB (do 2011) typicky bez DPF — nižší údržbové riziko, vyšší spotřeba a emise. Model Stage V (2020+) má nejpřísnější emise, ale složitý výfukový systém s drahou údržbou.

USA Tier paralelní: Tier 1 ≈ Stage I, ..., Tier 4 Final ≈ Stage IV. Stage V není v USA — americké normy zůstaly na Tier 4 Final.`,
    related: ['adblue', 'dpf', 'scr-katalyzator'],
  },
  {
    slug: 'common-rail',
    term: 'Common Rail',
    alias: ['CRDi', 'vstřikování common rail'],
    kategorie: 'pohon',
    shortDef: 'Common Rail je vstřikovací systém dieselových motorů s vysokotlakou společnou lištou (rail), která dodává palivo do elektronicky ovládaných vstřikovačů.',
    longDef: `Common Rail je revoluční systém vstřikování paliva u dieselových motorů (od konce 90. let). Hlavní princip: vysokotlaké palivo (1500–2500 bar) je trvale v společné liště (rail) a elektronicky ovládané vstřikovače dávkují velmi přesné množství do válce.

Výhody proti starším systémům (PD/Pumpe-Düse, čerpadlo-tryska):
- Až 5–7 vstřiků na jeden zdvih (pilot, hlavní, post-injection) → tišší chod, čistší spalování.
- Vyšší tlak vstřiku → lepší rozprášení paliva → nižší PM emise.
- Elektronické ovládání → snadné ladění map pro různé emisní normy.

Nevýhody:
- Citlivost na kvalitu paliva — voda nebo nečistoty zničí vstřikovače (1 ks 15 000–40 000 Kč).
- Vysoké tlaky → drahá oprava vysokotlakého čerpadla (50 000+ Kč).
- Diagnostika vyžaduje servisní software.

Common Rail je dnes standard u všech moderních traktorů (Stage IV+). Životnost při dobré kvalitě paliva 10 000+ motohodin.`,
    related: ['dpf', 'common-rail-tlak'],
  },

  // ── PRECISION FARMING ───────────────────────────────────────────────
  {
    slug: 'isobus',
    term: 'ISOBUS',
    alias: ['ISO 11783', 'Tractor-Implement Bus'],
    kategorie: 'precise-farming',
    shortDef: 'ISOBUS je standardizovaná komunikační sběrnice mezi traktorem a nářadím (postřikovač, secí stroj, lis), která umožňuje sdílení dat a ovládání z jediného terminálu.',
    longDef: `ISOBUS (ISO 11783) je mezinárodní standard pro komunikaci mezi traktorem, nářadím a terminálem v kabině. Před ISOBUS měl každý výrobce nářadí vlastní proprietární kabel/protokol — secí stroj John Deere se nedaly přepojit na traktor New Holland bez výměny kompletní elektroniky.

Co umožňuje:
- **UT (Universal Terminal)** — jedno zobrazení v kabině pro všechna ISOBUS nářadí. Připojíte secí stroj Lemken na traktor Fendt a UI se naloguje na Fendt displej.
- **TC-BAS (Task Controller Basic)** — počítání odpracované plochy + spotřeby materiálu.
- **TC-GEO (Task Controller Geo)** — aplikační mapy podle GPS pozice (variable rate).
- **TC-SC (Section Control)** — automatické vypínání sekcí postřikovače/sečky v souvratích a překrytí.
- **TIM (Tractor Implement Management)** — nářadí ovládá traktor (rychlost, zvedání tříbodu) podle aktuální situace.

ISOBUS funkce jsou licencované — výrobce traktoru účtuje za UT, TC-BAS, TC-GEO atd. samostatně (5 000–80 000 Kč za funkci). Před nákupem zkontrolujte AEF Database (https://aef-online.org), zda kombinace traktor + nářadí je certifikovaná.`,
    related: ['gps-rtk', 'auto-steering', 'variable-rate'],
    externalUrl: 'https://www.aef-online.org/',
    externalLabel: 'AEF Database',
  },
  {
    slug: 'gps-rtk',
    term: 'RTK GPS',
    alias: ['RTK', 'Real-Time Kinematic'],
    kategorie: 'precise-farming',
    shortDef: 'RTK je technologie GPS s přesností 2–3 cm pomocí korekčního signálu z referenční stanice. Standard pro autonomní navigaci traktorů.',
    longDef: `RTK (Real-Time Kinematic) je GPS technologie s centimetrovou přesností. Běžný GPS přijímač má přesnost 1–5 metrů, EGNOS/SBAS 0,5–1 m. RTK dosahuje 2–3 cm tím, že srovnává GPS signál se signálem z fixní referenční stanice (známá pozice). Korekce se přenáší přes mobilní síť (NTRIP) nebo rádiový spoj.

Pro zemědělství je RTK klíčové pro:
- **Autonomní řízení** (auto-steering) — řádky perfektně paralelní, žádné překrytí ani vynechané pruhy.
- **Variable rate aplikace** — přesné dávkování hnojiv/postřiků podle GPS mapy.
- **Strip-tilling a CTF** (Controlled Traffic Farming) — opakované pojezdy po stejných kolejích pro snížení utužení.

V ČR jsou dostupné komerční RTK sítě: Trimble VRS Now (cca 15 000 Kč/rok), Topcon TopNET Live, John Deere StarFire, CZEPOS (státní, zdarma s registrací). Některé regiony mají vlastní lokální stanice.

Alternativa: vlastní base station (50 000–150 000 Kč jednorázově) — vyplatí se pro velké podniky s několika stroji.`,
    related: ['isobus', 'auto-steering', 'variable-rate'],
    externalUrl: 'https://cs.wikipedia.org/wiki/Real-Time_Kinematic',
  },
  {
    slug: 'auto-steering',
    term: 'Auto-steering',
    alias: ['autonomní řízení', 'auto-pilot', 'AutoTrac', 'IntelliSteer'],
    kategorie: 'precise-farming',
    shortDef: 'Auto-steering je systém autonomního řízení traktoru po naprogramované trajektorii s přesností RTK GPS — řidič nastaví řádky a stroj jede sám.',
    longDef: `Auto-steering (autonomní řízení, brand jména: John Deere AutoTrac, Trimble Autopilot, Case IH IntelliSteer, New Holland IntelliSteer) je systém, kde traktor automaticky drží GPS-naprogramovanou trajektorii bez zásahu řidiče. Řidič dál ovládá pedály, zvedání nářadí a otáčení v souvratích.

Komponenty:
1. **GPS přijímač** s RTK korekcí (centimetrová přesnost).
2. **Terminál** pro plánování řádků (AB lines, křivky, kontur).
3. **Aktuátor řízení** — elektrický motor na sloupku volantu nebo hydraulický ventil v systému řízení.

Hlavní výhody:
- **Eliminace překrytí** — pásy postřikovače / sečky se nepřekrývají → úspora postřiku/osiva 5–15 %.
- **Méně únava řidiče** — 12hodinová směna bez napětí na koncentraci.
- **Práce v noci a mlze** — přesnost nezávislá na viditelnosti.
- **Větší výkon** — možnost jezdit širší stroje rychleji.

Cena: 150 000–500 000 Kč retrofit, 100 000–250 000 Kč jako tovární opce. Návratnost typicky 2–4 roky u farmy >100 ha.`,
    related: ['gps-rtk', 'isobus', 'variable-rate'],
  },
  {
    slug: 'variable-rate',
    term: 'Variable Rate Application',
    alias: ['VRA', 'variabilní dávkování', 'aplikační mapy'],
    kategorie: 'precise-farming',
    shortDef: 'Variable Rate Application (VRA) je technika přesného zemědělství, která mění dávkování hnojiv, osiva nebo postřiku podle GPS mapy s rozdílnými hodnotami pro různé části pole.',
    longDef: `Variable Rate Application (VRA) je hlavní princip přesného zemědělství — aplikovat různé dávky hnojiva, osiva, postřiku nebo závlahy podle aktuálních potřeb každého místa pole, ne jednotnou dávku na celou plochu.

Vstupní data pro VRA mapy:
- **Půdní rozbory** v gridu (10×10 nebo 30×30 m) → mapa pH, P, K, organická hmota.
- **Výnosové mapy** z kombajnu (yield monitor) — kde to nejvíc vynáší.
- **Satelitní snímky** (Sentinel-2, Planet) — NDVI index biomasy.
- **Drony** s multispektrální kamerou — vysoké rozlišení 5 cm.

Workflow:
1. Sběr dat → agronomický software (Climate FieldView, John Deere Ops Center, Trimble Ag Software).
2. Export aplikační mapy ve formátu ISO XML nebo SHP.
3. Import do terminálu v kabině (ISOBUS TC-GEO).
4. Při jízdě stroj sám mění dávku podle aktuální GPS pozice.

Typická úspora hnojiv 10–25 % bez snížení výnosu (někde i s vyšším výnosem). Návratnost VRA setupu (RTK + ISOBUS-capable hnojivo/secí stroj + software) 2–5 let na farmě >150 ha.`,
    related: ['isobus', 'gps-rtk', 'auto-steering'],
  },

  // ── PŘEVODOVKY ──────────────────────────────────────────────────────
  {
    slug: 'cvt-prevodovka',
    term: 'CVT převodovka',
    alias: ['Continuously Variable Transmission', 'bezstupňová převodovka', 'Vario', 'AutoPowr', 'TTV'],
    kategorie: 'technologie',
    shortDef: 'CVT (Continuously Variable Transmission) je bezstupňová převodovka, která umožňuje plynulou změnu převodového poměru bez řazení stupňů. Standard u prémiových traktorů.',
    longDef: `CVT (Continuously Variable Transmission) je převodovka, která plynule mění převodový poměr bez diskrétních stupňů. U traktorů typicky kombinace hydrostatického a mechanického přenosu (hydromechanická CVT, někdy zvaná "power-split").

Hlavní výhody:
- **Optimální otáčky motoru** — řidič nastaví požadovanou rychlost, převodovka sama drží motor v ekonomickém pásmu (typicky 1500–1800 ot/min).
- **Plynulý rozjezd a brzdění** — žádné trhání při řazení, lepší pro nářadí citlivá na rázy (lis, secí stroj).
- **Tempomat** — drží přesnou rychlost při změnách terénu/zátěže.
- **Reverz bez spojky** — pro nakládání s čelním nakladačem rychlejší než hydraulický reverz.

Hlavní značky CVT:
- **Fendt Vario** — průkopník (1995), nejdéle vyráběná CVT, vysoká spolehlivost.
- **John Deere AutoPowr / IVT** — od 7R nahoru.
- **Case IH CVX / CVT-Drive** — Puma, Magnum.
- **New Holland Auto Command** — T6, T7, T8.
- **Deutz-Fahr TTV** — Continuously Variable.
- **Massey Ferguson Dyna-VT** — 6S, 7S, 8S.

Nevýhody: vyšší pořizovací cena (200 000–500 000 Kč příplatek vs powershift), složitější servis, citlivost na čistotu hydrauliky.`,
    related: ['powershift', 'hydrostat'],
  },
  {
    slug: 'powershift',
    term: 'Powershift převodovka',
    alias: ['částečný powershift', 'fullpower shift', 'PowrQuad'],
    kategorie: 'technologie',
    shortDef: 'Powershift je převodovka s mechanickými stupni, ale řazení probíhá pod zátěží bez sešlápnutí spojky pomocí hydraulických lamelových spojek.',
    longDef: `Powershift převodovka má mechanické převodové stupně (jako manuál), ale řazení mezi stupni se děje pod zatížením bez sešlápnutí spojky. Funguje to díky hydraulickým lamelovým spojkám, které synchronizují otáčky obou hřídelí během řazení (~0,3 s).

Hlavní výhody:
- **Řazení pod plnou zátěží** — neztrácí se rychlost ani moment, ideální pro orbu a těžké tahové práce.
- **Jednodušší než CVT** — méně součástí, levnější servis.
- **Životnost** — typicky 10 000+ motohodin bez velké opravy.

Varianty:
- **Polo-powershift** (semi-powershift) — část stupňů manuální, část powershift (např. 24×24 s 4-stupňovým powershiftem).
- **Plný powershift** (full powershift) — všech 16–24 stupňů řadí pod zátěží (např. John Deere 6M PowrQuad, Case IH Maxxum ActiveDrive).

Nevýhody proti CVT: řidič musí ručně vybírat stupeň (nebo se spolehne na automatický mód, který občas zařadí nevhodně), motor neběží vždy v optimálních otáčkách.

Cenově: o 100 000–300 000 Kč levnější než ekvivalentní CVT. Vyplatí se u traktorů, kde majoritní využití je orba a podobné stálé zatížení.`,
    related: ['cvt-prevodovka', 'hydrostat'],
  },
  {
    slug: 'hydrostat',
    term: 'Hydrostatická převodovka',
    alias: ['HST', 'hydrostat'],
    kategorie: 'technologie',
    shortDef: 'Hydrostatická převodovka přenáší výkon přes hydraulické čerpadlo a motor — bezstupňová změna rychlosti pomocí joysticku nebo pedálu, používaná u malých traktorů a kombajnů.',
    longDef: `Hydrostatická převodovka (HST — Hydrostatic Transmission) přenáší výkon motoru přes hydraulické čerpadlo na hydraulický motor, který pohání kola. Změna rychlosti se děje variací výkonu čerpadla — od plného couvání přes nulu po plnou rychlost vpřed, plynule.

Hlavní použití v zemědělství:
- **Malé traktory** (kompaktní 25–60 koní, např. Kubota L-Series) — ovládání joystickem, vhodné pro nepřetržitou změnu rychlosti při nakládce, sečení trávníků.
- **Sklízecí mlátičky (kombajny)** — pojezd HST, na PTO mechanický pohon.
- **Nakladače** (čelní, kloubové) — HST je standard.
- **Komunální stroje** — sekačky, multifunkční nosiče.

Výhody: jednoduché ovládání (pedál nebo joystick), žádné řazení, plynulé manévrování. Nevýhody: nižší účinnost než mechanická převodovka (15–25 % ztráty), nevhodné pro velké tahové práce na poli (rychle se zahřívá, ztrácí výkon).

U velkých polních traktorů (100+ koní) se HST nepoužívá jako hlavní pohon — místo toho hydromechanická CVT (kombinace HST + mechanického přenosu pro lepší účinnost).`,
    related: ['cvt-prevodovka', 'powershift'],
  },

  // ── HNOJIVA & AGROTECHNIKA ──────────────────────────────────────────
  {
    slug: 'npk-hnojivo',
    term: 'NPK hnojivo',
    alias: ['NPK', 'minerální hnojivo'],
    kategorie: 'hnojivo',
    shortDef: 'NPK je minerální hnojivo obsahující tři hlavní živiny — dusík (N), fosfor (P) a draslík (K). Označení např. 15-15-15 znamená 15 % každé živiny.',
    longDef: `NPK hnojivo je minerální (anorganické) hnojivo, které obsahuje tři hlavní makroživiny v různých poměrech: dusík (N — Nitrogen), fosfor (P — Phosphorus) a draslík (K — Kalium / Potassium).

Označení: číselný kód udává procenta jednotlivých živin v sušině. Příklady:
- **NPK 15-15-15** — vyrovnané, univerzální, 15 % N, 15 % P₂O₅, 15 % K₂O.
- **NPK 11-44-11** — startovací do osiva (vysoký fosfor pro rozvoj kořenů).
- **NPK 8-20-30** — podzimní pod ozimy (nízký N, vysoký K).
- **NPK 20-10-10** — jarní top dressing pro pšenici.

Důležitá poznámka: P se uvádí jako **P₂O₅** (oxid), K jako **K₂O** — ne čisté prvky. Pro přepočet:
- 1 kg P = 2,29 kg P₂O₅
- 1 kg K = 1,20 kg K₂O

Stopové prvky (S, Mg, Ca, B, Zn, Cu) jsou v NPK plus formách (např. NPK + S, NPK Mikro). Aktuální cena NPK 15-15-15 se pohybuje kolem 13 000–18 000 Kč/t v závislosti na sezóně a původu.

Pro variabilní dávkování (VRA) podle GPS map vyžaduje secí stroj nebo rozmetadlo s ISOBUS TC-GEO.`,
    related: ['variable-rate', 'pH-pudy', 'mocovina'],
  },
  {
    slug: 'mocovina',
    term: 'Močovina',
    alias: ['urea', 'karbamid', 'močovinné hnojivo'],
    kategorie: 'hnojivo',
    shortDef: 'Močovina (chemicky urea, CO(NH₂)₂) je nejkoncentrovanější dusíkaté hnojivo — obsahuje 46 % N, nejlevnější za jednotku dusíku.',
    longDef: `Močovina (urea, karbamid) je organická sloučenina vzorce CO(NH₂)₂. Jako hnojivo je nejkoncentrovanější dusíkatý zdroj — 46 % N v sušině. Vyrábí se průmyslově ze syntetického amoniaku a CO₂.

Hlavní vlastnosti:
- **Nejlevnější za jednotku N** — typicky 15–20 % levnější než síran amonný nebo dusičnan amonný (per kg dusíku).
- **Zpožděný účinek** — N se nejdřív musí enzymaticky rozložit na amoniak → nitrifikace → nitrát (cca 1–3 týdny).
- **Riziko ztrát volatilizací** — při aplikaci na povrch a teplém suchém počasí může 10–30 % N uniknout jako NH₃ do atmosféry. Řeší se zapravením pod povrch nebo inhibitorem ureázy (NBPT).

Aplikace:
- Pod ozimou pšenici jarní top dressing 100–250 kg/ha (= 46–115 kg N/ha).
- Pro kukuřici start + boční hnojení 200–500 kg/ha.
- Listová hnojiva 5–15 kg/ha v roztoku.

Močovina se používá i jako surovina pro AdBlue (32,5% roztok) — same molecula, ale vyšší purity grade.`,
    related: ['npk-hnojivo', 'adblue'],
  },
  {
    slug: 'pH-pudy',
    term: 'pH půdy',
    kategorie: 'agrotechnika',
    shortDef: 'pH půdy je míra kyselosti — pod 7 kyselá, nad 7 zásaditá. Ideální pro většinu polních plodin je pH 6,0–7,0. Korekce vápněním nebo síranem amonným.',
    longDef: `pH půdy je logaritmická míra koncentrace vodíkových iontů (H⁺). Škála 0–14, neutrální 7. Půdy v ČR jsou většinou mírně kyselé (pH 5,5–6,8) díky srážkám a vyplavování vápníku.

Optimální pH pro hlavní plodiny:
- **Pšenice, ječmen, kukuřice**: 6,0–7,0
- **Cukrová řepa**: 6,5–7,5 (citlivá na kyselost)
- **Brambory**: 5,5–6,5 (snášejí slabě kyselé)
- **Vojtěška, jetel**: 6,5–7,0
- **Borůvka, brusinka**: 4,5–5,5 (potřebují kyselé)

Důsledky špatného pH:
- **Příliš kyselé** (pH < 5,5): blokuje příjem P, K, Mg; aktivuje toxický Al, Mn; sníží činnost mikroorganismů. Řešení: vápnění (uhličitan vápenatý CaCO₃, dolomitické vápno) 2–6 t/ha.
- **Příliš zásadité** (pH > 7,5): blokuje příjem mikroprvků (Fe, Mn, Zn, B). Řešení: síran amonný, elementární síra, organická hmota.

Měření: půdní rozbor v akreditované laboratoři (ÚKZÚZ Brno, ČZU Praha) — typicky 500–1500 Kč za 5 vzorků. Plánujte 1× za 4–6 let.

Pro variabilní vápnění (VRA) podle GPS gridu rozbory v 30×30 m mřížce → mapa pH → aplikační mapa pro rozmetadlo.`,
    related: ['npk-hnojivo', 'variable-rate'],
  },
  {
    slug: 'mezi-plodiny',
    term: 'Meziplodiny',
    alias: ['krycí plodiny', 'cover crops', 'EFA meziplodiny'],
    kategorie: 'agrotechnika',
    shortDef: 'Meziplodiny jsou rostliny vysévané mezi dvěma hlavními plodinami pro zlepšení půdní úrodnosti, ochranu proti erozi a vázání dusíku. Podmínka EKO režimu CAP 2024.',
    longDef: `Meziplodiny (cover crops) jsou plodiny vysévané v období mezi sklizní hlavní plodiny a setím další, často přes zimu nebo letní úhor. Slouží k:

1. **Ochraně půdy proti erozi** — pokrývají povrch v období dešťů a větru.
2. **Vázání dusíku** (luskovinné meziplodiny: vikev, hrách, lupina) — bakterie Rhizobium fixují vzdušný N₂.
3. **Mobilizaci živin** — košatý kořenový systém vytěží P, K z hlubších vrstev.
4. **Zvyšování obsahu organické hmoty** — biomasa zaorána tvoří humus.
5. **Boj s plevely a chorobami** — rušivý vliv na životní cyklus některých plevelů.
6. **Vázání CO₂** — uhlík v půdě je dlouhodobě sekvestrován.

Typické druhy:
- **Hořčice bílá** — rychlá, levná, dusíkofilní.
- **Svazenka** — rychlý růst, vhodná do letního úhoru.
- **Vikev huňatá + žito** — zimní mez, vhodné před jaří plodinou.
- **Jetel inkarnát** — vázání N, krmivo.
- **Pohanka** — pro letní krátkou meziplodinu.

V CAP 2024 jsou meziplodiny součástí EKO režimu (premium sazba 2400 Kč/ha) a EFA (Ecological Focus Areas). Při počítání kompenzace 1 ha meziplodiny = 0,3 ha EFA.`,
    related: ['eko-platba', 'biopasy', 'cap-2024'],
  },
  {
    slug: 'biopasy',
    term: 'Biopásy',
    alias: ['biokoridor', 'krajinné prvky'],
    kategorie: 'agrotechnika',
    shortDef: 'Biopásy jsou neoseté pruhy mezi hlavními plodinami, určené pro biodiverzitu, hmyz, ptactvo a malou zvěř. Součást EFA a EKO režimu CAP.',
    longDef: `Biopásy jsou neproduktivní pruhy v polních plochách (typicky 6–20 m široké), které slouží jako útočiště pro divokou faunu — opylovače, drobnou zvěř, ptactvo. Mohou být osety speciálními směskami (medonosné kvetoucí rostliny) nebo ponechány jako autonomní úhor.

Typy biopásů:
- **Nektarodárný biopás** — směska kvetoucích rostlin (svazenka, slunečnice, pohanka, jetel, vičence). Klíčový pro včely a divoké opylovače.
- **Krmný biopás** — pro koroptve, bažanty, zajíce — obiloviny, slunečnice, kukuřice.
- **Travní pás** — proti erozi, podél vodotečí.
- **Biopás okraj pole** — 6–12 m široký, povinný pro některé eko-režimy.

V CAP 2024:
- Biopásy patří do **EFA** (Ecological Focus Areas) — koeficient 1,5 (1 ha biopásu = 1,5 ha EFA).
- Premium EKO režim vyžaduje min. 7 % výměry v EFA (z toho biopásy + meziplodiny + krajinné prvky).
- Speciální výzva v PRV: dotace na založení biopásu (typicky 8 000–18 000 Kč/ha podle směsky).

Praktická pravidla: biopás nesmí být sečený před koncem hnízdění (1.8.), nesmí být postříkán pesticidy, údržba 1× ročně mulčováním nebo sklizní.`,
    related: ['mezi-plodiny', 'eko-platba', 'cap-2024'],
  },

  // ── DOTACE ──────────────────────────────────────────────────────────
  {
    slug: 'cap-2024',
    term: 'CAP 2024',
    alias: ['Společná zemědělská politika', 'SZP 2023-2027'],
    kategorie: 'dotace',
    shortDef: 'CAP 2024 (Common Agricultural Policy, česky SZP) je program přímých plateb EU pro zemědělce v období 2023–2027. Hlavní platby: BISS, CISS, EKO, ANC, VCS.',
    longDef: `Společná zemědělská politika (SZP, EN: CAP — Common Agricultural Policy) je hlavní finanční nástroj EU pro podporu zemědělství. Aktuální období 2023–2027 přineslo zásadní reformu — víc důrazu na ekologii (greening), redistribuci ve prospěch menších farem a zachování přírodních zdrojů.

Hlavní složky pro ČR (orientační sazby 2024):
1. **BISS** (Basic Income Support for Sustainability) — Základní platba, ~2150 Kč/ha na všechnu způsobilou plochu.
2. **CISS** (Complementary Redistributive Income Support) — Redistributivní platba, ~1450 Kč/ha pro prvních 150 ha. Podporuje malé farmy.
3. **EKO-platba** (Eco-scheme) — Základní 1300 Kč/ha, premium 2400 Kč/ha za víc eko-praktik (meziplodiny, biopásy, neproduktivní plochy).
4. **ANC** (Areas with Natural Constraints) — Méně příznivé oblasti, horská 4500 Kč/ha, OA/SV 2000 Kč/ha.
5. **Mladý zemědělec** — Bonus 1500 Kč/ha pro prvních 150 ha (do 40 let, max 5 let).
6. **VCS** (Voluntary Coupled Support) — Citlivé sektory: chmel 13000 Kč/ha, polní zelenina 9000 Kč/ha, cukrová řepa 7500 Kč/ha, ovoce 6500 Kč/ha, brambory na škrob 5500 Kč/ha, bílkoviny 2800 Kč/ha, len 4500 Kč/ha, krmné 1100 Kč/ha.

Žádost se podává jednorázově v Jednotné žádosti (typicky duben–červen, podává se elektronicky přes Portál farmáře SZIF). Závazné sazby SZIF zveřejňuje po uzávěrce kampaně.

Pro orientační výpočet: [Kalkulačka dotací CAP](/kalkulacka/dotace-cap/).`,
    related: ['eko-platba', 'mezi-plodiny', 'biopasy'],
    externalUrl: 'https://www.szif.cz',
    externalLabel: 'SZIF — Státní zemědělský intervenční fond',
  },
  {
    slug: 'eko-platba',
    term: 'EKO-platba',
    alias: ['Eco-scheme', 'greening', 'eko režim'],
    kategorie: 'dotace',
    shortDef: 'EKO-platba je část CAP 2024 podporující ekologické praktiky. Základní sazba ~1300 Kč/ha, premium ~2400 Kč/ha za víc eko-opatření.',
    longDef: `EKO-platba (Eco-scheme) je dobrovolná část přímých plateb CAP 2024, která odměňuje zemědělce za environmentálně přínosné praktiky nad rámec povinných kondicionalit.

Dva režimy v ČR:
1. **Základní EKO režim** — ~1300 Kč/ha. Povinná opatření jako pestrá rotace plodin, sankce za monokultury, dodržování krajinných prvků.
2. **Premium EKO režim** — ~2400 Kč/ha. Vyžaduje navíc:
   - Min. 7 % EFA (Ecological Focus Areas) z orné půdy — meziplodiny + biopásy + krajinné prvky.
   - Pásová pravidla podél vodotečí (min. 3 m bez pesticidů).
   - Kvalitní krycí plodiny nebo strniště přes zimu.

Bez aspoň základního EKO režimu farma ztrácí významnou část přímých plateb — proto je v praxi 95+ % zemědělců v EKO režimu.

Pro výpočet: rozdíl mezi základem a premium je 1100 Kč/ha. U farmy 200 ha = 220 000 Kč/rok navíc. Pokud zavedení premium praktik (osivo meziplodin, výsev, sečení biopásů) stojí <1100 Kč/ha, vyplatí se.

V praxi výnos premium praktik jde nahoru (lepší půda, méně erozí ztracené orniční vrstvy) — net pozitivní i bez dotační prémie u dlouhodobé farmy.`,
    related: ['cap-2024', 'mezi-plodiny', 'biopasy'],
  },
  {
    slug: 'lpis',
    term: 'LPIS',
    alias: ['Land Parcel Identification System', 'evidence půdy'],
    kategorie: 'dotace',
    shortDef: 'LPIS je centrální evidence zemědělské půdy v ČR — každý pole/pozemek má unikátní LPIS blok, na který se vážou dotační žádosti a katastrální údaje.',
    longDef: `LPIS (Land Parcel Identification System) je veřejná evidence způsobilé zemědělské půdy v ČR, kterou spravuje ÚKZÚZ a používá SZIF pro kontrolu dotací. Každý pozemek používaný k zemědělství má unikátní **LPIS blok** s vlastním kódem (např. "1234/56").

Co LPIS obsahuje:
- **Hranice půdního bloku** v GIS — přesně podle DPB (díly půdních bloků).
- **Kulturu** — orná půda, TTP (trvalý travní porost), sad, vinice, chmelnice, ostatní.
- **Výměru** v ha.
- **Zařazení do ANC** kategorie (horská H1–H5, OA, SV nebo mimo ANC).
- **Krajinné prvky** v bloku — solitérní strom, mez, biokoridor.
- **Erozní ohrožení** — kategorie M (mírně), S (silně) ovlivňuje pravidla pro osetí.
- **Vlastnické vztahy** — kdo je uživatelem (žadatel o dotace).

LPIS data jsou veřejně dostupná: https://eagri.cz/public/web/mze/farmar/LPIS/ — kdokoliv vidí hranice a kulturu (ne vlastníka).

Aktualizace LPIS: zemědělec hlásí změny (rozdělení, sloučení, změna kultury) ÚKZÚZ. Bez aktuálního LPIS nelze podat žádost o přímé platby ani investiční dotace.`,
    related: ['cap-2024', 'biss', 'dpb'],
    externalUrl: 'https://eagri.cz/public/web/mze/farmar/LPIS/',
  },
  {
    slug: 'biss',
    term: 'BISS',
    alias: ['Basic Income Support for Sustainability', 'Základní platba', 'SAPS'],
    kategorie: 'dotace',
    shortDef: 'BISS je hlavní přímá platba CAP 2024 — ~2150 Kč/ha na všechnu způsobilou zemědělskou plochu. Nahradila dřívější SAPS.',
    longDef: `BISS (Basic Income Support for Sustainability) je základní přímá platba CAP 2024 — nahrazuje dřívější SAPS (Single Area Payment Scheme). Vyplácí se na všechnu způsobilou zemědělskou plochu evidovanou v LPIS.

Sazba 2024: ~2150 Kč/ha. Pro farmu 100 ha = 215 000 Kč/rok jen BISS, plus další složky (CISS, EKO, ANC, VCS) dohromady 6 000–15 000 Kč/ha.

Podmínky pro nárok:
1. **Aktivní zemědělec** — pravidelná zemědělská činnost, ne jen "držet půdu".
2. **Žádost přes Jednotnou žádost SZIF** — duben–červen, elektronicky přes Portál farmáře.
3. **Min. výměra 1 ha** — pod tím se nárok neuplatňuje.
4. **Kondicionality** — povinné praktiky GAEC + povinné požadavky řízení SMR (welfare, půda, voda).

Vyplácení: SZIF vyplácí v podzimních termínech (typicky říjen-prosinec) za předchozí kampaň. Při kontrole na místě a zjištění nesrovnalostí může být sankce 1–100 % i s vrácením předchozích plateb.

Pro orientační výpočet vaší celkové dotace: [Kalkulačka dotací CAP](/kalkulacka/dotace-cap/).`,
    related: ['cap-2024', 'lpis', 'eko-platba'],
  },

  // ── DALŠÍ ───────────────────────────────────────────────────────────
  {
    slug: 'dpb',
    term: 'DPB (Díl půdního bloku)',
    alias: ['Díl půdního bloku'],
    kategorie: 'dotace',
    shortDef: 'DPB (Díl půdního bloku) je nejmenší jednotka v LPIS — souvislá plocha jednoho zemědělce s jednou kulturou. Tvoří základ pro žádost o dotace.',
    longDef: `Díl půdního bloku (DPB) je atomická jednotka evidence v LPIS — souvislá plocha v majetku nebo nájmu jednoho uživatele s jednou kulturou (orná půda, TTP, sad, vinice, chmelnice). Každý DPB má unikátní identifikátor a vlastní GIS polygon.

Příklad: zemědělec hospodaří na 5 polích — každé pole = jeden DPB v LPIS. Pokud část pole je oseta cukrovkou a druhá pšenicí, jsou to dva DPB (stejná kultura "orná půda", ale s různými osevami).

DPB je zásadní pro:
- **Žádost o přímé platby** — výměra každého DPB se sčítá pro BISS/CISS.
- **VCS** — některé VCS sazby se aplikují per DPB (citlivé sektory).
- **ANC** — zařazení do ANC kategorie je per DPB.
- **Erozní pravidla** — kategorie erozního ohrožení (M, S) je per DPB.
- **EFA** — meziplodiny, biopásy se hlásí jako podíl DPB.

Změny DPB hlásí uživatel přes Portál farmáře nebo na obecním úřadě (rozdělení, sloučení, změna kultury). Bez aktuálního DPB v LPIS nelze podat žádost.

Online: hranice a kultura všech DPB jsou veřejné na https://eagri.cz/public/web/mze/farmar/LPIS/.`,
    related: ['lpis', 'biss', 'cap-2024'],
  },
  {
    slug: 'ttp',
    term: 'TTP (Trvalý travní porost)',
    alias: ['louka', 'pastvina', 'permanent grassland'],
    kategorie: 'agrotechnika',
    shortDef: 'TTP je trvalý travní porost — louka nebo pastvina, kde se 5+ let nepřesvál. Speciální kategorie v LPIS s vlastními pravidly pro dotace.',
    longDef: `Trvalý travní porost (TTP) je půdní blok osetý travinami nebo travinami s leguminózami, který nebyl pšenicován (orán a osetý jinou plodinou) déle než 5 let. V LPIS je TTP samostatná kultura, odlišná od orné půdy.

Pravidla pro TTP v CAP 2024:
- **Zákaz orby** — TTP nelze přeorat bez speciálního povolení (= ztráta statusu TTP, sankce za "trvalé znehodnocení permanent grassland").
- **Citlivé TTP** v Natura 2000 nebo CHKO: úplný zákaz orby.
- **Min. zatížení dobytkem** (pastevní TTP) — pokud TTP neslouží jako pastva, vyžaduje sečení 1–2× ročně.
- **EKO režim** — TTP nepotřebuje meziplodiny ani rotaci (jsou per definice "trvalé") — automaticky kvalifikuje na základní EKO sazbu.
- **ANC** — TTP v horských oblastech (H1–H5) má vysoké ANC sazby (až 7000 Kč/ha za horské pastviny).

V ČR je ~25 % zemědělské plochy v TTP (cca 900 000 ha). Hlavně v horských a podhorských oblastech (Jihočeský, Plzeňský, Vysočina, Zlínský, Moravskoslezský kraj).

TTP má důležitou ekologickou hodnotu (biodiverzita, zadržování vody, sekvestrace uhlíku) — proto je státem chráněn před přeoráním.`,
    related: ['lpis', 'cap-2024', 'pastvina'],
  },
  {
    slug: 'pto',
    term: 'PTO (Vývodový hřídel)',
    alias: ['Power Take-Off', 'vývodový hřídel', 'vývodovka'],
    kategorie: 'technologie',
    shortDef: 'PTO (Power Take-Off) je vývodový hřídel na traktoru pro pohon nářadí — secí stroj, sečka, lis, postřikovač. Standardní otáčky 540 nebo 1000 ot/min.',
    longDef: `PTO (Power Take-Off, vývodový hřídel) je rotující hřídel na zadní (nebo přední) části traktoru, který přenáší výkon motoru na připojené nářadí — sečku, lis, secí stroj, postřikovač, mulčovač, snopovač, kombajn závěsný.

Standardní otáčky:
- **540 ot/min** — historicky nejstarší, dodnes pro malé nářadí (mulčovač, sečka, malé postřikovače).
- **1000 ot/min** — vyšší pro velké nářadí (lisy, kombajny závěsné, velké postřikovače).
- **540E (Economy)** — moderní úsporný režim, traktor běží na 1500 ot/min motoru, PTO drží 540 → úspora 10–15 % paliva.
- **1000E (Economy)** — paralelně pro 1000 ot.

Hřídel:
- **6drážkový** — standard pro 540 ot.
- **21drážkový** — pro 1000 ot, vyšší pevnost.

Bezpečnost: PTO je velmi nebezpečné — rotující hřídel s obvodovou rychlostí 10+ m/s může strhnout oblečení a způsobit smrt. Vždy s krytem (kryt nářadí + kryt na traktoru). Před odpojováním vypněte motor.

Některé moderní traktory mají **PTO autostop** — PTO se sám vypne při zastavení/zvedání tříbodu.`,
    related: ['hydraulika-traktor', 'tribod'],
  },
  {
    slug: 'tribod',
    term: 'Tříbodový závěs',
    alias: ['tříbod', '3-bod', 'three-point hitch'],
    kategorie: 'technologie',
    shortDef: 'Tříbodový závěs je standardizovaný systém pro připojení nářadí k zadní (nebo přední) části traktoru — dva spodní táhly + jeden horní táhlo.',
    longDef: `Tříbodový závěs (3-bodový hitch, three-point linkage) je nejdůležitější standardizace v zemědělství — umožňuje připojit jakékoliv nářadí jakémukoli traktoru bez přestavby. Vynalezl ho Harry Ferguson v 30. letech 20. století (Ferguson System).

Komponenty:
- **Dva spodní zvedací táhly** (lower lift arms) — hydraulicky zvedané, určují výšku nářadí.
- **Jeden horní táhlo** (top link) — fixní délka, určuje sklon nářadí.
- **Stabilizační táhla** (check chains) — omezují boční pohyb.

Kategorie podle pevnosti a velikosti zvedacích kulových čepů:
- **Cat I** — malé traktory do 40 koní, Ø 22 mm čepy.
- **Cat II** — střední 40–100 koní, Ø 28 mm.
- **Cat III** — velké 80–225 koní, Ø 36 mm.
- **Cat IV** — největší 180+ koní, Ø 45 mm.
- **Cat IV-N** — užší verze pro lepší manipulaci.

Zvedací kapacita: udává se na koncích táhel (lift capacity at hitch point) — typicky 3 500 kg pro Cat II, 6 500 kg pro Cat III, 12 000+ kg pro Cat IV.

**Přední tříbod** — moderní volba u prémiových traktorů (Fendt, JD), umožňuje plnit pole nářadím "v sendviči" (jedno nářadí vepředu, druhé vzadu) → vyšší produktivita.`,
    related: ['pto', 'hydraulika-traktor'],
  },
  {
    slug: 'hydraulika-traktor',
    term: 'Hydraulika traktoru',
    alias: ['hydraulický okruh', 'PFC', 'load sensing'],
    kategorie: 'technologie',
    shortDef: 'Hydraulika traktoru pohání tříbod, externí výstupy pro nářadí a často i řízení. Moderní systémy: load sensing (LS), Power Flow Control (PFC).',
    longDef: `Hydraulický systém traktoru obsluhuje:
1. **Tříbodový závěs** — zvedání nářadí.
2. **Externí výstupy** (SCV — Selective Control Valves) — pohon hydraulických funkcí nářadí (sklápěcí postřikovač, závlahový válec, naviják).
3. **Posilovač řízení** (power steering).
4. **Spojku PTO**, **diferenciální uzávěrku**, **4×4 spojku**.

Typy hydraulických systémů:
- **Open Center** — historický, čerpadlo trvale dodává plný průtok, přebytky tečou zpět do nádrže. Jednoduché, nízká účinnost, dobré pro lehké nářadí.
- **Closed Center s LS (Load Sensing)** — moderní standard, čerpadlo dodává jen tolik tlaku a průtoku, kolik nářadí požaduje. Vyšší účinnost (úspora 5–15 % paliva).
- **PFC (Pressure Flow Compensation)** — Premium varianta LS, ještě přesnější regulace.

Klíčové parametry:
- **Max. tlak** — typicky 200 bar (malé) až 250 bar (prémium).
- **Max. průtok** — 60 l/min malé traktory, 200+ l/min top modely.
- **Počet SCV** — 2 standard, 4–6 prémium (pro komplexní nářadí jako velký postřikovač).

Olej: hydraulický + převodový společný (UTTO — Universal Tractor Transmission Oil), výměna 1× za 1500–3000 motohodin. Pozor na míchání s ATF nebo motorovým olejem — nekompatibilní.`,
    related: ['tribod', 'pto'],
  },

  // ── HMOTA & MĚŘENÍ ──────────────────────────────────────────────────
  {
    slug: 'hektar',
    term: 'Hektar (ha)',
    alias: ['ha', 'jednotka plochy'],
    kategorie: 'agrotechnika',
    shortDef: 'Hektar (ha) je jednotka plochy = 10 000 m² = 100 × 100 m. Standardní jednotka v zemědělství pro výměru polí, dotace, výnosy.',
    longDef: `Hektar (ha) je jednotka plošného obsahu metrické soustavy. 1 ha = 10 000 m² = 100 a (arů). Vizuálně: čtverec 100 × 100 m, nebo fotbalové hřiště 1,5×.

V zemědělství je hektar základní jednotka pro:
- **Výměru pole** — celá farma se měří v ha (50 ha, 200 ha, 1000 ha).
- **Dotace** — Kč/ha (BISS 2150 Kč/ha, CISS 1450 Kč/ha).
- **Výnos plodin** — t/ha nebo q/ha (1 q = 100 kg = 1 metrický cent).
- **Spotřeba hnojiv** — kg/ha (200 kg NPK/ha).
- **Dávkování postřiků** — l/ha (5 l Roundup/ha).
- **Výkon strojů** — ha/h (postřikovač 12 m záběr × 12 km/h = 14,4 ha/h teoreticky).

Převody:
- 1 km² = 100 ha
- 1 mile² (USA) = 259 ha
- 1 acre (USA) = 0,405 ha (acre × 0,405 = ha)
- 1 morgen (DE/AT) = 0,25–0,34 ha podle regionu (historická)

V ČR farmy 1–50 ha = "drobní farmáři", 50–500 ha = "střední", 500–5000 ha = "velcí", 5000+ ha = "průmyslové podniky".`,
    related: ['cap-2024', 'pH-pudy'],
  },
  {
    slug: 'q-cent',
    term: 'Cent (q)',
    alias: ['q', 'metrický cent', 'kvintál'],
    kategorie: 'agrotechnika',
    shortDef: 'Cent (q) je jednotka hmotnosti = 100 kg. V zemědělství se používá pro výnosy a ceny komodit — pšenice 60 q/ha = 6 t/ha.',
    longDef: `Cent (latinsky centum = 100, značka **q** z italského "quintale") je jednotka hmotnosti, standardně 100 kilogramů. V CZ a EU zemědělství je dominantní jednotkou pro:

- **Výnosy plodin**: pšenice 60–80 q/ha, kukuřice 80–120 q/ha, řepka 35–45 q/ha. 1 q/ha = 100 kg/ha = 0,1 t/ha.
- **Ceny komodit**: 5500 Kč/t pšenice = 550 Kč/q. Rolníci často počítají v q při jednání s výkupy.
- **Spotřeba krmiv**: kráva mléčné dojnice spotřebuje cca 30 q směsi/rok.

Pozor — q (metrický cent) je odlišné od **q amerického** (= 100 lb = 45,4 kg) a **q britského** (= 112 lb = 50,8 kg). V mezinárodním obchodě se používá výhradně **metrická tuna (t)** = 1000 kg = 10 q.

Praktický příklad:
- Pšenice 6 t/ha × 100 ha = 600 t = 6000 q
- Cena 5500 Kč/t = 550 Kč/q → tržba 3,3 mil. Kč

Pro velké výnosy (kukuřice silážní, traviny na siláž) se počítá v t (1 t = 10 q), nikdy v q (čísla by byla nepraktická — 400 q/ha kukuřice).`,
    related: ['hektar'],
  },
];

export function getSlovnikTerm(slug: string): SlovnikTerm | undefined {
  return SLOVNIK.find((t) => t.slug === slug);
}

export function getSlovnikByCategory(cat: SlovnikKategorie): SlovnikTerm[] {
  return SLOVNIK.filter((t) => t.kategorie === cat);
}

export const KATEGORIE_LABELS: Record<SlovnikKategorie, string> = {
  technologie: 'Technologie',
  pohon: 'Pohon a motor',
  hnojivo: 'Hnojiva',
  dotace: 'Dotace a SZIF',
  agrotechnika: 'Agrotechnika',
  regulace: 'Regulace a normy',
  'precise-farming': 'Přesné zemědělství',
};
