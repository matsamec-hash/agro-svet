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
    "shortDef": "AdBlue je 32,5% vodný roztok močoviny, ktorý sa vstrekuje do výfuku dieselových motorov, kde redukuje oxidy dusíka (NOx) na neškodný dusík a vodu.",
    "longDef": "AdBlue je obchodný názov pre vodný roztok močoviny (CO(NH₂)₂) v koncentrácii 32,5 %. Používa sa v systémoch selektívnej katalytickej redukcie (SCR) v dieselových motoroch — vstrekuje sa pred SCR katalyzátor, kde reaguje s oxidmi dusíka z výfukových plynov.\n\nBez funkčného AdBlue moderný traktor (od emisnej normy Stage IV / Tier 4 Final) zníži výkon alebo sa úplne vypne — riadiaca jednotka detekuje nízku hladinu alebo nekvalitné AdBlue a aktivuje tzv. \"limp mode\".\n\nSpotreba AdBlue je typicky 3–5 % objemu nafty (na 100 l nafty cca 3–5 l AdBlue). Cena sa pohybuje okolo 15–25 Kč/l v IBC kontajneroch (1000 l), v 10-litrových kanistroch až 40 Kč/l.\n\nPozor na kvalitu — kontaminované AdBlue (prach, organické nečistoty) zničí drahý SCR katalyzátor (oprava 100 000+ Kč). Norma ISO 22241 špecifikuje čistotu — kupujte vždy s certifikátom.",
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
    "longDef": "DPF je porézny keramický filter (typicky cordierit alebo karbid kremíka) inštalovaný za turbodúchadlom. Zachytáva pevné častice (PM, sadze) z výfukových plynov — bez neho by moderný diesel nesplnil emisné limity Stage IV / Stage V.\n\nFilter sa postupne zanáša a musí sa \"regenerovať\" — vypáliť sadze na CO₂. Existujú tri spôsoby:\n1. **Pasívna regenerácia** — pri vysokej teplote výfuku (>600 °C, napr. pri plnom ťahu), sadze sa vypália samy.\n2. **Aktívna regenerácia** — riadiaca jednotka vstrekne malé množstvo nafty na zvýšenie teploty výfuku (beží automaticky na pozadí).\n3. **Servisná regenerácia** — ak prvé dve zlyhajú (krátke jazdy, nízka záťaž), nutná návšteva servisu.\n\nPri traktoroch je tretí scenár zriedkavý — traktor obvykle pracuje pod záťažou dlhé hodiny. Problémy nastávajú hlavne pri traktoroch na drobné komunálne práce (krátke rozjazdy, nízka teplota).\n\nŽivotnosť DPF: 8 000–15 000 motohodín podľa značky a údržby. Výmena stojí 80 000–200 000 Kč. Neodporúčame demontáž (DPF delete) — nelegálne, znehodnocuje stroj pri predaji a hrozí pokuta pri kontrole.",
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
    "shortDef": "SCR je systém na redukciu oxidov dusíka (NOx) vo výfukových plynoch dieselových motorov pomocou vstrekovania AdBlue do špeciálneho katalyzátora.",
    "longDef": "Selektívna katalytická redukcia (SCR) je technológia čistenia výfukových plynov, ktorá redukuje NOx (oxidy dusíka) na neškodný dusík (N₂) a vodu (H₂O). Princíp:\n\n1. AdBlue (32,5% močovina) sa vstrekne pred SCR katalyzátor.\n2. Vysoká teplota výfuku rozkladá močovinu na amoniak (NH₃).\n3. NH₃ reaguje v katalyzátore s NOx za prítomnosti drahých kovov (vanád, wolfram) — vznikne N₂ a H₂O.\n\nSCR je dominantná technológia pre emisné normy Stage IV (od 2014) a Stage V (od 2020) pri poľnohospodárskych traktoroch. Alternatíva bola EGR (recirkulácia výfukových plynov) + DPF, ale tá vedie k vyššej spotrebe nafty (preto výrobcovia typu Fendt, JD, NH zvolili SCR ako primárnu cestu).\n\nŽivotnosť SCR katalyzátora je 8 000–15 000 motohodín. Výmena 100 000–250 000 Kč. Hlavné riziko: kontaminácia AdBlue (nečistoty, nesprávna koncentrácia) → zničenie v desiatkach hodín.",
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
    "shortDef": "Stage (EÚ) a Tier (USA) sú postupne sprísňované emisné normy pre vznetové motory necestných strojov — od Stage I (1999) po súčasnú Stage V (2020).",
    "longDef": "Emisné normy pre dieselové motory necestných pojazdných strojov (NRMM — Non-Road Mobile Machinery) sa v EÚ označujú ako Stage, v USA ako Tier. Norma reguluje limity emisií pevných častíc (PM), oxidov dusíka (NOx), uhľovodíkov (HC) a oxidu uhoľnatého (CO).\n\nHlavné míľniky pre traktory v EÚ:\n- **Stage I** (1999–2001): základné limity, bez DPF a SCR.\n- **Stage II** (2001–2006): mierne zníženie NOx + PM.\n- **Stage IIIA** (2006–2011): ďalšie zníženie, motor s EGR.\n- **Stage IIIB** (2011–2014): povinný DPF.\n- **Stage IV** (2014–2019): povinný SCR (AdBlue).\n- **Stage V** (od 2020): najprísnejšie, povinný DPF + SCR + filter pre PM nano.\n\nPri nákupe ojazdených strojov: model pred Stage IIIB (do 2011) typicky bez DPF — nižšie údržbové riziko, vyššia spotreba a emisie. Model Stage V (2020+) má najprísnejšie emisie, ale zložitý výfukový systém s drahou údržbou.\n\nUSA Tier paralelné: Tier 1 ≈ Stage I, ..., Tier 4 Final ≈ Stage IV. Stage V nie je v USA — americké normy zostali na Tier 4 Final.",
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
    "longDef": "Common Rail je revolučný systém vstrekovania paliva v dieselových motoroch (od konca 90. rokov). Hlavný princíp: vysokotlakové palivo (1500–2500 bar) je trvale v spoločnej lište (rail) a elektronicky ovládané vstrekovače dávkujú veľmi presné množstvo do valca.\n\nVýhody oproti starším systémom (PD/Pumpe-Düse, čerpadlo-tryska):\n- Až 5–7 vstrekov na jeden zdvih (pilot, hlavný, post-injection) → tichší chod, čistejšie spaľovanie.\n- Vyšší tlak vstrekovania → lepšie rozprášenie paliva → nižšie PM emisie.\n- Elektronické ovládanie → jednoduché ladenie máp pre rôzne emisné normy.\n\nNevýhody:\n- Citlivosť na kvalitu paliva — voda alebo nečistoty zničia vstrekovače (1 ks 15 000–40 000 Kč).\n- Vysoké tlaky → drahá oprava vysokotlakového čerpadla (50 000+ Kč).\n- Diagnostika vyžaduje servisný softvér.\n\nCommon Rail je dnes štandard pri všetkých moderných traktoroch (Stage IV+). Životnosť pri dobrej kvalite paliva 10 000+ motohodín.",
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
    "shortDef": "ISOBUS je štandardizovaná komunikačná zbernica medzi traktorom a náradím (postrekovač, sejací stroj, lis), ktorá umožňuje zdieľanie dát a ovládanie z jediného terminálu.",
    "longDef": "ISOBUS (ISO 11783) je medzinárodný štandard pre komunikáciu medzi traktorom, náradím a terminálom v kabíne. Pred ISOBUS mal každý výrobca náradia vlastný proprietárny kábel/protokol — sejací stroj John Deere sa nedal prepojiť na traktor New Holland bez výmeny kompletnej elektroniky.\n\nČo umožňuje:\n- **UT (Universal Terminal)** — jedno zobrazenie v kabíne pre všetky ISOBUS náradia. Pripojíte sejací stroj Lemken na traktor Fendt a rozhranie (UI) sa načíta na displeji Fendt.\n- **TC-BAS (Task Controller Basic)** — počítanie odpracovanej plochy + spotreby materiálu.\n- **TC-GEO (Task Controller Geo)** — aplikačné mapy podľa GPS pozície (variable rate).\n- **TC-SC (Section Control)** — automatické vypínanie sekcií postrekovača/sejačky v súvratiach a prekrytí.\n- **TIM (Tractor Implement Management)** — náradie ovláda traktor (rýchlosť, zdvíhanie trojbodu) podľa aktuálnej situácie.\n\nISOBUS funkcie sú licencované — výrobca traktora účtuje za UT, TC-BAS, TC-GEO atď. samostatne (5 000–80 000 Kč za funkciu). Pred nákupom skontrolujte AEF Database (https://aef-online.org), či kombinácia traktor + náradie je certifikovaná.",
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
    "longDef": "RTK (Real-Time Kinematic) je GPS technológia s centimetrovou presnosťou. Bežný GPS prijímač má presnosť 1–5 metrov, EGNOS/SBAS 0,5–1 m. RTK dosahuje 2–3 cm tým, že porovnáva GPS signál so signálom z fixnej referenčnej stanice (známa pozícia). Korekcia sa prenáša cez mobilnú sieť (NTRIP) alebo rádiový spoj.\n\nPre poľnohospodárstvo je RTK kľúčové pre:\n- **Autonómne riadenie** (auto-steering) — riadky perfektne paralelné, žiadne prekrytie ani vynechané pruhy.\n- **Variabilné dávkovanie** — presné dávkovanie hnojív/postrekov podľa GPS mapy.\n- **Strip-tilling a CTF** (Controlled Traffic Farming) — opakované prejazdy po rovnakých koľajach na zníženie utuženia.\n\nV ČR sú dostupné komerčné RTK siete: Trimble VRS Now (cca 15 000 Kč/rok), Topcon TopNET Live, John Deere StarFire, CZEPOS (štátna, zadarmo s registráciou). Niektoré regióny majú vlastné lokálne stanice.\n\nAlternatíva: vlastná základňová stanica (50 000–150 000 Kč jednorázovo) — oplatí sa pre veľké podniky s niekoľkými strojmi.",
    "related": [
      "isobus",
      "auto-steering",
      "variable-rate"
    ],
    "externalUrl": "https://cs.wikipedia.org/wiki/Diferenci%C3%A1ln%C3%AD_GPS"
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
    "longDef": "Auto-steering (autonómne riadenie, značky: John Deere AutoTrac, Trimble Autopilot, Case IH IntelliSteer, New Holland IntelliSteer) je systém, kde traktor automaticky drží GPS-naprogramovanú trajektóriu bez zásahu vodiča. Vodič ďalej ovláda pedále, zdvíhanie náradia a otáčanie v súvratiach.\n\nKomponenty:\n1. **GPS prijímač** s RTK korekciou (centimetrová presnosť).\n2. **Terminál** pre plánovanie riadkov (AB lines, krivky, kontúry).\n3. **Aktuátor riadenia** — elektrický motor na stĺpiku volantu alebo hydraulický ventil v systéme riadenia.\n\nHlavné výhody:\n- **Eliminácia prekrytia** — pásy postrekovača / sejačky sa neprekrývajú → úspora postreku/osiva 5–15 %.\n- **Menšia únava vodiča** — 12-hodinová smena bez napätia na koncentráciu.\n- **Práca v noci a hmle** — presnosť nezávislá od viditeľnosti.\n- **Vyšší výkon** — možnosť jazdiť širšími strojmi rýchlejšie.\n\nCena: 150 000–500 000 Kč retrofit, 100 000–250 000 Kč ako továrenská opcia. Návratnosť typicky 2–4 roky pri farme >100 ha.",
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
    "longDef": "Variabilné dávkovanie (VRA) je hlavný princíp presného poľnohospodárstva — aplikovať rôzne dávky hnojiva, osiva, postreku alebo závlahy podľa aktuálnych potrieb každého miesta poľa, nie jednotnú dávku na celú plochu.\n\nVstupné dáta pre VRA mapy:\n- **Pôdne rozbory** v gride (10×10 alebo 30×30 m) → mapa pH, P, K, organická hmota.\n- **Výnosové mapy** z kombajnu (yield monitor) — kde to najviac vynáša.\n- **Satelitné snímky** (Sentinel-2, Planet) — NDVI index biomasy.\n- **Drony** s multispektrálnou kamerou — vysoké rozlíšenie 5 cm.\n\nWorkflow:\n1. Zber dát → agronomický softvér (Climate FieldView, John Deere Ops Center, Trimble Ag Software).\n2. Export aplikačnej mapy vo formáte ISO XML alebo SHP.\n3. Import do terminálu v kabíne (ISOBUS TC-GEO).\n4. Pri jazde stroj sám mení dávku podľa aktuálnej GPS pozície.\n\nTypická úspora hnojív 10–25 % bez zníženia výnosu (niekde aj s vyšším výnosom). Návratnosť VRA setupu (RTK + ISOBUS-capable rozmetadlo/sejací stroj + softvér) 2–5 rokov na farme >150 ha.",
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
    "shortDef": "CVT (Continuously Variable Transmission) je bezstupňová prevodovka, ktorá umožňuje plynulú zmenu prevodového pomeru bez radenia stupňov. Štandard pri prémiových traktoroch.",
    "longDef": "CVT (Continuously Variable Transmission) je prevodovka, ktorá plynule mení prevodový pomer bez diskrétnych stupňov. Pri traktoroch typicky kombinácia hydrostatického a mechanického prenosu (hydromechanická CVT, niekedy nazývaná \"power-split\").\n\nHlavné výhody:\n- **Optimálne otáčky motora** — vodič nastaví požadovanú rýchlosť, prevodovka sama drží motor v ekonomickom pásme (typicky 1500–1800 ot/min).\n- **Plynulý rozjazd a brzdenie** — žiadne trhnutie pri radení, lepšie pre náradie citlivé na rázy (lis, sejací stroj).\n- **Tempomat** — drží presnú rýchlosť pri zmenách terénu/záťaže.\n- **Reverz bez spojky** — pri nakladaní s čelným nakladačom rýchlejšie než hydraulický reverz.\n\nHlavné značky CVT:\n- **Fendt Vario** — priekopník (1995), najdlhšie vyrábaná CVT, vysoká spoľahlivosť.\n- **John Deere AutoPowr / IVT** — od 7R nahor.\n- **Case IH CVX / CVT-Drive** — Puma, Magnum.\n- **New Holland Auto Command** — T6, T7, T8.\n- **Deutz-Fahr TTV** — Continuously Variable.\n- **Massey Ferguson Dyna-VT** — 6S, 7S, 8S.\n\nNevýhody: vyššia obstarávacia cena (200 000–500 000 Kč príplatok vs powershift), zložitejší servis, citlivosť na čistotu hydrauliky.",
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
    "longDef": "Powershift prevodovka má mechanické prevodové stupne (ako manuál), ale radenie medzi stupňami sa deje pod zaťažením bez stlačenia spojky. Funguje to vďaka hydraulickým lamelovým spojkám, ktoré synchronizujú otáčky oboch hriadeľov počas radenia (~0,3 s).\n\nHlavné výhody:\n- **Radenie pod plnou záťažou** — nestráca sa rýchlosť ani moment, ideálne pre orbu a ťažké ťahové práce.\n- **Jednoduchšie ako CVT** — menej súčiastok, lacnejší servis.\n- **Životnosť** — typicky 10 000+ motohodín bez veľkej opravy.\n\nVarianty:\n- **Polovičný powershift** (semi-powershift) — časť stupňov manuálna, časť powershift (napr. 24×24 so 4-stupňovým powershiftom).\n- **Plný powershift** (full powershift) — všetkých 16–24 stupňov radí pod zaťažením (napr. John Deere 6M PowrQuad, Case IH Maxxum ActiveDrive).\n\nNevýhody oproti CVT: vodič musí ručne vyberať stupeň (alebo sa spoliehať na automatický mód, ktorý občas zaradí nevhodne), motor nebeží vždy v optimálnych otáčkach.\n\nCenovo: o 100 000–300 000 Kč lacnejšie ako ekvivalentné CVT. Vyplatí sa pri traktoroch, kde majoritné využitie je orba a podobné stále zaťaženie.",
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
    "shortDef": "Hydrostatická prevodovka prenáša výkon cez hydraulické čerpadlo a motor — bezstupňová zmena rýchlosti pomocou joysticku alebo pedálu, používaná pri malých traktoroch a kombajnoch.",
    "longDef": "Hydrostatická prevodovka (HST — Hydrostatic Transmission) prenáša výkon motora cez hydraulické čerpadlo na hydraulický motor, ktorý poháňa kolesá. Zmena rýchlosti sa deje variáciou výkonu čerpadla — od plného cúvania cez nulu po plnú rýchlosť vpred, plynule.\n\nHlavné použitie v poľnohospodárstve:\n- **Malé traktory** (kompaktné 25–60 koní, napr. Kubota L-Series) — ovládanie joystickom, vhodné pre nepretržitú zmenu rýchlosti pri nakladaní, kosení trávnikov.\n- **Kombajny** — pojezd HST, na PTO mechanický pohon.\n- **Nakladače** (čelné, kĺbové) — HST je štandard.\n- **Komunálne stroje** — kosačky, multifunkčné nosiče.\n\nVýhody: jednoduché ovládanie (pedál alebo joystick), žiadne radenie, plynulé manévrovanie. Nevýhody: nižšia účinnosť ako mechanická prevodovka (15–25 % straty), nevhodné pre veľké ťahové práce na poli (rýchlo sa zahrieva, stráca výkon).\n\nPri veľkých poľných traktoroch (100+ koní) sa HST nepoužíva ako hlavný pohon — namiesto toho hydromechanická CVT (kombinácia HST + mechanického prenosu pre lepšiu účinnosť).",
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
    "longDef": "NPK hnojivo je minerálne (anorganické) hnojivo, ktoré obsahuje tri hlavné makroživiny v rôznych pomeroch: dusík (N — Nitrogen), fosfor (P — Phosphorus) a draslík (K — Kalium / Potassium).\n\nOznačenie: číselný kód udáva percentá jednotlivých živín v sušine. Príklady:\n- **NPK 15-15-15** — vyrovnané, univerzálne, 15 % N, 15 % P₂O₅, 15 % K₂O.\n- **NPK 11-44-11** — štartovacie do osiva (vysoký fosfor pre rozvoj koreňov).\n- **NPK 8-20-30** — jesenné pod ozimy (nízky N, vysoký K).\n- **NPK 20-10-10** — jarné top dressing pre pšenicu.\n\nDôležitá poznámka: P sa uvádza ako **P₂O₅** (oxid), K ako **K₂O** — nie čisté prvky. Pre prepočet:\n- 1 kg P = 2,29 kg P₂O₅\n- 1 kg K = 1,20 kg K₂O\n\nStopové prvky (S, Mg, Ca, B, Zn, Cu) sú v NPK plus formách (napr. NPK + S, NPK Mikro). Aktuálna cena NPK 15-15-15 sa pohybuje okolo 13 000–18 000 Kč/t v závislosti od sezóny a pôvodu.\n\nPre variabilné dávkovanie (VRA) podľa GPS máp vyžaduje sejací stroj alebo rozmetadlo s ISOBUS TC-GEO.",
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
    "longDef": "pH pôdy je logaritmická miera koncentrácie vodíkových iónov (H⁺). Škála 0–14, neutrálne 7. Pôdy v ČR sú väčšinou mierne kyslé (pH 5,5–6,8) vďaka zrážkam a vyplavovaniu vápnika.\n\nOptimálne pH pre hlavné plodiny:\n- **Pšenica, jačmeň, kukurica**: 6,0–7,0\n- **Cukrová repa**: 6,5–7,5 (citlivá na kyslosť)\n- **Zemiaky**: 5,5–6,5 (znášajú slabo kyslé)\n- **Lucerna, ďatelina**: 6,5–7,0\n- **Čučoriedka, brusnica**: 4,5–5,5 (potrebujú kyslé)\n\nDôsledky nesprávneho pH:\n- **Príliš kyslé** (pH < 5,5): blokuje príjem P, K, Mg; aktivuje toxický Al, Mn; znižuje činnosť mikroorganizmov. Riešenie: vápnenie (uhličitan vápenatý CaCO₃, dolomitické vápno) 2–6 t/ha.\n- **Príliš zásadité** (pH > 7,5): blokuje príjem mikroprvkov (Fe, Mn, Zn, B). Riešenie: síran amónny, elementárna síra, organická hmota.\n\nMeranie: pôdny rozbor v akreditovanom laboratóriu (ÚKZÚZ Brno, ČZU Praha) — typicky 500–1500 Kč za 5 vzoriek. Plánujte 1× za 4–6 rokov.\n\nPre variabilné vápnenie (VRA) podľa GPS gridu rozbory v 30×30 m mriežke → mapa pH → aplikačná mapa pre rozmetadlo.",
    "related": [
      "npk-hnojivo",
      "variable-rate"
    ],
    "alias": []
  },
  {
    "slug": "mezi-plodiny",
    "term": "Medziplodiny",
    "alias": [
      "krycie plodiny",
      "cover crops"
    ],
    "kategorie": "agrotechnika",
    "shortDef": "Medziplodiny sú rastliny vysievané medzi dvoma hlavnými plodinami na zlepšenie pôdnej úrodnosti, ochranu proti erózii a viazanie dusíka. V ČR sa môžu započítať do neprodukčných plôch celofarmovej ekoplatby.",
    "longDef": "Medziplodiny (cover crops) sú plodiny vysievané v období medzi zberom hlavnej plodiny a siatím ďalšej, často cez zimu alebo letný úhor. Slúžia na:\n\n1. **Ochranu pôdy proti erózii** — pokrývajú povrch v období dažďov a vetra.\n2. **Viazanie dusíka** (strukovinové medziplodiny: vika, hrach, lupina) — baktérie Rhizobium fixujú vzdušný N₂.\n3. **Mobilizáciu živín** — košatý koreňový systém vytiahne P, K z hlbších vrstiev.\n4. **Zvyšovanie obsahu organickej hmoty** — biomasa zaoraná tvorí humus.\n5. **Boj s burinami a chorobami** — rušivý vplyv na životný cyklus niektorých burín.\n6. **Viazanie CO₂** — uhlík v pôde je dlhodobo sekvestrovaný.\n\nTypické druhy:\n- **Horčica biela** — rýchla, lacná, dusíkofilná.\n- **Facélia** — rýchly rast, vhodná do letného úhoru.\n- **Vika huňatá + žito** — zimná zmes, vhodná pred jarnou plodinou.\n- **Ďatelina inkarnát** — viazanie N, krmivo.\n- **Pohánka** — pre letnú krátku medziplodinu.\n\nV ČR sa medziplodiny v základnej celofarmovej ekoplatbe (2025) započítavajú do neprodukčných plôch variantu B s váhovým koeficientom 0,3. Podľa českého štandardu podmienenosti DZES 6 je osiatie medziplodinou jedným zo spôsobov, ako po zbere hlavnej plodiny zabezpečiť pôdny pokryv. V rokoch 2015–2022 sa medziplodiny mohli započítavať do plôch v ekologickom záujme (EFA) v rámci greeningu, ktorý reforma SPP od roku 2023 zrušila.",
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
    "shortDef": "Biopásy sú pruhy osiate špeciálnymi zmesami medzi hlavnými plodinami, určené pre opeľovače, vtáctvo a drobnú zver. V ČR ich podporuje agroenvironmentálno-klimatické opatrenie (AEKO) a možno ich započítať do neprodukčných plôch ekoplatby.",
    "longDef": "Biopásy sú neproduktívne pruhy na poliach (v českom AEKO 6–30 m široké), ktoré slúžia ako útočisko pre divokú faunu — opeľovače, drobnú zver, vtáctvo. Môžu byť osiate špeciálnymi zmesami (medonosné kvitnúce rastliny) alebo ponechané ako autonómny úhor.\n\nTypy biopásov:\n- **Nektárodajný biopás** — zmes kvitnúcich rastlín (facélia, slnečnica, pohánka, ďatelina, vičenec). Kľúčový pre včely a divoké opeľovače.\n- **Krmný biopás** — pre koroptve, bažanty, zajace — obiloviny, slnečnica, kukurica.\n- **Trávny pás** — proti erózii, pozdĺž vodotečí.\n\nV ČR (2025):\n- **AEKO biopásy** (nariadenie vlády ČR č. 80/2023 Sb.) — krmné 676 EUR/ha, nektárodajné 597 EUR/ha, kombinované 639 EUR/ha; vyplácajú sa v Kč (za rok 2025 kurzom 25,185 CZK/EUR).\n- Biopás možno započítať do neprodukčných plôch celofarmovej ekoplatby; sadzba AEKO sa potom znižuje.\n\nPodmienky AEKO v ČR (2025): na biopás sa nesmú použiť prípravky na ochranu rastlín ani hnojivá; krmný a nektárodajný biopás má súvislú dĺžku aspoň 50 m a zaberá najviac 50 % dielu pôdneho bloku.",
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
      "SPP 2023-2027"
    ],
    "kategorie": "dotace",
    "shortDef": "Spoločná poľnohospodárska politika EÚ (CAP, po slovensky SPP) na obdobie 2023–2027, ktorú každý členský štát vykonáva vlastným strategickým plánom. Hlavné priame platby: základná platba BISS, redistributívna platba, ekoschémy (v ČR ekoplatba), platba pre mladých poľnohospodárov a viazaná podpora príjmu (CIS).",
    "longDef": "Spoločná poľnohospodárska politika (SPP, EN: CAP — Common Agricultural Policy) je hlavný finančný nástroj EÚ na podporu poľnohospodárstva. Obdobie 2023–2027 prinieslo reformu: každý členský štát ju vykonáva vlastným strategickým plánom, greening nahradila prísnejšia podmienenosť a ekoschémy a viac peňazí smeruje k menším podnikom.\n\nPriame platby v ČR — sadzby za rok 2025 (Ministerstvo poľnohospodárstva ČR, SZIF):\n1. **BISS** (základná podpora príjmu pre udržateľnosť) — 1 759,91 Kč/ha spôsobilej plochy.\n2. **CRISS** (doplnková redistributívna podpora príjmu) — 3 449,49 Kč/ha na prvých 150 ha každého podniku.\n3. **Celofarmová ekoplatba** — základná 1 578,37 Kč/ha; prémiová 17 521,20 Kč/ha, ale len na vyčlenené neprodukčné plochy a ochranné pásy pozdĺž vody.\n4. **Platba pre mladých poľnohospodárov** — 2 378,75 Kč/ha, najviac na 90 ha a najdlhšie päť rokov.\n5. **Platba pre malých poľnohospodárov** — 6 883,97 Kč/ha, najviac na 4 ha, pre podniky do 10 ha; nahrádza ostatné priame platby.\n6. **CIS** (viazaná podpora príjmu, predtým VCS) — napríklad chmeľ 14 936,09 Kč/ha, ovocie s veľmi vysokou prácnosťou 15 541,10 Kč/ha, škrobové zemiaky 12 036,09 Kč/ha, cukrová repa 6 936,20 Kč/ha, bielkovinové plodiny 1 449,39 Kč/ha, dojnice 3 540,01 Kč na kus.\n\nPlatby pre oblasti s prírodnými obmedzeniami (ANC) a agroenvironmentálno-klimatické opatrenia (AEKO) patria do II. piliera a v ČR sa riadia vlastnými nariadeniami vlády.\n\nV ČR sa o priame platby žiada v Jednotnej žiadosti elektronicky cez Portál farmára SZIF (za rok 2025 do 15. mája). Sadzby za rok 2025 schválil minister poľnohospodárstva ČR v októbri 2025; výška sadzby závisí okrem iného od toho, na koľko hektárov a zvierat poľnohospodári požiadajú.\n\nNa Slovensku priame platby administruje Pôdohospodárska platobná agentúra (PPA), ktorá zverejňuje slovenské sadzby; české sadzby na Slovensku neplatia.",
    "related": [
      "eko-platba",
      "mezi-plodiny",
      "biopasy"
    ],
    "externalUrl": "https://www.szif.cz",
    "externalLabel": "SZIF — český Štátny poľnohospodársky intervenčný fond"
  },
  {
    "slug": "eko-platba",
    "term": "EKO-platba",
    "alias": [
      "Eco-scheme",
      "celofarmová ekoplatba",
      "ekoschéma"
    ],
    "kategorie": "dotace",
    "shortDef": "Celofarmová ekoplatba je české ekoschéma v priamych platbách SPP 2023–2027. V ČR za rok 2025 bola základná sadzba 1 578,37 Kč/ha; prémiová (17 521,20 Kč/ha) sa vypláca len na vyčlenené neprodukčné plochy a ochranné pásy pozdĺž vody.",
    "longDef": "Celofarmová ekoplatba (EN eco-scheme) je v ČR dobrovoľná časť priamych platieb, ktorá odmeňuje postupy prospešné pre životné prostredie nad rámec povinnej podmienenosti. Žiadateľ ju plní na celej výmere podniku — kultúry ani diely pôdnych blokov si vyberať nemôže.\n\nDve úrovne v ČR (sadzby za rok 2025):\n1. **Základná** — 1 578,37 Kč/ha na celú spôsobilú výmeru. Na ornej pôde zahŕňa okrem iného:\n   - diverzifikáciu plodín (nad 10 ha ornej pôdy aspoň 2 plodiny, nad 30 ha aspoň 3, nad 150 ha aspoň 4; jedna plodina najviac na 75 % ornej pôdy),\n   - hospodárenie s organickou hmotou (nad 30 ha ornej pôdy, podľa Modelu OH),\n   - ochranný pás pozdĺž vody,\n   - neprodukčné plochy: variant A (aspoň 5 % ornej pôdy — úhory, krajinné prvky, ochranné pásy, biopásy) alebo variant B (8 % vrátane medziplodín a plodín viažucich dusík, z toho aspoň 3 % z variantu A).\n   Na trvalom trávnom poraste je podmienkou pastva alebo kosba s odstránením biomasy do 31. júla.\n2. **Prémiová** — 17 521,20 Kč/ha, ale len na hektáre vyčlenených neprodukčných plôch a prémiových ochranných pásov pozdĺž vody. Žiadateľ musí splniť základnú úroveň a vyčleniť 7 % ornej pôdy ako neprodukčné plochy (z toho aspoň 2 % takzvané superprémiové).\n\nOd roku 2025 možno v ČR spolu s ekoplatbou žiadať aj o nové platby: údržba krajinných prvkov (38 261,21 Kč/ha), vytváranie nových krajinných prvkov (10 512,72 Kč/ha), udržateľné hospodárenie so živinami (201,49 Kč/ha) a pásové striedanie plodín (9 490,65 Kč/ha).\n\nNa Slovensku sa ekoschémy riadia vlastnými podmienkami a sadzbami, ktoré zverejňuje PPA.",
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
      "evidencia pôdy"
    ],
    "kategorie": "dotace",
    "shortDef": "LPIS je centrálna evidencia poľnohospodárskej pôdy v ČR — každý pozemok má unikátny LPIS blok, na ktorý sa viažu dotačné žiadosti a katastrálne údaje.",
    "longDef": "LPIS (Land Parcel Identification System) je verejná evidencia spôsobilej poľnohospodárskej pôdy v ČR, ktorej správcom je Ministerstvo poľnohospodárstva ČR; dáta aktualizuje SZIF, ktorý LPIS používa aj na kontrolu dotácií. Každý pozemok používaný na poľnohospodárstvo má unikátny **LPIS blok** s vlastným kódom (napr. \"1234/56\").\n\nČo LPIS obsahuje:\n- **Hranice pôdneho bloku** v GIS — presne podľa DPB (diely pôdnych blokov).\n- **Kultúru** — orná pôda, TTP (trvalý trávny porast), sad, vinice, chmeľnice, ostatné.\n- **Výmery** v ha.\n- **Začlenenie do ANC** kategórie (horské H1–H5, ostatné O1–O3, špecifické S alebo mimo ANC).\n- **Krajinné prvky** v bloku — solitérny strom, medza, biokoridor.\n- **Erózne ohrozenie** — kategórie M (mierne), S (silne) ovplyvňujú pravidlá pre sejbu.\n- **Vlastnícke vzťahy** — kto je užívateľom (žiadateľ o dotácie).\n\nLPIS dáta sú verejne dostupné: https://eagri.cz/public/web/mze/farmar/LPIS/ — ktokoľvek vidí hranice a kultúru (nie vlastníka).\n\nAktualizácia LPIS: zmeny vo využívaní pôdy (rozdelenie, zlúčenie, zmena kultúry) hlási užívateľ SZIF. Bez aktuálneho LPIS nie je možné podať žiadosť o priame platby ani investičné dotácie.",
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
    "shortDef": "BISS (základná podpora príjmu pre udržateľnosť) je hlavná priama platba SPP 2023–2027 na spôsobilú poľnohospodársku plochu; v ČR za rok 2025 bola 1 759,91 Kč/ha. Nadviazala na skoršiu jednotnú platbu na plochu SAPS.",
    "longDef": "BISS (Basic Income Support for Sustainability, po slovensky základná podpora príjmu pre udržateľnosť) je základná priama platba SPP 2023–2027. Od roku 2023 nadviazala na jednotnú platbu na plochu (SAPS) a vypláca sa na spôsobilú poľnohospodársku plochu evidovanú v LPIS.\n\nSadzba v ČR za rok 2025: 1 759,91 Kč/ha (Ministerstvo poľnohospodárstva ČR, SZIF). Farma so 100 ha tak dostala 175 991 Kč len z BISS. K tomu sa pridáva redistributívna platba (3 449,49 Kč/ha na prvých 150 ha), pre účastníkov celofarmovej ekoplatby základná ekoplatba (1 578,37 Kč/ha) a prípadne ďalšie platby.\n\nPodmienky nároku v ČR (Jednotná žiadosť 2025):\n1. **Aktívny poľnohospodár** a poľnohospodársky podnikateľ.\n2. **Pôda evidovaná v LPIS** na žiadateľa najmenej od podania žiadosti do 31. augusta a počas celej tej doby obhospodarovaná.\n3. **Minimálna výmera 1 ha**.\n4. **Podmienenosť** — štandardy DZES (GAEC) a povinné požiadavky na hospodárenie (PPH) počas celého roka.\n\nV ČR sa žiada v Jednotnej žiadosti cez Portál farmára SZIF (za rok 2025 do 15. mája). V roku 2025 vyplácal SZIF pri vybraných podporách preddavky vo výške 70 %.\n\nSlovenské sadzby BISS zverejňuje PPA.",
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
    "longDef": "Diel pôdneho bloku (DPB) je atomická jednotka evidencie v LPIS — súvislá plocha v majetku alebo nájme jedného užívateľa s jednou kultúrou (orná pôda, TTP, sad, vinice, chmeľnice). Každý DPB má unikátny identifikátor a vlastný GIS polygon.\n\nPríklad: poľnohospodár hospodári na 5 poliach — každé pole = jeden DPB v LPIS. Ak je časť poľa osiata cukrovkou a časť pšenicou, zostáva to jeden DPB s kultúrou štandardná orná pôda; plodiny sa v žiadosti zakresľujú zvlášť (zákres plodín).\n\nDPB je zásadný pre:\n- **Žiadosť o priame platby** — výmery DPB sa sčítavajú pre BISS a redistributívnu platbu.\n- **CIS** (viazaná podpora príjmu) — plocha plodín sa deklaruje na konkrétnych DPB.\n- **ANC** — typ oblasti sa určuje podľa katastrálneho územia, v ktorom DPB leží.\n- **Erózne pravidlá** — erózna ohrozenosť je v LPIS vymedzená na DPB.\n- **Ekoplatba** — neprodukčné plochy a ochranné pásy sa zakresľujú na DPB.\n\nV ČR hlási zmeny DPB (rozdelenie, zlúčenie, zmena kultúry) užívateľ SZIF, napríklad cez Portál farmára. Bez aktuálneho DPB v LPIS nie je možné podať žiadosť.\n\nOnline: hranice a kultúra všetkých DPB sú verejné na https://eagri.cz/public/web/mze/farmar/LPIS/.",
    "related": [
      "lpis",
      "biss",
      "cap-2024"
    ]
  },
  {
    "slug": "ttp",
    "term": "TTP (Trvalý trávny porast)",
    "alias": [
      "lúka",
      "pastvina",
      "permanent grassland"
    ],
    "kategorie": "agrotechnika",
    "shortDef": "TTP je trvalý trávny porast — lúka alebo pastvina, kde sa 5+ rokov nepodrobila orbe. Špeciálna kategória v LPIS s vlastnými pravidlami pre dotácie.",
    "longDef": "Trvalý trávny porast (TTP) je pôdny blok osetý trávami alebo trávami s leguminózami, ktorý nebol zoraný a osiaty inou plodinou dlhšie ako 5 rokov. V LPIS je TTP samostatná kultúra, odlišná od ornej pôdy.\n\nPravidlá pre TTP v ČR (2025):\n- **Ochrana TTP** — podľa štandardu DZES 1 sa celoštátny pomer TTP k poľnohospodárskej ploche nesmie znížiť o viac než 5 % oproti roku 2018; na environmentálne citlivých plochách (napríklad 1. a 2. zóna CHKO, národné parky, pás do 12 m od vodného útvaru, silne erózne ohrozená pôda) je zmena TTP na inú kultúru zakázaná.\n- **Natura 2000** — podľa DZES 9 tam environmentálne citlivé TTP nemožno premeniť ani zorať.\n- **Ekoplatba** — na TTP vyžaduje pastvu alebo kosbu s odstránením biomasy do 31. júla (pri dieloch ležiacich aspoň z polovice v oblasti H1 do 31. augusta).\n- **ANC** — najvyššia sadzba je 216 EUR/ha (oblasť H1, podnik s prevažujúcou živočíšnou výrobou; nariadenie vlády ČR č. 61/2023 Sb.).\n\nV ČR je ~25 % poľnohospodárskej plochy v TTP (cca 900 000 ha). Hlavne v horských a podhorských oblastiach (Juhočeský, Plzenský, Vysočina, Zlínsky, Moravskosliezsky kraj).\n\nTTP má dôležitú ekologickú hodnotu (biodiverzita, zadržiavanie vody, sekvestrácia uhlíka) — preto je štátom chránený pred preoraním.",
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
    "shortDef": "PTO (Power Take-Off) je vývodový hriadeľ na traktore na pohon náradia — sejací stroj, kosačka, lis, postrekovač. Štandardné otáčky 540 alebo 1000 ot/min.",
    "longDef": "PTO (Power Take-Off, vývodový hriadeľ) je rotujúci hriadeľ na zadnej (alebo prednej) časti traktora, ktorý prenáša výkon motora na pripojené náradie — kosačku, lis, sejací stroj, postrekovač, mulčovač, snopoviazač, závesný kombajn.\n\nŠtandardné otáčky:\n- **540 ot/min** — historicky najstaršie, dodnes pre malé náradie (mulčovač, kosačka, malé postrekovače).\n- **1000 ot/min** — vyššie pre veľké náradie (lisy, závesné kombajny, veľké postrekovače).\n- **540E (Economy)** — moderný úsporný režim, traktor beží na 1500 ot/min motora, PTO drží 540 → úspora 10–15 % paliva.\n- **1000E (Economy)** — paralelne pre 1000 ot.\n\nHriadeľ:\n- **6drážkový** — štandard pre 540 ot.\n- **21drážkový** — pre 1000 ot, vyššia pevnosť.\n\nBezpečnosť: PTO je veľmi nebezpečné — rotujúci hriadeľ s obvodovou rýchlosťou 10+ m/s môže strhnúť oblečenie a spôsobiť smrť. Vždy s krytom (kryt náradia + kryt na traktore). Pred odpájaním vypnite motor.\n\nNiektoré moderné traktory majú **PTO autostop** — PTO sa sám vypne pri zastavení/zdvíhaní trojbodu.",
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
    "longDef": "Trojbodový záves (3-bodový hitch, three-point linkage) je najdôležitejšia štandardizácia v poľnohospodárstve — umožňuje pripojiť akékoľvek náradie k akémukoľvek traktoru bez prestavby. Vynašiel ho Harry Ferguson v 30. rokoch 20. storočia (Ferguson System).\n\nKomponenty:\n- **Dve spodné zdvíhacie ťahadlá** (lower lift arms) — hydraulicky zdvíhané, určujú výšku náradia.\n- **Jedno horné ťahadlo** (top link) — fixná dĺžka, určuje sklon náradia.\n- **Stabilizačné ťahadlá** (check chains) — obmedzujú bočný pohyb.\n\nKategórie podľa pevnosti a veľkosti zdvíhacích guľových čapov:\n- **Cat I** — malé traktory do 40 koní, Ø 22 mm čapy.\n- **Cat II** — stredné 40–100 koní, Ø 28 mm.\n- **Cat III** — veľké 80–225 koní, Ø 36 mm.\n- **Cat IV** — najväčšie 180+ koní, Ø 45 mm.\n- **Cat IV-N** — užšia verzia pre lepšiu manipuláciu.\n\nZdvíhacia kapacita: uvádza sa na koncoch ťahadiel (lift capacity at hitch point) — typicky 3 500 kg pre Cat II, 6 500 kg pre Cat III, 12 000+ kg pre Cat IV.\n\n**Predný trojbod** — moderná voľba pri prémiových traktoroch (Fendt, JD), umožňuje plniť pole náradím \"v sendviči\" (jedno náradie vpredu, druhé vzadu) → vyššia produktivita.",
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
    "longDef": "Hydraulický systém traktora obsluhuje:\n1. **Trojbodový záves** — zdvíhanie náradia.\n2. **Externé výstupy** (SCV — Selective Control Valves) — pohon hydraulických funkcií náradia (sklápací postrekovač, zavlažovací valec, naviják).\n3. **Posilňovač riadenia** (power steering).\n4. **Spojku PTO**, **diferenciálnu uzávierku**, **4×4 spojku**.\n\nTypy hydraulických systémov:\n- **Open Center** — historický, čerpadlo trvale dodáva plný prietok, prebytky tečú späť do nádrže. Jednoduché, nízka účinnosť, dobré pre ľahké náradie.\n- **Closed Center s LS (Load Sensing)** — moderný štandard, čerpadlo dodáva len toľko tlaku a prietoku, koľko náradie požaduje. Vyššia účinnosť (úspora 5–15 % paliva).\n- **PFC (Pressure Flow Compensation)** — prémiový variant LS, ešte presnejšia regulácia.\n\nKľúčové parametre:\n- **Max. tlak** — typicky 200 bar (malé) až 250 bar (prémiové).\n- **Max. prietok** — 60 l/min malé traktory, 200+ l/min top modely.\n- **Počet SCV** — 2 štandard, 4–6 prémiové (pre komplexné náradie ako veľký postrekovač).\n\nOlej: hydraulický + prevodový spoločný (UTTO — Universal Tractor Transmission Oil), výmena 1× za 1500–3000 motohodín. Pozor na miešanie s ATF alebo motorovým olejom — nekompatibilné.",
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
    "titulek": "Hektár (ha) = 10 000 m² — prevod na áre, akre a m²",
    "longDef": "Hektár (ha) je jednotka plošného obsahu metrickej sústavy. 1 ha = 10 000 m² = 100 a (árov). Vizuálne: štvorec 100 × 100 m, alebo futbalové ihrisko 1,5×.\n\nV poľnohospodárstve je hektár základná jednotka pre:\n- **Výmeru poľa** — celá farma sa meria v ha (50 ha, 200 ha, 1000 ha).\n- **Dotácie** — Kč/ha (v ČR za rok 2025 BISS 1 759,91 Kč/ha, redistributívna platba 3 449,49 Kč/ha).\n- **Výnos plodín** — t/ha alebo q/ha (1 q = 100 kg = 1 metrický cent).\n- **Spotreba hnojív** — kg/ha (200 kg NPK/ha).\n- **Dávkovanie postrekov** — l/ha (5 l Roundup/ha).\n- **Výkon strojov** — ha/h (postrekovač 12 m záber × 12 km/h = 14,4 ha/h teoreticky).\n\nPrevod:\n- 1 km² = 100 ha\n- 1 míľa² (USA) = 259 ha\n- 1 aker (USA) = 0,405 ha (aker × 0,405 = ha)\n- 1 morgen (DE/AT) = 0,25–0,34 ha podľa regiónu (historická)\n\nV ČR farmy 1–50 ha = \"drobní farmári\", 50–500 ha = \"strední\", 500–5000 ha = \"veľkí\", 5000+ ha = \"priemyselné podniky\".",
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
    "longDef": "Cent (latinsky centum = 100, značka **q** z talianskeho \"quintale\") je jednotka hmotnosti, štandardne 100 kilogramov. V ČR a v poľnohospodárstve EÚ je dominantnou jednotkou pre:\n\n- **Výnosy plodín**: pšenica 60–80 q/ha, kukurica 80–120 q/ha, repka 35–45 q/ha. 1 q/ha = 100 kg/ha = 0,1 t/ha.\n- **Ceny komodít**: 5500 Kč/t pšenice = 550 Kč/q. Rolníci často počítajú v q pri rokovaní s výkupmi.\n- **Spotreba krmív**: dojnica spotrebuje cca 30 q zmesi/rok.\n\nPozor — q (metrický cent) je odlišné od **q amerického** (= 100 lb = 45,4 kg) a **q britského** (= 112 lb = 50,8 kg). V medzinárodnom obchode sa používa výhradne **metrická tona (t)** = 1000 kg = 10 q.\n\nPraktický príklad:\n- Pšenica 6 t/ha × 100 ha = 600 t = 6000 q\n- Cena 5500 Kč/t = 550 Kč/q → tržba 3,3 mil. Kč\n\nPre veľké výnosy (kukurica silážna, trávy na siláž) sa počíta v t (1 t = 10 q), nikdy v q (čísla by boli nepraktické — 400 q/ha kukurice).",
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
    "longDef": "Ar je jednotka plošného obsahu, odvodzovaná od latinského *area*. 1 ar = 100 m² = štvorec o strane 10 m. V sústave SI je ar (a) prijímaná jednotka mimo SI, prípustná pre pozemkovú agendu.\n\nPrevod:\n- **1 a = 100 m²**\n- **1 a = 0,01 ha** (100 a = 1 ha)\n- **1 a = 0,0001 km²**\n- **1 a ≈ 0,0247 akra** (aker ≈ 40,47 a)\n\nV ČR sa ar používa predovšetkým v:\n- **Katastri nehnuteľností** — výmery záhrad, stavebných parciel a malých poľnohospodárskych pozemkov sa obvykle zapisujú v m² alebo v ha, ale staršie zápisy a bežná reč („záhrada 8 árov\") ar drží.\n- **Drobnom poľnohospodárstve** — pestovateľské pásy, ovocné sady, vinice malých vinárov.\n- **Dani z nehnuteľných vecí** — sadzby sa počítajú z m², ale rolníci si plochu typicky pamätajú v ároch.\n\nPraktické prirovnania:\n- **Tenisový kurt** (single, 23,77 × 8,23 m) ≈ 2 áre\n- **Olympijský bazén** (50 × 25 m) = 12,5 a\n- **Futbalové ihrisko** (105 × 68 m) ≈ 71 a (= 0,71 ha)\n- **Priemerná česká záhrada pri rodinnom dome** = 4–10 a\n\nHistoricky bol ar zavedený vo Francúzsku v roku 1795 ako súčasť metrickej sústavy. V českom a slovenskom kontexte nahradil predchádzajúce jednotky ako **korec** (≈ 28 a) a **strych** (≈ 28–32 a) — pozri [[korec]], [[strych]].",
    "related": [
      "hektar",
      "metr-ctvrecni",
      "korec",
      "strych"
    ]
  },
  {
    "slug": "akr",
    "term": "Aker (acre)",
    "alias": [
      "acre",
      "akre",
      "anglický aker"
    ],
    "kategorie": "jednotky",
    "shortDef": "Aker (acre) je anglosaská jednotka plochy = 4 046,86 m² = 0,4047 hektára. Štandardná jednotka v USA, UK, Kanade a Austrálii pre poľnohospodárske pozemky.",
    "longDef": "Aker (anglicky *acre*) je tradičná anglosaská jednotka plošného obsahu, dnes presne definovaná ako **4 046,8564224 m²** (medzinárodný aker). V USA a UK je dodnes dominantnou jednotkou pre poľnohospodárske pozemky a real estate.\n\nPresné prevody:\n- **1 aker = 4 046,86 m²**\n- **1 aker = 0,4047 ha** (≈ 40,5 a)\n- **1 aker = 40,4686 a**\n- **1 hektár = 2,4711 akra**\n- **1 míľa² = 640 akrov** (1 section v US township systéme)\n\nPôvod jednotky: stredoveký aker bol plocha, ktorú jeden muž s párom volov zorá za deň — preto dĺžka **1 furlong × šírka 1 chain** (220 yardov × 22 yardov = 4 840 yard²).\n\nPraktické použitie:\n- **USA**: priemerná farma 2026 ≈ 446 akrov (≈ 180 ha). Veľké priemyselné farmy 10 000+ akrov.\n- **UK**: typická anglická farma 88 ha = 217 akrov.\n- **Pôdne fondy / investície**: americké poľnohospodárske pozemky sa obchodujú v USD/aker (typicky $4–10 tis./aker na americkom Stredozápade).\n- **Ceny komodít**: USDA yields publikuje v bushel/aker — pšenica ~50 bu/ac, kukurica ~175 bu/ac.\n\nPre českého farmára relevantné pri:\n- **Prenájme zahraničných pozemkov** (najmä SK, AT, DE pohraničie — pozri [[morgen]]).\n- **Importe USDA dát** o svetových výnosoch (prepočet bu/ac → t/ha: bušl × 0,02489 = t/ha).\n- **Predaji do USA** (export komodít).\n\nPozor: existujú aj regionálne varianty — *scottish acre* (5 080 m²), *irish acre* (6 555 m²) — dnes obsoletné, ale stále v niektorých starých zápisoch.",
    "related": [
      "hektar",
      "morgen",
      "busl",
      "metr-ctvrecni"
    ]
  },
  {
    "slug": "metr-ctvrecni",
    "term": "Meter štvorcový (m²)",
    "alias": [
      "m²",
      "m2",
      "štvorcový meter"
    ],
    "kategorie": "jednotky",
    "shortDef": "Meter štvorcový (m²) je základná jednotka plochy v SI = štvorec 1 × 1 m. 10 000 m² = 1 hektár. Univerzálna jednotka pre stavby, parcely, byty.",
    "longDef": "Meter štvorcový (m², niekedy písané m2 alebo „štvorcový meter\") je odvodená jednotka plošného obsahu v sústave SI. 1 m² = plocha štvorca o strane 1 meter.\n\nPrevod na ďalšie jednotky plochy:\n- **1 m² = 0,01 a** (100 m² = 1 ar)\n- **1 m² = 0,0001 ha** (10 000 m² = 1 hektár)\n- **1 m² = 0,000001 km²** (1 000 000 m² = 1 km²)\n- **1 m² ≈ 10,764 sq ft** (štvorcová stopa, USA/UK)\n- **1 m² ≈ 1,196 sq yd** (štvorcový yard)\n\nPoužitie v poľnohospodárstve a real estate:\n- **Stavebné parcely** — kataster nehnuteľností eviduje pozemky v m² (oficiálny zápis).\n- **Sadzby dane z nehnuteľností** — počíta sa v Kč/m² podľa typu pozemku.\n- **Skleníky a fóliovníky** — kapacita sa uvádza v m² pestovateľskej plochy.\n- **Hydina a chovy** — minimálna plocha na zviera (welfare normy) v m²/kus.\n- **Skladovacie haly** — silážne jamy, seníky, mechanizačné dvory v m².\n\nPraktické prirovnania:\n- **Parkovacie miesto**: 12,5 m² (2,5 × 5 m)\n- **Malý byt 1+kk**: 25–35 m²\n- **Veľký byt 4+1**: 100–130 m²\n- **Tenisový kurt**: 261 m² (single)\n- **Futbalové ihrisko**: 7 140 m² (≈ 0,71 ha)\n\nPre prevod väčších plôch na hektáre stačí deliť 10 000:\n- 5 000 m² = 0,5 ha\n- 25 000 m² = 2,5 ha\n- 500 000 m² = 50 ha\n\nPozri tiež [[ar]] (= 100 m²), [[hektar]] (= 10 000 m²), [[kilometr-ctvrecni]] (= 1 000 000 m²).",
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
    "longDef": "Kilometer štvorcový (km², písané tiež km2 alebo „štvorcový kilometer\") je odvozená jednotka plošného obsahu v SI. 1 km² = plocha štvorca o strane 1 km = 1 000 m × 1 000 m.\n\nPrevody:\n- **1 km² = 1 000 000 m²**\n- **1 km² = 100 ha** (sto hektárov)\n- **1 km² = 10 000 a** (desaťtisíc árov)\n- **1 km² ≈ 247,1 akra**\n- **1 mile² ≈ 2,59 km²** (štvorcová míľa, USA)\n\nPoužitie:\n- **Lesníctvo** — výmera lesných hospodárskych celkov, povodí, chránených území (CHKO, NP) sa uvádza v km².\n- **Katastrálne územie** — priemerné katastrálne územie v ČR má 4–8 km².\n- **Pastviny a TTP** — extenzívne pastvy v horských oblastiach (Krkonošsko, Beskydy) sa merajú v km².\n- **Štatistika ČSÚ** — orná pôda v ČR ~30 000 km² (3 mil. ha), TTP ~10 000 km².\n- **Klimatické a meteodáta** — zrážky a teploty interpolované na km² raster.\n\nPraktické prirovnania:\n- **Praha 1 (správny obvod)**: 5,5 km²\n- **Manhattan (NYC)**: 59 km²\n- **Mikulov (mesto)**: 47 km²\n- **NP Šumava**: 685 km²\n- **CHKO Český kras**: 132 km²\n\nČR má celkom **78 871 km²** = 7,89 mil. ha. Z toho poľnohospodárska pôda 41 868 km² = 4,19 mil. ha (53 % rozlohy štátu).\n\nPozri tiež [[hektar]] (= 0,01 km²), [[metr-ctvrecni]], [[ar]].",
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
    "shortDef": "Hektoliter (hl) je jednotka objemu = 100 litrov = 0,1 m³. V poľnohospodárstve kľúčová pre hektolitrovú váhu obilnín (kg/hl) — kvalitatívny parameter pre výkup.",
    "longDef": "Hektoliter (hl) je jednotka objemu = **100 litrov** = 0,1 m³. V SI je hektoliter prijímaná jednotka mimo SI, široko používaná v poľnohospodárstve, pivovarníctve a obchode s tekutinami.\n\nPrevody:\n- **1 hl = 100 l**\n- **1 hl = 0,1 m³ = 100 dm³**\n- **1 hl ≈ 22 imperiálnych galónov (UK) ≈ 26,4 US galónov**\n- **1 hl ≈ 2,75 amerických bušlov** (závisí od komodity)\n\nV poľnohospodárstve je hl kľúčový pre **hektolitrovú váhu** — hmotnosť v kilogramoch, ktorú má 100 litrov obilnín. Je to fundamentálny **kvalitatívny parameter** pre výkup obilnín:\n\n| Plodina | Štandard kg/hl | Krmné | Potravinárske |\n|---------|----------------|-------|---------------|\n| **Pšenica ozimná** | 76–82 | < 74 | 78–84 (E, A) |\n| **Jačmeň sladovnícky** | 64–68 | < 62 | min. 64 |\n| **Jačmeň krmný** | 62–66 | bežné | — |\n| **Žito** | 70–76 | < 68 | 72+ |\n| **Ovos** | 48–52 | < 45 | 50+ |\n| **Repka ozimná** | 64–68 | — | min. 62 |\n| **Tritikale** | 70–76 | bežné | — |\n\n**Prečo hl váha?** Vyššia hektolitrová váha = vyšší obsah škrobu/oleja, menej pliev a šešúľ, lepšia mlynárska kvalita. Mlyny a sladovne určujú cenu obilnín podľa hl váhy + ďalších parametrov (vlhkosť, dusík, Falling Number).\n\nPraktické dopady na príjem farmy:\n- Pšenica 78 kg/hl → potravinárska trieda A → 5800 Kč/t\n- Pšenica 74 kg/hl → krmná → 4200 Kč/t\n- **Rozdiel 1600 Kč/t** = 80 tis. Kč na 50 ha pri výnose 6 t/ha\n\nHektolitrovú váhu merajú mobilné váhy priamo v kombajne (yield monitor, pozri [[yield-monitor]]) alebo presne laboratórne po zbere.\n\nPozri tiež [[busl]] (US ekvivalent), [[q-cent]], [[tuna]], [[kilogram]], [[hektar]].",
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
    "longDef": "Bušl (anglicky *bushel*, skratka *bu*) je tradičná anglosaská jednotka, ktorá sa v poľnohospodárstve používa v dvoch formách:\n\n1. **Objemový bušl** = 35,2391 litra (USA, dry bushel) = 36,3687 l (UK, imperiálny)\n2. **Hmotnostný bušl** — pevne definovaná hmotnosť pre každú komoditu (USDA štandard)\n\nHmotnostný bušl (USDA pre US obchod):\n| Komodita | kg/bušl | lb/bušl |\n|----------|---------|---------|\n| **Pšenica** | 27,2155 | 60 |\n| **Sója** | 27,2155 | 60 |\n| **Kukurica** | 25,4012 | 56 |\n| **Jačmeň** | 21,7724 | 48 |\n| **Ovos** | 14,5150 | 32 |\n| **Žito** | 25,4012 | 56 |\n| **Repka (canola)** | 22,6796 | 50 |\n\n**Prečo je bušl dôležitý pre SK farmára:**\n- **CBOT (Chicago Board of Trade)** — svetové ceny pšenice, kukurice a sóje sa kvotujú v **centoch/bušl**. Pohyby na CBOT diktujú aj ceny v Európe s 1–2 dňovým oneskorením.\n- **USDA WASDE reporty** — mesačné globálne odhady úrody a zásob publikované v miliónoch bušlov.\n- **Export/import** — americká sója a kukurica sa predáva po bušloch.\n\nPrevod **bušl/aker → t/hektár** (kvôli porovnaniu výnosov v USA a EÚ):\n- **Pšenica**: bu/ac × 0,06725 = t/ha (50 bu/ac ≈ 3,36 t/ha)\n- **Kukurica**: bu/ac × 0,06277 = t/ha (175 bu/ac ≈ 10,98 t/ha)\n- **Sója**: bu/ac × 0,06725 = t/ha (50 bu/ac ≈ 3,36 t/ha)\n\nPríklad prevodu ceny CBOT na ČR:\n- Pšenica 600 ¢/bu = 6,00 USD/bu\n- 6,00 USD ÷ 27,2155 kg × 1000 = **220,4 USD/t**\n- × 23 Kč/USD = **5 070 Kč/t** (pred dopravou a maržami)\n\nPozor — **UK imperiálny bušl** (36,37 l) je o 3 % väčší než US bušl, ale v poľnohospodárstve dnes úplne dominuje US štandard.\n\nPozri tiež [[hektolitr]] (EÚ ekvivalent kvalitatívnej jednotky), [[q-cent]], [[tuna]], [[libra]], [[akr]].",
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
    "term": "Jutro",
    "alias": [
      "jitro",
      "historická jednotka plochy",
      "rakúske jutro"
    ],
    "kategorie": "jednotky",
    "shortDef": "Jutro (česky jitro) je historická stredoeurópska jednotka plochy ≈ 0,5755 ha (rakúske/české jutro = 1600 štvorcových siah). Plocha, ktorú pár volov zorá za deň. Dnes zastaraná, ale v katastrálnych zápisoch a rodinnej pamäti prežíva.",
    "longDef": "Jutro (česky *jitro*, latinsky *jugerum*, nemecky *Joch*) je tradičná stredoeurópska jednotka plošného obsahu, ktorej veľkosť sa historicky líšila podľa regiónu. V českých zemiach a Rakúsku-Uhorsku platilo štandardizované **rakúske (dolnorakúske) jutro = 1600 štvorcových siah = 5754,642 m² ≈ 0,5755 ha**.\n\nHlavné regionálne varianty:\n- **Rakúske/české jutro**: 5 754,64 m² = **0,5755 ha** (od roku 1764 v Habsburskej monarchii)\n- **Uhorské jutro**: 5 754,64 m² (rovnaké ako rakúske)\n- **Moravské zemské jutro**: 5 754,64 m² (zjednotené s rakúskym)\n- **Pruské jutro (Morgen)**: 2 553 m² ≈ 0,255 ha (pozri [[morgen]])\n- **Veľké jutro**: niekedy 1,5–1,75 ha (regionálne, neoficiálne)\n\nEtymológia: jutro (česky jitro) = plocha, ktorú pár volov zorá od jutra (rána) do obeda. Pre pár volov s dreveným hákom to bolo cca 0,5–0,6 hektára za pol dňa — odtiaľ rozsah.\n\n**Prečo ešte dnes relevantné:**\n- **Kataster nehnuteľností** — staršie zápisy z 19. a začiatku 20. storočia uvádzajú výmeru v jutrách a štvorcových siahach. Pri dedičských konaniach a prevodoch pozemkov sa s jutrami stále stretávame.\n- **Rodinná pamäť** — sedliacke rodiny si výmery predkov pamätajú v jutrách („dedko mal 12 jutier\", t. j. ≈ 6,9 ha).\n- **Pohraničie** — staré pruské, bavorské, saské mapy používali *Morgen* (≈ 0,25 ha), čo sa občas pletie s jutrom.\n\nPraktické prevody:\n- **1 jutro = 0,5755 ha = 57,55 a = 5 754 m²**\n- **1 jutro ≈ 1,422 akra** (anglosaského)\n- **2 jutrá = 1,151 ha** (tradičné „sedliacke hospodárstvo\" malo 20–40 jutier, t. j. 12–23 ha)\n\nV dnešnom katastri ČR sú jutrá **nahradené m² a hektármi** (vyhláška o katastri), ale staré čísla v pozemkovoknižnom zápise sú stále právne platné.\n\nPozri tiež [[hektar]], [[ar]], [[korec]], [[strych]], [[lan]], [[morgen]].",
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
      "kmetský lán"
    ],
    "kategorie": "jednotky",
    "shortDef": "Lán je stredoveká česká jednotka plochy ≈ 18 ha (presnejšie 16–24 ha podľa regiónu). Plocha sedliackeho hospodárstva, ktoré uživí jednu rodinu. Dnes zastaraná, ale historicky zásadná jednotka.",
    "longDef": "Lán je historická česká jednotka plošného obsahu, používaná od raného stredoveku do 18. storočia. Veľkosť lánu sa výrazne líšila podľa regiónu, doby a typu (sedliacky/kráľovský/kmetský), ale v štandarde z urbára platilo:\n\n**Český lán (kmetský, sedliacky)**: typicky 64 strychov ≈ **18 ha** (16–24 ha v praxi).\n\nTypy lánov:\n- **Lán kmetský (sedliacky)** — 60–64 strychov ≈ 16–20 ha, hospodárstvo poddaného sedliaka\n- **Lán kráľovský** — 70–84 strychov ≈ 19–24 ha, mierne väčší\n- **Pražský lán** — štandardizovaný na 64 strychov ≈ 18,2 ha\n- **Lán moravský** — variabilný, 16–21 ha\n- **Pôllán** — polovica lánu, drobnejšie hospodárstvo (8–10 ha)\n- **Štvrťlán** — štvrtina, chalupníci (4–5 ha)\n- **Záhradník** — bez lánu, len dom a záhrada (< 1 ha)\n\nLán bol **základnou ekonomicko-sociálnou jednotkou** českého vidieka:\n- **Dane a robota** — robotné povinnosti sa vymedzovali podľa veľkosti lánu (3 dni v týždni pre celý lán).\n- **Spoločenský status** — *láník* (sedliak s celým lánom) bol najvyššia vrstva poddaného obyvateľstva.\n- **Dedičstvo** — lán sa v Čechách typicky nedelil (právo nedielu), dedil ho jeden syn, ostatní šli na remeslo alebo do mesta.\n\nLán bol tvorený mnohými menšími pozemkami (políčka, lúky, pastviny, les) roztrúsenými po katastri obce — typický **trojhonný systém** (ozim/jarín/úhor) vyžadoval mať pôdu vo viacerých honoch.\n\nPo **patentoch Márie Terézie** (1755) a **jozefínskom katastri** (1789) sa lán postupne nahrádzal presnejšími jutrami a m². V Tereziánskom katastri (1748) boli lány konkrétne vymedzené — preto dnes vieme presné veľkosti pre jednotlivé dediny.\n\nV modernom kontexte:\n- **Genealógia a rodopis** — staré matričné a urbárne zápisy uvádzajú predkov ako „láník\", „pôlláník\", „chalupník\".\n- **História obcí** — kronikári a regionálni historici pracujú s lánmi pri popise stredovekej štruktúry dediny.\n- **Miestne názvy** — „Veľký lán\", „Lánska cesta\", „Na lánoch\" sú dodnes živé pomiestne názvy.\n\nPozor — moderné slovo „lán\" ako synonymum pre veľké pole (napr. „nekonečné lány obilia\") je už metaforické, nepredstavuje konkrétnu jednotku.\n\nPozri tiež [[jitro]], [[korec]], [[strych]], [[hektar]].",
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
    "longDef": "Korec je historická česká jednotka plošného obsahu, etymologicky odvodená od **korca ako objemovej miery obilnín** (asi 93 litrov). Korec pôdy = plocha, na ktorú sa vyseje 1 korec osiva.\n\n**Štandardizovaný český (pražský) korec**: 2 877,32 m² = **28,77 a ≈ 0,288 ha**.\n\nRegionálne varianty:\n- **Pražský korec**: 2 877 m² ≈ 0,288 ha (oficiálne od r. 1764)\n- **Moravský korec**: variabilný, 1 920–2 880 m² (0,19–0,29 ha)\n- **Sliezsky korec**: 2 877 m² (zjednotený s pražským)\n- **Veľký korec** (lesný): niekedy až 5 754 m² (= jedno jutro)\n\nVzťah k ďalším historickým jednotkám:\n- **1 jutro = 2 korce** (po 1 800 štvorcových siahach + regionálne zaokrúhlenie)\n- **1 strych = 1 korec** (synonymum v niektorých regiónoch, pozri [[strych]])\n- **1 lán = 60–64 korcov** ≈ 17–18 ha\n\nV hospodárskej praxi:\n- **Drobné chalupnícke usedlosti**: 2–4 korce (= 0,6–1,2 ha)\n- **Stredný statok**: 20–40 korcov (= 5,8–11,5 ha)\n- **Sedliacky láník**: 60+ korcov = 1 lán = 17+ ha\n\n**Prečo sa s korcom dnes ešte stretávame:**\n- **Katastrálne zápisy do roku 1869** používajú korce a jutrá. Vklad starého zápisu pri dedičstve → stretnete sa s korcami.\n- **Rodinné kroniky a rozprávanie** — „dedko mal 8 korcov pri potoku\" = ≈ 2,3 ha.\n- **Pomiestne názvy** — „Na korci\", „Korecká lúka\" sú v ČR rozšírené.\n- **Genealógia** — gruntovné knihy a urbáre (16.–19. storočie) — výmery v korcoch/strychoch.\n\nPraktické prevody:\n- **1 korec = 0,2877 ha = 28,77 a = 2 877 m²**\n- **1 korec ≈ 0,711 akra**\n- **3,5 korca = 1 ha** (zaokrúhlene)\n\nPo zavedení metrickej sústavy (v Rakúsko-Uhorsku zákonom z roku 1871 s účinnosťou od 1876) bol korec **oficiálne nahradený hektárom a árom**. Dnes nemá právnu platnosť ako jednotka, ale staré zápisy zostávajú právne relevantné.\n\nPozri tiež [[strych]] (synonymum v niektorých regiónoch), [[jitro]], [[lan]], [[hektar]], [[ar]].",
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
    "shortDef": "Strych je historická stredoeurópska jednotka plochy ≈ 0,288 ha (28,8 a), v podstate synonymum českého korca. Plocha, na ktorú sa vyseje 1 strych (objem) osiva. V Tereziánskom katastri a starých zápisoch prežíva dodnes.",
    "longDef": "Strych je tradičná česká a stredoeurópska jednotka plošného obsahu. Slovo pochádza z nemeckého *Strich* (= pruh, riadok, vyznačený pás pôdy). V mnohých regiónoch je strych **synonymom korca** — obe jednotky boli definované ako plocha, na ktorú sa vyseje 1 strych/korec (objemová miera ≈ 93 l) obilnín.\n\n**Český strych**: 2 877 m² ≈ **0,288 ha** (totožný s pražským korcom).\n\nRegionálne varianty:\n- **Český/pražský strych**: 2 877 m² ≈ 0,288 ha\n- **Moravský strych**: 1 920–2 880 m² (0,19–0,29 ha) — variabilný\n- **Sliezsky strych**: 2 877 m² (zjednotený s českým po patentoch Márie Terézie)\n- **Veľký strych** (lesný): až dvojnásobok\n\nV niektorých regiónoch juhovýchodnej Moravy a Slovenska bol strych pevne menší než český korec (≈ 0,2 ha) — preto vždy v archívnych prameňoch overiť lokálnu definíciu.\n\n**Použitie historicky:**\n- **Tereziánsky kataster (1748)** — výmery polí, lúk a pastvín zapísané v strychoch/jutrách.\n- **Robotné patenty** — robotné povinnosti sa odvíjali od počtu strychov.\n- **Urbárne knihy 17.–18. storočia** — daňová evidencia drobnej držby.\n\n**Vzťah k ďalším jednotkám:**\n- **1 strych = 1 korec** (v českej štandardizácii po 1764)\n- **2 strychy = 1 jutro** (≈ 0,575 ha)\n- **64 strychov = 1 lán** (≈ 18 ha)\n- **3,48 strychu = 1 ha**\n\n**Dnes ešte stretávame strych:**\n- **Kataster nehnuteľností** — staré zápisy pred zavedením metrickej sústavy (1876).\n- **Genealógia / rodopis** — matriky a gruntovné knihy uvádzajú výmery v strychoch.\n- **Pomiestne názvy** — „Strychy\", „Na strychu\", „Strychové polia\" v niektorých obciach.\n\nPraktické prevody:\n- **1 strych = 0,288 ha = 28,8 a = 2 877 m²**\n- **1 strych ≈ 0,712 akra**\n- **3,48 strychu = 1 hektár**\n\nPo zavedení metrickej sústavy (1876) bol strych **oficiálne zrušený** ako platná jednotka. Na pochopenie starých dokumentov ho však treba poznať.\n\nPozri tiež [[korec]] (synonymum), [[jitro]] (= 2 strychy), [[lan]], [[hektar]].",
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
    "longDef": "Metrická tuna (značka **t**, niekedy *Mg* — megagram) je jednotka hmotnosti = 1 000 kg = 10⁶ gramov. V SI je tuna prijímaná jednotka mimo SI, ale fakticky dominantná pre praktické váženie v poľnohospodárstve, obchode i priemysle.\n\nPrevody:\n- **1 t = 1 000 kg = 10 q** (metrických centov)\n- **1 t ≈ 2 204,62 lb** (anglických libier)\n- **1 t ≈ 22,046 amerických short tonov** (US short ton = 907,18 kg)\n- **1 t ≈ 0,9842 long tonov (UK)** (long ton = 1 016 kg)\n- **1 t pšenice ≈ 36,7 bušlov** (US)\n- **1 t kukurice ≈ 39,4 bušlov**\n\nPoužitie v poľnohospodárstve (ČR + EÚ štandard):\n- **Výnosy plodín** — t/ha je dominantná jednotka. Pšenica 5–8 t/ha, kukurica 8–12 t/ha, repka 3–4,5 t/ha, jačmeň 5–7 t/ha.\n- **Výkupné ceny** — Kč/t. Príklad 2024: pšenica 4 800–5 500 Kč/t, kukurica 3 800–4 500 Kč/t.\n- **Hnojivá** — t/ha hnojovice (15–25 t/ha), kg/ha NPK, ale balenie dnes typicky v t (big-bag 600 kg ≈ 0,6 t, kontajner 1 t).\n- **Kapacita strojov** — náves 14–24 t, zásobník kombajnu 8–13 m³ ≈ 6–10 t obilnín.\n- **Medzinárodný obchod** — CBOT, MATIF, FOB ceny v USD/t, EUR/t.\n\nPraktické príklady:\n- Pole 50 ha pšenice × 6,5 t/ha = 325 t = **6,5 železničných vagónov** (vagón ~50 t)\n- Zber kukurice 100 ha × 10 t/ha = 1 000 t = **40 návesov × 25 t**\n- Ročná spotreba hnojív na farme s 500 ha: 250 t LAV + 100 t DAM = 350 t\n\n**Tuna vs short ton (US/UK):**\nV medzinárodnom obchode pozor — americký *short ton* (2 000 lb) má len 907 kg, *long ton* (UK, 2 240 lb) má 1 016 kg. Ak čítate USDA reporty alebo americké zdroje, vždy si overte, aká „ton\" je myslená. **CBOT a obchod v EÚ používajú výhradne metrickú tunu (t)**.\n\nPozri tiež [[q-cent]] (= 0,1 t), [[kilogram]], [[busl]] (komoditný prevod).",
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
    "longDef": "Kilogram (kg) je **základná jednotka hmotnosti v SI sústave**. Od roku 2019 je definovaný pomocou Planckovej konštanty (h = 6,62607015 × 10⁻³⁴ J·s), predtým bol definovaný ako hmotnosť medzinárodného prototypu uloženého v Sèvres pri Paríži.\n\nPrevod:\n- **1 kg = 1 000 g = 1 000 000 mg**\n- **1 kg = 0,001 t = 0,01 q**\n- **1 kg ≈ 2,2046 lb** (libra)\n- **1 kg ≈ 35,274 oz** (unca, USA/UK)\n\nPoužitie v poľnohospodárstve:\n- **Dávkovanie hnojív** — kg/ha čistých živín. Príklad: pšenica ozimná 150 kg N/ha, kukurica 180 kg N/ha. Pozor: kg živín ≠ kg hnojiva (LAV má 27,5 % N → 150 kg N = 545 kg LAV/ha).\n- **Dávkovanie postrekov** — kg/ha pre granulované prípravky a moridlá. Príklad: Roundup 360 SL je tekutý (l/ha), ale glyfosát vo forme soli sa uvádza v g/ha (720 g a.s./ha).\n- **Váha zvierat** — teľatá 35–45 kg pri narodení, dospelé dojnice 600–750 kg, býk plemenník 1 000+ kg.\n- **Ceny krmív** — Kč/kg pre premixy a koncentráty (10–30 Kč/kg), Kč/t pre bežné kŕmne zmesi.\n- **Osivo** — pšenica 180–220 kg/ha, kukurica 22–28 kg/ha (oveľa menšia dávka — väčšie zrno).\n- **Balenie produktov** — vrecia hnojív 25/40/50 kg, big-bag 500–1 200 kg, balíky siláže 600–800 kg.\n\n**Hektolitrová váha** — kg/hl je kvalitatívny parameter obilia (pozri [[hektolitr]]). Pšenica potravinárska 78+ kg/hl, kŕmna < 74 kg/hl.\n\n**Meranie živej hmotnosti vs jatočná hmotnosť:**\n- **Živá hmotnosť** (LW — Live Weight) = váha zvieraťa na váhe\n- **Jatočná hmotnosť** (CW — Carcass Weight) = váha tela po porážke\n- Pomer CW/LW: dobytok ~55–60 %, prasa ~75 %, hydina ~70 %\n\nPraktické prirovnania:\n- **Vrece cementu**: 25 kg\n- **Vrece pšenice (osivo)**: 25 kg (štandardné balenie)\n- **Big-bag hnojiva**: 600 kg\n- **Teľa**: 40 kg\n- **Selecky pas dojnice**: 650 kg\n- **Veľký traktor (Fendt 1050)**: ~13 000 kg\n- **Náves Joskin Trans-CAP plný hnojovice**: ~30 000 kg (= 30 t)\n\nPozri tiež [[tuna]] (= 1 000 kg), [[q-cent]] (= 100 kg), [[libra]] (USA/UK).",
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
    "longDef": "Libra (anglicky *pound*, skratka *lb* z latinského *libra*) je tradičná anglosaská jednotka hmotnosti. **Medzinárodná libra** (definovaná od roku 1959) = **0,45359237 kg** presne.\n\nPrevody:\n- **1 lb = 0,4536 kg** (presne 0,45359237)\n- **1 lb = 16 oz** (uncí)\n- **1 kg ≈ 2,2046 lb**\n- **1 t ≈ 2 204,62 lb**\n- **1 short ton (US)** = 2 000 lb = 907,18 kg\n- **1 long ton (UK)** = 2 240 lb = 1 016 kg\n- **1 bušl pšenice** = 60 lb = 27,2155 kg\n\nHistoricky existovali desiatky regionálnych libier (apothecary lb 373 g, troy lb 373 g, French livre 489 g, ...), ale dnes je v praxi len **medzinárodná libra (0,4536 kg)** v anglosaskom obchode.\n\n**Kde libra v SK poľnohospodárstve:**\n- **USDA reporty** — WASDE, ERS publikácie uvádzajú ceny v ¢/lb pre niektoré komodity (bavlna, maslo, syr).\n- **CBOT futures** — sójový olej sa kvotuje v ¢/lb (cca 45–60 ¢/lb v 2024). Dobytok (live cattle) sa obchoduje v ¢/lb (cca 180–200 ¢/lb).\n- **Krmivá, premixy a doplnky** — americké zdroje uvádzajú dávky v lb/head/day.\n- **Genetika a plemenné zápisy** — váhy plemenných býkov a kráv v lb (US Holstein registry).\n- **Outdoor / lov / rybolov** — v ČR populárne „libra\" na označenie veľkých rýb (kapor 20+ lb = trofejné rozmery).\n\nPrevod cien CBOT:\n- Sójový olej 50 ¢/lb = 0,50 USD/lb × 2,2046 = **1,10 USD/kg** = **1 100 USD/t**\n- Live cattle 200 ¢/lb = 2,00 USD/lb × 2,2046 = **4,41 USD/kg** živej hmotnosti\n\n**Pozor — libra ≠ kilogram:**\nČasté chyby v prekladoch receptov a krmných tabuliek. Američan napíše „180 lb cow\" = 82 kg teľa (myslené teľa, nie krava!). Dospelá US cow = 1 200–1 400 lb = 545–635 kg.\n\nPre SK farmára praktická pomôcka: **lb × 0,5** dáva rýchly odhad v kg (presnejšie × 0,4536, ale lb × 0,5 je dosť pre mentálnu matematiku). Príklad: 2 000 lb ≈ 1 000 kg (skutočne 907 kg).\n\nPozri tiež [[kilogram]] (SI), [[tuna]], [[busl]] (= 60 lb pre pšenicu).",
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
      "nemecké jutro",
      "Morgen"
    ],
    "kategorie": "jednotky",
    "shortDef": "Morgen je historická nemecká/rakúska jednotka plochy. Pruský morgen = 0,2553 ha, bavorský = 0,3407 ha, rakúsky = 0,5755 ha (= rakúske jutro). V pohraničí a starých zápisoch prežíva.",
    "longDef": "Morgen (nemecky „ráno\") je historická stredoeurópska jednotka plošného obsahu, definovaná ako plocha, ktorú pár volov zorá za jedno ráno (jutro). Rovnako ako české [[jitro]] sa veľkosť výrazne líšila podľa regiónu — Nemecko bolo do roku 1872 fragmentované na desiatky krajín, každá s vlastnou mierou.\n\nHlavné varianty (pred metrickou reformou):\n- **Pruský morgen** (Magdeburský): 2 553,2 m² ≈ **0,2553 ha**\n- **Bavorský morgen**: 3 407,3 m² ≈ **0,3407 ha**\n- **Saský morgen**: 2 767 m² ≈ 0,277 ha\n- **Hesenský morgen**: 2 500 m² (zaokrúhlené na 0,25 ha v 19. storočí)\n- **Württemberský morgen**: 3 152 m² ≈ 0,315 ha\n- **Rakúsky/dolnorakúsky morgen** (= jutro): 5 754,6 m² ≈ **0,5755 ha**\n\nPo **metrickej reforme v Nemeckej ríši (1872)** bol morgen oficiálne zrušený, ale v bežnej reči a katastrálnych zápisoch v niektorých regiónoch prežíva dodnes — **najmä na severe Nemecka** (Mecklenburg, Sasko) uvádza staršia generácia výmery v morgenoch.\n\n**Prečo relevantné pre českého farmára:**\n- **Pohraničie** (Šumava, Krkonošsko, Krušné hory, južná Morava) — staré nemecké mapy z čias R-U a pred rokom 1945 uvádzali výmery v morgenoch. Pri reštitúciách a katastrálnych sporoch na ne narazíte.\n- **Nákup pozemkov v DE** — zahraniční predajcovia/inzeráty v severnom Nemecku občas uvádzajú morgeny (najmä lesníctvo).\n- **Pruské katastrálne mapy** — historický výskum vlastníctva Sudet, lichtenštejnských statkov atď.\n\nPraktické prevody (najčastejší — pruský morgen):\n- **1 pruský morgen = 0,2553 ha = 25,53 a = 2 553 m²**\n- **1 pruský morgen ≈ 0,631 akra**\n- **4 pruské morgeny ≈ 1 ha**\n- **1 ha = 3,92 pruského morgenu**\n\nPozor — **rakúsky morgen** je úplne niečo iné (= rakúske jutro = 0,5755 ha). Pri čítaní starých máp vždy najprv zistiť, z ktorej krajiny mapa pochádza.\n\nV súčasnej formálnej agende **morgen nemá žiadnu právnu platnosť** ani v Nemecku, ani v ČR.\n\nPozri tiež [[jitro]] (rakúsky variant), [[akr]], [[hektar]], [[korec]].",
    "related": [
      "jitro",
      "akr",
      "hektar",
      "korec"
    ]
  },
  {
    "slug": "turbodmychadlo",
    "term": "Turbodúchadlo",
    "alias": [
      "turbo",
      "turbocharger",
      "preplňovanie"
    ],
    "kategorie": "pohon",
    "shortDef": "Turbodúchadlo využíva energiu výfukových plynov na roztočenie turbíny, ktorá stlačí vzduch do valca — vyšší výkon z tej istej kubatúry motora.",
    "longDef": "Turbodúchadlo (turbo, turbocharger) je dvojica spojených obežných kolies — turbína na strane výfuku a kompresor na strane sania. Výfukové plyny roztáčajú turbínu (až 200 000 ot/min), spojený hriadeľ poháňa kompresor, ktorý stlačí nasávaný vzduch pred vstupom do valca.\n\nDôsledky pre motor:\n- **+30–50 % výkonu z tej istej kubatúry** vs atmosférický motor.\n- **Vyšší krútiaci moment v nízkych otáčkach** (kľúčové pre ťahové práce).\n- **Lepšia účinnosť** vo vyšších nadmorských výškach (kompenzuje riedky vzduch).\n\nModerné traktorové motory používajú:\n- **VGT** (Variable Geometry Turbo) — meniteľná geometria lopatiek turbíny, optimálny boost v širšom pásme otáčok.\n- **Twin-turbo** (sériové alebo paralelné) pri top motoroch (Fendt 1000, JD 9R) — primárne turbo pre nízke otáčky, sekundárne pre vysoké.\n- **Intercooler** (medzichladič) za turbom — chladí stlačený horúci vzduch, hustejšia náplň, vyšší výkon.\n\nÚdržba: pravidelná výmena oleja (turbo má ložiská mazané olejom motora), po vypnutí motora turbo dobehne 30+ sekúnd — preto nie je možné hneď vypínať po plnej záťaži (riziko zničenia ložísk). Životnosť pri dobrej údržbe 10 000+ motohodín.",
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
    "longDef": "EGR je systém čistenia výfukových plynov, ktorý recirkuluje 5–30 % výfukových plynov späť do sacieho potrubia. Dôvod: nižšia teplota spaľovania → menej NOx (oxidov dusíka) vo výfuku.\n\nPoužitie pri traktoroch:\n- **Stage IIIA–IIIB** (2006–2014): hlavná cesta zníženia NOx. EGR + DPF.\n- **Stage IV+** (2014+): EGR doplnený alebo nahradený SCR (AdBlue). Vyššia účinnosť.\n\nNevýhody EGR:\n- **Sadze v saní** — recirkulované plyny obsahujú PM, postupne sa usadzujú v EGR ventile a sacom potrubí. Po 5–8 000 motohodinách typicky vyžaduje čistenie (5–15 000 Kč).\n- **Zníženie výkonu o 3–5 %** — recirkulované plyny znižujú koncentráciu kyslíka.\n- **Vyššia spotreba** o 2–4 % v porovnaní s motorom bez EGR.\n\nPreto výrobcovia pri Stage V prešli na SCR ako dominantnú cestu — vyššia obstarávacia cena, ale nižšie prevádzkové náklady (menej paliva, menej opráv).",
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
    "shortDef": "Biodiesel je palivo z rastlinných olejov (repkový metylester, FAME) — v ČR povinne pridávané do bežnej nafty (B7 = 7 % FAME).",
    "longDef": "Biodiesel je obnoviteľné palivo vyrobené esterifikáciou rastlinných olejov (najčastejšie repkový olej v ČR, sójový v USA, palmový v Ázii) alebo živočíšnych tukov s metanolom → FAME (Fatty Acid Methyl Ester).\n\nV Európe:\n- **B7** — 7 % FAME v bežnej motorovej nafte. Štandardné palivo na čerpacích staniciach od cca 2010. Kompatibilné so všetkými modernými motormi.\n- **B30 / B100** — 30 % alebo 100 % FAME. Vyžaduje špecifické tesnenie + olej, nie každý motor je certifikovaný. Slabšia výhrevnosť (cca −7 %) → vyššia spotreba.\n\nPre poľnohospodárov:\n- **Modré nafty (z benzínky)** v ČR sú vždy B7 = obsahujú FAME.\n- **Vlastné biopalivá** (pestuje + lisuje repku) — možné, ale riziko zničenia Common Rail vstrekovačov, ak nie je dostatočne vyčistené.\n- **Stage V motory** typicky certifikované pre B7. Vyššie koncentrácie (B30+) vyžadujú schválenie výrobcu.\n\nPozor: staršie motory Common Rail môžu mať problém aj s B7 — FAME má iné lubrikačné vlastnosti, vyššiu vodivosť (riziko galvanickej korózie). Pri traktoroch z 90. rokov s mechanickými čerpadlami nehrozí.",
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
    "shortDef": "PowrQuad je prevodovka John Deere kombinujúca 4 mechanické rady × 4 hydraulicky radené stupne = 16 vpred / 16 vzad. Podskupina powershift prevodoviek.",
    "longDef": "PowrQuad (John Deere brand názov) je prevodovka s mechanickými hlavnými radami (range A, B, C, D) × 4 hydraulicky radené stupne v každej rade = 16×16 alebo 24×24 s ďalšou nadstavbou.\n\nTypy John Deere prevodoviek (od základu po flagship):\n1. **SyncReverser** — manuálne radenie, mechanický reverz. Základ.\n2. **PowrReverser** — manuálne radenie, hydraulický reverz (= power shuttle).\n3. **PowrQuad** — 4 mechanické × 4 powershift = 16×16. Štandardné pre radu 6M.\n4. **AutoQuad** — PowrQuad + automatické radenie stupňov. Komfortnejšie.\n5. **AutoPowr / IVT** — plne bezstupňová CVT. Flagship 6R+/7R/8R.\n\nEkvivalenty konkurencie:\n- Case IH Maxxum **ActiveDrive 8** (16×8 powershift).\n- New Holland **Range Command** (16×6 powershift).\n- Fendt **Vario** (CVT — nie powershift).\n\nPre českého farmára: PowrQuad je sweet spot medzi cenou a komfortom — 200–300 tis. Kč lacnejšie než AutoPowr CVT, ale radí pod záťažou. Vyplatí sa pre orbu a ťahové práce, kde vodič radí relatívne málo.",
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
    "shortDef": "Predný trojbodový záves je hydraulický záves voliteľne inštalovaný pred traktorom — umožňuje \"sendvičové\" nasadenie náradia vpredu aj vzadu súčasne.",
    "longDef": "Predný trojbodový záves (front linkage) je obdoba zadného trojbodu, inštalovaný pred prednú nápravu. Často kombinovaný s predným PTO (vývodový hriadeľ).\n\nHlavné využitie:\n- **Kosačka + lis** — predná kosačka kosí, zadný lis balí. Jednou jazdou = dvojnásobná produktivita.\n- **Predné valce / brány + pluh** — paralelné spracovanie pôdy.\n- **Predný valec po orbe + hnojenie/sejba** — kombinovaná jazda.\n- **Predný navijak / lesné zariadenie** — pre horské prevádzky.\n\nŠpecifikácie:\n- **Zdvihová kapacita** typicky 2 000–5 000 kg (menej než zadný 6 000–12 000 kg).\n- **Spúšťacia dráha** kratšia (cca 700 mm) — predné náradie máva menší výhľad.\n- **PTO** rovnaké štandardy (540 / 1000 ot/min).\n\nCenová stránka:\n- Továrenský predný trojbodový záves 80 000–200 000 Kč príplatok.\n- Retrofit (od dodávateľa ako Sauter, Hauer, Lely) 60 000–180 000 Kč + montáž.\n\nPre slovenskú farmu < 50 ha málokedy návratný — oplatí sa hlavne pri > 100 ha lúk/ďatelinísk alebo špecializované práce.",
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
    "longDef": "NDVI (Normalized Difference Vegetation Index) je vegetačný index používaný v diaľkovom prieskume Zeme. Vzorec: NDVI = (NIR − RED) / (NIR + RED), kde NIR = blízke infračervené svetlo, RED = červené.\n\nPrincíp: zdravé rastliny silne reflektujú NIR (kvôli bunkovej štruktúre listov) a absorbujú RED (kvôli chlorofylu). Holá pôda alebo choré rastliny reflektujú oboje podobne → nízke NDVI.\n\nHodnoty:\n- **NDVI < 0**: voda, sneh, mrak.\n- **0–0,2**: holá pôda, kameň.\n- **0,2–0,4**: riedka vegetácia, mladá plodina.\n- **0,4–0,6**: stredne hustá plodina.\n- **0,6–0,8**: hustá zdravá plodina (vrchol vegetácie).\n- **0,8+**: veľmi hustý porast (les, vzrastlý lán).\n\nPre poľnohospodárstvo:\n- **Aplikačné mapy** pre variabilné hnojenie/postrek — kde je NDVI nízke, daj viac N.\n- **Monitoring vývoja plodiny** — sledovanie rastu vs očakávania.\n- **Detekcia stresu** (sucho, choroba) — pokles NDVI uprostred vegetačnej sezóny.\n\nZdroje dát:\n- **Sentinel-2** (ESA, zadarmo) — 10 m rozlíšenie, snímky každých 5 dní. Štandard pre slovenského farmára.\n- **Planet Labs** ($, 3 m rozlíšenie) — denné snímky, pre precision farming.\n- **Drony** s multispektrálnou kamerou — vlastné lety, 5 cm rozlíšenie.",
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
    "longDef": "Controlled Traffic Farming (CTF) je princíp presného poľnohospodárstva, kde sa obmedzuje plocha utužená kolesami strojov — všetky stroje jazdia po identických koľajach (tramlines), zvyšok poľa zostáva nedotknutý.\n\nPredpoklady:\n- **RTK GPS auto-steering** (centimetrová presnosť) — bez neho kolesá nedržia presne koľaje.\n- **Rovnaký / násobný stopový priemer** všetkých strojov — typicky 3 m (postrekovač) a 6 m (kombajn) = 6 m záber postreku + 6/12/24 m záber sejby.\n- **Rovnaký rozchod kolies** (track width) — typicky 2,25 m alebo 3,00 m.\n\nVýhody:\n- **Zníženie utuženia** o 60–80 % — zvyšok poľa nikdy nepojazdia kolesá.\n- **Vyššie výnosy** 5–15 % vďaka lepšej štruktúre pôdy v medziriadkoch.\n- **Menej paliva** — menej práce na spracovanie utuženej pôdy.\n- **Lepšie zasakovanie vody** — menšia erózia.\n\nNevýhody:\n- **Vysoká počiatočná investícia** — RTK GPS systém + zjednotenie strojov (rozchodu) môže stáť 500K – 2M Kč na farmu.\n- **Komplikácie pri výmene stroja** — nový kombajn musí mať rovnaký rozchod.\n- **V ČR málo rozšírené** — vyžaduje veľké lány (>50 ha súvislých) pre ekonomickú návratnosť.",
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
    "longDef": "Yield monitor je integrovaný systém v kombajne, ktorý kontinuálne meria:\n1. **Hmotnosť zrna** prechádzajúceho cez elevátor (typicky optický alebo nárazový senzor).\n2. **Vlhkosť zrna** (kapacitný alebo NIR senzor) — pre prepočet na \"suchú\" hmotnosť.\n3. **Záber stola** + **rýchlosť** = aktuálna plocha za sekundu.\n4. **GPS pozícia** každé 1–2 sekundy.\n\nOutput: bodové dáta (lat, lng, kg/m²) → interpolácia do mriežky → **výnosová mapa poľa**.\n\nKľúčové značky:\n- **John Deere GreenStar / Operations Center** — dominantné v USA, OK v EÚ.\n- **Case IH AFS / NH IntelliView** — spoločný ekosystém CNH.\n- **Claas TELEMATICS** — premium EÚ.\n- **Trimble FmX / AGCO Fuse** — tretie strany, multi-brand kompatibilné.\n\nPre českú farmu:\n- **Bez yield monitoru kombajn za 8M Kč = len zber**, nie dátová stanica.\n- Yield mapa za 1 sezónu = základ pre **VRA (variable rate)** na budúci rok — viac P/K tam, kde to potrebuje, menej tam, kde nie.\n- ROI 2–3 sezóny pri farme > 100 ha.\n\nPraktické tipy: kalibrácia 1×/sezónu na váhovom aute (chyba 1–3 %), vlhkostný senzor čistiť denne (zaprášený senzor = posunuté dáta).",
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
    "shortDef": "DAP (diamonfosfát) je granulované hnojivo s 18 % dusíka a 46 % fosforu (P₂O₅). Hlavný zdroj fosforu pre české poľnohospodárstvo.",
    "longDef": "DAP je vysokokoncentrované fosforečné hnojivo (Diamonium Phosphate, chemicky (NH₄)₂HPO₄) s obsahom 18 % N a 46 % P₂O₅. Vyrába sa reakciou kyseliny fosforečnej s amoniakom.\n\nPoužitie:\n- **Štartovacie do osiva** — 100–200 kg/ha, aplikuje sa s osivom do riadkov. Vysoký fosfor podporuje rozvoj koreňového systému mladej rastliny.\n- **Jesenné pod oziminy** — 150–300 kg/ha, zaorie sa. Fosfor sa v pôde pohybuje pomaly, preto sa aplikuje hlboko a vopred.\n- **Jarné pod jariny** — menej časté, fosfor by nemal zostať na povrchu.\n\nVlastnosti:\n- **Mierne kyslá reakcia** v pôde (pH okolo 6) — vhodné pre neutrálne až slabo zásadité pôdy.\n- **Vysoká vodorozpustnosť** — okamžite dostupný pre plodinu (na rozdiel od MAP).\n- **Cena 2024**: cca 16 000–22 000 Kč/t.\n\nPozor: na alkalickej pôde (pH > 7,5) prechádza fosfor rýchlo do nerozpustných foriem (vápenaté soli) → krátka účinnosť. V tom prípade lepšie použiť MAP alebo superfosfát.",
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
    "shortDef": "Glyfosát (komerčný Roundup) je neselektívny systémový herbicíd — zabíja všetky rastliny po nástreku. Dominantný herbicíd českého poľnohospodárstva pre úhor.",
    "longDef": "Glyfosát je najpoužívanejší herbicíd na svete, predávaný pod značkou Roundup (Monsanto/Bayer) aj generikami. Neselektívny = zabíja akúkoľvek rastlinu, systémový = absorbuje sa listami a transportuje do koreňov.\n\nPoužitie v ČR:\n- **Úhor pred siatím** — vyčistí pole od buriny a strniska.\n- **Pre-emergence** pred vzídením plodiny — 1–2 dni pred.\n- **Desikácia** pred zberom — v EÚ ju od 16. 12. 2023 povoliť nemožno (vykonávacie nariadenie (EÚ) 2023/2660 vylučuje použitie na riadenie termínu zberu a uľahčenie mlátenia).\n- **Lesné porasty** — proti burine na rúbaniskách.\n\nCena (2024):\n- **Roundup Klasik 360 g/l** — cca 200–280 Kč/l v 20l kanistri. Dávka 3–4 l/ha.\n- **Generika** (Glyfogan, Touchdown, Clinic) — 150–220 Kč/l.\n\nKontroverzie:\n- **Schválenie v EÚ** bolo v roku 2023 obnovené na 10 rokov, do 15. 12. 2033 (vykonávacie nariadenie (EÚ) 2023/2660), s novými obmedzeniami.\n- **IARC klasifikácia** \"pravdepodobne karcinogénny pre človeka\" (2A) — kontroverzné, EÚ EFSA klasifikuje ako bezpečný pri dodržaní dávok.\n- **Maloobchod v ČR**: bez obmedzení.\n- **Bio-poľnohospodárstvo**: striktne zakázaný.",
    "related": [
      "mezi-plodiny"
    ]
  },
  {
    "slug": "jednotna-zadost",
    "term": "Jednotná žiadosť",
    "alias": [
      "JŽ",
      "žiadosť o priame platby"
    ],
    "kategorie": "dotace",
    "shortDef": "Jednotná žiadosť je každoročná žiadosť, v ktorej poľnohospodár žiada o priame platby (BISS, redistributívna platba, ekoschémy, CIS, platba pre mladých poľnohospodárov) aj o ďalšie plošné podpory, napríklad ANC. V Česku sa podáva SZIF cez Portál farmára, na Slovensku Pôdohospodárskej platobnej agentúre (PPA).",
    "longDef": "Jednotná žiadosť (JŽ) je hlavný formulár, ktorým poľnohospodár každý rok žiada o plošné podpory. V ČR sa podáva výhradne elektronicky cez Portál farmára SZIF; na Slovensku ju prijíma PPA podľa vlastných pravidiel a termínov.\n\nČo v nej žiadateľ v ČR deklaruje:\n- **Diely pôdnych blokov** z LPIS — výmeru, kultúru a zákresy plodín.\n- **Priame platby** — BISS, redistributívnu platbu (CRISS), celofarmovú ekoplatbu, platbu pre mladých poľnohospodárov, alebo namiesto nich zjednodušenú platbu pre malých poľnohospodárov.\n- **CIS** (viazaná podpora príjmu) — plochy chmeľu, ovocia, zeleniny, cukrovej repy, škrobových zemiakov a bielkovinových plodín a počty zvierat.\n- **ANC** a ďalšie plošné opatrenia; žiadosti o AEKO a ekologické poľnohospodárstvo sa pripravujú na Portáli farmára spolu s ňou.\n\nTermín v ČR (2025): do 15. mája. Za oneskorené podanie sa platba kráti o 1 % za každý pracovný deň; pri omeškaní nad 25 kalendárnych dní (v roku 2025 po 9. júni) sa konanie zastaví a žiadateľ nedostane nič.\n\nPo podaní SZIF žiadosti kontroluje administratívne, na mieste a satelitným monitoringom plôch (AMS) — výsledky vidí žiadateľ na portáli AMS. Sadzby za rok 2025 schválil minister poľnohospodárstva ČR v októbri 2025; pri vybraných podporách SZIF vyplácal preddavky vo výške 70 %.",
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
    "shortDef": "AEKO (agroenvironmentálno-klimatické opatrenia) sú dobrovoľné päťročné záväzky k šetrnému hospodáreniu — zatrávňovanie ornej pôdy, starostlivosť o extenzívne trávne porasty, biopásy, medziplodiny, krajinotvorné sady a ďalšie. V ČR ich upravuje nariadenie vlády č. 80/2023 Sb.",
    "longDef": "AEKO (agroenvironmentálno-klimatické opatrenia) sú v ČR intervencie II. piliera českého Strategického plánu SPP 2023–2027. Žiadateľ sa zaväzuje na päť rokov a každý rok potom žiada o platbu. Sadzby stanovuje nariadenie vlády ČR č. 80/2023 Sb. v EUR na hektár; vyplácajú sa v Kč (za rok 2025 kurzom 25,185 CZK/EUR).\n\nHlavné podopatrenia a sadzby v ČR za rok 2025 (Metodika AEKO 2025):\n- **Zatrávňovanie ornej pôdy** — bežnou zmesou 312 EUR/ha, druhovo bohatou zmesou 348 EUR/ha, dráhy sústredeného odtoku 482 EUR/ha; regionálna zmes 1 114 EUR/ha v prvom roku a 237 EUR/ha od druhého roka.\n- **Ošetrovanie extenzívnych trávnych porastov** — 91–691 EUR/ha podľa typu porastu (všeobecná starostlivosť o lúky a pasienky 91 EUR/ha, trvalo podmáčané a rašelinné lúky 691 EUR/ha).\n- **Pestovanie medziplodín** — 152–154 EUR/ha.\n- **Biopásy** — 597–676 EUR/ha.\n- **Ochrana cíbika chochlatého** — 630 EUR/ha.\n- **Druhovo bohaté pokrytie ornej pôdy** — 417 EUR/ha.\n- **Krajinotvorné sady** — 116 EUR/ha.\n- **Integrovaná produkcia** ovocia (460 EUR/ha), viniča (334 alebo 672 EUR/ha) a zeleniny, jahôd či zemiakov (462 EUR/ha).\n\nEkologické poľnohospodárstvo sa v ČR riadi vlastným nariadením vlády, nie je podopatrením AEKO. Pri súbehu s ekoplatbou a v 1. zóne CHKO alebo v národnom parku sa niektoré sadzby AEKO znižujú.\n\nPravidlá v ČR:\n- **Päťročný záväzok** — žiadosť o zaradenie sa podáva na Portáli farmára do 15. mája prvého roka.\n- **Podmienky** sa líšia podľa podopatrenia (termíny kosby, zákaz hnojív alebo prípravkov na ochranu rastlín, predpísané osevné zmesi); za porušenie sa platba kráti alebo sa neposkytne.\n\nNa Slovensku sa agroenvironmentálno-klimatické opatrenia riadia vlastnými podmienkami a sadzbami, ktoré zverejňuje PPA.",
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
      "DZES"
    ],
    "kategorie": "regulace",
    "shortDef": "GAEC (v ČR DZES — štandardy dobrého poľnohospodárskeho a environmentálneho stavu) sú povinné štandardy pre každého príjemcu priamych platieb a ďalších plošných podpôr. Spolu s povinnými požiadavkami na hospodárenie tvoria podmienenosť; porušenie vedie ku kráteniu platieb.",
    "longDef": "GAEC (Good Agricultural and Environmental Conditions, po slovensky štandardy dobrého poľnohospodárskeho a environmentálneho stavu, v ČR skratka DZES) sú súčasťou podmienenosti, ktorú musí dodržať každý príjemca priamych platieb a ďalších plošných podpôr — v ČR aj platieb AEKO, ANC a Natura 2000. Do roku 2022 sa systém nazýval krížové plnenie (cross-compliance).\n\nŠtandardy DZES v ČR (2025, nariadenie vlády ČR č. 73/2023 Sb.):\n- **DZES 1**: Zachovanie pomeru trvalých trávnych porastov k poľnohospodárskej ploche — celoštátne najviac o 5 % menej než v roku 2018; na environmentálne citlivých plochách zákaz zmeny TTP na inú kultúru.\n- **DZES 2**: Ochrana mokradí a rašelinísk (od 1. 1. 2025) — na pôde bohatej na uhlík zákaz zmeny TTP na inú kultúru, na ornej pôde okrem iného pokryv po zbere do 31. decembra.\n- **DZES 3**: Zákaz vypaľovania strnísk na ornej pôde.\n- **DZES 4**: Ochranné pásy pri vodách — aspoň 3 m bez hnojív a 3 m bez prípravkov na ochranu rastlín od brehovej čiary; na dieloch so sklonom nad 7° pás 25 m bez hnojív s rýchlo uvoľniteľným dusíkom.\n- **DZES 5**: Ochrana pred eróziou — na erózne ohrozených plochách obmedzenie plodín s nízkou ochrannou funkciou a povinné pôdoochranné technológie.\n- **DZES 6**: Minimálny pokryv pôdy — po zbere hlavnej plodiny aspoň do 31. októbra na 80 % štandardnej ornej pôdy (ozimina, medziplodina, strnisko, podmietnuté strnisko bez orby).\n- **DZES 7A**: Striedanie plodín — na aspoň 40 % ornej pôdy iná hlavná plodina než v predchádzajúcom roku a na celej výmere zmena aspoň raz za 4 roky.\n- **DZES 7B**: Obmedzenie plochy jednej plodiny na 30 ha (na silne erózne ohrozenej pôde na 10 ha).\n- **DZES 8**: Zachovanie krajinných prvkov a zákaz orezu drevín od 1. apríla do 31. októbra; povinný podiel neprodukčných plôch od roku 2024 v podmienenosti nie je (zostal v ekoplatbe).\n- **DZES 9**: Zákaz premeny a orby environmentálne citlivých TTP v lokalitách Natura 2000.\n\nKrátenie platieb za porušenie v ČR (2025): spravidla 3 %, pri menej závažnom porušení 1 %, pri závažnom 5 %; pri opakovanom porušení 10 % a pri úmyselnom 15–100 %. Žiadatelia s výmerou do 10 ha sú od roku 2024 z kontrol a sankcií podmienenosti vyňatí.\n\nKontroly prebiehajú na mieste u vybraných žiadateľov; od roku 2023 ich dopĺňa satelitný monitoring plôch (AMS).\n\nSlovenské znenie štandardov GAEC a sankcie sa od českých môžu líšiť.",
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
    "longDef": "Natura 2000 je sieť chránených území v EÚ, vytvorená podľa dvoch smerníc: o biotopoch (1992) a o vtákoch (1979). Cieľ: zachovať biodiverzitu kľúčových ekosystémov a druhov.\n\nDva typy lokalít v ČR:\n- **EVL** (Európsky významné lokality) — chránia biotopy rastlín a hmyzu, vodné toky, mokrade.\n- **PO** (Vtáčie oblasti) — hniezdiská a migračné cesty ohrozených druhov.\n\nCelkovo ~14 % rozlohy ČR. Hlavné lokality: Krkonoše, Šumava, Třeboňsko, Pálava, Beskydy, Krušné hory, Moravský kras.\n\nPre poľnohospodárov:\n- **Zákaz premeny a orby TTP** — environmentálne citlivé trvalé trávne porasty v lokalitách Natura 2000 nemožno premeniť ani zorať (v ČR štandard podmienenosti DZES 9).\n- **Ďalšie obmedzenia** (hnojenie, termíny kosby) vyplývajú z ochrany konkrétnej lokality a zo stanovísk orgánov ochrany prírody.\n\nPlatby v ČR:\n- **Platba Natura 2000 na poľnohospodárskej pôde** (nariadenie vlády ČR č. 62/2023 Sb.) — na trvalý trávny porast 95 EUR/ha v 1. zóne CHKO a 56 EUR/ha v národnom parku, vypláca sa v Kč.\n- **AEKO** — napríklad titul ochrana chrapkáča poľného; v 1. zóne CHKO a v národnom parku sa niektoré sadzby AEKO naopak znižujú.\n\nKonflikt: poľnohospodár vs Správa CHKO môže byť reálny — vždy si pred zakúpením/prenájmom pôdy v Natura 2000 skontrolujte LPIS a plán starostlivosti lokality (často kompletne mení hospodársky potenciál).",
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
      "organická zložka",
      "humus content"
    ],
    "kategorie": "agrotechnika",
    "shortDef": "Organická hmota (humus) je odumretá rastlinná a živočíšna hmota v pôde. Kľúčový ukazovateľ zdravia pôdy — udržuje vodu, živiny, štruktúru, biodiverzitu.",
    "longDef": "Organická hmota (OH) v pôde je suma rozkladu rastlinných zvyškov, koreňov, mikroorganizmov a živočíchov. Meria sa ako \"obsah humusu\" v % sušiny ornice.\n\nHodnoty v SR:\n- **SR orná pôda priemer**: 1,5–2,5 % OH (relatívne nízke, predtým aj 3–4 % pred intenzifikáciou).\n- **TTP / pastviny**: 4–8 % OH (vyššie vďaka stabilnej vegetácii).\n- **Lesná pôda**: 8–15 % OH.\n- **Černozem (južnoslovenská)**: 3–4 % OH — najlepšia SR orná pôda.\n\nFunkcie OH:\n- **Vodná kapacita** — 1 % OH = +15 l vody / m² zadržené v pôde.\n- **Živinová rezerva** — N, P, K sa uvoľňuje pri rozklade.\n- **Pôdna štruktúra** — drobtovitá štruktúra, jednoduché spracovanie.\n- **Mikrobiológia** — baktérie, huby, pôdna fauna.\n- **Sekvestrácia uhlíka** — 1 % zvýšenia OH v 30 cm orničnej vrstve = 30 t C / ha viazané v pôde.\n\nZvyšovanie OH:\n- **Medziplodiny zaorané do pôdy** — biomasa rozkladu sa mení na humus.\n- **Maštaľný hnoj** — 25–40 t/ha raz za 3–4 roky.\n- **Kompost** — pomaly uvoľňuje, dlhý efekt.\n- **Bezorebné technológie (no-till)** — menej narušuje štruktúru, OH sa akumuluje.\n- **TTP rotácia** — ak časť výmery rotuje na TTP, OH dramaticky stúpa.\n\nPokles OH:\n- **Intenzívna orba** — prevzdušňuje, urýchľuje rozklad → strata OH.\n- **Monokultúry** — neudržateľné dlhodobo.\n- **Erózia** — odplavená s najvrchnejšou ornicou.",
    "related": [
      "mezi-plodiny",
      "pH-pudy"
    ]
  },
  {
    "slug": "eroze-pudy",
    "term": "Erózia pôdy",
    "alias": [
      "vodná erózia",
      "veterná erózia",
      "strata ornice"
    ],
    "kategorie": "agrotechnika",
    "shortDef": "Erózia pôdy je proces, keď voda (dážď, povodeň) alebo vietor odnáša ornú pôdu z poľa. V ČR ohrozených cca 50 % ornej pôdy — hlavná príčina straty produktivity.",
    "longDef": "Erózia pôdy je prírodný proces, ktorý intenzívne poľnohospodárstvo dramaticky urýchľuje. Dva hlavné typy v ČR:\n\n**Vodná erózia** (dominantná):\n- Dážď uvoľní agregáty pôdy → splach steká po svahu → straty 2–50 t ornice/ha/rok.\n- Najviac ohrozené: svahovité polia nad 8°, dlhé pozemky, repka/cukrovka v širokých riadkoch.\n- Po extrémnych dažďoch (50+ mm/h) v jednom dni strata aj 100+ t/ha — viditeľné ryhy.\n\n**Veterná erózia**:\n- Suchšia južná Morava (Hodonínsko, Břeclav, Znojmo) — vetry odnášajú jemné častice.\n- Straty 1–10 t/ha/rok, menej dramatické ale konštantné.\n\nDôsledky:\n- **Strata najúrodnejšej vrstvy** (ornica 0–30 cm má najviac OH a živín).\n- **Zníženie výnosov** dlhodobo 5–25 %.\n- **Eutrofizácia vôd** — splavený fosfor → kvet rias v Brnianskej priehrade, Vranove atď.\n- **Zaplavenie obcí** — bahno z polí upcháva kanalizácie.\n\nOchrana proti vodnej erózii (na erózne ohrozených plochách ju v ČR vyžaduje štandard podmienenosti DZES 5):\n- **Protierózne pásy** — pásy plodín striedavo s TTP/medziplodinou naprieč svahom.\n- **Strip-till / no-till** — bez orby, korene držia pôdu.\n- **Kontúrová orba** — orba pozdĺž vrstevníc, nie po spádnici.\n- **Medziplodiny** cez zimu — chránia pôdu po zbere.\n- **Vegetatívne pásy** pozdĺž vodných tokov.\n\nPorušenie DZES 5 vedie ku kráteniu platieb podľa pravidiel podmienenosti — v ČR (2025) spravidla o 3 %, pri opakovaní o 10 %, pri úmyselnom porušení o 15–100 %.",
    "related": [
      "mezi-plodiny",
      "organicka-hmota",
      "gaec"
    ]
  },
  {
    "slug": "allwheel-drive",
    "term": "Pohon 4×4 / Pohon všetkých kolies",
    "alias": [
      "MFWD",
      "Mechanický pohon predných kolies",
      "4WD"
    ],
    "kategorie": "technologie",
    "shortDef": "Pohon 4×4 (MFWD) pridáva pohon na prednú nápravu — zvyšuje ťahovú silu, znižuje preklz, lepšie v rozbahnenom teréne. Štandard pri 95 % moderných traktorov.",
    "longDef": "Pohon 4×4 pri traktoroch (technicky **MFWD** = Mechanický pohon predných kolies) pridáva pohon na prednú riadenú nápravu. Štandard pri všetkých traktoroch s výkonom nad 50 koní od 90. rokov.\n\nKonštrukcia:\n- **Mechanický náhon** cez dlhý hriadeľ z prevodovky k prednému diferenciálu.\n- **Spojka** v náboji alebo v diferenciáli — vodič môže 4×4 vypnúť (pre cestnú jazdu šetrí palivo + zabraňuje \"vrteniu\" na rovných cestách).\n- **Rovnaké veľké kolesá** vpredu aj vzadu pri tzv. **izodiametrických** traktoroch (rovnako nazývané \"Trike\" — Fendt 1000, JD 9R) — zabezpečí dokonalú trakciu, ale je potrebné rezervovať pozemok pre veľký zatáčací polomer.\n\nRozdiely od osobného auta 4×4:\n- **Traktorová predná náprava** je výrazne vyššia a robustnejšia (kvôli veľkým kolesám).\n- **Predný diferenciál** typicky bez aktívneho obmedzenia (žiadny Torsen / haldex).\n- **Diferenciálna uzávierka** zadná + predná — vodič zapne pre maximálnu trakciu v blate.\n\nVýhody:\n- **+25–40 % ťahovej sily** vs len zadný pohon.\n- **Lepšia stúpavosť** — dôležité pre horské pastviny a lesné práce.\n- **Menej preklzu** — menej utuženia pôdy + úspora paliva pri ťažkom ťahu.\n\nNevýhody:\n- **Vyššia obstarávacia cena** o 100–300 tis. Kč vs 2×4 verzia (ktoré dnes takmer neexistujú).\n- **Viac súčiastok na servis** — kardany, diferenciál, dve sady kolies.\n- **Vyššia spotreba** na ceste (preto možnosť vypnutia).",
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
    "shortDef": "Dvojmontáž (duals) je sada dvoch kolies na každej náprave (celkom 4 zadné + 4 predné) — znižuje tlak na pôdu, zvyšuje plávajúcu schopnosť, používa sa pri flagship traktoroch.",
    "longDef": "Dvojmontáž (duals, dual wheels) znamená montáž dvoch kolies vedľa seba na každej náprave namiesto jedného. Pri traktoroch nad 250 koní takmer povinné pre poľné práce.\n\nPrincíp: dve kolesá = 2× väčšia kontaktná plocha → polovica meraného tlaku na pôdu. Pri hmotnosti traktora 12 t bez duals je tlak 1,5–2 bar/cm² (utužujúci), s duals klesá na 0,7–1 bar/cm² (akceptovateľné).\n\nPoužitie:\n- **Veľké traktory 250+ koní** — Fendt 900/1000, JD 8R/9R, NH T9, Case Steiger.\n- **Sady kolies** — duals len pre poľné práce, demontáž pre cestnú prepravu (širšie než 2,55 m → prekračuje EÚ normu pre verejné komunikácie).\n- **Trojnásobná montáž (triples)** pri superflagship traktoroch s výkonom 600+ koní (zriedkavé v Európe, bežné v USA).\n\nCena:\n- **Duals adaptéry + ráfky + pneumatiky** typicky 250 000–500 000 Kč pre 4× zadné.\n- **Triples** 1 000 000+ Kč.\n\nPozor: prevádzka s duals na ceste v EÚ = pokuta 5 000–20 000 Kč + ukončenie jazdy. Vždy montáž len tesne pred výjazdom na pole, demontáž po dokončení. Veľké farmy to riešia rýchlospojkami za 5–15 minút.",
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
    "longDef": "Klasická zberová mlátička má **valcový mlat** (klasický bubon s lopatkami) a **vytriasadlá** na separáciu slamy. Rotorový kombajn nahrádza oboje jedným **pozdĺžnym rotorom** (axial-flow), ktorým prechádza celý tok slamy.\n\nVýhody rotora:\n- **+15–25 % priepustnosť** pri zbere vs valcový mlat rovnakej veľkosti.\n- **Menej poškodenia zrna** — mäkšie mlátenie (dlhšia dráha, slabšie nárazy).\n- **Lepšia separácia** za vlhkých podmienok (po daždi, rannej rose).\n- **Jednoduchšia údržba** — menej súčiastok, menej klinových remeňov.\n\nNevýhody:\n- **Vyššia spotreba paliva** — rotor potrebuje viac energie.\n- **Horšie v dlhej slame** — ak chcete kvalitnú neporušenú slamu na balíky, tradičný mlat je lepší.\n- **Vyššia obstarávacia cena** o 10–20 % vs ekvivalentný valcový mlat.\n\nHlavné rotorové značky:\n- **Case IH Axial-Flow** — priekopník (od 1977), dnes dominantný v USA.\n- **John Deere S-Series** (od 2012) — single rotor.\n- **New Holland CR** — twin rotor (dva paralelné rotory).\n- **Fendt IDEAL** — dual helix rotor.\n- **Claas Lexion** — APS Hybrid (kombinácia valcového mlatu + akcelerácia + rotorová separácia) — kompromis.\n\nV ČR: rotor preferuje 40 % farmárov, valcový 60 % (kvôli slame a nižšej cene). Pre typickú farmu < 300 ha stačí klasický valcový.",
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
    "shortDef": "Trieda kombajnu (I–X+) je klasifikácia veľkosti a výkonu — vychádza z plochy mlátiaceho bubna a počtu vytriasadiel. Vyššia trieda = vyššia priepustnosť.",
    "longDef": "Trieda zberovej mláťačky je európska klasifikácia podľa priepustnosti a veľkosti mlátiaceho ústrojenstva. Vychádza hlavne z **plochy mlátiaceho bubna** a **počtu vytriasadiel** (pri klasických) alebo **veľkosti rotora** (pri rotorových).\n\nPribližný prehľad:\n- **Trieda III**: 100–120 kW (135–160 k), záber 4 m, zásobník 4 500 l.\n- **Trieda IV**: 120–155 kW (160–210 k), záber 4,5–5 m, zásobník 5 500 l.\n- **Trieda V**: 155–185 kW (210–250 k), záber 5–6 m, zásobník 6 500 l.\n- **Trieda VI**: 185–230 kW (250–310 k), záber 6–7,5 m, zásobník 7 500 l.\n- **Trieda VII**: 230–270 kW (310–365 k), záber 7,5–9 m, zásobník 9 000 l.\n- **Trieda VIII**: 270–330 kW (365–445 k), záber 9–10,5 m, zásobník 10 500 l.\n- **Trieda IX**: 330–400 kW (445–540 k), záber 10,5–12 m, zásobník 12 000 l.\n- **Trieda X / X+**: 400+ kW (540+ k), záber 12–18 m, zásobník 14 000+ l.\n\nPre CZ farmu:\n- **50–200 ha obilnín**: trieda IV–V (Claas Avero, JD T560, Case 5140).\n- **200–500 ha**: trieda VI–VII (Claas Tucano, JD T670, NH CX5/CX7).\n- **500–1500 ha**: trieda VIII–IX (Claas Lexion 7000/8000, JD S780, Fendt IDEAL 8).\n- **1500+ ha alebo zberný podnik**: trieda X (Claas Lexion 8900, JD X9, Fendt IDEAL 10T).\n\nVyššia trieda neznamená automaticky lepšie — je to otázka kapacity. Predimenzovaný kombajn = neefektívne využitie kapitálu.",
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
    "longDef": "Hederové žacie zariadenie (header) je modulárny predný nástavec zberovej mlátičky. Existujú **špecializované hedery pre rôzne plodiny**:\n\n**Obilniny / repka** (universal grain header):\n- Záber 4–18 m podľa triedy kombajnu.\n- Variabilná lišta (Vario) pre repku — predĺženie o 70–90 cm pre úzke rezanie drobnozrnných plodín.\n- Cena 0,8–4 mil. Kč nový, ojazdený 50 % ceny.\n\n**Kukurica** (corn header):\n- 4-6-8-12 riadkové verzie.\n- Hrubo upravený stôl s lapačmi, nie klasická lišta.\n- Cena 1,2–3,5 mil. Kč.\n\n**Pickup** (pre siláž z riadku, predzber):\n- Zbiera riadky z poľa, žiadne nové rezanie.\n- Špecifický pre trávne senáže.\n\n**Sunflower header** (slnečnica):\n- Snapping rolls — odrezáva hlavičku.\n- Zriedkavý v CZ, len pre špecialistov.\n\nPravidlá pre výber:\n- **Záber = 0,4× kombajn trieda** (Trieda V = 4,5–5 m header).\n- **Vyšší záber ≠ vyšší výkon** — ak kombajn nemá kapacitu na priepustnosť, väčší header len spomalí.\n- **Transport** — všetky hedery nad 7 m vyžadujú **rozkladací systém** alebo **vozík** pre cestnú prepravu (šírka nad 2,55 m je bez povolenia nelegálna).\n\nMnoho farmárov má dva hedery: **obilný + kukuričný** s rýchlospojkou (5–10 minút výmena).",
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
    "longDef": "Orba je najtradičnejší spôsob spracovania pôdy — pluh reže a obracia 20–35 cm hrubú vrstvu ornice. V ČR dominantná metóda od 19. storočia.\n\n**Typy pluhov**:\n- **Nesený pluh** — pripevnený trojbodom, ľahší (do 4 radlíc).\n- **Polonesený / ťahaný** — väčšie pluhy 5–12 radlíc, opora kolesa.\n- **Variopluh** — premenlivý záber radlíc počas jazdy.\n- **Otočný pluh (reverse)** — obráti radlice = orie oboma smermi, žiadne medzery v páse.\n\n**Hĺbka orby**:\n- **Plytká (15–20 cm)** — pre letné spracovanie po zbere.\n- **Stredná (20–28 cm)** — štandard pre jesennú orbu pod oziminy.\n- **Hlboká (28–35 cm)** — proti utuženiu podorničia, výnimočne 1× za 3–5 rokov.\n\n**Spotreba** pluhu (orientačne):\n- 3-radlicový pre 100 koňový traktor: 12–18 l nafty/ha.\n- 5-radlicový pre 200 koňový: 18–25 l nafty/ha.\n- 8-radlicový pre 350 koňový: 22–30 l nafty/ha.\n\n**Trendy proti orbe**:\n- **No-till** / bezorbové — žiadna orba, len sejačka priamo do strniska. Šetrí palivo (5–10 l/ha) ale vyžaduje vyššie dávky herbicídov.\n- **Min-till** (minimum tillage) — len plytké spracovanie (5–15 cm) namiesto orby. Kompromis.\n- **Strip-till** — orba len v riadkoch, medzery zostanú nedotknuté.\n\nV CZ aktuálne 60 % orby, 30 % min-till, 10 % no-till.",
    "related": [
      "mezi-plodiny",
      "eroze-pudy"
    ]
  },
  {
    "slug": "no-till",
    "term": "No-till / Bezorbové spracovanie",
    "alias": [
      "direct drilling",
      "priama sejba"
    ],
    "kategorie": "agrotechnika",
    "shortDef": "No-till (bezorbové spracovanie) vynecháva orbu — sejací stroj seje priamo do strniska. Šetrí palivo, chráni pôdu pred eróziou, ale vyžaduje vyššie dávky herbicídov.",
    "longDef": "No-till je metóda spracovania pôdy, ktorá **úplne vynecháva orbu** i iné hlboké narušenie pôdy. Sejba prebieha priamo do strniska predchádzajúcej plodiny pomocou **diskového sejacieho stroja** alebo **dlátového sejacieho stroja**.\n\nVýhody:\n- **Úspora paliva 50–80 %** vs konvenčná orba.\n- **Menej erózie** — povrch zostáva krytý, pôda neodplavovaná.\n- **Vyšší obsah organickej hmoty** — strnisko + korene sa rozkladajú v pôde.\n- **Lepšie zadržiavanie vody** — vyššia kapilarita.\n- **Menej práce** — 1 operácia namiesto 3–5 (orba + smyk + brány + sejba).\n\nNevýhody:\n- **Vyššie dávky herbicídov** — bez orby burinu nezničí, kompenzácia glyfosátom.\n- **Pomalejšie prehriatie pôdy na jar** — strnisko drží chlad.\n- **Riziko pôdnych chorôb** — patogénne zvyšky zo strniska.\n- **Nutnosť špecializovaného sejacieho stroja** — Horsch Avatar / Maestro, Väderstad Rapid, John Deere 750A. Cena 1,5–4 mil. Kč.\n\nV ČR:\n- Hlavne **Južná Morava + Vysočina** (suché oblasti) — no-till funguje najlepšie v aridných podmienkach.\n- **Severné Čechy + horské oblasti** — orba dominantná (chladnejšie, vlhkejšie podnebie).\n- **Dotácie a pravidlá**: bezorbová technológia patrí medzi pôdoochranné technológie, ktorými možno v ČR na erózne ohrozených plochách splniť štandard DZES 5 (2025). Samostatná platba za no-till medzi priamymi platbami ani podopatreniami AEKO v ČR za rok 2025 nie je.\n\nOdporúčame vyskúšať no-till na **časti poľa 2–3 sezóny** pred plnou konverziou — výnosy môžu v prvom roku klesnúť o 5–10 %, ale stabilizujú sa a dlhodobo (5+ rokov) výrazne rastú.",
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
    "longDef": "Pre-emergence (pre-em, \"pred vzídením\") je herbicídna stratégia aplikácie prípravkov **po siatí, ale pred vzídením plodiny aj buriny**. Cieli na klíčiace buriny v kritickej fáze rastu.\n\n**Hlavné účinné látky**:\n- **Pendimethalin** (Stomp) — pre obilniny, repku, slnečnicu.\n- **Prosulfocarb** (Defi) — proti psiarke v obilninách.\n- **Terbuthylazín, pethoxamid, dimethenamid-P** — pre kukuricu.\n\nMetribuzin a S-metolachlor, predtým bežné v pre-em, už v EÚ nie sú schválené (S-metolachlor od 2024, vykonávacie nariadenie (EÚ) 2024/20; metribuzin od 2024, vykonávacie nariadenie (EÚ) 2024/2806).\n\n**Načasovanie**:\n- **0–7 dní po siatí** — závisí od rýchlosti vzchádzania.\n- **Pôda musí byť vlhká** — sucho = pre-em nefunguje (látka neprenikne k semenám buriny).\n- **Bez dažďa do 2 dní** ideálne — dážď by mohol zmyť látku.\n\nDávkovanie typicky 2–4 l/ha. Cena 200–600 Kč/ha za pre-em ošetrenie.\n\n**Výhody**:\n- **Zničí 70–90 % buriny** skôr, než vyklíči.\n- **Znižuje nutnosť post-em (po vzídení) postreku** — menej chémie celkovo.\n- **Plodina vzíde do \"čistého\" poľa** — vyšší výnos.\n\n**Obmedzenia**:\n- **Selekcia odolných burín** — opakované pre-em vedie k rezistencii (najmä psiarka, hniezdovka, bôľ v obilninách).\n- **Citlivosť na sucho** — bez dažďa ošetrenie zlyhá.\n- **Niektoré plodiny zle znášajú** — repka je citlivá na pendimethalin.\n\nPre CZ farmárov: pre-em je štandard pri repke a obilninách. Pri jarinách (sója, kukurica) voľba medzi pre-em a post-em.",
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
    "longDef": "Osevný postup je systematické striedanie plodín na rovnakom pozemku v rôznych rokoch. Základ tradičného poľnohospodárstva — vedelo sa to už v stredoveku (\"trojpoľný systém\": ozim → jarina → úhor).\n\n**Typický CZ osevný postup** (štvorročný):\n1. **Repka** (ozim) — zlepšuje štruktúru, hlboký koreň.\n2. **Pšenica ozimná** — štandardná cash crop.\n3. **Cukrovka alebo zemiaky** — okopanina, narúša buriny.\n4. **Jarné obilie (jačmeň) alebo kukurica** — uzatvára cyklus.\n\nNiekedy pridané **5. miesto: lucerna / ďatelina** (3 roky bez výsevu, regeneruje pôdu, viaže dusík).\n\n**Princípy**:\n- **Nezaraďovať rovnakú plodinu po sebe** — riziko chorôb (napr. fuzariózy v pšenici).\n- **Striedať hlboký + plytký koreň** — repka (hlboko) + obilie (plytko).\n- **Zaradiť strukovinu** — sója, hrach, vika = fixujú dusík, šetria hnojivo.\n- **Okopanina (cukrovka, zemiaky)** = \"čistič\" — narúša cykly buriny.\n\n**Pravidlá v ČR (2025)**:\n- **DZES 7A**: na aspoň 40 % ornej pôdy iná hlavná plodina než v predchádzajúcom roku; na celej výmere zmena plodiny aspoň raz za 4 roky.\n- **DZES 7B**: plocha jednej plodiny najviac 30 ha (na silne erózne ohrozenej pôde 10 ha).\n- **Ekoplatba**: diverzifikácia — nad 10 ha ornej pôdy aspoň 2 plodiny, nad 30 ha aspoň 3, nad 150 ha aspoň 4; jedna plodina najviac na 75 % ornej pôdy.\n\n**Dôsledky porušenia**:\n- **Kratšia rotácia** (napr. pšenica → pšenica → kukurica → pšenica) = vyššie výnosy krátkodobo, ale za 5–10 rokov pokles výnosov o 15–25 % kvôli pôdnym chorobám.\n- **Monokultúra kukurice** (extrém v USA, sporadicky CZ): vyžaduje masívne hnojenie + insekticídy.\n\nDobrý osevný postup je **najlepšia poľnohospodárska praktika \"zadarmo\"** — bez chémie, len plánovaním plodín.",
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
    "shortDef": "Section Control je GPS-riadené automatické vypínanie sekcií postrekovača / kosačky / sejacieho stroja v súvratiach, prekrytí alebo v už ošetrených pásoch. Šetrí 5–15 % chémie/osiva.",
    "longDef": "Section Control (technicky **TC-SC** v ISOBUS — Task Controller Section Control) je systém automatického vypínania jednotlivých sekcií (častí) náradia podľa GPS pozície a predchádzajúcej stopy pokryvu.\n\n**Aplikácie**:\n- **Postrekovač** — 12–24 m rameno rozdelené na 6–24 sekcií, každá sa vypne samostatne. V súvratiach, na kline, na zužujúcom sa konci poľa.\n- **Sejací stroj** — vypínanie riadkov v súvratiach, kde už osivo padlo.\n- **Rozmetadlo hnojív** — variabilný výsek pásu hnojiva podľa pozície.\n\n**Princíp**:\n1. RTK GPS prijímač pozície ±2 cm.\n2. ISOBUS TC-SC zaznamenáva **as-applied map** — kde bolo aplikované.\n3. Pri ďalšom prejazde (súvrat, klin) systém vypne sekcie, ktoré by aplikovali do už pokrytého pásu.\n\n**Úspora**:\n- **Postrekovač**: 5–15 % chémie/sezónu (závisí od tvaru poľa — pravidelný štvorec 5 %, nepravidelné polia 15+ %).\n- **Hnojivo**: 5–10 %.\n- **Osivo**: 3–8 %.\n\n**ROI** (orientačne, pre farmu 200 ha):\n- Cena Section Control retrofit: 80 000–250 000 Kč.\n- Úspora chémie 2 500 Kč/ha × 0,1 (10 %) = 250 Kč/ha × 200 ha = 50 000 Kč/rok.\n- ROI: 1,5–5 rokov.\n\n**Aktuálne**:\n- Štandard pri veľkých moderných postrekovačoch (Amazone UX, Horsch Leeb, Dammann).\n- ISOBUS TC-SC licencia typicky 20–60 tisíc Kč na traktor.\n- Retrofit pri starých postrekovačoch 100–200 tis. Kč.",
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
    "longDef": "**Finančný leasing** = prenájom s povinnou opciou odkupu na konci (typicky za 1–5 % zvyškových nákladov). **Operatívny leasing** = prenájom bez opcie, na konci stroj vraciate. Vhodný pre krátke obdobie (3–5 rokov), bez starostí o predaj. **Bankový úver** = klasická pôžička, stroj je hneď váš, ručíte zástavou. | | Finančný leasing | Operatívny leasing | Bankový úver |\n|---|---|---|---|\n| **Vlastníctvo počas** | leasingovka | leasingovka | vy (zástava banke) |\n| **Vlastníctvo po splatení** | vy | leasingovka | vy |\n| **DPH** | rozložené po splátkach | len na splátky (vždy) | celé vopred |\n| **Akontácia** | 0–30 % | 0–30 % | 0–20 % |\n| **Sadzba (2026)** | 5,5–8 % p.a. | 6–9 % p.a. | 5–7 % p.a. |\n| **Doba** | 24–84 mesiacov | 24–60 mesiacov | 12–96 mesiacov |\n| **Flexibilita** | nízka (sankcie za predčasné ukončenie) | nízka | vyššia (refinancovanie) | **Pre českých farmárov**:\n- **Finančný leasing** je štandard pre 70 % nákupov — predvídateľnosť splátok, daňová optimalizácia.\n- **Úver** sa vyplatí pre **drahé stroje 5+ mil. Kč** s vysokou akontáciou — nižší celkový úrok.\n- **Operatívny leasing** je výnimočný — vhodný pre **podnikateľov v zberových službách**, kde stroj 5 rokov intenzívne využíva a potom vracia. **Captive financovanie značky** (John Deere Financial, AGROTEC FS, AGRI CS Finance):\n- Často akčné sadzby 4–6 % na nové stroje vlastnej značky.\n- Spojené s predajcom — výhodné kombinovať so zľavou na cene stroja.\n- Pre ojazdené stroje zvyčajne vyššie sadzby ako univerzálne banky. → [Kalkulačka leasingu traktora](/kalkulacka/leasing-traktoru/) pre orientačný výpočet mesačnej splátky.",
    "related": [
      "cap-2024"
    ]
  },
  {
    "slug": "rolnicke-pravidla-silnicni",
    "term": "Cestné pravidlá pre traktory",
    "alias": [
      "STK traktora",
      "značenie šírky",
      "doprava na poli"
    ],
    "kategorie": "regulace",
    "shortDef": "Traktor na verejnej ceste v ČR podlieha pravidlám: max. šírka 2,55 m bez povolenia, výška 4 m, povinné značenie náradia, STK 1× za 2 roky.",
    "longDef": "Prevádzka traktora na verejnej ceste v ČR je regulovaná predpismi o cestnej premávke a o prevádzke vozidiel.\n\n**Maximálne rozmery bez povolenia na zvláštne užívanie komunikácie**:\n- **Šírka**: 2,55 m (výnimky pre poľnohospodárske stroje 3 m, nad to nutné povolenie).\n- **Výška**: 4 m (kabína + výfuk + výrobou nainštalované doplnky).\n- **Dĺžka traktor + náves/náradie**: 12 m (samostatný traktor), 16,5 m s návesom.\n\n**Ak prekračujete** (širšie náradie, dvojmontáž, hlboké pluhy):\n- **Sprievodné vozidlo** s blikajúcimi výstražnými svetlami.\n- **Uzávierka cesty** povolená políciou, max 2 hodiny + plán obchádzky.\n- Pokuta za nesplnenie: 5 000–50 000 Kč.\n\n**Značenie náradia**:\n- **Tabuľky 423 × 423 mm** so žltými / červenými pásmi na okrajoch širokého náradia.\n- **Reflexné pásy** v noci alebo za zníženej viditeľnosti.\n- **Blikajúce žlté svetlo** povinné pre stroje širšie ako 2,55 m.\n\n**STK (Stanica technickej kontroly)**:\n- **Traktor so SPZ**: STK 1× za 2 roky.\n- **Bez SPZ** (len pole): bez STK, ale prevádzka na ceste zakázaná (aj 10 m medzi susednými poliami).\n- **Test**: brzdy, svetlá, ozvučenie (klaksón), výfukový systém, kabína, sedadlo.\n\n**Vodičský preukaz**:\n- **T (traktor)** — od 17 rokov, povinný pre prácu na poli aj prevoz.\n- **B (osobný)** — niektoré malé traktory do 50 km/h a do 7,5 t s B-čkom (kontroverzia, vyžaduje spresnenie v RP).\n\n**Poistenie**:\n- **Povinné zmluvné poistenie** — aj pre prácu na poli (cca 4 000–12 000 Kč/rok).\n- **Havarijné** — voliteľné, odporúčané pre nové stroje (3–5 % z ceny ročne).",
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
    "longDef": "Plodiny delíme podľa obdobia siatia:\n\n**Ozimy** (sú siate na jeseň, september–október):\n- **Pšenica ozimná** — dominantná obilnina v ČR, 60 % výmery obilnín.\n- **Jačmeň ozimný** — pre pivovary, vyšší výnos než jarný.\n- **Repka ozimná** — strategická olejovina, výnos 3,5–4,5 t/ha.\n- **Žito ozimné** — pre chlieb a krmivá, znáša slabšie pôdy.\n- **Tritikále** — kríženec pšenice + žita, robustný.\n\nVýhody ozimov:\n- Zimná vlhkosť = stabilnejšie výnosy.\n- Skorší zber (júl) = uvoľnenie plochy pre medziplodiny.\n- Vyšší celkový výnos vs jarné plodiny (o 15–30 %).\n\nRiziká:\n- **Vymrznutie** v tuhej zime bez snehovej pokrývky.\n- **Napadnutie slimákmi** v jesennej vlhkej sezóne.\n\n**Jarné plodiny** (sú siate na jar, marec–apríl):\n- **Jačmeň jarný** — pre pivovary kvalitnejší (sladovnícky).\n- **Pšenica jarná** — okrajová, len kde ozim vymrzol.\n- **Kukurica** — letné zrnové aj siláž.\n- **Sója, slnečnica** — letné olejoviny.\n- **Zemiaky, cukrovka** — okopaniny.\n- **Hrach, vika** — strukoviny.\n\nVýhody jarných plodín:\n- Krátky cyklus (3–4 mesiace).\n- Možnosť reagovať na trh (sejba podľa aktuálnych cien).\n- Menšie riziko zimného vymrznutia.\n\nRiziká:\n- **Sucho** v máji–júni = nízke výnosy.\n- **Vyššia koncentrácia prác** v krátkom období.\n\nPre českú farmu je štandardné **70 % ozimy + 30 % jarné plodiny**.",
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
    "term": "DAM 390 (Kvapalné hnojivo)",
    "alias": [
      "DAM",
      "UAN",
      "Urea Ammonium Nitrate solution"
    ],
    "kategorie": "hnojivo",
    "shortDef": "DAM 390 je kvapalné dusíkaté hnojivo s 30 % N (mix močoviny + liadku amónneho + vody). Aplikácia cez postrekovač — rýchle, rovnomerné, bez prachu.",
    "longDef": "DAM 390 (ang. UAN 32 — Urea Ammonium Nitrate solution) je najpoužívanejšie kvapalné dusíkaté hnojivo v EÚ. **30 % N v 1 litri = 390 g N/l** (preto \"DAM 390\"). Zloženie:\n- 50 % močovina (15 % N celkom)\n- 25 % liadok amónny (7,5 % N celkom)\n- 25 % voda (7,5 % N v amid + nitrát formách)\n\nAplikácia:\n- **Postrekovač s trubkovými tryskami** (nie klasické rozprašovače — DAM by spálil list).\n- **Hnojivová sada na postrekovači** — špeciálne 5–7 paprskové trysky vystrelia kvapalinu medzi riadky.\n- **Dávkovanie** 100–250 l/ha (= 39–98 kg N/ha).\n- **Časy aplikácie**: jarné vzchádzanie obilnín, druhá dávka na kvitnutie, prípadne listové hnojenie (5–15 l/ha v riedení).\n\nVýhody:\n- **Rovnomernosť** — žiadne rozpadlé granule, plynulý spray.\n- **Rýchlosť práce** — 80–150 ha/deň s postrekovačom 24 m.\n- **Možnosť kombinácie** s mikroprvkami, ochrannými prípravkami v tank-mix.\n- **Skladovanie** v IBC (1000 l) alebo cisternách (10+ t) — bez nutnosti uzavretého skladu.\n\nNevýhody:\n- **Sklon k popáleniu listu** pri horúčave nad 22 °C alebo priamom slnku.\n- **Korozívne pre vodárenské vybavenie** — samostatná cisterna a čerpadlo.\n\nCena (2024): cca 7 500–10 500 Kč/t (= 19–27 Kč/kg N — výrazne lacnejšie než pevné hnojivá za jednotku N).",
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
    "longDef": "Vápnenie je proces aplikácie vápenatých produktov do pôdy, ktorým sa cielene:\n1. **Upraví pH** smerom k optimu (5,5–7,0 pre väčšinu plodín).\n2. **Doplní vápnik** ako živina (Ca je makroživina, ktorú rastliny viažu v desiatkach kg/ha/rok).\n3. **Zlepší štruktúra** pôdy (Ca flokuluje íl, zvyšuje kapilaritu).\n\nHlavné produkty:\n- **Mletý vápenec (CaCO₃)** — najlacnejší, pomalý účinok (3–6 mesiacov), dávka 2–6 t/ha.\n- **Dolomitický vápenec (CaCO₃ + MgCO₃)** — pre pôdy chudé na Mg, dávka 2–6 t/ha.\n- **Pálené vápno (CaO)** — agresívny, rýchly účinok, dávka 0,8–2,5 t/ha. Nutná opatrnosť (popáli korene).\n- **Hasené vápno (Ca(OH)₂)** — pre extrémne kyslé pôdy, veľmi rýchly účinok.\n- **Cukrovarnické saturačné kaly** — odpad z výroby cukru, lacný zdroj Ca + organickej hmoty.\n\nCena (2024): 800–1 800 Kč/t vrátane dovozu (vápenec). Aplikácia rozmetadlom 200–400 Kč/ha. Celková investícia 4 000–12 000 Kč/ha pri bežnej dávke.\n\nKedy vápniť:\n- **Pôdny rozbor 1× za 4 roky** ukáže aktuálne pH a saturáciu Ca.\n- **pH pod 5,5** → vápniť cca 4 t/ha vápenca + opakovať po 2 rokoch.\n- **pH 5,5–6,0** → 2 t/ha ako prevencia každých 4–6 rokov.\n- **pH nad 6,5** → nevápniť (zbytočné, riziko alkality).\n\nROI: zvýšenie pH o 0,5 jednotky zvyčajne vedie k +5–15 % výnosu cereálií dlhodobo. Návratnosť 2–4 sezóny.",
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
      "orný pluh"
    ],
    "kategorie": "technologie",
    "shortDef": "Pluh je náradie na hlbokú orbu — obracia 20–35 cm vrstvu ornice. Existuje nesený, polonesený a otočný (reverz) typ s 2–12 radlicami.",
    "longDef": "Pluh je najstaršie orné náradie — obracia pôdu pomocou radlic. V ČR štandardné zariadenie na jesenné spracovanie poľa.\n\n**Typy podľa závesu**:\n- **Nesený pluh** — celý nesie trojbod traktora. Ľahší (do 4–5 radlic). Pre 80–150 koní traktor.\n- **Polonesený** (semi-mounted) — zadná časť pluhu sa opiera o vlastné kolesá. 5–8 radlic. Pre 130–200 koní.\n- **Ťahaný** (trailed) — celý pluh na vlastných kolesách, trojbod len ťahá. 8–12 radlic. Pre 200+ koní.\n\n**Typy podľa smeru orby**:\n- **Klasický (jednosmerný)** — orá len jedným smerom. Vyžaduje \"medzerovú orbu\" → nepravidelný povrch.\n- **Otočný pluh (reverz)** — radlice sa otáčajú o 180°, orá oboma smermi. Hladký povrch bez medzier. Dnes štandardom (95 % nových pluhov).\n- **Variopluh** — variabilný záber radlic za jazdy (40–60 cm na radlicu). Užitočné pri opravách ciest alebo úzkych záhonoch.\n\n**Kľúčové parametre**:\n- **Počet radlic** — 3 (ľahký), 4–5 (stredný), 6–8 (ťažký), 8–12 (extra ťažký).\n- **Záber na radlicu** — 35, 40, 45, 50 cm. Celkový záber = počet × na radlicu.\n- **Hĺbka orby** — 20–35 cm regulovaná hydraulicky alebo mechanicky.\n\n**Top značky v ČR**: Lemken (DE — Diamant, EurOpal), Pöttinger (AT — Servo), Kverneland (NO/IT — LB, ED, PB), Kuhn (FR — Vari-Master), Vogel & Noot (AT — Plus).\n\n**Cenová orientácia** (2026 nový):\n- 3-radlicový nesený otočný: 200 000–350 000 Kč.\n- 5-radlicový polonesený otočný: 600 000–1 100 000 Kč.\n- 8-radlicový ťahaný otočný + Vario: 1,8–3 mil. Kč.",
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
    "longDef": "Kompaktomat je polonesený stroj kombinujúci vo viacerých radoch: **diskové brány + drobiace lišty + zatláčacie valce** (smyk, kolesá). Cieľ: pripraviť ideálne sejbové lôžko v 1 jazde.\n\n**Typický záber**: 3–8 m, podľa traktora 100–250 koní.\n\n**Komponenty (spredu dozadu)**:\n1. **Diskové sekcie** (40–55 cm Ø) — narežú strnisko, predkypia 5–10 cm.\n2. **Šípy / dláta** (voliteľné) — rozrušenie utuženia.\n3. **Pružné kypriace lišty** — drobia hrudy.\n4. **Zatláčací valec** (Crosskill, U-profil, Cambridge) — utlačí povrch, vytvorí kapilárne prepojenie s podorničím.\n\n**Hlavné použitie**:\n- **Predsejbová príprava** — namiesto brán + smyku + valca v 3 samostatných jazdách.\n- **Stubble cultivation** — okamžite po zbere, podmietka strniska.\n- **Pseudoorba** — ako náhrada orby v min-till systémoch.\n\n**Výhody**:\n- 1 jazda namiesto 3–4 = úspora paliva 40–60 % vs konvenčná schéma.\n- Vyšší výkon — 4–8 ha/h vs 1–3 ha/h pri jednoduchých náradiach.\n- Lepšia štruktúra pôdy — menej utuženia od opakovaných prejazdov.\n\n**Top značky**:\n- **Horsch** (Tiger, Joker, Terrano) — DE prémium, no-till friendly.\n- **Lemken** (Karat, Heliodor) — DE univerzálny.\n- **Väderstad** (Carrier, TopDown, Cultus) — SE presnosť.\n- **Köckerling** (Quadro, Allrounder) — DE robustný.\n- **Kuhn** (Performer, Optimer) — FR cena/výkon.\n\n**Cena (2026)**: 4 m = 400 000–800 000 Kč, 6 m = 800 000–1,8 mil. Kč, 8 m = 1,5–3,5 mil. Kč.",
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
    "longDef": "Mulčovač drví rastlinnú hmotu na veľmi drobné kúsky pomocou rotujúcich kladívok alebo nožov na vertikálnom alebo horizontálnom rotore.\n\n**Dva hlavné typy**:\n- **Rotor horizontálny (os kolmo na jazdu)** — klasický pre plošné mulčovanie trávy a strniska. Najčastejší.\n- **Rotor vertikálny (os zvisle)** — pre práce na lesných rúbaniskách, hustejšiu vegetáciu.\n\n**Šírka záberu**:\n- **1,2–2 m** — pre sady, vinohrady, komunálne.\n- **2,5–4 m** — pre pole (strniská, kŕmne plodiny).\n- **4–8 m** — veľkofarmy, zberové podniky.\n\n**Použitie**:\n- **Mulčovanie strniska** po zbere obilia — zvyšné steblá podrcené, urýchľuje rozklad.\n- **Údržba TTP** — 1–2× ročne mulčovanie pasienkov.\n- **Mulčovanie medziplodín** pred zaoraním.\n- **Sady a vinohrady** — mulčovanie trávy v medziradoch.\n- **Likvidácia zvyškov kukuričných stoniek** — proti vijačke kukuričnej.\n\n**Pohon**: PTO 540 alebo 1000 ot/min. Príkon obvykle 50–150 koní podľa záberu.\n\n**Top značky**:\n- **Berti** (IT) — prémium, široká škála.\n- **Kuhn** (BPR, BC) — FR univerzál.\n- **Krone** (BiG M, EasyCut) — DE pre výkonné aplikácie.\n- **Maschio Gaspardo** (IT) — cenovo dostupné.\n\n**Cena (2026)**: 1,8 m hobby = 50 000–80 000 Kč, 2,5 m stredná = 120 000–250 000 Kč, 4 m profi = 300 000–600 000 Kč.",
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
    "longDef": "Sklápač je dominantná transportná jednotka v poľnohospodárstve. **Trojstranný** = môže sklápať dozadu aj na obe bočné strany (3-way tipper).\n\n**Nosnosť**:\n- **Ľahký 8 t** — pre malé farmy, traktor 80+ koní.\n- **Štandard 12–16 t** — pre stredné farmy, traktor 130+ koní.\n- **Veľký 18–24 t** — pre veľkofarmy, traktor 180+ koní. Tandem alebo tridem nápravy.\n- **Extra 28+ t** — zberové podniky, vlastný motorový pohon.\n\n**Konštrukcia**:\n- **Korba** oceľová alebo hliníková (ľahšia, 200 kg úspora hmotnosti).\n- **Nápravy** — single (do 12 t), tandem (12–20 t), tridem (20+ t).\n- **Brzdy** vzduchové štandard od 10 t (povinné v EÚ).\n- **Hydraulika** — sklápanie + bočnice + zadná klapka.\n\n**Sklápacie systémy**:\n- **Teleskopický hydraulický valec** — štandard, 2–4stupňový valec.\n- **Front-tipping** — sklápa iba dozadu, lacnejší.\n- **3-way tipping** — výnimočne aj na strany (užitočné pri vykládke do silážnych veží alebo v úzkych priestoroch).\n\n**Použitie**:\n- **Žatva** — odvoz obilia od kombajnu.\n- **Zber krmovín** — siláž z kukurice / tráv.\n- **Transport hnojív, vápenca** — od stanice na pole.\n- **Komunál** — odvoz výkopkov, drvenej sutiny.\n\n**Top značky**:\n- **Joskin** (BE) — Trans-Cap, KTP. Prémium.\n- **Strom** (CZ) — Vario, Master. Česká kvalita.\n- **Bednar** (CZ) — Atlas. Cenovo atraktívny.\n- **Conow** (DE) — TMH séria.\n- **Krampe** (DE) — Bandit, BIG body.\n\n**Cena (2026)**: 12 t single = 350 000–600 000 Kč, 18 t tandem = 700 000–1,5 mil. Kč, 24 t tridem = 1,5–3 mil. Kč.",
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
    "shortDef": "Silážna kukurica sa pestuje na celé rastliny (klasy + stonky + listy), zbiera sa nezrelá a fermentuje na siláž — hlavné krmivo pre dobytok v ČR.",
    "longDef": "Silážna kukurica je odrodový typ kukurice pestovaný pre **celorastlinný zber** (na rozdiel od zrnovej kukurice, ktorá sa zbiera len na klasy). Hlavné krmivo pre dobytok v ČR — v kŕmnej dávke dojníc tvorí 30–60 % objemu.\n\n**Pestovanie**:\n- **Sezóna**: koniec apríla – polovica mája (po Ľadových mužoch, pôda 10 °C).\n- **Osivo**: 80 000–110 000 zŕn/ha = 22–28 kg/ha.\n- **Hnojenie**: 150–200 kg N/ha, plus P, K základné hnojenie na jeseň.\n- **Postrek**: pre-em na klíčiace buriny (napr. pethoxamid, terbuthylazín) + post-em na druhú vlnu (Callisto, Laudis).\n- **Zber**: koniec augusta – október, vlhkosť celej rastliny 30–35 % (optimum pre silážovanie).\n\n**Výnosy**:\n- **Zelená hmota**: 30–60 t/ha (priemer ČR 45 t/ha).\n- **Sušina**: 10–18 t/ha (silážna).\n- **Energia**: 5–8 GJ/ha NEL (čistá energia laktácie).\n\n**Zber**:\n- **Zberová rezačka** (Claas Jaguar, JD 9000, NH FR) — reže, drtí zrno (cracking), fúka do návesu.\n- **Dĺžka rezanky**: 8–22 mm podľa obsahu sušiny a typu silážnej jamy.\n- **Cena zberovej služby**: 2 000–4 000 Kč/ha + návesy 800–1 200 Kč/h.\n\n**Silážovanie**:\n- **Silážna jama** sa naplní + utlačuje pásovým traktorom.\n- **Zakrytie** plastovou fóliou + zaťaženie (pneumatiky / vrecia piesku).\n- **Fermentácia** 4–6 týždňov → ideálne krmivo.\n\n**Top regióny v ČR**: južná Morava, Polabská nížina, dolné Posázaví. V severných horských oblastiach je sezóna kratšia a výnosy nižšie.",
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
    "longDef": "Repka ozimná (Brassica napus) je najvýznamnejšia olejnina v ČR. Pestuje sa na **380–420 tis. ha** = 12 % ornej pôdy (po pšenici druhá najrozšírenejšia plodina).\n\n**Pestovanie**:\n- **Sejba**: 15. augusta – 5. septembra (presne, kratšie okno → menší výnos).\n- **Osivo**: 2–4 kg/ha (hybridy) alebo 5–8 kg/ha (línie). 35–50 zŕn/m².\n- **Hnojenie**: P + K na jeseň (200 kg superfosfátu, 150 kg draselnej soli). Jar 150–200 kg N v 2 dávkach (regenerácia + butonizácia).\n- **Postrek**: insekticídy proti skočkám (jeseň), choroby (jarné fungicídy proti hlizenke, fómovej hnilobe), regulátory rastu.\n- **Zber**: koniec júna – polovica júla. Kombajn s repkovým žacím stolom (Vario lišta).\n\n**Výnosy** (priemer ČR 2024):\n- **3,5 t/ha** bežné priemerné podmienky.\n- **4,0–4,5 t/ha** dobré roky + premium hybrid.\n- **5+ t/ha** špička (vrcholoví farmári).\n\n**Ceny** (2024–2026):\n- **Realizačná cena** 11 000–14 000 Kč/t.\n- **Tržba**: 4 t × 12 500 = 50 000 Kč/ha.\n- **Náklady**: ~25 000 Kč/ha (osivo 4 000 + hnojivá 8 000 + postreky 6 000 + mech. 7 000).\n- **Marža**: 20 000–30 000 Kč/ha = veľmi atraktívna vs obilniny.\n\n**Viazaná podpora príjmu (CIS)**: na repku v ČR nie je (2025).\n\n**Trh**:\n- **Vykupujú**: Komodita Praha, Granaria, Glencore, Agrofert.\n- **Použitie**: 70 % biopalivá (FAME), 20 % potravinársky olej, 10 % krmivá (repkové šroty).\n- **Konkurencia**: dovoz slnečnicového oleja (UA, RU), palmový olej (Indonézia).\n\n**Riziko**: hubenie populácií včiel kvôli neonikotinoidom (od 2018 EÚ zákaz aplikácie na repku). Súčasné insekticídy majú nižšiu účinnosť → vyššie riziko poškodenia skočkami.",
    "related": [
      "osevni-postup",
      "ozim-jarin",
      "orba"
    ]
  },
  {
    "slug": "sojaova-bob",
    "term": "Sója fazuľová",
    "alias": [
      "sója",
      "soja",
      "soybean"
    ],
    "kategorie": "plodiny",
    "shortDef": "Sója je najvýznamnejšia strukovina sveta, v ČR menšinová plodina (15–25 tisíc ha) ale rastúca. Bohatá na bielkoviny (40 %), viaže atmosférický N.",
    "longDef": "Sója fazuľová (Glycine max) je najvýznamnejšia olejnatá strukovina na svete. V ČR rastúca plodina (z 5 000 ha v 2010 na ~20 000 ha v 2024), podporovaná okrem iného viazanou podporou príjmu pre bielkovinové plodiny (CIS, 2025: 1 449,39 Kč/ha).\n\n**Pestovanie**:\n- **Sezóna**: koniec apríla – začiatok mája, pôda min. 8 °C.\n- **Osivo**: 110–130 kg/ha. Hladké semienko, vyžaduje presnú sejbu pneumatickou sejačkou.\n- **Inokulácia**: nevyhnutná! Sójové semená ošetriť baktériami Rhizobium japonicum na viazanie N. Bez inokulácie = sója si nedokáže vyrobiť N a výnos klesne o 30–50 %.\n- **Hnojenie**: len P + K (sója si vyrobí N sama). Žiadne dusíkaté hnojivo!\n- **Postrek**: pre-em (Pulsar), post-em (Pulsar Plus). Insekticídy len výnimočne.\n- **Zber**: koniec septembra – polovica októbra. Štandardný kombajn s repkovým / sójovým flexihederom.\n\n**Výnosy** (priemer ČR 2024):\n- **2,5–3,2 t/ha** bežné.\n- **3,5+ t/ha** dobré roky + zavlažovanie.\n\n**Vlastnosti zrna**:\n- **40 % bielkoviny** (vs pšenica 12 %) — najbohatší rastlinný zdroj.\n- **20 % oleja** — sójový olej pre potraviny aj biopalivá.\n- **Cena** (2024): 12 000–16 000 Kč/t.\n\n**Ekonomika** (3 t/ha × 14 000 = 42 000 Kč tržba + 1 449 Kč CIS v ČR za rok 2025):\n- Tržba ~43 450 Kč/ha.\n- Náklady ~22 000 Kč/ha (osivo + inokulácia + hnojivá + postreky + mech).\n- **Marža ~21 000 Kč/ha** = porovnateľné s repkou, ale nižšie riziko.\n\n**Prečo v ČR rastú plochy**:\n- **EÚ snaha o nezávislosť od dovozu sóje** z Brazílie/Argentíny (kde sa odlesňuje pre pestovanie).\n- **CIS pre bielkovinové plodiny** (ČR, 2025: 1 449,39 Kč/ha).\n- **Viazanie N** zlepšuje štruktúru pôdy pre následnú plodinu.\n- **Trhová cena** rastúca kvôli krmnému priemyslu (sójový šrot pre prasatá, hydinu).\n\n**Riziká**:\n- **Sucho v auguste** (kvetenie) = výrazný pokles výnosu.\n- **Choroby** Sclerotinia (hlizenka) — limit pre región.\n- **Holuby** radi vyzobávajú na poli (riziko 5–10 % straty).",
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
    "longDef": "Lucerna siata (Medicago sativa) je najlepšia krmovinová strukovina v miernom podnebí. **Viacročná** plodina — pestuje sa 3–5 rokov, zbiera sa 3–4× za sezónu (3 v CZ, 4 v južnom Taliansku).\n\n**Pestovanie**:\n- **Sejba**: jar (marec–apríl) ako \"podsev\" pod obilniny (raž, jačmeň) alebo čistý porast.\n- **Osivo**: 15–25 kg/ha. Inokulácia Sinorhizobium meliloti nutná.\n- **Hnojenie**: len P + K na jeseň (200 kg superfosfátu, 100 kg KCl). Žiadny N (vlastná fixácia 200–300 kg N/ha/rok).\n- **Žiadny postrek** na samotnú lucernu (silne konkurenčné buriny potlačí).\n\n**Zber** (3× za sezónu v CZ):\n- **1. kosba**: polovica mája (50 % kvetu — najvyšší obsah bielkovín).\n- **2. kosba**: koniec júna.\n- **3. kosba**: koniec augusta.\n- Prípadne **4. kosba** v septembri (nízky výnos, len pre silný porast).\n\n**Výnos** (3-ročný priemer):\n- **8–12 t sušiny/ha/rok** celkom (rozdelené do 3–4 kosieb).\n- **Cca 25 % bielkovín** v sušine.\n\n**Použitie**:\n- **Senáž / siláž** pre dobytok — balíky lucerny.\n- **Seno** klasické (prírodné sušenie).\n- **Zelená krmovina** pre pastvy alebo priamu aplikáciu do žľabu.\n- **Granulát** pre priemyselné krmivá (sušiarenský granulát).\n\n**Prínos do osevného postupu**:\n- **Viazanie N** 200–300 kg/ha/rok — zásadný bonus pre následnú plodinu.\n- **Hlboký koreň** (až 3 m) — narušuje utuženie podorničia, dostáva živiny z hĺbky.\n- **Zlepšuje štruktúru pôdy** — lucerna za 3 roky obnoví humus.\n- **Po lucerne** sa typicky pestuje ozimná pšenica (vysoký výnos vďaka N + štruktúre).\n\n**Trh**:\n- **Cena senáže v balíkoch**: 1 800–3 000 Kč/t (regionálne).\n- **Cena granulátu**: 4 000–6 000 Kč/t.\n- **Dotácie v ČR (2025)**: lucerna patrí medzi bielkovinové plodiny s viazanou podporou príjmu (CIS, 1 449,39 Kč/ha) a v ekoplatbe sa môže ako plodina viažuca dusík započítať do neprodukčných plôch variantu B.\n\n**Dôležité odrody**: Verdor (FR), Power (US), Niagara (FR), česká Kometa (CZ).",
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
    "shortDef": "Telematika je systém vzdialeného sledovania stroja cez mobilnú sieť — sleduje pozíciu, motohodiny, spotrebu, chyby. Štandard pri prémiových traktoroch od 2010.",
    "longDef": "Telematika v poľnohospodárstve je obdoba GPS trackera v osobných autách, ale rozšírená o **technické dáta stroja** (CAN-bus). Stroj odosiela dáta do cloudovej platformy cez mobilnú sieť (LTE), kde majiteľ / dealer vidí real-time stav.\n\n**Hlavné platformy** (per značka):\n- **John Deere Operations Center** (Ops Center) + JDLink — najrozsiahlejšie. Sleduje 100+ parametrov, agronomické mapy, prediktívnu údržbu.\n- **Case IH AFS Connect** + Trimble Display — spoločná s NH.\n- **New Holland PLM Connect** — zberné mapy, GPS prefix.\n- **Fendt Connect** + FendtONE — bezdrôtové aktualizácie, telemetria.\n- **Claas TELEMATICS** — zberné analytiky.\n- **AGCO Fuse** (Massey, Valtra, Fendt) — zjednotená platforma.\n- **Trimble Connected Farm** — multi-brand pre staršie stroje.\n\n**Čo sleduje**:\n- **GPS pozícia** v real-time, história trás.\n- **Motohodiny** + uptime / downtime.\n- **Spotreba paliva** per hektár / per hodinu.\n- **Otáčky motora, prevodovka, výkon, záťaž**.\n- **Chybové kódy** — okamžitá notifikácia SMS / email.\n- **Zberné mapy** (kombajny) — výnos per GPS bod.\n- **AdBlue, DPF stav** — varovanie pred regeneráciou / doplnením.\n- **Vstup do \"geofence\"** — alarm pri výjazde z farmy / krádeži.\n\n**Cenová politika** (2026):\n- **JD Operations Center**: zadarmo pre majiteľov JD stroja (3-ročná subskripcia pri nákupe).\n- **Fendt Connect**: zadarmo 5 rokov, potom 800–1 500 Kč/rok.\n- **AGCO Fuse**: variabilné podľa balíčka.\n- **Trimble Connected Farm**: 5 000–15 000 Kč/rok per stroj.\n\n**Pre SK farmárov**:\n- **Na malých farmách** často nevyužité — paperwork v Exceli funguje.\n- **Na farmách 200+ ha** s 3+ strojmi už dáva zmysel — správa flotily, prediktívna údržba.\n- **Zberné podniky** štandardne využívajú pre per-zákazník účtovanie motohodín a zberaných ha.\n\n**Súkromie / vlastníctvo dát**: kontroverzia — kto vlastní agronomické dáta? V EÚ GDPR rieši PII, ale k produkčným dátam má zmluvne prístup výrobca (využíva pre vývoj). Niektorí farmári tlačia na \"Farm Data Privacy\" iniciatívy.",
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
    "longDef": "Autonomný traktor je ďalšia úroveň presného poľnohospodárstva — stroj jazdí po poli **úplne bez vodiča v kabíne**. Kombinácia technológií:\n\n- **RTK GPS** (centimetrová presnosť trasy).\n- **LiDAR** (3D mapovanie okolia, detekcia prekážok).\n- **Multispektrálne kamery** (rozpoznávanie plodiny vs buriny).\n- **AI** (rozhodovanie v reálnom čase).\n- **5G konektivita** (vzdialené ovládanie + dohľad).\n\n**Súčasné komerčné ukážky**:\n- **John Deere 8R Autonomous** (CES 2022): plne autonómny traktor s 6 kamerami a NVIDIA Jetson AI. K dispozícii 2023+ na vybraných trhoch v USA. Cena ~$800 000 ($300K príplatok nad štandardný 8R).\n- **Case IH Autonomous Concept** (2016): koncept bez kabíny vôbec. Do komerčnej výroby sa nedostal.\n- **AGCO Fendt MARS** (2019): roj malých autonómnych robotov namiesto jedného veľkého. Stále výskum.\n- **Bear Flag Robotics** (Trimble dcérska spoločnosť, 2021 akvizícia JD): retrofit autonómneho systému na existujúce traktory.\n- **Monarch Tractor** (US startup, 2020+): autonómny elektrický traktor 70 koní pre vinohrady. Cena $58 000.\n\n**Stav v ČR (2026)**:\n- **Žiadny autonómny traktor reálne v prevádzke**.\n- **Čiastkové autonómne funkcie** (auto-steering, section control, automatické headland turning) sú štandardom pri prémiových traktoroch.\n- **Regulácia** pre autonómne stroje na poli zatiaľ nie je (na ceste by bol problém s vodičským preukazom).\n\n**Bariéry komerčného nasadenia**:\n- **Cena** — premium $300 000 nad bežný traktor je pre 99 % farmárov nedosiahnuteľná.\n- **Bezpečnosť** — polia nie sú izolovaný kontrolovaný priestor ako továreň. Riziko zrazenia človeka / zvieraťa.\n- **Regulácia** — EÚ doteraz nedefinovala jasné pravidlá pre autonómne poľné stroje.\n- **ROI** — vodič stojí 30 000–50 000 Kč/mesiac, autonómny stroj sa vyplatí len pri veľkofarme s 24/7 prevádzkou.\n\n**Realistická časová os**:\n- **2025–2030**: autonómia pre úzke úlohy (postrek, kosenie) pre veľkofarmu.\n- **2030+**: rozšírenie pre SK stredné farmy, cenová dostupnosť.\n- **2035+**: štandard.\n\n**Aktuálne odporúčame** pre SK farmárov využiť **semi-autonómne funkcie** (auto-steering, ISOBUS, telematika) — 80 % benefitu za 20 % ceny.",
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
    "shortDef": "Drony v poľnohospodárstve slúžia na: monitoring (multispektrálne NDVI snímky), aplikáciu (postrek, výsev medziplodín), kontrolu (krádeže, povodne). Štandard pre precíznych farmárov.",
    "longDef": "Drony (UAV — Unmanned Aerial Vehicles) v poľnohospodárstve plnia 3 hlavné úlohy:\n\n### 1. Monitoring (najčastejšie)\n- **Multispektrálne snímkovanie** — RGB + NIR kamera, výpočet NDVI / EVI indexov biomasy.\n- **3D mapovanie** — výška rastlín, deformácie polí.\n- **Letové výšky** 50–120 m, pokrytie 50–200 ha za hodinu.\n- **Modely dronov**: DJI Phantom 4 Multispectral (6 000 USD), DJI Mavic 3 Multispectral (5 500 USD), Parrot Anafi USA (7 000 USD), eBee X (25 000+ profesionál).\n\n### 2. Aplikácia (postrek / výsev) — rastúca\n- **Postrekovacie drony** — Yamaha RMAX (JP), DJI Agras T40/T50, EAVision EA-30X.\n- **Užitočné zaťaženie**: 30–40 l postreku, záber 8–11 m.\n- **Výkon**: 4–10 ha/h.\n- **Cena**: 15 000–50 000 USD dron + 5 000–15 000 USD batérie + softvér.\n- **V ČR**: zatiaľ **málo nasadené** — regulácia SUR (Sustainable Use Regulation EU) komplikuje letecké postrekovanie (potreba špeciálneho povolenia).\n\n### 3. Kontrola a bezpečnosť\n- **Patrolovacie drony** — kontrola plotov, krádeží.\n- **Tepelné kamery** — detekcia zvierat pred kosením (chráni srnčatá).\n- **Povodňové mapovanie** — DJI Mavic s termálnou kamerou.\n\n### Regulácia v ČR (EASA + ÚCL):\n- **Otvorená kategória** (A1/A2/A3) pre drony pod 25 kg za vizuálny dohľad.\n- **Špecifická kategória** pre letecké aplikácie postreku — vyžaduje OSO (Operations Specific Operations) povolenie od Úradu civilného letectva.\n- **Pilotný certifikát** A1/A3 zdarma online, A2 za 800 Kč.\n- **Registrácia operátora** povinná (€19/rok).\n\n### Pre slovenských farmárov (2026):\n- **Monitoring** — DJI Mavic 3 Multispectral je sweet spot pre 100–500 ha farmy. ROI 1–2 sezóny vďaka úspore hnojív (variabilné dávkovanie).\n- **Aplikácia** — zatiaľ **drahé a regulačne náročné**. Klasický postrekovač s GPS + Section Control vychádza lepšie.\n- **Tepelné kamery** — pre veľké TTP s vysokou pravdepodobnosťou srnčiat, ekonomicky náročné.",
    "related": [
      "ndvi",
      "variable-rate",
      "section-control"
    ]
  },
  {
    "slug": "sp-szp-2023-2027",
    "term": "SP SPP 2023–2027 (Strategický plán)",
    "alias": [
      "Strategický plán SPP",
      "Common Agricultural Policy Strategic Plan"
    ],
    "kategorie": "dotace",
    "shortDef": "Strategický plán SPP 2023–2027 je národná implementácia Spoločnej poľnohospodárskej politiky EÚ na Slovensku. Zahŕňa priame platby, sektorové intervencie a rozvoj vidieka (agroenvironmentálno-klimatické opatrenia, ANC, investície); administruje ho Pôdohospodárska platobná agentúra (PPA).",
    "longDef": "Strategický plán Spoločnej poľnohospodárskej politiky (SP SPP) je dokument, ktorý každý členský štát predkladá Európskej komisii na obdobie 2023–2027. Pre Slovensko ho pripravilo Ministerstvo pôdohospodárstva a rozvoja vidieka SR a administruje ho Pôdohospodárska platobná agentúra (PPA).\n\n**Priame platby (I. pilier)**:\n- **Základná podpora príjmu (BISS)** na hektár\n- **Redistributívna platba (CRISS)** zvýhodňujúca prvé hektáre podniku\n- **Ekoschémy** — dobrovoľné režimy pre klímu a životné prostredie\n- **Podpora pre mladých poľnohospodárov**\n- **Viazaná podpora príjmu (CIS, predtým VCS)** pre vybrané sektory\n\n**Rozvoj vidieka (II. pilier)**:\n- **Agroenvironmentálno-klimatické opatrenia** (viacročné záväzky)\n- **ANC** — platby pre oblasti s prírodnými obmedzeniami\n- **Ekologické poľnohospodárstvo**\n- **Investičné intervencie** (technika, stavby, technológie)\n\n‼️ **Sadzby na hektár sa medzi členskými štátmi líšia** a vyhlasujú sa pre každý rok zvlášť — na Slovensku v eurách. Aktuálne sadzby, stropy a termíny zverejňuje PPA; české sadzby prevzaté z materiálov SZIF na Slovensku neplatia.\n\n**Dokumentácia pre žiadateľov**:\n- **Hlavný dokument**: Strategický plán SPP SR na stránkach MPRV SR (mpsr.sk)\n- **Príručky a výzvy**: PPA (apa.sk) — pre každý titul zvlášť, verzia sa mení\n- **Portál farmára** — elektronické podanie žiadostí\n\n**Priebeh roka**:\n- **Jednotná žiadosť** (jarný termín) pokrýva väčšinu priamych platieb\n- **Investičné výzvy** majú vlastné kolá vyhlasované PPA\n- **Viacročné záväzky** sa uzatvárajú na niekoľko rokov — vstup je dlhodobé rozhodnutie\n\n**Kontroly**: PPA overuje žiadosti administratívne, kontrolou na mieste a plošným satelitným monitoringom plôch (systém AMS nad dátami Copernicus/Sentinel).",
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
    "longDef": "Investičné intervencie sú hlavným nástrojom Strategického plánu SPP na modernizáciu poľnohospodárskych podnikov. Na Slovensku ich PPA vyhlasuje vo výzvach; podmienky, oprávnené výdavky a bodovanie určuje konkrétna výzva.\n\n**Oprávnené výdavky** typicky zahŕňajú:\n- **Stroje a technika** — traktory, kombajny, sejačky, postrekovače, lisy, manipulátory.\n- **Stavby pre živočíšnu výrobu** — maštale, dojárne.\n- **Stavby pre skladovanie** — silá, šrotovne, chladiarne.\n- **Technológie precízneho poľnohospodárstva** — GPS, ISOBUS, variabilné dávkovanie.\n- **Závlahy** — investície do zavlažovacích systémov.\n\n**Miera podpory**, prípadné navýšenia, stropy na projekt aj na žiadateľa a prípadné obmedzenie podielu mobilných strojov určujú **podmienky konkrétnej výzvy PPA** — nie sú to trvalé hodnoty a medzi kolami sa menia.\n\n**Postup žiadosti**:\n1. **Príprava projektu** — návrh, podnikateľský plán, ekonomické vyhodnotenie.\n2. **Vyhlásenie výzvy** — PPA zverejní podmienky a termín príjmu.\n3. **Podanie** v stanovenom termíne.\n4. **Hodnotenie** — administratívna kontrola a bodovanie projektu.\n5. **Rozhodnutie** o schválení.\n6. **Realizácia** — nákup techniky alebo stavba podľa projektu.\n7. **Žiadosť o platbu** — preplatenie po preukázaní investície.\n\n**Praktické upozornenia**:\n- **Časovanie**: výdavky plánujte podľa podmienok danej výzvy — výdavok vzniknutý mimo stanoveného obdobia býva neoprávnený.\n- **Dokumentácia**: faktúry, zmluvy, doklady o úhrade, fotodokumentácia priebehu.\n- **Riziko**: nesplnenie podmienok (napríklad doby udržateľnosti projektu) môže viesť k vráteniu podpory.\n\n‼️ Označenie **33.73** je kód českej intervencie Investície do poľnohospodárskych podnikov v Strategickom pláne ČR, ktorý administruje SZIF. Na Slovensku majú výzvy vlastné číslovanie a vlastné podmienky — pri čítaní českých zdrojov je nutné s týmto rozdielom počítať.",
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
    "longDef": "Agrárna komora ČR (AK ČR) je najväčšia záujmová organizácia poľnohospodárov, potravinárov, lesníkov a vinárov v ČR. Založená 1993 zákonom č. 301/1992 Sb.\n\n**Členská základňa**: cca **5 000 fyzických a právnických osôb** naprieč odbormi.\n\n**Hlavné úlohy**:\n- **Lobbying** u Ministerstva poľnohospodárstva, vlády a europoslancov — záujmy CZ poľnohospodárstva v EÚ CAP, výnimky pre CZ špecifiká.\n- **Pripomienkové miesto** v legislatívnom procese — všetky zákony týkajúce sa poľnohospodárstva prechádzajú AK ČR.\n- **Zastupovanie** v COPA-COGECA (európska poľnohospodárska lobby v Bruseli).\n- **Poradenstvo** členom — daňové, dotačné, právne.\n- **Vzdelávanie** — semináre, kongresy, výstavy (Země živitelka v ČB).\n- **Certifikácia** — Klasa, Český výrobok, regionálne značky.\n\n**Štruktúra**:\n- **Prezídium** — výkonný orgán, 5-ročný mandát.\n- **Snem** — najvyšší orgán, 1× ročne.\n- **8 sekcií** podľa odboru: rastlinná výroba, živočíšna, lesníctvo, vinárstvo, ovocinárstvo, zeleninárstvo, mliekarenstvo, mäsový priemysel.\n- **14 regionálnych komôr** (per kraj).\n\n**Členský príspevok** (2024):\n- **Fyzická osoba**: 1 200–3 600 Kč/rok podľa veľkosti farmy.\n- **Právnická osoba**: 5 000–50 000 Kč/rok podľa obratu.\n- **Bonus**: členovia dostávajú časopis Zemědělec, právny helpdesk, dotačné poradenstvo.\n\n**Kontroverzie**:\n- **Politická angažovanosť** — historicky úzke väzby na ČSSD, dnes neutrálnejšia.\n- **Konflikt záujmov veľkých vs malých fariem** — AK ČR často kritizovaná za presadzovanie záujmov veľkých agro-holdingov (Agrofert a i.) na úkor rodinných fariem.\n- **Konkurencia**: Asociácia súkromného poľnohospodárstva (ASZ) — alternatíva pre malé farmy.\n\n**Pre CZ farmárov**: členstvo dáva zmysel pre farmy s 100+ ha (využijú dotačné poradenstvo a lobbying). Pre hobby farmy do 10 ha často prínos minimálny.\n\n**Web**: https://www.akcr.cz",
    "related": [
      "sp-szp-2023-2027",
      "cap-2024"
    ]
  },
  {
    "slug": "siloky-balik",
    "term": "Silážny balík",
    "alias": [
      "silážne balíky",
      "baled silage",
      "wrapping"
    ],
    "kategorie": "agrotechnika",
    "shortDef": "Silážny balík je oválny balík zelenej píce (lucerna, ďatelina, trávy) zabalený v plastovej fólii pre fermentáciu. Alternatíva k veľkej silážnej jame pre menšie farmy.",
    "longDef": "Silážny balík je metóda silážovania v kompaktných balíkoch (vs klasická silážna jama). Pre SK farmy do 200 dojníc je často ekonomickejšia než budovanie silážnej jamy.\n\n**Pracovný postup**:\n1. **Kosenie** — žacím strojom s kondicionérom (rolovaním stebiel pre rýchlejšie vysúšanie).\n2. **Sušenie** v riadkoch na poli 6–24 h (na sušinu 30–45 %).\n3. **Obracanie / zhrňovanie** — obracač, zhrňovač pre homogénny riadok.\n4. **Lisovanie** — okrúhly lis (round baler) tvorí valcové balíky 1,2 × 1,2 m (cca 600 kg) alebo 1,5 × 1,2 m (800–1000 kg).\n5. **Wrapping** — okamžite po balení (do 2 h) zabaliť do plastovej fólie. Wrapper navíja 4–8 vrstiev (cca 25–35 m fólie per balík).\n6. **Skladovanie** — balíky sťahovať na 1 stranu (ľahšia doprava), kontrola na preliačenie / poškodenie fólie.\n\n**Stroje + cena (2026)**:\n- **Lis okrúhly** (round baler) — 350 000 – 1,5 mil. Kč. Top značky: Krone, John Deere, Massey Ferguson, Vicon, Welger, Kverneland.\n- **Wrapper** — 200 000 – 800 000 Kč. Hi-Spec wrapper / Pöttinger / McHale.\n- **Kombi (lis + wrapper v jednom)** — 800 000 – 2,2 mil. Kč. McHale Fusion, Krone Comprima Wrap, Kuhn iBio.\n\n**Náklady na balík** (orientačne):\n- **Fólia**: 80–120 Kč/balík (6 vrstiev = 30 m × 4 Kč/m).\n- **Práca + traktor**: 100–200 Kč/balík.\n- **Amortizácia strojov**: 50–150 Kč/balík.\n- **Celkovo**: 230–470 Kč/balík = 230–470 Kč/600 kg = **0,40–0,80 Kč/kg sušiny**.\n\nPre porovnanie **silážna jama**: 0,15–0,30 Kč/kg sušiny (lacnejšie), ale jednorazová investícia 1–5 mil. Kč na stavbu.\n\n**Kedy sa oplatia balíky**:\n- **Malá / stredná farma** (do 100 dojníc) — nepotrebuje 2000 t silážnej jamy.\n- **Malé pozemky** s rozdielnymi plodinami — flexibilita.\n- **Bez stáleho stavebného pozemku** — nájomné pole, krátkodobé hospodárenie.\n- **Kŕmenie mimo farmu** — predaj balíkov susedným chovateľom.\n\n**Top značky pre lisy**: McHale (IE), Krone Comprima (DE), JD 870 (US), MF RB 4180 (US), Kuhn FB 3140 (FR).",
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
    "shortDef": "Dojáreň je technológia na dojenie dobytka — od rybej kosti cez paralel po robot. Voľba ovplyvňuje pracovný výkon, welfare a investičné náklady.",
    "longDef": "Dojáreň je technologický komplex pre dojenie dojníc. V ČR dominantná v maštaliach s 50+ dojnicami.\n\n**Hlavné typy**:\n\n### 1. Rybia kosť (Fishbone)\n- **Pozícia kráv**: pod uhlom 30° k pracovnej jamke.\n- **Veľkosť**: 2×4 až 2×12 stání.\n- **Výkon**: 60–80 kráv/hod.\n- **Pre stádo**: 50–200 dojníc.\n- **Cena**: 500 000 – 2 mil. Kč.\n- **Plus**: jednoduchá, overená, lacná.\n- **Mínus**: pomalá vs novšie systémy.\n\n### 2. Paralel (Parallel)\n- **Pozícia kráv**: kolmo k pracovnej jamke, dojič za zadkom.\n- **Veľkosť**: 2×8 až 2×24.\n- **Výkon**: 100–140 kráv/hod.\n- **Pre stádo**: 100–500 dojníc.\n- **Cena**: 1,5–6 mil. Kč.\n- **Plus**: kompaktná (užšia než fishbone), vyšší výkon.\n- **Mínus**: dojič nemá výhľad na vemena prednej rady.\n\n### 3. Karusel (Rotary)\n- **Pozícia kráv**: na rotujúcej plošine.\n- **Veľkosť**: 24–80 stání.\n- **Výkon**: 150–300 kráv/hod.\n- **Pre stádo**: 300+ dojníc.\n- **Cena**: 5–25 mil. Kč.\n- **Plus**: extrémny výkon, kontinuálny tok kráv.\n- **Mínus**: extrémna investícia, vyžaduje 24/7 prevádzku pre návratnosť.\n\n### 4. Robot (AMS — Automatic Milking System)\n- **Pozícia**: kravy prichádzajú samy 2–3× za deň.\n- **Výkon**: 60–80 dojníc na robot (jednotka).\n- **Pre stádo**: 60+ dojníc na robot, modulárne.\n- **Cena**: 4–6 mil. Kč na robot + 1–2 mil. Kč inštalácia.\n- **Plus**: automatizácia 24/7, žiadny dojič, welfare (krava si určuje rytmus), dáta na kravu.\n- **Mínus**: vysoká investícia, závislosť od elektroniky, vyžaduje optimalizovanú maštaľ.\n\n**Top značky**:\n- **DeLaval** (SE) — VMS robot, fishbone, paralel, karusel. Tradičný líder.\n- **Lely** (NL) — Astronaut robot. Najpredávanejší AMS na svete.\n- **GEA Westfalia** (DE) — DairyRobot, Magnum karusel.\n- **BouMatic** (US) — paralel, fishbone, robot.\n- **Fullwood** (UK) — fishbone, paralel.\n\n**Ekonomika** (orientačne pre stádo 200 dojníc):\n- **Fishbone 2×10**: investícia 1,8 mil. Kč, 2 dojiči × 4 h × 2× denne.\n- **Paralel 2×16**: investícia 3,5 mil. Kč, 1 dojič × 3,5 h × 2× denne.\n- **3× Lely Astronaut**: investícia 18 mil. Kč, 0 dojičov.\n- **Na liter mlieka**: fishbone 0,30 Kč/l, paralel 0,25, robot 0,40 (vyššie fixné, nižšie variabilné).\n\nV ČR 2024: cca **70 % fariem fishbone/paralel**, **20 % karusel/rapid exit**, **10 % AMS robot** (rastie rýchlo, hlavne mladé generácie farmárov).",
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
    "shortDef": "Úhor je dočasne neosiate pole, ktoré sa necháva odpočinúť, regenerovať živiny a potlačiť buriny. V historickom trojpoľnom systéme ležala 1/3 polí ladom každý rok. Dnes sa úhor využíva napríklad na plnenie neprodukčných plôch celofarmovej ekoplatby v ČR.",
    "longDef": "Úhor (od českého slovesa „úhořit\" = odpočívať) je pole, ktoré sa po zbere **dočasne neosieva**, aby si pôda mohla regenerovať živiny, vodu a štruktúru. Historicky bol základnou súčasťou európskeho poľnohospodárstva až do 19. storočia.\n\n**Trojpoľné hospodárstvo** (= trojpoľný systém, pozri [[trojhonny-system]]):\n- 1. hon: ozim (raž, pšenica)\n- 2. hon: jarina (ovos, jačmeň)\n- 3. hon: **úhor** (ladom, pasie sa alebo orie)\n\nTretina polí každý rok ležala ladom. Bez minerálnych hnojív to bol jediný spôsob, ako udržať úrodnosť. Hospodár na úhore obvykle:\n- nechal na ňom **pásť dobytok** — ten hnojil pole čerstvým hnojom\n- **preorával** (Zemiaková orba) → ničil buriny\n- **zelený podsev** lucernou alebo ďatelinou (od 18. storočia) — fixoval dusík\n\n**Koniec úhoru:** Minerálne hnojivá (Liebig 1840s, syntéza amoniaku Haber-Bosch 1909) odstránili nutnosť úhoru. Norfolský 4-poľný systém (lucerna-pšenica-repa-jačmeň) bez úhoru dramaticky zvýšil produktivitu — anglická poľnohospodárska revolúcia.\n\n**Moderné typy úhoru:**\n- **Zelený a nektárodajný úhor** — v ČR jediné druhy úhoru, ktoré sa v celofarmovej ekoplatbe (2025) započítavajú do neprodukčných plôch; zelený úhor je dvojročný záväzok. V rokoch 2015–2022 sa úhor mohol započítavať do plôch v ekologickom záujme (EFA) v rámci greeningu.\n- **Čierny úhor** — orané, neosiate pole. Dnes skôr ekologicky problematický (erózia).\n- **Aktívny úhor** — pásy nektárodajných rastlín pre opeľovače, biopásy, biopas (pozri [[biopasy]]).\n\nV ČR dnes:\n- Úhor (pre ekoplatbu len nektárodajný alebo zelený) sa započítava do neprodukčných plôch — v základnej ekoplatbe (2025) ich musí byť aspoň 5 % ornej pôdy (variant A).\n- Na úhore platí od 1. februára do 15. augusta zákaz zberu a pastvy (podmienky ekoplatby 2025).\n\nEtymológia: praslovanské *ǫgorъ* (= pole nechané ladom). Súvisiace slová: **ladina** (úhor po viacerých rokoch), **honitba** (revír na úhore), **pole** (kontrast: pole = obrábané, úhor = nie).\n\nPozri tiež [[trojhonny-system]], [[osevni-postup]], [[mezi-plodiny]], [[biopasy]], [[regenerativni-zemedelstvi]].",
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
    "longDef": "Trojhonný systém (tiež trojpoľný systém, nem. *Dreifelderwirtschaft*) je stredoveký a ranonovoveký **osevný postup**, ktorý nahradil starší dvojhonný systém (ozim/úhor). Vznikol v karolínskej dobe (9. storočie) a v Európe dominoval takmer 1 000 rokov.\n\n**Princíp:**\nOrná pôda dediny bola rozdelená na **tri hony** (= veľké pole pozostávajúce z mnohých úzkych záhonov jednotlivých sedliakov). Každý rok sa osievalo:\n- **1. hon (ozim)**: pšenica alebo raž, siate na jeseň\n- **2. hon (jarina)**: ovos alebo jačmeň, siate na jar\n- **3. hon (úhor)**: ladom, pasívne, pasenie dobytka pre hnoj\n\nNasledujúci rok sa všetko posunulo o jeden — ozim → úhor → jarina → ozim atď. Cyklus 3 roky.\n\n**Výhody (vs dvojhonný):**\n- 2/3 pôdy aktívne obrobené (vs 1/2 v dvojhonnom)\n- Vyššia produktivita, lepšia výživa populácie\n- Dve žatvy ročne (ozim v júli, jarina v septembri)\n- Lepšia distribúcia práce počas roka\n\n**Nevýhody (z dnešného pohľadu):**\n- 1/3 pôdy stále ležala ladom\n- Nízke výnosy (1,5–2 t/ha pšenice — dnes 8 t/ha)\n- Žiadne okopaniny (zemiaky, repa) — tie prišli až v 18. storočí\n- Sociálna strnulosť: každý sedliak mal pruhy vo všetkých troch honoch, dedina musela rozhodovať spoločne čo kedy siať\n\n**Koniec systému (prechod 1750–1900):**\n- **Norfolský 4-honný systém** (UK, 1730s): lucerna-pšenica-repa-jačmeň — bez úhoru, vyššie výnosy.\n- **Mária Terézia a Jozef II.** (CZ 1750–1790): patenty rušili nútené trojpoľné hospodárstvo, povoľovali individuálne rozhodovanie sedliakov.\n- **Liebig + minerálne hnojivá** (1840+): umožnili kontinuálny osev.\n- **19. storočie**: scelovanie pozemkov (komasácia), individuálne farmy, moderné striedanie plodín.\n\nV CZ trojhonný systém zanikol postupne 1780–1850, posledne v niektorých horských oblastiach (Šumava, Krkonoše) ešte začiatkom 20. storočia.\n\n**Pozostatky v krajine:**\n- **Lineárne cesty** medzi poliami v plužine (záhonovej parcelácii)\n- **Medzné kamene** (pozri [[mez]]) označujúce hranice\n- **Pomiestne názvy**: „Veľký hon\", „Horný hon\", „Dolný hon\"\n- **Trojštrukturálne vinice** na južnej Morave (vinárske varianty)\n\nPozri tiež [[uhor]], [[osevni-postup]] (moderný), [[mez]], [[lan]].",
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
    "shortDef": "Medza je úzky trávnatý alebo krovinatý pás oddeľujúci susedné polia. Historicky vyznačovala hranice medzi vlastníkmi, dnes je cenená pre biodiverzitu, ochranu proti erózii a ako krajinný prvok v pravidlách SPP.",
    "longDef": "Medza (od staročeského *meža* = hranica) je **úzky trávnatý alebo krovinatý pás** medzi dvoma poliami. Historicky to bol praktický predel medzi vlastníkmi pôdy (hranica plužiny) aj ochrana proti splachu pôdy.\n\n**Funkcie historicky:**\n- **Hraničný pás** — viditeľne oddeľovala vlastníctvo. Často s **medzníkmi** (kamene, stĺpy) na rohoch.\n- **Krajinný prvok** — domov pre zver, vtáctvo, hmyz. Nebola intenzívne obrábaná.\n- **Cesta pre povozy** — širšie medze slúžili ako poľné cesty.\n- **Pastva pre drobný dobytok** — kozy, ovce sa pásli „na medziach\" keď pole bolo osiate.\n\n**Likvidácia medzí 1948–1989** (kolektivizácia):\nJZD a štátne statky **scelovali polia do obrovských blokov** (často 50–200 ha) pre nasadenie veľkej techniky (T-150, Š-180, Fortschritt). V ČR zanikli tisíce kilometrov medzí. Dôsledky:\n- Akcelerácia **vodnej erózie** (žiadne zelené pásy zachytávajúce splach)\n- Pokles **biodiverzity** (zánik útočiska pre hmyz, vtáky, drobnú zver)\n- Vznik veľkých homogénnych „prérií\"\n- Zmeny mikroklímy (suchšia krajina, vetru otvorená)\n\n**Návrat medzí 1990–dnes:**\n- **Ekoplatba v ČR**: medza ako krajinný prvok sa započítava do neprodukčných plôch celofarmovej ekoplatby; od roku 2025 možno žiadať aj o platbu na údržbu krajinných prvkov (2025: 38 261,21 Kč/ha) a na vytváranie nových (10 512,72 Kč/ha).\n- **Greening (2015–2022)**: krajinné prvky vrátane medzí sa skôr započítavali do plôch v ekologickom záujme (EFA).\n- **Podmienenosť v ČR**: krajinné prvky chráni štandard DZES 8; proti erózii na ohrozených plochách platí DZES 5.\n- **Evidencia** — medza je jedným z typov krajinných prvkov evidovaných v českom LPIS (nariadenie vlády ČR č. 307/2014 Sb.).\n\n**Šírka medzí dnes:**\n- **Klasická medza** šírky 1–3 m medzi poliami\n- **Široká medza** 5–10 m, často s kríkmi (trnka, šípka, hloh) — pre vodné hospodárstvo\n- **Lineárny remízok** 10+ m — funguje ako biotop\n- **Biokoridor** 20+ m — prepája väčšie biotopy\n\n**Pomiestne názvy s „medza\"** sú v ČR všadeprítomné: „Na Mezích\", „Veľká medza\", „Medzná cesta\", „U medzníka\", obce „Meznice\", „Meziroka\", „Meziboří\".\n\nPozri tiež [[biopasy]], [[eroze-pudy]], [[trojhonny-system]], [[gaec]], [[lan]].",
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
    "longDef": "Robota (od slovesa *robotiti* = pracovať, otročiť) bola **povinná neplatená práca** poddaných sedliakov na pôde vrchnosti (šľachty, kláštorov, kráľa). V českých krajinách to bola hlavná forma feudálnej renty od 11. do 19. storočia.\n\n**Typy roboty:**\n- **Ťažná robota** — práca s párom koní alebo volov (orba, hnojenie, žatva, vozenie). Pre „láníkov\" s celým lánom.\n- **Pešia robota** — manuálna práca (kopanie, pletie, kosenie, hrabanie). Pre chalupníkov a domkárov.\n- **Ženská robota** — pradenie, pletenie, žatva, zber ovocia.\n- **Mimoriadna robota** — stavby (mlyny, panské sídla), lov pre vrchnosť.\n\n**Rozsah:**\nRobotné povinnosti sa odvíjali od veľkosti gruntu (pozri [[grunt]], [[lan]]):\n- **Láník (celý lán, 17+ ha)**: 3 dni ťažnej roboty týždenne + sezónne špičky (žatva, vinobranie)\n- **Pôlláník**: 2 dni ťažnej + 1 deň pešej\n- **Chalupník**: 1–2 dni pešej týždenne\n- **Domkár (bez pôdy)**: len sezónne\n\nPlus **naturálne dávky** (desiatok, vajcia, sliepky) a peňažné dane.\n\n**Kľúčové míľniky regulácie:**\n- **1680 — Tereziánsky patent o robote**: max. 3 dni ťažnej / 3 dni pešej týždenne.\n- **1738 — Robotný patent Karla VI.**: ďalej spresnené, ale poddaný stále nemohol odísť.\n- **1775 — Robotný patent Márie Terézie**: oficiálne tabuľky podľa veľkosti gruntu, nútené zmierovacie komisie pri sporoch.\n- **1781 — Patent o zrušení nevoľníctva Jozefa II.**: poddaný mohol odísť z panstva, vziať si koho chcel, dať deti na remeslo. **Robota však zostala!**\n- **1848 — Október 1848**: Hans Kudlich (sedliak a poslanec Ríšskeho snemu) iniciuje **zrušenie roboty bez náhrady**. Schválené 7. septembra 1848.\n- **1849 — Skutočná likvidácia**: vrchnosť dostala kompenzáciu (od štátu, nie sedliakov). Sedliak sa stal **slobodným vlastníkom pôdy**.\n\n**Dopady zrušenia:**\n- Vznik slobodného trhu s pôdou\n- **Komasácia** (scelovanie) pozemkov 1850–1920\n- Mladí sedliaci si mohli budovať hospodárstvo bez záväzkov\n- Vznik moderného poľnohospodárstva s motívom zisku\n- Sociálna revolúcia na vidieku — emigrácia „prebytočných\" sedliakov do USA, Viedne, do miest\n\nV kultúre: **„Babička\"** B. Němcovej (1855) zachytáva neskorú robotnú éru. **„Robotnícky dom\"** bola historická budova pre ubytovanie nájomných pracovníkov na panstve po zrušení nevoľníctva.\n\nEtymológia: od staročeského *robota* (ťažká práca, otroctvo). Karel Čapek v R.U.R. (1920) použil slovo **robot** v modernom zmysle, čím ho učinil svetovým.\n\nPozri tiež [[grunt]], [[lan]], [[trojhonny-system]], [[mez]], [[uhor]].",
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
    "longDef": "Grunt (z nemeckého *Grund* = základ, pôda) je historické označenie pre **sedliacke hospodárstvo** — usadlosť so všetkým príslušenstvom: dom, maštale, stodola, sýpka, záhrada, sad a polia v plužine obce. „Sedliak na grunte\" bol základnou sociálnou vrstvou vidieckeho obyvateľstva.\n\n**Veľkosť gruntov:**\n- **Celý lán (lánik)**: 17–20 ha polí — najvyššia kategória, „sedliacky grunt\"\n- **Polovica lánu (pololánik)**: 8–10 ha — stredný sedliak\n- **Štvrtina lánu (štvrtlánik, chalupník s poľom)**: 4–5 ha\n- **Chalupa bez pôdy**: len dom a malá záhrada — domkári, remeselníci\n- **Veľký grunt** (statkár, dvorový grunt): 30+ ha, často s vlastnými paholkami\n\n**Architektúra gruntu:**\n- **Dom** s jednou veľkou „svetnicou\" (obytná miestnosť s pecou), kuchyňou a komorou\n- **Chliev** (maštale) pre kravy, kone, prasatá — typicky v zadnej časti dvora\n- **Stodola** (stoh — pozri samostatne) pre slamu, seno, uskladnenú úrodu pred mlátením\n- **Sýpka** (panský sýpkár) — uskladnenie obilia na siatie + osivo na zimu\n- **Studňa** uprostred dvora\n- **Hnojisko** (mršište) za chlievom\n- **Sad / záhrada** za domom (jablone, hrušky, slivky)\n\n**Gruntové knihy:**\nOd 16. storočia **každá dedina mala gruntovú knihu** vedenú vrchnosťou (neskôr štátom) — záznam **kto na ktorom grunte hospodári**, predaje, dedičské prevody, veno. Kľúčový zdroj pre genealógiu a históriu dediny.\n\n**Kľúčové gruntové právo:**\n- **Nedeliteľnosť gruntu** — celý grunt preberal **jeden syn** (typicky najstarší, ale nie vždy). Ostatní išli na remeslo, do mesta alebo dostali peňažnú pomoc.\n- **Výmenok** — odchádzajúci hospodár (starnúci otec) si na grunte vymienil bývanie a stravu na zvyšok života. Zmluva pevne zakotvená.\n- **Výmenkársky domček** = malá budova pre výmenkára (často súčasť gruntu).\n\n**Koniec gruntov 1948–1960:**\n- **Vyvlastnenie**: kolektivizácia zlikvidovala súkromné hospodárenie, grunt sa stal súčasťou JRD/Štátneho majetku.\n- **Vykulačenie**: najväčšie sedliacke grunty (kulaci) zlikvidované, rodiny perzekvované.\n- **Demolácia**: mnoho gruntov zbúraných pre výstavbu kravínov, síl a domov pre pracujúcich JRD.\n\n**Reštitúcie 1991–dnes:**\n- Vrátenie pozemkov a budov pôvodným vlastníkom alebo dedičom.\n- Mnoho gruntov zrekonštruovaných ako **rodinné farmy** (často 5. generácia na rovnakom pozemku).\n- Niektoré veľké grunty fungujú ako **agroturistika** alebo „dedičstvo\" pre mestských potomkov.\n\n**Pomiestne stopy**: „Na grunte\", „Starý grunt\", „Gruntová cesta\" sú typické názvy v ČR. **Priezviská Grunt, Grunta, Gruntorád** odkazujú na sedliacky pôvod.\n\nPozri tiež [[lan]], [[robota]], [[trojhonny-system]], [[mez]], [[jitro]], [[korec]].",
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
    "shortDef": "Žentúr je historický stroj poháňaný silou dobytka (kone, voli) — kruhové zariadenie, kde zviera chodí po obvode a otáča hriadeľom napojeným na mláťačku, šrotovník alebo lis. Predchodca parného a elektrického pohonu.",
    "longDef": "Žentúr (nem. *Göpel*, z latinského *gyrum* = kruh) je **historický stroj poháňaný ťažnou silou dobytka** — kone, voly, osly. Princíp: zviera kráča po kruhovej trati (priemer 6–10 m) a otáča zvislým alebo vodorovným hriadeľom, ktorý poháňa cieľový stroj.\n\n**Konštrukcia:**\n- **Centrálny zvislý hriadeľ** s ramenom (žrďou), za ktoré zviera ťahá\n- **Prevodovka** (často s ozubenými kolesami) — prevádza pomalé otáčky zvieraťa (3–8 ot/min) na rýchlejšie pre pracovný stroj\n- **Plošina alebo strecha** — chráni zviera pred dažďom\n- **Postroj a vodítka** — niekedy s automatickou reguláciou rýchlosti\n\n**Použitie:**\n- **Mláťačka obilia** (najčastejšie) — mlátenie cepom bolo postupne nahradené mechanickou mláťačkou poháňanou žentúrom\n- **Šrotovník** — drvenie obilia a zemiakov na krmivo\n- **Lis** — slamy do balíkov, ovocia na mušt\n- **Vyklápač** — sena, hnoja\n- **Čerpadlo** — voda zo studne do zásobníka\n- **Kováreň** — pohon dúchadla v kováčni\n- **Cukrovary 19. storočia** — drvenie cukrovej repy\n\n**Dva hlavné varianty:**\n1. **Zvislý žentúr** (najstarší) — zviera chodí okolo zvislej osi, mláťačka stojí v centre. Vyžaduje veľkú plochu.\n2. **Vodorovný žentúr** (od 18. storočia) — kompaktnejší, hriadeľ vedie zo žentúru do stroja v susednej miestnosti. Umožnil **stavbu žentúrovej stodoly** s dvoma miestnosťami.\n\n**Výkon:**\n- 1 kôň generuje ~0,5–1 konskej sily (740 W) v žentúre\n- Pár koní = ~1,5 HP = stačí pre malú mláťačku (100 kg obilia/h)\n- 4 voli = ~2 HP — pre väčšiu mláťačku alebo lis\n\n**História:**\n- **Stredovek**: len pre vodné mlyny a kováčne (vodné kolesá, nie žentúry).\n- **16.–18. storočie**: šírenie žentúrov s mláťačkami v Anglicku, Nemecku.\n- **1740–1850 v ČR**: každý väčší grunt mal žentúrovú stodolu.\n- **1850–1900**: parný stroj (lokomobila) postupne nahradil žentúr. Mláťačka poháňaná parou bola mnohonásobne výkonnejšia.\n- **1900–1950**: elektrický motor (po elektrifikácii vidieka 1920–1950) finálne nahradil aj parný stroj.\n- **Dnes**: žentúry sú múzeálne kuriozity (Vlastivedné múzeum Šumperk, Veselý Kopec, skanzeny).\n\n**Stopy v krajine:**\n- **Žentúrové stodoly** — okrúhly alebo polygonálny pôdorys so šikmou strechou, dodnes zachované v niektorých dedinách (najmä severná Morava, Vysočina).\n- **Pomiestne názvy**: „U žentúru\", „Žentúrová cesta\".\n- **Slovo „žentúr\"** prežíva v dialekte ako synonymum pre „ťažkú monotónnu prácu\" (Čalúniť ako žentúr = robiť namáhavú rutinnú prácu).\n\nPozri tiež [[grunt]], [[robota]], [[mlat]], [[zne]].",
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
      "mláťačka",
      "mlatovňa",
      "humno"
    ],
    "kategorie": "historie",
    "shortDef": "Mlat je veľká plocha (pôvodne udupaná hlina) v stodole, kde sa cepmi alebo žentúrovou mláťačkou mlátilo obilie. Centrum zimného hospodárenia až do 19. storočia, keď ho nahradila mobilná mláťačka.",
    "longDef": "Mlat (od *mlátiť*) je **vodorovná spevnená plocha** vo vnútri stodoly, kde sa v zime **mlátilo obilie** — oddeľovali sa zrná od slamy a klasov. Kľúčové miesto zimnej práce sedliaka.\n\n**Konštrukcia mlatu:**\n- **Podlaha**: tvrdá udupaná hlina zmiešaná s vápnom alebo volskou krvou (pre tvrdosť), občas dlažba alebo drevené fošne\n- **Veľkosť**: typicky 4 × 6 m až 6 × 10 m\n- **Umiestnenie v stodole**: uprostred medzi dvoma „závory\" — priestory, kde sa skladovali nevymlátené snopy\n- **Vstupy**: dve protiľahlé vráta (juh aj sever), aby sa dali „závory\" zaplniť z oboch strán a aby fungoval **prievan** pre zdvíhanie pliev (prevívanie zrna)\n\n**Mlácenie cepom (do ~1850):**\n- **Cep** — drevený nástroj so švihacou časťou (bidlo + tĺčka spojené remienkom)\n- **Rytmus**: 4–8 mláťačov v rade mlátilo rytmicky („štvorka\", „šestorka\") — dodnes prežíva v ľudovej hudbe (rytmus „mláťačiek\")\n- **Výkon**: 1 mláťač zvládne ~50–80 kg zrna za deň\n- **Skladba sezóny**: mlátilo sa od novembra do marca — celé 4–5 mesiacov zimnej práce\n\n**Mlácenie žentúrovou mláťačkou (1850–1900):**\n- **Mechanická mláťačka** poháňaná žentúrom (pozri [[zentour]]) v susednej miestnosti\n- **Výkon**: 200–500 kg obilia za hodinu (5–10× rýchlejšie než cep)\n- **Pomocník**: 2–3 muži prikladali snopy, 1–2 odoberali slamu, 1 odoberal zrno\n\n**Mlácenie parnou lokomobilou (1880–1950):**\n- **Pojazdná mláťačka** — parný stroj na vozíku obchádzal dediny, „mlátil\" 1–2 dni u každého sedliaka\n- **Výkon**: 1 000–2 000 kg/h\n- **Koniec mlatu ako pracovného priestoru** — práca sa presunula von na dvor\n\n**Mlácenie kombajnom (1950+):**\n- **Kombajn** (pozri [[kombajn-trida]]) vykonáva mlácenie **priamo na poli**\n- Mlat stratil funkciu, **stodoly sa prestavali** na garáže pre techniku, sklady pre hnojivá, alebo sa zbúrali.\n\n**Dnes:**\n- Niektoré staré stodoly s mlatom zachované v skanzenoch (Veselý Kopec, Strážnice, Přerov nad Labem).\n- **„Mlatová slávnosť\"** = ľudová oslava konca mlácenia (pred 1900), s tancom na mlate.\n- Slovo **mláťačka** prežíva ako technický termín (= obilná mláťačka v kombajne, pozri [[rotor-kombajn]]).\n\n**Pomiestne názvy:** „U mlatu\", „Mlatovňa\", „Stará mláťačka\" v ČR bežné.\n\n**„Humno\"** (slovenské, valašské) = synonymum mlatu, niekedy širšie (= celá stodola).\n\nEtymológia: praslovanské *mlatъ* (= úder, mlat). Súvisiace slová: **mlátiť** (= mlátiť cepom), **mláťačka** (= stroj), **mlatec** (= muž mlátiaci cepom).\n\nPozri tiež [[zentour]], [[grunt]], [[zne]], [[rotor-kombajn]].",
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
    "longDef": "Žatva (od slovesa *žať* — kosiť obilie) je **vrcholné obdobie zberu obilia** v letnom poľnohospodárskom cykle. V ČR typicky koniec júla až polovica augusta (oziminy prvé, jariny neskôr). Historicky to bola **najintenzívnejšia práca roka** s vlastnou liturgiou, piesňami a obyčajmi.\n\n**Tradičná žatva (do ~1900):**\n- **Nástroje**: **kosák** (jednoručný, do 17. storočia hlavný), **kosa** (od 17. storočia — väčší výkon)\n- **Tempo**: 1 kosec za deň zvládne ~0,3–0,5 ha obilia\n- **Organizácia**: rodina + nájomní pomocníci („ženci\", „ženkyne\")\n- **Žatevná skupina** (= 4–8 ľudí): jeden kosec → odberateľka (žena) za ním → snopičia (viazači snopov) → kladači do panákov\n- **Po zbere**: snopy stoja v poľných **panákoch** (šokách) na vysušenie 1–2 týždne, potom sa prevážajú do **stodôl** na **mlat** (pozri [[mlat]]) na zimné mlátenie\n\n**Mechanizačné míľniky:**\n- **1850 — Žací stroj (reaper)** Cyrus McCormick (USA), Cyrus Hall McCormick — ťahá dvojzáprah koní, jeden vodič. Reaper položil obilie na zem, ženci ho viazali ručne.\n- **1880 — Žací viazací stroj (binder)** — viazal snopy automaticky.\n- **1930 — Kombajn** v USA (kombinácia žacieho stroja + mláťačky). Zbiera + mláti + čistí v jednej operácii.\n- **1950 — Kombajn v ČSR** (Mountfield, Sodóma, neskôr Slavia, Kombajny Polska Bizon).\n- **1990+ — Veľké západné kombajny** (Claas Lexion, John Deere S-rada, New Holland CR).\n\nDnes:\n- **Zber pšenice**: 1 moderný kombajn (Claas Lexion 8900) zvládne **5–10 ha/h** = celá farma 500 ha za **2–3 dni**.\n- **Kosec s kosou**: 0,3 ha/deň × 500 ha = **3 roky ľudskej práce** ekvivalent jedného moderného kombajnu.\n\n**Kultúrna dimenzia:**\n- **Žatevné piesne** (zachované ľudovou tradíciou)\n- **„Hostina po žatve\"** = oslava konca zberu, štedrá strava, tanec\n- **„Dožinky\"** = slávnostný sprievod posledného snopu ozdobeného kvetmi k statkárovi, vrchnosti alebo dnes na slávnostiach mestečka/obce\n- **„Zberový obrad\"** v niektorých krajoch (privolávanie úrody) — synkretizmus pohanských a kresťanských obradov\n- **Klasická česká literatúra**: Babička, Naši, Karel Klostermann — žatva je ústredná scéna vidieckeho roka\n\n**Klimatické riziko žatvy:**\n- **Búrky** — silný dážď „poľahne\" obilie (vrhne steblá k zemi), výnos klesá o 20–40 %\n- **Krupobitie** — likviduje úrodu počas minút\n- **Dlhodobé mokré počasie** — obilie klíči v klase, strata potravinárskej kvality\n- **Sucho** — znižuje výnos aj hektolitrovú váhu (pozri [[hektolitr]])\n\n**Zber 2024 v CZ** (orientačne):\n- Pšenica ozimná: 1,4 mil. ha × 6,2 t/ha = **8,7 mil. t**\n- Jačmeň: 320 tis. ha × 5,8 t/ha = **1,85 mil. t**\n- Repka: 380 tis. ha × 3,2 t/ha = **1,2 mil. t**\n- Kombajny v prevádzke: ~3 500 ks (prevažujú Claas + JD)\n\n**„Otavy\"** = druhý zber trávy/sena na jeseň (NIE obilie — to ide len raz).\n\nPozri tiež [[mlat]], [[kombajn-trida]], [[rotor-kombajn]], [[grunt]].",
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
    "longDef": "Regeneratívne poľnohospodárstvo (anglicky *regenerative agriculture*, „regen ag\") je systém produkcie, ktorý **aktívne obnovuje** zdravie pôdy, biodiverzitu a ekosystémové služby. Nie je to certifikačná schéma ako bio, ale **principiálny prístup** s merateľnými výsledkami.\n\n**5 princípov regeneratívneho poľnohospodárstva** (podľa Gabe Brown, US):\n1. **Minimalizácia narušenia pôdy** — žiadna orba, žiadne hlboké spracovanie. Pôda zostáva štruktúrovaná, mikroorganizmy neprerušené. Pozri [[no-till]], [[strip-till]].\n2. **Stály kryt pôdy** — krycie plodiny (cover crops), mulč, slama. Pôda nikdy nahá. Znižuje eróziu, udržuje vlhkosť, kŕmi mikrobiom.\n3. **Rozmanitosť rastlín** — minimálne 4-5 plodín v rotácii, ideálne viacročné zmesi (medziplodiny, pozri [[mezi-plodiny]]). Žiadna monokultúra.\n4. **Žijúce korene celoročne** — vždy niečo rastie. Krycie plodiny medzi hlavnými plodinami zabezpečia, že korene stále kŕmia mikrobiom.\n5. **Integrácia dobytka** — pastva alebo „mob grazing\" (vysoká intenzita, krátka doba) na poliach po zbere. Hnoj + šliapanie kopýt + sliny obnovia pôdu.\n\n**Hlavné rozdiely vs konvenčné poľnohospodárstvo:**\n\n| Aspekt | Konvenčné | Regeneratívne |\n|--------|-----------|---------------|\n| Pôda | Komodita (substrát) | Živý organizmus |\n| Spracovanie | Orba, podmietka | No-till, strip-till |\n| Kryt | Holá pôda 3–6 mes./rok | Stály kryt |\n| Plodín v rotácii | 2–4 | 5+ |\n| Minerálne hnojivá | 150–200 kg N/ha | 50–100 kg N/ha (s pokrytím leguminózami) |\n| Postreky | Pravidelne | Cielené, redukované |\n| Dobytok | Oddelený od polí | Integrovaný |\n\n**Merateľné výsledky (po 5–10 rokoch):**\n- **Organická hmota v pôde**: +1–2 % (z 2 % na 3–4 %). Každé 1 % SOM = +20 t C/ha sekvestrácia.\n- **Infiltrácia vody**: 2–10× lepšia (menej povrchového odtoku)\n- **Náklady**: -20 až -40 % (menej paliva, hnojív, postrekov)\n- **Výnosy**: Prvé 2–3 roky pokles 10–20 %, potom porovnateľné s konvenčným (niekedy +10–20 %)\n- **Marže**: vyššie kvôli nižším nákladom + prémiové ceny (carbon credits, regen certifikácia, Whole Foods/Patagonia kontrakty)\n\n**Slávne regen mená:**\n- **Gabe Brown** (USA, ND) — kniha „Dirt to Soil\"\n- **Allan Savory** (Zimbabwe) — „Holistic Management\" pre pastvu\n- **Joel Salatin** (USA, VA) — Polyface Farm, multi-species integrované pastviny\n- **Charles Massy** (Austrália) — „Call of the Reed Warbler\", regenerácia austrálskych pastvín\n\n**Riziko:**\n- **Prechodové obdobie 3–5 rokov** — výnosy klesnú, kým sa neobnoví pôdny mikrobiom\n- **Vyžaduje hlboké znalosti** agronómie a ekológie — viac než aplikovať recepty\n- **Pozemkové vlastníctvo**: prenajatá pôda znevýhodňuje (musíš dlhodobo investovať do niečoho, čo možno opustíš)\n\nPozri tiež [[no-till]], [[ctf]], [[mezi-plodiny]], [[organicka-hmota]], [[karbonove-zemedelstvi]], [[biouhel]], [[mykorhiza]].",
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
    "longDef": "Uhlíkové poľnohospodárstvo (carbon farming) je systém **poľnohospodárskych praktík aktívne zvyšujúcich uhlíkové zásoby v pôde a vegetácii** s cieľom zmierniť klimatickú zmenu. Poľnohospodár sa stáva „uhlíkovým farmárom\" — produkuje vedľa bežných plodín aj **sekvestrovaný uhlík**, ktorý je možné predať ako **uhlíkový kredit**.\n\n**Kľúčové praktiky (sekvestrácia C):**\n- **No-till / strip-till** — bez orby = menej oxidácie organickej hmoty = viac C v pôde. Pozri [[no-till]], [[strip-till]].\n- **Krycie plodiny** (cover crops) — korene + listy pridávajú C do pôdy medzi hlavnými plodinami.\n- **Vrátiť slamu** (incorporation reziduí) — nepáliť slamu, mulčovať ju.\n- **Hnojivá organické** (hnoj, kompost, biouhlie — pozri [[biouhel]]) namiesto minerálnych.\n- **Diverzifikácia osevného postupu** — 5+ plodín v rotácii.\n- **Vápnenie** (pozri [[vapneni]]) — alkalizuje pH, znižuje emisie N₂O.\n- **Agrolesníctvo** — stromohrady, vetrolamy, agroforestry. Stromy zachytávajú veľké množstvo C.\n- **TTP konverzia** (orná → lúka, pozri [[ttp]]) — lúky uložia 2–4× viac C než orná pôda.\n\n**Čo je 1 uhlíkový kredit?**\n1 uhlíkový kredit = **1 tona CO₂ ekvivalentu** sekvestrovaná alebo redukovaná. V ČR/EÚ sa obchoduje na dobrovoľných trhoch za:\n- **15–25 EUR/t CO₂** (dnes 2024) na dobrovoľných trhoch (Verra, Gold Standard)\n- **60–90 EUR/t CO₂** v EU ETS (povinný trh, ale poľnohospodárstvo tam zatiaľ nie je)\n\n**Príklad ekonomiky** (farma 500 ha prechádza z orby na no-till + krycie plodiny):\n- **Sekvestrácia**: ~0,5 t C/ha/rok = ~1,8 t CO₂/ha/rok\n- **500 ha × 1,8 t × 20 EUR = 18 000 EUR/rok = ~450 tis. Kč**\n- Plus zníženie nákladov na palivo a hnojivá: ~200 tis. Kč\n- Minus poradenstvo a certifikácia: ~80 tis. Kč\n- **Čistý zisk**: 570 tis. Kč/rok dodatočne\n\n**Certifikačné schémy** (ako predať kredit):\n- **Verra VCS** (Verified Carbon Standard) — globálna, drahá certifikácia\n- **Gold Standard** — preferuje sociálny dopad\n- **Indigo Ag** (USA) — agtech platforma, prevažuje v USA\n- **Climate Farmers** (DE) — startup pre EU farmy\n- **Soil Capital** (BE) — platby za t CO₂\n- **eAgronom** (EE) — softvérová platforma pre management\n\n**Problémy a kritika:**\n- **Additionality** — kredit je „platný\" len ak by farma sekvestráciu bez neho NEROBILA. Sporné.\n- **Permanence** — ak farma za 10 rokov znovu zorá, uhlík sa vráti do atmosféry. Uhlíkový kredit by mal byť „revoked\".\n- **Verification** — meranie obsahu C v pôde je drahé, často nepresné. Modely vs reálne meranie.\n- **Leakage** — ak farma A sekvestruje, ale farma B vedľa zorá viac, čistý dopad = 0.\n- **Greenwashing** — niektoré firmy nakupujú kredity, aby vyzerali „klimaticky neutrálne\", ale nikdy neznižujú vlastné emisie.\n\n**Politika EÚ a ČR:**\n- **EU CRCF** (Carbon Removals Certification Framework) — nariadenie 2024 nastavuje pravidlá pre uhlíkové kredity z poľnohospodárstva.\n- **Český Strategický plán SPP 2023–2027** podporuje ukladanie uhlíka v pôde nepriamo — napríklad podmienkou hospodárenia s organickou hmotou v celofarmovej ekoplatbe alebo zatrávňovaním ornej pôdy v AEKO.\n\n**Odporúčaná literatúra:**\n- Lal, R. (2004) „Soil carbon sequestration impacts on global climate change and food security\"\n- Kniha „Drawdown\" (P. Hawken, 2017) — top 100 riešení klimatickej zmeny, mnoho v poľnohospodárstve\n\nPozri tiež [[regenerativni-zemedelstvi]], [[no-till]], [[organicka-hmota]], [[biouhel]], [[ttp]], [[vapneni]].",
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
    "longDef": "Strip-till (pásové spracovanie, *strip tillage*) je **kompromis medzi konvenčnou orbou a no-till** (pozri [[no-till]]). Stroj spracováva **len úzky pás pôdy priamo v siatom riadku** (typicky 20–30 cm široký), zatiaľ čo priestor medzi riadkami (typicky 75 cm rozteč pre kukuricu) zostáva **nedotknutý** s mulčom.\n\n**Princíp činnosti:**\nStroj má dve hlavné časti na každom riadku:\n1. **Diskový kotúč** — reže zvyšky a uvoľňuje hornú vrstvu (do 2–5 cm)\n2. **Dláto / radlička** — kyprí pás do hĺbky 15–25 cm\n3. **Voliteľne**: aplikácia hnojív do pásu (P, K, kvapalný N) v jednom prejazde — „fertilizer applicator\"\n4. **Voliteľne**: integrovaná sejba (súčasne seje osivo) — *one-pass* operácia\n\n**Pre ktoré plodiny:**\nStrip-till je ideálny pre **riadkové plodiny s veľkou roztečou**:\n- **Kukurica** (rozteč 75 cm) — primárne uplatnenie\n- **Slnečnica** (rozteč 70 cm)\n- **Cukrovka** (rozteč 45–50 cm)\n- **Repka ozimná** (rozteč 30–50 cm)\n- **Sója** (rozteč 35–50 cm)\n\nPre úzko siatu pšenicu (rozteč 12,5 cm) **strip-till nemá zmysel** — celá plocha by sa spracovávala, ekvivalent k orbe.\n\n**Výhody:**\n- **Zníženie erózie**: medziriadkový mulč zachytáva vodu (vs holá orba)\n- **Úspora paliva**: -30–50 % vs orba\n- **Lepšia štruktúra pôdy**: len 30 % plochy spracovaná, zvyšok udržuje štruktúru\n- **Cielené hnojenie**: hnojivo presne do riadku, nie plošne → -20 % spotreba\n- **Neskorá jeseň/jar vhodná**: vyššia pružnosť než klasická orba (ktorá musí skoro na jeseň)\n- **Sekvestrácia uhlíka**: ako kompromis medzi orbou (-) a no-till (+)\n\n**Nevýhody:**\n- **Drahý stroj** — strip-till s aplikáciou hnojív 1,5–3 mil. Kč (vs bežný pluh 500 tis. Kč)\n- **Vyžaduje GPS RTK** (pozri [[gps-rtk]]) — riadky musia byť presné na 2 cm. Bez RTK nemožno opakovane trafiť rovnaké pásy.\n- **Závisí od typu pôdy**: na ťažkých ílovitých pôdach problém s utuženým medzipásom (občas treba hlbokú orbu)\n- **Buriny**: v mulči medzi pásmi klíčia buriny, potreba glyfosát + selektívne herbicídy\n- **Sklon**: na svahoch > 8 % riskantné (erózia v koľaji sejacieho stroja)\n\n**Stroje:**\n- **Kuhn Striger** (FR) — premium, 1,5–2,5 mil. Kč\n- **Vaderstad Cultus** (SE) — robust, populárny v CZ\n- **Köckerling Vector** (DE) — kombinácia s aplikáciou\n- **Horsch Focus TD** (DE) — strip-till + sejací stroj v jednom\n- **John Deere 2510H** (US) — populárny v USA, menej v EU\n\n**V ČR**: do roku 2020 marginálny (< 1 % výmery), 2024 už ~5–8 % výmery kukurice a repky. Rast poháňaný:\n- Vysoká cena nafty 2022+\n- DZES 5 — pásové spracovanie pôdy je v ČR jednou z pôdoochranných technológií pre erózne ohrozené plochy (2025)\n\nPozri tiež [[no-till]], [[orba]], [[regenerativni-zemedelstvi]], [[ctf]], [[gps-rtk]], [[eroze-pudy]].",
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
    "term": "Biouhlie (biochar)",
    "alias": [
      "biochar",
      "agrouhlie",
      "pyrouhlie"
    ],
    "kategorie": "hnojivo",
    "shortDef": "Biouhlie je porézny uhlík získaný pyrolýzou biomasy (dreva, slamy, rastlinných zvyškov) bez kyslíka. Pridáva sa do pôdy na zvýšenie úrodnosti, viazanie živín a dlhodobú sekvestráciu uhlíka (1000+ rokov).",
    "longDef": "Biouhlie (anglicky *biochar*, grécky *bios* + *char* = život + uhlík) je **uhlíkatý materiál vyrobený pyrolýzou** (zahriatím bez kyslíka) biomasy — drevené štiepky, slama, šupky, hnoj, ovocné pecky. Zachováva **75–90 % uhlíka** z pôvodnej biomasy, ktorý je v pôde **stabilný stovky až tisíce rokov** — preto silný nástroj sekvestrácie CO₂.\n\n**Vznik a inšpirácia — *Terra Preta*:**\nV Amazonii (Brazília) boli objavené **tmavočierne úrodné pôdy** *Terra Preta de Índio* obsahujúce až 80 t/ha biouhlia zo starých indiánskych ohnísk. **Vek 500–2000 rokov**, dodnes mnohonásobne úrodnejšie než okolité červené latosoly. Inšpirácia pre moderný biochar.\n\n**Pyrolýza — výrobný proces:**\n- **Teplota**: 400–800 °C\n- **Bez kyslíka**: aby biomasa neoxidovala (nepálila sa na popol)\n- **Doba**: 15 min – 8 h podľa technológie\n- **Produkty**:\n  - 30–40 % biochar (pevný)\n  - 30–50 % bioolej (kvapalný — palivo)\n  - 20–30 % syngas (CO + H₂ + CH₄ — palivo)\n- **Energetická bilancia**: pyrolýza je samonosná — syngas poháňa proces\n\n**Vstupné suroviny:**\n- **Drevené štiepky** (lesná ťažba, prerezávky) — najvyššia kvalita biouhlia\n- **Slama obilnín** (pšenica, kukurica, repka) — stredne kvalitná, hojne dostupná\n- **Šupky a peckoviny** (ovocie, orechy) — vysoko porézne\n- **Hnoj kurčiat / kráv** — bohatý na P, K\n- **Zelená biomasa** (trstina, miscanthus) — pre plantáže biouhlia\n\n**Efekt na pôde:**\n1. **Porozita** — 1 g biouhlia = 200–400 m² povrchu (ako aktívne uhlie). Drží vodu aj živiny.\n2. **CEC** (Cation Exchange Capacity) — biouhlie viaže katióny (Ca²⁺, Mg²⁺, K⁺, NH₄⁺), pomaly ich uvoľňuje plodinám. **+30–80 % CEC** v piesčitých pôdach.\n3. **pH** — biouhlie je mierne alkalické (pH 8–10) → **stabilizuje kyslé pôdy**, alternatíva vápnenia.\n4. **Mikrobiom** — póry biouhlia sú ideálne „domovy\" pre pôdne baktérie a huby. **+30–60 % biomasy mikroorganizmov**.\n5. **Voda** — 1 t biouhlia zadržiava **2–4 t vody** v pôde → ochrana proti suchu.\n6. **Sekvestrácia C** — 1 t biouhlia = ~3 t CO₂ ekvivalent, stabilný 500+ rokov.\n\n**Aplikácia:**\n- **Dávka**: 1–10 t/ha (typicky 3–5 t/ha)\n- **Hĺbka**: 10–30 cm orbou alebo strip-till\n- **Aktivácia**: rozdrtiť + namočiť + zmiešať s kompostom 2–4 týždne pred aplikáciou (aby sa nasýtilo živinami a nebolo hladovým drevným uhlím)\n- **Frekvencia**: jednorázová alebo postupná (1 t/ha/rok)\n\n**Cena 2024:**\n- **Sypané biouhlie (CZ)**: 4 000–8 000 Kč/t\n- **Pelet (jednoduchšia aplikácia)**: 8 000–15 000 Kč/t\n- **Aktivované s mykorízou (premium)**: 15 000–25 000 Kč/t\n- **Investícia na 1 ha**: 12 000–40 000 Kč\n\n**Návratnosť:**\n- **Výnosy**: typicky +5–20 % po 1–3 rokoch\n- **Úspora hnojív**: -10–25 % vďaka CEC\n- **Carbon credits**: 15–25 EUR/t CO₂ × 3 t CO₂/t biouhlia = ~1 200 Kč/t biouhlia dodatočne\n- **Návratnosť**: 5–10 rokov na samotné biouhlie, 3–5 rokov s carbon credity\n\n**Limity:**\n- **Vstupná cena** vysoká, návrat až po rokoch\n- **Riziko aplikácie neaktivovaného uhlia** — „hladové\" biouhlie **VÝRAZNE znižuje výnos prvé 1–2 roky** (vysáva živiny z pôdy)\n- **Meranie efektu** — viditeľné len po 3+ rokoch, predtým ťažko preukázateľné\n- **Pozor na kontaminanty** — biouhlie z odpadovej biomasy môže obsahovať ťažké kovy, dioxíny. Vyžaduje certifikáciu EBC (European Biochar Certificate).\n\nPozri tiež [[organicka-hmota]], [[regenerativni-zemedelstvi]], [[karbonove-zemedelstvi]], [[pH-pudy]], [[vapneni]].",
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
    "longDef": "Mykoríza (gréc. *mykes* + *rhiza* = huba + koreň) je **vzájomne prospešná symbióza medzi koreňmi rastlín a podzemnými hubami**. Vedecky opísaná 1885 (Albert Bernhard Frank), ale v praxi využívaná poľnohospodármi tisíce rokov (bez vedomia mechanizmu — Indiáni v Amazónii).\n\n**Princíp:**\n- **Huba** prerastá hustou sieťou vlákien (*hyf*) do pôdy, mnohonásobne **zväčšuje saciu plochu koreňa** (z ~1 m² na 100+ m²)\n- **Hyfy** sa dotýkajú koreňa rastliny a vytvárajú **arbuskuly** (košíčkové štruktúry) v koreňových bunkách — miesta výmeny\n- **Rastlina** dodáva hube **5–20 % svojej fotosyntézy** (cukry, glukózu)\n- **Huba** za to dodáva rastline **fosfor, dusík, mikroprvky** (najmä Zn, Cu) — oveľa efektívnejšie ako koreň sám\n\n**Typy mykorízy:**\n1. **Arbuskulárna mykoríza (AM)** — najbežnejšia, 80 % rastlín (pšenica, kukurica, sója, ovocné stromy). Huby z divízie *Glomeromycota*.\n2. **Ektomykoríza** — lesné stromy (dub, buk, smrek, borovica). Huby z divízie *Basidiomycota* (hríby, masliaky, rýdziky).\n3. **Erikoidná mykoríza** — vresovité (čučoriedky, brusnice, vres).\n4. **Orchideoidná mykoríza** — orchidey. Symbióza úplne nevyhnutná pre klíčenie.\n\n**Bez mykorízy NERASTÚ:**\n- Vinič (takmer závislý)\n- Olivovník\n- Mnoho ovocných drevín\n- Niektoré orchidey\n\n**Slabo závislé (môžu bez):**\n- Kapustovité (repka, horčica, kapusta) — produkujú glukozinoláty, ktoré mykorízne huby zabíjajú\n- Niektoré jednoročné buriny\n\n**Výhody pre plodinu:**\n- **+30–80 % príjmu P** (fosfor je v pôde často viazaný v nedostupnej forme, hyfy ho rozpúšťajú)\n- **+20–40 % príjmu N** (najmä z organickej hmoty)\n- **+50–100 % príjmu vody** (väčšia sacia plocha)\n- **Tolerancia k suchu**: hyfy hľadajú vodu metre ďaleko\n- **Tolerancia k ťažkým kovom**: mykoríza chráni koreň\n- **Odolnosť k patogénom**: hyfy „blokujú\" cesty koreňovým patogénom (fuzarióza, pythiová hniloba)\n- **Výnos**: +5–30 % v stresových podmienkach\n\n**Čo mykorízu poškodzuje:**\n- **Orba a hlboké spracovanie pôdy** — fyzicky rozseká hyfovú sieť. **No-till** (pozri [[no-till]]) a strip-till (pozri [[strip-till]]) hyfy chránia.\n- **Minerálne hnojivá s vysokým P** — rastlina nepotrebuje hubu, symbióza zaniká.\n- **Fungicídy** v pôde a moridlá — niektoré mykoríznym hubám škodia.\n- **Kapustovité v rotácii** — produkujú glukozinoláty, mykoríza klesá.\n- **Holá pôda** (žiadny kryt) — hyfy odumierajú bez hostiteľa.\n- **Vápnenie na príliš vysoké pH** — niektoré AM huby preferujú kyslé pH.\n\n**Mykorízne preparáty (komerčné inokulanty):**\n- **Symbivit** (CZ) — Symbiom (Lanškroun), 1 000–2 000 Kč/kg\n- **Glomus intraradices** (zahraničné) — RhizoVital\n- **Aplikácia**: namoriť osivo, posypať do riadkov pri siatí, namáčať sadenice\n\n**Cena na hektár:**\n- Inokulácia osiva: 200–500 Kč/ha\n- Aplikácia do riadkov: 800–1 500 Kč/ha\n- ROI 1–3 roky (najmä v pôdach po dlhodobej orbe alebo po vysokých dávkach P)\n\n**Meranie mykorízy:**\n- **Mikroskopia koreňa** (farbenie) — laboratórne\n- **DNA test** (qPCR) — kvantifikácia AM húb v pôde\n- **Nepriame indikátory**: meranie P príjmu, sucho-tolerancia, výnos\n\n**V ČR výskum**: Mendelu Brno, ČZU Praha, ÚEB AV ČR — desiatky publikácií.\n\nPozri tiež [[regenerativni-zemedelstvi]], [[no-till]], [[strip-till]], [[organicka-hmota]], [[biouhel]], [[npk-hnojivo]].",
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
    "longDef": "TMR (anglicky *Total Mixed Ration*, „totálna zmiešaná dávka\") je **moderná kŕmna technológia pre dobytok**, kde sa všetky zložky kŕmnej dávky **zmiešajú do jednotnej homogénnej zmesi** v miešacom voze a kŕmia naraz. Štandardná prax pre produkčné mliečne stáda od 1990s.\n\n**Tradičné vs TMR kŕmenie:**\n| Tradičné | TMR |\n|----------|-----|\n| Komponenty zvlášť (siláž → seno → koncentrát) | Všetko zmiešané v 1 dávke |\n| Krava si vyberá | Nemôže selektovať |\n| Selektívny príjem = problém s acidózou | Vyrovnaná dávka |\n| Veľa práce (3–5× denne) | 1× denne rozdať, 1–2× prihrnúť |\n| Nižšia úžitkovosť | +5–15 % mliečna produkcia |\n\n**Komponenty typickej TMR pre vysokoprodukčnú kravu (40+ l mlieka/deň):**\n- **Kukuricová siláž**: 25–35 kg (sušina 30–35 %)\n- **Trávna siláž / senáž**: 5–10 kg\n- **Lucernová siláž / seno**: 3–6 kg (zdroj bielkovín a štrukturálnej vlákniny)\n- **Koncentrát / kŕmna zmes**: 8–12 kg (obilie, sójový extrahovaný šrot, repkový šrot)\n- **Cukrovarské rezky / pivovarské mláto**: 5–15 kg (vedľajšie produkty)\n- **Minerály + vitamíny**: 0,2–0,5 kg (Ca, P, Mg, Na, mikroprvky)\n- **Voda**: do vedra ad lib (nie v TMR)\n- **Celkovo**: 50–70 kg krmiva/kravu/deň (z toho 22–28 kg sušiny)\n\n**Kľúčové parametre kvality TMR:**\n- **Sušina** (DM — Dry Matter): 45–55 % (viac → kravy nepijú dosť; menej → fermentačné problémy)\n- **NDF** (Neutral Detergent Fiber): 28–34 % — štrukturálna vláknina pre prežúvanie\n- **NDF z objemových krmív** (forage NDF): min. 19 % — pre funkčnosť bachora\n- **NEL** (Net Energy Lactation): 6,8–7,2 MJ/kg DM\n- **CP** (Crude Protein): 16–18 %\n- **RUP** (Rumen Undegradable Protein): 35–40 % CP\n- **Dĺžka častíc** (Penn State Particle Separator):\n  - >19 mm: 5–15 % (štrukturálny efekt)\n  - 8–19 mm: 30–50 %\n  - 4–8 mm: 30–50 %\n  - <4 mm: <20 %\n\n**Miešacie vozy (Mixer Wagons / TMR Wagons):**\n- **Horizontálny šnek** (1, 2, 3 šneky) — Trioliet, Faresin, Strautmann\n- **Vertikálny šnek** (1, 2 šneky) — KUHN Profile, Storti, Sgariboldi — častejšie dnes\n- **Ťahané vs samojazdné** (samojazdné u stád > 500 kusov)\n- **Kapacita**: 8–30 m³ (1× nakŕmenie 50–300 kráv)\n- **Cena**: 800 tis. – 5 mil. Kč\n- **Hodnotí sa**: doba miešania, homogenita, dĺžka rezania (vertikálny šnek vie skracovať dlhú siláž)\n\n**PMR vs TMR vs CMR:**\n- **TMR**: jedna univerzálna dávka pre celé stádo (alebo skupinu)\n- **PMR** (Partial Mixed Ration): základ zmiešaný + individuálne dokrmovanie v dojárni podľa výroby (= koncentrát na základe dát kravy)\n- **CMR** (Component Mixed Ration): tradičné oddelené kŕmenie komponentov (najstarší prístup)\n\n**Skupinové kŕmenie:**\nModerné stádo má **2–4 skupiny dojníc** s rôznou TMR:\n- **Vysokoprodukčné** (>35 l/deň): vysoká energia, vyšší koncentrát\n- **Stredne produkčné** (25–35 l/deň): štandardné\n- **Nízko produkčné** (<25 l/deň, neskorá laktácia): nižšia energia, viac objemových krmív\n- **Suché kravy / zaprahnuté**: len objemové krmivá + minerály (transition diet 3 týždne pred pôrodom)\n\n**Náklady:**\n- **Krmivo**: 70–100 Kč/krava/deň (pre 30 kg sušiny)\n- **Práca**: -50 % oproti tradičnému (1× rozdať miesto 3–5×)\n- **Investícia do techniky**: amortizácia 1,5–3 Kč/krava/deň\n\n**Sledovanie spotreby:**\n- **Váha voza** pred a po kŕmení → spotreba na skupinu/kravu\n- **Refusal (odpad)** — to, čo kravy nezjedia, váži sa a sype na iné kravy alebo do bioplynu. 3–5 % refusal je normálne (= správne sa trafíte do potrieb).\n\n**Softvér pre plánovanie TMR:**\n- **TMR Tracker** (US) — sledovanie kvality\n- **NDS Professional** (IT) — výživové plánovanie\n- **Agralis CCT** (CZ) — dojárne + kŕmenie integrované\n- **CowVision** (NL) — full digital\n\nV ČR: ~80 % stád > 100 dojníc používa TMR (2024 data).\n\nPozri tiež [[dojirna]], [[kukurice-silazni]], [[vojteska]], [[siloky-balik]], [[oteleni]], [[rijnost]].",
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
    "longDef": "Otelenie (ľudovo *telenie*, odborne *partus*, anglicky *calving*) je **pôrod kravy** — vrcholný moment chovateľského cyklu. Štandardná gravidita hovädzieho dobytka trvá **280 ± 5 dní** (9 mesiacov).\n\n**Cyklus produkčnej kravy:**\n- **Deň 0**: otelenie, začiatok laktácie\n- **Deň 60–70**: optimálna inseminácia (zhruba 2. ruja po pôrode, pozri [[rijnost]], [[inseminace]])\n- **Deň 280**: zaprahnutie (zastavenie dojenia 60 dní pred ďalším pôrodom) — obdobie regenerácie mliečnej žľazy\n- **Deň 340**: ďalšie otelenie → cyklus reštartuje\n\n**Pomocné ukazovatele:**\n- **Medziobdobie** (calving interval): 365–400 dní = ideálne (kratšie = lepšia ekonomika)\n- **Servisná perióda** (od otelenia k inseminácii): 60–90 dní = optimálne\n- **Index oplodniteľnosti**: 1,5–2,5 inseminácií na zabreznutie = dobrý\n\n**Príznaky blížiaceho sa otelenia (24–48 h pred):**\n- **Vemeno** sa napĺňa, mliekom presakuje\n- **Vulva** zdurená, panvové väzy uvoľnené\n- **Hlien** z pošvy (žltý / hnedý)\n- **Zmena správania**: krava sa oddeľuje od stáda, nepokoj, obliezanie\n- **Pokles telesnej teploty** o 0,5–1 °C\n\n**Priebeh pôrodu (3 fázy):**\n1. **Otváracia fáza** (2–6 h): cervix sa otvára, krava cíti sťahy, vstáva a ľahá\n2. **Vypudzovacia fáza** (30 min – 4 h): aktívne tlačenie, vidíme „vodný vak\" (allantois), potom teľa prichádza (zvyčajne najprv predné nohy + hlava)\n3. **Placentová fáza** (do 12 h): vypudenie placenty (lôžka). Ak >12 h = **retentio placentae** = veterinárny problém\n\n**Komplikácie (dystocia):**\n- **Zlá poloha teľaťa** (zadná miesto prednej, hlava zvrátená, nohy stočené) — 5–8 % všetkých otelení\n- **Veľký plod** (oversized calf) — Belgické modré, Charolais (býk premetie kravu)\n- **Úzka panva** (malá krava s veľkým býkom)\n- **Slabé kontrakcie** (oslabená krava, hypokalciémia)\n- **Twins** (dvojčatá) — vyššie riziko komplikácií, často vyžaduje veterinára\n\n**Štatistika dystocií:**\n- **Holštýn**: 8–12 % otelení s asistenciou (ľahšie pôrody)\n- **Belgické modré**: 90+ % asistovaných (často cisársky rez!)\n- **Charolais, Limousin**: 15–25 % asistovaných\n- **Aberdeen Angus**: <5 % — „easy calving\"\n\n**Veterinárne zákroky:**\n- **Manuálna asistencia**: vytiahnutie rukami\n- **Fetotómia**: pôrodné laná, reťaze, vyťahovanie remeňom (do 50 kg ťahu)\n- **Cisársky rez**: nutný u úzkych panví alebo zlých polôh — 8 000–25 000 Kč\n- **Embryotómia**: rozdelenie mŕtveho plodu v maternici (zachráni matku)\n\n**Po otelení — kritické prvé týždne:**\n- **Kolostrum** (mlezivo) — prvé mlieko bohaté na protilátky. Teľa MUSÍ dostať min. 4 l do 6 h po pôrode (pasívna imunita).\n- **Hypokalciémia / mliečna horúčka** — 3–10 % kráv, krátko po otelení (Ca → mlieko). Lieči sa infúziou kalcia.\n- **Ketóza** — energetická deficiencia v skorej laktácii, chudnutie, ketolátky v moči. Prevencia: kvalitná TMR ([[tmr]]).\n- **Retentio placentae** (zadržaná lôžka) — riziko zápalu maternice → znížená plodnosť.\n- **Metritída** — zápal maternice, znižuje reprodukciu.\n- **Mastitída** — zápal vemena, časté prvých 30 dní.\n\n**Welfare požiadavky** (CZ normy):\n- **Oddelený pôrodný box** (calving pen) — min. 12 m², čisto, sucho, pokoj\n- **Veterinárny dohľad** počas pôrodu\n- **Teľa a krava spoločne** min. 24 h po pôrode (pre pasívnu imunitu)\n- **Žiadne rutinné hormonálne indukcie pôrodov** (zakázané EÚ 2008)\n\n**Indikátory ekonomiky:**\n- **% živo narodených teliat**: 92–96 % = veľmi dobré\n- **% teliat prežívajúcich do 60 dní**: 90–95 %\n- **Náklady na 1 otelenie**: 1 500–8 000 Kč (asistencia, liek, čas)\n- **Hodnota teľaťa** (býček 50 kg živej hmotnosti): 8 000–15 000 Kč\n- **Hodnota teľaťa** (jalovica pre chov): 25 000–60 000 Kč\n\n**Synchronizácia pôrodov:**\n- **CIDR + PGF₂α** protokol (kontrolovaný cyklus) → narodenie teliat vo „vlnách\"\n- Výhody: organizácia práce, hromadná kúpa/predaj, monitoring\n- Nevýhody: vyššie fixné zaťaženie techniky a personálu počas vrcholov\n\nPozri tiež [[rijnost]], [[inseminace]], [[jalovice]], [[usni-znamka]], [[dojirna]], [[tmr]].",
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
    "longDef": "Ruja (latinsky *estrus*, anglicky *heat*) je **obdobie, kedy samica cicavca je sexuálne receptívna a schopná oplodnenia**. U hovädzieho dobytka (kráv aj jalovíc — pozri [[jalovice]]) trvá 12–24 hodín a opakuje sa v **21-dňovom cykle** (18–24 dní v norme).\n\n**Cyklus kravy (21 dní priemerne):**\n- **Deň 0**: ruja (estrus) — 12–24 h\n- **Deň 1**: ovulácia 24–30 h po začiatku ruje\n- **Deň 5–17**: luteálna fáza (corpus luteum produkuje progesterón) — bránenie ďalšej ruji\n- **Deň 18–19**: luteolýza (rozpad corpus luteum)\n- **Deň 20–21**: nová ruja, cyklus reštartuje\n- **Ak gravidita**: corpus luteum prežíva → žiadna ďalšia ruja 280 dní\n\n**Príznaky ruje:**\n1. **Standing heat** (= kľúčový príznak): krava stojí nehybne, keď na ňu naskakuje iná krava. **Trvá 4–18 h** v rámci celkovej ruje. **Jediný 100% spoľahlivý** príznak.\n2. **Mounting** (naskakovanie na ostatné kravy) — začiatok ruje\n3. **Hlieny**: čistý, lepkavý hlien z vulvy\n4. **Vulva**: začervenaná, mierne zdurená\n5. **Nepokoj**: viac chôdze (až 4× normálna vzdialenosť), bučanie, znížený príjem krmiva\n6. **Pokles úžitkovosti mlieka**: −10 až −30 % na 1 deň\n\n**Tichá ruja (silent heat):**\n30–40 % kráv (najmä v skorom popôrodnom období alebo pri tepelnom strese v lete) **nevykazuje viditeľnú ruju**, ale ovulácia prebieha. **Riziko**: ručne sa nedá detekovať, krava „neoplodnená\" 60+ dní → ekonomická strata 50–100 Kč/deň.\n\n**Detekcia ruje — metódy:**\n\n**1. Vizuálne pozorovanie** (tradičné):\n- 2× denne po 20 min = záchyt **45–55 %** rují\n- 3× denne po 30 min = záchyt **65–75 %** rují\n- Náročné na čas, podlieha ľudskej chybe\n\n**2. Detekčné pomôcky:**\n- **Heat mount detector** (Kamar) — farebný lepiaci čip na sakrum, mení farbu pod tlakom naskakujúcej kravy. **Lacné** (50–100 Kč/kus), spoľahlivosť ~80 %.\n- **Kriedový sprej** na sakrum — nový sprej každý deň, zmytie = príznak ruje\n- **Estrotect patches** — kombinácia tlakovej a farebnej detekcie\n\n**3. Senzory (precision livestock farming):**\n- **Aktivometer** (pedometer) — krokomer na nohe, ruja = +50–100 % krokov\n- **Akcelerometer** na obojku — detekcia správania + záznam fyzickej aktivity\n- **CowManager SensOor** — kvantifikácia ruminácie, príjmu, aktivity\n- **Allflex Heatime** — kombinovaný systém\n- **DeLaval BCS Camera** — kamera + AI detekcia\n- **Cena**: 2 000–5 000 Kč/krava (jednorazová) + 30–80 Kč/mesiac softvér\n- **Spoľahlivosť**: 90–98 % detekcia, menej false positives\n\n**4. Hormonálne meranie (lab):**\n- **Progesterón v mlieku** — denne alebo 3× týždenne. Pokles progesterónu = ruja.\n- **Rapid Milk Progesterone Test** (RMPT) — pásik 30 min, 50 Kč/test\n\n**Inseminácia načasovanie:**\n- **AM/PM pravidlo**: ruja ráno → inseminovať popoludní; ruja večer → inseminovať ráno\n- **Ovulácia** je 24–30 h po začiatku ruje\n- **Spermie** prežívajú 12–24 h v maternici\n- **Vajíčko** prežíva len 6–10 h po ovulácii\n- **Optimálne okno**: 6–18 h od začiatku ruje (12 h pred ovuláciou)\n\n**Synchronizácia ruje** (riadená reprodukcia):\nHormonálne protokoly pre **vyvolanie ruje v skupine naraz** — uľahčí insemináciu, plánovanie pôrodov, monitoring:\n\n- **PGF₂α** (Prostaglandín) — 2 injekcie v 14-dňovom rozstupe. Lacné, 80–85 % synchronizácia.\n- **Ovsynch** — 7-dňový protokol s GnRH + PGF + GnRH + AI. Vyššia spoľahlivosť ~70 %.\n- **CIDR / PRID** (intravaginálny progesterón) + GnRH + PGF — pre kravy s nepravidelnou cyklicitou\n\n**Anestrus** (chýbajúci cyklus):\n- Po pôrode 30–60 dní normálne (= **postpartum anestrus**)\n- Ak > 90 dní → patológia:\n  - **Cyklický anestrus**: ovariálny problém\n  - **Anestrický anestrus**: nedostatok živín, ketóza (pozri [[oteleni]])\n  - **Persistentné žlté teliesko**: zriedkavo, riešenie PGF₂α\n\n**Ekonomický dopad detekcie ruje:**\n- **Detekcia 95 %** (senzory): medzidoba 380 dní, +200 l mlieka/krava/rok = +6 000 Kč\n- **Detekcia 50 %** (manuálne): medzidoba 430 dní, strata 50 dní × 100 Kč/deň = -5 000 Kč/krava/rok\n\nPozri tiež [[inseminace]], [[oteleni]], [[jalovice]], [[dojirna]], [[tmr]].",
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
    "longDef": "Umelá inseminácia (AI, *artificial insemination*) je **metóda reprodukcie hospodárskych zvierat**, pri ktorej sa získané a zmrazené semeno plemenného samca aplikuje do maternice samice **bez priameho párenia**. Štandardná prax v modernom chove hovädzieho dobytka, ošípaných, oviec, kôz.\n\n**História:**\n- **1779** — taliansky fyziológ Lazzaro Spallanzani úspešne inseminoval sučku\n- **1899** — Ruský vedec Ilja Ivanovič Ivanov prvý AI u koní a kráv\n- **1949** — Polge a Smith objavili **kryoprotektant glycerol** pre mrazenie spermatu\n- **1950s** — zavedenie mrazeného semena v USA a EÚ\n- **1960s** — masové rozšírenie v CZ (Veľký kus, Inseminačná stanica Stadlec)\n\n**Princíp:**\n\n**1. Získanie semena od býka:**\n- **Umelá pošva** (artificial vagina) — býk skočí na atrapu (fantóm) alebo cvičnú kravu, semeno sa zachytí do sklenenej nádobky\n- **Elektroejakulácia** — pre problematické býky alebo pri ochorení\n- **Frekvencia**: 2× týždenne, 1–2 ejakuláty na sedenie\n- **Objem 1 ejakulátu**: 5–10 ml, ~1 miliarda spermií\n\n**2. Hodnotenie a zriedenie:**\n- **Mikroskopická kontrola**: motilita (pohyb), morfológia (tvar), koncentrácia\n- **Zriedenie** v riedidle (vaječný žĺtok + glycerol + citrátový pufor)\n- **Rozdelenie do dávok**: typicky 20–30 mil. spermií / dávku (= 1 inseminácia)\n- **Jeden ejakulát → 200–500 dávok**\n\n**3. Mrazenie:**\n- **Pejety (straws)** — slamky 0,25 ml, plastové, farebne kódované podľa býka\n- **Ochlazovanie postupne**: 22 °C → 4 °C → -100 °C → -196 °C (kvapalný dusík)\n- **Skladovanie v dewaru s LN₂** (kvapalný dusík)\n- **Doba skladovateľnosti**: prakticky neobmedzená (50+ rokov preukázateľne)\n\n**4. Inseminácia kravy (poľnohospodár alebo inseminačný technik):**\n- **Termín**: 6–18 h od začiatku ruje (pozri [[rijnost]])\n- **Rozmrazenie pejety**: 35 °C, 45 sec vo vodnom kúpeli\n- **Aplikácia**:\n  - Inseminátor zavádza inseminačnú pištoľ **cez pošvu, cervix, do tela maternice** (asi 20 cm hĺbky)\n  - Jednu ruku má v konečníku — palpuje cervix a vedie pištoľ\n  - Vstrekne celý objem (0,25 ml) do maternice\n- **Dĺžka úkonu**: 30 sec – 2 min na skúseného inseminátora\n\n**Vzdelanie inseminátora v ČR:**\n- **Lekári veterinárnej medicíny** (VŠ) — bez obmedzenia\n- **Zoológovia / agronómovia** — špeciálny kurz „Inseminačný technik\"\n- **Sami poľnohospodári** — kurz „Vlastná inseminácia\" (približne 40 h), potom licencia iba pre vlastné stádo (NIE pre insemináciu cudzích kráv)\n\n**Ekonomika a prax:**\n\n**Cena 1 dávky semena (2024):**\n- **Štandardná genetika**: 200–400 Kč/dávka\n- **Top genetika** (Top 100 USA TPI): 600–1 500 Kč\n- **Sexované semeno** (90 % jaloviek): 1 200–2 500 Kč\n- **Embryotransfer línie**: 5 000–25 000 Kč\n- **Cena za 1 zabreznutie** (1,8 dávky priemerne): 360–2 700 Kč\n\n**Konkurencia — prirodzené párenie (býk v stáde):**\n- **Plusy**: 95 % zabreznutí, žiadne náklady na inseminátora, netreba detekovať ruju\n- **Mínusy**: 1 býk = 1 genetická línia (vs 20+ AI variant), riziko zranenia kravy/býka, zoonózy, geneticky priemerní býci\n\n**V ČR 2024:**\n- ~98 % mliečnych kráv inseminovaných (takmer všetky)\n- ~75 % mäsových kráv inseminovaných (zvyšné prirodzené párenie)\n- **Importované semená**: 60 % US Holstein, 20 % CZ genetika, 20 % EU genetika\n\n**Sexované semeno (sex-sorted):**\n- **Princíp**: spermie X (jalovice) a Y (býčkovia) sortované prietokovou cytometriou (DNA množstvo v hlavičke X je ~3,8 % vyššie)\n- **Spoľahlivosť**: 90 % požadovaného pohlavia\n- **Nižšia motilita** — typicky 30 mil. spermií/dávka (vs 25 mil. konv.)\n- **Cena**: 1 200–2 500 Kč/dávka\n- **Použitie**: ranné jalovice (zaručené jalovice pre chov), top kravy pre chovné línie\n\n**Embryotransfer (ET):**\n- **Vyššia úroveň genetiky**: super-ovulácia top kravy → embryotransfer do recipientných kráv\n- **Princíp:**\n  1. Top krava-donor: hormonálna stimulácia (FSH 4 dni)\n  2. Inseminácia top býkom\n  3. Embryá (7 dní staré) vypláchnuté z maternice\n  4. Presadenie do 5–10 recipientných kráv (synchronizovaných)\n- **Cena**: 50 000–150 000 Kč na 1 cyklus\n- **Top krava** generuje 6–10 teliat ročne namiesto 1 (oproti prirodzenému)\n\nPozri tiež [[rijnost]], [[oteleni]], [[jalovice]], [[usni-znamka]], [[dojirna]].",
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
      "jalovka"
    ],
    "kategorie": "chov",
    "shortDef": "Jalovica je samica hovädzieho dobytka od narodenia do prvého otelenia — typicky 0–24 mesiacov. Kľúčová investícia chovu (12–18 mes. odchovu bez výroby), genetický potenciál novej generácie. Po prvom otelení sa z nej stáva „prvotelka\" (krava).",
    "titulek": "Jalovica — samica dobytka do 1. otelenia, fázy odchovu",
    "longDef": "Jalovica (ľudovo *jalovka*, anglicky *heifer*) je **samica hovädzieho dobytka od narodenia do prvého otelenia**. Po prvom otelení už nie je jalovica ale **krava** (cow), konkrétne „prvotelka\" (= primipara). Doba odchovu jalovice je **kľúčovou investíciou** chovu — 22–24 mesiacov nákladov bez výroby mlieka.\n\n**Fázy odchovu jalovice:**\n\n**1. Teľa (calf) — 0–2 mesiace:**\n- **Hmotnosť narodenia**: 35–45 kg (holštýn), 25–35 kg (jersey), 40–50 kg (charolais)\n- **Kolostrum (mlezivo)**: 4 l do 6 h po pôrode — KRITICKÉ pre pasívnu imunitu (teľa nemá vrodenú imunitu)\n- **Kŕmenie mliekom**: 6–8 l/deň, 2× denne\n- **Stajňa**: jednotlivé boxy (calf hutch) prvé 4–8 týždňov, potom v skupine\n- **Suché krmivá**: zavádzanie jadra a sena od 2. týždňa\n- **Odstav** (weaning): 6–10 týždňov, postupné znižovanie mlieka\n\n**2. Teľa v odstave — 2–6 mesiacov:**\n- **Hmotnosť**: 70–150 kg\n- **Kŕmenie**: jadro (1–2 kg/deň), kvalitné seno ad lib, voda\n- **Rast**: cieľ **0,8 kg/deň** (holštýn)\n- **Sociálna skupina**: 4–10 teliat rovnakej vekovej kategórie\n- **Odrohovanie** (8 týždňov) — anestézia + lokál\n- **Prvé ošetrenie**: parazitológia, vakcinácia (BVD, IBR, salmonelóza)\n\n**3. Mladá jalovica — 6–12 mesiacov:**\n- **Hmotnosť**: 150–300 kg\n- **Kŕmenie**: kvalitná trávna siláž + 1–2 kg jadra\n- **Rast**: cieľ 0,75 kg/deň\n- **Stajňa**: skupinový kotec, 4–6 m²/kus\n- **Pohyb**: pastva v lete (vhodné pre odchov)\n\n**4. Inseminačná jalovica — 12–18 mesiacov:**\n- **Hmotnosť**: 350–450 kg (cieľovo 380–420 kg pre holštýn pred insemináciou)\n- **Pohlavná zrelosť**: ~10–12 mesiacov (puberta), ale nie skôr ako 14 mesiacov sa inseminuje\n- **Optimálna inseminácia**: 15 mesiacov veku, 380 kg hmotnosť\n- **Cieľ otelenia**: 24 mesiacov veku (vs v staršej praxi 28–32 mes.) — **mladšie otelenie = lepšia ekonomika**\n\n**5. Brezivá jalovica (in-calf heifer) — 15–24 mes.:**\n- **Gravidita**: 280 dní (9 mes.)\n- **Kŕmenie**: rovnaké ako mladá jalovica + posledný trimester +20 % energie\n- **Hmotnosť pri otelení**: 550–650 kg (holštýn)\n- **Stajňa**: kravový kotec (= pripravuje sa na laktačnú skupinu)\n\n**Náklady odchovu jalovice (CZ 2024):**\n- **Kŕmenie** (22 mes.): ~22 000 Kč\n- **Veterina, liečivá**: ~3 000 Kč\n- **Inseminácia**: ~500 Kč\n- **Práca, energia, voda**: ~6 000 Kč\n- **Amortizácia stajní**: ~4 000 Kč\n- **Celkovo**: ~35 000 Kč na 1 jalovicu do prvého otelenia\n\n**Hodnota jalovky / jalovice:**\n- **Narodená jalovka** (z top genetiky): 5 000–15 000 Kč (len ako teľa)\n- **Brezivá jalovica** pripravená k oteleniu: **50 000–80 000 Kč**\n- **Top genetická chovná jalovica** (NA-3+, Top 100 BBA): 80 000–250 000 Kč\n- **Embryová jalovica** (z ET): 100 000–500 000 Kč\n\n**Sexované semeno** (pozri [[inseminace]]):\n- **Štandardná inseminácia**: 50 % jalovky / 50 % býčky\n- **Sexed semen**: 90 % jalovky\n- **Strategická aplikácia**: top 25 % kráv stáda dostane sexed semen (= zaručené jalovky pre chov), spodných 25 % dostane mäsovú genetiku (= cross-bred teľa pre mäso, predá sa za 12–20 tis. Kč)\n\n**Welfare a problémy:**\n- **Prvé otelenie**: dystocia (ťažký pôrod) častejšia než u dospelých kráv (15 % vs 8 %)\n- **Odporúčaná panva**: zmerať perineum a panvu rektálne → vylúčiť extrémne úzke\n- **Prvá laktácia**: 75 % výroby dospelej kravy. Plný potenciál až 3. laktácia.\n\n**Genetický pokrok:**\n- Jalovica = **nová generácia** stáda\n- Ak máte top 10 % kráv = odporúčané top semeno + ET → maximálne zlepšenie\n- Spodných 30 % stáda = mäsová genetika (genetická slepá ulička)\n\n**Starnúce stádo:**\n- Priemerný vek kravy v CZ stádach: **3,5 laktácie** (= 5–6 rokov)\n- **Cyklus**: 30–35 % jalovíc ročne vstupuje do stáda ako prvotelky, 30–35 % kráv odchádza (vyradenie alebo predaj)\n\nPozri tiež [[oteleni]], [[rijnost]], [[inseminace]], [[usni-znamka]], [[tmr]], [[dojirna]].",
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
      "ušná značka",
      "ear tag",
      "identifikačná známka",
      "IZR značenie"
    ],
    "kategorie": "chov",
    "shortDef": "Ušná známka je plastová identifikačná visačka aplikovaná do ucha hospodárskeho zvieraťa povinná v EÚ. Hovädzí dobytok, ovce, kozy, ošípané. Obsahuje individuálny kód napojený na IZR (Integrovaný poľnohospodársky register) — bez nej zviera nesmie opustiť farmu ani ísť na bitúnok.",
    "longDef": "Ušná známka (anglicky *ear tag*, oficiálne **identifikačná známka**) je **plastová visačka** s individuálnym kódom, ktorú EÚ legislatíva vyžaduje pre všetky hospodárske zvieratá (hovädzí dobytok, ovce, kozy, ošípané, kone) ako súčasť **registračného systému zvierat**. V ČR sa zvieratá evidujú v **ústrednej evidencii**, ktorú z poverenia Ministerstva poľnohospodárstva ČR vedie ČMSCH.\n\n**Legislatívny rámec:**\n- **EÚ nariadenie 1760/2000** — povinnosť identifikácie hovädzieho dobytka (po BSE kríze)\n- **EÚ 21/2004** — ovce a kozy\n\n**Čo je na ušnej známke:**\n\n**Hovädzí dobytok — dve známky (povinne do 7 dní po pôrode):**\n- **Veľká plastová známka** (žltá, asi 8 × 6 cm) v ľavom uchu\n- **Malá kovová / plastová známka** v pravom uchu (záloha pre prípad straty veľkej)\n- **Obsah**:\n  - **CZ** (kód štátu)\n  - **9-miestne individuálne číslo zvieraťa** (napr. *CZ 123 456 789*)\n  - **Logo zvieraťa / IZR**\n  - **Voliteľne**: meno chovateľa, výstroj farmy, RFID chip (HDX 134,2 kHz)\n\n**Prasatá:**\n- **1 ušná známka** s číslom hospodárstva (nie individuálne)\n- Alebo **tetovanie** (tetovacie vyznačovacie kliešte v ľavom uchu)\n- Pri prevoze do iného hospodárstva: nová známka\n\n**Ovce, kozy:**\n- **2 známky** (ako hovädzí dobytok), jedna z nich obsahuje RFID\n- Pre **elektronickú identifikáciu** v moderných ovčiarňach\n\n**RFID elektronická identifikácia:**\n- **HDX (Half Duplex)** vs **FDX-B (Full Duplex)** — štandardy\n- **Frekvencia**: 134,2 kHz (ISO 11784/11785)\n- **Čítací dosah**: 10–40 cm (statické čítačky), 1–3 m (anténne brány)\n- **Použitie**:\n  - Automatické kŕmenie v dojárni (= iná dávka koncentrátu pre každú kravu)\n  - Váženie v priechode (auto-record do databázy)\n  - Dojacie roboty (Lely, DeLaval)\n  - Zber dát o aktivite (CowManager, Allflex Heatime)\n\n**Aplikácia ušnej známky:**\n- **Špeciálne kliešte** (tagger) — jednorazové alebo opakovane použiteľné (Allflex, Datamars, Caisley)\n- **Miesto aplikácie**: dolná tretina ucha, medzi 2 cievami (vyhneme sa krvácaniu)\n- **Hygiena**: dezinfekcia klieští medzi zvieratami\n- **Bolestnosť**: krátke pichnutie, do 30 sec upokojenie zvieraťa\n\n**Strata známky:**\n- **Hovädzí dobytok**: ~3–8 % ročne (zachytí sa o maštaľ, o ostatné kravy)\n- **Postup**: chovateľ zistí stratu, objedná **náhradnú známku** s rovnakým číslom u ČMSCH\n- **Cena 1 známky** (2024): 25–50 Kč hovädzí dobytok, 8–15 Kč ovce\n- **Ročné náklady na známky** pre stádo 100 kráv: ~1 500–3 000 Kč\n\n**Sankcie za chýbajúce známky:**\n- **Hovädzí dobytok bez známky nesmie opustiť farmu** (= nemôže ísť na bitúnok, na predaj)\n- **Podmienenosť** — od roku 2023 identifikácia a evidencia hovädzieho dobytka, oviec, kôz a ošípaných v ČR nepatrí medzi požiadavky podmienenosti priamych platieb (SZIF, 2025)\n- **Riziko AVI / SBV** epidémie — neidentifikované zviera nemožno trasovať\n\n**IZR — Integrovaný poľnohospodársky register:**\n- **Databáza**: čísla zvierat + história pohybov + farmári + bitúnky\n- **Pohyb zvieraťa** = nahlásiť do ústrednej evidencie do 7 dní (pôvod + cieľ)\n- **Otelenie** = nahlásiť do 7 dní (iné číslo pre teľa + matka)\n- **Úhyn / porážka** = nahlásiť do 7 dní\n- **Online**: Register zvierat na Portáli farmára\n\n**XML hromadné exporty z IZR:**\nProfi farmy používajú **XML export pre hromadné hlásenie** presunov (napr. po odvoze na bitúnok alebo pri presune kráv medzi maštaľami):\n- Generuje sa z management softvéru (CowVision, AgroTronic)\n- Nahrá sa do Registra zvierat na Portáli farmára\n- Validácia XSD schémy, chyby online\n\n**Pasporty (Cattle Passport / Identifikačná karta):**\n- **Hovädzí dobytok**: sprievodný list (v ČR skratka PLS) vydáva ČMSCH ako osoba poverená vedením ústrednej evidencie\n- **Od 1. 4. 2025** sa PLS v ČR odovzdáva len pri premiestnení do iného štátu EÚ alebo pri vývoze; papierové PLS sa po narodení teľaťa už nezasielajú\n- **Tlač PLS**: chovateľ si aktuálny PLS môže kedykoľvek vytlačiť v Registri zvierat na Portáli farmára (Ministerstvo poľnohospodárstva ČR, ČMSCH, 2025)\n\n**Moderný vývoj — biometrika:**\n- **Bolusy** (RFID v bachore, polykané zvieraťom) — Mottainai, Cowtronix\n- **Retinálne skenovanie** — Vision Pro (USA) — bezdotyková ID\n- **Rozpoznávanie tváre** (AI) — DeLaval BCS Camera\n- Tieto technológie zatiaľ nie sú podľa práva EÚ náhradou visačiek, len doplnkom.\n\n**Tetovanie / freeze branding:**\n- Predtým používané (pred EÚ 1760/2000), dnes len u koní a v niektorých USA chovoch\n- **Bolestivé**, dnes v EÚ väčšinou nahradené visačkami.\n\nPozri tiež [[oteleni]], [[inseminace]], [[jalovice]], [[lpis]], [[dojirna]].",
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
    "longDef": "Kŕmna dávka (anglicky *ration*, *diet*) je **denné množstvo a zloženie krmiva** pre hospodárske zviera, vypočítané podľa jeho **produkčného štádia, hmotnosti a klímy**. Cieľom je zabezpečiť **maximálnu úžitkovosť pri ekonomickom kŕmení**.\n\n**Komponenty dávky pre hovädzí dobytok:**\n\n**1. Objemové krmivá (forage) — štrukturálna vláknina:**\n- **Trávna siláž / senáž**: NDF 50–60 %, NEL 5,8–6,4 MJ/kg DM\n- **Kukuricová siláž**: NDF 38–45 %, NEL 6,4–7,0 MJ/kg DM, vysoká energia zo škrobu\n- **Lucernová siláž**: NDF 40–48 %, CP 19–22 %, vysoký Ca\n- **Seno**: NDF 55–65 %, doplnok pre štruktúru, „scratch factor\" pre bachor\n- **Slama**: NDF 75–85 %, nízka energia, pre extenzívne chovy alebo zaprahnuté kravy\n\n**2. Koncentráty (jadro) — energia a bielkoviny:**\n- **Pšenica, jačmeň, kukurica (zrno)**: NEL 8,3–8,7 MJ/kg DM, CP 9–13 %, vysoký škrob\n- **Sójový extrahovaný šrot (SES)**: CP 45–48 %, vyvážený aminokyselinový profil\n- **Repkový extrahovaný šrot (RES)**: CP 36–38 %, lacnejší než SES, o niečo nižšia kvalita\n- **Slnečnicový šrot**: CP 32–38 %, vysoká vláknina\n- **Sušené pivovarské mláto**: CP 24–28 %, NEL 7,0 MJ\n- **DDGS** (suchý destilátorský zvyšok): CP 28–30 %, NEL 7,2 MJ — vedľajší produkt z bioetanolu\n\n**3. Vedľajšie produkty / By-products:**\n- **Cukrovarské rezky**: čerstvé (vlhké) 8 % CP, NEL 6,9 MJ\n- **Pivovarské mláto**: 25 % CP, NEL 6,5 MJ\n- **Sója okara**: 26 % CP, NEL 6,8 MJ\n- **Pomarančové šupky (CR)**: vysoký cukor, NEL 7,5 MJ\n- **Srvátka (whey)**: tekutina, nízka hodnota\n\n**4. Minerály a vitamíny:**\n- **Ca**: 0,8–1,0 % suš. (mlieko obsahuje Ca, vysoká potreba)\n- **P**: 0,4–0,5 % suš.\n- **Mg**: 0,2–0,3 % suš. (prevencia pastevnej tetánie)\n- **Na (soľ)**: 0,2 % suš.\n- **K**: 1,0–1,5 % suš.\n- **Mikroprvky**: Zn 60–80 ppm, Cu 15–20 ppm, Se 0,3 ppm, I 0,8 ppm\n- **Vitamín A**: 100 000 IU/deň\n- **Vitamín D₃**: 40 000 IU/deň\n- **Vitamín E**: 500 mg/deň\n\n**Typové dávky:**\n\n**Vysokoprodukčná dojnica (45+ kg mlieka/deň, 700 kg živej hmoty):**\n- 28 kg kukuricovej siláže\n- 18 kg trávnej siláže\n- 4 kg lucernovej senáže\n- 9 kg jadra (mix obilnín)\n- 3 kg SES\n- 1,5 kg cukrovarské rezky\n- 0,4 kg minerály\n- **Celkovo**: 64 kg krmiva, ~26 kg sušiny\n- **Cena**: ~95 Kč/kus/deň\n\n**Stredne úžitková (30 kg mlieka/deň):**\n- 25 kg kukuricovej siláže\n- 15 kg trávnej siláže\n- 6 kg jadra\n- 2 kg SES\n- **Cena**: ~70 Kč/kus/deň\n\n**Zaprahnuté kravy (suché, 60 dní pred otelením):**\n- 30 kg trávnej siláže alebo senáže\n- 4 kg sena (vláknina pre bachor)\n- 1 kg minerálna zmes „dry cow\"\n- **Cena**: ~30 Kč/kus/deň\n- **Cieľ**: minimálna energia, max štruktúra, prevencia mliečnej horúčky\n\n**Výkrmový býk (intenzívny výkrm, 400–700 kg):**\n- 12 kg kukuricovej siláže\n- 4 kg sena\n- 5 kg jadra\n- 0,5 kg SES\n- 0,2 kg minerály\n- **Cieľ**: 1,2 kg prírastku/deň\n- **Cena**: ~50 Kč/kus/deň\n\n**Teľa v odstave (3 mes.):**\n- 0,8 kg teľacia kŕmna zmes\n- 0,3 kg sena\n- Plný prístup vody\n- **Cena**: ~25 Kč/kus/deň\n\n**Kľúčové parametre:**\n\n**Sušina (DM)**: 22–28 kg/deň pre kravu = 3,5–4,5 % živej hmotnosti\n**Energia (NEL)**:\n- Dojnica (začiatok laktácie): 7,2 MJ/kg DM (vysoká koncentrácia)\n- Dojnica (neskorá laktácia): 6,5 MJ/kg DM\n- Suché kravy: 5,2 MJ/kg DM\n\n**Crude Protein (CP)**:\n- Vysoká úžitkovosť: 17–18 %\n- Stredná: 15–16 %\n- Suché: 12–13 %\n\n**RUP (Rumen Undegradable Protein)**: 35–42 % CP = bielkovina prejde nedegradovaná cez bachor, vstrebá sa v tenkom čreve = vyššia úžitkovosť\n\n**NDF (Neutral Detergent Fiber)**: 30–34 % DM = štrukturálna vláknina, nie príliš veľa (= acidóza), nie príliš málo (= podštrukturálna strava)\n\n**Softvér pre plánovanie:**\n- **NDS Professional** (IT) — svetový štandard\n- **CPM-Dairy** (USA)\n- **Spartan Dairy** (USA)\n- **AMTS Cattle Pro** (USA)\n- **DAIRY-X** (CZ) — domáce riešenie\n- **Agralis CCT** (CZ) — full farm management vrátane kŕmenia\n\n**Sledovanie:**\n- **Spotreba** váženie vstup vs odpad = skutočný príjem\n- **BCS** (Body Condition Score) — 1–5 stupeň výživného stavu\n- **Mliečny profil** — bielkoviny, tuk, urea, somatické bunky → laboratórna analýza kravy mlieko 1× mes.\n- **Bachorové pH** — sonda u problémových stád\n\n**Kŕmenie a ekonomika:**\n- **Krmivo** = **60–70 % nákladov na mlieko**\n- **Optimalizácia dávky** = 1 Kč/kravu/deň úspory × 365 dní × 100 kráv = **36 500 Kč/rok**\n- Konzultácia nutricionistu (1–3 tis. Kč/mes.) sa typicky vyplatí\n\nPozri tiež [[tmr]], [[kukurice-silazni]], [[vojteska]], [[oteleni]], [[rijnost]], [[siloky-balik]].",
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
    "longDef": "Kombajnér (kombajnista, vodič kombajnu) je **hovorové označenie pre vodiča zberacieho kombajnu**. Nie je to oficiálny profesijný titul (formálne „operátor poľnohospodárskych strojov\" alebo „vodič samojazdných strojov\"), ale v poľnohospodárskej komunite plne zavedený výraz.\n\n**Pozícia na farme:**\n- **Sezónna intenzita** — počas žatvy (júl–september) pracuje 12–16 h/deň, často 7 dní v týždni\n- **Mimo sezónu** — obvykle vodič traktora, mechanik, údržbár, alebo má inú prácu na statku\n- **Plat** — v sezóne 50 000–100 000 Kč/mesiac (intenzita), mimo sezónu 35 000–60 000 Kč/mesiac (prepočet na hodiny ~40–60 Kč/h pred zdanením + dohodnuté úkolové bonusy)\n\n**Čo sa od kombajnéra očakáva:**\n- **Technické zručnosti**:\n  - Nastavenie kombajnu pre danú plodinu (mlátička, rošty, ventilátor, žacia lišta výška)\n  - Údržba (mazanie, kontrola olejov, výmena nožov, remeňov)\n  - Diagnostika porúch (displej kombajnu, hydraulika, elektronika)\n  - Spojenie mechanika + vodiča v jednom\n\n- **Agronomický cit**:\n  - Posúdenie správnej vlhkosti obilia (vlhkomer v kombajne vs vlastný pocit)\n  - Optimálna výška rezu (ozim 12–15 cm, sója 5–8 cm, repka 25–35 cm)\n  - Kedy zastaviť (ráno za rosy = mokré obilie, večer = stratené hodiny)\n  - Reakcia na polehlé obilie (znížiť rýchlosť, žacia lišta nižšie)\n\n- **Logistika**:\n  - Koordinácia s odvozom (náves musí byť pri kombajne, keď je zásobník plný)\n  - Komunikácia s vedúcim farmy cez vysielačku\n  - Plánovanie presunov medzi poliami\n\n- **Vytrvalosť**:\n  - Sezóna začne ozimnou pšenicou (polovica júla)\n  - Pokračuje repkou, jačmeňom\n  - Vrcholy v auguste — kukurica, slnečnica\n  - Koniec v septembri — sója, slnečnica\n  - **Celkovo 6–10 týždňov s minimom voľna**\n\n**„Veľký kombajnér\" vs „obyčajný kombajnér\":**\n\nV profesijnej hierarchii veľkých fariem existuje neformálne rozlíšenie:\n- **„Veľký kombajnér\"** = vodič top techniky (Claas Lexion 8900, John Deere S790). Má najväčšiu zodpovednosť, najlepší plat. Často roky skúseností.\n- **„Obyčajný kombajnér\"** = junior pozícia, riadi starší kombajn (Claas Lexion 600 z 2010, Case IH Axial-Flow 7240 starší). Učí sa. Pod dohľadom.\n\n**Žargón:**\n- **„Stuhnúť / vyhorieť / presýtiť mlátičku\"** — prebytok obilia upchá mlátičku, kombajn sa zastaví\n- **„Pľuvnúť\"** — odhodiť nadbytok nemlátiteľnej slamy (napr. kvôli vlhkosti)\n- **„Žiť na špekáčikoch\"** — počas žatvy nemá kombajnér čas pravidelne jesť, žije zo špekáčikov a piva\n- **„Byť v zásobe\"** — kombajn má plný zásobník (8–13 m³), čaká na náves\n- **„Hrať sa na koňa\"** — vyplniť dlhý transport kombajnu po ceste medzi farmami\n- **„Padá zelený\"** (= vlhkostné percentá) — obilie príliš vlhké na mlátenie (>15 %)\n\n**Špecifiká ČR (2024):**\n- **Cudzí kombajnéri** — mnoho fariem si najíma zahraničných vodičov (slovenských, poľských, rumunských) len na sezónu. Ubytovanie na farme.\n- **Sezónne fakty**: cca 3 500 kombajnov v prevádzke, 1 sezónu 2,8 mil. ha obilia, priemerne 800 ha/kombajn/sezónu.\n- **Genderové zastúpenie**: 99 % muži. Posledných 5 rokov pomalý nárast žien-kombajnérok (najmä mladá generácia, agronómky).\n\n**Slangové synonymum** v poľskom poľnohospodárstve: *kombajnista*. V nemecky hovoriacich oblastiach: *Mähdrescherführer*. V anglosaskom svete: *combine operator* (alebo jednoducho „farmer running the combine\").\n\nPozri tiež [[traktorista]], [[kombajn-trida]], [[rotor-kombajn]], [[zne]], [[header]].",
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
    "longDef": "Traktorista je **hovorové označenie pre vodiča poľnohospodárskeho traktora**. Profesia vznikla s nástupom mechanizácie poľnohospodárstva v 20. rokoch 20. storočia a stala sa **kľúčovou pozíciou vidieckej práce** v Československu, neskôr ČSSR a dnešnej ČR.\n\n**Čo traktorista robí:**\n\n**Polné práce** (jar–jeseň):\n- **Orba** (pluh, podmietač, hlboký dlátový kyprič) — pozri [[orba]], [[pluh]]\n- **Sejba** (sejací stroj, sejacia kombinácia) — pozri [[ozim-jarin]]\n- **Hnojenie** (rozmetadlo, postrekovač) — pozri [[npk-hnojivo]]\n- **Postrek** (postrekovač) — pozri [[roundup]]\n- **Zber** (mlátička v kombinácii s kombajnom, lis, baliaci stroj)\n- **Lisovanie slamy a balíkovanie** — pozri [[siloky-balik]]\n- **Kŕmne kalkulácie** — vozenie siláže na siláž\n\n**Zimné práce**:\n- **Odpratávanie snehu** (radlica na traktor)\n- **Štiepkovanie** (drvič vetiev, štiepkovač) — biopalivá\n- **Doprava** (kejda, hnoj, slama) — kontinuálne celý rok\n- **Údržba strojov** — opravy, maľovanie, údržba\n\n**Hierarchia traktoristov:**\n\n**1. „Mladý chlapec pri traktore\"** (junior):\n- Čerstvý zamestnanec, vek 18–25 rokov\n- Začína na **menšom traktore** (Zetor 5xxx, John Deere 6100 atď.)\n- Práca: vyhŕňanie hnoja, jednoduché prevozy, údržba\n- Plat: 25 000–35 000 Kč/mesiac\n\n**2. „Skúsený traktorista\"** (regular):\n- 3–10 rokov skúseností\n- Riadi **stredný traktor** (90–150 koní)\n- Univerzál — orie, seje, postrekuje\n- Plat: 35 000–55 000 Kč/mesiac\n\n**3. „Šéf-traktorista\"** (senior, hlavný traktorista):\n- 10+ rokov, plné skúsenosti\n- **Top stroj farmy** (Fendt 728, JD 7R 250 atď.)\n- Plánuje sezónne práce, učí mladších\n- Často tiež mechanik (vie poradiť s diagnostikou)\n- Plat: 55 000–75 000 Kč/mesiac\n\n**4. „Vedúci mechanizácie\"** (manager):\n- Bývalý senior traktorista alebo agronóm\n- Plánuje nákup, údržbu, poistenie techniky\n- Riadi ostatných traktoristov\n- Plat: 70 000–110 000 Kč/mesiac\n\n**Špecifiká rôznych typov fariem:**\n\n**Veľká agrárna farma** (1 000+ ha):\n- 8–15 traktoristov\n- **Špecializácia** — niekto len postrekuje, niekto len seje, niekto len kejdu vozí\n- Hierarchická organizácia, denné porady\n\n**Stredne veľký statok** (200–500 ha):\n- 2–4 traktoristi\n- **Univerzálni** — každý vie všetko\n- Rodinná atmosféra, neformálna\n\n**Malá rodinná farma** (50–200 ha):\n- Často len majiteľ + 1 traktorista (rodinný príslušník)\n- Multitasking, všetko v 1 osobe\n\n**Technológie a požiadavky 2024:**\n\nModerný traktor (Fendt 728, JD 7R, Massey 8S) má viac displejov než auto:\n- **GPS-RTK** auto-steering (presnosť 2 cm)\n- **Telematika** (dáta v reálnom čase do centrály)\n- **ISOBUS** komunikácia s náradím\n- **Variable rate** aplikácia hnojív podľa máp\n- **Yield monitoring** — kombinácia s dátami z kombajnu\n\nTraktorista 2024 musí vedieť:\n- Klasické remeslo (mechanika, hydraulika)\n- + digitálne zručnosti (čítať displeje, kalibrovať senzory, riešiť chyby softvéru)\n- + agronomické rozhodovanie (kedy prerušiť prácu kvôli počasiu, ako nastaviť aplikačnú dávku)\n\n**„Generačný problém\":**\n- Väčšina traktoristov 50+ rokov (= „stará škola\", manuálny cit)\n- **Mladí sa hlásia málo** — image „špinavej\" práce, sezónna intenzita, vidiecky život\n- Farmy riešia **prílivom zo Slovenska, Poľska, Ukrajiny, Rumunska**\n- **Robotizácia** (autonómny traktor Bednar, Fendt Xaver) je úsmevná, ale do 2030 by mohla nahradiť 30–50 % manuálnych úkonov\n\n**Žargón:**\n- **„Šliapať\"** — orať (od šliapania na pedál)\n- **„Lupnúť\"** — náhle sa zastaviť, zalehnúť (často kvôli poruche)\n- **„Padák\"** — kombajn (od slangového „padnúť do mlátičky\")\n- **„Vážko vážko\"** — v hovorovej reči („pomaly pomaly\")\n- **„Kobylka\"** — slangové pre najmenší traktor vo flotile\n- **„Mašina\"** — ktorýkoľvek traktor všeobecne\n- **„Šediváč\"** — Zetor stará séria (slang z 1970s, dnes už nepoužívané)\n\nPozri tiež [[kombajner]], [[cvt-prevodovka]], [[orba]], [[autonomni-traktor]], [[gps-rtk]].",
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
      "drvič obilnín",
      "kŕmny šrotovník"
    ],
    "kategorie": "slang",
    "shortDef": "Šrotovník je stroj na drvenie obilnín, kukurice a strukovín na hrubý šrot pre kŕmenie dobytka. Historicky poháňaný žentúrom alebo lokomobilou, dnes elektrický. Kľúčové vybavenie každej farmy s vlastnou krmivárskou výrobou.",
    "longDef": "Šrotovník (od slova *šrot* — drvené obilniny) je **stroj na drvenie obilnín, kukurice a strukovín** (sója, hrach, lupina) na **hrubý šrot** určený ako krmivo pre hovädzí dobytok, ošípané, hydinu. Bez šrotovania by zvieratá väčšinu zrna nezužitkovali (nestrávili celé zrná v trakte).\n\n**Princíp činnosti:**\n\n**1. Mlecie (šrotovacie) valce:**\n- Dva **drsné kovové valce** otáčajúce sa proti sebe\n- Medzi nimi vstupuje zrno, **mačká sa a drví**\n- Konečná veľkosť: 1–5 mm úlomky (vs celé zrno 5–10 mm)\n- Reguluje sa **medzerou medzi valcami** + rýchlosťou\n\n**2. Kladivový šrotovník (hammer mill):**\n- **Rotor s kladivkami** (rýchlosť 3 000–4 500 ot/min)\n- Drví zrno o kovové sitá (perforáciu)\n- Výsledok: jemnejší šrot (0,5–3 mm), viac prachu\n- Vhodnejší pre **prasatá** (tradične preferujú jemnejší)\n\n**3. Diskový šrotovník:**\n- Menej časté, pre špeciálne aplikácie\n\n**Šrotované zrniny — prečo:**\n\n**Pre hovädzí dobytok:**\n- Celé pšenice / kukurice **prechádzajú** tráviacim traktom nezužitkované → 30–40 % strata\n- Šrotovanie zvyšuje **stráviteľnosť** o 20–30 %\n- Príliš jemný šrot u hovädzieho dobytka = riziko **acidózy bachoru** (rýchla fermentácia škrobu na kyseliny)\n- **Optimum**: hrubý šrot 2–4 mm = vyvážená stráviteľnosť + štruktúra\n\n**Pre prasatá:**\n- Stráviteľnosť oveľa citlivejšia (jednoduchý žalúdok)\n- Jemnejší šrot (0,8–2 mm) vhodnejší\n- Riziko **žalúdočných vredov** pri príliš jemnom (< 0,5 mm) = vrátiť hrubšiu frakciu\n\n**Pre hydinu (kurčatá, brojleri, sliepky):**\n- Drtina (krátke zrná 1–3 mm) ALEBO peletovanie\n- Jemný prach (< 0,5 mm) hydina nesnáša (lepí sa k zobáku)\n\n**Pre kone:**\n- Šrotované zrniny (ovsený šrot, jačmenný šrot)\n- Hrubá konzistencia = pomalá fermentácia, nižšie kolikové riziká\n\n**História:**\n\n**Žentúrový šrotovník** (1800–1900) — pozri [[zentour]]:\n- Pohon: 1–2 kone chodiace v kruhu\n- Výkon: 50–150 kg šrotu/h\n- V každom väčšom grunte\n\n**Parná lokomobila** (1880–1950):\n- Putovný šrotovník\n- Príjazd 1× mesačne do dediny, sedliaci privážali obilniny na šrotovanie\n- Cena za službu: typicky 5–10 % zo šrotovaného množstva („mlátečná\")\n\n**Elektrický šrotovník** (od 1950):\n- **3–7,5 kW** motor + valcová / kladivková mechanika\n- **Domáci**: 800–3 000 kg šrotu/h\n- **Pre veľké farmy**: 5–20 t/h\n\n**Súčasné typy:**\n\n**Stacionárny šrotovník** (na farme):\n- **Príkon**: 5–22 kW (~25–35 tis. Kč pre malý)\n- **Veľký pre farmu**: 30–75 kW (~80–250 tis. Kč)\n- **Top značky CZ**: PS-Strojírny (Letohrad), Sano (Lichnov), DAS (Pardubice)\n- **Top značky EU**: Skiold (DK), Renkum (NL), Romill (CZ-Brno)\n\n**Mobilný šrotovník** (na traktore):\n- **Príkon**: z PTO traktora, 30–80 kW\n- **Výkon**: 1–5 t/h\n- **Použitie**: putovný šrotovník, mlecie kombajny (kombajn šrotuje za jazdy)\n- **Cena**: 80 000–300 000 Kč\n\n**Mlecí kombajn** (modernejší trend):\n- **Zberá + šrotuje + ukladá** vlhké zrno do vakov pre siláž\n- **Vlhké šrotovanie CCM** (Corn-Cob-Mix) — kukuričné zrno + drvený klas, uložené do vaku\n- Trend pre **mliečne farmy** (nahradenie nakupovaného koncentrátu)\n\n**Šrot a krmivá:**\n\n**Hodnotenie kvality šrotu:**\n- **Granulometria** (veľkosť častíc) — Penn State Particle Separator\n- **Vlhkosť** (max 14 % pre skladovanie, 30+ % pre vlhké šrotovanie CCM)\n- **Teplota** po šrotovaní (vyššia u rýchlych kladivkových — pozor na poškodenie vitamínov)\n\n**Typický šrot na farme:**\n- **Pšeničný šrot**: 50–60 % obilnej zložky kŕmnej dávky\n- **Jačmenný šrot**: substitúcia pšenice, lacnejší\n- **Kukuricový šrot**: vysoká energia, nižšie bielkoviny\n- **Sója šrot**: vysoké CP, dovážaný alebo vlastná výroba\n- **Hrachový šrot**: domáca proteínová alternatíva SES\n\n**Energetika a ekonomika:**\n\n**Spotreba elektriny**:\n- Valcový šrotovník: 6–12 kWh/t šrotu\n- Kladivkový: 10–18 kWh/t šrotu\n- **Cena** elektriny: 6 Kč/kWh × 10 kWh = **60 Kč/t šrotu**\n\n**Vlastné šrotovanie vs nakupované krmivo**:\n- **Šrot z vlastnej úrody**: 4 500 Kč/t pšenice + 60 Kč šrotovania = **4 560 Kč/t šrotu**\n- **Nakupovaný hotový koncentrát**: 8 000–12 000 Kč/t\n- **Úspora 3 500–7 500 Kč/t** → veľké farmy si šrotujú takmer všetko\n\n**Slangové a hovorové použitie:**\n- **„Šrotovať\"** — okrem obilnín znamená ľudovo „biť\" (slangovo), „rozprávať zbytočne rýchlo\"\n- **„Šrotovník\"** — slangovo pre „pomalý / zastaraný počítač\" („tento laptop je šrotovník\")\n- **„Šrot\"** — používa sa ako technicky (krmivo), tak v slangu („poď, dáme si šrot\" = dáme si pivo, slangovo staré)\n\nPozri tiež [[zentour]], [[krmne-davky]], [[kukurice-silazni]], [[grunt]], [[tmr]].",
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
      "zemčata",
      "erteple",
      "kobzole",
      "zemiak"
    ],
    "kategorie": "slang",
    "shortDef": "Zemák je hovorové / dialektické označenie pre zemiak (Solanum tuberosum). V češtine existujú regionálne varianty: zemák (severná Morava, Sliezsko), erteple (jihlavsko, slang), kobzole (Sliezsko, poľské vplyvy), brambor (štandard CZ).",
    "longDef": "Zemák (ľudovo *zemčata*, *erteple*, *kobzole*) je **hovorové a dialektické označenie pre zemiak** — *Solanum tuberosum* — jednoročná hľuznatá rastlina z čeľade ľuľkovitých. V češtine má zemiak (*brambor*) desiatky regionálnych synonym, čo svedčí o **historickom význame plodiny** v rôznych českých regiónoch.\n\n**Regionálne varianty:**\n\n- **Brambor / brambora** — štandard ČR, juhočeské nárečie. „Z Bramburska\" = z nemeckého Brandenburska, odkiaľ sa zemiaky šírili do Čiech.\n- **Zemák** — Sliezsko, severná Morava. Z „zeme\" + zdrobneniny.\n- **Erteple** — jihlavsko, juhovýchodná Morava. Z nemeckého *Erdäpfel* („zemské jablká\").\n- **Kobzole** — Sliezsko, severovýchod (poľské *kartofle*).\n- **Zemčata** — Vysočina, českomoravská vrchovina.\n- **Krumpáč** (zastaralé) — Slovácko, juhovýchodná Morava.\n- **Krumple** — Valašsko.\n- **Grumpera** — Chodsko.\n- **Šemerlák** — okolie Telče.\n- **Knedl** — slang vo veľkých mestách (zo zemiakovej knedle).\n\n**História v českých krajinách:**\n\n**1700s — príchod zemiaka:**\n- Zemiaky prichádzajú do Čiech cez Viedeň (Mária Terézia) a Sasko (Sedemročná vojna 1756–1763)\n- Prvé pestovanie v **kláštorných záhradách** a u šľachty\n- Sedliaci dlho odolávali — báli sa „čertovej plodiny\" (jed ľuľkovitých, zelené hľuzy obsahujú solanín)\n\n**1770–1772 — Veľký hladomor:**\n- Tradičné obilie zlyhalo opakovane\n- **Mária Terézia nariadila povinné pestovanie zemiakov** (1771)\n- Zemiak zachránil desiatky tisíc roľníkov od smrti\n- Odvtedy trvalo zakotvený v českej kuchyni\n\n**1800–1860 — éra rozmachu:**\n- Zemiaky sa stávajú **základnou stravou vidieka** (chudobných)\n- „Zemiak s mliekom\" — typické jedlo\n- Vznik **zemiakárskych oblastí** (Vysočina, Krkonoše, Beskydy)\n\n**1860+ — chov prasiat a liehovary:**\n- Zemiaky pre **kŕmenie prasiat** (vykrmený zemiak)\n- **Liehovary** spracovávajú zemiakový škrob na etanol (vodka, liek, chémia)\n- Vznik **zemiakárskej tradície** (Vysočina, Pardubicko)\n\n**Pestovanie v ČR (2024):**\n\n**Plocha**: ~24 000 ha (klesajúci trend, z 100 000 ha v 90. rokoch)\n**Výnosy**: 26–35 t/ha (rané), 35–55 t/ha (neskoré priemyselné)\n**Produkcia**: ~700 000 t/rok\n\n**Hlavné kategórie**:\n1. **Konzumné zemiaky** (rané, červené, modré, žlté) — supermarkety\n2. **Sadbové zemiaky** (certifikované osivo pre ďalšiu generáciu) — vyššia cena\n3. **Priemyselné zemiaky** (liehovary, škrobárne, hranolkárne) — kontrakt\n4. **Kŕmne zemiaky** (pre ošípané, dnes menej časté)\n\n**Kľúčové oblasti pestovania**:\n- **Vysočina** (Jihlavsko, Pelhřimovsko) — vyššia nadmorská výška, vyrovnaný výnos\n- **Polabská nížina** (Polabí, Hradecko) — rané odrody\n- **Šumavské podhorie** — kvalitná sadba\n- **Chod / Plzeňsko** — historicky zemiakár\n\n**Top odrody CZ**:\n- **Adéla** (rané)\n- **Filea** (rané, červená)\n- **Magda** (stredne neskorá, žltá)\n- **Saturna** (priemyselná, výnosy 50+ t/ha)\n- **Marabel** (neskorá, konzumná, vysoká kvalita)\n- **Soraya** (sadba)\n\n**Agrotechnika:**\n- **Výsadba** sadby (10–25 cm hĺbka, rozstup 75 × 30 cm), marec–máj\n- **Hnojenie**: 80–120 kg N/ha + 60–80 P + 120–160 K\n- **Postreky**: proti plesniam (oomyceta), mandelinke (Colorado beetle)\n- **Zber**: zberač zemiakov (vykopávač) — september–október\n- **Skladovanie**: chladné, suché 4–8 °C, vlhkosť 90 %\n\n**Choroby a škodcovia**:\n- **Pleseň zemiaková** (Phytophthora infestans) — historicky spôsobila Veľký írsky hladomor 1845\n- **Mandelinka zemiaková** — invazívna z USA (1922 prvý výskyt v ČR)\n- **Háďatko zemiakové** — karanténny škodlivý činiteľ\n\n**Ekonomika 2024**:\n- **Konzumná cena (supermarket)**: 15–40 Kč/kg\n- **Cena od pestovateľa**: 5–12 Kč/kg\n- **Marža obchodu**: 200–400 % (medzi pestovateľom a regálom)\n- **Priemyselná cena**: 3–6 Kč/kg (liehovary, škrob)\n\n**Klesajúca plocha**:\n- 1990: 100 000 ha\n- 2010: 30 000 ha\n- 2024: 24 000 ha\n- **Dôvody**: import (NL, DE, FR, PL), lacná dovozová cena, vysoké náklady na techniku, choroby (pleseň)\n\n**Slangová a kultúrna rola:**\n\n- **„Zemáky\"** — slangové pre „jednoduchá strava\" („mám doma len zemáky a mlieko\")\n- **„Zemiak\"** — pejoratívne pre neohebnú osobu („je z neho zemiak\", „zemiakové telo\")\n- **„Zemiakový šalát\"** — symbol Vianoc v českej kuchyni\n- **„Zemiaková polievka\"** — chudá roľnícka strava povýšená na národný pokrm\n- **„Hodený zemiak\"** — v UK slang pre nevychovanú novinársku otázku (= „hot potato\")\n\nPozri tiež [[ozim-jarin]], [[osevni-postup]], [[npk-hnojivo]], [[roundup]], [[plisen-bramborova]], [[mandelinka-bramborova]].",
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
    "longDef": "Pleseň zemiaková (lat. *Phytophthora infestans*, anglicky *late blight*, „neskorá pleseň\") je **oomycéta** (nie pravá huba — patrí medzi riasovce / Stramenopila) spôsobujúca najdôležitejšiu chorobu **zemiakov** a **rajčín**. Historicky spôsobila **Veľký írsky hladomor** 1845–1849 (1 milión mŕtvych, 1 milión emigrantov).\n\n**História:**\n- **1840s** — patogén prvýkrát pozorovaný v Belgicku, Holandsku\n- **1845–1849** — Írsky hladomor. Zemiaky tvorili 80 % stravy chudobných írskych roľníkov. Patogén zničil úrodu 3 roky po sebe.\n- **1882** — Francúz Pierre Marie Alexis Millardet objavuje **bordeauxskú zmes** (CuSO₄ + Ca(OH)₂) v Médocu — náhodou, ako prevenciu proti zlodejom viniča. Prvý historický fungicíd.\n- **20. storočie** — postupný vývoj organických fungicídov: kontaktných (mancozeb) aj systémových (metalaxyl, cymoxanil)\n- **2000s** — agresívny A2 mating type kmeň z Mexika invázny do EÚ — patogén sexuálne reprodukuje → oospóry v pôde → trvácnosť\n\n**Životný cyklus:**\n1. **Prezimovanie**: v hľuzách zemiakov (semenách), kompostoch, mŕtvych rastlinách\n2. **Sporulácia**: ráno za rosy (vlhko + 10–25 °C) → sporangia\n3. **Šírenie**: vzduch (sporangia letí desiatky km), voda (zoospóry plávajú v rose)\n4. **Infekcia**: penetrácia stomatami alebo cez ranky, prejavy 3–5 dní po infekcii\n5. **Sekundárny cyklus**: za 4–7 dní ďalšia sporulácia → epidémia\n\n**Symptómy:**\n- **Listy**: tmavé hnedo-čierne nekrózy, často s **bielym plesňovitým okrajom** na rube (sporulácia)\n- **Stonky**: tmavé škvrny, neskôr kruhové rozkladné lézie\n- **Hľuzy**: hnedé škvrny na povrchu → vnútri hnedá/červená hniloba (často sekundárne bakteriálne mokré)\n- **Rajčiny**: rovnaké — hnedé škvrny, sporulácia, hniloba plodov\n\n**Riziko a varovanie:**\n- **Vlhko + teplo** (RH > 90 %, T 10–25 °C) → vysoké riziko\n- **Modelovacie systémy** (Smith Period, NegFry, BlightCAST) — predpoveď infekcie 1-3 dni dopredu\n- **CZ varovanie**: Štátna rastlinolekárska správa (ÚKZÚZ) + komerčné (BIRTeam, Bayer FieldView)\n\n**Boj — fungicídy:**\n\n**Preventívne (kontaktné)**:\n- **Mancozeb** (Dithane, Penncozeb) — predtým najpoužívanejší kontaktný fungicíd, **v EÚ už nie je schválený** (vykonávacie nariadenie (EÚ) 2020/2087, použitie skončilo 4. 1. 2022)\n- **Cymoxanil** — veľmi efektívny, krátka účinnosť (2–3 dni)\n- **Meď** (CuSO₄, Cu hydroxid) — bio aj konvenčné. **Limit 28 kg Cu/ha za 7 rokov** (v priemere 4 kg/ha/rok) v EÚ\n- **Folpet** — kontaktná náhrada za mancozeb\n\n**Systémové (lokálne systémové)**:\n- **Metalaxyl, Metalaxyl-M** (Ridomil) — fenylamid, veľmi efektívny. Riziko rezistencie (problém od 1990s)\n- **Mandipropamid** (Revus) — CAA fungicíd, špička 2020s\n- **Cymoxanil** — kuratívny účinok krátko po infekcii, vždy v kombinácii s inou účinnou látkou\n- **Fluazinam** (Shirlan) — preventívny, dlhá perzistencia\n- **Pyrimethanil** — komplikované použitie\n\n**Postrekový kalendár** (intenzívne zemiaky, 2024 EÚ):\n- **Klíčiace**: žiadny postrek\n- **5–10 cm porast**: 1. prevencia (kontaktný fungicíd, napr. fluazinam alebo meď)\n- **Pred uzatváraním riadkov**: 2. (cymoxanil/metalaxyl)\n- **Kvet**: 3.–4. postrek (mandipropamid)\n- **Tvorba hľúz**: 5.–7. postrek (preventívny každých 7–10 dní)\n- **Pred zberom**: ničenie vňate (pozri [[desikace]]) — mechanicky alebo PPO desikantom; diquat (Reglone) už v EÚ nie je schválený\n- **Celkovo**: 7–10 postrekov/sezónu, **náklady 4 000–7 000 Kč/ha**\n\n**Rezistentné odrody:**\n- **Sárka, Adéla, Marabel** — stredne tolerantné\n- **Sárpo Mira** — vysoká rezistencia, vhodná pre biofarmy\n- **Bionica, Toluca** — moderné rezistentné hybridy\n- **Rezistencia nie je 100 %** — aj tolerantné odrody potrebujú 3–5 postrekov v rizikovej sezóne\n\n**Bio prístup:**\n- Iba **meď** (Cu — pozri vyššie, 4 kg/ha/rok limit)\n- **Bordeauxská zmes** (klasická, lacná, vlastnoručne miešaná)\n- **Bio-stimulanty** (silikát draselný, výťažky z pŕhľavy) — marginálny efekt\n- **Rezistentné odrody** + krátky vegetačný cyklus (zber skoro)\n\n**Po infekcii:**\n- **Nie je liečba** — preventívne fungicídy sa aplikujú PRED infekciou\n- **Po prvých symptómoch** → lokálne „spaľovanie\" (zničiť infikované rastliny mechanicky/chemicky)\n- **Zberané zemiaky** → triediť (žiadne napadnuté do skladu, riziko hniloby celého skladu)\n\n**V ČR 2024**: straty z plesne zemiakovej ~5–15 % úrody aj napriek intenzívnemu postreku. Bez postrekov 50–100 % strata.\n\nPozri tiež [[roundup]], [[fungicidy]], [[zemak]], [[ozim-jarin]], [[osevni-postup]], [[mez]].",
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
    "longDef": "Fuzarióza klasov (anglicky *Fusarium Head Blight*, FHB) je **hubová choroba obilia** spôsobená komplexom druhov rodu *Fusarium* (*F. graminearum, F. culmorum, F. avenaceum, F. poae*). Napáda predovšetkým **pšenicu, jačmeň, raž, ovos, kukuricu**. Kľúčový problém: **mykotoxíny**.\n\n**Druhy a mykotoxíny:**\n\n| Druh | Hlavný mykotoxín | Účinok |\n|------|------------------|---------|\n| **F. graminearum** | DON (deoxynivalenol) | Imunosupresívny, gastrointestinálny |\n| **F. graminearum** | ZEA (zearalenon) | Estrogénny (problém u prasiat) |\n| **F. culmorum** | DON, ZEA, NIV | Podobné |\n| **F. poae** | NIV (nivalenol), T-2 | Vysoko toxický (T-2 = bojový agent) |\n| **F. avenaceum** | Moniliformin, ENN | Kardiotoxický |\n| **F. verticillioides** (kukurica) | Fumonisíny | Karcinogénny, neurologický |\n\n**EÚ limity mykotoxínov** (Nariadenie 1881/2006 + 2023 revízia):\n- **DON**: pšenica/jačmeň pre konzum 1,25 mg/kg, krmivo 8 mg/kg\n- **ZEA**: pšenica 100 µg/kg, kukurica 350 µg/kg\n- **Fumonisíny**: kukurica 4 000 µg/kg\n- **Aflatoxíny** (iný rod *Aspergillus*): 4 µg/kg max\n\n**Symptómy:**\n- **Klásky belavé** (predčasne dozrievajú) — kontrast so zdravými zelenými\n- **Ružovo-oranžová sporulácia** na klase pri vlhku\n- **Zrno scvrknuté, „ružovkasté\"** (\"tombstone kernels\", *piepsy*)\n- **Pozberový test**: laboratórium kvantifikuje DON na ELISA alebo HPLC\n\n**Rizikové faktory:**\n- **Predplodina kukurica** — *F. graminearum* prezimuje v kukuričných stonkách\n- **No-till** + reziduálna slama kukurice = vysoké riziko\n- **Vlhko + teplo** (15–25 °C, dážď 24–48 h) **počas kvitnutia pšenice** (BBCH 61–69, polovica mája až polovica júna)\n- **Husté porasty** (neznižuje aeráciu klasov)\n\n**Boj — chemický:**\n\n**Kľúčový moment — postrek v kvitnutí (BBCH 63–67)**:\n- **Triazoly**: prothiokonazol (Prosaro, Caramba), tebuconazol, metconazol\n- **SDHI** (Inatreq): fluxapyroxad, bixafen — moderná generácia\n- **Strobiluríny**: azoxystrobin (neodporúča sa pre FHB — pri niektorých druhoch F. zvyšuje DON!)\n- **Kombinácia** SDHI + triazol = strieborný štandard 2020s\n- **Aplikácia**: 200–400 l vody/ha, jemné rozprášenie, **timing kritický** (kvitnúce klasy)\n\n**Efektivita postreku:**\n- **Optimálne načasovanie**: -40 % DON, -50 % FHB\n- **Neskoro**: +10 % efekt na DON\n- **Skoro (pred kvitnutím)**: 0 efekt\n- **Nutné merať** vegetačné štádium, nie dátum\n\n**Boj — agrotechnický:**\n- **Predplodina**: po kukurici **NESEJTE pšenicu**. Lepšie: repka → pšenica alebo strukovina → pšenica.\n- **Spracovanie pôdy**: orba zaorá *Fusarium* rezíduá, znižuje inokulum o 50–80 %. **No-till + kukurica = najhoršia kombinácia**.\n- **Rezistentné odrody**: čiastočná tolerancia (nikdy 100%). Sumai 3 (CN) = donor génu Fhb1, používaný v EÚ šľachtení.\n- **Hustota porastu**: 350–450 klasov/m² (vyššia = vyššie riziko)\n- **Hnojenie**: vysoký N nezvyšuje FHB výrazne, ale predlžuje kvitnutie = väčšie okno infekcie\n- **Odolnosť**: BBCH model + meteodata + poveternostná stanica = pre-warning systém\n\n**Zber a pozberová úprava:**\n- **Časné kombajnovanie** napadnutého porastu — menej času pre ďalšiu sporuláciu\n- **Vyššia vlhkosť pri zbere** (15–20 %) → ihneď sušiť pod 13 %\n- **Čistenie** — *fuzariové zrno je ľahšie*, možno ho oddeliť air-screen čističkou (strata 5–15 % hmotnosti, ale DON klesne o 50–80 %)\n- **Sklad** za sucha a chladu (< 14 % vlhkosť, < 15 °C) — *Fusarium* ďalej nerastie\n\n**Ekonomický dopad:**\n- **Cena kontaminovaného obilia**: výkup ho prijme s 30–50 % zrážkou alebo odmietne (kŕmné = nižšia cena, nesplnenie mlynárskych limitov)\n- **Náklady na postrek FHB**: 800–1 500 Kč/ha (1 aplikácia)\n- **Strata výnosu**: 10–30 % pri napadnutí\n- **CZ 2024**: cca 20–30 % zberu pšenice vo „FHB riziku\" v niektorých rokoch\n\n**Ľudské zdravie:**\n- **Akútna otrava** vysokými dávkami DON: nevoľnosť, vracanie, horkosť v ústach\n- **Chronická expozícia**: imunosupresia, rastová retardácia u detí\n- **ZEA**: hormonálna disrupcia (estrogénna), problém pre prasiatka\n\n**Krmivá pre zvieratá:**\n- **Prasiatka** veľmi citlivé (limit DON 0,9 mg/kg krmiva)\n- **Hovädzí dobytok** menej citlivý (5 mg DON/kg krmiva)\n- **Hydina** stredne citlivá (2 mg DON/kg)\n- **Mykotoxínové viazače** (bentonity, glukomanánové steny kvasiniek) — kompenzácia v krmive pre viazanie toxínov v tráviacom trakte\n\n**V ČR výskum**: VURV Praha-Ruzyně, Mendelu Brno — selekcia rezistentných odrôd, predikčné modely.\n\nPozri tiež [[fungicidy]], [[ozim-jarin]], [[osevni-postup]], [[no-till]], [[kukurice-silazni]], [[hektolitr]].",
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
    "shortDef": "Septorióza (Zymoseptoria tritici, predtým Septoria tritici) je najvýznamnejšia hubová choroba listov pšenice v Európe. Znižuje výnos o 30–50 % bez postreku. Kľúčový dôvod fungicídnych postrekov na pšenicu v Európe.",
    "longDef": "Septorióza pšenice (*Zymoseptoria tritici*, predtým *Septoria tritici* alebo *Mycosphaerella graminicola*, anglicky *Septoria tritici blotch*, STB) je **dominantná listová choroba pšenice v západnej a strednej Európe**. V ČR je hlavným dôvodom ošetrenia pšenice fungicídmi — bez postreku 30–50 % strata výnosu.\n\n**Životný cyklus:**\n1. **Prezimovanie**: na rastlinných zvyškoch pšenice (slama) alebo na ozime na jeseň\n2. **Šírenie na jeseň** (ozim): dážď rozširuje **pyknospory** na listy. Mierne teploty + dážď = ideálne.\n3. **Latentná fáza**: 14–28 dní (mierna zima → infekcia neviditeľná)\n4. **Symptómy na jar**: žltkasté škvrny s malými čiernymi bodkami (pyknidy)\n5. **Vertikálne šírenie**: spóry letia dažďom nahor, postupne napadá vyššie listy (flag leaf — vlajkový list je najcennejší, dodáva 60 % asimilátov zrna)\n6. **Sekundárny cyklus**: nový dážď = nové sporulácie = nová infekcia\n\n**Symptómy:**\n- **Žlté → hnedé** nepravidelné škvrny na listoch\n- **Charakteristické**: drobné **čierne pyknidy** v ploche lézie (veľa bodiek na 1 cm²)\n- **Postup zdola nahor**: dolné listy ovplyvnené najskôr, postupne do vrcholu\n- **Najviac škodí napadnutie vlajkového listu** (F0) a F-1 — 60 % výnosu závisí od nich\n\n**Rizikové faktory:**\n- **Časné siatie ozimu** (pred 15. septembrom) → väčšia infekcia na jeseň\n- **Vlhká jar** (dážď > 5 mm v rozmedzí 10 dní) → každý dážď = nová infekcia\n- **Husté porasty** → mikroklíma = vlhko\n- **Vysoké N hnojenie** → bujný porast\n- **Predplodina pšenica** → inokulum prezimuje v slame (preto **NESIAŤ pšenicu po pšenici**)\n- **No-till + slama na povrchu** → zachované inokulum\n\n**Boj — fungicídy:**\n\n**Kľúčové ošetrenie**:\n1. **T0 (BBCH 30–32, jar)** — ak silné napadnutie z jesene. Lacný základ.\n2. **T1 (BBCH 32–37)** — ošetrenie krycích listov. Triazol + SDHI.\n3. **T2 (BBCH 39–49, flag leaf)** — **NAJCENNEJŠIE ošetrenie**. Vlajkový list musí ostať zelený.\n4. **T3 (BBCH 60–69, kvitnutie)** — fuzarióza + dozrievanie. Triazol alebo strobilurín.\n\n**Aktívne látky:**\n- **Triazoly (DMI)**: tebuconazol, prothiokonazol, metconazol — hlavná trieda 30 rokov, **rastúca rezistencia**\n- **SDHI**: fluxapyroxad, bixafen, benzovindiflupyr (Solatenol) — top performery 2020s. Riziko rezistencie (mierne, doteraz zvládnuteľné).\n- **Strobiluríny (QoI)**: azoxystrobin (Amistar), pyraclostrobin — **dnes prakticky neúčinné na septoriózu** kvôli rezistencii (mutácia G143A v cytochróme b). Stále sa používajú pre iné choroby.\n- **Inatreq active** (fenpicoxamid) — nová trieda, 2021+ na trhu. Zatiaľ nízka rezistencia.\n- **Mefentrifluconazole** (Revysol) — nová DMI z BASF s lepšou aktivitou na rezistentné izoláty\n\n**Antirezistentná stratégia:**\n- **Mix účinných látok** vždy (triazol + SDHI + strobilurín)\n- **Maximálne 1× na sezónu** rovnakú účinnú látku\n- **Kombinácia s biológiou** (bacillus, Trichoderma — komerčne tlmené pre veľké farmy)\n\n**Náklady postrekov:**\n- **T1**: 600–1 200 Kč/ha\n- **T2**: 800–1 500 Kč/ha (flag leaf — kvalitný mix)\n- **T3**: 700–1 200 Kč/ha\n- **Celkom za sezónu**: 2 100–3 900 Kč/ha pre pšenicu\n\n**Návratnosť:**\n- Postrek T2 ušetrí 1–2 t/ha = 5 000–10 000 Kč/ha → návratnosť 4–6×\n- T1 + T3 menej kľúčové, ale zachovávajú rezervu T2\n\n**Agrotechnika (anti-septorióza bez chémie):**\n- **Odolné odrody**: Bohemia, RGT Sacramento, Arnaud (CZ trh) — čiastočná tolerancia\n- **Neskoršie siatie** ozimu (po 30. septembri) → menšia jesenná infekcia\n- **Znížená hustota porastu** (350 klasov/m² namiesto 500) → lepšia aerácia\n- **Znížené N hnojenie** + split aplikácia (rozdeliť dávku 2-3× počas sezóny)\n- **Predplodina iná než pšenica** — repka, strukovina, kukurica\n- **Orba** zaorá inokulum (vs no-till)\n\n**Klimatická zmena:**\n- Teplejšie zimy = viac prezimovaného inokula\n- Vlhkejšia jar = viac cyklov\n- **Posun areálu** — septorióza sa posúva na sever Európy (SE, DK, UK posilnenie 2020s)\n\n**V ČR výskum**: VURV, Mendelu — selekcia rezistentných línií, sledovanie citlivosti na fungicídy.\n\nPozri tiež [[fuzarioza]], [[rzi]], [[fungicidy]], [[ozim-jarin]], [[osevni-postup]], [[no-till]].",
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
    "term": "Hrdze obilnín",
    "alias": [
      "Puccinia",
      "rust",
      "hrdza pšeničná",
      "hrdza jačmenná",
      "hrdze"
    ],
    "kategorie": "ochrana",
    "shortDef": "Hrdze sú skupina hubových chorôb obilnín spôsobená rodom Puccinia. Tri kľúčové: hrdza plevová (P. striiformis), hrdza listová (P. recondita), hrdza stebelná (P. graminis). Historicky devastujúce choroby, dnes zvládnuté fungicídmi a rezistenciou.",
    "longDef": "Hrdze obilnín (anglicky *rusts*) sú skupina **biotrofických hubových chorôb**, ktoré spôsobujú huby rodu **Puccinia**. Tri kľúčové druhy pre českú pšenicu a jačmeň:\n\n1. **Hrdza plevová (žltá)** — *Puccinia striiformis* (PST) — agresívna, chladná/vlhká\n2. **Hrdza listová (hnedá)** — *Puccinia recondita / triticina* (PT) — teplá/suchá\n3. **Hrdza stebelná (čierna)** — *Puccinia graminis* (PG) — historicky katastrofická, dnes vzácna v EÚ\n\n**Historický význam:**\n- **Rímska ríša** — *Robigalia* sviatok (25. apríla) zameraný proti hrdzi\n- **1880s** — masívne epidémie v USA a EÚ\n- **1916, 1953** — celosvetové epidémie hrdze stebelnej → impulzy pre bordeauxskú zmes a moderné fungicídy\n- **1999+** — UG99 (Ug99) — vysoko agresívny kmeň hrdze stebelnej z Ugandy, šíri sa z Afriky do Ázie. Hrozba pre globálnu pšeničnú produkciu.\n- **2010+** — PST Warrior (žltá hrdza) — agresívne rasy v EÚ, prelomenie odolnosti väčšiny pšeničných odrôd\n\n**Symptómy:**\n\n**Hrdza plevová (žltá, *yellow rust*):**\n- **Drobné žlto-oranžové pľuzgieriky** v dlhých prúžkoch pozdĺž žiliek listov\n- Optimálne: 8–18 °C, vlhko, rosa\n- **Časná v sezóne** (marec–jún v ČR)\n- **Riziko**: napadá ozim už počas zimy (prezimuje na listoch)\n\n**Hrdza listová (hnedá, *brown/leaf rust*):**\n- **Hnedo-oranžové pľuzgieriky** jednotlivé alebo v zhlukoch, kruhové\n- Optimálne: 15–25 °C\n- **Neskoro v sezóne** (máj–august)\n- **Riziko**: poškodzuje vlajkový list počas plnenia zrna\n\n**Hrdza stebelná (čierna, *stem rust*):**\n- **Tmavo hnedé až čierne** pľuzgieriky NA STEBLÁCH (nie na listoch)\n- Veľké lézie, často 1×3 cm\n- **Neskoro** (koniec júna–júl)\n- **Riziko**: poškodzuje steblo → poliehanie porastu, výrazné zníženie výnosu (-30–80 %)\n\n**Životný cyklus (komplexný — alternujúci hostiteľ):**\n- **Hlavný hostiteľ**: pšenica / jačmeň / raž (uredinia → telia štádium)\n- **Vedľajší hostiteľ** (sexuálna reprodukcia): rôzny podľa druhu\n  - PST žltá: predtým sa myslelo, že žiadny, dnes vieme *Berberis spp.* (dráč)\n  - PT listová: *Thalictrum spp.* (rešetliak — zriedkavo)\n  - PG stebelná: *Berberis vulgaris* (dráč obyčajný) — **historicky vyrubovaný** v USA na eradikáciu hrdze!\n- **EÚ/ČR**: *Berberis vulgaris* dnes nie je rozšírený → eradikácia 1900s pomohla.\n\n**Boj — fungicídy:**\n\n**Rovnaké schémy ako septorióza** (často kombinované postreky):\n- **Triazoly** — tebuconazol, prothiokonazol, metconazol — efektívne\n- **Strobiluríny** — pyraclostrobin, azoxystrobin — vysoko účinné, **rezistencia v niektorých rasách**\n- **SDHI** — moderné, kombinácia s triazolom\n- **Inatreq active** — nová trieda 2021+\n- **Aplikácia timing**: rovnaké ako STB (T1 + T2 najcennejšie)\n\n**Náklady**: zahrnuté v sezónnom postreku 2 000–4 000 Kč/ha (kombinované s STB postrekom)\n\n**Boj — rezistentné odrody:**\n- **Hlavné (major) gény rezistencie** (Lr, Sr, Yr gény) — špecifické, ale ľahko prelomené\n- **Slow-rusting**, kvantitatívna rezistencia — trvanlivejšia\n- **CIMMYT, ICARDA** — globálne šľachtenie\n- **České moderné odrody** majú kombináciu 3-5 génov rezistencie (Bohemia, Sailor, Vlasta)\n\n**Rezistencia patogénov:**\n- **PST Warrior** prelomil Yr17 v roku 2011 → väčšina EÚ odrôd citlivá\n- **Ug99 black rust** prelomil Sr31, Sr24, Sr36 — agresívne v Afrike\n- **Konštantný súboj** šľachtenia vs evolúcia patogéna\n\n**Medzinárodná spolupráca:**\n- **WIN** (Wheat Initiative Network) — globálne sledovanie rasových typov\n- **Borlaug Global Rust Initiative (BGRI)** — koordinácia boja proti Ug99\n- **EAS-Eppo** — EÚ monitoring\n\n**Klimatická zmena:**\n- Teplejšie zimy → vyššie prezimovanie patogéna\n- Neskorší chlad na jar → hrdze začínajú neskôr, ale silnejšie\n- **Pšenica v severných krajinách** (UK, IE, S-Skandinávia) teraz pravidelne napadané (predtým zriedkavejšie)\n\n**V ČR výskum**: VURV Praha (rasy PST, PT), Mendelu Brno (šľachtenie na rezistenciu).\n\nPozri tiež [[fuzarioza]], [[septorioza]], [[fungicidy]], [[ozim-jarin]].",
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
    "shortDef": "Mandelinka zemiaková (Leptinotarsa decemlineata) je invázny chrobák z USA, hlavný škodca zemiakov v Európe. Dospelci aj larvy žerú listy, bez ochrany 100 % defoliácia = 80 % strata výnosu. V ČR od 1922.",
    "longDef": "Mandelinka zemiaková (lat. *Leptinotarsa decemlineata*, ang. *Colorado potato beetle*, CPB) je **invázny chrobák** z čeľade *Chrysomelidae*. Pôvodom z **Colorada (USA)**, dnes hlavný škodca zemiakov v Európe, Ázii aj v pôvodnej Severnej Amerike.\n\n**História invázie:**\n- **1859** — prvá masová epidémia v Colorade (USA). Predtým žila na divokých *Solanum* spp.\n- **1875** — invázia do New Yorku, ďalej do EÚ\n- **1922** — prvý výskyt v ČR (Bordeaux, potom Praha)\n- **1947** — masová invázia do ČR, kampaň proti „americkému chrobákovi\"\n- **1950s** — DDT prvýkrát použitý, krátky triumf, potom rezistencia\n- **Dnes** — etablovaná po celej Európe, Severnej Ázii (Sibír), Japonsku, Číne\n\n**Morfológia:**\n- **Dospelci**: 10 mm, **žltý** s **10 čiernymi pruhmi** na krovkách. Charakteristický vzhľad.\n- **Vajíčko**: 1,5 mm, **oranžovo-žlté**, kladené v zhlukoch 20–60 ks **na spodnej strane** listov\n- **Larva**: 8–15 mm, **červeno-oranžová** s čiernou hlavou a čiernymi bodkami po stranách. 4 instar štádiá.\n- **Kukla**: v pôde 3–5 cm hĺbka\n\n**Životný cyklus:**\n1. **Prezimovanie**: dospelci v pôde 10–20 cm hlboko (nezamrznú)\n2. **Vylezenie**: jar pri teplotách >15 °C (v ČR koniec apríla–polovica mája)\n3. **Párenie a kladenie**: dospelci nájdu zemiakové porasty, kladú 200–400 vajíčok/samica\n4. **Larvy** (3–4 týždne): konzumujú listy. **Štádium L4 = najväčšia žravosť** (60 % celkového poškodenia).\n5. **Kuklenie**: v pôde, 1–2 týždne\n6. **Druhá generácia** dospelcov: koniec júla–august\n7. **V podnebí ČR**: 1–2 generácie ročne (2. generácia len v teplých rokoch)\n\n**Príznaky poškodenia:**\n- **Listy ohryzené**, často len stopky a žilky zostanú\n- **Defoliácia** môže byť 100 % počas 7–14 dní bez ochrany\n- **Plná defoliácia vo vegetácii**: -50 až -100 % výnosu\n- **Hľuzy zostávajú nepoškodené** (mandelinka je listový škodca)\n\n**Boj — chemický:**\n\n**Insekticídy:**\n- **Neonikotinoidy**: thiamethoxam, imidacloprid, clothianidin — **v EÚ zakázané** (vonkajšie použitie od 2018, schválenie skončilo 2019–2020) kvôli toxicite pre včely\n- **Spinosad** (Laser) — biopreparát z *Saccharopolyspora spinosa*, EÚ povolený, drahý\n- **Chlorantraniliprole** (Coragen) — moderný, na L1-L3 larvy účinný\n- **Cyantraniliprole** (Verimark) — koreňová aplikácia pri výsadbe\n- **Pyretroidy**: lambda-cyhalothrin (Karate) — lacné ale rezistencia\n- Spinetoram (Delegate) a indoxakarb (Steward) už v EÚ nie sú schválené (indoxakarb od 2021, vykonávacie nariadenie (EÚ) 2021/2081; spinetoram od 2024).\n\n**Aplikácia timing:**\n- **Kľúčový moment**: L1–L3 larvy (mladé, ľahko kontrolovateľné)\n- **Neskoro (L4)**: účinnosť klesá, larva už 50 % defoliácie spôsobila\n- **Sledovať porast** každých 3–5 dní v rizikovom období\n- **Prahová hodnota**: 30 lariev/100 rastlín = postrek\n\n**Boj — biologický:**\n\n**Predátori a parazitoidi:**\n- **Lienky** (*Coccinellidae*) — žerú vajíčka aj mladé larvy\n- **Zlatoočka** (*Chrysoperla*) — žerú vajíčka\n- **Bzdochy** (*Podisus, Perillus*) — americké, menej účinné v EÚ\n- **Parazitické mušky** (*Doryphorophaga*) — vzácne v EÚ\n- **Nie je dostatočne efektívne** pre veľké pole, len v záhrade/biofarme\n\n**Bacillus thuringiensis tenebrionis (BTT):**\n- Baktéria produkujúca toxíny **špecifické pre chrobáky**\n- Komerčne: Novodor, Trichodor\n- **Účinný len na L1-L2 larvy**, vyššie instary tolerantné\n- **Bio-prístup**, vhodný pre záhrady a biofarmu\n\n**Boj — kultúrny:**\n- **Pravidelné striedanie plodín** — aspoň 2 roky medzi zemiakmi na tom istom poli\n- **Ručný zber** v záhrade (pracné ale 100 % efektívne pre malé plochy)\n- **Sieťové bariéry** — mladý porast sa zakryje sieťou (drahé, len pre vzácne odrody)\n- **Pluhovanie na jeseň** — vyženie niektoré dospelce z prezimovania\n\n**Rezistentné odrody:**\n- **Solanum chacoense** — divoký zemiak, genetický zdroj rezistencie\n- **Sárka, Sárpo Mira** — čiastočná tolerancia\n- **Geneticky modifikované zemiaky** (BT-zemiaky) — vyradené z EÚ regulačnej scény 1990s, NABLAH a ďalšie\n\n**Rezistencia patogéna na pesticídy:**\n- Mandelinka je **šampión rezistencie medzi škodcami**\n- DDT (1950s), pyretroidy (1980s), neonikotinoidy (2010s) — postupne prelomené\n- **Resistance management**: rotovať 2–3 rôzne triedy insekticídov na sezónu\n\n**Ekonomika:**\n- **Postrek**: 800–1 500 Kč/ha (1 aplikácia)\n- **Sezónne**: 2–4 postreky × 1 200 = **2 400–4 800 Kč/ha**\n- **Návratnosť**: 5–10× (bez postreku 80 % strata = 80 000+ Kč/ha)\n\n**Klimatická zmena:**\n- Teplejšie zimy = lepšie prezimovanie\n- Dlhšia vegetačná doba = 2 generácie pravidelne (skôr vzácne)\n- **Posun severného areálu** do Škandinávie\n\nV kultúre: **„Americký chrobák\"** bol propagandistický symbol v 1950s (Studená vojna — Sovieti tvrdili, že USA zhadzujú mandelinky z lietadiel na ČSR a NDR pre sabotáž poľnohospodárstva).\n\nPozri tiež [[zemak]], [[plisen-bramborova]], [[insekticidy]].",
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
    "longDef": "Voška repná (lat. *Aphis fabae*, ang. *black bean aphid*) je **čierna / tmavohnedá voška** sajúca šťavy hostiteľských rastlín. Sama o sebe stredne škodlivá, ale **kľúčový vektor vírusov** v cukrovke, fazuli, maku.\n\n**Vzhľad:**\n- **Dospelý jedinec** 2 mm, **čierny / tmavohnedý**, často s voskovým povlakom\n- **Bezkrídla forma** (vivipara) — letné rozmnožovanie\n- **Okrídlená forma** (alata) — disperzná generácia, šírenie na nové porasty\n- **Larvy** (nymfy) — svetlozelené, neskôr tmavé\n\n**Hostitelia:**\n\n**Primárne** (zima):\n- **Bršlen európsky** (Euonymus europaeus) — hlavný zimný hostiteľ v EÚ\n- **Kalina** (Viburnum)\n- **Lopúch** (menej častý)\n\n**Sekundárne** (leto):\n- **Cukrovka, kŕmna repa**\n- **Fazuľa obyčajná** (Phaseolus vulgaris)\n- **Mak** (Papaver)\n- **Loboda** (Atriplex)\n- **Púpava, iné Compositae**\n\n**Životný cyklus:**\n1. **Zima**: vajíčka kladené na bršlen, kalinu\n2. **Jar**: bezkrídlé samice sa roja na bršlene\n3. **Okrídlené jedince (disperzia)**: letia na repu, fazuľu (máj–jún)\n4. **Vrchol populácie**: koniec júna–júl, na repe a fazuli\n5. **Návrat na bršlen**: koniec leta–jeseň, kladenie vajíčok\n6. **V CZ**: 10–15 generácií letný cyklus\n\n**Symptómy priameho poškodenia:**\n- **Listy stočené, skrútené**\n- **Kolónie vošiek** na spodnej strane listov (často 100+ jedincov na list)\n- **Medovica** (sweet excret) — lepkavé povlaky → rast sadzí\n- **Znížený rast** rastliny\n\n**Kľúčový problém — vírusy:**\n\n**BYV (Beet Yellows Virus, vírus žltačky repy):**\n- Voška naskočí na chorú rastlinu → cucá vírusy → letí na zdravú → infikuje\n- **Symptómy**: žlté listy repy, redukcia fotosyntézy\n- **Strata cukornatosti**: -20 až -40 % (cukrovka)\n- **Šírenie**: 1 jediná infikovaná voška môže nakaziť desiatky rastlín\n\n**BMYV (Beet Mild Yellowing Virus):**\n- Menej agresívny než BYV ale rozšírený\n\n**BWYV (Beet Western Yellows Virus):**\n- Aj repka, kapustovité\n\n**Boj — chemický:**\n\n**Insekticídy:**\n- **Neonikotinoidy** (thiamethoxam, imidacloprid) — **ZAKÁZANÉ v EÚ pre vonkajšie použitie od 2018** kvôli včelám. Predtým štandardné moridlo cukrovky.\n- **Acetamiprid** (Mospilan) — neonikotinoid stále povolený v EÚ (iná chemická štruktúra)\n- **Flonicamid** (Teppeki) — anti-feedant, **moderný štandard 2020s** pre cukrovku\n- Spirotetramat (Movento) — v EÚ už nie je schválený (schválenie skončilo 30. 4. 2024).\n- **Pirimicarb** (Aphox) — selektívny voškocíd, šetrný k užitočným organizmom (lienky)\n- **Pyretroidy** (cypermethrin, deltamethrin) — krátka účinnosť, rezistencia rýchla\n\n**Aplikácia timing:**\n- **Prvý postrek**: pri zistení 10 vošiek/rastlinu alebo 5 % rastlín s voškami\n- **Opakovanie**: za 7–14 dní (záleží na látke)\n- **Sezónne celkom**: 2–4 postreky v cukrovke\n\n**Náklady**: 600–1 200 Kč/ha za postrek × 3 = 1 800–3 600 Kč/ha sezónne\n\n**Boj — biologický:**\n- **Lienky** (Coccinellidae) — efektívne, 1 lienka zožerie 50 vošiek/deň\n- **Zlatoočky** (Chrysoperla)\n- **Voškári** (Aphidius spp., Praon spp.) — parazitické osičky, kladú vajíčka do vošky\n- **Kvetinové pásy** okolo polí zvyšujú populáciu predátorov\n- **Huby** (Beauveria, Metarhizium) — entomopatogénne, menej účinné v poli\n\n**Boj — kultúrny:**\n- **Odstránenie bršlenu** (zimný hostiteľ) v okolí cukrovkových polí — preventívne\n- **Skoré siatie** cukrovky → porast má viac vegetácie pred vrcholom vošiek\n- **Rezistentné odrody** cukrovky — čiastočná tolerancia k BYV (donor *Beta maritima*)\n\n**Bio prístup:**\n- **Mydlový roztok** (draselné mydlo) — fyzikálne poškodenie vošiek\n- **Neem olej** (azadirachtin) — prírodný pesticíd, obmedzený efekt\n- **Pyrethrum** (z chryzantém) — krátka účinnosť, EÚ povolené\n\n**Klimatická zmena:**\n- **Teplé zimy** → vošky prezimujú aj ako dospelci (nielen ako vajíčka), viac generácií\n- **Suchšie jari** → menšia populácia (voška preferuje vlhko)\n- **Posun areálu** na sever\n\n**V ČR výskum**: Cukrovarnícky výskumný ústav Praha, ÚKZÚZ — monitoring vírusu BYV, pruhovanie polí pre modeláciu rizika.\n\nPozri tiež [[insekticidy]], [[mandelinka-bramborova]], [[osevni-postup]].",
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
    "shortDef": "Zavíjač kukuričný (Ostrinia nubilalis) je motýľ, ktorého húsenice sa vŕtajú do stebiel a klasov kukurice. Bez ochrany strata 5–25 % výnosu + vstup húb Fusarium = mykotoxíny. V CZ rozšírený najmä na južnej Morave a v Polabí.",
    "longDef": "Zavíjač kukuričný (lat. *Ostrinia nubilalis*, ang. *European Corn Borer*, ECB) je **motýľ** z čeľade *Crambidae*. Jeho **húsenice sa vŕtajú do stebiel, klasov a palíc kukurice**, spôsobujúc priame straty + sekundárnu infekciu hubami *Fusarium* (mykotoxíny — pozri [[fuzarioza]]).\n\n**Vzhľad:**\n- **Dospelý jedinec**: motýľ, rozpätie 25–30 mm, **bledé žlté krídla** s vlnitými hnedými prúžkami. Samec tmavší než samica.\n- **Vajíčko**: 1 mm, **ploché šupinky** v zhlukoch 15–30 ks na spodnej strane listov\n- **Húsenica**: 25 mm, **šedo-ružová s tmavou hlavou**, 5 instar štádií\n- **Kukla**: v steble kukurice, hnedá\n\n**Životný cyklus v CZ:**\n\n**Severný areál (Krkonoše, Vysočina)** — **1 generácia ročne**:\n- Máj–jún: motýle lietajú\n- Jún–júl: húsenice v rastlinách\n- August: kuklenie\n- September–október: motýle druhej krátkej generácie (často neútočia)\n- November–marec: húsenice prezimujú v zvyškoch rastlín (slame, kukuričnom strnisku)\n\n**Južný areál (Slovácko, Polabí)** — **2 generácie ročne**:\n- 1. generácia: máj–júl\n- 2. generácia: august–október\n- Druhá generácia spôsobuje **vážnejšie straty** (väčšia rastlina, väčšie húsenice)\n\n**Symptómy poškodenia:**\n\n**Steblo:**\n- **Otvorené diery** (hĺbka 5–20 mm) — vstupný bod húsenice\n- **Skĺznutie stebla** počas silného vetra/dážďa (broken stalks)\n- **Otrasy žltého prachu** okolo vstupného otvoru (exkrementy húsenice)\n\n**List:**\n- **Otvorené diery v listoch** (mladá húsenica niekedy ohryzáva listy, skôr než vlezie do stebla)\n- **Brokátový vzhľad** (pinhole damage)\n\n**Palica (zber):**\n- **Húsenice v palici** — žerú zrná\n- **Otvorené diery na klase** — vstup pre *Fusarium*, *Aspergillus* — **mykotoxíny**\n- **Znížený výnos**: 5–25 % primárny, +10–30 % sekundárny kvôli hubám\n\n**Boj — chemický:**\n\n**Insekticídy** (aplikácia v larválnom štádiu, nie dospelce):\n- **Spinosad** (Laser) — bio, účinný na L1-L2\n- **Chlorantraniliprol** (Coragen) — moderný štandard, vysoká účinnosť\n- **Cyantraniliprol** (Verimark) — alternatíva\n- Spinetoram (Delegate) a indoxakarb (Steward) už v EÚ nie sú schválené.\n- **Pyretroidy** (lambda-cyhalothrin) — krátka účinnosť\n\n**Aplikácia timing — KRITICKÉ:**\n- **Pred vstupom do stebla**: húsenica L1-L3 ešte na listoch → cieľ postreku\n- **Po vstupe do stebla**: insekticíd nemá prístup, **postrek zlyháva**\n- **Timing**: 7–10 dní po vrchole letu motýľov (feromónové lapače)\n- **Monitorovanie**: feromónové lapače v poliach, sledovanie pravidelne\n\n**Ošetrenie je drahé a neisté** pre siláž — náklady 1 000–2 000 Kč/ha + ťažké načasovanie. Mnoho fariem **vynecháva**.\n\n**Boj — biologický:**\n\n**Trichogramma spp.** (parazitická osička):\n- **Klade vajíčka do vajíčok ECB** → 50–80 % parazitácia\n- **Aplikácia**: lepiace karty s osičkami zavesené v poli (5 000 osičiek/ha)\n- **Cena**: ~800–1 500 Kč/ha\n- **Účinnosť**: porovnateľná s insekticídom, **bio prístup**\n- **Trh**: AgriCom, BBM, BioActiv\n\n**Bacillus thuringiensis kurstaki (BTK):**\n- Baktéria s toxínom **špecifickým pre motýle** (lepidopterans)\n- Komerčne: Lepinox, Dipel, Foray\n- **Spojené so sezónou biopalív** (až do 10 dní účinnosť)\n\n**GMO kukurica MON810 (BT-corn):**\n- **Vlastná rezistencia** — kukurica produkuje *Bt* toxín\n- **EU zákaz pestovania** (len výnimky: Španielsko, Portugalsko)\n- **V CZ nie je zaregistrovaná** na pestovanie\n\n**Boj — kultúrny:**\n\n**Kľúčové preventívne opatrenie:**\n- **Oranie po zbere** — zaorá kukuričnú slamu s húsenicami → zníženie populácie 50–80 %\n- **Drvenie / mulčovanie strniska** — ničí úkryt\n- **Predplodina** (krátka sezóna) — menej tlaku\n- **No-till + kukuričná slama na povrchu** = NAJHORŠIE podmienky pre ECB\n\n**Rezistencia patogéna:**\n- ECB bol rezistentný na **MON810 Bt** v Brazílii a USA (2010s) — populácia pole-evolved\n- V EU bez plošného použitia Bt zatiaľ rezistencia pomalá\n\n**Klimatická zmena:**\n- 2. generácia na sever — Slovácko v 2020s pravidelne, skôr len výnimočne\n- Teplejšie jesene → väčšie prežitie húseníc\n- Posun areálu na sever Európy\n\n**Ekonomický dopad:**\n- **Bez ochrany**: strata 5–25 % výnosu + 5–15 % cena za kontamináciu mykotoxínmi\n- **Sezónna strata na 100 ha kukurice**: 50 000 – 250 000 Kč\n- **Náklady ochrany**: 1 000–2 500 Kč/ha\n- **Návratnosť**: 5–20× pri silnom tlaku\n\n**V ČR**: hlavný problém pre **silážnu kukuricu** (južná Morava, Slovácko, Olomoucko). Zrnová kukurica menej problém (zber pred vrcholom 2. generácie).\n\nPozri tiež [[fuzarioza]], [[insekticidy]], [[kukurice-silazni]], [[no-till]].",
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
    "shortDef": "Fungicídy sú chemické prípravky proti hubovým chorobám rastlín. Kľúčové triedy: triazoly (DMI), strobiluríny (QoI), SDHI, kontaktné (meď, síra, folpet). Náklad na jednu aplikáciu sa líši podľa triedy a značky prípravku — aktuálne ceny majú distribútori.",
    "longDef": "Fungicídy (z latinského *fungus* + *caedere* = huba + zabíjať) sú **chemické prípravky určené na ochranu rastlín pred hubovými chorobami**. V EÚ regulované nariadením EC 1107/2009. Na Slovensku prípravky na ochranu rastlín registruje **ÚKSÚP** (Ústredný kontrolný a skúšobný ústav poľnohospodársky v Bratislave).\n\n**Hlavné triedy fungicídov:**\n\n**1. Triazoly (DMI — DeMethylation Inhibitors):**\n- **Mechanizmus**: blokujú biosyntézu ergosterolu (membrána hubovej bunky)\n- **Hlavní zástupcovia**: tebuconazol, prothiokonazol (Proline), metconazol, difenoconazol; propiconazol (vykonávacie nariadenie (EÚ) 2018/1865) a epoxiconazol (schválenie skončilo 30. 4. 2020) už v EÚ nie sú schválené\n- **Spektrum**: široké — septorióza, hrdze, fuzarióza, múčnatka\n- **Účinnosť**: stredne-vysoká, **systemicky** (proniká listom)\n- **Rezistencia**: po 30 rokoch používania **slabne účinnosť na septoriózu**, ale stále základ\n- **Relatívny náklad**: podľa triedy, aktuálne ceny u distribútorov\n- **Pozn.**: tebuconazol u repky chráni pred fómou (*Leptosphaeria maculans*)\n\n**2. Strobiluríny (QoI — Quinone outside Inhibitors):**\n- **Mechanizmus**: inhibujú mitochondriálne dýchanie (cyt b)\n- **Hlavní zástupcovia**: azoxystrobin (Amistar), pyraclostrobin (Comet), trifloxystrobin (Flint), kresoxim-methyl\n- **Spektrum**: múčnatka, hrdze, **NIE septorióza** (rezistencia prelomená 2003)\n- **Účinnosť**: vysoká pre múčnatku a hrdze\n- **Špeciálne efekty**: **„green effect\"** — predlžuje zelenú fázu listu o 7–10 dní → +5 % výnos\n- **Rezistencia**: silná pre septoriózu, šíri sa v ďalších patogénoch\n- **Relatívny náklad**: podľa triedy, aktuálne ceny u distribútorov\n\n**3. SDHI (Succinate Dehydrogenase Inhibitors):**\n- **Mechanizmus**: blokujú komplex II mitochondriálneho dýchania\n- **Hlavní zástupcovia**: fluxapyroxad (Imtrex), bixafen (Aviator), benzovindiflupyr (Solatenol), fluopyram; pydiflumetofen (Adepidyn) v EÚ schválený nie je\n- **Spektrum**: septorióza, fuzarióza, múčnatka, hrdze\n- **Účinnosť**: TOP 2020s — silnejšie než triazoly\n- **Rezistencia**: zatiaľ mierna\n- **Relatívny náklad**: podľa triedy, aktuálne ceny u distribútorov\n- **Typická aplikácia**: SDHI + triazol mix = strieborný štandard pre pšenicu\n\n**4. Inatreq active (fenpicoxamid) — nová trieda:**\n- **Mechanizmus**: NOVÝ MOA (Quinone Inside Inhibitor, QiI)\n- **Účinnosť**: vysoká na septoriózu, žiadna doterajšia rezistencia\n- **Relatívny náklad**: podľa triedy, aktuálne ceny u distribútorov\n- **Trh**: Univoq (Corteva), 2021+\n\n**5. Mefentrifluconazole (Revysol) — nová DMI:**\n- **Mechanizmus**: pokročilý DMI, aktívny aj proti rezistentným kmeňom\n- **Relatívny náklad**: podľa triedy, aktuálne ceny u distribútorov\n- **Trh**: Revysol, Revystar (BASF), 2020+\n\n**6. Kontaktné fungicídy (multisite):**\n\n- **Mancozeb** (Dithane M-45, Penncozeb) — predtým najrozšírenejší lacný multisite, **v EÚ už nie je schválený**\n  - **Mechanizmus**: multi-site (nie je možné vytvoriť rezistenciu)\n  - **EÚ**: schválenie neobnovené vykonávacím nariadením (EÚ) 2020/2087 (toxický pre reprodukciu kat. 1B, endokrinný disruptor); povolenia zrušené do 4. 7. 2021, lehota na predaj a použitie skončila 4. 1. 2022\n  - **Relatívny náklad**: podľa triedy, aktuálne ceny u distribútorov (lacný)\n\n- **Meď** (CuSO₄, Cu hydroxid, oxychlorid)\n  - **Bio i konvenčné**: povolená v EÚ bio\n  - **Limit**: od 2019 najviac 28 kg Cu/ha za 7 rokov (v priemere 4 kg/ha/rok)\n  - **Použitie**: pleseň zemiaková, peronospóra viniča, ďalšie peronospóry\n  - **Relatívny náklad**: podľa triedy, aktuálne ceny u distribútorov\n\n- **Síra (S)**\n  - **Bio prístup**: múčnatka, roztoče\n  - **Relatívny náklad**: podľa triedy, aktuálne ceny u distribútorov\n\n- **Folpet**\n  - **Multisite** (kontaktný), náhrada za mancozeb\n  - **Relatívny náklad**: podľa triedy, aktuálne ceny u distribútorov\n\n**7. Anilinopyrimidíny (AP):**\n- **Mechanizmus**: biosyntéza metionínu\n- **Zástupcovia**: pyrimethanil, cyprodinil\n- **Spektrum**: múčnatka, monilióza\n\n**8. Cymoxanil:**\n- **Krátka účinnosť** (3–4 dni)\n- **Vždy v kombinácii** s inou účinnou látkou (predtým hlavne s mancozebom)\n- **Použitie**: pleseň zemiaková (kuratívny efekt)\n\n**9. Metalaxyl-M (oomyceta-specific):**\n- **Mechanizmus**: RNA polymeráza I (špecifické pre oomycety)\n- **Použitie**: pleseň zemiaková, peronospóra viniča\n- **Rezistencia**: vysoká (od 1980s)\n\n**Aplikačná technika:**\n\n**Postrekovač** (sprayer):\n- **Nesený** (na traktore, 600–1 200 l zásobník) — malé farmy\n- **Ťahaný** (1 500–4 500 l) — stredné\n- **Samojazdný** (Berthoud, Amazone Pantera) — veľké farmy\n- **Pracovný záber**: 18–36 m\n\n**Tryska a tlak:**\n- **Plochový pohyb**: 200–400 l vody/ha, tlak 2–4 bary\n- **Jemné rozprášenie**: lepšie pokrytie ale väčší drift (snos do okolia)\n- **Hrubé rozprášenie**: menej driftu, ale horšie pokrytie\n\n**Kombinácia s adjuvantom (povrchové činidlo):**\n- **Olej** (Mero, Adigor) — zvyšuje priľnavosť (retention) na liste\n- **Zmáčadlo** (Trend, Silwet) — znižuje povrchové napätie, lepšie pokrytie\n- **Penetrant**: rýchlejší vstup do listu\n\n**Rezistencia — antirezistentné stratégie:**\n1. **MIX rôznych MOA** (mechanizmus účinku) v každom postreku\n2. **Maximálne 1× za sezónu** rovnakú MOA\n3. **Rotácia** — rôzne MOA medzi postrekmi\n4. **Spojenie s rezistentnými odrodami**\n5. **Spojenie s agrotechnikou** (zaorávanie, hustota porastu)\n\n**Sezónny kalendár — pšenica (typický 2024):**\n- **T0** (BBCH 30): protiseptoriózový — triazol\n- **T1** (BBCH 32): septória + hrdze — SDHI + triazol\n- **T2** (BBCH 39): flag leaf — SDHI + triazol (NAJCENNEJŠÍ)\n- **T3** (BBCH 63): fuzarióza — triazol\n- **Sezónne**: podľa cenníka distribútora\n\n**Návratnosť:**\n- **Bez fungicídov**: -30 až -50 % výnos\n- **Iba postrek T2**: -10 až -20 % oproti plnému programu\n- **Plný program**: max výnos\n- **Návratnosť plného programu**: 4–6× v rizikovom roku\n\n**EÚ regulácie:**\n- **Nariadenie (ES) č. 1107/2009** — schvaľovanie účinných látok v EÚ; prípravky povoľuje každý štát (na Slovensku ÚKSÚP)\n- **MRL** (Maximum Residue Limits) — limity zvyškov v jedle\n- **Buffer zones** — povinné nepostrekovať 5–20 m od vodných tokov\n- **PPE** — povinné OOP (rukavice, respirátor) pri aplikácii\n- **Neschválené fungicídy** (príklady):\n  - **Propiconazol** — neschválený od 2018 (vykonávacie nariadenie (EÚ) 2018/1865)\n  - **Chlorothalonil** — neschválený od 2019 (vykonávacie nariadenie (EÚ) 2019/677)\n  - **Epoxiconazol** — schválenie skončilo 2020\n  - **Mancozeb** — neschválený od 2021 (vykonávacie nariadenie (EÚ) 2020/2087)\n- Či je konkrétny prípravok povolený, vždy overte v registri prípravkov na ochranu rastlín ÚKSÚP\n\nPozri tiež [[plisen-bramborova]], [[fuzarioza]], [[septorioza]], [[rzi]], [[insekticidy]], [[herbicidy]].",
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
      "prípravky proti burinám",
      "protiburinové postreky"
    ],
    "kategorie": "ochrana",
    "shortDef": "Herbicídy sú prípravky proti burinám. Glyfosát (Roundup) je najpoužívanejší. Selektívne herbicídy ničia len určité druhy burín, totálne zabijú všetko. Globálny trh 30+ mld USD/rok, kľúčový pre moderné poľnohospodárstvo.",
    "longDef": "Herbicídy (z lat. *herba* = bylina + *caedere* = zabíjať) sú **prípravky proti burinám**. Kľúčový pesticídny segment — bez herbicídov by súčasné výnosy klesli o 30–50 % a ručné pletie by bolo ekonomicky nemožné na veľkých plochách.\n\n**Delenie podľa selektivity:**\n\n**Totálne (neselektívne)** — zabijú všetky rastliny:\n- **Glyfosát** (Roundup) — pozri [[roundup]]\n- **Glufosinát** (Basta) — v EÚ neschválený od 2018\n- **Diquat** (Reglone) — predtým desikant, v EÚ neschválený (vykonávacie nariadenie (EÚ) 2018/1532)\n- **Paraquat** — **zakázané v EU od 2007**\n\n**Selektívne** — ničia len určité druhy:\n\n**Dvojklíčnolistové (širokolisté buriny) v obilí:**\n- **MCPA, 2,4-D** — rastové herbicídy, stará a lacná trieda\n- **Sulfonylmočoviny** (Granstar, Hussar) — moderné, dávky 10–30 g/ha\n\n**Jednoklíčnolistové (trávy) v širokolistých plodinách:**\n- **Quizalofop-p-ethyl** (Targa, Leopard) — repka, sója\n- **Fluazifop-p-butyl** (Fusilade) — alternatíva\n- **Clethodim** (Centurion) — sója\n\n**Pre-emergence (pred vzídením):**\n- **Pendimethalin** (Stomp, Activus) — koreňový herbicíd\n- **Terbuthylazín, pethoxamid, dimethenamid-P** — kukurica\n- S-metolachlor (Dual Gold) a metribuzin už v EÚ nie sú schválené (vykonávacie nariadenia (EÚ) 2024/20 a 2024/2806).\n- **Aplikácia**: pred vzídením burín, 2-7 dní po siatí\n\n**Post-emergence (po vzídení):**\n- **Mesotrione** (Callisto) — kukurica, šetrná\n- **Foramsulfuron** (Maister) — kukurica\n- **Mesosulfuron + iodosulfuron** (Atlantis) — graminicíd v pšenici\n\n**Mechanizmus účinku (MOA — HRAC groups):**\n\n**1. EPSPS inhibítory** (Group 9): glyfosát\n**2. AHAS inhibítory** (Group 2): sulfonylmočoviny, imidazolinóny — najviac rezistencií\n**3. ACCase inhibítory** (Group 1): graminicídy (Fusilade, Targa) — vysoká rezistencia\n**4. PSII inhibítory** (Group 5): terbuthylazín, metamitron; atrazín je v EÚ neschválený od 2004 (rozhodnutie 2004/248/ES)\n**5. PPO inhibítory** (Group 14): carfentrazone, pyraflufen-ethyl\n**6. HPPD inhibítory** (Group 27): mesotrione, isoxaflutole — kukurica\n**7. Mitóza inhibítory** (Group 3): pendimethalin\n**8. Celulóza syntéza** (Group 29): isoxaben\n\n**Glyfosát (Roundup) — detail:**\nPozri [[roundup]] pre plný profil.\n\n- **Mechanizmus**: blokuje EPSPS enzým (syntéza aromatických aminokyselín)\n- **Spektrum**: totálne (mimo Roundup Ready GMO plodín)\n- **Aplikácia**: pred sejbou, na strnisko, medziradovo v sadoch a viniciach; na desikáciu pred zberom sa v EÚ od decembra 2023 povoľovať nesmie\n- **Cena**: 250–500 Kč/ha (jeden z najlacnejších herbicídov)\n- **Globálny trh**: 800 000 t/rok, 30 % všetkých herbicídov\n- **EÚ regulácia**: schválenie obnovené do 15. 12. 2033 (vykonávacie nariadenie (EÚ) 2023/2660)\n\n**Kľúčové buriny v CZ a ich herbicídy:**\n\n**V pšenici:**\n- **Lipkavec obyčajný** (Galium aparine): Granstar, Hussar OD\n- **Harmanček pravý** (Matricaria chamomilla): MCPA, sulfonylmočoviny\n- **Metlička obyčajná** (Apera spica-venti): Atlantis OD, Pacifica Plus\n- **Lipnica** (Poa annua): Atlantis OD\n- **Pýr plazivý** (Elymus repens): glyfosát pred siatím alebo na strnisko\n\n**V kukurici:**\n- **Mrlík biely** (Chenopodium album): Callisto, Maister Power\n- **Loboda** (Atriplex): Callisto, Stomp\n- **Mohár** (Setaria): Maister\n- **Ohnica** (Sinapis arvensis): Casper\n\n**V repke:**\n- **Harmanček**: Galera (clopyralid + picloram)\n- **Púpava**: Galera\n- **Pýr**: Fusilade Forte (len v repke)\n\n**V cukrovke:**\n- **Mrlík, loboda**: metamitron (Goltix) + phenmedipham + ethofumesate, zvyčajne v niekoľkých delených postrekoch\n- **Trávy**: graminicíd, napr. quizalofop-P alebo cycloxydim\n- Chloridazon (Pyramin) a desmedipham už v EÚ nie sú schválené.\n\n**Rezistencia k herbicídom:**\n\n**Globálny problém 2010s+**:\n- **Amaranth palmerii** v USA — rezistencia na glyfosát, sulfonylmočoviny, HPPD\n- **Lolium spp.** v Austrálii — multi-rezistencia, „herbicide superweeds\"\n- **Metlička obyčajná** v EÚ — rezistencia k ACCase i AHAS inhibítorom\n\n**Antirezistentná stratégia:**\n1. **Rotácia MOA** — rôzne herbicídy v rôznych rokoch\n2. **Mix MOA** — kombinácia v jednom postreku\n3. **Mechanická kontrola** — orba, plečka v medziradkoch\n4. **Cover crops** — krycie plodiny znižujú buriny\n5. **Manuálna** — kontrola hniezd rezistencie\n\n**Bioherbicídy:**\n- **Kyselina pelargónová** (Beloukha) — z prírodných zdrojov\n- **Octová kyselina** (vinegar) — pre malé plochy\n- **Termálne** — propánové horáky pre pásové herbicídy\n- **Cena**: 5–20× drahšie než glyfosát\n\n**Aplikačná technika:**\n- **Postrekovač** (ako fungicídy) — 200–400 l vody/ha\n- **Tryska**: väčšinou jemnejšia (jednoduchá injekcia) než pre fungicídy\n- **Mix s adjuvantom**: smáčadlo zlepší účinnosť\n- **Pozor na drift** — herbicíd môže poškodiť susedné plodiny\n\n**Náklady — pre typickú pšenicu:**\n- **Pre-emergence**: 600–1 200 Kč/ha\n- **Post-emergence** (jar): 800–1 500 Kč/ha\n- **Sezónne**: 1 400–2 700 Kč/ha\n\n**Pre kukuricu:**\n- **Pre-emergence**: 1 200–2 000 Kč/ha\n- **Post-emergence**: 1 000–1 800 Kč/ha (napr. mesotrione, foramsulfuron)\n\n**EU regulácia:**\n- **Glyfosát**: schválený do 15. 12. 2033 s obmedzeniami (okrem iného žiadna desikácia pred zberom)\n- **Neschválené herbicídy** (príklady): atrazín (2004), paraquat (2007), chlorthal-dimethyl (2009), glufosinát (2018), diquat (2018), S-metolachlor (2024), metribuzin (2024), flufenacet (2025)\n- Či je konkrétny prípravok povolený, vždy overte v registri prípravkov na ochranu rastlín ÚKSÚP\n- **MRL** — maximum residue limits v potravinách\n- **Bufferzóny** — 5–10 m od vodných tokov\n\nPozri tiež [[roundup]], [[fungicidy]], [[insekticidy]], [[desikace]], [[ozim-jarin]].",
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
      "prípravky proti hmyzu",
      "protihmyzné postreky"
    ],
    "kategorie": "ochrana",
    "shortDef": "Insekticídy sú prípravky proti škodlivému hmyzu. Kľúčové triedy: pyretroidy (lambda-cyhalothrin), neonikotinoidy (v EÚ zostal schválený len acetamiprid), modernejšie diamidy a spinosyny. Cena postreku v ČR 600–2 000 Kč/ha.",
    "longDef": "Insekticídy (z lat. *insectum* + *caedere* = hmyz + zabíjať) sú **prípravky proti škodlivému hmyzu**. Kľúčový segment ochrany rastlín — bez insekticídov by straty z vošiek, mandelinky, zavíjačov boli katastrofálne.\n\n**Hlavné triedy insekticídov (IRAC groups):**\n\n**1. Pyretroidy** (Group 3 — sodium channel modulators):\n- **Mechanizmus**: blokujú sodíkové kanály v nervovom systéme hmyzu\n- **Hlavní zástupcovia**:\n  - **Lambda-cyhalothrin** (Karate Zeon) — široké spektrum\n  - **Deltamethrin** (Decis) — populárny\n  - **Cypermethrin** (Cyperkill) — lacný\n  - **Tau-fluvalinate** — selektívnejší (šetrnejší k včelám)\n- **Spektrum**: široké — vošky, chrobáky, larvy motýľov, bzdochy\n- **Účinnosť**: rýchla (knockdown), ale krátka (7-10 dní)\n- **Rezistencia**: rozsiahla (od 1980s) — vošky, mandelinka, klopuška repná\n- **Toxicita**: vysoká pre včely (NEpostrekovať v rozkvete!)\n- **Cena**: 200–500 Kč/ha (lacné)\n\n**2. Neonikotinoidy** (Group 4 — nicotinic acetylcholine receptor):\n- **Mechanizmus**: agonisti acetylcholín receptorov (ako nikotín u človeka)\n- **Hlavní zástupcovia**:\n  - **Acetamiprid** (Mospilan) — jediný neonikotinoid, ktorý je v EÚ naďalej schválený\n  - **Imidacloprid** (Confidor, Gaucho), **thiamethoxam** (Actara, Cruiser), **clothianidin** (Poncho) — predtým hlavne moridlá osiva, v EÚ už neschválené\n- **EÚ**: vonkajšie použitie imidaclopridu, clothianidinu a thiamethoxamu zakázané od 2018 (vykonávacie nariadenia (EÚ) 2018/783, 2018/784 a 2018/785), schválenie potom skončilo úplne (2019–2020); thiacloprid neschválený vykonávacím nariadením (EÚ) 2020/23\n- **Dôvod zákazu**: vysoká toxicita pre **včely a opeľovače**\n- **Cena**: 300–600 Kč/ha (acetamiprid)\n- **Systémové pôsobenie**: pohybuje sa v rastline, dlhodobá ochrana (2-4 týždne)\n\n**3. Diamidy** (Group 28 — ryanodine receptor modulators):\n- **Mechanizmus**: stále otváranie kalciových kanálov v svaloch hmyzu → paralýza\n- **Hlavní zástupcovia**:\n  - **Chlorantraniliprole** (Coragen) — kukurica, zemiak\n  - **Cyantraniliprole** — aj ako moridlo osiva, systémovo\n  - Flubendiamide (Belt) — v EÚ už neschválený (schválenie skončilo 2024)\n- **Spektrum**: motýle (húsenice), chrobáky (mandelinka), niektoré mušky\n- **Bezpečnosť**: ŠETRNÁ k včelám a benefitom\n- **Cena**: 1 000–2 000 Kč/ha (drahá)\n- **Rezistencia**: zatiaľ mierna\n- **Trh**: rýchlo rastúci 2010s+\n\n**4. Spinosyny** (Group 5 — nicotinic acetylcholine receptor, iný site):\n- **Mechanizmus**: agonisti acetylcholín receptorov (iný binding site než neonikotinoidy)\n- **Hlavní zástupcovia**:\n  - **Spinosad** (Laser) — bio aj konvenčné, z baktérie *Saccharopolyspora spinosa*\n  - Spinetoram (Delegate) — v EÚ už neschválený (schválenie skončilo 2024)\n- **Spektrum**: motýle, mandelinka, vrtivky\n- **Bezpečnosť**: nízka toxicita pre cicavce, **stredná pre včely** (postrekovať večer)\n- **Cena**: 800–1 500 Kč/ha\n\n**5. Anti-feedants / rastové regulátory:**\n\n- **Flonicamid** (Teppeki) — anti-feedant pre vošky. Zastaví kŕmenie počas 1-2 h.\n  - **Bezpečné** pre včely\n  - **Cena**: 800–1 200 Kč/ha\n  - **Použitie**: cukrovka, zemiak, ovocie\n\n- **Pymetrozin** (Plenum) — vošky; v EÚ neschválený od 2019 (vykonávacie nariadenie (EÚ) 2018/1501).\n\n- **Buprofezin** (Applaud) — chitin syntéza inhibitor. Rastový regulátor pre nymfálne štádiá.\n\n- **Indoxakarb** (Steward, Avaunt) — Group 22, blokátor sodíkových kanálov; v EÚ neschválený od 2021 (vykonávacie nariadenie (EÚ) 2021/2081).\n\n**6. Akaricídy (proti roztočom):**\n\n- **Hexythiazox** (Nissorun) — roztočové vajíčka a nymfy\n- **Pyridaben** (Sanmite) — adultné roztoče\n- **Abamectin** (Vertimec) — širšie spektrum\n- Spirodiclofen (Envidor) — v EÚ neschválený od 2020\n- **Bifenazate** (Floramite) — selektívne\n\n**7. Bio insekticídy:**\n\n- **Bacillus thuringiensis** (BT):\n  - **BT kurstaki (BTK)** — Lepinox, Dipel — motýle (húsenice)\n  - **BT tenebrionis (BTT)** — Novodor — chrobáky (mandelinka L1-L2)\n  - **BT israelensis (BTI)** — komáre, mušky v záhradách\n  - **Bezpečné** pre cicavce, vtáky, ryby — len pre hmyz cieľový\n  - **Krátka účinnosť** (3-7 dní)\n- **Spinosad** (pozri vyššie) — bio aj konvenčné certifikácie\n- **Neem olej** (azadirachtin) — z indického neemu, **antifeedant + IGR**\n- **Pyrethrum** — z kvetov chryzantém — krátka účinnosť (1-3 dni)\n- **Beauveria bassiana** — entomopatogénna huba\n\n**Aplikačná technika:**\n\n**Postrekovač** (rovnako ako fungicídy/herbicídy):\n- 200–400 l vody/ha\n- Jemnejšia tryska pre lepšie pokrytie\n\n**Morenie osív** (seed treatment):\n- **Neonikotinoidy** (clothianidin, imidacloprid, thiamethoxam) — v EÚ neschválené, vonkajšie použitie zakázané od 2018\n- **Cyantraniliprole** — moderné moridlo (napr. pri repke)\n\n**Granulát na riadky:**\n- **Tefluthrin** — Force — kukurica\n\n**Aplikácia timing:**\n\n**Mandelinka zemiaková**:\n- L1-L3 larvy (mladé) — postrek\n- 30 lariev/100 rastlín = threshold\n\n**Zavíjač kukuričný**:\n- Po vrchole letu motýľov (feromónové lapače)\n- 7-10 dní po vrchole → húsenice L1-L3\n\n**Vošky**:\n- 10 vošiek/rastlinu = threshold v cukrovke\n- 50+ % rastlín s voškami = postrek v obilí\n\n**Sací škodcovia** (vošky, klopušky):\n- Aplikuje SYSTÉMICKÝ insekticíd (acetamiprid, flonicamid)\n\n**Žrúci škodcovia** (chrobáky, húsenice, larvy):\n- Aplikuje kontaktný alebo žalúdočný (pyretroid, BTK)\n\n**Bezpečnosť pre včely a opeľovače:**\n\n**EÚ regulácia** (od 2018):\n- Imidacloprid, clothianidin, thiamethoxam a thiacloprid v EÚ neschválené; acetamiprid schválený\n- Či je konkrétny prípravok povolený, vždy overte v registri prípravkov na ochranu rastlín ÚKSÚP\n- Pyretroidy: NEpostrekovať v rozkvete plodín\n- Diamidy, spinosyny: ŠETRNÉ\n- Flonicamid: bezpečné\n\n**Best practice:**\n1. **Postrek večer** (po západe slnka) — včely doma v úli\n2. **NEpostrekovať kvitnúci porast** (pšenica v kvitnutí, slnečnica, repka)\n3. **Informovať susedných včelárov** pred postrekom (zákonná povinnosť v niektorých krajinách)\n4. **Buffer zóny** od kvitnúcich remízok\n5. **Mix s herbicídom** pre zníženie počtu postrekov\n\n**Rezistencia:**\n\n**Šampióni rezistencie:**\n- **Mandelinka zemiaková** — rezistentná k DDT, pyretroidom, neonikotinoidom (postupne)\n- **Mol kapustový** (*Plutella xylostella*) — superresistant\n- **Drosophila suzukii** (Spotted wing drosophila) — rýchla rezistencia\n\n**Stratégia:**\n1. **Rotácia MOA** — najmenej 3 rôzne triedy insekticídov\n2. **Mix MOA** v jednom postreku\n3. **Vyhnúť sa** jednému produktu opakovane\n4. **Spojenie s IPM** (Integrated Pest Management)\n\n**IPM (Integrované riadenie škodcov):**\n- **Monitoring**: feromónové lapače, vizuálna kontrola, model rizika\n- **Threshold**: postrek až po prekročení ekonomického prahu\n- **Biológia**: predátori, parazitoidi, BT\n- **Kultúrne**: striedanie, odolné odrody, zaorávanie\n- **Chémia**: ako posledné riešenie, cielene\n\n**Náklady:**\n- **Pyretroid**: 200–500 Kč/ha\n- **Acetamiprid**: 400–700 Kč/ha\n- **Diamid**: 1 000–2 000 Kč/ha\n- **BT bio**: 600–1 200 Kč/ha\n- **Sezónne** (3–5 postrekov): 1 500–5 000 Kč/ha\n\nPozri tiež [[mandelinka-bramborova]], [[msice-repna]], [[zavijec-kukuricny]], [[fungicidy]], [[herbicidy]].",
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
      "predzberové sušenie",
      "preharvest desiccation"
    ],
    "kategorie": "ochrana",
    "shortDef": "Desikácia je predzberové usmrtenie porastu, ktoré zjednotí dozrievanie a uľahčí zber. Po konci diquatu a so zákazom desikácie glyfosátom v EÚ ide dnes hlavne o ničenie vňate zemiakov.",
    "longDef": "Desikácia (z lat. *desiccare* = vysušiť) je **cielené usmrtenie porastu pred zberom**. Má zjednotiť dozrievanie, znížiť vlhkosť zberaného produktu a uľahčiť zber kombajnom alebo zberačom zemiakov.\n\n**Na čo desikácia slúži:**\n1. **Zjednotenie dozrievania** — porast dozrieva nerovnomerne, napríklad repka medzi hlavnou stonkou a bočnými vetvami\n2. **Nižšia vlhkosť zrna** a tým nižšie náklady na sušenie\n3. **Ľahší zber** — suchý porast prejde mláťačkou rýchlejšie a s menšími stratami\n4. **Ničenie vňate zemiakov** — aby šupka vyzrela a pleseň zemiaková neprešla z vňate na hľuzy\n5. **Zničenie prerastených burín**\n\n**Účinné látky a ich stav v EÚ:**\n- **Diquat** (Reglone) — desiatky rokov štandard pri zemiakoch, repke a hrachu. **V EÚ už nie je schválený** (vykonávacie nariadenie (EÚ) 2018/1532), použitie skončilo najneskôr 4. 2. 2020\n- **Glufosinát** (Basta) — **v EÚ neschválený**, schválenie skončilo 31. 7. 2018\n- **Karfentrazon-etyl** a **pyraflufen-etyl** — PPO inhibítory, na ktorých dnes stojí chemické ničenie vňate zemiakov. Pôsobia len kontaktne, potrebujú dobré pokrytie a zvyčajne dva prejazdy\n- **Kyselina pelargónová** — prírodná kontaktná látka, použiteľná aj v ekologickom poľnohospodárstve; veľká spotreba vody a vysoká cena\n- **Glyfosát** — schválený do 15. 12. 2033, ale **na desikáciu sa v EÚ povoľovať nesmie**: vykonávacie nariadenie (EÚ) 2023/2660 vylučuje použitie na riadenie termínu zberu a na uľahčenie mlátenia (platí od 16. 12. 2023). Predzberové ošetrenie proti trvácim burinám je možné len tam, kde ho výslovne uvádza povolenie prípravku.\n\n**Zemiaky — hlavný prípad desikácie:**\nVňať sa ničí dva až tri týždne pred zberom, aby šupka vyzrela, hľuzy sa pri zbere nepoškodili a pleseň zemiaková neprešla z odumierajúcej vňate na hľuzy. Po konci diquatu sa ujal **kombinovaný postup**:\n1. **Mechanické drvenie vňate** ako prvý krok\n2. **Chemické dočistenie** PPO desikantom proti obrastaniu a zvyškom stoniek\n3. Prípadne **elektrická desikácia** vysokým napätím — bez chémie, vhodná aj pre ekologické poľnohospodárstvo, ale drahá a s malým výkonom\n4. V ekologickom poľnohospodárstve **čisto mechanicky** — drvenie a vytrhávanie vňate\n\nNičenie vňate je preto drahšie a prácnejšie ako v čase diquatu.\n\n**Repka**: v strednej Európe sa zvyčajne zberá bez desikácie. Proti pukaniu šešúľ sa používajú **lepidlá šešúľ**, **odrody odolné pukaniu**, **bočné nože na žacom ústrojenstve** a repkový adaptér s predĺženým stolom.\n\n**Pšenica a ďalšie obilniny**: desikácia sa nerobí — glyfosát na ňu v EÚ povoliť nemožno. Dozrievanie sa riadi voľbou odrody, termínom sejby a vedením porastu.\n\n**Slnečnica, strukoviny, ľan**: dozrievajú nerovnomerne, takže tu má predzberové ošetrenie najväčšie odborné opodstatnenie — povolenia sú však úzke a líšia sa podľa plodiny aj štátu.\n\n**Právne upozornenie**: povolenia na predzberové použitie sú **plodinové a národné** a často sa menia. Záväzný je len **register prípravkov na ochranu rastlín ÚKSÚP** a etiketa prípravku, k tomu ochranné lehoty a maximálne limity rezíduí. Pri zmluvnej produkcii rozhodujú aj podmienky odberateľa.\n\nPozri tiež [[herbicidy]], [[roundup]], [[repka-ozima]], [[zemak]], [[plisen-bramborova]].",
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
    "shortDef": "Pšenica ozimá je najdôležitejšia plodina ČR — 800 000+ ha = 30 % ornej pôdy. Seje sa na jeseň (september–október), zbiera sa v júli–auguste. Výnos 6–8 t/ha, cena 4 500–6 500 Kč/t. Potravinárska trieda A/E alebo kŕmná podľa hektolitrovej váhy.",
    "longDef": "Pšenica ozimá (lat. *Triticum aestivum*, ang. *winter wheat*) je **najdôležitejšia obilnina v ČR** a 2. najpestovanejšia plodina (po kukurici v plochách). V ČR pokrýva **800–950 tis. ha** ročne, produkcia **5–7 mil. t**.\n\n**Vlastnosti ozimu vs jarinu (pozri [[ozim-jarin]]):**\n- **Sejba**: 15. septembra – 20. októbra (optimálne do 5. októbra v ČR)\n- **Vegetácia**: 280–310 dní (prezimuje)\n- **Zber**: 15. júla – 15. augusta\n- **Výnos vs jarná**: o 20–40 % vyšší (využije zimnú vláhu, dlhšia vegetácia)\n\n**Agrotechnika:**\n\n**1. Sejba (BBCH 00–09):**\n- **Hĺbka**: 2–4 cm\n- **Vzdialenosť riadkov**: 12,5 cm (úzke), 15 cm (štandard)\n- **Hustota**: 350–450 klíčivých zŕn/m² (= 180–220 kg osiva/ha pre HW 45g)\n- **Odporúčanie**: neskoršia sejba (po 1. októbri) = nižšie riziko septoriózy ([[septorioza]]) ale slabší koreňový systém\n- **Predplodina ideálna**: repka, hrášok, strukovina (zanechávajú dusík)\n- **Predplodina riziková**: kukurica (Fusarium [[fuzarioza]]), pšenica (autokoroza)\n\n**2. Jesenný vývoj (BBCH 10–29):**\n- **Cieľ: zima** s 3-4 odnožami, koreňový systém v hĺbke 50+ cm\n- **Hnojenie na jeseň**: 30–40 kg P/ha, 60–80 kg K/ha (NPK 15-15-15 = 200 kg)\n- **Postrek buriny**: jeseň pre-emergence (Stomp + Boxer) alebo skoro na jar\n- **Postrek fungicíd**: len pri silnom jesennom tlaku (septoriózy)\n\n**3. Jarný vývoj (BBCH 30–49):**\n- **Regeneračné hnojenie** N (BBCH 25–29): 50–70 kg N/ha (LAV, DAM-390)\n- **Hnojenie BBCH 32**: 40–60 kg N/ha\n- **Hnojenie BBCH 39**: 30–50 kg N/ha + síra (S 20 kg)\n- **Celkom N**: 150–220 kg N/ha (intenzívne) alebo 120–160 (extenzívne)\n- **Postreky T1 + T2** (pozri [[fungicidy]]) — SDHI + triazol\n\n**4. Kvitnutie a tvorba zrna (BBCH 50–89):**\n- **Postrek T3** (BBCH 63): fuzarióza prevencia\n- **Plnenie zrna**: cca 40 dní (mliečne → voskové → tvrdé)\n- **Kľúčové**: dážď v plnení zvyšuje výnos, sucho zrazí o 20–40 %\n\n**5. Zber (BBCH 90–99):**\n- **Vlhkosť zrna**: 13–15 % optimum (skladovateľné bez sušenia)\n- **Desikácia** (pozri [[desikace]]): v pšenici sa nerobí — glyfosát na ňu v EÚ od decembra 2023 povoliť nemožno\n- **Kombajn**: 5–10 ha/h (moderný)\n\n**Výnosy ČR 2024:**\n- **Priemer**: 6,2 t/ha\n- **Top farmy** (intenzívne, Stredočeský kraj): 9–12 t/ha\n- **Slabé farmy** (Vysočina, ANC): 4–5 t/ha\n\n**Kvalitatívne triedy** (podľa hektolitrovej váhy a obsahu N):\n\n| Trieda | hl váha | NL (sušina) | Cena (Kč/t 2024) |\n|-------|---------|-------------|------------------|\n| **E** (elite) | 82+ | 14+ % | 6 200–6 500 |\n| **A** | 78–82 | 12,5+ % | 5 800–6 200 |\n| **B** | 76–78 | 11,5+ % | 5 400–5 800 |\n| **C** (kŕmná) | 74–76 | 10+ % | 4 800–5 200 |\n| **Pod limit** | < 74 | < 10 | 4 200–4 600 |\n\n**Ekonomika 2024:**\n- **Náklady** na 1 ha: 28 000–38 000 Kč (osivo, hnojivá, postreky, palivo, zber)\n- **Výnosy 6,5 t/ha × 5 500 Kč = 35 750 Kč/ha**\n- **Marža**: -2 000 až +5 000 Kč/ha (úzka, citlivá na ceny)\n- **Priame platby** (BISS, redistributívna platba, ekoplatba) sa k marži pripočítavajú — sadzby pozri nižšie\n\n**Odrody 2024 (trh ČR):**\n- **Bohemia** — toleruje sucho, A trieda\n- **Sailor** — výnos top, B-A trieda\n- **Vlasta** — septoriózová odolnosť\n- **Genius** — kŕmná, top výnos\n- **RGT Sacramento** (FR import) — A trieda, veľmi rozšírená\n\n**Hlavné choroby:** [[septorioza]] (#1), [[fuzarioza]], [[rzi]]\n\n**Hlavní škodcovia:** vošky (BYDV vektor), kohútik obilný, hrbáč pšeničný\n\n**EÚ regulácie:**\n- **Priame platby v ČR za rok 2025**: BISS 1 759,91 Kč/ha, redistributívna platba 3 449,49 Kč/ha na prvých 150 ha, základná ekoplatba 1 578,37 Kč/ha\n- **Diverzifikácia v ekoplatbe (ČR)**: pšenica je jednou z povinných 2–4 plodín; ozimná a jarná pšenica sa počítajú ako jedna plodina\n\nPozri tiež [[ozim-jarin]], [[osevni-postup]], [[fungicidy]], [[septorioza]], [[fuzarioza]], [[hektolitr]], [[psenice-jarni]].",
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
    "longDef": "Pšenica jarná (lat. *Triticum aestivum* — varieta jarná, ang. *spring wheat*) je **doplnková plodina** v ČR — v normálnych rokoch len 20 000–40 000 ha. Väčšinou ako **náhrada po nevydarenom ozime** (vymrznutie, vyplavenie v zime) alebo špecializované odrody pre pekársku kvalitu.\n\n**Kľúčové rozdiely oproti ozimu (pozri [[psenice-ozima]]):**\n\n| Parameter | Ozimina | Jarina |\n|----------|------|-------|\n| Siatie | september–október | marec–apríl |\n| Vegetácia | 280–310 dní | 110–140 dní |\n| Zber | júl–august | august |\n| Výnos | 6–8 t/ha | 4–6 t/ha |\n| Hektolitrová váha | 76–82 kg/hl | 74–78 kg/hl |\n| Kvalitatívna trieda | E/A/B (potrav) | A/B (potrav) alebo kŕmna |\n| N hnojenie | 150–220 kg/ha | 100–140 kg/ha |\n| Náklady | 28–38 tis. Kč/ha | 20–28 tis. Kč/ha |\n| Riziko pri žatve | vlhké letá = fuzarióza | vlhké letá = poliehanie |\n\n**Kedy sa používa:**\n\n1. **Záplatovacia plodina** — keď ozim vymrzol alebo nebol zasiaty včas (mokrá jeseň)\n2. **Pekárske špeciality** — niektoré odrody majú vyšší lepok pre pekársku kvalitu\n3. **Severné oblasti** ČR (Krkonoše, Šumava) — kde ozim prezimuje zle\n4. **Bio farmy** — kratšia vegetácia = menší tlak chorôb = menej postrekov\n\n**Agrotechnika:**\n\n**Siatie:**\n- **Optimálny termín**: akonáhle pôda umožní vjazd strojom (typicky 10.–25. marca)\n- **Neskoršie siatie** (po 10. apríli) = výnos klesá o 100–200 kg/ha/týždeň\n- **Hĺbka**: 3–5 cm\n- **Hustota**: 450–550 klíčivých zŕn/m² (vyššia než ozim, kvôli kratšej vegetácii a menšiemu odnožovaniu)\n\n**Hnojenie:**\n- **Pri siatí**: 80–100 kg N/ha (rýchly štart, jarka nestihne mineralizovať)\n- **BBCH 32**: 30–50 kg N/ha\n- **BBCH 39**: 20–30 kg N/ha\n- **Celkovo**: 130–180 kg N/ha\n- **P + K**: len polovičné vs ozim (vegetácia kratšia)\n\n**Ochrana**:\n- **Buriny**: post-emergence (Granstar, Hussar) — menej tlaku než ozim\n- **Fungicídy**: 1–2 postreky (T1 + T2) — menej tlaku septoriózy\n- **Insekticídy**: vošky (BYDV), kohútik obilný — pyretroid\n\n**Odrody CZ 2024:**\n- **Septima** — top výnos jarný\n- **KWS Sharki** — pekárska kvalita\n- **Tybalt** — bio prístup, odolnosť\n\n**Ekonomika:**\n- **Náklady**: 22 000–28 000 Kč/ha (nižšie než ozim — menej N, menej postrekov)\n- **Výnos**: 4,5 t/ha × 5 200 Kč = 23 400 Kč/ha\n- **Marža**: typicky -2 000 až +3 000 Kč/ha\n- **Keď záplata po ozime**: aspoň „nejaký výnos\" je lepší než nič\n\n**Výskum a šľachtenie:**\n- **CZ odrody**: VURV Praha-Ruzyně, Selgen\n- **Trend**: hľadať odrody s vyššou toleranciou k suchu (klimatická zmena)\n\nPozri tiež [[psenice-ozima]], [[ozim-jarin]], [[osevni-postup]], [[fungicidy]], [[hektolitr]].",
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
    "shortDef": "Jačmeň sladovnícky je jarná plodina pestovaná na výrobu sladu (pivovarníctvo). ČR má 100 000+ ha. Kľúčové parametre: hl. váha min. 64 kg, dusík 1,5–1,9 % (NÍZKY!), klíčivosť 95+ %. Príplatok za kvalitu 800–1 500 Kč/t.",
    "longDef": "Jačmeň sladovnícky (lat. *Hordeum vulgare*, ang. *malting barley*) je **jarná plodina** pestovaná špecificky na výrobu **sladu** — základnej suroviny pre **pivovarníctvo**. ČR je tradičný producent (Plzeňský prazdroj, Budvar, Staropramen).\n\n**Kľúčový rozdiel od kŕmného jačmeňa** (pozri [[jecmen-krmny]]):\n- **Nízky obsah dusíka** (1,5–1,9 %) — pivovar potrebuje **málo bielkovín, veľa škrobu** na fermentáciu na etanol\n- **Vysoká hl. váha** (min. 64 kg/hl, ideál 68+)\n- **Vyrovnaná veľkosť zrna** (homogénne klíčenie sladu)\n- **Vysoká klíčivosť** (95+ %) — bez klíčenia nie je možné vyrobiť slad\n- **Bez fuzariózy** (mykotoxíny DON v pive neprípustné)\n\n**Agronomické vlastnosti:**\n\n**Sejba:**\n- **Termín**: 10.–25. marca (čím skôr, tým lepšie — odolný voči chladu)\n- **Neskoršia sejba** = vyšší dusík v zrnách (zlé pre slad!)\n- **Hĺbka**: 3–4 cm\n- **Hustota**: 350–420 klíčivých zŕn/m²\n\n**Hnojenie — POZOR:**\n- **N hnojenie**: len 60–100 kg/ha (nižšie ako pšenica!)\n- **Vyšší N → vyššie bielkoviny v zrnách → nesplnenie limitu sladovníctva**\n- **Časovanie**: všetko do BBCH 32 (neskôr sa nestihne odbúrať z listov)\n- **P + K**: 30–50 kg P, 60–100 kg K (štruktúra, hektolitrová váha)\n\n**Ochrana:**\n- **Buriny**: štandard pre jarné obilniny (Granstar, Hussar)\n- **Fungicídy**: T1 (BBCH 31–32) + T2 (BBCH 39–49) — ramulária (Zymoseptoria), múčnatka\n- **Insekticídy**: vošky (BYDV), žrútiky listov\n\n**Kvalitatívne parametre sladovníctva** (ČR štandard):\n\n| Parameter | Min. | Optimum | Penalizácia |\n|----------|------|---------|-----------|\n| Hl. váha | 64 kg/hl | 68+ | -200 Kč/t pod 64 |\n| Dusík | 1,5–1,9 % | 1,5–1,7 % | -500 Kč/t nad 2,1 % |\n| Klíčivosť (4 dni) | 95 % | 98+ % | nedodané pod 90 % |\n| Vyrovnanosť (sito 2,5 mm) | 90 % | 95+ % | -200 Kč/t pod 88 % |\n| Vlhkosť | 14 % max | 13 % | -150 Kč/t nad 15 % |\n\n**Zber:**\n- **Vlhkosť zrna**: 14 % optimum\n- **Dôležité**: nezberať za mokra (DON riziko po dažďoch)\n- **Sušenie**: max 40 °C (vyššia teplota = strata klíčivosti)\n\n**Výnosy:**\n- **Priemer ČR**: 5,2 t/ha\n- **Top farmy**: 7+ t/ha\n- **Výnosy odrôd** vs kŕmný: o 0,5–1 t/ha nižšie (cena za kvalitu)\n\n**Cena 2024:**\n- **Štandard sladovnícky**: 5 800–7 000 Kč/t (kontrakt vopred)\n- **Príplatok za top kvalitu** (nízky N, vysoká klíčivosť): +800–1 500 Kč/t\n- **Kŕmný odbyt** (nesplnil limit): 4 800–5 500 Kč/t\n\n**Odrody ČR 2024:**\n- **Bojos** — najrozšírenejší, vysoká hl. váha\n- **Laudis** — moderný, výnos + kvalita\n- **Calcule** — Heineken kontrakt\n- **Spartacus** — nový, vysoký výnos\n- **Bonus** — odolný voči chladu\n\n**Trh a kontrakty:**\n\n**Zmluvné pestovanie** (dominantné):\n- **Plzeňský prazdroj** — kontrakt s farmármi 1 rok dopredu, garantovaná cena\n- **Budvar** — vlastný výkup\n- **Staropramen** — Belgické vlastníctvo, kontrakt EU pivovarní skupina\n- **Heineken** — globálny buyer\n\n**Spotový trh** (voľný predaj):\n- **MATIF** (Paríž) — futures cena jačmeňa\n- **Volatilný** — závisí od úrody v EU, Rusku, Ukrajine\n\n**Export:**\n- ČR exportuje 200 000–300 000 t/rok sladovníckeho jačmeňa (Nemecko, Veľká Británia, Belgicko)\n\n**Klimatická zmena:**\n- **Sucho v apríli–júni** = krátka vegetácia = vysoký N v zrnách\n- **Pivovary tlačia** na pestovanie v severnejších oblastiach (Poľsko, Škandinávia)\n- **Šľachtenie**: hľadá odolnosť voči suchu\n\n**Pozn.**: ČR má **historickú tradíciu** — Žatecký chmeľ + sladovnícky jačmeň = základ českej pivnej kvality, identita štátu.\n\nPozri tiež [[jecmen-krmny]], [[psenice-ozima]], [[fungicidy]], [[hektolitr]], [[ozim-jarin]].",
    "related": [
      "jecmen-krmny",
      "psenice-ozima",
      "fungicidy",
      "hektolitr"
    ]
  },
  {
    "slug": "jecmen-krmny",
    "term": "Jačmeň kŕmný",
    "alias": [
      "feed barley",
      "kŕmný jačmeň ozimý/jarný",
      "Hordeum vulgare feed"
    ],
    "kategorie": "plodiny",
    "shortDef": "Jačmeň kŕmný je ozimá alebo jarná plodina na kŕmenie hovädzieho dobytka, ošípaných, hydiny. Vyšší výnos (6–8 t/ha) ako sladovnícky, vyšší dusík. Cena 4 600–5 400 Kč/t. ČR má 150 000+ ha (kombinácia ozim + jarný).",
    "longDef": "Jačmeň kŕmný (lat. *Hordeum vulgare*, ang. *feed barley*) je **ozimá alebo jarná plodina** pestovaná na **kŕmenie hospodárskych zvierat** (hovädzí dobytok, ošípané, hydina). Na rozdiel od sladovníckeho (pozri [[jecmen-sladovnicky]]) nemá požiadavky na nízky dusík — naopak vyšší N znamená vyššie bielkoviny v krmive = vyššia hodnota.\n\n**Agronomické vlastnosti:**\n\n**Ozimý vs jarný kŕmný jačmeň:**\n\n| Parameter | Ozimý | Jarný |\n|----------|-------|-------|\n| Sejba | september–október | marec–apríl |\n| Zber | júl | august |\n| Výnos | 7–9 t/ha | 5–7 t/ha |\n| N hnojenie | 140–180 kg | 90–130 kg |\n| Náklady | 25 000–32 000 Kč/ha | 20 000–25 000 Kč/ha |\n\n**Ozimý dominuje** v ČR pre kŕmne účely (lepšie výnosy).\n\n**Sejba (ozim):**\n- **Termín**: 20. september – 15. október (= skôr ako ozimá pšenica o 1–2 týždne)\n- **Hĺbka**: 3–4 cm\n- **Hustota**: 350–420 klíčivých zŕn/m²\n\n**Hnojenie (ozim):**\n- **Jeseň**: 20 kg N + 40 kg P + 80 kg K (= NPK 15-15-15 200 kg/ha)\n- **Jar BBCH 25**: 60–80 kg N/ha (LAV, DAM)\n- **Jar BBCH 32**: 40–60 kg N/ha\n- **Celkovo N**: 130–180 kg/ha\n\n**Kŕmné použitie:**\n\n**Pre hovädzí dobytok:**\n- **Šrot** (pozri [[srotovnik]]) — drvené zrno do TMR (pozri [[tmr]])\n- **Dávka**: 3–6 kg kŕmnej dávky / krava / deň\n- **Nutričné hodnoty**: 12 % CP, 7,5 MJ NEL/kg, vysoký škrob\n\n**Pre ošípané:**\n- **Jemnejšie mletý šrot** — 30–60 % kŕmnej zmesi\n- **Pomáha** tráveniu (vláknina), menej škrobu ako kukurica\n\n**Pre hydinu:**\n- **Mláti sa** — 10–20 % kŕmnej zmesi (menej ako kukurica — vyššia vláknina nie ideálna pre hydinu)\n- **Špeciálne pre nosnice** (vyššia vláknina = lepšia peristaltika)\n\n**Cena 2024:**\n- **Kŕmný jačmeň**: 4 600–5 400 Kč/t\n- **Rozdiel oproti sladovníckemu**: -800 až -1 500 Kč/t (závisí od momentálneho dopytu sladovníctva)\n\n**Zber:**\n- **Vlhkosť zrna**: 14 % optimum\n- **Menej náročný timing** ako sladovnícky (nie je nutné vyhýbať sa zberu za mokra — pre kŕmenie to nevadí)\n\n**Odrody:**\n\n**Ozimé kŕmné:**\n- **KWS Tenor** — top výnos\n- **Cassia** — populárna, robustná\n- **Wootan** — moderný, kŕmný kontrakt\n\n**Jarné kŕmné:**\n- **Vladimir** — výnosný\n- **Salome** — nezávislosť\n\n**Choroby a ochrana:**\n- **Rynchosporium** (škvrnitosť jačmeňa) — typická pre jačmeň\n- **Ramulária** (listová) — rastúci problém 2020s\n- **Múčnatka jačmeňa** — častý problém\n- **Fungicídy**: T1 + T2 (ako u pšenice, pozri [[fungicidy]])\n- **Insekticídy**: vošky (BYDV), kohútik obilný\n\nPozri tiež [[jecmen-sladovnicky]], [[psenice-ozima]], [[tmr]], [[krmne-davky]], [[hektolitr]], [[srotovnik]].",
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
      "ozimné žito"
    ],
    "kategorie": "plodiny",
    "shortDef": "Žito ozimé je obilnina pestovaná na chudobných pôdach a v severnejších/horských oblastiach ČR. Výnos 5–7 t/ha, cena 4 200–5 200 Kč/t. Hlavné použitie: chlieb (kvasený žitný chlieb), žitné celozrnné pečivo, liehovary, krmivo.",
    "longDef": "Žito ozimé (lat. *Secale cereale*, ang. *rye*) je **ozimá obilnina**, historicky druhá najdôležitejšia po pšenici v ČR. Dnes skôr okrajová plodina — pestuje sa na **chudobných piesčitých pôdach** a v **horských oblastiach**, kde pšenica nedáva dobré výnosy.\n\n**Plocha v ČR 2024**: ~25 000 ha (klesajúci trend, v 1950s bolo 400 000+ ha)\n\n**Vlastnosti:**\n\n**Agrotechnika:**\n\n**Sejba:**\n- **Termín**: 1.–25. septembra (= skôr ako pšenica o 2–3 týždne — žito vyžaduje dlhší jesenný rast)\n- **Hĺbka**: 2–4 cm\n- **Hustota**: 280–350 klíčivých zŕn/m² (menej ako pšenica — žito veľa odnožuje)\n- **Vhodná predplodina**: zemiaky, repka, strukoviny\n\n**Hnojenie:**\n- **Jeseň**: 20 kg N + 30 kg P + 60 kg K\n- **Jar BBCH 25**: 50–70 kg N/ha\n- **Jar BBCH 32**: 30–50 kg N/ha\n- **Celkovo N**: 80–120 kg/ha (menej ako pšenica — žito je tolerantné k chudobným pôdam)\n\n**Zber:**\n- **Vlhkosť**: 13–15 %\n- **Riziko poliehania**: žito je vyššie (130–180 cm) ako pšenica (90–110 cm) — vietor ho ľahko položí\n\n**Výnosy:**\n- **Priemer ČR**: 5,5 t/ha (zlepšenie vs história vďaka hybridnému žitu)\n- **Hybridné žito** (KWS Sortiment): 7–8 t/ha (lepšie ako tradičné populácie)\n\n**Použitie:**\n\n**1. Chlieb a pečivo (60 % spotreby):**\n- **Žitný kvas** — nutný pre chlieb (proteíny žita netvoria lepok ako pšenica)\n- **Šumavský chlieb, podpisový žitný** — tradičné české pekárstvo\n- **Žitné múky**: ražná T75 (svetlá), T80 (chlebová), T200 (celozrnná)\n\n**2. Liehovary (15 %):**\n- **Žitný lieh** — tradičný český destilát (mladá žitná, ražná pálenka)\n- **Vodka** — Poľsko, Rusko (iná tradícia)\n\n**3. Krmivo (20 %):**\n- **Pre hovädzí dobytok**: do TMR ako alternatíva pšenice\n- **Pre ošípané**: len do 20 % zmesi (vyššia vláknina)\n\n**4. Biopalivá / bioetanol (5 %):**\n- **Niektoré EU krajiny** (Nemecko) dotovali bioetanol zo žita\n\n**Cena 2024:**\n- **Potravinárske žito**: 4 600–5 200 Kč/t\n- **Kŕmné žito**: 4 200–4 600 Kč/t\n- **Bio žito**: 6 800–8 500 Kč/t (premium pre bio pekárstvo)\n\n**Hybridné žito** (kľúčový technologický skok od 1990s):\n- **KWS** (Nemecko) dominuje trhom hybridného žita\n- **Tepelný systém** opylovania — F1 hybridi len z certifikovaného osiva (nie je možné zberať na osivo)\n- **Výnos**: +30–50 % vs tradičné populácie\n- **Cena osiva**: 4–6× vyššia ako tradičné (kompenzované výnosom)\n\n**Odrody ČR 2024:**\n- **KWS Bono** — hybrid, top výnos\n- **KWS Vinetto** — hybrid, robustný\n- **Selgo** — tradičná populácia, lacné osivo\n- **Souvenir** — bio prístup\n\n**Choroby a ochrana:**\n- **Námeľ (paličkovica, ergot)** — *Claviceps purpurea* — historicky **šialenstvo v Európe**, dnes pod kontrolou. **Mykotoxíny** (ergotamíny), riziko v daždivých rokoch.\n- **Hrdze** (pozri [[rzi]]) — menej tlaku ako pšenica\n- **Septoriózy** — minimálne\n- **Postreky**: ľahší program ako pšenica (1 fungicíd)\n\n**EU regulácie:**\n- **Priame platby** (BISS, redistributívna platba) rovnaké ako pri pšenici\n- **Ekologické poľnohospodárstvo** — žito je obľúbené na ekologických farmách (menej postrekov, robustné)\n\n**Kultúrna dimenzia:**\n- **Žito je „chudobná\" plodina** — historicky ľudia chudobní jedli žitný chlieb, bohatí pšeničný\n- **Dnes obrátený trend** — žitný chlieb je „zdravší\" imidž (vyššia vláknina, lepší index glykémie)\n- **Tmavé pečivo** — celozrnné žitné, žitné krekry — trend wellness\n\nPozri tiež [[psenice-ozima]], [[oves-jarni]], [[ozim-jarin]], [[rzi]], [[hektolitr]].",
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
    "shortDef": "Oves jarný je obilnina pestovaná hlavne v severnejších a chladnejších oblastiach ČR. Výnos 3,5–5 t/ha, cena 4 000–5 500 Kč/t. Použitie: krmivo pre kone, ľudská konzumácia (vločky, müsli), zelené krmivo.",
    "longDef": "Oves jarný (lat. *Avena sativa*, ang. *oats*) je **jarná obilnina** s tradíciou v ČR na chudobnejších a chladnejších pôdach. Plocha v ČR 2024: ~35 000 ha. Trend: rastúci kvôli zdravotnému pozitívnemu imidžu (ovsené vločky, plant-based).\n\n**Vlastnosti:**\n\n**Agrotechnika:**\n\n**Sejba:**\n- **Termín**: 15. marca – 15. apríla (znáša chlad, skorá sejba)\n- **Hĺbka**: 3–4 cm\n- **Hustota**: 350–450 klíčivých zŕn/m²\n\n**Hnojenie:**\n- **Pri sejbe**: 60–80 kg N/ha\n- **BBCH 32**: 30–40 kg N/ha\n- **Celkom N**: 80–120 kg/ha (oves nezužitkuje vysoké N, poľahne)\n\n**Zber:**\n- **Vlhkosť**: 13–15 %\n- **Riziko poliehania**: vysoké (110–140 cm), tenké steblo\n- **Kľúčové**: NEpreháňať to s N\n\n**Výnosy:**\n- **Priemer ČR**: 4,2 t/ha\n- **Top farmy**: 6+ t/ha\n\n**Použitie:**\n\n**1. Ľudská konzumácia (45 %):**\n- **Ovsené vločky** (rolled oats) — parené + valcované zrno\n- **Müsli, granola** — populárna zdravá raňajka\n- **Ovsené mlieko** (oat milk) — silný trend 2020s, plant-based náhrada\n- **Pekárstvo** — celozrnný chlieb s ovsenými vločkami\n- **Diéta** — ovsené vločky obsahujú **β-glukán** (vláknina, znižuje cholesterol)\n\n**2. Krmivo pre kone (35 %):**\n- **Tradičné koňské krmivo** — energia + vláknina + dobrá stráviteľnosť\n- **2–6 kg/kôň/deň** podľa zaťaženia\n- **Dostihové kone** — vyšší podiel ovsa\n\n**3. Krmivo pre dobytok (15 %):**\n- **Menej časté** než jačmeň\n- **Pre mladé teľatá** — ľahko stráviteľné\n\n**4. Zelené krmivo / krycia plodina (5 %):**\n- **Oves ako krycia plodina** — biomasa pre mulč, sekvestráciu uhlíka\n- **Miešanka ovsa a vičky** — strukovinovo-obilná zmes na krmivo\n\n**Cena 2024:**\n- **Potravinársky oves** (premium pre vločky): 5 200–5 800 Kč/t\n- **Kŕmný oves**: 4 200–4 800 Kč/t\n- **Bio oves**: 7 500–9 500 Kč/t (vysoké premium pre bio müsli)\n\n**Odrody ČR 2024:**\n- **Atego** — top výnos kŕmný\n- **Husar** — potravinársky\n- **Rozmar** — tradičná populácia\n- **Spurt** — moderný, robustný\n\n**Choroby:**\n- **Hrdza ovsená** (Puccinia coronata) — listová\n- **Helminthosporium** (škvrnitosť) — vlhké letá\n- **Menej tlaku** než pšenica → menej postrekov\n\n**Ochrana:**\n- **Buriny**: pre-emergence (Stomp)\n- **Fungicídy**: 1 postrek T2 (BBCH 39) — preventívny\n- **Insekticídy**: minimálne (vošky BYDV)\n\n**Bio prístup:**\n- **Oves** je ideálny pre bio farmu (málo postrekov, robustný)\n- **Bio cena premium** kompenzuje výnos -20 % vs konvenčné\n\n**Ekonomika:**\n- **Náklady**: 18 000–24 000 Kč/ha\n- **Výnos 4,5 t/ha × 4 800 Kč = 21 600 Kč/ha**\n- **Marža**: typicky úzka (-1 000 až +3 000 Kč/ha)\n- **Plus priame platby** (BISS, redistributívna platba, ekoplatba): robia z toho výhodnejšiu plodinu\n\n**Trh a trendy:**\n- **Plant-based revolúcia** — ovsené mlieko = 2x rast spotreby 2020s\n- **Oat milk vs almond milk** — ovsené mlieko má lepšiu environmentálnu stopu, šírenie v EÚ\n- **Bio oves**: rastúci dopyt pre Hipp detskú výživu, Müsli zdroje\n\nPozri tiež [[psenice-ozima]], [[zito-ozime]], [[ozim-jarin]], [[hektolitr]], [[mezi-plodiny]].",
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
    "shortDef": "Tritikale je obilnina vzniknutá krížením pšenice (Triticum) a žita (Secale). Kombinuje vlastnosti oboch — výnos pšenice + odolnosť žita. Hlavne kŕmné použitie, výnos 6–8 t/ha, cena 4 400–5 200 Kč/t.",
    "longDef": "Tritikale (lat. *× Triticosecale*, ang. *triticale*) je **umelo vyšľachtená obilnina** vzniknutá krížením **pšenice** (*Triticum*) × **žita** (*Secale cereale*). Kombinuje vlastnosti oboch rodičov: **výnos pšenice + odolnosť žita** k chudobným pôdam a chorobám.\n\n**História:**\n- **1875** — prvý kríženec opísaný škótskym šľachtiteľom Stephenom Wilsonom\n- **1960s** — CIMMYT (Mexiko) zahájil systematický šľachtiteľský program\n- **1980s** — masové rozšírenie v Európe (Poľsko, Nemecko, ČSSR)\n- **2024** — globálna plocha 15 mil. ha (Poľsko #1, Nemecko #2, ČR ~50 000 ha)\n\n**Vlastnosti:**\n\n**Ozimné vs jarné tritikale:**\n- **Ozimné** dominuje v ČR (90 % plochy)\n- **Jarné** len ako náhrada po nevydarenom ozimnom\n\n**Sejba (ozim):**\n- **Termín**: 15. septembra – 5. októbra\n- **Hĺbka**: 3–5 cm\n- **Hustota**: 320–400 klíčivých zŕn/m²\n- **Vhodná predplodina**: zemiaky, repka, strukoviny\n\n**Hnojenie:**\n- **Jeseň**: 25 kg N + 30 kg P + 60 kg K\n- **Jar BBCH 25**: 60–80 kg N/ha\n- **Jar BBCH 32**: 30–50 kg N/ha\n- **Celkom N**: 100–140 kg/ha (medzi pšenicou a žitom)\n\n**Zber:**\n- **Vlhkosť**: 13–15 %\n- **Stredné riziko poliehania** (medzi pšenicou a žitom)\n\n**Výnosy:**\n- **Priemer ČR**: 6,8 t/ha\n- **Top farmy**: 9+ t/ha\n- **Lepšie než žito** o 1–2 t/ha, **mierne pod pšenicou** o 0,5–1 t/ha\n\n**Použitie:**\n\n**1. Krmivo (85 %):**\n- **Pre dobytok**: do TMR (pozri [[tmr]]) — substitúcia pšenice/jačmeňa\n- **Pre prasatá**: hlavná obilná zložka\n- **Pre hydinu**: 20–40 % zmesi\n\n**2. Bioetanol (10 %):**\n- **Liehovary** — vysoký škrob, dobrá fermentácia\n- **EÚ dotované** v niektorých krajinách (Poľsko, Nemecko)\n\n**3. Ľudská konzumácia (5 %):**\n- **Špecifické pečivo** (zdravotne orientované)\n- **Müsli** zmesi\n- **Menej rozvinutá** kategória\n\n**Cena 2024:**\n- **Kŕmné tritikale**: 4 400–5 000 Kč/t\n- **Bioetanol kontrakt**: 4 200–4 600 Kč/t\n- **Bio tritikale**: 6 500–8 000 Kč/t\n\n**Odrody ČR 2024:**\n- **Trisem** — top výnos\n- **Triamant** — odolnosť\n- **Kassiopeia** — moderný DE import\n- **Borowik** — poľský import\n\n**Choroby a ochrana:**\n- **Septorióza** — menej tlaku než pšenica\n- **Hrdze** — priemerný tlak (citlivejšie než žito, menej než pšenica)\n- **Múčnatka** — menej tlaku\n- **Postreky**: 1–2 fungicídy (menej intenzívne než pšenica)\n- **Ekologické poľnohospodárstvo**: vhodné (menej postrekov)\n\n**Výhody tritikale:**\n1. **Robustný** — toleruje chudobné pôdy, sucho\n2. **Menej postrekov** — nižšie náklady, vhodný pre bio\n3. **Vysoký výnos** vs žito\n4. **Stráviteľný** pre dobytok a prasatá\n5. **Použiteľnosť ako krycia plodina** — biomasa pre mulč\n\n**Nevýhody:**\n1. **Nižšia cena** než potravinárska pšenica\n2. **Limitovaný trh** ľudskej konzumácie\n3. **Menej odrôd** než pšenica/jačmeň\n\n**Ekonomika:**\n- **Náklady**: 22 000–28 000 Kč/ha\n- **Výnos 7 t/ha × 4 700 Kč = 32 900 Kč/ha**\n- **Marža**: 4 000–10 000 Kč/ha (lepšie než pšenica!)\n- **Priame platby** (BISS, redistributívna platba, ekoplatba): štandardné\n\n**Strategicky pre ČR:**\n- **Pre stredne veľkú farmu** v ANC (Vysočina, Beskydy) — tritikale je často **lepšia voľba než pšenica**\n- **Pre bio farmu** — menej tlaku chorôb, nižšie vstupy\n- **Pre chov dobytka** — vlastné krmivo z vlastného poľa\n\nPozri tiež [[psenice-ozima]], [[zito-ozime]], [[jecmen-krmny]], [[ozim-jarin]], [[krmne-davky]].",
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
    "term": "Mak siaty",
    "alias": [
      "poppy",
      "Papaver somniferum",
      "mak modrosemenný"
    ],
    "kategorie": "plodiny",
    "shortDef": "Mak siaty je jarná olejnatá plodina, kde je ČR globálnou veľmocou — produkuje 50–70 % svetového potravinárskeho maku (modré semeno). Výnos 0,8–1,4 t/ha semien, cena 35 000–55 000 Kč/t. Hlavný produkt: pekárske semienko, makový olej, makovice (obmedzené kvôli opioidom).",
    "longDef": "Mak siaty (lat. *Papaver somniferum*, ang. *opium poppy* alebo *poppy seed*) je **jarná olejnatá plodina** a globálne špecifická — **ČR produkuje 50–70 % svetového potravinárskeho maku** (modré semeno pre pekárske použitie). Tradičná oblasť: Haná, Polabí, Vysočina.\n\n**Plocha v ČR 2024**: 30 000–40 000 ha (kolíše podľa ceny)\n**Produkcia**: 25 000–35 000 t/rok\n\n**Vlastnosti:**\n\n**Agrotechnika:**\n\n**Sejba:**\n- **Termín**: 25. marca – 25. apríla (znáša neskoré mrazy)\n- **Hĺbka**: 0,5–1 cm (drobné semienko, plytká sejba!)\n- **Hustota**: 80–100 klíčivých zŕn/m² (= 1,5–2 kg osiva/ha, HW 0,4g)\n- **Vzdialenosť riadkov**: 25–30 cm (úzke) alebo 45 cm (širšie pre plečku)\n\n**Hnojenie:**\n- **Pri sejbe**: 60–80 kg N/ha\n- **BBCH 30**: 30–50 kg N/ha\n- **Celkom N**: 80–130 kg/ha\n\n**Ochrana:**\n- **Buriny**: pre-emergence (Bromotril, Metaza Plus) + post-emergence\n- **Insekticídy**: krytonos makový (Ceutorhynchus macula-alba), žravé škodce\n- **Fungicídy**: helmintosporióza, pleseň maku — menej tlaku\n- **Mak je „čistá\" plodina** — málo postrekov, vhodný pre bio\n\n**Zber:**\n- **Termín**: august, vlhkosť makovíc 12–14 %\n- **Zberač maku** — špeciálny adaptér na kombajn (oddeliť semienka z makovíc)\n- **Kľúčové**: nevysypať semienka pri manipulácii\n\n**Výnosy:**\n- **Priemer ČR**: 0,9 t/ha semien\n- **Top farmy**: 1,4 t/ha\n- **Náklady na 1 ha**: 18 000–25 000 Kč\n\n**Použitie:**\n\n**1. Pekárske semienko (modré semeno, 80 %):**\n- **Tradičné české pekárstvo** — buchty s makom, makový závin, makovice\n- **Export**: Nemecko, Nizozemsko, USA, Poľsko\n- **Cena 2024**: 35 000–55 000 Kč/t (vysoká volatilita)\n\n**2. Makový olej (10 %):**\n- **Lisovanie** modrých semien\n- **Olej** — premium kulinársky olej, vysoká cena\n- **Hladký omega-6 profil**, dobrá chuť\n\n**3. Makovice (5 %):**\n- **Sušené makovice** — historicky pre ľudovú medicínu (sedatívne)\n- **Kvôli opioidom** (morfín, kodeín) v makoviciach — **obmedzené použitie**, regulované\n- **Farmaceutický priemysel** — extraktívna výroba opioidných liekov\n\n**Legálne a regulačné aspekty:**\n- **Česká legislatíva**: pestovanie maku **legálne** pre potravinárske + farmaceutické účely\n- **Ohlasovacia povinnosť v ČR**: kto pestuje mak na celkovej ploche nad 100 m², hlási ÚKZÚZ výmeru osevu (do konca mája), zneškodnenie makoviny (najneskôr 5 dní vopred) a zber (do konca decembra) — § 29 českého zákona č. 167/1998 Sb. o návykových látkach\n- **Podozrivé okolnosti** (narezané alebo odcudzené makovice, vstup cudzích osôb do porastu) musí pestovateľ bezodkladne oznámiť Polícii ČR\n- **Makovina** (nadzemné časti okrem semien) sa po zbere zneškodňuje podľa zákona; jej vývoz a dovoz vyžaduje povolenie Ministerstva zdravotníctva ČR\n\n**Trh a marketing:**\n- **Spotový trh** vs **kontraktové pestovanie**\n- **Cenová volatilita**: 30 000 ↔ 70 000 Kč/t v rozsahu 2 rokov\n- **Export**: 70 % českej produkcie ide do EÚ + USA\n\n**Odrody ČR 2024:**\n- **Major** — modré semeno, top výnos\n- **Maratón** — robustnosť\n- **Opal** — biele semeno (export do Ázie)\n- **Onyx** — moderný\n\n**Ekonomika:**\n- **Náklady**: 18 000–25 000 Kč/ha\n- **Výnos 1 t × 45 000 Kč = 45 000 Kč/ha**\n- **Marža**: 20 000–27 000 Kč/ha (vysoká!)\n- **Riziko**: cenová volatilita + výnosy citlivé na počasie\n\n**Kultúrny význam:**\n- **Mak v českej kuchyni** — kultúrna identita (makovice, závin, koláče)\n- **Vianoce** — tradičné múčne pokrmy s makom\n- **Veľká noc** — kraslicová záhrada s makmi\n\n**Klimatická zmena:**\n- **Sucho v apríli–júni** = nižší výnos\n- **Vlhké letá** = pleseň makovíc\n- **Kľúčové**: hlboké korene (znášajú sucho lepšie než pšenica)\n\n**Bio mak:**\n- **Bio mak** = 50–80 % vyššia cena\n- **Trh malý** ale rastie (organic premium pre vegetariánske/zdravotné pekárstvo)\n\nPozri tiež [[ozim-jarin]], [[slunecnice]], [[repka-ozima]], [[hrach-set]].",
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
    "shortDef": "Slnečnica je jarná olejnatá plodina s rastúcim významom v ČR (klimatická zmena). Plocha 30 000–50 000 ha, výnos 2,5–4 t/ha, cena 13 000–17 000 Kč/t (high oleic premium +2 000). Hlavné použitie: olej, krmivo (šrot), biopalivá, vtáctvo (semienka).",
    "longDef": "Slnečnica ročná (lat. *Helianthus annuus*, ang. *sunflower*) je **jarná olejnatá plodina** z rodu *Asteraceae*. V ČR dlhodobo marginálna, ale **rastúci význam** kvôli klimatickej zmene (vyššie teploty + sucho = vhodné pre slnečnicu).\n\n**Plocha v ČR 2024**: 35 000–50 000 ha (10× nárast od 2010)\n**Produkcia**: 110 000–150 000 t/rok\n\n**Vlastnosti:**\n\n**Agrotechnika:**\n\n**Sejba:**\n- **Termín**: 15.–30. apríla (po posledných jarných mrazoch)\n- **Hĺbka**: 4–5 cm\n- **Hustota**: 5–7 rastlín/m² (spon 70 × 25 cm)\n- **Vzdialenosť riadkov**: 70 cm (ako kukurica — kompatibilná s kukuričnou plečkou)\n\n**Hnojenie:**\n- **Pri sejbe**: 80–100 kg N/ha + 50 kg P + 100 kg K\n- **Celkom N**: 100–140 kg/ha (nižšie ako kukurica)\n- **Bór** (B 1 kg/ha) — kritický prvok pre tvorbu úborov\n\n**Ochrana:**\n- **Buriny**: pre-emergence (Stomp) + post-emergence\n- **Fungicídy**: biela hniloba *Sclerotinia*, hnedá hniloba *Phomopsis* — 1–2 postreky\n- **Insekticídy**: minimálne (menej škodcov ako repka)\n\n**Zber:**\n- **Termín**: september–október, vlhkosť zrna 10–12 %\n- **Desikácia** (pozri [[desikace]]): glyfosátom ju v EÚ od decembra 2023 povoliť nemožno; či je pre slnečnicu povolený iný prípravok, overte v registri ÚKSÚP\n- **Kombajn**: špeciálny slnečnicový adaptér (dlhšie prsty)\n- **Kľúčové**: nevyberať príliš nahor = strata\n\n**Výnosy:**\n- **Priemer ČR**: 2,8 t/ha\n- **Top farmy** (južná Morava): 4+ t/ha\n- **EU TOP** (Francúzsko, Maďarsko): 3,5–4,5 t/ha\n\n**Použitie:**\n\n**1. Slnečnicový olej (60 %):**\n- **Štandardný olej** — kuchyňa, šalátový olej, vyprážanie\n- **Slnečnicový olej** je **najlacnejší rastlinný olej** v EU\n- **Spotreba v ČR**: 6 kg/osoba/rok\n\n**2. High-oleic odrody (15 %):**\n- **Vysoký obsah kyseliny olejovej** (oleic acid) — 80+ % namiesto štandardných 30 %\n- **Stabilný pri vysokých teplotách** — na fritovanie, McDonald's, vyprážanie v gastronómii\n- **Premium cena**: +1 500–2 500 Kč/t vs štandard\n- **Odrody**: NK Neoma (Syngenta), LG 50.270 HO (Limagrain)\n\n**3. Slnečnicový šrot (15 %):**\n- **Vedľajší produkt** lisovania oleja\n- **Krmivo**: 30–35 % CP, vhodné pre dobytok, prasatá\n- **Cena**: 6 500–8 500 Kč/t\n\n**4. Vtáci (potrava, 5 %):**\n- **Celé nelúpané semienko** — pre vtáčiky, kŕmidlá\n- **Cena**: vysoký premium (15 000–25 000 Kč/t)\n\n**5. Biopalivá (5 %):**\n- **Bionafta** zo slnečnicového oleja\n- **EU dotované** (RED II Renewable Energy Directive)\n\n**Cena 2024:**\n- **Štandard slnečnice**: 13 000–16 000 Kč/t\n- **High-oleic**: +1 500–2 500 Kč/t\n- **Bio slnečnica**: 22 000–28 000 Kč/t\n\n**Odrody ČR 2024:**\n- **LG 50.270 HO** (Limagrain) — high oleic, top výnos\n- **NK Neoma** (Syngenta) — high oleic populárna\n- **ES Janis** (Euralis) — štandard, robustná\n- **Pioneer P63LE10** — vysoký výnos\n\n**Choroby:**\n- **Biela hniloba** (*Sclerotinia sclerotiorum*) — vlhké letá, strata 10–30 %\n- **Hnedá hniloba** (*Phomopsis helianthi*) — listová + úborová\n- **Pleseň slnečnice** (*Plasmopara halstedii*) — preventívne morenie osiva\n- **Postreky**: 1–2 fungicídy v sezóne (BBCH 51 + 65)\n\n**Škodcovia:**\n- **Drobní chrobáci** — menší tlak než repka\n- **Vtáci** — znížia zber o 5–15 %, najmä holuby a kŕdle\n\n**Ekonomika:**\n- **Náklady**: 22 000–28 000 Kč/ha\n- **Výnos 3 t × 14 500 Kč = 43 500 Kč/ha**\n- **Marža**: 15 000–20 000 Kč/ha (atraktívne!)\n- **Priame platby** (BISS, redistributívna platba, ekoplatba): štandardné\n\n**Strategický význam pre ČR:**\n- **Rast plochy 2010s** vs repka — alternatíva s nižším postrekovým tlakom\n- **Klimatická vhodnosť** — južná Morava, Polabie, Slovácko\n- **Severnejšia časť ČR** (Vysočina, Krkonoše): menej vhodné kvôli kratšej vegetácii\n\n**Klimatická zmena:**\n- **Pozitívny dopad** — slnečnica je teplomilná plodina, profituje z teplých rokov\n- **Sucho** — tolerantná (hlboké korene)\n- **Riziko**: neskoré mrazy v apríli (zničia klíčiaci porast)\n\nPozri tiež [[repka-ozima]], [[ozim-jarin]], [[fungicidy]], [[desikace]], [[mak-ozimy]].",
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
    "shortDef": "Horčica siata (biela horčica) je jarná kapustovitá plodina pre výrobu horčice (korenené omáčky) a ako medziplodina pre zelené hnojenie. Plocha v ČR 5 000–15 000 ha. Krátka vegetácia 90–110 dní. Výnos 1–2 t/ha semien, cena 13 000–18 000 Kč/t.",
    "longDef": "Horčica siata (lat. *Sinapis alba*, „biela horčica\", ang. *white mustard*) je **jarná kapustovitá plodina** s krátkou vegetačnou dobou (90–110 dní). Hlavne pre **výrobu horčice** (ako korenená omáčka) a **ako medziplodina** pre zelené hnojenie.\n\n**Plocha v ČR 2024**: 5 000–15 000 ha pre semeno + 100 000+ ha ako medziplodina\n\n**Vlastnosti:**\n\n**Agrotechnika:**\n\n**Sejba:**\n- **Termín**: 25. marca – 25. apríla (semienko pre zber) ALEBO 1.–15. augusta (medziplodina po zbere obilnín)\n- **Hĺbka**: 1,5–2 cm\n- **Hustota**: 200–300 klíčivých zŕn/m² (= 8–12 kg osiva/ha)\n\n**Hnojenie:**\n- **Pre semeno**: 60–80 kg N/ha\n- **Pre medziplodinu**: bez hnojenia (využije zvyšok z predplodiny)\n- **P + K**: 30 P + 60 K\n\n**Ochrana:**\n- **Buriny**: pre-emergence (Stomp) + post-emergence\n- **Insekticídy**: krytonos stonkový, blyskáčik repkový — pyretroid\n- **Fungicídy**: minimálny tlak\n\n**Zber:**\n- **Termín**: koniec júla–august, vlhkosť 10–12 %\n- **Zjednotenie dozrievania**: desikáciu glyfosátom v EÚ od decembra 2023 povoliť nemožno — zberá sa v plnej zrelosti\n- **Kombajn**: štandardný obilný žací adaptér\n\n**Výnosy:**\n- **Priemer ČR**: 1,3 t/ha\n- **Top farmy**: 2+ t/ha\n\n**Použitie:**\n\n**1. Horčica korenina (60 % výroby):**\n- **Mletá horčica + ocot + soľ + voda + korenie** = korenená omáčka\n- **Český národný pokrm** (svíčková, rezník)\n- **Pražská horčica, plnotučná horčica** — české typy\n- **Globálne značky**: Hellmann's, Heinz, Maille — všetky od slnečnice siatej\n\n**2. Medziplodina (30 % plôch — najväčšie využitie!):**\n- **Zber pšenice/jačmeňa** → ihneď sejba horčice → vegetačné obdobie do prvých mrazov → zapracovanie do pôdy na jeseň alebo na jar\n- **Účinky**:\n  - **Zelené hnojenie** — biomasa sa rozkladá v pôde\n  - **Sekvestrácia C** — korene + biomasa\n  - **Potláčanie burín** — horčica rýchlo pokryje pôdu\n  - **Glukosinoláty v pôde** — biofumigácia (potláča patogény)\n  - **Ekoplatba** — horčica ako medziplodina sa v ČR (2025) môže započítať do neprodukčných plôch variantu B\n- **Cena osiva pre medziplodinu**: 600–1 000 Kč/ha\n\n**3. Olej (5 %):**\n- **Horčicový olej** — špecifický východoeurópsky kulinársky olej (NL, Poľsko)\n- **V ČR vzácny**\n\n**4. Krmivo (5 %):**\n- **Horčicový šrot** (po lisovaní oleja) — pre dobytok\n- **Pozor**: glukosinoláty môžu spôsobiť problémy u ošípaných\n\n**Cena 2024:**\n- **Horčicové semeno**: 13 000–18 000 Kč/t\n- **Bio horčica**: 18 000–25 000 Kč/t (Hellmann's bio kontrakt)\n\n**Odrody ČR 2024:**\n- **Veronica** — výnosná\n- **Severka** — robustná\n- **Andromeda** — moderná\n\n**Choroby a škodcovia:**\n- **Rovnaké ako repka** ale menej tlaku (krátka vegetácia)\n- **Blyskáčik repkový** (*Meligethes aeneus*) — žerie kvetné puky\n- **Pleseň kapustovitých** (*Peronospora parasitica*) — minimálny tlak\n\n**Výhody horčice:**\n1. **Krátka vegetácia** — flexibilná v osevnom postupe\n2. **Lacné osivo**\n3. **Hodnota ako medziplodina** — neprodukčné plochy ekoplatby, zelené hnojenie, biofumigácia\n4. **Robustná** — málo postrekov\n\n**Nevýhody:**\n1. **Nízky výnos** (1–2 t/ha vs 8 t/ha pšenice)\n2. **Marginálna plocha** pre semeno\n3. **Cenová volatilita** — citlivá na dopyt potravinárskeho priemyslu\n\n**Ekonomika:**\n\n**Pre semeno (1,3 t/ha × 15 000 Kč = 19 500 Kč/ha):**\n- **Náklady**: 12 000–15 000 Kč/ha\n- **Marža**: 4 500–7 500 Kč/ha (mierna)\n- **Plus priame platby**: BISS a redistributívna platba\n\n**Pre medziplodinu:**\n- **Náklady**: 1 000–1 500 Kč/ha (osivo + sejba)\n- **Prínos**: hlavne pôdny (organická hmota, ochrana pred eróziou), finančne ťažko merateľný; horčica sa navyše môže započítať do neprodukčných plôch ekoplatby\n\n**SPP v ČR:**\n- **Ekoplatba (2025)** — medziplodiny vrátane horčice možno započítať do neprodukčných plôch variantu B\n- **Greening (2015–2022)** — skôr sa medziplodiny započítavali do plôch v ekologickom záujme (EFA), ktoré pri podnikoch nad 15 ha ornej pôdy museli tvoriť 5 % ornej pôdy\n\n**Klimatická zmena:**\n- **Sucho v lete** → medziplodina nevzíde\n- **Mierne jesene** → dlhšia vegetácia = väčšia biomasa\n\nPozri tiež [[mezi-plodiny]], [[repka-ozima]], [[ozim-jarin]], [[regenerativni-zemedelstvi]], [[osevni-postup]].",
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
    "shortDef": "Cukrová repa (Beta vulgaris) je jarná okopanina pestovaná na výrobu cukru. Plocha v ČR 60 000–70 000 ha. Výnos 60–80 t/ha bulvy, cukornatosť 17–20 %. Cena 1 100–1 600 Kč/t (záleží na cukornatosti). Zmluvné pestovanie pre cukrovary.",
    "longDef": "Cukrová repa (lat. *Beta vulgaris* var. *altissima*, ang. *sugar beet*) je **jarná okopanina** pestovaná na **výrobu cukru** (sacharóza). Bulva obsahuje 17–20 % cukru. V ČR dlhá tradícia (od 19. storočia), oblasť: Polabie, Stredné Čechy, Haná.\n\n**Plocha v ČR 2024**: 60 000–70 000 ha\n**Produkcia**: 4–5 mil. t bulvy → 600 000–750 000 t cukru\n\n**Vlastnosti:**\n\n**Agrotechnika:**\n\n**Sejba:**\n- **Termín**: 20. marca – 20. apríla\n- **Hĺbka**: 2–3 cm\n- **Hustota**: 8–10 rastlín/m² (rozstup 45 × 18 cm)\n- **Kľúčové**: presná sejba (každé semienko sa počíta, drahé osivo)\n\n**Hnojenie:**\n- **Pri sejbe**: 100–130 kg N/ha (cukrovka je „N hladná\")\n- **Celkovo N**: 130–180 kg/ha\n- **Bór (B)** — kritický pre tvorbu cukru, 2–4 kg/ha\n- **Sodík (Na)** — atypicky pozitívny efekt na výnos\n- **Hnoj v predplodine** — cukrovka miluje organickú hmotu\n\n**Ochrana:**\n- **Buriny**: 3–4 postreky (metamitron, phenmedipham, ethofumesate) — drahý program\n- **Insekticídy**: voška repná (BYV vektor, pozri [[msice-repna]])\n- **Fungicídy**: 1–2 postreky (Cercospora, múčnatka)\n\n**Zber:**\n- **Termín**: september–november (začiatok kampane)\n- **Zberač repy** — Holmer Terra Dos, Ropa euro-Tiger — 6-riadkový samohybný (50–80 t/h)\n- **Tzv. „kampaň\"**: október–december, cukrovary pracujú 24/7\n\n**Výnosy:**\n- **Priemer ČR**: 70 t/ha bulvy\n- **Top farmy**: 90+ t/ha\n- **Cukornatosť**: 17–20 % (vyššia = vyššia cena!)\n\n**Cena 2024 (zmluvná):**\n- **Štandardná cukrovka** (17 % cukru): 1 200 Kč/t\n- **High sugar** (19 % cukru): 1 500 Kč/t\n- **Bonus za biopalivá** (kontrakt na bioetanol): +50–100 Kč/t\n\n**Zmluvné pestovanie:**\n\n**Cukrovary v ČR:**\n- **Cukrovary Hradec Králové** (skupina Tereos) — Polabie\n- **Moravskoslezské cukrovary** (Litovel, Vrbátky) — Haná\n- **Tereos TTD** — Dobrovice (Polabie)\n- **Pfeifer & Langen** (České Meziříčí)\n\n**Kontrakt** medzi farmou a cukrovarom:\n- **Plocha + odhad výnosu** = množstevný záväzok\n- **Cena**: garantovaná za %cukru + bonusy\n- **Doprava**: cukrovar často zabezpečuje\n- **Uzatváranie zmlúv**: niekedy 3-5 rokov dopredu\n\n**Produkty z cukrovky:**\n1. **Cukor (50 %)** — hlavný produkt\n2. **Melasa (15 %)** — kvasinky, krmivo, lieh\n3. **Rezky (30 %)** — krmivo pre dobytok (vlhké alebo sušené, peletované)\n4. **Hlina a list** (5 %) — kompost\n\n**Odrody ČR 2024:**\n- **KWS odrody** (Marleen, Cantona) — dominantné\n- **Strube** (Salamando, Rosagold) — alternatíva\n- **Klein-Wanzlebener** — tradičný nemecký\n\n**Choroby:**\n- **Cercospora beticola** — listová škvrnitosť, vážna strata cukornatosti\n- **Múčnatka repná** (Erysiphe betae) — listy\n- **Rhizoctonia** — koreňová hniloba\n- **BYV vírus** prenášaný voškami — pozri [[msice-repna]]\n\n**Škodcovia:**\n- **Voška repná** (Aphis fabae) — vektor BYV\n- **Drepčíky** (Chaetocnema) — listy\n- **Slimák poľný** (Deroceras) — listy\n\n**Ekonomika:**\n\n**Náklady na 1 ha** (cukrovka je „drahá\" plodina):\n- **Osivo**: 8 000–12 000 Kč/ha (presné osivo, drahé peletované)\n- **Hnojivá**: 6 000–8 000 Kč/ha\n- **Postreky**: 10 000–15 000 Kč/ha (3-4 herbicídne postreky)\n- **Zber**: 3 000–5 000 Kč/ha (vlastný zberač alebo služba)\n- **Doprava**: 2 000–4 000 Kč/ha\n- **Práca a réžia**: 6 000–10 000 Kč/ha\n- **Celkovo**: 35 000–55 000 Kč/ha\n\n**Výnos**: 70 t/ha × 1 300 Kč = 91 000 Kč/ha\n**Marža**: 35 000–55 000 Kč/ha (ATRAKTÍVNE!)\n\n**Plus dotácie**:\n- **BISS a redistributívna platba** v ČR (2025): 1 759,91 Kč/ha, resp. 3 449,49 Kč/ha na prvých 150 ha\n- **CIS cukrová repa** (viazaná podpora príjmu v ČR, 2025): 6 936,20 Kč/ha\n- **Ekoplatba**: základná 1 578,37 Kč/ha (ČR, 2025), ak podnik splní podmienky\n\n**Trend a budúcnosť:**\n- **EU cukrová kvóta** zrušená 2017 → liberalizácia trhu → tlak na cenu\n- **V ČR klesajúca plocha** (z 100 000 ha v 1990s na 60 000 ha dnes)\n- **Bioetanol** — alternatívne použitie pre cukrovku (EU RED II)\n- **Klimatická zmena** — vyššie teploty + sucho = nižší výnos v Polabí\n\n**Strategická plodina:**\n- **CIS** zlepšuje ekonomiku cukrovky v cukrovarníckych regiónoch\n\nPozri tiež [[msice-repna]], [[ozim-jarin]], [[osevni-postup]], [[fungicidy]].",
    "related": [
      "msice-repna",
      "ozim-jarin",
      "osevni-postup",
      "fungicidy"
    ]
  },
  {
    "slug": "hrach-set",
    "term": "Hrach siaty",
    "alias": [
      "pea",
      "Pisum sativum",
      "jarný hrach"
    ],
    "kategorie": "plodiny",
    "shortDef": "Hrach siaty je jarná strukovina pestovaná pre semeno (zrnový hrach) alebo zelený struk (konzumný hrášok). Plocha v ČR 10 000–20 000 ha. Výnos 3–5 t/ha semien, cena 6 500–8 500 Kč/t. Kľúčová pre fixáciu N (50–100 kg N/ha) a osevný postup po obilninách.",
    "longDef": "Hrach siaty (lat. *Pisum sativum*, ang. *field pea*) je **jarná strukovina** s kľúčovými agronomickými benefitmi: **fixácia dusíka** symbiózou s *Rhizobium leguminosarum* (50–100 kg N/ha) a zlepšenie štruktúry pôdy. Hlavné použitie: krmivo (zrnový hrach), ľudská konzumácia (zelený hrášok), priemyselné aplikácie.\n\n**Plocha v ČR 2024**: 10 000–20 000 ha (rastúci trend kvôli plant-based proteínom + EÚ bielkovinovej stratégii)\n\n**Typy hrachu:**\n\n**1. Zrnový hrach** (95 % plochy v ČR):\n- **Zber**: august, zrno suché\n- **Použitie**: krmivo, ľudská strava (lúpaný hrach)\n- **Výnos**: 3–5 t/ha\n\n**2. Konzervárenský hrášok** (5 %):\n- **Zber**: zelený struk, jún–júl\n- **Použitie**: konzervy (Boncourier), mrazené (Bonduelle)\n- **Zmluvné pestovanie** pre konzervárne\n- **Výnos**: 5–8 t/ha zeleného struku\n\n**Agrotechnika:**\n\n**Sejba:**\n- **Termín**: 20. marca – 15. apríla (skorá sejba — odolný voči chladu)\n- **Hĺbka**: 4–6 cm (hlboko, kvôli suchu-tolerancii koreňov)\n- **Hustota**: 80–120 klíčivých zŕn/m² (= 200–280 kg osiva/ha, HW 250g)\n\n**Hnojenie:**\n- **Žiadne N hnojivo!** — hrach si fixuje vlastné (symbióza)\n- **P + K**: 40 P + 80 K + Mg\n- **Inokulácia osiva** Rhizobium leguminosarum bivar. *viceae* = kľúčové (najmä na poli, kde hrach 5+ rokov nebol)\n\n**Ochrana:**\n- **Buriny**: pre-emergence (pendimethalin, clomazone) + post-emergence (Basagran, Pulsar)\n- **Insekticídy**: zrnokaz hrachový (Bruchus pisorum), vošky\n- **Fungicídy**: biela hniloba *Sclerotinia*, pleseň hrášku (Mycosphaerella pisi)\n\n**Zber zrnového hrachu:**\n- **Termín**: koniec júla–august, vlhkosť 14 %\n- **Desikácia** (pozri [[desikace]]): glyfosátom ju v EÚ od decembra 2023 povoliť nemožno; či je pre hrach povolený iný prípravok, overte v registri ÚKSÚP\n- **Kombajn**: štandardný žací adaptér, ale opatrne (zrno ľahko vypadáva)\n\n**Výnosy:**\n- **Priemer ČR**: 3,8 t/ha zrnového hrachu\n- **Top farmy**: 5,5+ t/ha\n- **Konzervárenský**: 6 t/ha zelený\n\n**Použitie:**\n\n**1. Krmivo (60 %):**\n- **Pre prasatá**: hlavná bielkovinová zložka (CP 23–26 %)\n- **Pre hovädzí dobytok**: alternatíva SES (sójový extrahovaný šrot)\n- **Pre hydinu**: do 20 % zmesi\n- **Nutričné hodnoty**: CP 24 %, NEL 8,2 MJ/kg, vysoký škrob\n\n**2. Ľudská konzumácia (25 %):**\n- **Lúpaný hrach** — polievky, omáčky (česká kuchyňa)\n- **Hráškové vločky / múka** — plant-based proteíny\n- **Konzervovaný / mrazený hrášok** — zelenina\n- **Pea protein** — hojne používaný v plant-based produktoch (Beyond Meat, Impossible)\n\n**3. Priemysel (10 %):**\n- **Pea protein izolát** — 80 %+ čistota, premium plant-based ingredient\n- **Cena pea protein**: 80 000–150 000 Kč/t (10× vs zrno)\n- **EÚ dotuje** plant-based proteínovou stratégiou\n\n**4. Biopalivá (5 %):**\n- **Hrachový ethanol** — vedľajšia možnosť, marginálna\n\n**Cena 2024:**\n- **Kŕmný zrnový hrach**: 6 500–8 000 Kč/t\n- **Potravinársky hrach** (lúpaný): 9 000–12 000 Kč/t\n- **Konzervárenský** (zmluvný zelený): 4 500–6 000 Kč/t bruto\n\n**Odrody ČR 2024:**\n- **Eso, Madonna** — biele kvety, kŕmné, top výnos\n- **Bohatýr** — robustný\n- **Salamanca** — krátke steblo (menej poliehania)\n\n**Agronomické benefity (kľúčové!):**\n1. **N fixácia**: 50–100 kg N/ha + reziduálny N pre nasledujúcu plodinu (typicky pšenica po hrachu)\n2. **Rozrušenie monokultúr**: kapustovité a obilniny majú úplne iné patogény — hrach je „čistič\" osevného postupu\n3. **Štruktúra pôdy**: hlboké korene rozrušujú utuženú pôdu\n4. **Sekvestrácia C**: vyššia organická hmota v pôde po strukovine\n\n**Ekonomika:**\n\n**Náklady na 1 ha:**\n- Osivo: 4 500–6 000 Kč\n- Hnojivá: 2 000–3 000 Kč (len P + K)\n- Postreky: 4 000–6 000 Kč\n- Zber + doprava: 3 000–4 000 Kč\n- Celkom: 13 500–19 000 Kč/ha\n\n**Výnos**: 4 t × 7 200 Kč = **28 800 Kč/ha**\n**Marža**: 9 800–15 300 Kč/ha (atraktívne!)\n**Plus N pre nasledujúcu plodinu**: ušetrí 60–80 kg N (~1 200–1 600 Kč/ha)\n\n**EÚ Bielkovinová stratégia:**\n- **CIS bielkovinové plodiny** (ČR, 2025): 1 449,39 Kč/ha — patrí sem hrach vrátane pelušky, bôb, lupina, sója, lucerna, ďatelina, vika a ďalšie vymenované druhy\n\n**Klimatická zmena:**\n- **Mierna jar** = pozitívne\n- **Sucho v máji–júni** = negatívne (kvitnutie a tvorba strukov)\n- **Mokré letá** = poliehanie, pleseň\n\n**Strategický význam:**\n- **Hrach v osevnom postupe** = kľúč pre **udržateľnú intenzifikáciu**\n- **Plant-based proteíny** = rastúci trh = vyššia cena\n\nPozri tiež [[sojaova-bob]], [[vojteska]], [[osevni-postup]], [[mezi-plodiny]], [[ozim-jarin]], [[regenerativni-zemedelstvi]].",
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
    "shortDef": "Ľan siaty je dvojitá plodina — olejný ľan pre semeno a ľanový olej, pradný ľan pre vlákno (ľanové plátno). Plocha v ČR 1 500–3 000 ha (klesajúca). Výnos olejného 1,5–2,5 t/ha semien, cena 12 000–17 000 Kč/t. Historicky kľúčový (vlákno plátno do 1900s).",
    "longDef": "Ľan siaty (lat. *Linum usitatissimum*, ang. *flax*) je **jarná plodina dvojitého použitia**:\n1. **Olejný ľan** — semeno pre ľanový olej (omega-3), pekárske semeno\n2. **Pradný ľan** — steblo pre ľanové vlákno (textil)\n\nV ČR klesajúca tradícia — z 100 000+ ha v 1950s na ~1 500–3 000 ha dnes.\n\n**História:**\n- **Tisícročia** — ľan je jedna z najstarších kultúrnych rastlín (egyptské múmie, biblické zmienky)\n- **Stredovek** — ľanové plátno = štandardný textil v EÚ\n- **18.–19. storočie** — vrchol pestovania v ČR (Krkonošsko, Jeseníky ľanové centrá)\n- **20. storočie** — bavlna a syntetika vytlačili ľanové plátno\n- **1950s vrchol v ČR** — 120 000 ha (štátom dotované)\n- **2020s** — niche plodina\n\n**Vlastnosti:**\n\n**Olejný ľan (95 % plôch v ČR):**\n\n**Sejba:**\n- **Termín**: 25. marca – 20. apríla\n- **Hĺbka**: 2–3 cm\n- **Hustota**: 600–800 klíčivých zŕn/m² (drobné semeno)\n\n**Hnojenie:**\n- **N**: 60–80 kg/ha\n- **P + K**: štandardné\n\n**Ochrana:**\n- **Buriny**: post-emergence (Lontrel, Basagran)\n- **Insekticídy**: chrobáky, vošky — pyretroid\n- **Fungicídy**: biela hniloba (Sclerotinia), pleseň ľanu — 1 postrek\n\n**Zber:**\n- **Termín**: koniec júla–august\n- **Vlhkosť zrna**: 9–12 %\n- **Kombajn**: štandardný\n- **Výnos**: 1,5–2,5 t/ha semien\n\n**Použitie olejného ľanu:**\n\n**1. Ľanové semienko (potravinárske):**\n- **Celé alebo mleté semienko** — do pečiva, müsli, jogurtov\n- **Vysoký obsah omega-3** (ALA — alfa-linolenová kyselina)\n- **Vláknina** — pozitívna pre trávenie\n- **Cena potravinárskeho semienka**: 18 000–25 000 Kč/t\n\n**2. Ľanový olej:**\n- **Lisovanie** semien\n- **Kulinársky**: šalát, müsli (nie na vyprážanie — nestabilný)\n- **Liečebný**: omega-3 doplnok\n- **Cena**: 250–400 Kč/100ml v maloobchode\n\n**3. Krmivo:**\n- **Ľanový šrot** (po lisovaní oleja) — krmivo pre dobytok, kone\n- **Vysoký obsah olejnatých látok** — lesklá srsť koní\n\n**4. Priemysel:**\n- **Ľanový olej technický** (sušiaci olej) — pre nátery, lakové výrobky, linoleum\n- **Linoleum** etymológia: linum oleum = ľanový olej\n\n**Pradný ľan (5 % plôch v ČR):**\n\n**Špecifický pre vlákno:**\n- **Hustejšia sejba** (1 500 zŕn/m²) — tenké, dlhé steblo\n- **Kratšia vegetácia** — zber v júli\n- **Rosenie** (retting) — stonky sa nechajú na poli rosiť 14 dní, aby sa pektín rozložil\n- **Lámanie + trenie** — uvoľnenie vlákna\n- **Vlákno** — pre ľanové plátno (linen, batist, kambrik)\n\n**Ľanové plátno**:\n- **Premium materiál** — luxusné oblečenie, uteráky, obrúsky\n- **Belgicko + Francúzsko** = EÚ ľanové centrum (80 % EÚ produkcie)\n- **ČR marginálne** — odvozené priemyselné dejiny zanikajú\n\n**Cena 2024:**\n- **Olejný ľan** kŕmný: 12 000–14 000 Kč/t\n- **Olejný ľan** potravinársky: 18 000–25 000 Kč/t\n- **Bio olejný ľan**: 28 000–35 000 Kč/t (premium pre bio müsli)\n\n**Odrody ČR 2024:**\n- **Lola** — olejný, top výnos\n- **Recital** — robustný\n- **Niagara** — pradný (belgický import)\n\n**Choroby:**\n- **Biela hniloba** (Sclerotinia) — vlhké leto\n- **Pleseň ľanu** (Botrytis) — sezónna\n- **Ľanová hrdza** (Melampsora) — málo\n\n**Ekonomika olejného ľanu:**\n\n**Náklady na 1 ha**:\n- Osivo: 1 500–2 500 Kč\n- Hnojivá: 2 500–3 500 Kč\n- Postreky: 3 000–5 000 Kč\n- Zber: 2 500–3 500 Kč\n- Celkom: 9 500–14 500 Kč/ha\n\n**Výnos**: 2 t × 14 000 Kč = **28 000 Kč/ha**\n**Marža**: 13 500–18 500 Kč/ha (atraktívne pre niche!)\n\n**Strategický význam:**\n- **Niche plodina** s vysokou maržou\n- **Plant-based omega-3** trend = rastúci dopyt\n- **Bio kontrakty** pre pekársky priemysel\n\n**Klimatická zmena:**\n- **Sucho v máji–júni** = pozitívne (ľan nesnáša vlhko)\n- **Mierne leto** = ideálne\n- **Mokré leto** = biela hniloba\n\n**Renaissance ľanu?**\n- **Plant-based food** trend = trh rastie\n- **Lokálni producenti** môžu cieliť na premium pekársky trh\n- **Bio kontrakty** pre Hipp, Bauer detskú výživu\n\nPozri tiež [[ozim-jarin]], [[sojaova-bob]], [[mak-ozimy]], [[osevni-postup]].",
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
    "longDef": "Mastitída (lat. *mastitis*, gréc. *mastos* = vemeno) je **zápal mliečnej žľazy** dojnice. Najvýznamnejší zdravotný problém mliečneho chovu — spôsobuje **30 % ekonomických strát** (znížená produkcia, antibiotiká, vyradené kravy).\n\n**Typy:** klinická (vizuálne príznaky, vyžaduje liečbu) vs subklinická (len SCC >200 000/ml, väčšina prípadov). Kľúčové patogény: kontagiózne (*Staphylococcus aureus*, *Streptococcus agalactiae*) a environmentálne (*E. coli*, *Streptococcus uberis*, *Klebsiella*).\n\n**Meranie SCC:**\n- <100 000/ml = zdravé\n- 200–500 000/ml = subklinická\n- >500 000/ml = klinická\n- **EÚ limit pre výkup mlieka**: <400 000/ml\n\n**Liečba klinickej mastitídy:**\n- **Intramamárne antibiotiká** (Mastijet, Cefa Safe) — 3 dni do napadnutej štvrti\n- **Systémová** (Penicilín G IM, Cefquinome) pre vážne prípady\n- **Protizápalové** (ketoprofén, meloxicam)\n- **Ochranná lehota**: mlieko 3–5 dní, mäso 14–30 dní\n- **Cena liečby**: 500–1 500 Kč + 1 500–3 000 Kč stratené mlieko\n\n**Prevencia (kľúčové):**\n1. **Hygiena dojenia**: pre-dip + sušenie sterilným uterákom (na kravu!) + post-dip\n2. **Dry-cow therapy**: intramamárne antibiotiká + teat sealant pri zaprahnutí\n3. **Suchá podstielka**: slama, drevené hobliny, piesok\n4. **Genetika**: výber býkov s nízkym SCC v potomstvu\n5. **TMR** (pozri [[tmr]]): vyvážená výživa, selén + vit. E\n\n**Ekonomický dopad:**\n- Náklady na 1 klinickú mastitídu: 4 000–11 500 Kč\n- Stádo 100 kráv: 300 000–800 000 Kč/rok strát\n- Dobrý manažment znižuje mastitídu o 50–70 % = veľký ROI\n\nPozri tiež [[oteleni]], [[dojirna]], [[ku-kontrola-uzitkovosti]], [[tmr]], [[bcs-body-condition]], [[transition-period]].",
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
      "telesné kondičné skóre"
    ],
    "kategorie": "chov",
    "shortDef": "BCS je vizuálne hodnotenie telesnej kondície hovädzieho dobytka na škále 1–5 (USA) alebo 1–9. Kľúčový manažérsky nástroj — optimálne BCS mliečnej kravy pri otelení 3,25–3,75. Príliš tučná = dystocia + ketóza; príliš chudá = nízka produkcia a fertilita.",
    "longDef": "BCS (Body Condition Score) je **vizuálne subjektívne hodnotenie telesnej kondície (tuku)** hospodárskych zvierat. Kľúčový manažérsky nástroj pre mliečny + mäsový dobytok, ovce, kozy, prasatá.\n\n**Škála USA (Wildman, 1982):**\n- 1: extrémne vychudnutá\n- 2: chudá\n- 3: ideálna mliečna krava\n- 4: tučná\n- 5: extrémne tučná\n- Krok 0,25\n\n**Optimálne BCS — mliečna krava (Holstein):**\n\n| Štádium | BCS |\n|---------|-----|\n| Otelenie | 3,25–3,75 |\n| 30 dní po otelení | 2,75–3,00 (prípustný pokles) |\n| Vrchol laktácie (100 dní) | 2,75–3,00 |\n| 200 dní | 3,00–3,25 |\n| Zaprahnutie | 3,25–3,75 |\n\n**Hodnotenie**: chrbtica, kostnaté výbežky, krátke rebrá, sedací hrbol, chvostová ryha. Vizuálne + palpácia.\n\n**Dôsledky chybných BCS:**\n\n**Príliš nízky (<2,5 pri otelení):**\n- Nízka produkcia, ketóza, slabšia imunita, oneskorené ruje (pozri [[rijnost]])\n\n**Príliš vysoký (>4,0 pri otelení):**\n- Dystocia (pozri [[oteleni]]), fatty liver, retentio placentae, ketóza, znížený príjem krmiva\n\n**Dôležité pravidlo**: strata >1,0 BCS v prvých 60 dňoch = riziko (ketóza, nízka fertilita).\n\n**Softvér pre automatickú BCS:**\n- **CowManager**, **DeLaval BCS Camera** — kamera + AI hodnotenie\n- 200 000–500 000 Kč inštalácia\n- Denná BCS každej kravy bez manuálnej práce\n\n**Ekonomický dopad**: stádo s optimálnym BCS manažmentom má o 200–500 l mlieka/krava/rok viac → pre 100 kráv = 220 000–550 000 Kč/rok.\n\nPozri tiež [[oteleni]], [[rijnost]], [[mastitida]], [[ku-kontrola-uzitkovosti]], [[tmr]], [[transition-period]].",
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
    "shortDef": "Kontrola užitkovosti je systematický monitoring produkcie a kvality mlieka dojníc. V SK zabezpečujú Plemenárske služby SR, š. p. — 1× mesačne analýza mlieka na kravu (množstvo, tuk, bielkoviny, SCC, urea). Kľúčové pre selekciu, zdravie a šľachtenie.",
    "longDef": "Kontrola užitkovosti (KU, anglicky *DHIA — Dairy Herd Improvement Association*, *milk recording*) je **systematický monitoring produkcie a kvality mlieka jednotlivých dojníc** cez plemenárske služby. V SK zabezpečujú **Plemenárske služby SR, š. p.**\n\n**Princíp:**\n- 1× mesačne technik na farmu\n- Vzorky mlieka z každej kravy (ranné + večerné dojenie)\n- Analýza v akreditovanom laboratóriu\n- Výsledky spracujú plemenárske služby + plemenná kniha (pozri [[plemenna-kniha]])\n\n**Merané parametre:**\n\n| Parameter | Holstein optimum |\n|----------|------------------|\n| Množstvo | 25–40 kg/deň |\n| Tuk | 3,8–4,2 % |\n| Bielkoviny | 3,2–3,5 % |\n| SCC | <200 000/ml |\n| Urea | 15–30 mg/100 ml |\n| Laktóza | 4,8–5,0 % |\n\n**Použitie KU dát:**\n\n**1. Selekcia kráv:**\n- Top 25 % → sexed semen (zaručené jalovice pre chov)\n- Bottom 25 % → mäsová genetika alebo predaj\n\n**2. Diagnostika:**\n- Vysoké SCC → mastitída (pozri [[mastitida]])\n- Nízke bielkoviny → zmena TMR (pozri [[tmr]])\n- Vysoké urea → znížiť CP v diéte\n- Pokles produkcie → vyšetrenie\n\n**3. Plemenná hodnota:**\n- KU dáta idú do plemennej knihy\n- Top býky vybraní z výsledkov ich dcér\n\n**Účasť:**\n- ~60–70 % mliečnych fariem v ČR\n- Vysoká užitkovosť (>10 000 kg/laktácia) takmer 100 % v KU\n\n**Cena:**\n- 150–250 Kč/kravu/mesiac.\n- Stádo 100 kráv: 180 000–300 000 Kč/rok\n- ROI: 500–1 500 Kč/krava/rok zisk z lepšej selekcie\n\n**Digitalizácia:**\n- AMS (Lely, DeLaval) ukladá dáta každého dojenia\n- In-line analyzéry merajú tuk/bielkoviny v reálnom čase\n- Trend: AMS dáta môžu nahradiť klasickú KU\n\nPozri tiež [[plemenna-kniha]], [[mastitida]], [[bcs-body-condition]], [[oteleni]], [[dojirna]], [[inseminace]].",
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
    "shortDef": "Plemenná kniha je oficiálny register čistokrvných zvierat plemena s rodokmenom a plemennou hodnotou. Vedie ju uznaná plemenárska organizácia. Kľúčový nástroj šľachtenia, EÚ dotácií a obchodu s genetikou.",
    "longDef": "Plemenná kniha (nem. *Herdbuch*, ang. *herd book*) je **oficiálny register čistokrvných zvierat plemena** spravovaný uznanou plemenárskou organizáciou. Obsahuje rodokmeň, plemennú hodnotu, vlastnosti a pôvod. Kľúčový nástroj šľachtenia a EÚ dotácií.\n\n**História:**\n- 1791 — prvá (British Thoroughbred kone)\n- 1822 — prvá pre dobytok (Shorthorn UK)\n- 1872 — Holstein-Friesian Herd Book (NL/DE)\n\n**Sekcie:**\n- **A (čistokrvné)**: otec + matka registrovaní, ≥7/8 čistokrvnosti\n- **B (upgrade)**: cesta k sekcii A cez 2–3 generácie\n- **C (foundation)**: len matka registrovaná, 50 % čistokrvnosti\n\n**Čo eviduje:**\n\n1. **Identifikácia**: ušná známka (pozri [[usni-znamka]]), meno, dátum, plemeno\n2. **Rodokmeň**: 4 generácie dozadu (8 predkov)\n3. **Vlastnosti**: produkcia, plemenné hodnoty (PV/EBV), telesný typ\n4. **Reprodukcia**: inseminácia, otelenie, medzidobie\n5. **Zdravie**: mastitídy, veterinárne zákroky, vyradenie\n\n**Plemenná hodnota (PV):**\n\nKľúčové indexy:\n- **TPI** (Total Performance Index — USA Holstein)\n- **NM$** (Net Merit dollars — ekonomický)\n- **RZG** (Relativzuchtwert Gesamt — DE/AT Holstein)\n- **NORD** (Severský index)\n- **CZECH SIH** (CZ celkový index Holstein)\n\n**Genomické hodnotenie (2009+):**\n- DNA testy mladých zvierat\n- Predikcia plemennej hodnoty bez čakania na dcéry\n- 10 000+ testov/rok v ČR\n\n**Medzinárodná výmena:**\n- **Interbull** — koordinácia cez 30+ krajín\n- ČR importuje 60 % semena (USA, Kanada, NL, DK)\n\n**České plemenárske organizácie:**\n- **Zväz chovateľov mäsového dobytka** — Charolais, Limousin, Aberdeen Angus\n\n**Plemená v ČR:**\n- Mliečne: Holstein (#1, 70 %), Český strakatý (20 %), Jersey, Montbéliarde\n- Mäsové: Charolais, Limousin, Aberdeen Angus, Hereford, Simmental, Belgické modré\n\n**Ekonomická hodnota:**\n- Čistokrvná top jalovica: 50 000–250 000 Kč\n- Top býk pre insemináciu: 500 000+ Kč\n- Embryotransfer top genetiky: 50 000–500 000 Kč\n- World Dairy Expo Grand Champion: 1+ mil. USD\n\nPozri tiež [[ku-kontrola-uzitkovosti]], [[inseminace]], [[jalovice]], [[bcs-body-condition]], [[f1-hybrid]], [[usni-znamka]].",
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
    "longDef": "Kolostrum (lat. *colostrum*, čes. *mlezivo*) je **prvé mlieko kravy** po otelení. Kľúčové pre **prežitie teľa** — narodené teľa nemá vrodenú imunitu (placenta kravy je neprepustná pre protilátky), kolostrum je jediný zdroj **pasívnej imunity**.\n\n**Zloženie kolostra vs mlieka:**\n\n| Komponent | Kolostrum | Mlieko (deň 3+) |\n|-----------|-----------|----------------|\n| Sušina | 23–28 % | 12–13 % |\n| Bielkoviny | 14–18 % | 3,3 % |\n| Tuk | 6–7 % | 4 % |\n| IgG | 60–120 g/l | 0,5–1 g/l |\n| Vitamín A | 10× vyšší | bežný |\n\n**Kritické okno absorpcie:**\n- 0–6 h po pôrode: 100 % absorpcia IgG (= najvyššia)\n- 6–12 h: 60 % absorpcia\n- 12–24 h: 30 % absorpcia\n- 24+ h: <10 % absorpcia (sliznica \"zavrela\")\n\n**Odporúčania:**\n\n**1. prvá dávka (kritická):**\n- **4 litre kolostra do 6 hodín** po pôrode\n- Buď materským (ak je matka zdravá), alebo pasterizovaným zásobným\n- Aplikácia: fľaša alebo drench tube (sonda)\n\n**2. Druhá dávka:**\n- 2 litre za 6–12 h\n\n**3. Deň 2–3:**\n- Postupný prechod na bežné mlieko alebo náhradu\n\n**Kvalita kolostra:**\n\n**Test (Brix refraktometer):**\n- >22 % Brix = vysoká kvalita (>60 g IgG/l)\n- 18–22 % Brix = stredná\n- <18 % Brix = nízka (nutné doplniť)\n\n**Faktory kvality:**\n- Plemeno: Jersey > Holstein (vyšší IgG)\n- Poradie laktácie: staršie kravy majú vyšší IgG\n- Doba dojenia: prvé dojenie = najvyšší IgG\n- Hygiena: čisté vemena → nižšia kontaminácia\n\n**Pasterizácia:**\n- 60 °C × 60 min\n- Účel: zničiť *Mycoplasma bovis*, *Salmonella*, *Mycobacterium avium* (Johneho)\n- Nesmie znížiť IgG významne (-10 %)\n- Pasterizér: 100 000–300 000 Kč\n\n**Zmrazenie:**\n- Kvalitné kolostrum top kráv zmrazené (-20 °C, plastové sáčky 2 l)\n- Skladovateľnosť: 12 mesiacov\n- Rozmrazenie: 40 °C vodný kúpeľ, max 60 min\n\n**Zlyhanie pasívnej imunity (FPT):**\n- 20–30 % teliat (medzinárodný priemer)\n- Symptómy: hnačka, pneumónia v 1.–4. týždni\n- Diagnostika: STP (Total Protein) v krvi teľa 2.–7. deň — <5,0 g/dl = FPT\n\n**Ekonomický dopad:**\n\n**Bez kvalitného kolostra:**\n- 30–50 % úmrtnosť (vs 5–10 %)\n- Liečba: 1 000–3 000 Kč/teľa\n- Stratené teľa: 8 000–60 000 Kč hodnoty\n\n**S manažmentom:**\n- Lepší rast, lepšia produkcia v dospelosti (epigenetický efekt)\n\nPozri tiež [[oteleni]], [[jalovice]], [[mastitida]], [[transition-period]], [[dojirna]].",
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
    "longDef": "Tranzitné obdobie (anglicky *transition period*) je **3 týždne pred a 3 týždne po otelení** = **6 týždňov kritického prechodu** mliečnej kravy medzi suchým obdobím a aktívnou laktáciou. **70 % všetkých zdravotných problémov** mliečnej kravy vzniká práve v tomto okne.\n\n**Hlavné zdravotné riziká:**\n\n**1. Mliečna horúčka (hypokalciémia):**\n- Ca v krvi <8 mg/dl (norma 8,5–10,5)\n- Klinická: 3–8 % kráv, paralýza, ležanie\n- Subklinická: 25–50 % kráv (znižuje produkciu, imunitu)\n- Liečba: kalciumglukonát IV\n- Prevencia: aniónová zmes pred pôrodom (DCAD <0)\n\n**2. Ketóza:**\n- Negatívny energetický balans (NEB) → mobilizácia tuku → ketolátky\n- Subklinická: 30–50 % kráv (BHB >1,2 mmol/l)\n- Klinická: 5–10 % (BHB >3 mmol/l, anorexia, acetónový dych)\n- Liečba: propylénglykol, glukóza IV\n- Prevencia: monenzín (Kexxtone), cholín, postupné navýšenie TMR\n\n**3. Retentio placentae:**\n- 5–10 % otelení (vyššie u dvojčiat, dystocia)\n- Komplikácie: metritída → znížená fertilita\n\n**4. Metritída (zápal maternice):**\n- Akútna (pyometra) aj chronická (endometritída)\n- Liečba: antibiotiká + PGF₂α\n\n**5. Posunutie slezu (DA):**\n- LDA (ľavostranné): 95 %, 2–4 týždne po pôrode\n- Liečba: chirurgické vrátenie (5 000–15 000 Kč)\n\n**6. Mastitída** (pozri [[mastitida]]):\n- Imunitná supresia zvyšuje riziko\n\n**Manažment:**\n\n**3 týždne pred otelením (Close-up Dry):**\n\nTMR dizajn:\n- **Aniónová zmes** (DCAD <0): kyslejšie telo → lepšia mobilizácia Ca\n- Energia: 6,5–7,0 MJ NEL/kg DM\n- CP: 14–15 %\n- NDF: 32–35 %\n- Cieľ: udržať vysoký príjem krmiva\n\nSledovanie:\n- BCS (3,25–3,5, pozri [[bcs-body-condition]])\n- Príjem krmiva denne\n- Aktivita\n\n**Deň otelenia + prvé 3 dni:**\n\n- Suchý, čistý pôrodný box (12+ m²)\n- Veterinárny dohľad\n- Kolostrum teľa do 6 h (pozri [[kolostrum-mlezivo]])\n- Calcium bolus krave bezprostredne po pôrode\n- Drench (sondovanie) elektrolyty + propylénglykol ak nepije\n\n**Týždne 1–3 (Fresh Cow):**\n\nTransition TMR:\n- Postupné zvyšovanie koncentrátu (deň 1: 60/40 objemové krmivá/koncentrát; deň 21: 50/50)\n- Energia: 7,2 MJ NEL/kg DM\n- CP: 16–17 %\n- RUP: 35–38 %\n- Cholín (Reashure): 15 g/krava/deň\n\nSledovanie:\n- Denné váženie mlieka\n- BHB test (ketóza) — deň 5, 7, 12\n- NEFA test (mobilizácia tuku)\n- BCS každý týždeň\n- Teplota (>39,5 °C = problém)\n\n**Ekonomický dopad:**\n\n**OPTIMÁLNE tranzitné:**\n- 5 % klinických problémov\n- 305d produkcia 11 000+ kg\n\n**ZLÉ tranzitné:**\n- 20–30 % klinických problémov\n- Liečba: 5 000–10 000 Kč/krava\n- Znížená produkcia: -500 až -1 500 kg/laktácia\n- Vyradenie: 20+ % (vs 10 %)\n\n**ROI investície do tranzitného manažmentu**: 3–5× = najvýnosnejšia investícia mliečnej farmy.\n\nPozri tiež [[oteleni]], [[bcs-body-condition]], [[mastitida]], [[tmr]], [[kolostrum-mlezivo]], [[krmne-davky]].",
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
    "longDef": "F1 hybrid (anglicky *F1 generation*, *first filial generation*) je **prvá generácia krížencov dvoch geneticky odlišných línií**. Vyznačuje sa **heterózou (hybrid vigor)** — vyšším výkonom ako priemer rodičov. Kľúčový genetický princíp v modernom poľnohospodárstve.\n\n**Princíp:**\n\n- **Rodič A** × **Rodič B** = **F1 generácia** (geneticky identickí, heterozygotní)\n- F1 × F1 = **F2** (rekombinanti, variabilní, heteróza klesá)\n\n**Heteróza (hybrid vigor):**\n- F1 výkonnejší o 5–30 % nad priemerom rodičov\n- Mechanizmus: kombinácia rôznych alel, maskovanie recesívnych defektov\n- **Zníži sa v F2** → každoročný nákup nového F1 osiva\n\n**Aplikácia v rastlinnej výrobe:**\n\n**1. Hybridná kukurica:**\n- Henry Wallace USA 1920s — priekopníctvo\n- USA výnos: 1900: 1,8 t/ha → dnes 11+ t/ha (vďaka F1)\n- F1 výhody: +20–30 % výnos, uniformita, stresová tolerancia\n- Trh: Pioneer, DEKALB (Bayer), Syngenta, Limagrain\n\n**2. Hybridná raž** (pozri [[zito-ozime]]):\n- KWS 1990s (CMS — Cytoplasmic Male Sterility)\n- Výnosy: +30–50 % vs tradičné\n\n**3. Cukrová repa, zelenina** — takmer 100 % F1\n\n**4. Hybridná pšenica** — neúspešný projekt (samoopelivosť)\n\n**Aplikácia v živočíšnej výrobe:**\n\n**1. Prasatá:**\n- Pietrain × (Veľký biely × Landrasse) = \"double cross\"\n- F1 prasnice: vysoká plodnosť (12+ prasiat/vrh)\n- F1 výkrm: rýchly rast, chudé mäso\n\n**2. Brojleri:**\n- **Ross 308**: 4-líniový hybrid, medzinárodný štandard\n- Rast: 42 dní z 40 g na 2,5 kg\n- Konverzia: 1,6 kg krmiva / kg mäsa\n\n**3. Nosnice:**\n- **ISA Brown** (Hubbard ISA, Hendrix Genetics)\n- 320+ vajec/rok (vs 200 tradičné)\n\n**4. Crossbreeding dobytok:**\n\n**Mliečny kríž** (menej častý):\n- Nórsky červený × Holstein — robustnosť, lepšie zdravie\n- Jersey × Holstein — vyšší tuk\n\n**Mäsový kríž** (bežný):\n- Holstein krava × Charolais býk — premium kríženci\n- Holstein × Aberdeen Angus — mramorovanie\n- Komerčný výkrm: 50 kg → 600 kg za 12–18 mes.\n\n**Teória heterózy:**\n1. **Dominancia**: F1 maskuje recesívne defekty oboch línií\n2. **Overdominancia**: heterozygot je výkonnejší\n3. **Epistáza**: synergia interakcií medzi lokusmi\n\n**Etika a debata:**\n- Závislosť fariem na semenárskych firmách (Bayer, Corteva, Syngenta, Limagrain)\n- Strata tradičnej variability\n- **Open Source Seed Initiative** — alternatíva\n\n**EU regulácia:**\n- CMS hybridy ≠ GMO (klasická šľachtiteľská technológia)\n- GMO hybridy (Mon810) silne obmedzené v EU\n\nPozri tiež [[plemenna-kniha]], [[inseminace]], [[zito-ozime]], [[kukurice-silazni]], [[ku-kontrola-uzitkovosti]].",
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
    "shortDef": "Precision Livestock Farming (PLF) je systém kontinuálneho automatického monitorovania zvierat pomocou senzorov (akcelerometre, RFID, kamery) a AI analýzy dát. Detekuje ruju, mastitídu, krívanie, stres skôr ako človek — rieši 80 % manažérskych rozhodnutí mliečnej farmy.",
    "longDef": "Precision Livestock Farming (PLF, „precízny chov\", anglicky *smart farming*) je systém **kontinuálneho automatického monitorovania zvierat** pomocou senzorov, IoT a AI. Cieľ: detekovať **biologické signály** (ruja, choroba, stres, kŕmenie) **skôr ako človek** a transformovať dáta do manažmentu.\n\n**História:**\n- **1990s**: prvé aktivometre (pedometre) v dojárňach\n- **2010s**: rozšírenie akcelerometrov na obojkoch\n- **2015+**: AI/ML modely pre behaviorálnu analýzu\n- **2020+**: kamery + počítačové videnie (BCS, krívanie)\n- **2024**: integrácia LLM (Large Language Models) pre odporúčania\n\n**Hlavné senzorové technológie:**\n\n**1. Akcelerometre (obojkové / nákolenné):**\n- **Merajú**: aktivitu (kroky, mounting, ležanie)\n- **Aplikácia**: detekcia ruje, včasná detekcia choroby, monitoring komfortu\n- **Top produkty**:\n  - **CowManager SensOor** (NL) — obojkový\n  - **Allflex Heatime** (IL) — obojkový\n  - **DeLaval DDM** — ušný tag\n  - **SCR Heatime** — izraelská alternatíva\n- **Cena**: 2 000–5 000 Kč/kravu (jednorazová) + 30–80 Kč/mesiac software\n\n**2. RFID (radio-frequency identification):**\n- **Ušná známka** (pozri [[usni-znamka]]) s integrovaným RFID čipom\n- **Statické čítačky**: brány do dojárne, kŕmnych boxov\n- **Aplikácia**: identifikácia, automatické kŕmenie (per cow), monitoring príjmu\n\n**3. Mliečny analyzér (in-line):**\n- **Integrovaný v dojárni** — meria objem + zloženie v reálnom čase\n- **Parametre**: tuk, bielkoviny, laktóza, vodivosť (mastitída — pozri [[mastitida]])\n- **Aplikácia**: alarm vysokého SCC, denná KU bez technika\n- **Trh**: AfiLab (DeLaval), Lely milk analyzer\n\n**4. Kamery + Počítačové videnie:**\n- **Aplikácia**:\n  - **BCS skórovanie** (pozri [[bcs-body-condition]]) automaticky\n  - **Detekcia krívania** — analýza chôdze\n  - **Behavior monitoring** (lying time, water visits)\n  - **Detekcia ruje** (komplement k akcelerometru)\n- **Trh**: DeLaval BCS Camera, Cargill ZAFFY (krívanie), Connecterra (full AI)\n- **Cena**: 200 000–500 000 Kč inštalácia\n\n**5. Bolus senzory (v bachore):**\n- **Polykané teľaťom** (orálne) — žije v bachore roky\n- **Merajú**: bachorové pH, teplotu, motorickú aktivitu\n- **Aplikácia**: detekcia acidózy, včasná detekcia choroby\n- **Trh**: Mottainai, Cowtronix\n- **Cena**: 3 000–8 000 Kč/krava (jednorazové)\n\n**6. Senzory spotreby vody:**\n- **Meranie spotreby vody** per cow (cez RFID v boxe)\n- **Aplikácia**: pokles príjmu = včasná indikácia choroby alebo stresu\n\n**Kľúčové aplikácie PLF:**\n\n**1. Detekcia ruje (pozri [[rijnost]]):**\n- **Tradičná vizuálna**: 45–65 % detekcia\n- **PLF akcelerometer**: 90–98 % detekcia\n- **Inseminačný timing**: optimálny (6–18 h od začiatku ruje)\n- **Ekonomický dopad**: -50 dní medzidoby = +500 l mlieka/krava/rok\n\n**2. Detekcia mastitídy:**\n- **In-line mliečny analyzér** detekuje vodivosť (≈ SCC)\n- **Alarm** na zvýšenie 24 h pred klinickými príznakmi\n- **Rýchlejšia liečba** = menej stratenej produkcie\n\n**3. Detekcia chorôb (všeobecne):**\n- **Zmena správania** (-30 % aktivity alebo -20 % ruminácie) = alarm\n- **Včasný začiatok liečby** znižuje closure rate\n- **Teľa v transition period** (pozri [[transition-period]]) — vysoký ROI\n\n**4. Detekcia krívania:**\n- **Kamerový systém** sleduje chôdzu\n- **Tréning AI**: klasifikácia 1–5 (locomotion score)\n- **Cieľ**: <5 % kráv s lameness score >3\n\n**5. Welfare monitoring:**\n- **Lying time** (12–14 h = optimum)\n- **Standing time u kŕmenia**\n- **Sociálne interakcie**\n\n**6. Reprodukčný manažment:**\n- **Ovsynch protokoly** podľa dát\n- **Inseminačný timing**\n- **Konfirmácia zabreznutia** (zmena aktivity 5–7 dní po inseminácii)\n\n**Software a platformy:**\n\n- **CowManager** (NL) — dominantný v EÚ\n- **Connecterra IDA** (NL) — AI-first\n- **Afimilk Aclick** (IL)\n- **GEA CowScout** (DE)\n- **Lely Astronaut + Horizon** (NL)\n- **Microsoft Azure FarmBeats** — IoT platforma\n\n**Robotické dojárne (AMS) ako PLF platforma:**\n- Lely Astronaut, DeLaval VMS, GEA DairyRobot\n- Integrácia: dojenie + kŕmenie + senzory + software\n- Cena: 4–6 mil. Kč per robot (1 robot = 60 kráv)\n\n**ROI PLF systému:**\n\n**Investícia na 100 kráv:**\n- Akcelerometre + sw: 250 000–500 000 Kč\n- Plus in-line analyzér: +400 000–800 000 Kč\n- Plus BCS kamera: +300 000–500 000 Kč\n- **Celkom**: 950 000–1 800 000 Kč\n\n**Benefity ročne:**\n- Lepšia detekcia ruje: +50 000–100 000 Kč/kravu × 100 = 50 000 Kč/100 kráv... wait, recalc: +1 000–2 000 Kč/krava = 100 000–200 000 Kč/rok pre 100 kráv\n- Menej mastitíd: -50 000–100 000 Kč/rok\n- Lepší welfare = lepšia dlhovekosť kráv: 100 000–200 000 Kč/rok\n\n**Celkom**: 250 000–500 000 Kč/rok ROI\n**Návratnosť**: 2–5 rokov\n\n**Bariéry:**\n1. **Vysoká investícia** — pre malé farmy obtiažne\n2. **Komplexnosť** — vyžaduje IT/digital zručnosti\n3. **Závislosť od internetu** — cloud sw vyžaduje stabilný internet\n4. **Údržba** — senzory životnosť 5–7 rokov\n\n**Budúcnosť:**\n- **LLM integrácia** — ChatGPT-like rozhranie pre farmu\n- **Predikčné modely** — predikcia mastitídy 7 dní dopredu\n- **Genomické integrácie** — kombinácia PLF dát s plemennou hodnotou\n- **Virtuálne farmy** — koncept \"digital twin\" mliečneho stáda\n\nPozri tiež [[rijnost]], [[mastitida]], [[bcs-body-condition]], [[ku-kontrola-uzitkovosti]], [[transition-period]], [[dojirna]], [[telematika]], [[usni-znamka]].",
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
    "longDef": "Satelitné dáta sú kľúčový **vstup pre presné poľnohospodárstvo** — poskytujú **multispektrálne snímky** s priestorovým rozlíšením 1–30 m a časovým rozlíšením 1–7 dní. Aplikácie: monitoring porastov, detekcia stresu, aplikácie s variabilnou dávkou (pozri [[variable-rate]]), predikcia výnosu.\n\n**Hlavné satelitné programy:**\n\n**1. Copernicus Sentinel (EÚ, zadarmo!):**\n- **Sentinel-2** — multispektrálne (13 pásiem), rozlíšenie 10 m (RGB+NIR), 20 m (red edge), 60 m (atmosférické)\n- **Frekvencia**: 5 dní (kombinácia 2 satelitov)\n- **Pokrytie**: celá EÚ pravidelne\n- **Cena**: ZADARMO pre všetkých (EÚ iniciatíva)\n- **API**: Sentinel Hub, Google Earth Engine\n\n**2. Landsat (USA, NASA, zadarmo!):**\n- **Landsat 8/9** — rozlíšenie 30 m (multispektrálne), 100 m (termálne)\n- **Frekvencia**: 16 dní (jeden satelit)\n- **Pokrytie**: globálne od 1972 (50+ rokov dát!)\n- **Cena**: ZADARMO\n- **Použitie**: dlhodobé trendy, história\n\n**3. Planet Labs (USA, komerčné):**\n- **PlanetScope** — denné snímky, rozlíšenie 3 m\n- **SkySat** — rozlíšenie 0,5 m (subdetailné)\n- **Cena**: 10–50 USD/km²/mesiac.\n- **Použitie**: presné poľnohospodárstvo na úrovni rastliny\n\n**4. Maxar / DigitalGlobe (komerčné, drahé):**\n- **WorldView-3/4** — rozlíšenie 0,3 m\n- **Cena**: 25–100 USD/km²\n- **Použitie**: vojenské, urbanistické plánovanie, zriedkavo ag\n\n**5. NICFI (Nórsko, tropické lesné dáta zadarmo):**\n- Planet Labs PlanetScope pre tropy ZADARMO\n- Pre EÚ farmy irelevantné\n\n**Vegetačné indexy (kľúčové výstupy):**\n\n**1. NDVI (Normalized Difference Vegetation Index) — pozri [[ndvi]]:**\n- **Vzorec**: (NIR - RED) / (NIR + RED)\n- **Hodnoty**: -1 až +1 (porast: 0,3–0,9)\n- **Interpretácia**: vyššie = viac chlorofylu = zdravší porast\n- **Aplikácie**: detekcia stresu, variabilná dávka N hnojenia\n\n**2. NDRE (Normalized Difference Red Edge):**\n- **Vzorec**: (NIR - RedEdge) / (NIR + RedEdge)\n- **Citlivejšie** k variabilite N v plodinách\n- **Aplikácie**: rozhodovanie o hnojení v sezóne\n\n**3. EVI (Enhanced Vegetation Index):**\n- Robustnejšie voči atmosférickým efektom\n- Vhodné pre lesy, husté porasty\n\n**4. SAVI, OSAVI (Soil-Adjusted):**\n- Pre nízke pokrytie (kukurica v BBCH 12–30)\n- Odpočítava efekt holej pôdy\n\n**5. Termálne indexy:**\n- Landsat 8/9 termálny pás\n- **CWSI** (Crop Water Stress Index) — detekcia sucha\n- Sentinel-3 = lepšie teplotné snímky (1 km rozlíšenie, denne)\n\n**6. SAR (Synthetic Aperture Radar):**\n- Sentinel-1 — radar (preniká oblakmi, vidí v noci)\n- **Aplikácie**: vlhkosť pôdy, biomasa, detekcia zberu\n\n**Komerčné platformy pre farmárov:**\n\n- **Climate FieldView** (USA, Bayer) — top globálne, 500–1 500 USD/farma/rok\n- **OneSoil** (NL) — bezplatná, NDVI zo Sentinel\n- **Yara Atfarm** — N variabilita\n- **Soyl** (UK) — variabilná dávka N + osivo\n- **Agremo** (RS) — dron + satelitná kombinácia\n- **SatAgro** (PL) — Sentinel-based, EÚ farmy\n- **Sentinel Hub Playground** — DIY platforma (technická)\n\n**Aplikácie na českej farme:**\n\n**1. Variabilná dávka N hnojenia:**\n- Sentinel-2 NDVI BBCH 32 pšenice\n- Mapa variability → súbor pre postrekovač (ISO XML)\n- Aplikačný stroj reaguje sekcia po sekcii (10–24 m sekcia)\n- **Úspora N**: 10–20 % (= 500–1 000 Kč/ha)\n\n**2. Detekcia stresu (sucho, choroba):**\n- Pravidelný NDVI monitoring\n- Anomálie = signál k kontrole\n- Včasný zásah = prevencia strát\n\n**3. Predikcia výnosu:**\n- Historické NDVI dáta + ML model\n- Predikcia výnosov 30–60 dní pred zberom\n- Plánovanie logistiky (sušiarne, sklady)\n\n**4. Poistenie úrody:**\n- **Parametrické poistenie** — poistka platí podľa NDVI anomálie\n- **Bez nutnosti** prehliadky poľa poisťovateľom\n- **Trh**: Hannover Re, Munich Re — EÚ parametrické poistenie\n\n**5. EÚ CAP kontroly:**\n- **SZIF** používa Sentinel dáta pre kontrolu LPIS (pozri [[lpis]])\n- Detekuje \"zber pred vyhlásením\", neoznámené operácie\n- \"Geo-tagged photos\" verifikované satelitmi\n\n**6. Historická analýza poľa:**\n- 10+ rokov NDVI dát ZADARMO\n- Identifikácia variability pôdy (zóny)\n- Plánovanie investícií (drenáž, vápnenie zón)\n\n**Technické obmedzenia:**\n- **Mraky** — Sentinel-2 optický nevidí cez mrak (cca 30 % snímok zamračených)\n- **Rozlíšenie** — 10 m nevidí jednotlivé rastliny (len plošne)\n- **Atmosférické korekcie** — vyžaduje preprocessing (riešia platformy)\n- **Časový lag** — od snímania po dostupnosť 1–7 dní\n\n**Cena PRE farmu:**\n\n**Free tier** (Sentinel + OneSoil):\n- **0 Kč**\n- Základný NDVI 1× týždenne\n- Vhodné pre malé farmy\n\n**Mid tier** (Climate FieldView, eAgronom):\n- **15 000–40 000 Kč/rok**\n- Plné rozhranie, mapy variabilnej dávky, integrácia s technikou\n- Vhodné pre 200–1 000 ha farmy\n\n**Top tier** (Planet + custom analytics):\n- **100 000+ Kč/rok**\n- Denné 3m rozlíšenie, vlastné AI modely\n- Vhodné pre veľké korporátne farmy alebo výskumné projekty\n\n**Budúcnosť:**\n- **Sentinel-3 NextGen** (2025+) — vyššie rozlíšenie\n- **AI integrácia** — automatická detekcia konkrétnych chorôb (hrdze, septorióza)\n- **Real-time poistenie** — okamžitá výplata podľa satelitu\n- **Carbon credits** — verifikácia sekvestrácie pomocou satelitného monitoringu (pozri [[karbonove-zemedelstvi]])\n\nPozri tiež [[ndvi]], [[variable-rate]], [[gps-rtk]], [[lpis]], [[karbonove-zemedelstvi]], [[telematika]], [[drony-zemedelstvi]].",
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
    "shortDef": "Agrolesníctvo je systém pestovania stromov a poľnohospodárskych plodín alebo živočíchov na rovnakom pozemku. Kľúčové formy: alley cropping (rady stromov medzi plodinami), silvopasture (pastva medzi stromami), forest farming (rozšírený les). V ČR ho podporuje opatrenie agrolesníctvo českého Strategického plánu SPP 2023–2027.",
    "longDef": "Agrolesníctvo (anglicky *agroforestry*, „poľnohospodárstvo s lesom\") je **integrovaný systém pestovania stromov + poľnohospodárskych plodín alebo živočíchov** na rovnakom pozemku. Synergia stromov a poľnohospodárstva zvyšuje produktivitu, biodiverzitu, sekvestráciu uhlíka.\n\n**Hlavné formy:**\n\n**1. Alley cropping (medzisadené poľné hospodárstvo):**\n- **Princíp**: rady stromov (ovocné, lesnícke) v medzerách 15–40 m medzi nimi pestujeme plodiny\n- **Stromy**: orech, jabloň, hruška, lipa, dub červený, jelša\n- **Plodiny**: pšenica, kukurica, repka, strukoviny\n- **Výnos plodín**: -10 až -20 % (kvôli zatieneniu)\n- **Plus stromy**: ovocie, drevo, sekvestrácia C → kompenzácia + bonus\n\n**2. Silvopasture (pastva medzi stromami):**\n- **Princíp**: pastviny s rozptýlenými stromami alebo radami\n- **Výhody**: tieň pre dobytok (znížený tepelný stres), pastva pod stromami, biodiverzita\n- **Stromy**: dub, gaštan, ovocné, akcie orech\n- **Tradícia**: dehesa (Španielsko), montado (Portugalsko), pastviny v Krkonošiach (ČR)\n\n**3. Forest farming:**\n- **Princíp**: rozšírené pestovanie pod lesným pokrytím\n- **Plodiny**: huby, lesné jahody, bylinky, ženšen\n- **Niche trh**, vysoká marža\n\n**4. Vetrolamy + plodiny:**\n- **Pásové výsadby** stromov okolo polí (5–20 m široké)\n- **Ochrana** proti veternej erózii\n- **Mikroklíma** — menej sucha, lepšie výnosy o 5–15 %\n- **Tradícia v ČR**: vetrolamy na južnej Morave\n\n**5. Riparian buffer (brehové porasty):**\n- **Stromy pozdĺž vodných tokov** (5–30 m)\n- **Účel**: filtrácia splavov hnojív + pesticídov, biodiverzita\n\n**6. Plantážové ovocné sady:**\n- **Klasický sad** je už agroforestry forma\n- **Intenzívne**: jablone 800–1 200/ha, jednoosé rady\n- **Plus**: trávny pás medzi rady → cielená pastva dobytka\n\n**Ekosystémové benefity:**\n\n**1. Sekvestrácia uhlíka:**\n- **Stromy ukladajú C v dreve + pôde** — 2–10 t CO₂/ha/rok\n- Uhlíkové kredity pozri [[karbonove-zemedelstvi]]\n\n**2. Biodiverzita:**\n- **Stromy** = habitat pre vtáky, hmyz, drobné cicavce\n- **Pesticídna redukcia** — predátori škodcov (lienky, parazitoidný hmyz)\n\n**3. Vodné hospodárstvo:**\n- **Korene stromov** infiltrujú vodu hlbšie\n- **Znižuje eróziu** (pozri [[eroze-pudy]])\n- **Vetrolamy** znižujú evaporáciu o 20–30 %\n\n**4. Welfare zvierat (silvopasture):**\n- Tieň v lete = nižší tepelný stres\n- Voľný pohyb pre dobytok\n\n**5. Diverzifikácia príjmov:**\n- Plodiny + drevo + ovocie + huby + biopalivá\n- Risk-spreading proti trhovým šokom\n\n**Ekonomika:**\n\n**Náklady na výsadbu**:\n- **Stromy** (sadenice): 100–500 Kč/strom\n- **Hustota**: 100–400 stromov/ha (radové výsadby)\n- **Ochrana** (chrániče proti zveri, plot): 50–200 Kč/strom\n- **Údržba** (polievanie prvé 3 roky, rez): 20–50 Kč/strom/rok\n- **Celkovo startup**: 30 000–100 000 Kč/ha\n- **Prevádzkové**: 1 000–3 000 Kč/ha/rok\n\n**Návratnosť**:\n- **Ovocie** od roku 5–7 (jabloň, hruška)\n- **Orechy** od roku 8–12 (orech)\n- **Drevo** od roku 30–60 (lesnícke dreviny)\n- **Carbon credits** ihneď (3–8 EUR/t CO₂)\n- **CAP dotácie** za stromy (pozri ďalej)\n\n**EU CAP 2023–2027 a agrolesníctvo:**\n\n**1. Opatrenie agrolesníctvo v ČR** (nariadenie vlády ČR č. 140/2023 Sb.):\n- **Dotácia na založenie agrolesníckeho systému a na starostlivosť oň** — vypláca SZIF podľa sadzieb v EUR na hektár\n\n**2. Celofarmová ekoplatba v ČR:**\n- **Ochranný pás založený v rámci agrolesníctva** sa môže započítať do neprodukčných plôch\n- **Údržba krajinných prvkov** (stromoradie, skupina drevín, solitérna drevina) — samostatná platba od roku 2025 (2025: 38 261,21 Kč/ha)\n\n**3. EÚ:**\n- **Cieľ EÚ**: 3 mld. nových stromov do roku 2030 (Stratégia EÚ v oblasti biodiverzity do roku 2030)\n\n**Právny rámec v ČR:**\n- **LPIS** — agrolesnícky systém aj krajinné prvky sa evidujú v LPIS\n- **DZES 8** (GAEC 8) vyžaduje zachovanie krajinných prvkov\n\n**Implementačné bariéry:**\n1. **Dlhodobá investícia** — návratnosť 5–30 rokov\n2. **Prenajatá pôda** — nájomca nechce investovať do stromov\n3. **Zatienenie plodín** — pokles výnosov o 10–20 %\n4. **Údržba** — rez, ochrana, polievanie\n5. **Mechanizácia** — prekáža poľným strojom\n\n**Príklady úspešných fariem:**\n- **Wakelyns** (UK) — alley cropping pšenica + orech, 30+ rokov\n- **Pilotné projekty v ČR** — Jihočeská univerzita, Mendelu Brno\n\n**Trend:**\n- **EU stratégia \"Farm to Fork\"** podporuje agroforestry\n- **Climate change adaptation** — stromy + plodiny = odolnosť\n- **Carbon credits** — rastúci trh pre agroforestry sekvestráciu\n\nPozri tiež [[karbonove-zemedelstvi]], [[regenerativni-zemedelstvi]], [[eroze-pudy]], [[mez]], [[biopasy]], [[gaec]].",
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
    "term": "Hydropónia",
    "alias": [
      "hydroponics",
      "bezpôdne pestovanie",
      "soilless growing"
    ],
    "kategorie": "precise-farming",
    "shortDef": "Hydropónia je pestovanie rastlín bez pôdy — v inertnom substráte (perlít, kokos, kamenná vlna) alebo priamo vo vode s živinami. Kľúčová pre skleníky (rajčiny, paprika, šalát) a vertikálne farmy. Spotreba vody -90 %, výnos +30 % vs pôdne pestovanie.",
    "longDef": "Hydropónia (grécky *hydro* + *ponos* = voda + práca) je **pestovanie rastlín bez pôdy** — korene v inertnom substráte (perlít, kokos, kamenná vlna) alebo priamo vo vode s rozpustenými živinami. Kľúčová technológia pre **skleníky, vertikálne farmy, mestské poľnohospodárstvo**.\n\n**Princíp:**\n- Rastlina získava **živiny z vodného roztoku** (= nutrient solution), nie z pôdy\n- Korene v inertnom substráte (štruktúra) alebo priamo vo vzduchu/vode\n- **Presné ovládanie** pH, EC (elektrická vodivosť), teploty, koncentrácií N/P/K\n- **Veľmi efektívne** využitie vody a živín\n\n**Hlavné systémy:**\n\n**1. NFT (Nutrient Film Technique):**\n- **Mäkký prúd** výživného roztoku cez korene v žlabe\n- **Plodiny**: šalát, bazalka, jahody\n- **Plusy**: jednoduchý, lacný\n- **Mínusy**: výpadok pumpy = rýchla smrť rastlín\n\n**2. DWC (Deep Water Culture):**\n- **Korene ponorené** v prevzdušnenom roztoku\n- **Vzduchovače** dodávajú kyslík koreňom\n- **Plodiny**: šalát, kanabis (medicínsky), bylinky\n- **Plusy**: vysoký výnos, jednoduchý\n- **Mínusy**: výpadok vzduchu = korene anaeróbne za 4 h\n\n**3. Ebb & Flow (Flood & Drain):**\n- **Periodicky** zaplavovaný substrát\n- **Plodiny**: zelenina, ovocie, dekoratívne\n- **Plusy**: flexibilný, lacný\n- **Mínusy**: vyžaduje kontrolu časovačom\n\n**4. Drip irrigation:**\n- **Kvapky výživy** na báze substrátu (kamenná vlna, kokos)\n- **Plodiny**: rajčiny, paprika, uhorky (skleníkové)\n- **Plusy**: presnosť, EÚ štandard\n- **Mínusy**: vyššie investície\n\n**5. Aeroponics:**\n- **Korene vo vzduchu** + sprej výživy\n- **Plodiny**: šalát, zemiaky (sadenice)\n- **Plusy**: najvyšší kyslík = najrýchlejší rast\n- **Mínusy**: vysoká investícia, technicky náročné\n\n**Substráty:**\n\n**1. Kamenná vlna (Rockwool):**\n- **EÚ skleníky štandard** pre rajčiny, papriku\n- **Cena**: 50–150 Kč/m³\n- **Recyklácia**: drahá, environmentálny problém\n\n**2. Kokosové vlákno:**\n- **Bio prístup** — alternatíva kamennej vlny\n- **Cena**: 80–200 Kč/m³\n- **Plus**: biologicky rozložiteľné\n\n**3. Perlít, vermikulit:**\n- **Ľahké** substráty pre pestovateľské boxy\n- **Cena**: 100–300 Kč/m³\n\n**4. Hydroton (expandovaný íl):**\n- **Pelietky** pre DWC, ebb & flow\n- **Cena**: 80–200 Kč/m³, opakovane použiteľný\n\n**5. Bezsubstrátové** (NFT, DWC, aero):\n- **Žiadny substrát** = najnižšie náklady\n- Vhodné len pre šalát, bylinky\n\n**Výživa — nutrient solution:**\n\n**Kľúčové prvky** (NPK + mikroprvky):\n- **N**: 100–250 mg/l (záleží na plodine)\n- **P**: 30–80 mg/l\n- **K**: 150–300 mg/l\n- **Ca**: 100–200 mg/l\n- **Mg**: 30–60 mg/l\n- **Mikroprvky**: Fe, Mn, Zn, Cu, B, Mo (v ppb)\n\n**pH**: 5,5–6,5 (optimálna absorpcia živín)\n**EC**: 1,5–3,0 mS/cm (záleží na plodine)\n**Teplota roztoku**: 18–22 °C\n\n**Komerčné hnojivá:**\n- **Hoagland solution** — klasický recept\n- **PPM (Plant Prod)** — komerčné zmesi\n- **Floraseries** (GHE) — kanabis-orientované\n- **Yara Krista** — profesionálne\n\n**Aplikácie:**\n\n**1. Skleníky rajčín:**\n- Holandsko = 8 000 ha (50 % EÚ produkcie v 1 krajine!)\n- **Výnos rajčín**: 60–80 kg/m²/rok (vs 4 kg/m² pôdne)\n- **Cena inštalácie skleníka**: 2 000–5 000 Kč/m²\n\n**2. Skleníky paprik, uhorky:**\n- Podobné rajčinám\n\n**3. Šalát a bylinky (NFT, DWC):**\n- **24 hodinový cyklus** — zber každý deň\n- **Plant factory** koncept\n\n**4. Jahody:**\n- **Hydroponické jahody** — celoročný zber\n- **Vysoký premium** (chuť, cena)\n\n**5. Kanabis (medicínsky):**\n- **EÚ rastúci trh** (DE, NL, ČR pilotné programy)\n- **Hydropónia** = štandard pre indoor pestovanie\n\n**6. Šalátové micro-greens:**\n- **8–14 dní cyklus** — rýchly zber\n- **Premium retail** — chefs, fine dining\n\n**Výhody hydropónie:**\n\n1. **Voda**: -90 % spotreba (recirkulácia)\n2. **Živiny**: -50 % (presné dávkovanie)\n3. **Výnos**: +30 až +1 000 % vs pôdne (záleží na plodine)\n4. **Tlak mikroorganizmov**: nižší (sterilné prostredie)\n5. **Pesticídy**: -80 % (kontrolované prostredie)\n6. **Plocha**: 5–10× vyššia produkcia na m²\n7. **Sezonalita**: 24/7 produkcia\n8. **Kvalita**: konzistentná, premium\n\n**Nevýhody:**\n\n1. **Vysoká investícia** — startup 2 000–10 000 Kč/m²\n2. **Energetická náročnosť** (LED osvetlenie, vzduchovače)\n3. **Technicky komplexné** — vyžaduje znalosti chémie + biológie + IT\n4. **Závislosť od elektriny** — výpadok = strata\n5. **Nutrient management** — drahé profesionálne výživy\n6. **Nie je certifikované bio** (s výnimkou niektorých US štátov)\n\n**Ekonomika:**\n\n**Skleník rajčín 1 ha (10 000 m²):**\n- Investícia: 30–50 mil. Kč\n- Prevádzkové náklady: 5–10 mil. Kč/rok (energia, voda, výživa, práca)\n- Výnos: 700 t/ha × 35 Kč/kg = 24,5 mil. Kč/rok\n- Marža: 14,5 mil. Kč/rok\n- Návratnosť: 3–4 roky\n\n**Vertikálna farma šalátu (pozri [[vertikalni-farma]]):**\n- Investícia: 100 000–300 000 Kč/m² stavebnej plochy\n- Vyššia produkcia na m² ale drahšia investícia\n- Návratnosť: 5–10 rokov\n\n**Trendy 2024:**\n- **LED technológia** — efektívnejšie, cenovo dostupné\n- **AI kontrolné systémy** — automatizácia pH, EC, klíma\n- **CRISPR plodiny** šité na mieru hydropónii\n- **Plant factories** — plne automatizované, 24/7\n\nPozri tiež [[vertikalni-farma]], [[precision-livestock-farming]], [[npk-hnojivo]], [[satelity-zemedelstvi]].",
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
    "shortDef": "Vertikálna farma je viacposchodový systém pestovania plodín v kontrolovanom vnútornom prostredí (LED osvetlenie, hydropónia). Cieľ: produkcia v mestách, blízko spotrebiteľa, 365 dní/rok. Výnosy 50–100× vyššie na m² pôdy, ale energetická náročnosť vysoká.",
    "longDef": "Vertikálna farma (anglicky *vertical farming*, *plant factory*) je **viacposchodový systém pestovania plodín v kontrolovanom vnútornom prostredí** (CEA — Controlled Environment Agriculture). Kombinácia **hydropónie** (pozri [[hydroponie]]) + **LED osvetlenie** + **AI/IoT** kontrola + vertikálne stohovanie.\n\n**Princíp:**\n- **Viacposchodová štruktúra** (5–20+ poschodí)\n- **LED osvetlenie** nahrádza slnko (červené + modré spektrum)\n- **Hydropónia** nahrádza pôdu\n- **HVAC** (klimatizácia) kontroluje teplotu, vlhkosť, CO₂\n- **Úplne izolované** od vonkajšieho prostredia — žiadne pesticídy, choroby\n- **365 dní/rok** produkcia\n\n**História:**\n- **1999** — Dickson Despommier (Columbia University) popularizuje koncept\n- **2010** — prvé komerčné vertikálne farmy v Japonsku (Tokio)\n- **2015+** — investičný boom v USA, EÚ\n- **2022–2023** — niektoré veľké projekty (Plenty, AeroFarms, Infarm) **kolaps** kvôli vysokým nákladom\n- **2024** — konsolidácia trhu, fokus na ekonomicky funkčné modely\n\n**Hlavné plodiny:**\n\n**1. Šalát (90 % komerčných vertikálnych fariem):**\n- **Cyklus**: 21–35 dní z osiva\n- **Výnos**: 1 500–3 000 hláv/m² stavebnej plochy/rok\n- **Trh**: retail premium (Tesco, Whole Foods), reštaurácie\n\n**2. Micro-greens:**\n- **Cyklus**: 7–14 dní\n- **Premium**: 800–2 000 Kč/kg\n- **Trh**: fine dining, mixed sets\n\n**3. Bylinky (bazalka, koriander, mäta):**\n- **Cyklus**: 25–45 dní\n- **Vysoký premium**: 1 500–3 000 Kč/kg\n- **Trh**: retail + foodservice\n\n**4. Jahody:**\n- **Celoročná** produkcia\n- **Premium**: až 800 Kč/kg\n- **Trh**: prémiové retail\n\n**5. Listová zelenina** (kale, špenát, rukola):\n- Podobné šalátu\n- Rastúci trend pre fitness/health-conscious\n\n**6. Rajčiny, paprika** — zriedkavo (energeticky nákladné):\n- **Iba high-tech farmy**\n- Stúpajúce úsilie (Plenty, Bowery)\n\n**7. Kanabis (medicínsky):**\n- **EÚ rastúci trh** (regulačne obmedzený)\n- **Premium**: extrémne vysoký\n- **Energia**: ešte vyššia ako šalát\n\n**Kľúčové technológie:**\n\n**1. LED osvetlenie:**\n- **Červené svetlo** (660 nm) — fotosyntéza\n- **Modré svetlo** (450 nm) — vegetatívny rast\n- **Spectrum tuning** podľa plodiny + rastových fáz\n- **DLI** (Daily Light Integral): 10–25 mol/m²/deň\n- **Cena LED**: 5 000–15 000 Kč/m² pestovateľskej plochy\n- **Životnosť**: 50 000–80 000 h (5–10 rokov)\n\n**2. HVAC (klimatizácia):**\n- **Teplota**: 20–24 °C\n- **Vlhkosť**: 65–75 %\n- **CO₂ enrichment**: 800–1 200 ppm (vs 420 ppm normálna atmosféra)\n- **Spotreba energie**: 50 % celkovej farmy spotreby\n\n**3. Hydroponický systém:**\n- **NFT, DWC, aeroponics** (pozri [[hydroponie]])\n- **Automatická výživa** + monitoring pH + EC\n- **Recirkulácia vody** = 95 % úspora vs pôdne\n\n**4. Automatizácia:**\n- **Robotická sejba, presádzanie, zber**\n- **AI vision** pre detekciu chorôb, rastových fáz\n- **Prediktívna kontrola** klímy a osvetlenia\n\n**5. Softvér a IoT:**\n- **Plant Hub, Source.AI** — monitoring rastlín\n- **Skylab Analytics** — optimalizácia výkonu\n- **Cloud platforms** pre multi-farm operations\n\n**Energetická náročnosť (kľúčový problém):**\n\n**Spotreba na kg produkcie:**\n- **Šalát**: 8–25 kWh/kg\n- **Bylinky**: 15–40 kWh/kg\n- **Rajčiny**: 60–100 kWh/kg (preto nevhodné!)\n- **Kanabis**: 1 000+ kWh/kg\n\n**Cena elektriny** = ~50–70 % nákladov farmy\n- Pri 4 Kč/kWh × 20 kWh/kg šalátu = **80 Kč/kg len energie**\n- Plus práca + materiály + amortizácia = celkové náklady 150–300 Kč/kg šalátu\n- Vs **poľný šalát**: 30–60 Kč/kg náklady\n\n**Ekonomická realita:**\n\n**Vertikálna farma rentabilná len pre:**\n1. **Premium retail** (Whole Foods, Tesco F&F): 250–500 Kč/kg\n2. **Reštaurácie** (fine dining): 400–1 200 Kč/kg\n3. **Špeciálne produkty** (micro-greens, exotické bylinky): 800+ Kč/kg\n4. **B2B kontrakty** (sushi chefs, salad chains)\n\n**NIE pre masový trh** (bežný šalát v Lidli za 30 Kč/kg) — ekonomicky nemožné.\n\n**Kľúčové farmy (2024):**\n- **AeroFarms** (USA) — Newark, NJ. 6 000 m² farma, šalát\n- **Plenty** (USA) — financované SoftBank, problémy s rentabilitou\n- **Bowery Farming** (USA) — rajčiny, šalát\n- **Infarm** (DE) — modulárne farmy v supermarketoch, **kolaps 2023**\n- **Sky Greens** (Singapur) — prvá komerčná (2012)\n- **YesHealth iFarm** (Taiwan) — high-tech\n- **Spread** (Japonsko) — automatizácia top\n- **Crops in Pots** (Praha, ČR) — pilotná\n\n**Situácia v ČR:**\n- **Pilotné projekty** v Prahe, Brne\n- **Žiadna veľká komerčná farma** zatiaľ\n- **Trh: premium retail + reštaurácie** — limit ~100 t produkcie/rok pre celú ČR\n- **Bariéry**: vysoká investícia (50–200 mil. Kč), lacná dovozová produkcia zo Španielska\n\n**Bariéry adopcie:**\n1. **Vysoká investícia**: 100–300 tis. Kč/m² stavebnej plochy\n2. **Energetická náročnosť** — drahá elektrina\n3. **Klimatická závislosť** — solar/wind potrebné pre zníženie uhlíkovej stopy\n4. **Ľudský kapitál** — vyžaduje IT + biológiu + engineering\n5. **Trh limit** — premium segment je malý\n\n**Výhody:**\n1. **Voda**: 90–95 % úspora\n2. **Pesticídy**: 0 (kontrolované prostredie)\n3. **Výnos/m²**: 50–100× vs poľný\n4. **Sezonalita**: 365 dní\n5. **Lokálnosť**: žiadna doprava (mestské poľnohospodárstvo)\n6. **Konzistentná kvalita**\n\n**Trendy 2024+:**\n- **Konsolidácia** trhu (veľké projekty skolabovali)\n- **Solar + battery integration** — zníženie elektrickej závislosti\n- **AI optimalizácia** — algoritmy na zníženie energie o 20–40 %\n- **GMO/CRISPR plodiny** vyšľachtené na mieru vertikálnemu farmingu (rýchly rast, nízke nároky na svetlo)\n- **Hybrid modely** — semi-vertical greenhouse (využitie slnečného svetla + LED supplement)\n\n**Etická diskusia:**\n- **Vertikálne farmy = budúcnosť** alebo **drahý gimmick**?\n- **Poľné poľnohospodárstvo** stále najekonomickejšie pre väčšinu plodín\n- **Vertikálne farmy = niche** pre mestské premium\n\nPozri tiež [[hydroponie]], [[satelity-zemedelstvi]], [[precision-livestock-farming]].",
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
    "longDef": "IoT (Internet of Things, „internet vecí\") v poľnohospodárstve je **sieť prepojených senzorov, strojov a systémov**, ktoré zbierajú dáta v reálnom čase, posielajú ich do cloudu na AI analýzu a poskytujú **manažment rozhodnutí**.\n\n**Kľúčové komponenty IoT systému:**\n\n**1. Senzory (zbieranie dát):**\n\n**Pôdne senzory:**\n- **Vlhkosť pôdy** (TDR — Time Domain Reflectometry, kapacitné)\n- **Teplota pôdy** (viacero hĺbok: 10, 30, 60 cm)\n- **EC** (elektrická vodivosť — slanosť, živiny)\n- **pH pôdy** (priamo v poli)\n- **NPK senzory** (real-time meranie)\n- **Cena**: 2 000–20 000 Kč za senzor\n\n**Klimatické stanice:**\n- **Vzdušná teplota, vlhkosť, zrážky, vietor, slnečná radiácia**\n- **Doplnky**: tlak, evapotranspirácia, listová vlhkosť (= riziko chorôb)\n- **Trh**: Davis Instruments, Pessl Metos, Sencrop\n- **Cena**: 10 000–80 000 Kč\n\n**Plodinové senzory:**\n- **NDVI z dronu alebo satelitu** (pozri [[ndvi]], [[satelity-zemedelstvi]])\n- **Kamerové systémy** (computer vision pre choroby)\n- **Sap flow sensors** (cievny prietok v rastline)\n\n**Zvieracie senzory (PLF):**\n- **Obojky** (akcelerometer, GPS) — pozri [[precision-livestock-farming]]\n- **Bolus senzory v bachore**\n- **In-line mliečne analyzátory**\n- **Kamery v maštali**\n\n**Strojové senzory:**\n- **GPS-RTK** v traktore, kombajnoch (pozri [[gps-rtk]])\n- **Telematika** — pozri [[telematika]]\n- **CAN bus dáta** — motor, hydraulika, palivo\n- **Yield monitor** — pozri [[yield-monitor]]\n\n**Vodné senzory:**\n- **Prítok** v sieťach zavlažovania\n- **Hladina** v nádržiach, studniach\n- **Monitorovanie čerpadla**\n\n**2. Komunikačná vrstva (prenos dát):**\n\n**LoRaWAN** (Long Range WAN):\n- **Dosah**: 5–15 km na vidieku\n- **Spotreba**: extrémne nízka (batéria 5+ rokov)\n- **Vhodné**: pôdne senzory, vodné hospodárstvo\n- **Cena**: 200–500 Kč/senzor/rok\n\n**NB-IoT (Narrowband):**\n- **Mobilná sieť** (3G/4G/5G)\n- **Vyššia spotreba**, ale lepšie pokrytie\n- **Vhodné**: mobilné zvieratá, traktory\n\n**Wi-Fi:**\n- **Krátky dosah** (100 m), vyššia spotreba\n- **Vhodné**: maštale, sklady\n\n**5G**:\n- **Vysoká priepustnosť** + nízka latencia\n- **Vhodné**: autonómne stroje, drony, kamerová analýza\n\n**3. Cloud + Edge computing:**\n\n**Edge (lokálne):**\n- **Predspracovanie dát** na traktore, v maštali\n- **Zníženie dátového prenosu** do cloudu\n- **Rýchlejšia odozva** (real-time rozhodnutia)\n\n**Cloud:**\n- **AWS, Azure, Google Cloud** — platformy\n- **AWS Greengrass**, **Azure IoT Edge** — IoT-špecifické\n- **Cena**: 5 000–50 000 Kč/mesiac pre veľkú farmu\n\n**4. AI/ML analýza:**\n\n**Aplikácie:**\n- **Prediktívna údržba** strojov (zlyhanie motora)\n- **Predikcia chorôb** podľa počasia + stavu poľa\n- **Predpovedanie výnosu** z viacerých dátových zdrojov\n- **Detekcia anomálií** v správaní zvierat\n- **Optimalizácia** kŕmenia, postrekov, hnojenia\n\n**5. Vizualizácia + dashboardy:**\n\n- **Webové platformy**: Climate FieldView, OneSoil, eAgronom\n- **Mobilné aplikácie** pre farmárov\n- **Alarmy** (SMS, email, push notifikácie)\n\n**Hlavné aplikácie IoT v ag:**\n\n**1. Smart zavlažovanie:**\n- Senzory pôdnej vlhkosti + meteodata + AI = optimálny plán zavlažovania\n- **Úspora vody**: 30–50 %\n- **ROI**: 1–2 roky\n\n**2. Predikcia chorôb:**\n- Listová vlhkosť + teplota + zrážky → predikcia septoriózy, plesní\n- **Modely**: BlightCast, SmartGrain, FieldClimate\n- **Cielené postreky** namiesto paušálnych\n\n**3. Monitorovanie plodín:**\n- Dron + satelit + pôdne senzory = komplexné monitorovanie\n- **Variabilná aplikácia** hnojív, postrekov (pozri [[variable-rate]])\n\n**4. Monitorovanie hospodárskych zvierat:**\n- Pozri [[precision-livestock-farming]]\n- Detekcia ruje, mastitídy, krívania\n\n**5. Monitorovanie skladovania:**\n- Teplota + vlhkosť v sile, v sklade obilnín\n- **Prevencia**: hniloba, plesne, plesňové toxíny\n\n**6. Automatizácia skleníkov:**\n- Teplota + vlhkosť + CO₂ + kontrola osvetlenia\n- **Úplne automatizované** pre skleníky rajčín, paprík\n\n**7. Správa flotily:**\n- GPS + CAN dáta všetkých strojov\n- **Optimalizácia** logistiky, sledovanie paliva, prevencia krádeží\n\n**8. Smart postrekovač:**\n- Sekčná kontrola (pozri [[section-control]]) + RTK GPS + senzory\n- Plné variabilné aplikácie pesticídov\n\n**Príklady IoT riešení v ČR:**\n\n**Mestská farma:**\n- **Climate FieldView** (Bayer) — top globálny\n- **OneSoil** — freemium pre malé farmy\n- **eAgronom** (EE) — estónska platforma pre manažment farmy\n\n**Veľkí hráči:**\n- **John Deere Operations Center** — integrovaný systém\n- **Bayer Climate FieldView** — globálna platforma\n- **CNH Industrial AGXTEND** — kombinácia strojov + dát\n\n**Ekonomika IoT pre typickú farmu (500 ha):**\n\n**Investície:**\n- 5 pôdnych staníc × 8 000 Kč = 40 000 Kč\n- 1 meteostanica × 50 000 Kč = 50 000 Kč\n- RTK kit do 2 traktorov × 80 000 Kč = 160 000 Kč\n- Yield monitor v kombajne = 100 000 Kč\n- Softvér ročne = 30 000 Kč\n- **Startup**: 350 000–400 000 Kč\n- **Ročne**: 50 000–100 000 Kč (softvér + údržba)\n\n**Benefity:**\n- Variabilná aplikácia N: -10–20 % spotreba = 500–1 000 Kč/ha × 500 ha = 250 000–500 000 Kč/rok\n- Lepšie načasovanie postrekov: -30 % postrekových nákladov = 100 000–300 000 Kč/rok\n- Menej paliva (RTK = menej prekryvov): -5 % = 50 000–100 000 Kč/rok\n- Lepšie výnosy: +200 kg/ha pšenice = +650 000 Kč/rok pre 500 ha\n\n**ROI**: 1–3 roky pre typickú farmu\n\n**Bariéry:**\n1. **Investície** — vysoké pre malé farmy\n2. **Internetové pripojenie** — vidiek má problém\n3. **Komplexnosť** — vyžaduje IT znalosti\n4. **Integrácia dát** — rôzne platformy nesynchronizujú\n5. **Ochrana súkromia** — kto vlastní dáta farmy?\n\n**Štandardy a interoperabilita:**\n- **ISOBUS** (pozri [[isobus]]) — komunikácia traktor ↔ náradie\n- **ADAPT** (AgGateway) — štandard výmeny dát\n- **GDPR-like** debaty o vlastníctve farmárskych dát\n\n**Trendy 2024+:**\n- **5G adopcia** — rýchlejšie, nižšia latencia\n- **Edge AI** — viac inteligencie v teréne\n- **Open data platforms** — interoperabilita\n- **Overenie uhlíkových kreditov** — IoT dáta verifikujú sekvestráciu\n- **Blockchain sledovateľnosť** — potravinový reťazec od farmy po spotrebiteľa\n\nPozri tiež [[telematika]], [[precision-livestock-farming]], [[satelity-zemedelstvi]], [[gps-rtk]], [[variable-rate]], [[isobus]], [[yield-monitor]].",
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
    "shortDef": "Uhlíkový kredit = certifikát potvrdzujúci 1 tonu CO₂ ekvivalentu sekvestrovanej alebo neuvoľnenej do atmosféry. Poľnohospodár produkuje kredity pomocou no-till, krycích plodín, biouhlia a predáva ich korporáciám na plnenie klimatických cieľov. EÚ obnovuje regulačný rámec (CRCF 2024).",
    "longDef": "Uhlíkové kredity sú **certifikáty potvrdzujúce 1 tonu CO₂ ekvivalentu** (1 t CO₂e) sekvestrovanej (uloženej) alebo emisie neuvoľnenej do atmosféry. Kľúčový **finančný nástroj klimatickej politiky** — kombinuje boj proti klimatickej zmene s ekonomickými stimulmi.\n\n**Princíp:**\n\n1. **Poľnohospodár** implementuje praktiky znižujúce emisie alebo sekvestrujúce C:\n   - **No-till** (pozri [[no-till]]) — žiadna oxidácia pôdneho C\n   - **Krycie plodiny** (pozri [[mezi-plodiny]]) — C v pôde\n   - **Hnojivá organické** namiesto minerálnych — menej N₂O emisií\n   - **Biouhlie** (pozri [[biouhel]]) — stabilné C 500+ rokov\n   - **TTP konverzia** (pozri [[ttp]]) — lúky ukladajú 2–4× viac C než orná pôda\n   - **Agrolesníctvo** (pozri [[agrolesnictvi]]) — stromy + poľnohospodárstvo\n\n2. **Certifikačná organizácia** overí sekvestráciu:\n   - Pôdne vzorky (pred + po)\n   - Modely (LCA, IPCC)\n   - Satelitné dáta (pozri [[satelity-zemedelstvi]])\n\n3. **Vystavenie uhlíkových kreditov**: 1 kredit = 1 t CO₂e\n\n4. **Predaj kreditov**:\n   - **Dobrovoľný trh**: korporácie kupujú pre ESG, klimatické ciele\n   - **Povinný trh**: EÚ ETS, kalifornské CCA (zatiaľ bez poľnohospodárstva)\n\n5. **Korporácie** používajú kredity na klimatickú neutralitu\n\n**Cena uhlíkového kreditu:**\n\n**Dobrovoľný trh (2024):**\n- **Vysoká kvalita (overená dodatočnosť)**: 15–25 EUR/t CO₂\n- **Štandardná kvalita**: 5–15 EUR/t CO₂\n- **Junk kredity** (kontroverzné): 1–5 EUR/t CO₂\n\n**Povinný trh (EÚ ETS, 2024):**\n- **EÚ povolenie (EUA)**: 60–90 EUR/t CO₂\n- Poľnohospodárstvo zatiaľ **MIMO ETS** (EÚ plánuje zahrnutie ~2030)\n\n**Certifikačné štandardy:**\n\n**1. Verra VCS (Verified Carbon Standard):**\n- **Globálny #1**, ~75 % dobrovoľného trhu\n- Drahá certifikácia, ale uznávaná\n- Vlastné podštandardy: VM0042 (vylepšené poľnohospodárske hospodárenie), VM0017 (no-till)\n\n**2. Gold Standard:**\n- Dôraz na **sociálny dopad** + klimatický\n- Vyššia cena kreditov\n\n**3. American Carbon Registry (ACR):**\n- USA, krajinné projekty\n\n**4. Climate Action Reserve (CAR):**\n- USA, poľnohospodársky špecifické\n\n**5. CDM** (Clean Development Mechanism):\n- UN-riadený, post-Kyoto Protocol\n- Klesajúci trh (Paris Agreement nahradil)\n\n**EÚ-špecifické platformy:**\n\n**Climate Farmers (DE):**\n- EÚ agroles, platby za t CO₂e\n- ~20 EUR/t\n\n**Soil Capital (BE):**\n- Belgicko-francúzska, regeneratívne ag fokus\n- Ročné platby za ha podľa implementácie\n\n**Indigo Ag (USA + EÚ):**\n- Veľká agtech platforma\n- Program uhlíkov + agronomické služby\n\n**eAgronom (EE):**\n- Estónsky softvér pre CZ + EÚ farmy\n- Servis certifikácie uhlíkových kreditov\n\n**EÚ CRCF (Carbon Removals Certification Framework):**\n\n**Nariadenie 2024** — nový EÚ právny rámec pre uhlíkové kredity:\n- **Štandardizácia** výpočtov\n- **Trvalosť** požiadavky (uhlíkový kredit musí \"vydržať\" 100+ rokov pre sekvestráciu)\n- **Dodatočnosť** — kredit len ak by farma bez neho sekvestráciu NEROBILA\n- **MRV** (Monitoring, Reporting, Verification) — pravidelná verifikácia\n\n**Cieľ**: zvýšiť kvalitu kreditov, vyhnúť sa greenwashingu\n\n**Príklad ekonomiky pre CZ farmu (500 ha):**\n\n**Implementácia**:\n- Prechod z orby na no-till + krycie plodiny na celých 500 ha\n- Investície do techniky (strip-till stroj): 1,5 mil. Kč\n- Ročné zvýšené náklady (osivo krycích plodín, postrek): +100 000 Kč/rok\n\n**Sekvestrácia** (typicky):\n- 0,5 t C/ha/rok = 1,83 t CO₂e/ha/rok\n- 500 ha × 1,83 = **916 t CO₂e/rok**\n\n**Príjem z kreditov**:\n- 916 t × 20 EUR/t = **18 320 EUR/rok = ~460 000 Kč/rok**\n\n**Plus benefity**:\n- Zníženie nákladov na palivo (menej orby): 200 000 Kč/rok\n- Zníženie nákladov na hnojivá (lepšia pôda): 100 000 Kč/rok\n\n**Čistý prínos**: ~660 000 Kč/rok (po odpočítaní vyšších nákladov)\n**Návratnosť techniky**: 2–3 roky\n\n**Problémy a kritika:**\n\n**1. Dodatočnosť:**\n- Kredit je platný len ak by farma bez neho sekvestráciu NEROBILA\n- Sporné — veľké farmy prechod na regeneratívne ag robili aj bez kreditov\n- Riziko **greenwashingu**\n\n**2. Trvalosť:**\n- Ak farma za 10 rokov znovu zorá → uhlík sa vráti do atmosféry\n- Uhlíkový kredit by mal byť zrušený\n- Vyžaduje dlhodobé zmluvné záväzky\n\n**3. Verifikácia:**\n- Meranie C v pôde je drahé, často nepresné\n- Modely vs reálne meranie\n- Riziko **over-creditingu**\n\n**4. Únik:**\n- Ak farma A sekvestruje, ale farma B vedľa ju nahradí intenzívnejšou praxou → net dopad = 0\n- Globálny únik problém\n\n**5. Otázka spravodlivosti:**\n- Veľké korporátne farmy majú lepší prístup k certifikácii než malé rodinné\n- Riziko **uhlíkového kolonializmu** (bohaté farmy predávajú kredity na podporu vyšších emisií inde)\n\n**6. Volatilita ceny:**\n- Dobrovoľný trh: cena sa hýbe 10× v rozsahu 5 rokov\n- Riziko pre farmárov dlhodobo plánovať\n\n**Renaissance carbon farming:**\n\n**Dôvody rastu trhu:**\n1. **Paris Agreement** — globálne klimatické ciele\n2. **EÚ CRCF** — regulačná jasnosť\n3. **ESG reporting** — povinnosť korporácií reportovať uhlíkovú stopu\n4. **Net Zero pledges** — Microsoft, Apple, Google, Amazon kupujú kredity\n5. **Uhlíkové clo na hraniciach** (CBAM) — EÚ bude penalizovať dovoz s vysokou CO₂\n\n**Predikcia trhu:**\n- **2024**: 2–3 mld USD dobrovoľný uhlíkový trh\n- **2030**: 50–100 mld USD predikcia (McKinsey, BCG)\n- **Poľnohospodárstvo** = 20–30 % očakávaného trhu\n\n**Ako začať na CZ farme:**\n\n1. **Zistiť baseline**: súčasný stav organickej hmoty, pôdny C\n2. **Plánovať zmeny**: no-till, krycie plodiny, redukcia N hnojív\n3. **Nájsť platformu**: Climate Farmers, eAgronom, Soil Capital\n4. **Dohodnúť verifikáciu**: pôdne vzorky, satelitné monitorovanie\n5. **Implementovať 1+ rok**, potom žiadať kredity\n6. **Predať kredity** cez platformu\n\n**Náklady na zapojenie**:\n- Pôdne vzorky: 5 000–15 000 Kč/farma\n- Konzultácie: 20 000–50 000 Kč\n- Softvér/platform fee: 10–20 % z kreditov\n\n**Čistý príjem**: typicky 60–80 % z hrubého výnosu kreditov\n\nPozri tiež [[karbonove-zemedelstvi]], [[regenerativni-zemedelstvi]], [[no-till]], [[mezi-plodiny]], [[biouhel]], [[ttp]], [[agrolesnictvi]], [[satelity-zemedelstvi]].",
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
    "longDef": "Matka sa vyvíja z oplodneného vajíčka v matečníku a prechádza celým vývojom za približne 16 dní (vajíčko 3 dni, larva 5,5 dňa, kukla 7,5 dňa). Od robotníc sa líši výrazne predĺženým zadočkom, rudimentálnymi zásobníkmi peľu a väčšou telesnou hmotnosťou — pohybuje sa v rozmedzí 180–300 mg.\n\nPo oplodňovacom prelete, pri ktorom sa pári spravidla s 10–20 trúdmi na zhromaždisku trúdov, ukladá semeno do semenného vačku (spermatheca). Táto semenná zásoba jej vystačí na 3–5 rokov intenzívneho kladenia. Plodná matka kladie v sezóne 1 500–2 500 vajíčok denne, výnimočne až 3 000.\n\nV zdravom včelstve je vždy len jedna matka. Feromónový komplex produkovaný matkou (tzv. materská látka, kyselina 9-oxo-decenová) potláča u robotníc vývoj vaječníkov a inhibuje stavbu matečníkov. Oslabenie tohto signálu vedie k stavu tichej výmeny alebo rojeniu.\n\nVčelár sleduje vek a znáškovú zdatnosť matky. Staré alebo vadné matky spôsobujú chradnutie včelstva a sú spravidla vymieňané každé 2–3 roky. Matku možno zakúpiť od šľachtiteľov v tzv. zásielkovej klietke.",
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
    "term": "Pracovná včela",
    "alias": [
      "včela pracovníčka",
      "robotnica"
    ],
    "kategorie": "vcelarstvi",
    "shortDef": "Pracovné včely sú pohlavne nevyvinuté samice, ktoré tvoria drvivú väčšinu včelstva a zabezpečujú všetku prácu v úli aj na pastve.",
    "longDef": "Pracovné včely sa vyvíjajú z oplodneného vajíčka za približne 21 dní (vajíčko 3 dni, larva 6 dní, kukla 12 dní). Hmotnosť dospelej pracovnej včely sa pohybuje okolo 90–120 mg. V sezóne tvoria včelstvo 40 000–80 000 pracovných včiel, v zime ich počet klesá na 10 000–20 000.\n\nŽivotná dĺžka letnej pracovnej včely je 4–6 týždňov, zimná pracovná včela žije 4–6 mesiacov. Práca sa mení s vekom — mladé pracovné včely (1–10 dní) ošetrujú plod a kŕmia matku, v strednom veku (10–20 dní) sa venujú prijímaniu nektáru, stavbe plástu, strážnej službe, staršie pracovné včely (od 21 dní) lietajú a zbierajú nektár, peľ, živicu a vodu.\n\nPracovné včely majú špecializované orgány: košíčky na zadných nohách na transport peľu, voskové žliazky na zadočku na produkciu vosku a jedový mechúr s bodcom (zubatý bodec, ktorý po vpichnutí zostáva v koži cicavca). Na rozdiel od matky majú plne vyvinutý cueillopharyngeálny žľazový systém na tvorbu materskej kašičky.\n\nPracovné včely bez matky môžu po 3–4 týždňoch začať klásť neoplodnené vajíčka — vznikajú tzv. trúdokladné robotnice alebo včelstvo s policajnou šľachtou (stratené včelstvo).",
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
    "term": "Trúd",
    "alias": [
      "trúdy"
    ],
    "kategorie": "vcelarstvi",
    "shortDef": "Trúd je samec včely medonosnej, ktorého jedinou biologickou funkciou je oplodnenie matky pri oplodňovacom prelete.",
    "longDef": "Trúd sa vyvíja z neoplodneného vajíčka partenogenézou za približne 24 dní. Hmotnosť dospelého trúda dosahuje 200–250 mg. Trúdy nemajú bodec ani košíčky na peľ — nemôžu sa živiť sami a sú úplne závislé od zásob včelstva.\n\nV sezóne (apríl–august) tvoria trúdy 200–1 500 kusov v jednom včelstve. Opúšťajú úľ v teplých slnečných dňoch a lietajú na zhromaždiská trúdov (tzv. trúdoviská), kde čakajú na matku. Trúd, ktorý sa spári s matkou, bezprostredne po kopulácii uhynie.\n\nNa konci sezóny, zvyčajne v auguste a septembri, robotnice trúdy vyháňajú z úľa (tzv. vyháňanie trúdov) — tým znižujú spotrebu zásob na zimu. Výskyt trúdov mimo normálnu dobu (mimo sezóny alebo v nadmernom počte) môže signalizovať stratu matky alebo prítomnosť bezmatkového stavu.\n\nVo šľachtiteľskej praxi sa sledujú kvality trúdov z výberových línií — trúdy prenášajú genetický materiál, a to na zhromaždisku trúdov úplne nekontrolovane (otvorená párovacia lokalita). Kontrolované oplodnenie na izolovanom stanovišti (oplodniačik) je preto kľúčovým nástrojom selekcie.",
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
    "shortDef": "Včelstvo je biologická jednotka tvorená matkou, pracovnými včelami a trúdmi, ktorá funguje ako superorganizmus so spoločným dýchaním, termoreguláciou a kolektívnou obranou.",
    "longDef": "Včelstvo sa skladá z jedinej matky, sezónne 40 000–80 000 pracovných včiel a niekoľkých stoviek až tisícov trúdov. Ako celok udržuje vnútornú teplotu plodového hniezda na 34–35 °C bez ohľadu na vonkajšie podmienky — pracovné včely generujú teplo svalovou kontrakciou, v lete naopak chladia odparovaním vody. Táto termoregulácia je zásadná pre správny vývoj plodu.\n\nKomunikácia vo včelstve prebieha feromónovými (chemickými) signálmi (materská látka, nožný feromón, výstražný feromón kyselina isopentylacetátová pri obrane) aj pohybovými signálmi — tancami. Strata matky vedie k feromónovému deficitu, ktorý pracovné včely detekujú počas hodín a začínajú stavať záchranné matečníky.\n\nZdravotný stav včelstva je základným ukazovateľom pre včelára. Sleduje sa množstvo a charakter plodu (zaviečkovaný vs. otvorený, rozmiestnenie), správanie na letáči, množstvo zimných zásob a prítomnosť parazitov (najmä roztoč Varroa destructor). Prehliadka úľa sa vykonáva zvyčajne raz za 7–10 dní v sezóne.\n\nSilné včelstvo so 60 000–80 000 pracovnými včelami je predpokladom ekonomicky zaujímavého medného výnosu.",
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
      "plástik",
      "včelí plást"
    ],
    "kategorie": "vcelarstvi",
    "shortDef": "Plást je sústava šesťbokých voskových buniek, ktoré včely stavajú ako zásobník pre med a peľ aj ako liaheň pre plod.",
    "longDef": "Plást tvoria robotnice vylučovaním voskových šupiniek zo štyroch párov voskových žliaz na zadočku. Jedna robotnica vyprodukuje za svoj život 1–2 g vosku; stavba 1 kg plástu vyžaduje spotrebu asi 6–8 kg medu. Stavba plástu prebieha intenzívne pri dostatku nektáru a teplom počasí.\n\nŠesťhranné bunky majú geometricky optimálny tvar — maximalizujú objem pri minimálnej spotrebe materiálu. Priemer buniek pre robotnícky plod je približne 5,2–5,4 mm, pre trúdí plod 6,2–6,9 mm. Orientácia plástov v modernom rámikovom úli je na kolmé rámiky (Langstrothova orientácia) alebo vodorovné pásmo (Dadant).\n\nV plodisku sú bunky využívané pre kladenie vajíčok a výchovu lariev. V medníku sú bunky naplnené zrelým medom a zapečatené voskovým viečkom. Peľ (tzv. včelí chlieb) sa ukladá do buniek priliehajúcich k plodisku a lisuje sa vrstvami rôznofarebného peľu.\n\nStarý plást (tmavý, zanesený zvyškami košieľok lariev) zhoršuje zdravotné podmienky a zvyšuje riziko ochorení. Včelári preto vykonávajú každoročnú alebo dvojročnú obmenu časti plástov, najmä v plodisku. Vyradené plásty sa tavia a vosk sa predáva alebo vracia k výrobe medzistien.",
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
    "longDef": "Pojmom včelí dielo sa rozumie úhrn všetkých plástov (tak plodových, ako aj medných) umiestnených na rámikoch v nadstavkovom alebo plodiskovom priestore úľa. Kvalita diela je jedným z hlavných ukazovateľov stavu včelstva pri jarnej prehliadke.\n\nZdravé dielo je kompaktné, plodové pásmo je sústredené (tzv. uzavreté plodové hniezdo), med a peľ sú rovnomerne rozložené po okraji a v hornej časti plástu. Prerušovaný alebo rozptýlený plod signalizuje chorobu (mor plodu, hniloba), problémy s matkou alebo nepriaznivé vonkajšie podmienky.\n\nStaré čierne plásty sa v plodisku nahrádzajú každé 1–2 roky; v medníku sa plásty udržiavajú dlhšie, pretože neobsahujú košieľky lariev. Pravidelná obnova diela znižuje chemickú záťaž (reziduá akaricídov sa akumulujú vo vosku) a zlepšuje hygienu hniezda.\n\nVčelár eviduje počet obsadených plástov ako ukazovateľ sily včelstva — silné zimujúce včelstvo obsadí 8–10 rámikov v Langstrothovom úli. Pojem \"chlebový plást\" označuje plást plný peľu (zásoby bielkovín pre jarný rozvoj).",
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
    "term": "Včelársky rámik",
    "alias": [
      "rámik",
      "rámik úľový"
    ],
    "kategorie": "vcelarstvi",
    "shortDef": "Včelársky rámik je drevený alebo plastový nosný prvok, na ktorom včely stavajú plást — jeho rozmery určujú typ úľa a umožňujú výmenu plástov bez poškodenia diela.",
    "longDef": "Rámik sa skladá z hornej a dolnej lišty a dvoch bočných líšt. Štandardizované rozmery zabezpečujú vzájomnú zameniteľnosť medzi úľmi rovnakého systému. Najrozšírenejšie rozmery v Česku a na Slovensku sú rámik Langstroth (448 × 232 mm) a rámik Česko-Slovenský (39 × 24 cm), ďalej Dadant, Zander alebo rámiky pre medníkové nadstavky (medníkový rámik má približne polovičnú výšku plodiskového).\n\nNový rámik je opatrený drôtom (3–4 rady oceľového alebo nerezového drôtu), na ktorý sa upevňuje medzistena — voskový základ pre výstavbu plástu. Alternatívne sa používajú rámiky s plastovou základňou.\n\nMedzi susednými rámikmi je zachovávaný tzv. včelí priestor (bee space) 6–9 mm — tento rozmer opísal ako kľúčový americký včelár Lorenzo Langstroth v roku 1851. Menšia medzera by sa zaplnila propolisom, väčšia stavbou divokých plástov.\n\nSprávna manipulácia s rámikmi (zdvíhanie za bočnice, nie za hornú lištu samotnú) zabraňuje pretrhnutiu plástov. Na predajný trh sú dodávané rámiky hotové alebo v sadách na zostavenie.",
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
    "term": "Nadstavok",
    "alias": [
      "nadstavkový úľ",
      "medníkový nadstavok"
    ],
    "kategorie": "vcelarstvi",
    "shortDef": "Nadstavok je samostatná časť nadstavkového úľa (zvyčajne medník), ktorá sa pridáva na plodiskový nadstavok, aby včelám poskytla priestor na ukladanie medu.",
    "longDef": "Nadstavkový systém (najčastejšie Langstroth, Dadant alebo Zander) umožňuje ľahko rozširovať objem úľa pridávaním normalizovaných boxov — nadstavkov. Plodisko (najspodnejší nadstavok) slúži na výchovu plodu a zimovanie, medník (horný nadstavok) je určený na ukladanie mednej zásoby. Obe časti sú oddelené materskou mriežkou, ktorá zabráni matke klásť do medníka.\n\nKaždý nadstavok pojme 8 alebo 10 štandardných rámikov. V sezóne s dobrou znáškou je možné včelstvo rozširovať pridávaním ďalšieho medníkového nadstavku — tzv. šuplíkový systém. Príliš skoré pridanie medníka spomalí rozvoj plodu; príliš neskoré spôsobí prekotné rojenie kvôli nedostatku priestoru.\n\nNa zimovanie sa medníky odoberajú; zimujúce včelstvo sa sústreďuje na 1–2 plodiskových nadstavkoch s dostatkom zimných zásob (12–15 kg cukrového roztoku alebo medu).\n\nNadstavky sa vyrábajú z dreva (smrek, topoľ) alebo z polystyrénu. Polystyrénové úle majú lepšiu tepelnú izoláciu, sú ľahšie, ale mechanicky menej odolné.",
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
    "longDef": "Plodisko tvorí jadro biologického života včelstva. Matka tu kladie vajíčka do voskových buniek, robotnice ošetrujú larvy a kukly a udržiavajú teplotu plodového hniezda na 34–35 °C. Správny tvar plodového hniezda je guľovitý alebo elipsoidný — plod je sústredený v strede, zásoby medu a peľu obklopujú hniezdo zo strán a zhora.\n\nV moderných nadstavkových úľoch tvorí plodisko spravidla jeden alebo dva nadstavkové boxy. V tradičnom jednodielnom úli (Česko-Slovenský, Simplex) sú plodisko a medník v jednom priestore, oddelenie sa vykonáva len materskou mriežkou.\n\nVeľkosť plodiska ovplyvňuje silu včelstva a prezimovanie. Príliš veľké plodisko vedie k plytvaniu energiou na vyhrievanie; príliš malé obmedzuje rozvoj a môže vyvolať rojenie. Pre silné včelstvo sa odporúča plodisko s kapacitou 10 plodiskových rámikov Langstroth.\n\nNa jar sa plodisko kontroluje ako prvé — po zime by malo byť osadené 5–7 plástmi s živým plodom a dostatkom peľu. Plodisko bez plodu (mimo zimný alebo rojový stav) signalizuje bezmatkovosť.",
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
      "medníkový nadstavok"
    ],
    "kategorie": "vcelarstvi",
    "shortDef": "Medník je horná časť úľa oddelená materskou mriežkou, kam robotnice ukladajú prebytočný med určený na zber.",
    "longDef": "Medník sa umiestňuje nad plodiskový nadstavok a od plodiska ho oddeľuje materská mriežka. Robotnice ním prechádzajú voľne, matka (kvôli väčšej šírke zadočka) nie — tým je zaručené, že medník obsahuje čistý med bez plodu.\n\nV priebehu hlavnej znášky (najmä lipová a repková) sa medník plní rýchlo — silné včelstvo môže zaplniť medníkový nadstavok s 10 rámikmi za menej než 2 týždne. Pri veľmi silnej znáške sa pridáva druhý alebo tretí medník (tzv. zaplnenie medníkov).\n\nVytáčanie medu z medníka sa vykonáva najčastejšie dvakrát v sezóne — po repkovej (jún) a po lipovo-letnej znáške (august). Pred vytáčaním sa plásty zbavujú viečok pomocou odkrývacích nástrojov (odkrývacia vidlička, nôž alebo para).\n\nMedník sa na zimu odoberá a skladuje na suchom mieste — vlhkosť by spôsobila plesne a znehodnotenie zvyškov medu. Na jeseň sa medníkové plásty môžu dočasne vrátiť k dočisťovaniu zvyškov medu.",
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
    "longDef": "Propolis (z gréc. pro-polis, „pred mestom\") zbierajú robotnice najmä z živicových púčikov topoľov, briez, gaštanov a ihličnanov. Zberný košíček na zadnej nohe ho dopraví do úľa, kde ho preberajú staviteľky a spracovávajú pridávaním slín a enzýmov.\n\nZloženie propolisu závisí od botanického okolia stanovišťa — typicky obsahuje 50–55 % živíc a balzamov, 25–35 % voskov, 10 % silíc, 5 % peľu a rôzne fenolické a flavonoidné zlúčeniny. Chemická variabilita je preto značná.\n\nVčely propolisom zalepujú škáry v úli, zmenšujú letáč v zime, mumifikujú mŕtve larvy alebo vniknutých votrelcov (myš), ktoré nemôžu vyniesť. Propolis tak funguje ako prirodzená dezinfekcia — má preukázané antibakteriálne, antifungálne a antivírusové účinky.\n\nVo včelárstve sa propolis zbiera špeciálnymi mriežkami umiestnenými pod vekom úľa. Ročný výnos z jedného úľa je 50–150 g. Na trhu nachádza uplatnenie v potravinových doplnkoch, tinktúrach a kozmetike; cena surového propolisu sa pohybuje okolo 300–600 Kč za 100 g.",
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
    "longDef": "Včelí vosk vylučujú robotnice vo veku 12–18 dní zo štyroch párov voskových žliaz na ventrálnom povrchu zadočka. Šupinky vosku (0,8 mg každá) spracovávajú robotnice čeľusťami a formujú do základného stavebného materiálu plástu.\n\nChemicky ide o komplexnú zmes esterov mastných kyselín a alkoholov s dlhými reťazcami, uhľovodíkov, kyselín a alkoholov. Teplota tavenia kolíše medzi 62–65 °C, bod tuhnutia je o 1–2 °C nižší. Vosk je nerozpustný vo vode, rozpustný v organických rozpúšťadlách (toluén, benzín).\n\nVýťažnosť vosku zo starých plástov pri pretavovaní v solárnom alebo parnom taviči dosahuje 60–80 % pôvodnej hmoty plástu. Z jedného úľa možno ročne získať 0,2–1 kg vosku (závisí od obmeny plástov). Vosk sa predáva na spracovanie na medzistieny, sviečky, kozmetiku a farmaceutické prípravky.\n\nRezíduá pesticídov a akaricídov (najmä fluvalinát, kumafos) sa vo vosku akumulujú — to je jeden z hlavných argumentov pre pravidelnú obmenu plástov. Nová medzistena zo starej praxe môže obsahovať znečistený vosk a byť vstupným zdrojom chemickej záťaže.",
    "related": [
      "plast",
      "mezistena-pojem",
      "delnice",
      "vceli-dilo"
    ]
  },
  {
    "slug": "pyl-rousky",
    "term": "Peľ (obnôžka)",
    "alias": [
      "peľ",
      "peľový chlieb",
      "včelí chlieb"
    ],
    "kategorie": "vcelarstvi",
    "shortDef": "Peľ zbierajú robotnice na okvetných prašníkoch, zmiešavajú ho so slinami a nektárom, formujú do obnôžok a transportujú v peľovom košíčku ako hlavný bielkovinový zdroj včelstva.",
    "longDef": "Zber peľu prebieha pri lete na kvitnúce rastliny — robotnice ho aktívne zbierajú kartáčikmi na nohách, zvlhčujú nektárom alebo medom a formujú kompaktné obnôžky v košíčkoch (corbicula) na zadných nohách. Farba obnôžok závisí od botanického pôvodu — žltá (repka), oranžová (mak, lipa), cihlová (gaštany), biela (akát).\n\nDenný príjem peľu do silného včelstva dosahuje 20–50 g; celoročná potreba jedného včelstva je odhadovaná na 15–20 kg. Peľ je nenahraditeľný bielkovinový zdroj pre výchovu plodu a produkciu materskej kašičky — nedostatok peľu na jar alebo na jeseň oslabuje vývoj zimnej generácie robotníc.\n\nVčelár môže peľ odoberať peľovými lapačmi (peľochytmi) umiestnenými na letáči. Obnôžky prejdú mriežkou, ktorá ich oddelí od trupu včely. Peľ sa ihneď suší pri teplote do 40 °C a skladuje v uzavretých nádobách alebo mrazí. Predáva sa ako potravinový doplnok (cena 200–600 Kč/100 g).\n\nPeľová analýza (melisopalinológia) umožňuje určiť geografický pôvod a botanické zloženie medu i propolisu.",
    "related": [
      "snuska",
      "delnice",
      "plast",
      "vceli-plod"
    ]
  },
  {
    "slug": "snuska",
    "term": "Znáška",
    "alias": [
      "medná znáška",
      "hlavná znáška",
      "vedľajšia znáška"
    ],
    "kategorie": "vcelarstvi",
    "shortDef": "Znáška je obdobie, kedy je v prírode dostatok nektáru alebo medovice a včely ho aktívne zbierajú a spracovávajú na med.",
    "longDef": "Termín znáška označuje ako samotný zdroj (kvitnúcu rastlinu alebo výlučky vošiek), tak obdobie intenzívneho zberu. V podmienkach strednej Európy sa rozlišuje znáška jarná (slivoň, jabloň, repka — apríl–jún), letná (lipa, ďatelina, malina — jún–júl) a jesenná doplnková (pohánka, slnečnica, vres — august–september).\n\nIntenzitu znášky meria kontrolný úľ na váhe — priemyselná presnosť váh (100 g alebo menej) umožňuje zaznamenávať denný prírastok hmotnosti. Hodnoty nad 2 kg/deň signalizujú silnú znášku, nad 5 kg/deň výnimočnú. Repková znáška môže v optimálnych podmienkach (veľký repkový lán, teplé slnečné dni) priniesť 30–60 kg medu na jedno silné včelstvo.\n\nMedovicová znáška (z výlučkov vošiek alebo červcov na listnatých alebo ihličnatých stromoch) je charakteristická pre horské oblasti, Šumavu, Jeseníky a podhorskú časť Moravy. Medovicový med má tmavšiu farbu, silnejšiu chuť a nižší obsah sacharózy než kvetový med.\n\nSprávne načasovanie kočovania k zdrojom znášky je základom rentabilného včelárstva. Pri znáške repky je potrebné priblížiť úle 2–3 dni pred plným rozkvetom.",
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
    "term": "Medovica",
    "alias": [
      "lesný med",
      "medovicová znáška"
    ],
    "kategorie": "vcelarstvi",
    "shortDef": "Medovica je sladký výlučok vošiek, červcov alebo iného fytofágneho hmyzu sajúceho z floému stromov, ktorý robotnice zbierajú ako alternatívny zdroj cukrov k nektáru.",
    "longDef": "Medovica vzniká tak, že sajúci hmyz (vošky, červce, mery, háďatko) spracúva floémovú miazgu bohatú na sacharózy — prebytok cukrov vylučuje v podobe kvapôčky výlučku. Robotnice ho zbierajú z povrchu listov alebo priamo z hmyzu, transportujú do úľa a spracovávajú podobne ako nektár.\n\nBotanické zdroje medovice v Česku tvoria predovšetkým jedľová medovica (Abies alba, Picea abies — produkujú ju mery Cinara a Sacchiphantes), dubová medovica a lipová medovica. Medovicový med je tmavý (farba od hnedožltej po takmer čiernu), s charakteristicky živicovou alebo karamelovou chuťou, s nižším obsahom sacharózy a vyšším obsahom oligosacharidov a minerálnych látok.\n\nRiziko pre zimovanie: medovicový med má vyšší obsah dextrínov (nestráviteľných polysacharidov), ktoré spôsobujú hnačku u včiel (tzv. nosematóza sprevádzaná hnačkou) pri konzumácii v zime. Včelári preto odporúčajú odoberať medovicový med z medníkov v auguste a nahradiť zásoby cukrovým sirupom.\n\nMedovicový med sa predáva draho — na českom trhu 200–500 Kč/kg — a je považovaný za gastronomicky hodnotnejší produkt pre špecifickú chuť.",
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
      "nektárová znáška"
    ],
    "kategorie": "vcelarstvi",
    "shortDef": "Nektár je cukrový roztok vylučovaný nektárnikmi kvitnúcich rastlín, ktorý je primárnym surovým materiálom pre výrobu kvetového medu.",
    "longDef": "Nektár produkujú nektáriá — špecializované pletivá (žliazky) umiestnené pri základni okvetných plátkov alebo na extraflórnych miestach (listové stopky, palisty). Jeho zloženie je premenlivé: 5–80 % cukrov (sacharóza, fruktóza, glukóza), voda, aminokyseliny, enzýmy a aromatické látky.\n\nVčely zbierajú nektár do medového vačku (volata mel) — po návrate do úľa ho odovzdávajú prijímacím včelám, ktoré ho opakovane prelievajú a pridávajú enzýmy (invertáza, glukóza oxidáza). Voda sa odparuje pri ventilácii — z čerstvého nektáru (obsahuje 20–80 % vody) vzniká zrelý med (do 17–18 % vody), až potom včely bunky zaviečkujú.\n\nVydatnosť nektárovej produkcie závisí od druhu rastliny, počasia a pôdnej vlhkosti. Repka olejná je jednou z najdôležitejších nektárových plodín na Slovensku — pri priaznivých podmienkach produkuje až 100–150 kg nektáru na hektár. Významné nektárové plodiny sú ďalej lipa (Tilia sp.), akát (Robinia pseudoacacia), ďatelina (Trifolium sp.) a facélia (Phacelia tanacetifolia).\n\nNektárová znáška sa od medovicovej líši tým, že nektár pochádza priamo z rastlín, nie z hmyzích výlučkov — výsledný med má odlišné fyzikálne i senzorické vlastnosti.",
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
    "longDef": "Rojenie je evolučne zakódovaná stratégia šírenia včelstva. Spúšťacím mechanizmom je kombinácia preplneného úľa, slabšej materskej látky (klesajúca produkcia starej matky), hromadenie trúdov a vhodné počasie (koniec mája – jún). Včely začínajú stavať matečníky — prvý signál pre včelára.\n\nPrimárny roj (príroj) opúšťa úľ v poobedňajších hodinách za teplého a slnečného dňa, zvyčajne v deň, keď sa prvý matečník blíži k zaviečkovaniu. So starou matkou odletí 30–50 % včiel. Roj sa zhromažďuje na vetve alebo inej podpore v okruhu do 300 m od pôvodného úľa, kde čaká 1–3 dni, kým prieskumné včely nájdu nové hniezdište.\n\nVčelár môže roj chytiť (zmestí sa do prázdneho úľa alebo rohovej schránky) a takto získať nové včelstvo. Ak roj odletí, pôvodný úľ pokračuje so zásobou matečníkov — prvá nakladená matka likviduje ostatné matečníky (súboj o trón). Po oplodňovacom prelete a oplodnení obnoví kladenie.\n\nKontrola rojenia je jednou z hlavných pracovných úloh v sezóne. Profilaktické opatrenia zahŕňajú výmenu matiek, pridávanie medníkov, urezanie matečníkov alebo umelé rojenie (oddelenie).",
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
      "prirodzený roj",
      "príroj"
    ],
    "kategorie": "vcelarstvi",
    "shortDef": "Roj je skupina včiel (matka + robotnice) oddelená od materského včelstva pri prirodzenom rojení, ktorá hľadá nové hniezdište.",
    "longDef": "Roj opúšťajúci úľ tvorí matka a približne 30–50 % robotníc materského včelstva — v počte 10 000–30 000 kusov. Pred odletom robotnice prijímajú med do medového vačku na zásoby. Roj obvykle dočasne zotrvá (tzv. rojové zhromaždisko) na blízkom mieste 30 minút až niekoľko hodín, potom odletí za novým hniezdišťom nájdeným prieskumnicami.\n\nChytanie roja vykonáva včelár striasaním (zmetením) do prázdneho úľa alebo do špeciálneho rojového koša. Je nutné zachytiť matku — bez nej roj opustí nové umiestnenie. Pre chytanie rojov vo výške alebo na stromoch sa používajú špeciálne záchytné klapky alebo rohové schránky.\n\nPríroj má výhodu — mladý roj je obvykle zdravý a plný energie (robotnice vo veku intenzívnej produkcie vosku a stavby plástu), rýchlo buduje nové dielo. Nevýhodou je nižší výnos v prvom roku a nutnosť prikrmovania.\n\nV prírode (dutý strom, strešná medzera) zakladajú roje voľné hniezda — tzv. divoké nálezy sú na Slovensku súčasťou ochrany biodiverzity, ale prakticky je hospodárenie s nimi problematické.",
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
    "shortDef": "Oddelok je malé umelé včelstvo vytvorené včelárom z časti včiel, plástov a mladej alebo zaviečkovanej matky, slúžiace na reprodukciu alebo na množenie bez prirodzeného rojenia.",
    "longDef": "Oddelok (nucleus) je jednou z metód kontrolovaného množenia včelstiev bez prirodzeného rojenia. Tvorí ho zvyčajne 3–6 rámikov (plod, zásoby, včely) odobratých z jedného alebo viacerých silných včelstiev, ku ktorým sa pridá buď zaviečkovaný matečník (zo zámerného chovu alebo záchranný), kupovaná matka alebo voľná neoplodnená matka.\n\nOddelok sa umiestni na nové stanovište alebo na vzdialené miesto, aby sa lietavky nemohli vrátiť späť. Oddelok bez matky (tzv. osirelý) prijme pridanú matku alebo si vystaví záchranné matečníky zo zálohy plodu.\n\nOddelky sú základom modernej selekcie matiek — chovatelia matiek štandardne pracujú s tzv. nukleárnymi (nucleus) úľmi, do ktorých sa sádzajú oplodnené matky z výberového chovu. Na Slovensku prebieha hodnotenie matiek v rámci šľachtiteľského programu Slovenského zväzu chovateľov včely medonosnej (SZCHM).\n\nOddelok zvyčajne v prvom roku neprináša ekonomický výnos — slúži ako nová zásoba pre budúcu sezónu. V prípade straty silného včelstva môže oddelok slúžiť na urgentné posilnenie alebo spojenie.",
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
    "longDef": "Matečník má žalúdkovitý tvar a zvislú orientáciu, na rozdiel od vodorovne orientovaných buniek robotníc a trúdov. Dĺžka matečníka dosahuje 20–25 mm. Stavia sa z vosku, pričom dno je tvarované do misky ešte pred zasadením vajíčka.\n\nRozlišujú sa tri typy: rojové matečníky (na okrajoch plástov, signalizujú prípravy na rojenie), záchranné matečníky (budované núdzovo z robotníckych lariev mladých do 3 dní po strate matky) a tiché výmenné matečníky (stavané diskrétne vedľa materského hniezda pri postupnej výmene starnúcej matky).\n\nZáchranné matečníky sú menej spoľahlivé než plánované rojové alebo chovateľsky pripravené — larva prechádza na výhradné kŕmenie materskou kašičkou oneskorene (cez 24 h), výsledná matka býva menej kvalitná. Preto skúsený chovateľ matiek používa špeciálne chovateľské misky alebo larvovníky.\n\nZ matečníka vychádza matka približne 16. deň od nakladenia vajíčka. Prvé dni po vyliahnutí zostáva v úli a dozrieva. Oplodňovací prelet podnikne za 7–10 dní za priaznivých podmienok.",
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
    "term": "Zaviečkovanie",
    "alias": [
      "zapečatenie",
      "viečkovanie"
    ],
    "kategorie": "vcelarstvi",
    "shortDef": "Zaviečkovanie je pokrytie obsahu buniek voskovým viečkom — u plodu uzatvára kuklu, u medu signalizuje jeho zrelosť (obsah vody pod 18 %).",
    "longDef": "Zaviečkovanie plodu nastane približne 6. deň po nakladení vajíčka (po 3 dňoch vo vajíčku a 3 dňoch larvy). Robotnice uzavrú bunku plochým alebo mierne vyvýšeným voskovým viečkom; pod ním larva spradie zámotok a premení sa na kuklu. Farba zaviečkovaného plodu je svetlohnedá (zdravá) alebo tmavohnedá (poklesnutá — možný príznak choroby).\n\nZaviečkovanie medu je pre včelára signálom zrelosti — včely zaviečkujú bunku až vtedy, keď sa obsah vody zníži pod 17–18 %. Med s vyšším obsahom vody (z nezaviečkovaných buniek alebo nevyzretý) kvasí. Preto platí pravidlo: vytáčať len med z rámikov zaviečkovaných aspoň z dvoch tretín plochy.\n\nViečka medu môžu byť ploché (suché viečka) alebo konvexné (mokré viečka). Suché viečka sú obľúbené pre predaj medových plástov ako delikatesy. Odkryvanie (deoperkulácia) sa vykonáva odkryvacou vidličkou, nožom alebo parným odkryvačom.\n\nBledý alebo šedý zákal zaviečkovaného plodového diela môže indikovať mrazový plod (Melissococcus plutonius) alebo vápenatý plod (Ascosphaera apis) — hygienická kontrola je tu kľúčová.",
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
    "longDef": "Vývoj včelieho plodu začína nakladením vajíčka matkou na dno bunky. Vajíčko je valcovité (1,5 mm), bielej farby, vo zvislej polohe. Po 3 dňoch sa z vajíčka vyliahne larva — malý, zakrivený, beznohý červ. Robotnice ju kŕmia materskou kašičkou (prvých 2–3 dni pre robotnicu), potom zmesou peľu a medu.\n\nV zdravom plodisku je plod kompaktný — bunky sú obsadené pravidelne, vajíčka stoja zvisle v strede bunky, larvy sú perleťovo biele a lesklé. Tzv. „korenený\" plod (bunky s plodom a prázdne bunky striedavo) je príznakom vírusu deformovaných krídel, vápenatého alebo mrazového plodu, alebo problémov s matkou.\n\nLarválny vývoj prebieha 6 dní (robotnice), potom robotnice bunku zaviečkujú. Kuklenie a metamorfóza trvá 12 dní. Celkovo 21 dní od vajíčka k dospelej robotnici. Trúd sa vyvíja 24 dní, matka 16 dní.\n\nPlodový plást je tepelnou konštantnou zónou — teplota 34–35 °C sa udržiava termoreguláciou robotníc. Odchýlky spôsobujú vývojové defekty (krivé alebo chýbajúce časti tela).",
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
      "znáška vajec",
      "oviposícia"
    ],
    "kategorie": "vcelarstvi",
    "shortDef": "Kladenie matky (oviposícia) je proces, pri ktorom matka vkladá oplodnené alebo neoplodnené vajíčka do buniek plástu — kľúčový ukazovateľ zdravého stavu včelstva.",
    "longDef": "Plodná oplodnená matka kladie v plnej sezóne (apríl–august) 1 500–2 500 vajíčok denne. Oplodnené vajíčka smerujú do buniek pracovného rozmeru (5,2–5,4 mm) a dávajú vznik robotniciam; do buniek trúdieho rozmeru (6,2–6,9 mm) kladie matka zámerne neoplodnené vajíčka, z ktorých sa vyvíjajú trúdy.\n\nVzor kladenia sleduje včelár pri prehliadke: zdravá matka kladie kompaktný terč plodu bez medzier. Prerušený plod (chýbajúce vajíčka v bunkách, „hnáto sito\") signalizuje ochorenie alebo matku s vadným semenom. Matka s nízkym príjmom peľu alebo staršia matka prechádza na nepravidelné kladenie skôr.\n\nRobotnice prijímajú vajíčko krátkou inšpekciou bunky — vaječné bunky robotníc obsahujú nulový peľ alebo materskú kašičku pripravenú pre larvu. Matka vajíčko pripevní k dnu bunky vylučovaným lepkavým sekretom.\n\nKontrola kladenia je základnou metódou diagnostiky bezmatkovosti — samotný pohľad na plást (prítomnosť vajíčok viditeľných lupou alebo na slnku) potvrdí prítomnosť aktívnej matky. Vajce je čerstvé, staršie larvy a zaviečkovaný plod môžu pochádzať z predchádzajúcej matky.",
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
    "longDef": "Varroa destructor — druh oddelený od Varroa jacobsoni v roku 2000; V. jacobsoni napáda iba včelu východnú (Apis cerana) — je ektoparazitický roztoč pôvodom z Ázie, ktorý sa šíri celosvetovo a prakticky v každej populácii včely medonosnej v Európe. Samička (1,1 × 1,6 mm, červenohnedá, oválna) sa prichytáva na kuklu alebo dospelú včelu a saje hemolymfu.\n\nRozmnožovanie prebieha v zaviečkovanom plode — samička vstúpi do bunky pred zaviečkovaním, naklade 1 samca a 4–5 samíc; po dokončení vývoja dospelé roztoče opúšťajú bunku s novou generáciou včely. Trúdí plod je preferovaným hostiteľom (trúdy sa vyvíjajú dlhšie, takže samička stihne viac potomkov).\n\nNeliečená Varroa spôsobí zánik včelstva zvyčajne do 2–4 rokov. Okrem priameho sania oslabuje imunitu a je vektorom vírusov (najmä vírus deformovaných krídel — DWV). Liečba je v ČR povinná — prípustné látky sú kyselina šťavelová (Oxuvar, Api-Bioxal), amitraza (Apivar, Apitraz) a fluvalinát (Apistan); použitie sa riadi Metodickým pokynom SVS a zákonom o liekoch.\n\nMonitoring sa vykonáva prirodzeným spadom na podložke, zimnou prácou s 100 včelami alebo alkoholovým umývaním (wash). Prah liečenia je zvyčajne 3 % roztoča na robotniciach alebo 0,5 roztoča/100 robotníc (WHO odporúčanie).",
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
    "longDef": "Kleštík včelí je systematicky zaradený do radu Acarina (roztoče), čeľade Varroidae. Vedecký názov Varroa destructor bol ustanovený v roku 2000, keď bol druh oddelený od Varroa jacobsoni — ten napáda iba včelu východnú (Apis cerana) a na včele medonosnej sa nerozmnožuje. Samička je plochozelená, hnedočervená, približne 1,1 mm dlhá a 1,6 mm široká. Je viditeľná voľným okom na tele včely alebo v spade na úľovej podložke.\n\nŽivotný cyklus zahŕňa foretickú fázu (roztoče žijú na dospelých včelách) a reprodukčnú fázu (v zaviečkovanom plode). Samička vstupuje do bunky 24–48 hodín pred zaviečkovaním, naklade jedno neoplodnené vajíčko (samec) a 4–5 oplodnených (samice). Samec oplodní dcéry v bunke ešte pred vyliahnutím robotnice.\n\nVirulencia kleštíka je spôsobená kombináciou priameho poškodenia (sanie hemolymfy znižuje hmotnosť narodenej včely, poškodzuje tukové telo) a vektorového prenosu — kleštík je hlavným vektorom vírusu deformovaných krídel (DWV), akútneho paralytického vírusu (ABPV) a ďalších vírusov.\n\nChemická rezistencia Varroa destructor voči pyretroidom (fluvalinát, flumethrin) je opísaná v Európe od 90. rokov. Preto sa odporúča rotácia účinných látok a preferenčné využitie organických kyselín (kyselina šťavelová) ako prvá voľba najmä v bezplodnom období.",
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
    "shortDef": "Mor včelieho plodu je najnebezpečnejšie bakteriálne ochorenie včelieho plodu spôsobené sporulujúcou baktériou Paenibacillus larvae, ktoré je v ČR úradne sledovanou nákazou.",
    "longDef": "Mor včelieho plodu (anglicky American Foulbrood, AFB) spôsobuje baktéria Paenibacillus larvae. Spóry sú extrémne odolné — prežívajú v suchu desiatky rokov, v mede aj po varení. Prenos prebieha prostredníctvom kontaminovaných zásob, nástrojov, starých plástov alebo lúpežnými včelami.\n\nPríznaky: zaviečkovaný plod mení farbu zo svetlohnedej na tmavohnedú, viečka sú prepadnuté a perforované. Roztavená larva (tzv. „povrázok\" — sticky rope test) sa tiahne z bunky pri zápichu páratkom ako lepkavý povrázok — tento test je základnou diagnostickou metódou. Zápach je intenzívny, nasladlý až odporný.\n\nV ČR je mor včelieho plodu chorobou podliehajúcou povinnosti hlásenia. Pri potvrdení nákazy veterinárnym lekárom (laboratórny dôkaz z ÚSKVBL alebo SVS) sa celé včelstvo aj úľové vybavenie spáli, stanovište sa dezinfikuje. Neexistuje povolená liečba antibiotikami v ČR (na rozdiel od USA).\n\nPreventívne opatrenia: dezinfekcia nástrojov (lúhom sodným 4 %, plameňom), nákup zdravých matiek a rodinných oddelkov s veterinárnym osvedčením, vyhýbanie sa kŕmeniu cudzím medom.",
    "related": [
      "hniloba-plodu",
      "vceli-plod",
      "vcelstvo"
    ],
    "externalUrl": "https://svs.gov.cz/zdravi-zvirat/mor-vceliho-plodu/",
    "externalLabel": "SVS ČR: mor včelieho plodu"
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
    "longDef": "Hniloba plodu (European Foulbrood, EFB) spôsobuje Melissococcus plutonius. Baktéria sa šíri v tráviacom trakte larvy a konkuruje jej o živiny, larva hynie spravidla pred zaviečkovaním. Symptómy: larvy menia farbu z perleťovo bielej na žltú až hnedú, prijímajú neprirodzené polohy v bunke (skrútenie, prilnutie k stene bunky), zápach je menej intenzívny než u moru.\n\nEFB je na Slovensku tiež chorobou podliehajúcou hláseniu. Pri potvrdení nákazy ŠVPS sa rozhoduje o liečbe alebo likvidácii — závisí od intenzity nákazy a zdravotnej situácie. Na rozdiel od AFB existuje v niektorých krajinách EÚ povolená liečba oxytetracyklínom, na Slovensku je použitie antibiotík u včiel zakázané.\n\nPredisponujúce faktory pre prepuknutie EFB sú stres (slabá znáška, chlad), nedostatok peľu (slabá jarná znáška), oslabená imunita včelstva alebo prítomnosť Varroa. Včelstvo môže spontánne ozdravieť pri priaznivých podmienkach a silnej znáške (robotnice rýchlo odstránia chorý plod — hygiena).\n\nPreventívna hygiena: pravidelná obmena plástov, dezinfekcia nástrojov, vyhýbanie sa premiestňovaniu plástov medzi podozrivými včelstvami.",
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
    "longDef": "Nosema apis je pôvodná mikrospória čreva dospelej včely v Európe, Nosema ceranae je invazívny druh pôvodom z Ázie, ktorý v súčasnosti dominuje na Slovensku aj v EÚ. N. ceranae nevyvoláva typické hnačkové príznaky ako N. apis (viditeľné namnaženie výkalov na prístupe a letáči), ale spôsobuje chronické oslabenie a skrátenie života pracovných včiel.\n\nSpóry Nosemy sú prijímané perorálne (kontaminovanou potravou alebo vodou). V čreve klíčia a napadajú epitelové bunky, čím znižujú absorpciu živín. Nakažené robotnice sú menej schopné kŕmiť plod, slabšie, s kratšou životnosťou — záporná špirála oslabuje celé včelstvo.\n\nDiagnostika sa vykonáva mikroskopicky z homogenátu zadočkov 30–60 pracovných včiel (posúdenie počtu spór na včelu). Liečba fumagilínom (Fumidil B) je na Slovensku od roku 2014 prakticky nedostupná (zrušenie registrácie prípravku v EÚ). Iná liečba schválená nie je — prevencia sa zameriava na hygienu, obmenu plástov, silné zimovanie a prikrmovanie kyselinou fumarovou (obmedzene).\n\nMedovicový med ponechaný ako zimná zásoba zvyšuje riziko nosematózy v zime (nevstrebateľné dextríny spôsobujú hnačku), preto sa odporúča dopĺňanie cukrovým sirupom.",
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
    "shortDef": "Medomet je centrifugálne zariadenie, v ktorom sa odviečkované rámiky otáčajú a med je odstredivou silou vymršťovaný zo stien buniek.",
    "longDef": "Medomet funguje na princípe centrifugácie — rámiky sú umiestnené buď radiálne (čelné strany rámikov kolmo k osi rotácie) alebo tangenciálne (rámik rovnobežne s obvodom koša). Radiálne medomety (obvyklejšie pre väčšie chovy) vytáčajú obe strany plástu naraz; tangenciálny je potrebné preklopiť.\n\nKapacita medometu sa líši — ručný (2–6 rámikov), elektrický malý (6–12 rámikov), poloautomatický alebo priemyselný (24–48 rámikov). Pre profesionálne chovy nad 100 včelstiev sa používajú prietokové systémy s automatickým odkrytím, medomety s invertorom (nastaviteľné otáčky) a filtráciou medu pod odtokovým kohútikom.\n\nMed zachytený na stenách koša steká dole a odteká cez kohútik do sita a sedimentačnej nádoby. Filtrácia odstraňuje zvyšky vosku a mechanické nečistoty; sedimentácia (12–24 hodín) umožňuje vzduchovým bublinám vystúpiť na povrch.\n\nNerezový medomet spĺňajúci hygienické kritériá (EN 13440) je podmienkou pre certifikáciu medu v rámci systémov kvality (BIO, regionálne značky).",
    "related": [
      "vytaceni-medu",
      "zaviceny-med",
      "mednik",
      "pastovani-medu"
    ]
  },
  {
    "slug": "mezistena-pojem",
    "term": "Medzistena",
    "alias": [
      "voskový základ",
      "foundation"
    ],
    "kategorie": "vcelarstvi",
    "shortDef": "Medzistena je tenká vosková doska s reliéfom šesťbokých buniek, ktorá sa vkladá do rámika ako základ pre stavbu plástu a usmerňuje veľkosť buniek.",
    "longDef": "Medzistena sa vyrába strojovým lisovaním alebo valcovaním včelieho vosku do dosiek s hrúbkou 0,8–1,2 mm s reliéfom bunkových základov. Reliéf udáva priemer buniek — štandardná medzistena pre pracovný plod má hexagonálny vzor priemeru približne 5,2–5,4 mm.\n\nMedzistena sa vkladá do rámika s drôtom (3–4 vodorovné vodiče), ku ktorým sa pripevní zahriatím alebo horúcim elektrifikátorom (tzv. spájanie drôtu). Pripojenie musí byť pevné — padajúca alebo preložená medzistena v lete stráca tvar a spôsobuje divokosť diela.\n\nPoužívanie medzistien riadi stavbu plástu: robotnice nestavajú zbytočné trúdie bunky (kľúčové pre kontrolu Varroa), dielo je pravidelné a ľahšie sa s ním manipuluje pri vytáčaní. Medzisteny z certifikovaného vosku (bez reziduí pesticídov) sú hygienickým štandardom — kontaminovaná medzistena môže zaťažiť celé dielo.\n\nNa trhu sú aj plastové medzisteny s voskovou povrchovou vrstvou — sú trvanlivejšie, ale menej prirodzene prijímané robotnicami než čisto voskové.",
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
    "shortDef": "Dymák je nástroj na výrobu chladného hustého dymu, ktorý sa pri práci s včelstvom aplikuje do letáča a pod veko úľa, aby sa znížila agresivita včiel.",
    "longDef": "Dymák sa skladá z nádržky (nerezový alebo pozinkovaný kôš), mechúra (kožený alebo syntetický) a trysky. Tlením organického materiálu (papier, sisal, drevené triesky, seno, sušené huby) vzniká hustý chladný dym. Teplota dymu by nemala prekročiť 50–60 °C — príliš horúci dym robotnice popáli a spôsobí opak pokoja.\n\nFyziologický účinok dymu: robotnice detekujú dym ako signál požiaru a začínajú prijímať zásoby medu z plástov (inštinktívna príprava na opustenie hniezda). Včely s plným medovým vačkom bodajú menej ochotne, sú menej agresívne a menej reagujú na dráždivé podnety. Navyše dym maskuje výstražné feromóny (kyselina izoamylacetátová).\n\nTechnicky správna aplikácia: 2–3 obláčiky dymu do letáča pred otvorením úľa, potom mierne zadymenie pod veko. Prehnané zadymenie robotnice stresuje a môže poškodiť ich pachy (orientáciu). Studený hustý biely dym je ideálny, teplý tenký sivý je neúčinný.\n\nDymák sa čistí po každom použití — zvyšky dechtu upchávajú trysku. Po skončení práce sa uzavrie priškrtením trysky, aby tlenie samovoľne zhaslo.",
    "related": [
      "smetacek",
      "ul-pojem"
    ]
  },
  {
    "slug": "smetacek",
    "term": "Zmetáčik",
    "alias": [
      "včelársky zmetáčik",
      "perový zmetáčik"
    ],
    "kategorie": "vcelarstvi",
    "shortDef": "Zmetáčik je mäkký kartáčik alebo perový zväzok, ktorým včelár striasa a zhromažďuje robotnice z rámikov pri prehliadke alebo pred vytáčaním.",
    "longDef": "Zmetáčik (anglicky bee brush) je nepostrádateľnou súčasťou výstroja včelára. Tradične sa vyrábal z konských alebo husích pier, dnes prevažuje verzia s mäkkými syntetickými vláknami. Pri každom použití musí byť čistý — zvyšky medu alebo propolisu spôsobujú reakciu robotníc pri kontakte s cudzím zápachom.\n\nPoužíva sa na strhávanie robotníc z rámikov (pred kontrolou matky, pred vytáčaním medu, pri presune rámikov). Správna technika: krátke plynulé ťahy od stredu rámika smerom dole. Rýchle alebo trhavé pohyby robotnice vyplašia a zvýšia agresivitu.\n\nAlternatívou k zmetáčiku sú ofukovacie kliešte (mechanická) alebo vzduchový ofukovač (pre väčšiu prevádzku). Pri znáške prítomnosť cudzích vôní (parfém, alkohol, pot) na zmetáčiku dráždi včely.\n\nDezinfekcia zmetáčika medzi navštívenými včelstvami je preventívnym opatrením pri podozrení na mor plodu alebo inú infekciu — prenos cez kontaminovaný zmetáčik je možný.",
    "related": [
      "dymak",
      "ul-pojem"
    ]
  },
  {
    "slug": "ul-pojem",
    "term": "Úľ",
    "alias": [
      "kôš",
      "úľový box",
      "box"
    ],
    "kategorie": "vcelarstvi",
    "shortDef": "Úľ je umelo vyrobené obydlie pre včelstvo, v ktorom včely stavajú dielo, vychovávajú plod a ukladajú zásoby; moderné rámikové úle umožňujú jednoduchú prehliadku a zber medu.",
    "longDef": "Dejiny úľov siahajú tisíce rokov späť — prvé úle boli hlinené, korkové alebo košíkové. Moderný rámikový úľ vychádza z princípu bee space definovaného Lorenzom Langstrothom (USA, 1851): pohyblivé rámiky s medzirámikovou medzerou 6–9 mm umožňujú rámiky vyberať bez poškodenia diela.\n\nZákladné typy úľov na Slovensku a v Česku: Česko-Slovenský úľ (rozoberateľný, jednodielny, rámik 39 × 24 cm), Langstrothov úľ (nadstavkový, medzinárodne najrozšírenejší, rámik 448 × 232 mm), Dadantov úľ (veľké plodisko, obľúbený v južnej Európe), Zanderov úľ (kompromis rozmerov, obľúbený v strednej Európe).\n\nMateriály: smrekové drevo (tradícia, dobré tepelné vlastnosti, nutnosť náteru), topoľové drevo, polystyrén (tepelná izolácia, ľahkosť, horšia trvanlivosť), plast (moderná hygiena, ľahkosť). Polystyrénové úle sú na Slovensku stále obľúbenejšie pre kočovné včelárenie kvôli nižšej hmotnosti.\n\nSprávne umiestnený úľ stojí na podstavci vo výške 30–50 cm, letáčom na juh alebo juhovýchod, chránený pred priamym slnkom na poludnie (ľahký tieň), bez prekážok pred letáčom. Stanovište sa volí s ohľadom na dostupnosť vody a znáškový rádius (včely lietajú 3–5 km).",
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
    "longDef": "Zazimovanie zahŕňa niekoľko kľúčových krokov: vyhodnotenie sily včelstva (obsadenosť rámikov, stav matky), liečbu varroázy (kyselina šťavelová kvapkaním alebo sublimáciou pri bezplodnom stave v októbri–novembri), doplnenie zimných zásob (12–15 kg cukrového sirupu alebo medu), zúženie letáča, odstránenie medníkového nadstavku a kontrolu vetrania.\n\nCukrový sirup na zazimovanie: koncentrácia 2,5 : 1 (cukor : voda hmotnostne) alebo hustý sirup 2 : 1, podáva sa od polovice augusta do konca septembra, aby ho včely stihli spracovať. Príliš neskoré prikrmovanie spôsobí, že med z cukrového sirupu zostane nevyzretý.\n\nZimný chumáč (cluster) sa formuje v dolnej časti plodového hniezda, keď teplota klesne pod 14 °C. Robotnice generujú teplo svalovou kontrakciou, pohybujú sa od studenej periférie do stredu. Teplota stredu chumáča sa udržuje nad 20–25 °C.\n\nKľúčový ukazovateľ úspešného zazimovania: prítomnosť dostatku zimných robotníc (robotnice, ktoré nevychovávali plod, majú veľké tukové telo — prezimujú aj 6 mesiacov). Slabá alebo chorá zimná generácia vedie k záhube včelstva ešte pred jarným vývojom.",
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
    "term": "Vyzimovanie",
    "alias": [
      "jarná prehliadka",
      "jarná revízia"
    ],
    "kategorie": "vcelarstvi",
    "shortDef": "Vyzimovanie je prvá prehliadka včelstiev po zime (zvyčajne koniec marca – začiatok apríla), pri ktorej sa overí stav matky, zásoby, plod a vykoná sa jarná liečba varroázy.",
    "longDef": "Vyzimovanie sa vykonáva za teplého, bezvetrného dňa pri teplote nad 12–14 °C. Pri nižšej teplote sa plodové hniezdo otvorením prechladí a plod uhynie. Cieľ prehliadky: potvrdiť prítomnosť živej matky (vajíčka alebo mladý plod), odhadnúť silu a zásoby.\n\nPostup: zloží sa veko, odstránia sa záchranné kŕmidlá, prezrie sa vrchný rámik. Ak je plodové hniezdo vinuté a aktívne, prezrie sa centrálnym spôsobom. Hľadá sa prítomnosť vajíčok (priehľad na svetle), normálnosť plodového pásma, stav zásob peľu a medu.\n\nOdobraný jarný spad zo zimnej podložky dáva približnú informáciu o roztočoch — prirodzene uhynuté roztoče zo zimného chumáča sú indikátorom stavu infestácie. Pri počte nad 50 mŕtvych roztočov na podložke (za zimu) je začatie liečby v apríli odporúčané.\n\nPo vyzimovaní sa odstránia zimné upchávky letáča, vymení sa zimná podložka, vyčistí sa dno. Slabé alebo bezmatkové včelstvá sa spoja metódou novinovej fólie alebo pridaním matky z rezervy.",
    "related": [
      "zazimovani",
      "varroaza",
      "vcelstvo",
      "matka"
    ]
  },
  {
    "slug": "snubni-prolet",
    "term": "Oplodňovací prelet",
    "alias": [
      "svadobný prelet",
      "párovací let",
      "oplodnenie matky"
    ],
    "kategorie": "vcelarstvi",
    "shortDef": "Oplodňovací prelet je let mladej matky za trúdmi na zhromaždisko trúdov, kde sa pári s 10–20 trúdmi a ukladá spermie do semenného vačku na celý život.",
    "longDef": "Mladá matka podniká oplodňovací prelet zvyčajne 7–14 dní po vyliahnutí z matečníka. Predpokladom je teplý slnečný deň pri teplote nad 20 °C a slabom vetre. Matka lieta na zhromaždisko trúdov (vzdialené 1–5 km) vo výške 10–40 m, kde sa pohybujú trúdy z mnohých rôznych včelstiev.\n\nKopulácia prebieha za letu — trúd spočíva na matke, evertuje kopulačný orgán a prenáša spermie; po kopulácii uhynie. Matka sa pári s 10–20 trúdmi počas 1–3 oplodňovacích preletov. Spermie sa ukladajú v semennom vačku (spermatheca) — táto zásoba jej vystačí na 3–5 rokov. Nevyužité spermie sa aktívne filtrujú.\n\nZlé počasie (dážď, chlad) môže zabrániť oplodňovaciemu preletu — matka potom zostáva neoplodnená aj viac ako 3 týždne. Neoplodnená matka (nazývaná trúdokladná matka alebo pseudomatka) nakoniec začne klásť neoplodnené vajíčka, z ktorých sa vyvíjajú len trúdy.\n\nKontrolované oplodnenie matky na izolovanej inseminačnej stanici (ostrov, odľahlé horské stanovište) je základom selekčného šľachtenia. Na Slovensku funguje sieť inseminačných staníc Zväzu chovateľov včely medonosnej.",
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
    "longDef": "Včelie tance opísal a dešifroval Karl von Frisch, za čo obdržal Nobelovu cenu za fyziológiu a medicínu v roku 1973. Rozlišujú sa dva základné typy: kruhový tanec (zdroj do cca 50–100 m od úľa) a tanec osmičiek (wabble dance, pre vzdialenosti nad 100 m).\n\nPri tanci osmičiek robotnica beží rovnou vzdialenosťou (tzv. priamy priebeh) a pritom vrtí zadočkom — dĺžka priameho priebehu signalizuje vzdialenosť (dlhší priebeh = vzdialenejší zdroj), uhol priameho priebehu voči zvislej osi plástu zodpovedá uhlu letu k slnku. Počet deviačných krokov za 15 sekúnd koreluje so vzdialenosťou zdroja.\n\nIntenzita tanca (energičnosť, počet opakovaní) signalizuje kvalitu zdroja — bohatý a voňavý nektár vyvolá intenzívnejší tanec a rýchlejší nábor zberačiek. Prijímajúce robotnice sledujú tance čeľusťami a anténami, prijímajú vzorku pachu zo zberačky.\n\nVýskum včelích tancov pokračuje — bolo preukázané, že súhrnná rozhodovacia sila skupiny prieskumníc volí hniezdište demokraticky: posilňujú sa tance pre lepšie lokality. Toto kolektívne rozhodovanie je modelom pre teóriu skupinového rozhodovania.",
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
    "longDef": "Medný výnos závisí od kombinácie genetického potenciálu matky, sily včelstva, druhu a dostupnosti znášky a poveternostných podmienok. Priemerný výnos v ČR sa medzi rokmi výrazne líši; v priaznivých repkovo-lipových oblastiach Polabia alebo južnej Moravy môže silné včelstvo priniesť 60–80 kg a viac.\n\nMedonosný potenciál je daný hustotou kvitnúcich rastlín v letovom okruhu (3–5 km) a dobou kvitnutia. V monokultúrnej krajine (pšenica, kukurica) je mimo sezónnu pastvu nedostatok pestrejšej potravy — moderné poľnohospodárske dotácie preto zahŕňajú agro-environmentálne opatrenia podporujúce biopásy a kvitnúce pásy.\n\nKočovné včelárenie (presun úľov za znáškami) zvyšuje potenciálny výnos, ale je organizačne aj fyzicky náročnejšie. V ČR je kočovanie rozšírenou praxou — k repke v apríli-júni, k lipe v júli, k pohánke alebo slnečnici v auguste.\n\nMedný výnos je základom kalkulácie ekonomiky chovu: pri cenách medu 200–350 Kč/kg a nákladoch na prevádzku úľa 500–1 000 Kč/rok sa rentabilita malej prevádzky dosiahne od približne 30 včelstiev.",
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
      "pastovaný med"
    ],
    "kategorie": "vcelarstvi",
    "shortDef": "Pastovanie medu je kontrolovaná kryštalizácia, pri ktorej sa tekutý med homogenizuje so zárodnými kryštálmi (seed crystal), aby vznikol krémový jemne kryštalický produkt s hladkou konzistenciou.",
    "longDef": "Kryštalizácia medu je prirodzený fyzikálno-chemický proces — glukóza precipituje z presýteného vodného roztoku. Rýchlosť kryštalizácie závisí od pomeru fruktózy a glukózy (vysoký obsah fruktózy = pomalá kryštalizácia — akátový med; repkový med s vysokým obsahom glukózy kryštalizuje do tuhej formy za 2–6 týždňov).\n\nPri pastovaní sa tekutý med (zahriaty na 35–40 °C pre roztavenie existujúcich kryštálov) zmieša so zárodnými kryštálmi (jemne rozmiešaným starším medom, zvyčajne 10–20 % hmotnosti). Zárodné kryštály fungujú ako nukleačné jadrá — riadenou kryštalizáciou vznikajú veľmi drobné homogénne kryštály, výsledná konzistencia je krémová a ľahko roztierateľná.\n\nChladenie na 14–16 °C po dobu 1–2 týždňov je optimálne pre tvorbu pastovaného medu. Pri teplote pod 10 °C je proces príliš pomalý, nad 25 °C sa kryštály znovu rozpúšťajú. Výsledný produkt si zachováva drobné kryštáliky a neroztápa sa.\n\nPastovaný med je v Česku obľúbenou formou predaja — má dlhšiu trvanlivosť v stáčanom stave, nesteká, lepšie sa roztiera na pečivo. Je predávaný za ceny porovnateľné alebo mierne vyššie než tekutý med (200–400 Kč/kg v priamom predaji).",
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
    "shortDef": "Vytáčanie medu je proces odstredenia zrelého medu z odkrytých plástov v medomete, pri ktorom sa med vymrští z buniek a odteká do nádoby.",
    "longDef": "Pred samotným vytáčaním sú potrebné prípravné kroky: presun medníkových rámikov do čistej miestnosti (zbavenie lietok, aby sa robotnice nemohli vrátiť do odkrytých rámikov), odkrytie (deoperkulácia) voskových viečok odkryvacím nástrojom alebo parou a vloženie rámikov do medometu.\n\nVytáčanie prebieha pomalou rozjazdovou rýchlosťou (70–100 ot./min.), aby sa plásty nepretrhli, potom sa zvýši na pracovné otáčky (200–500 ot./min. podľa priemeru medometu). V radiálnom medomete stačí jeden cyklus, v tangenciálnom sa rámiky otočia a vytočia obe strany.\n\nČerstvo vytočený med sa prefiltruje cez nerezové sito (≤ 0,5 mm oka) a nechá sedimentovať v uzavretej nádobe 24–48 hodín. Vzduchové bubliny a drobné voskové vločky stúpajú na povrch. Potom sa stáča do pohárov alebo sudov.\n\nPred stočením do finálneho obalu je potrebné zmerať obsah vody refraktometrom (Brix alebo index lomu) — med s obsahom vody nad 18 % kvasí. Kvasný med nemožno predávať ako potravinový med.",
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
      "úľové stanovište",
      "prístrešok pre úle"
    ],
    "kategorie": "vcelarstvi",
    "shortDef": "Včelín je zastrešený prístrešok alebo budova chrániaca úle pred poveternostnými vplyvmi, predátormi a vandalmi, zároveň slúži ako sklad nástrojov a medáreň.",
    "longDef": "Tradičný včelín (pavlačový typ) je drevená stavba s lodžiou, na ktorej stoja úle letáčmi von. Pavlačový typ je pre stacionárne (bez kočovania) prevádzky v miestach s drsnejším klimatom alebo zimami — chráni úle pred dažďom, snehom a mrazom.\n\nModerná prevádzka zvyčajne používa voľne stojace úle na podstavcoch s ľahkým prístreškom alebo plachtou. V podmienkach Slovenska sa považuje za dostatočné umiestnenie v juhovýchodnej expozícii s prirodzeným vetrom a tieňom.\n\nPre komerčnú alebo hobby prevádzku je výhodné mať na stanovišti drobný prístrešok s pracovným stolom, vedrami na med, medometom a dezinfekčnými prostriedkami — spĺňa základné hygienické požiadavky pre domáce spracovanie medu podľa hygienickej vyhlášky.",
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
    "longDef": "Kočovanie patrí k najefektívnejším metódam zvyšovania mednej produkcie. V ČR typicky zahŕňa presun k rozkvitnutej repke (apríl–máj, Polabie, južná Morava), k lipe (júl, lesy a stromoradia), k pohánke alebo slnečnici (august) a prípadne k vresu (august–september, Česká vysočina, šumavské podhorie).\n\nPresun sa vykonáva v noci, keď sú robotnice vo vnútri úľa — letáč sa uzavrie sieťovou vložkou (dostatočná ventilácia) alebo zátkou, úle sa zaistia popruhmi a naložia sa na vozidlo. Preprava by nemala trvať dlhšie ako jednu noc — pri dlhšej preprave alebo horúčave hrozí zadusenie alebo prehriatie.\n\nNa novom stanovišti sa odporúča ponechať letáč 1–2 hodiny uzavretý (robotnice sa upokoja), potom otvoriť skoro ráno. Presun na menej ako 3 km od predchádzajúceho stanovišťa nezabezpečí presmerovanie lietok — včely sa vrátia na pôvodné miesto. Vzdialenosť presunu musí byť buď menej ako 50 m (denná preprava po etapách) alebo viac ako 3 km.\n\nKočovné včelstvo musí byť zdravé a ošetrené — SVS vydáva kočovacie preukazy, ktoré veterinárne potvrdzujú zdravotný stav včelstva. Bez platného preukazu nemožno legálne presúvať úle v ČR.",
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
    "externalLabel": "Web PSSR"
  },
  {
    "slug": "cesno-pojem",
    "term": "Letáč",
    "alias": [
      "letáč úľa",
      "letový otvor",
      "vletový otvor"
    ],
    "kategorie": "vcelarstvi",
    "shortDef": "Letáč je vstupný otvor do úľa slúžiaci ako vletový a výletový bod pre robotnice a ako prvá línia obrany včelstva pred nežiaducimi vplyvmi a narušiteľmi.",
    "longDef": "Letáč (česky *česno*, zo starosl. \"česati\" — cesta) je hlavný otvor v čelnej stene úľa. Štandardná šírka letáča závisí od typu úľa — u Langstrothu je to zvyčajne 20 mm výška a celá šírka nadstavku (37–40 cm) alebo kratšia zátka. Výška letáča sa prispôsobuje veľkosti populácie a ročnému obdobiu.\n\nNa leto sa letáč rozširuje pre voľný priechod intenzívne lietajúcich robotníc a ventiláciu; na jeseň sa zužuje zátkou alebo letáčovou vložkou na šírku jedného prsta, aby sa znížil prístup slabých predátorov (sršne, myši, lúpeživé včely). Na zimu sa letáč úplne uzavrie letáčovým uzáverom s vetracím sitom.\n\nLetáč ako obranná línia: strážne robotnice kontrolujú každú prichádzajúcu včelu čuchovými a hmatovými orgánmi. Narušitelia (lúpeživé včely z cudzích úľov, vosy, sršne) sú odháňaní alebo usmrcovaní. Intenzita lúpenia je indikátorom sily včelstva — slabé alebo bezmatkové včelstvo sa nedokáže ubrániť.\n\nPosúdenie aktivity letáča je rýchlou diagnostikou zdravia včelstva: aktívny pohyb robotníc s peľovými obnôžkami v ranných hodinách signalizuje silné, aktívne plodisko; mŕtvy alebo nehybný letáč signalizuje problém.",
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
      "medovo-cukrové cesto",
      "zimné krmivo"
    ],
    "kategorie": "vcelarstvi",
    "shortDef": "Medocukrové cesto (kandy) je tuhé zimné krmivo z cukru, medu a vody, ktoré sa pokladá na rámiky na doplnenie zásoby v zime alebo skoro na jar.",
    "longDef": "Medocukrové cesto (angl. candy alebo fondant) sa vyrába z kryštálového cukru (80–90 %), medu (5–15 %) a malého množstva vody (8–10 %). Varí sa za miešania do 118–120 °C (skúška do studenej vody — tvrdá guľka), potom sa mieša pri chladnutí do tuhej, plastickej konzistencie. Výsledok je mäkký, roztierateľný tuhý cukrový produkt.\n\nPodávanie kandy prebieha cez zimný alebo jarný letáč v plastovom sáčku alebo plastovej miske položenej na horné lišty rámikov. Robotnice kandy pomaly konzumujú — slúži ako záchranná zásoba pri vyčerpaní zimného medu. Dávkovanie býva 1–2 kg na zimujúce včelstvo.\n\nDomáca výroba je možná, ale časovo náročná. Komerčne predávané kandypasty (napr. Apifondant, Apicandy) sú štandardizované, hygienicky nezávadné, niekedy obohatené o minerály alebo vitamíny. Cena hotového kandy sa pohybuje okolo 30–50 Kč/kg.\n\nKandy je alternatívou k cukrovému sirupu (podávanému v teplej sezóne) — nevhodné pre zimné podávanie kvapalného sirupu, pretože robotnice musia vodu odpariť a vnútorná vlhkosť by narastala. Tuhá forma kandy nevnáša vlhkosť do zimoviska.",
    "related": [
      "zazimovani",
      "vyzimovani",
      "vcelstvo"
    ]
  },
  {
    "slug": "oplodnacek",
    "term": "Oplodniačik",
    "alias": [
      "nucleus úľ",
      "miniúľ",
      "inseminačná stanica"
    ],
    "kategorie": "vcelarstvi",
    "shortDef": "Oplodniačik je malý miniatúrny úľ na 3–5 miniatúrnych rámikov, používaný chovateľmi matiek na izolované oplodnenie mladých matiek na vzdialených oplodňovacích staniciach.",
    "longDef": "Oplodniačik (miniúľ alebo nucleusový miniúľ) je špeciálny malý úľ, ktorého rozmery zodpovedajú približne tretine alebo štvrtine štandardného rámika (napr. Zander alebo Apidea formát). Osadí sa hrstou robotníc (približne 100–200 g) z jedného alebo viacerých nevyhubiteľných zdrojov, krátkoplodným plástom a zásobami, potom sa vloží nedávno vyliahnutá panenská matka.\n\nRobotnice v oplodniačiku ošetrujú matku počas jej zrenia. Za 7–14 dní po vyliahnutí podnikne matka oplodňovací prelet. Na izolovanej inseminačnej stanici (ostrov, vzdialený horský hrebeň) sú v dosahu iba trúdy z vybraných šľachtiteľských línií, čím sa dosiahne kontrolované oplodnenie.\n\nPo oplodnení sa matka kontroluje (kladenie vajíčok, kompaktný plod do 10 dní po návrate z oplodňovacieho preletu) a odchytí sa na expedíciu alebo zasadenie do výrobného včelstva. Oplodniačik potom slúži na prijatie novej panenskej matky.\n\nSystémy oplodniačikov sú štandardizované (Apidea, Kirchhain, Nicot) — vzájomná zameniteľnosť a jednoduchá manipulácia sú výhodami, nevýhodou je náročnosť prepravy a slabšie zásoby pri zlom počasí.",
    "related": [
      "matka",
      "snubni-prolet",
      "oddelek",
      "matka-neoplozena"
    ]
  },
  {
    "slug": "trubcina",
    "term": "Trúdia stavba",
    "alias": [
      "trúdí plod",
      "trúdia plocha"
    ],
    "kategorie": "vcelarstvi",
    "shortDef": "Trúdia stavba je plocha plástu s trúdími bunkami (priemer 6,2–6,9 mm), v ktorých sa vyvíjajú trúdy a ktoré slúžia ako biotop preferovaný roztočom Varroa na reprodukciu.",
    "longDef": "Trúdia stavba sa od robotníckeho plodu rozozná tak vizuálne (bunky majú väčší priemer a sú kupolovito vyklenuté, takže zaviečkovaný trúdí plod výrazne prečnieva z plochy plástu), ako aj rozmerovo. Matka kladie do trúdích buniek neoplodnené vajíčka zámerne — rozpozná veľkosť bunky zadočkovými senzormi.\n\nZ pohľadu parazitológie je trúdia stavba kritickým miestom pre varroázu — Varroa destructor preferuje trúdí plod (trúdy majú dlhšiu zaviečkovanú fázu, takže roztoč stihne viac potomkov). Zámerné vkladanie trúdích rámikov do plodiska a ich cyklické vyraďovanie (tzv. biotechnická metóda boja s varroázou) znižuje populáciu roztočov bez chémie.\n\nPríliš veľká plocha trúdej stavby (cez 20 % plochy plodiska) oslabuje včelstvo zbytočným množstvom živých trúdov. V bezmatkovom včelstve (alebo pri robotniciach s vaječníkmi) je všetok plod trúdí — tento jav nazývaný „trúdokladné robotnice\" alebo „bezmatkový trúdí plod\" svedčí o vážnej poruche.\n\nStará medzistena má tendenciu k zväčšovaniu buniek — včely dostavujú bunky na väčší priemer, čo zvyšuje podiel trúdej stavby. Výmena medzistien každé 2 roky kontroluje bunkový rozmer.",
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
    "longDef": "Panenská matka je fyziologickým medzistupňom medzi larvou v matečníku a plodnou matkou. Po vyliahnutí z matečníka je pohyblivá a aktívna, ale ešte nevyvinutá pre reprodukciu — vaječníky dozrievajú, semenný vačok je prázdny.\n\nV prvých 5–7 dňoch po vyliahnutí prebieha pohlavné dozrievanie. Matka skúma úľ, ničí ostatné matečníky (pichne ich cez viečko) a vytláča prípadné sokyne z iných matečníkov. Tento stav „súbojov o trón\" je normálny pri prirodzenom rojení.\n\nPrítomnosť panenskej matky sa dá overiť ťažko — nekladie, preto plodový test nepomôže. Priame pozorovanie (matka je pohyblivá, vytiahnutá, ale bez vajíčok) alebo feromónový test (nie je výrazná materská látka) sú metódy. Neskúsený včelár ľahko omylom zlikviduje panenskú matku.\n\nPreprava panenských matiek v zásielkových klietkach je rizikovejšia než preprava kladúcich matiek — robotnice ich horšie prijímajú. Preto šľachtitelia expedujú spravidla matky po oplodnení (najneskôr 2–3 dni po prvom kladení).",
    "related": [
      "matka",
      "snubni-prolet",
      "oplodnacek",
      "matecnik"
    ]
  },
  {
    "slug": "zaviceny-med",
    "term": "Zaviečkovaný med",
    "alias": [
      "zrelý med",
      "dozretý med",
      "operkovaný med"
    ],
    "kategorie": "vcelarstvi",
    "shortDef": "Zaviečkovaný med je med uzavretý voskovým viečkom v bunkách plástu, čo signalizuje jeho zrelosť — obsah vody sa znížil pod 18 % a med nekvasí.",
    "longDef": "Zaviečkovanie medu je prirodzeným kvalitatívnym štandardom, ktorý včely uplatňujú inštinktívne. Až po dosiahnutí obsahu vody pod 17–18 % robotnice uzavrú bunku voskovým viečkom. Med s vyšším obsahom vody by v bunke fermentoval (kvasinky Saccharomyces cerevisiae alebo Zygosaccharomyces rouxii sú prirodzene prítomné v mede).\n\nPre vytáčanie platí zásada: vytáčať iba rámiky, ktorých aspoň dve tretiny buniek sú zaviečkované. Nezrelý med (z buniek bez viečok alebo slabšie zaviečkovaný) sa dá vytočiť, ale je nestabilný — skvasí v nádobe. Úradná kontrola (SZPI) pri predaji medu overuje obsah vody refraktometricky (do 20 %, optimum do 18 %).\n\nPlástový med (honeycomb) — celé zaviečkované plásty alebo ich výrezy — je najhodnotnejším spôsobom predaja medu: zákazník dostane produkt úplne nespracovaný ľudskou rukou. Cena plástového medu dosahuje 400–800 Kč/kg.\n\nFermentovaný med (skvasený med) nemožno predávať ako potravinársky med. Spracováva sa na medovinu alebo hydromel. Obsah alkoholu fermentovaného medu závisí od podmienok kvasenia — zvyčajne 1–3 % v prirodzene vykvasenej hmote.",
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
    "longDef": "DZES predstavuje súbor pravidiel, ktoré poľnohospodári musia dodržiavať, aby udržali pôdu v dobrom poľnohospodárskom a environmentálnom stave. Tieto pravidlá zahŕňajú opatrenia na ochranu pôdy, vody a biologickej rozmanitosti.\n\nDZES je súčasťou podmienenosti, čo je systém, ktorý spája poľnohospodárske dotácie s dodržiavaním určitých štandardov. Dodržiavanie DZES je kľúčové pre získanie priamych platieb a niektorých ďalších dotácií.\n\nV ČR sa DZES uplatňuje v rámci Spoločnej poľnohospodárskej politiky EÚ a jeho dodržiavanie kontrolujú príslušné orgány.",
    "related": [
      "saps",
      "redistributivni-platba",
      "anc-platba",
      "podminenost"
    ],
    "faq": [
      {
        "q": "Na čo slúži DZES?",
        "a": "DZES slúži na to, aby sa poľnohospodárska pôda udržiavala v dobrom stave z hľadiska poľnohospodárstva aj životného prostredia."
      },
      {
        "q": "Aké pravidlá zahŕňa DZES?",
        "a": "DZES zahŕňa pravidlá na ochranu pôdy, vody a biologickej rozmanitosti."
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
    "shortDef": "SAPS (jednotná platba na plochu) bol zjednodušený systém priamych platieb podľa obhospodarovanej plochy, ktorý ČR používala od vstupu do EÚ v roku 2004 do roku 2022. Od roku 2023 naň nadviazala platba BISS.",
    "longDef": "SAPS (Single Area Payment Scheme, po slovensky jednotná platba na plochu) bol systém priamych platieb, v ktorom poľnohospodár dostával rovnakú sadzbu na každý hektár spôsobilej poľnohospodárskej plochy. Mohli ho používať štáty, ktoré vstúpili do EÚ v roku 2004 a neskôr.\n\nPlatba nebola viazaná na konkrétnu produkciu, takže poľnohospodári sa mohli slobodne rozhodovať, čo budú pestovať.\n\nV ČR sa SAPS vyplácala od vstupu do EÚ v roku 2004 do roku 2022. Od roku 2023 na ňu nadviazala základná podpora príjmu pre udržateľnosť (BISS) — v ČR za rok 2025 bola 1 759,91 Kč/ha.",
    "related": [
      "dzes",
      "redistributivni-platba",
      "anc-platba",
      "cap-2024"
    ],
    "faq": [
      {
        "q": "Ako sa počítala SAPS?",
        "a": "Ako jednotná sadzba na hektár vynásobená spôsobilou výmerou poľnohospodárskej pôdy."
      },
      {
        "q": "Na čo slúžila SAPS?",
        "a": "Stabilizovala príjmy poľnohospodárov v nových členských štátoch EÚ; v ČR na ňu od roku 2023 nadviazala platba BISS."
      }
    ]
  },
  {
    "slug": "redistributivni-platba",
    "term": "Redistributívna platba",
    "kategorie": "dotace",
    "shortDef": "Doplnková redistributívna podpora príjmu (CRISS) je priama platba na prvé hektáre podniku, ktorá presúva peniaze k menším a stredným farmám. V ČR sa vypláca na prvých 150 ha; za rok 2025 bola 3 449,49 Kč/ha.",
    "longDef": "Redistributívna platba (skratka EÚ CRISS — Complementary Redistributive Income Support for Sustainability) je doplnková priama platba, ktorú podnik dostáva len na prvé hektáre. Malé a stredné podniky tak dostanú v prepočte na hektár viac než veľké.\n\nV ČR sa poskytuje na prvých 150 hektárov každého podniku a nárok na ňu má žiadateľ, ktorý má nárok na základnú platbu BISS. Za rok 2025 bola 3 449,49 Kč/ha. Český Strategický plán SPP na ňu vyčlenil 23 % obálky priamych platieb.\n\nPodľa pravidiel EÚ na ňu štáty vyčleňujú najmenej 10 % obálky priamych platieb, ak potrebu prerozdelenia neriešia inými nástrojmi.",
    "related": [
      "saps",
      "dzes",
      "anc-platba",
      "cap-2024"
    ],
    "faq": [
      {
        "q": "Aký je účel redistributívnej platby?",
        "a": "Presúva časť priamych platieb k menším a stredným podnikom — v ČR ide o príplatok na prvých 150 ha."
      },
      {
        "q": "Ako sa líši redistributívna platba od BISS?",
        "a": "BISS sa platí na všetky spôsobilé hektáre, redistributívna platba len na prvých 150 ha podniku a k BISS je doplnková (ČR 2025: BISS 1 759,91 Kč/ha, redistributívna platba 3 449,49 Kč/ha)."
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
    "externalUrl": "https://cs.wikipedia.org/wiki/Nitr%C3%A1tov%C3%A1_sm%C4%9Brnice",
    "externalLabel": "Wikipedia",
    "faq": [
      {
        "q": "Čo je cieľom nitrátovej smernice?",
        "a": "Cieľom je ochrana vôd pred znečistením dusičnanmi z poľnohospodárskych zdrojov."
      },
      {
        "q": "Aké oblasti pokrýva nitrátová smernica?",
        "a": "Pokrýva oblasti s vysokým rizikom znečistenia vôd dusičnanmi."
      }
    ],
    "alias": []
  },
  {
    "slug": "zranitelne-oblasti",
    "term": "Zraniteľné oblasti (nitrátové)",
    "kategorie": "regulace",
    "shortDef": "Zraniteľné oblasti sú územia, kde je zvýšené riziko znečistenia vôd dusičnanmi.",
    "longDef": "Zraniteľné oblasti, v kontexte nitrátovej smernice, sú územia identifikované ako miesta s vyšším rizikom znečistenia vôd dusičnanmi z poľnohospodárskych zdrojov. Tieto územia sú predmetom osobitných opatrení na ochranu kvality vody.\n\nV týchto oblastiach sú zavádzané akčné programy, ktoré zahŕňajú opatrenia na zníženie vstupu dusičnanov do vodných zdrojov, ako je obmedzenie používania hnojív a zavádzanie udržateľných poľnohospodárskych praktík.\n\nNa Slovensku sú zraniteľné oblasti pravidelne aktualizované a kontrolované, aby bola zabezpečená účinná ochrana vodných zdrojov.",
    "related": [
      "nitratova-smernice",
      "dzes",
      "ekoschemata",
      "podminenost"
    ],
    "faq": [
      {
        "q": "Čo sú zraniteľné oblasti?",
        "a": "Sú to územia, kde je zvýšené riziko znečistenia vôd dusičnanmi."
      },
      {
        "q": "Ako sa určujú zraniteľné oblasti?",
        "a": "Určujú sa na základe koncentrácie dusičnanov vo vodách a rizika ich znečistenia."
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
    "longDef": "ANC (Areas with Natural Constraints) je platba určená pre poľnohospodárov, ktorí hospodária v oblastiach s prírodnými obmedzeniami, ako sú horské oblasti alebo regióny s nepriaznivými klimatickými podmienkami. Cieľom tejto platby je kompenzovať dodatočné náklady a straty príjmov spojené s obtiažnymi podmienkami hospodárenia.\n\nPlatby ANC pomáhajú udržiavať poľnohospodársku činnosť v týchto oblastiach, čo prispieva k udržaniu krajiny a biodiverzity. Poľnohospodári v ANC oblastiach musia splniť určité podmienky, aby boli spôsobilí pre túto podporu.\n\nV ČR platby ANC upravuje nariadenie vlády ČR č. 61/2023 Sb. Oblasti sa delia na horské (H1–H5), ostatné (O1–O3) a špecifické (S). Sadzba sa líši podľa typu oblasti a výrobného zamerania podniku: od 27 EUR/ha (typ S, prevažujúca rastlinná výroba) po 216 EUR/ha (typ H1, prevažujúca živočíšna výroba). Vypláca sa v Kč a nad 300 ha sa platba postupne znižuje.",
    "related": [
      "saps",
      "dzes",
      "redistributivni-platba",
      "cap-2024"
    ],
    "faq": [
      {
        "q": "Na čo slúži platba ANC?",
        "a": "Platba ANC podporuje poľnohospodárov v oblastiach s prírodnými obmedzeniami."
      },
      {
        "q": "Ktoré oblasti sú oprávnené na platbu ANC?",
        "a": "Oblasti vymedzené podľa katastrálnych území — v ČR horské (H1–H5), ostatné (O1–O3) a špecifické (S); ich zoznam je prílohou nariadenia vlády ČR č. 61/2023 Sb."
      }
    ]
  },
  {
    "slug": "ekoschemata",
    "term": "Ekoschémy (ekoplatba)",
    "alias": [
      "ekoplatba"
    ],
    "kategorie": "dotace",
    "shortDef": "Ekoschémy sú finančné podpory zamerané na podporu ekologických poľnohospodárskych postupov.",
    "longDef": "Ekoschémy sú dobrovoľné režimy pre klímu a životné prostredie v rámci priamych platieb Spoločnej poľnohospodárskej politiky EÚ 2023–2027. Poľnohospodár, ktorý sa zaviaže k postupom šetrnejším k životnému prostrediu, dostane príplatok na hektár. Každý štát si ekoschémy navrhuje sám vo svojom strategickom pláne.\n\nV ČR má ekoschéma podobu celofarmovej ekoplatby, ktorú žiadateľ plní na celej výmere podniku. Za rok 2025 bola základná ekoplatba v ČR 1 578,37 Kč/ha; prémiová (17 521,20 Kč/ha) sa vypláca len na vyčlenené neprodukčné plochy a ochranné pásy pozdĺž vody. Od roku 2025 pribudli v ČR platby na krajinné prvky, udržateľné hospodárenie so živinami a pásové striedanie plodín. Ekoschémy tvoria 30 % obálky priamych platieb ČR.\n\nEkologické poľnohospodárstvo a agrolesníctvo nie sú v ČR ekoschémami — podporujú sa samostatnými opatreniami rozvoja vidieka.\n\nNa Slovensku ekoschémy vymedzuje slovenský Strategický plán SPP; podmienky a sadzby zverejňuje PPA.",
    "related": [
      "podminenost",
      "ozeleneni",
      "prv",
      "cap-2024"
    ],
    "faq": [
      {
        "q": "Na čo slúžia ekoschémy?",
        "a": "Ekoschémy slúžia na podporu ekologických poľnohospodárskych postupov, ktoré prispievajú k ochrane životného prostredia."
      },
      {
        "q": "Aké podmienky treba splniť na získanie ekoplatby?",
        "a": "V ČR okrem iného diverzifikáciu plodín, hospodárenie s organickou hmotou, ochranný pás pozdĺž vody a vyčlenenie neprodukčných plôch na ornej pôde; na trvalom trávnom poraste pastvu alebo kosbu do 31. júla."
      },
      {
        "q": "Ako sa ekoschémy líšia od tradičných dotácií?",
        "a": "Ekoschémy sú cielene zamerané na ekologické aspekty, zatiaľ čo tradičné dotácie môžu pokrývať širšie spektrum poľnohospodárskych potrieb."
      }
    ]
  },
  {
    "slug": "podminenost",
    "term": "Podmienenosť (kondicionalita)",
    "alias": [
      "kondicionalita"
    ],
    "kategorie": "regulace",
    "shortDef": "Podmienenosť je systém pravidiel, ktoré musia poľnohospodári dodržiavať, aby získali poľnohospodárske dotácie.",
    "longDef": "Podmienenosť, známa aj ako kondicionalita, je súbor pravidiel a štandardov, ktoré musia poľnohospodári dodržiavať, aby mali nárok na priame platby a niektoré ďalšie poľnohospodárske dotácie v rámci EÚ. Tieto pravidlá zahŕňajú požiadavky na ochranu životného prostredia, zdravie zvierat a rastlín, bezpečnosť potravín a dobré životné podmienky zvierat. Podmienenosť je kľúčovou súčasťou Spoločnej poľnohospodárskej politiky a nástrojom na zabezpečenie udržateľného poľnohospodárstva. Na Slovensku dodržiavanie podmienenosti kontrolujú príslušné orgány a jej nedodržanie môže viesť k finančným sankciám.",
    "related": [
      "ekoschemata",
      "ozeleneni",
      "prv",
      "gaec"
    ],
    "faq": [
      {
        "q": "Čo je podmienenosť v poľnohospodárstve?",
        "a": "Podmienenosť je súbor pravidiel, ktoré musia poľnohospodári dodržiavať, aby získali poľnohospodárske dotácie."
      },
      {
        "q": "Aké oblasti pokrýva podmienenosť?",
        "a": "Podmienenosť zahŕňa oblasti ako ochrana životného prostredia, dobré životné podmienky zvierat a bezpečnosť potravín."
      },
      {
        "q": "Ako sa kontroluje dodržiavanie podmienenosti?",
        "a": "Dodržiavanie podmienenosti sa kontroluje prostredníctvom inšpekcií a auditov."
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
    "longDef": "Zastropovanie priamych platieb je obmedzenie sumy základnej platby, ktorú môže dostať jeden poľnohospodársky podnik. Pre obdobie 2023–2027 ho upravuje článok 17 nariadenia (EÚ) 2021/2115 a pre členské štáty je dobrovoľné: štát, ktorý zastropovanie zavedie, zníži sumu základnej platby nad 100 000 EUR o 100 %. Popri tom môže sumy nad 60 000 EUR postupne znižovať až o 85 %. Pred výpočtom možno odpočítať mzdy a ďalšie náklady práce.\n\nCieľom je spravodlivejšie rozdelenie peňazí medzi menšie a väčšie podniky. Rovnaký cieľ možno dosiahnuť redistributívnou platbou — český Strategický plán SPP na ňu vyčlenil 23 % obálky priamych platieb (prvých 150 ha každého podniku).",
    "related": [
      "prv",
      "redistributivni-platba",
      "ekoschemata",
      "cap-2024"
    ],
    "faq": [
      {
        "q": "Čo znamená zastropovanie priamych platieb?",
        "a": "Zastropovanie priamych platieb je obmedzenie maximálnej sumy dotácií, ktorú môže jeden poľnohospodársky podnik dostať."
      },
      {
        "q": "Prečo sa zavádza zastropovanie platieb?",
        "a": "Cieľom zastropovania je zabezpečiť spravodlivejšie rozdelenie dotácií medzi menšie a stredné poľnohospodárske podniky."
      },
      {
        "q": "Ako sa určuje limit pre zastropovanie platieb?",
        "a": "Limit stanovuje nariadenie (EÚ) 2021/2115: pri zastropovaní sa suma základnej platby nad 100 000 EUR odoberá celá; od sumy sa predtým môžu odpočítať mzdy a náklady práce."
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
    "shortDef": "Program rozvoja vidieka bol súbor opatrení EÚ na podporu vidieckych oblastí a poľnohospodárstva; od roku 2023 ho v ČR aj na Slovensku nahradil strategický plán SPP 2023–2027.",
    "longDef": "Program rozvoja vidieka (PRV) bol hlavný nástroj Spoločnej poľnohospodárskej politiky EÚ na rozvoj vidieckych oblastí a poľnohospodárstva. Zahŕňal opatrenia na modernizáciu poľnohospodárskych podnikov, podporu ekologického poľnohospodárstva, agroenvironmentálne opatrenia a rozvoj vidieka. V ČR bežali programy PRV 2007–2013 a 2014–2020. Od roku 2023 spadá rozvoj vidieka do strategických plánov SPP 2023–2027 — v ČR ho administruje SZIF, na Slovensku PPA.",
    "related": [
      "ekoschemata",
      "podminenost",
      "zastropovani",
      "ozeleneni"
    ],
    "externalUrl": "https://cs.wikipedia.org/wiki/Program_rozvoje_venkova",
    "externalLabel": "Wikipedia",
    "faq": [
      {
        "q": "Čo je Program rozvoja vidieka?",
        "a": "Súbor opatrení EÚ na podporu vidieckych oblastí a poľnohospodárstva; v ČR bežal v obdobiach 2007–2013 a 2014–2020."
      },
      {
        "q": "Aké ciele mal Program rozvoja vidieka?",
        "a": "Zlepšiť konkurencieschopnosť poľnohospodárstva, podporiť udržateľné hospodárenie a zlepšiť kvalitu života vo vidieckych oblastiach."
      },
      {
        "q": "Čo nahradilo Program rozvoja vidieka?",
        "a": "Od roku 2023 spadá rozvoj vidieka do strategického plánu SPP 2023–2027."
      }
    ]
  },
  {
    "slug": "platba-pro-mlade-zemedelce",
    "term": "Platba pre mladých poľnohospodárov",
    "kategorie": "dotace",
    "shortDef": "Platba pre mladých poľnohospodárov je doplnková priama platba pre začínajúcich poľnohospodárov, ktorí v roku prvej žiadosti nedosiahli 41 rokov. V ČR za rok 2025 bola 2 378,75 Kč/ha, najviac na 90 ha a počas piatich rokov.",
    "longDef": "Platba pre mladých poľnohospodárov (doplnková podpora príjmu pre mladých poľnohospodárov, skratka EÚ CIS-YF) je priama platba Spoločnej poľnohospodárskej politiky EÚ, ktorá má uľahčiť generačnú obmenu v poľnohospodárstve.\n\nV ČR je určená žiadateľom, ktorí v prvom roku podania žiadosti nedosiahli vek 41 rokov a prvýkrát založili poľnohospodársky podnik alebo prevzali hospodárstvo. Podmienkou je nárok na základnú platbu BISS a aspoň minimálna poľnohospodárska kvalifikácia. Žiada sa v Jednotnej žiadosti päť po sebe idúcich rokov, najviac na 90 ha. Za rok 2025 bola sadzba 2 378,75 Kč/ha; platbu administruje SZIF.\n\nPopri nej existuje v ČR projektová intervencia 49.75 Začatie činnosti mladého poľnohospodára — jednorazová paušálna podpora na začiatok podnikania.\n\nNa Slovensku platbu pre mladých poľnohospodárov administruje PPA podľa slovenských podmienok.",
    "related": [
      "prv",
      "ekoschemata",
      "ozeleneni",
      "redistributivni-platba"
    ],
    "faq": [
      {
        "q": "Čo je platba pre mladých poľnohospodárov?",
        "a": "Doplnková priama platba pre začínajúcich poľnohospodárov do 40 rokov; v ČR za rok 2025 bola 2 378,75 Kč/ha, najviac na 90 ha."
      },
      {
        "q": "Aké sú podmienky na získanie platby pre mladých poľnohospodárov?",
        "a": "V ČR vek do 40 rokov v roku prvej žiadosti, prvé založenie alebo prevzatie podniku, minimálna poľnohospodárska kvalifikácia a nárok na základnú platbu BISS."
      },
      {
        "q": "Prečo sa poskytuje platba pre mladých poľnohospodárov?",
        "a": "Platba sa poskytuje na podporu generačnej obmeny v poľnohospodárstve."
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
    "shortDef": "Ozelenenie (greening) bolo povinnou environmentálnou zložkou priamych platieb EÚ v rokoch 2015–2022; od roku 2023 ho nahradila prísnejšia podmienenosť a ekoschémy.",
    "longDef": "Ozelenenie, anglicky greening, bolo časťou priamych platieb Spoločnej poľnohospodárskej politiky EÚ v rokoch 2015–2022, ktorú poľnohospodár dostal len vtedy, keď splnil tri povinné opatrenia: diverzifikáciu plodín na ornej pôde, zachovanie trvalých trávnych porastov a vyčlenenie plôch v ekologickom záujme (EFA) — najmenej 5 % ornej pôdy pri podnikoch s viac než 15 ha ornej pôdy. Na greening išlo 30 % obálky priamych platieb.\n\nEurópsky dvor audítorov v roku 2017 zistil, že greening viedol k zmene hospodárenia len asi na 5 % poľnohospodárskej pôdy.\n\nOd roku 2023 greening skončil. Jeho povinné prvky prešli do štandardov podmienenosti (GAEC, v ČR DZES) a dobrovoľné do ekoschém — v ČR do celofarmovej ekoplatby.",
    "related": [
      "ekoschemata",
      "podminenost",
      "prv",
      "cap-2024"
    ],
    "faq": [
      {
        "q": "Čo je ozelenenie v poľnohospodárstve?",
        "a": "Povinná ekologická zložka priamych platieb EÚ v rokoch 2015–2022 (greening)."
      },
      {
        "q": "Aké boli hlavné prvky ozelenenia?",
        "a": "Diverzifikácia plodín, zachovanie trvalých trávnych porastov a plochy v ekologickom záujme (EFA)."
      },
      {
        "q": "Prečo greening skončil?",
        "a": "Reforma SPP od roku 2023 ho nahradila prísnejšou podmienenosťou a dobrovoľnými ekoschémami; Európsky dvor audítorov (2017) navyše zistil, že greening zmenil hospodárenie len asi na 5 % poľnohospodárskej pôdy."
      }
    ]
  },
  {
    "slug": "diskovy-podmitac",
    "term": "Diskový podmietač",
    "alias": [
      "diskový kultivátor",
      "diskový pluh"
    ],
    "kategorie": "technologie",
    "shortDef": "Diskový podmietač je poľnohospodársky stroj určený na plytkú podmietku pôdy.",
    "longDef": "Diskový podmietač je poľnohospodársky stroj vybavený radom diskov, ktoré sú usporiadané pod uhlom k smeru jazdy. Slúži na plytkú podmietku pôdy, teda na proces, pri ktorom sa povrchová vrstva pôdy narušuje a premiešava. Tento proces pomáha v boji proti burinám, zlepšuje štruktúru pôdy a podporuje rozklad organickej hmoty.\n\nV praxi sa diskové podmietače používajú predovšetkým po zbere, keď treba rýchlo a efektívne spracovať strnisko. Sú vhodné pre rôzne typy pôd a umožňujú rýchlu prácu na veľkých plochách.\n\nNa Slovensku sa diskové podmietače bežne používajú na poliach rôznych veľkostí a sú súčasťou moderného poľnohospodárstva, ktoré kladie dôraz na efektivitu a udržateľnosť.",
    "related": [
      "radlickovy-kypric",
      "hloubkove-kypreni",
      "strniste"
    ],
    "externalUrl": "https://cs.wikipedia.org/wiki/Podm%C3%ADtka",
    "externalLabel": "Wikipedia",
    "faq": [
      {
        "q": "Na čo slúži diskový podmietač?",
        "a": "Diskový podmietač slúži na plytkú podmietku pôdy, ktorá pomáha ničiť buriny a zlepšuje pôdnu štruktúru."
      },
      {
        "q": "Aký je rozdiel medzi diskovým podmietačom a radličkovým kypričom?",
        "a": "Diskový podmietač je určený na plytkú podmietku, zatiaľ čo radličkový kyprič sa používa na hlbšie spracovanie pôdy."
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
    "externalUrl": "https://cs.wikipedia.org/wiki/Kyp%C5%99en%C3%AD",
    "externalLabel": "Wikipedia",
    "faq": [
      {
        "q": "Ako funguje radličkový kyprič?",
        "a": "Radličkový kyprič pracuje pomocou radlíc, ktoré prenikajú do pôdy, prevzdušňujú ju a premiešavajú."
      },
      {
        "q": "Kedy sa používa radličkový kyprič?",
        "a": "Radličkový kyprič sa používa pri príprave pôdy pred sejbou, najmä na jar a na jeseň."
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
    "longDef": "Teleskopický manipulátor je viacúčelový stroj vybavený teleskopickým ramenom, ktoré umožňuje manipuláciu s materiálom v rôznych výškach a vzdialenostiach. Je široko používaný v poľnohospodárstve na nakladanie, vykladanie a prepravu materiálov, ako sú balíky sena, hnojivá alebo stavebné materiály.\n\nVďaka svojej flexibilite a schopnosti pracovať v obmedzených priestoroch je teleskopický manipulátor ideálny pre farmy rôznych veľkostí. Jeho univerzálnosť je daná možnosťou pripojenia rôznych nástrojov, ako sú vidlice, lyžice alebo kliešte.\n\nNa Slovensku je teleskopický manipulátor bežnou súčasťou poľnohospodárskej techniky, ktorá zvyšuje efektivitu a znižuje fyzickú námahu pri manipulácii s materiálmi.",
    "related": [
      "celni-nakladac",
      "auto-steering",
      "telematika",
      "drony-zemedelstvi"
    ],
    "faq": [
      {
        "q": "Čo je teleskopický manipulátor?",
        "a": "Teleskopický manipulátor je stroj určený na manipuláciu s materiálom, často vybavený teleskopickým ramenom na dosiahnutie väčšej výšky."
      },
      {
        "q": "Aké sú výhody teleskopického manipulátora?",
        "a": "Teleskopické manipulátory ponúkajú vysokú flexibilitu a dosah, vďaka čomu sú ideálne na prácu v stiesnených priestoroch."
      }
    ]
  },
  {
    "slug": "celni-nakladac",
    "term": "Čelný nakladač",
    "alias": [
      "frontálny nakladač"
    ],
    "kategorie": "technologie",
    "shortDef": "Čelný nakladač je stroj určený na nakladanie a prepravu materiálov.",
    "longDef": "Čelný nakladač je poľnohospodársky stroj vybavený lyžicou alebo iným nástrojom v prednej časti, ktorý slúži na nakladanie, prepravu a vykladanie materiálov. Na farmách sa široko používa na manipuláciu s hnojom, krmivami, zeminou a ďalšími materiálmi.\n\nVďaka svojej konštrukcii umožňuje čelný nakladač efektívnu prácu v obmedzených priestoroch a dokáže rýchlo presunúť veľké množstvo materiálu. Jeho univerzálnosť spočíva v možnosti pripojiť rôzne nástroje, čo z neho robí nenahraditeľný stroj na farmách.\n\nNa Slovensku sa čelný nakladač bežne používa na malých aj veľkých farmách a je dôležitou súčasťou moderného poľnohospodárstva, ktoré kladie dôraz na efektivitu a produktivitu.",
    "related": [
      "teleskopicky-manipulator",
      "telematika",
      "gps-rtk",
      "auto-steering"
    ],
    "faq": [
      {
        "q": "Ako sa používa čelný nakladač?",
        "a": "Čelný nakladač sa používa na nakladanie, presúvanie a vykladanie materiálov, ako sú piesok, štrk alebo zemina."
      },
      {
        "q": "Aký je rozdiel medzi čelným nakladačom a teleskopickým manipulátorom?",
        "a": "Čelný nakladač je určený predovšetkým na nakladanie materiálu spredu, zatiaľ čo teleskopický manipulátor má výsuvné rameno na manipuláciu vo výške."
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
    "externalUrl": "https://cs.wikipedia.org/wiki/Rozmetadlo",
    "externalLabel": "Wikipedia",
    "faq": [
      {
        "q": "Ako funguje rozmetadlo minerálnych hnojív?",
        "a": "Rozmetadlo minerálnych hnojív rovnomerne rozptyľuje hnojivá po poli pomocou rotačných diskov alebo rozmetacích ramien."
      },
      {
        "q": "Prečo je dôležitá rovnomerná aplikácia hnojív?",
        "a": "Rovnomerná aplikácia hnojív zabezpečuje optimálny rast plodín a minimalizuje straty živín."
      }
    ]
  },
  {
    "slug": "cisterna-na-kejdu",
    "term": "Cisterna na hnojovicu (aplikátor)",
    "alias": [
      "aplikátor hnojovice",
      "cisterna na kejdu"
    ],
    "kategorie": "technologie",
    "shortDef": "Cisterna na hnojovicu je stroj určený na prepravu a aplikáciu hnojovice na pole.",
    "longDef": "Cisterna na hnojovicu, známa aj ako aplikátor hnojovice, je poľnohospodársky stroj používaný na prepravu a aplikáciu hnojovice (kejdy) na pole. Hnojovica je tekuté organické hnojivo, ktoré sa získava ako vedľajší produkt živočíšnej výroby a je bohaté na živiny.\n\nCisterna je vybavená systémom na presnú aplikáciu hnojovice, čo umožňuje efektívne využitie živín a minimalizáciu strát. Aplikácia hnojovice je dôležitá pre zlepšenie úrodnosti pôdy a podporu rastu plodín.\n\nNa Slovensku sa cisterny na hnojovicu používajú predovšetkým na farmách s intenzívnou živočíšnou výrobou, kde treba efektívne využívať dostupné organické hnojivo a zabezpečovať udržateľné hospodárenie s pôdou.",
    "related": [
      "rozmetadlo-hnojiv",
      "digestat",
      "organicka-hmota",
      "strniste"
    ],
    "externalUrl": "https://cs.wikipedia.org/wiki/Kejda",
    "externalLabel": "Wikipedia",
    "faq": [
      {
        "q": "Na čo slúži cisterna na hnojovicu?",
        "a": "Cisterna na hnojovicu slúži na prepravu a aplikáciu hnojovice na pole ako organického hnojiva."
      },
      {
        "q": "Ako sa hnojovica aplikuje na pole?",
        "a": "Hnojovica sa aplikuje na pole pomocou rozstrekovacích trysiek alebo injektorov, ktoré ju zapracúvajú do pôdy."
      }
    ]
  },
  {
    "slug": "svinovaci-lis",
    "term": "Zvinovací lis (lis na balíky)",
    "alias": [
      "lis na balíky",
      "balíkovač"
    ],
    "kategorie": "technologie",
    "shortDef": "Zvinovací lis je poľnohospodársky stroj určený na lisovanie a balenie objemového krmiva do valcových balíkov.",
    "longDef": "Zvinovací lis, známy aj ako lis na balíky, je poľnohospodársky stroj, ktorý lisuje objemové krmivo, ako je seno alebo slama, do kompaktných valcových balíkov. Tieto balíky sa ľahko skladujú a prepravujú, čo zefektívňuje manipuláciu s krmivom.\n\nStroj zbiera krmivo z poľa, rotačnými valcami ho stláča do pevného balíka a ten následne obalí sieťou alebo fóliou. Obal pomáha chrániť krmivo pred vlhkosťou a stratou živín.\n\nNa Slovensku sa zvinovacie lisy používajú najmä v oblastiach s intenzívnym chovom dobytka, kde treba efektívne spracovať veľké množstvo objemového krmiva na kŕmenie.",
    "related": [
      "teleskopicky-manipulator",
      "cisterna-na-kejdu",
      "rozmetadlo-hnojiv",
      "hloubkove-kypreni"
    ],
    "faq": [
      {
        "q": "Ako funguje zvinovací lis?",
        "a": "Zvinovací lis zbiera krmivo z poľa, stláča ho do valcového tvaru a balík obaľuje sieťou alebo fóliou."
      },
      {
        "q": "Na čo slúži zvinovací lis?",
        "a": "Slúži na efektívne balenie objemového krmiva na uskladnenie a neskoršie kŕmenie."
      },
      {
        "q": "Aký je rozdiel medzi zvinovacím lisom a lisom na hranaté balíky?",
        "a": "Zvinovací lis vytvára valcové balíky, zatiaľ čo lis na hranaté balíky vyrába balíky obdĺžnikového tvaru."
      }
    ]
  },
  {
    "slug": "samochodna-rezacka",
    "term": "Samohybná rezačka",
    "alias": [
      "rezačka",
      "zberová rezačka"
    ],
    "kategorie": "technologie",
    "shortDef": "Samohybná rezačka je stroj určený na zber a rezanie krmovín na siláž.",
    "longDef": "Samohybná rezačka je poľnohospodársky stroj, ktorý zbiera a reže krmoviny, napríklad kukuricu alebo trávy, na siláž. Má vlastný pohon a zvyčajne obsahuje rezací a drviaci mechanizmus, ktorý zabezpečuje jemné nasekanie materiálu.\n\nRezačka je kľúčová pre výrobu kvalitnej siláže, ktorá je dôležitým krmivom pre dobytok. Zber a rezanie prebiehajú rýchlo a efektívne, čo minimalizuje straty živín počas zberu.\n\nNa Slovensku sa samohybné rezačky často využívajú v kombinácii s ďalšími zberovými strojmi a technikami na optimalizáciu produkcie krmív v živočíšnej výrobe.",
    "related": [
      "svinovaci-lis",
      "rozmetadlo-hnojiv",
      "cisterna-na-kejdu",
      "hloubkove-kypreni"
    ],
    "externalUrl": "https://cs.wikipedia.org/wiki/Skl%C3%ADzec%C3%AD_%C5%99eza%C4%8Dka",
    "externalLabel": "Wikipedia",
    "faq": [
      {
        "q": "Ako funguje samohybná rezačka?",
        "a": "Samohybná rezačka zbiera krmoviny a zároveň ich reže na malé kúsky na silážovanie."
      },
      {
        "q": "Na čo slúži samohybná rezačka?",
        "a": "Slúži na efektívny zber a prípravu krmovín na výrobu siláže."
      },
      {
        "q": "Aký je rozdiel medzi samohybnou a ťahanou rezačkou?",
        "a": "Samohybná rezačka má vlastný pohon, zatiaľ čo ťahaná je pripojená k traktoru."
      }
    ]
  },
  {
    "slug": "pneumaticky-seci-stroj",
    "term": "Pneumatický sejací stroj",
    "alias": [
      "pneumatická sejačka",
      "sejačka"
    ],
    "kategorie": "technologie",
    "shortDef": "Pneumatický sejací stroj je zariadenie na presnú sejbu semien pomocou prúdu vzduchu.",
    "longDef": "Pneumatický sejací stroj je poľnohospodárske zariadenie, ktoré používa prúdenie vzduchu na presné umiestnenie semien do pôdy. Táto technológia umožňuje rovnomerné rozloženie semien na poli, čo zlepšuje klíčivosť a uľahčuje následnú starostlivosť o plodiny.\n\nStroj je vybavený systémom trysiek a hadíc, ktoré dopravujú semená z násypky do sejbového lôžka. Systém je riadený elektronicky, takže umožňuje nastaviť rôzne parametre sejby podľa potrieb konkrétnej plodiny.\n\nNa Slovensku sú pneumatické sejacie stroje obľúbené pre svoju efektivitu a presnosť, najmä pri sejbe plodín s vysokou hodnotou, ako je kukurica alebo repka.",
    "related": [
      "radlickovy-kypric",
      "hloubkove-kypreni",
      "predsetova-priprava",
      "osevni-postup"
    ],
    "externalUrl": "https://cs.wikipedia.org/wiki/Sec%C3%AD_stroj",
    "externalLabel": "Wikipedia",
    "faq": [
      {
        "q": "Ako funguje pneumatický sejací stroj?",
        "a": "Pneumatický sejací stroj využíva prúdenie vzduchu na presné umiestnenie semien do pôdy."
      },
      {
        "q": "Na čo slúži pneumatický sejací stroj?",
        "a": "Slúži na presnú sejbu semien rôznych plodín, čo zvyšuje efektivitu výsevu."
      },
      {
        "q": "Aký je rozdiel medzi pneumatickým a mechanickým sejacím strojom?",
        "a": "Pneumatický sejací stroj používa vzduch, zatiaľ čo mechanický využíva pri sejbe mechanické pohyby."
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
    "faq": [
      {
        "q": "Ako funguje plečka?",
        "a": "Plečka narušuje pôdu medzi riadkami plodín, čím podporuje prevzdušnenie a ničenie burín."
      },
      {
        "q": "Na čo slúži plečka?",
        "a": "Slúži na medziriadkovú kultiváciu pôdy a na odstraňovanie burín."
      },
      {
        "q": "Aký je rozdiel medzi plečkou a rotavátorom?",
        "a": "Plečka je určená na medziriadkovú kultiváciu, zatiaľ čo rotavátor spracúva celú plochu pôdy."
      }
    ]
  },
  {
    "slug": "planetova-prevodovka",
    "term": "Planétová prevodovka",
    "alias": [
      "planetárna prevodovka",
      "epicyklická prevodovka"
    ],
    "kategorie": "pohon",
    "shortDef": "Planétová prevodovka je typ prevodového mechanizmu, ktorý na prenos krútiaceho momentu využíva planétové súkolie.",
    "longDef": "Planétová prevodovka je zložitý prevodový systém, ktorý využíva planétové súkolie. Tento mechanizmus sa skladá z centrálneho (slnečného) kolesa, planétových kolies a vonkajšieho ozubeného venca. Planétová prevodovka umožňuje efektívny prenos krútiaceho momentu a zmenu rýchlosti.\n\nVďaka kompaktnej konštrukcii a schopnosti prenášať vysoké krútiace momenty sa tento typ prevodovky široko používa v automobilovom priemysle, ťažkých strojoch a poľnohospodárskej technike.\n\nNa Slovensku sa planétové prevodovky často využívajú v traktoroch a ďalších poľnohospodárskych strojoch, kde je dôležitá spoľahlivosť a efektívny prenos výkonu.",
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
        "q": "Ako funguje planétová prevodovka?",
        "a": "Planétová prevodovka prenáša krútiaci moment pomocou súkolia, ktoré sa otáča okolo centrálneho kolesa."
      },
      {
        "q": "Na čo slúži planétová prevodovka?",
        "a": "Slúži na dosiahnutie vysokého prevodového pomeru v kompaktnom priestore."
      },
      {
        "q": "Aký je rozdiel medzi planétovou a bežnou prevodovkou?",
        "a": "Planétová prevodovka umožňuje prenášať krútiaci moment a meniť rýchlosť v menšom priestore než bežná prevodovka."
      }
    ]
  },
  {
    "slug": "dvouhmotovy-setrvacnik",
    "term": "Dvojhmotový zotrvačník",
    "alias": [
      "DMF",
      "dvojhmotový zotrvačník"
    ],
    "kategorie": "pohon",
    "shortDef": "Dvojhmotový zotrvačník je zariadenie určené na tlmenie vibrácií v pohonných systémoch.",
    "longDef": "Dvojhmotový zotrvačník (DMF) je zložitý mechanický prvok, ktorý pomáha tlmiť vibrácie a rázy v pohonnom systéme vozidiel. Skladá sa z dvoch zotrvačných hmôt spojených pružinovým systémom, ktorý vibrácie pohlcuje a tlmí.\n\nPoužitie dvojhmotového zotrvačníka zlepšuje komfort jazdy, znižuje hluk a predlžuje životnosť prevodovky a ďalších súčastí pohonného systému. Je obzvlášť dôležitý pri vozidlách s manuálnou prevodovkou.\n\nNa Slovensku sa dvojhmotové zotrvačníky bežne používajú v automobilovom priemysle, najmä v osobných a ľahkých úžitkových vozidlách, kde sa kladie dôraz na komfort a efektivitu pohonu.",
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
        "q": "Ako funguje dvojhmotový zotrvačník?",
        "a": "Dvojhmotový zotrvačník tlmí vibrácie motora pomocou dvoch navzájom nezávislých hmôt spojených pružinami."
      },
      {
        "q": "Na čo slúži dvojhmotový zotrvačník?",
        "a": "Slúži na tlmenie vibrácií a znižovanie hluku v pohonnom systéme vozidla."
      },
      {
        "q": "Aký je rozdiel medzi dvojhmotovým a klasickým zotrvačníkom?",
        "a": "Dvojhmotový zotrvačník vďaka svojej konštrukcii lepšie tlmí vibrácie, zatiaľ čo klasický je jednoduchší a lacnejší."
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
    "faq": [
      {
        "q": "Ako funguje load-sensing hydraulika?",
        "a": "Load-sensing hydraulika sníma tlakový rozdiel a prispôsobuje prietok oleja aktuálnym potrebám systému."
      },
      {
        "q": "Aké sú výhody load-sensing systému?",
        "a": "Medzi výhody patrí úspora energie, menšie opotrebenie komponentov a vyššia efektivita hydraulického systému."
      }
    ]
  },
  {
    "slug": "intercooler",
    "term": "Intercooler (medzichladič)",
    "alias": [
      "medzichladič"
    ],
    "kategorie": "pohon",
    "shortDef": "Intercooler je zariadenie, ktoré ochladzuje stlačený vzduch medzi turbodúchadlom a motorom.",
    "longDef": "Intercooler, známy aj ako medzichladič, je zariadenie používané v preplňovaných motoroch na ochladenie vzduchu stlačeného turbodúchadlom alebo kompresorom. Ochladený vzduch má vyššiu hustotu, čo zvyšuje účinnosť spaľovania a výkon motora.\n\nIntercooler je zvyčajne umiestnený medzi turbodúchadlom a sacím potrubím motora. Jeho hlavnou funkciou je znížiť teplotu vzduchu, čo pomáha predchádzať klepaniu motora a predlžuje jeho životnosť.\n\nV poľnohospodárskych strojoch sa intercoolery používajú na optimalizáciu výkonu motorov, čo je dôležité pre efektívnu prevádzku pri vysokom zaťažení. Na Slovensku sú bežnou súčasťou moderných traktorov a zberových strojov.",
    "related": [
      "vgt-turbo",
      "cvt-prevodovka",
      "common-rail",
      "emisni-normy-stage"
    ],
    "externalUrl": "https://cs.wikipedia.org/wiki/Mezichladi%C4%8D",
    "externalLabel": "Wikipedia",
    "faq": [
      {
        "q": "Na čo slúži intercooler?",
        "a": "Intercooler slúži na ochladzovanie stlačeného vzduchu z turbodúchadla, čo zvyšuje účinnosť motora."
      },
      {
        "q": "Aký je rozdiel medzi vzduchovým a vodným intercoolerom?",
        "a": "Vzduchový intercooler využíva na chladenie okolitý vzduch, zatiaľ čo vodný intercooler používa chladiacu kvapalinu."
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
    "shortDef": "Variabilná geometria turba umožňuje optimalizovať výkon turbodúchadla v širokom rozsahu otáčok motora.",
    "longDef": "Variabilná geometria turba (VGT) je technológia používaná v turbodúchadlách, ktorá umožňuje meniť uhol lopatiek turbodúchadla v závislosti od otáčok motora. Tým sa optimalizuje tlak a prietok vzduchu, čo zlepšuje výkon a účinnosť motora.\n\nVGT zabezpečuje lepšiu odozvu motora pri nízkych otáčkach a vyšší výkon pri vysokých otáčkach. Táto technológia je obzvlášť užitočná v poľnohospodárskych strojoch, kde treba rýchlo reagovať na zmeny zaťaženia.\n\nNa Slovensku sa VGT bežne používa v moderných traktoroch a zberových strojoch, kde prispieva k efektívnemu využitiu paliva a zníženiu emisií.",
    "related": [
      "intercooler",
      "common-rail",
      "emisni-normy-stage",
      "auto-steering"
    ],
    "faq": [
      {
        "q": "Ako funguje variabilná geometria turba?",
        "a": "Variabilná geometria turba mení uhol lopatiek v turbodúchadle, aby optimalizovala prietok výfukových plynov."
      },
      {
        "q": "Aké sú výhody VGT oproti tradičnému turbu?",
        "a": "VGT ponúka lepšiu odozvu motora a vyššiu účinnosť v širokom rozsahu otáčok."
      }
    ]
  },
  {
    "slug": "posilovac-rizeni",
    "term": "Hydraulický posilňovač riadenia",
    "alias": [
      "posilňovač riadenia"
    ],
    "kategorie": "pohon",
    "shortDef": "Hydraulický posilňovač riadenia uľahčuje ovládanie vozidiel, pretože znižuje silu potrebnú na otáčanie volantom.",
    "longDef": "Hydraulický posilňovač riadenia je systém, ktorý využíva hydraulický tlak na uľahčenie riadenia vozidiel. Znižuje fyzickú námahu potrebnú na otáčanie volantom, čo je obzvlášť užitočné pri ťažkých poľnohospodárskych strojoch.\n\nHydraulické čerpadlo poháňané motorom vytvára tlak, ktorý pomáha otáčať volantom. To umožňuje jednoduchšie manévrovanie a zvyšuje komfort obsluhy.\n\nNa Slovensku je hydraulický posilňovač riadenia štandardnou výbavou väčšiny moderných traktorov a poľnohospodárskych strojov, čo prispieva k efektivite a bezpečnosti pri práci na poli.",
    "related": [
      "load-sensing",
      "cvt-prevodovka",
      "auto-steering",
      "teleskopicky-manipulator"
    ],
    "externalUrl": "https://cs.wikipedia.org/wiki/Posilova%C4%8D_%C5%99%C3%ADzen%C3%AD",
    "externalLabel": "Wikipedia",
    "faq": [
      {
        "q": "Ako funguje hydraulický posilňovač riadenia?",
        "a": "Hydraulický posilňovač riadenia využíva tlak oleja na uľahčenie otáčania volantom."
      },
      {
        "q": "Aké sú výhody hydraulického posilňovača riadenia?",
        "a": "Medzi výhody patrí menšia fyzická námaha vodiča a lepšia ovládateľnosť vozidla."
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
    "longDef": "Predný vývodový hriadeľ (PTO) je mechanický prvok traktora, ktorý umožňuje prenos výkonu na predné prídavné zariadenia, ako sú kosačky alebo snehové frézy. Tento hriadeľ zvyšuje univerzálnosť traktora a umožňuje efektívne využitie rôznych nástrojov.\n\nPredný PTO je zvyčajne poháňaný motorom traktora a dá sa podľa potreby zapínať a vypínať. To umožňuje flexibilné použitie rôznych nástrojov bez potreby meniť základnú konfiguráciu traktora.\n\nNa Slovensku sa predný vývodový hriadeľ bežne využíva v poľnohospodárstve a komunálnych službách, kde prispieva k efektivite a produktivite práce.",
    "related": [
      "load-sensing",
      "teleskopicky-manipulator",
      "celni-nakladac",
      "auto-steering"
    ],
    "faq": [
      {
        "q": "Na čo slúži predný vývodový hriadeľ?",
        "a": "Predný vývodový hriadeľ prenáša výkon z traktora na predné prídavné zariadenia, ako sú kosačky alebo snehové frézy."
      },
      {
        "q": "Aký je rozdiel medzi predným a zadným vývodovým hriadeľom?",
        "a": "Predný vývodový hriadeľ je umiestnený v prednej časti traktora, zatiaľ čo zadný je vzadu. Výkon oboch hriadeľov závisí od konštrukcie traktora."
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
    "shortDef": "Smykovanie je plytká operácia spracovania pôdy: po poli sa ťahá smyk, ktorý urovná povrch po orbe, rozdrví a zatlačí hrudy a zničí klíčiace buriny.",
    "longDef": "Smykovanie je poľnohospodárska operácia pri spracovaní pôdy. Za traktorom sa po poli vlečie **smyk** — náradie z dosiek, koľajníc alebo prstencov, ktoré sa do pôdy nezarezáva, ale kĺže po povrchu. Smyk zarovná hrebene a brázdy po orbe, rozdrví a zatlačí hrudy, plytko prekyprí povrch a zničí klíčiace buriny.\n\nNajčastejšie sa smykuje **na jar na jesennú orbu**, keď pôda obschne natoľko, že sa nemaže. Urovnaný a uzavretý povrch menej vysychá a vzniká základ sejbového lôžka pre jariny. Smyk sa často spája s bránami do jednej súpravy a je prvým krokom predsejbovej prípravy.\n\nAko samostatná operácia dnes smykovanie ustupuje: urovnanie povrchu zabezpečuje predná smyková lišta kompaktorov a kombinátorov, ktoré v jednom prejazde urovnajú, prekypria aj utlačia povrch.\n\nPozor na zámenu: šmyk v doprave znamená stratu priľnavosti kolies. Keď sa kolesá traktora pri ťahu pretáčajú, hovorí sa tomu **preklz**, nie smykovanie.",
    "related": [
      "orba",
      "predsetova-priprava",
      "setove-luzko",
      "valeni",
      "kompaktomat"
    ],
    "externalUrl": "https://cs.wikipedia.org/wiki/Smykov%C3%A1n%C3%AD",
    "externalLabel": "Wikipedia (po česky): Smykování",
    "faq": [
      {
        "q": "Kedy sa smykuje?",
        "a": "Hlavne na jar na jesennú orbu, keď pôda obschne natoľko, že sa nemaže a nelepí na náradie. Smykuje sa plytko, pred ďalšou prípravou pôdy na sejbu."
      },
      {
        "q": "Čím sa smykovanie líši od bránenia?",
        "a": "Smyk nemá zuby, ktoré by zachádzali do pôdy — povrch hlavne urovnáva a hrudy drví a zatláča. Brány pôdu zubami prekyprujú. Často sa oba nástroje spájajú do jednej súpravy."
      }
    ]
  },
  {
    "slug": "valeni",
    "term": "Valcovanie",
    "kategorie": "agrotechnika",
    "shortDef": "Valcovanie je agrotechnická operácia, ktorou sa po sejbe utužuje povrch pôdy.",
    "longDef": "Valcovanie je proces, pri ktorom sa pomocou valcov utužuje povrch pôdy. Táto operácia sa vykonáva po sejbe, aby sa zabezpečil lepší kontakt semien s pôdou a podporila klíčivosť. Valcovanie tiež pomáha urovnať povrch pôdy a zlepšiť kapilaritu, čo uľahčuje prístup vody k semenám.\n\nV praxi sa používajú rôzne typy valcov vrátane hladkých, prstových alebo prstencových, v závislosti od typu pôdy a plodín. Valcovanie je dôležité najmä na ľahkých a piesočnatých pôdach, kde pomáha zabrániť stratám vlhkosti.\n\nNa Slovensku je valcovanie bežnou súčasťou agrotechnických postupov, najmä pri pestovaní obilnín a ďalších plodín, ktoré na optimálny rast vyžadujú rovnomerný povrch pôdy.",
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
        "q": "Na čo slúži valcovanie pôdy?",
        "a": "Valcovanie slúži na utuženie povrchu pôdy po sejbe, čím sa zlepšuje kontakt semien s pôdou a zabezpečuje rovnomerné vzchádzanie."
      },
      {
        "q": "Kedy sa valcovanie pôdy vykonáva?",
        "a": "Valcovanie sa vykonáva po sejbe, keď treba zlepšiť kontakt semien s pôdou."
      }
    ],
    "alias": []
  },
  {
    "slug": "vysevek",
    "term": "Výsevok",
    "kategorie": "agrotechnika",
    "shortDef": "Výsevok je množstvo osiva použitého na jednotku plochy pri siatí.",
    "longDef": "Výsevok označuje množstvo osiva, ktoré sa vyseje na určitú plochu, zvyčajne vyjadrené v kilogramoch na hektár. Správne určenie výsevku je kľúčové pre dosiahnutie optimálnej hustoty porastu, a tým aj maximálneho výnosu.\n\nVýsevok sa líši podľa druhu plodiny, pôdnych a klimatických podmienok. Napríklad obilniny majú zvyčajne vyšší výsevok než olejniny. Výsevok ovplyvňuje aj kvalita osiva a jeho klíčivosť.\n\nNa Slovensku sa odporúčané výsevky líšia podľa regiónu a typu pôdy, pričom poľnohospodári často využívajú odporúčania agronomických poradcov alebo výsledky pokusov z výskumných staníc.",
    "related": [
      "setove-luzko",
      "predsetova-priprava",
      "pneumaticky-seci-stroj",
      "osevni-postup"
    ],
    "faq": [
      {
        "q": "Ako sa počíta výsevok?",
        "a": "Výsevok sa počíta ako množstvo osiva potrebného na jednotku plochy, zvyčajne v kg/ha."
      },
      {
        "q": "Prečo je dôležitý správny výsevok?",
        "a": "Správny výsevok zabezpečuje optimálnu hustotu porastu, ktorá ovplyvňuje výnos a kvalitu úrody."
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
    "externalUrl": "https://cs.wikipedia.org/wiki/Kyp%C5%99en%C3%AD",
    "externalLabel": "Wikipedia",
    "faq": [
      {
        "q": "Na čo slúži hĺbkové kyprenie?",
        "a": "Hĺbkové kyprenie zlepšuje štruktúru pôdy a jej prevzdušnenie, čo podporuje rast koreňov."
      },
      {
        "q": "Aký je rozdiel medzi hĺbkovým kyprením a orbou?",
        "a": "Hĺbkové kyprenie prevzdušňuje pôdu bez jej obracania, zatiaľ čo pri orbe sa pôda obracia."
      }
    ],
    "alias": []
  },
  {
    "slug": "predsetova-priprava",
    "term": "Predsejbová príprava",
    "kategorie": "agrotechnika",
    "shortDef": "Predsejbová príprava je súbor operácií zameraných na úpravu pôdy pred sejbou.",
    "longDef": "Predsejbová príprava zahŕňa rôzne agrotechnické operácie, ktoré pripravujú pôdu na sejbu plodín. Cieľom je vytvoriť optimálne podmienky na klíčenie semien a rast mladých rastlín.\n\nTento proces môže zahŕňať kyprenie, urovnanie povrchu, odstránenie burín a zabezpečenie správnej štruktúry pôdy. Využívajú sa rôzne nástroje a stroje, ako sú pluhy, kompaktory a valce.\n\nNa Slovensku je predsejbová príprava kľúčovou súčasťou poľnohospodárskych postupov, pričom jej konkrétna podoba sa líši podľa typu plodiny, pôdnych a klimatických podmienok.",
    "related": [
      "setove-luzko",
      "valeni",
      "diskovy-podmitac",
      "hloubkove-kypreni"
    ],
    "faq": [
      {
        "q": "Čo zahŕňa predsejbová príprava pôdy?",
        "a": "Predsejbová príprava zahŕňa operácie ako orba, bránenie a valcovanie, ktorými sa vytvára optimálne sejbové lôžko."
      },
      {
        "q": "Prečo je dôležitá predsejbová príprava?",
        "a": "Zabezpečuje správnu štruktúru pôdy na klíčenie semien a ich ďalší rast."
      }
    ],
    "alias": []
  },
  {
    "slug": "setove-luzko",
    "term": "Sejbové lôžko",
    "kategorie": "agrotechnika",
    "shortDef": "Sejbové lôžko je pripravený povrch pôdy, do ktorého sa vysievajú semená.",
    "longDef": "Sejbové lôžko je špeciálne pripravená vrstva pôdy, ktorá poskytuje optimálne podmienky na klíčenie a rast semien. Jeho kvalita je kľúčová pre rovnomerné a rýchle vzchádzanie plodín.\n\nPríprava sejbového lôžka zahŕňa urovnanie povrchu, odstránenie hrúd a zabezpečenie správnej štruktúry pôdy. Dôležitá je aj kontrola vlhkosti a teploty pôdy, ktoré ovplyvňujú klíčivosť.\n\nNa Slovensku je príprava sejbového lôžka štandardnou praxou v poľnohospodárstve, pričom sa používajú rôzne techniky a nástroje podľa typu plodiny a pôdnych podmienok.",
    "related": [
      "predsetova-priprava",
      "valeni",
      "utuzeni-pudy",
      "vysevek"
    ],
    "faq": [
      {
        "q": "Ako sa pripravuje sejbové lôžko?",
        "a": "Sejbové lôžko sa pripravuje operáciami ako orba, bránenie a valcovanie, aby bolo rovnomerné a dobre utužené."
      },
      {
        "q": "Prečo je dôležité sejbové lôžko?",
        "a": "Zabezpečuje optimálne podmienky na klíčenie semien a rast rastlín."
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
    "externalUrl": "https://cs.wikipedia.org/wiki/Kapilarita",
    "externalLabel": "Wikipedia",
    "faq": [
      {
        "q": "Čo je kapilarita pôdy?",
        "a": "Kapilarita pôdy je schopnosť pôdy prenášať vodu v jemných póroch proti gravitácii."
      },
      {
        "q": "Ako kapilarita ovplyvňuje poľnohospodárstvo?",
        "a": "Kapilarita ovplyvňuje dostupnosť vody pre rastliny, a tým aj ich rast."
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
    "longDef": "Mineralizácia organickej hmoty je biologický proces, pri ktorom mikroorganizmy rozkladajú organické látky v pôde na anorganické formy, ako sú oxid uhličitý, voda a minerálne živiny. Tento proces je kľúčový pre uvoľňovanie živín, ktoré sú nevyhnutné pre rast rastlín.\n\nV poľnohospodárstve je mineralizácia dôležitá pre udržanie úrodnosti pôdy a zabezpečenie dostupnosti živín pre plodiny. Rýchlosť mineralizácie závisí od faktorov, ako sú teplota, vlhkosť a typ pôdy.\n\nV slovenskom poľnohospodárstve sa mineralizácia sleduje ako súčasť hodnotenia pôdnej úrodnosti, a to najmä v súvislosti s aplikáciou organických hnojív a kompostov.",
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
        "q": "Čo je mineralizácia pôdy?",
        "a": "Mineralizácia pôdy je proces, pri ktorom sa organické látky rozkladajú na anorganické formy, ako sú minerálne živiny."
      },
      {
        "q": "Ako prebieha mineralizácia organickej hmoty?",
        "a": "Mineralizácia prebieha za účasti mikroorganizmov, ktoré rozkladajú organické látky v pôde."
      },
      {
        "q": "Prečo je mineralizácia dôležitá?",
        "a": "Mineralizácia je kľúčová pre uvoľňovanie živín, ktoré sú nevyhnutné pre rast rastlín."
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
    "externalUrl": "https://cs.wikipedia.org/wiki/Zhut%C5%88ov%C3%A1n%C3%AD_p%C5%AFd",
    "externalLabel": "Wikipedia",
    "faq": [
      {
        "q": "Čo spôsobuje utuženie pôdy?",
        "a": "Utuženie pôdy spôsobuje mechanické zaťaženie, napríklad ťažká technika alebo nadmerné prejazdy."
      },
      {
        "q": "Aké sú dôsledky utuženia pôdy?",
        "a": "Utuženie pôdy znižuje jej priepustnosť pre vodu a vzduch, čo môže negatívne ovplyvniť rast rastlín."
      },
      {
        "q": "Ako možno zabrániť utuženiu pôdy?",
        "a": "Utuženiu možno predchádzať obmedzením ťažkej techniky a vhodnými agrotechnickými postupmi."
      }
    ]
  },
  {
    "slug": "zelene-hnojeni",
    "term": "Zelené hnojenie",
    "alias": [
      "zelené hnojivo"
    ],
    "kategorie": "agrotechnika",
    "shortDef": "Zelené hnojenie je agrotechnická metóda využívajúca rastliny na obohatenie pôdy o organickú hmotu a živiny.",
    "longDef": "Zelené hnojenie je metóda, pri ktorej sa pestujú špecifické rastliny, ktoré sa následne zaorávajú do pôdy, aby sa zlepšila jej štruktúra a obohatila sa o organickú hmotu a živiny. Medzi bežne používané plodiny patrí facélia, ďatelina a lupina.\n\nTáto metóda zvyšuje obsah organickej hmoty v pôde, zlepšuje jej štruktúru a zvyšuje biologickú aktivitu. Zelené hnojenie tiež pomáha v boji proti erózii a zlepšuje schopnosť pôdy zadržiavať vodu.\n\nNa Slovensku je zelené hnojenie súčasťou udržateľných poľnohospodárskych praktík a je podporované v rámci ekologických programov a dotácií.",
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
        "q": "Čo je zelené hnojenie?",
        "a": "Zelené hnojenie je metóda, pri ktorej sa pestujú rastliny, ktoré sa následne zaorú do pôdy, aby sa zlepšila jej kvalita."
      },
      {
        "q": "Aké rastliny sa používajú na zelené hnojenie?",
        "a": "Na zelené hnojenie sa často používajú rastliny ako lupina, lucerna alebo horčica."
      },
      {
        "q": "Aké sú výhody zeleného hnojenia?",
        "a": "Zelené hnojenie zvyšuje obsah organickej hmoty v pôde a zlepšuje jej štruktúru."
      }
    ]
  },
  {
    "slug": "strniste",
    "term": "Strnisko",
    "kategorie": "agrotechnika",
    "shortDef": "Strnisko tvoria zvyšky stoniek a koreňov plodín, ktoré zostanú na poli po zbere.",
    "longDef": "Strnisko je časť rastlín, ktorá zostáva na poli po zbere plodín. Zvyčajne zahŕňa stonky, korene a niekedy aj malé časti listov. Strnisko môže slúžiť ako ochrana pôdy proti erózii a pomáha udržiavať vlhkosť.\n\nV poľnohospodárstve je strnisko často využívané ako mulč alebo je zaorávané do pôdy, čím sa zvyšuje obsah organickej hmoty a zlepšuje štruktúra pôdy. Strnisko tiež poskytuje úkryt pre drobné živočíchy a podporuje biodiverzitu.\n\nNa Slovensku je zachovanie strniska na poli často súčasťou udržateľných poľnohospodárskych praktík a je podporované v rámci rôznych agrotechnických programov.",
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
        "q": "Čo je strnisko?",
        "a": "Strnisko tvoria zvyšky stoniek a koreňov plodín, ktoré zostávajú na poli po zbere."
      },
      {
        "q": "Ako sa strnisko využíva?",
        "a": "Strnisko sa môže zaorať, čím sa zlepší pôdna štruktúra a zvýši obsah organickej hmoty."
      },
      {
        "q": "Prečo je dôležité ponechať strnisko na poli?",
        "a": "Ponechané strnisko pomáha chrániť pôdu pred eróziou a zlepšuje jej úrodnosť."
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
        "q": "Čo je superfosfát?",
        "a": "Superfosfát je fosforečné hnojivo vyrábané z fosfátovej horniny a kyseliny sírovej."
      },
      {
        "q": "Ako sa používa superfosfát?",
        "a": "Superfosfát sa aplikuje do pôdy na zvýšenie obsahu fosforu, ktorý je kľúčový pre rast rastlín."
      },
      {
        "q": "Aké sú výhody použitia superfosfátu?",
        "a": "Superfosfát zlepšuje rast koreňov a celkovú vitalitu rastlín."
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
    "longDef": "Draselná soľ, známa aj ako chlorid draselný (KCl), je minerálne hnojivo používané na dodanie draslíka, ktorý je nevyhnutný pre rast rastlín, zlepšenie odolnosti voči stresu a zvýšenie výnosov.\n\nAplikácia draselnej soli pomáha zlepšiť kvalitu plodín, podporuje fotosyntézu a zvyšuje odolnosť rastlín voči chorobám a nepriaznivým podmienkam. Draslík je kľúčový pre reguláciu vodného režimu rastlín.\n\nNa Slovensku je draselná soľ široko používaná ako súčasť hnojivových plánov, najmä na pôdach s nízkym obsahom draslíka. Je aplikovaná pred siatím alebo počas vegetácie.",
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
        "q": "Čo je draselná soľ?",
        "a": "Draselná soľ je minerálne hnojivo obsahujúce draslík vo forme chloridu draselného."
      },
      {
        "q": "Ako sa používa draselná soľ?",
        "a": "Draselná soľ sa používa na dodanie draslíka do pôdy, ktorý je nevyhnutný pre rast a vývoj rastlín."
      },
      {
        "q": "Aké sú výhody draselnej soli?",
        "a": "Draselná soľ zlepšuje odolnosť rastlín voči stresu a zvyšuje kvalitu plodov."
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
    "faq": [
      {
        "q": "Na čo slúži kalimagnesia?",
        "a": "Kalimagnesia sa používa na dodanie draslíka a horčíka do pôdy, čo podporuje rast rastlín."
      },
      {
        "q": "Ako sa kalimagnesia aplikuje?",
        "a": "Aplikuje sa rozhadzovaním na povrch pôdy, zvyčajne pred sejbou alebo sadením."
      },
      {
        "q": "Aký je rozdiel medzi kalimagnesiou a draselnou soľou?",
        "a": "Kalimagnesia obsahuje navyše horčík, zatiaľ čo draselná soľ obsahuje len draslík."
      }
    ]
  },
  {
    "slug": "dolomiticky-vapenec",
    "term": "Dolomitický vápenec",
    "kategorie": "hnojivo",
    "shortDef": "Dolomitický vápenec je prírodné hnojivo obsahujúce vápnik a horčík.",
    "longDef": "Dolomitický vápenec je prírodný minerál, ktorý sa používa ako hnojivo na zlepšenie pôdnej štruktúry a pH. Obsahuje vápnik a horčík, ktoré sú kľúčové pre zdravý rast rastlín.\n\nToto hnojivo zvyšuje pH kyslých pôd, čo zlepšuje dostupnosť živín pre rastliny. Horčík v dolomitickom vápenci podporuje fotosyntézu a celkový metabolizmus rastlín.\n\nNa Slovensku sa dolomitický vápenec používa najmä na kyslých pôdach, kde pomáha zlepšiť štruktúru pôdy a podporiť rast plodín.",
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
        "q": "Na čo sa používa dolomitický vápenec?",
        "a": "Používa sa na zlepšenie pôdnej štruktúry a zvýšenie pH kyslých pôd."
      },
      {
        "q": "Ako sa dolomitický vápenec aplikuje?",
        "a": "Aplikuje sa rozhadzovaním alebo zapracovaním do pôdy, zvyčajne na jeseň."
      },
      {
        "q": "Aký je rozdiel medzi dolomitickým vápencom a bežným vápencom?",
        "a": "Dolomitický vápenec obsahuje okrem vápnika aj horčík."
      }
    ],
    "alias": []
  },
  {
    "slug": "digestat",
    "term": "Digestát",
    "kategorie": "hnojivo",
    "shortDef": "Digestát je organické hnojivo vznikajúce ako vedľajší produkt bioplynových staníc.",
    "longDef": "Digestát je organické hnojivo, ktoré vzniká ako vedľajší produkt pri anaeróbnej digescii v bioplynových staniciach. Obsahuje cenné živiny, ako sú dusík, fosfor a draslík, a využíva sa na zlepšenie pôdnej úrodnosti.\n\nPoužíva sa ako alternatívny zdroj živín pre rastliny, čo môže znížiť potrebu syntetických hnojív. Digestát sa aplikuje na pole pomocou rozmetadiel, cisterien alebo injektážou do pôdy, ktorá je často uprednostňovanou metódou, pretože znižuje emisie amoniaku.\n\nNa Slovensku je používanie digestátu regulované, aby sa zabránilo nadmernému hnojeniu a chránili sa vodné zdroje.",
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
        "q": "Na čo slúži digestát?",
        "a": "Digestát slúži ako organické hnojivo bohaté na živiny, ktoré zlepšuje úrodnosť pôdy."
      },
      {
        "q": "Ako sa digestát aplikuje?",
        "a": "Aplikuje sa na pole pomocou rozmetadiel, cisterien alebo injektážou do pôdy."
      },
      {
        "q": "Aký je rozdiel medzi digestátom a kompostom?",
        "a": "Digestát je tekutý a vzniká v bioplynových staniciach, zatiaľ čo kompost je pevný a vzniká rozkladom organického materiálu."
      }
    ],
    "alias": []
  },
  {
    "slug": "kejda",
    "term": "Hnojovica",
    "kategorie": "hnojivo",
    "shortDef": "Hnojovica (kejda) je tekuté organické hnojivo, ktoré vzniká pri chove hospodárskych zvierat.",
    "longDef": "Hnojovica je tekuté organické hnojivo, ktoré vzniká ako zmes exkrementov hospodárskych zvierat a vody. Obsahuje dôležité živiny, ako sú dusík, fosfor a draslík, a využíva sa na zlepšenie úrodnosti pôdy.\n\nHnojovica sa aplikuje pomocou cisterien alebo špeciálnych rozmetadiel, a to buď pred sejbou, alebo počas vegetačného obdobia. Prispieva k udržaniu organickej hmoty v pôde a podporuje mikrobiálnu aktivitu.\n\nNa Slovensku je používanie hnojovice regulované, aby sa minimalizovalo riziko znečistenia vodných zdrojov a zabránilo sa nadmernému hnojeniu.",
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
        "q": "Na čo sa používa hnojovica?",
        "a": "Hnojovica sa používa ako organické hnojivo na zlepšenie pôdnej úrodnosti."
      },
      {
        "q": "Ako sa hnojovica aplikuje?",
        "a": "Aplikuje sa na pole cisternami s rozstrekovačmi."
      },
      {
        "q": "Aký je rozdiel medzi hnojovicou a hnojom?",
        "a": "Hnojovica je tekutá, zatiaľ čo hnoj je pevný a obsahuje podstielku."
      }
    ],
    "alias": [
      "kejda"
    ]
  },
  {
    "slug": "hnuj",
    "term": "Hnoj (maštaľný)",
    "alias": [
      "maštaľný hnoj",
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
        "q": "Na čo slúži hnoj?",
        "a": "Hnoj slúži ako organické hnojivo, ktoré zlepšuje štruktúru a úrodnosť pôdy."
      },
      {
        "q": "Ako sa hnoj aplikuje?",
        "a": "Aplikuje sa rozhadzovaním na pole a následne sa zapracuje do pôdy."
      },
      {
        "q": "Aký je rozdiel medzi hnojom a kompostom?",
        "a": "Hnoj je čerstvý organický materiál, zatiaľ čo kompost je rozložený a stabilizovaný."
      }
    ]
  },
  {
    "slug": "kostni-moucka",
    "term": "Kostná múčka",
    "kategorie": "hnojivo",
    "shortDef": "Kostná múčka je organické hnojivo bohaté na fosfor a vápnik.",
    "longDef": "Kostná múčka je organické hnojivo vyrobené z rozdrvených kostí, ktoré je bohaté na fosfor a vápnik. Tieto živiny sú kľúčové pre rast a vývoj rastlín, najmä pre tvorbu koreňového systému a kvetov.\n\nPoužíva sa predovšetkým v záhradách a v poľnohospodárstve na podporu rastu plodín s vysokou potrebou fosforu. Aplikácia sa vykonáva pred sejbou alebo počas vegetačného obdobia.\n\nNa Slovensku je kostná múčka obľúbená najmä v ekologickom poľnohospodárstve, kde sa využíva ako prírodný zdroj fosforu bez chemických prísad.",
    "related": [
      "hnuj",
      "organicka-hmota",
      "superfosfat",
      "npk-hnojivo"
    ],
    "faq": [
      {
        "q": "Na čo sa používa kostná múčka?",
        "a": "Kostná múčka sa používa ako hnojivo bohaté na fosfor a vápnik."
      },
      {
        "q": "Ako sa kostná múčka aplikuje?",
        "a": "Aplikuje sa rozhadzovaním na povrch pôdy alebo ako prísada do kompostu."
      },
      {
        "q": "Aký je rozdiel medzi kostnou múčkou a fosfátovými hnojivami?",
        "a": "Kostná múčka je organického pôvodu, zatiaľ čo fosfátové hnojivá sú často syntetické."
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
        "q": "Ako sa aplikujú listové hnojivá?",
        "a": "Listové hnojivá sa aplikujú postrekom priamo na listy rastlín, zvyčajne v období rastu."
      },
      {
        "q": "Na čo slúžia listové hnojivá?",
        "a": "Listové hnojivá slúžia na rýchle dodanie živín priamo do rastliny, čo je užitočné pri nedostatku živín v pôde."
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
        "q": "Prečo je síra dôležitá pre rastliny?",
        "a": "Síra je kľúčová pre syntézu aminokyselín, enzýmov a vitamínov v rastlinách."
      },
      {
        "q": "Ako sa prejavuje nedostatok síry na rastlinách?",
        "a": "Nedostatok síry sa prejavuje žltnutím mladších listov a spomalením rastu."
      }
    ]
  },
  {
    "slug": "padli-travni",
    "term": "Múčnatka trávová",
    "alias": [
      "múčnatka obilnín"
    ],
    "kategorie": "ochrana",
    "shortDef": "Múčnatka trávová je hubové ochorenie, ktoré napáda predovšetkým obilniny a trávy.",
    "longDef": "Múčnatka trávová je hubové ochorenie spôsobené hubou Blumeria graminis, ktoré postihuje obilniny a trávy. Prejavuje sa bielym povlakom na listoch a stonkách, čo môže viesť k oslabeniu rastlín a zníženiu výnosu. Na Slovensku je múčnatka trávová bežným problémom v intenzívne pestovaných plodinách, ako je pšenica a jačmeň. Ochrana proti múčnatke zahŕňa preventívne opatrenia, ako je správna agrotechnika a použitie fungicídov.",
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
        "q": "Ako sa prejavuje múčnatka trávová?",
        "a": "Múčnatka trávová sa prejavuje bielym povlakom na listoch a stonkách rastlín."
      },
      {
        "q": "Ako sa múčnatka trávová lieči?",
        "a": "Múčnatka trávová sa lieči aplikáciou fungicídov a zlepšením podmienok na rast."
      }
    ]
  },
  {
    "slug": "hlizenka",
    "term": "Biela hniloba (Sclerotinia)",
    "alias": [
      "Sclerotinia sclerotiorum"
    ],
    "kategorie": "ochrana",
    "shortDef": "Biela hniloba je hubová choroba napádajúca široké spektrum rastlín, vrátane repky a slnečnice.",
    "longDef": "Biela hniloba, spôsobená hubou Sclerotinia sclerotiorum, je významná hubová choroba, ktorá napáda mnoho druhov rastlín, vrátane repky, slnečnice a strukovín. Prejavuje sa hnilobou stoniek a listov, čo môže viesť k výrazným stratám na výnosoch. Na Slovensku je biela hniloba zvlášť problematická v oblastiach s vlhkým klimatom. Ochrana proti tejto chorobe zahŕňa použitie fungicídov a dodržiavanie správnych osevných postupov.",
    "related": [
      "fungicidy",
      "repka-ozima",
      "osevni-postup",
      "moreni-osiva"
    ],
    "faq": [
      {
        "q": "Ako sa prejavuje biela hniloba?",
        "a": "Biela hniloba sa prejavuje hnilobou stoniek a koreňov, často s bielym myceliom."
      },
      {
        "q": "Ako sa chrániť pred bielou hnilobou?",
        "a": "Ochrana zahŕňa striedanie plodín a aplikáciu fungicídov."
      }
    ]
  },
  {
    "slug": "drepcik",
    "term": "Skočky",
    "alias": [
      "skočka"
    ],
    "kategorie": "ochrana",
    "shortDef": "Skočky sú drobné chrobáky, ktoré poškodzujú listy a stonky rastlín.",
    "longDef": "Skočky sú malé chrobáky z čeľade Chrysomelidae, ktoré sú známe svojím skákavým pohybom a poškodzovaním listov a stoniek rastlín. Sú obzvlášť nebezpečné pre mladé rastliny, kde môžu spôsobiť značné škody. Na Slovensku sú skočky bežným škodcom v plodinách, ako je repka, kapusta a ďalšie kapustovité rastliny. Ochrana proti skočkám zahŕňa použitie insekticídov a agrotechnických opatrení, ako je správna rotácia plodín.",
    "related": [
      "insekticidy",
      "repka-ozima",
      "osevni-postup",
      "predni-vyvodovy-hridel"
    ],
    "faq": [
      {
        "q": "Ako sa prejavuje poškodenie skočkami?",
        "a": "Poškodenie sa prejavuje drobnými otvormi a žerom na listoch a stonkách."
      },
      {
        "q": "Ako sa chrániť pred skočkami?",
        "a": "Ochrana zahŕňa použitie insekticídov a agrotechnických opatrení."
      }
    ]
  },
  {
    "slug": "bazlivec-kukuricny",
    "term": "Kukuričiar koreňový",
    "alias": [
      "Diabrotica virgifera"
    ],
    "kategorie": "ochrana",
    "shortDef": "Kukuričiar koreňový je škodca kukurice, ktorý spôsobuje poškodenie koreňov a znižuje výnosy.",
    "longDef": "Kukuričiar koreňový, Diabrotica virgifera, je invázny škodca, ktorý napáda kukuricu a spôsobuje významné poškodenie koreňového systému. To vedie k oslabeniu rastlín a poklesu výnosov. Na Slovensku sa tento škodca stal problémom v posledných desaťročiach, čo vyžaduje implementáciu integrovanej ochrany rastlín, vrátane použitia insekticídov a agrotechnických opatrení, ako je striedanie plodín. Efektívny manažment kukuričiara koreňového je kľúčový pre udržanie produktivity kukuričných polí.",
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
        "q": "Ako sa prejavuje poškodenie kukuričiarom koreňovým?",
        "a": "Poškodenie sa prejavuje oslabením koreňového systému a poliehaním rastlín."
      },
      {
        "q": "Ako sa chrániť pred kukuričiarom koreňovým?",
        "a": "Ochrana zahŕňa striedanie plodín a použitie insekticídov."
      }
    ]
  },
  {
    "slug": "sviluska-chmelova",
    "term": "Roztočec chmeľový",
    "alias": [
      "Tetranychus urticae",
      "červený pavúčik"
    ],
    "kategorie": "ochrana",
    "shortDef": "Roztočec chmeľový je pavúkovec spôsobujúci škody na chmeli a ďalších plodinách.",
    "longDef": "Roztočec chmeľový (Tetranychus urticae) je drobný pavúkovec, ktorý napáda listy rastlín, najmä chmeľu, a spôsobuje ich žltnutie a opadávanie. Roztočce sa živia cicaním rastlinných štiav, čo vedie k oslabeniu rastlín a zníženiu výnosu. V boji proti roztočcom sa používajú akaricídy a biologické metódy, ako je využitie dravých roztočov. V Slovenskej republike je sledovanie a ochrana pred roztočcom dôležitou súčasťou integrovanej ochrany rastlín.",
    "related": [
      "padli-travni",
      "ucinna-latka",
      "rezistence-pesticidy"
    ],
    "externalUrl": "https://cs.wikipedia.org/wiki/Svilu%C5%A1ka_chmelov%C3%A1",
    "externalLabel": "Wikipedia",
    "faq": [
      {
        "q": "Ako sa pozná napadnutie roztočcom chmeľovým?",
        "a": "Napadnutie sa prejavuje žltnutím a bronzovým sfarbením listov, ktoré môžu následne opadávať."
      },
      {
        "q": "Aká je prevencia proti roztočcovi chmeľovému?",
        "a": "Pri prevencii pomáha pravidelná kontrola rastlín a aplikácia vhodných akaricídov."
      }
    ]
  },
  {
    "slug": "molice-sklenikova",
    "term": "Molica skleníková",
    "alias": [
      "Trialeurodes vaporariorum"
    ],
    "kategorie": "ochrana",
    "shortDef": "Molica skleníková je škodca napádajúci rastliny v skleníkoch.",
    "longDef": "Molica skleníková (Trialeurodes vaporariorum) je drobný hmyz, ktorý napáda listy rastlín v skleníkoch, kde cicaním rastlinných štiav spôsobuje ich oslabenie. Tento škodca je známy svojou schopnosťou rýchlo sa množiť a prenášať vírusové choroby. Ochrana proti molici zahŕňa použitie insekticídov, biologických predátorov a preventívnych opatrení, ako je udržiavanie čistoty v skleníkoch. V Slovenskej republike je molica skleníková významným škodcom v produkcii zeleniny a okrasných rastlín.",
    "related": [
      "insekticidy",
      "ucinna-latka",
      "rezistence-pesticidy"
    ],
    "externalUrl": "https://cs.wikipedia.org/wiki/Molice_sklen%C3%ADkov%C3%A1",
    "externalLabel": "Wikipedia",
    "faq": [
      {
        "q": "Ako sa zbaviť molice skleníkovej?",
        "a": "Efektívnou metódou je použitie biologických nepriateľov, ako sú parazitické osičky."
      },
      {
        "q": "Aké rastliny napáda molica skleníková?",
        "a": "Napáda širokú škálu rastlín vrátane rajčiakov, uhoriek a okrasných rastlín."
      }
    ]
  },
  {
    "slug": "strupovitost-jablone",
    "term": "Chrastavitosť jablone",
    "alias": [
      "Venturia inaequalis"
    ],
    "kategorie": "ochrana",
    "shortDef": "Chrastavitosť jablone je hubová choroba spôsobujúca škvrny na plodoch a listoch jabloní.",
    "longDef": "Chrastavitosť jablone (Venturia inaequalis) je hubová choroba, ktorá napáda listy a plody jabloní, čím spôsobuje čierne škvrny a deformácie. Táto choroba môže výrazne znížiť kvalitu a množstvo úrody. Ochrana proti chrastavitosti zahŕňa použitie fungicídov, výber odolných odrôd a správne agrotechnické postupy. V Slovenskej republike je chrastavitosť jednou z najčastejších chorôb jabloní, a preto je jej kontrola kľúčovou súčasťou integrovanej ochrany rastlín.",
    "related": [
      "fungicidy",
      "ucinna-latka",
      "padli-travni"
    ],
    "externalUrl": "https://cs.wikipedia.org/wiki/Strupovitost_jablon%C4%9B",
    "externalLabel": "Wikipedia",
    "faq": [
      {
        "q": "Ako sa lieči chrastavitosť jablone?",
        "a": "Bežnými metódami sú použitie fungicídov a odstraňovanie napadnutých častí stromu."
      },
      {
        "q": "Ako sa prejavuje chrastavitosť na jablkách?",
        "a": "Na plodoch sa objavujú tmavé, korkovité škvrny."
      }
    ]
  },
  {
    "slug": "obalec-jablecny",
    "term": "Obaľovač jablčný",
    "alias": [
      "Cydia pomonella"
    ],
    "kategorie": "ochrana",
    "shortDef": "Obaľovač jablčný je motýľ, ktorého húsenice poškodzujú plody jabloní.",
    "longDef": "Obaľovač jablčný (Cydia pomonella) je motýľ, ktorého larvy napádajú plody jabloní, hrušiek a ďalších ovocných stromov, čím spôsobujú červivosť a straty na úrode. Ochrana proti obaľovačovi zahŕňa použitie insekticídov, feromónových lapačov a biologických metód, ako je vypúšťanie parazitických osičiek. V Slovenskej republike je obaľovač jablčný považovaný za významného škodcu v ovocinárstve, a preto je jeho sledovanie a kontrola kľúčovou súčasťou ochrany ovocných sadov.",
    "related": [
      "insekticidy",
      "ucinna-latka",
      "rezistence-pesticidy"
    ],
    "externalUrl": "https://cs.wikipedia.org/wiki/Obale%C4%8D_jable%C4%8Dn%C3%BD",
    "externalLabel": "Wikipedia",
    "faq": [
      {
        "q": "Ako sa chrániť pred obaľovačom jablčným?",
        "a": "Pri regulácii populácie pomáha použitie feromónových lapačov a insekticídov."
      },
      {
        "q": "Kedy sa obaľovač jablčný vyskytuje?",
        "a": "Dospelce sa objavujú na jar a húsenice poškodzujú plody v lete."
      }
    ]
  },
  {
    "slug": "monilie",
    "term": "Monilióza (moniliová hniloba)",
    "alias": [
      "Monilinia spp.",
      "hniloba kôstkovín"
    ],
    "kategorie": "ochrana",
    "shortDef": "Monilióza je hubová choroba napádajúca kvety a plody kôstkovín.",
    "longDef": "Monilióza je hubová choroba spôsobená hubami rodu Monilinia, ktorá napáda kvety, plody a vetvičky kôstkovín, ako sú marhule, broskyne a čerešne. Prejavuje sa hnilobou plodov, vädnutím kvetov a odumieraním vetvičiek. Ochrana proti monilióze zahŕňa použitie fungicídov, odstránenie napadnutých častí rastlín a dodržiavanie hygienických opatrení v sadoch. V Slovenskej republike je monilióza bežným problémom v produkcii kôstkovín, a preto je jej kontrola dôležitou súčasťou integrovanej ochrany rastlín.",
    "related": [
      "fungicidy",
      "ucinna-latka",
      "padli-travni"
    ],
    "externalUrl": "https://cs.wikipedia.org/wiki/Monili%C3%B3za",
    "externalLabel": "Wikipedia",
    "faq": [
      {
        "q": "Ako sa prejavuje monilióza?",
        "a": "Prejavuje sa hnilobou plodov a vädnutím kvetov a vetiev."
      },
      {
        "q": "Ako sa monilióza šíri?",
        "a": "Šíri sa spórami, ktoré prenáša vietor a dážď."
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
    "faq": [
      {
        "q": "Ako sa počíta ochranná lehota?",
        "a": "Počíta sa od poslednej aplikácie pesticídu do zberu plodiny."
      },
      {
        "q": "Prečo je ochranná lehota dôležitá?",
        "a": "Zabezpečuje, že rezíduá pesticídov pred konzumáciou klesnú na bezpečnú úroveň."
      }
    ],
    "alias": []
  },
  {
    "slug": "moreni-osiva",
    "term": "Morenie osiva",
    "alias": [
      "morenie semien"
    ],
    "kategorie": "ochrana",
    "shortDef": "Morenie osiva je proces úpravy semien chemickými alebo biologickými látkami pred výsevom.",
    "longDef": "Morenie osiva je agronomická technika, ktorá zahŕňa aplikáciu chemických alebo biologických látok na semená pred ich výsevom. Cieľom je ochrana semien a mladých rastlín pred chorobami a škodcami, čo zvyšuje klíčivosť a výnosy. V praxi sa používajú rôzne moriace prípravky, ktoré môžu obsahovať fungicídy, insekticídy alebo rastové stimulátory. Na Slovensku je morenie osiva bežnou praxou, ktorá pomáha zlepšiť zdravie plodín a efektivitu pestovania.",
    "related": [
      "ochranna-lhuta",
      "fungicidy",
      "insekticidy",
      "ucinna-latka"
    ],
    "faq": [
      {
        "q": "Prečo sa osivo morí?",
        "a": "Morenie osiva sa vykonáva na ochranu semien pred chorobami a škodcami, čo zvyšuje pravdepodobnosť úspešného klíčenia."
      },
      {
        "q": "Aké látky sa používajú pri morení osiva?",
        "a": "Používajú sa chemické látky, ako sú fungicídy a insekticídy, alebo biologické prípravky, napríklad mikroorganizmy."
      },
      {
        "q": "Aký je rozdiel medzi chemickým a biologickým morením?",
        "a": "Chemické morenie využíva syntetické látky, zatiaľ čo biologické morenie využíva prírodné organizmy alebo extrakty."
      }
    ]
  },
  {
    "slug": "adjuvant",
    "term": "Adjuvant (zmáčadlo)",
    "alias": [
      "zmáčadlo",
      "povrchovo aktívna látka"
    ],
    "kategorie": "ochrana",
    "shortDef": "Adjuvant je látka pridávaná k pesticídnym prípravkom na zvýšenie ich účinnosti.",
    "longDef": "Adjuvanty, známe aj ako zmáčadlá, sú látky pridávané k pesticídnym postrekom za účelom zvýšenia ich účinnosti. Fungujú tak, že zlepšujú priľnavosť a rozptyl postrekov na povrchu rastlín, čo vedie k lepšiemu pokrytiu a absorpcii účinnej látky. Použitie adjuvantov je bežné v poľnohospodárstve, kde pomáhajú optimalizovať aplikáciu pesticídov a znižovať ich spotrebu. Na Slovensku sú adjuvanty súčasťou integrovanej ochrany rastlín.",
    "related": [
      "ucinna-latka",
      "fungicidy",
      "herbicidy",
      "insekticidy"
    ],
    "faq": [
      {
        "q": "Na čo slúžia adjuvanty v poľnohospodárstve?",
        "a": "Adjuvanty zlepšujú účinnosť pesticídov tým, že zvyšujú ich priľnavosť a prenikanie do rastlín."
      },
      {
        "q": "Aké sú typy adjuvantov?",
        "a": "Existujú zmáčadlá, penetrátory, pufrovacie látky a ďalšie typy adjuvantov."
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
    "faq": [
      {
        "q": "Ako vzniká rezistencia voči pesticídom?",
        "a": "Rezistencia vzniká genetickými mutáciami, ktoré umožňujú škodcom prežiť aj po aplikácii pesticídov."
      },
      {
        "q": "Ako sa dá predchádzať rezistencii voči pesticídom?",
        "a": "Používaním rôznych pesticídov a integrovanými metódami ochrany rastlín."
      }
    ]
  },
  {
    "slug": "ucinna-latka",
    "term": "Účinná látka",
    "alias": [
      "aktívna zložka"
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
        "q": "Čo je účinná látka v pesticíde?",
        "a": "Účinná látka je zložka, ktorá má priamy vplyv na cieľové organizmy."
      },
      {
        "q": "Ako sa určuje účinnosť látky v pesticíde?",
        "a": "Účinnosť sa testuje v laboratórnych a poľných podmienkach."
      }
    ]
  },
  {
    "slug": "azoxystrobin",
    "term": "Azoxystrobin",
    "kategorie": "ochrana",
    "shortDef": "Azoxystrobin je širokospektrálny fungicíd používaný na ochranu plodín pred hubovými chorobami.",
    "longDef": "Azoxystrobin je fungicíd zo skupiny strobilurínov, ktorý sa používa na ochranu plodín proti širokému spektru hubových chorôb. Funguje tak, že narušuje bunkové dýchanie húb, čo vedie k ich úhynu. Azoxystrobin je aplikovaný na rôzne plodiny, vrátane obilnín, zeleniny a ovocia, a je cenený pre svoju účinnosť a relatívne nízku toxicitu pre necieľové organizmy. Na Slovensku je azoxystrobin súčasťou integrovanej ochrany rastlín a jeho použitie je regulované príslušnými predpismi.",
    "related": [
      "fungicidy",
      "ucinna-latka",
      "moreni-osiva",
      "rezistence-pesticidy"
    ],
    "externalUrl": "https://cs.wikipedia.org/wiki/Strobilurin",
    "externalLabel": "Wikipedia",
    "faq": [
      {
        "q": "Na čo sa používa azoxystrobin?",
        "a": "Azoxystrobin sa používa na ochranu plodín pred širokým spektrom hubových chorôb."
      },
      {
        "q": "Ako funguje azoxystrobin?",
        "a": "Inhibuje mitochondriálne dýchanie húb, čím zastavuje ich rast."
      }
    ],
    "alias": []
  },
  {
    "slug": "prothiokonazol",
    "term": "Prothiokonazol",
    "kategorie": "ochrana",
    "shortDef": "Prothiokonazol je fungicíd používaný na ochranu plodín pred hubovými chorobami.",
    "longDef": "Prothiokonazol je systémový fungicíd zo skupiny triazolov, ktorý sa používa na ochranu plodín pred rôznymi hubovými chorobami. Je známy svojou schopnosťou prenikať do rastlinných tkanív a poskytovať dlhodobú ochranu. Prothiokonazol je aplikovaný na širokú škálu plodín, vrátane obilnín, repky a zeleniny. Na Slovensku je jeho použitie súčasťou integrovanej ochrany rastlín a podlieha prísnym regulačným opatreniam, ktoré zabezpečujú jeho bezpečné použitie.",
    "related": [
      "fungicidy",
      "ucinna-latka",
      "moreni-osiva",
      "rezistence-pesticidy"
    ],
    "faq": [
      {
        "q": "Proti akým chorobám účinkuje prothiokonazol?",
        "a": "Prothiokonazol je účinný proti mnohým hubovým chorobám vrátane hrdzí a múčnatky."
      },
      {
        "q": "Ako sa prothiokonazol aplikuje?",
        "a": "Aplikuje sa postrekom na listy plodín."
      }
    ],
    "alias": []
  },
  {
    "slug": "jetel-lucni",
    "term": "Ďatelina lúčna",
    "alias": [
      "Trifolium pratense"
    ],
    "kategorie": "plodiny",
    "shortDef": "Ďatelina lúčna je trváca krmovina pestovaná na krmivo a zlepšenie pôdy.",
    "longDef": "Ďatelina lúčna (Trifolium pratense) je trváca rastlina z čeľade bôbovitých, bežne pestovaná ako krmovina. Je cenená pre vysoký obsah bielkovín a schopnosť fixovať dusík, čím obohacuje pôdu. Na Slovensku sa často využíva v osevných postupoch na zlepšenie pôdnej štruktúry a zvýšenie úrodnosti. Ďatelina lúčna je tiež významnou súčasťou pasienkov a lúk, kde slúži ako kvalitné krmivo pre dobytok.",
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
        "q": "Na čo slúži ďatelina lúčna?",
        "a": "Ďatelina lúčna sa používa ako krmivo pre dobytok a tiež na zlepšenie pôdnej štruktúry vďaka fixácii dusíka."
      },
      {
        "q": "Aké nároky má ďatelina lúčna na pôdu?",
        "a": "Ďatelina lúčna uprednostňuje dobre odvodnené, úrodné pôdy s neutrálnym pH."
      }
    ]
  },
  {
    "slug": "lupina",
    "term": "Lupina (vlčí bôb)",
    "alias": [
      "Lupinus"
    ],
    "kategorie": "plodiny",
    "shortDef": "Lupina je rod rastlín využívaný na produkciu krmiva a zeleného hnojenia.",
    "longDef": "Lupina, známa aj ako vlčí bôb, patrí do čeľade bôbovitých a zahŕňa niekoľko druhov rastlín, ktoré sa pestujú pre semená bohaté na bielkoviny. V poľnohospodárstve sa používa ako krmivo pre dobytok a ako zelené hnojenie vďaka schopnosti fixovať dusík. Na Slovensku je pestovanie lupiny menej časté, ale jej využitie rastie v ekologickom poľnohospodárstve pre zlepšenie pôdnej úrodnosti a ako alternatíva k sóji.",
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
        "q": "Na čo sa používa lupina?",
        "a": "Lupina sa využíva ako krmivo pre zvieratá a na zelené hnojenie."
      },
      {
        "q": "Aké sú výhody pestovania lupiny?",
        "a": "Lupina zlepšuje pôdu fixáciou dusíka a dobre znáša aj chudobné pôdy."
      }
    ]
  },
  {
    "slug": "bob-polni",
    "term": "Bôb poľný",
    "alias": [
      "Vicia faba"
    ],
    "kategorie": "plodiny",
    "shortDef": "Bôb poľný je strukovina pestovaná na potravinárske a krmné účely.",
    "longDef": "Bôb poľný (Vicia faba) je rastlina z čeľade bôbovitých, známa pre svoje veľké semená využívané v potravinárstve a ako krmivo pre zvieratá. Je cenený pre vysoký obsah bielkovín a vlákniny. Na Slovensku sa pestuje hlavne ako krmná plodina, ale jeho využitie v ľudskej výžive rastie vďaka rastúcemu záujmu o zdravú stravu a alternatívne zdroje bielkovín.",
    "related": [
      "zelene-hnojeni",
      "organicka-hmota",
      "hnuj",
      "pH-pudy"
    ],
    "externalUrl": "https://cs.wikipedia.org/wiki/Bob_obecn%C3%BD",
    "externalLabel": "Wikipedia",
    "faq": [
      {
        "q": "Aké je hlavné využitie bôbu poľného?",
        "a": "Bôb poľný sa využíva ako potravina pre ľudí aj ako krmivo pre zvieratá."
      },
      {
        "q": "Aký je rozdiel medzi bôbom poľným a fazuľou?",
        "a": "Bôb poľný je väčší a má odlišné nutričné zloženie ako fazuľa."
      }
    ]
  },
  {
    "slug": "proso",
    "term": "Proso siate",
    "alias": [
      "Panicum miliaceum"
    ],
    "kategorie": "plodiny",
    "shortDef": "Proso siate je obilnina pestovaná na potravinárske a krmné účely.",
    "longDef": "Proso siate (Panicum miliaceum) je jednoročná obilnina z čeľade lipnicovitých, známa pre svoje malé semená využívané v potravinárstve a ako krmivo. Je cenené pre svoju nenáročnosť na pôdne a klimatické podmienky, čo umožňuje jeho pestovanie aj v suchších oblastiach. Na Slovensku sa proso pestuje predovšetkým na výrobu krmív a ako surovina pre bezlepkové potraviny, čo je dôležité pre osoby s celiakiou.",
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
        "q": "Na čo sa používa proso siate?",
        "a": "Proso siate sa využíva ako potravina pre ľudí a krmivo pre zvieratá."
      },
      {
        "q": "Aké sú výhody pestovania prosa?",
        "a": "Proso je odolné voči suchu a má krátke vegetačné obdobie."
      }
    ]
  },
  {
    "slug": "cirok",
    "term": "Cirok",
    "alias": [
      "Sorghum"
    ],
    "kategorie": "plodiny",
    "shortDef": "Cirok je obilnina pestovaná na potravinárske a krmné účely.",
    "longDef": "Cirok (Sorghum) je rod rastlín z čeľade lipnicovitých, zahŕňajúci niekoľko druhov pestovaných ako obilnina pre ľudskú výživu a krmivo pre zvieratá. Je cenený pre svoju odolnosť voči suchu a schopnosť rastu v rôznych klimatických podmienkach. Na Slovensku je pestovanie ciroku menej rozšírené, ale jeho význam rastie vďaka záujmu o bezlepkové potraviny a alternatívne zdroje energie, ako je bioetanol.",
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
        "q": "Na čo slúži cirok?",
        "a": "Cirok sa využíva ako potravina, krmivo a tiež v priemysle na výrobu biopalív."
      },
      {
        "q": "Aké sú výhody pestovania ciroku?",
        "a": "Cirok je odolný voči suchu a má široké využitie."
      }
    ]
  },
  {
    "slug": "pohanka",
    "term": "Pohánka jedlá",
    "alias": [
      "Fagopyrum esculentum"
    ],
    "kategorie": "plodiny",
    "shortDef": "Pohánka jedlá je pseudoobilnina pestovaná na potravinárske účely.",
    "longDef": "Pohánka jedlá (Fagopyrum esculentum) je jednoročná rastlina z čeľade stavikrvovitých, pestovaná ako pseudoobilnina. Je cenená pre svoju nutričnú hodnotu, najmä vysoký obsah rutínu a bielkovín, a je obľúbená v bezlepkovej diéte. Na Slovensku sa pohánka tradične pestuje a konzumuje, a to najmä vo forme kaší, múky a ďalších potravinárskych výrobkov. Jej pestovanie je podporované pre jej pozitívny vplyv na pôdnu štruktúru a biodiverzitu.",
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
        "q": "Na čo slúži pohánka jedlá?",
        "a": "Pohánka sa používa ako potravina pre ľudí, známa svojimi nutričnými hodnotami."
      },
      {
        "q": "Ako sa pestuje pohánka?",
        "a": "Pohánka je nenáročná na pôdu a dobre rastie v chladnejších oblastiach."
      }
    ]
  },
  {
    "slug": "svazenka",
    "term": "Facélia vratičolistá",
    "kategorie": "plodiny",
    "shortDef": "Facélia vratičolistá je jednoročná rastlina využívaná ako zelené hnojivo.",
    "longDef": "Facélia vratičolistá (Phacelia tanacetifolia) je jednoročná rastlina z čeľade borákovitých. V poľnohospodárstve sa využíva predovšetkým ako medziplodina na zlepšenie štruktúry pôdy a obohatenie o organickú hmotu.\n\nVďaka rýchlemu rastu a schopnosti potláčať buriny je facélia obľúbená v ekologickom poľnohospodárstve. Okrem toho priťahuje opeľovače, čo podporuje biodiverzitu.\n\nNa Slovensku je facélia často využívaná v systémoch zeleného hnojenia a ako súčasť osevných postupov na zlepšenie pôdnej úrodnosti.",
    "related": [
      "zelene-hnojeni",
      "osevni-postup",
      "organicka-hmota"
    ],
    "externalUrl": "https://cs.wikipedia.org/wiki/Svazenka_vratičolistá",
    "externalLabel": "Wikipedia",
    "faq": [
      {
        "q": "Na čo slúži facélia vratičolistá?",
        "a": "Facélia vratičolistá sa používa ako zelené hnojivo na zlepšenie pôdnej štruktúry a obohatenie pôdy o živiny."
      },
      {
        "q": "Ako sa pestuje facélia vratičolistá?",
        "a": "Facélia sa vysieva na jar alebo na jeseň a je nenáročná na pôdne podmienky."
      }
    ],
    "alias": []
  },
  {
    "slug": "cizrna",
    "term": "Cícer baraní",
    "kategorie": "plodiny",
    "shortDef": "Cícer baraní je strukovina známa vysokým obsahom bielkovín a vlákniny.",
    "longDef": "Cícer baraní (Cicer arietinum) je strukovina patriaca do čeľade bôbovitých. Je cenený pre vysoký obsah bielkovín, vlákniny a ďalších živín.\n\nV poľnohospodárstve sa cícer pestuje v oblastiach s teplým a suchým podnebím. Jeho pestovanie prispieva k obohateniu pôdy o dusík vďaka symbióze s hľuzkovými baktériami.\n\nNa Slovensku je pestovanie cíceru menej rozšírené, ale jeho spotreba rastie vďaka popularite zdravej výživy.",
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
        "q": "Aký je nutričný obsah cíceru?",
        "a": "Cícer je bohatý na bielkoviny, vlákninu, vitamíny a minerály."
      },
      {
        "q": "Ako sa pripravuje cícer na varenie?",
        "a": "Cícer je potrebné pred varením namočiť na niekoľko hodín, ideálne cez noc."
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
    "faq": [
      {
        "q": "Ako sa počíta veľká dobytčia jednotka (VDJ)?",
        "a": "VDJ sa počíta podľa živej hmotnosti zvierat — 1 VDJ zodpovedá 500 kg živej hmotnosti hovädzieho dobytka. Pre jednotlivé kategórie a druhy sa používajú prepočítavacie koeficienty."
      },
      {
        "q": "Na čo slúži VDJ?",
        "a": "VDJ slúži na porovnávanie a plánovanie kapacít chovov hospodárskych zvierat."
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
        "q": "Ako sa počíta ECM mlieko?",
        "a": "ECM mlieko sa prepočítava z bežného mlieka na základe obsahu tuku a bielkovín, aby sa štandardizovala jeho energetická hodnota."
      },
      {
        "q": "Prečo sa používa ECM mlieko?",
        "a": "ECM mlieko umožňuje objektívne porovnanie produkcie mlieka medzi rôznymi plemenami a farmami."
      }
    ]
  },
  {
    "slug": "zaprahnuti",
    "term": "Zaprahnutie (státie nasucho)",
    "alias": [
      "státie nasucho"
    ],
    "kategorie": "chov",
    "shortDef": "Zaprahnutie je obdobie, keď dojnica prestáva byť dojená pred pôrodom.",
    "longDef": "Zaprahnutie, inak povedané státie nasucho, je obdobie v chove dojníc, kedy krava prestáva byť dojená približne 60 dní pred očakávaným pôrodom. Toto obdobie je dôležité pre regeneráciu mliečnej žľazy a prípravu na ďalšiu laktáciu.\n\nPočas zaprahnutia sa mení kŕmna dávka a starostlivosť o zviera, aby sa zabezpečilo jeho zdravie a optimálne podmienky pre nadchádzajúci pôrod.\n\nNa Slovensku je zaprahnutie štandardnou súčasťou manažmentu chovu dojníc, ktorá prispieva k udržaniu vysokej produkcie mlieka a zdravia zvierat.",
    "related": [
      "laktacni-krivka",
      "vykrm-skotu",
      "odchov-telat",
      "krizeni-plemen"
    ],
    "faq": [
      {
        "q": "Čo je zaprahnutie dojníc?",
        "a": "Zaprahnutie je obdobie pred pôrodom, keď dojnica prestáva byť dojená, aby sa pripravila na laktáciu."
      },
      {
        "q": "Ako dlho trvá zaprahnutie?",
        "a": "Zaprahnutie (státie nasucho) trvá zvyčajne približne 60 dní pred očakávaným pôrodom, teda zhruba osem týždňov."
      }
    ]
  },
  {
    "slug": "stelivo",
    "term": "Stelivo",
    "kategorie": "chov",
    "shortDef": "Stelivo je materiál používaný v chove zvierat na zabezpečenie pohodlia a hygieny.",
    "longDef": "Stelivo je materiál používaný v chove hospodárskych zvierat na zabezpečenie ich pohodlia a hygieny. Obvykle ide o slamu, piliny alebo špeciálne priemyselné produkty.\n\nStelivo pomáha udržiavať suché a čisté prostredie v stajniach, čo prispieva k zdraviu zvierat a znižuje riziko ochorení.\n\nNa Slovensku je voľba steliva závislá od typu chovu a dostupnosti materiálov, pričom sa čoraz viac využívajú ekologické a recyklovateľné materiály.",
    "related": [
      "hluboka-podestylka",
      "laktacni-krivka",
      "vykrm-skotu",
      "odchov-telat"
    ],
    "faq": [
      {
        "q": "Aké materiály sa používajú ako stelivo?",
        "a": "Ako stelivo sa často používa slama, piliny, piesok alebo špeciálne priemyselné materiály."
      },
      {
        "q": "Prečo je stelivo dôležité v chove zvierat?",
        "a": "Stelivo zabezpečuje pohodlie, hygienu a zdravie zvierat tým, že pohlcuje vlhkosť a znižuje riziko ochorení."
      }
    ],
    "alias": [
      "podstielka"
    ]
  },
  {
    "slug": "hluboka-podestylka",
    "term": "Hlboká podstielka",
    "alias": [
      "hlboké lože",
      "hlboké stelivo"
    ],
    "kategorie": "chov",
    "shortDef": "Hlboká podstielka je metóda ustajnenia hospodárskych zvierat na vrstve slamy alebo iného materiálu, ktorá sa pravidelne dopĺňa.",
    "longDef": "Hlboká podstielka je spôsob ustajnenia, kde sa zvieratá chovajú na vrstve slamy alebo iného organického materiálu. Tento materiál sa pravidelne dopĺňa, ale neodstraňuje, čo umožňuje jeho postupné rozkladanie a vytváranie tepla. \n\nPoužíva sa predovšetkým v chove hovädzieho dobytka a ošípaných, kde zabezpečuje komfort a teplo pre zvieratá, a zároveň prispieva k lepšej hygiene. \n\nV praxi sa hlboká podstielka často kombinuje s inými systémami ustajnenia a je obľúbená pre svoju jednoduchosť a efektivitu v menších aj stredne veľkých chovoch.",
    "related": [
      "stelivo",
      "hnuj",
      "odchov-telat",
      "vykrm-skotu"
    ],
    "faq": [
      {
        "q": "Ako sa udržiava hlboká podstielka?",
        "a": "Hlboká podstielka sa pravidelne dopĺňa čerstvým materiálom a starý sa nechá rozkladať na mieste."
      },
      {
        "q": "Na čo slúži hlboká podstielka?",
        "a": "Slúži na zabezpečenie pohodlia a tepelnej izolácie pre hospodárske zvieratá."
      },
      {
        "q": "Aký materiál sa používa na hlbokú podstielku?",
        "a": "Najčastejšie sa používa slama, ale dajú sa využiť aj piliny alebo hobliny."
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
    "faq": [
      {
        "q": "Ako sa počíta laktačná krivka?",
        "a": "Laktačná krivka sa vytvára na základe merania dennej produkcie mlieka v priebehu laktácie."
      },
      {
        "q": "Na čo slúži laktačná krivka?",
        "a": "Slúži na monitorovanie a optimalizáciu produkcie mlieka u dojníc."
      },
      {
        "q": "Aký je rozdiel medzi laktačnou krivkou a mliekovou úžitkovosťou?",
        "a": "Laktačná krivka zobrazuje priebeh produkcie mlieka, zatiaľ čo mlieková úžitkovosť je celkové množstvo mlieka za laktáciu."
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
    "faq": [
      {
        "q": "Ako sa vykonáva brakácia zvierat?",
        "a": "Brakácia sa vykonáva na základe hodnotenia zdravotného stavu a produkčných vlastností zvierat."
      },
      {
        "q": "Na čo slúži brakácia?",
        "a": "Slúži na udržanie a zlepšenie kvality chovu."
      },
      {
        "q": "Aký je rozdiel medzi brakáciou a selekciou?",
        "a": "Brakácia je vyraďovanie nevhodných zvierat, zatiaľ čo selekcia je výber najlepších jedincov na chov."
      }
    ]
  },
  {
    "slug": "vykrm-skotu",
    "term": "Výkrm hovädzieho dobytka",
    "alias": [
      "výkrm dobytka",
      "intenzívny výkrm"
    ],
    "kategorie": "chov",
    "shortDef": "Výkrm hovädzieho dobytka je proces zvyšovania hmotnosti zvierat za účelom produkcie mäsa.",
    "longDef": "Výkrm hovädzieho dobytka je zameraný na zvyšovanie hmotnosti a zlepšenie mäsovej výťažnosti zvierat. \n\nPoužívajú sa rôzne kŕmne stratégie, ktoré zahŕňajú vyváženú kŕmnu dávku s vysokým obsahom energie a bielkovín. \n\nV SR je výkrm hovädzieho dobytka dôležitou súčasťou mäsového priemyslu a je riadený pravidlami pre welfare zvierat a efektívne využitie zdrojov. Výkrm sa často vykonáva v intenzívnych podmienkach, ale aj na pastvinách.",
    "related": [
      "hluboka-podestylka",
      "odchov-telat",
      "brakace",
      "inseminace"
    ],
    "faq": [
      {
        "q": "Ako sa vykonáva výkrm hovädzieho dobytka?",
        "a": "Výkrm hovädzieho dobytka sa vykonáva prostredníctvom kontrolovanej kŕmnej dávky zameranej na zvyšovanie hmotnosti."
      },
      {
        "q": "Na čo slúži výkrm hovädzieho dobytka?",
        "a": "Slúži na produkciu mäsa a zabezpečenie ekonomickej efektivity chovu."
      },
      {
        "q": "Aký je rozdiel medzi výkrmom a chovom hovädzieho dobytka?",
        "a": "Výkrm je zameraný na zvyšovanie hmotnosti, zatiaľ čo chov zahŕňa aj reprodukciu a starostlivosť o stádo."
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
    "longDef": "Odchov teliat zahŕňa starostlivosť o teľatá od narodenia až po dosiahnutie veku, kedy sú schopné samostatne prijímať pevnú potravu. \n\nZahŕňa správnu výživu, zdravotnú starostlivosť a vhodné ustajnenie, ktoré sú kľúčové pre zdravý rast a vývoj. \n\nV SR je odchov teliat dôležitou súčasťou mliečneho aj mäsového chovu, s dôrazom na welfare zvierat a efektivitu chovu. Moderné metódy zahŕňajú napríklad používanie mliečnych náhrad a automatizovaných kŕmnych systémov.",
    "related": [
      "hluboka-podestylka",
      "laktacni-krivka",
      "vykrm-skotu",
      "brakace"
    ],
    "faq": [
      {
        "q": "Ako prebieha odchov teliat?",
        "a": "Odchov teliat zahŕňa správnu výživu, hygienu a zdravotnú starostlivosť od narodenia do odstavu."
      },
      {
        "q": "Na čo slúži odchov teliat?",
        "a": "Slúži na zabezpečenie zdravého rastu a vývoja mladých zvierat."
      },
      {
        "q": "Aký je rozdiel medzi odchovom a výkrmom teliat?",
        "a": "Odchov sa sústreďuje na rast a zdravie, zatiaľ čo výkrm na zvyšovanie hmotnosti."
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
    "shortDef": "Križovanie plemien je genetická metóda využívaná na získanie potomstva so žiaducimi vlastnosťami z rôznych plemien.",
    "longDef": "Križovanie plemien je proces, pri ktorom sa kombinujú genetické vlastnosti dvoch alebo viacerých plemien za účelom získania potomstva s lepšími produkčnými alebo adaptačnými vlastnosťami. \n\nTáto metóda sa využíva na zvýšenie odolnosti voči chorobám, zlepšenie rastu alebo produkcie mlieka. \n\nV SR je križovanie plemien bežnou praxou v chove hovädzieho dobytka, ošípaných a hydiny, a je regulované chovateľskými programami na zachovanie genetickej diverzity a zabezpečenie kvality produkcie.",
    "related": [
      "brakace",
      "inseminace",
      "odchov-telat",
      "vykrm-skotu"
    ],
    "externalUrl": "https://cs.wikipedia.org/wiki/K%C5%99%C3%AD%C5%BEen%C3%AD",
    "externalLabel": "Wikipedia",
    "faq": [
      {
        "q": "Ako sa vykonáva križovanie plemien?",
        "a": "Križovanie plemien sa vykonáva s cieľom skombinovať žiaduce vlastnosti dvoch rôznych plemien."
      },
      {
        "q": "Na čo slúži križovanie plemien?",
        "a": "Slúži na získanie potomstva s lepšími produkčnými alebo zdravotnými vlastnosťami."
      },
      {
        "q": "Aký je rozdiel medzi križovaním a čistokrvnou plemenitbou?",
        "a": "Križovanie kombinuje vlastnosti rôznych plemien, zatiaľ čo čistokrvná plemenitba zachováva genetickú líniu."
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
        "q": "Na čo slúži N-senzor?",
        "a": "N-senzor slúži na optimalizáciu dávkovania dusíkatých hnojív podľa aktuálnej potreby rastlín."
      },
      {
        "q": "Ako funguje N-senzor?",
        "a": "N-senzor meria obsah chlorofylu v rastlinách pomocou spektrálnej analýzy, čo pomáha určiť ich potrebu dusíka."
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
        "q": "Ako sa vytvára aplikačná mapa?",
        "a": "Aplikačná mapa sa vytvára na základe dát z pôdnych analýz a senzorov."
      },
      {
        "q": "Na čo slúži aplikačná mapa?",
        "a": "Slúži na variabilné dávkovanie hnojív a pesticídov na poli."
      }
    ],
    "alias": []
  },
  {
    "slug": "rtk-baze",
    "term": "RTK báza",
    "kategorie": "precise-farming",
    "shortDef": "RTK báza je referenčná stanica pre zabezpečenie vysokej presnosti GPS navigácie v poľnohospodárstve.",
    "longDef": "RTK báza je stacionárna GPS stanica, ktorá poskytuje korekčné signály pre zvýšenie presnosti polohových dát z GPS prijímačov. RTK technológia umožňuje dosiahnuť presnosť polohovania na úrovni centimetrov.\n\nV poľnohospodárstve sa RTK báza využíva pre presné riadenie strojov, ako je sejba, aplikácia hnojív a zber, čo zvyšuje efektivitu a znižuje straty. Presná navigácia umožňuje tiež lepšie využitie pôdy a zníženie prekryvov pri aplikácii.\n\nNa Slovensku je RTK technológia čoraz viac využívaná, najmä u veľkých poľnohospodárskych podnikov, ktoré investujú do precízneho poľnohospodárstva pre zvýšenie produktivity a udržateľnosti.",
    "related": [
      "n-senzor",
      "mapa-vra",
      "fmis",
      "senzor-vlhkosti-pudy"
    ],
    "faq": [
      {
        "q": "Čo je RTK báza?",
        "a": "RTK báza je referenčná stanica na zabezpečenie vysokej presnosti GPS navigácie."
      },
      {
        "q": "Aký je rozdiel medzi RTK a štandardnou GPS?",
        "a": "RTK poskytuje presnosť na centimetre, zatiaľ čo štandardná GPS na metre."
      }
    ],
    "alias": []
  },
  {
    "slug": "fmis",
    "term": "Farmársky informačný systém (FMIS)",
    "kategorie": "precise-farming",
    "shortDef": "FMIS je softvérový systém pre riadenie a optimalizáciu poľnohospodárskych operácií a zdrojov.",
    "longDef": "Farmársky informačný systém (FMIS) je komplexná softvérová platforma, ktorá integruje dáta z rôznych zdrojov, ako sú senzory, GPS a aplikačné mapy, pre efektívne riadenie poľnohospodárskych činností.\n\nFMIS umožňuje poľnohospodárom plánovať a monitorovať operácie, optimalizovať využitie zdrojov a zlepšovať rozhodovacie procesy. Systém podporuje tiež sledovanie nákladov, výnosov a dodržiavanie legislatívnych požiadaviek.\n\nNa Slovensku sa FMIS stáva dôležitým nástrojom pre moderných poľnohospodárov, ktorí sa usilujú o zvyšovanie efektivity a udržateľnosti svojich podnikov, a je často integrovaný s ďalšími technológiami precízneho poľnohospodárstva.",
    "related": [
      "n-senzor",
      "mapa-vra",
      "rtk-baze",
      "ec-pudy"
    ],
    "faq": [
      {
        "q": "Čo je FMIS?",
        "a": "FMIS je softvérový systém na riadenie a optimalizáciu poľnohospodárskych operácií a zdrojov."
      },
      {
        "q": "Aké funkcie ponúka FMIS?",
        "a": "FMIS ponúka funkcie ako plánovanie, sledovanie a analýzu poľnohospodárskych činností."
      }
    ],
    "alias": []
  },
  {
    "slug": "ec-pudy",
    "term": "Elektrická vodivosť pôdy (EC)",
    "kategorie": "precise-farming",
    "shortDef": "Elektrická vodivosť pôdy je meranie schopnosti pôdy viesť elektrický prúd, čo indikuje jej vlastnosti.",
    "longDef": "Elektrická vodivosť pôdy (EC) je indikátor, ktorý meria schopnosť pôdy viesť elektrický prúd. Toto meranie poskytuje informácie o pôdnej štruktúre, obsahu solí a vlhkosti, čo sú kľúčové faktory pre rast rastlín.\n\nV poľnohospodárstve sa meranie EC využíva na mapovanie variability pôdy na poliach, čo pomáha pri rozhodovaní o aplikácii hnojív a zavlažovaní. Vyššia EC môže indikovať vyšší obsah živín, ale aj potenciálne problémy so zasolením.\n\nNa Slovensku je meranie EC čoraz viac využívané v rámci precízneho poľnohospodárstva, kde pomáha optimalizovať poľnohospodárske postupy a zvyšovať výnosy.",
    "related": [
      "n-senzor",
      "mapa-vra",
      "senzor-vlhkosti-pudy",
      "fmis"
    ],
    "faq": [
      {
        "q": "Čo znamená elektrická vodivosť pôdy?",
        "a": "Je to meranie schopnosti pôdy viesť elektrický prúd, čo poukazuje na jej vlastnosti."
      },
      {
        "q": "Ako sa meria elektrická vodivosť pôdy?",
        "a": "Meria sa pomocou špeciálnych senzorov, ktoré zaznamenávajú prechod elektrického prúdu."
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
        "q": "Čo je senzor pôdnej vlhkosti?",
        "a": "Je to zariadenie na meranie obsahu vody v pôde."
      },
      {
        "q": "Ako funguje senzor pôdnej vlhkosti?",
        "a": "Funguje na princípe merania elektrickej vodivosti alebo kapacity pôdy."
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
    "externalUrl": "https://cs.wikipedia.org/wiki/Pa%C5%99%C3%AD%C5%BEsk%C3%A1_burza",
    "externalLabel": "Wikipedia",
    "faq": [
      {
        "q": "Čo je MATIF?",
        "a": "MATIF je parížska komoditná burza špecializujúca sa na obchodovanie s futures kontraktmi."
      },
      {
        "q": "Aké komodity sa obchodujú na MATIF?",
        "a": "Na MATIF sa obchodujú poľnohospodárske komodity, ako je pšenica, kukurica a repka."
      },
      {
        "q": "Ako funguje obchodovanie na MATIF?",
        "a": "Obchodovanie na MATIF prebieha prostredníctvom futures kontraktov, ktoré umožňujú špekulovať na budúce ceny komodít."
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
    "faq": [
      {
        "q": "Na čo slúži intervenčný nákup?",
        "a": "Intervenčný nákup slúži na stabilizáciu trhu s komoditami tým, že štát nakupuje prebytky produkcie."
      },
      {
        "q": "Ako funguje intervenčný nákup?",
        "a": "Štát stanoví cenu, za ktorú je ochotný nakupovať komodity, ak trhová cena klesne pod túto úroveň."
      },
      {
        "q": "Ktoré komodity sú zvyčajne zahrnuté do intervenčných nákupov?",
        "a": "Najčastejšie ide o základné poľnohospodárske komodity, ako je pšenica a mlieko."
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
        "q": "Čo je komoditná burza?",
        "a": "Komoditná burza je trh, kde sa obchoduje s fyzickými komoditami a derivátmi na ne."
      },
      {
        "q": "Aké komodity sa obchodujú na komoditných burzách?",
        "a": "Obchodujú sa poľnohospodárske produkty, energetické suroviny a kovy."
      },
      {
        "q": "Aký je rozdiel medzi komoditnou a akciovou burzou?",
        "a": "Na komoditnej burze sa obchoduje s fyzickými produktmi a ich derivátmi, zatiaľ čo na akciovej burze sa obchoduje s cennými papiermi."
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
    "faq": [
      {
        "q": "Ako sa počíta bazická cena?",
        "a": "Bazická cena sa počíta ako rozdiel medzi spotovou cenou komodity a jej cenou na futures trhu."
      },
      {
        "q": "Na čo slúži bazická cena?",
        "a": "Bazická cena pomáha obchodníkom a producentom rozhodovať o predaji alebo skladovaní komodity."
      },
      {
        "q": "Aký je rozdiel medzi bazickou cenou a futures cenou?",
        "a": "Futures cena je cena dohodnutá pre budúcu dodávku, zatiaľ čo bazická cena je rozdiel medzi futures a spotovou cenou."
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
        "q": "Čo je forwardový kontrakt?",
        "a": "Forwardový kontrakt je dohoda o budúcom predaji alebo nákupe komodity za vopred stanovenú cenu."
      },
      {
        "q": "Aký je rozdiel medzi forwardovým a futures kontraktom?",
        "a": "Forwardový kontrakt je individuálna dohoda medzi dvoma stranami, zatiaľ čo futures kontrakt je štandardizovaný a obchoduje sa na burze."
      },
      {
        "q": "Na čo slúžia forwardové kontrakty?",
        "a": "Forwardové kontrakty slúžia na zaistenie proti cenovým výkyvom a plánovanie budúcich dodávok."
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
    "shortDef": "Skladné je poplatok za uskladnenie komodít v skladoch.",
    "longDef": "Skladné, známe tiež ako skladovací poplatok, je suma účtovaná za uskladnenie komodít v skladoch po určitú dobu. \n\nTento poplatok pokrýva náklady na skladovanie, ako sú energie, údržba a bezpečnosť, a je dôležitým faktorom pri kalkulácii celkových nákladov na obchodovanie s komoditami. \n\nNa Slovensku je skladné bežne účtované poľnohospodárom a obchodníkom, ktorí potrebujú uskladniť svoje produkty pred ich predajom alebo distribúciou.",
    "related": [
      "komoditni-burza",
      "forwardovy-kontrakt",
      "bazicka-cena",
      "intervencni-nakup"
    ],
    "faq": [
      {
        "q": "Čo je skladné?",
        "a": "Skladné je poplatok za uskladnenie komodít v skladoch."
      },
      {
        "q": "Ako sa určuje výška skladného?",
        "a": "Výška skladného sa zvyčajne určuje na základe dĺžky skladovania a objemu komodity."
      },
      {
        "q": "Prečo je skladné dôležité?",
        "a": "Skladné je dôležité na pokrytie nákladov na údržbu a prevádzku skladovacích priestorov."
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
        "q": "Ako sa meria sušina?",
        "a": "Sušina sa meria sušením vzorky pri stanovenej teplote, kým nedosiahne konštantnú hmotnosť."
      },
      {
        "q": "Prečo je sušina dôležitá v poľnohospodárstve?",
        "a": "Sušina je kľúčová pre hodnotenie kvality krmív a odhad výnosov plodín."
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
    "longDef": "Netto energia laktácie (NEL) je jednotka používaná na vyjadrenie množstva energie, ktorú krmivo poskytuje pre produkciu mlieka u dojníc. Táto hodnota zohľadňuje energiu potrebnú na údržbu a rast zvieraťa. NEL sa vypočítava na základe obsahu energie v krmive a jeho stráviteľnosti. V praxi sa využíva na optimalizáciu kŕmnych dávok a zabezpečenie efektívnej produkcie mlieka. Na Slovensku je NEL kľúčovým parametrom pri formulácii kŕmnych zmesí pre mliečny dobytok.",
    "related": [
      "ecm-mleko",
      "laktacni-krivka",
      "krizeni-plemen",
      "vykrm-skotu"
    ],
    "faq": [
      {
        "q": "Ako sa počíta NEL?",
        "a": "NEL sa počíta na základe energetického obsahu krmiva, ktorý je k dispozícii na produkciu mlieka."
      },
      {
        "q": "Na čo slúži NEL v chove dojníc?",
        "a": "NEL slúži na optimalizáciu kŕmnych dávok pre maximálnu produkciu mlieka pri zachovaní zdravia dojníc."
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
    "longDef": "PDI, čiže stráviteľný proteín, je jednotka používaná na vyjadrenie množstva proteínu, ktorý je skutočne stráviteľný a využiteľný zvieraťom. Tento ukazovateľ je kľúčový pri hodnotení kvality krmív, najmä pre prežúvavce. Výpočet PDI zahŕňa analýzu obsahu proteínu a jeho stráviteľnosti v tráviacom trakte. Na Slovensku sa PDI používa pri formulácii kŕmnych zmesí, aby bola zabezpečená optimálna výživa hospodárskych zvierat.",
    "related": [
      "hnuj",
      "digestat",
      "kejda"
    ],
    "faq": [
      {
        "q": "Ako sa určuje PDI?",
        "a": "PDI sa určuje laboratórnymi analýzami, ktoré merajú stráviteľnosť proteínov v krmive."
      },
      {
        "q": "Prečo je PDI dôležité pre výživu zvierat?",
        "a": "PDI pomáha zabezpečiť, aby zvieratá dostávali dostatočné množstvo stráviteľných proteínov na rast a produkciu."
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
    "longDef": "Výnos (t/ha) je kľúčová jednotka používaná na vyjadrenie množstva poľnohospodárskej produkcie zozbieranej z jedného hektára pôdy. Tento ukazovateľ je zásadný pre hodnotenie efektivity pestovania plodín a plánovanie poľnohospodárskych činností. Výnos závisí od mnohých faktorov, vrátane kvality pôdy, klimatických podmienok a použitých agronomických postupov. Na Slovensku je výnos dôležitým parametrom pre hodnotenie ekonomickej efektivity poľnohospodárskych podnikov.",
    "related": [
      "osevni-postup",
      "strip-till",
      "mulcovac"
    ],
    "faq": [
      {
        "q": "Ako sa počíta výnos v tonách na hektár?",
        "a": "Výnos sa počíta delením celkovej produkcie v tonách plochou obrábanej pôdy v hektároch."
      },
      {
        "q": "Čo ovplyvňuje výnos plodín?",
        "a": "Výnos ovplyvňuje kvalita pôdy, klimatické podmienky, použitá agrotechnika a odroda plodiny."
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
    "longDef": "Objemová hmotnosť obilnín je miera hustoty obilnín, ktorá udáva hmotnosť v kilogramoch na meter kubický (kg/m³). Tento ukazovateľ je dôležitý pre hodnotenie kvality a skladovateľnosti obilnín. Vyššia objemová hmotnosť zvyčajne znamená lepšiu kvalitu zrna. Meranie sa vykonáva pomocou špeciálnych zariadení, ako sú objemové hustomery. Na Slovensku je objemová hmotnosť kľúčovým parametrom pri obchodovaní s obilninami a stanovovaní ceny.",
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
        "q": "Ako sa meria objemová hmotnosť obilia?",
        "a": "Objemová hmotnosť sa meria vážením známeho objemu obilia a výpočtom hmotnosti na meter kubický."
      },
      {
        "q": "Prečo je objemová hmotnosť dôležitá?",
        "a": "Objemová hmotnosť je ukazovateľom kvality obilia."
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
    "longDef": "Aplikačná dávka (l/ha) je jednotka používaná na vyjadrenie množstva kvapalného prípravku, ako sú hnojivá alebo pesticídy, aplikovaného na jeden hektár pôdy. Správne určenie aplikačnej dávky je kľúčové pre efektívne a bezpečné použitie agrochemikálií. Dávka závisí od druhu prípravku, typu plodiny a podmienok prostredia. Na Slovensku sa aplikačné dávky riadia legislatívnymi normami a odporúčaniami výrobcov, aby bola zabezpečená ochrana životného prostredia a zdravia ľudí.",
    "related": [
      "herbicidy",
      "insekticidy",
      "fungicidy",
      "adjuvant"
    ],
    "faq": [
      {
        "q": "Ako sa určuje aplikačná dávka v litroch na hektár?",
        "a": "Aplikačná dávka sa určuje na základe odporúčania výrobcu a špecifických potrieb plodiny."
      },
      {
        "q": "Na čo slúži aplikačná dávka?",
        "a": "Aplikačná dávka zabezpečuje efektívne pokrytie plochy pesticídmi alebo hnojivami."
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
