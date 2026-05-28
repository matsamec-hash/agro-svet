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
  | 'technologie' | 'pohon' | 'hnojivo' | 'dotace' | 'agrotechnika' | 'regulace' | 'precise-farming' | 'jednotky' | 'historie' | 'chov' | 'slang' | 'ochrana' | 'plodiny';

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

  // ── JEDNOTKY & MĚŘENÍ ───────────────────────────────────────────────
  {
    slug: 'hektar',
    term: 'Hektar (ha)',
    alias: ['ha', 'jednotka plochy'],
    kategorie: 'jednotky',
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
    related: ['ar', 'akr', 'metr-ctvrecni', 'kilometr-ctvrecni', 'q-cent', 'cap-2024'],
  },
  {
    slug: 'q-cent',
    term: 'Cent (q)',
    alias: ['q', 'metrický cent', 'kvintál'],
    kategorie: 'jednotky',
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
    related: ['tuna', 'kilogram', 'hektolitr', 'busl', 'hektar'],
  },
  {
    slug: 'ar',
    term: 'Ar (a)',
    alias: ['a', 'sto metrů čtverečních'],
    kategorie: 'jednotky',
    shortDef: 'Ar (a) je jednotka plochy = 100 m² = čtverec 10 × 10 m. 100 arů = 1 hektar. Používá se pro zahrady, parcely a malé pozemky v katastru nemovitostí.',
    longDef: `Ar je jednotka plošného obsahu, odvozená od latinského *area*. 1 ar = 100 m² = čtverec o straně 10 m. V soustavě SI je ar (a) přijímaná jednotka mimo SI, přípustná pro pozemkovou agendu.

Převody:
- **1 a = 100 m²**
- **1 a = 0,01 ha** (100 a = 1 ha)
- **1 a = 0,0001 km²**
- **1 a ≈ 0,0247 akru** (akr ≈ 40,47 a)

V ČR se ar používá především v:
- **Katastru nemovitostí** — výměry zahrad, stavebních parcel a malých zemědělských pozemků se obvykle zapisují v m² nebo v ha, ale starší zápisy a běžná řeč („zahrada 8 arů") ar drží.
- **Drobné zemědělství** — pěstitelské pásy, ovocné sady, vinice malých vinařů.
- **Daň z nemovitých věcí** — sazby se počítají z m², ale rolníci si plochu typicky pamatují v arech.

Praktická přirovnání:
- **Tenisový dvorec** (single, 23,77 × 8,23 m) ≈ 2 ary
- **Olympijský bazén** (50 × 25 m) = 12,5 a
- **Fotbalové hřiště** (105 × 68 m) ≈ 71 a (= 0,71 ha)
- **Průměrná česká zahrada u rodinného domu** = 4–10 a

Historicky byl ar zaveden ve Francii v roce 1795 jako součást metrické soustavy. V CZ/SK kontextu nahradil dřívější jednotky jako **korec** (≈ 28 a) a **strych** (≈ 28–32 a) — viz [[korec]], [[strych]].`,
    related: ['hektar', 'metr-ctvrecni', 'korec', 'strych'],
  },
  {
    slug: 'akr',
    term: 'Akr (acre)',
    alias: ['acre', 'akre', 'anglický akr'],
    kategorie: 'jednotky',
    shortDef: 'Akr (acre) je anglosaská jednotka plochy = 4 046,86 m² = 0,4047 hektaru. Standardní jednotka v USA, UK, Kanadě a Austrálii pro zemědělské pozemky.',
    longDef: `Akr (anglicky *acre*) je tradiční anglosaská jednotka plošného obsahu, dnes přesně definovaná jako **4 046,8564224 m²** (mezinárodní akr). V USA a UK je dodnes dominantní jednotkou pro zemědělské pozemky a real estate.

Přesné převody:
- **1 akr = 4 046,86 m²**
- **1 akr = 0,4047 ha** (≈ 40,5 a)
- **1 akr = 40,4686 a**
- **1 hektar = 2,4711 akru**
- **1 mile² = 640 akrů** (1 section v US township systému)

Původ jednotky: středověký akr byl plocha, kterou jeden muž s párem volů zorá za den — proto délka **1 furlong × šířka 1 chain** (220 yardů × 22 yardů = 4 840 yard²).

Praktické použití:
- **USA**: průměrná farma 2026 ≈ 446 akrů (≈ 180 ha). Velké průmyslové farmy 10 000+ akrů.
- **UK**: typická anglická farma 88 ha = 217 akrů.
- **Půdní fondy / investice**: americké zemědělské pozemky se obchodují v USD/akr (typicky $4–10 tis./akr v Midwestu).
- **Komodit price**: USDA yields publikuje v bushel/akr — pšenice ~50 bu/ac, kukuřice ~175 bu/ac.

Pro CZ farmáře relevantní při:
- **Pronájmu zahraničních pozemků** (zejm. SK, AT, DE pohraničí — viz [[morgen]]).
- **Importu USDA dat** o světových výnosech (přepočet bu/ac → t/ha: bušl × 0,02489 = t/ha).
- **Prodeji do USA** (export komodit).

Pozor: existují i regionální varianty — *scottish acre* (5 080 m²), *irish acre* (6 555 m²) — dnes obsoletní, ale stále v některých starých zápisech.`,
    related: ['hektar', 'morgen', 'busl', 'metr-ctvrecni'],
  },
  {
    slug: 'metr-ctvrecni',
    term: 'Metr čtvereční (m²)',
    alias: ['m²', 'm2', 'čtverečný metr'],
    kategorie: 'jednotky',
    shortDef: 'Metr čtvereční (m²) je základní jednotka plochy v SI = čtverec 1 × 1 m. 10 000 m² = 1 hektar. Univerzální jednotka pro stavby, parcely, byty.',
    longDef: `Metr čtvereční (m², někdy psáno m2 nebo „čtvereční metr") je odvozená jednotka plošného obsahu v soustavě SI. 1 m² = plocha čtverce o straně 1 metr.

Převody na další jednotky plochy:
- **1 m² = 0,01 a** (100 m² = 1 ar)
- **1 m² = 0,0001 ha** (10 000 m² = 1 hektar)
- **1 m² = 0,000001 km²** (1 000 000 m² = 1 km²)
- **1 m² ≈ 10,764 sq ft** (čtvereční stopa, USA/UK)
- **1 m² ≈ 1,196 sq yd** (čtvereční yard)

Použití v zemědělství a real estate:
- **Stavební parcely** — katastr nemovitostí eviduje pozemky v m² (oficiální zápis).
- **Sazby daně z nemovitých věcí** — počítá se v Kč/m² podle typu pozemku.
- **Skleníky a fóliovníky** — kapacita se uvádí v m² pěstební plochy.
- **Drůbež a chovy** — minimální plocha na zvíře (welfare normy) v m²/kus.
- **Skladovací haly** — silážní jámy, seníky, mechanizační dvory v m².

Praktická přirovnání:
- **Parkovací místo**: 12,5 m² (2,5 × 5 m)
- **Malý byt 1+kk**: 25–35 m²
- **Velký byt 4+1**: 100–130 m²
- **Tenisový dvorec**: 261 m² (single)
- **Fotbalové hřiště**: 7 140 m² (≈ 0,71 ha)

Pro převod větších ploch na hektary stačí dělit 10 000:
- 5 000 m² = 0,5 ha
- 25 000 m² = 2,5 ha
- 500 000 m² = 50 ha

Viz též [[ar]] (= 100 m²), [[hektar]] (= 10 000 m²), [[kilometr-ctvrecni]] (= 1 000 000 m²).`,
    related: ['ar', 'hektar', 'kilometr-ctvrecni'],
  },
  {
    slug: 'kilometr-ctvrecni',
    term: 'Kilometr čtvereční (km²)',
    alias: ['km²', 'km2', 'čtverečný kilometr'],
    kategorie: 'jednotky',
    shortDef: 'Kilometr čtvereční (km²) je jednotka plochy = čtverec 1 × 1 km = 100 hektarů = 1 000 000 m². Používá se pro lesy, katastrální území, kraje, povodí.',
    longDef: `Kilometr čtvereční (km², psáno též km2 nebo „čtvereční kilometr") je odvozená jednotka plošného obsahu v SI. 1 km² = plocha čtverce o straně 1 km = 1 000 m × 1 000 m.

Převody:
- **1 km² = 1 000 000 m²**
- **1 km² = 100 ha** (sto hektarů)
- **1 km² = 10 000 a** (deset tisíc arů)
- **1 km² ≈ 247,1 akru**
- **1 mile² ≈ 2,59 km²** (čtvereční míle, USA)

Použití:
- **Lesnictví** — výměra lesních hospodářských celků, povodí, chráněných území (CHKO, NP) se uvádí v km².
- **Katastrální území** — průměrné katastrální území v ČR má 4–8 km².
- **Pastviny a TTP** — extenzivní pastvy v horských oblastech (Krkonoše, Beskydy) se měří v km².
- **Statistika ČSÚ** — orná půda v ČR ~30 000 km² (3 mil. ha), TTP ~10 000 km².
- **Klimatická a meteo data** — srážky a teploty interpolované na km² rastr.

Praktická přirovnání:
- **Praha 1 (správní obvod)**: 5,5 km²
- **Manhattan (NYC)**: 59 km²
- **Mikulov (město)**: 47 km²
- **NP Šumava**: 685 km²
- **CHKO Český kras**: 132 km²

ČR celkem má **78 871 km²** = 7,89 mil. ha. Z toho zemědělská půda 41 868 km² = 4,19 mil. ha (53 % rozlohy státu).

Viz též [[hektar]] (= 0,01 km²), [[metr-ctvrecni]], [[ar]].`,
    related: ['hektar', 'metr-ctvrecni', 'ar'],
  },
  {
    slug: 'hektolitr',
    term: 'Hektolitr (hl)',
    alias: ['hl', 'hektolitrová váha'],
    kategorie: 'jednotky',
    shortDef: 'Hektolitr (hl) je jednotka objemu = 100 litrů = 0,1 m³. V zemědělství klíčová pro hektolitrovou váhu obilí (kg/hl) — kvalitativní parametr pro výkup.',
    longDef: `Hektolitr (hl) je jednotka objemu = **100 litrů** = 0,1 m³. V SI je hektolitr přijímaná jednotka mimo SI, široce používaná v zemědělství, pivovarnictví a obchodu s tekutinami.

Převody:
- **1 hl = 100 l**
- **1 hl = 0,1 m³ = 100 dm³**
- **1 hl ≈ 22 imperiálních galonů (UK) ≈ 26,4 US galonu**
- **1 hl ≈ 2,75 amerických bušlů** (záleží na komoditě)

V zemědělství je hl klíčový pro **hektolitrovou váhu** — hmotnost v kilogramech, kterou má 100 litrů obilí. Je to fundamentální **kvalitativní parametr** pro výkup obilí:

| Plodina | Standard kg/hl | Krmné | Potravinářské |
|---------|----------------|-------|---------------|
| **Pšenice ozimá** | 76–82 | < 74 | 78–84 (E, A) |
| **Ječmen sladovnický** | 64–68 | < 62 | min. 64 |
| **Ječmen krmný** | 62–66 | běžné | — |
| **Žito** | 70–76 | < 68 | 72+ |
| **Oves** | 48–52 | < 45 | 50+ |
| **Řepka ozimá** | 64–68 | — | min. 62 |
| **Tritikale** | 70–76 | běžné | — |

**Proč hl váha?** Vyšší hektolitrová váha = vyšší obsah škrobu/oleje, méně plev a šešulí, lepší mlynářská kvalita. Mlýny a sladovny určují cenu obilí podle hl váhy + dalších parametrů (vlhkost, dusík, Falling Number).

Praktické dopady na příjem farmy:
- Pšenice 78 kg/hl → potravinářská třída A → 5800 Kč/t
- Pšenice 74 kg/hl → krmná → 4200 Kč/t
- **Rozdíl 1600 Kč/t** = 80 tis. Kč na 50 ha při výnosu 6 t/ha

Hektolitrovou váhu měří mobilní váhy přímo v kombajnu (yield monitor, viz [[yield-monitor]]) nebo přesně laboratorně po sklizni.

Viz též [[busl]] (US ekvivalent), [[q-cent]], [[tuna]], [[kilogram]], [[hektar]].`,
    related: ['busl', 'q-cent', 'tuna', 'kilogram', 'yield-monitor'],
  },
  {
    slug: 'busl',
    term: 'Bušl (bushel)',
    alias: ['bushel', 'bu', 'americký bušl'],
    kategorie: 'jednotky',
    shortDef: 'Bušl (bushel, bu) je anglosaská jednotka objemu i hmotnosti pro obilí. 1 US bušl pšenice = 27,2155 kg, kukuřice = 25,4 kg. Standardní jednotka cen na CBOT.',
    longDef: `Bušl (anglicky *bushel*, zkr. *bu*) je tradiční anglosaská jednotka, která se v zemědělství používá ve dvou formách:

1. **Objemový bušl** = 35,2391 litru (USA, dry bushel) = 36,3687 l (UK, imperial)
2. **Hmotnostní bušl** — pevně definovaná hmotnost pro každou komoditu (USDA standard)

Hmotnostní bušl (USDA pro US obchod):
| Komodita | kg/bušl | lb/bušl |
|----------|---------|---------|
| **Pšenice** | 27,2155 | 60 |
| **Sója** | 27,2155 | 60 |
| **Kukuřice** | 25,4012 | 56 |
| **Ječmen** | 21,7724 | 48 |
| **Oves** | 14,5150 | 32 |
| **Žito** | 25,4012 | 56 |
| **Řepka (canola)** | 22,6796 | 50 |

**Proč bušl důležitý pro CZ farmáře:**
- **CBOT (Chicago Board of Trade)** — světové ceny pšenice, kukuřice a sóji se kvotují v **centech/bušl**. Pohyby na CBOT diktují i ceny v Evropě s 1–2 denním zpožděním.
- **USDA WASDE reporty** — měsíční globální odhady úrody a zásob publikované v milionech bušlů.
- **Export/import** — americká soja a kukuřice se prodává po bušlech.

Převod **bušl/akr → t/hektar** (kvůli porovnání US a EU výnosů):
- **Pšenice**: bu/ac × 0,06725 = t/ha (50 bu/ac ≈ 3,36 t/ha)
- **Kukuřice**: bu/ac × 0,06277 = t/ha (175 bu/ac ≈ 10,98 t/ha)
- **Sója**: bu/ac × 0,06725 = t/ha (50 bu/ac ≈ 3,36 t/ha)

Příklad převodu ceny CBOT na CZ:
- Pšenice 600 ¢/bu = 6,00 USD/bu
- 6,00 USD ÷ 27,2155 kg × 1000 = **220,4 USD/t**
- × 23 Kč/USD = **5 070 Kč/t** (před dopravou a maržemi)

Pozor — **UK imperial bushel** (36,37 l) je o 3 % větší než US bušl, ale v zemědělství dnes naprosto dominuje US standard.

Viz též [[hektolitr]] (EU ekvivalent kvalitativní jednotky), [[q-cent]], [[tuna]], [[libra]], [[akr]].`,
    related: ['hektolitr', 'q-cent', 'tuna', 'libra', 'akr'],
  },
  {
    slug: 'jitro',
    term: 'Jitro',
    alias: ['historická jednotka plochy', 'rakouské jitro'],
    kategorie: 'jednotky',
    shortDef: 'Jitro je historická středoevropská jednotka plochy ≈ 0,5755 ha (rakouské/české jitro = 1600 čtv. sáhů). Plocha, kterou pár volů zorá za den. Dnes obsoletní, ale v katastrálních zápisech a rodinné paměti přežívá.',
    longDef: `Jitro (latinsky *jugerum*, německy *Joch*) je tradiční středoevropská jednotka plošného obsahu, jejíž velikost se historicky lišila podle regionu. V českých zemích a Rakousku-Uhersku platilo standardizované **rakouské (dolnorakouské) jitro = 1600 čtverečních sáhů = 5754,642 m² ≈ 0,5755 ha**.

Hlavní regionální varianty:
- **Rakouské/české jitro**: 5 754,64 m² = **0,5755 ha** (od roku 1764 v Habsburské monarchii)
- **Uherské jitro**: 5 754,64 m² (stejné jako rakouské)
- **Moravské zemské jitro**: 5 754,64 m² (sjednoceno s rakouským)
- **Pruské jitro (Morgen)**: 2 553 m² ≈ 0,255 ha (viz [[morgen]])
- **Velké jitro**: někdy 1,5–1,75 ha (regionální, neoficiální)

Etymologie: jitro = plocha, kterou pár volů zorá od jitra (rána) do oběda. Pro pár volů s dřevěným hákem to bylo cca 0,5–0,6 hektaru za půl dne — odtud rozsah.

**Proč ještě dnes relevantní:**
- **Katastr nemovitostí** — starší zápisy z 19. a začátku 20. století udávají výměru v jitrech a čtverečních sázích. Při dědických řízeních a převodech pozemků se s jitry stále setkáváme.
- **Rodinná paměť** — sedlácké rodiny si výměry předků pamatují v jitrech („dědek měl 12 jiter", tj. ≈ 6,9 ha).
- **Pohraničí** — staré pruské, bavorské, saské mapy používaly *Morgen* (≈ 0,25 ha), což se občas plete s jitrem.

Praktické převody:
- **1 jitro = 0,5755 ha = 57,55 a = 5 754 m²**
- **1 jitro ≈ 1,422 akru** (anglosaského)
- **2 jitra = 1,151 ha** (tradiční „selské hospodářství" mělo 20–40 jiter, tj. 12–23 ha)

V dnešním katastru ČR jsou jitra **nahrazena m² a hektary** (vyhláška o katastru), ale stará čísla v knihovním zápise jsou stále právně platná.

Viz též [[hektar]], [[ar]], [[korec]], [[strych]], [[lan]], [[morgen]].`,
    related: ['hektar', 'korec', 'strych', 'lan', 'morgen'],
  },
  {
    slug: 'lan',
    term: 'Lán',
    alias: ['celý lán', 'selský lán', 'kmetcí lán'],
    kategorie: 'jednotky',
    shortDef: 'Lán je středověká česká jednotka plochy ≈ 18 ha (přesněji 16–24 ha podle regionu). Plocha selského hospodářství, které uživí jednu rodinu. Dnes obsoletní, ale historicky zásadní jednotka.',
    longDef: `Lán je historická česká jednotka plošného obsahu, používaná od raného středověku do 18. století. Velikost lánu se výrazně lišila podle regionu, doby a typu (selský/královský/kmetcí), ale ve standardu z urbáře platilo:

**Český lán (kmetcí, selský)**: typicky 64 strychů ≈ **18 ha** (16–24 ha v praxi).

Typy lánů:
- **Lán kmetcí (selský)** — 60–64 strychů ≈ 16–20 ha, hospodářství poddaného sedláka
- **Lán královský** — 70–84 strychů ≈ 19–24 ha, mírně větší
- **Pražský lán** — standardizován na 64 strychů ≈ 18,2 ha
- **Lán moravský** — variabilní, 16–21 ha
- **Půllán** — polovina lánu, drobnější hospodářství (8–10 ha)
- **Čtvrtlán** — čtvrtina, chalupníci (4–5 ha)
- **Zahradník** — bez lánu, jen dům a zahrada (< 1 ha)

Lán byl **základní ekonomicko-sociální jednotkou** českého venkova:
- **Daně a robota** — robotní povinnosti se vyměřovaly podle velikosti lánu (3 dny v týdnu pro celý lán).
- **Společenský status** — *láník* (sedlák s celým lánem) byl nejvyšší vrstva poddaného obyvatelstva.
- **Dědictví** — lán se v Čechách typicky nedělil (právo nedílu), dědil ho jeden syn, ostatní šli na řemeslo nebo do města.

Lán byl tvořen mnoha menšími pozemky (políčka, louky, pastviny, les) rozesetými po katastru obce — typický **trojhonný systém** (ozim/jarin/úhor) vyžadoval mít půdu ve více honech.

Po **patentech Marie Terezie** (1755) a **josefínském katastru** (1789) se lán postupně nahrazoval přesnějšími jitry a m². V Tereziánském katastru (1748) byly lány konkrétně vyměřeny — proto dnes víme přesné velikosti pro jednotlivé vesnice.

V moderním kontextu:
- **Genealogie a rodopis** — staré matriční a urbární zápisy uvádějí předky jako „láník", „půlláník", „chalupník".
- **Historie obcí** — kronikáři a regionální historici pracují s lány při popisu středověké struktury vesnice.
- **Místní názvy** — „Velký lán", „Lánská cesta", „Na lánech" jsou dodnes živé pomístní názvy.

Pozor — moderní slovo „lán" jako synonymum pro velké pole (např. „nekonečné lány obilí") je už metaforické, nepředstavuje konkrétní jednotku.

Viz též [[jitro]], [[korec]], [[strych]], [[hektar]].`,
    related: ['jitro', 'korec', 'strych', 'hektar'],
  },
  {
    slug: 'korec',
    term: 'Korec',
    alias: ['český korec', 'pražský korec', 'historická míra'],
    kategorie: 'jednotky',
    shortDef: 'Korec je historická česká jednotka plochy ≈ 0,2877 ha (28,77 a). Plocha, na kterou se vyseje 1 korec (objemová míra) obilí. V katastrálních zápisech a rodinné paměti přežívá dodnes.',
    longDef: `Korec je historická česká jednotka plošného obsahu, etymologicky odvozená od **korce jako objemové míry obilí** (asi 93 litrů). Korec půdy = plocha, na kterou se vyseje 1 korec osiva.

**Standardizovaný český (pražský) korec**: 2 877,32 m² = **28,77 a ≈ 0,288 ha**.

Regionální varianty:
- **Pražský korec**: 2 877 m² ≈ 0,288 ha (oficiální od r. 1764)
- **Moravský korec**: variabilní, 1 920–2 880 m² (0,19–0,29 ha)
- **Slezský korec**: 2 877 m² (sjednocený s pražským)
- **Velký korec** (lesní): někdy až 5 754 m² (= jedno jitro)

Vztah k dalším historickým jednotkám:
- **1 jitro = 2 korce** (po 1 800 čtv. sáhách + zaokrouhlení regionálně)
- **1 strych = 1 korec** (synonymum v některých regionech, viz [[strych]])
- **1 lán = 60–64 korců** ≈ 17–18 ha

V hospodářské praxi:
- **Drobné chalupnické usedlosti**: 2–4 korce (= 0,6–1,2 ha)
- **Střední statek**: 20–40 korců (= 5,8–11,5 ha)
- **Selský láník**: 60+ korců = 1 lán = 17+ ha

**Proč korec dnes ještě potkáváme:**
- **Katastrální zápisy do roku 1869** používají korce a jitra. Vklad starého zápisu při dědictví → potkáte korce.
- **Rodinné kroniky a vyprávění** — „dědek měl 8 korců u potoka" = ≈ 2,3 ha.
- **Pomístní názvy** — „Na korci", „Korecká louka" jsou v ČR rozšířené.
- **Genealogie** — gruntovní knihy a urbáře (16.–19. století) — výměry v korcích/strychích.

Praktické převody:
- **1 korec = 0,2877 ha = 28,77 a = 2 877 m²**
- **1 korec ≈ 0,711 akru**
- **3,5 korce = 1 ha** (zaokrouhleně)

Po metrické reformě v ČSR (zákon č. 268/1919 Sb.) byl korec **oficiálně nahrazen hektarem a arem**. Dnes nemá právní platnost jako jednotka, ale staré zápisy zůstávají právně relevantní.

Viz též [[strych]] (synonymum v některých regionech), [[jitro]], [[lan]], [[hektar]], [[ar]].`,
    related: ['strych', 'jitro', 'lan', 'hektar', 'ar'],
  },
  {
    slug: 'strych',
    term: 'Strych',
    alias: ['historický strych', 'moravský strych'],
    kategorie: 'jednotky',
    shortDef: 'Strych je historická středoevropská jednotka plochy ≈ 0,288 ha (28,8 a), v podstatě synonymum českého korce. Plocha, na kterou se vyseje 1 strych (objem) osiva. V Tereziánském katastru a starých zápisech přežívá dodnes.',
    longDef: `Strych je tradiční česká a středoevropská jednotka plošného obsahu. Slovo pochází z německého *Strich* (= pruh, řádek, vyznačený pás půdy). V mnoha regionech je strych **synonymem korce** — obě jednotky byly definovány jako plocha, na kterou se vyseje 1 strych/korec (objemová míra ≈ 93 l) obilí.

**Český strych**: 2 877 m² ≈ **0,288 ha** (totožný s pražským korcem).

Regionální varianty:
- **Český/pražský strych**: 2 877 m² ≈ 0,288 ha
- **Moravský strych**: 1 920–2 880 m² (0,19–0,29 ha) — variabilní
- **Slezský strych**: 2 877 m² (sjednocený s českým po patentech Marie Terezie)
- **Velký strych** (lesní): až dvojnásobek

V některých regionech jihovýchodní Moravy a Slovenska byl strych pevně menší než český korec (≈ 0,2 ha) — proto vždy v archivních pramenech ověřit lokální definici.

**Použití historicky:**
- **Tereziánský katastr (1748)** — výměry polí, luk a pastvin zapsány ve strychích/jitrech.
- **Robotní patenty** — robotní povinnosti se odvíjely od počtu strychů.
- **Urbární knihy 17.–18. století** — daňová evidence drobné držby.

**Vztah k dalším jednotkám:**
- **1 strych = 1 korec** (v české standardizaci po 1764)
- **2 strychy = 1 jitro** (≈ 0,575 ha)
- **64 strychů = 1 lán** (≈ 18 ha)
- **3,48 strychu = 1 ha**

**Dnes ještě potkáme strych:**
- **Katastr nemovitostí** — staré zápisy před metrickou reformou 1919.
- **Genealogie / rodopis** — matriky a gruntovní knihy uvádějí výměry ve strychích.
- **Pomístní názvy** — „Strychy", „Na strychu", „Strychová pole" v některých obcích.

Praktické převody:
- **1 strych = 0,288 ha = 28,8 a = 2 877 m²**
- **1 strych ≈ 0,712 akru**
- **3,48 strychu = 1 hektar**

Po metrické reformě v ČSR (1919) byl strych **oficiálně zrušen** jako platná jednotka. Pro pochopení starých dokumentů ale potřeba znát.

Viz též [[korec]] (synonymum), [[jitro]] (= 2 strychy), [[lan]], [[hektar]].`,
    related: ['korec', 'jitro', 'lan', 'hektar'],
  },
  {
    slug: 'tuna',
    term: 'Tuna (t)',
    alias: ['t', 'metrická tuna', 'megagram'],
    kategorie: 'jednotky',
    shortDef: 'Tuna (t) je jednotka hmotnosti = 1 000 kg = 10 metrických centů (q). Standardní jednotka v zemědělství pro výnosy plodin (t/ha), výkupní ceny komodit (Kč/t) i kapacity strojů.',
    longDef: `Metrická tuna (značka **t**, někdy *Mg* — megagram) je jednotka hmotnosti = 1 000 kg = 10⁶ gramů. V SI je tuna přijímaná jednotka mimo SI, ale fakticky dominantní pro praktické vážení v zemědělství, obchodu i průmyslu.

Převody:
- **1 t = 1 000 kg = 10 q** (metrických centů)
- **1 t ≈ 2 204,62 lb** (anglických liber)
- **1 t ≈ 22,046 amerických short tunů** (US short ton = 907,18 kg)
- **1 t ≈ 0,9842 long tunů (UK)** (long ton = 1 016 kg)
- **1 t pšenice ≈ 36,7 bušlů** (US)
- **1 t kukuřice ≈ 39,4 bušlů**

Použití v zemědělství (CZ + EU standard):
- **Výnosy plodin** — t/ha je dominantní jednotka. Pšenice 5–8 t/ha, kukuřice 8–12 t/ha, řepka 3–4,5 t/ha, ječmen 5–7 t/ha.
- **Výkupní ceny** — Kč/t. Příklad 2024: pšenice 4 800–5 500 Kč/t, kukuřice 3 800–4 500 Kč/t.
- **Hnojiva** — t/ha kejdy (15–25 t/ha), kg/ha NPK, ale balení dnes typicky v t (big-bag 600 kg ≈ 0,6 t, kontejner 1 t).
- **Kapacita strojů** — návěs 14–24 t, kombajn zásobník 8–13 m³ ≈ 6–10 t obilí.
- **Mezinárodní obchod** — CBOT, MATIF, FOB ceny v USD/t, EUR/t.

Praktické příklady:
- Pole 50 ha pšenice × 6,5 t/ha = 325 t = **6,5 železničních vagonů** (vagon ~50 t)
- Sklizeň kukuřice 100 ha × 10 t/ha = 1 000 t = **40 návěsů × 25 t**
- Roční spotřeba hnojiv farma 500 ha: 250 t LAV + 100 t DAM = 350 t

**Tuna vs short ton (US/UK):**
V mezinárodním obchodu pozor — americký *short ton* (2 000 lb) má jen 907 kg, *long ton* (UK, 2 240 lb) má 1 016 kg. Pokud čtete USDA reporty nebo americké zdroje, vždy ověřit jaká „ton" je míněna. **CBOT a EU obchod používá výhradně metrickou tunu (t)**.

Viz též [[q-cent]] (= 0,1 t), [[kilogram]], [[busl]] (komoditní převod).`,
    related: ['q-cent', 'kilogram', 'busl', 'hektolitr'],
  },
  {
    slug: 'kilogram',
    term: 'Kilogram (kg)',
    alias: ['kg', 'kilo'],
    kategorie: 'jednotky',
    shortDef: 'Kilogram (kg) je základní jednotka hmotnosti v SI. V zemědělství klíčový pro dávkování hnojiv (kg/ha), váhu zvířat, ceny krmiv a balení (kg/balík siláže, kg/pytel osiva).',
    longDef: `Kilogram (kg) je **základní jednotka hmotnosti v SI soustavě**. Od roku 2019 je definován pomocí Planckovy konstanty (h = 6,62607015 × 10⁻³⁴ J·s), předtím byl definován jako hmotnost mezinárodního prototypu uloženého v Sèvres u Paříže.

Převody:
- **1 kg = 1 000 g = 1 000 000 mg**
- **1 kg = 0,001 t = 0,01 q**
- **1 kg ≈ 2,2046 lb** (libra)
- **1 kg ≈ 35,274 oz** (unce, USA/UK)

Použití v zemědělství:
- **Dávkování hnojiv** — kg/ha čistých živin. Příklad: pšenice ozimá 150 kg N/ha, kukuřice 180 kg N/ha. Pozor: kg živin ≠ kg hnojiva (LAV má 27,5 % N → 150 kg N = 545 kg LAV/ha).
- **Dávkování postřiků** — kg/ha pro granulované přípravky a moridla. Příklad: Roundup 360 SL je tekutý (l/ha), ale glyfosát ve formě soli se uvádí v g/ha (720 g a.s./ha).
- **Váha zvířat** — telata 35–45 kg při narození, dospělé krávy mléčné dojnice 600–750 kg, býk plemeník 1 000+ kg.
- **Ceny krmiv** — Kč/kg pro premixy a koncentráty (10–30 Kč/kg), Kč/t pro běžné krmné směsi.
- **Osivo** — pšenice 180–220 kg/ha, kukuřice 22–28 kg/ha (mnohem menší dávka — větší zrno).
- **Balení produktů** — pytle hnojiv 25/40/50 kg, big-bag 500–1 200 kg, balíky siláže 600–800 kg.

**Hektolitrová váha** — kg/hl je kvalitativní parametr obilí (viz [[hektolitr]]). Pšenice potravinářská 78+ kg/hl, krmná < 74 kg/hl.

**Měření živé hmotnosti vs jatečná hmotnost:**
- **Živá hmotnost** (LW — Live Weight) = váha zvířete na váze
- **Jatečná hmotnost** (CW — Carcass Weight) = váha těla po porážce
- Poměr CW/LW: skot ~55–60 %, prase ~75 %, drůbež ~70 %

Praktická přirovnání:
- **Pytel cementu**: 25 kg
- **Pytel pšenice (osivo)**: 25 kg (standardní balení)
- **Big-bag hnojiva**: 600 kg
- **Tele**: 40 kg
- **Selecky pas dojnice**: 650 kg
- **Velký traktor (Fendt 1050)**: ~13 000 kg
- **Návěs Joskin Trans-CAP plný kejdy**: ~30 000 kg (= 30 t)

Viz též [[tuna]] (= 1 000 kg), [[q-cent]] (= 100 kg), [[libra]] (USA/UK).`,
    related: ['tuna', 'q-cent', 'libra', 'hektolitr'],
  },
  {
    slug: 'libra',
    term: 'Libra (pound, lb)',
    alias: ['pound', 'lb', 'anglická libra'],
    kategorie: 'jednotky',
    shortDef: 'Libra (pound, lb) je anglosaská jednotka hmotnosti = 0,4536 kg. Standardní jednotka v USA, UK, Kanadě a Austrálii. V zemědělství se s ní setkáme v USDA reportech, CBOT cenách a balení amerického krmiva.',
    longDef: `Libra (anglicky *pound*, zkr. *lb* z latinského *libra*) je tradiční anglosaská jednotka hmotnosti. **Mezinárodní libra** (definovaná od roku 1959) = **0,45359237 kg** přesně.

Převody:
- **1 lb = 0,4536 kg** (přesně 0,45359237)
- **1 lb = 16 oz** (uncí)
- **1 kg ≈ 2,2046 lb**
- **1 t ≈ 2 204,62 lb**
- **1 short ton (US)** = 2 000 lb = 907,18 kg
- **1 long ton (UK)** = 2 240 lb = 1 016 kg
- **1 bušl pšenice** = 60 lb = 27,2155 kg

Historicky existovaly desítky regionálních liber (apothecary lb 373 g, troy lb 373 g, French livre 489 g, ...), ale dnes je v praxi jen **mezinárodní libra (0,4536 kg)** v anglosaském obchodu.

**Kde libra v CZ zemědělství:**
- **USDA reporty** — WASDE, ERS publikace uvádějí ceny v ¢/lb pro některé komodity (bavlna, máslo, sýr).
- **CBOT futures** — sójový olej se kvotuje v ¢/lb (cca 45–60 ¢/lb v 2024). Dobytek (live cattle) se obchoduje v ¢/lb (cca 180–200 ¢/lb).
- **Krmiva premixy a doplňky** — americké zdroje uvádějí dávky v lb/head/day.
- **Genetika a plemenné zápisy** — váhy plemenných býků a krav v lb (US Holstein registry).
- **Outdoor / lov / rybolov** — v ČR populární „libra" pro označení velkých ryb (kapr 20+ lb = trofejní rozměr).

Převod cen CBOT:
- Sójový olej 50 ¢/lb = 0,50 USD/lb × 2,2046 = **1,10 USD/kg** = **1 100 USD/t**
- Live cattle 200 ¢/lb = 2,00 USD/lb × 2,2046 = **4,41 USD/kg** living weight

**Pozor — libra ≠ kilogram:**
Časté chyby v překladech recipes a krmných tabulek. Američan napíše „180 lb cow" = 82 kg telete (myšlené tele, ne kráva!). Dospělá US cow = 1 200–1 400 lb = 545–635 kg.

Pro CZ farmáře praktická pomůcka: **lb × 0,5** dává rychlý odhad v kg (přesněji × 0,4536, ale lb × 0,5 je dost pro mental math). Příklad: 2 000 lb ≈ 1 000 kg (skutečně 907 kg).

Viz též [[kilogram]] (SI), [[tuna]], [[busl]] (= 60 lb pro pšenici).`,
    related: ['kilogram', 'tuna', 'busl'],
  },
  {
    slug: 'morgen',
    term: 'Morgen',
    alias: ['pruský morgen', 'německé jitro', 'Morgen'],
    kategorie: 'jednotky',
    shortDef: 'Morgen je historická německá/rakouská jednotka plochy. Pruský morgen = 0,2553 ha, bavorský = 0,3407 ha, rakouský = 0,5755 ha (= rakouské jitro). V pohraničí a starých zápisech přežívá.',
    longDef: `Morgen (německy „ráno") je historická středoevropská jednotka plošného obsahu, definovaná jako plocha, kterou pár volů zorá za jedno ráno (jitro). Stejně jako české [[jitro]] se velikost výrazně lišila podle regionu — Německo bylo do roku 1872 fragmentované na desítky zemí, každá s vlastní mírou.

Hlavní varianty (před metrickou reformou):
- **Pruský morgen** (Magdeburský): 2 553,2 m² ≈ **0,2553 ha**
- **Bavorský morgen**: 3 407,3 m² ≈ **0,3407 ha**
- **Saský morgen**: 2 767 m² ≈ 0,277 ha
- **Hesenský morgen**: 2 500 m² (zaokrouhleno na 0,25 ha v 19. století)
- **Württemberský morgen**: 3 152 m² ≈ 0,315 ha
- **Rakouský/dolnorakouský morgen** (= jitro): 5 754,6 m² ≈ **0,5755 ha**

Po **metrické reformě v Německé říši (1872)** byl morgen oficiálně zrušen, ale v běžné řeči a katastrálních zápisech v některých regionech přežívá dodnes — **zejména na severu Německa** (Mecklenburg, Sasko) udává staršie generace výměry v morgenech.

**Proč relevantní pro CZ farmáře:**
- **Pohraničí** (Šumava, Krkonoše, Krušné hory, jižní Morava) — staré německé mapy z dob R-U a před rokem 1945 udávaly výměry v morgenech. Při restituci a katastrálních sporech narazíte.
- **Nákup pozemků v DE** — zahraniční prodejci/inzeráty v severním Německu občas uvádějí morgeny (zejm. lesnictví).
- **Pruské katastrální mapy** — historický výzkum vlastnictví Sudet, lichtenštejnských statků atd.

Praktické převody (nejčastější — pruský morgen):
- **1 pruský morgen = 0,2553 ha = 25,53 a = 2 553 m²**
- **1 pruský morgen ≈ 0,631 akru**
- **4 pruské morgeny ≈ 1 ha**
- **1 ha = 3,92 pruského morgenu**

Pozor — **rakouský morgen** je úplně něco jiného (= rakouské jitro = 0,5755 ha). Při čtení starých map vždy nejdřív zjistit, ze které země mapa pochází.

V současné formální agendě **morgen nemá žádnou právní platnost** ani v Německu, ani v ČR.

Viz též [[jitro]] (rakouská varianta), [[akr]], [[hektar]], [[korec]].`,
    related: ['jitro', 'akr', 'hektar', 'korec'],
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

  // ── HNOJIVA & CHEMIE ────────────────────────────────────────────────
  {
    slug: 'lav-can',
    term: 'LAV / CAN (Ledek amonný s vápencem)',
    alias: ['CAN', 'Ledek vápenatý', 'Calcium Ammonium Nitrate'],
    kategorie: 'hnojivo',
    shortDef: 'LAV (CAN) je dusíkaté hnojivo s obsahem 27 % N a vápencovou složkou. Druhé nejpoužívanější N-hnojivo v ČR po močovině. Rychlý efekt, bezpečnější skladování.',
    longDef: `LAV (Ledek amonný s vápencem, ang. CAN — Calcium Ammonium Nitrate) je granulované dusíkaté hnojivo. Obsahuje **27 % N** (50 % nitrát NO₃⁻, 50 % amonium NH₄⁺) a cca **8 % CaO** + 4 % MgO z vápencové složky.

Hlavní výhody proti močovině:
- **Okamžitý účinek** — polovina N v nitrátové formě je hned využitelná rostlinou.
- **Žádné ztráty volatilizací** (NH₃ úniky) — bez nutnosti zapracování.
- **Bezpečnější skladování** — neexploduje (ledek čistý 33 % N je výbušnina, LAV s vápencem ne).
- **Vápnitý efekt** — slabě zvyšuje pH půdy (vs močovina, která je neutrální až mírně kyselá).

Použití:
- **Jarní top dressing ozimů** — 200–400 kg/ha (= 54–108 kg N/ha).
- **Pre-em pro jaří plodiny** — 150–250 kg/ha pod kukuřici, slunečnici.
- **Lepší než močovina za suchého počasí** — močovina vyžaduje vlhko pro hydrolýzu, LAV funguje i v suchu.

Cena (2024): cca 11 000–14 000 Kč/t v IBC bagů 600 kg. O ~15 % dražší per kg N než močovina, ale praktičtější.

V CZ dominantní výrobce: Lovochemie (Lovosice) — značky LAV 27. Import z Polska (Yara, Anwil) a Slovenska (Duslo).`,
    related: ['mocovina', 'npk-hnojivo', 'pH-pudy'],
  },
  {
    slug: 'dam-390',
    term: 'DAM 390 (Kapalné hnojivo)',
    alias: ['DAM', 'UAN', 'Urea Ammonium Nitrate solution'],
    kategorie: 'hnojivo',
    shortDef: 'DAM 390 je kapalné dusíkaté hnojivo s 30 % N (mix močoviny + ledku amonného + vody). Aplikace přes postřikovač — rychlé, rovnoměrné, bez prachu.',
    longDef: `DAM 390 (ang. UAN 32 — Urea Ammonium Nitrate solution) je nejpoužívanější kapalné dusíkaté hnojivo v EU. **30 % N v 1 litru = 390 g N/l** (proto "DAM 390"). Složení:
- 50 % močovina (15 % N celkem)
- 25 % ledek amonný (7,5 % N celkem)
- 25 % voda (7,5 % N v amid + nitrát formách)

Aplikace:
- **Postřikovač s trubkovými tryskami** (ne klasické rozprašovače — DAM by spálil list).
- **Hnojivová sada na postřikovači** — speciální 5–7 paprskové trysky střelí kapalinu mezi řádky.
- **Dávkování** 100–250 l/ha (= 39–98 kg N/ha).
- **Časy aplikace**: jarní vzcházení obilovin, druhá dávka na kvetení, případně listové hnojení (5–15 l/ha v poredění).

Výhody:
- **Rovnoměrnost** — žádné rozpadlé granule, plynulý spray.
- **Rychlost práce** — 80–150 ha/den s postřikovačem 24 m.
- **Možnost kombinace** s mikroprvky, ochrannými přípravky v tank-mix.
- **Skladování** v IBC (1000 l) nebo cisternách (10+ t) — bez nutnosti uzavřeného skladu.

Nevýhody:
- **Sklon k popálení listu** při horku nad 22 °C nebo přímém slunci.
- **Korozní k vodárenství** — separátní cisterna a čerpadlo.

Cena (2024): cca 7 500–10 500 Kč/t (= 19–27 Kč/kg N — výrazně levnější než pevná hnojiva za jednotku N).`,
    related: ['mocovina', 'lav-can', 'npk-hnojivo'],
  },
  {
    slug: 'vapneni',
    term: 'Vápnění půdy',
    alias: ['vápnění', 'liming', 'CaCO₃ aplikace'],
    kategorie: 'agrotechnika',
    shortDef: 'Vápnění je aplikace vápenatých látek do půdy pro úpravu pH a doplnění vápníku. Klíčový dlouhodobý zásah pro úrodnost — 1× za 4–8 let podle pH.',
    longDef: `Vápnění je proces aplikace vápenatých produktů do půdy, kterým se cíleně:
1. **Upraví pH** směrem k optimu (5,5–7,0 pro většinu plodin).
2. **Doplní vápník** jako živina (Ca je makroživina, kterou rostliny vážou v desítkách kg/ha/rok).
3. **Zlepší struktura** půdy (Ca flokuluje jíl, zvyšuje kapilaritu).

Hlavní produkty:
- **Mletý vápenec (CaCO₃)** — nejlevnější, pomalý účinek (3–6 měsíců), dávka 2–6 t/ha.
- **Dolomitický vápenec (CaCO₃ + MgCO₃)** — pro půdy chudé na Mg, dávka 2–6 t/ha.
- **Vápenec pálený (CaO)** — agresivní, rychlý účinek, dávka 0,8–2,5 t/ha. Nutná opatrnost (popálí kořeny).
- **Hašené vápno (Ca(OH)₂)** — pro extrémně kyselé půdy, velmi rychlý účinek.
- **Cukrovarnické saturační kaly** — odpadní z výroby cukru, levný zdroj Ca + organické hmoty.

Cena (2024): 800–1 800 Kč/t včetně dovozu (vápenec). Aplikace rozmetadlem 200–400 Kč/ha. Celková investice 4 000–12 000 Kč/ha při běžné dávce.

Kdy vápnit:
- **Půdní rozbor 1× za 4 roky** ukáže aktuální pH a saturaci Ca.
- **pH pod 5,5** → vápnit cca 4 t/ha vápence + opakovat po 2 letech.
- **pH 5,5–6,0** → 2 t/ha jako prevence každých 4–6 let.
- **pH nad 6,5** → nevápnit (zbytečné, riziko alkality).

ROI: zvýšení pH o 0,5 jednotky obvykle vede k +5–15 % výnosu cereálií dlouhodobě. Návratnost 2–4 sezóny.`,
    related: ['pH-pudy', 'organicka-hmota'],
  },

  // ── STROJE & NÁŘADÍ ────────────────────────────────────────────────
  {
    slug: 'pluh',
    term: 'Pluh (typy a parametry)',
    alias: ['plough', 'orbní pluh'],
    kategorie: 'technologie',
    shortDef: 'Pluh je nářadí pro hlubokou orbu — obrací 20–35 cm vrstvu ornice. Existuje nesený, polonesený a otočný (reverze) typ s 2–12 radlicemi.',
    longDef: `Pluh je nejstarší orné nářadí — obrací půdu pomocí radlic. V CZ standardní zařízení pro podzimní zpracování pole.

**Typy podle závěsu**:
- **Nesený pluh** — celý nese tříbod traktoru. Lehčí (do 4–5 radlic). Pro 80–150 koní traktor.
- **Polonesený** (semi-mounted) — zadní část pluhu opírá o vlastní kola. 5–8 radlic. Pro 130–200 koní.
- **Tažený** (trailed) — celý pluh na vlastních kolech, tříbod jen táhne. 8–12 radlic. Pro 200+ koní.

**Typy podle směru orby**:
- **Klasický (jednosměrný)** — orá jen jedním směrem. Vyžaduje "mezerovou orbu" → nepravidelný povrch.
- **Otočný pluh (reverze)** — radlice se otáčejí o 180°, orá oběma směry. Hladký povrch bez mezer. Dnes standardem (95 % nových pluhů).
- **Variopluh** — proměnný záběr radlic za jízdy (40–60 cm per radlice). Užitečné u oprav cest nebo úzkých záhonů.

**Klíčové parametry**:
- **Počet radlic** — 3 (lehký), 4–5 (střední), 6–8 (těžký), 8–12 (extra těžký).
- **Záběr per radlice** — 35, 40, 45, 50 cm. Celkový záběr = počet × per radlice.
- **Hloubka orby** — 20–35 cm regulovaná hydraulicky nebo mechanicky.

**Top značky CZ**: Lemken (DE — Diamant, EurOpal), Pöttinger (AT — Servo), Kverneland (NO/IT — LB, ED, PB), Kuhn (FR — Vari-Master), Vogel & Noot (AT — Plus).

**Cenová orientace** (2026 nový):
- 3-radlový nesený otočný: 200 000–350 000 Kč.
- 5-radlový polonesený otočný: 600 000–1 100 000 Kč.
- 8-radlový tažený otočný + Vario: 1,8–3 mil. Kč.`,
    related: ['orba', 'tribod', 'no-till'],
  },
  {
    slug: 'kompaktomat',
    term: 'Kompaktomat',
    alias: ['compact disk harrow', 'kompaktor'],
    kategorie: 'technologie',
    shortDef: 'Kompaktomat je kombinované nářadí pro mělké zpracování půdy — disky + kola + drobící lišty v jedné jízdě. Připravuje pole pro setí po orbě nebo místo orby.',
    longDef: `Kompaktomat je polonesený stroj kombinující ve více řadách: **diskové brány + drobicí lišty + zatlačovací válce** (smyk, kola). Cíl: připravit ideální seťové lůžko v 1 jízdě.

**Typický záběr**: 3–8 m, podle traktoru 100–250 koní.

**Komponenty (zepředu dozadu)**:
1. **Diskové secce** (40–55 cm Ø) — nařežou strniště, předkypří 5–10 cm.
2. **Šípy / dláta** (volitelné) — rozrušení utužení.
3. **Pružné kypřící lišty** — drobí hrudky.
4. **Zatlačovací válec** (Crosskill, U-profil, Cambridge) — utlumí povrch, vytvoří kapilární propojení s podorničím.

**Hlavní použití**:
- **Pre-secí příprava** — místo bran + smyku + válce v 3 separátních jízdách.
- **Stubble cultivation** — okamžitě po sklizni, podmítka strniště.
- **Pseudoorba** — jako náhrada orby v min-till systémech.

**Výhody**:
- 1 jízda místo 3–4 = úspora paliva 40–60 % vs konvenční schéma.
- Vyšší výkon — 4–8 ha/h vs 1–3 ha/h u jednoduchých nástrojů.
- Lepší struktura půdy — méně utužení od opakovaných pojezdů.

**Top značky**:
- **Horsch** (Tiger, Joker, Terrano) — DE prémium, no-till friendly.
- **Lemken** (Karat, Heliodor) — DE univerzální.
- **Väderstad** (Carrier, TopDown, Cultus) — SE precision.
- **Köckerling** (Quadro, Allrounder) — DE robustní.
- **Kuhn** (Performer, Optimer) — FR cena/výkon.

**Cena (2026)**: 4 m = 400 000–800 000 Kč, 6 m = 800 000–1,8 mil. Kč, 8 m = 1,5–3,5 mil. Kč.`,
    related: ['orba', 'no-till', 'organicka-hmota'],
  },
  {
    slug: 'mulcovac',
    term: 'Mulčovač',
    alias: ['mulcher', 'mulcher rotační'],
    kategorie: 'technologie',
    shortDef: 'Mulčovač je rotační drtič rostlinné hmoty — strnišť, posklizňových zbytků, trávy, slabých keřů. Připojený na PTO traktoru přes tříbod.',
    longDef: `Mulčovač drtí rostlinou hmotu na velmi drobné kousky pomocí rotujících kladívek nebo nožů na vertikálním nebo horizontálním rotoru.

**Dva hlavní typy**:
- **Rotor horizontální (osa kolmo k jízdě)** — klasický pro plošné mulčování trávy a strniště. Nejčastější.
- **Rotor vertikální (osa svisle)** — pro lesní pasečné práce, hustší vegetaci.

**Šíře záběru**:
- **1,2–2 m** — pro sady, vinohrady, komunální.
- **2,5–4 m** — pro pole (strniště, krmné plodiny).
- **4–8 m** — velkofarmy, sklizňové podniky.

**Použití**:
- **Mulčování strniště** po sklizni obilí — zbylé stéble podrcené, urychluje rozklad.
- **Údržba TTP** — 1–2× ročně mulčování pastevních ploch.
- **Mulčování meziplodin** před zaoráním.
- **Sady a vinohrady** — mulčování travy v meziřadcích.
- **Likvidace zbytku kukuřičných lodyh** — proti zavíječi.

**Pohon**: PTO 540 nebo 1000 ot/min. Příkon obvykle 50–150 koní podle záběru.

**Top značky**:
- **Berti** (IT) — prémium, široká škála.
- **Kuhn** (BPR, BC) — FR univerzál.
- **Krone** (BiG M, EasyCut) — DE pro výkonné aplikace.
- **Maschio Gaspardo** (IT) — cenově dostupné.

**Cena (2026)**: 1,8 m hobby = 50 000–80 000 Kč, 2,5 m střední = 120 000–250 000 Kč, 4 m profi = 300 000–600 000 Kč.`,
    related: ['pto', 'tribod', 'orba'],
  },
  {
    slug: 'naves-sklapeci',
    term: 'Návěs sklápěcí (tříhráp)',
    alias: ['tipper', 'sklápěč'],
    kategorie: 'technologie',
    shortDef: 'Sklápěcí návěs (tříhráp) je transportní vůz s hydraulickým sklápěním na 3 strany. Klíčový pro sklizňové linky, transport sklizně a hnojiv.',
    longDef: `Sklápěcí návěs je dominantní transportní jednotka v zemědělství. **Tříhráp** = může sklopit dozadu i na obě boční strany (3-way tipper).

**Nosnost**:
- **Lehký 8 t** — pro malé farmy, traktor 80+ koní.
- **Standard 12–16 t** — pro střední farmy, traktor 130+ koní.
- **Velký 18–24 t** — pro velkofarmy, traktor 180+ koní. Tandem nebo tridem nápravy.
- **Extra 28+ t** — sklizňové podniky, vlastní motorový pohon.

**Konstrukce**:
- **Korba** ocelová nebo hliníková (lehčí, 200 kg úspora hmotnosti).
- **Nápravy** — single (do 12 t), tandem (12–20 t), tridem (20+ t).
- **Brzdy** vzduchové standard od 10 t (povinné v EU).
- **Hydraulika** — sklápění + bočnice + zadní klapka.

**Tipping (sklápěcí) systémy**:
- **Teleskopický hydraulický válec** — standard, 2–4stupňový válec.
- **Front-tipping** — sklápí pouze dozadu, levnější.
- **3-way tipping** — výjimečně i na strany (užitečné při vykládce do silážních věží nebo v úzkých prostorách).

**Použití**:
- **Žně** — odvoz obilí od kombajnu.
- **Sklizeň pícnin** — siláž z kukuřice / trav.
- **Transport hnojiv, vápence** — od stanice na pole.
- **Komunál** — odvoz výkopků, drcené suti.

**Top značky**:
- **Joskin** (BE) — Trans-Cap, KTP. Prémium.
- **Strom** (CZ) — Vario, Master. Tuzemská kvalita.
- **Bednar** (CZ) — Atlas. Cenově atraktivní.
- **Conow** (DE) — TMH série.
- **Krampe** (DE) — Bandit, BIG body.

**Cena (2026)**: 12 t single = 350 000–600 000 Kč, 18 t tandem = 700 000–1,5 mil. Kč, 24 t tridem = 1,5–3 mil. Kč.`,
    related: ['pto', 'tribod'],
  },

  // ── PLODINY ─────────────────────────────────────────────────────────
  {
    slug: 'kukurice-silazni',
    term: 'Kukuřice silážní',
    alias: ['silage corn', 'krmná kukuřice'],
    kategorie: 'plodiny',
    shortDef: 'Silážní kukuřice se pěstuje na celé rostliny (klasy + lodyhy + listy), sklízí se nezralá a fermentuje na siláž — hlavní krmivo pro skot v ČR.',
    longDef: `Silážní kukuřice je odrůdový typ kukuřice pěstovaný pro **celorostlinnou sklizeň** (na rozdíl od zrnové kukuřice, která sklízí jen klasy). Hlavní krmivo pro skot v ČR — v dojné kravě tvoří 30–60 % objemu krmné dávky.

**Pěstování**:
- **Setí**: konec dubna – polovina května (po Ledových mužích, půda 10 °C).
- **Osivo**: 80 000–110 000 zrn/ha = 22–28 kg/ha.
- **Hnojení**: 150–200 kg N/ha, plus P, K základní hnojení na podzim.
- **Postřik**: pre-em na klíčící plevele (Lumax, Successor) + post-em na druhá vlna (Callisto, Laudis).
- **Sklizeň**: konec srpna – říjen, vlhkost celé rostliny 30–35 % (optimum pro silážování).

**Výnosy**:
- **Zelená hmota**: 30–60 t/ha (průměr ČR 45 t/ha).
- **Sušina**: 10–18 t/ha (silážní).
- **Energie**: 5–8 GJ/ha NEL (čistá energie laktace).

**Sklizeň**:
- **Sklízecí řezačka** (Claas Jaguar, JD 9000, NH FR) — řeže, drtí zrno (cracking), foukne do návěsu.
- **Délka řezky**: 8–22 mm podle obsahu sušiny a typu silážní jámy.
- **Cena sklizňové služby**: 2 000–4 000 Kč/ha + návěsy 800–1 200 Kč/h.

**Silážování**:
- **Silážní jáma** se naplní + utlačuje pásovým traktorem.
- **Zakrytí** plastovou fólií + zatížení (pneumatiky / pytle písku).
- **Fermentace** 4–6 týdnů → ideální krmivo.

**Top CZ regiony**: jižní Morava, Polabská nížina, dolní Posázaví. V severních horských oblastech je sezóna kratší a výnosy nižší.`,
    related: ['osevni-postup', 'orba'],
  },
  {
    slug: 'repka-ozima',
    term: 'Řepka ozimá',
    alias: ['oilseed rape', 'canola'],
    kategorie: 'plodiny',
    shortDef: 'Řepka ozimá je strategická CZ olejovina — pěstuje se na 380–420 tisících ha (12 % orné půdy). Výnos 3,5–4,5 t/ha, hlavně pro biopalivový a potravinářský olej.',
    longDef: `Řepka ozimá (Brassica napus) je nejvýznamnější olejovina v ČR. Pěstuje se na **380–420 tis. ha** = 12 % orné půdy (po pšenici druhá nejrozšířenější plodina).

**Pěstování**:
- **Setí**: 15. srpna – 5. září (přesně, kratší okno → menší výnos).
- **Osivo**: 2–4 kg/ha (hybridy) nebo 5–8 kg/ha (linie). 35–50 zrn/m².
- **Hnojení**: P + K na podzim (200 kg superfosfátu, 150 kg draselné soli). Jaro 150–200 kg N v 2 dávkách (regenerace + butonizace).
- **Postřik**: insekticidy proti dřepčík (podzim), choroby (jarní fungicidy proti hlízence, fómové hnilobě), regulátory růstu.
- **Sklizeň**: konec června – polovina července. Kombajn s řepkovým žacím stolem (Vario lišta).

**Výnosy** (průměr ČR 2024):
- **3,5 t/ha** běžné průměrné podmínky.
- **4,0–4,5 t/ha** dobré roky + premium hybrid.
- **5+ t/ha** špička (vrcholoví farmáři).

**Cenovka** (2024–2026):
- **Realizační cena** 11 000–14 000 Kč/t.
- **Tržba**: 4 t × 12 500 = 50 000 Kč/ha.
- **Náklady**: ~25 000 Kč/ha (osivo 4 000 + hnojiva 8 000 + postřiky 6 000 + mech. 7 000).
- **Marže**: 20 000–30 000 Kč/ha = velmi atraktivní vs obiloviny.

**VCS dotace**: NENÍ (řepka je v EU dlouhodobě konkurenčně silná).

**Trh**:
- **Vykupují**: Komodita Praha, Granaria, Glencore, Agrofert.
- **Použití**: 70 % biopaliva (FAME), 20 % potravinářský olej, 10 % krmiva (řepkové šroty).
- **Konkurence**: import slunečnicový olej (UA, RU), palmový olej (Indonésie).

**Risk**: hubení populací včel kvůli neonikotinoidům (od 2018 EU zákaz aplikace na řepku). Současné insekticidy mají nižší účinnost → vyšší riziko poškození dřepčík.`,
    related: ['osevni-postup', 'ozim-jarin', 'orba'],
  },
  {
    slug: 'sojaova-bob',
    term: 'Sója luštinatá',
    alias: ['sója', 'soybean', 'soja'],
    kategorie: 'plodiny',
    shortDef: 'Sója je nejvýznamnější luskovina světa, v ČR menšinová plodina (15–25 tisíc ha) ale rostoucí. Bohatá na bílkoviny (40 %), váže atmosférický N.',
    longDef: `Sója luštinatá (Glycine max) je nejvýznamnější olejnatá luskovina na světě. V ČR rostoucí plodina (z 5 000 ha v 2010 na ~20 000 ha v 2024), podporovaná VCS dotací 2 800 Kč/ha.

**Pěstování**:
- **Setí**: konec dubna – začátek května, půda min. 8 °C.
- **Osivo**: 110–130 kg/ha. Hladké semínko, vyžaduje přesné setí pneumatickým strojem.
- **Inokulace**: nezbytná! Sójová semena obarvit Rhizobium japonicum bakteriemi pro vazbu N. Bez inokulace = sója si nedělá N a výnos klesne o 30–50 %.
- **Hnojení**: jen P + K (sója si vyrobí N sama). Žádné dusíkaté hnojivo!
- **Postřik**: pre-em (Pulsar), post-em (Pulsar Plus). Insekticidy jen výjimečně.
- **Sklizeň**: konec září – polovina října. Standardní kombajn s řepkovým / sójovým flexihederem.

**Výnosy** (průměr ČR 2024):
- **2,5–3,2 t/ha** běžné.
- **3,5+ t/ha** dobré roky + zavlažování.

**Vlastnosti zrna**:
- **40 % bílkoviny** (vs pšenice 12 %) — nejbohatší rostlinný zdroj.
- **20 % oleje** — sójový olej pro potraviny i biopaliva.
- **Cenovka** (2024): 12 000–16 000 Kč/t.

**Ekonomika** (3 t/ha × 14 000 = 42 000 Kč tržba + 2 800 Kč VCS):
- Tržba ~44 800 Kč/ha.
- Náklady ~22 000 Kč/ha (osivo + inokulace + hnojiva + postřiky + mech).
- **Marže ~22 000 Kč/ha** = porovnatelné s řepkou, ale nižší riziko.

**Proč v CZ rostou plochy**:
- **EU snaha o nezávislost na importu sóji** z Brazílie/Argentiny (kde se odlesní pro pěstování).
- **VCS bonus 2 800 Kč/ha** = +30 % výnos.
- **Vazba N** zlepšuje strukturu půdy pro následnou plodinu.
- **Tržní cena** rostoucí kvůli krmnému průmyslu (sójový šrot pro prasata, drůbež).

**Rizika**:
- **Sucho v srpnu** (kvetení) = výrazný pokles výnosu.
- **Nemoci** Sclerotinia (hlízenka) — limit pro region.
- **Holuby** rádi sklízejí na poli (riziko 5–10 % ztráty).`,
    related: ['osevni-postup', 'cap-2024'],
  },
  {
    slug: 'vojteska',
    term: 'Vojtěška setá',
    alias: ['Medicago sativa', 'alfalfa', 'lucerne'],
    kategorie: 'plodiny',
    shortDef: 'Vojtěška je víceletá pícnina (3–5 let na 1 pozemku) bohatá na bílkoviny. Sklízí se 3–4× ročně, váže N, zlepšuje strukturu půdy.',
    longDef: `Vojtěška setá (Medicago sativa) je nejlepší pícninové luskovina v mírném klimatu. **Víceletá** plodina — sází se na 3–5 let, sklízí se 3–4× za sezónu (3 v ČR, 4 v jižní Itálii).

**Pěstování**:
- **Setí**: jaro (březen–duben) jako "podsev" pod obilí (žito, ječmen) nebo čistý porost.
- **Osivo**: 15–25 kg/ha. Inokulace Sinorhizobium meliloti nutná.
- **Hnojení**: jen P + K na podzim (200 kg superfosfátu, 100 kg KCl). Žádný N (vlastní fixace 200–300 kg N/ha/rok).
- **Žádný postřik** na samotnou vojtěšku (silně konkurenční plevele potlačí).

**Sklizeň** (3× za sezónu v CZ):
- **1. seč**: polovina května (50 % květu — nejvyšší obsah bílkovin).
- **2. seč**: konec června.
- **3. seč**: konec srpna.
- Případně **4. seč** v září (low yield, jen pro silný porost).

**Výnos** (3-letý průměr):
- **8–12 t sušiny/ha/rok** celkem (rozděleno do 3–4 sečí).
- **Cca 25 % bílkovin** v sušině.

**Použití**:
- **Senáž / siláž** pro skot — luckni baliky.
- **Seno** klasické (přírodní sušení).
- **Zelená píce** pro pastvy nebo přímou aplikaci do žlabu.
- **Granulát** pro průmyslové krmiva (sušárenský granulát).

**Přínos do osevního postupu**:
- **Vazba N** 200–300 kg/ha/rok — zásadní bonus pro následnou plodinu.
- **Hluboký kořen** (až 3 m) — narušuje utužení podorničí, dostává živiny z hloubky.
- **Zlepšuje strukturu půdy** — vojtěška za 3 roky obnoví humus.
- **Po vojtěšce** typicky pěstuje pšenice ozimá (vysoký výnos díky N + struktuře).

**Trh**:
- **Cenovka senáž v balíkách**: 1 800–3 000 Kč/t (regionální).
- **Cenovka granulát**: 4 000–6 000 Kč/t.
- **CAP**: vojtěška kvalifikuje na EKO režim (zelená plocha) + AEKO travní porosty.

**Důležité plemena**: Verdor (FR), Power (US), Niagara (FR), domácí Kometa (CZ).`,
    related: ['osevni-postup', 'organicka-hmota', 'mezi-plodiny'],
  },

  // ── TECHNOLOGIE & PRECISE FARMING ──────────────────────────────────
  {
    slug: 'telematika',
    term: 'Telematika',
    alias: ['JDLink', 'AFS Connect', 'MyPLM', 'PLM Connect', 'fleet management'],
    kategorie: 'precise-farming',
    shortDef: 'Telematika je systém vzdáleného sledování stroje přes mobilní síť — sleduje pozici, motohodiny, spotřebu, chyby. Standard u prémiových traktorů od 2010.',
    longDef: `Telematika v zemědělství je obdoba GPS trackeru v osobních autech, ale rozšířená o **technická data stroje** (CAN-bus). Stroj odesílá data do cloudové platformy přes mobilní síť (LTE), kde majitel / dealer vidí real-time stav.

**Hlavní platformy** (per značka):
- **John Deere Operations Center** (Ops Center) + JDLink — nejrozsáhlejší. Sleduje 100+ parametrů, agronomy mapy, prediktivní údržbu.
- **Case IH AFS Connect** + Trimble Display — společná s NH.
- **New Holland PLM Connect** — sklizňové mapy, GPS prefix.
- **Fendt Connect** + FendtONE — bezdrátové aktualizace, telemetrie.
- **Claas TELEMATICS** — sklizňové analytiky.
- **AGCO Fuse** (Massey, Valtra, Fendt) — sjednocená platforma.
- **Trimble Connected Farm** — multi-brand pro starší stroje.

**Co sleduje**:
- **GPS pozice** v real-time, historie tras.
- **Motohodiny** + uptime / downtime.
- **Spotřeba paliva** per hektar / per hodinu.
- **Otáčky motoru, převodovka, výkon, zátěž**.
- **Chybové kódy** — okamžitá notifikace SMS / email.
- **Sklizňové mapy** (kombajny) — výnos per GPS bod.
- **AdBlue, DPF stav** — varování před regenerací / doplněním.
- **Vstup do "geofence"** — alarm při výjezdu z farmy / krádeži.

**Cenová politika** (2026):
- **JD Operations Center**: zdarma pro majitele JD stroje (3-letá subskripce při nákupu).
- **Fendt Connect**: zdarma 5 let, pak 800–1 500 Kč/rok.
- **AGCO Fuse**: variabilní podle balíčku.
- **Trimble Connected Farm**: 5 000–15 000 Kč/rok per stroj.

**Pro CZ farmáře**:
- **U malých farem** často nevyužité — paperwork v Excelu funguje.
- **U farem 200+ ha** s 3+ stroji už dává smysl — flota management, prediktivní údržba.
- **Sklizňové podniky** standardně využívají pro per-zákazník účtování motohodin a sklizených ha.

**Soukromí / data ownership**: kontroverze — kdo vlastní agronomická data? V EU GDPR řeší PII, ale produkční data má smluvně přístup výrobce (využívá pro vývoj). Někteří farmáři tlačí na "Farm Data Privacy" iniciativy.`,
    related: ['isobus', 'gps-rtk', 'yield-monitor'],
  },
  {
    slug: 'autonomni-traktor',
    term: 'Autonomní traktor',
    alias: ['autonomous tractor', 'driverless'],
    kategorie: 'precise-farming',
    shortDef: 'Autonomní traktor jezdí po poli bez řidiče — kombinuje RTK GPS + LiDAR + kamery + AI. Demonstrované 2022+ (JD 8R Autonomous), komerčně dostupné pomalu.',
    longDef: `Autonomní traktor je další úroveň přesného zemědělství — stroj jezdí po poli **úplně bez řidiče v kabině**. Kombinace technologií:

- **RTK GPS** (centimetrová přesnost trasy).
- **LiDAR** (3D mapování okolí, detekce překážek).
- **Multispektrální kamery** (rozpoznávání plodiny vs plevele).
- **AI** (rozhodování v reálném čase).
- **5G konektivita** (vzdálené ovládání + dohled).

**Současné komerční ukázky**:
- **John Deere 8R Autonomous** (CES 2022): plně autonomní traktor s 6 kamerami a NVIDIA Jetson AI. K dispozici 2023+ na vybraných trzích v USA. Cena ~$800 000 ($300K příplatek nad standardní 8R).
- **Case IH Autonomous Concept** (2016): koncept bez kabiny vůbec. Nedošlo na komerci.
- **AGCO Fendt MARS** (2019): roj malých autonomních robotů místo jednoho velkého. Stále výzkum.
- **Bear Flag Robotics** (Trimble dceřinka, 2021 akvizice JD): retrofit autonomního systému na stávající traktory.
- **Monarch Tractor** (US startup, 2020+): autonomní elektrický traktor 70 koní pro vinohrady. Cena $58 000.

**Stav v ČR (2026)**:
- **Žádný autonomní traktor reálně v provozu**.
- **Dílčí autonomní funkce** (auto-steering, section control, automatický headland turning) jsou standardem u prémiových traktorů.
- **Regulace** pro autonomní stroje na poli zatím není (na silnici by byl problém s řidičským průkazem).

**Bariéry komerčního nasazení**:
- **Cena** — premium $300 000 nad běžný traktor je pro 99 % farmářů nedosažitelná.
- **Bezpečnost** — pole nejsou izolovaný kontrolovaný prostor jako továrna. Riziko sražení člověka / zvířete.
- **Regulace** — EU dosud nedefinovala jasná pravidla pro autonomní polní stroje.
- **ROI** — řidič stojí 30 000–50 000 Kč/měsíc, autonomní stroj se vyplatí jen u velkofarmu s 24/7 provozem.

**Realistická timeline**:
- **2025–2030**: autonomie pro úzké úlohy (postřik, sečení) pro velkofarmu.
- **2030+**: rozšíření pro CZ střední farmy, cenová dostupnost.
- **2035+**: standard.

**Aktuálně doporučujeme** pro CZ farmáře využít **semi-autonomní funkce** (auto-steering, ISOBUS, telematika) — 80 % benefitu za 20 % ceny.`,
    related: ['auto-steering', 'gps-rtk', 'telematika', 'isobus'],
  },
  {
    slug: 'drony-zemedelstvi',
    term: 'Drony v zemědělství',
    alias: ['UAV', 'agriculture drone', 'precision drone'],
    kategorie: 'precise-farming',
    shortDef: 'Drony v zemědělství slouží pro: monitoring (multispektrální NDVI snímky), aplikaci (postřik, výsev meziplodin), kontrolu (krádeže, povodně). Standard pro precizní farmáře.',
    longDef: `Drony (UAV — Unmanned Aerial Vehicles) v zemědělství plní 3 hlavní úkoly:

### 1. Monitoring (nejčastější)
- **Multispektrální snímkování** — RGB + NIR kamera, výpočet NDVI / EVI indexů biomasy.
- **3D mapování** — výška rostlin, deformace polí.
- **Letové výšky** 50–120 m, pokrytí 50–200 ha za hodinu.
- **Drone modely**: DJI Phantom 4 Multispectral ($6 000), DJI Mavic 3 Multispectral ($5 500), Parrot Anafi USA ($7 000), eBee X ($25 000+ profesionál).

### 2. Aplikace (postřik / výsev) — rostoucí
- **Spray drones** — Yamaha RMAX (JP), DJI Agras T40/T50, EAVision EA-30X.
- **Užitečné zatížení**: 30–40 l postřiku, záběr 8–11 m.
- **Výkon**: 4–10 ha/h.
- **Cena**: $15 000–50 000 dron + $5 000–15 000 baterie + softvér.
- **V ČR**: zatím **málo nasazené** — regulace SUR (Sustainable Use Regulation EU) komplikuje letecké postřikování (potřeba speciální povolení).

### 3. Kontrola a bezpečnost
- **Patrolovací drony** — kontrola plotů, krádeží.
- **Tepelné kamery** — detekce zvířat před sečením (chrání srnčata).
- **Povodňové mapování** — DJI Mavic s thermal kamerou.

### Regulace v ČR (EASA + ÚCL):
- **Otevřená kategorie** (A1/A2/A3) pro drony pod 25 kg za vizuální dohled.
- **Specifická kategorie** pro letecké aplikace postřiku — vyžaduje OSO (Operations Specific Operations) povolení od Úřadu civilního letectví.
- **Pilot certifikát** A1/A3 zdarma online, A2 za 800 Kč.
- **Registrace operátora** povinná (€19/rok).

### Pro CZ farmáře (2026):
- **Monitoring** — DJI Mavic 3 Multispectral je sweet spot pro 100–500 ha farmy. ROI 1–2 sezóny díky úspoře hnojiv (variabilní dávkování).
- **Aplikace** — zatím **drahé a regulačně náročné**. Klasický postřikovač s GPS + Section Control vychází lépe.
- **Tepelné kamery** — pro velké TTP s vysokou pravděpodobností srnčat, ekonomicky náročné.`,
    related: ['ndvi', 'variable-rate', 'section-control'],
  },

  // ── DOTACE & REGULACE ──────────────────────────────────────────────
  {
    slug: 'sp-szp-2023-2027',
    term: 'SP SZP 2023–2027 (Strategický plán)',
    alias: ['Strategický plán SZP', 'Common Agricultural Policy Strategic Plan'],
    kategorie: 'dotace',
    shortDef: 'SP SZP 2023–2027 je národní implementace EU Společné zemědělské politiky pro ČR. Definuje všechny dotační tituly (přímé platby, AEKO, investice).',
    longDef: `Strategický plán Společné zemědělské politiky (SP SZP) je závazný dokument schválený EU komisí pro každý členský stát zvlášť pro období 2023–2027. **Pro ČR** definuje rozpočet ~110 mld Kč pro 5leté období a všechny dotační tituly.

**Struktura SP SZP ČR**:

### Pilíř I — Přímé platby (~50 % rozpočtu):
- **BISS** (Základní platba) ~2150 Kč/ha
- **CISS** (Redistributivní) ~1450 Kč/ha pro prvních 150 ha
- **EKO režim** základní 1300 + premium +1100 Kč/ha
- **ANC** (méně příznivé) 2000–4500 Kč/ha
- **Mladý zemědělec** +1500 Kč/ha bonus
- **VCS** (citlivé sektory) — variabilní

### Pilíř II — Rozvoj venkova (PRV):
- **AEKO** smlouvy (5-leté agro-environmentální)
- **Investiční tituly** (Intervence 33.73, 37.73, ad.)
- **LFA** (Less Favoured Areas — překryto s ANC)
- **Welfare zvířat** zvláštní platby
- **Bio prémie** pro ekologické zemědělství
- **Pojištění úrody** (50 % spoluúčast státu)

**Klíčové intervence** (číselné označení v SP SZP):
- **33.73** — Investice do zemědělských podniků (technika, stavby).
- **37.73** — Technologie snižující emise (hnojení s nižším NH₃).
- **47.73** — Pozemkové úpravy.
- **51.73** — Mladí zemědělci — jednorázová podpora na zahájení.
- **75.73** — AEKO travní porosty.

**Dokumentace pro žadatele**:
- **Hlavní dokument**: https://eagri.cz/web/mze/dotace/sp-szp-2023-2027
- **SZIF Pravidla** pro každý titul zvlášť — vždy ověřit aktuální verzi (mění se ročně).
- **Portál farmáře** — elektronické podání všech žádostí.

**Pro CZ farmáře**:
- **Jednotná žádost** (duben–červen) pokrývá většinu přímých plateb.
- **Investiční dotace** mají vlastní kola (typicky 2× ročně).
- **AEKO smlouvy** se zavírají na 5 let — vstup je dlouhodobé rozhodnutí.

**Kontroly**: SZIF kontroluje 1–5 % žadatelů na místě + satelitní monitoring (Copernicus SISAEC) celého LPIS každý rok.`,
    related: ['cap-2024', 'biss', 'aeko', 'jednotna-zadost'],
  },
  {
    slug: 'intervence-33-73',
    term: 'Intervence 33.73 (Investice do zemědělských podniků)',
    alias: ['Investice do zemědělství', 'PRV investice', 'I.33.73'],
    kategorie: 'dotace',
    shortDef: 'Intervence 33.73 je hlavní investiční dotace v ČR — pokrývá nákup techniky, stavby, technologie. Sazba 50–60 % způsobilých výdajů, 10 % bonus pro mladé zemědělce.',
    longDef: `Intervence 33.73 je nejdůležitější investiční dotace pro CZ zemědělce. Kryje:

**Způsobilé výdaje**:
- **Stroje a technika** — traktory, kombajny, secí stroje, postřikovače, lisy, sklízecí mlátičky, manipulátory.
- **Stavby pro živočišnou výrobu** — stáje, dojírny, sila.
- **Stavby pro skladování** — silá, šrotovny, mrazírny.
- **Technologie precise farming** — GPS, ISOBUS, variable rate aplikace.
- **Závlahy** — investice do zavlažovacích systémů.

**Sazby dotace** (procento ze způsobilých výdajů, 2024):
- **50 %** — rostlinná výroba.
- **60 %** — živočišná výroba (welfare bonus).
- **+10 % pro mladé zemědělce** (do 40 let, prvních 5 let od zahájení činnosti).
- **+10 % pro zóny ANC** (méně příznivé oblasti).
- **+5 % pro spolupráci** (mezi farmami / s výzkumem).

Maximální sazba kumulovaně: **80 % způsobilých výdajů**.

**Omezení**:
- **Mobilní stroje** (traktory, kombajny) — max 49 % způsobilých výdajů z celého projektu. Zbytek musí být stavby / pevná technologie.
- **Strop dotace per projekt**: 1–10 mil. Kč podle velikosti farmy.
- **Strop dotace per žadatel za období**: 30 mil. Kč 2023–2027.

**Postup žádosti**:
1. **Příprava projektu** — návrh, podnikatelský plán, ekonomické vyhodnocení.
2. **Vyhlášení kola** (typicky 2× ročně) — SZIF zveřejní podmínky.
3. **Podání** přes Portál farmáře v rámci 3-4 týdenního okna.
4. **Hodnocení** (3–6 měsíců) — bodové hodnocení projektu.
5. **Rozhodnutí** — pozitivní / odložené / zamítnuté.
6. **Realizace** (1–3 roky) — nákup techniky, stavba, dokumentace.
7. **Závěrečná žádost o platbu** — vyplacení dotace po prokázání investice.

**Praktické tipy**:
- **Konzultant** specializovaný na PRV výrazně zvyšuje šanci schválení (3 000–15 000 Kč za projekt). Ve smlouvě obvykle 2–5 % z dotace = úspěšnostní bonus.
- **Časování**: kupujte techniku až **po schválení dotace**, ne před. Před schválení = neuznatelný výdaj.
- **Dokumentace**: faktury, smlouvy, fotodokumentace průběhu, ekonomická prokazatelnost.

**Riziko**: nesplnění podmínek (např. provozování stroje min. 5 let, kvalita stavby) = **vrácení dotace s úroky**. Standardně auditováno SZIF v posledních letech.`,
    related: ['sp-szp-2023-2027', 'cap-2024', 'aeko'],
  },
  {
    slug: 'agrarni-komora',
    term: 'Agrární komora ČR (AK ČR)',
    alias: ['AKČR', 'agrární komora'],
    kategorie: 'regulace',
    shortDef: 'AK ČR je hlavní zájmová organizace zemědělců, lesníků a potravinářů v ČR — sdružuje cca 5 000 členů, lobbuje za zájmy oboru u vlády a EU.',
    longDef: `Agrární komora ČR (AK ČR) je největší zájmová organizace zemědělců, potravinářů, lesníků a vinařů v ČR. Založená 1993 zákonem č. 301/1992 Sb.

**Členská základna**: cca **5 000 fyzických a právnických osob** napříč obory.

**Hlavní role**:
- **Lobbying** u Ministerstva zemědělství, vlády a europoslanců — zájmy CZ zemědělství v EU CAP, výjimky pro CZ specifika.
- **Připomínkové místo** v legislativním procesu — všechny zákony týkající se zemědělství procházejí AK ČR.
- **Zastupování** v COPA-COGECA (evropský zemědělský lobby v Bruselu).
- **Poradenství** členům — daňové, dotační, právní.
- **Vzdělávání** — semináře, kongresy, výstavy (Země živitelka v ČB).
- **Certifikace** — Klasa, Český výrobek, regionální značky.

**Struktura**:
- **Prezidium** — výkonný orgán, 5letý mandát.
- **Snem** — nejvyšší orgán, 1× ročně.
- **8 sekcí** podle oboru: rostlinná výroba, živočišná, lesnictví, vinařství, ovocnářství, zelinářství, mlékárenství, masný průmysl.
- **14 regionálních komor** (per kraj).

**Členský příspěvek** (2024):
- **Fyzická osoba**: 1 200–3 600 Kč/rok podle velikosti farmy.
- **Právnická osoba**: 5 000–50 000 Kč/rok podle obratu.
- **Bonus**: členové dostávají časopis Zemědělec, právní helpdesk, dotační poradenství.

**Kontroverze**:
- **Politická angažovanost** — historicky úzké vazby na ČSSD, dnes neutrálnější.
- **Konflikt zájmů velkých vs malých farem** — AK ČR často kritizována za prosazování zájmů velkých agro-holdingů (Agrofert ad.) na úkor rodinných farem.
- **Konkurence**: Asociace soukromého zemědělství (ASZ) — alternativa pro malé farmy.

**Pro CZ farmáře**: členství dává smysl pro farmy s 100+ ha (využíjí dotační poradenství a lobbying). Pro hobby farmy do 10 ha často přínos minimální.

**Web**: https://www.akcr.cz`,
    related: ['sp-szp-2023-2027', 'cap-2024'],
  },

  // ── PRAKTICKÉ / OSTATNÍ ────────────────────────────────────────────
  {
    slug: 'siloky-balik',
    term: 'Silážní balík',
    alias: ['siláž balíky', 'baled silage', 'wrapping'],
    kategorie: 'agrotechnika',
    shortDef: 'Silážní balík je oválný balík zelené píce (vojtěška, jetel, traviny) zabalený v plastové fólii pro fermentaci. Alternativa k velké silážní jámě pro menší farmy.',
    longDef: `Silážní balík je metoda silážování v kompaktních balících (vs klasická silážní jáma). Pro CZ farmy do 200 dojnic je často ekonomičtější než budování silážní jámy.

**Pracovní postup**:
1. **Sečení** — žacím strojem s kondicionérem (rolováním stébel pro rychlejší vysoušení).
2. **Sušení** v řádcích na poli 6–24 h (na sušinu 30–45 %).
3. **Obracení / shrnování** — obraceč, shrnovač pro homogenní řádek.
4. **Balování** — kulatý lis (round baler) tvoří válcové balíky 1,2 × 1,2 m (cca 600 kg) nebo 1,5 × 1,2 m (800–1000 kg).
5. **Wrapping** — okamžitě po balení (do 2 h) zabalit do plastové fólie. Wrapper navíjí 4–8 vrstev (cca 25–35 m fólie per balík).
6. **Skladování** — balíky stahovat na 1 stranu (snazší doprava), kontrola na promáčknutí / poškození fólie.

**Stroje + cena (2026)**:
- **Lis kulatý** (round baler) — 350 000 – 1,5 mil. Kč. Top značky: Krone, John Deere, Massey Ferguson, Vicon, Welger, Kverneland.
- **Wrapper** — 200 000 – 800 000 Kč. Hi-Spec wrapper / Pöttinger / McHale.
- **Kombi (lis + wrapper v jednom)** — 800 000 – 2,2 mil. Kč. McHale Fusion, Krone Comprima Wrap, Kuhn iBio.

**Náklady na balík** (orientačně):
- **Fólie**: 80–120 Kč/balík (6 vrstev = 30 m × 4 Kč/m).
- **Práce + traktor**: 100–200 Kč/balík.
- **Amortizace strojů**: 50–150 Kč/balík.
- **Celkem**: 230–470 Kč/balík = 230–470 Kč/600 kg = **0,40–0,80 Kč/kg sušiny**.

Pro srovnání **silážní jáma**: 0,15–0,30 Kč/kg sušiny (levnější), ale jednorázová investice 1–5 mil. Kč na stavbu.

**Kdy se vyplatí balíky**:
- **Malá / střední farma** (do 100 dojnic) — nepotřebuje 2000 t silážní jámy.
- **Malé pozemky** s rozdílnými plodinami — flexibilita.
- **Bez stálé staveb pozemku** — nájemné pole, krátkodobé hospodaření.
- **Krmení mimo farmu** — prodej balíků sousedním chovatelům.

**Top značky pro lisy**: McHale (IE), Krone Comprima (DE), JD 870 (US), MF RB 4180 (US), Kuhn FB 3140 (FR).`,
    related: ['osevni-postup', 'vojteska'],
  },
  {
    slug: 'dojirna',
    term: 'Dojírna (typy)',
    alias: ['milking parlor', 'milkroom'],
    kategorie: 'technologie',
    shortDef: 'Dojírna je technologie pro dojení skotu — od rybí kosti přes paralel po robot. Volba ovlivňuje pracovní výkon, welfare a investiční náklady.',
    longDef: `Dojírna je technologický komplex pro dojení dojnic. V CZ dominantní u stájí 50+ dojnic.

**Hlavní typy**:

### 1. Rybí kost (Fishbone)
- **Pozice krav**: pod úhlem 30° k pracovní jámě.
- **Velikost**: 2×4 až 2×12 stání.
- **Výkon**: 60–80 krav/hod.
- **Pro stádo**: 50–200 dojnic.
- **Cena**: 500 000 – 2 mil. Kč.
- **Plus**: jednoduchá, ověřená, levná.
- **Mínus**: pomalá vs novější systémy.

### 2. Paralel (Parallel)
- **Pozice krav**: kolmo k pracovní jámě, dojič za zadkem.
- **Velikost**: 2×8 až 2×24.
- **Výkon**: 100–140 krav/hod.
- **Pro stádo**: 100–500 dojnic.
- **Cena**: 1,5–6 mil. Kč.
- **Plus**: kompaktní (užší než fishbone), vyšší výkon.
- **Mínus**: dojič nemá výhled na vemena přední řady.

### 3. Karusel (Rotary)
- **Pozice krav**: na rotující plošině.
- **Velikost**: 24–80 stání.
- **Výkon**: 150–300 krav/hod.
- **Pro stádo**: 300+ dojnic.
- **Cena**: 5–25 mil. Kč.
- **Plus**: extrémní výkon, kontinuální tok krav.
- **Mínus**: extrémní investice, vyžaduje 24/7 provoz pro návratnost.

### 4. Robot (AMS — Automatic Milking System)
- **Pozice**: krávy si přicházejí samy 2–3× za den.
- **Výkon**: 60–80 dojnic per robot (jednotka).
- **Pro stádo**: 60+ dojnic per robot, modulární.
- **Cena**: 4–6 mil. Kč per robot + 1–2 mil. Kč instalace.
- **Plus**: automatizace 24/7, žádný dojič, welfare (kráva si určuje rytmus), data per kráva.
- **Mínus**: vysoká investice, závislost na elektronice, vyžaduje optimalizovanou stáj.

**Top značky**:
- **DeLaval** (SE) — VMS robot, fishbone, paralel, karusel. Tradiční lídr.
- **Lely** (NL) — Astronaut robot. Nejprodávanější AMS na světě.
- **GEA Westfalia** (DE) — DairyRobot, Magnum karusel.
- **BouMatic** (US) — paralel, fishbone, robot.
- **Fullwood** (UK) — fishbone, paralel.

**Ekonomika** (orientačně pro stádo 200 dojnic):
- **Fishbone 2×10**: investice 1,8 mil. Kč, 2 dojiči × 4 h × 2× denně.
- **Paralel 2×16**: investice 3,5 mil. Kč, 1 dojič × 3,5 h × 2× denně.
- **3× Lely Astronaut**: investice 18 mil. Kč, 0 dojičů.
- **Per liter mléka**: fishbone 0,30 Kč/l, paralel 0,25, robot 0,40 (vyšší fixní, nižší variabilní).

V CZ 2024: cca **70 % farem fishbone/paralel**, **20 % karusel/rapid exit**, **10 % AMS robot** (roste rychle, hlavně mladé generace farmářů).`,
    related: ['telematika', 'rijnost', 'usni-znamka'],
  },

  // ── HISTORIE A ARCHAICKÉ POJMY ──────────────────────────────────────
  {
    slug: 'uhor',
    term: 'Úhor',
    alias: ['úhorování', 'ladina', 'pasivní úhor'],
    kategorie: 'historie',
    shortDef: 'Úhor je dočasně neoseté pole, které se nechává odpočinout, regenerovat živiny a potlačit plevele. V historickém trojhonném systému ležela 1/3 polí ladem každý rok. Dnes přežívá jako „zelený úhor" pro greening a EFA.',
    longDef: `Úhor (od slovesa „úhořit" = odpočívat) je pole, které se po sklizni **dočasně neosévá**, aby si půda mohla regenerovat živiny, vodu a strukturu. Historicky byl základní součástí evropského zemědělství až do 19. století.

**Trojhonné hospodářství** (= třípolní systém, viz [[trojhonny-system]]):
- 1. hon: ozim (žito, pšenice)
- 2. hon: jarin (oves, ječmen)
- 3. hon: **úhor** (ladem, pase se nebo orá)

Třetina polí každý rok ležela ladem. Bez minerálních hnojiv to byl jediný způsob, jak udržet úrodnost. Hospodář na úhoru obvykle:
- nechal **paseni dobytka** — ten hnojil pole čerstvým hnojem
- **přerýval** (Bramborová orba) → ničil plevele
- **zelený podsev** vojtěškou nebo jetelem (od 18. století) — fixoval dusík

**Konec úhoru:** Mineralní hnojiva (Liebig 1840s, syntéza čpavku Haber-Bosch 1909) odstranila nutnost úhoru. Norfolský 4-honný systém (vojtěška-pšenice-řepa-ječmen) bez úhoru dramaticky zvýšil produktivitu — anglická zemědělská revoluce.

**Moderní typy úhoru:**
- **Zelený úhor** (greening, EFA — Ecological Focus Area) — povinný v rámci CAP od 2015. Mez plodina, květinový pás nebo prostě neoseté ladem s povolenou seč.
- **Černý úhor** — orané, neoseté pole. Dnes spíše ekologicky problematický (eroze).
- **Aktivní úhor** — pásy nektarodárných rostlin pro opylovače, biopásy, biopas (viz [[biopasy]]).
- **Půda v zařazení** — pole vyjmuté z osevu na 1-2 roky kvůli regulaci trhu.

V CZ dnes:
- Z dotace BISS lze do **5 % výměry hospodaření** vykázat jako úhor (EFA), počítá se za "klimatický příspěvek".
- Plocha úhoru v CZ 2024: ~50 000 ha (1,2 % orné půdy).

Etymologie: praslovanské *ǫgorъ* (= pole nechané ladem). Související slova: **ladina** (úhor po více letech), **honitba** (revír na úhoru), **pole** (kontrast: pole = obdělávané, úhor = ne).

Viz též [[trojhonny-system]], [[osevni-postup]], [[mezi-plodiny]], [[biopasy]], [[regenerativni-zemedelstvi]].`,
    related: ['trojhonny-system', 'osevni-postup', 'mezi-plodiny', 'biopasy', 'regenerativni-zemedelstvi'],
  },
  {
    slug: 'trojhonny-system',
    term: 'Trojhonný systém',
    alias: ['třípolní systém', 'trojpolní hospodářství', 'třípolové hospodářství'],
    kategorie: 'historie',
    shortDef: 'Trojhonný systém je středověký osevní postup, který rozděloval ornou půdu na tři hony — ozim, jarin, úhor. Každý rok se hony střídaly. Dominoval v Evropě od 9. do 19. století.',
    longDef: `Trojhonný systém (také třípolní systém, něm. *Dreifelderwirtschaft*) je středověký a raně novověký **osevní postup**, který nahradil starší dvojhonný systém (ozim/úhor). Vznikl v karolinské době (9. století) a v Evropě dominoval téměř 1 000 let.

**Princip:**
Orná půda vesnice byla rozdělena na **tři hony** (= velké pole sestávající z mnoha úzkých záhonů jednotlivých sedláků). Každý rok se osévalo:
- **1. hon (ozim)**: pšenice nebo žito, seté na podzim
- **2. hon (jarin)**: oves nebo ječmen, seté na jaře
- **3. hon (úhor)**: ladem, pasivně, paseni dobytka pro hnůj

Následující rok se vše posunulo o jeden — ozim → úhor → jarin → ozim atd. Cyklus 3 roky.

**Výhody (vs dvojhonný):**
- 2/3 půdy aktivně obdělané (vs 1/2 v dvojhonném)
- Vyšší produktivita, lepší výživa populace
- Dvě sklizně ročně (ozim v červenci, jarin v září)
- Lepší distribuce práce přes rok

**Nevýhody (z dnešního pohledu):**
- 1/3 půdy stále ležela ladem
- Nízké výnosy (1,5–2 t/ha pšenice — dnes 8 t/ha)
- Žádné okopaniny (brambory, řepa) — ty přišly až v 18. století
- Sociální strnulost: každý sedlák měl pruhy ve všech třech honech, vesnice musela rozhodovat společně co kdy sít

**Konec systému (přechod 1750–1900):**
- **Norfolský 4-honný systém** (UK, 1730s): vojtěška-pšenice-řepa-ječmen — bez úhoru, vyšší výnosy.
- **Marie Terezie a Josef II.** (CZ 1750–1790): patenty rušily nucené trojpolní hospodářství, povolovaly individuální rozhodování sedláků.
- **Liebig + mineralní hnojiva** (1840+): umožnily kontinuální osev.
- **19. století**: scelování pozemků (komasace), individuální farmy, moderní střídání plodin.

V CZ trojhonný systém zanikl postupně 1780–1850, posledně v některých horských oblastech (Šumava, Krkonoše) ještě začátkem 20. století.

**Pozůstatky v krajině:**
- **Lineární cesty** mezi pole v plužině (záhonové parcelaci)
- **Mezní kameny** (viz [[mez]]) označující hranice
- **Pomístní názvy**: „Velký hon", „Horní hon", „Dolní hon"
- **Trojstrukturální vinice** na jižní Moravě (vinařské varianty)

Viz též [[uhor]], [[osevni-postup]] (moderní), [[mez]], [[lan]].`,
    related: ['uhor', 'osevni-postup', 'mez', 'lan'],
  },
  {
    slug: 'mez',
    term: 'Mez',
    alias: ['mezní pás', 'mezník', 'remízek'],
    kategorie: 'historie',
    shortDef: 'Mez je úzký travnatý nebo křovinatý pás oddělující sousední pole. Historicky vyznačovala hranice mezi vlastníky, dnes je ceněna pro biodiverzitu, ochranu proti erozi a v rámci CAP greening.',
    longDef: `Mez (od staročeského *meža* = hranice) je **úzký travnatý nebo křovinatý pás** mezi dvěma poli. Historicky to byl praktický předěl mezi vlastníky půdy (hranice plužiny) i ochrana proti splachu půdy.

**Funkce historicky:**
- **Hraniční pás** — viditelně oddělovala vlastnictví. Často s **mezníky** (kameny, sloupy) na rozích.
- **Krajinný prvek** — domov pro zvěř, ptactvo, hmyz. Nebyla intenzivně obdělávaná.
- **Cesta pro povozy** — širší meze sloužily jako polní cesty.
- **Pastva pro drobný dobytek** — kozy, ovce se pásly „na mezích" když pole bylo osetá.

**Likvidace mezí 1948–1989** (kolektivizace):
JZD a státní statky **sceelovaly pole do obřích bloků** (často 50–200 ha) pro nasazení velké techniky (T-150, Š-180, Fortschritt). Tisíce kilometrů mezí v ČR padlo. Důsledky:
- Akcelerace **vodní eroze** (žádné zelené pásy zachycující splach)
- Pokles **biodiverzity** (zánik útočiště pro hmyz, ptáky, drobnou zvěř)
- Vznik velkých homogenních „prérií"
- Změny mikroklimatu (sušší krajina, větru otevřená)

**Návrat mezí 1990–dnes:**
- **CAP greening / EFA**: meze, biopásy, květinové pásy se počítají jako Ecological Focus Area (3–5 % výměry).
- **AEKO podopatření**: dotace za údržbu mezí (50–80 Kč/m délky/rok).
- **Erozní kontrola** v erozně ohrožených oblastech (DPB) — GAEC 2 vyžaduje protierozní opatření, meze jsou jedním z nástrojů.
- **Krajinotvorné prvky** — meze ze zákona chráněné (Zákon č. 114/1992 Sb.).

**Šířka mezí dnes:**
- **Klasická mez** šíře 1–3 m mezi poli
- **Široká mez** 5–10 m, často s keři (trnka, šípek, hloh) — pro vodní hospodářství
- **Lineární remízek** 10+ m — funguje jako biotop
- **Biokoridor** 20+ m — propojuje větší biotopy

**Pomístní názvy s „mez"** jsou v ČR všudypřítomné: „Na Mezích", „Velká mez", „Mezní cesta", „U mezníku", obce „Meznice", „Meziroka", „Meziboří".

Viz též [[biopasy]], [[eroze-pudy]], [[trojhonny-system]], [[gaec]], [[lan]].`,
    related: ['biopasy', 'eroze-pudy', 'trojhonny-system', 'gaec', 'lan'],
  },
  {
    slug: 'robota',
    term: 'Robota',
    alias: ['poddanská robota', 'panská robota', 'tažná robota'],
    kategorie: 'historie',
    shortDef: 'Robota byla povinná neplacená práce poddaných sedláků na panské půdě, hlavní forma feudální renty v českých zemích od 11. do 19. století. Zrušena 1848 (formálně) a 1849 (definitivně).',
    longDef: `Robota (od slovesa *robotiti* = pracovat, otročit) byla **povinná neplacená práce** poddaných sedláků na půdě vrchnosti (šlechty, klášterů, krále). V českých zemích to byla hlavní forma feudální renty od 11. do 19. století.

**Typy roboty:**
- **Tažná robota** — práce s párem koní nebo volů (orba, hnojení, žně, vožení). Pro „láníky" s celým lánem.
- **Pěší robota** — manuální práce (kopání, plení, kosa, hrabání). Pro chalupníky a domkáře.
- **Ženská robota** — přadlení, pletení, žně, sklizeň ovoce.
- **Mimořádná robota** — stavby (mlýny, panská sídla), lov pro vrchnost.

**Rozsah:**
Robotní povinnosti se odvíjely od velikosti gruntu (viz [[grunt]], [[lan]]):
- **Láník (celý lán, 17+ ha)**: 3 dny tažné roboty týdně + sezónní špičky (žně, vinobraní)
- **Půlláník**: 2 dny tažné + 1 den pěší
- **Chalupník**: 1–2 dny pěší týdně
- **Domkář (bez půdy)**: jen sezónní

Plus **naturální dávky** (desátek, vejce, slepice) a peněžní daně.

**Klíčové milníky regulace:**
- **1680 — Tereziánský patent o robotě**: max. 3 dny tažné / 3 dny pěší týdně.
- **1738 — Robotní patent Karla VI.**: dále upřesněno, ale poddaný stále nemohl odejít.
- **1775 — Robotní patent Marie Terezie**: oficiální tabulky podle velikosti gruntu, nucené smírčí komise při sporech.
- **1781 — Patent o zrušení nevolnictví Josefa II.**: poddaný mohl odejít z panství, vzít si koho chtěl, dát děti na řemeslo. **Robota však zůstala!**
- **1848 — Říjen 1848**: Hans Kudlich (sedlák a poslanec Říšského sněmu) iniciuje **zrušení roboty bez náhrady**. Schváleno 7. září 1848.
- **1849 — Skutečná likvidace**: vrchnost dostala kompenzaci (od státu, ne sedláků). Sedlák se stal **svobodným vlastníkem půdy**.

**Dopady zrušení:**
- Vznik svobodného trhu s půdou
- **Komasace** (scelování) pozemků 1850–1920
- Mladí selci si mohli budovat hospodářství bez závazků
- Vznik moderního zemědělství s motivem zisku
- Sociální revoluce na venkově — emigrace „přebytečných" sedláků do USA, Vídně, do měst

V kultuře: **„Babička"** B. Němcové (1855) zachycuje pozdní robotní éru. **„Robotnický dům"** byla historická budova pro ubytování nájemných pracovníků na panství po zrušení nevolnictví.

Etymologie: od staročeského *robota* (těžká práce, otroctví). Karel Čapek v R.U.R. (1920) použil slovo **robot** v moderním smyslu, čímž ho učinil světovým.

Viz též [[grunt]], [[lan]], [[trojhonny-system]], [[mez]], [[uhor]].`,
    related: ['grunt', 'lan', 'trojhonny-system', 'mez'],
  },
  {
    slug: 'grunt',
    term: 'Grunt',
    alias: ['selský grunt', 'gruntovní zápis', 'gruntovní kniha'],
    kategorie: 'historie',
    shortDef: 'Grunt je historické označení pro selské hospodářství — usedlost s domem, hospodářskými staveními, zahradou a poli. „Selský grunt" byl základní jednotka venkovské společnosti až do poloviny 20. století.',
    longDef: `Grunt (z německého *Grund* = základ, půda) je historické označení pro **selské hospodářství** — usedlost se vším příslušenstvím: dům, stáje, stodola, sýpka, zahrada, sad a pole v plužině obce. „Sedlák na gruntě" byl základní sociální vrstvou venkovského obyvatelstva.

**Velikost gruntů:**
- **Celý lán (láník)**: 17–20 ha polí — nejvyšší kategorie, „selský grunt"
- **Půllán (půlláník)**: 8–10 ha — střední sedlák
- **Čtvrtlán (čtvrtláník, chalupník s polem)**: 4–5 ha
- **Chalupa bez půdy**: jen dům a malá zahrada — domkáři, řemeslníci
- **Velký grunt** (statkář, dvorský grunt): 30+ ha, často s vlastními pacholky

**Architektura gruntu:**
- **Dům** s jednou velkou „světnicí" (obytná místnost s pecí), kuchyní a komorou
- **Chlév** (stáje) pro krávy, koně, prasata — typicky v zadní části dvora
- **Stodola** (stoh — viz separátně) pro slámu, seno, naskladněnou úrodu před mlácením
- **Sýpka** (panský sypkář) — uskladnění obilí pro setí + osivo pro zimu
- **Studna** uprostřed dvora
- **Hnojiště** (mršiště) za chlévem
- **Sad / zahrada** za domem (jabloně, hrušně, slívy)

**Gruntovní knihy:**
Od 16. století **každá vesnice měla gruntovní knihu** vedenou vrchností (později státem) — záznam **kdo na kterém gruntě hospodaří**, prodeje, dědické převody, věna. Klíčový zdroj pro genealogii a historii vesnice.

**Klíčové gruntovní právo:**
- **Nedělitelnost gruntu** — celý grunt přebíral **jeden syn** (typicky nejstarší, ale ne vždy). Ostatní šli na řemeslo, do města nebo dostali peněžní výpomoc.
- **Výminek** — odcházející hospodář (stárnoucí otec) si na gruntě vymínil bydlení a stravu na zbytek života. Smlouva pevně zakotvena.
- **Vejminkářský domek** = malá budova pro výminkáře (často součást gruntu).

**Konec gruntů 1948–1960:**
- **Vyvlastnění**: kolektivizace zlikvidovala soukromé hospodaření, grunt se stal součástí JZD/Státního statku.
- **Vykulačnění**: největší selské grunty (kulaci) zlikvidovány, rodiny perzekuovány.
- **Demolice**: mnoho gruntů strženo pro výstavbu kravínů, sil a domu pro pracující JZD.

**Restituce 1991–dnes:**
- Vrácení pozemků a budov původním vlastníkům nebo dědicům.
- Mnoho gruntů zrekonstruováno jako **rodinné farmy** (často 5. generace na stejném pozemku).
- Některé velké grunty fungují jako **agroturistika** nebo „dědictví" pro městské potomky.

**Pomístní stopy**: „Na gruntě", „Starý grunt", „Gruntovní cesta" jsou typické názvy v ČR. **Příjmení Grunt, Grunta, Gruntorád** odkazují na sedlácký původ.

Viz též [[lan]], [[robota]], [[trojhonny-system]], [[mez]], [[jitro]], [[korec]].`,
    related: ['lan', 'robota', 'trojhonny-system', 'mez', 'jitro'],
  },
  {
    slug: 'zentour',
    term: 'Žentour',
    alias: ['šlapací stroj', 'žentourový stroj'],
    kategorie: 'historie',
    shortDef: 'Žentour je historický stroj poháněný silou dobytka (koně, voli) — kruhové zařízení, kde zvíře chodí po obvodu a otáčí hřídelí napojenou na mlátičku, šrotovník nebo lis. Předchůdce parního a elektrického pohonu.',
    longDef: `Žentour (něm. *Göpel*, z latinského *gyrum* = kruh) je **historický stroj poháněný tažnou silou dobytka** — koně, volů, oslů. Princip: zvíře kráčí po kruhové trati (průměr 6–10 m) a otáčí svislou nebo vodorovnou hřídelí, která pohání cílový stroj.

**Konstrukce:**
- **Centrální svislá hřídel** s ramenem (rudlem), za které zvíře táhne
- **Převodovka** (často s ozubenými koly) — překládá pomalou otáčku zvířete (3–8 ot/min) na rychlejší pro pracovní stroj
- **Plošina nebo střecha** — chrání zvíře před deštěm
- **Postroj a vodítka** — někdy s automatickou regulací rychlosti

**Použití:**
- **Mlátička obilí** (nejčastější) — mlat (cep) byl postupně nahrazen mechanickou mlátičkou poháněnou žentourem
- **Šrotovník** — drcení obilí a brambor na krmivo
- **Lis** — slámy do balíků, ovoce na mošt
- **Vyklízeč** — sena, hnoje
- **Čerpadlo** — voda ze studny do zásobníku
- **Kovárna** — pohon dmýchadla v kovárně
- **Cukrovary 19. století** — drcení cukrové řepy

**Dvě hlavní varianty:**
1. **Svislý žentour** (nejstarší) — zvíře chodí kolem svislé osy, mlátička stojí v centru. Vyžaduje velkou plochu.
2. **Vodorovný žentour** (od 18. století) — kompaktnější, hřídel vede z žentouru do stroje v sousední místnosti. Umožnil **stavbu žentourové stodoly** s dvěma místnostmi.

**Výkon:**
- 1 kůň generuje ~0,5–1 koňské síly (740 W) v žentouru
- Pár koní = ~1,5 HP = stačí pro malou mlátičku (100 kg obilí/h)
- 4 voli = ~2 HP — pro větší mlátičku nebo lis

**Historie:**
- **Středověk**: jen pro vodní mlýny a kovárny (vodní kola, ne žentoury).
- **16.–18. století**: šíření žentourů s mlátičkami v Anglii, Německu.
- **1740–1850 v ČR**: každý větší grunt měl žentourovou stodolu.
- **1850–1900**: parní stroj (lokomobila — viz [[parni-stroj]]) postupně nahradil žentour. Mlátička poháněna parou byla mnohonásobně výkonnější.
- **1900–1950**: elektrický motor (po elektrifikaci venkova 1920–1950) finálně nahradil i parní stroj.
- **Dnes**: žentoury jsou muzeální kuriozity (Vlastivědné muzeum Šumperk, Veselý Kopec, skanzeny).

**Stopy v krajině:**
- **Žentourové stodoly** — kulatý nebo polygonální půdorys s šikmou střechou, dosud zachované v některých vesnicích (zejm. severní Morava, Vysočina).
- **Pomístní názvy**: „U žentouru", „Žentourová cesta".
- **Slovo „žentour"** přežívá v dialektu jako synonymum pro „těžkou monotónní práci" (Čalounit jak žentour = dělat namáhavou rutinní práci).

Viz též [[grunt]], [[robota]], [[mlat]], [[zne]].`,
    related: ['grunt', 'robota', 'mlat', 'zne'],
  },
  {
    slug: 'mlat',
    term: 'Mlat',
    alias: ['mlátírna', 'mlatovna', 'humno'],
    kategorie: 'historie',
    shortDef: 'Mlat je velká plocha (původně udusaná hlína) v stodole, kde se cepy nebo žentourovou mlátičkou mlátilo obilí. Centrum zimního hospodaření až do 19. století, kdy ho nahradila mobilní mlátička.',
    longDef: `Mlat (od *mlátit*) je **vodorovná zpevněná plocha** uvnitř stodoly, kde se v zimě **mlátilo obilí** — oddělovala se zrna od slámy a klásků. Klíčové místo zimní práce sedláka.

**Konstrukce mlatu:**
- **Podlaha**: tvrdá udusaná hlína smíšená s vápnem nebo voloví krví (pro tvrdost), občas dlažba nebo dřevěné fošny
- **Velikost**: typicky 4 × 6 m až 6 × 10 m
- **Umístění v stodole**: uprostřed mezi dvěma „závory" — prostory, kde se skladovaly nevymlácené snopy
- **Vstupy**: dvě protilehlá vrata (jih i sever), aby se daly „závory" zaplnit z obou stran a aby fungoval **průvan** pro zvedání plev (provívání zrna)

**Mlácení cepem (do ~1850):**
- **Cep** (viz [[cep]]) — dřevěné nástroj se švihací částí (bidlo + tlučka spojené řemínkem)
- **Rytmus**: 4–8 mlátečů v řadě mlátilo rytmicky („čtveřice", „šesterka") — dodnes přežívá v lidové hudbě (rytmus „mlátiček")
- **Výkon**: 1 mláteč zvládne ~50–80 kg zrna za den
- **Skladba sezóny**: mlátilo se od listopadu do března — celé 4–5 měsíců zimní práce

**Mlácení žentourovou mlátičkou (1850–1900):**
- **Mechanická mlátička** poháněná žentourem (viz [[zentour]]) v sousední místnosti
- **Výkon**: 200–500 kg obilí za hodinu (5–10× rychlejší než cep)
- **Pomocník**: 2–3 muži přikládali snopy, 1–2 odbírali slámu, 1 odebíral zrno

**Mlácení parní lokomobilou (1880–1950):**
- **Stěhovavá mlátička** — parní stroj na vozíku objížděl vesnice, „mlátil" 1–2 dny u každého sedláka
- **Výkon**: 1 000–2 000 kg/h
- **Konec mlatu jako pracovního prostoru** — práce se přesunula ven na dvůr

**Mlácení kombajnem (1950+):**
- **Kombajn** (viz [[kombajn-trida]]) provádí mlácení **přímo na poli**
- Mlat ztratil funkci, **stodoly se přestavěly** na garáže pro techniku, sklady pro hnojiva, nebo se zbouraly.

**Dnes:**
- Některé staré stodoly s mlatem dochovány v skanzenech (Veselý Kopec, Strážnice, Přerov nad Labem).
- **„Mlatová slavnost"** = lidová oslava konce mlácení (před 1900), s tancem na mlatě.
- Slovo **mlátička** přežívá jako technický termín (= obilní mlátička v kombajnu, viz [[rotor-kombajn]]).

**Pomístní názvy:** „U mlatu", „Mlatovna", „Stará mlátička" v ČR běžné.

**„Humno"** (slovenské, valašské) = synonymum mlatu, někdy širší (= celá stodola).

Etymologie: praslovanské *mlatъ* (= úder, mlat). Související slova: **mlátit** (= mlátit cepem), **mlátička** (= stroj), **mlatec** (= muž mlátící cepem).

Viz též [[zentour]], [[grunt]], [[zne]], [[cep]], [[rotor-kombajn]].`,
    related: ['zentour', 'grunt', 'zne', 'rotor-kombajn'],
  },
  {
    slug: 'zne',
    term: 'Žně',
    alias: ['žatva', 'sklizeň obilí', 'kosení'],
    kategorie: 'historie',
    shortDef: 'Žně je tradiční označení sklizně obilí — vrcholné období letního zemědělského roku (červenec–srpen). Historicky se sekalo srpem nebo kosou, dnes kombajnem. V kultuře symbol „roku ve znamení slunce a chleba".',
    longDef: `Žně (od slovesa *žát* — sekat obilí) je **vrcholné období sklizně obilí** v letním zemědělském cyklu. V ČR typicky konec července až polovina srpna (ozimy první, jariny později). Historicky to byla **nejintenzivnější práce roku** s vlastní liturgií, písněmi a obyčeji.

**Tradiční žně (do ~1900):**
- **Nástroje**: **srp** (jednoruční, do 17. století hlavní), **kosa** (od 17. století — větší výkon)
- **Tempo**: 1 sekáč za den zvládne ~0,3–0,5 ha obilí
- **Organizace**: rodina + nájemní pomocníci („žencové", „ženkyně")
- **Žněnská skupina** (= 4–8 lidí): jeden sekáč → odběračka (žne) za ním → snopiči (vazači snopů — viz [[snop-otep]]) → kladači do panáků
- **Po sklizni**: snopy stojí v polních **panáčcích** (šokách) k oschnutí 1–2 týdny, pak se převážejí do **stodol** na **mlat** (viz [[mlat]]) k zimnímu mlácení

**Mechanizační milníky:**
- **1850 — Žací stroj (reaper)** Cyrus McCormick (USA), Cyrus Hall McCormick — táhne dvojspřeží koní, jeden řidič. Reaper položil obilí na zem, žencové ho vázali ručně.
- **1880 — Žací vázací stroj (binder)** — vázal snopy automaticky.
- **1930 — Kombajn** v USA (kombinace žacího stroje + mlátičky). Sklízí + mlátí + očišťuje v jedné operaci.
- **1950 — Kombajn v ČSR** (Mountfield, Sodóma, později Slavia, Kombajny Polska Bizon).
- **1990+ — Velké západní kombajny** (Claas Lexion, John Deere S-řada, New Holland CR).

Dnes:
- **Sklizeň pšenice**: 1 moderní kombajn (Claas Lexion 8900) zvládne **5–10 ha/h** = celá farma 500 ha za **2–3 dny**.
- **Sekáč s kosou**: 0,3 ha/den × 500 ha = **3 roky lidské práce** ekvivalent jednoho moderního kombajnu.

**Kulturní dimenze:**
- **Žencovské písně** (zachovány lidovou tradicí, např. „Pole, pole, široké pole")
- **„Hostina po žních"** = oslava konce sklizně, štědrá strava, tanec
- **„Dožínky"** = slavnostní průvod posledního snopu ozdobeného květinami ke statkáři, vrchnosti nebo dnes na slavnostech městyse/obce
- **„Sklizňový obřad"** v některých krajích (přivolávání úrody) — synkretismus pohanských a křesťanských obřadů
- **Klasické české literatury**: Babička, Naši, Karel Klostermann — žně jsou ústřední scéna venkovského roku

**Klimatické riziko žní:**
- **Bouřky** — silný déšť „polehne" obilí (vrhne stébla k zemi), výnos klesá o 20–40 %
- **Krupobití** — likviduje úrodu během minut
- **Dlouhotrvající mokré počasí** — obilí klíčí v klasu, ztráta potravinářské kvality
- **Sucho** — snižuje výnos i hektolitrovou váhu (viz [[hektolitr]])

**Sklizeň 2024 v CZ** (orientačně):
- Pšenice ozimá: 1,4 mil. ha × 6,2 t/ha = **8,7 mil. t**
- Ječmen: 320 tis. ha × 5,8 t/ha = **1,85 mil. t**
- Řepka: 380 tis. ha × 3,2 t/ha = **1,2 mil. t**
- Kombajny v provozu: ~3 500 ks (převažují Claas + JD)

**„Otavy"** = druhá sklizeň trávy/sena na podzim (NE obilí — to jde jen jednou).

Viz též [[mlat]], [[snop-otep]], [[kombajn-trida]], [[rotor-kombajn]], [[grunt]].`,
    related: ['mlat', 'kombajn-trida', 'rotor-kombajn', 'grunt'],
  },

  // ── MODERNÍ / REGENERATIVNÍ ZEMĚDĚLSTVÍ ─────────────────────────────
  {
    slug: 'regenerativni-zemedelstvi',
    term: 'Regenerativní zemědělství',
    alias: ['regen ag', 'regenerative agriculture'],
    kategorie: 'precise-farming',
    shortDef: 'Regenerativní zemědělství je systém pěstování zaměřený na obnovu zdraví půdy, zvyšování organické hmoty, biodiverzity a sekvestrace uhlíku. Klíčové praktiky: no-till, krycí plodiny, integrace dobytka, snížení agrochemie.',
    longDef: `Regenerativní zemědělství (anglicky *regenerative agriculture*, „regen ag") je systém produkce, který **aktivně obnovuje** zdraví půdy, biodiverzitu a ekosystémové služby. Není to certifikační schéma jako bio, ale **principiální přístup** s měřitelnými výsledky.

**5 principů regenerativního zemědělství** (podle Gabe Brown, US):
1. **Minimalizace narušení půdy** — žádná orba, žádné hluboké zpracování. Půda zůstává strukturovaná, mikroorganismy nepřerušené. Viz [[no-till]], [[strip-till]].
2. **Stálý kryt půdy** — krycí plodiny (cover crops), mulč, sláma. Půda nikdy nahá. Snižuje erozi, udržuje vlhkost, krmí mikrobiom.
3. **Rozmanitost rostlin** — minimálně 4-5 plodin v rotaci, ideálně víceleté smíšky (mezi plodiny, viz [[mezi-plodiny]]). Žádná monokultura.
4. **Žijící kořeny celoročně** — vždy něco roste. Krycí plodiny mezi hlavními plodinami zajistí, že kořeny stále krmí mikrobiom.
5. **Integrace dobytka** — pastva nebo „mob grazing" (vysoká intenzita, krátká doba) na polích po sklizni. Hnůj + tlumící kopyta + slin obnoví půdu.

**Hlavní rozdíly vs konvenční zemědělství:**

| Aspekt | Konvenční | Regenerativní |
|--------|-----------|---------------|
| Půda | Komodita (substrát) | Živý organismus |
| Zpracování | Orba, podmítka | No-till, strip-till |
| Kryt | Holá půda 3–6 měs./rok | Stálý kryt |
| Plodin v rotaci | 2–4 | 5+ |
| Mineralní hnojiva | 150–200 kg N/ha | 50–100 kg N/ha (s pokrytím leguminózami) |
| Postřiky | Pravidelně | Cílené, redukované |
| Dobytek | Oddělený od polí | Integrovaný |

**Měřitelné výsledky (po 5–10 letech):**
- **Organická hmota v půdě**: +1–2 % (z 2 % na 3–4 %). Každé 1 % SOM = +20 t C/ha sekvestrace.
- **Infiltrace vody**: 2–10× lepší (méně povrchového odtoku)
- **Náklady**: -20 až -40 % (méně paliva, hnojiv, postřiků)
- **Výnosy**: První 2–3 roky pokles 10–20 %, pak srovnatelné s konvenčním (někdy +10–20 %)
- **Marže**: vyšší kvůli nižším nákladům + premium ceny (carbon credits, regen certifikace, Whole Foods/Patagonia kontrakty)

**Slavná regen jména:**
- **Gabe Brown** (USA, ND) — kniha „Dirt to Soil", farma 2 500 ha bez hnojiv 20+ let
- **Allan Savory** (Zimbabwe) — „Holistic Management" pro pastvu
- **Joel Salatin** (USA, VA) — Polyface Farm, multi-species integrované pastviny
- **Charles Massy** (Austrálie) — „Call of the Reed Warbler", regenerace australských pastvin

**V ČR:**
- **Jihočeská farma „Kuneš"** (Kestřany) — modelová regen farma
- **AgroProgress** — konzultace pro převod
- **Skupina REGAGRI** — sdružení regen farmářů
- **Carbon credits**: pilotní programy od 2023 (Indigo, Climate Farmers, Soil Capital)

**Risk:**
- **Přechodové období 3–5 let** — výnosy klesnou, dokud se neobnoví půdní mikrobiom
- **Vyžaduje hluboké znalosti** agronomie a ekologie — víc než aplikovat recepty
- **Pozemkové vlastnictví**: pronajatá půda znevýhodňuje (musíš dlouhodobě investovat do něčeho, co možná opustíš)

Viz též [[no-till]], [[ctf]], [[mezi-plodiny]], [[organicka-hmota]], [[karbonove-zemedelstvi]], [[biouhel]], [[mykorhiza]].`,
    related: ['no-till', 'ctf', 'mezi-plodiny', 'organicka-hmota', 'karbonove-zemedelstvi', 'biouhel', 'mykorhiza'],
  },
  {
    slug: 'karbonove-zemedelstvi',
    term: 'Karbonové zemědělství',
    alias: ['carbon farming', 'climate-smart agriculture', 'uhlíkové zemědělství'],
    kategorie: 'precise-farming',
    shortDef: 'Karbonové zemědělství je soubor praktik, které sekvestrují CO₂ z atmosféry do půdy a biomasy. Zemědělec může z certifikovaného uhlíku generovat „carbon credits" prodávané korporacím pro plnění klimatických závazků.',
    longDef: `Karbonové zemědělství (carbon farming) je systém **zemědělských praktik aktivně zvyšujících uhlíkové zásoby v půdě a vegetaci** s cílem zmírnit klimatickou změnu. Zemědělec se stává „carbon farmer" — produkuje vedle běžných plodin také **sekvestrovaný uhlík**, který lze prodat jako **carbon credit**.

**Klíčové praktiky (sekvestrace C):**
- **No-till / strip-till** — bez orby = méně oxidace organické hmoty = víc C v půdě. Viz [[no-till]], [[strip-till]].
- **Krycí plodiny** (cover crops) — kořeny + listy přidávají C do půdy mezi hlavními plodinami.
- **Vrátit slámu** (incorporation reziduí) — nepalovat slámu, mulčovat ji.
- **Hnojiva organická** (hnůj, kompost, biouhel — viz [[biouhel]]) místo mineralních.
- **Diverzifikace osevního postupu** — 5+ plodin v rotaci.
- **Vápnění** (viz [[vapneni]]) — alkalizuje pH, snižuje emise N₂O.
- **Agrolesnictví** — stromořady, větrolamy, agroforestry. Stromy zachycují velké množství C.
- **TTP konverze** (orná → louka, viz [[ttp]]) — louky uloží 2–4× víc C než orná.

**Co je 1 carbon credit?**
1 carbon credit = **1 tuna CO₂ ekvivalentu** sekvestrovaná nebo redukovaná. V ČR/EU se obchoduje na voluntárních trzích za:
- **15–25 EUR/t CO₂** (dnes 2024) na voluntárních trzích (Verra, Gold Standard)
- **60–90 EUR/t CO₂** v EU ETS (povinný trh, ale zemědělství tam zatím není)

**Příklad ekonomiky** (farma 500 ha přechází z orby na no-till + cover crops):
- **Sekvestrace**: ~0,5 t C/ha/rok = ~1,8 t CO₂/ha/rok
- **500 ha × 1,8 t × 20 EUR = 18 000 EUR/rok = ~450 tis. Kč**
- Plus snížení nákladů na palivo a hnojiva: ~200 tis. Kč
- Minus poradenství a certifikace: ~80 tis. Kč
- **Net profit**: 570 tis. Kč/rok dodatečně

**Certifikační schémata** (jak prodat credit):
- **Verra VCS** (Verified Carbon Standard) — globální, drahá certifikace
- **Gold Standard** — preferuje sociální dopad
- **Indigo Ag** (USA) — agtech platforma, převažuje v US
- **Climate Farmers** (DE) — startup pro EU farmy
- **Soil Capital** (BE) — payments per t CO₂
- **eAgronom** (EE) — softwarová platforma pro management
- **AgroVoltaika certifikace** (SOIL3) — CZ-orientovaná

**Problémy a kritika:**
- **Additionality** — credit je „validní" jen pokud farma sekvestraci NEDĚLALA by bez něj. Sporné.
- **Permanence** — pokud farma za 10 let znovu zorá, uhlík se vrátí do atmosféry. Carbon credit by měl být „revoked".
- **Verification** — měření obsahu C v půdě je drahé, často nepřesné. Modely vs reálné měření.
- **Leakage** — pokud farma A sekvestruje, ale farma B vedle zorá víc, čistý dopad = 0.
- **Greenwashing** — některé firmy nakupují credits, aby vypadali „klimaticky neutrální", ale nikdy nesnižují vlastní emise.

**EU + ČR politika:**
- **EU CRCF** (Carbon Removals Certification Framework) — nařízení 2024 nastavuje pravidla pro carbon credits ze zemědělství.
- **Strategický plán SZP 2023–2027** zahrnuje **uhlíkové platby** v rámci EKO a AEKO.
- **MZe ČR** v 2026 plánuje pilotní „uhlíkové dotace" pro farmy v no-till.

**Doporučená literatura:**
- Lal, R. (2004) „Soil carbon sequestration impacts on global climate change and food security"
- Kniha „Drawdown" (P. Hawken, 2017) — top 100 řešení klimatické změny, mnoho v zemědělství

Viz též [[regenerativni-zemedelstvi]], [[no-till]], [[organicka-hmota]], [[biouhel]], [[ttp]], [[vapneni]].`,
    related: ['regenerativni-zemedelstvi', 'no-till', 'organicka-hmota', 'biouhel', 'ttp', 'vapneni'],
  },
  {
    slug: 'strip-till',
    term: 'Strip-till',
    alias: ['pásové zpracování', 'pásová orba', 'strip tillage'],
    kategorie: 'agrotechnika',
    shortDef: 'Strip-till je kompromis mezi orbou a no-till — zpracovává jen 20–30 cm široký pás půdy v řádku (kde se sije), mezi řádky půda zůstává nedotčena. Vhodné pro kukuřici, slunečnici, řepku.',
    longDef: `Strip-till (pásové zpracování, *strip tillage*) je **kompromis mezi konvenční orbou a no-till** (viz [[no-till]]). Stroj zpracovává **jen úzký pás půdy přímo v setém řádku** (typicky 20–30 cm široký), zatímco prostor mezi řádky (typicky 75 cm rozteč pro kukuřici) zůstává **nedotčený** s mulčem.

**Princip činnosti:**
Stroj má dvě hlavní části na každém řádku:
1. **Diskový kotouč** — řeže residua a uvolňuje horní vrstvu (do 2–5 cm)
2. **Dláto / radlička** — kypří pás do hloubky 15–25 cm
3. **Volitelně**: aplikace hnojiv do pásu (P, K, kapalná N) v jednom průjezdu — „fertilizer applicator"
4. **Volitelně**: zapůjčená setí (současně sije osivo) — *one-pass* operace

**Pro které plodiny:**
Strip-till je ideální pro **řádkové plodiny s velkou roztečí**:
- **Kukuřice** (rozteč 75 cm) — primární uplatnění
- **Slunečnice** (rozteč 70 cm)
- **Cukrovka** (rozteč 45–50 cm)
- **Řepka ozimá** (rozteč 30–50 cm)
- **Sója** (rozteč 35–50 cm)

Pro úzce setou pšenici (rozteč 12,5 cm) **strip-till nemá smysl** — celá plocha by se zpracovávala, ekvivalent k orbě.

**Výhody:**
- **Snížení eroze**: mezirádkový mulč zachycuje vodu (vs holá orba)
- **Úspora paliva**: -30–50 % vs orba
- **Lepší struktura půdy**: jen 30 % plochy zpracovaná, zbytek udržuje strukturu
- **Cílené hnojení**: hnojivo přesně do řádku, ne plošně → -20 % spotřeba
- **Pozdní podzim/jaro vhodný**: vyšší pružnost než klasická orba (která musí brzo na podzim)
- **Sekvestrace uhlíku**: jako kompromis mezi orbou (-) a no-till (+)

**Nevýhody:**
- **Drahý stroj** — strip-till s aplikací hnojiv 1,5–3 mil. Kč (vs běžný pluh 500 tis. Kč)
- **Vyžaduje GPS RTK** (viz [[gps-rtk]]) — řádky musí být přesné na 2 cm. Bez RTK nelze opakovaně trefit stejné pásy.
- **Závisí na typu půdy**: na těžkých jílovitých půdách problém s utuženým mezipásem (potřeba občasná hluboká orba)
- **Plevele**: v mulči mezi pásy klíčí plevele, potřeba glyfosát + selektivní herbicidy
- **Sklon**: na svazích > 8 % riskantní (eroze v koleji secího stroje)

**Stroje:**
- **Kuhn Striger** (FR) — premium, 1,5–2,5 mil. Kč
- **Vaderstad Cultus** (SE) — robust, populární v CZ
- **Köckerling Vector** (DE) — kombinace s aplikací
- **Horsch Focus TD** (DE) — strip-till + secí stroj v jednom
- **John Deere 2510H** (US) — populární v USA, méně v EU

**V ČR**: do roku 2020 marginálni (< 1 % výměry), 2024 už ~5–8 % výměry kukuřice a řepky. Růst poháněný:
- AEKO platby za snížené zpracování půdy
- Vysoká cena nafty 2022+
- GAEC 5 (erozní opatření v erozně ohrožených zónách)

Viz též [[no-till]], [[orba]], [[regenerativni-zemedelstvi]], [[ctf]], [[gps-rtk]], [[eroze-pudy]].`,
    related: ['no-till', 'orba', 'regenerativni-zemedelstvi', 'ctf', 'gps-rtk', 'eroze-pudy'],
  },
  {
    slug: 'biouhel',
    term: 'Biouhel (biochar)',
    alias: ['biochar', 'agrouhel', 'pyrouhel'],
    kategorie: 'hnojivo',
    shortDef: 'Biouhel je porézní uhlí získané pyrolýzou biomasy (dřeva, slámy, rostlinných zbytků) bez kyslíku. Přidává se do půdy pro zvýšení úrodnosti, vázání živin a dlouhodobou sekvestraci uhlíku (1000+ let).',
    longDef: `Biouhel (anglicky *biochar*, řec. *bios* + *char* = život + uhlí) je **uhlíkatý materiál vyrobený pyrolýzou** (zahřátím bez kyslíku) biomasy — dřevěné štěpky, sláma, slupky, hnůj, ovocné pecky. Vyzařuje **75–90 % uhlíku** z původní biomasy, který je v půdě **stabilní stovky až tisíce let** — proto silný nástroj sekvestrace CO₂.

**Vznik a inspirace — *Terra Preta*:**
V Amazonii (Brazílie) byly objeveny **temně černé úrodné půdy** *Terra Preta de Índio* obsahující až 80 t/ha biouhle ze starých indiánských ohnišť. **Stáří 500–2000 let**, dodnes mnohonásobně úrodnější než okolní červené latosoly. Inspirace pro moderní biochar.

**Pyrolýza — výrobní proces:**
- **Teplota**: 400–800 °C
- **Bez kyslíku**: aby biomasa neoxidovala (nepálila se na popel)
- **Doba**: 15 min – 8 h podle technologie
- **Produkty**:
  - 30–40 % biochar (pevný)
  - 30–50 % bioolej (kapalný — palivo)
  - 20–30 % syngas (CO + H₂ + CH₄ — palivo)
- **Energetická bilance**: pyrolýza je samonosná — syngas pohání proces

**Vstupní suroviny:**
- **Dřevěné štěpky** (lesní těžba, prořezávky) — nejvyšší kvalita biouhle
- **Sláma obilí** (pšenice, kukuřice, řepka) — středně kvalitní, hojně dostupná
- **Slupky a peckoviny** (ovoce, ořechy) — vysoce porézní
- **Hnůj kuřat / krav** — bohatý na P, K
- **Zelená biomasa** (rákos, miscanthus) — pro plantáže biouhle

**Efekt na půdě:**
1. **Porozita** — 1 g biouhle = 200–400 m² povrchu (jako aktivní uhlí). Drží vodu i živiny.
2. **CEC** (Cation Exchange Capacity) — biouhel váže kationy (Ca²⁺, Mg²⁺, K⁺, NH₄⁺), pomalu je uvolňuje plodině. **+30–80 % CEC** v písčitých půdách.
3. **pH** — biouhel je mírně alkalický (pH 8–10) → **stabilizuje kyselé půdy**, alternativa vápnění.
4. **Mikrobiom** — póry biouhle jsou ideální „domovy" pro půdní bakterie a houby. **+30–60 % biomasy mikroorganismů**.
5. **Voda** — 1 t biouhle zadržuje **2–4 t vody** v půdě → ochrana proti suchu.
6. **Sekvestrace C** — 1 t biouhle = ~3 t CO₂ ekvivalent, stabilní 500+ let.

**Aplikace:**
- **Dávka**: 1–10 t/ha (typicky 3–5 t/ha)
- **Hloubka**: 10–30 cm orbou nebo strip-till
- **Aktivace**: rozdrtit + namočit + smíchat s kompostem 2–4 týdny před aplikací (aby se nasáklý sytými živinami, ne hladovým dřevěným uhlím)
- **Frekvence**: jednorázová nebo postupná (1 t/ha/rok)

**Cena 2024:**
- **Sypaný biouhel CZ**: 4 000–8 000 Kč/t
- **Pelet (jednodušší aplikace)**: 8 000–15 000 Kč/t
- **Aktivovaný s mykorhizou (premium)**: 15 000–25 000 Kč/t
- **Investice na 1 ha**: 12 000–40 000 Kč

**Návratnost:**
- **Výnosy**: typicky +5–20 % po 1–3 letech
- **Úspora hnojiv**: -10–25 % díky CEC
- **Carbon credits**: 15–25 EUR/t CO₂ × 3 t CO₂/t biouhle = ~1 200 Kč/t biouhle dodatečně
- **Návratnost**: 5–10 let na biouhel samostatně, 3–5 let s carbon credity

**V ČR:**
- **Sklizeň-Lanškroun** — největší výrobce, kapacita 5 000 t/rok
- **Biochar.cz** — distribuce, poradenství
- **AGRIBO** — výrobce + carbon credit konsultant
- **Pilotní projekty** na výzkumných ústavech (Bohunice, Lanžhot)

**Limity:**
- **Vstupní cena** vysoká, return až po letech
- **Riziko aplikace neaktivovaného uhle** — „hladový" biouhel **VÝRAZNĚ snižuje výnos první 1–2 roky** (saje vlastní živiny z půdy)
- **Měření efektu** — viditelné jen po 3+ letech, předtím těžko proseditelné
- **Pozor na kontaminanty** — biouhel z odpadní biomasy může obsahovat těžké kovy, dioxiny. Vyžaduje certifikaci EBC (European Biochar Certificate).

Viz též [[organicka-hmota]], [[regenerativni-zemedelstvi]], [[karbonove-zemedelstvi]], [[ph-pudy]], [[vapneni]], [[hnojivo]].`,
    related: ['organicka-hmota', 'regenerativni-zemedelstvi', 'karbonove-zemedelstvi', 'pH-pudy', 'vapneni'],
  },
  {
    slug: 'mykorhiza',
    term: 'Mykorhiza',
    alias: ['mycorrhiza', 'symbióza hub a kořenů', 'arbuskulární mykorhiza'],
    kategorie: 'agrotechnika',
    shortDef: 'Mykorhiza je symbióza mezi kořeny rostlin a půdními houbami. Houba zvětší pomocí svých vláken (hyf) sací plochu kořene 10–100×, rostlina za to dodává houbě cukry. Klíčový faktor zdraví půdy a výnosu.',
    longDef: `Mykorhiza (řec. *mykes* + *rhiza* = houba + kořen) je **vzájemně prospěšná symbióza mezi kořeny rostlin a podzemními houbami**. Vědecky popsána 1885 (Albert Bernhard Frank), ale v praxi využívána zemědělci tisíce let (bez vědomí mechanismu — Indiáni v Amazonii).

**Princip:**
- **Houba** prorůstá hustou sítí vláken (*hyf*) do půdy, mnohonásobně **zvětšuje sací plochu kořene** (z ~1 m² na 100+ m²)
- **Hyfy** se dotýkají kořene rostliny a vytváří **arbuskule** (košíčkové struktury) v kořenových buňkách — místa výměny
- **Rostlina** dodává houbě **5–20 % své fotosyntézy** (cukry, glukózu)
- **Houba** za to dodává rostlině **fosfor, dusík, mikroprvky** (zejm. Zn, Cu) — mnohem efektivněji než kořen sám

**Typy mykorhizy:**
1. **Arbuskulární mykorhiza (AM)** — nejběžnější, 80 % rostlin (pšenice, kukuřice, sója, ovocné stromy). Houby z divize *Glomeromycota*.
2. **Ektomykorhiza** — lesní stromy (dub, buk, smrk, borovice). Houby z divize *Basidiomycota* (hřiby, klouzky, ryzce).
3. **Erikoidní mykorhiza** — vřesovité (borůvky, brusinky, vřes).
4. **Orchideoidní mykorhiza** — orchideje. Symbióza zcela nutná pro klíčení.

**Bez mykorhizy NEROSTOU:**
- Vinná réva (téměř závislá)
- Olivovník
- Mnoho ovocných dřevin
- Některé orchideje

**Slabě závislé (mohou bez):**
- Brukvovité (řepka, hořčice, zelí) — produkují glukosinoláty, které mykorhizní houby zabíjejí
- Některé jednoleté plevele

**Výhody pro plodinu:**
- **+30–80 % příjmu P** (fosfor je v půdě často vázán v nedostupné formě, hyfy ho rozpouští)
- **+20–40 % příjmu N** (zejm. z organické hmoty)
- **+50–100 % příjmu vody** (větší sací plocha)
- **Tolerance k suchu**: hyfy hledají vodu metry daleko
- **Tolerance k těžkým kovům**: mykorhiza chrání kořen
- **Odolnost k patogenům**: hyfy „blokují" cesty kořenovým patogenům (fuzarióza, pythiová hniloba)
- **Výnos**: +5–30 % v stresových podmínkách

**Co mykorhizu poškozuje:**
- **Orba a hluboké zpracování půdy** — fyzicky rozseká hyfovou síť. **No-till** (viz [[no-till]]) a strip-till (viz [[strip-till]]) hyfy chrání.
- **Mineralní hnojiva s vysokým P** — rostlina nepotřebuje houbu, symbióza zaniká.
- **Fungicidy** v půdě (zejm. metalaxyl, propiconazol) — někteří specifické na mykorhizní houby.
- **Brukvovité v rotaci** — produkují glukosinoláty, mykorhiza klesá.
- **Holá půda** (žádný kryt) — hyfy odumírají bez hostitele.
- **Vápnění příliš vysoké pH** — některé AM houby preferují kyselé pH.

**Mykorhizní preparáty (komerční inokulanty):**
- **Symbivit** (CZ) — Mendelu, 1 000–2 000 Kč/kg
- **Mykos** (CZ) — Symbiom (Lanškroun)
- **Glomus intraradices** (zahraniční) — RhizoVital
- **Aplikace**: namořit osivo, posypat do řádků při setí, namáčet sadbu

**Cena na hektar:**
- Inokulace osiva: 200–500 Kč/ha
- Aplikace do řádků: 800–1 500 Kč/ha
- ROI 1–3 roky (zejm. v půdách po dlouhém orání nebo po vysokých dávkách P)

**Měření mykorhizy:**
- **Mikroskopie kořene** (barvení) — laboratorní
- **DNA test** (qPCR) — kvantifikace AM hub v půdě
- **Nepřímé indikátory**: měření P příjmu, sucho-tolerance, výnos

**V ČR výzkum**: Mendelu Brno, ČZU Praha, ÚEB AV ČR — desítky publikací.

Viz též [[regenerativni-zemedelstvi]], [[no-till]], [[strip-till]], [[organicka-hmota]], [[biouhel]], [[npk-hnojivo]].`,
    related: ['regenerativni-zemedelstvi', 'no-till', 'strip-till', 'organicka-hmota', 'biouhel', 'npk-hnojivo'],
  },
  {
    slug: 'tmr',
    term: 'TMR (Total Mixed Ration)',
    alias: ['Total Mixed Ration', 'totální směsná dávka', 'směsná krmná dávka'],
    kategorie: 'chov',
    shortDef: 'TMR (Total Mixed Ration) je krmná technologie, kdy se všechny komponenty dávky (siláž, seno, koncentrát, minerály) smíchají v míchacím voze a krmí jako jednotná homogenní směs. Standard pro mléčné dojnice nad 25 l/den.',
    longDef: `TMR (anglicky *Total Mixed Ration*, „totální směsná dávka") je **moderní krmná technologie pro skot**, kde se všechny složky krmné dávky **smíchají do jednotné homogenní směsi** v míchacím voze a krmí najednou. Standardní praxe pro produkční mléčné stáda od 1990s.

**Tradiční vs TMR krmení:**
| Tradiční | TMR |
|----------|-----|
| Komponenty zvlášť (siláž → seno → koncentrát) | Vše smíchané v 1 dávce |
| Kráva si vybírá | Nemůže selektovat |
| Selektivní příjem = problém s acidózou | Vyrovnaná dávka |
| Hodně práce (3–5× denně) | 1× denně rozdat, 1–2× přihrnout |
| Nižší užitkovost | +5–15 % mléčná produkce |

**Komponenty typické TMR pro vysokoužitkovou krávu (40+ l mléka/den):**
- **Kukuřičná siláž**: 25–35 kg (sušina 30–35 %)
- **Travní siláž / senáž**: 5–10 kg
- **Vojtěšková siláž / seno**: 3–6 kg (zdroj bílkovin a strukturní vlákniny)
- **Koncentrát / krmná směs**: 8–12 kg (obilí, sójový extrahovaný šrot, řepkový šrot)
- **Cukrovarské řízky / pivovarské mláto**: 5–15 kg (vedlejší produkty)
- **Minerály + vitamíny**: 0,2–0,5 kg (Ca, P, Mg, Na, mikroprvky)
- **Voda**: do kbelíku ad lib (ne v TMR)
- **Celkem**: 50–70 kg krmiva/krávu/den (z toho 22–28 kg sušiny)

**Klíčové parametry kvality TMR:**
- **Sušina** (DM — Dry Matter): 45–55 % (víc → krávy nepijou dost; míň → fermentační problémy)
- **NDF** (Neutral Detergent Fiber): 28–34 % — strukturní vláknina pro přežvykování
- **NDF z píce** (forage NDF): min. 19 % — pro funkčnost bachoru
- **NEL** (Net Energy Lactation): 6,8–7,2 MJ/kg DM
- **CP** (Crude Protein): 16–18 %
- **RUP** (Rumen Undegradable Protein): 35–40 % CP
- **Délka částic** (Penn State Particle Separator):
  - >19 mm: 5–15 % (strukturní efekt)
  - 8–19 mm: 30–50 %
  - 4–8 mm: 30–50 %
  - <4 mm: <20 %

**Míchací vozy (Mixer Wagons / TMR Wagons):**
- **Horizontální šnek** (1, 2, 3 šneky) — Trioliet, Faresin, Strautmann
- **Vertikální šnek** (1, 2 šneky) — KUHN Profile, Storti, Sgariboldi — častější dnes
- **Tažné vs samojízdné** (samojízdné u stád > 500 kus)
- **Kapacita**: 8–30 m³ (1× nakrmení 50–300 krav)
- **Cena**: 800 tis. – 5 mil. Kč
- **Hodnotí se**: doba míchání, homogenita, délka řezání (vertikální šnek umí krátit dlouhou siláž)

**PMR vs TMR vs CMR:**
- **TMR**: jedna univerzální dávka pro celé stádo (nebo skupinu)
- **PMR** (Partial Mixed Ration): základ smíchaný + individuální dokrmení v dojírně podle výroby (= koncentrát na základě dat krávy)
- **CMR** (Component Mixed Ration): tradiční oddělené krmení komponent (nejstarší přístup)

**Skupinové krmení:**
Moderní stádo má **2–4 skupiny dojnic** s různou TMR:
- **Vysokoužitkové** (>35 l/den): vysoká energie, vyšší koncentrát
- **Středně užitkové** (25–35 l/den): standardní
- **Nízkoužitkové** (<25 l/den, pozdní laktace): nižší energie, víc píce
- **Suché krávy / zaprahlé**: jen píce + minerály (transition diet 3 týdny před porodem)

**Náklady:**
- **Krmivo**: 70–100 Kč/kráva/den (pro 30 kg sušiny)
- **Práce**: -50 % oproti tradičnímu (1× rozdání místo 3–5×)
- **Investice do techniky**: amortizace 1,5–3 Kč/kráva/den

**Sledování spotřeby:**
- **Váha vozu** před a po krmení → spotřeba na skupinu/krávu
- **Refusal (odpad)** — to, co krávy nesní, váží se a sype na jiné krávy nebo do bioplynu. 3–5 % refusal je normální (= správně se trefíte do potřeb).

**Software pro plánování TMR:**
- **TMR Tracker** (US) — sledování kvality
- **NDS Professional** (IT) — výživové plánování
- **Agralis CCT** (CZ) — dojírny + krmení integrované
- **CowVision** (NL) — full digital

V ČR: ~80 % stád > 100 dojnic používá TMR (2024 data).

Viz též [[dojirna]], [[kukurice-silazni]], [[vojteska]], [[siloky-balik]], [[oteleni]], [[rijnost]].`,
    related: ['dojirna', 'kukurice-silazni', 'vojteska', 'siloky-balik', 'oteleni'],
  },

  // ── CHOV A ŽIVOČIŠNÁ VÝROBA ──────────────────────────────────────────
  {
    slug: 'oteleni',
    term: 'Otelení',
    alias: ['telení', 'porod krávy', 'calving'],
    kategorie: 'chov',
    shortDef: 'Otelení je porod krávy. V přirozeném cyklu probíhá zhruba 280 dní po inseminaci. Klíčový moment hospodaření — začíná laktace (~305 dní), kráva je nejcitlivější na výživu a hygienu. Komplikace tu rozhodují o ekonomice celého chovu.',
    longDef: `Otelení (lidově *telení*, odborně *partus*, anglicky *calving*) je **porod krávy** — vrcholný moment chovatelského cyklu. Standardní gravidita skotu trvá **280 ± 5 dní** (9 měsíců).

**Cyklus produkční krávy:**
- **Den 0**: otelení, začátek laktace
- **Den 60–70**: optimální inseminace (zhruba 2. říje po porodu, viz [[rijnost]], [[inseminace]])
- **Den 280**: zaprahnutí (zastavení dojení 60 dní před dalším porodem) — období regenerace mléčné žlázy
- **Den 340**: další otelení → cyklus restartuje

**Pomocné měřítka:**
- **Mezidoba** (calving interval): 365–400 dní = ideální (kratší = lepší ekonomika)
- **Servis perioda** (od otelení k inseminaci): 60–90 dní = optimální
- **Indeks oplodnitelnosti**: 1,5–2,5 inseminací na zabřeznutí = dobrý

**Příznaky blížícího se otelení (24–48 h před):**
- **Vemeno** se naplňuje, mlékem prosakuje
- **Vulva** zduřená, pánevní vazy uvolněné
- **Hlen** z pochvy (žlutý / hnědý)
- **Změna chování**: krávu odděluje se od stáda, neklid, oblézání
- **Pokles tělesné teploty** o 0,5–1 °C

**Průběh porodu (3 fáze):**
1. **Otevírací fáze** (2–6 h): cervix se otevírá, krávu cítíme stahy, vstává a lehá
2. **Vypudovací fáze** (30 min – 4 h): aktivní tlačení, vidíme „vodní vak" (allantois), pak telete přicházejí (zpravidla nejdřív přední nohy + hlava)
3. **Placentová fáze** (do 12 h): vypuzení placenty (lůžka). Pokud >12 h = **retentio placentae** = veterinární problém

**Komplikace (dystocie):**
- **Špatná poloha telete** (zadní místo přední, hlava zavrácená, nohy stočené) — 5–8 % všech otelení
- **Velký plod** (oversized calf) — Belgické modré, Charolais (býk přemete krávu)
- **Úzká pánev** (malá kráva s velkým býkem)
- **Slabé kontrakce** (oslabená kráva, hypokalcemie)
- **Twins** (dvojčata) — vyšší riziko komplikací, často vyžaduje veterináře

**Statistika dystocií:**
- **Holštýn**: 8–12 % otelení s asistencí (lehčí porody)
- **Belgické modré**: 90+ % asistovaných (často císařský řez!)
- **Charolais, Limousin**: 15–25 % asistovaných
- **Aberdeen Angus**: <5 % — „easy calving"

**Veterinární zákroky:**
- **Manuální asistence**: vytažení rukama
- **Fetotomie**: porodní lana, řetězy, vytahování řemenem (do 50 kg tahu)
- **Císařský řez**: nutný u úzkých pánví nebo špatných poloh — 8 000–25 000 Kč
- **Embryotomie**: rozdělení mrtvého plodu v děloze (zachrání matku)

**Po otelení — kritické první týdny:**
- **Kolostrum** (mlezivo) — první mléko bohaté na protilátky. Tele MUSÍ dostat min. 4 l do 6 h po porodu (pasivní imunita).
- **Hypokalcémie / mléčná horečka** — 3–10 % krav, krátce po otelení (Ca → mléko). Léčí se infuzí calcia.
- **Ketóza** — energetická deficience v ranné laktaci, hubnutí, ketolátky v moči. Prevence: kvalitní TMR ([[tmr]]).
- **Retentio placentae** (zadržená lůžka) — riziko zánětu dělohy → snížená plodnost.
- **Metritida** — zánět dělohy, snižuje reprodukci.
- **Mastitis** — zánět vemene, časté první 30 dní.

**Welfare požadavky** (CZ normy):
- **Oddělená telící boxa** (calving pen) — min. 12 m², čisto, sucho, klid
- **Veterinární dohled** během porodu
- **Telete a krávu společně** min. 24 h po porodu (pro pasivní imunitu)
- **Žádné rutinní hormonální indukce porodů** (zakázáno EU 2008)

**Indikátory ekonomiky:**
- **% živě narozených telat**: 92–96 % = velmi dobré
- **% telat přežívajících do 60 dní**: 90–95 %
- **Náklady na 1 otelení**: 1 500–8 000 Kč (asistence, lék, čas)
- **Hodnota telete** (býček 50 kg živé hmotnosti): 8 000–15 000 Kč
- **Hodnota telete** (jaločka pro chov): 25 000–60 000 Kč

**Synchronizace porodů:**
- **CIDR + PGF₂α** protokol (kontrolovaný cyklus) → narozeni telat ve „vlnách"
- Výhody: organizace práce, hromadná koupě/prodej, monitoring
- Nevýhody: vyšší fixní zatížení techniky a personálu během vrcholů

Viz též [[rijnost]], [[inseminace]], [[jalovice]], [[usni-znamka]], [[dojirna]], [[tmr]].`,
    related: ['rijnost', 'inseminace', 'jalovice', 'usni-znamka', 'dojirna', 'tmr'],
  },
  {
    slug: 'rijnost',
    term: 'Říje (estrus)',
    alias: ['ruje', 'říjnost', 'estrus', 'pohlavní cyklus'],
    kategorie: 'chov',
    shortDef: 'Říje je období sexuální receptivity samice — u krávy trvá 12–24 h, opakuje se každých 18–24 dní. Klíčový moment pro inseminaci. Detekce říje (přirozeně nebo automatickými sensory) určuje 80 % reprodukčního úspěchu farmy.',
    longDef: `Říje (latinsky *estrus*, anglicky *heat*) je **období, kdy samice savce je sexuálně receptivní a schopná oplodnění**. U skotu (krav i jalovic — viz [[jalovice]]) trvá 12–24 hodin a opakuje se v **21denním cyklu** (18–24 dní v normě).

**Cyklus krávy (21 dní průměrně):**
- **Den 0**: říje (estrus) — 12–24 h
- **Den 1**: ovulace 24–30 h po začátku říje
- **Den 5–17**: luteální fáze (corpus luteum produkuje progesteron) — bránění další říji
- **Den 18–19**: luteolýza (rozpad corpus luteum)
- **Den 20–21**: nová říje, cyklus restartuje
- **Pokud gravidita**: corpus luteum přežívá → žádná další říje 280 dní

**Příznaky říje:**
1. **Standing heat** (= klíčový příznak): kráva stojí nehybně, když ji nasedne jiná kráva. **Trvá 4–18 h** v rámci celkové říje. **Jediný 100% spolehlivý** příznak.
2. **Mounting** (naskakování na ostatní krávy) — start říje
3. **Hleny**: čistý, lepkavý hlen z vulvy
4. **Vulva**: zarudlá, mírně zduřená
5. **Neklid**: víc chůze (až 4× normální distance), bučení, snížený příjem krmiva
6. **Pokles užitkovosti mléka**: −10 až −30 % na 1 den

**Tichá říje (silent heat):**
30–40 % krav (zejm. v ranné poporodní době nebo při tepelném stresu v létě) **nevykazuje viditelnou říji**, ale ovulace probíhá. **Riziko**: ručně se nedá detekovat, kráva „neoplodněna" 60+ dní → ekonomická ztráta 50–100 Kč/den.

**Detekce říje — metody:**

**1. Vizuální pozorování** (tradiční):
- 2× denně po 20 min = záchyt **45–55 %** říjí
- 3× denně po 30 min = záchyt **65–75 %** říjí
- Náročné na čas, podléhá lidské chybě

**2. Detekční pomůcky:**
- **Heat mount detector** (Kamar) — barevný lepicí čip na sakrum, mění barvu pod tlakem nasedající krávy. **Levné** (50–100 Kč/kus), spolehlivost ~80 %.
- **Křídový sprej** na sakrum — nový spray každý den, smytí = pozn. říje
- **Estrotect patches** — kombinace tlakové a barevné detekce

**3. Senzory (precision livestock farming):**
- **Aktivometr** (pedometr) — krok-počítač na noze, říje = +50–100 % kroků
- **Akcelerometr** na obojku — chov-detekce + pozn. fyzické aktivity
- **CowManager SensOor** — kvantifikace ruminace, příjmu, aktivity
- **Allflex Heatime** — kombinovaný systém
- **DeLaval BCS Camera** — kamera + AI detekce
- **Cena**: 2 000–5 000 Kč/kráva (jednorázová) + 30–80 Kč/měsíc software
- **Spolehlivost**: 90–98 % detekce, méně false positives

**4. Hormonální měření (lab):**
- **Progesteron v mléce** — denně nebo 3× týdně. Drop progesteronu = říje.
- **Rapid Milk Progesterone Test** (RMPT) — pásek 30 min, 50 Kč/test

**Inseminace načasování:**
- **AM/PM rule**: říje ráno → inseminovat odpoledne; říje večer → inseminovat ráno
- **Ovulace** je 24–30 h po startu říje
- **Spermie** přežívají 12–24 h v děloze
- **Vajíčko** přežívá jen 6–10 h po ovulaci
- **Optimální okno**: 6–18 h od startu říje (12 h před ovulací)

**Synchronizace říje** (řízená reprodukce):
Hormonální protokoly pro **vyvolání říje ve skupině najednou** — usnadní inseminace, plánování porodů, monitoring:

- **PGF₂α** (Prostaglandin) — 2 injekce ve 14denním rozestupu. Levné, 80–85 % synchronizace.
- **Ovsynch** — 7denní protokol s GnRH + PGF + GnRH + AI. Vyšší spolehlivost ~70 %.
- **CIDR / PRID** (intravaginální progesteron) + GnRH + PGF — pro krávy s nepravidelnou cyklika

**Anestrus** (chybějící cyklus):
- Po porodu 30–60 dní normální (= **postpartum anestrus**)
- Pokud > 90 dní → patologie:
  - **Cyklický anestrus**: ovariální problém
  - **Anestrický anestrus**: nedostatek živin, ketóza (viz [[oteleni]])
  - **Persistentní žluté tělísko**: vzácně, řešení PGF₂α

**Ekonomický dopad detekce říje:**
- **Detekce 95 %** (sensory): mezidoba 380 dní, +200 l mléka/kráva/rok = +6 000 Kč
- **Detekce 50 %** (manuálně): mezidoba 430 dní, ztráta 50 dní × 100 Kč/den = -5 000 Kč/kráva/rok

Viz též [[inseminace]], [[oteleni]], [[jalovice]], [[dojirna]], [[tmr]].`,
    related: ['inseminace', 'oteleni', 'jalovice', 'dojirna'],
  },
  {
    slug: 'inseminace',
    term: 'Umělá inseminace',
    alias: ['AI', 'artificial insemination', 'IZR umělé oplodnění'],
    kategorie: 'chov',
    shortDef: 'Umělá inseminace je metoda reprodukce, kdy se semeno vybraného plemenného býka zmraženě skladuje a dávkovaně aplikuje do dělohy krávy v období říje. Standardní postup v moderním chovu (>95 % v CZ).',
    longDef: `Umělá inseminace (AI, *artificial insemination*) je **metoda reprodukce hospodářských zvířat**, kdy se získané a zmrazené semeno plemenného samce aplikuje do dělohy samice **bez přímého páření**. Standardní praxe v moderním chovu skotu, prasat, ovcí, koz.

**Historie:**
- **1779** — italský fyziolog Lazzaro Spallanzani úspěšně inseminoval psici
- **1899** — Ruský vědec Ilja Ivanovič Ivanov první AI u koní a krav
- **1949** — Polge a Smith objevili **kryoprotektant glycerol** pro mražení spermatu
- **1950s** — zavedení mraženého semena v US a EU
- **1960s** — masové rozšíření v CZ (Velký kus, Inseminační stanice Stadlec)

**Princip:**

**1. Získání semene od býka:**
- **Umělá pochva** (artificial vagina) — býk skočí na atrapu (fantom) nebo cvičnou krávu, semeno se zachytí do skleněné nádobky
- **Elektroejakulace** — pro problematické býky nebo při onemocnění
- **Frekvence**: 2× týdně, 1–2 ejakuláty na sezení
- **Objem 1 ejakulátu**: 5–10 ml, ~1 miliarda spermií

**2. Hodnocení a zředění:**
- **Mikroskopická kontrola**: motility (pohyb), morfologie (tvar), koncentrace
- **Zředění** v krmiči (egg yolk + glycerol + citrate buffer)
- **Rozdělení do dávek**: typicky 20–30 mil. spermií / dávku (= 1 inseminace)
- **Jeden ejakulát → 200–500 dávek**

**3. Mražení:**
- **Pejety (straws)** — slámky 0,25 ml, plastové, barevně kódované podle býka
- **Ochlazování postupně**: 22 °C → 4 °C → -100 °C → -196 °C (kapalný dusík)
- **Skladování v dewaru s LN₂** (kapalný dusík)
- **Doba skladovatelnosti**: prakticky neomezená (50+ let prokazatelně)

**4. Inseminace krávy (zemědělec nebo inseminační technik):**
- **Termín**: 6–18 h od začátku říje (viz [[rijnost]])
- **Rozmražení pejety**: 35 °C, 45 sec ve vodní lázni
- **Aplikace**:
  - Inseminátor zavádí inseminační pistoli **přes pochvu, cervix, do těla dělohy** (asi 20 cm hloubky)
  - Jednu ruku má v konečníku — palpuje cervix a vede pistoli
  - Vstříkne celý objem (0,25 ml) do dělohy
- **Délka úkonu**: 30 sec – 2 min na zkušeného inseminátora

**Vzdělání inseminátora v ČR:**
- **Lékaři veterinární medicíny** (VŠ) — bez omezení
- **Zoologové / agronomové** — speciální kurz „Inseminační technik"
- **Sami zemědělci** — kurz „Vlastní inseminace" (přibližně 40 h), pak licence pouze pro vlastní stádo (NE pro inseminaci cizích krav)

**Ekonomika a praxe:**

**Cena 1 dávky semena (2024):**
- **Standardní genetika**: 200–400 Kč/dávka
- **Top genetika** (Top 100 USA TPI): 600–1 500 Kč
- **Sexované semeno** (90 % jaloček): 1 200–2 500 Kč
- **Embryotransfer linie**: 5 000–25 000 Kč
- **Cena za 1 zabřeznutí** (1,8 dávky průměrně): 360–2 700 Kč

**Konkurence — přírodní páření (býk ve stádě):**
- **Plusy**: 95 % zabřeznutí, žádné náklady na inseminátora, ne třeba detekovat říji
- **Mínusy**: 1 býk = 1 genetická linie (vs 20+ AI variant), riziko zranění krávy/býka, zoonózy, geneticky průměrní býci

**V ČR 2024:**
- ~98 % mléčných krav inseminovaných (téměř všechny)
- ~75 % masných krav inseminovaných (zbylé přírodní páření)
- **Inseminační stanice**: VŠM (Velký Šariš), Plemenáři Lhota, GeneTPlus, Bohemia Plus
- **Importované semena**: 60 % US Holstein, 20 % CZ genetika, 20 % EU genetika

**Sexované semeno (sex-sorted):**
- **Princip**: spermie X (jaločky) a Y (býčci) sortrovány průtokovou cytometrií (DNA množství v hlavičce X je ~3,8 % vyšší)
- **Spolehlivost**: 90 % požadovaného pohlaví
- **Nižší motility** — typicky 30 mil. spermií/dávka (vs 25 mil. konv.)
- **Cena**: 1 200–2 500 Kč/dávka
- **Použití**: ranní jalovice (zaručené jaločky pro chov), top kráv pro chovné linie

**Embryotransfer (ET):**
- **Vyšší úroveň genetiky**: super-ovulace top krávy → embryotransfer do recipientních krav
- **Princip**:
  1. Top kráva-donor: hormonální stimulace (FSH 4 dny)
  2. Inseminace top býkem
  3. Embrya (7 dní stará) vypláchnuta z dělohy
  4. Přesazení do 5–10 recipientních krav (synchronizovaných)
- **Cena**: 50 000–150 000 Kč na 1 cyklus
- **Top kráva** generuje 6–10 telat ročně místo 1 (oproti naturalu)

Viz též [[rijnost]], [[oteleni]], [[jalovice]], [[usni-znamka]], [[dojirna]].`,
    related: ['rijnost', 'oteleni', 'jalovice', 'usni-znamka'],
  },
  {
    slug: 'jalovice',
    term: 'Jalovice',
    alias: ['heifer', 'jalůvka', 'sirka'],
    kategorie: 'chov',
    shortDef: 'Jalovice je samice skotu od narození do prvního otelení — typicky 0–24 měsíců. Klíčová investice chovu (12–18 měs. odchovu bez výroby), genetický potenciál nové generace. Po prvním otelení se z ní stává „prvotelka" (cow).',
    longDef: `Jalovice (lidově *jalůvka*, dialekt *sirka*, anglicky *heifer*) je **samice skotu od narození do prvního otelení**. Po prvním otelení už není jalovice ale **kráva** (cow), konkrétně „prvotelka" (= primipara). Doba odchovu jalovice je **klíčovou investicí** chovu — 22–24 měsíců nákladů bez výroby mléka.

**Fáze odchovu jalovice:**

**1. Telete (calf) — 0–2 měsíce:**
- **Hmotnost narození**: 35–45 kg (holštýn), 25–35 kg (jersey), 40–50 kg (charolais)
- **Kolostrum (mlezivo)**: 4 l do 6 h po porodu — KRITICKÉ pro pasivní imunitu (telete nemá vrozenou imunitu)
- **Krmení mlékem**: 6–8 l/den, 2× denně
- **Stáj**: jednotlivé boxy (calf hutch) první 4–8 týdnů, pak ve skupině
- **Sušená krmiva**: úvod jádra a sena od 2. týdne
- **Odstav** (weaning): 6–10 týdnů, postupné snižování mléka

**2. Telete v odstavu — 2–6 měsíců:**
- **Hmotnost**: 70–150 kg
- **Krmení**: jádro (1–2 kg/den), kvalitní seno ad lib, voda
- **Růst**: cíl **0,8 kg/den** (holštýn)
- **Sociální skupina**: 4–10 telat stejné věkové kategorie
- **Bohlanitýření / odrohování** (8 týdnů) — anestezie + lokál
- **První ošetření**: parazitologie, vakcinace (BVD, IBR, salmonelóza)

**3. Mladá jalovice — 6–12 měsíců:**
- **Hmotnost**: 150–300 kg
- **Krmení**: kvalitní travní siláž + 1–2 kg jádra
- **Růst**: cíl 0,75 kg/den
- **Stáj**: skupinová kotec, 4–6 m²/kus
- **Pohyb**: pastva v létě (vhodné pro odchov)

**4. Inseminační jalovice — 12–18 měsíců:**
- **Hmotnost**: 350–450 kg (cílově 380–420 kg pro holštýn před inseminací)
- **Pohlavní zralost**: ~10–12 měsíců (puberta), ale ne dříve než 14 měsíců se inseminuje
- **Optimální inseminace**: 15 měsíců věku, 380 kg hmotnost
- **Cíl otelení**: 24 měsíců věku (vs ve starší praxi 28–32 měs.) — **mladší otelení = lepší ekonomika**

**5. Březí jalovice (in-calf heifer) — 15–24 měs.:**
- **Gravidita**: 280 dní (9 měs.)
- **Krmení**: stejné jako mladá jalovice + last trimester +20 % energie
- **Hmotnost při otelení**: 550–650 kg (holštýn)
- **Stáj**: krávový kotec (= připravuje se na laktační skupinu)

**Náklady odchovu jalovice (CZ 2024):**
- **Krmení** (22 měs.): ~22 000 Kč
- **Veterina, léčiva**: ~3 000 Kč
- **Inseminace**: ~500 Kč
- **Práce, energie, voda**: ~6 000 Kč
- **Amortizace stájí**: ~4 000 Kč
- **Celkem**: ~35 000 Kč na 1 jalovici do prvního otelení

**Hodnota jaločky / jalovice:**
- **Narozená jaločka** (z top genetiky): 5 000–15 000 Kč (jen jako tele)
- **Březí jalovice** připravená k otelení: **50 000–80 000 Kč**
- **Top genetická chovná jalovice** (NA-3+, Top 100 BBA): 80 000–250 000 Kč
- **Embryová jalovice** (z ET): 100 000–500 000 Kč

**Sexované semeno** (viz [[inseminace]]):
- **Standardní inseminace**: 50 % jaločky / 50 % býčci
- **Sexed semen**: 90 % jaločky
- **Strategická aplikace**: top 25 % krav stáda dostane sexed semen (= zaručené jaločky pro chov), spodní 25 % dostane masná genetika (= cross-bred tele pro maso, prodá se za 12–20 tis. Kč)

**Welfare a problémy:**
- **První otelení**: dystocie (těžký porod) častější než u dospělých krav (15 % vs 8 %)
- **Doporučená pánev**: změřit perineum a pánev rektálně → vyloučit extrémně úzké
- **První laktace**: 75 % výroby dospělé krávy. Plný potenciál až 3. laktace.

**Genetický pokrok:**
- Jalovice = **nová generace** stáda
- Pokud máte top 10 % krav = doporučeno top semen + ET → maximální zlepšení
- Spodní 30 % stáda = masná genetika (genetická slepá ulička)

**Stárnoucí stádo:**
- Průměrný věk krávy v CZ stádech: **3,5 laktace** (= 5–6 let)
- **Cyklus**: 30–35 % jalovic ročně vstupuje do stáda jako prvotelky, 30–35 % krav odchází (kanibalismus nebo prodej)

**„Sirka"** — slovenský / valašský dialekt pro jalovici, dnes regionálně v Moravě.

Viz též [[oteleni]], [[rijnost]], [[inseminace]], [[usni-znamka]], [[tmr]], [[dojirna]].`,
    related: ['oteleni', 'rijnost', 'inseminace', 'usni-znamka', 'tmr'],
  },
  {
    slug: 'usni-znamka',
    term: 'Ušní známka',
    alias: ['ušnice', 'ear tag', 'identifikační známka', 'IZR značení'],
    kategorie: 'chov',
    shortDef: 'Ušní známka je plastová identifikační visačka aplikovaná do ucha hospodářského zvířete povinná v EU. Skot, ovce, kozy, prasata. Obsahuje individuální kód napojený na IZR (Integrovaný zemědělský registr) — bez ní zvíře nesmí opustit farmu ani jít na jatka.',
    longDef: `Ušní známka (anglicky *ear tag*, oficiálně **identifikační známka**) je **plastová visačka** s individuálním kódem, kterou EU legislativa vyžaduje pro všechna hospodářská zvířata (skot, ovce, kozy, prasata, kůně) jako součást **registračního systému zvířat**. V ČR je vázána na **IZR — Integrovaný zemědělský registr** spravovaný SZIF.

**Legislativní rámec:**
- **EU nařízení 1760/2000** — povinnost identifikace skotu (po BSE krizi)
- **EU 21/2004** — ovce a kozy
- **EU 1/2005** — prasata
- **CZ zákon 154/2000 Sb.** o plemenitbě
- **CZ vyhláška 136/2004 Sb.** — technické provedení známek

**Co je na ušní známce:**

**Skot — dvě známky (povinně do 7 dní po porodu):**
- **Velká plastová známka** (žlutá, asi 8 × 6 cm) v levém uchu
- **Malá kovová / plastová známka** v pravém uchu (záloha pro případ ztráty velké)
- **Obsah**:
  - **CZ** (kód státu)
  - **9-místné individuální číslo zvířete** (např. *CZ 123 456 789*)
  - **Logo zvířete / IZR**
  - **Volitelně**: jméno chovatele, výstroj farmy, RFID chip (HDX 134,2 kHz)

**Prasata:**
- **1 ušní známka** s číslem hospodářství (ne individuální)
- Nebo **tetování** (tetovací vyznačovací kleště v levém uchu)
- Při převozu do jiného hospodářství: nová známka

**Ovce, kozy:**
- **2 známky** (jako skot), jedna z nich obsahuje RFID
- Pro **elektronickou identifikaci** v moderních ovčárnách

**RFID elektronická identifikace:**
- **HDX (Half Duplex)** vs **FDX-B (Full Duplex)** — standardy
- **Frekvence**: 134,2 kHz (ISO 11784/11785)
- **Čtecí dosah**: 10–40 cm (statické čtečky), 1–3 m (anténní brány)
- **Použití**:
  - Automatické krmení v dojírně (= jiná dávka koncentrátu pro každou krávu)
  - Vážení v průchodu (auto-record do databáze)
  - Mléčné dojící roboty (Lely, DeLaval)
  - Sběr dat o aktivitě (CowManager, Allflex Heatime)

**Aplikace ušní známky:**
- **Speciální kleště** (tagger) — jednorázový nebo opakovaně použitelný (Allflex, Datamars, Caisley)
- **Místo aplikace**: dolní třetina ucha, mezi 2 cévami (vyhneme se krvácení)
- **Hygiena**: dezinfekce kleští mezi zvířaty
- **Bolestnost**: krátké píchnutí, do 30 sec uklidnění zvířete

**Ztráta známky:**
- **Skot**: ~3–8 % ročně (zaháčí se o stáj, ostatní krávy)
- **Postup**: chovatel zjistí ztrátu, objedná **náhradní známku** od SZIF/IZR (stejné individuální číslo), nasadí ji do 7 dní
- **Cena 1 známky** (2024): 25–50 Kč skot, 8–15 Kč ovce
- **Roční náklady na známky** pro stádo 100 krav: ~1 500–3 000 Kč

**Sankce za chybějící známky:**
- **Skot bez známky nesmí opustit farmu** (= nemůže jít na jatka, prodej)
- **SZIF kontrola** — 1× ročně, pokuta 10 000–500 000 Kč
- **Dotace BISS / CISS** závislé na řádné identifikaci
- **Riziko AVI / SBV** epidemie — neidentifikované zvíře nelze trasovat

**IZR — Integrovaný zemědělský registr:**
- **Databáze**: čísla zvířat + historie pohybů + farmáři + jatka
- **Pohyb zvířete** = nahlásit IZR do 7 dní (původ + cíl)
- **Otelení** = nahlásit do 7 dní (jiné číslo pro telete + matka)
- **Úhyn / porážka** = nahlásit do 7 dní
- **Online systém**: portal.szif.cz, mobilní aplikace „IZR mobile"

**XML hromadné exporty z IZR:**
Profi farmy používají **XML export pro hromadné hlášení** přesunů (např. po sklizni jater nebo přesun krav mezi stájemi):
- Generuje se z managment softwaru (CowVision, AgroTronic)
- Nahraje se na portál SZIF
- Validace XSD schéma, chyby online

**Pasporty (Cattle Passport / Identifikační karta):**
- **Skot**: každé zvíře má vlastní **identifikační kartu** vystavenou SZIF s historií pohybů
- **Karta je papírová**, vystavena s první registrací, doplňuje se přesuny
- **Pas musí cestovat se zvířetem** při transportu (riskuje řidič přepravy)

**Moderní vývoj — biometrika:**
- **Boluse** (RFID v bachoru, polykané zvířetem) — Mottainai, Cowtronix
- **Retinální skenování** — Vision Pro (US) — bezdotyková ID
- **Obličejová identifikace** (AI) — DeLaval BCS Camera
- Tyto technologie zatím nejsou EU legálním nahrazením visačkou, jen doplňkem.

**Tetování / freeze branding:**
- Dříve používané (před EU 1760/2000), dnes jen u koní a v některých USA chovech
- **Bolestivé**, dnes v EU většinou nahrazeno visačkami

Viz též [[oteleni]], [[inseminace]], [[jalovice]], [[lpis]], [[dojirna]].`,
    related: ['oteleni', 'inseminace', 'jalovice', 'lpis'],
  },
  {
    slug: 'krmne-davky',
    term: 'Krmné dávky',
    alias: ['krmiva pro skot', 'výživa skotu', 'feed ration'],
    kategorie: 'chov',
    shortDef: 'Krmná dávka je denní množství krmiva pro hospodářské zvíře, vyvážené podle energie, bílkovin, vlákniny a minerálů. Pro vysokoužitkovou dojnici 50–70 kg krmiva (22–28 kg sušiny). Plánování je věda — chyba = ztracená laktace nebo zdravotní problém.',
    longDef: `Krmná dávka (anglicky *ration*, *diet*) je **denní množství a složení krmiva** pro hospodářské zvíře, vypočítané podle jeho **produkčního stadia, hmotnosti a klimatu**. Cílem je zajistit **maximální užitkovost při ekonomickém krmení**.

**Komponenty dávky pro skot:**

**1. Píce (forage) — strukturální vláknina:**
- **Travní siláž / senáž**: NDF 50–60 %, NEL 5,8–6,4 MJ/kg DM
- **Kukuřičná siláž**: NDF 38–45 %, NEL 6,4–7,0 MJ/kg DM, vysoká energie ze škrobu
- **Vojtěšková siláž**: NDF 40–48 %, CP 19–22 %, vysoký Ca
- **Seno**: NDF 55–65 %, doplněk pro strukturu, „scratch factor" pro bachor
- **Sláma**: NDF 75–85 %, low energie, pro extenzivní chovy nebo zaprahlé krávy

**2. Koncentráty (jádro) — energie a bílkoviny:**
- **Pšenice, ječmen, kukuřice (zrno)**: NEL 8,3–8,7 MJ/kg DM, CP 9–13 %, vysoký škrob
- **Sójový extrahovaný šrot (SES)**: CP 45–48 %, vyvážený aminokyselinový profil
- **Řepkový extrahovaný šrot (ŘES)**: CP 36–38 %, levnější než SES, slightly nižší kvalita
- **Slunečnicový šrot**: CP 32–38 %, vysoká vláknina
- **Sušené pivovarské mláto**: CP 24–28 %, NEL 7,0 MJ
- **DDGS** (suchý destilátorský zbytek): CP 28–30 %, NEL 7,2 MJ — vedlejší produkt z bioetanolu

**3. Vedlejší produkty / By-products:**
- **Cukrovarské řízky**: čerstvé (vlhké) 8 % CP, NEL 6,9 MJ
- **Pivovarské mláto**: 25 % CP, NEL 6,5 MJ
- **Soja okara**: 26 % CP, NEL 6,8 MJ
- **Pomerančové slupky (CR)**: vysoký cukr, NEL 7,5 MJ
- **Voda po výrobě sýra (whey)**: tekutina, nízká hodnota

**4. Minerály a vitaminy:**
- **Ca**: 0,8–1,0 % suš. (mléko obsahuje Ca, vysoká potřeba)
- **P**: 0,4–0,5 % suš.
- **Mg**: 0,2–0,3 % suš. (prevence tetanie pastvy)
- **Na (sůl)**: 0,2 % suš.
- **K**: 1,0–1,5 % suš.
- **Mikroprvky**: Zn 60–80 ppm, Cu 15–20 ppm, Se 0,3 ppm, I 0,8 ppm
- **Vitamin A**: 100 000 IU/den
- **Vitamin D₃**: 40 000 IU/den
- **Vitamin E**: 500 mg/den

**Typové dávky:**

**Vysokoužitková dojnice (45+ kg mléka/den, 700 kg živé hmoty):**
- 28 kg kukuřičné siláže
- 18 kg travní siláže
- 4 kg vojtěškové senáže
- 9 kg jádra (mix obilovin)
- 3 kg SES
- 1,5 kg cukrovarské řízky
- 0,4 kg minerály
- **Celkem**: 64 kg krmiva, ~26 kg sušiny
- **Cena**: ~95 Kč/kus/den

**Středně užitková (30 kg mléka/den):**
- 25 kg kukuřičné siláže
- 15 kg travní siláže
- 6 kg jádra
- 2 kg SES
- **Cena**: ~70 Kč/kus/den

**Zaprahlé krávy (suché, 60 dní před otelením):**
- 30 kg travní siláže nebo senáže
- 4 kg sena (vláknina pro bachor)
- 1 kg minerální směsi „dry cow"
- **Cena**: ~30 Kč/kus/den
- **Cíl**: minimální energie, max struktura, prevence mléčné horečky

**Žírný býk (intenzivní výkrm, 400–700 kg):**
- 12 kg kukuřičné siláže
- 4 kg sena
- 5 kg jádra
- 0,5 kg SES
- 0,2 kg minerály
- **Cíl**: 1,2 kg přírůstku/den
- **Cena**: ~50 Kč/kus/den

**Telete v odstavu (3 měs.):**
- 0,8 kg telecí krmné směsi
- 0,3 kg sena
- Plný přístup vody
- **Cena**: ~25 Kč/kus/den

**Klíčové parametry:**

**Sušina (DM)**: 22–28 kg/den pro krávu = 3,5–4,5 % živé hmotnosti
**Energie (NEL)**:
- Dojnice (start laktace): 7,2 MJ/kg DM (vysoká koncentrace)
- Dojnice (pozdní laktace): 6,5 MJ/kg DM
- Suché krávy: 5,2 MJ/kg DM

**Crude Protein (CP)**:
- Vysoké užitkovost: 17–18 %
- Střední: 15–16 %
- Suché: 12–13 %

**RUP (Rumen Undegradable Protein)**: 35–42 % CP = bílkovina projdou nezdegradované přes bachor, vstřebá se v tenkém střevě = vyšší užitkovost

**NDF (Neutral Detergent Fiber)**: 30–34 % DM = strukturální vláknina, ne moc (= acidóza), ne málo (= podstrukturní strava)

**Software pro plánování:**
- **NDS Professional** (IT) — světový standard
- **CPM-Dairy** (USA)
- **Spartan Dairy** (USA)
- **AMTS Cattle Pro** (USA)
- **DAIRY-X** (CZ) — domácí řešení
- **Agralis CCT** (CZ) — full farm management včetně krmení

**Sledování:**
- **Spotřeba** vážení vstup vs odpad = skutečný příjem
- **BCS** (Body Condition Score) — 1–5 stupeň výživného stavu
- **Mléčný profil** — bílkoviny, tuk, urea, somatické buňky → laboratorní analýza krávy mléko 1× měs.
- **Bachorové pH** — sonda u problémových stád

**Krmení a ekonomika:**
- **Krmivo** = **60–70 % nákladů na mléko**
- **Optimalizace dávky** = 1 Kč/krávu/den úspory × 365 dní × 100 krav = **36 500 Kč/rok**
- Konzultace nutricionisty (1–3 tis. Kč/měs.) se typicky vyplatí

Viz též [[tmr]], [[kukurice-silazni]], [[vojteska]], [[oteleni]], [[rijnost]], [[siloky-balik]].`,
    related: ['tmr', 'kukurice-silazni', 'vojteska', 'oteleni', 'siloky-balik'],
  },

  // ── HOVOROVÉ VÝRAZY A SLANG ─────────────────────────────────────────
  {
    slug: 'kombajner',
    term: 'Kombajnér',
    alias: ['kombajnista', 'řidič kombajnu', 'sklízeč'],
    kategorie: 'slang',
    shortDef: 'Kombajnér je hovorové označení pro řidiče sklízecí kombajnové mlátičky během žní. V profesní hierarchii farmy nejviditelnější a nejnáročnější pozice — pracuje 12–16 h/den po dobu 2–6 týdnů sklizně.',
    longDef: `Kombajnér (kombajnista, řidič kombajnu) je **hovorové označení pro řidiče sklízecí kombajnové mlátičky**. Není to oficiální profesní titul (formálně „operátor zemědělských strojů" nebo „řidič samojízdných strojů"), ale v zemědělské komunitě plně zavedený výraz.

**Pozice ve farmě:**
- **Sezónní intenzita** — během žní (červenec–září) pracuje 12–16 h/den, často 7 dní v týdnu
- **Mimo sezónu** — obvykle řidič traktoru, mechanik, údržbář, nebo má jinou práci na statku
- **Plat** — v sezóně 50 000–100 000 Kč/měs. (intenzita), mimo sezónu 35 000–60 000 Kč/měs. (přepočet na hodiny ~40–60 Kč/h před zdaněním + dohodnuté úkolové bonusy)

**Co se od kombajnéra očekává:**
- **Technické dovednosti**:
  - Nastavení kombajnu pro danou plodinu (mlátička, rošty, ventilátor, žací lišta výška)
  - Údržba (mazání, kontrola olejů, výměna nožů, řemenů)
  - Diagnostika poruch (displej kombajnu, hydraulika, elektronika)
  - Spojení mechanika + řidiče v jednom

- **Agronomický cit**:
  - Posouzení správné vlhkosti obilí (vlhkoměr v kombajnu vs vlastní pocit)
  - Optimální výška seče (ozim 12–15 cm, sója 5–8 cm, řepka 25–35 cm)
  - Kdy zastavit (ráno za rosy = mokré obilí, večer = ztracené hodiny)
  - Reakce na polehlé obilí (snížit rychlost, žací lištu níže)

- **Logistika**:
  - Koordinace s odvozem (návěs musí být u kombajnu v plné zásobníku)
  - Komunikace s vedoucím farmy přes vysílačku
  - Plánování přesunů mezi poli

- **Vytrvalost**:
  - Sezóna začne ozimou pšenicí (polovina července)
  - Pokračuje řepkou, ječmenem
  - Vrcholy v srpnu — kukuřice, slunečnice
  - Konec v září — sója, slunečnice
  - **Celkem 6–10 týdnů s minimem volna**

**„Velký kombajnér" vs „obyčejný kombajnér":**

V profesní hierarchii velkých farem existuje neformální rozlišení:
- **„Velký kombajnér"** = řidič top techniky (Claas Lexion 8900, John Deere S790). Má největší zodpovědnost, nejlepší plat. Často roky zkušeností.
- **„Obyčejný kombajnér"** = junior pozice, řídí starší kombajn (Claas Lexion 600 z 2010, Case IH Axial-Flow 7240 starší). Učí se. Pod dohledem.

**Žargon:**
- **„Stuhnout / vyhořet / přesytit mlátičku"** — přemíra obilí ucpe mlátičku, kombajn se zastaví
- **„Plivnout"** — odhodit nadbytek nemlátitelné slámy (např. kvůli vlhkosti)
- **„Žít na buřtu"** — během žní nemá kombajnér čas pravidelně jíst, žije z buřtů a piva
- **„Být v zásobě"** — kombajn má plný zásobník (8–13 m³), čeká na návěs
- **„Hrát si na koně"** — vyplnit dlouhý transport kombajnu po silnici mezi farmami
- **„Padá zelený"** (= vlhkostní procenta) — obilí příliš vlhké pro mlácení (>15 %)

**Specifika ČR (2024):**
- **Cizí kombajnéři** — mnoho farem si najímá zahraniční řidiče (slovenské, polské, rumunské) jen na sezónu. Ubytování ve farmě.
- **Sezónní fakta**: cca 3 500 kombajnů v provozu, 1 sezónu 2,8 mil. ha obilí, průměrně 800 ha/kombajn/sezónu.
- **Genderové zastoupení**: 99 % muži. Posledních 5 let pomalý nárůst žen-kombajnérek (zejm. mladá generace, agronomky).

**Slangové synonymum** v polském zemědělství: *kombajnista*. V německy mluvících oblastech: *Mähdrescherführer*. V anglosaském světě: *combine operator* (nebo jednoduše „farmer running the combine").

Viz též [[traktorista]], [[kombajn-trida]], [[rotor-kombajn]], [[zne]], [[header]].`,
    related: ['traktorista', 'kombajn-trida', 'rotor-kombajn', 'zne', 'header'],
  },
  {
    slug: 'traktorista',
    term: 'Traktorista',
    alias: ['řidič traktoru', 'agro řidič'],
    kategorie: 'slang',
    shortDef: 'Traktorista je hovorové označení pro řidiče zemědělského traktoru. Nejstarší a nejtypičtější profese mechanizovaného zemědělství. Dnes „univerzál" — orá, seje, hnojí, postříká, převáží. Profesní cesta může vést až k vedoucímu mechanizace.',
    longDef: `Traktorista je **hovorové označení pro řidiče zemědělského traktoru**. Profese vznikla s nástupem mechanizace zemědělství ve 20. letech 20. století a stala se **klíčovou pozicí venkovské práce** v Československu, později ČSSR a dnešní ČR.

**Co traktorista dělá:**

**Polní práce** (jaro–podzim):
- **Orba** (pluh, podmítač, hluboký dlátový kypřič) — viz [[orba]], [[pluh]]
- **Setí** (secí stroj, secí kombinace) — viz [[ozim-jarin]]
- **Hnojení** (rozmetadlo, postřikovač) — viz [[npk-hnojivo]]
- **Postřik** (postřikovač) — viz [[roundup]]
- **Sklizeň** (mlátička v kombinaci s kombajnem, lis, balíkovací stroj)
- **Slámování a balíkování** — viz [[siloky-balik]]
- **Krmné kalkulace** — vožení siláže na siláž

**Zimní práce**:
- **Vyklízení sněhu** (radlice na traktor)
- **Štěpkování** (drtič větví, štěpkovač) — biopaliva
- **Doprava** (kejda, hnůj, sláma) — kontinuální celý rok
- **Údržba strojů** — opravy, malování, údržba

**Hierarchie traktoristy:**

**1. „Mladý kluk u traktoru"** (junior):
- Čerstvý zaměstnanec, věk 18–25 let
- Začíná na **menším traktoru** (Zetor 5xxx, John Deere 6100 atd.)
- Práce: vyklízení hnoje, jednoduché převozy, údržba
- Plat: 25 000–35 000 Kč/měs.

**2. „Zkušený traktorista"** (regular):
- 3–10 let zkušeností
- Řídí **střední traktor** (90–150 koní)
- Univerzál — orá, seje, postřikuje
- Plat: 35 000–55 000 Kč/měs.

**3. „Šéf-traktorista"** (senior, hlavní traktorista):
- 10+ let, plné zkušenosti
- **Top stroj farmy** (Fendt 728, JD 7R 250 atd.)
- Plánuje sezónní práce, učí mladší
- Často také mechanik (umí poradit s diagnostikou)
- Plat: 55 000–75 000 Kč/měs.

**4. „Vedoucí mechanizace"** (manager):
- Bývalý senior traktorista nebo agronom
- Plánuje nákup, údržbu, pojištění techniky
- Řídí ostatní traktoristy
- Plat: 70 000–110 000 Kč/měs.

**Specifika různých typů farem:**

**Velká agrární farma** (1 000+ ha):
- 8–15 traktoristů
- **Specializace** — někdo jen postřikuje, někdo jen seje, někdo jen kejdu vozí
- Hierarchická organizace, denní porady

**Středně velký statek** (200–500 ha):
- 2–4 traktoristé
- **Univerzálové** — každý umí všechno
- Rodinná atmosféra, neformální

**Malá rodinná farma** (50–200 ha):
- Často jen majitel + 1 traktorista (rodinný příslušník)
- Multitasking, vše v 1 osobě

**Technologie a požadavky 2024:**

Moderní traktor (Fendt 728, JD 7R, Massey 8S) má více displejů než auto:
- **GPS-RTK** auto-steering (přesnost 2 cm)
- **Telematika** (data v reálném čase do centrály)
- **ISOBUS** komunikace s nářadím
- **Variable rate** aplikace hnojiv podle map
- **Yield monitoring** — kombinace s daty z kombajnu

Traktorista 2024 musí umět:
- Klasické řemeslo (mechanika, hydraulika)
- + digitální dovednosti (číst displeje, kalibrovat senzory, řešit chyby softwaru)
- + agronomické rozhodování (kdy přerušit práci kvůli počasí, jak nastavit aplikační dávku)

**„Generační problém":**
- Většina traktoristů 50+ let (= „stará škola", manuální cit)
- **Mladí se hlásí málo** — image „špinavé" práce, sezónní intenzita, venkovský život
- Farmy řeší **přílivem ze Slovenska, Polska, Ukrajiny, Rumunska**
- **Robotizace** (autonomní traktor Bednar, Fendt Xaver) je úsměvná, ale do 2030 by mohla nahradit 30–50 % manuálních úkonů

**Žargon:**
- **„Šlapat"** — orat (od šlapání na pedál)
- **„Lupnout"** — náhle se zastavit, zalehnout (často kvůli poruše)
- **„Padák"** — kombajn (od slangového „padnout do mlátičky")
- **„Vážko vážko"** — trochu v hovorové („pomalu pomalu")
- **„Kobylka"** — slangové pro nejmenší traktor ve flotile
- **„Mašina"** — kterýkoli traktor obecně
- **„Šediváč"** — Zetor stará série (slang z 1970s, dnes již nepoužívané)

**Lidská kultura:**
- **„Babičkovy povídky o traktoristech"** (1968 J. Vodňanský) — kult v lidovém humoru
- **„Vesnice má svého traktoristu"** (1973 J. Menzel) — společenský film z JZD éry
- **Lidové písně**: „Padá kosa, padá / když traktorista bez ovládá" (50s)

Viz též [[kombajner]], [[cvt-prevodovka]], [[orba]], [[autonomni-traktor]], [[gps-rtk]].`,
    related: ['kombajner', 'cvt-prevodovka', 'orba', 'autonomni-traktor', 'gps-rtk'],
  },
  {
    slug: 'srotovnik',
    term: 'Šrotovník',
    alias: ['šrotovací stroj', 'drtič obilí', 'krmnářský šrotovník'],
    kategorie: 'slang',
    shortDef: 'Šrotovník je stroj na drcení obilí, kukuřice a luskovin na hrubý šrot pro krmení dobytka. Historicky poháněný žentourem nebo lokomobilou, dnes elektrický. Klíčové vybavení každé farmy s vlastní krmnářskou výrobou.',
    longDef: `Šrotovník (od slov *šrot* — drcené obilí) je **stroj na drcení obilí, kukuřice a luskovin** (sója, hrách, lupina) na **hrubý šrot** určený jako krmivo pro skot, prasata, drůbež. Bez šrotování by zvířata vetšinu zrna nezužitkovala (nestrávila celé zrna v traktu).

**Princip činnosti:**

**1. Mlecí (šrotovací) válce:**
- Dvě **drsné kovové válce** otáčející se proti sobě
- Mezi nimi vstupuje zrno, **mačká se a drtí**
- Konečná velikost: 1–5 mm úlomky (vs celé zrno 5–10 mm)
- Reguluje se **mezerou mezi válci** + rychlostí

**2. Kladivový šrotovník (hammer mill):**
- **Rotor s kladívky** (rychlost 3 000–4 500 ot/min)
- Drtí zrno o kovovou síta (perforaci)
- Výsledek: jemnější šrot (0,5–3 mm), víc prachu
- Vhodnější pro **prasata** (tradičně preferují jemnější)

**3. Diskový šrotovník:**
- Méně časté, pro speciální aplikace

**Šrotovaná zrniny — proč:**

**Pro skot:**
- Celé pšenice / kukuřice **prochází** trávicím traktem ne zužitkováno → 30–40 % ztráta
- Šrotování zvyšuje **stravitelnost** o 20–30 %
- Příliš jemný šrot u skotu = riziko **acidózy bachoru** (rychlá fermentace škrobu na kyseliny)
- **Optimum**: hrubý šrot 2–4 mm = vyvážená stravitelnost + struktura

**Pro prasata:**
- Strávitelnost mnohem citlivější (jednoduchý žaludek)
- Jemnější šrot (0,8–2 mm) vhodnější
- Riziko **žaludečních vředů** při příliš jemném (< 0,5 mm) = vrátit hrubší frakci

**Pro drůbež (kuřata, brojleři, slepice):**
- Drtina (krátké zrnka 1–3 mm) NEBO peletování
- Jemný prach (< 0,5 mm) drůbež nesnáší (lepí se ke zobáku)

**Pro koně:**
- Šrotovaná zrniny (ovesný šrot, ječmenný šrot)
- Hrubá konzistence = pomalá fermentace, nižší kolicová rizika

**Historie:**

**Žentourový šrotovník** (1800–1900) — viz [[zentour]]:
- Pohon: 1–2 koně chodící v kruhu
- Výkon: 50–150 kg šrotu/h
- V každém větším gruntě

**Parní lokomobila** (1880–1950):
- Putovní šrotovník
- Příjezd 1× měsíčně do vesnice, sedláci přiváželi obilí na šrotování
- Cena za úsluhu: typicky 5–10 % ze šrotovaného množství („mlátečná")

**Elektrický šrotovník** (od 1950):
- **3–7,5 kW** motor + válcová / kladívková mechanika
- **Domácí**: 800–3 000 kg šrotu/h
- **Pro velké farmy**: 5–20 t/h

**Současné typy:**

**Stacionární šrotovník** (na farmě):
- **Příkon**: 5–22 kW (~25–35 tis. Kč pro malý)
- **Velký pro farmu**: 30–75 kW (~80–250 tis. Kč)
- **Top značky CZ**: PS-Strojírny (Letohrad), Sano (Lichnov), DAS (Pardubice)
- **Top značky EU**: Skiold (DK), Renkum (NL), Romill (CZ-Brno)

**Mobilní šrotovník** (na traktoru):
- **Příkon**: z PTO traktoru, 30–80 kW
- **Výkon**: 1–5 t/h
- **Použití**: putovní šrotovník, mlecí kombajny (kombajn šrotuje za jízdy)
- **Cena**: 80 000–300 000 Kč

**Mlecí kombajn** (modernější trend):
- **Sklízí + šrotuje + ukládá** vlhké zrno do vaků pro siláž
- **Vlhké šrotování CCM** (Corn-Cob-Mix) — kukuřičné zrno + klás drcený + uložený do vaku
- Trend pro **mléčné farmy** (nahrazení nakupovaného koncentrátu)

**Šrot a krmiva:**

**Hodnocení kvality šrotu:**
- **Granulometrie** (velikost částic) — Penn State Particle Separator
- **Vlhkost** (max 14 % pro skladování, 30+ % pro vlhké šrotování CCM)
- **Teplota** po šrotování (vyšší u rychlých kladívkových — pozor na poškození vitamínů)

**Typický šrot na farmě:**
- **Pšeničný šrot**: 50–60 % obilný součást krmné dávky
- **Ječný šrot**: substituce pšenice, levnější
- **Kukuřičný šrot**: vysoká energie, nižší bílkoviny
- **Sójový šrot**: vysoké CP, dovážený nebo vlastní výroba
- **Hrachový šrot**: domácí proteinová alternativa SES

**Energetika a ekonomika:**

**Spotřeba elektřiny**:
- Válcový šrotovník: 6–12 kWh/t šrotu
- Kladívkový: 10–18 kWh/t šrotu
- **Cena** elektřiny: 6 Kč/kWh × 10 kWh = **60 Kč/t šrotu**

**Vlastní šrotování vs nakupované krmivo**:
- **Vlastní šrot ze sklizně**: 4 500 Kč/t pšenice + 60 Kč šrotování = **4 560 Kč/t šrotu**
- **Nakupovaný hotový koncentrát**: 8 000–12 000 Kč/t
- **Úspora 3 500–7 500 Kč/t** → velké farmy si šrotují téměř všechno

**Slangová a hovorová užití:**
- **„Šrotovat"** — kromě obilí znamená lidově „bít" (slangově), „mluvit zbytečně rychle"
- **„Šrotovník"** — slangově pro „pomalý / zastaralý počítač" („tenhle laptop je šrotovník")
- **„Šrot"** — používá se jak technicky (krmivo), tak v slangu („pojď, dáme si šrot" = dáme si pivo, slangově staré)

V kultuře: **„Šrotování"** byla v ČS literatuře symbolem podzimní práce (Karel Čapek, B. Hrabal).

Viz též [[zentour]], [[krmne-davky]], [[kukurice-silazni]], [[grunt]], [[tmr]].`,
    related: ['zentour', 'krmne-davky', 'kukurice-silazni', 'grunt', 'tmr'],
  },
  {
    slug: 'zemak',
    term: 'Zemák (brambor)',
    alias: ['zemčata', 'erteple', 'kobzole', 'brambora'],
    kategorie: 'slang',
    shortDef: 'Zemák je hovorové / dialektické označení pro bramboru (Solanum tuberosum). V češtině existují regionální varianty: zemák (severní Morava, Slezsko), erteple (jihlavsko, slang), kobzole (Slezsko, polské vlivy), brambor (standard CZ).',
    longDef: `Zemák (lidově *zemčata*, *erteple*, *kobzole*) je **hovorové a dialektické označení pro bramboru** — *Solanum tuberosum* — jednoletá hlíznatá rostlina z čeledi lilkovitých. V češtině má brambor desítky regionálních synonym, což svědčí o **historickém významu plodiny** v různých českých regionech.

**Regionální varianty:**

- **Brambor / brambora** — standard ČR, jihočeské nářečí. „Z Bramburska" = z německého Brandenburska, odkud se brambory šířily do Čech.
- **Zemák** — Slezsko, severní Morava. Z „země" + zdrobněliny.
- **Erteple** — jihlavsko, jihovýchodní Morava. Z německého *Erdäpfel* („zemská jablka").
- **Kobzole** — Slezsko, severovýchod (polské *kartofle*).
- **Zemčata** — Vysočina, českomoravská vrchovina.
- **Krumpáč** (zastaralé) — Slovácko, jihovýchodní Morava.
- **Krumple** — Valašsko.
- **Grumpera** — Chodsko.
- **Šemerlák** — okolí Telče.
- **Knedl** — slang ve velkých městech (z bramborového knedlíku).

**Historie v českých zemích:**

**1700s — příchod brambory:**
- Brambory přicházejí do Čech přes Vídeň (Marie Terezie) a Sasko (Sedmiletá válka 1756–1763)
- První pěstování v **klášterních zahradách** a u šlechty
- Sedláci dlouho odolávali — báli se „čertovy plodiny" (jed lilkovitých, zelené hlízy obsahují solanin)

**1770–1772 — Velký hladomor:**
- Tradiční obilí selhalo opakovaně
- **Marie Terezie nařídila povinné pěstování brambor** (1771)
- Brambora zachránila desítky tisíc rolníků od smrti
- Od té doby trvale zakotvená v české kuchyni

**1800–1860 — éra rozmachu:**
- Brambory se stávají **základní stravou venkova** (chudých)
- „Brambora s mlékem" — typický pokrm
- Vznik **bramborářských oblastí** (Vysočina, Krkonoše, Beskydy)

**1860+ — chov prasat a lihovary:**
- Brambory pro **krmení prasat** (vykrmená brambora)
- **Lihovary** zpracovávají bramborový škrob na ethanol (vodka, lék, chemie)
- Vznik **bramborářské tradice** (Vysočina, Pardubicko)

**Pěstování v ČR (2024):**

**Plocha**: ~24 000 ha (klesající trend, z 100 000 ha v 90s)
**Výnosy**: 26–35 t/ha (raně rané), 35–55 t/ha (pozdní průmyslové)
**Produkce**: ~700 000 t/rok

**Hlavní kategorie**:
1. **Konzumní brambory** (raně rané, červené, modré, žluté) — supermarkety
2. **Sadbové brambory** (certifikované osivo pro další generaci) — vyšší cena
3. **Průmyslové brambory** (lihovary, škrobárny, hranolkárny) — kontrakt
4. **Krmné brambory** (pro prasata, dnes méně časté)

**Klíčové oblasti pěstování**:
- **Vysočina** (Jihlavsko, Pelhřimovsko) — vyšší nadmořská výška, vyrovnaný výnos
- **Polabská nížina** (Polabí, Hradecko) — raně rané odrůdy
- **Šumavské podhůří** — kvalitní sadba
- **Chod / Plzeňsko** — historicky bramborář

**Top odrůdy CZ**:
- **Adéla** (raně rané)
- **Filea** (raně rané, červená)
- **Magda** (středně pozdní, žlutá)
- **Saturna** (průmyslová, výnosy 50+ t/ha)
- **Marabel** (pozdní, konzumní, vysoká kvalita)
- **Soraya** (sadba)

**Agrotechnika:**
- **Setí** sadbou (10–25 cm hloubka, rozteč 75 × 30 cm), březen–květen
- **Hnojení**: 80–120 kg N/ha + 60–80 P + 120–160 K
- **Postřiky**: proti plísním (oomyceta), mandelinky (Colorado beetle)
- **Sklizeň**: sklízeč brambor (vykopávač) — září–říjen
- **Skladování**: chladné, suché 4–8 °C, vlhkost 90 %

**Choroby a škůdci**:
- **Plíseň bramborová** (Phytophthora infestans) — historicky způsobila Velký irský hladomor 1845
- **Mandelinka bramborová** — invazní z USA (1922 první výskyt v ČR)
- **Háďátko bramborové** — karanténní škodlivý činitel

**Ekonomika 2024**:
- **Konzumní cena (supermarket)**: 15–40 Kč/kg
- **Cena od pěstitele**: 5–12 Kč/kg
- **Marže obchodu**: 200–400 % (mezi pěstitelem a regálem)
- **Průmyslová cena**: 3–6 Kč/kg (lihovary, škrob)

**Klesající plocha**:
- 1990: 100 000 ha
- 2010: 30 000 ha
- 2024: 24 000 ha
- **Důvody**: import (NL, DE, FR, PL), levná dovozová cena, vysoké náklady na techniku, choroby (plíseň)

**Slangová a kulturní role:**

- **„Zemáky"** — slangové pro „jednoduchá strava" („mám doma jen zemáky a mlíko")
- **„Brambora"** — pejorativní pro neohebnou osobu („je z něj brambora", „bramborové tělo")
- **„Bramborový salát"** — symbol Vánoc v české kuchyni
- **„Bramboračka"** (polévka) — chudá rolnická strava povýšená na národní pokrm
- **„Hozený brambor"** — v UK slang pro nevychovanou novinářskou otázku (= „hot potato")

**Lidové pranostiky:**
- „Když brambora kvete na svatého Vavřince (10. 8.), nebude úroda" (= pozdní kvetení = malé hlízy)
- „Mokrý červen, brambor zaplaval" (= příliš dešťů = plíseň)

V kultuře: **„Bramborové pohádky"** (J. Lada), **„Bramborové dni"** (regionální festivaly Vysočiny), **„Pelhřimovské bramborářské slavnosti"** (každoročně).

Viz též [[ozim-jarin]], [[osevni-postup]], [[npk-hnojivo]], [[roundup]], [[plisen-bramborova]], [[mandelinka-bramborova]].`,
    related: ['ozim-jarin', 'osevni-postup', 'npk-hnojivo', 'plisen-bramborova', 'mandelinka-bramborova'],
  },

  // ── OCHRANA ROSTLIN A POSTŘIKY ──────────────────────────────────────
  {
    slug: 'plisen-bramborova',
    term: 'Plíseň bramborová',
    alias: ['Phytophthora infestans', 'late blight', 'plíseň pozdní'],
    kategorie: 'ochrana',
    shortDef: 'Plíseň bramborová (Phytophthora infestans) je houbová choroba brambor a rajčat. Způsobila irský hladomor 1845–1849. Dnes nejvážnější choroba bramboru — bez fungicidů ztráta 50–100 % výnosu během 14 dní.',
    longDef: `Plíseň bramborová (lat. *Phytophthora infestans*, anglicky *late blight*, „pozdní plíseň") je **oomyceta** (ne pravá houba — patří mezi řasovce / Stramenopila) způsobující nejdůležitější chorobu **bramboru** a **rajčat**. Historicky způsobila **Velký irský hladomor** 1845–1849 (1 milion mrtvých, 1 milion emigrantů).

**Historie:**
- **1840s** — patogen poprvé pozorován v Belgii, Holandsku
- **1845–1849** — Irský hladomor. Brambory tvořily 80 % stravy chudých irských rolníků. Patogen zničil úrodu 3 roky v řadě.
- **1882** — francouz Pierre Marie Alexis Millardet objevuje **bordeauxskou jíchu** (CuSO₄ + Ca(OH)₂) v Médocu — náhodou, jako prevence proti zlodějům vinné révy. První historický fungicid.
- **20. století** — postupný vývoj systemických fungicidů (mancozeb, metalaxyl, cymoxanil)
- **2000s** — agresivní A2 mating type kmen z Mexika invadní do EU — patogen sexuálně reprodukuje → oospory v půdě → trvalost

**Životní cyklus:**
1. **Přezimování**: v hlízách brambor (semenách), kompostech, mrtvých rostlinách
2. **Sporulace**: ráno za rosy (vlhko + 10–25 °C) → sporangia
3. **Šíření**: vzduch (sporangia letí desítky km), voda (zoospory plavou v rosě)
4. **Infekce**: penetrace stomatami nebo přes ranky, projevy 3–5 dní po infekci
5. **Sekundární cyklus**: za 4–7 dní další sporulace → epidemie

**Symptomy:**
- **Listy**: tmavé hnědo-černé nekrózy, často s **bílým plíseňovitým okrajem** na rubu (sporulace)
- **Stonky**: tmavé skvrny, později kruhové rozkladné léze
- **Hlízy**: hnědé skvrny na povrchu → uvnitř hnědá/červená hniloba (často sekundárně bakteriální mokrý)
- **Rajčata**: stejné — hnědé skvrny, sporulace, hniloba plodů

**Riziko a varování:**
- **Vlhko + teplo** (RH > 90 %, T 10–25 °C) → vysoké riziko
- **Modelovací systémy** (Smith Period, NegFry, BlightCAST) — předpověď infekce 1-3 dny dopředu
- **CZ varování**: Státní rostlinolékařská správa (ÚKZÚZ) + komerční (BIRTeam, Bayer FieldView)

**Boj — fungicidy:**

**Preventivní (kontaktní)**:
- **Mancozeb** (Dithane, Penncozeb) — bílý prach, 7–10 dní účinek. **Plánovaný zákaz v EU** od 2024 (potenciálně karcinogenní)
- **Cymoxanil** — velmi efektivní, krátká účinnost (2–3 dny)
- **Měď** (CuSO₄, Cu hydroxid) — bio i konvenční. **Limit 4 kg Cu/ha/rok** v EU
- **Folpet** — alternative k mancozebu

**Systemické (lokálně systémové)**:
- **Metalaxyl, Metalaxyl-M** (Ridomil) — fenylamid, velmi efektivní. Riziko rezistence (problém od 1990s)
- **Mandipropamid** (Revus) — CAA fungicid, špička 2020s
- **Cymoxanil + Mancozeb** kombinace (Curzate)
- **Fluazinam** (Shirlan) — preventivní, dlouhá perzistence
- **Pyrimethanil** — komplikované použití

**Postřikový kalendář** (intensivní brambora, 2024 EU):
- **Klíčící**: žádný postřik
- **5–10 cm porost**: 1. prevence (mancozeb nebo Cu)
- **Před uzavíráním řádků**: 2. (cymoxanil/metalaxyl)
- **Květ**: 3.–4. postřik (mandipropamid)
- **Tvorba hlíz**: 5.–7. postřik (preventivní každých 7–10 dní)
- **Před sklizní**: 8. desikační (Reglone alternativa)
- **Celkem**: 7–10 postřiků/sezónu, **náklady 4 000–7 000 Kč/ha**

**Rezistentní odrůdy:**
- **Sárka, Adéla, Marabel** — středně tolerantní
- **Sárpo Mira** — vysoká rezistence, hodí se pro biofarmy
- **Bionica, Toluca** — moderní rezistentní hybridy
- **Rezistence není 100 %** — i tolerantní odrůdy potřebují 3–5 postřiků v rizikové sezóně

**Bio přístup:**
- Pouze **měď** (Cu — viz výše, 4 kg/ha/rok limit)
- **Bordeauxská jícha** (klasická, levná, vlastnoručně míchaná)
- **Bio-stimulanty** (silikát draselný, výtažky z kopřiv) — marginální efekt
- **Rezistentní odrůdy** + krátký vegetační cyklus (sklizeň brzy)

**Po infekci:**
- **Není léčba** — preventivní fungicidy se aplikují PŘED infekcí
- **Po prvních symptomech** → lokální „spalování" (zničit infikované rostliny mechanicky/chemicky)
- **Sklizená brambora** → třídit (žádné napadené do skladu, riziko hniloby celého skladu)

**V ČR 2024**: ztráty z plísně bramborové ~5–15 % výnosu i přes intenzivní postřik. Bez postřiků 50–100 % ztráta.

Viz též [[roundup]], [[fungicidy]], [[zemak]], [[ozim-jarin]], [[osevni-postup]], [[mez]].`,
    related: ['fungicidy', 'zemak', 'mandelinka-bramborova', 'desikace'],
  },
  {
    slug: 'fuzarioza',
    term: 'Fuzarióza klasů',
    alias: ['Fusarium head blight', 'FHB', 'klasová fuzarióza', 'Fusarium graminearum'],
    kategorie: 'ochrana',
    shortDef: 'Fuzarióza klasů (Fusarium spp.) je houbová choroba obilí (pšenice, ječmen) napadající klasy. Produkuje mykotoxiny (DON, ZEA, T-2) škodlivé pro lidi i zvířata. Standardní limit EU pro DON v pšenici = 1,25 mg/kg.',
    longDef: `Fuzarióza klasů (anglicky *Fusarium Head Blight*, FHB) je **houbová choroba obilí** způsobená komplexem druhů rodu *Fusarium* (*F. graminearum, F. culmorum, F. avenaceum, F. poae*). Napadá především **pšenici, ječmen, žito, oves, kukuřici**. Klíčový problém: **mykotoxiny**.

**Druhy a mykotoxiny:**

| Druh | Hlavní mykotoxin | Účinek |
|------|------------------|---------|
| **F. graminearum** | DON (deoxynivalenol) | Imunosupresivní, gastrointestinální |
| **F. graminearum** | ZEA (zearalenon) | Estrogenní (problém u prasat) |
| **F. culmorum** | DON, ZEA, NIV | Podobné |
| **F. poae** | NIV (nivalenol), T-2 | Vysoce toxický (T-2 = bojový agent) |
| **F. avenaceum** | Moniliformin, ENN | Kardiotoxický |
| **F. verticillioides** (kukuřice) | Fumonisiny | Karcinogenní, neurologický |

**EU limity mykotoxinů** (Nařízení 1881/2006 + 2023 revize):
- **DON**: pšenice/ječmen pro konzum 1,25 mg/kg, krmivo 8 mg/kg
- **ZEA**: pšenice 100 µg/kg, kukuřice 350 µg/kg
- **Fumonisiny**: kukuřice 4 000 µg/kg
- **Aflatoxiny** (jiný rod *Aspergillus*): 4 µg/kg max

**Symptomy:**
- **Klásky bělavé** (předčasně dozrávají) — kontrast se zdravými zelenými
- **Růžovo-oranžová sporulace** na klasu při vlhku
- **Zrno scvrklé, „růžovaté"** ("tombstone kernels", *piepsy*)
- **Posklizňový test**: laboratoř kvantifikuje DON na ELISA nebo HPLC

**Rizikové faktory:**
- **Předplodina kukuřice** — *F. graminearum* přezimuje v kukuřičných stočistích
- **No-till** + reziduální sláma kukuřice = vysoké riziko
- **Vlhko + teplo** (15–25 °C, déšť 24–48 h) **během kvetení pšenice** (BBCH 61–69, polovina května až polovina června)
- **Husté porosty** (nesnižuje aerace klasů)

**Boj — chemický:**

**Klíčový moment — postřik ve kvetení (BBCH 63–67)**:
- **Triazoly**: prothiokonazol (Prosaro, Caramba), tebuconazol, metconazol
- **SDHI** (Inatreq): fluxapyroxad, bixafen — moderní generace
- **Strobiluriny**: azoxystrobin (NOT recommended pro FHB — některé druhy F. zvyšuje DON!)
- **Kombinace** SDHI + triazol = stříbrný standard 2020s
- **Aplikace**: 200–400 l vody/ha, jemné rozprášení, **timing kritický** (kvetoucí klasy)

**Efektivita postřiku:**
- **Optimal timing**: -40 % DON, -50 % FHB
- **Pozdě**: +10 % efekt na DON
- **Brzo (před kvetením)**: 0 efekt
- **Nutné měřit** vegetační stádium, ne datum

**Boj — agrotechnický:**
- **Předplodina**: po kukuřici **NESÉT pšenici**. Lepší: řepka → pšenice nebo luskovina → pšenice.
- **Zpracování půdy**: orba zaorá *Fusarium* rezidua, snižuje inokulum o 50–80 %. **No-till + kukuřice = nejhorší kombinace**.
- **Rezistentní odrůdy**: částečná tolerance (nikdy 100%). Sumai 3 (CN) = donor genu Fhb1, používaný v EU šlechtění.
- **Hustota porostu**: 350–450 klasů/m² (vyšší = vyšší riziko)
- **Hnojení**: vysoký N nezvyšuje FHB výrazně, ale prodlužuje kvetení = větší okno infekce
- **Odolnost**: BBCH model + meteodata + povětrnostní stanice = pre-warning systém

**Sklizeň a posklizňová úprava:**
- **Časné kombajnování** napadeného porostu — méně času pro další sporulaci
- **Vyšší vlhkost při sklizni** (15–20 %) → ihned sušit pod 13 %
- **Čištění** — *fuzariové zrno je lehčí*, lze ho oddělit air-screen čistírnou (ztráta 5–15 % hmotnosti, ale DON klesne o 50–80 %)
- **Sklad** za sucha a chladu (< 14 % vlhkost, < 15 °C) — *Fusarium* dále neroste

**Ekonomický dopad:**
- **Cena kontaminovaného obilí**: výkup ho přijme s 30–50 % srážkou nebo odmítne (krmné = nižší cena, nesplnění mlynářských limitů)
- **Náklady na postřik FHB**: 800–1 500 Kč/ha (1 aplikace)
- **Ztráta výnosu**: 10–30 % při napadení
- **CZ 2024**: cca 20–30 % sklizně pšenice ve „FHB riziku" v některých letech

**Lidské zdraví:**
- **Akutní otrava** vysokými dávkami DON: nausea, zvracení, hořkost v ústech
- **Chronická expozice**: imunosuprese, růstová retardace u dětí
- **ZEA**: hormonální disrupce (estrogenní), problém pro prasata

**Krmiva pro zvířata:**
- **Prasata** velmi citlivá (limit DON 0,9 mg/kg krmiva)
- **Skot** méně citlivý (5 mg DON/kg krmiva)
- **Drůbež** středně citlivá (2 mg DON/kg)
- **Mykotoxinové vazače** (bentonity, glukomananové stěny kvasinek) — kompenzace v krmivu pro vázání toxinů v trávicím traktu

**V ČR výzkum**: VURV Praha-Ruzyně, Mendelu Brno — selekce rezistentních odrůd, predikční modely.

Viz též [[fungicidy]], [[ozim-jarin]], [[osevni-postup]], [[no-till]], [[kukurice-silazni]], [[hektolitr]].`,
    related: ['fungicidy', 'ozim-jarin', 'osevni-postup', 'no-till', 'septorioza', 'rzi'],
  },
  {
    slug: 'septorioza',
    term: 'Septorióza',
    alias: ['Zymoseptoria tritici', 'STB', 'Septoria tritici blotch', 'listová septorióza pšenice'],
    kategorie: 'ochrana',
    shortDef: 'Septorióza (Zymoseptoria tritici, dříve Septoria tritici) je nejvýznamnější houbová choroba listů pšenice v Evropě. Snižuje výnos o 30–50 % bez postřiku. Klíčový důvod fungicidních postřiků na pšenici v Evropě.',
    longDef: `Septorióza pšenice (*Zymoseptoria tritici*, dříve *Septoria tritici* nebo *Mycosphaerella graminicola*, anglicky *Septoria tritici blotch*, STB) je **dominantní listová choroba pšenice ve západní a střední Evropě**. V CZ je hlavním důvodem ošetření pšenice fungicidy — bez postřiku 30–50 % ztráta výnosu.

**Životní cyklus:**
1. **Přezimování**: na rostlinných zbytcích pšenice (sláma) nebo na ozimu na podzim
2. **Šíření na podzim** (ozim): déšť rozšiřuje **pyknospory** na listy. Mírné teploty + déšť = ideální.
3. **Latentní fáze**: 14–28 dní (mírná zima → infekce neviditelná)
4. **Symptomy na jaře**: žlutavé skvrny s malými černými tečkami (pyknidy)
5. **Vertikální šíření**: spóry letí déštěm vzhůru, postupně napadá vyšší listy (flag leaf — vlajkový list je nejcennější, dodává 60 % asimilátů zrnu)
6. **Sekundární cyklus**: nový déšť = nové sporulace = nová infekce

**Symptomy:**
- **Žluté → hnědé** nepravidelné skvrny na listech
- **Charakteristické**: drobné **černé pyknidy** v ploše léze (hodně teček na 1 cm²)
- **Postup zdola nahoru**: dolní listy ovlivněny nejdřív, postupně do vrcholu
- **Nejvíc škodí napadení vlajkového listu** (F0) a F-1 — 60 % výnosu závisí na nich

**Rizikové faktory:**
- **Časné setí ozimu** (před 15. zářím) → větší infekce v podzimu
- **Vlhké jaro** (déšť > 5 mm v rozmezí 10 dní) → každý déšť = nová infekce
- **Husté porosty** → mikroklima = vlhko
- **Vysoké N hnojení** → bujný porost
- **Předplodina pšenice** → inokulum přezimuje ve slámě (proto **NESÉT pšenice po pšenici**)
- **No-till + sláma na povrchu** → zachovaný inokulum

**Boj — fungicidy:**

**Klíčové ošetření**:
1. **T0 (BBCH 30–32, jaro)** — pokud silné napadení z podzimu. Levný basic.
2. **T1 (BBCH 32–37)** — ošetření krymové listy. Triazol + SDHI.
3. **T2 (BBCH 39–49, flag leaf)** — **NEJCENNĚJŠÍ ošetření**. Vlajkový list musí zůstat zelený.
4. **T3 (BBCH 60–69, kvetení)** — fuzarióza + dozrávání. Triazol nebo strobilurin.

**Aktivní látky:**
- **Triazoly (DMI)**: tebuconazol, prothiokonazol, metconazol — hlavní třída 30 let, **rostoucí rezistence**
- **SDHI**: fluxapyroxad (Bixafen), benzovindiflupyr (Solatenol), pydiflumetofen — top performery 2020s. Riziko rezistence (mírné, dosud zvládnutelné).
- **Strobiluriny (QoI)**: azoxystrobin (Amistar), pyraclostrobin — **dnes prakticky neúčinné na septoriózu** kvůli rezistenci (mutace G143A v cytochromu b). Stále se používají pro jiné choroby.
- **Inatreq active** (fenpicoxamid) — nová třída, 2021+ na trhu. Zatím low resistance.
- **Mefentrifluconazole** (Revysol) — nová DMI z BASF s lepší aktivitou na rezistentní izoláty

**Strategie anti-rezistence:**
- **Mix činných látek** vždy (triazol + SDHI + strobilurin)
- **Maximální 1× na sezónu** stejnou účinnou látku
- **Kombinace s biologie** (bacillus, Trichoderma — komerčně tlumené pro velké farmy)

**Náklady postřiků:**
- **T1**: 600–1 200 Kč/ha
- **T2**: 800–1 500 Kč/ha (flag leaf — kvalitní mix)
- **T3**: 700–1 200 Kč/ha
- **Sezónní celkem**: 2 100–3 900 Kč/ha pro pšenici

**Návratnost:**
- Postřik T2 ušetří 1–2 t/ha = 5 000–10 000 Kč/ha → návratnost 4–6×
- T1 + T3 méně klíčové, ale zachovávají rezerve T2

**Agrotechnika (anti-septorióza bez chemie):**
- **Odolné odrůdy**: Bohemia, RGT Sacramento, Arnaud (CZ trh) — částečná tolerance
- **Pozdější setí** ozimu (po 30. září) → menší podzimní infekce
- **Snížená hustota porostu** (350 klasů/m² místo 500) → lepší aerace
- **Snížené N hnojení** + split aplikace (rozdělit dávku 2-3× během sezóny)
- **Předplodina jiná než pšenice** — řepka, luskovina, kukuřice
- **Orba** zaorá inokulum (vs no-till)

**Klimatická změna:**
- Teplejší zimy = více přezimovaného inokula
- Vlhčí jaro = víc cyklů
- **Posun areálu** — septorióza posuvuje na sever Evropy (SE, DK, UK posílení 2020s)

**V ČR výzkum**: VURV, Mendelu — selekce rezistentních linií, sledování fungicidní citlivosti.

Viz též [[fuzarioza]], [[rzi]], [[fungicidy]], [[ozim-jarin]], [[osevni-postup]], [[no-till]].`,
    related: ['fuzarioza', 'rzi', 'fungicidy', 'ozim-jarin', 'osevni-postup'],
  },
  {
    slug: 'rzi',
    term: 'Rzi obilí',
    alias: ['Puccinia', 'rust', 'rez pšeničná', 'rez ječmenná', 'rzi'],
    kategorie: 'ochrana',
    shortDef: 'Rzi jsou skupina houbových chorob obilí způsobená rody Puccinia. Tři klíčové: rez plevová (P. striiformis), rez listová (P. recondita), rez stéblová (P. graminis). Historicky devastující choroby, dnes zvládané fungicidy a rezistencí.',
    longDef: `Rzi obilí (anglicky *rusts*) jsou skupina **biotrofních houbových chorob** způsobená rody **Puccinia**. Tři klíčové druhy pro CZ pšenici a ječmen:

1. **Rez plevová (žlutá)** — *Puccinia striiformis* (PST) — agresivní, chladný/vlhký
2. **Rez listová (hnědá)** — *Puccinia recondita / triticina* (PT) — teplo/sucho
3. **Rez stéblová (černá)** — *Puccinia graminis* (PG) — historicky katastrofická, dnes vzácná v EU

**Historický význam:**
- **Římská říše** — *Robigalia* svátek (25. dubna) zaměřený proti rzi
- **1880s** — masivní epidemie v US a EU
- **1916, 1953** — celosvětové epidemie rze stéblové → impulsy pro Bordeauxskou jíchu a moderní fungicidy
- **1999+** — UG99 (Ug99) — vysoce agresivní kmen rze stéblové z Ugandy, šíří se Afrika → Asie. Hrozba pro globální pšeničnou produkci.
- **2010+** — PST Warrior (žlutá rez) — agresivní rasy v EU, prolomení odolnosti většiny pšeničných odrůd

**Symptomy:**

**Rez plevová (žlutá, *yellow rust*):**
- **Drobné žluto-oranžové puchýřky** v dlouhých proužcích podél žilek listů
- Optimální: 8–18 °C, vlhko, rosa
- **Časná v sezóně** (březen–červen v CZ)
- **Riziko**: napadá ozim už během zimy (přezimuje na listech)

**Rez listová (hnědá, *brown/leaf rust*):**
- **Hnědo-oranžové puchýřky** jednotlivě nebo v shlucích, kruhové
- Optimální: 15–25 °C
- **Pozdně v sezóně** (květen–srpen)
- **Riziko**: poškozuje vlajkový list během plnění zrna

**Rez stéblová (černá, *stem rust*):**
- **Tmavě hnědé až černé** puchýřky NA STÉBLECH (ne listech)
- Velké léze, často 1×3 cm
- **Pozdně** (konec června–červenec)
- **Riziko**: poškozuje stéblo → polehnutí porostu, výrazné snížení výnosu (-30–80 %)

**Životní cyklus (komplexní — alternující hostitel):**
- **Hlavní hostitel**: pšenice / ječmen / žito (uredinia → telia stage)
- **Vedlejší hostitel** (sexuální reprodukce): různý podle druhu
  - PST žlutá: dříve se myslelo žádný, dnes víme *Berberis spp.* (dříšťál)
  - PT listová: *Thalictrum spp.* (řešetlák — vzácně)
  - PG stéblová: *Berberis vulgaris* (dříšťál obecný) — **historicky kácen** v USA pro eradikaci rze!
- **EU/CZ**: *Berberis vulgaris* dnes není rozšířen → eradikace 1900s pomohla.

**Boj — fungicidy:**

**Stejná schémata jako septorióza** (často kombinované postřiky):
- **Triazoly** — tebuconazol, propiconazol, prothiokonazol — efektivní
- **Strobiluriny** — pyraclostrobin, azoxystrobin — vysoce účinné, **rezistence v některých rasách**
- **SDHI** — moderní, kombinace s triazolem
- **Inatreq active** — nová třída 2021+
- **Aplikace timing**: stejné jako STB (T1 + T2 nejcennější)

**Náklady**: zahrnuty v sezónním postřiku 2 000–4 000 Kč/ha (kombinované s STB postřikem)

**Boj — rezistentní odrůdy:**
- **Major rezistenční geny** (Lr, Sr, Yr genes) — specifické, ale snadno prolomené
- **Slow-rusting**, kvantitativní rezistence — trvanlivější
- **CIMMYT, ICARDA** — globální šlechtění
- **CZ moderní odrůdy** mají kombinaci 3-5 rezistenčních genů (Bohemia, Sailor, Vlasta)

**Rezistence patogenů:**
- **PST Warrior** prolomilo Yr17 v 2011 → většina EU odrůd citlivá
- **Ug99 black rust** prolomilo Sr31, Sr24, Sr36 — agresivní v Africe
- **Konstantní souboj** šlechtění vs evoluce patogena

**Mezinárodní spolupráce:**
- **WIN** (Wheat Initiative Network) — globální sledování rasných typů
- **Borlaug Global Rust Initiative (BGRI)** — koordinace boje proti Ug99
- **EAS-Eppo** — EU monitoring

**Klimatická změna:**
- Teplejší zimy → vyšší přezimování patogena
- Pozdější chlad na jaře → rzi začínají později ale silněji
- **Pšenice v severních krajích** (UK, IE, S-Skandinávie) nyní pravidelně napadané (dříve řidčeji)

**V ČR výzkum**: VURV Praha (rasi PST, PT), Mendelu Brno (rezistence šlechtění).

Viz též [[fuzarioza]], [[septorioza]], [[fungicidy]], [[ozim-jarin]].`,
    related: ['fuzarioza', 'septorioza', 'fungicidy', 'ozim-jarin'],
  },
  {
    slug: 'mandelinka-bramborova',
    term: 'Mandelinka bramborová',
    alias: ['Colorado potato beetle', 'Leptinotarsa decemlineata', 'mandelinka'],
    kategorie: 'ochrana',
    shortDef: 'Mandelinka bramborová (Leptinotarsa decemlineata) je invazní brouk z USA, hlavní škůdce brambor v Evropě. Dospělec i larva žerou listy, bez ochrany 100 % defoliace = 80 % ztráta výnosu. V ČR od 1922.',
    longDef: `Mandelinka bramborová (lat. *Leptinotarsa decemlineata*, ang. *Colorado potato beetle*, CPB) je **invazní brouk** z čeledi *Chrysomelidae*. Původem z **Colorada (USA)**, dnes hlavní škůdce brambor v Evropě, Asii i v původní Severní Americe.

**Historie invaze:**
- **1859** — první masová epidemie v Colorado (USA). Předtím žila na divokých *Solanum* spp.
- **1875** — invaze do New Yorku, dále do EU
- **1922** — první výskyt v CZ (Bordeaux pak Praha)
- **1947** — masová invaze do CZ, kampaň proti „americkému brouku"
- **1950s** — DDT poprvé použit, krátký triumf, pak rezistence
- **Dnes** — etablovaná po celé Evropě, Severní Asii (Sibiř), Japonsku, Číně

**Morfologie:**
- **Dospělec**: 10 mm, **žlutý** s **10 černými proužky** na krovkách. Charakteristický vzhled.
- **Vajíčko**: 1,5 mm, **oranžovo-žluté**, kladené v shlucích 20–60 ks **na spodní stranu** listů
- **Larva**: 8–15 mm, **červeno-oranžová** s černou hlavou a černými tečkami po stranách. 4 instar stadia.
- **Kukla**: v půdě 3–5 cm hlubina

**Životní cyklus:**
1. **Přezimování**: dospělci v půdě 10–20 cm hluboko (nezamrznou)
2. **Vylezení**: jaro při teplotách >15 °C (v CZ konec dubna–polovina května)
3. **Páření a kladení**: dospělci najdou bramborové porosty, kladou 200–400 vajíček/samice
4. **Larvy** (3–4 týdny): konzumují listy. **Stádium L4 = největší žravost** (60 % celkového poškození).
5. **Kuklení**: v půdě, 1–2 týdny
6. **Druhá generace** dospělců: konec července–srpen
7. **V CZ klimatu**: 1–2 generace ročně (2. generace jen v teplých letech)

**Symptomy poškození:**
- **Listy ohryzané**, často jen řapíky a žilky zůstanou
- **Defoliace** může být 100 % během 7–14 dní bez ochrany
- **Plné defoliace ve vegetaci**: -50 až -100 % výnosu
- **Hlízy zůstávají nepoškozené** (mandelinka je listový škůdce)

**Boj — chemický:**

**Insekticidy:**
- **Neonikotinoidy**: thiamethoxam, imidacloprid, clothianidin — **ZAKÁZÁNY v EU od 2018** kvůli toxicitě pro včely
- **Spinosad** (Laser) — biopreparát z *Saccharopolyspora spinosa*, EU povolený, drahý
- **Spinetoram** (Delegate) — vyšší účinnost než spinosad
- **Chlorantraniliprole** (Coragen) — moderní, na L1-L3 larvy účinný
- **Cyantraniliprole** (Verimark) — kořenová aplikace při výsadbě
- **Pyrethroidy**: lambda-cyhalothrin (Karate) — levné ale rezistence
- **Indoxakarb** (Steward) — alternative, stárnoucí

**Aplikace timing:**
- **Klíčový moment**: L1–L3 larvy (mladé, lehce kontrolovatelné)
- **Pozdě (L4)**: účinnost klesá, larva už 50 % defoliace způsobila
- **Sledovat porost** každých 3–5 dní v rizikovém období
- **Threshold**: 30 larev/100 rostlin = postřik

**Boj — biologický:**

**Predátoři a parazitoidi:**
- **Slunéčka** (*Coccinellidae*) — žerou vajíčka i mladé larvy
- **Zlatoočka** (*Chrysoperla*) — žerou vajíčka
- **Ploštice** (*Podisus, Perillus*) — americké, méně účinné v EU
- **Cizopasné mušky** (*Doryphorophaga*) — vzácné v EU
- **Není dostatečně efektivní** pro velké pole, jen v zahradě/biofarmě

**Bacillus thuringiensis tenebrionis (BTT):**
- Bakterie produkující toxiny **specifické pro brouky**
- Komerčně: Novodor, Trichodor
- **Účinný jen na L1-L2 larvy**, vyšší instary tolerantní
- **Bio-přístup**, vhodný pro zahrady a biofarmu

**Boj — kulturní:**
- **Pravidelné střídání plodin** — alespoň 2 roky mezi bramborami na stejném poli
- **Odběry rukou** v zahradě (pracné ale 100% efektivní pro malé plochy)
- **Síťové barriéry** — mladý porost se zakryje sítí (drahé, jen pro vzácné odrůdy)
- **Pluhování v podzim** — vyžene některé dospělce z přezimování

**Rezistentní odrůdy:**
- **Solanum chacoense** — divoký brambor, geneticky zdroj rezistence
- **Sárka, Sárpo Mira** — částečná tolerance
- **Genetické modifikované brambory** (BT-potatoes) — vyřazeno z EU regulační scény 1990s, NABLAH a další

**Rezistence patogena na pesticidy:**
- Mandelinka je **šampión rezistence mezi škůdci**
- DDT (1950s), pyrethroidy (1980s), neonikotinoidy (2010s) — postupně prolomené
- **Resistance management**: rotovat 2–3 různé třídy insekticidů per sezónu

**Ekonomika:**
- **Postřik**: 800–1 500 Kč/ha (1 aplikace)
- **Sezónně**: 2–4 postřiky × 1 200 = **2 400–4 800 Kč/ha**
- **Návratnost**: 5–10× (bez postřiku 80 % ztráta = 80 000+ Kč/ha)

**Klimatická změna:**
- Teplejší zimy = lepší přezimování
- Delší vegetační doba = 2 generace pravidelně (dřív vzácně)
- **Posun severního areálu** do Skandinávie

V kultuře: **„Americký brouk"** byl propagandistický symbol v 1950s (Studená válka — Sovět tvrdili že USA shazují mandelinky z letadel na CSR a NDR pro sabotáž zemědělství).

Viz též [[zemak]], [[plisen-bramborova]], [[insekticidy]].`,
    related: ['zemak', 'plisen-bramborova', 'insekticidy'],
  },
  {
    slug: 'msice-repna',
    term: 'Mšice řepná',
    alias: ['Aphis fabae', 'black bean aphid', 'mšice černá'],
    kategorie: 'ochrana',
    shortDef: 'Mšice řepná (Aphis fabae) je drobný hmyz sající šťávy řepy, fazolu, máku, hlívy. Sama o sobě nepříliš škodlivá, ale přenáší virus žluté mozaiky řepy (BYV) — virus snižuje cukernatost cukrovky o 20–40 %.',
    longDef: `Mšice řepná (lat. *Aphis fabae*, ang. *black bean aphid*) je **černá / tmavě hnědá mšice** sající šťávy hostitelských rostlin. Sama o sobě středně škodlivá, ale **klíčový vektor virů** v cukrovce, fazolu, máku.

**Vzhled:**
- **Dospělec** 2 mm, **černý / tmavě hnědý**, často s voskovým povlakem
- **Bezkřídlá forma** (vivipara) — letní rozmnožování
- **Okřídlená forma** (alata) — disperzní generace, šíření na nové porosty
- **Líhně** (nymfy) — světle zelené, později tmavé

**Hostitelé:**

**Primární** (zima):
- **Brslen evropský** (Euonymus europaeus) — hlavní zimní hostitel v EU
- **Kalina** (Viburnum)
- **Lopuch** (méně častý)

**Sekundární** (léto):
- **Cukrovka, krmná řepa**
- **Fazol obecný** (Phaseolus vulgaris)
- **Mák** (Papaver)
- **Lebeda** (Atriplex)
- **Pampeliška, jiné Compositae**

**Životní cyklus:**
1. **Zima**: vajíčka kladená na brslen, kalinu
2. **Jaro**: bezkřídlé samice se rojí na brslenu
3. **Okřídlené dispersers**: letí na řepu, fazol (květen–červen)
4. **Vrchol populace**: konec června–červenec, na řepě a fazolu
5. **Návrat na brslen**: konec léta–podzim, kladení vajíček
6. **V CZ**: 10–15 generací letní cyklus

**Symptomy přímého poškození:**
- **Listy stočené, zkroucené**
- **Kolonie mšic** na rubu listů (často 100+ jedinců na list)
- **Medovice** (sweet excret) — lepkavé povlaky → růst saze
- **Snížený růst** rostliny

**Klíčový problém — viry:**

**BYV (Beet Yellows Virus, virus žloutenky řepy):**
- Mšice naskočí na nemocnou rostlinu → cucá viry → letí na zdravou → infikuje
- **Symptomy**: žluté listy řepy, redukce fotosyntézy
- **Ztráta cukernatosti**: -20 až -40 % (cukrovka)
- **Šíření**: 1 jediná infikovaná mšice může nakazit desítky rostlin

**BMYV (Beet Mild Yellowing Virus):**
- Méně agresivní než BYV ale rozšířená

**BWYV (Beet Western Yellows Virus):**
- I řepka, brukvovité

**Boj — chemický:**

**Insekticidy:**
- **Neonikotinoidy** (thiamethoxam, imidacloprid) — **ZAKÁZÁNY v EU pro venkovní použití od 2018** kvůli včelám. Dříve standardní mořidlo cukrovky.
- **Acetamiprid** (Mospilan) — neonikotinoid stále povolený v EU (jiná chemická struktura)
- **Flonicamid** (Teppeki) — anti-feedant, **moderní standard 2020s** pro cukrovku
- **Spirotetramat** (Movento) — systemický, působí i v rubu listů
- **Pirimicarb** (Aphox) — selektivní mšicid, šetrný k benefitům (ladybugs)
- **Pyrethroidy** (cypermethrin, deltamethrin) — krátká účinnost, rezistence rychlá

**Aplikace timing:**
- **První postřik**: při zjištění 10 mšic/rostlinu nebo 5 % rostlin s mšicemi
- **Opakování**: za 7–14 dní (záleží na látce)
- **Sezónní celkem**: 2–4 postřiky v cukrovce

**Náklady**: 600–1 200 Kč/ha za postřik × 3 = 1 800–3 600 Kč/ha sezónně

**Boj — biologický:**
- **Slunéčka** (Coccinellidae) — efektivní, 1 slunéčko sežere 50 mšic/den
- **Zlatoočky** (Chrysoperla)
- **Mšicovníci** (Aphidius spp., Praon spp.) — parazitické vosičky, kladou vejce do mšice
- **Květinové pásy** kolem polí zvyšují populaci predátorů
- **Houby** (Beauveria, Metarhizium) — entomopatogenní, méně účinné v poli

**Boj — kulturní:**
- **Odstranění brslenu** (zimní hostitel) v okolí cukrovkových polí — preventivně
- **Časné setí** cukrovky → porost má víc vegetace před vrcholem mšic
- **Rezistentní odrůdy** cukrovky — částečná tolerance k BYV (donor *Beta maritima*)

**Bio přístup:**
- **Mýdlový roztok** (drasly mýdla) — fyzikální poškození mšic
- **Neem olej** (azadirachtin) — naturalní pesticid, omezený efekt
- **Pyrethrum** (z chrysantém) — krátká účinnost, EU povolené

**Klimatická změna:**
- **Teplé zimy** → mšice přezimují i jako dospělci (ne jen jako vajíčka), víc generací
- **Sušší jara** → menší populace (mšice preferuje vlhko)
- **Posun areálu** na sever

**V ČR výzkum**: Cukrovarnický výzkumný ústav Praha, ÚKZÚZ — monitoring viru BYV, pruhování polí pro modelaci rizika.

Viz též [[insekticidy]], [[mandelinka-bramborova]], [[osevni-postup]].`,
    related: ['insekticidy', 'mandelinka-bramborova'],
  },
  {
    slug: 'zavijec-kukuricny',
    term: 'Zavíječ kukuřičný',
    alias: ['Ostrinia nubilalis', 'European Corn Borer', 'ECB', 'kukuřičná zavíječka'],
    kategorie: 'ochrana',
    shortDef: 'Zavíječ kukuřičný (Ostrinia nubilalis) je motýl, jehož housenky se vrtají do stébel a klásků kukuřice. Bez ochrany ztráta 5–25 % výnosu + vstup hub Fusarium = mykotoxiny. V CZ rozšířený zejm. na jižní Moravě a Polabí.',
    longDef: `Zavíječ kukuřičný (lat. *Ostrinia nubilalis*, ang. *European Corn Borer*, ECB) je **motýl** z čeledi *Crambidae*. Jeho **housenky se vrtají do stébel, klásků a palic kukuřice**, způsobujíce přímé ztráty + sekundární infekci houbami *Fusarium* (mykotoxiny — viz [[fuzarioza]]).

**Vzhled:**
- **Dospělec**: motýl, rozpětí 25–30 mm, **bledě žlutá křídla** s vlnitými hnědými proužky. Samec tmavší než samice.
- **Vajíčko**: 1 mm, **ploché šupinky** v shlucích 15–30 ks na spodní straně listů
- **Housenka**: 25 mm, **šedo-růžová s tmavou hlavou**, 5 instar stadií
- **Kukla**: v stéble kukuřice, hnědá

**Životní cyklus v CZ:**

**Severní areál (Krkonoše, Vysočina)** — **1 generace ročně**:
- Květen–červen: motýli létají
- Červen–červenec: housenky v rostlinách
- Srpen: kuklení
- Září–říjen: motýli druhé krátké generace (často neútočí)
- Listopad–březen: housenky přezimují ve zbytcích rostlin (slámě, kukuřičné stočisti)

**Jižní areál (Slovácko, Polabí)** — **2 generace ročně**:
- 1. generace: květen–červenec
- 2. generace: srpen–říjen
- Druhá generace způsobuje **vážnější ztráty** (větší rostlina, větší housenky)

**Symptomy poškození:**

**Stéblo:**
- **Otvory** (díry, hloubka 5–20 mm) — vstupní bod housenky
- **Sklouznutí stébla** během silného větru/deště (broken stalks)
- **Otěry žluté pilinky** kolem vstupního otvoru (excrementy housenky)

**List:**
- **Otvory v listech** (housenka mladá někdy ohryzává listy než vleze do stébla)
- **Brokátový vzhled** (pinhole damage)

**Palice (sklizeň):**
- **Housenky ve palici** — žerou zrna
- **Otvory na klasu** — vstup pro *Fusarium*, *Aspergillus* — **mykotoxiny**
- **Snížený výnos**: 5–25 % primární, +10–30 % sekundární kvůli houbám

**Boj — chemický:**

**Insekticidy** (aplikace v larvální stadium, ne dospělce):
- **Spinosad** (Laser) — bio, fungovaly na L1-L2
- **Spinetoram** (Delegate) — silnější verze
- **Chlorantraniliprole** (Coragen) — moderní standard, vysoká účinnost
- **Cyantraniliprole** (Verimark) — alternativní
- **Indoxakarb** (Steward) — stárnoucí
- **Pyrethroidy** (lambda-cyhalothrin) — krátká účinnost

**Aplikace timing — KRITICKÉ:**
- **Před vstupem do stébla**: housenka L1-L3 ještě na listech → cíl postřiku
- **Po vstupu do stébla**: insekticid nemá přístup, **postřik selhává**
- **Timing**: 7–10 dní po vrcholu letu motýlů (feromonové lapače)
- **Monitorování**: feromonové lapače v polích, sledování pravidelně

**Ošetření je drahé a nejisté** pro siláž — náklady 1 000–2 000 Kč/ha + obtížné timing. Mnoho farem **vynechává**.

**Boj — biologický:**

**Trichogramma spp.** (parazitická vosička):
- **Klade vajíčka do vajíček ECB** → 50–80 % parazitace
- **Aplikace**: lepící karty s vosičkami zavěšené v poli (5 000 vosiček/ha)
- **Cena**: ~800–1 500 Kč/ha
- **Účinnost**: srovnatelná s insekticidem, **bio přístup**
- **Trh**: AgriCom, BBM, BioActiv

**Bacillus thuringiensis kurstaki (BTK):**
- Bakterie s toxinem **specifický pro motýly** (lepidopterans)
- Komerčně: Lepinox, Dipel, Foray
- **Spojené s biopaliva sezónou** (až do 10 dní účinnost)

**GMO kukuřice MON810 (BT-corn):**
- **Vlastní rezistence** — kukuřice produkuje *Bt* toxin
- **EU zákaz pěstování** (jen výjimky: Španělsko, Portugalsko)
- **V CZ není zaregistrovaná** k pěstování

**Boj — kulturní:**

**Klíčové preventivní opatření:**
- **Pluhování po sklizni** — zaorá kukuřičnou slámu se housenkami → snížení populace 50–80 %
- **Drcení / mulčování stočiště** — destruuje úkryt
- **Předplodina** (krátká sezóna) — méně tlaku
- **No-till + kukuřičná sláma na povrchu** = NEJHORŠÍ podmínky pro ECB

**Rezistence patogena:**
- ECB byl rezistentní na **MON810 Bt** v Brazílii a USA (2010s) — populace pole-evolved
- V EU bez plošného použití Bt zatím rezistence pomalá

**Klimatická změna:**
- 2. generace na sever — Slovácko v 2020s pravidelně, dříve jen výjimečně
- Teplejší podzimy → větší přežití housenek
- Posun areálu na sever Evropy

**Ekonomický dopad:**
- **Bez ochrany**: ztráta 5–25 % výnosu + 5–15 % cena za kontaminaci mykotoxiny
- **Sezónní ztráta na 100 ha kukuřice**: 50 000 – 250 000 Kč
- **Cost ochrany**: 1 000–2 500 Kč/ha
- **Návratnost**: 5–20× při silném tlaku

**V ČR**: hlavní problém pro **silážní kukuřici** (jižní Morava, Slovácko, Olomoucko). Zrnová kukuřice méně problém (sklizeň před vrcholem 2. generace).

Viz též [[fuzarioza]], [[insekticidy]], [[kukurice-silazni]], [[no-till]].`,
    related: ['fuzarioza', 'insekticidy', 'kukurice-silazni', 'no-till'],
  },
  {
    slug: 'fungicidy',
    term: 'Fungicidy',
    alias: ['fungicides', 'protihoubové přípravky', 'mykocidní postřiky'],
    kategorie: 'ochrana',
    shortDef: 'Fungicidy jsou chemické přípravky proti houbovým chorobám rostlin. Klíčové třídy: triazoly (DMI), strobiluriny (QoI), SDHI, kontaktní (mancozeb, měď). Cena v ČR 2024: 500–2 500 Kč/ha za jednu aplikaci.',
    longDef: `Fungicidy (z latinského *fungus* + *caedere* = houba + zabíjet) jsou **chemické přípravky určené pro ochranu rostlin před houbovými chorobami**. V EU regulovány nařízením EC 1107/2009. V CZ schvaluje **ÚKZÚZ** (Ústřední kontrolní a zkušební ústav zemědělský).

**Hlavní třídy fungicidů:**

**1. Triazoly (DMI — DeMethylation Inhibitors):**
- **Mechanismus**: blokují biosyntézu ergosterolu (membrána houbové buňky)
- **Hlavní zástupci**: tebuconazol, propiconazol, prothiokonazol (Proline), metconazol, epoxiconazol (vyřazený 2020s)
- **Spektrum**: široké — septorióza, rzi, fuzarióza, padlí
- **Účinnost**: středně-vysoká, **systemicky** (proniká listem)
- **Rezistence**: po 30 letech používání **slábnou na septoriózu**, ale stále základ
- **Cena**: 400–800 Kč/ha
- **Pozn.**: tebuconazol u řepky chrání před fómou (*Leptosphaeria maculans*)

**2. Strobiluriny (QoI — Quinone outside Inhibitors):**
- **Mechanismus**: inhibují mitochondriální dýchání (cyt b)
- **Hlavní zástupci**: azoxystrobin (Amistar), pyraclostrobin (Comet), trifloxystrobin (Flint), kresoxim-methyl
- **Spektrum**: padlí, rzi, **NIKOLIV septorióza** (rezistence prolomena 2003)
- **Účinnost**: vysoká pro padlí a rzi
- **Speciální efekty**: **„green effect"** — prodlouží zelenou fázi listu o 7–10 dní → +5 % výnos
- **Rezistence**: silná pro septoriózu, šíří se v dalších patogenech
- **Cena**: 500–1 200 Kč/ha

**3. SDHI (Succinate Dehydrogenase Inhibitors):**
- **Mechanismus**: blokují komplex II mitochondriální dýchání
- **Hlavní zástupci**: fluxapyroxad (Imtrex), bixafen (Aviator), benzovindiflupyr (Solatenol), pydiflumetofen (Adepidyn)
- **Spektrum**: septorióza, fuzarióza, padlí, rzi
- **Účinnost**: TOP 2020s — silnější než triazoly
- **Rezistence**: zatím mírná
- **Cena**: 800–1 500 Kč/ha
- **Typická aplikace**: SDHI + triazol mix = stříbrný standard pro pšenici

**4. Inatreq active (fenpicoxamid) — nová třída:**
- **Mechanismus**: NOVÝ MOA (Quinone Inside Inhibitor, QiI)
- **Účinnost**: vysoká na septoriózu, žádná dosavadní rezistence
- **Cena**: 1 200–1 800 Kč/ha
- **Trh**: Univoq (Corteva), 2021+

**5. Mefentrifluconazole (Revysol) — nová DMI:**
- **Mechanismus**: pokročilý DMI, aktivní i proti rezistentním kmenům
- **Cena**: 1 000–1 500 Kč/ha
- **Trh**: Revysol, Revystar (BASF), 2020+

**6. Kontaktní fungicidy (multisite):**

- **Mancozeb** (Dithane M-45, Penncozeb)
  - **Mechanismus**: multi-site (nelze vytvořit rezistence)
  - **EU**: zákaz **2024** (potenciálně karcinogenní podle ECHA classification)
  - **Cena**: 200–500 Kč/ha (levný)

- **Měď** (CuSO₄, Cu hydroxid, oxychlorid)
  - **Bio i konvenční**: povolená v EU bio
  - **Limit**: 4 kg Cu/ha/rok od 2019
  - **Použití**: plíseň bramborová, plíseň vinné révy, peronospora
  - **Cena**: 300–600 Kč/ha

- **Síra (S)**
  - **Bio přístup**: padlí, roztoči
  - **Cena**: 200–400 Kč/ha

- **Folpet**
  - **Multisite alternative k mancozebu**
  - **Cena**: 400–800 Kč/ha

**7. Anilinopyrimidiny (AP):**
- **Mechanismus**: methionin biosyntéza
- **Zástupci**: pyrimethanil, cyprodinil
- **Spektrum**: padlí, monilióza

**8. Cymoxanil:**
- **Krátká účinnost** (3–4 dny)
- **Vždy v kombinaci** s mancozebem nebo metalaxylem
- **Použití**: plíseň bramborová (kurativní efekt)

**9. Metalaxyl-M (oomyceta-specific):**
- **Mechanismus**: RNA polymeráza I (specifické pro oomycety)
- **Použití**: plíseň bramborová, plíseň révy
- **Rezistence**: vysoká (od 1980s)

**Aplikační technika:**

**Postřikovač** (sprayer):
- **Nesený** (na traktoru, 600–1 200 l zásobník) — malé farmy
- **Tažený** (1 500–4 500 l) — střední
- **Samojízdný** (Berthoud, Amazone Pantera) — velké farmy
- **Pracovní záběr**: 18–36 m

**Tryska a tlak:**
- **Plochový pohyb**: 200–400 l vody/ha, tlak 2–4 bary
- **Jemné rozprášení**: lepší pokrytí ale větší drift (snos do okolí)
- **Hrubé rozprášení**: méně driftu, ale horší pokrytí

**Kombinace s adjuvantem (povrchové činidlo):**
- **Olej** (Mero, Adigor) — zvyšuje retention na listu
- **Smáčedlo** (Trend, Silwet) — snižuje povrchové napětí, lepší pokrytí
- **Penetrant**: rychlejší vstup do listu

**Rezistence — anti-resistance strategie:**
1. **MIX různých MOA** (mechanism of action) v každém postřiku
2. **Maximum 1× sezónu** stejnou MOA
3. **Rotace** — různé MOA mezi postřiky
4. **Spojení s rezistentními odrůdami**
5. **Spojení s agrotechnikou** (zaorávání, hustota porostu)

**Sezónní kalendář — pšenice (typický 2024):**
- **T0** (BBCH 30): protiseptoriózový — triazol, 500 Kč/ha
- **T1** (BBCH 32): septoria + rzi — SDHI + triazol, 1 200 Kč/ha
- **T2** (BBCH 39): flag leaf — SDHI + triazol, 1 500 Kč/ha (NEJCENNĚJŠÍ)
- **T3** (BBCH 63): fuzarióza — triazol, 1 000 Kč/ha
- **Sezónně**: 3 500–4 500 Kč/ha

**Návratnost:**
- **Bez fungicidů**: -30 až -50 % výnos
- **Postřik T2 alone**: -10 až -20 % vs full program
- **Plný program**: max výnos
- **Návratnost full program**: 4–6× v rizikovém roce

**EU regulace:**
- **REACH** — autorizace účinných látek
- **MRL** (Maximum Residue Limits) — limity zbytků v jídle
- **Buffer zones** — povinné nepostřikovat 5–20 m od vodních toků
- **PPE** — povinné OOP (rukavice, respirátor) při aplikaci
- **Zákazy**:
  - **Neonikotinoidy** (venkovní) 2018
  - **Chlorothalonil** 2019
  - **Glyfosát** (Roundup) — periodicky obnovované, riziko zákazu
  - **Mancozeb** 2024

Viz též [[plisen-bramborova]], [[fuzarioza]], [[septorioza]], [[rzi]], [[insekticidy]], [[herbicidy]].`,
    related: ['plisen-bramborova', 'fuzarioza', 'septorioza', 'rzi', 'insekticidy', 'herbicidy'],
  },
  {
    slug: 'herbicidy',
    term: 'Herbicidy',
    alias: ['herbicides', 'protirostlinné přípravky', 'protiplevelné postřiky'],
    kategorie: 'ochrana',
    shortDef: 'Herbicidy jsou přípravky proti plevelům. Glyfosát (Roundup) je nejpoužívanější. Selektivní herbicidy hubí jen určité druhy plevelů, totální zabijí vše. Globální trh 30+ mld USD/rok, klíčový pro moderní zemědělství.',
    longDef: `Herbicidy (z lat. *herba* = bylina + *caedere* = zabíjet) jsou **přípravky proti plevelům**. Klíčový pesticidní segment — bez herbicidů by současné výnosy klesly o 30–50 % a manuální plení by bylo ekonomicky nemožné na velkých plochách.

**Dělení podle selektivity:**

**Totální (neselektivní)** — zabijí všechny rostliny:
- **Glyfosát** (Roundup) — viz [[roundup]]
- **Glufosinát** (Basta) — alternative
- **Diquat** (Reglone) — desikant
- **Paraquat** — **zakázáno v EU od 2007**

**Selektivní** — hubí jen určité druhy:

**Dvouděložné (širokolisté plevele) v obilí:**
- **MCPA, 2,4-D** (Glean, Banvel) — stará třída, levná
- **Sulfonylmocoviny** (Granstar, Hussar) — moderní, dávky 10–30 g/ha
- **Triazinony** (metribuzin) — brambory

**Jednoděložné (trávy) v širokolistých plodinách:**
- **Quizalofop-p-ethyl** (Targa, Leopard) — řepka, sója
- **Fluazifop-p-butyl** (Fusilade) — alternativa
- **Clethodim** (Centurion) — sója

**Pro-emergence (před vzejitím):**
- **Pendimethalin** (Stomp, Activus) — kořenový herbicid
- **S-metolachlor** (Dual Gold) — kukuřice
- **Metribuzin** — brambory
- **Aplikace**: před vzejitím plevelů, 2-7 dnů po setí

**Post-emergence (po vzejitím):**
- **Mesotrione** (Callisto) — kukuřice, šetrná
- **Foramsulfuron** (Maister) — kukuřice
- **Mesosulfuron + iodosulfuron** (Atlantis) — graminicid v pšenici

**Mechanismus účinku (MOA — HRAC groups):**

**1. EPSPS inhibitory** (Group 9): glyfosát
**2. AHAS inhibitory** (Group 2): sulfonylmocoviny, imidazolinony — nejvíc rezistencí
**3. ACCase inhibitory** (Group 1): graminicidy (Fusilade, Targa) — vysoká rezistence
**4. PSII inhibitory** (Group 5): triaziny (atrazin — zakázán 2007)
**5. PPO inhibitory** (Group 14): carfentrazone, sulfentrazone
**6. HPPD inhibitory** (Group 27): mesotrione, isoxaflutole — kukuřice
**7. Mitóza inhibitory** (Group 3): pendimethalin
**8. Cellulose syntéza** (Group 29): isoxaben

**Glyfosát (Roundup) — detail:**
Viz [[roundup]] pro plný profil.

- **Mechanismus**: blokuje EPSPS enzym (syntéza aromatických aminokyselin)
- **Spectrum**: totální (mimo Roundup Ready GMO plodin)
- **Aplikace**: před setím, **stoolování** (mezi řádky), desikace (zhruba 10 dní před sklizní)
- **Cena**: 250–500 Kč/ha (jeden z nejlevnějších herbicidů)
- **Globální trh**: 800 000 t/rok, 30 % všech herbicidů
- **EU regulace**: schválení obnoveno do 2033

**Klíčové plevele v CZ a jejich herbicidy:**

**V pšenici:**
- **Svízel přítula** (Galium aparine): Granstar, Hussar OD, Salsa
- **Heřmánek pravý** (Matricaria chamomilla): MCPA, sulfonylmocoviny
- **Chundelka metlice** (Apera spica-venti): Atlantis OD, Pacifica Plus
- **Lipnice** (Poa annua): Atlantis OD
- **Pýr plazivý** (Elymus repens): glyfosát před setím nebo na strniště

**V kukuřici:**
- **Merlík bílý** (Chenopodium album): Callisto, Maister Power
- **Lebeda** (Atriplex): Callisto, Stomp
- **Béry** (Setaria): Maister
- **Ohnice** (Sinapis arvensis): Casper

**V řepce:**
- **Heřmánek**: Galera (clopyralid + picloram)
- **Smetanka**: Galera
- **Pýr**: Fusilade Forte (jen v řepce)

**V cukrovce:**
- **Merlík, lebeda**: Goltix (metamitron) + Betanal (phenmedipham) + Pyramin
- **Bér, vlčí mák**: Betanal kombinace

**Rezistence k herbicidům:**

**Globální problém 2010s+**:
- **Amaranth palmerii** v USA — rezistence na glyfosát, sulfonylmocoviny, HPPD
- **Lolium spp.** v Austrálii — multi-resistance, „herbicide superweeds"
- **Chundelka metlice** v EU — rezistence k ACCase i AHAS inhibitorům

**Strategie anti-resistance:**
1. **Rotace MOA** — různé herbicidy v různých letech
2. **Mix MOA** — kombinace v jednom postřiku
3. **Mechanická kontrola** — orba, plečka v mezirádcích
4. **Cover crops** — krycí plodiny snižují plevele
5. **Manuální** — kontrola hnízd rezistence

**Bioherbicidy:**
- **Acetate** (Beloukha) — kyselina pelargonová, z přírodních zdrojů
- **Octová kyselina** (vinegar) — pro malé plochy
- **Termální** — propanové hořáky pro pásové herbicidy
- **Cena**: 5–20× dráž než glyfosát

**Aplikace technika:**
- **Postřikovač** (jako fungicidy) — 200–400 l vody/ha
- **Tryska**: většinou jemnější (jednoduchá injekce) než pro fungicidy
- **Mix s adjuvantem**: smáčedlo zlepší účinnost
- **Pozor na drift** — herbicid může poškodit sousední plodiny

**Náklady — pro typickou pšenici:**
- **Pre-emergence**: 600–1 200 Kč/ha
- **Post-emergence** (jaro): 800–1 500 Kč/ha
- **Desikace** (před sklizní): 300–500 Kč/ha (Roundup, Reglone)
- **Sezónně**: 1 700–3 200 Kč/ha

**Pro kukuřici:**
- **Pre-emergence**: 1 200–2 000 Kč/ha (Lumax — typický mix)
- **Post-emergence**: 1 000–1 800 Kč/ha (Callisto + atrazin alternativa)

**EU regulace:**
- **Neonikotinoidy a glyfosát**: kontroverzní, ale zatím povolené (s omezeními)
- **Chlorthal-dimethyl, atrazin, paraquat**: zákazy 2007+
- **MRL** — maximum residue limits v potravinách
- **Bufferzóny** — 5–10 m od vodních toků

Viz též [[roundup]], [[fungicidy]], [[insekticidy]], [[desikace]], [[ozim-jarin]].`,
    related: ['roundup', 'fungicidy', 'insekticidy', 'desikace', 'ozim-jarin'],
  },
  {
    slug: 'insekticidy',
    term: 'Insekticidy',
    alias: ['insecticides', 'protiherzí přípravky', 'protihmyzné postřiky'],
    kategorie: 'ochrana',
    shortDef: 'Insekticidy jsou přípravky proti škodlivému hmyzu. Klíčové třídy: pyrethroidy (lambda-cyhalothrin), neonikotinoidy (ZAKÁZANÉ v EU 2018 pro venkovní použití), modernější diamidy a spinosyny. Cena postřiku v ČR 600–2 000 Kč/ha.',
    longDef: `Insekticidy (z lat. *insectum* + *caedere* = hmyz + zabíjet) jsou **přípravky proti škodlivému hmyzu**. Klíčový segment ochrany rostlin — bez insekticidů by ztráty z mšic, mandelinky, zavíječů byly katastrofální.

**Hlavní třídy insekticidů (IRAC groups):**

**1. Pyrethroidy** (Group 3 — sodium channel modulators):
- **Mechanismus**: blokují sodíkové kanály v nervovém systému hmyzu
- **Hlavní zástupci**:
  - **Lambda-cyhalothrin** (Karate Zeon) — široké spektrum
  - **Deltamethrin** (Decis) — populární
  - **Cypermethrin** (Cyperkill) — levný
  - **Bifenthrin** — Lambda alternative
  - **Tau-fluvalinate** — selektivnější (vždy med-bee safer)
- **Spektrum**: široké — mšice, brouci, larvy motýlů, ploštice
- **Účinnost**: rychlá (knockdown), ale krátká (7-10 dní)
- **Rezistence**: rozsáhlá (od 1980s) — mšice, mandelinka, klopuška řepná
- **Toxicita**: vysoká pro včely (NEpostřikovat v rozkvětu!)
- **Cena**: 200–500 Kč/ha (levné)

**2. Neonikotinoidy** (Group 4 — nicotinic acetylcholine receptor):
- **Mechanismus**: agonisté acetylcholin receptorů (jako nikotin u člověka)
- **Hlavní zástupci**:
  - **Imidacloprid** (Confidor, Gaucho) — historicky #1
  - **Thiamethoxam** (Actara, Cruiser)
  - **Clothianidin** (Poncho) — zejm. v moři osiv kukuřice
  - **Acetamiprid** (Mospilan) — STÁLE povolený v EU
- **EU zákaz** — venkovní použití od 2018 pro thiamethoxam, clothianidin, imidacloprid. **Acetamiprid stále povolený**.
- **Důvod zákazu**: vysoká toxicita pro **včely a opylovače**
- **Cena**: 300–600 Kč/ha (acetamiprid)
- **Systémové působení**: pohybuje se v rostlině, dlouhodobá ochrana (2-4 týdny)

**3. Diamidy** (Group 28 — ryanodine receptor modulators):
- **Mechanismus**: stálé otvírání kalciových kanálů v svalech hmyzu → paralýza
- **Hlavní zástupci**:
  - **Chlorantraniliprole** (Coragen) — kukuřice, brambora
  - **Cyantraniliprole** (Verimark) — moření osiv, systemicky
  - **Flubendiamide** (Belt) — některé EU země omezené
- **Spektrum**: motýli (housenky), brouci (mandelinka), některé mušky
- **Bezpečnost**: ŠETRNÁ k včelám a benefitům
- **Cena**: 1 000–2 000 Kč/ha (drahá)
- **Rezistence**: zatím mírná
- **Trh**: rychle rostoucí 2010s+

**4. Spinosyny** (Group 5 — nicotinic acetylcholine receptor, jiný site):
- **Mechanismus**: agonisté acetylcholin receptorů (jiný binding site než neonikotinoidy)
- **Hlavní zástupci**:
  - **Spinosad** (Laser) — bio i konvenční, z bakterie *Saccharopolyspora spinosa*
  - **Spinetoram** (Delegate) — silnější verze
- **Spektrum**: motýli, mandelinka, vrtule
- **Bezpečnost**: nízká toxicita pro savce, **střední pro včely** (postřikovat večer)
- **Cena**: 800–1 500 Kč/ha

**5. Anti-feedants / Růstové regulátory:**

- **Flonicamid** (Teppeki) — anti-feedant pro mšice. Zastaví krmení během 1-2 h.
  - **Bezpečné** pro včely
  - **Cena**: 800–1 200 Kč/ha
  - **Použití**: cukrovka, brambora, ovoce

- **Pymetrozin** (Plenum) — mšice. EU zákaz 2019.

- **Buprofezin** (Applaud) — chitin syntéza inhibitor. Růstový regulátor pro nymfální stadia.

- **Indoxakarb** (Steward, Avaunt) — Group 22, sodium channel blocker. Motýli, mandelinka.
  - **Cena**: 800–1 500 Kč/ha

**6. Acaricidy (proti roztočům):**

- **Hexythiazox** (Nissorun) — roztočové vajíčka a nymfy
- **Pyridaben** (Sanmite) — adultní roztoči
- **Abamectin** (Vertimec) — širší spektrum
- **Spirodiclofen** (Envidor) — moderní
- **Bifenazate** (Floramite) — selektivní

**7. Bio insekticidy:**

- **Bacillus thuringiensis** (BT):
  - **BT kurstaki (BTK)** — Lepinox, Dipel — motýli (housenky)
  - **BT tenebrionis (BTT)** — Novodor — brouci (mandelinka L1-L2)
  - **BT israelensis (BTI)** — komáři, mušky v zahradách
  - **Bezpečné** pro savce, ptáky, ryby — jen pro hmyz cílový
  - **Krátká účinnost** (3-7 dní)
- **Spinosad** (viz výše) — bio i konvenční certifikace
- **Neem olej** (azadirachtin) — z indického neemu, **antifeedant + IGR**
- **Pyrethrum** — z květů chrysantém — krátká účinnost (1-3 dny)
- **Beauveria bassiana** — entomopatogenní houba

**Aplikační technika:**

**Postřikovač** (stejně jako fungicidy/herbicidy):
- 200–400 l vody/ha
- Jemnější tryska pro lepší pokrytí

**Moření osiv** (seed treatment):
- **Neonikotinoidy** (clothianidin, imidacloprid) — **EU zákaz od 2018** pro venkovní použití
- **Acetamiprid moření** — povolené, ale méně účinné
- **Cyantraniliprole moření** (Verimark) — moderní alternativa

**Granulát na řádky:**
- **Fipronil** — fluxax (proti drátovcům, larvám kořenožravců)
- **Tefluthrin** — Force — kukuřice

**Aplikace timing:**

**Mandelinka bramborová**:
- L1-L3 larvy (mladé) — postřik
- 30 larev/100 rostlin = threshold

**Zavíječ kukuřičný**:
- Po vrcholu letu motýlů (feromonové lapače)
- 7-10 dní po vrcholu → housenky L1-L3

**Mšice**:
- 10 mšic/rostlinu = threshold v cukrovce
- 50+ % rostlin s mšicemi = postřik v obilí

**Sací škůdci** (mšice, klopušky):
- Aplikuje SYSTEMICKÝ insekticid (acetamiprid, flonicamid)

**Žroucí škůdci** (brouci, housenky, larvy):
- Aplikuje kontaktní nebo žaludeční (pyrethroid, BTK)

**Bezpečnost pro včely a opylovače:**

**EU regulace** (od 2018):
- Většina neonikotinoidů ZAKÁZANÝCH venkovně
- Pyrethroidy: NEpostřikovat v rozkvětu plodin
- Diamidy, spinosyny: ŠETRNÉ
- Flonicamid: bezpečné

**Best practice:**
1. **Postřik večer** (po západu slunce) — včely doma v úlu
2. **NEpostřikovat kvetoucí porost** (pšenice ve kvetení, slunečnice, řepka)
3. **Informovat sousední včelaře** před postřikem (zákonná povinnost v některých zemích)
4. **Buffer zóny** od kvetoucích remízků
5. **Mix s herbicidem** pro snížení počtu postřiků

**Rezistence:**

**Šampióni rezistence:**
- **Mandelinka bramborová** — rezistentní k DDT, pyrethroidům, neonikotinoidům (in succession)
- **Slatinská diamantová housenka** (*Plutella xylostella*) — superresistant
- **Drosophila suzukii** (Spotted wing drosophila) — rychlá rezistence

**Strategie:**
1. **Rotace MOA** — nejméně 3 různé tříd insekticidů
2. **Mix MOA** v jednom postřiku
3. **Vyhnout se** jednomu produktu opakovaně
4. **Spojení s IPM** (Integrated Pest Management)

**IPM (Integrované řízení škůdců):**
- **Monitoring**: feromonové lapače, vizuální kontrola, model risku
- **Threshold**: postřik až po překročení ekonomického prahu
- **Biologie**: predátoři, parazitoidi, BT
- **Kulturní**: střídání, odolné odrůdy, zaorávání
- **Chemie**: jako poslední řešení, cíleně

**Náklady:**
- **Pyrethroid**: 200–500 Kč/ha
- **Acetamiprid**: 400–700 Kč/ha
- **Diamid**: 1 000–2 000 Kč/ha
- **BT bio**: 600–1 200 Kč/ha
- **Sezónně** (3–5 postřiků): 1 500–5 000 Kč/ha

Viz též [[mandelinka-bramborova]], [[msice-repna]], [[zavijec-kukuricny]], [[fungicidy]], [[herbicidy]].`,
    related: ['mandelinka-bramborova', 'msice-repna', 'zavijec-kukuricny', 'fungicidy', 'herbicidy'],
  },
  {
    slug: 'desikace',
    term: 'Desikace',
    alias: ['desiccation', 'předsklizňové sušení', 'preharvest desiccation'],
    kategorie: 'ochrana',
    shortDef: 'Desikace je předsklizňové vysušení porostu (řepka, slunečnice, brambory, hrách) chemickou cestou. Sjednocuje dozrávání, snižuje vlhkost zrna a usnadňuje kombajnování. V CZ klíčové pro řepku a brambory.',
    longDef: `Desikace (z lat. *desiccare* = vysušit) je **chemické předsklizňové vysušení porostu**. Cílem je **sjednotit dozrávání, snížit vlhkost zrna a usnadnit kombajnování**. Klíčová operace pro **řepku, slunečnici, brambory, hrách, mák, len**.

**Účel desikace:**

1. **Sjednocení dozrávání**: porost zrne nerovnoměrně (různé fáze květu, terminál vs větvení). Desikace zastaví vegetaci, všechno zrno se „dorovná".
2. **Snížení vlhkosti zrna**: vlhké zrno (>15 %) nelze prodat na výkup bez sušení (drahé). Desikace srazí vlhkost o 5-15 %.
3. **Usnadnění kombajnování**: suchý porost prochází mlátičkou rychleji, méně ztrát.
4. **Sušení slámy / nati**: u brambor podpoří odumírání nati před sklizní (předchází přenosu plísně do hlíz).
5. **Likvidace plevelů**: vyrostlé plevele v porostu jsou desikovány společně s plodinou.

**Hlavní desikační přípravky:**

**1. Glyfosát (Roundup):**
- **Spectrum**: totální — všechny zelené rostliny
- **Použití**: řepka, slunečnice, hrách, obilí
- **Aplikace**: 10–14 dní před sklizní
- **Dávka**: 1,5–3 l/ha (záleží na koncentraci přípravku 360 g/l)
- **Cena**: 250–500 Kč/ha
- **Výhody**: levný, systémový (vstupuje do plevelů → likviduje i kořeny)
- **Pozn.**: EU obnoveno povolení do 2033, ale kontroverzní

**2. Diquat (Reglone):**
- **Mechanismus**: foto-radicalation in chloroplasts (rychlá oxidace)
- **Spectrum**: kontaktní totální desikant
- **Použití**: brambory (nať), řepka, hrách, slunečnice
- **Aplikace**: 7–10 dní před sklizní
- **Dávka**: 2–3 l/ha
- **Cena**: 500–900 Kč/ha
- **Výhody**: velmi rychlý (3-5 dní efekt), univerzální
- **EU stav**: **Diquat ZAKÁZANÝ v EU od 2019** (toxicita pro savce, ptáky, vodní organismy)
- **Alternativy**: glyfosát nebo glufosinát

**3. Glufosinát (Basta, Liberty):**
- **Mechanismus**: glutamine syntheteáza inhibitor
- **Spectrum**: totální, kontaktní
- **Použití**: řepka, slunečnice, obilí
- **Aplikace**: 5–8 dní před sklizní
- **Dávka**: 4–5 l/ha
- **Cena**: 700–1 200 Kč/ha (dražší než glyfosát)
- **EU stav**: **Glufosinát ZAKÁZANÝ v EU od 2018** kvůli reprodukční toxicitě
- Trh hledá alternativy (kyselina pelargonová, octová)

**4. Pyraflufen-ethyl (Spotlight):**
- **Mechanismus**: PPO inhibitor (kontaktní)
- **Použití**: brambory (nať), polní zelenina
- **Dávka**: 0,2–0,4 l/ha
- **Cena**: 1 000–1 500 Kč/ha
- **EU stav**: POVOLENÝ

**5. Karfentrazon-ethyl (Aurora):**
- **Mechanismus**: PPO inhibitor
- **Použití**: brambory, slunečnice
- **Dávka**: 0,1–0,2 l/ha
- **EU stav**: POVOLENÝ

**6. Mechanická desikace (alternativa po EU zákazech):**

- **Drcení nati brambor** — Spedo, Rumptstad — fyzické zničení listů
- **Tepelná desikace** — propanové hořáky (drahé, pomalu)
- **Vyhnívání přirozeně** — nechat porost dozrávat (delší sklizňové okno, vyšší riziko počasí)

**Desikace specifických plodin:**

**Řepka ozimá:**
- **Načasování**: BBCH 87–89 (85+ % šešulí dospělých, 80 % zrna hnědé)
- **Důvod**: bez desikace **8–15 % ztráta** vinou pukání šešulí
- **Přípravek**: glyfosát 2 l/ha, alternativa karfentrazon
- **Načas**: 10–14 dní před sklizní
- **Cena 2024**: 350–500 Kč/ha

**Slunečnice:**
- **Načasování**: BBCH 87–89 (zrno hnědé, obálka úzce dělá kulovitou)
- **Důvod**: spolu s ozimovou řepkou nejlepší ROI
- **Přípravek**: glyfosát 2,5 l/ha
- **Cena**: 400–600 Kč/ha

**Brambory:**
- **Načasování**: 14–21 dní před sklizní hlíz
- **Důvod**: silně nať = energický kombajn, nemůže projít. Také prevence plíseňového přenosu (P. infestans) do hlíz.
- **Přípravek (post-Reglone éra)**: pyraflufen-ethyl, mechanické drcení, karfentrazon
- **Cena**: 1 200–1 800 Kč/ha (vyšší než pre-Reglone éra)

**Hrách jarní:**
- **Načasování**: BBCH 89 (lusky hnědé)
- **Důvod**: hrách nedozrává najednou, **nutné sjednotit**
- **Přípravek**: glyfosát 2 l/ha
- **Cena**: 400–600 Kč/ha

**Pšenice:**
- **Načasování**: BBCH 87–89 (zrno tvrdé, mléčný stav minul)
- **Důvod**: jen u **velmi vlhkých let** (nutnost rychlé sklizně před deštěm)
- **Přípravek**: glyfosát 2 l/ha
- **Cena**: 350–500 Kč/ha
- **Pozn.**: u potravinářské pšenice **omezené použití** kvůli reziduím glyfosátu (MRL)

**Kontroverze glyfosátu při desikaci obilí:**
- USA EPA a EFSA: **MRL pro glyfosát v pšenici** 10 mg/kg
- Bayer / Roundup studie ukazují bezpečné dávky, ale **public concern** vyšší
- **Mnoho EU mlýnů odmítá** zrno z desikovaného porostu
- Trend: desikace obilí klesá, řepka a brambory zůstávají

**Aplikace technika:**

**Postřikovač**:
- 200–300 l vody/ha
- Pozor na **drift** — desikant zničí sousední porosty
- **Hrubší tryska** (méně driftu)

**Letecky** (postřik z letadla / drone):
- Pro **těžko dostupné porosty** (rákos, vodní hospodářství)
- Drahší (1 500–3 000 Kč/ha)
- Méně regulačně přijatelné

**EU regulace desikantů:**

**Zakázané v EU (2018-2024)**:
- Diquat (2019)
- Glufosinát (2018)
- Mancozeb (2024)

**Riziko zákazu**:
- **Glyfosát** — pravidelně přezkoumávaný, zatím povoleno do 2033

**Alternativy bez chemie:**
- **Mechanická desikace** (drcení nati u brambor)
- **Tepelná desikace** (propanové hořáky — drahé)
- **Vyhnívání přirozeně** (delší okno sklizně, riziko počasí)
- **Šlechtění** odrůd s **synchronnějším dozráváním** (řepka)

**Ekonomický dopad:**
- **Bez desikace u řepky**: 8–15 % ztráta výnosu = 4 000–8 000 Kč/ha
- **Desikace**: 350–500 Kč/ha náklady
- **Návratnost**: 8–15× ROI v řepce

Viz též [[roundup]], [[herbicidy]], [[repka-ozima]], [[zemak]], [[plisen-bramborova]].`,
    related: ['roundup', 'herbicidy', 'repka-ozima', 'zemak', 'plisen-bramborova'],
  },

  // ── PLODINY A KOMODITY ──────────────────────────────────────────────
  {
    slug: 'psenice-ozima',
    term: 'Pšenice ozimá',
    alias: ['winter wheat', 'Triticum aestivum', 'ozimka'],
    kategorie: 'plodiny',
    shortDef: 'Pšenice ozimá je nejdůležitější plodina ČR — 800 000+ ha = 30 % orné půdy. Seje se na podzim (září–říjen), sklízí v červenci–srpnu. Výnos 6–8 t/ha, cena 4 500–6 500 Kč/t. Potravinářská třída A/E nebo krmná podle hektolitrové váhy.',
    longDef: `Pšenice ozimá (lat. *Triticum aestivum*, ang. *winter wheat*) je **nejdůležitější obilnina v ČR** a 2. nejpěstovanější plodina (po kukuřici v plochách). V CZ pokrývá **800–950 tis. ha** ročně, produkce **5–7 mil. t**.

**Vlastnosti ozimu vs jarinu (viz [[ozim-jarin]]):**
- **Setí**: 15. září – 20. října (optimálně do 5. října v CZ)
- **Vegetace**: 280–310 dní (přezimuje)
- **Sklizeň**: 15. července – 15. srpna
- **Výnos vs jarní**: o 20–40 % vyšší (využije zimní vláhu, delší vegetace)

**Agrotechnika:**

**1. Setí (BBCH 00–09):**
- **Hloubka**: 2–4 cm
- **Vzdálenost řádků**: 12,5 cm (úzké), 15 cm (standard)
- **Hustota**: 350–450 klíčivých zrn/m² (= 180–220 kg osiva/ha pro HW 45g)
- **Doporučení**: pozdější setí (po 1. říjnu) = nižší riziko septoriózy ([[septorioza]]) ale slabší kořenový systém
- **Předplodina ideální**: řepka, hrách, luskovina (zanechávají dusík)
- **Předplodina riziková**: kukuřice (Fusarium [[fuzarioza]]), pšenice (autokoroze)

**2. Podzimní vývoj (BBCH 10–29):**
- **Cíl: zima** s 3-4 odnožemi, kořenový systém v hloubce 50+ cm
- **Hnojení na podzim**: 30–40 kg P/ha, 60–80 kg K/ha (NPK 15-15-15 = 200 kg)
- **Postřik plevele**: jeseň pre-emergence (Stomp + Boxer) nebo časné jaro
- **Postřik fungicid**: jen při silném podzimním tlaku (septoriózy)

**3. Jarní vývoj (BBCH 30–49):**
- **Regenerační hnojení** N (BBCH 25–29): 50–70 kg N/ha (LAV, DAM-390)
- **Hnojení BBCH 32**: 40–60 kg N/ha
- **Hnojení BBCH 39**: 30–50 kg N/ha + síra (S 20 kg)
- **Celkem N**: 150–220 kg N/ha (intenzivní) nebo 120–160 (extenzivní)
- **Postřiky T1 + T2** (viz [[fungicidy]]) — SDHI + triazol

**4. Kvetení a tvorba zrna (BBCH 50–89):**
- **Postřik T3** (BBCH 63): fuzarióza prevence
- **Plnění zrna**: cca 40 dní (mléčné → voskové → tvrdé)
- **Klíčové**: déšť v plnění zvyšuje výnos, sucho srazí o 20–40 %

**5. Sklizeň (BBCH 90–99):**
- **Vlhkost zrna**: 13–15 % optimum (skladovatelné bez sušení)
- **Desikace** (viz [[desikace]]): u mokrých let glyfosát 10 dní před sklizní
- **Kombajn**: 5–10 ha/h (moderní)

**Výnosy CZ 2024:**
- **Průměr**: 6,2 t/ha
- **Top farmy** (intenzivní, Středočesko): 9–12 t/ha
- **Slabé farmy** (Vysočina, ANC): 4–5 t/ha

**Kvalitativní třídy** (podle hektolitrové váhy a obsahu N):

| Třída | hl váha | NL (sušina) | Cena (Kč/t 2024) |
|-------|---------|-------------|------------------|
| **E** (elite) | 82+ | 14+ % | 6 200–6 500 |
| **A** | 78–82 | 12,5+ % | 5 800–6 200 |
| **B** | 76–78 | 11,5+ % | 5 400–5 800 |
| **C** (krmná) | 74–76 | 10+ % | 4 800–5 200 |
| **Pod limit** | < 74 | < 10 | 4 200–4 600 |

**Ekonomika 2024:**
- **Náklady** na 1 ha: 28 000–38 000 Kč (osivo, hnojiva, postřiky, palivo, sklizeň)
- **Výnosy 6,5 t/ha × 5 500 Kč = 35 750 Kč/ha**
- **Marže**: -2 000 až +5 000 Kč/ha (úzká, citlivá na ceny)
- **Dotace BISS + CISS + EKO**: ~5 000–7 000 Kč/ha přidává marže

**Odrůdy 2024 (CZ trh):**
- **Bohemia** — toleruje sucho, A třída
- **Sailor** — výnos top, B-A třída
- **Vlasta** — septoriózová odolnost
- **Genius** — krmná, top výnos
- **RGT Sacramento** (FR import) — A třída, hodně rozšířená

**Hlavní choroby:** [[septorioza]] (#1), [[fuzarioza]], [[rzi]]

**Hlavní škůdci:** mšice (BYDV vektor), kohoutek obilní, hrbáč pšeničný

**EU regulace:**
- **CAP BISS + CISS**: ~3 600 Kč/ha (2024)
- **EKO režim** (cover crops, no-till): +1 300 Kč/ha
- **Pšenice v greening**: počítá se jako „diverzifikace" v 5+ plodinovém osevním postupu

Viz též [[ozim-jarin]], [[osevni-postup]], [[fungicidy]], [[septorioza]], [[fuzarioza]], [[hektolitr]], [[psenice-jarni]].`,
    related: ['ozim-jarin', 'osevni-postup', 'fungicidy', 'septorioza', 'fuzarioza', 'hektolitr', 'psenice-jarni'],
  },
  {
    slug: 'psenice-jarni',
    term: 'Pšenice jarní',
    alias: ['spring wheat', 'jarka pšenice'],
    kategorie: 'plodiny',
    shortDef: 'Pšenice jarní je doplňková plodina v CZ — 20 000–40 000 ha (záplata po neúspěšném ozimu nebo specializované odrůdy). Seje se v březnu–dubnu, sklízí v srpnu. Výnos 4–6 t/ha (o 1–2 t/ha nižší než ozim).',
    longDef: `Pšenice jarní (lat. *Triticum aestivum* — varieta jarní, ang. *spring wheat*) je **doplňková plodina** v ČR — v normálních letech jen 20 000–40 000 ha. Většinou jako **náhrada po nedovydařeném ozimu** (vymrznutí, vyplavení v zimě) nebo specializované odrůdy pro pekařskou kvalitu.

**Klíčové rozdíly oproti ozimu (viz [[psenice-ozima]]):**

| Parametr | Ozim | Jarin |
|----------|------|-------|
| Setí | září–říjen | březen–duben |
| Vegetace | 280–310 dní | 110–140 dní |
| Sklizeň | červenec–srpen | srpen |
| Výnos | 6–8 t/ha | 4–6 t/ha |
| Hektolitrová váha | 76–82 kg/hl | 74–78 kg/hl |
| Kvalitativní třída | E/A/B (potrav) | A/B (potrav) nebo krmná |
| N hnojení | 150–220 kg/ha | 100–140 kg/ha |
| Náklady | 28–38 tis. Kč/ha | 20–28 tis. Kč/ha |
| Riziko žní | vlhká léta = fuzarióza | vlhká léta = polehnutí |

**Kdy se používá:**

1. **Záplatovací plodina** — když ozim vymrzl nebo nebyl zaset včas (mokrý podzim)
2. **Pekařské speciality** — některé odrůdy mají vyšší lepek pro pekařskou kvalitu
3. **Severní oblasti** ČR (Krkonoše, Šumava) — kde ozim přezimuje špatně
4. **Bio farmy** — kratší vegetace = menší tlak chorob = méně postřiků

**Agrotechnika:**

**Setí:**
- **Optimální termín**: jakmile půda umožní vjetí strojem (typicky 10.–25. března)
- **Pozdější setí** (po 10. dubnu) = výnos klesá o 100–200 kg/ha/týden
- **Hloubka**: 3–5 cm
- **Hustota**: 450–550 klíčivých zrn/m² (vyšší než ozim, kvůli kratší vegetaci a méně odnožování)

**Hnojení:**
- **Při setí**: 80–100 kg N/ha (rychlý start, jarka nestihne mineralizovat)
- **BBCH 32**: 30–50 kg N/ha
- **BBCH 39**: 20–30 kg N/ha
- **Celkem**: 130–180 kg N/ha
- **P + K**: jen poloviční vs ozim (vegetace kratší)

**Ochrana**:
- **Plevele**: post-emergence (Granstar, Hussar) — méně tlaku než ozim
- **Fungicidy**: 1–2 postřiky (T1 + T2) — méně tlaku septoriózy
- **Insekticidy**: mšice (BYDV), kohoutek obilní — pyrethroid

**Odrůdy CZ 2024:**
- **Septima** — top výnos jarní
- **KWS Sharki** — pekařská kvalita
- **Tybalt** — bio přístup, odolnost

**Ekonomika:**
- **Náklady**: 22 000–28 000 Kč/ha (nižší než ozim — méně N, méně postřiků)
- **Výnos**: 4,5 t/ha × 5 200 Kč = 23 400 Kč/ha
- **Marže**: typicky -2 000 až +3 000 Kč/ha
- **Když záplata po ozimu**: alespoň „nějaký výnos" je lepší než nic

**Výzkum a šlechtění:**
- **CZ odrůdy**: VURV Praha-Ruzyně, Selgen
- **Trend**: hledat odrůdy s vyšší tolerancí k suchu (klimatická změna)

Viz též [[psenice-ozima]], [[ozim-jarin]], [[osevni-postup]], [[fungicidy]], [[hektolitr]].`,
    related: ['psenice-ozima', 'ozim-jarin', 'osevni-postup', 'fungicidy', 'hektolitr'],
  },
  {
    slug: 'jecmen-sladovnicky',
    term: 'Ječmen sladovnický',
    alias: ['malting barley', 'pivovarský ječmen', 'Hordeum vulgare malt'],
    kategorie: 'plodiny',
    shortDef: 'Ječmen sladovnický je jarní plodina pěstovaná pro výrobu sladu (pivovarnictví). CZ má 100 000+ ha. Klíčové parametry: hl. váha min. 64 kg, dusík 1,5–1,9 % (NÍZKÝ!), klíčivost 95+ %. Příplatek za kvalitu 800–1 500 Kč/t.',
    longDef: `Ječmen sladovnický (lat. *Hordeum vulgare*, ang. *malting barley*) je **jarní plodina** pěstovaná specifically pro výrobu **sladu** — základní suroviny pro **pivovarnictví**. ČR je tradiční producent (Plzeňský prazdroj, Budvar, Staropramen).

**Klíčový rozdíl od krmného ječmene** (viz [[jecmen-krmny]]):
- **Nízký obsah dusíku** (1,5–1,9 %) — pivovar potřebuje **málo bílkovin, hodně škrobu** pro fermentaci na ethanol
- **Vysoká hl. váha** (min. 64 kg/hl, ideál 68+)
- **Vyrovnaná velikost zrna** (homogenní klíčení sladu)
- **Vysoká klíčivost** (95+ %) — bez klíčení nelze udělat slad
- **Bez fuzariózy** (mykotoxiny DON v pivu nepřípustné)

**Vlastnosti agronomické:**

**Setí:**
- **Termín**: 10.–25. března (čím dřív, tím lépe — chladu odolný)
- **Pozdější setí** = vyšší dusík v zrnu (špatné pro slad!)
- **Hloubka**: 3–4 cm
- **Hustota**: 350–420 klíčivých zrn/m²

**Hnojení — POZOR:**
- **N hnojení**: jen 60–100 kg/ha (níže než pšenice!)
- **Vyšší N → vyšší bílkoviny v zrnu → nesplnění limitu sladovnictví**
- **Časování**: vše do BBCH 32 (později nestihne se odbourat z listů)
- **P + K**: 30–50 kg P, 60–100 kg K (struktura, hektolitrová váha)

**Ochrana:**
- **Plevele**: standard pro jaré obilí (Granstar, Hussar)
- **Fungicidy**: T1 (BBCH 31–32) + T2 (BBCH 39–49) — Ramularie (Zymoseptoria), padlí
- **Insekticidy**: mšice (BYDV), žírači listů

**Kvalitativní parametry sladovnictví** (CZ standard):

| Parametr | Min. | Optimal | Penalizace |
|----------|------|---------|-----------|
| Hl. váha | 64 kg/hl | 68+ | -200 Kč/t pod 64 |
| Dusík | 1,5–1,9 % | 1,5–1,7 % | -500 Kč/t nad 2,1 % |
| Klíčivost (4 dny) | 95 % | 98+ % | nedodáno pod 90 % |
| Vyrovnanost (síto 2,5 mm) | 90 % | 95+ % | -200 Kč/t pod 88 % |
| Vlhkost | 14 % max | 13 % | -150 Kč/t nad 15 % |

**Sklizeň:**
- **Vlhkost zrna**: 14 % optimum
- **Důležité**: nesklízet za mokra (DON riziko po deštích)
- **Sušení**: max 40 °C (vyšší teplota = ztráta klíčivosti)

**Výnosy:**
- **Průměr CZ**: 5,2 t/ha
- **Top farmy**: 7+ t/ha
- **Odrůdové výnosy** vs krmný: o 0,5–1 t/ha nižší (cena za kvalitu)

**Cena 2024:**
- **Standard sladovnický**: 5 800–7 000 Kč/t (kontrakt předem)
- **Přírůstek za top kvalitu** (nízký N, vysoká klíčivost): +800–1 500 Kč/t
- **Krmný odbyt** (nesplnil limit): 4 800–5 500 Kč/t

**Odrůdy CZ 2024:**
- **Bojos** — nejrozšířenější, vysoká hl. váha
- **Laudis** — moderní, výnos + kvalita
- **Calcule** — Heineken kontrakt
- **Spartacus** — nový, vysoký výnos
- **Bonus** — chladu odolný

**Trh a kontrakty:**

**Smluvní pěstování** (dominantní):
- **Plzeňský prazdroj** — kontrakt s farmáři 1 rok dopředu, garantovaná cena
- **Budvar** — vlastní výkup
- **Staropramen** — Belgické vlastnictví, kontrakt EU pivovarní skupina
- **Heineken** — globální buyer

**Spotový trh** (volný prodej):
- **MATIF** (Paris) — futures cena ječmene
- **Volatilní** — záleží na úrodě v EU, Rusku, Ukrajině

**Eksport:**
- CZ exportuje 200 000–300 000 t/rok sladovnického ječmene (Německo, Velká Británie, Belgie)

**Klimatická změna:**
- **Sucho v dubnu–červnu** = krátká vegetace = vysoký N v zrnu
- **Pivovary tlačí** na pěstování v severnějších oblastech (Polsko, Skandinávie)
- **Šlechtění**: hledá rezistenci k suchu

**Pozn.**: ČR má **historickou tradici** — Žatecký chmel + sladovnický ječmen = základ české pivní kvality, identita státu.

Viz též [[jecmen-krmny]], [[psenice-ozima]], [[fungicidy]], [[hektolitr]], [[ozim-jarin]].`,
    related: ['jecmen-krmny', 'psenice-ozima', 'fungicidy', 'hektolitr'],
  },
  {
    slug: 'jecmen-krmny',
    term: 'Ječmen krmný',
    alias: ['feed barley', 'krmný ječmen ozimý/jarní', 'Hordeum vulgare feed'],
    kategorie: 'plodiny',
    shortDef: 'Ječmen krmný je ozimá nebo jarní plodina pro krmení skotu, prasat, drůbeže. Vyšší výnos (6–8 t/ha) než sladovnický, vyšší dusík. Cena 4 600–5 400 Kč/t. CZ má 150 000+ ha (kombinace ozim + jarní).',
    longDef: `Ječmen krmný (lat. *Hordeum vulgare*, ang. *feed barley*) je **ozimá nebo jarní plodina** pěstovaná pro **krmení hospodářských zvířat** (skot, prasata, drůbež). Na rozdíl od sladovnického (viz [[jecmen-sladovnicky]]) nemá požadavky na nízký dusík — naopak vyšší N znamená vyšší bílkoviny v krmivu = vyšší hodnota.

**Vlastnosti agronomické:**

**Ozimý vs jarní krmný ječmen:**

| Parametr | Ozimý | Jarní |
|----------|-------|-------|
| Setí | září–říjen | březen–duben |
| Sklizeň | červenec | srpen |
| Výnos | 7–9 t/ha | 5–7 t/ha |
| N hnojení | 140–180 kg | 90–130 kg |
| Náklady | 25 000–32 000 Kč/ha | 20 000–25 000 Kč/ha |

**Ozimý dominuje** v CZ pro krmné účely (lepší výnosy).

**Setí (ozim):**
- **Termín**: 20. září – 15. října (= dříve než ozim pšenice o 1–2 týdny)
- **Hloubka**: 3–4 cm
- **Hustota**: 350–420 klíčivých zrn/m²

**Hnojení (ozim):**
- **Podzim**: 20 kg N + 40 kg P + 80 kg K (= NPK 15-15-15 200 kg/ha)
- **Jaro BBCH 25**: 60–80 kg N/ha (LAV, DAM)
- **Jaro BBCH 32**: 40–60 kg N/ha
- **Celkem N**: 130–180 kg/ha

**Krmné použití:**

**Pro skot:**
- **Šrot** (viz [[srotovnik]]) — drcené zrno do TMR (viz [[tmr]])
- **Dávka**: 3–6 kg krmné dávky / kráva / den
- **Nutriční hodnoty**: 12 % CP, 7,5 MJ NEL/kg, vysoký škrob

**Pro prasata:**
- **Jemněji mletý šrot** — 30–60 % krmné směsi
- **Pomáhá** trávení (vláknina), méně škrobu než kukuřice

**Pro drůbež:**
- **Mlátí se** — 10–20 % krmné směsi (méně než kukuřice — vyšší vláknina ne ideální pro drůbež)
- **Speciálně pro nosnice** (vyšší vláknina = lepší peristaltika)

**Cena 2024:**
- **Krmný ječmen**: 4 600–5 400 Kč/t
- **Rozdíl proti sladovnickému**: -800 až -1 500 Kč/t (záleží na momentální poptávce sladovnictví)

**Sklizeň:**
- **Vlhkost zrna**: 14 % optimum
- **Méně náročný timing** než sladovnický (není nutné nesklízet za mokra — pro krmení to nevadí)

**Odrůdy:**

**Ozimé krmné:**
- **KWS Tenor** — top výnos
- **Cassia** — populární, robustní
- **Wootan** — moderní, krmný kontrakt

**Jarní krmné:**
- **Vladimir** — výnosný
- **Salome** — nezávislost

**Choroby a ochrana:**
- **Rynchosporium** (skvrnitost ječmene) — typická pro ječmen
- **Ramularie** (listová) — rostoucí problém 2020s
- **Padlí ječmenné** — častý problém
- **Fungicidy**: T1 + T2 (jako u pšenice, viz [[fungicidy]])
- **Insekticidy**: mšice (BYDV), kohoutek obilní

Viz též [[jecmen-sladovnicky]], [[psenice-ozima]], [[tmr]], [[krmne-davky]], [[hektolitr]], [[srotovnik]].`,
    related: ['jecmen-sladovnicky', 'psenice-ozima', 'tmr', 'krmne-davky', 'hektolitr'],
  },
  {
    slug: 'zito-ozime',
    term: 'Žito ozimé',
    alias: ['rye', 'Secale cereale', 'ozimý žitný'],
    kategorie: 'plodiny',
    shortDef: 'Žito ozimé je obilnina pěstovaná na chudých půdách a v severnějších/horských oblastech ČR. Výnos 5–7 t/ha, cena 4 200–5 200 Kč/t. Hlavní použití: chleba (kvašený žitný chléb), žitné celozrnné pečivo, lihovary, krmivo.',
    longDef: `Žito ozimé (lat. *Secale cereale*, ang. *rye*) je **ozimá obilnina**, historicky druhá nejdůležitější po pšenici v ČR. Dnes spíše nicheový — pěstuje se na **chudých písčitých půdách** a v **horských oblastech**, kde pšenice nedává dobré výnosy.

**Plocha v ČR 2024**: ~25 000 ha (klesající trend, v 1950s bylo 400 000+ ha)

**Vlastnosti:**

**Agrotechnika:**

**Setí:**
- **Termín**: 1.–25. září (= dříve než pšenice o 2–3 týdny — žito vyžaduje delší podzimní růst)
- **Hloubka**: 2–4 cm
- **Hustota**: 280–350 klíčivých zrn/m² (méně než pšenice — žito hodně odnožuje)
- **Vhodná předplodina**: brambory, řepka, luskoviny

**Hnojení:**
- **Podzim**: 20 kg N + 30 kg P + 60 kg K
- **Jaro BBCH 25**: 50–70 kg N/ha
- **Jaro BBCH 32**: 30–50 kg N/ha
- **Celkem N**: 80–120 kg/ha (méně než pšenice — žito je tolerantní k chudým půdám)

**Sklizeň:**
- **Vlhkost**: 13–15 %
- **Polehnutí riziko**: žito je vyšší (130–180 cm) než pšenice (90–110 cm) — vítr ho snadno položí

**Výnosy:**
- **Průměr CZ**: 5,5 t/ha (zlepšení vs historie díky hybridnímu žitu)
- **Hybridní žito** (KWS Sortiment): 7–8 t/ha (lepší než tradiční populace)

**Použití:**

**1. Chléb a pečivo (60 % spotřeby):**
- **Žitný kvas** — nutný pro chléb (proteiny žita netvoří lepek jako pšenice)
- **Šumavský chléb, podpisový žitný** — tradiční CZ pekařství
- **Žitné mouky**: ražná T75 (světlá), T80 (chlebová), T200 (celozrnná)

**2. Lihovary (15 %):**
- **Žitný líh** — tradiční CZ destilát (mladá žitná, ražná pálenka)
- **Vodka** — Polsko, Rusko (jiná tradice)

**3. Krmivo (20 %):**
- **Pro skot**: do TMR jako alternativa pšenice
- **Pro prasata**: jen do 20 % směsi (vyšší vláknina)

**4. Bio paliva / bioethanol (5 %):**
- **Některé EU země** (Německo) dotovaly bioethanol z žita

**Cena 2024:**
- **Potravinářské žito**: 4 600–5 200 Kč/t
- **Krmné žito**: 4 200–4 600 Kč/t
- **Bio žito**: 6 800–8 500 Kč/t (premium pro bio pekařství)

**Hybridní žito** (klíčový technologický skok od 1990s):
- **KWS** (Germany) dominuje trhem hybridního žita
- **Tepelný systém** opylování — F1 hybridi jen z certifikovaného osiva (nelze sklízet ke setí)
- **Výnos**: +30–50 % vs tradiční populace
- **Cena osiva**: 4–6× vyšší než tradiční (kompenzováno výnosem)

**Odrůdy CZ 2024:**
- **KWS Bono** — hybrid, top výnos
- **KWS Vinetto** — hybrid, robustní
- **Selgo** — tradiční populace, levné osivo
- **Souvenir** — bio přístup

**Choroby a ochrana:**
- **Ergot (paličkovice)** — *Claviceps purpurea* — historicky **šíleny v Evropě**, dnes pod kontrolou. **Mykotoxiny** (ergotaminy), riziko v deštivých letech.
- **Rzi** (viz [[rzi]]) — méně tlaku než pšenice
- **Septoriózy** — minimální
- **Postřiky**: lehčí program než pšenice (1 fungicid)

**EU regulace:**
- **CAP BISS + CISS** stejné jako pšenice
- **EKO režim** — bio žito populární u ekologických farem (méně postřiků, robustní)

**Kulturní dimenze:**
- **Žito je „chudobná" plodina** — historicky lidé chudí jedli žitný chléb, bohatí pšeničný
- **Dnes obrácený trend** — žitný chléb je „zdravější" image (vyšší vláknina, lepší index glykémie)
- **Tmavé pečivo** — celozrnné žitné, žitné krekry — trend wellness

Viz též [[psenice-ozima]], [[oves-jarni]], [[ozim-jarin]], [[rzi]], [[hektolitr]].`,
    related: ['psenice-ozima', 'oves-jarni', 'ozim-jarin', 'rzi', 'hektolitr'],
  },
  {
    slug: 'oves-jarni',
    term: 'Oves jarní',
    alias: ['oats', 'Avena sativa', 'jarní oves'],
    kategorie: 'plodiny',
    shortDef: 'Oves jarní je obilnina pěstovaná hlavně v severnějších a chladnějších oblastech ČR. Výnos 3,5–5 t/ha, cena 4 000–5 500 Kč/t. Použití: krmivo pro koně, lidská konzumace (vločky, müsli), zelené krmivo.',
    longDef: `Oves jarní (lat. *Avena sativa*, ang. *oats*) je **jarní obilnina** s tradicí v CZ na chudších a chladnějších půdách. Plocha v CZ 2024: ~35 000 ha. Trend: rostoucí kvůli zdravotnímu pozitivnímu image (ovesné vločky, plant-based).

**Vlastnosti:**

**Agrotechnika:**

**Setí:**
- **Termín**: 15. března – 15. dubna (snáší chlad, raně setí)
- **Hloubka**: 3–4 cm
- **Hustota**: 350–450 klíčivých zrn/m²

**Hnojení:**
- **Při setí**: 60–80 kg N/ha
- **BBCH 32**: 30–40 kg N/ha
- **Celkem N**: 80–120 kg/ha (oves nezužitkuje vysoké N, polehne)

**Sklizeň:**
- **Vlhkost**: 13–15 %
- **Polehnutí riziko**: vysoký (110–140 cm), tenké stéblo
- **Klíčové**: NEpřehnojit N

**Výnosy:**
- **Průměr CZ**: 4,2 t/ha
- **Top farmy**: 6+ t/ha

**Použití:**

**1. Lidská konzumace (45 %):**
- **Ovesné vločky** (rolled oats) — pařené + válcované zrno
- **Müsli, granola** — populární zdravá snídaně
- **Ovesné mléko** (oat milk) — silný trend 2020s, plant-based náhrada
- **Pekařství** — celozrnný chléb s ovesem
- **Diet** — oves má **β-glukan** (vláknina, snižuje cholesterol)

**2. Krmivo pro koně (35 %):**
- **Tradiční koňské krmivo** — energie + vláknina + dobrá stravitelnost
- **2–6 kg/kůň/den** podle zatížení
- **Dostihoví koně** — vyšší podíl ovsa

**3. Krmivo pro skot (15 %):**
- **Méně časté** než ječmen
- **Pro mladé telata** — lehce stravitelné

**4. Zelená pícnina / cover crop (5 %):**
- **Oves jako krycí plodina** — biomasa pro mulč, sekvestraci uhlíku
- **Oves + vikve smíška** — luskovino-obilná směs pro pícnice

**Cena 2024:**
- **Potravinářský oves** (premium pro vločky): 5 200–5 800 Kč/t
- **Krmný oves**: 4 200–4 800 Kč/t
- **Bio oves**: 7 500–9 500 Kč/t (vysoký premium pro bio müsli)

**Odrůdy CZ 2024:**
- **Atego** — top výnos krmný
- **Husar** — potravinářský
- **Rozmar** — tradiční populace
- **Spurt** — moderní, robustní

**Choroby:**
- **Rzi ovsí** (Puccinia coronata) — listová
- **Helminthosporium** (skvrnitost) — vlhká léta
- **Méně tlaku** než pšenice → méně postřiků

**Ochrana:**
- **Plevele**: pre-emergence (Stomp)
- **Fungicidy**: 1 postřik T2 (BBCH 39) — preventivní
- **Insekticidy**: minimální (mšice BYDV)

**Bio přístup:**
- **Oves** je ideální pro bio farmu (málo postřiků, robustní)
- **Bio cena premium** kompenzuje výnos -20 % vs konvenční

**Ekonomika:**
- **Náklady**: 18 000–24 000 Kč/ha
- **Výnos 4,5 t/ha × 4 800 Kč = 21 600 Kč/ha**
- **Marže**: typicky úzká (-1 000 až +3 000 Kč/ha)
- **Plus dotace BISS + CISS + EKO**: dělá z toho výhodnější plodinu

**Trh a trendy:**
- **Plant-based revolution** — ovesné mléko = 2x růst spotřeby 2020s
- **Oat milk vs almond milk** — oat má lepší enviromentální stopu, šíření v EU
- **Bio oves**: rostoucí poptávka pro Hipp dětskou výživu, Müsli zdroje

Viz též [[psenice-ozima]], [[zito-ozime]], [[ozim-jarin]], [[hektolitr]], [[mezi-plodiny]].`,
    related: ['psenice-ozima', 'zito-ozime', 'ozim-jarin', 'hektolitr', 'mezi-plodiny'],
  },
  {
    slug: 'tritikale',
    term: 'Tritikale',
    alias: ['triticale', 'kříženec pšenice a žita', 'pšeničné žito'],
    kategorie: 'plodiny',
    shortDef: 'Tritikale je obilnina vzniklá křížením pšenice (Triticum) a žita (Secale). Kombinuje vlastnosti obou — výnos pšenice + odolnost žita. Hlavně krmné použití, výnos 6–8 t/ha, cena 4 400–5 200 Kč/t.',
    longDef: `Tritikale (lat. *× Triticosecale*, ang. *triticale*) je **uměle vyšlechtěná obilnina** vzniklá křížením **pšenice** (*Triticum*) × **žita** (*Secale cereale*). Kombinuje vlastnosti obou rodičů: **výnos pšenice + odolnost žita** k chudým půdám a chorobám.

**Historie:**
- **1875** — první kříženec popsán skotský chovatel Stephen Wilson
- **1937** — kanadský agronom L.H. Newman vytvořil první funkční tritikale
- **1960s** — CIMMYT (Mexiko) zahájil systematický šlechtitelský program
- **1980s** — masové rozšíření v Evropě (Polsko, NSR, ČSSR)
- **2024** — globální plocha 15 mil. ha (Polsko #1, Německo #2, ČR ~50 000 ha)

**Vlastnosti:**

**Ozimý vs jarní tritikale:**
- **Ozimý** dominuje v CZ (90 % ploch)
- **Jarní** jen jako záplata po nepovedeném ozimu

**Setí (ozim):**
- **Termín**: 15. září – 5. října
- **Hloubka**: 3–5 cm
- **Hustota**: 320–400 klíčivých zrn/m²
- **Vhodná předplodina**: brambory, řepka, luskoviny

**Hnojení:**
- **Podzim**: 25 kg N + 30 kg P + 60 kg K
- **Jaro BBCH 25**: 60–80 kg N/ha
- **Jaro BBCH 32**: 30–50 kg N/ha
- **Celkem N**: 100–140 kg/ha (mezi pšenicí a žitem)

**Sklizeň:**
- **Vlhkost**: 13–15 %
- **Polehnutí střední riziko** (mezi pšenicí a žitem)

**Výnosy:**
- **Průměr CZ**: 6,8 t/ha
- **Top farmy**: 9+ t/ha
- **Lepší než žito** o 1–2 t/ha, **mírně pod pšenicí** o 0,5–1 t/ha

**Použití:**

**1. Krmivo (85 %):**
- **Pro skot**: do TMR (viz [[tmr]]) — substituce pšenice/ječmene
- **Pro prasata**: hlavní obilná složka
- **Pro drůbež**: 20–40 % směsi

**2. Bioethanol (10 %):**
- **Lihovary** — vysoký škrob, dobrá fermentace
- **EU dotované** v některých zemích (Polsko, Německo)

**3. Lidská konzumace (5 %):**
- **Specifické pečivo** (zdravotně orientované)
- **Müsli** směsi
- **Méně rozvinutá** kategorie

**Cena 2024:**
- **Krmný tritikale**: 4 400–5 000 Kč/t
- **Bioethanol kontrakt**: 4 200–4 600 Kč/t
- **Bio tritikale**: 6 500–8 000 Kč/t

**Odrůdy CZ 2024:**
- **Trisem** — top výnos
- **Triamant** — odolnost
- **Kassiopeia** — moderní DE import
- **Borowik** — polský import

**Choroby a ochrana:**
- **Septorióza** — méně tlaku než pšenice
- **Rzi** — průměrné tlak (citlivější než žito, méně než pšenice)
- **Padlí** — méně tlaku
- **Postřiky**: 1–2 fungicidy (méně intenzivní než pšenice)
- **EKO režim**: vhodný (méně postřiků)

**Výhody tritikale:**
1. **Robust** — toleruje chudé půdy, sucho
2. **Méně postřiků** — nižší náklady, vhodný pro bio
3. **Vysoký výnos** vs žito
4. **Stravitelný** pro skot a prasata
5. **Cover crop schopnost** — biomasa pro mulč

**Nevýhody:**
1. **Nižší cena** než potravinářská pšenice
2. **Limitovaný trh** lidské konzumace
3. **Méně odrůd** než pšenice/ječmen

**Ekonomika:**
- **Náklady**: 22 000–28 000 Kč/ha
- **Výnos 7 t/ha × 4 700 Kč = 32 900 Kč/ha**
- **Marže**: 4 000–10 000 Kč/ha (lepší než pšenice!)
- **Dotace BISS + CISS + EKO**: standardní

**Strategicky pro CZ:**
- **Pro středně velkou farmu** v ANC (Vysočina, Beskydy) — tritikale je často **lepší volba než pšenice**
- **Pro bio farmu** — méně tlaku chorob, nižší vstupy
- **Pro chov skotu** — vlastní krmivo z vlastního pole

Viz též [[psenice-ozima]], [[zito-ozime]], [[jecmen-krmny]], [[ozim-jarin]], [[krmne-davky]].`,
    related: ['psenice-ozima', 'zito-ozime', 'jecmen-krmny', 'ozim-jarin', 'krmne-davky'],
  },
  {
    slug: 'mak-ozimy',
    term: 'Mák setý',
    alias: ['poppy', 'Papaver somniferum', 'mák modrosemenný'],
    kategorie: 'plodiny',
    shortDef: 'Mák setý je jarní olejnatá plodina, kde je ČR globální velmoc — produkuje 50–70 % světového potravinářského máku (modré semeno). Výnos 0,8–1,4 t/ha semen, cena 35 000–55 000 Kč/t. Hlavní produkt: pekařské semínko, mákový olej, makovice (omezené kvůli opioidům).',
    longDef: `Mák setý (lat. *Papaver somniferum*, ang. *opium poppy* nebo *poppy seed*) je **jarní olejnatá plodina** a globálně specifická — **ČR produkuje 50–70 % světového potravinářského máku** (modré semeno pro pekařské použití). Tradiční oblast: Haná, Polabí, Vysočina.

**Plocha v ČR 2024**: 30 000–40 000 ha (kolísá podle ceny)
**Produkce**: 25 000–35 000 t/rok

**Vlastnosti:**

**Agrotechnika:**

**Setí:**
- **Termín**: 25. března – 25. dubna (snáší pozdní mrazy)
- **Hloubka**: 0,5–1 cm (semínko miniature, plytké setí!)
- **Hustota**: 80–100 klíčivých zrn/m² (= 1,5–2 kg osiva/ha, HW 0,4g)
- **Rozteč řádků**: 25–30 cm (úzké) nebo 45 cm (širší pro plečku)

**Hnojení:**
- **Při setí**: 60–80 kg N/ha
- **BBCH 30**: 30–50 kg N/ha
- **Celkem N**: 80–130 kg/ha

**Ochrana:**
- **Plevele**: pre-emergence (Bromotril, Metaza Plus) + post-emergence
- **Insekticidy**: krytoposed (Ceutorhynchus macula-alba), žírači
- **Fungicidy**: helmintosporióza, plíseň máku — méně tlaku
- **Mák je „čistá" plodina** — málo postřiků, vhodný pro bio

**Sklizeň:**
- **Termín**: srpen, vlhkost makovic 12–14 %
- **Sklízeč mákový** — speciální adaptér na kombajn (oddělí semena z makovic)
- **Klíčové**: nevylít semínka při manipulaci

**Výnosy:**
- **Průměr CZ**: 0,9 t/ha semen
- **Top farmy**: 1,4 t/ha
- **Náklady na 1 ha**: 18 000–25 000 Kč

**Použití:**

**1. Pekařské semínko (modré semeno, 80 %):**
- **Tradiční CZ pekařství** — buchty s mákem, makový závin, makovic
- **Export**: Německo, Nizozemsko, USA, Polsko
- **Cena 2024**: 35 000–55 000 Kč/t (vysoká volatilita)

**2. Mákový olej (10 %):**
- **Lisování** modrých semen
- **Olej** — premium kulinářský olej, vysoká cena
- **Hladký omega-6 profil**, dobrá chuť

**3. Makovice (5 %):**
- **Sušené makovice** — historicky pro lidovou medicínu (sedativní)
- **Kvůli opioidům** (morfin, codein) v makovicích — **omezené použití**, regulované
- **Farmaceutický průmysl** — extraktivní výroba opioidních léků (= **smluvní pěstování pro Zentiva, Pharmos**)

**Legální a regulační aspekty:**
- **CZ legislativa**: pěstování máku **legální** pro potravinářské + farmaceutické účely
- **Nutné registrace** u SZIF, prostor pod 5 ha bez specifické licence
- **Kontroly**: ÚKZÚZ, často monitorovaný kvůli zneužití pro výrobu drog
- **Suché makovice po sklizni** — musí být **zničeny nebo zpracovány** v licencovaném zařízení

**Trh a marketing:**
- **Burza Bruntál** — týdenní mákový trh, CZ centrum
- **Spotový trh** vs **kontraktové pěstování** (Pharmos)
- **Cenová volatilita**: 30 000 ↔ 70 000 Kč/t v rozsahu 2 let
- **Export**: 70 % české produkce jde do EU + USA

**Odrůdy CZ 2024:**
- **Major** — modré semeno, top výnos
- **Maratón** — robustnost
- **Opal** — bílé semeno (export do Asie)
- **Onyx** — moderní

**Ekonomika:**
- **Náklady**: 18 000–25 000 Kč/ha
- **Výnos 1 t × 45 000 Kč = 45 000 Kč/ha**
- **Marže**: 20 000–27 000 Kč/ha (vysoká!)
- **Risk**: cenová volatilita + výnosy citlivé na počasí

**Kulturní význam:**
- **Mák v CZ kuchyni** — kulturní identita (makovic, závin, koláče)
- **Vánoce** — tradiční moučné pokrmy s mákem
- **Velikonoce** — kraslicová zahrada s máky

**Klimatická změna:**
- **Sucho v dubnu–červnu** = nižší výnos
- **Vlhká léta** = plíseň makovic
- **Klíčové**: hluboké kořeny (snáší sucho lépe než pšenice)

**Bio mák:**
- **Bio mák** = 50–80 % vyšší cena
- **Trh malý** ale roste (organic premium pro vegetářské/zdravotní pekařství)

Viz též [[ozim-jarin]], [[slunecnice]], [[repka-ozima]], [[hrach-set]].`,
    related: ['ozim-jarin', 'slunecnice', 'repka-ozima'],
  },
  {
    slug: 'slunecnice',
    term: 'Slunečnice roční',
    alias: ['sunflower', 'Helianthus annuus'],
    kategorie: 'plodiny',
    shortDef: 'Slunečnice je jarní olejnatá plodina s rostoucím významem v CZ (klimatická změna). Plocha 30 000–50 000 ha, výnos 2,5–4 t/ha, cena 13 000–17 000 Kč/t (high oleic premium +2 000). Hlavní použití: olej, krmivo (šrot), bio paliva, ptactvo (semínka).',
    longDef: `Slunečnice roční (lat. *Helianthus annuus*, ang. *sunflower*) je **jarní olejnatá plodina** z rodu *Asteraceae*. V CZ dlouho marginální, ale **rostoucí význam** kvůli klimatické změně (vyšší teploty + sucho = vhodné pro slunečnici).

**Plocha v ČR 2024**: 35 000–50 000 ha (10× nárůst od 2010)
**Produkce**: 110 000–150 000 t/rok

**Vlastnosti:**

**Agrotechnika:**

**Setí:**
- **Termín**: 15.–30. dubna (po posledních jarních mrazech)
- **Hloubka**: 4–5 cm
- **Hustota**: 5–7 rostlin/m² (rozteč 70 × 25 cm)
- **Rozteč řádků**: 70 cm (jako kukuřice — kompatibilní s kukuřičnou plečkou)

**Hnojení:**
- **Při setí**: 80–100 kg N/ha + 50 kg P + 100 kg K
- **Celkem N**: 100–140 kg/ha (nižší než kukuřice)
- **Bor** (B 1 kg/ha) — kritický prvek pro tvorbu úborů

**Ochrana:**
- **Plevele**: pre-emergence (Stomp, Dual Gold) + post-emergence
- **Fungicidy**: bílá hniloba *Sclerotinia*, hnědá hniloba *Phomopsis* — 1–2 postřiky
- **Insekticidy**: minimální (méně škůdců než řepka)

**Sklizeň:**
- **Termín**: září–říjen, vlhkost zrna 10–12 %
- **Desikace** (viz [[desikace]]): glyfosát 2 týdny před sklizní pro sjednocení dozrávání
- **Kombajn**: speciální slunečnicový žací mech (longer fingers)
- **Klíčové**: nevybírat příliš nahoru = ztráta

**Výnosy:**
- **Průměr CZ**: 2,8 t/ha
- **Top farmy** (jižní Morava): 4+ t/ha
- **EU TOP** (Francie, Maďarsko): 3,5–4,5 t/ha

**Použití:**

**1. Slunečnicový olej (60 %):**
- **Standardní olej** — kuchyně, salátový olej, smažení
- **Slunečnicový olej** je **nejlevnější rostlinný olej** v EU
- **Spotřeba CZ**: 6 kg/osoba/rok

**2. High-oleic odrůdy (15 %):**
- **Vysoký obsah kyseliny olejové** (oleic acid) — 80+ % místo standardních 30 %
- **Stabilní při vysokých teplotách** — pro friture, McDonald's, smažení v gastronomii
- **Premium cena**: +1 500–2 500 Kč/t vs standard
- **Odrůdy**: NK Neoma (Syngenta), LG 50.270 HO (Limagrain)

**3. Slunečnicový šrot (15 %):**
- **Vedlejší produkt** lisování oleje
- **Krmivo**: 30–35 % CP, vhodné pro skot, prasata
- **Cena**: 6 500–8 500 Kč/t

**4. Ptáci (potrava, 5 %):**
- **Celé slupkové semínko** — pro ptáčníky, krmítka
- **Cena**: vysoký premium (15 000–25 000 Kč/t)

**5. Bio paliva (5 %):**
- **Bio diesel** z slunečnicového oleje
- **EU dotované** (RED II Renewable Energy Directive)

**Cena 2024:**
- **Standard slunečnice**: 13 000–16 000 Kč/t
- **High-oleic**: +1 500–2 500 Kč/t
- **Bio slunečnice**: 22 000–28 000 Kč/t

**Odrůdy CZ 2024:**
- **LG 50.270 HO** (Limagrain) — high oleic, top výnos
- **NK Neoma** (Syngenta) — high oleic populární
- **ES Janis** (Euralis) — standard, robustní
- **Pioneer P63LE10** — vysoký výnos

**Choroby:**
- **Bílá hniloba** (*Sclerotinia sclerotiorum*) — vlhká léta, ztráta 10–30 %
- **Hnědá hniloba** (*Phomopsis helianthi*) — listová + úborová
- **Plíseň slunečnice** (*Plasmopara halstedii*) — preventivní moření osiv
- **Postřiky**: 1–2 fungicidy v sezóně (BBCH 51 + 65)

**Škůdci:**
- **Drobní brouci** — menší tlak než řepka
- **Ptáci** — sníží sklizeň o 5–15 %, zvláště holubi a hejna

**Ekonomika:**
- **Náklady**: 22 000–28 000 Kč/ha
- **Výnos 3 t × 14 500 Kč = 43 500 Kč/ha**
- **Marže**: 15 000–20 000 Kč/ha (atraktivní!)
- **Dotace BISS + CISS + EKO**: standardní

**Strategický význam pro CZ:**
- **Růst plochy 2010s** vs řepka — alternativa s nižším postřikovým tlakem
- **Klimatická vhodnost** — jižní Morava, Polabí, Slovácko
- **Severnější CZ** (Vysočina, Krkonoše): méně vhodné kvůli kratší vegetaci

**Klimatická změna:**
- **Pozitivní dopad** — slunečnice je tepelná plodina, profituje z teplých let
- **Sucho** — tolerantní (hluboké kořeny)
- **Riziko**: pozdní mrazy v dubnu (zničí klíčící porost)

Viz též [[repka-ozima]], [[ozim-jarin]], [[fungicidy]], [[desikace]], [[mak-ozimy]].`,
    related: ['repka-ozima', 'ozim-jarin', 'fungicidy', 'desikace'],
  },
  {
    slug: 'horcice',
    term: 'Hořčice setá',
    alias: ['mustard', 'Sinapis alba', 'bílá hořčice', 'Sinapis arvensis'],
    kategorie: 'plodiny',
    shortDef: 'Hořčice setá (bílá hořčice) je jarní brukvovitá plodina pro výrobu hořčice (kořeněné omáčky) a jako meziplodina pro zelené hnojení. CZ plocha 5 000–15 000 ha. Krátká vegetace 90–110 dní. Výnos 1–2 t/ha semen, cena 13 000–18 000 Kč/t.',
    longDef: `Hořčice setá (lat. *Sinapis alba*, „bílá hořčice", ang. *white mustard*) je **jarní brukvovitá plodina** s krátkou vegetační dobou (90–110 dní). Hlavně pro **výrobu hořčice** (jako kořeněná omáčka) a **jako meziplodina** pro zelené hnojení.

**Plocha v ČR 2024**: 5 000–15 000 ha pro semeno + 100 000+ ha jako meziplodina

**Vlastnosti:**

**Agrotechnika:**

**Setí:**
- **Termín**: 25. března – 25. dubna (semínko pro sklizeň) NEBO 1.–15. srpna (meziplodina po sklizni obilí)
- **Hloubka**: 1,5–2 cm
- **Hustota**: 200–300 klíčivých zrn/m² (= 8–12 kg osiva/ha)

**Hnojení:**
- **Pro semeno**: 60–80 kg N/ha
- **Pro meziplodinu**: bez hnojení (využije zbytek z předplodiny)
- **P + K**: 30 P + 60 K

**Ochrana:**
- **Plevele**: pre-emergence (Stomp) + post-emergence
- **Insekticidy**: krytonosec stonkový, blýskáček řepkový — pyrethroid
- **Fungicidy**: minimální tlak

**Sklizeň:**
- **Termín**: konec července–srpen, vlhkost 10–12 %
- **Sjednocení dozrávání**: glyfosát desikace 10 dní před sklizní
- **Kombajn**: standardní obilní žací mech

**Výnosy:**
- **Průměr CZ**: 1,3 t/ha
- **Top farmy**: 2+ t/ha

**Použití:**

**1. Hořčice kořenina (60 % výroby):**
- **Mletá hořčice + ocet + sůl + voda + koření** = kořeněná omáčka
- **Český národní pokrm** (svíčková, řízek)
- **Pražská hořčice, plnotučná hořčice** — typy CZ
- **Globální značky**: Hellmann's, Heinz, Maille — všechny od slunečnice setí

**2. Meziplodina (30 % ploch — největší užití!):**
- **Sklizeň pšenice/ječmene** → ihned setí hořčice → vegetační období do první mrazy → zarytí na podzim nebo na jaře
- **Účinky**:
  - **Zelené hnojení** — biomasa rozkládá se v půdě
  - **Sekvestrace C** — kořeny + biomasa
  - **Suprese plevelů** — hořčice rychle pokryje půdu
  - **Glukosinoláty v půdě** — biofumigace (potlačuje patogeny)
  - **EU CAP greening** — hořčice = EFA (Ecological Focus Area)
- **Cena osiva pro meziplodinu**: 600–1 000 Kč/ha

**3. Olej (5 %):**
- **Hořčicový olej** — specifický východoevropský kulinářský olej (NL, Polsko)
- **V CZ vzácné**

**4. Krmivo (5 %):**
- **Hořčicový šrot** (po lisování oleje) — pro skot
- **Pozor**: glukosinoláty mohou způsobit problémy u prasat

**Cena 2024:**
- **Hořčicové semeno**: 13 000–18 000 Kč/t
- **Bio hořčice**: 18 000–25 000 Kč/t (Hellmann's bio kontrakt)

**Odrůdy CZ 2024:**
- **Veronica** — výnosná
- **Severka** — robustní
- **Andromeda** — moderní

**Choroby a škůdci:**
- **Stejné jako řepka** ale méně tlaku (krátká vegetace)
- **Blýskáček řepkový** (*Meligethes aeneus*) — žírá pukláky
- **Plíseň brukvovitých** (*Peronospora parasitica*) — minimální tlak

**Výhody hořčice:**
1. **Krátká vegetace** — flexibilní v osevním postupu
2. **Levné osivo**
3. **Meziplodina hodnota** — EFA, zelené hnojení, biofumigace
4. **Robustní** — málo postřiků

**Nevýhody:**
1. **Nízký výnos** (1–2 t/ha vs 8 t/ha pšenice)
2. **Marginální plocha** pro semeno
3. **Cenová volatilita** — citlivá na poptávku potravinářského průmyslu

**Ekonomika:**

**Pro semeno (1,3 t/ha × 15 000 Kč = 19 500 Kč/ha):**
- **Náklady**: 12 000–15 000 Kč/ha
- **Marže**: 4 500–7 500 Kč/ha (mírná)
- **Plus dotace**: standardní BISS + CISS

**Pro meziplodinu:**
- **Náklady**: 1 000–1 500 Kč/ha (osivo + setí)
- **Benefity**: EFA dotace ~3 000 Kč/ha + půdní benefity neměřitelné finančně
- **Net pozitivní**: 1 500–2 000 Kč/ha (jen dotace), plus dlouhodobé benefity

**EU a CAP:**
- **Meziplodinová schémata** dotované — hořčice je nejpopulárnější
- **EFA limity** — minimálně 5 % plochy v EFA pro CAP (greening)

**Klimatická změna:**
- **Sucho v letní** → meziplodina nevejde
- **Mírné podzimy** → delší vegetace = větší biomasa

Viz též [[mezi-plodiny]], [[repka-ozima]], [[ozim-jarin]], [[regenerativni-zemedelstvi]], [[osevni-postup]].`,
    related: ['mezi-plodiny', 'repka-ozima', 'ozim-jarin', 'regenerativni-zemedelstvi', 'osevni-postup'],
  },
  {
    slug: 'cukrovka',
    term: 'Cukrová řepa',
    alias: ['sugar beet', 'Beta vulgaris', 'cukrovka'],
    kategorie: 'plodiny',
    shortDef: 'Cukrová řepa (Beta vulgaris) je jarní okopanina pěstovaná pro výrobu cukru. CZ plocha 60 000–70 000 ha. Výnos 60–80 t/ha bulvy, cukernatost 17–20 %. Cena 1 100–1 600 Kč/t (záleží na cukernatosti). Smluvní pěstování pro cukrovary.',
    longDef: `Cukrová řepa (lat. *Beta vulgaris* var. *altissima*, ang. *sugar beet*) je **jarní okopanina** pěstovaná pro **výrobu cukru** (sacharóza). Bulva obsahuje 17–20 % cukru. CZ dlouhá tradice (od 19. století), oblast: Polabí, Středočesko, Haná.

**Plocha v ČR 2024**: 60 000–70 000 ha
**Produkce**: 4–5 mil. t bulvy → 600 000–750 000 t cukru

**Vlastnosti:**

**Agrotechnika:**

**Setí:**
- **Termín**: 20. března – 20. dubna
- **Hloubka**: 2–3 cm
- **Hustota**: 8–10 rostlin/m² (rozteč 45 × 18 cm)
- **Klíčové**: precision setí (každé semínko počítá, drahé osivo)

**Hnojení:**
- **Při setí**: 100–130 kg N/ha (cukrovka je „N hladová")
- **Celkem N**: 130–180 kg/ha
- **Bor (B)** — kritický pro tvorbu cukru, 2–4 kg/ha
- **Sodík (Na)** — atypicky pozitivní efekt na výnos
- **Hnůj v předplodině** — cukrovka miluje organickou hmotu

**Ochrana:**
- **Plevele**: 3–4 postřiky (Goltix + Betanal + Pyramin) — drahý program
- **Insekticidy**: mšice řepná (BYV vektor, viz [[msice-repna]])
- **Fungicidy**: 1–2 postřiky (Cercospora, padlí)

**Sklizeň:**
- **Termín**: září–listopad (úvod kampaně)
- **Sklízeč řepy** — Holmer Terra Dos, Ropa euro-Tiger — 6-řádkový samojízdný (50–80 t/h)
- **Tzv. „kampaň"**: říjen–prosinec, cukrovary jedou 24/7

**Výnosy:**
- **Průměr CZ**: 70 t/ha bulvy
- **Top farmy**: 90+ t/ha
- **Cukernatost**: 17–20 % (vyšší = vyšší cena!)

**Cena 2024 (smluvní):**
- **Standardní cukrovka** (17 % cukru): 1 200 Kč/t
- **High sugar** (19 % cukru): 1 500 Kč/t
- **Bonus za biopaliva** (kontrakt na bioethanol): +50–100 Kč/t

**Smluvní pěstování:**

**Cukrovary CZ:**
- **Cukrovary Hradec Králové** (skupina Tereos) — Polabí
- **Moravskoslezské cukrovary** (Litovel, Vrbátky) — Haná
- **Tereos TTD** — Dobrovice (Polabí)
- **Pfeifer & Langen** (Český Meziříčí)

**Kontrakt** mezi farmou a cukrovarem:
- **Plocha + odhad výnosu** = množstevní závazek
- **Cena**: garantovaná za %cukru + bonusy
- **Doprava**: cukrovar často zajišťuje
- **Předpolnost**: někdy 3-5 let dopředu

**Produkty z cukrovky:**
1. **Cukr (50 %)** — hlavní produkt
2. **Melasa (15 %)** — kvasinky, krmivo, líh
3. **Řízky (30 %)** — krmivo skotu (vlhké nebo sušené, peletované)
4. **Hlína a list** (5 %) — kompost

**Odrůdy CZ 2024:**
- **KWS odrůdy** (Marleen, Cantona) — dominantní
- **Strube** (Salamando, Rosagold) — alternativa
- **Klein-Wanzlebener** — tradiční german

**Choroby:**
- **Cercospora beticola** — listová skvrnitost, vážná ztráta cukernatosti
- **Padlí řepné** (Erysiphe betae) — listy
- **Rhizoctonia** — kořenová hniloba
- **BYV virus** přenášený mšicemi — viz [[msice-repna]]

**Škůdci:**
- **Mšice řepná** (Aphis fabae) — vektor BYV
- **Dřepčíci** (Chaetocnema) — listy
- **Plžík polní** (Deroceras) — listy

**Ekonomika:**

**Náklady na 1 ha** (cukrovka je „drahá" plodina):
- **Osivo**: 8 000–12 000 Kč/ha (precision sety, drahé pelletované)
- **Hnojiva**: 6 000–8 000 Kč/ha
- **Postřiky**: 10 000–15 000 Kč/ha (3-4 herbicidní postřiky)
- **Sklizeň**: 3 000–5 000 Kč/ha (vlastní sklízeč nebo služba)
- **Doprava**: 2 000–4 000 Kč/ha
- **Práce a režie**: 6 000–10 000 Kč/ha
- **Celkem**: 35 000–55 000 Kč/ha

**Výnos**: 70 t/ha × 1 300 Kč = 91 000 Kč/ha
**Marže**: 35 000–55 000 Kč/ha (ATRAKTIVNÍ!)

**Plus dotace**:
- **BISS + CISS**: ~3 600 Kč/ha
- **VCS pro cukrovku** (citlivý sektor): ~7 500 Kč/ha (specifická CZ dotace pro cukrovku!)
- **EKO režim**: pokud splní podmínky

**Trend a budoucnost:**
- **EU cukrová kvóta** zrušená 2017 → liberalizace trhu → tlak na cenu
- **CZ klesající plocha** (z 100 000 ha v 1990s na 60 000 ha dnes)
- **Bioethanol** — alternativní použití pro cukrovku (EU RED II)
- **Klimatická změna** — vyšší teploty + sucho = nižší výnos v Polabí

**Strategická plodina:**
- **VCS dotace** dělá z cukrovky **velmi profitabilní volbu** v cukrovkářských regionech
- **Mimo VCS regiony** méně atraktivní (sucho na Vysočině nelegální)

Viz též [[msice-repna]], [[ozim-jarin]], [[osevni-postup]], [[fungicidy]], [[hnojivo]].`,
    related: ['msice-repna', 'ozim-jarin', 'osevni-postup', 'fungicidy'],
  },
  {
    slug: 'hrach-set',
    term: 'Hrách setý',
    alias: ['pea', 'Pisum sativum', 'jarní hrách'],
    kategorie: 'plodiny',
    shortDef: 'Hrách setý je jarní luskovina pěstovaná pro semeno (zrnový hrách) nebo zelený lusk (konzumní hrášek). CZ plocha 10 000–20 000 ha. Výnos 3–5 t/ha semen, cena 6 500–8 500 Kč/t. Klíčová pro fixaci N (50–100 kg N/ha) a osevní postup po obilovinách.',
    longDef: `Hrách setý (lat. *Pisum sativum*, ang. *field pea*) je **jarní luskovina** s klíčovými agronomickými benefity: **fixace dusíku** symbiózou s *Rhizobium leguminosarum* (50–100 kg N/ha) a zlepšení struktury půdy. Hlavní použití: krmivo (zrnový hrách), lidská konzumace (zelený hrášek), průmyslové aplikace.

**Plocha v ČR 2024**: 10 000–20 000 ha (rostoucí trend kvůli plant-based proteinům + EU bílkovinné strategii)

**Typy hrachu:**

**1. Zrnový hrách** (95 % CZ plochy):
- **Sklizeň**: srpen, zrno suché
- **Použití**: krmivo, lidská strava (loupaný hrach)
- **Výnos**: 3–5 t/ha

**2. Konzervárenský hrášek** (5 %):
- **Sklizeň**: zelený lusk, červen–červenec
- **Použití**: konzervy (Boncourier), mražené (Bonduelle)
- **Smluvní pěstování** pro konzervárny
- **Výnos**: 5–8 t/ha zeleného lusku

**Agrotechnika:**

**Setí:**
- **Termín**: 20. března – 15. dubna (raně setí — chladu odolný)
- **Hloubka**: 4–6 cm (hluboce, kvůli sucho-toleranci kořenů)
- **Hustota**: 80–120 klíčivých zrn/m² (= 200–280 kg osiva/ha, HW 250g)

**Hnojení:**
- **Žádný N hnojivý!** — hrach si fixuje vlastní (symbióza)
- **P + K**: 40 P + 80 K + Mg
- **Inokulace osiva** Rhizobium leguminosarum bivar. *viceae* = klíčové (zejm. na poli, kde hrach 5+ let nebyl)

**Ochrana:**
- **Plevele**: pre-emergence (Stomp, Bicarb) + post-emergence (Basagran, Pulsar)
- **Insekticidy**: zrnokaz hrachový (Bruchus pisorum), mšice
- **Fungicidy**: bílá hniloba *Sclerotinia*, plíseň hrášku (Mycosphaerella pisi)

**Sklizeň zrnového hrachu:**
- **Termín**: konec července–srpen, vlhkost 14 %
- **Desikace** (viz [[desikace]]): glyfosát 7–10 dní před sklizní (vyrovnání dozrání)
- **Kombajn**: standardní žací mech, ale opatrně (zrno lehce vypadá)

**Výnosy:**
- **Průměr CZ**: 3,8 t/ha zrnového hrachu
- **Top farmy**: 5,5+ t/ha
- **Konzervárenský**: 6 t/ha zelený

**Použití:**

**1. Krmivo (60 %):**
- **Pro prasata**: hlavní bílkovinná složka (CP 23–26 %)
- **Pro skot**: alternativa SES (sojový extrahovaný šrot)
- **Pro drůbež**: do 20 % směsi
- **Nutriční hodnoty**: CP 24 %, NEL 8,2 MJ/kg, vysoký škrob

**2. Lidská konzumace (25 %):**
- **Loupaný hrách** — polévky, omáčky (česká kuchyně)
- **Hráškové vločky / mouka** — plant-based proteiny
- **Konzervovaný / mražený hrášek** — zelenina
- **Pea protein** — hojně používaný v plant-based produktech (Beyond Meat, Impossible)

**3. Průmysl (10 %):**
- **Pea protein izolát** — 80 %+ čistota, premium plant-based ingredient
- **Cena pea protein**: 80 000–150 000 Kč/t (10× vs zrno)
- **EU dotuje** plant-based proteinovou strategií

**4. Bio paliva (5 %):**
- **Hrachovou ethanol** — vedlejší možnost, marginální

**Cena 2024:**
- **Krmný zrnový hrach**: 6 500–8 000 Kč/t
- **Potravinářský hrach** (loupaný): 9 000–12 000 Kč/t
- **Konzervárenský** (smluvní zelený): 4 500–6 000 Kč/t bruto

**Odrůdy CZ 2024:**
- **Eso, Madonna** — bílé květy, krmné, top výnos
- **Bohatýr** — robustní
- **Salamanca** — krátká stéblo (méně polehnutí)

**Agronomické benefity (klíčové!):**
1. **N fixace**: 50–100 kg N/ha + reziduální N pro následující plodinu (typicky pšenice po hrachu)
2. **Rozrušení monokultur**: brukvovité a obiloviny mají úplně jiné patogeny — hrach je „čistič" osevního postupu
3. **Struktura půdy**: hluboké kořeny rozrušují utuženou půdu
4. **Sekvestrace C**: vyšší organická hmota v půdě po luskovině

**Ekonomika:**

**Náklady na 1 ha:**
- Osivo: 4 500–6 000 Kč
- Hnojiva: 2 000–3 000 Kč (jen P + K)
- Postřiky: 4 000–6 000 Kč
- Sklizeň + doprava: 3 000–4 000 Kč
- Celkem: 13 500–19 000 Kč/ha

**Výnos**: 4 t × 7 200 Kč = **28 800 Kč/ha**
**Marže**: 9 800–15 300 Kč/ha (atraktivní!)
**Plus N pro následující plodinu**: ušetří 60–80 kg N (~1 200–1 600 Kč/ha)

**EU Bílkovinná strategie:**
- **EU CAP** od 2023 podporuje **bílkovinné plodiny** (hrach, sója, lupina, peluška, vikve, fazol)
- **VCS pro bílkoviny**: ~2 800 Kč/ha
- **EU cíl**: zvýšit domácí produkci bílkovin z 30 % na 50 % do 2030

**Klimatická změna:**
- **Mírné jaro** = pozitivní
- **Sucho v květnu–červnu** = negativní (kvetení a tvorba lusků)
- **Mokrá léta** = polehnutí, plíseň

**Strategický význam:**
- **Hrach v osevním postupu** = klíč pro **udržitelnou intenzifikaci**
- **Plant-based proteiny** = rostoucí trh = vyšší cena
- **EU bílkovinná podpora** = dotace navíc

Viz též [[sojaova-bob]], [[vojteska]], [[osevni-postup]], [[mezi-plodiny]], [[ozim-jarin]], [[regenerativni-zemedelstvi]].`,
    related: ['sojaova-bob', 'vojteska', 'osevni-postup', 'mezi-plodiny', 'ozim-jarin', 'regenerativni-zemedelstvi'],
  },
  {
    slug: 'len-set',
    term: 'Len setý',
    alias: ['flax', 'Linum usitatissimum', 'olejný len', 'přadný len'],
    kategorie: 'plodiny',
    shortDef: 'Len setý je dvojí plodina — olejný len pro semínko a lněný olej, přadný len pro vlákno (lněné plátno). CZ plocha 1 500–3 000 ha (klesající). Výnos olejného 1,5–2,5 t/ha semen, cena 12 000–17 000 Kč/t. Historicky klíčový (vlaké plátno do 1900s).',
    longDef: `Len setý (lat. *Linum usitatissimum*, ang. *flax*) je **jarní plodina dvojího použití**:
1. **Olejný len** — semínko pro lněný olej (omega-3), pekařské semínko
2. **Přadný len** — stéblo pro lněné vlákno (textil)

V CZ klesající tradice — z 100 000+ ha v 1950s na ~1 500–3 000 ha dnes.

**Historie:**
- **Tisíciletí** — len je jedna z nejstarších kulturních rostlin (egyptské mumie, biblické zmínky)
- **Středověk** — lněné plátno = standardní textil v EU
- **18.–19. století** — vrchol pěstování v CZ (Krkonoše, Jeseníky lněné centra)
- **20. století** — bavlna a synthetika vytlačily lněné plátno
- **1950s vrchol CZ** — 120 000 ha (státem dotované)
- **2020s** — niche plodina

**Vlastnosti:**

**Olejný len (95 % CZ ploch):**

**Setí:**
- **Termín**: 25. března – 20. dubna
- **Hloubka**: 2–3 cm
- **Hustota**: 600–800 klíčivých zrn/m² (drobné semínko)

**Hnojení:**
- **N**: 60–80 kg/ha
- **P + K**: standardní

**Ochrana:**
- **Plevele**: post-emergence (Lontrel, Basagran)
- **Insekticidy**: dřepčíci, mšice — pyrethroid
- **Fungicidy**: bílá hniloba (Sclerotinia), plíseň lnu — 1 postřik

**Sklizeň:**
- **Termín**: konec července–srpen
- **Vlhkost zrna**: 9–12 %
- **Kombajn**: standardní
- **Výnos**: 1,5–2,5 t/ha semen

**Použití olejného lnu:**

**1. Lněné semínko (potravinářské):**
- **Celé nebo mleté semínko** — do pečiva, müsli, jogurtů
- **Vysoký obsah omega-3** (ALA — alfa-linolenová kyselina)
- **Vláknina** — pozitivní pro trávení
- **Cena potravinářské semínko**: 18 000–25 000 Kč/t

**2. Lněný olej:**
- **Lisování** semen
- **Kulinářský**: salát, müsli (ne smažení — nestabilní)
- **Léčebný**: omega-3 doplněk
- **Cena**: 250–400 Kč/100ml v retailu

**3. Krmivo:**
- **Lněný šrot** (po lisování oleje) — krmivo pro skot, koně
- **Vysoký obsah olejnatých látek** — lesklá srst koní

**4. Průmysl:**
- **Lněný olej technický** (sušící olej) — pro nátěry, lakové výrobky, linoleum
- **Linoleum** etymology: linum oleum = lněný olej

**Přadný len (5 % CZ ploch):**

**Specifický pro vlákno:**
- **Hustší setí** (1 500 zrn/m²) — tenké, dlouhé stéblo
- **Kratší vegetace** — sklizeň v červenci
- **Rosení** (retting) — stěbla se nechají na poli rosit 14 dní, aby pektin se rozložil
- **Lámání + tření** — uvolnění vlákna
- **Vlákno** — pro lněné plátno (linen, batist, kambrik)

**Lněné plátno**:
- **Premium materiál** — luxusní oblečení, ručníky, ubrusy
- **Belgium + France** = EU lněné centrum (80 % EU produkce)
- **CZ marginální** — odvozené průmyslové dějiny zaniky

**Cena 2024:**
- **Olejný len** krmný: 12 000–14 000 Kč/t
- **Olejný len** potravinářský: 18 000–25 000 Kč/t
- **Bio olejný len**: 28 000–35 000 Kč/t (premium pro bio müsli)

**Odrůdy CZ 2024:**
- **Lola** — olejný, top výnos
- **Recital** — robustní
- **Niagara** — přadný (Belgické import)

**Choroby:**
- **Bílá hniloba** (Sclerotinia) — vlhká léta
- **Plíseň lnu** (Botrytis) — sezónní
- **Lnu rzi** (Melampsora) — málo

**Ekonomika olejného lnu:**

**Náklady na 1 ha**:
- Osivo: 1 500–2 500 Kč
- Hnojiva: 2 500–3 500 Kč
- Postřiky: 3 000–5 000 Kč
- Sklizeň: 2 500–3 500 Kč
- Celkem: 9 500–14 500 Kč/ha

**Výnos**: 2 t × 14 000 Kč = **28 000 Kč/ha**
**Marže**: 13 500–18 500 Kč/ha (atraktivní pro niche!)

**Strategický význam:**
- **Niche plodina** s vysokou marží
- **Plant-based omega-3** trend = rostoucí poptávka
- **Bio kontrakty** pro pekařský průmysl

**Klimatická změna:**
- **Sucho v květnu–červnu** = pozitivní (len nesnáší vlhko)
- **Mírná léta** = ideální
- **Mokrá léta** = bílá hniloba

**Renaissance lnu?**
- **Plant-based food** trend = trh roste
- **Lokální producenti** mohou cílit na premium pekařský trh
- **Bio kontrakty** pro Hipp, Bauer dětskou výživu

Viz též [[ozim-jarin]], [[sojaova-bob]], [[mak-ozimy]], [[osevni-postup]].`,
    related: ['ozim-jarin', 'mak-ozimy', 'osevni-postup'],
  },

  // ── CHOV — POKROČILÉ KONCEPTY ─────────────────────────────────────
  {
    slug: 'mastitida',
    term: 'Mastitida',
    alias: ['mastitis', 'zánět vemene', 'mléčný zánět'],
    kategorie: 'chov',
    shortDef: 'Mastitida je zánět mléčné žlázy (vemene) dojnice, typicky bakteriální. Nejvýznamnější zdravotní problém mléčných farem — způsobuje 30 % ekonomických ztrát chovu. Diagnostika: somatické buňky v mléce (SCC) >200 000/ml = subklinická, >500 000/ml = klinická.',
    longDef: `Mastitida (lat. *mastitis*, řec. *mastos* = vemeno) je **zánět mléčné žlázy** dojnice. Nejvýznamnější zdravotní problém mléčného chovu — způsobuje **30 % ekonomických ztrát** (snížená produkce, antibiotika, vyřazené krávy).

**Typy:** klinická (vizuální příznaky, vyžaduje léčbu) vs subklinická (jen SCC >200 000/ml, většina případů). Klíčové patogeny: kontagiózní (*Staphylococcus aureus*, *Streptococcus agalactiae*) a environmentální (*E. coli*, *Streptococcus uberis*, *Klebsiella*).

**Měření SCC:**
- <100 000/ml = zdravé
- 200–500 000/ml = subklinická
- >500 000/ml = klinická
- **EU limit pro výkup mléka**: <400 000/ml

**Léčba klinické mastitidy:**
- **Intramammární antibiotika** (Mastijet, Cefa Safe) — 3 dny do napadené čtvrtě
- **Systémová** (Penicilin G IM, Cefquinome) pro vážné případy
- **Anti-inflammatory** (ketoprofen, meloxicam)
- **Withdraval period**: mléko 3–5 dní, maso 14–30 dní
- **Cena léčby**: 500–1 500 Kč + 1 500–3 000 Kč ztracené mléko

**Prevence (klíčové):**
1. **Hygiena dojení**: pre-dip + sušení sterilním ručníkem (per krávu!) + post-dip
2. **Dry-cow therapy**: intramammární antibiotika + teat sealant při zaprahnutí
3. **Suchá podestýlka**: sláma, dřevěné hobliny, písek
4. **Genetika**: výběr býků s nízkým SCC ve potomstvu
5. **TMR** (viz [[tmr]]): vyvážená výživa, selén + vit. E

**Ekonomický dopad:**
- Náklady na 1 klinickou mastitidu: 4 000–11 500 Kč
- Stádo 100 krav: 300 000–800 000 Kč/rok ztráty
- Dobrý management snižuje mastitidu o 50–70 % = velký ROI

Viz též [[oteleni]], [[dojirna]], [[ku-kontrola-uzitkovosti]], [[tmr]], [[bcs-body-condition]], [[transition-period]].`,
    related: ['oteleni', 'dojirna', 'tmr', 'krmne-davky'],
  },
  {
    slug: 'bcs-body-condition',
    term: 'BCS (Body Condition Score)',
    alias: ['Body Condition Score', 'tělesný kondiční skór'],
    kategorie: 'chov',
    shortDef: 'BCS je vizuální hodnocení tělesné kondice skotu na škále 1–5 (USA) nebo 1–9. Klíčový management nástroj — optimální BCS mléčné krávy při otelení 3,25–3,75. Příliš tlustá = dystocie + ketóza; příliš hubená = nízká produkce a fertilita.',
    longDef: `BCS (Body Condition Score) je **vizuální subjektivní hodnocení tělesné kondice (tuku)** hospodářských zvířat. Klíčový management nástroj pro mléčný + masný skot, ovce, kozy, prasata.

**Škála USA (Wildman, 1982):**
- 1: extrémně vyhublá
- 2: hubená
- 3: ideální mléčná kráva
- 4: tlustá
- 5: extrémně tlustá
- Krokem 0,25

**Optimální BCS — mléčná kráva (Holstein):**

| Stadium | BCS |
|---------|-----|
| Otelení | 3,25–3,75 |
| 30 dní po otelení | 2,75–3,00 (přípustný pokles) |
| Vrchol laktace (100 dní) | 2,75–3,00 |
| 200 dní | 3,00–3,25 |
| Zaprahnutí | 3,25–3,75 |

**Hodnocení**: páteř, kostnaté výběžky, krátká žebra, sedací hrbol, ocasní rýha. Vizuálně + palpace.

**Důsledky chybného BCS:**

**Příliš nízký (<2,5 při otelení):**
- Nízká produkce, ketóza, slabší imunita, pozdní říje (viz [[rijnost]])

**Příliš vysoký (>4,0 při otelení):**
- Dystocie (viz [[oteleni]]), fatty liver, retentio placentae, ketóza, snížený příjem krmiva

**Důležité pravidlo**: ztráta >1,0 BCS v prvních 60 dnech = riziko (ketóza, nízká fertilita).

**Software pro automatickou BCS:**
- **CowManager**, **DeLaval BCS Camera** — kamera + AI hodnocení
- 200 000–500 000 Kč instalace
- Denní BCS každé krávy bez manuální práce

**Ekonomický dopad**: stádo s optimálním BCS managementem má o 200–500 l mléka/kráva/rok víc → pro 100 krav = 220 000–550 000 Kč/rok.

Viz též [[oteleni]], [[rijnost]], [[mastitida]], [[ku-kontrola-uzitkovosti]], [[tmr]], [[transition-period]].`,
    related: ['oteleni', 'rijnost', 'mastitida', 'tmr'],
  },
  {
    slug: 'ku-kontrola-uzitkovosti',
    term: 'Kontrola užitkovosti (KU)',
    alias: ['KU', 'DHIA', 'milk recording'],
    kategorie: 'chov',
    shortDef: 'Kontrola užitkovosti je systematický monitoring produkce a kvality mléka dojnic. V CZ zajišťuje Český svaz chovatelů — 1× měsíčně analýza mléka per kráva (množství, tuk, bílkoviny, SCC, urea). Klíčové pro selekci, zdraví a šlechtění.',
    longDef: `Kontrola užitkovosti (KU, anglicky *DHIA — Dairy Herd Improvement Association*, *milk recording*) je **systematický monitoring produkce a kvality mléka jednotlivých dojnic** přes plemenářské služby. V CZ zajišťuje **Český svaz chovatelů**.

**Princip:**
- 1× měsíčně technik na farmu
- Vzorky mléka z každé krávy (ranní + večerní dojení)
- Analýza v akreditované laboratoři
- Výsledky zpracuje svaz + plemenná kniha (viz [[plemenna-kniha]])

**Měřené parametry:**

| Parametr | Holstein optimum |
|----------|------------------|
| Množství | 25–40 kg/den |
| Tuk | 3,8–4,2 % |
| Bílkoviny | 3,2–3,5 % |
| SCC | <200 000/ml |
| Urea | 15–30 mg/100 ml |
| Laktóza | 4,8–5,0 % |

**Použití KU dat:**

**1. Selekce krav:**
- Top 25 % → sexed semen (zaručené jaločky pro chov)
- Bottom 25 % → masná genetika nebo prodej

**2. Diagnostika:**
- Vysoké SCC → mastitida (viz [[mastitida]])
- Nízké bílkoviny → změna TMR (viz [[tmr]])
- Vysoké urea → snížit CP v dietě
- Pokles produkce → vyšetření

**3. Plemenná hodnota:**
- KU data jdou do plemenné knihy
- Top býky vybráni z výsledků jejich dcer

**Účast:**
- ~60–70 % mléčných farem v CZ
- Vysoká užitkovost (>10 000 kg/laktace) téměř 100 % v KU

**Cena:**
- 150–250 Kč/krávu/měs.
- Stádo 100 krav: 180 000–300 000 Kč/rok
- ROI: 500–1 500 Kč/kráva/rok zisk z lepší selekce

**Digitalizace:**
- AMS (Lely, DeLaval) ukládá data každého dojení
- In-line analyzery měří tuk/bílkoviny v reálném čase
- Trend: AMS data mohou nahradit klasickou KU

Viz též [[plemenna-kniha]], [[mastitida]], [[bcs-body-condition]], [[oteleni]], [[dojirna]], [[inseminace]].`,
    related: ['plemenna-kniha', 'mastitida', 'bcs-body-condition', 'dojirna'],
  },
  {
    slug: 'plemenna-kniha',
    term: 'Plemenná kniha',
    alias: ['herd book', 'plemenná evidence'],
    kategorie: 'chov',
    shortDef: 'Plemenná kniha je oficiální registr čistokrevných zvířat plemene s rodokmenem a plemennou hodnotou. Vede ji uznaná plemenářská organizace (v CZ Český svaz chovatelů). Klíčový nástroj šlechtění, EU dotací a obchodu s genetikou.',
    longDef: `Plemenná kniha (něm. *Herdbuch*, ang. *herd book*) je **oficiální registr čistokrevných zvířat plemene** spravovaný uznanou plemenářskou organizací. Obsahuje rodokmen, plemennou hodnotu, vlastnosti a původ. Klíčový nástroj šlechtění a EU dotací.

**Historie:**
- 1791 — první (British Thoroughbred koně)
- 1822 — první pro skot (Shorthorn UK)
- 1872 — Holstein-Friesian Herd Book (NL/DE)
- 1898 — Český svaz chovatelů založen

**Sekce:**
- **A (čistokrevné)**: otec + matka registrovaní, ≥7/8 čistokrevnosti
- **B (upgrade)**: cesta k sekci A přes 2–3 generace
- **C (foundation)**: jen matka registrovaná, 50 % čistokrevnosti

**Co eviduje:**

1. **Identifikace**: ušní známka (viz [[usni-znamka]]), jméno, datum, plemeno
2. **Rodokmen**: 4 generace dozadu (8 předků)
3. **Vlastnosti**: produkce, plemenné hodnoty (PV/EBV), tělesný typ
4. **Reprodukce**: inseminace, otelení, mezidoba
5. **Zdraví**: mastitidy, veterinární zákroky, vyřazení

**Plemenná hodnota (PV):**

Klíčové indexy:
- **TPI** (Total Performance Index — USA Holstein)
- **NM$** (Net Merit dollars — ekonomický)
- **RZG** (Relativzuchtwert Gesamt — DE/AT Holstein)
- **NORD** (Severský index)
- **CZECH SIH** (CZ celkový index Holstein)

**Genomické hodnocení (2009+):**
- DNA testy mladých zvířat
- Predikce plemenné hodnoty bez čekání na dcery
- 10 000+ testů/rok v CZ

**Mezinárodní výměna:**
- **Interbull** — koordinace přes 30+ zemí
- ČR importuje 60 % semene (USA, Kanada, NL, DK)

**CZ plemenářské organizace:**
- **ČSCH** — Holstein, černo strakatý
- **Svaz chovatelů masného skotu** — Charolais, Limousin, Aberdeen Angus
- **Plemenáři Lhota, Bohemia Plus** — inseminační stanice

**Plemena v CZ:**
- Mléčné: Holstein (#1, 70 %), Český strakatý (20 %), Jersey, Montbéliarde
- Masná: Charolais, Limousin, Aberdeen Angus, Hereford, Simmental, Belgické modré

**Ekonomická hodnota:**
- Čistokrevná top jalovice: 50 000–250 000 Kč
- Top býk pro inseminaci: 500 000+ Kč
- Embryotransfer top genetiky: 50 000–500 000 Kč
- World Dairy Expo Grand Champion: 1+ mil. USD

Viz též [[ku-kontrola-uzitkovosti]], [[inseminace]], [[jalovice]], [[bcs-body-condition]], [[f1-hybrid]], [[usni-znamka]].`,
    related: ['ku-kontrola-uzitkovosti', 'inseminace', 'jalovice', 'usni-znamka', 'f1-hybrid'],
  },
  {
    slug: 'kolostrum-mlezivo',
    term: 'Kolostrum (mlezivo)',
    alias: ['colostrum', 'mlezivo', 'první mléko'],
    kategorie: 'chov',
    shortDef: 'Kolostrum (mlezivo) je první mléko krávy po otelení — bohaté na imunoglobuliny (IgG). Telete musí dostat 4 litry kolostra do 6 hodin po porodu pro pasivní imunitu. Bez kolostra: 30–50 % úmrtnost telat v prvních týdnech.',
    longDef: `Kolostrum (lat. *colostrum*, čes. *mlezivo*) je **první mléko krávy** po otelení. Klíčové pro **přežití telete** — narozené tele nemá vrozenou imunitu (placenta krávy je nepropustná pro protilátky), kolostrum je jediný zdroj **pasivní imunity**.

**Složení kolostrum vs mléko:**

| Komponent | Kolostrum | Mléko (den 3+) |
|-----------|-----------|----------------|
| Sušina | 23–28 % | 12–13 % |
| Bílkoviny | 14–18 % | 3,3 % |
| Tuk | 6–7 % | 4 % |
| IgG | 60–120 g/l | 0,5–1 g/l |
| Vitamín A | 10× vyšší | běžný |

**Kritické okno absorpce:**
- 0–6 h po porodu: 100 % absorpce IgG (= nejvyšší)
- 6–12 h: 60 % absorpce
- 12–24 h: 30 % absorpce
- 24+ h: <10 % absorpce (sliznice "zavřela")

**Doporučení:**

**1. první dávka (kritická):**
- **4 litry kolostra do 6 hodin** po porodu
- Bud matčiným (pokud zdravá), nebo pasterizovaným zásobním
- Aplikace: lahev nebo drench tube (sonda)

**2. Druhá dávka:**
- 2 litry za 6–12 h

**3. Den 2–3:**
- Postupný přechod na běžné mléko nebo náhražku

**Kvalita kolostra:**

**Test (Brix refraktometr):**
- >22 % Brix = vysoká kvalita (>60 g IgG/l)
- 18–22 % Brix = střední
- <18 % Brix = nízká (nutné doplnit)

**Faktory kvality:**
- Plemeno: Jersey > Holstein (vyšší IgG)
- Pořadí laktace: starší krávy mají vyšší IgG
- Doba dojení: první dojení = nejvyšší IgG
- Hygiena: čistá vemena → nižší kontaminace

**Pasterizace:**
- 60 °C × 60 min
- Účel: zničit *Mycoplasma bovis*, *Salmonella*, *Mycobacterium avium* (Johne's)
- Nesnižuje IgG významně (-10 %)
- Pasterizér: 100 000–300 000 Kč

**Zmrazení:**
- Kvalitní kolostrum top krav zmrazeno (-20 °C, plastové sáčky 2 l)
- Skladovatelnost: 12 měsíců
- Rozmrazení: 40 °C vodní lázeň, max 60 min

**Pasivní imunita selhání (FPT):**
- 20–30 % telat (mezinárodní průměr)
- Symptomy: průjem, pneumonie v 1.–4. týdnu
- Diagnostika: STP (Total Protein) v krvi telete 2.–7. den — <5,0 g/dl = FPT

**Ekonomický dopad:**

**Bez kvalitního kolostra:**
- 30–50 % úmrtnost (vs 5–10 %)
- Léčba: 1 000–3 000 Kč/telete
- Ztracené tele: 8 000–60 000 Kč hodnoty

**S managementem:**
- Lepší růst, lepší produkce v dospělosti (epigenetický efekt)

Viz též [[oteleni]], [[jalovice]], [[mastitida]], [[transition-period]], [[dojirna]].`,
    related: ['oteleni', 'jalovice', 'mastitida', 'transition-period', 'dojirna'],
  },
  {
    slug: 'transition-period',
    term: 'Tranzitní období',
    alias: ['transition period', 'přechodné období dojnice'],
    kategorie: 'chov',
    shortDef: 'Tranzitní období je 3 týdny před a 3 týdny po otelení = 6 týdnů kritického zdravotního a metabolického přechodu krávy. 70 % všech zdravotních problémů vzniká v tomto okně. Klíč: TMR design, BCS management, prevence ketózy + hypokalcémie.',
    longDef: `Tranzitní období (anglicky *transition period*) je **3 týdny před a 3 týdny po otelení** = **6 týdnů kritického přechodu** mléčné krávy mezi suchým obdobím a aktivní laktací. **70 % všech zdravotních problémů** mléčné krávy vzniká právě v tomto okně.

**Hlavní zdravotní rizika:**

**1. Mléčná horečka (hypocalcémie):**
- Ca v krvi <8 mg/dl (norma 8,5–10,5)
- Klinická: 3–8 % krav, paralýza, ležení
- Subklinická: 25–50 % krav (snižuje produkci, imunitu)
- Léčba: kalciumglukonát IV
- Prevence: anionická směs předporodu (DCAD <0)

**2. Ketóza:**
- Negativní energetický balanc (NEB) → mobilizace tuku → ketolátky
- Subklinická: 30–50 % krav (BHB >1,2 mmol/l)
- Klinická: 5–10 % (BHB >3 mmol/l, anorexie, dech aceton)
- Léčba: propylenglykol, glukóza IV
- Prevence: monensin (Kexxtone), cholin, postupné navýšení TMR

**3. Retentio placentae:**
- 5–10 % otelení (vyšší u twins, dystocie)
- Komplikace: metritis → snížená fertilita

**4. Metritida (zánět dělohy):**
- Akutní (pyometra) i chronická (endometritida)
- Léčba: antibiotika + PGF₂α

**5. Posunutí slezu (DA):**
- LDA (levostranné): 95 %, 2–4 týdny po porodu
- Léčba: chirurgické vrácení (5 000–15 000 Kč)

**6. Mastitida** (viz [[mastitida]]):
- Imunitní suprese zvyšuje riziko

**Management:**

**3 týdny před otelením (Close-up Dry):**

TMR design:
- **Anionická směs** (DCAD <0): kyselejší tělo → lepší Ca mobilizace
- Energie: 6,5–7,0 MJ NEL/kg DM
- CP: 14–15 %
- NDF: 32–35 %
- Cíl: udržet vysoký příjem krmiva

Sledování:
- BCS (3,25–3,5, viz [[bcs-body-condition]])
- Příjem krmiva denně
- Aktivita

**Den otelení + první 3 dny:**

- Suchá, čistá telící boxa (12+ m²)
- Veterinární dohled
- Kolostrum telete do 6 h (viz [[kolostrum-mlezivo]])
- Calcium bolus krávě bezprostředně po porodu
- Drench (sondování) elektrolyty + propylenglykol pokud nepije

**Týdny 1–3 (Fresh Cow):**

Transition TMR:
- Postupné zvyšování koncentrátu (den 1: 60/40 píce/koncentrát; den 21: 50/50)
- Energie: 7,2 MJ NEL/kg DM
- CP: 16–17 %
- RUP: 35–38 %
- Cholin (Reashure): 15 g/kráva/den

Sledování:
- Denní vážení mléka
- BHB test (ketóza) — den 5, 7, 12
- NEFA test (mobilizace tuku)
- BCS každý týden
- Teplota (>39,5 °C = problém)

**Ekonomický dopad:**

**OPTIMÁLNÍ transition:**
- 5 % klinických problémů
- 305d produkce 11 000+ kg

**ŠPATNÝ transition:**
- 20–30 % klinických problémů
- Léčba: 5 000–10 000 Kč/kráva
- Snížená produkce: -500 až -1 500 kg/laktace
- Vyřazení: 20+ % (vs 10 %)

**ROI investice do transition managementu**: 3–5× = nejvýnosnější investice mléčné farmy.

Viz též [[oteleni]], [[bcs-body-condition]], [[mastitida]], [[tmr]], [[kolostrum-mlezivo]], [[krmne-davky]].`,
    related: ['oteleni', 'bcs-body-condition', 'mastitida', 'tmr', 'kolostrum-mlezivo'],
  },
  {
    slug: 'f1-hybrid',
    term: 'F1 hybrid',
    alias: ['F1 generace', 'first filial generation', 'kříženec'],
    kategorie: 'chov',
    shortDef: 'F1 hybrid je první generace kříženců dvou různých plemen/linií. Vykazuje heterózu (hybrid vigor) — vyšší výkon než průměr rodičů. V zemědělství klíčové pro semena (hybridní kukuřice, žito) i živočišnou výrobu (mléko, prasata, brojleři).',
    longDef: `F1 hybrid (anglicky *F1 generation*, *first filial generation*) je **první generace kříženců dvou geneticky odlišných linií**. Vyznačuje se **heterózí (hybrid vigor)** — vyšším výkonem než průměr rodičů. Klíčový genetický princip v moderním zemědělství.

**Princip:**

- **Rodič A** × **Rodič B** = **F1 generace** (geneticky identičtí, heterozygotní)
- F1 × F1 = **F2** (rekombinanti, variabilní, heteróze klesá)

**Heteróze (hybrid vigor):**
- F1 výkonnější o 5–30 % nad průměrem rodičů
- Mechanizmus: kombinace různých alel, maskování recesivních defektů
- **Sníží se v F2** → každoroční nákup nového F1 osiva

**Aplikace v rostlinné výrobě:**

**1. Hybridní kukuřice:**
- Henry Wallace USA 1920s — průkopnictví
- USA výnos: 1900: 1,8 t/ha → dnes 11+ t/ha (díky F1)
- F1 výhody: +20–30 % výnos, uniformita, stres tolerance
- Trh: Pioneer, DEKALB (Bayer), Syngenta, Limagrain

**2. Hybridní žito** (viz [[zito-ozime]]):
- KWS 1990s (CMS — Cytoplasmic Male Sterility)
- Výnosy: +30–50 % vs tradiční

**3. Cukrová řepa, zelenina** — téměř 100 % F1

**4. Hybridní pšenice** — neúspěšný projekt (samospraš)

**Aplikace v živočišné výrobě:**

**1. Prasata:**
- Pietrain × (Velký bílý × Landrasse) = "double cross"
- F1 prasnice: vysoká plodnost (12+ selat/vrhu)
- F1 výkrm: rychlý růst, libové maso

**2. Brojleři:**
- **Ross 308**: 4-liniový hybrid, mezinárodní standard
- Růst: 42 dní z 40 g na 2,5 kg
- Konverze: 1,6 kg krmiva / kg masa

**3. Nosnice:**
- **ISA Brown** (Hubbard ISA, Hendrix Genetics)
- 320+ vajec/rok (vs 200 tradiční)

**4. Crossbreeding skot:**

**Mléčný kříž** (méně častý):
- Norský červený × Holstein — robust, lepší zdraví
- Jersey × Holstein — vyšší tuk

**Masný kříž** (běžný):
- Holstein kráva × Charolais býk — premium kříženci
- Holstein × Aberdeen Angus — marbling
- Komerční výkrm: 50 kg → 600 kg za 12–18 měs.

**Teorie heteróze:**
1. **Dominance**: F1 maskuje recesivní defekty obou linií
2. **Overdominance**: heterozygot je výkonnější
3. **Epistasis**: synergie interakcí mezi loky

**Etika a debata:**
- Závislost farem na semenářských firmách (Bayer, Corteva, Syngenta, Limagrain)
- Ztráta tradiční variability
- **Open Source Seed Initiative** — alternativa

**EU regulace:**
- CMS hybridi ≠ GMO (klasická šlechtitelská technologie)
- GMO hybridi (Mon810) silně omezené v EU

Viz též [[plemenna-kniha]], [[inseminace]], [[zito-ozime]], [[kukurice-silazni]], [[ku-kontrola-uzitkovosti]].`,
    related: ['plemenna-kniha', 'inseminace', 'zito-ozime', 'kukurice-silazni'],
  },

  // ── MODERNÍ AGTECH ─────────────────────────────────────────────────
  {
    slug: 'precision-livestock-farming',
    term: 'Precision Livestock Farming (PLF)',
    alias: ['PLF', 'precizní chov', 'precision dairy', 'smart farming živočišné'],
    kategorie: 'precise-farming',
    shortDef: 'Precision Livestock Farming (PLF) je systém kontinuálního automatického monitoringu zvířat pomocí senzorů (akcelerometry, RFID, kamery) a AI analýzy dat. Detekuje říji, mastitidu, kulhání, stres dříve než člověk — řeší 80 % managment rozhodnutí mléčné farmy.',
    longDef: `Precision Livestock Farming (PLF, „precizní chov", anglicky *smart farming*) je systém **kontinuálního automatického monitoringu zvířat** pomocí senzorů, IoT a AI. Cíl: detekovat **biologické signály** (říje, nemoc, stres, krmení) **dříve než člověk** a transformovat data do managementu.

**Historie:**
- **1990s**: první aktivometry (pedometry) v dojírnách
- **2010s**: rozšíření akcelerometrů na obojcích
- **2015+**: AI/ML modely pro behaviorální analýzu
- **2020+**: kamery + computer vision (BCS, kulhání)
- **2024**: integrace LLM (Large Language Models) pro doporučení

**Hlavní senzorové technologie:**

**1. Akcelerometry (obojkové / nákolenní):**
- **Měří**: aktivitu (kroky, mounting, lehání)
- **Aplikace**: detekce říje, ranná detekce nemoci, monitoring komfortu
- **Top produkty**:
  - **CowManager SensOor** (NL) — obojkový
  - **Allflex Heatime** (IL) — obojkový
  - **DeLaval DDM** — uchový tag
  - **SCR Heatime** — Israeli alternative
- **Cena**: 2 000–5 000 Kč/krávu (jednorázová) + 30–80 Kč/měs. software

**2. RFID (radio-frequency identification):**
- **Ušní známka** (viz [[usni-znamka]]) s integrovaným RFID chipem
- **Statické čtečky**: brány do dojírny, krmných boxů
- **Aplikace**: identifikace, automatické krmení (per cow), monitoring příjmu

**3. Mléčný analyzér (in-line):**
- **Integrovaný v dojírně** — měří objem + složení v reálném čase
- **Parametry**: tuk, bílkoviny, laktóza, vodivost (mastitida — viz [[mastitida]])
- **Aplikace**: alarm vysokého SCC, denní KU bez technika
- **Trh**: AfiLab (DeLaval), Lely milk analyzer

**4. Kamery + Computer Vision:**
- **Aplikace**:
  - **BCS skórování** (viz [[bcs-body-condition]]) automaticky
  - **Lameness detection** (kulhání) — analýza chůze
  - **Behavior monitoring** (lying time, water visits)
  - **Heat detection** (komplement k akcelerometru)
- **Trh**: DeLaval BCS Camera, Cargill ZAFFY (kulhání), Connecterra (full AI)
- **Cena**: 200 000–500 000 Kč instalace

**5. Bolus senzory (v bachoru):**
- **Polykané telete** (orálně) — žije v bachoru roky
- **Měří**: bachorové pH, teplotu, motorickou aktivitu
- **Aplikace**: acidóza detection, ranná detekce nemoci
- **Trh**: Mottainai, Cowtronix
- **Cena**: 3 000–8 000 Kč/kráva (jednorázové)

**6. Vodní spotřeba sensors:**
- **Měření spotřeby vody** per cow (přes RFID v boxu)
- **Aplikace**: pokles příjmu = ranná indikace nemoci nebo stresu

**Klíčové aplikace PLF:**

**1. Detekce říje (viz [[rijnost]]):**
- **Tradiční vizuální**: 45–65 % detekce
- **PLF akcelerometr**: 90–98 % detekce
- **Inseminační timing**: optimální (6–18 h od startu říje)
- **Ekonomický dopad**: -50 dní mezidoby = +500 l mléka/kráva/rok

**2. Detekce mastitidy:**
- **In-line mléčný analyzér** detekuje vodivost (≈ SCC)
- **Alarm** na zvýšení 24 h před klinickými příznaky
- **Rychlejší léčba** = méně ztracená produkce

**3. Detekce nemocí (general):**
- **Změna chování** (-30 % aktivity nebo -20 % ruminace) = alarm
- **Ranný start léčby** snižuje closure rate
- **Telete v transition period** (viz [[transition-period]]) — vysoký ROI

**4. Detekce kulhání:**
- **Kamerový systém** sleduje chůzi
- **Trénink AI**: klasifikace 1–5 (locomotion score)
- **Cíl**: <5 % krav s lameness score >3

**5. Welfare monitoring:**
- **Lying time** (12–14 h = optimum)
- **Standing time u krmení**
- **Sociální interakce**

**6. Reprodukční management:**
- **Ovsynch protokoly** podle dat
- **Inseminační timing**
- **Konfirmace zabřeznutí** (změna aktivity 5–7 dní po inseminaci)

**Software a platformy:**

- **CowManager** (NL) — dominantní v EU
- **Connecterra IDA** (NL) — AI-first
- **Afimilk Aclick** (IL)
- **GEA CowScout** (DE)
- **Lely Astronaut + Horizon** (NL)
- **Microsoft Azure FarmBeats** — IoT platforma

**Robotické dojírny (AMS) jako PLF platforma:**
- Lely Astronaut, DeLaval VMS, GEA DairyRobot
- Integrace: dojení + krmení + senzory + software
- Cena: 4–6 mil. Kč per robot (1 robot = 60 krav)

**ROI PLF systému:**

**Investice na 100 krav:**
- Akcelerometry + sw: 250 000–500 000 Kč
- Plus in-line analyzér: +400 000–800 000 Kč
- Plus BCS kamera: +300 000–500 000 Kč
- **Celkem**: 950 000–1 800 000 Kč

**Benefity ročně:**
- Lepší detekce říje: +50 000–100 000 Kč/krávu × 100 = 50 000 Kč/100 krav... wait, recalc: +1 000–2 000 Kč/kráva = 100 000–200 000 Kč/rok pro 100 krav
- Méně mastitid: -50 000–100 000 Kč/rok
- Lepší welfare = lepší dlouhověkost krav: 100 000–200 000 Kč/rok

**Celkem**: 250 000–500 000 Kč/rok ROI
**Návratnost**: 2–5 let

**Bariéry:**
1. **Vysoká investice** — pro malé farmy obtížné
2. **Komplexnost** — vyžaduje IT/digital dovednosti
3. **Závislost na internetu** — cloud sw vyžaduje stabilní internet
4. **Údržba** — senzory životnost 5–7 let

**Budoucnost:**
- **LLM integrace** — ChatGPT-like rozhraní pro farmu
- **Predikční modely** — predikce mastitidy 7 dní dopředu
- **Genomické integrace** — kombinace PLF dat s plemennou hodnotou
- **Vir farmy** — koncept "digital twin" mléčného stáda

Viz též [[rijnost]], [[mastitida]], [[bcs-body-condition]], [[ku-kontrola-uzitkovosti]], [[transition-period]], [[dojirna]], [[telematika]], [[usni-znamka]].`,
    related: ['rijnost', 'mastitida', 'bcs-body-condition', 'ku-kontrola-uzitkovosti', 'transition-period', 'dojirna'],
  },
  {
    slug: 'satelity-zemedelstvi',
    term: 'Satelity v zemědělství',
    alias: ['satellite agriculture', 'remote sensing', 'družicová data', 'Sentinel data'],
    kategorie: 'precise-farming',
    shortDef: 'Satelitní data (Sentinel, Landsat, Planet) poskytují multispektrální snímky pro monitoring polí — vegetační indexy (NDVI), vlhkost půdy, výnos predikce, detekce stresu plodin. Free Sentinel data umožňují každé farmě sledovat 100+ ha za zlomek nákladů.',
    longDef: `Satelitní data jsou klíčový **vstup pro precision farming** — poskytují **multispektrální snímky** s prostorovým rozlišením 1–30 m a temporálním rozlišením 1–7 dní. Aplikace: monitoring porostů, detekce stresu, variable rate aplikace (viz [[variable-rate]]), výnos predikce.

**Hlavní satelitní programy:**

**1. Copernicus Sentinel (EU, zdarma!):**
- **Sentinel-2** — multispektrální (13 bands), rozlišení 10 m (RGB+NIR), 20 m (red edge), 60 m (atmosférické)
- **Frekvence**: 5 dní (kombinace 2 satelitů)
- **Pokrytí**: celá EU pravidelně
- **Cena**: ZDARMA pro všechny (EU iniciativa)
- **API**: Sentinel Hub, Google Earth Engine

**2. Landsat (USA, NASA, zdarma!):**
- **Landsat 8/9** — rozlišení 30 m (multispektrální), 100 m (termální)
- **Frekvence**: 16 dní (jeden satelit)
- **Pokrytí**: globální od 1972 (50+ let dat!)
- **Cena**: ZDARMA
- **Použití**: dlouhodobé trendy, historie

**3. Planet Labs (USA, komerční):**
- **PlanetScope** — denní snímky, rozlišení 3 m
- **SkySat** — rozlišení 0,5 m (subdetailní)
- **Cena**: 10–50 USD/km²/měs.
- **Použití**: precision farming na úrovni rostliny

**4. Maxar / DigitalGlobe (komerční, drahá):**
- **WorldView-3/4** — rozlišení 0,3 m
- **Cena**: 25–100 USD/km²
- **Použití**: military, urban planning, vzácně ag

**5. NICFI (Norway, tropická lesní data zdarma):**
- Planet Labs PlanetScope pro tropy ZDARMA
- Pro EU farmy irelevantní

**Vegetační indexy (klíčové výstupy):**

**1. NDVI (Normalized Difference Vegetation Index) — viz [[ndvi]]:**
- **Vzorec**: (NIR - RED) / (NIR + RED)
- **Hodnoty**: -1 až +1 (porost: 0,3–0,9)
- **Interpretace**: vyšší = více chlorofylu = zdravější porost
- **Aplikace**: stress detection, variable rate N hnojení

**2. NDRE (Normalized Difference Red Edge):**
- **Vzorec**: (NIR - RedEdge) / (NIR + RedEdge)
- **Citlivější** k variabilitě N v plodině
- **Aplikace**: in-season hnojení rozhodnutí

**3. EVI (Enhanced Vegetation Index):**
- Robustnější vůči atmosférickým efektům
- Vhodný pro lesy, husté porosty

**4. SAVI, OSAVI (Soil-Adjusted):**
- Pro nízké pokrytí (kukuřice v BBCH 12–30)
- Odpočítá efekt holé půdy

**5. Termální indexy:**
- Landsat 8/9 termální band
- **CWSI** (Crop Water Stress Index) — detekce sucha
- Sentinel-3 = lepší teplotní snímky (1 km rozlišení, denně)

**6. SAR (Synthetic Aperture Radar):**
- Sentinel-1 — radar (proniká mrak, vidí v noci)
- **Aplikace**: vlhkost půdy, biomassa, detekce sklizně

**Komerční platformy pro farmáře:**

- **Climate FieldView** (USA, Bayer) — top globální, $500–1 500/farma/rok
- **OneSoil** (NL) — bezplatná, NDVI ze Sentinel
- **Mapy.eAgronom** (CZ, EE) — domácí integrace
- **Yara Atfarm** — N variabilita
- **Soyl** (UK) — variable rate N + osivo
- **Agremo** (RS) — drone + satellite kombinace
- **SatAgro** (PL) — Sentinel-based, EU farms
- **Sentinel Hub Playground** — DIY platforma (technical)

**Aplikace v CZ farmě:**

**1. Variable rate N hnojení:**
- Sentinel-2 NDVI BBCH 32 pšenice
- Mapa variability → soubor pro postřikovač (ISO XML)
- Aplikační stroj reaguje sekce-by-sekce (10–24 m sekce)
- **Úspora N**: 10–20 % (= 500–1 000 Kč/ha)

**2. Detekce stresu (sucho, choroba):**
- Pravidelný NDVI monitoring
- Anomálie = signál k kontrole
- Ranný zásah = prevence ztrát

**3. Yield prediction:**
- Historická NDVI data + ML model
- Predikce výnosů 30–60 dní před sklizní
- Plánování logistiky (sušárny, sklady)

**4. Pojištění úrody:**
- **Parametric insurance** — pojistka platí podle NDVI anomálie
- **Bez nutnosti** prohlídky pole pojistitelem
- **Trh**: Hannover Re, Munich Re — EU parametrické pojištění

**5. EU CAP kontroly:**
- **SZIF** používá Sentinel data pro kontrolu LPIS (viz [[lpis]])
- Detekuje "sklizeň před vyhlášením", neoznámené operace
- "Geo-tagged photos" verifikované satelity

**6. Historická analýza pole:**
- 10+ let NDVI dat ZDARMA
- Identifikace variability půdy (zóny)
- Plánování investic (drenáž, vápnění zón)

**Technické omezení:**
- **Mraky** — Sentinel-2 optický nevidí přes mrak (cca 30 % snímků zataženo)
- **Rozlišení** — 10 m nevidí jednotlivé rostliny (jen plošně)
- **Atmosférické korekce** — vyžaduje preprocessing (řeší platformy)
- **Časový lag** — od snímání po dostupnost 1–7 dní

**Cena PRO farmu:**

**Free tier** (Sentinel + OneSoil):
- **0 Kč**
- Základní NDVI 1× týdně
- Vhodné pro malé farmy

**Mid tier** (Climate FieldView, eAgronom):
- **15 000–40 000 Kč/rok**
- Plné rozhraní, variable rate maps, integrace s technikou
- Vhodné pro 200–1 000 ha farmy

**Top tier** (Planet + custom analytics):
- **100 000+ Kč/rok**
- Denní 3m rozlišení, vlastní AI modely
- Vhodné pro velké korporátní farmy nebo výzkumné projekty

**Budoucnost:**
- **Sentinel-3 NextGen** (2025+) — vyšší rozlišení
- **AI integrace** — automatická detekce konkrétních chorob (rzi, septorioza)
- **Real-time pojištění** — okamžitá výplata podle satelitu
- **Carbon credits** — verifikace sekvestrace pomocí satelitního monitoringu (viz [[karbonove-zemedelstvi]])

Viz též [[ndvi]], [[variable-rate]], [[gps-rtk]], [[lpis]], [[karbonove-zemedelstvi]], [[telematika]], [[drony-zemedelstvi]].`,
    related: ['ndvi', 'variable-rate', 'gps-rtk', 'lpis', 'karbonove-zemedelstvi', 'telematika', 'drony-zemedelstvi'],
  },
  {
    slug: 'agrolesnictvi',
    term: 'Agrolesnictví',
    alias: ['agroforestry', 'agroles', 'silvopasture', 'alley cropping'],
    kategorie: 'precise-farming',
    shortDef: 'Agrolesnictví je systém pěstování stromů a zemědělských plodin nebo živočichů na stejném pozemku. Klíčové formy: alley cropping (řady stromů mezi plodinami), silvopasture (pastva mezi stromy), forest farming (rozšířený les). V EU rostoucí v rámci CAP 2023+.',
    longDef: `Agrolesnictví (anglicky *agroforestry*, „zemědělství s lesem") je **integrovaný systém pěstování stromů + zemědělských plodin nebo živočichů** na stejném pozemku. Synergie stromů a zemědělství zvyšuje produktivitu, biodiverzitu, sekvestraci uhlíku.

**Hlavní formy:**

**1. Alley cropping (mezisazená polní hospodářství):**
- **Princip**: řady stromů (ovocné, lesnické) v mezerách 15–40 m mezi nimi pěstujeme plodiny
- **Stromy**: ořešák, jabloň, hrušeň, lípa, dub červený, olše
- **Plodiny**: pšenice, kukuřice, řepka, luskoviny
- **Výnos plodin**: -10 až -20 % (kvůli zástinu)
- **Plus stromy**: ovoce, dřevo, sekvestrace C → kompenzace + bonus

**2. Silvopasture (pastva mezi stromy):**
- **Princip**: pastviny s rozptýlenými stromy nebo řadami
- **Výhody**: stín pro skot (snížený tepelný stres), pastva pod stromy, biodiverzita
- **Stromy**: dub, kaštan, ovocné, akcie ořešák
- **Tradice**: dehesa (Španělsko), montado (Portugalsko), pastvy v ČR Krkonoše

**3. Forest farming:**
- **Princip**: rozšířené pěstování pod lesnatým pokrytím
- **Plodiny**: houby, lesní jahody, bylinky, ženšen
- **Niche trh**, vysoká marže

**4. Větrolamy + plodiny:**
- **Pásové výsadby** stromů kolem polí (5–20 m široké)
- **Ochrana** proti větrné erozi
- **Mikroklima** — méně sucha, lepší výnosy o 5–15 %
- **Tradice CZ**: jiřinské větrolamy (jižní Morava)

**5. Riparian buffer (břehové porosty):**
- **Stromy podél vodních toků** (5–30 m)
- **Účel**: filtrace splavů hnojiv + pesticidů, biodiverzita
- **EU dotace** v rámci AEKO

**6. Plantážové ovocné sady:**
- **Klasický sad** je již agroforestry forma
- **Intenzivní**: jabloně 800–1 200/ha, jednoosé řady
- **Plus**: travní pás mezi řady → cilační skoty pastevně

**Ekosystémové benefity:**

**1. Sekvestrace uhlíku:**
- **Stromy ukládají C v dřevě + půdě** — 2–10 t CO₂/ha/rok
- Pro CAP carbon farming = vysoký kredit (viz [[karbonove-zemedelstvi]])

**2. Biodiverzita:**
- **Stromy** = habitat pro ptáky, hmyz, drobné savce
- **Pesticidní redukce** — predátoři škůdců (slunéčka, hmyz parazitoidi)

**3. Vodní hospodářství:**
- **Kořeny stromů** infiltrují vodu hlouběji
- **Snižuje erozi** (viz [[eroze-pudy]])
- **Větrolamy** snižují evaporaci o 20–30 %

**4. Welfare zvířat (silvopasture):**
- Stín v létě = nižší tepelný stres
- Volný pohyb pro skot

**5. Diverzifikace příjmů:**
- Plodiny + dřevo + ovoce + housova + bio paliva
- Risk-spreading proti tržním šokům

**Ekonomika:**

**Náklady na výsadbu**:
- **Stromy** (sazenice): 100–500 Kč/strom
- **Hustota**: 100–400 stromů/ha (řadové výsadby)
- **Ochrana** (chrániče proti zvěři, plot): 50–200 Kč/strom
- **Údržba** (zalévání první 3 roky, řez): 20–50 Kč/strom/rok
- **Celkem startup**: 30 000–100 000 Kč/ha
- **Provozní**: 1 000–3 000 Kč/ha/rok

**Návratnost**:
- **Ovoce** od roku 5–7 (jabloň, hrušeň)
- **Ořechy** od roku 8–12 (ořešák)
- **Dřevo** od roku 30–60 (lesnické dřeviny)
- **Carbon credits** ihned (3–8 EUR/t CO₂)
- **CAP dotace** za stromy (viz dále)

**EU CAP 2023–2027 a agrolesnictví:**

**1. Eko-režimy (EKO platba):**
- **Stromy v zemědělství** = bonus +1 300 Kč/ha
- **Podmínka**: min. 50 stromů/ha, registrace

**2. AEKO podopatření:**
- **Trvalé krajinné prvky** (alej, větrolam) — 50–80 Kč/m/rok
- **Pastviny s stromy** — vyšší sazba ANC

**3. Intervence 4.4** (Strategický plán SZP):
- **Investiční podpora pro výsadbu** stromů na zemědělské půdě
- **60–80 % nákladů** dotováno
- **Cíl EU**: 3 mld nových stromů do 2030

**CZ právní rámec:**
- **Vyhláška 314/2017** o stromech v zemědělství
- **LPIS** musí stromy registrovat
- **GAEC 8** vyžaduje zachování krajinných prvků

**Implementační bariéry:**
1. **Dlouhodobá investice** — návratnost 5–30 let
2. **Pronajatá půda** — nájemce nechce investovat do stromů
3. **Stínění plodin** — pokles výnosů o 10–20 %
4. **Údržba** — řez, ochrana, zalévání
5. **Mechanizace** — překáží polní strojům

**Příklady úspěšných farem:**
- **Wakelyns** (UK) — alley cropping pšenice + ořešák, 30+ let
- **Stilo** (FR) — silvopasture skot + dub
- **CZ pilotní projekty** — Jihočeská univerzita, Mendelu Brno

**Trend:**
- **EU strategie "Farm to Fork"** podporuje agroforestry
- **Climate change adaptation** — stromy + plodiny = resilience
- **Carbon credits** — rostoucí trh pro agroforestry sekvestraci

Viz též [[karbonove-zemedelstvi]], [[regenerativni-zemedelstvi]], [[eroze-pudy]], [[mez]], [[biopasy]], [[gaec]].`,
    related: ['karbonove-zemedelstvi', 'regenerativni-zemedelstvi', 'eroze-pudy', 'mez', 'biopasy', 'gaec'],
  },
  {
    slug: 'hydroponie',
    term: 'Hydroponie',
    alias: ['hydroponics', 'beztrhní pěstování', 'soilless growing'],
    kategorie: 'precise-farming',
    shortDef: 'Hydroponie je pěstování rostlin bez půdy — v inertním substrátu (perlit, kokos, kamenná vlna) nebo přímo ve vodě s živinami. Klíčová pro skleníky (rajčata, paprika, salát) a vertical farming. Spotřeba vody -90 %, výnos +30 % vs půdní pěstování.',
    longDef: `Hydroponie (řec. *hydro* + *ponos* = voda + práce) je **pěstování rostlin bez půdy** — kořeny v inertním substrátu (perlit, kokos, kamenná vlna) nebo přímo ve vodě s rozpuštěnými živinami. Klíčová technologie pro **skleníky, vertical farming, urban agriculture**.

**Princip:**
- Rostlina získává **živiny z vodního roztoku** (= nutrient solution), ne z půdy
- Kořeny v inertním substrátu (struktura) nebo přímo ve vzduchu/vodě
- **Přesné ovládání** pH, EC (electrical conductivity), teploty, koncentrací N/P/K
- **Velmi efektivní** využití vody a živin

**Hlavní systémy:**

**1. NFT (Nutrient Film Technique):**
- **Mělký proud** výživného roztoku přes kořeny v žlabech
- **Plodiny**: salát, bazalka, jahody
- **Plusy**: jednoduchý, levný
- **Mínusy**: výpadek pumpy = rychlá smrt rostlin

**2. DWC (Deep Water Culture):**
- **Kořeny ponořené** ve vzdušném roztoku
- **Vzduchovači** dodávají kyslík kořenům
- **Plodiny**: salát, kanabis (medicinální), bylinky
- **Plusy**: high yield, jednoduchý
- **Mínusy**: výpadek vzduchu = kořeny anaerobní za 4 h

**3. Ebb & Flow (Flood & Drain):**
- **Periodicky** zaplavovaný substrát
- **Plodiny**: zelenina, ovoce, dekorativní
- **Plusy**: flexibilní, levný
- **Mínusy**: vyžaduje timer kontrolu

**4. Drip irrigation:**
- **Kapky výživy** na bázi substrátu (kamenná vlna, kokos)
- **Plodiny**: rajčata, paprika, okurky (skleníkové)
- **Plusy**: precision, EU standard
- **Mínusy**: vyšší investice

**5. Aeroponics:**
- **Kořeny ve vzduchu** + sprej výživy
- **Plodiny**: salát, brambory (sazenice)
- **Plusy**: nejvyšší kyslík = nejrychlejší růst
- **Mínusy**: vysoká investice, technicky obtížný

**Substráty:**

**1. Kamenná vlna (Rockwool):**
- **EU skleníky standard** pro rajčata, paprika
- **Cena**: 50–150 Kč/m³
- **Recyklace**: drahá, environmentální problém

**2. Kokosové vlákno:**
- **Bio přístup** — alternativa kamenné vlny
- **Cena**: 80–200 Kč/m³
- **Plus**: biologicky rozložitelné

**3. Perlit, vermikulit:**
- **Lehké** substráty pro pěstební boxy
- **Cena**: 100–300 Kč/m³

**4. Hydroton (expandovaný jíl):**
- **Pelety** pro DWC, ebb & flow
- **Cena**: 80–200 Kč/m³, opakovaně použitelný

**5. Bezsubstrátové** (NFT, DWC, aero):
- **Žádný substrát** = nejnižší náklady
- Vhodné jen pro salát, bylinky

**Výživa — nutrient solution:**

**Klíčové prvky** (NPK + mikroprvky):
- **N**: 100–250 mg/l (záleží na plodině)
- **P**: 30–80 mg/l
- **K**: 150–300 mg/l
- **Ca**: 100–200 mg/l
- **Mg**: 30–60 mg/l
- **Mikroprvky**: Fe, Mn, Zn, Cu, B, Mo (v ppb)

**pH**: 5,5–6,5 (optimal absorbcia živin)
**EC**: 1,5–3,0 mS/cm (záleží na plodině)
**Teplota roztoku**: 18–22 °C

**Komerční hnojiva:**
- **Hoagland solution** — klasický recept
- **PPM (Plant Prod)** — komerční směsi
- **Floraseries** (GHE) — kanabis-orientované
- **Yara Krista** — profesionální

**Aplikace:**

**1. Skleníky rajčat:**
- Holandsko = 8 000 ha (50 % EU produkce v 1 zemi!)
- **Výnos rajčat**: 60–80 kg/m²/rok (vs 4 kg/m² půdní)
- **Cena instalace skleníku**: 2 000–5 000 Kč/m²

**2. Skleníky paprik, okurek:**
- Podobné rajčatům
- CZ producenti: BeJa, Frudoma, Magna Czech

**3. Salát a bylinky (NFT, DWC):**
- **24 hour cycle** — sklizeň každý den
- **Plant factory** koncept
- CZ producenti: Salatika, Czech Microgreens

**4. Jahody:**
- **Hydroponic strawberries** — celoroční sklizeň
- **Vysoký premium** (chuť, cena)

**5. Kanabis (medicinální):**
- **EU rostoucí trh** (DE, NL, ČR pilotní programy)
- **Hydroponie** = standard pro indoor pěstování

**6. Salátové micro-greens:**
- **8–14 dní cycle** — rychlá sklizeň
- **Premium retail** — chefs, fine dining

**Výhody hydroponie:**

1. **Voda**: -90 % spotřeba (recirkulace)
2. **Živiny**: -50 % (přesné dávkování)
3. **Výnos**: +30 až +1 000 % vs půdní (záleží na plodině)
4. **Mikroorganismus tlak**: nižší (sterilní prostředí)
5. **Pesticidy**: -80 % (kontrolované prostředí)
6. **Plocha**: 5–10× vyšší produkce na m²
7. **Sezonalita**: 24/7 produkce
8. **Kvalita**: konzistentní, premium

**Nevýhody:**

1. **Vysoká investice** — startup 2 000–10 000 Kč/m²
2. **Energetická náročnost** (LED osvětlení, vzduchovači)
3. **Technicky komplexní** — vyžaduje znalosti chemie + biologie + IT
4. **Závislost na elektřině** — výpadek = ztráta
5. **Nutrient management** — drahé profesionální výživy
6. **Není certifikované bio** (s výjimkou některých US států)

**Ekonomika:**

**Skleník rajčat 1 ha (10 000 m²):**
- Investice: 30–50 mil. Kč
- Provozní náklady: 5–10 mil. Kč/rok (energie, voda, výživa, práce)
- Výnos: 700 t/ha × 35 Kč/kg = 24,5 mil. Kč/rok
- Marže: 14,5 mil. Kč/rok
- Návratnost: 3–4 roky

**Vertical farm salátu (viz [[vertikalni-farma]]):**
- Investice: 100 000–300 000 Kč/m² stavební plochy
- Vyšší produkce per m² ale dražší investice
- Návratnost: 5–10 let

**CZ producenti a trh:**
- **Frudoma** (Olomouc) — rajčata, paprika
- **BeJa Group** — moderní skleníky
- **Magna Czech** — sklenikářství
- **Salatika** — salát, micro-greens
- **HempFlow** (Praha) — kanabis medicinální

**Trendy 2024:**
- **LED technology** — efektivnější, cenově dostupné
- **AI control systems** — automatizace pH, EC, klima
- **CRISPR plodiny** šité na míru hydroponie
- **Plant factories** — fully automated, 24/7

Viz též [[vertikalni-farma]], [[precision-livestock-farming]], [[npk-hnojivo]], [[satelity-zemedelstvi]].`,
    related: ['vertikalni-farma', 'npk-hnojivo'],
  },
  {
    slug: 'vertikalni-farma',
    term: 'Vertikální farma',
    alias: ['vertical farm', 'vertical farming', 'plant factory'],
    kategorie: 'precise-farming',
    shortDef: 'Vertikální farma je vícepatrový systém pěstování plodin v kontrolovaném vnitřním prostředí (LED osvětlení, hydroponie). Cíl: produkce v městech, blízko spotřebitele, 365 dní/rok. Výnosy 50–100× vyšší na m² půdy, ale energetická náročnost vysoká.',
    longDef: `Vertikální farma (anglicky *vertical farming*, *plant factory*) je **vícepatrový systém pěstování plodin v kontrolovaném vnitřním prostředí** (CEA — Controlled Environment Agriculture). Kombinace **hydroponie** (viz [[hydroponie]]) + **LED osvětlení** + **AI/IoT** kontrola + vertikální stohování.

**Princip:**
- **Vícepatrová struktura** (5–20+ pater)
- **LED osvětlení** nahrazuje slunce (red + blue spectrum)
- **Hydroponie** nahrazuje půdu
- **HVAC** (klimatizace) kontroluje teplotu, vlhkost, CO₂
- **Plně izolované** od vnějšího prostředí — žádné pesticidy, choroby
- **365 dní/rok** produkce

**Historie:**
- **1999** — Dickson Despommier (Columbia University) popularizuje koncept
- **2010** — první komerční vertical farms v Japonsku (Tokyo)
- **2015+** — investiční boom v USA, EU
- **2022–2023** — některé velké projekty (Plenty, AeroFarms, Infarm) **kolaps** kvůli vysokým nákladům
- **2024** — konsolidace trhu, fokus na ekonomicky funkční modely

**Hlavní plodiny:**

**1. Salát (90 % komerčních vertical farms):**
- **Cycle**: 21–35 dní z osiva
- **Yield**: 1 500–3 000 hlávek/m² stavební plochy/rok
- **Trh**: retail premium (Tesco, Whole Foods), restaurace

**2. Micro-greens:**
- **Cycle**: 7–14 dní
- **Premium**: 800–2 000 Kč/kg
- **Trh**: fine dining, mixed sets

**3. Bylinky (bazalka, koriandr, máta):**
- **Cycle**: 25–45 dní
- **Vysoký premium**: 1 500–3 000 Kč/kg
- **Trh**: retail + foodservice

**4. Jahody:**
- **Year-round** produkce
- **Premium**: až 800 Kč/kg
- **Trh**: prémiové retail

**5. Listové zeleniny** (kale, spinach, arugula):
- Podobné salátu
- Rostoucí trend pro fitness/health-conscious

**6. Rajčata, paprika** — vzácně (energeticky nákladné):
- **Pouze high-tech farmy**
- Stoupající úsilí (Plenty, Bowery)

**7. Kanabis (medicinální):**
- **EU rostoucí trh** (regulačně omezený)
- **Premium**: extrémně vysoký
- **Energie**: ještě vyšší než salát

**Klíčové technologie:**

**1. LED osvětlení:**
- **Red light** (660 nm) — fotosyntéza
- **Blue light** (450 nm) — vegetativní růst
- **Spectrum tuning** podle plodiny + růstové fáze
- **DLI** (Daily Light Integral): 10–25 mol/m²/den
- **Cena LED**: 5 000–15 000 Kč/m² pěstební plochy
- **Životnost**: 50 000–80 000 h (5–10 let)

**2. HVAC (klimatizace):**
- **Teplota**: 20–24 °C
- **Vlhkost**: 65–75 %
- **CO₂ enrichment**: 800–1 200 ppm (vs 420 ppm normální atmosféra)
- **Spotřeba energie**: 50 % celkové farma spotřeby

**3. Hydroponický systém:**
- **NFT, DWC, aeroponics** (viz [[hydroponie]])
- **Automatická výživa** + monitoring pH + EC
- **Recirkulace vody** = 95 % úspora vs půdní

**4. Automatizace:**
- **Robotické setí, transplantace, sklizeň**
- **AI vision** pro detekci nemocí, růstové fáze
- **Predictive control** klima a osvětlení

**5. Software a IoT:**
- **Plant Hub, Source.AI** — plant monitoring
- **Skylab Analytics** — performance optimization
- **Cloud platforms** pro multi-farm operations

**Energetická náročnost (klíčový problém):**

**Spotřeba per kg produkce:**
- **Salát**: 8–25 kWh/kg
- **Bylinky**: 15–40 kWh/kg
- **Rajčata**: 60–100 kWh/kg (proto nevhodné!)
- **Kanabis**: 1 000+ kWh/kg

**Cena elektřiny** = ~50–70 % nákladů farmy
- Při 4 Kč/kWh × 20 kWh/kg salátu = **80 Kč/kg jen energie**
- Plus práce + materiály + amortizace = celkové náklady 150–300 Kč/kg salátu
- Vs **polní salát**: 30–60 Kč/kg náklady

**Ekonomická realita:**

**Vertical farm rentabilní jen pro:**
1. **Premium retail** (Whole Foods, Tesco F&F): 250–500 Kč/kg
2. **Restaurace** (fine dining): 400–1 200 Kč/kg
3. **Specialty products** (micro-greens, exotic herbs): 800+ Kč/kg
4. **B2B kontrakty** (sushi chefs, salad chains)

**NE pro mass market** (běžný salát v Lidlu za 30 Kč/kg) — ekonomicky nemožné.

**Klíčové farmy (2024):**
- **AeroFarms** (USA) — Newark, NJ. 6 000 m² farma, salát
- **Plenty** (USA) — financováno SoftBank, problémy s rentabilitou
- **Bowery Farming** (USA) — rajčata, salát
- **Infarm** (DE) — modulární farmy v supermarketech, **kolaps 2023**
- **Sky Greens** (Singapore) — první komerční (2012)
- **YesHealth iFarm** (Taiwan) — high-tech
- **Spread** (Japan) — automatizace top
- **Crops in Pots** (Praha, CZ) — pilotní

**ČR situace:**
- **Pilotní projekty** v Praze, Brně
- **Žádná velká komerční farma** zatím
- **Trh: premium retail + restaurace** — limit ~100 t produkce/rok pro celou ČR
- **Bariéry**: vysoká investice (50–200 mil. Kč), levná dovozová produkce ze Španělska

**Bariéry adopce:**
1. **Vysoká investice**: 100–300 tis. Kč/m² stavební plochy
2. **Energetická náročnost** — drahá elektřina
3. **Klimatická závislost** — solar/wind potřebné pro snížení uhlíkové stopy
4. **Lidský kapitál** — vyžaduje IT + biologii + engineering
5. **Trh limit** — premium segment je malý

**Výhody:**
1. **Voda**: 90–95 % úspora
2. **Pesticidy**: 0 (kontrolované prostředí)
3. **Yield/m²**: 50–100× vs polní
4. **Sezonalita**: 365 dní
5. **Lokálnost**: žádná doprava (urban farming)
6. **Konzistentní kvalita**

**Trendy 2024+:**
- **Konsolidace** trhu (velké projekty zkolabovaly)
- **Solar + battery integration** — snížení elektrické závislosti
- **AI optimization** — algoritmy pro snížení energie o 20–40 %
- **GMO/CRISPR plodiny** vyšlechtěné na míru vertical farming (rychlý růst, nízké nároky na světlo)
- **Hybrid modely** — semi-vertical greenhouse (využití slunečního světla + LED supplement)

**Etická diskuse:**
- **Vertical farms = budoucnost** nebo **drahý gimmick**?
- **Polní zemědělství** stále nejekonomičtější pro většinu plodin
- **Vertical farms = niche** pro městské premium

Viz též [[hydroponie]], [[satelity-zemedelstvi]], [[precision-livestock-farming]], [[ai-zemedelstvi]].`,
    related: ['hydroponie', 'satelity-zemedelstvi', 'precision-livestock-farming'],
  },
  {
    slug: 'agro-iot',
    term: 'IoT v zemědělství',
    alias: ['Internet of Things', 'agro-IoT', 'smart farming sensors', 'agricultural IoT'],
    kategorie: 'precise-farming',
    shortDef: 'IoT (Internet of Things) v zemědělství je síť propojených senzorů, strojů a systémů sbírajících data v reálném čase — vlhkost půdy, teplota, vodní zdroje, stav strojů, krmení, krávy. Data jdou do cloudu pro AI analýzu a management rozhodnutí.',
    longDef: `IoT (Internet of Things, „internet věcí") v zemědělství je **síť propojených senzorů, strojů a systémů**, které sbírají data v reálném čase, posílají je do cloudu pro AI analýzu, a poskytují **management rozhodnutí**.

**Klíčové komponenty IoT systému:**

**1. Senzory (data collection):**

**Půdní senzory:**
- **Vlhkost půdy** (TDR — Time Domain Reflectometry, kapacitní)
- **Teplota půdy** (multiple hloubky: 10, 30, 60 cm)
- **EC** (electrical conductivity — slanost, živiny)
- **pH půdy** (přímo v poli)
- **NPK senzory** (real-time měření)
- **Cena**: 2 000–20 000 Kč per senzor

**Klimatické stanice:**
- **Vzduchová teplota, vlhkost, srážky, vítr, solární radiace**
- **Doplňky**: tlak, evapotranspirace, listová vlhkost (= choroby risk)
- **Trh**: Davis Instruments, Pessl Metos, Sencrop
- **Cena**: 10 000–80 000 Kč

**Plodinové senzory:**
- **NDVI z dronu nebo satelitu** (viz [[ndvi]], [[satelity-zemedelstvi]])
- **Kamerové systémy** (computer vision pro choroby)
- **Sap flow sensors** (cévní průtok v rostlině)

**Zvířecí senzory (PLF):**
- **Obojky** (akcelerometr, GPS) — viz [[precision-livestock-farming]]
- **Bolus senzory v bachoru**
- **In-line mléčné analyzéry**
- **Kamery v stáji**

**Strojové senzory:**
- **GPS-RTK** v traktorech, kombajnech (viz [[gps-rtk]])
- **Telematika** — viz [[telematika]]
- **CAN bus data** — motor, hydraulika, palivo
- **Yield monitor** — viz [[yield-monitor]]

**Vodní senzory:**
- **Průtok** ve sítích zavlažování
- **Hladina** v jímkách, studnách
- **Pumpa** monitoring

**2. Komunikační vrstva (data transmission):**

**LoRaWAN** (Long Range WAN):
- **Dosah**: 5–15 km venkov
- **Spotřeba**: extrémně nízká (baterie 5+ let)
- **Vhodné**: půdní senzory, vodní hospodářství
- **Cena**: 200–500 Kč/senzor/rok

**NB-IoT (Narrowband):**
- **Cellular network** (3G/4G/5G)
- **Vyšší spotřeba**, ale lepší pokrytí
- **Vhodné**: mobilní zvířata, traktory

**Wi-Fi:**
- **Krátký dosah** (100 m), vyšší spotřeba
- **Vhodné**: stáje, sklady

**5G**:
- **Vysoká propustnost** + nízká latence
- **Vhodné**: autonomní stroje, drony, kamerová analýza

**3. Cloud + Edge computing:**

**Edge (lokálně):**
- **Předzpracování dat** na traktoru, ve stáji
- **Snížení datového provozu** do cloudu
- **Rychlejší odezva** (real-time decisions)

**Cloud:**
- **AWS, Azure, Google Cloud** — platformy
- **AWS Greengrass**, **Azure IoT Edge** — IoT-specifické
- **Cena**: 5 000–50 000 Kč/měs. pro velkou farmu

**4. AI/ML analýza:**

**Aplikace:**
- **Predictive maintenance** strojů (selhání motoru)
- **Disease prediction** podle počasí + stavu pole
- **Yield forecasting** z více datových zdrojů
- **Anomaly detection** v chování zvířat
- **Optimization** krmení, postřiků, hnojení

**5. Visualizace + dashboards:**

- **Web platformy**: Climate FieldView, OneSoil, eAgronom
- **Mobilní aplikace** pro farmáře
- **Alarmy** (SMS, email, push notification)

**Hlavní aplikace IoT v ag:**

**1. Smart irrigation:**
- Půdní vlhkost senzory + meteo + AI = optimální plán zavlažování
- **Úspora vody**: 30–50 %
- **ROI**: 1–2 roky

**2. Disease forecasting:**
- Listová vlhkost + teplota + srážky → predikce septoriózy, plísně
- **Models**: BlightCast, SmartGrain, FieldClimate
- **Cílené postřiky** místo paušálních

**3. Crop monitoring:**
- Drone + satellite + půdní senzory = comprehensive monitoring
- **Variable rate** aplikace hnojiv, postřiků (viz [[variable-rate]])

**4. Livestock monitoring:**
- Viz [[precision-livestock-farming]]
- Říje, mastitida, kulhání detekce

**5. Storage monitoring:**
- Teplota + vlhkost v sile, ve skladu obilí
- **Prevence**: hniloba, plísně, plíseňové toxiny

**6. Greenhouse automation:**
- Teplota + vlhkost + CO₂ + osvětlení kontrola
- **Fully automated** pro skleníky rajčat, paprik

**7. Fleet management:**
- GPS + CAN data všech strojů
- **Optimalizace** logistiky, sledování paliva, prevence krádeží

**8. Smart sprayer:**
- Section control (viz [[section-control]]) + RTK GPS + senzory
- Plné variable rate aplikace pesticidů

**Příklady IoT řešení v CZ:**

**Mestská farma:**
- **Climate FieldView** (Bayer) — top globální
- **OneSoil** — freemium pro malé farmy
- **eAgronom** — domácí CZ řešení
- **AgroIT** (CZ startup) — IoT systémy pro CZ farmy
- **Agrosoft** — ERP pro farmy

**Big players:**
- **John Deere Operations Center** — integrovaný systém
- **Bayer Climate FieldView** — globální platforma
- **CNH Industrial AGXTEND** — kombinace strojů + dat

**Ekonomika IoT pro typickou farmu (500 ha):**

**Investice:**
- 5 půdních stanic × 8 000 Kč = 40 000 Kč
- 1 meteostanice × 50 000 Kč = 50 000 Kč
- RTK kit do 2 traktorů × 80 000 Kč = 160 000 Kč
- Yield monitor v kombajnu = 100 000 Kč
- Software ročně = 30 000 Kč
- **Startup**: 350 000–400 000 Kč
- **Roční**: 50 000–100 000 Kč (software + údržba)

**Benefity:**
- Variable rate N: -10–20 % spotřeba = 500–1 000 Kč/ha × 500 ha = 250 000–500 000 Kč/rok
- Lepší timing postřiků: -30 % postřikových nákladů = 100 000–300 000 Kč/rok
- Méně paliva (RTK = méně překrývů): -5 % = 50 000–100 000 Kč/rok
- Lepší výnosy: +200 kg/ha pšenice = +650 000 Kč/rok pro 500 ha

**ROI**: 1–3 roky pro typickou farmu

**Bariéry:**
1. **Investice** — vysoká pro malé farmy
2. **Internet connectivity** — venkov má problém
3. **Komplexnost** — vyžaduje IT znalosti
4. **Data integrace** — různé platformy nesynchronizují
5. **Privacy** — kdo vlastní data farmy?

**Standards & interoperability:**
- **ISOBUS** (viz [[isobus]]) — komunikace traktor ↔ nářadí
- **ADAPT** (AgGateway) — data exchange standard
- **GDPR-like** debaty o farm data ownership

**Trendy 2024+:**
- **5G adoption** — rychlejší, nižší latence
- **Edge AI** — víc inteligence v terénu
- **Open data platforms** — interoperability
- **Carbon credits validation** — IoT data verifikuje sekvestraci
- **Blockchain traceability** — food chain od farmy po konzumenta

Viz též [[telematika]], [[precision-livestock-farming]], [[satelity-zemedelstvi]], [[gps-rtk]], [[variable-rate]], [[isobus]], [[yield-monitor]].`,
    related: ['telematika', 'precision-livestock-farming', 'satelity-zemedelstvi', 'gps-rtk', 'variable-rate', 'isobus', 'yield-monitor'],
  },
  {
    slug: 'carbon-credits',
    term: 'Carbon credits (uhlíkové kredity)',
    alias: ['uhlíkové kredity', 'carbon credit', 'C credits', 'carbon farming credits'],
    kategorie: 'precise-farming',
    shortDef: 'Carbon credit = certifikát potvrzující 1 tunu CO₂ ekvivalentu sekvestrovanou nebo neuvolněnou do atmosféry. Zemědělec produkuje credits pomocí no-till, krycích plodin, biouhle a prodává je korporacím pro plnění klimatických cílů. EU obnovuje regulační rámec (CRCF 2024).',
    longDef: `Carbon credits (uhlíkové kredity) jsou **certifikáty potvrzující 1 tunu CO₂ ekvivalentu** (1 t CO₂e) sekvestrovanou (uloženou) nebo emisi neuvolněnou do atmosféry. Klíčový **finanční nástroj klimatické politiky** — kombinuje boj proti klimatické změně s ekonomickými stimuly.

**Princip:**

1. **Zemědělec** implementuje praktiky snižující emise nebo sekvestrující C:
   - **No-till** (viz [[no-till]]) — žádná oxidace půdního C
   - **Krycí plodiny** (viz [[mezi-plodiny]]) — C v půdě
   - **Hnojiva organická** místo mineralních — méně N₂O emisí
   - **Biouhel** (viz [[biouhel]]) — stabilní C 500+ let
   - **TTP konverze** (viz [[ttp]]) — louky uloží 2–4× víc C než orná
   - **Agrolesnictví** (viz [[agrolesnictvi]]) — stromy + zemědělství

2. **Certifikační organizace** ověří sekvestraci:
   - Půdní vzorky (před + po)
   - Modely (LCA, IPCC)
   - Satelitní data (viz [[satelity-zemedelstvi]])

3. **Vystavení carbon creditů**: 1 credit = 1 t CO₂e

4. **Prodej kreditů**:
   - **Voluntary market** (dobrovolný): korporace kupují pro ESG, klimatické cíle
   - **Compliance market** (povinný): EU ETS, kalifornské CCA (zatím bez zemědělství)

5. **Korporace** používá credits pro klimatickou neutralitu

**Cena uhlíkového kreditu:**

**Voluntary market (2024):**
- **High quality (additionality verified)**: 15–25 EUR/t CO₂
- **Standard quality**: 5–15 EUR/t CO₂
- **Junk credits** (kontroverzní): 1–5 EUR/t CO₂

**Compliance market (EU ETS, 2024):**
- **EU Allowance (EUA)**: 60–90 EUR/t CO₂
- Zemědělství zatím **MIMO ETS** (EU plánuje zahrnutí ~2030)

**Certifikační standards:**

**1. Verra VCS (Verified Carbon Standard):**
- **Globální #1**, ~75 % voluntary trhu
- Drahá certifikace, ale uznávaná
- Vlastní podstandardy: VM0042 (improved agricultural management), VM0017 (no-till)

**2. Gold Standard:**
- Důraz na **sociální dopad** + klimatický
- Vyšší cena kreditů

**3. American Carbon Registry (ACR):**
- USA, krajinné projekty

**4. Climate Action Reserve (CAR):**
- USA, agriculture-specific

**5. CDM** (Clean Development Mechanism):
- UN-řízený, post-Kyoto Protocol
- Klesající trh (Paris Agreement nahradil)

**EU-specifické platformy:**

**Climate Farmers (DE):**
- EU agroles, payments per t CO₂e
- ~20 EUR/t

**Soil Capital (BE):**
- Belgicko-francouzská, regenerative ag fokus
- Annual payments per ha podle implementace

**Indigo Ag (USA + EU):**
- Velká agtech platforma
- Carbon program + agronomic services

**eAgronom (EE):**
- Estonský software pro CZ + EU farmy
- Carbon credit certification servis

**EU CRCF (Carbon Removals Certification Framework):**

**Nařízení 2024** — nový EU právní rámec pro carbon credits:
- **Standardizace** výpočtů
- **Permanence** požadavky (carbon credit musí "vydržet" 100+ let pro sekvestraci)
- **Additionality** — credit jen pokud farma by sekvestraci NEDĚLALA without it
- **MRV** (Monitoring, Reporting, Verification) — pravidelná verifikace

**Cíl**: zvýšit kvalitu kreditů, vyhnout se greenwashingu

**Příklad ekonomiky pro CZ farmu (500 ha):**

**Implementace**:
- Přechod z orby na no-till + cover crops na celé 500 ha
- Investice do techniky (strip-till stroj): 1,5 mil. Kč
- Roční zvýšené náklady (osivo cover crops, postřik): +100 000 Kč/rok

**Sekvestrace** (typicky):
- 0,5 t C/ha/rok = 1,83 t CO₂e/ha/rok
- 500 ha × 1,83 = **916 t CO₂e/rok**

**Příjem z kreditů**:
- 916 t × 20 EUR/t = **18 320 EUR/rok = ~460 000 Kč/rok**

**Plus benefity**:
- Snížení nákladů na palivo (méně orby): 200 000 Kč/rok
- Snížení nákladů na hnojiva (lepší půda): 100 000 Kč/rok

**Net benefit**: ~660 000 Kč/rok (po odečtení vyšších nákladů)
**Návratnost techniky**: 2–3 roky

**Problémy a kritika:**

**1. Additionality (přidanost):**
- Credit je validní jen pokud farma sekvestraci by NEDĚLALA bez něj
- Sporné — velké farmy se přechodu na regen ag dělaly i bez creditů
- Risk **greenwashing**

**2. Permanence (trvalost):**
- Pokud farma za 10 let znovu zorá → uhlík se vrátí do atmosféry
- Carbon credit by měl být revoked
- Vyžaduje long-term contractual commitments

**3. Verification (ověření):**
- Měření C v půdě je drahé, často nepřesné
- Modely vs reálné měření
- Risk **over-crediting**

**4. Leakage:**
- Pokud farma A sekvestruje, ale farma B vedle ji nahradí intenzivnější praxí → net dopad = 0
- Globální leakage problém

**5. Equity issue:**
- Velké korporátní farmy mají lepší přístup k certifikaci než malé rodinné
- Risk **carbon colonialism** (rich farms sell credits to support more emissions elsewhere)

**6. Cena volatility:**
- Voluntary market: cena se hýbe 10× v rozsahu 5 let
- Risk pro farmáře dlouhodobě plánovat

**Renaissance carbon farming:**

**Důvody růstu trhu:**
1. **Paris Agreement** — globální klimatické cíle
2. **EU CRCF** — regulatorní jasnost
3. **ESG reporting** — povinnost korporací reportovat carbon footprint
4. **Net Zero pledges** — Microsoft, Apple, Google, Amazon kupují credits
5. **Carbon border tax** (CBAM) — EU bude penalizovat dovoz s vysokou CO₂

**Predikce trhu:**
- **2024**: 2–3 mld USD voluntary carbon market
- **2030**: 50–100 mld USD predikcí (McKinsey, BCG)
- **Zemědělství** = 20–30 % očekávaného trhu

**Jak začít na CZ farmě:**

1. **Zjistit baseline**: současný stav organické hmoty, půdní C
2. **Plánovat změny**: no-till, cover crops, redukce N hnojiv
3. **Najít platformu**: Climate Farmers, eAgronom, Soil Capital
4. **Smluvit verifikaci**: půdní vzorky, satelitní monitoring
5. **Implementovat 1+ rok**, pak žádat credits
6. **Prodat credits** přes platformu

**Náklady na zapojení**:
- Půdní vzorky: 5 000–15 000 Kč/farma
- Konzultace: 20 000–50 000 Kč
- Software/platform fee: 10–20 % z creditů

**Net příjem**: typicky 60–80 % z hrubého výnosu kreditů

Viz též [[karbonove-zemedelstvi]], [[regenerativni-zemedelstvi]], [[no-till]], [[mezi-plodiny]], [[biouhel]], [[ttp]], [[agrolesnictvi]], [[satelity-zemedelstvi]].`,
    related: ['karbonove-zemedelstvi', 'regenerativni-zemedelstvi', 'no-till', 'mezi-plodiny', 'biouhel', 'ttp', 'agrolesnictvi', 'satelity-zemedelstvi'],
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
  jednotky: 'Jednotky a měření',
  historie: 'Historie a archaické pojmy',
  chov: 'Chov a živočišná výroba',
  slang: 'Hovorové výrazy a slang',
  ochrana: 'Ochrana rostlin a postřiky',
  plodiny: 'Plodiny a komodity',
};
