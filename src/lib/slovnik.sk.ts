// Slovenská (sk) varianta slovníku — překlad CS hesel přes OpenAI (gpt-4o).
// 306 hesel; slug/kategorie/related/externalUrl/čísla identické s CS (SLOVNIK).
// Generováno scripts/gen-slovnik-sk.mjs. Overlay pattern jako slovnik.pl/uk.ts.
import type { SlovnikTerm, SlovnikKategorie } from './slovnik';

export const SLOVNIK_SK: SlovnikTerm[] = [
  {
    "slug": "adblue",
    "term": "AdBlue",
    "alias": [
      "DEF",
      "močovinová kvapalina",
      "Diesel Exhaust Fluid"
    ],
    "kategorie": "pohon",
    "shortDef": "AdBlue je 32,5% vodný roztok močoviny, ktorý sa vstrekúva do výfuku dieselových motorov, kde redukuje oxidy dusíka (NOx) na neškodný dusík a vodu.",
    "longDef": "AdBlue je obchodný názov pre vodný roztok močoviny (CO(NH₂)₂) v koncentrácii 32,5 %. Používa sa v systémoch selektívnej katalytickej redukcie (SCR) u dieselových motorov — vstrekúva sa pred SCR katalyzátor, kde reaguje s oxidmi dusíka z výfukových plynov.\n\nBez funkčného AdBlue moderný traktor (od emisnej normy Stage IV / Tier 4 Final) zníži výkon alebo úplne vypne — riadiaca jednotka detekuje nízku hladinu alebo nekvalitné AdBlue a aktivuje tzv. \"limp mode\".\n\nSpotreba AdBlue je typicky 3–5 % objemu nafty (na 100 l nafty cca 3–5 l AdBlue). Cena sa pohybuje okolo 15–25 Kč/l v IBC kontajneroch (1000 l), v 10-litrových kanystroch až 40 Kč/l.\n\nPozor na kvalitu — kontaminované AdBlue (prach, organické nečistoty) zničí drahý SCR katalyzátor (oprava 100 000+ Kč). Norma ISO 22241 špecifikuje čistotu — kupujte vždy s certifikátom.",
    "related": [
      "scr-katalyzator",
      "emisni-normy-stage",
      "dpf"
    ],
    "externalUrl": "https://cs.wikipedia.org/wiki/AdBlue",
    "externalLabel": "Wikipedia: AdBlue"
  },
  {
    "slug": "dpf",
    "term": "DPF",
    "alias": [
      "Diesel Particulate Filter",
      "filter pevných častíc"
    ],
    "kategorie": "pohon",
    "shortDef": "DPF (Diesel Particulate Filter) je filter pevných častíc vo výfuku dieselových motorov, ktorý zachytáva sadze a periodicky ich vypaluje pri tzv. regenerácii.",
    "longDef": "DPF je porézny keramický filter (typicky cordierit alebo karbid kremíka) inštalovaný za turbodmychadlom. Zachytáva pevné častice (PM, sadze) z výfukových plynov — bez neho by moderný diesel nesplnil emisné limity Stage IV / Stage V.\n\nFilter sa postupne zanáša a musí sa \"regenerovať\" — vypáliť sadze na CO₂. Existujú tri spôsoby:\n1. **Pasívna regenerácia** — pri vysokej teplote výfuku (>600 °C, napr. pri plnom ťahu), sadze sa vypália samy.\n2. **Aktívna regenerácia** — riadiaca jednotka vstrekne malé množstvo nafty pre zvýšenie teploty výfuku (beží automaticky na pozadí).\n3. **Servisná regenerácia** — ak prvé dve zlyhajú (krátke jazdy, nízka záťaž), nutná návšteva servisu.\n\nU traktorov je tretí scenár zriedkavý — traktor obvykle pracuje pod záťažou dlhé hodiny. Problémy nastávajú hlavne u traktorov na drobné komunálne práce (krátke rozjazdy, nízka teplota).\n\nŽivotnosť DPF: 8 000–15 000 motohodín podľa značky a údržby. Výmena stojí 80 000–200 000 Kč. Nedoporučujeme demontáž (DPF delete) — nelegálne, znehodnocuje stroj pri predaji a hrozí pokuta pri kontrole.",
    "related": [
      "adblue",
      "scr-katalyzator",
      "emisni-normy-stage"
    ],
    "externalUrl": "https://cs.wikipedia.org/wiki/Filtr_pevn%C3%BDch_%C4%8D%C3%A1stic"
  },
  {
    "slug": "scr-katalyzator",
    "term": "SCR katalyzátor",
    "alias": [
      "Selective Catalytic Reduction",
      "selektívna katalytická redukcia"
    ],
    "kategorie": "pohon",
    "shortDef": "SCR je systém pre redukciu oxidov dusíka (NOx) vo výfukových plynoch dieselových motorov pomocou vstrekovania AdBlue do špeciálneho katalyzátora.",
    "longDef": "Selektívna katalytická redukcia (SCR) je technológia čistenia výfukových plynov, ktorá redukuje NOx (oxidy dusíka) na neškodný dusík (N₂) a vodu (H₂O). Princíp:\n\n1. AdBlue (32,5% močovina) sa vstrekne pred SCR katalyzátor.\n2. Vysoká teplota výfuku rozkladá močovinu na amoniak (NH₃).\n3. NH₃ reaguje v katalyzátore s NOx za prítomnosti drahých kovov (vanád, wolfram) — vznikne N₂ a H₂O.\n\nSCR je dominantná technológia pre emisné normy Stage IV (od 2014) a Stage V (od 2020) u poľnohospodárskych traktorov. Alternatíva bola EGR (recirkulácia výfukových plynov) + DPF, ale tá vedie k vyššej spotrebe nafty (preto výrobcovia typu Fendt, JD, NH zvolili SCR ako primárnu cestu).\n\nŽivotnosť SCR katalyzátora je 8 000–15 000 motohodín. Výmena 100 000–250 000 Kč. Hlavné riziko: kontaminácia AdBlue (nečistoty, nesprávna koncentrácia) → zničenie v desiatkach hodín.",
    "related": [
      "adblue",
      "dpf",
      "emisni-normy-stage"
    ]
  },
  {
    "slug": "emisni-normy-stage",
    "term": "Emisné normy Stage / Tier",
    "alias": [
      "Stage I",
      "Stage V",
      "Tier 4 Final"
    ],
    "kategorie": "regulace",
    "shortDef": "Stage (EÚ) a Tier (USA) sú postupne sprísňované emisné normy pre vznetové motory mimosilničných strojov — od Stage I (1999) po súčasnú Stage V (2020).",
    "longDef": "Emisné normy pre mimosilničné dieselové motory (NRMM — Non-Road Mobile Machinery) sa v EÚ označujú ako Stage, v USA ako Tier. Norma reguluje limity emisií pevných častíc (PM), oxidov dusíka (NOx), uhľovodíkov (HC) a oxidu uhelnatého (CO).\n\nHlavné míľniky pre traktory v EÚ:\n- **Stage I** (1999–2001): základné limity, bez DPF a SCR.\n- **Stage II** (2001–2006): mierne zníženie NOx + PM.\n- **Stage IIIA** (2006–2011): ďalšie zníženie, motor s EGR.\n- **Stage IIIB** (2011–2014): povinný DPF.\n- **Stage IV** (2014–2019): povinný SCR (AdBlue).\n- **Stage V** (od 2020): najprísnejšie, povinný DPF + SCR + filter pre PM nano.\n\nPre nákup ojazdených strojov: model pred Stage IIIB (do 2011) typicky bez DPF — nižšie údržbové riziko, vyššia spotreba a emisie. Model Stage V (2020+) má najprísnejšie emisie, ale zložitý výfukový systém s drahou údržbou.\n\nUSA Tier paralelné: Tier 1 ≈ Stage I, ..., Tier 4 Final ≈ Stage IV. Stage V nie je v USA — americké normy zostali na Tier 4 Final.",
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
      "vstrekovanie common rail"
    ],
    "kategorie": "pohon",
    "shortDef": "Common Rail je vstrekovací systém dieselových motorov s vysokotlakovou spoločnou lištou (rail), ktorá dodáva palivo do elektronicky ovládaných vstrekovačov.",
    "longDef": "Common Rail je revolučný systém vstrekovania paliva u dieselových motorov (od konca 90. rokov). Hlavný princíp: vysokotlakové palivo (1500–2500 bar) je trvale v spoločnej lište (rail) a elektronicky ovládané vstrekovače dávkujú veľmi presné množstvo do valca.\n\nVýhody proti starším systémom (PD/Pumpe-Düse, čerpadlo-tryska):\n- Až 5–7 vstrekov na jeden zdvih (pilot, hlavný, post-injection) → tichší chod, čistejšie spaľovanie.\n- Vyšší tlak vstrekovania → lepšie rozprášenie paliva → nižšie PM emisie.\n- Elektronické ovládanie → jednoduché ladenie máp pre rôzne emisné normy.\n\nNevýhody:\n- Citlivosť na kvalitu paliva — voda alebo nečistoty zničia vstrekovače (1 ks 15 000–40 000 Kč).\n- Vysoké tlaky → drahá oprava vysokotlakového čerpadla (50 000+ Kč).\n- Diagnostika vyžaduje servisný softvér.\n\nCommon Rail je dnes štandard u všetkých moderných traktorov (Stage IV+). Životnosť pri dobrej kvalite paliva 10 000+ motohodín.",
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
    "shortDef": "ISOBUS je štandardizovaná komunikačná zbernica medzi traktorem a náradím (postrekovač, secí stroj, lis), ktorá umožňuje zdieľanie dát a ovládanie z jediného terminálu.",
    "longDef": "ISOBUS (ISO 11783) je medzinárodný štandard pre komunikáciu medzi traktorem, náradím a terminálom v kabíne. Pred ISOBUS mal každý výrobca náradia vlastný proprietárny kábel/protokol — secí stroj John Deere sa nedal prepojiť na traktor New Holland bez výmeny kompletnej elektroniky.\n\nČo umožňuje:\n- **UT (Universal Terminal)** — jedno zobrazenie v kabíne pre všetky ISOBUS náradia. Pripojíte secí stroj Lemken na traktor Fendt a UI sa naloguje na Fendt displej.\n- **TC-BAS (Task Controller Basic)** — počítanie odpracovanej plochy + spotreby materiálu.\n- **TC-GEO (Task Controller Geo)** — aplikačné mapy podľa GPS pozície (variable rate).\n- **TC-SC (Section Control)** — automatické vypínanie sekcií postrekovača/sečky v súvratích a prekrytí.\n- **TIM (Tractor Implement Management)** — náradie ovláda traktor (rýchlosť, zdvíhanie trojbodu) podľa aktuálnej situácie.\n\nISOBUS funkcie sú licencované — výrobca traktora účtuje za UT, TC-BAS, TC-GEO atď. samostatne (5 000–80 000 Kč za funkciu). Pred nákupom skontrolujte AEF Database (https://aef-online.org), či kombinácia traktor + náradie je certifikovaná.",
    "related": [
      "gps-rtk",
      "auto-steering",
      "variable-rate"
    ],
    "externalUrl": "https://www.aef-online.org/",
    "externalLabel": "AEF Database"
  },
  {
    "slug": "gps-rtk",
    "term": "RTK GPS",
    "alias": [
      "RTK",
      "Real-Time Kinematic"
    ],
    "kategorie": "precise-farming",
    "shortDef": "RTK je technológia GPS s presnosťou 2–3 cm pomocou korekčného signálu z referenčnej stanice. Štandard pre autonómnu navigáciu traktorov.",
    "longDef": "RTK (Real-Time Kinematic) je GPS technológia s centimetrovou presnosťou. Bežný GPS prijímač má presnosť 1–5 metrov, EGNOS/SBAS 0,5–1 m. RTK dosahuje 2–3 cm tým, že porovnáva GPS signál so signálom z fixnej referenčnej stanice (známa pozícia). Korekcia sa prenáša cez mobilnú sieť (NTRIP) alebo rádiový spoj.\n\nPre poľnohospodárstvo je RTK kľúčové pre:\n- **Autonómne riadenie** (auto-steering) — riadky perfektne paralelné, žiadne prekrytie ani vynechané pruhy.\n- **Variabilné dávkovanie** — presné dávkovanie hnojív/postrekov podľa GPS mapy.\n- **Strip-tilling a CTF** (Controlled Traffic Farming) — opakované prejazdy po rovnakých koľajniciach na zníženie utuženia.\n\nNa Slovensku sú dostupné komerčné RTK siete: Trimble VRS Now (cca 15 000 Kč/rok), Topcon TopNET Live, John Deere StarFire, CZEPOS (štátna, zadarmo s registráciou). Niektoré regióny majú vlastné lokálne stanice.\n\nAlternatíva: vlastná základňová stanica (50 000–150 000 Kč jednorázovo) — oplatí sa pre veľké podniky s niekoľkými strojmi.",
    "related": [
      "isobus",
      "auto-steering",
      "variable-rate"
    ],
    "externalUrl": "https://cs.wikipedia.org/wiki/Real-Time_Kinematic"
  },
  {
    "slug": "auto-steering",
    "term": "Auto-steering",
    "alias": [
      "autonómne riadenie",
      "auto-pilot",
      "AutoTrac",
      "IntelliSteer"
    ],
    "kategorie": "precise-farming",
    "shortDef": "Auto-steering je systém autonómneho riadenia traktora po naprogramovanej trajektórii s presnosťou RTK GPS — vodič nastaví riadky a stroj ide sám.",
    "longDef": "Auto-steering (autonómne riadenie, značky: John Deere AutoTrac, Trimble Autopilot, Case IH IntelliSteer, New Holland IntelliSteer) je systém, kde traktor automaticky drží GPS-naprogramovanú trajektóriu bez zásahu vodiča. Vodič ďalej ovláda pedále, zdvíhanie náradia a otáčanie v súvratiach.\n\nKomponenty:\n1. **GPS prijímač** s RTK korekciou (centimetrová presnosť).\n2. **Terminál** pre plánovanie riadkov (AB lines, krivky, kontúry).\n3. **Aktuátor riadenia** — elektrický motor na stĺpiku volantu alebo hydraulický ventil v systéme riadenia.\n\nHlavné výhody:\n- **Eliminácia prekrytia** — pásy postrekovača / sečky sa nepokryjú → úspora postreku/osiva 5–15 %.\n- **Menej únava vodiča** — 12-hodinová smena bez napätia na koncentráciu.\n- **Práca v noci a hmle** — presnosť nezávislá na viditeľnosti.\n- **Vyšší výkon** — možnosť jazdiť širšími strojmi rýchlejšie.\n\nCena: 150 000–500 000 Kč retrofit, 100 000–250 000 Kč ako továrenská opcia. Návratnosť typicky 2–4 roky u farmy >100 ha.",
    "related": [
      "gps-rtk",
      "isobus",
      "variable-rate"
    ]
  },
  {
    "slug": "variable-rate",
    "term": "Variabilné dávkovanie",
    "alias": [
      "VRA",
      "variabilné dávkovanie",
      "aplikačné mapy"
    ],
    "kategorie": "precise-farming",
    "shortDef": "Variabilné dávkovanie (VRA) je technika presného poľnohospodárstva, ktorá mení dávkovanie hnojív, osiva alebo postreku podľa GPS mapy s rôznymi hodnotami pre rôzne časti poľa.",
    "longDef": "Variabilné dávkovanie (VRA) je hlavný princíp presného poľnohospodárstva — aplikovať rôzne dávky hnojiva, osiva, postreku alebo závlahy podľa aktuálnych potrieb každého miesta poľa, nie jednotnú dávku na celú plochu.\n\nVstupné dáta pre VRA mapy:\n- **Pôdne rozbory** v gridu (10×10 alebo 30×30 m) → mapa pH, P, K, organická hmota.\n- **Výnosové mapy** z kombajnu (yield monitor) — kde to najviac vynáša.\n- **Satelitné snímky** (Sentinel-2, Planet) — NDVI index biomasy.\n- **Drony** s multispektrálnou kamerou — vysoké rozlíšenie 5 cm.\n\nWorkflow:\n1. Zber dát → agronomický softvér (Climate FieldView, John Deere Ops Center, Trimble Ag Software).\n2. Export aplikačnej mapy vo formáte ISO XML alebo SHP.\n3. Import do terminálu v kabíne (ISOBUS TC-GEO).\n4. Pri jazde stroj sám mení dávku podľa aktuálnej GPS pozície.\n\nTypická úspora hnojív 10–25 % bez zníženia výnosu (niekde aj s vyšším výnosom). Návratnosť VRA setupu (RTK + ISOBUS-capable hnojivo/seci stroj + softvér) 2–5 rokov na farme >150 ha.",
    "related": [
      "isobus",
      "gps-rtk",
      "auto-steering"
    ]
  },
  {
    "slug": "cvt-prevodovka",
    "term": "CVT prevodovka",
    "alias": [
      "Continuously Variable Transmission",
      "bezstupňová prevodovka",
      "Vario",
      "AutoPowr",
      "TTV"
    ],
    "kategorie": "technologie",
    "shortDef": "CVT (Continuously Variable Transmission) je bezstupňová prevodovka, ktorá umožňuje plynulú zmenu prevodového pomeru bez radenia stupňov. Štandard u prémiových traktorov.",
    "longDef": "CVT (Continuously Variable Transmission) je prevodovka, ktorá plynule mení prevodový pomer bez diskrétnych stupňov. U traktorov typicky kombinácia hydrostatického a mechanického prenosu (hydromechanická CVT, niekedy nazývaná \"power-split\").\n\nHlavné výhody:\n- **Optimálne otáčky motora** — vodič nastaví požadovanú rýchlosť, prevodovka sama drží motor v ekonomickom pásme (typicky 1500–1800 ot/min).\n- **Plynulý rozjazd a brzdenie** — žiadne trhnutie pri radení, lepšie pre náradie citlivé na rázy (lis, secí stroj).\n- **Tempomat** — drží presnú rýchlosť pri zmenách terénu/záťaže.\n- **Reverz bez spojky** — pre nakladanie s čelním nakladačom rýchlejšie než hydraulický reverz.\n\nHlavné značky CVT:\n- **Fendt Vario** — priekopník (1995), najdlhšie vyrábaná CVT, vysoká spoľahlivosť.\n- **John Deere AutoPowr / IVT** — od 7R nahor.\n- **Case IH CVX / CVT-Drive** — Puma, Magnum.\n- **New Holland Auto Command** — T6, T7, T8.\n- **Deutz-Fahr TTV** — Continuously Variable.\n- **Massey Ferguson Dyna-VT** — 6S, 7S, 8S.\n\nNevýhody: vyššia obstarávacia cena (200 000–500 000 Kč príplatok vs powershift), zložitejší servis, citlivosť na čistotu hydrauliky.",
    "related": [
      "powershift",
      "hydrostat"
    ]
  },
  {
    "slug": "powershift",
    "term": "Powershift prevodovka",
    "alias": [
      "čiastočný powershift",
      "fullpower shift",
      "PowrQuad"
    ],
    "kategorie": "technologie",
    "shortDef": "Powershift je prevodovka s mechanickými stupňami, ale radenie prebieha pod zaťažením bez stlačenia spojky pomocou hydraulických lamelových spojok.",
    "longDef": "Powershift prevodovka má mechanické prevodové stupne (ako manuál), ale radenie medzi stupňami sa deje pod zaťažením bez stlačenia spojky. Funguje to vďaka hydraulickým lamelovým spojkám, ktoré synchronizujú otáčky oboch hriadeľov počas radenia (~0,3 s).\n\nHlavné výhody:\n- **Radenie pod plnou záťažou** — nestráca sa rýchlosť ani moment, ideálne pre orbu a ťažké ťahové práce.\n- **Jednoduchšie ako CVT** — menej súčastí, lacnejší servis.\n- **Životnosť** — typicky 10 000+ motohodín bez veľkej opravy.\n\nVarianty:\n- **Polovičný powershift** (semi-powershift) — časť stupňov manuálna, časť powershift (napr. 24×24 so 4-stupňovým powershiftom).\n- **Plný powershift** (full powershift) — všetkých 16–24 stupňov radí pod zaťažením (napr. John Deere 6M PowrQuad, Case IH Maxxum ActiveDrive).\n\nNevýhody oproti CVT: vodič musí ručne vyberať stupeň (alebo sa spoliehať na automatický mód, ktorý občas zaradí nevhodne), motor nebeží vždy v optimálnych otáčkach.\n\nCenovo: o 100 000–300 000 Kč lacnejšie ako ekvivalentné CVT. Vyplatí sa u traktorov, kde majoritné využitie je orba a podobné stále zaťaženie.",
    "related": [
      "cvt-prevodovka",
      "hydrostat"
    ]
  },
  {
    "slug": "hydrostat",
    "term": "Hydrostatická prevodovka",
    "alias": [
      "HST",
      "hydrostat"
    ],
    "kategorie": "technologie",
    "shortDef": "Hydrostatická prevodovka prenáša výkon cez hydraulické čerpadlo a motor — bezstupňová zmena rýchlosti pomocou joysticku alebo pedálu, používaná u malých traktorov a kombajnov.",
    "longDef": "Hydrostatická prevodovka (HST — Hydrostatic Transmission) prenáša výkon motora cez hydraulické čerpadlo na hydraulický motor, ktorý poháňa kolesá. Zmena rýchlosti sa deje variáciou výkonu čerpadla — od plného cúvania cez nulu po plnú rýchlosť vpred, plynule.\n\nHlavné použitie v poľnohospodárstve:\n- **Malé traktory** (kompaktné 25–60 koní, napr. Kubota L-Series) — ovládanie joystickom, vhodné pre nepretržitú zmenu rýchlosti pri nakládke, kosení trávnikov.\n- **Kombajny** — pojezd HST, na PTO mechanický pohon.\n- **Nakladače** (čelné, kĺbové) — HST je štandard.\n- **Komunálne stroje** — kosačky, multifunkčné nosiče.\n\nVýhody: jednoduché ovládanie (pedál alebo joystick), žiadne radenie, plynulé manévrovanie. Nevýhody: nižšia účinnosť ako mechanická prevodovka (15–25 % straty), nevhodné pre veľké ťahové práce na poli (rýchlo sa zahrieva, stráca výkon).\n\nU veľkých poľných traktorov (100+ koní) sa HST nepoužíva ako hlavný pohon — namiesto toho hydromechanická CVT (kombinácia HST + mechanického prenosu pre lepšiu účinnosť).",
    "related": [
      "cvt-prevodovka",
      "powershift"
    ]
  },
  {
    "slug": "npk-hnojivo",
    "term": "NPK hnojivo",
    "alias": [
      "NPK",
      "minerálne hnojivo"
    ],
    "kategorie": "hnojivo",
    "shortDef": "NPK je minerálne hnojivo obsahujúce tri hlavné živiny — dusík (N), fosfor (P) a draslík (K). Označenie napr. 15-15-15 znamená 15 % každej živiny.",
    "longDef": "NPK hnojivo je minerálne (anorganické) hnojivo, ktoré obsahuje tri hlavné makroživiny v rôznych pomeroch: dusík (N — Nitrogen), fosfor (P — Phosphorus) a draslík (K — Kalium / Potassium).\n\nOznačenie: číselný kód udáva percentá jednotlivých živín v sušine. Príklady:\n- **NPK 15-15-15** — vyrovnané, univerzálne, 15 % N, 15 % P₂O₅, 15 % K₂O.\n- **NPK 11-44-11** — štartovacie do osiva (vysoký fosfor pre rozvoj koreňov).\n- **NPK 8-20-30** — jesenné pod ozimy (nízky N, vysoký K).\n- **NPK 20-10-10** — jarné top dressing pre pšenicu.\n\nDôležitá poznámka: P sa uvádza ako **P₂O₅** (oxid), K ako **K₂O** — nie čisté prvky. Pre prepočet:\n- 1 kg P = 2,29 kg P₂O₅\n- 1 kg K = 1,20 kg K₂O\n\nStopové prvky (S, Mg, Ca, B, Zn, Cu) sú v NPK plus formách (napr. NPK + S, NPK Mikro). Aktuálna cena NPK 15-15-15 sa pohybuje okolo 13 000–18 000 Kč/t v závislosti na sezóne a pôvode.\n\nPre variabilné dávkovanie (VRA) podľa GPS máp vyžaduje secí stroj alebo rozmetadlo s ISOBUS TC-GEO.",
    "related": [
      "variable-rate",
      "pH-pudy",
      "mocovina"
    ]
  },
  {
    "slug": "mocovina",
    "term": "Močovina",
    "alias": [
      "urea",
      "karbamid",
      "močovinové hnojivo"
    ],
    "kategorie": "hnojivo",
    "shortDef": "Močovina (chemicky urea, CO(NH₂)₂) je najkoncentrovanejšie dusíkaté hnojivo — obsahuje 46 % N, najlacnejšie za jednotku dusíka.",
    "longDef": "Močovina (urea, karbamid) je organická zlúčenina vzorca CO(NH₂)₂. Ako hnojivo je najkoncentrovanejší dusíkatý zdroj — 46 % N v sušine. Vyrába sa priemyselne zo syntetického amoniaku a CO₂.\n\nHlavné vlastnosti:\n- **Najlacnejšie za jednotku N** — typicky 15–20 % lacnejšie ako síran amónny alebo dusičnan amónny (per kg dusíka).\n- **Oneskorený účinok** — N sa najprv musí enzymaticky rozložiť na amoniak → nitrifikácia → nitrát (cca 1–3 týždne).\n- **Riziko strát volatilizáciou** — pri aplikácii na povrch a teplom suchom počasí môže 10–30 % N uniknúť ako NH₃ do atmosféry. Rieši sa zapravením pod povrch alebo inhibítorom ureázy (NBPT).\n\nAplikácia:\n- Pod ozimú pšenicu jarný top dressing 100–250 kg/ha (= 46–115 kg N/ha).\n- Pre kukuricu štart + bočné hnojenie 200–500 kg/ha.\n- Listové hnojivá 5–15 kg/ha v roztoku.\n\nMočovina sa používa aj ako surovina pre AdBlue (32,5% roztok) — rovnaká molekula, ale vyššia čistota.",
    "related": [
      "npk-hnojivo",
      "adblue"
    ]
  },
  {
    "slug": "pH-pudy",
    "term": "pH pôdy",
    "kategorie": "agrotechnika",
    "shortDef": "pH pôdy je miera kyslosti — pod 7 kyslá, nad 7 zásaditá. Ideálne pre väčšinu poľných plodín je pH 6,0–7,0. Korekcia vápnením alebo síranom amónnym.",
    "longDef": "pH pôdy je logaritmická miera koncentrácie vodíkových iónov (H⁺). Škála 0–14, neutrálne 7. Pôdy v ČR sú väčšinou mierne kyslé (pH 5,5–6,8) vďaka zrážkam a vyplavovaniu vápnika.\n\nOptimálne pH pre hlavné plodiny:\n- **Pšenica, jačmeň, kukurica**: 6,0–7,0\n- **Cukrová repa**: 6,5–7,5 (citlivá na kyslosť)\n- **Zemiaky**: 5,5–6,5 (znášajú slabo kyslé)\n- **Ľuľok, ďatelina**: 6,5–7,0\n- **Čučoriedka, brusnica**: 4,5–5,5 (potrebujú kyslé)\n\nDôsledky nesprávneho pH:\n- **Príliš kyslé** (pH < 5,5): blokuje príjem P, K, Mg; aktivuje toxický Al, Mn; znižuje činnosť mikroorganizmov. Riešenie: vápnenie (uhličitan vápenatý CaCO₃, dolomitické vápno) 2–6 t/ha.\n- **Príliš zásadité** (pH > 7,5): blokuje príjem mikroprvkov (Fe, Mn, Zn, B). Riešenie: síran amónny, elementárna síra, organická hmota.\n\nMeranie: pôdny rozbor v akreditovanej laboratórii (ÚKZÚZ Brno, ČZU Praha) — typicky 500–1500 Kč za 5 vzoriek. Plánujte 1× za 4–6 rokov.\n\nPre variabilné vápnenie (VRA) podľa GPS gridu rozbory v 30×30 m mriežke → mapa pH → aplikačná mapa pre rozmetadlo.",
    "related": [
      "npk-hnojivo",
      "variable-rate"
    ],
    "alias": []
  },
  {
    "slug": "mezi-plodiny",
    "term": "Meziplodiny",
    "alias": [
      "krycie plodiny",
      "cover crops",
      "EFA meziplodiny"
    ],
    "kategorie": "agrotechnika",
    "shortDef": "Meziplodiny sú rastliny vysievané medzi dvoma hlavnými plodinami na zlepšenie pôdnej úrodnosti, ochranu proti erózii a viazanie dusíka. Podmienka EKO režimu CAP 2024.",
    "longDef": "Meziplodiny (cover crops) sú plodiny vysievané v období medzi zberom hlavnej plodiny a siatím ďalšej, často cez zimu alebo letný úhor. Slúžia k:\n\n1. **Ochrane pôdy proti erózii** — pokrývajú povrch v období dažďov a vetra.\n2. **Viazaniu dusíka** (strukovinné meziplodiny: vikev, hrach, lupina) — baktérie Rhizobium fixujú vzdušný N₂.\n3. **Mobilizácii živín** — košatý koreňový systém vytiahne P, K z hlbších vrstiev.\n4. **Zvyšovaniu obsahu organickej hmoty** — biomasa zaoraná tvorí humus.\n5. **Boj s burinami a chorobami** — rušivý vplyv na životný cyklus niektorých burín.\n6. **Viazaniu CO₂** — uhlík v pôde je dlhodobo sekvestrovaný.\n\nTypické druhy:\n- **Horčica biela** — rýchla, lacná, dusíkofilná.\n- **Svazenka** — rýchly rast, vhodná do letného úhoru.\n- **Vikev huňatá + žito** — zimná mez, vhodné pred jarnou plodinou.\n- **Ďatelina inkarnát** — viazanie N, krmivo.\n- **Pohánka** — pre letnú krátku meziplodinu.\n\nV CAP 2024 sú meziplodiny súčasťou EKO režimu (premium sadzba 2400 Kč/ha) a EFA (Ecological Focus Areas). Pri počítaní kompenzácie 1 ha meziplodiny = 0,3 ha EFA.",
    "related": [
      "eko-platba",
      "biopasy",
      "cap-2024"
    ]
  },
  {
    "slug": "biopasy",
    "term": "Biopásy",
    "alias": [
      "biokoridor",
      "krajinné prvky"
    ],
    "kategorie": "agrotechnika",
    "shortDef": "Biopásy sú neoseté pruhy medzi hlavnými plodinami, určené pre biodiverzitu, hmyz, vtáctvo a malú zver. Súčasť EFA a EKO režimu CAP.",
    "longDef": "Biopásy sú neproduktivní pruhy v poľných plochách (typicky 6–20 m široké), ktoré slúžia ako útočisko pre divokú faunu — opylovače, drobnú zver, vtáctvo. Môžu byť oseté špeciálnymi zmesami (medonosné kvitnúce rastliny) alebo ponechané ako autonómny úhor.\n\nTypy biopásov:\n- **Nektarodárny biopás** — zmes kvitnúcich rastlín (svazenka, slnečnica, pohánka, jetel, vičence). Kľúčový pre včely a divoké opylovače.\n- **Krmný biopás** — pre koroptve, bažanty, zajace — obiloviny, slnečnica, kukurica.\n- **Trávny pás** — proti erózii, pozdĺž vodotečí.\n- **Biopás okraj poľa** — 6–12 m široký, povinný pre niektoré eko-režimy.\n\nV CAP 2024:\n- Biopásy patria do **EFA** (Ecological Focus Areas) — koeficient 1,5 (1 ha biopásu = 1,5 ha EFA).\n- Premium EKO režim vyžaduje min. 7 % výmery v EFA (z toho biopásy + meziplodiny + krajinné prvky).\n- Špeciálna výzva v PRV: dotácia na založenie biopásu (typicky 8 000–18 000 Kč/ha podľa zmesi).\n\nPraktické pravidlá: biopás nesmie byť kosený pred koncom hniezdenia (1.8.), nesmie byť postriekaný pesticídmi, údržba 1× ročne mulčovaním alebo zberom.",
    "related": [
      "mezi-plodiny",
      "eko-platba",
      "cap-2024"
    ]
  },
  {
    "slug": "cap-2024",
    "term": "CAP 2024",
    "alias": [
      "Spoločná poľnohospodárska politika",
      "SZP 2023-2027"
    ],
    "kategorie": "dotace",
    "shortDef": "CAP 2024 (Common Agricultural Policy, česky SZP) je program priamych platieb EÚ pre poľnohospodárov v období 2023–2027. Hlavné platby: BISS, CISS, EKO, ANC, VCS.",
    "longDef": "Spoločná poľnohospodárska politika (SZP, EN: CAP — Common Agricultural Policy) je hlavný finančný nástroj EÚ pre podporu poľnohospodárstva. Aktuálne obdobie 2023–2027 prinieslo zásadnú reformu — viac dôrazu na ekologiu (greening), redistribúciu v prospech menších fariem a zachovanie prírodných zdrojov.\n\nHlavné složky pre SR (orientačné sadzby 2024):\n1. **BISS** (Basic Income Support for Sustainability) — Základná platba, ~2150 Kč/ha na všetky spôsobilé plochy.\n2. **CISS** (Complementary Redistributive Income Support) — Redistributívna platba, ~1450 Kč/ha pre prvých 150 ha. Podporuje malé farmy.\n3. **EKO-platba** (Eco-scheme) — Základná 1300 Kč/ha, premium 2400 Kč/ha za viac eko-praktík (meziplodiny, biopásy, neproduktivní plochy).\n4. **ANC** (Areas with Natural Constraints) — Menej priaznivé oblasti, horská 4500 Kč/ha, OA/SV 2000 Kč/ha.\n5. **Mladý poľnohospodár** — Bonus 1500 Kč/ha pre prvých 150 ha (do 40 rokov, max 5 rokov).\n6. **VCS** (Voluntary Coupled Support) — Citlivé sektory: chmeľ 13000 Kč/ha, polná zelenina 9000 Kč/ha, cukrová repa 7500 Kč/ha, ovocie 6500 Kč/ha, zemiaky na škrob 5500 Kč/ha, bielkoviny 2800 Kč/ha, ľan 4500 Kč/ha, krmné 1100 Kč/ha.\n\nŽiadosť sa podáva jednorazovo v Jednotnej žiadosti (typicky apríl–jún, podáva sa elektronicky cez Portál farmára SZIF). Záväzné sadzby SZIF zverejňuje po uzávierke kampane.\n\nPre orientačný výpočet: [Kalkulačka dotácií CAP](/kalkulacka/dotacie-cap/).",
    "related": [
      "eko-platba",
      "mezi-plodiny",
      "biopasy"
    ],
    "externalUrl": "https://www.szif.cz",
    "externalLabel": "SZIF — Štátny poľnohospodársky intervenčný fond"
  },
  {
    "slug": "eko-platba",
    "term": "EKO-platba",
    "alias": [
      "Eco-scheme",
      "greening",
      "eko režim"
    ],
    "kategorie": "dotace",
    "shortDef": "EKO-platba je časť CAP 2024 podporujúca ekologické praktiky. Základná sadzba ~1300 Kč/ha, premium ~2400 Kč/ha za viac eko-opatrení.",
    "longDef": "EKO-platba (Eco-scheme) je dobrovoľná časť priamych platieb CAP 2024, ktorá odmeňuje poľnohospodárov za environmentálne prínosné praktiky nad rámec povinných podmienok.\n\nDva režimy v SR:\n1. **Základný EKO režim** — ~1300 Kč/ha. Povinné opatrenia ako pestrá rotácia plodín, sankcie za monokultúry, dodržiavanie krajinných prvkov.\n2. **Premium EKO režim** — ~2400 Kč/ha. Vyžaduje navyše:\n   - Min. 7 % EFA (Ecological Focus Areas) z ornej pôdy — meziplodiny + biopásy + krajinné prvky.\n   - Pásové pravidlá pozdĺž vodotečí (min. 3 m bez pesticídov).\n   - Kvalitné krycie plodiny alebo strnisko cez zimu.\n\nBez aspoň základného EKO režimu farma stráca významnú časť priamych platieb — preto je v praxi 95+ % poľnohospodárov v EKO režime.\n\nPre výpočet: rozdiel medzi základom a premium je 1100 Kč/ha. U farmy 200 ha = 220 000 Kč/rok navyše. Ak zavedenie premium praktík (osivo meziplodín, výsev, kosenie biopásov) stojí <1100 Kč/ha, oplatí sa.\n\nV praxi výnos premium praktík ide nahor (lepšia pôda, menej erózií stratené orničnej vrstvy) — net pozitívny aj bez dotačnej prémie u dlhodobej farmy.",
    "related": [
      "cap-2024",
      "mezi-plodiny",
      "biopasy"
    ]
  },
  {
    "slug": "lpis",
    "term": "LPIS",
    "alias": [
      "Land Parcel Identification System",
      "evidence pôdy"
    ],
    "kategorie": "dotace",
    "shortDef": "LPIS je centrálna evidencia poľnohospodárskej pôdy v SR — každý pozemok má unikátny LPIS blok, na ktorý sa viažu dotačné žiadosti a katastrálne údaje.",
    "longDef": "LPIS (Land Parcel Identification System) je verejná evidencia spôsobilej poľnohospodárskej pôdy v SR, ktorú spravuje ÚKZÚZ a používa SZIF na kontrolu dotácií. Každý pozemok používaný na poľnohospodárstvo má unikátny **LPIS blok** s vlastným kódom (napr. \"1234/56\").\n\nČo LPIS obsahuje:\n- **Hranice pôdneho bloku** v GIS — presne podľa DPB (diely pôdnych blokov).\n- **Kultúru** — orná pôda, TTP (trvalý travný porast), sad, vinice, chmelnice, ostatné.\n- **Výmery** v ha.\n- **Začlenenie do ANC** kategórie (horské H1–H5, OA, SV alebo mimo ANC).\n- **Krajinné prvky** v bloku — solitérny strom, mez, biokoridor.\n- **Erozné ohrozenie** — kategórie M (mierne), S (silne) ovplyvňuje pravidlá pre osetie.\n- **Vlastnícke vzťahy** — kto je užívateľom (žiadateľ o dotácie).\n\nLPIS dáta sú verejne dostupné: https://eagri.cz/public/web/mze/farmar/LPIS/ — ktokoľvek vidí hranice a kultúru (nie vlastníka).\n\nAktualizácia LPIS: poľnohospodár hlási zmeny (rozdelenie, zlúčenie, zmena kultúry) ÚKZÚZ. Bez aktuálneho LPIS nie je možné podať žiadosť o priame platby ani investičné dotácie.",
    "related": [
      "cap-2024",
      "biss",
      "dpb"
    ],
    "externalUrl": "https://eagri.cz/public/web/mze/farmar/LPIS/"
  },
  {
    "slug": "biss",
    "term": "BISS",
    "alias": [
      "Basic Income Support for Sustainability",
      "Základná platba",
      "SAPS"
    ],
    "kategorie": "dotace",
    "shortDef": "BISS je hlavná priama platba CAP 2024 — ~2150 Kč/ha na všetku spôsobilú poľnohospodársku plochu. Nahradila predchádzajúcu SAPS.",
    "longDef": "BISS (Basic Income Support for Sustainability) je základná priama platba CAP 2024 — nahrádza predchádzajúcu SAPS (Single Area Payment Scheme). Vypláca sa na všetku spôsobilú poľnohospodársku plochu evidovanú v LPIS.\n\nSadzba 2024: ~2150 Kč/ha. Pre farmu 100 ha = 215 000 Kč/rok len BISS, plus ďalšie zložky (CISS, EKO, ANC, VCS) dohromady 6 000–15 000 Kč/ha.\n\nPodmienky pre nárok:\n1. **Aktívny poľnohospodár** — pravidelná poľnohospodárska činnosť, nie len \"držať pôdu\".\n2. **Žiadosť cez Jednotnú žiadosť SZIF** — apríl–jún, elektronicky cez Portál farmára.\n3. **Min. výmera 1 ha** — pod tým sa nárok neuplatňuje.\n4. **Kondicionality** — povinné praktiky GAEC + povinné požiadavky riadenia SMR (welfare, pôda, voda).\n\nVyplácanie: SZIF vypláca v jesenných termínoch (typicky október–december) za predchádzajúcu kampaň. Pri kontrole na mieste a zistení nezrovnalostí môže byť sankcia 1–100 % aj s vrátením predchádzajúcich platieb.\n\nPre orientačný výpočet vašej celkovej dotácie: [Kalkulačka dotácií CAP](/kalkulacka/dotace-cap/).",
    "related": [
      "cap-2024",
      "lpis",
      "eko-platba"
    ]
  },
  {
    "slug": "dpb",
    "term": "DPB (Diel pôdneho bloku)",
    "alias": [
      "Diel pôdneho bloku"
    ],
    "kategorie": "dotace",
    "shortDef": "DPB (Diel pôdneho bloku) je najmenšia jednotka v LPIS — súvislá plocha jedného poľnohospodára s jednou kultúrou. Tvorí základ pre žiadosť o dotácie.",
    "longDef": "Diel pôdneho bloku (DPB) je atomická jednotka evidencie v LPIS — súvislá plocha v majetku alebo nájme jedného užívateľa s jednou kultúrou (orná pôda, TTP, sad, vinice, chmelnice). Každý DPB má unikátny identifikátor a vlastný GIS polygon.\n\nPríklad: poľnohospodár hospodári na 5 poliach — každé pole = jeden DPB v LPIS. Ak časť poľa je osetá cukrovkou a druhá pšenicou, sú to dva DPB (rovnaká kultúra \"orná pôda\", ale s rôznymi osevmi).\n\nDPB je zásadný pre:\n- **Žiadosť o priame platby** — výmera každého DPB sa sčíta pre BISS/CISS.\n- **VCS** — niektoré VCS sadzby sa aplikujú per DPB (citlivé sektory).\n- **ANC** — zaradenie do ANC kategórie je per DPB.\n- **Erozné pravidlá** — kategória erozného ohrozenia (M, S) je per DPB.\n- **EFA** — meziplodiny, biopásy sa hlásia ako podiel DPB.\n\nZmeny DPB hlásia užívatelia cez Portál farmára alebo na obecných úradoch (rozdelenie, zlúčenie, zmena kultúry). Bez aktuálneho DPB v LPIS nie je možné podať žiadosť.\n\nOnline: hranice a kultúra všetkých DPB sú verejné na https://eagri.cz/public/web/mze/farmar/LPIS/.",
    "related": [
      "lpis",
      "biss",
      "cap-2024"
    ]
  },
  {
    "slug": "ttp",
    "term": "TTP (Trvalý travný porost)",
    "alias": [
      "lúka",
      "pastvina",
      "permanent grassland"
    ],
    "kategorie": "agrotechnika",
    "shortDef": "TTP je trvalý travný porost — lúka alebo pastvina, kde sa 5+ rokov nepodrobila orbe. Špeciálna kategória v LPIS s vlastnými pravidlami pre dotácie.",
    "longDef": "Trvalý travný porost (TTP) je pôdny blok osetý trávami alebo trávami s leguminózami, ktorý nebol orán a osetý inou plodinou dlhšie ako 5 rokov. V LPIS je TTP samostatná kultúra, odlišná od ornej pôdy.\n\nPravidlá pre TTP v CAP 2024:\n- **Zákaz orby** — TTP nemožno preorať bez špeciálneho povolenia (= strata statusu TTP, sankcia za \"trvalé znehodnotenie permanent grassland\").\n- **Citlivé TTP** v Natura 2000 alebo CHKO: úplný zákaz orby.\n- **Min. zaťaženie dobytkom** (pastevné TTP) — ak TTP neslúži ako pastva, vyžaduje sa kosenie 1–2× ročne.\n- **EKO režim** — TTP nepotrebuje meziplodiny ani rotáciu (sú per definíciu \"trvalé\") — automaticky kvalifikuje na základnú EKO sadzbu.\n- **ANC** — TTP v horských oblastiach (H1–H5) má vysoké ANC sadzby (až 7000 Kč/ha za horské pastviny).\n\nV SR je ~25 % poľnohospodárskej plochy v TTP (cca 900 000 ha). Hlavne v horských a podhorských oblastiach (Juhočeský, Plzeňský, Vysočina, Zlínsky, Moravskoslezský kraj).\n\nTTP má dôležitú ekologickú hodnotu (biodiverzita, zadržiavanie vody, sekvestrácia uhlíka) — preto je štátom chránený pred preoraním.",
    "related": [
      "lpis",
      "cap-2024",
      "pastvina"
    ]
  },
  {
    "slug": "pto",
    "term": "PTO (Vývodový hriadeľ)",
    "alias": [
      "Power Take-Off",
      "vývodový hriadeľ",
      "vývodovka"
    ],
    "kategorie": "technologie",
    "shortDef": "PTO (Power Take-Off) je vývodový hriadeľ na traktore pre pohon náradia — secí stroj, sečka, lis, postrekovač. Štandardné otáčky 540 alebo 1000 ot/min.",
    "longDef": "PTO (Power Take-Off, vývodový hriadeľ) je rotujúci hriadeľ na zadnej (alebo prednej) časti traktora, ktorý prenáša výkon motora na pripojené náradie — sečku, lis, secí stroj, postrekovač, mulčovač, snopovač, kombajn závesný.\n\nŠtandardné otáčky:\n- **540 ot/min** — historicky najstaršie, dodnes pre malé náradie (mulčovač, sečka, malé postrekovače).\n- **1000 ot/min** — vyššie pre veľké náradie (lisy, kombajny závesné, veľké postrekovače).\n- **540E (Economy)** — moderný úsporný režim, traktor beží na 1500 ot/min motora, PTO drží 540 → úspora 10–15 % paliva.\n- **1000E (Economy)** — paralelne pre 1000 ot.\n\nHriadeľ:\n- **6drážkový** — štandard pre 540 ot.\n- **21drážkový** — pre 1000 ot, vyššia pevnosť.\n\nBezpečnosť: PTO je veľmi nebezpečné — rotujúci hriadeľ s obvodovou rýchlosťou 10+ m/s môže strhnúť oblečenie a spôsobiť smrť. Vždy s krytom (kryt náradia + kryt na traktore). Pred odpojovaním vypnite motor.\n\nNiektoré moderné traktory majú **PTO autostop** — PTO sa sám vypne pri zastavení/zdvihovaní trojbodu.",
    "related": [
      "hydraulika-traktor",
      "tribod"
    ]
  },
  {
    "slug": "tribod",
    "term": "Trojbodový záves",
    "alias": [
      "trojbod",
      "3-bod",
      "three-point hitch"
    ],
    "kategorie": "technologie",
    "shortDef": "Trojbodový záves je štandardizovaný systém na pripojenie náradia k zadnej (alebo prednej) časti traktora — dva spodné ťahadlá + jedno horné ťahadlo.",
    "longDef": "Trojbodový záves (3-bodový hitch, three-point linkage) je najdôležitejšia štandardizácia v poľnohospodárstve — umožňuje pripojiť akékoľvek náradie k akémukoľvek traktoru bez prestavby. Vynalezl ho Harry Ferguson v 30. rokoch 20. storočia (Ferguson System).\n\nKomponenty:\n- **Dve spodné zdvíhacie ťahadlá** (lower lift arms) — hydraulicky zdvíhané, určujú výšku náradia.\n- **Jedno horné ťahadlo** (top link) — fixná dĺžka, určuje sklon náradia.\n- **Stabilizačné ťahadlá** (check chains) — obmedzujú bočný pohyb.\n\nKategórie podľa pevnosti a veľkosti zdvíhacích guľových čapov:\n- **Cat I** — malé traktory do 40 koní, Ø 22 mm čapy.\n- **Cat II** — stredné 40–100 koní, Ø 28 mm.\n- **Cat III** — veľké 80–225 koní, Ø 36 mm.\n- **Cat IV** — najväčšie 180+ koní, Ø 45 mm.\n- **Cat IV-N** — užšia verzia pre lepšiu manipuláciu.\n\nZdvíhacia kapacita: uvádza sa na koncoch ťahadiel (lift capacity at hitch point) — typicky 3 500 kg pre Cat II, 6 500 kg pre Cat III, 12 000+ kg pre Cat IV.\n\n**Predný trojbod** — moderná voľba u prémiových traktorov (Fendt, JD), umožňuje plniť pole náradím \"v sendviči\" (jedno náradie vpredu, druhé vzadu) → vyššia produktivita.",
    "related": [
      "pto",
      "hydraulika-traktor"
    ]
  },
  {
    "slug": "hydraulika-traktor",
    "term": "Hydraulika traktora",
    "alias": [
      "hydraulický okruh",
      "PFC",
      "load sensing"
    ],
    "kategorie": "technologie",
    "shortDef": "Hydraulika traktora poháňa trojbod, externé výstupy pre náradie a často aj riadenie. Moderné systémy: load sensing (LS), Power Flow Control (PFC).",
    "longDef": "Hydraulický systém traktora obsluhuje:\n1. **Trojbodový záves** — zdvíhanie náradia.\n2. **Externé výstupy** (SCV — Selective Control Valves) — pohon hydraulických funkcií náradia (sklápací postrekovač, zavlažovací valec, naviják).\n3. **Posilovač riadenia** (power steering).\n4. **Spojku PTO**, **diferenciálnu uzávierku**, **4×4 spojku**.\n\nTypy hydraulických systémov:\n- **Open Center** — historický, čerpadlo trvale dodáva plný prietok, prebytky tečú späť do nádrže. Jednoduché, nízka účinnosť, dobré pre ľahké náradie.\n- **Closed Center s LS (Load Sensing)** — moderný štandard, čerpadlo dodáva len toľko tlaku a prietoku, koľko náradie požaduje. Vyššia účinnosť (úspora 5–15 % paliva).\n- **PFC (Pressure Flow Compensation)** — prémiová varianta LS, ešte presnejšia regulácia.\n\nKľúčové parametre:\n- **Max. tlak** — typicky 200 bar (malé) až 250 bar (prémiové).\n- **Max. prietok** — 60 l/min malé traktory, 200+ l/min top modely.\n- **Počet SCV** — 2 štandard, 4–6 prémiové (pre komplexné náradie ako veľký postrekovač).\n\nOlej: hydraulický + prevodový spoločný (UTTO — Universal Tractor Transmission Oil), výmena 1× za 1500–3000 motohodín. Pozor na miešanie s ATF alebo motorovým olejom — nekompatibilné.",
    "related": [
      "tribod",
      "pto"
    ]
  },
  {
    "slug": "hektar",
    "term": "Hektár (ha)",
    "alias": [
      "ha",
      "jednotka plochy"
    ],
    "kategorie": "jednotky",
    "shortDef": "Hektár (ha) je jednotka plochy = 10 000 m² = 100 × 100 m. Štandardná jednotka v poľnohospodárstve pre výmeru polí, dotácie, výnosy.",
    "longDef": "Hektár (ha) je jednotka plošného obsahu metrickej sústavy. 1 ha = 10 000 m² = 100 a (árov). Vizuálne: štvorec 100 × 100 m, alebo futbalové ihrisko 1,5×.\n\nV poľnohospodárstve je hektár základná jednotka pre:\n- **Výmeru poľa** — celá farma sa meria v ha (50 ha, 200 ha, 1000 ha).\n- **Dotácie** — Kč/ha (BISS 2150 Kč/ha, CISS 1450 Kč/ha).\n- **Výnos plodín** — t/ha alebo q/ha (1 q = 100 kg = 1 metrický cent).\n- **Spotreba hnojív** — kg/ha (200 kg NPK/ha).\n- **Dávkovanie postrekov** — l/ha (5 l Roundup/ha).\n- **Výkon strojov** — ha/h (postrekovač 12 m záber × 12 km/h = 14,4 ha/h teoreticky).\n\nPrevod:\n- 1 km² = 100 ha\n- 1 míľa² (USA) = 259 ha\n- 1 akr (USA) = 0,405 ha (akr × 0,405 = ha)\n- 1 morgen (DE/AT) = 0,25–0,34 ha podľa regiónu (historická)\n\nV SR farmy 1–50 ha = \"drobní farmári\", 50–500 ha = \"strední\", 500–5000 ha = \"veľkí\", 5000+ ha = \"priemyselné podniky\".",
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
    "term": "Cent (q)",
    "alias": [
      "q",
      "metrický cent",
      "kvintál"
    ],
    "kategorie": "jednotky",
    "shortDef": "Cent (q) je jednotka hmotnosti = 100 kg. V poľnohospodárstve sa používa pre výnosy a ceny komodít — pšenica 60 q/ha = 6 t/ha.",
    "longDef": "Cent (latinsky centum = 100, značka **q** z talianskeho \"quintale\") je jednotka hmotnosti, štandardne 100 kilogramov. V SR a EÚ poľnohospodárstve je dominantnou jednotkou pre:\n\n- **Výnosy plodín**: pšenica 60–80 q/ha, kukurica 80–120 q/ha, repka 35–45 q/ha. 1 q/ha = 100 kg/ha = 0,1 t/ha.\n- **Ceny komodít**: 5500 Kč/t pšenice = 550 Kč/q. Rolníci často počítajú v q pri rokovaní s výkupmi.\n- **Spotreba krmív**: krava mliečna dojnica spotrebuje cca 30 q zmesi/rok.\n\nPozor — q (metrický cent) je odlišné od **q amerického** (= 100 lb = 45,4 kg) a **q britského** (= 112 lb = 50,8 kg). V medzinárodnom obchode sa používa výhradne **metrická tona (t)** = 1000 kg = 10 q.\n\nPraktický príklad:\n- Pšenica 6 t/ha × 100 ha = 600 t = 6000 q\n- Cena 5500 Kč/t = 550 Kč/q → tržba 3,3 mil. Kč\n\nPre veľké výnosy (kukurica silážna, trávy na siláž) sa počíta v t (1 t = 10 q), nikdy v q (čísla by boli nepraktické — 400 q/ha kukurice).",
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
      "sto metrov štvorcových"
    ],
    "kategorie": "jednotky",
    "shortDef": "Ar (a) je jednotka plochy = 100 m² = štvorec 10 × 10 m. 100 árov = 1 hektár. Používa sa pre záhrady, parcely a malé pozemky v katastri nehnuteľností.",
    "longDef": "Ar je jednotka plošného obsahu, odvodzovaná od latinského *area*. 1 ar = 100 m² = štvorec o strane 10 m. V sústave SI je ar (a) prijímaná jednotka mimo SI, prípustná pre pozemkovú agendu.\n\nPrevod:\n- **1 a = 100 m²**\n- **1 a = 0,01 ha** (100 a = 1 ha)\n- **1 a = 0,0001 km²**\n- **1 a ≈ 0,0247 akru** (akr ≈ 40,47 a)\n\nV SR sa ar používa predovšetkým v:\n- **Katastri nehnuteľností** — výmery záhrad, stavebných parciel a malých poľnohospodárskych pozemkov sa obvykle zapisujú v m² alebo v ha, ale staršie zápisy a bežná reč („záhrada 8 árov\") ar drží.\n- **Drobnom poľnohospodárstve** — pestovateľské pásy, ovocné sady, vinice malých vinárov.\n- **Dani z nehnuteľných vecí** — sadzby sa počítajú z m², ale rolníci si plochu typicky pamätajú v ároch.\n\nPraktické prirovnania:\n- **Tenisový dvor** (single, 23,77 × 8,23 m) ≈ 2 ary\n- **Olympijský bazén** (50 × 25 m) = 12,5 a\n- **Futbalové ihrisko** (105 × 68 m) ≈ 71 a (= 0,71 ha)\n- **Priemerná slovenská záhrada pri rodinnom dome** = 4–10 a\n\nHistoricky bol ar zavedený vo Francúzsku v roku 1795 ako súčasť metrickej sústavy. V SR/SK kontexte nahradil predchádzajúce jednotky ako **korec** (≈ 28 a) a **strych** (≈ 28–32 a) — viz [[korec]], [[strych]].",
    "related": [
      "hektar",
      "metr-ctvrecni",
      "korec",
      "strych"
    ]
  },
  {
    "slug": "akr",
    "term": "Akr (acre)",
    "alias": [
      "acre",
      "akre",
      "anglický akr"
    ],
    "kategorie": "jednotky",
    "shortDef": "Akr (acre) je anglosaská jednotka plochy = 4 046,86 m² = 0,4047 hektára. Štandardná jednotka v USA, UK, Kanade a Austrálii pre poľnohospodárske pozemky.",
    "longDef": "Akr (anglicky *acre*) je tradičná anglosaská jednotka plošného obsahu, dnes presne definovaná ako **4 046,8564224 m²** (medzinárodný akr). V USA a UK je dodnes dominantnou jednotkou pre poľnohospodárske pozemky a real estate.\n\nPresné prevody:\n- **1 akr = 4 046,86 m²**\n- **1 akr = 0,4047 ha** (≈ 40,5 a)\n- **1 akr = 40,4686 a**\n- **1 hektár = 2,4711 akru**\n- **1 míľa² = 640 akrov** (1 section v US township systéme)\n\nPôvod jednotky: stredoveký akr bol plocha, ktorú jeden muž s párom volov zorá za deň — preto dĺžka **1 furlong × šírka 1 chain** (220 yardov × 22 yardov = 4 840 yard²).\n\nPraktické použitie:\n- **USA**: priemerná farma 2026 ≈ 446 akrov (≈ 180 ha). Veľké priemyselné farmy 10 000+ akrov.\n- **UK**: typická anglická farma 88 ha = 217 akrov.\n- **Pôdne fondy / investície**: americké poľnohospodárske pozemky sa obchodujú v USD/akr (typicky $4–10 tis./akr v Midwestu).\n- **Ceny komodít**: USDA yields publikuje v bushel/akr — pšenica ~50 bu/ac, kukurica ~175 bu/ac.\n\nPre slovenského farmára relevantné pri:\n- **Prenájme zahraničných pozemkov** (zejm. SK, AT, DE pohraničie — viz [[morgen]]).\n- **Importe USDA dát** o svetových výnosoch (prepočet bu/ac → t/ha: bušl × 0,02489 = t/ha).\n- **Predaji do USA** (export komodít).\n\nPozor: existujú aj regionálne varianty — *scottish acre* (5 080 m²), *irish acre* (6 555 m²) — dnes obsoletné, ale stále v niektorých starých zápisoch.",
    "related": [
      "hektar",
      "morgen",
      "busl",
      "metr-ctvrecni"
    ]
  },
  {
    "slug": "metr-ctvrecni",
    "term": "Metr štvorcový (m²)",
    "alias": [
      "m²",
      "m2",
      "štvorcový meter"
    ],
    "kategorie": "jednotky",
    "shortDef": "Metr štvorcový (m²) je základná jednotka plochy v SI = štvorec 1 × 1 m. 10 000 m² = 1 hektár. Univerzálna jednotka pre stavby, parcely, byty.",
    "longDef": "Metr štvorcový (m², niekedy písané m2 alebo „štvorcový meter\") je odvozená jednotka plošného obsahu v sústave SI. 1 m² = plocha štvorca o strane 1 meter.\n\nPrevod na ďalšie jednotky plochy:\n- **1 m² = 0,01 a** (100 m² = 1 ar)\n- **1 m² = 0,0001 ha** (10 000 m² = 1 hektár)\n- **1 m² = 0,000001 km²** (1 000 000 m² = 1 km²)\n- **1 m² ≈ 10,764 sq ft** (štvorcová stopa, USA/UK)\n- **1 m² ≈ 1,196 sq yd** (štvorcový yard)\n\nPoužitie v poľnohospodárstve a real estate:\n- **Stavebné parcely** — katastr nehnuteľností eviduje pozemky v m² (oficiálny zápis).\n- **Sadzby dane z nehnuteľností** — počíta sa v Kč/m² podľa typu pozemku.\n- **Skleníky a fóliovníky** — kapacita sa uvádza v m² pestovnej plochy.\n- **Hydina a chovy** — minimálna plocha na zviera (welfare normy) v m²/kus.\n- **Skladovacie haly** — silážne jamy, seníky, mechanizačné dvory v m².\n\nPraktické prirovnania:\n- **Parkovacie miesto**: 12,5 m² (2,5 × 5 m)\n- **Malý byt 1+kk**: 25–35 m²\n- **Veľký byt 4+1**: 100–130 m²\n- **Tenisový dvor**: 261 m² (single)\n- **Futbalové ihrisko**: 7 140 m² (≈ 0,71 ha)\n\nPre prevod väčších plôch na hektáre stačí deliť 10 000:\n- 5 000 m² = 0,5 ha\n- 25 000 m² = 2,5 ha\n- 500 000 m² = 50 ha\n\nPozri tiež [[ar]] (= 100 m²), [[hektár]] (= 10 000 m²), [[kilometr-ctvrecni]] (= 1 000 000 m²).",
    "related": [
      "ar",
      "hektar",
      "kilometr-ctvrecni"
    ]
  },
  {
    "slug": "kilometr-ctvrecni",
    "term": "Kilometer štvorcový (km²)",
    "alias": [
      "km²",
      "km2",
      "štvorcový kilometer"
    ],
    "kategorie": "jednotky",
    "shortDef": "Kilometer štvorcový (km²) je jednotka plochy = štvorec 1 × 1 km = 100 hektárov = 1 000 000 m². Používa sa pre lesy, katastrálne územia, kraje, povodia.",
    "longDef": "Kilometer štvorcový (km², písané tiež km2 alebo „štvorcový kilometer\") je odvozená jednotka plošného obsahu v SI. 1 km² = plocha štvorca o strane 1 km = 1 000 m × 1 000 m.\n\nPrevody:\n- **1 km² = 1 000 000 m²**\n- **1 km² = 100 ha** (sto hektárov)\n- **1 km² = 10 000 a** (desaťtisíc árov)\n- **1 km² ≈ 247,1 akra**\n- **1 mile² ≈ 2,59 km²** (štvorcová míľa, USA)\n\nPoužitie:\n- **Lesníctvo** — výmera lesných hospodárskych celkov, povodí, chránených území (CHKO, NP) sa uvádza v km².\n- **Katastrálne územie** — priemerné katastrálne územie v SR má 4–8 km².\n- **Pastviny a TTP** — extenzívne pastvy v horských oblastiach (Krkonošsko, Beskydy) sa merajú v km².\n- **Štatistika ČSÚ** — orná pôda v SR ~30 000 km² (3 mil. ha), TTP ~10 000 km².\n- **Klimatické a meteodáta** — zrážky a teploty interpolované na km² rastr.\n\nPraktické prirovnania:\n- **Praha 1 (správny obvod)**: 5,5 km²\n- **Manhattan (NYC)**: 59 km²\n- **Mikulov (mesto)**: 47 km²\n- **NP Šumava**: 685 km²\n- **CHKO Český kras**: 132 km²\n\nSR celkom má **78 871 km²** = 7,89 mil. ha. Z toho poľnohospodárska pôda 41 868 km² = 4,19 mil. ha (53 % rozlohy štátu).\n\nPozri tiež [[hektár]] (= 0,01 km²), [[metr-ctvrecni]], [[ar]].",
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
      "hektolitrová váha"
    ],
    "kategorie": "jednotky",
    "shortDef": "Hektoliter (hl) je jednotka objemu = 100 litrov = 0,1 m³. V poľnohospodárstve kľúčová pre hektolitrovú váhu obilnín (kg/hl) — kvalitativný parameter pre výkup.",
    "longDef": "Hektoliter (hl) je jednotka objemu = **100 litrov** = 0,1 m³. V SI je hektoliter prijímaná jednotka mimo SI, široko používaná v poľnohospodárstve, pivovarníctve a obchode s tekutinami.\n\nPrevody:\n- **1 hl = 100 l**\n- **1 hl = 0,1 m³ = 100 dm³**\n- **1 hl ≈ 22 imperiálnych galónov (UK) ≈ 26,4 US galónu**\n- **1 hl ≈ 2,75 amerických bušlov** (záleží na komodite)\n\nV poľnohospodárstve je hl kľúčový pre **hektolitrovú váhu** — hmotnosť v kilogramoch, ktorú má 100 litrov obilnín. Je to fundamentálny **kvalitativný parameter** pre výkup obilnín:\n\n| Plodina | Štandard kg/hl | Krmné | Potravinárske |\n|---------|----------------|-------|---------------|\n| **Pšenica ozimná** | 76–82 | < 74 | 78–84 (E, A) |\n| **Jačmeň sladovnícky** | 64–68 | < 62 | min. 64 |\n| **Jačmeň krmný** | 62–66 | bežné | — |\n| **Žito** | 70–76 | < 68 | 72+ |\n| **Ovsené** | 48–52 | < 45 | 50+ |\n| **Repka ozimná** | 64–68 | — | min. 62 |\n| **Tritikale** | 70–76 | bežné | — |\n\n**Prečo hl váha?** Vyššia hektolitrová váha = vyšší obsah škrobu/oleja, menej plev a šešulí, lepšia mlynárska kvalita. Mlyny a sladovne určujú cenu obilnín podľa hl váhy + ďalších parametrov (vlhkosť, dusík, Falling Number).\n\nPraktické dopady na príjem farmy:\n- Pšenica 78 kg/hl → potravinárska trieda A → 5800 Kč/t\n- Pšenica 74 kg/hl → krmná → 4200 Kč/t\n- **Rozdiel 1600 Kč/t** = 80 tis. Kč na 50 ha pri výnose 6 t/ha\n\nHektolitrovú váhu merajú mobilné váhy priamo v kombajne (yield monitor, pozri [[yield-monitor]]) alebo presne laboratórne po zbere.\n\nPozri tiež [[busl]] (US ekvivalent), [[q-cent]], [[tuna]], [[kilogram]], [[hektár]].",
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
    "term": "Bušl (bushel)",
    "alias": [
      "bushel",
      "bu",
      "americký bušl"
    ],
    "kategorie": "jednotky",
    "shortDef": "Bušl (bushel, bu) je anglosaská jednotka objemu i hmotnosti pre obilniny. 1 US bušl pšenice = 27,2155 kg, kukurice = 25,4 kg. Štandardná jednotka cien na CBOT.",
    "longDef": "Bušl (anglicky *bushel*, skratka *bu*) je tradičná anglosaská jednotka, ktorá sa v poľnohospodárstve používa v dvoch formách:\n\n1. **Objemový bušl** = 35,2391 litru (USA, dry bushel) = 36,3687 l (UK, imperiálny)\n2. **Hmotnostný bušl** — pevne definovaná hmotnosť pre každú komoditu (USDA štandard)\n\nHmotnostný bušl (USDA pre US obchod):\n| Komodita | kg/bušl | lb/bušl |\n|----------|---------|---------|\n| **Pšenica** | 27,2155 | 60 |\n| **Sója** | 27,2155 | 60 |\n| **Kukurica** | 25,4012 | 56 |\n| **Jačmeň** | 21,7724 | 48 |\n| **Ovsené** | 14,5150 | 32 |\n| **Žito** | 25,4012 | 56 |\n| **Repka (canola)** | 22,6796 | 50 |\n\n**Prečo je bušl dôležitý pre SK farmára:**\n- **CBOT (Chicago Board of Trade)** — svetové ceny pšenice, kukurice a sóje sa kvotujú v **centoch/bušl**. Pohyby na CBOT diktujú aj ceny v Európe s 1–2 dňovým oneskorením.\n- **USDA WASDE reporty** — mesačné globálne odhady úrody a zásob publikované v miliónoch bušlov.\n- **Export/import** — americká sója a kukurica sa predáva po bušloch.\n\nPrevod **bušl/akr → t/hektár** (kvôli porovnaniu US a EU výnosov):\n- **Pšenica**: bu/ac × 0,06725 = t/ha (50 bu/ac ≈ 3,36 t/ha)\n- **Kukurica**: bu/ac × 0,06277 = t/ha (175 bu/ac ≈ 10,98 t/ha)\n- **Sója**: bu/ac × 0,06725 = t/ha (50 bu/ac ≈ 3,36 t/ha)\n\nPríklad prevodu ceny CBOT na SK:\n- Pšenica 600 ¢/bu = 6,00 USD/bu\n- 6,00 USD ÷ 27,2155 kg × 1000 = **220,4 USD/t**\n- × 23 Kč/USD = **5 070 Kč/t** (pred dopravou a maržami)\n\nPozor — **UK imperiálny bušl** (36,37 l) je o 3 % väčší než US bušl, ale v poľnohospodárstve dnes úplne dominuje US štandard.\n\nPozri tiež [[hektoliter]] (EU ekvivalent kvalitativnej jednotky), [[q-cent]], [[tuna]], [[libra]], [[akr]].",
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
    "term": "Jitro",
    "alias": [
      "historická jednotka plochy",
      "rakúske jitro"
    ],
    "kategorie": "jednotky",
    "shortDef": "Jitro je historická stredoeurópska jednotka plochy ≈ 0,5755 ha (rakúske/české jitro = 1600 štvorcových sáhov). Plocha, ktorú pár volov zorá za deň. Dnes obsoletná, ale v katastrálnych zápisoch a rodinnej pamäti prežíva.",
    "longDef": "Jitro (latinsky *jugerum*, nemecky *Joch*) je tradičná stredoeurópska jednotka plošného obsahu, ktorej veľkosť sa historicky líšila podľa regiónu. V českých zemiach a Rakúsku-Uhorsku platilo štandardizované **rakúske (dolnorakúske) jitro = 1600 štvorcových sáhov = 5754,642 m² ≈ 0,5755 ha**.\n\nHlavné regionálne varianty:\n- **Rakúske/české jitro**: 5 754,64 m² = **0,5755 ha** (od roku 1764 v Habsburskej monarchii)\n- **Uhorské jitro**: 5 754,64 m² (rovnaké ako rakúske)\n- **Moravské zemské jitro**: 5 754,64 m² (sjednocené s rakúskym)\n- **Pruské jitro (Morgen)**: 2 553 m² ≈ 0,255 ha (pozri [[morgen]])\n- **Veľké jitro**: niekedy 1,5–1,75 ha (regionálne, neoficiálne)\n\nEtymológia: jitro = plocha, ktorú pár volov zorá od jitra (rána) do obeda. Pre pár volov s dreveným hákom to bolo cca 0,5–0,6 hektára za pol dňa — odtiaľ rozsah.\n\n**Prečo ešte dnes relevantné:**\n- **Katastr nehnuteľností** — staršie zápisy z 19. a začiatku 20. storočia uvádzajú výmeru v jitre a štvorcových sázích. Pri dedičských konaniach a prevodoch pozemkov sa s jitrami stále stretávame.\n- **Rodinná pamäť** — sedliacke rodiny si výmery predkov pamätajú v jitre („dedko mal 12 jiter\", tj. ≈ 6,9 ha).\n- **Pohraničie** — staré pruské, bavorské, saské mapy používali *Morgen* (≈ 0,25 ha), čo sa občas pletie s jitrom.\n\nPraktické prevody:\n- **1 jitro = 0,5755 ha = 57,55 a = 5 754 m²**\n- **1 jitro ≈ 1,422 akra** (anglosaského)\n- **2 jitra = 1,151 ha** (tradičné „selské hospodárstvo\" malo 20–40 jiter, tj. 12–23 ha)\n\nV dnešnom katastri SR sú jitra **nahradené m² a hektármi** (vyhláška o katastri), ale staré čísla v knihovnom zápise sú stále právne platné.\n\nPozri tiež [[hektár]], [[ar]], [[korec]], [[strych]], [[lan]], [[morgen]].",
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
    "term": "Lán",
    "alias": [
      "celý lán",
      "sedliacky lán",
      "kmetcí lán"
    ],
    "kategorie": "jednotky",
    "shortDef": "Lán je stredoveká česká jednotka plochy ≈ 18 ha (presnejšie 16–24 ha podľa regiónu). Plocha sedliackeho hospodárstva, ktoré uživí jednu rodinu. Dnes obsolentná, ale historicky zásadná jednotka.",
    "longDef": "Lán je historická česká jednotka plošného obsahu, používaná od raného stredoveku do 18. storočia. Veľkosť lánu sa výrazne líšila podľa regiónu, doby a typu (sedliacky/kráľovský/kmetcí), ale v štandarde z urbára platilo:\n\n**Český lán (kmetcí, sedliacky)**: typicky 64 strychov ≈ **18 ha** (16–24 ha v praxi).\n\nTypy lánov:\n- **Lán kmetcí (sedliacky)** — 60–64 strychov ≈ 16–20 ha, hospodárstvo poddaného sedliaka\n- **Lán kráľovský** — 70–84 strychov ≈ 19–24 ha, mierne väčší\n- **Pražský lán** — štandardizovaný na 64 strychov ≈ 18,2 ha\n- **Lán moravský** — variabilný, 16–21 ha\n- **Pôllán** — polovica lánu, drobnejšie hospodárstvo (8–10 ha)\n- **Štvrťlán** — štvrtina, chalupníci (4–5 ha)\n- **Záhradník** — bez lánu, len dom a záhrada (< 1 ha)\n\nLán bol **základnou ekonomicko-sociálnou jednotkou** českého vidieka:\n- **Dane a robota** — robotné povinnosti sa vymedzovali podľa veľkosti lánu (3 dni v týždni pre celý lán).\n- **Spoločenský status** — *láník* (sedliak s celým lánom) bol najvyššia vrstva poddaného obyvateľstva.\n- **Dedičstvo** — lán sa v Čechách typicky nedelil (právo nedielu), dedil ho jeden syn, ostatní šli na remeslo alebo do mesta.\n\nLán bol tvorený mnohými menšími pozemkami (políčka, lúky, pastviny, les) roztrúsenými po katastri obce — typický **trojhonný systém** (ozim/jarín/úhor) vyžadoval mať pôdu vo viacerých honoch.\n\nPo **patentoch Márie Terézie** (1755) a **josefínskom katastri** (1789) sa lán postupne nahrádzal presnejšími jitrami a m². V Tereziánskom katastri (1748) boli lány konkrétne vymedzené — preto dnes vieme presné veľkosti pre jednotlivé dediny.\n\nV modernom kontexte:\n- **Genealógia a rodopis** — staré matričné a urbárne zápisy uvádzajú predkov ako „láník\", „pôlláník\", „chalupník\".\n- **História obcí** — kronikári a regionálni historici pracujú s lánmi pri popise stredovekej štruktúry dediny.\n- **Miestne názvy** — „Veľký lán\", „Lánska cesta\", „Na lánoch\" sú dodnes živé pomiestne názvy.\n\nPozor — moderné slovo „lán\" ako synonymum pre veľké pole (napr. „nekonečné lány obilia\") je už metaforické, nepredstavuje konkrétnu jednotku.\n\nPozri tiež [[jitro]], [[korec]], [[strych]], [[hektár]].",
    "related": [
      "jitro",
      "korec",
      "strych",
      "hektar"
    ]
  },
  {
    "slug": "korec",
    "term": "Korec",
    "alias": [
      "český korec",
      "pražský korec",
      "historická miera"
    ],
    "kategorie": "jednotky",
    "shortDef": "Korec je historická česká jednotka plochy ≈ 0,2877 ha (28,77 a). Plocha, na ktorú sa vyseje 1 korec (objemová miera) obilnín. V katastrálnych zápisoch a rodinnej pamäti prežíva dodnes.",
    "longDef": "Korec je historická česká jednotka plošného obsahu, etymologicky odvozená od **korce ako objemovej miery obilnín** (asi 93 litrov). Korec pôdy = plocha, na ktorú sa vyseje 1 korec osiva.\n\n**Štandardizovaný český (pražský) korec**: 2 877,32 m² = **28,77 a ≈ 0,288 ha**.\n\nRegionálne varianty:\n- **Pražský korec**: 2 877 m² ≈ 0,288 ha (oficiálne od r. 1764)\n- **Moravský korec**: variabilný, 1 920–2 880 m² (0,19–0,29 ha)\n- **Slezský korec**: 2 877 m² (sjednotený s pražským)\n- **Veľký korec** (lesný): niekedy až 5 754 m² (= jedno jitro)\n\nVzťah k ďalším historickým jednotkám:\n- **1 jitro = 2 korce** (po 1 800 čtvrťových sáhoch + zaokrúhlenie regionálne)\n- **1 strych = 1 korec** (synonymum v niektorých regiónoch, viz [[strych]])\n- **1 lán = 60–64 korcov** ≈ 17–18 ha\n\nV hospodárskej praxi:\n- **Drobné chalupnícke usedlosti**: 2–4 korce (= 0,6–1,2 ha)\n- **Stredný statok**: 20–40 korcov (= 5,8–11,5 ha)\n- **Selský láník**: 60+ korcov = 1 lán = 17+ ha\n\n**Prečo korec dnes ešte potkávame:**\n- **Katastrálne zápisy do roku 1869** používajú korce a jitrá. Vklad starého zápisu pri dedičstve → potkáte korce.\n- **Rodinné kroniky a rozprávanie** — „dedko mal 8 korcov pri potoku\" = ≈ 2,3 ha.\n- **Pomístne názvy** — „Na korci\", „Korecká lúka\" sú v ČR rozšírené.\n- **Genealógia** — gruntovné knihy a urbáre (16.–19. storočie) — výmery v korcoch/strychách.\n\nPraktické prevody:\n- **1 korec = 0,2877 ha = 28,77 a = 2 877 m²**\n- **1 korec ≈ 0,711 akru**\n- **3,5 korca = 1 ha** (zaokrúhlene)\n\nPo metrickej reforme v ČSR (zákon č. 268/1919 Zb.) bol korec **oficiálne nahradený hektárom a arem**. Dnes nemá právnu platnosť ako jednotka, ale staré zápisy zostávajú právne relevantné.\n\nViz tiež [[strych]] (synonymum v niektorých regiónoch), [[jitro]], [[lán]], [[hektár]], [[ar]].",
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
    "term": "Strych",
    "alias": [
      "historický strych",
      "moravský strych"
    ],
    "kategorie": "jednotky",
    "shortDef": "Strych je historická stredoeurópska jednotka plochy ≈ 0,288 ha (28,8 a), v podstate synonymum slovenského korca. Plocha, na ktorú sa vyseje 1 strych (objem) osiva. V Tereziánskom katastri a starých zápisoch prežíva dodnes.",
    "longDef": "Strych je tradičná slovenská a stredoeurópska jednotka plošného obsahu. Slovo pochádza z nemeckého *Strich* (= pruh, riadok, vyznačený pás pôdy). V mnohých regiónoch je strych **synonymom korca** — obe jednotky boli definované ako plocha, na ktorú sa vyseje 1 strych/korec (objemová miera ≈ 93 l) obilnín.\n\n**Slovenský strych**: 2 877 m² ≈ **0,288 ha** (totožný s pražským korcom).\n\nRegionálne varianty:\n- **Slovenský/pražský strych**: 2 877 m² ≈ 0,288 ha\n- **Moravský strych**: 1 920–2 880 m² (0,19–0,29 ha) — variabilný\n- **Slezský strych**: 2 877 m² (sjednotený s slovenským po patentoch Márie Terézie)\n- **Veľký strych** (lesný): až dvojnásobok\n\nV niektorých regiónoch juhovýchodnej Moravy a Slovenska bol strych pevne menší než slovenský korec (≈ 0,2 ha) — preto vždy v archívnych prameňoch overiť lokálnu definíciu.\n\n**Použitie historicky:**\n- **Tereziánsky katastr (1748)** — výmery polí, lúk a pastvín zapísané v strychoch/jitrách.\n- **Robotné patenty** — robotné povinnosti sa odvíjali od počtu strychov.\n- **Urbárne knihy 17.–18. storočia** — daňová evidencia drobnej držby.\n\n**Vzťah k ďalším jednotkám:**\n- **1 strych = 1 korec** (v slovenskej standardizácii po 1764)\n- **2 strychy = 1 jitro** (≈ 0,575 ha)\n- **64 strychov = 1 lán** (≈ 18 ha)\n- **3,48 strychu = 1 ha**\n\n**Dnes ešte stretávame strych:**\n- **Katastr nehnuteľností** — staré zápisy pred metrickou reformou 1919.\n- **Genealógia / rodopis** — matriky a gruntovné knihy uvádzajú výmery v strychoch.\n- **Pomístne názvy** — „Strychy\", „Na strychu\", „Strychové polia\" v niektorých obciach.\n\nPraktické prevody:\n- **1 strych = 0,288 ha = 28,8 a = 2 877 m²**\n- **1 strych ≈ 0,712 akra**\n- **3,48 strychu = 1 hektár**\n\nPo metrickej reforme v ČSR (1919) bol strych **oficiálne zrušený** ako platná jednotka. Pre pochopenie starých dokumentov ale potrebné poznať.\n\nPozri tiež [[korec]] (synonymum), [[jitro]] (= 2 strychy), [[lán]], [[hektár]].",
    "related": [
      "korec",
      "jitro",
      "lan",
      "hektar"
    ]
  },
  {
    "slug": "tuna",
    "term": "Tuna (t)",
    "alias": [
      "t",
      "metrická tuna",
      "megagram"
    ],
    "kategorie": "jednotky",
    "shortDef": "Tuna (t) je jednotka hmotnosti = 1 000 kg = 10 metrických centov (q). Štandardná jednotka v poľnohospodárstve pre výnosy plodín (t/ha), výkupné ceny komodít (Kč/t) i kapacity strojov.",
    "longDef": "Metrická tuna (značka **t**, niekedy *Mg* — megagram) je jednotka hmotnosti = 1 000 kg = 10⁶ gramov. V SI je tuna prijímaná jednotka mimo SI, ale fakticky dominantná pre praktické váženie v poľnohospodárstve, obchode i priemysle.\n\nPrevody:\n- **1 t = 1 000 kg = 10 q** (metrických centov)\n- **1 t ≈ 2 204,62 lb** (anglických libier)\n- **1 t ≈ 22,046 amerických short tonov** (US short ton = 907,18 kg)\n- **1 t ≈ 0,9842 long tonov (UK)** (long ton = 1 016 kg)\n- **1 t pšenice ≈ 36,7 bušlov** (US)\n- **1 t kukurice ≈ 39,4 bušlov**\n\nPoužitie v poľnohospodárstve (SK + EU štandard):\n- **Výnosy plodín** — t/ha je dominantná jednotka. Pšenica 5–8 t/ha, kukurica 8–12 t/ha, repka 3–4,5 t/ha, jačmeň 5–7 t/ha.\n- **Výkupné ceny** — Kč/t. Príklad 2024: pšenica 4 800–5 500 Kč/t, kukurica 3 800–4 500 Kč/t.\n- **Hnojivá** — t/ha kejdy (15–25 t/ha), kg/ha NPK, ale balenie dnes typicky v t (big-bag 600 kg ≈ 0,6 t, kontajner 1 t).\n- **Kapacita strojov** — náves 14–24 t, kombajn zásobník 8–13 m³ ≈ 6–10 t obilnín.\n- **Medzinárodný obchod** — CBOT, MATIF, FOB ceny v USD/t, EUR/t.\n\nPraktické príklady:\n- Pole 50 ha pšenice × 6,5 t/ha = 325 t = **6,5 železničných vagónov** (vagón ~50 t)\n- Zber kukurice 100 ha × 10 t/ha = 1 000 t = **40 návesov × 25 t**\n- Ročná spotreba hnojív farma 500 ha: 250 t LAV + 100 t DAM = 350 t\n\n**Tuna vs short ton (US/UK):**\nV medzinárodnom obchode pozor — americký *short ton* (2 000 lb) má len 907 kg, *long ton* (UK, 2 240 lb) má 1 016 kg. Ak čítate USDA reporty alebo americké zdroje, vždy overiť aká „ton\" je myslená. **CBOT a EU obchod používa výhradne metrickú tunu (t)**.\n\nPozri tiež [[q-cent]] (= 0,1 t), [[kilogram]], [[bushel]] (komoditný prevod).",
    "related": [
      "q-cent",
      "kilogram",
      "busl",
      "hektolitr"
    ]
  },
  {
    "slug": "kilogram",
    "term": "Kilogram (kg)",
    "alias": [
      "kg",
      "kilo"
    ],
    "kategorie": "jednotky",
    "shortDef": "Kilogram (kg) je základná jednotka hmotnosti v SI. V poľnohospodárstve kľúčový pre dávkovanie hnojív (kg/ha), váhu zvierat, ceny krmív a balenie (kg/balík siláže, kg/vrece osiva).",
    "longDef": "Kilogram (kg) je **základná jednotka hmotnosti v SI sústave**. Od roku 2019 je definovaný pomocou Planckovej konštanty (h = 6,62607015 × 10⁻³⁴ J·s), predtým bol definovaný ako hmotnosť medzinárodného prototypu uloženého v Sèvres pri Paríži.\n\nPrevod:\n- **1 kg = 1 000 g = 1 000 000 mg**\n- **1 kg = 0,001 t = 0,01 q**\n- **1 kg ≈ 2,2046 lb** (libra)\n- **1 kg ≈ 35,274 oz** (unca, USA/UK)\n\nPoužitie v poľnohospodárstve:\n- **Dávkovanie hnojív** — kg/ha čistých živín. Príklad: pšenica ozimná 150 kg N/ha, kukurica 180 kg N/ha. Pozor: kg živín ≠ kg hnojiva (LAV má 27,5 % N → 150 kg N = 545 kg LAV/ha).\n- **Dávkovanie postrekov** — kg/ha pre granulované prípravky a moridlá. Príklad: Roundup 360 SL je tekutý (l/ha), ale glyfosát vo forme soli sa uvádza v g/ha (720 g a.s./ha).\n- **Váha zvierat** — teľatá 35–45 kg pri narodení, dospelé kravy mliečne dojnice 600–750 kg, býk plemenník 1 000+ kg.\n- **Ceny krmív** — Kč/kg pre premixy a koncentráty (10–30 Kč/kg), Kč/t pre bežné kŕmne zmesi.\n- **Osivo** — pšenica 180–220 kg/ha, kukurica 22–28 kg/ha (oveľa menšia dávka — väčšie zrno).\n- **Balenie produktov** — vrecia hnojív 25/40/50 kg, big-bag 500–1 200 kg, balíky siláže 600–800 kg.\n\n**Hektolitrová váha** — kg/hl je kvalitatívny parameter obilia (pozri [[hektoliter]]). Pšenica potravinárska 78+ kg/hl, kŕmna < 74 kg/hl.\n\n**Meranie živej hmotnosti vs jatočná hmotnosť:**\n- **Živá hmotnosť** (LW — Live Weight) = váha zvieraťa na váhe\n- **Jatočná hmotnosť** (CW — Carcass Weight) = váha tela po porážke\n- Pomer CW/LW: dobytok ~55–60 %, prasa ~75 %, hydina ~70 %\n\nPraktické prirovnania:\n- **Vrece cementu**: 25 kg\n- **Vrece pšenice (osivo)**: 25 kg (štandardné balenie)\n- **Big-bag hnojiva**: 600 kg\n- **Teľa**: 40 kg\n- **Selecky pas dojnice**: 650 kg\n- **Veľký traktor (Fendt 1050)**: ~13 000 kg\n- **Náväz Joskin Trans-CAP plný hnojovky**: ~30 000 kg (= 30 t)\n\nPozri tiež [[tona]] (= 1 000 kg), [[q-cent]] (= 100 kg), [[libra]] (USA/UK).",
    "related": [
      "tuna",
      "q-cent",
      "libra",
      "hektolitr"
    ]
  },
  {
    "slug": "libra",
    "term": "Libra (pound, lb)",
    "alias": [
      "pound",
      "lb",
      "anglická libra"
    ],
    "kategorie": "jednotky",
    "shortDef": "Libra (pound, lb) je anglosaská jednotka hmotnosti = 0,4536 kg. Štandardná jednotka v USA, UK, Kanade a Austrálii. V poľnohospodárstve sa s ňou stretávame v USDA reportoch, CBOT cenách a balení amerického krmiva.",
    "longDef": "Libra (anglicky *pound*, skratka *lb* z latinského *libra*) je tradičná anglosaská jednotka hmotnosti. **Medzinárodná libra** (definovaná od roku 1959) = **0,45359237 kg** presne.\n\nPrevody:\n- **1 lb = 0,4536 kg** (presne 0,45359237)\n- **1 lb = 16 oz** (uncí)\n- **1 kg ≈ 2,2046 lb**\n- **1 t ≈ 2 204,62 lb**\n- **1 short ton (US)** = 2 000 lb = 907,18 kg\n- **1 long ton (UK)** = 2 240 lb = 1 016 kg\n- **1 bušl pšenice** = 60 lb = 27,2155 kg\n\nHistoricky existovali desiatky regionálnych libier (apothecary lb 373 g, troy lb 373 g, French livre 489 g, ...), ale dnes je v praxi len **medzinárodná libra (0,4536 kg)** v anglosaskom obchode.\n\n**Kde libra v SK poľnohospodárstve:**\n- **USDA reporty** — WASDE, ERS publikácie uvádzajú ceny v ¢/lb pre niektoré komodity (bavlna, maslo, syr).\n- **CBOT futures** — sójový olej sa kvotuje v ¢/lb (cca 45–60 ¢/lb v 2024). Dobytek (live cattle) sa obchoduje v ¢/lb (cca 180–200 ¢/lb).\n- **Krmivá premixy a doplnky** — americké zdroje uvádzajú dávky v lb/head/day.\n- **Genetika a plemenné zápisy** — váhy plemenných býkov a kráv v lb (US Holstein registry).\n- **Outdoor / lov / rybolov** — v SR populárne „libra\" pre označenie veľkých rýb (kapor 20+ lb = trofejné rozmery).\n\nPrevod cien CBOT:\n- Sójový olej 50 ¢/lb = 0,50 USD/lb × 2,2046 = **1,10 USD/kg** = **1 100 USD/t**\n- Live cattle 200 ¢/lb = 2,00 USD/lb × 2,2046 = **4,41 USD/kg** živej hmotnosti\n\n**Pozor — libra ≠ kilogram:**\nČasté chyby v prekladoch receptov a krmných tabuliek. Američan napíše „180 lb cow\" = 82 kg teľa (myslené teľa, nie krava!). Dospelá US cow = 1 200–1 400 lb = 545–635 kg.\n\nPre SK farmára praktická pomôcka: **lb × 0,5** dáva rýchly odhad v kg (presnejšie × 0,4536, ale lb × 0,5 je dosť pre mentálnu matematiku). Príklad: 2 000 lb ≈ 1 000 kg (skutočne 907 kg).\n\nPozri tiež [[kilogram]] (SI), [[tuna]], [[bushel]] (= 60 lb pre pšenicu).",
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
      "pruský morgen",
      "nemecké jitro",
      "Morgen"
    ],
    "kategorie": "jednotky",
    "shortDef": "Morgen je historická nemecká/rakúska jednotka plochy. Pruský morgen = 0,2553 ha, bavorský = 0,3407 ha, rakúsky = 0,5755 ha (= rakúske jitro). V pohraničí a starých zápisoch prežíva.",
    "longDef": "Morgen (nemecky „ráno\") je historická stredoeurópska jednotka plošného obsahu, definovaná ako plocha, ktorú pár volov zorá za jedno ráno (jitro). Rovnako ako slovenské [[jitro]] sa veľkosť výrazne líšila podľa regiónu — Nemecko bolo do roku 1872 fragmentované na desiatky krajín, každá s vlastnou mierou.\n\nHlavné varianty (pred metrickou reformou):\n- **Pruský morgen** (Magdeburský): 2 553,2 m² ≈ **0,2553 ha**\n- **Bavorský morgen**: 3 407,3 m² ≈ **0,3407 ha**\n- **Saský morgen**: 2 767 m² ≈ 0,277 ha\n- **Hesenský morgen**: 2 500 m² (zaokrúhlené na 0,25 ha v 19. storočí)\n- **Württemberský morgen**: 3 152 m² ≈ 0,315 ha\n- **Rakúsky/dolnorakúsky morgen** (= jitro): 5 754,6 m² ≈ **0,5755 ha**\n\nPo **metrickej reforme v Nemeckej ríši (1872)** bol morgen oficiálne zrušený, ale v bežnej reči a katastrálnych zápisoch v niektorých regiónoch prežíva dodnes — **najmä na severe Nemecka** (Mecklenburg, Sasko) uvádza staršia generácia výmery v morgenoch.\n\n**Prečo relevantné pre SK farmára:**\n- **Pohraničie** (Šumava, Krkonošsko, Krušné hory, južná Morava) — staré nemecké mapy z dôb R-U a pred rokom 1945 uvádzali výmery v morgenoch. Pri restitúcii a katastrálnych sporoch narazíte.\n- **Nákup pozemkov v DE** — zahraniční predajcovia/inzeráty na severnom Nemecku občas uvádzajú morgeny (najmä lesníctvo).\n- **Pruské katastrálne mapy** — historický výskum vlastníctva Sudet, lichtenštejnských statkov atď.\n\nPraktické prevody (najčastejší — pruský morgen):\n- **1 pruský morgen = 0,2553 ha = 25,53 a = 2 553 m²**\n- **1 pruský morgen ≈ 0,631 akra**\n- **4 pruské morgeny ≈ 1 ha**\n- **1 ha = 3,92 pruského morgenu**\n\nPozor — **rakúsky morgen** je úplne niečo iné (= rakúske jitro = 0,5755 ha). Pri čítaní starých máp vždy najprv zistiť, z ktorej krajiny mapa pochádza.\n\nV súčasnej formálnej agende **morgen nemá žiadnu právnu platnosť** ani v Nemecku, ani v SR.\n\nPozri tiež [[jitro]] (rakúska varianta), [[akr]], [[hektár]], [[korec]].",
    "related": [
      "jitro",
      "akr",
      "hektar",
      "korec"
    ]
  },
  {
    "slug": "turbodmychadlo",
    "term": "Turbodmychadlo",
    "alias": [
      "turbo",
      "turbocharger",
      "preplňovanie"
    ],
    "kategorie": "pohon",
    "shortDef": "Turbodmychadlo využíva energiu výfukových plynov na roztočenie turbíny, ktorá stlačí vzduch do valca — vyšší výkon zo tej istej kubatúry motora.",
    "longDef": "Turbodmychadlo (turbo, turbocharger) je dvojica spojených obehových kolies — turbína na strane výfuku a kompresor na strane sania. Výfukové plyny roztáčajú turbínu (až 200 000 ot/min), spojený hriadeľ poháňa kompresor, ktorý stlačí nasávaný vzduch pred vstupom do valca.\n\nDôsledky pre motor:\n- **+30–50 % výkonu zo tej istej kubatúry** vs atmosférický motor.\n- **Vyšší krútiaci moment v nízkych otáčkach** (kľúč pre ťahové práce).\n- **Lepšia účinnosť** vo vyšších nadmorských výškach (kompenzuje riedky vzduch).\n\nModerné traktorové motory používajú:\n- **VGT** (Variable Geometry Turbo) — meniteľná geometria lopatiek turbíny, optimálny boost v širšom pásme otáčok.\n- **Twin-turbo** (sériové alebo paralelné) u top motorov (Fendt 1000, JD 9R) — primárne turbo pre nízke otáčky, sekundárne pre vysoké.\n- **Intercooler** (mezichladič) za turbom — chladí stlačený horúci vzduch, hustejšia náplň, vyšší výkon.\n\nÚdržba: pravidelná výmena oleja (turbo má ložiská mazané olejom motora), po vypnutí motora turbo dobehne 30+ sekúnd — preto nie je možné hneď vypínať po plnej záťaži (riziko zničenia ložísk). Životnosť pri dobrej údržbe 10 000+ motohodín.",
    "related": [
      "common-rail",
      "dpf"
    ]
  },
  {
    "slug": "egr",
    "term": "EGR",
    "alias": [
      "Recirkulácia výfukových plynov",
      "recirkulácia výfukových plynov"
    ],
    "kategorie": "pohon",
    "shortDef": "EGR (Exhaust Gas Recirculation) vedie časť výfukových plynov späť do sania — znižuje teplotu spaľovania a tým tvorbu oxidov dusíka (NOx).",
    "longDef": "EGR je systém čistenia výfukových plynov, ktorý recirkuluje 5–30 % výfukových plynov späť do sacieho potrubia. Dôvod: nižšia teplota spaľovania → menej NOx (oxidov dusíka) vo výfuku.\n\nPoužitie u traktorov:\n- **Stage IIIA–IIIB** (2006–2014): hlavná cesta zníženia NOx. EGR + DPF.\n- **Stage IV+** (2014+): EGR doplnený alebo nahradený SCR (AdBlue). Vyššia účinnosť.\n\nNevýhody EGR:\n- **Saze v saní** — recirkulované plyny obsahujú PM, postupne sa usadzujú v EGR ventile a sacom potrubí. Po 5–8 000 motohodinách typicky vyžaduje čistenie (5–15 000 Kč).\n- **Zníženie výkonu o 3–5 %** — recirkulované plyny znižujú koncentráciu kyslíka.\n- **Vyššia spotreba** o 2–4 % v porovnaní s motorom bez EGR.\n\nPreto výrobcovia u Stage V prešli na SCR ako dominantnú cestu — vyššia obstarávacia cena, ale nižšie prevádzkové náklady (menej paliva, menej opráv).",
    "related": [
      "scr-katalyzator",
      "dpf",
      "emisni-normy-stage"
    ]
  },
  {
    "slug": "biopal",
    "term": "Biopalivo / Biodiesel",
    "alias": [
      "biodiesel",
      "FAME",
      "B100",
      "B7"
    ],
    "kategorie": "pohon",
    "shortDef": "Biodiesel je palivo z rastlinných olejov (repkový metylester, FAME) — v SR povinne pridávané do bežnej nafty (B7 = 7 % FAME).",
    "longDef": "Biodiesel je obnoviteľné palivo vyrobené esterifikáciou rastlinných olejov (najčastejšie repkový olej v SR, sójový v USA, palmový v Ázii) alebo živočíšnych tukov s metanolom → FAME (Fatty Acid Methyl Ester).\n\nV Európe:\n- **B7** — 7 % FAME v bežnej motorovej nafte. Štandardné palivo na čerpacích staniciach od cca 2010. Kompatibilné so všetkými modernými motormi.\n- **B30 / B100** — 30 % alebo 100 % FAME. Vyžaduje špecifické tesnenie + olej, nie každý motor je certifikovaný. Slabšia výhrevnosť (cca −7 %) → vyššia spotreba.\n\nPre poľnohospodárov:\n- **Modré nafty (z benzínky)** v SR sú vždy B7 = obsahujú FAME.\n- **Vlastné biopalivá** (pestuje + lisuje repku) — možné, ale riziko zničenia Common Rail vstrekovačov, ak nie je dostatočne vyčistené.\n- **Stage V motory** typicky certifikované pre B7. Vyššie koncentrácie (B30+) vyžadujú schválenie výrobcu.\n\nPozor: staršie motory Common Rail môžu mať problém aj s B7 — FAME má iné lubrikačné vlastnosti, vyššiu vodivosť (riziko galvanickej korózie). U traktorov z 90. rokov s mechanickými čerpadlami nehrozí.",
    "related": [
      "common-rail"
    ]
  },
  {
    "slug": "powr-quad",
    "term": "PowrQuad / Quad-Shift",
    "alias": [
      "power shuttle",
      "IVT",
      "AutoPowr"
    ],
    "kategorie": "technologie",
    "shortDef": "PowrQuad je prevodovka John Deere kombinujúca 4 mechanické rady × 4 hydraulicky radené stupne = 16 vpred / 16 vzad. Subset powershift prevodoviek.",
    "longDef": "PowrQuad (John Deere brand názov) je prevodovka s mechanickými hlavnými radami (range A, B, C, D) × 4 hydraulicky radené stupne v každej rade = 16×16 alebo 24×24 s ďalšou nadstavbou.\n\nTypy John Deere prevodoviek (od základu po flagship):\n1. **SyncReverser** — manuálne radenie, mechanický reverz. Základ.\n2. **PowrReverser** — manuálne radenie, hydraulický reverz (= power shuttle).\n3. **PowrQuad** — 4 mechanické × 4 powershift = 16×16. Štandardné pre radu 6M.\n4. **AutoQuad** — PowrQuad + automatické radenie stupňov. Komfortnejšie.\n5. **AutoPowr / IVT** — plne bezstupňová CVT. Flagship 6R+/7R/8R.\n\nKonkurencia ekvivalenty:\n- Case IH Maxxum **ActiveDrive 8** (16×8 powershift).\n- New Holland **Range Command** (16×6 powershift).\n- Fendt **Vario** (CVT — nie powershift).\n\nPre slovenského farmára: PowrQuad je sweet spot medzi cenou a komfortom — 200–300 tis. Kč lacnejšie než AutoPowr CVT, ale radí pod záťažou. Vyplatí sa pre orbu a ťahové práce, kde vodič radí relatívne málo.",
    "related": [
      "cvt-prevodovka",
      "powershift"
    ]
  },
  {
    "slug": "nase-fronta",
    "term": "Predný trojbodový záves",
    "alias": [
      "predný trojbod",
      "frontale",
      "front PTO"
    ],
    "kategorie": "technologie",
    "shortDef": "Predný trojbodový záves je hydraulický záves nepovinne inštalovaný pred traktorom — umožňuje \"sendvičové\" nasadenie náradia vpredu aj vzadu súčasne.",
    "longDef": "Predný trojbodový záves (front linkage) je obdoba zadného trojbodu, inštalovaný pred prednú nápravu. Často kombinovaný s predným PTO (vývodový hriadeľ).\n\nHlavné využitie:\n- **Sečka + lis** — predná sečka reže, zadný lis balí. Jednou jazdou = dvojnásobná produktivita.\n- **Predné valce / brány + pluh** — paralelné spracovanie pôdy.\n- **Predný valec po orbe + hnojivo sečka** — kombinovaná jazda.\n- **Predný navijak / lesné zariadenie** — pre horské prevádzky.\n\nŠpecifikácie:\n- **Zdvihová kapacita** typicky 2 000–5 000 kg (menej než zadný 6 000–12 000 kg).\n- **Spúšťacia dráha** kratšia (cca 700 mm) — predné náradie máva menší výhľad.\n- **PTO** rovnaké štandardy (540 / 1000 ot/min).\n\nCenová stránka:\n- Továrenský predný trojbodový záves 80 000–200 000 Kč príplatok.\n- Retrofit (od dodávateľa ako Sauter, Hauer, Lely) 60 000–180 000 Kč + montáž.\n\nPre slovenskú farmu < 50 ha málokedy návratný — oplatí sa hlavne pri > 100 ha lúk/jetelín alebo špecializované práce.",
    "related": [
      "tribod",
      "pto"
    ]
  },
  {
    "slug": "ndvi",
    "term": "NDVI index",
    "alias": [
      "Normalized Difference Vegetation Index",
      "satelitný index vegetácie"
    ],
    "kategorie": "precise-farming",
    "shortDef": "NDVI je satelitný index biomasy plodiny — vypočítaný z pomeru červeného a blízkeho infračerveného svetla. Hodnoty 0 (holá pôda) až 1 (hustá zdravá vegetácia).",
    "longDef": "NDVI (Normalized Difference Vegetation Index) je vegetačný index používaný v diaľkovom prieskume Zeme. Vzorec: NDVI = (NIR − RED) / (NIR + RED), kde NIR = blízke infračervené svetlo, RED = červené.\n\nPrincíp: zdravé rastliny silne reflektujú NIR (kvôli bunkovej štruktúre listov) a absorbujú RED (kvôli chlorofylu). Holá pôda alebo choré rastliny reflektujú oboje podobne → nízke NDVI.\n\nHodnoty:\n- **NDVI < 0**: voda, sneh, mrak.\n- **0–0,2**: holá pôda, kameň.\n- **0,2–0,4**: riedka vegetácia, mladá plodina.\n- **0,4–0,6**: stredne hustá plodina.\n- **0,6–0,8**: hustá zdravá plodina (vrchol vegetácie).\n- **0,8+**: veľmi hustý porast (les, vzrostlý lán).\n\nPre poľnohospodárstvo:\n- **Aplikačné mapy** pre variabilné hnojenie/postrek — kde je NDVI nízke, daj viac N.\n- **Monitoring vývoja plodiny** — sledovanie rastu vs očakávania.\n- **Detekcia stresu** (sucho, choroba) — pokles NDVI uprostred vegetačnej sezóny.\n\nZdroje dát:\n- **Sentinel-2** (ESA, zadarmo) — 10 m rozlíšenie, snímky každých 5 dní. Štandard pre slovenského farmára.\n- **Planet Labs** ($, 3 m rozlíšenie) — denné snímky, pre precision farming.\n- **Drony** s multispektrálnou kamerou — vlastné lety, 5 cm rozlíšenie.",
    "related": [
      "variable-rate",
      "gps-rtk"
    ]
  },
  {
    "slug": "ctf",
    "term": "CTF (Controlled Traffic Farming)",
    "alias": [
      "riadená doprava",
      "riadené koľaje"
    ],
    "kategorie": "precise-farming",
    "shortDef": "CTF je metóda, pri ktorej všetky stroje (traktor, postrekovač, kombajn) jazdia stále po rovnakých stálych koľajach — zvyšok poľa zostáva neutužený.",
    "longDef": "Controlled Traffic Farming (CTF) je princíp presného poľnohospodárstva, kde sa obmedzuje plocha utužená kolesami strojov — všetky stroje jazdia po identických koľajach (tramlines), zvyšok poľa zostáva nedotknutý.\n\nPredpoklady:\n- **RTK GPS auto-steering** (centimetrová presnosť) — bez neho kolesá nedržia presne koľaje.\n- **Rovnaký / násobný stopový priemer** všetkých strojov — typicky 3 m (postrekovač) a 6 m (kombajn) = 6 m záber postreku + 6/12/24 m záber sejby.\n- **Rovnaký rozchod kolies** (track width) — typicky 2,25 m alebo 3,00 m.\n\nVýhody:\n- **Zníženie utuženia** o 60–80 % — zvyšok poľa nikdy nepojazdia kolesá.\n- **Vyššie výnosy** 5–15 % vďaka lepšej štruktúre pôdy v medzi riadkoch.\n- **Menej paliva** — menej práce na spracovanie utuženej pôdy.\n- **Lepšie zasakovanie vody** — menej erózií.\n\nNevýhody:\n- **Vysoká počiatočná investícia** — RTK GPS systém + zjednotenie strojov (rozchodu) môže stáť 500K – 2M Kč na farmu.\n- **Komplikácie pri výmene stroja** — nový kombajn musí mať rovnaký rozchod.\n- **V CZ málo rozšírené** — vyžaduje veľké lány (>50 ha súvislých) pre ekonomickú návratnosť.",
    "related": [
      "gps-rtk",
      "auto-steering",
      "variable-rate"
    ]
  },
  {
    "slug": "yield-monitor",
    "term": "Yield monitor / Výnosový monitor",
    "alias": [
      "výnosový monitor",
      "yield mapping"
    ],
    "kategorie": "precise-farming",
    "shortDef": "Yield monitor je senzor v kombajne, ktorý počas zberu meria prietok zrna a GPS pozíciu → vytvára výnosovú mapu poľa.",
    "longDef": "Yield monitor je integrovaný systém v kombajne, ktorý kontinuálne meria:\n1. **Hmotnosť zrna** prechádzajúceho cez elevátor (typicky optický alebo nárazový senzor).\n2. **Vlhkosť zrna** (kapacitný alebo NIR senzor) — pre prepočet na \"suchú\" hmotnosť.\n3. **Záber stola** + **rýchlosť** = aktuálna plocha za sekundu.\n4. **GPS pozícia** každé 1–2 sekundy.\n\nOutput: bodové dáta (lat, lng, kg/m²) → interpolácia do mriežky → **výnosová mapa poľa**.\n\nKľúčové značky:\n- **John Deere GreenStar / Operations Center** — dominantné v USA, OK v EÚ.\n- **Case IH AFS / NH IntelliView** — spoločný ekosystém CNH.\n- **Claas TELEMATICS** — premium EÚ.\n- **Trimble FmX / AGCO Fuse** — tretie strany, multi-brand kompatibilné.\n\nPre SR farmu:\n- **Bez yield monitoru kombajn za 8M Kč = len zber**, nie dátová stanica.\n- Yield mapa za 1 sezónu = základ pre **VRA (variable rate)** na budúci rok — viac P/K tam, kde to potrebuje, menej tam, kde nie.\n- ROI 2–3 sezóny u farmy > 100 ha.\n\nPraktické tipy: kalibrácia 1×/sezónu na váhovom aute (chyba 1–3 %), vlhkostný senzor čistiť denne (zaprášený senzor = posunuté dáta).",
    "related": [
      "variable-rate",
      "gps-rtk",
      "ndvi"
    ]
  },
  {
    "slug": "dap",
    "term": "DAP (Diamonfosfát)",
    "alias": [
      "DAP",
      "diamonfosfát",
      "18-46-0"
    ],
    "kategorie": "hnojivo",
    "shortDef": "DAP (diamonfosfát) je granulované hnojivo s 18 % dusíka a 46 % fosforu (P₂O₅). Hlavný zdroj fosforu pre slovenské poľnohospodárstvo.",
    "longDef": "DAP je vysokokoncentrované fosforečné hnojivo (Diamonium Phosphate, chemicky (NH₄)₂HPO₄) s obsahom 18 % N a 46 % P₂O₅. Vyrába sa reakciou kyseliny fosforečnej s amoniakom.\n\nPoužitie:\n- **Štartovacie do osiva** — 100–200 kg/ha, vstrekne sa s osivom do riadkov. Vysoký fosfor podporuje rozvoj koreňového systému mladej rastliny.\n- **Jesenné pod oziminy** — 150–300 kg/ha, zaorie sa. Fosfor sa v pôde pohybuje pomaly, preto sa aplikuje hlboko a vopred.\n- **Jarné pod jariny** — menej časté, fosfor by nemal zostať na povrchu.\n\nVlastnosti:\n- **Mierne kyslá reakcia** v pôde (pH okolo 6) — vhodné pre neutrálne až slabo zásadité pôdy.\n- **Vysoká vodorozpustnosť** — okamžite dostupný pre plodinu (na rozdiel od MAP).\n- **Cena 2024**: cca 16 000–22 000 Kč/t.\n\nPozor: na alkalickej pôde (pH > 7,5) prechádza fosfor rýchlo do nerozpustných foriem (vápenaté soli) → krátka účinnosť. V tom prípade lepšie použiť MAP alebo superfosfát.",
    "related": [
      "npk-hnojivo",
      "pH-pudy"
    ]
  },
  {
    "slug": "roundup",
    "term": "Roundup (glyfosát)",
    "alias": [
      "glyfosát",
      "glyphosate",
      "totálny herbicíd"
    ],
    "kategorie": "agrotechnika",
    "shortDef": "Glyfosát (komerčný Roundup) je neselektívny systémový herbicíd — zabíja všetky rastliny po nástreku. Dominantný herbicíd SR poľnohospodárstva pre úhor.",
    "longDef": "Glyfosát je najpoužívanejší herbicíd na svete, predávaný pod značkou Roundup (Monsanto/Bayer) aj generikami. Neselektívny = zabíja akúkoľvek rastlinu, systémový = absorbuje sa listami a transportuje do koreňov.\n\nPoužitie v SR:\n- **Úhor pred siatím** — vyčistí pole od buriny a strniska.\n- **Pre-emergence** pred vzídením plodiny — 1–2 dni pred.\n- **Desikácia** (vysušenie) ozimnej repky a obilnín pred zberom — urýchli dozrievanie, nie v SR oficiálne schválené pre potraviny.\n- **Lesné porasty** — proti pasečnému plevelu.\n\nCena (2024):\n- **Roundup Klasik 360 g/l** — cca 200–280 Kč/l v 20l kanistri. Dávka 3–4 l/ha.\n- **Generika** (Glyfogan, Touchdown, Clinic) — 150–220 Kč/l.\n\nKontroverzie:\n- **EÚ autorizácia** pre glyfosát bola 2023 predĺžená o 10 rokov (do 2033) — proti silnej lobby (Greenpeace, IARC).\n- **IARC klasifikácia** \"pravdepodobne karcinogénny pre človeka\" (2A) — kontroverzné, EÚ EFSA klasifikuje ako bezpečný pri dodržaní dávok.\n- **SR Maloobchod**: bez obmedzení.\n- **Bio-poľnohospodárstvo**: striktne zakázaný.",
    "related": [
      "mezi-plodiny"
    ]
  },
  {
    "slug": "jednotna-zadost",
    "term": "Jednotná žiadosť",
    "alias": [
      "JŽ",
      "kombinovaná žiadosť",
      "SAPS žiadosť"
    ],
    "kategorie": "dotace",
    "shortDef": "Jednotná žiadosť je každoročný formulár, ktorý združuje všetky priame platby SPP — základnú podporu príjmu, redistributívnu platbu, ekoschémy, ANC, viazané platby aj podporu pre mladých poľnohospodárov. Na Slovensku sa podáva Pôdohospodárskej platobnej agentúre (PPA) cez Portál farmára; v Česku ju prijíma SZIF.",
    "longDef": "Jednotná žiadosť (JŽ) je centralizovaný spôsob, akým poľnohospodár žiada o priame platby CAP. Pred 2014 sa podávalo viac samostatných žiadostí — JŽ zjednotila proces.\n\nČo obsahuje:\n- **Identifikácia žiadateľa** + IČO.\n- **LPIS bloky** používané — výmera, kultúra, plodiny.\n- **Žiadosť o BISS** (Základná platba) automaticky.\n- **Žiadosť o CISS** (Redistributívna) — automaticky, ak výmera spĺňa.\n- **EKO režim** — voľba základná / premium + deklarácia eko-praktík.\n- **ANC** (menej priaznivé oblasti) — automaticky podľa LPIS zaradenia.\n- **VCS** (citlivé sektory) — deklarácia plochy cukrovej repy, zemiakov, ovocia, zeleniny, chmeľu, ľanu, bielkovín.\n- **Mladý poľnohospodár** bonus — deklarácia veku a roku prvej žiadosti.\n- **AEKO** zmluvy — viacročné agro-environmentálne opatrenia.\n\nPodanie:\n- **Termín**: typicky 1. apríla – 15. mája (s toleranciou do 9. júna s 1 % sankciou/deň).\n- **Miesto**: elektronicky cez [Portál farmára](https://eagri.cz/public/web/mze/farmar/portal-farmare/) — vyžaduje dátovú schránku alebo certifikát.\n- **Asistencia**: regionálne pracoviská PPA zdarma, súkromní poradcovia za odplatu podľa rozsahu projektu.\n\nPo podaní:\n- **Máj–jún**: PPA kontroluje deklarácie vs LPIS, satelitný monitoring (Copernicus / SISAEC).\n- **Október–december**: vyplácanie (vyššie zálohy už v októbri, doplatky v decembri).\n- **Sankcie**: za nesprávnu deklaráciu, prekročenie limitov, porušenie greeningu → 1–100 % zrážka.",
    "related": [
      "biss",
      "cap-2024",
      "lpis"
    ]
  },
  {
    "slug": "aeko",
    "term": "AEKO (Agro-environmentálne opatrenia)",
    "alias": [
      "AEKO",
      "agro-environmentálne"
    ],
    "kategorie": "dotace",
    "shortDef": "AEKO sú viacročné (5-ročné) dobrovoľné zmluvy s ekologicky šetrnými praktikami — pastva, biopásy, zatravnenie, sady a pod. Vyššie dotácie než EKO režim.",
    "longDef": "AEKO (Agro-environmentálne klimatické opatrenia) je samostatný dotačný program v CAP 2024, ktorý odmeňuje 5-ročné záväzky k ekologicky šetrným praktikám. Vyššie sadzby než EKO režim, ale tvrdšie pravidlá a sankcie za porušenie.\n\nHlavné AEKO opatrenia v SR 2024:\n- **Ošetrovanie trávnych porastov (TTP)** — kosenie v neskorších termínoch (po hniezdení vtákov), 2 100–6 000 Kč/ha podľa subtypu.\n- **Biopásy** — kvitnúce zmesi na poli, ~10 000 Kč/ha (viac než EFA).\n- **Biokoridor** — súvislé línie krajinné zelene, 8 000 Kč/ha.\n- **Ekologické poľnohospodárstvo (EZ)** — certifikované bio, dodatočné sadzby na hektár podľa plodiny.\n- **Trvalá pastva** — 2 800–5 200 Kč/ha podľa ANC kategórie.\n- **Vyššie zatravnenie ornej pôdy** — prevod ornej na TTP, kompenzácia stratených tržieb.\n- **Sady extenzívnych ovocných druhov** — 5 200 Kč/ha.\n\nPravidlá:\n- **5-ročná zmluva** — porušenie = vrátenie dotácie za všetky predchádzajúce roky.\n- **Inkompatibility** — niektoré subtypy nie je možné kombinovať (napr. AEKO TTP + intenzívna pastva).\n- **Kontrola na mieste** — SZIF inšpekcia 5–10 % žiadateľov ročne + diaľkový prieskum.\n\nPre SR farmára:\n- AEKO sa vyplatí, ak má poľnohospodár dlhodobú stratégiu (zameranie na bio, krajinotvorbu, ochranu vodných zdrojov).\n- Pre klasickú intenzívnu farmu býva ROI horšie než EKO premium (viac paperwork, vyššie riziko sankcií).\n- Žiadateľom odporúčame najprv podať **EKO režim premium** a potom postupne pridávať AEKO subtypy podľa možností.",
    "related": [
      "cap-2024",
      "eko-platba",
      "biopasy"
    ]
  },
  {
    "slug": "gaec",
    "term": "GAEC (Dobrý poľnohospodársky a environmentálny stav)",
    "alias": [
      "GAEC",
      "kondicionality",
      "cross-compliance"
    ],
    "kategorie": "regulace",
    "shortDef": "GAEC sú povinné minimálne štandardy pre každého žiadateľa o priame platby CAP — pravidlá pre pôdu, vodu, krajinu. Porušenie = sankcie.",
    "longDef": "GAEC (Good Agricultural and Environmental Conditions, slovensky Dobrý poľnohospodársky a environmentálny stav) je súbor povinných štandardov, ktoré musí splniť každý žiadateľ o priame platby CAP. Predtým sa im hovorilo \"cross-compliance\" / \"kondicionality\".\n\nGAEC štandardy v SR 2024:\n- **GAEC 1**: Zachovanie trvalých trávnych porastov — zákaz orby TTP v Natura 2000 a celoslovensky nepoklesnúť pod 5 % pokles z 2018.\n- **GAEC 2**: Ochrana mokradí a rašelinišť — zákaz odvodňovania + obmedzenie orby v záplavovom území.\n- **GAEC 3**: Zákaz vypaľovania strniska — strniska je možné len mulčovať / zaorať / odstrániť balíkom.\n- **GAEC 4**: Ochranné pásma pozdĺž vodotečí — min. 3 m bez hnojív/pesticídov, pozdĺž vodárenských zdrojov 25 m.\n- **GAEC 5**: Tank management proti erózii — povinné protierózne pásy / krycie plodiny na svahovitej ornej pôde nad určitým sklonom.\n- **GAEC 6**: Minimálne pôdne pokrytie — strniska alebo krycia plodina od 1.11. do 28.2.\n- **GAEC 7**: Striedanie plodín — max 75 % výmery rovnakou plodinou + zákaz monokultúry 4+ rokov.\n- **GAEC 8**: Neproduktivní plochy (EFA) — min. 7 % výmery v krajinných prvkoch, biopásoch, meziplodinách.\n- **GAEC 9**: Zákaz orby Natura 2000 lokalít.\n\nSankcie za porušenie:\n- **Drobné** (1× nesplnený GAEC, opravené do termínu): 1 % zrážky.\n- **Štandardné**: 3 % zrážky z BISS + EKO.\n- **Vážne** (úmyselné porušenie): 5–15 % zrážky.\n- **Opakované**: 5 % + strata iných dotácií.\n\nKontroly: 1–5 % žiadateľov ročne formou fyzickej inšpekcie + satelitný monitoring (Copernicus SISAEC, identifikuje porušenie GAEC 5/6/7 z diaľky).",
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
      "Natura",
      "EVL",
      "vtáčia oblasť"
    ],
    "kategorie": "regulace",
    "shortDef": "Natura 2000 je európska sústava chránených území — v ČR cca 14 % rozlohy. Pre poľnohospodárov znamená obmedzenia (zákaz orby TTP, ochranné pásma) ale aj bonusové dotácie.",
    "longDef": "Natura 2000 je sieť chránených území v EÚ, vytvorená podľa dvoch smerníc: o biotopoch (1992) a o vtákoch (1979). Cieľ: zachovať biodiverzitu kľúčových ekosystémov a druhov.\n\nDva typy lokalít v ČR:\n- **EVL** (Európsky významné lokality) — chránia biotopy rastlín a hmyzu, vodné toky, mokrade.\n- **PO** (Vtáčie oblasti) — hniezdiská a migračné cesty ohrozených druhov.\n\nCelkovo ~14 % rozlohy ČR. Hlavné lokality: Krkonoše, Šumava, Třeboňsko, Pálava, Beskydy, Krušné hory, Moravský kras.\n\nPre poľnohospodárov:\n- **Zákaz orby TTP** (trvalé trávne porasty) v Natura 2000 — prísnejšie ako celonárodné GAEC 1.\n- **Obmedzenie hnojenia a pesticídov** — niektoré EVL zákaz syntetických N, len organické.\n- **Termíny kosenia** — typicky až po 15.6. (po hniezdení chriašteľa poľného).\n- **Povinný plán starostlivosti** — súhlas Správy CHKO pred zásadnou zmenou.\n\nBonusové dotácie:\n- **AEKO subtypy** špecificky pre Natura 2000 — vyššie sadzby (až +30 %).\n- **Kompenzačná platba** za stratu výnosov z obmedzení (typicky 1 000–3 000 Kč/ha).\n\nKonflikt: poľnohospodár vs Správa CHKO môže byť reálny — vždy si pred zakúpením/prenájmom pôdy v Natura 2000 skontrolujte LPIS a plán starostlivosti lokality (často kompletne mení hospodársky potenciál).",
    "related": [
      "cap-2024",
      "lpis",
      "aeko"
    ]
  },
  {
    "slug": "organicka-hmota",
    "term": "Organická hmota v pôde",
    "alias": [
      "humus",
      "organická složka",
      "humus content"
    ],
    "kategorie": "agrotechnika",
    "shortDef": "Organická hmota (humus) je odumretá rastlinná a živočíšna hmota v pôde. Kľúčový ukazovateľ zdravia pôdy — udržuje vodu, živiny, štruktúru, biodiverzitu.",
    "longDef": "Organická hmota (OH) v pôde je suma rozkladu rastlinných zvyškov, koreňov, mikroorganizmov a živočíchov. Meria sa ako \"obsah humusu\" v % sušiny ornice.\n\nHodnoty v SR:\n- **SR orná pôda priemer**: 1,5–2,5 % OH (relatívne nízke, predtým aj 3–4 % pred intenzifikáciou).\n- **TTP / pastviny**: 4–8 % OH (vyššie vďaka stabilnej vegetácii).\n- **Lesná pôda**: 8–15 % OH.\n- **Černozem (južnoslovenská)**: 3–4 % OH — najlepšia SR orná pôda.\n\nFunkcie OH:\n- **Vodná kapacita** — 1 % OH = +15 l vody / m² zadržené v pôde.\n- **Živinová rezerva** — N, P, K sa uvoľňuje pri rozklade.\n- **Pôdna štruktúra** — drobtovitá štruktúra, jednoduché spracovanie.\n- **Mikrobiológia** — baktérie, huby, pôdna fauna.\n- **Sekvestrácia uhlíka** — 1 % zvýšenia OH v 30 cm orničnej vrstve = 30 t C / ha viazané v pôde.\n\nZvyšovanie OH:\n- **Meziplodiny zaorané do pôdy** — biomasa rozkladu sa mení na humus.\n- **Stajový hnoj** — 25–40 t/ha raz za 3–4 roky.\n- **Kompost** — pomaly uvoľňuje, dlhý efekt.\n- **Bezorebné technológie (no-till)** — menej narušuje štruktúru, OH sa akumuluje.\n- **TTP rotácia** — ak časť výmery rotuje na TTP, OH dramaticky stúpa.\n\nPokles OH:\n- **Intenzívna orba** — prevzdušňuje, urýchľuje rozklad → strata OH.\n- **Monokultúry** — neudržateľné dlhodobo.\n- **Erozi** — odplavené s najhornšou ornicou.",
    "related": [
      "mezi-plodiny",
      "pH-pudy"
    ]
  },
  {
    "slug": "eroze-pudy",
    "term": "Erozia pôdy",
    "alias": [
      "vodná erózia",
      "veterná erózia",
      "strata ornice"
    ],
    "kategorie": "agrotechnika",
    "shortDef": "Erozia pôdy je proces, keď voda (dážď, povodeň) alebo vietor odnáša ornú pôdu z poľa. V ČR ohrozených cca 50 % ornej pôdy — hlavná príčina straty produktivity.",
    "longDef": "Erozia pôdy je prírodný proces, ktorý intenzívne poľnohospodárstvo dramaticky urýchľuje. Dva hlavné typy v ČR:\n\n**Vodná erózia** (dominantná):\n- Dážď uvoľní agregáty pôdy → splach sa steká po svahu → straty 2–50 t ornice/ha/rok.\n- Najviac ohrozené: svahovité pole nad 8°, dlhé pozemky, repka/cukrovka v širokých riadkoch.\n- Po extrémnych dažďoch (50+ mm/h) v jednom dni strata aj 100+ t/ha — viditeľné ryhy.\n\n**Veterná erózia**:\n- Suchšia južná Morava (Hodonínsko, Břeclav, Znojmo) — vetry odnášajú jemné častice.\n- Straty 1–10 t/ha/rok, menej dramatické ale konštantné.\n\nDôsledky:\n- **Strata najúrodnejšej vrstvy** (ornica 0–30 cm má najviac OH a živín).\n- **Zníženie výnosov** dlhodobo 5–25 %.\n- **Eutrofizácia vôd** — splavený fosfor → kvet rias v Brnianskej priehrade, Vranove atď.\n- **Zaplavenie obcí** — bahno z polí upcháva kanalizácie.\n\nOchrana proti vodnej erózii (povinná podľa GAEC 5):\n- **Protierózne pásy** — pásy plodín striedavo s TTP/medziplodinou naprieč svahom.\n- **Strip-till / no-till** — bez orby, korene držia pôdu.\n- **Kontúrová orba** — orba pozdĺž vrstevníc, nie po spádnici.\n- **Medziplodiny** cez zimu — povinné na erózne ohrozených DPB.\n- **Vegetatívne pásy** pozdĺž vodných tokov.\n\nAk poľnohospodár nesplní GAEC 5 → 3–15 % sankcie z BISS + EKO.",
    "related": [
      "mezi-plodiny",
      "organicka-hmota",
      "gaec"
    ]
  },
  {
    "slug": "allwheel-drive",
    "term": "Pohon 4×4 / Pohon všetkých kol",
    "alias": [
      "MFWD",
      "Mechanický pohon predných kolies",
      "4WD"
    ],
    "kategorie": "technologie",
    "shortDef": "Pohon 4×4 (MFWD) pridáva pohon na prednú nápravu — zvyšuje ťahovú silu, znižuje preklz, lepšie v rozbahnenom teréne. Štandard u 95 % moderných traktorov.",
    "longDef": "Pohon 4×4 u traktorov (technicky **MFWD** = Mechanický pohon predných kolies) pridáva pohon na prednú riadenú nápravu. Štandard u všetkých traktorov s výkonom nad 50 koní od 90. rokov.\n\nKonstrukcia:\n- **Mechanický náhon** cez dlhý hriadeľ z prevodovky k prednému diferenciálu.\n- **Spojka** v náboji alebo v diferenciáli — vodič môže 4×4 vypnúť (pre cestnú jazdu šetrí palivo + zabraňuje \"vrteniu\" na rovných cestách).\n- **Rovnaké veľké kolesá** vpredu aj vzadu u tzv. **isodiametrických** traktorov (rovnako nazývané \"Trike\" — Fendt 1000, JD 9R) — zabezpečí dokonalú trakciu, ale je potrebné rezervovať pozemok pre veľký zatáčací polomer.\n\nRozdiely od osobného auta 4×4:\n- **Traktorová predná náprava** je výrazne vyššia a robustnejšia (kvôli veľkým kolesám).\n- **Predný diferenciál** typicky bez aktívneho obmedzenia (žiadny Torsen / haldex).\n- **Diferenciálna uzávierka** zadná + predná — vodič zapne pre maximálnu trakciu v blate.\n\nVýhody:\n- **+25–40 % ťahovej sily** vs len zadný pohon.\n- **Lepšia stúpavosť** — dôležité pre horské pastviny a lesné práce.\n- **Menej preklzu** — menej utuženia pôdy + úspora paliva pri ťažkom ťahu.\n\nNevýhody:\n- **Vyššia obstarávacia cena** o 100–300 tis. Kč vs 2×4 verzia (ktoré dnes takmer neexistujú).\n- **Viac súčastí na servis** — kardany, diferenciál, dve sady kolies.\n- **Vyššia spotreba** na ceste (preto možnosť vypnutia).",
    "related": [
      "cvt-prevodovka",
      "tribod"
    ]
  },
  {
    "slug": "duala",
    "term": "Duals / Dvojmontáž",
    "alias": [
      "dvojmontáž kolies",
      "duals"
    ],
    "kategorie": "technologie",
    "shortDef": "Dvojmontáž (duals) je sada dvoch kolies na každej náprave (celkom 4 zadné + 4 predné) — znižuje tlak na pôdu, zvyšuje plávajúcu schopnosť, používa sa u flagship traktorov.",
    "longDef": "Dvojmontáž (duals, dual wheels) znamená montáž dvoch kolies vedľa seba na každej náprave namiesto jedného. U traktoru nad 250 koní takmer povinné pre poľné práce.\n\nPrincíp: dve kolesá = 2× väčšia kontaktná plocha → polovica meraného tlaku na pôdu. Pri hmotnosti 12 t traktoru bez duals je tlak 1,5–2 bar/cm² (utužujúci), s duals klesá na 0,7–1 bar/cm² (akceptovateľné).\n\nPoužitie:\n- **Veľké traktory 250+ koní** — Fendt 900/1000, JD 8R/9R, NH T9, Case Steiger.\n- **Sady kolies** — duals len pre poľné práce, demontáž pre cestnú prepravu (širšie než 2,55 m → prekračuje EÚ normu pre verejné komunikácie).\n- **Trojnásobná montáž (triples)** u superflagship 600+ koní traktorov (zriedkavé v Európe, bežné v USA).\n\nCena:\n- **Duals adaptéry + ráfky + pneumatiky** typicky 250 000–500 000 Kč pre 4× zadné.\n- **Triples** 1 000 000+ Kč.\n\nPozor: prevádzka s duals na ceste v EÚ = pokuta 5 000–20 000 Kč + ukončenie jazdy. Vždy montáž len tesne pred vyjazdením na pole, demontáž po dokončení. U flagship fariem riešia rýchlospojkami za 5–15 minút.",
    "related": [
      "allwheel-drive"
    ]
  },
  {
    "slug": "rotor-kombajn",
    "term": "Rotor / Rotorový kombajn",
    "alias": [
      "axial-flow",
      "tangenciálny",
      "rotorová mlátička"
    ],
    "kategorie": "technologie",
    "shortDef": "Rotorový kombajn (axial-flow) využíva pozdĺžny rotor namiesto klasického valcového mlátu — vyššia priepustnosť, menšie poškodenie zrna, vyšší výkon.",
    "longDef": "Klasická zberová mlátička má **valcový mlat** (klasický cylindr s lopatkami) a **vytŕasače** pre separáciu slamy. Rotorový kombajn nahrádza oboje jedným **pozdlžným rotorem** (axial-flow), ktorým prechádza celý slámový tok.\n\nVýhody rotoru:\n- **+15–25 % priepustnosť** pri zbere vs valcový mlat rovnakej veľkosti.\n- **Menej poškodenia zrna** — mäkšie mlátenie (dĺžšia dráha, nižšie nárazy).\n- **Lepšia separácia** za vlhkých podmienok (po daždi, rannej rose).\n- **Jednoduchšia údržba** — menej súčastí, menej klinových remeňov.\n\nNevýhody:\n- **Vyššia spotreba paliva** — rotor potrebuje viac energie.\n- **Horšie v dlhé slame** — ak chcete kvalitnú stéblovú slamu pre balíky, tradičný mlat robí lepšie.\n- **Vyššia obstarávacia cena** o 10–20 % vs ekvivalentný valcový mlat.\n\nHlavné rotorové značky:\n- **Case IH Axial-Flow** — priekopník (od 1977), dnes dominantný v USA.\n- **John Deere S-Series** (od 2012) — single rotor.\n- **New Holland CR** — twin rotor (dva paralelné rotory).\n- **Fendt IDEAL** — dual helix rotor.\n- **Claas Lexion** — APS Hybrid (kombinácia valcového mlatu + akcelerácia + rotorová separácia) — kompromis.\n\nNa Slovensku: rotor preferuje 40 % farmárov, valcový 60 % (kvôli slame a nižšej cene). Pre typickú farmu < 300 ha stačí klasický valcový.",
    "related": [
      "kombajn-trida",
      "mlatecka"
    ]
  },
  {
    "slug": "kombajn-trida",
    "term": "Trieda kombajnu",
    "alias": [
      "Class",
      "Klassen"
    ],
    "kategorie": "technologie",
    "shortDef": "Trieda kombajnu (I–X+) je klasifikácia veľkosti a výkonu — vychádza z plochy mlátiaceho bubna a počtu vytřásadiel. Vyššia trieda = vyššia priepustnosť.",
    "longDef": "Trieda zberacej mláťačky je európska klasifikácia podľa priepustnosti a veľkosti mlátiaceho ústrojenstva. Vychádza hlavne z **plochy mlátiaceho bubna** a **počtu vytřásadiel** (u klasických) alebo **veľkosti rotora** (u rotorových).\n\nPribližný prehľad:\n- **Trieda III**: 100–120 kW (135–160 k), záber 4 m, zásobník 4 500 l.\n- **Trieda IV**: 120–155 kW (160–210 k), záber 4,5–5 m, zásobník 5 500 l.\n- **Trieda V**: 155–185 kW (210–250 k), záber 5–6 m, zásobník 6 500 l.\n- **Trieda VI**: 185–230 kW (250–310 k), záber 6–7,5 m, zásobník 7 500 l.\n- **Trieda VII**: 230–270 kW (310–365 k), záber 7,5–9 m, zásobník 9 000 l.\n- **Trieda VIII**: 270–330 kW (365–445 k), záber 9–10,5 m, zásobník 10 500 l.\n- **Trieda IX**: 330–400 kW (445–540 k), záber 10,5–12 m, zásobník 12 000 l.\n- **Trieda X / X+**: 400+ kW (540+ k), záber 12–18 m, zásobník 14 000+ l.\n\nPre CZ farmu:\n- **50–200 ha obilnín**: trieda IV–V (Claas Avero, JD T560, Case 5140).\n- **200–500 ha**: trieda VI–VII (Claas Tucano, JD T670, NH CX5/CX7).\n- **500–1500 ha**: trieda VIII–IX (Claas Lexion 7000/8000, JD S780, Fendt IDEAL 8).\n- **1500+ ha alebo zberný podnik**: trieda X (Claas Lexion 8900, JD X9, Fendt IDEAL 10T).\n\nVyššia trieda neznamená automaticky lepšie — je to otázka kapacity. Predimenzovaný kombajn = neefektívne využitie kapitálu.",
    "related": [
      "rotor-kombajn"
    ]
  },
  {
    "slug": "header",
    "term": "Hederové žacie zariadenie",
    "alias": [
      "header",
      "žací stôl",
      "cutting bar"
    ],
    "kategorie": "technologie",
    "shortDef": "Hederové žacie zariadenie (header) je predná časť kombajnu — žací stôl, ktorý strihá plodinu a dopravuje ju do mlátu. Záber 4–18 m podľa triedy kombajnu.",
    "longDef": "Hederové žacie zariadenie (header) je modulárny predný nástavec zberovej mlátičky. Existujú **špecializované hedery pre rôzne plodiny**:\n\n**Obilniny / repka** (universal grain header):\n- Záber 4–18 m podľa triedy kombajnu.\n- Variabilná lišta (Vario) pre repku — predĺženie o 70–90 cm pre úzke rezanie drobnozrnných plodín.\n- Cena 0,8–4 mil. Kč nový, ojazdený 50 % ceny.\n\n**Kukurica** (corn header):\n- 4-6-8-12 riadkové verzie.\n- Hrubo upravený stôl s lapačmi, nie klasická lišta.\n- Cena 1,2–3,5 mil. Kč.\n\n**Pickup** (pre siláž z riadku, pre-sklizeň):\n- Zbiera riadky z poľa, žiadne nové rezanie.\n- Špecifický pre trávne senáže.\n\n**Sunflower header** (slnečnica):\n- Snapping rolls — odrezáva hlavičku.\n- Zriedkavý v CZ, len pre špecialistov.\n\nPravidlá pre výber:\n- **Záber = 0,4× kombajn trieda** (Trieda V = 4,5–5 m header).\n- **Vyšší záber ≠ vyšší výkon** — ak kombajn nemá kapacitu na priepustnosť, väčší header len spomalí.\n- **Transport** — všetky hedery nad 7 m vyžadujú **rozkladací systém** alebo **vozík** pre cestnú prepravu (záber cez 2,55 m je nelegálny bez záboru).\n\nMnoho farmárov má dva hedery: **obilný + kukuričný** s rýchlospojkou (5–10 minút výmena).",
    "related": [
      "kombajn-trida",
      "rotor-kombajn"
    ]
  },
  {
    "slug": "orba",
    "term": "Orba",
    "alias": [
      "hlboké spracovanie",
      "plow",
      "oranie"
    ],
    "kategorie": "agrotechnika",
    "shortDef": "Orba je hlboké obracanie pôdy pluhom do hĺbky 20–35 cm. Tradičný základ jesenného spracovania — narúša štruktúru, ničí buriny, zaoráva organickú hmotu.",
    "longDef": "Orba je najtradičnejší spôsob spracovania pôdy — pluh reže a obracia 20–35 cm hrubú vrstvu ornice. V ČR dominantná metóda od 19. storočia.\n\n**Typy pluhov**:\n- **Nesený pluh** — pripevnený trojbodom, ľahší (do 4 radlíc).\n- **Polonesený / ťahaný** — väčšie pluhy 5–12 radlíc, opora kolesa.\n- **Variopluh** — premenlivý záber radlíc počas jazdy.\n- **Otočný pluh (reverse)** — obráti radlice = orie oboma smermi, žiadne medzery v páse.\n\n**Hĺbka orby**:\n- **Mäkká (15–20 cm)** — pre letné spracovanie po zbere.\n- **Stredná (20–28 cm)** — štandard pre jesennú orbu pod oziminy.\n- **Hlboká (28–35 cm)** — proti utuženiu podorničia, výnimočne 1× za 3–5 rokov.\n\n**Spotreba** pluhu (orientačne):\n- 3-radlicový pre 100 koňový traktor: 12–18 l nafty/ha.\n- 5-radlicový pre 200 koňový: 18–25 l nafty/ha.\n- 8-radlicový pre 350 koňový: 22–30 l nafty/ha.\n\n**Trendy proti orbe**:\n- **No-till** / bezorbové — žiadna orba, len sejačka priamo do strniska. Šetrí palivo (5–10 l/ha) ale vyžaduje vyššie dávky herbicídov.\n- **Min-till** (minimum tillage) — len mäkké spracovanie (5–15 cm) namiesto orby. Kompromis.\n- **Strip-till** — orba len v riadkoch, medzery zostanú nedotknuté.\n\nV CZ aktuálne 60 % orby, 30 % min-till, 10 % no-till.",
    "related": [
      "mezi-plodiny",
      "eroze-pudy"
    ]
  },
  {
    "slug": "no-till",
    "term": "No-till / Bezorebné spracovanie",
    "alias": [
      "direct drilling",
      "priamé sekanie"
    ],
    "kategorie": "agrotechnika",
    "shortDef": "No-till (bezorebné spracovanie) vynecháva orbu — secí stroj seje priamo do strniska. Šetrí palivo, chráni pôdu pred eróziou, ale vyžaduje vyššie dávky herbicídov.",
    "longDef": "No-till je metóda spracovania pôdy, ktorá **úplne vynecháva orbu** i iné hlboké narušenie pôdy. Sadenie (osiva) prebieha priamo do strniska predchádzajúcej plodiny pomocou **disko-secího stroja** alebo **dlátového secího**.\n\nVýhody:\n- **Úspora paliva 50–80 %** vs konvenčná orba.\n- **Menej erózie** — povrch zostáva krytý, pôda neodplavovaná.\n- **Vyšší obsah organickej hmoty** — strnisko + korene sa rozkladajú v pôde.\n- **Lepšie zadržiavanie vody** — vyššia kapilarita.\n- **Menej práce** — 1 operácia namiesto 3–5 (orba + smyk + brány + sekanie).\n\nNevýhody:\n- **Vyššie dávky herbicídov** — bez orby burinu nezničí, kompenzácia glyfosátom.\n- **Pomalejšie prehriatie pôdy na jar** — strnisko drží chlad.\n- **Riziko pôdnych chorôb** — patogénne zvyšky zo strniska.\n- **Nutnosť špecializovaného secího stroja** — Horsch Avatar / Maestro, Väderstad Rapid, John Deere 750A. Cena 1,5–4 mil. Kč.\n\nV SR:\n- Hlavne **Južná Morava + Vysočina** (suché oblasti) — no-till funguje najlepšie v aridných podmienkach.\n- **Severné Čechy + horské oblasti** — orba dominantná (chladnejšie, vlhkejšie podnebie).\n- **EÚ dotácie** preferujú no-till cez EKO režim — premium 1100 Kč/ha navyše.\n\nOdporúčame vyskúšať no-till na **časti poľa 2–3 sezóny** pred plnou konverziou — výnosy môžu v prvom roku klesnúť o 5–10 %, ale stabilizujú sa a dlhodobo (5+ rokov) výrazne rastú.",
    "related": [
      "orba",
      "eroze-pudy"
    ]
  },
  {
    "slug": "pre-emergence",
    "term": "Pre-emergence postrek",
    "alias": [
      "pre-emergent",
      "pred vzídením"
    ],
    "kategorie": "agrotechnika",
    "shortDef": "Pre-emergence postrek sa aplikuje na pole po siatí, ale pred vzídením plodiny aj buriny. Zničí klíčiace buriny skôr, než vyrastú — kľúčový pre čistý lán.",
    "longDef": "Pre-emergence (pre-em, \"pred vzídením\") je herbicídna stratégia aplikácie prípravkov **po siatí, ale pred vzídením plodiny aj buriny**. Cieli na klíčiace buriny v kritickej fáze rastu.\n\n**Hlavné účinné látky**:\n- **Pendimethalin** (Stomp) — pre obilniny, repku, slnečnicu.\n- **Prosulfocarb** (Defi) — proti psárke v obilninách.\n- **Metribuzin** — pre zemiaky, sóju.\n- **S-Metolachlor + Mesotrione** — pre kukuricu.\n\n**Načasovanie**:\n- **0–7 dní po siatí** — závisí na rýchlosti vzchádzania.\n- **Pôda musí byť vlhká** — sucho = pre-em nefunguje (látka neprenikne k semenám buriny).\n- **Bez dažďa do 2 dní** ideálne — dážď by mohol zmyť látku.\n\nDávkovanie typicky 2–4 l/ha. Cena 200–600 Kč/ha za pre-em ošetrenie.\n\n**Výhody**:\n- **Zničí 70–90 % buriny** skôr, než vyklíči.\n- **Znižuje nutnosť post-em (po vzídení) postreku** — menej chémie celkovo.\n- **Plodina vzíde do \"čistého\" poľa** — vyšší výnos.\n\n**Obmedzenia**:\n- **Selektívna odolnosť burín** — opakované pre-em vedie k rezistencii (najmä psárka, hniezdovka, bôľ v obilninách).\n- **Citlivosť na sucho** — bez dažďa ošetrenie zlyhá.\n- **Niektoré plodiny zle znášajú** — repka je citlivá na pendimethalin.\n\nPre CZ farmárov: pre-em je štandard u repky a obilnín. U jarín (sója, kukurica) voľba medzi pre-em a post-em.",
    "related": [
      "orba",
      "roundup"
    ]
  },
  {
    "slug": "osevni-postup",
    "term": "Osevný postup",
    "alias": [
      "rotácia plodín",
      "crop rotation",
      "striedanie plodín"
    ],
    "kategorie": "agrotechnika",
    "shortDef": "Osevný postup je plánované striedanie plodín na poli v rôznych rokoch. Kľúčový princíp udržateľného poľnohospodárstva — zlepšuje pôdu, znižuje buriny a choroby.",
    "longDef": "Osevný postup je systematické striedanie plodín na rovnakom pozemku v rôznych rokoch. Tradičné poľnohospodárstvo základ — vedelo sa to už v stredoveku (\"3-pole systém\": ozim → jarina → úhor).\n\n**Typický CZ osevný postup** (štvorročný):\n1. **Repka** (ozim) — zlepšuje štruktúru, hlboký koreň.\n2. **Pšenica ozimná** — štandardná cash crop.\n3. **Cukrovka alebo zemiaky** — okopanina, narúša buriny.\n4. **Jarné obilie (jačmeň) alebo kukurica** — uzatvára cyklus.\n\nNiekedy pridané **5. miesto: lucerna / ďatelina** (3 roky bez výsevu, regeneruje pôdu, viaže dusík).\n\n**Princípy**:\n- **Nestavať rovnakú plodinu po sebe** — riziko chorôb (napr. fuzariózy v pšenici).\n- **Striedať hlboký + plytký koreň** — repka (hlboko) + obilie (plytko).\n- **Zaradiť strukovinu** — sója, hrach, viky = fixujú dusík, šetria hnojivo.\n- **Okopanina (cukrovka, zemiaky)** = \"čistič\" — narúša cykly buriny.\n\n**CAP 2024 pravidlá**:\n- **GAEC 7**: zákaz monokultúry 4+ rokov za sebou.\n- Maximum 75 % výmery rovnakou plodinou v jednom roku.\n- **EKO premium** vyžaduje **min. 4 rôzne plodiny** na ornej pôde.\n\n**Dôsledky porušenia**:\n- **Kratšia rotácia** (napr. pšenica → pšenica → kukurica → pšenica) = vyššie výnosy krátkodobo, ale za 5–10 rokov pokles výnosov o 15–25 % kvôli pôdnym chorobám.\n- **Monokultúra kukurice** (extrém v USA, sporadicky CZ): vyžaduje masívne hnojenie + insekticídy.\n\nDobrý osevný postup je **najlepšia poľnohospodárska praktika \"zadarmo\"** — bez chémie, len plánovaním plodín.",
    "related": [
      "mezi-plodiny",
      "eko-platba",
      "gaec"
    ]
  },
  {
    "slug": "section-control",
    "term": "Section Control",
    "alias": [
      "automatické vypínanie sekcií",
      "TC-SC"
    ],
    "kategorie": "precise-farming",
    "shortDef": "Section Control je GPS-riadené automatické vypínanie sekcií postrekovača / kosačky / secieho stroja v súvratiach, prekrytí alebo v už ošetrených pásoch. Šetrí 5–15 % chémie/osiva.",
    "longDef": "Section Control (technicky **TC-SC** v ISOBUS — Task Controller Section Control) je systém automatického vypínania jednotlivých sekcií (častí) náradia podľa GPS pozície a predchádzajúcej stopy pokryvu.\n\n**Aplikácie**:\n- **Postrekovač** — 12–24 m rameno rozdelené na 6–24 sekcií, každá sa vypne samostatne. V súvratiach, na klinu, na zužujúcom sa konci poľa.\n- **Secí stroj** — vypínanie riadkov v súvratiach, kde už osivo padlo.\n- **Rozmetadlo hnojív** — variabilný výsek pásu hnojiva podľa pozície.\n\n**Princíp**:\n1. RTK GPS prijímač pozície ±2 cm.\n2. ISOBUS TC-SC zaznamenáva **as-applied map** — kde bolo aplikované.\n3. Pri ďalšom prejazde (súvrat, klin) systém vypne sekcie, ktoré by aplikovali do už pokrytého pásu.\n\n**Úspora**:\n- **Postrekovač**: 5–15 % chémie/sezónu (záleží na tvare poľa — pravidelný štvorec 5 %, nepravidelné polia 15+ %).\n- **Hnojivo**: 5–10 %.\n- **Osivo**: 3–8 %.\n\n**ROI** (orientačne, pre farmu 200 ha):\n- Cena Section Control retrofit: 80 000–250 000 Kč.\n- Úspora chémie 2 500 Kč/ha × 0,1 (10 %) = 250 Kč/ha × 200 ha = 50 000 Kč/rok.\n- ROI: 1,5–5 rokov.\n\n**Aktuálne**:\n- Štandard u veľkých moderných postrekovačov (Amazone UX, Horsch Leeb, Dammann).\n- ISOBUS TC-SC licencia typicky 20–60 tisíc Kč u traktora.\n- Retrofit u starých postrekovačov 100–200 tis. Kč.",
    "related": [
      "isobus",
      "gps-rtk",
      "variable-rate"
    ]
  },
  {
    "slug": "leasing-vs-uver",
    "term": "Leasing vs úver",
    "alias": [
      "operatívny leasing",
      "finančný leasing"
    ],
    "kategorie": "dotace",
    "shortDef": "Leasing a úver sú dve cesty financovania traktora. Leasing = prenájom s opciou odkupu na konci, úver = banková pôžička. Líšia sa DPH, vlastníctvom a flexibilitou.",
    "longDef": "**Finančný leasing** = prenájom s povinnou opciou odkupu na konci (typicky za 1–5 % zvyškových nákladov).\n\n**Operatívny leasing** = prenájom bez opcie, na konci stroj vraciate. Vhodný pre krátke obdobie (3–5 rokov), bez starostí o predaj.\n\n**Bankový úver** = klasická pôžička, stroj je hneď váš, ručíte zástavou.\n\n| | Finančný leasing | Operatívny leasing | Bankový úver |\n|---|---|---|---|\n| **Vlastníctvo počas** | leasingovka | leasingovka | vy (zástava banke) |\n| **Vlastníctvo po splatení** | vy | leasingovka | vy |\n| **DPH** | rozložené po splátkach | len na splátky (vždy) | celé vopred |\n| **Akontácia** | 0–30 % | 0–30 % | 0–20 % |\n| **Sadzba (2026)** | 5,5–8 % p.a. | 6–9 % p.a. | 5–7 % p.a. |\n| **Doba** | 24–84 mesiacov | 24–60 mesiacov | 12–96 mesiacov |\n| **Flexibilita** | nízka (penalty za predčasné ukončenie) | nízka | vyššia (refinancovanie) |\n\n**Pre SK farmárov**:\n- **Finančný leasing** je štandard pre 70 % nákupov — predvídateľnosť splátok, daňová optimalizácia.\n- **Úver** sa vyplatí pre **drahé stroje 5+ mil. Kč** s vysokou akontáciou — nižší celkový úrok.\n- **Operatívny leasing** je výnimočný — vhodný pre **podnikateľov v zberových službách**, kde stroj 5 rokov intenzívne využíva a potom vracia.\n\n**Captive financovanie značky** (John Deere Financial, AGROTEC FS, AGRI CS Finance):\n- Často akčné sadzby 4–6 % na nové stroje vlastnej značky.\n- Spojené s predajcom — výhodné kombinovať so zľavou na cene stroja.\n- Pre ojazdené stroje zvyčajne vyššie sadzby ako univerzálne banky.\n\n→ [Kalkulačka leasingu traktora](/kalkulacka/leasing-traktoru/) pre orientačný výpočet mesačnej splátky.",
    "related": [
      "cap-2024"
    ]
  },
  {
    "slug": "rolnicke-pravidla-silnicni",
    "term": "Cestné pravidlá pre traktory",
    "alias": [
      "STK traktoru",
      "značenie šírky",
      "doprava na poli"
    ],
    "kategorie": "regulace",
    "shortDef": "Traktor na verejnej ceste v SK podlieha pravidlám: max šírka 2,55 m bez záboru, výška 4 m, povinné značenie náradia, STK 1× za 2 roky.",
    "longDef": "Prevádzka traktora na verejnej ceste v SR je regulovaná **zákonom 361/2000 Z.z.** a **vyhláškou 341/2002 Z.z.**\n\n**Maximálne rozmery bez záboru verejnej komunikácie**:\n- **Šírka**: 2,55 m (výnimky pre poľnohospodárske stroje 3 m, nad to nutný zábor).\n- **Výška**: 4 m (kabína + výfuk + výrobou nainštalované doplnky).\n- **Dĺžka traktor + náves/náradie**: 12 m (samostatný traktor), 16,5 m s návesom.\n\n**Ak prekračujete** (širšie náradie, dvojmontáž, hlboké pluhy):\n- **Sprievodné vozidlo** s blikajúcimi signalistami.\n- **Zábor cesty** povolený políciou, max 2 hodiny + plán obchádzky.\n- Pokuta za nesplnenie: 5 000–50 000 Kč.\n\n**Značenie náradia**:\n- **Tabuľky 423 × 423 mm** s žltými / červenými pásmi na okrajoch širokého náradia.\n- **Reflexné pásy** v noci alebo za zníženej viditeľnosti.\n- **Blikajúce žlté svetlo** povinné pre stroje širšie 2,55 m.\n\n**STK (Stanica technickej kontroly)**:\n- **Traktor s SPZ**: STK 1× za 2 roky.\n- **Bez SPZ** (len pole): bez STK, ale prevádzka na ceste zakázaná (aj 10 m medzi susednými poliami).\n- **Test**: brzdy, svetlá, ozvučenie (klaksón), výfukový systém, kabína, sedadlo.\n\n**Vodičský preukaz**:\n- **T (traktor)** — od 17 rokov, povinný pre prácu na poli aj prevoz.\n- **B (osobný)** — niektoré malé traktory do 50 km/h a do 7,5 t s B-čkem (kontroverzia, vyžaduje upresnenie v RP).\n\n**Poistenie**:\n- **Povinné ručenie** — aj pre prácu na poli (cca 4 000–12 000 Kč/rok).\n- **Havarijné** — voliteľné, odporúčané pre nové stroje (3–5 % z ceny ročne).",
    "related": [
      "allwheel-drive",
      "duala"
    ]
  },
  {
    "slug": "ozim-jarin",
    "term": "Ozimy vs jarné plodiny",
    "alias": [
      "ozimy",
      "jarné plodiny",
      "autumn vs spring crops"
    ],
    "kategorie": "agrotechnika",
    "shortDef": "Ozim sa vysieva na jeseň, jarná plodina na jar. Ozim využije zimnú vlhkosť, dá vyššie výnosy. Jarná plodina má kratší cyklus, vyššie riziko sucha.",
    "longDef": "Plodiny delíme podľa obdobia siatia:\n\n**Ozimy** (sú siate na jeseň, september–október):\n- **Pšenica ozimá** — dominantná SK obilnina, 60 % výmery obilnín.\n- **Jačmeň ozimý** — pre pivovary, vyšší výnos než jarný.\n- **Repka ozimá** — strategická olejovina, výnos 3,5–4,5 t/ha.\n- **Žito ozimé** — pre chlieb a krmivá, znáša slabšie pôdy.\n- **Tritikále** — kríženec pšenice + žita, robustný.\n\nVýhody ozimov:\n- Zimná vlhkosť = stabilnejšie výnosy.\n- Skoršia sklizeň (júl) = uvoľnenie plochy pre meziplodiny.\n- Vyšší celkový výnos vs jarné plodiny (o 15–30 %).\n\nRiziká:\n- **Vymrznutie** v tuhej zime bez snehovej pokrývky.\n- **Hlemýždí** napadnutie v jesennej vlhkej sezóne.\n\n**Jarné plodiny** (sú siate na jar, marec–apríl):\n- **Jačmeň jarný** — pre pivovary kvalitnejší (sladovnícky).\n- **Pšenica jarná** — okrajová, len kde ozim vymrzol.\n- **Kukurica** — letné zrnové aj siláž.\n- **Sója, slnečnica** — letné olejoviny.\n- **Zemiaky, cukrovka** — okopaniny.\n- **Hrach, vikev** — strukoviny.\n\nVýhody jarných plodín:\n- Krátky cyklus (3–4 mesiace).\n- Možnosť reagovať na trh (siete podľa aktuálnych cien).\n- Menej riziko zimného vymrznutia.\n\nRiziká:\n- **Sucho** v máji–jún = nízke výnosy.\n- **Vyššia koncentrácia prác** v krátkom období.\n\nPre SK farmu je štandardné **70 % ozimy + 30 % jarné plodiny**.",
    "related": [
      "osevni-postup",
      "orba"
    ]
  },
  {
    "slug": "lav-can",
    "term": "LAV / CAN (Dusičnan amónny s vápencom)",
    "alias": [
      "CAN",
      "Dusičnan vápenatý",
      "Calcium Ammonium Nitrate"
    ],
    "kategorie": "hnojivo",
    "shortDef": "LAV (CAN) je dusíkaté hnojivo s obsahom 27 % N a vápencom. Druhé najpoužívanejšie N-hnojivo v ČR po močovine. Rýchly efekt, bezpečnejšie skladovanie.",
    "longDef": "LAV (Dusičnan amónny s vápencom, angl. CAN — Calcium Ammonium Nitrate) je granulované dusíkaté hnojivo. Obsahuje **27 % N** (50 % nitrát NO₃⁻, 50 % amónium NH₄⁺) a cca **8 % CaO** + 4 % MgO z vápennej zložky.\n\nHlavné výhody oproti močovine:\n- **Okamžitý účinok** — polovica N v nitrátovej forme je hneď využiteľná rastlinou.\n- **Žiadne straty volatilizáciou** (úniky NH₃) — bez nutnosti zapracovania.\n- **Bezpečnejšie skladovanie** — neexploduje (čistý dusičnan 33 % N je výbušnina, LAV s vápencom nie).\n- **Vápenný efekt** — slabo zvyšuje pH pôdy (vs močovina, ktorá je neutrálna až mierne kyslá).\n\nPoužitie:\n- **Jarný top dressing ozimín** — 200–400 kg/ha (= 54–108 kg N/ha).\n- **Pre-em pre jarné plodiny** — 150–250 kg/ha pod kukuricu, slnečnicu.\n- **Lepšie než močovina za suchého počasia** — močovina vyžaduje vlhko pre hydrolýzu, LAV funguje aj v suchu.\n\nCena (2024): cca 11 000–14 000 Kč/t v IBC vreciach 600 kg. O ~15 % drahšie na kg N než močovina, ale praktickejšie.\n\nV CZ dominantný výrobca: Lovochemie (Lovosice) — značky LAV 27. Import z Poľska (Yara, Anwil) a Slovenska (Duslo).",
    "related": [
      "mocovina",
      "npk-hnojivo",
      "pH-pudy"
    ]
  },
  {
    "slug": "dam-390",
    "term": "DAM 390 (Kapalné hnojivo)",
    "alias": [
      "DAM",
      "UAN",
      "Urea Ammonium Nitrate solution"
    ],
    "kategorie": "hnojivo",
    "shortDef": "DAM 390 je kapalné dusíkaté hnojivo s 30 % N (mix močoviny + ledku amonného + vody). Aplikácia cez postrekovač — rýchle, rovnomerné, bez prachu.",
    "longDef": "DAM 390 (ang. UAN 32 — Urea Ammonium Nitrate solution) je najpoužívanejšie kapalné dusíkaté hnojivo v EÚ. **30 % N v 1 litri = 390 g N/l** (preto \"DAM 390\"). Zloženie:\n- 50 % močovina (15 % N celkom)\n- 25 % ledek amonný (7,5 % N celkom)\n- 25 % voda (7,5 % N v amid + nitrát formách)\n\nAplikácia:\n- **Postrekovač s trubkovými tryskami** (nie klasické rozprašovače — DAM by spálil list).\n- **Hnojivová sada na postrekovači** — špeciálne 5–7 paprskové trysky vystrelia kvapalinu medzi riadky.\n- **Dávkovanie** 100–250 l/ha (= 39–98 kg N/ha).\n- **Časy aplikácie**: jarné vzchádzanie obilnín, druhá dávka na kvitnutie, prípadne listové hnojenie (5–15 l/ha v poradení).\n\nVýhody:\n- **Rovnomernosť** — žiadne rozpadlé granule, plynulý spray.\n- **Rýchlosť práce** — 80–150 ha/deň s postrekovačom 24 m.\n- **Možnosť kombinácie** s mikroprvkami, ochrannými prípravkami v tank-mix.\n- **Skladovanie** v IBC (1000 l) alebo cisternách (10+ t) — bez nutnosti uzavretého skladu.\n\nNevýhody:\n- **Sklon k popáleniu listu** pri horúčave nad 22 °C alebo priamom slnku.\n- **Koróznej k vodárenstvu** — separátna cisterna a čerpadlo.\n\nCena (2024): cca 7 500–10 500 Kč/t (= 19–27 Kč/kg N — výrazne lacnejšie než pevné hnojivá za jednotku N).",
    "related": [
      "mocovina",
      "lav-can",
      "npk-hnojivo"
    ]
  },
  {
    "slug": "vapneni",
    "term": "Vápnenie pôdy",
    "alias": [
      "vápnenie",
      "liming",
      "CaCO₃ aplikácia"
    ],
    "kategorie": "agrotechnika",
    "shortDef": "Vápnenie je aplikácia vápenatých látok do pôdy na úpravu pH a doplnenie vápnika. Kľúčový dlhodobý zásah pre úrodnosť — 1× za 4–8 rokov podľa pH.",
    "longDef": "Vápnenie je proces aplikácie vápenatých produktov do pôdy, ktorým sa cielene:\n1. **Upraví pH** smerom k optimu (5,5–7,0 pre väčšinu plodín).\n2. **Doplní vápnik** ako živina (Ca je makroživina, ktorú rastliny viažu v desiatkach kg/ha/rok).\n3. **Zlepší štruktúra** pôdy (Ca flokuluje íl, zvyšuje kapilaritu).\n\nHlavné produkty:\n- **Mletý vápenec (CaCO₃)** — najlacnejší, pomalý účinok (3–6 mesiacov), dávka 2–6 t/ha.\n- **Dolomitický vápenec (CaCO₃ + MgCO₃)** — pre pôdy chudé na Mg, dávka 2–6 t/ha.\n- **Vápenec pálený (CaO)** — agresívny, rýchly účinok, dávka 0,8–2,5 t/ha. Nutná opatrnosť (popáli korene).\n- **Hašené vápno (Ca(OH)₂)** — pre extrémne kyslé pôdy, veľmi rýchly účinok.\n- **Cukrovarnické saturačné kaly** — odpad z výroby cukru, lacný zdroj Ca + organickej hmoty.\n\nCena (2024): 800–1 800 Kč/t vrátane dovozu (vápenec). Aplikácia rozmetadlom 200–400 Kč/ha. Celková investícia 4 000–12 000 Kč/ha pri bežnej dávke.\n\nKedy vápniť:\n- **Pôdny rozbor 1× za 4 roky** ukáže aktuálne pH a saturáciu Ca.\n- **pH pod 5,5** → vápniť cca 4 t/ha vápenca + opakovať po 2 rokoch.\n- **pH 5,5–6,0** → 2 t/ha ako prevencia každých 4–6 rokov.\n- **pH nad 6,5** → nevápniť (zbytočné, riziko alkality).\n\nROI: zvýšenie pH o 0,5 jednotky zvyčajne vedie k +5–15 % výnosu cereálií dlhodobo. Návratnosť 2–4 sezóny.",
    "related": [
      "pH-pudy",
      "organicka-hmota"
    ]
  },
  {
    "slug": "pluh",
    "term": "Pluh (typy a parametre)",
    "alias": [
      "plough",
      "orbní pluh"
    ],
    "kategorie": "technologie",
    "shortDef": "Pluh je náradie na hlbokú orbu — obracia 20–35 cm vrstvu ornice. Existuje nesený, polonesený a otočný (reverz) typ s 2–12 radlicami.",
    "longDef": "Pluh je najstaršie orné náradie — obracia pôdu pomocou radlic. V SR štandardné zariadenie pre jesenné spracovanie poľa.\n\n**Typy podľa závesu**:\n- **Nesený pluh** — celý nesie trojbod traktora. Ľahší (do 4–5 radlic). Pre 80–150 koní traktor.\n- **Polonesený** (semi-mounted) — zadná časť pluhu opiera o vlastné kolesá. 5–8 radlic. Pre 130–200 koní.\n- **Tažený** (trailed) — celý pluh na vlastných kolesách, trojbod len ťahá. 8–12 radlic. Pre 200+ koní.\n\n**Typy podľa smeru orby**:\n- **Klasický (jednosmerný)** — orá len jedným smerom. Vyžaduje \"medzerovú orbu\" → nepravidelný povrch.\n- **Otočný pluh (reverz)** — radlice sa otáčajú o 180°, orá oboma smermi. Hladký povrch bez medzier. Dnes štandardom (95 % nových pluhov).\n- **Variopluh** — variabilný záber radlic za jazdy (40–60 cm na radlicu). Užitečné pri opravách ciest alebo úzkych záhonoch.\n\n**Kľúčové parametre**:\n- **Počet radlic** — 3 (ľahký), 4–5 (stredný), 6–8 (ťažký), 8–12 (extra ťažký).\n- **Záber na radlicu** — 35, 40, 45, 50 cm. Celkový záber = počet × na radlicu.\n- **Hĺbka orby** — 20–35 cm regulovaná hydraulicky alebo mechanicky.\n\n**Top značky SR**: Lemken (DE — Diamant, EurOpal), Pöttinger (AT — Servo), Kverneland (NO/IT — LB, ED, PB), Kuhn (FR — Vari-Master), Vogel & Noot (AT — Plus).\n\n**Cenová orientácia** (2026 nový):\n- 3-radlový nesený otočný: 200 000–350 000 Kč.\n- 5-radlový polonesený otočný: 600 000–1 100 000 Kč.\n- 8-radlový tažený otočný + Vario: 1,8–3 mil. Kč.",
    "related": [
      "orba",
      "tribod",
      "no-till"
    ]
  },
  {
    "slug": "kompaktomat",
    "term": "Kompaktomat",
    "alias": [
      "compact disk harrow",
      "kompaktor"
    ],
    "kategorie": "technologie",
    "shortDef": "Kompaktomat je kombinované náradie pre plytké spracovanie pôdy — disky + kolesá + drobiace lišty v jednej jazde. Pripravuje pole na siatie po orbe alebo namiesto orby.",
    "longDef": "Kompaktomat je polonesený stroj kombinujúci vo viacerých radoch: **diskové brány + drobiace lišty + zatláčacie valce** (smyk, kolesá). Cieľ: pripraviť ideálne siatie lôžko v 1 jazde.\n\n**Typický záber**: 3–8 m, podľa traktora 100–250 koní.\n\n**Komponenty (spredu dozadu)**:\n1. **Diskové sekcie** (40–55 cm Ø) — narežú strnisko, predkypia 5–10 cm.\n2. **Šípy / dláta** (voliteľné) — rozrušenie utuženia.\n3. **Pružné kypriace lišty** — drobia hrudy.\n4. **Zatláčací valec** (Crosskill, U-profil, Cambridge) — utlmí povrch, vytvorí kapilárne prepojenie s podorničím.\n\n**Hlavné použitie**:\n- **Predsejbová príprava** — namiesto brán + smyku + valca v 3 samostatných jazdách.\n- **Stubble cultivation** — okamžite po zbere, podmietka strniska.\n- **Pseudoorba** — ako náhrada orby v min-till systémoch.\n\n**Výhody**:\n- 1 jazda namiesto 3–4 = úspora paliva 40–60 % vs konvenčné schéma.\n- Vyšší výkon — 4–8 ha/h vs 1–3 ha/h u jednoduchých nástrojov.\n- Lepšia štruktúra pôdy — menej utuženia od opakovaných prejazdov.\n\n**Top značky**:\n- **Horsch** (Tiger, Joker, Terrano) — DE prémium, no-till friendly.\n- **Lemken** (Karat, Heliodor) — DE univerzálny.\n- **Väderstad** (Carrier, TopDown, Cultus) — SE presnosť.\n- **Köckerling** (Quadro, Allrounder) — DE robustný.\n- **Kuhn** (Performer, Optimer) — FR cena/výkon.\n\n**Cena (2026)**: 4 m = 400 000–800 000 Kč, 6 m = 800 000–1,8 mil. Kč, 8 m = 1,5–3,5 mil. Kč.",
    "related": [
      "orba",
      "no-till",
      "organicka-hmota"
    ]
  },
  {
    "slug": "mulcovac",
    "term": "Mulčovač",
    "alias": [
      "mulcher",
      "mulcher rotačný"
    ],
    "kategorie": "technologie",
    "shortDef": "Mulčovač je rotačný drvič rastlinnej hmoty — strniská, pozberové zvyšky, tráva, slabé kríky. Pripojený na PTO traktora cez trojbod.",
    "longDef": "Mulčovač drví rastlinnú hmotu na veľmi drobné kúsky pomocou rotujúcich kladívok alebo nožov na vertikálnom alebo horizontálnom rotore.\n\n**Dva hlavné typy**:\n- **Rotor horizontálny (os kolmo na jazdu)** — klasický pre plošné mulčovanie trávy a strniska. Najčastejší.\n- **Rotor vertikálny (os zvisle)** — pre lesné pasečné práce, hustejšiu vegetáciu.\n\n**Šírka záberu**:\n- **1,2–2 m** — pre sady, vinohrady, komunálne.\n- **2,5–4 m** — pre pole (strniská, kŕmne plodiny).\n- **4–8 m** — veľkofarmy, zberové podniky.\n\n**Použitie**:\n- **Mulčovanie strniska** po zbere obilia — zvyšné steblá podrcené, urýchľuje rozklad.\n- **Údržba TTP** — 1–2× ročne mulčovanie pastvin.\n- **Mulčovanie medziplodín** pred zaoraním.\n- **Sady a vinohrady** — mulčovanie trávy v medziradoch.\n- **Likvidácia zvyškov kukuričných stoniek** — proti zavíjaču.\n\n**Pohon**: PTO 540 alebo 1000 ot/min. Príkon obvykle 50–150 koní podľa záberu.\n\n**Top značky**:\n- **Berti** (IT) — prémium, široká škála.\n- **Kuhn** (BPR, BC) — FR univerzál.\n- **Krone** (BiG M, EasyCut) — DE pre výkonné aplikácie.\n- **Maschio Gaspardo** (IT) — cenovo dostupné.\n\n**Cena (2026)**: 1,8 m hobby = 50 000–80 000 Kč, 2,5 m stredná = 120 000–250 000 Kč, 4 m profi = 300 000–600 000 Kč.",
    "related": [
      "pto",
      "tribod",
      "orba"
    ]
  },
  {
    "slug": "naves-sklapeci",
    "term": "Náves sklápač (trojstranný)",
    "alias": [
      "tipper",
      "sklápač"
    ],
    "kategorie": "technologie",
    "shortDef": "Sklápač (trojstranný) je transportný voz s hydraulickým sklápaním na 3 strany. Kľúčový pre zberové linky, transport úrody a hnojív.",
    "longDef": "Sklápač je dominantná transportná jednotka v poľnohospodárstve. **Trojstranný** = môže skloniť dozadu aj na obe bočné strany (3-way tipper).\n\n**Nosnosť**:\n- **Ľahký 8 t** — pre malé farmy, traktor 80+ koní.\n- **Štandard 12–16 t** — pre stredné farmy, traktor 130+ koní.\n- **Veľký 18–24 t** — pre veľkofarmy, traktor 180+ koní. Tandem alebo tridem nápravy.\n- **Extra 28+ t** — zberové podniky, vlastný motorový pohon.\n\n**Konštrukcia**:\n- **Korba** oceľová alebo hliníková (ľahšia, 200 kg úspora hmotnosti).\n- **Nápravy** — single (do 12 t), tandem (12–20 t), tridem (20+ t).\n- **Brzdy** vzduchové štandard od 10 t (povinné v EÚ).\n- **Hydraulika** — sklápanie + bočnice + zadná klapka.\n\n**Sklápacie systémy**:\n- **Teleskopický hydraulický valec** — štandard, 2–4stupňový valec.\n- **Front-tipping** — sklápa iba dozadu, lacnejší.\n- **3-way tipping** — výnimočne aj na strany (užitočné pri vykládke do silážnych veží alebo v úzkych priestoroch).\n\n**Použitie**:\n- **Žatva** — odvoz obilia od kombajnu.\n- **Zber krmovín** — siláž z kukurice / tráv.\n- **Transport hnojív, vápenca** — od stanice na pole.\n- **Komunál** — odvoz výkopkov, drvenej sutiny.\n\n**Top značky**:\n- **Joskin** (BE) — Trans-Cap, KTP. Prémium.\n- **Strom** (CZ) — Vario, Master. Domáca kvalita.\n- **Bednar** (CZ) — Atlas. Cenovo atraktívny.\n- **Conow** (DE) — TMH séria.\n- **Krampe** (DE) — Bandit, BIG body.\n\n**Cena (2026)**: 12 t single = 350 000–600 000 Kč, 18 t tandem = 700 000–1,5 mil. Kč, 24 t tridem = 1,5–3 mil. Kč.",
    "related": [
      "pto",
      "tribod"
    ]
  },
  {
    "slug": "kukurice-silazni",
    "term": "Kukurica silážna",
    "alias": [
      "silážna kukurica",
      "krmná kukurica"
    ],
    "kategorie": "plodiny",
    "shortDef": "Silážna kukurica sa pestuje na celé rastliny (klasy + stonky + listy), zbiera sa nezrelá a fermentuje na siláž — hlavné krmivo pre dobytok na Slovensku.",
    "longDef": "Silážna kukurica je odrodový typ kukurice pestovaný pre **celorastlinnú zber** (na rozdiel od zrnovej kukurice, ktorá sa zbiera len na klasy). Hlavné krmivo pre dobytok na Slovensku — v dojnici tvorí 30–60 % objemu krmnej dávky.\n\n**Pestovanie**:\n- **Sezóna**: koniec apríla – polovica mája (po Ľadových mužoch, pôda 10 °C).\n- **Osivo**: 80 000–110 000 zŕn/ha = 22–28 kg/ha.\n- **Hnojenie**: 150–200 kg N/ha, plus P, K základné hnojenie na jeseň.\n- **Postrek**: pre-em na klíčiace buriny (Lumax, Successor) + post-em na druhú vlnu (Callisto, Laudis).\n- **Zber**: koniec augusta – október, vlhkosť celej rastliny 30–35 % (optimum pre silážovanie).\n\n**Výnosy**:\n- **Zelená hmota**: 30–60 t/ha (priemer Slovenska 45 t/ha).\n- **Sušina**: 10–18 t/ha (silážna).\n- **Energia**: 5–8 GJ/ha NEL (čistá energia laktácie).\n\n**Zber**:\n- **Zberová rezačka** (Claas Jaguar, JD 9000, NH FR) — reže, drtí zrno (cracking), fúka do návesu.\n- **Dĺžka rezky**: 8–22 mm podľa obsahu sušiny a typu silážnej jamy.\n- **Cena zberovej služby**: 2 000–4 000 Kč/ha + návesy 800–1 200 Kč/h.\n\n**Silážovanie**:\n- **Silážna jama** sa naplní + utlačuje pásovým traktorem.\n- **Zakrytie** plastovou fóliou + zaťaženie (pneumatiky / vrecia piesku).\n- **Fermentácia** 4–6 týždňov → ideálne krmivo.\n\n**Top SK regióny**: južná Morava, Polabská nížina, dolné Posázaví. V severných horských oblastiach je sezóna kratšia a výnosy nižšie.",
    "related": [
      "osevni-postup",
      "orba"
    ]
  },
  {
    "slug": "repka-ozima",
    "term": "Repka ozimná",
    "alias": [
      "oilseed rape",
      "canola"
    ],
    "kategorie": "plodiny",
    "shortDef": "Repka ozimná je strategická CZ olejnina — pestuje sa na 380–420 tisícoch ha (12 % ornej pôdy). Výnos 3,5–4,5 t/ha, hlavne pre biopalivový a potravinársky olej.",
    "longDef": "Repka ozimná (Brassica napus) je najvýznamnejšia olejnina v ČR. Pestuje sa na **380–420 tis. ha** = 12 % ornej pôdy (po pšenici druhá najrozšírenejšia plodina).\n\n**Pestovanie**:\n- **Sejba**: 15. augusta – 5. septembra (presne, kratšie okno → menší výnos).\n- **Osivo**: 2–4 kg/ha (hybridy) alebo 5–8 kg/ha (linie). 35–50 zŕn/m².\n- **Hnojenie**: P + K na jeseň (200 kg superfosfátu, 150 kg draselnej soli). Jar 150–200 kg N v 2 dávkach (regenerácia + butonizácia).\n- **Postrek**: insekticídy proti skočkám (jeseň), choroby (jarné fungicídy proti hlízenke, fómovej hnilobe), regulátory rastu.\n- **Zber**: koniec júna – polovica júla. Kombajn s repkovým žacím stolom (Vario lišta).\n\n**Výnosy** (priemer ČR 2024):\n- **3,5 t/ha** bežné priemerné podmienky.\n- **4,0–4,5 t/ha** dobré roky + premium hybrid.\n- **5+ t/ha** špička (vrcholoví farmári).\n\n**Cenovka** (2024–2026):\n- **Realizačná cena** 11 000–14 000 Kč/t.\n- **Tržba**: 4 t × 12 500 = 50 000 Kč/ha.\n- **Náklady**: ~25 000 Kč/ha (osivo 4 000 + hnojivá 8 000 + postreky 6 000 + mech. 7 000).\n- **Marža**: 20 000–30 000 Kč/ha = veľmi atraktívna vs obilniny.\n\n**VCS dotácie**: NIE JE (repka je v EÚ dlhodobo konkurenčne silná).\n\n**Trh**:\n- **Vykupujú**: Komodita Praha, Granaria, Glencore, Agrofert.\n- **Použitie**: 70 % biopalivá (FAME), 20 % potravinársky olej, 10 % krmivá (repkové šroty).\n- **Konkurencia**: import slnečnicový olej (UA, RU), palmový olej (Indonézia).\n\n**Riziko**: hubenie populácií včiel kvôli neonikotinoidom (od 2018 EÚ zákaz aplikácie na repku). Súčasné insekticídy majú nižšiu účinnosť → vyššie riziko poškodenia skočkami.",
    "related": [
      "osevni-postup",
      "ozim-jarin",
      "orba"
    ]
  },
  {
    "slug": "sojaova-bob",
    "term": "Sója luštinatá",
    "alias": [
      "sója",
      "soja",
      "soybean"
    ],
    "kategorie": "plodiny",
    "shortDef": "Sója je najvýznamnejšia luskovina sveta, na Slovensku menšinová plodina (15–25 tisíc ha) ale rastúca. Bohatá na bielkoviny (40 %), viaže atmosférický N.",
    "longDef": "Sója luštinatá (Glycine max) je najvýznamnejšia olejnatá luskovina na svete. Na Slovensku rastúca plodina (z 5 000 ha v 2010 na ~20 000 ha v 2024), podporovaná VCS dotáciou 2 800 Kč/ha.\n\n**Pestovanie**:\n- **Sezóna**: koniec apríla – začiatok mája, pôda min. 8 °C.\n- **Osivo**: 110–130 kg/ha. Hladké semienko, vyžaduje presné sekanie pneumatickým strojom.\n- **Inokulácia**: nevyhnutná! Sójové semená obarviť Rhizobium japonicum baktériami pre viazanie N. Bez inokulácie = sója si nedokáže vyrobiť N a výnos klesne o 30–50 %.\n- **Hnojenie**: len P + K (sója si vyrobí N sama). Žiadne dusíkaté hnojivo!\n- **Postrek**: pre-em (Pulsar), post-em (Pulsar Plus). Insekticídy len výnimočne.\n- **Zber**: koniec septembra – polovica októbra. Štandardný kombajn s repkovým / sójovým flexihederom.\n\n**Výnosy** (priemer SK 2024):\n- **2,5–3,2 t/ha** bežné.\n- **3,5+ t/ha** dobré roky + zavlažovanie.\n\n**Vlastnosti zrna**:\n- **40 % bielkoviny** (vs pšenica 12 %) — najbohatší rastlinný zdroj.\n- **20 % oleja** — sójový olej pre potraviny aj biopalivá.\n- **Cenovka** (2024): 12 000–16 000 Kč/t.\n\n**Ekonomika** (3 t/ha × 14 000 = 42 000 Kč tržba + 2 800 Kč VCS):\n- Tržba ~44 800 Kč/ha.\n- Náklady ~22 000 Kč/ha (osivo + inokulácia + hnojivá + postreky + mech).\n- **Marža ~22 000 Kč/ha** = porovnateľné s repkou, ale nižšie riziko.\n\n**Prečo na Slovensku rastú plochy**:\n- **EÚ snaha o nezávislosť na importe sóje** z Brazílie/Argentíny (kde sa odlesňuje pre pestovanie).\n- **VCS bonus 2 800 Kč/ha** = +30 % výnos.\n- **Viazanie N** zlepšuje štruktúru pôdy pre následnú plodinu.\n- **Trhová cena** rastúca kvôli krmnému priemyslu (sójový šrot pre prasatá, hydinu).\n\n**Riziká**:\n- **Sucho v auguste** (kvetenie) = výrazný pokles výnosu.\n- **Choroby** Sclerotinia (hlízenka) — limit pre región.\n- **Holuby** radi sklízejú na poli (riziko 5–10 % straty).",
    "related": [
      "osevni-postup",
      "cap-2024"
    ]
  },
  {
    "slug": "vojteska",
    "term": "Lucerna siata",
    "alias": [
      "Medicago sativa",
      "alfalfa",
      "lucerne"
    ],
    "kategorie": "plodiny",
    "shortDef": "Lucerna je viacročná krmovina (3–5 rokov na 1 pozemku) bohatá na bielkoviny. Zbiera sa 3–4× ročne, viaže N, zlepšuje štruktúru pôdy.",
    "longDef": "Lucerna siata (Medicago sativa) je najlepšia krmovinová luskovina v miernom podnebí. **Viacročná** plodina — sadí sa na 3–5 rokov, zbiera sa 3–4× za sezónu (3 v CZ, 4 v južnom Taliansku).\n\n**Pestovanie**:\n- **Sejba**: jar (marec–apríl) ako \"podsev\" pod obilniny (raž, jačmeň) alebo čistý porast.\n- **Osivo**: 15–25 kg/ha. Inokulácia Sinorhizobium meliloti nutná.\n- **Hnojenie**: len P + K na jeseň (200 kg superfosfátu, 100 kg KCl). Žiadny N (vlastná fixácia 200–300 kg N/ha/rok).\n- **Žiadny postrek** na samotnú lucernu (silne konkurenčné buriny potlačí).\n\n**Zber** (3× za sezónu v CZ):\n- **1. kosba**: polovica mája (50 % kvetu — najvyšší obsah bielkovín).\n- **2. kosba**: koniec júna.\n- **3. kosba**: koniec augusta.\n- Prípadne **4. kosba** v septembri (nízky výnos, len pre silný porast).\n\n**Výnos** (3-ročný priemer):\n- **8–12 t sušiny/ha/rok** celkom (rozdelené do 3–4 kosieb).\n- **Cca 25 % bielkovín** v sušine.\n\n**Použitie**:\n- **Senáž / siláž** pre dobytok — balíky lucerny.\n- **Seno** klasické (prírodné sušenie).\n- **Zelená krmovina** pre pastvy alebo priamu aplikáciu do žľabu.\n- **Granulát** pre priemyselné krmivá (sušiarenský granulát).\n\n**Prínos do osevného postupu**:\n- **Väzba N** 200–300 kg/ha/rok — zásadný bonus pre následnú plodinu.\n- **Hlboký koreň** (až 3 m) — narušuje utuženie podorničia, dostáva živiny z hĺbky.\n- **Zlepšuje štruktúru pôdy** — lucerna za 3 roky obnoví humus.\n- **Po lucerne** typicky pestuje pšenica ozimná (vysoký výnos vďaka N + štruktúre).\n\n**Trh**:\n- **Cenovka senáž v balíkoch**: 1 800–3 000 Kč/t (regionálne).\n- **Cenovka granulát**: 4 000–6 000 Kč/t.\n- **CAP**: lucerna kvalifikuje na EKO režim (zelená plocha) + AEKO trávne porasty.\n\n**Dôležité odrody**: Verdor (FR), Power (US), Niagara (FR), domáca Kometa (CZ).",
    "related": [
      "osevni-postup",
      "organicka-hmota",
      "mezi-plodiny"
    ]
  },
  {
    "slug": "telematika",
    "term": "Telematika",
    "alias": [
      "JDLink",
      "AFS Connect",
      "MyPLM",
      "PLM Connect",
      "fleet management"
    ],
    "kategorie": "precise-farming",
    "shortDef": "Telematika je systém vzdialeného sledovania stroja cez mobilnú sieť — sleduje pozíciu, motohodiny, spotrebu, chyby. Štandard u prémiových traktorov od 2010.",
    "longDef": "Telematika v poľnohospodárstve je obdoba GPS trackera v osobných autách, ale rozšírená o **technické dáta stroja** (CAN-bus). Stroj odosiela dáta do cloudovej platformy cez mobilnú sieť (LTE), kde majiteľ / dealer vidí real-time stav.\n\n**Hlavné platformy** (per značka):\n- **John Deere Operations Center** (Ops Center) + JDLink — najrozsiahlejšie. Sleduje 100+ parametrov, agronomické mapy, prediktívnu údržbu.\n- **Case IH AFS Connect** + Trimble Display — spoločná s NH.\n- **New Holland PLM Connect** — zberné mapy, GPS prefix.\n- **Fendt Connect** + FendtONE — bezdrôtové aktualizácie, telemetria.\n- **Claas TELEMATICS** — zberné analytiky.\n- **AGCO Fuse** (Massey, Valtra, Fendt) — zjednotená platforma.\n- **Trimble Connected Farm** — multi-brand pre staršie stroje.\n\n**Čo sleduje**:\n- **GPS pozícia** v real-time, história trás.\n- **Motohodiny** + uptime / downtime.\n- **Spotreba paliva** per hektár / per hodinu.\n- **Otáčky motora, prevodovka, výkon, záťaž**.\n- **Chybové kódy** — okamžitá notifikácia SMS / email.\n- **Zberné mapy** (kombajny) — výnos per GPS bod.\n- **AdBlue, DPF stav** — varovanie pred regeneráciou / doplnením.\n- **Vstup do \"geofence\"** — alarm pri výjazde z farmy / krádeži.\n\n**Cenová politika** (2026):\n- **JD Operations Center**: zadarmo pre majiteľov JD stroja (3-ročná subskripcia pri nákupe).\n- **Fendt Connect**: zadarmo 5 rokov, potom 800–1 500 Kč/rok.\n- **AGCO Fuse**: variabilné podľa balíčka.\n- **Trimble Connected Farm**: 5 000–15 000 Kč/rok per stroj.\n\n**Pre SK farmárov**:\n- **U malých fariem** často nevyužité — paperwork v Exceli funguje.\n- **U fariem 200+ ha** s 3+ strojmi už dáva zmysel — flota management, prediktívna údržba.\n- **Zberné podniky** štandardne využívajú pre per-zákazník účtovanie motohodín a zberaných ha.\n\n**Súkromie / vlastníctvo dát**: kontroverzia — kto vlastní agronomické dáta? V EÚ GDPR rieši PII, ale produkčné dáta má zmluvne prístup výrobca (využíva pre vývoj). Niektorí farmári tlačia na \"Farm Data Privacy\" iniciatívy.",
    "related": [
      "isobus",
      "gps-rtk",
      "yield-monitor"
    ]
  },
  {
    "slug": "autonomni-traktor",
    "term": "Autonomný traktor",
    "alias": [
      "autonomous tractor",
      "driverless"
    ],
    "kategorie": "precise-farming",
    "shortDef": "Autonomný traktor jazdí po poli bez vodiča — kombinuje RTK GPS + LiDAR + kamery + AI. Demonštrované 2022+ (JD 8R Autonomous), komerčne dostupné pomaly.",
    "longDef": "Autonomný traktor je ďalšia úroveň presného poľnohospodárstva — stroj jazdí po poli **úplne bez vodiča v kabíne**. Kombinácia technológií:\n\n- **RTK GPS** (centimetrová presnosť trasy).\n- **LiDAR** (3D mapovanie okolia, detekcia prekážok).\n- **Multispektrálne kamery** (rozpoznávanie plodiny vs buriny).\n- **AI** (rozhodovanie v reálnom čase).\n- **5G konektivita** (vzdialené ovládanie + dohľad).\n\n**Súčasné komerčné ukážky**:\n- **John Deere 8R Autonomous** (CES 2022): plne autonómny traktor s 6 kamerami a NVIDIA Jetson AI. K dispozícii 2023+ na vybraných trhoch v USA. Cena ~$800 000 ($300K príplatok nad štandardný 8R).\n- **Case IH Autonomous Concept** (2016): koncept bez kabíny vôbec. Nedošlo na komerciu.\n- **AGCO Fendt MARS** (2019): roj malých autonómnych robotov namiesto jedného veľkého. Stále výskum.\n- **Bear Flag Robotics** (Trimble dcérska spoločnosť, 2021 akvizícia JD): retrofit autonómneho systému na existujúce traktory.\n- **Monarch Tractor** (US startup, 2020+): autonómny elektrický traktor 70 koní pre vinohrady. Cena $58 000.\n\n**Stav na Slovensku (2026)**:\n- **Žiadny autonómny traktor reálne v prevádzke**.\n- **Dielčie autonómne funkcie** (auto-steering, section control, automatické headland turning) sú štandardom u prémiových traktorov.\n- **Regulácia** pre autonómne stroje na poli zatiaľ nie je (na ceste by bol problém s vodičským preukazom).\n\n**Bariéry komerčného nasadenia**:\n- **Cena** — premium $300 000 nad bežný traktor je pre 99 % farmárov nedosiahnuteľná.\n- **Bezpečnosť** — pole nie sú izolovaný kontrolovaný priestor ako továreň. Riziko zrazenia človeka / zvieraťa.\n- **Regulácia** — EÚ doteraz nedefinovala jasné pravidlá pre autonómne poľné stroje.\n- **ROI** — vodič stojí 30 000–50 000 Kč/mesiac, autonómny stroj sa vyplatí len u veľkofarmy s 24/7 prevádzkou.\n\n**Realistická časová os**:\n- **2025–2030**: autonómia pre úzke úlohy (postrek, kosenie) pre veľkofarmu.\n- **2030+**: rozšírenie pre SK stredné farmy, cenová dostupnosť.\n- **2035+**: štandard.\n\n**Aktuálne odporúčame** pre SK farmárov využiť **semi-autonómne funkcie** (auto-steering, ISOBUS, telematika) — 80 % benefitu za 20 % ceny.",
    "related": [
      "auto-steering",
      "gps-rtk",
      "telematika",
      "isobus"
    ]
  },
  {
    "slug": "drony-zemedelstvi",
    "term": "Drony v poľnohospodárstve",
    "alias": [
      "UAV",
      "poľnohospodársky dron",
      "precízny dron"
    ],
    "kategorie": "precise-farming",
    "shortDef": "Drony v poľnohospodárstve slúžia na: monitoring (multispektrálne NDVI snímky), aplikáciu (postrek, výsev meziplodín), kontrolu (krádeže, povodne). Štandard pre precíznych farmárov.",
    "longDef": "Drony (UAV — Unmanned Aerial Vehicles) v poľnohospodárstve plnia 3 hlavné úlohy:\n\n### 1. Monitoring (najčastejšie)\n- **Multispektrálne snímkovanie** — RGB + NIR kamera, výpočet NDVI / EVI indexov biomasy.\n- **3D mapovanie** — výška rastlín, deformácie polí.\n- **Letové výšky** 50–120 m, pokrytie 50–200 ha za hodinu.\n- **Modely dronov**: DJI Phantom 4 Multispectral (6 000 USD), DJI Mavic 3 Multispectral (5 500 USD), Parrot Anafi USA (7 000 USD), eBee X (25 000+ profesionál).\n\n### 2. Aplikácia (postrek / výsev) — rastúca\n- **Postrekovacie drony** — Yamaha RMAX (JP), DJI Agras T40/T50, EAVision EA-30X.\n- **Užitočné zaťaženie**: 30–40 l postreku, záber 8–11 m.\n- **Výkon**: 4–10 ha/h.\n- **Cena**: 15 000–50 000 USD dron + 5 000–15 000 USD batérie + softvér.\n- **Na Slovensku**: zatiaľ **málo nasadené** — regulácia SUR (Sustainable Use Regulation EU) komplikuje letecké postrekovanie (potreba špeciálneho povolenia).\n\n### 3. Kontrola a bezpečnosť\n- **Patrolovacie drony** — kontrola plotov, krádeží.\n- **Tepelné kamery** — detekcia zvierat pred kosením (chráni srnčatá).\n- **Povodňové mapovanie** — DJI Mavic s termálnou kamerou.\n\n### Regulácia na Slovensku (EASA + ÚCL):\n- **Otvorená kategória** (A1/A2/A3) pre drony pod 25 kg za vizuálny dohľad.\n- **Špecifická kategória** pre letecké aplikácie postreku — vyžaduje OSO (Operations Specific Operations) povolenie od Úradu civilného letectva.\n- **Pilotný certifikát** A1/A3 zdarma online, A2 za 800 Kč.\n- **Registrácia operátora** povinná (€19/rok).\n\n### Pre slovenských farmárov (2026):\n- **Monitoring** — DJI Mavic 3 Multispectral je sweet spot pre 100–500 ha farmy. ROI 1–2 sezóny vďaka úspore hnojív (variabilné dávkovanie).\n- **Aplikácia** — zatiaľ **drahé a regulačne náročné**. Klasický postrekovač s GPS + Section Control vychádza lepšie.\n- **Tepelné kamery** — pre veľké TTP s vysokou pravdepodobnosťou srnčiat, ekonomicky náročné.",
    "related": [
      "ndvi",
      "variable-rate",
      "section-control"
    ]
  },
  {
    "slug": "sp-szp-2023-2027",
    "term": "SP SZP 2023–2027 (Strategický plán)",
    "alias": [
      "Strategický plán SZP",
      "Common Agricultural Policy Strategic Plan"
    ],
    "kategorie": "dotace",
    "shortDef": "Strategický plán SPP 2023–2027 je národná implementácia Spoločnej poľnohospodárskej politiky EÚ pre Slovensko. Definuje všetky podporné tituly (priame platby, agroenvironmentálne opatrenia, investície) a administruje ho Pôdohospodárska platobná agentúra (PPA).",
    "longDef": "Strategický plán Spoločnej poľnohospodárskej politiky (SP SPP) je záväzný dokument schválený Európskou komisiou pre každý členský štát zvlášť na obdobie 2023–2027. Pre Slovensko ho pripravilo Ministerstvo pôdohospodárstva a rozvoja vidieka SR a administruje Pôdohospodárska platobná agentúra (PPA).\n\n**Štruktúra plánu**:\n\n### Pilier I — priame platby:\n- **Základná podpora príjmu (BISS)** na hektár\n- **Redistributívna platba (CRISS)** zvýhodňujúca menšie výmery\n- **Ekoschémy** — dobrovoľné režimy pre klímu a životné prostredie\n- **ANC** — platba pre oblasti s prírodnými obmedzeniami\n- **Podpora pre mladých poľnohospodárov**\n- **Viazané platby (VCS)** pre citlivé sektory\n\n### Pilier II — rozvoj vidieka:\n- **Agroenvironmentálno-klimatické opatrenia** (viacročné záväzky)\n- **Investičné intervencie** (technika, stavby, technológie)\n- **Ekologické poľnohospodárstvo**\n- **Welfare zvierat**\n- **Podpora poistenia produkcie**\n\n‼️ **Sadzby na hektár sa medzi členskými štátmi líšia** a vyhlasujú sa pre každý rok zvlášť — na Slovensku v eurách. Aktuálne sadzby, stropy a termíny zverejňuje PPA; české sadzby prevzaté z materiálov SZIF pre Slovensko neplatia.\n\n**Dokumentácia pre žiadateľov**:\n- **Hlavný dokument**: Strategický plán SPP SR na stránkach MPRV SR (mpsr.sk)\n- **Príručky a výzvy**: PPA (apa.sk) — pre každý titul zvlášť, verzia sa mení\n- **Portál farmára** — elektronické podanie žiadostí\n\n**Priebeh roka**:\n- **Jednotná žiadosť** (jarný termín) pokrýva väčšinu priamych platieb\n- **Investičné výzvy** majú vlastné kolá vyhlasované PPA\n- **Viacročné záväzky** sa uzatvárajú na niekoľko rokov — vstup je dlhodobé rozhodnutie\n\n**Kontroly**: PPA overuje žiadosti administratívne, kontrolou na mieste a plošným satelitným monitoringom plôch (systém AMS nad dátami Copernicus/Sentinel).",
    "related": [
      "cap-2024",
      "biss",
      "aeko",
      "jednotna-zadost"
    ]
  },
  {
    "slug": "intervence-33-73",
    "term": "Investičné intervencie SP SPP (technika a stavby)",
    "alias": [
      "Investície do poľnohospodárstva",
      "PRV investície",
      "I.33.73"
    ],
    "kategorie": "dotace",
    "shortDef": "Investičná podpora Strategického plánu SPP na nákup techniky, stavby a technológie. Na Slovensku ju vyhlasuje a administruje PPA vlastnými výzvami; miera podpory, stropy aj bodovanie sa určujú v podmienkach konkrétnej výzvy.",
    "longDef": "Investičné intervencie sú hlavným nástrojom Strategického plánu SPP na modernizáciu poľnohospodárskych podnikov. Typicky kryjú:\n\n**Oprávnené výdavky**:\n- **Stroje a technika** — traktory, kombajny, sejačky, postrekovače, lisy, manipulátory.\n- **Stavby pre živočíšnu výrobu** — maštale, dojárne.\n- **Stavby pre skladovanie** — silá, šrotovne, chladiarne.\n- **Technológie precízneho poľnohospodárstva** — GPS, ISOBUS, variabilné dávkovanie.\n- **Závlahy** — investície do zavlažovacích systémov.\n\n**Miera podpory** sa odvíja od typu výroby a žiadateľa; bonusy sa spravidla poskytujú mladým poľnohospodárom a pre oblasti s prírodnými obmedzeniami. Presné percentá, stropy na projekt aj na žiadateľa a prípadné obmedzenie podielu mobilných strojov určujú **podmienky konkrétnej výzvy PPA** — nie sú to trvalé hodnoty a medzi kolami sa menia.\n\n**Postup žiadosti**:\n1. **Príprava projektu** — návrh, podnikateľský plán, ekonomické vyhodnotenie.\n2. **Vyhlásenie výzvy** — PPA zverejní podmienky a termín príjmu.\n3. **Podanie** cez Portál farmára v stanovenom okne.\n4. **Hodnotenie** — administratívna kontrola a bodovanie projektu.\n5. **Rozhodnutie** o schválení.\n6. **Realizácia** — nákup techniky alebo stavba podľa projektu.\n7. **Žiadosť o platbu** — preplatenie po preukázaní investície.\n\n**Praktické upozornenia**:\n- **Časovanie**: techniku kupujte až **po schválení**, nie pred ním — skorší výdavok býva neoprávnený.\n- **Dokumentácia**: faktúry, zmluvy, doklady o úhrade, fotodokumentácia priebehu.\n- **Riziko**: nesplnenie podmienok (napríklad minimálna doba prevádzkovania stroja) znamená **vrátenie podpory**, spravidla s úrokom.\n\n‼️ Označenie **33.73** je kód českej intervencie v Strategickom pláne ČR, ktorý administruje SZIF. Na Slovensku majú výzvy vlastné číslovanie a vlastné podmienky — pri čítaní českých zdrojov je nutné s týmto rozdielom počítať.",
    "related": [
      "sp-szp-2023-2027",
      "cap-2024",
      "aeko"
    ]
  },
  {
    "slug": "agrarni-komora",
    "term": "Agrárna komora ČR (AK ČR)",
    "alias": [
      "AKČR",
      "agrárna komora"
    ],
    "kategorie": "regulace",
    "shortDef": "AK ČR je hlavná záujmová organizácia poľnohospodárov, lesníkov a potravinárov v ČR — združuje cca 5 000 členov, lobuje za záujmy odvetvia u vlády a EÚ.",
    "longDef": "Agrárna komora ČR (AK ČR) je najväčšia záujmová organizácia poľnohospodárov, potravinárov, lesníkov a vinárov v ČR. Založená 1993 zákonom č. 301/1992 Zb.\n\n**Členská základňa**: cca **5 000 fyzických a právnických osôb** naprieč odbormi.\n\n**Hlavné úlohy**:\n- **Lobbying** u Ministerstva poľnohospodárstva, vlády a europoslancov — záujmy CZ poľnohospodárstva v EÚ CAP, výnimky pre CZ špecifiká.\n- **Pripomienkové miesto** v legislatívnom procese — všetky zákony týkajúce sa poľnohospodárstva prechádzajú AK ČR.\n- **Zastupovanie** v COPA-COGECA (európsky poľnohospodársky lobby v Bruseli).\n- **Poradenstvo** členom — daňové, dotačné, právne.\n- **Vzdelávanie** — semináre, kongresy, výstavy (Země živitelka v ČB).\n- **Certifikácia** — Klasa, Český výrobok, regionálne značky.\n\n**Štruktúra**:\n- **Prezídium** — výkonný orgán, 5-ročný mandát.\n- **Snem** — najvyšší orgán, 1× ročne.\n- **8 sekcií** podľa odboru: rastlinná výroba, živočíšna, lesníctvo, vinárstvo, ovocinárstvo, zeleninárstvo, mliekárenstvo, mäsový priemysel.\n- **14 regionálnych komôr** (per kraj).\n\n**Členský príspevok** (2024):\n- **Fyzická osoba**: 1 200–3 600 Kč/rok podľa veľkosti farmy.\n- **Právnická osoba**: 5 000–50 000 Kč/rok podľa obratu.\n- **Bonus**: členovia dostávajú časopis Zemědělec, právny helpdesk, dotačné poradenstvo.\n\n**Kontroverzie**:\n- **Politická angažovanosť** — historicky úzke väzby na ČSSD, dnes neutrálnejšia.\n- **Konflikt záujmov veľkých vs malých fariem** — AK ČR často kritizovaná za presadzovanie záujmov veľkých agro-holdingov (Agrofert ad.) na úkor rodinných fariem.\n- **Konkurencia**: Asociácia súkromného poľnohospodárstva (ASZ) — alternatíva pre malé farmy.\n\n**Pre CZ farmárov**: členstvo dáva zmysel pre farmy s 100+ ha (využijú dotačné poradenstvo a lobbying). Pre hobby farmy do 10 ha často prínos minimálny.\n\n**Web**: https://www.akcr.cz",
    "related": [
      "sp-szp-2023-2027",
      "cap-2024"
    ]
  },
  {
    "slug": "siloky-balik",
    "term": "Silážny balík",
    "alias": [
      "siláž balíky",
      "baled silage",
      "wrapping"
    ],
    "kategorie": "agrotechnika",
    "shortDef": "Silážny balík je oválny balík zelenej píce (lucerna, ďatelina, trávy) zabalený v plastovej fólii pre fermentáciu. Alternatíva k veľkej silážnej jame pre menšie farmy.",
    "longDef": "Silážny balík je metóda silážovania v kompaktných balíkoch (vs klasická silážna jama). Pre SK farmy do 200 dojníc je často ekonomickejšia než budovanie silážnej jamy.\n\n**Pracovný postup**:\n1. **Kosenie** — žacím strojom s kondicionérom (rolovaním stebiel pre rýchlejšie vysúšanie).\n2. **Sušenie** v riadkoch na poli 6–24 h (na sušinu 30–45 %).\n3. **Obracanie / zhrňovanie** — obracač, zhrňovač pre homogénny riadok.\n4. **Balovanie** — okrúhly lis (round baler) tvorí valcové balíky 1,2 × 1,2 m (cca 600 kg) alebo 1,5 × 1,2 m (800–1000 kg).\n5. **Wrapping** — okamžite po balení (do 2 h) zabaliť do plastovej fólie. Wrapper navíja 4–8 vrstiev (cca 25–35 m fólie per balík).\n6. **Skladovanie** — balíky sťahovať na 1 stranu (ľahšia doprava), kontrola na preliačenie / poškodenie fólie.\n\n**Stroje + cena (2026)**:\n- **Lis okrúhly** (round baler) — 350 000 – 1,5 mil. Kč. Top značky: Krone, John Deere, Massey Ferguson, Vicon, Welger, Kverneland.\n- **Wrapper** — 200 000 – 800 000 Kč. Hi-Spec wrapper / Pöttinger / McHale.\n- **Kombi (lis + wrapper v jednom)** — 800 000 – 2,2 mil. Kč. McHale Fusion, Krone Comprima Wrap, Kuhn iBio.\n\n**Náklady na balík** (orientačne):\n- **Fólia**: 80–120 Kč/balík (6 vrstiev = 30 m × 4 Kč/m).\n- **Práca + traktor**: 100–200 Kč/balík.\n- **Amortizácia strojov**: 50–150 Kč/balík.\n- **Celkovo**: 230–470 Kč/balík = 230–470 Kč/600 kg = **0,40–0,80 Kč/kg sušiny**.\n\nPre porovnanie **silážna jama**: 0,15–0,30 Kč/kg sušiny (lacnejšie), ale jednorazová investícia 1–5 mil. Kč na stavbu.\n\n**Kedy sa oplatia balíky**:\n- **Malá / stredná farma** (do 100 dojníc) — nepotrebuje 2000 t silážnej jamy.\n- **Malé pozemky** s rozdielnymi plodinami — flexibilita.\n- **Bez stálej stavebnej pozemky** — nájomné pole, krátkodobé hospodárenie.\n- **Kŕmenie mimo farmu** — predaj balíkov susedným chovateľom.\n\n**Top značky pre lisy**: McHale (IE), Krone Comprima (DE), JD 870 (US), MF RB 4180 (US), Kuhn FB 3140 (FR).",
    "related": [
      "osevni-postup",
      "vojteska"
    ]
  },
  {
    "slug": "dojirna",
    "term": "Dojáreň (typy)",
    "alias": [
      "milking parlor",
      "milkroom"
    ],
    "kategorie": "technologie",
    "shortDef": "Dojáreň je technológia pre dojenie skotu — od rybej kosti cez paralel po robot. Voľba ovplyvňuje pracovný výkon, welfare a investičné náklady.",
    "longDef": "Dojáreň je technologický komplex pre dojenie dojníc. Na Slovensku dominantná u stajní 50+ dojníc.\n\n**Hlavné typy**:\n\n### 1. Rybia kost (Fishbone)\n- **Pozícia kráv**: pod uhlom 30° k pracovnej jamke.\n- **Veľkosť**: 2×4 až 2×12 stání.\n- **Výkon**: 60–80 kráv/hod.\n- **Pre stádo**: 50–200 dojníc.\n- **Cena**: 500 000 – 2 mil. Kč.\n- **Plus**: jednoduchá, overená, lacná.\n- **Mínus**: pomalá vs novšie systémy.\n\n### 2. Paralel (Parallel)\n- **Pozícia kráv**: kolmo k pracovnej jamke, dojič za zadkom.\n- **Veľkosť**: 2×8 až 2×24.\n- **Výkon**: 100–140 kráv/hod.\n- **Pre stádo**: 100–500 dojníc.\n- **Cena**: 1,5–6 mil. Kč.\n- **Plus**: kompaktná (užšia než fishbone), vyšší výkon.\n- **Mínus**: dojič nemá výhľad na vemena prednej rady.\n\n### 3. Karusel (Rotary)\n- **Pozícia kráv**: na rotujúcej plošine.\n- **Veľkosť**: 24–80 stání.\n- **Výkon**: 150–300 kráv/hod.\n- **Pre stádo**: 300+ dojníc.\n- **Cena**: 5–25 mil. Kč.\n- **Plus**: extrémny výkon, kontinuálny tok kráv.\n- **Mínus**: extrémna investícia, vyžaduje 24/7 prevádzku pre návratnosť.\n\n### 4. Robot (AMS — Automatic Milking System)\n- **Pozícia**: kravy si prichádzajú samy 2–3× za deň.\n- **Výkon**: 60–80 dojníc na robot (jednotka).\n- **Pre stádo**: 60+ dojníc na robot, modulárne.\n- **Cena**: 4–6 mil. Kč na robot + 1–2 mil. Kč inštalácia.\n- **Plus**: automatizácia 24/7, žiadny dojič, welfare (krava si určuje rytmus), dáta na kravu.\n- **Mínus**: vysoká investícia, závislosť na elektronike, vyžaduje optimalizovanú stajňu.\n\n**Top značky**:\n- **DeLaval** (SE) — VMS robot, fishbone, paralel, karusel. Tradičný líder.\n- **Lely** (NL) — Astronaut robot. Najpredávanejší AMS na svete.\n- **GEA Westfalia** (DE) — DairyRobot, Magnum karusel.\n- **BouMatic** (US) — paralel, fishbone, robot.\n- **Fullwood** (UK) — fishbone, paralel.\n\n**Ekonomika** (orientačne pre stádo 200 dojníc):\n- **Fishbone 2×10**: investícia 1,8 mil. Kč, 2 dojiči × 4 h × 2× denne.\n- **Paralel 2×16**: investícia 3,5 mil. Kč, 1 dojič × 3,5 h × 2× denne.\n- **3× Lely Astronaut**: investícia 18 mil. Kč, 0 dojičov.\n- **Na liter mlieka**: fishbone 0,30 Kč/l, paralel 0,25, robot 0,40 (vyššie fixné, nižšie variabilné).\n\nNa Slovensku 2024: cca **70 % fariem fishbone/paralel**, **20 % karusel/rapid exit**, **10 % AMS robot** (rastie rýchlo, hlavne mladé generácie farmárov).",
    "related": [
      "telematika",
      "rijnost",
      "usni-znamka"
    ]
  },
  {
    "slug": "uhor",
    "term": "Úhor",
    "alias": [
      "úhorovanie",
      "ladina",
      "pasívny úhor"
    ],
    "kategorie": "historie",
    "shortDef": "Úhor je dočasne neosiate pole, ktoré sa necháva odpočinúť, regenerovať živiny a potlačiť buriny. V historickom trojpoľnom systéme ležala 1/3 polí ladom každý rok. Dnes prežíva ako „zelený úhor\" pre greening a EFA.",
    "longDef": "Úhor (od slovesa „úhořit\" = odpočívať) je pole, ktoré sa po zbere **dočasne neosieva**, aby si pôda mohla regenerovať živiny, vodu a štruktúru. Historicky bol základnou súčasťou európskeho poľnohospodárstva až do 19. storočia.\n\n**Trojpoľné hospodárstvo** (= trojpoľný systém, pozri [[trojhonny-system]]):\n- 1. hon: ozim (raž, pšenica)\n- 2. hon: jarina (ovos, jačmeň)\n- 3. hon: **úhor** (ladom, pasie sa alebo orie)\n\nTretina polí každý rok ležala ladom. Bez minerálnych hnojív to bol jediný spôsob, ako udržať úrodnosť. Hospodár na úhore obvykle:\n- nechal **pasenie dobytka** — ten hnojil pole čerstvým hnojom\n- **preorával** (Zemiaková orba) → ničil buriny\n- **zelený podsev** lucernou alebo ďatelinou (od 18. storočia) — fixoval dusík\n\n**Koniec úhoru:** Minerálne hnojivá (Liebig 1840s, syntéza amoniaku Haber-Bosch 1909) odstránili nutnosť úhoru. Norfolský 4-poľný systém (lucerna-pšenica-repa-jačmeň) bez úhoru dramaticky zvýšil produktivitu — anglická poľnohospodárska revolúcia.\n\n**Moderné typy úhoru:**\n- **Zelený úhor** (greening, EFA — Ecological Focus Area) — povinný v rámci CAP od 2015. Medziplodina, kvetinový pás alebo jednoducho neosiate ladom s povolenou kosbou.\n- **Čierny úhor** — orané, neosiate pole. Dnes skôr ekologicky problematický (erózia).\n- **Aktívny úhor** — pásy nektarodárnych rastlín pre opeľovače, biopásy, biopas (pozri [[biopasy]]).\n- **Pôda v zaradení** — pole vyňaté z osevu na 1-2 roky kvôli regulácii trhu.\n\nV CZ dnes:\n- Z dotácie BISS možno do **5 % výmery hospodárenia** vykázať ako úhor (EFA), počíta sa za \"klimatický príspevok\".\n- Plocha úhoru v CZ 2024: ~50 000 ha (1,2 % ornej pôdy).\n\nEtymológia: praslovanské *ǫgorъ* (= pole nechané ladom). Súvisiace slová: **ladina** (úhor po viacerých rokoch), **honitba** (revír na úhore), **pole** (kontrast: pole = obrábané, úhor = ne).\n\nPozri tiež [[trojhonny-system]], [[osevni-postup]], [[mezi-plodiny]], [[biopasy]], [[regenerativni-zemedelstvi]].",
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
    "term": "Trojhonný systém",
    "alias": [
      "trojpoľný systém",
      "trojpoľné hospodárstvo",
      "trojpoľové hospodárstvo"
    ],
    "kategorie": "historie",
    "shortDef": "Trojhonný systém je stredoveký osevný postup, ktorý rozdeľoval ornú pôdu na tri hony — ozim, jarina, úhor. Každý rok sa hony striedali. Dominoval v Európe od 9. do 19. storočia.",
    "longDef": "Trojhonný systém (tiež trojpoľný systém, nem. *Dreifelderwirtschaft*) je stredoveký a ranonovoveký **osevný postup**, ktorý nahradil starší dvojhonný systém (ozim/úhor). Vznikol v karolínskej dobe (9. storočie) a v Európe dominoval takmer 1 000 rokov.\n\n**Princíp:**\nOrná pôda dediny bola rozdelená na **tri hony** (= veľké pole pozostávajúce z mnohých úzkych záhonov jednotlivých sedliakov). Každý rok sa osievalo:\n- **1. hon (ozim)**: pšenica alebo raž, siate na jeseň\n- **2. hon (jarina)**: ovos alebo jačmeň, siate na jar\n- **3. hon (úhor)**: ladom, pasívne, pasenie dobytka pre hnoj\n\nNasledujúci rok sa všetko posunulo o jeden — ozim → úhor → jarina → ozim atď. Cyklus 3 roky.\n\n**Výhody (vs dvojhonný):**\n- 2/3 pôdy aktívne obrobené (vs 1/2 v dvojhonnom)\n- Vyššia produktivita, lepšia výživa populácie\n- Dve žatvy ročne (ozim v júli, jarina v septembri)\n- Lepšia distribúcia práce počas roka\n\n**Nevýhody (z dnešného pohľadu):**\n- 1/3 pôdy stále ležala ladom\n- Nízke výnosy (1,5–2 t/ha pšenice — dnes 8 t/ha)\n- Žiadne okopaniny (zemiaky, repa) — tie prišli až v 18. storočí\n- Sociálna strnulosť: každý sedliak mal pruhy vo všetkých troch honoch, dedina musela rozhodovať spoločne čo kedy siať\n\n**Koniec systému (prechod 1750–1900):**\n- **Norfolský 4-honný systém** (UK, 1730s): lucerna-pšenica-repa-jačmeň — bez úhoru, vyššie výnosy.\n- **Mária Terézia a Jozef II.** (CZ 1750–1790): patenty rušili nútené trojpoľné hospodárstvo, povoľovali individuálne rozhodovanie sedliakov.\n- **Liebig + minerálne hnojivá** (1840+): umožnili kontinuálny osev.\n- **19. storočie**: scelovanie pozemkov (komasácia), individuálne farmy, moderné striedanie plodín.\n\nV CZ trojhonný systém zanikol postupne 1780–1850, posledne v niektorých horských oblastiach (Šumava, Krkonoše) ešte začiatkom 20. storočia.\n\n**Pozostatky v krajine:**\n- **Lineárne cesty** medzi poliami v plužine (záhonovej parcelácii)\n- **Medzné kamene** (pozri [[mez]]) označujúce hranice\n- **Pomístne názvy**: „Veľký hon\", „Horný hon\", „Dolný hon\"\n- **Trojštrukturálne vinice** na južnej Morave (vinárske varianty)\n\nPozri tiež [[uhor]], [[osevny-postup]] (moderný), [[mez]], [[lan]].",
    "related": [
      "uhor",
      "osevni-postup",
      "mez",
      "lan"
    ]
  },
  {
    "slug": "mez",
    "term": "Medza",
    "alias": [
      "medzný pás",
      "medzník",
      "remízok"
    ],
    "kategorie": "historie",
    "shortDef": "Medza je úzky trávnatý alebo krovinatý pás oddeľujúci susedné polia. Historicky vyznačovala hranice medzi vlastníkmi, dnes je cenená pre biodiverzitu, ochranu proti erózii a v rámci CAP greening.",
    "longDef": "Medza (od staročeského *meža* = hranica) je **úzky trávnatý alebo krovinatý pás** medzi dvoma poliami. Historicky to bol praktický predel medzi vlastníkmi pôdy (hranica plužiny) aj ochrana proti splachu pôdy.\n\n**Funkcie historicky:**\n- **Hraničný pás** — viditeľne oddeľovala vlastníctvo. Často s **medzníkmi** (kamene, stĺpy) na rohoch.\n- **Krajinný prvok** — domov pre zver, vtáctvo, hmyz. Nebola intenzívne obrábaná.\n- **Cesta pre povozy** — širšie medze slúžili ako poľné cesty.\n- **Pastva pre drobný dobytok** — kozy, ovce sa pásli „na medziach\" keď pole bolo osiate.\n\n**Likvidácia medzí 1948–1989** (kolektivizácia):\nJZD a štátne statky **scelovali polia do obrovských blokov** (často 50–200 ha) pre nasadenie veľkej techniky (T-150, Š-180, Fortschritt). Tisíce kilometrov medzí v ČR padlo. Dôsledky:\n- Akcelerácia **vodnej erózie** (žiadne zelené pásy zachytávajúce splach)\n- Pokles **biodiverzity** (zánik útočiska pre hmyz, vtáky, drobnú zver)\n- Vznik veľkých homogénnych „prérií\"\n- Zmeny mikroklímy (suchšia krajina, vetru otvorená)\n\n**Návrat medzí 1990–dnes:**\n- **CAP greening / EFA**: medze, biopásy, kvetinové pásy sa počítajú ako Ecological Focus Area (3–5 % výmery).\n- **AEKO podopatrenie**: dotácie za údržbu medzí (50–80 Kč/m dĺžky/rok).\n- **Erozívna kontrola** v erózne ohrozených oblastiach (DPB) — GAEC 2 vyžaduje protierózne opatrenia, medze sú jedným z nástrojov.\n- **Krajinotvorné prvky** — medze zo zákona chránené (Zákon č. 114/1992 Zb.).\n\n**Šírka medzí dnes:**\n- **Klasická medza** šírky 1–3 m medzi poliami\n- **Široká medza** 5–10 m, často s krami (trnka, šípka, hloh) — pre vodné hospodárstvo\n- **Lineárny remízok** 10+ m — funguje ako biotop\n- **Biokoridor** 20+ m — prepája väčšie biotopy\n\n**Pomístne názvy s „medza\"** sú v ČR všadeprítomné: „Na Mezích\", „Veľká medza\", „Medzná cesta\", „U medzníka\", obce „Meznice\", „Meziroka\", „Meziboří\".\n\nPozri tiež [[biopasy]], [[eroze-pudy]], [[trojhonny-system]], [[gaec]], [[lan]].",
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
    "term": "Robota",
    "alias": [
      "poddanská robota",
      "panská robota",
      "ťažná robota"
    ],
    "kategorie": "historie",
    "shortDef": "Robota bola povinná neplatená práca poddaných sedliakov na panskej pôde, hlavná forma feudálnej renty v českých krajinách od 11. do 19. storočia. Zrušená 1848 (formálne) a 1849 (definitívne).",
    "longDef": "Robota (od slovesa *robotiti* = pracovať, otročiť) bola **povinná neplatená práca** poddaných sedliakov na pôde vrchnosti (šľachty, kláštorov, kráľa). V českých krajinách to bola hlavná forma feudálnej renty od 11. do 19. storočia.\n\n**Typy roboty:**\n- **Ťažná robota** — práca s párom koní alebo volov (orba, hnojenie, žatva, vozenie). Pre „láníkov\" s celým lánom.\n- **Pešia robota** — manuálna práca (kopanie, pletie, kosenie, hrabanie). Pre chalupníkov a domkárov.\n- **Ženská robota** — pradenie, pletenie, žatva, zber ovocia.\n- **Mimoriadna robota** — stavby (mlyny, panské sídla), lov pre vrchnosť.\n\n**Rozsah:**\nRobotné povinnosti sa odvíjali od veľkosti gruntu (pozri [[grunt]], [[lán]]):\n- **Láník (celý lán, 17+ ha)**: 3 dni ťažnej roboty týždenne + sezónne špičky (žatva, vinobranie)\n- **Pôlláník**: 2 dni ťažnej + 1 deň pešej\n- **Chalupník**: 1–2 dni pešej týždenne\n- **Domkář (bez pôdy)**: len sezónne\n\nPlus **naturálne dávky** (desiatok, vajcia, sliepky) a peňažné dane.\n\n**Kľúčové míľniky regulácie:**\n- **1680 — Tereziánsky patent o robote**: max. 3 dni ťažnej / 3 dni pešej týždenne.\n- **1738 — Robotný patent Karla VI.**: ďalej upresnené, ale poddaný stále nemohol odísť.\n- **1775 — Robotný patent Márie Terézie**: oficiálne tabuľky podľa veľkosti gruntu, nútené zmierovacie komisie pri sporoch.\n- **1781 — Patent o zrušení nevoľníctva Jozefa II.**: poddaný mohol odísť z panstva, vziať si koho chcel, dať deti na remeslo. **Robota však zostala!**\n- **1848 — Október 1848**: Hans Kudlich (sedliak a poslanec Ríšskeho snemu) iniciuje **zrušenie roboty bez náhrady**. Schválené 7. septembra 1848.\n- **1849 — Skutočná likvidácia**: vrchnosť dostala kompenzáciu (od štátu, nie sedliakov). Sedliak sa stal **slobodným vlastníkom pôdy**.\n\n**Dopady zrušenia:**\n- Vznik slobodného trhu s pôdou\n- **Komasácia** (scelovanie) pozemkov 1850–1920\n- Mladí sedliaci si mohli budovať hospodárstvo bez záväzkov\n- Vznik moderného poľnohospodárstva s motívom zisku\n- Sociálna revolúcia na vidieku — emigrácia „prebytočných\" sedliakov do USA, Viedne, do miest\n\nV kultúre: **„Babička\"** B. Němcovej (1855) zachytáva neskorú robotnú éru. **„Robotnícky dom\"** bola historická budova pre ubytovanie nájomných pracovníkov na panstve po zrušení nevoľníctva.\n\nEtymológia: od staročeského *robota* (ťažká práca, otroctvo). Karel Čapek v R.U.R. (1920) použil slovo **robot** v modernom zmysle, čím ho učinil svetovým.\n\nPozri tiež [[grunt]], [[lán]], [[trojhonny-system]], [[medza]], [[úhor]].",
    "related": [
      "grunt",
      "lan",
      "trojhonny-system",
      "mez"
    ]
  },
  {
    "slug": "grunt",
    "term": "Grunt",
    "alias": [
      "sedliacky grunt",
      "gruntový zápis",
      "gruntová kniha"
    ],
    "kategorie": "historie",
    "shortDef": "Grunt je historické označenie pre sedliacke hospodárstvo — usadlosť s domom, hospodárskymi stavbami, záhradou a poliami. „Sedliacky grunt\" bol základnou jednotkou vidieckej spoločnosti až do polovice 20. storočia.",
    "longDef": "Grunt (z nemeckého *Grund* = základ, pôda) je historické označenie pre **sedliacke hospodárstvo** — usadlosť so všetkým príslušenstvom: dom, stajne, stodola, sýpka, záhrada, sad a polia v plužine obce. „Sedliak na grunte\" bol základnou sociálnou vrstvou vidieckeho obyvateľstva.\n\n**Veľkosť gruntov:**\n- **Celý lán (lánik)**: 17–20 ha polí — najvyššia kategória, „sedliacky grunt\"\n- **Polovica lánu (pololánik)**: 8–10 ha — stredný sedliak\n- **Štvrtina lánu (štvrtlánik, chalupník s poľom)**: 4–5 ha\n- **Chalupa bez pôdy**: len dom a malá záhrada — domkári, remeselníci\n- **Veľký grunt** (statkár, dvorový grunt): 30+ ha, často s vlastnými paholkami\n\n**Architektúra gruntu:**\n- **Dom** s jednou veľkou „svetnicou\" (obytná miestnosť s pecou), kuchyňou a komorou\n- **Chliev** (stajne) pre kravy, kone, prasatá — typicky v zadnej časti dvora\n- **Stodola** (stoh — viď samostatne) pre slamu, seno, uskladnenú úrodu pred mlátením\n- **Sýpka** (panský sýpkár) — uskladnenie obilia na siatie + osivo na zimu\n- **Studňa** uprostred dvora\n- **Hnojisko** (mršište) za chlievom\n- **Sad / záhrada** za domom (jablone, hrušky, slivky)\n\n**Gruntové knihy:**\nOd 16. storočia **každá dedina mala gruntovú knihu** vedenú vrchnosťou (neskôr štátom) — záznam **kto na ktorom grunte hospodári**, predaje, dedičské prevody, veno. Kľúčový zdroj pre genealógiu a históriu dediny.\n\n**Kľúčové gruntové právo:**\n- **Nedeliteľnosť gruntu** — celý grunt preberal **jeden syn** (typicky najstarší, ale nie vždy). Ostatní išli na remeslo, do mesta alebo dostali peňažnú pomoc.\n- **Výmenok** — odchádzajúci hospodár (starnúci otec) si na grunte vymienil bývanie a stravu na zvyšok života. Zmluva pevne zakotvená.\n- **Výmenkársky domček** = malá budova pre výmenkára (často súčasť gruntu).\n\n**Koniec gruntov 1948–1960:**\n- **Vyvlastnenie**: kolektivizácia zlikvidovala súkromné hospodárenie, grunt sa stal súčasťou JRD/Štátneho majetku.\n- **Vykulačenie**: najväčšie sedliacke grunty (kulaci) zlikvidované, rodiny perzekvované.\n- **Demolácia**: mnoho gruntov zbúraných pre výstavbu kravínov, síl a domov pre pracujúcich JRD.\n\n**Reštitúcie 1991–dnes:**\n- Vrátenie pozemkov a budov pôvodným vlastníkom alebo dedičom.\n- Mnoho gruntov zrekonštruovaných ako **rodinné farmy** (často 5. generácia na rovnakom pozemku).\n- Niektoré veľké grunty fungujú ako **agroturistika** alebo „dedičstvo\" pre mestských potomkov.\n\n**Pomístne stopy**: „Na grunte\", „Starý grunt\", „Gruntová cesta\" sú typické názvy v ČR. **Priezviská Grunt, Grunta, Gruntorád** odkazujú na sedliacky pôvod.\n\nPozri tiež [[lán]], [[robota]], [[trojpoľný systém]], [[medza]], [[jutro]], [[korec]].",
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
    "term": "Žentúr",
    "alias": [
      "šľapací stroj",
      "žentúrový stroj"
    ],
    "kategorie": "historie",
    "shortDef": "Žentúr je historický stroj poháňaný silou dobytka (kone, voli) — kruhové zariadenie, kde zviera chodí po obvode a otáča hriadeľou napojenou na mláťačku, šrotovník alebo lis. Predchodca parného a elektrického pohonu.",
    "longDef": "Žentúr (nem. *Göpel*, z latinského *gyrum* = kruh) je **historický stroj poháňaný ťažnou silou dobytka** — kone, voly, osly. Princíp: zviera kráča po kruhovej trati (priemer 6–10 m) a otáča zvislou alebo vodorovnou hriadeľou, ktorá poháňa cieľový stroj.\n\n**Konštrukcia:**\n- **Centrálna zvislá hriadeľ** s ramenom (rudlom), za ktoré zviera ťahá\n- **Prevodovka** (často s ozubenými kolesami) — prekladá pomalú otáčku zvieraťa (3–8 ot/min) na rýchlejšiu pre pracovný stroj\n- **Plošina alebo strecha** — chráni zviera pred dažďom\n- **Postroj a vodítka** — niekedy s automatickou reguláciou rýchlosti\n\n**Použitie:**\n- **Mlátiačka obilia** (najčastejšie) — mlát (cep) bol postupne nahradený mechanickou mláťačkou poháňanou žentúrom\n- **Šrotovník** — drvenie obilia a zemiakov na krmivo\n- **Lis** — slamy do balíkov, ovocia na mušt\n- **Vyklápač** — sena, hnoja\n- **Čerpadlo** — voda zo studne do zásobníka\n- **Kováreň** — pohon dúchadla v kováčni\n- **Cukrovary 19. storočia** — drvenie cukrovej repy\n\n**Dve hlavné varianty:**\n1. **Zvislý žentúr** (najstarší) — zviera chodí okolo zvislej osi, mláťačka stojí v centre. Vyžaduje veľkú plochu.\n2. **Vodorovný žentúr** (od 18. storočia) — kompaktnejší, hriadeľ vedie z žentúru do stroja v susednej miestnosti. Umožnil **stavbu žentúrovej stodoly** s dvoma miestnosťami.\n\n**Výkon:**\n- 1 kôň generuje ~0,5–1 konskej sily (740 W) v žentúre\n- Pár koní = ~1,5 HP = stačí pre malú mláťačku (100 kg obilia/h)\n- 4 voli = ~2 HP — pre väčšiu mláťačku alebo lis\n\n**História:**\n- **Stredovek**: len pre vodné mlyny a kováčne (vodné kolesá, nie žentúry).\n- **16.–18. storočie**: šírenie žentúrov s mláťačkami v Anglicku, Nemecku.\n- **1740–1850 v ČR**: každý väčší grunt mal žentúrovú stodolu.\n- **1850–1900**: parný stroj (lokomobila — viď [[parný stroj]]) postupne nahradil žentúr. Mlátiačka poháňaná parou bola mnohonásobne výkonnejšia.\n- **1900–1950**: elektrický motor (po elektrifikácii vidieka 1920–1950) finálne nahradil aj parný stroj.\n- **Dnes**: žentúry sú múzeálne kuriozity (Vlastivedné múzeum Šumperk, Veselý Kopec, skanzeny).\n\n**Stopy v krajine:**\n- **Žentúrové stodoly** — okrúhly alebo polygonálny pôdorys so šikmou strechou, dodnes zachované v niektorých dedinách (najmä severná Morava, Vysočina).\n- **Pomístne názvy**: „U žentúru\", „Žentúrová cesta\".\n- **Slovo „žentúr\"** prežíva v dialekte ako synonymum pre „ťažkú monotónnu prácu\" (Čalúniť ako žentúr = robiť namáhavú rutinnú prácu).\n\nPozri tiež [[grunt]], [[robota]], [[mlat]], [[zne]].",
    "related": [
      "grunt",
      "robota",
      "mlat",
      "zne"
    ]
  },
  {
    "slug": "mlat",
    "term": "Mlat",
    "alias": [
      "mlátička",
      "mlatovňa",
      "humno"
    ],
    "kategorie": "historie",
    "shortDef": "Mlat je veľká plocha (pôvodne udupaná hlina) v stodole, kde sa cepmi alebo žentúrovou mláťačkou mlátilo obilie. Centrum zimného hospodárenia až do 19. storočia, keď ho nahradila mobilná mláťačka.",
    "longDef": "Mlat (od *mlátiť*) je **vodorovná spevnená plocha** vo vnútri stodoly, kde sa v zime **mlátilo obilie** — oddeľovali sa zrná od slamy a klasov. Kľúčové miesto zimnej práce sedliaka.\n\n**Konštrukcia mlatu:**\n- **Podlaha**: tvrdá udupaná hlina zmiešaná s vápnom alebo volskou krvou (pre tvrdosť), občas dlažba alebo drevené fošne\n- **Veľkosť**: typicky 4 × 6 m až 6 × 10 m\n- **Umiestnenie v stodole**: uprostred medzi dvoma „závory\" — priestory, kde sa skladovali nevymlátené snopy\n- **Vstupy**: dve protiľahlé vráta (juh aj sever), aby sa dali „závory\" zaplniť z oboch strán a aby fungoval **prievan** pre zdvíhanie pliev (prevívanie zrna)\n\n**Mlácenie cepom (do ~1850):**\n- **Cep** (pozri [[cep]]) — drevený nástroj so švihacou časťou (bidlo + tĺčka spojené remienkom)\n- **Rytmus**: 4–8 mláťačov v rade mlátilo rytmicky („štvorka\", „šestorka\") — dodnes prežíva v ľudovej hudbe (rytmus „mláťačiek\")\n- **Výkon**: 1 mláťač zvládne ~50–80 kg zrna za deň\n- **Skladba sezóny**: mlátilo sa od novembra do marca — celé 4–5 mesiacov zimnej práce\n\n**Mlácenie žentúrovou mláťačkou (1850–1900):**\n- **Mechanická mláťačka** poháňaná žentúrom (pozri [[zentour]]) v susednej miestnosti\n- **Výkon**: 200–500 kg obilia za hodinu (5–10× rýchlejšie než cep)\n- **Pomocník**: 2–3 muži prikladali snopy, 1–2 odoberali slamu, 1 odoberal zrno\n\n**Mlácenie parnou lokomobilou (1880–1950):**\n- **Sťahovavá mláťačka** — parný stroj na vozíku obchádzal dediny, „mlátil\" 1–2 dni u každého sedliaka\n- **Výkon**: 1 000–2 000 kg/h\n- **Koniec mlatu ako pracovného priestoru** — práca sa presunula von na dvor\n\n**Mlácenie kombajnom (1950+):**\n- **Kombajn** (pozri [[kombajn-trieda]]) vykonáva mlácenie **priamo na poli**\n- Mlat stratil funkciu, **stodoly sa prestavali** na garáže pre techniku, sklady pre hnojivá, alebo sa zbúrali.\n\n**Dnes:**\n- Niektoré staré stodoly s mlatom dochované v skanzenoch (Veselý Kopec, Strážnice, Přerov nad Labem).\n- **„Mlatová slávnosť\"** = ľudová oslava konca mlácenia (pred 1900), s tancom na mlate.\n- Slovo **mláťačka** prežíva ako technický termín (= obilná mláťačka v kombajne, pozri [[rotor-kombajn]]).\n\n**Pomístne názvy:** „U mlatu\", „Mlatovňa\", „Stará mláťačka\" v ČR bežné.\n\n**„Humno\"** (slovenské, valašské) = synonymum mlatu, niekedy širšie (= celá stodola).\n\nEtymológia: praslovanské *mlatъ* (= úder, mlat). Súvisiace slová: **mlátiť** (= mlátiť cepom), **mláťačka** (= stroj), **mlatec** (= muž mlátiaci cepom).\n\nPozri tiež [[zentour]], [[grunt]], [[žatva]], [[cep]], [[rotor-kombajn]].",
    "related": [
      "zentour",
      "grunt",
      "zne",
      "rotor-kombajn"
    ]
  },
  {
    "slug": "zne",
    "term": "Žatva",
    "alias": [
      "žatva",
      "zber obilia",
      "kosenie"
    ],
    "kategorie": "historie",
    "shortDef": "Žatva je tradičné označenie zberu obilia — vrcholné obdobie letného poľnohospodárskeho roka (júl–august). Historicky sa kosilo kosákom alebo kosou, dnes kombajnom. V kultúre symbol „roku v znamení slnka a chleba\".",
    "longDef": "Žatva (od slovesa *žať* — kosiť obilie) je **vrcholné obdobie zberu obilia** v letnom poľnohospodárskom cykle. V ČR typicky koniec júla až polovica augusta (oziminy prvé, jariny neskôr). Historicky to bola **najintenzívnejšia práca roka** s vlastnou liturgiou, piesňami a obyčajmi.\n\n**Tradičná žatva (do ~1900):**\n- **Nástroje**: **kosák** (jednoručný, do 17. storočia hlavný), **kosa** (od 17. storočia — väčší výkon)\n- **Tempo**: 1 kosec za deň zvládne ~0,3–0,5 ha obilia\n- **Organizácia**: rodina + nájomní pomocníci („ženci\", „ženkyne\")\n- **Žatevná skupina** (= 4–8 ľudí): jeden kosec → odberateľka (žena) za ním → snopičia (viazači snopov — viď [[snop-otep]]) → kladači do panákov\n- **Po zbere**: snopy stoja v poľných **panákoch** (šokách) na vysušenie 1–2 týždne, potom sa prevážajú do **stodôl** na **mlat** (viď [[mlat]]) na zimné mlátenie\n\n**Mechanizačné míľniky:**\n- **1850 — Žací stroj (reaper)** Cyrus McCormick (USA), Cyrus Hall McCormick — ťahá dvojspražie koní, jeden vodič. Reaper položil obilie na zem, ženci ho viazali ručne.\n- **1880 — Žací viazací stroj (binder)** — viazal snopy automaticky.\n- **1930 — Kombajn** v USA (kombinácia žacieho stroja + mláťačky). Zbiera + mláti + čistí v jednej operácii.\n- **1950 — Kombajn v ČSR** (Mountfield, Sodóma, neskôr Slavia, Kombajny Polska Bizon).\n- **1990+ — Veľké západné kombajny** (Claas Lexion, John Deere S-rada, New Holland CR).\n\nDnes:\n- **Zber pšenice**: 1 moderný kombajn (Claas Lexion 8900) zvládne **5–10 ha/h** = celá farma 500 ha za **2–3 dni**.\n- **Kosec s kosou**: 0,3 ha/deň × 500 ha = **3 roky ľudskej práce** ekvivalent jedného moderného kombajnu.\n\n**Kultúrna dimenzia:**\n- **Žatevné piesne** (zachované ľudovou tradíciou, napr. „Pole, pole, široké pole\")\n- **„Hostina po žatve\"** = oslava konca zberu, štedrá strava, tanec\n- **„Dožinky\"** = slávnostný sprievod posledného snopu ozdobeného kvetmi k statkárovi, vrchnosti alebo dnes na slávnostiach mestečka/obce\n- **„Zberový obrad\"** v niektorých krajoch (privolávanie úrody) — synkretizmus pohanských a kresťanských obradov\n- **Klasické české literatúry**: Babička, Naši, Karel Klostermann — žatva je ústredná scéna vidieckeho roka\n\n**Klimatické riziko žatvy:**\n- **Búrky** — silný dážď „polehne\" obilie (vrhne steblá k zemi), výnos klesá o 20–40 %\n- **Krupobitie** — likviduje úrodu počas minút\n- **Dlhodobé mokré počasie** — obilie klíči v klase, strata potravinárskej kvality\n- **Sucho** — znižuje výnos aj hektolitrovú váhu (viď [[hektoliter]])\n\n**Zber 2024 v CZ** (orientačne):\n- Pšenica ozimná: 1,4 mil. ha × 6,2 t/ha = **8,7 mil. t**\n- Jačmeň: 320 tis. ha × 5,8 t/ha = **1,85 mil. t**\n- Repka: 380 tis. ha × 3,2 t/ha = **1,2 mil. t**\n- Kombajny v prevádzke: ~3 500 ks (prevažujú Claas + JD)\n\n**„Otavy\"** = druhý zber trávy/sena na jeseň (NIE obilie — to ide len raz).\n\nViď tiež [[mlat]], [[snop-otep]], [[kombajn-trida]], [[rotor-kombajn]], [[grunt]].",
    "related": [
      "mlat",
      "kombajn-trida",
      "rotor-kombajn",
      "grunt"
    ]
  },
  {
    "slug": "regenerativni-zemedelstvi",
    "term": "Regeneratívne poľnohospodárstvo",
    "alias": [
      "regen ag",
      "regenerative agriculture"
    ],
    "kategorie": "precise-farming",
    "shortDef": "Regeneratívne poľnohospodárstvo je systém pestovania zameraný na obnovu zdravia pôdy, zvyšovanie organickej hmoty, biodiverzity a sekvestráciu uhlíka. Kľúčové praktiky: no-till, krycie plodiny, integrácia dobytka, zníženie agrochémie.",
    "longDef": "Regeneratívne poľnohospodárstvo (anglicky *regenerative agriculture*, „regen ag\") je systém produkcie, ktorý **aktívne obnovuje** zdravie pôdy, biodiverzitu a ekosystémové služby. Nie je to certifikačná schéma ako bio, ale **principiálny prístup** s merateľnými výsledkami.\n\n**5 princípov regeneratívneho poľnohospodárstva** (podľa Gabe Brown, US):\n1. **Minimalizácia narušenia pôdy** — žiadna orba, žiadne hlboké spracovanie. Pôda zostáva štruktúrovaná, mikroorganizmy neprerušené. Pozri [[no-till]], [[strip-till]].\n2. **Stály kryt pôdy** — krycie plodiny (cover crops), mulč, slama. Pôda nikdy nahá. Znižuje eróziu, udržuje vlhkosť, kŕmi mikrobiom.\n3. **Rozmanitosť rastlín** — minimálne 4-5 plodín v rotácii, ideálne viacročné zmesi (medzi plodiny, pozri [[medzi-plodiny]]). Žiadna monokultúra.\n4. **Žijúce korene celoročne** — vždy niečo rastie. Krycie plodiny medzi hlavnými plodinami zabezpečia, že korene stále kŕmia mikrobiom.\n5. **Integrácia dobytka** — pastva alebo „mob grazing\" (vysoká intenzita, krátka doba) na poliach po zbere. Hnoj + tlmiace kopytá + sliny obnovia pôdu.\n\n**Hlavné rozdiely vs konvenčné poľnohospodárstvo:**\n\n| Aspekt | Konvenčné | Regeneratívne |\n|--------|-----------|---------------|\n| Pôda | Komodita (substrát) | Živý organizmus |\n| Spracovanie | Orba, podmietka | No-till, strip-till |\n| Kryt | Holá pôda 3–6 mes./rok | Stály kryt |\n| Plodín v rotácii | 2–4 | 5+ |\n| Minerálne hnojivá | 150–200 kg N/ha | 50–100 kg N/ha (s pokrytím leguminózami) |\n| Postreky | Pravidelne | Cielené, redukované |\n| Dobytek | Oddelený od polí | Integrovaný |\n\n**Merateľné výsledky (po 5–10 rokoch):**\n- **Organická hmota v pôde**: +1–2 % (z 2 % na 3–4 %). Každé 1 % SOM = +20 t C/ha sekvestrácia.\n- **Infiltrácia vody**: 2–10× lepšia (menej povrchového odtoku)\n- **Náklady**: -20 až -40 % (menej paliva, hnojív, postrekov)\n- **Výnosy**: Prvé 2–3 roky pokles 10–20 %, potom porovnateľné s konvenčným (niekedy +10–20 %)\n- **Marže**: vyššie kvôli nižším nákladom + prémiové ceny (carbon credits, regen certifikácia, Whole Foods/Patagonia kontrakty)\n\n**Slávne regen mená:**\n- **Gabe Brown** (USA, ND) — kniha „Dirt to Soil\", farma 2 500 ha bez hnojív 20+ rokov\n- **Allan Savory** (Zimbabwe) — „Holistic Management\" pre pastvu\n- **Joel Salatin** (USA, VA) — Polyface Farm, multi-species integrované pastviny\n- **Charles Massy** (Austrália) — „Call of the Reed Warbler\", regenerácia austrálskych pastvín\n\n**V ČR:**\n- **Južočeská farma „Kuneš\"** (Kestřany) — modelová regen farma\n- **AgroProgress** — konzultácie pre prevod\n- **Skupina REGAGRI** — združenie regen farmárov\n- **Carbon credits**: pilotné programy od 2023 (Indigo, Climate Farmers, Soil Capital)\n\n**Riziko:**\n- **Prechodové obdobie 3–5 rokov** — výnosy klesnú, kým sa neobnoví pôdny mikrobiom\n- **Vyžaduje hlboké znalosti** agronómie a ekológie — viac než aplikovať recepty\n- **Pozemkové vlastníctvo**: prenajatá pôda znevýhodňuje (musíš dlhodobo investovať do niečoho, čo možno opustíš)\n\nPozri tiež [[no-till]], [[ctf]], [[medzi-plodiny]], [[organická-hmota]], [[karbónové-poľnohospodárstvo]], [[biouhoľ]], [[mykorhíza]].",
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
    "term": "Uhlíkové poľnohospodárstvo",
    "alias": [
      "carbon farming",
      "climate-smart agriculture",
      "uhlíkové poľnohospodárstvo"
    ],
    "kategorie": "precise-farming",
    "shortDef": "Uhlíkové poľnohospodárstvo je súbor praktík, ktoré sekvestrujú CO₂ z atmosféry do pôdy a biomasy. Poľnohospodár môže z certifikovaného uhlíka generovať „uhlíkové kredity\" predávané korporáciám na plnenie klimatických záväzkov.",
    "longDef": "Uhlíkové poľnohospodárstvo (carbon farming) je systém **poľnohospodárskych praktík aktívne zvyšujúcich uhlíkové zásoby v pôde a vegetácii** s cieľom zmierniť klimatickú zmenu. Poľnohospodár sa stáva „uhlíkovým farmárom\" — produkuje vedľa bežných plodín aj **sekvestrovaný uhlík**, ktorý je možné predať ako **uhlíkový kredit**.\n\n**Kľúčové praktiky (sekvestrácia C):**\n- **No-till / strip-till** — bez orby = menej oxidácie organickej hmoty = viac C v pôde. Viz [[no-till]], [[strip-till]].\n- **Krycie plodiny** (cover crops) — korene + listy pridávajú C do pôdy medzi hlavnými plodinami.\n- **Vrátiť slamu** (incorporation reziduí) — nepaľovať slamu, mulčovať ju.\n- **Hnojivá organické** (hnoj, kompost, biouhel — viz [[biouhel]]) miesto minerálnych.\n- **Diverzifikácia osevného postupu** — 5+ plodín v rotácii.\n- **Vápnenie** (viz [[vapneni]]) — alkalizuje pH, znižuje emisie N₂O.\n- **Agrolesníctvo** — stromohrady, vetrolamy, agroforestry. Stromy zachytávajú veľké množstvo C.\n- **TTP konverzia** (orná → lúka, viz [[ttp]]) — lúky uloží 2–4× viac C než orná.\n\n**Čo je 1 uhlíkový kredit?**\n1 uhlíkový kredit = **1 tona CO₂ ekvivalentu** sekvestrovaná alebo redukovaná. V SR/EU sa obchoduje na dobrovoľných trhoch za:\n- **15–25 EUR/t CO₂** (dnes 2024) na dobrovoľných trhoch (Verra, Gold Standard)\n- **60–90 EUR/t CO₂** v EU ETS (povinný trh, ale poľnohospodárstvo tam zatiaľ nie je)\n\n**Príklad ekonomiky** (farma 500 ha prechádza z orby na no-till + krycie plodiny):\n- **Sekvestrácia**: ~0,5 t C/ha/rok = ~1,8 t CO₂/ha/rok\n- **500 ha × 1,8 t × 20 EUR = 18 000 EUR/rok = ~450 tis. Kč**\n- Plus zníženie nákladov na palivo a hnojivá: ~200 tis. Kč\n- Minus poradenstvo a certifikácia: ~80 tis. Kč\n- **Čistý zisk**: 570 tis. Kč/rok dodatočne\n\n**Certifikačné schémy** (ako predať kredit):\n- **Verra VCS** (Verified Carbon Standard) — globálna, drahá certifikácia\n- **Gold Standard** — preferuje sociálny dopad\n- **Indigo Ag** (USA) — agtech platforma, prevažuje v USA\n- **Climate Farmers** (DE) — startup pre EU farmy\n- **Soil Capital** (BE) — platby za t CO₂\n- **eAgronom** (EE) — softvérová platforma pre management\n- **AgroVoltaika certifikácia** (SOIL3) — CZ-orientovaná\n\n**Problémy a kritika:**\n- **Additionality** — kredit je „platný\" len ak farma sekvestráciu NEDĚLALA by bez neho. Sporné.\n- **Permanence** — ak farma za 10 rokov znovu zorá, uhlík sa vráti do atmosféry. Uhlíkový kredit by mal byť „revoked\".\n- **Verification** — meranie obsahu C v pôde je drahé, často nepresné. Modely vs reálne meranie.\n- **Leakage** — ak farma A sekvestruje, ale farma B vedľa zorá viac, čistý dopad = 0.\n- **Greenwashing** — niektoré firmy nakupujú kredity, aby vyzerali „klimaticky neutrálné\", ale nikdy neznižujú vlastné emisie.\n\n**EU + SR politika:**\n- **EU CRCF** (Carbon Removals Certification Framework) — nariadenie 2024 nastavuje pravidlá pre uhlíkové kredity zo poľnohospodárstva.\n- **Strategický plán SZP 2023–2027** zahŕňa **uhlíkové platby** v rámci EKO a AEKO.\n- **MZe SR** v 2026 plánuje pilotné „uhlíkové dotácie\" pre farmy v no-till.\n\n**Odporúčaná literatúra:**\n- Lal, R. (2004) „Soil carbon sequestration impacts on global climate change and food security\"\n- Kniha „Drawdown\" (P. Hawken, 2017) — top 100 riešení klimatickej zmeny, mnoho v poľnohospodárstve\n\nViz tiež [[regenerativni-zemedelstvi]], [[no-till]], [[organicka-hmota]], [[biouhel]], [[ttp]], [[vapneni]].",
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
    "term": "Strip-till",
    "alias": [
      "pásové spracovanie",
      "pásová orba",
      "strip tillage"
    ],
    "kategorie": "agrotechnika",
    "shortDef": "Strip-till je kompromis medzi orbou a no-till — spracováva len 20–30 cm široký pás pôdy v riadku (kde sa seje), medzi riadkami pôda zostáva nedotknutá. Vhodné pre kukuricu, slnečnicu, repku.",
    "longDef": "Strip-till (pásové spracovanie, *strip tillage*) je **kompromis medzi konvenčnou orbou a no-till** (viď [[no-till]]). Stroj spracováva **len úzky pás pôdy priamo v siatom riadku** (typicky 20–30 cm široký), zatiaľ čo priestor medzi riadkami (typicky 75 cm rozteč pre kukuricu) zostáva **nedotknutý** s mulčom.\n\n**Princíp činnosti:**\nStroj má dve hlavné časti na každom riadku:\n1. **Diskový kotúč** — reže zvyšky a uvoľňuje hornú vrstvu (do 2–5 cm)\n2. **Dláto / radlička** — kyprí pás do hĺbky 15–25 cm\n3. **Voliteľne**: aplikácia hnojív do pásu (P, K, kvapalný N) v jednom prejazde — „fertilizer applicator\"\n4. **Voliteľne**: zapožičané siatie (súčasne seje osivo) — *one-pass* operácia\n\n**Pre ktoré plodiny:**\nStrip-till je ideálny pre **riadkové plodiny s veľkou roztečou**:\n- **Kukurica** (rozteč 75 cm) — primárne uplatnenie\n- **Slnečnica** (rozteč 70 cm)\n- **Cukrovka** (rozteč 45–50 cm)\n- **Repka ozimná** (rozteč 30–50 cm)\n- **Sója** (rozteč 35–50 cm)\n\nPre úzko siatu pšenicu (rozteč 12,5 cm) **strip-till nemá zmysel** — celá plocha by sa spracovávala, ekvivalent k orbe.\n\n**Výhody:**\n- **Zníženie erózie**: medziradkový mulč zachytáva vodu (vs holá orba)\n- **Úspora paliva**: -30–50 % vs orba\n- **Lepšia štruktúra pôdy**: len 30 % plochy spracovaná, zvyšok udržuje štruktúru\n- **Cielené hnojenie**: hnojivo presne do riadku, nie plošne → -20 % spotreba\n- **Neskorá jeseň/jar vhodná**: vyššia pružnosť než klasická orba (ktorá musí skoro na jeseň)\n- **Sekvestrácia uhlíka**: ako kompromis medzi orbou (-) a no-till (+)\n\n**Nevýhody:**\n- **Drahý stroj** — strip-till s aplikáciou hnojív 1,5–3 mil. Kč (vs bežný pluh 500 tis. Kč)\n- **Vyžaduje GPS RTK** (viď [[gps-rtk]]) — riadky musia byť presné na 2 cm. Bez RTK nemožno opakovane trafiť rovnaké pásy.\n- **Závisí na type pôdy**: na ťažkých ílovitých pôdach problém s utuženým medzipásom (potreba občasná hlboká orba)\n- **Buriny**: v mulči medzi pásmi klíčia buriny, potreba glyfosát + selektívne herbicídy\n- **Sklon**: na svahoch > 8 % riskantné (erózia v koľaji siacieho stroja)\n\n**Stroje:**\n- **Kuhn Striger** (FR) — premium, 1,5–2,5 mil. Kč\n- **Vaderstad Cultus** (SE) — robust, populárny v CZ\n- **Köckerling Vector** (DE) — kombinácia s aplikáciou\n- **Horsch Focus TD** (DE) — strip-till + siaci stroj v jednom\n- **John Deere 2510H** (US) — populárny v USA, menej v EU\n\n**V ČR**: do roku 2020 marginálny (< 1 % výmery), 2024 už ~5–8 % výmery kukurice a repky. Rast poháňaný:\n- AEKO platby za znížené spracovanie pôdy\n- Vysoká cena nafty 2022+\n- GAEC 5 (erozné opatrenia v erózne ohrozených zónach)\n\nViď tiež [[no-till]], [[orba]], [[regenerativni-zemedelstvi]], [[ctf]], [[gps-rtk]], [[eroze-pudy]].",
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
    "term": "Biouhel (biochar)",
    "alias": [
      "biochar",
      "agrouhel",
      "pyrouhel"
    ],
    "kategorie": "hnojivo",
    "shortDef": "Biouhel je porézny uhlík získaný pyrolýzou biomasy (dreva, slamy, rastlinných zvyškov) bez kyslíka. Pridáva sa do pôdy na zvýšenie úrodnosti, viazanie živín a dlhodobú sekvestráciu uhlíka (1000+ rokov).",
    "longDef": "Biouhel (anglicky *biochar*, grécky *bios* + *char* = život + uhlík) je **uhlíkatý materiál vyrobený pyrolýzou** (zahriatím bez kyslíka) biomasy — drevené štiepky, slama, šupky, hnoj, ovocné pecky. Vyžaruje **75–90 % uhlíka** z pôvodnej biomasy, ktorý je v pôde **stabilný stovky až tisíce rokov** — preto silný nástroj sekvestrácie CO₂.\n\n**Vznik a inšpirácia — *Terra Preta*:**\nV Amazonii (Brazília) boli objavené **temne čierne úrodné pôdy** *Terra Preta de Índio* obsahujúce až 80 t/ha biouhle zo starých indiánskych ohnísk. **Vek 500–2000 rokov**, dodnes mnohonásobne úrodnejšie než okolité červené latosoly. Inšpirácia pre moderný biochar.\n\n**Pyrolýza — výrobný proces:**\n- **Teplota**: 400–800 °C\n- **Bez kyslíka**: aby biomasa neoxidovala (nepálila sa na popol)\n- **Doba**: 15 min – 8 h podľa technológie\n- **Produkty**:\n  - 30–40 % biochar (pevný)\n  - 30–50 % bioolej (kvapalný — palivo)\n  - 20–30 % syngas (CO + H₂ + CH₄ — palivo)\n- **Energetická bilancia**: pyrolýza je samonosná — syngas poháňa proces\n\n**Vstupné suroviny:**\n- **Drevené štiepky** (lesná ťažba, prerezávky) — najvyššia kvalita biouhle\n- **Slama obilnín** (pšenica, kukurica, repka) — stredne kvalitná, hojne dostupná\n- **Šupky a peckoviny** (ovocie, orechy) — vysoko porézne\n- **Hnoj kurčiat / kráv** — bohatý na P, K\n- **Zelená biomasa** (rákos, miscanthus) — pre plantáže biouhle\n\n**Efekt na pôde:**\n1. **Porozita** — 1 g biouhle = 200–400 m² povrchu (ako aktívne uhlie). Drží vodu aj živiny.\n2. **CEC** (Cation Exchange Capacity) — biouhel viaže kationy (Ca²⁺, Mg²⁺, K⁺, NH₄⁺), pomaly ich uvoľňuje plodinám. **+30–80 % CEC** v piesčitých pôdach.\n3. **pH** — biouhel je mierne alkalický (pH 8–10) → **stabilizuje kyslé pôdy**, alternatíva vápnenia.\n4. **Mikrobiom** — póry biouhle sú ideálne „domovy\" pre pôdne baktérie a huby. **+30–60 % biomasy mikroorganizmov**.\n5. **Voda** — 1 t biouhle zadržiava **2–4 t vody** v pôde → ochrana proti suchu.\n6. **Sekvestrácia C** — 1 t biouhle = ~3 t CO₂ ekvivalent, stabilný 500+ rokov.\n\n**Aplikácia:**\n- **Dávka**: 1–10 t/ha (typicky 3–5 t/ha)\n- **Hĺbka**: 10–30 cm orbou alebo strip-till\n- **Aktivácia**: rozdrtiť + namočiť + zmiešať s kompostom 2–4 týždne pred aplikáciou (aby sa nasýtil bohatými živinami, nie hladovým dreveným uhlím)\n- **Frekvencia**: jednorázová alebo postupná (1 t/ha/rok)\n\n**Cena 2024:**\n- **Sypaný biouhel CZ**: 4 000–8 000 Kč/t\n- **Pelet (jednoduchšia aplikácia)**: 8 000–15 000 Kč/t\n- **Aktivovaný s mykorhizou (premium)**: 15 000–25 000 Kč/t\n- **Investícia na 1 ha**: 12 000–40 000 Kč\n\n**Návratnosť:**\n- **Výnosy**: typicky +5–20 % po 1–3 rokoch\n- **Úspora hnojív**: -10–25 % vďaka CEC\n- **Carbon credits**: 15–25 EUR/t CO₂ × 3 t CO₂/t biouhle = ~1 200 Kč/t biouhle dodatočne\n- **Návratnosť**: 5–10 rokov na biouhel samostatne, 3–5 rokov s carbon credity\n\n**V SR:**\n- **Sklizeň-Lanškroun** — najväčší výrobca, kapacita 5 000 t/rok\n- **Biochar.cz** — distribúcia, poradenstvo\n- **AGRIBO** — výrobca + carbon credit konzultant\n- **Pilotné projekty** na výskumných ústavoch (Bohunice, Lanžhot)\n\n**Limity:**\n- **Vstupná cena** vysoká, návrat až po rokoch\n- **Riziko aplikácie neaktivovaného uhlia** — „hladový\" biouhel **VÝRAZNE znižuje výnos prvej 1–2 roky** (saje vlastné živiny z pôdy)\n- **Meranie efektu** — viditeľné len po 3+ rokoch, predtým ťažko presaditeľné\n- **Pozor na kontaminanty** — biouhel z odpadovej biomasy môže obsahovať ťažké kovy, dioxíny. Vyžaduje certifikáciu EBC (European Biochar Certificate).\n\nPozri tiež [[organická-hmota]], [[regeneratívne-poľnohospodárstvo]], [[karbonové-poľnohospodárstvo]], [[ph-pôdy]], [[vápnenie]], [[hnojivo]].",
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
    "term": "Mykoríza",
    "alias": [
      "mykoríza",
      "symbióza húb a koreňov",
      "arbuskulárna mykoríza"
    ],
    "kategorie": "agrotechnika",
    "shortDef": "Mykoríza je symbióza medzi koreňmi rastlín a pôdnymi hubami. Huba zväčší pomocou svojich vlákien (hyf) saciu plochu koreňa 10–100×, rastlina za to dodáva hube cukry. Kľúčový faktor zdravia pôdy a výnosu.",
    "longDef": "Mykoríza (gréc. *mykes* + *rhiza* = huba + koreň) je **vzájomne prospešná symbióza medzi koreňmi rastlín a podzemnými hubami**. Vedecky opísaná 1885 (Albert Bernhard Frank), ale v praxi využívaná poľnohospodármi tisíce rokov (bez vedomia mechanizmu — Indiáni v Amazónii).\n\n**Princíp:**\n- **Huba** prerastá hustou sieťou vlákien (*hyf*) do pôdy, mnohonásobne **zväčšuje saciu plochu koreňa** (z ~1 m² na 100+ m²)\n- **Hyfy** sa dotýkajú koreňa rastliny a vytvárajú **arbuskuly** (košíčkové štruktúry) v koreňových bunkách — miesta výmeny\n- **Rastlina** dodáva hube **5–20 % svojej fotosyntézy** (cukry, glukózu)\n- **Huba** za to dodáva rastline **fosfor, dusík, mikroprvky** (najmä Zn, Cu) — oveľa efektívnejšie ako koreň sám\n\n**Typy mykorízy:**\n1. **Arbuskulárna mykoríza (AM)** — najbežnejšia, 80 % rastlín (pšenica, kukurica, sója, ovocné stromy). Huby z divízie *Glomeromycota*.\n2. **Ektomykoríza** — lesné stromy (dub, buk, smrek, borovica). Huby z divízie *Basidiomycota* (hríby, klouzky, ryzce).\n3. **Erikoidná mykoríza** — vresovité (čučoriedky, brusnice, vres).\n4. **Orchideoidná mykoríza** — orchidey. Symbióza úplne nevyhnutná pre klíčenie.\n\n**Bez mykorízy NERASTÚ:**\n- Vinič (takmer závislý)\n- Olivovník\n- Mnoho ovocných drevín\n- Niektoré orchidey\n\n**Slabo závislé (môžu bez):**\n- Kapustovité (repka, horčica, kapusta) — produkujú glukozinoláty, ktoré mykorízne huby zabíjajú\n- Niektoré jednoročné buriny\n\n**Výhody pre plodinu:**\n- **+30–80 % príjmu P** (fosfor je v pôde často viazaný v nedostupnej forme, hyfy ho rozpúšťajú)\n- **+20–40 % príjmu N** (najmä z organickej hmoty)\n- **+50–100 % príjmu vody** (väčšia sacia plocha)\n- **Tolerancia k suchu**: hyfy hľadajú vodu metre ďaleko\n- **Tolerancia k ťažkým kovom**: mykoríza chráni koreň\n- **Odolnosť k patogénom**: hyfy „blokujú\" cesty koreňovým patogénom (fuzarióza, pythiová hniloba)\n- **Výnos**: +5–30 % v stresových podmienkach\n\n**Čo mykorízu poškodzuje:**\n- **Orba a hlboké spracovanie pôdy** — fyzicky rozseká hyfovú sieť. **No-till** (pozri [[no-till]]) a strip-till (pozri [[strip-till]]) hyfy chránia.\n- **Minerálne hnojivá s vysokým P** — rastlina nepotrebuje hubu, symbióza zaniká.\n- **Fungicídy** v pôde (najmä metalaxyl, propiconazol) — niektoré špecifické na mykorízne huby.\n- **Kapustovité v rotácii** — produkujú glukozinoláty, mykoríza klesá.\n- **Holá pôda** (žiadny kryt) — hyfy odumierajú bez hostiteľa.\n- **Vápnenie príliš vysoké pH** — niektoré AM huby preferujú kyslé pH.\n\n**Mykorízne preparáty (komerčné inokulanty):**\n- **Symbivit** (CZ) — Mendelu, 1 000–2 000 Kč/kg\n- **Mykos** (CZ) — Symbiom (Lanškroun)\n- **Glomus intraradices** (zahraničné) — RhizoVital\n- **Aplikácia**: namoriť osivo, posypať do riadkov pri siatí, namáčať sadenice\n\n**Cena na hektár:**\n- Inokulácia osiva: 200–500 Kč/ha\n- Aplikácia do riadkov: 800–1 500 Kč/ha\n- ROI 1–3 roky (najmä v pôdach po dlhom orbe alebo po vysokých dávkach P)\n\n**Meranie mykorízy:**\n- **Mikroskopia koreňa** (farbenie) — laboratórne\n- **DNA test** (qPCR) — kvantifikácia AM húb v pôde\n- **Nepriame indikátory**: meranie P príjmu, sucho-tolerancia, výnos\n\n**V ČR výskum**: Mendelu Brno, ČZU Praha, ÚEB AV ČR — desiatky publikácií.\n\nPozri tiež [[regenerativne-polnohospodarstvo]], [[no-till]], [[strip-till]], [[organicka-hmota]], [[biouhel]], [[npk-hnojivo]].",
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
    "term": "TMR (Total Mixed Ration)",
    "alias": [
      "Total Mixed Ration",
      "totálna zmiešaná dávka",
      "zmiešaná kŕmna dávka"
    ],
    "kategorie": "chov",
    "shortDef": "TMR (Total Mixed Ration) je kŕmna technológia, kde sa všetky komponenty dávky (siláž, seno, koncentrát, minerály) zmiešajú v miešacom voze a kŕmia ako jednotná homogénna zmes. Štandard pre mliečne dojnice nad 25 l/deň.",
    "longDef": "TMR (anglicky *Total Mixed Ration*, „totálna zmiešaná dávka\") je **moderná kŕmna technológia pre dobytok**, kde sa všetky zložky kŕmnej dávky **zmiešajú do jednotnej homogénnej zmesi** v miešacom voze a kŕmia naraz. Štandardná prax pre produkčné mliečne stáda od 1990s.\n\n**Tradičné vs TMR kŕmenie:**\n| Tradičné | TMR |\n|----------|-----|\n| Komponenty zvlášť (siláž → seno → koncentrát) | Všetko zmiešané v 1 dávke |\n| Krava si vyberá | Nemôže selektovať |\n| Selektívny príjem = problém s acidózou | Vyrovnaná dávka |\n| Veľa práce (3–5× denne) | 1× denne rozdať, 1–2× prihrnúť |\n| Nižšia úžitkovosť | +5–15 % mliečna produkcia |\n\n**Komponenty typickej TMR pre vysokoprodukčnú kravu (40+ l mlieka/deň):**\n- **Kukuricová siláž**: 25–35 kg (sušina 30–35 %)\n- **Trávna siláž / senáž**: 5–10 kg\n- **Lucernová siláž / seno**: 3–6 kg (zdroj bielkovín a štrukturálnej vlákniny)\n- **Koncentrát / kŕmna zmes**: 8–12 kg (obilie, sójový extrahovaný šrot, repkový šrot)\n- **Cukrovarské rezky / pivovarské mláto**: 5–15 kg (vedľajšie produkty)\n- **Minerály + vitamíny**: 0,2–0,5 kg (Ca, P, Mg, Na, mikroprvky)\n- **Voda**: do vedra ad lib (nie v TMR)\n- **Celkovo**: 50–70 kg krmiva/kravu/deň (z toho 22–28 kg sušiny)\n\n**Kľúčové parametre kvality TMR:**\n- **Sušina** (DM — Dry Matter): 45–55 % (viac → kravy nepijú dosť; menej → fermentačné problémy)\n- **NDF** (Neutral Detergent Fiber): 28–34 % — štrukturálna vláknina pre prežúvanie\n- **NDF z píce** (forage NDF): min. 19 % — pre funkčnosť bachora\n- **NEL** (Net Energy Lactation): 6,8–7,2 MJ/kg DM\n- **CP** (Crude Protein): 16–18 %\n- **RUP** (Rumen Undegradable Protein): 35–40 % CP\n- **Dĺžka častíc** (Penn State Particle Separator):\n  - >19 mm: 5–15 % (štrukturálny efekt)\n  - 8–19 mm: 30–50 %\n  - 4–8 mm: 30–50 %\n  - <4 mm: <20 %\n\n**Miešacie vozy (Mixer Wagons / TMR Wagons):**\n- **Horizontálny šnek** (1, 2, 3 šneky) — Trioliet, Faresin, Strautmann\n- **Vertikálny šnek** (1, 2 šneky) — KUHN Profile, Storti, Sgariboldi — častejšie dnes\n- **Ťahané vs samojazdné** (samojazdné u stád > 500 kusov)\n- **Kapacita**: 8–30 m³ (1× nakŕmenie 50–300 kráv)\n- **Cena**: 800 tis. – 5 mil. Kč\n- **Hodnotí sa**: doba miešania, homogenita, dĺžka rezania (vertikálny šnek vie krátit dlhú siláž)\n\n**PMR vs TMR vs CMR:**\n- **TMR**: jedna univerzálna dávka pre celé stádo (alebo skupinu)\n- **PMR** (Partial Mixed Ration): základ zmiešaný + individuálne dokrmovanie v dojárni podľa výroby (= koncentrát na základe dát kravy)\n- **CMR** (Component Mixed Ration): tradičné oddelené kŕmenie komponentov (najstarší prístup)\n\n**Skupinové kŕmenie:**\nModerné stádo má **2–4 skupiny dojníc** s rôznou TMR:\n- **Vysokoprodukčné** (>35 l/deň): vysoká energia, vyšší koncentrát\n- **Stredne produkčné** (25–35 l/deň): štandardné\n- **Nízko produkčné** (<25 l/deň, neskorá laktácia): nižšia energia, viac píce\n- **Suché kravy / zaprahnuté**: len píce + minerály (transition diet 3 týždne pred pôrodom)\n\n**Náklady:**\n- **Krmivo**: 70–100 Kč/krava/deň (pre 30 kg sušiny)\n- **Práca**: -50 % oproti tradičnému (1× rozdať miesto 3–5×)\n- **Investícia do techniky**: amortizácia 1,5–3 Kč/krava/deň\n\n**Sledovanie spotreby:**\n- **Váha voza** pred a po kŕmení → spotreba na skupinu/kravu\n- **Refusal (odpad)** — to, čo kravy nezjedia, váži sa a sype na iné kravy alebo do bioplynu. 3–5 % refusal je normálne (= správne sa trafíte do potrieb).\n\n**Softvér pre plánovanie TMR:**\n- **TMR Tracker** (US) — sledovanie kvality\n- **NDS Professional** (IT) — výživové plánovanie\n- **Agralis CCT** (CZ) — dojárne + kŕmenie integrované\n- **CowVision** (NL) — full digital\n\nV ČR: ~80 % stád > 100 dojníc používa TMR (2024 data).\n\nPozri tiež [[dojarna]], [[kukurica-silazna]], [[lucerna]], [[siloky-balik]], [[otelenie]], [[rijnost]].",
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
    "term": "Otelenie",
    "alias": [
      "telenie",
      "pôrod kravy",
      "calving"
    ],
    "kategorie": "chov",
    "shortDef": "Otelenie je pôrod kravy. V prirodzenom cykle prebieha zhruba 280 dní po inseminácii. Kľúčový moment hospodárenia — začína laktácia (~305 dní), krava je najcitlivejšia na výživu a hygienu. Komplikácie tu rozhodujú o ekonomike celého chovu.",
    "longDef": "Otelenie (ľudovo *telenie*, odborne *partus*, anglicky *calving*) je **pôrod kravy** — vrcholný moment chovateľského cyklu. Štandardná gravidita hovädzieho dobytka trvá **280 ± 5 dní** (9 mesiacov).\n\n**Cyklus produkčnej kravy:**\n- **Deň 0**: otelenie, začiatok laktácie\n- **Deň 60–70**: optimálna inseminácia (zhruba 2. ruja po pôrode, pozri [[rijnost]], [[inseminacia]])\n- **Deň 280**: zaprahnutie (zastavenie dojenia 60 dní pred ďalším pôrodom) — obdobie regenerácie mliečnej žľazy\n- **Deň 340**: ďalšie otelenie → cyklus reštartuje\n\n**Pomocné merítka:**\n- **Medziobdobie** (calving interval): 365–400 dní = ideálne (kratšie = lepšia ekonomika)\n- **Servisná perióda** (od otelenia k inseminácii): 60–90 dní = optimálne\n- **Index oplodniteľnosti**: 1,5–2,5 inseminácií na zabreznutie = dobrý\n\n**Príznaky blížiaceho sa otelenia (24–48 h pred):**\n- **Vemeno** sa napĺňa, mliekom presakuje\n- **Vulva** zdurená, panvové väzy uvoľnené\n- **Hlien** z pošvy (žltý / hnedý)\n- **Zmena správania**: krava sa oddeľuje od stáda, nepokoj, obliezanie\n- **Pokles telesnej teploty** o 0,5–1 °C\n\n**Priebeh pôrodu (3 fázy):**\n1. **Otváracia fáza** (2–6 h): cervix sa otvára, krava cíti sťahy, vstáva a ľahá\n2. **Vypudzovacia fáza** (30 min – 4 h): aktívne tlačenie, vidíme „vodný vak\" (allantois), potom teľa prichádza (zvyčajne najprv predné nohy + hlava)\n3. **Placentová fáza** (do 12 h): vypudenie placenty (lôžka). Ak >12 h = **retentio placentae** = veterinárny problém\n\n**Komplikácie (dystocia):**\n- **Zlá poloha teľaťa** (zadná miesto prednej, hlava zavrhnutá, nohy stočené) — 5–8 % všetkých otelení\n- **Veľký plod** (oversized calf) — Belgické modré, Charolais (býk premetie kravu)\n- **Úzka panva** (malá krava s veľkým býkom)\n- **Slabé kontrakcie** (oslabená krava, hypokalciémia)\n- **Twins** (dvojčatá) — vyššie riziko komplikácií, často vyžaduje veterinára\n\n**Štatistika dystocií:**\n- **Holštýn**: 8–12 % otelení s asistenciou (ľahšie pôrody)\n- **Belgické modré**: 90+ % asistovaných (často cisársky rez!)\n- **Charolais, Limousin**: 15–25 % asistovaných\n- **Aberdeen Angus**: <5 % — „easy calving\"\n\n**Veterinárne zákroky:**\n- **Manuálna asistencia**: vytiahnutie rukami\n- **Fetotómia**: pôrodné laná, reťaze, vyťahovanie remeňom (do 50 kg ťahu)\n- **Cisársky rez**: nutný u úzkych panví alebo zlých polôh — 8 000–25 000 Kč\n- **Embryotómia**: rozdelenie mŕtveho plodu v maternici (zachráni matku)\n\n**Po otelení — kritické prvé týždne:**\n- **Kolostrum** (mlezivo) — prvé mlieko bohaté na protilátky. Teľa MUSÍ dostať min. 4 l do 6 h po pôrode (pasívna imunita).\n- **Hypokalciémia / mliečna horúčka** — 3–10 % kráv, krátko po otelení (Ca → mlieko). Lieči sa infúziou kalcia.\n- **Ketóza** — energetická deficiencia v rannej laktácii, chudnutie, ketolátky v moči. Prevencia: kvalitná TMR ([[tmr]]).\n- **Retentio placentae** (zadržaná lôžka) — riziko zápalu maternice → znížená plodnosť.\n- **Metritída** — zápal maternice, znižuje reprodukciu.\n- **Mastitída** — zápal vemena, časté prvých 30 dní.\n\n**Welfare požiadavky** (CZ normy):\n- **Oddelená telacia boxa** (calving pen) — min. 12 m², čisto, sucho, kľud\n- **Veterinárny dohľad** počas pôrodu\n- **Teľa a krava spoločne** min. 24 h po pôrode (pre pasívnu imunitu)\n- **Žiadne rutinné hormonálne indukcie pôrodov** (zakázané EÚ 2008)\n\n**Indikátory ekonomiky:**\n- **% živo narodených teliat**: 92–96 % = veľmi dobré\n- **% teliat prežívajúcich do 60 dní**: 90–95 %\n- **Náklady na 1 otelenie**: 1 500–8 000 Kč (asistencia, liek, čas)\n- **Hodnota teľaťa** (býček 50 kg živej hmotnosti): 8 000–15 000 Kč\n- **Hodnota teľaťa** (jalovica pre chov): 25 000–60 000 Kč\n\n**Synchronizácia pôrodov:**\n- **CIDR + PGF₂α** protokol (kontrolovaný cyklus) → narodenie teliat vo „vlnách\"\n- Výhody: organizácia práce, hromadná kúpa/predaj, monitoring\n- Nevýhody: vyššie fixné zaťaženie techniky a personálu počas vrcholov\n\nPozri tiež [[rijnost]], [[inseminacia]], [[jalovica]], [[usna-znamka]], [[dojarna]], [[tmr]].",
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
    "term": "Ruja (estrus)",
    "alias": [
      "ruja",
      "rujovosť",
      "estrus",
      "pohlavný cyklus"
    ],
    "kategorie": "chov",
    "shortDef": "Ruja je obdobie sexuálnej receptivity samice — u kravy trvá 12–24 h, opakuje sa každých 18–24 dní. Kľúčový moment pre insemináciu. Detekcia ruje (prirodzene alebo automatickými senzormi) určuje 80 % reprodukčného úspechu farmy.",
    "longDef": "Ruja (latinsky *estrus*, anglicky *heat*) je **obdobie, kedy samica cicavca je sexuálne receptívna a schopná oplodnenia**. U hovädzieho dobytka (kráv aj jalovíc — pozri [[jalovica]]) trvá 12–24 hodín a opakuje sa v **21-dňovom cykle** (18–24 dní v norme).\n\n**Cyklus kravy (21 dní priemerne):**\n- **Deň 0**: ruja (estrus) — 12–24 h\n- **Deň 1**: ovulácia 24–30 h po začiatku ruje\n- **Deň 5–17**: luteálna fáza (corpus luteum produkuje progesterón) — bránenie ďalšej ruji\n- **Deň 18–19**: luteolýza (rozpad corpus luteum)\n- **Deň 20–21**: nová ruja, cyklus reštartuje\n- **Ak gravidita**: corpus luteum prežíva → žiadna ďalšia ruja 280 dní\n\n**Príznaky ruje:**\n1. **Standing heat** (= kľúčový príznak): krava stojí nehybne, keď na ňu naskakuje iná krava. **Trvá 4–18 h** v rámci celkovej ruje. **Jediný 100% spoľahlivý** príznak.\n2. **Mounting** (naskakovanie na ostatné kravy) — začiatok ruje\n3. **Hlieny**: čistý, lepkavý hlien z vulvy\n4. **Vulva**: začervenaná, mierne zdurená\n5. **Nekľud**: viac chôdze (až 4× normálna vzdialenosť), bučanie, znížený príjem krmiva\n6. **Pokles úžitkovosti mlieka**: −10 až −30 % na 1 deň\n\n**Tichá ruja (silent heat):**\n30–40 % kráv (najmä v rannej popôrodnej dobe alebo pri tepelnom strese v lete) **nevykazuje viditeľnú ruju**, ale ovulácia prebieha. **Riziko**: ručne sa nedá detekovať, krava „neoplodnená\" 60+ dní → ekonomická strata 50–100 Kč/deň.\n\n**Detekcia ruje — metódy:**\n\n**1. Vizuálne pozorovanie** (tradičné):\n- 2× denne po 20 min = záchyt **45–55 %** rují\n- 3× denne po 30 min = záchyt **65–75 %** rují\n- Náročné na čas, podlieha ľudskej chybe\n\n**2. Detekčné pomôcky:**\n- **Heat mount detector** (Kamar) — farebný lepiaci čip na sakrum, mení farbu pod tlakom naskakujúcej kravy. **Lacné** (50–100 Kč/kus), spoľahlivosť ~80 %.\n- **Kriedový sprej** na sakrum — nový sprej každý deň, zmytie = pozn. ruje\n- **Estrotect patches** — kombinácia tlakovej a farebnej detekcie\n\n**3. Senzory (precision livestock farming):**\n- **Aktivometer** (pedometer) — krokomer na nohe, ruja = +50–100 % krokov\n- **Akcelerometer** na obojku — chov-detekcia + pozn. fyzickej aktivity\n- **CowManager SensOor** — kvantifikácia ruminácie, príjmu, aktivity\n- **Allflex Heatime** — kombinovaný systém\n- **DeLaval BCS Camera** — kamera + AI detekcia\n- **Cena**: 2 000–5 000 Kč/krava (jednorazová) + 30–80 Kč/mesiac softvér\n- **Spoľahlivosť**: 90–98 % detekcia, menej false positives\n\n**4. Hormonálne meranie (lab):**\n- **Progesterón v mlieku** — denne alebo 3× týždenne. Pokles progesterónu = ruja.\n- **Rapid Milk Progesterone Test** (RMPT) — pásik 30 min, 50 Kč/test\n\n**Inseminácia načasovanie:**\n- **AM/PM pravidlo**: ruja ráno → inseminovať popoludní; ruja večer → inseminovať ráno\n- **Ovulácia** je 24–30 h po začiatku ruje\n- **Spermie** prežívajú 12–24 h v maternici\n- **Vajíčko** prežíva len 6–10 h po ovulácii\n- **Optimálne okno**: 6–18 h od začiatku ruje (12 h pred ovuláciou)\n\n**Synchronizácia ruje** (riadená reprodukcia):\nHormonálne protokoly pre **vyvolanie ruje v skupine naraz** — uľahčí insemináciu, plánovanie pôrodov, monitoring:\n\n- **PGF₂α** (Prostaglandín) — 2 injekcie v 14-dňovom rozstupe. Lacné, 80–85 % synchronizácia.\n- **Ovsynch** — 7-dňový protokol s GnRH + PGF + GnRH + AI. Vyššia spoľahlivosť ~70 %.\n- **CIDR / PRID** (intravaginálny progesterón) + GnRH + PGF — pre kravy s nepravidelnou cyklickou\n\n**Anestrus** (chýbajúci cyklus):\n- Po pôrode 30–60 dní normálne (= **postpartum anestrus**)\n- Ak > 90 dní → patológia:\n  - **Cyklický anestrus**: ovariálny problém\n  - **Anestrický anestrus**: nedostatok živín, ketóza (pozri [[otelenie]])\n  - **Persistentné žlté teliesko**: zriedkavo, riešenie PGF₂α\n\n**Ekonomický dopad detekcie ruje:**\n- **Detekcia 95 %** (senzory): medzidoba 380 dní, +200 l mlieka/krava/rok = +6 000 Kč\n- **Detekcia 50 %** (manuálne): medzidoba 430 dní, strata 50 dní × 100 Kč/deň = -5 000 Kč/krava/rok\n\nPozri tiež [[inseminácia]], [[otelenie]], [[jalovica]], [[dojárňa]], [[tmr]].",
    "related": [
      "inseminace",
      "oteleni",
      "jalovice",
      "dojirna"
    ]
  },
  {
    "slug": "inseminace",
    "term": "Umelá inseminácia",
    "alias": [
      "AI",
      "umelá inseminácia",
      "IZR umelé oplodnenie"
    ],
    "kategorie": "chov",
    "shortDef": "Umelá inseminácia je metóda reprodukcie, pri ktorej sa semeno vybraného plemenného býka zmrazené skladuje a dávkovane aplikuje do maternice kravy v období ruje. Štandardný postup v modernom chove (>95 % v CZ).",
    "longDef": "Umelá inseminácia (AI, *artificial insemination*) je **metóda reprodukcie hospodárskych zvierat**, pri ktorej sa získané a zmrazené semeno plemenného samca aplikuje do maternice samice **bez priameho párenia**. Štandardná prax v modernom chove hovädzieho dobytka, ošípaných, oviec, kôz.\n\n**História:**\n- **1779** — taliansky fyziológ Lazzaro Spallanzani úspešne inseminoval sučku\n- **1899** — Ruský vedec Ilja Ivanovič Ivanov prvý AI u koní a kráv\n- **1949** — Polge a Smith objavili **kryoprotektant glycerol** pre mrazenie spermatu\n- **1950s** — zavedenie mrazeného semena v USA a EÚ\n- **1960s** — masové rozšírenie v CZ (Veľký kus, Inseminačná stanica Stadlec)\n\n**Princíp:**\n\n**1. Získanie semena od býka:**\n- **Umelá pošva** (artificial vagina) — býk skočí na atrapu (fantóm) alebo cvičnú kravu, semeno sa zachytí do sklenenej nádobky\n- **Elektroejakulácia** — pre problematické býky alebo pri ochorení\n- **Frekvencia**: 2× týždenne, 1–2 ejakuláty na sedenie\n- **Objem 1 ejakulátu**: 5–10 ml, ~1 miliarda spermií\n\n**2. Hodnotenie a zriedenie:**\n- **Mikroskopická kontrola**: motilita (pohyb), morfológia (tvar), koncentrácia\n- **Zriedenie** v krmiči (vaječný žĺtok + glycerol + citrátový pufor)\n- **Rozdelenie do dávok**: typicky 20–30 mil. spermií / dávku (= 1 inseminácia)\n- **Jeden ejakulát → 200–500 dávok**\n\n**3. Mrazenie:**\n- **Pejety (straws)** — slamky 0,25 ml, plastové, farebne kódované podľa býka\n- **Ochlazovanie postupne**: 22 °C → 4 °C → -100 °C → -196 °C (kvapalný dusík)\n- **Skladovanie v dewaru s LN₂** (kvapalný dusík)\n- **Doba skladovateľnosti**: prakticky neobmedzená (50+ rokov preukázateľne)\n\n**4. Inseminácia kravy (poľnohospodár alebo inseminačný technik):**\n- **Termín**: 6–18 h od začiatku ruje (pozri [[rujnosť]])\n- **Rozmrazenie pejety**: 35 °C, 45 sec vo vodnom kúpeli\n- **Aplikácia**:\n  - Inseminátor zavádza inseminačnú pištoľ **cez pošvu, cervix, do tela maternice** (asi 20 cm hĺbky)\n  - Jednu ruku má v konečníku — palpuje cervix a vedie pištoľ\n  - Vstrekne celý objem (0,25 ml) do maternice\n- **Dĺžka úkonu**: 30 sec – 2 min na skúseného inseminátora\n\n**Vzdelanie inseminátora v ČR:**\n- **Lekári veterinárnej medicíny** (VŠ) — bez obmedzenia\n- **Zoológovia / agronómovia** — špeciálny kurz „Inseminačný technik\"\n- **Sami poľnohospodári** — kurz „Vlastná inseminácia\" (približne 40 h), potom licencia iba pre vlastné stádo (NE pre insemináciu cudzích kráv)\n\n**Ekonomika a prax:**\n\n**Cena 1 dávky semena (2024):**\n- **Štandardná genetika**: 200–400 Kč/dávka\n- **Top genetika** (Top 100 USA TPI): 600–1 500 Kč\n- **Sexované semeno** (90 % jaloviek): 1 200–2 500 Kč\n- **Embryotransfer línie**: 5 000–25 000 Kč\n- **Cena za 1 zabreznutie** (1,8 dávky priemerne): 360–2 700 Kč\n\n**Konkurencia — prírodné párenie (býk v stáde):**\n- **Plusy**: 95 % zabreznutí, žiadne náklady na inseminátora, netreba detekovať ruju\n- **Mínusy**: 1 býk = 1 genetická línia (vs 20+ AI variant), riziko zranenia kravy/býka, zoonózy, geneticky priemerní býci\n\n**V ČR 2024:**\n- ~98 % mliečnych kráv inseminovaných (takmer všetky)\n- ~75 % mäsových kráv inseminovaných (zvyšné prírodné párenie)\n- **Inseminačné stanice**: VŠM (Veľký Šariš), Plemenári Lhota, GeneTPlus, Bohemia Plus\n- **Importované semena**: 60 % US Holstein, 20 % CZ genetika, 20 % EU genetika\n\n**Sexované semeno (sex-sorted):**\n- **Princíp**: spermie X (jalovice) a Y (býčkovia) sortované prietokovou cytometriou (DNA množstvo v hlavičke X je ~3,8 % vyššie)\n- **Spoľahlivosť**: 90 % požadovaného pohlavia\n- **Nižšia motilita** — typicky 30 mil. spermií/dávka (vs 25 mil. konv.)\n- **Cena**: 1 200–2 500 Kč/dávka\n- **Použitie**: ranné jalovice (zaručené jalovice pre chov), top kravy pre chovné línie\n\n**Embryotransfer (ET):**\n- **Vyššia úroveň genetiky**: super-ovulácia top kravy → embryotransfer do recipientných kráv\n- **Princíp:**\n  1. Top kráva-donor: hormonálna stimulácia (FSH 4 dni)\n  2. Inseminácia top býkom\n  3. Embryá (7 dní staré) vypláchnuté z maternice\n  4. Presadenie do 5–10 recipientných kráv (synchronizovaných)\n- **Cena**: 50 000–150 000 Kč na 1 cyklus\n- **Top kráva** generuje 6–10 teliec ročne namiesto 1 (oproti prirodzenému)\n\nPozri tiež [[rujnosť]], [[otelenie]], [[jalovice]], [[ušná-známka]], [[dojírna]].",
    "related": [
      "rijnost",
      "oteleni",
      "jalovice",
      "usni-znamka"
    ]
  },
  {
    "slug": "jalovice",
    "term": "Jalovica",
    "alias": [
      "heifer",
      "jalovka",
      "sirka"
    ],
    "kategorie": "chov",
    "shortDef": "Jalovica je samica hovädzieho dobytka od narodenia do prvého otelenia — typicky 0–24 mesiacov. Kľúčová investícia chovu (12–18 mes. odchovu bez výroby), genetický potenciál novej generácie. Po prvom otelení sa z nej stáva „prvotelka\" (krava).",
    "longDef": "Jalovica (ľudovo *jalovka*, dialekt *sirka*, anglicky *heifer*) je **samica hovädzieho dobytka od narodenia do prvého otelenia**. Po prvom otelení už nie je jalovica ale **krava** (cow), konkrétne „prvotelka\" (= primipara). Doba odchovu jalovice je **kľúčovou investíciou** chovu — 22–24 mesiacov nákladov bez výroby mlieka.\n\n**Fázy odchovu jalovice:**\n\n**1. Teľa (calf) — 0–2 mesiace:**\n- **Hmotnosť narodenia**: 35–45 kg (holštýn), 25–35 kg (jersey), 40–50 kg (charolais)\n- **Kolostrum (mlezivo)**: 4 l do 6 h po pôrode — KRITICKÉ pre pasívnu imunitu (teľa nemá vrodenú imunitu)\n- **Kŕmenie mliekom**: 6–8 l/deň, 2× denne\n- **Stajňa**: jednotlivé boxy (calf hutch) prvé 4–8 týždňov, potom v skupine\n- **Sušené krmivá**: úvod jadra a sena od 2. týždňa\n- **Odstav** (weaning): 6–10 týždňov, postupné znižovanie mlieka\n\n**2. Teľa v odstave — 2–6 mesiacov:**\n- **Hmotnosť**: 70–150 kg\n- **Kŕmenie**: jadro (1–2 kg/deň), kvalitné seno ad lib, voda\n- **Rast**: cieľ **0,8 kg/deň** (holštýn)\n- **Sociálna skupina**: 4–10 teliat rovnakej vekovej kategórie\n- **Odrohovanie** (8 týždňov) — anestézia + lokál\n- **Prvé ošetrenie**: parazitológia, vakcinácia (BVD, IBR, salmonelóza)\n\n**3. Mladá jalovica — 6–12 mesiacov:**\n- **Hmotnosť**: 150–300 kg\n- **Kŕmenie**: kvalitná trávna siláž + 1–2 kg jadra\n- **Rast**: cieľ 0,75 kg/deň\n- **Stajňa**: skupinový kotec, 4–6 m²/kus\n- **Pohyb**: pastva v lete (vhodné pre odchov)\n\n**4. Inseminačná jalovica — 12–18 mesiacov:**\n- **Hmotnosť**: 350–450 kg (cieľovo 380–420 kg pre holštýn pred insemináciou)\n- **Pohlavná zrelosť**: ~10–12 mesiacov (puberta), ale nie skôr ako 14 mesiacov sa inseminuje\n- **Optimálna inseminácia**: 15 mesiacov veku, 380 kg hmotnosť\n- **Cieľ otelenia**: 24 mesiacov veku (vs v staršej praxi 28–32 mes.) — **mladšie otelenie = lepšia ekonomika**\n\n**5. Brezivá jalovica (in-calf heifer) — 15–24 mes.:**\n- **Gravidita**: 280 dní (9 mes.)\n- **Kŕmenie**: rovnaké ako mladá jalovica + posledný trimester +20 % energie\n- **Hmotnosť pri otelení**: 550–650 kg (holštýn)\n- **Stajňa**: kravový kotec (= pripravuje sa na laktačnú skupinu)\n\n**Náklady odchovu jalovice (CZ 2024):**\n- **Kŕmenie** (22 mes.): ~22 000 Kč\n- **Veterina, liečivá**: ~3 000 Kč\n- **Inseminácia**: ~500 Kč\n- **Práca, energia, voda**: ~6 000 Kč\n- **Amortizácia stajní**: ~4 000 Kč\n- **Celkovo**: ~35 000 Kč na 1 jalovicu do prvého otelenia\n\n**Hodnota jalovky / jalovice:**\n- **Narodená jalovka** (z top genetiky): 5 000–15 000 Kč (len ako teľa)\n- **Brezivá jalovica** pripravená k oteleniu: **50 000–80 000 Kč**\n- **Top genetická chovná jalovica** (NA-3+, Top 100 BBA): 80 000–250 000 Kč\n- **Embryová jalovica** (z ET): 100 000–500 000 Kč\n\n**Sexované semeno** (pozri [[inseminácia]]):\n- **Štandardná inseminácia**: 50 % jalovky / 50 % býčky\n- **Sexed semen**: 90 % jalovky\n- **Strategická aplikácia**: top 25 % kráv stáda dostane sexed semen (= zaručené jalovky pre chov), spodných 25 % dostane mäsovú genetiku (= cross-bred teľa pre mäso, predá sa za 12–20 tis. Kč)\n\n**Welfare a problémy:**\n- **Prvé otelenie**: dystocia (ťažký pôrod) častejšia než u dospelých kráv (15 % vs 8 %)\n- **Odporúčaná panva**: zmerať perineum a panvu rektálne → vylúčiť extrémne úzke\n- **Prvá laktácia**: 75 % výroby dospelej kravy. Plný potenciál až 3. laktácia.\n\n**Genetický pokrok:**\n- Jalovica = **nová generácia** stáda\n- Ak máte top 10 % kráv = odporúčané top semeno + ET → maximálne zlepšenie\n- Spodných 30 % stáda = mäsová genetika (genetická slepá ulička)\n\n**Starnúce stádo:**\n- Priemerný vek kravy v CZ stádach: **3,5 laktácie** (= 5–6 rokov)\n- **Cyklus**: 30–35 % jalovíc ročne vstupuje do stáda ako prvotelky, 30–35 % kráv odchádza (kanibalizmus alebo predaj)\n\n**„Sirka\"** — slovenský / valašský dialekt pre jalovicu, dnes regionálne v Morave.\n\nPozri tiež [[otelenie]], [[rujovosť]], [[inseminácia]], [[ušná značka]], [[tmr]], [[dojárňa]].",
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
    "term": "Ušná známka",
    "alias": [
      "ušnice",
      "ear tag",
      "identifikačná známka",
      "IZR značenie"
    ],
    "kategorie": "chov",
    "shortDef": "Ušná známka je plastová identifikačná visačka aplikovaná do ucha hospodárskeho zvieraťa povinná v EÚ. Skot, ovce, kozy, prasatá. Obsahuje individuálny kód napojený na IZR (Integrovaný poľnohospodársky register) — bez nej zviera nesmie opustiť farmu ani ísť na jatka.",
    "longDef": "Ušná známka (anglicky *ear tag*, oficiálne **identifikačná známka**) je **plastová visačka** s individuálnym kódom, ktorú EÚ legislatíva vyžaduje pre všetky hospodárske zvieratá (skot, ovce, kozy, prasatá, kone) ako súčasť **registračného systému zvierat**. V SR je viazaná na **IZR — Integrovaný poľnohospodársky register** spravovaný SZIF.\n\n**Legislatívny rámec:**\n- **EÚ nariadenie 1760/2000** — povinnosť identifikácie skotu (po BSE kríze)\n- **EÚ 21/2004** — ovce a kozy\n- **EÚ 1/2005** — prasatá\n- **SR zákon 154/2000 Z.z.** o plemenitbe\n- **SR vyhláška 136/2004 Z.z.** — technické prevedenie známok\n\n**Čo je na ušnej známke:**\n\n**Skot — dve známky (povinne do 7 dní po pôrode):**\n- **Veľká plastová známka** (žltá, asi 8 × 6 cm) v ľavom uchu\n- **Malá kovová / plastová známka** v pravom uchu (záloha pre prípad straty veľkej)\n- **Obsah**:\n  - **SK** (kód štátu)\n  - **9-miestne individuálne číslo zvieraťa** (napr. *SK 123 456 789*)\n  - **Logo zvieraťa / IZR**\n  - **Voliteľne**: meno chovateľa, výstroj farmy, RFID chip (HDX 134,2 kHz)\n\n**Prasatá:**\n- **1 ušná známka** s číslom hospodárstva (nie individuálne)\n- Alebo **tetovanie** (tetovacie vyznačovacie kliešte v ľavom uchu)\n- Pri prevoze do iného hospodárstva: nová známka\n\n**Ovce, kozy:**\n- **2 známky** (ako skot), jedna z nich obsahuje RFID\n- Pre **elektronickú identifikáciu** v moderných ovčiarňach\n\n**RFID elektronická identifikácia:**\n- **HDX (Half Duplex)** vs **FDX-B (Full Duplex)** — štandardy\n- **Frekvencia**: 134,2 kHz (ISO 11784/11785)\n- **Čítací dosah**: 10–40 cm (statické čítačky), 1–3 m (anténne brány)\n- **Použitie**:\n  - Automatické kŕmenie v dojírni (= iná dávka koncentrátu pre každú kravu)\n  - Váženie v priechode (auto-record do databázy)\n  - Mliečne dojíce roboty (Lely, DeLaval)\n  - Zber dát o aktivite (CowManager, Allflex Heatime)\n\n**Aplikácia ušnej známky:**\n- **Špeciálne kliešte** (tagger) — jednorazové alebo opakovane použiteľné (Allflex, Datamars, Caisley)\n- **Miesto aplikácie**: dolná tretina ucha, medzi 2 cievami (vyhneme sa krvácaniu)\n- **Hygiena**: dezinfekcia klieští medzi zvieratami\n- **Bolestnosť**: krátke pichnutie, do 30 sec upokojenie zvieraťa\n\n**Strata známky:**\n- **Skot**: ~3–8 % ročne (zaháčik sa o stajňu, ostatné kravy)\n- **Postup**: chovateľ zistí stratu, objedná **náhradnú známku** od SZIF/IZR (rovnaké individuálne číslo), nasadí ju do 7 dní\n- **Cena 1 známky** (2024): 25–50 Kč skot, 8–15 Kč ovce\n- **Ročné náklady na známky** pre stádo 100 kráv: ~1 500–3 000 Kč\n\n**Sankcie za chýbajúce známky:**\n- **Skot bez známky nesmie opustiť farmu** (= nemôže ísť na jatka, predaj)\n- **SZIF kontrola** — 1× ročne, pokuta 10 000–500 000 Kč\n- **Dotácie BISS / CISS** závislé na riadnej identifikácii\n- **Riziko AVI / SBV** epidémie — neidentifikované zviera nemožno trasovať\n\n**IZR — Integrovaný poľnohospodársky register:**\n- **Databáza**: čísla zvierat + história pohybov + farmári + jatka\n- **Pohyb zvieraťa** = nahlásiť IZR do 7 dní (pôvod + cieľ)\n- **Otelenie** = nahlásiť do 7 dní (iné číslo pre teľa + matka)\n- **Úhyn / porážka** = nahlásiť do 7 dní\n- **Online systém**: portal.szif.cz, mobilná aplikácia „IZR mobile\"\n\n**XML hromadné exporty z IZR:**\nProfi farmy používajú **XML export pre hromadné hlásenie** presunov (napr. po zbere jater alebo presun kráv medzi stajňami):\n- Generuje sa z management softvéru (CowVision, AgroTronic)\n- Nahraje sa na portál SZIF\n- Validácia XSD schémy, chyby online\n\n**Pasporty (Cattle Passport / Identifikačná karta):**\n- **Skot**: každé zviera má vlastnú **identifikačnú kartu** vystavenú SZIF s históriou pohybov\n- **Karta je papierová**, vystavená s prvou registráciou, dopĺňa sa presuny\n- **Pas musí cestovať so zvieraťom** pri transporte (riskuje vodič prepravy)\n\n**Moderný vývoj — biometrika:**\n- **Bolusy** (RFID v bachore, polykané zvieraťom) — Mottainai, Cowtronix\n- **Retinálne skenovanie** — Vision Pro (USA) — bezdotyková ID\n- **Obličajová identifikácia** (AI) — DeLaval BCS Camera\n- Tieto technológie zatiaľ nie sú EÚ legálnym nahradením visačkou, len doplnkom.\n\n**Tetovanie / freeze branding:**\n- Predtým používané (pred EÚ 1760/2000), dnes len u koní a v niektorých USA chovoch\n- **Bolestivé**, dnes v EÚ väčšinou nahradené visačkami.\n\nPozri tiež [[otelenie]], [[inseminácia]], [[jalovice]], [[lpis]], [[dojírna]].",
    "related": [
      "oteleni",
      "inseminace",
      "jalovice",
      "lpis"
    ]
  },
  {
    "slug": "krmne-davky",
    "term": "Kŕmne dávky",
    "alias": [
      "krmivá pre hovädzí dobytok",
      "výživa hovädzieho dobytka",
      "feed ration"
    ],
    "kategorie": "chov",
    "shortDef": "Kŕmna dávka je denné množstvo krmiva pre hospodárske zviera, vyvážené podľa energie, bielkovín, vlákniny a minerálov. Pre vysokoprodukčnú dojnicu 50–70 kg krmiva (22–28 kg sušiny). Plánovanie je veda — chyba = stratená laktácia alebo zdravotný problém.",
    "longDef": "Kŕmna dávka (anglicky *ration*, *diet*) je **denné množstvo a zloženie krmiva** pre hospodárske zviera, vypočítané podľa jeho **produkčného štádia, hmotnosti a klímy**. Cieľom je zabezpečiť **maximálnu úžitkovosť pri ekonomickom kŕmení**.\n\n**Komponenty dávky pre hovädzí dobytok:**\n\n**1. Píce (forage) — štrukturálna vláknina:**\n- **Trávna siláž / senáž**: NDF 50–60 %, NEL 5,8–6,4 MJ/kg DM\n- **Kukuricová siláž**: NDF 38–45 %, NEL 6,4–7,0 MJ/kg DM, vysoká energia zo škrobu\n- **Lucernová siláž**: NDF 40–48 %, CP 19–22 %, vysoký Ca\n- **Seno**: NDF 55–65 %, doplnok pre štruktúru, „scratch factor\" pre bachor\n- **Slama**: NDF 75–85 %, nízka energia, pre extenzívne chovy alebo zaprahlé kravy\n\n**2. Koncentráty (jadro) — energia a bielkoviny:**\n- **Pšenica, jačmeň, kukurica (zrno)**: NEL 8,3–8,7 MJ/kg DM, CP 9–13 %, vysoký škrob\n- **Sójový extrahovaný šrot (SES)**: CP 45–48 %, vyvážený aminokyselinový profil\n- **Repkový extrahovaný šrot (ŘES)**: CP 36–38 %, lacnejší než SES, slightly nižšia kvalita\n- **Slnečnicový šrot**: CP 32–38 %, vysoká vláknina\n- **Sušené pivovarské mláto**: CP 24–28 %, NEL 7,0 MJ\n- **DDGS** (suchý destilátorský zvyšok): CP 28–30 %, NEL 7,2 MJ — vedľajší produkt z bioetanolu\n\n**3. Vedľajšie produkty / By-products:**\n- **Cukrovarské rezky**: čerstvé (vlhké) 8 % CP, NEL 6,9 MJ\n- **Pivovarské mláto**: 25 % CP, NEL 6,5 MJ\n- **Sója okara**: 26 % CP, NEL 6,8 MJ\n- **Pomarančové šupky (CR)**: vysoký cukor, NEL 7,5 MJ\n- **Voda po výrobe syra (whey)**: tekutina, nízka hodnota\n\n**4. Minerály a vitamíny:**\n- **Ca**: 0,8–1,0 % suš. (mlieko obsahuje Ca, vysoká potreba)\n- **P**: 0,4–0,5 % suš.\n- **Mg**: 0,2–0,3 % suš. (prevencia tetanie pastvy)\n- **Na (soľ)**: 0,2 % suš.\n- **K**: 1,0–1,5 % suš.\n- **Mikroprvky**: Zn 60–80 ppm, Cu 15–20 ppm, Se 0,3 ppm, I 0,8 ppm\n- **Vitamín A**: 100 000 IU/deň\n- **Vitamín D₃**: 40 000 IU/deň\n- **Vitamín E**: 500 mg/deň\n\n**Typové dávky:**\n\n**Vysokoprodukčná dojnica (45+ kg mlieka/deň, 700 kg živej hmoty):**\n- 28 kg kukuricovej siláže\n- 18 kg trávnej siláže\n- 4 kg lucernovej senáže\n- 9 kg jadra (mix obilnín)\n- 3 kg SES\n- 1,5 kg cukrovarské rezky\n- 0,4 kg minerály\n- **Celkovo**: 64 kg krmiva, ~26 kg sušiny\n- **Cena**: ~95 Kč/kus/deň\n\n**Stredne úžitková (30 kg mlieka/deň):**\n- 25 kg kukuricovej siláže\n- 15 kg trávnej siláže\n- 6 kg jadra\n- 2 kg SES\n- **Cena**: ~70 Kč/kus/deň\n\n**Zaprahlé kravy (suché, 60 dní pred otelením):**\n- 30 kg trávnej siláže alebo senáže\n- 4 kg sena (vláknina pre bachor)\n- 1 kg minerálna zmes „dry cow\"\n- **Cena**: ~30 Kč/kus/deň\n- **Cieľ**: minimálna energia, max štruktúra, prevencia mliečnej horúčky\n\n**Žírny býk (intenzívny výkrm, 400–700 kg):**\n- 12 kg kukuricovej siláže\n- 4 kg sena\n- 5 kg jadra\n- 0,5 kg SES\n- 0,2 kg minerály\n- **Cieľ**: 1,2 kg prírastku/deň\n- **Cena**: ~50 Kč/kus/deň\n\n**Teľa v odstave (3 mes.):**\n- 0,8 kg teľacia kŕmna zmes\n- 0,3 kg sena\n- Plný prístup vody\n- **Cena**: ~25 Kč/kus/deň\n\n**Kľúčové parametre:**\n\n**Sušina (DM)**: 22–28 kg/deň pre kravu = 3,5–4,5 % živej hmotnosti\n**Energia (NEL)**:\n- Dojnica (začiatok laktácie): 7,2 MJ/kg DM (vysoká koncentrácia)\n- Dojnica (neskorá laktácia): 6,5 MJ/kg DM\n- Suché kravy: 5,2 MJ/kg DM\n\n**Crude Protein (CP)**:\n- Vysoká úžitkovosť: 17–18 %\n- Stredná: 15–16 %\n- Suché: 12–13 %\n\n**RUP (Rumen Undegradable Protein)**: 35–42 % CP = bielkovina prejde nedegradovaná cez bachor, vstrebá sa v tenkom čreve = vyššia úžitkovosť\n\n**NDF (Neutral Detergent Fiber)**: 30–34 % DM = štrukturálna vláknina, nie moc (= acidóza), nie málo (= podštrukturálna strava)\n\n**Softvér pre plánovanie:**\n- **NDS Professional** (IT) — svetový štandard\n- **CPM-Dairy** (USA)\n- **Spartan Dairy** (USA)\n- **AMTS Cattle Pro** (USA)\n- **DAIRY-X** (CZ) — domáce riešenie\n- **Agralis CCT** (CZ) — full farm management vrátane kŕmenia\n\n**Sledovanie:**\n- **Spotreba** váženie vstup vs odpad = skutočný príjem\n- **BCS** (Body Condition Score) — 1–5 stupeň výživného stavu\n- **Mliečny profil** — bielkoviny, tuk, urea, somatické bunky → laboratórna analýza kravy mlieko 1× mes.\n- **Bachorové pH** — sonda u problémových stád\n\n**Kŕmenie a ekonomika:**\n- **Krmivo** = **60–70 % nákladov na mlieko**\n- **Optimalizácia dávky** = 1 Kč/kravu/deň úspory × 365 dní × 100 kráv = **36 500 Kč/rok**\n- Konzultácia nutricionistu (1–3 tis. Kč/mes.) sa typicky vyplatí\n\nPozri tiež [[tmr]], [[kukurica-silážna]], [[lucerna]], [[otelenie]], [[rujovosť]], [[silážne balíky]].",
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
    "term": "Kombajnér",
    "alias": [
      "kombajnista",
      "vodič kombajnu",
      "zberač"
    ],
    "kategorie": "slang",
    "shortDef": "Kombajnér je hovorové označenie pre vodiča zberacieho kombajnu počas žatvy. V profesijnej hierarchii farmy najviditeľnejšia a najnáročnejšia pozícia — pracuje 12–16 h/deň po dobu 2–6 týždňov zberu.",
    "longDef": "Kombajnér (kombajnista, vodič kombajnu) je **hovorové označenie pre vodiča zberacieho kombajnu**. Nie je to oficiálny profesijný titul (formálne „operátor poľnohospodárskych strojov\" alebo „vodič samojazdných strojov\"), ale v poľnohospodárskej komunite plne zavedený výraz.\n\n**Pozícia na farme:**\n- **Sezónna intenzita** — počas žatvy (júl–september) pracuje 12–16 h/deň, často 7 dní v týždni\n- **Mimo sezónu** — obvykle vodič traktora, mechanik, údržbár, alebo má inú prácu na statku\n- **Plat** — v sezóne 50 000–100 000 Kč/mesiac (intenzita), mimo sezónu 35 000–60 000 Kč/mesiac (prepočet na hodiny ~40–60 Kč/h pred zdanením + dohodnuté úkolové bonusy)\n\n**Čo sa od kombajnéra očakáva:**\n- **Technické zručnosti**:\n  - Nastavenie kombajnu pre danú plodinu (mlátička, rošty, ventilátor, žacia lišta výška)\n  - Údržba (mazanie, kontrola olejov, výmena nožov, remeňov)\n  - Diagnostika porúch (displej kombajnu, hydraulika, elektronika)\n  - Spojenie mechanika + vodiča v jednom\n\n- **Agronomický cit**:\n  - Posúdenie správnej vlhkosti obilia (vlhkomer v kombajne vs vlastný pocit)\n  - Optimálna výška seče (ozim 12–15 cm, sója 5–8 cm, repka 25–35 cm)\n  - Kedy zastaviť (ráno za rosy = mokré obilie, večer = stratené hodiny)\n  - Reakcia na polehlé obilie (znížiť rýchlosť, žacia lišta nižšie)\n\n- **Logistika**:\n  - Koordinácia s odvozom (návěs musí byť pri kombajne v plnom zásobníku)\n  - Komunikácia s vedúcim farmy cez vysielačku\n  - Plánovanie presunov medzi poliami\n\n- **Vytrvalosť**:\n  - Sezóna začne ozimnou pšenicou (polovica júla)\n  - Pokračuje repkou, jačmeňom\n  - Vrcholy v auguste — kukurica, slnečnica\n  - Koniec v septembri — sója, slnečnica\n  - **Celkovo 6–10 týždňov s minimom voľna**\n\n**„Veľký kombajnér\" vs „obyčajný kombajnér\":**\n\nV profesijnej hierarchii veľkých fariem existuje neformálne rozlíšenie:\n- **„Veľký kombajnér\"** = vodič top techniky (Claas Lexion 8900, John Deere S790). Má najväčšiu zodpovednosť, najlepší plat. Často roky skúseností.\n- **„Obyčajný kombajnér\"** = junior pozícia, riadi starší kombajn (Claas Lexion 600 z 2010, Case IH Axial-Flow 7240 starší). Učí sa. Pod dohľadom.\n\n**Žargón:**\n- **„Stuhnúť / vyhorieť / presýtiť mlátičku\"** — prebytok obilia upchá mlátičku, kombajn sa zastaví\n- **„Pľuvnúť\"** — odhodiť nadbytok nemlátiteľnej slamy (napr. kvôli vlhkosti)\n- **„Žiť na buřtu\"** — počas žatvy nemá kombajnér čas pravidelne jesť, žije z buřtov a piva\n- **„Byť v zásobe\"** — kombajn má plný zásobník (8–13 m³), čaká na náves\n- **„Hrať sa na koňa\"** — vyplniť dlhý transport kombajnu po ceste medzi farmami\n- **„Padá zelený\"** (= vlhkostné percentá) — obilie príliš vlhké na mlátenie (>15 %)\n\n**Špecifiká ČR (2024):**\n- **Cudzí kombajnéri** — mnoho fariem si najíma zahraničných vodičov (slovenských, poľských, rumunských) len na sezónu. Ubytovanie na farme.\n- **Sezónne fakty**: cca 3 500 kombajnov v prevádzke, 1 sezónu 2,8 mil. ha obilia, priemerne 800 ha/kombajn/sezónu.\n- **Genderové zastúpenie**: 99 % muži. Posledných 5 rokov pomalý nárast žien-kombajnérok (najmä mladá generácia, agronómky).\n\n**Slangové synonymum** v poľskom poľnohospodárstve: *kombajnista*. V nemecky hovoriacich oblastiach: *Mähdrescherführer*. V anglosaskom svete: *combine operator* (alebo jednoducho „farmer running the combine\").\n\nPozri tiež [[traktorista]], [[kombajn-trida]], [[rotor-kombajn]], [[zne]], [[header]].",
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
    "term": "Traktorista",
    "alias": [
      "vodič traktora",
      "agro vodič"
    ],
    "kategorie": "slang",
    "shortDef": "Traktorista je hovorové označenie pre vodiča poľnohospodárskeho traktora. Najstaršia a najtypickejšia profesia mechanizovaného poľnohospodárstva. Dnes „univerzál\" — orie, seje, hnojí, postrekuje, preváža. Profesijná cesta môže viesť až k vedúcemu mechanizácie.",
    "longDef": "Traktorista je **hovorové označenie pre vodiča poľnohospodárskeho traktora**. Profesie vznikla s nástupom mechanizácie poľnohospodárstva v 20. rokoch 20. storočia a stala sa **kľúčovou pozíciou vidieckej práce** v Československu, neskôr ČSSR a dnešnej ČR.\n\n**Čo traktorista robí:**\n\n**Polné práce** (jar–jeseň):\n- **Orba** (pluh, podmietač, hlboký dlátový kyprič) — pozri [[orba]], [[pluh]]\n- **Sejba** (sejací stroj, sejacia kombinácia) — pozri [[ozim-jarin]]\n- **Hnojenie** (rozmetadlo, postrekovač) — pozri [[npk-hnojivo]]\n- **Postrek** (postrekovač) — pozri [[roundup]]\n- **Zber** (mlátička v kombinácii s kombajnom, lis, baliaci stroj)\n- **Slámovanie a balíkovanie** — pozri [[siloky-balik]]\n- **Krmné kalkulácie** — vozenie siláže na siláž\n\n**Zimné práce**:\n- **Vyklízenie snehu** (radlica na traktor)\n- **Štiepovanie** (drvič vetiev, štiepkovač) — biopalivá\n- **Doprava** (kejda, hnoj, slama) — kontinuálne celý rok\n- **Údržba strojov** — opravy, maľovanie, údržba\n\n**Hierarchia traktoristu:**\n\n**1. „Mladý chlapec pri traktore\"** (junior):\n- Čerstvý zamestnanec, vek 18–25 rokov\n- Začína na **menšom traktore** (Zetor 5xxx, John Deere 6100 atď.)\n- Práca: vyklízenie hnoja, jednoduché prevozy, údržba\n- Plat: 25 000–35 000 Kč/mesiac\n\n**2. „Skúsený traktorista\"** (regular):\n- 3–10 rokov skúseností\n- Riadi **stredný traktor** (90–150 koní)\n- Univerzál — orie, seje, postrekuje\n- Plat: 35 000–55 000 Kč/mesiac\n\n**3. „Šéf-traktorista\"** (senior, hlavný traktorista):\n- 10+ rokov, plné skúsenosti\n- **Top stroj farmy** (Fendt 728, JD 7R 250 atď.)\n- Plánuje sezónne práce, učí mladších\n- Často tiež mechanik (vie poradiť s diagnostikou)\n- Plat: 55 000–75 000 Kč/mesiac\n\n**4. „Vedúci mechanizácie\"** (manager):\n- Bývalý senior traktorista alebo agronóm\n- Plánuje nákup, údržbu, poistenie techniky\n- Riadi ostatných traktoristov\n- Plat: 70 000–110 000 Kč/mesiac\n\n**Špecifiká rôznych typov fariem:**\n\n**Veľká agrárna farma** (1 000+ ha):\n- 8–15 traktoristov\n- **Špecializácia** — niekto len postrekuje, niekto len seje, niekto len kejdu vozí\n- Hierarchická organizácia, denné porady\n\n**Stredne veľký statok** (200–500 ha):\n- 2–4 traktoristi\n- **Univerzálni** — každý vie všetko\n- Rodinná atmosféra, neformálna\n\n**Malá rodinná farma** (50–200 ha):\n- Často len majiteľ + 1 traktorista (rodinný príslušník)\n- Multitasking, všetko v 1 osobe\n\n**Technológie a požiadavky 2024:**\n\nModerný traktor (Fendt 728, JD 7R, Massey 8S) má viac displejov než auto:\n- **GPS-RTK** auto-steering (presnosť 2 cm)\n- **Telematika** (dáta v reálnom čase do centrály)\n- **ISOBUS** komunikácia s náradím\n- **Variable rate** aplikácia hnojív podľa máp\n- **Yield monitoring** — kombinácia s dátami z kombajnu\n\nTraktorista 2024 musí vedieť:\n- Klasické remeslo (mechanika, hydraulika)\n- + digitálne zručnosti (čítať displeje, kalibrovať senzory, riešiť chyby softvéru)\n- + agronomické rozhodovanie (kedy prerušiť prácu kvôli počasiu, ako nastaviť aplikačnú dávku)\n\n**„Generačný problém\":**\n- Väčšina traktoristov 50+ rokov (= „stará škola\", manuálny cit)\n- **Mladí sa hlásia málo** — image „špinavej\" práce, sezónna intenzita, vidiecky život\n- Farmy riešia **prílivom zo Slovenska, Poľska, Ukrajiny, Rumunska**\n- **Robotizácia** (autonómny traktor Bednar, Fendt Xaver) je úsmevná, ale do 2030 by mohla nahradiť 30–50 % manuálnych úkonov\n\n**Žargón:**\n- **„Šliapať\"** — orať (od šliapania na pedál)\n- **„Lupnúť\"** — náhle sa zastaviť, zalehnúť (často kvôli poruche)\n- **„Padák\"** — kombajn (od slangového „padnúť do mlátičky\")\n- **„Vážko vážko\"** — trochu v hovorovej („pomaly pomaly\")\n- **„Kobylka\"** — slangové pre najmenší traktor vo flotile\n- **„Mašina\"** — ktorýkoľvek traktor všeobecne\n- **„Šediváč\"** — Zetor stará séria (slang z 1970s, dnes už nepoužívané)\n\n**Ľudská kultúra:**\n- **„Babičkove poviedky o traktoristoch\"** (1968 J. Vodňanský) — kult v ľudovom humore\n- **„Vesnice má svého traktoristu\"** (1973 J. Menzel) — spoločenský film z JZD éry\n- **Ľudové piesne**: „Padá kosa, padá / keď traktorista bez ovláda\" (50s)\n\nPozri tiež [[kombajner]], [[cvt-prevodovka]], [[orba]], [[autonomni-traktor]], [[gps-rtk]].",
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
    "term": "Šrotovník",
    "alias": [
      "šrotovací stroj",
      "drtič obilní",
      "krmný šrotovník"
    ],
    "kategorie": "slang",
    "shortDef": "Šrotovník je stroj na drvenie obilnín, kukurice a strukovín na hrubý šrot pre kŕmenie dobytka. Historicky poháňaný žentourom alebo lokomobilou, dnes elektrický. Kľúčové vybavenie každej farmy s vlastnou krmivárskou výrobou.",
    "longDef": "Šrotovník (od slova *šrot* — drvené obilniny) je **stroj na drvenie obilnín, kukurice a strukovín** (sója, hrach, lupina) na **hrubý šrot** určený ako krmivo pre skot, prasatá, hydinu. Bez šrotovania by zvieratá väčšinu zrna nezužitkovali (nestrávili celé zrná v trakte).\n\n**Princip činnosti:**\n\n**1. Mlecí (šrotovací) valce:**\n- Dva **drsné kovové valce** otáčajúce sa proti sebe\n- Medzi nimi vstupuje zrno, **mačká sa a drví**\n- Konečná veľkosť: 1–5 mm úlomky (vs celé zrno 5–10 mm)\n- Reguluje sa **medzerou medzi valcami** + rýchlosťou\n\n**2. Kladivový šrotovník (hammer mill):**\n- **Rotor s kladivkami** (rýchlosť 3 000–4 500 ot/min)\n- Drví zrno o kovové sitá (perforáciu)\n- Výsledok: jemnejší šrot (0,5–3 mm), viac prachu\n- Vhodnejší pre **prasatá** (tradične preferujú jemnejší)\n\n**3. Diskový šrotovník:**\n- Menej časté, pre špeciálne aplikácie\n\n**Šrotované zrniny — prečo:**\n\n**Pre skot:**\n- Celé pšenice / kukurice **prechádzajú** tráviacim traktom nezužitkované → 30–40 % strata\n- Šrotovanie zvyšuje **stráviteľnosť** o 20–30 %\n- Príliš jemný šrot u skotu = riziko **acidózy bachoru** (rýchla fermentácia škrobu na kyseliny)\n- **Optimum**: hrubý šrot 2–4 mm = vyvážená stráviteľnosť + štruktúra\n\n**Pre prasatá:**\n- Stráviteľnosť oveľa citlivejšia (jednoduchý žalúdok)\n- Jemnejší šrot (0,8–2 mm) vhodnejší\n- Riziko **žalúdočných vredov** pri príliš jemnom (< 0,5 mm) = vrátiť hrubšiu frakciu\n\n**Pre hydinu (kurčatá, brojleri, sliepky):**\n- Drtina (krátke zrná 1–3 mm) ALEBO peletovanie\n- Jemný prach (< 0,5 mm) hydina nesnáša (lepí sa k zobáku)\n\n**Pre kone:**\n- Šrotované zrniny (ovesný šrot, jačmenný šrot)\n- Hrubá konzistencia = pomalá fermentácia, nižšie kolikové riziká\n\n**História:**\n\n**Žentourový šrotovník** (1800–1900) — pozri [[zentour]]:\n- Pohon: 1–2 kone chodiace v kruhu\n- Výkon: 50–150 kg šrotu/h\n- V každom väčšom grunte\n\n**Parná lokomobila** (1880–1950):\n- Putovný šrotovník\n- Príjazd 1× mesačne do dediny, sedliaci privážali obilniny na šrotovanie\n- Cena za službu: typicky 5–10 % zo šrotovaného množstva („mlátečná\")\n\n**Elektrický šrotovník** (od 1950):\n- **3–7,5 kW** motor + valcová / kladivková mechanika\n- **Domáci**: 800–3 000 kg šrotu/h\n- **Pre veľké farmy**: 5–20 t/h\n\n**Súčasné typy:**\n\n**Stacionárny šrotovník** (na farme):\n- **Príkon**: 5–22 kW (~25–35 tis. Kč pre malý)\n- **Veľký pre farmu**: 30–75 kW (~80–250 tis. Kč)\n- **Top značky CZ**: PS-Strojírny (Letohrad), Sano (Lichnov), DAS (Pardubice)\n- **Top značky EU**: Skiold (DK), Renkum (NL), Romill (CZ-Brno)\n\n**Mobilný šrotovník** (na traktore):\n- **Príkon**: z PTO traktora, 30–80 kW\n- **Výkon**: 1–5 t/h\n- **Použitie**: putovný šrotovník, mlecí kombajny (kombajn šrotuje za jazdy)\n- **Cena**: 80 000–300 000 Kč\n\n**Mlecí kombajn** (modernejší trend):\n- **Sklízí + šrotuje + ukládá** vlhké zrno do vakov pre siláž\n- **Vlhké šrotovanie CCM** (Corn-Cob-Mix) — kukuričné zrno + klás drvený + uložený do vaku\n- Trend pre **mliečne farmy** (nahradenie nakupovaného koncentrátu)\n\n**Šrot a krmivá:**\n\n**Hodnotenie kvality šrotu:**\n- **Granulometria** (veľkosť častíc) — Penn State Particle Separator\n- **Vlhkosť** (max 14 % pre skladovanie, 30+ % pre vlhké šrotovanie CCM)\n- **Teplota** po šrotovaní (vyššia u rýchlych kladivkových — pozor na poškodenie vitamínov)\n\n**Typický šrot na farme:**\n- **Pšeničný šrot**: 50–60 % obilný súčasť krmnej dávky\n- **Jačmenný šrot**: substitúcia pšenice, lacnejší\n- **Kukuricový šrot**: vysoká energia, nižšie bielkoviny\n- **Sója šrot**: vysoké CP, dovážaný alebo vlastná výroba\n- **Hrachový šrot**: domáca proteínová alternatíva SES\n\n**Energetika a ekonomika:**\n\n**Spotreba elektriny**:\n- Valcový šrotovník: 6–12 kWh/t šrotu\n- Kladivkový: 10–18 kWh/t šrotu\n- **Cena** elektriny: 6 Kč/kWh × 10 kWh = **60 Kč/t šrotu**\n\n**Vlastné šrotovanie vs nakupované krmivo**:\n- **Vlastný šrot zo sklizne**: 4 500 Kč/t pšenice + 60 Kč šrotovania = **4 560 Kč/t šrotu**\n- **Nakupovaný hotový koncentrát**: 8 000–12 000 Kč/t\n- **Úspora 3 500–7 500 Kč/t** → veľké farmy si šrotujú takmer všetko\n\n**Slangová a hovorová užitia:**\n- **„Šrotovať\"** — okrem obilnín znamená ľudovo „biť\" (slangovo), „rozprávať zbytočne rýchlo\"\n- **„Šrotovník\"** — slangovo pre „pomalý / zastaraný počítač\" („tento laptop je šrotovník\")\n- **„Šrot\"** — používa sa ako technicky (krmivo), tak v slangu („poď, dáme si šrot\" = dáme si pivo, slangovo staré)\n\nV kultúre: **„Šrotovanie\"** bola v českej literatúre symbolom jesennej práce (Karel Čapek, B. Hrabal).\n\nPozri tiež [[zentour]], [[krmne-davky]], [[kukurice-silazni]], [[grunt]], [[tmr]].",
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
    "term": "Zemák (zemiak)",
    "alias": [
      "zemčatá",
      "erteple",
      "kobzole",
      "zemiak"
    ],
    "kategorie": "slang",
    "shortDef": "Zemák je hovorové / dialektické označenie pre zemiak (Solanum tuberosum). V češtine existujú regionálne varianty: zemák (severná Morava, Sliezsko), erteple (jihlavsko, slang), kobzole (Sliezsko, poľské vplyvy), zemiak (štandard CZ).",
    "longDef": "Zemák (ľudovo *zemčatá*, *erteple*, *kobzole*) je **hovorové a dialektické označenie pre zemiak** — *Solanum tuberosum* — jednoročná hľuznatá rastlina z čeľade ľuľkovitých. V češtine má zemiak desiatky regionálnych synonym, čo svedčí o **historickom význame plodiny** v rôznych českých regiónoch.\n\n**Regionálne varianty:**\n\n- **Zemiak / zemiaka** — štandard ČR, juhočeské nárečie. „Z Bramburska\" = z nemeckého Brandenburska, odkiaľ sa zemiaky šírili do Čiech.\n- **Zemák** — Sliezsko, severná Morava. Z „zeme\" + zdrobneniny.\n- **Erteple** — jihlavsko, juhovýchodná Morava. Z nemeckého *Erdäpfel* („zemské jablká\").\n- **Kobzole** — Sliezsko, severovýchod (poľské *kartofle*).\n- **Zemčatá** — Vysočina, českomoravská vrchovina.\n- **Krumpáč** (zastaralé) — Slovácko, juhovýchodná Morava.\n- **Krumple** — Valašsko.\n- **Grumpera** — Chodsko.\n- **Šemerlák** — okolie Telče.\n- **Knedl** — slang vo veľkých mestách (z zemiakového knedlíka).\n\n**História v českých krajinách:**\n\n**1700s — príchod zemiaka:**\n- Zemiaky prichádzajú do Čiech cez Viedeň (Mária Terézia) a Sasko (Sedemročná vojna 1756–1763)\n- Prvé pestovanie v **kláštorných záhradách** a u šľachty\n- Sedliaci dlho odolávali — báli sa „čertovej plodiny\" (jed ľuľkovitých, zelené hľuzy obsahujú solanín)\n\n**1770–1772 — Veľký hladomor:**\n- Tradičné obilie zlyhalo opakovane\n- **Mária Terézia nariadila povinné pestovanie zemiakov** (1771)\n- Zemiak zachránil desiatky tisíc roľníkov od smrti\n- Odvtedy trvalo zakotvený v českej kuchyni\n\n**1800–1860 — éra rozmachu:**\n- Zemiaky sa stávajú **základnou stravou vidieka** (chudobných)\n- „Zemiak s mliekom\" — typické jedlo\n- Vznik **zemiakárskych oblastí** (Vysočina, Krkonoše, Beskydy)\n\n**1860+ — chov prasiat a liehovary:**\n- Zemiaky pre **kŕmenie prasiat** (vykrmený zemiak)\n- **Liehovary** spracovávajú zemiakový škrob na etanol (vodka, liek, chémia)\n- Vznik **zemiakárskej tradície** (Vysočina, Pardubicko)\n\n**Pestovanie v ČR (2024):**\n\n**Plocha**: ~24 000 ha (klesajúci trend, z 100 000 ha v 90. rokoch)\n**Výnosy**: 26–35 t/ha (rané), 35–55 t/ha (neskoré priemyselné)\n**Produkcia**: ~700 000 t/rok\n\n**Hlavné kategórie**:\n1. **Konzumné zemiaky** (rané, červené, modré, žlté) — supermarkety\n2. **Sadbové zemiaky** (certifikované osivo pre ďalšiu generáciu) — vyššia cena\n3. **Priemyselné zemiaky** (liehovary, škrobárne, hranolkárne) — kontrakt\n4. **Kŕmne zemiaky** (pre prasiatka, dnes menej časté)\n\n**Kľúčové oblasti pestovania**:\n- **Vysočina** (Jihlavsko, Pelhřimovsko) — vyššia nadmorská výška, vyrovnaný výnos\n- **Polabská nížina** (Polabí, Hradecko) — rané odrody\n- **Šumavské podhorie** — kvalitná sadba\n- **Chod / Plzeňsko** — historicky zemiakár\n\n**Top odrody CZ**:\n- **Adéla** (rané)\n- **Filea** (rané, červená)\n- **Magda** (stredne neskorá, žltá)\n- **Saturna** (priemyselná, výnosy 50+ t/ha)\n- **Marabel** (neskorá, konzumná, vysoká kvalita)\n- **Soraya** (sadba)\n\n**Agrotechnika:**\n- **Sejba** sadbou (10–25 cm hĺbka, rozstup 75 × 30 cm), marec–máj\n- **Hnojenie**: 80–120 kg N/ha + 60–80 P + 120–160 K\n- **Postreky**: proti plesniam (oomyceta), mandelinke (Colorado beetle)\n- **Zber**: zberač zemiakov (vykopávač) — september–október\n- **Skladovanie**: chladné, suché 4–8 °C, vlhkosť 90 %\n\n**Choroby a škodcovia**:\n- **Pleseň zemiaková** (Phytophthora infestans) — historicky spôsobila Veľký írsky hladomor 1845\n- **Mandelinka zemiaková** — invazívna z USA (1922 prvý výskyt v ČR)\n- **Háďatko zemiakové** — karanténny škodlivý činiteľ\n\n**Ekonomika 2024**:\n- **Konzumná cena (supermarket)**: 15–40 Kč/kg\n- **Cena od pestovateľa**: 5–12 Kč/kg\n- **Marža obchodu**: 200–400 % (medzi pestovateľom a regálom)\n- **Priemyselná cena**: 3–6 Kč/kg (liehovary, škrob)\n\n**Klesajúca plocha**:\n- 1990: 100 000 ha\n- 2010: 30 000 ha\n- 2024: 24 000 ha\n- **Dôvody**: import (NL, DE, FR, PL), lacná dovozová cena, vysoké náklady na techniku, choroby (pleseň)\n\n**Slangová a kultúrna rola:**\n\n- **„Zemáky\"** — slangové pre „jednoduchá strava\" („mám doma len zemáky a mlieko\")\n- **„Zemiak\"** — pejoratívne pre neohebnú osobu („je z neho zemiak\", „zemiakové telo\")\n- **„Zemiakový šalát\"** — symbol Vianoc v českej kuchyni\n- **„Zemiaková polievka\"** (polievka) — chudá roľnícka strava povýšená na národný pokrm\n- **„Hodený zemiak\"** — v UK slang pre nevychovanú novinársku otázku (= „hot potato\")\n\n**Ľudové pranostiky:**\n- „Keď zemiak kvitne na svätého Vavrinca (10. 8.), nebude úroda\" (= neskoré kvitnutie = malé hľuzy)\n- „Mokrý jún, zemiak zaplával\" (= príliš dažďov = pleseň)\n\nV kultúre: **„Zemiakové rozprávky\"** (J. Lada), **„Zemiakové dni\"** (regionálne festivaly Vysočiny), **„Pelhřimovské zemiakárske slávnosti\"** (každoročne).\n\nPozri tiež [[ozim-jarin]], [[osevny-postup]], [[npk-hnojivo]], [[roundup]], [[plesen-zemiakova]], [[mandelinka-zemiakova]].",
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
    "term": "Pleseň zemiaková",
    "alias": [
      "Phytophthora infestans",
      "late blight",
      "pleseň neskorá"
    ],
    "kategorie": "ochrana",
    "shortDef": "Pleseň zemiaková (Phytophthora infestans) je hubová choroba zemiakov a rajčín. Spôsobila írsky hladomor 1845–1849. Dnes najvážnejšia choroba zemiakov — bez fungicídov strata 50–100 % úrody počas 14 dní.",
    "longDef": "Pleseň zemiaková (lat. *Phytophthora infestans*, anglicky *late blight*, „neskorá pleseň\") je **oomycéta** (nie pravá huba — patrí medzi riasovce / Stramenopila) spôsobujúca najdôležitejšiu chorobu **zemiakov** a **rajčín**. Historicky spôsobila **Veľký írsky hladomor** 1845–1849 (1 milión mŕtvych, 1 milión emigrantov).\n\n**História:**\n- **1840s** — patogén prvýkrát pozorovaný v Belgicku, Holandsku\n- **1845–1849** — Írsky hladomor. Zemiaky tvorili 80 % stravy chudobných írskych roľníkov. Patogén zničil úrodu 3 roky po sebe.\n- **1882** — francúz Pierre Marie Alexis Millardet objavuje **bordeauxskú zmes** (CuSO₄ + Ca(OH)₂) v Médocu — náhodou, ako prevenciu proti zlodejom viniča. Prvý historický fungicíd.\n- **20. storočie** — postupný vývoj systémových fungicídov (mancozeb, metalaxyl, cymoxanil)\n- **2000s** — agresívny A2 mating type kmeň z Mexika invázny do EÚ — patogén sexuálne reprodukuje → oospóry v pôde → trvácnosť\n\n**Životný cyklus:**\n1. **Prezimovanie**: v hľuzách zemiakov (semenách), kompostoch, mŕtvych rastlinách\n2. **Sporulácia**: ráno za rosy (vlhko + 10–25 °C) → sporangia\n3. **Šírenie**: vzduch (sporangia letí desiatky km), voda (zoospóry plávajú v rose)\n4. **Infekcia**: penetrácia stomatami alebo cez ranky, prejavy 3–5 dní po infekcii\n5. **Sekundárny cyklus**: za 4–7 dní ďalšia sporulácia → epidémia\n\n**Symptómy:**\n- **Listy**: tmavé hnedo-čierne nekrózy, často s **bielym plesňovitým okrajom** na rube (sporulácia)\n- **Stonky**: tmavé škvrny, neskôr kruhové rozkladné lézie\n- **Hľuzy**: hnedé škvrny na povrchu → vnútri hnedá/červená hniloba (často sekundárne bakteriálne mokré)\n- **Rajčiny**: rovnaké — hnedé škvrny, sporulácia, hniloba plodov\n\n**Riziko a varovanie:**\n- **Vlhko + teplo** (RH > 90 %, T 10–25 °C) → vysoké riziko\n- **Modelovacie systémy** (Smith Period, NegFry, BlightCAST) — predpoveď infekcie 1-3 dni dopredu\n- **SK varovanie**: Štátna rastlinolekárska správa (ÚKZÚZ) + komerčné (BIRTeam, Bayer FieldView)\n\n**Boj — fungicídy:**\n\n**Preventívne (kontaktné)**:\n- **Mancozeb** (Dithane, Penncozeb) — biely prach, 7–10 dní účinok. **Plánovaný zákaz v EÚ** od 2024 (potenciálne karcinogénny)\n- **Cymoxanil** — veľmi efektívny, krátka účinnosť (2–3 dni)\n- **Meď** (CuSO₄, Cu hydroxid) — bio aj konvenčné. **Limit 4 kg Cu/ha/rok** v EÚ\n- **Folpet** — alternatíva k mancozebu\n\n**Systémové (lokálne systémové)**:\n- **Metalaxyl, Metalaxyl-M** (Ridomil) — fenylamid, veľmi efektívny. Riziko rezistencie (problém od 1990s)\n- **Mandipropamid** (Revus) — CAA fungicíd, špička 2020s\n- **Cymoxanil + Mancozeb** kombinácia (Curzate)\n- **Fluazinam** (Shirlan) — preventívny, dlhá perzistencia\n- **Pyrimethanil** — komplikované použitie\n\n**Postrekový kalendár** (intenzívne zemiaky, 2024 EÚ):\n- **Klíčiace**: žiadny postrek\n- **5–10 cm porast**: 1. prevencia (mancozeb alebo Cu)\n- **Pred uzatváraním riadkov**: 2. (cymoxanil/metalaxyl)\n- **Kvet**: 3.–4. postrek (mandipropamid)\n- **Tvorba hľúz**: 5.–7. postrek (preventívny každých 7–10 dní)\n- **Pred zberom**: 8. desikačný (Reglone alternatíva)\n- **Celkovo**: 7–10 postrekov/sezónu, **náklady 4 000–7 000 Kč/ha**\n\n**Rezistentné odrody:**\n- **Sárka, Adéla, Marabel** — stredne tolerantné\n- **Sárpo Mira** — vysoká rezistencia, vhodná pre biofarmy\n- **Bionica, Toluca** — moderné rezistentné hybridy\n- **Rezistencia nie je 100 %** — aj tolerantné odrody potrebujú 3–5 postrekov v rizikovej sezóne\n\n**Bio prístup:**\n- Iba **meď** (Cu — viď vyššie, 4 kg/ha/rok limit)\n- **Bordeauxská zmes** (klasická, lacná, vlastnoručne miešaná)\n- **Bio-stimulanty** (silikát draselný, výťažky z pŕhľavy) — marginálny efekt\n- **Rezistentné odrody** + krátky vegetačný cyklus (zber skoro)\n\n**Po infekcii:**\n- **Nie je liečba** — preventívne fungicídy sa aplikujú PRED infekciou\n- **Po prvých symptómoch** → lokálne „spaľovanie\" (zničiť infikované rastliny mechanicky/chemicky)\n- **Zberané zemiaky** → triediť (žiadne napadnuté do skladu, riziko hniloby celého skladu)\n\n**V SR 2024**: straty z plesne zemiakovej ~5–15 % úrody aj napriek intenzívnemu postreku. Bez postrekov 50–100 % strata.\n\nViz tiež [[roundup]], [[fungicídy]], [[zemiak]], [[ozim-jarin]], [[osevný-postup]], [[medzi]].",
    "related": [
      "fungicidy",
      "zemak",
      "mandelinka-bramborova",
      "desikace"
    ]
  },
  {
    "slug": "fuzarioza",
    "term": "Fuzarióza klasov",
    "alias": [
      "Fusarium head blight",
      "FHB",
      "klasová fuzarióza",
      "Fusarium graminearum"
    ],
    "kategorie": "ochrana",
    "shortDef": "Fuzarióza klasov (Fusarium spp.) je hubová choroba obilia (pšenica, jačmeň) napádajúca klasy. Produkuje mykotoxíny (DON, ZEA, T-2) škodlivé pre ľudí aj zvieratá. Štandardný limit EÚ pre DON v pšenici = 1,25 mg/kg.",
    "longDef": "Fuzarióza klasov (anglicky *Fusarium Head Blight*, FHB) je **hubová choroba obilia** spôsobená komplexom druhov rodu *Fusarium* (*F. graminearum, F. culmorum, F. avenaceum, F. poae*). Napáda predovšetkým **pšenicu, jačmeň, raž, ovos, kukuricu**. Kľúčový problém: **mykotoxíny**.\n\n**Druhy a mykotoxíny:**\n\n| Druh | Hlavný mykotoxín | Účinok |\n|------|------------------|---------|\n| **F. graminearum** | DON (deoxynivalenol) | Imunosupresívny, gastrointestinálny |\n| **F. graminearum** | ZEA (zearalenon) | Estrogénny (problém u prasiat) |\n| **F. culmorum** | DON, ZEA, NIV | Podobné |\n| **F. poae** | NIV (nivalenol), T-2 | Vysoko toxický (T-2 = bojový agent) |\n| **F. avenaceum** | Moniliformin, ENN | Kardiotoxický |\n| **F. verticillioides** (kukurica) | Fumonisíny | Karcinogénny, neurologický |\n\n**EÚ limity mykotoxínov** (Nariadenie 1881/2006 + 2023 revízia):\n- **DON**: pšenica/jačmeň pre konzum 1,25 mg/kg, krmivo 8 mg/kg\n- **ZEA**: pšenica 100 µg/kg, kukurica 350 µg/kg\n- **Fumonisíny**: kukurica 4 000 µg/kg\n- **Aflatoxíny** (iný rod *Aspergillus*): 4 µg/kg max\n\n**Symptómy:**\n- **Klásky belavé** (predčasne dozrievajú) — kontrast so zdravými zelenými\n- **Ružovo-oranžová sporulácia** na klasu pri vlhku\n- **Zrno scvrknuté, „ružovkasté\"** (\"tombstone kernels\", *piepsy*)\n- **Posklizňový test**: laboratórium kvantifikuje DON na ELISA alebo HPLC\n\n**Rizikové faktory:**\n- **Predplodina kukurica** — *F. graminearum* prezimuje v kukuričných stonkách\n- **No-till** + reziduálna slama kukurice = vysoké riziko\n- **Vlhko + teplo** (15–25 °C, dážď 24–48 h) **počas kvitnutia pšenice** (BBCH 61–69, polovica mája až polovica júna)\n- **Husté porasty** (neznižuje aeráciu klasov)\n\n**Boj — chemický:**\n\n**Kľúčový moment — postrek v kvitnutí (BBCH 63–67)**:\n- **Triazoly**: prothiokonazol (Prosaro, Caramba), tebuconazol, metconazol\n- **SDHI** (Inatreq): fluxapyroxad, bixafen — moderná generácia\n- **Strobiluríny**: azoxystrobin (NOT recommended pre FHB — niektoré druhy F. zvyšuje DON!)\n- **Kombinácia** SDHI + triazol = strieborný štandard 2020s\n- **Aplikácia**: 200–400 l vody/ha, jemné rozprášenie, **timing kritický** (kvitnúce klasy)\n\n**Efektivita postreku:**\n- **Optimal timing**: -40 % DON, -50 % FHB\n- **Neskoro**: +10 % efekt na DON\n- **Skoro (pred kvitnutím)**: 0 efekt\n- **Nutné merať** vegetačné štádium, nie dátum\n\n**Boj — agrotechnický:**\n- **Predplodina**: po kukurici **NESEJTE pšenicu**. Lepšie: repka → pšenica alebo luskovina → pšenica.\n- **Spracovanie pôdy**: orba zaorá *Fusarium* rezíduá, znižuje inokulum o 50–80 %. **No-till + kukurica = najhoršia kombinácia**.\n- **Rezistentné odrody**: čiastočná tolerancia (nikdy 100%). Sumai 3 (CN) = donor génu Fhb1, používaný v EÚ šľachtení.\n- **Hustota porastu**: 350–450 klasov/m² (vyššia = vyššie riziko)\n- **Hnojenie**: vysoký N nezvyšuje FHB výrazne, ale predlžuje kvitnutie = väčšie okno infekcie\n- **Odolnosť**: BBCH model + meteodata + poveternostná stanica = pre-warning systém\n\n**Zber a posklizňová úprava:**\n- **Časné kombajnovanie** napadnutého porastu — menej času pre ďalšiu sporuláciu\n- **Vyššia vlhkosť pri zbere** (15–20 %) → ihneď sušiť pod 13 %\n- **Čistenie** — *fuzariové zrno je ľahšie*, možno ho oddeliť air-screen čističkou (strata 5–15 % hmotnosti, ale DON klesne o 50–80 %)\n- **Sklad** za sucha a chladu (< 14 % vlhkosť, < 15 °C) — *Fusarium* ďalej nerastie\n\n**Ekonomický dopad:**\n- **Cena kontaminovaného obilia**: výkup ho prijme s 30–50 % zrážkou alebo odmietne (krmné = nižšia cena, nesplnenie mlynárskych limitov)\n- **Náklady na postrek FHB**: 800–1 500 Kč/ha (1 aplikácia)\n- **Strata výnosu**: 10–30 % pri napadnutí\n- **CZ 2024**: cca 20–30 % zberu pšenice vo „FHB riziku\" v niektorých rokoch\n\n**Ľudské zdravie:**\n- **Akútna otrava** vysokými dávkami DON: nausea, zvracanie, horkosť v ústach\n- **Chronická expozícia**: imunosupresia, rastová retardácia u detí\n- **ZEA**: hormonálna disrupcia (estrogénna), problém pre prasiatka\n\n**Krmivá pre zvieratá:**\n- **Prasiatka** veľmi citlivé (limit DON 0,9 mg/kg krmiva)\n- **Hovädzí dobytok** menej citlivý (5 mg DON/kg krmiva)\n- **Hydina** stredne citlivá (2 mg DON/kg)\n- **Mykotoxínové viazače** (bentonity, glukomanánové steny kvasiniek) — kompenzácia v krmive pre viazanie toxínov v tráviacom trakte\n\n**V ČR výskum**: VURV Praha-Ruzyně, Mendelu Brno — selekcia rezistentných odrôd, predikčné modely.\n\nPozri tiež [[fungicídy]], [[ozim-jarin]], [[osevny-postup]], [[no-till]], [[kukurica-silazna]], [[hektoliter]].",
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
    "term": "Septorióza",
    "alias": [
      "Zymoseptoria tritici",
      "STB",
      "Septoria tritici blotch",
      "listová septorióza pšenice"
    ],
    "kategorie": "ochrana",
    "shortDef": "Septorióza (Zymoseptoria tritici, predtým Septoria tritici) je najvýznamnejšia houbová choroba listov pšenice v Európe. Znižuje výnos o 30–50 % bez postreku. Kľúčový dôvod fungicidných postrekov na pšenicu v Európe.",
    "longDef": "Septorióza pšenice (*Zymoseptoria tritici*, predtým *Septoria tritici* alebo *Mycosphaerella graminicola*, anglicky *Septoria tritici blotch*, STB) je **dominantná listová choroba pšenice vo západnej a strednej Európe**. V SR je hlavným dôvodom ošetrenia pšenice fungicidmi — bez postreku 30–50 % strata výnosu.\n\n**Životný cyklus:**\n1. **Prezimovanie**: na rastlinných zvyškoch pšenice (slama) alebo na ozime na jeseň\n2. **Šírenie na jeseň** (ozim): dážď rozširuje **pyknospory** na listy. Mierne teploty + dážď = ideálne.\n3. **Latentná fáza**: 14–28 dní (mierna zima → infekcia neviditeľná)\n4. **Symptómy na jar**: žltkasté škvrny s malými čiernymi bodkami (pyknidy)\n5. **Vertikálne šírenie**: spóry letia dažďom nahor, postupne napadá vyššie listy (flag leaf — vlajkový list je najcennejší, dodáva 60 % asimilátov zrna)\n6. **Sekundárny cyklus**: nový dážď = nové sporulácie = nová infekcia\n\n**Symptómy:**\n- **Žlté → hnedé** nepravidelné škvrny na listoch\n- **Charakteristické**: drobné **čierne pyknidy** v ploche lézie (veľa bodiek na 1 cm²)\n- **Postup zdola nahor**: dolné listy ovplyvnené najskôr, postupne do vrcholu\n- **Najviac škodí napadnutie vlajkového listu** (F0) a F-1 — 60 % výnosu závisí na nich\n\n**Rizikové faktory:**\n- **Časné siatie ozimu** (pred 15. septembrom) → väčšia infekcia na jeseň\n- **Vlhké jaro** (dážď > 5 mm v rozmedzí 10 dní) → každý dážď = nová infekcia\n- **Husté porasty** → mikroklíma = vlhko\n- **Vysoké N hnojenie** → bujný porast\n- **Predplodina pšenica** → inokulum prezimuje v slame (preto **NESÁDZAŤ pšenicu po pšenici**)\n- **No-till + slama na povrchu** → zachovaný inokulum\n\n**Boj — fungicídy:**\n\n**Kľúčové ošetrenie**:\n1. **T0 (BBCH 30–32, jar)** — ak silné napadnutie z jesene. Lacný základ.\n2. **T1 (BBCH 32–37)** — ošetrenie krymové listy. Triazol + SDHI.\n3. **T2 (BBCH 39–49, flag leaf)** — **NEJCENNĚJŠIE ošetrenie**. Vlajkový list musí ostať zelený.\n4. **T3 (BBCH 60–69, kvitnutie)** — fuzarióza + dozrievanie. Triazol alebo strobilurín.\n\n**Aktívne látky:**\n- **Triazoly (DMI)**: tebuconazol, prothiokonazol, metconazol — hlavná trieda 30 rokov, **rastúca rezistencia**\n- **SDHI**: fluxapyroxad (Bixafen), benzovindiflupyr (Solatenol), pydiflumetofen — top performery 2020s. Riziko rezistencie (mierne, doteraz zvládnuteľné).\n- **Strobiluríny (QoI)**: azoxystrobin (Amistar), pyraclostrobin — **dnes prakticky neúčinné na septoriózu** kvôli rezistencii (mutácia G143A v cytochróme b). Stále sa používajú pre iné choroby.\n- **Inatreq active** (fenpicoxamid) — nová trieda, 2021+ na trhu. Zatiaľ low resistance.\n- **Mefentrifluconazole** (Revysol) — nová DMI z BASF s lepšou aktivitou na rezistentné izoláty\n\n**Strategie anti-rezistencie:**\n- **Mix účinných látok** vždy (triazol + SDHI + strobilurín)\n- **Maximálne 1× na sezónu** rovnakú účinnú látku\n- **Kombinácia s biológiou** (bacillus, Trichoderma — komerčne tlmené pre veľké farmy)\n\n**Náklady postrekov:**\n- **T1**: 600–1 200 Kč/ha\n- **T2**: 800–1 500 Kč/ha (flag leaf — kvalitný mix)\n- **T3**: 700–1 200 Kč/ha\n- **Sezónny celkom**: 2 100–3 900 Kč/ha pre pšenicu\n\n**Návratnosť:**\n- Postrek T2 ušetrí 1–2 t/ha = 5 000–10 000 Kč/ha → návratnosť 4–6×\n- T1 + T3 menej kľúčové, ale zachovávajú rezervu T2\n\n**Agrotechnika (anti-septorióza bez chémie):**\n- **Odolné odrody**: Bohemia, RGT Sacramento, Arnaud (SK trh) — čiastočná tolerancia\n- **Neskoršie siatie** ozimu (po 30. septembri) → menšia jesenná infekcia\n- **Znížená hustota porastu** (350 klasov/m² namiesto 500) → lepšia aerácia\n- **Znížené N hnojenie** + split aplikácia (rozdeliť dávku 2-3× počas sezóny)\n- **Predplodina iná než pšenica** — repka, strukovina, kukurica\n- **Orba** zaorá inokulum (vs no-till)\n\n**Klimatická zmena:**\n- Teplejšie zimy = viac prezimovaného inokula\n- Vlhkejšie jaro = viac cyklov\n- **Posun areálu** — septorióza posúva na sever Európy (SE, DK, UK posilnenie 2020s)\n\n**V SR výskum**: VURV, Mendelu — selekcia rezistentných línií, sledovanie fungicidnej citlivosti.\n\nViz tiež [[fuzarióza]], [[rzi]], [[fungicídy]], [[ozim-jarin]], [[osevný-postup]], [[no-till]].",
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
    "term": "Rzi obilnín",
    "alias": [
      "Puccinia",
      "rust",
      "rez pšeničná",
      "rez jačmenná",
      "rzi"
    ],
    "kategorie": "ochrana",
    "shortDef": "Rzi sú skupina houbových chorôb obilnín spôsobená rodmi Puccinia. Tri kľúčové: rez plevová (P. striiformis), rez listová (P. recondita), rez stéblová (P. graminis). Historicky devastujúce choroby, dnes zvládnuté fungicídmi a rezistenciou.",
    "longDef": "Rzi obilnín (anglicky *rusts*) sú skupina **biotrofických houbových chorôb** spôsobená rodmi **Puccinia**. Tri kľúčové druhy pre SR pšenicu a jačmeň:\n\n1. **Rez plevová (žltá)** — *Puccinia striiformis* (PST) — agresívna, chladná/vlhká\n2. **Rez listová (hnedá)** — *Puccinia recondita / triticina* (PT) — teplá/suchá\n3. **Rez stéblová (čierna)** — *Puccinia graminis* (PG) — historicky katastrofická, dnes vzácna v EÚ\n\n**Historický význam:**\n- **Rímska ríša** — *Robigalia* sviatok (25. apríla) zameraný proti rzi\n- **1880s** — masívne epidémie v USA a EÚ\n- **1916, 1953** — celosvetové epidémie rzi stéblovej → impulzy pre Bordeauxskú jíchu a moderné fungicídy\n- **1999+** — UG99 (Ug99) — vysoko agresívny kmeň rzi stéblovej z Ugandy, šíri sa Afrika → Ázia. Hrozba pre globálnu pšeničnú produkciu.\n- **2010+** — PST Warrior (žltá rez) — agresívne rasy v EÚ, prelomenie odolnosti väčšiny pšeničných odrôd\n\n**Symptómy:**\n\n**Rez plevová (žltá, *yellow rust*):**\n- **Drobné žlto-oranžové pľuzgieriky** v dlhých prúžkoch pozdĺž žiliek listov\n- Optimálne: 8–18 °C, vlhko, rosa\n- **Časná v sezóne** (marec–jún v SR)\n- **Riziko**: napadá ozim už počas zimy (prezimuje na listoch)\n\n**Rez listová (hnedá, *brown/leaf rust*):**\n- **Hnedo-oranžové pľuzgieriky** jednotlivé alebo v zhlukoch, kruhové\n- Optimálne: 15–25 °C\n- **Neskoro v sezóne** (máj–august)\n- **Riziko**: poškodzuje vlajkový list počas plnenia zrna\n\n**Rez stéblová (čierna, *stem rust*):**\n- **Tmavo hnedé až čierne** pľuzgieriky NA STÉBLECH (nie listoch)\n- Veľké lézie, často 1×3 cm\n- **Neskoro** (koniec júna–júl)\n- **Riziko**: poškodzuje stéblo → polehnutie porastu, výrazné zníženie výnosu (-30–80 %)\n\n**Životný cyklus (komplexný — alternujúci hostiteľ):**\n- **Hlavný hostiteľ**: pšenica / jačmeň / raž (uredinia → telia štádium)\n- **Vedľajší hostiteľ** (sexuálna reprodukcia): rôzny podľa druhu\n  - PST žltá: predtým sa myslelo, že žiadny, dnes vieme *Berberis spp.* (drišťál)\n  - PT listová: *Thalictrum spp.* (rešetlák — vzácne)\n  - PG stéblová: *Berberis vulgaris* (drišťál obyčajný) — **historicky kácený** v USA pre eradikáciu rzi!\n- **EÚ/SR**: *Berberis vulgaris* dnes nie je rozšírený → eradikácia 1900s pomohla.\n\n**Boj — fungicídy:**\n\n**Rovnaké schémy ako septorióza** (často kombinované postreky):\n- **Triazoly** — tebuconazol, propiconazol, prothiokonazol — efektívne\n- **Strobiluríny** — pyraclostrobin, azoxystrobin — vysoko účinné, **rezistencia v niektorých rasách**\n- **SDHI** — moderné, kombinácia s triazolom\n- **Inatreq active** — nová trieda 2021+\n- **Aplikácia timing**: rovnaké ako STB (T1 + T2 najcennejšie)\n\n**Náklady**: zahrnuté v sezónnom postreku 2 000–4 000 Kč/ha (kombinované s STB postrekom)\n\n**Boj — rezistentné odrody:**\n- **Major rezistentné gény** (Lr, Sr, Yr gény) — špecifické, ale ľahko prelomené\n- **Slow-rusting**, kvantitatívna rezistencia — trvanlivejšia\n- **CIMMYT, ICARDA** — globálne šľachtenie\n- **SR moderné odrody** majú kombináciu 3-5 rezistentných génov (Bohemia, Sailor, Vlasta)\n\n**Rezistencia patogénov:**\n- **PST Warrior** prelomené Yr17 v 2011 → väčšina EÚ odrôd citlivá\n- **Ug99 black rust** prelomené Sr31, Sr24, Sr36 — agresívne v Afrike\n- **Konštantný súboj** šľachtenia vs evolúcia patogéna\n\n**Medzinárodná spolupráca:**\n- **WIN** (Wheat Initiative Network) — globálne sledovanie rasových typov\n- **Borlaug Global Rust Initiative (BGRI)** — koordinácia boja proti Ug99\n- **EAS-Eppo** — EÚ monitoring\n\n**Klimatická zmena:**\n- Teplejšie zimy → vyššie prezimovanie patogéna\n- Neskorší chlad na jar → rzi začínajú neskôr ale silnejšie\n- **Pšenica v severných krajinách** (UK, IE, S-Skandinávia) teraz pravidelne napadané (predtým zriedkavejšie)\n\n**V SR výskum**: VURV Praha (rasy PST, PT), Mendelu Brno (rezistencia šľachtenia).\n\nViz tiež [[fuzarióza]], [[septorióza]], [[fungicídy]], [[ozim-jarin]].",
    "related": [
      "fuzarioza",
      "septorioza",
      "fungicidy",
      "ozim-jarin"
    ]
  },
  {
    "slug": "mandelinka-bramborova",
    "term": "Mandelinka zemiaková",
    "alias": [
      "Colorado potato beetle",
      "Leptinotarsa decemlineata",
      "mandelinka"
    ],
    "kategorie": "ochrana",
    "shortDef": "Mandelinka zemiaková (Leptinotarsa decemlineata) je invázny chrobák z USA, hlavný škodca zemiakov v Európe. Dospelci aj larvy žerú listy, bez ochrany 100 % defoliácia = 80 % strata výnosu. V SR od 1922.",
    "longDef": "Mandelinka zemiaková (lat. *Leptinotarsa decemlineata*, ang. *Colorado potato beetle*, CPB) je **invázny chrobák** z čeľade *Chrysomelidae*. Pôvodom z **Colorada (USA)**, dnes hlavný škodca zemiakov v Európe, Ázii aj v pôvodnej Severnej Amerike.\n\n**História invázie:**\n- **1859** — prvá masová epidémia v Colorade (USA). Predtým žila na divokých *Solanum* spp.\n- **1875** — invázia do New Yorku, ďalej do EÚ\n- **1922** — prvý výskyt v SR (Bordeaux, potom Praha)\n- **1947** — masová invázia do SR, kampaň proti „americkému chrobákovi\"\n- **1950s** — DDT prvýkrát použitý, krátky triumf, potom rezistencia\n- **Dnes** — etablovaná po celej Európe, Severnej Ázii (Sibír), Japonsku, Číne\n\n**Morfológia:**\n- **Dospelci**: 10 mm, **žltý** s **10 čiernymi pruhmi** na krovkách. Charakteristický vzhľad.\n- **Vajíčko**: 1,5 mm, **oranžovo-žlté**, kladené v zhlukoch 20–60 ks **na spodnej strane** listov\n- **Larva**: 8–15 mm, **červeno-oranžová** s čiernou hlavou a čiernymi bodkami po stranách. 4 instar štádiá.\n- **Kukla**: v pôde 3–5 cm hĺbka\n\n**Životný cyklus:**\n1. **Prezimovanie**: dospelci v pôde 10–20 cm hlboko (nezamrznú)\n2. **Vylezenie**: jar pri teplotách >15 °C (v SR koniec apríla–polovica mája)\n3. **Párenie a kladenie**: dospelci nájdu zemiakové porasty, kladú 200–400 vajíčok/samica\n4. **Larvy** (3–4 týždne): konzumujú listy. **Štádium L4 = najväčšia žravosť** (60 % celkového poškodenia).\n5. **Kuklenie**: v pôde, 1–2 týždne\n6. **Druhá generácia** dospelcov: koniec júla–august\n7. **V SR klíme**: 1–2 generácie ročne (2. generácia len v teplých rokoch)\n\n**Príznaky poškodenia:**\n- **Listy ohryzené**, často len stopky a žilky zostanú\n- **Defoliácia** môže byť 100 % počas 7–14 dní bez ochrany\n- **Plná defoliácia vo vegetácii**: -50 až -100 % výnosu\n- **Hľuzy zostávajú nepoškodené** (mandelinka je listový škodca)\n\n**Boj — chemický:**\n\n**Insekticídy:**\n- **Neonikotinoidy**: thiamethoxam, imidacloprid, clothianidin — **ZAKÁZANÉ v EÚ od 2018** kvôli toxicite pre včely\n- **Spinosad** (Laser) — biopreparát z *Saccharopolyspora spinosa*, EÚ povolený, drahý\n- **Spinetoram** (Delegate) — vyššia účinnosť než spinosad\n- **Chlorantraniliprole** (Coragen) — moderný, na L1-L3 larvy účinný\n- **Cyantraniliprole** (Verimark) — koreňová aplikácia pri výsadbe\n- **Pyretroidy**: lambda-cyhalothrin (Karate) — lacné ale rezistencia\n- **Indoxakarb** (Steward) — alternatíva, starnúca\n\n**Aplikácia timing:**\n- **Kľúčový moment**: L1–L3 larvy (mladé, ľahko kontrolovateľné)\n- **Neskoro (L4)**: účinnosť klesá, larva už 50 % defoliácie spôsobila\n- **Sledovať porast** každých 3–5 dní v rizikovom období\n- **Prahová hodnota**: 30 lariev/100 rastlín = postrek\n\n**Boj — biologický:**\n\n**Predátori a parazitoidi:**\n- **Slunéčka** (*Coccinellidae*) — žerú vajíčka aj mladé larvy\n- **Zlatoočka** (*Chrysoperla*) — žerú vajíčka\n- **Ploštice** (*Podisus, Perillus*) — americké, menej účinné v EÚ\n- **Cizopasné mušky** (*Doryphorophaga*) — vzácne v EÚ\n- **Nie je dostatočne efektívne** pre veľké pole, len v záhrade/biofarme\n\n**Bacillus thuringiensis tenebrionis (BTT):**\n- Baktéria produkujúca toxíny **špecifické pre chrobáky**\n- Komerčne: Novodor, Trichodor\n- **Účinný len na L1-L2 larvy**, vyššie instary tolerantné\n- **Bio-prístup**, vhodný pre záhrady a biofarmu\n\n**Boj — kultúrny:**\n- **Pravidelné striedanie plodín** — aspoň 2 roky medzi zemiakmi na tom istom poli\n- **Odbery rukou** v záhrade (pracné ale 100 % efektívne pre malé plochy)\n- **Sieťové bariéry** — mladý porast sa zakryje sieťou (drahé, len pre vzácne odrody)\n- **Pluhovanie na jeseň** — vyženie niektoré dospelce z prezimovania\n\n**Rezistentné odrody:**\n- **Solanum chacoense** — divoký zemiak, genetický zdroj rezistencie\n- **Sárka, Sárpo Mira** — čiastočná tolerancia\n- **Geneticky modifikované zemiaky** (BT-zemiaky) — vyradené z EÚ regulačnej scény 1990s, NABLAH a ďalšie\n\n**Rezistencia patogéna na pesticídy:**\n- Mandelinka je **šampión rezistencie medzi škodcami**\n- DDT (1950s), pyretroidy (1980s), neonikotinoidy (2010s) — postupne prelomené\n- **Resistance management**: rotovať 2–3 rôzne triedy insekticídov na sezónu\n\n**Ekonomika:**\n- **Postrek**: 800–1 500 Kč/ha (1 aplikácia)\n- **Sezónne**: 2–4 postreky × 1 200 = **2 400–4 800 Kč/ha**\n- **Návratnosť**: 5–10× (bez postreku 80 % strata = 80 000+ Kč/ha)\n\n**Klimatická zmena:**\n- Teplejšie zimy = lepšie prezimovanie\n- Dlhšia vegetačná doba = 2 generácie pravidelne (skôr vzácne)\n- **Posun severného areálu** do Škandinávie\n\nV kultúre: **„Americký chrobák\"** bol propagandistický symbol v 1950s (Studená vojna — Sovieti tvrdili, že USA shazujú mandelinky z lietadiel na CSR a NDR pre sabotáž poľnohospodárstva).\n\nViz tiež [[zemiak]], [[pleseň-zemiaková]], [[insekticídy]].",
    "related": [
      "zemak",
      "plisen-bramborova",
      "insekticidy"
    ]
  },
  {
    "slug": "msice-repna",
    "term": "Voška repná",
    "alias": [
      "Aphis fabae",
      "black bean aphid",
      "voška čierna"
    ],
    "kategorie": "ochrana",
    "shortDef": "Voška repná (Aphis fabae) je drobný hmyz sajúci šťavy z repy, fazule, maku, hlivy. Sama o sebe nie je príliš škodlivá, ale prenáša vírus žltej mozaiky repy (BYV) — vírus znižuje cukornatosť cukrovky o 20–40 %.",
    "longDef": "Voška repná (lat. *Aphis fabae*, ang. *black bean aphid*) je **čierna / tmavohnedá voška** sajúca šťavy hostiteľských rastlín. Sama o sebe stredne škodlivá, ale **kľúčový vektor vírusov** v cukrovke, fazuli, maku.\n\n**Vzhľad:**\n- **Dospelý jedinec** 2 mm, **čierny / tmavohnedý**, často s voskovým povlakom\n- **Bezkřídlá forma** (vivipara) — letné rozmnožovanie\n- **Okřídlená forma** (alata) — disperzná generácia, šírenie na nové porasty\n- **Líhně** (nymfy) — svetlozelené, neskôr tmavé\n\n**Hostitelia:**\n\n**Primárne** (zima):\n- **Bršlen európsky** (Euonymus europaeus) — hlavný zimný hostiteľ v EÚ\n- **Kalina** (Viburnum)\n- **Lopúch** (menej častý)\n\n**Sekundárne** (leto):\n- **Cukrovka, kŕmna repa**\n- **Fazuľa obyčajná** (Phaseolus vulgaris)\n- **Mak** (Papaver)\n- **Lebeda** (Atriplex)\n- **Púpava, iné Compositae**\n\n**Životný cyklus:**\n1. **Zima**: vajíčka kladené na bršlen, kalinu\n2. **Jar**: bezkrídlé samice sa roja na bršlene\n3. **Okřídlené dispersers**: letia na repu, fazuľu (máj–jún)\n4. **Vrchol populácie**: koniec júna–júl, na repe a fazuli\n5. **Návrat na bršlen**: koniec leta–jeseň, kladenie vajíčok\n6. **V CZ**: 10–15 generácií letný cyklus\n\n**Symptómy priameho poškodenia:**\n- **Listy stočené, skrútené**\n- **Kolónie vošiek** na spodnej strane listov (často 100+ jedincov na list)\n- **Medovica** (sweet excret) — lepkavé povlaky → rast sadzí\n- **Znížený rast** rastliny\n\n**Kľúčový problém — vírusy:**\n\n**BYV (Beet Yellows Virus, vírus žltačky repy):**\n- Voška naskočí na chorú rastlinu → cucá vírusy → letí na zdravú → infikuje\n- **Symptómy**: žlté listy repy, redukcia fotosyntézy\n- **Strata cukornatosti**: -20 až -40 % (cukrovka)\n- **Šírenie**: 1 jediná infikovaná voška môže nakaziť desiatky rastlín\n\n**BMYV (Beet Mild Yellowing Virus):**\n- Menej agresívny než BYV ale rozšírený\n\n**BWYV (Beet Western Yellows Virus):**\n- Aj repka, brukvovité\n\n**Boj — chemický:**\n\n**Insekticídy:**\n- **Neonikotinoidy** (thiamethoxam, imidacloprid) — **ZAKÁZANÉ v EÚ pre vonkajšie použitie od 2018** kvôli včelám. Predtým štandardné moridlo cukrovky.\n- **Acetamiprid** (Mospilan) — neonikotinoid stále povolený v EÚ (iná chemická štruktúra)\n- **Flonicamid** (Teppeki) — anti-feedant, **moderný štandard 2020s** pre cukrovku\n- **Spirotetramat** (Movento) — systémový, pôsobí aj v spodnej strane listov\n- **Pirimicarb** (Aphox) — selektívny voškocíd, šetrný k benefitom (ladybugs)\n- **Pyretroidy** (cypermethrin, deltamethrin) — krátka účinnosť, rezistencia rýchla\n\n**Aplikácia timing:**\n- **Prvý postrek**: pri zistení 10 vošiek/rastlinu alebo 5 % rastlín s voškami\n- **Opakovanie**: za 7–14 dní (záleží na látke)\n- **Sezónne celkom**: 2–4 postreky v cukrovke\n\n**Náklady**: 600–1 200 Kč/ha za postrek × 3 = 1 800–3 600 Kč/ha sezónne\n\n**Boj — biologický:**\n- **Lienky** (Coccinellidae) — efektívne, 1 lienka zožerie 50 vošiek/deň\n- **Zlatoočky** (Chrysoperla)\n- **Voškári** (Aphidius spp., Praon spp.) — parazitické osičky, kladú vajíčka do vošky\n- **Kvetinové pásy** okolo polí zvyšujú populáciu predátorov\n- **Huby** (Beauveria, Metarhizium) — entomopatogénne, menej účinné v poli\n\n**Boj — kultúrny:**\n- **Odstránenie bršlenu** (zimný hostiteľ) v okolí cukrovkových polí — preventívne\n- **Skoré siatie** cukrovky → porast má viac vegetácie pred vrcholom vošiek\n- **Rezistentné odrody** cukrovky — čiastočná tolerancia k BYV (donor *Beta maritima*)\n\n**Bio prístup:**\n- **Mydlový roztok** (draslové mydlo) — fyzikálne poškodenie vošiek\n- **Neem olej** (azadirachtin) — prírodný pesticíd, obmedzený efekt\n- **Pyrethrum** (z chryzantém) — krátka účinnosť, EÚ povolené\n\n**Klimatická zmena:**\n- **Teplé zimy** → vošky prezimujú aj ako dospelci (nielen ako vajíčka), viac generácií\n- **Suchšie jari** → menšia populácia (voška preferuje vlhko)\n- **Posun areálu** na sever\n\n**V ČR výskum**: Cukrovarnícky výskumný ústav Praha, ÚKZÚZ — monitoring vírusu BYV, pruhovanie polí pre modeláciu rizika.\n\nViz tiež [[insekticídy]], [[mandelinka-zemiaková]], [[osevný-postup]].",
    "related": [
      "insekticidy",
      "mandelinka-bramborova"
    ]
  },
  {
    "slug": "zavijec-kukuricny",
    "term": "Zavíjač kukuričný",
    "alias": [
      "Ostrinia nubilalis",
      "European Corn Borer",
      "ECB",
      "kukuričná zavíjačka"
    ],
    "kategorie": "ochrana",
    "shortDef": "Zavíjač kukuričný (Ostrinia nubilalis) je motýľ, ktorého húsenice sa vŕtajú do stebiel a klasov kukurice. Bez ochrany strata 5–25 % výnosu + vstup húb Fusarium = mykotoxíny. V CZ rozšírený najmä na južnej Morave a Polabí.",
    "longDef": "Zavíjač kukuričný (lat. *Ostrinia nubilalis*, ang. *European Corn Borer*, ECB) je **motýľ** z čeľade *Crambidae*. Jeho **húsenice sa vŕtajú do stebiel, klasov a palíc kukurice**, spôsobujúc priame straty + sekundárnu infekciu hubami *Fusarium* (mykotoxíny — viď [[fuzarioza]]).\n\n**Vzhľad:**\n- **Dospelý jedinec**: motýľ, rozpätie 25–30 mm, **bledé žlté krídla** s vlnitými hnedými prúžkami. Samec tmavší než samica.\n- **Vajíčko**: 1 mm, **ploché šupinky** v zhlukoch 15–30 ks na spodnej strane listov\n- **Húsenica**: 25 mm, **šedo-ružová s tmavou hlavou**, 5 instar štádií\n- **Kukla**: v steble kukurice, hnedá\n\n**Životný cyklus v CZ:**\n\n**Severný areál (Krkonoše, Vysočina)** — **1 generácia ročne**:\n- Máj–jún: motýle lietajú\n- Jún–júl: húsenice v rastlinách\n- August: kuklenie\n- September–október: motýle druhej krátkej generácie (často neútočia)\n- November–marec: húsenice prezimujú v zvyškoch rastlín (slame, kukuričnej stočisti)\n\n**Južný areál (Slovácko, Polabí)** — **2 generácie ročne**:\n- 1. generácia: máj–júl\n- 2. generácia: august–október\n- Druhá generácia spôsobuje **vážnejšie straty** (väčšia rastlina, väčšie húsenice)\n\n**Symptómy poškodenia:**\n\n**Steblo:**\n- **Otvorené diery** (hĺbka 5–20 mm) — vstupný bod húsenice\n- **Skĺznutie stebla** počas silného vetra/dážďa (broken stalks)\n- **Otrasy žltého prachu** okolo vstupného otvoru (exkrementy húsenice)\n\n**List:**\n- **Otvorené diery v listoch** (mladá húsenica niekedy ohryzáva listy než vlezie do stebla)\n- **Brokátový vzhľad** (pinhole damage)\n\n**Palica (zber):**\n- **Húsenice v palici** — žerú zrná\n- **Otvorené diery na klase** — vstup pre *Fusarium*, *Aspergillus* — **mykotoxíny**\n- **Znížený výnos**: 5–25 % primárny, +10–30 % sekundárny kvôli hubám\n\n**Boj — chemický:**\n\n**Insekticídy** (aplikácia v larválnom štádiu, nie dospelce):\n- **Spinosad** (Laser) — bio, fungovali na L1-L2\n- **Spinetoram** (Delegate) — silnejšia verzia\n- **Chlorantraniliprol** (Coragen) — moderný štandard, vysoká účinnosť\n- **Cyantraniliprol** (Verimark) — alternatíva\n- **Indoxakarb** (Steward) — starnúci\n- **Pyretroidy** (lambda-cyhalothrin) — krátka účinnosť\n\n**Aplikácia timing — KRITICKÉ:**\n- **Pred vstupom do stebla**: húsenica L1-L3 ešte na listoch → cieľ postreku\n- **Po vstupe do stebla**: insekticíd nemá prístup, **postrek zlyháva**\n- **Timing**: 7–10 dní po vrchole letu motýľov (feromónové lapače)\n- **Monitorovanie**: feromónové lapače v poliach, sledovanie pravidelne\n\n**Ošetrenie je drahé a neisté** pre siláž — náklady 1 000–2 000 Kč/ha + obtiažne timing. Mnoho fariem **vynecháva**.\n\n**Boj — biologický:**\n\n**Trichogramma spp.** (parazitická osička):\n- **Klade vajíčka do vajíčok ECB** → 50–80 % parazitácia\n- **Aplikácia**: lepiace karty s osičkami zavesené v poli (5 000 osičiek/ha)\n- **Cena**: ~800–1 500 Kč/ha\n- **Účinnosť**: porovnateľná s insekticídom, **bio prístup**\n- **Trh**: AgriCom, BBM, BioActiv\n\n**Bacillus thuringiensis kurstaki (BTK):**\n- Baktéria s toxínom **špecifickým pre motýle** (lepidopterans)\n- Komerčne: Lepinox, Dipel, Foray\n- **Spojené s biopaliva sezónou** (až do 10 dní účinnosť)\n\n**GMO kukurica MON810 (BT-corn):**\n- **Vlastná rezistencia** — kukurica produkuje *Bt* toxín\n- **EU zákaz pestovania** (len výnimky: Španielsko, Portugalsko)\n- **V CZ nie je zaregistrovaná** na pestovanie\n\n**Boj — kultúrny:**\n\n**Kľúčové preventívne opatrenie:**\n- **Oranie po zbere** — zaorá kukuričnú slamu s húsenicami → zníženie populácie 50–80 %\n- **Drvenie / mulčovanie stočišťa** — ničí úkryt\n- **Predplodina** (krátka sezóna) — menej tlaku\n- **No-till + kukuričná slama na povrchu** = NAJHORŠIE podmienky pre ECB\n\n**Rezistencia patogéna:**\n- ECB bol rezistentný na **MON810 Bt** v Brazílii a USA (2010s) — populácia pole-evolved\n- V EU bez plošného použitia Bt zatiaľ rezistencia pomalá\n\n**Klimatická zmena:**\n- 2. generácia na sever — Slovácko v 2020s pravidelne, skôr len výnimočne\n- Teplejšie jesene → väčšie prežitie húseníc\n- Posun areálu na sever Európy\n\n**Ekonomický dopad:**\n- **Bez ochrany**: strata 5–25 % výnosu + 5–15 % cena za kontamináciu mykotoxínmi\n- **Sezónna strata na 100 ha kukurice**: 50 000 – 250 000 Kč\n- **Náklady ochrany**: 1 000–2 500 Kč/ha\n- **Návratnosť**: 5–20× pri silnom tlaku\n\n**V ČR**: hlavný problém pre **silážnu kukuricu** (južná Morava, Slovácko, Olomoucko). Zrnová kukurica menej problém (zber pred vrcholom 2. generácie).\n\nViď tiež [[fuzarioza]], [[insekticídy]], [[kukuričná-siláž]], [[no-till]].",
    "related": [
      "fuzarioza",
      "insekticidy",
      "kukurice-silazni",
      "no-till"
    ]
  },
  {
    "slug": "fungicidy",
    "term": "Fungicídy",
    "alias": [
      "fungicides",
      "protihubové prípravky",
      "mykocidné postreky"
    ],
    "kategorie": "ochrana",
    "shortDef": "Fungicídy sú chemické prípravky proti hubovým chorobám rastlín. Kľúčové triedy: triazoly (DMI), strobiluríny (QoI), SDHI, kontaktné (mancozeb, meď). Náklad na jednu aplikáciu sa líši podľa triedy a značky prípravku — aktuálne ceny majú distribútori.",
    "longDef": "Fungicídy (z latinského *fungus* + *caedere* = huba + zabíjať) sú **chemické prípravky určené na ochranu rastlín pred hubovými chorobami**. V EÚ regulované nariadením EC 1107/2009. Na Slovensku prípravky na ochranu rastlín registruje **ÚKSÚP** (Ústredný kontrolný a skúšobný ústav poľnohospodársky v Bratislave).\n\n**Hlavné triedy fungicídov:**\n\n**1. Triazoly (DMI — DeMethylation Inhibitors):**\n- **Mechanizmus**: blokujú biosyntézu ergosterolu (membrána hubovej bunky)\n- **Hlavní zástupcovia**: tebuconazol, propiconazol, prothiokonazol (Proline), metconazol, epoxiconazol (vyrazený 2020s)\n- **Spektrum**: široké — septorióza, rzi, fuzarióza, padlí\n- **Účinnosť**: stredne-vysoká, **systemicky** (proniká listom)\n- **Rezistencia**: po 30 rokoch používania **slábnu na septoriózu**, ale stále základ\n- **Relatívny náklad**: podľa triedy, aktuálne ceny u distribútorov\n- **Pozn.**: tebuconazol u repky chráni pred fómou (*Leptosphaeria maculans*)\n\n**2. Strobiluríny (QoI — Quinone outside Inhibitors):**\n- **Mechanizmus**: inhibujú mitochondriálne dýchanie (cyt b)\n- **Hlavní zástupcovia**: azoxystrobin (Amistar), pyraclostrobin (Comet), trifloxystrobin (Flint), kresoxim-methyl\n- **Spektrum**: padlí, rzi, **NIKOLIV septorióza** (rezistencia prelomená 2003)\n- **Účinnosť**: vysoká pre padlí a rzi\n- **Špeciálne efekty**: **„green effect\"** — predlžuje zelenú fázu listu o 7–10 dní → +5 % výnos\n- **Rezistencia**: silná pre septoriózu, šíri sa v ďalších patogénoch\n- **Relatívny náklad**: podľa triedy, aktuálne ceny u distribútorov\n\n**3. SDHI (Succinate Dehydrogenase Inhibitors):**\n- **Mechanizmus**: blokujú komplex II mitochondriálneho dýchania\n- **Hlavní zástupcovia**: fluxapyroxad (Imtrex), bixafen (Aviator), benzovindiflupyr (Solatenol), pydiflumetofen (Adepidyn)\n- **Spektrum**: septorióza, fuzarióza, padlí, rzi\n- **Účinnosť**: TOP 2020s — silnejšie než triazoly\n- **Rezistencia**: zatiaľ mierna\n- **Relatívny náklad**: podľa triedy, aktuálne ceny u distribútorov\n- **Typická aplikácia**: SDHI + triazol mix = strieborný štandard pre pšenicu\n\n**4. Inatreq active (fenpicoxamid) — nová trieda:**\n- **Mechanizmus**: NOVÝ MOA (Quinone Inside Inhibitor, QiI)\n- **Účinnosť**: vysoká na septoriózu, žiadna doterajšia rezistencia\n- **Relatívny náklad**: podľa triedy, aktuálne ceny u distribútorov\n- **Trh**: Univoq (Corteva), 2021+\n\n**5. Mefentrifluconazole (Revysol) — nová DMI:**\n- **Mechanizmus**: pokročilý DMI, aktívny aj proti rezistentným kmeňom\n- **Relatívny náklad**: podľa triedy, aktuálne ceny u distribútorov\n- **Trh**: Revysol, Revystar (BASF), 2020+\n\n**6. Kontaktné fungicídy (multisite):**\n\n- **Mancozeb** (Dithane M-45, Penncozeb)\n  - **Mechanizmus**: multi-site (nie je možné vytvoriť rezistenciu)\n  - **EÚ**: zákaz **2024** (potenciálne karcinogénne podľa ECHA classification)\n  - **Relatívny náklad**: podľa triedy, aktuálne ceny u distribútorov (lacný)\n\n- **Meď** (CuSO₄, Cu hydroxid, oxychlorid)\n  - **Bio i konvenčné**: povolená v EÚ bio\n  - **Limit**: 4 kg Cu/ha/rok od 2019\n  - **Použitie**: pleseň zemiaková, pleseň vínnej révy, peronospora\n  - **Relatívny náklad**: podľa triedy, aktuálne ceny u distribútorov\n\n- **Síra (S)**\n  - **Bio prístup**: padlí, roztoče\n  - **Relatívny náklad**: podľa triedy, aktuálne ceny u distribútorov\n\n- **Folpet**\n  - **Multisite alternatíva k mancozebu**\n  - **Relatívny náklad**: podľa triedy, aktuálne ceny u distribútorov\n\n**7. Anilinopyrimidíny (AP):**\n- **Mechanizmus**: biosyntéza metionínu\n- **Zástupcovia**: pyrimethanil, cyprodinil\n- **Spektrum**: padlí, monilióza\n\n**8. Cymoxanil:**\n- **Krátka účinnosť** (3–4 dni)\n- **Vždy v kombinácii** s mancozebom alebo metalaxylom\n- **Použitie**: pleseň zemiaková (kuratívny efekt)\n\n**9. Metalaxyl-M (oomyceta-specific):**\n- **Mechanizmus**: RNA polymeráza I (špecifické pre oomycety)\n- **Použitie**: pleseň zemiaková, pleseň révy\n- **Rezistencia**: vysoká (od 1980s)\n\n**Aplikačná technika:**\n\n**Postrekovač** (sprayer):\n- **Nesený** (na traktore, 600–1 200 l zásobník) — malé farmy\n- **Tažený** (1 500–4 500 l) — stredné\n- **Samojazdný** (Berthoud, Amazone Pantera) — veľké farmy\n- **Pracovný záber**: 18–36 m\n\n**Tryska a tlak:**\n- **Plochový pohyb**: 200–400 l vody/ha, tlak 2–4 bary\n- **Jemné rozprášenie**: lepšie pokrytie ale väčší drift (snos do okolia)\n- **Hrubé rozprášenie**: menej driftu, ale horšie pokrytie\n\n**Kombinácia s adjuvantom (povrchové činidlo):**\n- **Olej** (Mero, Adigor) — zvyšuje retention na liste\n- **Smáčadlo** (Trend, Silwet) — znižuje povrchové napätie, lepšie pokrytie\n- **Penetrant**: rýchlejší vstup do listu\n\n**Rezistencia — anti-resistance stratégie:**\n1. **MIX rôznych MOA** (mechanizmus účinku) v každom postreku\n2. **Maximum 1× sezónu** rovnakú MOA\n3. **Rotácia** — rôzne MOA medzi postrekmi\n4. **Spojenie s rezistentnými odrodami**\n5. **Spojenie s agrotechnikou** (zaorávanie, hustota porastu)\n\n**Sezónny kalendár — pšenica (typický 2024):**\n- **T0** (BBCH 30): protiseptoriózový — triazol\n- **T1** (BBCH 32): septoria + rzi — SDHI + triazol\n- **T2** (BBCH 39): flag leaf — SDHI + triazol (NEJCENNEJŠÍ)\n- **T3** (BBCH 63): fuzarióza — triazol\n- **Sezónne**:podľa cenníka distribútora\n\n**Návratnosť:**\n- **Bez fungicídov**: -30 až -50 % výnos\n- **Postrek T2 alone**: -10 až -20 % vs full program\n- **Plný program**: max výnos\n- **Návratnosť full program**: 4–6× v rizikovom roku\n\n**EÚ regulácie:**\n- **REACH** — autorizácia účinných látok\n- **MRL** (Maximum Residue Limits) — limity zvyškov v jedle\n- **Buffer zones** — povinné nepostrekovať 5–20 m od vodných tokov\n- **PPE** — povinné OOP (rukavice, respirátor) pri aplikácii\n- **Zákazy**:\n  - **Neonikotinoidy** (vonkajšie) 2018\n  - **Chlorothalonil** 2019\n  - **Glyfosát** (Roundup) — periodicky obnovované, riziko zákazu\n  - **Mancozeb** 2024\n\nViz tiež [[plisen-bramborova]], [[fuzarioza]], [[septorioza]], [[rzi]], [[insekticidy]], [[herbicidy]].",
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
    "term": "Herbicídy",
    "alias": [
      "herbicides",
      "protirostlinné prípravky",
      "protiplevelné postreky"
    ],
    "kategorie": "ochrana",
    "shortDef": "Herbicídy sú prípravky proti burinám. Glyfosát (Roundup) je najpoužívanejší. Selektívne herbicídy ničia len určité druhy burín, totálne zabijú všetko. Globálny trh 30+ mld USD/rok, kľúčový pre moderné poľnohospodárstvo.",
    "longDef": "Herbicídy (z lat. *herba* = bylina + *caedere* = zabíjať) sú **prípravky proti burinám**. Kľúčový pesticídny segment — bez herbicídov by súčasné výnosy klesli o 30–50 % a manuálne plenie by bolo ekonomicky nemožné na veľkých plochách.\n\n**Delenie podľa selektivity:**\n\n**Totálne (neselektívne)** — zabijú všetky rastliny:\n- **Glyfosát** (Roundup) — viď [[roundup]]\n- **Glufosinát** (Basta) — alternatíva\n- **Diquat** (Reglone) — desikant\n- **Paraquat** — **zakázané v EU od 2007**\n\n**Selektívne** — ničia len určité druhy:\n\n**Dvojklíčnolistové (širokolisté buriny) v obilí:**\n- **MCPA, 2,4-D** (Glean, Banvel) — stará trieda, lacná\n- **Sulfonylmočoviny** (Granstar, Hussar) — moderné, dávky 10–30 g/ha\n- **Triazinóny** (metribuzin) — zemiaky\n\n**Jednoklíčnolistové (trávy) v širokolistých plodinách:**\n- **Quizalofop-p-ethyl** (Targa, Leopard) — repka, sója\n- **Fluazifop-p-butyl** (Fusilade) — alternatíva\n- **Clethodim** (Centurion) — sója\n\n**Pre-emergence (pred vzídením):**\n- **Pendimethalin** (Stomp, Activus) — koreňový herbicíd\n- **S-metolachlor** (Dual Gold) — kukurica\n- **Metribuzin** — zemiaky\n- **Aplikácia**: pred vzídením burín, 2-7 dní po siatí\n\n**Post-emergence (po vzídení):**\n- **Mesotrione** (Callisto) — kukurica, šetrná\n- **Foramsulfuron** (Maister) — kukurica\n- **Mesosulfuron + iodosulfuron** (Atlantis) — graminicíd v pšenici\n\n**Mechanizmus účinku (MOA — HRAC groups):**\n\n**1. EPSPS inhibítory** (Group 9): glyfosát\n**2. AHAS inhibítory** (Group 2): sulfonylmočoviny, imidazolinóny — najviac rezistencií\n**3. ACCase inhibítory** (Group 1): graminicídy (Fusilade, Targa) — vysoká rezistencia\n**4. PSII inhibítory** (Group 5): triazíny (atrazín — zakázaný 2007)\n**5. PPO inhibítory** (Group 14): carfentrazone, sulfentrazone\n**6. HPPD inhibítory** (Group 27): mesotrione, isoxaflutole — kukurica\n**7. Mitóza inhibítory** (Group 3): pendimethalin\n**8. Celulóza syntéza** (Group 29): isoxaben\n\n**Glyfosát (Roundup) — detail:**\nViď [[roundup]] pre plný profil.\n\n- **Mechanizmus**: blokuje EPSPS enzým (syntéza aromatických aminokyselín)\n- **Spektrum**: totálne (mimo Roundup Ready GMO plodín)\n- **Aplikácia**: pred siatím, **stoolovanie** (medzi riadkami), desikácia (približne 10 dní pred zberom)\n- **Cena**: 250–500 Kč/ha (jeden z najlacnejších herbicídov)\n- **Globálny trh**: 800 000 t/rok, 30 % všetkých herbicídov\n- **EU regulácia**: schválenie obnovené do 2033\n\n**Kľúčové buriny v CZ a ich herbicídy:**\n\n**V pšenici:**\n- **Svízel prítula** (Galium aparine): Granstar, Hussar OD, Salsa\n- **Harmanček pravý** (Matricaria chamomilla): MCPA, sulfonylmočoviny\n- **Chundelka metlica** (Apera spica-venti): Atlantis OD, Pacifica Plus\n- **Lipnica** (Poa annua): Atlantis OD\n- **Pýr plazivý** (Elymus repens): glyfosát pred siatím alebo na strnisko\n\n**V kukurici:**\n- **Merlík biely** (Chenopodium album): Callisto, Maister Power\n- **Lebeda** (Atriplex): Callisto, Stomp\n- **Béry** (Setaria): Maister\n- **Ohnica** (Sinapis arvensis): Casper\n\n**V repke:**\n- **Harmanček**: Galera (clopyralid + picloram)\n- **Smetanka**: Galera\n- **Pýr**: Fusilade Forte (len v repke)\n\n**V cukrovke:**\n- **Merlík, lebeda**: Goltix (metamitron) + Betanal (phenmedipham) + Pyramin\n- **Bér, vlčí mak**: Betanal kombinácia\n\n**Rezistencia k herbicídom:**\n\n**Globálny problém 2010s+**:\n- **Amaranth palmerii** v USA — rezistencia na glyfosát, sulfonylmočoviny, HPPD\n- **Lolium spp.** v Austrálii — multi-rezistencia, „herbicide superweeds\"\n- **Chundelka metlica** v EU — rezistencia k ACCase i AHAS inhibítorom\n\n**Strategie anti-rezistencia:**\n1. **Rotácia MOA** — rôzne herbicídy v rôznych rokoch\n2. **Mix MOA** — kombinácia v jednom postreku\n3. **Mechanická kontrola** — orba, plečka v medziradkoch\n4. **Cover crops** — krycie plodiny znižujú buriny\n5. **Manuálna** — kontrola hniezd rezistencie\n\n**Bioherbicídy:**\n- **Acetate** (Beloukha) — kyselina pelargonová, z prírodných zdrojov\n- **Octová kyselina** (vinegar) — pre malé plochy\n- **Termálne** — propánové horáky pre pásové herbicídy\n- **Cena**: 5–20× drahšie než glyfosát\n\n**Aplikácia technika:**\n- **Postrekovač** (ako fungicídy) — 200–400 l vody/ha\n- **Tryska**: väčšinou jemnejšia (jednoduchá injekcia) než pre fungicídy\n- **Mix s adjuvantom**: smáčadlo zlepší účinnosť\n- **Pozor na drift** — herbicíd môže poškodiť susedné plodiny\n\n**Náklady — pre typickú pšenicu:**\n- **Pre-emergence**: 600–1 200 Kč/ha\n- **Post-emergence** (jar): 800–1 500 Kč/ha\n- **Desikácia** (pred zberom): 300–500 Kč/ha (Roundup, Reglone)\n- **Sezónne**: 1 700–3 200 Kč/ha\n\n**Pre kukuricu:**\n- **Pre-emergence**: 1 200–2 000 Kč/ha (Lumax — typický mix)\n- **Post-emergence**: 1 000–1 800 Kč/ha (Callisto + atrazín alternatíva)\n\n**EU regulácia:**\n- **Neonikotinoidy a glyfosát**: kontroverzné, ale zatiaľ povolené (s obmedzeniami)\n- **Chlorthal-dimethyl, atrazín, paraquat**: zákazy 2007+\n- **MRL** — maximum residue limits v potravinách\n- **Bufferzóny** — 5–10 m od vodných tokov\n\nViď tiež [[roundup]], [[fungicídy]], [[insekticídy]], [[desikácia]], [[ozim-jarin]].",
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
    "term": "Insekticídy",
    "alias": [
      "insecticides",
      "protiherzí prípravky",
      "protihmyzné postreky"
    ],
    "kategorie": "ochrana",
    "shortDef": "Insekticídy sú prípravky proti škodlivému hmyzu. Kľúčové triedy: pyretroidy (lambda-cyhalothrin), neonikotinoidy (ZAKÁZANÉ v EÚ 2018 pre vonkajšie použitie), modernejšie diamidy a spinosyny. Cena postreku v ČR 600–2 000 Kč/ha.",
    "longDef": "Insekticídy (z lat. *insectum* + *caedere* = hmyz + zabíjať) sú **prípravky proti škodlivému hmyzu**. Kľúčový segment ochrany rastlín — bez insekticídov by straty z vošiek, mandelinky, zavíjačov boli katastrofálne.\n\n**Hlavné triedy insekticídov (IRAC groups):**\n\n**1. Pyretroidy** (Group 3 — sodium channel modulators):\n- **Mechanizmus**: blokujú sodíkové kanály v nervovom systéme hmyzu\n- **Hlavní zástupcovia**:\n  - **Lambda-cyhalothrin** (Karate Zeon) — široké spektrum\n  - **Deltamethrin** (Decis) — populárny\n  - **Cypermethrin** (Cyperkill) — lacný\n  - **Bifenthrin** — Lambda alternatíva\n  - **Tau-fluvalinate** — selektívnejší (vždy med-bee safer)\n- **Spektrum**: široké — vošky, chrobáky, larvy motýľov, ploštice\n- **Účinnosť**: rýchla (knockdown), ale krátka (7-10 dní)\n- **Rezistencia**: rozsiahla (od 1980s) — vošky, mandelinka, klopuška repná\n- **Toxicita**: vysoká pre včely (NEpostrekovať v rozkvete!)\n- **Cena**: 200–500 Kč/ha (lacné)\n\n**2. Neonikotinoidy** (Group 4 — nicotinic acetylcholine receptor):\n- **Mechanizmus**: agonisti acetylcholín receptorov (ako nikotín u človeka)\n- **Hlavní zástupcovia**:\n  - **Imidacloprid** (Confidor, Gaucho) — historicky #1\n  - **Thiamethoxam** (Actara, Cruiser)\n  - **Clothianidin** (Poncho) — najmä v morení osív kukurice\n  - **Acetamiprid** (Mospilan) — STÁLE povolený v EÚ\n- **EÚ zákaz** — vonkajšie použitie od 2018 pre thiamethoxam, clothianidin, imidacloprid. **Acetamiprid stále povolený**.\n- **Dôvod zákazu**: vysoká toxicita pre **včely a opeľovače**\n- **Cena**: 300–600 Kč/ha (acetamiprid)\n- **Systémové pôsobenie**: pohybuje sa v rastline, dlhodobá ochrana (2-4 týždne)\n\n**3. Diamidy** (Group 28 — ryanodine receptor modulators):\n- **Mechanizmus**: stále otváranie kalciových kanálov v svaloch hmyzu → paralýza\n- **Hlavní zástupcovia**:\n  - **Chlorantraniliprole** (Coragen) — kukurica, zemiak\n  - **Cyantraniliprole** (Verimark) — morenie osív, systémicky\n  - **Flubendiamide** (Belt) — niektoré EÚ krajiny obmedzené\n- **Spektrum**: motýle (húsenice), chrobáky (mandelinka), niektoré mušky\n- **Bezpečnosť**: ŠETRNÁ k včelám a benefitom\n- **Cena**: 1 000–2 000 Kč/ha (drahá)\n- **Rezistencia**: zatiaľ mierna\n- **Trh**: rýchlo rastúci 2010s+\n\n**4. Spinosyny** (Group 5 — nicotinic acetylcholine receptor, iný site):\n- **Mechanizmus**: agonisti acetylcholín receptorov (iný binding site než neonikotinoidy)\n- **Hlavní zástupcovia**:\n  - **Spinosad** (Laser) — bio aj konvenčné, z baktérie *Saccharopolyspora spinosa*\n  - **Spinetoram** (Delegate) — silnejšia verzia\n- **Spektrum**: motýle, mandelinka, vrtule\n- **Bezpečnosť**: nízka toxicita pre cicavce, **stredná pre včely** (postrekovať večer)\n- **Cena**: 800–1 500 Kč/ha\n\n**5. Anti-feedants / Růstové regulátory:**\n\n- **Flonicamid** (Teppeki) — anti-feedant pre vošky. Zastaví kŕmenie počas 1-2 h.\n  - **Bezpečné** pre včely\n  - **Cena**: 800–1 200 Kč/ha\n  - **Použitie**: cukrovka, zemiak, ovocie\n\n- **Pymetrozin** (Plenum) — vošky. EÚ zákaz 2019.\n\n- **Buprofezin** (Applaud) — chitin syntéza inhibitor. Růstový regulátor pre nymfálne štádiá.\n\n- **Indoxakarb** (Steward, Avaunt) — Group 22, sodium channel blocker. Motýle, mandelinka.\n  - **Cena**: 800–1 500 Kč/ha\n\n**6. Akaricídy (proti roztočom):**\n\n- **Hexythiazox** (Nissorun) — roztočové vajíčka a nymfy\n- **Pyridaben** (Sanmite) — adultné roztoče\n- **Abamectin** (Vertimec) — širšie spektrum\n- **Spirodiclofen** (Envidor) — moderné\n- **Bifenazate** (Floramite) — selektívne\n\n**7. Bio insekticídy:**\n\n- **Bacillus thuringiensis** (BT):\n  - **BT kurstaki (BTK)** — Lepinox, Dipel — motýle (húsenice)\n  - **BT tenebrionis (BTT)** — Novodor — chrobáky (mandelinka L1-L2)\n  - **BT israelensis (BTI)** — komáre, mušky v záhradách\n  - **Bezpečné** pre cicavce, vtáky, ryby — len pre hmyz cieľový\n  - **Krátka účinnosť** (3-7 dní)\n- **Spinosad** (viď vyššie) — bio aj konvenčné certifikácie\n- **Neem olej** (azadirachtin) — z indického neemu, **antifeedant + IGR**\n- **Pyrethrum** — z kvetov chryzantém — krátka účinnosť (1-3 dni)\n- **Beauveria bassiana** — entomopatogénna huba\n\n**Aplikačná technika:**\n\n**Postrekovač** (rovnako ako fungicídy/herbicidy):\n- 200–400 l vody/ha\n- Jemnejšia tryska pre lepšie pokrytie\n\n**Morenie osív** (seed treatment):\n- **Neonikotinoidy** (clothianidin, imidacloprid) — **EÚ zákaz od 2018** pre vonkajšie použitie\n- **Acetamiprid morenie** — povolené, ale menej účinné\n- **Cyantraniliprole morenie** (Verimark) — moderná alternatíva\n\n**Granulát na riadky:**\n- **Fipronil** — fluxax (proti drôtovcom, larvám koreňožravcov)\n- **Tefluthrin** — Force — kukurica\n\n**Aplikácia timing:**\n\n**Mandelinka zemiaková**:\n- L1-L3 larvy (mladé) — postrek\n- 30 lariev/100 rastlín = threshold\n\n**Zavíjač kukuričný**:\n- Po vrchole letu motýľov (feromónové lapače)\n- 7-10 dní po vrchole → húsenice L1-L3\n\n**Vošky**:\n- 10 vošiek/rastlinu = threshold v cukrovke\n- 50+ % rastlín s voškami = postrek v obilí\n\n**Sací škodcovia** (vošky, klopušky):\n- Aplikuje SYSTÉMICKÝ insekticíd (acetamiprid, flonicamid)\n\n**Žrúci škodcovia** (chrobáky, húsenice, larvy):\n- Aplikuje kontaktný alebo žalúdočný (pyretroid, BTK)\n\n**Bezpečnosť pre včely a opeľovače:**\n\n**EÚ regulácia** (od 2018):\n- Väčšina neonikotinoidov ZAKÁZANÝCH vonkajšie\n- Pyretroidy: NEpostrekovať v rozkvete plodín\n- Diamidy, spinosyny: ŠETRNÉ\n- Flonicamid: bezpečné\n\n**Best practice:**\n1. **Postrek večer** (po západe slnka) — včely doma v úli\n2. **NEpostrekovať kvitnúci porast** (pšenica v kvitnutí, slnečnica, repka)\n3. **Informovať susedných včelárov** pred postrekom (zákonná povinnosť v niektorých krajinách)\n4. **Buffer zóny** od kvitnúcich remízok\n5. **Mix s herbicídom** pre zníženie počtu postrekov\n\n**Rezistencia:**\n\n**Šampióni rezistencie:**\n- **Mandelinka zemiaková** — rezistentná k DDT, pyretroidom, neonikotinoidom (in succession)\n- **Slatinská diamantová húsenica** (*Plutella xylostella*) — superresistant\n- **Drosophila suzukii** (Spotted wing drosophila) — rýchla rezistencia\n\n**Strategie:**\n1. **Rotácia MOA** — najmenej 3 rôzne triedy insekticídov\n2. **Mix MOA** v jednom postreku\n3. **Vyhnúť sa** jednému produktu opakovane\n4. **Spojenie s IPM** (Integrated Pest Management)\n\n**IPM (Integrované riadenie škodcov):**\n- **Monitoring**: feromónové lapače, vizuálna kontrola, model rizika\n- **Threshold**: postrek až po prekročení ekonomického prahu\n- **Biológia**: predátori, parazitoidi, BT\n- **Kultúrne**: striedanie, odolné odrody, zaorávanie\n- **Chémia**: ako posledné riešenie, cielene\n\n**Náklady:**\n- **Pyretroid**: 200–500 Kč/ha\n- **Acetamiprid**: 400–700 Kč/ha\n- **Diamid**: 1 000–2 000 Kč/ha\n- **BT bio**: 600–1 200 Kč/ha\n- **Sezónne** (3–5 postrekov): 1 500–5 000 Kč/ha\n\nViz tiež [[mandelinka-zemiaková]], [[voška-repná]], [[zavíjač-kukuričný]], [[fungicídy]], [[herbicidy]].",
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
    "term": "Desikácia",
    "alias": [
      "desikácia",
      "predsklizňové sušenie",
      "preharvest desiccation"
    ],
    "kategorie": "ochrana",
    "shortDef": "Desikácia je predsklizňové vysušenie porastu (repka, slnečnica, zemiaky, hrášok) chemickou cestou. Sjednocuje dozrievanie, znižuje vlhkosť zrna a uľahčuje kombajnovanie. V SR kľúčové pre repku a zemiaky.",
    "longDef": "Desikácia (z lat. *desiccare* = vysušiť) je **chemické predsklizňové vysušenie porastu**. Cieľom je **sjednotiť dozrievanie, znížiť vlhkosť zrna a uľahčiť kombajnovanie**. Kľúčová operácia pre **repku, slnečnicu, zemiaky, hrášok, mak, ľan**.\n\n**Účel desikácie:**\n\n1. **Sjednotenie dozrievania**: porast zrna nerovnomerne (rôzne fázy kvetu, terminál vs vetvenie). Desikácia zastaví vegetáciu, všetko zrno sa „dorovná\".\n2. **Zníženie vlhkosti zrna**: vlhké zrno (>15 %) nie je možné predať na výkup bez sušenia (drahé). Desikácia zrazí vlhkosť o 5-15 %.\n3. **Uľahčenie kombajnovania**: suchý porast prechádza mlátičkou rýchlejšie, menej strát.\n4. **Sušenie slamy / nati**: u zemiakov podporí odumieranie nati pred sklizňou (predchádza prenosu plesne do hľúz).\n5. **Likvidácia burín**: vyrastené buriny v poraste sú desikované spoločne s plodinou.\n\n**Hlavné desikačné prípravky:**\n\n**1. Glyfosát (Roundup):**\n- **Spektrum**: totálne — všetky zelené rastliny\n- **Použitie**: repka, slnečnica, hrášok, obilniny\n- **Aplikácia**: 10–14 dní pred sklizňou\n- **Dávka**: 1,5–3 l/ha (záleží na koncentrácii prípravku 360 g/l)\n- **Cena**: 250–500 Kč/ha\n- **Výhody**: lacný, systémový (vstupuje do burín → likviduje aj korene)\n- **Pozn.**: EÚ obnovila povolenie do 2033, ale kontroverzné\n\n**2. Diquat (Reglone):**\n- **Mechanizmus**: foto-radikálna oxidácia v chloroplastoch (rýchla oxidácia)\n- **Spektrum**: kontaktný totálny desikant\n- **Použitie**: zemiaky (nať), repka, hrášok, slnečnica\n- **Aplikácia**: 7–10 dní pred sklizňou\n- **Dávka**: 2–3 l/ha\n- **Cena**: 500–900 Kč/ha\n- **Výhody**: veľmi rýchly (3-5 dní efekt), univerzálny\n- **EÚ stav**: **Diquat ZAKÁZANÝ v EÚ od 2019** (toxickosť pre cicavce, vtáky, vodné organizmy)\n- **Alternatívy**: glyfosát alebo glufosinát\n\n**3. Glufosinát (Basta, Liberty):**\n- **Mechanizmus**: inhibítor glutamín syntetázy\n- **Spektrum**: totálne, kontaktné\n- **Použitie**: repka, slnečnica, obilniny\n- **Aplikácia**: 5–8 dní pred sklizňou\n- **Dávka**: 4–5 l/ha\n- **Cena**: 700–1 200 Kč/ha (drahší ako glyfosát)\n- **EÚ stav**: **Glufosinát ZAKÁZANÝ v EÚ od 2018** kvôli reprodukčnej toxicite\n- Trh hľadá alternatívy (kyselina pelargonová, octová)\n\n**4. Pyraflufen-ethyl (Spotlight):**\n- **Mechanizmus**: PPO inhibítor (kontaktný)\n- **Použitie**: zemiaky (nať), polná zelenina\n- **Dávka**: 0,2–0,4 l/ha\n- **Cena**: 1 000–1 500 Kč/ha\n- **EÚ stav**: POVOLENÝ\n\n**5. Karfentrazon-ethyl (Aurora):**\n- **Mechanizmus**: PPO inhibítor\n- **Použitie**: zemiaky, slnečnica\n- **Dávka**: 0,1–0,2 l/ha\n- **EÚ stav**: POVOLENÝ\n\n**6. Mechanická desikácia (alternatíva po EÚ zákazoch):**\n\n- **Drcenie nati zemiakov** — Spedo, Rumptstad — fyzické zničenie listov\n- **Tepelná desikácia** — propanové horáky (drahé, pomaly)\n- **Vyhnívanie prirodzene** — nechať porast dozrievať (dlhšie sklizňové okno, vyššie riziko počasia)\n\n**Desikácia špecifických plodín:**\n\n**Repka ozimá:**\n- **Načasovanie**: BBCH 87–89 (85+ % šešulí dospelých, 80 % zrna hnedé)\n- **Dôvod**: bez desikácie **8–15 % strata** vinou praskania šešulí\n- **Prípravok**: glyfosát 2 l/ha, alternatíva karfentrazon\n- **Načas**: 10–14 dní pred sklizňou\n- **Cena 2024**: 350–500 Kč/ha\n\n**Slnečnica:**\n- **Načasovanie**: BBCH 87–89 (zrno hnedé, obálka úzko robí guľovitú)\n- **Dôvod**: spolu s ozimovou repkou najlepší ROI\n- **Prípravok**: glyfosát 2,5 l/ha\n- **Cena**: 400–600 Kč/ha\n\n**Zemiaky:**\n- **Načasovanie**: 14–21 dní pred sklizňou hľúz\n- **Dôvod**: silná nať = energický kombajn, nemôže prejsť. Takisto prevencia plesňového prenosu (P. infestans) do hľúz.\n- **Prípravok (post-Reglone éra)**: pyraflufen-ethyl, mechanické drvenie, karfentrazon\n- **Cena**: 1 200–1 800 Kč/ha (vyšší ako pre-Reglone éra)\n\n**Hrášok jarný:**\n- **Načasovanie**: BBCH 89 (lusk hnedý)\n- **Dôvod**: hrášok nedozrieva naraz, **nutné sjednotiť**\n- **Prípravok**: glyfosát 2 l/ha\n- **Cena**: 400–600 Kč/ha\n\n**Pšenica:**\n- **Načasovanie**: BBCH 87–89 (zrno tvrdé, mliečny stav minul)\n- **Dôvod**: len u **veľmi vlhkých rokov** (nutnosť rýchlej sklizne pred dažďom)\n- **Prípravok**: glyfosát 2 l/ha\n- **Cena**: 350–500 Kč/ha\n- **Pozn.**: u potravinárskej pšenice **obmedzené použitie** kvôli reziduám glyfosátu (MRL)\n\n**Kontroverzie glyfosátu pri desikácii obilnín:**\n- USA EPA a EFSA: **MRL pre glyfosát v pšenici** 10 mg/kg\n- Bayer / Roundup štúdie ukazujú bezpečné dávky, ale **public concern** vyšší\n- **Mnoho EÚ mlynov odmieta** zrno z desikovaného porastu\n- Trend: desikácia obilnín klesá, repka a zemiaky zostávajú\n\n**Aplikačná technika:**\n\n**Postrekovač**:\n- 200–300 l vody/ha\n- Pozor na **drift** — desikant zničí susedné porasty\n- **Hrubšia tryska** (menej driftu)\n\n**Letecky** (postrek z lietadla / dronu):\n- Pre **ťažko dostupné porasty** (rákos, vodné hospodárstvo)\n- Drahšie (1 500–3 000 Kč/ha)\n- Menej regulačne prijateľné\n\n**EÚ regulácie desikantov:**\n\n**Zakázané v EÚ (2018-2024)**:\n- Diquat (2019)\n- Glufosinát (2018)\n- Mancozeb (2024)\n\n**Riziko zákazu**:\n- **Glyfosát** — pravidelne prehodnocovaný, zatiaľ povolené do 2033\n\n**Alternatívy bez chémie:**\n- **Mechanická desikácia** (drvenie nati u zemiakov)\n- **Tepelná desikácia** (propanové horáky — drahé)\n- **Vyhnívanie prirodzene** (dlhšie okno sklizne, riziko počasia)\n- **Šľachtenie** odrôd s **synchronnejším dozrievaním** (repka)\n\n**Ekonomický dopad:**\n- **Bez desikácie u repky**: 8–15 % strata výnosu = 4 000–8 000 Kč/ha\n- **Desikácia**: 350–500 Kč/ha náklady\n- **Návratnosť**: 8–15× ROI v repke\n\nViz tiež [[roundup]], [[herbicidy]], [[repka-ozimá]], [[zemiak]], [[pleseň-zemiaková]].",
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
    "term": "Pšenica ozimá",
    "alias": [
      "zimná pšenica",
      "Triticum aestivum",
      "ozimka"
    ],
    "kategorie": "plodiny",
    "shortDef": "Pšenica ozimá je najdôležitejšia plodina SR — 800 000+ ha = 30 % ornej pôdy. Seje sa na jeseň (september–október), sklízí v júli–auguste. Výnos 6–8 t/ha, cena 4 500–6 500 Kč/t. Potravinárska trieda A/E alebo krmná podľa hektolitrovej váhy.",
    "longDef": "Pšenica ozimá (lat. *Triticum aestivum*, ang. *winter wheat*) je **najdôležitejšia obilnina v SR** a 2. najpestovanejšia plodina (po kukurici v plochách). V SR pokrýva **800–950 tis. ha** ročne, produkcia **5–7 mil. t**.\n\n**Vlastnosti ozimu vs jarinu (pozri [[ozim-jarin]]):**\n- **Setie**: 15. septembra – 20. októbra (optimálne do 5. októbra v SR)\n- **Vegetácia**: 280–310 dní (prezimuje)\n- **Sklizeň**: 15. júla – 15. augusta\n- **Výnos vs jarná**: o 20–40 % vyšší (využije zimnú vláhu, dlhšia vegetácia)\n\n**Agrotechnika:**\n\n**1. Setie (BBCH 00–09):**\n- **Hĺbka**: 2–4 cm\n- **Vzdialenosť riadkov**: 12,5 cm (úzke), 15 cm (štandard)\n- **Hustota**: 350–450 klíčivých zŕn/m² (= 180–220 kg osiva/ha pre HW 45g)\n- **Odporúčanie**: neskoršie setie (po 1. októbri) = nižšie riziko septoriózy ([[septorioza]]) ale slabší koreňový systém\n- **Predplodina ideálna**: repka, hrášok, strukovina (zanechávajú dusík)\n- **Predplodina riziková**: kukurica (Fusarium [[fuzarioza]]), pšenica (autokoroza)\n\n**2. Jesenný vývoj (BBCH 10–29):**\n- **Cieľ: zima** s 3-4 odnožami, koreňový systém v hĺbke 50+ cm\n- **Hnojenie na jeseň**: 30–40 kg P/ha, 60–80 kg K/ha (NPK 15-15-15 = 200 kg)\n- **Postrek buriny**: jeseň pre-emergence (Stomp + Boxer) alebo skoré jar\n- **Postrek fungicíd**: len pri silnom jesennom tlaku (septoriózy)\n\n**3. Jarný vývoj (BBCH 30–49):**\n- **Regeneračné hnojenie** N (BBCH 25–29): 50–70 kg N/ha (LAV, DAM-390)\n- **Hnojenie BBCH 32**: 40–60 kg N/ha\n- **Hnojenie BBCH 39**: 30–50 kg N/ha + síra (S 20 kg)\n- **Celkom N**: 150–220 kg N/ha (intenzívne) alebo 120–160 (extezívne)\n- **Postreky T1 + T2** (pozri [[fungicidy]]) — SDHI + triazol\n\n**4. Kvetenie a tvorba zrna (BBCH 50–89):**\n- **Postrek T3** (BBCH 63): fuzarióza prevencia\n- **Plnenie zrna**: cca 40 dní (mliečne → voskové → tvrdé)\n- **Kľúčové**: dážď v plnení zvyšuje výnos, sucho zrazí o 20–40 %\n\n**5. Sklizeň (BBCH 90–99):**\n- **Vlhkosť zrna**: 13–15 % optimum (skladovateľné bez sušenia)\n- **Desikácia** (pozri [[desikácia]]): u mokrých rokov glyfosát 10 dní pred sklizňou\n- **Kombajn**: 5–10 ha/h (moderný)\n\n**Výnosy SR 2024:**\n- **Priemer**: 6,2 t/ha\n- **Top farmy** (intenzívne, Stredočeský kraj): 9–12 t/ha\n- **Slabé farmy** (Vysočina, ANC): 4–5 t/ha\n\n**Kvalitatívne triedy** (podľa hektolitrovej váhy a obsahu N):\n\n| Trieda | hl váha | NL (sušina) | Cena (Kč/t 2024) |\n|-------|---------|-------------|------------------|\n| **E** (elite) | 82+ | 14+ % | 6 200–6 500 |\n| **A** | 78–82 | 12,5+ % | 5 800–6 200 |\n| **B** | 76–78 | 11,5+ % | 5 400–5 800 |\n| **C** (krmná) | 74–76 | 10+ % | 4 800–5 200 |\n| **Pod limit** | < 74 | < 10 | 4 200–4 600 |\n\n**Ekonomika 2024:**\n- **Náklady** na 1 ha: 28 000–38 000 Kč (osivo, hnojivá, postreky, palivo, sklizeň)\n- **Výnosy 6,5 t/ha × 5 500 Kč = 35 750 Kč/ha**\n- **Marža**: -2 000 až +5 000 Kč/ha (úzka, citlivá na ceny)\n- **Dotácie BISS + CISS + EKO**: ~5 000–7 000 Kč/ha pridáva maržu\n\n**Odrôdy 2024 (SR trh):**\n- **Bohemia** — toleruje sucho, A trieda\n- **Sailor** — výnos top, B-A trieda\n- **Vlasta** — septoriózová odolnosť\n- **Genius** — krmná, top výnos\n- **RGT Sacramento** (FR import) — A trieda, veľmi rozšírená\n\n**Hlavné choroby:** [[septorioza]] (#1), [[fuzarioza]], [[rzi]]\n\n**Hlavné škodcovia:** vošky (BYDV vektor), kohútik obilný, hrbáč pšeničný\n\n**EÚ regulácie:**\n- **CAP BISS + CISS**: ~3 600 Kč/ha (2024)\n- **EKO režim** (cover crops, no-till): +1 300 Kč/ha\n- **Pšenica v greening**: počíta sa ako „diverzifikácia\" v 5+ plodinovom osevnom postupe\n\nViz tiež [[ozim-jarin]], [[osevný postup]], [[fungicidy]], [[septorioza]], [[fuzarioza]], [[hektolitr]], [[psenice-jarni]].",
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
    "term": "Pšenica jarná",
    "alias": [
      "spring wheat",
      "jarka pšenica"
    ],
    "kategorie": "plodiny",
    "shortDef": "Pšenica jarná je doplnková plodina v CZ — 20 000–40 000 ha (záplata po neúspešnom ozime alebo špecializované odrody). Seje sa v marci–apríli, zberá v auguste. Výnos 4–6 t/ha (o 1–2 t/ha nižší než ozim).",
    "longDef": "Pšenica jarná (lat. *Triticum aestivum* — varieta jarná, ang. *spring wheat*) je **doplnková plodina** v ČR — v normálnych rokoch len 20 000–40 000 ha. Väčšinou ako **náhrada po nevydarenom ozime** (vymrznutie, vyplavenie v zime) alebo špecializované odrody pre pekársku kvalitu.\n\n**Kľúčové rozdiely oproti ozimu (viď [[psenica-ozimna]]):**\n\n| Parameter | Ozim | Jarin |\n|----------|------|-------|\n| Siatie | september–október | marec–apríl |\n| Vegetácia | 280–310 dní | 110–140 dní |\n| Zber | júl–august | august |\n| Výnos | 6–8 t/ha | 4–6 t/ha |\n| Hektolitrová váha | 76–82 kg/hl | 74–78 kg/hl |\n| Kvalitatívna trieda | E/A/B (potrav) | A/B (potrav) alebo kŕmna |\n| N hnojenie | 150–220 kg/ha | 100–140 kg/ha |\n| Náklady | 28–38 tis. Kč/ha | 20–28 tis. Kč/ha |\n| Riziko žní | vlhké letá = fuzarióza | vlhké letá = polehnutie |\n\n**Kedy sa používa:**\n\n1. **Záplatovacia plodina** — keď ozim vymrzol alebo nebol zasiaty včas (mokrý jeseň)\n2. **Pekárske špeciality** — niektoré odrody majú vyšší lepok pre pekársku kvalitu\n3. **Severné oblasti** ČR (Krkonoše, Šumava) — kde ozim prezimuje zle\n4. **Bio farmy** — kratšia vegetácia = menší tlak chorôb = menej postrekov\n\n**Agrotechnika:**\n\n**Siatie:**\n- **Optimálny termín**: akonáhle pôda umožní vjazd strojom (typicky 10.–25. marca)\n- **Neskoršie siatie** (po 10. apríli) = výnos klesá o 100–200 kg/ha/týždeň\n- **Hĺbka**: 3–5 cm\n- **Hustota**: 450–550 klíčivých zŕn/m² (vyššia než ozim, kvôli kratšej vegetácii a menej odnožovaniu)\n\n**Hnojenie:**\n- **Pri siatí**: 80–100 kg N/ha (rýchly štart, jarka nestihne mineralizovať)\n- **BBCH 32**: 30–50 kg N/ha\n- **BBCH 39**: 20–30 kg N/ha\n- **Celkovo**: 130–180 kg N/ha\n- **P + K**: len polovičné vs ozim (vegetácia kratšia)\n\n**Ochrana**:\n- **Buriny**: post-emergence (Granstar, Hussar) — menej tlaku než ozim\n- **Fungicídy**: 1–2 postreky (T1 + T2) — menej tlaku septoriózy\n- **Insekticídy**: vošky (BYDV), kohútik obilný — pyretroid\n\n**Odrody CZ 2024:**\n- **Septima** — top výnos jarný\n- **KWS Sharki** — pekárska kvalita\n- **Tybalt** — bio prístup, odolnosť\n\n**Ekonomika:**\n- **Náklady**: 22 000–28 000 Kč/ha (nižšie než ozim — menej N, menej postrekov)\n- **Výnos**: 4,5 t/ha × 5 200 Kč = 23 400 Kč/ha\n- **Marža**: typicky -2 000 až +3 000 Kč/ha\n- **Keď záplata po ozime**: aspoň „nejaký výnos\" je lepší než nič\n\n**Výskum a šľachtenie:**\n- **CZ odrody**: VURV Praha-Ruzyně, Selgen\n- **Trend**: hľadať odrody s vyššou toleranciou k suchu (klimatická zmena)\n\nViz tiež [[psenica-ozimna]], [[ozim-jarin]], [[osevný-postup]], [[fungicídy]], [[hektoliter]].",
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
    "term": "Jačmeň sladovnícky",
    "alias": [
      "malting barley",
      "pivovarský jačmeň",
      "Hordeum vulgare malt"
    ],
    "kategorie": "plodiny",
    "shortDef": "Jačmeň sladovnícky je jarná plodina pestovaná na výrobu sladu (pivovarníctvo). SR má 100 000+ ha. Kľúčové parametre: hl. váha min. 64 kg, dusík 1,5–1,9 % (NÍZKY!), klíčivosť 95+ %. Príplatok za kvalitu 800–1 500 Kč/t.",
    "longDef": "Jačmeň sladovnícky (lat. *Hordeum vulgare*, ang. *malting barley*) je **jarná plodina** pestovaná špecificky na výrobu **sladu** — základnej suroviny pre **pivovarníctvo**. SR je tradičný producent (Plzeňský prazdroj, Budvar, Staropramen).\n\n**Kľúčový rozdiel od krmného jačmeňa** (pozri [[jecmen-krmny]]):\n- **Nízky obsah dusíka** (1,5–1,9 %) — pivovar potrebuje **málo bielkovín, veľa škrobu** na fermentáciu na etanol\n- **Vysoká hl. váha** (min. 64 kg/hl, ideál 68+)\n- **Vyrovnaná veľkosť zrna** (homogénne klíčenie sladu)\n- **Vysoká klíčivosť** (95+ %) — bez klíčenia nie je možné vyrobiť slad\n- **Bez fuzariózy** (mykotoxíny DON v pive neprípustné)\n\n**Vlastnosti agronomické:**\n\n**Setie:**\n- **Termín**: 10.–25. marca (čím skôr, tým lepšie — odolný voči chladu)\n- **Neskoršie setie** = vyšší dusík v zrnách (zlé pre slad!)\n- **Hĺbka**: 3–4 cm\n- **Hustota**: 350–420 klíčivých zŕn/m²\n\n**Hnojenie — POZOR:**\n- **N hnojenie**: len 60–100 kg/ha (nižšie ako pšenica!)\n- **Vyšší N → vyššie bielkoviny v zrnách → nesplnenie limitu sladovníctva**\n- **Časovanie**: všetko do BBCH 32 (neskôr sa nestihne odbúrať z listov)\n- **P + K**: 30–50 kg P, 60–100 kg K (štruktúra, hektolitrová váha)\n\n**Ochrana:**\n- **Plevely**: štandard pre jarné obilniny (Granstar, Hussar)\n- **Fungicídy**: T1 (BBCH 31–32) + T2 (BBCH 39–49) — Ramularie (Zymoseptoria), padlí\n- **Insekticídy**: vošky (BYDV), žrútiky listov\n\n**Kvalitatívne parametre sladovníctva** (SR štandard):\n\n| Parametr | Min. | Optimal | Penalizácia |\n|----------|------|---------|-----------|\n| Hl. váha | 64 kg/hl | 68+ | -200 Kč/t pod 64 |\n| Dusík | 1,5–1,9 % | 1,5–1,7 % | -500 Kč/t nad 2,1 % |\n| Klíčivosť (4 dni) | 95 % | 98+ % | nedodané pod 90 % |\n| Vyrovnanosť (sito 2,5 mm) | 90 % | 95+ % | -200 Kč/t pod 88 % |\n| Vlhkosť | 14 % max | 13 % | -150 Kč/t nad 15 % |\n\n**Zber:**\n- **Vlhkosť zrna**: 14 % optimum\n- **Dôležité**: nesklíziť za mokra (DON riziko po dažďoch)\n- **Sušenie**: max 40 °C (vyššia teplota = strata klíčivosti)\n\n**Výnosy:**\n- **Priemer SR**: 5,2 t/ha\n- **Top farmy**: 7+ t/ha\n- **Odrôdové výnosy** vs krmný: o 0,5–1 t/ha nižšie (cena za kvalitu)\n\n**Cena 2024:**\n- **Štandard sladovnícky**: 5 800–7 000 Kč/t (kontrakt vopred)\n- **Príplatok za top kvalitu** (nízky N, vysoká klíčivosť): +800–1 500 Kč/t\n- **Krmný odbyt** (nesplnil limit): 4 800–5 500 Kč/t\n\n**Odrôdy SR 2024:**\n- **Bojos** — najrozšírenejší, vysoká hl. váha\n- **Laudis** — moderný, výnos + kvalita\n- **Calcule** — Heineken kontrakt\n- **Spartacus** — nový, vysoký výnos\n- **Bonus** — odolný voči chladu\n\n**Trh a kontrakty:**\n\n**Zmluvné pestovanie** (dominantné):\n- **Plzeňský prazdroj** — kontrakt s farmármi 1 rok dopredu, garantovaná cena\n- **Budvar** — vlastný výkup\n- **Staropramen** — Belgické vlastníctvo, kontrakt EU pivovarní skupina\n- **Heineken** — globálny buyer\n\n**Spotový trh** (voľný predaj):\n- **MATIF** (Paríž) — futures cena jačmeňa\n- **Volatilný** — závisí na úrode v EU, Rusku, Ukrajine\n\n**Export:**\n- SR exportuje 200 000–300 000 t/rok sladovníckeho jačmeňa (Nemecko, Veľká Británia, Belgicko)\n\n**Klimatická zmena:**\n- **Sucho v apríli–júni** = krátka vegetácia = vysoký N v zrnách\n- **Pivovary tlačia** na pestovanie v severnejších oblastiach (Poľsko, Škandinávia)\n- **Šľachtenie**: hľadá odolnosť voči suchu\n\n**Pozn.**: SR má **historickú tradíciu** — Žatecký chmeľ + sladovnícky jačmeň = základ slovenskej pivnej kvality, identita štátu.\n\nPozri tiež [[jecmen-krmny]], [[psenice-ozima]], [[fungicidy]], [[hektolitr]], [[ozim-jarin]].",
    "related": [
      "jecmen-krmny",
      "psenice-ozima",
      "fungicidy",
      "hektolitr"
    ]
  },
  {
    "slug": "jecmen-krmny",
    "term": "Jačmeň krmný",
    "alias": [
      "feed barley",
      "krmný jačmeň ozimý/jarný",
      "Hordeum vulgare feed"
    ],
    "kategorie": "plodiny",
    "shortDef": "Jačmeň krmný je ozimá alebo jarná plodina na kŕmenie hovädzieho dobytka, ošípaných, hydiny. Vyšší výnos (6–8 t/ha) ako sladovnícky, vyšší dusík. Cena 4 600–5 400 Kč/t. SR má 150 000+ ha (kombinácia ozim + jarný).",
    "longDef": "Jačmeň krmný (lat. *Hordeum vulgare*, ang. *feed barley*) je **ozimá alebo jarná plodina** pestovaná na **kŕmenie hospodárskych zvierat** (hovädzí dobytok, ošípané, hydina). Na rozdiel od sladovníckeho (pozri [[jecmen-sladovnicky]]) nemá požiadavky na nízky dusík — naopak vyšší N znamená vyššie bielkoviny v krmive = vyššia hodnota.\n\n**Vlastnosti agronomické:**\n\n**Ozimý vs jarný krmný jačmeň:**\n\n| Parametr | Ozimý | Jarný |\n|----------|-------|-------|\n| Setie | september–október | marec–apríl |\n| Zber | júl | august |\n| Výnos | 7–9 t/ha | 5–7 t/ha |\n| N hnojenie | 140–180 kg | 90–130 kg |\n| Náklady | 25 000–32 000 Kč/ha | 20 000–25 000 Kč/ha |\n\n**Ozimý dominuje** v SR pre kŕmne účely (lepšie výnosy).\n\n**Setie (ozim):**\n- **Termín**: 20. september – 15. október (= skôr ako ozimá pšenica o 1–2 týždne)\n- **Hĺbka**: 3–4 cm\n- **Hustota**: 350–420 klíčivých zŕn/m²\n\n**Hnojenie (ozim):**\n- **Jeseň**: 20 kg N + 40 kg P + 80 kg K (= NPK 15-15-15 200 kg/ha)\n- **Jar BBCH 25**: 60–80 kg N/ha (LAV, DAM)\n- **Jar BBCH 32**: 40–60 kg N/ha\n- **Celkovo N**: 130–180 kg/ha\n\n**Krmné použitie:**\n\n**Pre hovädzí dobytok:**\n- **Šrot** (pozri [[srotovnik]]) — drvené zrno do TMR (pozri [[tmr]])\n- **Dávka**: 3–6 kg krmnej dávky / krava / deň\n- **Nutričné hodnoty**: 12 % CP, 7,5 MJ NEL/kg, vysoký škrob\n\n**Pre ošípané:**\n- **Jemnejšie mletý šrot** — 30–60 % krmnej zmesi\n- **Pomáha** tráveniu (vláknina), menej škrobu ako kukurica\n\n**Pre hydinu:**\n- **Mlátí sa** — 10–20 % krmnej zmesi (menej ako kukurica — vyššia vláknina nie ideálna pre hydinu)\n- **Špeciálne pre nosnice** (vyššia vláknina = lepšia peristaltika)\n\n**Cena 2024:**\n- **Krmný jačmeň**: 4 600–5 400 Kč/t\n- **Rozdiel oproti sladovníckemu**: -800 až -1 500 Kč/t (závisí na momentálnej dopyte sladovníctva)\n\n**Zber:**\n- **Vlhkosť zrna**: 14 % optimum\n- **Menej náročný timing** ako sladovnícky (nie je nutné nesklíziť za mokra — pre kŕmenie to nevadí)\n\n**Odrôdy:**\n\n**Ozimé krmné:**\n- **KWS Tenor** — top výnos\n- **Cassia** — populárna, robustná\n- **Wootan** — moderný, krmný kontrakt\n\n**Jarné krmné:**\n- **Vladimir** — výnosný\n- **Salome** — nezávislosť\n\n**Choroby a ochrana:**\n- **Rynchosporium** (škvrnitosť jačmeňa) — typická pre jačmeň\n- **Ramularie** (listová) — rastúci problém 2020s\n- **Padlí jačmenné** — častý problém\n- **Fungicídy**: T1 + T2 (ako u pšenice, pozri [[fungicidy]])\n- **Insekticídy**: vošky (BYDV), kohútik obilný\n\nPozri tiež [[jecmen-sladovnicky]], [[psenice-ozima]], [[tmr]], [[krmne-davky]], [[hektolitr]], [[srotovnik]].",
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
    "term": "Žito ozimé",
    "alias": [
      "rye",
      "Secale cereale",
      "ozimý žitný"
    ],
    "kategorie": "plodiny",
    "shortDef": "Žito ozimé je obilnina pestovaná na chudobných pôdach a v severnejších/horských oblastiach SR. Výnos 5–7 t/ha, cena 4 200–5 200 Kč/t. Hlavné použitie: chlieb (kvasený žitný chlieb), žitné celozrnné pečivo, lihovary, krmivo.",
    "longDef": "Žito ozimé (lat. *Secale cereale*, ang. *rye*) je **ozimá obilnina**, historicky druhá najdôležitejšia po pšenici v SR. Dnes skôr nicheový — pestuje sa na **chudobných piesčitých pôdach** a v **horských oblastiach**, kde pšenica nedáva dobré výnosy.\n\n**Plocha v SR 2024**: ~25 000 ha (klesajúci trend, v 1950s bolo 400 000+ ha)\n\n**Vlastnosti:**\n\n**Agrotechnika:**\n\n**Setie:**\n- **Termín**: 1.–25. septembra (= skôr ako pšenica o 2–3 týždne — žito vyžaduje dlhší jesenný rast)\n- **Hĺbka**: 2–4 cm\n- **Hustota**: 280–350 klíčivých zŕn/m² (menej ako pšenica — žito veľa odnožuje)\n- **Vhodná predplodina**: zemiaky, repka, strukoviny\n\n**Hnojenie:**\n- **Jeseň**: 20 kg N + 30 kg P + 60 kg K\n- **Jar BBCH 25**: 50–70 kg N/ha\n- **Jar BBCH 32**: 30–50 kg N/ha\n- **Celkovo N**: 80–120 kg/ha (menej ako pšenica — žito je tolerantné k chudobným pôdám)\n\n**Zber:**\n- **Vlhkosť**: 13–15 %\n- **Polehnutie riziko**: žito je vyššie (130–180 cm) ako pšenica (90–110 cm) — vietor ho ľahko položí\n\n**Výnosy:**\n- **Priemer SR**: 5,5 t/ha (zlepšenie vs história vďaka hybridnému žitu)\n- **Hybridné žito** (KWS Sortiment): 7–8 t/ha (lepšie ako tradičné populácie)\n\n**Použitie:**\n\n**1. Chlieb a pečivo (60 % spotreby):**\n- **Žitný kvas** — nutný pre chlieb (proteíny žita netvoria lepok ako pšenica)\n- **Šumavský chlieb, podpisový žitný** — tradičné SR pekárstvo\n- **Žitné múky**: ražná T75 (svetlá), T80 (chlebová), T200 (celozrnná)\n\n**2. Lihovary (15 %):**\n- **Žitný líh** — tradičný SR destilát (mladá žitná, ražná pálenka)\n- **Vodka** — Poľsko, Rusko (iná tradícia)\n\n**3. Krmivo (20 %):**\n- **Pre hovädzí dobytok**: do TMR ako alternatíva pšenice\n- **Pre ošípané**: len do 20 % zmesi (vyššia vláknina)\n\n**4. Bio paliva / bioetanol (5 %):**\n- **Niektoré EU krajiny** (Nemecko) dotovali bioetanol z žita\n\n**Cena 2024:**\n- **Potravinárske žito**: 4 600–5 200 Kč/t\n- **Krmné žito**: 4 200–4 600 Kč/t\n- **Bio žito**: 6 800–8 500 Kč/t (premium pre bio pekárstvo)\n\n**Hybridné žito** (kľúčový technologický skok od 1990s):\n- **KWS** (Nemecko) dominuje trhom hybridného žita\n- **Tepelný systém** opylovania — F1 hybridi len z certifikovaného osiva (nie je možné sklizniť na setie)\n- **Výnos**: +30–50 % vs tradičné populácie\n- **Cena osiva**: 4–6× vyššia ako tradičné (kompenzované výnosom)\n\n**Odrôdy SR 2024:**\n- **KWS Bono** — hybrid, top výnos\n- **KWS Vinetto** — hybrid, robustný\n- **Selgo** — tradičná populácia, lacné osivo\n- **Souvenir** — bio prístup\n\n**Choroby a ochrana:**\n- **Ergot (paličkovice)** — *Claviceps purpurea* — historicky **šíleny v Európe**, dnes pod kontrolou. **Mykotoxíny** (ergotaminy), riziko v daždivých rokoch.\n- **Rzi** (pozri [[rzi]]) — menej tlaku ako pšenica\n- **Septoriózy** — minimálne\n- **Postreky**: ľahší program ako pšenica (1 fungicíd)\n\n**EU regulácie:**\n- **CAP BISS + CISS** rovnaké ako pšenica\n- **EKO režim** — bio žito populárne u ekologických fariem (menej postrekov, robustné)\n\n**Kultúrna dimenzia:**\n- **Žito je „chudobná\" plodina** — historicky ľudia chudobní jedli žitný chlieb, bohatí pšeničný\n- **Dnes obrátený trend** — žitný chlieb je „zdravší\" imidž (vyššia vláknina, lepší index glykémie)\n- **Tmavé pečivo** — celozrnné žitné, žitné krekry — trend wellness\n\nPozri tiež [[psenice-ozima]], [[oves-jarni]], [[ozim-jarin]], [[rzi]], [[hektolitr]].",
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
    "term": "Oves jarný",
    "alias": [
      "oats",
      "Avena sativa",
      "jarný oves"
    ],
    "kategorie": "plodiny",
    "shortDef": "Oves jarný je obilnina pestovaná hlavne v severnejších a chladnejších oblastiach SR. Výnos 3,5–5 t/ha, cena 4 000–5 500 Kč/t. Použitie: krmivo pre kone, ľudská konzumácia (vločky, müsli), zelené krmivo.",
    "longDef": "Oves jarný (lat. *Avena sativa*, ang. *oats*) je **jarná obilnina** s tradíciou v SR na chudobnejších a chladnejších pôdach. Plocha v SR 2024: ~35 000 ha. Trend: rastúci kvôli zdravotnému pozitívnemu imidžu (ovesné vločky, plant-based).\n\n**Vlastnosti:**\n\n**Agrotechnika:**\n\n**Setie:**\n- **Termín**: 15. marca – 15. apríla (znáša chlad, rané setie)\n- **Hĺbka**: 3–4 cm\n- **Hustota**: 350–450 klíčivých zŕn/m²\n\n**Hnojenie:**\n- **Pri setí**: 60–80 kg N/ha\n- **BBCH 32**: 30–40 kg N/ha\n- **Celkom N**: 80–120 kg/ha (oves nezužitkuje vysoké N, polehne)\n\n**Zber:**\n- **Vlhkosť**: 13–15 %\n- **Polehnutie riziko**: vysoké (110–140 cm), tenké steblo\n- **Kľúčové**: NEprehnášať N\n\n**Výnosy:**\n- **Priemer SR**: 4,2 t/ha\n- **Top farmy**: 6+ t/ha\n\n**Použitie:**\n\n**1. Ľudská konzumácia (45 %):**\n- **Ovesné vločky** (rolled oats) — parené + valcované zrno\n- **Müsli, granola** — populárna zdravá raňajka\n- **Ovesné mlieko** (oat milk) — silný trend 2020s, plant-based náhrada\n- **Pekárstvo** — celozrnný chlieb s ovsenými vločkami\n- **Diéta** — ovsené vločky obsahujú **β-glukán** (vláknina, znižuje cholesterol)\n\n**2. Krmivo pre kone (35 %):**\n- **Tradičné koňské krmivo** — energia + vláknina + dobrá stráviteľnosť\n- **2–6 kg/kôň/deň** podľa zaťaženia\n- **Dostihoví kone** — vyšší podiel ovsa\n\n**3. Krmivo pre dobytok (15 %):**\n- **Menej časté** než jačmeň\n- **Pre mladé teľatá** — ľahko stráviteľné\n\n**4. Zelená pícnina / krycí plodina (5 %):**\n- **Oves ako krycia plodina** — biomasa pre mulč, sekvestráciu uhlíka\n- **Oves + vikve smíška** — luskovino-obilná zmes pre pícnice\n\n**Cena 2024:**\n- **Potravinársky oves** (premium pre vločky): 5 200–5 800 Kč/t\n- **Krmný oves**: 4 200–4 800 Kč/t\n- **Bio oves**: 7 500–9 500 Kč/t (vysoké premium pre bio müsli)\n\n**Odrôdy SR 2024:**\n- **Atego** — top výnos krmný\n- **Husar** — potravinársky\n- **Rozmar** — tradičná populácia\n- **Spurt** — moderný, robustný\n\n**Choroby:**\n- **Rzi ovsí** (Puccinia coronata) — listová\n- **Helminthosporium** (skvrnitost) — vlhké leta\n- **Menej tlaku** než pšenica → menej postrekov\n\n**Ochrana:**\n- **Plevely**: pre-emergence (Stomp)\n- **Fungicídy**: 1 postrek T2 (BBCH 39) — preventívny\n- **Insekticídy**: minimálne (vošky BYDV)\n\n**Bio prístup:**\n- **Oves** je ideálny pre bio farmu (málo postrekov, robustný)\n- **Bio cena premium** kompenzuje výnos -20 % vs konvenčné\n\n**Ekonomika:**\n- **Náklady**: 18 000–24 000 Kč/ha\n- **Výnos 4,5 t/ha × 4 800 Kč = 21 600 Kč/ha**\n- **Marža**: typicky úzka (-1 000 až +3 000 Kč/ha)\n- **Plus dotácie BISS + CISS + EKO**: robí z toho výhodnejšiu plodinu\n\n**Trh a trendy:**\n- **Plant-based revolúcia** — ovsené mlieko = 2x rast spotreby 2020s\n- **Oat milk vs almond milk** — ovsené mlieko má lepšiu enviromentálnu stopu, šírenie v EÚ\n- **Bio oves**: rastúca dopyt pre Hipp detskú výživu, Müsli zdroje\n\nViz tiež [[psenica-ozim]], [[zito-ozime]], [[ozim-jarin]], [[hektolitr]], [[mezi-plodiny]].",
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
    "term": "Tritikale",
    "alias": [
      "triticale",
      "kríženec pšenice a žita",
      "pšeničné žito"
    ],
    "kategorie": "plodiny",
    "shortDef": "Tritikale je obilnina vzniknutá krížením pšenice (Triticum) a žita (Secale). Kombinuje vlastnosti oboch — výnos pšenice + odolnosť žita. Hlavne krmné použitie, výnos 6–8 t/ha, cena 4 400–5 200 Kč/t.",
    "longDef": "Tritikale (lat. *× Triticosecale*, ang. *triticale*) je **umelo vyšľachtená obilnina** vzniknutá krížením **pšenice** (*Triticum*) × **žita** (*Secale cereale*). Kombinuje vlastnosti oboch rodičov: **výnos pšenice + odolnosť žita** k chudobným pôdam a chorobám.\n\n**História:**\n- **1875** — prvý kríženec popísaný škótskym chovateľom Stephenom Wilsonom\n- **1937** — kanadský agronóm L.H. Newman vytvoril prvé funkčné tritikale\n- **1960s** — CIMMYT (Mexiko) zahájil systematický šľachtiteľský program\n- **1980s** — masové rozšírenie v Európe (Poľsko, Nemecko, ČSSR)\n- **2024** — globálna plocha 15 mil. ha (Poľsko #1, Nemecko #2, SR ~50 000 ha)\n\n**Vlastnosti:**\n\n**Ozímý vs jarný tritikale:**\n- **Ozímý** dominuje v SR (90 % plochy)\n- **Jarný** len ako záplata po nepodarenom ozimom\n\n**Setie (ozim):**\n- **Termín**: 15. septembra – 5. októbra\n- **Hĺbka**: 3–5 cm\n- **Hustota**: 320–400 klíčivých zŕn/m²\n- **Vhodná predplodina**: zemiaky, repka, luskoviny\n\n**Hnojenie:**\n- **Jeseň**: 25 kg N + 30 kg P + 60 kg K\n- **Jar BBCH 25**: 60–80 kg N/ha\n- **Jar BBCH 32**: 30–50 kg N/ha\n- **Celkom N**: 100–140 kg/ha (medzi pšenicou a žitom)\n\n**Zber:**\n- **Vlhkosť**: 13–15 %\n- **Polehnutie stredné riziko** (medzi pšenicou a žitom)\n\n**Výnosy:**\n- **Priemer SR**: 6,8 t/ha\n- **Top farmy**: 9+ t/ha\n- **Lepšie než žito** o 1–2 t/ha, **mierne pod pšenicou** o 0,5–1 t/ha\n\n**Použitie:**\n\n**1. Krmivo (85 %):**\n- **Pre dobytok**: do TMR (pozri [[tmr]]) — substitúcia pšenice/jačmeňa\n- **Pre prasatá**: hlavná obilná zložka\n- **Pre hydinu**: 20–40 % zmesi\n\n**2. Bioetanol (10 %):**\n- **Lihovary** — vysoký škrob, dobrá fermentácia\n- **EÚ dotované** v niektorých krajinách (Poľsko, Nemecko)\n\n**3. Ľudská konzumácia (5 %):**\n- **Špecifické pečivo** (zdravotne orientované)\n- **Müsli** zmesi\n- **Menej rozvinutá** kategória\n\n**Cena 2024:**\n- **Krmný tritikale**: 4 400–5 000 Kč/t\n- **Bioetanol kontrakt**: 4 200–4 600 Kč/t\n- **Bio tritikale**: 6 500–8 000 Kč/t\n\n**Odrôdy SR 2024:**\n- **Trisem** — top výnos\n- **Triamant** — odolnosť\n- **Kassiopeia** — moderný DE import\n- **Borowik** — poľský import\n\n**Choroby a ochrana:**\n- **Septorióza** — menej tlaku než pšenica\n- **Rzi** — priemerné tlak (citlivejšie než žito, menej než pšenica)\n- **Padlí** — menej tlaku\n- **Postreky**: 1–2 fungicídy (menej intenzívne než pšenica)\n- **EKO režim**: vhodný (menej postrekov)\n\n**Výhody tritikale:**\n1. **Robustný** — toleruje chudobné pôdy, sucho\n2. **Menej postrekov** — nižšie náklady, vhodný pre bio\n3. **Vysoký výnos** vs žito\n4. **Stráviteľný** pre dobytok a prasatá\n5. **Krycia plodina schopnosť** — biomasa pre mulč\n\n**Nevýhody:**\n1. **Nižšia cena** než potravinárska pšenica\n2. **Limitovaný trh** ľudskej konzumácie\n3. **Menej odrôd** než pšenica/jačmeň\n\n**Ekonomika:**\n- **Náklady**: 22 000–28 000 Kč/ha\n- **Výnos 7 t/ha × 4 700 Kč = 32 900 Kč/ha**\n- **Marža**: 4 000–10 000 Kč/ha (lepšie než pšenica!)\n- **Dotácie BISS + CISS + EKO**: štandardné\n\n**Strategicky pre SR:**\n- **Pre stredne veľkú farmu** v ANC (Vysočina, Beskydy) — tritikale je často **lepšia voľba než pšenica**\n- **Pre bio farmu** — menej tlaku chorôb, nižšie vstupy\n- **Pre chov dobytka** — vlastné krmivo z vlastného poľa\n\nViz tiež [[psenica-ozim]], [[zito-ozime]], [[jecmen-krmny]], [[ozim-jarin]], [[krmne-davky]].",
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
    "term": "Mák setý",
    "alias": [
      "poppy",
      "Papaver somniferum",
      "mák modrosemenný"
    ],
    "kategorie": "plodiny",
    "shortDef": "Mák setý je jarná olejnatá plodina, kde je SR globálnou veľmocou — produkuje 50–70 % svetového potravinárskeho máku (modré semeno). Výnos 0,8–1,4 t/ha semien, cena 35 000–55 000 Kč/t. Hlavný produkt: pekárske semienko, makový olej, makovice (obmedzené kvôli opioidom).",
    "longDef": "Mák setý (lat. *Papaver somniferum*, ang. *opium poppy* alebo *poppy seed*) je **jarná olejnatá plodina** a globálne špecifická — **SR produkuje 50–70 % svetového potravinárskeho máku** (modré semeno pre pekárske použitie). Tradičná oblasť: Haná, Polabí, Vysočina.\n\n**Plocha v SR 2024**: 30 000–40 000 ha (kolíše podľa ceny)\n**Produkcia**: 25 000–35 000 t/rok\n\n**Vlastnosti:**\n\n**Agrotechnika:**\n\n**Setie:**\n- **Termín**: 25. marca – 25. apríla (znáša neskoré mrazy)\n- **Hĺbka**: 0,5–1 cm (semienko miniature, plytké setie!)\n- **Hustota**: 80–100 klíčivých zŕn/m² (= 1,5–2 kg osiva/ha, HW 0,4g)\n- **Rozteč riadkov**: 25–30 cm (úzke) alebo 45 cm (širšie pre plečku)\n\n**Hnojenie:**\n- **Pri setí**: 60–80 kg N/ha\n- **BBCH 30**: 30–50 kg N/ha\n- **Celkom N**: 80–130 kg/ha\n\n**Ochrana:**\n- **Plevely**: pre-emergence (Bromotril, Metaza Plus) + post-emergence\n- **Insekticídy**: krytoposed (Ceutorhynchus macula-alba), žírači\n- **Fungicídy**: helmintosporióza, pleseň maku — menej tlaku\n- **Mák je „čistá\" plodina** — málo postrekov, vhodný pre bio\n\n**Zber:**\n- **Termín**: august, vlhkosť makovíc 12–14 %\n- **Zberač maku** — špeciálny adaptér na kombajn (oddeliť semienka z makovíc)\n- **Kľúčové**: nevyliať semienka pri manipulácii\n\n**Výnosy:**\n- **Priemer SR**: 0,9 t/ha semien\n- **Top farmy**: 1,4 t/ha\n- **Náklady na 1 ha**: 18 000–25 000 Kč\n\n**Použitie:**\n\n**1. Pekárske semienko (modré semeno, 80 %):**\n- **Tradičné SR pekárstvo** — buchty s makom, makový závin, makovice\n- **Export**: Nemecko, Nizozemsko, USA, Poľsko\n- **Cena 2024**: 35 000–55 000 Kč/t (vysoká volatilita)\n\n**2. Makový olej (10 %):**\n- **Lisovanie** modrých semien\n- **Olej** — premium kulinársky olej, vysoká cena\n- **Hladký omega-6 profil**, dobrá chuť\n\n**3. Makovice (5 %):**\n- **Sušené makovice** — historicky pre ľudovú medicínu (sedatívne)\n- **Kvôli opioidom** (morfin, kodeín) v makoviciach — **obmedzené použitie**, regulované\n- **Farmaceutický priemysel** — extraktívna výroba opioidných liekov (= **smluvné pestovanie pre Zentiva, Pharmos**)\n\n**Legálne a regulačné aspekty:**\n- **SR legislatíva**: pestovanie maku **legálne** pre potravinárske + farmaceutické účely\n- **Nutné registrácie** u SZIF, priestor pod 5 ha bez špecifickej licencie\n- **Kontroly**: ÚKZÚZ, často monitorovaný kvôli zneužitiu na výrobu drog\n- **Suché makovice po zbere** — musia byť **zničené alebo spracované** v licencovanom zariadení\n\n**Trh a marketing:**\n- **Burza Bruntál** — týždenný makový trh, SR centrum\n- **Spotový trh** vs **kontraktové pestovanie** (Pharmos)\n- **Cenová volatilita**: 30 000 ↔ 70 000 Kč/t v rozsahu 2 rokov\n- **Export**: 70 % českej produkcie ide do EÚ + USA\n\n**Odrôdy SR 2024:**\n- **Major** — modré semeno, top výnos\n- **Maratón** — robustnosť\n- **Opal** — biele semeno (export do Ázie)\n- **Onyx** — moderný\n\n**Ekonomika:**\n- **Náklady**: 18 000–25 000 Kč/ha\n- **Výnos 1 t × 45 000 Kč = 45 000 Kč/ha**\n- **Marža**: 20 000–27 000 Kč/ha (vysoká!)\n- **Riziko**: cenová volatilita + výnosy citlivé na počasie\n\n**Kultúrny význam:**\n- **Mák v SR kuchyni** — kultúrna identita (makovice, závin, koláče)\n- **Vianoce** — tradičné múčne pokrmy s makom\n- **Veľká noc** — kraslicová záhrada s makmi\n\n**Klimatická zmena:**\n- **Sucho v apríli–júni** = nižší výnos\n- **Vlhké leta** = pleseň makovíc\n- **Kľúčové**: hlboké korene (znášajú sucho lepšie než pšenica)\n\n**Bio mak:**\n- **Bio mak** = 50–80 % vyššia cena\n- **Trh malý** ale rastie (organic premium pre vegetariánske/zdravotné pekárstvo)\n\nViz tiež [[ozim-jarin]], [[slunecnice]], [[repka-ozima]], [[hrach-set]].",
    "related": [
      "ozim-jarin",
      "slunecnice",
      "repka-ozima"
    ]
  },
  {
    "slug": "slunecnice",
    "term": "Slnečnica ročná",
    "alias": [
      "sunflower",
      "Helianthus annuus"
    ],
    "kategorie": "plodiny",
    "shortDef": "Slnečnica je jarná olejnatá plodina s rastúcim významom v SR (klimatická zmena). Plocha 30 000–50 000 ha, výnos 2,5–4 t/ha, cena 13 000–17 000 Kč/t (high oleic premium +2 000). Hlavné použitie: olej, krmivo (šrot), bio palivá, vtáctvo (semienka).",
    "longDef": "Slnečnica ročná (lat. *Helianthus annuus*, ang. *sunflower*) je **jarná olejnatá plodina** z rodu *Asteraceae*. V SR dlhodobo marginálna, ale **rastúci význam** kvôli klimatickej zmene (vyššie teploty + sucho = vhodné pre slnečnicu).\n\n**Plocha v SR 2024**: 35 000–50 000 ha (10× nárast od 2010)\n**Produkcia**: 110 000–150 000 t/rok\n\n**Vlastnosti:**\n\n**Agrotechnika:**\n\n**Setie:**\n- **Termín**: 15.–30. apríla (po posledných jarných mrazoch)\n- **Hĺbka**: 4–5 cm\n- **Hustota**: 5–7 rastlín/m² (rozteč 70 × 25 cm)\n- **Rozteč riadkov**: 70 cm (ako kukurica — kompatibilná s kukuričnou plečkou)\n\n**Hnojenie:**\n- **Pri sečení**: 80–100 kg N/ha + 50 kg P + 100 kg K\n- **Celkom N**: 100–140 kg/ha (nižšie ako kukurica)\n- **Bór** (B 1 kg/ha) — kritický prvok pre tvorbu úborov\n\n**Ochrana:**\n- **Plevely**: pre-emergence (Stomp, Dual Gold) + post-emergence\n- **Fungicídy**: biela hniloba *Sclerotinia*, hnedá hniloba *Phomopsis* — 1–2 postreky\n- **Insekticídy**: minimálne (menej škodcov ako repka)\n\n**Zber:**\n- **Termín**: september–október, vlhkosť zrna 10–12 %\n- **Desikácia** (pozri [[desikácia]]): glyfosát 2 týždne pred zberom pre zjednotenie dozrievania\n- **Kombajn**: špeciálny slnečnicový žací mech (longer fingers)\n- **Kľúčové**: nevyberať príliš nahor = strata\n\n**Výnosy:**\n- **Priemer SR**: 2,8 t/ha\n- **Top farmy** (južná Morava): 4+ t/ha\n- **EU TOP** (Francúzsko, Maďarsko): 3,5–4,5 t/ha\n\n**Použitie:**\n\n**1. Slnečnicový olej (60 %):**\n- **Štandardný olej** — kuchyňa, šalátový olej, vyprážanie\n- **Slnečnicový olej** je **najlacnejší rastlinný olej** v EU\n- **Spotreba SR**: 6 kg/osoba/rok\n\n**2. High-oleic odrody (15 %):**\n- **Vysoký obsah kyseliny olejovej** (oleic acid) — 80+ % namiesto štandardných 30 %\n- **Stabilný pri vysokých teplotách** — pre friture, McDonald's, vyprážanie v gastronómii\n- **Premium cena**: +1 500–2 500 Kč/t vs štandard\n- **Odrody**: NK Neoma (Syngenta), LG 50.270 HO (Limagrain)\n\n**3. Slnečnicový šrot (15 %):**\n- **Vedľajší produkt** lisovania oleja\n- **Krmivo**: 30–35 % CP, vhodné pre dobytok, prasatá\n- **Cena**: 6 500–8 500 Kč/t\n\n**4. Vtáci (potrava, 5 %):**\n- **Celé slupkové semienko** — pre vtáčiky, kŕmidlá\n- **Cena**: vysoký premium (15 000–25 000 Kč/t)\n\n**5. Bio palivá (5 %):**\n- **Bio diesel** z slnečnicového oleja\n- **EU dotované** (RED II Renewable Energy Directive)\n\n**Cena 2024:**\n- **Štandard slnečnice**: 13 000–16 000 Kč/t\n- **High-oleic**: +1 500–2 500 Kč/t\n- **Bio slnečnica**: 22 000–28 000 Kč/t\n\n**Odrody SR 2024:**\n- **LG 50.270 HO** (Limagrain) — high oleic, top výnos\n- **NK Neoma** (Syngenta) — high oleic populárna\n- **ES Janis** (Euralis) — štandard, robustná\n- **Pioneer P63LE10** — vysoký výnos\n\n**Choroby:**\n- **Biela hniloba** (*Sclerotinia sclerotiorum*) — vlhké léta, strata 10–30 %\n- **Hnedá hniloba** (*Phomopsis helianthi*) — listová + úborová\n- **Pleseň slnečnice** (*Plasmopara halstedii*) — preventívne močenie osív\n- **Postreky**: 1–2 fungicídy v sezóne (BBCH 51 + 65)\n\n**Škodcovia:**\n- **Drobní chrobáci** — menší tlak než repka\n- **Vtáci** — znížia zber o 5–15 %, zvlášť holuby a hejná\n\n**Ekonomika:**\n- **Náklady**: 22 000–28 000 Kč/ha\n- **Výnos 3 t × 14 500 Kč = 43 500 Kč/ha**\n- **Marža**: 15 000–20 000 Kč/ha (atraktívne!)\n- **Dotácie BISS + CISS + EKO**: štandardné\n\n**Strategický význam pre SR:**\n- **Rast plochy 2010s** vs repka — alternatíva s nižším postrekovým tlakom\n- **Klimatická vhodnosť** — južná Morava, Polabie, Slovácko\n- **Severnejšia SR** (Vysočina, Krkonoše): menej vhodné kvôli kratšej vegetácii\n\n**Klimatická zmena:**\n- **Pozitívny dopad** — slnečnica je teplomilná plodina, profituje z teplých rokov\n- **Sucho** — tolerantná (hlboké korene)\n- **Riziko**: neskoré mrazy v apríli (zničia klíčiaci porast)\n\nPozri tiež [[repka-ozimá]], [[ozim-jarin]], [[fungicídy]], [[desikácia]], [[mak-ozimy]].",
    "related": [
      "repka-ozima",
      "ozim-jarin",
      "fungicidy",
      "desikace"
    ]
  },
  {
    "slug": "horcice",
    "term": "Horčica siata",
    "alias": [
      "mustard",
      "Sinapis alba",
      "biela horčica",
      "Sinapis arvensis"
    ],
    "kategorie": "plodiny",
    "shortDef": "Horčica siata (biela horčica) je jarná brukvovitá plodina pre výrobu horčice (korenené omáčky) a ako meziplodina pre zelené hnojenie. SR plocha 5 000–15 000 ha. Krátka vegetácia 90–110 dní. Výnos 1–2 t/ha semien, cena 13 000–18 000 Kč/t.",
    "longDef": "Horčica siata (lat. *Sinapis alba*, „biela horčica\", ang. *white mustard*) je **jarná brukvovitá plodina** s krátkou vegetačnou dobou (90–110 dní). Hlavne pre **výrobu horčice** (ako korenená omáčka) a **ako meziplodina** pre zelené hnojenie.\n\n**Plocha v SR 2024**: 5 000–15 000 ha pre semeno + 100 000+ ha ako meziplodina\n\n**Vlastnosti:**\n\n**Agrotechnika:**\n\n**Setie:**\n- **Termín**: 25. marca – 25. apríla (semienko pre zber) NEBO 1.–15. augusta (meziplodina po zbere obilnín)\n- **Hĺbka**: 1,5–2 cm\n- **Hustota**: 200–300 klíčivých zŕn/m² (= 8–12 kg osiva/ha)\n\n**Hnojenie:**\n- **Pre semeno**: 60–80 kg N/ha\n- **Pre meziplodinu**: bez hnojenia (využije zvyšok z predplodiny)\n- **P + K**: 30 P + 60 K\n\n**Ochrana:**\n- **Plevely**: pre-emergence (Stomp) + post-emergence\n- **Insekticídy**: krytonosec stonkový, blýskáček repkový — pyrethroid\n- **Fungicídy**: minimálny tlak\n\n**Zber:**\n- **Termín**: koniec júla–august, vlhkosť 10–12 %\n- **Zjednotenie dozrievania**: glyfosát desikácia 10 dní pred zberom\n- **Kombajn**: štandardný obilný žací mech\n\n**Výnosy:**\n- **Priemer SR**: 1,3 t/ha\n- **Top farmy**: 2+ t/ha\n\n**Použitie:**\n\n**1. Horčica korenina (60 % výroby):**\n- **Mletá horčica + ocot + soľ + voda + korenie** = korenená omáčka\n- **Český národný pokrm** (svíčková, rezník)\n- **Pražská horčica, plnotučná horčica** — typy SR\n- **Globálne značky**: Hellmann's, Heinz, Maille — všetky od slnečnice siatej\n\n**2. Meziplodina (30 % ploch — najväčšie využitie!):**\n- **Zber pšenice/jačmeňa** → ihneď setie horčice → vegetačné obdobie do prvých mrazov → zarytie na jeseň alebo na jar\n- **Účinky**:\n  - **Zelené hnojenie** — biomasa sa rozkladá v pôde\n  - **Sekvestrácia C** — korene + biomasa\n  - **Supresia plevelov** — horčica rýchlo pokryje pôdu\n  - **Glukosinoláty v pôde** — biofumigácia (potláča patogény)\n  - **EU CAP greening** — horčica = EFA (Ecological Focus Area)\n- **Cena osiva pre meziplodinu**: 600–1 000 Kč/ha\n\n**3. Olej (5 %):**\n- **Horčicový olej** — špecifický východoeurópsky kulinársky olej (NL, Poľsko)\n- **V SR vzácny**\n\n**4. Krmivo (5 %):**\n- **Horčicový šrot** (po lisovaní oleja) — pre dobytok\n- **Pozor**: glukosinoláty môžu spôsobiť problémy u prasát\n\n**Cena 2024:**\n- **Horčicové semeno**: 13 000–18 000 Kč/t\n- **Bio horčica**: 18 000–25 000 Kč/t (Hellmann's bio kontrakt)\n\n**Odrody SR 2024:**\n- **Veronica** — výnosná\n- **Severka** — robustná\n- **Andromeda** — moderná\n\n**Choroby a škodcovia:**\n- **Rovnaké ako repka** ale menej tlaku (krátka vegetácia)\n- **Blýskáček repkový** (*Meligethes aeneus*) — žerie pukláky\n- **Pleseň brukvovitých** (*Peronospora parasitica*) — minimálny tlak\n\n**Výhody horčice:**\n1. **Krátka vegetácia** — flexibilná v osevnom postupe\n2. **Lacné osivo**\n3. **Meziplodina hodnota** — EFA, zelené hnojenie, biofumigácia\n4. **Robustná** — málo postrekov\n\n**Nevýhody:**\n1. **Nízky výnos** (1–2 t/ha vs 8 t/ha pšenice)\n2. **Marginálna plocha** pre semeno\n3. **Cenová volatilita** — citlivá na dopyt potravinárskeho priemyslu\n\n**Ekonomika:**\n\n**Pre semeno (1,3 t/ha × 15 000 Kč = 19 500 Kč/ha):**\n- **Náklady**: 12 000–15 000 Kč/ha\n- **Marža**: 4 500–7 500 Kč/ha (mierna)\n- **Plus dotácie**: štandardné BISS + CISS\n\n**Pre meziplodinu:**\n- **Náklady**: 1 000–1 500 Kč/ha (osivo + setie)\n- **Benefity**: EFA dotácia ~3 000 Kč/ha + pôdne benefity nemerateľné finančne\n- **Net pozitívne**: 1 500–2 000 Kč/ha (len dotácie), plus dlhodobé benefity\n\n**EU a CAP:**\n- **Meziplodinové schémy** dotované — horčica je najpopulárnejšia\n- **EFA limity** — minimálne 5 % plochy v EFA pre CAP (greening)\n\n**Klimatická zmena:**\n- **Sucho v lete** → meziplodina nevstúpi\n- **Mierne jesene** → dlhšia vegetácia = väčšia biomasa\n\nPozri tiež [[mezi-plodiny]], [[repka-ozimá]], [[ozim-jarin]], [[regenerativni-zemedelstvi]], [[osevni-postup]].",
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
    "term": "Cukrová repa",
    "alias": [
      "sugar beet",
      "Beta vulgaris",
      "cukrovka"
    ],
    "kategorie": "plodiny",
    "shortDef": "Cukrová repa (Beta vulgaris) je jarná okopanina pestovaná na výrobu cukru. SK plocha 60 000–70 000 ha. Výnos 60–80 t/ha bulvy, cukornatosť 17–20 %. Cena 1 100–1 600 Kč/t (záleží na cukornatosti). Zmluvné pestovanie pre cukrovary.",
    "longDef": "Cukrová repa (lat. *Beta vulgaris* var. *altissima*, ang. *sugar beet*) je **jarná okopanina** pestovaná na **výrobu cukru** (sacharóza). Bulva obsahuje 17–20 % cukru. SK dlhá tradícia (od 19. storočia), oblasť: Polabie, Stredné Čechy, Haná.\n\n**Plocha v SK 2024**: 60 000–70 000 ha\n**Produkcia**: 4–5 mil. t bulvy → 600 000–750 000 t cukru\n\n**Vlastnosti:**\n\n**Agrotechnika:**\n\n**Sejba:**\n- **Termín**: 20. marca – 20. apríla\n- **Hĺbka**: 2–3 cm\n- **Hustota**: 8–10 rastlín/m² (rozstup 45 × 18 cm)\n- **Kľúčové**: presná sejba (každé semienko sa počíta, drahé osivo)\n\n**Hnojenie:**\n- **Pri sejbe**: 100–130 kg N/ha (cukrovka je „N hladná\")\n- **Celkovo N**: 130–180 kg/ha\n- **Bór (B)** — kritický pre tvorbu cukru, 2–4 kg/ha\n- **Sodík (Na)** — atypicky pozitívny efekt na výnos\n- **Hnoj v predplodine** — cukrovka miluje organickú hmotu\n\n**Ochrana:**\n- **Buriny**: 3–4 postreky (Goltix + Betanal + Pyramin) — drahý program\n- **Insekticídy**: voška repná (BYV vektor, viď [[msice-repna]])\n- **Fungicídy**: 1–2 postreky (Cercospora, múčnatka)\n\n**Zber:**\n- **Termín**: september–november (úvod kampane)\n- **Zberač repy** — Holmer Terra Dos, Ropa euro-Tiger — 6-riadkový samohybný (50–80 t/h)\n- **Tzv. „kampaň\"**: október–december, cukrovary pracujú 24/7\n\n**Výnosy:**\n- **Priemer SK**: 70 t/ha bulvy\n- **Top farmy**: 90+ t/ha\n- **Cukornatosť**: 17–20 % (vyššia = vyššia cena!)\n\n**Cena 2024 (zmluvná):**\n- **Štandardná cukrovka** (17 % cukru): 1 200 Kč/t\n- **High sugar** (19 % cukru): 1 500 Kč/t\n- **Bonus za biopalivá** (kontrakt na bioetanol): +50–100 Kč/t\n\n**Zmluvné pestovanie:**\n\n**Cukrovary SK:**\n- **Cukrovary Hradec Králové** (skupina Tereos) — Polabie\n- **Moravskoslezské cukrovary** (Litovel, Vrbátky) — Haná\n- **Tereos TTD** — Dobrovice (Polabie)\n- **Pfeifer & Langen** (Český Meziříčí)\n\n**Kontrakt** medzi farmou a cukrovarom:\n- **Plocha + odhad výnosu** = množstevný záväzok\n- **Cena**: garantovaná za %cukru + bonusy\n- **Doprava**: cukrovar často zabezpečuje\n- **Predpolnosť**: niekedy 3-5 rokov dopredu\n\n**Produkty z cukrovky:**\n1. **Cukor (50 %)** — hlavný produkt\n2. **Melasa (15 %)** — kvasinky, krmivo, lieh\n3. **Rezky (30 %)** — krmivo pre dobytok (vlhké alebo sušené, peletované)\n4. **Hlina a list** (5 %) — kompost\n\n**Odrody SK 2024:**\n- **KWS odrody** (Marleen, Cantona) — dominantné\n- **Strube** (Salamando, Rosagold) — alternatíva\n- **Klein-Wanzlebener** — tradičný nemecký\n\n**Choroby:**\n- **Cercospora beticola** — listová škvrnitosť, vážna strata cukornatosti\n- **Múčnatka repná** (Erysiphe betae) — listy\n- **Rhizoctonia** — koreňová hniloba\n- **BYV vírus** prenášaný voškami — viď [[msice-repna]]\n\n**Škodcovia:**\n- **Voška repná** (Aphis fabae) — vektor BYV\n- **Drepčíky** (Chaetocnema) — listy\n- **Slimák poľný** (Deroceras) — listy\n\n**Ekonomika:**\n\n**Náklady na 1 ha** (cukrovka je „drahá\" plodina):\n- **Osivo**: 8 000–12 000 Kč/ha (presné sety, drahé peletované)\n- **Hnojivá**: 6 000–8 000 Kč/ha\n- **Postreky**: 10 000–15 000 Kč/ha (3-4 herbicídne postreky)\n- **Zber**: 3 000–5 000 Kč/ha (vlastný zberač alebo služba)\n- **Doprava**: 2 000–4 000 Kč/ha\n- **Práca a réžia**: 6 000–10 000 Kč/ha\n- **Celkovo**: 35 000–55 000 Kč/ha\n\n**Výnos**: 70 t/ha × 1 300 Kč = 91 000 Kč/ha\n**Marža**: 35 000–55 000 Kč/ha (ATRATÍVNE!)\n\n**Plus dotácie**:\n- **BISS + CISS**: ~3 600 Kč/ha\n- **VCS pre cukrovku** (citlivý sektor): ~7 500 Kč/ha (špecifická SK dotácia pre cukrovku!)\n- **EKO režim**: ak splní podmienky\n\n**Trend a budúcnosť:**\n- **EU cukrová kvóta** zrušená 2017 → liberalizácia trhu → tlak na cenu\n- **SK klesajúca plocha** (z 100 000 ha v 1990s na 60 000 ha dnes)\n- **Bioetanol** — alternatívne použitie pre cukrovku (EU RED II)\n- **Klimatická zmena** — vyššie teploty + sucho = nižší výnos v Polabí\n\n**Strategická plodina:**\n- **VCS dotácie** robia z cukrovky **veľmi profitabilnú voľbu** v cukrovkárskych regiónoch\n- **Mimo VCS regióny** menej atraktívna (sucho na Vysočine nelegálne)\n\nViď tiež [[msice-repna]], [[ozim-jarin]], [[osevni-postup]], [[fungicidy]], [[hnojivo]].",
    "related": [
      "msice-repna",
      "ozim-jarin",
      "osevni-postup",
      "fungicidy"
    ]
  },
  {
    "slug": "hrach-set",
    "term": "Hrách setý",
    "alias": [
      "pea",
      "Pisum sativum",
      "jarný hrách"
    ],
    "kategorie": "plodiny",
    "shortDef": "Hrách setý je jarná luskovina pestovaná pre semeno (zrnový hrách) alebo zelený lusk (konzumný hrášok). SK plocha 10 000–20 000 ha. Výnos 3–5 t/ha semien, cena 6 500–8 500 Kč/t. Kľúčová pre fixáciu N (50–100 kg N/ha) a osevný postup po obilninách.",
    "longDef": "Hrách setý (lat. *Pisum sativum*, ang. *field pea*) je **jarná luskovina** s kľúčovými agronomickými benefitmi: **fixácia dusíka** symbiózou s *Rhizobium leguminosarum* (50–100 kg N/ha) a zlepšenie štruktúry pôdy. Hlavné použitie: krmivo (zrnový hrách), ľudská konzumácia (zelený hrášok), priemyselné aplikácie.\n\n**Plocha v SR 2024**: 10 000–20 000 ha (rastúci trend kvôli plant-based proteínom + EÚ bielkovinovej stratégii)\n\n**Typy hrachu:**\n\n**1. Zrnový hrách** (95 % SK plochy):\n- **Sklizeň**: august, zrno suché\n- **Použitie**: krmivo, ľudská strava (lúpaný hrách)\n- **Výnos**: 3–5 t/ha\n\n**2. Konzervárenský hrášok** (5 %):\n- **Sklizeň**: zelený lusk, jún–júl\n- **Použitie**: konzervy (Boncourier), mrazené (Bonduelle)\n- **Zmluvné pestovanie** pre konzervárne\n- **Výnos**: 5–8 t/ha zeleného lusku\n\n**Agrotechnika:**\n\n**Setí:**\n- **Termín**: 20. marca – 15. apríla (rané setie — chladu odolný)\n- **Hĺbka**: 4–6 cm (hlboko, kvôli suchu-tolerancii koreňov)\n- **Hustota**: 80–120 klíčivých zŕn/m² (= 200–280 kg osiva/ha, HW 250g)\n\n**Hnojenie:**\n- **Žiadne N hnojivo!** — hrách si fixuje vlastné (symbióza)\n- **P + K**: 40 P + 80 K + Mg\n- **Inokulácia osiva** Rhizobium leguminosarum bivar. *viceae* = kľúčové (najmä na poli, kde hrách 5+ rokov nebol)\n\n**Ochrana:**\n- **Plevely**: pre-emergence (Stomp, Bicarb) + post-emergence (Basagran, Pulsar)\n- **Insekticídy**: zrnokaz hráchový (Bruchus pisorum), vošky\n- **Fungicídy**: biela hniloba *Sclerotinia*, pleseň hrášku (Mycosphaerella pisi)\n\n**Sklizeň zrnového hrachu:**\n- **Termín**: koniec júla–august, vlhkosť 14 %\n- **Desikácia** (pozri [[desikácia]]): glyfosát 7–10 dní pred sklizňou (vyrovnanie dozrievania)\n- **Kombajn**: štandardný žací mech, ale opatrne (zrno ľahko vypadáva)\n\n**Výnosy:**\n- **Priemer SK**: 3,8 t/ha zrnového hrachu\n- **Top farmy**: 5,5+ t/ha\n- **Konzervárenský**: 6 t/ha zelený\n\n**Použitie:**\n\n**1. Krmivo (60 %):**\n- **Pre prasatá**: hlavná bielkovinová složka (CP 23–26 %)\n- **Pre hovädzí dobytok**: alternatíva SES (sójový extrahovaný šrot)\n- **Pre hydinu**: do 20 % zmesi\n- **Nutričné hodnoty**: CP 24 %, NEL 8,2 MJ/kg, vysoký škrob\n\n**2. Ľudská konzumácia (25 %):**\n- **Lúpaný hrách** — polievky, omáčky (slovenská kuchyňa)\n- **Hráškové vločky / múka** — plant-based proteíny\n- **Konzervovaný / mrazený hrášok** — zelenina\n- **Pea protein** — hojne používaný v plant-based produktoch (Beyond Meat, Impossible)\n\n**3. Priemysel (10 %):**\n- **Pea protein izolát** — 80 %+ čistota, premium plant-based ingredient\n- **Cena pea protein**: 80 000–150 000 Kč/t (10× vs zrno)\n- **EÚ dotuje** plant-based proteinovou stratégiou\n\n**4. Bio palivá (5 %):**\n- **Hrachový ethanol** — vedľajšia možnosť, marginálna\n\n**Cena 2024:**\n- **Krmný zrnový hrách**: 6 500–8 000 Kč/t\n- **Potravinársky hrách** (lúpaný): 9 000–12 000 Kč/t\n- **Konzervárenský** (zmluvný zelený): 4 500–6 000 Kč/t bruto\n\n**Odrôd SK 2024:**\n- **Eso, Madonna** — biele kvety, krmné, top výnos\n- **Bohatýr** — robustný\n- **Salamanca** — krátke stéblo (menej polehnutia)\n\n**Agronomické benefity (kľúčové!):**\n1. **N fixácia**: 50–100 kg N/ha + reziduálny N pre nasledujúcu plodinu (typicky pšenica po hrachu)\n2. **Rozrušenie monokultúr**: brukvovité a obilniny majú úplne iné patogény — hrách je „čistič\" osevného postupu\n3. **Štruktúra pôdy**: hlboké korene rozrušujú utuženú pôdu\n4. **Sekvestrácia C**: vyššia organická hmota v pôde po luskovine\n\n**Ekonomika:**\n\n**Náklady na 1 ha:**\n- Osivo: 4 500–6 000 Kč\n- Hnojivá: 2 000–3 000 Kč (len P + K)\n- Postreky: 4 000–6 000 Kč\n- Sklizeň + doprava: 3 000–4 000 Kč\n- Celkom: 13 500–19 000 Kč/ha\n\n**Výnos**: 4 t × 7 200 Kč = **28 800 Kč/ha**\n**Marža**: 9 800–15 300 Kč/ha (atraktívne!)\n**Plus N pre nasledujúcu plodinu**: ušetrí 60–80 kg N (~1 200–1 600 Kč/ha)\n\n**EÚ Bielkovinová stratégia:**\n- **EÚ CAP** od 2023 podporuje **bielkovinové plodiny** (hrácho, sója, lupina, peluška, vikve, fazuľa)\n- **VCS pre bielkoviny**: ~2 800 Kč/ha\n- **EÚ cieľ**: zvýšiť domácu produkciu bielkovín z 30 % na 50 % do 2030\n\n**Klimatická zmena:**\n- **Mierne jaro** = pozitívne\n- **Sucho v máji–jún** = negatívne (kvetenie a tvorba luskov)\n- **Mokré leta** = polehnutie, pleseň\n\n**Strategický význam:**\n- **Hrách v osevnom postupe** = kľúč pre **udržateľnú intenzifikáciu**\n- **Plant-based proteíny** = rastúci trh = vyššia cena\n- **EÚ bielkovinová podpora** = dotácie navyše\n\nPozri tiež [[sojaova-bob]], [[vojteska]], [[osevny-postup]], [[medzi-plodiny]], [[ozim-jarin]], [[regenerativne-zemedelstvo]].",
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
    "term": "Ľan siaty",
    "alias": [
      "flax",
      "Linum usitatissimum",
      "olejný ľan",
      "pradný ľan"
    ],
    "kategorie": "plodiny",
    "shortDef": "Ľan siaty je dvojitá plodina — olejný ľan pre semeno a ľanový olej, pradný ľan pre vlákno (ľanové plátno). SK plocha 1 500–3 000 ha (klesajúca). Výnos olejného 1,5–2,5 t/ha semien, cena 12 000–17 000 Kč/t. Historicky kľúčový (vlákno plátno do 1900s).",
    "longDef": "Ľan siaty (lat. *Linum usitatissimum*, ang. *flax*) je **jarná plodina dvojitého použitia**:\n1. **Olejný ľan** — semeno pre ľanový olej (omega-3), pekárske semeno\n2. **Pradný ľan** — stéblo pre ľanové vlákno (textil)\n\nNa SK klesajúca tradícia — z 100 000+ ha v 1950s na ~1 500–3 000 ha dnes.\n\n**História:**\n- **Tisícročia** — ľan je jedna z najstarších kultúrnych rastlín (egyptské múmie, biblické zmienky)\n- **Stredovek** — ľanové plátno = štandardný textil v EÚ\n- **18.–19. storočie** — vrchol pestovania na SK (Krkonošsko, Jeseníky ľanové centrá)\n- **20. storočie** — bavlna a syntetika vytlačili ľanové plátno\n- **1950s vrchol SK** — 120 000 ha (štátom dotované)\n- **2020s** — niche plodina\n\n**Vlastnosti:**\n\n**Olejný ľan (95 % SK ploch):**\n\n**Setie:**\n- **Termín**: 25. marca – 20. apríla\n- **Hĺbka**: 2–3 cm\n- **Hustota**: 600–800 klíčivých zŕn/m² (drobné semeno)\n\n**Hnojenie:**\n- **N**: 60–80 kg/ha\n- **P + K**: štandardné\n\n**Ochrana:**\n- **Plevely**: post-emergence (Lontrel, Basagran)\n- **Insekticídy**: chrobáky, vošky — pyrethroid\n- **Fungicídy**: biela hniloba (Sclerotinia), pleseň ľanu — 1 postrek\n\n**Zber:**\n- **Termín**: koniec júla–august\n- **Vlhkosť zrna**: 9–12 %\n- **Kombajn**: štandardný\n- **Výnos**: 1,5–2,5 t/ha semien\n\n**Použitie olejného ľanu:**\n\n**1. Ľanové semienko (potravinárske):**\n- **Celé alebo mleté semienko** — do pečiva, müsli, jogurtov\n- **Vysoký obsah omega-3** (ALA — alfa-linolenová kyselina)\n- **Vláknina** — pozitívna pre trávenie\n- **Cena potravinárskeho semienka**: 18 000–25 000 Kč/t\n\n**2. Ľanový olej:**\n- **Lisovanie** semien\n- **Kulinársky**: šalát, müsli (nie na vyprážanie — nestabilný)\n- **Liečebný**: omega-3 doplnok\n- **Cena**: 250–400 Kč/100ml v retailu\n\n**3. Krmivo:**\n- **Ľanový šrot** (po lisovaní oleja) — krmivo pre dobytok, kone\n- **Vysoký obsah olejnatých látok** — lesklá srsť koní\n\n**4. Priemysel:**\n- **Ľanový olej technický** (sušiaci olej) — pre nátery, lakové výrobky, linoleum\n- **Linoleum** etymológia: linum oleum = ľanový olej\n\n**Pradný ľan (5 % SK ploch):**\n\n**Špecifický pre vlákno:**\n- **Hustejšie setie** (1 500 zŕn/m²) — tenké, dlhé stéblo\n- **Kratšia vegetácia** — zber v júli\n- **Rosenie** (retting) — stébla sa nechajú na poli rosit 14 dní, aby pektín sa rozložil\n- **Lámanie + trenie** — uvoľnenie vlákna\n- **Vlákno** — pre ľanové plátno (linen, batist, kambrik)\n\n**Ľanové plátno**:\n- **Premium materiál** — luxusné oblečenie, uteráky, obrúsky\n- **Belgicko + Francúzsko** = EÚ ľanové centrum (80 % EÚ produkcie)\n- **SK marginálne** — odvozené priemyselné dejiny zanikajú\n\n**Cena 2024:**\n- **Olejný ľan** krmný: 12 000–14 000 Kč/t\n- **Olejný ľan** potravinársky: 18 000–25 000 Kč/t\n- **Bio olejný ľan**: 28 000–35 000 Kč/t (premium pre bio müsli)\n\n**Odrôdy SK 2024:**\n- **Lola** — olejný, top výnos\n- **Recital** — robustný\n- **Niagara** — pradný (Belgické import)\n\n**Choroby:**\n- **Biela hniloba** (Sclerotinia) — vlhké leto\n- **Pleseň ľanu** (Botrytis) — sezónna\n- **Ľanová hrdza** (Melampsora) — málo\n\n**Ekonomika olejného ľanu:**\n\n**Náklady na 1 ha**:\n- Osivo: 1 500–2 500 Kč\n- Hnojivá: 2 500–3 500 Kč\n- Postreky: 3 000–5 000 Kč\n- Zber: 2 500–3 500 Kč\n- Celkom: 9 500–14 500 Kč/ha\n\n**Výnos**: 2 t × 14 000 Kč = **28 000 Kč/ha**\n**Marža**: 13 500–18 500 Kč/ha (atraktívne pre niche!)\n\n**Strategický význam:**\n- **Niche plodina** s vysokou maržou\n- **Plant-based omega-3** trend = rastúca dopyt\n- **Bio kontrakty** pre pekársky priemysel\n\n**Klimatická zmena:**\n- **Sucho v máji–júni** = pozitívne (ľan nesnáša vlhko)\n- **Mierne leto** = ideálne\n- **Mokré leto** = biela hniloba\n\n**Renaissance ľanu?**\n- **Plant-based food** trend = trh rastie\n- **Lokálni producenti** môžu cieliť na premium pekársky trh\n- **Bio kontrakty** pre Hipp, Bauer detskú výživu\n\nViz tiež [[ozim-jarin]], [[sojaova-bob]], [[mak-ozimy]], [[osevni-postup]].",
    "related": [
      "ozim-jarin",
      "mak-ozimy",
      "osevni-postup"
    ]
  },
  {
    "slug": "mastitida",
    "term": "Mastitída",
    "alias": [
      "mastitída",
      "zápal vemena",
      "mliečny zápal"
    ],
    "kategorie": "chov",
    "shortDef": "Mastitída je zápal mliečnej žľazy (vemena) dojnice, typicky bakteriálny. Najvýznamnejší zdravotný problém mliečnych fariem — spôsobuje 30 % ekonomických strát chovu. Diagnostika: somatické bunky v mlieku (SCC) >200 000/ml = subklinická, >500 000/ml = klinická.",
    "longDef": "Mastitída (lat. *mastitis*, gréc. *mastos* = vemeno) je **zápal mliečnej žľazy** dojnice. Najvýznamnejší zdravotný problém mliečneho chovu — spôsobuje **30 % ekonomických strát** (znižená produkcia, antibiotiká, vyradené kravy).\n\n**Typy:** klinická (vizuálne príznaky, vyžaduje liečbu) vs subklinická (len SCC >200 000/ml, väčšina prípadov). Kľúčové patogény: kontagiózne (*Staphylococcus aureus*, *Streptococcus agalactiae*) a environmentálne (*E. coli*, *Streptococcus uberis*, *Klebsiella*).\n\n**Meranie SCC:**\n- <100 000/ml = zdravé\n- 200–500 000/ml = subklinická\n- >500 000/ml = klinická\n- **EÚ limit pre výkup mlieka**: <400 000/ml\n\n**Liečba klinickej mastitidy:**\n- **Intramamárne antibiotiká** (Mastijet, Cefa Safe) — 3 dni do napadnutej štvrti\n- **Systémová** (Penicilín G IM, Cefquinome) pre vážne prípady\n- **Protizápalové** (ketoprofén, meloxicam)\n- **Súťažná doba**: mlieko 3–5 dní, mäso 14–30 dní\n- **Cena liečby**: 500–1 500 Kč + 1 500–3 000 Kč stratené mlieko\n\n**Prevencia (kľúčové):**\n1. **Hygiena dojenia**: pre-dip + sušenie sterilným uterákom (na kravu!) + post-dip\n2. **Dry-cow therapy**: intramamárne antibiotiká + teat sealant pri zaprahnutí\n3. **Suchá podstielka**: slama, drevené hobliny, piesok\n4. **Genetika**: výber býkov s nízkym SCC v potomstvu\n5. **TMR** (viz [[tmr]]): vyvážená výživa, selén + vit. E\n\n**Ekonomický dopad:**\n- Náklady na 1 klinickú mastitídu: 4 000–11 500 Kč\n- Stádo 100 kráv: 300 000–800 000 Kč/rok strát\n- Dobrý manažment znižuje mastitídu o 50–70 % = veľký ROI\n\nPozri tiež [[otelenie]], [[dojiareň]], [[ku-kontrola-užitkovosti]], [[tmr]], [[bcs-body-condition]], [[tranzitné-obdobie]].",
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
      "telesný kondičný skóre"
    ],
    "kategorie": "chov",
    "shortDef": "BCS je vizuálne hodnotenie telesnej kondície hovädzieho dobytka na škále 1–5 (USA) alebo 1–9. Kľúčový manažment nástroj — optimálne BCS mliečnej kravy pri otelení 3,25–3,75. Príliš tučná = dystocia + ketóza; príliš chudá = nízka produkcia a fertilita.",
    "longDef": "BCS (Body Condition Score) je **vizuálne subjektívne hodnotenie telesnej kondície (tuku)** hospodárskych zvierat. Kľúčový manažment nástroj pre mliečny + mäsový dobytok, ovce, kozy, prasatá.\n\n**Škála USA (Wildman, 1982):**\n- 1: extrémne vychudnutá\n- 2: chudá\n- 3: ideálna mliečna krava\n- 4: tučná\n- 5: extrémne tučná\n- Krok 0,25\n\n**Optimálne BCS — mliečna krava (Holstein):**\n\n| Štádium | BCS |\n|---------|-----|\n| Otelenie | 3,25–3,75 |\n| 30 dní po otelení | 2,75–3,00 (prípustný pokles) |\n| Vrchol laktácie (100 dní) | 2,75–3,00 |\n| 200 dní | 3,00–3,25 |\n| Zaprahnutie | 3,25–3,75 |\n\n**Hodnotenie**: chrbtica, kostnaté výbežky, krátke rebrá, sedací hrbol, chvostová ryha. Vizuálne + palpácia.\n\n**Dôsledky chybných BCS:**\n\n**Príliš nízky (<2,5 pri otelení):**\n- Nízka produkcia, ketóza, slabšia imunita, oneskorené ruje (viz [[ruje]])\n\n**Príliš vysoký (>4,0 pri otelení):**\n- Dystocia (viz [[otelenie]]), fatty liver, retentio placentae, ketóza, znížený príjem krmiva\n\n**Dôležité pravidlo**: strata >1,0 BCS v prvých 60 dňoch = riziko (ketóza, nízka fertilita).\n\n**Softvér pre automatickú BCS:**\n- **CowManager**, **DeLaval BCS Camera** — kamera + AI hodnotenie\n- 200 000–500 000 Kč inštalácia\n- Denná BCS každej kravy bez manuálnej práce\n\n**Ekonomický dopad**: stádo s optimálnym BCS manažmentom má o 200–500 l mlieka/krava/rok viac → pre 100 kráv = 220 000–550 000 Kč/rok.\n\nPozri tiež [[otelenie]], [[ruje]], [[mastitída]], [[ku-kontrola-užitkovosti]], [[tmr]], [[tranzitné-obdobie]].",
    "related": [
      "oteleni",
      "rijnost",
      "mastitida",
      "tmr"
    ]
  },
  {
    "slug": "ku-kontrola-uzitkovosti",
    "term": "Kontrola užitkovosti (KU)",
    "alias": [
      "KU",
      "DHIA",
      "milk recording"
    ],
    "kategorie": "chov",
    "shortDef": "Kontrola užitkovosti je systematický monitoring produkcie a kvality mlieka dojníc. V SK zabezpečuje Slovenský zväz chovateľov — 1× mesačne analýza mlieka na kravu (množstvo, tuk, bielkoviny, SCC, urea). Kľúčové pre selekciu, zdravie a šľachtenie.",
    "longDef": "Kontrola užitkovosti (KU, anglicky *DHIA — Dairy Herd Improvement Association*, *milk recording*) je **systematický monitoring produkcie a kvality mlieka jednotlivých dojníc** cez plemenárske služby. V SK zabezpečuje **Slovenský zväz chovateľov**.\n\n**Princip:**\n- 1× mesačne technik na farmu\n- Vzorky mlieka z každej kravy (ranné + večerné dojenie)\n- Analýza v akreditovanej laboratórii\n- Výsledky spracuje zväz + plemenná kniha (pozri [[plemenná kniha]])\n\n**Merané parametre:**\n\n| Parametr | Holstein optimum |\n|----------|------------------|\n| Množstvo | 25–40 kg/deň |\n| Tuk | 3,8–4,2 % |\n| Bielkoviny | 3,2–3,5 % |\n| SCC | <200 000/ml |\n| Urea | 15–30 mg/100 ml |\n| Laktóza | 4,8–5,0 % |\n\n**Použitie KU dát:**\n\n**1. Selekcia kráv:**\n- Top 25 % → sexed semen (zaručené jalovice pre chov)\n- Bottom 25 % → mäsová genetika alebo predaj\n\n**2. Diagnostika:**\n- Vysoké SCC → mastitída (pozri [[mastitída]])\n- Nízke bielkoviny → zmena TMR (pozri [[tmr]])\n- Vysoké urea → znížiť CP v diéte\n- Pokles produkcie → vyšetrenie\n\n**3. Plemenná hodnota:**\n- KU dáta idú do plemennej knihy\n- Top býky vybraní z výsledkov ich dcér\n\n**Účasť:**\n- ~60–70 % mliečnych fariem v SK\n- Vysoká užitkovosť (>10 000 kg/laktácia) takmer 100 % v KU\n\n**Cena:**\n- 150–250 Kč/kravu/mesiac.\n- Stádo 100 kráv: 180 000–300 000 Kč/rok\n- ROI: 500–1 500 Kč/krava/rok zisk z lepšej selekcie\n\n**Digitalizácia:**\n- AMS (Lely, DeLaval) ukladá dáta každého dojenia\n- In-line analyzéry merajú tuk/bielkoviny v reálnom čase\n- Trend: AMS dáta môžu nahradiť klasickú KU\n\nPozri tiež [[plemenná kniha]], [[mastitída]], [[bcs-body-condition]], [[otelenie]], [[dojiareň]], [[inseminácia]].",
    "related": [
      "plemenna-kniha",
      "mastitida",
      "bcs-body-condition",
      "dojirna"
    ]
  },
  {
    "slug": "plemenna-kniha",
    "term": "Plemenná kniha",
    "alias": [
      "herd book",
      "plemenná evidencia"
    ],
    "kategorie": "chov",
    "shortDef": "Plemenná kniha je oficiálny registr čistokrvných zvierat plemena s rodokmenom a plemennou hodnotou. Vedi ju uznaná plemenárska organizácia (v SR Slovenský zväz chovateľov). Kľúčový nástroj šľachtenia, EÚ dotácií a obchodu s genetikou.",
    "longDef": "Plemenná kniha (nem. *Herdbuch*, ang. *herd book*) je **oficiálny registr čistokrvných zvierat plemena** spravovaný uznanou plemenárskou organizáciou. Obsahuje rodokmeň, plemennú hodnotu, vlastnosti a pôvod. Kľúčový nástroj šľachtenia a EÚ dotácií.\n\n**História:**\n- 1791 — prvá (British Thoroughbred kone)\n- 1822 — prvá pre dobytok (Shorthorn UK)\n- 1872 — Holstein-Friesian Herd Book (NL/DE)\n- 1898 — Slovenský zväz chovateľov založený\n\n**Sekcie:**\n- **A (čistokrvné)**: otec + matka registrovaní, ≥7/8 čistokrvnosti\n- **B (upgrade)**: cesta k sekcii A cez 2–3 generácie\n- **C (foundation)**: len matka registrovaná, 50 % čistokrvnosti\n\n**Čo eviduje:**\n\n1. **Identifikácia**: ušná známka (viz [[ušná-značka]]), meno, dátum, plemeno\n2. **Rodokmeň**: 4 generácie dozadu (8 predkov)\n3. **Vlastnosti**: produkcia, plemenné hodnoty (PV/EBV), telesný typ\n4. **Reprodukcia**: inseminácia, otelenie, mezidoba\n5. **Zdravie**: mastitídy, veterinárne zákroky, vyradenie\n\n**Plemenná hodnota (PV):**\n\nKľúčové indexy:\n- **TPI** (Total Performance Index — USA Holstein)\n- **NM$** (Net Merit dollars — ekonomický)\n- **RZG** (Relativzuchtwert Gesamt — DE/AT Holstein)\n- **NORD** (Severský index)\n- **CZECH SIH** (CZ celkový index Holstein)\n\n**Genomické hodnotenie (2009+):**\n- DNA testy mladých zvierat\n- Predikcia plemennej hodnoty bez čakania na dcéry\n- 10 000+ testov/rok v SR\n\n**Medzinárodná výmena:**\n- **Interbull** — koordinácia cez 30+ krajín\n- SR importuje 60 % semena (USA, Kanada, NL, DK)\n\n**SR plemenárske organizácie:**\n- **ČSCH** — Holstein, čierno strakatý\n- **Zväz chovateľov mäsového dobytka** — Charolais, Limousin, Aberdeen Angus\n- **Plemenári Lhota, Bohemia Plus** — inseminačné stanice\n\n**Plemená v SR:**\n- Mliečne: Holstein (#1, 70 %), Český strakatý (20 %), Jersey, Montbéliarde\n- Mäsové: Charolais, Limousin, Aberdeen Angus, Hereford, Simmental, Belgické modré\n\n**Ekonomická hodnota:**\n- Čistokrvná top jalovica: 50 000–250 000 Kč\n- Top býk pre insemináciu: 500 000+ Kč\n- Embryotransfer top genetiky: 50 000–500 000 Kč\n- World Dairy Expo Grand Champion: 1+ mil. USD\n\nPozri tiež [[ku-kontrola-užitkovosti]], [[inseminácia]], [[jalovice]], [[bcs-body-condition]], [[f1-hybrid]], [[ušná-značka]].",
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
    "term": "Kolostrum (mlezivo)",
    "alias": [
      "kolostrum",
      "mlezivo",
      "prvé mlieko"
    ],
    "kategorie": "chov",
    "shortDef": "Kolostrum (mlezivo) je prvé mlieko kravy po otelení — bohaté na imunoglobulíny (IgG). Teľa musí dostať 4 litre kolostra do 6 hodín po pôrode pre pasívnu imunitu. Bez kolostra: 30–50 % úmrtnosť teliat v prvých týždňoch.",
    "longDef": "Kolostrum (lat. *colostrum*, čes. *mlezivo*) je **prvé mlieko kravy** po otelení. Kľúčové pre **prežitie teľa** — narodené teľa nemá vrodenú imunitu (placenta kravy je neprepustná pre protilátky), kolostrum je jediný zdroj **pasívnej imunity**.\n\n**Zloženie kolostra vs mlieka:**\n\n| Komponent | Kolostrum | Mlieko (deň 3+) |\n|-----------|-----------|----------------|\n| Sušina | 23–28 % | 12–13 % |\n| Bielkoviny | 14–18 % | 3,3 % |\n| Tuk | 6–7 % | 4 % |\n| IgG | 60–120 g/l | 0,5–1 g/l |\n| Vitamín A | 10× vyšší | bežný |\n\n**Kritické okno absorpcie:**\n- 0–6 h po pôrode: 100 % absorpcia IgG (= najvyššia)\n- 6–12 h: 60 % absorpcia\n- 12–24 h: 30 % absorpcia\n- 24+ h: <10 % absorpcia (sliznica \"zavrela\")\n\n**Odporúčania:**\n\n**1. prvá dávka (kritická):**\n- **4 litre kolostra do 6 hodín** po pôrode\n- Buď matkiným (ak je zdravá), alebo pasterizovaným zásobným\n- Aplikácia: fľaša alebo drench tube (sonda)\n\n**2. Druhá dávka:**\n- 2 litre za 6–12 h\n\n**3. Deň 2–3:**\n- Postupný prechod na bežné mlieko alebo náhradu\n\n**Kvalita kolostra:**\n\n**Test (Brix refraktometer):**\n- >22 % Brix = vysoká kvalita (>60 g IgG/l)\n- 18–22 % Brix = stredná\n- <18 % Brix = nízka (nutné doplniť)\n\n**Faktory kvality:**\n- Plemeno: Jersey > Holstein (vyšší IgG)\n- Poradie laktácie: staršie kravy majú vyšší IgG\n- Doba dojenia: prvé dojenie = najvyšší IgG\n- Hygiena: čisté vemena → nižšia kontaminácia\n\n**Pasterizácia:**\n- 60 °C × 60 min\n- Účel: zničiť *Mycoplasma bovis*, *Salmonella*, *Mycobacterium avium* (Johneho)\n- Nesmie znížiť IgG významne (-10 %)\n- Pasterizér: 100 000–300 000 Kč\n\n**Zmrazenie:**\n- Kvalitné kolostrum top kráv zmrazené (-20 °C, plastové sáčky 2 l)\n- Skladovateľnosť: 12 mesiacov\n- Rozmrazenie: 40 °C vodná kúpeľ, max 60 min\n\n**Pasívna imunita zlyhanie (FPT):**\n- 20–30 % teliat (medzinárodný priemer)\n- Symptómy: hnačka, pneumónia v 1.–4. týždni\n- Diagnostika: STP (Total Protein) v krvi teľa 2.–7. deň — <5,0 g/dl = FPT\n\n**Ekonomický dopad:**\n\n**Bez kvalitného kolostra:**\n- 30–50 % úmrtnosť (vs 5–10 %)\n- Liečba: 1 000–3 000 Kč/teľa\n- Stratené teľa: 8 000–60 000 Kč hodnoty\n\n**S manažmentom:**\n- Lepší rast, lepšia produkcia v dospelosti (epigenetický efekt)\n\nPozri tiež [[otelenie]], [[jalovice]], [[mastitída]], [[tranzitné-obdobie]], [[dojiareň]].",
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
    "term": "Tranzitné obdobie",
    "alias": [
      "transition period",
      "prechodné obdobie dojnice"
    ],
    "kategorie": "chov",
    "shortDef": "Tranzitné obdobie je 3 týždne pred a 3 týždne po otelení = 6 týždňov kritického zdravotného a metabolického prechodu kravy. 70 % všetkých zdravotných problémov vzniká v tomto okne. Kľúč: TMR dizajn, BCS manažment, prevencia ketózy + hypokalciémie.",
    "longDef": "Tranzitné obdobie (anglicky *transition period*) je **3 týždne pred a 3 týždne po otelení** = **6 týždňov kritického prechodu** mliečnej kravy medzi suchým obdobím a aktívnou laktáciou. **70 % všetkých zdravotných problémov** mliečnej kravy vzniká práve v tomto okne.\n\n**Hlavné zdravotné riziká:**\n\n**1. Mliečna horúčka (hypokalciémia):**\n- Ca v krvi <8 mg/dl (norma 8,5–10,5)\n- Klinická: 3–8 % kráv, paralýza, ležanie\n- Subklinická: 25–50 % kráv (znižuje produkciu, imunitu)\n- Liečba: kalciumglukonát IV\n- Prevencia: aniónová zmes pred pôrodom (DCAD <0)\n\n**2. Ketóza:**\n- Negatívny energetický balans (NEB) → mobilizácia tuku → ketolátky\n- Subklinická: 30–50 % kráv (BHB >1,2 mmol/l)\n- Klinická: 5–10 % (BHB >3 mmol/l, anorexia, dych acetón)\n- Liečba: propylénglykol, glukóza IV\n- Prevencia: monenzín (Kexxtone), cholín, postupné navýšenie TMR\n\n**3. Retentio placentae:**\n- 5–10 % otelení (vyššie u dvojčiat, dystocia)\n- Komplikácie: metritída → znížená fertilita\n\n**4. Metritída (zápal maternice):**\n- Akútna (pyometra) aj chronická (endometritída)\n- Liečba: antibiotiká + PGF₂α\n\n**5. Posunutie slezu (DA):**\n- LDA (ľavostranné): 95 %, 2–4 týždne po pôrode\n- Liečba: chirurgické vrátenie (5 000–15 000 Kč)\n\n**6. Mastitída** (viz [[mastitída]]):\n- Imunitná supresia zvyšuje riziko\n\n**Manažment:**\n\n**3 týždne pred otelením (Close-up Dry):**\n\nTMR dizajn:\n- **Aniónová zmes** (DCAD <0): kyslejšie telo → lepšia mobilizácia Ca\n- Energia: 6,5–7,0 MJ NEL/kg DM\n- CP: 14–15 %\n- NDF: 32–35 %\n- Cieľ: udržať vysoký príjem krmiva\n\nSledovanie:\n- BCS (3,25–3,5, viz [[bcs-body-condition]])\n- Príjem krmiva denne\n- Aktivita\n\n**Deň otelenia + prvé 3 dni:**\n\n- Suchá, čistá teliačka (12+ m²)\n- Veterinárny dohľad\n- Kolostrum teľa do 6 h (viz [[kolostrum-mlezivo]])\n- Calcium bolus krave bezprostredne po pôrode\n- Drench (sondovanie) elektrolyty + propylénglykol ak nepije\n\n**Týždne 1–3 (Fresh Cow):**\n\nTransition TMR:\n- Postupné zvyšovanie koncentrátu (deň 1: 60/40 píce/koncentrát; deň 21: 50/50)\n- Energia: 7,2 MJ NEL/kg DM\n- CP: 16–17 %\n- RUP: 35–38 %\n- Cholín (Reashure): 15 g/krava/deň\n\nSledovanie:\n- Denné váženie mlieka\n- BHB test (ketóza) — deň 5, 7, 12\n- NEFA test (mobilizácia tuku)\n- BCS každý týždeň\n- Teplota (>39,5 °C = problém)\n\n**Ekonomický dopad:**\n\n**OPTIMÁLNE tranzitné:**\n- 5 % klinických problémov\n- 305d produkcia 11 000+ kg\n\n**ŠPATNÉ tranzitné:**\n- 20–30 % klinických problémov\n- Liečba: 5 000–10 000 Kč/krava\n- Znížená produkcia: -500 až -1 500 kg/laktácia\n- Vyradenie: 20+ % (vs 10 %)\n\n**ROI investície do tranzitného manažmentu**: 3–5× = najvýnosnejšia investícia mliečnej farmy.\n\nPozri tiež [[otelenie]], [[bcs-body-condition]], [[mastitída]], [[tmr]], [[kolostrum-mlezivo]], [[krmné-dávky]].",
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
    "term": "F1 hybrid",
    "alias": [
      "F1 generácia",
      "first filial generation",
      "kríženec"
    ],
    "kategorie": "chov",
    "shortDef": "F1 hybrid je prvá generácia krížencov dvoch rôznych plemien/línií. Vykazuje heterózu (hybrid vigor) — vyšší výkon ako priemer rodičov. V poľnohospodárstve kľúčové pre semená (hybridná kukurica, raž) aj živočíšnu výrobu (mlieko, prasatá, brojleri).",
    "longDef": "F1 hybrid (anglicky *F1 generation*, *first filial generation*) je **prvá generácia krížencov dvoch geneticky odlišných línií**. Vyznačuje sa **heterózou (hybrid vigor)** — vyšším výkonom ako priemer rodičov. Kľúčový genetický princíp v modernom poľnohospodárstve.\n\n**Princíp:**\n\n- **Rodič A** × **Rodič B** = **F1 generácia** (geneticky identickí, heterozygotní)\n- F1 × F1 = **F2** (rekombinanti, variabilní, heteróza klesá)\n\n**Heteróza (hybrid vigor):**\n- F1 výkonnejší o 5–30 % nad priemerom rodičov\n- Mechanizmus: kombinácia rôznych alel, maskovanie recesívnych defektov\n- **Zníži sa v F2** → každoročný nákup nového F1 osiva\n\n**Aplikácia v rastlinnej výrobe:**\n\n**1. Hybridná kukurica:**\n- Henry Wallace USA 1920s — priekopníctvo\n- USA výnos: 1900: 1,8 t/ha → dnes 11+ t/ha (vďaka F1)\n- F1 výhody: +20–30 % výnos, uniformita, stresová tolerancia\n- Trh: Pioneer, DEKALB (Bayer), Syngenta, Limagrain\n\n**2. Hybridná raž** (pozri [[zito-ozime]]):\n- KWS 1990s (CMS — Cytoplasmic Male Sterility)\n- Výnosy: +30–50 % vs tradičné\n\n**3. Cukrová repa, zelenina** — takmer 100 % F1\n\n**4. Hybridná pšenica** — neúspešný projekt (samospraš)\n\n**Aplikácia v živočíšnej výrobe:**\n\n**1. Prasatá:**\n- Pietrain × (Veľký biely × Landrasse) = \"double cross\"\n- F1 prasnice: vysoká plodnosť (12+ prasiat/vrh)\n- F1 výkrm: rýchly rast, chudé mäso\n\n**2. Brojleri:**\n- **Ross 308**: 4-líniový hybrid, medzinárodný štandard\n- Rast: 42 dní z 40 g na 2,5 kg\n- Konverzia: 1,6 kg krmiva / kg mäsa\n\n**3. Nosnice:**\n- **ISA Brown** (Hubbard ISA, Hendrix Genetics)\n- 320+ vajec/rok (vs 200 tradičné)\n\n**4. Crossbreeding dobytok:**\n\n**Mliečny kríž** (menej častý):\n- Nórsky červený × Holstein — robust, lepšie zdravie\n- Jersey × Holstein — vyšší tuk\n\n**Mäsový kríž** (bežný):\n- Holstein krava × Charolais býk — premium kríženci\n- Holstein × Aberdeen Angus — mramorovanie\n- Komerčný výkrm: 50 kg → 600 kg za 12–18 mes.\n\n**Teória heterózy:**\n1. **Dominancia**: F1 maskuje recesívne defekty oboch línií\n2. **Overdominancia**: heterozygot je výkonnejší\n3. **Epistáza**: synergia interakcií medzi lokusmi\n\n**Etika a debata:**\n- Závislosť fariem na semenárskych firmách (Bayer, Corteva, Syngenta, Limagrain)\n- Strata tradičnej variability\n- **Open Source Seed Initiative** — alternatíva\n\n**EU regulácia:**\n- CMS hybridy ≠ GMO (klasická šľachtiteľská technológia)\n- GMO hybridy (Mon810) silne obmedzené v EU\n\nPozri tiež [[plemenna-kniha]], [[inseminace]], [[zito-ozime]], [[kukurice-silazni]], [[ku-kontrola-uzitkovosti]].",
    "related": [
      "plemenna-kniha",
      "inseminace",
      "zito-ozime",
      "kukurice-silazni"
    ]
  },
  {
    "slug": "precision-livestock-farming",
    "term": "Precision Livestock Farming (PLF)",
    "alias": [
      "PLF",
      "precízny chov",
      "precision dairy",
      "smart farming živočíšne"
    ],
    "kategorie": "precise-farming",
    "shortDef": "Precision Livestock Farming (PLF) je systém kontinuálneho automatického monitorovania zvierat pomocou senzorov (akcelerometre, RFID, kamery) a AI analýzy dát. Detekuje ruju, mastitídu, krívanie, stres skôr ako človek — rieši 80 % manažment rozhodnutí mliečnej farmy.",
    "longDef": "Precision Livestock Farming (PLF, „precízny chov\", anglicky *smart farming*) je systém **kontinuálneho automatického monitorovania zvierat** pomocou senzorov, IoT a AI. Cieľ: detekovať **biologické signály** (ruja, choroba, stres, kŕmenie) **skôr ako človek** a transformovať dáta do manažmentu.\n\n**História:**\n- **1990s**: prvé aktivometre (pedometre) v dojárňach\n- **2010s**: rozšírenie akcelerometrov na obojkoch\n- **2015+**: AI/ML modely pre behaviorálnu analýzu\n- **2020+**: kamery + počítačové videnie (BCS, krívanie)\n- **2024**: integrácia LLM (Large Language Models) pre odporúčania\n\n**Hlavné senzorové technológie:**\n\n**1. Akcelerometre (obojkové / nákolenné):**\n- **Merajú**: aktivitu (kroky, mounting, ležanie)\n- **Aplikácia**: detekcia ruje, ranná detekcia choroby, monitoring komfortu\n- **Top produkty**:\n  - **CowManager SensOor** (NL) — obojkový\n  - **Allflex Heatime** (IL) — obojkový\n  - **DeLaval DDM** — ušný tag\n  - **SCR Heatime** — izraelská alternatíva\n- **Cena**: 2 000–5 000 Kč/kravu (jednorazová) + 30–80 Kč/mesiac software\n\n**2. RFID (radio-frequency identification):**\n- **Ušná známka** (pozri [[usni-znamka]]) s integrovaným RFID čipom\n- **Statické čítačky**: brány do dojárne, kŕmnych boxov\n- **Aplikácia**: identifikácia, automatické kŕmenie (per cow), monitoring príjmu\n\n**3. Mliečny analyzér (in-line):**\n- **Integrovaný v dojárni** — meria objem + zloženie v reálnom čase\n- **Parametre**: tuk, bielkoviny, laktóza, vodivosť (mastitída — pozri [[mastitida]])\n- **Aplikácia**: alarm vysokého SCC, denná KU bez technika\n- **Trh**: AfiLab (DeLaval), Lely milk analyzer\n\n**4. Kamery + Počítačové videnie:**\n- **Aplikácia**:\n  - **BCS skórovanie** (pozri [[bcs-body-condition]]) automaticky\n  - **Detekcia krívania** — analýza chôdze\n  - **Behavior monitoring** (lying time, water visits)\n  - **Detekcia ruje** (komplement k akcelerometru)\n- **Trh**: DeLaval BCS Camera, Cargill ZAFFY (krívanie), Connecterra (full AI)\n- **Cena**: 200 000–500 000 Kč inštalácia\n\n**5. Bolus senzory (v bachore):**\n- **Polykané teľaťom** (orálne) — žije v bachore roky\n- **Merajú**: bachorové pH, teplotu, motorickú aktivitu\n- **Aplikácia**: acidóza detection, ranná detekcia choroby\n- **Trh**: Mottainai, Cowtronix\n- **Cena**: 3 000–8 000 Kč/krava (jednorazové)\n\n**6. Vodné spotreba senzory:**\n- **Meranie spotreby vody** per cow (cez RFID v boxe)\n- **Aplikácia**: pokles príjmu = ranná indikácia choroby alebo stresu\n\n**Kľúčové aplikácie PLF:**\n\n**1. Detekcia ruje (pozri [[rijnost]]):**\n- **Tradičná vizuálna**: 45–65 % detekcia\n- **PLF akcelerometer**: 90–98 % detekcia\n- **Inseminačný timing**: optimálny (6–18 h od začiatku ruje)\n- **Ekonomický dopad**: -50 dní medzidoby = +500 l mlieka/krava/rok\n\n**2. Detekcia mastitídy:**\n- **In-line mliečny analyzér** detekuje vodivosť (≈ SCC)\n- **Alarm** na zvýšenie 24 h pred klinickými príznakmi\n- **Rýchlejšia liečba** = menej stratenej produkcie\n\n**3. Detekcia chorôb (všeobecne):**\n- **Zmena správania** (-30 % aktivity alebo -20 % ruminácie) = alarm\n- **Ranný začiatok liečby** znižuje closure rate\n- **Teľa v transition period** (pozri [[transition-period]]) — vysoký ROI\n\n**4. Detekcia krívania:**\n- **Kamerový systém** sleduje chôdzu\n- **Tréning AI**: klasifikácia 1–5 (locomotion score)\n- **Cieľ**: <5 % kráv s lameness score >3\n\n**5. Welfare monitoring:**\n- **Lying time** (12–14 h = optimum)\n- **Standing time u kŕmenia**\n- **Sociálne interakcie**\n\n**6. Reprodukčný manažment:**\n- **Ovsynch protokoly** podľa dát\n- **Inseminačný timing**\n- **Konfirmácia zabreznutia** (zmena aktivity 5–7 dní po inseminácii)\n\n**Software a platformy:**\n\n- **CowManager** (NL) — dominantný v EÚ\n- **Connecterra IDA** (NL) — AI-first\n- **Afimilk Aclick** (IL)\n- **GEA CowScout** (DE)\n- **Lely Astronaut + Horizon** (NL)\n- **Microsoft Azure FarmBeats** — IoT platforma\n\n**Robotické dojárne (AMS) ako PLF platforma:**\n- Lely Astronaut, DeLaval VMS, GEA DairyRobot\n- Integrácia: dojenie + kŕmenie + senzory + software\n- Cena: 4–6 mil. Kč per robot (1 robot = 60 kráv)\n\n**ROI PLF systému:**\n\n**Investícia na 100 kráv:**\n- Akcelerometre + sw: 250 000–500 000 Kč\n- Plus in-line analyzér: +400 000–800 000 Kč\n- Plus BCS kamera: +300 000–500 000 Kč\n- **Celkom**: 950 000–1 800 000 Kč\n\n**Benefity ročne:**\n- Lepšia detekcia ruje: +50 000–100 000 Kč/kravu × 100 = 50 000 Kč/100 kráv... wait, recalc: +1 000–2 000 Kč/krava = 100 000–200 000 Kč/rok pre 100 kráv\n- Menej mastitíd: -50 000–100 000 Kč/rok\n- Lepší welfare = lepšia dlhovekosť kráv: 100 000–200 000 Kč/rok\n\n**Celkom**: 250 000–500 000 Kč/rok ROI\n**Návratnosť**: 2–5 rokov\n\n**Bariéry:**\n1. **Vysoká investícia** — pre malé farmy obtiažne\n2. **Komplexnosť** — vyžaduje IT/digital zručnosti\n3. **Závislosť na internete** — cloud sw vyžaduje stabilný internet\n4. **Údržba** — senzory životnosť 5–7 rokov\n\n**Budúcnosť:**\n- **LLM integrácia** — ChatGPT-like rozhranie pre farmu\n- **Predikčné modely** — predikcia mastitídy 7 dní dopredu\n- **Genomické integrácie** — kombinácia PLF dát s plemennou hodnotou\n- **Vir farmy** — koncept \"digital twin\" mliečneho stáda\n\nPozri tiež [[rijnost]], [[mastitida]], [[bcs-body-condition]], [[ku-kontrola-uzitkovosti]], [[transition-period]], [[dojirna]], [[telematika]], [[usni-znamka]].",
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
    "term": "Satelity v poľnohospodárstve",
    "alias": [
      "satellite agriculture",
      "remote sensing",
      "družicové dáta",
      "Sentinel dáta"
    ],
    "kategorie": "precise-farming",
    "shortDef": "Satelitné dáta (Sentinel, Landsat, Planet) poskytujú multispektrálne snímky pre monitoring polí — vegetačné indexy (NDVI), vlhkosť pôdy, predikcia výnosu, detekcia stresu plodín. Bezplatné Sentinel dáta umožňujú každej farme sledovať 100+ ha za zlomok nákladov.",
    "longDef": "Satelitné dáta sú kľúčový **vstup pre presné poľnohospodárstvo** — poskytujú **multispektrálne snímky** s priestorovým rozlíšením 1–30 m a časovým rozlíšením 1–7 dní. Aplikácie: monitoring porastov, detekcia stresu, aplikácie s variabilnou dávkou (pozri [[variabilná-dávka]]), predikcia výnosu.\n\n**Hlavné satelitné programy:**\n\n**1. Copernicus Sentinel (EÚ, zadarmo!):**\n- **Sentinel-2** — multispektrálne (13 pásiem), rozlíšenie 10 m (RGB+NIR), 20 m (red edge), 60 m (atmosférické)\n- **Frekvencia**: 5 dní (kombinácia 2 satelitov)\n- **Pokrytie**: celá EÚ pravidelne\n- **Cena**: ZADARMO pre všetkých (EÚ iniciatíva)\n- **API**: Sentinel Hub, Google Earth Engine\n\n**2. Landsat (USA, NASA, zadarmo!):**\n- **Landsat 8/9** — rozlíšenie 30 m (multispektrálne), 100 m (termálne)\n- **Frekvencia**: 16 dní (jeden satelit)\n- **Pokrytie**: globálne od 1972 (50+ rokov dát!)\n- **Cena**: ZADARMO\n- **Použitie**: dlhodobé trendy, história\n\n**3. Planet Labs (USA, komerčné):**\n- **PlanetScope** — denné snímky, rozlíšenie 3 m\n- **SkySat** — rozlíšenie 0,5 m (subdetailné)\n- **Cena**: 10–50 USD/km²/mesiac.\n- **Použitie**: presné poľnohospodárstvo na úrovni rastliny\n\n**4. Maxar / DigitalGlobe (komerčné, drahé):**\n- **WorldView-3/4** — rozlíšenie 0,3 m\n- **Cena**: 25–100 USD/km²\n- **Použitie**: vojenské, urbanistické plánovanie, zriedkavo ag\n\n**5. NICFI (Nórsko, tropické lesné dáta zadarmo):**\n- Planet Labs PlanetScope pre tropy ZADARMO\n- Pre EÚ farmy irelevantné\n\n**Vegetačné indexy (kľúčové výstupy):**\n\n**1. NDVI (Normalized Difference Vegetation Index) — pozri [[ndvi]]:**\n- **Vzorec**: (NIR - RED) / (NIR + RED)\n- **Hodnoty**: -1 až +1 (porast: 0,3–0,9)\n- **Interpretácia**: vyššie = viac chlorofylu = zdravší porast\n- **Aplikácie**: detekcia stresu, variabilná dávka N hnojenia\n\n**2. NDRE (Normalized Difference Red Edge):**\n- **Vzorec**: (NIR - RedEdge) / (NIR + RedEdge)\n- **Citlivejšie** k variabilite N v plodinách\n- **Aplikácie**: rozhodovanie o hnojení v sezóne\n\n**3. EVI (Enhanced Vegetation Index):**\n- Robustnejšie voči atmosférickým efektom\n- Vhodné pre lesy, husté porasty\n\n**4. SAVI, OSAVI (Soil-Adjusted):**\n- Pre nízke pokrytie (kukurica v BBCH 12–30)\n- Odpočítava efekt holé pôdy\n\n**5. Termálne indexy:**\n- Landsat 8/9 termálny pás\n- **CWSI** (Crop Water Stress Index) — detekcia sucha\n- Sentinel-3 = lepšie teplotné snímky (1 km rozlíšenie, denne)\n\n**6. SAR (Synthetic Aperture Radar):**\n- Sentinel-1 — radar (preniká mrak, vidí v noci)\n- **Aplikácie**: vlhkosť pôdy, biomasa, detekcia zberu\n\n**Komerčné platformy pre farmárov:**\n\n- **Climate FieldView** (USA, Bayer) — top globálne, 500–1 500 USD/farma/rok\n- **OneSoil** (NL) — bezplatná, NDVI zo Sentinel\n- **Mapy.eAgronom** (CZ, EE) — domáca integrácia\n- **Yara Atfarm** — N variabilita\n- **Soyl** (UK) — variabilná dávka N + osivo\n- **Agremo** (RS) — dron + satelitná kombinácia\n- **SatAgro** (PL) — Sentinel-based, EÚ farmy\n- **Sentinel Hub Playground** — DIY platforma (technická)\n\n**Aplikácie v CZ farme:**\n\n**1. Variabilná dávka N hnojenia:**\n- Sentinel-2 NDVI BBCH 32 pšenice\n- Mapa variability → súbor pre postrekovač (ISO XML)\n- Aplikačný stroj reaguje sekcia po sekcii (10–24 m sekcia)\n- **Úspora N**: 10–20 % (= 500–1 000 Kč/ha)\n\n**2. Detekcia stresu (sucho, choroba):**\n- Pravidelný NDVI monitoring\n- Anomálie = signál k kontrole\n- Ranný zásah = prevencia strát\n\n**3. Predikcia výnosu:**\n- Historické NDVI dáta + ML model\n- Predikcia výnosov 30–60 dní pred zberom\n- Plánovanie logistiky (sušiarne, sklady)\n\n**4. Poistenie úrody:**\n- **Parametrické poistenie** — poistka platí podľa NDVI anomálie\n- **Bez nutnosti** prehliadky poľa poisťovateľom\n- **Trh**: Hannover Re, Munich Re — EÚ parametrické poistenie\n\n**5. EÚ CAP kontroly:**\n- **SZIF** používa Sentinel dáta pre kontrolu LPIS (pozri [[lpis]])\n- Detekuje \"zber pred vyhlásením\", neoznámené operácie\n- \"Geo-tagged photos\" verifikované satelitmi\n\n**6. Historická analýza poľa:**\n- 10+ rokov NDVI dát ZADARMO\n- Identifikácia variability pôdy (zóny)\n- Plánovanie investícií (drenáž, vápnenie zón)\n\n**Technické obmedzenia:**\n- **Mraky** — Sentinel-2 optický nevidí cez mrak (cca 30 % snímok zatažených)\n- **Rozlíšenie** — 10 m nevidí jednotlivé rastliny (len plošne)\n- **Atmosférické korekcie** — vyžaduje preprocessing (riešia platformy)\n- **Časový lag** — od snímania po dostupnosť 1–7 dní\n\n**Cena PRE farmu:**\n\n**Free tier** (Sentinel + OneSoil):\n- **0 Kč**\n- Základný NDVI 1× týždenne\n- Vhodné pre malé farmy\n\n**Mid tier** (Climate FieldView, eAgronom):\n- **15 000–40 000 Kč/rok**\n- Plné rozhranie, mapy variabilnej dávky, integrácia s technikou\n- Vhodné pre 200–1 000 ha farmy\n\n**Top tier** (Planet + custom analytics):\n- **100 000+ Kč/rok**\n- Denné 3m rozlíšenie, vlastné AI modely\n- Vhodné pre veľké korporátne farmy alebo výskumné projekty\n\n**Budúcnosť:**\n- **Sentinel-3 NextGen** (2025+) — vyššie rozlíšenie\n- **AI integrácia** — automatická detekcia konkrétnych chorôb (rzi, septorióza)\n- **Real-time poistenie** — okamžitá výplata podľa satelitu\n- **Carbon credits** — verifikácia sekvestrácie pomocou satelitného monitoringu (pozri [[karbonové-poľnohospodárstvo]])\n\nPozri tiež [[ndvi]], [[variabilná-dávka]], [[gps-rtk]], [[lpis]], [[karbonové-poľnohospodárstvo]], [[telematika]], [[drony-poľnohospodárstvo]].",
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
    "term": "Agrolesníctvo",
    "alias": [
      "agroforestry",
      "agroles",
      "silvopasture",
      "alley cropping"
    ],
    "kategorie": "precise-farming",
    "shortDef": "Agrolesníctvo je systém pestovania stromov a poľnohospodárskych plodín alebo živočíchov na rovnakom pozemku. Kľúčové formy: alley cropping (rady stromov medzi plodinami), silvopasture (pastva medzi stromami), forest farming (rozšírený les). V EÚ rastúci v rámci CAP 2023+.",
    "longDef": "Agrolesníctvo (anglicky *agroforestry*, „poľnohospodárstvo s lesom\") je **integrovaný systém pestovania stromov + poľnohospodárskych plodín alebo živočíchov** na rovnakom pozemku. Synergia stromov a poľnohospodárstva zvyšuje produktivitu, biodiverzitu, sekvestráciu uhlíka.\n\n**Hlavné formy:**\n\n**1. Alley cropping (medzisadené poľné hospodárstvo):**\n- **Princíp**: rady stromov (ovocné, lesnícke) v medzerách 15–40 m medzi nimi pestujeme plodiny\n- **Stromy**: orech, jabloň, hruška, lipa, dub červený, jelša\n- **Plodiny**: pšenica, kukurica, repka, strukoviny\n- **Výnos plodín**: -10 až -20 % (kvôli zatieneniu)\n- **Plus stromy**: ovocie, drevo, sekvestrácia C → kompenzácia + bonus\n\n**2. Silvopasture (pastva medzi stromami):**\n- **Princíp**: pastviny s rozptýlenými stromami alebo radami\n- **Výhody**: tieň pre dobytok (znižený tepelný stres), pastva pod stromami, biodiverzita\n- **Stromy**: dub, gaštan, ovocné, akcie orech\n- **Tradícia**: dehesa (Španielsko), montado (Portugalsko), pastvy v SK Krkonoše\n\n**3. Forest farming:**\n- **Princíp**: rozšírené pestovanie pod lesným pokrytím\n- **Plodiny**: huby, lesné jahody, bylinky, ženšen\n- **Niche trh**, vysoká marža\n\n**4. Vetrolamy + plodiny:**\n- **Pásové výsadby** stromov okolo polí (5–20 m široké)\n- **Ochrana** proti veternnej erózii\n- **Mikroklíma** — menej sucha, lepšie výnosy o 5–15 %\n- **Tradícia SK**: jiřinské vetrolamy (južná Morava)\n\n**5. Riparian buffer (brehové porasty):**\n- **Stromy pozdĺž vodných tokov** (5–30 m)\n- **Účel**: filtrácia splavov hnojív + pesticídov, biodiverzita\n- **EU dotácie** v rámci AEKO\n\n**6. Plantážové ovocné sady:**\n- **Klasický sad** je už agroforestry forma\n- **Intenzívne**: jablone 800–1 200/ha, jednoosé rady\n- **Plus**: trávny pás medzi rady → cilačné skoty pastevne\n\n**Ekosystémové benefity:**\n\n**1. Sekvestrácia uhlíka:**\n- **Stromy ukladajú C v dreve + pôde** — 2–10 t CO₂/ha/rok\n- Pre CAP carbon farming = vysoký kredit (viď [[karbonove-zemedelstvi]])\n\n**2. Biodiverzita:**\n- **Stromy** = habitat pre vtáky, hmyz, drobné cicavce\n- **Pesticídna redukcia** — predátori škodcov (slunéčka, hmyz parazitoidi)\n\n**3. Vodné hospodárstvo:**\n- **Korene stromov** infiltrujú vodu hlbšie\n- **Znižuje eróziu** (viď [[eroze-pudy]])\n- **Vetrolamy** znižujú evaporáciu o 20–30 %\n\n**4. Welfare zvierat (silvopasture):**\n- Tieň v lete = nižší tepelný stres\n- Voľný pohyb pre dobytok\n\n**5. Diverzifikácia príjmov:**\n- Plodiny + drevo + ovocie + housova + bio palivá\n- Risk-spreading proti trhovým šokom\n\n**Ekonomika:**\n\n**Náklady na výsadbu**:\n- **Stromy** (sadenice): 100–500 Kč/strom\n- **Hustota**: 100–400 stromov/ha (radové výsadby)\n- **Ochrana** (chrániče proti zveri, plot): 50–200 Kč/strom\n- **Údržba** (polievanie prvé 3 roky, rez): 20–50 Kč/strom/rok\n- **Celkovo startup**: 30 000–100 000 Kč/ha\n- **Prevádzkové**: 1 000–3 000 Kč/ha/rok\n\n**Návratnosť**:\n- **Ovocie** od roku 5–7 (jabloň, hruška)\n- **Orechy** od roku 8–12 (orech)\n- **Drevo** od roku 30–60 (lesnícke dreviny)\n- **Carbon credits** ihneď (3–8 EUR/t CO₂)\n- **CAP dotácie** za stromy (viď ďalej)\n\n**EU CAP 2023–2027 a agrolesníctvo:**\n\n**1. Eko-režimy (EKO platba):**\n- **Stromy v poľnohospodárstve** = bonus +1 300 Kč/ha\n- **Podmienka**: min. 50 stromov/ha, registrácia\n\n**2. AEKO podopatrenie:**\n- **Trvalé krajinné prvky** (alej, vetrolam) — 50–80 Kč/m/rok\n- **Pastviny s stromami** — vyššia sadzba ANC\n\n**3. Intervencia 4.4** (Strategický plán SZP):\n- **Investičná podpora pre výsadbu** stromov na poľnohospodárskej pôde\n- **60–80 % nákladov** dotované\n- **Cieľ EU**: 3 mld nových stromov do 2030\n\n**SK právny rámec:**\n- **Vyhláška 314/2017** o stromoch v poľnohospodárstve\n- **LPIS** musí stromy registrovať\n- **GAEC 8** vyžaduje zachovanie krajinných prvkov\n\n**Implementačné bariéry:**\n1. **Dlhodobá investícia** — návratnosť 5–30 rokov\n2. **Prenajatá pôda** — nájomca nechce investovať do stromov\n3. **Zatienenie plodín** — pokles výnosov o 10–20 %\n4. **Údržba** — rez, ochrana, polievanie\n5. **Mechanizácia** — prekáža poľným strojom\n\n**Príklady úspešných fariem:**\n- **Wakelyns** (UK) — alley cropping pšenica + orech, 30+ rokov\n- **Stilo** (FR) — silvopasture dobytok + dub\n- **SK pilotné projekty** — Jihočeská univerzita, Mendelu Brno\n\n**Trend:**\n- **EU stratégia \"Farm to Fork\"** podporuje agroforestry\n- **Climate change adaptation** — stromy + plodiny = odolnosť\n- **Carbon credits** — rastúci trh pre agroforestry sekvestráciu\n\nViď tiež [[karbonove-zemedelstvi]], [[regenerativni-zemedelstvi]], [[eroze-pudy]], [[mez]], [[biopasy]], [[gaec]].",
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
    "term": "Hydroponie",
    "alias": [
      "hydroponics",
      "beztrhné pestovanie",
      "soilless growing"
    ],
    "kategorie": "precise-farming",
    "shortDef": "Hydroponie je pestovanie rastlín bez pôdy — v inertnom substráte (perlít, kokos, kamenná vlna) alebo priamo vo vode s živinami. Kľúčová pre skleníky (rajčatá, paprika, šalát) a vertikálne farmy. Spotreba vody -90 %, výnos +30 % vs pôdne pestovanie.",
    "longDef": "Hydroponie (grécky *hydro* + *ponos* = voda + práca) je **pestovanie rastlín bez pôdy** — korene v inertnom substráte (perlít, kokos, kamenná vlna) alebo priamo vo vode s rozpustenými živinami. Kľúčová technológia pre **skleníky, vertikálne farmy, mestské poľnohospodárstvo**.\n\n**Princíp:**\n- Rastlina získava **živiny z vodného roztoku** (= nutrient solution), nie z pôdy\n- Korene v inertnom substráte (štruktúra) alebo priamo vo vzduchu/vode\n- **Presné ovládanie** pH, EC (elektrická vodivosť), teploty, koncentrácií N/P/K\n- **Veľmi efektívne** využitie vody a živín\n\n**Hlavné systémy:**\n\n**1. NFT (Nutrient Film Technique):**\n- **Mäkký prúd** výživného roztoku cez korene v žlabe\n- **Plodiny**: šalát, bazalka, jahody\n- **Plusy**: jednoduchý, lacný\n- **Mínusy**: výpadok pumpy = rýchla smrť rastlín\n\n**2. DWC (Deep Water Culture):**\n- **Korene ponorené** vo vzdušnom roztoku\n- **Vzduchovače** dodávajú kyslík koreňom\n- **Plodiny**: šalát, kanabis (medicínsky), bylinky\n- **Plusy**: vysoký výnos, jednoduchý\n- **Mínusy**: výpadok vzduchu = korene anaeróbne za 4 h\n\n**3. Ebb & Flow (Flood & Drain):**\n- **Periodicky** zaplavovaný substrát\n- **Plodiny**: zelenina, ovocie, dekoratívne\n- **Plusy**: flexibilný, lacný\n- **Mínusy**: vyžaduje časovač kontrolu\n\n**4. Drip irrigation:**\n- **Kvapky výživy** na báze substrátu (kamenná vlna, kokos)\n- **Plodiny**: rajčatá, paprika, uhorky (skleníkové)\n- **Plusy**: presnosť, EÚ štandard\n- **Mínusy**: vyššie investície\n\n**5. Aeroponics:**\n- **Korene vo vzduchu** + sprej výživy\n- **Plodiny**: šalát, zemiaky (sadenice)\n- **Plusy**: najvyšší kyslík = najrýchlejší rast\n- **Mínusy**: vysoká investícia, technicky obtiažne\n\n**Substráty:**\n\n**1. Kamenná vlna (Rockwool):**\n- **EÚ skleníky štandard** pre rajčatá, papriku\n- **Cena**: 50–150 Kč/m³\n- **Recyklácia**: drahá, environmentálny problém\n\n**2. Kokosové vlákno:**\n- **Bio prístup** — alternatíva kamennej vlny\n- **Cena**: 80–200 Kč/m³\n- **Plus**: biologicky rozložiteľné\n\n**3. Perlít, vermikulit:**\n- **Ľahké** substráty pre pestovateľské boxy\n- **Cena**: 100–300 Kč/m³\n\n**4. Hydroton (expandovaný íl):**\n- **Pelietky** pre DWC, ebb & flow\n- **Cena**: 80–200 Kč/m³, opakovane použiteľný\n\n**5. Bezsubstrátové** (NFT, DWC, aero):\n- **Žiadny substrát** = najnižšie náklady\n- Vhodné len pre šalát, bylinky\n\n**Výživa — nutrient solution:**\n\n**Kľúčové prvky** (NPK + mikroprvky):\n- **N**: 100–250 mg/l (záleží na plodine)\n- **P**: 30–80 mg/l\n- **K**: 150–300 mg/l\n- **Ca**: 100–200 mg/l\n- **Mg**: 30–60 mg/l\n- **Mikroprvky**: Fe, Mn, Zn, Cu, B, Mo (v ppb)\n\n**pH**: 5,5–6,5 (optimálna absorpcia živín)\n**EC**: 1,5–3,0 mS/cm (záleží na plodine)\n**Teplota roztoku**: 18–22 °C\n\n**Komerčné hnojivá:**\n- **Hoagland solution** — klasický recept\n- **PPM (Plant Prod)** — komerčné zmesi\n- **Floraseries** (GHE) — kanabis-orientované\n- **Yara Krista** — profesionálne\n\n**Aplikácie:**\n\n**1. Skleníky rajčat:**\n- Holandsko = 8 000 ha (50 % EÚ produkcie v 1 krajine!)\n- **Výnos rajčat**: 60–80 kg/m²/rok (vs 4 kg/m² pôdne)\n- **Cena inštalácie skleníka**: 2 000–5 000 Kč/m²\n\n**2. Skleníky paprik, uhorky:**\n- Podobné rajčatám\n- SR producenti: BeJa, Frudoma, Magna Czech\n\n**3. Šalát a bylinky (NFT, DWC):**\n- **24 hodinový cyklus** — zber každý deň\n- **Plant factory** koncept\n- SR producenti: Salatika, Czech Microgreens\n\n**4. Jahody:**\n- **Hydroponické jahody** — celoročný zber\n- **Vysoký premium** (chuť, cena)\n\n**5. Kanabis (medicínsky):**\n- **EÚ rastúci trh** (DE, NL, SR pilotné programy)\n- **Hydroponie** = štandard pre indoor pestovanie\n\n**6. Šalátové micro-greens:**\n- **8–14 dní cyklus** — rýchly zber\n- **Premium retail** — chefs, fine dining\n\n**Výhody hydroponie:**\n\n1. **Voda**: -90 % spotreba (recirkulácia)\n2. **Živiny**: -50 % (presné dávkovanie)\n3. **Výnos**: +30 až +1 000 % vs pôdne (záleží na plodine)\n4. **Mikroorganizmus tlak**: nižší (sterilné prostredie)\n5. **Pesticídy**: -80 % (kontrolované prostredie)\n6. **Plocha**: 5–10× vyššia produkcia na m²\n7. **Sezonalita**: 24/7 produkcia\n8. **Kvalita**: konzistentná, premium\n\n**Nevýhody:**\n\n1. **Vysoká investícia** — startup 2 000–10 000 Kč/m²\n2. **Energetická náročnosť** (LED osvetlenie, vzduchovače)\n3. **Technicky komplexné** — vyžaduje znalosti chémie + biológie + IT\n4. **Závislosť na elektrine** — výpadok = strata\n5. **Nutrient management** — drahé profesionálne výživy\n6. **Nie je certifikované bio** (s výnimkou niektorých US štátov)\n\n**Ekonomika:**\n\n**Skleník rajčat 1 ha (10 000 m²):**\n- Investícia: 30–50 mil. Kč\n- Prevádzkové náklady: 5–10 mil. Kč/rok (energia, voda, výživa, práca)\n- Výnos: 700 t/ha × 35 Kč/kg = 24,5 mil. Kč/rok\n- Marža: 14,5 mil. Kč/rok\n- Návratnosť: 3–4 roky\n\n**Vertikálna farma šalátu (pozri [[vertikalni-farma]]):**\n- Investícia: 100 000–300 000 Kč/m² stavebnej plochy\n- Vyššia produkcia na m² ale drahšia investícia\n- Návratnosť: 5–10 rokov\n\n**SR producenti a trh:**\n- **Frudoma** (Olomouc) — rajčatá, paprika\n- **BeJa Group** — moderné skleníky\n- **Magna Czech** — sklenikárstvo\n- **Salatika** — šalát, micro-greens\n- **HempFlow** (Praha) — kanabis medicínsky\n\n**Trendy 2024:**\n- **LED technológia** — efektívnejšie, cenovo dostupné\n- **AI kontrolné systémy** — automatizácia pH, EC, klíma\n- **CRISPR plodiny** šité na mieru hydroponie\n- **Plant factories** — plne automatizované, 24/7\n\nPozri tiež [[vertikalni-farma]], [[precision-livestock-farming]], [[npk-hnojivo]], [[satelity-zemedelstvi]].",
    "related": [
      "vertikalni-farma",
      "npk-hnojivo"
    ]
  },
  {
    "slug": "vertikalni-farma",
    "term": "Vertikálna farma",
    "alias": [
      "vertical farm",
      "vertical farming",
      "plant factory"
    ],
    "kategorie": "precise-farming",
    "shortDef": "Vertikálna farma je viacposchodový systém pestovania plodín v kontrolovanom vnútornom prostredí (LED osvetlenie, hydroponie). Cieľ: produkcia v mestách, blízko spotrebiteľa, 365 dní/rok. Výnosy 50–100× vyššie na m² pôdy, ale energetická náročnosť vysoká.",
    "longDef": "Vertikálna farma (anglicky *vertical farming*, *plant factory*) je **viacposchodový systém pestovania plodín v kontrolovanom vnútornom prostredí** (CEA — Controlled Environment Agriculture). Kombinácia **hydroponie** (pozri [[hydroponie]]) + **LED osvetlenie** + **AI/IoT** kontrola + vertikálne stohovanie.\n\n**Princíp:**\n- **Viacposchodová štruktúra** (5–20+ poschodí)\n- **LED osvetlenie** nahrádza slnko (červené + modré spektrum)\n- **Hydroponie** nahrádza pôdu\n- **HVAC** (klimatizácia) kontroluje teplotu, vlhkosť, CO₂\n- **Úplne izolované** od vonkajšieho prostredia — žiadne pesticídy, choroby\n- **365 dní/rok** produkcia\n\n**História:**\n- **1999** — Dickson Despommier (Columbia University) popularizuje koncept\n- **2010** — prvé komerčné vertikálne farmy v Japonsku (Tokio)\n- **2015+** — investičný boom v USA, EÚ\n- **2022–2023** — niektoré veľké projekty (Plenty, AeroFarms, Infarm) **kolaps** kvôli vysokým nákladom\n- **2024** — konsolidácia trhu, fokus na ekonomicky funkčné modely\n\n**Hlavné plodiny:**\n\n**1. Šalát (90 % komerčných vertikálnych fariem):**\n- **Cyklus**: 21–35 dní z osiva\n- **Výnos**: 1 500–3 000 hláv/m² stavebnej plochy/rok\n- **Trh**: retail premium (Tesco, Whole Foods), reštaurácie\n\n**2. Micro-greens:**\n- **Cyklus**: 7–14 dní\n- **Premium**: 800–2 000 Kč/kg\n- **Trh**: fine dining, mixed sets\n\n**3. Bylinky (bazalka, koriander, mäta):**\n- **Cyklus**: 25–45 dní\n- **Vysoký premium**: 1 500–3 000 Kč/kg\n- **Trh**: retail + foodservice\n\n**4. Jahody:**\n- **Celoročná** produkcia\n- **Premium**: až 800 Kč/kg\n- **Trh**: prémiové retail\n\n**5. Listová zelenina** (kale, špenát, rukola):\n- Podobné šalátu\n- Rastúci trend pre fitness/health-conscious\n\n**6. Rajčatá, paprika** — zriedkavo (energeticky nákladné):\n- **Iba high-tech farmy**\n- Stúpajúce úsilie (Plenty, Bowery)\n\n**7. Kanabis (medicínsky):**\n- **EÚ rastúci trh** (regulačne obmedzený)\n- **Premium**: extrémne vysoký\n- **Energia**: ešte vyššia ako šalát\n\n**Kľúčové technológie:**\n\n**1. LED osvetlenie:**\n- **Červené svetlo** (660 nm) — fotosyntéza\n- **Modré svetlo** (450 nm) — vegetatívny rast\n- **Spectrum tuning** podľa plodiny + rastových fáz\n- **DLI** (Daily Light Integral): 10–25 mol/m²/deň\n- **Cena LED**: 5 000–15 000 Kč/m² pestovateľskej plochy\n- **Životnosť**: 50 000–80 000 h (5–10 rokov)\n\n**2. HVAC (klimatizácia):**\n- **Teplota**: 20–24 °C\n- **Vlhkosť**: 65–75 %\n- **CO₂ enrichment**: 800–1 200 ppm (vs 420 ppm normálna atmosféra)\n- **Spotreba energie**: 50 % celkovej farmy spotreby\n\n**3. Hydroponický systém:**\n- **NFT, DWC, aeroponics** (pozri [[hydroponie]])\n- **Automatická výživa** + monitoring pH + EC\n- **Recirkulácia vody** = 95 % úspora vs pôdne\n\n**4. Automatizácia:**\n- **Robotické sejenie, transplantácia, zber**\n- **AI vision** pre detekciu chorôb, rastových fáz\n- **Prediktívna kontrola** klímy a osvetlenia\n\n**5. Softvér a IoT:**\n- **Plant Hub, Source.AI** — monitoring rastlín\n- **Skylab Analytics** — optimalizácia výkonu\n- **Cloud platforms** pre multi-farm operations\n\n**Energetická náročnosť (kľúčový problém):**\n\n**Spotreba na kg produkcie:**\n- **Šalát**: 8–25 kWh/kg\n- **Bylinky**: 15–40 kWh/kg\n- **Rajčatá**: 60–100 kWh/kg (preto nevhodné!)\n- **Kanabis**: 1 000+ kWh/kg\n\n**Cena elektriny** = ~50–70 % nákladov farmy\n- Pri 4 Kč/kWh × 20 kWh/kg šalátu = **80 Kč/kg len energie**\n- Plus práca + materiály + amortizácia = celkové náklady 150–300 Kč/kg šalátu\n- Vs **polný šalát**: 30–60 Kč/kg náklady\n\n**Ekonomická realita:**\n\n**Vertikálna farma rentabilná len pre:**\n1. **Premium retail** (Whole Foods, Tesco F&F): 250–500 Kč/kg\n2. **Reštaurácie** (fine dining): 400–1 200 Kč/kg\n3. **Špeciálne produkty** (micro-greens, exotické bylinky): 800+ Kč/kg\n4. **B2B kontrakty** (sushi chefs, salad chains)\n\n**NE pre mass market** (bežný šalát v Lidli za 30 Kč/kg) — ekonomicky nemožné.\n\n**Kľúčové farmy (2024):**\n- **AeroFarms** (USA) — Newark, NJ. 6 000 m² farma, šalát\n- **Plenty** (USA) — financované SoftBank, problémy s rentabilitou\n- **Bowery Farming** (USA) — rajčatá, šalát\n- **Infarm** (DE) — modulárne farmy v supermarketoch, **kolaps 2023**\n- **Sky Greens** (Singapur) — prvá komerčná (2012)\n- **YesHealth iFarm** (Taiwan) — high-tech\n- **Spread** (Japonsko) — automatizácia top\n- **Crops in Pots** (Praha, SR) — pilotná\n\n**SR situácia:**\n- **Pilotné projekty** v Prahe, Brne\n- **Žiadna veľká komerčná farma** zatiaľ\n- **Trh: premium retail + reštaurácie** — limit ~100 t produkcie/rok pre celú SR\n- **Bariéry**: vysoká investícia (50–200 mil. Kč), lacná dovozová produkcia zo Španielska\n\n**Bariéry adopcie:**\n1. **Vysoká investícia**: 100–300 tis. Kč/m² stavebnej plochy\n2. **Energetická náročnosť** — drahá elektrina\n3. **Klimatická závislosť** — solar/wind potrebné pre zníženie uhlíkovej stopy\n4. **Ľudský kapitál** — vyžaduje IT + biologiu + engineering\n5. **Trh limit** — premium segment je malý\n\n**Výhody:**\n1. **Voda**: 90–95 % úspora\n2. **Pesticídy**: 0 (kontrolované prostredie)\n3. **Výnos/m²**: 50–100× vs polný\n4. **Sezonalita**: 365 dní\n5. **Lokálnosť**: žiadna doprava (mestské poľnohospodárstvo)\n6. **Konzistentná kvalita**\n\n**Trendy 2024+:**\n- **Konsolidácia** trhu (veľké projekty zkolabovali)\n- **Solar + battery integration** — zníženie elektrickej závislosti\n- **AI optimalizácia** — algoritmy na zníženie energie o 20–40 %\n- **GMO/CRISPR plodiny** vyšľachtené na mieru vertikálnemu farmingu (rýchly rast, nízke nároky na svetlo)\n- **Hybrid modely** — semi-vertical greenhouse (využitie slnečného svetla + LED supplement)\n\n**Etická diskusia:**\n- **Vertikálne farmy = budúcnosť** alebo **drahý gimmick**?\n- **Polné poľnohospodárstvo** stále najekonomickejšie pre väčšinu plodín\n- **Vertikálne farmy = niche** pre mestské premium\n\nPozri tiež [[hydroponie]], [[satelity-zemedelstvi]], [[precision-livestock-farming]], [[ai-zemedelstvi]].",
    "related": [
      "hydroponie",
      "satelity-zemedelstvi",
      "precision-livestock-farming"
    ]
  },
  {
    "slug": "agro-iot",
    "term": "IoT v poľnohospodárstve",
    "alias": [
      "Internet of Things",
      "agro-IoT",
      "smart farming sensors",
      "agricultural IoT"
    ],
    "kategorie": "precise-farming",
    "shortDef": "IoT (Internet of Things) v poľnohospodárstve je sieť prepojených senzorov, strojov a systémov zbierajúcich dáta v reálnom čase — vlhkosť pôdy, teplota, vodné zdroje, stav strojov, kŕmenie, kravy. Dáta idú do cloudu na AI analýzu a manažment rozhodnutí.",
    "longDef": "IoT (Internet of Things, „internet vecí\") v poľnohospodárstve je **sieť prepojených senzorov, strojov a systémov**, ktoré zbierajú dáta v reálnom čase, posielajú ich do cloudu na AI analýzu a poskytujú **manažment rozhodnutí**.\n\n**Kľúčové komponenty IoT systému:**\n\n**1. Senzory (zbieranie dát):**\n\n**Pôdne senzory:**\n- **Vlhosť pôdy** (TDR — Time Domain Reflectometry, kapacitné)\n- **Teplota pôdy** (viacero hĺbok: 10, 30, 60 cm)\n- **EC** (elektrická vodivosť — slanosť, živiny)\n- **pH pôdy** (priamo v poli)\n- **NPK senzory** (real-time meranie)\n- **Cena**: 2 000–20 000 Kč za senzor\n\n**Klimatické stanice:**\n- **Vzdušná teplota, vlhkosť, zrážky, vietor, slnečná radiácia**\n- **Doplnky**: tlak, evapotranspirácia, listová vlhkosť (= riziko chorôb)\n- **Trh**: Davis Instruments, Pessl Metos, Sencrop\n- **Cena**: 10 000–80 000 Kč\n\n**Plodinové senzory:**\n- **NDVI z dronu alebo satelitu** (pozri [[ndvi]], [[satelity-poľnohospodárstvo]])\n- **Kamerové systémy** (computer vision pre choroby)\n- **Sap flow sensors** (cievny prietok v rastline)\n\n**Zvieracie senzory (PLF):**\n- **Obojky** (akcelerometer, GPS) — pozri [[precision-livestock-farming]]\n- **Bolus senzory v bachore**\n- **In-line mliečne analyzátory**\n- **Kamery v stáji**\n\n**Strojové senzory:**\n- **GPS-RTK** v traktore, kombajnoch (pozri [[gps-rtk]])\n- **Telematika** — pozri [[telematika]]\n- **CAN bus dáta** — motor, hydraulika, palivo\n- **Yield monitor** — pozri [[yield-monitor]]\n\n**Vodné senzory:**\n- **Prítok** v sieťach zavlažovania\n- **Hladina** v jímkach, studniach\n- **Monitorovanie čerpadla**\n\n**2. Komunikačná vrstva (prenos dát):**\n\n**LoRaWAN** (Long Range WAN):\n- **Dosah**: 5–15 km na vidieku\n- **Spotreba**: extrémne nízka (batéria 5+ rokov)\n- **Vhodné**: pôdne senzory, vodné hospodárstvo\n- **Cena**: 200–500 Kč/senzor/rok\n\n**NB-IoT (Narrowband):**\n- **Mobilná sieť** (3G/4G/5G)\n- **Vyššia spotreba**, ale lepšie pokrytie\n- **Vhodné**: mobilné zvieratá, traktory\n\n**Wi-Fi:**\n- **Krátky dosah** (100 m), vyššia spotreba\n- **Vhodné**: stáje, sklady\n\n**5G**:\n- **Vysoká priepustnosť** + nízka latencia\n- **Vhodné**: autonómne stroje, drony, kamerová analýza\n\n**3. Cloud + Edge computing:**\n\n**Edge (lokálne):**\n- **Predspracovanie dát** na traktore, v stáji\n- **Zníženie dátového prenosu** do cloudu\n- **Rýchlejšia odozva** (real-time rozhodnutia)\n\n**Cloud:**\n- **AWS, Azure, Google Cloud** — platformy\n- **AWS Greengrass**, **Azure IoT Edge** — IoT-špecifické\n- **Cena**: 5 000–50 000 Kč/mesiac pre veľkú farmu\n\n**4. AI/ML analýza:**\n\n**Aplikácie:**\n- **Prediktívna údržba** strojov (zlyhanie motora)\n- **Predikcia chorôb** podľa počasia + stavu poľa\n- **Predpovedanie výnosu** z viacerých dátových zdrojov\n- **Detekcia anomálií** v správaní zvierat\n- **Optimalizácia** kŕmenia, postrekov, hnojenia\n\n**5. Vizualizácia + dashboardy:**\n\n- **Webové platformy**: Climate FieldView, OneSoil, eAgronom\n- **Mobilné aplikácie** pre farmárov\n- **Alarmy** (SMS, email, push notifikácie)\n\n**Hlavné aplikácie IoT v ag:**\n\n**1. Smart zavlažovanie:**\n- Senzory pôdnej vlhkosti + meteodata + AI = optimálny plán zavlažovania\n- **Úspora vody**: 30–50 %\n- **ROI**: 1–2 roky\n\n**2. Predikcia chorôb:**\n- Listová vlhkosť + teplota + zrážky → predikcia septoriózy, plesní\n- **Modely**: BlightCast, SmartGrain, FieldClimate\n- **Cielené postreky** namiesto paušálnych\n\n**3. Monitorovanie plodín:**\n- Dron + satelit + pôdne senzory = komplexné monitorovanie\n- **Variabilná aplikácia** hnojív, postrekov (pozri [[variabilná-aplikácia]])\n\n**4. Monitorovanie hospodárskych zvierat:**\n- Pozri [[precision-livestock-farming]]\n- Detekcia ruje, mastitídy, krívania\n\n**5. Monitorovanie skladovania:**\n- Teplota + vlhkosť v sile, v sklade obilnín\n- **Prevencia**: hniloba, plesne, plesňové toxíny\n\n**6. Automatizácia skleníkov:**\n- Teplota + vlhkosť + CO₂ + kontrola osvetlenia\n- **Úplne automatizované** pre skleníky rajčín, paprík\n\n**7. Správa flotily:**\n- GPS + CAN dáta všetkých strojov\n- **Optimalizácia** logistiky, sledovanie paliva, prevencia krádeží\n\n**8. Smart postrekovač:**\n- Sekčná kontrola (pozri [[section-control]]) + RTK GPS + senzory\n- Plné variabilné aplikácie pesticídov\n\n**Príklady IoT riešení v ČR:**\n\n**Mestská farma:**\n- **Climate FieldView** (Bayer) — top globálny\n- **OneSoil** — freemium pre malé farmy\n- **eAgronom** — domáce CZ riešenie\n- **AgroIT** (CZ startup) — IoT systémy pre CZ farmy\n- **Agrosoft** — ERP pre farmy\n\n**Veľkí hráči:**\n- **John Deere Operations Center** — integrovaný systém\n- **Bayer Climate FieldView** — globálna platforma\n- **CNH Industrial AGXTEND** — kombinácia strojov + dát\n\n**Ekonomika IoT pre typickú farmu (500 ha):**\n\n**Investície:**\n- 5 pôdnych staníc × 8 000 Kč = 40 000 Kč\n- 1 meteostanica × 50 000 Kč = 50 000 Kč\n- RTK kit do 2 traktorov × 80 000 Kč = 160 000 Kč\n- Yield monitor v kombajne = 100 000 Kč\n- Softvér ročne = 30 000 Kč\n- **Startup**: 350 000–400 000 Kč\n- **Ročne**: 50 000–100 000 Kč (softvér + údržba)\n\n**Benefity:**\n- Variabilná aplikácia N: -10–20 % spotreba = 500–1 000 Kč/ha × 500 ha = 250 000–500 000 Kč/rok\n- Lepší načasovanie postrekov: -30 % postrekových nákladov = 100 000–300 000 Kč/rok\n- Menej paliva (RTK = menej prekryvov): -5 % = 50 000–100 000 Kč/rok\n- Lepšie výnosy: +200 kg/ha pšenice = +650 000 Kč/rok pre 500 ha\n\n**ROI**: 1–3 roky pre typickú farmu\n\n**Bariéry:**\n1. **Investície** — vysoké pre malé farmy\n2. **Internetové pripojenie** — vidiek má problém\n3. **Komplexnosť** — vyžaduje IT znalosti\n4. **Integrácia dát** — rôzne platformy nesynchronizujú\n5. **Ochrana súkromia** — kto vlastní dáta farmy?\n\n**Štandardy a interoperabilita:**\n- **ISOBUS** (pozri [[isobus]]) — komunikácia traktor ↔ náradie\n- **ADAPT** (AgGateway) — štandard výmeny dát\n- **GDPR-like** debaty o vlastníctve farmárskych dát\n\n**Trendy 2024+:**\n- **5G adopcia** — rýchlejšie, nižšia latencia\n- **Edge AI** — viac inteligencie v teréne\n- **Open data platforms** — interoperabilita\n- **Overenie uhlíkových kreditov** — IoT dáta verifikujú sekvestráciu\n- **Blockchain sledovateľnosť** — potravinový reťazec od farmy po spotrebiteľa\n\nPozri tiež [[telematika]], [[precision-livestock-farming]], [[satelity-poľnohospodárstvo]], [[gps-rtk]], [[variabilná-aplikácia]], [[isobus]], [[yield-monitor]].",
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
    "term": "Uhlíkové kredity",
    "alias": [
      "uhlíkové kredity",
      "carbon credit",
      "C credits",
      "carbon farming credits"
    ],
    "kategorie": "precise-farming",
    "shortDef": "Uhlíkový kredit = certifikát potvrdzujúci 1 tonu CO₂ ekvivalentu sekvestrovanej alebo neuvoľnenej do atmosféry. Poľnohospodár produkuje kredity pomocou no-till, krycích plodín, biouhla a predáva ich korporáciám na plnenie klimatických cieľov. EÚ obnovuje regulačný rámec (CRCF 2024).",
    "longDef": "Uhlíkové kredity sú **certifikáty potvrdzujúce 1 tonu CO₂ ekvivalentu** (1 t CO₂e) sekvestrovanej (uloženej) alebo emisie neuvoľnenej do atmosféry. Kľúčový **finančný nástroj klimatickej politiky** — kombinuje boj proti klimatickej zmene s ekonomickými stimulmi.\n\n**Princip:**\n\n1. **Poľnohospodár** implementuje praktiky znižujúce emisie alebo sekvestrujúce C:\n   - **No-till** (pozri [[no-till]]) — žiadna oxidácia pôdneho C\n   - **Krycie plodiny** (pozri [[medzi-plodiny]]) — C v pôde\n   - **Hnojivá organické** namiesto minerálnych — menej N₂O emisií\n   - **Biouhel** (pozri [[biouhel]]) — stabilné C 500+ rokov\n   - **TTP konverzia** (pozri [[ttp]]) — lúky ukladajú 2–4× viac C než orná\n   - **Agrolesníctvo** (pozri [[agrolesnictvi]]) — stromy + poľnohospodárstvo\n\n2. **Certifikačná organizácia** overí sekvestráciu:\n   - Pôdne vzorky (pred + po)\n   - Modely (LCA, IPCC)\n   - Satelitné dáta (pozri [[satelity-poľnohospodárstvo]])\n\n3. **Vystavenie uhlíkových kreditov**: 1 kredit = 1 t CO₂e\n\n4. **Predaj kreditov**:\n   - **Dobrovoľný trh**: korporácie kupujú pre ESG, klimatické ciele\n   - **Povinný trh**: EÚ ETS, kalifornské CCA (zatiaľ bez poľnohospodárstva)\n\n5. **Korporácie** používajú kredity na klimatickú neutralitu\n\n**Cena uhlíkového kreditu:**\n\n**Dobrovoľný trh (2024):**\n- **Vysoká kvalita (overená dodatočnosť)**: 15–25 EUR/t CO₂\n- **Štandardná kvalita**: 5–15 EUR/t CO₂\n- **Junk kredity** (kontroverzné): 1–5 EUR/t CO₂\n\n**Povinný trh (EÚ ETS, 2024):**\n- **EÚ povolenie (EUA)**: 60–90 EUR/t CO₂\n- Poľnohospodárstvo zatiaľ **MIMO ETS** (EÚ plánuje zahrnutie ~2030)\n\n**Certifikačné štandardy:**\n\n**1. Verra VCS (Verified Carbon Standard):**\n- **Globálny #1**, ~75 % dobrovoľného trhu\n- Drahá certifikácia, ale uznávaná\n- Vlastné podštandardy: VM0042 (vylepšené poľnohospodárske hospodárenie), VM0017 (no-till)\n\n**2. Gold Standard:**\n- Dôraz na **sociálny dopad** + klimatický\n- Vyššia cena kreditov\n\n**3. American Carbon Registry (ACR):**\n- USA, krajinné projekty\n\n**4. Climate Action Reserve (CAR):**\n- USA, poľnohospodársky špecifické\n\n**5. CDM** (Clean Development Mechanism):\n- UN-riadený, post-Kyoto Protocol\n- Klesajúci trh (Paris Agreement nahradil)\n\n**EÚ-špecifické platformy:**\n\n**Climate Farmers (DE):**\n- EÚ agroles, platby za t CO₂e\n- ~20 EUR/t\n\n**Soil Capital (BE):**\n- Belgicko-francúzska, regeneratívne ag fokus\n- Ročné platby za ha podľa implementácie\n\n**Indigo Ag (USA + EÚ):**\n- Veľká agtech platforma\n- Program uhlíkov + agronomické služby\n\n**eAgronom (EE):**\n- Estónsky softvér pre CZ + EÚ farmy\n- Servis certifikácie uhlíkových kreditov\n\n**EÚ CRCF (Carbon Removals Certification Framework):**\n\n**Nariadenie 2024** — nový EÚ právny rámec pre uhlíkové kredity:\n- **Štandardizácia** výpočtov\n- **Trvalosť** požiadavky (uhlíkový kredit musí \"vydržať\" 100+ rokov pre sekvestráciu)\n- **Dodatočnosť** — kredit len ak by farma sekvestráciu NEDĚLALA bez neho\n- **MRV** (Monitoring, Reporting, Verification) — pravidelná verifikácia\n\n**Cieľ**: zvýšiť kvalitu kreditov, vyhnúť sa greenwashingu\n\n**Príklad ekonomiky pre CZ farmu (500 ha):**\n\n**Implementácia**:\n- Prechod z orby na no-till + krycie plodiny na celých 500 ha\n- Investície do techniky (strip-till stroj): 1,5 mil. Kč\n- Ročné zvýšené náklady (osivo krycích plodín, postrek): +100 000 Kč/rok\n\n**Sekvestrácia** (typicky):\n- 0,5 t C/ha/rok = 1,83 t CO₂e/ha/rok\n- 500 ha × 1,83 = **916 t CO₂e/rok**\n\n**Príjem z kreditov**:\n- 916 t × 20 EUR/t = **18 320 EUR/rok = ~460 000 Kč/rok**\n\n**Plus benefity**:\n- Zníženie nákladov na palivo (menej orby): 200 000 Kč/rok\n- Zníženie nákladov na hnojivá (lepšia pôda): 100 000 Kč/rok\n\n**Čistý prínos**: ~660 000 Kč/rok (po odpočítaní vyšších nákladov)\n**Návratnosť techniky**: 2–3 roky\n\n**Problémy a kritika:**\n\n**1. Dodatočnosť:**\n- Kredit je platný len ak farma sekvestráciu by NEDĚLALA bez neho\n- Sporné — veľké farmy sa prechodu na regeneratívne ag robili aj bez kreditov\n- Riziko **greenwashingu**\n\n**2. Trvalosť:**\n- Ak farma za 10 rokov znovu zorá → uhlík sa vráti do atmosféry\n- Uhlíkový kredit by mal byť zrušený\n- Vyžaduje dlhodobé zmluvné záväzky\n\n**3. Verifikácia:**\n- Meranie C v pôde je drahé, často nepresné\n- Modely vs reálne meranie\n- Riziko **over-creditingu**\n\n**4. Únik:**\n- Ak farma A sekvestruje, ale farma B vedľa ju nahradí intenzívnejšou praxou → net dopad = 0\n- Globálny únik problém\n\n**5. Otázka spravodlivosti:**\n- Veľké korporátne farmy majú lepší prístup k certifikácii než malé rodinné\n- Riziko **uhlíkového kolonializmu** (bohaté farmy predávajú kredity na podporu vyšších emisií inde)\n\n**6. Cena volatility:**\n- Dobrovoľný trh: cena sa hýbe 10× v rozsahu 5 rokov\n- Riziko pre farmárov dlhodobo plánovať\n\n**Renaissance carbon farming:**\n\n**Dôvody rastu trhu:**\n1. **Paris Agreement** — globálne klimatické ciele\n2. **EÚ CRCF** — regulačná jasnosť\n3. **ESG reporting** — povinnosť korporácií reportovať uhlíkovú stopu\n4. **Net Zero pledges** — Microsoft, Apple, Google, Amazon kupujú kredity\n5. **Uhlíková hranica daň** (CBAM) — EÚ bude penalizovať dovoz s vysokou CO₂\n\n**Predikcia trhu:**\n- **2024**: 2–3 mld USD dobrovoľný uhlíkový trh\n- **2030**: 50–100 mld USD predikcia (McKinsey, BCG)\n- **Poľnohospodárstvo** = 20–30 % očakávaného trhu\n\n**Ako začať na CZ farme:**\n\n1. **Zistiť baseline**: súčasný stav organickej hmoty, pôdny C\n2. **Plánovať zmeny**: no-till, krycie plodiny, redukcia N hnojív\n3. **Nájsť platformu**: Climate Farmers, eAgronom, Soil Capital\n4. **Smluvit verifikáciu**: pôdne vzorky, satelitné monitorovanie\n5. **Implementovať 1+ rok**, potom žiadať kredity\n6. **Predať kredity** cez platformu\n\n**Náklady na zapojenie**:\n- Pôdne vzorky: 5 000–15 000 Kč/farma\n- Konzultácie: 20 000–50 000 Kč\n- Softvér/platform fee: 10–20 % z kreditov\n\n**Čistý príjem**: typicky 60–80 % z hrubého výnosu kreditov\n\nPozri tiež [[karbonové-poľnohospodárstvo]], [[regeneratívne-poľnohospodárstvo]], [[no-till]], [[medzi-plodiny]], [[biouhel]], [[ttp]], [[agrolesnictvi]], [[satelity-poľnohospodárstvo]].",
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
    "term": "Matka (včelia)",
    "alias": [
      "kráľovná",
      "včelia matka"
    ],
    "kategorie": "vcelarstvi",
    "shortDef": "Matka je jediná pohlavne vyvinutá samica vo včelstve, ktorej hlavnou funkciou je kladenie vajíčok a udržiavanie súdržnosti roja prostredníctvom feromónov.",
    "longDef": "Matka sa vyvíja z oplodneného vajíčka v matečníku a prechádza celým vývojom za približne 16 dní (vajíčko 3 dni, larva 5,5 dňa, kukla 7,5 dňa). Od robotníc sa líši výrazne predĺženým zadočkom, rudimentálnymi zásobníkmi peľu a väčšou telesnou hmotnosťou — pohybuje sa v rozmedzí 180–300 mg.\n\nPo snubnom prelete, pri ktorom sa pári spravidla s 10–20 trúbmi na snubnej dráhe, ukladá semeno do semenného váčku (spermatheca). Táto semenná zásoba jej vystačí na 3–5 rokov intenzívneho kladenia. Plodná matka kladie v sezóne 1 500–2 500 vajíčok denne, výnimočne až 3 000.\n\nV zdravom včelstve je vždy len jedna matka. Feromónový komplex produkovaný matkou (tzv. matečia látka, kyselina 9-oxo-decenová) potláča u robotníc vývoj vaječníkov a inhibuje stavbu matečníkov. Oslabenie tohto signálu vedie k stavu tichej výmeny alebo rojeniu.\n\nVčelár sleduje vek a znáškovú zdatnosť matky. Staré alebo vadné matky spôsobujú chradnutie včelstva a sú spravidla vymieňané každé 2–3 roky. Matku možno zakúpiť od šľachtiteľov v tzv. zásielkovej klietke.",
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
    "term": "Pracovní včela",
    "alias": [
      "včela pracovníčka"
    ],
    "kategorie": "vcelarstvi",
    "shortDef": "Pracovní včely sú pohlavne nevyvinuté samice, ktoré tvoria drvivú väčšinu včelstva a zabezpečujú všetku prácu v úli aj na pastve.",
    "longDef": "Pracovné včely sa vyvíjajú z oplodneného vajíčka za približne 21 dní (vajíčko 3 dni, larva 6 dní, kukla 12 dní). Hmotnosť dospelej pracovnej včely sa pohybuje okolo 90–120 mg. V sezóne tvoria včelstvo 40 000–80 000 pracovných včiel, v zime ich počet klesá na 10 000–20 000.\n\nŽivotná dĺžka letnej pracovnej včely je 4–6 týždňov, zimná pracovná včela žije 4–6 mesiacov. Práca sa mení s vekom — mladé pracovné včely (1–10 dní) ošetrujú plod a kŕmia matku, v strednom veku (10–20 dní) sa venujú prijímaniu nektáru, stavbe plástu, strážnej službe, staršie pracovné včely (od 21 dní) lietajú a zbierajú nektár, peľ, živicu a vodu.\n\nPracovné včely majú špecializované orgány: košíčky na zadných nohách na transport peľu, voskové žlázky na zadočku na produkciu vosku a jedový mechúr s bodcom (zubatý bodec, ktorý po vpichnutí zostáva v koži cicavca). Na rozdiel od matky majú plne vyvinutý cueillopharyngeálny žľazový systém na tvorbu materskej kašičky.\n\nPracovné včely bez matky môžu po 3–4 týždňoch začať klásť neoplodnené vajíčka — vznikajú tzv. trubčice alebo včelstvo s policajnou šľachtou (stratené včelstvo).",
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
    "term": "Trubec",
    "alias": [
      "trubci"
    ],
    "kategorie": "vcelarstvi",
    "shortDef": "Trubec je samec včely medonosnej, ktorého jedinou biologickou funkciou je oplodnenie matky pri snubnom proletu.",
    "longDef": "Trubec sa vyvíja z neoplodneného vajíčka partenogenézou za približne 24 dní. Hmotnosť dospelého trubca dosahuje 200–250 mg. Trubci nemajú bodec ani košíčky na peľ — nemôžu sa živiť sami a sú úplne závislí na zásobách včelstva.\n\nV sezóne (apríl–august) tvoria trubci 200–1 500 kusov v jednom včelstve. Opúšťajú úľ v teplých slnečných dňoch a lietajú na shromaždište trubcov (tzv. trubcovné miesta), kde čakajú na matku. Trubec, ktorý sa spári s matkou, bezprostredne po kopulácii uhynie.\n\nNa konci sezóny, zvyčajne v auguste a septembri, robotnice trubca vyháňajú z úľa (tzv. trubcový záhon) — tým znižujú spotrebu zásob na zimu. Výskyt trubcov mimo normálnu dobu (mimo sezóny alebo v nadmernom počte) môže signalizovať stratu matky alebo prítomnosť bezmatečného stavu.\n\nVo šľachtiteľskej praxi sa sledujú kvality trubcov z výberových línií — trubci prenášajú genetický materiál, a to na snubnej dráhe úplne nekontrolovane (otvorená párovacia lokalita). Kontrolované oplodnenie na izolovanom stanovišti (oplodnáčik) je preto kľúčovým nástrojom selekcie.",
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
    "term": "Včelstvo",
    "alias": [
      "roj",
      "rojina"
    ],
    "kategorie": "vcelarstvi",
    "shortDef": "Včelstvo je biologická jednotka tvorená matkou, pracovnými včelami a trubcami, ktorá funguje ako superorganizmus so spoločným dýchaním, termoreguláciou a kolektívnou obranou.",
    "longDef": "Včelstvo sa skladá z jedinej matky, sezónne 40 000–80 000 pracovných včiel a niekoľkých stoviek až tisícov trubcov. Ako celok udržuje vnútornú teplotu plodového hniezda na 34–35 °C bez ohľadu na vonkajšie podmienky — pracovné včely generujú teplo svalovou kontrakciou, v lete naopak chladia odparovaním vody. Táto termoregulácia je zásadná pre správny vývoj plodu.\n\nKomunikácia vo včelstve prebieha feromon-chemickými signálmi (materská látka, nožný feromon, výstražný feromon kyselina isopentylacetátová pri obrane) aj pohybovými signálmi — tanzí. Strata matky vedie k feromonovému deficitu, ktorý pracovné včely detekujú počas hodín a začínajú stavať záchranné matečníky.\n\nZdravotný stav včelstva je základným ukazovateľom pre včelára. Sleduje sa množstvo a charakter plodu (zavíčkovaný vs. otvorený, rozmiestnenie), správanie na česne, množstvo zimných zásob a prítomnosť parazitov (najmä roztoč Varroa destructor). Prehliadka úľa sa vykonáva zvyčajne raz za 7–10 dní v sezóne.\n\nSilné včelstvo o 60 000–80 000 pracovných včelách je predpokladom ekonomicky zaujímavého medonosného výnosu. Podľa údajov Českého zväzu chovateľov hospodárskych zvierat (ČSCHZ) činil priemerný výnos medu v ČR v roku 2023 približne 19 kg na jedno včelstvo.",
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
    "term": "Plást",
    "alias": [
      "plástek",
      "včelí plást"
    ],
    "kategorie": "vcelarstvi",
    "shortDef": "Plást je sústava šesťbokých voskových buniek, ktoré včely stavajú ako zásobník pre med, pyl i ako líheň pre plod.",
    "longDef": "Plást tvorí robotnice vylučovaním voskových šupiniek zo štyroch párov voskových žliaz na zadočku. Jedna robotnica vyprodukuje za svoj život 1–2 g vosku; stavba 1 kg plástu vyžaduje spotrebu asi 6–8 kg medu. Stavba plástu prebieha intenzívne pri dostatku nektáru a teplom počasí.\n\nŠesťhranné bunky majú geometricky optimálny tvar — maximalizujú objem pri minimálnej spotrebe materiálu. Priemer buniek pre robotnícky plod činí približne 5,2–5,4 mm, pre trubčí plod 6,2–6,9 mm. Orientácia plástov v modernom rámkovom úli je na kolmé rámky (Langstrothova orientácia) alebo vodorovné pásmo (Dadant).\n\nV plodišti sú bunky využívané pre kladenie vajíčok a výchovu lariev. V medníku sú bunky naplnené zrelým medom a zaplombované voskovým viečkom. Pyl (tzv. chlieb včelí) sa ukladá do buniek priliehajúcich k plodisku a lisuje sa vrstvami rôznofarebného pylu.\n\nStarý plást (tmavý, zanesený zbytkami svlečiek lariev) zhoršuje zdravotné podmienky a zvyšuje riziko ochorení. Včelári preto vykonávajú každoročnú alebo dvojročnú obmenu časti plástov, najmä v plodišti. Vyrazené plásty sa taví a vosk sa predáva alebo vracia k výrobe mezistien.",
    "related": [
      "vcelivosk",
      "vceli-plod",
      "mezistena-pojem",
      "vcelarsky-ramek"
    ]
  },
  {
    "slug": "vceli-dilo",
    "term": "Včelí dielo",
    "alias": [
      "dielo",
      "plásty"
    ],
    "kategorie": "vcelarstvi",
    "shortDef": "Včelí dielo je súhrn všetkých plástov v úli, ktoré tvoria životný priestor včelstva — zahŕňa plodové i medné zóny.",
    "longDef": "Pojmom včelí dielo sa rozumie úhrn všetkých plástov (jak plodových, tak medných) umiestnených na rámcoch v nástavkovom alebo plodišťovom priestore úlu. Kvalita diela je jedným z hlavných ukazovateľov stavu včelstva pri jarnej prehliadke.\n\nZdravé dielo je kompaktné, plodové pásmo je sústredené (tzv. uzavreté plodové hniezdo), med a pyl sú rovnomerne rozložené po okraji a v hornej časti plástu. Prerušovaný alebo rozptýlený plod signalizuje chorobu (mor plodu, hniloba), problémy s matkou alebo zákerne vonkajšie podmienky.\n\nStaré čierne plásty sa v plodišti nahrádzajú každé 1–2 roky; v medníku sa plásty udržiavajú dlhšie, pretože neobsahujú svlečky lariev. Pravidelná obnova diela znižuje chemickú záťaž (reziduá akaricídov sa akumulujú vo vosku) a zlepšuje hygienu hniezda.\n\nVčelár eviduje počet obsadených plástov ako ukazovateľ sily včelstva — silné zimujúce včelstvo obsadí 8–10 rámkov v Langstrothovom úli. Pojem \"plást chlieb\" označuje plást plný pylu (zásoby bielkovín pre jarný rozvoj).",
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
    "term": "Včelársky rámek",
    "alias": [
      "rámek",
      "rámek úlový"
    ],
    "kategorie": "vcelarstvi",
    "shortDef": "Včelársky rámek je drevený alebo plastový nosný prvok, na ktorom včely stavajú plást — jeho rozmery určujú typ úlu a umožňujú výmenu plástov bez poškodenia diela.",
    "longDef": "Rámek sa skladá z hornej a dolnej lišty a dvoch postranných lišt. Štandardizované rozmery zabezpečujú vzájomnú zameniteľnosť medzi úlmi rovnakého systému. Najrozšírenejšie rozmery na Slovensku sú rámek Langstroth (448 × 232 mm) a rámek Česko-Slovenský (39 × 24 cm), ďalej Dadant, Zander alebo rámky pre medníkové nástavky (medníkový rámek je približne polovičnej výšky plodištního).\n\nNový rámek je opatrený drôtom (3–4 rady oceľového alebo nerezového drôtu), na ktorý sa upevňuje mezistena — voskový základ pre výstavbu plástu. Alternatívne sa používajú rámky s plastovou základňou.\n\nMedzi susednými rámkami je zachovávaný tzv. včelí priestor (bee space) 6–9 mm — tento rozmer popísal ako kľúčový americký včelár Lorenzo Langstroth v roku 1851. Menšia medzera by sa zaplnila propolisom, väčšia stavbou divokých plástov.\n\nSprávna manipulácia s rámkami (zdvíhanie za bočnice, nie za hornú lištu samotnú) zabraňuje pretrhnutiu plástov. Na predajný trh sú dodávané rámky hotové alebo v sadách na zostavenie.",
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
    "term": "Nástavok",
    "alias": [
      "nástavkový úľ",
      "medníkový nástavek"
    ],
    "kategorie": "vcelarstvi",
    "shortDef": "Nástavok je samostatná časť nástavkového úľa (zvyčajne medník), ktorá sa pridáva na plodišťový nástavek, aby včelám poskytla priestor na ukladanie medu.",
    "longDef": "Nástavkový systém (najčastejšie Langstroth, Dadant alebo Zander) umožňuje ľahko rozširovať objem úľa pridávaním normalizovaných boxov — nástavkov. Plodište (najspodnejší nástavek) slúži na výchovu plodu a zimovanie, medník (horný nástavek) je určený na ukladanie mednej zásoby. Obe časti sú oddelené materskou mriežkou, ktorá zabráni matke klásť do medníka.\n\nKaždý nástavek pojme 8 alebo 10 štandardných rámikov. V sezóne s dobrou snúškou je možné včelstvo rozširovať pridávaním ďalšieho medníkového nástavku — tzv. šuplíkový systém. Príliš skoré pridanie medníka spomalí rozvoj plodu; príliš neskoré spôsobí prekotné rojenie kvôli nedostatku priestoru.\n\nNa zimovanie sa medníky odoberajú; zimujúce včelstvo sa sústreďuje na 1–2 plodištných nástavkoch s dostatkom zimných zásob (12–15 kg cukrového roztoku alebo medu).\n\nNástavky sa vyrábajú zo dreva (smrek, topoľ) alebo z polystyrénu. Polystyrénové úle majú lepšiu tepelnú izoláciu, sú ľahšie, ale mechanicky menej odolné.",
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
    "term": "Plodisko",
    "alias": [
      "plodisko",
      "plodový priestor"
    ],
    "kategorie": "vcelarstvi",
    "shortDef": "Plodisko je spodná časť úľa, kde matka kladie vajíčka, vyvíja sa plod a kde včelstvo zimuje.",
    "longDef": "Plodisko tvorí jadro biologického života včelstva. Matka tu kladie vajíčka do voskových buniek, robotnice ošetrujú larvy a kukly a udržiavajú teplotu plodového hniezda na 34–35 °C. Správny tvar plodového hniezda je guľovitý alebo elipsoidný — plod je sústredený v strede, zásoby medu a peľu obklopujú hniezdo zo strán a zhora.\n\nV moderných nadstavkových úľoch tvorí plodisko spravidla jeden alebo dva nadstavkové boxy. V tradičnom jednodielnom úli (Česko-Slovenský, Simplex) sú plodisko a medník v jednom priestore, oddelenie sa vykonáva len materskou mriežkou.\n\nVeľkosť plodiska ovplyvňuje silu včelstva a prezimovanie. Príliš veľké plodisko vedie k plytvaniu energiou na vyhrievanie; príliš malé obmedzuje rozvoj a môže vyvolať rojenie. Pre silné včelstvo sa odporúča plodisko s kapacitou 10 plodiskových rámikov Langstroth.\n\nNa jar sa plodisko kontroluje ako prvé — po zime by malo byť osadené 5–7 plástmi s živým plodom a dostatkom peľu. Plodisko bez plodu (mimo zimný alebo rojový stav) signalizuje bezmatečnosť.",
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
    "term": "Medník",
    "alias": [
      "medníkový nadstavec"
    ],
    "kategorie": "vcelarstvi",
    "shortDef": "Medník je horná časť úľa oddelená materskou mriežkou, kam robotnice ukladajú prebytočný med určený na zber.",
    "longDef": "Medník sa umiestňuje nad plodiskový nadstavec a od plodiska ho oddeľuje materská mriežka. Robotnice ním prechádzajú voľne, matka (kvôli väčšej šírke zadočka) nie — tým je zaručené, že medník obsahuje čistý med bez plodu.\n\nV priebehu hlavnej znášky (najmä lipová a repková) sa medník plní rýchlo — silné včelstvo môže zaplniť medníkový nadstavec o 10 rámikoch za menej než 2 týždne. Pri veľmi silnej znáške sa pridáva druhý alebo tretí medník (tzv. zaplnenie medníkov).\n\nVytáčanie medu z medníka sa vykonáva najčastejšie dvakrát v sezóne — po repkovej (jún) a po lipovo-letnej znáške (august). Pred vytáčaním sa plásty zbavujú viečok pomocou odkrývacích nástrojov (odkrývacia vidlička, nôž alebo para).\n\nMedník sa na zimu odoberá a skladuje na suchom mieste — vlhkosť by spôsobila plesne a znehodnotenie zvyškov medu. Na jeseň sa medníkové plásty môžu dočasne vrátiť k dočisťovaniu zvyškov medu.",
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
    "term": "Materská mriežka",
    "alias": [
      "matečná mriežka",
      "excluder"
    ],
    "kategorie": "vcelarstvi",
    "shortDef": "Materská mriežka je perforovaná doska s otvormi (4,1–4,4 mm), ktorými prejdú robotnice, ale nie matka, a zabraňuje tak matke klásť v medníku.",
    "longDef": "Materská mriežka sa vkladá medzi plodisko a medník. Priechodky sú dimenzované na priemer robotnice (cca 4,5 mm), ale matka (cca 5,5–6 mm šírky zadočka) nimi neprejde. Trúdy spravidla tiež neprejdú, alebo len s ťažkosťami.\n\nVyrába sa v kovovej (nerez, pozinkovaný plech) alebo plastovej variante. Kovové mriežky majú dlhšiu životnosť, plastové sú lacnejšie. Kľúčovým parametrom je presnosť rozmerov — príliš veľké otvory matku nezadržia, príliš malé bránia priechodu robotníc a znižujú mednú výnosnosť.\n\nNiektorí včelári materskú mriežku nepoužívajú (tzv. bezrámové alebo prirodzené metódy), pretože znižuje pohyb robotníc a môže mierne obmedzovať prínos nektáru. V konvenčnom hospodárení je ale mriežka štandardným vybavením pre dosiahnutie čistého, plodu prostého medu.\n\nMaterskú mriežku je potrebné pravidelne čistiť od propolisu, ktorým robotnice upchávajú otvory.",
    "related": [
      "nastavek",
      "mednik",
      "plodiste",
      "matka"
    ]
  },
  {
    "slug": "materi-kasicka",
    "term": "Materská kašička",
    "alias": [
      "royal jelly",
      "materská kašička"
    ],
    "kategorie": "vcelarstvi",
    "shortDef": "Materská kašička je bielkovinový sekrét vylučovaný čeľustnými a hltanovými žľazami robotníc, ktorým je kŕmená matka po celý život a robotnícke larvy iba v prvých troch dňoch.",
    "longDef": "Materská kašička je výživná látka bielej až slabo nažltlej farby s charakteristicky kyslou chuťou. Obsahuje približne 60–70 % vody, 12–15 % bielkovín (najmä MRJP — major royal jelly proteins, hlavné bielkoviny materskej kašičky, z ktorých kľúčový je MRJP1 nazývaný royalactin), 5–6 % cukrov, 3–6 % lipidov a rôzne vitamíny skupiny B.\n\nRozhodujúcu úlohu hrá materská kašička v determinácii kasty — rovnaká genetická informácia v oplodnenom vajíčku vedie pri kŕmení výhradne materskou kašičkou k vzniku matky, pri kŕmení peľom a medom k vzniku robotnice. Látka 10-HDA (kyselina trans-2-decenová) je považovaná za kľúčový faktor diferenciácie.\n\nProdukcia materskej kašičky je základ pre chov matiek — špeciálne larválne misky (tzv. misky, čínske alebo Nicotove misky) prijímajú 1–2-dňové larvy, ktoré sú zasadené do matečníkov, kde robotnice kašičku ukladajú. Moderná produkcia materskej kašičky dosahuje 300–500 g z jedného silného včelstva za sezónu (intenzívne metódy).\n\nNa trhu sa materská kašička predáva ako potravinový doplnok, v kozmetike a v lekárnickej praxi. Cena čerstvej materskej kašičky sa na českom trhu pohybuje v rozmedzí 3 000–7 000 Kč za kilogram.",
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
      "živicový tmel",
      "včelí tmel"
    ],
    "kategorie": "vcelarstvi",
    "shortDef": "Propolis je živicová hmota, ktorú včely zbierajú z púčikov a kôry stromov, miešajú s voskom a enzýmami a používajú na utesnenie a dezinfekciu úľa.",
    "longDef": "Propolis (z gréc. pro-polis, „pred mestom\") zbierajú robotnice najmä z živicových púčikov topoľov, briez, gaštanov a ihličnanov. Zberný košíček na zadnej nohe ho dopraví do úľa, kde ho preberajú staviteľky a spracovávajú pridávaním slín a enzýmov.\n\nZloženie propolisu závisí od botanického okolia stanovišťa — typicky obsahuje 50–55 % živíc a balzamov, 25–35 % voskov, 10 % silíc, 5 % peľu a rôzne fenolické a flavonoidné zlúčeniny. Chemická variabilita je preto značná.\n\nVčely propolisom zalepujú škáry v úli, zmenšujú česno v zime, mumifikujú mŕtve larvy alebo vniknutých votrelcov (myš), ktoré nemôžu vyniesť. Propolis tak funguje ako prirodzená dezinfekcia — má preukázané antibakteriálne, antifungálne a antivírusové účinky.\n\nVo včelárstve sa propolis zbiera špeciálnymi mriežkami umiestnenými pod vekom úľa. Ročný výnos z jedného úľa je 50–150 g. Na trhu nachádza uplatnenie v potravinových doplnkoch, tinktúrach a kozmetike; cena surového propolisu sa pohybuje okolo 300–600 Kč za 100 g.",
    "related": [
      "vcelstvo",
      "ul-pojem",
      "vceli-dilo"
    ]
  },
  {
    "slug": "vcelivosk",
    "term": "Včelí vosk",
    "alias": [
      "vosk",
      "beeswax"
    ],
    "kategorie": "vcelarstvi",
    "shortDef": "Včelí vosk je tuhý lipidický sekrét produkovaný voskovými žľazkami robotníc, z ktorého včely stavajú plásty a ktorý sa v priemysle využíva v kozmetike, farmácii a na výrobu medzistien.",
    "longDef": "Včelí vosk vylučujú robotnice vo veku 12–18 dní zo štyroch párov voskových žliaz na ventrálnom povrchu zadočka. Šupinky vosku (0,8 mg každá) spracovávajú robotnice čeľusťami a formujú do základného stavebného materiálu plástu.\n\nChemicky ide o komplexnú zmes esterov mastných kyselín a alkoholov s dlhými reťazcami, uhľovodíkov, kyselín a alkoholov. Teplota tavenia kolíše medzi 62–65 °C, bod tuhnutia je o 1–2 °C nižší. Vosk je nerozpustný vo vode, rozpustný v organických rozpúšťadlách (toluen, benzín).\n\nVýťažnosť vosku zo starých plástov pri pretavovaní v solárnom alebo parnom taviči dosahuje 60–80 % pôvodnej hmoty plástu. Z jedného úľa možno ročne získať 0,2–1 kg vosku (závisí od obmeny plástov). Vosk sa predáva na spracovanie na medzistieny, sviečky, kozmetiku a farmaceutické prípravky.\n\nRezíduá pesticídov a akaricídov (najmä fluvalinát, kumafos) sa vo vosku akumulujú — to je jeden z hlavných argumentov pre pravidelnú obmenu plástov. Nová medzistena zo starej praxe môže obsahovať znečistený vosk a byť vstupným zdrojom chemickej záťaže.",
    "related": [
      "plast",
      "mezistena-pojem",
      "delnice",
      "vceli-dilo"
    ]
  },
  {
    "slug": "pyl-rousky",
    "term": "Pyl (rouška)",
    "alias": [
      "pyl",
      "pyl chlieb",
      "chlieb včelí"
    ],
    "kategorie": "vcelarstvi",
    "shortDef": "Pyl zbierajú robotnice na okvetných prašníkoch, zmiešavajú ho so slinami a nektárom, formujú do rousiek a transportujú v pylovom košíčku ako hlavný bielkovinový zdroj včelstva.",
    "longDef": "Zber pylu prebieha pri lete na kvitnúce rastliny — robotnice ho aktívne zbierajú kartáčikmi na nohách, zvlhčujú nektárom alebo medom a formujú kompaktné rousky v košíčkoch (corbicula) na zadných nohách. Farba rousiek závisí na botanickom pôvode — žltá (repka), oranžová (mak, lipa), cihlová (gaštany), biela (akát).\n\nDenný príjem pylu do silného včelstva dosahuje 20–50 g; celoročná potreba jedného včelstva je odhadovaná na 15–20 kg. Pyl je nenahraditeľný bielkovinový zdroj pre výchovu plodu a produkciu materskej kašičky — nedostatok pylu na jar alebo na jeseň oslabuje vývoj zimnej generácie robotníc.\n\nVčelár môže pyl odoberať pylovými lapačmi umiestnenými na česne. Rousky prejdú mriežkou, ktorá ich oddelí od trupu včely. Pyl sa ihneď suší pri teplote do 40 °C a skladuje v uzavretých nádobách alebo mrazí. Predáva sa ako potravinový doplnok (cena 200–600 Kč/100 g).\n\nPylová analýza (melisopalinológia) umožňuje určiť geografický pôvod a botanické zloženie medu i propolisu.",
    "related": [
      "snuska",
      "delnice",
      "plast",
      "vceli-plod"
    ]
  },
  {
    "slug": "snuska",
    "term": "Snúška",
    "alias": [
      "medná snúška",
      "hlavná snúška",
      "vedľajšia snúška"
    ],
    "kategorie": "vcelarstvi",
    "shortDef": "Snúška je obdobie, kedy je v prírode dostatok nektaru alebo medovice a včely ho aktívne zbierajú a spracovávajú na med.",
    "longDef": "Termín snúška označuje ako samotný zdroj (kvitnúcu rastlinu alebo výlučky vošiek), tak obdobie intenzívneho zberu. V podmienkach strednej Európy sa rozlišuje snúška jarná (slivoň, jabloň, repka — apríl–jún), letná (lipa, ďatelina, malina — jún–júl) a jesenná doplnková (pohánka, slnečnica, vres — august–september).\n\nIntenzitu snúšky meria váhový úlový kontrolný úľ — priemyselná presnosť váh (100 g alebo menej) umožňuje zaznamenávať denný prírastok hmotnosti. Hodnoty nad 2 kg/deň signalizujú silnú snúšku, nad 5 kg/deň výnimočnú. Repková snúška môže v optimálnych podmienkach (veľký repkový lán, teplé slnečné dni) priniesť 30–60 kg medu na jedno silné včelstvo.\n\nMedovicová snúška (z výlučkov vošiek alebo červcov na listnatých alebo ihličnatých stromoch) je charakteristická pre horské oblasti, Šumavu, Jeseníky a podhorskú časť Moravy. Medovicový med má tmavšiu farbu, silnejšiu chuť a nižší obsah sacharózy než kvetový med.\n\nSprávne načasovanie kočovania k zdrojom snúšky je základom rentabilného včelárstva. Pri snúške repky je potrebné priblížiť úly 2–3 dni pred plným rozkvetom.",
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
    "term": "Medovice",
    "alias": [
      "lesný med",
      "medovicová snúška"
    ],
    "kategorie": "vcelarstvi",
    "shortDef": "Medovice je sladký výlučok vošiek, červcov alebo iného fytofágneho hmyzu sajúceho z floému stromov, ktorý robotnice zbierajú ako alternatívny zdroj cukrov k nektáru.",
    "longDef": "Medovice vzniká tak, že koreň sajúceho hmyzu (vošky, červce, mery, háďatko) spracováva floémovú miazgu bohatú na sacharózy — prebytok cukrov vylučuje v podobe kvapôčky výlučku. Robotnice ho zbierajú z povrchu listov alebo priamo z hmyzu, transportujú do úľa a spracovávajú podobne ako nektár.\n\nBotanické zdroje medovice na Slovensku tvoria predovšetkým jedľová medovice (Abies alba, Picea abies — produkujú ju mery Cinara a Sacchiphantes), dubová medovice a lipová medovice. Medovicový med je tmavý (farba od hnedožltej po takmer čiernu), s charakteristicky živicovou alebo karamelovou chuťou, s nižším obsahom sacharózy a vyšším obsahom oligosacharidov a minerálnych látok.\n\nRiziko pre zimovanie: medovicový med má vyšší obsah dextrínov (nestráviteľných polysacharidov), ktoré spôsobujú hnačku u včiel (tzv. nosematóza sprevádzaná hnačkou) pri konzumácii v zime. Včelári preto odporúčajú odoberať medovicový med z medníkov v auguste a nahradiť zásoby cukrovým sirupom.\n\nMedovicový med sa predáva draho — na slovenskom trhu 200–500 Kč/kg — a je považovaný za gastronomicky hodnotnejší produkt pre špecifickú chuť.",
    "related": [
      "snuska",
      "nektar-pojem",
      "zazimovani",
      "nosematoza"
    ]
  },
  {
    "slug": "nektar-pojem",
    "term": "Nektár",
    "alias": [
      "nektárová snúška"
    ],
    "kategorie": "vcelarstvi",
    "shortDef": "Nektár je cukerný roztok vylučovaný nektárnikmi kvitnúcich rastlín, ktorý je primárnym surovým materiálom pre výrobu kvetového medu.",
    "longDef": "Nektár produkujú nektáriá — špecializované pletivá (žlázky) umiestnené pri základni okvetných plátkov alebo na extraflórnych miestach (listové stopky, palisty). Jeho zloženie je premenlivé: 5–80 % cukrov (sacharóza, fruktóza, glukóza), voda, aminokyseliny, enzýmy a aromatické látky.\n\nVčely zbierajú nektár medovým vreckom (volata mel) — po návrate do úľa ho odovzdávajú prijímacím včelám, ktoré ho opakovane prelievajú a pridávajú enzýmy (invertáza, glukóza oxidáza). Voda sa odparuje pri ventilácii — z čerstvého nektáru (obsahuje 20–80 % vody) vzniká zrelý med (do 17–18 % vody), až potom včely bunky zaviečkujú.\n\nVydatnosť nektárovej produkcie závisí na druhu rastliny, počasí a pôdnej vlhkosti. Repka olejná je jednou z najdôležitejších nektárových plodín na Slovensku — pri priaznivých podmienkach produkuje až 100–150 kg nektáru na hektár. Významné nektárové plodiny sú ďalej lipa (Tilia sp.), akát (Robinia pseudoacacia), jetel (Trifolium sp.) a facélia (Phacelia tanacetifolia).\n\nNektárová snúška sa od medovicovej líši tým, že nektár pochádza priamo z rastlín, nie z hmyzích výlučkov — výsledný med má odlišné fyzikálne i senzorické vlastnosti.",
    "related": [
      "snuska",
      "medovice-pojem",
      "pyl-rousky",
      "zaviceny-med"
    ]
  },
  {
    "slug": "rojeni",
    "term": "Rojenie",
    "alias": [
      "roj",
      "prirodzené rojenie"
    ],
    "kategorie": "vcelarstvi",
    "shortDef": "Rojenie je prirodzený spôsob rozmnožovania včelstva, pri ktorom stará matka s časťou včiel opúšťa pôvodný úľ a zakladá nové hniezdo.",
    "longDef": "Rojenie je evolučne zakódovaná stratégia šírenia včelstva. Spúšťacím mechanizmom je kombinácia preplneného úľa, slabšej matečnej látky (klesajúca produkcia starej matky), hromadenie trubcov a vhodné počasie (koniec mája – jún). Včely začínajú stavať matečníky — prvý signál pre včelára.\n\nPrimárny roj (príroj) opúšťa úľ v poobedňajších hodinách za teplého a slnečného dňa, zvyčajne v deň, keď sa prvý matečník blíži k zavíčkovaniu. So starou matkou odletí 30–50 % včiel. Roj sa zhromažďuje na vetve alebo inej podpore v okruhu do 300 m od pôvodného úľa, kde čaká 1–3 dni, kým prieskumné včely nájdu nové hniezdište.\n\nVčelár môže roj chytiť (zmestí sa do prázdneho úľa alebo rohovej schránky) a takto získať nové včelstvo. Ak roj odletí, pôvodný úľ pokračuje so zásobou matečníkov — prvá nakladená matka likviduje ostatné matečníky (súboj o trón). Po snubnom proletu a oplodnení obnoví kladenie.\n\nKontrola rojenia je jedným z hlavných pracovných úloh v sezóne. Profilaktické opatrenia zahŕňajú výmenu matiek, pridávanie medníkov, urezanie matečníkov alebo umelé rojenie (oddelenie).",
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
    "term": "Roj",
    "alias": [
      "prírodný roj",
      "príroj"
    ],
    "kategorie": "vcelarstvi",
    "shortDef": "Roj je skupina včiel (matka + robotnice) oddelená od materského včelstva pri prirodzenom rojení, ktorá hľadá nové hniezdište.",
    "longDef": "Roj opúšťajúci úľ tvorí matka a približne 30–50 % robotníc materského včelstva — v počte 10 000–30 000 kusov. Pred odletom robotnice prijímajú med do volete na zásoby. Roj obvykle setrvá dočasne (tzv. rojové shromaždište) na blízkom mieste 30 minút až niekoľko hodín, potom odletí za novým hniezdišťom nájdeným prieskumnicami.\n\nChytenie roje vykonáva včelár sfúknutím (protretím) do prázdneho úľa alebo do špeciálneho rojového koša. Je nutné zachytiť matku — bez nej roj opustí nové umiestnenie. Pre chytanie rojov vo výške alebo na stromoch sa používajú špeciálne záchytné klapky alebo rohové schránky.\n\nPríroj má výhodu — mladý roj je obvykle zdravý a plný energie (robotnice vo veku intenzívnej produkcie vosku a stavby plástu), rýchlo buduje nové dielo. Nevýhodou je nižší výnos v prvom roku a nutnosť prikrmovania.\n\nV prírode (dutý strom, strešná medzera) zakladajú roje voľné hniezda — tzv. divoké nálezy sú na Slovensku súčasťou ochrany biodiverzity, ale prakticky je hospodárenie s nimi problematické.",
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
    "term": "Oddelok",
    "alias": [
      "oddielkové včelstvo",
      "nucleus"
    ],
    "kategorie": "vcelarstvi",
    "shortDef": "Oddelok je malé umelé včelstvo vytvorené včelárom z časti včiel, plástov a mladej alebo zaváčkovanej matky, slúžiace k reprodukcii alebo prekonaniu bez prirodzeného rojenia.",
    "longDef": "Oddelok (nucleus) je jednou z metód kontrolovaného množenia včelstiev bez prirodzeného rojenia. Tvorí ho zvyčajne 3–6 rámikov (plod, zásoby, včely) odobratých z jedného alebo viacerých silných včelstiev, k nimž sa pridá buď zaváčkovaný matečník (zo zámerného chovu alebo záchranný), kupovaná matka alebo voľná neoplodnená matka.\n\nOddelok sa umiestni na nové stanovište alebo na vzdialené miesto, aby lietavky sa nemohli vrátiť späť. Oddelok bez matky (tzv. sirotčí) prijme pridanú matku alebo si vystaví záchranné matečníky zo zálohy plodu.\n\nOddelky sú základom modernej selekcie matiek — chovatelia matiek štandardne pracujú s tzv. nukleárnymi (nucleus) úlmi, do ktorých sa sádzajú oplodnené matky z výberového chovu. Na Slovensku prebieha hodnotenie matiek v rámci šľachtiteľského programu Slovenského zväzu chovateľov včely medonosnej (SZCHM).\n\nOddelok zvyčajne v prvom roku neprináša ekonomický výnos — slúži ako nová zásoba pre budúcu sezónu. V prípade straty silného včelstva môže oddelok slúžiť k urgentnému posilneniu alebo spojeniu.",
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
    "term": "Matečník",
    "alias": [
      "matečná bunka"
    ],
    "kategorie": "vcelarstvi",
    "shortDef": "Matečník je zväčšená vosková bunka, v ktorej sa vyvíja larva budúcej matky, kŕmená výhradne materskou kašičkou.",
    "longDef": "Matečník má žalúdkovitý tvar a zvislú orientáciu, na rozdiel od vodorovne orientovaných buniek robotníc a trubcov. Dĺžka matečníka dosahuje 20–25 mm. Stavia sa z vosku, pričom dno je tvarované do misky ešte pred zasadením vajíčka.\n\nRozlišujú sa tri typy: rojové matečníky (na okrajoch plástov, signalizujú prípravy na rojenie), záchranné matečníky (budované núdzovo z robotníckych lariev mladých do 3 dní po strate matky) a tiché výmenné matečníky (stavované diskrétne vedľa materského hniezda pri postupnej výmene starnúcej matky).\n\nZáchranné matečníky sú menej spoľahlivé než plánované rojové alebo chovateľsky pripravené — larva prechádza na výhradné kŕmenie materskou kašičkou oneskorene (cez 24 h), výsledná matka býva menej kvalitná. Preto skúsený chovateľ matiek používa špeciálne chovateľské misky alebo larvovníky.\n\nZ matečníku vychádza matka približne 16. deň od nakladenia vajíčka. Prvé dni po vyliahnutí zostáva v úli a prechádza mládežníckym zrením. Snubný prolet podnikne za 7–10 dní za priaznivých podmienok.",
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
    "term": "Zavíčkovanie",
    "alias": [
      "plombovanie",
      "víčkovanie"
    ],
    "kategorie": "vcelarstvi",
    "shortDef": "Zavíčkovanie je pokrytie obsahu buniek voskovým viečkom — u plodu uzatvára kuklu, u medu signalizuje jeho zrelosť (obsah vody pod 18 %).",
    "longDef": "Zavíčkovanie plodu nastane približne 6. deň po nakladení vajíčka (po 3 dňoch vo vajíčku a 3 dňoch larvy). Robotnice uzavrú bunku plochým alebo mierne vyvýšeným voskovým viečkom; pod ním larva spradie zámotok a premení sa na kuklu. Farba zavíčkovaného plodu je svetlohnedá (zdravá) alebo tmavohnedá (poklesnutá — možný príznak choroby).\n\nZavíčkovanie medu je pre včelára signálom zrelosti — včely zavíčkujú bunku až vtedy, keď sa obsah vody zníži pod 17–18 %. Med s vyšším obsahom vody (z nezavíčkovaných buniek alebo nevyzretý) kvasí. Preto platí pravidlo: vytáčať len med z rámikov zavíčkovaných aspoň z dvoch tretín plochy.\n\nViečka medu môžu byť ploché (suché viečka) alebo konvexné (mokré viečka). Suché viečka sú obľúbené pre predaj medových plástov ako delikatesy. Odkryvanie (deoperkulácia) sa vykonáva odkryvacou vidličkou, nožom alebo parným odkryvačom.\n\nBledý alebo šedý zákal zavíčkovaného plodového diela môže indikovať mrazový plod (Melissococcus plutonius) alebo vápenatý plod (Ascosphaera apis) — hygienická kontrola je tu kľúčová.",
    "related": [
      "vceli-plod",
      "zaviceny-med",
      "medomet-pojem",
      "vytaceni-medu"
    ]
  },
  {
    "slug": "vceli-plod",
    "term": "Včelí plod",
    "alias": [
      "plod",
      "plást s plodom"
    ],
    "kategorie": "vcelarstvi",
    "shortDef": "Včelí plod je súhrnné označenie pre vajíčka, larvy a kukly vo vývojovom štádiu vnútri plástových buniek.",
    "longDef": "Vývoj včelieho plodu začína nakladením vajíčka matkou na dno bunky. Vajíčko je valcovité (1,5 mm), bielej farby, vo zvislej polohe. Po 3 dňoch sa z vajíčka vyliahne larva — malý, zakrivený, beznohý červ. Robotnice ju kŕmia materskou kašičkou (prvých 2–3 dni pre robotnicu), potom zmesou peľu a medu.\n\nV zdravom plodisku je plod kompaktný — bunky sú obsadené pravidelne, vajíčka stoja zvisle v strede bunky, larvy sú perleťovo biele a lesklé. Tzv. „korenený\" plod (bunky s plodom a prázdne bunky striedavo) je príznakom vírusu deformovaných krídel, vápenatého alebo mrazového plodu, alebo problémov s matkou.\n\nLarválny vývoj prebieha 6 dní (robotnice), potom robotnice bunku zavíčkujú. Kuklenie a metamorfóza trvá 12 dní. Celkovo 21 dní od vajíčka k dospelej robotnici. Trúd sa vyvíja 24 dní, matka 16 dní.\n\nPlodový plást je tepelnou konštantnou zónou — teplota 34–35 °C sa udržiava termoreguláciou robotníc. Odchýlky spôsobujú vývojové defekty (krivé alebo chýbajúce časti tela).",
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
    "term": "Kladenie matky",
    "alias": [
      "snúška vajec",
      "oviposícia"
    ],
    "kategorie": "vcelarstvi",
    "shortDef": "Kladenie matky (oviposícia) je proces, pri ktorom matka vkladá oplodnené alebo neoplodnené vajíčka do buniek plástu — kľúčový ukazovateľ zdravého stavu včelstva.",
    "longDef": "Plodná oplodnená matka kladie v plnej sezóne (apríl–august) 1 500–2 500 vajíčok denne. Oplodnené vajíčka smerujú do buniek pracovného rozmeru (5,2–5,4 mm) a dávajú vznik pracovniciam; do buniek trubčieho rozmeru (6,2–6,9 mm) kladie matka zámerne neoplodnené vajíčka, z ktorých sa vyvíjajú trubci.\n\nVzor kladenia sleduje včelár pri prehliadke: zdravá matka kladie kompaktný terč plodu bez medzier. Prerušený plod (chýbajúce vajíčka v bunkách, „hnáto sito\") signalizuje ochorenie alebo matku s vadným semenom. Matka s nízkym príjmom peľu alebo staršia matka prechádza na nepravidelné kladenie skôr.\n\nPracovnice prijímajú vajíčko krátkodobou inspekciou bunky — vaječné bunky pracovnic obsahujú nulový peľ alebo materskú kašičku pripravenú pre larvu. Matka vajíčko pripevní k dnu bunky vylučovaným lepkavým sekretom.\n\nKontrola kladenia je základnou metódou diagnostiky bezmatkovosti — pouhý pohľad na plást (prítomnosť vajíčok viditeľných lupou alebo na slnku) potvrdí prítomnosť aktívnej matky. Vajce je čerstvé, staršie larvy a zavíčkovaný plod môžu pochádzať z predchádzajúcej matky.",
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
    "term": "Varroáza",
    "alias": [
      "varroóza",
      "varroa",
      "Varroa destructor"
    ],
    "kategorie": "vcelarstvi",
    "shortDef": "Varroáza je najrozšírenejšie a ekonomicky najvýznamnejšie ochorenie včiel spôsobené roztočom Varroa destructor, ktorý oslabuje plod a prenáša vírusové choroby.",
    "longDef": "Varroa destructor — druh oddelený od Varroa jacobsoni v roku 2000; V. jacobsoni napáda iba včelu východnú (Apis cerana) — je ektoparazitický roztoč pôvodom z Ázie, ktorý sa šíri celosvetovo a prakticky v každej populácii včely medonosnej v Európe. Samička (1,1 × 1,6 mm, červenohnedá, oválna) sa prichytáva na kuklu alebo dospelú včelu a saje hemolymfu.\n\nRozmnožovanie prebieha v zavíčkovanom plode — samička vstúpi do bunky pred zavíčkovaním, naklade 1 samca a 4–5 samíc; po dokončení vývoja dospelé roztoče opúšťajú bunku s novou generáciou včely. Trubčí plod je preferovaným hostiteľom (trubci sa vyvíjajú dlhšie, takže samička stihne viac potomkov).\n\nNeliečená Varroa spôsobí zánik včelstva zvyčajne do 2–4 rokov. Okrem priameho sania oslabuje imunitu a je vektorom vírusov (najmä vírus deformovaných krídel — DWV). Liečba je v SR povinná — prípustné látky sú kyselina šťavelová (Oxuvar, Api-Bioxal), amitraza (Apivar, Apitraz) a fluvalinát (Apistan); použitie sa riadi Metodickým pokynom SVS a zákonom o liekoch.\n\nMonitoring sa vykonáva prirodzeným spadom na podložke, zimnou prácou s 100 včelami alebo alkoholovým umývaním (wash). Prah liečenia je zvyčajne 3 % roztoča na pracovniciach alebo 0,5 roztoča/100 pracovnic (WHO odporúčanie).",
    "related": [
      "klestik-vcely",
      "zazimovani",
      "vcelstvo",
      "vceli-plod"
    ],
    "externalUrl": "https://cs.wikipedia.org/wiki/Varroa_destructor",
    "externalLabel": "Wikipedia: Varroa destructor"
  },
  {
    "slug": "klestik-vcely",
    "term": "Kleštík včelí",
    "alias": [
      "Varroa destructor",
      "kleštík",
      "roztoč varroa"
    ],
    "kategorie": "vcelarstvi",
    "shortDef": "Kleštík včelí (Varroa destructor) je ektoparazitický roztoč sajúci hemolymfu zo včelích lariev a dospelých, ktorého nekontrolovaný nárast vedie k zániku včelstva.",
    "longDef": "Kleštík včelí je systematicky zaradený do radu Acarina (pavoukovci), čeľade Varroidae. Vedecký názov Varroa destructor bol ustanovený v roku 2000, keď bol druh oddelený od Varroa jacobsoni — ten napáda iba včelu východnú (Apis cerana) a na včele medonosnej sa nerozmnožuje. Samička je plochozelená, hnedočervená, približne 1,1 mm dlhá a 1,6 mm široká. Je viditeľná voľným okom na tele včely alebo v spade na úlové podložke.\n\nŽivotný cyklus zahŕňa phoretickú fázu (roztoče žijú na dospelých včelách) a reprodukčnú fázu (v zavíčkovanom plode). Samička vstupuje do bunky 24–48 hodín pred zavíčkovaním, naklade jedno neoplodnené vajíčko (samec) a 4–5 oplodnených (samice). Samec oplodní dcéry v bunke ešte pred vylíhnutím pracovnice.\n\nVirulencia kleštíka je spôsobená kombináciou priameho poškodenia (sanie hemolymfy znižuje hmotnosť narodené včely, poškodzuje tukové telo) a vektorového prenosu — kleštík je hlavným vektorom vírusu deformovaných krídel (DWV), akútneho paralytického vírusu (ABPV) a ďalších vírusov.\n\nChemická rezistencia Varroa destructor voči pyrethroidom (fluvalinát, flumethrin) je popísaná v Európe od 90. rokov. Preto sa odporúča rotácia účinných látok a preferenčné využitie organických kyselín (kyselina šťavelová) ako prvá voľba najmä v bezplodnom období.",
    "related": [
      "varroaza",
      "zazimovani",
      "vceli-plod",
      "vcelstvo"
    ]
  },
  {
    "slug": "mor-vceliho-plodu",
    "term": "Mor včelieho plodu",
    "alias": [
      "americký mor",
      "AFB",
      "Paenibacillus larvae"
    ],
    "kategorie": "vcelarstvi",
    "shortDef": "Mor včelieho plodu je najnebezpečnejšie bakteriálne ochorenie včelieho plodu spôsobené sporulujúcou baktériou Paenibacillus larvae, ktoré je v SR úradne sledovanou nákazou.",
    "longDef": "Mor včelieho plodu (anglicky American Foulbrood, AFB) spôsobuje baktéria Paenibacillus larvae. Spóry sú extrémne odolné — prežívajú v suchu desiatky rokov, v mede aj po varení. Prenos prebieha prostredníctvom kontaminovaných zásob, nástrojov, starých plástov alebo lúpežnými včelami.\n\nPríznaky: zavíčkovaný plod mení farbu zo svetlohnedej na tmavohnedú, víčka sú prepadnuté a perforované. Roztavená larva (tzv. „provázek\" — sticky rope test) sa tiahne z bunky pri zápichu páratkom ako lepkavý provázek — tento test je základnou diagnostickou metódou. Zápach je intenzívny, nasládly až odporný.\n\nV SR je mor včelieho plodu chorobou podliehajúcou povinnosti hlásenia (zákon č. 166/1999 Z.z., vyhláška SVS). Pri potvrdení nákazy veterinárnym lekárom (laboratórny dôkaz z ÚSKVBL alebo SVS) sa celé včelstvo aj úlové vybavenie spáli, stanovište sa dezinfikuje. Neexistuje povolená liečba antibiotikami v SR (na rozdiel od USA).\n\nPreventívne opatrenia: dezinfekcia nástrojov (louhem sodným 4 %, plameňom), nákup zdravých matiek a rodinných oddelkov s veterinárnym osvedčením, vyhýbanie sa kŕmeniu cudzím medom.",
    "related": [
      "hniloba-plodu",
      "vceli-plod",
      "vcelstvo"
    ],
    "externalUrl": "https://www.svscr.cz/zdravi-zviratunemoci-vcely/",
    "externalLabel": "SVS SR: choroby včiel"
  },
  {
    "slug": "hniloba-plodu",
    "term": "Hniloba plodu",
    "alias": [
      "európsky mor",
      "EFB",
      "Melissococcus plutonius"
    ],
    "kategorie": "vcelarstvi",
    "shortDef": "Hniloba plodu (európsky mor) je bakteriálne ochorenie nezaviečkovaného plodu spôsobené baktériou Melissococcus plutonius, menej destruktívne než mor, ale pri strese vysoko šíriteľné.",
    "longDef": "Hniloba plodu (European Foulbrood, EFB) spôsobuje Melissococcus plutonius. Baktéria sa šíri v tráviacom trakte larvy a konkuruje jej o živiny, larva hynie spravidla pred zaviečkovaním. Symptómy: larvy menia farbu z perleťovo bielej na žltú až hnedú, prijímajú neprirodzené polohy v bunke (zkrútenie, prilnutie k stene bunky), zápach je menej intenzívny než u moru.\n\nEFB je na Slovensku tiež chorobou podliehajúcou hláseniu (vyhláška č. 299/2003 Z.z.). Pri potvrdení nákazy ŠVPS sa rozhoduje o liečbe alebo likvidácii — závisí na intenzite nákazy a zdravotnej situácii. Na rozdiel od AFB existuje v niektorých krajinách EÚ povolená liečba oxytetracyklínom, na Slovensku je použitie antibiotík u včiel zakázané.\n\nPredisponujúce faktory pre prepuknutie EFB sú stres (slabá snúška, chlad), nedostatok peľu (slabá jarná snúška), oslabená imunita včelstva alebo prítomnosť Varroa. Včelstvo môže spontánne ozdravieť pri priaznivých podmienkach a silnej snúške (pracovnice rýchlo odstránia chorý plod — hygiena).\n\nPreventívna hygiena: pravidelná obmena plástov, dezinfekcia nástrojov, vyhýbanie sa premiestňovaniu plástov medzi podozrivými včelstvami.",
    "related": [
      "mor-vceliho-plodu",
      "vceli-plod",
      "varroaza"
    ]
  },
  {
    "slug": "nosematoza",
    "term": "Nosematóza",
    "alias": [
      "nosema",
      "Nosema apis",
      "Nosema ceranae"
    ],
    "kategorie": "vcelarstvi",
    "shortDef": "Nosematóza je mikrosporiálne ochorenie čreva pracovných včiel spôsobené parazitom Nosema apis alebo Nosema ceranae, prejavujúce sa hnačkou, oslabením a skrátením životnosti pracovných včiel.",
    "longDef": "Nosema apis je pôvodná mikrospória čreva dospelej včely v Európe, Nosema ceranae je invazívny druh pôvodom z Ázie, ktorý v súčasnosti dominuje na Slovensku aj v EÚ. N. ceranae nevyvoláva typické hnačkové príznaky ako N. apis (viditeľné namnaženie výkalov na prístupe a česne), ale spôsobuje chronické oslabenie a skrátenie života pracovných včiel.\n\nSpóry Nosemy sú prijímané perorálne (kontaminovanou potravou alebo vodou). V čreve klíčia a napadajú epitelové bunky, čím znižujú absorpciu živín. Nakažené pracovnice sú menej schopné kŕmiť plod, slabšie, s kratšou životnosťou — záporná špirála oslabuje celé včelstvo.\n\nDiagnostika sa vykonáva mikroskopicky z homogenátu zadočkov 30–60 pracovných včiel (posúdenie počtu spór na včelu). Liečba fumagilínom (Fumidil B) je na Slovensku od roku 2014 prakticky nedostupná (zrušenie registrácie prípravku v EÚ). Iná liečba schválená nie je — prevencia sa zameriava na hygienu, obmenu plástov, silné zimovanie a prikrmovanie kyselinou fumarovou (obmedzene).\n\nMedovicový med ponechaný ako zimná zásoba zvyšuje riziko nosematózy v zime (nevstrebateľné dextríny spôsobujú hnačku), preto sa odporúča doplňovanie cukerným sirupom.",
    "related": [
      "vcelstvo",
      "zazimovani",
      "medovice-pojem"
    ]
  },
  {
    "slug": "medomet-pojem",
    "term": "Medomet",
    "alias": [
      "medomet radiálny",
      "medomet tangenciálny"
    ],
    "kategorie": "vcelarstvi",
    "shortDef": "Medomet je centrifugálne zariadenie, v ktorom sa odviečkované rámky otáčajú a med je odstredivou silou vymršťovaný zo stien buniek.",
    "longDef": "Medomet funguje na princípe centrifugácie — rámky sú umiestnené buď radiálne (čelné strany rámkov kolmo k osi rotácie) alebo tangenciálne (rámok rovnobežne s obvodom koša). Radiálne medomety (obvyklejšie pre väčšie chovy) vytáčajú obe strany plástu naraz; tangenciálny je potrebné preklopiť.\n\nKapacita medometu sa líši — ručný (2–6 rámkov), elektrický malý (6–12 rámkov), poloautomatický alebo priemyselný (24–48 rámkov). Pre profesionálne chovy nad 100 včelstiev sa používajú prietokové systémy s automatickým odkrytím, medomety s invertorom (nastaviteľné otáčky) a filtráciou medu pod odtokovým kohútikom.\n\nMed zachytený na stenách koša steká dole a odteká cez kohútik do sita a sedimentačnej nádoby. Filtrácia odstraňuje zvyšky vosku a mechanické nečistoty; sedimentácia (12–24 hodín) umožňuje vzduchovým bublinám vystúpiť na povrch.\n\nNerezový medomet spĺňajúci hygienické kritériá (EN 13440) je podmienkou pre certifikáciu medu v rámci systémov kvality (BIO, regionálne značky).",
    "related": [
      "vytaceni-medu",
      "zaviceny-med",
      "mednik",
      "pastovani-medu"
    ]
  },
  {
    "slug": "mezistena-pojem",
    "term": "Mezistena",
    "alias": [
      "voskový základ",
      "foundation"
    ],
    "kategorie": "vcelarstvi",
    "shortDef": "Mezistena je tenká vosková doska s reliéfom šesťbokých buniek, ktorá sa vkladá do rámku ako základ pre stavbu plástu a usmerňuje veľkosť buniek.",
    "longDef": "Mezistena sa vyrába strojovým lisovaním alebo valcováním včelieho vosku do dosiek o hrúbke 0,8–1,2 mm s reliéfom bunkových základov. Reliéf udáva priemer buniek — štandardná mezistena pre pracovný plod má hexagonálny vzor priemeru približne 5,2–5,4 mm.\n\nMezistena sa vkladá do rámku s drôtom (3–4 vodorovné vodiče), k nimž sa pripevní zahriatím alebo horúcim elektrifikátorom (tzv. spájanie drôtu). Pripojenie musí byť pevné — padajúca alebo preložená mezistena v lete stráca tvar a spôsobuje divokosť diela.\n\nPoužívanie mezistien riadi stavbu plástu: pracovnice nestavajú zbytočné trubčie bunky (kľúčové pre kontrolu Varroa), dielo je pravidelné a ľahšie sa manipuluje pri točení. Mezisteny z certifikovaného vosku (bez reziduí pesticídov) sú hygienickým štandardom — kontaminovaná mezistena môže zaťažiť celé dielo.\n\nNa trhu sú aj plastové mezisteny s voskovou povrchovou vrstvou — sú trvanlivejšie, ale menej prirodzene prijímané pracovnicami než čisto voskové.",
    "related": [
      "plast",
      "vcelivosk",
      "vcelarsky-ramek"
    ]
  },
  {
    "slug": "rozperka-pojem",
    "term": "Rozperka",
    "alias": [
      "rozperka",
      "distančná vložka"
    ],
    "kategorie": "vcelarstvi",
    "shortDef": "Rozperka je distančná vložka alebo úprava hornej lišty rámika zabezpečujúca správnu vzdialenosť (včelí priestor 6–9 mm) medzi susednými rámikmi.",
    "longDef": "Pojmom rozperka sa označujú rôzne konštrukčné prvky zabezpečujúce dodržanie tzv. bee space (včelí medzera) — priestoru 6–9 mm, pri ktorom včely rámiky ani nepropolisujú, ani nestavajú divoké diela.\n\nNajrozšírenejší typ sú Hofmannove rozperky (konce bočných líšt rámikov sú prehnuté tak, aby sa susedné rámiky opierali o seba). Alternatívou sú kovové prievlaky (separátory), plastové distančné spony alebo magnetické distančné tyčky.\n\nNesprávna vzdialenosť rámikov vedie k problémom: príliš malá (< 6 mm) spôsobí zapropolisovanie a neprostupnosť diela; príliš veľká (> 9,5 mm) vedie k stavbe divokého diela medzi rámikmi, ktoré musí včelár odstraňovať a čistiť.\n\nV nadstavkových úľoch sa bežne používa 10 rámikov na nadstavok, pričom okrajový priestor je mierne väčší (8–10 mm od steny úľa).",
    "related": [
      "vcelarsky-ramek",
      "ul-pojem",
      "vceli-dilo"
    ]
  },
  {
    "slug": "dymak",
    "term": "Dymák",
    "alias": [
      "dymák",
      "včelársky dymák"
    ],
    "kategorie": "vcelarstvi",
    "shortDef": "Dymák je nástroj na výrobu chladného hustého dymu, ktorý sa pri práci s včelstvom aplikuje do česna a pod veko úľa, aby sa znížila agresivita včiel.",
    "longDef": "Dymák sa skladá z nádržky (nerezový alebo pozinkovaný kôš), mechúra (kožený alebo syntetický) a trysky. Tlením organického materiálu (papier, sisal, drevené triesky, seno, sušené huby) vzniká hustý chladný dym. Teplota dymu by nemala prekročiť 50–60 °C — príliš horúci dym robotnice popáli a spôsobí opak pokoja.\n\nFyziologický účinok dymu: robotnice detekujú dym ako signál požiaru a začínajú prijímať zásoby medu z plástov (inštinktívna príprava na opustenie hniezda). Plné voľa sa menej ľahko bodajú, sú menej agresívne a menej reagujú na dráždivé podnety. Navyše dym maskuje výstražné feromóny (kyselina izoamylacetátová).\n\nTechnicky správna aplikácia: 2–3 záchvevy dymu do česna pred otvorením úľa, potom mierne zadymenie pod veko. Prehnané zadymenie robotnice stresuje a môže poškodiť ich pachy (orientáciu). Studený hustý biely dym je ideálny, teplý tenký sivý je neúčinný.\n\nDymák sa čistí po každom použití — zvyšky dechtu upchávajú trysku. Po skončení práce sa uzavrie priškrtením trysky, aby tlenie samovoľne zhaslo.",
    "related": [
      "smetacek",
      "ul-pojem"
    ]
  },
  {
    "slug": "smetacek",
    "term": "Smetáčik",
    "alias": [
      "včelí smetáčik",
      "perový smetáčik"
    ],
    "kategorie": "vcelarstvi",
    "shortDef": "Smetáčik je mäkký kartáčik alebo perový zväzok, ktorým včelár striasa a zhromažďuje robotnice z rámikov pri prehliadke alebo pred vytáčaním.",
    "longDef": "Smetáčik (anglicky bee brush) je nepostrádateľnou súčasťou výstroja včelára. Tradične sa vyrábal z konských alebo husích pier, dnes prevažuje verzia s mäkkými syntetickými vláknami. Pri každom použití musí byť čistý — zvyšky medu alebo propolisu spôsobujú reakciu robotníc pri kontakte s cudzím zápachom.\n\nPoužíva sa na strhávanie robotníc z rámikov (pred kontrolou matky, pred vytáčaním medu, pri presune rámikov). Správna technika: krátke plynulé ťahy od stredu rámika smerom dole. Rýchle alebo trhavé pohyby robotnice vyplašia a zvýšia agresivitu.\n\nAlternatívou k smetáčiku sú ofukovacie kliešte (mechanická) alebo vzduchový ofukovač (pre väčšiu prevádzku). Pri znáške prítomnosť cudzích vôní (parfém, alkohol, pot) na smetáčiku dráždi včely.\n\nDezinfekcia smetáčika medzi navštívenými včelstvami je preventívnym opatrením pri podozrení na mor plodu alebo inú infekciu — prenos cez kontaminovaný smetáčik je možný.",
    "related": [
      "dymak",
      "ul-pojem"
    ]
  },
  {
    "slug": "ul-pojem",
    "term": "Úl",
    "alias": [
      "koš",
      "úlový box",
      "box"
    ],
    "kategorie": "vcelarstvi",
    "shortDef": "Úl je umelo vyrobené obydlie pre včelstvo, v ktorom včely stavajú dielo, vychovávajú plod a ukladajú zásoby; moderné rámkové úly umožňujú jednoduchú prehliadku a zber medu.",
    "longDef": "Dejiny úľovania siahajú tisíce rokov späť — prvé úly boli hlinenými, korkovými alebo košíkovými. Moderný rámkový úl vychádza z princípu bee space definovaného Lorenzom Langstrothom (USA, 1851): pohyblivé rámky s medziramkovou medzerou 6–9 mm umožňujú rámky vyberať bez poškodenia diela.\n\nZákladné typy úľov na Slovensku a v Česku: Česko-Slovenský úl (rozoberateľný, jednodielny, rámek 39 × 24 cm), Langstrothov úl (nástavkový, medzinárodne najrozšírenejší, rámek 448 × 232 mm), Dadantov úl (veľké plodište, obľúbený v južnej Európe), Zanderov úl (kompromis rozmerov, obľúbený v strednej Európe).\n\nMateriály: smrekové drevo (tradícia, dobré tepelné vlastnosti, nutnosť náteru), topolovica, polystyrén (tepelná izolácia, ľahkosť, horšia trvanlivosť), plast (moderná hygiena, ľahkosť). Polystyrénové úly sú na Slovensku stále obľúbenejšie pre kočovné včelárenie kvôli nižšej hmotnosti.\n\nSprávne umiestnený úl stojí na podstavci vo výške 30–50 cm, česnom na juh alebo juhovýchod, chránený pred priamym slnkom v poludnie (ľahký tieň), bez prekážok pred česnom. Stanovište sa volí s ohľadom na dostupnosť vody a snúškový rádius (letí 3–5 km).",
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
    "term": "Zazimovanie",
    "alias": [
      "zimná príprava",
      "zimovanie"
    ],
    "kategorie": "vcelarstvi",
    "shortDef": "Zazimovanie je súhrn úkonov vykonaných na konci sezóny (august–október), ktorými včelár pripraví včelstvo na zimný pokoj s dostatkom zásob a liečenou populáciou roztočov.",
    "longDef": "Zazimovanie zahŕňa niekoľko kľúčových krokov: vyhodnotenie sily včelstva (obsadenosť rámikov, stav matky), liečbu varroázy (kyselina šťavelová kvapkaním alebo sublimáciou pri bezplodnom stave v októbri–novembri), doplnenie zimných zásob (12–15 kg cukerného sirupu alebo medu), zúženie česna, odstránenie medníkového nástavku a kontrolu vetrania.\n\nCukerný sirup na zazimovanie: koncentrácia 2,5 : 1 (cukor : voda hmotnostne) alebo hustý sirup 2 : 1, podáva sa od polovice augusta do konca septembra, aby ho včely stihli spracovať. Príliš neskoré prikrmovanie spôsobí, že med z cukerného sirupu zostane nevyzretý.\n\nZimný shluk (cluster) sa formuje v dolnej časti plodového hniezda, keď teplota klesne pod 14 °C. Robotnice generujú teplo svalovou kontrakciou, pohybujú sa od studenej periférie do stredu. Teplota stredu shluku sa udržuje nad 20–25 °C.\n\nKľúčový ukazovateľ úspešného zazimovania: prítomnosť dostatku zimných robotníc (robotnice, ktoré nevychovávali plod, majú veľké tukové telo — prezimujú aj 6 mesiacov). Slabá alebo chorá zimná generácia vedie k záhube včelstva ešte pred jarným vývojom.",
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
    "term": "Výzimovanie",
    "alias": [
      "jarná prehliadka",
      "jarná revízia"
    ],
    "kategorie": "vcelarstvi",
    "shortDef": "Výzimovanie je prvá prehliadka včelstiev po zime (zvyčajne koniec marca – začiatok apríla), pri ktorej sa overí stav matky, zásoby, plod a vykoná sa jarná liečba varroázy.",
    "longDef": "Výzimovanie sa vykonáva za teplého, bezvetrného dňa pri teplote nad 12–14 °C. Pri nižšej teplote sa plodové hniezdo otvorením prechladí a plod uhynie. Cieľ prehliadky: potvrdiť prítomnosť živej matky (vajíčka alebo mladý plod), odhadnúť silu a zásoby.\n\nPostup: zloží sa víko, odstránia sa záchranné kŕmidlá, prezrie sa vrchný rámik. Ak je plodové hniezdo vinuté a aktívne, prezrie sa centrálnym spôsobom. Hľadá sa prítomnosť vajíčok (priehľad na svetle), normálnosť plodového pásma, stav zásob peľu a medu.\n\nOdobraný jarný spad zo zimnej podložky dáva približnú informáciu o roztočoch — prirodzene mŕtvi roztoči z zimného shluku sú indikátorom stavu infestácie. Pri počte nad 50 mŕtvych roztočov na podložke (za zimu) je začatie liečby v apríli odporúčané.\n\nPo výzimovaní sa odstránia zimné ucpávky česna, vymení sa zimná podložka, vyčistí sa dno. Slabé alebo bezmatkové včelstvá sa spoja metódou novinovej fólie alebo pridaním matky z rezervy.",
    "related": [
      "zazimovani",
      "varroaza",
      "vcelstvo",
      "matka"
    ]
  },
  {
    "slug": "snubni-prolet",
    "term": "Snubný prolet",
    "alias": [
      "párovací let",
      "oplodnenie matky"
    ],
    "kategorie": "vcelarstvi",
    "shortDef": "Snubný prolet je let mladej matky za trubcami na snubnú dráhu, kde sa pári s 10–20 trubcami a ukladá spermie do semenného vrecka na celý život.",
    "longDef": "Mladá matka podniká snubný prolet zvyčajne 7–14 dní po vyliahnutí z matečníka. Predpokladom je teplý slnečný deň pri teplote nad 20 °C a slabom vetre. Matka lieta na trubcovské zhromaždište (vzdialené 1–5 km) vo výške 10–40 m, kde sa pohybujú trubci z mnohých rôznych včelstiev.\n\nKopulácia prebieha za letu — trubec spočíva na matke, evertuje kopulačný orgán a prenáša spermie; po kopulácii uhynie. Matka sa pári s 10–20 trubcami počas 1–3 snubných proletov. Spermie sa ukladajú v semennom vrecku (spermatheca) — táto zásoba jej vystačí na 3–5 rokov. Nevyužité spermie sa aktívne filtrujú.\n\nZlé počasie (dážď, chlad) môže zabrániť snubnému proletu — matka potom zostáva neoplodnená aj viac ako 3 týždne. Neoplodnená matka (nazývaná trubčica alebo pseudomatka) nakoniec začne klásť neoplodnené vajíčka, z ktorých sa vyvíjajú len trubci.\n\nKontrolované oplodnenie matky na izolovanej inseminačnej stanici (ostrov, odľahlé horské stanovište) je základom selekčného šľachtenia. Na Slovensku funguje sieť inseminačných staníc Zväzu chovateľov včely medonosnej.",
    "related": [
      "matka",
      "trubec",
      "oplodnacek",
      "matka-neoplozena"
    ]
  },
  {
    "slug": "vceli-tanec",
    "term": "Včelí tanec",
    "alias": [
      "tanec osmičiek",
      "kruhovitý tanec",
      "waggle dance"
    ],
    "kategorie": "vcelarstvi",
    "shortDef": "Včelí tanec je komunikačný pohybový signál, ktorým prieskumná robotnica informuje ostatné o vzdialenosti, smere a kvalite zdroja potravy alebo nového hniezdišťa.",
    "longDef": "Včelí tance popísal a dešifroval Karl von Frisch, za čo obdržal Nobelovu cenu za fyziológiu a medicínu v roku 1973. Rozlišujú sa dva základné typy: kruhový tanec (zdroj do cca 50–100 m od úľa) a tanec osmičiek (wabble dance, pre vzdialenosti nad 100 m).\n\nPri tanci osmičiek robotnica beží rovnou vzdialenosťou (tzv. priamy priebeh) a pritom vrtí zadočkom — dĺžka priameho priebehu signalizuje vzdialenosť (dĺžší priebeh = vzdialenejší zdroj), uhol priameho priebehu voči zvislej osi plástu zodpovedá uhlu letu k slnku. Počet deviačných krokov za 15 sekúnd koreluje s vzdialenosťou zdroja.\n\nIntenzita tanca (energičnosť, počet opakovaní) signalizuje kvalitu zdroja — bohatý a voňavý nektár vyvolá intenzívnejší tanec a rýchlejší nábor zberačiek. Prijímajúce robotnice sledujú tance čeľusťami a anténami, prijímajú vzorku pachu zo zberačky.\n\nVýskum včelích tancov pokračuje — bolo preukázané, že súhrnná rozhodovacia sila skupiny prieskumníc volí hniezdište demokraticky: posilňujú sa tance pre lepšie lokality. Toto kolektívne rozhodovanie je modelom pre teóriu skupinového rozhodovania.",
    "related": [
      "snuska",
      "nektar-pojem",
      "vcelstvo"
    ],
    "externalUrl": "https://cs.wikipedia.org/wiki/V%C4%8Del%C3%AD_tanec",
    "externalLabel": "Wikipedia: Včelí tanec"
  },
  {
    "slug": "medny-vynos-pojem",
    "term": "Medný výnos",
    "alias": [
      "výťažnosť medu",
      "výnos medu"
    ],
    "kategorie": "vcelarstvi",
    "shortDef": "Medný výnos je množstvo medu zozbieraného z jedného včelstva za sezónu, vyjadrené v kilogramoch, ako hlavný ekonomický ukazovateľ rentability chovu.",
    "longDef": "Medný výnos závisí od kombinácie genetického potenciálu matky, sily včelstva, druhu a dostupnosti znášky a poveternostných podmienok. Priemerný výnos v ČR dosahuje podľa dát ČSCHM približne 18–22 kg/včelstvo/rok; v priaznivých repkovo-lipových oblastiach Polabia alebo južnej Moravy môže silné včelstvo priniesť 60–80 kg a viac.\n\nMedonosný potenciál je daný hustotou kvitnúcich rastlín v letovom okruhu (3–5 km) a dobou kvitnutia. V monokultúrnej krajine (pšenica, kukurica) je mimo sezónnu pastvu nedostatok pestrejšej potravy — moderné poľnohospodárske dotácie preto zahŕňajú agro-environmentálne opatrenia podporujúce biopásy a kvitnúce pásy.\n\nKočovné včelárenie (presun úľov za znáškami) zvyšuje potenciálny výnos, ale je organizačne aj fyzicky náročnejšie. V ČR je kočovanie rozšírenou praxou — k repke v apríli-júni, k lipe v júli, k pohánke alebo slnečnici v auguste.\n\nMedný výnos je základom kalkulácie ekonomiky chovu: pri cenách medu 200–350 Kč/kg a nákladoch na prevádzku úľa 500–1 000 Kč/rok sa rentabilita malého prevádzky dosiahne od približne 30 včelstiev.",
    "related": [
      "snuska",
      "kocovani",
      "medomet-pojem",
      "vytaceni-medu"
    ]
  },
  {
    "slug": "pastovani-medu",
    "term": "Pastovanie medu",
    "alias": [
      "krémovanie medu",
      "pasírovanie",
      "roušenie medu"
    ],
    "kategorie": "vcelarstvi",
    "shortDef": "Pastovanie medu je kontrolovaná kryštalizácia, pri ktorej sa tekutý med homogenizuje so zárodnými kryštálmi (seed crystal), aby vznikol krémový jemne kryštalický produkt s hladkou konzistenciou.",
    "longDef": "Kryštalizácia medu je prirodzený fyzikálno-chemický proces — glukóza precipituje z presýteného vodného roztoku. Rýchlosť kryštalizácie závisí na pomere fruktózy a glukózy (vysoký obsah fruktózy = pomalá kryštalizácia — akátový med; repkový med s vysokým obsahom glukózy kryštalizuje do tuhej formy za 2–6 týždňov).\n\nPri pastovaní sa tekutý med (zahriaty na 35–40 °C pre roztavenie existujúcich kryštálov) zmieša so zárodnými kryštálmi (jemne rozmiešaným starším medom, zvyčajne 10–20 % hmotnosti). Zárodné kryštály fungujú ako nukleačné jadrá — riadenou kryštalizáciou vznikajú veľmi drobné homogénne kryštály, výsledná konzistencia je krémová a ľahko roztierateľná.\n\nChladenie na 14–16 °C po dobu 1–2 týždňov je optimálne pre tvorbu pastovaného medu. Pri teplote pod 10 °C je proces príliš pomalý, nad 25 °C sa kryštály znovu rozpúšťajú. Výsledný produkt si zachováva drobné kryštáliky a neroztápa sa.\n\nPastovaný med je na Slovensku obľúbenou formou predaja — má dlhšiu trvanlivosť v stáčanom stave, nesteká, lepšie sa roztiera na pečivo. Je predávaný za ceny porovnateľné alebo mierne vyššie než tekutý med (200–400 Kč/kg v priamom predaji).",
    "related": [
      "zaviceny-med",
      "medomet-pojem",
      "nektar-pojem"
    ]
  },
  {
    "slug": "vytaceni-medu",
    "term": "Vytáčanie medu",
    "alias": [
      "točenie medu",
      "stáčanie medu"
    ],
    "kategorie": "vcelarstvi",
    "shortDef": "Vytáčanie medu je proces odstredenia zrelého medu z odkrytých plástov v medomete, pri ktorom sa med vyhodí zo stien buniek a odteká do nádoby.",
    "longDef": "Pred samotným vytáčaním sú potrebné prípravné kroky: presun medníkových rámikov do čistej miestnosti (zbavenie lietok, aby sa robotnice nemohli vrátiť do odkrytých rámikov), odkrytie (deoperkulácia) voskových viečok odkryvacím nástrojom alebo parou a vloženie rámikov do medometu.\n\nVytáčanie prebieha pomalou rozjazdovou rýchlosťou (70–100 ot./min.), aby sa plásty nepretrhli, potom sa zvýši na pracovné otáčky (200–500 ot./min. podľa priemeru medometu). V radiálnom medomete stačí jeden cyklus, v tangenciálnom sa rámiky otočia a vytočia obe strany.\n\nČerstvo vytočený med sa prefiltrovaný cez nerezové sito (≤ 0,5 mm oka) a nechá sedimentovať v uzavretej nádobe 24–48 hodín. Vzduchové bubliny a drobné voskové vločky stúpajú na povrch. Potom sa stáča do pohárov alebo sudov.\n\nPred stočením do finálneho obalu je potrebné zmerať obsah vody refraktometrom (Brix alebo index lomu) — med s obsahom vody nad 18 % kvasí. Kvasný med nemožno predávať ako potravinový med podľa nariadenia Nariadenia č. 1308/2013 a vyhlášky 76/2003 Zb.",
    "related": [
      "medomet-pojem",
      "zaviceny-med",
      "mednik",
      "pastovani-medu"
    ]
  },
  {
    "slug": "vcelin",
    "term": "Včelín",
    "alias": [
      "úlové stanovište",
      "prístrešok pre úly"
    ],
    "kategorie": "vcelarstvi",
    "shortDef": "Včelín je zastrešený prístrešok alebo budova chránia úly pred poveternostnými vplyvmi, predátormi a vandalmi, zároveň slúži ako sklad nástrojov a medáreň.",
    "longDef": "Tradičný včelín (pavlačový typ) je drevená stavba s lodžiou, na ktorej stoja úly česny von. Pavlačový typ je pre chodíce (bez kočovania) prevádzky v miestach s drsnejším klimatom alebo zimami — chráni úly pred dažďom, snehom a mrazom.\n\nModerná prevádzka zvyčajne používa voľne stojace úly na podstavcoch s ľahkým prístreškom alebo plachtou. V podmienkach Slovenska sa považuje za dostatočné umiestnenie v juhovýchodnej expozícii s prirodzeným vetrom a tieňom.\n\nZákonné podmienky: na Slovensku stanovuje vzdialenosť úľov od hraníc susedných nehnuteľností vyhláška č. 136/2004 Z.z. a miestne stavebné predpisy (min. 3 m od hranice pozemku alebo min. 25 m od zastavanej časti, v opačnom prípade je nutná živá alebo pevná zástena). Chovateľský zväz (ČSCHM) vydáva podrobnejšie odporúčania.\n\nPre komerčnú alebo hobby prevádzku je výhodné mať na stanovišti drobný prístrešok s pracovným stolom, vedrami na med, medometom a dezinfekčnými prostriedkami — spĺňa základné hygienické požiadavky pre domáce spracovanie medu podľa hygienickej vyhlášky.",
    "related": [
      "ul-pojem",
      "kocovani",
      "medomet-pojem"
    ]
  },
  {
    "slug": "kocovani",
    "term": "Kočovanie",
    "alias": [
      "presun úľov",
      "kočovné včelárenie"
    ],
    "kategorie": "vcelarstvi",
    "shortDef": "Kočovanie je presun včelstiev za znáškou do iných lokalít, ktoré umožňuje využívať sezónne rôzne zdroje nektáru a medovice a zvyšovať medný výnos.",
    "longDef": "Kočovanie patrí k najefektívnejším metódam zvyšovania mednej produkcie. V ČR typicky zahŕňa presun k rozkvitnutej repke (apríl–máj, Polabie, južná Morava), k lipe (júl, lesy a stromoradia), k pohánke alebo slnečnici (august) a prípadne k vresu (august–september, Česká vysočina, šumavské podhorie).\n\nPresun sa vykonáva v noci, keď sú robotnice vo vnútri úľa — česno sa uzavrie sieťovou vložkou (dostatočná ventilácia) alebo zátkou, úle sa zaistia popruhmi a naložia sa na vozidlo. Preprava by nemala trvať dlhšie ako jednu noc — pri dlhšej preprave alebo horúčave hrozí zadusenie alebo prehriatie.\n\nNa novom stanovišti sa odporúča ponechať česno 1–2 hodiny uzavreté (robotnice sa upokoja), potom otvoriť skoro ráno. Presun na menej ako 3 km od predchádzajúceho stanovišťa nezabezpečí presmerovanie lietok — včely sa vrátia na pôvodné miesto. Vzdialenosť presunu musí byť buď menej ako 50 m (denná preprava po etapách) alebo viac ako 3 km.\n\nKočovné včelstvo musí byť zdravé a ošetrené — SVS vydáva kočovacie preukazy, ktoré veterinárne potvrdzujú zdravotný stav včelstva. Bez platného preukazu nemožno legálne presúvať úle v ČR.",
    "related": [
      "snuska",
      "medny-vynos-pojem",
      "ul-pojem",
      "vcelin"
    ]
  },
  {
    "slug": "cmsch",
    "term": "CEHZ a evidencia včelstiev",
    "alias": [
      "Centrálna evidencia hospodárskych zvierat",
      "Plemenárske služby SR"
    ],
    "kategorie": "vcelarstvi",
    "shortDef": "CEHZ (Centrálna evidencia hospodárskych zvierat), ktorú vedú Plemenárske služby Slovenskej republiky, š. p., je registračný a evidenčný systém včelstiev na Slovensku — každý chovateľ je povinný nahlásiť počty včelstiev a stanovištia. Hlavnou záujmovou organizáciou včelárov je Slovenský zväz včelárov (SZV).",
    "longDef": "Centrálnu evidenciu hospodárskych zvierat (CEHZ) prevádzkuje štátny podnik Plemenárske služby Slovenskej republiky. Vo včelárstve to znamená, že každý chovateľ musí nahlásiť svoje stanovištia a počty včelstiev — tieto údaje slúžia pre veterinárny dohľad (monitoring nákaz, mor včelieho plodu, varroáza) a preukazujú sa pri presunoch včelstiev.\n\nDohľad nad zdravím včelstiev vykonáva Štátna veterinárna a potravinová správa SR prostredníctvom regionálnych správ (RVPS), ktoré vydávajú veterinárne osvedčenia pri presunoch a vyhlasujú ochranné pásma pri potvrdenej nákaze.\n\nHlavnou záujmovou organizáciou združujúcou včelárov je Slovenský zväz včelárov (SZV), ktorý zabezpečuje vzdelávanie, poradenstvo, poistenie a zastupovanie záujmov včelárov voči štátnym orgánom. SZV má krajské a základné organizácie po celom Slovensku.\n\nPodporu pre sektor včelárstva administruje Pôdohospodárska platobná agentúra (PPA) v rámci sektorovej intervencie Strategického plánu SPP; časť opatrení sa realizuje prostredníctvom uznaných včelárskych organizácií. Podmienky a termíny sa vyhlasujú pre každé obdobie zvlášť.\n\n‼️ Českomoravská spoločnosť chovateľov (ČMSCH) plní obdobnú úlohu v Česku, nie na Slovensku — pri čítaní českých zdrojov je tento rozdiel dôležitý.",
    "related": [
      "vcelstvo",
      "varroaza",
      "zazimovani"
    ],
    "externalUrl": "https://www.pssr.sk/",
    "externalLabel": "Web ČSCHM"
  },
  {
    "slug": "cesno-pojem",
    "term": "Česno",
    "alias": [
      "česno úlu",
      "letový otvor",
      "vletový otvor"
    ],
    "kategorie": "vcelarstvi",
    "shortDef": "Česno je vstupný otvor do úľa slúžiaci ako vletový a výletový bod pre robotnice a ako prvá línia obrany včelstva pred nežiaducimi vplyvmi a narušiteľmi.",
    "longDef": "Česno (zo starosl. \"česati\" — cesta) je hlavný otvor v čelnej stene úľa. Štandardná šírka česna závisí na type úľa — u Langstrothu je to zvyčajne 20 mm výška a celá šírka nástavku (37–40 cm) alebo kratšia zátka. Výška česna sa prispôsobuje veľkosti populácie a ročnému obdobiu.\n\nNa leto sa česno rozširuje pre voľný priechod intenzívne lietajúcich robotníc a ventiláciu; na jeseň sa zužuje zátkou alebo česnovým vstupom na šírku jedného prsta, aby sa znížil prístup slabých predátorov (sršne, myši, lúpeživé včely). Na zimu sa česno úplne uzavrie česnovým zátkovým systémom s vetracím sitom.\n\nČesno ako obranná línia: strážne robotnice kontrolujú každú prichádzajúcu včelu čuchovými a hmatovými orgánmi. Narušitelia (lúpeživé včely z cudzích úľov, vosy, sršne) sú odháňaní alebo usmrcovaní. Intenzita lúpenia je indikátorom sily včelstva — slabé alebo bezmatečné včelstvo sa nedokáže ubrániť.\n\nPosúdenie aktivity česna je rýchlou diagnostikou zdravia včelstva: aktívny pohyb robotníc s rouskami peľu v ranných hodinách signalizuje silné, aktívne plodište; mŕtve alebo nehybné česno signalizuje problém.",
    "related": [
      "ul-pojem",
      "nastavek",
      "zazimovani"
    ]
  },
  {
    "slug": "medocukrove-testo",
    "term": "Medocukrové cesto",
    "alias": [
      "kandy",
      "candy",
      "medocukerné cesto",
      "zimné krmivo"
    ],
    "kategorie": "vcelarstvi",
    "shortDef": "Medocukrové cesto (kandy) je tuhé zimné krmivo zo cukru, medu a vody, ktoré sa pokladá na rámiky k doplneniu zásoby v zime alebo skoro na jar.",
    "longDef": "Medocukrové cesto (angl. candy alebo fondant) sa vyrába z kryštálového cukru (80–90 %), medu (5–15 %) a malého množstva vody (8–10 %). Varí sa za miešania do 118–120 °C (skúška do studenej vody — tvrdá guľka), potom sa mieša pri chladnutí do tuhej, plastickej konzistencie. Výsledok je mäkký, roztierateľný tuhý cukrový produkt.\n\nPodávanie kandy prebieha cez zimné alebo jarné česno v plastovom sáčku alebo plastovej miske položenej na horné lišty rámikov. Robotnice kandy pomaly konzumujú — slúži ako záchranná zásoba pri vyčerpaní zimného medu. Dávkovanie býva 1–2 kg na zimujúce včelstvo.\n\nDomáca výroba je možná, ale časovo náročná. Komerčne predávané kandypasty (napr. Apifondant, Apicandy) sú štandardizované, hygienicky nezávadné, niekedy obohatené o minerály alebo vitamíny. Cena hotového kandy sa pohybuje okolo 30–50 Kč/kg.\n\nKandy je alternatívou k cukernému sirupu (podávanému v teplej sezóne) — nevhodné pre zimné podávanie kvapalného sirupu, pretože robotnice musia vodu odpariť a vnútorná vlhkosť by narastala. Tuhá forma kandy nevnáša vlhkosť do zimoviska.",
    "related": [
      "zazimovani",
      "vyzimovani",
      "vcelstvo"
    ]
  },
  {
    "slug": "oplodnacek",
    "term": "Oplodnáček",
    "alias": [
      "nucleus úl",
      "miniúl",
      "inseminačná stanica"
    ],
    "kategorie": "vcelarstvi",
    "shortDef": "Oplodnáček je malý miniatúrny úľ na 3–5 miniatúrnych rámikov, používaný chovateľmi matiek k izolovanému oplodneniu mladých matiek na vzdialených snubných staniciach.",
    "longDef": "Oplodnáček (miniúl alebo nucleusový miniúl) je špeciálny malý úľ, ktorého rozmery zodpovedajú približne tretine alebo štvrtine štandardného rámika (napr. Zander alebo Apidea formát). Osadí sa hrstou robotníc (približne 100–200 g) z jedného alebo viacerých nevyhubiteľných zdrojov, krátkoplodným plástom a zásobami, potom sa vloží nedávno vyliahnutá panenská matka.\n\nRobotnice v oplodnáčku ošetrujú matku počas jej zrenia. Za 7–14 dní po vyliahnutí podnikne matka snubný prolet. Na izolovanej inseminačnej stanici (ostrov, vzdialený horský hrebeň) sú v dosahu iba trubci z vybraných šľachtiteľských línií, čím sa dosiahne kontrolované oplodnenie.\n\nPo oplodnení sa matka kontroluje (kladenie vajíčok, kompaktný plod do 10 dní po návrate zo snubného proletu) a odchytí sa na expedíciu alebo zasadenie do výrobného včelstva. Oplodnáček potom slúži na prijatie novej panenskej matky.\n\nSystémy oplodnáčkov sú štandardizované (Apidea, Kirchhain, Nicot) — vzájomná zameniteľnosť a jednoduchá manipulácia sú výhodami, nevýhodou je náročnosť prepravy a slabšie zásoby pri zlom počasí.",
    "related": [
      "matka",
      "snubni-prolet",
      "oddelek",
      "matka-neoplozena"
    ]
  },
  {
    "slug": "trubcina",
    "term": "Trubčina",
    "alias": [
      "trubčí plod",
      "trubčia plocha"
    ],
    "kategorie": "vcelarstvi",
    "shortDef": "Trubčina je plocha plástu s trubčími bunkami (priemer 6,2–6,9 mm), v ktorých sa vyvíjajú trubce a ktoré slúžia ako biotop preferovaný roztočom Varroa na reprodukciu.",
    "longDef": "Trubčina sa pozná od robotníckeho plodu ako vizuálne (bunky majú väčší priemer a sú kupolovito vyklenuté, takže zavíčkovaný trubčí plod výrazne prečnieva z plochy plástu), tak rozmerovo. Matka kladie do trubčích buniek neoplodnené vajíčka zámerne — rozpozná veľkosť bunky zadočkovými senzormi.\n\nZ pohľadu parazitológie je trubčina kritickým miestom pre varroázu — Varroa destructor preferuje trubčí plod (trubce majú dlhšiu zavíčkovanú fázu, takže roztoč stihne viac potomkov). Zámerné vkladanie trubčích rámikov do plodiska a ich cyklické vyraďovanie (tzv. biotechnická metóda boja s varroázou) znižuje populáciu roztočov bez chémie.\n\nPríliš veľká plocha trubčiny (cez 20 % plochy plodiska) oslabuje včelstvo zbytočným množstvom živých trubcov. V bezmatečnom včelstve (alebo pri robotniciach s vaječníkmi) je všetok plod trubčí — tento jav nazývaný „trubčice\" alebo „bezmatečné trubčivo\" svedčí o vážnej poruche.\n\nStará medzistena má tendenciu k zväčšovaniu buniek — včely dostavujú bunky na väčší priemer, čo zvyšuje podiel trubčiny. Výmena medzistien každé 2 roky kontroluje bunkový rozmer.",
    "related": [
      "trubec",
      "varroaza",
      "vceli-plod",
      "klestik-vcely"
    ]
  },
  {
    "slug": "matka-neoplozena",
    "term": "Matka neoplodnená",
    "alias": [
      "panenská matka",
      "virgin queen"
    ],
    "kategorie": "vcelarstvi",
    "shortDef": "Matka neoplodnená (panenská) je čerstvo vyliahnutá alebo zrejúca matka, ktorá dosiaľ nepodnikla svadobný prelet, takže neskladuje spermu a nie je schopná klásť oplodnené vajíčka.",
    "longDef": "Panenská matka je fyziologickým medzistupňom medzi larvou v matečníku a plodnou matkou. Po vyliahnutí z matečníka je pohyblivá a aktívna, ale ešte nevyvinutá pre reprodukciu — vaječníky dozrievajú, semenný vačok je prázdny.\n\nV prvých 5–7 dňoch po vyliahnutí prebieha pohlavné dozrievanie. Matka skúma úľ, ničí ostatné matečníky (pichne ich cez viečko) a vytláča prípadné sokyne z iných matečníkov. Tento stav „súbojov o trón\" je normálny pri prirodzenom roji.\n\nPrítomnosť panenskej matky sa dá overiť ťažko — nekladie, preto plodový test nepomôže. Priame pozorovanie (matka je pohyblivá, vytiahnutá, ale bez vajíčok) alebo feromónový test (nie je výrazná materská látka) sú metódy. Neskúsený včelár ľahko zámennou zlikviduje panenskú matku.\n\nPreprava panenských matiek v zásielkových klietkach je rizikovejšia než preprava kladúcich matiek — robotnice ich horšie prijímajú. Preto šľachtitelia expedujú spravidla matky po oplodnení (najneskôr 2–3 dni po prvom kladení).",
    "related": [
      "matka",
      "snubni-prolet",
      "oplodnacek",
      "matecnik"
    ]
  },
  {
    "slug": "zaviceny-med",
    "term": "Zavíčkovaný med",
    "alias": [
      "zralý med",
      "dozrálý med",
      "operkovaný med"
    ],
    "kategorie": "vcelarstvi",
    "shortDef": "Zavíčkovaný med je med uzavretý voskovým víčkom v bunkách plástu, čo signalizuje jeho zrelosť — obsah vody sa znížil pod 18 % a med nekvasí.",
    "longDef": "Zavíčkovanie medu je prirodzeným kvalitativným štandardom, ktorý včely uplatňujú inštinktívne. Teprve po dosiahnutí obsahu vody pod 17–18 % robotnice uzavrú bunku voskovým víčkom. Med s vyšším obsahom vody by v bunke fermentoval (kvasinky Saccharomyces cerevisiae alebo Zygosaccharomyces rouxii sú prirodzene prítomné v mede).\n\nPre vytáčanie platí zásada: vytáčať iba rámiky, ktorých aspoň dve tretiny buniek sú zavíčkované. Nezrelý med (z buniek bez víčok alebo slabšie zavíčkovaný) sa dá vytočiť, ale je nestabilný — zkvasí v nádobe. Úradná kontrola (SZPI) pri predaji medu overuje obsah vody refraktometricky (do 20 % podľa vyhl. 76/2003, optimum do 18 %).\n\nPlástový med (honeycomb) — celé zavíčkované plásty alebo ich výrezy — je najhodnotnejším spôsobom predaja medu: zákazník dostane produkt úplne nezpracovaný ľudskou rukou. Cena plástového medu dosahuje 400–800 Kč/kg.\n\nFermentovaný med (zkvasený med) nemožno predávať ako potravinársky med. Spracováva sa na medovinu alebo hydromel. Obsah alkoholu fermentovaného medu závisí na podmienkach kvasenia — zvyčajne 1–3 % v prirodzene vykvasenej hmote.",
    "related": [
      "zavickovani",
      "medomet-pojem",
      "vytaceni-medu",
      "nektar-pojem"
    ]
  },
  {
    "slug": "dzes",
    "term": "DZES – dobrý poľnohospodársky a environmentálny stav",
    "alias": [
      "DZES"
    ],
    "kategorie": "regulace",
    "shortDef": "DZES je súbor pravidiel na udržanie pôdy v dobrom poľnohospodárskom a environmentálnom stave.",
    "longDef": "DZES predstavuje súbor pravidiel, ktoré poľnohospodári musia dodržiavať, aby udržali pôdu v dobrom poľnohospodárskom a environmentálnom stave. Tieto pravidlá zahŕňajú opatrenia na ochranu pôdy, vody a biologickej rozmanitosti.\n\nDZES je súčasťou podmienenosti, čo je systém, ktorý spája poľnohospodárske dotácie s dodržiavaním určitých štandardov. Dodržiavanie DZES je kľúčové pre získanie priamych platieb a niektorých ďalších dotácií.\n\nNa Slovensku je DZES implementovaný v rámci Spoločnej poľnohospodárskej politiky EÚ a jeho dodržiavanie je kontrolované príslušnými orgánmi.",
    "related": [
      "saps",
      "redistributivni-platba",
      "anc-platba",
      "podminenost"
    ],
    "externalUrl": "cs.wikipedia.org/wiki/Dobrý_zemědělský_a_environmentální_stav",
    "externalLabel": "Wikipedia",
    "faq": [
      {
        "q": "K čemu slouží DZES?",
        "a": "DZES slouží k zajištění, že zemědělská půda je udržována v dobrém stavu pro zemědělství a životní prostředí."
      },
      {
        "q": "Jaká pravidla zahrnuje DZES?",
        "a": "DZES zahrnuje pravidla pro ochranu půdy, vody a biologické rozmanitosti."
      }
    ]
  },
  {
    "slug": "saps",
    "term": "SAPS – jednotná platba na plochu",
    "alias": [
      "SAPS"
    ],
    "kategorie": "dotace",
    "shortDef": "SAPS je systém priamych platieb poľnohospodárom na základe obhospodarovanej plochy.",
    "longDef": "SAPS (Single Area Payment Scheme) je systém priamych platieb poľnohospodárom, ktorý je založený na veľkosti obhospodarovanej poľnohospodárskej plochy. Tento systém je určený pre krajiny Európskej únie, ktoré vstúpili do EÚ po roku 2004.\n\nPlatby v rámci SAPS sú vyplácané ročne a nie sú viazané na konkrétnu produkciu, čo umožňuje poľnohospodárom väčšiu flexibilitu v rozhodovaní o využití pôdy.\n\nNa Slovensku je SAPS kľúčovým nástrojom na podporu poľnohospodárstva a jeho cieľom je zabezpečenie stabilného príjmu pre poľnohospodárov.",
    "related": [
      "dzes",
      "redistributivni-platba",
      "anc-platba",
      "cap-2024"
    ],
    "externalUrl": "cs.wikipedia.org/wiki/Jednotná_platba_na_plochu",
    "externalLabel": "Wikipedia",
    "faq": [
      {
        "q": "Jak se počítá SAPS?",
        "a": "SAPS se počítá na základě velikosti obhospodařované plochy zemědělské půdy."
      },
      {
        "q": "K čemu slouží SAPS?",
        "a": "SAPS slouží k finanční podpoře zemědělců v rámci EU."
      }
    ]
  },
  {
    "slug": "redistributivni-platba",
    "term": "Redistributívna platba",
    "kategorie": "dotace",
    "shortDef": "Redistributívna platba je doplnková platba pre menšie a stredné poľnohospodárske podniky.",
    "longDef": "Redistributívna platba je súčasťou systému priamych platieb, ktorá je určená na podporu menších a stredných poľnohospodárskych podnikov. Táto platba je poskytovaná na prvých hektároch obhospodarovanej pôdy, čo pomáha vyrovnávať rozdiely medzi veľkými a malými farmami.\n\nCieľom redistributívnej platby je podporiť diverzifikáciu poľnohospodárskej produkcie a udržateľnosť menších podnikov, ktoré často čelí väčším ekonomickým výzvam.\n\nNa Slovensku je redistributívna platba implementovaná v rámci Spoločnej poľnohospodárskej politiky EÚ a je kľúčovým nástrojom na podporu menších poľnohospodárov.",
    "related": [
      "saps",
      "dzes",
      "anc-platba",
      "cap-2024"
    ],
    "faq": [
      {
        "q": "Jaký je účel redistributivní platby?",
        "a": "Redistributivní platba podporuje menší a střední zemědělské podniky."
      },
      {
        "q": "Jak se liší redistributivní platba od SAPS?",
        "a": "Redistributivní platba je doplňková k SAPS a zaměřuje se na podporu menších podniků."
      }
    ],
    "alias": []
  },
  {
    "slug": "nitratova-smernice",
    "term": "Nitrátová smernica",
    "kategorie": "regulace",
    "shortDef": "Nitrátová smernica je európska legislatíva zameraná na ochranu vôd pred znečistením dusičnanmi.",
    "longDef": "Nitrátová smernica je súčasťou legislatívy Európskej únie, ktorá sa zameriava na ochranu vodných zdrojov pred znečistením dusičnanmi pochádzajúcimi z poľnohospodárstva. Smernica stanovuje opatrenia na zníženie rizika znečistenia a podporuje udržateľné poľnohospodárske praktiky.\n\nImplementácia smernice zahŕňa identifikáciu zraniteľných oblastí, kde je riziko znečistenia najvyššie, a zavedenie akčných programov na zníženie vstupu dusičnanov do vôd.\n\nNa Slovensku je nitrátová smernica kľúčovým nástrojom na ochranu kvality vody a je implementovaná prostredníctvom národných predpisov a kontrolných mechanizmov.",
    "related": [
      "zranitelne-oblasti",
      "dzes",
      "ekoschemata",
      "podminenost"
    ],
    "externalUrl": "cs.wikipedia.org/wiki/Nitrátová_směrnice",
    "externalLabel": "Wikipedia",
    "faq": [
      {
        "q": "Co je cílem nitrátové směrnice?",
        "a": "Cílem je ochrana vod před znečištěním dusičnany z zemědělských zdrojů."
      },
      {
        "q": "Jaké oblasti pokrývá nitrátová směrnice?",
        "a": "Pokrývá oblasti s vysokým rizikem znečištění vod dusičnany."
      }
    ],
    "alias": []
  },
  {
    "slug": "zranitelne-oblasti",
    "term": "Zraniteľné oblasti (nitrátové)",
    "kategorie": "regulace",
    "shortDef": "Zraniteľné oblasti sú územia, kde je zvýšené riziko znečistenia vôd dusičnanmi.",
    "longDef": "Zraniteľné oblasti, v kontexte nitrátovej smernice, sú územia identifikované ako miesta s vyšším rizikom znečistenia vôd dusičnanmi z poľnohospodárskych zdrojov. Tieto územia sú predmetom zvláštnych opatrení na ochranu kvality vody.\n\nV týchto oblastiach sú zavádzané akčné programy, ktoré zahŕňajú opatrenia na zníženie vstupu dusičnanov do vodných zdrojov, ako je obmedzenie používania hnojív a zavádzanie udržateľných poľnohospodárskych praktík.\n\nNa Slovensku sú zraniteľné oblasti pravidelne aktualizované a kontrolované, aby bola zabezpečená účinná ochrana vodných zdrojov.",
    "related": [
      "nitratova-smernice",
      "dzes",
      "ekoschemata",
      "podminenost"
    ],
    "faq": [
      {
        "q": "Co jsou zranitelné oblasti?",
        "a": "Jsou to území, kde je zvýšené riziko znečištění vod dusičnany."
      },
      {
        "q": "Jak se určují zranitelné oblasti?",
        "a": "Určují se na základě koncentrace dusičnanů ve vodách a rizika jejich znečištění."
      }
    ],
    "alias": []
  },
  {
    "slug": "anc-platba",
    "term": "ANC – platba pre oblasti s prírodnými obmedzeniami",
    "alias": [
      "ANC"
    ],
    "kategorie": "dotace",
    "shortDef": "ANC je platba pre poľnohospodárov v oblastiach s prírodnými obmedzeniami.",
    "longDef": "ANC (Areas with Natural Constraints) je platba určená pre poľnohospodárov, ktorí hospodária v oblastiach s prírodnými obmedzeniami, ako sú horské oblasti alebo regióny s nepriaznivými klimatickými podmienkami. Cieľom tejto platby je kompenzovať dodatočné náklady a straty príjmov spojené s obtiažnymi podmienkami hospodárenia.\n\nPlatby ANC pomáhajú udržiavať poľnohospodársku činnosť v týchto oblastiach, čo prispieva k udržaniu krajiny a biodiverzity. Poľnohospodári v ANC oblastiach musia splniť určité podmienky, aby boli spôsobilí pre túto podporu.\n\nNa Slovensku je ANC platba dôležitým nástrojom na podporu poľnohospodárstva v menej priaznivých oblastiach a je súčasťou širšieho rámca Spoločnej poľnohospodárskej politiky EÚ.",
    "related": [
      "saps",
      "dzes",
      "redistributivni-platba",
      "cap-2024"
    ],
    "faq": [
      {
        "q": "K čemu slouží ANC platba?",
        "a": "ANC platba podporuje zemědělce v oblastech s přírodními omezeními."
      },
      {
        "q": "Jaké oblasti jsou způsobilé pro ANC platbu?",
        "a": "Oblasti s nepříznivými přírodními podmínkami, jako jsou hory nebo sucho."
      }
    ]
  },
  {
    "slug": "ekoschemata",
    "term": "Ekoschémata (ekoplatba)",
    "alias": [
      "ekoplatba"
    ],
    "kategorie": "dotace",
    "shortDef": "Ekoschémata sú finančné podpory zamerané na podporu ekologických poľnohospodárskych postupov.",
    "longDef": "Ekoschémata predstavujú súbor opatrení v rámci Spoločnej poľnohospodárskej politiky EÚ, ktoré poskytujú finančnú podporu poľnohospodárom za implementáciu ekologických a udržateľných poľnohospodárskych postupov. Cieľom je motivovať poľnohospodárov k praktikám, ktoré prispievajú k ochrane životného prostredia, biodiverzity a zlepšeniu kvality pôdy. V praxi sa jedná napríklad o podporu pre ekologické poľnohospodárstvo, agrolesníctvo alebo ochranu vodných zdrojov. Na Slovensku sú ekoschémata súčasťou širšieho rámca poľnohospodárskych dotácií a ich implementácia je koordinovaná Ministerstvom pôdohospodárstva.",
    "related": [
      "podminenost",
      "ozeleneni",
      "prv",
      "cap-2024"
    ],
    "externalUrl": "cs.wikipedia.org/wiki/Ekoplatba",
    "externalLabel": "Wikipedia",
    "faq": [
      {
        "q": "K čemu slouží ekoschémata?",
        "a": "Ekoschémata slouží k podpoře ekologických zemědělských postupů, které přispívají k ochraně životního prostředí."
      },
      {
        "q": "Jaké podmínky musí být splněny pro získání ekoplatby?",
        "a": "Zemědělci musí dodržovat specifické ekologické postupy, které jsou definovány v rámci ekoschémat."
      },
      {
        "q": "Jak se ekoschémata liší od tradičních dotací?",
        "a": "Ekoschémata jsou cíleně zaměřena na ekologické aspekty, zatímco tradiční dotace mohou pokrývat širší spektrum zemědělských potřeb."
      }
    ]
  },
  {
    "slug": "podminenost",
    "term": "Podmienka (kondicionalita)",
    "alias": [
      "kondicionalita"
    ],
    "kategorie": "regulace",
    "shortDef": "Podmienka je systém pravidiel, ktoré musia poľnohospodári dodržiavať pre získanie poľnohospodárskych dotácií.",
    "longDef": "Podmienka, známa tiež ako kondicionalita, je súbor pravidiel a štandardov, ktoré musia poľnohospodári dodržiavať, aby boli spôsobilí pre priame platby a niektoré ďalšie poľnohospodárske dotácie v rámci EÚ. Tieto pravidlá zahŕňajú požiadavky na ochranu životného prostredia, zdravie zvierat a rastlín, bezpečnosť potravín a dobré životné podmienky zvierat. Podmienka je kľúčovou súčasťou Spoločnej poľnohospodárskej politiky a je nástrojom na zabezpečenie udržateľného poľnohospodárstva. Na Slovensku je dodržiavanie podmienky kontrolované príslušnými orgánmi a jej nedodržanie môže viesť k finančným sankciám.",
    "related": [
      "ekoschemata",
      "ozeleneni",
      "prv",
      "gaec"
    ],
    "externalUrl": "cs.wikipedia.org/wiki/Podmíněnost",
    "externalLabel": "Wikipedia",
    "faq": [
      {
        "q": "Co je to podmíněnost v zemědělství?",
        "a": "Podmíněnost je soubor pravidel, které musí zemědělci dodržovat, aby získali zemědělské dotace."
      },
      {
        "q": "Jaké oblasti pokrývá podmíněnost?",
        "a": "Podmíněnost zahrnuje oblasti jako ochrana životního prostředí, dobré životní podmínky zvířat a bezpečnost potravin."
      },
      {
        "q": "Jak se kontroluje dodržování podmíněnosti?",
        "a": "Dodržování podmíněnosti je kontrolováno prostřednictvím inspekcí a auditů."
      }
    ]
  },
  {
    "slug": "zastropovani",
    "term": "Zastropovanie priamych platieb",
    "alias": [
      "zastropovanie"
    ],
    "kategorie": "dotace",
    "shortDef": "Zastropovanie priamych platieb je obmedzenie maximálnej výšky dotácií, ktoré môže jeden poľnohospodársky podnik obdržať.",
    "longDef": "Zastropovanie priamych platieb je mechanizmus v rámci Spoločnej poľnohospodárskej politiky EÚ, ktorý stanovuje maximálnu sumu priamych platieb, ktorú môže jeden poľnohospodársky podnik získať. Cieľom je zabezpečiť spravodlivejšie rozdelenie finančných prostriedkov medzi menšie a stredné poľnohospodárske podniky a zabrániť koncentrácii dotácií vo veľkých podnikoch. Tento systém môže zahŕňať rôzne úrovne redukcie platieb nad určité limity a môže byť kombinovaný s ďalšími opatreniami, ako je redistributívna platba. Na Slovensku sa zastropovanie priamych platieb diskutuje v kontexte národnej implementácie politiky EÚ.",
    "related": [
      "prv",
      "redistributivni-platba",
      "ekoschemata",
      "cap-2024"
    ],
    "externalUrl": "cs.wikipedia.org/wiki/Zastropování",
    "externalLabel": "Wikipedia",
    "faq": [
      {
        "q": "Co znamená zastropování přímých plateb?",
        "a": "Zastropování přímých plateb je omezení maximální částky dotací, které může jeden zemědělský podnik obdržet."
      },
      {
        "q": "Proč se zavádí zastropování plateb?",
        "a": "Cílem zastropování je zajistit spravedlivější rozdělení dotací mezi menší a střední zemědělské podniky."
      },
      {
        "q": "Jak se určuje limit pro zastropování plateb?",
        "a": "Limit je stanoven na základě celkové výše přímých plateb, které podnik obdrží."
      }
    ]
  },
  {
    "slug": "prv",
    "term": "Program rozvoja vidieka (PRV)",
    "alias": [
      "PRV"
    ],
    "kategorie": "dotace",
    "shortDef": "Program rozvoja vidieka je súbor opatrení na podporu rozvoja vidieckych oblastí a poľnohospodárstva.",
    "longDef": "Program rozvoja vidieka (PRV) je kľúčovým nástrojom Spoločnej poľnohospodárskej politiky EÚ, ktorý sa zameriava na podporu rozvoja vidieckych oblastí a zlepšenie konkurencieschopnosti poľnohospodárstva. PRV zahŕňa opatrenia na modernizáciu poľnohospodárskych podnikov, podporu ekologického poľnohospodárstva, rozvoj vidieckej infraštruktúry a zlepšenie kvality života na vidieku. Na Slovensku je PRV implementovaný prostredníctvom Ministerstva pôdohospodárstva a zahŕňa širokú škálu projektov a iniciatív, ktoré podporujú udržateľný rozvoj a inovácie v poľnohospodárskom sektore.",
    "related": [
      "ekoschemata",
      "podminenost",
      "zastropovani",
      "ozeleneni"
    ],
    "externalUrl": "cs.wikipedia.org/wiki/Program_rozvoje_venkova",
    "externalLabel": "Wikipedia",
    "faq": [
      {
        "q": "Co je Program rozvoje venkova?",
        "a": "Program rozvoje venkova je soubor opatření na podporu rozvoje venkovských oblastí a zemědělství."
      },
      {
        "q": "Jaké cíle má Program rozvoje venkova?",
        "a": "Cílem je zlepšit konkurenceschopnost zemědělství, podpořit udržitelné hospodaření a zlepšit kvalitu života ve venkovských oblastech."
      },
      {
        "q": "Jak se financuje Program rozvoje venkova?",
        "a": "Program je financován z prostředků Evropské unie a národních zdrojů."
      }
    ]
  },
  {
    "slug": "platba-pro-mlade-zemedelce",
    "term": "Platba pre mladých poľnohospodárov",
    "kategorie": "dotace",
    "shortDef": "Platba pre mladých poľnohospodárov je finančná podpora určená pre začínajúcich poľnohospodárov do 40 rokov.",
    "longDef": "Platba pre mladých poľnohospodárov je špeciálna forma finančnej podpory v rámci Spoločnej poľnohospodárskej politiky EÚ, ktorá je určená pre mladých poľnohospodárov do 40 rokov. Cieľom tejto platby je podporiť generačnú obmenu v poľnohospodárstve, uľahčiť mladým ľuďom vstup do poľnohospodárskeho sektora a podporiť ich podnikateľské aktivity. Táto podpora je poskytovaná ako priama platba k základnej platbe a môže byť kombinovaná s ďalšími opatreniami, ako je podpora investícií do poľnohospodárskych podnikov. Na Slovensku je táto platba súčasťou národného plánu rozvoja vidieka a je administratívne spravovaná Ministerstvom pôdohospodárstva.",
    "related": [
      "prv",
      "ekoschemata",
      "ozeleneni",
      "redistributivni-platba"
    ],
    "externalUrl": "cs.wikipedia.org/wiki/Platba_pro_mladé_zemědělce",
    "externalLabel": "Wikipedia",
    "faq": [
      {
        "q": "Co je platba pro mladé zemědělce?",
        "a": "Platba pro mladé zemědělce je finanční podpora určená pro začínající zemědělce do 40 let."
      },
      {
        "q": "Jaké jsou podmínky pro získání platby pro mladé zemědělce?",
        "a": "Podmínkou je věk do 40 let a zahájení zemědělské činnosti."
      },
      {
        "q": "Proč se poskytuje platba pro mladé zemědělce?",
        "a": "Platba se poskytuje pro podporu generační obměny v zemědělství."
      }
    ],
    "alias": []
  },
  {
    "slug": "ozeleneni",
    "term": "Ozelenenie (greening)",
    "alias": [
      "greening"
    ],
    "kategorie": "dotace",
    "shortDef": "Ozelenenie je súbor opatrení v poľnohospodárstve zameraných na zlepšenie ekologickej udržateľnosti.",
    "longDef": "Ozelenenie, známe tiež ako greening, je súčasťou Spoločnej poľnohospodárskej politiky EÚ, ktorá zahŕňa povinné ekologické opatrenia, ktoré musia poľnohospodári dodržiavať, aby získali plnú výšku priamych platieb. Tieto opatrenia zahŕňajú diverzifikáciu plodín, udržiavanie trvalých trávnych porastov a vyčlenenie ekologických prioritných oblastí. Cieľom ozelenenia je zlepšiť ekologickú udržateľnosť poľnohospodárstva, chrániť biodiverzitu a prispieť k boju proti zmene klímy. Na Slovensku je ozelenenie implementované v rámci národných stratégií a je kontrolované príslušnými orgánmi.",
    "related": [
      "ekoschemata",
      "podminenost",
      "prv",
      "cap-2024"
    ],
    "externalUrl": "cs.wikipedia.org/wiki/Ozelenění",
    "externalLabel": "Wikipedia",
    "faq": [
      {
        "q": "Co je ozelenění v zemědělství?",
        "a": "Ozelenění je soubor opatření v zemědělství zaměřených na zlepšení ekologické udržitelnosti."
      },
      {
        "q": "Jaké jsou hlavní prvky ozelenění?",
        "a": "Hlavními prvky jsou diverzifikace plodin, udržování trvalých travních porostů a ochrana ekologicky významných ploch."
      },
      {
        "q": "Proč je ozelenění důležité?",
        "a": "Ozelenění přispívá ke snížení negativních dopadů zemědělství na životní prostředí."
      }
    ]
  },
  {
    "slug": "diskovy-podmitac",
    "term": "Diskový podmítač",
    "alias": [
      "diskový kultivátor",
      "diskový pluh"
    ],
    "kategorie": "technologie",
    "shortDef": "Diskový podmítač je poľnohospodársky stroj určený na plytkú podmítku pôdy.",
    "longDef": "Diskový podmítač je poľnohospodársky stroj vybavený radom diskov, ktoré sú usporiadané pod uhlom k smeru jazdy. Slúži na plytkú podmítku pôdy, čo je proces, pri ktorom sa povrchová vrstva pôdy narušuje a mieša. Tento proces pomáha v boji proti burinám, zlepšuje štruktúru pôdy a podporuje rozklad organickej hmoty.\n\nV praxi sa diskové podmítače používajú predovšetkým po zbere, keď je potrebné rýchlo a efektívne spracovať strnisko. Sú vhodné pre rôzne typy pôd a umožňujú rýchlu prácu na veľkých plochách.\n\nNa Slovensku sú diskové podmítače bežne používané na poliach rôznych veľkostí a sú súčasťou moderného poľnohospodárstva, ktoré kladie dôraz na efektivitu a udržateľnosť.",
    "related": [
      "radlickovy-kypric",
      "hloubkove-kypreni",
      "strniste"
    ],
    "externalUrl": "https://cs.wikipedia.org/wiki/Diskový_podmítač",
    "externalLabel": "Wikipedia",
    "faq": [
      {
        "q": "K čemu slouží diskový podmítač?",
        "a": "Diskový podmítač slouží k mělké podmítce půdy, což pomáhá při likvidaci plevelů a zlepšení půdní struktury."
      },
      {
        "q": "Jaký je rozdíl mezi diskovým podmítačem a radličkovým kypřičem?",
        "a": "Diskový podmítač je určen pro mělkou podmítku, zatímco radličkový kypřič je používán pro hlubší zpracování půdy."
      }
    ]
  },
  {
    "slug": "radlickovy-kypric",
    "term": "Radličkový kyprič",
    "alias": [
      "radličkový kultivátor"
    ],
    "kategorie": "technologie",
    "shortDef": "Radličkový kyprič je stroj určený na hlbšie spracovanie pôdy.",
    "longDef": "Radličkový kyprič je poľnohospodársky stroj, ktorý využíva radlice na hlbšie spracovanie pôdy. Je navrhnutý tak, aby narušil pôdnu štruktúru a zlepšil jej prevzdušnenie, čo podporuje rast plodín.\n\nPoužíva sa predovšetkým na prípravu pôdy pred sejbou, keď je potrebné pôdu prekypriť a vyrovnať. Radličkový kyprič je vhodný pre rôzne typy pôd a umožňuje efektívnu prácu na väčších plochách.\n\nV českom poľnohospodárstve je radličkový kyprič často využívaný ako alternatíva k tradičnej orbe, čo prispieva k ochrane pôdnej štruktúry a znižovaniu erózie.",
    "related": [
      "diskovy-podmitac",
      "hloubkove-kypreni",
      "orba",
      "predsetova-priprava"
    ],
    "externalUrl": "https://cs.wikipedia.org/wiki/Radličkový_kypřič",
    "externalLabel": "Wikipedia",
    "faq": [
      {
        "q": "Jak funguje radličkový kypřič?",
        "a": "Radličkový kypřič pracuje pomocí radlic, které pronikají do půdy a zajišťují její provzdušnění a promíchání."
      },
      {
        "q": "Kdy se používá radličkový kypřič?",
        "a": "Radličkový kypřič se používá při přípravě půdy před setím, zejména na jaře a na podzim."
      }
    ]
  },
  {
    "slug": "teleskopicky-manipulator",
    "term": "Teleskopický manipulátor",
    "alias": [
      "teleskopický nakladač"
    ],
    "kategorie": "technologie",
    "shortDef": "Teleskopický manipulátor je stroj určený na manipuláciu s materiálom na farmách.",
    "longDef": "Teleskopický manipulátor je viacúčelový stroj vybavený teleskopickým ramenom, ktoré umožňuje manipuláciu s materiálom na rôznych výškach a vzdialenostiach. Je široko používaný v poľnohospodárstve na nakladanie, vykladanie a prepravu materiálov, ako sú balíky sena, hnojivá alebo stavebné materiály.\n\nVďaka svojej flexibilite a schopnosti pracovať v obmedzených priestoroch je teleskopický manipulátor ideálny pre farmy rôznych veľkostí. Jeho univerzálnosť je daná možnosťou pripojenia rôznych nástrojov, ako sú vidlice, lyžice alebo kliešte.\n\nNa Slovensku je teleskopický manipulátor bežnou súčasťou poľnohospodárskej techniky, ktorá zvyšuje efektivitu a znižuje fyzickú námahu pri manipulácii s materiálmi.",
    "related": [
      "celni-nakladac",
      "auto-steering",
      "telematika",
      "drony-zemedelstvi"
    ],
    "externalUrl": "https://cs.wikipedia.org/wiki/Teleskopický_manipulátor",
    "externalLabel": "Wikipedia",
    "faq": [
      {
        "q": "Co je teleskopický manipulátor?",
        "a": "Teleskopický manipulátor je stroj určený k manipulaci s materiálem, často vybavený teleskopickým ramenem pro dosažení větší výšky."
      },
      {
        "q": "Jaké jsou výhody teleskopického manipulátoru?",
        "a": "Teleskopické manipulátory nabízejí vysokou flexibilitu a dosah, což je činí ideálními pro práci ve stísněných prostorech."
      }
    ]
  },
  {
    "slug": "celni-nakladac",
    "term": "Čelní nakladač",
    "alias": [
      "frontálny nakladač"
    ],
    "kategorie": "technologie",
    "shortDef": "Čelní nakladač je stroj určený na nakladanie a prepravu materiálov.",
    "longDef": "Čelní nakladač je poľnohospodársky stroj vybavený lopatou alebo iným nástrojom na čelnej časti, ktorý slúži na nakladanie, prepravu a vykládanie materiálov. Je široko používaný na farmách na manipuláciu s hnojom, krmivami, zemou a ďalšími materiálmi.\n\nVďaka svojej konštrukcii umožňuje čelní nakladač efektívnu prácu v obmedzených priestoroch a je schopný rýchlo presunúť veľké množstvo materiálu. Jeho univerzálnosť je daná možnosťou pripojenia rôznych nástrojov, čo z neho robí nepostrádateľný stroj na farmách.\n\nNa Slovensku je čelní nakladač bežne používaný na malých aj veľkých farmách a je dôležitou súčasťou moderného poľnohospodárstva, ktoré kladie dôraz na efektivitu a produktivitu.",
    "related": [
      "teleskopicky-manipulator",
      "telematika",
      "gps-rtk",
      "auto-steering"
    ],
    "externalUrl": "https://cs.wikipedia.org/wiki/Čelní_nakladač",
    "externalLabel": "Wikipedia",
    "faq": [
      {
        "q": "Jak se používá čelní nakladač?",
        "a": "Čelní nakladač se používá k nakládání, přemísťování a vykládání materiálů, jako jsou písek, štěrk nebo zemina."
      },
      {
        "q": "Jaký je rozdíl mezi čelním nakladačem a teleskopickým manipulátorem?",
        "a": "Čelní nakladač je primárně určen k nakládání materiálu zepředu, zatímco teleskopický manipulátor má výsuvné rameno pro manipulaci ve výšce."
      }
    ]
  },
  {
    "slug": "rozmetadlo-hnojiv",
    "term": "Rozmetadlo minerálnych hnojív",
    "alias": [
      "rozmetadlo hnojív"
    ],
    "kategorie": "technologie",
    "shortDef": "Rozmetadlo minerálnych hnojív je stroj určený na rovnomerné rozptyľovanie hnojív na poli.",
    "longDef": "Rozmetadlo minerálnych hnojív je poľnohospodársky stroj, ktorý slúži na aplikáciu minerálnych hnojív na pole. Je navrhnuté tak, aby zabezpečilo rovnomerné rozloženie hnojiva na povrchu pôdy, čo je kľúčové pre optimalizáciu rastu plodín.\n\nTento stroj je vybavený mechanizmom, ktorý umožňuje presné dávkovanie a rozptyl hnojiva, čím sa minimalizujú straty a zvyšuje efektivita hnojenia. Rozmetadlo je vhodné pre rôzne typy hnojív, vrátane granulovaných a práškových foriem.\n\nNa Slovensku je rozmetadlo minerálnych hnojív bežne používané v rámci moderného poľnohospodárstva, ktoré kladie dôraz na efektívne využitie vstupov a udržateľnosť produkcie.",
    "related": [
      "cisterna-na-kejdu",
      "npk-hnojivo",
      "mocovina",
      "adjuvant"
    ],
    "externalUrl": "https://cs.wikipedia.org/wiki/Rozmetadlo_minerálních_hnojiv",
    "externalLabel": "Wikipedia",
    "faq": [
      {
        "q": "Jak funguje rozmetadlo minerálních hnojiv?",
        "a": "Rozmetadlo minerálních hnojiv rovnoměrně rozptyluje hnojiva po poli pomocí rotačních disků nebo rozmetacích ramen."
      },
      {
        "q": "Proč je důležitá rovnoměrná aplikace hnojiv?",
        "a": "Rovnoměrná aplikace hnojiv zajišťuje optimální růst plodin a minimalizuje ztráty živin."
      }
    ]
  },
  {
    "slug": "cisterna-na-kejdu",
    "term": "Cisterna na kejdu (aplikátor)",
    "alias": [
      "aplikátor kejdy"
    ],
    "kategorie": "technologie",
    "shortDef": "Cisterna na kejdu je stroj určený na prepravu a aplikáciu kejdy na pole.",
    "longDef": "Cisterna na kejdu, známa tiež ako aplikátor kejdy, je poľnohospodársky stroj používaný na prepravu a aplikáciu kejdy na pole. Kejda je tekuté organické hnojivo, ktoré sa získava ako vedľajší produkt živočíšnej výroby a je bohaté na živiny.\n\nCisterna je vybavená systémom na presnú aplikáciu kejdy, čo umožňuje efektívne využitie živín a minimalizáciu strát. Aplikácia kejdy je dôležitá pre zlepšenie úrodnosti pôdy a podporu rastu plodín.\n\nNa Slovensku sa cisterny na kejdu používajú predovšetkým na farmách s intenzívnou živočíšnou výrobou, kde je potrebné efektívne využívať dostupné organické hnojivo a zabezpečovať udržateľné hospodárenie s pôdou.",
    "related": [
      "rozmetadlo-hnojiv",
      "digestat",
      "organicka-hmota",
      "strniste"
    ],
    "externalUrl": "https://cs.wikipedia.org/wiki/Cisterna_na_kejdu",
    "externalLabel": "Wikipedia",
    "faq": [
      {
        "q": "K čemu slouží cisterna na kejdu?",
        "a": "Cisterna na kejdu slouží k přepravě a aplikaci kejdy na pole jako organického hnojiva."
      },
      {
        "q": "Jak se aplikuje kejda na pole?",
        "a": "Kejda se aplikuje na pole pomocí rozstřikovacích trysek nebo injektorů, které ji zapravují do půdy."
      }
    ]
  },
  {
    "slug": "svinovaci-lis",
    "term": "Svinovací lis (lis na balíky)",
    "alias": [
      "lis na balíky",
      "balíkovač"
    ],
    "kategorie": "technologie",
    "shortDef": "Svinovací lis je poľnohospodársky stroj určený na lisovanie a balenie píce do valcových balíkov.",
    "longDef": "Svinovací lis, známy aj ako lis na balíky, je poľnohospodársky stroj používaný na lisovanie píce, ako je seno alebo slama, do kompaktných valcových balíkov. Tieto balíky sa ľahko skladujú a prepravujú, čo zlepšuje efektivitu manipulácie s krmivom.\n\nStroj funguje tak, že zbiera pícu z poľa a pomocou rotačných valcov ju stláča do pevného balíka, ktorý je následne obalený sieťou alebo fóliou. Tento proces pomáha chrániť pícu pred vlhkosťou a stratou živín.\n\nNa Slovensku sa svinovacie lisy používajú najmä v oblastiach s intenzívnym chovom dobytka, kde je potrebné efektívne spracovávať veľké množstvo píce na krmné účely.",
    "related": [
      "teleskopicky-manipulator",
      "cisterna-na-kejdu",
      "rozmetadlo-hnojiv",
      "hloubkove-kypreni"
    ],
    "externalUrl": "https://cs.wikipedia.org/wiki/Svinovac%C3%AD_lis",
    "externalLabel": "Wikipedia",
    "faq": [
      {
        "q": "Jak funguje svinovací lis?",
        "a": "Svinovací lis sbírá píci z pole, stlačuje ji do válcového tvaru a obaluje balík sítí nebo fólií."
      },
      {
        "q": "K čemu slouží svinovací lis?",
        "a": "Slouží k efektivnímu balení píce pro uskladnění a následné použití jako krmivo."
      },
      {
        "q": "Jaký je rozdíl mezi svinovacím a lisem na hranaté balíky?",
        "a": "Svinovací lis vytváří válcové balíky, zatímco lis na hranaté balíky produkuje balíky obdélníkového tvaru."
      }
    ]
  },
  {
    "slug": "samochodna-rezacka",
    "term": "Samojízdna rezačka",
    "alias": [
      "rezačka",
      "sklízecí rezačka"
    ],
    "kategorie": "technologie",
    "shortDef": "Samojízdna rezačka je stroj určený na zber a rezanie píce na siláž.",
    "longDef": "Samojízdna rezačka je poľnohospodársky stroj, ktorý zbiera a reže pícu, napríklad kukuricu alebo trávy, na siláž. Je vybavená vlastným pohonom a obvykle obsahuje sekací a drviaci mechanizmus, ktorý zabezpečuje jemné nasekanie materiálu.\n\nRezačka je kľúčová pre výrobu kvalitnej siláže, čo je dôležitý krmný produkt pre dobytok. Proces zberu a rezania je rýchly a efektívny, čo minimalizuje straty živín počas zberu.\n\nNa Slovensku sú samojízdne rezačky často využívané v kombinácii s ďalšími zberovými strojmi a technikami na optimalizáciu produkcie krmív v živočíšnej výrobe.",
    "related": [
      "svinovaci-lis",
      "rozmetadlo-hnojiv",
      "cisterna-na-kejdu",
      "hloubkove-kypreni"
    ],
    "externalUrl": "https://cs.wikipedia.org/wiki/Samoj%C3%ADzdn%C3%A1_%C5%99eza%C4%8Dka",
    "externalLabel": "Wikipedia",
    "faq": [
      {
        "q": "Jak funguje samojízdná řezačka?",
        "a": "Samojízdná řezačka sklízí píci a současně ji řeže na malé kousky pro silážování."
      },
      {
        "q": "K čemu slouží samojízdná řezačka?",
        "a": "Slouží k efektivní sklizni a přípravě píce pro výrobu siláže."
      },
      {
        "q": "Jaký je rozdíl mezi samojízdnou a taženou řezačkou?",
        "a": "Samojízdná řezačka má vlastní pohon, zatímco tažená je připojena k traktoru."
      }
    ]
  },
  {
    "slug": "pneumaticky-seci-stroj",
    "term": "Pneumatický secí stroj",
    "alias": [
      "pneumatická sečka",
      "sečka"
    ],
    "kategorie": "technologie",
    "shortDef": "Pneumatický secí stroj je zariadenie na presné sekanie semien pomocou vzduchového prúdenia.",
    "longDef": "Pneumatický secí stroj je poľnohospodárske zariadenie, ktoré používa prúdenie vzduchu na presné umiestnenie semien do pôdy. Táto technológia umožňuje rovnomerné rozloženie semien na poli, čo zlepšuje klíčivosť a uľahčuje následnú starostlivosť o plodiny.\n\nStroj je vybavený systémom trysiek a hadíc, ktoré transportujú semena z násypky do seťového lôžka. Tento systém je riadený elektronicky, čo umožňuje nastaviť rôzne parametre sekania podľa potrieb konkrétnej plodiny.\n\nNa Slovensku sú pneumatické secie stroje obľúbené pre svoju efektivitu a presnosť, najmä pri sekaní plodín s vysokou hodnotou, ako je kukurica alebo repka.",
    "related": [
      "radlickovy-kypric",
      "hloubkove-kypreni",
      "predsetova-priprava",
      "osevni-postup"
    ],
    "externalUrl": "https://cs.wikipedia.org/wiki/Pneumatick%C3%BD_sec%C3%AD_stroj",
    "externalLabel": "Wikipedia",
    "faq": [
      {
        "q": "Jak funguje pneumatický secí stroj?",
        "a": "Pneumatický secí stroj využívá proudění vzduchu k přesnému umístění semen do půdy."
      },
      {
        "q": "K čemu slouží pneumatický secí stroj?",
        "a": "Slouží k přesnému setí semen různých plodin, což zvyšuje efektivitu výsevu."
      },
      {
        "q": "Jaký je rozdíl mezi pneumatickým a mechanickým secím strojem?",
        "a": "Pneumatický secí stroj používá vzduch, zatímco mechanický využívá mechanické pohyby pro setí."
      }
    ]
  },
  {
    "slug": "plecka",
    "term": "Plečka (medziriadková kultivácia)",
    "alias": [
      "medziriadková plečka",
      "kultivátor"
    ],
    "kategorie": "technologie",
    "shortDef": "Plečka je poľnohospodársky nástroj používaný na medziriadkovú kultiváciu pôdy.",
    "longDef": "Plečka, známa tiež ako medziriadkový kultivátor, je nástroj používaný na obrábanie pôdy medzi riadkami plodín. Tento proces pomáha odstraňovať burinu, zlepšuje prevzdušnenie pôdy a podporuje zdravý rast rastlín.\n\nPlečky môžu byť mechanické alebo automatizované a často sú vybavené rôznymi typmi radlíc alebo kotúčov, ktoré umožňujú prispôsobenie rôznym typom pôdy a plodín.\n\nV Českej republike sú plečky bežne používané v rôznych typoch poľnohospodárstva, od malých fariem po veľké komerčné podniky, a sú kľúčové pre udržanie optimálnych podmienok pre rast plodín.",
    "related": [
      "radlickovy-kypric",
      "hloubkove-kypreni",
      "predsetova-priprava",
      "osevni-postup"
    ],
    "externalUrl": "https://cs.wikipedia.org/wiki/Ple%C4%8Dka",
    "externalLabel": "Wikipedia",
    "faq": [
      {
        "q": "Jak funguje plečka?",
        "a": "Plečka narušuje půdu mezi řádky plodin, čímž podporuje provzdušnění a likvidaci plevelů."
      },
      {
        "q": "K čemu slouží plečka?",
        "a": "Slouží k meziřádkové kultivaci půdy a k odstranění plevelů."
      },
      {
        "q": "Jaký je rozdíl mezi plečkou a rotavátorem?",
        "a": "Plečka je určena pro meziřádkovou kultivaci, zatímco rotavátor zpracovává celou plochu půdy."
      }
    ]
  },
  {
    "slug": "planetova-prevodovka",
    "term": "Planetová prevodovka",
    "alias": [
      "planetárna prevodovka",
      "epicyklická prevodovka"
    ],
    "kategorie": "pohon",
    "shortDef": "Planetová prevodovka je typ prevodového mechanizmu využívajúceho planetové súkolie na prenos točivého momentu.",
    "longDef": "Planetová prevodovka je zložitý prevodový systém, ktorý využíva planetové súkolie. Tento mechanizmus sa skladá z centrálneho kola (slnko), planetových kolies a vonkajšieho ozubeného venca. Planetová prevodovka umožňuje efektívny prenos točivého momentu a zmenu rýchlosti.\n\nVďaka svojej kompaktné konštrukcii a schopnosti prenášať vysoké točivé momenty je tento typ prevodovky široko používaný v automobilovom priemysle, ťažkých strojoch a poľnohospodárskej technike.\n\nNa Slovensku sú planetové prevodovky často využívané v traktore a ďalších poľnohospodárskych strojoch, kde je dôležitá spoľahlivosť a efektivita prenosu výkonu.",
    "related": [
      "cvt-prevodovka",
      "powershift",
      "auto-steering",
      "common-rail"
    ],
    "externalUrl": "https://cs.wikipedia.org/wiki/Planetov%C3%A1_p%C5%99evodovka",
    "externalLabel": "Wikipedia",
    "faq": [
      {
        "q": "Jak funguje planetová převodovka?",
        "a": "Planetová převodovka přenáší točivý moment pomocí soukolí, které se otáčí kolem centrálního kola."
      },
      {
        "q": "K čemu slouží planetová převodovka?",
        "a": "Slouží k dosažení vysokého převodového poměru v kompaktním prostoru."
      },
      {
        "q": "Jaký je rozdíl mezi planetovou a běžnou převodovkou?",
        "a": "Planetová převodovka umožňuje kompaktní přenos točivého momentu a změnu rychlosti v menším prostoru než běžná převodovka."
      }
    ]
  },
  {
    "slug": "dvouhmotovy-setrvacnik",
    "term": "Dvouhmotový setrvačník",
    "alias": [
      "DMF",
      "dvouhmotový setrvačník"
    ],
    "kategorie": "pohon",
    "shortDef": "Dvouhmotový setrvačník je zariadenie určené na tlmenie vibrácií v pohonných systémoch.",
    "longDef": "Dvouhmotový setrvačník (DMF) je zložitý mechanický prvok, ktorý pomáha tlmiť vibrácie a ráz v pohonnom systéme vozidiel. Skladá sa z dvoch setrvačníkových hmôt spojených pružinovým systémom, ktorý absorbuje a tlmí vibrácie.\n\nPoužitie dvouhmotového setrvačníka zlepšuje komfort jazdy, znižuje hluk a zvyšuje životnosť prevodovky a ďalších súčastí pohonného systému. Je obzvlášť dôležitý u vozidiel s manuálnou prevodovkou.\n\nNa Slovensku sú dvouhmotové setrvačníky bežne používané v automobilovom priemysle, najmä u osobných a ľahkých úžitkových vozidiel, kde je dôraz na komfort a efektivitu pohonu.",
    "related": [
      "planetova-prevodovka",
      "powershift",
      "common-rail",
      "emisni-normy-stage"
    ],
    "externalUrl": "https://cs.wikipedia.org/wiki/Dvouhmotov%C3%BD_setrva%C4%8Dn%C3%ADk",
    "externalLabel": "Wikipedia",
    "faq": [
      {
        "q": "Jak funguje dvouhmotový setrvačník?",
        "a": "Dvouhmotový setrvačník tlumí vibrace motoru pomocí dvou na sobě nezávislých hmot spojených pružinami."
      },
      {
        "q": "K čemu slouží dvouhmotový setrvačník?",
        "a": "Slouží k tlumení vibrací a ke snížení hluku v pohonném systému vozidla."
      },
      {
        "q": "Jaký je rozdíl mezi dvouhmotovým a klasickým setrvačníkem?",
        "a": "Dvouhmotový setrvačník lépe tlumí vibrace díky své konstrukci, zatímco klasický je jednodušší a levnější."
      }
    ]
  },
  {
    "slug": "load-sensing",
    "term": "Load-sensing hydraulika",
    "alias": [
      "load sensing"
    ],
    "kategorie": "pohon",
    "shortDef": "Load-sensing hydraulika je systém, ktorý automaticky prispôsobuje prietok oleja požiadavkám na výkon.",
    "longDef": "Load-sensing hydraulika je technológia používaná v hydraulických systémoch, ktorá umožňuje automatické prispôsobenie prietoku a tlaku oleja aktuálnym potrebám. Tento systém zabezpečuje efektívne využitie energie a minimalizuje straty. \n\nSystém funguje tak, že sníma tlak v hydraulickom okruhu a na základe toho upravuje výkon čerpadla. To umožňuje optimalizáciu výkonu a zníženie spotreby paliva, čo je obzvlášť výhodné v poľnohospodárskych strojoch, kde sa často menia pracovné podmienky. \n\nNa Slovensku sa load-sensing hydraulika bežne používa v moderných traktoroch a kombajnoch, kde prispieva k vyššej efektivite a zníženiu prevádzkových nákladov.",
    "related": [
      "hydrostat",
      "cvt-prevodovka",
      "powershift",
      "auto-steering"
    ],
    "externalUrl": "cs.wikipedia.org/wiki/Load_sensing",
    "externalLabel": "Wikipedia",
    "faq": [
      {
        "q": "Jak funguje load-sensing hydraulika?",
        "a": "Load-sensing hydraulika funguje tak, že snímá tlakový rozdíl a přizpůsobuje průtok oleje aktuálním potřebám systému."
      },
      {
        "q": "Jaké jsou výhody load-sensing systému?",
        "a": "Výhody zahrnují úsporu energie, snížení opotřebení komponent a vyšší efektivitu hydraulického systému."
      }
    ]
  },
  {
    "slug": "intercooler",
    "term": "Intercooler (mezichladič)",
    "alias": [
      "mezichladič"
    ],
    "kategorie": "pohon",
    "shortDef": "Intercooler je zariadenie, ktoré ochladzuje stlačený vzduch medzi turbodmychadlom a motorom.",
    "longDef": "Intercooler, známy tiež ako mezichladič, je zariadenie používané v preplňovaných motoroch na ochladenie vzduchu stlačeného turbodmychadlom alebo kompresorom. Ochladený vzduch má vyššiu hustotu, čo zvyšuje účinnosť spaľovania a výkon motora. \n\nIntercooler je obvykle umiestnený medzi turbodmychadlom a sacím potrubím motora. Jeho hlavnou funkciou je znížiť teplotu vzduchu, čo pomáha predchádzať klepaniu motora a zvyšuje jeho životnosť. \n\nV poľnohospodárskych strojoch sa intercoolery používajú na optimalizáciu výkonu motorov, čo je dôležité pre efektívny prevádzku pri vysokej záťaži. Na Slovensku sú bežnou súčasťou moderných traktorov a zberacích strojov.",
    "related": [
      "vgt-turbo",
      "cvt-prevodovka",
      "common-rail",
      "emisni-normy-stage"
    ],
    "externalUrl": "cs.wikipedia.org/wiki/Intercooler",
    "externalLabel": "Wikipedia",
    "faq": [
      {
        "q": "K čemu slouží intercooler?",
        "a": "Intercooler slouží k ochlazování stlačeného vzduchu z turbodmychadla, což zvyšuje účinnost motoru."
      },
      {
        "q": "Jaký je rozdíl mezi vzduchovým a vodním intercoolerem?",
        "a": "Vzduchový intercooler využívá okolní vzduch k chlazení, zatímco vodní intercooler používá chladicí kapalinu."
      }
    ]
  },
  {
    "slug": "vgt-turbo",
    "term": "Variabilná geometria turba (VGT)",
    "alias": [
      "VGT",
      "variabilné turbo"
    ],
    "kategorie": "pohon",
    "shortDef": "Variabilná geometria turba umožňuje optimalizáciu výkonu turbodmychadla v širokom spektre otáčok motora.",
    "longDef": "Variabilná geometria turba (VGT) je technológia používaná v turbodmychadlách, ktorá umožňuje meniť uhol lopatiek turbodmychadla v závislosti na otáčkach motora. Tým sa optimalizuje tlak a prietok vzduchu, čo zlepšuje výkon a účinnosť motora. \n\nVGT zabezpečuje lepšiu odozvu motora pri nízkych otáčkach a vyšší výkon pri vysokých otáčkach. Táto technológia je obzvlášť užitočná v poľnohospodárskych strojoch, kde je potrebné rýchlo reagovať na zmeny zaťaženia. \n\nNa Slovensku je VGT bežne používaná v moderných traktoroch a zberacích strojoch, kde prispieva k efektívnemu využitiu paliva a zníženiu emisií.",
    "related": [
      "intercooler",
      "common-rail",
      "emisni-normy-stage",
      "auto-steering"
    ],
    "externalUrl": "cs.wikipedia.org/wiki/Variabilní_geometrie_turba",
    "externalLabel": "Wikipedia",
    "faq": [
      {
        "q": "Jak funguje variabilní geometrie turba?",
        "a": "Variabilní geometrie turba mění úhel lopatek v turbodmychadle, aby optimalizovala průtok výfukových plynů."
      },
      {
        "q": "Jaké jsou výhody VGT oproti tradičnímu turbu?",
        "a": "VGT nabízí lepší odezvu motoru a vyšší účinnost v širokém rozsahu otáček."
      }
    ]
  },
  {
    "slug": "posilovac-rizeni",
    "term": "Hydraulický posilovač riadenia",
    "alias": [
      "posilovač riadenia"
    ],
    "kategorie": "pohon",
    "shortDef": "Hydraulický posilovač riadenia uľahčuje ovládanie vozidiel znížením sily potrebnej na otáčanie volantom.",
    "longDef": "Hydraulický posilovač riadenia je systém, ktorý využíva hydraulický tlak na uľahčenie riadenia vozidiel. Tento systém znižuje fyzickú námahu potrebnú na otáčanie volantom, čo je obzvlášť užitočné u ťažkých poľnohospodárskych strojov. \n\nFunguje tak, že hydraulické čerpadlo poháňané motorom vytvára tlak, ktorý pomáha otáčať volantom. To umožňuje jednoduchšie manévrovanie a zvyšuje komfort obsluhy. \n\nNa Slovensku je hydraulický posilovač riadenia štandardnou výbavou väčšiny moderných traktorov a poľnohospodárskych strojov, čo prispieva k efektivite a bezpečnosti pri práci na poli.",
    "related": [
      "load-sensing",
      "cvt-prevodovka",
      "auto-steering",
      "teleskopicky-manipulator"
    ],
    "externalUrl": "cs.wikipedia.org/wiki/Posilovač_řízení",
    "externalLabel": "Wikipedia",
    "faq": [
      {
        "q": "Jak funguje hydraulický posilovač řízení?",
        "a": "Hydraulický posilovač řízení využívá tlak oleje k usnadnění otáčení volantem."
      },
      {
        "q": "Jaké jsou výhody hydraulického posilovače řízení?",
        "a": "Výhody zahrnují snížení fyzické námahy řidiče a lepší ovladatelnost vozidla."
      }
    ]
  },
  {
    "slug": "predni-vyvodovy-hridel",
    "term": "Predný vývodový hriadeľ",
    "alias": [
      "predný PTO"
    ],
    "kategorie": "pohon",
    "shortDef": "Predný vývodový hriadeľ je zariadenie umožňujúce prenos výkonu z traktora na predné prídavné zariadenia.",
    "longDef": "Predný vývodový hriadeľ (PTO) je mechanický prvok traktora, ktorý umožňuje prenos výkonu na predné prídavné zariadenia, ako sú kosačky alebo snehové frézy. Tento hriadeľ zvyšuje univerzálnosť traktora a umožňuje efektívne využitie rôznych nástrojov.\n\nPredný PTO je obvykle poháňaný motorom traktora a môže byť zapínaný a vypínaný podľa potreby. To umožňuje flexibilné použitie rôznych nástrojov bez nutnosti meniť základnú konfiguráciu traktora.\n\nNa Slovensku je predný vývodový hriadeľ bežne využívaný v poľnohospodárstve a komunálnych službách, kde prispieva k efektivite a produktivite práce.",
    "related": [
      "load-sensing",
      "teleskopicky-manipulator",
      "celni-nakladac",
      "auto-steering"
    ],
    "externalUrl": "cs.wikipedia.org/wiki/Vývodový_hřídel",
    "externalLabel": "Wikipedia",
    "faq": [
      {
        "q": "K čemu slouží přední vývodový hřídel?",
        "a": "Přední vývodový hřídel přenáší výkon z traktoru na přední přídavná zařízení, jako jsou sekačky nebo sněhové frézy."
      },
      {
        "q": "Jaký je rozdíl mezi předním a zadním vývodovým hřídelem?",
        "a": "Přední vývodový hřídel je umístěn na přední části traktoru, zatímco zadní je vzadu. Výkon obou hřídelů závisí na konstrukci traktoru."
      }
    ]
  },
  {
    "slug": "smykovani",
    "term": "Smykovanie",
    "alias": [
      "smyk"
    ],
    "kategorie": "agrotechnika",
    "shortDef": "Smykovanie je jav, kedy kolesá alebo pásy traktora strácajú priľnavosť k povrchu pôdy.",
    "longDef": "Smykovanie je jav, ktorý nastáva, keď kolesá alebo pásy traktora strácajú priľnavosť k povrchu pôdy, čo vedie k neefektívnemu prenosu sily a zvýšenej spotrebe paliva. Tento jav je bežný na mokrých alebo sypkých pôdach. \n\nSmykovanie môže byť merané a kontrolované pomocou rôznych techník, ako je úprava tlaku v pneumatikách alebo použitie závaží. Správne riadenie smykovania je kľúčové pre minimalizáciu opotrebovania pneumatík a zvýšenie efektivity práce. \n\nNa Slovensku je smykovanie sledované najmä v kontexte optimalizácie poľnohospodárskych operácií, kde môže mať významný vplyv na produktivitu a prevádzkové náklady.",
    "related": [
      "load-sensing",
      "auto-steering",
      "hloubkove-kypreni",
      "predsetova-priprava"
    ],
    "externalUrl": "cs.wikipedia.org/wiki/Smykování",
    "externalLabel": "Wikipedia",
    "faq": [
      {
        "q": "Co je smykování u traktorů?",
        "a": "Smykování je jev, kdy kola nebo pásy traktoru ztrácejí přilnavost k povrchu půdy, což může snižovat efektivitu práce."
      },
      {
        "q": "Jak lze minimalizovat smykování?",
        "a": "Minimalizovat smykování lze správným tlakem v pneumatikách a použitím vhodného typu pneumatik nebo pásů."
      }
    ]
  },
  {
    "slug": "valeni",
    "term": "Válenie",
    "kategorie": "agrotechnika",
    "shortDef": "Válenie je agrotechnická operácia, ktorá zabezpečuje utuženie povrchu pôdy po siatí.",
    "longDef": "Válenie je proces, pri ktorom sa pomocou valcov utužuje povrch pôdy. Táto operácia sa vykonáva po siatí, aby sa zabezpečil lepší kontakt semien s pôdou a podporila klíčivosť. Válenie tiež pomáha srovnať povrch pôdy a zlepšiť kapilaritu, čo uľahčuje prístup vody k semenám.\n\nV praxi sa používajú rôzne typy valcov, vrátane hladkých, prstových alebo kruhových, v závislosti na type pôdy a plodín. Válenie je dôležité najmä na ľahkých a piesčitých pôdach, kde pomáha zabrániť stratám vlhkosti.\n\nNa Slovensku je válenie bežnou súčasťou agrotechnických postupov, najmä pri pestovaní obilnín a ďalších plodín vyžadujúcich rovnomerný povrch pôdy pre optimálny rast.",
    "related": [
      "predsetova-priprava",
      "setove-luzko",
      "utuzeni-pudy",
      "diskovy-podmitac"
    ],
    "externalUrl": "https://cs.wikipedia.org/wiki/V%C3%A1len%C3%AD",
    "externalLabel": "Wikipedia",
    "faq": [
      {
        "q": "K čemu slouží válení půdy?",
        "a": "Válení slouží k utužení povrchu půdy po setí, čímž se zlepšuje kontakt semen s půdou a zajišťuje rovnoměrné vzcházení."
      },
      {
        "q": "Kdy se provádí válení půdy?",
        "a": "Válení se provádí po setí, kdy je potřeba zlepšit kontakt semen s půdou."
      }
    ],
    "alias": []
  },
  {
    "slug": "vysevek",
    "term": "Výsevok",
    "kategorie": "agrotechnika",
    "shortDef": "Výsevok je množstvo osiva použitého na jednotku plochy pri siatí.",
    "longDef": "Výsevok označuje množstvo osiva, ktoré je vyseté na určitú plochu, obvykle vyjadrené v kilogramoch na hektár. Správne určenie výsevku je kľúčové pre dosiahnutie optimálnej hustoty porastu a tým aj maximálneho výnosu.\n\nVýsevok sa líši podľa druhu plodiny, podmienok pôdy a klimatických podmienok. Napríklad obilniny majú obvykle vyšší výsevok než olejniny. Výsevok je tiež ovplyvnený kvalitou osiva a jeho klíčivosťou.\n\nNa Slovensku sa odporúčané výsevky líšia podľa regiónu a typu pôdy, pričom poľnohospodári často využívajú odporúčania agronomických poradcov alebo výsledky pokusov z výskumných staníc.",
    "related": [
      "setove-luzko",
      "predsetova-priprava",
      "pneumaticky-seci-stroj",
      "osevni-postup"
    ],
    "externalUrl": "https://cs.wikipedia.org/wiki/V%C3%BDsevek",
    "externalLabel": "Wikipedia",
    "faq": [
      {
        "q": "Jak se počítá výsevek?",
        "a": "Výsevek se počítá jako množství osiva potřebného na jednotku plochy, obvykle v kg/ha."
      },
      {
        "q": "Proč je důležitý správný výsevek?",
        "a": "Správný výsevek zajišťuje optimální hustotu porostu, což ovlivňuje výnos a kvalitu sklizně."
      }
    ],
    "alias": []
  },
  {
    "slug": "hloubkove-kypreni",
    "term": "Hĺbkové kyprenie (podrývanie)",
    "kategorie": "agrotechnika",
    "shortDef": "Hĺbkové kyprenie je agrotechnická operácia zameraná na zlepšenie štruktúry pôdy a jej prevzdušnenie.",
    "longDef": "Hĺbkové kyprenie, tiež známe ako podrývanie, je proces, pri ktorom sa pôda kyprí do väčšej hĺbky bez obracania. Tento postup zlepšuje prevzdušnenie pôdy, odvodnenie a podporuje rozvoj koreňového systému plodín.\n\nPodrývanie sa vykonáva špeciálnymi strojmi, ktoré narušujú zhutnené vrstvy pôdy, čo je obzvlášť dôležité na ťažkých pôdach alebo v oblastiach s vysokým rizikom zhutnenia. Zlepšenie štruktúry pôdy vedie k lepšej infiltrácii vody a zníženiu erózie.\n\nNa Slovensku je hĺbkové kyprenie využívané najmä v oblastiach s intenzívnym poľnohospodárstvom, kde je potrebné zlepšiť fyzikálne vlastnosti pôdy a podporiť udržateľnú produkciu.",
    "related": [
      "predsetova-priprava",
      "utuzeni-pudy",
      "orba",
      "diskovy-podmitac"
    ],
    "externalUrl": "https://cs.wikipedia.org/wiki/Podr%C3%BDv%C3%A1n%C3%AD",
    "externalLabel": "Wikipedia",
    "faq": [
      {
        "q": "K čemu slouží hloubkové kypření?",
        "a": "Hloubkové kypření zlepšuje strukturu půdy a její provzdušnění, což podporuje růst kořenů."
      },
      {
        "q": "Jaký je rozdíl mezi hloubkovým kypřením a oráním?",
        "a": "Hloubkové kypření provzdušňuje půdu bez jejího obracení, zatímco orání půdu obrací."
      }
    ],
    "alias": []
  },
  {
    "slug": "predsetova-priprava",
    "term": "Predseťová príprava",
    "kategorie": "agrotechnika",
    "shortDef": "Predseťová príprava je súbor operácií zameraných na úpravu pôdy pred siatím.",
    "longDef": "Predseťová príprava zahŕňa rôzne agrotechnické operácie, ktoré pripravujú pôdu na siatie plodín. Cieľom je vytvoriť optimálne podmienky pre klíčenie semien a rast mladých rastlín.\n\nTento proces môže zahŕňať kyprenie, vyrovnanie povrchu, odstránenie burín a zabezpečenie správnej štruktúry pôdy. Využívajú sa rôzne nástroje a stroje, ako sú pluhy, kompaktomaty a valce.\n\nNa Slovensku je predseťová príprava kľúčovou súčasťou poľnohospodárskych postupov, pričom jej konkrétna podoba sa líši podľa typu plodiny, pôdnych a klimatických podmienok.",
    "related": [
      "setove-luzko",
      "valeni",
      "diskovy-podmitac",
      "hloubkove-kypreni"
    ],
    "externalUrl": "https://cs.wikipedia.org/wiki/P%C5%99edse%C5%A5ov%C3%A1_p%C5%99%C3%ADprava",
    "externalLabel": "Wikipedia",
    "faq": [
      {
        "q": "Co zahrnuje předseťová příprava půdy?",
        "a": "Předseťová příprava zahrnuje operace jako orba, vláčení a válení k vytvoření optimálního seťového lůžka."
      },
      {
        "q": "Proč je důležitá předseťová příprava?",
        "a": "Zajišťuje správnou strukturu půdy pro klíčení a růst semen."
      }
    ],
    "alias": []
  },
  {
    "slug": "setove-luzko",
    "term": "Seťové lôžko",
    "kategorie": "agrotechnika",
    "shortDef": "Seťové lôžko je pripravený povrch pôdy, na ktorý sa vysievajú semena.",
    "longDef": "Seťové lôžko je špeciálne pripravená vrstva pôdy, ktorá poskytuje optimálne podmienky pre klíčenie a rast semien. Jeho kvalita je kľúčová pre dosiahnutie rovnomerného a rýchleho vzchádzania plodín.\n\nPríprava seťového lôžka zahŕňa vyrovnanie povrchu, odstránenie hrúd a zabezpečenie správnej štruktúry pôdy. Dôležitá je tiež kontrola vlhkosti a teploty pôdy, ktoré ovplyvňujú klíčivosť.\n\nNa Slovensku je príprava seťového lôžka štandardnou praxou v poľnohospodárstve, pričom sa používajú rôzne techniky a nástroje podľa typu plodiny a pôdnych podmienok.",
    "related": [
      "predsetova-priprava",
      "valeni",
      "utuzeni-pudy",
      "vysevek"
    ],
    "externalUrl": "https://cs.wikipedia.org/wiki/Se%C5%A5ov%C3%A9_l%C5%AF%C5%BEko",
    "externalLabel": "Wikipedia",
    "faq": [
      {
        "q": "Jak se připravuje seťové lůžko?",
        "a": "Seťové lůžko se připravuje pomocí operací jako orba, vláčení a válení, aby bylo rovnoměrné a dobře utužené."
      },
      {
        "q": "Proč je důležité seťové lůžko?",
        "a": "Zajišťuje optimální podmínky pro klíčení semen a růst rostlin."
      }
    ],
    "alias": []
  },
  {
    "slug": "kapilarita-pudy",
    "term": "Kapilarita pôdy",
    "kategorie": "agrotechnika",
    "shortDef": "Kapilarita pôdy je schopnosť pôdy prenášať vodu v jemných póroch proti gravitácii.",
    "longDef": "Kapilarita pôdy sa týka schopnosti pôdy prenášať vodu v jemných póroch a kapilárach. Tento jav je dôležitý pre zabezpečenie dostupnosti vody pre rastliny, najmä v období sucha.\n\nKapilarita je ovplyvnená štruktúrou pôdy, veľkosťou a distribúciou pórovitosti. Jemnozrnné pôdy, ako sú ílovité, majú vyššiu kapilaritu než hrubozrnné, ako sú piesčité.\n\nNa Slovensku je kapilarita pôdy dôležitým faktorom pri plánovaní zavlažovania a hospodárenia s vodou, najmä v oblastiach s nepravidelnými zrážkami.",
    "related": [
      "utuzeni-pudy",
      "orba",
      "predsetova-priprava",
      "valeni"
    ],
    "externalUrl": "https://cs.wikipedia.org/wiki/Kapilarita_p%C5%AFdy",
    "externalLabel": "Wikipedia",
    "faq": [
      {
        "q": "Co je kapilarita půdy?",
        "a": "Kapilarita půdy je schopnost půdy přenášet vodu v jemných pórech proti gravitaci."
      },
      {
        "q": "Jak kapilarita ovlivňuje zemědělství?",
        "a": "Kapilarita ovlivňuje dostupnost vody pro rostliny a tím i jejich růst."
      }
    ],
    "alias": []
  },
  {
    "slug": "mineralizace-pudy",
    "term": "Mineralizácia organickej hmoty",
    "alias": [
      "mineralizácia pôdy"
    ],
    "kategorie": "agrotechnika",
    "shortDef": "Mineralizácia organickej hmoty je proces premeny organických látok na anorganické formy.",
    "longDef": "Mineralizácia organickej hmoty je biologický proces, pri ktorom mikroorganizmy rozkladajú organické látky v pôde na anorganické formy, ako sú oxid uhličitý, voda a minerálne živiny. Tento proces je kľúčový pre uvoľňovanie živín, ktoré sú nevyhnutné pre rast rastlín.\n\nV poľnohospodárstve je mineralizácia dôležitá pre udržanie úrodnosti pôdy a zabezpečenie dostupnosti živín pre plodiny. Rýchlosť mineralizácie závisí na faktoroch ako teplota, vlhkosť a typ pôdy.\n\nV slovenskom poľnohospodárstve sa mineralizácia sleduje ako súčasť hodnotenia pôdnej úrodnosti, a to najmä v súvislosti s aplikáciou organických hnojív a kompostov.",
    "related": [
      "kapilarita-pudy",
      "organicka-hmota",
      "eroze-pudy",
      "orba"
    ],
    "externalUrl": "https://cs.wikipedia.org/wiki/Mineralizace",
    "externalLabel": "Wikipedia",
    "faq": [
      {
        "q": "Co je mineralizace půdy?",
        "a": "Mineralizace půdy je proces, při kterém se organické látky rozkládají na anorganické formy, jako jsou minerální živiny."
      },
      {
        "q": "Jak probíhá mineralizace organické hmoty?",
        "a": "Mineralizace probíhá za účasti mikroorganismů, které rozkládají organické látky v půdě."
      },
      {
        "q": "Proč je mineralizace důležitá?",
        "a": "Mineralizace je klíčová pro uvolňování živin, které jsou nezbytné pro růst rostlin."
      }
    ]
  },
  {
    "slug": "utuzeni-pudy",
    "term": "Utuženie pôdy",
    "alias": [
      "kompakcia pôdy"
    ],
    "kategorie": "agrotechnika",
    "shortDef": "Utuženie pôdy je proces zhutnenia pôdnej štruktúry vplyvom mechanického zaťaženia.",
    "longDef": "Utuženie pôdy, známe aj ako kompakcia, je proces, pri ktorom dochádza k zhutneniu pôdnej štruktúry vplyvom mechanického zaťaženia, napríklad ťažkou technikou alebo intenzívnym pohybom zvierat. Tento proces znižuje pórovitosť pôdy a obmedzuje prienik vody a vzduchu.\n\nV poľnohospodárstve môže utuženie pôdy negatívne ovplyvniť rast rastlín, pretože obmedzuje dostupnosť kyslíka pre korene a sťažuje odvodnenie. Prevencia zahŕňa používanie ľahšej techniky a správne plánovanie pohybu po poli.\n\nNa Slovensku je problematika utuženia pôdy riešená v rámci udržateľných poľnohospodárskych praktík, ktoré zahŕňajú minimalizáciu prejazdov po poli a využívanie moderných technológií.",
    "related": [
      "orba",
      "predsetova-priprava",
      "hloubkove-kypreni",
      "ekoschemata"
    ],
    "externalUrl": "https://cs.wikipedia.org/wiki/Kompakce_p%C5%AFdy",
    "externalLabel": "Wikipedia",
    "faq": [
      {
        "q": "Co způsobuje utužení půdy?",
        "a": "Utužení půdy je způsobeno mechanickým zatížením, například těžkou technikou nebo nadměrným pojezdem."
      },
      {
        "q": "Jaké jsou důsledky utužení půdy?",
        "a": "Utužení půdy snižuje její propustnost pro vodu a vzduch, což může negativně ovlivnit růst rostlin."
      },
      {
        "q": "Jak lze zabránit utužení půdy?",
        "a": "Prevenci utužení lze dosáhnout omezením těžké techniky a používáním vhodných agrotechnických postupů."
      }
    ]
  },
  {
    "slug": "zelene-hnojeni",
    "term": "Zelené hnojenie",
    "alias": [
      "zelené hnoje"
    ],
    "kategorie": "agrotechnika",
    "shortDef": "Zelené hnojenie je agrotechnická metóda využívajúca rastliny na obohatenie pôdy o organickú hmotu a živiny.",
    "longDef": "Zelené hnojenie je metóda, pri ktorej sa pestujú špecifické rastliny, ktoré sa následne zaorávajú do pôdy za účelom zlepšenia jej štruktúry a obohatenia o organickú hmotu a živiny. Medzi bežne používané plodiny patrí svazenka, jetel a lupina.\n\nTáto metóda zvyšuje obsah organickej hmoty v pôde, zlepšuje jej štruktúru a zvyšuje biologickú aktivitu. Zelené hnojenie tiež pomáha v boji proti erózii a zlepšuje schopnosť pôdy zadržiavať vodu.\n\nNa Slovensku je zelené hnojenie súčasťou udržateľných poľnohospodárskych praktík a je podporované v rámci ekologických programov a dotácií.",
    "related": [
      "organicka-hmota",
      "eroze-pudy",
      "osevni-postup",
      "ekoschemata"
    ],
    "externalUrl": "https://cs.wikipedia.org/wiki/Zelen%C3%A9_hnojen%C3%AD",
    "externalLabel": "Wikipedia",
    "faq": [
      {
        "q": "Co je zelené hnojení?",
        "a": "Zelené hnojení je metoda, kdy se pěstují rostliny, které se následně zaorají do půdy pro zlepšení její kvality."
      },
      {
        "q": "Jaké rostliny se používají pro zelené hnojení?",
        "a": "Pro zelené hnojení se často používají rostliny jako je lupina, vojtěška nebo hořčice."
      },
      {
        "q": "Jaké jsou výhody zeleného hnojení?",
        "a": "Zelené hnojení zvyšuje obsah organické hmoty v půdě a zlepšuje její strukturu."
      }
    ]
  },
  {
    "slug": "strniste",
    "term": "Strnisko",
    "kategorie": "agrotechnika",
    "shortDef": "Strnisko je zvyšok stonkov a koreňov plodín po zbere.",
    "longDef": "Strnisko je časť rastlín, ktorá zostáva na poli po zbere plodín. Obvykle zahŕňa stonky, korene a niekedy aj malé časti listov. Strnisko môže slúžiť ako ochrana pôdy proti erózii a pomáha udržiavať vlhkosť.\n\nV poľnohospodárstve je strnisko často využívané ako mulč alebo je zaorávané do pôdy, čím sa zvyšuje obsah organickej hmoty a zlepšuje štruktúra pôdy. Strnisko tiež poskytuje úkryt pre drobné živočíchy a podporuje biodiverzitu.\n\nNa Slovensku je zachovanie strniska na poli často súčasťou udržateľných poľnohospodárskych praktík a je podporované v rámci rôznych agrotechnických programov.",
    "related": [
      "orba",
      "mulcovac",
      "kapilarita-pudy",
      "predsetova-priprava"
    ],
    "externalUrl": "https://cs.wikipedia.org/wiki/Strni%C5%A1t%C4%9B",
    "externalLabel": "Wikipedia",
    "faq": [
      {
        "q": "Co je strniště?",
        "a": "Strniště je zbytek stonků a kořenů plodin, které zůstávají na poli po sklizni."
      },
      {
        "q": "Jak se strniště využívá?",
        "a": "Strniště může být zaoráno pro zlepšení půdní struktury a zvýšení obsahu organické hmoty."
      },
      {
        "q": "Proč je důležité ponechat strniště na poli?",
        "a": "Ponechání strniště pomáhá chránit půdu před erozí a zlepšuje její úrodnost."
      }
    ],
    "alias": []
  },
  {
    "slug": "superfosfat",
    "term": "Superfosfát",
    "kategorie": "hnojivo",
    "shortDef": "Superfosfát je fosforečné hnojivo vyrábané z fosfátovej rudy a kyseliny sírovej.",
    "longDef": "Superfosfát je minerálne hnojivo obsahujúce fosfor, ktoré sa vyrába reakciou fosfátovej rudy s kyselinou sírovou. Obsahuje rozpustný fosforečnan vápenatý, ktorý je ľahko dostupný pre rastliny.\n\nPoužíva sa na zabezpečenie dostatočného prísunu fosforu pre plodiny, čo je kľúčový prvok pre rast a vývoj rastlín. Aplikácia superfosfátu zvyšuje výnosy a zlepšuje kvalitu plodín.\n\nNa Slovensku je superfosfát bežne používaným hnojivom, ktoré je aplikované najmä na pôdy s nízkym obsahom fosforu. Je súčasťou integrovaných hnojivových plánov.",
    "related": [
      "npk-hnojivo",
      "organicka-hmota",
      "rozmetadlo-hnojiv",
      "pH-pudy"
    ],
    "externalUrl": "https://cs.wikipedia.org/wiki/Superfosf%C3%A1t",
    "externalLabel": "Wikipedia",
    "faq": [
      {
        "q": "Co je superfosfát?",
        "a": "Superfosfát je fosforečné hnojivo vyráběné z fosfátové horniny a kyseliny sírové."
      },
      {
        "q": "Jak se používá superfosfát?",
        "a": "Superfosfát se aplikuje do půdy pro zvýšení obsahu fosforu, který je klíčový pro růst rostlin."
      },
      {
        "q": "Jaké jsou výhody použití superfosfátu?",
        "a": "Superfosfát zlepšuje kořenový růst a celkovou vitalitu rostlin."
      }
    ],
    "alias": []
  },
  {
    "slug": "draselna-sul",
    "term": "Draselná soľ (KCl)",
    "alias": [
      "chlorid draselný"
    ],
    "kategorie": "hnojivo",
    "shortDef": "Draselná soľ je minerálne hnojivo obsahujúce draslík vo forme chloridu draselného.",
    "longDef": "Draselná soľ, známa aj ako chlorid draselný (KCl), je minerálne hnojivo používané na dodanie draslíka, ktorý je nevyhnutný pre rast rastlín, zlepšenie odolnosti voči stresu a zvýšenie výnosov.\n\nAplikácia draslenej soli pomáha zlepšiť kvalitu plodín, podporuje fotosyntézu a zvyšuje odolnosť rastlín voči chorobám a nepriaznivým podmienkam. Draslík je kľúčový pre reguláciu vodného režimu rastlín.\n\nNa Slovensku je draselná soľ široko používaná ako súčasť hnojivových plánov, najmä na pôdach s nízkym obsahom draslíka. Je aplikovaná pred siatím alebo počas vegetácie.",
    "related": [
      "npk-hnojivo",
      "rozmetadlo-hnojiv",
      "pH-pudy",
      "organicka-hmota"
    ],
    "externalUrl": "https://cs.wikipedia.org/wiki/Chlorid_draseln%C3%BD",
    "externalLabel": "Wikipedia",
    "faq": [
      {
        "q": "Co je draselná sůl?",
        "a": "Draselná sůl je minerální hnojivo obsahující draslík ve formě chloridu draselného."
      },
      {
        "q": "Jak se používá draselná sůl?",
        "a": "Draselná sůl se používá k dodání draslíku do půdy, což je nezbytné pro růst a vývoj rostlin."
      },
      {
        "q": "Jaké jsou výhody draselné soli?",
        "a": "Draselná sůl zlepšuje odolnost rostlin vůči stresu a zvyšuje kvalitu plodů."
      }
    ]
  },
  {
    "slug": "kalimagnesia",
    "term": "Kalimagnesia (Patentkali)",
    "alias": [
      "Patentkali"
    ],
    "kategorie": "hnojivo",
    "shortDef": "Kalimagnesia je minerálne hnojivo obsahujúce draslík a horčík.",
    "longDef": "Kalimagnesia, známa aj ako Patentkali, je minerálne hnojivo, ktoré obsahuje draslík, horčík a síru. Používa sa na doplnenie týchto živín v pôde, čo je dôležité pre rast rastlín a výnosy plodín.\n\nDraslík v kalimagnesii zlepšuje odolnosť rastlín voči stresu, ako je sucho alebo mráz, a podporuje tvorbu cukrov a škrobov. Horčík je kľúčový pre fotosyntézu, pretože je súčasťou molekuly chlorofylu.\n\nNa Slovensku je kalimagnesia využívaná najmä v oblastiach s nedostatkom týchto prvkov v pôde. Aplikácia sa vykonáva pred sejbou alebo počas vegetačného obdobia.",
    "related": [
      "superfosfat",
      "draselna-sul",
      "dolomiticky-vapenec",
      "npk-hnojivo"
    ],
    "externalUrl": "https://cs.wikipedia.org/wiki/Kalimagnesia",
    "externalLabel": "Wikipedia",
    "faq": [
      {
        "q": "K čemu slouží kalimagnesia?",
        "a": "Kalimagnesia se používá k dodání draslíku a hořčíku do půdy, což podporuje růst rostlin."
      },
      {
        "q": "Jak se aplikuje kalimagnesia?",
        "a": "Aplikuje se rozhozem na povrch půdy, obvykle před setím nebo sázením."
      },
      {
        "q": "Jaký je rozdíl mezi kalimagnesií a draselnou solí?",
        "a": "Kalimagnesia obsahuje navíc hořčík, zatímco draselná sůl obsahuje pouze draslík."
      }
    ]
  },
  {
    "slug": "dolomiticky-vapenec",
    "term": "Dolomitický vápenec",
    "kategorie": "hnojivo",
    "shortDef": "Dolomitický vápenec je prírodné hnojivo obsahujúce vápnik a horčík.",
    "longDef": "Dolomitický vápenec je prírodný minerál, ktorý sa používa ako hnojivo na zlepšenie pôdnej štruktúry a pH. Obsahuje vápnik a horčík, ktoré sú kľúčové pre zdravý rast rastlín.\n\nToto hnojivo zvyšuje pH kyslých pôd, čo zlepšuje dostupnosť živín pre rastliny. Horčík v dolomitickom vápeneci podporuje fotosyntézu a celkový metabolizmus rastlín.\n\nNa Slovensku sa dolomitický vápenec používa najmä na kyslých pôdach, kde pomáha zlepšiť štruktúru pôdy a podporiť rast plodín.",
    "related": [
      "kalimagnesia",
      "superfosfat",
      "vapneni",
      "pH-pudy"
    ],
    "externalUrl": "https://cs.wikipedia.org/wiki/Dolomit",
    "externalLabel": "Wikipedia",
    "faq": [
      {
        "q": "K čemu se používá dolomitický vápenec?",
        "a": "Používá se k zlepšení půdní struktury a zvýšení pH kyselých půd."
      },
      {
        "q": "Jak se dolomitický vápenec aplikuje?",
        "a": "Aplikuje se rozhozem nebo zapravením do půdy, obvykle na podzim."
      },
      {
        "q": "Jaký je rozdíl mezi dolomitickým vápencem a běžným vápencem?",
        "a": "Dolomitický vápenec obsahuje kromě vápníku i hořčík."
      }
    ],
    "alias": []
  },
  {
    "slug": "digestat",
    "term": "Digestát",
    "kategorie": "hnojivo",
    "shortDef": "Digestát je organické hnojivo vznikajúce ako vedľajší produkt bioplynových staníc.",
    "longDef": "Digestát je organické hnojivo, ktoré vzniká ako vedľajší produkt pri anaeróbnej digescii v bioplynových staniciach. Obsahuje cenné živiny, ako sú dusík, fosfor a draslík, a je využívaný na zlepšenie pôdnej úrodnosti.\n\nPoužíva sa ako alternatívny zdroj živín pre rastliny, čo môže znížiť potrebu syntetických hnojív. Digestát sa aplikuje na pole pomocou rozmetadiel, cisteren alebo injektáže do pôdy, čo je často preferovaná metóda kvôli zníženiu emisií amoniaku.\n\nNa Slovensku je používanie digestátu regulované, aby sa zabránilo nadmernému hnojeniu a ochrane vodných zdrojov.",
    "related": [
      "kejda",
      "hnuj",
      "organicka-hmota",
      "cisterna-na-kejdu"
    ],
    "externalUrl": "https://cs.wikipedia.org/wiki/Digest%C3%A1t",
    "externalLabel": "Wikipedia",
    "faq": [
      {
        "q": "K čemu slouží digestát?",
        "a": "Digestát slouží jako organické hnojivo bohaté na živiny, zlepšující úrodnost půdy."
      },
      {
        "q": "Jak se digestát aplikuje?",
        "a": "Aplikuje se na pole pomocí rozmetadel, cisteren nebo injektáží do půdy."
      },
      {
        "q": "Jaký je rozdíl mezi digestátem a kompostem?",
        "a": "Digestát je tekutý a vzniká v bioplynových stanicích, zatímco kompost je pevný a vzniká rozkladem organického materiálu."
      }
    ],
    "alias": []
  },
  {
    "slug": "kejda",
    "term": "Kejda",
    "kategorie": "hnojivo",
    "shortDef": "Kejda je tekuté organické hnojivo vznikajúce z chovu hospodárskych zvierat.",
    "longDef": "Kejda je tekuté organické hnojivo, ktoré vzniká ako zmes exkrementov hospodárskych zvierat a vody. Obsahuje dôležité živiny, ako je dusík, fosfor a draslík, a je využívaná na zlepšenie úrodnosti pôdy.\n\nAplikácia kejdy sa vykonáva pomocou cisteren alebo špeciálnych rozmetadiel, a to buď pred sejbou, alebo počas vegetačného obdobia. Kejda prispieva k udržaniu organickej hmoty v pôde a podporuje mikrobiálnu aktivitu.\n\nNa Slovensku je používanie kejdy regulované, aby sa minimalizovalo riziko znečistenia vodných zdrojov a zabránilo nadmernému hnojeniu.",
    "related": [
      "digestat",
      "hnuj",
      "cisterna-na-kejdu",
      "organicka-hmota"
    ],
    "externalUrl": "https://cs.wikipedia.org/wiki/Kejda",
    "externalLabel": "Wikipedia",
    "faq": [
      {
        "q": "K čemu se používá kejda?",
        "a": "Kejda se používá jako organické hnojivo pro zlepšení půdní úrodnosti."
      },
      {
        "q": "Jak se kejda aplikuje?",
        "a": "Aplikuje se pomocí cisteren s rozstřikovači na pole."
      },
      {
        "q": "Jaký je rozdíl mezi kejdou a hnojem?",
        "a": "Kejda je tekutá, zatímco hnůj je pevný a obsahuje podestýlku."
      }
    ],
    "alias": []
  },
  {
    "slug": "hnuj",
    "term": "Hnoj (chlievsky)",
    "alias": [
      "chlievsky hnoj"
    ],
    "kategorie": "hnojivo",
    "shortDef": "Hnoj je organické hnojivo vznikajúce z exkrementov hospodárskych zvierat a podstielky.",
    "longDef": "Hnoj je tradičné organické hnojivo, ktoré sa skladá z exkrementov hospodárskych zvierat zmiešaných s podstielkou, ako je slama. Obsahuje dôležité živiny, ako je dusík, fosfor a draslík, a je kľúčový pre zlepšenie úrodnosti pôdy.\n\nHnoj sa aplikuje na pole pred orbou alebo počas vegetačného obdobia, čo prispieva k udržaniu organickej hmoty a zlepšeniu štruktúry pôdy. Jeho používanie podporuje mikrobiálnu aktivitu a dlhodobo zvyšuje úrodnosť.\n\nNa Slovensku je hnoj stále hojne využívaný, najmä v ekologickom poľnohospodárstve, kde je dôležitý pre udržanie prirodzenej rovnováhy živín v pôde.",
    "related": [
      "kejda",
      "digestat",
      "organicka-hmota",
      "orba"
    ],
    "externalUrl": "https://cs.wikipedia.org/wiki/Hn%C5%AFj",
    "externalLabel": "Wikipedia",
    "faq": [
      {
        "q": "K čemu slouží hnůj?",
        "a": "Hnůj slouží jako organické hnojivo, které zlepšuje strukturu a úrodnost půdy."
      },
      {
        "q": "Jak se hnůj aplikuje?",
        "a": "Aplikuje se rozhozem na pole a následně se zapravuje do půdy."
      },
      {
        "q": "Jaký je rozdíl mezi hnojem a kompostem?",
        "a": "Hnůj je čerstvý organický materiál, zatímco kompost je rozložený a stabilizovaný."
      }
    ]
  },
  {
    "slug": "kostni-moucka",
    "term": "Kostná múčka",
    "kategorie": "hnojivo",
    "shortDef": "Kostná múčka je organické hnojivo bohaté na fosfor a vápnik.",
    "longDef": "Kostná múčka je organické hnojivo vyrobené z rozdrvených kostí, ktoré je bohaté na fosfor a vápnik. Tieto živiny sú kľúčové pre rast a vývoj rastlín, najmä pre tvorbu koreňového systému a kvetov.\n\nPoužíva sa predovšetkým na záhradách a v poľnohospodárstve na podporu rastu plodín s vysokou potrebou fosforu. Aplikácia sa vykonáva pred sejbou alebo počas vegetačného obdobia.\n\nNa Slovensku je kostná múčka obľúbená najmä v ekologickom poľnohospodárstve, kde sa využíva ako prírodný zdroj fosforu bez chemických prísad.",
    "related": [
      "hnuj",
      "organicka-hmota",
      "superfosfat",
      "npk-hnojivo"
    ],
    "externalUrl": "https://cs.wikipedia.org/wiki/Kostn%C3%AD_mou%C4%8Dka",
    "externalLabel": "Wikipedia",
    "faq": [
      {
        "q": "K čemu se používá kostní moučka?",
        "a": "Kostní moučka se používá jako hnojivo bohaté na fosfor a vápník."
      },
      {
        "q": "Jak se kostní moučka aplikuje?",
        "a": "Aplikuje se rozhozem na povrch půdy nebo jako přísada do kompostu."
      },
      {
        "q": "Jaký je rozdíl mezi kostní moučkou a fosfátovými hnojivy?",
        "a": "Kostní moučka je organického původu, zatímco fosfátová hnojiva jsou často syntetická."
      }
    ],
    "alias": []
  },
  {
    "slug": "listova-hnojiva",
    "term": "Listové hnojivá",
    "alias": [
      "foliárne hnojivá"
    ],
    "kategorie": "hnojivo",
    "shortDef": "Listové hnojivá sú hnojivá aplikované priamo na listy rastlín pre rýchle dodanie živín.",
    "longDef": "Listové hnojivá sú špeciálne hnojivá určené na aplikáciu na listy rastlín, čo umožňuje rýchle a efektívne dodanie živín priamo do rastlinných pletív. Používajú sa najmä v prípadoch, keď je potrebné rýchlo reagovať na nedostatok živín alebo pri nepriaznivých pôdnych podmienkach. Na Slovensku sú listové hnojivá často využívané v intenzívnej poľnohospodárskej produkcii, kde je kladený dôraz na optimalizáciu výnosov a kvality plodín. Aplikácia listových hnojív je efektívnou metódou, ako podporiť rast rastlín a zlepšiť ich odolnosť voči stresovým faktorom.",
    "related": [
      "rozmetadlo-hnojiv",
      "kapilarita-pudy",
      "mineralizace-pudy",
      "npk-hnojivo"
    ],
    "externalUrl": "https://cs.wikipedia.org/wiki/Hnojivo",
    "externalLabel": "Wikipedia",
    "faq": [
      {
        "q": "Jak se aplikují listová hnojiva?",
        "a": "Listová hnojiva se aplikují postřikem přímo na listy rostlin, obvykle v období růstu."
      },
      {
        "q": "K čemu slouží listová hnojiva?",
        "a": "Listová hnojiva slouží k rychlému dodání živin přímo do rostliny, což je užitečné v případě nedostatku živin v půdě."
      }
    ]
  },
  {
    "slug": "sira-vyziva",
    "term": "Síra vo výžive rastlín",
    "alias": [
      "síra v rastlinách"
    ],
    "kategorie": "hnojivo",
    "shortDef": "Síra je kľúčový prvok vo výžive rastlín, dôležitý pre syntézu aminokyselín a enzýmov.",
    "longDef": "Síra je esenciálna živina pre rastliny, ktorá sa podieľa na syntéze aminokyselín, enzýmov a vitamínov. Je nevyhnutná pre tvorbu chlorofylu a podporuje metabolizmus dusíka. Nedostatok síry môže viesť k obmedzenému rastu a zníženej kvalite plodín. Na Slovensku je síra často aplikovaná vo forme síranových hnojív, najmä v oblastiach s nízkym obsahom organickej hmoty v pôde. Správna výživa sírou je kľúčová pre dosiahnutie vysokých výnosov a kvalitných poľnohospodárskych produktov.",
    "related": [
      "npk-hnojivo",
      "mineralizace-pudy",
      "superfosfat",
      "draselna-sul"
    ],
    "externalUrl": "https://cs.wikipedia.org/wiki/S%C3%ADra",
    "externalLabel": "Wikipedia",
    "faq": [
      {
        "q": "Proč je síra důležitá pro rostliny?",
        "a": "Síra je klíčová pro syntézu aminokyselin, enzymů a vitamínů v rostlinách."
      },
      {
        "q": "Jak se projevuje nedostatek síry u rostlin?",
        "a": "Nedostatek síry se projevuje žloutnutím mladších listů a zpomalením růstu."
      }
    ]
  },
  {
    "slug": "padli-travni",
    "term": "Padlí trávne",
    "alias": [
      "padlí tráv"
    ],
    "kategorie": "ochrana",
    "shortDef": "Padlí trávne je hubové ochorenie, ktoré napáda predovšetkým obilniny a trávy.",
    "longDef": "Padlí trávne je hubové ochorenie spôsobené hubou Blumeria graminis, ktoré postihuje obilniny a trávy. Prejavuje sa bielym povlakom na listoch a stonkách, čo môže viesť k oslabení rastlín a zníženiu výnosu. Na Slovensku je padlí trávne bežným problémom v intenzívne pestovaných plodinách, ako je pšenica a jačmeň. Ochrana proti padlí zahŕňa preventívne opatrenia, ako je správna agrotechnika a použitie fungicídov.",
    "related": [
      "fungicidy",
      "psenice-ozima",
      "repka-ozima",
      "osevni-postup"
    ],
    "externalUrl": "https://cs.wikipedia.org/wiki/Padl%C3%AD",
    "externalLabel": "Wikipedia",
    "faq": [
      {
        "q": "Jak se projevuje padlí travní?",
        "a": "Padlí travní se projevuje bílým povlakem na listech a stoncích rostlin."
      },
      {
        "q": "Jak se léčí padlí travní?",
        "a": "Padlí travní se léčí aplikací fungicidů a zlepšením podmínek pro růst."
      }
    ]
  },
  {
    "slug": "hlizenka",
    "term": "Hlízenka obyčajná (Sclerotinia)",
    "alias": [
      "Sclerotinia sclerotiorum"
    ],
    "kategorie": "ochrana",
    "shortDef": "Hlízenka obyčajná je hubová choroba napadajúca široké spektrum rastlín, vrátane repky a slnečnice.",
    "longDef": "Hlízenka obyčajná, spôsobená hubou Sclerotinia sclerotiorum, je významná hubová choroba, ktorá napadá mnoho druhov rastlín, vrátane repky, slnečnice a strukovín. Prejavuje sa hnilobou stonkov a listov, čo môže viesť k výrazným stratám na výnosoch. Na Slovensku je hlízenka obyčajná zvlášť problematická v oblastiach s vlhkým klimatom. Ochrana proti tejto chorobe zahŕňa použitie fungicídov a dodržiavanie správnych osevných postupov.",
    "related": [
      "fungicidy",
      "repka-ozima",
      "osevni-postup",
      "moreni-osiva"
    ],
    "externalUrl": "https://cs.wikipedia.org/wiki/Sclerotinia_sclerotiorum",
    "externalLabel": "Wikipedia",
    "faq": [
      {
        "q": "Jak se projevuje hlízenka obecná?",
        "a": "Hlízenka obecná se projevuje hnilobou stonků a kořenů, často s bílým myceliem."
      },
      {
        "q": "Jak se kontroluje hlízenka obecná?",
        "a": "Kontrola zahrnuje střídání plodin a aplikaci fungicidů."
      }
    ]
  },
  {
    "slug": "drepcik",
    "term": "Drepčíci",
    "alias": [
      "drepčík"
    ],
    "kategorie": "ochrana",
    "shortDef": "Drepčíci sú drobní chrobáky, ktorí poškodzujú listy a stonky rastlín.",
    "longDef": "Drepčíci sú malí chrobáky z čeľade Chrysomelidae, ktorí sú známi svojím skákavým pohybom a poškodzovaním listov a stonkov rastlín. Sú obzvlášť nebezpeční pre mladé rastliny, kde môžu spôsobiť značné škody. Na Slovensku sú drepčíci bežným škodcom v plodinách ako je repka, kapusta a ďalšie brukvovité rastliny. Ochrana proti drepčíkom zahŕňa použitie insekticídov a agrotechnických opatrení, ako je správna rotácia plodín.",
    "related": [
      "insekticidy",
      "repka-ozima",
      "osevni-postup",
      "predni-vyvodovy-hridel"
    ],
    "externalUrl": "https://cs.wikipedia.org/wiki/D%C5%99ep%C4%8D%C3%ADk",
    "externalLabel": "Wikipedia",
    "faq": [
      {
        "q": "Jak se projevuje poškození dřepčíky?",
        "a": "Poškození se projevuje drobnými otvory a žírem na listech a stoncích."
      },
      {
        "q": "Jak se kontrolují dřepčíci?",
        "a": "Kontrola zahrnuje použití insekticidů a agrotechnických opatření."
      }
    ]
  },
  {
    "slug": "bazlivec-kukuricny",
    "term": "Bázlivec kukuričný",
    "alias": [
      "Diabrotica virgifera"
    ],
    "kategorie": "ochrana",
    "shortDef": "Bázlivec kukuričný je škodca kukurice, ktorý spôsobuje poškodenie koreňov a znižuje výnosy.",
    "longDef": "Bázlivec kukuričný, Diabrotica virgifera, je invázny škodca, ktorý napadá kukuricu a spôsobuje významné poškodenie koreňového systému. To vedie k oslabení rastlín a poklesu výnosov. Na Slovensku sa tento škodca stal problémom v posledných desaťročiach, čo vyžaduje implementáciu integrované ochrany rastlín, vrátane použitia insekticídov a agrotechnických opatrení, ako je striedanie plodín. Efektívny manažment bázlivca kukuričného je kľúčový pre udržanie produktivity kukuričných polí.",
    "related": [
      "insekticidy",
      "osevni-postup",
      "predni-vyvodovy-hridel",
      "psenice-ozima"
    ],
    "externalUrl": "https://cs.wikipedia.org/wiki/B%C3%A1zlivec_kuku%C5%99i%C4%8Dn%C3%BD",
    "externalLabel": "Wikipedia",
    "faq": [
      {
        "q": "Jak se projevuje poškození bázlivcem kukuřičným?",
        "a": "Poškození se projevuje oslabením kořenového systému a polehnutím rostlin."
      },
      {
        "q": "Jak se kontroluje bázlivec kukuřičný?",
        "a": "Kontrola zahrnuje střídání plodin a použití insekticidů."
      }
    ]
  },
  {
    "slug": "sviluska-chmelova",
    "term": "Sviluška chmelová",
    "alias": [
      "Tetranychus urticae",
      "červený pavouček"
    ],
    "kategorie": "ochrana",
    "shortDef": "Sviluška chmelová je pavúkovec spôsobujúci škody na chmele a ďalších plodinách.",
    "longDef": "Sviluška chmelová (Tetranychus urticae) je drobný pavúkovec, ktorý napadá listy rastlín, najmä chmeľu, a spôsobuje ich žltnutie a opadávanie. Svilušky sa živia sáním rastlinných šťáv, čo vedie k oslabení rastlín a zníženiu výnosu. V boji proti sviluškám sa používajú akaricídy a biologické metódy, ako je využitie dravých roztočov. V Slovenskej republike je sledovanie a ochrana pred sviluškou dôležitou súčasťou integrované ochrany rastlín.",
    "related": [
      "padli-travni",
      "ucinna-latka",
      "rezistence-pesticidy"
    ],
    "externalUrl": "https://cs.wikipedia.org/wiki/Svilu%C5%A1ka_chmelov%C3%A1",
    "externalLabel": "Wikipedia",
    "faq": [
      {
        "q": "Jak se pozná napadení sviluškou chmelovou?",
        "a": "Napadení se projevuje žloutnutím a bronzováním listů, které mohou následně opadávat."
      },
      {
        "q": "Jaká je prevence proti svilušce chmelové?",
        "a": "Pravidelná kontrola rostlin a aplikace vhodných akaricidů pomáhají v prevenci."
      }
    ]
  },
  {
    "slug": "molice-sklenikova",
    "term": "Molice skleníková",
    "alias": [
      "Trialeurodes vaporariorum"
    ],
    "kategorie": "ochrana",
    "shortDef": "Molice skleníková je škodca napadajúci rastliny v skleníkoch.",
    "longDef": "Molice skleníková (Trialeurodes vaporariorum) je drobný hmyz, ktorý napadá listy rastlín v skleníkoch, kde sáním rastlinných šťáv spôsobuje ich oslabenie. Tento škodca je známy svojou schopnosťou rýchlo sa množiť a prenášať vírusové choroby. Kontrola molice zahŕňa použitie insekticídov, biologických predátorov a preventívnych opatrení, ako je udržiavanie čistoty v skleníkoch. V Slovenskej republike je molice skleníková významným škodcom v produkcii zeleniny a okrasných rastlín.",
    "related": [
      "insekticidy",
      "ucinna-latka",
      "rezistence-pesticidy"
    ],
    "externalUrl": "https://cs.wikipedia.org/wiki/Molice_sklen%C3%ADkov%C3%A1",
    "externalLabel": "Wikipedia",
    "faq": [
      {
        "q": "Jak se zbavit molice skleníkové?",
        "a": "Použití biologických nepřátel, jako jsou parazitické vosičky, je efektivní metodou."
      },
      {
        "q": "Jaké rostliny napadá molice skleníková?",
        "a": "Napadá širokou škálu rostlin, včetně rajčat, okurek a okrasných rostlin."
      }
    ]
  },
  {
    "slug": "strupovitost-jablone",
    "term": "Strupovitost jablone",
    "alias": [
      "Venturia inaequalis"
    ],
    "kategorie": "ochrana",
    "shortDef": "Strupovitost jablone je hubová choroba spôsobujúca škvrny na plodoch a listoch jabloní.",
    "longDef": "Strupovitost jablone (Venturia inaequalis) je hubová choroba, ktorá napadá listy a plody jabloní, čím spôsobuje čierne škvrny a deformácie. Táto choroba môže výrazne znížiť kvalitu a množstvo úrody. Ochrana proti strupovitosti zahŕňa použitie fungicídov, výber odolných odrôd a správne agrotechnické postupy. V Slovenskej republike je strupovitost jednou z najčastejších chorôb jabloní, a preto je jej kontrola kľúčovou súčasťou integrované ochrany rastlín.",
    "related": [
      "fungicidy",
      "ucinna-latka",
      "padli-travni"
    ],
    "externalUrl": "https://cs.wikipedia.org/wiki/Strupovitost_jablon%C4%9B",
    "externalLabel": "Wikipedia",
    "faq": [
      {
        "q": "Jak se léčí strupovitost jabloně?",
        "a": "Použití fungicidů a odstraňování napadených částí stromu jsou běžné metody."
      },
      {
        "q": "Jak se projevuje strupovitost na jablkách?",
        "a": "Na plodech se objevují tmavé, korkovité skvrny."
      }
    ]
  },
  {
    "slug": "obalec-jablecny",
    "term": "Obaleč jablečný",
    "alias": [
      "Cydia pomonella"
    ],
    "kategorie": "ochrana",
    "shortDef": "Obaleč jablečný je motýľ, ktorého húsenice poškodzujú plody jabloní.",
    "longDef": "Obaleč jablečný (Cydia pomonella) je motýľ, ktorého larvy napadajú plody jabloní, hrušní a ďalších ovocných stromov, čím spôsobujú červivosť a straty na úrode. Kontrola obaleča zahŕňa použitie insekticídov, feromonových lapačov a biologických metód, ako je uvoľňovanie parazitických vosičiek. V Slovenskej republike je obaleč jablečný považovaný za významného škodcu v ovocinárstve, a preto je jeho sledovanie a kontrola kľúčovou súčasťou ochrany ovocných sadov.",
    "related": [
      "insekticidy",
      "ucinna-latka",
      "rezistence-pesticidy"
    ],
    "externalUrl": "https://cs.wikipedia.org/wiki/Obale%C4%8D_jable%C4%8Dn%C3%BD",
    "externalLabel": "Wikipedia",
    "faq": [
      {
        "q": "Jak se obaleč jablečný kontroluje?",
        "a": "Použití feromonových lapačů a insekticidů pomáhá v kontrole populace."
      },
      {
        "q": "Kdy se obaleč jablečný vyskytuje?",
        "a": "Dospělci se objevují na jaře a housenky poškozují plody v létě."
      }
    ]
  },
  {
    "slug": "monilie",
    "term": "Monilióza (moniliová hniloba)",
    "alias": [
      "Monilinia spp.",
      "hniloba peckovin"
    ],
    "kategorie": "ochrana",
    "shortDef": "Monilióza je hubová choroba napadajúca kvety a plody peckovin.",
    "longDef": "Monilióza je hubová choroba spôsobená hubami rodu Monilinia, ktorá napadá kvety, plody a vetvičky peckovin, ako sú marhule, broskyne a čerešne. Prejavuje sa hnilobou plodov, vadnutím kvetov a odumieraním vetvičiek. Ochrana proti monilióze zahŕňa použitie fungicídov, odstránenie napadnutých častí rastlín a dodržiavanie hygienických opatrení v sadoch. V Slovenskej republike je monilióza bežným problémom v produkcii peckovin, a preto je jej kontrola dôležitou súčasťou integrované ochrany rastlín.",
    "related": [
      "fungicidy",
      "ucinna-latka",
      "padli-travni"
    ],
    "externalUrl": "https://cs.wikipedia.org/wiki/Monili%C3%B3za",
    "externalLabel": "Wikipedia",
    "faq": [
      {
        "q": "Jak se projevuje monilióza?",
        "a": "Projevuje se hnilobou plodů a vadnutím květů a větví."
      },
      {
        "q": "Jak se monilióza šíří?",
        "a": "Šíří se spórami, které jsou přenášeny větrem a deštěm."
      }
    ]
  },
  {
    "slug": "ochranna-lhuta",
    "term": "Ochranná lehota",
    "kategorie": "ochrana",
    "shortDef": "Ochranná lehota je doba, ktorá musí uplynúť medzi aplikáciou pesticídu a zberom.",
    "longDef": "Ochranná lehota je legislatívne stanovená doba, ktorá musí uplynúť medzi aplikáciou pesticídu a zberom plodiny, aby sa zabezpečilo, že rezíduá chemických látok neprekročia povolené limity. Táto lehota je kľúčová pre zabezpečenie bezpečnosti potravín a ochranu spotrebiteľov. V praxi sa ochranná lehota líši podľa typu pesticídu, plodiny a podmienok aplikácie. V Slovenskej republike je dodržiavanie ochranných lehôt súčasťou legislatívy týkajúcej sa používania pesticídov a je kontrolované príslušnými úradmi.",
    "related": [
      "rezistence-pesticidy",
      "ucinna-latka",
      "fungicidy"
    ],
    "externalUrl": "https://cs.wikipedia.org/wiki/Ochrann%C3%A1_lh%C5%AFta",
    "externalLabel": "Wikipedia",
    "faq": [
      {
        "q": "Jak se počítá ochranná lhůta?",
        "a": "Počítá se od poslední aplikace pesticidu do sklizně plodiny."
      },
      {
        "q": "Proč je důležitá ochranná lhůta?",
        "a": "Zajišťuje, že rezidua pesticidů klesnou na bezpečnou úroveň před konzumací."
      }
    ],
    "alias": []
  },
  {
    "slug": "moreni-osiva",
    "term": "Močenie osiva",
    "alias": [
      "močenie semien"
    ],
    "kategorie": "ochrana",
    "shortDef": "Močenie osiva je proces úpravy semien chemickými alebo biologickými látkami pred výsevom.",
    "longDef": "Močenie osiva je agronomická technika, ktorá zahŕňa aplikáciu chemických alebo biologických látok na semena pred ich výsevom. Cieľom je ochrana semien a mladých rastlín pred chorobami a škodcami, čo zvyšuje klíčivosť a výnosy. V praxi sa používajú rôzne močiace prípravky, ktoré môžu obsahovať fungicídy, insekticídy alebo rastové stimulátory. Na Slovensku je močenie osiva bežnou praxou, ktorá pomáha zlepšiť zdravie plodín a efektivitu pestovania.",
    "related": [
      "ochranna-lhuta",
      "fungicidy",
      "insekticidy",
      "ucinna-latka"
    ],
    "externalUrl": "https://cs.wikipedia.org/wiki/Moření_osiva",
    "externalLabel": "Wikipedia",
    "faq": [
      {
        "q": "Proč se moří osivo?",
        "a": "Moření osiva se provádí k ochraně semen před chorobami a škůdci, což zvyšuje pravděpodobnost úspěšného klíčení."
      },
      {
        "q": "Jaké látky se používají při moření osiva?",
        "a": "Používají se chemické látky jako fungicidy a insekticidy nebo biologické prostředky, například mikroorganismy."
      },
      {
        "q": "Jaký je rozdíl mezi chemickým a biologickým mořením?",
        "a": "Chemické moření využívá syntetické látky, zatímco biologické moření využívá přírodní organismy nebo extrakty."
      }
    ]
  },
  {
    "slug": "adjuvant",
    "term": "Adjuvant (smáčadlo)",
    "alias": [
      "smáčadlo",
      "povrchovo aktívna látka"
    ],
    "kategorie": "ochrana",
    "shortDef": "Adjuvant je látka pridávaná k pesticídnym prípravkom na zvýšenie ich účinnosti.",
    "longDef": "Adjuvanty, známe tiež ako smáčadlá, sú látky pridávané k pesticídnym postrekom za účelom zvýšenia ich účinnosti. Fungujú tak, že zlepšujú priľnavosť a rozptyl postrekov na povrchu rastlín, čo vedie k lepšiemu pokrytiu a absorpcii účinnej látky. Použitie adjuvantov je bežné v poľnohospodárstve, kde pomáhajú optimalizovať aplikáciu pesticídov a znižovať ich spotrebu. Na Slovensku sú adjuvanty súčasťou integrované ochrany rastlín.",
    "related": [
      "ucinna-latka",
      "fungicidy",
      "herbicidy",
      "insekticidy"
    ],
    "externalUrl": "https://cs.wikipedia.org/wiki/Adjuvant",
    "externalLabel": "Wikipedia",
    "faq": [
      {
        "q": "K čemu slouží adjuvanty v zemědělství?",
        "a": "Adjuvanty zlepšují účinnost pesticidů tím, že zvyšují jejich přilnavost a pronikání do rostlin."
      },
      {
        "q": "Jaké jsou typy adjuvantů?",
        "a": "Existují smáčedla, penetrátory, nárazníky a další typy adjuvantů."
      }
    ]
  },
  {
    "slug": "rezistence-pesticidy",
    "term": "Rezistencia voči pesticídom",
    "alias": [
      "odolnosť voči pesticídom"
    ],
    "kategorie": "ochrana",
    "shortDef": "Rezistencia voči pesticídom je schopnosť škodcov prežiť aplikáciu pesticídov, ktoré by ich normálne zničili.",
    "longDef": "Rezistencia voči pesticídom je fenomén, kedy sa populácia škodcov stáva odolnou voči chemickým látkam používaným na ich potlačenie. Tento jav je výsledkom prirodzeného výberu, kedy prežijú jedinci s genetickou odolnosťou a odovzdajú ju ďalším generáciám. Rezistencia predstavuje významný problém v poľnohospodárstve, pretože znižuje účinnosť pesticídov a môže viesť k vyšším nákladom na ochranu plodín. Na Slovensku sa kladie dôraz na integrovanú ochranu, ktorá zahŕňa rotáciu pesticídov a použitie alternatívnych metód kontroly škodcov.",
    "related": [
      "fungicidy",
      "herbicidy",
      "insekticidy",
      "moreni-osiva"
    ],
    "externalUrl": "https://cs.wikipedia.org/wiki/Rezistence_vůči_pesticidům",
    "externalLabel": "Wikipedia",
    "faq": [
      {
        "q": "Jak vzniká rezistence vůči pesticidům?",
        "a": "Rezistence vzniká genetickými mutacemi, které umožňují přežití škůdců i po aplikaci pesticidů."
      },
      {
        "q": "Jak se dá předcházet rezistenci vůči pesticidům?",
        "a": "Používáním různých pesticidů a integrovanými metodami ochrany rostlin."
      }
    ]
  },
  {
    "slug": "ucinna-latka",
    "term": "Účinná látka",
    "alias": [
      "aktívna složka"
    ],
    "kategorie": "ochrana",
    "shortDef": "Účinná látka je chemická zložka pesticídu, ktorá zabezpečuje jeho biologickú aktivitu.",
    "longDef": "Účinná látka je kľúčovou zložkou pesticídnych prípravkov, ktorá je zodpovedná za ich biologickú aktivitu proti škodcom, chorobám alebo burinám. Táto látka je starostlivo vyvíjaná a testovaná, aby bola účinná a zároveň bezpečná pre životné prostredie a ľudské zdravie. V praxi sa účinné látky používajú v kombinácii s ďalšími zložkami, ktoré zabezpečujú ich stabilitu a účinnosť. Na Slovensku je používanie účinných látok regulované zákonmi a predpismi, ktoré zabezpečujú ich bezpečné použitie v poľnohospodárstve.",
    "related": [
      "fungicidy",
      "herbicidy",
      "insekticidy",
      "adjuvant"
    ],
    "externalUrl": "https://cs.wikipedia.org/wiki/Účinná_látka",
    "externalLabel": "Wikipedia",
    "faq": [
      {
        "q": "Co je účinná látka v pesticidu?",
        "a": "Účinná látka je složka, která má přímý vliv na cílové organismy."
      },
      {
        "q": "Jak se určuje účinnost látky v pesticidu?",
        "a": "Účinnost se testuje v laboratorních a polních podmínkách."
      }
    ]
  },
  {
    "slug": "azoxystrobin",
    "term": "Azoxystrobin",
    "kategorie": "ochrana",
    "shortDef": "Azoxystrobin je širokospektrálny fungicíd používaný na ochranu plodín pred hubovými chorobami.",
    "longDef": "Azoxystrobin je fungicíd zo skupiny strobilurínov, ktorý sa používa na ochranu plodín proti širokému spektru hubových chorôb. Funguje tak, že narušuje bunkové dýchanie húb, čo vedie k ich úhynu. Azoxystrobin je aplikovaný na rôzne plodiny, vrátane obilnín, zeleniny a ovocia, a je cenený pre svoju účinnosť a relatívne nízku toxicitu pre necielené organizmy. Na Slovensku je azoxystrobin súčasťou integrované ochrany rastlín a jeho použitie je regulované príslušnými predpismi.",
    "related": [
      "fungicidy",
      "ucinna-latka",
      "moreni-osiva",
      "rezistence-pesticidy"
    ],
    "externalUrl": "https://cs.wikipedia.org/wiki/Azoxystrobin",
    "externalLabel": "Wikipedia",
    "faq": [
      {
        "q": "Na co se používá azoxystrobin?",
        "a": "Azoxystrobin se používá k ochraně plodin před širokým spektrem houbových chorob."
      },
      {
        "q": "Jak funguje azoxystrobin?",
        "a": "Inhibuje mitochondriální respiraci hub, čímž zastavuje jejich růst."
      }
    ],
    "alias": []
  },
  {
    "slug": "prothiokonazol",
    "term": "Prothiokonazol",
    "kategorie": "ochrana",
    "shortDef": "Prothiokonazol je fungicíd používaný na ochranu plodín pred hubovými chorobami.",
    "longDef": "Prothiokonazol je systémový fungicíd zo skupiny triazolov, ktorý sa používa na ochranu plodín pred rôznymi hubovými chorobami. Je známy svojou schopnosťou prenikať do rastlinných tkanív a poskytovať dlhodobú ochranu. Prothiokonazol je aplikovaný na širokú škálu plodín, vrátane obilnín, repky a zeleniny. Na Slovensku je jeho použitie súčasťou integrované ochrany rastlín a podlieha prísnym regulačným opatreniam, ktoré zabezpečujú jeho bezpečné použitie.",
    "related": [
      "fungicidy",
      "ucinna-latka",
      "moreni-osiva",
      "rezistence-pesticidy"
    ],
    "externalUrl": "https://cs.wikipedia.org/wiki/Prothiokonazol",
    "externalLabel": "Wikipedia",
    "faq": [
      {
        "q": "Jaké choroby kontroluje prothiokonazol?",
        "a": "Prothiokonazol je účinný proti mnoha houbovým chorobám, včetně rzí a padlí."
      },
      {
        "q": "Jak se aplikuje prothiokonazol?",
        "a": "Aplikuje se postřikem na listy plodin."
      }
    ],
    "alias": []
  },
  {
    "slug": "jetel-lucni",
    "term": "Jetel lučný",
    "alias": [
      "Trifolium pratense"
    ],
    "kategorie": "plodiny",
    "shortDef": "Jetel lučný je vytrvalá pícnina pestovaná pre krmivo a zlepšenie pôdy.",
    "longDef": "Jetel lučný (Trifolium pratense) je vytrvalá rastlina z čeľade bobovitých, bežne pestovaná ako pícnina. Je cenený pre vysoký obsah bielkovín a schopnosť fixovať dusík, čím obohacuje pôdu. Na Slovensku sa často využíva v osevných postupoch pre zlepšenie pôdnej štruktúry a zvýšenie úrodnosti. Jetel lučný je tiež významnou súčasťou pastvín a lúk, kde slúži ako kvalitné krmivo pre dobytok.",
    "related": [
      "zelene-hnojeni",
      "hnuj",
      "organicka-hmota",
      "pH-pudy"
    ],
    "externalUrl": "https://cs.wikipedia.org/wiki/Jetel_lu%C4%8Dn%C3%AD",
    "externalLabel": "Wikipedia",
    "faq": [
      {
        "q": "K čemu slouží jetel luční?",
        "a": "Jetel luční se používá jako krmivo pro dobytek a také ke zlepšení půdní struktury díky fixaci dusíku."
      },
      {
        "q": "Jaké má jetel luční nároky na půdu?",
        "a": "Jetel luční preferuje dobře odvodněné, úrodné půdy s neutrálním pH."
      }
    ]
  },
  {
    "slug": "lupina",
    "term": "Lupina (vlčí bob)",
    "alias": [
      "Lupinus"
    ],
    "kategorie": "plodiny",
    "shortDef": "Lupina je rod rastlín využívaný na produkciu krmiva a zeleného hnojenia.",
    "longDef": "Lupina, známa tiež ako vlčí bob, patrí do čeľade bobovitých a zahŕňa niekoľko druhov rastlín, ktoré sa pestujú pre semená bohaté na bielkoviny. V poľnohospodárstve sa používa ako krmivo pre dobytok a ako zelené hnojenie vďaka schopnosti fixovať dusík. Na Slovensku je pestovanie lupiny menej časté, ale jej využitie rastie v ekologickom poľnohospodárstve pre zlepšenie pôdnej úrodnosti a ako alternatíva k sóji.",
    "related": [
      "zelene-hnojeni",
      "organicka-hmota",
      "pH-pudy",
      "hnuj"
    ],
    "externalUrl": "https://cs.wikipedia.org/wiki/Vl%C4%8D%C3%AD_bob",
    "externalLabel": "Wikipedia",
    "faq": [
      {
        "q": "K čemu se používá lupina?",
        "a": "Lupina se využívá jako krmivo pro zvířata a k zelenému hnojení."
      },
      {
        "q": "Jaké jsou výhody pěstování lupiny?",
        "a": "Lupina zlepšuje půdu fixací dusíku a je odolná vůči chudým půdám."
      }
    ]
  },
  {
    "slug": "bob-polni",
    "term": "Bob polný",
    "alias": [
      "Vicia faba"
    ],
    "kategorie": "plodiny",
    "shortDef": "Bob polný je strukovina pestovaná pre potravinárske a krmné účely.",
    "longDef": "Bob polný (Vicia faba) je rastlina z čeľade bobovitých, známa pre svoje veľké semená využívané v potravinárstve a ako krmivo pre zvieratá. Je cenený pre vysoký obsah bielkovín a vlákniny. Na Slovensku sa pestuje hlavne ako krmná plodina, ale jeho využitie v ľudskej výžive rastie vďaka rastúcemu záujmu o zdravú stravu a alternatívne zdroje bielkovín.",
    "related": [
      "zelene-hnojeni",
      "organicka-hmota",
      "hnuj",
      "pH-pudy"
    ],
    "externalUrl": "https://cs.wikipedia.org/wiki/Bob_poln%C3%AD",
    "externalLabel": "Wikipedia",
    "faq": [
      {
        "q": "Jaké jsou hlavní využití bobu polního?",
        "a": "Bob polní se využívá jako potravina pro lidi a krmivo pro zvířata."
      },
      {
        "q": "Jaký je rozdíl mezi bobem polním a fazolem?",
        "a": "Bob polní je větší a má odlišné nutriční složení než fazol."
      }
    ]
  },
  {
    "slug": "proso",
    "term": "Proso seté",
    "alias": [
      "Panicum miliaceum"
    ],
    "kategorie": "plodiny",
    "shortDef": "Proso seté je obilnina pestovaná pre potravinárske a krmné účely.",
    "longDef": "Proso seté (Panicum miliaceum) je jednoročná obilnina z čeľade lipnicovitých, známa pre svoje malé semená využívané v potravinárstve a ako krmivo. Je cenené pre svoju nenáročnosť na pôdne a klimatické podmienky, čo umožňuje jeho pestovanie aj v suchších oblastiach. Na Slovensku sa proso pestuje predovšetkým na výrobu krmív a ako surovina pre bezlepkové potraviny, čo je dôležité pre osoby s celiakiou.",
    "related": [
      "osevni-postup",
      "organicka-hmota",
      "pH-pudy",
      "hnuj"
    ],
    "externalUrl": "https://cs.wikipedia.org/wiki/Proso_set%C3%A9",
    "externalLabel": "Wikipedia",
    "faq": [
      {
        "q": "K čemu se používá proso seté?",
        "a": "Proso seté se využívá jako potravina pro lidi a krmivo pro zvířata."
      },
      {
        "q": "Jaké jsou výhody pěstování prosa?",
        "a": "Proso je odolné vůči suchu a má krátký vegetační cyklus."
      }
    ]
  },
  {
    "slug": "cirok",
    "term": "Čirok",
    "alias": [
      "Sorghum"
    ],
    "kategorie": "plodiny",
    "shortDef": "Čirok je obilnina pestovaná pre potravinárske a krmné účely.",
    "longDef": "Čirok (Sorghum) je rod rastlín z čeľade lipnicovitých, zahŕňajúci niekoľko druhov pestovaných ako obilnina pre ľudskú výživu a krmivo pre zvieratá. Je cenený pre svoju odolnosť voči suchu a schopnosť rastu v rôznych klimatických podmienkach. Na Slovensku je pestovanie čiroku menej rozšírené, ale jeho význam rastie vďaka záujmu o bezlepkové potraviny a alternatívne zdroje energie, ako je bioetanol.",
    "related": [
      "osevni-postup",
      "organicka-hmota",
      "pH-pudy",
      "hnuj"
    ],
    "externalUrl": "https://cs.wikipedia.org/wiki/%C4%8Cirok",
    "externalLabel": "Wikipedia",
    "faq": [
      {
        "q": "K čemu slouží čirok?",
        "a": "Čirok se využívá jako potravina, krmivo a také v průmyslu pro výrobu biopaliv."
      },
      {
        "q": "Jaké jsou výhody pěstování čiroku?",
        "a": "Čirok je odolný vůči suchu a má široké využití."
      }
    ]
  },
  {
    "slug": "pohanka",
    "term": "Pohanka obyčajná",
    "alias": [
      "Fagopyrum esculentum"
    ],
    "kategorie": "plodiny",
    "shortDef": "Pohanka obyčajná je pseudoobilnina pestovaná pre potravinárske účely.",
    "longDef": "Pohanka obyčajná (Fagopyrum esculentum) je jednoročná rastlina z čeľade rdesnovitých, pestovaná ako pseudoobilnina. Je cenená pre svoju nutričnú hodnotu, najmä vysoký obsah rutínu a bielkovín, a je obľúbená v bezlepkovej diéte. Na Slovensku sa pohanka tradične pestuje a konzumuje, a to najmä vo forme kaší, múky a ďalších potravinárskych výrobkov. Jej pestovanie je podporované pre jej pozitívny vplyv na pôdnu štruktúru a biodiverzitu.",
    "related": [
      "osevni-postup",
      "organicka-hmota",
      "pH-pudy",
      "hnuj"
    ],
    "externalUrl": "https://cs.wikipedia.org/wiki/Pohanka_obecn%C3%A1",
    "externalLabel": "Wikipedia",
    "faq": [
      {
        "q": "K čemu slouží pohanka obecná?",
        "a": "Pohanka se používá jako potravina pro lidi, známá pro své nutriční hodnoty."
      },
      {
        "q": "Jak se pěstuje pohanka?",
        "a": "Pohanka je nenáročná na půdu a roste dobře v chladnějších oblastech."
      }
    ]
  },
  {
    "slug": "svazenka",
    "term": "Svazenka vratičolistá",
    "kategorie": "plodiny",
    "shortDef": "Svazenka vratičolistá je jednoročná rastlina využívaná ako zelené hnojivo.",
    "longDef": "Svazenka vratičolistá (Phacelia tanacetifolia) je jednoročná rastlina z čeľade brutnákovitých. V poľnohospodárstve sa využíva predovšetkým ako medziplodina na zlepšenie štruktúry pôdy a obohatenie o organickú hmotu.\n\nVďaka rýchlemu rastu a schopnosti potláčať buriny je svazenka obľúbená v ekologickom poľnohospodárstve. Okrem toho priťahuje opeľovače, čo podporuje biodiverzitu.\n\nNa Slovensku je svazenka často využívaná v systémoch zeleného hnojenia a ako súčasť osevných postupov na zlepšenie pôdnej úrodnosti.",
    "related": [
      "zelene-hnojeni",
      "osevni-postup",
      "organicka-hmota"
    ],
    "externalUrl": "https://cs.wikipedia.org/wiki/Svazenka_vratičolistá",
    "externalLabel": "Wikipedia",
    "faq": [
      {
        "q": "K čemu slouží svazenka vratičolistá?",
        "a": "Svazenka vratičolistá se používá jako zelené hnojivo pro zlepšení půdní struktury a obohacení půdy o živiny."
      },
      {
        "q": "Jak se pěstuje svazenka vratičolistá?",
        "a": "Svazenka se vysévá na jaře nebo na podzim a je nenáročná na půdní podmínky."
      }
    ],
    "alias": []
  },
  {
    "slug": "cizrna",
    "term": "Cizrna",
    "kategorie": "plodiny",
    "shortDef": "Cizrna je strukovina známa pre vysoký obsah bielkovín a vlákniny.",
    "longDef": "Cizrna (Cicer arietinum) je strukovina patríca do čeľade bobovitých. Je cenená pre vysoký obsah bielkovín, vlákniny a ďalších živín.\n\nV poľnohospodárstve sa cizrna pestuje v oblastiach s teplým a suchým podnebím. Jej pestovanie prispieva k obohateniu pôdy o dusík vďaka symbióze s hlízkovými baktériami.\n\nNa Slovensku je pestovanie cizrny menej rozšírené, ale jej spotreba rastie vďaka popularite zdravej výživy.",
    "related": [
      "hnuj",
      "zelene-hnojeni",
      "osevni-postup",
      "organicka-hmota"
    ],
    "externalUrl": "https://cs.wikipedia.org/wiki/Cizrna",
    "externalLabel": "Wikipedia",
    "faq": [
      {
        "q": "Jaký je nutriční obsah cizrny?",
        "a": "Cizrna je bohatá na bílkoviny, vlákninu, vitamíny a minerály."
      },
      {
        "q": "Jak se připravuje cizrna k vaření?",
        "a": "Cizrnu je nutné před vařením namočit na několik hodin, ideálně přes noc."
      }
    ],
    "alias": []
  },
  {
    "slug": "vdj",
    "term": "VDJ – veľká dobytčia jednotka",
    "alias": [
      "veľká dobytčia jednotka"
    ],
    "kategorie": "chov",
    "shortDef": "VDJ je štandardizovaná jednotka na vyjadrenie veľkosti chovu hospodárskych zvierat.",
    "longDef": "Veľká dobytčia jednotka (VDJ) je štandardizovaná merná jednotka používaná na vyjadrenie veľkosti chovu hospodárskych zvierat. Jedna VDJ zodpovedá hmotnosti 500 kg živej hmotnosti.\n\nTáto jednotka umožňuje porovnávanie rôznych druhov zvierat a ich počtu v rámci poľnohospodárskych štatistík a plánovania.\n\nNa Slovensku je VDJ používaná v rámci poľnohospodárskych dotácií a plánovania kapacít pre chov hospodárskych zvierat.",
    "related": [
      "vykrm-skotu",
      "odchov-telat",
      "krizeni-plemen"
    ],
    "externalUrl": "https://cs.wikipedia.org/wiki/Velká_dobytčí_jednotka",
    "externalLabel": "Wikipedia",
    "faq": [
      {
        "q": "Jak se počítá velká dobytčí jednotka (VDJ)?",
        "a": "VDJ se počítá podle živé hmotnosti zvířat — 1 VDJ odpovídá 500 kg živé hmotnosti skotu. Pro jednotlivé kategorie a druhy se používají přepočítací koeficienty."
      },
      {
        "q": "K čemu slouží VDJ?",
        "a": "VDJ slouží k porovnávání a plánování kapacit chovů hospodářských zvířat."
      }
    ]
  },
  {
    "slug": "ecm-mleko",
    "term": "ECM – mlieko prepočítané na energiu",
    "alias": [
      "ECM"
    ],
    "kategorie": "chov",
    "shortDef": "ECM je ukazovateľ prepočítavajúci mlieko na štandardizovanú energetickú hodnotu.",
    "longDef": "ECM (Energy Corrected Milk) je ukazovateľ, ktorý prepočítava množstvo mlieka na štandardizovanú energetickú hodnotu. Tento prepočet zohľadňuje obsah tuku a bielkovín v mlieku.\n\nPoužíva sa na objektívne porovnanie produkcie mlieka medzi rôznymi chovmi a plemenami. ECM umožňuje poľnohospodárom lepšie hodnotiť efektivitu a ekonomiku mliečnej produkcie.\n\nNa Slovensku je ECM bežne využívané pri hodnotení mliečnych fariem a v rámci poľnohospodárskych štatistík.",
    "related": [
      "laktacni-krivka",
      "vykrm-skotu",
      "odchov-telat",
      "krizeni-plemen"
    ],
    "faq": [
      {
        "q": "Jak se počítá ECM mléko?",
        "a": "ECM mléko se přepočítává z běžného mléka na základě obsahu tuku a bílkovin, aby se standardizovala jeho energetická hodnota."
      },
      {
        "q": "Proč se používá ECM mléko?",
        "a": "ECM mléko umožňuje objektivní srovnání produkce mléka mezi různými plemeny a farmami."
      }
    ]
  },
  {
    "slug": "zaprahnuti",
    "term": "Zaprahnutie (stanie na suchu)",
    "alias": [
      "stanie na suchu"
    ],
    "kategorie": "chov",
    "shortDef": "Zaprahnutie je obdobie, keď dojnica prestáva byť dojená pred pôrodom.",
    "longDef": "Zaprahnutie, inak povedané stanie na suchu, je obdobie v chove dojníc, kedy krava prestáva byť dojená približne 60 dní pred očakávaným pôrodom. Toto obdobie je dôležité pre regeneráciu mliečnej žľazy a prípravu na ďalšiu laktáciu.\n\nPočas zaprahnutia sa mení kŕmna dávka a starostlivosť o zviera, aby sa zabezpečilo jeho zdravie a optimálne podmienky pre nadchádzajúci pôrod.\n\nNa Slovensku je zaprahnutie štandardnou súčasťou manažmentu chovu dojníc, ktorá prispieva k udržaniu vysokej produkcie mlieka a zdravia zvierat.",
    "related": [
      "laktacni-krivka",
      "vykrm-skotu",
      "odchov-telat",
      "krizeni-plemen"
    ],
    "faq": [
      {
        "q": "Co je zaprahnutí u dojnic?",
        "a": "Zaprahnutí je období před porodem, kdy dojnice přestává být dojena, aby se připravila na laktaci."
      },
      {
        "q": "Jak dlouho trvá zaprahnutí?",
        "a": "Zaprahnutí (stání na sucho) trvá obvykle přibližně 60 dní před očekávaným porodem, tedy zhruba osm týdnů."
      }
    ]
  },
  {
    "slug": "stelivo",
    "term": "Stelivo",
    "kategorie": "chov",
    "shortDef": "Stelivo je materiál používaný v chove zvierat na zabezpečenie pohodlia a hygieny.",
    "longDef": "Stelivo je materiál používaný v chove hospodárskych zvierat na zabezpečenie ich pohodlia a hygieny. Obvykle ide o slamu, piliny alebo špeciálne priemyselné produkty.\n\nStelivo pomáha udržiavať suché a čisté prostredie vo stajniach, čo prispieva k zdraviu zvierat a znižuje riziko ochorení.\n\nNa Slovensku je voľba steliva závislá na type chovu a dostupnosti materiálov, pričom sa čoraz viac využívajú ekologické a recyklovateľné materiály.",
    "related": [
      "hluboka-podestylka",
      "laktacni-krivka",
      "vykrm-skotu",
      "odchov-telat"
    ],
    "faq": [
      {
        "q": "Jaké materiály se používají jako stelivo?",
        "a": "Jako stelivo se často používají sláma, piliny, písek nebo speciální průmyslové materiály."
      },
      {
        "q": "Proč je stelivo důležité v chovu zvířat?",
        "a": "Stelivo zajišťuje pohodlí, hygienu a zdraví zvířat tím, že absorbuje vlhkost a snižuje riziko onemocnění."
      }
    ],
    "alias": []
  },
  {
    "slug": "hluboka-podestylka",
    "term": "Hlboká podestielka",
    "alias": [
      "hlboké lože",
      "hlboké stelivo"
    ],
    "kategorie": "chov",
    "shortDef": "Hlboká podestielka je metóda ustajnenia hospodárskych zvierat na vrstve slamy alebo iného materiálu, ktorá sa pravidelne dopĺňa.",
    "longDef": "Hlboká podestielka je spôsob ustajnenia, kde sa zvieratá chovajú na vrstve slamy alebo iného organického materiálu. Tento materiál sa pravidelne dopĺňa, ale neodstraňuje, čo umožňuje jeho postupné rozkládanie a vytváranie tepla. \n\nPoužíva sa predovšetkým v chove hovädzieho dobytka a ošípaných, kde zabezpečuje komfort a teplo pre zvieratá, a zároveň prispieva k lepšej hygiene. \n\nV praxi sa hlboká podestielka často kombinuje s inými systémami ustajnenia a je obľúbená pre svoju jednoduchosť a efektivitu v menších aj stredne veľkých chovoch.",
    "related": [
      "stelivo",
      "hnuj",
      "odchov-telat",
      "vykrm-skotu"
    ],
    "externalUrl": "https://cs.wikipedia.org/wiki/Podest%C3%BDlka",
    "externalLabel": "Wikipedia",
    "faq": [
      {
        "q": "Jak se udržuje hluboká podestýlka?",
        "a": "Hluboká podestýlka se pravidelně doplňuje čerstvým materiálem a starý se nechává rozkládat na místě."
      },
      {
        "q": "K čemu slouží hluboká podestýlka?",
        "a": "Slouží k zajištění pohodlí a tepelné izolace pro hospodářská zvířata."
      },
      {
        "q": "Jaký materiál se používá na hlubokou podestýlku?",
        "a": "Nejčastěji se používá sláma, ale lze využít i piliny nebo hobliny."
      }
    ]
  },
  {
    "slug": "laktacni-krivka",
    "term": "Laktačná krivka",
    "alias": [
      "produkčná krivka"
    ],
    "kategorie": "chov",
    "shortDef": "Laktačná krivka je grafické znázornenie produkcie mlieka u dojníc v priebehu laktácie.",
    "longDef": "Laktačná krivka predstavuje zmeny v produkcii mlieka u dojníc počas laktácie, obvykle trvajúcej okolo 305 dní. \n\nGraficky znázorňuje, ako produkcia mlieka stúpa po pôrode, dosahuje vrcholu a následne klesá. \n\nTáto krivka je kľúčová pre riadenie výživy a zdravia stáda, pretože pomáha optimalizovať kŕmenie a sledovať zdravotný stav dojníc. V SR sa používa v rámci moderných chovateľských systémov a je dôležitá pre zvyšovanie efektivity produkcie mlieka.",
    "related": [
      "ecm-mleko",
      "inseminace",
      "odchov-telat",
      "vykrm-skotu"
    ],
    "externalUrl": "https://cs.wikipedia.org/wiki/Lakta%C4%8Dn%C3%AD_k%C5%99ivka",
    "externalLabel": "Wikipedia",
    "faq": [
      {
        "q": "Jak se počítá laktační křivka?",
        "a": "Laktační křivka se vytváří na základě měření denní produkce mléka v průběhu laktace."
      },
      {
        "q": "K čemu slouží laktační křivka?",
        "a": "Slouží k monitorování a optimalizaci produkce mléka u dojnic."
      },
      {
        "q": "Jaký je rozdíl mezi laktační křivkou a výnosností mléka?",
        "a": "Laktační křivka zobrazuje průběh produkce mléka, zatímco výnosnost mléka je celkové množství mléka za laktaci."
      }
    ]
  },
  {
    "slug": "brakace",
    "term": "Brakácia (vyraďovanie zvierat)",
    "alias": [
      "vyraďovanie",
      "selektívne vyraďovanie"
    ],
    "kategorie": "chov",
    "shortDef": "Brakácia je proces vyraďovania zvierat z chovu na základe nevyhovujúcich vlastností alebo zdravotného stavu.",
    "longDef": "Brakácia je metóda selektívneho vyraďovania zvierat z chovu, ktorá sa používa na udržanie alebo zlepšenie kvality stáda. \n\nZvieratá môžu byť vyraďované kvôli genetickým vadám, nízkej produkcii, zdravotným problémom alebo nevhodnému správaniu. \n\nV praxi je brakácia dôležitá pre optimalizáciu chovných programov a zabezpečenie ekonomickej efektivity chovu. V SR je tento proces bežnou súčasťou riadenia chovov hovädzieho dobytka, ošípaných aj hydiny.",
    "related": [
      "inseminace",
      "odchov-telat",
      "vykrm-skotu",
      "krizeni-plemen"
    ],
    "externalUrl": "https://cs.wikipedia.org/wiki/Brakace",
    "externalLabel": "Wikipedia",
    "faq": [
      {
        "q": "Jak se provádí brakace zvířat?",
        "a": "Brakace se provádí na základě hodnocení zdravotního stavu a produkčních vlastností zvířat."
      },
      {
        "q": "K čemu slouží brakace?",
        "a": "Slouží k udržení a zlepšení kvality chovu."
      },
      {
        "q": "Jaký je rozdíl mezi brakací a selekcí?",
        "a": "Brakace je vyřazování nevhodných zvířat, zatímco selekce je výběr nejlepších jedinců pro chov."
      }
    ]
  },
  {
    "slug": "vykrm-skotu",
    "term": "Výkrm skotu",
    "alias": [
      "výkrm dobytka",
      "intenzívny výkrm"
    ],
    "kategorie": "chov",
    "shortDef": "Výkrm skotu je proces zvyšovania hmotnosti skotu za účelom produkcie mäsa.",
    "longDef": "Výkrm skotu je zameraný na zvyšovanie hmotnosti a zlepšenie mäsovej výťažnosti skotu. \n\nPoužívajú sa rôzne kŕmne stratégie, ktoré zahŕňajú vyváženú diétu s vysokým obsahom energie a bielkovín. \n\nV SR je výkrm skotu dôležitou súčasťou mäsového priemyslu a je riadený pravidlami pre welfare zvierat a efektívne využitie zdrojov. Výkrm sa často vykonáva v intenzívnych podmienkach, ale aj na pastvinách.",
    "related": [
      "hluboka-podestylka",
      "odchov-telat",
      "brakace",
      "inseminace"
    ],
    "externalUrl": "https://cs.wikipedia.org/wiki/V%C3%BDkrm_skotu",
    "externalLabel": "Wikipedia",
    "faq": [
      {
        "q": "Jak se provádí výkrm skotu?",
        "a": "Výkrm skotu se provádí prostřednictvím kontrolované diety zaměřené na zvyšování hmotnosti."
      },
      {
        "q": "K čemu slouží výkrm skotu?",
        "a": "Slouží k produkci masa a zajištění ekonomické efektivity chovu."
      },
      {
        "q": "Jaký je rozdíl mezi výkrmem a chovem skotu?",
        "a": "Výkrm je zaměřen na zvyšování hmotnosti, zatímco chov zahrnuje i reprodukci a péči o stádo."
      }
    ]
  },
  {
    "slug": "odchov-telat",
    "term": "Odchov teliat",
    "alias": [
      "odchov mláďat",
      "chov teliat"
    ],
    "kategorie": "chov",
    "shortDef": "Odchov teliat je proces starostlivosti a výživy teliat od narodenia do odstavu.",
    "longDef": "Odchov teliat zahŕňa starostlivosť o telatá od narodenia až po dosiahnutie veku, kedy sú schopné samostatne prijímať pevnú potravu. \n\nZahŕňa správnu výživu, zdravotnú starostlivosť a vhodné ustajnenie, ktoré sú kľúčové pre zdravý rast a vývoj. \n\nV SR je odchov teliat dôležitou súčasťou mliečneho aj mäsového chovu, s dôrazom na welfare zvierat a efektivitu chovu. Moderné metódy zahŕňajú napríklad používanie mliečnych náhrad a automatizovaných kŕmnych systémov.",
    "related": [
      "hluboka-podestylka",
      "laktacni-krivka",
      "vykrm-skotu",
      "brakace"
    ],
    "externalUrl": "https://cs.wikipedia.org/wiki/Odchov_telat",
    "externalLabel": "Wikipedia",
    "faq": [
      {
        "q": "Jak se provádí odchov telat?",
        "a": "Odchov telat zahrnuje správnou výživu, hygienu a zdravotní péči od narození do odstavu."
      },
      {
        "q": "K čemu slouží odchov telat?",
        "a": "Slouží k zajištění zdravého růstu a vývoje mladých zvířat."
      },
      {
        "q": "Jaký je rozdíl mezi odchovem a výkrmem telat?",
        "a": "Odchov se soustředí na růst a zdraví, zatímco výkrm na zvyšování hmotnosti."
      }
    ]
  },
  {
    "slug": "krizeni-plemen",
    "term": "Križovanie plemien",
    "alias": [
      "hybridizácia",
      "genetické križovanie"
    ],
    "kategorie": "chov",
    "shortDef": "Križovanie plemien je genetická metóda využívaná na získanie potomstva s žiaducimi vlastnosťami z rôznych plemien.",
    "longDef": "Križovanie plemien je proces, pri ktorom sa kombinujú genetické vlastnosti dvoch alebo viacerých plemien za účelom získania potomstva s lepšími produkčnými alebo adaptačnými vlastnosťami. \n\nTáto metóda sa využíva na zvýšenie odolnosti voči chorobám, zlepšenie rastu alebo produkcie mlieka. \n\nV SR je križovanie plemien bežnou praxou v chove hovädzieho dobytka, ošípaných a hydiny, a je regulované chovateľskými programami na zachovanie genetickej diverzity a zabezpečenie kvality produkcie.",
    "related": [
      "brakace",
      "inseminace",
      "odchov-telat",
      "vykrm-skotu"
    ],
    "externalUrl": "https://cs.wikipedia.org/wiki/K%C5%99%C3%AD%C5%BEen%C3%AD_plemen",
    "externalLabel": "Wikipedia",
    "faq": [
      {
        "q": "Jak se provádí křížení plemen?",
        "a": "Křížení plemen se provádí za účelem kombinace žádoucích vlastností dvou různých plemen."
      },
      {
        "q": "K čemu slouží křížení plemen?",
        "a": "Slouží k získání potomstva s lepšími produkčními nebo zdravotními vlastnostmi."
      },
      {
        "q": "Jaký je rozdíl mezi křížením a čistokrevným chovem?",
        "a": "Křížení kombinuje vlastnosti různých plemen, zatímco čistokrevný chov zachovává genetickou linii."
      }
    ]
  },
  {
    "slug": "n-senzor",
    "term": "N-senzor (dusíkový senzor)",
    "kategorie": "precise-farming",
    "shortDef": "N-senzor je zariadenie používané na optimalizáciu dávkovania dusíkatých hnojív na základe aktuálnej potreby rastlín.",
    "longDef": "N-senzor je technologické zariadenie, ktoré meria obsah chlorofylu v rastlinách pomocou spektrálnej analýzy. Tento prístroj pomáha poľnohospodárom určiť optimálnu dávku dusíkatých hnojív, čo vedie k efektívnejšiemu využitiu hnojív a zníženiu ich nadmerného použitia.\n\nPoužitie N-senzora umožňuje variabilné dávkovanie hnojív, čo zlepšuje výnosy a znižuje environmentálne dopady. Dáta získané z N-senzora sa často integrujú do aplikačných máp, ktoré sú potom využívané pri precíznom poľnohospodárstve.\n\nNa Slovensku sa N-senzory stávajú čoraz častejšou súčasťou moderného poľnohospodárstva, najmä u veľkých podnikov, ktoré sa zameriavajú na efektivitu a udržateľnosť.",
    "related": [
      "mapa-vra",
      "rtk-baze",
      "ec-pudy",
      "senzor-vlhkosti-pudy"
    ],
    "faq": [
      {
        "q": "K čemu slouží N-senzor?",
        "a": "N-senzor slouží k optimalizaci dávkování dusíkatých hnojiv podle aktuální potřeby rostlin."
      },
      {
        "q": "Jak funguje N-senzor?",
        "a": "N-senzor měří obsah chlorofylu v rostlinách pomocí spektrální analýzy, což pomáhá určit jejich potřebu dusíku."
      }
    ],
    "alias": []
  },
  {
    "slug": "mapa-vra",
    "term": "Aplikačná mapa (variabilné dávkovanie)",
    "kategorie": "precise-farming",
    "shortDef": "Aplikačná mapa je nástroj pre variabilné dávkovanie hnojív a pesticídov podľa potrieb jednotlivých častí poľa.",
    "longDef": "Aplikačná mapa je digitálna mapa, ktorá obsahuje informácie o variabilite pôdnych a rastlinných podmienok na poli. Tieto mapy sú vytvárané na základe dát z rôznych senzorov a analýz, ako sú N-senzory alebo satelitné snímky.\n\nVyužitie aplikačných máp umožňuje poľnohospodárom aplikovať hnojivá a pesticídy presne tam, kde sú najviac potrebné, čo zvyšuje efektivitu a znižuje náklady. Tento prístup tiež minimalizuje negatívne dopady na životné prostredie.\n\nNa Slovensku sa aplikačné mapy stávajú bežnou praxou v rámci precízneho poľnohospodárstva, najmä u podnikov, ktoré investujú do moderných technológií a udržateľného hospodárenia.",
    "related": [
      "n-senzor",
      "rtk-baze",
      "fmis",
      "ec-pudy"
    ],
    "faq": [
      {
        "q": "Jak se vytváří aplikační mapa?",
        "a": "Aplikační mapa se vytváří na základě dat z půdních analýz a senzorů."
      },
      {
        "q": "K čemu slouží aplikační mapa?",
        "a": "Slouží k variabilnímu dávkování hnojiv a pesticidů na poli."
      }
    ],
    "alias": []
  },
  {
    "slug": "rtk-baze",
    "term": "RTK báza",
    "kategorie": "precise-farming",
    "shortDef": "RTK báza je referenčná stanica pre zabezpečenie vysokej presnosti GPS navigácie v poľnohospodárstve.",
    "longDef": "RTK báza je stacionárna GPS stanica, ktorá poskytuje korekčné signály pre zvýšenie presnosti polohových dát z GPS prijímačov. RTK technológia umožňuje dosiahnuť presnosť polohovania na úrovni centimetrov.\n\nV poľnohospodárstve sa RTK báza využíva pre presné riadenie strojov, ako je sekanie, aplikácia hnojív a zber, čo zvyšuje efektivitu a znižuje straty. Presná navigácia umožňuje tiež lepšie využitie pôdy a zníženie prekryvov pri aplikácii.\n\nNa Slovensku je RTK technológia čoraz viac využívaná, najmä u veľkých poľnohospodárskych podnikov, ktoré investujú do precízneho poľnohospodárstva pre zvýšenie produktivity a udržateľnosti.",
    "related": [
      "n-senzor",
      "mapa-vra",
      "fmis",
      "senzor-vlhkosti-pudy"
    ],
    "faq": [
      {
        "q": "Co je to RTK báze?",
        "a": "RTK báze je referenční stanice pro zajištění vysoké přesnosti GPS navigace."
      },
      {
        "q": "Jaký je rozdíl mezi RTK a standardní GPS?",
        "a": "RTK poskytuje přesnost na centimetry, zatímco standardní GPS na metry."
      }
    ],
    "alias": []
  },
  {
    "slug": "fmis",
    "term": "Farmársky informačný systém (FMIS)",
    "kategorie": "precise-farming",
    "shortDef": "FMIS je softvérový systém pre riadenie a optimalizáciu poľnohospodárskych operácií a zdrojov.",
    "longDef": "Farmársky informačný systém (FMIS) je komplexná softvérová platforma, ktorá integruje dáta z rôznych zdrojov, ako sú senzory, GPS a aplikačné mapy, pre efektívne riadenie poľnohospodárskych činností.\n\nFMIS umožňuje poľnohospodárom plánovať a monitorovať operácie, optimalizovať využitie zdrojov a zlepšovať rozhodovacie procesy. Systém podporuje tiež sledovanie nákladov, výnosov a dodržiavanie legislatívnych požiadaviek.\n\nNa Slovensku sa FMIS stáva dôležitým nástrojom pre moderných poľnohospodárov, ktorí usilujú o zvyšovanie efektivity a udržateľnosti svojich podnikov, a je často integrovaný s ďalšími technológiami precízneho poľnohospodárstva.",
    "related": [
      "n-senzor",
      "mapa-vra",
      "rtk-baze",
      "ec-pudy"
    ],
    "faq": [
      {
        "q": "Co je to FMIS?",
        "a": "FMIS je softwarový systém pro řízení a optimalizaci zemědělských operací a zdrojů."
      },
      {
        "q": "Jaké funkce nabízí FMIS?",
        "a": "FMIS nabízí funkce jako plánování, sledování a analýzu zemědělských činností."
      }
    ],
    "alias": []
  },
  {
    "slug": "ec-pudy",
    "term": "Elektrická vodivosť pôdy (EC)",
    "kategorie": "precise-farming",
    "shortDef": "Elektrická vodivosť pôdy je meranie schopnosti pôdy viesť elektrický prúd, čo indikuje jej vlastnosti.",
    "longDef": "Elektrická vodivosť pôdy (EC) je indikátor, ktorý meria schopnosť pôdy viesť elektrický prúd. Toto meranie poskytuje informácie o pôdnej štruktúre, obsahu solí a vlhkosti, čo sú kľúčové faktory pre rast rastlín.\n\nV poľnohospodárstve sa meranie EC využíva k mapovaniu variability pôdy na poliach, čo pomáha pri rozhodovaní o aplikácii hnojív a zavlažovaní. Vyššia EC môže indikovať vyšší obsah živín, ale aj potenciálne problémy so zasolením.\n\nNa Slovensku je meranie EC čoraz viac využívané v rámci precízneho poľnohospodárstva, kde pomáha optimalizovať poľnohospodárske postupy a zvyšovať výnosy.",
    "related": [
      "n-senzor",
      "mapa-vra",
      "senzor-vlhkosti-pudy",
      "fmis"
    ],
    "faq": [
      {
        "q": "Co znamená elektrická vodivost půdy?",
        "a": "Je to měření schopnosti půdy vést elektrický proud, což indikuje její vlastnosti."
      },
      {
        "q": "Jak se měří elektrická vodivost půdy?",
        "a": "Měří se pomocí speciálních senzorů, které zaznamenávají průchod elektrického proudu."
      }
    ],
    "alias": []
  },
  {
    "slug": "senzor-vlhkosti-pudy",
    "term": "Senzor pôdnej vlhkosti",
    "kategorie": "precise-farming",
    "shortDef": "Senzor pôdnej vlhkosti je zariadenie na meranie obsahu vody v pôde.",
    "longDef": "Senzor pôdnej vlhkosti je zariadenie, ktoré meria množstvo vody v pôde. Tieto senzory poskytujú kľúčové informácie pre efektívne riadenie zavlažovania a optimalizáciu rastu plodín.\n\nV poľnohospodárstve sa senzory pôdnej vlhkosti používajú na monitorovanie stavu pôdy, čo umožňuje presné zavlažovanie a minimalizáciu vodných strát. Dáta zo senzorov môžu byť integrované do farmárskych informačných systémov pre lepšie rozhodovanie.\n\nNa Slovensku sú senzory pôdnej vlhkosti čoraz častejšie využívané v rámci precízneho poľnohospodárstva, kde pomáhajú zvyšovať efektivitu využívania vody a zlepšovať výnosy.",
    "related": [
      "n-senzor",
      "mapa-vra",
      "rtk-baze",
      "ec-pudy"
    ],
    "faq": [
      {
        "q": "Co je to senzor půdní vlhkosti?",
        "a": "Je to zařízení pro měření obsahu vody v půdě."
      },
      {
        "q": "Jak funguje senzor půdní vlhkosti?",
        "a": "Funguje na principu měření elektrické vodivosti nebo kapacity půdy."
      }
    ],
    "alias": []
  },
  {
    "slug": "matif",
    "term": "MATIF (parížska komoditná burza)",
    "alias": [
      "MATIF",
      "Parížska burza"
    ],
    "kategorie": "dotace",
    "shortDef": "MATIF je parížska komoditná burza špecializujúca sa na obchodovanie s futures kontraktmi.",
    "longDef": "MATIF, známa ako parížska komoditná burza, je významná európska burza zameraná na obchodovanie s futures kontraktmi na poľnohospodárske komodity a finančné produkty. \n\nBurza poskytuje platformu pre obchodovanie s komoditami ako sú pšenica, kukurica a ďalšie poľnohospodárske produkty, čo umožňuje producentom a obchodníkom zaisťovať ceny a riadiť riziká. \n\nNa Slovensku slúži MATIF ako referenčný bod pre stanovenie cien poľnohospodárskych komodít, čo je dôležité pre producentov pri plánovaní a uzatváraní obchodných zmlúv.",
    "related": [
      "komoditni-burza",
      "forwardovy-kontrakt",
      "bazicka-cena",
      "intervencni-nakup"
    ],
    "externalUrl": "https://cs.wikipedia.org/wiki/MATIF",
    "externalLabel": "Wikipedia",
    "faq": [
      {
        "q": "Co je MATIF?",
        "a": "MATIF je pařížská komoditní burza specializující se na obchodování s futures kontrakty."
      },
      {
        "q": "Jaké komodity se obchodují na MATIF?",
        "a": "Na MATIF se obchodují zemědělské komodity jako pšenice, kukuřice a řepka."
      },
      {
        "q": "Jak funguje obchodování na MATIF?",
        "a": "Obchodování na MATIF probíhá prostřednictvím futures kontraktů, které umožňují spekulaci na budoucí ceny komodit."
      }
    ]
  },
  {
    "slug": "intervencni-nakup",
    "term": "Intervenčný nákup",
    "alias": [
      "Intervencia",
      "Nákup intervencie"
    ],
    "kategorie": "dotace",
    "shortDef": "Intervenčný nákup je mechanizmus, ktorým štát stabilizuje trh s komoditami.",
    "longDef": "Intervenčný nákup je ekonomický nástroj, ktorý využívajú štáty alebo nadnárodné organizácie na reguláciu cien poľnohospodárskych komodít na trhu. \n\nCieľom intervenčného nákupu je stabilizácia cien a ochrana príjmov poľnohospodárov v čase, keď trhové ceny klesajú pod určitú úroveň. \n\nNa Slovensku sa tento nástroj používa v rámci spoločnej poľnohospodárskej politiky EÚ, kde Európska únia môže nakupovať prebytky produkcie a tým udržiavať stabilitu trhu.",
    "related": [
      "matif",
      "komoditni-burza",
      "bazicka-cena",
      "forwardovy-kontrakt"
    ],
    "externalUrl": "https://cs.wikipedia.org/wiki/Interven%C4%8Dn%C3%AD_n%C3%A1kup",
    "externalLabel": "Wikipedia",
    "faq": [
      {
        "q": "K čemu slouží intervenční nákup?",
        "a": "Intervenční nákup slouží ke stabilizaci trhu s komoditami tím, že stát nakupuje přebytky produkce."
      },
      {
        "q": "Jak funguje intervenční nákup?",
        "a": "Stát stanoví cenu, za kterou je ochoten nakupovat komodity, pokud tržní cena klesne pod tuto úroveň."
      },
      {
        "q": "Které komodity jsou obvykle zahrnuty do intervenčních nákupů?",
        "a": "Nejčastěji se jedná o základní zemědělské komodity, jako je pšenice a mléko."
      }
    ]
  },
  {
    "slug": "komoditni-burza",
    "term": "Komoditná burza",
    "alias": [
      "Burza komodít",
      "Trh komodít"
    ],
    "kategorie": "dotace",
    "shortDef": "Komoditná burza je trh, kde sa obchoduje s komoditami ako sú poľnohospodárske produkty a suroviny.",
    "longDef": "Komoditná burza je organizovaný trh, kde sa obchoduje s fyzickými komoditami a derivátmi na tieto komodity. Na burze sa obchoduje s produktmi ako pšenica, kukurica, ropa, kovy a ďalšie suroviny, čo umožňuje producentom a obchodníkom zaisťovať ceny a riadiť riziká. Na Slovensku a v Európe hrajú komoditné burzy kľúčovú úlohu v určovaní cien poľnohospodárskych produktov, čo je dôležité pre plánovanie a obchodné stratégie poľnohospodárov.",
    "related": [
      "matif",
      "intervencni-nakup",
      "bazicka-cena",
      "forwardovy-kontrakt"
    ],
    "externalUrl": "https://cs.wikipedia.org/wiki/Komoditn%C3%AD_burza",
    "externalLabel": "Wikipedia",
    "faq": [
      {
        "q": "Co je komoditní burza?",
        "a": "Komoditní burza je trh, kde se obchoduje s fyzickými komoditami a deriváty na ně."
      },
      {
        "q": "Jaké komodity se obchodují na komoditních burzách?",
        "a": "Obchodují se zemědělské produkty, energetické suroviny a kovy."
      },
      {
        "q": "Jaký je rozdíl mezi komoditní a akciovou burzou?",
        "a": "Komoditní burza obchoduje s fyzickými produkty a jejich deriváty, zatímco akciová burza obchoduje s cennými papíry."
      }
    ]
  },
  {
    "slug": "bazicka-cena",
    "term": "Bazická cena (basis)",
    "alias": [
      "Basis",
      "Základná cena"
    ],
    "kategorie": "dotace",
    "shortDef": "Bazická cena je rozdiel medzi cenou komodity na miestnom trhu a jej cenou na futures trhu.",
    "longDef": "Bazická cena, známa tiež ako basis, je rozdiel medzi spotovou cenou komodity na miestnom trhu a jej cenou na futures trhu. \n\nTento rozdiel je kľúčovým ukazovateľom pre obchodníkov, ktorí využívajú futures kontrakty na zaisťovanie proti cenovým výkyvom. \n\nNa Slovensku je sledovanie bazickej ceny dôležité pre poľnohospodárov a obchodníkov pri rozhodovaní o predaji alebo nákupe komodít, najmä v súvislosti s cenami na burzách ako MATIF.",
    "related": [
      "matif",
      "komoditni-burza",
      "forwardovy-kontrakt",
      "intervencni-nakup"
    ],
    "externalUrl": "https://cs.wikipedia.org/wiki/Bazick%C3%A1_cena",
    "externalLabel": "Wikipedia",
    "faq": [
      {
        "q": "Jak se počítá bazická cena?",
        "a": "Bazická cena se počítá jako rozdíl mezi spotovou cenou komodity a její cenou na futures trhu."
      },
      {
        "q": "K čemu slouží bazická cena?",
        "a": "Bazická cena pomáhá obchodníkům a producentům rozhodovat o prodeji nebo skladování komodity."
      },
      {
        "q": "Jaký je rozdíl mezi bazickou cenou a futures cenou?",
        "a": "Futures cena je cena dohodnutá pro budoucí dodání, zatímco bazická cena je rozdíl mezi futures a spotovou cenou."
      }
    ]
  },
  {
    "slug": "forwardovy-kontrakt",
    "term": "Forwardový kontrakt",
    "alias": [
      "Forward",
      "Termínový kontrakt"
    ],
    "kategorie": "dotace",
    "shortDef": "Forwardový kontrakt je zmluva o budúcom predaji alebo nákupe komodity za vopred stanovenú cenu.",
    "longDef": "Forwardový kontrakt je finančný nástroj, ktorý umožňuje dvom stranám dohodnúť sa na predaji alebo nákupe komodity k určitému dátumu v budúcnosti za vopred stanovenú cenu. \n\nTento typ kontraktu sa často používa na zaisťovanie proti cenovým výkyvom na trhu, čo je dôležité pre producentov a obchodníkov. \n\nNa Slovensku sú forwardové kontrakty bežne používané v poľnohospodárstve na zabezpečenie stabilných príjmov a plánovanie produkcie, najmä v súvislosti s cenami na burzách ako MATIF.",
    "related": [
      "matif",
      "komoditni-burza",
      "bazicka-cena",
      "intervencni-nakup"
    ],
    "externalUrl": "https://cs.wikipedia.org/wiki/Forwardov%C3%BD_kontrakt",
    "externalLabel": "Wikipedia",
    "faq": [
      {
        "q": "Co je forwardový kontrakt?",
        "a": "Forwardový kontrakt je dohoda o budoucím prodeji nebo nákupu komodity za předem stanovenou cenu."
      },
      {
        "q": "Jaký je rozdíl mezi forwardovým a futures kontraktem?",
        "a": "Forwardový kontrakt je individuální dohoda mezi dvěma stranami, zatímco futures kontrakt je standardizovaný a obchodovaný na burze."
      },
      {
        "q": "K čemu slouží forwardové kontrakty?",
        "a": "Forwardové kontrakty slouží k zajištění proti cenovým výkyvům a plánování budoucích dodávek."
      }
    ]
  },
  {
    "slug": "skladne",
    "term": "Skladné (skladovací poplatok)",
    "alias": [
      "Skladovací poplatok",
      "Poplatok za skladovanie"
    ],
    "kategorie": "dotace",
    "shortDef": "Skladné je poplatok za uskladnenie komodít vo skladoch.",
    "longDef": "Skladné, známe tiež ako skladovací poplatok, je suma účtovaná za uskladnenie komodít vo skladoch po určitú dobu. \n\nTento poplatok pokrýva náklady na skladovanie, ako sú energie, údržba a bezpečnosť, a je dôležitým faktorom pri kalkulácii celkových nákladov na obchodovanie s komoditami. \n\nNa Slovensku je skladné bežne účtované poľnohospodárom a obchodníkom, ktorí potrebujú uskladniť svoje produkty pred ich predajom alebo distribúciou.",
    "related": [
      "komoditni-burza",
      "forwardovy-kontrakt",
      "bazicka-cena",
      "intervencni-nakup"
    ],
    "externalUrl": "https://cs.wikipedia.org/wiki/Skladn%C3%A9",
    "externalLabel": "Wikipedia",
    "faq": [
      {
        "q": "Co je skladné?",
        "a": "Skladné je poplatek za uskladnění komodit ve skladech."
      },
      {
        "q": "Jak se určuje výše skladného?",
        "a": "Výše skladného se obvykle určuje na základě délky skladování a objemu komodity."
      },
      {
        "q": "Proč je skladné důležité?",
        "a": "Skladné je důležité pro pokrytí nákladů na údržbu a provoz skladovacích prostor."
      }
    ]
  },
  {
    "slug": "susina",
    "term": "Sušina (% sušiny)",
    "alias": [
      "sušina"
    ],
    "kategorie": "jednotky",
    "shortDef": "Sušina je podiel pevnej hmoty v materiáli po odstránení vody, vyjadrený v percentách.",
    "longDef": "Sušina predstavuje množstvo pevnej hmoty, ktoré zostane po odstránení všetkej vody z materiálu, a je vyjadrená v percentách. Používa sa na hodnotenie kvality krmív, plodín a ďalších poľnohospodárskych produktov, pretože poskytuje informácie o obsahu živín. V praxi sa sušina často meria pomocou sušiarne alebo špeciálnych laboratórnych zariadení. Na Slovensku je sušina dôležitým parametrom pri stanovení kvality krmív pre hospodárske zvieratá.",
    "related": [
      "digestat",
      "kejda",
      "hnuj"
    ],
    "externalUrl": "https://cs.wikipedia.org/wiki/Su%C5%A1ina",
    "externalLabel": "Wikipedia",
    "faq": [
      {
        "q": "Jak se měří sušina?",
        "a": "Sušina se měří sušením vzorku při stanovené teplotě, dokud nedosáhne konstantní hmotnosti."
      },
      {
        "q": "Proč je sušina důležitá v zemědělství?",
        "a": "Sušina je klíčová pro hodnocení kvality krmiv a odhadu výnosů plodin."
      }
    ]
  },
  {
    "slug": "nel",
    "term": "NEL – netto energia laktácie",
    "alias": [
      "netto energia laktácie"
    ],
    "kategorie": "jednotky",
    "shortDef": "NEL je jednotka merajúca dostupnú energiu pre produkciu mlieka u dojníc.",
    "longDef": "Netto energia laktácie (NEL) je jednotka používaná na vyjadrenie množstva energie, ktorú krmivo poskytuje pre produkciu mlieka u dojníc. Táto hodnota zohľadňuje energiu potrebnú na údržbu a rast zvieraťa. NEL sa vypočítava na základe obsahu energie v krmive a jeho stráviteľnosti. V praxi sa využíva na optimalizáciu kŕmných dávok a zabezpečenie efektívnej produkcie mlieka. Na Slovensku je NEL kľúčovým parametrom pri formulácii kŕmných zmesí pre mliečny dobytok.",
    "related": [
      "ecm-mleko",
      "laktacni-krivka",
      "krizeni-plemen",
      "vykrm-skotu"
    ],
    "externalUrl": "https://cs.wikipedia.org/wiki/Netto_energie_laktace",
    "externalLabel": "Wikipedia",
    "faq": [
      {
        "q": "Jak se počítá NEL?",
        "a": "NEL se počítá na základě energetického obsahu krmiva, který je k dispozici pro produkci mléka."
      },
      {
        "q": "K čemu slouží NEL v chovu dojnic?",
        "a": "NEL slouží k optimalizaci krmných dávek pro maximální produkci mléka při zachování zdraví dojnic."
      }
    ]
  },
  {
    "slug": "pdi",
    "term": "PDI – stráviteľný proteín",
    "alias": [
      "stráviteľný proteín"
    ],
    "kategorie": "jednotky",
    "shortDef": "PDI je jednotka pre meranie množstva stráviteľného proteínu v krmive.",
    "longDef": "PDI, neboli stráviteľný proteín, je jednotka používaná na vyjadrenie množstva proteínu, ktorý je skutočne stráviteľný a využiteľný zvieraťom. Tento ukazovateľ je kľúčový pri hodnotení kvality krmív, najmä pre prežúvavce. Výpočet PDI zahŕňa analýzu obsahu proteínu a jeho stráviteľnosti v tráviacom trakte. Na Slovensku sa PDI používa pri formulácii kŕmných zmesí, aby bola zabezpečená optimálna výživa hospodárskych zvierat.",
    "related": [
      "hnuj",
      "digestat",
      "kejda"
    ],
    "externalUrl": "https://cs.wikipedia.org/wiki/Straviteln%C3%BD_protein",
    "externalLabel": "Wikipedia",
    "faq": [
      {
        "q": "Jak se určuje PDI?",
        "a": "PDI se určuje laboratorními analýzami, které měří stravitelnost proteinů v krmivu."
      },
      {
        "q": "Proč je PDI důležité pro výživu zvířat?",
        "a": "PDI pomáhá zajistit, že zvířata dostávají dostatečné množství stravitelných proteinů pro růst a produkci."
      }
    ]
  },
  {
    "slug": "vynos-t-ha",
    "term": "Výnos (t/ha)",
    "alias": [
      "výnos"
    ],
    "kategorie": "jednotky",
    "shortDef": "Výnos je množstvo produkcie získané z jedného hektára pôdy, vyjadrené v tunách.",
    "longDef": "Výnos (t/ha) je kľúčová jednotka používaná na vyjadrenie množstva poľnohospodárskej produkcie zozbieranej z jedného hektára pôdy. Tento ukazovateľ je zásadný pre hodnotenie efektivity pestovania plodín a plánovanie poľnohospodárskych činností. Výnos závisí na mnohých faktoroch, vrátane kvality pôdy, klimatických podmienok a použitých agronomických postupov. Na Slovensku je výnos dôležitým parametrom pre hodnotenie ekonomickej efektivity poľnohospodárskych podnikov.",
    "related": [
      "osevni-postup",
      "strip-till",
      "mulcovac"
    ],
    "externalUrl": "https://cs.wikipedia.org/wiki/V%C3%BDnos",
    "externalLabel": "Wikipedia",
    "faq": [
      {
        "q": "Jak se počítá výnos v tunách na hektar?",
        "a": "Výnos se počítá dělením celkové produkce v tunách plochou obdělávané půdy v hektarech."
      },
      {
        "q": "Co ovlivňuje výnos plodin?",
        "a": "Výnos ovlivňuje kvalita půdy, klimatické podmínky, použitá agrotechnika a odrůda plodiny."
      }
    ]
  },
  {
    "slug": "objemova-hmotnost-obili",
    "term": "Objemová hmotnosť obilnín",
    "alias": [
      "objemová hmotnosť"
    ],
    "kategorie": "jednotky",
    "shortDef": "Objemová hmotnosť obilnín je hmotnosť obilnín na jednotku objemu, vyjadrená v kg/m³.",
    "longDef": "Objemová hmotnosť obilnín je mierka hustoty obilnín, ktorá udáva hmotnosť v kilogramoch na meter kubický (kg/m³). Tento ukazovateľ je dôležitý pre hodnotenie kvality a skladovateľnosti obilnín. Vyššia objemová hmotnosť zvyčajne znamená lepšiu kvalitu zrna. Meranie sa vykonáva pomocou špeciálnych zariadení, ako sú objemové hustomery. Na Slovensku je objemová hmotnosť kľúčovým parametrom pri obchodovaní s obilninami a stanovovaní ceny.",
    "related": [
      "komoditni-burza",
      "intervencni-nakup",
      "matif",
      "forwardovy-kontrakt"
    ],
    "externalUrl": "https://cs.wikipedia.org/wiki/Objemov%C3%A1_hmotnost",
    "externalLabel": "Wikipedia",
    "faq": [
      {
        "q": "Jak se měří objemová hmotnost obilí?",
        "a": "Objemová hmotnost se měří vážením známého objemu obilí a výpočtem hmotnosti na metr krychlový."
      },
      {
        "q": "Proč je objemová hmotnost důležitá?",
        "a": "Objemová hmotnost je indikátorem kvality obilí."
      }
    ]
  },
  {
    "slug": "davka-l-ha",
    "term": "Aplikačná dávka (l/ha)",
    "alias": [
      "aplikačná dávka"
    ],
    "kategorie": "jednotky",
    "shortDef": "Aplikačná dávka je množstvo kvapaliny aplikované na jeden hektár pôdy, vyjadrené v litroch.",
    "longDef": "Aplikačná dávka (l/ha) je jednotka používaná na vyjadrenie množstva kvapalného prípravku, ako sú hnojivá alebo pesticídy, aplikovaného na jeden hektár pôdy. Správne určenie aplikačnej dávky je kľúčové pre efektívne a bezpečné použitie agrochemikálií. Dávka závisí na druhu prípravku, type plodiny a podmienkach prostredia. Na Slovensku sa aplikačné dávky riadia legislatívnymi normami a odporúčaniami výrobcov, aby bola zabezpečená ochrana životného prostredia a zdravia ľudí.",
    "related": [
      "herbicidy",
      "insekticidy",
      "fungicidy",
      "adjuvant"
    ],
    "externalUrl": "https://cs.wikipedia.org/wiki/Aplika%C4%8Dn%C3%AD_d%C3%A1vka",
    "externalLabel": "Wikipedia",
    "faq": [
      {
        "q": "Jak se určuje aplikační dávka v litrech na hektar?",
        "a": "Aplikační dávka se určuje na základě doporučení výrobce a specifických potřeb plodiny."
      },
      {
        "q": "K čemu slouží aplikační dávka?",
        "a": "Aplikační dávka zajišťuje efektivní pokrytí plochy pesticidy nebo hnojivy."
      }
    ]
  }
];

export const KATEGORIE_LABELS_SK: Record<SlovnikKategorie, string> = {
  "technologie": "Technológie",
  "pohon": "Pohon a motor",
  "hnojivo": "Hnojivá",
  "dotace": "Dotácie a podpory",
  "agrotechnika": "Agrotechnika",
  "regulace": "Regulácie a normy",
  "precise-farming": "Presné poľnohospodárstvo",
  "jednotky": "Jednotky a meranie",
  "historie": "História a archaické pojmy",
  "chov": "Chov a živočíšna výroba",
  "slang": "Hovorové výrazy a slang",
  "ochrana": "Ochrana rastlín a postreky",
  "plodiny": "Plodiny a komodity",
  "vcelarstvi": "Včelárstvo"
};
