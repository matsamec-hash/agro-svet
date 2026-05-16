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

  // ── DALŠÍ TECHNOLOGIE / STROJE ──────────────────────────────────────
  {
    slug: 'turbodmychadlo',
    term: 'Turbodmychadlo',
    alias: ['turbo', 'turbocharger', 'přeplňování'],
    kategorie: 'pohon',
    shortDef: 'Turbodmychadlo využívá energii výfukových plynů k roztočení turbíny, která stlačí vzduch do válce — vyšší výkon ze stejné kubatury motoru.',
    longDef: `Turbodmychadlo (turbo, turbocharger) je dvojice spojených oběžných kol — turbína na straně výfuku a kompresor na straně sání. Výfukové plyny roztáčí turbínu (až 200 000 ot/min), spojený hřídel pohání kompresor, který stlačí nasávaný vzduch před vstupem do válce.

Důsledky pro motor:
- **+30–50 % výkon ze stejné kubatury** vs atmosférický motor.
- **Vyšší kroutivý moment v nízkých otáčkách** (key pro tahové práce).
- **Lepší účinnost** ve vyšších nadmořských výškách (kompenzuje řidší vzduch).

Moderní traktorové motory používají:
- **VGT** (Variable Geometry Turbo) — měnitelná geometrie lopatek turbíny, optimální boost v širším pásmu otáček.
- **Twin-turbo** (sériové nebo paralelní) u top motorů (Fendt 1000, JD 9R) — primární turbo pro nízké otáčky, sekundární pro vysoké.
- **Intercooler** (mezichladič) za turbem — chladí stlačený horký vzduch, hustější náplň, vyšší výkon.

Údržba: pravidelná výměna oleje (turbo má ložiska mazaná olejem motoru), po vypnutí motoru turbo doběhne 30+ sekund — proto nelze hned vypínat po plné zátěži (riziko zničení ložisek). Životnost při dobré údržbě 10 000+ motohodin.`,
    related: ['common-rail', 'dpf'],
  },
  {
    slug: 'egr',
    term: 'EGR',
    alias: ['Exhaust Gas Recirculation', 'recirkulace výfukových plynů'],
    kategorie: 'pohon',
    shortDef: 'EGR (Exhaust Gas Recirculation) vede část výfukových plynů zpět do sání — snižuje teplotu spalování a tím tvorbu oxidů dusíku (NOx).',
    longDef: `EGR je systém čištění výfukových plynů, který recirkuluje 5–30 % výfukových plynů zpět do sacího potrubí. Důvod: nižší teplota spalování → méně NOx (oxidů dusíku) ve výfuku.

Použití u traktorů:
- **Stage IIIA–IIIB** (2006–2014): hlavní cesta snížení NOx. EGR + DPF.
- **Stage IV+** (2014+): EGR doplněn nebo nahrazen SCR (AdBlue). Vyšší účinnost.

Nevýhody EGR:
- **Saze v sání** — recirkulované plyny obsahují PM, postupně se usazují v EGR ventilu a sacím potrubí. Po 5–8 000 motohodinách typicky vyžaduje čištění (5–15 000 Kč).
- **Snížení výkonu o 3–5 %** — recirkulované plyny snižují koncentraci kyslíku.
- **Vyšší spotřeba** o 2–4 % ve srovnání s motorem bez EGR.

Proto výrobci u Stage V přešli na SCR jako dominantní cestu — vyšší pořizovací cena, ale nižší provozní (méně paliva, méně oprav).`,
    related: ['scr-katalyzator', 'dpf', 'emisni-normy-stage'],
  },
  {
    slug: 'biopal',
    term: 'Biopalivo / Biodiesel',
    alias: ['biodiesel', 'FAME', 'B100', 'B7'],
    kategorie: 'pohon',
    shortDef: 'Biodiesel je palivo z rostlinných olejů (řepkový metylester, FAME) — v ČR povinně přidáván do běžné nafty (B7 = 7 % FAME).',
    longDef: `Biodiesel je obnovitelné palivo vyrobené esterifikací rostlinných olejů (nejčastěji řepkový olej v ČR, sójový v USA, palmový v Asii) nebo živočišných tuků s methanolem → FAME (Fatty Acid Methyl Ester).

V Evropě:
- **B7** — 7 % FAME v běžné motorové naftě. Standardní palivo na čerpacích stanicích od cca 2010. Kompatibilní se všemi moderními motory.
- **B30 / B100** — 30 % nebo 100 % FAME. Vyžaduje specifické těsnění + olej, ne každý motor je certifikovaný. Slabší výhřevnost (cca −7 %) → vyšší spotřeba.

Pro zemědělce:
- **Modré nafty (z benzinky)** v ČR jsou vždy B7 = obsahují FAME.
- **Vlastní biopaliva** (pěstuje + lisuje řepku) — možné, ale riziko zničení Common Rail vstřikovačů pokud nedostatečně očištěno.
- **Stage V motory** typicky certifikované pro B7. Vyšší koncentrace (B30+) vyžadují schválení výrobce.

Pozor: starší motory Common Rail mohou mít problém i s B7 — FAME má jiné lubrikační vlastnosti, vyšší vodivost (riziko galvanické koroze). U traktorů z 90. let s mechanickými čerpadly nehrozí.`,
    related: ['common-rail'],
  },
  {
    slug: 'powr-quad',
    term: 'PowrQuad / Quad-Shift',
    alias: ['power shuttle', 'IVT', 'AutoPowr'],
    kategorie: 'technologie',
    shortDef: 'PowrQuad je převodovka John Deere kombinující 4 mechanické řady × 4 hydraulicky řazené stupně = 16 vpřed / 16 vzad. Subset powershift převodovek.',
    longDef: `PowrQuad (John Deere brand jméno) je převodovka s mechanickými hlavními řadami (range A, B, C, D) × 4 hydraulicky řazené stupně v každé řadě = 16×16 nebo 24×24 s další nadstavbou.

Typy John Deere převodovek (od základu po flagship):
1. **SyncReverser** — manuální řazení, mechanický reverz. Základ.
2. **PowrReverser** — manuální řazení, hydraulický reverz (= power shuttle).
3. **PowrQuad** — 4 mechanické × 4 powershift = 16×16. Standardní pro řadu 6M.
4. **AutoQuad** — PowrQuad + automatické řazení stupňů. Komfortnější.
5. **AutoPowr / IVT** — plně bezstupňová CVT. Flagship 6R+/7R/8R.

Konkurence ekvivalenty:
- Case IH Maxxum **ActiveDrive 8** (16×8 powershift).
- New Holland **Range Command** (16×6 powershift).
- Fendt **Vario** (CVT — ne powershift).

Pro CZ farmáře: PowrQuad je sweet spot mezi cenou a komfortem — 200–300 tis. Kč levnější než AutoPowr CVT, ale řadí pod zátěží. Vyplatí se pro orbu a tahové práce, kde řidič řadí relativně málo.`,
    related: ['cvt-prevodovka', 'powershift'],
  },
  {
    slug: 'nase-fronta',
    term: 'Front linkage / Přední tříbod',
    alias: ['přední tříbod', 'frontale', 'front PTO'],
    kategorie: 'technologie',
    shortDef: 'Přední tříbod je hydraulický závěs nepovinně instalovaný před traktorem — umožňuje "sendvičové" nasazení nářadí vepředu i vzadu současně.',
    longDef: `Přední tříbodový závěs (front linkage) je obdoba zadního tříbodu, instalovaný před přední nápravu. Často kombinovaný s předním PTO (vývodový hřídel).

Hlavní využití:
- **Sečka + lis** — front sečka řezá, zadní lis pakuje. Jednou jízdou = dvojnásobná produktivita.
- **Front válce / brány + pluh** — paralelní zpracování půdy.
- **Front válec po orbě + hnojivo seč** — kombinovaná jízda.
- **Front naviják / lesní zařízení** — pro horské provozy.

Specifikace:
- **Zvedací kapacita** typicky 2 000–5 000 kg (méně než zadní 6 000–12 000 kg).
- **Spouštěcí dráha** kratší (cca 700 mm) — front nářadí mívá menší výhled.
- **PTO** stejné standardy (540 / 1000 ot/min).

Cenová stránka:
- Tovární front linkage 80 000–200 000 Kč příplatek.
- Retrofit (od dodavatele jako Sauter, Hauer, Lely) 60 000–180 000 Kč + montáž.

Pro CZ farmu < 50 ha málokdy návratný — vyplatí se hlavně při > 100 ha luk/jetelin nebo specializované práce.`,
    related: ['tribod', 'pto'],
  },

  // ── PŘESNÉ ZEMĚDĚLSTVÍ ─────────────────────────────────────────────
  {
    slug: 'ndvi',
    term: 'NDVI index',
    alias: ['Normalized Difference Vegetation Index', 'satelitní index vegetace'],
    kategorie: 'precise-farming',
    shortDef: 'NDVI je satelitní index biomasy plodiny — vypočtený z poměru červeného a blízkého infračerveného světla. Hodnoty 0 (holá půda) až 1 (hustá zdravá vegetace).',
    longDef: `NDVI (Normalized Difference Vegetation Index) je vegetační index používaný v dálkovém průzkumu Země. Vzorec: NDVI = (NIR − RED) / (NIR + RED), kde NIR = blízké infračervené světlo, RED = červené.

Princip: zdravé rostliny silně reflektují NIR (kvůli buněčné struktuře listů) a absorbují RED (kvůli chlorofylu). Holá půda nebo nemocné rostliny reflektují obojí podobně → nízké NDVI.

Hodnoty:
- **NDVI < 0**: voda, sníh, mrak.
- **0–0,2**: holá půda, kámen.
- **0,2–0,4**: řídká vegetace, mladá plodina.
- **0,4–0,6**: středně hustá plodina.
- **0,6–0,8**: hustá zdravá plodina (vrchol vegetace).
- **0,8+**: velmi hustý porost (les, vzrostlý lán).

Pro zemědělství:
- **Aplikační mapy** pro variabilní hnojení/postřik — kde je NDVI nízké, dej víc N.
- **Monitoring vývoje plodiny** — sledování růstu vs očekávání.
- **Detekce stresu** (sucho, choroba) — pokles NDVI uprostřed vegetační sezóny.

Zdroje dat:
- **Sentinel-2** (ESA, zdarma) — 10 m rozlišení, snímky každých 5 dní. Standard pro CZ farmáře.
- **Planet Labs** ($, 3 m rozlišení) — denní snímky, pro precision farming.
- **Drony** s multispektrální kamerou — vlastní lety, 5 cm rozlišení.`,
    related: ['variable-rate', 'gps-rtk'],
  },
  {
    slug: 'ctf',
    term: 'CTF (Controlled Traffic Farming)',
    alias: ['controlled traffic', 'řízené koleje'],
    kategorie: 'precise-farming',
    shortDef: 'CTF je metoda, kdy všechny stroje (traktor, postřikovač, kombajn) jezdí stále po stejných stálých kolejích — zbytek pole zůstává neutužený.',
    longDef: `Controlled Traffic Farming (CTF) je princip přesného zemědělství, kde se omezuje plocha utužená koly strojů — všechny stroje jezdí po identických kolejích (tramlines), zbytek pole zůstává netknutý.

Předpoklady:
- **RTK GPS auto-steering** (centimetrová přesnost) — bez něj kola nedrží přesně koleje.
- **Stejný / násobný stopový průměr** všech strojů — typicky 3 m (postřikovač) a 6 m (kombajn) = 6 m záběr postřiku + 6/12/24 m záběr secí.
- **Stejný rozkolový rozchod** kol (track width) — typicky 2,25 m nebo 3,00 m.

Výhody:
- **Snížení utužení** o 60–80 % — zbytek pole nikdy nepojezdí kola.
- **Vyšší výnosy** 5–15 % díky lepší struktuře půdy v meziřadech.
- **Méně paliva** — méně práce na zpracování utužené půdy.
- **Lepší zasakování vody** — méně erozí.

Nevýhody:
- **Vysoká počáteční investice** — RTK GPS systém + sjednocení strojů (rozkolu) může stát 500K – 2M Kč na farmu.
- **Komplikace při výměně stroje** — nový kombajn musí mít stejný rozkol.
- **V CZ málo rozšířené** — vyžaduje velké lány (>50 ha souvislých) pro ekonomický návratnost.`,
    related: ['gps-rtk', 'auto-steering', 'variable-rate'],
  },
  {
    slug: 'yield-monitor',
    term: 'Yield monitor / Výnosový monitor',
    alias: ['výnosový monitor', 'yield mapping'],
    kategorie: 'precise-farming',
    shortDef: 'Yield monitor je senzor v kombajnu, který během sklizně měří průtok zrna a GPS pozici → vytváří výnosovou mapu pole.',
    longDef: `Yield monitor je integrovaný systém v kombajnu, který kontinuálně měří:
1. **Hmotnost zrna** procházejícího skrz elevátor (typicky optický nebo nárazový senzor).
2. **Vlhkost zrna** (kapacitní nebo NIR senzor) — pro přepočet na "suchou" hmotnost.
3. **Záběr stolu** + **rychlost** = aktuální plocha za sekundu.
4. **GPS pozice** každé 1–2 sekundy.

Output: bodová data (lat, lng, kg/m²) → interpolace do mřížky → **výnosová mapa pole**.

Klíčové značky:
- **John Deere GreenStar / Operations Center** — dominantní v USA, OK v EU.
- **Case IH AFS / NH IntelliView** — společný ekosystém CNH.
- **Claas TELEMATICS** — premium EU.
- **Trimble FmX / AGCO Fuse** — třetí strany, multi-brand kompatibilní.

Pro CZ farmu:
- **Bez yield monitoru kombajn za 8M Kč = jen sklizeč**, ne datová stanice.
- Yield mapa za 1 sezónu = základ pro **VRA (variable rate)** příští rok — víc P/K kam to potřebuje, méně kam ne.
- ROI 2–3 sezóny u farmy > 100 ha.

Praktické tipy: kalibrace 1×/sezónu na váhové autě (chyba 1–3 %), vlhkostní senzor čistit denně (zaprášený senzor = posunutá data).`,
    related: ['variable-rate', 'gps-rtk', 'ndvi'],
  },

  // ── HNOJIVA / AGROCHEMIE ────────────────────────────────────────────
  {
    slug: 'dap',
    term: 'DAP (Diamonfosfát)',
    alias: ['DAP', 'diamonfosfát', '18-46-0'],
    kategorie: 'hnojivo',
    shortDef: 'DAP (diamonfosfát) je granulované hnojivo s 18 % dusíku a 46 % fosforu (P₂O₅). Hlavní zdroj fosforu pro CZ zemědělství.',
    longDef: `DAP je vysokokoncentrované fosforečné hnojivo (Diamonium Phosphate, chemicky (NH₄)₂HPO₄) s obsahem 18 % N a 46 % P₂O₅. Vyrábí se reakcí kyseliny fosforečné s amoniakem.

Použití:
- **Startovací do osiva** — 100–200 kg/ha, vstřikuje se s osivem do řádků. Vysoký fosfor podporuje rozvoj kořenového systému mladé rostliny.
- **Podzimní pod ozimy** — 150–300 kg/ha, zaorá se. Fosfor se v půdě pohybuje pomalu, proto se aplikuje hluboko a předem.
- **Jarní pod jařiny** — méně časté, fosfor by neměl zůstat na povrchu.

Vlastnosti:
- **Mírně kyselá reakce** v půdě (pH okolo 6) — vhodné pro neutrální až slabě zásadité půdy.
- **Vysoká vodorozpustnost** — okamžitě dostupný pro plodinu (na rozdíl od MAP).
- **Cena 2024**: cca 16 000–22 000 Kč/t.

Pozor: na alkalické půdě (pH > 7,5) přechází fosfor rychle do nerozpustných forem (vápenaté soli) → krátká účinnost. V tom případě lepší použít MAP nebo superfosfát.`,
    related: ['npk-hnojivo', 'pH-pudy'],
  },
  {
    slug: 'roundup',
    term: 'Roundup (glyfosát)',
    alias: ['glyfosát', 'glyphosate', 'totální herbicid'],
    kategorie: 'agrotechnika',
    shortDef: 'Glyfosát (komerční Roundup) je neselektivní systémový herbicid — zabíjí všechny rostliny po nástřiku. Dominantní herbicid CZ zemědělství pro úhor.',
    longDef: `Glyfosát je nejpoužívanější herbicid na světě, prodávaný pod značkou Roundup (Monsanto/Bayer) i generikami. Neselektivní = zabíjí jakoukoli rostlinu, systémový = absorbuje se listy a transportuje do kořenů.

Použití v CZ:
- **Úhor před setím** — vyklidí pole od plevele a strniště.
- **Pre-emergence** před vzejitím plodiny — 1–2 dny před.
- **Desikace** (vysušení) ozimé řepky a obilovin před sklizní — urychlí dozrávání, ne v ČR oficiálně schváleno pro potraviny.
- **Lesní porosty** — proti pasečnému plevelu.

Cena (2024):
- **Roundup Klasik 360 g/l** — cca 200–280 Kč/l v 20l kanystru. Dávka 3–4 l/ha.
- **Generika** (Glyfogan, Touchdown, Clinic) — 150–220 Kč/l.

Kontroverzy:
- **EU autorizace** pro glyfosát byla 2023 prodloužena o 10 let (do 2033) — proti silné lobby (Greenpeace, IARC).
- **IARC klasifikace** "pravděpodobně karcinogenní pro člověka" (2A) — kontroverzní, EU EFSA klasifikuje jako bezpečný při dodržení dávek.
- **CZ Maloobchod**: bez restrikcí.
- **Bio-zemědělství**: striktně zakázán.`,
    related: ['mezi-plodiny'],
  },

  // ── DOTACE & REGULACE ─────────────────────────────────────────────
  {
    slug: 'jednotna-zadost',
    term: 'Jednotná žádost',
    alias: ['JŽ', 'kombinovaná žádost', 'SAPS žádost'],
    kategorie: 'dotace',
    shortDef: 'Jednotná žádost je každoroční formulář podávaný na SZIF přes Portál farmáře, který sdružuje všechny přímé platby CAP — BISS, CISS, EKO, ANC, VCS i Mladý zemědělec.',
    longDef: `Jednotná žádost (JŽ) je centralizovaný způsob, jakým zemědělec žádá o přímé platby CAP. Před 2014 se podávalo víc samostatných žádostí — JŽ sjednotila proces.

Co obsahuje:
- **Identifikace žadatele** + IČO.
- **LPIS bloky** užívané — výměra, kultura, plodiny.
- **Žádost o BISS** (Základní platba) automaticky.
- **Žádost o CISS** (Redistributivní) — automaticky, pokud výměra splňuje.
- **EKO režim** — volba základní / premium + deklarace eko-praktik.
- **ANC** (méně příznivé oblasti) — automaticky dle LPIS zařazení.
- **VCS** (citlivé sektory) — deklarace ploch cukrové řepy, brambor, ovoce, zeleniny, chmele, lnu, bílkovin.
- **Mladý zemědělec** bonus — deklarace věku a roku první žádosti.
- **AEKO** smlouvy — víceletá agro-environmentální opatření.

Podání:
- **Termín**: typicky 1. dubna – 15. května (s tolerancí do 9. června s 1 % sankcí/den).
- **Místo**: elektronicky přes [Portál farmáře](https://eagri.cz/public/web/mze/farmar/portal-farmare/) — vyžaduje datovou schránku nebo certifikát.
- **Asistence**: regionální pracoviště SZIF zdarma, soukromí poradci 2 000–10 000 Kč.

Po podání:
- **Květen–červen**: SZIF kontroluje deklarace vs LPIS, satelitní monitoring (Copernicus / SISAEC).
- **Říjen–prosinec**: vyplácení (vyšší zálohy už v říjnu, doplatky v prosinci).
- **Sankce**: za nesprávnou deklaraci, překročení limitů, porušení greeningu → 1–100 % srážka.`,
    related: ['biss', 'cap-2024', 'lpis'],
  },
  {
    slug: 'aeko',
    term: 'AEKO (Agro-environmentální opatření)',
    alias: ['AEKO', 'agro-environmentální'],
    kategorie: 'dotace',
    shortDef: 'AEKO jsou víceleté (5-leté) dobrovolné smlouvy s ekologicky šetrnými praktikami — pastva, biopásy, zatravnění, sady ad. Vyšší dotace než EKO režim.',
    longDef: `AEKO (Agro-environmentálně klimatická opatření) je samostatný dotační program v CAP 2024, který odměňuje 5-leté závazky k ekologicky šetrným praktikám. Vyšší sazby než EKO režim, ale tvrdší pravidla a sankce za porušení.

Hlavní AEKO opatření v ČR 2024:
- **Ošetřování travních porostů (TTP)** — sečení v pozdějších termínech (po hnízdění ptáků), 2 100–6 000 Kč/ha podle subtypu.
- **Biopásy** — kvetoucí směsky na poli, ~10 000 Kč/ha (víc než EFA).
- **Biokoridor** — souvislé linie krajinné zeleně, 8 000 Kč/ha.
- **Ekologické zemědělství (EZ)** — certifikované bio, dodatečné sazby na hektar podle plodiny.
- **Trvalá pastva** — 2 800–5 200 Kč/ha podle ANC kategorie.
- **Vyšší zatravnění orné půdy** — převod orné na TTP, kompenzace ztracených tržeb.
- **Sady extensivních ovocných druhů** — 5 200 Kč/ha.

Pravidla:
- **5-letá smlouva** — porušení = vrácení dotace za všechny předchozí roky.
- **Inkompatibility** — některé subtypy nelze kombinovat (např. AEKO TTP + intenzivní pastva).
- **Kontrola na místě** — SZIF inspekce 5–10 % žadatelů ročně + dálkový průzkum.

Pro CZ farmáře:
- AEKO se vyplatí, pokud má zemědělec dlouhodobou strategii (zaměření na bio, krajinotvorbu, ochranu vodních zdrojů).
- Pro klasickou intenzivní farmu bývá ROI horší než EKO premium (víc paperwork, vyšší riziko sankcí).
- Žadatelům doporučujeme nejprve podat **EKO režim premium** a pak postupně přidávat AEKO subtypy podle možností.`,
    related: ['cap-2024', 'eko-platba', 'biopasy'],
  },
  {
    slug: 'gaec',
    term: 'GAEC (Dobrý zemědělský a environmentální stav)',
    alias: ['GAEC', 'kondicionality', 'cross-compliance'],
    kategorie: 'regulace',
    shortDef: 'GAEC jsou povinné minimální standardy pro každého žadatele o přímé platby CAP — pravidla pro půdu, vodu, krajinu. Porušení = sankce.',
    longDef: `GAEC (Good Agricultural and Environmental Conditions, česky Dobrý zemědělský a environmentální stav) je sada povinných standardů, které musí splnit každý žadatel o přímé platby CAP. Předtím se jim říkalo "cross-compliance" / "kondicionality".

GAEC standardy v ČR 2024:
- **GAEC 1**: Zachování trvalých travních porostů — zákaz orby TTP v Natura 2000 a celostátně nepřekročit 5% pokles z 2018.
- **GAEC 2**: Ochrana mokřadů a rašelinišť — zákaz odvodňování + omezení orby v záplavovém území.
- **GAEC 3**: Zákaz vypalování strniště — strniště lze jen mulčovat / zaorat / odstranit balíkem.
- **GAEC 4**: Ochranné pásmy podél vodotečí — min. 3 m bez hnojiv/pesticidů, podél vodárenských zdrojů 25 m.
- **GAEC 5**: Tank management proti erozi — povinné protierozní pásy / krycí plodiny na svažité orné nad určitým sklonem.
- **GAEC 6**: Minimální půdní pokryv — strniště nebo krycí plodina od 1.11. do 28.2.
- **GAEC 7**: Střídání plodin — max 75 % výměry stejnou plodinou + zákaz monokultury 4+ let.
- **GAEC 8**: Neproduktivní plochy (EFA) — min. 7 % výměry v krajinných prvcích, biopásech, meziplodinách.
- **GAEC 9**: Zákaz orby Natura 2000 lokalit.

Sankce za porušení:
- **Drobné** (1× nesplněný GAEC, opraveno do termínu): 1 % srážky.
- **Standardní**: 3 % srážky z BISS + EKO.
- **Vážné** (úmyslné porušení): 5–15 % srážky.
- **Opakované**: 5 % + ztráta jiných dotací.

Kontroly: 1–5 % žadatelů ročně formou fyzické inspekce + satelitní monitoring (Copernicus SISAEC, identifikuje porušení GAEC 5/6/7 z dálky).`,
    related: ['cap-2024', 'biss', 'mezi-plodiny'],
  },
  {
    slug: 'natura-2000',
    term: 'Natura 2000',
    alias: ['Natura', 'EVL', 'ptačí oblast'],
    kategorie: 'regulace',
    shortDef: 'Natura 2000 je evropská soustava chráněných území — v ČR cca 14 % výměry. Pro zemědělce znamená omezení (zákaz orby TTP, ochranná pásma) ale i bonusové dotace.',
    longDef: `Natura 2000 je síť chráněných území v EU, vytvořená podle dvou směrnic: o stanovištích (1992) a o ptácích (1979). Cíl: zachovat biodiverzitu klíčových ekosystémů a druhů.

Dva typy lokalit v ČR:
- **EVL** (Evropsky významné lokality) — chrání stanoviště rostlin a hmyzu, vodní toky, mokřady.
- **PO** (Ptačí oblasti) — hnízdiště a tahové cesty ohrožených druhů.

Celkem ~14 % výměry ČR. Hlavní lokality: Krkonoše, Šumava, Třeboňsko, Pálava, Beskydy, Krušné hory, Moravský kras.

Pro zemědělce:
- **Zákaz orby TTP** (trvalé travní porosty) v Natura 2000 — striktnější než celostátní GAEC 1.
- **Omezení hnojení a pesticidů** — některé EVL zákaz syntetických N, jen organické.
- **Termíny sečení** — typicky až po 15.6. (po hnízdění chřástala polního).
- **Povinný plán péče** — souhlas Správy CHKO před zásadní změnou.

Bonusové dotace:
- **AEKO subtypy** specificky pro Natura 2000 — vyšší sazby (až +30 %).
- **Kompenzační platba** za ztrátu výnosů z omezení (typicky 1 000–3 000 Kč/ha).

Konflikt: zemědělec vs Správa CHKO může být reálný — vždy si před zakoupením/nájmem půdy v Natura 2000 zkontrolujte LPIS a plán péče lokality (často kompletně mění hospodářský potenciál).`,
    related: ['cap-2024', 'lpis', 'aeko'],
  },

  // ── PŮDA & EKOLOGIE ────────────────────────────────────────────────
  {
    slug: 'organicka-hmota',
    term: 'Organická hmota v půdě',
    alias: ['humus', 'organická složka', 'humus content'],
    kategorie: 'agrotechnika',
    shortDef: 'Organická hmota (humus) je odumřelá rostlinná a živočišná hmota v půdě. Klíčový ukazatel zdraví půdy — udržuje vodu, živiny, strukturu, biodiverzitu.',
    longDef: `Organická hmota (OH) v půdě je suma rozkladu rostlinných zbytků, kořenů, mikroorganismů a živočichů. Měří se jako "obsah humusu" v % sušiny ornice.

Hodnoty v ČR:
- **CZ orná půda průměr**: 1,5–2,5 % OH (relativně nízké, dříve i 3–4 % před intenzifikací).
- **TTP / pastviny**: 4–8 % OH (vyšší díky stabilní vegetaci).
- **Lesní půda**: 8–15 % OH.
- **Černozem (jihomoravská)**: 3–4 % OH — nejlepší CZ orná půda.

Funkce OH:
- **Vodní kapacita** — 1 % OH = +15 l vody / m² zadržené v půdě.
- **Živinová rezerva** — N, P, K se uvolňuje při rozkladu.
- **Půdní struktura** — drobtovitá struktura, snadné zpracování.
- **Mikrobiologie** — bakterie, houby, půdní fauna.
- **Sekvestrace uhlíku** — 1 % zvýšení OH v 30 cm orničné vrstvě = 30 t C / ha vázáno v půdě.

Zvyšování OH:
- **Meziplodiny zaorané do půdy** — biomasa rozkladu se mění v humus.
- **Stájový hnůj** — 25–40 t/ha jednou za 3–4 roky.
- **Kompost** — pomalu uvolňuje, dlouhý efekt.
- **Bezorebné technologie (no-till)** — méně narušuje strukturu, OH se akumuluje.
- **TTP rotace** — pokud část výměry rotuje na TTP, OH dramaticky stoupá.

Pokles OH:
- **Intenzivní orba** — provzdušňuje, urychluje rozklad → ztráta OH.
- **Monokultury** — neudržitelné dlouhodobě.
- **Eroze** — odplaveno s nejhornější ornicí.`,
    related: ['mezi-plodiny', 'pH-pudy'],
  },
  {
    slug: 'eroze-pudy',
    term: 'Eroze půdy',
    alias: ['vodní eroze', 'větrná eroze', 'ztráta ornice'],
    kategorie: 'agrotechnika',
    shortDef: 'Eroze půdy je proces, kdy voda (déšť, povodeň) nebo vítr odnáší ornici z pole. V ČR ohroženo cca 50 % orné půdy — hlavní příčina ztráty produktivity.',
    longDef: `Eroze půdy je přírodní proces, který intenzivní zemědělství dramaticky urychluje. Dva hlavní typy v ČR:

**Vodní eroze** (dominantní):
- Déšť uvolní agregáty půdy → splach se stéká po svahu → ztráty 2–50 t ornice/ha/rok.
- Nejvíce ohrožené: svažité pole nad 8°, dlouhé pozemky, řepka/cukrovka v širokých řádcích.
- Po extrémních deštích (50+ mm/h) v jednom dni ztráta i 100+ t/ha — viditelné rýhy.

**Větrná eroze**:
- Sušší jižní Morava (Hodonínsko, Břeclav, Znojmo) — větry odnáší jemné částice.
- Ztráty 1–10 t/ha/rok, méně dramatické ale konstantní.

Důsledky:
- **Ztráta nejúrodnější vrstvy** (ornice 0–30 cm má nejvíce OH a živin).
- **Snížení výnosů** dlouhodobě 5–25 %.
- **Eutrofizace vod** — splavený fosfor → květ řas v Brněnské přehradě, Vranově atd.
- **Zaplavení obcí** — bahno z polí ucpává kanalizace.

Ochrana proti vodní erozi (povinná podle GAEC 5):
- **Protierozní pásy** — pásy plodin střídavě s TTP/meziplodinou napříč svahem.
- **Strip-till / no-till** — bez orby, kořeny drží půdu.
- **Konturní orba** — orba podél vrstevnic, ne po spádnici.
- **Meziplodiny** přes zimu — povinné na erozně ohrožených DPB.
- **Vegetační pásy** podél vodotečí.

Pokud zemědělec nesplní GAEC 5 → 3–15 % sankce z BISS + EKO.`,
    related: ['mezi-plodiny', 'organicka-hmota', 'gaec'],
  },

  // ── DALŠÍ TECHNICKÉ ────────────────────────────────────────────────
  {
    slug: 'allwheel-drive',
    term: 'Pohon 4×4 / Pohon všech kol',
    alias: ['MFWD', 'Mechanical Front Wheel Drive', '4WD'],
    kategorie: 'technologie',
    shortDef: 'Pohon 4×4 (MFWD) přidává pohon na přední nápravu — zvyšuje tažnou sílu, snižuje prokluz, lepší v rozbahněném terénu. Standard u 95 % moderních traktorů.',
    longDef: `Pohon 4×4 u traktorů (technicky **MFWD** = Mechanical Front Wheel Drive) přidává pohon na přední řízenou nápravu. Standard u všech traktorů s výkonem nad 50 koní od 90. let.

Konstrukce:
- **Mechanický náhon** přes dlouhý hřídel z převodovky k přední diferenciálu.
- **Spojka** v náboji nebo v diferenciálu — řidič může 4×4 vypnout (pro silniční jízdu šetří palivo + zamezí "vrtění" na rovných cestách).
- **Stejně velká kola** vpředu i vzadu u tzv. **isodiametric** traktorů (rovněž zvané "Trike" — Fendt 1000, JD 9R) — zajistí dokonalou trakci, ale nutno rezervovat pozemek pro velký zatáčecí poloměr.

Diference od osobního auta 4×4:
- **Traktorová přední náprava** je výrazně vyšší a robustnější (kvůli velkým kolům).
- **Přední diferenciál** typicky bez aktivního omezení (žádný Torsen / haldex).
- **Diferenciální uzávěrka** zadní + přední — řidič zapne pro maximální trakci v blátě.

Výhody:
- **+25–40 % tažné síly** vs jen zadní pohon.
- **Lepší stoupavost** — důležité pro horské pastviny a lesní práce.
- **Méně prokluz** — méně utužení půdy + úspora paliva při těžkém tahu.

Nevýhody:
- **Vyšší pořizovací cena** o 100–300 tis. Kč vs 2×4 verze (které dnes téměř neexistují).
- **Více součástí na servis** — kardany, diferenciál, dvě sady kol.
- **Vyšší spotřeba** na silnici (proto možnost vypnutí).`,
    related: ['cvt-prevodovka', 'tribod'],
  },
  {
    slug: 'duala',
    term: 'Duals / Dvojmontáž',
    alias: ['dvojmontáž kol', 'duals'],
    kategorie: 'technologie',
    shortDef: 'Dvojmontáž (duals) je sada dvou kol na každé nápravě (celkem 4 zadní + 4 přední) — snižuje tlak na půdu, zvyšuje plovavost, používá se u flagship traktorů.',
    longDef: `Dvojmontáž (duals, dual wheels) znamená montáž dvou kol vedle sebe na každé nápravě místo jednoho. U traktoru nad 250 koní téměř povinné pro polní práce.

Princip: dvě kola = 2× větší kontaktní plocha → polovina měrného tlaku na půdu. Při hmotnosti 12 t traktoru bez duals je tlak 1,5–2 bar/cm² (utužující), s duals klesá na 0,7–1 bar/cm² (akceptovatelné).

Použití:
- **Velké traktory 250+ koní** — Fendt 900/1000, JD 8R/9R, NH T9, Case Steiger.
- **Sady kol** — duals jen pro polní práce, demontáž pro silniční přepravu (širší než 2,55 m → překračuje EU normu pro veřejné komunikace).
- **Trojnásobná montáž (triples)** u superflagship 600+ koní traktorů (rare v Evropě, běžné v USA).

Cena:
- **Duals adaptéry + ráfky + pneumatiky** typicky 250 000–500 000 Kč pro 4× zadní.
- **Triples** 1 000 000+ Kč.

Pozor: provoz s duals na silnici v EU = pokuta 5 000–20 000 Kč + ukončení jízdy. Vždy montáž jen těsně před vyjetím na pole, demontáž po dokončení. U flagship farem řeší rychlospojkami za 5–15 minut.`,
    related: ['allwheel-drive'],
  },

  // ── DALŠÍ KOMBAJNY & SKLIZEŇ ────────────────────────────────────────
  {
    slug: 'rotor-kombajn',
    term: 'Rotor / Rotorový kombajn',
    alias: ['axial-flow', 'tangenciální', 'rotorová mlátička'],
    kategorie: 'technologie',
    shortDef: 'Rotorový kombajn (axial-flow) využívá podélný rotor místo klasického válcového mlátu — vyšší propustnost, menší poškození zrna, vyšší výkon.',
    longDef: `Klasická sklízecí mlátička má **válcový mlat** (klasický cylindr s lopatkami) a **vytřásadla** pro separaci slámy. Rotorový kombajn nahrazuje obojí jedním **podélným rotorem** (axial-flow), kterým prochází celý slámový tok.

Výhody rotoru:
- **+15–25 % propustnost** ve sklizni vs válcový mlat stejné velikosti.
- **Méně poškození zrna** — měkčí mlátění (delší dráha, nižší rázy).
- **Lepší separace** za vlhkých podmínek (po dešti, ranní rosa).
- **Jednodušší údržba** — méně součástí, méně klínových řemenů.

Nevýhody:
- **Vyšší spotřeba paliva** — rotor potřebuje víc energie.
- **Horší v dlouhé slámě** — pokud chcete kvalitní stéblovou slámu pro balíky, tradiční mlat dělá lepší.
- **Vyšší pořizovací cena** o 10–20 % vs ekvivalentní válcový mlat.

Hlavní rotorové značky:
- **Case IH Axial-Flow** — průkopník (od 1977), dnes dominantní v USA.
- **John Deere S-Series** (od 2012) — single rotor.
- **New Holland CR** — twin rotor (dva paralelní rotory).
- **Fendt IDEAL** — dual helix rotor.
- **Claas Lexion** — APS Hybrid (kombinace válcového mlatu + akcelerace + rotorové separace) — kompromis.

V CZ: rotor preferuje 40 % farmářů, válcový 60 % (kvůli slámě a nižší ceně). Pro typickou farmu < 300 ha stačí klasický válcový.`,
    related: ['kombajn-trida', 'mlatecka'],
  },
  {
    slug: 'kombajn-trida',
    term: 'Třída kombajnu',
    alias: ['Class', 'Klassen'],
    kategorie: 'technologie',
    shortDef: 'Třída kombajnu (I–X+) je klasifikace velikosti a výkonu — vychází z plochy mlátícího bubnu a počtu vytřásadel. Vyšší třída = vyšší propustnost.',
    longDef: `Třída sklízecí mlátičky je evropská klasifikace dle propustnosti a velikosti mlátícího ústrojí. Vychází hlavně z **plochy mlátícího bubnu** a **počtu vytřásadel** (u klasických) nebo **velikosti rotoru** (u rotorových).

Přibližný přehled:
- **Třída III**: 100–120 kW (135–160 k), záběr 4 m, zásobník 4 500 l.
- **Třída IV**: 120–155 kW (160–210 k), záběr 4,5–5 m, zásobník 5 500 l.
- **Třída V**: 155–185 kW (210–250 k), záběr 5–6 m, zásobník 6 500 l.
- **Třída VI**: 185–230 kW (250–310 k), záběr 6–7,5 m, zásobník 7 500 l.
- **Třída VII**: 230–270 kW (310–365 k), záběr 7,5–9 m, zásobník 9 000 l.
- **Třída VIII**: 270–330 kW (365–445 k), záběr 9–10,5 m, zásobník 10 500 l.
- **Třída IX**: 330–400 kW (445–540 k), záběr 10,5–12 m, zásobník 12 000 l.
- **Třída X / X+**: 400+ kW (540+ k), záběr 12–18 m, zásobník 14 000+ l.

Pro CZ farmu:
- **50–200 ha obilí**: třída IV–V (Claas Avero, JD T560, Case 5140).
- **200–500 ha**: třída VI–VII (Claas Tucano, JD T670, NH CX5/CX7).
- **500–1500 ha**: třída VIII–IX (Claas Lexion 7000/8000, JD S780, Fendt IDEAL 8).
- **1500+ ha nebo sklizňový podnik**: třída X (Claas Lexion 8900, JD X9, Fendt IDEAL 10T).

Vyšší třída neznamená automaticky lepší — je to question of capacity. Předimenzovaný kombajn = neefektivní využití kapitálu.`,
    related: ['rotor-kombajn'],
  },
  {
    slug: 'header',
    term: 'Hederové žací zařízení',
    alias: ['header', 'žací stůl', 'cutting bar'],
    kategorie: 'technologie',
    shortDef: 'Hederové žací zařízení (header) je přední část kombajnu — žací stůl, který stříhá plodinu a dopravuje ji do mlátu. Záběr 4–18 m podle třídy kombajnu.',
    longDef: `Hederové žací zařízení (header) je modulární přední nástavec sklízecí mlátičky. Existují **specializované hedery pro různé plodiny**:

**Obiloviny / řepka** (universal grain header):
- Záběr 4–18 m podle třídy kombajnu.
- Variabilní lišta (Vario) pro řepku — prodloužení o 70–90 cm pro úzké řezání drobnozrnných plodin.
- Cena 0,8–4 mil. Kč nový, ojetý 50 % ceny.

**Kukuřice** (corn header):
- 4-6-8-12 řádkové verze.
- Hrubě upravený stůl s lapači, ne klasická lišta.
- Cena 1,2–3,5 mil. Kč.

**Pickup** (pro siláž z řádku, pre-sklizeň):
- Sbírá řádky ze pole, žádné nové řezání.
- Specifický pro travní senáže.

**Sunflower header** (slunečnice):
- Snapping rolls — odřezává hlavičku.
- Vzácný v CZ, jen pro specialisty.

Pravidla pro výběr:
- **Záběr = 0,4× kombajn třída** (Třída V = 4,5–5 m header).
- **Vyšší záběr ≠ vyšší výkon** — pokud kombajn nemá kapacitu na propustnost, larger header jen zpomalí.
- **Transport** — všechny hedery nad 7 m vyžadují **rozkládací systém** nebo **vozík** pro silniční přepravu (záběr přes 2,55 m je nelegální bez záboru).

Mnoho farmářů má dva hedery: **obilný + kukuřičný** s rychlospojkou (5–10 minut výměna).`,
    related: ['kombajn-trida', 'rotor-kombajn'],
  },

  // ── DALŠÍ AGROTECHNIKA ─────────────────────────────────────────────
  {
    slug: 'orba',
    term: 'Orba',
    alias: ['hluboké zpracování', 'plow', 'orání'],
    kategorie: 'agrotechnika',
    shortDef: 'Orba je hluboké obracení půdy pluhem do hloubky 20–35 cm. Tradiční základ podzimního zpracování — narušuje strukturu, ničí plevele, zaorá organickou hmotu.',
    longDef: `Orba je nejtradičnější způsob zpracování půdy — pluh řeže a obrací 20–35 cm silnou vrstvu ornice. V ČR dominantní metoda od 19. století.

**Typy pluhů**:
- **Nesený pluh** — připevněn tříbodem, lehčí (do 4 radlic).
- **Polonesený / tažený** — větší pluhy 5–12 radlic, opora kola.
- **Variopluh** — proměnný záběr radlic za jízdy.
- **Otočný pluh (reverse)** — obrátí radlice = orá oběma směry, žádné mezery v pásu.

**Hloubka orby**:
- **Mělká (15–20 cm)** — pro letní zpracování po sklizni.
- **Střední (20–28 cm)** — standard pro podzimní orbu pod ozimy.
- **Hluboká (28–35 cm)** — proti utužení podorničí, výjimečně 1× za 3–5 let.

**Spotřeba** pluhu (orientačně):
- 3-radlový pro 100 koní traktor: 12–18 l nafty/ha.
- 5-radlový pro 200 koní: 18–25 l nafty/ha.
- 8-radlový pro 350 koní: 22–30 l nafty/ha.

**Trendy proti orbě**:
- **No-till** / bezorebné — žádná orba, jen secí stroj přímo do strniště. Šetří palivo (5–10 l/ha) ale vyžaduje vyšší dávky herbicidů.
- **Min-till** (minimum tillage) — jen mělké zpracování (5–15 cm) místo orby. Kompromis.
- **Strip-till** — orba jen v řádcích, mezerydry zůstanou nedotknuté.

V CZ aktuálně 60 % orby, 30 % min-till, 10 % no-till.`,
    related: ['mezi-plodiny', 'eroze-pudy'],
  },
  {
    slug: 'no-till',
    term: 'No-till / Bezorebné zpracování',
    alias: ['direct drilling', 'přímé setí'],
    kategorie: 'agrotechnika',
    shortDef: 'No-till (bezorebné zpracování) vynechává orbu — secí stroj seje přímo do strniště. Šetří palivo, chrání půdu před erozí, ale vyžaduje vyšší dávky herbicidů.',
    longDef: `No-till je metoda zpracování půdy, která **úplně vynechává orbu** i jiné hluboké narušení půdy. Sázení (osiva) probíhá přímo do strniště předchozí plodiny pomocí **disko-secího stroje** nebo **dlátového secího**.

Výhody:
- **Úspora paliva 50–80 %** vs konvenční orba.
- **Méně eroze** — povrch zůstává krytý, půda neodplavovaná.
- **Vyšší obsah organické hmoty** — strniště + kořeny se rozkládají v půdě.
- **Lepší zadržování vody** — vyšší kapilarita.
- **Méně práce** — 1 operace místo 3–5 (orba + smyk + brány + setí).

Nevýhody:
- **Vyšší dávky herbicidů** — bez orby plevele nezničí, kompenzace glyfosátem.
- **Pomalejší prohřátí půdy na jaře** — strniště drží chlad.
- **Riziko půdních chorob** — patogenní zbytky ze strniště.
- **Nutnost specializovaného secího stroje** — Horsch Avatar / Maestro, Väderstad Rapid, John Deere 750A. Cena 1,5–4 mil. Kč.

V CZ:
- Hlavně **Jižní Morava + Vysočina** (suché oblasti) — no-till funguje nejlépe v aridních podmínkách.
- **Severní Čechy + horské oblasti** — orba dominantní (chladnější, vlhčí klima).
- **EU subvence** preferují no-till přes EKO režim — premium 1100 Kč/ha navíc.

Doporučujeme zkusit no-till na **části pole 2–3 sezóny** před plnou konverzí — výnosy mohou v prvním roce klesnout o 5–10 %, ale stabilizují se a dlouhodobě (5+ let) výrazně rostou.`,
    related: ['orba', 'eroze-pudy'],
  },
  {
    slug: 'pre-emergence',
    term: 'Pre-emergence postřik',
    alias: ['pre-emergent', 'před vzejitím'],
    kategorie: 'agrotechnika',
    shortDef: 'Pre-emergence postřik se aplikuje na pole po setí, ale před vzejitím plodiny i plevele. Zničí klíčící plevele dřív, než vyrostou — klíčový pro čistý lán.',
    longDef: `Pre-emergence (pre-em, "před vzejitím") je herbicidní strategie aplikace přípravků **po setí, ale před vzejitím plodiny i plevele**. Cílí na klíčící plevele v kritické fázi růstu.

**Hlavní účinné látky**:
- **Pendimethalin** (Stomp) — pro obiloviny, řepku, slunečnici.
- **Prosulfocarb** (Defi) — proti psárce v obilovinách.
- **Metribuzin** — pro brambory, sóju.
- **S-Metolachlor + Mesotrione** — pro kukuřici.

**Timing**:
- **0–7 dní po setí** — záleží na rychlosti vzcházení.
- **Půda musí být vlhká** — sucho = pre-em nefunguje (látka nepronikne k semenům plevele).
- **Bez deště do 2 dnů** ideální — déšť by mohl smýt látku.

Dávkování typicky 2–4 l/ha. Cena 200–600 Kč/ha za pre-em ošetření.

**Výhody**:
- **Zničí 70–90 % plevele** dřív, než vyklíčí.
- **Snižuje nutnost post-em (potlivém) postřiku** — méně chemie celkově.
- **Plodina vzejde do "čistého" pole** — vyšší výnos.

**Omezení**:
- **Selekce odolných plevelů** — opakované pre-em vede k rezistenci (zejména psárka, hnězdovka, břím v obilovinách).
- **Citlivost na sucho** — bez deště ošetření selže.
- **Některé plodiny špatně snášejí** — řepka je citlivá na pendimethalin.

Pro CZ farmáře: pre-em je standard u řepky a obilovin. U jařin (sója, kukuřice) volba mezi pre-em a post-em.`,
    related: ['orba', 'roundup'],
  },
  {
    slug: 'osevni-postup',
    term: 'Osevní postup',
    alias: ['rotace plodin', 'crop rotation', 'střídání plodin'],
    kategorie: 'agrotechnika',
    shortDef: 'Osevní postup je plánované střídání plodin na poli v různých letech. Klíčový princip udržitelného zemědělství — zlepšuje půdu, snižuje plevele a choroby.',
    longDef: `Osevní postup je systematické střídání plodin na stejném pozemku v různých letech. Tradiční zemědělství základ — vědělo se to už ve středověku ("3-pole systém": ozim → jařina → úhor).

**Typický CZ osevní postup** (čtyřletý):
1. **Řepka** (ozim) — zlepšuje strukturu, hluboký kořen.
2. **Pšenice ozimá** — standardní cash crop.
3. **Cukrovka nebo brambory** — okopanina, narušuje plevele.
4. **Jarní obilí (ječmen) nebo kukuřice** — uzavírá cyklus.

Někdy přidáno **5. místo: vojtěška / jetel** (3 roky bez výsevu, regeneruje půdu, váže dusík).

**Principy**:
- **Nestavět stejnou plodinu po sobě** — riziko chorob (např. fuzariózy v pšenici).
- **Střídat hluboký + mělký kořen** — řepka (hluboko) + obilí (mělko).
- **Zařadit luskovinu** — sója, hrách, vikve = fixují dusík, šetří hnojivo.
- **Okopanina (cukrovka, brambory)** = "čistič" — narušuje cykly plevele.

**CAP 2024 pravidla**:
- **GAEC 7**: zákaz monokultury 4+ let za sebou.
- Maximum 75 % výměry stejnou plodinou v jednom roce.
- **EKO premium** vyžaduje **min. 4 různé plodiny** na orné půdě.

**Konsekvence porušení**:
- **Kratší rotace** (např. pšenice → pšenice → kukuřice → pšenice) = vyšší výnosy krátkodobě, ale za 5–10 let pokles výnosů o 15–25 % kvůli půdním chorobám.
- **Monokultura kukuřice** (extrém v USA, sporadicky CZ): vyžaduje masivní hnojení + insekticidy.

Dobrý osevní postup je **nejlepší zemědělská praktika "zdarma"** — bez chemie, jen plánováním plodin.`,
    related: ['mezi-plodiny', 'eko-platba', 'gaec'],
  },

  // ── PRECISE FARMING DALŠÍ ──────────────────────────────────────────
  {
    slug: 'section-control',
    term: 'Section Control',
    alias: ['automatické vypínání sekcí', 'TC-SC'],
    kategorie: 'precise-farming',
    shortDef: 'Section Control je GPS-řízené automatické vypínání sekcí postřikovače / sečky / secího stroje v souvratích, překrytí nebo v už ošetřených pásech. Šetří 5–15 % chemie/osiva.',
    longDef: `Section Control (technicky **TC-SC** v ISOBUS — Task Controller Section Control) je systém automatického vypínání jednotlivých sekcí (částí) nářadí podle GPS pozice a předchozí stop pokryvu.

**Aplikace**:
- **Postřikovač** — 12–24 m rameno rozděleno na 6–24 sekcí, každá se vypne samostatně. V souvratích, na klínu, na zužujícím se konci pole.
- **Secí stroj** — vypínání řádků v souvratích, kde už osivo padlo.
- **Rozmetadlo hnojiv** — variabilní výsek pásu hnojiva podle pozice.

**Princip**:
1. RTK GPS přijímač pozice ±2 cm.
2. ISOBUS TC-SC zaznamenává **as-applied map** — kde bylo aplikováno.
3. Při dalším průjezdu (souvrať, klín) systém vypne sekce, které by aplikovaly do už pokrytého pásu.

**Úspora**:
- **Postřikovač**: 5–15 % chemie/sezónu (záleží na tvaru pole — pravidelný čtverec 5 %, nepravidelná pole 15+ %).
- **Hnojivo**: 5–10 %.
- **Osivo**: 3–8 %.

**ROI** (orientačně, pro farmu 200 ha):
- Cena Section Control retrofit: 80 000–250 000 Kč.
- Úspora chemie 2 500 Kč/ha × 0,1 (10 %) = 250 Kč/ha × 200 ha = 50 000 Kč/rok.
- ROI: 1,5–5 let.

**Aktuálně**:
- Standard u velkých moderních postřikovačů (Amazone UX, Horsch Leeb, Dammann).
- ISOBUS TC-SC licence typicky 20–60 tisíc Kč u traktoru.
- Retrofit u starých postřikovačů 100–200 tis. Kč.`,
    related: ['isobus', 'gps-rtk', 'variable-rate'],
  },

  // ── EKONOMIKA & TRH ────────────────────────────────────────────────
  {
    slug: 'leasing-vs-uver',
    term: 'Leasing vs úvěr',
    alias: ['operativní leasing', 'finanční leasing'],
    kategorie: 'dotace',
    shortDef: 'Leasing a úvěr jsou dvě cesty financování traktoru. Leasing = pronájem s opcí odkupu na konci, úvěr = bankovní půjčka. Liší se DPH, vlastnictvím a flexibilitou.',
    longDef: `**Finanční leasing** = pronájem s povinnou opcí odkupu na konci (typicky za 1–5 % zbytkové ceny).

**Operativní leasing** = pronájem bez opce, na konci stroj vracíte. Vhodný pro krátké období (3–5 let), bez starostí o prodej.

**Bankovní úvěr** = klasická půjčka, stroj je hned váš, ručíte zástavou.

| | Finanční leasing | Operativní leasing | Bankovní úvěr |
|---|---|---|---|
| **Vlastnictví během** | leasingovka | leasingovka | vy (zástava bance) |
| **Vlastnictví po splacení** | vy | leasingovka | vy |
| **DPH** | rozložené po splátkách | jen na splátky (vždy) | celé předem |
| **Akontace** | 0–30 % | 0–30 % | 0–20 % |
| **Sazba (2026)** | 5,5–8 % p.a. | 6–9 % p.a. | 5–7 % p.a. |
| **Doba** | 24–84 měs | 24–60 měs | 12–96 měs |
| **Flexibilita** | nízká (penalty za předčasné ukončení) | nízká | vyšší (refinancování) |

**Pro CZ farmáře**:
- **Finanční leasing** je standard pro 70 % nákupů — předvídatelnost splátek, daňová optimalizace.
- **Úvěr** se vyplatí pro **drahé stroje 5+ mil. Kč** s vysokou akontací — nižší celkový úrok.
- **Operativní leasing** je výjimečný — vhodný pro **podnikatele v sklizňových službách** kde stroj 5 let intenzivně využívá a pak vrací.

**Captive financování značky** (John Deere Financial, AGROTEC FS, AGRI CS Finance):
- Často akční sazby 4–6 % na nové stroje vlastní značky.
- Spojené s prodejcem — výhodné kombinovat s slevou na ceně stroje.
- Pro ojeté stroje obvykle vyšší sazby než univerzální banky.

→ [Kalkulačka leasingu traktoru](/kalkulacka/leasing-traktoru/) pro orientační výpočet měsíční splátky.`,
    related: ['cap-2024'],
  },

  // ── BEZPEČNOST & REGULACE ────────────────────────────────────────────
  {
    slug: 'rolnicke-pravidla-silnicni',
    term: 'Silniční pravidla pro traktory',
    alias: ['STK traktoru', 'značení šíře', 'doprava na poli'],
    kategorie: 'regulace',
    shortDef: 'Traktor na veřejné silnici v CZ podléhá pravidlům: max šíře 2,55 m bez záboru, výška 4 m, povinné značení nářadí, STK 1× za 2 roky.',
    longDef: `Provoz traktoru na veřejné silnici v ČR je regulován **zákonem 361/2000 Sb.** a **vyhláškou 341/2002 Sb.**

**Maximální rozměry bez záboru veřejné komunikace**:
- **Šířka**: 2,55 m (vyjímky pro zem. stroje 3 m, nad to nutný zábor).
- **Výška**: 4 m (kabina + výfuk + výrobou nainstalované doplňky).
- **Délka traktor + náves/nářadí**: 12 m (samostatný traktor), 16,5 m s návěsem.

**Pokud překračujete** (širší nářadí, dvojmontáž, hluboké pluhy):
- **Doprovodné vozidlo** s blikajícími signalisty.
- **Zábor silnice** povolovaný policií, max 2 hodiny + plán objížďky.
- Pokuta za nesplnění: 5 000–50 000 Kč.

**Značení nářadí**:
- **Tabulky 423 × 423 mm** s žlutými / červenými pásy na okrajích širokého nářadí.
- **Reflexní pásy** v noci nebo za snížené viditelnosti.
- **Blikající žluté světlo** povinné pro stroje širší 2,55 m.

**STK (Stanice technické kontroly)**:
- **Traktor s SPZ**: STK 1× za 2 roky.
- **Bez SPZ** (jen pole): bez STK, ale provoz na silnici zakázán (i 10 m mezi sousedními poli).
- **Test**: brzdy, světla, ozvučení (klakson), výfukový systém, kabina, sedadlo.

**Řidičský průkaz**:
- **T (traktor)** — od 17 let, povinný pro práci na poli i převoz.
- **B (osobní)** — některé malé traktory do 50 km/h a do 7,5 t s B-čkem (kontroverze, vyžaduje upřesnění v RP).

**Pojištění**:
- **Povinné ručení** — i pro práci na poli (cca 4 000–12 000 Kč/rok).
- **Havarijní** — volitelné, doporučené pro nové stroje (3–5 % z ceny ročně).`,
    related: ['allwheel-drive', 'duala'],
  },

  // ── PLODINY ─────────────────────────────────────────────────────────
  {
    slug: 'ozim-jarin',
    term: 'Ozimy vs jařiny',
    alias: ['ozim', 'jařina', 'autumn vs spring crops'],
    kategorie: 'agrotechnika',
    shortDef: 'Ozim se vysévá na podzim, jařina na jaře. Ozim využije zimní vlhko, dá vyšší výnosy. Jařina je kratší cyklus, vyšší riziko sucha.',
    longDef: `Plodiny dělíme podle období setí:

**Ozimy** (sejou se na podzim, září–říjen):
- **Pšenice ozimá** — dominantní CZ obilí, 60 % výměry obilovin.
- **Ječmen ozimý** — pro pivovary, vyšší výnos než jarní.
- **Řepka ozimá** — strategická olejovina, výnos 3,5–4,5 t/ha.
- **Žito ozimé** — pro chleba a krmiva, snáší slabší půdy.
- **Tritikále** — kříženec pšenice + žita, robustní.

Výhody ozimů:
- Zimní vlhkost = stabilnější výnos.
- Dřívější sklizeň (červenec) = uvolnění plochy pro meziplodiny.
- Vyšší celkový výnos vs jařina (o 15–30 %).

Rizika:
- **Vymrznutí** v tuhé zimě bez sněhové pokrývky.
- **Hlemýždí** napadení v podzimní vlhkém měsíci.

**Jařiny** (sejí se na jaře, březen–duben):
- **Ječmen jarní** — pro pivovary kvalitnější (sladovnický).
- **Pšenice jarní** — okrajová, jen kde ozim vymrzl.
- **Kukuřice** — letní zrnové i siláž.
- **Sója, slunečnice** — letní olejoviny.
- **Brambory, cukrovka** — okopaniny.
- **Hrách, vikev** — luskoviny.

Výhody jařin:
- Krátký cyklus (3–4 měsíce).
- Možnost reagovat na trh (sejete podle aktuálních cen).
- Méně riziko zimního vymrznutí.

Rizika:
- **Sucho** v květnu–červnu = nízké výnosy.
- **Vyšší koncentrace prací** v krátkém období.

Pro CZ farmu je standardní **70 % ozimy + 30 % jařiny**.`,
    related: ['osevni-postup', 'orba'],
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
