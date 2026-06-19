// Polská (pl) varianta slovníku — překlad CS hesel (slug = cs slug).
// 306 hesel, slug/kategorie/related/čísla identické s CS (SLOVNIK).
// Generováno subagent-driven překladem (6 shardů + korekce úplnosti) + PL review bránou.
import type { SlovnikTerm, SlovnikKategorie } from './slovnik';

export const SLOVNIK_PL: SlovnikTerm[] = [
  {
    "slug": "adblue",
    "term": "AdBlue",
    "kategorie": "pohon",
    "shortDef": "AdBlue to 32,5% wodny roztwór mocznika, który jest wtryskiwany do układu wydechowego silników diesla, gdzie redukuje tlenki azotu (NOx) do nieszkodliwego azotu i wody.",
    "longDef": "AdBlue to handlowa nazwa wodnego roztworu mocznika (CO(NH₂)₂) w stężeniu 32,5%. Stosowany jest w układach selektywnej redukcji katalitycznej (SCR) silników diesla — wtryskiwany jest przed katalizator SCR, gdzie reaguje z tlenkami azotu zawartymi w spalinach.\n\nBez sprawnie działającego AdBlue nowoczesny ciągnik (od normy emisji Stage IV / Tier 4 Final) obniży moc lub całkowicie wyłączy się — sterownik wykrywa niski poziom lub niską jakość AdBlue i aktywuje tzw. \"tryb awaryjny\" (limp mode).\n\nZużycie AdBlue wynosi typowo 3–5% objętości oleju napędowego (na 100 l paliwa ok. 3–5 l AdBlue). Cena kształtuje się na poziomie 15–25 Kč/l w pojemnikach IBC (1000 l), w 10-litrowych kanistrach nawet 40 Kč/l.\n\nUwaga na jakość — zanieczyszczone AdBlue (pył, zanieczyszczenia organiczne) zniszczy drogi katalizator SCR (naprawa 100 000+ Kč). Norma ISO 22241 określa czystość — zawsze kupuj z certyfikatem.",
    "alias": [
      "DEF",
      "ciecz mocznikowa",
      "Diesel Exhaust Fluid"
    ],
    "related": [
      "scr-katalyzator",
      "emisni-normy-stage",
      "dpf"
    ]
  },
  {
    "slug": "dpf",
    "term": "DPF",
    "kategorie": "pohon",
    "shortDef": "DPF (Diesel Particulate Filter) to filtr cząstek stałych w układzie wydechowym silników diesla, który wychwytuje sadzę i okresowo ją wypala podczas tzw. regeneracji.",
    "longDef": "DPF to porowaty ceramiczny filtr (zazwyczaj kordieryt lub węglik krzemu) instalowany za turbosprężarką. Wychwytuje cząstki stałe (PM, sadza) ze spalin — bez niego nowoczesny diesel nie spełniłby limitów emisji Stage IV / Stage V.\n\nFiltr stopniowo się zatyka i musi być \"regenerowany\" — sadza jest wypalana do CO₂. Istnieją trzy sposoby:\n1. **Regeneracja pasywna** — przy wysokiej temperaturze spalin (>600 °C, np. przy pełnym obciążeniu), sadza wypala się samoistnie.\n2. **Regeneracja aktywna** — sterownik wstrzykuje niewielką ilość paliwa, aby podnieść temperaturę spalin (działa automatycznie w tle).\n3. **Regeneracja serwisowa** — jeśli pierwsze dwie zawiodą (krótkie przejazdy, niskie obciążenie), wymagana wizyta w serwisie.\n\nW przypadku ciągników trzeci scenariusz jest rzadki — ciągnik zazwyczaj pracuje pod obciążeniem przez długie godziny. Problemy pojawiają się głównie u ciągników do drobnych prac komunalnych (krótkie rozruchy, niska temperatura).\n\nŻywotność DPF: 8 000–15 000 motogodzin w zależności od marki i konserwacji. Wymiana kosztuje 80 000–200 000 Kč. Nie zalecamy demontażu (DPF delete) — jest to niezgodne z prawem, obniża wartość maszyny przy sprzedaży i grozi mandatem podczas kontroli.",
    "alias": [
      "Diesel Particulate Filter",
      "filtr cząstek stałych"
    ],
    "related": [
      "adblue",
      "scr-katalyzator",
      "emisni-normy-stage"
    ]
  },
  {
    "slug": "scr-katalyzator",
    "term": "Katalizator SCR",
    "kategorie": "pohon",
    "shortDef": "SCR to układ redukcji tlenków azotu (NOx) ze spalin silników diesla za pomocą wtrysku AdBlue do specjalnego katalizatora.",
    "longDef": "Selektywna redukcja katalityczna (SCR) to technologia oczyszczania spalin, która redukuje NOx (tlenki azotu) do nieszkodliwego azotu (N₂) i wody (H₂O). Zasada działania:\n\n1. AdBlue (32,5% mocznik) jest wtryskiwany przed katalizator SCR.\n2. Wysoka temperatura spalin rozkłada mocznik do amoniaku (NH₃).\n3. NH₃ reaguje w katalizatorze z NOx w obecności metali szlachetnych (wanad, wolfram) — powstaje N₂ i H₂O.\n\nSCR jest dominującą technologią spełniającą normy emisji Stage IV (od 2014) i Stage V (od 2020) dla ciągników rolniczych. Alternatywą był EGR (recyrkulacja spalin) + DPF, ale prowadzi to do wyższego zużycia paliwa (dlatego producenci tacy jak Fendt, JD, NH wybrali SCR jako główną ścieżkę).\n\nŻywotność katalizatora SCR: 8 000–15 000 motogodzin. Wymiana 100 000–250 000 Kč. Główne ryzyko: zanieczyszczenie AdBlue (zanieczyszczenia, niewłaściwe stężenie) → zniszczenie w ciągu kilkudziesięciu godzin.",
    "alias": [
      "Selective Catalytic Reduction",
      "selektywna redukcja katalityczna"
    ],
    "related": [
      "adblue",
      "dpf",
      "emisni-normy-stage"
    ]
  },
  {
    "slug": "emisni-normy-stage",
    "term": "Normy emisji Stage / Tier",
    "kategorie": "regulace",
    "shortDef": "Stage (UE) i Tier (USA) to stopniowo zaostrzane normy emisji dla silników wysokoprężnych maszyn pozadrogowych — od Stage I (1999) po obowiązujące Stage V (2020).",
    "longDef": "Normy emisji dla pozadrogowych silników diesla (NRMM — Non-Road Mobile Machinery) w UE oznaczane są jako Stage, w USA jako Tier. Norma reguluje limity emisji cząstek stałych (PM), tlenków azotu (NOx), węglowodorów (HC) i tlenku węgla (CO).\n\nGłówne etapy dla ciągników w UE:\n- **Stage I** (1999–2001): podstawowe limity, bez DPF i SCR.\n- **Stage II** (2001–2006): umiarkowane obniżenie NOx + PM.\n- **Stage IIIA** (2006–2011): dalsze obniżenie, silnik z EGR.\n- **Stage IIIB** (2011–2014): obowiązkowy DPF.\n- **Stage IV** (2014–2019): obowiązkowy SCR (AdBlue).\n- **Stage V** (od 2020): najostrzejsze wymagania, obowiązkowy DPF + SCR + filtr nano PM.\n\nPrzy zakupie używanych maszyn: model sprzed Stage IIIB (do 2011) zazwyczaj bez DPF — niższe ryzyko konserwacyjne, wyższe zużycie i emisje. Model Stage V (2020+) ma najniższe emisje, ale skomplikowany i kosztowny w utrzymaniu układ wydechowy.\n\nUSA Tier równolegle: Tier 1 ≈ Stage I, ..., Tier 4 Final ≈ Stage IV. Stage V nie istnieje w USA — normy amerykańskie pozostały na poziomie Tier 4 Final.",
    "alias": [
      "Stage I",
      "Stage V",
      "Tier 4 Final"
    ],
    "related": [
      "adblue",
      "dpf",
      "scr-katalyzator"
    ]
  },
  {
    "slug": "common-rail",
    "term": "Common Rail",
    "kategorie": "pohon",
    "shortDef": "Common Rail to układ wtryskowy silników diesla z wysokociśnieniową wspólną szyną (rail), która dostarcza paliwo do elektronicznie sterowanych wtryskiwaczy.",
    "longDef": "Common Rail to rewolucyjny system wtrysku paliwa w silnikach diesla (od końca lat 90.). Główna zasada: paliwo pod wysokim ciśnieniem (1500–2500 bar) jest stale obecne we wspólnej szynie (rail), a elektronicznie sterowane wtryskiwacze dozują bardzo precyzyjne ilości do cylindra.\n\nZalety w porównaniu ze starszymi układami (PD/Pumpe-Düse, pompa-wtryskiwacz):\n- Nawet 5–7 wtrysków na jeden skok (pilot, główny, post-wtrysk) → cichsza praca, czystsze spalanie.\n- Wyższe ciśnienie wtrysku → lepsze rozpylenie paliwa → niższe emisje PM.\n- Sterowanie elektroniczne → łatwa kalibracja map dla różnych norm emisji.\n\nWady:\n- Wrażliwość na jakość paliwa — woda lub zanieczyszczenia zniszczą wtryskiwacze (1 szt. 15 000–40 000 Kč).\n- Wysokie ciśnienia → droga naprawa pompy wysokociśnieniowej (50 000+ Kč).\n- Diagnostyka wymaga oprogramowania serwisowego.\n\nCommon Rail jest dziś standardem we wszystkich nowoczesnych ciągnikach (Stage IV+). Żywotność przy dobrej jakości paliwa 10 000+ motogodzin.",
    "alias": [
      "CRDi",
      "wtrysk common rail"
    ],
    "related": [
      "dpf",
      "common-rail-tlak"
    ]
  },
  {
    "slug": "isobus",
    "term": "ISOBUS",
    "kategorie": "precise-farming",
    "shortDef": "ISOBUS to znormalizowana magistrala komunikacyjna między ciągnikiem a maszyną (opryskiwacz, siewnik, prasa), umożliwiająca wymianę danych i sterowanie z jednego terminala.",
    "longDef": "ISOBUS (ISO 11783) to międzynarodowy standard komunikacji między ciągnikiem, maszyną i terminalem w kabinie. Przed ISOBUS każdy producent maszyn miał własny kabel/protokół — siewnik John Deere nie dawał się podłączyć do ciągnika New Holland bez wymiany całej elektroniki.\n\nCo umożliwia:\n- **UT (Universal Terminal)** — jeden wyświetlacz w kabinie dla wszystkich maszyn ISOBUS. Podłączasz siewnik Lemken do ciągnika Fendt i interfejs pojawia się na wyświetlaczu Fendt.\n- **TC-BAS (Task Controller Basic)** — liczenie przepracowanej powierzchni + zużycia materiału.\n- **TC-GEO (Task Controller Geo)** — mapy aplikacyjne według pozycji GPS (variable rate).\n- **TC-SC (Section Control)** — automatyczne wyłączanie sekcji opryskiwacza/kosiarki na uwrociach i przy nakładaniu.\n- **TIM (Tractor Implement Management)** — maszyna steruje ciągnikiem (prędkość, podnoszenie TUZ) w zależności od aktualnej sytuacji.\n\nFunkcje ISOBUS są licencjonowane — producent ciągnika pobiera opłaty za UT, TC-BAS, TC-GEO itd. osobno (5 000–80 000 Kč za funkcję). Przed zakupem sprawdź w bazie AEF Database (https://aef-online.org), czy kombinacja ciągnik + maszyna jest certyfikowana.",
    "alias": [
      "ISO 11783",
      "Tractor-Implement Bus"
    ],
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
    "kategorie": "precise-farming",
    "shortDef": "RTK to technologia GPS o dokładności 2–3 cm dzięki sygnałowi korekcyjnemu ze stacji referencyjnej. Standard dla autonomicznej nawigacji ciągników.",
    "longDef": "RTK (Real-Time Kinematic) to technologia GPS o centymetrowej dokładności. Zwykły odbiornik GPS ma dokładność 1–5 metrów, EGNOS/SBAS 0,5–1 m. RTK osiąga 2–3 cm dzięki porównaniu sygnału GPS z sygnałem ze stałej stacji referencyjnej (znana pozycja). Korekcja przesyłana jest przez sieć komórkową (NTRIP) lub łącze radiowe.\n\nDla rolnictwa RTK jest kluczowe do:\n- **Autonomicznego sterowania** (auto-steering) — rzędy idealnie równoległe, bez nakładania ani pomijania pasów.\n- **Aplikacji variable rate** — precyzyjne dozowanie nawozów/oprysków według mapy GPS.\n- **Strip-tillingu i CTF** (Controlled Traffic Farming) — powtarzalne przejazdy po tych samych śladach w celu zmniejszenia zagęszczenia gleby.\n\nW ČR dostępne są komercyjne sieci RTK: Trimble VRS Now (ok. 15 000 Kč/rok), Topcon TopNET Live, John Deere StarFire, CZEPOS (państwowy, bezpłatny po rejestracji). Niektóre regiony mają własne stacje lokalne.\n\nAlternatywa: własna stacja bazowa (50 000–150 000 Kč jednorazowo) — opłaca się dla dużych gospodarstw z kilkoma maszynami.",
    "alias": [
      "RTK",
      "Real-Time Kinematic"
    ],
    "related": [
      "isobus",
      "auto-steering",
      "variable-rate"
    ]
  },
  {
    "slug": "auto-steering",
    "term": "Auto-steering",
    "kategorie": "precise-farming",
    "shortDef": "Auto-steering to układ autonomicznego sterowania ciągnikiem po zaprogramowanej trajektorii z dokładnością RTK GPS — kierowca ustawia rzędy, a maszyna jedzie samodzielnie.",
    "longDef": "Auto-steering (autonomiczne sterowanie, nazwy handlowe: John Deere AutoTrac, Trimble Autopilot, Case IH IntelliSteer, New Holland IntelliSteer) to układ, w którym ciągnik automatycznie utrzymuje zaprogramowaną trajektorię GPS bez ingerencji kierowcy. Kierowca nadal obsługuje pedały, podnoszenie maszyny i skręty na uwrociach.\n\nKomponenty:\n1. **Odbiornik GPS** z korekcją RTK (centymetrowa dokładność).\n2. **Terminal** do planowania rzędów (linie AB, krzywe, kontur).\n3. **Aktuator kierowania** — silnik elektryczny na kolumnie kierownicy lub zawór hydrauliczny w układzie kierowniczym.\n\nGłówne zalety:\n- **Eliminacja nakładania** — pasy opryskiwacza / kosiarki nie nachodzą na siebie → oszczędność środków/nasion 5–15%.\n- **Mniejsze zmęczenie kierowcy** — 12-godzinna zmiana bez napięcia związanego z koncentracją.\n- **Praca w nocy i mgle** — dokładność niezależna od widoczności.\n- **Większa wydajność** — możliwość prowadzenia szerszych maszyn z większą prędkością.\n\nCena: 150 000–500 000 Kč w zestawie doposażenia, 100 000–250 000 Kč jako opcja fabryczna. Zwrot inwestycji zazwyczaj 2–4 lata dla gospodarstwa >100 ha.",
    "alias": [
      "autonomiczne sterowanie",
      "autopilot",
      "AutoTrac",
      "IntelliSteer"
    ],
    "related": [
      "gps-rtk",
      "isobus",
      "variable-rate"
    ]
  },
  {
    "slug": "variable-rate",
    "term": "Variable Rate Application",
    "kategorie": "precise-farming",
    "shortDef": "Variable Rate Application (VRA) to technika rolnictwa precyzyjnego, która zmienia dawkowanie nawozów, nasion lub środków ochrony roślin według mapy GPS z różnymi wartościami dla różnych części pola.",
    "longDef": "Variable Rate Application (VRA) to główna zasada rolnictwa precyzyjnego — stosowanie różnych dawek nawozu, nasion, środków ochrony roślin lub nawodnienia w zależności od aktualnych potrzeb każdego miejsca pola, zamiast jednolitej dawki na całą powierzchnię.\n\nDane wejściowe do map VRA:\n- **Analizy gleby** w siatce (10×10 lub 30×30 m) → mapa pH, P, K, materia organiczna.\n- **Mapy plonów** z kombajnu (yield monitor) — gdzie plony są najwyższe.\n- **Zdjęcia satelitarne** (Sentinel-2, Planet) — wskaźnik NDVI biomasy.\n- **Drony** z kamerą wielospektralną — wysoka rozdzielczość 5 cm.\n\nWorkflow:\n1. Zbieranie danych → oprogramowanie agronomiczne (Climate FieldView, John Deere Ops Center, Trimble Ag Software).\n2. Eksport mapy aplikacyjnej w formacie ISO XML lub SHP.\n3. Import do terminala w kabinie (ISOBUS TC-GEO).\n4. Podczas jazdy maszyna sama zmienia dawkę zgodnie z aktualną pozycją GPS.\n\nTypowa oszczędność nawozów 10–25% bez obniżenia plonów (w niektórych miejscach nawet z wyższym plonem). Zwrot z inwestycji w zestaw VRA (RTK + maszyna z ISOBUS + oprogramowanie) 2–5 lat dla gospodarstwa >150 ha.",
    "alias": [
      "VRA",
      "dozowanie zmienne",
      "mapy aplikacyjne"
    ],
    "related": [
      "isobus",
      "gps-rtk",
      "auto-steering"
    ]
  },
  {
    "slug": "cvt-prevodovka",
    "term": "Skrzynia CVT",
    "kategorie": "technologie",
    "shortDef": "CVT (Continuously Variable Transmission) to bezstopniowa skrzynia biegów umożliwiająca płynną zmianę przełożenia bez zmiany biegów. Standard w ciągnikach premium.",
    "longDef": "CVT (Continuously Variable Transmission) to skrzynia biegów, która płynnie zmienia przełożenie bez dyskretnych stopni. W ciągnikach zazwyczaj kombinacja hydrostatycznego i mechanicznego przeniesienia napędu (hydrostatyczno-mechaniczna CVT, zwana niekiedy \"power-split\").\n\nGłówne zalety:\n- **Optymalne obroty silnika** — kierowca ustawia żądaną prędkość, skrzynia sama utrzymuje silnik w ekonomicznym zakresie (typowo 1500–1800 obr/min).\n- **Płynne ruszanie i hamowanie** — brak szarpnięć przy zmianie biegów, lepsze dla maszyn wrażliwych na wstrząsy (prasa, siewnik).\n- **Tempomat** — utrzymuje precyzyjną prędkość przy zmianach terenu/obciążenia.\n- **Rewers bez sprzęgła** — do załadunku ładowaczem czołowym szybszy niż hydrauliczny rewers.\n\nGłówne marki CVT:\n- **Fendt Vario** — pionier (1995), najdłużej produkowana CVT, wysoka niezawodność.\n- **John Deere AutoPowr / IVT** — od serii 7R wzwyż.\n- **Case IH CVX / CVT-Drive** — Puma, Magnum.\n- **New Holland Auto Command** — T6, T7, T8.\n- **Deutz-Fahr TTV** — Continuously Variable.\n- **Massey Ferguson Dyna-VT** — 6S, 7S, 8S.\n\nWady: wyższa cena zakupu (200 000–500 000 Kč dopłata w stosunku do powershift), bardziej skomplikowany serwis, wrażliwość na czystość oleju hydraulicznego.",
    "alias": [
      "Continuously Variable Transmission",
      "skrzynia bezstopniowa",
      "Vario",
      "AutoPowr",
      "TTV"
    ],
    "related": [
      "powershift",
      "hydrostat"
    ]
  },
  {
    "slug": "powershift",
    "term": "Skrzynia Powershift",
    "kategorie": "technologie",
    "shortDef": "Powershift to skrzynia biegów z mechanicznymi stopniami, ale zmiana biegów odbywa się pod obciążeniem bez wciskania sprzęgła za pomocą hydraulicznych sprzęgieł lamelowych.",
    "longDef": "Skrzynia Powershift ma mechaniczne stopnie przekładni (jak manualna), ale zmiana biegów odbywa się pod obciążeniem bez wciskania sprzęgła. Działa to dzięki hydraulicznym sprzęgłom lamelowym, które synchronizują obroty obu wałów podczas zmiany biegu (~0,3 s).\n\nGłówne zalety:\n- **Zmiana biegów pod pełnym obciążeniem** — nie traci się prędkości ani momentu, idealne do orki i ciężkich prac pociągowych.\n- **Prostsze niż CVT** — mniej części, tańszy serwis.\n- **Żywotność** — typowo 10 000+ motogodzin bez poważnej naprawy.\n\nWarianty:\n- **Częściowy powershift** (semi-powershift) — część stopni manualna, część powershift (np. 24×24 z 4-stopniowym powershiftem).\n- **Pełny powershift** (full powershift) — wszystkie 16–24 stopnie zmieniają się pod obciążeniem (np. John Deere 6M PowrQuad, Case IH Maxxum ActiveDrive).\n\nWady w porównaniu z CVT: kierowca musi ręcznie wybierać bieg (lub polegać na automatycznym trybie, który czasem zmienia bieg nieodpowiednio), silnik nie zawsze pracuje w optymalnych obrotach.\n\nCenowo: o 100 000–300 000 Kč tańsze niż równoważna CVT. Opłaca się przy ciągnikach, gdzie głównym zastosowaniem jest orka i podobne stałe obciążenie.",
    "alias": [
      "częściowy powershift",
      "fullpower shift",
      "PowrQuad"
    ],
    "related": [
      "cvt-prevodovka",
      "hydrostat"
    ]
  },
  {
    "slug": "hydrostat",
    "term": "Przekładnia hydrostatyczna",
    "kategorie": "technologie",
    "shortDef": "Przekładnia hydrostatyczna przenosi moc przez pompę hydrauliczną i silnik — bezstopniowa zmiana prędkości za pomocą joysticka lub pedału, stosowana w małych ciągnikach i kombajnach.",
    "longDef": "Przekładnia hydrostatyczna (HST — Hydrostatic Transmission) przenosi moc silnika przez pompę hydrauliczną na silnik hydrauliczny napędzający koła. Zmiana prędkości odbywa się przez regulację wydajności pompy — od pełnego biegu wstecznego przez zero do pełnej prędkości do przodu, płynnie.\n\nGłówne zastosowania w rolnictwie:\n- **Małe ciągniki** (kompaktowe 25–60 KM, np. Kubota L-Series) — sterowanie joystickiem, odpowiednie do ciągłej zmiany prędkości przy załadunku, koszeniu trawników.\n- **Kombajny zbożowe** — napęd jazdy HST, mechaniczny napęd WOM.\n- **Ładowacze** (czołowe, przegubowe) — HST jest standardem.\n- **Maszyny komunalne** — kosiarki, nośniki wielofunkcyjne.\n\nZalety: proste sterowanie (pedał lub joystick), bez zmiany biegów, płynne manewrowanie. Wady: niższa sprawność niż przekładnia mechaniczna (15–25% strat), nieodpowiednia do ciężkich prac pociągowych w polu (szybko się przegrzewa, traci moc).\n\nW dużych ciągnikach polowych (100+ KM) HST nie jest stosowany jako główny napęd — zamiast tego hydrostatyczno-mechaniczna CVT (kombinacja HST + przeniesienie mechaniczne dla lepszej sprawności).",
    "alias": [
      "HST",
      "hydrostat"
    ],
    "related": [
      "cvt-prevodovka",
      "powershift"
    ]
  },
  {
    "slug": "npk-hnojivo",
    "term": "Nawóz NPK",
    "kategorie": "hnojivo",
    "shortDef": "NPK to nawóz mineralny zawierający trzy główne składniki pokarmowe — azot (N), fosfor (P) i potas (K). Oznaczenie np. 15-15-15 oznacza 15% każdego składnika.",
    "longDef": "Nawóz NPK to nawóz mineralny (nieorganiczny) zawierający trzy główne makroskładniki w różnych proporcjach: azot (N — Nitrogen), fosfor (P — Phosphorus) i potas (K — Kalium / Potassium).\n\nOznaczenie: kod liczbowy podaje procenty poszczególnych składników w suchej masie. Przykłady:\n- **NPK 15-15-15** — wyrównany, uniwersalny, 15% N, 15% P₂O₅, 15% K₂O.\n- **NPK 11-44-11** — startowy do nasion (wysoki fosfor dla rozwoju korzeni).\n- **NPK 8-20-30** — jesienny pod oziminy (niski N, wysoki K).\n- **NPK 20-10-10** — wiosenne nawożenie pogłówne pszenicy.\n\nWażna uwaga: P podawany jest jako **P₂O₅** (tlenek), K jako **K₂O** — nie czyste pierwiastki. Do przeliczenia:\n- 1 kg P = 2,29 kg P₂O₅\n- 1 kg K = 1,20 kg K₂O\n\nPierwiastki śladowe (S, Mg, Ca, B, Zn, Cu) występują w formach NPK plus (np. NPK + S, NPK Mikro). Aktualna cena NPK 15-15-15 wynosi ok. 13 000–18 000 Kč/t w zależności od sezonu i kraju pochodzenia.\n\nDo zmiennego dawkowania (VRA) według map GPS wymagany jest siewnik lub rozsiewacz z ISOBUS TC-GEO.",
    "alias": [
      "NPK",
      "nawóz mineralny"
    ],
    "related": [
      "variable-rate",
      "pH-pudy",
      "mocovina"
    ]
  },
  {
    "slug": "mocovina",
    "term": "Mocznik",
    "kategorie": "hnojivo",
    "shortDef": "Mocznik (chemicznie urea, CO(NH₂)₂) to najkoncentrowaniejszy nawóz azotowy — zawiera 46% N, najtańszy na jednostkę azotu.",
    "longDef": "Mocznik (urea, karbamid) to organiczny związek chemiczny o wzorze CO(NH₂)₂. Jako nawóz jest najkoncentrowaniejszym źródłem azotu — 46% N w suchej masie. Produkowany przemysłowo z syntetycznego amoniaku i CO₂.\n\nGłówne właściwości:\n- **Najtańszy na jednostkę N** — zazwyczaj 15–20% tańszy niż siarczan amonu lub azotan amonu (na kg azotu).\n- **Opóźnione działanie** — N musi najpierw zostać enzymatycznie rozłożony do amoniaku → nitryfikacja → azotan (ok. 1–3 tygodnie).\n- **Ryzyko strat przez ulatnianie** — przy powierzchniowym stosowaniu w ciepłej i suchej pogodzie 10–30% N może uciec jako NH₃ do atmosfery. Rozwiązaniem jest przykrycie ziemią lub inhibitor ureazy (NBPT).\n\nStosowanie:\n- Pod pszenicę ozimą wiosenne nawożenie pogłówne 100–250 kg/ha (= 46–115 kg N/ha).\n- Dla kukurydzy start + nawożenie boczne 200–500 kg/ha.\n- Nawozy dolistne 5–15 kg/ha w roztworze.\n\nMocznik stosowany jest również jako surowiec do AdBlue (32,5% roztwór) — ta sama cząsteczka, ale wyższy stopień czystości.",
    "alias": [
      "urea",
      "karbamid",
      "nawóz mocznikowy"
    ],
    "related": [
      "npk-hnojivo",
      "adblue"
    ]
  },
  {
    "slug": "pH-pudy",
    "term": "pH gleby",
    "kategorie": "agrotechnika",
    "shortDef": "pH gleby to miara kwasowości — poniżej 7 kwaśna, powyżej 7 zasadowa. Idealne dla większości roślin uprawnych to pH 6,0–7,0. Korekta przez wapnowanie lub siarczan amonu.",
    "longDef": "pH gleby to logarytmyczna miara stężenia jonów wodorowych (H⁺). Skala 0–14, neutralne 7. Gleby w ČR są zazwyczaj lekko kwaśne (pH 5,5–6,8) ze względu na opady i wymywanie wapnia.\n\nOptymalne pH dla głównych roślin uprawnych:\n- **Pszenica, jęczmień, kukurydza**: 6,0–7,0\n- **Burak cukrowy**: 6,5–7,5 (wrażliwy na kwasowość)\n- **Ziemniaki**: 5,5–6,5 (tolerują lekko kwaśne)\n- **Lucerna, koniczyna**: 6,5–7,0\n- **Borówka, żurawina**: 4,5–5,5 (wymagają kwaśnego)\n\nSkutki niewłaściwego pH:\n- **Zbyt kwaśne** (pH < 5,5): blokuje pobieranie P, K, Mg; aktywuje toksyczny Al, Mn; obniża aktywność mikroorganizmów. Rozwiązanie: wapnowanie (węglan wapnia CaCO₃, wapno dolomitowe) 2–6 t/ha.\n- **Zbyt zasadowe** (pH > 7,5): blokuje pobieranie mikroelementów (Fe, Mn, Zn, B). Rozwiązanie: siarczan amonu, siarka elementarna, materia organiczna.\n\nPomiar: analiza gleby w akredytowanym laboratorium (ÚKZÚZ Brno, ČZU Praha) — zazwyczaj 500–1500 Kč za 5 próbek. Planuj 1× na 4–6 lat.\n\nDo zmiennego wapnowania (VRA) według siatki GPS analizy w siatce 30×30 m → mapa pH → mapa aplikacyjna dla rozsiewacza.",
    "related": [
      "npk-hnojivo",
      "variable-rate"
    ]
  },
  {
    "slug": "mezi-plodiny",
    "term": "Wsiewki / Międzyplony",
    "kategorie": "agrotechnika",
    "shortDef": "Międzyplony to rośliny wysiewane między dwoma głównymi uprawami w celu poprawy żyzności gleby, ochrony przed erozją i wiązania azotu. Warunek systemu EKO w ramach CAP 2024.",
    "longDef": "Międzyplony (cover crops) to rośliny wysiewane w okresie między zbiorem głównej uprawy a siewem następnej, często na zimę lub w czasie letniego ugoru. Służą do:\n\n1. **Ochrony gleby przed erozją** — pokrywają powierzchnię w okresie deszczów i wiatru.\n2. **Wiązania azotu** (strączkowe międzyplony: wyka, groch, łubin) — bakterie Rhizobium wiążą azot atmosferyczny N₂.\n3. **Mobilizacji składników pokarmowych** — rozbudowany system korzeniowy wydobywa P, K z głębszych warstw.\n4. **Zwiększania zawartości materii organicznej** — biomasa przyorana tworzy próchnicę.\n5. **Zwalczania chwastów i chorób** — zakłócający wpływ na cykl życiowy niektórych chwastów.\n6. **Wiązania CO₂** — węgiel w glebie jest długoterminowo sekwestrowany.\n\nTypowe gatunki:\n- **Gorczyca biała** — szybka, tania, dobrze reagująca na azot.\n- **Facelia** — szybki wzrost, odpowiednia na letni ugór.\n- **Wyka kosmata + żyto** — ozimowy międzyplon, odpowiedni przed jarymi uprawami.\n- **Koniczyna inkarnatka** — wiązanie N, pasza.\n- **Gryka** — na krótki letni międzyplon.\n\nW CAP 2024 międzyplony są częścią systemu EKO (stawka premium 2400 Kč/ha) i EFA (Ecological Focus Areas). Przy obliczaniu kompensacji 1 ha międzyplonu = 0,3 ha EFA.",
    "alias": [
      "rośliny okrywowe",
      "cover crops",
      "EFA międzyplony"
    ],
    "related": [
      "eko-platba",
      "biopasy",
      "cap-2024"
    ]
  },
  {
    "slug": "biopasy",
    "term": "Pasy bioróżnorodności",
    "kategorie": "agrotechnika",
    "shortDef": "Pasy bioróżnorodności to niezasiane pasy między głównymi uprawami, przeznaczone dla bioróżnorodności, owadów, ptactwa i drobnej zwierzyny. Część EFA i systemu EKO w ramach CAP.",
    "longDef": "Pasy bioróżnorodności to nieprodukcyjne pasy na polach (zazwyczaj 6–20 m szerokości), które służą jako schronienie dla dzikiej fauny — zapylaczy, drobnej zwierzyny, ptactwa. Mogą być obsiane specjalnymi mieszankami (miododajne rośliny kwitnące) lub pozostawione jako spontaniczny ugór.\n\nTypy pasów:\n- **Pas nektarowy** — mieszanka roślin kwitnących (facelia, słonecznik, gryka, koniczyna, esparceta). Kluczowy dla pszczół i dzikich zapylaczy.\n- **Pas paszowy** — dla kuropatw, bażantów, zajęcy — zboża, słonecznik, kukurydza.\n- **Pas trawiasty** — przeciw erozji, wzdłuż cieków wodnych.\n- **Pas na skraju pola** — 6–12 m szerokości, obowiązkowy dla niektórych systemów eko.\n\nW CAP 2024:\n- Pasy bioróżnorodności należą do **EFA** (Ecological Focus Areas) — współczynnik 1,5 (1 ha pasa = 1,5 ha EFA).\n- Premium system EKO wymaga min. 7% powierzchni w EFA (w tym pasy + międzyplony + elementy krajobrazowe).\n- Specjalne nabory w PRV: dotacja na zakładanie pasów (zazwyczaj 8 000–18 000 Kč/ha w zależności od mieszanki).\n\nPraktyczne zasady: pas nie może być koszony przed końcem okresu lęgowego (1.8.), nie może być opryskiwany pestycydami, pielęgnacja 1× rocznie przez mulczowanie lub zbiór.",
    "alias": [
      "biokorytarz",
      "elementy krajobrazowe"
    ],
    "related": [
      "mezi-plodiny",
      "eko-platba",
      "cap-2024"
    ]
  },
  {
    "slug": "cap-2024",
    "term": "CAP 2024",
    "kategorie": "dotace",
    "shortDef": "CAP 2024 (Common Agricultural Policy, po polsku WPR) to program płatności bezpośrednich UE dla rolników na okres 2023–2027. Główne płatności: BISS, CISS, EKO, ANC, VCS.",
    "longDef": "Wspólna Polityka Rolna (WPR, ang. CAP — Common Agricultural Policy) to główny instrument finansowy UE wspierający rolnictwo. Obecny okres 2023–2027 przyniósł zasadniczą reformę — większy nacisk na ekologię (zazielenianie), redystrybucję na korzyść mniejszych gospodarstw i ochronę zasobów naturalnych.\n\nGłówne elementy dla ČR (orientacyjne stawki 2024):\n1. **BISS** (Basic Income Support for Sustainability) — Płatność podstawowa, ~2150 Kč/ha na wszystkie kwalifikujące się powierzchnie.\n2. **CISS** (Complementary Redistributive Income Support) — Płatność redystrybucyjna, ~1450 Kč/ha dla pierwszych 150 ha. Wspiera małe gospodarstwa.\n3. **Płatność EKO** (Eco-scheme) — Podstawowa 1300 Kč/ha, premium 2400 Kč/ha za więcej praktyk ekologicznych (międzyplony, pasy bioróżnorodności, powierzchnie nieprodukcyjne).\n4. **ANC** (Areas with Natural Constraints) — Obszary o niekorzystnych warunkach, górskie 4500 Kč/ha, OA/SV 2000 Kč/ha.\n5. **Młody rolnik** — Premia 1500 Kč/ha dla pierwszych 150 ha (do 40 lat, maks. 5 lat).\n6. **VCS** (Voluntary Coupled Support) — Sektory wrażliwe: chmiel 13000 Kč/ha, warzywa polowe 9000 Kč/ha, burak cukrowy 7500 Kč/ha, owoce 6500 Kč/ha, ziemniaki na skrobię 5500 Kč/ha, białka 2800 Kč/ha, len 4500 Kč/ha, paszowe 1100 Kč/ha.\n\nWniosek składa się jednorazowo w Wniosku Zbiorczym (zazwyczaj kwiecień–czerwiec, elektronicznie przez Portal Rolnika SZIF). Wiążące stawki SZIF publikuje po zamknięciu kampanii.\n\nDo orientacyjnego wyliczenia: [Kalkulator dotacji CAP](/kalkulacka/dotace-cap/).",
    "alias": [
      "Wspólna Polityka Rolna",
      "WPR 2023-2027"
    ],
    "related": [
      "eko-platba",
      "mezi-plodiny",
      "biopasy"
    ],
    "externalUrl": "https://www.szif.cz",
    "externalLabel": "SZIF — Státní zemědělský intervenční fond"
  },
  {
    "slug": "eko-platba",
    "term": "Płatność EKO",
    "kategorie": "dotace",
    "shortDef": "Płatność EKO to część CAP 2024 wspierająca praktyki ekologiczne. Stawka podstawowa ~1300 Kč/ha, premium ~2400 Kč/ha za więcej działań ekologicznych.",
    "longDef": "Płatność EKO (Eco-scheme) to dobrowolna część płatności bezpośrednich CAP 2024, która nagradza rolników za praktyki korzystne dla środowiska wykraczające poza obowiązkowe warunkowości.\n\nDwa systemy w ČR:\n1. **Podstawowy system EKO** — ~1300 Kč/ha. Obowiązkowe działania, takie jak zróżnicowany płodozmian, kary za monokultury, przestrzeganie elementów krajobrazowych.\n2. **Premium system EKO** — ~2400 Kč/ha. Wymaga dodatkowo:\n   - Min. 7% EFA (Ecological Focus Areas) z gruntów ornych — międzyplony + pasy bioróżnorodności + elementy krajobrazowe.\n   - Zasady strefowe wzdłuż cieków wodnych (min. 3 m bez pestycydów).\n   - Jakościowe okrywy lub ściernisko przez zimę.\n\nBez co najmniej podstawowego systemu EKO gospodarstwo traci znaczną część płatności bezpośrednich — dlatego w praktyce 95%+ rolników jest w systemie EKO.\n\nDo kalkulacji: różnica między podstawowym a premium to 1100 Kč/ha. Dla gospodarstwa 200 ha = 220 000 Kč/rok więcej. Jeśli wdrożenie praktyk premium (nasiona na międzyplony, siew, koszenie pasów) kosztuje < 1100 Kč/ha, opłaca się.\n\nW praktyce wynik premium idzie w górę (lepsza gleba, mniej erozji z warstwy ornej) — netto pozytywne nawet bez premii dotacyjnej dla długoterminowego gospodarstwa.",
    "alias": [
      "Eco-scheme",
      "zazielenianie",
      "system eko"
    ],
    "related": [
      "cap-2024",
      "mezi-plodiny",
      "biopasy"
    ]
  },
  {
    "slug": "lpis",
    "term": "LPIS",
    "kategorie": "dotace",
    "shortDef": "LPIS to centralna ewidencja gruntów rolnych w ČR — każde pole/działka ma unikalny blok LPIS, do którego przypisane są wnioski dotacyjne i dane katastralne.",
    "longDef": "LPIS (Land Parcel Identification System) to publiczna ewidencja kwalifikujących się gruntów rolnych w ČR, prowadzona przez ÚKZÚZ i używana przez SZIF do kontroli dotacji. Każda działka użytkowana rolniczo ma unikalny **blok LPIS** z własnym kodem (np. \"1234/56\").\n\nCo zawiera LPIS:\n- **Granice bloku glebowego** w GIS — dokładnie według DPB (części bloków glebowych).\n- **Kulturę** — grunty orne, TTP (trwałe użytki zielone), sad, winnica, chmielnik, inne.\n- **Powierzchnię** w ha.\n- **Zaszeregowanie do ANC** (górskie H1–H5, OA, SV lub poza ANC).\n- **Elementy krajobrazowe** w bloku — drzewo soliterowe, miedza, biokorytarz.\n- **Zagrożenie erozją** — kategoria M (umiarkowane), S (silne) wpływa na zasady siewu.\n- **Stosunki własnościowe** — kto jest użytkownikiem (wnioskodawca dotacji).\n\nDane LPIS są publicznie dostępne: https://eagri.cz/public/web/mze/farmar/LPIS/ — każdy widzi granice i kulturę (nie właściciela).\n\nAktualizacja LPIS: rolnik zgłasza zmiany (podział, scalenie, zmiana kultury) do ÚKZÚZ. Bez aktualnego LPIS nie można złożyć wniosku o płatności bezpośrednie ani inwestycyjne.",
    "alias": [
      "Land Parcel Identification System",
      "ewidencja gruntów"
    ],
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
    "kategorie": "dotace",
    "shortDef": "BISS to główna płatność bezpośrednia CAP 2024 — ~2150 Kč/ha na wszystkie kwalifikujące się grunty rolne. Zastąpiła wcześniejszy SAPS.",
    "longDef": "BISS (Basic Income Support for Sustainability) to podstawowa płatność bezpośrednia CAP 2024 — zastępuje wcześniejszy SAPS (Single Area Payment Scheme). Wypłacana na wszystkie kwalifikujące się grunty rolne zaewidencjonowane w LPIS.\n\nStawka 2024: ~2150 Kč/ha. Dla gospodarstwa 100 ha = 215 000 Kč/rok tylko z BISS, plus pozostałe składniki (CISS, EKO, ANC, VCS) łącznie 6 000–15 000 Kč/ha.\n\nWarunki uprawnienia:\n1. **Aktywny rolnik** — regularna działalność rolnicza, nie tylko \"trzymanie gruntów\".\n2. **Wniosek przez Wniosek Zbiorczy SZIF** — kwiecień–czerwiec, elektronicznie przez Portal Rolnika.\n3. **Min. powierzchnia 1 ha** — poniżej tego uprawnienie nie przysługuje.\n4. **Warunkowości** — obowiązkowe praktyki GAEC + obowiązkowe wymogi zarządzania SMR (dobrostan, gleba, woda).\n\nWypłata: SZIF wypłaca w terminach jesiennych (zazwyczaj październik–grudzień) za poprzednią kampanię. W przypadku kontroli na miejscu i stwierdzenia nieprawidłowości sankcja może wynieść 1–100% wraz ze zwrotem poprzednich płatności.\n\nDo orientacyjnego wyliczenia całkowitej dotacji: [Kalkulator dotacji CAP](/kalkulacka/dotace-cap/).",
    "alias": [
      "Basic Income Support for Sustainability",
      "Płatność podstawowa",
      "SAPS"
    ],
    "related": [
      "cap-2024",
      "lpis",
      "eko-platba"
    ]
  },
  {
    "slug": "dpb",
    "term": "DPB (Część bloku glebowego)",
    "kategorie": "dotace",
    "shortDef": "DPB (Díl půdního bloku — część bloku glebowego) to najmniejsza jednostka w LPIS — ciągła powierzchnia jednego rolnika z jedną kulturą. Stanowi podstawę wniosku o dotacje.",
    "longDef": "Część bloku glebowego (DPB) to atomarna jednostka ewidencji w LPIS — ciągła powierzchnia będąca własnością lub dzierżawą jednego użytkownika z jedną kulturą (grunt orny, TTP, sad, winnica, chmielnik). Każdy DPB ma unikalny identyfikator i własny polygon GIS.\n\nPrzykład: rolnik gospodaruje na 5 polach — każde pole = jeden DPB w LPIS. Jeśli część pola obsiana jest burakami, a drugą pszenicą, są to dwa DPB (ta sama kultura \"grunt orny\", ale z różnymi zasiewami).\n\nDPB jest kluczowe dla:\n- **Wniosku o płatności bezpośrednie** — powierzchnia każdego DPB sumowana dla BISS/CISS.\n- **VCS** — niektóre stawki VCS stosowane per DPB (sektory wrażliwe).\n- **ANC** — zaszeregowanie do kategorii ANC per DPB.\n- **Zasad erozyjnych** — kategoria zagrożenia erozją (M, S) per DPB.\n- **EFA** — międzyplony, pasy bioróżnorodności zgłaszane jako udział DPB.\n\nZmiany DPB zgłasza użytkownik przez Portal Rolnika lub w urzędzie gminy (podział, scalenie, zmiana kultury). Bez aktualnego DPB w LPIS nie można złożyć wniosku.\n\nOnline: granice i kultura wszystkich DPB są publiczne na https://eagri.cz/public/web/mze/farmar/LPIS/.",
    "alias": [
      "Część bloku glebowego"
    ],
    "related": [
      "lpis",
      "biss",
      "cap-2024"
    ]
  },
  {
    "slug": "ttp",
    "term": "TUZ (Trwałe użytki zielone)",
    "kategorie": "agrotechnika",
    "shortDef": "TUZ to trwałe użytki zielone — łąka lub pastwisko, które przez 5+ lat nie było przeorywane. Oddzielna kategoria w LPIS z własnymi zasadami dotacyjnymi.",
    "longDef": "Trwałe użytki zielone (TUZ) to blok glebowy obsadzony trawami lub trawami z roślinami strączkowymi, który nie był przeorywany (orany i obsiany inną rośliną) przez ponad 5 lat. W LPIS TUZ to oddzielna kultura, różna od gruntów ornych.\n\nZasady dla TUZ w CAP 2024:\n- **Zakaz orki** — TUZ nie można przeorać bez specjalnego zezwolenia (= utrata statusu TUZ, kara za \"trwałe zanieczyszczenie permanent grassland\").\n- **Wrażliwe TUZ** w Natura 2000 lub obszarach chronionego krajobrazu: całkowity zakaz orki.\n- **Min. obsada bydłem** (pastwiskowe TUZ) — jeśli TUZ nie służy jako pastwisko, wymaga koszenia 1–2× rocznie.\n- **System EKO** — TUZ nie wymaga międzyplonów ani płodozmianu (z definicji są \"trwałe\") — automatycznie kwalifikuje na podstawową stawkę EKO.\n- **ANC** — TUZ w obszarach górskich (H1–H5) ma wysokie stawki ANC (nawet 7000 Kč/ha dla górskich pastwisk).\n\nW ČR ok. 25% powierzchni rolnej to TUZ (ok. 900 000 ha). Głównie w obszarach górskich i podgórskich (kraj Południowoczeskie, Plzeńskie, Wysoczyzna, Zlińskie, Morawsko-Śląskie).\n\nTUZ ma ważną wartość ekologiczną (bioróżnorodność, retencja wody, sekwestracja węgla) — dlatego jest chroniony przed przeorywaniem.",
    "alias": [
      "łąka",
      "pastwisko",
      "permanent grassland"
    ],
    "related": [
      "lpis",
      "cap-2024",
      "pastvina"
    ]
  },
  {
    "slug": "pto",
    "term": "WOM (Wał odbioru mocy)",
    "kategorie": "technologie",
    "shortDef": "WOM (Power Take-Off) to wał odbioru mocy ciągnika do napędu maszyn — siewnik, kosiarka, prasa, opryskiwacz. Standardowe obroty 540 lub 1000 obr/min.",
    "longDef": "WOM (Power Take-Off, wał odbioru mocy) to obracający się wał z tyłu (lub z przodu) ciągnika, który przenosi moc silnika na podłączone maszyny — kosiarkę, prasę, siewnik, opryskiwacz, mulczer, snopowiązałkę, zawieszany kombajn.\n\nStandardowe obroty:\n- **540 obr/min** — historycznie najstarsze, do dziś dla małych maszyn (mulczer, kosiarka, małe opryskiwacze).\n- **1000 obr/min** — wyższe dla dużych maszyn (prasy, zawieszane kombajny, duże opryskiwacze).\n- **540E (Economy)** — nowoczesny tryb oszczędnościowy, ciągnik pracuje na 1500 obr/min silnika, WOM utrzymuje 540 → oszczędność 10–15% paliwa.\n- **1000E (Economy)** — równolegle dla 1000 obr.\n\nWał:\n- **6-rowkowy** — standard dla 540 obr.\n- **21-rowkowy** — dla 1000 obr, wyższa wytrzymałość.\n\nBezpieczeństwo: WOM jest bardzo niebezpieczny — obracający się wał z prędkością obwodową 10+ m/s może wciągnąć odzież i spowodować śmierć. Zawsze z osłoną (osłona maszyny + osłona na ciągniku). Przed odłączeniem wyłącz silnik.\n\nNiektóre nowoczesne ciągniki mają **autostop WOM** — WOM wyłącza się samoczynnie przy zatrzymaniu/podnoszeniu TUZ.",
    "alias": [
      "Power Take-Off",
      "wał odbioru mocy",
      "WOM"
    ],
    "related": [
      "hydraulika-traktor",
      "tribod"
    ]
  },
  {
    "slug": "tribod",
    "term": "Trzypunktowy układ zawieszenia",
    "kategorie": "technologie",
    "shortDef": "Trzypunktowy układ zawieszenia to znormalizowany system podłączania maszyn do tylnej (lub przedniej) części ciągnika — dwa dolne ramiona + jedno górne ramię.",
    "longDef": "Trzypunktowy układ zawieszenia (3-punktowy hitch, three-point linkage) to najważniejsza standaryzacja w rolnictwie — pozwala podłączyć dowolną maszynę do dowolnego ciągnika bez przebudowy. Wynalazł go Harry Ferguson w latach 30. XX wieku (System Ferguson).\n\nKomponenty:\n- **Dwa dolne ramiona nośne** (lower lift arms) — hydraulicznie podnoszone, określają wysokość maszyny.\n- **Jedno górne ramię** (top link) — stała długość, określa pochylenie maszyny.\n- **Ramiona stabilizujące** (check chains) — ograniczają boczny ruch.\n\nKategorie według wytrzymałości i rozmiaru czopów kulistych:\n- **Cat I** — małe ciągniki do 40 KM, Ø 22 mm czopy.\n- **Cat II** — średnie 40–100 KM, Ø 28 mm.\n- **Cat III** — duże 80–225 KM, Ø 36 mm.\n- **Cat IV** — największe 180+ KM, Ø 45 mm.\n- **Cat IV-N** — węższa wersja dla lepszej manewrowości.\n\nUdźwig: podawany na końcach ramion (lift capacity at hitch point) — typowo 3 500 kg dla Cat II, 6 500 kg dla Cat III, 12 000+ kg dla Cat IV.\n\n**Przedni układ zawieszenia** — nowoczesny wybór w ciągnikach premium (Fendt, JD), pozwala na pracę \"kanapkową\" (jedna maszyna z przodu, druga z tyłu) → wyższa wydajność.",
    "alias": [
      "TUZ-mechaniczny",
      "3-punkt",
      "three-point hitch"
    ],
    "related": [
      "pto",
      "hydraulika-traktor"
    ]
  },
  {
    "slug": "hydraulika-traktor",
    "term": "Hydraulika ciągnika",
    "kategorie": "technologie",
    "shortDef": "Hydraulika ciągnika napędza TUZ, zewnętrzne wyjścia dla maszyn i często układ kierowniczy. Nowoczesne systemy: load sensing (LS), Power Flow Control (PFC).",
    "longDef": "Hydrauliczny układ ciągnika obsługuje:\n1. **Trzypunktowy układ zawieszenia** — podnoszenie maszyn.\n2. **Zewnętrzne wyjścia** (SCV — Selective Control Valves) — napęd funkcji hydraulicznych maszyn (składany opryskiwacz, cylinder nawadniający, wciągarka).\n3. **Wspomaganie układu kierowniczego** (power steering).\n4. **Sprzęgło WOM**, **blokadę mechanizmu różnicowego**, **sprzęgło 4×4**.\n\nRodzaje układów hydraulicznych:\n- **Open Center** — historyczny, pompa stale dostarcza pełny przepływ, nadwyżki wracają do zbiornika. Proste, niska sprawność, dobre do lekkich maszyn.\n- **Closed Center z LS (Load Sensing)** — nowoczesny standard, pompa dostarcza tylko tyle ciśnienia i przepływu, ile maszyna wymaga. Wyższa sprawność (oszczędność 5–15% paliwa).\n- **PFC (Pressure Flow Compensation)** — Premium wersja LS, jeszcze precyzyjniejsza regulacja.\n\nKluczowe parametry:\n- **Maks. ciśnienie** — typowo 200 bar (małe) do 250 bar (premium).\n- **Maks. przepływ** — 60 l/min małe ciągniki, 200+ l/min modele top.\n- **Liczba SCV** — 2 standard, 4–6 premium (dla złożonych maszyn jak duży opryskiwacz).\n\nOlej: hydrauliczny + przekładniowy wspólny (UTTO — Universal Tractor Transmission Oil), wymiana 1× na 1500–3000 motogodzin. Uwaga na mieszanie z ATF lub olejem silnikowym — niekompatybilne.",
    "alias": [
      "obwód hydrauliczny",
      "PFC",
      "load sensing"
    ],
    "related": [
      "tribod",
      "pto"
    ]
  },
  {
    "slug": "hektar",
    "term": "Hektar (ha)",
    "kategorie": "jednotky",
    "shortDef": "Hektar (ha) to jednostka powierzchni = 10 000 m² = 100 × 100 m. Standardowa jednostka w rolnictwie dla powierzchni pól, dotacji, plonów.",
    "longDef": "Hektar (ha) to jednostka powierzchni w układzie metrycznym. 1 ha = 10 000 m² = 100 a (arów). Wizualnie: kwadrat 100 × 100 m, lub 1,5-krotność boiska piłkarskiego.\n\nW rolnictwie hektar to podstawowa jednostka dla:\n- **Powierzchni pola** — całe gospodarstwo mierzy się w ha (50 ha, 200 ha, 1000 ha).\n- **Dotacji** — Kč/ha (BISS 2150 Kč/ha, CISS 1450 Kč/ha).\n- **Plonów roślin** — t/ha lub q/ha (1 q = 100 kg = 1 kwintal metryczny).\n- **Zużycia nawozów** — kg/ha (200 kg NPK/ha).\n- **Dawkowania oprysków** — l/ha (5 l Roundup/ha).\n- **Wydajności maszyn** — ha/h (opryskiwacz 12 m szerokości × 12 km/h = 14,4 ha/h teoretycznie).\n\nPreliwiczenia:\n- 1 km² = 100 ha\n- 1 mila² (USA) = 259 ha\n- 1 akr (USA) = 0,405 ha (akr × 0,405 = ha)\n- 1 morgen (DE/AT) = 0,25–0,34 ha w zależności od regionu (historyczny)\n\nW ČR gospodarstwa 1–50 ha = \"drobni rolnicy\", 50–500 ha = \"średnie\", 500–5000 ha = \"duże\", 5000+ ha = \"przemysłowe\".",
    "alias": [
      "ha",
      "jednostka powierzchni"
    ],
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
    "term": "Kwintal (q)",
    "kategorie": "jednotky",
    "shortDef": "Kwintal (q) to jednostka masy = 100 kg. W rolnictwie używany dla plonów i cen towarów — pszenica 60 q/ha = 6 t/ha.",
    "longDef": "Kwintal (łac. centum = 100, symbol **q** z włoskiego \"quintale\") to jednostka masy, standardowo 100 kilogramów. W rolnictwie czeskim i europejskim dominująca jednostka dla:\n\n- **Plonów roślin**: pszenica 60–80 q/ha, kukurydza 80–120 q/ha, rzepak 35–45 q/ha. 1 q/ha = 100 kg/ha = 0,1 t/ha.\n- **Cen towarów**: 5500 Kč/t pszenicy = 550 Kč/q. Rolnicy często liczą w q przy negocjacjach z skupem.\n- **Zużycia pasz**: mleczna krowa dojona zużywa ok. 30 q mieszanki/rok.\n\nUwaga — q (kwintal metryczny) różni się od **kwintala amerykańskiego** (= 100 lb = 45,4 kg) i **kwintala brytyjskiego** (= 112 lb = 50,8 kg). W handlu międzynarodowym używa się wyłącznie **tony metrycznej (t)** = 1000 kg = 10 q.\n\nPraktyczny przykład:\n- Pszenica 6 t/ha × 100 ha = 600 t = 6000 q\n- Cena 5500 Kč/t = 550 Kč/q → przychód 3,3 mln Kč\n\nDla wysokich plonów (kukurydza kiszonkowa, trawy na kiszonkę) liczy się w t (1 t = 10 q), nigdy w q (liczby byłyby niepraktyczne — 400 q/ha kukurydzy).",
    "alias": [
      "q",
      "kwintal metryczny",
      "kwintał"
    ],
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
    "kategorie": "jednotky",
    "shortDef": "Ar (a) to jednostka powierzchni = 100 m² = kwadrat 10 × 10 m. 100 arów = 1 hektar. Stosowany dla ogrodów, działek i małych gruntów w katastrze nieruchomości.",
    "longDef": "Ar to jednostka powierzchni, wywodząca się z łacińskiego *area*. 1 ar = 100 m² = kwadrat o boku 10 m. W układzie SI ar (a) to jednostka dopuszczona poza SI, dopuszczalna dla ewidencji gruntów.\n\nPreliwiczenia:\n- **1 a = 100 m²**\n- **1 a = 0,01 ha** (100 a = 1 ha)\n- **1 a = 0,0001 km²**\n- **1 a ≈ 0,0247 akra** (akr ≈ 40,47 a)\n\nW ČR ar stosowany jest głównie w:\n- **Katastrze nieruchomości** — powierzchnie ogrodów, działek budowlanych i małych gruntów rolnych zazwyczaj zapisywane w m² lub ha, ale starsze zapisy i potoczna mowa (\"ogród 8 arów\") zachowują ar.\n- **Drobnym rolnictwie** — pasy uprawne, sady owocowe, małe winnice.\n- **Podatku od nieruchomości** — stawki liczone od m², ale rolnicy zazwyczaj pamiętają powierzchnię w arach.\n\nPraktyczne porównania:\n- **Kort tenisowy** (singlowy, 23,77 × 8,23 m) ≈ 2 ary\n- **Basen olimpijski** (50 × 25 m) = 12,5 a\n- **Boisko piłkarskie** (105 × 68 m) ≈ 71 a (= 0,71 ha)\n- **Przeciętny czeski ogród przy domu** = 4–10 a\n\nHistorycznie ar wprowadzono we Francji w roku 1795 jako część układu metrycznego. W kontekście CZ/SK zastąpił wcześniejsze jednostki jak **korec** (≈ 28 a) i **strych** (≈ 28–32 a) — zob. [[korec]], [[strych]].",
    "alias": [
      "a",
      "sto metrów kwadratowych"
    ],
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
    "kategorie": "jednotky",
    "shortDef": "Akr (acre) to anglosaska jednostka powierzchni = 4 046,86 m² = 0,4047 hektara. Standardowa jednostka w USA, Wielkiej Brytanii, Kanadzie i Australii dla gruntów rolnych.",
    "longDef": "Akr (ang. *acre*) to tradycyjna anglosaska jednostka powierzchni, dziś precyzyjnie zdefiniowana jako **4 046,8564224 m²** (akr międzynarodowy). W USA i Wielkiej Brytanii jest do dziś dominującą jednostką dla gruntów rolnych i nieruchomości.\n\nDokładne przeliczenia:\n- **1 akr = 4 046,86 m²**\n- **1 akr = 0,4047 ha** (≈ 40,5 a)\n- **1 akr = 40,4686 a**\n- **1 hektar = 2,4711 akra**\n- **1 mila² = 640 akrów** (1 sekcja w systemie US township)\n\nPochodzenie jednostki: średniowieczny akr to powierzchnia, którą jeden mężczyzna z parą wołów mógł zaorać w ciągu dnia — stąd długość **1 furlong × szerokość 1 chain** (220 yardów × 22 yardy = 4 840 yard²).\n\nPraktyczne zastosowanie:\n- **USA**: przeciętne gospodarstwo 2026 ≈ 446 akrów (≈ 180 ha). Duże przemysłowe farmy 10 000+ akrów.\n- **Wielka Brytania**: typowa angielska farma 88 ha = 217 akrów.\n- **Fundusze gruntowe / inwestycje**: amerykańskie grunty rolne handlowane są w USD/akr (zazwyczaj 4–10 tys. USD/akr w Midwest).\n- **Ceny towarów**: USDA publikuje plony w buszel/akr — pszenica ~50 bu/ac, kukurydza ~175 bu/ac.\n\nDla rolnika z ČR przydatne przy:\n- **Wynajmie gruntów zagranicą** (zwł. SK, AT, DE pogranicze — zob. [[morgen]]).\n- **Imporcie danych USDA** o światowych plonach (przelicznik bu/ac → t/ha: buszle × 0,02489 = t/ha).\n- **Sprzedaży do USA** (eksport towarów).\n\nUwaga: istnieją też warianty regionalne — *szkocki akr* (5 080 m²), *irlandzki akr* (6 555 m²) — dziś przestarzałe, ale jeszcze w niektórych starych zapisach.",
    "alias": [
      "acre",
      "akre",
      "angielski akr"
    ],
    "related": [
      "hektar",
      "morgen",
      "busl",
      "metr-ctvrecni"
    ]
  },
  {
    "slug": "metr-ctvrecni",
    "term": "Metr kwadratowy (m²)",
    "kategorie": "jednotky",
    "shortDef": "Metr kwadratowy (m²) to podstawowa jednostka powierzchni w SI = kwadrat 1 × 1 m. 10 000 m² = 1 hektar. Uniwersalna jednostka dla budynków, działek, mieszkań.",
    "longDef": "Metr kwadratowy (m², pisany też m2 lub \"metr kwadratowy\") to pochodna jednostka powierzchni w układzie SI. 1 m² = powierzchnia kwadratu o boku 1 metr.\n\nPreliwiczenia na inne jednostki powierzchni:\n- **1 m² = 0,01 a** (100 m² = 1 ar)\n- **1 m² = 0,0001 ha** (10 000 m² = 1 hektar)\n- **1 m² = 0,000001 km²** (1 000 000 m² = 1 km²)\n- **1 m² ≈ 10,764 sq ft** (stopa kwadratowa, USA/UK)\n- **1 m² ≈ 1,196 sq yd** (jard kwadratowy)\n\nZastosowanie w rolnictwie i nieruchomościach:\n- **Działki budowlane** — kataster nieruchomości ewidencjonuje grunty w m² (oficjalny zapis).\n- **Stawki podatku od nieruchomości** — liczone w Kč/m² według rodzaju gruntu.\n- **Szklarnie i tunele foliowe** — pojemność podawana w m² powierzchni uprawnej.\n- **Drób i chów** — minimalna powierzchnia na zwierzę (normy dobrostanu) w m²/szt.\n- **Hale magazynowe** — jamy kiszonkowe, stodoły, place mechanizacyjne w m².\n\nPraktyczne porównania:\n- **Miejsce parkingowe**: 12,5 m² (2,5 × 5 m)\n- **Małe mieszkanie 1-pokojowe**: 25–35 m²\n- **Duże mieszkanie 4-pokojowe**: 100–130 m²\n- **Kort tenisowy**: 261 m² (singlowy)\n- **Boisko piłkarskie**: 7 140 m² (≈ 0,71 ha)\n\nDla przeliczenia większych powierzchni na hektary wystarczy podzielić przez 10 000:\n- 5 000 m² = 0,5 ha\n- 25 000 m² = 2,5 ha\n- 500 000 m² = 50 ha\n\nZob. też [[ar]] (= 100 m²), [[hektar]] (= 10 000 m²), [[kilometr-ctvrecni]] (= 1 000 000 m²).",
    "alias": [
      "m²",
      "m2",
      "metr kwadratowy"
    ],
    "related": [
      "ar",
      "hektar",
      "kilometr-ctvrecni"
    ]
  },
  {
    "slug": "kilometr-ctvrecni",
    "term": "Kilometr kwadratowy (km²)",
    "kategorie": "jednotky",
    "shortDef": "Kilometr kwadratowy (km²) to jednostka powierzchni = kwadrat 1 × 1 km = 100 hektarów = 1 000 000 m². Stosowany dla lasów, obszarów katastralnych, regionów, zlewni.",
    "longDef": "Kilometr kwadratowy (km², pisany też km2 lub \"kilometr kwadratowy\") to pochodna jednostka powierzchni w SI. 1 km² = powierzchnia kwadratu o boku 1 km = 1 000 m × 1 000 m.\n\nPreliwiczenia:\n- **1 km² = 1 000 000 m²**\n- **1 km² = 100 ha** (sto hektarów)\n- **1 km² = 10 000 a** (dziesięć tysięcy arów)\n- **1 km² ≈ 247,1 akra**\n- **1 mila² ≈ 2,59 km²** (mila kwadratowa, USA)\n\nZastosowanie:\n- **Leśnictwo** — powierzchnia kompleksów leśnych, zlewni, obszarów chronionych (CHKO, NP) podawana w km².\n- **Obszary katastralne** — przeciętny obszar katastralny w ČR ma 4–8 km².\n- **Pastwiska i TUZ** — ekstensywne pastwiska w obszarach górskich (Karkonosze, Beskidy) mierzone w km².\n- **Statystyki ČSÚ** — grunty orne w ČR ~30 000 km² (3 mln ha), TUZ ~10 000 km².\n- **Dane klimatyczne i meteo** — opady i temperatury interpolowane na raster km².\n\nPraktyczne porównania:\n- **Praga 1 (okręg administracyjny)**: 5,5 km²\n- **Manhattan (NYC)**: 59 km²\n- **Mikulov (miasto)**: 47 km²\n- **NP Szumawa**: 685 km²\n- **CHKO Czeski Kras**: 132 km²\n\nČR ma łącznie **78 871 km²** = 7,89 mln ha. Z tego grunty rolne 41 868 km² = 4,19 mln ha (53% powierzchni kraju).\n\nZob. też [[hektar]] (= 0,01 km²), [[metr-ctvrecni]], [[ar]].",
    "alias": [
      "km²",
      "km2",
      "kilometr kwadratowy"
    ],
    "related": [
      "hektar",
      "metr-ctvrecni",
      "ar"
    ]
  },
  {
    "slug": "hektolitr",
    "term": "Hektolitr (hl)",
    "kategorie": "jednotky",
    "shortDef": "Hektolitr (hl) to jednostka objętości = 100 litrów = 0,1 m³. W rolnictwie kluczowy dla wagi hektolitrowej zboża (kg/hl) — parametr jakościowy przy skupie.",
    "longDef": "Hektolitr (hl) to jednostka objętości = **100 litrów** = 0,1 m³. W SI hektolitr to jednostka dopuszczona poza SI, szeroko stosowana w rolnictwie, browarnictwie i handlu płynami.\n\nPreliwiczenia:\n- **1 hl = 100 l**\n- **1 hl = 0,1 m³ = 100 dm³**\n- **1 hl ≈ 22 galony imperialne (UK) ≈ 26,4 galona US**\n- **1 hl ≈ 2,75 buszla amerykańskiego** (zależy od towaru)\n\nW rolnictwie hl jest kluczowy dla **wagi hektolitrowej** — masa w kilogramach, jaką ma 100 litrów zboża. To fundamentalny **parametr jakościowy** przy skupie zboża:\n\n| Roślina | Standard kg/hl | Paszowe | Spożywcze |\n|---------|----------------|---------|---------------|\n| **Pszenica ozima** | 76–82 | < 74 | 78–84 (E, A) |\n| **Jęczmień słodowy** | 64–68 | < 62 | min. 64 |\n| **Jęczmień paszowy** | 62–66 | zwykłe | — |\n| **Żyto** | 70–76 | < 68 | 72+ |\n| **Owies** | 48–52 | < 45 | 50+ |\n| **Rzepak ozimy** | 64–68 | — | min. 62 |\n| **Pszenżyto** | 70–76 | zwykłe | — |\n\n**Dlaczego waga hl?** Wyższa waga hektolitrowa = wyższa zawartość skrobi/oleju, mniej plew i łuszczyn, lepsza jakość młynarska. Młyny i słodownie określają cenę zboża na podstawie wagi hl + innych parametrów (wilgotność, azot, Falling Number).\n\nPraktyczne skutki dla przychodu gospodarstwa:\n- Pszenica 78 kg/hl → klasa spożywcza A → 5800 Kč/t\n- Pszenica 74 kg/hl → paszowa → 4200 Kč/t\n- **Różnica 1600 Kč/t** = 80 tys. Kč na 50 ha przy plonie 6 t/ha\n\nWagę hektolitrową mierzą przenośne wagi bezpośrednio w kombajnie (yield monitor, zob. [[yield-monitor]]) lub precyzyjnie laboratoryjnie po żniwach.\n\nZob. też [[busl]] (odpowiednik US), [[q-cent]], [[tuna]], [[kilogram]], [[hektar]].",
    "alias": [
      "hl",
      "waga hektolitrowa"
    ],
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
    "term": "Buszel (bushel)",
    "kategorie": "jednotky",
    "shortDef": "Buszel (bushel, bu) to anglosaska jednostka objętości i masy dla zboża. 1 buszel US pszenicy = 27,2155 kg, kukurydzy = 25,4 kg. Standardowa jednostka cen na CBOT.",
    "longDef": "Buszel (ang. *bushel*, skr. *bu*) to tradycyjna anglosaska jednostka, która w rolnictwie używana jest w dwóch formach:\n\n1. **Buszel objętościowy** = 35,2391 litra (USA, dry bushel) = 36,3687 l (UK, imperial)\n2. **Buszel wagowy** — stała masa zdefiniowana dla każdego towaru (standard USDA)\n\nBuszel wagowy (USDA dla handlu US):\n| Towar | kg/buszel | lb/buszel |\n|----------|---------|---------|\n| **Pszenica** | 27,2155 | 60 |\n| **Soja** | 27,2155 | 60 |\n| **Kukurydza** | 25,4012 | 56 |\n| **Jęczmień** | 21,7724 | 48 |\n| **Owies** | 14,5150 | 32 |\n| **Żyto** | 25,4012 | 56 |\n| **Rzepak (canola)** | 22,6796 | 50 |\n\n**Dlaczego buszel ważny dla rolnika z ČR:**\n- **CBOT (Chicago Board of Trade)** — światowe ceny pszenicy, kukurydzy i soi kwotowane są w **centach/buszel**. Ruchy na CBOT dyktują ceny w Europie z 1–2-dniowym opóźnieniem.\n- **Raporty USDA WASDE** — miesięczne globalne szacunki plonów i zapasów publikowane w milionach buszli.\n- **Eksport/import** — amerykańska soja i kukurydza sprzedawana jest po buszelach.\n\nPreliczeń **buszel/akr → t/hektar** (aby porównać plony US i EU):\n- **Pszenica**: bu/ac × 0,06725 = t/ha (50 bu/ac ≈ 3,36 t/ha)\n- **Kukurydza**: bu/ac × 0,06277 = t/ha (175 bu/ac ≈ 10,98 t/ha)\n- **Soja**: bu/ac × 0,06725 = t/ha (50 bu/ac ≈ 3,36 t/ha)\n\nPrzykład przeliczenia ceny CBOT na CZ:\n- Pszenica 600 ¢/bu = 6,00 USD/bu\n- 6,00 USD ÷ 27,2155 kg × 1000 = **220,4 USD/t**\n- × 23 Kč/USD = **5 070 Kč/t** (przed transportem i marżami)\n\nUwaga — **UK imperial bushel** (36,37 l) jest o 3% większy niż buszel US, ale w rolnictwie dziś absolutnie dominuje standard US.\n\nZob. też [[hektolitr]] (europejski odpowiednik jednostki jakościowej), [[q-cent]], [[tuna]], [[libra]], [[akr]].",
    "alias": [
      "bushel",
      "bu",
      "buszel amerykański"
    ],
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
    "kategorie": "jednotky",
    "shortDef": "Jitro to historyczna środkowoeuropejska jednostka powierzchni ≈ 0,5755 ha (austriackie/czeskie jitro = 1600 sążni kwadratowych). Powierzchnia, którą para wołów może zaorać w ciągu dnia. Dziś przestarzałe, ale w zapisach katastralnych i rodzinnej pamięci wciąż obecne.",
    "longDef": "Jitro (łac. *jugerum*, niem. *Joch*) to tradycyjna środkowoeuropejska jednostka powierzchni, której wielkość historycznie różniła się w zależności od regionu. W ziemiach czeskich i Austro-Węgrzech obowiązywało znormalizowane **austriackie (dolnoaustriackie) jitro = 1600 sążni kwadratowych = 5754,642 m² ≈ 0,5755 ha**.\n\nGłówne warianty regionalne:\n- **Austriackie/czeskie jitro**: 5 754,64 m² = **0,5755 ha** (od roku 1764 w monarchii habsburskiej)\n- **Węgierskie jitro**: 5 754,64 m² (takie samo jak austriackie)\n- **Morawskie jitro krajowe**: 5 754,64 m² (ujednolicone z austriackim)\n- **Pruski morgen (Morgen)**: 2 553 m² ≈ 0,255 ha (zob. [[morgen]])\n- **Duże jitro**: czasem 1,5–1,75 ha (regionalne, nieoficjalne)\n\nEtymologia: jitro = powierzchnia, którą para wołów zorze od jutrzenki (rana) do południa. Dla pary wołów z drewnianym hakiem to było ok. 0,5–0,6 hektara na pół dnia — stąd zakres.\n\n**Dlaczego wciąż aktualne:**\n- **Kataster nieruchomości** — starsze zapisy z XIX i początku XX w. podają powierzchnię w jitrach i sążniach kwadratowych. Przy dziedziczeniu i przenoszeniu gruntów wciąż się z nimi spotykamy.\n- **Pamięć rodzinna** — rodziny rolnicze pamiętają obszary przodków w jitrach (\"dziadek miał 12 jiter\", tj. ≈ 6,9 ha).\n- **Pogranicze** — stare pruskie, bawarskie, saskie mapy używały *Morgen* (≈ 0,25 ha), co czasem myli się z jitrem.\n\nPraktyczne przeliczenia:\n- **1 jitro = 0,5755 ha = 57,55 a = 5 754 m²**\n- **1 jitro ≈ 1,422 akra** (anglosasowego)\n- **2 jitra = 1,151 ha** (tradycyjne \"chłopskie gospodarstwo\" miało 20–40 jiter, tj. 12–23 ha)\n\nW dzisiejszym katastrze ČR jitra **zastąpione m² i hektarami** (rozporządzenie o katastrze), ale stare liczby w zapisach ksiąg wieczystych są nadal prawnie wiążące.\n\nZob. też [[hektar]], [[ar]], [[korec]], [[strych]], [[lan]], [[morgen]].",
    "alias": [
      "historyczna jednostka powierzchni",
      "austriackie jitro"
    ],
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
    "term": "Łan",
    "kategorie": "jednotky",
    "shortDef": "Łan to średniowieczna czeska jednostka powierzchni ≈ 18 ha (ściślej 16–24 ha w zależności od regionu). Powierzchnia chłopskiego gospodarstwa utrzymująca jedną rodzinę. Dziś przestarzałe, ale historycznie fundamentalna jednostka.",
    "longDef": "Łan to historyczna czeska jednostka powierzchni, używana od wczesnego średniowiecza do XVIII w. Wielkość łanu znacznie różniła się w zależności od regionu, okresu i rodzaju (chłopski/królewski/kmiecy), ale w standardzie z urbariusza obowiązywało:\n\n**Czeski łan (kmiecy, chłopski)**: zazwyczaj 64 strychy ≈ **18 ha** (16–24 ha w praktyce).\n\nRodzaje łanów:\n- **Łan kmiecy (chłopski)** — 60–64 strychy ≈ 16–20 ha, gospodarstwo poddanego chłopa\n- **Łan królewski** — 70–84 strychy ≈ 19–24 ha, nieco większy\n- **Łan praski** — znormalizowany na 64 strychy ≈ 18,2 ha\n- **Łan morawski** — zmienny, 16–21 ha\n- **Półłanek** — połowa łanu, mniejsze gospodarstwo (8–10 ha)\n- **Ćwierćłanek** — ćwierć łanu, zagrodnicy (4–5 ha)\n- **Zagrodnik** — bez łanu, tylko dom i ogród (< 1 ha)\n\nŁan był **podstawową jednostką ekonomiczno-społeczną** czeskiej wsi:\n- **Podatki i pańszczyzna** — obowiązki pańszczyźniane wymierzano według wielkości łanu (3 dni w tygodniu dla całego łanu).\n- **Status społeczny** — *łannik* (chłop z całym łanem) był najwyższą warstwą ludności poddanej.\n- **Dziedziczenie** — łan w Czechach zazwyczaj nie był dzielony (prawo niepodzielności), dziedziczył go jeden syn, pozostali szli do rzemiosła lub miasta.\n\nŁan składał się z wielu mniejszych działek (pola, łąki, pastwiska, lasy) rozsianych po katastrze gminy — typowy **system trójpolowy** (oziminy/jare/ugór) wymagał posiadania ziemi w kilku polach.\n\nPo **patentach Marii Teresy** (1755) i **katastrze józefińskim** (1789) łan stopniowo zastępowany był precyzyjniejszymi jitrami i m². W katastrze terezjańskim (1748) łany zostały konkretnie wymierzone — dlatego dziś znamy dokładne wielkości dla poszczególnych wsi.\n\nW nowoczesnym kontekście:\n- **Genealogia i rodowody** — stare wpisy metrykalne i urbarialne wymieniają przodków jako \"łannik\", \"półłannik\", \"zagrodnik\".\n- **Historia gmin** — kronikarze i regionaliści pracują z łanami przy opisie średniowiecznej struktury wsi.\n- **Nazwy miejscowe** — \"Velký lán\", \"Lánská cesta\", \"Na lánech\" to wciąż żywe nazwy miejscowe.\n\nUwaga — współczesne słowo \"łan\" jako synonim dużego pola (np. \"bezkresne łany zbóż\") jest już metaforyczne, nie oznacza konkretnej jednostki.\n\nZob. też [[jitro]], [[korec]], [[strych]], [[hektar]].",
    "alias": [
      "cały łan",
      "łan chłopski",
      "łan kmieci"
    ],
    "related": [
      "jitro",
      "korec",
      "strych",
      "hektar"
    ]
  },
  {
    "slug": "korec",
    "term": "Korzec",
    "kategorie": "jednotky",
    "shortDef": "Korzec to historyczna czeska jednostka powierzchni ≈ 0,2877 ha (28,77 a). Powierzchnia, na którą wysiewa się 1 korzec (miara objętości) zboża. W zapisach katastralnych i pamięci rodzinnej zachowany do dziś.",
    "longDef": "Korzec to historyczna czeska jednostka powierzchni, etymologicznie wywodząca się od **korca jako miary objętości zboża** (ok. 93 litrów). Korzec ziemi = powierzchnia, na którą wysiewa się 1 korzec nasion.\n\n**Znormalizowany czeski (praski) korzec**: 2 877,32 m² = **28,77 a ≈ 0,288 ha**.\n\nWarianty regionalne:\n- **Praski korzec**: 2 877 m² ≈ 0,288 ha (oficjalny od r. 1764)\n- **Morawski korzec**: zmienny, 1 920–2 880 m² (0,19–0,29 ha)\n- **Śląski korzec**: 2 877 m² (ujednolicony z praskim)\n- **Duży korzec** (leśny): czasem nawet 5 754 m² (= jedno jitro)\n\nZwiązek z innymi jednostkami historycznymi:\n- **1 jitro = 2 korce** (po 1 800 sążni kw. + zaokrąglenie regionalnie)\n- **1 strych = 1 korzec** (synonim w niektórych regionach, zob. [[strych]])\n- **1 łan = 60–64 korce** ≈ 17–18 ha\n\nW praktyce gospodarczej:\n- **Małe zagrodnicze siedliska**: 2–4 korce (= 0,6–1,2 ha)\n- **Średni majątek**: 20–40 korców (= 5,8–11,5 ha)\n- **Chłop-łannik**: 60+ korców = 1 łan = 17+ ha\n\n**Dlaczego korzec wciąż spotykamy:**\n- **Zapisy katastralne do roku 1869** używają korców i jiter. Stary wpis przy dziedziczeniu → natkniemy się na korce.\n- **Kroniki rodzinne i opowieści** — \"dziadek miał 8 korców przy potoku\" = ≈ 2,3 ha.\n- **Nazwy miejscowe** — \"Na korci\", \"Korecká louka\" są w ČR powszechne.\n- **Genealogia** — gruntowe księgi i urbaria (XVI–XIX w.) — powierzchnie w korcach/strychach.\n\nPraktyczne przeliczenia:\n- **1 korzec = 0,2877 ha = 28,77 a = 2 877 m²**\n- **1 korzec ≈ 0,711 akra**\n- **3,5 korca = 1 ha** (w zaokrągleniu)\n\nPo reformie metrycznej w ČSR (ustawa nr 268/1919 Sb.) korzec **oficjalnie zastąpiony hektarem i arem**. Dziś nie ma mocy prawnej jako jednostka, ale stare zapisy pozostają prawnie wiążące.\n\nZob. też [[strych]] (synonim w niektórych regionach), [[jitro]], [[lan]], [[hektar]], [[ar]].",
    "alias": [
      "czeski korzec",
      "praski korzec",
      "historyczna miara"
    ],
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
    "kategorie": "jednotky",
    "shortDef": "Strych to historyczna środkowoeuropejska jednostka powierzchni ≈ 0,288 ha (28,8 a), w zasadzie synonim czeskiego korca. Powierzchnia, na którą wysiewa się 1 strych (objętość) nasion. W katastrze terezjańskim i starych zapisach zachowany do dziś.",
    "longDef": "Strych to tradycyjna czeska i środkowoeuropejska jednostka powierzchni. Słowo pochodzi z niemieckiego *Strich* (= pas, rząd, wyznaczony pas ziemi). W wielu regionach strych jest **synonimem korca** — obie jednostki definiowano jako powierzchnię, na którą wysiewa się 1 strych/korzec (miara objętości ≈ 93 l) zboża.\n\n**Czeski strych**: 2 877 m² ≈ **0,288 ha** (identyczny z praskim korcem).\n\nWarianty regionalne:\n- **Czeski/praski strych**: 2 877 m² ≈ 0,288 ha\n- **Morawski strych**: 1 920–2 880 m² (0,19–0,29 ha) — zmienny\n- **Śląski strych**: 2 877 m² (ujednolicony z czeskim po patentach Marii Teresy)\n- **Duży strych** (leśny): nawet dwukrotność\n\nW niektórych regionach południowo-wschodniej Moraw i Słowacji strych był zdecydowanie mniejszy niż czeski korzec (≈ 0,2 ha) — dlatego zawsze w źródłach archiwalnych należy sprawdzić lokalną definicję.\n\n**Historyczne zastosowanie:**\n- **Kataster terezjański (1748)** — powierzchnie pól, łąk i pastwisk zapisane w strychach/jitrach.\n- **Patenty pańszczyźniane** — obowiązki pańszczyźniane wynikały z liczby strychów.\n- **Księgi urbarialne XVII–XVIII w.** — podatkowa ewidencja drobnej własności.\n\n**Związek z innymi jednostkami:**\n- **1 strych = 1 korzec** (w czeskiej standaryzacji po 1764)\n- **2 strychy = 1 jitro** (≈ 0,575 ha)\n- **64 strychy = 1 łan** (≈ 18 ha)\n- **3,48 strycha = 1 ha**\n\n**Dziś jeszcze spotykamy strych:**\n- **Kataster nieruchomości** — stare zapisy sprzed reformy metrycznej 1919.\n- **Genealogia / rodowody** — metryki i ksiegi gruntowe zawierają powierzchnie w strychach.\n- **Nazwy miejscowe** — \"Strychy\", \"Na strychu\", \"Strychová pole\" w niektórych gminach.\n\nPraktyczne przeliczenia:\n- **1 strych = 0,288 ha = 28,8 a = 2 877 m²**\n- **1 strych ≈ 0,712 akra**\n- **3,48 strycha = 1 hektar**\n\nPo reformie metrycznej w ČSR (1919) strych **oficjalnie zniesiony** jako obowiązująca jednostka. Do rozumienia starych dokumentów jednak niezbędny.\n\nZob. też [[korec]] (synonim), [[jitro]] (= 2 strychy), [[lan]], [[hektar]].",
    "alias": [
      "historyczny strych",
      "morawski strych"
    ],
    "related": [
      "korec",
      "jitro",
      "lan",
      "hektar"
    ]
  },
  {
    "slug": "tuna",
    "term": "Tona (t)",
    "kategorie": "jednotky",
    "shortDef": "Tona (t) to jednostka masy = 1 000 kg = 10 kwintali metrycznych (q). Standardowa jednostka w rolnictwie dla plonów roślin (t/ha), cen skupu towarów (Kč/t) i pojemności maszyn.",
    "longDef": "Tona metryczna (symbol **t**, czasem *Mg* — megagram) to jednostka masy = 1 000 kg = 10⁶ gramów. W SI tona to jednostka dopuszczona poza SI, ale faktycznie dominująca w praktycznym ważeniu w rolnictwie, handlu i przemyśle.\n\nPreliwiczenia:\n- **1 t = 1 000 kg = 10 q** (kwintali metrycznych)\n- **1 t ≈ 2 204,62 lb** (funtów angielskich)\n- **1 t ≈ 22,046 ton krótkich** (US short ton = 907,18 kg)\n- **1 t ≈ 0,9842 tony długiej (UK)** (long ton = 1 016 kg)\n- **1 t pszenicy ≈ 36,7 buszli** (US)\n- **1 t kukurydzy ≈ 39,4 buszla**\n\nZastosowanie w rolnictwie (standard CZ + EU):\n- **Plony roślin** — t/ha to dominująca jednostka. Pszenica 5–8 t/ha, kukurydza 8–12 t/ha, rzepak 3–4,5 t/ha, jęczmień 5–7 t/ha.\n- **Ceny skupu** — Kč/t. Przykład 2024: pszenica 4 800–5 500 Kč/t, kukurydza 3 800–4 500 Kč/t.\n- **Nawozy** — t/ha gnojowicy (15–25 t/ha), kg/ha NPK, ale opakowania dziś zazwyczaj w t (big-bag 600 kg ≈ 0,6 t, kontener 1 t).\n- **Pojemność maszyn** — naczepa 14–24 t, zbiornik kombajnu 8–13 m³ ≈ 6–10 t zboża.\n- **Handel międzynarodowy** — ceny CBOT, MATIF, FOB w USD/t, EUR/t.\n\nPraktyczne przykłady:\n- Pole 50 ha pszenicy × 6,5 t/ha = 325 t = **6,5 wagonu kolejowego** (wagon ~50 t)\n- Zbiór kukurydzy 100 ha × 10 t/ha = 1 000 t = **40 naczep × 25 t**\n- Roczne zużycie nawozów gospodarstwo 500 ha: 250 t LAV + 100 t DAM = 350 t\n\n**Tona vs short ton (US/UK):**\nW handlu międzynarodowym uwaga — amerykański *short ton* (2 000 lb) ma tylko 907 kg, *long ton* (UK, 2 240 lb) ma 1 016 kg. Czytając raporty USDA lub źródła amerykańskie, zawsze sprawdź, która \"ton\" jest użyta. **CBOT i handel EU używa wyłącznie tony metrycznej (t)**.\n\nZob. też [[q-cent]] (= 0,1 t), [[kilogram]], [[busl]] (przelicznik towarowy).",
    "alias": [
      "t",
      "tona metryczna",
      "megagram"
    ],
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
    "kategorie": "jednotky",
    "shortDef": "Kilogram (kg) to podstawowa jednostka masy w SI. W rolnictwie kluczowy dla dawkowania nawozów (kg/ha), masy zwierząt, cen pasz i opakowań (kg/bela kiszonki, kg/worek nasion).",
    "longDef": "Kilogram (kg) to **podstawowa jednostka masy w układzie SI**. Od 2019 r. definiowany za pomocą stałej Plancka (h = 6,62607015 × 10⁻³⁴ J·s), wcześniej definiowany jako masa międzynarodowego wzorca przechowywanego w Sèvres koło Paryża.\n\nPreliwiczenia:\n- **1 kg = 1 000 g = 1 000 000 mg**\n- **1 kg = 0,001 t = 0,01 q**\n- **1 kg ≈ 2,2046 lb** (funt)\n- **1 kg ≈ 35,274 oz** (uncja, USA/UK)\n\nZastosowanie w rolnictwie:\n- **Dawkowanie nawozów** — kg/ha czystych składników. Przykład: pszenica ozima 150 kg N/ha, kukurydza 180 kg N/ha. Uwaga: kg składnika ≠ kg nawozu (LAV ma 27,5% N → 150 kg N = 545 kg LAV/ha).\n- **Dawkowanie oprysków** — kg/ha dla preparatów granulowanych i zapraw nasiennych. Przykład: Roundup 360 SL jest ciekły (l/ha), ale glifosat w formie soli podawany w g/ha (720 g s.a./ha).\n- **Masa zwierząt** — cielęta 35–45 kg przy urodzeniu, dorosłe mleczne krowy 600–750 kg, byk hodowlany 1 000+ kg.\n- **Ceny pasz** — Kč/kg dla premiksów i koncentratów (10–30 Kč/kg), Kč/t dla zwykłych mieszanek paszowych.\n- **Nasiona** — pszenica 180–220 kg/ha, kukurydza 22–28 kg/ha (znacznie mniejsza dawka — większe ziarno).\n- **Opakowania produktów** — worki nawozów 25/40/50 kg, big-bag 500–1 200 kg, bele kiszonki 600–800 kg.\n\n**Waga hektolitrowa** — kg/hl to parametr jakościowy zboża (zob. [[hektolitr]]). Pszenica spożywcza 78+ kg/hl, paszowa < 74 kg/hl.\n\n**Pomiar masy żywej vs masa rzeźna:**\n- **Masa żywa** (LW — Live Weight) = masa zwierzęcia na wadze\n- **Masa rzeźna** (CW — Carcass Weight) = masa tuszy po uboju\n- Stosunek CW/LW: bydło ~55–60%, świnia ~75%, drób ~70%\n\nPraktyczne porównania:\n- **Worek cementu**: 25 kg\n- **Worek pszenicy (nasion)**: 25 kg (standardowe opakowanie)\n- **Big-bag nawozu**: 600 kg\n- **Cielę**: 40 kg\n- **Dojnica mleczna**: 650 kg\n- **Duży ciągnik (Fendt 1050)**: ~13 000 kg\n- **Naczepa Joskin Trans-CAP pełna gnojowicy**: ~30 000 kg (= 30 t)\n\nZob. też [[tuna]] (= 1 000 kg), [[q-cent]] (= 100 kg), [[libra]] (USA/UK).",
    "alias": [
      "kg",
      "kilo"
    ],
    "related": [
      "tuna",
      "q-cent",
      "libra",
      "hektolitr"
    ]
  },
  {
    "slug": "libra",
    "term": "Funt (pound, lb)",
    "kategorie": "jednotky",
    "shortDef": "Funt (pound, lb) to anglosaska jednostka masy = 0,4536 kg. Standardowa jednostka w USA, Wielkiej Brytanii, Kanadzie i Australii. W rolnictwie spotykana w raportach USDA, cenach CBOT i opakowaniach amerykańskich pasz.",
    "longDef": "Funt (ang. *pound*, skr. *lb* z łaciny *libra*) to tradycyjna anglosaska jednostka masy. **Funt międzynarodowy** (zdefiniowany od 1959 r.) = **0,45359237 kg** dokładnie.\n\nPreliwiczenia:\n- **1 lb = 0,4536 kg** (dokładnie 0,45359237)\n- **1 lb = 16 oz** (uncji)\n- **1 kg ≈ 2,2046 lb**\n- **1 t ≈ 2 204,62 lb**\n- **1 short ton (US)** = 2 000 lb = 907,18 kg\n- **1 long ton (UK)** = 2 240 lb = 1 016 kg\n- **1 buszel pszenicy** = 60 lb = 27,2155 kg\n\nHistorycznie istniały dziesiątki regionalnych funtów (aptekarski lb 373 g, troy lb 373 g, French livre 489 g, ...), ale dziś w praktyce tylko **funt międzynarodowy (0,4536 kg)** w handlu anglosaskiemu.\n\n**Gdzie funt w rolnictwie z ČR:**\n- **Raporty USDA** — WASDE, publikacje ERS podają ceny w ¢/lb dla niektórych towarów (bawełna, masło, ser).\n- **Futures CBOT** — olej sojowy kwotowany w ¢/lb (ok. 45–60 ¢/lb w 2024). Bydło żywe (live cattle) handlowane w ¢/lb (ok. 180–200 ¢/lb).\n- **Pasze premiksy i dodatki** — źródła amerykańskie podają dawki w lb/głowę/dzień.\n- **Genetyka i rejestry hodowlane** — masy buhajów hodowlanych i krów w lb (rejestr US Holstein).\n- **Outdoor / łowiectwo / wędkarstwo** — w ČR popularny \"funt\" dla oznaczenia dużych ryb (karp 20+ lb = trofeum).\n\nPreliczeń cen CBOT:\n- Olej sojowy 50 ¢/lb = 0,50 USD/lb × 2,2046 = **1,10 USD/kg** = **1 100 USD/t**\n- Live cattle 200 ¢/lb = 2,00 USD/lb × 2,2046 = **4,41 USD/kg** masy żywej\n\n**Uwaga — funt ≠ kilogram:**\nCzęste błędy w tłumaczeniach przepisów i tabel paszowych. Amerykanin pisze \"180 lb cow\" = 82 kg cielęcia (chodziło o cielę, nie krowę!). Dorosła krowa US = 1 200–1 400 lb = 545–635 kg.\n\nDla rolnika z ČR praktyczna pomoc: **lb × 0,5** daje szybkie przybliżenie w kg (dokładniej × 0,4536, ale lb × 0,5 wystarczy do obliczeń w pamięci). Przykład: 2 000 lb ≈ 1 000 kg (faktycznie 907 kg).\n\nZob. też [[kilogram]] (SI), [[tuna]], [[busl]] (= 60 lb dla pszenicy).",
    "alias": [
      "pound",
      "lb",
      "angielski funt"
    ],
    "related": [
      "kilogram",
      "tuna",
      "busl"
    ]
  },
  {
    "slug": "morgen",
    "term": "Morgen",
    "kategorie": "jednotky",
    "shortDef": "Morgen to historyczna niemiecka/austriacka jednostka powierzchni. Pruski morgen = 0,2553 ha, bawarski = 0,3407 ha, austriacki = 0,5755 ha (= austriackie jitro). Na pograniczu i w starych zapisach wciąż obecny.",
    "longDef": "Morgen (niem. \"rano\") to historyczna środkowoeuropejska jednostka powierzchni, zdefiniowana jako plocha, którą para wołów może zaorać jednego ranka (jitro). Podobnie jak czeskie [[jitro]], wielkość znacznie różniła się w zależności od regionu — Niemcy były do 1872 r. podzielone na dziesiątki krajów, każdy z własną miarą.\n\nGłówne warianty (przed reformą metryczną):\n- **Pruski morgen** (magdeburski): 2 553,2 m² ≈ **0,2553 ha**\n- **Bawarski morgen**: 3 407,3 m² ≈ **0,3407 ha**\n- **Saski morgen**: 2 767 m² ≈ 0,277 ha\n- **Heski morgen**: 2 500 m² (zaokrąglony do 0,25 ha w XIX w.)\n- **Wirtemberski morgen**: 3 152 m² ≈ 0,315 ha\n- **Austriacki/dolnoaustriacki morgen** (= jitro): 5 754,6 m² ≈ **0,5755 ha**\n\nPo **reformie metrycznej w Cesarstwie Niemieckim (1872)** morgen oficjalnie zniesiony, ale w potocznym języku i zapisach katastralnych niektórych regionów przetrwał do dziś — **zwłaszcza na północy Niemiec** (Meklemburgia, Saksonia) starsze pokolenia podają powierzchnie w morgenach.\n\n**Dlaczego istotny dla rolnika z ČR:**\n- **Pogranicze** (Szumawa, Karkonosze, Rudawy, południowe Morawy) — stare mapy niemieckie z czasów Austro-Węgier i sprzed 1945 r. podawały powierzchnie w morgenach. Przy restitucjach i sporach katastralnych natkniesz się na nie.\n- **Zakup gruntów w DE** — zagraniczni sprzedawcy/ogłoszenia w północnych Niemczech czasem podają morgeny (zwł. leśnictwo).\n- **Pruskie mapy katastralne** — historyczne badania własności Sudetów, dóbr lichtensztejnskich itp.\n\nPraktyczne przeliczenia (najczęstszy — pruski morgen):\n- **1 pruski morgen = 0,2553 ha = 25,53 a = 2 553 m²**\n- **1 pruski morgen ≈ 0,631 akra**\n- **4 pruskie morgeny ≈ 1 ha**\n- **1 ha = 3,92 pruskiego morgena**\n\nUwaga — **austriacki morgen** to zupełnie co innego (= austriackie jitro = 0,5755 ha). Przy czytaniu starych map zawsze najpierw ustal, z jakiego kraju pochodzi mapa.\n\nW dzisiejszej formalnej ewidencji **morgen nie ma żadnej mocy prawnej** ani w Niemczech, ani w ČR.\n\nZob. też [[jitro]] (wariant austriacki), [[akr]], [[hektar]], [[korec]].",
    "alias": [
      "pruski morgen",
      "niemieckie jitro",
      "Morgen"
    ],
    "related": [
      "jitro",
      "akr",
      "hektar",
      "korec"
    ]
  },
  {
    "slug": "turbodmychadlo",
    "term": "Turbosprężarka",
    "kategorie": "pohon",
    "shortDef": "Turbosprężarka wykorzystuje energię spalin do obrócenia turbiny, która sprężą powietrze do cylindra — wyższa moc z tej samej pojemności silnika.",
    "longDef": "Turbosprężarka (turbo, turbocharger) to para połączonych wirników — turbina po stronie wydechowej i sprężarka po stronie dolotu. Spaliny obracają turbinę (nawet 200 000 obr/min), połączony wał napędza sprężarkę, która sprężą zasysane powietrze przed wejściem do cylindra.\n\nSkutki dla silnika:\n- **+30–50% mocy z tej samej pojemności** w porównaniu z silnikiem wolnossącym.\n- **Wyższy moment obrotowy przy niskich obrotach** (kluczowe przy pracach pociągowych).\n- **Lepsza sprawność** na większych wysokościach (kompensuje rzadsze powietrze).\n\nNowoczesne silniki ciągnikowe stosują:\n- **VGT** (Variable Geometry Turbo) — zmienna geometria łopatek turbiny, optymalny doładowanie w szerszym zakresie obrotów.\n- **Twin-turbo** (szeregowe lub równoległe) w topowych silnikach (Fendt 1000, JD 9R) — pierwsze turbo dla niskich obrotów, drugie dla wysokich.\n- **Intercooler** (chłodnica powietrza doładowującego) za turbo — chłodzi sprężone gorące powietrze, gęstsza ładunek, wyższa moc.\n\nKonserwacja: regularna wymiana oleju (turbo ma łożyska smarowane olejem silnikowym), po wyłączeniu silnika turbo dociera jeszcze 30+ sekund — dlatego nie można wyłączać natychmiast po pełnym obciążeniu (ryzyko uszkodzenia łożysk). Żywotność przy dobrej konserwacji 10 000+ motogodzin.",
    "alias": [
      "turbo",
      "turbocharger",
      "doładowanie"
    ],
    "related": [
      "common-rail",
      "dpf"
    ]
  },
  {
    "slug": "egr",
    "term": "EGR",
    "kategorie": "pohon",
    "shortDef": "EGR (Exhaust Gas Recirculation) kieruje część spalin z powrotem do dolotu — obniża temperaturę spalania i tym samym powstawanie tlenków azotu (NOx).",
    "longDef": "EGR to układ oczyszczania spalin, który recyrkuluje 5–30% spalin z powrotem do kolektora dolotowego. Powód: niższa temperatura spalania → mniej NOx (tlenków azotu) w spalinach.\n\nZastosowanie w ciągnikach:\n- **Stage IIIA–IIIB** (2006–2014): główna ścieżka redukcji NOx. EGR + DPF.\n- **Stage IV+** (2014+): EGR uzupełniony lub zastąpiony SCR (AdBlue). Wyższa sprawność.\n\nWady EGR:\n- **Sadza w dolocie** — recyrkulowane spaliny zawierają PM, stopniowo osadzają się w zaworze EGR i kolektorze dolotowym. Po 5–8 000 motogodzinach zazwyczaj wymaga czyszczenia (5–15 000 Kč).\n- **Obniżenie mocy o 3–5%** — recyrkulowane spaliny zmniejszają stężenie tlenu.\n- **Wyższe zużycie** o 2–4% w porównaniu z silnikiem bez EGR.\n\nDlatego producenci przy Stage V przeszli na SCR jako dominującą ścieżkę — wyższy koszt zakupu, ale niższy eksploatacyjny (mniej paliwa, mniej napraw).",
    "alias": [
      "Exhaust Gas Recirculation",
      "recyrkulacja spalin"
    ],
    "related": [
      "scr-katalyzator",
      "dpf",
      "emisni-normy-stage"
    ]
  },
  {
    "slug": "biopal",
    "term": "Biopaliwo / Biodiesel",
    "kategorie": "pohon",
    "shortDef": "Biodiesel to paliwo z olejów roślinnych (ester metylowy rzepaku, FAME) — w ČR obowiązkowo dodawany do zwykłego oleju napędowego (B7 = 7% FAME).",
    "longDef": "Biodiesel to odnawialne paliwo produkowane przez estryfikację olejów roślinnych (najczęściej olej rzepakowy w ČR, sojowy w USA, palmowy w Azji) lub tłuszczów zwierzęcych z metanolem → FAME (Fatty Acid Methyl Ester).\n\nW Europie:\n- **B7** — 7% FAME w zwykłym oleju napędowym. Standardowe paliwo na stacjach benzynowych od ok. 2010 r. Kompatybilne ze wszystkimi nowoczesnymi silnikami.\n- **B30 / B100** — 30% lub 100% FAME. Wymaga specjalnych uszczelek + oleju, nie każdy silnik jest certyfikowany. Niższa wartość opałowa (ok. −7%) → wyższe zużycie.\n\nDla rolników:\n- **Olej napędowy (z dystrybutora)** w ČR to zawsze B7 = zawiera FAME.\n- **Własne biopaliwa** (uprawa + tłoczenie rzepaku) — możliwe, ale ryzyko uszkodzenia wtryskiwaczy Common Rail przy niewystarczającym oczyszczeniu.\n- **Silniki Stage V** zazwyczaj certyfikowane dla B7. Wyższe stężenia (B30+) wymagają zgody producenta.\n\nUwaga: starsze silniki Common Rail mogą mieć problemy nawet z B7 — FAME ma inne właściwości smarne, wyższą przewodność (ryzyko korozji galwanicznej). W ciągnikach z lat 90. z mechanicznymi pompami zagrożenie nie istnieje.",
    "alias": [
      "biodiesel",
      "FAME",
      "B100",
      "B7"
    ],
    "related": [
      "common-rail"
    ]
  },
  {
    "slug": "powr-quad",
    "term": "PowrQuad / Quad-Shift",
    "kategorie": "technologie",
    "shortDef": "PowrQuad to skrzynia biegów John Deere łącząca 4 mechaniczne zakresy × 4 hydraulicznie zmieniane stopnie = 16 do przodu / 16 do tyłu. Podzbiór skrzyń powershift.",
    "longDef": "PowrQuad (nazwa handlowa John Deere) to skrzynia biegów z mechanicznymi głównymi zakresami (range A, B, C, D) × 4 hydraulicznie zmieniane stopnie w każdym zakresie = 16×16 lub 24×24 z dodatkową nadbudową.\n\nRodzaje skrzyń John Deere (od podstawy po flagship):\n1. **SyncReverser** — manualna zmiana biegów, mechaniczny rewers. Podstawa.\n2. **PowrReverser** — manualna zmiana biegów, hydrauliczny rewers (= power shuttle).\n3. **PowrQuad** — 4 mechaniczne × 4 powershift = 16×16. Standard dla serii 6M.\n4. **AutoQuad** — PowrQuad + automatyczna zmiana stopni. Wygodniejszy.\n5. **AutoPowr / IVT** — w pełni bezstopniowa CVT. Flagship 6R+/7R/8R.\n\nEkwiwalenty konkurencji:\n- Case IH Maxxum **ActiveDrive 8** (16×8 powershift).\n- New Holland **Range Command** (16×6 powershift).\n- Fendt **Vario** (CVT — nie powershift).\n\nDla rolnika z ČR: PowrQuad to złoty środek między ceną a komfortem — 200–300 tys. Kč tańszy niż AutoPowr CVT, ale zmienia biegi pod obciążeniem. Opłaca się przy orce i pracach pociągowych, gdzie kierowca rzadko zmienia biegi.",
    "alias": [
      "power shuttle",
      "IVT",
      "AutoPowr"
    ],
    "related": [
      "cvt-prevodovka",
      "powershift"
    ]
  },
  {
    "slug": "nase-fronta",
    "term": "Przedni układ zawieszenia / Przedni TUZ",
    "kategorie": "technologie",
    "shortDef": "Przedni układ zawieszenia to hydrauliczny zawieszenie opcjonalnie montowany z przodu ciągnika — umożliwia \"kanapkowe\" stosowanie maszyn z przodu i z tyłu jednocześnie.",
    "longDef": "Przedni trzypunktowy układ zawieszenia (front linkage) to odpowiednik tylnego TUZ, montowany przed przednią osią. Często połączony z przednim WOM (wałem odbioru mocy).\n\nGłówne zastosowania:\n- **Kosiarka + prasa** — przednia kosiarka kosi, tylna prasa pakuje. Jednym przejazdem = podwójna wydajność.\n- **Przednie wały / brony + pług** — równoległe uprawianie gleby.\n- **Przedni wał po orce + siew nawozów** — połączony przejazd.\n- **Przednia wciągarka / urządzenia leśne** — do pracy w terenach górskich.\n\nParametry:\n- **Udźwig** zazwyczaj 2 000–5 000 kg (mniej niż tylny 6 000–12 000 kg).\n- **Skok opuszczania** krótszy (ok. 700 mm) — maszyny frontowe mają mniejszą widoczność.\n- **WOM** te same standardy (540 / 1000 obr/min).\n\nAspekt cenowy:\n- Fabryczny front linkage 80 000–200 000 Kč dopłaty.\n- Doposażenie (od dostawców jak Sauter, Hauer, Lely) 60 000–180 000 Kč + montaż.\n\nDla gospodarstwa w ČR < 50 ha rzadko kiedy opłacalny — sprawdza się głównie przy > 100 ha łąk/koniczyny lub specjalistycznych pracach.",
    "alias": [
      "przedni trzypunkt",
      "frontale",
      "front PTO"
    ],
    "related": [
      "tribod",
      "pto"
    ]
  },
  {
    "slug": "ndvi",
    "term": "Wskaźnik NDVI",
    "kategorie": "precise-farming",
    "shortDef": "NDVI to satelitarny wskaźnik biomasy uprawy — obliczany ze stosunku czerwonego i bliskiego podczerwieni. Wartości 0 (gołe gleba) do 1 (gęsta zdrowa roślinność).",
    "longDef": "NDVI (Normalized Difference Vegetation Index) to wskaźnik wegetacji stosowany w teledetekcji. Wzór: NDVI = (NIR − RED) / (NIR + RED), gdzie NIR = bliskie podczerwone, RED = czerwone.\n\nZasada: zdrowe rośliny silnie odbijają NIR (ze względu na strukturę komórkową liści) i pochłaniają RED (ze względu na chlorofil). Gołe gleba lub chore rośliny odbijają jedno i drugie podobnie → niski NDVI.\n\nWartości:\n- **NDVI < 0**: woda, śnieg, chmura.\n- **0–0,2**: gołe gleba, skała.\n- **0,2–0,4**: rzadka roślinność, młoda uprawa.\n- **0,4–0,6**: średnio gęsta uprawa.\n- **0,6–0,8**: gęsta zdrowa uprawa (szczyt wegetacji).\n- **0,8+**: bardzo gęsty łan (las, dorodna uprawa).\n\nDla rolnictwa:\n- **Mapy aplikacyjne** do zmiennego nawożenia/oprysku — gdzie NDVI jest niski, daj więcej N.\n- **Monitoring rozwoju uprawy** — śledzenie wzrostu vs oczekiwania.\n- **Wykrywanie stresu** (susza, choroba) — spadek NDVI w środku sezonu wegetacyjnego.\n\nŹródła danych:\n- **Sentinel-2** (ESA, bezpłatny) — rozdzielczość 10 m, zdjęcia co 5 dni. Standard dla rolnika z ČR.\n- **Planet Labs** (płatny, 3 m rozdzielczości) — codzienne zdjęcia, dla precision farming.\n- **Drony** z kamerą wielospektralną — własne loty, rozdzielczość 5 cm.",
    "alias": [
      "Normalized Difference Vegetation Index",
      "satelitarny wskaźnik wegetacji"
    ],
    "related": [
      "variable-rate",
      "gps-rtk"
    ]
  },
  {
    "slug": "ctf",
    "term": "CTF (Controlled Traffic Farming)",
    "kategorie": "precise-farming",
    "shortDef": "CTF to metoda, w której wszystkie maszyny (ciągnik, opryskiwacz, kombajn) jeżdżą stale po tych samych stałych śladach — reszta pola pozostaje nieugnieciona.",
    "longDef": "Controlled Traffic Farming (CTF) to zasada rolnictwa precyzyjnego, w której ogranicza się powierzchnię ugniecioną przez koła maszyn — wszystkie maszyny jeżdżą po identycznych śladach (tramlines), reszta pola pozostaje nietknieta.\n\nWymagania wstępne:\n- **RTK GPS auto-steering** (centymetrowa dokładność) — bez niego koła nie utrzymają dokładnie śladów.\n- **Taki sam / wielokrotny rozstaw kół** wszystkich maszyn — typowo 3 m (opryskiwacz) i 6 m (kombajn) = 6 m szerokości opryskiwacza + 6/12/24 m szerokości siewnika.\n- **Taki sam prześwit kół** (track width) — typowo 2,25 m lub 3,00 m.\n\nZalety:\n- **Redukcja ugniecenia** o 60–80% — reszta pola nigdy nie jest przejeżdżana.\n- **Wyższe plony** 5–15% dzięki lepszej strukturze gleby w międzyrzędziach.\n- **Mniej paliwa** — mniej pracy przy uprawie ugniatanej gleby.\n- **Lepsza infiltracja wody** — mniej erozji.\n\nWady:\n- **Wysoka inwestycja początkowa** — system RTK GPS + zunifikowanie maszyn (rozstaw kół) może kosztować 500K – 2M Kč dla gospodarstwa.\n- **Komplikacje przy wymianie maszyny** — nowy kombajn musi mieć taki sam rozstaw kół.\n- **W ČR mało rozpowszechnione** — wymaga dużych pól (>50 ha ciągłych) dla ekonomicznej opłacalności.",
    "alias": [
      "controlled traffic",
      "stałe ślady kół"
    ],
    "related": [
      "gps-rtk",
      "auto-steering",
      "variable-rate"
    ]
  },
  {
    "slug": "yield-monitor",
    "term": "Monitor plonu / Mapa plonów",
    "kategorie": "precise-farming",
    "shortDef": "Monitor plonu to czujnik w kombajnie, który podczas żniw mierzy przepływ ziarna i pozycję GPS → tworzy mapę plonów pola.",
    "longDef": "Monitor plonu to zintegrowany układ w kombajnie, który ciągle mierzy:\n1. **Masę ziarna** przepływającego przez elevator (zazwyczaj optyczny lub udarowy czujnik).\n2. **Wilgotność ziarna** (czujnik pojemnościowy lub NIR) — do przeliczenia na masę \"suchą\".\n3. **Szerokość stołu** + **prędkość** = aktualna powierzchnia na sekundę.\n4. **Pozycję GPS** co 1–2 sekundy.\n\nWynik: dane punktowe (lat, lng, kg/m²) → interpolacja do siatki → **mapa plonów pola**.\n\nGłówne marki:\n- **John Deere GreenStar / Operations Center** — dominujący w USA, OK w EU.\n- **Case IH AFS / NH IntelliView** — wspólny ekosystem CNH.\n- **Claas TELEMATICS** — premium EU.\n- **Trimble FmX / AGCO Fuse** — trzeciostronne, kompatybilne z wieloma markami.\n\nDla gospodarstwa z ČR:\n- **Bez monitora plonu kombajn za 8M Kč = tylko maszyna żniwna**, nie stacja danych.\n- Mapa plonu za 1 sezon = podstawa dla **VRA (variable rate)** w następnym roku — więcej P/K tam, gdzie potrzeba, mniej tam, gdzie nie.\n- ROI 2–3 sezony dla gospodarstwa > 100 ha.\n\nPraktyczne wskazówki: kalibracja 1×/sezon na samochodzie wagowym (błąd 1–3%), czujnik wilgotności czyścić codziennie (zapylony czujnik = przesunięte dane).",
    "alias": [
      "monitor plonu",
      "yield mapping"
    ],
    "related": [
      "variable-rate",
      "gps-rtk",
      "ndvi"
    ]
  },
  {
    "slug": "dap",
    "term": "DAP (Diafosforan amonu)",
    "kategorie": "hnojivo",
    "shortDef": "DAP (diafosforan amonu) to granulowany nawóz z 18% azotem i 46% fosforem (P₂O₅). Główne źródło fosforu w rolnictwie czeskim.",
    "longDef": "DAP to wysoko skoncentrowany nawóz fosforowy (Diamonium Phosphate, chemicznie (NH₄)₂HPO₄) z zawartością 18% N i 46% P₂O₅. Produkowany przez reakcję kwasu fosforowego z amoniakiem.\n\nZastosowanie:\n- **Startowy do nasion** — 100–200 kg/ha, wstrzykiwany razem z nasionami w rzędy. Wysoki fosfor wspiera rozwój systemu korzeniowego młodej rośliny.\n- **Jesienny pod oziminy** — 150–300 kg/ha, przyorany. Fosfor porusza się w glebie powoli, dlatego stosuje się go głęboko i z wyprzedzeniem.\n- **Wiosenny pod jare** — rzadziej stosowany, fosfor nie powinien pozostawać na powierzchni.\n\nWłaściwości:\n- **Lekko kwaśna reakcja** w glebie (pH ok. 6) — odpowiedni dla gleb neutralnych do lekko zasadowych.\n- **Wysoka rozpuszczalność w wodzie** — natychmiast dostępny dla rośliny (w odróżnieniu od MAP).\n- **Cena 2024**: ok. 16 000–22 000 Kč/t.\n\nUwaga: na glebach zasadowych (pH > 7,5) fosfor szybko przechodzi w formy nierozpuszczalne (sole wapniowe) → krótki czas działania. W takim przypadku lepiej użyć MAP lub superfosfatu.",
    "alias": [
      "DAP",
      "diafosforan amonu",
      "18-46-0"
    ],
    "related": [
      "npk-hnojivo",
      "pH-pudy"
    ]
  },
  {
    "slug": "roundup",
    "term": "Roundup (glifosat)",
    "kategorie": "agrotechnika",
    "shortDef": "Glifosat (handlowy Roundup) to nieselektywny systemiczny herbicyd — niszczy wszystkie rośliny po oprysku. Dominujący herbicyd w rolnictwie polskim na ugory.",
    "longDef": "Glifosat jest najszerzej stosowanym herbicydem na świecie, sprzedawanym pod marką Roundup (Monsanto/Bayer) oraz jako generyki. Nieselektywny = niszczy każdą roślinę, systemiczny = wchłaniany przez liście i transportowany do korzeni.\n\nZastosowanie w Polsce:\n- **Ugór przed siewem** — oczyszcza pole z chwastów i ścierniska.\n- **Pre-emergence** przed wschodami rośliny uprawnej — 1–2 dni wcześniej.\n- **Desykacja** (osuszanie) rzepaku ozimego i zbóż przed żniwami — przyspiesza dojrzewanie, w Polsce nie jest oficjalnie zatwierdzona do stosowania na produktach spożywczych.\n- **Drzewostany leśne** — przeciwko chwastom poręby.\n\nCeny (2024):\n- **Roundup Klasik 360 g/l** — ok. 200–280 Kč/l w kanistrze 20 l. Dawka 3–4 l/ha.\n- **Generyki** (Glyfogan, Touchdown, Clinic) — 150–220 Kč/l.\n\nKontrowersje:\n- **Autoryzacja UE** dla glyfosatu została w 2023 przedłużona o 10 lat (do 2033) — mimo silnego lobbingu (Greenpeace, IARC).\n- **Klasyfikacja IARC** „prawdopodobnie rakotwórczy dla człowieka” (2A) — kontrowersyjna, EFSA UE klasyfikuje jako bezpieczny przy przestrzeganiu dawek.\n- **Sprzedaż detaliczna w Polsce**: bez ograniczeń.\n- **Rolnictwo ekologiczne**: ściśle zabroniony.",
    "alias": [
      "glifosat",
      "glyphosate",
      "herbicyd totalny"
    ],
    "related": [
      "mezi-plodiny"
    ]
  },
  {
    "slug": "jednotna-zadost",
    "term": "Wniosek zbiorczy",
    "kategorie": "dotace",
    "shortDef": "Wniosek zbiorczy to coroczny formularz składany do ARiMR przez eWniosekPlus, który grupuje wszystkie płatności bezpośrednie WPR — BISS, CISS, EKO, ONW, VCS i Młody rolnik.",
    "longDef": "Wniosek zbiorczy to scentralizowany sposób, w jaki rolnik ubiega się o płatności bezpośrednie WPR. Przed 2014 rokiem składało się kilka odrębnych wniosków — wniosek zbiorczy ujednolicił ten proces.\n\nZawartość:\n- **Identyfikacja wnioskodawcy** + NIP/PESEL.\n- **Działki ewidencyjne** użytkowane — powierzchnia, kultura, uprawy.\n- **Wniosek o BISS** (płatność podstawowa) automatycznie.\n- **Wniosek o CISS** (redystrybucyjna) — automatycznie, jeśli powierzchnia spełnia wymogi.\n- **Schemat EKO** — wybór podstawowy / premium + deklaracja praktyk ekologicznych.\n- **ONW** (obszary o niekorzystnych warunkach) — automatycznie wg ewidencji działek.\n- **VCS** (sektory wrażliwe) — deklaracja powierzchni buraków cukrowych, ziemniaków, owoców, warzyw, chmielu, lnu, roślin białkowych.\n- **Bonus Młody rolnik** — deklaracja wieku i roku pierwszego wniosku.\n- **Zobowiązania AEKO** — wieloletnie działania rolno-środowiskowe.\n\nSkładanie:\n- **Termin**: zazwyczaj 1 marca – 15 maja (z tolerancją do 9 czerwca z sankcją 1%/dzień).\n- **Miejsce**: elektronicznie przez eWniosekPlus — wymagany podpis kwalifikowany lub profil zaufany.\n- **Pomoc**: oddziały powiatowe ARiMR bezpłatnie, prywatni doradcy 2 000–10 000 Kč.\n\nPo złożeniu:\n- **Maj–czerwiec**: ARiMR kontroluje deklaracje z ewidencją, monitoring satelitarny (Copernicus / SISAEC).\n- **Październik–grudzień**: wypłaty (wyższe zaliczki w październiku, dopłaty w grudniu).\n- **Sankcje**: za nieprawidłową deklarację, przekroczenie limitów, naruszenie wymagań ekologicznych → odliczenie 1–100%.",
    "alias": [
      "wniosek jednolity",
      "wniosek kombinowany",
      "wniosek SAPS"
    ],
    "related": [
      "biss",
      "cap-2024",
      "lpis"
    ]
  },
  {
    "slug": "aeko",
    "term": "AEKO (Działania rolno-środowiskowo-klimatyczne)",
    "kategorie": "dotace",
    "shortDef": "AEKO to wieloletnie (5-letnie) dobrowolne zobowiązania z ekologicznie przyjazną gospodarką — wypas, pasy biocenotyczne, zadarnianie, sady itp. Wyższe dopłaty niż schemat EKO.",
    "longDef": "AEKO (Działania rolno-środowiskowo-klimatyczne) to odrębny program dotacyjny w ramach WPR 2024, nagradzający 5-letnie zobowiązania do ekologicznie przyjaznych praktyk. Wyższe stawki niż schemat EKO, ale ostrzejsze zasady i sankcje za naruszenia.\n\nGłówne działania AEKO w Polsce 2024:\n- **Ochrona trwałych użytków zielonych (TUZ)** — koszenie w późniejszych terminach (po wylęgu ptaków), 2 100–6 000 Kč/ha w zależności od podtypu.\n- **Pasy biocenotyczne** — mieszanki kwitnące na polu, ok. 10 000 Kč/ha (więcej niż EFA).\n- **Korytarz ekologiczny** — ciągłe linie zieleni krajobrazowej, 8 000 Kč/ha.\n- **Rolnictwo ekologiczne (RE)** — certyfikowane bio, dodatkowe stawki na hektar według uprawy.\n- **Trwały wypas** — 2 800–5 200 Kč/ha według kategorii ONW.\n- **Zwiększone zadarnianie gruntów ornych** — przekształcenie GO na TUZ, rekompensata utraconych plonów.\n- **Sady ekstensywnych gatunków owocowych** — 5 200 Kč/ha.\n\nZasady:\n- **Umowa 5-letnia** — naruszenie = zwrot dopłat za wszystkie poprzednie lata.\n- **Niekompatybilności** — niektóre podtypy nie mogą być łączone (np. AEKO TUZ + intensywny wypas).\n- **Kontrola na miejscu** — inspekcja ARiMR 5–10% wnioskodawców rocznie + teledetekcja.\n\nDla polskiego rolnika:\n- AEKO opłaca się, jeśli rolnik ma długoterminową strategię (nastawienie na bio, kształtowanie krajobrazu, ochronę zasobów wodnych).\n- Dla klasycznej farmy intensywnej zwrot z inwestycji bywa gorszy niż EKO premium (więcej formalności, wyższe ryzyko sankcji).\n- Wnioskodawcom zalecamy najpierw złożyć **schemat EKO premium**, a następnie stopniowo dodawać podtypy AEKO według możliwości.",
    "alias": [
      "AEKO",
      "rolno-środowiskowe"
    ],
    "related": [
      "cap-2024",
      "eko-platba",
      "biopasy"
    ]
  },
  {
    "slug": "gaec",
    "term": "GAEC (Dobry Stan Rolny i Środowiskowy)",
    "kategorie": "regulace",
    "shortDef": "GAEC to obowiązkowe minimalne normy dla każdego wnioskodawcy płatności bezpośrednich WPR — zasady dla gleby, wody, krajobrazu. Naruszenie = sankcja.",
    "longDef": "GAEC (Good Agricultural and Environmental Conditions, pol. Dobry Stan Rolny i Środowiskowy) to zestaw obowiązkowych norm, które musi spełnić każdy wnioskodawca o płatności bezpośrednie WPR. Wcześniej nazywały się „cross-compliance” / „warunkowość”.\n\nNormy GAEC w Polsce 2024:\n- **GAEC 1**: Utrzymanie trwałych użytków zielonych — zakaz orki TUZ w Naturze 2000 i nieprzekraczanie ogólnokrajowego 5% spadku od 2018 r.\n- **GAEC 2**: Ochrona terenów podmokłych i torfowisk — zakaz odwadniania + ograniczenie orki na obszarach zalewowych.\n- **GAEC 3**: Zakaz wypalania ściernisk — ściernisko można jedynie mulczować / przyorywać / usuwać w balotach.\n- **GAEC 4**: Strefy buforowe wzdłuż cieków wodnych — min. 3 m bez nawozów/pestycydów, wzdłuż ujęć wody 25 m.\n- **GAEC 5**: Zarządzanie glebą przeciw erozji — obowiązkowe pasy przeciwerozyjne / rośliny okrywowe na pochyłych gruntach ornych powyżej określonego nachylenia.\n- **GAEC 6**: Minimalny pokrycie gleby — ściernisko lub roślina okrywowa od 1.11 do 28.02.\n- **GAEC 7**: Zmianowanie upraw — maks. 75% powierzchni tą samą uprawą + zakaz monokultury 4+ lata.\n- **GAEC 8**: Nieprodukcyjne obszary (EFA) — min. 7% powierzchni w elementach krajobrazowych, pasach biocenotycznych, roślinach poplonowych.\n- **GAEC 9**: Zakaz orki w lokalizacjach Natura 2000.\n\nSankcje za naruszenie:\n- **Drobne** (1× niespełniony GAEC, naprawione do terminu): odliczenie 1%.\n- **Standardowe**: odliczenie 3% z BISS + EKO.\n- **Poważne** (celowe naruszenie): odliczenie 5–15%.\n- **Powtarzające się**: 5% + utrata innych dopłat.\n\nKontrole: 1–5% wnioskodawców rocznie w formie fizycznej inspekcji + monitoring satelitarny (Copernicus SISAEC, identyfikuje naruszenia GAEC 5/6/7 zdalnie).",
    "alias": [
      "GAEC",
      "warunkowość",
      "cross-compliance"
    ],
    "related": [
      "cap-2024",
      "biss",
      "mezi-plodiny"
    ]
  },
  {
    "slug": "natura-2000",
    "term": "Natura 2000",
    "kategorie": "regulace",
    "shortDef": "Natura 2000 to europejska sieć obszarów chronionych — w Polsce ok. 20% powierzchni. Dla rolników oznacza ograniczenia (zakaz orki TUZ, strefy ochronne), ale też dodatkowe dopłaty.",
    "longDef": "Natura 2000 to sieć obszarów chronionych w UE, stworzona na podstawie dwóch dyrektyw: siedliskowej (1992) i ptasiej (1979). Cel: zachowanie bioróżnorodności kluczowych ekosystemów i gatunków.\n\nDwa typy lokalizacji w Polsce:\n- **SOO** (Specjalne Obszary Ochrony Siedlisk) — chroni siedliska roślin i owadów, cieki wodne, tereny podmokłe.\n- **OSO** (Obszary Specjalnej Ochrony Ptaków) — miejsca lęgowe i trasy przelotów zagrożonych gatunków.\n\nŁącznie ok. 20% powierzchni Polski. Główne obszary: Bieszczady, Tatry, Puszcza Białowieska, Dolina Narwi, Roztocze, Góry Świętokrzyskie.\n\nDla rolników:\n- **Zakaz orki TUZ** (trwałe użytki zielone) w Naturze 2000 — surowszy niż ogólnokrajowy GAEC 1.\n- **Ograniczenia nawożenia i pestycydów** — w niektórych SOO zakaz syntetycznego N, tylko organiczne.\n- **Terminy koszenia** — zazwyczaj dopiero po 15.06. (po wylęgu derkacza).\n- **Obowiązkowy plan ochrony** — zgoda Regionalnej Dyrekcji Ochrony Środowiska przed zasadniczą zmianą.\n\nDodatkowe dopłaty:\n- **Podtypy AEKO** specyficzne dla Natury 2000 — wyższe stawki (do +30%).\n- **Płatność kompensacyjna** za utratę plonów z tytułu ograniczeń (zazwyczaj 1 000–3 000 Kč/ha).\n\nKonflikt: rolnik kontra Regionalna Dyrekcja Ochrony Środowiska może być realny — zawsze przed zakupem/dzierżawą ziemi w Naturze 2000 sprawdzaj ewidencję i plan ochrony obszaru (często całkowicie zmienia potencjał gospodarczy).",
    "alias": [
      "Natura",
      "SOO",
      "obszar ptasi"
    ],
    "related": [
      "cap-2024",
      "lpis",
      "aeko"
    ]
  },
  {
    "slug": "organicka-hmota",
    "term": "Materia organiczna w glebie",
    "kategorie": "agrotechnika",
    "shortDef": "Materia organiczna (próchnica) to obumarła materia roślinna i zwierzęca w glebie. Kluczowy wskaźnik zdrowia gleby — utrzymuje wodę, składniki odżywcze, strukturę, bioróżnorodność.",
    "longDef": "Materia organiczna (MO) w glebie to suma rozkładu resztek roślinnych, korzeni, mikroorganizmów i zwierząt. Mierzona jako „zawartość próchnicy” w % suchej masy warstwy ornej.\n\nWartości w Polsce:\n- **PL grunty orne średnia**: 1,5–2,5% MO (stosunkowo niskie, dawniej 3–4% przed intensyfikacją).\n- **TUZ / pastwiska**: 4–8% MO (wyższe dzięki stabilnej roślinności).\n- **Gleba leśna**: 8–15% MO.\n- **Czarnoziem (Lubelszczyzna, Kujawy)**: 3–4% MO — najlepsza polska gleba orna.\n\nFunkcje MO:\n- **Pojemność wodna** — 1% MO = +15 l wody / m² zatrzymanej w glebie.\n- **Rezerwuar składników odżywczych** — N, P, K uwalniane podczas rozkładu.\n- **Struktura gleby** — struktura gruzełkowata, łatwa uprawa.\n- **Mikrobiologia** — bakterie, grzyby, fauna glebowa.\n- **Sekwestracja węgla** — 1% wzrost MO w 30 cm warstwy ornej = 30 t C / ha związanego w glebie.\n\nZwiększanie MO:\n- **Poplony przyorywane do gleby** — biomasa rozkładu przekształca się w próchnicę.\n- **Obornik stały** — 25–40 t/ha co 3–4 lata.\n- **Kompost** — wolno uwalniany, długotrwały efekt.\n- **Technologie bezorkowe (no-till)** — mniej zaburza strukturę, MO się akumuluje.\n- **Rotacja z TUZ** — jeśli część powierzchni rotuje na TUZ, MO dramatycznie rośnie.\n\nSpadek MO:\n- **Intensywna orka** — natlenienie przyspiesza rozkład → utrata MO.\n- **Monokultury** — nietrwałe długoterminowo.\n- **Erozja** — spłukana wraz z wierzchnią warstwą orną.",
    "alias": [
      "próchnica",
      "frakcja organiczna",
      "humus content"
    ],
    "related": [
      "mezi-plodiny",
      "pH-pudy"
    ]
  },
  {
    "slug": "eroze-pudy",
    "term": "Erozja gleby",
    "kategorie": "agrotechnika",
    "shortDef": "Erozja gleby to proces, w którym woda (deszcz, powódź) lub wiatr unosi warstwę orną z pola. W Polsce zagrożone jest ok. 30% gruntów ornych — główna przyczyna utraty produktywności.",
    "longDef": "Erozja gleby to naturalny proces, który intensywne rolnictwo dramatycznie przyspiesza. Dwa główne typy w Polsce:\n\n**Erozja wodna** (dominująca):\n- Deszcz uwalnia agregaty gleby → spływ po zboczu → straty 2–50 t warstwy ornej/ha/rok.\n- Najbardziej zagrożone: pochyłe pola powyżej 8°, długie działki, rzepak/buraki cukrowe w szerokich rzędach.\n- Po ekstremalnych opadach (50+ mm/h) w ciągu jednego dnia strata nawet 100+ t/ha — widoczne bruzdy.\n\n**Erozja wietrzna**:\n- Suchsze rejony — Kujawy, Wielkopolska, Nizina Śląska — wiatry unoszą drobne cząstki.\n- Straty 1–10 t/ha/rok, mniej dramatyczne, ale stałe.\n\nSkutki:\n- **Utrata najżyźniejszej warstwy** (warstwa orna 0–30 cm zawiera najwięcej MO i składników odżywczych).\n- **Zmniejszenie plonów** długoterminowo 5–25%.\n- **Eutrofizacja wód** — zmyty fosfor → zakwit glonów w zbiornikach.\n- **Zalewanie miejscowości** — błoto z pól zatyka kanalizację.\n\nOchrona przed erozją wodną (obowiązkowa zgodnie z GAEC 5):\n- **Pasy przeciwerozyjne** — pasy upraw naprzemiennie z TUZ/poplonami w poprzek zbocza.\n- **Strip-till / no-till** — bez orki, korzenie utrzymują glebę.\n- **Orka konturowa** — orka wzdłuż warstwic, nie po linii spływu.\n- **Poplony** przez zimę — obowiązkowe na działkach zagrożonych erozją.\n- **Pasy wegetacyjne** wzdłuż cieków wodnych.\n\nJeśli rolnik nie spełni GAEC 5 → sankcja 3–15% z BISS + EKO.",
    "alias": [
      "erozja wodna",
      "erozja wietrzna",
      "utrata warstwy ornej"
    ],
    "related": [
      "mezi-plodiny",
      "organicka-hmota",
      "gaec"
    ]
  },
  {
    "slug": "allwheel-drive",
    "term": "Napęd 4×4 / Napęd na wszystkie koła",
    "kategorie": "technologie",
    "shortDef": "Napęd 4×4 (MFWD) dodaje napęd na przednią oś — zwiększa siłę uciągu, zmniejsza poślizg, lepszy na grząskim terenie. Standard w 95% nowoczesnych ciągników.",
    "longDef": "Napęd 4×4 w ciągnikach (technicznie **MFWD** = Mechanical Front Wheel Drive) dodaje napęd na przednią oś kierowaną. Standard we wszystkich ciągnikach o mocy powyżej 50 KM od lat 90.\n\nBudowa:\n- **Napęd mechaniczny** przez długi wał od skrzyni biegów do przedniego mechanizmu różnicowego.\n- **Sprzęgło** w piaście lub w mechanizmie różnicowym — kierowca może wyłączyć 4×4 (do jazdy po drodze oszczędza paliwo + zapobiega „skręcaniu” na prostych drogach).\n- **Jednakowo duże koła** z przodu i z tyłu w tzw. ciągnikach **isodiametrycznych** (zwanych też „Trike” — Fendt 1000, JD 9R) — zapewniają doskonałą trakcję, ale trzeba uwzględnić duży promień skrętu na działce.\n\nRóżnica w stosunku do samochodu osobowego 4×4:\n- **Przednia oś ciągnika** jest znacznie wyższa i masywniejsza (ze względu na duże koła).\n- **Przedni mechanizm różnicowy** zazwyczaj bez aktywnego blokowania (brak Torsen / Haldex).\n- **Blokada mechanizmu różnicowego** tylna + przednia — kierowca włącza dla maksymalnej trakcji na błocie.\n\nZalety:\n- **+25–40% siły uciągu** vs. sam tylny napęd.\n- **Lepsza pokonywanie wzniesień** — ważne na górskich pastwiskach i w pracach leśnych.\n- **Mniejszy poślizg** — mniejsze zagęszczenie gleby + oszczędność paliwa przy ciężkim uciągu.\n\nWady:\n- **Wyższy koszt zakupu** o 100–300 tys. Kč vs. wersja 2×4 (które dziś prawie nie istnieją).\n- **Więcej części do serwisowania** — przeguby, mechanizm różnicowy, dwa zestawy kół.\n- **Wyższe zużycie paliwa** na drodze (dlatego możliwość wyłączenia).",
    "alias": [
      "MFWD",
      "Mechanical Front Wheel Drive",
      "4WD"
    ],
    "related": [
      "cvt-prevodovka",
      "tribod"
    ]
  },
  {
    "slug": "duala",
    "term": "Duals / Podwójny montaż kół",
    "kategorie": "technologie",
    "shortDef": "Podwójny montaż kół (duals) to zestaw dwóch kół na każdej osi (łącznie 4 tylne + 4 przednie) — zmniejsza nacisk na glebę, zwiększa unoszerność, stosowany w flagowych ciągnikach.",
    "longDef": "Podwójny montaż kół (duals, dual wheels) oznacza montaż dwóch kół obok siebie na każdej osi zamiast jednego. W ciągniku powyżej 250 KM prawie obowiązkowy przy pracach polowych.\n\nZasada: dwa koła = 2× większa powierzchnia kontaktu → połowa nacisku jednostkowego na glebę. Przy masie ciągnika 12 t bez duals nacisk wynosi 1,5–2 bar/cm² (zagęszczający), z duals spada do 0,7–1 bar/cm² (dopuszczalne).\n\nZastosowanie:\n- **Duże ciągniki 250+ KM** — Fendt 900/1000, JD 8R/9R, NH T9, Case Steiger.\n- **Zestawy kół** — duals tylko do prac polowych, demontaż do transportu drogowego (szerszy niż 2,55 m → przekracza normę UE dla dróg publicznych).\n- **Potrójny montaż (triples)** w super-flagowych ciągnikach 600+ KM (rzadkie w Europie, powszechne w USA).\n\nCena:\n- **Adaptery duals + obręcze + opony** zazwyczaj 250 000–500 000 Kč za 4× tylne.\n- **Triples** 1 000 000+ Kč.\n\nUwaga: korzystanie z duals na drodze w UE = mandat 5 000–20 000 Kč + przerwanie jazdy. Zawsze montaż tylko tuż przed wyjazdem na pole, demontaż po zakończeniu. W największych gospodarstwach rozwiązuje się to szybkozłączkami w ciągu 5–15 minut.",
    "alias": [
      "podwójny montaż kół",
      "duals"
    ],
    "related": [
      "allwheel-drive"
    ]
  },
  {
    "slug": "rotor-kombajn",
    "term": "Rotor / Kombajn rotorowy",
    "kategorie": "technologie",
    "shortDef": "Kombajn rotorowy (axial-flow) wykorzystuje podłużny rotor zamiast klasycznego cylindrycznego bębna — wyższa przepustowość, mniejsze uszkodzenia ziarna, wyższa wydajność.",
    "longDef": "Klasyczny kombajn zbożowy ma **cylindryczny bęben** (klasyczny cylinder z łopatkami) i **potrząsacze słomy** do separacji. Kombajn rotorowy zastępuje oba elementy jednym **podłużnym rotorem** (axial-flow), przez który przepływa cały strumień słomy.\n\nZalety rotora:\n- **+15–25% przepustowości** w zbiorach vs. cylindryczny bęben tej samej wielkości.\n- **Mniejsze uszkodzenia ziarna** — łagodniejsze omłacanie (dłuższa droga, mniejsze uderzenia).\n- **Lepsza separacja** w wilgotnych warunkach (po deszczu, poranna rosa).\n- **Prostsze utrzymanie** — mniej części, mniej pasków klinowych.\n\nWady:\n- **Wyższe zużycie paliwa** — rotor potrzebuje więcej energii.\n- **Gorsze przy długiej słomie** — jeśli chcesz jakościową słomę snopkową do balotów, klasyczny bęben daje lepszy efekt.\n- **Wyższy koszt zakupu** o 10–20% vs. równoważny cylindryczny bęben.\n\nGłówne marki rotorowe:\n- **Case IH Axial-Flow** — pionier (od 1977), dziś dominuje w USA.\n- **John Deere S-Series** (od 2012) — single rotor.\n- **New Holland CR** — twin rotor (dwa równoległe rotory).\n- **Fendt IDEAL** — dual helix rotor.\n- **Claas Lexion** — APS Hybrid (połączenie cylindrycznego bębna + akceleracji + separacji rotorowej) — kompromis.\n\nW Polsce: rotor preferuje ok. 35% rolników, cylindryczny 65% (ze względu na słomę i niższy koszt). Dla typowego gospodarstwa < 300 ha wystarczy klasyczny cylindryczny.",
    "alias": [
      "axial-flow",
      "tangencjalny",
      "młocarnia rotorowa"
    ],
    "related": [
      "kombajn-trida",
      "mlatecka"
    ]
  },
  {
    "slug": "kombajn-trida",
    "term": "Klasa kombajnu",
    "kategorie": "technologie",
    "shortDef": "Klasa kombajnu (I–X+) to klasyfikacja wielkości i mocy — opiera się na powierzchni bębna omłotowego i liczbie potrząsaczy. Wyższa klasa = wyższa przepustowość.",
    "longDef": "Klasa kombajnu zbożowego to europejska klasyfikacja według przepustowości i rozmiarów układu omłotowego. Opiera się głównie na **powierzchni bębna omłotowego** i **liczbie potrząsaczy** (w klasycznych) lub **rozmiarze rotora** (w rotorowych).\n\nPrzybliżony przegląd:\n- **Klasa III**: 100–120 kW (135–160 KM), szerokość hederowa 4 m, zbiornik 4 500 l.\n- **Klasa IV**: 120–155 kW (160–210 KM), szerokość 4,5–5 m, zbiornik 5 500 l.\n- **Klasa V**: 155–185 kW (210–250 KM), szerokość 5–6 m, zbiornik 6 500 l.\n- **Klasa VI**: 185–230 kW (250–310 KM), szerokość 6–7,5 m, zbiornik 7 500 l.\n- **Klasa VII**: 230–270 kW (310–365 KM), szerokość 7,5–9 m, zbiornik 9 000 l.\n- **Klasa VIII**: 270–330 kW (365–445 KM), szerokość 9–10,5 m, zbiornik 10 500 l.\n- **Klasa IX**: 330–400 kW (445–540 KM), szerokość 10,5–12 m, zbiornik 12 000 l.\n- **Klasa X / X+**: 400+ kW (540+ KM), szerokość 12–18 m, zbiornik 14 000+ l.\n\nDla polskiego gospodarstwa:\n- **50–200 ha zbóż**: klasa IV–V (Claas Avero, JD T560, Case 5140).\n- **200–500 ha**: klasa VI–VII (Claas Tucano, JD T670, NH CX5/CX7).\n- **500–1500 ha**: klasa VIII–IX (Claas Lexion 7000/8000, JD S780, Fendt IDEAL 8).\n- **1500+ ha lub przedsiębiorstwo żniwne**: klasa X (Claas Lexion 8900, JD X9, Fendt IDEAL 10T).\n\nWyższa klasa nie oznacza automatycznie lepszego — to kwestia przepustowości. Przewymiarowany kombajn = nieefektywne wykorzystanie kapitału.",
    "alias": [
      "Class",
      "Klassen"
    ],
    "related": [
      "rotor-kombajn"
    ]
  },
  {
    "slug": "header",
    "term": "Heder / Przystawka żniwna",
    "kategorie": "technologie",
    "shortDef": "Heder (przystawka żniwna) to przednia część kombajnu — stół żniwny, który ścina roślinę i transportuje ją do układu omłotowego. Szerokość 4–18 m w zależności od klasy kombajnu.",
    "longDef": "Heder (przystawka żniwna) to modułowy przedni przystawek kombajnu zbożowego. Istnieją **wyspecjalizowane hedery do różnych roślin**:\n\n**Zboża / rzepak** (universal grain header):\n- Szerokość 4–18 m w zależności od klasy kombajnu.\n- Zmienny stół (Vario) do rzepaku — wydłużenie o 70–90 cm do wąskiego cięcia drobnoziarnnistych roślin.\n- Cena 0,8–4 mln Kč nowy, używany 50% ceny.\n\n**Kukurydza** (corn header):\n- Wersje 4-6-8-12-rzędowe.\n- Grubo wyprofilowany stół z łapaczami, nie klasyczny nóż.\n- Cena 1,2–3,5 mln Kč.\n\n**Pickup** (do kiszonki z rzędów, przed-zbiór):\n- Zbiera rzędy z pola, bez nowego cięcia.\n- Specyficzny do zbioru traw na kiszonkę.\n\n**Heder słonecznikowy** (sunflower header):\n- Wałki podcinające — odcina główkę.\n- Rzadki w Polsce, tylko dla specjalistów.\n\nZasady wyboru:\n- **Szerokość = 0,4× klasa kombajnu** (Klasa V = heder 4,5–5 m).\n- **Większa szerokość ≠ wyższa wydajność** — jeśli kombajn nie ma przepustowości, większy heder tylko spowalnia.\n- **Transport** — wszystkie hedery powyżej 7 m wymagają **systemu składanego** lub **przyczepy** do transportu drogowego (szerokość ponad 2,55 m jest nielegalna bez zezwolenia).\n\nWielu rolników ma dwa hedery: **zbożowy + kukurydziany** z szybkozłączką (5–10 minut wymiany).",
    "alias": [
      "header",
      "stół żniwny",
      "cutting bar"
    ],
    "related": [
      "kombajn-trida",
      "rotor-kombajn"
    ]
  },
  {
    "slug": "orba",
    "term": "Orka",
    "kategorie": "agrotechnika",
    "shortDef": "Orka to głębokie odwracanie gleby pługiem na głębokość 20–35 cm. Tradycyjna podstawa jesiennej uprawy — narusza strukturę, niszczy chwasty, przyoruje materię organiczną.",
    "longDef": "Orka to najbardziej tradycyjny sposób uprawy gleby — pług przecina i odwraca 20–35 cm warstwę orną. W Polsce dominująca metoda od XIX wieku.\n\n**Typy pługów**:\n- **Pług zawieszany** — montowany na układzie trzypunktowym, lżejszy (do 4 odkrojnic).\n- **Półzawieszany / ciągniony** — większe pługi 5–12 odkrojnic, podpora na kołach.\n- **Variopług** — zmienna szerokość odkrojnic podczas jazdy.\n- **Pług odwracalny (reversible)** — obraca odkrojnice o 180°, orze w obu kierunkach, bez przerw w pasie.\n\n**Głębokość orki**:\n- **Płytka (15–20 cm)** — do letniej uprawy po żniwach.\n- **Średnia (20–28 cm)** — standard dla jesiennej orki pod oziminy.\n- **Głęboka (28–35 cm)** — przeciwko zagęszczeniu podglebia, wyjątkowo 1× na 3–5 lat.\n\n**Zużycie paliwa** pługiem (orientacyjnie):\n- 3-odkrojnicowy do ciągnika 100 KM: 12–18 l oleju napędowego/ha.\n- 5-odkrojnicowy do 200 KM: 18–25 l/ha.\n- 8-odkrojnicowy do 350 KM: 22–30 l/ha.\n\n**Trendy przeciwko orce**:\n- **No-till** / bezorkowe — bez orki, siewnik wprost w ściernisko. Oszczędza paliwo (5–10 l/ha), ale wymaga wyższych dawek herbicydów.\n- **Min-till** (minimum tillage) — tylko płytka uprawa (5–15 cm) zamiast orki. Kompromis.\n- **Strip-till** — orka tylko w rzędach, przestrzenie między nimi pozostają nienaruszone.\n\nW Polsce aktualnie ok. 55% orki, 30% min-till, 15% no-till.",
    "alias": [
      "głęboka uprawa",
      "plow",
      "oranie"
    ],
    "related": [
      "mezi-plodiny",
      "eroze-pudy"
    ]
  },
  {
    "slug": "no-till",
    "term": "No-till / Uprawa bezorkowa",
    "kategorie": "agrotechnika",
    "shortDef": "No-till (uprawa bezorkowa) eliminuje orkę — siewnik sieje bezpośrednio w ściernisko. Oszczędza paliwo, chroni glebę przed erozją, ale wymaga wyższych dawek herbicydów.",
    "longDef": "No-till to metoda uprawy gleby, która **całkowicie eliminuje orkę** i inne głębokie naruszanie gleby. Siew (materiału siewnego) odbywa się bezpośrednio w ściernisko poprzedniej uprawy za pomocą **siewnika talerzowego** lub **siewnika dłutowego**.\n\nZalety:\n- **Oszczędność paliwa 50–80%** vs. konwencjonalna orka.\n- **Mniejsza erozja** — powierzchnia pozostaje pokryta, gleba niespłukiwana.\n- **Wyższa zawartość materii organicznej** — ściernisko + korzenie rozkładają się w glebie.\n- **Lepsze zatrzymywanie wody** — wyższa kapilarność.\n- **Mniej pracy** — 1 operacja zamiast 3–5 (orka + wałowanie + brona + siew).\n\nWady:\n- **Wyższe dawki herbicydów** — bez orki chwasty nie są niszczone, kompensacja glifosatem.\n- **Wolniejsze nagrzewanie gleby wiosną** — ściernisko utrzymuje chłód.\n- **Ryzyko chorób glebowych** — patogenne resztki ze ścierniska.\n- **Konieczność specjalistycznego siewnika** — Horsch Avatar / Maestro, Väderstad Rapid, John Deere 750A. Cena 1,5–4 mln Kč.\n\nW Polsce:\n- Głównie **wschodnia Polska, Lubelszczyzna, Mazowsze** (suchsze rejony) — no-till sprawdza się najlepiej w warunkach półsuchych.\n- **Podkarpacie, tereny górskie** — dominuje orka (chłodniejszy, bardziej wilgotny klimat).\n- **Dopłaty UE** preferują no-till przez schemat EKO — premia 1100 Kč/ha dodatkowo.\n\nZalecamy wypróbowanie no-till na **części pola przez 2–3 sezony** przed pełną konwersją — plony mogą w pierwszym roku spaść o 5–10%, ale stabilizują się i długoterminowo (5+ lat) wyraźnie rosną.",
    "alias": [
      "direct drilling",
      "siew bezpośredni"
    ],
    "related": [
      "orba",
      "eroze-pudy"
    ]
  },
  {
    "slug": "pre-emergence",
    "term": "Oprysk pre-emergence",
    "kategorie": "agrotechnika",
    "shortDef": "Oprysk pre-emergence stosuje się na polu po siewie, ale przed wschodami rośliny uprawnej i chwastów. Niszczy kiełkujące chwasty zanim wyrosną — kluczowy dla czystego łanu.",
    "longDef": "Pre-emergence (pre-em, „przed wschodami”) to strategia herbicydowa polegająca na stosowaniu środków **po siewie, ale przed wschodami rośliny uprawnej i chwastów**. Celuje w kiełkujące chwasty w krytycznej fazie wzrostu.\n\n**Główne substancje czynne**:\n- **Pendimetalina** (Stomp) — do zbóż, rzepaku, słonecznika.\n- **Prosulfokarb** (Defi) — przeciwko wyczynicy w zbożach.\n- **Metribuzyna** — do ziemniaków, soi.\n- **S-Metolachlor + Mesotrion** — do kukurydzy.\n\n**Termin**:\n- **0–7 dni po siewie** — zależy od szybkości wschodów.\n- **Gleba musi być wilgotna** — susza = pre-em nie działa (substancja nie wnika do nasion chwastów).\n- **Bez deszczu przez 2 dni** idealnie — deszcz mógłby zmyć substancję.\n\nDawkowanie zazwyczaj 2–4 l/ha. Cena 200–600 Kč/ha za oprysk pre-em.\n\n**Zalety**:\n- **Niszczy 70–90% chwastów** zanim skiełkują.\n- **Zmniejsza konieczność oprysku post-em** — mniej chemii łącznie.\n- **Roślina wschodzi na „czyste” pole** — wyższy plon.\n\n**Ograniczenia**:\n- **Selekcja odpornych chwastów** — powtarzające się pre-em prowadzi do odporności (zwłaszcza wyczynica, chwastnica jednostronna w zbożach).\n- **Wrażliwość na suszę** — bez deszczu oprysk zawodzi.\n- **Niektóre rośliny uprawne słabo tolerują** — rzepak jest wrażliwy na pendimetalinę.\n\nDla polskiego rolnika: pre-em to standard przy rzepaku i zbożach. W przypadku jarych (soja, kukurydza) wybór między pre-em a post-em.",
    "alias": [
      "pre-emergent",
      "przed wschodami"
    ],
    "related": [
      "orba",
      "roundup"
    ]
  },
  {
    "slug": "osevni-postup",
    "term": "Płodozmian",
    "kategorie": "agrotechnika",
    "shortDef": "Płodozmian to planowe zmianowanie upraw na polu w kolejnych latach. Kluczowa zasada zrównoważonego rolnictwa — poprawia glebę, ogranicza chwasty i choroby.",
    "longDef": "Płodozmian to systematyczne zmianowanie upraw na tej samej działce w kolejnych latach. Podstawa tradycyjnego rolnictwa — wiedziano o tym już w średniowieczu (system „3-polówki”: ozimina → jarzyna → ugór).\n\n**Typowy polski płodozmian** (czteroletni):\n1. **Rzepak** (ozimy) — poprawia strukturę, głęboki korzeń.\n2. **Pszenica ozima** — standardowa uprawa towarowa.\n3. **Burak cukrowy lub ziemniak** — okopowina, przerywa cykl chwastów.\n4. **Zboże jare (jęczmień) lub kukurydza** — zamyka cykl.\n\nCzasem dodawane **5. miejsce: lucerna / koniczyna** (3 lata bez siewu, regeneruje glebę, wiąże azot).\n\n**Zasady**:\n- **Nie stawiać tej samej uprawy po sobie** — ryzyko chorób (np. fuzariozy w pszenicy).\n- **Naprzemiennie głęboki + płytki korzeń** — rzepak (głęboko) + zboże (płytko).\n- **Włączyć rośliny strączkowe** — soja, groch, wyka = wiążą azot, oszczędzają nawóz.\n- **Okopowina (burak cukrowy, ziemniak)** = „czyściciel” — przerywa cykl chwastów.\n\n**Zasady WPR 2024**:\n- **GAEC 7**: zakaz monokultury 4+ lata z rzędu.\n- Maksimum 75% powierzchni tą samą uprawą w jednym roku.\n- **Premia EKO** wymaga **min. 4 różnych upraw** na gruntach ornych.\n\n**Skutki naruszenia**:\n- **Krótszy płodozmian** (np. pszenica → pszenica → kukurydza → pszenica) = wyższe plony krótkoterminowo, ale po 5–10 latach spadek plonów o 15–25% z powodu chorób glebowych.\n- **Monokultura kukurydzy** (ekstrem w USA, sporadycznie w Polsce): wymaga masowego nawożenia + insektycydów.\n\nDobry płodozmian to **najlepsza praktyka rolnicza „za darmo”** — bez chemii, tylko przez planowanie upraw.",
    "alias": [
      "rotacja upraw",
      "crop rotation",
      "zmianowanie upraw"
    ],
    "related": [
      "mezi-plodiny",
      "eko-platba",
      "gaec"
    ]
  },
  {
    "slug": "section-control",
    "term": "Section Control",
    "kategorie": "precise-farming",
    "shortDef": "Section Control to sterowane GPS automatyczne wyłączanie sekcji opryskiwacza / kosiarki / siewnika na uwrociach, zakładkach lub w już opryskanych pasach. Oszczędza 5–15% chemii/materiału siewnego.",
    "longDef": "Section Control (technicznie **TC-SC** w ISOBUS — Task Controller Section Control) to system automatycznego wyłączania poszczególnych sekcji (części) narzędzia na podstawie pozycji GPS i poprzedniej mapy pokrycia.\n\n**Zastosowania**:\n- **Opryskiwacz** — belka 12–24 m podzielona na 6–24 sekcje, każda wyłącza się niezależnie. Na uwrociach, klinie, zwężającym się końcu pola.\n- **Siewnik** — wyłączanie rzędów na uwrociach, gdzie materiał siewny już padł.\n- **Rozsiewacz nawozów** — zmienna szerokość pasa nawozu według pozycji.\n\n**Zasada działania**:\n1. Odbiornik RTK GPS z dokładnością ±2 cm.\n2. ISOBUS TC-SC rejestruje **mapę as-applied** — gdzie zostało zastosowane.\n3. Przy kolejnym przejeździe (uwrocie, klinie) system wyłącza sekcje, które nakładałyby się na już pokryty pas.\n\n**Oszczędności**:\n- **Opryskiwacz**: 5–15% chemii/sezon (zależy od kształtu pola — regularny kwadrat 5%, nieregularne pola 15+ %).\n- **Nawóz**: 5–10%.\n- **Materiał siewny**: 3–8%.\n\n**ROI** (orientacyjnie, dla gospodarstwa 200 ha):\n- Koszt retrofit Section Control: 80 000–250 000 Kč.\n- Oszczędność chemii 2 500 Kč/ha × 0,1 (10%) = 250 Kč/ha × 200 ha = 50 000 Kč/rok.\n- ROI: 1,5–5 lat.\n\n**Aktualnie**:\n- Standard w dużych nowoczesnych opryskiwaczach (Amazone UX, Horsch Leeb, Dammann).\n- Licencja ISOBUS TC-SC zazwyczaj 20–60 tys. Kč przy zakupie ciągnika.\n- Retrofit w starych opryskiwaczach 100–200 tys. Kč.",
    "alias": [
      "automatyczne wyłączanie sekcji",
      "TC-SC"
    ],
    "related": [
      "isobus",
      "gps-rtk",
      "variable-rate"
    ]
  },
  {
    "slug": "leasing-vs-uver",
    "term": "Leasing vs kredyt",
    "kategorie": "dotace",
    "shortDef": "Leasing i kredyt to dwie drogi finansowania ciągnika. Leasing = wynajem z opcją wykupu na końcu, kredyt = pożyczka bankowa. Różnią się VAT, własnością i elastycznością.",
    "longDef": "**Leasing finansowy** = wynajem z obowiązkową opcją wykupu na końcu (zazwyczaj za 1–5% wartości rezydualnej).\n\n**Leasing operacyjny** = wynajem bez opcji wykupu, na końcu zwracasz maszynę. Odpowiedni na krótki okres (3–5 lat), bez troski o sprzedaż.\n\n**Kredyt bankowy** = klasyczna pożyczka, maszyna jest od razu Twoja, zabezpieczenie zastawem.\n\n| | Leasing finansowy | Leasing operacyjny | Kredyt bankowy |\n|---|---|---|---|\n| **Własność podczas** | firma leasingowa | firma leasingowa | Ty (zastaw w banku) |\n| **Własność po spłacie** | Ty | firma leasingowa | Ty |\n| **VAT** | rozłożony na raty | tylko na raty (zawsze) | całość z góry |\n| **Wkład własny** | 0–30% | 0–30% | 0–20% |\n| **Oprocentowanie (2026)** | 5,5–8% r.r. | 6–9% r.r. | 5–7% r.r. |\n| **Okres** | 24–84 mies. | 24–60 mies. | 12–96 mies. |\n| **Elastyczność** | niska (kary za wcześniejsze rozwiązanie) | niska | wyższa (refinansowanie) |\n\n**Dla polskiego rolnika**:\n- **Leasing finansowy** to standard dla 70% zakupów — przewidywalność rat, optymalizacja podatkowa.\n- **Kredyt** opłaca się przy **drogich maszynach 5+ mln Kč** z wysokim wkładem własnym — niższy łączny koszt odsetkowy.\n- **Leasing operacyjny** jest wyjątkowy — odpowiedni dla **przedsiębiorców usług żniwnych**, którzy maszynę intensywnie eksploatują przez 5 lat, a potem zwracają.\n\n**Finansowanie captive marki** (John Deere Financial, AGROTEC FS, AGRI CS Finance):\n- Często promocyjne oprocentowanie 4–6% na nowe maszyny własnej marki.\n- Powiązane ze sprzedawcą — opłacalne łączyć z rabatem na cenie maszyny.\n- Dla używanych maszyn zazwyczaj wyższe oprocentowanie niż banki uniwersalne.\n\n→ [Kalkulator leasingu ciągnika](/kalkulacka/leasing-traktoru/) do orientacyjnego wyliczenia miesięcznej raty.",
    "alias": [
      "leasing operacyjny",
      "leasing finansowy"
    ],
    "related": [
      "cap-2024"
    ]
  },
  {
    "slug": "rolnicke-pravidla-silnicni",
    "term": "Przepisy drogowe dla ciągników",
    "kategorie": "regulace",
    "shortDef": "Ciągnik na drodze publicznej w Polsce podlega przepisom: maks. szerokość 2,55 m bez zajęcia pasa, wysokość 4 m, obowiązkowe oznakowanie narzędzi, przegląd techniczny co 2 lata.",
    "longDef": "Ruch ciągnika na drodze publicznej w Polsce reguluje **ustawa Prawo o ruchu drogowym** i **rozporządzenie w sprawie warunków technicznych pojazdów**.\n\n**Maksymalne wymiary bez zajęcia drogi publicznej**:\n- **Szerokość**: 2,55 m (wyjątki dla maszyn rolniczych 3 m, powyżej wymagane zajęcie pasa).\n- **Wysokość**: 4 m (kabina + rura wydechowa + fabrycznie zamontowane akcesoria).\n- **Długość ciągnik + przyczepa/narzędzie**: 12 m (ciągnik samodzielnie), 16,5 m z naczepą.\n\n**Jeśli przekraczasz** (szersze narzędzia, podwójny montaż kół, głębokie pługi):\n- **Pojazd towarzyszący** z migającymi sygnalizatorami.\n- **Zajęcie drogi** zatwierdzane przez policję, maks. 2 godziny + plan objazdu.\n- Mandat za niespełnienie: 5 000–50 000 Kč.\n\n**Oznakowanie narzędzi**:\n- **Tablice 423 × 423 mm** z żółto-czerwonymi pasami na krawędziach szerokich narzędzi.\n- **Pasy odblaskowe** w nocy lub przy ograniczonej widoczności.\n- **Migające żółte światło** obowiązkowe dla maszyn szerszych niż 2,55 m.\n\n**Przegląd techniczny (odpowiednik STK)**:\n- **Ciągnik z tablicami rejestracyjnymi**: przegląd co 2 lata.\n- **Bez tablic rejestracyjnych** (tylko do pracy w polu): bez przeglądu, ale ruch na drodze jest zabroniony (nawet 10 m między sąsiednimi polami).\n- **Badanie**: hamulce, światła, sygnał dźwiękowy, układ wydechowy, kabina, siedzisko.\n\n**Prawo jazdy**:\n- **T (ciągnik)** — od 16 lat, obowiązkowe do pracy w polu i przewozu.\n- **B (osobowe)** — niektóre małe ciągniki do 40 km/h z prawem jazdy B (wymaga doprecyzowania).\n\n**Ubezpieczenie**:\n- **OC** — obowiązkowe także do pracy w polu (ok. 1 500–6 000 Kč/rok).\n- **AC** — dobrowolne, zalecane dla nowych maszyn (3–5% wartości rocznie).",
    "alias": [
      "przegląd techniczny ciągnika",
      "oznakowanie szerokości",
      "transport polowy"
    ],
    "related": [
      "allwheel-drive",
      "duala"
    ]
  },
  {
    "slug": "ozim-jarin",
    "term": "Oziminy vs jarzyny",
    "kategorie": "agrotechnika",
    "shortDef": "Oziminy wysiewa się jesienią, jarzyny wiosną. Oziminy wykorzystują zimową wilgoć, dają wyższe plony. Jarzyny mają krótszy cykl, wyższe ryzyko suszy.",
    "longDef": "Uprawy dzielimy według okresu siewu:\n\n**Oziminy** (siane jesienią, wrzesień–październik):\n- **Pszenica ozima** — dominujące zboże w Polsce, 60% powierzchni zbóż.\n- **Jęczmień ozimy** — do browarów, wyższy plon niż jary.\n- **Rzepak ozimy** — strategiczna oleista, plon 3,5–4,5 t/ha.\n- **Żyto ozime** — do chleba i pasz, znosi słabsze gleby.\n- **Triticale** — krzyżówka pszenicy + żyta, odporne.\n\nZalety ozimin:\n- Zimowa wilgoć = stabilniejszy plon.\n- Wcześniejszy zbiór (lipiec) = zwolnienie powierzchni na poplony.\n- Wyższy łączny plon niż jarzyny (o 15–30%).\n\nRyzyka:\n- **Wymarzanie** w ciężkiej zimie bez pokrywy śnieżnej.\n- **Ślimaki** — atak w mokrym miesiącu jesiennym.\n\n**Jarzyny** (siane wiosną, marzec–kwiecień):\n- **Jęczmień jary** — do browarów (wyższa jakość słodowa).\n- **Pszenica jara** — marginalna, tylko gdy ozima wymarzła.\n- **Kukurydza** — letnie ziarno i kiszonka.\n- **Soja, słonecznik** — letnie oleiste.\n- **Ziemniak, burak cukrowy** — okopowiny.\n- **Groch, wyka** — strączkowe.\n\nZalety jarzyn:\n- Krótki cykl (3–4 miesiące).\n- Możliwość reagowania na rynek (siejesz według aktualnych cen).\n- Mniejsze ryzyko zimowego wymarzania.\n\nRyzyka:\n- **Susza** w maju–czerwcu = niskie plony.\n- **Wyższe spiętrzenie prac** w krótkim czasie.\n\nDla polskiego gospodarstwa standardem jest **70% ozimin + 30% jarzyn**.",
    "alias": [
      "oziminy",
      "jarzyny",
      "autumn vs spring crops"
    ],
    "related": [
      "osevni-postup",
      "orba"
    ]
  },
  {
    "slug": "lav-can",
    "term": "LAV / CAN (Saletra wapniowo-amonowa)",
    "kategorie": "hnojivo",
    "shortDef": "LAV (CAN) to nawóz azotowy z zawartością 27% N i składnikiem wapiennym. Drugi najczęściej stosowany nawóz N w Polsce po moczni. Szybki efekt, bezpieczniejsze przechowywanie.",
    "longDef": "LAV (saletra wapniowo-amonowa, ang. CAN — Calcium Ammonium Nitrate) to granulowany nawóz azotowy. Zawiera **27% N** (50% azotan NO₃⁻, 50% amoniak NH₄⁺) oraz ok. **8% CaO** + 4% MgO ze składnika wapiennego.\n\nGłówne zalety w stosunku do mocznika:\n- **Natychmiastowy efekt** — połowa N w formie azotanowej jest od razu dostępna dla rośliny.\n- **Brak strat przez volatylizację** (ulatnianie NH₃) — bez konieczności przykrycia.\n- **Bezpieczniejsze przechowywanie** — nie wybucha (czysty saletrzak 33% N jest materiałem wybuchowym, LAV z wapnem nie).\n- **Efekt wapniujący** — słabo podwyższa pH gleby (vs. mocznik, który jest neutralny lub lekko kwaśny).\n\nZastosowanie:\n- **Wiosenne pogłówne nawożenie ozimin** — 200–400 kg/ha (= 54–108 kg N/ha).\n- **Pre-em dla jarych** — 150–250 kg/ha pod kukurydzę, słonecznik.\n- **Lepsze niż mocznik w suchej pogodzie** — mocznik wymaga wilgoci do hydrolizy, LAV działa także w suszy.\n\nCena (2024): ok. 11 000–14 000 Kč/t w workach IBC 600 kg. O ~15% droższy per kg N niż mocznik, ale bardziej praktyczny.\n\nW Polsce dominujący producent: Anwil (Włocławek), Grupy Azoty — marki CAN 27. Import z Czech (Lovochemie) i Słowacji (Duslo).",
    "alias": [
      "CAN",
      "saletra wapniowa",
      "Calcium Ammonium Nitrate"
    ],
    "related": [
      "mocovina",
      "npk-hnojivo",
      "pH-pudy"
    ]
  },
  {
    "slug": "dam-390",
    "term": "DAM 390 (Nawóz płynny)",
    "kategorie": "hnojivo",
    "shortDef": "DAM 390 to płynny nawóz azotowy z 30% N (mieszanina mocznika + saletry amonowej + wody). Aplikacja przez opryskiwacz — szybka, równomierna, bezpyłowa.",
    "longDef": "DAM 390 (ang. UAN 32 — Urea Ammonium Nitrate solution) to najszerzej stosowany płynny nawóz azotowy w UE. **30% N w 1 litrze = 390 g N/l** (stąd „DAM 390”). Skład:\n- 50% mocznik (15% N łącznie)\n- 25% saletra amonowa (7,5% N łącznie)\n- 25% woda (7,5% N w formach amidowej + azotanowej)\n\nAplikacja:\n- **Opryskiwacz z dyszami rurkowymi** (nie klasyczne rozpylacze — DAM popaliłby liść).\n- **Zestaw nawozowy na opryskiwaczu** — specjalne dysze 5–7-otworowe strzelają cieczą między rzędy.\n- **Dawkowanie** 100–250 l/ha (= 39–98 kg N/ha).\n- **Terminy stosowania**: wiosenne wschody zbóż, druga dawka w fazie kłoszenia, ewentualnie dolistne nawożenie (5–15 l/ha po rozcieńczeniu).\n\nZalety:\n- **Równomierność** — żadnych rozpadniętych granulek, płynny spray.\n- **Szybkość pracy** — 80–150 ha/dzień przy opryskiwaczu 24 m.\n- **Możliwość łączenia** z mikroelementami, środkami ochrony roślin w tank-mix.\n- **Przechowywanie** w IBC (1000 l) lub cysternach (10+ t) — bez konieczności zamkniętego magazynu.\n\nWady:\n- **Skłonność do poparzenia liścia** przy upale powyżej 22°C lub w bezpośrednim słońcu.\n- **Korozyjny dla sprzętu wodociągowego** — oddzielna cysterna i pompa.\n\nCena (2024): ok. 7 500–10 500 Kč/t (= 19–27 Kč/kg N — wyraźnie tańszy niż nawozy stałe w przeliczeniu na jednostkę N).",
    "alias": [
      "DAM",
      "UAN",
      "Urea Ammonium Nitrate solution"
    ],
    "related": [
      "mocovina",
      "lav-can",
      "npk-hnojivo"
    ]
  },
  {
    "slug": "vapneni",
    "term": "Wapnowanie gleby",
    "kategorie": "agrotechnika",
    "shortDef": "Wapnowanie to stosowanie substancji wapniowych do gleby w celu regulacji pH i uzupełnienia wapnia. Kluczowy długoterminowy zabieg dla żyzności — 1× na 4–8 lat w zależności od pH.",
    "longDef": "Wapnowanie to proces stosowania produktów wapniowych do gleby, którym celowo:\n1. **Reguluje się pH** w kierunku optimum (5,5–7,0 dla większości upraw).\n2. **Uzupełnia się wapń** jako składnik odżywczy (Ca jest makroelementem, który rośliny pobierają w dziesiątkach kg/ha/rok).\n3. **Poprawia się struktura** gleby (Ca koaguluje glinę, zwiększa kapilarność).\n\nGłówne produkty:\n- **Mielony wapień (CaCO₃)** — najtańszy, wolne działanie (3–6 miesięcy), dawka 2–6 t/ha.\n- **Wapień dolomityczny (CaCO₃ + MgCO₃)** — do gleb ubogich w Mg, dawka 2–6 t/ha.\n- **Wapno palone (CaO)** — agresywne, szybkie działanie, dawka 0,8–2,5 t/ha. Wymagana ostrożność (poparzy korzenie).\n- **Wapno gaszone (Ca(OH)₂)** — do ekstremalnie kwaśnych gleb, bardzo szybkie działanie.\n- **Osady posatyracyjne z cukrowni** — odpad z produkcji cukru, tanie źródło Ca + materii organicznej.\n\nCena (2024): 800–1 800 Kč/t z dowozem (wapień). Aplikacja rozsiewaczem 200–400 Kč/ha. Łączna inwestycja 4 000–12 000 Kč/ha przy normalnej dawce.\n\nKiedy wapnować:\n- **Analiza gleby 1× na 4 lata** pokaże aktualne pH i nasycenie Ca.\n- **pH poniżej 5,5** → wapnować ok. 4 t/ha wapienia + powtórzyć po 2 latach.\n- **pH 5,5–6,0** → 2 t/ha profilaktycznie co 4–6 lat.\n- **pH powyżej 6,5** → nie wapnować (zbędne, ryzyko alkaliczności).\n\nROI: wzrost pH o 0,5 jednostki zazwyczaj prowadzi do +5–15% plonu zbóż długoterminowo. Zwrot nakładów po 2–4 sezonach.",
    "alias": [
      "wapnowanie",
      "liming",
      "CaCO₃ aplikacja"
    ],
    "related": [
      "pH-pudy",
      "organicka-hmota"
    ]
  },
  {
    "slug": "pluh",
    "term": "Pług (typy i parametry)",
    "kategorie": "technologie",
    "shortDef": "Pług to narzędzie do głębokiej orki — odwraca 20–35 cm warstwę orną. Istnieje typ zawieszany, półzawieszany i odwracalny (reversible) z 2–12 odkrojnicami.",
    "longDef": "Pług to najstarsze narzędzie uprawowe — odwraca glebę za pomocą odkrojnic. W Polsce standardowy sprzęt do jesiennej uprawy pola.\n\n**Typy według zawieszenia**:\n- **Pług zawieszany** — całość niesiona przez układ trzypunktowy ciągnika. Lżejszy (do 4–5 odkrojnic). Do ciągnika 80–150 KM.\n- **Półzawieszany** — tylna część pługu opiera się na własnych kołach. 5–8 odkrojnic. Do 130–200 KM.\n- **Ciągniony** — cały pług na własnych kołach, układ trzypunktowy tylko ciągnie. 8–12 odkrojnic. Do 200+ KM.\n\n**Typy według kierunku orki**:\n- **Klasyczny (jednokierunkowy)** — orze tylko w jednym kierunku. Wymaga „orki z przejazdami” → nieregularna powierzchnia.\n- **Pług odwracalny (reversible)** — odkrojnice obracają się o 180°, orze w obu kierunkach. Gładka powierzchnia bez przerw. Dziś standard (95% nowych pługów).\n- **Variopług** — zmienna szerokość odkrojnic podczas jazdy (40–60 cm na odkrojnicę). Przydatny do napraw dróg lub wąskich zagonów.\n\n**Kluczowe parametry**:\n- **Liczba odkrojnic** — 3 (lekki), 4–5 (średni), 6–8 (ciężki), 8–12 (extra ciężki).\n- **Szerokość na odkrojnicę** — 35, 40, 45, 50 cm. Całkowita szerokość = liczba × na odkrojnicę.\n- **Głębokość orki** — 20–35 cm regulowana hydraulicznie lub mechanicznie.\n\n**Czołowe marki w Polsce**: Lemken (DE — Diamant, EurOpal), Pöttinger (AT — Servo), Kverneland (NO/IT — LB, ED, PB), Kuhn (FR — Vari-Master), Vogel & Noot (AT — Plus).\n\n**Orientacja cenowa** (2026 nowy):\n- 3-odkrojnicowy zawieszany odwracalny: 200 000–350 000 Kč.\n- 5-odkrojnicowy półzawieszany odwracalny: 600 000–1 100 000 Kč.\n- 8-odkrojnicowy ciągniony odwracalny + Vario: 1,8–3 mln Kč.",
    "alias": [
      "plough",
      "pług orny"
    ],
    "related": [
      "orba",
      "tribod",
      "no-till"
    ]
  },
  {
    "slug": "kompaktomat",
    "term": "Agregat uprawowy / Kompakt",
    "kategorie": "technologie",
    "shortDef": "Agregat uprawowy (kompakt) to narzędzie kombinowane do płytkiej uprawy gleby — talerze + wały + listwy krusząca w jednym przejeździe. Przygotowuje pole do siewu po orce lub zamiast orki.",
    "longDef": "Agregat uprawowy to maszyna półzawieszana łącząca w kilku rzędach: **brony talerzowe + listwy kruszące + wały zagniatające** (podróbka, koła). Cel: przygotowanie idealnego łoża siewnego w 1 przejeździe.\n\n**Typowa szerokość robocza**: 3–8 m, w zależności od ciągnika 100–250 KM.\n\n**Komponenty (od przodu do tyłu)**:\n1. **Sekcje talerzowe** (Ø 40–55 cm) — nacinają ściernisko, wstępnie spulchniają 5–10 cm.\n2. **Strzałki / dłuta** (opcjonalne) — rozkruszenie zagęszczenia.\n3. **Sprężynowe listwy spulchniające** — kruszą grudki.\n4. **Wał zagniatający** (Crosskill, U-profil, Cambridge) — wyrównuje powierzchnię, tworzy kapilarne połączenie z podglebiem.\n\n**Główne zastosowania**:\n- **Przygotowanie przedsiewne** — zamiast bron + wałowania + brony + siewu w 3 osobnych przejazdach.\n- **Uprawa pościerniskowa** — bezpośrednio po żniwach, podorywka ścierniska.\n- **Pseudo-orka** — jako zastąpienie orki w systemach min-till.\n\n**Zalety**:\n- 1 przejazd zamiast 3–4 = oszczędność paliwa 40–60% vs. schemat konwencjonalny.\n- Wyższa wydajność — 4–8 ha/h vs. 1–3 ha/h przy prostych narzędziach.\n- Lepsza struktura gleby — mniejsze zagęszczenie od wielokrotnych przejazdów.\n\n**Czołowe marki**:\n- **Horsch** (Tiger, Joker, Terrano) — DE premium, no-till friendly.\n- **Lemken** (Karat, Heliodor) — DE uniwersalny.\n- **Väderstad** (Carrier, TopDown, Cultus) — SE precyzja.\n- **Köckerling** (Quadro, Allrounder) — DE solidny.\n- **Kuhn** (Performer, Optimer) — FR stosunek cena/jakość.\n\n**Cena (2026)**: 4 m = 400 000–800 000 Kč, 6 m = 800 000–1,8 mln Kč, 8 m = 1,5–3,5 mln Kč.",
    "alias": [
      "compact disk harrow",
      "kompaktor"
    ],
    "related": [
      "orba",
      "no-till",
      "organicka-hmota"
    ]
  },
  {
    "slug": "mulcovac",
    "term": "Mulczer",
    "kategorie": "technologie",
    "shortDef": "Mulczer to rotacyjne rozdrabniacz masy roślinnej — ściernisk, resztek pożniwnych, trawy, słabych krzewów. Podłączony do WOM ciągnika przez układ trzypunktowy.",
    "longDef": "Mulczer rozdrabnia masę roślinną na bardzo drobne kawałki za pomocą obracających się młotków lub noży na poziomym lub pionowym rotorze.\n\n**Dwa główne typy**:\n- **Rotor poziomy (oś prostopadle do kierunku jazdy)** — klasyczny do powierzchniowego mulczowania trawy i ścierniska. Najczęstszy.\n- **Rotor pionowy (oś pionowa)** — do leśnych prac poręby, gęstszej roślinności.\n\n**Szerokość robocza**:\n- **1,2–2 m** — do sadów, winnic, komunalnych.\n- **2,5–4 m** — do pól (ściernisko, rośliny paszowe).\n- **4–8 m** — wielkie gospodarstwa, przedsiębiorstwa żniwne.\n\n**Zastosowanie**:\n- **Mulczowanie ścierniska** po żniwach zbóż — pozostałe źdźbła rozdrobnione, przyspiesza rozkład.\n- **Utrzymanie TUZ** — 1–2× rocznie mulczowanie pastwisk.\n- **Mulczowanie poplonów** przed przyoraniem.\n- **Sady i winnice** — mulczowanie trawy w międzyrzędziach.\n- **Likwidacja resztek łodyg kukurydzy** — przeciwko omacnicy prosowiance.\n\n**Napęd**: WOM 540 lub 1000 obr/min. Zapotrzebowanie na moc zazwyczaj 50–150 KM w zależności od szerokości.\n\n**Czołowe marki**:\n- **Berti** (IT) — premium, szeroka oferta.\n- **Kuhn** (BPR, BC) — FR uniwersalny.\n- **Krone** (BiG M, EasyCut) — DE do wydajnych zastosowań.\n- **Maschio Gaspardo** (IT) — cenowo dostępny.\n\n**Cena (2026)**: 1,8 m hobby = 50 000–80 000 Kč, 2,5 m średni = 120 000–250 000 Kč, 4 m profi = 300 000–600 000 Kč.",
    "alias": [
      "mulcher",
      "mulcher rotacyjny"
    ],
    "related": [
      "pto",
      "tribod",
      "orba"
    ]
  },
  {
    "slug": "naves-sklapeci",
    "term": "Przyczepa wywrotka (trójstronny wywrot)",
    "kategorie": "technologie",
    "shortDef": "Przyczepa wywrotka (trójstronny wywrot) to przyczepa transportowa z hydraulicznym wywrotem na 3 strony. Kluczowa w liniach żniwnych, transporcie plonów i nawozów.",
    "longDef": "Przyczepa wywrotka to dominująca jednostka transportowa w rolnictwie. **Trójstronny wywrot** = może wywrócić ładunek do tyłu oraz na obie boczne strony (3-way tipper).\n\n**Nośność**:\n- **Lekka 8 t** — dla małych gospodarstw, ciągnik 80+ KM.\n- **Standardowa 12–16 t** — dla średnich gospodarstw, ciągnik 130+ KM.\n- **Duża 18–24 t** — dla wielkich gospodarstw, ciągnik 180+ KM. Osie tandem lub tridem.\n- **Extra 28+ t** — przedsiębiorstwa żniwne, napęd własny.\n\n**Konstrukcja**:\n- **Skrzynia** stalowa lub aluminiowa (lżejsza, oszczędność masy 200 kg).\n- **Osie** — pojedyncza (do 12 t), tandem (12–20 t), tridem (20+ t).\n- **Hamulce** pneumatyczne — standard od 10 t (obowiązkowe w UE).\n- **Hydraulika** — wywrot + burtnice + tylna klapa.\n\n**Systemy wywrotu**:\n- **Teleskopowy siłownik hydrauliczny** — standard, cylinder 2–4-stopniowy.\n- **Wywrot tylny** — wywraca wyłącznie do tyłu, tańszy.\n- **Wywrot 3-stronny** — wyjątkowo też na boki (przydatny przy rozładunku do silosów kiszonkowych lub w ciasnych przestrzeniach).\n\n**Zastosowanie**:\n- **Żniwa** — odwóz zboża od kombajnu.\n- **Zbiór pasz** — kiszonka z kukurydzy / traw.\n- **Transport nawozów, wapna** — ze stacji na pole.\n- **Prace komunalne** — wywóz urobku, kruszywa.\n\n**Czołowe marki**:\n- **Joskin** (BE) — Trans-Cap, KTP. Premium.\n- **Strom** (CZ) — Vario, Master. Jakość krajowa.\n- **Bednar** (CZ) — Atlas. Atrakcyjna cenowo.\n- **Conow** (DE) — seria TMH.\n- **Krampe** (DE) — Bandit, BIG body.\n\n**Cena (2026)**: 12 t pojedyncza = 350 000–600 000 Kč, 18 t tandem = 700 000–1,5 mln Kč, 24 t tridem = 1,5–3 mln Kč.",
    "alias": [
      "tipper",
      "wywrotka"
    ],
    "related": [
      "pto",
      "tribod"
    ]
  },
  {
    "slug": "kukurice-silazni",
    "term": "Kukurydza kiszonkowa",
    "kategorie": "plodiny",
    "shortDef": "Kukurydza kiszonkowa uprawiana jest na całe rośliny (kolby + łodygi + liście), zbierana niedojrzała i fermentowana jako kiszonka — główna pasza dla bydła w ČR.",
    "longDef": "Kukurydza kiszonkowa to odmianowy typ kukurydzy uprawiany na **zbiór całoroślinny** (w odróżnieniu od kukurydzy ziarnowej, która zbiera wyłącznie kolby). Główna pasza dla bydła w ČR — u krowy mlecznej stanowi 30–60 % objętości dawki pokarmowej.\n\n**Uprawa**:\n- **Siew**: koniec kwietnia – połowa maja (po zimnych ogrodnikach, gleba 10 °C).\n- **Materiał siewny**: 80 000–110 000 ziaren/ha = 22–28 kg/ha.\n- **Nawożenie**: 150–200 kg N/ha, plus P, K nawożenie podstawowe jesienią.\n- **Oprysk**: pre-em na kiełkujące chwasty (Lumax, Successor) + post-em na drugą falę (Callisto, Laudis).\n- **Zbiór**: koniec sierpnia – październik, wilgotność całej rośliny 30–35 % (optimum dla kiszenia).\n\n**Plony**:\n- **Zielona masa**: 30–60 t/ha (średnia ČR 45 t/ha).\n- **Sucha masa**: 10–18 t/ha (kiszonkowa).\n- **Energia**: 5–8 GJ/ha NEL (energia netto laktacji).\n\n**Zbiór**:\n- **Sieczkarnia** (Claas Jaguar, JD 9000, NH FR) — tnie, kruszy ziarno (cracking), dmucha do przyczepy.\n- **Długość sieczki**: 8–22 mm zależnie od zawartości suchej masy i rodzaju silosu.\n- **Cena usługi zbioru**: 2 000–4 000 Kč/ha + przyczepy 800–1 200 Kč/h.\n\n**Kiszenie**:\n- **Silos** wypełniany i ubijany ciągnikiem gąsienicowym.\n- **Przykrycie** folią plastikową + obciążenie (opony / worki z piaskiem).\n- **Fermentacja** 4–6 tygodni → doskonała pasza.\n\n**Czołowe regiony w ČR**: południowe Morawy, Nizina Łabska, dolne Posázaví. W północnych regionach górskich sezon jest krótszy, a plony niższe.",
    "alias": [
      "silage corn",
      "kukurydza paszowa"
    ],
    "related": [
      "osevni-postup",
      "orba"
    ]
  },
  {
    "slug": "repka-ozima",
    "term": "Rzepak ozimy",
    "kategorie": "plodiny",
    "shortDef": "Rzepak ozimy to strategiczna roślina oleista w ČR — uprawiany na 380–420 tys. ha (12 % gruntów ornych). Plon 3,5–4,5 t/ha, głównie na biopaliwa i olej spożywczy.",
    "longDef": "Rzepak ozimy (Brassica napus) to najważniejsza roślina oleista w ČR. Uprawiany na **380–420 tys. ha** = 12 % gruntów ornych (druga najbardziej rozpowszechniona roślina po pszenicy).\n\n**Uprawa**:\n- **Siew**: 15 sierpnia – 5 września (precyzyjnie, krótsze okno → niższy plon).\n- **Materiał siewny**: 2–4 kg/ha (hybrydy) lub 5–8 kg/ha (linie). 35–50 ziaren/m².\n- **Nawożenie**: P + K jesienią (200 kg superfosfatu, 150 kg soli potasowej). Wiosna 150–200 kg N w 2 dawkach (regeneracja + pąkowanie).\n- **Oprysk**: insektycydy przeciw pchełce ziemnej (jesień), choroby (wiosenne fungicydy przeciw zgniliźnie twardzikowej, suchej zgniliźnie kapustnych), regulatory wzrostu.\n- **Zbiór**: koniec czerwca – połowa lipca. Kombajn z rzepakowym stołem żniwnym (listwa Vario).\n\n**Plony** (średnia ČR 2024):\n- **3,5 t/ha** przeciętne warunki.\n- **4,0–4,5 t/ha** dobre lata + premium hybryda.\n- **5+ t/ha** czołówka (najlepsi rolnicy).\n\n**Ceny** (2024–2026):\n- **Cena realizacyjna** 11 000–14 000 Kč/t.\n- **Przychód**: 4 t × 12 500 = 50 000 Kč/ha.\n- **Koszty**: ~25 000 Kč/ha (nasiona 4 000 + nawozy 8 000 + środki ochrony roślin 6 000 + mechanizacja 7 000).\n- **Marża**: 20 000–30 000 Kč/ha = bardzo atrakcyjne w porównaniu do zbóż.\n\n**Dopłaty VCS**: BRAK (rzepak jest w UE długoterminowo silny konkurencyjnie).\n\n**Rynek**:\n- **Skupują**: Komodita Praha, Granaria, Glencore, Agrofert.\n- **Zastosowanie**: 70 % biopaliwa (FAME), 20 % olej spożywczy, 10 % pasze (śruty rzepakowe).\n- **Konkurencja**: import oleju słonecznikowego (UA, RU), oleju palmowego (Indonezja).\n\n**Ryzyko**: zagrożenie populacji pszczół przez neonikotynoidy (od 2018 UE zakaz stosowania na rzepak). Obecne insektycydy mają niższą skuteczność → wyższe ryzyko uszkodzeń przez pchełkę.",
    "alias": [
      "oilseed rape",
      "canola"
    ],
    "related": [
      "osevni-postup",
      "ozim-jarin",
      "orba"
    ]
  },
  {
    "slug": "sojaova-bob",
    "term": "Soja zwyczajna",
    "kategorie": "plodiny",
    "shortDef": "Soja to najważniejsza roślina strączkowa świata, w ČR roślina mniejszościowa (15–25 tys. ha), ale o rosnącym znaczeniu. Bogata w białko (40 %), wiąże atmosferyczny N.",
    "longDef": "Soja zwyczajna (Glycine max) to najważniejsza oleista roślina strączkowa na świecie. W ČR roślina o rosnącym znaczeniu (z 5 000 ha w 2010 do ~20 000 ha w 2024), wspierana dopłatą VCS 2 800 Kč/ha.\n\n**Uprawa**:\n- **Siew**: koniec kwietnia – początek maja, gleba min. 8 °C.\n- **Materiał siewny**: 110–130 kg/ha. Gładkie nasiona, wymagają precyzyjnego siewu maszyną pneumatyczną.\n- **Inokulacja**: niezbędna! Nasiona soi zabarwić bakteriami Rhizobium japonicum dla wiązania N. Bez inokulacji = soja nie produkuje N, a plon spada o 30–50 %.\n- **Nawożenie**: tylko P + K (soja wytwarza N sama). Żadnych nawozów azotowych!\n- **Oprysk**: pre-em (Pulsar), post-em (Pulsar Plus). Insektycydy tylko wyjątkowo.\n- **Zbiór**: koniec września – połowa października. Standardowy kombajn z rzepakowym / sojowym elastycznym hederem.\n\n**Plony** (średnia ČR 2024):\n- **2,5–3,2 t/ha** typowe.\n- **3,5+ t/ha** dobre lata + nawadnianie.\n\n**Właściwości ziarna**:\n- **40 % białka** (vs pszenica 12 %) — najbogatsze roślinne źródło.\n- **20 % oleju** — olej sojowy do żywności i biopaliw.\n- **Cena** (2024): 12 000–16 000 Kč/t.\n\n**Ekonomika** (3 t/ha × 14 000 = 42 000 Kč przychód + 2 800 Kč VCS):\n- Przychód ~44 800 Kč/ha.\n- Koszty ~22 000 Kč/ha (nasiona + inokulacja + nawozy + środki ochrony roślin + mechanizacja).\n- **Marża ~22 000 Kč/ha** = porównywalna z rzepakiem, ale mniejsze ryzyko.\n\n**Dlaczego w ČR rosną powierzchnie**:\n- **Dążenie UE do niezależności od importu soi** z Brazylii/Argentyny (gdzie wylesianie pod uprawy).\n- **Premia VCS 2 800 Kč/ha** = +30 % dochodu.\n- **Wiązanie N** poprawia strukturę gleby pod kolejną roślinę.\n- **Cena rynkowa** rośnie ze względu na przemysł paszowy (śruta sojowa dla świń, drobiu).\n\n**Ryzyka**:\n- **Susza w sierpniu** (kwitnienie) = wyraźny spadek plonu.\n- **Choroby** Sclerotinia (zgnilizna twardzikowa) — ograniczenie regionalne.\n- **Gołębie** chętnie zbierają na polu (ryzyko 5–10 % strat).",
    "alias": [
      "soja",
      "soybean",
      "soja"
    ],
    "related": [
      "osevni-postup",
      "cap-2024"
    ]
  },
  {
    "slug": "vojteska",
    "term": "Lucerna siewna",
    "kategorie": "plodiny",
    "shortDef": "Lucerna to wieloletnia roślina pastewna (3–5 lat na jednym gruncie) bogata w białko. Zbierana 3–4× rocznie, wiąże N, poprawia strukturę gleby.",
    "longDef": "Lucerna siewna (Medicago sativa) to najlepsza pastewna roślina strączkowa w klimacie umiarkowanym. **Wieloletnia** roślina — wysiewana na 3–5 lat, zbierana 3–4× w sezonie (3 w ČR, 4 w południowych Włoszech).\n\n**Uprawa**:\n- **Siew**: wiosna (marzec–kwiecień) jako „podsiew\" pod zboże (żyto, jęczmień) lub czysty łan.\n- **Materiał siewny**: 15–25 kg/ha. Inokulacja Sinorhizobium meliloti konieczna.\n- **Nawożenie**: tylko P + K jesienią (200 kg superfosfatu, 100 kg KCl). Żadnego N (własne wiązanie 200–300 kg N/ha/rok).\n- **Żadnych oprysków** na samą lucernę (silnie konkuruje z chwastami i je tłumi).\n\n**Zbiór** (3× w sezonie w ČR):\n- **1. pokos**: połowa maja (50 % kwitnienia — najwyższa zawartość białka).\n- **2. pokos**: koniec czerwca.\n- **3. pokos**: koniec sierpnia.\n- Ewentualnie **4. pokos** we wrześniu (niski plon, tylko przy silnym łanie).\n\n**Plon** (średnia 3-letnia):\n- **8–12 t suchej masy/ha/rok** łącznie (podzielone na 3–4 pokosy).\n- **Około 25 % białka** w suchej masie.\n\n**Zastosowanie**:\n- **Sianokiszonka / kiszonka** dla bydła — baloty beczkowe.\n- **Siano** tradycyjne (suszenie naturalne).\n- **Zielona pasza** na pastwisko lub bezpośrednio do żłobu.\n- **Granulat** dla przemysłowych mieszanek paszowych (granulat suszarniany).\n\n**Korzyści w płodozmianie**:\n- **Wiązanie N** 200–300 kg/ha/rok — istotna premia dla kolejnej rośliny.\n- **Głęboki korzeń** (do 3 m) — rozbija zagęszczenie podglebia, pobiera składniki z głębokości.\n- **Poprawia strukturę gleby** — lucerna po 3 latach odbudowuje próchnicę.\n- **Po lucernie** typowo uprawia się pszenicę ozimą (wysoki plon dzięki N + strukturze).\n\n**Rynek**:\n- **Cena sianokiszonki w balotach**: 1 800–3 000 Kč/t (regionalnie).\n- **Cena granulatu**: 4 000–6 000 Kč/t.\n- **WPR**: lucerna kwalifikuje się na ekoregumin (powierzchnia ekologiczna) + AEKO użytki zielone.\n\n**Ważne odmiany**: Verdor (FR), Power (US), Niagara (FR), krajowa Kometa (CZ).",
    "alias": [
      "Medicago sativa",
      "alfalfa",
      "lucerne"
    ],
    "related": [
      "osevni-postup",
      "organicka-hmota",
      "mezi-plodiny"
    ]
  },
  {
    "slug": "telematika",
    "term": "Telematyka",
    "kategorie": "precise-farming",
    "shortDef": "Telematyka to system zdalnego monitorowania maszyny przez sieć komórkową — śledzi pozycję, motogodziny, zużycie paliwa, błędy. Standard w maszynach premium od 2010 roku.",
    "longDef": "Telematyka w rolnictwie to odpowiednik lokalizatora GPS w samochodach osobowych, ale rozszerzona o **dane techniczne maszyny** (magistrala CAN). Maszyna wysyła dane do platformy chmurowej przez sieć komórkową (LTE), gdzie właściciel / dealer widzi stan w czasie rzeczywistym.\n\n**Główne platformy** (wg marki):\n- **John Deere Operations Center** (Ops Center) + JDLink — najbardziej rozbudowane. Śledzi 100+ parametrów, mapy agronomiczne, konserwację predykcyjną.\n- **Case IH AFS Connect** + Trimble Display — wspólne z NH.\n- **New Holland PLM Connect** — mapy zbiorów, prefix GPS.\n- **Fendt Connect** + FendtONE — aktualizacje bezprzewodowe, telemetria.\n- **Claas TELEMATICS** — analityka zbiorów.\n- **AGCO Fuse** (Massey, Valtra, Fendt) — ujednolicona platforma.\n- **Trimble Connected Farm** — multi-brand dla starszych maszyn.\n\n**Co monitoruje**:\n- **Pozycja GPS** w czasie rzeczywistym, historia tras.\n- **Motogodziny** + czas pracy / postoju.\n- **Zużycie paliwa** na hektar / na godzinę.\n- **Obroty silnika, przekładnia, moc, obciążenie**.\n- **Kody błędów** — natychmiastowe powiadomienie SMS / e-mail.\n- **Mapy zbiorów** (kombajny) — plon na punkt GPS.\n- **Stan AdBlue, DPF** — ostrzeżenie przed regeneracją / uzupełnieniem.\n- **Wejście w „geofence\"** — alarm przy wyjechaniu z gospodarstwa / kradzieży.\n\n**Polityka cenowa** (2026):\n- **JD Operations Center**: bezpłatnie dla właściciela maszyny JD (3-letnia subskrypcja przy zakupie).\n- **Fendt Connect**: bezpłatnie przez 5 lat, potem 800–1 500 Kč/rok.\n- **AGCO Fuse**: zmienna wg pakietu.\n- **Trimble Connected Farm**: 5 000–15 000 Kč/rok na maszynę.\n\n**Dla rolników w ČR**:\n- **W małych gospodarstwach** często niewykorzystane — papierkowa robota w Excelu wystarcza.\n- **W gospodarstwach 200+ ha** z 3+ maszynami już ma sens — zarządzanie flotą, konserwacja predykcyjna.\n- **Przedsiębiorstwa żniwne** standardowo używają do rozliczania motogodzin i zebranych ha per klient.\n\n**Prywatność / własność danych**: kontrowersje — kto jest właścicielem danych agronomicznych? W UE RODO reguluje dane osobowe, ale do danych produkcyjnych producent ma dostęp umowny (wykorzystuje do rozwoju). Część rolników naciska na inicjatywy „Farm Data Privacy\".",
    "alias": [
      "JDLink",
      "AFS Connect",
      "MyPLM",
      "PLM Connect",
      "fleet management"
    ],
    "related": [
      "isobus",
      "gps-rtk",
      "yield-monitor"
    ]
  },
  {
    "slug": "autonomni-traktor",
    "term": "Ciągnik autonomiczny",
    "kategorie": "precise-farming",
    "shortDef": "Ciągnik autonomiczny jeździ po polu bez kierowcy — łączy RTK GPS + LiDAR + kamery + AI. Demonstracje od 2022+ (JD 8R Autonomous), komercyjna dostępność jeszcze powolna.",
    "longDef": "Ciągnik autonomiczny to kolejny poziom rolnictwa precyzyjnego — maszyna pracuje na polu **całkowicie bez kierowcy w kabinie**. Połączenie technologii:\n\n- **RTK GPS** (centymetrowa dokładność trasy).\n- **LiDAR** (trójwymiarowe mapowanie otoczenia, wykrywanie przeszkód).\n- **Wielospektralne kamery** (rozpoznawanie rośliny uprawnej od chwastów).\n- **AI** (podejmowanie decyzji w czasie rzeczywistym).\n- **Łączność 5G** (zdalne sterowanie + nadzór).\n\n**Obecne komercyjne demonstracje**:\n- **John Deere 8R Autonomous** (CES 2022): w pełni autonomiczny ciągnik z 6 kamerami i AI NVIDIA Jetson. Dostępny 2023+ na wybranych rynkach w USA. Cena ~800 000 USD (300 tys. USD dopłata ponad standardowy 8R).\n- **Case IH Autonomous Concept** (2016): koncepcja bez kabiny w ogóle. Nie wdrożona komercyjnie.\n- **AGCO Fendt MARS** (2019): rój małych autonomicznych robotów zamiast jednej dużej maszyny. Nadal w fazie badań.\n- **Bear Flag Robotics** (spółka zależna Trimble, przejęta przez JD w 2021): dodatkowy system autonomii do istniejących ciągników.\n- **Monarch Tractor** (startup USA, 2020+): autonomiczny elektryczny ciągnik 70 KM do winnic. Cena 58 000 USD.\n\n**Sytuacja w ČR (2026)**:\n- **Żaden autonomiczny ciągnik faktycznie nie pracuje**.\n- **Częściowe funkcje autonomiczne** (auto-steering, section control, automatyczny obrót na uwrociach) są standardem w maszynach premium.\n- **Regulacje** dla maszyn autonomicznych na polu jeszcze nie istnieją (na drodze publicznej byłby problem z prawem jazdy).\n\n**Bariery wdrożenia komercyjnego**:\n- **Cena** — dopłata 300 000 USD ponad zwykły ciągnik jest nieosiągalna dla 99 % rolników.\n- **Bezpieczeństwo** — pole nie jest odizolowaną kontrolowaną przestrzenią jak fabryka. Ryzyko potrącenia człowieka / zwierzęcia.\n- **Regulacje** — UE nie zdefiniowała jeszcze jasnych przepisów dla autonomicznych maszyn polowych.\n- **ROI** — kierowca kosztuje 30 000–50 000 Kč/mies., autonomiczna maszyna opłaca się tylko w wielkim gospodarstwie przy pracy 24/7.\n\n**Realistyczna oś czasu**:\n- **2025–2030**: autonomia dla wąskich zastosowań (oprysk, koszenie) w wielkich gospodarstwach.\n- **2030+**: rozszerzenie dla średnich gospodarstw w ČR, dostępność cenowa.\n- **2035+**: standard.\n\n**Aktualnie zalecamy** dla rolników w ČR korzystanie z **funkcji semi-autonomicznych** (auto-steering, ISOBUS, telematyka) — 80 % korzyści za 20 % ceny.",
    "alias": [
      "autonomous tractor",
      "driverless"
    ],
    "related": [
      "auto-steering",
      "gps-rtk",
      "telematika",
      "isobus"
    ]
  },
  {
    "slug": "drony-zemedelstvi",
    "term": "Drony w rolnictwie",
    "kategorie": "precise-farming",
    "shortDef": "Drony w rolnictwie służą do: monitoringu (wielospektralne zdjęcia NDVI), aplikacji (oprysk, wysiew międzyplonów), kontroli (kradzieże, powodzie). Standard dla rolników precyzyjnych.",
    "longDef": "Drony (UAV — Unmanned Aerial Vehicles) w rolnictwie spełniają 3 główne zadania:\n\n### 1. Monitoring (najczęstszy)\n- **Zdjęcia wielospektralne** — kamera RGB + NIR, obliczanie indeksów biomasy NDVI / EVI.\n- **Mapowanie 3D** — wysokość roślin, deformacje pól.\n- **Pułap lotu** 50–120 m, pokrycie 50–200 ha na godzinę.\n- **Modele dronów**: DJI Phantom 4 Multispectral (6 000 USD), DJI Mavic 3 Multispectral (5 500 USD), Parrot Anafi USA (7 000 USD), eBee X (25 000+ USD profesjonalny).\n\n### 2. Aplikacja (oprysk / wysiew) — rosnące zastosowanie\n- **Drony do oprysku** — Yamaha RMAX (JP), DJI Agras T40/T50, EAVision EA-30X.\n- **Użyteczny ładunek**: 30–40 l cieczy roboczej, szerokość robocza 8–11 m.\n- **Wydajność**: 4–10 ha/h.\n- **Cena**: 15 000–50 000 USD dron + 5 000–15 000 USD baterie + oprogramowanie.\n- **W ČR**: nadal **rzadko stosowane** — rozporządzenie SUR (Sustainable Use Regulation UE) komplikuje lotnicze opryskiwanie (wymagane specjalne zezwolenie).\n\n### 3. Kontrola i bezpieczeństwo\n- **Drony patrolujące** — kontrola ogrodzeń, kradzieży.\n- **Kamery termiczne** — wykrywanie zwierząt przed koszeniem (ochrona saren).\n- **Mapowanie powodziowe** — DJI Mavic z kamerą termiczną.\n\n### Regulacje w ČR (EASA + ÚCL):\n- **Kategoria otwarta** (A1/A2/A3) dla dronów poniżej 25 kg w zasięgu wzroku.\n- **Kategoria szczególna** dla lotniczych oprysków — wymagane zezwolenie OSO (Operations Specific Operations) od Urzędu Lotnictwa Cywilnego.\n- **Certyfikat pilota** A1/A3 bezpłatnie online, A2 za 800 Kč.\n- **Rejestracja operatora** obowiązkowa (19 EUR/rok).\n\n### Dla rolników w ČR (2026):\n- **Monitoring** — DJI Mavic 3 Multispectral to optimalny wybór dla gospodarstw 100–500 ha. ROI 1–2 sezony dzięki oszczędności nawozów (dawkowanie zmienne).\n- **Aplikacja** — nadal **drogie i regulacyjnie wymagające**. Klasyczny opryskiwacz z GPS + Section Control jest lepszym rozwiązaniem.\n- **Kamery termiczne** — dla dużych TUZ z wysokim prawdopodobieństwem sarniąt, ekonomicznie wymagające.",
    "alias": [
      "UAV",
      "agriculture drone",
      "precision drone"
    ],
    "related": [
      "ndvi",
      "variable-rate",
      "section-control"
    ]
  },
  {
    "slug": "sp-szp-2023-2027",
    "term": "Plan Strategiczny WPR 2023–2027",
    "kategorie": "dotace",
    "shortDef": "Plan Strategiczny WPR 2023–2027 to krajowa implementacja unijnej Wspólnej Polityki Rolnej dla ČR. Definiuje wszystkie tytuły dotacyjne (płatności bezpośrednie, AEKO, inwestycje).",
    "longDef": "Plan Strategiczny Wspólnej Polityki Rolnej (PS WPR) to wiążący dokument zatwierdzony przez Komisję UE oddzielnie dla każdego państwa członkowskiego na okres 2023–2027. **Dla ČR** definiuje budżet ~110 mld Kč na 5-letni okres i wszystkie tytuły dotacyjne.\n\n**Struktura PS WPR ČR**:\n\n### Filar I — Płatności bezpośrednie (~50 % budżetu):\n- **BISS** (Płatność podstawowa) ~2150 Kč/ha\n- **CISS** (Redystrybucyjna) ~1450 Kč/ha dla pierwszych 150 ha\n- **Ekoregumin** podstawowy 1300 + premium +1100 Kč/ha\n- **ANC** (obszary o niekorzystnych warunkach) 2000–4500 Kč/ha\n- **Młody rolnik** +1500 Kč/ha premia\n- **VCS** (sektory wrażliwe) — zmienna\n\n### Filar II — Rozwój obszarów wiejskich (PRV):\n- **AEKO** umowy (5-letnie agro-środowiskowe)\n- **Tytuły inwestycyjne** (Interwencja 33.73, 37.73 i inne)\n- **LFA** (Less Favoured Areas — pokrywa się z ANC)\n- **Dobrostan zwierząt** — specjalne płatności\n- **Premia ekologiczna** dla rolnictwa ekologicznego\n- **Ubezpieczenie plonów** (50 % współfinansowanie państwa)\n\n**Kluczowe interwencje** (oznaczenia numeryczne w PS WPR):\n- **33.73** — Inwestycje w przedsiębiorstwa rolne (maszyny, budynki).\n- **37.73** — Technologie ograniczające emisje (nawożenie z mniejszą emisją NH₃).\n- **47.73** — Scalanie gruntów.\n- **51.73** — Młodzi rolnicy — jednorazowe wsparcie na rozpoczęcie działalności.\n- **75.73** — AEKO użytki zielone.\n\n**Dokumentacja dla wnioskodawców**:\n- **Dokument główny**: https://eagri.cz/web/mze/dotace/sp-szp-2023-2027\n- **Zasady SZIF** dla każdego tytułu oddzielnie — zawsze sprawdzać aktualną wersję (zmienia się co roku).\n- **Portal Rolnika** — elektroniczne składanie wszystkich wniosków.\n\n**Dla rolników w ČR**:\n- **Wniosek zbiorczy** (kwiecień–czerwiec) obejmuje większość płatności bezpośrednich.\n- **Dotacje inwestycyjne** mają własne nabory (typowo 2× rocznie).\n- **Umowy AEKO** zawierane na 5 lat — wejście to decyzja długoterminowa.\n\n**Kontrole**: SZIF kontroluje 1–5 % wnioskodawców na miejscu + monitoring satelitarny (Copernicus SISAEC) całego LPIS co roku.",
    "alias": [
      "Strategický plán SZP",
      "Common Agricultural Policy Strategic Plan"
    ],
    "related": [
      "cap-2024",
      "biss",
      "aeko",
      "jednotna-zadost"
    ]
  },
  {
    "slug": "intervence-33-73",
    "term": "Interwencja 33.73 (Inwestycje w przedsiębiorstwa rolne)",
    "kategorie": "dotace",
    "shortDef": "Interwencja 33.73 to główna dotacja inwestycyjna w ČR — obejmuje zakup maszyn, budynki, technologie. Stawka 50–60 % kosztów kwalifikowalnych, 10 % premia dla młodych rolników.",
    "longDef": "Interwencja 33.73 to najważniejsza dotacja inwestycyjna dla rolników w ČR. Obejmuje:\n\n**Koszty kwalifikowalne**:\n- **Maszyny i sprzęt** — ciągniki, kombajny, siewniki, opryskiwacze, prasy, żniwiarki, ładowacze.\n- **Budynki dla produkcji zwierzęcej** — obory, dojarnie, silosy.\n- **Budynki do przechowywania** — silosy, śrutowniki, chłodnie.\n- **Technologie rolnictwa precyzyjnego** — GPS, ISOBUS, aplikacja dawkowania zmiennego.\n- **Nawadnianie** — inwestycje w systemy irygacyjne.\n\n**Stawki dotacji** (procent kosztów kwalifikowalnych, 2024):\n- **50 %** — produkcja roślinna.\n- **60 %** — produkcja zwierzęca (premia dobrostan).\n- **+10 % dla młodych rolników** (do 40 lat, pierwsze 5 lat od rozpoczęcia działalności).\n- **+10 % dla stref ANC** (obszary o niekorzystnych warunkach).\n- **+5 % za współpracę** (między gospodarstwami / z jednostkami badawczymi).\n\nMaksymalna stawka łącznie: **80 % kosztów kwalifikowalnych**.\n\n**Ograniczenia**:\n- **Maszyny mobilne** (ciągniki, kombajny) — maks. 49 % kosztów kwalifikowalnych z całego projektu. Reszta musi stanowić budynki / stałe technologie.\n- **Maksymalna dotacja na projekt**: 1–10 mln Kč zależnie od wielkości gospodarstwa.\n- **Maksymalna dotacja na wnioskodawcę w okresie**: 30 mln Kč 2023–2027.\n\n**Procedura wnioskowania**:\n1. **Przygotowanie projektu** — projekt, biznesplan, ocena ekonomiczna.\n2. **Ogłoszenie naboru** (typowo 2× rocznie) — SZIF publikuje warunki.\n3. **Złożenie** przez Portal Rolnika w oknie 3–4-tygodniowym.\n4. **Ocena** (3–6 miesięcy) — punktowa ocena projektu.\n5. **Decyzja** — pozytywna / odroczona / odrzucona.\n6. **Realizacja** (1–3 lata) — zakup maszyn, budowa, dokumentacja.\n7. **Wniosek końcowy o płatność** — wypłata dotacji po udokumentowaniu inwestycji.\n\n**Praktyczne wskazówki**:\n- **Konsultant** specjalizujący się w PRV wyraźnie zwiększa szansę zatwierdzenia (3 000–15 000 Kč za projekt). W umowie zazwyczaj 2–5 % dotacji = premia za sukces.\n- **Timing**: kupuj sprzęt **po zatwierdzeniu dotacji**, nie przed. Przed zatwierdzeniem = koszt nieuznany.\n- **Dokumentacja**: faktury, umowy, dokumentacja fotograficzna przebiegu, dowód opłacalności ekonomicznej.\n\n**Ryzyko**: niespełnienie warunków (np. eksploatacja maszyny min. 5 lat, jakość budowy) = **zwrot dotacji z odsetkami**. Standardowo kontrolowane przez SZIF w ostatnich latach.",
    "alias": [
      "Investice do zemědělství",
      "PRV investice",
      "I.33.73"
    ],
    "related": [
      "sp-szp-2023-2027",
      "cap-2024",
      "aeko"
    ]
  },
  {
    "slug": "agrarni-komora",
    "term": "Izba Rolnicza ČR (AK ČR)",
    "kategorie": "regulace",
    "shortDef": "AK ČR to główna organizacja skupiająca rolników, leśników i producentów żywności w ČR — zrzesza ok. 5 000 członków, lobbuje na rzecz branży w rządzie i UE.",
    "longDef": "Izba Rolnicza ČR (AK ČR) to największa organizacja skupiająca rolników, producentów żywności, leśników i winiarzy w ČR. Założona w 1993 roku na mocy ustawy nr 301/1992 Dz.U.\n\n**Baza członkowska**: ok. **5 000 osób fizycznych i prawnych** z różnych branż.\n\n**Główne role**:\n- **Lobbing** w Ministerstwie Rolnictwa, rządzie i u europosłów — interesy rolnictwa ČR w unijnej WPR, wyjątki dla specyfiki ČR.\n- **Punkt konsultacyjny** w procesie legislacyjnym — wszystkie ustawy dotyczące rolnictwa przechodzą przez AK ČR.\n- **Reprezentacja** w COPA-COGECA (europejskie lobby rolnicze w Brukseli).\n- **Doradztwo** dla członków — podatkowe, dotacyjne, prawne.\n- **Szkolenia** — seminaria, kongresy, wystawy (Země živitelka w Czeskich Budziejowicach).\n- **Certyfikacja** — Klasa, Czeski Produkt, regionalne znaki jakości.\n\n**Struktura**:\n- **Prezydium** — organ wykonawczy, mandat 5-letni.\n- **Sejmik** — najwyższy organ, 1× rocznie.\n- **8 sekcji** wg branży: produkcja roślinna, zwierzęca, leśnictwo, winiarstwo, sadownictwo, warzywnictwo, mleczarstwo, przemysł mięsny.\n- **14 izb regionalnych** (per kraj).\n\n**Składka członkowska** (2024):\n- **Osoba fizyczna**: 1 200–3 600 Kč/rok zależnie od wielkości gospodarstwa.\n- **Osoba prawna**: 5 000–50 000 Kč/rok zależnie od obrotów.\n- **Korzyść**: członkowie otrzymują pismo Zemědělec, helpdesk prawny, doradztwo dotacyjne.\n\n**Kontrowersje**:\n- **Zaangażowanie polityczne** — historycznie bliskie związki z ČSSD, dziś bardziej neutralna.\n- **Konflikt interesów dużych i małych gospodarstw** — AK ČR często krytykowana za forsowanie interesów wielkich agro-holdingów (Agrofert i in.) kosztem gospodarstw rodzinnych.\n- **Konkurencja**: Stowarzyszenie Rolnictwa Prywatnego (ASZ) — alternatywa dla małych gospodarstw.\n\n**Dla rolników w ČR**: członkostwo ma sens dla gospodarstw 100+ ha (korzystają z doradztwa dotacyjnego i lobbingu). Dla hobby-farm do 10 ha korzyść często minimalna.\n\n**Strona www**: https://www.akcr.cz",
    "alias": [
      "AKČR",
      "agrární komora"
    ],
    "related": [
      "sp-szp-2023-2027",
      "cap-2024"
    ]
  },
  {
    "slug": "siloky-balik",
    "term": "Balot kiszonkowy",
    "kategorie": "agrotechnika",
    "shortDef": "Balot kiszonkowy to owalny balot zielonej paszy (lucerna, koniczyna, trawy) owinięty folią plastikową do fermentacji. Alternatywa dla dużego silosu kiszonkowego w mniejszych gospodarstwach.",
    "longDef": "Balot kiszonkowy to metoda kiszenia w kompaktowych balotach (vs klasyczny silos kiszonkowy). W gospodarstwach ČR do 200 krów mlecznych często jest ekonomiczniejszy niż budowa silosu kiszonkowego.\n\n**Przebieg pracy**:\n1. **Koszenie** — kosiarką z kondycjonerem (walcowanie łodyg dla szybszego suszenia).\n2. **Suszenie** w rzędach na polu 6–24 h (do suchej masy 30–45 %).\n3. **Przetrząsanie / zgrabianie** — przetrząsacz, zgrabiarka dla jednorodnego rzędu.\n4. **Belowanie** — prasa okrągła (round baler) tworzy cylindryczne baloty 1,2 × 1,2 m (ok. 600 kg) lub 1,5 × 1,2 m (800–1000 kg).\n5. **Owijanie** — natychmiast po sprasowaniu (do 2 h) owinąć folią plastikową. Owijarka nawija 4–8 warstw (ok. 25–35 m folii na balot).\n6. **Przechowywanie** — baloty układać na jednym boku (łatwiejszy transport), kontrola na wgniecenia / uszkodzenia folii.\n\n**Maszyny + ceny (2026)**:\n- **Prasa okrągła** (round baler) — 350 000 – 1,5 mln Kč. Czołowe marki: Krone, John Deere, Massey Ferguson, Vicon, Welger, Kverneland.\n- **Owijarka** — 200 000 – 800 000 Kč. Hi-Spec wrapper / Pöttinger / McHale.\n- **Kombajn (prasa + owijarka w jednym)** — 800 000 – 2,2 mln Kč. McHale Fusion, Krone Comprima Wrap, Kuhn iBio.\n\n**Koszty na balot** (orientacyjnie):\n- **Folia**: 80–120 Kč/balot (6 warstw = 30 m × 4 Kč/m).\n- **Praca + ciągnik**: 100–200 Kč/balot.\n- **Amortyzacja maszyn**: 50–150 Kč/balot.\n- **Łącznie**: 230–470 Kč/balot = 230–470 Kč/600 kg = **0,40–0,80 Kč/kg suchej masy**.\n\nDla porównania **silos kiszonkowy**: 0,15–0,30 Kč/kg suchej masy (taniej), ale jednorazowa inwestycja 1–5 mln Kč na budowę.\n\n**Kiedy opłacają się baloty**:\n- **Małe / średnie gospodarstwo** (do 100 krów mlecznych) — nie potrzebuje silosu na 2000 t.\n- **Małe działki** z różnymi roślinami — elastyczność.\n- **Bez stałych budynków na działce** — dzierżawione pole, krótkoterminowe gospodarowanie.\n- **Karmienie poza gospodarstwem** — sprzedaż balotów sąsiednim hodowcom.\n\n**Czołowe marki pras**: McHale (IE), Krone Comprima (DE), JD 870 (US), MF RB 4180 (US), Kuhn FB 3140 (FR).",
    "alias": [
      "kiszonka baloty",
      "baled silage",
      "wrapping"
    ],
    "related": [
      "osevni-postup",
      "vojteska"
    ]
  },
  {
    "slug": "dojirna",
    "term": "Hala udojowa (typy)",
    "kategorie": "technologie",
    "shortDef": "Hala udojowa to technologia do dojenia bydła — od jodełki przez halę równoległą po robota. Wybór wpływa na wydajność pracy, dobrostan i nakłady inwestycyjne.",
    "longDef": "Hala udojowa to kompleks technologiczny do dojenia krów mlecznych. W ČR dominująca technologia przy stadach 50+ krów.\n\n**Główne typy**:\n\n### 1. Jodełka (Fishbone)\n- **Pozycja krów**: pod kątem 30° do stanowiska dojącego.\n- **Wielkość**: 2×4 do 2×12 stanowisk.\n- **Wydajność**: 60–80 krów/h.\n- **Dla stada**: 50–200 krów mlecznych.\n- **Cena**: 500 000 – 2 mln Kč.\n- **Zalety**: prosta, sprawdzona, tania.\n- **Wady**: wolniejsza niż nowsze systemy.\n\n### 2. Równoległa (Parallel)\n- **Pozycja krów**: prostopadle do stanowiska dojącego, dojar od tyłu.\n- **Wielkość**: 2×8 do 2×24.\n- **Wydajność**: 100–140 krów/h.\n- **Dla stada**: 100–500 krów.\n- **Cena**: 1,5–6 mln Kč.\n- **Zalety**: kompaktowa (węższa niż jodełka), wyższa wydajność.\n- **Wady**: dojar nie widzi wymion przedniego rzędu.\n\n### 3. Karuzela (Rotary)\n- **Pozycja krów**: na obracającej się platformie.\n- **Wielkość**: 24–80 stanowisk.\n- **Wydajność**: 150–300 krów/h.\n- **Dla stada**: 300+ krów.\n- **Cena**: 5–25 mln Kč.\n- **Zalety**: ekstremalna wydajność, ciągły przepływ krów.\n- **Wady**: ekstremalna inwestycja, wymaga pracy 24/7 dla zwrotu.\n\n### 4. Robot (AMS — Automatic Milking System)\n- **Pozycja**: krowy przychodzą same 2–3× dziennie.\n- **Wydajność**: 60–80 krów na robota (jednostka).\n- **Dla stada**: 60+ krów na robota, modularny.\n- **Cena**: 4–6 mln Kč na robota + 1–2 mln Kč instalacja.\n- **Zalety**: automatyzacja 24/7, brak dojara, dobrostan (krowa sama decyduje o rytmie), dane na krowę.\n- **Wady**: wysokia inwestycja, zależność od elektroniki, wymaga zoptymalizowanej obory.\n\n**Czołowe marki**:\n- **DeLaval** (SE) — robot VMS, jodełka, równoległa, karuzela. Tradycyjny lider.\n- **Lely** (NL) — robot Astronaut. Najlepiej sprzedający się AMS na świecie.\n- **GEA Westfalia** (DE) — DairyRobot, karuzela Magnum.\n- **BouMatic** (US) — równoległa, jodełka, robot.\n- **Fullwood** (UK) — jodełka, równoległa.\n\n**Ekonomika** (orientacyjnie dla stada 200 krów):\n- **Jodełka 2×10**: inwestycja 1,8 mln Kč, 2 dojare × 4 h × 2× dziennie.\n- **Równoległa 2×16**: inwestycja 3,5 mln Kč, 1 dojar × 3,5 h × 2× dziennie.\n- **3× Lely Astronaut**: inwestycja 18 mln Kč, 0 dojarów.\n- **Na litr mleka**: jodełka 0,30 Kč/l, równoległa 0,25, robot 0,40 (wyższe stałe, niższe zmienne).\n\nW ČR 2024: ok. **70 % gospodarstw jodełka/równoległa**, **20 % karuzela/rapid exit**, **10 % AMS robot** (rośnie szybko, głównie wśród młodszego pokolenia rolników).",
    "alias": [
      "milking parlor",
      "milkroom"
    ],
    "related": [
      "telematika",
      "rijnost",
      "usni-znamka"
    ]
  },
  {
    "slug": "uhor",
    "term": "Ugór",
    "kategorie": "historie",
    "shortDef": "Ugór to chwilowo nieobsiane pole, które się pozostawia na odpoczynek w celu regeneracji składników pokarmowych i zwalczania chwastów. W historycznym systemie trójpolowym 1/3 pól leżała odłogiem każdego roku. Dziś przetrwał jako „zielony ugór\" na potrzeby ekoschematu i EFA.",
    "longDef": "Ugór (od czasownika „ugorować\" = odpoczywać) to pole, które po zbiorach **tymczasowo pozostaje nieobsiane**, aby gleba mogła zregenerować składniki pokarmowe, wodę i strukturę. Historycznie był fundamentalną częścią europejskiego rolnictwa aż do XIX wieku.\n\n**Gospodarka trójpolowa** (= system trójpolny, zob. [[trojhonny-system]]):\n- 1. pole: oziminy (żyto, pszenica)\n- 2. pole: jare (owies, jęczmień)\n- 3. pole: **ugór** (odłóg, wypas lub orka)\n\nTrzecia część pól leżała odłogiem każdego roku. Bez nawozów mineralnych był to jedyny sposób utrzymania żyzności. Gospodarz na ugorze zazwyczaj:\n- zostawiał **wypas bydła** — które nawozić pole świeżym obornikiem\n- **przerywał** (orka ziemniaczana) → niszczył chwasty\n- **zielony podsiew** lucerną lub koniczyną (od XVIII wieku) — wiązał azot\n\n**Koniec ugoru:** Nawozy mineralne (Liebig lata 40. XIX w., synteza amoniaku Haber-Bosch 1909) wyeliminowały konieczność ugoru. Norfolski system 4-polny (lucerna-pszenica-burak-jęczmień) bez ugoru dramatycznie zwiększył produktywność — angielska rewolucja rolnicza.\n\n**Współczesne typy ugoru:**\n- **Zielony ugór** (ekoschema, EFA — Ecological Focus Area) — obowiązkowy w ramach WPR od 2015. Roślina ochronna, pas kwiatowy lub po prostu nieobsiane odłogiem z dozwolonym koszeniem.\n- **Czarny ugór** — orany, nieobsiany. Dziś raczej ekologicznie problematyczny (erozja).\n- **Aktywny ugór** — pasy roślin nektarodajnych dla zapylaczy, biopasy, biostep (zob. [[biopasy]]).\n- **Grunty odłożone** — pola wyjęte z uprawy na 1–2 lata w celu regulacji rynku.\n\nW ČR dziś:\n- Z dopłaty BISS można w ramach **5 % powierzchni gospodarstwa** zadeklarować ugór (EFA), zaliczany jako „wkład klimatyczny\".\n- Powierzchnia ugoru w ČR 2024: ~50 000 ha (1,2 % gruntów ornych).\n\nEtymologia: prasłowiańskie *ǫgorъ* (= pole pozostawione odłogiem). Słowa pokrewne: **odłóg** (ugór po kilku latach), **rewir** (rewir na ugorze), **pole** (kontrast: pole = uprawiane, ugór = nie).\n\nZob. też [[trojhonny-system]], [[osevni-postup]], [[mezi-plodiny]], [[biopasy]], [[regenerativni-zemedelstvi]].",
    "alias": [
      "ugorowanie",
      "odłóg",
      "ugór pasywny"
    ],
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
    "term": "System trójpolny",
    "kategorie": "historie",
    "shortDef": "System trójpolny to średniowieczny płodozmian dzielący grunty orne na trzy pola — oziminy, jare i ugór. Co roku pola się zmieniały. Dominował w Europie od IX do XIX wieku.",
    "longDef": "System trójpolny (też trójpolówka, niem. *Dreifelderwirtschaft*) to średniowieczny i wczesnonowożytny **płodozmian**, który zastąpił starszy system dwupolny (oziminy/ugór). Powstał w epoce karolińskiej (IX wiek) i przez niemal 1 000 lat dominował w Europie.\n\n**Zasada:**\nGrunty orne wsi podzielone były na **trzy pola** (= duże pole złożone z wielu wąskich zagonów poszczególnych chłopów). Co roku obsiewano:\n- **1. pole (oziminy)**: pszenica lub żyto, siane jesienią\n- **2. pole (jare)**: owies lub jęczmień, siane wiosną\n- **3. pole (ugór)**: odłóg, pasywnie, wypas bydła na nawóz\n\nW następnym roku wszystko przesuwało się o jedno — oziminy → ugór → jare → oziminy itd. Cykl 3-letni.\n\n**Zalety (vs dwupolny):**\n- 2/3 pól aktywnie uprawianych (vs 1/2 w dwupolnym)\n- Wyższa produktywność, lepsze wyżywienie ludności\n- Dwa zbiory rocznie (oziminy w lipcu, jare we wrześniu)\n- Lepszy rozkład pracy przez rok\n\n**Wady (z dzisiejszego punktu widzenia):**\n- 1/3 pól nadal leżała odłogiem\n- Niskie plony (1,5–2 t/ha pszenicy — dziś 8 t/ha)\n- Brak roślin okopowych (ziemniaki, burak) — te pojawiły się dopiero w XVIII wieku\n- Sztywność społeczna: każdy chłop miał zagony we wszystkich trzech polach, wieś musiała wspólnie decydować co i kiedy siać\n\n**Koniec systemu (przejście 1750–1900):**\n- **Norfolski system 4-polny** (UK, lata 30. XVIII w.): lucerna-pszenica-burak-jęczmień — bez ugoru, wyższe plony.\n- **Maria Teresa i Józef II** (ČR 1750–1790): patenty znosiły przymusową trójpolówkę, zezwalały chłopom na samodzielne decyzje.\n- **Liebig + nawozy mineralne** (1840+): umożliwiły ciągłą uprawę.\n- **XIX wiek**: scalanie gruntów (komasacja), indywidualne gospodarstwa, nowoczesny płodozmian.\n\nW ČR system trójpolny zanikał stopniowo 1780–1850, w niektórych regionach górskich (Szumawa, Karkonosze) jeszcze na początku XX wieku.\n\n**Ślady w krajobrazie:**\n- **Liniowe drogi** między polami w rozłogu (parcelacji zagonowej)\n- **Kamienie graniczne** (zob. [[mez]]) wyznaczające granice\n- **Nazwy miejscowe**: „Wielkie pole\", „Górne pole\", „Dolne pole\"\n- **Trójstrukturalne winnice** na południowych Morawach (winiarskie odmiany)\n\nZob. też [[uhor]], [[osevni-postup]] (nowoczesny), [[mez]], [[lan]].",
    "alias": [
      "gospodarka trójpolna",
      "trójpolówka",
      "system trójpólowy"
    ],
    "related": [
      "uhor",
      "osevni-postup",
      "mez",
      "lan"
    ]
  },
  {
    "slug": "mez",
    "term": "Miedza",
    "kategorie": "historie",
    "shortDef": "Miedza to wąski trawiasty lub zakrzewiony pas oddzielający sąsiednie pola. Historycznie wyznaczała granicę między właścicielami, dziś ceniona za bioróżnorodność, ochronę przed erozją i w ramach ekoschematu WPR.",
    "longDef": "Miedza (od staroczeskiego *meža* = granica) to **wąski trawiasty lub zakrzewiony pas** między dwoma polami. Historycznie była praktycznym rozgraniczeniem między właścicielami gruntów (granica rozłogu) oraz ochroną przed spływem gleby.\n\n**Historyczne funkcje:**\n- **Pas graniczny** — wyraźnie oddzielał własność. Często z **kamieniami granicznymi** (kamienie, słupy) na narożnikach.\n- **Element krajobrazowy** — siedlisko dzikiej zwierzyny, ptaków, owadów. Nie była intensywnie uprawiana.\n- **Droga dla wozów** — szersze miedze służyły jako polne drogi.\n- **Pastwisko dla drobnego inwentarza** — kozy, owce pasły się „na miedzach\", gdy pole było obsiane.\n\n**Likwidacja miedz 1948–1989** (kolektywizacja):\nPGR-y i państwowe gospodarstwa **scalały pola w olbrzymie bloki** (często 50–200 ha) pod duże maszyny (T-150, Š-180, Fortschritt). Tysiące kilometrów miedz w ČR zostało zlikwidowanych. Skutki:\n- Przyspieszenie **erozji wodnej** (brak zielonych pasów zatrzymujących spływ)\n- Spadek **bioróżnorodności** (zanik siedlisk owadów, ptaków, drobnej zwierzyny)\n- Powstanie wielkich jednorodnych „prerii\"\n- Zmiany mikroklimatu (suchszy krajobraz, odsłonięty na wiatr)\n\n**Powrót miedz 1990–dziś:**\n- **Ekoschema WPR / EFA**: miedze, biopasy, pasy kwiatowe zaliczają się jako Ecological Focus Area (3–5 % powierzchni).\n- **Poddziałanie AEKO**: dopłata za utrzymanie miedz (50–80 Kč/m długości/rok).\n- **Kontrola erozji** na obszarach zagrożonych erozją (DPB) — GAEC 2 wymaga środków przeciwerozyjnych, miedze są jednym z narzędzi.\n- **Elementy krajobrazowe** — miedze chronione prawem (Ustawa nr 114/1992 Dz.U.).\n\n**Szerokość miedz dziś:**\n- **Klasyczna miedza** szerokości 1–3 m między polami\n- **Szeroka miedza** 5–10 m, często z krzewami (tarnina, dzika róża, głóg) — dla gospodarki wodnej\n- **Liniowa remiza** 10+ m — funkcjonuje jako biotop\n- **Korytarz ekologiczny** 20+ m — łączy większe biotopy\n\n**Nazwy miejscowe z „miedza\"** są w ČR wszechobecne: „Na Miedzach\", „Wielka miedza\", „Droga miedzowaa\", „Przy kamieniu granicznym\", miejscowości „Miedzica\", „Miedzyrzec\".\n\nZob. też [[biopasy]], [[eroze-pudy]], [[trojhonny-system]], [[gaec]], [[lan]].",
    "alias": [
      "pas miedzowy",
      "kamień graniczny",
      "remiza"
    ],
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
    "term": "Pańszczyzna",
    "kategorie": "historie",
    "shortDef": "Pańszczyzna była obowiązkową nieodpłatną pracą poddanych chłopów na gruntach pana — główna forma renty feudalnej w Czechach od XI do XIX wieku. Zniesiona w 1848 roku (formalnie) i 1849 roku (definitywnie).",
    "longDef": "Pańszczyzna (od słowa *robić* = pracować, służyć) była **obowiązkową nieodpłatną pracą** poddanych chłopów na gruntach szlachty, klasztorów i króla. Na ziemiach czeskich była główną formą renty feudalnej od XI do XIX wieku.\n\n**Rodzaje pańszczyzny:**\n- **Pańszczyzna sprzężajowa** — praca z parą koni lub wołów (orka, nawożenie, żniwa, zwózka). Dla „łanników\" z całym łanem.\n- **Pańszczyzna piesza** — praca ręczna (kopanie, pielenie, koszenie, grabienie). Dla zagrodników i chałupników.\n- **Pańszczyzna kobieca** — przędzenie, tkanie, żniwa, zbiór owoców.\n- **Pańszczyzna nadzwyczajna** — budowy (młyny, dwory), polowania dla pana.\n\n**Zakres:**\nObowiązki pańszczyźniane zależały od wielkości gruntu (zob. [[grunt]], [[lan]]):\n- **Łannik (cały łan, 17+ ha)**: 3 dni pańszczyzny sprzężajowej tygodniowo + sezónowe szczyty (żniwa, winobranie)\n- **Półłannik**: 2 dni sprzężajowej + 1 dzień pieszej\n- **Zagrodnik**: 1–2 dni pieszej tygodniowo\n- **Chałupnik (bez ziemi)**: tylko sezonowo\n\nPlus **daniny naturalne** (dziesięcina, jaja, kury) i podatki pieniężne.\n\n**Kluczowe kamienie milowe regulacji:**\n- **1680 — Patent Teresiański o pańszczyźnie**: maks. 3 dni sprzężajowej / 3 dni pieszej tygodniowo.\n- **1738 — Patent robotny Karola VI.**: dalej sprecyzowano, ale poddany nadal nie mógł odejść.\n- **1775 — Patent robotny Marii Teresy**: oficjalne tabele wg wielkości gruntu, przymusowe komisje pojednawcze przy sporach.\n- **1781 — Patent o zniesieniu poddaństwa Józefa II.**: poddany mógł opuścić majátek, żenić się do woli, oddać dzieci do rzemiosła. **Pańszczyzna jednak pozostała!**\n- **1848 — Październik 1848**: Hans Kudlich (chłop i poseł Sejmu Rzeszy) inicjuje **zniesienie pańszczyzny bez odszkodowania**. Uchwalone 7 września 1848.\n- **1849 — Definitywna likwidacja**: szlachta otrzymała odszkodowanie (od państwa, nie od chłopów). Chłop stał się **wolnym właścicielem gruntu**.\n\n**Skutki zniesienia:**\n- Powstanie wolnego rynku gruntów\n- **Komasacja** (scalanie) pól 1850–1920\n- Młodzi chłopi mogli budować gospodarkę bez zobowiązań\n- Powstanie nowoczesnego rolnictwa nastawionego na zysk\n- Rewolucja społeczna na wsi — emigracja „nadwyżkowych\" chłopów do USA, Wiednia, do miast\n\nW kulturze: **„Babcia\"** B. Němcovej (1855) przedstawia późną epokę pańszczyźnianą. **„Dom robotny\"** był historycznym budynkiem dla najemnych pracowników w folwarku po zniesieniu poddaństwa.\n\nEtymologia: od staroczeskiego *robota* (ciężka praca, niewolnictwo). Karel Čapek w R.U.R. (1920) użył słowa **robot** we współczesnym sensie, czyniąc je światowym.\n\nZob. też [[grunt]], [[lan]], [[trojhonny-system]], [[mez]], [[uhor]].",
    "alias": [
      "pańszczyzna poddańcza",
      "pańszczyzna pańska",
      "pańszczyzna sprzężajowa"
    ],
    "related": [
      "grunt",
      "lan",
      "trojhonny-system",
      "mez"
    ]
  },
  {
    "slug": "grunt",
    "term": "Grunt chłopski",
    "kategorie": "historie",
    "shortDef": "Grunt to historyczne określenie gospodarstwa chłopskiego — siedlisko z domem, zabudowaniami gospodarczymi, ogrodem i polami. „Grunt chłopski\" był podstawową jednostką społeczności wiejskiej aż do połowy XX wieku.",
    "longDef": "Grunt (z niemieckiego *Grund* = podstawa, ziemia) to historyczne określenie **gospodarstwa chłopskiego** — siedliska ze wszystkim co doń należy: dom, obory, stodoła, spichlerz, ogród, sad i pola w rozłogu wsi. „Chłop na gruncie\" był podstawową warstwą społeczną ludności wiejskiej.\n\n**Wielkość gruntów:**\n- **Cały łan (łannik)**: 17–20 ha pól — najwyższa kategoria, „grunt chłopski\"\n- **Półłan (półłannik)**: 8–10 ha — średni chłop\n- **Ćwierćłan (ćwierćłannik, zagrodnik z polem)**: 4–5 ha\n- **Chałupa bez ziemi**: tylko dom i mały ogród — chałupnicy, rzemieślnicy\n- **Wielki grunt (gospodarz, grunt dworski)**: 30+ ha, często z własnymi parobkami\n\n**Architektura gruntu:**\n- **Dom** z jedną dużą „izbą\" (izba mieszkalna z piecem), kuchnią i komorą\n- **Obora** (stajnie) dla krów, koni, świń — typowo w tylnej części podwórza\n- **Stodoła** dla słomy, siana, składowanego ziarna przed omłotem\n- **Spichlerz** — przechowywanie zboża do siewu + materiału siewnego na zimę\n- **Studnia** na środku podwórza\n- **Gnojownik** za oborą\n- **Sad / ogród** za domem (jabłonie, grusze, śliwy)\n\n**Księgi gruntowe:**\nOd XVI wieku **każda wieś miała księgę gruntową** prowadzoną przez pana (późnej przez państwo) — zapis **kto na którym gruncie gospodarzy**, sprzedaże, przekazy dziedziczne, posagi. Kluczowe źródło dla genealogii i historii wsi.\n\n**Kluczowe prawo gruntowe:**\n- **Niepodzielność gruntu** — cały grunt przejmował **jeden syn** (typowo najstarszy, ale nie zawsze). Pozostali szli do rzemiosła, do miasta lub otrzymywali wsparcie pieniężne.\n- **Wyminak** — odchodzący gospodarz (starzejący się ojciec) zastrzegał sobie na gruncie mieszkanie i wyżywienie do końca życia. Umowa solidnie zakotwiczona.\n- **Domek wyminkarski** = mały budynek dla wyminkanta (często część gruntu).\n\n**Koniec gruntów 1948–1960:**\n- **Wywłaszczenie**: kolektywizacja zlikwidowała prywatne gospodarowanie, grunt stał się częścią PGR/Państwowego Gospodartwa Rolnego.\n- **Kulaczenie**: największe grunty chłopskie (kułacy) zlikwidowane, rodziny prześladowane.\n- **Rozbiórki**: wiele gruntów zburzono pod budowę obór, silosów i domów dla pracowników PGR.\n\n**Restytucja 1991–dziś:**\n- Zwrot gruntów i budynków pierwotnym właścicielom lub spadkobiercom.\n- Wiele gruntów odbudowanych jako **rodzinne gospodarstwa** (często 5. pokolenie na tym samym gruncie).\n- Niektóre duże grunty funkcjonują jako **agroturystyka** lub „dziedzictwo\" dla miejskich potomków.\n\n**Ślady w nazwach**: „Na gruncie\", „Stary grunt\", „Droga gruntowa\" to typowe nazwy w ČR. **Nazwiska Grunt, Grunta, Gruntorád** nawiązują do chłopskiego pochodzenia.\n\nZob. też [[lan]], [[robota]], [[trojhonny-system]], [[mez]], [[jitro]], [[korec]].",
    "alias": [
      "chłopski grunt",
      "zapis gruntowy",
      "księga gruntowa"
    ],
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
    "term": "Kierat",
    "kategorie": "historie",
    "shortDef": "Kierat to historyczna maszyna napędzana siłą zwierząt pociągowych (koni, wołów) — okrągłe urządzenie, w którym zwierzę chodzi po obwodzie i obraca wałem napędowym podłączonym do młocarni, śrutownika lub prasy. Poprzednik napędu parowego i elektrycznego.",
    "longDef": "Kierat (niem. *Göpel*, od łac. *gyrum* = krąg) to **historyczna maszyna napędzana siłą pociągową zwierząt** — koni, wołów, osłów. Zasada: zwierzę kroczy po okrężnej ścieżce (średnica 6–10 m) i obraca pionowym lub poziomym wałem, który napędza docelową maszynę.\n\n**Konstrukcja:**\n- **Centralny pionowy wał** z ramieniem (dyszlem), za który zwierzę ciągnie\n- **Przekładnia** (często z kołami zębatymi) — przetwarza wolne obroty zwierzęcia (3–8 obr./min) na szybsze dla maszyny roboczej\n- **Zadaszenie lub dach** — chroni zwierzę przed deszczem\n- **Uprząż i kierownice** — niekiedy z automatyczną regulacją prędkości\n\n**Zastosowanie:**\n- **Młocarnia zbóż** (najczęstsze) — cep stopniowo zastępowany mechaniczną młocarnią napędzaną kieratem\n- **Śrutownik** — kruszy zboże i ziemniaki na paszę\n- **Prasa** — do słomy w baloty, owoców na moszcz\n- **Wywrotnik** — siana, obornika\n- **Pompa** — woda ze studni do zbiornika\n- **Kuźnia** — napęd miecha w kuźni\n- **Cukrownie XIX w.** — kruszy buraki cukrowe\n\n**Dwa główne warianty:**\n1. **Kierat pionowy** (najstarszy) — zwierzę chodzi wokół osi pionowej, młocarnia stoi w centrum. Wymaga dużej powierzchni.\n2. **Kierat poziomy** (od XVIII w.) — bardziej kompaktowy, wał prowadzi z kieratu do maszyny w sąsiednim pomieszczeniu. Umożliwił **budowę stodoły kieratowej** z dwoma pomieszczeniami.\n\n**Moc:**\n- 1 koń generuje ~0,5–1 KM (740 W) w kieracie\n- Para koni = ~1,5 KM = wystarczy dla małej młocarni (100 kg zboża/h)\n- 4 woły = ~2 KM — dla większej młocarni lub prasy\n\n**Historia:**\n- **Średniowiecze**: tylko dla młynów wodnych i kuźni (koła wodne, nie kieraty).\n- **XVI–XVIII w.**: upowszechnienie kieratów z młocarniami w Anglii, Niemczech.\n- **1740–1850 w ČR**: każdy większy grunt miał stodołę kieratową.\n- **1850–1900**: maszyna parowa (lokomobila — zob. [[parni-stroj]]) stopniowo zastępowała kierat. Młocarnia parowa była wielokrotnie wydajniejsza.\n- **1900–1950**: silnik elektryczny (po elektryfikacji wsi 1920–1950) zastąpił definitywnie nawet parę.\n- **Dziś**: kieraty to muzealny relikt (Muzeum Krajoznawcze Szumperk, Wesoła Górka, skanseny).\n\n**Ślady w krajobrazie:**\n- **Stodoły kieratowe** — okrągły lub wielokątny rzut z ukośnym dachem, zachowane w niektórych wsiach (zwł. północne Morawy, Wysoczyzna).\n- **Nazwy miejscowe**: „Przy kieracie\", „Droga kieratowa\".\n- **Słowo „kierat\"** przetrwało w gwarze jako synonim „ciężkiej monotonnej roboty\" (harówa jak kierat = ciężka, rutynowa praca).\n\nZob. też [[grunt]], [[robota]], [[mlat]], [[zne]].",
    "alias": [
      "kierat chodzikowy",
      "napęd kieratowy"
    ],
    "related": [
      "grunt",
      "robota",
      "mlat",
      "zne"
    ]
  },
  {
    "slug": "mlat",
    "term": "Klepisko",
    "kategorie": "historie",
    "shortDef": "Klepisko to duża powierzchnia (pierwotnie ubita glina) w stodole, gdzie cepami lub kieratową młocarnią omłacano zboże. Centrum zimowych prac gospodarskich aż do XIX wieku, gdy zastąpiła je przenośna młocarnia.",
    "longDef": "Klepisko (od *młócić*) to **pozioma utwardzona powierzchnia** wewnątrz stodoły, na której zimą **omłacano zboże** — oddzielano ziarna od słomy i kłosków. Kluczowe miejsce zimowej pracy chłopa.\n\n**Konstrukcja klepiska:**\n- **Podłoga**: twarda ubita glina zmieszana z wapnem lub krwią wołu (dla twardości), niekiedy bruk lub deski\n- **Wielkość**: typowo 4 × 6 m do 6 × 10 m\n- **Umiejscowienie w stodole**: pośrodku między dwoma „zaworami\" — przestrzeniami, gdzie składowano nieomłócone snopki\n- **Wejścia**: dwoje naprzeciwległych wrót (od południa i północy), aby można było wypełnić „zawory\" z obu stron i aby działał **przeciąg** do unoszenia plew (wiejenie ziarna)\n\n**Omłot cepem (do ~1850):**\n- **Cep** (zob. [[cep]]) — drewniane narzędzie z bijącą częścią (dzierżak + bijak połączone rzemykiem)\n- **Rytm**: 4–8 omłacaczy w rzędzie biło rytmicznie („czwórka\", „szóstka\") — do dziś przetrwał w muzyce ludowej (rytm „omłacaczy\")\n- **Wydajność**: 1 omłacacz osiągał ~50–80 kg ziarna dziennie\n- **Skład sezonu**: omłacano od listopada do marca — całe 4–5 miesięcy zimowej pracy\n\n**Omłot kieratową młocarnią (1850–1900):**\n- **Mechaniczna młocarnia** napędzana kieratem (zob. [[zentour]]) w sąsiednim pomieszczeniu\n- **Wydajność**: 200–500 kg zboża na godzinę (5–10× szybciej niż cep)\n- **Pomocnicy**: 2–3 mężczyzn podawało snopki, 1–2 odbierało słomę, 1 odbierał ziarno\n\n**Omłot lokomobilą parową (1880–1950):**\n- **Wędrująca młocarnia** — maszyna parowa na wózku jeździła od wsi do wsi, „młóciła\" 1–2 dni u każdego chłopa\n- **Wydajność**: 1 000–2 000 kg/h\n- **Koniec klepiska jako miejsca pracy** — praca przeniosła się na dziedziniec\n\n**Omłot kombajnem (1950+):**\n- **Kombajn** (zob. [[kombajn-trida]]) przeprowadza omłot **bezpośrednio na polu**\n- Klepisko straciło funkcję, **stodoły przebudowano** na garaże dla maszyn, magazyny nawozów lub rozebrano.\n\n**Dziś:**\n- Niektóre stare stodoły z klepiskiem zachowane w skansenach (Wesoła Górka, Strážnice, Přerov nad Labem).\n- **„Święto omłotów\"** = ludowe świętowanie końca omłotów (przed 1900), z tańcami na klepisku.\n- Słowo **młocarnia** przetrwało jako termin techniczny (= młocarnia zbóż w kombajnie, zob. [[rotor-kombajn]]).\n\n**Nazwy miejscowe:** „Przy klepisku\", „Mlatownia\", „Stara młocarnia\" powszechne w ČR.\n\n**„Humno\"** (słowackie, wołoskie) = synonim klepiska, niekiedy szerzej (= cała stodoła).\n\nEtymologia: prasłowiańskie *mlatъ* (= uderzenie, omłot). Słowa pokrewne: **młócić** (= młócić cepem), **młocarnia** (= maszyna), **omłacacz** (= mężczyzna młócący cepem).\n\nZob. też [[zentour]], [[grunt]], [[zne]], [[cep]], [[rotor-kombajn]].",
    "alias": [
      "młocarnia",
      "mlatownia",
      "humno"
    ],
    "related": [
      "zentour",
      "grunt",
      "zne",
      "rotor-kombajn"
    ]
  },
  {
    "slug": "zne",
    "term": "Żniwa",
    "kategorie": "historie",
    "shortDef": "Żniwa to tradycyjne określenie zbioru zbóż — szczytowy okres letniego roku rolniczego (lipiec–sierpień). Historycznie koszono sierpem lub kosą, dziś kombajnem. W kulturze symbol „roku w znaku słońca i chleba\".",
    "longDef": "Żniwa (od czasownika *żąć* — kosić zboże) to **szczytowy okres zbioru zbóż** w letnim cyklu rolniczym. W ČR typowo koniec lipca – połowa sierpnia (oziminy pierwsze, jare później). Historycznie była to **najintensywniejsza praca roku** z własną liturgią, pieśniami i obrzędami.\n\n**Tradycyjne żniwa (do ~1900):**\n- **Narzędzia**: **sierp** (jednoręczny, do XVII w. główny), **kosa** (od XVII w. — wyższa wydajność)\n- **Tempo**: 1 kosiarz dziennie ~ 0,3–0,5 ha zboża\n- **Organizacja**: rodzina + najemni pomocnicy („żeńcy\", „żniwiarki\")\n- **Brygada żniwna** (= 4–8 osób): jeden kosiarz → odbieraczka (żnie) za nim → snopiarze (wiązacze snopów — zob. [[snop-otep]]) → układacze w stogi\n- **Po zbiorze**: snopki stoją w polnych **stogach** (dziesiątkach) do podsuszenia 1–2 tygodnie, potem wożone do **stodół** na **klepisko** (zob. [[mlat]]) do zimowego omłotu\n\n**Kamienie milowe mechanizacji:**\n- **1850 — Żniwiarka (reaper)** Cyrusa McCormicka (USA) — ciągnie para koni, jeden kierowca. Reaper kładł zboże na ziemi, żeńcy wiązali snopki ręcznie.\n- **1880 — Żniwiarka-wiązałka (binder)** — wiązała snopki automatycznie.\n- **1930 — Kombajn** w USA (połączenie żniwiarki + młocarni). Zbiera + omłaca + oczyszcza w jednej operacji.\n- **1950 — Kombajn w ČSR** (Mountfield, Sodóma, potem Slavia, Kombajny Polska Bizon).\n- **1990+ — Duże zachodnie kombajny** (Claas Lexion, John Deere seria S, New Holland CR).\n\nDziś:\n- **Zbiór pszenicy**: 1 nowoczesny kombajn (Claas Lexion 8900) osiąga **5–10 ha/h** = cała farma 500 ha za **2–3 dni**.\n- **Kosiarz z kosą**: 0,3 ha/dzień × 500 ha = **3 lata ludzkiej pracy** — odpowiednik jednego nowoczesnego kombajnu.\n\n**Wymiar kulturowy:**\n- **Pieśni żniwne** (zachowane przez tradycję ludową, np. „Pole, pole, szerokie pole\")\n- **„Biesiada po żniwach\"** = świętowanie końca zbiorów, obfita strawa, taniec\n- **„Dożynki\"** = uroczysta procesja z ostatnim snopem ozdobionym kwiatami do gospodarza, pana lub dziś na świętach wsi\n- **„Obrzęd zbiorów\"** w niektórych regionach (przywoływanie urodzaju) — synkretyzm obrzędów pogańskich i chrześcijańskich\n- **Klasyczna literatura czeska**: Babička, Naši, Karel Klostermann — żniwa jako centralny motyw roku wiejskiego\n\n**Klimatyczne ryzyko żniw:**\n- **Burze** — silny deszcz „wylegnie\" zboże (kładzie łodygi na ziemię), plon spada o 20–40 %\n- **Grad** — niszczy plon w ciągu minut\n- **Długotrwała mokra pogoda** — zboże kiełkuje w kłosie, utrata jakości spożywczej\n- **Susza** — obniża plon i masę hektolitrową (zob. [[hektolitr]])\n\n**Zbiory 2024 w ČR** (orientacyjnie):\n- Pszenica ozima: 1,4 mln ha × 6,2 t/ha = **8,7 mln t**\n- Jęczmień: 320 tys. ha × 5,8 t/ha = **1,85 mln t**\n- Rzepak: 380 tys. ha × 3,2 t/ha = **1,2 mln t**\n- Kombajny w eksploatacji: ~3 500 szt. (przeważają Claas + JD)\n\n**„Odrośliny\"** = drugi pokos trawy/siana jesienią (NIE zbóż — te idą tylko raz).\n\nZob. też [[mlat]], [[snop-otep]], [[kombajn-trida]], [[rotor-kombajn]], [[grunt]].",
    "alias": [
      "żęty",
      "zbiór zbóż",
      "koszenie"
    ],
    "related": [
      "mlat",
      "kombajn-trida",
      "rotor-kombajn",
      "grunt"
    ]
  },
  {
    "slug": "regenerativni-zemedelstvi",
    "term": "Rolnictwo regeneratywne",
    "kategorie": "precise-farming",
    "shortDef": "Rolnictwo regeneratywne to system uprawy ukierunkowany na odbudowę zdrowia gleby, zwiększanie materii organicznej, bioróżnorodności i sekwestrację węgla. Kluczowe praktyki: no-till, rośliny okrywowe, integracja bydła, ograniczenie agrochemii.",
    "longDef": "Rolnictwo regeneratywne (ang. *regenerative agriculture*, „regen ag\") to system produkcji, który **aktywnie odbudowuje** zdrowie gleby, bioróżnorodność i usługi ekosystemowe. Nie jest to schemat certyfikacyjny jak rolnictwo ekologiczne, lecz **podejście oparte na zasadach** z mierzalnymi wynikami.\n\n**5 zasad rolnictwa regeneratywnego** (wg Gabe'a Browna, USA):\n1. **Minimalizacja zaburzeń gleby** — żadnej orki, żadnej głębokiej uprawy. Gleba pozostaje ustrukturyzowana, mikroorganizmy nieprzerwane. Zob. [[no-till]], [[strip-till]].\n2. **Stały okryw gleby** — rośliny okrywowe (cover crops), mulcz, słoma. Gleba nigdy naga. Ogranicza erozję, utrzymuje wilgoć, karmi mikrobiom.\n3. **Różnorodność roślin** — minimum 4–5 roślin w rotacji, idealnie wieloletnie mieszanki (międzyplony, zob. [[mezi-plodiny]]). Żadnej monokultury.\n4. **Żywe korzenie przez cały rok** — zawsze coś rośnie. Rośliny okrywowe między głównymi roślinami zapewniają, że korzenie stale karmią mikrobiom.\n5. **Integracja bydła** — wypas lub „mob grazing\" (wysoka intensywność, krótki czas) na polach po zbiorach. Obornik + hałasujące kopyta + ślina odnawiają glebę.\n\n**Główne różnice vs rolnictwo konwencjonalne:**\n\n| Aspekt | Konwencjonalne | Regeneratywne |\n|--------|---------------|---------------|\n| Gleba | Surowiec (podłoże) | Żywy organizm |\n| Uprawa | Orka, podorywka | No-till, strip-till |\n| Okryw | Goła gleba 3–6 mies./rok | Stały okryw |\n| Roślin w rotacji | 2–4 | 5+ |\n| Nawozy mineralne | 150–200 kg N/ha | 50–100 kg N/ha (z pokryciem przez rośliny strączkowe) |\n| Opryski | Regularnie | Celowane, zredukowane |\n| Bydło | Oddzielone od pól | Zintegrowane |\n\n**Mierzalne wyniki (po 5–10 latach):**\n- **Materia organiczna w glebie**: +1–2 % (z 2 % do 3–4 %). Każdy 1 % SOM = +20 t C/ha sekwestracji.\n- **Infiltracja wody**: 2–10× lepsza (mniej spływu powierzchniowego)\n- **Koszty**: -20 do -40 % (mniej paliwa, nawozów, środków ochrony roślin)\n- **Plony**: Pierwsze 2–3 lata spadek 10–20 %, potem porównywalne z konwencjonalnym (niekiedy +10–20 %)\n- **Marża**: wyższa dzięki niższym kosztom + ceny premium (carbon credits, certyfikacja regen, kontrakty Whole Foods/Patagonia)\n\n**Sławne nazwiska regen:**\n- **Gabe Brown** (USA, ND) — książka „Dirt to Soil\", farma 2 500 ha bez nawozów przez 20+ lat\n- **Allan Savory** (Zimbabwe) — „Holistic Management\" dla wypasu\n- **Joel Salatin** (USA, VA) — Polyface Farm, wielogatunkowe zintegrowane pastwiska\n- **Charles Massy** (Australia) — „Call of the Reed Warbler\", regeneracja australijskich pastwisk\n\n**W ČR:**\n- **Południowoczeska farma „Kuneš\"** (Kestřany) — modelowa farma regen\n- **AgroProgress** — konsultacje przy przejściu\n- **Grupa REGAGRI** — stowarzyszenie rolników regeneratywnych\n- **Carbon credits**: programy pilotażowe od 2023 (Indigo, Climate Farmers, Soil Capital)\n\n**Ryzyko:**\n- **Okres przejścia 3–5 lat** — plony spadną, dopóki nie odbuduje się mikrobiom glebowy\n- **Wymaga głębokiej wiedzy** agronomicznej i ekologicznej — więcej niż stosowanie gotowych recept\n- **Własność gruntu**: dzierżawiona ziemia stawia w gorszej sytuacji (trzeba długoterminowo inwestować w coś, co można opuścić)\n\nZob. też [[no-till]], [[ctf]], [[mezi-plodiny]], [[organicka-hmota]], [[karbonove-zemedelstvi]], [[biouhel]], [[mykorhiza]].",
    "alias": [
      "regen ag",
      "regenerative agriculture"
    ],
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
    "term": "Rolnictwo węglowe",
    "kategorie": "precise-farming",
    "shortDef": "Rolnictwo węglowe to zestaw praktyk sekwestrujących CO₂ z atmosfery do gleby i biomasy. Rolnik może z certyfikowanego węgla generować „carbon credits\" sprzedawane korporacjom na poczet realizacji zobowiązań klimatycznych.",
    "longDef": "Rolnictwo węglowe (carbon farming) to system **praktyk rolniczych aktywnie zwiększających zasoby węgla w glebie i roślinności** w celu łagodzenia zmian klimatu. Rolnik staje się „carbon farmerem\" — obok zwykłych plonów produkuje też **sekwestrowany węgiel**, który można sprzedać jako **carbon credit**.\n\n**Kluczowe praktyki (sekwestracja C):**\n- **No-till / strip-till** — bez orki = mniej utleniania materii organicznej = więcej C w glebie. Zob. [[no-till]], [[strip-till]].\n- **Rośliny okrywowe** (cover crops) — korzenie + liście dodają C do gleby między głównymi roślinami.\n- **Przyorywanie słomy** (inkorporacja pozostałości) — nie palić słomy, mulczować.\n- **Nawozy organiczne** (obornik, kompost, biochar — zob. [[biouhel]]) zamiast mineralnych.\n- **Dywersyfikacja płodozmianu** — 5+ roślin w rotacji.\n- **Wapnowanie** (zob. [[vapneni]]) — alkalizuje pH, zmniejsza emisje N₂O.\n- **Agrolesnictwo** — aleje drzew, wiatrochrony, agroforestry. Drzewa akumulują duże ilości C.\n- **Konwersja TTP** (gruntory orne → łąki, zob. [[ttp]]) — łąki magazynują 2–4× więcej C niż grunty orne.\n\n**Czym jest 1 carbon credit?**\n1 carbon credit = **1 tona ekwiwalentu CO₂** sekwestrowana lub zredukowana. W ČR/UE handel odbywa się na rynkach dobrowolnych za:\n- **15–25 EUR/t CO₂** (2024) na rynkach dobrowolnych (Verra, Gold Standard)\n- **60–90 EUR/t CO₂** w EU ETS (rynek obowiązkowy, ale rolnictwo jeszcze tam nie działa)\n\n**Przykładowa ekonomika** (farma 500 ha przechodzi z orki na no-till + cover crops):\n- **Sekwestracja**: ~0,5 t C/ha/rok = ~1,8 t CO₂/ha/rok\n- **500 ha × 1,8 t × 20 EUR = 18 000 EUR/rok = ~450 tys. Kč**\n- Plus oszczędności na paliwie i nawozach: ~200 tys. Kč\n- Minus doradztwo i certyfikacja: ~80 tys. Kč\n- **Zysk netto**: 570 tys. Kč/rok dodatkowo\n\n**Schematy certyfikacji** (jak sprzedać credit):\n- **Verra VCS** (Verified Carbon Standard) — globalny, droga certyfikacja\n- **Gold Standard** — preferuje wpływ społeczny\n- **Indigo Ag** (USA) — platforma agtech, dominuje w USA\n- **Climate Farmers** (DE) — startup dla farm UE\n- **Soil Capital** (BE) — płatności za t CO₂\n- **eAgronom** (EE) — platforma software do zarządzania\n- **Certyfikacja AgroVoltaika** (SOIL3) — zorientowana na ČR\n\n**Problemy i krytyka:**\n- **Additionalność** — credit jest „ważny\" tylko jeśli farma NIE robiłaby sekwestracji bez niego. Sporne.\n- **Trwałość** — jeśli farma za 10 lat znów zaorze, węgiel wróci do atmosfery. Carbon credit powinien być „odwołany\".\n- **Weryfikacja** — pomiar zawartości C w glebie jest drogi, często niedokładny. Modele vs pomiary rzeczywiste.\n- **Przeciek** — jeśli farma A sekwestruje, ale farma B obok orze więcej, efekt netto = 0.\n- **Greenwashing** — niektóre firmy kupują credits, aby wyglądać na „neutralne klimatycznie\", nigdy nie redukując własnych emisji.\n\n**Polityka UE + ČR:**\n- **EU CRCF** (Carbon Removals Certification Framework) — rozporządzenie 2024 ustanawia zasady dla carbon credits z rolnictwa.\n- **Plan Strategiczny WPR 2023–2027** obejmuje **płatności węglowe** w ramach ekoreguminu i AEKO.\n- **MZe ČR** w 2026 planuje pilotażowe „dotacje węglowe\" dla farm w no-till.\n\n**Zalecana literatura:**\n- Lal, R. (2004) „Soil carbon sequestration impacts on global climate change and food security\"\n- Książka „Drawdown\" (P. Hawken, 2017) — 100 najlepszych rozwiązań zmian klimatu, wiele w rolnictwie\n\nZob. też [[regenerativni-zemedelstvi]], [[no-till]], [[organicka-hmota]], [[biouhel]], [[ttp]], [[vapneni]].",
    "alias": [
      "carbon farming",
      "climate-smart agriculture",
      "rolnictwo klimatyczne"
    ],
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
    "kategorie": "agrotechnika",
    "shortDef": "Strip-till to kompromis między orką a no-till — uprawia tylko 20–30 cm szeroki pas gleby w rzędzie (gdzie sieje się nasiona), między rzędami gleba pozostaje nienaruszona. Nadaje się do kukurydzy, słonecznika, rzepaku.",
    "longDef": "Strip-till (pasowa uprawa gleby, *strip tillage*) to **kompromis między konwencjonalną orką a no-till** (zob. [[no-till]]). Maszyna uprawia **jedynie wąski pas gleby bezpośrednio w wysiewanym rzędzie** (typowo 20–30 cm szerokości), podczas gdy przestrzeń między rzędami (typowo 75 cm rozstaw dla kukurydzy) pozostaje **nieruszona** z mulczem.\n\n**Zasada działania:**\nMaszyna ma dwie główne części na każdym rzędzie:\n1. **Tarcza talerzowa** — przecina resztki i uwalnia wierzchnią warstwę (do 2–5 cm)\n2. **Dłuto / radlica** — spulchnia pas do głębokości 15–25 cm\n3. **Opcjonalnie**: aplikacja nawozów do pasa (P, K, płynny N) w jednym przejeździe — „fertilizer applicator\"\n4. **Opcjonalnie**: jednoczesny siew (siewnik) — operacja *one-pass*\n\n**Dla jakich roślin:**\nStrip-till idealny dla **roślin rzędowych o dużym rozstawie**:\n- **Kukurydza** (rozstaw 75 cm) — główne zastosowanie\n- **Słonecznik** (rozstaw 70 cm)\n- **Burak cukrowy** (rozstaw 45–50 cm)\n- **Rzepak ozimy** (rozstaw 30–50 cm)\n- **Soja** (rozstaw 35–50 cm)\n\nDla pszenicy sianej wąskorozstawowo (rozstaw 12,5 cm) **strip-till nie ma sensu** — cała powierzchnia byłaby uprawiana, co odpowiada orce.\n\n**Zalety:**\n- **Ograniczenie erozji**: mulcz między rzędami zatrzymuje wodę (vs goła orka)\n- **Oszczędność paliwa**: -30–50 % vs orka\n- **Lepsza struktura gleby**: tylko 30 % powierzchni uprawianej, reszta zachowuje strukturę\n- **Ukierunkowane nawożenie**: nawóz precyzyjnie do rzędu, nie powierzchniowo → -20 % zużycie\n- **Późna jesień/wiosna odpowiednia**: większa elastyczność niż klasyczna orka (którą trzeba robić wcześnie jesienią)\n- **Sekwestracja węgla**: jako kompromis między orką (-) a no-till (+)\n\n**Wady:**\n- **Droga maszyna** — strip-till z aplikacją nawozów 1,5–3 mln Kč (vs zwykły pług 500 tys. Kč)\n- **Wymaga GPS RTK** (zob. [[gps-rtk]]) — rzędy muszą być precyzyjne do 2 cm. Bez RTK nie można wielokrotnie trafić w te same pasy.\n- **Zależy od rodzaju gleby**: na ciężkich gliniastych glebach problem z zagęszczonym międzypasem (potrzebna okazjonalna głęboka orka)\n- **Chwasty**: w mulczu między pasami kiełkują chwasty, potrzebny glifosat + selektywne herbicydy\n- **Nachylenie**: na stokach > 8 % ryzykowne (erozja w koleinie siewnika)\n\n**Maszyny:**\n- **Kuhn Striger** (FR) — premium, 1,5–2,5 mln Kč\n- **Vaderstad Cultus** (SE) — solidna, popularna w ČR\n- **Köckerling Vector** (DE) — kombinacja z aplikacją\n- **Horsch Focus TD** (DE) — strip-till + siewnik w jednym\n- **John Deere 2510H** (US) — popularna w USA, mniej w UE\n\n**W ČR**: do 2020 roku marginalna (< 1 % powierzchni), w 2024 już ~5–8 % powierzchni kukurydzy i rzepaku. Wzrost napędzany przez:\n- Płatności AEKO za ograniczoną uprawę gleby\n- Wysoka cena paliwa 2022+\n- GAEC 5 (środki przeciwerozyjne w strefach zagrożonych erozją)\n\nZob. też [[no-till]], [[orba]], [[regenerativni-zemedelstvi]], [[ctf]], [[gps-rtk]], [[eroze-pudy]].",
    "alias": [
      "pasowa uprawa gleby",
      "orka pasowa",
      "strip tillage"
    ],
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
    "term": "Biowęgiel (biochar)",
    "kategorie": "hnojivo",
    "shortDef": "Biowęgiel to porowaty węgiel uzyskiwany przez pirolizę biomasy (drewna, słomy, resztek roślinnych) bez dostępu tlenu. Dodawany do gleby w celu zwiększenia żyzności, wiązania składników pokarmowych i długoterminowej sekwestracji węgla (1000+ lat).",
    "longDef": "Biowęgiel (ang. *biochar*, gr. *bios* + *char* = życie + węgiel) to **materiał węglowy wytworzony przez pirolizę** (ogrzewanie bez dostępu tlenu) biomasy — zrębki drewna, słoma, łupiny, obornik, pestki owoców. Zawiera **75–90 % węgla** z pierwotnej biomasy, który w glebie jest **stabilny przez setki do tysięcy lat** — dlatego silny instrument sekwestracji CO₂.\n\n**Geneza i inspiracja — *Terra Preta*:**\nW Amazonii (Brazylia) odkryto **ciemno czarne żyzne gleby** *Terra Preta de Índio* zawierające do 80 t/ha biowęgla z dawnych palenisk indiańskich. **Wiek 500–2000 lat**, do dziś wielokrotnie żyźniejsze niż okoliczne czerwone latosoły. Inspiracja dla nowoczesnego biochar.\n\n**Piroliza — proces produkcji:**\n- **Temperatura**: 400–800 °C\n- **Bez dostępu tlenu**: aby biomasa nie utleniała się (nie paliła się na popiół)\n- **Czas**: 15 min – 8 h zależnie od technologii\n- **Produkty**:\n  - 30–40 % biowęgiel (stały)\n  - 30–50 % bioolej (ciekły — paliwo)\n  - 20–30 % gaz syntezowy (CO + H₂ + CH₄ — paliwo)\n- **Bilans energetyczny**: piroliza jest samowystarczalna — gaz syntezowy napędza proces\n\n**Surowce wejściowe:**\n- **Zrębki drzewne** (drewno z wycinki, gałęziówka) — najwyższa jakość biowęgla\n- **Słoma zbóż** (pszenica, kukurydza, rzepak) — średnia jakość, łatwo dostępna\n- **Łupiny i pestki** (owoce, orzechy) — wysoce porowate\n- **Obornik drobiowy / krowi** — bogaty w P, K\n- **Biomasa zielona** (trzcina, miskant) — dla plantacji biowęgla\n\n**Efekt na glebie:**\n1. **Porowatość** — 1 g biowęgla = 200–400 m² powierzchni (jak węgiel aktywny). Zatrzymuje wodę i składniki pokarmowe.\n2. **CEC** (Pojemność Wymienna Kationów) — biowęgiel wiąże kationy (Ca²⁺, Mg²⁺, K⁺, NH₄⁺), powoli je uwalniając roślinie. **+30–80 % CEC** w glebach piaszczystych.\n3. **pH** — biowęgiel jest lekko zasadowy (pH 8–10) → **stabilizuje gleby kwaśne**, alternatywa wapnowania.\n4. **Mikrobiom** — pory biowęgla to idealne „siedliska\" dla bakterii i grzybów glebowych. **+30–60 % biomasy mikroorganizmów**.\n5. **Woda** — 1 t biowęgla zatrzymuje **2–4 t wody** w glebie → ochrona przed suszą.\n6. **Sekwestracja C** — 1 t biowęgla = ~3 t ekwiwalentu CO₂, stabilna przez 500+ lat.\n\n**Aplikacja:**\n- **Dawka**: 1–10 t/ha (typowo 3–5 t/ha)\n- **Głębokość**: 10–30 cm przez orkę lub strip-till\n- **Aktywacja**: pokruszyć + namoczyć + wymieszać z kompostem 2–4 tygodnie przed aplikacją (aby nasączył się bogatymi składnikami, a nie jako głodny węgiel drzewny)\n- **Częstotliwość**: jednorazowa lub stopniowa (1 t/ha/rok)\n\n**Cena 2024:**\n- **Biowęgiel sypany w ČR**: 4 000–8 000 Kč/t\n- **Pelety (łatwiejsza aplikacja)**: 8 000–15 000 Kč/t\n- **Aktywowany z mikoryzą (premium)**: 15 000–25 000 Kč/t\n- **Inwestycja na 1 ha**: 12 000–40 000 Kč\n\n**Zwrot inwestycji:**\n- **Plony**: typowo +5–20 % po 1–3 latach\n- **Oszczędność nawozów**: -10–25 % dzięki CEC\n- **Carbon credits**: 15–25 EUR/t CO₂ × 3 t CO₂/t biowęgla = ~1 200 Kč/t biowęgla dodatkowo\n- **Zwrot**: 5–10 lat na biowęgiel samodzielnie, 3–5 lat z carbon credits\n\n**W ČR:**\n- **Sklizeň-Lanškroun** — największy producent, zdolność produkcyjna 5 000 t/rok\n- **Biochar.cz** — dystrybucja, doradztwo\n- **AGRIBO** — producent + konsultant carbon credit\n- **Projekty pilotażowe** na instytutach badawczych (Bohunice, Lanžhot)\n\n**Ograniczenia:**\n- **Wysoka cena wejściowa**, zwrot dopiero po latach\n- **Ryzyko aplikacji nieaktywowanego węgla** — „głodny\" biowęgiel **WYRAŹNIE obniża plon przez pierwsze 1–2 lata** (absorbuje własne składniki pokarmowe z gleby)\n- **Mierzalność efektu** — widoczna dopiero po 3+ latach, wcześniej trudno udowodnić\n- **Uwaga na zanieczyszczenia** — biowęgiel z odpadowej biomasy może zawierać metale ciężkie, dioksyny. Wymaga certyfikacji EBC (European Biochar Certificate).\n\nZob. też [[organicka-hmota]], [[regenerativni-zemedelstvi]], [[karbonove-zemedelstvi]], [[ph-pudy]], [[vapneni]], [[hnojivo]].",
    "alias": [
      "biochar",
      "agrouwęgiel",
      "pirowęgiel"
    ],
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
    "term": "Mykoryza",
    "kategorie": "agrotechnika",
    "shortDef": "Mykoryza to symbioza między korzeniami roślin a grzybami glebowymi. Grzyb zwiększa za pomocą swoich strzępek powierzchnię ssącą korzenia 10–100×, a roślina dostarcza grzybowi cukry. Kluczowy czynnik zdrowia gleby i plonu.",
    "longDef": "Mykoryza (gr. *mykes* + *rhiza* = grzyb + korzeń) to **wzajemnie korzystna symbioza między korzeniami roślin a podziemnymi grzybami**. Naukowo opisana w 1885 r. (Albert Bernhard Frank), lecz w praktyce wykorzystywana przez rolników od tysięcy lat (bez znajomości mechanizmu — Indianie w Amazonii).\n\n**Zasada działania:**\n- **Grzyb** przenika gęstą siecią strzępek (*hyf*) do gleby, wielokrotnie **zwiększając powierzchnię ssącą korzenia** (z ~1 m² do 100+ m²)\n- **Strzępki** stykają się z korzeniem rośliny i tworzą **arbuskule** (struktury koszyczkowe) w komórkach korzeniowych — miejsca wymiany\n- **Roślina** dostarcza grzybowi **5–20 % swojej fotosyntezy** (cukry, glukozę)\n- **Grzyb** dostarcza roślinie **fosfor, azot, mikroelementy** (głównie Zn, Cu) — znacznie efektywniej niż sam korzeń\n\n**Typy mykoryz:**\n1. **Mikoryza arbuskularna (AM)** — najpowszechniejsza, 80 % roślin (pszenica, kukurydza, soja, drzewa owocowe). Grzyby z gromady *Glomeromycota*.\n2. **Ektomikoryza** — drzewa leśne (dąb, buk, świerk, sosna). Grzyby z gromady *Basidiomycota* (borowiki, maślaki, rydze).\n3. **Mikoryza erikoidalna** — wrzosowate (borówki, żurawiny, wrzos).\n4. **Mikoryza orchidoidalna** — storczyki. Symbioza absolutnie konieczna do kiełkowania.\n\n**Bez mykoryz NIE ROSNĄ:**\n- Winorośl (niemal zależna)\n- Oliwka\n- Wiele drzew owocowych\n- Niektóre storczyki\n\n**Słabo zależne (mogą bez):**\n- Kapustowate (rzepak, gorczyca, kapusta) — produkują glukozynolany, które zabijają grzyby mykoryzowe\n- Niektóre jednoroczne chwasty\n\n**Korzyści dla plonu:**\n- **+30–80 % poboru P** (fosfor jest w glebie często związany w niedostępnej formie, strzępki go rozpuszczają)\n- **+20–40 % poboru N** (głównie z materii organicznej)\n- **+50–100 % poboru wody** (większa powierzchnia ssąca)\n- **Tolerancja na suszę**: strzępki szukają wody na odległość metrów\n- **Tolerancja na metale ciężkie**: mikoryza chroni korzeń\n- **Odporność na patogeny**: strzępki \"blokują\" drogi korzeniowym patogenom (fuzarioza, zgnilizna pitiowa)\n- **Plon**: +5–30 % w warunkach stresowych\n\n**Co niszczy mykoryzę:**\n- **Orka i głęboka uprawa gleby** — fizycznie przecina sieć strzępek. **No-till** (zob. [[no-till]]) i strip-till (zob. [[strip-till]]) chronią strzępki.\n- **Nawozy mineralne z wysokim P** — roślina nie potrzebuje grzyba, symbioza zanika.\n- **Fungicydy** w glebie (szczególnie metalaksyl, propikonazol) — niektóre specyficzne dla grzybów mykoryzowych.\n- **Kapustowate w płodozmianie** — produkują glukozynolany, mikoryza spada.\n- **Gołą gleba** (brak okrywy) — strzępki obumierają bez żywiciela.\n- **Zbyt wysokie pH po wapnowaniu** — niektóre grzyby AM preferują kwaśne pH.\n\n**Preparaty mykoryzowe (komercyjne inokulanty):**\n- **Symbivit** (CZ) — Mendelu, 1 000–2 000 Kč/kg\n- **Mykos** (CZ) — Symbiom (Lanškroun)\n- **Glomus intraradices** (zagraniczny) — RhizoVital\n- **Aplikacja**: zaprawianie nasion, posypanie do rzędów przy siewie, moczenie sadzonek\n\n**Koszt na hektar:**\n- Inokulacja nasion: 200–500 Kč/ha\n- Aplikacja do rzędów: 800–1 500 Kč/ha\n- ROI 1–3 lata (szczególnie w glebach po długiej orce lub po wysokich dawkach P)\n\n**Pomiar mykoryz:**\n- **Mikroskopia korzenia** (barwienie) — laboratoryjne\n- **Test DNA** (qPCR) — kwantyfikacja grzybów AM w glebie\n- **Wskaźniki pośrednie**: pomiar poboru P, tolerancja na suszę, plon\n\n**W ČR badania**: Mendelu Brno, ČZU Praha, ÚEB AV ČR — dziesiątki publikacji.\n\nZob. też [[regenerativni-zemedelstvi]], [[no-till]], [[strip-till]], [[organicka-hmota]], [[biouhel]], [[npk-hnojivo]].",
    "alias": [
      "mycorrhiza",
      "symbioza grzybów i korzeni",
      "mikoryza arbuskularna"
    ],
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
    "kategorie": "chov",
    "shortDef": "TMR (Total Mixed Ration) to technologia żywienia, w której wszystkie składniki dawki (kiszonka, siano, koncentrat, minerały) miesza się w wozie paszowym i podaje jako jednolitą homogeniczną mieszankę. Standard dla mlecznych krów dojnych powyżej 25 l/dzień.",
    "longDef": "TMR (ang. *Total Mixed Ration*, „całkowita dawka mieszana\") to **nowoczesna technologia żywienia bydła**, w której wszystkie składniki dawki pokarmowej **miesza się w jednolitą homogeniczną mieszankę** w wozie paszowym i podaje jednorazowo. Standardowa praktyka dla produkcyjnych stad mlecznych od lat 90. XX w.\n\n**Tradycyjne żywienie vs TMR:**\n| Tradycyjne | TMR |\n|----------|-----|\n| Składniki osobno (kiszonka → siano → koncentrat) | Wszystko wymieszane w 1 dawce |\n| Krowa wybiera | Nie może selekcjonować |\n| Selektywne pobieranie = problem z kwasicą | Wyrównana dawka |\n| Dużo pracy (3–5× dziennie) | 1× dziennie podać, 1–2× przegarnąć |\n| Niższa wydajność | +5–15 % produkcji mleka |\n\n**Składniki typowego TMR dla krowy wysokomlecznej (40+ l mleka/dzień):**\n- **Kiszonka z kukurydzy**: 25–35 kg (sucha masa 30–35 %)\n- **Kiszonka z traw / sianokiszonka**: 5–10 kg\n- **Kiszonka z lucerny / siano**: 3–6 kg (źródło białka i włókna strukturalnego)\n- **Koncentrat / mieszanka paszowa**: 8–12 kg (zboże, śruta sojowa, śruta rzepakowa)\n- **Wysłodki buraczane / wywary browarne**: 5–15 kg (produkty uboczne)\n- **Minerały + witaminy**: 0,2–0,5 kg (Ca, P, Mg, Na, mikroelementy)\n- **Woda**: do wiadra ad lib (nie w TMR)\n- **Łącznie**: 50–70 kg paszy/krowę/dzień (z czego 22–28 kg suchej masy)\n\n**Kluczowe parametry jakości TMR:**\n- **Sucha masa** (DM — Dry Matter): 45–55 % (więcej → krowy za mało piją; mniej → problemy fermentacyjne)\n- **NDF** (Neutral Detergent Fiber): 28–34 % — włókno strukturalne do przeżuwania\n- **NDF z pasz objętościowych** (forage NDF): min. 19 % — dla funkcjonowania żwacza\n- **NEL** (Net Energy Lactation): 6,8–7,2 MJ/kg DM\n- **CP** (Crude Protein): 16–18 %\n- **RUP** (Rumen Undegradable Protein): 35–40 % CP\n- **Długość cząstek** (Penn State Particle Separator):\n  - >19 mm: 5–15 % (efekt strukturalny)\n  - 8–19 mm: 30–50 %\n  - 4–8 mm: 30–50 %\n  - <4 mm: <20 %\n\n**Wozy paszowe (Mixer Wagons / TMR Wagons):**\n- **Poziomy ślimak** (1, 2, 3 ślimaki) — Trioliet, Faresin, Strautmann\n- **Pionowy ślimak** (1, 2 ślimaki) — KUHN Profile, Storti, Sgariboldi — częstsze dziś\n- **Ciągnikowe vs samojezdne** (samojezdne dla stad > 500 sztuk)\n- **Pojemność**: 8–30 m³ (1× karmienie 50–300 krów)\n- **Cena**: 800 tys. – 5 mln Kč\n- **Ocenia się**: czas mieszania, jednorodność, długość cięcia (pionowy ślimak potrafi skracać długą kiszonkę)\n\n**PMR vs TMR vs CMR:**\n- **TMR**: jedna uniwersalna dawka dla całego stada (lub grupy)\n- **PMR** (Partial Mixed Ration): podstawa zmieszana + indywidualne dokarmienie w hali udojowej według produkcji (= koncentrat na podstawie danych krowy)\n- **CMR** (Component Mixed Ration): tradycyjne oddzielne żywienie składnikami (najstarsze podejście)\n\n**Żywienie grupowe:**\nNowoczesne stado ma **2–4 grupy krów dojnych** z różnym TMR:\n- **Wysokomleczne** (>35 l/dzień): wysoka energia, wyższy koncentrat\n- **Średniomleczne** (25–35 l/dzień): standardowe\n- **Niskomleczne** (<25 l/dzień, późna laktacja): niższa energia, więcej pasz objętościowych\n- **Krowy zasuszone / zasuszające się**: tylko pasze objętościowe + minerały (transition diet 3 tygodnie przed porodem)\n\n**Koszty:**\n- **Pasza**: 70–100 Kč/krowę/dzień (przy 30 kg suchej masy)\n- **Praca**: -50 % w porównaniu z tradycyjnym (1× podanie zamiast 3–5×)\n- **Inwestycja w sprzęt**: amortyzacja 1,5–3 Kč/krowę/dzień\n\n**Monitorowanie spożycia:**\n- **Waga wozu** przed i po karmieniu → spożycie na grupę/krowę\n- **Refusal (odpad)** — to, czego krowy nie zjadły, waży się i podaje innym krowom lub przekazuje do biogazowni. 3–5 % odpadów jest normalne (= prawidłowo trafiacie w potrzeby).\n\n**Oprogramowanie do planowania TMR:**\n- **TMR Tracker** (US) — śledzenie jakości\n- **NDS Professional** (IT) — planowanie żywieniowe\n- **Agralis CCT** (CZ) — hale udojowe + żywienie zintegrowane\n- **CowVision** (NL) — w pełni cyfrowe\n\nW CZ: ~80 % stad > 100 krów dojnych używa TMR (dane 2024).\n\nZob. też [[dojirna]], [[kukurice-silazni]], [[vojteska]], [[siloky-balik]], [[oteleni]], [[rijnost]].",
    "alias": [
      "Total Mixed Ration",
      "całkowita dawka mieszana",
      "mieszana dawka pokarmowa"
    ],
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
    "term": "Wycielenie",
    "kategorie": "chov",
    "shortDef": "Wycielenie to poród krowy. W naturalnym cyklu następuje około 280 dni po inseminacji. Kluczowy moment w zarządzaniu gospodarstwem — rozpoczyna się laktacja (~305 dni), krowa jest najbardziej wrażliwa na żywienie i higienę. Powikłania decydują tu o ekonomice całego chowu.",
    "longDef": "Wycielenie (potocznie *cielenie*, fachowo *partus*, ang. *calving*) to **poród krowy** — kulminacyjny moment cyklu hodowlanego. Standardowa ciąża bydła trwa **280 ± 5 dni** (9 miesięcy).\n\n**Cykl produkcyjny krowy:**\n- **Dzień 0**: wycielenie, początek laktacji\n- **Dzień 60–70**: optymalna inseminacja (mniej więcej 2. ruja po porodzie, zob. [[rijnost]], [[inseminace]])\n- **Dzień 280**: zasuszenie (zatrzymanie dojenia 60 dni przed kolejnym porodem) — okres regeneracji gruczołu mlekowego\n- **Dzień 340**: kolejne wycielenie → cykl restartuje\n\n**Pomocnicze wskaźniki:**\n- **Międzywycielenie** (calving interval): 365–400 dni = idealne (krótsze = lepsza ekonomika)\n- **Okres obsługi** (od wycielenia do inseminacji): 60–90 dni = optymalne\n- **Wskaźnik zacielenia**: 1,5–2,5 inseminacji na zacielenie = dobry\n\n**Objawy zbliżającego się wycielenia (24–48 h przed):**\n- **Wymię** się wypełnia, przecieka mlekiem\n- **Srom** spuchnięty, więzadła miedniczne rozluźnione\n- **Śluz** z pochwy (żółty / brązowy)\n- **Zmiana zachowania**: krowa oddziela się od stada, niepokój, oblizywanie\n- **Obniżenie temperatury ciała** o 0,5–1 °C\n\n**Przebieg porodu (3 fazy):**\n1. **Faza rozwierania** (2–6 h): szyjka macicy się otwiera, krowa czuje skurcze, wstaje i kładzie się\n2. **Faza wydalania** (30 min – 4 h): aktywne parcie, widać „pęcherz wodny\" (allantois), potem idą cielęta (zazwyczaj najpierw przednie nogi + głowa)\n3. **Faza łożyskowa** (do 12 h): wydalenie łożyska. Jeśli >12 h = **retentio placentae** = problem weterynaryjny\n\n**Powikłania (dystocja):**\n- **Nieprawidłowe ułożenie cielęcia** (tylne zamiast przedniego, głowa odwrócona, nogi podkulone) — 5–8 % wszystkich wycieleń\n- **Duży płód** (oversized calf) — Belgijska biało-błękitna, Charolais (byk przerasta krowę)\n- **Wąska miednica** (mała krowa z dużym bykiem)\n- **Słabe skurcze** (osłabiona krowa, hipokalcemia)\n- **Twins** (bliźnięta) — wyższe ryzyko powikłań, często wymaga weterynarza\n\n**Statystyki dystocji:**\n- **Holsztyn**: 8–12 % wycieleń z asystą (lżejsze porody)\n- **Belgijska biało-błękitna**: 90+ % asystowanych (często cięcie cesarskie!)\n- **Charolais, Limousin**: 15–25 % asystowanych\n- **Aberdeen Angus**: <5 % — „easy calving\"\n\n**Interwencje weterynaryjne:**\n- **Ręczna asysta**: wyciąganie rękoma\n- **Fetotomia**: sznury porodowe, łańcuchy, wyciąganie pasem (do 50 kg naciągu)\n- **Cięcie cesarskie**: konieczne przy wąskich miednicach lub złych ułożeniach — 8 000–25 000 Kč\n- **Embrotomia**: podział martwego płodu w macicy (ratuje matkę)\n\n**Po wycieleniu — krytyczne pierwsze tygodnie:**\n- **Colostrum (siara)** — pierwsze mleko bogate w przeciwciała. Cielę MUSI dostać min. 4 l w ciągu 6 h po porodzie (odporność bierna).\n- **Hipokalcemia / gorączka mleczna** — 3–10 % krów, krótko po wycieleniu (Ca → mleko). Leczy się wlewem wapnia.\n- **Ketoza** — deficyt energetyczny we wczesnej laktacji, chudnięcie, ciała ketonowe w moczu. Profilaktyka: dobrej jakości TMR ([[tmr]]).\n- **Retentio placentae** (zatrzymanie łożyska) — ryzyko zapalenia macicy → obniżona płodność.\n- **Metritis** — zapalenie macicy, zmniejsza reprodukcję.\n- **Mastitis** — zapalenie wymienia, częste w pierwszych 30 dniach.\n\n**Wymagania dobrostanu** (normy CZ):\n- **Oddzielny boks porodowy** (calving pen) — min. 12 m², czysto, sucho, spokojnie\n- **Nadzór weterynaryjny** podczas porodu\n- **Cielę i krowa razem** min. 24 h po porodzie (dla odporności biernej)\n- **Żadnych rutynowych hormonalnych indukcji porodów** (zakazane w UE od 2008)\n\n**Wskaźniki ekonomiczne:**\n- **% żywo urodzonych cieląt**: 92–96 % = bardzo dobrze\n- **% cieląt przeżywających do 60 dnia**: 90–95 %\n- **Koszt 1 wycielenia**: 1 500–8 000 Kč (asysta, leki, czas)\n- **Wartość cielęcia** (byczek 50 kg masy żywej): 8 000–15 000 Kč\n- **Wartość cielęcia** (jałówka do chowu): 25 000–60 000 Kč\n\n**Synchronizacja porodów:**\n- **CIDR + PGF₂α** protokół (kontrolowany cykl) → narodziny cieląt „falami\"\n- Zalety: organizacja pracy, hurtowy zakup/sprzedaż, monitoring\n- Wady: wyższe stałe obciążenie sprzętu i personelu podczas szczytów\n\nZob. też [[rijnost]], [[inseminace]], [[jalovice]], [[usni-znamka]], [[dojirna]], [[tmr]].",
    "alias": [
      "poród krowy",
      "cielenie",
      "calving"
    ],
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
    "kategorie": "chov",
    "shortDef": "Ruja to okres receptywności płciowej samicy — u krowy trwa 12–24 h, powtarza się co 18–24 dni. Kluczowy moment do inseminacji. Wykrywanie rui (naturalnie lub automatycznymi czujnikami) decyduje o 80 % sukcesu rozrodczego fermy.",
    "longDef": "Ruja (łac. *estrus*, ang. *heat*) to **okres, w którym samica ssaka jest receptywna płciowo i zdolna do zapłodnienia**. U bydła (krów i jałówek — zob. [[jalovice]]) trwa 12–24 godziny i powtarza się w **21-dniowym cyklu** (18–24 dni w normie).\n\n**Cykl krowy (średnio 21 dni):**\n- **Dzień 0**: ruja (estrus) — 12–24 h\n- **Dzień 1**: owulacja 24–30 h po początku rui\n- **Dzień 5–17**: faza lutealna (ciałko żółte produkuje progesteron) — hamowanie kolejnej rui\n- **Dzień 18–19**: luteoliza (rozpad ciałka żółtego)\n- **Dzień 20–21**: nowa ruja, cykl się restartuje\n- **Jeśli ciąża**: ciałko żółte przeżywa → brak kolejnej rui przez 280 dni\n\n**Objawy rui:**\n1. **Standing heat** (= kluczowy objaw): krowa stoi nieruchomo, gdy wskoczy na nią inna krowa. **Trwa 4–18 h** w ramach całej rui. **Jedyny 100% pewny** objaw.\n2. **Wspinanie** na inne krowy — początek rui\n3. **Śluz**: czysta, lepka wydzielina ze sromu\n4. **Srom**: zaczerwieniony, lekko obrzęknięty\n5. **Niepokój**: więcej chodzenia (do 4× normalny dystans), ryczenie, zmniejszone pobieranie paszy\n6. **Spadek wydajności mlecznej**: -10 do -30 % na 1 dzień\n\n**Cicha ruja (silent heat):**\n30–40 % krów (szczególnie we wczesnym okresie pourodzeniowym lub przy stresie cieplnym latem) **nie wykazuje widocznych objawów rui**, ale owulacja przebiega. **Ryzyko**: ręcznie nie można wykryć, krowa \"niezapłodniona\" 60+ dni → strata ekonomiczna 50–100 Kč/dzień.\n\n**Wykrywanie rui — metody:**\n\n**1. Obserwacja wzrokowa** (tradycyjna):\n- 2× dziennie przez 20 min = wykrycie **45–55 %** rui\n- 3× dziennie przez 30 min = wykrycie **65–75 %** rui\n- Czasochłonne, podatne na błędy ludzkie\n\n**2. Pomoce wykrywcze:**\n- **Heat mount detector** (Kamar) — kolorowy samoprzylepny chip na kości krzyżowej, zmienia kolor pod ciśnieniem wsiadającej krowy. **Tanie** (50–100 Kč/szt.), niezawodność ~80 %.\n- **Spray kredowy** na kości krzyżowej — nowy spray każdego dnia, starcie = znak rui\n- **Estrotect patches** — połączenie wykrywania ciśnieniowego i kolorowego\n\n**3. Czujniki (precision livestock farming):**\n- **Aktywometr** (pedometr) — licznik kroków na nodze, ruja = +50–100 % kroków\n- **Akcelerometr** na obroży — wykrywanie rui + monitorowanie aktywności fizycznej\n- **CowManager SensOor** — kwantyfikacja przeżuwania, pobierania, aktywności\n- **Allflex Heatime** — system kombinowany\n- **DeLaval BCS Camera** — kamera + AI wykrywanie\n- **Koszt**: 2 000–5 000 Kč/krowę (jednorazowy) + 30–80 Kč/miesiąc oprogramowanie\n- **Niezawodność**: 90–98 % wykrycia, mniej fałszywych alarmów\n\n**4. Pomiary hormonalne (lab):**\n- **Progesteron w mleku** — codziennie lub 3× tygodniowo. Spadek progesteronu = ruja.\n- **Szybki test progesteronu w mleku** (RMPT) — pasek 30 min, 50 Kč/test\n\n**Inseminacja — moment:**\n- **Reguła AM/PM**: ruja rano → inseminować po południu; ruja wieczorem → inseminować rano\n- **Owulacja** jest 24–30 h od początku rui\n- **Nasienie** przeżywa 12–24 h w macicy\n- **Komórka jajowa** przeżywa tylko 6–10 h po owulacji\n- **Optymalne okno**: 6–18 h od początku rui\n\n**Synchronizacja rui** (kontrolowane rozmnażanie):\nHormonalne protokoły do **wywoływania rui w grupie jednocześnie**:\n\n- **PGF₂α** (Prostaglandyna) — 2 iniekcje w odstępie 14 dni. Tanie, 80–85 % synchronizacji.\n- **Ovsynch** — 7-dniowy protokół z GnRH + PGF + GnRH + AI. Wyższa niezawodność ~70 %.\n- **CIDR / PRID** (dopochwowy progesteron) + GnRH + PGF — dla krów z nieregularnym cyklem\n\n**Anestrus** (brak cyklu):\n- Po porodzie 30–60 dni normalny (= **anestrus poporodowy**)\n- Jeśli > 90 dni → patologia:\n  - **Cykliczny anestrus**: problem jajnikowy\n  - **Anestrus acykliczny**: niedobór składników odżywczych, ketoza (zob. [[oteleni]])\n  - **Przetrwałe ciałko żółte**: rzadko, leczenie PGF₂α\n\n**Ekonomiczny wpływ wykrywania rui:**\n- **Wykrycie 95 %** (czujniki): okres międzywycieleniowy 380 dni, +200 l mleka/krowę/rok = +6 000 Kč\n- **Wykrycie 50 %** (ręcznie): okres międzywycieleniowy 430 dni, strata 50 dni × 100 Kč/dzień = -5 000 Kč/krowę/rok\n\nZob. też [[inseminace]], [[oteleni]], [[jalovice]], [[dojirna]].",
    "alias": [
      "cieczka",
      "estrus",
      "cykl płciowy"
    ],
    "related": [
      "inseminace",
      "oteleni",
      "jalovice",
      "dojirna"
    ]
  },
  {
    "slug": "inseminace",
    "term": "Sztuczna inseminacja",
    "kategorie": "chov",
    "shortDef": "Sztuczna inseminacja to metoda rozrodu, w której nasienie wybranego buhaja hodowlanego przechowywane jest mrożone i w odmierzonych dawkach wprowadzane do macicy krowy w okresie rui. Standardowa procedura w nowoczesnym chowie (>95 % w CZ).",
    "longDef": "Sztuczna inseminacja (AI, *artificial insemination*) to **metoda rozrodu zwierząt gospodarskich**, w której pozyskane i zamrożone nasienie samca hodowlanego wprowadzane jest do macicy samicy **bez bezpośredniego krycia**. Standardowa praktyka w nowoczesnym chowie bydła, świń, owiec, kóz.\n\n**Historia:**\n- **1779** — włoski fizjolog Lazzaro Spallanzani z powodzeniem przeprowadził inseminację suki\n- **1899** — rosyjski uczony Ilja Iwanowicz Iwanow — pierwsza inseminacja u koni i krów\n- **1949** — Polge i Smith odkryli **krioprotektant glicerol** do mrożenia nasienia\n- **Lata 50. XX w.** — wprowadzenie mrożonego nasienia w USA i UE\n- **Lata 60. XX w.** — masowe upowszechnienie w CZ (Velký kus, Stacja Inseminacyjna Stadlec)\n\n**Zasada działania:**\n\n**1. Pozyskanie nasienia od buhaja:**\n- **Sztuczna pochwa** (artificial vagina) — buhaj skacze na atrappę (fantom) lub krowę ćwiczebną, nasienie zbierane jest do szklanego pojemnika\n- **Elektroejakulacja** — dla problematycznych buhajów lub przy schorzeniach\n- **Częstość**: 2× w tygodniu, 1–2 ejakulaty na sesję\n- **Objętość 1 ejakulatu**: 5–10 ml, ~1 miliard plemników\n\n**2. Ocena i rozcieńczanie:**\n- **Kontrola mikroskopowa**: ruchliwość (motility), morfologia (kształt), stężenie\n- **Rozcieńczanie** w rozcieńczalniku (żółtko jaja + glicerol + bufor cytrynianowy)\n- **Podział na dawki**: typowo 20–30 mln plemników / dawkę (= 1 inseminacja)\n- **1 ejakulat → 200–500 dawek**\n\n**3. Mrożenie:**\n- **Słomki** (straws) — 0,25 ml, plastikowe, kodowane kolorystycznie według buhaja\n- **Stopniowe schładzanie**: 22 °C → 4 °C → -100 °C → -196 °C (ciekły azot)\n- **Przechowywanie w dewarze z LN₂** (ciekły azot)\n- **Trwałość**: praktycznie nieograniczona (udowodniono 50+ lat)\n\n**4. Inseminacja krowy (rolnik lub technik inseminacyjny):**\n- **Termin**: 6–18 h od początku rui (zob. [[rijnost]])\n- **Rozmrożenie słomki**: 35 °C, 45 sek. w kąpieli wodnej\n- **Aplikacja**:\n  - Inseminator wprowadza pistolet inseminacyjny **przez pochwę, szyjkę macicy, do trzonu macicy** (ok. 20 cm głębokości)\n  - Jedną rękę trzyma w odbytnicy — palpuje szyjkę macicy i prowadzi pistolet\n  - Wstrzykuje cały objętość (0,25 ml) do macicy\n- **Czas zabiegu**: 30 sek. – 2 min u doświadczonego inseminatora\n\n**Wykształcenie inseminatora w CZ:**\n- **Lekarze weterynarii** (wyższe studia) — bez ograniczeń\n- **Zoolodzy / agronomowie** — specjalny kurs „Technik inseminacyjny\"\n- **Sami rolnicy** — kurs „Własna inseminacja\" (ok. 40 h), a następnie licencja wyłącznie dla własnego stada (NIE do inseminacji cudzych krów)\n\n**Ekonomika i praktyka:**\n\n**Cena 1 dawki nasienia (2024):**\n- **Standardowa genetyka**: 200–400 Kč/dawkę\n- **Top genetyka** (Top 100 USA TPI): 600–1 500 Kč\n- **Nasienie płciowane** (90 % jałówek): 1 200–2 500 Kč\n- **Linia do transferu zarodków**: 5 000–25 000 Kč\n- **Koszt 1 zacielenia** (średnio 1,8 dawki): 360–2 700 Kč\n\n**Konkurencja — krycie naturalne (buhaj w stadzie):**\n- **Plusy**: 95 % zacielenia, brak kosztów inseminatora, nie trzeba wykrywać rui\n- **Minusy**: 1 buhaj = 1 linia genetyczna (vs 20+ wariantów AI), ryzyko urazów krowy/buhaja, zoonozy, genetycznie przeciętne buhaje\n\n**W CZ 2024:**\n- ~98 % krów mlecznych inseminowanych (praktycznie wszystkie)\n- ~75 % krów mięsnych inseminowanych (pozostałe krycie naturalne)\n- **Stacje inseminacyjne**: VŠM (Velký Šariš), Plemenáři Lhota, GeneTPlus, Bohemia Plus\n- **Importowane nasienie**: 60 % holsztyn z USA, 20 % genetyka CZ, 20 % genetyka UE\n\n**Nasienie płciowane (sex-sorted):**\n- **Zasada**: plemniki X (jałówki) i Y (byczki) sortowane cytometrią przepływową (zawartość DNA w główce X jest ~3,8 % wyższa)\n- **Skuteczność**: 90 % żądanej płci\n- **Niższa ruchliwość** — typowo 30 mln plemników/dawkę (vs 25 mln konwencjonalne)\n- **Cena**: 1 200–2 500 Kč/dawkę\n- **Zastosowanie**: wczesne jałówki (gwarantowane jałówki do chowu), top kráv pro chovné linie\n\n**Transfer zarodków (ET):**\n- **Wyższy poziom genetyki**: superowulacja top krowy → transfer zarodków do krów-biorczyń\n- **Zasada**:\n  1. Top krowa-dawczyni: stymulacja hormonalna (FSH 4 dni)\n  2. Inseminacja top buhajem\n  3. Zarodki (7-dniowe) wypłukane z macicy\n  4. Przeszczep do 5–10 krów-biorczyń (zsynchronizowanych)\n- **Cena**: 50 000–150 000 Kč za 1 cykl\n- **Top krowa** daje 6–10 cieląt rocznie zamiast 1 (w porównaniu z naturą)\n\nZob. też [[rijnost]], [[oteleni]], [[jalovice]], [[usni-znamka]], [[dojirna]].",
    "alias": [
      "AI",
      "artificial insemination",
      "IZR sztuczne zapłodnienie"
    ],
    "related": [
      "rijnost",
      "oteleni",
      "jalovice",
      "usni-znamka"
    ]
  },
  {
    "slug": "jalovice",
    "term": "Jałówka",
    "kategorie": "chov",
    "shortDef": "Jałówka to samica bydła od urodzenia do pierwszego wycielenia — typowo 0–24 miesiące. Kluczowa inwestycja w chowie (12–18 mies. odchowu bez produkcji), genetyczny potencjał nowego pokolenia. Po pierwszym wycieleniu staje się „pierwiastką\" (cow).",
    "longDef": "Jałówka (potocznie *jalůvka*, dialekt *sirka*, ang. *heifer*) to **samica bydła od urodzenia do pierwszego wycielenia**. Po pierwszym wycieleniu nie jest już jałówką, lecz **krową** (cow), konkretnie „pierwiastką\" (= primipara). Okres odchowu jałówki to **kluczowa inwestycja** w chowie — 22–24 miesiące kosztów bez produkcji mleka.\n\n**Fazy odchowu jałówki:**\n\n**1. Cielę (calf) — 0–2 miesiące:**\n- **Masa urodzeniowa**: 35–45 kg (holsztyn), 25–35 kg (jersey), 40–50 kg (charolais)\n- **Colostrum (siara)**: 4 l w ciągu 6 h po porodzie — KRYTYCZNE dla odporności biernej (cielę nie ma wrodzonej odporności)\n- **Karmienie mlekiem**: 6–8 l/dzień, 2× dziennie\n- **Stajnia**: boxy indywidualne (calf hutch) przez pierwsze 4–8 tygodni, potem w grupie\n- **Pasze suche**: wprowadzenie śruty i siana od 2. tygodnia\n- **Odsadzenie** (weaning): 6–10 tygodni, stopniowe ograniczanie mleka\n\n**2. Cielę po odsadzeniu — 2–6 miesięcy:**\n- **Masa**: 70–150 kg\n- **Żywienie**: śruta (1–2 kg/dzień), dobrej jakości siano ad lib, woda\n- **Wzrost**: cel **0,8 kg/dzień** (holsztyn)\n- **Grupa społeczna**: 4–10 cieląt tej samej kategorii wiekowej\n- **Usuwanie zawiązków rogów / derogowanie** (8 tygodni) — znieczulenie + miejscowe\n- **Pierwsze zabiegi**: parazytologia, szczepienia (BVD, IBR, salmoneloza)\n\n**3. Młoda jałówka — 6–12 miesięcy:**\n- **Masa**: 150–300 kg\n- **Żywienie**: dobrej jakości sianokiszonka + 1–2 kg śruty\n- **Wzrost**: cel 0,75 kg/dzień\n- **Stajnia**: boks grupowy, 4–6 m²/sztukę\n- **Ruch**: wypas latem (korzystny w odchowie)\n\n**4. Jałówka do inseminacji — 12–18 miesięcy:**\n- **Masa**: 350–450 kg (docelowo 380–420 kg dla holsztyna przed inseminacją)\n- **Dojrzałość płciowa**: ~10–12 miesięcy (pokwitanie), ale inseminacja nie wcześniej niż w 14. miesiącu\n- **Optymalna inseminacja**: 15 miesiąc życia, masa 380 kg\n- **Cel wycielenia**: 24 miesiące życia (vs dawniej 28–32 mies.) — **wcześniejsze wycielenie = lepsza ekonomika**\n\n**5. Jałówka cielna (in-calf heifer) — 15–24 mies.:**\n- **Ciąża**: 280 dni (9 mies.)\n- **Żywienie**: takie samo jak młoda jałówka + ostatni trymestr +20 % energii\n- **Masa przy wycieleniu**: 550–650 kg (holsztyn)\n- **Stajnia**: boks krowi (= przygotowuje się do grupy laktacyjnej)\n\n**Koszty odchowu jałówki (CZ 2024):**\n- **Pasza** (22 mies.): ~22 000 Kč\n- **Weterynaria, leki**: ~3 000 Kč\n- **Inseminacja**: ~500 Kč\n- **Praca, energia, woda**: ~6 000 Kč\n- **Amortyzacja stajen**: ~4 000 Kč\n- **Łącznie**: ~35 000 Kč na 1 jałówkę do pierwszego wycielenia\n\n**Wartość jałówki:**\n- **Urodzona jałóweczka** (z top genetyki): 5 000–15 000 Kč (tylko jako cielę)\n- **Cielna jałówka** gotowa do wycielenia: **50 000–80 000 Kč**\n- **Top genetyczna jałówka hodowlana** (NA-3+, Top 100 BBA): 80 000–250 000 Kč\n- **Jałówka zarodkowa** (z ET): 100 000–500 000 Kč\n\n**Nasienie płciowane** (zob. [[inseminace]]):\n- **Standardowa inseminacja**: 50 % jałówek / 50 % byczków\n- **Sexed semen**: 90 % jałówek\n- **Strategiczne zastosowanie**: top 25 % krów stada dostaje nasienie płciowane (= gwarantowane jałówki do chowu), dolne 25 % dostaje genetykę mięsną (= cielę krzyżówkowe na mięso, sprzedawane za 12–20 tys. Kč)\n\n**Dobrostan i problemy:**\n- **Pierwsze wycielenie**: dystocja (ciężki poród) częstsza niż u dorosłych krów (15 % vs 8 %)\n- **Zalecana miednica**: zmierzyć krocze i miednicę rektalnie → wykluczyć bardzo wąskie\n- **Pierwsza laktacja**: 75 % produkcji dorosłej krowy. Pełny potencjał dopiero w 3. laktacji.\n\n**Postęp genetyczny:**\n- Jałówki = **nowe pokolenie** stada\n- Jeśli masz top 10 % krów = zalecane top nasienie + ET → maksymalna poprawa\n- Dolne 30 % stada = genetyka mięsna (genetyczna ślepa uliczka)\n\n**Starzejące się stado:**\n- Przeciętny wiek krowy w stadach CZ: **3,5 laktacji** (= 5–6 lat)\n- **Cykl**: 30–35 % jałówek rocznie wchodzi do stada jako pierwiastki, 30–35 % krów odchodzi (brakowanie lub sprzedaż)\n\n**„Sirka\"** — słowacki / wołoski dialekt na jałówkę, dziś regionalnie na Morawach.\n\nZob. też [[oteleni]], [[rijnost]], [[inseminace]], [[usni-znamka]], [[tmr]], [[dojirna]].",
    "alias": [
      "heifer",
      "jalůvka",
      "sirka"
    ],
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
    "term": "Kolczyk",
    "kategorie": "chov",
    "shortDef": "Kolczyk to plastyczna zawieszka identyfikacyjna zakładana do ucha zwierzęcia gospodarskiego, obowiązkowa w UE. Bydło, owce, kozy, świnie. Zawiera indywidualny kod powiązany z IZR (Zintegrowanym Rejestrem Rolniczym) — bez niego zwierzę nie może opuścić fermy ani trafić do rzeźni.",
    "longDef": "Kolczyk uszny (ang. *ear tag*, oficjalnie **identyfikator**) to **plastikowa zawieszka** z indywidualnym kodem, którą przepisy UE wymagają dla wszystkich zwierząt gospodarskich (bydło, owce, kozy, świnie, konie) jako element **systemu rejestracji zwierząt**. W CZ powiązany z **IZR — Zintegrowanym Rejestrem Rolniczym** prowadzonym przez SZIF.\n\n**Ramy prawne:**\n- **Rozporządzenie UE 1760/2000** — obowiązek identyfikacji bydła (po kryzysie BSE)\n- **UE 21/2004** — owce i kozy\n- **UE 1/2005** — świnie\n- **Ustawa CZ 154/2000 Dz.U.** o hodowli zwierząt\n- **Rozporządzenie CZ 136/2004 Dz.U.** — wykonanie techniczne kolczyków\n\n**Co zawiera kolczyk uszny:**\n\n**Bydło — dwa kolczyki (obowiązkowo do 7 dni po porodzie):**\n- **Duży plastikowy kolczyk** (żółty, ok. 8 × 6 cm) w lewym uchu\n- **Mały metalowy / plastikowy kolczyk** w prawym uchu (zapasowy na wypadek utraty dużego)\n- **Zawartość**:\n  - **CZ** (kod kraju)\n  - **9-cyfrowy indywidualny numer zwierzęcia** (np. *CZ 123 456 789*)\n  - **Logo zwierzęcia / IZR**\n  - **Opcjonalnie**: nazwa hodowcy, oznaczenie fermy, chip RFID (HDX 134,2 kHz)\n\n**Świnie:**\n- **1 kolczyk** z numerem gospodarstwa (nie indywidualny)\n- Lub **tatuaż** (kleszczy tatuujące w lewym uchu)\n- Przy przesunięciu do innego gospodarstwa: nowy kolczyk\n\n**Owce, kozy:**\n- **2 kolczyki** (jak bydło), jeden z nich zawiera RFID\n- Do **elektronicznej identyfikacji** w nowoczesnych owczarniach\n\n**RFID identyfikacja elektroniczna:**\n- **HDX (Half Duplex)** vs **FDX-B (Full Duplex)** — standardy\n- **Częstotliwość**: 134,2 kHz (ISO 11784/11785)\n- **Zasięg odczytu**: 10–40 cm (stacjonarne czytniki), 1–3 m (bramy antenowe)\n- **Zastosowanie**:\n  - Automatyczne żywienie w hali udojowej (= inna dawka koncentratu dla każdej krowy)\n  - Ważenie w przejściu (auto-zapis do bazy danych)\n  - Roboty udojowe (Lely, DeLaval)\n  - Zbieranie danych o aktywności (CowManager, Allflex Heatime)\n\n**Zakładanie kolczyka:**\n- **Specjalne kleszcze** (tagger) — jednorazowe lub wielorazowego użytku (Allflex, Datamars, Caisley)\n- **Miejsce aplikacji**: dolna trzecia część ucha, między 2 naczyniami krwionośnymi (unikamy krwawienia)\n- **Higiena**: dezynfekcja kleszczy między zwierzętami\n- **Bolesność**: krótkie ukłucie, zwierzę uspokaja się w ciągu 30 sek.\n\n**Utrata kolczyka:**\n- **Bydło**: ~3–8 % rocznie (zaczepiają się o stajnię, inne krowy)\n- **Postępowanie**: hodowca stwierdza utratę, zamawia **kolczyk zastępczy** od SZIF/IZR (ten sam numer indywidualny), zakłada go w ciągu 7 dni\n- **Cena 1 kolczyka** (2024): 25–50 Kč bydło, 8–15 Kč owca\n- **Roczne koszty kolczyków** dla stada 100 krów: ~1 500–3 000 Kč\n\n**Sankcje za brakujące kolczyki:**\n- **Bydło bez kolczyka nie może opuścić fermy** (= nie może trafić do rzeźni, sprzedaż)\n- **Kontrola SZIF** — 1× rocznie, grzywna 10 000–500 000 Kč\n- **Dopłaty BISS / CISS** uzależnione od prawidłowej identyfikacji\n- **Ryzyko epidemii AVI / SBV** — niezidentyfikowanego zwierzęcia nie można prześledzić\n\n**IZR — Zintegrowany Rejestr Rolniczy:**\n- **Baza danych**: numery zwierząt + historia przesunięć + hodowcy + rzeźnie\n- **Przemieszczenie zwierzęcia** = zgłosić do IZR w ciągu 7 dni (pochodzenie + cel)\n- **Wycielenie** = zgłosić w ciągu 7 dni (inny numer dla cielęcia + matka)\n- **Upadek / ubój** = zgłosić w ciągu 7 dni\n- **System online**: portal.szif.cz, aplikacja mobilna „IZR mobile\"\n\n**Zbiorcze eksporty XML z IZR:**\nProfi farmy używają **eksportu XML do zbiorczego zgłaszania** przesunięć (np. po uboju lub przesunięciu krów między stajniami):\n- Generuje się z oprogramowania zarządzającego (CowVision, AgroTronic)\n- Przesyła się na portal SZIF\n- Walidacja schematu XSD, błędy online\n\n**Paszporty (Cattle Passport / Karta Identyfikacyjna):**\n- **Bydło**: każde zwierzę ma własną **kartę identyfikacyjną** wystawioną przez SZIF z historią przesunięć\n- **Karta jest papierowa**, wystawiana przy pierwszej rejestracji, uzupełniana przesunięciami\n- **Karta musi podróżować ze zwierzęciem** podczas transportu (ryzykuje kierowca przewozu)\n\n**Nowoczesny rozwój — biometria:**\n- **Bolusy** (RFID w żwaczu, połykane przez zwierzę) — Mottainai, Cowtronix\n- **Skanowanie siatkówki** — Vision Pro (US) — identyfikacja bezdotykowa\n- **Identyfikacja twarzy** (AI) — DeLaval BCS Camera\n- Technologie te nie zastępują jeszcze prawnie zawieszki w UE, są jedynie uzupełnieniem.\n\n**Tatuaż / freeze branding:**\n- Dawniej stosowany (przed UE 1760/2000), dziś tylko u koni i w niektórych hodowlach USA\n- **Bolesny**, dziś w UE przeważnie zastąpiony zawieszkami\n\nZob. też [[oteleni]], [[inseminace]], [[jalovice]], [[lpis]], [[dojirna]].",
    "alias": [
      "kolczyk uszny",
      "ear tag",
      "identyfikator",
      "znaczenie IZR"
    ],
    "related": [
      "oteleni",
      "inseminace",
      "jalovice",
      "lpis"
    ]
  },
  {
    "slug": "krmne-davky",
    "term": "Dawki pokarmowe",
    "kategorie": "chov",
    "shortDef": "Dawka pokarmowa to dobowa ilość paszy dla zwierzęcia gospodarskiego, zbilansowana pod kątem energii, białka, włókna i minerałów. Dla wysokomlecznej krowy 50–70 kg paszy (22–28 kg suchej masy). Planowanie to nauka — błąd = stracona laktacja lub problem zdrowotny.",
    "longDef": "Dawka pokarmowa (ang. *ration*, *diet*) to **dobowa ilość i skład paszy** dla zwierzęcia gospodarskiego, obliczona według jego **stadium produkcyjnego, masy ciała i klimatu**. Celem jest zapewnienie **maksymalnej wydajności przy ekonomicznym żywieniu**.\n\n**Składniki dawki dla bydła:**\n\n**1. Pasze objętościowe (forage) — włókno strukturalne:**\n- **Kiszonka z traw / sianokiszonka**: NDF 50–60 %, NEL 5,8–6,4 MJ/kg DM\n- **Kiszonka z kukurydzy**: NDF 38–45 %, NEL 6,4–7,0 MJ/kg DM, wysoka energia ze skrobi\n- **Kiszonka z lucerny**: NDF 40–48 %, CP 19–22 %, wysokie Ca\n- **Siano**: NDF 55–65 %, uzupełnienie struktury, „scratch factor\" dla żwacza\n- **Słoma**: NDF 75–85 %, niska energia, dla chowu ekstensywnego lub krów zasuszonych\n\n**2. Koncentraty (śruta) — energia i białko:**\n- **Pszenica, jęczmień, kukurydza (ziarno)**: NEL 8,3–8,7 MJ/kg DM, CP 9–13 %, wysoka skrobia\n- **Śruta sojowa ekstrakcyjna (SES)**: CP 45–48 %, zrównoważony profil aminokwasowy\n- **Śruta rzepakowa ekstrakcyjna (ŘES)**: CP 36–38 %, tańsza niż SES, nieco niższa jakość\n- **Śruta słonecznikowa**: CP 32–38 %, wysokie włókno\n- **Wysuszone wywary browarne**: CP 24–28 %, NEL 7,0 MJ\n- **DDGS** (suchy destylacyjny wywar): CP 28–30 %, NEL 7,2 MJ — produkt uboczny z bioetanolu\n\n**3. Produkty uboczne / By-products:**\n- **Wysłodki buraczane**: świeże (mokre) 8 % CP, NEL 6,9 MJ\n- **Wywary browarne**: 25 % CP, NEL 6,5 MJ\n- **Okara sojowa**: 26 % CP, NEL 6,8 MJ\n- **Skórki pomarańczowe (CR)**: wysoki cukier, NEL 7,5 MJ\n- **Serwatka (whey)**: ciecz, niska wartość\n\n**4. Minerały i witaminy:**\n- **Ca**: 0,8–1,0 % sm. (mleko zawiera Ca, duże zapotrzebowanie)\n- **P**: 0,4–0,5 % sm.\n- **Mg**: 0,2–0,3 % sm. (profilaktyka tężyczki pastwiskowej)\n- **Na (sól)**: 0,2 % sm.\n- **K**: 1,0–1,5 % sm.\n- **Mikroelementy**: Zn 60–80 ppm, Cu 15–20 ppm, Se 0,3 ppm, I 0,8 ppm\n- **Witamina A**: 100 000 IU/dzień\n- **Witamina D₃**: 40 000 IU/dzień\n- **Witamina E**: 500 mg/dzień\n\n**Typowe dawki:**\n\n**Krowa wysokomleczna (45+ kg mleka/dzień, 700 kg masy żywej):**\n- 28 kg kiszonki z kukurydzy\n- 18 kg kiszonki z traw\n- 4 kg sianokiszonki z lucerny\n- 9 kg śruty (mieszanka zbóż)\n- 3 kg SES\n- 1,5 kg wysłodków buraczanych\n- 0,4 kg minerały\n- **Łącznie**: 64 kg paszy, ~26 kg suchej masy\n- **Koszt**: ~95 Kč/sztukę/dzień\n\n**Średniomleczna (30 kg mleka/dzień):**\n- 25 kg kiszonki z kukurydzy\n- 15 kg kiszonki z traw\n- 6 kg śruty\n- 2 kg SES\n- **Koszt**: ~70 Kč/sztukę/dzień\n\n**Krowy zasuszone (suche, 60 dni przed wycieleniem):**\n- 30 kg kiszonki z traw lub sianokiszonki\n- 4 kg siana (włókno dla żwacza)\n- 1 kg mieszanki mineralnej „dry cow\"\n- **Koszt**: ~30 Kč/sztukę/dzień\n- **Cel**: minimalna energia, max struktura, profilaktyka gorączki mlecznej\n\n**Opas byczka (intensywny tucz, 400–700 kg):**\n- 12 kg kiszonki z kukurydzy\n- 4 kg siana\n- 5 kg śruty\n- 0,5 kg SES\n- 0,2 kg minerały\n- **Cel**: 1,2 kg przyrostu/dzień\n- **Koszt**: ~50 Kč/sztukę/dzień\n\n**Cielę po odsadzeniu (3 mies.):**\n- 0,8 kg mieszanki paszowej dla cieląt\n- 0,3 kg siana\n- Pełny dostęp do wody\n- **Koszt**: ~25 Kč/sztukę/dzień\n\n**Kluczowe parametry:**\n\n**Sucha masa (DM)**: 22–28 kg/dzień dla krowy = 3,5–4,5 % masy żywej\n**Energia (NEL)**:\n- Krowa dojąca (początek laktacji): 7,2 MJ/kg DM (wysokie stężenie)\n- Krowa dojąca (późna laktacja): 6,5 MJ/kg DM\n- Krowy zasuszone: 5,2 MJ/kg DM\n\n**Crude Protein (CP)**:\n- Wysoka wydajność: 17–18 %\n- Średnia: 15–16 %\n- Zasuszone: 12–13 %\n\n**RUP (Rumen Undegradable Protein)**: 35–42 % CP = białko przechodzi niezdegradowane przez żwacz, wchłania się w jelicie cienkim = wyższa wydajność\n\n**NDF (Neutral Detergent Fiber)**: 30–34 % DM = włókno strukturalne, nie za dużo (= kwasica), nie za mało (= dieta podstrukturalna)\n\n**Oprogramowanie do planowania:**\n- **NDS Professional** (IT) — światowy standard\n- **CPM-Dairy** (USA)\n- **Spartan Dairy** (USA)\n- **AMTS Cattle Pro** (USA)\n- **DAIRY-X** (CZ) — krajowe rozwiązanie\n- **Agralis CCT** (CZ) — pełne zarządzanie fermą łącznie z żywieniem\n\n**Monitorowanie:**\n- **Zużycie** ważenie wejście vs odpad = rzeczywiste pobranie\n- **BCS** (Body Condition Score) — stopień 1–5 stanu odżywienia\n- **Profil mleka** — białka, tłuszcz, mocznik, komórki somatyczne → analiza laboratoryjna mleka krowy 1× mies.\n- **pH żwacza** — sonda u problematycznych stad\n\n**Żywienie i ekonomika:**\n- **Pasza** = **60–70 % kosztów produkcji mleka**\n- **Optymalizacja dawki** = 1 Kč/krowę/dzień oszczędności × 365 dni × 100 krów = **36 500 Kč/rok**\n- Konsultacja nutriucjonisty (1–3 tys. Kč/mies.) zazwyczaj się opłaca\n\nZob. też [[tmr]], [[kukurice-silazni]], [[vojteska]], [[oteleni]], [[rijnost]], [[siloky-balik]].",
    "alias": [
      "pasze dla bydła",
      "żywienie bydła",
      "feed ration"
    ],
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
    "term": "Kombajnista",
    "kategorie": "slang",
    "shortDef": "Kombajnista to potoczne określenie kierowcy sieczkarni-kombajnu podczas żniw. W hierarchii zawodowej farmy jest to pozycja najbardziej widoczna i wymagająca — pracuje 12–16 h/dzień przez 2–6 tygodni żniw.",
    "longDef": "Kombajnista (kierowca kombajnu) to **potoczne określenie kierowcy zbożowego kombajnu sieczkarni**. Nie jest to oficjalny tytuł zawodowy (formalnie „operator maszyn rolniczych\" lub „kierowca maszyn samojezdnych\"), ale w społeczności rolniczej w pełni ugruntowany wyraz.\n\n**Pozycja na farmie:**\n- **Sezonowa intensywność** — podczas żniw (lipiec–wrzesień) pracuje 12–16 h/dzień, często 7 dni w tygodniu\n- **Poza sezonem** — zazwyczaj traktorzysta, mechanik, konserwator lub wykonuje inną pracę w gospodarstwie\n- **Wynagrodzenie** — w sezonie 50 000–100 000 Kč/mies. (intensywność), poza sezonem 35 000–60 000 Kč/mies. (przelicznik na godziny ~40–60 Kč/h przed opodatkowaniem + uzgodnione premie akordowe)\n\n**Czego oczekuje się od kombajnisty:**\n- **Umiejętności techniczne**:\n  - Ustawienie kombajnu pod daną roślinę (klepisko, sita, wentylator, wysokość hederá)\n  - Konserwacja (smarowanie, kontrola olejów, wymiana noży, pasków)\n  - Diagnostyka usterek (wyświetlacz kombajnu, hydraulika, elektronika)\n  - Połączenie mechanika + kierowcy w jednej osobie\n\n- **Wyczucie agronomiczne**:\n  - Ocena właściwej wilgotności zboża (wilgotnościomierz w kombajnie vs własny osąd)\n  - Optymalna wysokość cięcia (oziminy 12–15 cm, soja 5–8 cm, rzepak 25–35 cm)\n  - Kiedy przerywać (rano we mgle = mokre zboże, wieczorem = stracone godziny)\n  - Reakcja na wyleganie zboża (zmniejszyć prędkość, opuścić heder)\n\n- **Logistyka**:\n  - Koordynacja z odbiorem (przyczepa musi być przy kombajnie, gdy zbiornik pełny)\n  - Komunikacja z kierownikiem fermy przez krótkofalówkę\n  - Planowanie przejść między polami\n\n- **Wytrzymałość**:\n  - Sezon zaczyna się ozimą pszenicą (połowa lipca)\n  - Kontynuuje rzepak, jęczmień\n  - Szczyty w sierpniu — kukurydza, słonecznik\n  - Koniec we wrześniu — soja, słonecznik\n  - **Łącznie 6–10 tygodni z minimum wolnego**\n\n**„Wielki kombajnista\" vs „zwykły kombajnista\":**\n\nW hierarchii zawodowej dużych farm istnieje nieformalne rozróżnienie:\n- **„Wielki kombajnista\"** = kierowca top techniki (Claas Lexion 8900, John Deere S790). Ma największą odpowiedzialność, najlepsze wynagrodzenie. Często wieloletnie doświadczenie.\n- **„Zwykły kombajnista\"** = pozycja juniorska, prowadzi starszy kombajn (Claas Lexion 600 z 2010, Case IH Axial-Flow 7240 starszy). Uczy się. Pod nadzorem.\n\n**Żargon:**\n- **„Zakorkować / spalić / przeładować klepisko\"** — nadmiar zboża zapycha klepisko, kombajn się zatrzymuje\n- **„Wypluć\"** — wyrzucić nadmiar nieomłóconej słomy (np. z powodu wilgotności)\n- **„Żyć na kiełbasie\"** — podczas żniw kombajnista nie ma czasu na regularne posiłki, żyje z kiełbas i piwa\n- **„Być w zbiorniku\"** — kombajn ma pełny zbiornik (8–13 m³), czeka na przyczepę\n- **„Bawić się w konia\"** — wykonywać długi transport kombajnu po drodze między farmami\n- **„Pada zielone\"** (= procenty wilgotności) — zboże zbyt wilgotne do omłotu (>15 %)\n\n**Specyfika CZ (2024):**\n- **Zagraniczni kombajniści** — wiele farm zatrudnia zagranicznych kierowców (słowackich, polskich, rumuńskich) tylko na sezon. Zakwaterowanie na fermie.\n- **Fakty sezonowe**: ok. 3 500 kombajnów w eksploatacji, 1 sezon 2,8 mln ha zboża, średnio 800 ha/kombajn/sezon.\n- **Reprezentacja płci**: 99 % mężczyźni. W ciągu ostatnich 5 lat powolny wzrost kobiet-kombajnistek (zwłaszcza młode pokolenie, agronomki).\n\n**Slangowy synonim** w polskim rolnictwie: *kombajnista*. W krajach niemieckojęzycznych: *Mähdrescherführer*. W świecie anglosaskim: *combine operator* (lub po prostu „farmer running the combine\").\n\nZob. też [[traktorista]], [[kombajn-trida]], [[rotor-kombajn]], [[zne]], [[header]].",
    "alias": [
      "kombajnista",
      "kierowca kombajnu",
      "żniwiarz"
    ],
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
    "term": "Traktorzysta",
    "kategorie": "slang",
    "shortDef": "Traktorzysta to potoczne określenie kierowcy ciągnika rolniczego. Najstarsza i najbardziej typowa profesja zmechanizowanego rolnictwa. Dziś „uniwersalny\" — orze, sieje, nawozi, opryskuje, przewozi. Ścieżka zawodowa może prowadzić aż do kierownika mechanizacji.",
    "longDef": "Traktorzysta to **potoczne określenie kierowcy ciągnika rolniczego**. Zawód powstał wraz z nadejściem mechanizacji rolnictwa w latach 20. XX wieku i stał się **kluczową pozycją wiejskiej pracy** w Czechosłowacji, późniejszej CSRS i dzisiejszej CZ.\n\n**Co robi traktorzysta:**\n\n**Prace polowe** (wiosna–jesień):\n- **Orka** (pług, agregat uprawowy, głęboki spulchniacz dłutowy) — zob. [[orba]], [[pluh]]\n- **Siew** (siewnik, kombinacja siewna) — zob. [[ozim-jarin]]\n- **Nawożenie** (rozsiewacz, opryskiwacz) — zob. [[npk-hnojivo]]\n- **Oprysk** (opryskiwacz) — zob. [[roundup]]\n- **Zbiór** (sieczkarnia we współpracy z kombajnem, prasa, zwijarka)\n- **Słomowanie i balotowanie** — zob. [[siloky-balik]]\n- **Kalkulacje paszowe** — wożenie kiszonki na silos\n\n**Prace zimowe**:\n- **Odśnieżanie** (pług śnieżny na ciągnik)\n- **Rozdrabnianie** (rozdrabniacz gałęzi, ręba) — biopaliwa\n- **Transport** (gnojówka, obornik, słoma) — ciągły przez cały rok\n- **Konserwacja maszyn** — naprawy, malowanie, obsługa\n\n**Hierarchia traktorzysty:**\n\n**1. „Młody chłopak przy ciągniku\"** (junior):\n- Świeży pracownik, wiek 18–25 lat\n- Zaczyna na **mniejszym ciągniku** (Zetor 5xxx, John Deere 6100 itp.)\n- Praca: usuwanie obornika, proste przewozy, konserwacja\n- Wynagrodzenie: 25 000–35 000 Kč/mies.\n\n**2. „Doświadczony traktorzysta\"** (regular):\n- 3–10 lat doświadczenia\n- Prowadzi **średni ciągnik** (90–150 koni)\n- Uniwersalny — orze, sieje, opryskuje\n- Wynagrodzenie: 35 000–55 000 Kč/mies.\n\n**3. „Szef-traktorzysta\"** (senior, główny traktorzysta):\n- 10+ lat, pełne doświadczenie\n- **Top maszyna farmy** (Fendt 728, JD 7R 250 itp.)\n- Planuje prace sezonowe, szkoli młodszych\n- Często także mechanik (potrafi doradzić przy diagnostyce)\n- Wynagrodzenie: 55 000–75 000 Kč/mies.\n\n**4. „Kierownik mechanizacji\"** (manager):\n- Były senior traktorzysta lub agronom\n- Planuje zakupy, obsługę, ubezpieczenie sprzętu\n- Kieruje innymi traktorzystami\n- Wynagrodzenie: 70 000–110 000 Kč/mies.\n\n**Specyfika różnych typów farm:**\n\n**Duże gospodarstwo rolne** (1 000+ ha):\n- 8–15 traktorzystów\n- **Specjalizacja** — ktoś tylko opryskuje, ktoś tylko sieje, ktoś tylko wozi gnojówkę\n- Hierarchiczna organizacja, codzienne odprawy\n\n**Średniej wielkości gospodarstwo** (200–500 ha):\n- 2–4 traktorzystów\n- **Uniwersałowie** — każdy potrafi wszystko\n- Rodzinna atmosfera, nieformalna\n\n**Małe rodzinne gospodarstwo** (50–200 ha):\n- Często tylko właściciel + 1 traktorzysta (członek rodziny)\n- Multitasking, wszystko w 1 osobie\n\n**Technologie i wymagania 2024:**\n\nNowoczesny ciągnik (Fendt 728, JD 7R, Massey 8S) ma więcej wyświetlaczy niż samochód:\n- **GPS-RTK** auto-steering (precyzja 2 cm)\n- **Telematyka** (dane w czasie rzeczywistym do centrali)\n- **ISOBUS** komunikacja z maszynami\n- **Variable rate** aplikacja nawozów według map\n- **Yield monitoring** — połączenie z danymi z kombajnu\n\nTraktorzysta 2024 musi umieć:\n- Klasyczne rzemiosło (mechanika, hydraulika)\n- + umiejętności cyfrowe (czytać wyświetlacze, kalibrować czujniki, rozwiązywać błędy oprogramowania)\n- + agronomiczne podejmowanie decyzji (kiedy przerywać pracę z powodu pogody, jak ustawić dawkę aplikacyjną)\n\n**„Problem pokoleniowy\":**\n- Większość traktorzystów 50+ lat (= „stara szkoła\", manualny zmysł)\n- **Młodzi zgłaszają się mało** — wizerunek „brudnej\" pracy, sezonowa intensywność, wiejskie życie\n- Farmy rozwiązują to **napływem ze Słowacji, Polski, Ukrainy, Rumunii**\n- **Robotyzacja** (autonomiczny ciągnik Bednar, Fendt Xaver) jest obiecująca, ale do 2030 mogłaby zastąpić 30–50 % manualnych czynności\n\n**Żargon:**\n- **„Szlajać\"** — orać (od deptania na pedał)\n- **„Lupnąć\"** — nagle się zatrzymać, opaść (często z powodu awarii)\n- **„Spadochron\"** — kombajn (od slangowego „wpaść do klepisza\")\n- **„Wolniutko wolniutko\"** — trochę potoczne („powoli powoli\")\n- **„Kobyłka\"** — slangowe dla najmniejszego ciągnika w flocie\n- **„Maszyna\"** — dowolny ciągnik w ogóle\n- **„Szarawy\"** — Zetor stara seria (slang z lat 70., dziś już nieużywane)\n\n**Kultura ludzka:**\n- **„Babcine opowieści o traktorzystach\"** (1968 J. Vodňanský) — kult w ludowym humorze\n- **„Wieś ma swojego traktorzystę\"** (1973 J. Menzel) — film społeczny z epoki JZD\n- **Pieśni ludowe**: „Pada kosa, pada / gdy traktorzysta bez reguły\" (lata 50.)\n\nZob. też [[kombajner]], [[cvt-prevodovka]], [[orba]], [[autonomni-traktor]], [[gps-rtk]].",
    "alias": [
      "kierowca ciągnika",
      "agro kierowca"
    ],
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
    "term": "Śrutownik",
    "kategorie": "slang",
    "shortDef": "Śrutownik to maszyna do rozdrabniania zboża, kukurydzy i roślin strączkowych na grubą śrutę paszową dla bydła. Historycznie napędzany kieratem lub lokomobilą, dziś elektryczny. Kluczowe wyposażenie każdego gospodarstwa z własną produkcją pasz.",
    "longDef": "Śrutownik (od słowa *śruta* — rozdrobnione zboże) to **maszyna do rozdrabniania zboża, kukurydzy i roślin strączkowych** (soja, groch, łubin) na **grubą śrutę** przeznaczoną jako pasza dla bydła, świń i drobiu. Bez śrutowania zwierzęta nie byłyby w stanie wykorzystać większości ziarna (niestrawione całe ziarna przechodziłyby przez przewód pokarmowy).\n\n**Zasada działania:**\n\n**1. Śrutownik walcowy (gniotownik):**\n- Dwa **chropowate metalowe walce** obracające się naprzeciw siebie\n- Ziarno wchodzi między nie, jest **gniecione i rozdrabniane**\n- Końcowa wielkość: okruchy 1–5 mm (vs całe ziarno 5–10 mm)\n- Regulacja przez **szczelinę między walcami** + prędkość\n\n**2. Śrutownik bijakowy (hammer mill):**\n- **Rotor z bijakami** (prędkość 3 000–4 500 obr/min)\n- Kruszy ziarno o metalowe sita (perforacja)\n- Wynik: drobniejsza śruta (0,5–3 mm), więcej pyłu\n- Bardziej odpowiedni dla **świń** (tradycyjnie preferują drobniejszą)\n\n**3. Śrutownik tarczowy:**\n- Mniej powszechny, do specjalnych zastosowań\n\n**Śrutowane ziarna — dlaczego:**\n\n**Dla bydła:**\n- Całe ziarna pszenicy / kukurydzy **przechodzą** przez przewód pokarmowy bez wykorzystania → 30–40 % strat\n- Śrutowanie zwiększa **strawność** o 20–30 %\n- Zbyt drobna śruta u bydła = ryzyko **kwasicy żwacza** (szybka fermentacja skrobi do kwasów)\n- **Optimum**: gruba śruta 2–4 mm = zrównoważona strawność + struktura\n\n**Dla świń:**\n- Strawność znacznie bardziej wrażliwa (prosty żołądek)\n- Drobniejsza śruta (0,8–2 mm) bardziej wskazana\n- Ryzyko **wrzodów żołądka** przy zbyt drobnej (< 0,5 mm) = powrót do grubszej frakcji\n\n**Dla drobiu (kurczaki, brojlery, kury):**\n- Grysik (krótkie ziarnka 1–3 mm) LUB granulowanie\n- Drobny pył (< 0,5 mm) drób odrzuca (skleja się z dziobem)\n\n**Dla koni:**\n- Śrutowane ziarna (śruta owsiana, śruta jęczmienna)\n- Gruba konsystencja = powolna fermentacja, mniejsze ryzyko kolek\n\n**Historia:**\n\n**Śrutownik na kieracie** (1800–1900) — patrz [[zentour]]:\n- Napęd: 1–2 konie chodzące w kółko\n- Wydajność: 50–150 kg śruty/h\n- W każdym większym gospodarstwie\n\n**Parowa lokomobila** (1880–1950):\n- Wędrujący śrutownik\n- Przyjeżdżał 1× w miesiącu do wsi, chłopi przywozili zboże do śrutowania\n- Cena za usługę: zazwyczaj 5–10 % ze śrutowanej ilości („mielne\")\n\n**Elektryczny śrutownik** (od 1950):\n- Silnik **3–7,5 kW** + mechanizm walcowy / bijakowy\n- **Małe gospodarstwo**: 800–3 000 kg śruty/h\n- **Dla dużych farm**: 5–20 t/h\n\n**Współczesne typy:**\n\n**Stacjonarny śrutownik** (w gospodarstwie):\n- **Pobór mocy**: 5–22 kW (~25–35 tys. Kč dla małego)\n- **Duży dla farmy**: 30–75 kW (~80–250 tys. Kč)\n- **Czołowe marki CZ**: PS-Strojírny (Letohrad), Sano (Lichnov), DAS (Pardubice)\n- **Czołowe marki EU**: Skiold (DK), Renkum (NL), Romill (CZ-Brno)\n\n**Mobilny śrutownik** (na ciągniku):\n- **Pobór mocy**: z WOM ciągnika, 30–80 kW\n- **Wydajność**: 1–5 t/h\n- **Zastosowanie**: wędrujący śrutownik, kombajny śrutujące (kombajn śrutuje w trakcie jazdy)\n- **Cena**: 80 000–300 000 Kč\n\n**Kombajn śrutujący** (nowszy trend):\n- **Zbiera + śrutuje + składuje** wilgotne ziarno w rękawach do kiszonki\n- **Wilgotne śrutowanie CCM** (Corn-Cob-Mix) — ziarno kukurydzy + kolba kruszone + składowane w rękawie\n- Trend dla **ferm mlecznych** (zastąpienie kupowanego koncentratu)\n\n**Śruta i pasze:**\n\n**Ocena jakości śruty:**\n- **Granulometria** (wielkość cząstek) — Penn State Particle Separator\n- **Wilgotność** (max 14 % do przechowywania, 30+ % do wilgotnego śrutowania CCM)\n- **Temperatura** po śrutowaniu (wyższa u szybkich bijakowych — uwaga na zniszczenie witamin)\n\n**Typowa śruta w gospodarstwie:**\n- **Śruta pszenna**: 50–60 % zbożowego składnika dawki paszowej\n- **Śruta jęczmienna**: substytut pszenicy, tańsza\n- **Śruta kukurydziana**: wysoka energia, niższe białko\n- **Śruta sojowa**: wysokie CP, importowana lub własna produkcja\n- **Śruta grochowa**: krajowa alternatywa białkowa dla SES\n\n**Energetyka i ekonomika:**\n\n**Zużycie energii elektrycznej**:\n- Śrutownik walcowy: 6–12 kWh/t śruty\n- Bijakowy: 10–18 kWh/t śruty\n- **Cena** energii: 6 Kč/kWh × 10 kWh = **60 Kč/t śruty**\n\n**Własne śrutowanie vs kupowane pasze**:\n- **Własna śruta ze zbiorów**: 4 500 Kč/t pszenicy + 60 Kč śrutowanie = **4 560 Kč/t śruty**\n- **Kupowany gotowy koncentrat**: 8 000–12 000 Kč/t\n- **Oszczędność 3 500–7 500 Kč/t** → duże farmy śrutują niemal wszystko\n\n**Użycie slangowe i potoczne:**\n- **„Śrutować\"** — poza zbożem oznacza potocznie „bić\", „mówić zbyt szybko\"\n- **„Śrutownik\"** — slangowo dla „powolnego / przestarzałego komputera\" („ten laptop to śrutownik\")\n- **„Śruta\"** — używana zarówno technicznie (pasza), jak i slangowo\n\nW kulturze: **„Śrutowanie\"** było w literaturze CZS symbolem jesiennej pracy (Karel Čapek, B. Hrabal).\n\nZob. też [[zentour]], [[krmne-davky]], [[kukurice-silazni]], [[grunt]], [[tmr]].",
    "alias": [
      "maszyna do śrutowania",
      "gniotownik zboża",
      "śrutownik paszowy"
    ],
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
    "term": "Ziemniak (kartofel)",
    "kategorie": "slang",
    "shortDef": "Ziemniak to potoczna / gwarowa nazwa dla rośliny Solanum tuberosum. W języku polskim istnieją regionalne warianty: ziemniak (standard PL), kartofel (Wielkopolska, Śląsk), pyra (Poznańskie), bulba (Podkarpacie, wschodnia Polska).",
    "longDef": "Ziemniak (ludowo *kartofel*, *pyra*, *bulba*) to **potoczna i gwarowa nazwa dla ziemniaka** — *Solanum tuberosum* — jednoroczna roślina bulwiastea z rodziny psiankowatych. W języku polskim ziemniak ma dziesiątki regionalnych synonimów, co świadczy o **historycznym znaczeniu rośliny uprawnej** w różnych regionach polskich.\n\n**Regionalne warianty:**\n\n- **Ziemniak** — standard PL, ogólnopolski. Z „ziemia\" + zdrobnienie.\n- **Kartofel** — Wielkopolska, Śląsk, zachodnia Polska. Z niemieckiego *Kartoffel*.\n- **Pyra** — Poznańskie, Wielkopolska. Charakterystyczna gwara poznańska.\n- **Bulba** — Podkarpacie, wschodnia Polska (wpływy ukraińskie).\n- **Grula** — Małopolska, okolice Krakowa.\n- **Kłęby** — Mazowsze, okolice Warszawy (staropolskie).\n- **Rzepa** — użycie potoczne w niektórych regionach (mylone z rzeką).\n- **Barabola** — Kresowiacy, wschodniopolskie dialekty.\n- **Kompery** — Podlaskie.\n- **Bandurka** — Lubelszczyznę, wschód Polski.\n\n**Historia w ziemiach polskich:**\n\n**1700s — przybycie ziemniaka:**\n- Ziemniaki docierają na ziemie polskie przez Wiedeń (Austria) i Saksonię\n- Pierwsze uprawy w **ogrodach klasztornych** i u szlachty\n- Chłopi długo się opierali — bali się „diabelskiej rośliny\" (jad psiankowatych, zielone bulwy zawierają solaninę)\n\n**1770–1772 — Wielki głód:**\n- Tradycyjne zboże zawodziło wielokrotnie\n- **Władze zarządziły obowiązkowe uprawy ziemniaków** (1771)\n- Ziemniak uratował dziesiątki tysięcy chłopów przed śmiercią\n- Od tamtej pory na stałe zakorzeniony w polskiej kuchni\n\n**1800–1860 — era rozkwitu:**\n- Ziemniaki stają się **podstawowym pożywieniem wsi** (biedoty)\n- „Ziemniak z mlekiem\" — typowe danie\n- Powstanie **obszarów ziemniaczanych** (Podkarpacie, Beskidy, Mazury)\n\n**1860+ — hodowla świń i gorzelnie:**\n- Ziemniaki do **karmienia świń** (tuczone ziemniakami)\n- **Gorzelnie** przetwarzają skrobię ziemniaczaną na etanol (wódka, leki, chemia)\n- Powstanie **tradycji ziemniaczarskich** (Podkarpacie, Lubelszczyzna)\n\n**Uprawa w PL (2024):**\n\n**Powierzchnia**: ~270 000 ha (trend malejący, ze ~700 000 ha w latach 90.)\n**Plony**: 26–35 t/ha (wczesne), 35–55 t/ha (późne przemysłowe)\n**Produkcja**: ~7 000 000 t/rok\n\n**Główne kategorie**:\n1. **Ziemniaki jadalne** (wczesne, czerwone, niebieskie, żółte) — supermarkety\n2. **Ziemniaki sadzeniakowe** (certyfikowany materiał siewny na kolejne pokolenie) — wyższa cena\n3. **Ziemniaki przemysłowe** (gorzelnie, skrobiownie, fabryki frytek) — kontrakty\n4. **Ziemniaki paszowe** (dla świń, dziś rzadziej)\n\n**Kluczowe rejony uprawy**:\n- **Podkarpacie** (Rzeszowskie, Przemyskie) — wyższa wysokość, wyrównany plon\n- **Nizina Podlaska** (Białostockie) — wczesne odmiany\n- **Podgórze Sudeckie** — jakościowy materiał sadzeniakowy\n- **Wielkopolska** — historycznie ziemniaczarski region\n\n**Czołowe odmiany PL**:\n- **Denar** (wczesna)\n- **Lord** (wczesna, żółta)\n- **Irga** (średnio późna, żółta)\n- **Saturna** (przemysłowa, plony 50+ t/ha)\n- **Jelly** (późna, jadalna, wysoka jakość)\n- **Vineta** (sadzeniakowa)\n\n**Agrotechnika:**\n- **Sadzenie** sadzeniakami (10–25 cm głębokości, rozstawa 75 × 30 cm), marzec–maj\n- **Nawożenie**: 80–120 kg N/ha + 60–80 P + 120–160 K\n- **Opryski**: przeciw zarazie (oomycet), stonka ziemniaczana (Colorado beetle)\n- **Zbiór**: kopaczka ziemniaków — wrzesień–październik\n- **Przechowywanie**: chłodne, suche 4–8 °C, wilgotność 90 %\n\n**Choroby i szkodniki**:\n- **Zaraza ziemniaka** (Phytophthora infestans) — historycznie spowodowała Wielki głód irlandzki 1845\n- **Stonka ziemniaczana** — inwazyjna z USA (1922 pierwszy stwierdzony przypadek)\n- **Mątwik ziemniaczany** — kwarantannowy czynnik szkodliwy\n\n**Ekonomika 2024**:\n- **Cena jadalna (supermarket)**: 1,5–4 zł/kg\n- **Cena od producenta**: 0,5–1,2 zł/kg\n- **Marża handlowa**: 200–400 % (między producentem a półką)\n- **Cena przemysłowa**: 0,3–0,6 zł/kg (gorzelnie, skrobia)\n\n**Malejąca powierzchnia**:\n- 1990: ~700 000 ha\n- 2010: ~380 000 ha\n- 2024: ~270 000 ha\n- **Przyczyny**: import (NL, DE, FR), niska cena importu, wysokie koszty mechanizacji, choroby (zaraza)\n\n**Rola slangowa i kulturowa:**\n\n- **„Ziemniaki\"** — slangowo dla „proste jedzenie\" („mam w domu tylko ziemniaki i mleko\")\n- **„Ziemniak\"** — pejoratywne dla niezdarnej osoby („jesteś ziemniakiem\", „ziemniaczane ciało\")\n- **„Sałatka ziemniaczana\"** — symbol Świąt Bożego Narodzenia w polskiej kuchni\n- **„Zupa ziemniaczana\"** (kartoflanká) — ubogie chłopskie jedzenie wyniesione do rangi dania regionalnego\n- **„Gorący kartofel\"** — w slangu dla kłopotliwej sprawy, której nikt nie chce tknąć (= hot potato)\n\n**Porzekadła ludowe:**\n- „Gdy ziemniak kwitnie na św. Wawrzyńca (10.08.), nie będzie urodzaju\" (= późne kwitnienie = małe bulwy)\n- „Mokły czerwiec, ziemniak poszedł pod wodę\" (= za dużo deszczu = zaraza)\n\nW kulturze: **„Bajki ziemniaczane\"**, **„Dni ziemniaka\"** (regionalne festiwale), **„Podkarpackie święto ziemniaka\"** (corocznie).\n\nZob. też [[ozim-jarin]], [[osevni-postup]], [[npk-hnojivo]], [[roundup]], [[plisen-bramborova]], [[mandelinka-bramborova]].",
    "alias": [
      "kartofel",
      "pyra",
      "bulba",
      "ziemniak"
    ],
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
    "term": "Zaraza ziemniaka",
    "kategorie": "ochrana",
    "shortDef": "Zaraza ziemniaka (Phytophthora infestans) to choroba grzybopodobna ziemniaków i pomidorów. Spowodowała irlandzki głód 1845–1849. Dziś najgroźniejsza choroba ziemniaka — bez fungicydów utrata 50–100 % plonu w ciągu 14 dni.",
    "longDef": "Zaraza ziemniaka (łac. *Phytophthora infestans*, ang. *late blight*, „zaraza późna\") to **oomycet** (nie prawdziwy grzyb — należy do lęgniowców / Stramenopila) powodujący najważniejszą chorobę **ziemniaka** i **pomidora**. Historycznie spowodowała **Wielki głód irlandzki** 1845–1849 (1 milion ofiar, 1 milion emigrantów).\n\n**Historia:**\n- **1840s** — patogen po raz pierwszy zaobserwowany w Belgii, Holandii\n- **1845–1849** — Głód irlandzki. Ziemniaki stanowiły 80 % pożywienia ubogich irlandzkich chłopów. Patogen zniszczył zbiory 3 lata z rzędu.\n- **1882** — Francuz Pierre Marie Alexis Millardet odkrywa **ciecz bordoską** (CuSO₄ + Ca(OH)₂) w Médoc — przypadkowo, jako prewencję przeciw złodziejom winorośli. Pierwszy historyczny fungicyd.\n- **XX wiek** — stopniowy rozwój systemicznych fungicydów (mankozeb, metalaksyl, cymoksanil)\n- **2000s** — agresywny typ krzyżowania A2 z Meksyku inwaduje EU — patogen rozmnaża się płciowo → oospory w glebie → trwałość\n\n**Cykl życiowy:**\n1. **Zimowanie**: w bulwach ziemniaka (sadzeniakach), kompostach, martwych roślinach\n2. **Sporulacja**: rano podczas rosy (wilgoć + 10–25 °C) → sporangia\n3. **Rozprzestrzenianie**: powietrze (sporangia lecą dziesiątki km), woda (zoospory pływają w rosie)\n4. **Infekcja**: penetracja przez aparaty szparkowe lub przez ranki, objawy 3–5 dni po infekcji\n5. **Cykl wtórny**: za 4–7 dni kolejna sporulacja → epidemia\n\n**Objawy:**\n- **Liście**: ciemne brązowo-czarne nekrozy, często z **białym, pleśniowym brzegiem** na spodzie (sporulacja)\n- **Łodygi**: ciemne plamy, później okrągłe gnilne zmiany\n- **Bulwy**: brązowe plamy na powierzchni → wewnątrz brązowa/czerwona zgnilizna (często wtórnie bakteryjna mokra gnilizna)\n- **Pomidory**: tak samo — brązowe plamy, sporulacja, gnicie owoców\n\n**Ryzyko i ostrzeżenia:**\n- **Wilgoć + ciepło** (RH > 90 %, T 10–25 °C) → wysokie ryzyko\n- **Systemy modelowania** (Smith Period, NegFry, BlightCAST) — prognoza infekcji 1–3 dni naprzód\n- **PL ostrzeżenia**: Państwowa Inspekcja Ochrony Roślin i Nasiennictwa (PIORiN) + komercyjne (BIRTeam, Bayer FieldView)\n\n**Zwalczanie — fungicydy:**\n\n**Prewencyjne (kontaktowe)**:\n- **Mankozeb** (Dithane, Penncozeb) — biały proszek, działanie 7–10 dni. **Planowany zakaz w EU** od 2024 (potencjalnie rakotwórczy)\n- **Cymoksanil** — bardzo skuteczny, krótkie działanie (2–3 dni)\n- **Miedź** (CuSO₄, wodorotlenek Cu) — bio i konwencjonalne. **Limit 4 kg Cu/ha/rok** w EU\n- **Folpet** — alternatywa dla mankozebu\n\n**Systemiczne (lokalnio systemiczne)**:\n- **Metalaksyl, Metalaksyl-M** (Ridomil) — fenyloamid, bardzo skuteczny. Ryzyko odporności (problem od lat 90.)\n- **Mandipropamid** (Revus) — fungicyd CAA, szczyt lat 2020.\n- **Cymoksanil + Mankozeb** kombinacja (Curzate)\n- **Fluazinam** (Shirlan) — prewencyjny, długa trwałość\n- **Pirimetanil** — skomplikowane stosowanie\n\n**Kalendarz oprysków** (intensywny ziemniak, 2024 EU):\n- **Kiełkowanie**: żaden oprysk\n- **Porost 5–10 cm**: 1. prewencja (mankozeb lub Cu)\n- **Przed zwarciem rzędów**: 2. (cymoksanil/metalaksyl)\n- **Kwitnienie**: 3.–4. oprysk (mandipropamid)\n- **Tworzenie bulw**: 5.–7. oprysk (prewencyjny co 7–10 dni)\n- **Przed zbiorem**: 8. desykacyjny (alternatywa Reglone)\n- **Łącznie**: 7–10 oprysków/sezon, **koszty 4 000–7 000 Kč/ha**\n\n**Odporne odmiany:**\n- **Sárka, Adéla, Marabel** — średnio tolerancyjne\n- **Sárpo Mira** — wysoka odporność, nadaje się dla biogospodarstw\n- **Bionica, Toluca** — nowoczesne odporne hybrydy\n- **Odporność nie jest 100 %** — nawet tolerancyjne odmiany potrzebują 3–5 oprysków w ryzykownym sezonie\n\n**Podejście ekologiczne:**\n- Tylko **miedź** (Cu — patrz wyżej, limit 4 kg/ha/rok)\n- **Ciecz bordoska** (klasyczna, tania, mieszana ręcznie)\n- **Biostymulatory** (krzemian potasu, wyciągi z pokrzywy) — marginalny efekt\n- **Odporne odmiany** + krótki cykl wegetacyjny (wczesny zbiór)\n\n**Po infekcji:**\n- **Nie ma leczenia** — prewencyjne fungicydy stosuje się PRZED infekcją\n- **Po pierwszych objawach** → lokalne „wypalanie\" (zniszczyć zainfekowane rośliny mechanicznie/chemicznie)\n- **Zebrane ziemniaki** → sortować (żadnych zaatakowanych do magazynu, ryzyko gnicia całego magazynu)\n\n**W PL 2024**: straty z powodu zarazy ziemniaka ~5–15 % plonu pomimo intensywnych oprysków. Bez oprysków 50–100 % strat.\n\nZob. też [[roundup]], [[fungicidy]], [[zemak]], [[ozim-jarin]], [[osevni-postup]], [[mez]].",
    "alias": [
      "Phytophthora infestans",
      "late blight",
      "zaraza późna"
    ],
    "related": [
      "fungicidy",
      "zemak",
      "mandelinka-bramborova",
      "desikace"
    ]
  },
  {
    "slug": "fuzarioza",
    "term": "Fuzarioza kłosów",
    "kategorie": "ochrana",
    "shortDef": "Fuzarioza kłosów (Fusarium spp.) to choroba grzybowa zbóż (pszenica, jęczmień) atakująca kłosy. Produkuje mykotoksyny (DON, ZEA, T-2) szkodliwe dla ludzi i zwierząt. Standardowy limit UE dla DON w pszenicy = 1,25 mg/kg.",
    "longDef": "Fuzarioza kłosów (ang. *Fusarium Head Blight*, FHB) to **choroba grzybowa zbóż** spowodowana kompleksem gatunków rodzaju *Fusarium* (*F. graminearum, F. culmorum, F. avenaceum, F. poae*). Atakuje przede wszystkim **pszenicę, jęczmień, żyto, owies, kukurydzę**. Kluczowy problem: **mykotoksyny**.\n\n**Gatunki i mykotoksyny:**\n\n| Gatunek | Główna mykotoksyna | Działanie |\n|---------|--------------------|-----------|\n| **F. graminearum** | DON (deoksyniwalenol) | Immunosupresyjne, żołądkowo-jelitowe |\n| **F. graminearum** | ZEA (zearalenon) | Estrogenne (problem u świń) |\n| **F. culmorum** | DON, ZEA, NIV | Podobne |\n| **F. poae** | NIV (niwalenol), T-2 | Wysoce toksyczny (T-2 = środek bojowy) |\n| **F. avenaceum** | Moniliformin, ENN | Kardiotoksyczny |\n| **F. verticillioides** (kukurydza) | Fumonizyny | Rakotwórcze, neurologiczne |\n\n**Limity UE dla mykotoksyn** (Rozporządzenie 1881/2006 + rewizja 2023):\n- **DON**: pszenica/jęczmień do konsumpcji 1,25 mg/kg, pasza 8 mg/kg\n- **ZEA**: pszenica 100 µg/kg, kukurydza 350 µg/kg\n- **Fumonizyny**: kukurydza 4 000 µg/kg\n- **Aflatoksyny** (inny rodzaj *Aspergillus*): 4 µg/kg max\n\n**Objawy:**\n- **Kłoski wybieliałe** (przedwcześnie dojrzewają) — kontrast ze zdrowymi zielonymi\n- **Różowo-pomarańczowa sporulacja** na kłosie przy wilgoci\n- **Ziarno sczerniałe, „różowawe\"** (\"tombstone kernels\", *piepsy*)\n- **Test po zbiorze**: laboratorium ilościowo oznacza DON metodą ELISA lub HPLC\n\n**Czynniki ryzyka:**\n- **Przedplon kukurydza** — *F. graminearum* zimuje w resztkach kukurydzy\n- **Siew bezorkowy** + resztkowa słoma kukurydzy = wysokie ryzyko\n- **Wilgoć + ciepło** (15–25 °C, deszcz 24–48 h) **podczas kwitnienia pszenicy** (BBCH 61–69, połowa maja do połowy czerwca)\n- **Gęste łany** (utrudniona wentylacja kłosów)\n\n**Zwalczanie — chemiczne:**\n\n**Kluczowy moment — oprysk w czasie kwitnienia (BBCH 63–67)**:\n- **Triazole**: protiokonazol (Prosaro, Caramba), tebukonazol, metkonazol\n- **SDHI** (Inatreq): fluksapyroksad, biksafen — nowoczesna generacja\n- **Strobiluryny**: azoksystrobina (NIE zalecana dla FHB — niektóre gatunki F. zwiększają DON!)\n- **Kombinacja** SDHI + triazol = złoty standard lat 2020.\n- **Aplikacja**: 200–400 l wody/ha, drobne rozpylenie, **timing krytyczny** (kwitnące kłosy)\n\n**Skuteczność oprysku:**\n- **Optimalny timing**: -40 % DON, -50 % FHB\n- **Za późno**: +10 % efekt na DON\n- **Za wcześnie (przed kwitnieniem)**: 0 efektu\n- **Konieczne monitorowanie** stadium wegetacji, nie daty\n\n**Zwalczanie — agrotechniczne:**\n- **Przedplon**: po kukurydzy **NIE SIAĆ pszenicy**. Lepiej: rzepak → pszenica lub roślina strączkowa → pszenica.\n- **Uprawa gleby**: orka przykrywa reszki *Fusarium*, zmniejsza inokulum o 50–80 %. **Siew bezorkowy + kukurydza = najgorsza kombinacja**.\n- **Odporne odmiany**: częściowa tolerancja (nigdy 100%). Sumai 3 (CN) = donor genu Fhb1, stosowany w hodowli EU.\n- **Gęstość łanu**: 350–450 kłosów/m² (wyższa = wyższe ryzyko)\n- **Nawożenie**: wysokie N nie zwiększa FHB wyraźnie, ale wydłuża kwitnienie = większe okno infekcji\n- **Odporność**: model BBCH + dane meteo + stacje pogodowe = system wczesnego ostrzegania\n\n**Zbiór i obróbka pozbiorowa:**\n- **Wczesny kombajn** zaatakowanego łanu — mniej czasu na dalszą sporulację\n- **Wyższa wilgotność przy zbiorze** (15–20 %) → natychmiast suszyć poniżej 13 %\n- **Czyszczenie** — *ziarno fuzaryjne jest lżejsze*, można je oddzielić czyszczalnią air-screen (utrata 5–15 % masy, ale DON spada o 50–80 %)\n- **Magazynowanie** w suchu i chłodzie (< 14 % wilgotność, < 15 °C) — *Fusarium* dalej nie rośnie\n\n**Wpływ ekonomiczny:**\n- **Cena skażonego zboża**: skupujący przyjmuje z 30–50 % potrąceniem lub odrzuca (paszowe = niższa cena, niespełnienie limitów młynarskich)\n- **Koszty oprysku FHB**: 800–1 500 Kč/ha (1 aplikacja)\n- **Utrata plonu**: 10–30 % przy porażeniu\n- **PL 2024**: ok. 20–30 % zbiorów pszenicy w „ryzyku FHB\" w niektórych latach\n\n**Zdrowie ludzi:**\n- **Ostre zatrucie** wysokimi dawkami DON: nudności, wymioty, gorzki smak w ustach\n- **Przewlekła ekspozycja**: immunosupresja, zahamowanie wzrostu u dzieci\n- **ZEA**: zaburzenia hormonalne (estrogenne), problem dla świń\n\n**Pasze dla zwierząt:**\n- **Świnie** bardzo wrażliwe (limit DON 0,9 mg/kg paszy)\n- **Bydło** mniej wrażliwe (5 mg DON/kg paszy)\n- **Drób** średnio wrażliwy (2 mg DON/kg)\n- **Sorbenty mykotoksyn** (bentonity, ściany komórkowe drożdży glukomannanowe) — kompensacja w paszy dla wiązania toksyn w przewodzie pokarmowym\n\n**W PL badania**: IUNG-PIB Puławy, SGGW Warszawa — selekcja odpornych odmian, modele predykcyjne.\n\nZob. też [[fungicidy]], [[ozim-jarin]], [[osevni-postup]], [[no-till]], [[kukurice-silazni]], [[hektolitr]].",
    "alias": [
      "Fusarium head blight",
      "FHB",
      "fuzarioza kłosowa",
      "Fusarium graminearum"
    ],
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
    "term": "Septorioza",
    "kategorie": "ochrana",
    "shortDef": "Septorioza (Zymoseptoria tritici, dawniej Septoria tritici) to najważniejsza grzybowa choroba liści pszenicy w Europie. Zmniejsza plon o 30–50 % bez ochrony fungicydami. Kluczowy powód stosowania fungicydów na pszenicy w Europie.",
    "longDef": "Septorioza pszenicy (*Zymoseptoria tritici*, dawniej *Septoria tritici* lub *Mycosphaerella graminicola*, ang. *Septoria tritici blotch*, STB) to **dominująca choroba liściowa pszenicy w zachodniej i środkowej Europie**. W PL jest głównym powodem stosowania fungicydów na pszenicy — bez oprysku 30–50 % strat plonu.\n\n**Cykl życiowy:**\n1. **Zimowanie**: na resztkach roślinnych pszenicy (słoma) lub na pszenicy ozimej jesienią\n2. **Rozprzestrzenianie jesienią** (ozima): deszcz rozprzestrzenia **piknokonidy** na liście. Łagodne temperatury + deszcz = idealne.\n3. **Faza latentna**: 14–28 dni (łagodna zima → infekcja niewidoczna)\n4. **Objawy wiosną**: żółtawe plamy z drobnymi czarnymi kropkami (piknidy)\n5. **Szerzenie się w górę**: zarodniki lecą z deszczem w górę, stopniowo atakując wyższe liście (liść flagowy — jest najcenniejszy, dostarcza 60 % asymilatów do ziarna)\n6. **Cykl wtórny**: nowy deszcz = nowe sporulacje = nowa infekcja\n\n**Objawy:**\n- **Żółte → brązowe** nieregularne plamy na liściach\n- **Charakterystyczne**: drobne **czarne piknidy** w obrębie zmiany (dużo kropek na 1 cm²)\n- **Postęp od dołu do góry**: dolne liście dotknięte najpierw, stopniowo w górę\n- **Najbardziej szkodliwe porażenie liścia flagowego** (F0) i F-1 — 60 % plonu zależy od nich\n\n**Czynniki ryzyka:**\n- **Wczesny siew oziminy** (przed 15 września) → większa infekcja jesienią\n- **Wilgotna wiosna** (deszcz > 5 mm w ciągu 10 dni) → każdy deszcz = nowa infekcja\n- **Gęste łany** → mikroklimat = wilgoć\n- **Wysokie nawożenie N** → bujny porost\n- **Przedplon pszenica** → inokulum zimuje w słomie (dlatego **NIE SIAĆ pszenicy po pszenicy**)\n- **Siew bezorkowy + słoma na powierzchni** → zachowane inokulum\n\n**Zwalczanie — fungicydy:**\n\n**Kluczowe zabiegi**:\n1. **T0 (BBCH 30–32, wiosna)** — jeśli silne porażenie z jesieni. Tanie, podstawowe.\n2. **T1 (BBCH 32–37)** — ochrona liści przykłosowych. Triazol + SDHI.\n3. **T2 (BBCH 39–49, liść flagowy)** — **NAJWAŻNIEJSZY zabieg**. Liść flagowy musi pozostać zielony.\n4. **T3 (BBCH 60–69, kwitnienie)** — fuzarioza + dojrzewanie. Triazol lub strobiluryな.\n\n**Substancje czynne:**\n- **Triazole (DMI)**: tebukonazol, protiokonazol, metkonazol — główna klasa od 30 lat, **rosnąca odporność**\n- **SDHI**: fluksapyroksad (bixafen), benzowindyflupyr (Solatenol), pydiflumetofen — top wykonawcy lat 2020. Ryzyko odporności (umiarkowane, dotąd pod kontrolą).\n- **Strobiluryny (QoI)**: azoksystrobina (Amistar), piraklostrobina — **dziś praktycznie nieskuteczne na septoriozę** z powodu odporności (mutacja G143A w cytochromie b). Nadal stosowane na inne choroby.\n- **Inatreq active** (fenpikosamid) — nowa klasa, na rynku od 2021+. Jak dotąd niska odporność.\n- **Mefentriflukonazol** (Revysol) — nowy DMI z BASF z lepszą aktywnością na odporne izolaty\n\n**Strategia antyodpornościowa:**\n- **Mieszanie substancji czynnych** zawsze (triazol + SDHI + strobiluryな)\n- **Maksymalnie 1× w sezonie** ta sama substancja czynna\n- **Połączenie z biologią** (Bacillus, Trichoderma — komercyjnie ograniczone dla dużych farm)\n\n**Koszty oprysków:**\n- **T1**: 600–1 200 Kč/ha\n- **T2**: 800–1 500 Kč/ha (liść flagowy — dobra mieszanka)\n- **T3**: 700–1 200 Kč/ha\n- **Całosezonowo**: 2 100–3 900 Kč/ha dla pszenicy\n\n**Opłacalność:**\n- Oprysk T2 oszczędza 1–2 t/ha = 5 000–10 000 Kč/ha → zwrot 4–6×\n- T1 + T3 mniej krytyczne, ale zachowują rezerwę T2\n\n**Agrotechnika (anty-septorioza bez chemii):**\n- **Odporne odmiany**: Bohemia, RGT Sacramento, Arnaud (rynek CZ) — częściowa tolerancja\n- **Późniejszy siew** oziminy (po 30 września) → mniejsza infekcja jesienna\n- **Zmniejszona gęstość łanu** (350 kłosów/m² zamiast 500) → lepsza wentylacja\n- **Zmniejszone nawożenie N** + aplikacja podzielona (podzielić dawkę 2–3× w sezonie)\n- **Przedplon inny niż pszenica** — rzepak, rośliny strączkowe, kukurydza\n- **Orka** przykrywa inokulum (vs siew bezorkowy)\n\n**Zmiana klimatu:**\n- Cieplejsze zimy = więcej zimującego inokulum\n- Wilgotniejsza wiosna = więcej cykli\n- **Przesunięcie areału** — septorioza przesuwa się na północ Europy (SE, DK, UK wzmocnienie lat 2020.)\n\n**W PL badania**: IUNG-PIB Puławy, SGGW — selekcja odpornych linii, monitorowanie wrażliwości na fungicydy.\n\nZob. też [[fuzarioza]], [[rzi]], [[fungicidy]], [[ozim-jarin]], [[osevni-postup]], [[no-till]].",
    "alias": [
      "Zymoseptoria tritici",
      "STB",
      "Septoria tritici blotch",
      "liściowa septorioza pszenicy"
    ],
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
    "term": "Rdze zbóż",
    "kategorie": "ochrana",
    "shortDef": "Rdze to grupa chorób grzybowych zbóż powodowana przez rodzaj Puccinia. Trzy kluczowe: rdza żółta (P. striiformis), rdza brunatna (P. recondita), rdza źdźbłowa (P. graminis). Historycznie dewastujące choroby, dziś kontrolowane fungicydami i odpornością.",
    "longDef": "Rdze zbóż (ang. *rusts*) to grupa **biotroficznych chorób grzybowych** powodowanych przez rodzaj **Puccinia**. Trzy kluczowe gatunki dla PL pszenicy i jęczmienia:\n\n1. **Rdza żółta (pasiasta)** — *Puccinia striiformis* (PST) — agresywna, chłodna/wilgotna\n2. **Rdza brunatna (liściowa)** — *Puccinia recondita / triticina* (PT) — ciepło/susza\n3. **Rdza źdźbłowa (czarna)** — *Puccinia graminis* (PG) — historycznie katastrofalna, dziś rzadka w EU\n\n**Znaczenie historyczne:**\n- **Cesarstwo Rzymskie** — święto *Robigalia* (25 kwietnia) dedykowane walce z rdzą\n- **1880s** — masowe epidemie w USA i EU\n- **1916, 1953** — ogólnoświatowe epidemie rdzy źdźbłowej → impulsy dla cieczy bordoskiej i nowoczesnych fungicydów\n- **1999+** — UG99 (Ug99) — wysoce agresywny szczep rdzy źdźbłowej z Ugandy, rozprzestrzeniający się Afryka → Azja. Zagrożenie dla globalnej produkcji pszenicy.\n- **2010+** — PST Warrior (rdza żółta) — agresywne rasy w EU, przełamanie odporności większości odmian pszenicy\n\n**Objawy:**\n\n**Rdza żółta (*yellow rust*):**\n- **Drobne żółto-pomarańczowe krosty** w długich paskach wzdłuż żyłek liści\n- Optymum: 8–18 °C, wilgoć, rosa\n- **Wczesna w sezonie** (marzec–czerwiec w PL)\n- **Ryzyko**: atakuje oziminę już w zimie (zimuje na liściach)\n\n**Rdza brunatna (*brown/leaf rust*):**\n- **Brązowo-pomarańczowe krosty** pojedynczo lub w skupiskach, okrągłe\n- Optymum: 15–25 °C\n- **Późno w sezonie** (maj–sierpień)\n- **Ryzyko**: uszkadza liść flagowy podczas nalewania ziarna\n\n**Rdza źdźbłowa (*stem rust*):**\n- **Ciemnobrązowe do czarnych** krosty NA ŹDŹBŁACH (nie na liściach)\n- Duże zmiany, często 1×3 cm\n- **Późno** (koniec czerwca–lipiec)\n- **Ryzyko**: uszkadza źdźbło → wyleganie łanu, wyraźne zmniejszenie plonu (-30–80 %)\n\n**Cykl życiowy (złożony — zmieniający żywicieli):**\n- **Główny żywiciel**: pszenica / jęczmień / żyto (stadium uredinia → telia)\n- **Żywiciel poboczny** (reprodukcja płciowa): różny w zależności od gatunku\n  - PST żółta: dawniej uważano że żadnego, dziś wiemy *Berberis spp.* (berberys)\n  - PT brunatna: *Thalictrum spp.* (rdeść — rzadko)\n  - PG źdźbłowa: *Berberis vulgaris* (berberys zwyczajny) — **historycznie wycinany** w USA w celu eradykacji rdzy!\n- **EU/PL**: *Berberis vulgaris* dziś nie jest powszechny → eradykacja w latach 1900. pomogła.\n\n**Zwalczanie — fungicydy:**\n\n**Te same schematy co septorioza** (często łączone zabiegi):\n- **Triazole** — tebukonazol, propikonazol, protiokonazol — skuteczne\n- **Strobiluryny** — piraklostrobina, azoksystrobina — wysoce skuteczne, **odporność w niektórych rasach**\n- **SDHI** — nowoczesne, kombinacja z triazolem\n- **Inatreq active** — nowa klasa 2021+\n- **Timing aplikacji**: tak jak przy STB (T1 + T2 najcenniejsze)\n\n**Koszty**: zawarte w sezonowym oprysku 2 000–4 000 Kč/ha (łączone z opryskiem STB)\n\n**Zwalczanie — odporne odmiany:**\n- **Główne geny odporności** (Lr, Sr, Yr genes) — specyficzne, ale łatwo przełamywane\n- **Wolnordzewiejące**, odpornościowe ilościowe — trwalsze\n- **CIMMYT, ICARDA** — globalna hodowla\n- **Nowoczesne odmiany PL** mają kombinację 3–5 genów odporności (Bohemia, Sailor, Vlasta)\n\n**Odporność patogenów:**\n- **PST Warrior** przełamał Yr17 w 2011 → większość odmian EU wrażliwa\n- **Ug99 rdza czarna** przełamała Sr31, Sr24, Sr36 — agresywna w Afryce\n- **Ciągła walka** hodowli vs ewolucja patogena\n\n**Współpraca międzynarodowa:**\n- **WIN** (Wheat Initiative Network) — globalne śledzenie typów rasowych\n- **Borlaug Global Rust Initiative (BGRI)** — koordynacja walki z Ug99\n- **EPPO** — monitoring EU\n\n**Zmiana klimatu:**\n- Cieplejsze zimy → lepsze zimowanie patogena\n- Późniejsze chłody wiosną → rdze zaczynają się później ale silniej\n- **Pszenica w rejonach północnych** (UK, IE, N-Skandynawia) atakowana regularnie (dawniej rzadziej)\n\n**W PL badania**: IUNG-PIB Puławy (rasy PST, PT), SGGW Warszawa (hodowla odpornościowa).\n\nZob. też [[fuzarioza]], [[septorioza]], [[fungicidy]], [[ozim-jarin]].",
    "alias": [
      "Puccinia",
      "rust",
      "rdza pszeniczna",
      "rdza jęczmienna",
      "rdze"
    ],
    "related": [
      "fuzarioza",
      "septorioza",
      "fungicidy",
      "ozim-jarin"
    ]
  },
  {
    "slug": "mandelinka-bramborova",
    "term": "Stonka ziemniaczana",
    "kategorie": "ochrana",
    "shortDef": "Stonka ziemniaczana (Leptinotarsa decemlineata) to inwazyjny chrząszcz z USA, główny szkodnik ziemniaków w Europie. Dorosłe owady i larwy zjadają liście, bez ochrony 100 % defoliacja = 80 % utrata plonu. W PL od 1937.",
    "longDef": "Stonka ziemniaczana (łac. *Leptinotarsa decemlineata*, ang. *Colorado potato beetle*, CPB) to **inwazyjny chrząszcz** z rodziny *Chrysomelidae*. Pochodzi z **Kolorado (USA)**, dziś główny szkodnik ziemniaków w Europie, Azji i w pierwotnej Ameryce Północnej.\n\n**Historia inwazji:**\n- **1859** — pierwsza masowa epidemia w Kolorado (USA). Wcześniej żyła na dzikich *Solanum* spp.\n- **1875** — inwazja do Nowego Jorku, potem do EU\n- **1937** — pierwszy stwierdzony przypadek w PL (okolice Poznania)\n- **1950s** — DDT użyte po raz pierwszy, krótki triumf, potem odporność\n- **Dziś** — zadomowiona w całej Europie, północnej Azji (Syberia), Japonii, Chinach\n\n**Morfologia:**\n- **Dorosły**: 10 mm, **żółty** z **10 czarnymi paskami** na pokrywach skrzydłowych. Charakterystyczny wygląd.\n- **Jajo**: 1,5 mm, **pomarańczowo-żółte**, składane w skupiskach po 20–60 szt. **na spodniej stronie** liści\n- **Larwa**: 8–15 mm, **czerwono-pomarańczowa** z czarną głową i czarnymi kropkami po bokach. 4 stadia larwalne.\n- **Poczwarka**: w glebie 3–5 cm głębokości\n\n**Cykl życiowy:**\n1. **Zimowanie**: dorosłe w glebie 10–20 cm głębokości (nie zamarzają)\n2. **Wychodzenie**: wiosną przy temperaturach >15 °C (w PL koniec kwietnia–połowa maja)\n3. **Kopulacja i składanie jaj**: dorosłe odnajdują łany ziemniaka, składają 200–400 jaj/samica\n4. **Larwy** (3–4 tygodnie): zjadają liście. **Stadium L4 = największa żarłoczność** (60 % całkowitego uszkodzenia).\n5. **Przepoczwarczenie**: w glebie, 1–2 tygodnie\n6. **Drugie pokolenie** dorosłych: koniec lipca–sierpień\n7. **W klimacie PL**: 1–2 pokolenia rocznie (2. pokolenie tylko w ciepłych latach)\n\n**Objawy uszkodzenia:**\n- **Liście ogryzowane**, często zostają tylko ogonki i żyłki\n- **Defoliacja** może wynosić 100 % w ciągu 7–14 dni bez ochrony\n- **Pełna defoliacja w wegetacji**: -50 do -100 % plonu\n- **Bulwy pozostają nieuszkodzone** (stonka jest szkodnikiem liściowym)\n\n**Zwalczanie — chemiczne:**\n\n**Insektycydy:**\n- **Neoniktynoidy**: tiametoksam, imidakloprid, klotianidyna — **ZAKAZANE w EU od 2018** z powodu toksyczności dla pszczół\n- **Spinosad** (Laser) — biopreparato z *Saccharopolyspora spinosa*, dozwolony w EU, drogi\n- **Spinetoram** (Delegate) — wyższa skuteczność niż spinosad\n- **Chlorantraniliprol** (Coragen) — nowoczesny, skuteczny na larwy L1–L3\n- **Cyantraniliprol** (Verimark) — aplikacja doglebowa przy sadzeniu\n- **Pyretroidy**: lambda-cyhalotryna (Karate) — tanie, ale odporność\n- **Indoksakarb** (Steward) — alternatywa, starzejący się\n\n**Timing aplikacji:**\n- **Kluczowy moment**: larwy L1–L3 (młode, łatwe do kontroli)\n- **Zbyt późno (L4)**: skuteczność spada, larwa już spowodowała 50 % defoliacji\n- **Obserwować łan** co 3–5 dni w ryzykownym okresie\n- **Próg**: 30 larw/100 roślin = oprysk\n\n**Zwalczanie — biologiczne:**\n\n**Drapieżniki i parazytoidzi:**\n- **Biedronki** (*Coccinellidae*) — zjadają jaja i młode larwy\n- **Złotooki** (*Chrysoperla*) — zjadają jaja\n- **Pluskwiaki** (*Podisus, Perillus*) — amerykańskie, mniej skuteczne w EU\n- **Muchy pasożytnicze** (*Doryphorophaga*) — rzadkie w EU\n- **Niewystarczająco skuteczne** dla dużych pól, tylko w ogrodzie/biogospodarstwie\n\n**Bacillus thuringiensis tenebrionis (BTT):**\n- Bakteria produkująca toksyny **specyficzne dla chrząszczy**\n- Komercyjnie: Novodor, Trichodor\n- **Skuteczny tylko na larwy L1–L2**, wyższe stadia tolerancyjne\n- **Podejście ekologiczne**, odpowiednie dla ogrodów i biogospodarstw\n\n**Zwalczanie — kulturowe:**\n- **Regularne zmianowanie** — co najmniej 2 lata przerwy między ziemniakami na tym samym polu\n- **Ręczne zbieranie** w ogrodzie (pracochłonne, ale 100 % skuteczne dla małych powierzchni)\n- **Bariery siatkowe** — młody porost przykryty siatką (drogie, tylko dla cennych odmian)\n- **Orka jesienna** — wypędza część dorosłych z zimowania\n\n**Odporne odmiany:**\n- **Solanum chacoense** — dziki ziemniak, genetyczne źródło odporności\n- **Sárka, Sárpo Mira** — częściowa tolerancja\n- **Genetycznie zmodyfikowane ziemniaki** (BT-potatoes) — wyeliminowane ze sceny regulacyjnej EU w latach 90.\n\n**Odporność szkodnika na pestycydy:**\n- Stonka jest **mistrzem odporności wśród szkodników**\n- DDT (lata 50.), pyretroidy (lata 80.), neoniktynoidy (lata 2010.) — stopniowo przełamywane\n- **Zarządzanie odpornością**: rotować 2–3 różne klasy insektycydów w sezonie\n\n**Ekonomika:**\n- **Oprysk**: 800–1 500 Kč/ha (1 aplikacja)\n- **Sezonowo**: 2–4 opryski × 1 200 = **2 400–4 800 Kč/ha**\n- **Opłacalność**: 5–10× (bez ochrony 80 % strat = 80 000+ Kč/ha)\n\n**Zmiana klimatu:**\n- Cieplejsze zimy = lepsze zimowanie\n- Dłuższy sezon wegetacyjny = 2 pokolenia regularnie (dawniej rzadko)\n- **Przesunięcie północnego zasięgu** do Skandynawii\n\nW kulturze: **„Americký brouk\"** był propagandowym symbolem w latach 50. (Zimna Wojna — Sowieci twierdzili że USA zrzucają stonki z samolotów na CSR i NRD w celu sabotażu rolnictwa).\n\nZob. też [[zemak]], [[plisen-bramborova]], [[insekticidy]].",
    "alias": [
      "Colorado potato beetle",
      "Leptinotarsa decemlineata",
      "stonka"
    ],
    "related": [
      "zemak",
      "plisen-bramborova",
      "insekticidy"
    ]
  },
  {
    "slug": "msice-repna",
    "term": "Mszyca burakowa",
    "kategorie": "ochrana",
    "shortDef": "Mszyca burakowa (Aphis fabae) to drobny owad wysysający soki buraka, fasoli, maku, ślazowca. Sama w sobie niezbyt szkodliwa, ale przenosi wirusa żółtaczki buraka (BYV) — wirus zmniejsza cukrowość buraka cukrowego o 20–40 %.",
    "longDef": "Mszyca burakowa (łac. *Aphis fabae*, ang. *black bean aphid*) to **czarna / ciemnobrązowa mszyca** wysysająca soki roślin żywicielskich. Sama w sobie średnio szkodliwa, ale **kluczowy wektor wirusów** w buraku cukrowym, fasoli, maku.\n\n**Wygląd:**\n- **Dorosła** 2 mm, **czarna / ciemnobrązowa**, często z woskowym nalotem\n- **Forma bezskrzydła** (vivipara) — letnie rozmnażanie\n- **Forma uskrzydlona** (alata) — dyspersyjna generacja, rozprzestrzenianie na nowe łany\n- **Nimfy** — jasnozielone, później ciemne\n\n**Żywiciele:**\n\n**Pierwotni** (zima):\n- **Trzmielina europejska** (Euonymus europaeus) — główny zimowy żywiciel w EU\n- **Kalina** (Viburnum)\n- **Łopian** (mniej powszechny)\n\n**Wtórni** (lato):\n- **Burak cukrowy, burak pastewny**\n- **Fasola zwykła** (Phaseolus vulgaris)\n- **Mak** (Papaver)\n- **Łoboda** (Atriplex)\n- **Mniszek, inne Compositae**\n\n**Cykl życiowy:**\n1. **Zima**: jaja składane na trzmielinę, kalinę\n2. **Wiosna**: bezskrzydłe samice pojawiają się na trzmielinie\n3. **Uskrzydlone dyspersyjne**: lecą na burak, fasolę (maj–czerwiec)\n4. **Szczyt populacji**: koniec czerwca–lipiec, na buraku i fasoli\n5. **Powrót na trzmielinę**: koniec lata–jesień, składanie jaj\n6. **W PL**: 10–15 pokoleń w letnim cyklu\n\n**Objawy bezpośredniego uszkodzenia:**\n- **Liście zwinięte, skręcone**\n- **Kolonie mszyc** na spodniej stronie liści (często 100+ osobników na liść)\n- **Spadź** (wydzielina słodka) — lepkie naloty → wzrost sadzy\n- **Zahamowany wzrost** rośliny\n\n**Kluczowy problem — wirusy:**\n\n**BYV (Beet Yellows Virus, wirus żółtaczki buraka):**\n- Mszyca siada na chorej roślinie → wysysa wirusy → leci na zdrową → infekuje\n- **Objawy**: żółte liście buraka, redukcja fotosyntezy\n- **Utrata cukrowości**: -20 do -40 % (burak cukrowy)\n- **Szerzenie się**: 1 jedyna zainfekowana mszyca może zarazić dziesiątki roślin\n\n**BMYV (Beet Mild Yellowing Virus):**\n- Mniej agresywny niż BYV, ale powszechny\n\n**BWYV (Beet Western Yellows Virus):**\n- Również rzepak, kapustowate\n\n**Zwalczanie — chemiczne:**\n\n**Insektycydy:**\n- **Neoniktynoidy** (tiametoksam, imidakloprid) — **ZAKAZANE w EU do stosowania polowego od 2018** z powodu pszczół. Dawniej standardowe zaprawianie buraka cukrowego.\n- **Acetamiprid** (Mospilan) — neoniktynoid nadal dozwolony w EU (inna struktura chemiczna)\n- **Flonikamid** (Teppeki) — antyżerny, **nowoczesny standard lat 2020.** dla buraka cukrowego\n- **Spirotetramat** (Movento) — systemiczny, działa też na spodniej stronie liści\n- **Pirimikarb** (Aphox) — selektywny aficyd, oszczędny dla pożytecznych (biedronki)\n- **Pyretroidy** (cypermetryna, deltametryna) — krótkie działanie, szybka odporność\n\n**Timing aplikacji:**\n- **Pierwszy oprysk**: przy stwierdzeniu 10 mszyc/roślinę lub 5 % roślin z mszycami\n- **Powtórzenie**: co 7–14 dni (zależy od substancji)\n- **Sezonowo łącznie**: 2–4 opryski w buraku cukrowym\n\n**Koszty**: 600–1 200 Kč/ha za oprysk × 3 = 1 800–3 600 Kč/ha sezonowo\n\n**Zwalczanie — biologiczne:**\n- **Biedronki** (Coccinellidae) — skuteczne, 1 biedronka zjada 50 mszyc/dzień\n- **Złotooki** (Chrysoperla)\n- **Muchówki pasożytnicze** (Aphidius spp., Praon spp.) — pasożytnicze osowate, składają jaja w mszycy\n- **Pasy kwiatowe** wokół pól zwiększają populację drapieżników\n- **Grzyby** (Beauveria, Metarhizium) — entomopatogeniczne, mniej skuteczne w polu\n\n**Zwalczanie — kulturowe:**\n- **Usunięcie trzmieliny** (zimowy żywiciel) w okolicach pól buraczanych — profilaktycznie\n- **Wczesny siew** buraka cukrowego → porost ma więcej wegetacji przed szczytem mszyc\n- **Odporne odmiany** buraka cukrowego — częściowa tolerancja na BYV (donor *Beta maritima*)\n\n**Podejście ekologiczne:**\n- **Roztwór mydlany** (mydło potasowe) — fizyczne uszkodzenie mszyc\n- **Olej neem** (azadyrachtyna) — naturalny pestycyd, ograniczony efekt\n- **Pyretrum** (z chryzantem) — krótkie działanie, dozwolone w EU\n\n**Zmiana klimatu:**\n- **Ciepłe zimy** → mszyce zimują też jako dorosłe (nie tylko jako jaja), więcej pokoleń\n- **Suchsze wiosny** → mniejsza populacja (mszyce preferują wilgoć)\n- **Przesunięcie zasięgu** na północ\n\n**W PL badania**: Instytut Hodowli i Aklimatyzacji Roślin (IHAR) Bydgoszcz, PIORiN — monitoring wirusa BYV, pasiaste modelowanie ryzyka.\n\nZob. też [[insekticidy]], [[mandelinka-bramborova]], [[osevni-postup]].",
    "alias": [
      "Aphis fabae",
      "black bean aphid",
      "mszyca czarna"
    ],
    "related": [
      "insekticidy",
      "mandelinka-bramborova"
    ]
  },
  {
    "slug": "zavijec-kukuricny",
    "term": "Omacnica prosowianka",
    "kategorie": "ochrana",
    "shortDef": "Omacnica prosowianka (Ostrinia nubilalis) to motyl, którego gąsienice wwiercają się w łodygi i kolby kukurydzy. Bez ochrony strata 5–25 % plonu + wnikanie grzybów Fusarium = mykotoksyny. W CZ rozpowszechniona głównie na południowych Morawach i w Połabiu.",
    "longDef": "Omacnica prosowianka (łac. *Ostrinia nubilalis*, ang. *European Corn Borer*, ECB) to **motyl** z rodziny *Crambidae*. Jej **gąsienice wwiercają się w łodygi, kolby i wiechy kukurydzy**, powodując bezpośrednie straty + wtórną infekcję grzybami *Fusarium* (mykotoksyny — zob. [[fuzarioza]]).\n\n**Wygląd:**\n- **Postać dorosła**: motyl, rozpiętość skrzydeł 25–30 mm, **jasnożółte skrzydła** z falistymi brązowymi paskami. Samiec ciemniejszy od samicy.\n- **Jajko**: 1 mm, **płaskie łuski** w skupiskach 15–30 szt. na spodniej stronie liści\n- **Gąsienica**: 25 mm, **szaro-różowa z ciemną głową**, 5 stadiów instarowych\n- **Poczwarka**: w łodydze kukurydzy, brązowa\n\n**Cykl życiowy w CZ:**\n\n**Obszar północny (Karkonosze, Wysoczyzna)** — **1 pokolenie rocznie**:\n- Maj–czerwiec: loty motyli\n- Czerwiec–lipiec: gąsienice w roślinach\n- Sierpień: przepoczwarczenie\n- Wrzesień–październik: motyle drugiego krótkiego pokolenia (często nie atakują)\n- Listopad–marzec: gąsienice zimują w resztkach roślin (słomie, rżysku kukurydzianym)\n\n**Obszar południowy (Słowacja, Połabie)** — **2 pokolenia rocznie**:\n- 1. pokolenie: maj–lipiec\n- 2. pokolenie: sierpień–październik\n- Drugie pokolenie powoduje **poważniejsze straty** (większa roślina, większe gąsienice)\n\n**Objawy uszkodzeń:**\n\n**Łodyga:**\n- **Otwory** (dziury, głębokość 5–20 mm) — punkt wnikania gąsienicy\n- **Połamanie łodygi** podczas silnego wiatru/deszczu (broken stalks)\n- **Żółte trociny wokół otworu wejściowego** (odchody gąsienicy)\n\n**Liść:**\n- **Otwory w liściach** (młoda gąsienica czasem ogryza liście przed wejściem do łodygi)\n- **Wygląd brokat** (pinhole damage)\n\n**Kolba (zbiór):**\n- **Gąsienice w kolbie** — żerują na ziarnach\n- **Otwory na kłosie** — wejście dla *Fusarium*, *Aspergillus* — **mykotoksyny**\n- **Obniżony plon**: 5–25 % bezpośrednio, +10–30 % wtórnie z powodu grzybów\n\n**Ochrona — chemiczna:**\n\n**Insektycydy** (aplikacja w stadium larwalnym, nie dorosłych):\n- **Spinosad** (Laser) — bio, skuteczny na L1-L2\n- **Spinetoram** (Delegate) — silniejsza wersja\n- **Chlorantraniliprole** (Coragen) — nowoczesny standard, wysoka skuteczność\n- **Cyantraniliprole** (Verimark) — alternatywny\n- **Indoxakarb** (Steward) — starzejący się\n- **Pyretroidy** (lambda-cyhalothrin) — krótka skuteczność\n\n**Timing aplikacji — KLUCZOWE:**\n- **Przed wnikaniem do łodygi**: gąsienica L1-L3 jeszcze na liściach → cel oprysku\n- **Po wnikaniu do łodygi**: insektycyd nie ma dostępu, **oprysk zawodzi**\n- **Timing**: 7–10 dni po szczycie lotu motyli (pułapki feromonowe)\n- **Monitoring**: pułapki feromonowe na polach, regularna obserwacja\n\n**Ochrona jest droga i niepewna** dla kiszonki — koszty 1 000–2 000 Kč/ha + trudny timing. Wiele gospodarstw **rezygnuje**.\n\n**Ochrona — biologiczna:**\n\n**Trichogramma spp.** (pasożytnicza osóbka):\n- **Składa jaja w jajach omacnicy** → 50–80 % parazytacji\n- **Aplikacja**: lepkie karty z osóbkami zawieszane na polu (5 000 osóbek/ha)\n- **Cena**: ~800–1 500 Kč/ha\n- **Skuteczność**: porównywalna z insektycydem, **metoda bio**\n- **Rynek**: AgriCom, BBM, BioActiv\n\n**Bacillus thuringiensis kurstaki (BTK):**\n- Bakteria z toksyną **swoistą dla motyli** (Lepidoptera)\n- Komercyjnie: Lepinox, Dipel, Foray\n- **Stosowany w sezonie biopaliw** (skuteczność do 10 dni)\n\n**GMO kukurydza MON810 (kukurydza BT):**\n- **Własna odporność** — kukurydza produkuje toksynę *Bt*\n- **Zakaz uprawy w UE** (tylko wyjątki: Hiszpania, Portugalia)\n- **W CZ niezarejestrowana** do uprawy\n\n**Ochrona — agrotechniczna:**\n\n**Kluczowe działania zapobiegawcze:**\n- **Orka po zbiorze** — przyoruje słomę kukurydzianą z gąsienicami → zmniejszenie populacji 50–80 %\n- **Rozdrabnianie / mulczowanie ścierniska** — niszczy kryjówkę\n- **Przedplon** (krótki sezon) — mniejsza presja\n- **Siew bezorkowy + słoma kukurydziana na powierzchni** = NAJGORSZE warunki dla omacnicy\n\n**Odporność patogena:**\n- Omacnica stała się odporna na **MON810 Bt** w Brazylii i USA (lata 2010.) — populacja field-evolved\n- W UE bez masowego stosowania Bt odporność jak dotąd powolna\n\n**Zmiana klimatu:**\n- 2. pokolenie coraz dalej na północ — Słowacja w latach 2020. regularnie, wcześniej tylko wyjątkowo\n- Cieplejsze jesienie → większe przeżycie gąsienicy\n- Przesuwanie zasięgu na północ Europy\n\n**Wpływ ekonomiczny:**\n- **Bez ochrony**: strata 5–25 % plonu + 5–15 % obniżka ceny z tytułu mykotoksyn\n- **Sezonowa strata na 100 ha kukurydzy**: 50 000 – 250 000 Kč\n- **Koszt ochrony**: 1 000–2 500 Kč/ha\n- **Zwrot**: 5–20× przy silnej presji\n\n**W CZ**: główny problem dla **kukurydzy kiszonkowej** (południowe Morawy, Słowacja, Ołomuniec). Kukurydza ziarnowa mniej problematyczna (zbiór przed szczytem 2. pokolenia).\n\nZob. też [[fuzarioza]], [[insekticidy]], [[kukurice-silazni]], [[no-till]].",
    "alias": [
      "Ostrinia nubilalis",
      "European Corn Borer",
      "ECB",
      "omacnica kukurydziana"
    ],
    "related": [
      "fuzarioza",
      "insekticidy",
      "kukurice-silazni",
      "no-till"
    ]
  },
  {
    "slug": "fungicidy",
    "term": "Fungicydy",
    "kategorie": "ochrana",
    "shortDef": "Fungicydy to preparaty chemiczne stosowane przeciw chorobom grzybowym roślin. Kluczowe klasy: triazole (DMI), strobiluryny (QoI), SDHI, kontaktowe (mancozeb, miedź). Cena w CZ 2024: 500–2 500 Kč/ha za jedną aplikację.",
    "longDef": "Fungicydy (z łaciny *fungus* + *caedere* = grzyb + zabijać) to **preparaty chemiczne przeznaczone do ochrony roślin przed chorobami grzybowymi**. W UE regulowane rozporządzeniem EC 1107/2009. W CZ zatwierdza je **ÚKZÚZ** (Centralny Inspektorat i Urząd Doświadczalny ds. Rolnictwa).\n\n**Główne klasy fungicydów:**\n\n**1. Triazole (DMI — inhibitory demetylacji):**\n- **Mechanizm**: blokują biosyntezę ergosterolu (błona komórki grzybowej)\n- **Główni przedstawiciele**: tebukonazol, propikonazol, protiokona​zol (Proline), metkonazol, epoksikonazol (wycofany lata 2020.)\n- **Spektrum**: szerokie — septorioza, rdze, fuzarioza, mączniak\n- **Skuteczność**: średnio-wysoka, **układowo** (przenika przez liść)\n- **Odporność**: po 30 latach stosowania **słabną na septoriozę**, ale nadal są podstawą\n- **Cena**: 400–800 Kč/ha\n- **Uwaga**: tebukonazol w rzepaku chroni przed fomą (*Leptosphaeria maculans*)\n\n**2. Strobiluryny (QoI — inhibitory zewnętrzne chinonów):**\n- **Mechanizm**: hamują mitochondrialne oddychanie (cyt b)\n- **Główni przedstawiciele**: azoksystrobina (Amistar), pyraklostrobilina (Comet), trifloksystrobina (Flint), kresoksym-metyl\n- **Spektrum**: mączniak, rdze, **NIE septorioza** (odporność przełamana 2003)\n- **Skuteczność**: wysoka na mączniak i rdze\n- **Efekty specjalne**: **„efekt zieleni\"** — wydłuża zieloną fazę liścia o 7–10 dni → +5 % plonu\n- **Odporność**: silna na septoriozę, rozszerzająca się na inne patogeny\n- **Cena**: 500–1 200 Kč/ha\n\n**3. SDHI (inhibitory dehydrogenazy bursztynianowej):**\n- **Mechanizm**: blokują kompleks II mitochondrialnego oddychania\n- **Główni przedstawiciele**: fluksapyroksad (Imtrex), biksafen (Aviator), benzowindiflupyr (Solatenol), pydiflumetofen (Adepidyn)\n- **Spektrum**: septorioza, fuzarioza, mączniak, rdze\n- **Skuteczność**: TOP lata 2020. — silniejsze niż triazole\n- **Odporność**: jak dotąd umiarkowana\n- **Cena**: 800–1 500 Kč/ha\n- **Typowa aplikacja**: mieszanina SDHI + triazol = srebrny standard dla pszenicy\n\n**4. Inatreq active (fenpikoksamid) — nowa klasa:**\n- **Mechanizm**: NOWY MOA (inhibitor wewnętrzny chinonów, QiI)\n- **Skuteczność**: wysoka na septoriozę, brak dotychczasowej odporności\n- **Cena**: 1 200–1 800 Kč/ha\n- **Rynek**: Univoq (Corteva), 2021+\n\n**5. Mefentriflukonazol (Revysol) — nowy DMI:**\n- **Mechanizm**: zaawansowany DMI, aktywny także wobec odpornych szczepów\n- **Cena**: 1 000–1 500 Kč/ha\n- **Rynek**: Revysol, Revystar (BASF), 2020+\n\n**6. Fungicydy kontaktowe (multisite):**\n\n- **Mancozeb** (Dithane M-45, Penncozeb)\n  - **Mechanizm**: multisite (niemożliwość wytworzenia odporności)\n  - **UE**: zakaz **2024** (potencjalnie rakotwórczy wg klasyfikacji ECHA)\n  - **Cena**: 200–500 Kč/ha (tani)\n\n- **Miedź** (CuSO₄, wodorotlenek Cu, oksychlorek)\n  - **Bio i konwencjonalne**: dopuszczone w UE bio\n  - **Limit**: 4 kg Cu/ha/rok od 2019\n  - **Zastosowanie**: zaraza ziemniaka, mączniak rzekomy winorośli, peronospora\n  - **Cena**: 300–600 Kč/ha\n\n- **Siarka (S)**\n  - **Podejście bio**: mączniak, roztocza\n  - **Cena**: 200–400 Kč/ha\n\n- **Folpet**\n  - **Alternatywa multisite dla mancozebu**\n  - **Cena**: 400–800 Kč/ha\n\n**7. Anilinopirymidyny (AP):**\n- **Mechanizm**: biosynteza metioniny\n- **Przedstawiciele**: pyrimetanil, cyprodinil\n- **Spektrum**: mączniak, monilioza\n\n**8. Cymoksanil:**\n- **Krótka skuteczność** (3–4 dni)\n- **Zawsze w kombinacji** z mancozebem lub metalaksylem\n- **Zastosowanie**: zaraza ziemniaka (efekt kuratywny)\n\n**9. Metalaksyl-M (swoiście dla lęgniowców):**\n- **Mechanizm**: polimeraza RNA I (specyficzne dla lęgniowców)\n- **Zastosowanie**: zaraza ziemniaka, mączniak rzekomy winorośli\n- **Odporność**: wysoka (od lat 80.)\n\n**Technika aplikacji:**\n\n**Opryskiwacz** (sprayer):\n- **Zawieszany** (na traktorze, zbiornik 600–1 200 l) — małe gospodarstwa\n- **Ciągniony** (1 500–4 500 l) — średnie\n- **Samojezdny** (Berthoud, Amazone Pantera) — duże gospodarstwa\n- **Szerokość robocza**: 18–36 m\n\n**Dysza i ciśnienie:**\n- **Ruch płaski**: 200–400 l wody/ha, ciśnienie 2–4 bary\n- **Drobne rozpylanie**: lepsza pokrywalność, ale większy znos (do sąsiadów)\n- **Grube rozpylanie**: mniejszy znos, ale gorsza pokrywalność\n\n**Kombinacja z adiuwantem (środek powierzchniowo czynny):**\n- **Olej** (Mero, Adigor) — poprawia przyczepność do liścia\n- **Środek zwilżający** (Trend, Silwet) — obniża napięcie powierzchniowe, lepsza pokrywalność\n- **Penetrant**: szybsze wnikanie do liścia\n\n**Odporność — strategie antyodpornościowe:**\n1. **MIX różnych MOA** (mechanizmy działania) w każdym oprysku\n2. **Maksymalnie 1× w sezonie** ta sama MOA\n3. **Rotacja** — różne MOA między opryskami\n4. **Połączenie z odpornymi odmianami**\n5. **Połączenie z agrotechniką** (przyorywanie, gęstość łanu)\n\n**Sezonowy kalendarz — pszenica (typowy 2024):**\n- **T0** (BBCH 30): przeciwseptorijny — triazol, 500 Kč/ha\n- **T1** (BBCH 32): septorioza + rdze — SDHI + triazol, 1 200 Kč/ha\n- **T2** (BBCH 39): liść flagowy — SDHI + triazol, 1 500 Kč/ha (NAJCENNIEJSZY)\n- **T3** (BBCH 63): fuzarioza — triazol, 1 000 Kč/ha\n- **Sezonowo**: 3 500–4 500 Kč/ha\n\n**Zwrot z inwestycji:**\n- **Bez fungicydów**: -30 do -50 % plonu\n- **Oprysk T2 samodzielnie**: -10 do -20 % vs pełny program\n- **Pełny program**: maksymalny plon\n- **Zwrot pełnego programu**: 4–6× w ryzykownym roku\n\n**Regulacje UE:**\n- **REACH** — autoryzacja substancji czynnych\n- **MRL** (Maksymalne Limity Pozostałości) — limity pozostałości w żywności\n- **Strefy buforowe** — obowiązek nieaplikowania 5–20 m od cieków wodnych\n- **PPE** — obowiązkowe środki ochrony osobistej (rękawice, respirator) przy aplikacji\n- **Zakazy**:\n  - **Neonikotynoidy** (na zewnątrz) 2018\n  - **Chlorotalonil** 2019\n  - **Glifosat** (Roundup) — periodycznie odnawiany, ryzyko zakazu\n  - **Mancozeb** 2024\n\nZob. też [[plisen-bramborova]], [[fuzarioza]], [[septorioza]], [[rzi]], [[insekticidy]], [[herbicidy]].",
    "alias": [
      "fungicides",
      "środki przeciwgrzybowe",
      "opryski mykocydowe"
    ],
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
    "term": "Herbicydy",
    "kategorie": "ochrana",
    "shortDef": "Herbicydy to preparaty przeciw chwastom. Glifosat (Roundup) jest najszerzej stosowany. Herbicydy selektywne zwalczają tylko określone gatunki chwastów, totalne niszczą wszystko. Globalny rynek 30+ mld USD/rok, kluczowe dla nowoczesnego rolnictwa.",
    "longDef": "Herbicydy (z łac. *herba* = ziele + *caedere* = zabijać) to **preparaty przeciw chwastom**. Kluczowy segment środków ochrony roślin — bez herbicydów obecne plony spadłyby o 30–50 %, a ręczne odchwaszczanie byłoby ekonomicznie niemożliwe na dużych powierzchniach.\n\n**Podział według selektywności:**\n\n**Totalne (nieselektywne)** — niszczą wszystkie rośliny:\n- **Glifosat** (Roundup) — zob. [[roundup]]\n- **Glufosynat** (Basta) — alternatywa\n- **Diquat** (Reglone) — desykant\n- **Parakwat** — **zakazany w UE od 2007**\n\n**Selektywne** — zwalczają tylko określone gatunki:\n\n**Dwuliścienne (szerokolistne chwasty) w zbożach:**\n- **MCPA, 2,4-D** (Glean, Banvel) — stara klasa, tania\n- **Sulfonylomoczniki** (Granstar, Hussar) — nowoczesne, dawki 10–30 g/ha\n- **Triazinony** (metribuzin) — ziemniaki\n\n**Jednoliścienne (trawy) w roślinach szerokolistnych:**\n- **Chizalofop-p-etylowy** (Targa, Leopard) — rzepak, soja\n- **Fluazifop-p-butylowy** (Fusilade) — alternatywa\n- **Kletodym** (Centurion) — soja\n\n**Doglebowe (przed wschodami):**\n- **Pendimetalina** (Stomp, Activus) — herbicyd korzeniowy\n- **S-metolachlor** (Dual Gold) — kukurydza\n- **Metribuzin** — ziemniaki\n- **Aplikacja**: przed wschodami chwastów, 2-7 dni po siewie\n\n**Nalistne (po wschodach):**\n- **Mezotrion** (Callisto) — kukurydza, delikatny\n- **Foramsulfuron** (Maister) — kukurydza\n- **Mezosulfuron + jodosulfuron** (Atlantis) — graminicyd w pszenicy\n\n**Mechanizm działania (MOA — grupy HRAC):**\n\n**1. Inhibitory EPSPS** (Grupa 9): glifosat\n**2. Inhibitory AHAS** (Grupa 2): sulfonylomoczniki, imidazolinony — najwięcej odporności\n**3. Inhibitory ACCase** (Grupa 1): graminicydy (Fusilade, Targa) — wysoka odporność\n**4. Inhibitory PSII** (Grupa 5): triazyny (atrazyna — zakazana 2007)\n**5. Inhibitory PPO** (Grupa 14): karfentrazon, sulfentrazon\n**6. Inhibitory HPPD** (Grupa 27): mezotrion, izoksaflutol — kukurydza\n**7. Inhibitory mitozy** (Grupa 3): pendimetalina\n**8. Synteza celulozy** (Grupa 29): izoksaben\n\n**Glifosat (Roundup) — szczegóły:**\nZob. [[roundup]] dla pełnego profilu.\n\n- **Mechanizm**: blokuje enzym EPSPS (synteza aromatycznych aminokwasów)\n- **Spektrum**: totalne (poza roślinami GMO Roundup Ready)\n- **Aplikacja**: przed siewem, **krzewienie** (między rzędami), desykacja (ok. 10 dni przed zbiorem)\n- **Cena**: 250–500 Kč/ha (jeden z najtańszych herbicydów)\n- **Globalny rynek**: 800 000 t/rok, 30 % wszystkich herbicydów\n- **Regulacje UE**: zezwolenie odnowione do 2033\n\n**Kluczowe chwasty w CZ i ich herbicydy:**\n\n**W pszenicy:**\n- **Przytulia czepna** (Galium aparine): Granstar, Hussar OD, Salsa\n- **Rumianek pospolity** (Matricaria chamomilla): MCPA, sulfonylomoczniki\n- **Miotła zbożowa** (Apera spica-venti): Atlantis OD, Pacifica Plus\n- **Wiechlina roczna** (Poa annua): Atlantis OD\n- **Perz właściwy** (Elymus repens): glifosat przed siewem lub na ściernisko\n\n**W kukurydzy:**\n- **Komosa biała** (Chenopodium album): Callisto, Maister Power\n- **Łoboda** (Atriplex): Callisto, Stomp\n- **Chwastnica** (Setaria): Maister\n- **Gorczyca polna** (Sinapis arvensis): Casper\n\n**W rzepaku:**\n- **Rumianek**: Galera (klopyralid + pikloram)\n- **Mniszek**: Galera\n- **Perz**: Fusilade Forte (tylko w rzepaku)\n\n**W burakach cukrowych:**\n- **Komosa, łoboda**: Goltix (metamitron) + Betanal (fenmedifam) + Pyramin\n- **Chwastnica, mak polny**: kombinacje Betanal\n\n**Odporność na herbicydy:**\n\n**Globalny problem lat 2010.+**:\n- **Amarantus palmeri** w USA — odporność na glifosat, sulfonylomoczniki, HPPD\n- **Lolium spp.** w Australii — wielokrotna odporność, „herbicide superweeds\"\n- **Miotła zbożowa** w UE — odporność na inhibitory ACCase i AHAS\n\n**Strategie antyodpornościowe:**\n1. **Rotacja MOA** — różne herbicydy w różnych latach\n2. **Mix MOA** — kombinacja w jednym oprysku\n3. **Mechaniczna kontrola** — orka, pielnik w międzyrzędziach\n4. **Rośliny okrywowe** — redukują chwasty\n5. **Ręczna** — kontrola ognisk odporności\n\n**Bioherbicydy:**\n- **Octan** (Beloukha) — kwas pelargonowy, ze źródeł naturalnych\n- **Kwas octowy** (ocet) — dla małych powierzchni\n- **Termiczne** — palniki propanowe do pasowych oprysków\n- **Cena**: 5–20× drożej niż glifosat\n\n**Technika aplikacji:**\n- **Opryskiwacz** (jak fungicydy) — 200–400 l wody/ha\n- **Dysza**: zazwyczaj drobnokroplistsza (prosta iniekcja) niż dla fungicydów\n- **Mix z adiuwantem**: środek zwilżający poprawi skuteczność\n- **Uwaga na znos** — herbicyd może uszkodzić sąsiednie uprawy\n\n**Koszty — dla typowej pszenicy:**\n- **Doglebowe**: 600–1 200 Kč/ha\n- **Nalistne** (wiosna): 800–1 500 Kč/ha\n- **Desykacja** (przed zbiorem): 300–500 Kč/ha (Roundup, Reglone)\n- **Sezonowo**: 1 700–3 200 Kč/ha\n\n**Dla kukurydzy:**\n- **Doglebowe**: 1 200–2 000 Kč/ha (Lumax — typowa mieszanka)\n- **Nalistne**: 1 000–1 800 Kč/ha (Callisto + alternatywa atrazyny)\n\n**Regulacje UE:**\n- **Neonikotynoidy i glifosat**: kontrowersyjne, ale na razie dopuszczone (z ograniczeniami)\n- **Chlortal-dimetyl, atrazyna, parakwat**: zakazy 2007+\n- **MRL** — maksymalne limity pozostałości w żywności\n- **Strefy buforowe** — 5–10 m od cieków wodnych\n\nZob. też [[roundup]], [[fungicidy]], [[insekticidy]], [[desikace]], [[ozim-jarin]].",
    "alias": [
      "herbicides",
      "środki chwastobójcze",
      "opryski przeciw chwastom"
    ],
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
    "term": "Insektycydy",
    "kategorie": "ochrana",
    "shortDef": "Insektycydy to preparaty przeciw szkodliwym owadom. Kluczowe klasy: pyretroidy (lambda-cyhalothrin), neonikotynoidy (ZAKAZANE w UE 2018 do stosowania zewnętrznego), nowocześniejsze diamidy i spinosyny. Cena oprysku w CZ 600–2 000 Kč/ha.",
    "longDef": "Insektycydy (z łac. *insectum* + *caedere* = owad + zabijać) to **preparaty przeciw szkodliwym owadom**. Kluczowy segment ochrony roślin — bez insektycydów straty z mszyc, stonki, omacnic byłyby katastrofalne.\n\n**Główne klasy insektycydów (grupy IRAC):**\n\n**1. Pyretroidy** (Grupa 3 — modulatory kanałów sodowych):\n- **Mechanizm**: blokują kanały sodowe w układzie nerwowym owada\n- **Główni przedstawiciele**:\n  - **Lambda-cyhalothrin** (Karate Zeon) — szerokie spektrum\n  - **Deltametryna** (Decis) — popularny\n  - **Cypermetryna** (Cyperkill) — tani\n  - **Bifentryna** — alternatywa dla lambda\n  - **Tau-fluwalinian** — bardziej selektywny (bezpieczniejszy dla pszczół)\n- **Spektrum**: szerokie — mszyce, chrząszcze, larwy motyli, pluskwiaki\n- **Skuteczność**: szybka (knockdown), ale krótka (7-10 dni)\n- **Odporność**: rozległa (od lat 80.) — mszyce, stonka, wciornastki rzepakowe\n- **Toksyczność**: wysoka dla pszczół (NIE opryskiwać w czasie kwitnienia!)\n- **Cena**: 200–500 Kč/ha (tanie)\n\n**2. Neonikotynoidy** (Grupa 4 — receptory nikotynowe acetylocholiny):\n- **Mechanizm**: agoniści receptorów acetylocholiny (jak nikotyna u człowieka)\n- **Główni przedstawiciele**:\n  - **Imidaklopryd** (Confidor, Gaucho) — historycznie #1\n  - **Tiametoksam** (Actara, Cruiser)\n  - **Klotianidyna** (Poncho) — głównie w zaprawieniu nasion kukurydzy\n  - **Acetamipryd** (Mospilan) — NADAL dozwolony w UE\n- **Zakaz UE** — stosowanie zewnętrzne od 2018 dla tiametoksamu, klotianidyny, imidakloprydu. **Acetamipryd nadal dozwolony**.\n- **Powód zakazu**: wysoka toksyczność dla **pszczół i zapylaczy**\n- **Cena**: 300–600 Kč/ha (acetamipryd)\n- **Działanie układowe**: przemieszcza się w roślinie, długotrwała ochrona (2-4 tygodnie)\n\n**3. Diamidy** (Grupa 28 — modulatory receptorów rianodynowych):\n- **Mechanizm**: trwałe otwarcie kanałów wapniowych w mięśniach owada → paraliż\n- **Główni przedstawiciele**:\n  - **Chlorantraniliprole** (Coragen) — kukurydza, ziemniak\n  - **Cyantraniliprole** (Verimark) — zaprawa nasienna, układowo\n  - **Flubendiamid** (Belt) — w niektórych krajach UE ograniczony\n- **Spektrum**: motyle (gąsienice), chrząszcze (stonka), niektóre muchówki\n- **Bezpieczeństwo**: ŁAGODNY dla pszczół i organizmów pożytecznych\n- **Cena**: 1 000–2 000 Kč/ha (drogie)\n- **Odporność**: jak dotąd umiarkowana\n- **Rynek**: szybko rosnący lata 2010.+\n\n**4. Spinosyny** (Grupa 5 — receptory nikotynowe acetylocholiny, inne miejsce):\n- **Mechanizm**: agoniści receptorów acetylocholiny (inne miejsce wiązania niż neonikotynoidy)\n- **Główni przedstawiciele**:\n  - **Spinosad** (Laser) — bio i konwencjonalne, z bakterii *Saccharopolyspora spinosa*\n  - **Spinetoram** (Delegate) — silniejsza wersja\n- **Spektrum**: motyle, stonka, wciornastki\n- **Bezpieczeństwo**: niska toksyczność dla ssaków, **średnia dla pszczół** (opryskiwać wieczorem)\n- **Cena**: 800–1 500 Kč/ha\n\n**5. Antyżerniki / Regulatory wzrostu:**\n\n- **Flonikamid** (Teppeki) — antyżernik dla mszyc. Zatrzymuje żerowanie w ciągu 1-2 h.\n  - **Bezpieczny** dla pszczół\n  - **Cena**: 800–1 200 Kč/ha\n  - **Zastosowanie**: burak cukrowy, ziemniak, owoce\n\n- **Pymetrozyna** (Plenum) — mszyce. Zakaz UE 2019.\n\n- **Buprofezyna** (Applaud) — inhibitor syntezy chityny. Regulator wzrostu dla stadiów nimfalnych.\n\n- **Indoxakarb** (Steward, Avaunt) — Grupa 22, bloker kanałów sodowych. Motyle, stonka.\n  - **Cena**: 800–1 500 Kč/ha\n\n**6. Akarycydy (przeciw roztoczom):**\n\n- **Heksytiazoks** (Nissorun) — jaja i nimfy roztoczy\n- **Pyrydaben** (Sanmite) — dorosłe roztocza\n- **Abamektyna** (Vertimec) — szersze spektrum\n- **Spirodikolofen** (Envidor) — nowoczesny\n- **Bifenazat** (Floramite) — selektywny\n\n**7. Bioinsektycydy:**\n\n- **Bacillus thuringiensis** (BT):\n  - **BT kurstaki (BTK)** — Lepinox, Dipel — motyle (gąsienice)\n  - **BT tenebrionis (BTT)** — Novodor — chrząszcze (stonka L1-L2)\n  - **BT israelensis (BTI)** — komary, muchówki w ogrodach\n  - **Bezpieczne** dla ssaków, ptaków, ryb — tylko dla docelowych owadów\n  - **Krótka skuteczność** (3-7 dni)\n- **Spinosad** (zob. wyżej) — certyfikacja bio i konwencjonalna\n- **Olej neem** (azadirachtyna) — z indyjskiego drzewa neem, **antyżernik + IGR**\n- **Pyretryna** — z kwiatów chryzantemy — krótka skuteczność (1-3 dni)\n- **Beauveria bassiana** — entomopatogeniczny grzyb\n\n**Technika aplikacji:**\n\n**Opryskiwacz** (jak fungicydy/herbicydy):\n- 200–400 l wody/ha\n- Drobnokroplistsza dysza dla lepszej pokrywalności\n\n**Zaprawa nasienna** (seed treatment):\n- **Neonikotynoidy** (klotianidyna, imidaklopryd) — **zakaz UE od 2018** do stosowania zewnętrznego\n- **Zaprawa acetamiprydem** — dozwolona, ale mniej skuteczna\n- **Zaprawa cyantraniliproleem** (Verimark) — nowoczesna alternatywa\n\n**Granulat rzędowy:**\n- **Fipronil** — fluxax (przeciw drutowcom, larwom korzeniożerców)\n- **Tefluryna** — Force — kukurydza\n\n**Timing aplikacji:**\n\n**Stonka ziemniaczana**:\n- Larwy L1-L3 (młode) — oprysk\n- 30 larw/100 roślin = próg zadziałania\n\n**Omacnica prosowianka**:\n- Po szczycie lotu motyli (pułapki feromonowe)\n- 7-10 dni po szczycie → gąsienice L1-L3\n\n**Mszyce**:\n- 10 mszyc/roślinę = próg w burakach cukrowych\n- 50+ % roślin z mszycami = oprysk w zbożach\n\n**Szkodniki ssące** (mszyce, wciornastki):\n- Aplikuje się UKŁADOWY insektycyd (acetamipryd, flonikamid)\n\n**Szkodniki gryzące** (chrząszcze, gąsienice, larwy):\n- Aplikuje się kontaktowy lub żołądkowy (pyretroid, BTK)\n\n**Bezpieczeństwo dla pszczół i zapylaczy:**\n\n**Regulacje UE** (od 2018):\n- Większość neonikotynoidów ZAKAZANA zewnętrznie\n- Pyretroidy: NIE opryskiwać w czasie kwitnienia upraw\n- Diamidy, spinosyny: ŁAGODNE\n- Flonikamid: bezpieczny\n\n**Dobre praktyki:**\n1. **Oprysk wieczorem** (po zachodzie słońca) — pszczoły w ulu\n2. **NIE opryskiwać kwitnącego łanu** (pszenica w kwitnieniu, słonecznik, rzepak)\n3. **Informować sąsiednich pszczelarzy** przed opryskem (obowiązek prawny w niektórych krajach)\n4. **Strefy buforowe** od kwitnących remiz\n5. **Mix z herbicydem** dla zmniejszenia liczby oprysków\n\n**Odporność:**\n\n**Mistrzowie odporności:**\n- **Stonka ziemniaczana** — odporna na DDT, pyretroidy, neonikotynoidy (kolejno)\n- **Tantnisia krzyżowiaczek** (*Plutella xylostella*) — superodporna\n- **Drosophila suzukii** (owocówka plamoskrzydła) — szybka odporność\n\n**Strategie:**\n1. **Rotacja MOA** — co najmniej 3 różne klasy insektycydów\n2. **Mix MOA** w jednym oprysku\n3. **Unikanie** powtarzania jednego produktu\n4. **Połączenie z IPM** (Zintegrowane zarządzanie agrofagami)\n\n**IPM (Zintegrowane zarządzanie agrofagami):**\n- **Monitoring**: pułapki feromonowe, wizualna kontrola, model ryzyka\n- **Próg zadziałania**: oprysk dopiero po przekroczeniu ekonomicznego progu\n- **Biologia**: drapieżniki, parazytoidy, BT\n- **Agrotechnika**: zmianowanie, odporne odmiany, przyorywanie\n- **Chemia**: jako ostateczność, celowo\n\n**Koszty:**\n- **Pyretroid**: 200–500 Kč/ha\n- **Acetamipryd**: 400–700 Kč/ha\n- **Diamid**: 1 000–2 000 Kč/ha\n- **BT bio**: 600–1 200 Kč/ha\n- **Sezonowo** (3–5 oprysków): 1 500–5 000 Kč/ha\n\nZob. też [[mandelinka-bramborova]], [[msice-repna]], [[zavijec-kukuricny]], [[fungicidy]], [[herbicidy]].",
    "alias": [
      "insecticides",
      "środki owadobójcze",
      "opryski przeciw owadom"
    ],
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
    "term": "Desykacja",
    "kategorie": "ochrana",
    "shortDef": "Desykacja to przedzbiorowe wysuszenie łanu (rzepak, słonecznik, ziemniaki, groch) metodą chemiczną. Ujednolica dojrzewanie, obniża wilgotność ziarna i ułatwia kombajnowanie. W CZ kluczowe dla rzepaku i ziemniaków.",
    "longDef": "Desykacja (z łac. *desiccare* = wysuszyć) to **chemiczne przedzbiorowe wysuszenie łanu**. Celem jest **ujednolicenie dojrzewania, obniżenie wilgotności ziarna i ułatwienie kombajnowania**. Kluczowy zabieg dla **rzepaku, słonecznika, ziemniaków, grochu, maku, lnu**.\n\n**Cel desykacji:**\n\n1. **Ujednolicenie dojrzewania**: łan dojrzewa nierównomiernie (różne fazy kwitnienia, wierzchołek vs rozgałęzienia). Desykacja zatrzymuje wegetację, wszystkie ziarna „wyrównują się\".\n2. **Obniżenie wilgotności ziarna**: wilgotne ziarno (>15 %) nie może być sprzedane na skup bez suszenia (drogie). Desykacja obniża wilgotność o 5-15 %.\n3. **Ułatwienie kombajnowania**: suchy łan przechodzi przez młocarnię szybciej, mniejsze straty.\n4. **Suszenie słomy / naci**: u ziemniaków wspomaga zamieranie naci przed zbiorem (zapobiega przenoszeniu zarazy do bulw).\n5. **Likwidacja chwastów**: wyrośnięte chwasty w łanie są desykowane razem z rośliną uprawną.\n\n**Główne preparaty desykacyjne:**\n\n**1. Glifosat (Roundup):**\n- **Spektrum**: totalne — wszystkie zielone rośliny\n- **Zastosowanie**: rzepak, słonecznik, groch, zboża\n- **Aplikacja**: 10–14 dni przed zbiorem\n- **Dawka**: 1,5–3 l/ha (zależy od stężenia preparatu 360 g/l)\n- **Cena**: 250–500 Kč/ha\n- **Zalety**: tani, układowy (wnika do chwastów → niszczy też korzenie)\n- **Uwaga**: UE odnowiło zezwolenie do 2033, ale kontrowersyjny\n\n**2. Diquat (Reglone):**\n- **Mechanizm**: fotoradykalizacja w chloroplastach (szybkie utlenianie)\n- **Spektrum**: kontaktowy totalny desykant\n- **Zastosowanie**: ziemniaki (nać), rzepak, groch, słonecznik\n- **Aplikacja**: 7–10 dni przed zbiorem\n- **Dawka**: 2–3 l/ha\n- **Cena**: 500–900 Kč/ha\n- **Zalety**: bardzo szybki (efekt 3-5 dni), uniwersalny\n- **Status UE**: **Diquat ZAKAZANY w UE od 2019** (toksyczność dla ssaków, ptaków, organizmów wodnych)\n- **Alternatywy**: glifosat lub glufosynat\n\n**3. Glufosynat (Basta, Liberty):**\n- **Mechanizm**: inhibitor syntazy glutaminowej\n- **Spektrum**: totalne, kontaktowe\n- **Zastosowanie**: rzepak, słonecznik, zboża\n- **Aplikacja**: 5–8 dni przed zbiorem\n- **Dawka**: 4–5 l/ha\n- **Cena**: 700–1 200 Kč/ha (droższy niż glifosat)\n- **Status UE**: **Glufosynat ZAKAZANY w UE od 2018** ze względu na toksyczność reprodukcyjną\n- Rynek szuka alternatyw (kwas pelargonowy, octowy)\n\n**4. Pyraflufen-etyl (Spotlight):**\n- **Mechanizm**: inhibitor PPO (kontaktowy)\n- **Zastosowanie**: ziemniaki (nać), warzywa polowe\n- **Dawka**: 0,2–0,4 l/ha\n- **Cena**: 1 000–1 500 Kč/ha\n- **Status UE**: DOZWOLONY\n\n**5. Karfentrazon-etyl (Aurora):**\n- **Mechanizm**: inhibitor PPO\n- **Zastosowanie**: ziemniaki, słonecznik\n- **Dawka**: 0,1–0,2 l/ha\n- **Status UE**: DOZWOLONY\n\n**6. Mechaniczna desykacja (alternatywa po zakazach UE):**\n\n- **Rozdrabnianie naci ziemniaków** — Spedo, Rumptstad — fizyczne niszczenie liści\n- **Desykacja termiczna** — palniki propanowe (drogie, powolne)\n- **Naturalne zasychanie** — pozostawienie łanu do dojrzewania (dłuższe okno zbiorów, większe ryzyko pogodowe)\n\n**Desykacja poszczególnych roślin uprawnych:**\n\n**Rzepak ozimy:**\n- **Termin**: BBCH 87–89 (85+ % łuszczyn dojrzałych, 80 % ziaren brązowych)\n- **Powód**: bez desykacji **8–15 % strata** z powodu pękania łuszczyn\n- **Preparat**: glifosat 2 l/ha, alternatywa karfentrazon\n- **Termin**: 10–14 dni przed zbiorem\n- **Cena 2024**: 350–500 Kč/ha\n\n**Słonecznik:**\n- **Termin**: BBCH 87–89 (ziarno brązowe, osłonka ściśle przyjmuje kształt kulisty)\n- **Powód**: wraz z rzepakiem ozimym najlepszy ROI\n- **Preparat**: glifosat 2,5 l/ha\n- **Cena**: 400–600 Kč/ha\n\n**Ziemniaki:**\n- **Termin**: 14–21 dni przed zbiorem bulw\n- **Powód**: bujna nać = utrudnione kombajnowanie, nie może przejść. Również zapobieganie przenoszeniu zarazy (*P. infestans*) do bulw.\n- **Preparat (era po Reglone)**: pyraflufen-etyl, mechaniczne rozdrabnianie, karfentrazon\n- **Cena**: 1 200–1 800 Kč/ha (wyższa niż w erze pre-Reglone)\n\n**Groch jary:**\n- **Termin**: BBCH 89 (strąki brązowe)\n- **Powód**: groch nie dojrzewa jednocześnie, **konieczne ujednolicenie**\n- **Preparat**: glifosat 2 l/ha\n- **Cena**: 400–600 Kč/ha\n\n**Pszenica:**\n- **Termin**: BBCH 87–89 (ziarno twarde, stadium mleczne minęło)\n- **Powód**: tylko przy **bardzo wilgotnych latach** (konieczność szybkiego zbioru przed deszczem)\n- **Preparat**: glifosat 2 l/ha\n- **Cena**: 350–500 Kč/ha\n- **Uwaga**: w pszenicy konsumpcyjnej **ograniczone stosowanie** ze względu na pozostałości glifosatu (MRL)\n\n**Kontrowersje wokół glifosatu przy desykacji zbóż:**\n- US EPA i EFSA: **MRL dla glifosatu w pszenicy** 10 mg/kg\n- Badania Bayer / Roundup wskazują na bezpieczne dawki, ale **obawy społeczne** są wyższe\n- **Wiele młynów UE odmawia** przyjęcia ziarna z desykowanych łanów\n- Trend: desykacja zbóż maleje, rzepak i ziemniaki pozostają\n\n**Technika aplikacji:**\n\n**Opryskiwacz**:\n- 200–300 l wody/ha\n- Uwaga na **znos** — desykant zniszczy sąsiednie łany\n- **Grubokroplistsza dysza** (mniejszy znos)\n\n**Lotniczo** (oprysk z samolotu / drona):\n- Dla **trudno dostępnych łanów** (trzcina, gospodarka wodna)\n- Droższy (1 500–3 000 Kč/ha)\n- Mniej akceptowalny regulacyjnie\n\n**Regulacje UE dotyczące desykantów:**\n\n**Zakazane w UE (2018-2024)**:\n- Diquat (2019)\n- Glufosynat (2018)\n- Mancozeb (2024)\n\n**Ryzyko zakazu**:\n- **Glifosat** — regularnie oceniany, na razie dozwolony do 2033\n\n**Alternatywy bez chemii:**\n- **Mechaniczna desykacja** (rozdrabnianie naci u ziemniaków)\n- **Desykacja termiczna** (palniki propanowe — drogie)\n- **Naturalne zasychanie** (dłuższe okno zbiorów, ryzyko pogodowe)\n- **Hodowla** odmian z **synchroniczniejszym dojrzewaniem** (rzepak)\n\n**Wpływ ekonomiczny:**\n- **Bez desykacji rzepaku**: 8–15 % strata plonu = 4 000–8 000 Kč/ha\n- **Desykacja**: 350–500 Kč/ha koszty\n- **Zwrot**: 8–15× ROI w rzepaku\n\nZob. też [[roundup]], [[herbicidy]], [[repka-ozima]], [[zemak]], [[plisen-bramborova]].",
    "alias": [
      "desiccation",
      "przedzbiorowe suszenie",
      "preharvest desiccation"
    ],
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
    "term": "Pszenica ozima",
    "kategorie": "plodiny",
    "shortDef": "Pszenica ozima to najważniejsza roślina uprawna ČR — 800 000+ ha = 30 % gruntów ornych. Sieje się jesienią (wrzesień–październik), zbiera w lipcu–sierpniu. Plon 6–8 t/ha, cena 4 500–6 500 Kč/t. Klasa konsumpcyjna A/E lub paszowa według masy hektolitrowej.",
    "longDef": "Pszenica ozima (łac. *Triticum aestivum*, ang. *winter wheat*) to **najważniejsze zboże w CZ** i 2. najszerzej uprawiana roślina (po kukurydzy powierzchniowo). W CZ zajmuje **800–950 tys. ha** rocznie, produkcja **5–7 mln t**.\n\n**Właściwości oziminy vs jarina (zob. [[ozim-jarin]]):**\n- **Siew**: 15 września – 20 października (optymalnie do 5 października w CZ)\n- **Wegetacja**: 280–310 dni (zimuje)\n- **Zbiór**: 15 lipca – 15 sierpnia\n- **Plon vs jary**: o 20–40 % wyższy (wykorzystuje zimową wilgoć, dłuższa wegetacja)\n\n**Agrotechnika:**\n\n**1. Siew (BBCH 00–09):**\n- **Głębokość**: 2–4 cm\n- **Rozstawa rzędów**: 12,5 cm (wąskie), 15 cm (standard)\n- **Obsada**: 350–450 ziaren zdolnych do kiełkowania/m² (= 180–220 kg materiału siewnego/ha dla TW 45g)\n- **Zalecenie**: późniejszy siew (po 1 październiku) = niższe ryzyko septoriozy ([[septorioza]]) ale słabszy system korzeniowy\n- **Przedplon idealny**: rzepak, groch, strączkowe (pozostawiają azot)\n- **Przedplon ryzykowny**: kukurydza (Fusarium [[fuzarioza]]), pszenica (auto-erozyjna)\n\n**2. Jesienny rozwój (BBCH 10–29):**\n- **Cel: zima** z 3–4 rozkrzeweniami, system korzeniowy w głębokości 50+ cm\n- **Nawożenie jesienią**: 30–40 kg P/ha, 60–80 kg K/ha (NPK 15-15-15 = 200 kg)\n- **Oprysk chwastów**: jesień pre-emergence (Stomp + Boxer) lub wczesna wiosna\n- **Oprysk fungicydowy**: tylko przy silnym jesiennym naporze (septoriozy)\n\n**3. Wiosenny rozwój (BBCH 30–49):**\n- **Nawożenie regeneracyjne** N (BBCH 25–29): 50–70 kg N/ha (LAV, DAM-390)\n- **Nawożenie BBCH 32**: 40–60 kg N/ha\n- **Nawożenie BBCH 39**: 30–50 kg N/ha + siarka (S 20 kg)\n- **Łącznie N**: 150–220 kg N/ha (intensywne) lub 120–160 (ekstensywne)\n- **Opryski T1 + T2** (zob. [[fungicidy]]) — SDHI + triazol\n\n**4. Kwitnienie i tworzenie ziarna (BBCH 50–89):**\n- **Oprysk T3** (BBCH 63): profilaktyka fuzariozy\n- **Wypełnianie ziarna**: ok. 40 dni (mleczne → woskowe → twarde)\n- **Kluczowe**: deszcz w czasie wypełniania zwiększa plon, susza obniża o 20–40 %\n\n**5. Zbiór (BBCH 90–99):**\n- **Wilgotność ziarna**: 13–15 % optimum (zdatne do magazynowania bez suszenia)\n- **Desykacja** (zob. [[desikace]]): w wilgotnych latach glifosat 10 dni przed zbiorem\n- **Kombajn**: 5–10 ha/h (nowoczesny)\n\n**Plony CZ 2024:**\n- **Średnia**: 6,2 t/ha\n- **Top fermy** (intensywne, Bohemia Środkowa): 9–12 t/ha\n- **Słabe fermy** (Wysoczyzna, ANC): 4–5 t/ha\n\n**Klasy jakościowe** (wg masy hektolitrowej i zawartości N):\n\n| Klasa | masa hl | NL (sucha masa) | Cena (Kč/t 2024) |\n|-------|---------|-----------------|------------------|\n| **E** (elitarna) | 82+ | 14+ % | 6 200–6 500 |\n| **A** | 78–82 | 12,5+ % | 5 800–6 200 |\n| **B** | 76–78 | 11,5+ % | 5 400–5 800 |\n| **C** (paszowa) | 74–76 | 10+ % | 4 800–5 200 |\n| **Poniżej limitu** | < 74 | < 10 | 4 200–4 600 |\n\n**Ekonomia 2024:**\n- **Koszty** na 1 ha: 28 000–38 000 Kč (materiał siewny, nawozy, opryski, paliwo, zbiór)\n- **Przychody 6,5 t/ha × 5 500 Kč = 35 750 Kč/ha**\n- **Marża**: -2 000 do +5 000 Kč/ha (wąska, wrażliwa na ceny)\n- **Dopłaty BISS + CISS + EKO**: ~5 000–7 000 Kč/ha zwiększa marżę\n\n**Odmiany 2024 (rynek CZ):**\n- **Bohemia** — toleruje suszę, klasa A\n- **Sailor** — top plon, klasa B-A\n- **Vlasta** — odporność na septoriozę\n- **Genius** — paszowa, top plon\n- **RGT Sacramento** (import FR) — klasa A, szeroko rozpowszechniona\n\n**Główne choroby:** [[septorioza]] (#1), [[fuzarioza]], [[rzi]]\n\n**Główne szkodniki:** mszyce (wektory BYDV), skrzypionka zbożowa, ploniarka zbożówka\n\n**Regulacje UE:**\n- **CAP BISS + CISS**: ~3 600 Kč/ha (2024)\n- **Reżim EKO** (rośliny okrywowe, no-till): +1 300 Kč/ha\n\nZob. też [[ozim-jarin]], [[osevni-postup]], [[fungicidy]], [[septorioza]], [[fuzarioza]], [[hektolitr]], [[psenice-jarni]].",
    "alias": [
      "winter wheat",
      "Triticum aestivum",
      "ozimina pszenna"
    ],
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
    "term": "Pszenica jara",
    "kategorie": "plodiny",
    "shortDef": "Pszenica jara to uzupełniająca roślina uprawna w CZ — 20 000–40 000 ha (łatka po nieudanej pszenicy ozimej lub specjalistyczne odmiany). Sieje się w marcu–kwietniu, zbiera w sierpniu. Plon 4–6 t/ha (o 1–2 t/ha niższy niż ozimej).",
    "longDef": "Pszenica jara (łac. *Triticum aestivum* — odmiana jara, ang. *spring wheat*) to **uzupełniająca roślina uprawna** w CZ — w normalnych latach tylko 20 000–40 000 ha. Zazwyczaj jako **zastępstwo po nieudanej ozimej** (wymarzanie, wymoknięcie zimą) lub specjalistyczne odmiany do jakości piekarskiej.\n\n**Kluczowe różnice w stosunku do ozimej (zob. [[psenice-ozima]]):**\n\n| Parametr | Ozima | Jara |\n|----------|------|-------|\n| Siew | wrzesień–październik | marzec–kwiecień |\n| Wegetacja | 280–310 dni | 110–140 dni |\n| Zbiór | lipiec–sierpień | sierpień |\n| Plon | 6–8 t/ha | 4–6 t/ha |\n| Masa hektolitrowa | 76–82 kg/hl | 74–78 kg/hl |\n| Klasa jakościowa | E/A/B (spożywcza) | A/B (spożywcza) lub paszowa |\n| Nawożenie N | 150–220 kg/ha | 100–140 kg/ha |\n| Koszty | 28–38 tys. Kč/ha | 20–28 tys. Kč/ha |\n| Ryzyko żniw | mokre lata = fuzarioza | mokre lata = wyleganie |\n\n**Kiedy się stosuje:**\n\n1. **Roślina łatkowa** — gdy ozima wymarzła lub nie została zasiana w terminie (mokra jesień)\n2. **Piekarskie specjalności** — niektóre odmiany mają wyższy poziom glutenu dla jakości piekarskiej\n3. **Obszary północne** CZ (Karkonosze, Szumawa) — gdzie ozima zimuje słabo\n4. **Gospodarstwa ekologiczne** — krótsza wegetacja = mniejsza presja chorób = mniej oprysków\n\n**Agrotechnika:**\n\n**Siew:**\n- **Optymalny termin**: gdy tylko gleba umożliwia wjazd maszyną (typowo 10.–25. marca)\n- **Późniejszy siew** (po 10. kwietnia) = plon spada o 100–200 kg/ha/tydzień\n- **Głębokość**: 3–5 cm\n- **Obsada**: 450–550 ziaren kiełkujących/m² (wyższa niż ozimej, ze względu na krótszą wegetację i mniejsze krzewienie)\n\n**Nawożenie:**\n- **Przy siewie**: 80–100 kg N/ha (szybki start, jara nie zdąży zmineralizować)\n- **BBCH 32**: 30–50 kg N/ha\n- **BBCH 39**: 20–30 kg N/ha\n- **Łącznie**: 130–180 kg N/ha\n- **P + K**: tylko połowa vs ozima (krótsza wegetacja)\n\n**Ochrona**:\n- **Chwasty**: nalistne (Granstar, Hussar) — mniejsza presja niż u ozimej\n- **Fungicydy**: 1–2 opryski (T1 + T2) — mniejsza presja septoriozy\n- **Insektycydy**: mszyce (BYDV), chowacz zbożowy — pyretroid\n\n**Odmiany CZ 2024:**\n- **Septima** — top plon jary\n- **KWS Sharki** — jakość piekarska\n- **Tybalt** — podejście ekologiczne, odporność\n\n**Ekonomika:**\n- **Koszty**: 22 000–28 000 Kč/ha (niższe niż ozima — mniej N, mniej oprysków)\n- **Plon**: 4,5 t/ha × 5 200 Kč = 23 400 Kč/ha\n- **Marża**: typowo -2 000 do +3 000 Kč/ha\n- **Jako łatka po ozimej**: przynajmniej „jakiś plon\" jest lepszy niż nic\n\n**Badania i hodowla:**\n- **Odmiany CZ**: VURV Praha-Ruzyně, Selgen\n- **Trend**: poszukiwanie odmian z wyższą tolerancją na suszę (zmiana klimatu)\n\nZob. też [[psenice-ozima]], [[ozim-jarin]], [[osevni-postup]], [[fungicidy]], [[hektolitr]].",
    "alias": [
      "spring wheat",
      "jarka pszenica"
    ],
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
    "term": "Jęczmień słodowy",
    "kategorie": "plodiny",
    "shortDef": "Jęczmień słodowy to jara roślina uprawna przeznaczona do produkcji słodu (browarnictwo). CZ ma 100 000+ ha. Kluczowe parametry: masa hl min. 64 kg, azot 1,5–1,9 % (NISKI!), zdolność kiełkowania 95+ %. Premia za jakość 800–1 500 Kč/t.",
    "longDef": "Jęczmień słodowy (łac. *Hordeum vulgare*, ang. *malting barley*) to **jara roślina uprawna** przeznaczona specjalnie do produkcji **słodu** — podstawowego surowca dla **browarnictwa**. CZ jest tradycyjnym producentem (Plzeňský prazdroj, Budvar, Staropramen).\n\n**Kluczowa różnica od paszowego** (zob. [[jecmen-krmny]]):\n- **Niska zawartość azotu** (1,5–1,9 %) — browar potrzebuje **mało białka, dużo skrobi** do fermentacji na etanol\n- **Wysoka masa hl** (min. 64 kg/hl, ideał 68+)\n- **Wyrównana wielkość ziarna** (jednorodne kiełkowanie słodu)\n- **Wysoka zdolność kiełkowania** (95+ %) — bez kiełkowania nie można zrobić słodu\n- **Brak fuzariozy** (mykotoksyny DON w piwie niedopuszczalne)\n\n**Właściwości agronomiczne:**\n\n**Siew:**\n- **Termin**: 10–25 marca (im wcześniej, tym lepiej — odporny na chłód)\n- **Późniejszy siew** = wyższy azot w ziarnie (zły dla słodu!)\n- **Głębokość**: 3–4 cm\n- **Obsada**: 350–420 ziaren zdolnych do kiełkowania/m²\n\n**Nawożenie — UWAGA:**\n- **Nawożenie N**: tylko 60–100 kg/ha (niżej niż pszenica!)\n- **Wyższy N → wyższe białko w ziarnie → niespełnienie limitu słodowniczego**\n- **Timing**: wszystko do BBCH 32\n- **P + K**: 30–50 kg P, 60–100 kg K\n\n**Ochrona:**\n- **Chwasty**: standard dla zbóż jarych (Granstar, Hussar)\n- **Fungicydy**: T1 (BBCH 31–32) + T2 (BBCH 39–49) — Ramularia (Zymoseptoria), mączniak\n- **Insektycydy**: mszyce (BYDV), żerujące na liściach\n\n**Parametry jakościowe słodownictwa** (standard CZ):\n\n| Parametr | Min. | Optimal | Kara |\n|----------|------|---------|------|\n| Masa hl | 64 kg/hl | 68+ | -200 Kč/t poniżej 64 |\n| Azot | 1,5–1,9 % | 1,5–1,7 % | -500 Kč/t powyżej 2,1 % |\n| Zdolność kiełkowania (4 dni) | 95 % | 98+ % | niedodane poniżej 90 % |\n| Wyrównanie (sito 2,5 mm) | 90 % | 95+ % | -200 Kč/t poniżej 88 % |\n| Wilgotność | 14 % max | 13 % | -150 Kč/t powyżej 15 % |\n\n**Zbiór:**\n- **Wilgotność ziarna**: 14 % optimum\n- **Ważne**: nie zbierać przy deszczu (ryzyko DON po deszczach)\n- **Suszenie**: maks. 40 °C (wyższa temperatura = utrata zdolności kiełkowania)\n\n**Plony:**\n- **Średnia CZ**: 5,2 t/ha\n- **Top fermy**: 7+ t/ha\n- **Plony odmianowe** vs paszowy: o 0,5–1 t/ha niższe (cena za jakość)\n\n**Cena 2024:**\n- **Standard słodowy**: 5 800–7 000 Kč/t (kontrakt z wyprzedzeniem)\n- **Premia za top jakość** (niski N, wysoka zdolność kiełkowania): +800–1 500 Kč/t\n- **Zbyt paszowy** (nie spełnił limitu): 4 800–5 500 Kč/t\n\n**Odmiany CZ 2024:**\n- **Bojos** — najpowszechniejszy, wysoka masa hl\n- **Laudis** — nowoczesny, plon + jakość\n- **Calcule** — kontrakt Heineken\n- **Spartacus** — nowy, wysoki plon\n- **Bonus** — odporny na chłód\n\n**Rynek i kontrakty:**\n\n**Kontraktowe uprawy** (dominujące):\n- **Plzeňský prazdroj** — kontrakt z rolnikami 1 rok z wyprzedzeniem, gwarantowana cena\n- **Budvar** — własny skup\n- **Staropramen** — belgijska własność, kontrakt UE\n- **Heineken** — globalny nabywca\n\n**Rynek spotowy** (wolna sprzedaż):\n- **MATIF** (Paryż) — ceny futures na jęczmień\n- **Zmienny** — zależy od urodzaju w UE, Rosji, Ukrainie\n\n**Eksport:**\n- CZ eksportuje 200 000–300 000 t/rok słodowego (Niemcy, Wielka Brytania, Belgia)\n\n**Zmiana klimatu:**\n- **Susza w kwietniu–czerwcu** = krótka wegetacja = wysoki N w ziarnie\n- **Browary naciskają** na uprawy w północniejszych regionach (Polska, Skandynawia)\n\n**Uwaga**: CZ ma **historyczną tradycję** — chmiel żatecki + słodowy + Plzeňský prazdroj = podstawa czeskiej jakości piwa, tożsamość państwa.\n\nZob. też [[jecmen-krmny]], [[psenice-ozima]], [[fungicidy]], [[hektolitr]], [[ozim-jarin]].",
    "alias": [
      "malting barley",
      "browarny jęczmień",
      "Hordeum vulgare malt"
    ],
    "related": [
      "jecmen-krmny",
      "psenice-ozima",
      "fungicidy",
      "hektolitr"
    ]
  },
  {
    "slug": "jecmen-krmny",
    "term": "Jęczmień paszowy",
    "kategorie": "plodiny",
    "shortDef": "Jęczmień paszowy to ozima lub jara roślina uprawiana na paszę dla bydła, trzody chlewnej i drobiu. Wyższy plon (6–8 t/ha) niż browarny, wyższa zawartość azotu. Cena 4 600–5 400 Kč/t. W CZ ponad 150 000 ha (kombinacja ozimego i jarego).",
    "longDef": "Jęczmień paszowy (łac. *Hordeum vulgare*, ang. *feed barley*) to **ozima lub jara roślina** uprawiana w celu **żywienia zwierząt gospodarskich** (bydło, trzoda chlewna, drób). W odróżnieniu od browarnego (zob. [[jecmen-sladovnicky]]) nie wymaga niskiej zawartości azotu — wręcz przeciwnie, wyższy N oznacza wyższe białko w paszy = wyższa wartość.\n\n**Właściwości agronomiczne:**\n\n**Ozimy vs jary jęczmień paszowy:**\n\n| Parametr | Ozimy | Jary |\n|----------|-------|------|\n| Siew | wrzesień–październik | marzec–kwiecień |\n| Zbiór | lipiec | sierpień |\n| Plon | 7–9 t/ha | 5–7 t/ha |\n| Nawożenie N | 140–180 kg | 90–130 kg |\n| Koszty | 25 000–32 000 Kč/ha | 20 000–25 000 Kč/ha |\n\n**Ozimy dominuje** w CZ do celów paszowych (lepsze plony).\n\n**Siew (ozimy):**\n- **Termin**: 20 września – 15 października (= wcześniej niż ozima pszenica o 1–2 tygodnie)\n- **Głębokość**: 3–4 cm\n- **Obsada**: 350–420 ziaren kiełkujących/m²\n\n**Nawożenie (ozimy):**\n- **Jesień**: 20 kg N + 40 kg P + 80 kg K (= NPK 15-15-15 200 kg/ha)\n- **Wiosna BBCH 25**: 60–80 kg N/ha (LAV, DAM)\n- **Wiosna BBCH 32**: 40–60 kg N/ha\n- **Łącznie N**: 130–180 kg/ha\n\n**Zastosowanie paszowe:**\n\n**Dla bydła:**\n- **Śruta** (zob. [[srotovnik]]) — śrutowane ziarno do TMR (zob. [[tmr]])\n- **Dawka**: 3–6 kg dawki pokarmowej / krowa / dzień\n- **Wartości odżywcze**: 12 % CP, 7,5 MJ NEL/kg, wysoka skrobia\n\n**Dla trzody chlewnej:**\n- **Drobniej mielona śruta** — 30–60 % mieszanki paszowej\n- **Wspomaga** trawienie (błonnik), mniej skrobi niż kukurydza\n\n**Dla drobiu:**\n- **Mielony** — 10–20 % mieszanki paszowej (mniej niż kukurydza — wyższy błonnik nie jest idealny dla drobiu)\n- **Szczególnie dla niosek** (wyższy błonnik = lepsza perystaltyka)\n\n**Cena 2024:**\n- **Paszowy jęczmień**: 4 600–5 400 Kč/t\n- **Różnica wobec browarnego**: -800 do -1 500 Kč/t (zależy od bieżącego popytu browarnianego)\n\n**Zbiór:**\n- **Wilgotność ziarna**: 14 % optimum\n- **Mniej wymagający timing** niż browarny (nie trzeba unikać zbioru przy mokrej pogodzie — do celów paszowych to nie ma znaczenia)\n\n**Odmiany:**\n\n**Ozime paszowe:**\n- **KWS Tenor** — najwyższy plon\n- **Cassia** — popularna, solidna\n- **Wootan** — nowoczesna, kontrakt paszowy\n\n**Jare paszowe:**\n- **Vladimir** — wysoki plon\n- **Salome** — niezależność\n\n**Choroby i ochrona:**\n- **Rynchosporium** (plamistość siatkowa) — typowy dla jęczmienia\n- **Ramularia** (liściowa) — rosnący problem lat 2020\n- **Mączniak prawdziwy** — częsty problem\n- **Fungicydy**: T1 + T2 (jak u pszenicy, zob. [[fungicidy]])\n- **Insektycydy**: mszyce (BYDV), skrzypionki\n\nZob. też [[jecmen-sladovnicky]], [[psenice-ozima]], [[tmr]], [[krmne-davky]], [[hektolitr]], [[srotovnik]].",
    "alias": [
      "feed barley",
      "paszowy jęczmień ozimy/jary",
      "Hordeum vulgare feed"
    ],
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
    "term": "Żyto ozime",
    "kategorie": "plodiny",
    "shortDef": "Żyto ozime to zboże uprawiane na ubogich glebach i w chłodniejszych/górskich rejonach Czech. Plon 5–7 t/ha, cena 4 200–5 200 Kč/t. Główne zastosowania: chleb (kwaszony żytni), żytne pieczywo pełnoziarniste, gorzelnie, pasza.",
    "longDef": "Żyto ozime (łac. *Secale cereale*, ang. *rye*) to **ozima roślina zbożowa**, historycznie drugie najważniejsze zboże w CZ po pszenicy. Dziś raczej niszowe — uprawiane na **ubogich piaszczystych glebach** i w **rejonach górskich**, gdzie pszenica nie daje dobrych plonów.\n\n**Powierzchnia w CZ 2024**: ~25 000 ha (tendencja spadkowa, w latach 50. XX w. było 400 000+ ha)\n\n**Właściwości:**\n\n**Agrotechnika:**\n\n**Siew:**\n- **Termin**: 1.–25. września (= wcześniej niż pszenica o 2–3 tygodnie — żyto wymaga dłuższego wzrostu jesiennego)\n- **Głębokość**: 2–4 cm\n- **Obsada**: 280–350 ziaren kiełkujących/m² (mniej niż pszenica — żyto mocno się krzepi)\n- **Odpowiedni przedplon**: ziemniaki, rzepak, rośliny strączkowe\n\n**Nawożenie:**\n- **Jesień**: 20 kg N + 30 kg P + 60 kg K\n- **Wiosna BBCH 25**: 50–70 kg N/ha\n- **Wiosna BBCH 32**: 30–50 kg N/ha\n- **Łącznie N**: 80–120 kg/ha (mniej niż pszenica — żyto toleruje ubogie gleby)\n\n**Zbiór:**\n- **Wilgotność**: 13–15 %\n- **Ryzyko wylegania**: żyto jest wyższe (130–180 cm) niż pszenica (90–110 cm) — wiatr je łatwo powala\n\n**Plony:**\n- **Średnia CZ**: 5,5 t/ha (poprawa względem historii dzięki żytu hybrydowemu)\n- **Żyto hybrydowe** (KWS Sortiment): 7–8 t/ha (lepsze niż tradycyjne populacje)\n\n**Zastosowanie:**\n\n**1. Chleb i pieczywo (60 % zużycia):**\n- **Zakwas żytni** — niezbędny do chleba (białka żyta nie tworzą glutenu jak pszenica)\n- **Chleb szumawski, sygnowany żytni** — tradycyjne piekarstwo CZ\n- **Mąki żytnie**: razowa T75 (jasna), T80 (chlebowa), T200 (pełnoziarnista)\n\n**2. Gorzelnie (15 %):**\n- **Spirytus żytni** — tradycyjny destylat CZ\n- **Wódka** — Polska, Rosja (inna tradycja)\n\n**3. Pasza (20 %):**\n- **Dla bydła**: do TMR jako alternatywa pszenicy\n- **Dla trzody**: tylko do 20 % mieszanki (wyższy błonnik)\n\n**4. Biopaliwa / bioetanol (5 %):**\n- **Niektóre kraje UE** (Niemcy) dotowały bioetanol z żyta\n\n**Cena 2024:**\n- **Żyto spożywcze**: 4 600–5 200 Kč/t\n- **Żyto paszowe**: 4 200–4 600 Kč/t\n- **Bio żyto**: 6 800–8 500 Kč/t (premia dla bio piekarnictwa)\n\n**Żyto hybrydowe** (kluczowy skok technologiczny od lat 90. XX w.):\n- **KWS** (Niemcy) dominuje rynkiem żyta hybrydowego\n- **System termiczny** zapylania — mieszańce F1 tylko z certyfikowanego materiału siewnego (nie można zbierać do siewu)\n- **Plon**: +30–50 % vs tradycyjne populacje\n- **Cena materiału siewnego**: 4–6× wyższa niż tradycyjnego (skompensowana plonem)\n\n**Odmiany CZ 2024:**\n- **KWS Bono** — hybryda, najwyższy plon\n- **KWS Vinetto** — hybryda, solidna\n- **Selgo** — tradycyjna populacja, tani materiał siewny\n- **Souvenir** — podejście bio\n\n**Choroby i ochrona:**\n- **Sporysz (buławinka)** — *Claviceps purpurea* — historycznie **zatruwał Europę**, dziś pod kontrolą. **Mykotoksyny** (ergotaminy), ryzyko w mokrych latach.\n- **Rdze** (zob. [[rzi]]) — mniejsza presja niż u pszenicy\n- **Septoriozy** — minimalne\n- **Zabiegi**: lżejszy program niż pszenica (1 fungicyd)\n\n**Regulacje UE:**\n- **CAP BISS + CISS** takie same jak pszenica\n- **Rolnictwo ekologiczne** — bio żyto popularne u ekologicznych gospodarstw (mniej oprysków, odporna)\n\n**Wymiar kulturowy:**\n- **Żyto to „zboże biedaków\"** — historycznie ludzie ubodzy jedli chleb żytni, bogaci pszenny\n- **Dziś trend odwrócony** — chleb żytni ma wizerunek \"zdrowszego\" (wyższy błonnik, lepszy indeks glikemiczny)\n- **Ciemne pieczywo** — pełnoziarniste żytnie, żytnie krakersy — trend wellness\n\nZob. też [[psenice-ozima]], [[oves-jarni]], [[ozim-jarin]], [[rzi]], [[hektolitr]].",
    "alias": [
      "rye",
      "Secale cereale",
      "ozime żyto"
    ],
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
    "term": "Owies jary",
    "kategorie": "plodiny",
    "shortDef": "Owies jary to zboże uprawiane głównie w chłodniejszych i północniejszych rejonach Czech. Plon 3,5–5 t/ha, cena 4 000–5 500 Kč/t. Zastosowanie: pasza dla koni, spożycie ludzkie (płatki owsiane, müsli), zielona pasza.",
    "longDef": "Owies jary (łac. *Avena sativa*, ang. *oats*) to **jare zboże** z tradycją w CZ na uboższych i chłodniejszych glebach. Powierzchnia w CZ 2024: ~35 000 ha. Tendencja: rosnąca ze względu na pozytywny wizerunek zdrowotny (płatki owsiane, roślinne alternatywy).\n\n**Właściwości:**\n\n**Agrotechnika:**\n\n**Siew:**\n- **Termin**: 15 marca – 15 kwietnia (toleruje chłód, wczesny siew)\n- **Głębokość**: 3–4 cm\n- **Obsada**: 350–450 ziaren kiełkujących/m²\n\n**Nawożenie:**\n- **Przy siewie**: 60–80 kg N/ha\n- **BBCH 32**: 30–40 kg N/ha\n- **Łącznie N**: 80–120 kg/ha (owies nie wykorzystuje wysokich dawek N, wylegnie)\n\n**Zbiór:**\n- **Wilgotność**: 13–15 %\n- **Ryzyko wylegania**: wysokie (110–140 cm), cienka słoma\n- **Kluczowe**: NIE przenawozić N\n\n**Plony:**\n- **Średnia CZ**: 4,2 t/ha\n- **Najlepsze gospodarstwa**: 6+ t/ha\n\n**Zastosowanie:**\n\n**1. Spożycie ludzkie (45 %):**\n- **Płatki owsiane** (rolled oats) — parzone + walcowane ziarno\n- **Müsli, granola** — popularne zdrowe śniadanie\n- **Mleko owsiane** (oat milk) — silny trend lat 2020, roślinny substytut\n- **Piekarnictwo** — pełnoziarnisty chleb z owsem\n- **Dieta** — owies ma **β-glukan** (błonnik, obniża cholesterol)\n\n**2. Pasza dla koni (35 %):**\n- **Tradycyjna pasza końska** — energia + błonnik + dobra strawność\n- **2–6 kg/koń/dzień** w zależności od obciążenia\n- **Konie wyścigowe** — wyższy udział owsa\n\n**3. Pasza dla bydła (15 %):**\n- **Rzadziej stosowany** niż jęczmień\n- **Dla młodych cieląt** — łatwo strawny\n\n**4. Zielona pasza / roślina okrywowa (5 %):**\n- **Owies jako roślina okrywowa** — biomasa do mulczu, sekwestracja węgla\n- **Owies + wyka mieszanka** — mieszanka strączkowo-zbożowa na paszę\n\n**Cena 2024:**\n- **Owies spożywczy** (premium do płatków): 5 200–5 800 Kč/t\n- **Owies paszowy**: 4 200–4 800 Kč/t\n- **Bio owies**: 7 500–9 500 Kč/t (wysoka premia dla bio müsli)\n\n**Odmiany CZ 2024:**\n- **Atego** — najwyższy plon paszowy\n- **Husar** — spożywczy\n- **Rozmar** — tradycyjna populacja\n- **Spurt** — nowoczesna, solidna\n\n**Choroby:**\n- **Rdza owsiana** (Puccinia coronata) — liściowa\n- **Helminthosporium** (plamistość) — mokre lata\n- **Mniejsza presja** niż pszenica → mniej oprysków\n\n**Ochrona:**\n- **Chwasty**: przed wschodami (Stomp)\n- **Fungicydy**: 1 oprysk T2 (BBCH 39) — profilaktyczny\n- **Insektycydy**: minimalne (mszyce BYDV)\n\n**Podejście bio:**\n- **Owies** idealny dla gospodarstwa ekologicznego (mało oprysków, odporny)\n- **Premia ceny bio** kompensuje plon -20 % vs konwencjonalny\n\n**Ekonomika:**\n- **Koszty**: 18 000–24 000 Kč/ha\n- **Plon 4,5 t/ha × 4 800 Kč = 21 600 Kč/ha**\n- **Marża**: zazwyczaj wąska (-1 000 do +3 000 Kč/ha)\n- **Plus dopłaty BISS + CISS + EKO**: czynią z niego korzystniejszą roślinę\n\n**Rynek i trendy:**\n- **Rewolucja roślinno-pożywkowa** — mleko owsiane = 2× wzrost spożycia w latach 2020\n- **Mleko owsiane vs migdałowe** — owsiane ma lepszy ślad środowiskowy, rozpowszechnia się w UE\n- **Bio owies**: rosnący popyt dla diety niemowlęcej Hipp, źródeł müsli\n\nZob. też [[psenice-ozima]], [[zito-ozime]], [[ozim-jarin]], [[hektolitr]], [[mezi-plodiny]].",
    "alias": [
      "oats",
      "Avena sativa",
      "jary owies"
    ],
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
    "term": "Pszenżyto",
    "kategorie": "plodiny",
    "shortDef": "Pszenżyto to zboże powstałe ze skrzyżowania pszenicy (Triticum) i żyta (Secale). Łączy cechy obu — plonowanie pszenicy + odporność żyta. Głównie zastosowanie paszowe, plon 6–8 t/ha, cena 4 400–5 200 Kč/t.",
    "longDef": "Pszenżyto (łac. *× Triticosecale*, ang. *triticale*) to **sztucznie wyhodowane zboże** powstałe ze skrzyżowania **pszenicy** (*Triticum*) × **żyta** (*Secale cereale*). Łączy cechy obojga rodziców: **plonowanie pszenicy + odporność żyta** na ubogie gleby i choroby.\n\n**Historia:**\n- **1875** — pierwszy mieszaniec opisany przez szkockiego hodowcę Stephena Wilsona\n- **1937** — kanadyjski agronom L.H. Newman stworzył pierwsze funkcjonalne pszenżyto\n- **Lata 60. XX w.** — CIMMYT (Meksyk) uruchomił systematyczny program hodowlany\n- **Lata 80. XX w.** — masowe rozpowszechnienie w Europie (Polska, NRD, CSRS)\n- **2024** — światowa powierzchnia 15 mln ha (Polska nr 1, Niemcy nr 2, CZ ~50 000 ha)\n\n**Właściwości:**\n\n**Ozime vs jare pszenżyto:**\n- **Ozime** dominuje w CZ (90 % powierzchni)\n- **Jare** tylko jako poprawka po nieudanym ozimym\n\n**Siew (ozime):**\n- **Termin**: 15 września – 5 października\n- **Głębokość**: 3–5 cm\n- **Obsada**: 320–400 ziaren kiełkujących/m²\n- **Odpowiedni przedplon**: ziemniaki, rzepak, rośliny strączkowe\n\n**Nawożenie:**\n- **Jesień**: 25 kg N + 30 kg P + 60 kg K\n- **Wiosna BBCH 25**: 60–80 kg N/ha\n- **Wiosna BBCH 32**: 30–50 kg N/ha\n- **Łącznie N**: 100–140 kg/ha (między pszenicą a żytem)\n\n**Zbiór:**\n- **Wilgotność**: 13–15 %\n- **Ryzyko wylegania**: średnie (między pszenicą a żytem)\n\n**Plony:**\n- **Średnia CZ**: 6,8 t/ha\n- **Najlepsze gospodarstwa**: 9+ t/ha\n- **Lepszy niż żyto** o 1–2 t/ha, **nieco poniżej pszenicy** o 0,5–1 t/ha\n\n**Zastosowanie:**\n\n**1. Pasza (85 %):**\n- **Dla bydła**: do TMR (zob. [[tmr]]) — substytut pszenicy/jęczmienia\n- **Dla trzody**: główny składnik zbożowy\n- **Dla drobiu**: 20–40 % mieszanki\n\n**2. Bioetanol (10 %):**\n- **Gorzelnie** — wysoka skrobia, dobra fermentacja\n- **Dotowane w UE** w niektórych krajach (Polska, Niemcy)\n\n**3. Spożycie ludzkie (5 %):**\n- **Specyficzne pieczywo** (zorientowane zdrowotnie)\n- **Mieszanki müsli**\n- **Słabiej rozwinięta** kategoria\n\n**Cena 2024:**\n- **Paszowe pszenżyto**: 4 400–5 000 Kč/t\n- **Kontrakt bioetanolowy**: 4 200–4 600 Kč/t\n- **Bio pszenżyto**: 6 500–8 000 Kč/t\n\n**Odmiany CZ 2024:**\n- **Trisem** — najwyższy plon\n- **Triamant** — odporność\n- **Kassiopeia** — nowoczesna, import DE\n- **Borowik** — import polski\n\n**Choroby i ochrona:**\n- **Septorioza** — mniejsza presja niż u pszenicy\n- **Rdze** — średnia presja (bardziej wrażliwe niż żyto, mniej niż pszenica)\n- **Mączniak prawdziwy** — mniejsza presja\n- **Opryski**: 1–2 fungicydy (mniej intensywny niż pszenica)\n- **Rolnictwo ekologiczne**: odpowiednie (mniej oprysków)\n\n**Zalety pszenżyta:**\n1. **Odporne** — toleruje ubogie gleby, suszę\n2. **Mniej oprysków** — niższe koszty, odpowiednie dla bio\n3. **Wysoki plon** vs żyto\n4. **Strawne** dla bydła i trzody\n5. **Zdolność okrywowa** — biomasa do mulczu\n\n**Wady:**\n1. **Niższa cena** niż spożywcza pszenica\n2. **Ograniczony rynek** spożycia ludzkiego\n3. **Mniej odmian** niż pszenica/jęczmień\n\n**Ekonomika:**\n- **Koszty**: 22 000–28 000 Kč/ha\n- **Plon 7 t/ha × 4 700 Kč = 32 900 Kč/ha**\n- **Marża**: 4 000–10 000 Kč/ha (lepsza niż pszenica!)\n- **Dopłaty BISS + CISS + EKO**: standardowe\n\n**Strategicznie dla CZ:**\n- **Dla średniej wielkości gospodarstwa** w ONW (Vysočina, Beskidy) — pszenżyto często **lepsza opcja niż pszenica**\n- **Dla gospodarstwa bio** — mniejsza presja chorób, niższe nakłady\n- **Dla chowu bydła** — własna pasza z własnego pola\n\nZob. też [[psenice-ozima]], [[zito-ozime]], [[jecmen-krmny]], [[ozim-jarin]], [[krmne-davky]].",
    "alias": [
      "triticale",
      "mieszaniec pszenicy i żyta",
      "pszenożyto"
    ],
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
    "term": "Mak siewny",
    "kategorie": "plodiny",
    "shortDef": "Mak siewny to jara oleista roślina, w której obszarze CZ jest globalną potęgą — produkuje 50–70 % światowego spożywczego maku (niebieskie ziarno). Plon 0,8–1,4 t/ha nasion, cena 35 000–55 000 Kč/t. Główny produkt: nasiona piekarnicze, olej makowy, makówki (ograniczone ze względu na opiaty).",
    "longDef": "Mak siewny (łac. *Papaver somniferum*, ang. *opium poppy* lub *poppy seed*) to **jara oleista roślina** o globalnej specyfice — **CZ produkuje 50–70 % światowego spożywczego maku** (niebieskie ziarno do celów piekarniczych). Tradycyjny obszar: Haná, Polabí, Vysočina.\n\n**Powierzchnia w CZ 2024**: 30 000–40 000 ha (zmienność w zależności od ceny)\n**Produkcja**: 25 000–35 000 t/rok\n\n**Właściwości:**\n\n**Agrotechnika:**\n\n**Siew:**\n- **Termin**: 25 marca – 25 kwietnia (toleruje późne przymrozki)\n- **Głębokość**: 0,5–1 cm (miniaturowe nasionko, płytki siew!)\n- **Obsada**: 80–100 ziaren kiełkujących/m² (= 1,5–2 kg materiału siewnego/ha, HW 0,4 g)\n- **Rozstawa rzędów**: 25–30 cm (wąska) lub 45 cm (szersza, do pielnika)\n\n**Nawożenie:**\n- **Przy siewie**: 60–80 kg N/ha\n- **BBCH 30**: 30–50 kg N/ha\n- **Łącznie N**: 80–130 kg/ha\n\n**Ochrona:**\n- **Chwasty**: przed wschodami (Bromotril, Metaza Plus) + po wschodach\n- **Insektycydy**: słodyszek makowy (*Ceutorhynchus macula-alba*), gryząc\n- **Fungicydy**: helmintosporioza, pleśń maku — mniejsza presja\n- **Mak to „czysta\" roślina** — mało oprysków, odpowiednia dla bio\n\n**Zbiór:**\n- **Termin**: sierpień, wilgotność makówek 12–14 %\n- **Kombajn makowy** — specjalny adapter do kombajnu (oddziela nasiona od makówek)\n- **Kluczowe**: nie rozsypać nasion podczas manipulacji\n\n**Plony:**\n- **Średnia CZ**: 0,9 t/ha nasion\n- **Najlepsze gospodarstwa**: 1,4 t/ha\n- **Koszty na 1 ha**: 18 000–25 000 Kč\n\n**Zastosowanie:**\n\n**1. Nasiona piekarnicze (niebieskie ziarno, 80 %):**\n- **Tradycyjne piekarnictwo CZ** — strucle z makiem, makowiec, makówki\n- **Eksport**: Niemcy, Holandia, USA, Polska\n- **Cena 2024**: 35 000–55 000 Kč/t (wysoka zmienność)\n\n**2. Olej makowy (10 %):**\n- **Tłoczenie** niebieskich nasion\n- **Olej** — premium kulinarny olej, wysoka cena\n- **Gładki profil omega-6**, dobry smak\n\n**3. Makówki (5 %):**\n- **Suszone makówki** — historycznie w medycynie ludowej (działanie uspokajające)\n- **Ze względu na opiaty** (morfina, kodeina) w makówkach — **ograniczone zastosowanie**, regulowane\n- **Przemysł farmaceutyczny** — ekstrakcja leków opioidowych (= **uprawy kontraktowe dla Zentiva, Pharmos**)\n\n**Aspekty prawne i regulacyjne:**\n- **Ustawodawstwo CZ**: uprawa maku **legalna** do celów spożywczych + farmaceutycznych\n- **Wymagane rejestracje** w SZIF, powierzchnia poniżej 5 ha bez specjalnej licencji\n- **Kontrole**: ÚKZÚZ, często monitorowany ze względu na ryzyko nielegalnej produkcji narkotyków\n- **Suszone makówki po zbiorze** — muszą być **zniszczone lub przetworzone** w licencjonowanym zakładzie\n\n**Rynek i marketing:**\n- **Giełda w Bruntálu** — tygodniowy rynek makowy, centrum CZ\n- **Rynek kasowy** vs **uprawa kontraktowa** (Pharmos)\n- **Zmienność cen**: 30 000 ↔ 70 000 Kč/t w przedziale 2 lat\n- **Eksport**: 70 % czeskiej produkcji trafia do UE + USA\n\n**Odmiany CZ 2024:**\n- **Major** — niebieskie ziarno, najwyższy plon\n- **Maratón** — odporność\n- **Opal** — białe ziarno (eksport do Azji)\n- **Onyx** — nowoczesna\n\n**Ekonomika:**\n- **Koszty**: 18 000–25 000 Kč/ha\n- **Plon 1 t × 45 000 Kč = 45 000 Kč/ha**\n- **Marża**: 20 000–27 000 Kč/ha (wysoka!)\n- **Ryzyko**: zmienność cen + plony wrażliwe na pogodę\n\n**Znaczenie kulturowe:**\n- **Mak w kuchni CZ** — tożsamość kulturowa (makówki, makowiec, kołacze)\n- **Boże Narodzenie** — tradycyjne potrawy mączne z makiem\n- **Wielkanoc** — pisanki, ogród makowy\n\n**Zmiana klimatu:**\n- **Susza w kwietniu–czerwcu** = niższy plon\n- **Mokre lata** = pleśń makówek\n- **Kluczowe**: głęboki system korzeniowy (lepiej znosi suszę niż pszenica)\n\n**Bio mak:**\n- **Bio mak** = 50–80 % wyższa cena\n- **Rynek mały** ale rośnie (premia organic dla wegetariańskiego/zdrowotnego piekarnictwa)\n\nZob. też [[ozim-jarin]], [[slunecnice]], [[repka-ozima]], [[hrach-set]].",
    "alias": [
      "poppy",
      "Papaver somniferum",
      "mak niebieskopestkowy"
    ],
    "related": [
      "ozim-jarin",
      "slunecnice",
      "repka-ozima"
    ]
  },
  {
    "slug": "slunecnice",
    "term": "Słonecznik jednoroczny",
    "kategorie": "plodiny",
    "shortDef": "Słonecznik to jara oleista roślina o rosnącym znaczeniu w CZ (zmiana klimatu). Powierzchnia 30 000–50 000 ha, plon 2,5–4 t/ha, cena 13 000–17 000 Kč/t (high oleic premia +2 000). Główne zastosowanie: olej, pasza (śruta), biopaliwa, nasiona dla ptaków.",
    "longDef": "Słonecznik jednoroczny (łac. *Helianthus annuus*, ang. *sunflower*) to **jara oleista roślina** z rodziny *Asteraceae*. W CZ przez długi czas marginalna, ale **rosnące znaczenie** ze względu na zmianę klimatu (wyższe temperatury + susza = sprzyjające warunki dla słonecznika).\n\n**Powierzchnia w CZ 2024**: 35 000–50 000 ha (10-krotny wzrost od 2010 r.)\n**Produkcja**: 110 000–150 000 t/rok\n\n**Właściwości:**\n\n**Agrotechnika:**\n\n**Siew:**\n- **Termin**: 15.–30. kwietnia (po ostatnich wiosennych przymrozkach)\n- **Głębokość**: 4–5 cm\n- **Obsada**: 5–7 roślin/m² (rozstawa 70 × 25 cm)\n- **Rozstawa rzędów**: 70 cm (jak kukurydza — kompatybilna z pielnikiem do kukurydzy)\n\n**Nawożenie:**\n- **Przy siewie**: 80–100 kg N/ha + 50 kg P + 100 kg K\n- **Łącznie N**: 100–140 kg/ha (mniej niż kukurydza)\n- **Bor** (B 1 kg/ha) — pierwiastek krytyczny dla tworzenia koszyczków\n\n**Ochrona:**\n- **Chwasty**: przed wschodami (Stomp, Dual Gold) + po wschodach\n- **Fungicydy**: biała zgnilizna *Sclerotinia*, brunatna zgnilizna *Phomopsis* — 1–2 opryski\n- **Insektycydy**: minimalne (mniej szkodników niż rzepak)\n\n**Zbiór:**\n- **Termin**: wrzesień–październik, wilgotność ziarna 10–12 %\n- **Desykacja** (zob. [[desikace]]): glifosat 2 tygodnie przed zbiorem dla wyrównania dojrzewania\n- **Kombajn**: specjalny heder słonecznikowy (dłuższe palce)\n- **Kluczowe**: nie zbierać zbyt wysoko = straty\n\n**Plony:**\n- **Średnia CZ**: 2,8 t/ha\n- **Najlepsze gospodarstwa** (południowe Morawy): 4+ t/ha\n- **Czołówka UE** (Francja, Węgry): 3,5–4,5 t/ha\n\n**Zastosowanie:**\n\n**1. Olej słonecznikowy (60 %):**\n- **Olej standardowy** — kuchnia, olej sałatkowy, smażenie\n- **Olej słonecznikowy** to **najtańszy olej roślinny** w UE\n- **Spożycie CZ**: 6 kg/osobę/rok\n\n**2. Odmiany wysokooleinowe (15 %):**\n- **Wysoka zawartość kwasu oleinowego** — 80+% zamiast standardowych 30%\n- **Stabilny w wysokich temperaturach** — do frytkownicy, McDonald's, smażenia w gastronomii\n- **Premia cenowa**: +1 500–2 500 Kč/t vs standard\n- **Odmiany**: NK Neoma (Syngenta), LG 50.270 HO (Limagrain)\n\n**3. Śruta słonecznikowa (15 %):**\n- **Produkt uboczny** tłoczenia oleju\n- **Pasza**: 30–35 % CP, odpowiednia dla bydła, trzody\n- **Cena**: 6 500–8 500 Kč/t\n\n**4. Ptaki (karma, 5 %):**\n- **Całe łuszczone nasiono** — dla miłośników ptaków, karmniki\n- **Cena**: wysoka premia (15 000–25 000 Kč/t)\n\n**5. Biopaliwa (5 %):**\n- **Biodiesel** z oleju słonecznikowego\n- **Dotowany w UE** (RED II Dyrektywa o Energii Odnawialnej)\n\n**Cena 2024:**\n- **Słonecznik standardowy**: 13 000–16 000 Kč/t\n- **High-oleic**: +1 500–2 500 Kč/t\n- **Bio słonecznik**: 22 000–28 000 Kč/t\n\n**Odmiany CZ 2024:**\n- **LG 50.270 HO** (Limagrain) — high oleic, najwyższy plon\n- **NK Neoma** (Syngenta) — high oleic, popularna\n- **ES Janis** (Euralis) — standard, solidna\n- **Pioneer P63LE10** — wysoki plon\n\n**Choroby:**\n- **Biała zgnilizna** (*Sclerotinia sclerotiorum*) — mokre lata, strata 10–30 %\n- **Brunatna zgnilizna** (*Phomopsis helianthi*) — liściowa + koszyczkowa\n- **Mączniak rzekomy słonecznika** (*Plasmopara halstedii*) — profilaktyczna zaprawa nasion\n- **Opryski**: 1–2 fungicydy w sezonie (BBCH 51 + 65)\n\n**Szkodniki:**\n- **Drobne chrząszcze** — mniejsza presja niż rzepak\n- **Ptaki** — obniżają zbiór o 5–15 %, szczególnie gołębie i stada\n\n**Ekonomika:**\n- **Koszty**: 22 000–28 000 Kč/ha\n- **Plon 3 t × 14 500 Kč = 43 500 Kč/ha**\n- **Marża**: 15 000–20 000 Kč/ha (atrakcyjna!)\n- **Dopłaty BISS + CISS + EKO**: standardowe\n\n**Znaczenie strategiczne dla CZ:**\n- **Wzrost powierzchni w latach 2010** vs rzepak — alternatywa z niższą presją oprysków\n- **Przydatność klimatyczna** — południowe Morawy, Polabí, Słowacja\n- **Chłodniejszy CZ** (Vysočina, Karkonosze): mniej odpowiednie ze względu na krótszą wegetację\n\n**Zmiana klimatu:**\n- **Pozytywny wpływ** — słonecznik to roślina ciepłolubna, korzysta z ciepłych lat\n- **Susza** — tolerancyjna (głęboki system korzeniowy)\n- **Ryzyko**: późne przymrozki w kwietniu (niszczą kiełkujący łan)\n\nZob. też [[repka-ozima]], [[ozim-jarin]], [[fungicidy]], [[desikace]], [[mak-ozimy]].",
    "alias": [
      "sunflower",
      "Helianthus annuus"
    ],
    "related": [
      "repka-ozima",
      "ozim-jarin",
      "fungicidy",
      "desikace"
    ]
  },
  {
    "slug": "horcice",
    "term": "Gorczyca siewna",
    "kategorie": "plodiny",
    "shortDef": "Gorczyca siewna (biała gorczyca) to jara roślina z rodziny kapustowatych do produkcji musztardy (przyprawa) i jako poplon do nawożenia zielonego. Powierzchnia CZ 5 000–15 000 ha. Krótki okres wegetacji 90–110 dni. Plon 1–2 t/ha nasion, cena 13 000–18 000 Kč/t.",
    "longDef": "Gorczyca siewna (łac. *Sinapis alba*, „biała gorczyca\", ang. *white mustard*) to **jara roślina z rodziny kapustowatych** o krótkim okresie wegetacji (90–110 dni). Głównie do **produkcji musztardy** (przyprawa) i **jako poplon** do nawożenia zielonego.\n\n**Powierzchnia w CZ 2024**: 5 000–15 000 ha pod nasiona + 100 000+ ha jako poplon\n\n**Właściwości:**\n\n**Agrotechnika:**\n\n**Siew:**\n- **Termin**: 25 marca – 25 kwietnia (na nasiona) LUB 1.–15. sierpnia (poplon po zbiorze zbóż)\n- **Głębokość**: 1,5–2 cm\n- **Obsada**: 200–300 ziaren kiełkujących/m² (= 8–12 kg materiału siewnego/ha)\n\n**Nawożenie:**\n- **Na nasiona**: 60–80 kg N/ha\n- **Na poplon**: bez nawożenia (wykorzystuje resztki po przedplonie)\n- **P + K**: 30 P + 60 K\n\n**Ochrona:**\n- **Chwasty**: przed wschodami (Stomp) + po wschodach\n- **Insektycydy**: ryjkowiec łodygowy, słodyszek rzepakowy — pyretroidy\n- **Fungicydy**: minimalna presja\n\n**Zbiór:**\n- **Termin**: koniec lipca–sierpień, wilgotność 10–12 %\n- **Wyrównanie dojrzewania**: desykacja glifosatem 10 dni przed zbiorem\n- **Kombajn**: standardowy heder zbożowy\n\n**Plony:**\n- **Średnia CZ**: 1,3 t/ha\n- **Najlepsze gospodarstwa**: 2+ t/ha\n\n**Zastosowanie:**\n\n**1. Musztarda jako przyprawa (60 % produkcji):**\n- **Mielona gorczyca + ocet + sól + woda + przyprawy** = musztarda\n- **Czeski przysmak narodowy** (polędwica wołowa, kotlet)\n- **Musztarda praska, pełnoziarnista** — typy CZ\n- **Globalne marki**: Hellmann's, Heinz, Maille — wszystkie z gorczycy siewnej\n\n**2. Poplon (30 % powierzchni — największe zastosowanie!):**\n- **Zbiór pszenicy/jęczmienia** → natychmiastowy siew gorczycy → okres wegetacji do pierwszych mrozów → przyoranie jesienią lub wiosną\n- **Efekty**:\n  - **Nawożenie zielone** — biomasa rozkłada się w glebie\n  - **Sekwestracja C** — korzenie + biomasa\n  - **Supresja chwastów** — gorczyca szybko pokrywa glebę\n  - **Glukozynolany w glebie** — biofumigacja (ogranicza patogeny)\n  - **CAP UE greening** — gorczyca = EFA (obszar proekologiczny)\n- **Koszt materiału siewnego na poplon**: 600–1 000 Kč/ha\n\n**3. Olej (5 %):**\n- **Olej gorczyczny** — specyficzny olej kulinarny Europy Wschodniej (Holandia, Polska)\n- **W CZ rzadki**\n\n**4. Pasza (5 %):**\n- **Śruta gorczyczna** (po tłoczeniu oleju) — dla bydła\n- **Uwaga**: glukozynolany mogą powodować problemy u trzody\n\n**Cena 2024:**\n- **Nasiona gorczycy**: 13 000–18 000 Kč/t\n- **Bio gorczyca**: 18 000–25 000 Kč/t (kontrakt bio Hellmann's)\n\n**Odmiany CZ 2024:**\n- **Veronica** — wydajna\n- **Severka** — solidna\n- **Andromeda** — nowoczesna\n\n**Choroby i szkodniki:**\n- **Takie same jak rzepak** ale mniejsza presja (krótki okres wegetacji)\n- **Słodyszek rzepakowy** (*Meligethes aeneus*) — żeruje na pąkach\n- **Mączniak rzekomy kapustowatych** (*Peronospora parasitica*) — minimalna presja\n\n**Zalety gorczycy:**\n1. **Krótki okres wegetacji** — elastyczna w płodozmianie\n2. **Tani materiał siewny**\n3. **Wartość jako poplon** — EFA, nawożenie zielone, biofumigacja\n4. **Odporna** — mało oprysków\n\n**Wady:**\n1. **Niski plon** (1–2 t/ha vs 8 t/ha pszenicy)\n2. **Marginalna powierzchnia** pod nasiona\n3. **Zmienność cen** — wrażliwa na popyt przemysłu spożywczego\n\n**Ekonomika:**\n\n**Na nasiona (1,3 t/ha × 15 000 Kč = 19 500 Kč/ha):**\n- **Koszty**: 12 000–15 000 Kč/ha\n- **Marża**: 4 500–7 500 Kč/ha (umiarkowana)\n- **Plus dopłaty**: standardowe BISS + CISS\n\n**Na poplon:**\n- **Koszty**: 1 000–1 500 Kč/ha (materiał siewny + siew)\n- **Korzyści**: dopłata EFA ~3 000 Kč/ha + korzyści glebowe niemierzalne finansowo\n- **Saldo dodatnie**: 1 500–2 000 Kč/ha (tylko dopłata), plus długoterminowe korzyści\n\n**UE i CAP:**\n- **Schematy poplonowe** dotowane — gorczyca jest najpopularniejsza\n- **Limity EFA** — minimum 5 % powierzchni w EFA dla CAP (greening)\n\n**Zmiana klimatu:**\n- **Susza latem** → poplon nie zdąży wzejść\n- **Łagodne jesienie** → dłuższa wegetacja = większa biomasa\n\nZob. też [[mezi-plodiny]], [[repka-ozima]], [[ozim-jarin]], [[regenerativni-zemedelstvi]], [[osevni-postup]].",
    "alias": [
      "mustard",
      "Sinapis alba",
      "biała gorczyca",
      "Sinapis arvensis"
    ],
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
    "term": "Burak cukrowy",
    "kategorie": "plodiny",
    "shortDef": "Burak cukrowy (Beta vulgaris) to jara roślina okopowa uprawiana do produkcji cukru. Powierzchnia CZ 60 000–70 000 ha. Plon 60–80 t/ha korzeni, zawartość cukru 17–20 %. Cena 1 100–1 600 Kč/t (zależy od zawartości cukru). Uprawa kontraktowa dla cukrowni.",
    "longDef": "Burak cukrowy (łac. *Beta vulgaris* var. *altissima*, ang. *sugar beet*) to **jara roślina okopowa** uprawiana do **produkcji cukru** (sacharoza). Korzeń zawiera 17–20 % cukru. CZ ma długą tradycję (od XIX w.), obszar: Polabí, Czechy Środkowe, Haná.\n\n**Powierzchnia w CZ 2024**: 60 000–70 000 ha\n**Produkcja**: 4–5 mln t korzeni → 600 000–750 000 t cukru\n\n**Właściwości:**\n\n**Agrotechnika:**\n\n**Siew:**\n- **Termin**: 20 marca – 20 kwietnia\n- **Głębokość**: 2–3 cm\n- **Obsada**: 8–10 roślin/m² (rozstawa 45 × 18 cm)\n- **Kluczowe**: precyzyjny siew (każde nasionko się liczy, drogi materiał siewny)\n\n**Nawożenie:**\n- **Przy siewie**: 100–130 kg N/ha (burak „głodny N\")\n- **Łącznie N**: 130–180 kg/ha\n- **Bor (B)** — kluczowy dla tworzenia cukru, 2–4 kg/ha\n- **Sód (Na)** — atypowo pozytywny wpływ na plon\n- **Obornik w przedplonie** — burak lubi materię organiczną\n\n**Ochrona:**\n- **Chwasty**: 3–4 opryski (Goltix + Betanal + Pyramin) — kosztowny program\n- **Insektycydy**: mszyca burakowa (wektor BYV, zob. [[msice-repna]])\n- **Fungicydy**: 1–2 opryski (Cercospora, mączniak prawdziwy)\n\n**Zbiór:**\n- **Termin**: wrzesień–listopad (start kampanii)\n- **Kombajn do buraków** — Holmer Terra Dos, Ropa euro-Tiger — 6-rzędowy samojezdny (50–80 t/h)\n- **tzw. „Kampania\"**: październik–grudzień, cukrownie pracują 24/7\n\n**Plony:**\n- **Średnia CZ**: 70 t/ha korzeni\n- **Najlepsze gospodarstwa**: 90+ t/ha\n- **Zawartość cukru**: 17–20 % (wyższa = wyższa cena!)\n\n**Cena 2024 (kontraktowa):**\n- **Standardowy burak** (17 % cukru): 1 200 Kč/t\n- **High sugar** (19 % cukru): 1 500 Kč/t\n- **Premia za biopaliwa** (kontrakt na bioetanol): +50–100 Kč/t\n\n**Uprawa kontraktowa:**\n\n**Cukrownie CZ:**\n- **Cukrovary Hradec Králové** (grupa Tereos) — Polabí\n- **Moravskoslezské cukrovary** (Litovel, Vrbátky) — Haná\n- **Tereos TTD** — Dobrovice (Polabí)\n- **Pfeifer & Langen** (Český Meziříčí)\n\n**Kontrakt** między gospodarstwem a cukrownią:\n- **Powierzchnia + szacunek plonu** = zobowiązanie ilościowe\n- **Cena**: gwarantowana za %cukru + premia\n- **Transport**: cukrownia często zapewnia\n- **Okres planowania**: niekiedy 3–5 lat z wyprzedzeniem\n\n**Produkty z buraka:**\n1. **Cukier (50 %)** — główny produkt\n2. **Melasa (15 %)** — drożdże, pasza, spirytus\n3. **Wysłodki (30 %)** — pasza dla bydła (mokre lub suszone, granulowane)\n4. **Ziemia i nać (5 %)** — kompost\n\n**Odmiany CZ 2024:**\n- **Odmiany KWS** (Marleen, Cantona) — dominujące\n- **Strube** (Salamando, Rosagold) — alternatywa\n- **Klein-Wanzlebener** — tradycyjna niemiecka\n\n**Choroby:**\n- **Cercospora beticola** — plamistość liści, poważna strata zawartości cukru\n- **Mączniak prawdziwy buraka** (Erysiphe betae) — liście\n- **Rhizoctonia** — zgnilizna korzeni\n- **Wirus BYV** przenoszony przez mszyce — zob. [[msice-repna]]\n\n**Szkodniki:**\n- **Mszyca burakowa** (Aphis fabae) — wektor BYV\n- **Pchełki burakowe** (Chaetocnema) — liście\n- **Ślimak polny** (Deroceras) — liście\n\n**Ekonomika:**\n\n**Koszty na 1 ha** (burak to „droga\" roślina):\n- **Materiał siewny**: 8 000–12 000 Kč/ha (precyzyjne otoczkowane nasiona)\n- **Nawozy**: 6 000–8 000 Kč/ha\n- **Opryski**: 10 000–15 000 Kč/ha (3–4 zabiegi herbicydowe)\n- **Zbiór**: 3 000–5 000 Kč/ha (własna maszyna lub usługa)\n- **Transport**: 2 000–4 000 Kč/ha\n- **Praca i koszty ogólne**: 6 000–10 000 Kč/ha\n- **Łącznie**: 35 000–55 000 Kč/ha\n\n**Plon**: 70 t/ha × 1 300 Kč = 91 000 Kč/ha\n**Marża**: 35 000–55 000 Kč/ha (ATRAKCYJNA!)\n\n**Plus dopłaty**:\n- **BISS + CISS**: ~3 600 Kč/ha\n- **VCS dla buraków** (wrażliwy sektor): ~7 500 Kč/ha (specyficzna dopłata CZ dla buraków!)\n- **Rolnictwo ekologiczne**: jeśli spełnia warunki\n\n**Trend i przyszłość:**\n- **Kwota cukrowa UE** zniesiona 2017 → liberalizacja rynku → presja na cenę\n- **Malejąca powierzchnia CZ** (ze 100 000 ha w latach 90. do 60 000 ha dziś)\n- **Bioetanol** — alternatywne zastosowanie buraka (UE RED II)\n- **Zmiana klimatu** — wyższe temperatury + susza = niższy plon w Polabí\n\n**Roślina strategiczna:**\n- **Dopłata VCS** czyni z buraka **bardzo opłacalny wybór** w regionach burakowych\n- **Poza regionami VCS** mniej atrakcyjny (susza na Vysočinie utrudnia)\n\nZob. też [[msice-repna]], [[ozim-jarin]], [[osevni-postup]], [[fungicidy]], [[hnojivo]].",
    "alias": [
      "sugar beet",
      "Beta vulgaris",
      "cukrówka"
    ],
    "related": [
      "msice-repna",
      "ozim-jarin",
      "osevni-postup",
      "fungicidy"
    ]
  },
  {
    "slug": "hrach-set",
    "term": "Groch siewny",
    "kategorie": "plodiny",
    "shortDef": "Groch siewny to jara roślina strączkowa uprawiana na nasiona (groch pastewny) lub zielony strąk (groch konserwowy). Powierzchnia CZ 10 000–20 000 ha. Plon 3–5 t/ha nasion, cena 6 500–8 500 Kč/t. Kluczowy dla wiązania N (50–100 kg N/ha) i płodozmianu po zbożach.",
    "longDef": "Groch siewny (łac. *Pisum sativum*, ang. *field pea*) to **jara roślina strączkowa** o kluczowych korzyściach agronomicznych: **wiązanie azotu** w symbiozie z *Rhizobium leguminosarum* (50–100 kg N/ha) i poprawa struktury gleby. Główne zastosowanie: pasza (groch pastewny), spożycie ludzkie (zielony groszek), zastosowania przemysłowe.\n\n**Powierzchnia w CZ 2024**: 10 000–20 000 ha (tendencja rosnąca ze względu na roślinne białka + unijną strategię białkową)\n\n**Typy grochu:**\n\n**1. Groch pastewny** (95 % powierzchni CZ):\n- **Zbiór**: sierpień, ziarno suche\n- **Zastosowanie**: pasza, spożycie ludzkie (łuszczony groch)\n- **Plon**: 3–5 t/ha\n\n**2. Groch konserwowy** (5 %):\n- **Zbiór**: zielony strąk, czerwiec–lipiec\n- **Zastosowanie**: konserwy (Boncourier), mrożonki (Bonduelle)\n- **Uprawa kontraktowa** dla zakładów konserwarskich\n- **Plon**: 5–8 t/ha zielonego strąka\n\n**Agrotechnika:**\n\n**Siew:**\n- **Termin**: 20 marca – 15 kwietnia (wczesny siew — toleruje chłód)\n- **Głębokość**: 4–6 cm (głęboko, ze względu na tolerancję korzeni na suszę)\n- **Obsada**: 80–120 ziaren kiełkujących/m² (= 200–280 kg materiału siewnego/ha, HW 250 g)\n\n**Nawożenie:**\n- **Bez nawożenia azotowego!** — groch sam wiąże azot (symbioza)\n- **P + K**: 40 P + 80 K + Mg\n- **Inokulacja materiału siewnego** Rhizobium leguminosarum bivar. *viceae* = kluczowe (szczególnie na polu, gdzie groch 5+ lat nie był)\n\n**Ochrona:**\n- **Chwasty**: przed wschodami (Stomp, Bicarb) + po wschodach (Basagran, Pulsar)\n- **Insektycydy**: strąkowiec grochowy (Bruchus pisorum), mszyce\n- **Fungicydy**: biała zgnilizna *Sclerotinia*, mączniak rzekomy grochu (Mycosphaerella pisi)\n\n**Zbiór grochu pastewnego:**\n- **Termin**: koniec lipca–sierpień, wilgotność 14 %\n- **Desykacja** (zob. [[desikace]]): glifosat 7–10 dni przed zbiorem (wyrównanie dojrzewania)\n- **Kombajn**: standardowy heder, ale ostrożnie (ziarno łatwo wypada)\n\n**Plony:**\n- **Średnia CZ**: 3,8 t/ha grochu pastewnego\n- **Najlepsze gospodarstwa**: 5,5+ t/ha\n- **Konserwowy**: 6 t/ha zielony\n\n**Zastosowanie:**\n\n**1. Pasza (60 %):**\n- **Dla trzody chlewnej**: główny składnik białkowy (CP 23–26 %)\n- **Dla bydła**: alternatywa dla SES (sojowej śruty ekstrahowanej)\n- **Dla drobiu**: do 20 % mieszanki\n- **Wartości odżywcze**: CP 24 %, NEL 8,2 MJ/kg, wysoka skrobia\n\n**2. Spożycie ludzkie (25 %):**\n- **Łuszczony groch** — zupy, sosy (kuchnia czeska)\n- **Płatki grochowe / mąka** — roślinne białka\n- **Konserwowy / mrożony groszek** — warzywo\n- **Białko grochowe** — szeroko stosowane w produktach roślinnych (Beyond Meat, Impossible)\n\n**3. Przemysł (10 %):**\n- **Izolat białka grochowego** — czystość 80 %+, premium składnik roślinny\n- **Cena białka grochowego**: 80 000–150 000 Kč/t (10× vs ziarno)\n- **UE dotuje** strategią białkową dla roślin\n\n**4. Biopaliwa (5 %):**\n- **Bioetanol grochowy** — opcja poboczna, marginalna\n\n**Cena 2024:**\n- **Pastewny groch ziarnowy**: 6 500–8 000 Kč/t\n- **Groch spożywczy** (łuszczony): 9 000–12 000 Kč/t\n- **Konserwowy** (kontraktowy zielony): 4 500–6 000 Kč/t brutto\n\n**Odmiany CZ 2024:**\n- **Eso, Madonna** — białe kwiaty, paszowe, najwyższy plon\n- **Bohatýr** — solidna\n- **Salamanca** — krótka łodyga (mniejsze wyleganie)\n\n**Korzyści agronomiczne (kluczowe!):**\n1. **Wiązanie N**: 50–100 kg N/ha + resztkowy N dla następnej rośliny (zazwyczaj pszenica po grochu)\n2. **Przerwanie monokultur**: rośliny kapustowate i zboża mają zupełnie inne patogeny — groch to „oczyszczacz\" płodozmianu\n3. **Struktura gleby**: głęboki system korzeniowy rozbija ubitą glebę\n4. **Sekwestracja C**: wyższa materia organiczna w glebie po strączkowych\n\n**Ekonomika:**\n\n**Koszty na 1 ha:**\n- Materiał siewny: 4 500–6 000 Kč\n- Nawozy: 2 000–3 000 Kč (tylko P + K)\n- Opryski: 4 000–6 000 Kč\n- Zbiór + transport: 3 000–4 000 Kč\n- Łącznie: 13 500–19 000 Kč/ha\n\n**Plon**: 4 t × 7 200 Kč = **28 800 Kč/ha**\n**Marża**: 9 800–15 300 Kč/ha (atrakcyjna!)\n**Plus N dla następnej rośliny**: oszczędza 60–80 kg N (~1 200–1 600 Kč/ha)\n\n**Strategia białkowa UE:**\n- **CAP UE** od 2023 wspiera **rośliny białkowe** (groch, soja, łubin, peluszka, wyka, fasola)\n- **VCS dla roślin białkowych**: ~2 800 Kč/ha\n- **Cel UE**: zwiększenie krajowej produkcji białka z 30 % do 50 % do 2030 r.\n\n**Zmiana klimatu:**\n- **Łagodna wiosna** = pozytywna\n- **Susza w maju–czerwcu** = negatywna (kwitnienie i tworzenie strąków)\n- **Mokre lata** = wyleganie, pleśń\n\n**Znaczenie strategiczne:**\n- **Groch w płodozmianie** = klucz do **zrównoważonej intensyfikacji**\n- **Roślinne białka** = rosnący rynek = wyższa cena\n- **Wsparcie białkowe UE** = dodatkowe dopłaty\n\nZob. też [[sojaova-bob]], [[vojteska]], [[osevni-postup]], [[mezi-plodiny]], [[ozim-jarin]], [[regenerativni-zemedelstvi]].",
    "alias": [
      "pea",
      "Pisum sativum",
      "jary groch"
    ],
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
    "term": "Len zwyczajny",
    "kategorie": "plodiny",
    "shortDef": "Len zwyczajny to roślina o podwójnym zastosowaniu — len oleisty na nasiona i olej lniany, len włóknisty na włókno (płótno lniane). Powierzchnia CZ 1 500–3 000 ha (malejąca). Plon oleistego 1,5–2,5 t/ha nasion, cena 12 000–17 000 Kč/t. Historycznie kluczowy (płótno lniane do lat 1900).",
    "longDef": "Len zwyczajny (łac. *Linum usitatissimum*, ang. *flax*) to **jara roślina o podwójnym zastosowaniu**:\n1. **Len oleisty** — nasiona na olej lniany (omega-3), nasiona piekarnicze\n2. **Len włóknisty** — łodyga na włókno lniane (tekstylia)\n\nW CZ malejąca tradycja — ze 100 000+ ha w latach 50. XX w. do ~1 500–3 000 ha dziś.\n\n**Historia:**\n- **Tysiące lat** — len to jedna z najstarszych roślin uprawnych (mumie egipskie, wzmianki biblijne)\n- **Średniowiecze** — płótno lniane = standardowy tekstyl w UE\n- **XVIII–XIX w.** — szczyt uprawy w CZ (Karkonosze, Jesioniki — centra lniarskie)\n- **XX w.** — bawełna i syntetyki wyparły płótno lniane\n- **Szczyt CZ lat 50. XX w.** — 120 000 ha (dotowane przez państwo)\n- **Lata 2020** — roślina niszowa\n\n**Właściwości:**\n\n**Len oleisty (95 % powierzchni CZ):**\n\n**Siew:**\n- **Termin**: 25 marca – 20 kwietnia\n- **Głębokość**: 2–3 cm\n- **Obsada**: 600–800 ziaren kiełkujących/m² (drobne nasionko)\n\n**Nawożenie:**\n- **N**: 60–80 kg/ha\n- **P + K**: standardowe\n\n**Ochrona:**\n- **Chwasty**: po wschodach (Lontrel, Basagran)\n- **Insektycydy**: pchełki, mszyce — pyretroidy\n- **Fungicydy**: biała zgnilizna (Sclerotinia), pleśń lnu — 1 oprysk\n\n**Zbiór:**\n- **Termin**: koniec lipca–sierpień\n- **Wilgotność ziarna**: 9–12 %\n- **Kombajn**: standardowy\n- **Plon**: 1,5–2,5 t/ha nasion\n\n**Zastosowanie lnu oleistego:**\n\n**1. Nasiona lniane (spożywcze):**\n- **Całe lub mielone nasiona** — do pieczywa, müsli, jogurtów\n- **Wysoka zawartość omega-3** (ALA — kwas alfa-linolenowy)\n- **Błonnik** — pozytywny dla trawienia\n- **Cena nasion spożywczych**: 18 000–25 000 Kč/t\n\n**2. Olej lniany:**\n- **Tłoczenie** nasion\n- **Kulinarny**: sałatki, müsli (nie do smażenia — niestabilny)\n- **Leczniczy**: suplement omega-3\n- **Cena**: 250–400 Kč/100 ml w detalu\n\n**3. Pasza:**\n- **Śruta lniana** (po tłoczeniu oleju) — pasza dla bydła, koni\n- **Wysoka zawartość substancji olejnych** — lśniąca sierść koni\n\n**4. Przemysł:**\n- **Olej lniany techniczny** (suszący olej) — do farb, lakierów, linoleum\n- **Etymologia linoleum**: linum oleum = olej lniany\n\n**Len włóknisty (5 % powierzchni CZ):**\n\n**Specyficzny dla włókna:**\n- **Gęstszy siew** (1 500 ziaren/m²) — cienka, długa łodyga\n- **Krótszy okres wegetacji** — zbiór w lipcu\n- **Roszenie** (retting) — łodygi zostawia się na polu do roszenia przez 14 dni, aby pektyny się rozłożyły\n- **Tłuczenie + tarcie** — uwolnienie włókna\n- **Włókno** — na płótno lniane (linen, batyst, kambryk)\n\n**Płótno lniane**:\n- **Materiał premium** — luksusowe ubrania, ręczniki, obrusy\n- **Belgia + Francja** = centrum lniarskie UE (80 % produkcji UE)\n- **CZ marginalne** — zanikłe tradycje przemysłowe\n\n**Cena 2024:**\n- **Len oleisty** paszowy: 12 000–14 000 Kč/t\n- **Len oleisty** spożywczy: 18 000–25 000 Kč/t\n- **Bio len oleisty**: 28 000–35 000 Kč/t (premia dla bio müsli)\n\n**Odmiany CZ 2024:**\n- **Lola** — oleisty, najwyższy plon\n- **Recital** — solidna\n- **Niagara** — włóknisty (import belgijski)\n\n**Choroby:**\n- **Biała zgnilizna** (Sclerotinia) — mokre lata\n- **Szara pleśń lnu** (Botrytis) — sezonowa\n- **Rdza lnu** (Melampsora) — mała presja\n\n**Ekonomika lnu oleistego:**\n\n**Koszty na 1 ha**:\n- Materiał siewny: 1 500–2 500 Kč\n- Nawozy: 2 500–3 500 Kč\n- Opryski: 3 000–5 000 Kč\n- Zbiór: 2 500–3 500 Kč\n- Łącznie: 9 500–14 500 Kč/ha\n\n**Plon**: 2 t × 14 000 Kč = **28 000 Kč/ha**\n**Marża**: 13 500–18 500 Kč/ha (atrakcyjna dla niszy!)\n\n**Znaczenie strategiczne:**\n- **Roślina niszowa** z wysoką marżą\n- **Roślinne omega-3** trend = rosnący popyt\n- **Kontrakty bio** dla piekarnictwa\n\n**Zmiana klimatu:**\n- **Susza w maju–czerwcu** = pozytywna (len nie lubi wilgoci)\n- **Łagodne lata** = idealne\n- **Mokre lata** = biała zgnilizna\n\n**Renesans lnu?**\n- **Roślinno-pożywkowy** trend = rynek rośnie\n- **Lokalni producenci** mogą celować w premium rynek piekarniczy\n- **Kontrakty bio** dla Hipp, Bauer żywność dla dzieci\n\nZob. też [[ozim-jarin]], [[sojaova-bob]], [[mak-ozimy]], [[osevni-postup]].",
    "alias": [
      "flax",
      "Linum usitatissimum",
      "len oleisty",
      "len włóknisty"
    ],
    "related": [
      "ozim-jarin",
      "mak-ozimy",
      "osevni-postup"
    ]
  },
  {
    "slug": "mastitida",
    "term": "Zapalenie wymienia (mastitis)",
    "kategorie": "chov",
    "shortDef": "Zapalenie wymienia to stan zapalny gruczołu mlekowego krowy, typowo bakteryjny. Najważniejszy problem zdrowotny ferm mlecznych — powoduje 30 % strat ekonomicznych chowu. Diagnostyka: komórki somatyczne w mleku (SCC) >200 000/ml = subkliniczne, >500 000/ml = kliniczne.",
    "longDef": "Zapalenie wymienia (łac. *mastitis*, gr. *mastos* = wymię) to **stan zapalny gruczołu mlekowego** krowy mlecznej. Najważniejszy problem zdrowotny w chowie mlecznym — powoduje **30 % strat ekonomicznych** (obniżona produkcja, antybiotyki, brakowanie krów).\n\n**Typy:** kliniczne (widoczne objawy, wymaga leczenia) vs subkliniczne (tylko SCC >200 000/ml, większość przypadków). Kluczowe patogeny: zakaźne (*Staphylococcus aureus*, *Streptococcus agalactiae*) i środowiskowe (*E. coli*, *Streptococcus uberis*, *Klebsiella*).\n\n**Pomiar SCC:**\n- <100 000/ml = zdrowe\n- 200–500 000/ml = subkliniczne\n- >500 000/ml = kliniczne\n- **Limit UE dla skupu mleka**: <400 000/ml\n\n**Leczenie klinicznego zapalenia wymienia:**\n- **Dostrzykowe antybiotyki** (Mastijet, Cefa Safe) — 3 dni do chorej ćwiartki\n- **Ogólnoustrojowe** (Penicylina G IM, Cefquinome) w ciężkich przypadkach\n- **Przeciwzapalne** (ketoprofen, meloksykam)\n- **Okres karencji**: mleko 3–5 dni, mięso 14–30 dni\n- **Koszt leczenia**: 500–1 500 Kč + 1 500–3 000 Kč utracone mleko\n\n**Profilaktyka (kluczowa):**\n1. **Higiena dojenia**: pre-dip + wytarcie sterylnym ręcznikiem (per krowa!) + post-dip\n2. **Terapia zasuszeniowa**: dostrzykowe antybiotyki + uszczelniacz strzyków przy zasuszeniu\n3. **Sucha ściółka**: słoma, wióry drzewne, piasek\n4. **Genetyka**: wybór buhajów z niskim SCC u potomstwa\n5. **TMR** (zob. [[tmr]]): zbilansowane żywienie, selen + wit. E\n\n**Ekonomiczny wpływ:**\n- Koszty 1 klinicznego zapalenia: 4 000–11 500 Kč\n- Stado 100 krów: 300 000–800 000 Kč/rok strat\n- Dobry management obniża zapalenie wymienia o 50–70 % = duży ROI\n\nZob. też [[oteleni]], [[dojirna]], [[ku-kontrola-uzitkovosti]], [[tmr]], [[bcs-body-condition]], [[transition-period]].",
    "alias": [
      "mastitis",
      "zapalenie gruczołu mlekowego",
      "mleczne zapalenie"
    ],
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
    "kategorie": "chov",
    "shortDef": "BCS to wizualna ocena kondycji ciała bydła w skali 1–5 (USA) lub 1–9. Kluczowe narzędzie zarządzania — optymalne BCS krowy mlecznej przy porodzie 3,25–3,75. Zbyt tłusta = dystocja + ketoza; zbyt chuda = niska produkcja i płodność.",
    "longDef": "BCS (Body Condition Score) to **wizualna subiektywna ocena kondycji ciała (otłuszczenia)** zwierząt gospodarskich. Kluczowe narzędzie zarządzania dla bydła mlecznego i mięsnego, owiec, kóz, trzody chlewnej.\n\n**Skala USA (Wildman, 1982):**\n- 1: skrajnie wychudzona\n- 2: chuda\n- 3: idealna krowa mleczna\n- 4: tłusta\n- 5: skrajnie tłusta\n- Krok 0,25\n\n**Optymalne BCS — krowa mleczna (Holstein):**\n\n| Stadium | BCS |\n|---------|-----|\n| Poród | 3,25–3,75 |\n| 30 dni po porodzie | 2,75–3,00 (dopuszczalny spadek) |\n| Szczyt laktacji (100 dni) | 2,75–3,00 |\n| 200 dni | 3,00–3,25 |\n| Zasuszenie | 3,25–3,75 |\n\n**Ocena**: kręgosłup, wyrostki kostne, krótkie żebra, guz kulszowy, bruzda ogonowa. Wizualnie + palpacja.\n\n**Konsekwencje błędnego BCS:**\n\n**Zbyt niskie (<2,5 przy porodzie):**\n- Niska produkcja, ketoza, słabsza odporność, opóźniony ruja (zob. [[rijnost]])\n\n**Zbyt wysokie (>4,0 przy porodzie):**\n- Dystocja (zob. [[oteleni]]), stłuszczenie wątroby, zatrzymanie łożyska, ketoza, obniżone pobieranie paszy\n\n**Ważna zasada**: utrata >1,0 BCS w pierwszych 60 dniach = ryzyko (ketoza, niska płodność).\n\n**Oprogramowanie do automatycznej oceny BCS:**\n- **CowManager**, **DeLaval BCS Camera** — kamera + ocena AI\n- 200 000–500 000 Kč instalacja\n- Codzienna ocena BCS każdej krowy bez pracy ręcznej\n\n**Ekonomiczny wpływ**: stado z optymalnym zarządzaniem BCS ma o 200–500 l mleka/krowa/rok więcej → dla 100 krów = 220 000–550 000 Kč/rok.\n\nZob. też [[oteleni]], [[rijnost]], [[mastitida]], [[ku-kontrola-uzitkovosti]], [[tmr]], [[transition-period]].",
    "alias": [
      "Body Condition Score",
      "ocena kondycji ciała"
    ],
    "related": [
      "oteleni",
      "rijnost",
      "mastitida",
      "tmr"
    ]
  },
  {
    "slug": "ku-kontrola-uzitkovosti",
    "term": "Ocena użytkowości (KU)",
    "kategorie": "chov",
    "shortDef": "Ocena użytkowości to systematyczny monitoring produkcji i jakości mleka krów. W CZ prowadzi ją Czeski Związek Hodowców — 1× w miesiącu analiza mleka per krowa (ilość, tłuszcz, białko, SCC, mocznik). Kluczowa dla selekcji, zdrowia i hodowli.",
    "longDef": "Ocena użytkowości (KU, ang. *DHIA — Dairy Herd Improvement Association*, *milk recording*) to **systematyczny monitoring produkcji i jakości mleka poszczególnych krów mlecznych** przez służby zootechniczne. W CZ prowadzi ją **Český svaz chovatelů**.\n\n**Zasada:**\n- 1× w miesiącu technik na fermie\n- Próbki mleka od każdej krowy (dój poranny + wieczorny)\n- Analiza w akredytowanym laboratorium\n- Wyniki opracowuje związek + księga hodowlana (zob. [[plemenna-kniha]])\n\n**Mierzone parametry:**\n\n| Parametr | Optimum Holstein |\n|----------|------------------|\n| Ilość | 25–40 kg/dzień |\n| Tłuszcz | 3,8–4,2 % |\n| Białko | 3,2–3,5 % |\n| SCC | <200 000/ml |\n| Mocznik | 15–30 mg/100 ml |\n| Laktoza | 4,8–5,0 % |\n\n**Zastosowanie danych KU:**\n\n**1. Selekcja krów:**\n- Najlepsze 25 % → nasienie seksuowane (gwarantowane jałówki do hodowli)\n- Najgorsze 25 % → genetyka mięsna lub sprzedaż\n\n**2. Diagnostyka:**\n- Wysokie SCC → zapalenie wymienia (zob. [[mastitida]])\n- Niskie białko → zmiana TMR (zob. [[tmr]])\n- Wysokie stężenie mocznika → obniżyć CP w diecie\n- Spadek produkcji → badanie\n\n**3. Wartość hodowlana:**\n- Dane KU trafiają do księgi hodowlanej\n- Najlepsze buhaje wybierane na podstawie wyników ich córek\n\n**Uczestnictwo:**\n- ~60–70 % ferm mlecznych w CZ\n- Wysoka użytkowość (>10 000 kg/laktację) prawie 100 % w KU\n\n**Koszt:**\n- 150–250 Kč/krowa/mies.\n- Stado 100 krów: 180 000–300 000 Kč/rok\n- ROI: 500–1 500 Kč/krowa/rok zysku z lepszej selekcji\n\n**Cyfryzacja:**\n- AMS (Lely, DeLaval) zapisuje dane każdego dojenia\n- Analizatory in-line mierzą tłuszcz/białko w czasie rzeczywistym\n- Trend: dane AMS mogą zastąpić klasyczne KU\n\nZob. też [[plemenna-kniha]], [[mastitida]], [[bcs-body-condition]], [[oteleni]], [[dojirna]], [[inseminace]].",
    "alias": [
      "KU",
      "DHIA",
      "milk recording"
    ],
    "related": [
      "plemenna-kniha",
      "mastitida",
      "bcs-body-condition",
      "dojirna"
    ]
  },
  {
    "slug": "plemenna-kniha",
    "term": "Księga hodowlana",
    "kategorie": "chov",
    "shortDef": "Księga hodowlana to oficjalny rejestr czystorasowych zwierząt rasy z rodowodem i wartością hodowlaną. Prowadzi ją uznana organizacja hodowlana (w CZ Český svaz chovatelů). Kluczowe narzędzie hodowli, dopłat UE i handlu genetyką.",
    "longDef": "Księga hodowlana (niem. *Herdbuch*, ang. *herd book*) to **oficjalny rejestr czystorasowych zwierząt rasy** prowadzony przez uznaną organizację hodowlaną. Zawiera rodowód, wartość hodowlaną, cechy i pochodzenie. Kluczowe narzędzie hodowli i dopłat UE.\n\n**Historia:**\n- 1791 — pierwsza (konie angloarabskie w Wielkiej Brytanii)\n- 1822 — pierwsza dla bydła (Shorthorn, Wielka Brytania)\n- 1872 — Holstein-Friesian Herd Book (Holandia/Niemcy)\n- 1898 — Český svaz chovatelů założony\n\n**Sekcje:**\n- **A (czystorasowe)**: ojciec + matka zarejestrowani, ≥7/8 czystorasowości\n- **B (ulepszanie)**: droga do sekcji A przez 2–3 pokolenia\n- **C (podstawowa)**: tylko matka zarejestrowana, 50 % czystorasowości\n\n**Co ewidencjonuje:**\n\n1. **Identyfikacja**: kolczyk (zob. [[usni-znamka]]), imię, data, rasa\n2. **Rodowód**: 4 pokolenia wstecz (8 przodków)\n3. **Cechy**: produkcja, wartości hodowlane (WH/EBV), typ budowy\n4. **Rozród**: inseminacja, wycielenie, okres międzywycieleniowy\n5. **Zdrowie**: zapalenia wymienia, zabiegi weterynaryjne, brakowanie\n\n**Wartość hodowlana (WH):**\n\nKluczowe wskaźniki:\n- **TPI** (Total Performance Index — USA Holstein)\n- **NM$** (Net Merit dollars — ekonomiczny)\n- **RZG** (Relativzuchtwert Gesamt — Niemcy/Austria Holstein)\n- **NORD** (Indeks nordycki)\n- **CZECH SIH** (CZ całkowity indeks Holstein)\n\n**Ocena genomiczna (od 2009):**\n- Testy DNA młodych zwierząt\n- Predykcja wartości hodowlanej bez czekania na córki\n- 10 000+ testów/rok w CZ\n\n**Wymiana międzynarodowa:**\n- **Interbull** — koordynacja ponad 30 krajów\n- CZ importuje 60 % nasienia (USA, Kanada, Holandia, Dania)\n\n**Organizacje hodowlane CZ:**\n- **ČSCH** — Holstein, czarno-biały\n- **Svaz chovatelů masného skotu** — Charolais, Limousin, Aberdeen Angus\n- **Plemenáři Lhota, Bohemia Plus** — stacje inseminacyjne\n\n**Rasy w CZ:**\n- Mleczne: Holstein (#1, 70 %), Czeski Pstry (20 %), Jersey, Montbéliarde\n- Mięsne: Charolais, Limousin, Aberdeen Angus, Hereford, Simmental, Błękitny belgijski\n\n**Wartość ekonomiczna:**\n- Czystorasowa, najlepsza jałówka: 50 000–250 000 Kč\n- Najlepszy buhaj do inseminacji: 500 000+ Kč\n- Transfer zarodków topowej genetyki: 50 000–500 000 Kč\n- World Dairy Expo Grand Champion: 1+ mln USD\n\nZob. też [[ku-kontrola-uzitkovosti]], [[inseminace]], [[jalovice]], [[bcs-body-condition]], [[f1-hybrid]], [[usni-znamka]].",
    "alias": [
      "herd book",
      "ewidencja hodowlana"
    ],
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
    "term": "Siara (kolostrum)",
    "kategorie": "chov",
    "shortDef": "Siara to pierwsze mleko krowy po wycieleniu — bogate w immunoglobuliny (IgG). Cielę musi otrzymać 4 litry siary w ciągu 6 godzin po urodzeniu dla odporności biernej. Bez siary: 30–50 % śmiertelność cieląt w pierwszych tygodniach.",
    "longDef": "Siara (łac. *colostrum*, pol. *siara*) to **pierwsze mleko krowy** po wycieleniu. Kluczowe dla **przeżycia cielęcia** — urodzone cielę nie ma wrodzonej odporności (łożysko krowy jest nieprzepuszczalne dla przeciwciał), siara jest jedynym źródłem **odporności biernej**.\n\n**Skład siary vs mleko:**\n\n| Komponent | Siara | Mleko (dzień 3+) |\n|-----------|-------|------------------|\n| Sucha masa | 23–28 % | 12–13 % |\n| Białko | 14–18 % | 3,3 % |\n| Tłuszcz | 6–7 % | 4 % |\n| IgG | 60–120 g/l | 0,5–1 g/l |\n| Witamina A | 10× wyższa | normalna |\n\n**Krytyczne okno absorpcji:**\n- 0–6 h po urodzeniu: 100 % absorpcja IgG (= najwyższa)\n- 6–12 h: 60 % absorpcja\n- 12–24 h: 30 % absorpcja\n- 24+ h: <10 % absorpcja (śluzówka „zamknięta\")\n\n**Zalecenia:**\n\n**1. pierwsza dawka (krytyczna):**\n- **4 litry siary w ciągu 6 godzin** po urodzeniu\n- Siara od matki (jeśli zdrowa) lub pasteryzowana z zapasów\n- Podanie: butelka lub sonda żołądkowa (drench tube)\n\n**2. Druga dawka:**\n- 2 litry w ciągu 6–12 h\n\n**3. Dzień 2–3:**\n- Stopniowe przejście na zwykłe mleko lub preparat mlekozastępczy\n\n**Jakość siary:**\n\n**Test (refraktometr Brix):**\n- >22 % Brix = wysoka jakość (>60 g IgG/l)\n- 18–22 % Brix = średnia\n- <18 % Brix = niska (konieczne uzupełnienie)\n\n**Czynniki jakości:**\n- Rasa: Jersey > Holstein (wyższe IgG)\n- Numer laktacji: starsze krowy mają wyższe IgG\n- Czas dojenia: pierwszy udój = najwyższe IgG\n- Higiena: czyste wymię → mniejsze zanieczyszczenie\n\n**Pasteryzacja:**\n- 60 °C × 60 min\n- Cel: zniszczenie *Mycoplasma bovis*, *Salmonella*, *Mycobacterium avium* (Johne's)\n- Nie obniża IgG znacząco (-10 %)\n- Pasteryzator: 100 000–300 000 Kč\n\n**Mrożenie:**\n- Jakościowa siara od topowych krów mrożona (-20 °C, torebki plastikowe 2 l)\n- Przydatność: 12 miesięcy\n- Rozmrażanie: kąpiel wodna 40 °C, maks. 60 min\n\n**Niepowodzenie odporności biernej (FPT):**\n- 20–30 % cieląt (średnia międzynarodowa)\n- Objawy: biegunka, zapalenie płuc w 1.–4. tygodniu\n- Diagnostyka: STP (całkowite białko) we krwi cielęcia 2.–7. dzień — <5,0 g/dl = FPT\n\n**Ekonomiczny wpływ:**\n\n**Bez jakościowej siary:**\n- 30–50 % śmiertelność (vs 5–10 %)\n- Leczenie: 1 000–3 000 Kč/cielę\n- Utracone cielę: 8 000–60 000 Kč wartości\n\n**Z zarządzaniem:**\n- Lepszy wzrost, lepsza produkcja w dorosłości (efekt epigenetyczny)\n\nZob. też [[oteleni]], [[jalovice]], [[mastitida]], [[transition-period]], [[dojirna]].",
    "alias": [
      "colostrum",
      "siara",
      "pierwsze mleko"
    ],
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
    "term": "Okres przejściowy (transition period)",
    "kategorie": "chov",
    "shortDef": "Okres przejściowy to 3 tygodnie przed i 3 tygodnie po wycieleniu = 6 tygodni krytycznego zdrowotnie i metabolicznie przejścia krowy. 70 % wszystkich problemów zdrowotnych powstaje w tym oknie. Klucz: projekt TMR, zarządzanie BCS, profilaktyka ketozy + hipokalcemii.",
    "longDef": "Okres przejściowy (ang. *transition period*) to **3 tygodnie przed i 3 tygodnie po wycieleniu** = **6 tygodni krytycznego przejścia** krowy mlecznej między okresem zasuszenia a aktywną laktacją. **70 % wszystkich problemów zdrowotnych** krowy mlecznej powstaje właśnie w tym oknie.\n\n**Główne ryzyka zdrowotne:**\n\n**1. Gorączka mleczna (hipokalcemia):**\n- Ca we krwi <8 mg/dl (norma 8,5–10,5)\n- Kliniczna: 3–8 % krów, porażenie, leżenie\n- Subkliniczna: 25–50 % krów (obniża produkcję, odporność)\n- Leczenie: glukonian wapnia IV\n- Profilaktyka: mieszanka anionowa przed porodem (DCAD <0)\n\n**2. Ketoza:**\n- Ujemny bilans energetyczny (NEB) → mobilizacja tłuszczu → ciała ketonowe\n- Subkliniczna: 30–50 % krów (BHB >1,2 mmol/l)\n- Kliniczna: 5–10 % (BHB >3 mmol/l, brak apetytu, oddech aceton)\n- Leczenie: glikol propylenowy, glukoza IV\n- Profilaktyka: monensyna (Kexxtone), cholina, stopniowe zwiększanie TMR\n\n**3. Zatrzymanie łożyska:**\n- 5–10 % wycieleń (wyższe przy ciążach bliźniaczych, dystocji)\n- Powikłania: metritis → obniżona płodność\n\n**4. Zapalenie macicy (metritis):**\n- Ostre (pyometra) i przewlekłe (endometritis)\n- Leczenie: antybiotyki + PGF₂α\n\n**5. Przemieszczenie trawieńca (DA):**\n- LDA (lewostronne): 95 %, 2–4 tygodnie po porodzie\n- Leczenie: operacyjne odprowadzenie (5 000–15 000 Kč)\n\n**6. Zapalenie wymienia** (zob. [[mastitida]]):\n- Supresja immunologiczna zwiększa ryzyko\n\n**Zarządzanie:**\n\n**3 tygodnie przed wycieleniem (Close-up Dry):**\n\nProjekt TMR:\n- **Mieszanka anionowa** (DCAD <0): zakwaszenie organizmu → lepsza mobilizacja Ca\n- Energia: 6,5–7,0 MJ NEL/kg SM\n- CP: 14–15 %\n- NDF: 32–35 %\n- Cel: utrzymanie wysokiego pobierania paszy\n\nMonitoring:\n- BCS (3,25–3,5, zob. [[bcs-body-condition]])\n- Pobieranie paszy dziennie\n- Aktywność\n\n**Dzień wycielenia + pierwsze 3 dni:**\n\n- Sucha, czysta porodówka (12+ m²)\n- Nadzór weterynaryjny\n- Siara dla cielęcia do 6 h (zob. [[kolostrum-mlezivo]])\n- Bolus wapniowy dla krowy bezpośrednio po porodzie\n- Drench (sondowanie) elektrolity + glikol propylenowy jeśli nie pije\n\n**Tygodnie 1–3 (Fresh Cow):**\n\nTMR przejściowy:\n- Stopniowe zwiększanie koncentratu (dzień 1: 60/40 kiszonka/koncentrat; dzień 21: 50/50)\n- Energia: 7,2 MJ NEL/kg SM\n- CP: 16–17 %\n- RUP: 35–38 %\n- Cholina (Reashure): 15 g/krowa/dzień\n\nMonitoring:\n- Codzienne ważenie mleka\n- Test BHB (ketoza) — dzień 5, 7, 12\n- Test NEFA (mobilizacja tłuszczu)\n- BCS co tydzień\n- Temperatura (>39,5 °C = problem)\n\n**Ekonomiczny wpływ:**\n\n**OPTYMALNY transition:**\n- 5 % problemów klinicznych\n- Produkcja 305d 11 000+ kg\n\n**ZŁY transition:**\n- 20–30 % problemów klinicznych\n- Leczenie: 5 000–10 000 Kč/krowa\n- Obniżona produkcja: -500 do -1 500 kg/laktację\n- Brakowanie: 20+ % (vs 10 %)\n\n**ROI inwestycji w zarządzanie transition**: 3–5× = najbardziej dochodowa inwestycja fermy mlecznej.\n\nZob. też [[oteleni]], [[bcs-body-condition]], [[mastitida]], [[tmr]], [[kolostrum-mlezivo]], [[krmne-davky]].",
    "alias": [
      "transition period",
      "okres przejściowy krowy mlecznej"
    ],
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
    "term": "Mieszaniec F1",
    "kategorie": "chov",
    "shortDef": "Mieszaniec F1 to pierwsze pokolenie krzyżówek dwóch różnych ras/linii. Wykazuje heterozję (hybrid vigor) — wyższą wydajność niż średnia rodziców. W rolnictwie kluczowe dla nasion (kukurydza hybrydowa, żyto) i produkcji zwierzęcej (mleko, trzoda, brojlery).",
    "longDef": "Mieszaniec F1 (ang. *F1 generation*, *first filial generation*) to **pierwsze pokolenie krzyżówek dwóch genetycznie odmiennych linii**. Charakteryzuje się **heterozją (hybrid vigor)** — wyższą wydajnością niż średnia rodziców. Kluczowa zasada genetyczna w nowoczesnym rolnictwie.\n\n**Zasada:**\n\n- **Rodzic A** × **Rodzic B** = **Pokolenie F1** (genetycznie identyczne, heterozygotyczne)\n- F1 × F1 = **F2** (rekombinanty, zmienne, heterozja maleje)\n\n**Heterozja (hybrid vigor):**\n- F1 wydajniejszy o 5–30 % ponad średnią rodziców\n- Mechanizm: kombinacja różnych alleli, maskowanie recesywnych wad\n- **Maleje w F2** → coroczny zakup nowego materiału siewnego F1\n\n**Zastosowanie w produkcji roślinnej:**\n\n**1. Kukurydza hybrydowa:**\n- Henry Wallace USA lata 20. XX w. — pionierstwo\n- Plony USA: 1900: 1,8 t/ha → dziś 11+ t/ha (dzięki F1)\n- Zalety F1: +20–30 % plonu, jednolitość, tolerancja na stres\n- Rynek: Pioneer, DEKALB (Bayer), Syngenta, Limagrain\n\n**2. Żyto hybrydowe** (zob. [[zito-ozime]]):\n- KWS lata 90. XX w. (CMS — cytoplazmatyczna sterylność samcza)\n- Plony: +30–50 % vs tradycyjne\n\n**3. Burak cukrowy, warzywa** — prawie 100 % F1\n\n**4. Hybrydowa pszenica** — nieudany projekt (samopylna)\n\n**Zastosowanie w produkcji zwierzęcej:**\n\n**1. Trzoda chlewna:**\n- Pietrain × (Wielka Biała × Landrace) = „double cross\"\n- Lochy F1: wysoka płodność (12+ prosiąt/miot)\n- Tuczniki F1: szybki wzrost, chude mięso\n\n**2. Brojlery:**\n- **Ross 308**: 4-liniowy mieszaniec, międzynarodowy standard\n- Wzrost: 42 dni z 40 g do 2,5 kg\n- Konwersja: 1,6 kg paszy / kg mięsa\n\n**3. Nioski:**\n- **ISA Brown** (Hubbard ISA, Hendrix Genetics)\n- 320+ jaj/rok (vs 200 tradycyjne)\n\n**4. Krzyżowanie bydła:**\n\n**Krzyż mleczny** (rzadziej):\n- Norweski czerwony × Holstein — odporne, lepsze zdrowie\n- Jersey × Holstein — wyższy tłuszcz\n\n**Krzyż mięsny** (powszechny):\n- Krowa Holstein × buhaj Charolais — premium mieszańce\n- Holstein × Aberdeen Angus — marmurkowanie\n- Komercyjny tucz: 50 kg → 600 kg w 12–18 mies.\n\n**Teoria heterozji:**\n1. **Dominacja**: F1 maskuje recesywne wady obu linii\n2. **Nadzdominacja**: heterozygot jest wydajniejszy\n3. **Epistaza**: synergia interakcji między loci\n\n**Etyka i debata:**\n- Uzależnienie gospodarstw od firm nasiennych (Bayer, Corteva, Syngenta, Limagrain)\n- Utrata tradycyjnej zmienności\n- **Open Source Seed Initiative** — alternatywa\n\n**Regulacje UE:**\n- Mieszańce CMS ≠ GMO (klasyczna technologia hodowlana)\n- Mieszańce GMO (Mon810) silnie ograniczone w UE\n\nZob. też [[plemenna-kniha]], [[inseminace]], [[zito-ozime]], [[kukurice-silazni]], [[ku-kontrola-uzitkovosti]].",
    "alias": [
      "pokolenie F1",
      "first filial generation",
      "krzyżówka"
    ],
    "related": [
      "plemenna-kniha",
      "inseminace",
      "zito-ozime",
      "kukurice-silazni"
    ]
  },
  {
    "slug": "precision-livestock-farming",
    "term": "Precyzyjny chów zwierząt (PLF)",
    "kategorie": "precise-farming",
    "shortDef": "Precyzyjny chów zwierząt (PLF) to system ciągłego automatycznego monitorowania zwierząt za pomocą sensorów (akcelerometry, RFID, kamery) i analizy AI danych. Wykrywa ruję, zapalenie wymienia, kulawizny, stres szybciej niż człowiek — obsługuje 80 % decyzji zarządczych fermy mlecznej.",
    "longDef": "Precyzyjny chów zwierząt (PLF, „precyzyjny chów\", ang. *smart farming*) to system **ciągłego automatycznego monitorowania zwierząt** przy użyciu sensorów, IoT i AI. Cel: wykrywanie **sygnałów biologicznych** (ruja, choroba, stres, żywienie) **szybciej niż człowiek** i przekształcanie danych w zarządzanie.\n\n**Historia:**\n- **Lata 90. XX w.**: pierwsze aktywometry (pedometry) w oborach\n- **Lata 2010**: rozpowszechnienie akcelerometrów na obrożach\n- **2015+**: modele AI/ML do analizy behawioralnej\n- **2020+**: kamery + computer vision (BCS, kulawizny)\n- **2024**: integracja LLM (Large Language Models) dla rekomendacji\n\n**Główne technologie sensorowe:**\n\n**1. Akcelerometry (obrożowe / nakolannikowe):**\n- **Mierzą**: aktywność (kroki, montowanie, leżenie)\n- **Zastosowanie**: wykrywanie rui, wczesna detekcja chorób, monitoring komfortu\n- **Topowe produkty**:\n  - **CowManager SensOor** (Holandia) — obrożowy\n  - **Allflex Heatime** (Izrael) — obrożowy\n  - **DeLaval DDM** — znaczek uszny\n  - **SCR Heatime** — izraelska alternatywa\n- **Cena**: 2 000–5 000 Kč/krowa (jednorazowa) + 30–80 Kč/mies. oprogramowanie\n\n**2. RFID (identyfikacja radiowa):**\n- **Kolczyk** (zob. [[usni-znamka]]) z wbudowanym chipem RFID\n- **Stacjonarne czytniki**: bramy do obory, boksy paszowe\n- **Zastosowanie**: identyfikacja, automatyczne żywienie (per krowa), monitoring pobierania\n\n**3. Analizator mleka (in-line):**\n- **Zintegrowany w hali udojowej** — mierzy objętość + skład w czasie rzeczywistym\n- **Parametry**: tłuszcz, białko, laktoza, przewodność (zapalenie wymienia — zob. [[mastitida]])\n- **Zastosowanie**: alarm wysokiego SCC, codzienna ocena użytkowości bez technika\n- **Rynek**: AfiLab (DeLaval), Lely milk analyzer\n\n**4. Kamery + Computer Vision:**\n- **Zastosowanie**:\n  - **Ocena BCS** (zob. [[bcs-body-condition]]) automatycznie\n  - **Wykrywanie kulawizn** — analiza chodu\n  - **Monitoring zachowania** (czas leżenia, wizyty przy wodopoju)\n  - **Wykrywanie rui** (uzupełnienie akcelerometru)\n- **Rynek**: DeLaval BCS Camera, Cargill ZAFFY (kulawizny), Connecterra (full AI)\n- **Cena**: 200 000–500 000 Kč instalacja\n\n**5. Sensory bolus (w żwaczu):**\n- **Połykane przez cielę** (doustnie) — żyje w żwaczu przez lata\n- **Mierzą**: pH żwacza, temperaturę, aktywność motoryczną\n- **Zastosowanie**: wykrywanie kwasicy, wczesna detekcja chorób\n- **Rynek**: Mottainai, Cowtronix\n- **Cena**: 3 000–8 000 Kč/krowa (jednorazowe)\n\n**6. Sensory poboru wody:**\n- **Pomiar zużycia wody** per krowa (przez RFID w boxie)\n- **Zastosowanie**: spadek poboru = wczesny wskaźnik choroby lub stresu\n\n**Kluczowe zastosowania PLF:**\n\n**1. Wykrywanie rui (zob. [[rijnost]]):**\n- **Tradycyjne wizualne**: 45–65 % detekcji\n- **PLF akcelerometr**: 90–98 % detekcji\n- **Timing inseminacji**: optymalny (6–18 h od początku rui)\n- **Ekonomiczny wpływ**: -50 dni okresu międzywycieleniowego = +500 l mleka/krowa/rok\n\n**2. Wykrywanie zapalenia wymienia:**\n- **In-line analizator mleka** wykrywa przewodność (≈ SCC)\n- **Alarm** przy wzroście 24 h przed objawami klinicznymi\n- **Szybsze leczenie** = mniejsze straty produkcji\n\n**3. Wykrywanie chorób (ogólne):**\n- **Zmiana zachowania** (-30 % aktywności lub -20 % przeżuwania) = alarm\n- **Wczesne leczenie** obniża wskaźnik brakowania\n- **Cielęta w okresie przejściowym** (zob. [[transition-period]]) — wysoki ROI\n\n**4. Wykrywanie kulawizn:**\n- **System kamerowy** śledzi chód\n- **Trening AI**: klasyfikacja 1–5 (locomotion score)\n- **Cel**: <5 % krów z wynikiem kulawizn >3\n\n**5. Monitoring dobrostanu:**\n- **Czas leżenia** (12–14 h = optimum)\n- **Czas stania przy żerowaniu**\n- **Interakcje społeczne**\n\n**6. Zarządzanie rozrodem:**\n- **Protokoły Ovsynch** według danych\n- **Timing inseminacji**\n- **Potwierdzenie zacielenia** (zmiana aktywności 5–7 dni po inseminacji)\n\n**Oprogramowanie i platformy:**\n\n- **CowManager** (Holandia) — dominujący w UE\n- **Connecterra IDA** (Holandia) — AI-first\n- **Afimilk Aclick** (Izrael)\n- **GEA CowScout** (Niemcy)\n- **Lely Astronaut + Horizon** (Holandia)\n- **Microsoft Azure FarmBeats** — platforma IoT\n\n**Robotyczne obory (AMS) jako platforma PLF:**\n- Lely Astronaut, DeLaval VMS, GEA DairyRobot\n- Integracja: dojenie + żywienie + sensory + oprogramowanie\n- Cena: 4–6 mln Kč per robot (1 robot = 60 krów)\n\n**ROI systemu PLF:**\n\n**Inwestycja na 100 krów:**\n- Akcelerometry + sw: 250 000–500 000 Kč\n- Plus analizator in-line: +400 000–800 000 Kč\n- Plus kamera BCS: +300 000–500 000 Kč\n- **Łącznie**: 950 000–1 800 000 Kč\n\n**Korzyści roczne:**\n- Lepsza detekcja rui: +1 000–2 000 Kč/krowa = 100 000–200 000 Kč/rok dla 100 krów\n- Mniej zapaleń wymienia: -50 000–100 000 Kč/rok\n- Lepszy dobrostan = lepsza długowieczność krów: 100 000–200 000 Kč/rok\n\n**Łącznie**: 250 000–500 000 Kč/rok ROI\n**Zwrot nakładów**: 2–5 lat\n\n**Bariery:**\n1. **Wysoka inwestycja** — trudna dla małych ferm\n2. **Złożoność** — wymaga umiejętności IT/cyfrowych\n3. **Zależność od internetu** — oprogramowanie chmurowe wymaga stabilnego łącza\n4. **Konserwacja** — żywotność sensorów 5–7 lat\n\n**Przyszłość:**\n- **Integracja LLM** — interfejs ChatGPT-like dla fermy\n- **Modele predykcyjne** — predykcja zapalenia wymienia 7 dni wcześniej\n- **Integracja genomiczna** — połączenie danych PLF z wartością hodowlaną\n- **Cyfrowy bliźniak** — koncepcja \"digital twin\" stada mlecznego\n\nZob. też [[rijnost]], [[mastitida]], [[bcs-body-condition]], [[ku-kontrola-uzitkovosti]], [[transition-period]], [[dojirna]], [[telematika]], [[usni-znamka]].",
    "alias": [
      "PLF",
      "precyzyjny chów",
      "precision dairy",
      "smart farming zwierzęcy"
    ],
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
    "term": "Satelity w rolnictwie",
    "kategorie": "precise-farming",
    "shortDef": "Dane satelitarne (Sentinel, Landsat, Planet) dostarczają wielospektralne zdjęcia do monitorowania pól — wskaźniki wegetacyjne (NDVI), wilgotność gleby, prognozowanie plonów, wykrywanie stresu roślin. Bezpłatne dane Sentinel umożliwiają każdemu gospodarstwu monitorowanie 100+ ha za ułamek kosztów.",
    "longDef": "Dane satelitarne to kluczowy **input dla rolnictwa precyzyjnego** — dostarczają **wielospektralne zdjęcia** o rozdzielczości przestrzennej 1–30 m i rozdzielczości czasowej 1–7 dni. Zastosowania: monitoring roślin, wykrywanie stresu, aplikacja zmiennych dawek (zob. [[variable-rate]]), prognozowanie plonów.\n\n**Główne programy satelitarne:**\n\n**1. Copernicus Sentinel (UE, bezpłatny!):**\n- **Sentinel-2** — wielospektralny (13 pasm), rozdzielczość 10 m (RGB+NIR), 20 m (red edge), 60 m (atmosferyczne)\n- **Częstotliwość**: 5 dni (kombinacja 2 satelitów)\n- **Zasięg**: cała UE regularnie\n- **Cena**: BEZPŁATNIE dla wszystkich (inicjatywa UE)\n- **API**: Sentinel Hub, Google Earth Engine\n\n**2. Landsat (USA, NASA, bezpłatny!):**\n- **Landsat 8/9** — rozdzielczość 30 m (wielospektralny), 100 m (termalny)\n- **Częstotliwość**: 16 dni (jeden satelita)\n- **Zasięg**: globalny od 1972 r. (50+ lat danych!)\n- **Cena**: BEZPŁATNIE\n- **Zastosowanie**: długoterminowe trendy, historia\n\n**3. Planet Labs (USA, komercyjny):**\n- **PlanetScope** — codzienne zdjęcia, rozdzielczość 3 m\n- **SkySat** — rozdzielczość 0,5 m (subdetailowa)\n- **Cena**: 10–50 USD/km²/mies.\n- **Zastosowanie**: rolnictwo precyzyjne na poziomie rośliny\n\n**4. Maxar / DigitalGlobe (komercyjny, drogi):**\n- **WorldView-3/4** — rozdzielczość 0,3 m\n- **Cena**: 25–100 USD/km²\n- **Zastosowanie**: wojsko, planowanie miejskie, rzadko ag\n\n**5. NICFI (Norwegia, tropikalne dane leśne bezpłatne):**\n- Planet Labs PlanetScope dla tropików BEZPŁATNIE\n- Dla ferm UE nieistotne\n\n**Wskaźniki wegetacyjne (kluczowe wyniki):**\n\n**1. NDVI (Normalized Difference Vegetation Index) — zob. [[ndvi]]:**\n- **Wzór**: (NIR - RED) / (NIR + RED)\n- **Wartości**: -1 do +1 (łan: 0,3–0,9)\n- **Interpretacja**: wyższy = więcej chlorofilu = zdrowszy łan\n- **Zastosowanie**: wykrywanie stresu, zmienne nawożenie N\n\n**2. NDRE (Normalized Difference Red Edge):**\n- **Wzór**: (NIR - RedEdge) / (NIR + RedEdge)\n- **Wrażliwszy** na zmienność N w roślinie\n- **Zastosowanie**: decyzje nawożeniowe w sezonie\n\n**3. EVI (Enhanced Vegetation Index):**\n- Solidniejszy wobec efektów atmosferycznych\n- Odpowiedni dla lasów, gęstych łanów\n\n**4. SAVI, OSAVI (Soil-Adjusted):**\n- Dla małego pokrycia (kukurydza w BBCH 12–30)\n- Odejmuje efekt gołej gleby\n\n**5. Wskaźniki termalne:**\n- Pasmo termalne Landsat 8/9\n- **CWSI** (Crop Water Stress Index) — wykrywanie suszy\n- Sentinel-3 = lepsze zdjęcia termalne (1 km rozdzielczość, dziennie)\n\n**6. SAR (Synthetic Aperture Radar):**\n- Sentinel-1 — radar (przebija chmury, widzi w nocy)\n- **Zastosowanie**: wilgotność gleby, biomasa, wykrywanie zbiorów\n\n**Komercyjne platformy dla rolników:**\n\n- **Climate FieldView** (USA, Bayer) — globalny lider, 500–1 500 USD/farma/rok\n- **OneSoil** (Holandia) — bezpłatna, NDVI z Sentinel\n- **Mapy.eAgronom** (CZ, EE) — krajowa integracja\n- **Yara Atfarm** — zmienność N\n- **Soyl** (Wielka Brytania) — zmienna dawka N + materiał siewny\n- **Agremo** (Serbia) — kombinacja dron + satelita\n- **SatAgro** (Polska) — oparte na Sentinel, farmy UE\n- **Sentinel Hub Playground** — platforma DIY (techniczna)\n\n**Zastosowania na farmie CZ:**\n\n**1. Zmienna dawka N:**\n- Sentinel-2 NDVI BBCH 32 pszenica\n- Mapa zmienności → plik dla opryskiwacza (ISO XML)\n- Maszyna aplikacyjna reaguje sekcja po sekcji (10–24 m sekcja)\n- **Oszczędność N**: 10–20 % (= 500–1 000 Kč/ha)\n\n**2. Wykrywanie stresu (susza, choroba):**\n- Regularny monitoring NDVI\n- Anomalia = sygnał do kontroli\n- Wczesna interwencja = zapobieganie stratom\n\n**3. Prognozowanie plonów:**\n- Historyczne dane NDVI + model ML\n- Prognoza plonów 30–60 dni przed zbiorem\n- Planowanie logistyki (suszarnie, magazyny)\n\n**4. Ubezpieczenie zbiorów:**\n- **Ubezpieczenie parametryczne** — polisa wypłaca według anomalii NDVI\n- **Bez potrzeby** oględzin pola przez ubezpieczyciela\n- **Rynek**: Hannover Re, Munich Re — ubezpieczenia parametryczne UE\n\n**5. Kontrole CAP UE:**\n- **SZIF** używa danych Sentinel do kontroli LPIS (zob. [[lpis]])\n- Wykrywa „zbiór przed ogłoszeniem\", niezgłoszone operacje\n- Geo-tagged photos weryfikowane satelitami\n\n**6. Historyczna analiza pola:**\n- 10+ lat danych NDVI BEZPŁATNIE\n- Identyfikacja zmienności gleby (strefy)\n- Planowanie inwestycji (drenaż, wapnowanie stref)\n\n**Ograniczenia techniczne:**\n- **Chmury** — Sentinel-2 optyczny nie widzi przez chmury (ok. 30 % zdjęć zachmurzone)\n- **Rozdzielczość** — 10 m nie widzi pojedynczych roślin (tylko powierzchniowo)\n- **Korekty atmosferyczne** — wymagają preprocessingu (obsługują platformy)\n- **Opóźnienie czasowe** — od wykonania zdjęcia do dostępności 1–7 dni\n\n**Koszty PRO farmę:**\n\n**Tier bezpłatny** (Sentinel + OneSoil):\n- **0 Kč**\n- Podstawowy NDVI 1× tygodniowo\n- Odpowiedni dla małych ferm\n\n**Tier średni** (Climate FieldView, eAgronom):\n- **15 000–40 000 Kč/rok**\n- Pełny interfejs, mapy zmiennych dawek, integracja z techniką\n- Odpowiedni dla ferm 200–1 000 ha\n\n**Tier najwyższy** (Planet + custom analytics):\n- **100 000+ Kč/rok**\n- Codziennie 3 m rozdzielczości, własne modele AI\n- Odpowiedni dla dużych korporacyjnych ferm lub projektów badawczych\n\n**Przyszłość:**\n- **Sentinel-3 NextGen** (2025+) — wyższa rozdzielczość\n- **Integracja AI** — automatyczna detekcja konkretnych chorób (rdze, septorioza)\n- **Ubezpieczenie w czasie rzeczywistym** — natychmiastowa wypłata według satelity\n- **Carbon credits** — weryfikacja sekwestracji poprzez monitoring satelitarny (zob. [[karbonove-zemedelstvi]])\n\nZob. też [[ndvi]], [[variable-rate]], [[gps-rtk]], [[lpis]], [[karbonove-zemedelstvi]], [[telematika]], [[drony-zemedelstvi]].",
    "alias": [
      "satellite agriculture",
      "remote sensing",
      "dane satelitarne",
      "dane Sentinel"
    ],
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
    "term": "Agroleśnictwo",
    "kategorie": "precise-farming",
    "shortDef": "Agroleśnictwo to system uprawy drzew i roślin rolniczych lub chowu zwierząt na tej samej działce. Kluczowe formy: alley cropping (rzędy drzew między roślinami), silvopasture (wypas między drzewami), forest farming (rozszerzona uprawa leśna). W UE rosnące w ramach CAP 2023+.",
    "longDef": "Agroleśnictwo (ang. *agroforestry*, „rolnictwo z lasem\") to **zintegrowany system uprawy drzew + roślin rolniczych lub chowu zwierząt** na tej samej działce. Synergia drzew i rolnictwa zwiększa produktywność, bioróżnorodność, sekwestrację węgla.\n\n**Główne formy:**\n\n**1. Alley cropping (uprawy w alejach):**\n- **Zasada**: rzędy drzew (owocowych, leśnych) w rozstawach 15–40 m, między nimi uprawy\n- **Drzewa**: orzech, jabłoń, grusza, lipa, dąb czerwony, olcha\n- **Rośliny**: pszenica, kukurydza, rzepak, rośliny strączkowe\n- **Plon roślin**: -10 do -20 % (ze względu na zacienienie)\n- **Plus drzewa**: owoce, drewno, sekwestracja C → kompensacja + premia\n\n**2. Silvopasture (wypas między drzewami):**\n- **Zasada**: pastwiska z rozproszonymi drzewami lub rzędami\n- **Zalety**: cień dla bydła (zmniejszony stres cieplny), wypas pod drzewami, bioróżnorodność\n- **Drzewa**: dąb, kasztan, owocowe, orzech\n- **Tradycja**: dehesa (Hiszpania), montado (Portugalia), pastwiska w CZ w Karkonoszach\n\n**3. Forest farming:**\n- **Zasada**: rozszerzona uprawa pod pokrywą leśną\n- **Plony**: grzyby, poziomki leśne, zioła, żeń-szeń\n- **Rynek niszowy**, wysoka marża\n\n**4. Pasy wiatrochronne + rośliny:**\n- **Pasowe nasadzenia** drzew wokół pól (5–20 m szerokie)\n- **Ochrona** przed erozją wietrzną\n- **Mikroklimat** — mniej suszy, lepsze plony o 5–15 %\n- **Tradycja CZ**: pasy wiatrochronne na południu Moraw\n\n**5. Strefy buforowe wzdłuż cieków (riparian buffer):**\n- **Drzewa wzdłuż cieków** (5–30 m)\n- **Cel**: filtracja spływu nawozów + pestycydów, bioróżnorodność\n- **Dopłaty UE** w ramach AEKO\n\n**6. Plantacyjne sady owocowe:**\n- **Klasyczny sad** to już forma agroleśnictwa\n- **Intensywny**: jabłonie 800–1 200/ha, jednoosie rzędy\n- **Plus**: pas trawy między rzędami → wypas bydła\n\n**Usługi ekosystemowe:**\n\n**1. Sekwestracja węgla:**\n- **Drzewa magazynują C w drewnie + glebie** — 2–10 t CO₂/ha/rok\n- Dla CAP carbon farming = wysoki kredyt (zob. [[karbonove-zemedelstvi]])\n\n**2. Bioróżnorodność:**\n- **Drzewa** = siedlisko dla ptaków, owadów, małych ssaków\n- **Redukcja pestycydów** — drapieżniki szkodników (biedronki, owady pasożytnicze)\n\n**3. Gospodarka wodna:**\n- **Korzenie drzew** infiltrują wodę głębiej\n- **Zmniejsza erozję** (zob. [[eroze-pudy]])\n- **Pasy wiatrochronne** zmniejszają ewaporację o 20–30 %\n\n**4. Dobrostan zwierząt (silvopasture):**\n- Cień latem = mniejszy stres cieplny\n- Swobodny ruch dla bydła\n\n**5. Dywersyfikacja dochodów:**\n- Rośliny + drewno + owoce + grzyby + biopaliwa\n- Rozproszenie ryzyka przed szokami rynkowymi\n\n**Ekonomika:**\n\n**Koszty nasadzeń**:\n- **Drzewa** (sadzonki): 100–500 Kč/drzewo\n- **Gęstość**: 100–400 drzew/ha (rzędowe nasadzenia)\n- **Ochrona** (osłony przed zwierzyną, ogrodzenie): 50–200 Kč/drzewo\n- **Pielęgnacja** (podlewanie przez pierwsze 3 lata, przycinanie): 20–50 Kč/drzewo/rok\n- **Łącznie startup**: 30 000–100 000 Kč/ha\n- **Operacyjne**: 1 000–3 000 Kč/ha/rok\n\n**Zwrot z inwestycji**:\n- **Owoce** od roku 5–7 (jabłoń, grusza)\n- **Orzechy** od roku 8–12 (orzech włoski)\n- **Drewno** od roku 30–60 (gatunki leśne)\n- **Carbon credits** natychmiast (3–8 EUR/t CO₂)\n- **Dopłaty CAP** za drzewa (patrz niżej)\n\n**CAP UE 2023–2027 i agroleśnictwo:**\n\n**1. Eko-schematy (dopłata EKO):**\n- **Drzewa w rolnictwie** = premia +1 300 Kč/ha\n- **Warunek**: min. 50 drzew/ha, rejestracja\n\n**2. Poddziałanie AEKO:**\n- **Trwałe elementy krajobrazu** (aleja, pas wiatrochronny) — 50–80 Kč/m/rok\n- **Pastwiska z drzewami** — wyższa stawka ANC\n\n**3. Interwencja 4.4** (Plan Strategiczny WPR):\n- **Wsparcie inwestycyjne dla nasadzeń** drzew na gruntach rolnych\n- **60–80 % kosztów** dotowane\n- **Cel UE**: 3 mld nowych drzew do 2030 r.\n\n**Ramy prawne CZ:**\n- **Rozporządzenie 314/2017** o drzewach w rolnictwie\n- **LPIS** musi rejestrować drzewa\n- **GAEC 8** wymaga zachowania elementów krajobrazu\n\n**Bariery wdrożenia:**\n1. **Długoterminowa inwestycja** — zwrot 5–30 lat\n2. **Dzierżawiona ziemia** — dzierżawca nie chce inwestować w drzewa\n3. **Zacienienie roślin** — spadek plonów o 10–20 %\n4. **Pielęgnacja** — przycinanie, ochrona, podlewanie\n5. **Mechanizacja** — utrudnia pracę maszynami polowymi\n\n**Przykłady udanych gospodarstw:**\n- **Wakelyns** (Wielka Brytania) — alley cropping pszenica + orzech, 30+ lat\n- **Stilo** (Francja) — silvopasture bydło + dąb\n- **CZ projekty pilotażowe** — Uniwersytet Południowoczeskoky, Mendelu Brno\n\n**Trend:**\n- **Strategia UE „Od pola do stołu\"** wspiera agrolesnictwo\n- **Adaptacja do zmiany klimatu** — drzewa + rośliny = odporność\n- **Carbon credits** — rosnący rynek dla sekwestracji agrolesniczej\n\nZob. też [[karbonove-zemedelstvi]], [[regenerativni-zemedelstvi]], [[eroze-pudy]], [[mez]], [[biopasy]], [[gaec]].",
    "alias": [
      "agroforestry",
      "agroles",
      "silvopasture",
      "alley cropping"
    ],
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
    "term": "Hydroponika",
    "kategorie": "precise-farming",
    "shortDef": "Hydroponika to uprawa roślin bez gleby — w obojętnym substracie (perlit, kokos, wełna mineralna) lub bezpośrednio w wodzie z pożywką. Kluczowa dla szklarni (pomidory, papryka, sałata) i farm pionowych. Zużycie wody -90 %, plon +30 % vs uprawa glebowa.",
    "longDef": "Hydroponika (gr. *hydro* + *ponos* = woda + praca) to **uprawa roślin bez gleby** — korzenie w obojętnym substracie (perlit, kokos, wełna mineralna) lub bezpośrednio w wodzie z rozpuszczonymi składnikami odżywczymi. Kluczowa technologia dla **szklarni, farm pionowych, urban agriculture**.\n\n**Zasada:**\n- Roślina pobiera **składniki odżywcze z roztworu wodnego** (= nutrient solution), nie z gleby\n- Korzenie w obojętnym substracie (struktura) lub bezpośrednio w powietrzu/wodzie\n- **Precyzyjna kontrola** pH, EC (electrical conductivity), temperatury, stężeń N/P/K\n- **Bardzo wydajne** wykorzystanie wody i składników odżywczych\n\n**Główne systemy:**\n\n**1. NFT (Nutrient Film Technique):**\n- **Cienki strumień** roztworu odżywczego przez korzenie w rynnach\n- **Rośliny**: sałata, bazylia, truskawki\n- **Plusy**: prosty, tani\n- **Minusy**: awaria pompy = szybka śmierć roślin\n\n**2. DWC (Deep Water Culture):**\n- **Korzenie zanurzone** w napowietrzonym roztworze\n- **Napowietrzacze** dostarczają tlen do korzeni\n- **Rośliny**: sałata, konopie (medicinalne), zioła\n- **Plusy**: wysokie plony, prosty\n- **Minusy**: awaria napowietrzania = korzenie beztlenowe po 4 h\n\n**3. Ebb & Flow (Flood & Drain):**\n- **Periodycznie** zalewany substrat\n- **Rośliny**: warzywa, owoce, ozdobne\n- **Plusy**: elastyczny, tani\n- **Minusy**: wymaga kontroli timerowej\n\n**4. Nawadnianie kroplowe:**\n- **Krople pożywki** na bazie substratu (wełna mineralna, kokos)\n- **Rośliny**: pomidory, papryka, ogórki (szklarniowe)\n- **Plusy**: precyzyjne, standard UE\n- **Minusy**: wyższa inwestycja\n\n**5. Aeroponika:**\n- **Korzenie w powietrzu** + spray pożywki\n- **Rośliny**: sałata, ziemniaki (sadzonki)\n- **Plusy**: najwyższe natlenienie = najszybszy wzrost\n- **Minusy**: wysoka inwestycja, technicznie trudna\n\n**Substraty:**\n\n**1. Wełna mineralna (Rockwool):**\n- **Standard szklarni UE** dla pomidorów, papryki\n- **Cena**: 50–150 Kč/m³\n- **Recykling**: drogi, problem środowiskowy\n\n**2. Włókno kokosowe:**\n- **Podejście bio** — alternatywa dla wełny mineralnej\n- **Cena**: 80–200 Kč/m³\n- **Plus**: biodegradowalne\n\n**3. Perlit, wermikulit:**\n- **Lekkie** substraty do skrzynek uprawowych\n- **Cena**: 100–300 Kč/m³\n\n**4. Hydroton (keramzyt):**\n- **Granulki** do DWC, ebb & flow\n- **Cena**: 80–200 Kč/m³, wielokrotnie używalny\n\n**5. Bezsubstratowe** (NFT, DWC, aero):\n- **Brak substratu** = najniższe koszty\n- Odpowiednie tylko dla sałaty, ziół\n\n**Pożywka — nutrient solution:**\n\n**Kluczowe składniki** (NPK + mikroelementy):\n- **N**: 100–250 mg/l (zależy od rośliny)\n- **P**: 30–80 mg/l\n- **K**: 150–300 mg/l\n- **Ca**: 100–200 mg/l\n- **Mg**: 30–60 mg/l\n- **Mikroelementy**: Fe, Mn, Zn, Cu, B, Mo (w ppb)\n\n**pH**: 5,5–6,5 (optymalna absorpcja składników odżywczych)\n**EC**: 1,5–3,0 mS/cm (zależy od rośliny)\n**Temperatura roztworu**: 18–22 °C\n\n**Nawozy komercyjne:**\n- **Roztwór Hoaglanda** — klasyczna receptura\n- **PPM (Plant Prod)** — komercyjne mieszanki\n- **Floraseries** (GHE) — orientacja konopna\n- **Yara Krista** — profesjonalne\n\n**Zastosowania:**\n\n**1. Szklarnie pomidorowe:**\n- Holandia = 8 000 ha (50 % produkcji UE w 1 kraju!)\n- **Plon pomidorów**: 60–80 kg/m²/rok (vs 4 kg/m² glebowy)\n- **Koszt instalacji szklarni**: 2 000–5 000 Kč/m²\n\n**2. Szklarnie paprykowe, ogórkowe:**\n- Podobne do pomidorów\n- Producenci CZ: BeJa, Frudoma, Magna Czech\n\n**3. Sałata i zioła (NFT, DWC):**\n- **Cykl 24-godzinny** — zbiór każdego dnia\n- Koncepcja **plant factory**\n- Producenci CZ: Salatika, Czech Microgreens\n\n**4. Truskawki:**\n- **Hydroponiczne truskawki** — całoroczne plony\n- **Wysoka premia** (smak, cena)\n\n**5. Konopie (medicinalne):**\n- **Rosnący rynek UE** (Niemcy, Holandia, CZ programy pilotażowe)\n- **Hydroponika** = standard dla uprawy indoor\n\n**6. Microgreens:**\n- **Cykl 8–14 dni** — szybki zbiór\n- **Premium retail** — szefowie kuchni, fine dining\n\n**Zalety hydroponiki:**\n\n1. **Woda**: -90 % zużycia (recyrkulacja)\n2. **Składniki odżywcze**: -50 % (precyzyjne dawkowanie)\n3. **Plon**: +30 do +1 000 % vs glebowy (zależy od rośliny)\n4. **Presja mikroorganizmów**: niższa (sterylne środowisko)\n5. **Pestycydy**: -80 % (kontrolowane środowisko)\n6. **Powierzchnia**: 5–10× wyższa produkcja na m²\n7. **Sezonowość**: produkcja 24/7\n8. **Jakość**: spójna, premium\n\n**Wady:**\n\n1. **Wysoka inwestycja** — startup 2 000–10 000 Kč/m²\n2. **Energochłonność** (oświetlenie LED, napowietrzacze)\n3. **Technicznie złożona** — wymaga wiedzy z chemii + biologii + IT\n4. **Zależność od elektryczności** — awaria = strata\n5. **Zarządzanie pożywką** — drogie profesjonalne nawożenie\n6. **Nie certyfikowana bio** (z wyjątkiem niektórych stanów USA)\n\n**Ekonomika:**\n\n**Szklarnia pomidorowa 1 ha (10 000 m²):**\n- Inwestycja: 30–50 mln Kč\n- Koszty operacyjne: 5–10 mln Kč/rok (energia, woda, pożywka, praca)\n- Przychód: 700 t/ha × 35 Kč/kg = 24,5 mln Kč/rok\n- Marża: 14,5 mln Kč/rok\n- Zwrot: 3–4 lata\n\n**Farma pionowa sałaty (zob. [[vertikalni-farma]]):**\n- Inwestycja: 100 000–300 000 Kč/m² powierzchni budynku\n- Wyższa produkcja per m² ale droższa inwestycja\n- Zwrot: 5–10 lat\n\n**Producenci i rynek CZ:**\n- **Frudoma** (Ołomuniec) — pomidory, papryka\n- **BeJa Group** — nowoczesne szklarnie\n- **Magna Czech** — szklarnictwo\n- **Salatika** — sałata, micro-greens\n- **HempFlow** (Praga) — konopie medicinalne\n\n**Trendy 2024:**\n- **Technologia LED** — bardziej wydajna, cenowo dostępna\n- **Systemy sterowania AI** — automatyzacja pH, EC, klimatu\n- **Rośliny CRISPR** dostosowane do hydroponiki\n- **Plant factories** — w pełni zautomatyzowane, 24/7\n\nZob. też [[vertikalni-farma]], [[precision-livestock-farming]], [[npk-hnojivo]], [[satelity-zemedelstvi]].",
    "alias": [
      "hydroponics",
      "uprawa bezglebowa",
      "soilless growing"
    ],
    "related": [
      "vertikalni-farma",
      "npk-hnojivo"
    ]
  },
  {
    "slug": "vertikalni-farma",
    "term": "Farma pionowa",
    "kategorie": "precise-farming",
    "shortDef": "Farma pionowa to wielopiętrowy system uprawy roślin w kontrolowanym środowisku wewnętrznym (oświetlenie LED, hydroponika). Cel: produkcja w miastach, blisko konsumenta, 365 dni/rok. Plony 50–100× wyższe na m² gruntu, ale energochłonność wysoka.",
    "longDef": "Farma pionowa (ang. *vertical farming*, *plant factory*) to **wielopiętrowy system uprawy roślin w kontrolowanym środowisku wewnętrznym** (CEA — Controlled Environment Agriculture). Połączenie **hydroponiki** (zob. [[hydroponie]]) + **oświetlenia LED** + **AI/IoT** sterowanie + pionowe piętrzenie.\n\n**Zasada:**\n- **Wielopiętrowa struktura** (5–20+ pięter)\n- **Oświetlenie LED** zastępuje słońce (red + blue spectrum)\n- **Hydroponika** zastępuje glebę\n- **HVAC** (klimatyzacja) kontroluje temperaturę, wilgotność, CO₂\n- **W pełni izolowane** od zewnętrznego środowiska — bez pestycydów, chorób\n- **365 dni/rok** produkcji\n\n**Historia:**\n- **1999** — Dickson Despommier (Uniwersytet Columbia) popularyzuje koncepcję\n- **2010** — pierwsze komercyjne farmy pionowe w Japonii (Tokio)\n- **2015+** — boom inwestycyjny w USA, UE\n- **2022–2023** — niektóre duże projekty (Plenty, AeroFarms, Infarm) **upadły** z powodu wysokich kosztów\n- **2024** — konsolidacja rynku, fokus na ekonomicznie rentowne modele\n\n**Główne rośliny:**\n\n**1. Sałata (90 % komercyjnych farm pionowych):**\n- **Cykl**: 21–35 dni od nasiona\n- **Plon**: 1 500–3 000 główek/m² powierzchni budynku/rok\n- **Rynek**: premium retail (Tesco, Whole Foods), restauracje\n\n**2. Microgreens:**\n- **Cykl**: 7–14 dni\n- **Premia**: 800–2 000 Kč/kg\n- **Rynek**: fine dining, zestawy mieszane\n\n**3. Zioła (bazylia, kolendra, mięta):**\n- **Cykl**: 25–45 dni\n- **Wysoka premia**: 1 500–3 000 Kč/kg\n- **Rynek**: retail + foodservice\n\n**4. Truskawki:**\n- **Produkcja całoroczna**\n- **Premia**: do 800 Kč/kg\n- **Rynek**: premium retail\n\n**5. Warzywa liściaste** (jarmuż, szpinak, rukola):\n- Podobne do sałaty\n- Rosnący trend dla świadomych zdrowia\n\n**6. Pomidory, papryka** — rzadko (energochłonne):\n- **Tylko high-tech farmy**\n- Rosnące wysiłki (Plenty, Bowery)\n\n**7. Konopie (medicinalne):**\n- **Rosnący rynek UE** (regulacyjnie ograniczony)\n- **Premia**: ekstremalnie wysoka\n- **Energia**: jeszcze wyższa niż sałata\n\n**Kluczowe technologie:**\n\n**1. Oświetlenie LED:**\n- **Czerwone światło** (660 nm) — fotosynteza\n- **Niebieskie światło** (450 nm) — wzrost wegetatywny\n- **Dostrajanie widma** według rośliny + fazy wzrostu\n- **DLI** (Daily Light Integral): 10–25 mol/m²/dzień\n- **Koszt LED**: 5 000–15 000 Kč/m² powierzchni uprawowej\n- **Żywotność**: 50 000–80 000 h (5–10 lat)\n\n**2. HVAC (klimatyzacja):**\n- **Temperatura**: 20–24 °C\n- **Wilgotność**: 65–75 %\n- **Wzbogacanie CO₂**: 800–1 200 ppm (vs 420 ppm normalna atmosfera)\n- **Zużycie energii**: 50 % całkowitego zużycia farmy\n\n**3. System hydroponiczny:**\n- **NFT, DWC, aeroponika** (zob. [[hydroponie]])\n- **Automatyczne nawożenie** + monitoring pH + EC\n- **Recyrkulacja wody** = 95 % oszczędności vs glebowy\n\n**4. Automatyzacja:**\n- **Robotyczne siew, transplantacja, zbiór**\n- **AI vision** do wykrywania chorób, fazy wzrostu\n- **Predykcyjne sterowanie** klimatem i oświetleniem\n\n**5. Oprogramowanie i IoT:**\n- **Plant Hub, Source.AI** — monitoring roślin\n- **Skylab Analytics** — optymalizacja wydajności\n- **Platformy chmurowe** dla operacji wielofarmowych\n\n**Energochłonność (kluczowy problem):**\n\n**Zużycie per kg produkcji:**\n- **Sałata**: 8–25 kWh/kg\n- **Zioła**: 15–40 kWh/kg\n- **Pomidory**: 60–100 kWh/kg (dlatego nieodpowiednie!)\n- **Konopie**: 1 000+ kWh/kg\n\n**Cena energii elektrycznej** = ~50–70 % kosztów farmy\n- Przy 4 Kč/kWh × 20 kWh/kg sałaty = **80 Kč/kg tylko energia**\n- Plus praca + materiały + amortyzacja = łączne koszty 150–300 Kč/kg sałaty\n- Vs **polna sałata**: 30–60 Kč/kg koszty\n\n**Realia ekonomiczne:**\n\n**Farma pionowa rentowna tylko dla:**\n1. **Premium retail** (Whole Foods, Tesco F&F): 250–500 Kč/kg\n2. **Restauracje** (fine dining): 400–1 200 Kč/kg\n3. **Produkty specjalne** (micro-greens, egzotyczne zioła): 800+ Kč/kg\n4. **Kontrakty B2B** (szefowie kuchni sushi, sieci sałatkowe)\n\n**NIE dla masowego rynku** (zwykła sałata w Lidlu za 30 Kč/kg) — ekonomicznie niemożliwe.\n\n**Kluczowe farmy (2024):**\n- **AeroFarms** (USA) — Newark, NJ. Farma 6 000 m², sałata\n- **Plenty** (USA) — finansowane przez SoftBank, problemy z rentownością\n- **Bowery Farming** (USA) — pomidory, sałata\n- **Infarm** (Niemcy) — modularne farmy w supermarketach, **upadek 2023**\n- **Sky Greens** (Singapur) — pierwsza komercyjna (2012)\n- **YesHealth iFarm** (Tajwan) — high-tech\n- **Spread** (Japonia) — czołowa automatyzacja\n- **Crops in Pots** (Praga, CZ) — pilotażowa\n\n**Sytuacja CZ:**\n- **Projekty pilotażowe** w Pradze, Brnie\n- **Żadna duża komercyjna farma** jak dotąd\n- **Rynek: premium retail + restauracje** — limit ~100 t produkcji/rok dla całych Czech\n- **Bariery**: wysoka inwestycja (50–200 mln Kč), tania importowana produkcja z Hiszpanii\n\n**Bariery adopcji:**\n1. **Wysoka inwestycja**: 100–300 tys. Kč/m² powierzchni budynku\n2. **Energochłonność** — droga elektryczność\n3. **Uzależnienie klimatyczne** — energia słoneczna/wiatrowa potrzebna do redukcji śladu węglowego\n4. **Kapitał ludzki** — wymaga IT + biologii + inżynierii\n5. **Limit rynku** — segment premium jest mały\n\n**Zalety:**\n1. **Woda**: 90–95 % oszczędności\n2. **Pestycydy**: 0 (kontrolowane środowisko)\n3. **Plon/m²**: 50–100× vs polny\n4. **Sezonowość**: 365 dni\n5. **Lokalność**: bez transportu (urban farming)\n6. **Spójna jakość**\n\n**Trendy 2024+:**\n- **Konsolidacja** rynku (duże projekty upadły)\n- **Integracja solar + baterie** — redukcja zależności elektrycznej\n- **Optymalizacja AI** — algorytmy redukcji energii o 20–40 %\n- **Rośliny GMO/CRISPR** wyhodowane na miarę farm pionowych (szybki wzrost, niskie zapotrzebowanie na światło)\n- **Modele hybrydowe** — semi-pionowe szklarnie (wykorzystanie światła słonecznego + suplement LED)\n\n**Dyskusja etyczna:**\n- **Farmy pionowe = przyszłość** czy **drogi chwyt marketingowy**?\n- **Rolnictwo polowe** nadal najekonomiczniejsze dla większości roślin\n- **Farmy pionowe = nisza** dla miejskiego premium\n\nZob. też [[hydroponie]], [[satelity-zemedelstvi]], [[precision-livestock-farming]], [[ai-zemedelstvi]].",
    "alias": [
      "vertical farm",
      "vertical farming",
      "plant factory"
    ],
    "related": [
      "hydroponie",
      "satelity-zemedelstvi",
      "precision-livestock-farming"
    ]
  },
  {
    "slug": "agro-iot",
    "term": "IoT w rolnictwie",
    "kategorie": "precise-farming",
    "shortDef": "IoT (Internet of Things) w rolnictwie to sieć połączonych sensorów, maszyn i systemów zbierających dane w czasie rzeczywistym — wilgotność gleby, temperatura, zasoby wodne, stan maszyn, żywienie, krowy. Dane trafiają do chmury do analizy AI i decyzji zarządczych.",
    "longDef": "IoT (Internet of Things, „internet rzeczy\") w rolnictwie to **sieć połączonych sensorów, maszyn i systemów**, które zbierają dane w czasie rzeczywistym, przesyłają je do chmury do analizy AI i dostarczają **decyzji zarządczych**.\n\n**Kluczowe komponenty systemu IoT:**\n\n**1. Sensory (zbieranie danych):**\n\n**Sensory glebowe:**\n- **Wilgotność gleby** (TDR — Time Domain Reflectometry, pojemnościowy)\n- **Temperatura gleby** (kilka głębokości: 10, 30, 60 cm)\n- **EC** (electrical conductivity — zasolenie, składniki odżywcze)\n- **pH gleby** (bezpośrednio w polu)\n- **Sensory NPK** (pomiar w czasie rzeczywistym)\n- **Cena**: 2 000–20 000 Kč per sensor\n\n**Stacje klimatyczne:**\n- **Temperatura powietrza, wilgotność, opady, wiatr, promieniowanie słoneczne**\n- **Dodatki**: ciśnienie, ewapotranspiracja, wilgotność liści (= ryzyko chorób)\n- **Rynek**: Davis Instruments, Pessl Metos, Sencrop\n- **Cena**: 10 000–80 000 Kč\n\n**Sensory roślinne:**\n- **NDVI z drona lub satelity** (zob. [[ndvi]], [[satelity-zemedelstvi]])\n- **Systemy kamerowe** (computer vision dla chorób)\n- **Sensory przepływu soków** (przepływ naczyniowy w roślinie)\n\n**Sensory zwierzęce (PLF):**\n- **Obroże** (akcelerometr, GPS) — zob. [[precision-livestock-farming]]\n- **Sensory bolus w żwaczu**\n- **In-line analizatory mleka**\n- **Kamery w oborze**\n\n**Sensory maszynowe:**\n- **GPS-RTK** w ciągnikach, kombajnach (zob. [[gps-rtk]])\n- **Telematyka** — zob. [[telematika]]\n- **Dane CAN bus** — silnik, hydraulika, paliwo\n- **Monitor plonów** — zob. [[yield-monitor]]\n\n**Sensory wodne:**\n- **Przepływ** w sieciach nawadniających\n- **Poziom** w zbiornikach, studniach\n- **Monitoring** pompy\n\n**2. Warstwa komunikacyjna (transmisja danych):**\n\n**LoRaWAN** (Long Range WAN):\n- **Zasięg**: 5–15 km teren wiejski\n- **Pobór energii**: ekstremalnie niski (bateria 5+ lat)\n- **Odpowiedni**: sensory glebowe, gospodarka wodna\n- **Cena**: 200–500 Kč/sensor/rok\n\n**NB-IoT (Narrowband):**\n- **Sieć komórkowa** (3G/4G/5G)\n- **Wyższy pobór energii**, ale lepsze pokrycie\n- **Odpowiedni**: mobilne zwierzęta, ciągniki\n\n**Wi-Fi:**\n- **Krótki zasięg** (100 m), wyższy pobór energii\n- **Odpowiedni**: obory, magazyny\n\n**5G**:\n- **Wysoka przepustowość** + niska latencja\n- **Odpowiedni**: autonomiczne maszyny, drony, analiza kamerowa\n\n**3. Cloud + Edge computing:**\n\n**Edge (lokalnie):**\n- **Wstępne przetwarzanie danych** na ciągniku, w oborze\n- **Redukcja ruchu danych** do chmury\n- **Szybsza odpowiedź** (decyzje real-time)\n\n**Cloud:**\n- **AWS, Azure, Google Cloud** — platformy\n- **AWS Greengrass**, **Azure IoT Edge** — IoT-specyficzne\n- **Cena**: 5 000–50 000 Kč/mies. dla dużej fermy\n\n**4. Analiza AI/ML:**\n\n**Zastosowania:**\n- **Predictive maintenance** maszyn (awaria silnika)\n- **Prognozowanie chorób** według pogody + stanu pola\n- **Prognozowanie plonów** z wielu źródeł danych\n- **Wykrywanie anomalii** w zachowaniu zwierząt\n- **Optymalizacja** żywienia, oprysków, nawożenia\n\n**5. Wizualizacja + dashboardy:**\n\n- **Platformy webowe**: Climate FieldView, OneSoil, eAgronom\n- **Aplikacje mobilne** dla rolników\n- **Alarmy** (SMS, e-mail, powiadomienie push)\n\n**Główne zastosowania IoT w rolnictwie:**\n\n**1. Smart irrigation:**\n- Sensory wilgotności gleby + meteo + AI = optymalny plan nawadniania\n- **Oszczędność wody**: 30–50 %\n- **ROI**: 1–2 lata\n\n**2. Prognozowanie chorób:**\n- Wilgotność liści + temperatura + opady → prognoza septoriozy, zarazy\n- **Modele**: BlightCast, SmartGrain, FieldClimate\n- **Celowane opryski** zamiast pauszalnych\n\n**3. Monitoring roślin:**\n- Dron + satelita + sensory glebowe = kompleksowy monitoring\n- **Zmienna dawka** nawozów, oprysków (zob. [[variable-rate]])\n\n**4. Monitoring zwierząt:**\n- Zob. [[precision-livestock-farming]]\n- Wykrywanie rui, zapalenia wymienia, kulawizn\n\n**5. Monitoring przechowalnictwa:**\n- Temperatura + wilgotność w silosie, w magazynie zboża\n- **Profilaktyka**: gnicie, pleśń, mykotoksyny\n\n**6. Automatyzacja szklarni:**\n- Temperatura + wilgotność + CO₂ + sterowanie oświetleniem\n- **W pełni zautomatyzowane** dla szklarni pomidorowych, paprykami\n\n**7. Zarządzanie flotą:**\n- GPS + dane CAN wszystkich maszyn\n- **Optymalizacja** logistyki, śledzenie zużycia paliwa, zapobieganie kradzieżom\n\n**8. Smart sprayer:**\n- Section control (zob. [[section-control]]) + RTK GPS + sensory\n- Pełna zmienna dawka pestycydów\n\n**Przykłady rozwiązań IoT w CZ:**\n\n**Ferma miejska:**\n- **Climate FieldView** (Bayer) — globalny lider\n- **OneSoil** — freemium dla małych ferm\n- **eAgronom** — krajowe rozwiązanie CZ\n- **AgroIT** (startup CZ) — systemy IoT dla ferm CZ\n- **Agrosoft** — ERP dla ferm\n\n**Duzi gracze:**\n- **John Deere Operations Center** — zintegrowany system\n- **Bayer Climate FieldView** — globalna platforma\n- **CNH Industrial AGXTEND** — połączenie maszyn + danych\n\n**Ekonomika IoT dla typowej fermy (500 ha):**\n\n**Inwestycja:**\n- 5 stacji glebowych × 8 000 Kč = 40 000 Kč\n- 1 stacja meteo × 50 000 Kč = 50 000 Kč\n- RTK kit do 2 ciągników × 80 000 Kč = 160 000 Kč\n- Monitor plonów w kombajnie = 100 000 Kč\n- Oprogramowanie roczne = 30 000 Kč\n- **Startup**: 350 000–400 000 Kč\n- **Roczne**: 50 000–100 000 Kč (oprogramowanie + konserwacja)\n\n**Korzyści:**\n- Zmienna dawka N: -10–20 % zużycia = 500–1 000 Kč/ha × 500 ha = 250 000–500 000 Kč/rok\n- Lepszy timing oprysków: -30 % kosztów oprysków = 100 000–300 000 Kč/rok\n- Mniej paliwa (RTK = mniej nakładania): -5 % = 50 000–100 000 Kč/rok\n- Lepsze plony: +200 kg/ha pszenicy = +650 000 Kč/rok dla 500 ha\n\n**ROI**: 1–3 lata dla typowej fermy\n\n**Bariery:**\n1. **Inwestycja** — wysoka dla małych ferm\n2. **Łączność internetowa** — problemy na wsi\n3. **Złożoność** — wymaga wiedzy IT\n4. **Integracja danych** — różne platformy nie synchronizują\n5. **Prywatność** — kto jest właścicielem danych fermy?\n\n**Standardy i interoperacyjność:**\n- **ISOBUS** (zob. [[isobus]]) — komunikacja ciągnik ↔ narzędzie\n- **ADAPT** (AgGateway) — standard wymiany danych\n- Debaty podobne do RODO o własności danych fermy\n\n**Trendy 2024+:**\n- **Adopcja 5G** — szybciej, niższa latencja\n- **Edge AI** — więcej inteligencji w terenie\n- **Otwarte platformy danych** — interoperacyjność\n- **Walidacja carbon credits** — dane IoT weryfikują sekwestrację\n- **Identyfikowalność blockchain** — łańcuch żywnościowy od fermy do konsumenta\n\nZob. też [[telematika]], [[precision-livestock-farming]], [[satelity-zemedelstvi]], [[gps-rtk]], [[variable-rate]], [[isobus]], [[yield-monitor]].",
    "alias": [
      "Internet of Things",
      "agro-IoT",
      "smart farming sensors",
      "agricultural IoT"
    ],
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
    "term": "Carbon credits (kredyty węglowe)",
    "kategorie": "precise-farming",
    "shortDef": "Carbon credit = certyfikat potwierdzający 1 tonę ekwiwalentu CO₂ sekwestrowaną lub nieuwalnilaną do atmosfery. Rolnik produkuje kredyty dzięki no-till, roślinom okrywowym, biochar i sprzedaje je korporacjom na realizację celów klimatycznych. UE odnawia ramy regulacyjne (CRCF 2024).",
    "longDef": "Carbon credits (kredyty węglowe) to **certyfikaty potwierdzające 1 tonę ekwiwalentu CO₂** (1 t CO₂e) sekwestrowaną (zmagazynowaną) lub emisję nieuwalnialaną do atmosfery. Kluczowy **instrument finansowy polityki klimatycznej** — łączy walkę ze zmianą klimatu z bodźcami ekonomicznymi.\n\n**Zasada:**\n\n1. **Rolnik** wdraża praktyki zmniejszające emisje lub sekwestrujące C:\n   - **No-till** (zob. [[no-till]]) — brak utleniania węgla glebowego\n   - **Rośliny okrywowe** (zob. [[mezi-plodiny]]) — C w glebie\n   - **Nawozy organiczne** zamiast mineralnych — mniej emisji N₂O\n   - **Biochar** (zob. [[biouhel]]) — stabilny C przez 500+ lat\n   - **Konwersja TTP** (zob. [[ttp]]) — łąki magazynują 2–4× więcej C niż grunty orne\n   - **Agroleśnictwo** (zob. [[agrolesnictvi]]) — drzewa + rolnictwo\n\n2. **Organizacja certyfikująca** weryfikuje sekwestrację:\n   - Próbki gleby (przed + po)\n   - Modele (LCA, IPCC)\n   - Dane satelitarne (zob. [[satelity-zemedelstvi]])\n\n3. **Wydanie kredytów węglowych**: 1 kredyt = 1 t CO₂e\n\n4. **Sprzedaż kredytów**:\n   - **Rynek dobrowolny**: korporacje kupują dla ESG, celów klimatycznych\n   - **Rynek obowiązkowy (compliance)**: EU ETS, kalifornskie CCA (rolnictwo na razie poza)\n\n5. **Korporacja** używa kredytów do neutralności klimatycznej\n\n**Cena kredytu węglowego:**\n\n**Rynek dobrowolny (2024):**\n- **Wysoka jakość (additionality verified)**: 15–25 EUR/t CO₂\n- **Standardowa jakość**: 5–15 EUR/t CO₂\n- **Niskiej jakości** (kontrowersyjne): 1–5 EUR/t CO₂\n\n**Rynek obowiązkowy (EU ETS, 2024):**\n- **EU Allowance (EUA)**: 60–90 EUR/t CO₂\n- Rolnictwo na razie **POZA ETS** (UE planuje włączenie ~2030)\n\n**Standardy certyfikacji:**\n\n**1. Verra VCS (Verified Carbon Standard):**\n- **Globalny #1**, ~75 % rynku dobrowolnego\n- Droga certyfikacja, ale uznawana\n- Własne podstandardy: VM0042 (improved agricultural management), VM0017 (no-till)\n\n**2. Gold Standard:**\n- Nacisk na **wpływ społeczny** + klimatyczny\n- Wyższa cena kredytów\n\n**3. American Carbon Registry (ACR):**\n- USA, projekty krajobrazowe\n\n**4. Climate Action Reserve (CAR):**\n- USA, specyficzne dla rolnictwa\n\n**5. CDM** (Clean Development Mechanism):\n- Zarządzany przez ONZ, post-Protokół z Kioto\n- Malejący rynek (Porozumienie Paryskie zastąpiło)\n\n**Platformy specyficzne dla UE:**\n\n**Climate Farmers (Niemcy):**\n- Agroleśnictwo UE, płatności per t CO₂e\n- ~20 EUR/t\n\n**Soil Capital (Belgia):**\n- Belgijsko-francuska, fokus na regenerative ag\n- Roczne płatności per ha według wdrożenia\n\n**Indigo Ag (USA + UE):**\n- Duża platforma agtech\n- Program węglowy + usługi agronomiczne\n\n**eAgronom (Estonia):**\n- Oprogramowanie estońskie dla ferm CZ + UE\n- Serwis certyfikacji kredytów węglowych\n\n**EU CRCF (Carbon Removals Certification Framework):**\n\n**Rozporządzenie 2024** — nowe ramy prawne UE dla kredytów węglowych:\n- **Standaryzacja** obliczeń\n- **Wymogi permanencji** (kredyt węglowy musi „przetrwać\" 100+ lat dla sekwestracji)\n- **Additionality** — kredyt tylko jeśli ferma by sekwestracji NIE robiła bez niego\n- **MRV** (Monitoring, Reporting, Verification) — regularna weryfikacja\n\n**Cel**: podniesienie jakości kredytów, unikanie greenwashingu\n\n**Przykład ekonomiki dla fermy CZ (500 ha):**\n\n**Wdrożenie**:\n- Przejście z orki na no-till + rośliny okrywowe na całych 500 ha\n- Inwestycja w technikę (maszyna strip-till): 1,5 mln Kč\n- Roczne wyższe koszty (materiał siewny roślin okrywowych, oprysk): +100 000 Kč/rok\n\n**Sekwestracja** (typowo):\n- 0,5 t C/ha/rok = 1,83 t CO₂e/ha/rok\n- 500 ha × 1,83 = **916 t CO₂e/rok**\n\n**Przychód z kredytów**:\n- 916 t × 20 EUR/t = **18 320 EUR/rok = ~460 000 Kč/rok**\n\n**Plus korzyści**:\n- Redukcja kosztów paliwa (mniej orki): 200 000 Kč/rok\n- Redukcja kosztów nawozów (lepsza gleba): 100 000 Kč/rok\n\n**Net benefit**: ~660 000 Kč/rok (po odliczeniu wyższych kosztów)\n**Zwrot z techniki**: 2–3 lata\n\n**Problemy i krytyka:**\n\n**1. Additionality (dodatkowość):**\n- Kredyt jest ważny tylko jeśli ferma by sekwestracji NIE robiła bez niego\n- Sporne — duże fermy i tak przechodziły na regen ag bez kredytów\n- Ryzyko **greenwashingu**\n\n**2. Permanencja (trwałość):**\n- Jeśli ferma za 10 lat znów zaorze → węgiel wraca do atmosfery\n- Kredyt powinien być cofnięty\n- Wymaga długoterminowych zobowiązań umownych\n\n**3. Weryfikacja:**\n- Pomiar C w glebie jest drogi, często nieprecyzyjny\n- Modele vs rzeczywiste pomiary\n- Ryzyko **over-crediting**\n\n**4. Leakage:**\n- Jeśli ferma A sekwestruje, ale ferma B obok zastępuje ją intensywniejszą praktyką → wypadkowy wpływ = 0\n- Globalny problem leakage\n\n**5. Kwestia równości:**\n- Duże korporacyjne fermy mają lepszy dostęp do certyfikacji niż małe rodzinne\n- Ryzyko **carbon colonialism**\n\n**6. Zmienność cen:**\n- Rynek dobrowolny: cena waha się 10× w ciągu 5 lat\n- Ryzyko dla rolników planujących długoterminowo\n\n**Renesans carbon farming:**\n\n**Powody wzrostu rynku:**\n1. **Porozumienie Paryskie** — globalne cele klimatyczne\n2. **EU CRCF** — jasność regulacyjna\n3. **Raportowanie ESG** — obowiązek raportowania przez korporacje\n4. **Zobowiązania Net Zero** — Microsoft, Apple, Google, Amazon kupują kredyty\n5. **Podatek graniczny od węgla** (CBAM) — UE będzie penalizować import z wysokim CO₂\n\n**Prognoza rynku:**\n- **2024**: 2–3 mld USD dobrowolny rynek węglowy\n- **2030**: 50–100 mld USD (prognozy McKinsey, BCG)\n- **Rolnictwo** = 20–30 % oczekiwanego rynku\n\n**Jak zacząć na farmie CZ:**\n\n1. **Ustalić baseline**: obecny stan materii organicznej, C glebowy\n2. **Zaplanować zmiany**: no-till, rośliny okrywowe, redukcja nawozów N\n3. **Znaleźć platformę**: Climate Farmers, eAgronom, Soil Capital\n4. **Umówić weryfikację**: próbki glebowe, monitoring satelitarny\n5. **Wdrożyć 1+ rok**, następnie wnioskować o kredyty\n6. **Sprzedać kredyty** przez platformę\n\n**Koszty przystąpienia**:\n- Próbki glebowe: 5 000–15 000 Kč/ferma\n- Konsultacje: 20 000–50 000 Kč\n- Opłata za oprogramowanie/platformę: 10–20 % z kredytów\n\n**Net przychód**: typowo 60–80 % z brutto kredytów\n\nZob. też [[karbonove-zemedelstvi]], [[regenerativni-zemedelstvi]], [[no-till]], [[mezi-plodiny]], [[biouhel]], [[ttp]], [[agrolesnictvi]], [[satelity-zemedelstvi]].",
    "alias": [
      "kredyty węglowe",
      "carbon credit",
      "C credits",
      "carbon farming credits"
    ],
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
    "term": "Matka (pszczela)",
    "kategorie": "vcelarstvi",
    "shortDef": "Matka to jedyna płciowo rozwinięta samica w rodzinie pszczelej, której główną funkcją jest składanie jaj i utrzymywanie spójności roju za pomocą feromonów.",
    "longDef": "Matka rozwija się z zapłodnionego jaja w mateczniku i przechodzi przez cały rozwój w ciągu około 16 dni (jajo 3 dni, larwa 5,5 dnia, poczwarka 7,5 dnia). Od robotnic różni się wyraźnie wydłużonym odwłokiem, szczątkowymi koszyczkami pyłkowymi i większą masą ciała — waha się w granicach 180–300 mg.\n\nPo locie godowym, podczas którego kojarzy się zazwyczaj z 10–20 trutniami na lotniku, składa nasienie w zbiorniczku nasiennym (spermatheca). Ten zapas nasienia wystarcza jej na 3–5 lat intensywnego składania jaj. Płodna matka składa w sezonie 1 500–2 500 jaj dziennie, wyjątkowo nawet 3 000.\n\nW zdrowej rodzinie pszczelej jest zawsze tylko jedna matka. Kompleks feromonowy produkowany przez matkę (tzw. substancja mateczna, kwas 9-oxo-decenowy) hamuje u robotnic rozwój jajników i inhibuje budowę mateczników. Osłabienie tego sygnału prowadzi do stanu cichej wymiany lub rojenia.\n\nPszczelarz obserwuje wiek i zdolności czerwienia matki. Stare lub wadliwe matki powodują słabnięcie rodziny i zazwyczaj są wymieniane co 2–3 lata. Matkę można zakupić od hodowców w tzw. klatce wysyłkowej.",
    "alias": [
      "królowa",
      "matka pszczela"
    ],
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
    "term": "Robotnica",
    "kategorie": "vcelarstvi",
    "shortDef": "Robotnice to płciowo nierozwinięte samice stanowiące zdecydowaną większość rodziny pszczelej, które wykonują całą pracę w ulu i na pożytku.",
    "longDef": "Robotnica rozwija się z zapłodnionego jajeczka przez około 21 dni (jajeczko 3 dni, larwa 6 dni, poczwarka 12 dni). Masa dorosłej robotnicy wynosi około 90–120 mg. W sezonie rodzina pszczela liczy 40 000–80 000 robotnic, zimą ich liczba spada do 10 000–20 000.\n\nDługość życia letniej robotnicy wynosi 4–6 tygodni, zimowa robotnica żyje 4–6 miesięcy. Zadania zmieniają się z wiekiem — młode robotnice (1–10 dni) pielęgnują czerw i karmią matkę, w średnim wieku (10–20 dni) zajmują się odbieraniem nektaru, budową plastrów i służbą wartowniczą, starsze robotnice (od 21. dnia) latają i zbierają nektar, pyłek, żywicę i wodę.\n\nRobotnice posiadają wyspecjalizowane narządy: koszyczki na tylnych nogach do transportu pyłku, gruczoły woskowe na odwłoku do produkcji wosku oraz zbiornik jadu z żądłem (zębate żądło, które po użądleniu ssaków pozostaje w skórze). W odróżnieniu od matki mają w pełni rozwinięty gruczołowy układ czaszkowo-gardłowy do produkcji mleczka pszczelego.\n\nRobotnice bez matki mogą po 3–4 tygodniach zacząć składać niezapłodnione jajeczka — powstają wówczas tak zwane trutówki lub rodzina policyjna (stracona rodzina).",
    "alias": [
      "pszczoła robotnica"
    ],
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
    "term": "Truteń",
    "kategorie": "vcelarstvi",
    "shortDef": "Truteń to samiec pszczoły miodnej, którego jedyną biologiczną funkcją jest zapłodnienie matki podczas lotu godowego.",
    "longDef": "Truteń rozwija się z niezapłodnionego jajeczka drogą partenogenezy przez około 24 dni. Masa dorosłego trutnia wynosi 200–250 mg. Trutnie nie mają żądła ani koszyczków na pyłek — nie mogą samodzielnie zdobywać pożywienia i są całkowicie zależne od zapasów rodziny pszczelej.\n\nW sezonie (kwiecień–sierpień) rodzina pszczela liczy 200–1 500 trutni. Opuszczają ul w ciepłe, słoneczne dni i latają na miejsca zgromadzeń trutni (tak zwane kongregacje trutni), gdzie oczekują na matkę. Truteń, który skopuluje z matką, ginie bezpośrednio po kopulacji.\n\nPod koniec sezonu, zazwyczaj w sierpniu i wrześniu, robotnice przeganiają trutnie z ula (tak zwany wylot trutni) — zmniejszają w ten sposób zużycie zapasów na zimę. Obecność trutni poza normalnym sezonem (poza sezonem lub w nadmiernej liczbie) może sygnalizować utratę matki lub stan bezmateczności.\n\nW praktyce hodowlanej śledzi się cechy trutni z linii selekcyjnych — trutnie przekazują materiał genetyczny, przy czym na trasie godowej jest to całkowicie niekontrolowane (otwarte miejsce kojarzeń). Dlatego kontrolowane unasienienie na izolowanym stanowisku (nucet) jest kluczowym narzędziem selekcji.",
    "alias": [
      "trutnie"
    ],
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
    "term": "Rodzina pszczela",
    "kategorie": "vcelarstvi",
    "shortDef": "Rodzina pszczela to jednostka biologiczna złożona z matki, robotnic i trutni, funkcjonująca jako superorganizm ze wspólnym oddychaniem, termoregulacją i zbiorową obroną.",
    "longDef": "Rodzina pszczela składa się z jednej matki, sezonowo 40 000–80 000 robotnic i kilkuset do tysiąca trutni. Jako całość utrzymuje temperaturę wewnętrzną gniazda czerwiowego na poziomie 34–35 °C niezależnie od warunków zewnętrznych — robotnice generują ciepło poprzez skurcze mięśni, latem zaś chłodzą gniazdo przez odparowanie wody. Termoregulacja ta jest kluczowa dla prawidłowego rozwoju czerwiu.\n\nKomunikacja wewnątrz rodziny przebiega przez sygnały feromonowe (substancja mateczna, feromon stopny, feromon alarmowy — kwas izoamylowy podczas obrony) oraz sygnały ruchowe — taniec. Utrata matki prowadzi do niedoboru feromonowego, który robotnice wykrywają w ciągu kilku godzin i zaczynają budować ratunkowe mateczniki.\n\nStan zdrowotny rodziny to podstawowy wskaźnik dla pszczelarza. Obserwuje się ilość i charakter czerwiu (zasklepiony vs. otwarty, rozmieszczenie), zachowanie na wylotniku, ilość zimowych zapasów oraz obecność pasożytów (zwłaszcza roztoczy Varroa destructor). Przegląd ula przeprowadza się zazwyczaj raz na 7–10 dni w sezonie.\n\nSilna rodzina licząca 60 000–80 000 robotnic to warunek ekonomicznie opłacalnego zbioru miodu. Według danych Czeskiego Związku Hodowców Zwierząt Gospodarskich (ČSCHZ) średni zbiór miodu w Czechach wyniósł w 2023 roku około 19 kg na jedną rodzinę pszczelą.",
    "alias": [
      "rój",
      "społeczność pszczela"
    ],
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
    "term": "Plaster",
    "kategorie": "vcelarstvi",
    "shortDef": "Plaster to układ sześciobocznych woskowych komórek budowanych przez pszczoły jako magazyn miodu, pyłku oraz jako wylęgarnia czerwiu.",
    "longDef": "Plaster budują robotnice wydzielając płatki woskowe z czterech par gruczołów woskowych na spodniej stronie odwłoka. Jedna robotnica produkuje przez całe życie 1–2 g wosku; zbudowanie 1 kg plastra wymaga zużycia około 6–8 kg miodu. Budowa plastrów przebiega intensywnie przy dostatku nektaru i ciepłej pogodzie.\n\nSześcioboczne komórki mają geometrycznie optymalny kształt — maksymalizują objętość przy minimalnym zużyciu materiału. Średnica komórek robotniczych wynosi około 5,2–5,4 mm, komórek trutowych 6,2–6,9 mm. Orientacja plastrów w nowoczesnym ulu ramkowym to pionowe ramki (orientacja Langstrotha) lub poziomy pas (Dadant).\n\nW gnieździe czerwiowym komórki służą do składania jajeczek i wychowu larw. W miodnicy komórki wypełnione są dojrzałym miodem i zasklepione woskowymi wieczkami. Pyłek (tak zwany chleb pszczeli) przechowywany jest w komórkach sąsiadujących z gniazdem czerwiowym i ubijany warstwami różnokolorowego pyłku.\n\nStary plaster (ciemny, wysycony resztkami linienia larw) pogarsza warunki zdrowotne i zwiększa ryzyko chorób. Pszczelarze przeprowadzają dlatego coroczną lub dwuletnią wymianę części plastrów, zwłaszcza w gnieździe czerwiowym. Wycofane plastry są przetapiane, a wosk sprzedawany lub zwracany do produkcji węzy.",
    "alias": [
      "plastr",
      "plaster pszczeli"
    ],
    "related": [
      "vcelivosk",
      "vceli-plod",
      "mezistena-pojem",
      "vcelarsky-ramek"
    ]
  },
  {
    "slug": "vceli-dilo",
    "term": "Plastry w ulu",
    "kategorie": "vcelarstvi",
    "shortDef": "Plastry w ulu to ogół wszystkich plastrów w ulu, tworzących przestrzeń życiową rodziny pszczelej — obejmuje zarówno strefy czerwiowe, jak i miodowe.",
    "longDef": "Pojęciem „plastry w ulu\" określa się sumę wszystkich plastrów (zarówno czerwiowych, jak i miodowych) umieszczonych na ramkach w nadstawce lub korpusie gniezdnym ula. Jakość zabudowy jest jednym z głównych wskaźników stanu rodziny pszczelej podczas wiosennego przeglądu.\n\nZdrowa zabudowa jest zwarta, strefa czerwiowa skupiona (tak zwane zamknięte gniazdo czerwiowe), miód i pyłek równomiernie rozmieszczone na obrzeżach i w górnej części plastra. Przerywany lub rozproszony czerw sygnalizuje chorobę (zgnilec, gnilec), problemy z matką lub niekorzystne warunki zewnętrzne.\n\nStare czarne plastry w gnieździe czerwiowym wymienia się co 1–2 lata; plastry w miodnicy utrzymuje się dłużej, gdyż nie zawierają linienia larw. Regularna wymiana zabudowy zmniejsza obciążenie chemiczne (pozostałości akarycydów akumulują się w wosku) i poprawia higienę gniazda.\n\nPszczelarz odnotowuje liczbę obsadzonych plastrów jako wskaźnik siły rodziny — silna zimująca rodzina obsadza 8–10 ramek w ulu Langstrotha. Pojęcie „plaster chleba\" oznacza plaster wypełniony pyłkiem (zapasy białkowe na wiosenny rozwój).",
    "alias": [
      "zabudowa",
      "plastry"
    ],
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
    "term": "Ramka pszczelarska",
    "kategorie": "vcelarstvi",
    "shortDef": "Ramka pszczelarska to drewniany lub plastikowy element nośny, na którym pszczoły budują plaster — jej wymiary określają typ ula i umożliwiają wymianę plastrów bez uszkodzenia zabudowy.",
    "longDef": "Ramka składa się z górnej i dolnej listwy oraz dwóch listew bocznych. Znormalizowane wymiary zapewniają wzajemną zamienność między ulami tego samego systemu. Najpopularniejsze wymiary w Czechach i Słowacji to ramka Langstrotha (448 × 232 mm) i ramka czesko-słowacka (39 × 24 cm), a także Dadant, Zander lub ramki do miodnicowych nadstawek (ramka miodnicowa ma około połowy wysokości gniezdnej).\n\nNowa ramka wyposażona jest w drut (3–4 rzędy drutu stalowego lub nierdzewnego), do którego mocuje się węzę — woskową podstawę do budowy plastra. Alternatywnie stosuje się ramki z plastikową podstawą.\n\nMiędzy sąsiednimi ramkami zachowuje się tak zwana przestrzeń pszczela (bee space) wynosząca 6–9 mm — ten wymiar opisał jako kluczowy amerykański pszczelarz Lorenzo Langstroth w 1851 roku. Mniejsza szczelina zostałaby wypełniona propolisem, większa — dziką zabudową.\n\nPrawidłowa manipulacja ramkami (unoszenie za listwy boczne, nie za samą górną listwę) zapobiega rozerwaniu plastrów. Na rynku dostępne są ramki gotowe lub w zestawach do samodzielnego montażu.",
    "alias": [
      "ramka",
      "ramka ulowa"
    ],
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
    "term": "Nadstawka",
    "kategorie": "vcelarstvi",
    "shortDef": "Nadstawka to oddzielna część ula nadstawkowego (zazwyczaj miodnica), dodawana na korpus gniezdny, aby zapewnić pszczołom przestrzeń do składowania miodu.",
    "longDef": "System nadstawkowy (najczęściej Langstroth, Dadant lub Zander) umożliwia łatwe powiększanie objętości ula przez dodawanie znormalizowanych skrzynek — nadstawek. Gniazdo (dolna nadstawka) służy do wychowu czerwiu i zimowania, miodnica (górna nadstawka) przeznaczona jest do składowania zapasów miodowych. Obie części oddzielone są kratką odgrodową, która uniemożliwia matce składanie jajeczek w miodnicy.\n\nKażda nadstawka mieści 8 lub 10 standardowych ramek. W sezonie przy dobrym pożytku rodzinę można rozszerzać przez dodawanie kolejnych nadstawek miodnicowych — tak zwany system szufladkowy. Zbyt wczesne dodanie miodnicy spowalnia rozwój czerwiu; zbyt późne wywołuje nadmierne rojenie z powodu braku przestrzeni.\n\nNa zimowanie nadstawki miodnicowe są zdejmowane; zimująca rodzina skupia się na 1–2 korpusach gniezdnych z wystarczającymi zimowymi zapasami (12–15 kg syropu cukrowego lub miodu).\n\nNadstawki produkowane są z drewna (świerk, topola) lub ze styropianu. Ule styropianowe mają lepszą izolację termiczną, są lżejsze, ale mniej odporne mechanicznie.",
    "alias": [
      "ul nadstawkowy",
      "nadstawka miodnicowa"
    ],
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
    "term": "Gniazdo czerwiowe",
    "kategorie": "vcelarstvi",
    "shortDef": "Gniazdo czerwiowe to dolna część ula, w której matka składa jajeczka, rozwija się czerw i zimuje rodzina pszczela.",
    "longDef": "Gniazdo czerwiowe stanowi biologiczne centrum życia rodziny pszczelej. Matka składa tu jajeczka do woskowych komórek, robotnice pielęgnują larwy i poczwarki oraz utrzymują temperaturę gniazda na poziomie 34–35 °C. Prawidłowy kształt gniazda czerwiowego jest kulisty lub elipsoidalny — czerw skupiony jest w środku, zapasy miodu i pyłku otaczają gniazdo z boków i od góry.\n\nW nowoczesnych ulach nadstawkowych gniazdo czerwiowe tworzy zazwyczaj jeden lub dwa korpusy nadstawkowe. W tradycyjnym jednoczęściowym ulu (czesko-słowackim, Simplex) gniazdo i miodnica mieszczą się w jednej przestrzeni, rozdzielenie następuje tylko przez kratę odgrodową.\n\nWielkość gniazda wpływa na siłę rodziny i przezimowanie. Zbyt duże gniazdo prowadzi do marnowania energii na ogrzewanie; zbyt małe ogranicza rozwój i może wywołać rojenie. Dla silnej rodziny zaleca się gniazdo o pojemności 10 ramek gniezdnych Langstrotha.\n\nWiosną gniazdo kontrolowane jest jako pierwsze — po zimie powinno być obsadzone 5–7 plastrami z żywym czerwiem i wystarczającą ilością pyłku. Gniazdo bez czerwiu (poza stanem zimowym lub rojowym) sygnalizuje bezmateczność.",
    "alias": [
      "gniazdo",
      "przestrzeń czerwiowa"
    ],
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
    "term": "Miodnica",
    "kategorie": "vcelarstvi",
    "shortDef": "Miodnica to górna część ula oddzielona kratką odgrodową, w której robotnice składają nadmiarowy miód przeznaczony do zbioru.",
    "longDef": "Miodnicę umieszcza się nad korpusem gniezdnym i oddziela od gniazda kratką odgrodową. Robotnice przechodzą przez nią swobodnie, natomiast matka (ze względu na większą szerokość odwłoka) nie — gwarantuje to, że miodnica zawiera czysty miód bez czerwiu.\n\nPodczas głównego pożytku (zwłaszcza lipowego i rzepakowego) miodnica napełnia się szybko — silna rodzina może zapełnić nadstawkę miodnicową na 10 ramkach w mniej niż 2 tygodnie. Przy bardzo silnym pożytku dodaje się drugą lub trzecią miodnicę (tak zwane uzupełnianie miodnic).\n\nWirowanie miodu z miodnicy odbywa się najczęściej dwa razy w sezonie — po rzepakowym (czerwiec) i po lipowo-letnim pożytku (sierpień). Przed wirowaniem plastry pozbawia się wieczek za pomocą narzędzi do odsklepiania (widełki do odsklepiania, nóż lub para wodna).\n\nMiodnicę zdejmuje się na zimę i przechowuje w suchym miejscu — wilgoć powodowałaby pleśnienie i psucie się pozostałości miodu. Jesienią plastry miodnicowe można tymczasowo zwrócić do oczyszczenia resztek miodu.",
    "alias": [
      "nadstawka miodnicowa"
    ],
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
    "term": "Kratka odgrodowa",
    "kategorie": "vcelarstvi",
    "shortDef": "Kratka odgrodowa to perforowana płytka z otworami (4,1–4,4 mm), przez które przechodzą robotnice, lecz nie matka — zapobiega w ten sposób składaniu przez nią jajeczek w miodnicy.",
    "longDef": "Kratkę odgrodową wkłada się między gniazdo czerwiowe a miodnicę. Otwory wymiarowane są na przekrój robotnicy (ok. 4,5 mm), natomiast matka (ok. 5,5–6 mm szerokości odwłoka) przez nie nie przejdzie. Trutnie zazwyczaj też nie przechodzą lub czynią to z trudnością.\n\nProdukowana jest w wersji metalowej (nierdzewna, ocynkowana blacha) lub plastikowej. Kratki metalowe mają dłuższą żywotność, plastikowe są tańsze. Kluczowym parametrem jest precyzja wymiarów — zbyt duże otwory nie zatrzymają matki, zbyt małe utrudniają przejście robotnic i zmniejszają wydajność miodną.\n\nNiektórzy pszczelarze nie używają kratki odgrodowej (tak zwane metody bezramkowe lub naturalne), gdyż ogranicza ona ruch robotnic i może nieznacznie zmniejszać przynos nektaru. W konwencjonalnej gospodarce pasiecznej kratka jest jednak standardowym wyposażeniem pozwalającym uzyskać czysty miód wolny od czerwiu.\n\nKratkę odgrodową należy regularnie czyścić z propolisu, którym robotnice zapychają otwory.",
    "alias": [
      "krata mateczna",
      "excluder"
    ],
    "related": [
      "nastavek",
      "mednik",
      "plodiste",
      "matka"
    ]
  },
  {
    "slug": "materi-kasicka",
    "term": "Mleczko pszczele",
    "kategorie": "vcelarstvi",
    "shortDef": "Mleczko pszczele to białkowa wydzielina gruczołów żuchwowych i gardzielowych robotnic, którą przez całe życie karmiona jest matka, a larwy robotnic jedynie przez pierwsze trzy dni.",
    "longDef": "Mleczko pszczele to substancja odżywcza o białej do lekko żółtawej barwie z charakterystycznie kwaśnym smakiem. Zawiera około 60–70 % wody, 12–15 % białek (głównie MRJP — major royal jelly proteins, kluczowe białka mleczka pszczelego, wśród których najważniejszy jest MRJP1 zwany royalaktyną), 5–6 % cukrów, 3–6 % lipidów oraz różne witaminy z grupy B.\n\nDecydującą rolę odgrywa mleczko pszczele w determinacji kasty — ta sama informacja genetyczna w zapłodnionym jajeczku prowadzi przy karmieniu wyłącznie mleczkiem do powstania matki, przy karmieniu pyłkiem i miodem do powstania robotnicy. Substancja 10-HDA (kwas trans-2-decenowy) uznawana jest za kluczowy czynnik różnicowania.\n\nProdukcja mleczka pszczelego jest podstawą chowu matek — specjalne miseczki larwalne (tak zwane miseczki, chińskie lub Nicota) przyjmują 1–2-dniowe larwy, które osadzane są w matecznikach, gdzie robotnice odkładają mleczko. Nowoczesna produkcja mleczka pszczelego osiąga 300–500 g z jednej silnej rodziny na sezon (metody intensywne).\n\nNa rynku mleczko pszczele sprzedawane jest jako suplement diety, w kosmetyce i w praktyce aptecznej. Cena świeżego mleczka pszczelego na czeskim rynku waha się w przedziale 3 000–7 000 Kč za kilogram.",
    "alias": [
      "royal jelly",
      "mleczko mateczne"
    ],
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
    "kategorie": "vcelarstvi",
    "shortDef": "Propolis to żywiczna masa, którą pszczoły zbierają z pąków i kory drzew, mieszają z woskiem i enzymami, a następnie wykorzystują do uszczelniania i dezynfekcji ula.",
    "longDef": "Propolis (z gr. pro-polis, „przed miastem\") zbierają robotnice przede wszystkim z żywicznych pąków topoli, brzóz, kasztanowców i drzew iglastych. Koszyczek na tylnej nodze przetransportowuje go do ula, gdzie przejmują go budowlane i przerabiają przez dodanie śliny i enzymów.\n\nSkład propolisu zależy od botanicznego otoczenia pasieki — typowo zawiera 50–55 % żywic i balsamów, 25–35 % wosków, 10 % olejków eterycznych, 5 % pyłku oraz różne związki fenoliczne i flawonoidowe. Zmienność chemiczna jest zatem znaczna.\n\nPszczoły propolisem zalepują szpary w ulu, zmniejszają wylot zimą, mumifikują martwe larwy lub intruzów (myszy), których nie mogą wynieść. Propolis pełni zatem funkcję naturalnej dezynfekcji — ma udowodnione działanie antybakteryjne, przeciwgrzybicze i antywirusowe.\n\nW pszczelarstwie propolis zbiera się za pomocą specjalnych kratek umieszczanych pod dachem ula. Roczny zbiór z jednego ula wynosi 50–150 g. Na rynku znajduje zastosowanie w suplementach diety, nalewkach i kosmetyce; cena surowego propolisu wynosi około 300–600 Kč za 100 g.",
    "alias": [
      "kit pszczeli",
      "klej pszczeli"
    ],
    "related": [
      "vcelstvo",
      "ul-pojem",
      "vceli-dilo"
    ]
  },
  {
    "slug": "vcelivosk",
    "term": "Wosk pszczeli",
    "kategorie": "vcelarstvi",
    "shortDef": "Wosk pszczeli to stały lipidyczny sekret produkowany przez gruczoły woskowe robotnic, z którego pszczoły budują plastry i który w przemyśle wykorzystywany jest w kosmetyce, farmacji oraz do produkcji węzy.",
    "longDef": "Wosk pszczeli wydzielają robotnice w wieku 12–18 dni z czterech par gruczołów woskowych na brzusznej powierzchni odwłoka. Płatki wosku (po 0,8 mg każdy) robotnice przerabiają żuchwami i formują w podstawowy materiał budulcowy plastra.\n\nPod względem chemicznym jest to złożona mieszanina estrów kwasów tłuszczowych i alkoholi długołańcuchowych, węglowodorów, kwasów i alkoholi. Temperatura topnienia waha się między 62–65 °C, temperatura krzepnięcia jest o 1–2 °C niższa. Wosk jest nierozpuszczalny w wodzie, rozpuszczalny w organicznych rozpuszczalnikach (toluen, benzyna).\n\nWydajność wosku ze starych plastrów przy przetapianiu w topielniku słonecznym lub parowym wynosi 60–80 % pierwotnej masy plastra. Z jednego ula można rocznie pozyskać 0,2–1 kg wosku (zależy od wymiany plastrów). Wosk sprzedawany jest do przeróbki na węzę, świece, kosmetyki i preparaty farmaceutyczne.\n\nResztkowe pestycydy i akarycydy (zwłaszcza fluwalinian, kumafos) akumulują się w wosku — to jeden z głównych argumentów za regularną wymianą plastrów. Nowa węza ze starej praktyki może zawierać zanieczyszczony wosk i być źródłem obciążenia chemicznego.",
    "alias": [
      "wosk",
      "beeswax"
    ],
    "related": [
      "plast",
      "mezistena-pojem",
      "delnice",
      "vceli-dilo"
    ]
  },
  {
    "slug": "pyl-rousky",
    "term": "Obnóże pyłkowe",
    "kategorie": "vcelarstvi",
    "shortDef": "Pyłek zbierają robotnice z pylników kwiatowych, mieszają go ze śliną i nektarem, formują w obnóża i transportują w koszyczkach pyłkowych jako główne źródło białka rodziny pszczelej.",
    "longDef": "Zbiór pyłku odbywa się podczas lotu na kwitnące rośliny — robotnica aktywnie zbiera go szczoteczkami na nogach, zwilża nektarem lub miodem i formuje zwarte obnóża w koszyczkach (corbicula) na tylnych nogach. Barwa obnóży zależy od botanicznego pochodzenia — żółta (rzepak), pomarańczowa (mak, lipa), ceglasta (kasztanowce), biała (akacja).\n\nDzienny przynos pyłku do silnej rodziny wynosi 20–50 g; całoroczne zapotrzebowanie jednej rodziny szacuje się na 15–20 kg. Pyłek jest niezastąpionym źródłem białka do wychowu czerwiu i produkcji mleczka pszczelego — niedobór pyłku wiosną lub jesienią osłabia rozwój zimowej generacji robotnic.\n\nPszczelarz może pozyskiwać pyłek za pomocą poławiaczy pyłku umieszczanych na wylotniku. Obnóża przechodzą przez kratkę, która oddziela je od ciała pszczoły. Pyłek suszy się natychmiast w temperaturze do 40 °C i przechowuje w zamkniętych pojemnikach lub mrozi. Sprzedawany jest jako suplement diety (cena 200–600 Kč/100 g).\n\nAnaliza pyłkowa (melisopalinologia) umożliwia określenie geograficznego pochodzenia i botanicznego składu miodu oraz propolisu.",
    "alias": [
      "pyłek",
      "pyłek chleb",
      "chleb pszczeli"
    ],
    "related": [
      "snuska",
      "delnice",
      "plast",
      "vceli-plod"
    ]
  },
  {
    "slug": "snuska",
    "term": "Pożytek",
    "kategorie": "vcelarstvi",
    "shortDef": "Pożytek to okres, kiedy w przyrodzie jest wystarczająca ilość nektaru lub spadzi i pszczoły aktywnie go zbierają i przetwarzają na miód.",
    "longDef": "Termin pożytek oznacza zarówno samo źródło (kwitnącą roślinę lub wydzielinę mszyc), jak i okres intensywnego zbioru. W warunkach Europy Środkowej wyróżnia się pożytek wiosenny (śliwa, jabłoń, rzepak — kwiecień–czerwiec), letni (lipa, koniczyna, malina — czerwiec–lipiec) i jesienny uzupełniający (gryka, słonecznik, wrzos — sierpień–wrzesień).\n\nIntensywność pożytku mierzy kontrolny ul wagowy — precyzja wag przemysłowych (100 g lub mniej) pozwala rejestrować dzienny przyrost masy. Wartości powyżej 2 kg/dzień sygnalizują silny pożytek, powyżej 5 kg/dzień — wyjątkowy. Pożytek rzepakowy może w optymalnych warunkach (duże pole rzepaku, ciepłe słoneczne dni) przynieść 30–60 kg miodu na jedną silną rodzinę.\n\nPożytek spadziowy (z wydzielin mszyc lub czerwców na drzewach liściastych lub iglastych) charakterystyczny jest dla obszarów górskich, Szumawy, Jesioników i podgórskiej części Moraw. Miód spadziowy ma ciemniejszą barwę, mocniejszy smak i niższą zawartość sacharozy niż miód kwiatowy.\n\nPrawidłowe wyczucie czasu przy wędrówce do źródeł pożytku jest podstawą rentownego pszczelarstwa. Przy pożytku rzepakowym ule należy przywieźć 2–3 dni przed pełnym kwitnieniem.",
    "alias": [
      "pożytek miodowy",
      "główny pożytek",
      "pożytek boczny"
    ],
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
    "term": "Spadź",
    "kategorie": "vcelarstvi",
    "shortDef": "Spadź to słodka wydzielina mszyc, czerwców lub innych fitofagicznych owadów ssących floem drzew, którą robotnice zbierają jako alternatywne źródło cukrów obok nektaru.",
    "longDef": "Spadź powstaje w ten sposób, że ssący owad (mszyce, czerwce, miodówki, nicienie) przetwarza sok floemu bogatego w sacharozę — nadmiar cukrów wydala w postaci kropelek wydzieliny. Robotnice zbierają go z powierzchni liści lub bezpośrednio od owadów, transportują do ula i przetwarzają podobnie jak nektar.\n\nBotaniczne źródła spadzi w Czechach stanowią przede wszystkim spadź jodłowa (Abies alba, Picea abies — produkowana przez miodówki Cinara i Sacchiphantes), spadź dębowa i lipowa. Miód spadziowy jest ciemny (barwa od brunatno-żółtawej do niemal czarnej), o charakterystycznie żywicznym lub karmelowym smaku, z niższą zawartością sacharozy i wyższą zawartością oligosacharydów oraz składników mineralnych.\n\nRyzyko dla zimowania: miód spadziowy zawiera więcej dekstryn (niestrawnych polisacharydów), które powodują biegunkę u pszczół (tak zwana nosemoza z biegunką) przy spożyciu zimą. Pszczelarze zalecają dlatego odbiór miodu spadziowego z miodnic w sierpniu i zastąpienie zapasów syropem cukrowym.\n\nMiód spadziowy sprzedawany jest drogo — na czeskim rynku 200–500 Kč/kg — i uważany jest za gastronomicznie cenniejszy produkt dzięki swoistemu smakowi.",
    "alias": [
      "miód leśny",
      "pożytek spadziowy"
    ],
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
    "kategorie": "vcelarstvi",
    "shortDef": "Nektar to cukrowy roztwór wydzielany przez nektarniki kwitnących roślin, będący podstawowym surowcem do produkcji miodu kwiatowego.",
    "longDef": "Nektar produkują nektarniki — wyspecjalizowane tkanki (gruczoły) umieszczone u nasady płatków korony lub w miejscach pozakwiatowych (ogonki liściowe, przylistki). Jego skład jest zmienny: 5–80 % cukrów (sacharoza, fruktoza, glukoza), woda, aminokwasy, enzymy i substancje aromatyczne.\n\nRobotnice zbierają nektar wówkiem miodowym (wole) — po powrocie do ula przekazują go robotnicom odbierającym, które wielokrotnie go przelewają i dodają enzymy (inwertaza, oksydaza glukozowa). Woda odparowuje podczas wentylacji — ze świeżego nektaru (zawiera 20–80 % wody) powstaje dojrzały miód (do 17–18 % wody), dopiero wówczas robotnice zasklepiają komórki.\n\nWydajność produkcji nektarowej zależy od gatunku rośliny, pogody i wilgotności gleby. Rzepak ozimy jest jedną z najważniejszych roślin nektarowych w Czechach — w sprzyjających warunkach produkuje do 100–150 kg nektaru na hektar. Znaczące rośliny nektarowe to ponadto lipa (Tilia sp.), akacja (Robinia pseudoacacia), koniczyna (Trifolium sp.) i facelia błękitna (Phacelia tanacetifolia).\n\nPożytek nektarowy różni się od spadziowego tym, że nektar pochodzi bezpośrednio z roślin, a nie z wydzielin owadów — wynikowy miód ma odmienne właściwości fizyczne i sensoryczne.",
    "alias": [
      "pożytek nektarowy"
    ],
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
    "kategorie": "vcelarstvi",
    "shortDef": "Rojenie to naturalny sposób rozmnażania się rodziny pszczelej, podczas którego stara matka z częścią robotnic opuszcza macierzysty ul i zakłada nowe gniazdo.",
    "longDef": "Rojenie to ewolucyjnie zakodowana strategia rozprzestrzeniania rodziny pszczelej. Mechanizmem wyzwalającym jest kombinacja przeludnionego ula, słabej substancji matecznej (malejąca produkcja starej matki), gromadzenia trutni i sprzyjającej pogody (koniec maja – czerwiec). Robotnice zaczynają budować mateczniki — to pierwszy sygnał dla pszczelarza.\n\nRój pierwotny (przyrój) opuszcza ul w godzinach południowych w ciepły i słoneczny dzień, zazwyczaj w dniu, gdy pierwszy matecznik zbliża się do zasklepienia. Z osiadłą matką odlatuje 30–50 % robotnic. Rój skupia się na gałęzi lub innej podporze w promieniu do 300 m od macierzystego ula, gdzie czeka 1–3 dni, aż pszczoły zwiadowcze znajdą nowe gniazdo.\n\nPszczelarz może rój zebrać (wstrząsnąć) do pustego ula lub specjalnej skrzynki rojowej i w ten sposób pozyskać nową rodzinę. Jeżeli rój odleci, macierzysty ul kontynuuje życie z zapasem mateczników — pierwsza wylęgła się matka likwiduje pozostałe mateczniki (walka o tron). Po locie godowym i unasienieniu wznawia czerwienie.\n\nKontrola rojenia to jedno z głównych zadań roboczych w sezonie. Profilaktyczne działania obejmują wymianę matek, dodawanie miodnic, usuwanie mateczników lub sztuczne rojenie (tworzenie odkładów).",
    "alias": [
      "rój",
      "naturalne rojenie"
    ],
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
    "term": "Rój",
    "kategorie": "vcelarstvi",
    "shortDef": "Rój to grupa pszczół (matka + robotnice) oddzielona od macierzystej rodziny pszczelej podczas naturalnego rojenia, poszukująca nowego miejsca na gniazdo.",
    "longDef": "Rój opuszczający ul tworzą matka i około 30–50 % robotnic macierzystej rodziny — w liczbie 10 000–30 000 sztuk. Przed odlotem robotnice pobierają miód do wola jako zapas. Rój zazwyczaj zatrzymuje się tymczasowo (tak zwane zgromadzenie rojowe) w pobliskim miejscu przez 30 minut do kilku godzin, następnie odlatuje za nowym gniazdem znalezionym przez zwiadowczynie.\n\nZłapanie roju pszczelarz wykonuje przez wstrząśnięcie do pustego ula lub do specjalnego kosza rojowego. Niezbędne jest złapanie matki — bez niej rój opuści nowe miejsce. Do łapania rojów w koronach drzew lub na wysokości używa się specjalnych klap łownych lub skrzynek rojowych.\n\nPrzyrój ma swoje zalety — młody rój jest zazwyczaj zdrowy i pełen energii (robotnice w wieku intensywnej produkcji wosku i budowy plastrów), szybko buduje nową zabudowę. Wadą jest niższy zbiór w pierwszym roku i konieczność dokarmiania.\n\nW naturze (dziupla drzewa, szczelina pod dachem) roje zakładają wolne gniazda — tak zwane dzikie znaleziska są w ČR elementem ochrony bioróżnorodności, lecz praktyczna gospodarka z nimi jest problematyczna.",
    "alias": [
      "naturalny rój",
      "przyrój"
    ],
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
    "term": "Odkład",
    "kategorie": "vcelarstvi",
    "shortDef": "Odkład to mała sztuczna rodzina pszczela tworzona przez pszczelarza z części robotnic, plastrów i młodej lub zasklepionej matki, służąca do reprodukcji lub powiększenia pasieki bez naturalnego rojenia.",
    "longDef": "Odkład (nucleus) jest jedną z metod kontrolowanego mnożenia rodzin pszczelich bez naturalnego rojenia. Tworzą go zazwyczaj 3–6 ramek (czerw, zapasy, robotnice) pobrane z jednej lub więcej silnych rodzin, do których dodaje się zasklepiony matecznik (z celowego chowu lub ratunkowy), kupioną matkę lub wolną niezaplodnioną matkę.\n\nOdkład umieszcza się na nowym stanowisku lub w odległym miejscu, aby latające robotnice nie mogły powrócić. Odkład bez matki (tak zwany sierocy) przyjmie dostarczoną matkę lub sam zbuduje ratunkowe mateczniki z rezerwy czerwiu.\n\nOdkłady są podstawą nowoczesnej selekcji matek — hodowcy matek standardowo pracują z tak zwanymi ulami jądrowymi (nucleus), do których osadza się zapłodnione matki z hodowli selekcyjnej. W ČR ocena matek prowadzona jest w ramach programu hodowlanego Czeskiego Związku Hodowców Pszczoły Miodnej (ČSCHM).\n\nOdkład zazwyczaj w pierwszym roku nie przynosi ekonomicznego zbioru — służy jako nowy zasób na kolejny sezon. W przypadku straty silnej rodziny odkład może służyć do nagłego wzmocnienia lub połączenia.",
    "alias": [
      "rodzina odkładowa",
      "nucleus"
    ],
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
    "term": "Matecznik",
    "kategorie": "vcelarstvi",
    "shortDef": "Matecznik to powiększona woskowa komórka, w której rozwija się larwa przyszłej matki, karmiona wyłącznie mleczkiem pszczelim.",
    "longDef": "Matecznik ma kształt żołędzia i pionową orientację, w odróżnieniu od poziomo zorientowanych komórek robotnic i trutni. Długość matecznika wynosi 20–25 mm. Budowany jest z wosku, przy czym dno formowane jest w miseczkę jeszcze przed umieszczeniem jajeczka.\n\nWyróżnia się trzy rodzaje: mateczniki rojowe (na krawędziach plastrów, sygnalizujące przygotowania do rojenia), mateczniki ratunkowe (budowane awaryjnie z larw robotniczych do 3 dni po utracie matki) oraz mateczniki cichej wymiany (budowane dyskretnie obok macierzystego gniazda przy stopniowej wymianie starzejącej się matki).\n\nMateczniki ratunkowe są mniej niezawodne niż planowane rojowe lub hodowlane — larwa przechodzi na wyłączne karmienie mleczkiem z opóźnieniem (ponad 24 h), wynikowa matka bywa mniej wartościowa. Dlatego doświadczony hodowca matek używa specjalnych miseczek hodowlanych lub larvowników.\n\nZ matecznika wychodzi matka około 16. dnia od złożenia jajeczka. Przez pierwsze dni po wylęgu pozostaje w ulu i przechodzi dojrzewanie młodociane. Lot godowy podejmuje za 7–10 dni przy sprzyjających warunkach.",
    "alias": [
      "komórka mateczna"
    ],
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
    "term": "Zasklepianie",
    "kategorie": "vcelarstvi",
    "shortDef": "Zasklepianie to pokrywanie zawartości komórek woskowym wieczkiem — u czerwiu zamyka poczwarkę, u miodu sygnalizuje jego dojrzałość (zawartość wody poniżej 18 %).",
    "longDef": "Zasklepianie czerwiu następuje około 6. dnia po złożeniu jajeczka (po 3 dniach w jajeczku i 3 dniach larwy). Robotnice zamykają komórkę płaskim lub lekko wypukłym woskowym wieczkiem; pod nim larwa przędzie kokon i przemienia się w poczwarkę. Barwa zasklepionego czerwiu jest jasnobrązowa (zdrowy) lub ciemnobrązowa (zapadnięty — możliwy objaw choroby).\n\nZasklepianie miodu jest dla pszczelarza sygnałem dojrzałości — pszczoły zasklepiają komórkę dopiero wtedy, gdy zawartość wody obniży się poniżej 17–18 %. Miód z wyższą zawartością wody (z niezasklepionych komórek lub niedojrzały) fermentuje. Obowiązuje zatem zasada: wirować tylko miód z ramek zasklepionych co najmniej w dwóch trzecich powierzchni.\n\nWieczka miodowe mogą być płaskie (suche wieczka) lub wypukłe (mokre wieczka). Suche wieczka cenione są przy sprzedaży plasterkowego miodu jako przysmaku. Odsklepianie (deoperkulacja) wykonuje się widełkami do odsklepiania, nożem lub odsklepiaczem parowym.\n\nBlada lub szara mętność zasklepionego plastra czerwiowego może wskazywać na zgnilec wiosenny (Melissococcus plutonius) lub gnilec wapienny (Ascosphaera apis) — kontrola higieniczna jest tu kluczowa.",
    "alias": [
      "plombowanie",
      "wieczkownie"
    ],
    "related": [
      "vceli-plod",
      "zaviceny-med",
      "medomet-pojem",
      "vytaceni-medu"
    ]
  },
  {
    "slug": "vceli-plod",
    "term": "Czerw pszczeli",
    "kategorie": "vcelarstvi",
    "shortDef": "Czerw pszczeli to zbiorcze określenie jajeczek, larw i poczwarek w stadium rozwojowym wewnątrz komórek plastra.",
    "longDef": "Rozwój czerwiu pszczelego rozpoczyna się złożeniem jajeczka przez matkę na dnie komórki. Jajeczko jest walcowate (1,5 mm), białe, ustawione pionowo. Po 3 dniach z jajeczka wylęga się larwa — mały, zakrzywiony, beznogi czerw. Robotnice karmią ją mleczkiem pszczelim (przez pierwsze 2–3 dni dla robotnicy), następnie mieszaniną pyłku i miodu.\n\nW zdrowym gnieździe czerwiowym czerw jest zwarty — komórki obsadzone regularnie, jajeczka stojące pionowo w środku komórki, larwy perłowobiałe i lśniące. Tak zwany „czerw peprzowy\" (komórki z czerwiem i puste komórki na przemian) jest objawem wirusa zdeformowanych skrzydeł, gnilca wapiennego lub wiosennego albo problemów z matką.\n\nWychów larwalny trwa 6 dni (robotnica), następnie robotnice zasklepiają komórkę. Przepoczwarczenie i metamorfoza trwa 12 dni. Łącznie 21 dni od jajeczka do dorosłej robotnicy. Truteń rozwija się przez 24 dni, matka przez 16 dni.\n\nPlaster czerwiowy jest termicznie stałą strefą — temperatura 34–35 °C utrzymywana jest przez termoregulację robotnic. Odchylenia powodują wady rozwojowe (skrzywione lub brakujące części ciała).",
    "alias": [
      "czerw",
      "plaster z czerwiem"
    ],
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
    "term": "Czerwienie matki",
    "kategorie": "vcelarstvi",
    "shortDef": "Czerwienie matki (owoposycja) to proces, w którym matka umieszcza zapłodnione lub niezapłodnione jajeczka w komórkach plastra — kluczowy wskaźnik dobrostanu rodziny pszczelej.",
    "longDef": "Płodna zapłodniona matka składa w pełnym sezonie (kwiecień–sierpień) 1 500–2 500 jajeczek dziennie. Zapłodnione jajeczka trafiają do komórek robotniczych (5,2–5,4 mm) i dają początek robotnicom; do komórek trutowych (6,2–6,9 mm) matka celowo składa niezapłodnione jajeczka, z których rozwijają się trutnie.\n\nWzorzec czerwienia obserwuje pszczelarz podczas przeglądu: zdrowa matka składa zwarty talerz czerwiu bez luk. Przerywany czerw (brakujące jajeczka w komórkach, „sito\") sygnalizuje chorobę lub matkę z wadliwym nasieniem. Matka z niskim spożyciem pyłku lub starsza matka wcześniej przechodzi na nieregularne czerwienie.\n\nRobotnice przyjmują jajeczko przez krótką inspekcję komórki — komórki jajeczkowe robotnic zawierają zerowy pyłek lub mleczko pszczele przygotowane dla larwy. Matka przyczepia jajeczko do dna komórki wydzielaną lepką substancją.\n\nKontrola czerwienia jest podstawową metodą diagnostyki bezmateczności — samo spojrzenie na plaster (obecność jajeczek widocznych przez lupę lub w słońcu) potwierdza obecność aktywnej matki. Jajeczko jest świeże, starsze larwy i zasklepiony czerw mogą pochodzić od poprzedniej matki.",
    "alias": [
      "złożenie jajeczek",
      "owoposycja"
    ],
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
    "term": "Warroza",
    "kategorie": "vcelarstvi",
    "shortDef": "Warroza to najszerzej rozpowszechniona i ekonomicznie najważniejsza choroba pszczół wywołana przez roztocz Varroa destructor, który osłabia czerw i przenosi choroby wirusowe.",
    "longDef": "Varroa destructor — gatunek wyodrębniony z Varroa jacobsoni w roku 2000; V. jacobsoni atakuje wyłącznie pszczołę wschodnią (Apis cerana) — jest ektoparazytycznym roztoczem pochodzącym z Azji, który rozprzestrzenia się na całym świecie i praktycznie w każdej populacji pszczoły miodnej w Europie. Samica (1,1 × 1,6 mm, czerwonobrązowa, owalna) przyczepia się do poczwarki lub dorosłej pszczoły i wysysa hemolimfę.\n\nRozmnażanie odbywa się w zasklepionym czerwiu — samica wchodzi do komórki przed zasklepieniem, składa 1 samca i 4–5 samic; po zakończeniu rozwoju dorosłe roztocza opuszczają komórkę wraz z nową generacją pszczoły. Czerw trutowy jest preferowanym żywicielem (trutnie rozwijają się dłużej, więc samica zdąży wyprodukować więcej potomstwa).\n\nNieleczona Varroa powoduje zagładę rodziny pszczelej zazwyczaj w ciągu 2–4 lat. Oprócz bezpośredniego wysysania osłabia odporność i jest wektorem wirusów (zwłaszcza wirus zdeformowanych skrzydeł — DWV). Leczenie w ČR jest obowiązkowe — dopuszczone substancje to kwas szczawiowy (Oxuvar, Api-Bioxal), amitraz (Apivar, Apitraz) i fluwalinian (Apistan); stosowanie reguluje Instrukcja Metodyczna SVS i ustawa o produktach leczniczych.\n\nMonitoring przeprowadza się przez naturalny opad na podkładce dennicowej, zimową pracę na 100 pszczołach lub mycie alkoholowe (wash). Próg leczenia wynosi zazwyczaj 3 % roztoczy na robotnicach lub 0,5 roztocza/100 robotnic (zalecenie WHO).",
    "alias": [
      "warrooza",
      "varroa",
      "Varroa destructor"
    ],
    "related": [
      "klestik-vcely",
      "zazimovani",
      "vcelstvo",
      "vceli-plod"
    ]
  },
  {
    "slug": "klestik-vcely",
    "term": "Roztocz Varroa",
    "kategorie": "vcelarstvi",
    "shortDef": "Roztocz Varroa (Varroa destructor) to ektoparazytyczny roztocz wysysający hemolimfę z larw i dorosłych pszczół, którego niekontrolowany wzrost populacji prowadzi do zagłady rodziny pszczelej.",
    "longDef": "Roztocz Varroa zaliczany jest systematycznie do rzędu Acarina (pajęczaki), rodziny Varroidae. Nazwa naukowa Varroa destructor została ustanowiona w roku 2000, kiedy gatunek został wyodrębniony z Varroa jacobsoni — ten atakuje wyłącznie pszczołę wschodnią (Apis cerana) i nie rozmnaża się na pszczole miodnej. Samica jest spłaszczona, brunatnoczerwona, o długości około 1,1 mm i szerokości 1,6 mm. Jest widoczna gołym okiem na ciele pszczoły lub w opadzie na dennicowej podkładce.\n\nCykl życiowy obejmuje fazę foretyczną (roztocza żyją na dorosłych pszczołach) i fazę reprodukcyjną (w zasklepionym czerwiu). Samica wchodzi do komórki 24–48 godzin przed zasklepieniem, składa jedno niezapłodnione jajeczko (samiec) i 4–5 zapłodnionych (samice). Samiec zapładnia córki w komórce jeszcze przed wylęgiem robotnicy.\n\nWirulencja roztocza spowodowana jest kombinacją bezpośredniego uszkodzenia (wysysanie hemolimfy zmniejsza masę nowo wylęgłej pszczoły, uszkadza ciało tłuszczowe) i wektorowego przenoszenia — roztocz jest głównym wektorem wirusa zdeformowanych skrzydeł (DWV), wirusa ostrego paraliżu pszczół (ABPV) i innych wirusów.\n\nChemiczna oporność Varroa destructor na pyretroidy (fluwalinian, flumethrin) opisywana jest w Europie od lat 90. Dlatego zaleca się rotację substancji czynnych i preferencyjne stosowanie kwasów organicznych (kwas szczawiowy) jako pierwszego wyboru zwłaszcza w okresie bezczerwiowym.",
    "alias": [
      "Varroa destructor",
      "varroa",
      "roztocz warrozy"
    ],
    "related": [
      "varroaza",
      "zazimovani",
      "vceli-plod",
      "vcelstvo"
    ]
  },
  {
    "slug": "mor-vceliho-plodu",
    "term": "Zgnilec amerykański",
    "kategorie": "vcelarstvi",
    "shortDef": "Zgnilec amerykański jest najgroźniejszą bakteryjną chorobą czerwiu pszczelego, wywoływaną przez sporulującą bakterię Paenibacillus larvae; w Polsce podlega obowiązkowemu zgłoszeniu.",
    "longDef": "Zgnilec amerykański (ang. American Foulbrood, AFB) jest wywoływany przez bakterię Paenibacillus larvae. Spory są wyjątkowo odporne — przeżywają w suchym środowisku dziesiątki lat, a w miodzie nawet po gotowaniu. Przenoszenie odbywa się przez skażone zapasy, narzędzia, stare plastry lub pszczoły rabusie.\n\nObjawy: zasklepiony czerw zmienia barwę ze światłobrązowej na ciemnobrązową, a wieczka są zapadnięte i perforowane. Roztopiona larwa (tzw. „nić\" — sticky rope test) ciągnie się z komórki po nakłuciu wykałaczką jak lepka nić — jest to podstawowa metoda diagnostyczna. Zapach jest intensywny, słodkawy, a wręcz odrażający.\n\nW Polsce zgnilec amerykański jest chorobą podlegającą obowiązkowi zgłoszenia. Po potwierdzeniu zakażenia przez lekarza weterynarii (badanie laboratoryjne) całą rodzinę pszczelą wraz z wyposażeniem ula spala się, a miejsce dezynfekuje. Leczenie antybiotykami nie jest dozwolone.\n\nDziałania zapobiegawcze: dezynfekcja narzędzi (ług sodowy 4%, płomień), zakup zdrowych matek i odkładów z zaświadczeniem weterynaryjnym, unikanie karmienia obcym miodem.",
    "alias": [
      "zgnilec złośliwy",
      "AFB",
      "Paenibacillus larvae"
    ],
    "related": [
      "hniloba-plodu",
      "vceli-plod",
      "vcelstvo"
    ]
  },
  {
    "slug": "hniloba-plodu",
    "term": "Zgnilec europejski",
    "kategorie": "vcelarstvi",
    "shortDef": "Zgnilec europejski jest bakteryjną chorobą odkrytego czerwiu wywoływaną przez bakterię Melissococcus plutonius; mniej destrukcyjny niż zgnilec amerykański, lecz w warunkach stresowych szybko się szerzy.",
    "longDef": "Zgnilec europejski (European Foulbrood, EFB) jest wywoływany przez Melissococcus plutonius. Bakteria namnaża się w przewodzie pokarmowym larwy i rywalizuje z nią o składniki odżywcze; larwa ginie zazwyczaj przed zasklepieniem. Objawy: larwy zmieniają barwę z perłowobiałej na żółtą, a następnie brązową, przyjmują nieprawidłowe ułożenie w komórce (skręcenie, przyleganie do ścianki), zapach jest mniej intensywny niż przy zgnilcu amerykańskim.\n\nEFB podlega również obowiązkowi zgłoszenia. Po potwierdzeniu zakażenia decyduje się o leczeniu lub likwidacji — zależy to od nasilenia choroby i sytuacji zdrowotnej. W odróżnieniu od AFB, w niektórych krajach UE dopuszczona jest oksytetracyklina, jednak w Polsce stosowanie antybiotyków u pszczół jest zakazane.\n\nCzynniki predysponujące do wybuchu EFB to stres (słaby pożytek, chłód), niedobór pyłku (słaby wiosenny pożytek), osłabiona odporność rodziny lub obecność Varroa. Rodzina może samoistnie wyzdrowieć przy sprzyjających warunkach i bogatym pożytku (robotnice szybko usuwają chory czerw — higiena).\n\nHigiena profilaktyczna: regularna wymiana plastrów, dezynfekcja narzędzi, unikanie przenoszenia plastrów między podejrzanymi rodzinami.",
    "alias": [
      "zgnilec łagodny",
      "EFB",
      "Melissococcus plutonius"
    ],
    "related": [
      "mor-vceliho-plodu",
      "vceli-plod",
      "varroaza"
    ]
  },
  {
    "slug": "nosematoza",
    "term": "Nosemoza",
    "kategorie": "vcelarstvi",
    "shortDef": "Nosemoza jest chorobą mikrosporydialną jelit robotnic wywoływaną przez pasożyta Nosema apis lub Nosema ceranae; objawia się biegunką, osłabieniem i skróceniem życia robotnic.",
    "longDef": "Nosema apis jest oryginalną mikrosporydią jelita dorosłej pszczoły w Europie; Nosema ceranae to inwazyjny gatunek pochodzący z Azji, który obecnie dominuje w Polsce i UE. N. ceranae nie powoduje typowych objawów biegunkowych jak N. apis (widoczna plama odchodów na wylotni i dennicy), lecz wywołuje chroniczne osłabienie i skrócenie życia robotnic.\n\nSpory Nosemy są przyjmowane doustnie (przez skażony pokarm lub wodę). W jelicie kiełkują i atakują komórki nabłonkowe, zmniejszając wchłanianie składników odżywczych. Zainfekowane robotnice słabiej karmią czerw, są mniej sprawne i krócej żyją — negatywna spirala osłabia całą rodzinę.\n\nDiagnostykę przeprowadza się mikroskopowo z homogenatu odwłoków 30–60 robotnic (ocena liczby spor na robotnicę). Leczenie fumagilinem (Fumidil B) jest w UE praktycznie niedostępne (cofnięcie rejestracji). Żadne inne zatwierdzone leczenie nie istnieje — profilaktyka skupia się na higienie, wymianie plastrów, silnym zimowaniu i ograniczonym stosowaniu kwasu fumarowego.\n\nSpaddź pozostawiona jako zimowe zapasy zwiększa ryzyko nosemorzy w zimie (niestrawne dekstryny powodują biegunkę), dlatego zaleca się uzupełnianie zapasów syropem cukrowym.",
    "alias": [
      "nosema",
      "Nosema apis",
      "Nosema ceranae"
    ],
    "related": [
      "vcelstvo",
      "zazimovani",
      "medovice-pojem"
    ]
  },
  {
    "slug": "medomet-pojem",
    "term": "Miodarka",
    "kategorie": "vcelarstvi",
    "shortDef": "Miodarka jest urządzeniem odśrodkowym, w którym odsklepione ramki obracają się, a miód jest siłą odśrodkową wyrzucany ze ścianek komórek.",
    "longDef": "Miodarka działa na zasadzie wirowania — ramki umieszczane są radialnie (czołowa strona ramki prostopadle do osi obrotu) lub tangencjalnie (ramka równolegle do obwodu kosza). Miodarki radialne (częstsze w większych pasiekach) odwirowują obie strony plastra jednocześnie; w tangencjalnych ramkę trzeba odwrócić.\n\nPojemność miodarek jest różna — ręczne (2–6 ramek), elektryczne małe (6–12 ramek), półautomatyczne lub przemysłowe (24–48 ramek). W profesjonalnych pasiekach powyżej 100 rodzin stosuje się przepływowe systemy z automatycznym odsklepianiem, miodarki z falownikiem (regulowane obroty) i filtracją miodu pod kranem spustowym.\n\nMiód zbierający się na ściankach kosza spływa w dół i odpływa przez kranik przez sito do naczynia sedymentacyjnego. Filtracja usuwa resztki wosku i zanieczyszczenia mechaniczne; sedymentacja (12–24 godziny) pozwala bąbelkom powietrza wypłynąć na powierzchnię.\n\nMiodarka ze stali nierdzewnej spełniająca kryteria higieniczne (EN 13440) jest warunkiem certyfikacji miodu w ramach systemów jakości (BIO, regionalne oznaczenia).",
    "alias": [
      "miodarka radialna",
      "miodarka tangencjalna"
    ],
    "related": [
      "vytaceni-medu",
      "zaviceny-med",
      "mednik",
      "pastovani-medu"
    ]
  },
  {
    "slug": "mezistena-pojem",
    "term": "Węza",
    "kategorie": "vcelarstvi",
    "shortDef": "Węza jest cienką woskową płytą z reliefem sześciobocznych komórek, wkładaną do ramki jako podstawa do budowy plastra i wyznaczającą wielkość komórek.",
    "longDef": "Węza wytwarzana jest maszynowo przez wytłaczanie lub walcowanie wosku pszczelego na płyty o grubości 0,8–1,2 mm z reliefem podstaw komórek. Relief wyznacza średnicę komórek — standardowa węza dla czerwiu roboczego ma wzór sześciokątny o średnicy około 5,2–5,4 mm.\n\nWęzę wkłada się do ramki z drutem (3–4 poziome prowadnice), do których przymocowuje się ją przez podgrzewanie lub gorącym transformatorem do wtopiania drutów. Przymocowanie musi być pewne — opadająca lub złożona węza w lecie traci kształt i powoduje budowanie dzikiego plastra.\n\nStosowanie węz ukierunkowuje budowę plastra: pszczoły nie budują zbędnych komórek trutowych (kluczowe dla kontroli Varroa), dzieło jest regularne i łatwiejsze w obsłudze podczas odwirowywania. Węzy z certyfikowanego wosku (bez pozostałości pestycydów) są higienicznym standardem — skażona węza może obciążyć cały plaster.\n\nNa rynku dostępne są też plastikowe węzy z woskową warstwą powierzchniową — są trwalsze, lecz mniej naturalnie przyjmowane przez robotnice niż czysto woskowe.",
    "alias": [
      "woskowa podstawa",
      "foundation"
    ],
    "related": [
      "plast",
      "vcelivosk",
      "vcelarsky-ramek"
    ]
  },
  {
    "slug": "rozperka-pojem",
    "term": "Dystans ramkowy",
    "kategorie": "vcelarstvi",
    "shortDef": "Dystans ramkowy to wkładka dystansowa lub modyfikacja górnej listwy ramki zapewniająca właściwy odstęp (przestrzeń pszczelą 6–9 mm) między sąsiednimi ramkami.",
    "longDef": "Terminem dystans ramkowy określa się różne elementy konstrukcyjne zapewniające zachowanie tzw. bee space (przestrzeni pszczelej) — odstępu 6–9 mm, przy którym pszczoły nie propolisują ramek ani nie budują dzikiego plastra.\n\nNajpowszechniejszym typem są dystanse Hoffmanna (końce bocznych listew ramek są wygięte tak, aby sąsiednie ramki opierały się o siebie). Alternatywą są metalowe przepustki (separatory), plastikowe zaczepy dystansowe lub magnetyczne listwy dystansowe.\n\nNiewłaściwy odstęp ramek prowadzi do problemów: zbyt mały (< 6 mm) powoduje zapropolisowanie i nieprzepuszczalność plastra; zbyt duży (> 9,5 mm) skutkuje budowaniem dzikiego plastra między ramkami, który pszczelarz musi regularnie usuwać i czyścić.\n\nW ulach wielokondygnacyjnych stosuje się zazwyczaj 10 ramek na kondygnację, przy czym przestrzeń przy ściance jest nieco większa (8–10 mm od ściany ula).",
    "alias": [
      "przekładka dystansowa",
      "separator ramkowy"
    ],
    "related": [
      "vcelarsky-ramek",
      "ul-pojem",
      "vceli-dilo"
    ]
  },
  {
    "slug": "dymak",
    "term": "Podkurzacz",
    "kategorie": "vcelarstvi",
    "shortDef": "Podkurzacz jest narzędziem do wytwarzania chłodnego, gęstego dymu, który podczas pracy przy rodzinie pszczelej wprowadza się do wylotni i pod pokrywę ula, aby zmniejszyć agresywność pszczół.",
    "longDef": "Podkurzacz składa się ze zbiornika (kosz ze stali nierdzewnej lub ocynkowanej), mieszka (skórzanego lub syntetycznego) oraz dyszy. Tlenie materiału organicznego (papier, sizal, wióry drewniane, siano, suszone grzyby) wytwarza gęsty, chłodny dym. Temperatura dymu nie powinna przekraczać 50–60 °C — zbyt gorący dym poparzy robotnice i wywoła efekt odwrotny do uspokojenia.\n\nFizjologiczne działanie dymu: robotnice reagują na dym jak na sygnał pożaru i zaczynają pobierać zapasy miodu z plastrów (instynktowne przygotowanie do opuszczenia gniazda). Pszczoły z pełnymi wyczkami mniej chętnie żądlą, są mniej agresywne i słabiej reagują na bodźce drażniące. Dym maskuje ponadto feromony alarmowe (octan izopentylu).\n\nTechnicznie prawidłowe użycie: 2–3 puknięcia dymu do wylotni przed otwarciem ula, a następnie delikatne okadzenie pod pokrywę. Nadmierne okadzanie stresuje robotnice i może zaburzyć ich węch (orientację). Zimny, gęsty, biały dym jest idealny; ciepły, cienki, szary jest nieskuteczny.\n\nPodkurzacz czyści się po każdym użyciu — resztki smoły zatykają dyszę. Po zakończeniu pracy zamyka się go przez przyduszenie dyszy, aby tlenie samo zgasło.",
    "alias": [
      "dymarka",
      "podkurzacz pszczelarski"
    ],
    "related": [
      "smetacek",
      "ul-pojem"
    ]
  },
  {
    "slug": "smetacek",
    "term": "Smycz pszczelarska",
    "kategorie": "vcelarstvi",
    "shortDef": "Smycz pszczelarska to miękki pędzel lub wiechć z piór, którym pszczelarz strząsa i zbiera robotnice z ramek podczas przeglądu lub przed odwirowywaniem.",
    "longDef": "Smycz pszczelarska (ang. bee brush) jest niezbędnym elementem wyposażenia pszczelarza. Tradycyjnie wykonywana była z końskiego lub gęsiego pierza; dziś dominuje wersja z miękkimi włóknami syntetycznymi. Przy każdym użyciu musi być czysta — resztki miodu lub propolisu wywołują reakcję robotnic w kontakcie z obcym zapachem.\n\nUżywana jest do strącania robotnic z ramek (przed kontrolą matki, przed odwirowywaniem miodu, przy przenoszeniu ramek). Prawidłowa technika: krótkie, płynne pociągnięcia od środka ramki w dół. Szybkie lub szarpane ruchy płoszą robotnice i zwiększają agresywność.\n\nAlternatywą dla smyczy są szczypce odwiewające (mechaniczne) lub dmuchawa powietrzna (do większych pasiek). Przy pożytku obecność obcych zapachów (perfumy, alkohol, pot) na smyczy drażni pszczoły.\n\nDezynfekcja smyczy między odwiedzanymi rodzinami jest działaniem profilaktycznym przy podejrzeniu zgnilca lub innego zakażenia — przeniesienie przez skażoną smycz jest możliwe.",
    "alias": [
      "pszczelarska smycz",
      "pędzel z piór"
    ],
    "related": [
      "dymak",
      "ul-pojem"
    ]
  },
  {
    "slug": "ul-pojem",
    "term": "Ul",
    "kategorie": "vcelarstvi",
    "shortDef": "Ul jest sztucznie wykonanym mieszkaniem dla rodziny pszczelej, w którym pszczoły budują plastry, wychowują czerw i gromadzą zapasy; nowoczesne ule ramkowe umożliwiają łatwy przegląd i zbiór miodu.",
    "longDef": "Historia bartnictwa sięga tysięcy lat — pierwsze ule były gliniane, korkowe lub wiklinowe. Nowoczesny ul ramkowy opiera się na zasadzie bee space zdefiniowanej przez Lorenzo Langstrotha (USA, 1851): ruchome ramki z odstępem 6–9 mm pozwalają wyjmować je bez uszkodzenia plastra.\n\nPodstawowe typy uli w Polsce i krajach sąsiednich: ul wielkopolski (rozbiórczy, ruchome ramki 360 × 260 mm), ul Langstrotha (wielokondygnacyjny, najpopularniejszy na świecie, ramka 448 × 232 mm), ul Dadanta (duże gniazdo, popularny w Europie Południowej), ul Zandera (kompromisowe wymiary, popularny w Europie Środkowej).\n\nMateriały: drewno świerkowe (tradycja, dobre właściwości termiczne, wymaga malowania), topola, styropian (izolacja cieplna, lekkość, gorsza trwałość), tworzywo sztuczne (nowoczesna higiena, lekkość). Ule styropianowe są coraz popularniejsze w wędrownym pszczelarstwie ze względu na niską wagę.\n\nPrawidłowo ustawiony ul stoi na podpórce na wysokości 30–50 cm, wylotnią na południe lub południowy wschód, chroniony przed bezpośrednim słońcem w południe (lekki cień), bez przeszkód przed wylotnią. Miejsce wybiera się z uwzględnieniem dostępu do wody i promienia pożytku (pszczoły latają 3–5 km).",
    "alias": [
      "kosz",
      "skrzynka ulowa",
      "korpus"
    ],
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
    "term": "Zimowanie pszczół",
    "kategorie": "vcelarstvi",
    "shortDef": "Zimowanie pszczół to ogół czynności wykonywanych pod koniec sezonu (sierpień–październik), którymi pszczelarz przygotowuje rodzinę pszczeląą do zimowego spoczynku z odpowiednimi zapasami i populacją wolną od roztoczy.",
    "longDef": "Zimowanie pszczół obejmuje kilka kluczowych etapów: ocena siły rodziny (obsadzenie ramek, stan matki), leczenie warrozy (kwasem szczawiowym przez zraszanie lub sublimację przy bezczerwiowym stanie w październiku–listopadzie), uzupełnienie zimowych zapasów (12–15 kg syropu cukrowego lub miodu), zwężenie wylotni, usunięcie nadstawki miodowej i kontrola wentylacji.\n\nSyrop cukrowy do zimowania: stężenie 2,5 : 1 (cukier : woda wagowo) lub gęsty syrop 2 : 1, podawany od połowy sierpnia do końca września, aby pszczoły zdążyły go przerobić. Zbyt późne dokarmianie spowoduje, że miód z syropu cukrowego pozostanie niedojrzały.\n\nZimowy kłąb formuje się w dolnej części gniazda czerwiowego, gdy temperatura spada poniżej 14 °C. Robotnice wytwarzają ciepło przez skurcze mięśni i przemieszczają się od zimnej peryferii do centrum. Temperatura środka kłębu utrzymywana jest powyżej 20–25 °C.\n\nKluczowy wskaźnik udanego zimowania: obecność wystarczającej liczby zimowych robotnic (robotnice, które nie wychowywały czerwiu, mają duże ciało tłuszczowe — zimują nawet 6 miesięcy). Słaba lub chora zimowa generacja prowadzi do upadku rodziny jeszcze przed wiosennym rozwojem.",
    "alias": [
      "przygotowanie do zimy",
      "zwinięcie na zimę"
    ],
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
    "term": "Wiosenny przegląd",
    "kategorie": "vcelarstvi",
    "shortDef": "Wiosenny przegląd to pierwszy przegląd rodzin pszczelich po zimie (zazwyczaj koniec marca – początek kwietnia), podczas którego sprawdza się stan matki, zapasy, czerw i przeprowadza wiosenne leczenie warrozy.",
    "longDef": "Wiosenny przegląd przeprowadza się w ciepły, bezwietrzny dzień przy temperaturze powyżej 12–14 °C. Przy niższej temperaturze otwarcie gniazda czerwiowego powoduje jego wychłodzenie i śmierć czerwiu. Cel przeglądu: potwierdzenie obecności żywej matki (jajeczka lub młody czerw), ocena siły rodziny i zapasów.\n\nPrzebieg: zdejmuje się pokrywę, usuwa zimowe karmniki, ogląda górną ramkę. Jeśli gniazdo czerwiowe jest aktywne, przegląda się je centralnie. Poszukuje się jajeczek (obserwacja pod światło), prawidłowości plastra czerwiowego, stanu zapasów pyłku i miodu.\n\nPobrany wiosenny opad z zimowej dennicowej wkładki daje przybliżone informacje o roztoczach — naturalnie obumarłe roztocza z zimowego kłębu są wskaźnikiem stopnia inwazji. Przy liczbie powyżej 50 martwych roztoczy na dennicy (za zimę) zaleca się rozpoczęcie leczenia w kwietniu.\n\nPo wiosennym przeglądzie usuwa się zimowe zaślepki wylotni, wymienia dennicową wkładkę i czyści dno ula. Słabe lub bezmateczne rodziny łączy się metodą gazety lub przez dodanie matki z rezerwy.",
    "alias": [
      "pierwszy przegląd wiosenny",
      "rewizja wiosenna"
    ],
    "related": [
      "zazimovani",
      "varroaza",
      "vcelstvo",
      "matka"
    ]
  },
  {
    "slug": "snubni-prolet",
    "term": "Lot godowy",
    "kategorie": "vcelarstvi",
    "shortDef": "Lot godowy to wylot młodej matki do trutowiska, podczas którego kopuluje z 10–20 trutniami i magazynuje nasienie w zbiorniczku nasiennym na całe życie.",
    "longDef": "Młoda matka podejmuje lot godowy zazwyczaj 7–14 dni po wygryzieniu się z matecznika. Warunkiem jest ciepły, słoneczny dzień przy temperaturze powyżej 20 °C i słabym wietrze. Matka leci na trutowisko (oddalone 1–5 km) na wysokości 10–40 m, gdzie skupiają się trutnie z wielu różnych rodzin.\n\nKopulacja odbywa się w locie — truteń spoczywa na matce, wynicowuje narząd kopulacyjny i przekazuje nasienie; po kopulacji ginie. Matka kopuluje z 10–20 trutniami podczas 1–3 lotów godowych. Nasienie jest magazynowane w zbiorniczku nasiennym (spermathece) — ten zapas wystarcza na 3–5 lat. Niewykorzystane nasienie jest aktywnie filtrowane.\n\nZła pogoda (deszcz, chłód) może uniemożliwić lot godowy — matka pozostaje niezapłodniona nawet przez 3 tygodnie. Niezapłodniona matka (zwana trutówką lub pseudomatką) w końcu zaczyna składać niezapłodnione jajeczka, z których rozwijają się wyłącznie trutnie.\n\nKontrolowane zapłodnienie matki na izolowanej stacji kopulacyjnej (wyspa, odległy grzbiet górski) stanowi podstawę hodowli selekcyjnej. W Polsce funkcjonuje sieć stacji kopulacyjnych prowadzonych przez związki hodowców pszczół.",
    "alias": [
      "lot kopulacyjny",
      "zapłodnienie matki"
    ],
    "related": [
      "matka",
      "trubec",
      "oplodnacek",
      "matka-neoplozena"
    ]
  },
  {
    "slug": "vceli-tanec",
    "term": "Taniec pszczół",
    "kategorie": "vcelarstvi",
    "shortDef": "Taniec pszczół to komunikacyjny sygnał ruchowy, za pomocą którego pszczoła zwiadowczyni informuje pozostałe o odległości, kierunku i jakości źródła pokarmu lub nowego miejsca gniazdowania.",
    "longDef": "Tańce pszczół opisał i rozszyfrował Karl von Frisch, za co otrzymał Nagrodę Nobla w dziedzinie fizjologii i medycyny w 1973 roku. Wyróżnia się dwa podstawowe typy: taniec okrągły (źródło do ok. 50–100 m od ula) i taniec ósemkowy (waggle dance, dla odległości powyżej 100 m).\n\nPodczas tańca ósemkowego robotnica przebiega po prostym odcinku (tzw. bieg prosty) i kręci odwłokiem — długość biegu prostego sygnalizuje odległość (dłuższy bieg = dalsze źródło), a kąt biegu prostego względem pionowej osi plastra odpowiada kątowi lotu do słońca. Liczba ruchów wibracyjnych w ciągu 15 sekund koreluje z odległością źródła.\n\nIntensywność tańca (energiczność, liczba powtórzeń) sygnalizuje jakość źródła — bogaty i aromatyczny nektar wywołuje intensywniejszy taniec i szybsze werbowanie zbieraczek. Obserwujące robotnice śledzą tańce żuwaczkami i czułkami, a od zbieraczki przyjmują próbkę zapachu.\n\nBadania nad tańcami pszczół są kontynuowane — wykazano, że łączna siła decyzyjna grupy zwiadowczyń wybiera miejsce gniazdowania demokratycznie: wzmacniane są tańce dla lepszych lokalizacji. To zbiorowe podejmowanie decyzji jest modelem dla teorii decyzji grupowych.",
    "alias": [
      "taniec ósemkowy",
      "taniec okrągły",
      "waggle dance"
    ],
    "related": [
      "snuska",
      "nektar-pojem",
      "vcelstvo"
    ]
  },
  {
    "slug": "medny-vynos-pojem",
    "term": "Wydajność miodowa",
    "kategorie": "vcelarstvi",
    "shortDef": "Wydajność miodowa to ilość miodu zebrana z jednej rodziny pszczelej w sezonie, wyrażona w kilogramach, jako główny ekonomiczny wskaźnik rentowności pasieki.",
    "longDef": "Wydajność miodowa zależy od kombinacji potencjału genetycznego matki, siły rodziny, rodzaju i dostępności pożytku oraz warunków atmosferycznych. Przeciętny plon w Polsce wynosi ok. 15–25 kg/rodzinę/rok; w sprzyjających rejonach rzepakowych i lipowych silna rodzina może przynieść 60–80 kg i więcej.\n\nPotencjał miodowy wyznaczają zagęszczenie kwitnących roślin w promieniu lotu (3–5 km) i czas kwitnienia. W krajobrazie monokulturowym (pszenica, kukurydza) poza sezonowym pożytkiem brakuje bardziej zróżnicowanego pokarmu — nowoczesne dopłaty rolnośrodowiskowe wspierają dlatego pasy kwietne i miedze pożytkowe.\n\nWędrowne pszczelarstwo (przewożenie uli za pożytkiem) zwiększa potencjalny plon, lecz jest organizacyjnie i fizycznie bardziej wymagające. W Polsce wędrowanie jest powszechną praktyką — do rzepaku w kwietniu–czerwcu, do lipy w lipcu, do gryki lub słonecznika w sierpniu.\n\nWydajność miodowa stanowi podstawę kalkulacji ekonomiki pasieki: przy cenach miodu 30–80 zł/kg i kosztach prowadzenia ula 200–500 zł/rok rentowność małej pasieki osiąga się przy ok. 30 rodzinach.",
    "alias": [
      "plon miodu",
      "zbiór miodu"
    ],
    "related": [
      "snuska",
      "kocovani",
      "medomet-pojem",
      "vytaceni-medu"
    ]
  },
  {
    "slug": "pastovani-medu",
    "term": "Kremowanie miodu",
    "kategorie": "vcelarstvi",
    "shortDef": "Kremowanie miodu to kontrolowana krystalizacja, podczas której płynny miód homogenizuje się z kryształami zarodkowymi (seed crystal), aby uzyskać kremowy, drobnoziarnisty produkt o gładkiej konsystencji.",
    "longDef": "Krystalizacja miodu jest naturalnym procesem fizykochemicznym — glukoza wytrąca się z przesyconego roztworu wodnego. Szybkość krystalizacji zależy od stosunku fruktozy do glukozy (wysoka zawartość fruktozy = wolna krystalizacja — miód akacjowy; miód rzepakowy z wysoką glukozą krystalizuje do twardej postaci w ciągu 2–6 tygodni).\n\nPodczas kremowania płynny miód (podgrzany do 35–40 °C w celu roztopienia istniejących kryształów) miesza się z kryształami zarodkowymi (delikatnie wymieszanym starszym miodem, zwykle 10–20% masy). Kryształy zarodkowe pełnią rolę jąder krystalizacji — przez kontrolowaną krystalizację powstają bardzo drobne, jednorodne kryształy, a konsystencja jest kremowa i łatwa do smarowania.\n\nChłodzenie do 14–16 °C przez 1–2 tygodnie jest optymalne dla tworzenia miodu kremowanego. Przy temperaturze poniżej 10 °C proces jest zbyt wolny; powyżej 25 °C kryształy ponownie się rozpuszczają. Gotowy produkt zachowuje drobne kryształki i nie ścieka.\n\nMiód kremowany jest w Polsce popularną formą sprzedaży — ma dłuższą trwałość w słoiku, nie ścieka, łatwiej się rozsmarowuje na pieczywie. Sprzedawany jest po cenach porównywalnych lub nieco wyższych niż miód płynny przy sprzedaży bezpośredniej.",
    "alias": [
      "miód kremowany",
      "miód pasteryzowany",
      "miód creamed"
    ],
    "related": [
      "zaviceny-med",
      "medomet-pojem",
      "nektar-pojem"
    ]
  },
  {
    "slug": "vytaceni-medu",
    "term": "Odwirowywanie miodu",
    "kategorie": "vcelarstvi",
    "shortDef": "Odwirowywanie miodu to proces odśrodkowego wyrzucania dojrzałego miodu z odsklepionych plastrów w miodarce, podczas którego miód wypływa ze ścianek komórek do naczynia.",
    "longDef": "Przed właściwym odwirowywaniem konieczne są czynności przygotowawcze: przeniesienie ramek z nadstawki miodowej do czystego pomieszczenia (usunięcie pszczół, aby robotnice nie mogły wracać do odsklepionych ramek), odsklepienie woskowymi wieczkami za pomocą narzędzia lub pary oraz włożenie ramek do miodarki.\n\nOdwirowywanie przebiega przy powolnych obrotach rozruchowych (70–100 obr./min.), aby plastry się nie rozerwały, a następnie podnosi się do obrotów roboczych (200–500 obr./min. w zależności od średnicy miodarki). W miodarce radialnej wystarczy jeden cykl; w tangencjalnej ramki odwraca się i odwirowuje obie strony.\n\nŚwieżo odwirowany miód filtruje się przez sito ze stali nierdzewnej (≤ 0,5 mm oczka) i pozostawia do sedymentacji w zamkniętym naczyniu przez 24–48 godzin. Bąbelki powietrza i drobne płatki wosku wypływają na powierzchnię. Następnie miód przelewa się do słoików lub beczek.\n\nPrzed rozlaniem do ostatecznego opakowania należy zmierzyć zawartość wody refraktometrem (Brix lub współczynnik załamania) — miód z zawartością wody powyżej 18% fermentuje. Sfermentowanego miodu nie można sprzedawać jako miód spożywczy zgodnie z obowiązującymi przepisami o jakości miodu.",
    "alias": [
      "wirowanie miodu",
      "tłoczenie miodu"
    ],
    "related": [
      "medomet-pojem",
      "zaviceny-med",
      "mednik",
      "pastovani-medu"
    ]
  },
  {
    "slug": "vcelin",
    "term": "Pasieka",
    "kategorie": "vcelarstvi",
    "shortDef": "Pasieka to zadaszone miejsce lub budynek chroniący ule przed warunkami atmosferycznymi, drapieżnikami i wandalami, a zarazem służący jako skład narzędzi i miodnia.",
    "longDef": "Tradycyjna pasieka (typ pawilonowy) to drewniana budowla z gankiem, na którym stoją ule wylotniami na zewnątrz. Typ pawilonowy sprawdza się w pszczelarstwie stacjonarnym (bez wędrowania) w rejonach o surowszym klimacie lub długich zimach — chroni ule przed deszczem, śniegiem i mrozem.\n\nNowoczesna pasieka korzysta zazwyczaj z wolno stojących uli na podpórkach z lekką wiatą lub plandeką. W polskich warunkach za wystarczające uważa się ustawienie w ekspozycji południowo-wschodniej z naturalną osłoną od wiatru i cieniem.\n\nWarunki prawne: w Polsce minimalne odległości uli od granic sąsiednich nieruchomości określają przepisy sanitarne i budowlane oraz regulaminy związków pszczelarskich (zazwyczaj min. 10 m od granicy lub konieczność żywopłotu/ogrodzenia jako osłony). Polski Związek Pszczelarski wydaje szczegółowe wytyczne.\n\nDla pasieki komercyjnej lub hobbystycznej korzystne jest posiadanie przy stanowisku małej wiaty z stołem roboczym, wiadrami na miód, miodarką i środkami dezynfekującymi — spełnia podstawowe wymagania higieniczne dla domowego przetwarzania miodu.",
    "alias": [
      "stanowisko ulowe",
      "wiata na ule"
    ],
    "related": [
      "ul-pojem",
      "kocovani",
      "medomet-pojem"
    ]
  },
  {
    "slug": "kocovani",
    "term": "Wędrówka pasiek",
    "kategorie": "vcelarstvi",
    "shortDef": "Wędrówka pasiek to przewożenie rodzin pszczelich za pożytkiem do innych lokalizacji, które pozwala na sezonowe wykorzystywanie różnych źródeł nektaru i spadzi oraz zwiększanie plonu miodu.",
    "longDef": "Wędrówka pasiek należy do najefektywniejszych metod zwiększania produkcji miodu. W Polsce obejmuje zazwyczaj przewóz do kwitnącego rzepaku (kwiecień–maj), do lipy (lipiec, lasy i aleje), do gryki lub słonecznika (sierpień) oraz ewentualnie do wrzosu (sierpień–wrzesień, wyżynne i podgórskie obszary Polski).\n\nPrzewóz odbywa się nocą, gdy robotnice są wewnątrz ula — wylotnia zamykana jest siatką wentylacyjną lub zaślepką, ule mocuje się pasami i układa na pojeździe. Transport nie powinien trwać dłużej niż jedną noc — przy dłuższym transporcie lub upale grozi uduszenie lub przegrzanie.\n\nNa nowym stanowisku zaleca się pozostawienie wylotni zamkniętej przez 1–2 godziny (pszczoły uspokajają się), a następnie otwarcie wczesnym rankiem. Przewóz na odległość mniejszą niż 3 km od poprzedniego stanowiska nie przekieruje lotnych pszczół — wrócą na pierwotne miejsce. Odległość przewozu musi wynosić mniej niż 50 m (dzienny przewóz etapowy) lub więcej niż 3 km.\n\nWędrowna rodzina pszczelą musi być zdrowa i leczona — Inspekcja Weterynaryjna wydaje paszporty pszczelarskie potwierdzające stan zdrowia rodziny. Bez ważnego paszportu nie można legalnie przewozić uli w Polsce.",
    "alias": [
      "przewóz uli",
      "pszczelarstwo wędrowne"
    ],
    "related": [
      "snuska",
      "medny-vynos-pojem",
      "ul-pojem",
      "vcelin"
    ]
  },
  {
    "slug": "cmsch",
    "term": "ČMSCH",
    "kategorie": "vcelarstvi",
    "shortDef": "ČMSCH (Czesko-Morawskie Towarzystwo Hodowców, a.s.) jest centralnym organem ewidencji i rejestracji rodzin pszczelich w Czechach — każdy hodowca ma obowiązek zgłaszać liczby rodzin i stanowiska do ČMSCH. Główną organizacją zrzeszającą pszczelarzy jest Czeski Związek Pszczelarski (ČSV).",
    "longDef": "Czesko-Morawskie Towarzystwo Hodowców, a.s. (ČMSCH) prowadzi Centralną Ewidencję Zwierząt Gospodarskich (UEHO). W zakresie pszczelarstwa oznacza to, że każdy hodowca musi zgłosić do ČMSCH swoje stanowiska i liczby rodzin pszczelich — dane te służą nadzorowi weterynaryjnemu (monitoring chorób, warroza) oraz obliczaniu uprawnień do dopłat z agencji płatniczej.\n\nGłówną organizacją zrzeszającą pszczelarzy jest Czeski Związek Pszczelarski (ČSV), który zapewnia kształcenie, doradztwo, ubezpieczenia i reprezentuje interesy pszczelarzy wobec organów państwowych. ČSV posiada regionalne i lokalne organizacje na terenie całych Czech.\n\nProgram hodowlany i prowadzenie ksiąg hodowlanych pszczoły miodnej koordynuje Czeski Związek Hodowców Pszczoły Miodnej (ČSCHV) we współpracy ze stacjami oceny. Program obejmuje ocenę wydajności, spokojności, rojliwości i higieniczności VSH (Varroa Sensitive Hygiene).\n\nDopłaty dla pszczelarzy w Czechach są administrowane przez agencję płatniczą SZIF w ramach wsparcia krajowego — głównie dopłaty za przezimowanie rodzin pszczelich i działania zwalczające warrozę.",
    "alias": [
      "Czesko-Morawskie Towarzystwo Hodowców",
      "centralna ewidencja rodzin pszczelich"
    ],
    "related": [
      "vcelstvo",
      "varroaza",
      "zazimovani"
    ],
    "externalUrl": "https://www.cschm.cz/",
    "externalLabel": "Strona internetowa ČMSCH"
  },
  {
    "slug": "cesno-pojem",
    "term": "Wylotnia",
    "kategorie": "vcelarstvi",
    "shortDef": "Wylotnia to otwór wejściowy w ulu, służący jako punkt wlotu i wylotu robotnic oraz jako pierwsza linia obrony rodziny pszczelej przed niepożądanymi czynnikami i intruzami.",
    "longDef": "Wylotnia (z stsłow. „cesati\" — droga) to główny otwór w przedniej ścianie ula. Standardowa szerokość wylotni zależy od typu ula — w ulu Langstrotha wynosi zazwyczaj 20 mm wysokości i pełną szerokość korpusu (37–40 cm) lub krótsza zaślepka. Wysokość wylotni dostosowuje się do wielkości populacji i pory roku.\n\nNa lato wylotnia jest poszerzana dla swobodnego przejścia intensywnie latających robotnic i wentylacji; jesienią zwęża się zaślepką lub wkładką do szerokości jednego palca, aby ograniczyć dostęp słabszych drapieżników (szerszeni, myszy, pszczół rabusiów). Na zimę wylotnia jest całkowicie zamykana zaślepką z siateczką wentylacyjną.\n\nWylotnia jako linia obrony: strażnicze robotnice kontrolują każdą przybywającą pszczołę za pomocą narządów węchu i dotyku. Intruzi (pszczoły rabusie z obcych uli, osy, szerszenie) są odpędzani lub zabijani. Intensywność rabunków jest wskaźnikiem siły rodziny — słaba lub bezmateczna rodzina nie potrafi się bronić.\n\nOcena aktywności wylotni to szybka diagnostyka zdrowia rodziny: aktywny ruch robotnic z obłożkami pyłkowymi w godzinach porannych sygnalizuje silne, aktywne gniazdo; martwe lub nieruchome pszczoły przy wylotni świadczą o problemie.",
    "alias": [
      "otwór wylotowy ula",
      "otwór wlotowy",
      "wlotnia"
    ],
    "related": [
      "ul-pojem",
      "nastavek",
      "zazimovani"
    ]
  },
  {
    "slug": "medocukrove-testo",
    "term": "Ciasto miodowo-cukrowe",
    "kategorie": "vcelarstvi",
    "shortDef": "Ciasto miodowo-cukrowe (kandy) to stały zimowy pokarm ze cukru, miodu i wody, który kładzie się na ramki w celu uzupełnienia zapasów zimą lub wczesną wiosną.",
    "longDef": "Ciasto miodowo-cukrowe (ang. candy lub fondant) wytwarza się z cukru kryształu (80–90%), miodu (5–15%) i niewielkiej ilości wody (8–10%). Gotuje się przy ciągłym mieszaniu do temperatury 118–120 °C (próba w zimnej wodzie — twarda kulka), a następnie miesza podczas stygnięcia do twardej, plastycznej konsystencji. Gotowy produkt to miękki, roztieralny, stały wyrób cukrowy.\n\nPodawanie kandy odbywa się przez wylotnie zimową lub wiosenną w plastikowym woreczku lub plastikowej miseczce położonej na górnych listwach ramek. Robotnice powoli spożywają kandy — stanowi ono zapas ratunkowy przy wyczerpaniu zimowego miodu. Dawka wynosi zazwyczaj 1–2 kg na zimującą rodzinę.\n\nWytwarzanie domowe jest możliwe, lecz czasochłonne. Komercyjnie dostępne pasty kandowe (np. Apifondant, Apicandy) są standaryzowane, higieniczne, niekiedy wzbogacane o minerały lub witaminy. Cena gotowego kandy wynosi około 5–10 zł/kg.\n\nKandy jest alternatywą dla syropu cukrowego (podawanego w ciepłym sezonie) — płynny syrop jest nieodpowiedni do zimowego podawania, ponieważ robotnice muszą odparować wodę, a wilgotność wewnętrzna rosłaby. Stała postać kandy podczas parowania nie wprowadza wilgoci do zimowego kłębu.",
    "alias": [
      "kandy",
      "candy",
      "ciasto cukrowo-miodowe",
      "zimowe karmidło"
    ],
    "related": [
      "zazimovani",
      "vyzimovani",
      "vcelstvo"
    ]
  },
  {
    "slug": "oplodnacek",
    "term": "Odkładek kopulacyjny",
    "kategorie": "vcelarstvi",
    "shortDef": "Odkładek kopulacyjny to mały ul na 3–5 miniaturowych ramek, używany przez hodowców matek do izolowanego zapłodnienia młodych matek na odległych stacjach kopulacyjnych.",
    "longDef": "Odkładek kopulacyjny (miniul lub ul nucleusowy) to specjalny mały ul, którego wymiary odpowiadają mniej więcej jednej trzeciej lub jednej czwartej standardowej ramki (np. format Zander lub Apidea). Obsadza się go garścią robotnic (ok. 100–200 g) z jednego lub kilku niezlikwidowanych źródeł, plastrem z czerwiem i zapasami, a następnie wkłada świeżo wygryzioną dziewiczą matkę.\n\nRobotnice w odkładku kopulacyjnym opiekują się matką podczas jej dojrzewania. Po 7–14 dniach od wygryzieniu podejmuje ona lot godowy. Na izolowanej stacji kopulacyjnej (wyspa, odległy grzbiet górski) w zasięgu lotu znajdują się wyłącznie trutnie z wybranych linii hodowlanych, co zapewnia kontrolowane zapłodnienie.\n\nPo zapłodnieniu matkę kontroluje się (składanie jajeczek, zwarty czerw do 10 dni po powrocie z lotu godowego) i odławia do wysyłki lub wprowadzania do produkcyjnej rodziny. Odkładek kopulacyjny przyjmuje następnie nową dziewiczą matkę.\n\nSystemy odkładków kopulacyjnych są standaryzowane (Apidea, Kirchhain, Nicot) — wzajemna zamienność i łatwa obsługa to zalety; wadą jest trudność transportu i słabsze zapasy przy złej pogodzie.",
    "alias": [
      "ul nucleusowy",
      "miniul",
      "stacja kopulacyjna"
    ],
    "related": [
      "matka",
      "snubni-prolet",
      "oddelek",
      "matka-neoplozena"
    ]
  },
  {
    "slug": "trubcina",
    "term": "Czerw trutowy",
    "kategorie": "vcelarstvi",
    "shortDef": "Czerw trutowy to powierzchnia plastra z komórkami trutowymi (średnica 6,2–6,9 mm), w których rozwijają się trutnie i które stanowią biotop preferowany przez roztocze Varroa do rozmnażania.",
    "longDef": "Plaster trutowy rozpoznaje się od czerwiu roboczego zarówno wizualnie (komórki mają większą średnicę i są kopułkowato wypukłe, tak że zasklepiony czerw trutowy wyraźnie wystaje ponad powierzchnię plastra), jak i wymiarowo. Matka składa do komórek trutowych niezapłodnione jajeczka celowo — rozpoznaje rozmiar komórki sensorami odwłokowymi.\n\nZ punktu widzenia parazytologii plaster trutowy jest krytycznym miejscem dla warrozy — Varroa destructor preferuje czerw trutowy (trutnie mają dłuższą fazę zasklepienia, więc roztocze zdąży wydać więcej potomstwa). Celowe wstawianie ramek trutowych do gniazda i ich cykliczne usuwanie (tzw. biotechniczna metoda zwalczania warrozy) zmniejsza populację roztoczy bez użycia chemii.\n\nZbyt duża powierzchnia plastra trutowego (powyżej 20% powierzchni gniazda) osłabia rodzinę nadmierną liczbą żywych trutni. W bezmatecznej rodzinie (lub przy robotnicach z czynnymi jajnikami) cały czerw jest trutowy — zjawisko to, zwane „trutówką\" lub „bezmateczną rodziną trutową\", świadczy o poważnym zaburzeniu.\n\nStara węza ma tendencję do powiększania komórek — pszczoły dobudowują komórki na większą średnicę, co zwiększa udział plastra trutowego. Wymiana węzy co 2 lata kontroluje wymiar komórek.",
    "alias": [
      "plaster trutowy",
      "powierzchnia trutowa"
    ],
    "related": [
      "trubec",
      "varroaza",
      "vceli-plod",
      "klestik-vcely"
    ]
  },
  {
    "slug": "matka-neoplozena",
    "term": "Matka niezapłodniona",
    "kategorie": "vcelarstvi",
    "shortDef": "Matka niezapłodniona (dziewicza) to świeżo wygryziona lub dojrzewająca matka, która nie odbyła jeszcze lotu godowego, a zatem nie magazynuje nasienia i nie jest zdolna do składania zapłodnionych jajeczek.",
    "longDef": "Matka dziewicza jest fizjologicznym stadium pośrednim między larwą w mateczniku a płodną matką. Po wygryzieniu z matecznika jest ruchliwa i aktywna, lecz jeszcze niedojrzała do rozrodu — jajniki dojrzewają, zbiorniczek nasienny jest pusty.\n\nW pierwszych 5–7 dniach po wygryzieniu przebiega dojrzewanie płciowe. Matka eksploruje ul, niszczy pozostałe mateczniki (kłuje przez wieczko) i wypiera ewentualne rywalki z innych mateczników. Ten stan „walk o tron\" jest normalny przy naturalnym roju.\n\nObecność matki dziewiczej trudno potwierdzić — nie składa jajeczek, więc test czerwiowy nie pomaga. Bezpośrednia obserwacja (matka jest ruchliwa, smukła, lecz bez jajeczek) lub test feromonowy (brak wyraźnego zapachu matki) to dostępne metody. Niedoświadczony pszczelarz może łatwo przez pomyłkę zniszczyć matkę dziewiczą.\n\nTransport matek dziewiczych w wysyłkowych klatkach jest ryzykowniejszy niż transport matek niosących — robotnice gorzej je przyjmują. Dlatego hodowcy wysyłają zazwyczaj matki po zapłodnieniu (najpóźniej 2–3 dni po pierwszym czerwieniu).",
    "alias": [
      "matka dziewicza",
      "virgin queen"
    ],
    "related": [
      "matka",
      "snubni-prolet",
      "oplodnacek",
      "matecnik"
    ]
  },
  {
    "slug": "zaviceny-med",
    "term": "Miód zasklepiony",
    "kategorie": "vcelarstvi",
    "shortDef": "Miód zasklepiony to miód zamknięty woskowym wieczkiem w komórkach plastra, co sygnalizuje jego dojrzałość — zawartość wody spadła poniżej 18% i miód nie fermentuje.",
    "longDef": "Zasklepianie miodu jest naturalnym jakościowym standardem, który pszczoły stosują instynktownie. Dopiero po osiągnięciu zawartości wody poniżej 17–18% robotnice zamykają komórkę woskowym wieczkiem. Miód o wyższej zawartości wody fermentowałby w komórce (drożdże Saccharomyces cerevisiae lub Zygosaccharomyces rouxii są naturalnie obecne w miodzie).\n\nPrzy odwirowywaniu obowiązuje zasada: wirować wyłącznie ramki, których co najmniej dwie trzecie komórek jest zasklepionych. Niedojrzały miód (z komórek bez wieczek lub słabo zasklepionych) można odwirować, lecz jest niestabilny — sfermentuje w naczyniu. Kontrola urzędowa przy sprzedaży miodu sprawdza zawartość wody refraktometrycznie (do 20% według aktualnych przepisów, optimum do 18%).\n\nMiód w plastrze (honeycomb) — całe zasklepione plastry lub ich wycinki — jest najcenniejszą formą sprzedaży miodu: klient otrzymuje produkt całkowicie nietkniętym ludzką ręką. Cena miodu w plastrze osiąga 150–300 zł/kg.\n\nMiód sfermentowany (zkwaszony) nie może być sprzedawany jako miód spożywczy. Przetwarza się go na miód pitny lub hydromel. Zawartość alkoholu w naturalnie sfermentowanym miodzie zależy od warunków fermentacji — zazwyczaj 1–3% w naturalnie przekwaszonej masie.",
    "alias": [
      "miód dojrzały",
      "miód operkowany",
      "miód w plastrze"
    ],
    "related": [
      "zavickovani",
      "medomet-pojem",
      "vytaceni-medu",
      "nektar-pojem"
    ]
  },
  {
    "slug": "dzes",
    "term": "DZES – dobry stan rolniczy i środowiskowy",
    "kategorie": "regulace",
    "shortDef": "DZES to zestaw zasad utrzymania gruntów w dobrym stanie rolniczym i środowiskowym.",
    "longDef": "DZES to zestaw zasad, których rolnicy muszą przestrzegać, aby utrzymać grunty w dobrym stanie rolniczym i środowiskowym. Zasady te obejmują środki ochrony gleby, wody i różnorodności biologicznej.\n\nDZES jest częścią warunkowości – systemu łączącego dotacje rolnicze z przestrzeganiem określonych standardów. Spełnienie wymogów DZES jest kluczowe dla uzyskania płatności bezpośrednich i niektórych innych dotacji.\n\nW Polsce DZES jest wdrożony w ramach Wspólnej Polityki Rolnej UE, a jego przestrzeganie jest kontrolowane przez właściwe organy.",
    "alias": [
      "DZES"
    ],
    "related": [
      "saps",
      "redistributivni-platba",
      "anc-platba",
      "podminenost"
    ],
    "faq": [
      {
        "q": "Do czego służy DZES?",
        "a": "DZES służy zapewnieniu, że grunty rolne są utrzymywane w dobrym stanie zarówno dla rolnictwa, jak i dla środowiska naturalnego."
      },
      {
        "q": "Jakie zasady obejmuje DZES?",
        "a": "DZES obejmuje zasady ochrony gleby, wody i różnorodności biologicznej."
      }
    ]
  },
  {
    "slug": "saps",
    "term": "SAPS – jednolita płatność obszarowa",
    "kategorie": "dotace",
    "shortDef": "SAPS to system płatności bezpośrednich dla rolników oparty na powierzchni użytkowanych gruntów.",
    "longDef": "SAPS (Single Area Payment Scheme) to system płatności bezpośrednich dla rolników, który opiera się na wielkości użytkowanej powierzchni rolnej. System ten jest przeznaczony dla krajów Unii Europejskiej, które przystąpiły do UE po 2004 roku.\n\nPłatności w ramach SAPS są wypłacane corocznie i nie są powiązane z konkretną produkcją, co daje rolnikom większą elastyczność w podejmowaniu decyzji dotyczących użytkowania gruntów.\n\nSAPS jest kluczowym instrumentem wspierania rolnictwa, którego celem jest zapewnienie rolnikom stabilnego dochodu.",
    "alias": [
      "SAPS"
    ],
    "related": [
      "dzes",
      "redistributivni-platba",
      "anc-platba",
      "cap-2024"
    ],
    "faq": [
      {
        "q": "Jak oblicza się SAPS?",
        "a": "SAPS oblicza się na podstawie wielkości użytkowanej powierzchni gruntów rolnych."
      },
      {
        "q": "Do czego służy SAPS?",
        "a": "SAPS służy finansowemu wspieraniu rolników w ramach UE."
      }
    ]
  },
  {
    "slug": "redistributivni-platba",
    "term": "Płatność redystrybucyjna",
    "kategorie": "dotace",
    "shortDef": "Płatność redystrybucyjna to dodatkowe wsparcie finansowe dla małych i średnich gospodarstw rolnych.",
    "longDef": "Płatność redystrybucyjna jest częścią systemu płatności bezpośrednich, przeznaczoną dla małych i średnich gospodarstw rolnych. Płatność ta jest przyznawana do pierwszych hektarów użytkowanej powierzchni, co pomaga wyrównać różnice między dużymi a małymi gospodarstwami.\n\nCelem płatności redystrybucyjnej jest wspieranie dywersyfikacji produkcji rolnej i zapewnienie trwałości mniejszych podmiotów, które często borykają się z większymi wyzwaniami ekonomicznymi.\n\nPłatność redystrybucyjna jest wdrożona w ramach Wspólnej Polityki Rolnej UE i stanowi kluczowy instrument wspierania mniejszych rolników.",
    "related": [
      "saps",
      "dzes",
      "anc-platba",
      "cap-2024"
    ],
    "faq": [
      {
        "q": "Jaki jest cel płatności redystrybucyjnej?",
        "a": "Płatność redystrybucyjna wspiera małe i średnie gospodarstwa rolne."
      },
      {
        "q": "Czym różni się płatność redystrybucyjna od SAPS?",
        "a": "Płatność redystrybucyjna jest uzupełnieniem SAPS i skupia się na wsparciu mniejszych gospodarstw."
      }
    ]
  },
  {
    "slug": "nitratova-smernice",
    "term": "Dyrektywa azotanowa",
    "kategorie": "regulace",
    "shortDef": "Dyrektywa azotanowa to europejskie przepisy prawne mające na celu ochronę wód przed zanieczyszczeniem azotanami.",
    "longDef": "Dyrektywa azotanowa jest częścią ustawodawstwa Unii Europejskiej, która skupia się na ochronie zasobów wodnych przed zanieczyszczeniem azotanami pochodzącymi z rolnictwa. Dyrektywa określa środki ograniczające ryzyko zanieczyszczenia i promuje zrównoważone praktyki rolnicze.\n\nWdrożenie dyrektywy obejmuje identyfikację obszarów wrażliwych, gdzie ryzyko zanieczyszczenia jest najwyższe, oraz wdrożenie programów działań na rzecz ograniczenia napływu azotanów do wód.\n\nDyrektywa azotanowa jest kluczowym instrumentem ochrony jakości wody i jest wdrożona poprzez przepisy krajowe i mechanizmy kontrolne.",
    "related": [
      "zranitelne-oblasti",
      "dzes",
      "ekoschemata",
      "podminenost"
    ],
    "externalUrl": "https://pl.wikipedia.org/wiki/Dyrektywa_azotanowa",
    "externalLabel": "Wikipedia: Dyrektywa azotanowa",
    "faq": [
      {
        "q": "Jaki jest cel dyrektywy azotanowej?",
        "a": "Celem jest ochrona wód przed zanieczyszczeniem azotanami ze źródeł rolniczych."
      },
      {
        "q": "Jakie obszary obejmuje dyrektywa azotanowa?",
        "a": "Obejmuje obszary o wysokim ryzyku zanieczyszczenia wód azotanami."
      }
    ]
  },
  {
    "slug": "zranitelne-oblasti",
    "term": "Obszary wrażliwe (azotanowe)",
    "kategorie": "regulace",
    "shortDef": "Obszary wrażliwe to tereny, na których istnieje podwyższone ryzyko zanieczyszczenia wód azotanami.",
    "longDef": "Obszary wrażliwe, w kontekście dyrektywy azotanowej, to tereny zidentyfikowane jako miejsca o podwyższonym ryzyku zanieczyszczenia wód azotanami ze źródeł rolniczych. Tereny te są objęte szczególnymi środkami ochrony jakości wody.\n\nNa tych obszarach wdrażane są programy działań obejmujące środki ograniczające napływ azotanów do zasobów wodnych, takie jak ograniczenie stosowania nawozów i wdrażanie zrównoważonych praktyk rolniczych.\n\nObszary wrażliwe są regularnie aktualizowane i kontrolowane, aby zapewnić skuteczną ochronę zasobów wodnych.",
    "related": [
      "nitratova-smernice",
      "dzes",
      "ekoschemata",
      "podminenost"
    ],
    "faq": [
      {
        "q": "Czym są obszary wrażliwe?",
        "a": "Są to tereny, na których istnieje podwyższone ryzyko zanieczyszczenia wód azotanami."
      },
      {
        "q": "Jak wyznacza się obszary wrażliwe?",
        "a": "Wyznacza się je na podstawie stężenia azotanów w wodach i ryzyka ich zanieczyszczenia."
      }
    ]
  },
  {
    "slug": "anc-platba",
    "term": "ANC – płatność dla obszarów z ograniczeniami naturalnymi",
    "kategorie": "dotace",
    "shortDef": "ANC to płatność dla rolników na obszarach z ograniczeniami naturalnymi.",
    "longDef": "ANC (Areas with Natural Constraints) to płatność przeznaczona dla rolników prowadzących działalność na obszarach z ograniczeniami naturalnymi, takich jak tereny górskie czy regiony o niekorzystnych warunkach klimatycznych. Celem tej płatności jest rekompensata dodatkowych kosztów i utraty dochodów związanych z trudnymi warunkami gospodarowania.\n\nPłatności ANC pomagają utrzymać działalność rolniczą na tych obszarach, co przyczynia się do zachowania krajobrazu i różnorodności biologicznej. Rolnicy z obszarów ANC muszą spełniać określone warunki, aby kwalifikować się do tego wsparcia.\n\nPłatność ANC jest ważnym instrumentem wspierania rolnictwa na terenach mniej korzystnych i stanowi część szerszych ram Wspólnej Polityki Rolnej UE.",
    "alias": [
      "ANC"
    ],
    "related": [
      "saps",
      "dzes",
      "redistributivni-platba",
      "cap-2024"
    ],
    "faq": [
      {
        "q": "Do czego służy płatność ANC?",
        "a": "Płatność ANC wspiera rolników na obszarach z ograniczeniami naturalnymi."
      },
      {
        "q": "Jakie obszary kwalifikują się do płatności ANC?",
        "a": "Obszary o niekorzystnych warunkach przyrodniczych, takie jak tereny górskie lub suche."
      }
    ]
  },
  {
    "slug": "ekoschemata",
    "term": "Ekoschematy (ekoplatność)",
    "kategorie": "dotace",
    "shortDef": "Ekoschematy to wsparcie finansowe ukierunkowane na promowanie ekologicznych praktyk rolniczych.",
    "longDef": "Ekoschematy to zestaw środków w ramach Wspólnej Polityki Rolnej UE, które zapewniają wsparcie finansowe rolnikom za wdrażanie ekologicznych i zrównoważonych praktyk rolniczych. Celem jest motywowanie rolników do działań przyczyniających się do ochrony środowiska, różnorodności biologicznej i poprawy jakości gleby. W praktyce chodzi m.in. o wsparcie dla rolnictwa ekologicznego, agrolesnictwa lub ochrony zasobów wodnych. Ekoschematy są częścią szerszego systemu dopłat rolniczych, a ich wdrożenie jest koordynowane przez właściwe ministerstwo.",
    "alias": [
      "ekoplatność"
    ],
    "related": [
      "podminenost",
      "ozeleneni",
      "prv",
      "cap-2024"
    ],
    "faq": [
      {
        "q": "Do czego służą ekoschematy?",
        "a": "Ekoschematy służą wspieraniu ekologicznych praktyk rolniczych przyczyniających się do ochrony środowiska."
      },
      {
        "q": "Jakie warunki trzeba spełnić, aby uzyskać ekoplatność?",
        "a": "Rolnicy muszą stosować określone praktyki ekologiczne zdefiniowane w ramach ekoschematów."
      },
      {
        "q": "Czym różnią się ekoschematy od tradycyjnych dotacji?",
        "a": "Ekoschematy są celowo nakierowane na aspekty ekologiczne, podczas gdy tradycyjne dotacje mogą obejmować szerszy zakres potrzeb rolniczych."
      }
    ]
  },
  {
    "slug": "podminenost",
    "term": "Warunkowość (kondicjonalność)",
    "kategorie": "regulace",
    "shortDef": "Warunkowość to system zasad, których rolnicy muszą przestrzegać, aby uzyskać dotacje rolnicze.",
    "longDef": "Warunkowość, zwana również kondicjonalnością, to zestaw zasad i norm, których rolnicy muszą przestrzegać, aby kwalifikować się do płatności bezpośrednich i niektórych innych dotacji rolniczych w ramach UE. Zasady te obejmują wymagania dotyczące ochrony środowiska, zdrowia zwierząt i roślin, bezpieczeństwa żywności oraz dobrostanu zwierząt. Warunkowość jest kluczowym elementem Wspólnej Polityki Rolnej i służy jako narzędzie zapewniające zrównoważone rolnictwo. Przestrzeganie warunkowości jest kontrolowane przez właściwe organy, a jej naruszenie może skutkować sankcjami finansowymi.",
    "alias": [
      "kondicjonalność"
    ],
    "related": [
      "ekoschemata",
      "ozeleneni",
      "prv",
      "gaec"
    ],
    "faq": [
      {
        "q": "Czym jest warunkowość w rolnictwie?",
        "a": "Warunkowość to zestaw zasad, które rolnicy muszą spełniać, aby otrzymać dotacje rolnicze."
      },
      {
        "q": "Jakie obszary obejmuje warunkowość?",
        "a": "Warunkowość obejmuje obszary takie jak ochrona środowiska, dobrostan zwierząt i bezpieczeństwo żywności."
      },
      {
        "q": "Jak kontroluje się przestrzeganie warunkowości?",
        "a": "Przestrzeganie warunkowości jest kontrolowane za pomocą inspekcji i audytów."
      }
    ]
  },
  {
    "slug": "zastropovani",
    "term": "Pułapowanie płatności bezpośrednich",
    "kategorie": "dotace",
    "shortDef": "Pułapowanie płatności bezpośrednich to ograniczenie maksymalnej wysokości dotacji, jaką może otrzymać jedno gospodarstwo rolne.",
    "longDef": "Pułapowanie płatności bezpośrednich to mechanizm w ramach Wspólnej Polityki Rolnej UE, który ustala maksymalną kwotę płatności bezpośrednich, jaką może uzyskać jedno gospodarstwo rolne. Celem jest zapewnienie bardziej sprawiedliwego podziału środków finansowych między mniejsze i średnie gospodarstwa oraz zapobieganie koncentracji dotacji w dużych podmiotach. System ten może obejmować różne poziomy redukcji płatności powyżej określonych limitów i może być łączony z innymi środkami, takimi jak płatność redystrybucyjna. Pułapowanie płatności bezpośrednich jest przedmiotem dyskusji w kontekście krajowego wdrożenia polityki UE.",
    "alias": [
      "pułapowanie"
    ],
    "related": [
      "prv",
      "redistributivni-platba",
      "ekoschemata",
      "cap-2024"
    ],
    "faq": [
      {
        "q": "Co oznacza pułapowanie płatności bezpośrednich?",
        "a": "Pułapowanie płatności bezpośrednich to ograniczenie maksymalnej kwoty dotacji, jaką może otrzymać jedno gospodarstwo rolne."
      },
      {
        "q": "Dlaczego wprowadza się pułapowanie płatności?",
        "a": "Celem pułapowania jest zapewnienie bardziej sprawiedliwego podziału dotacji między mniejsze i średnie gospodarstwa rolne."
      },
      {
        "q": "Jak ustalany jest limit pułapowania płatności?",
        "a": "Limit jest ustalany na podstawie łącznej wysokości płatności bezpośrednich otrzymywanych przez gospodarstwo."
      }
    ]
  },
  {
    "slug": "prv",
    "term": "Program Rozwoju Obszarów Wiejskich (PROW)",
    "kategorie": "dotace",
    "shortDef": "Program Rozwoju Obszarów Wiejskich to zestaw środków wspierających rozwój obszarów wiejskich i rolnictwa.",
    "longDef": "Program Rozwoju Obszarów Wiejskich (PROW) jest kluczowym instrumentem Wspólnej Polityki Rolnej UE, który skupia się na wspieraniu rozwoju obszarów wiejskich i poprawie konkurencyjności rolnictwa. PROW obejmuje środki na modernizację gospodarstw rolnych, wsparcie rolnictwa ekologicznego, rozwój infrastruktury wiejskiej i poprawę jakości życia na wsi. PROW jest wdrożony przez właściwe ministerstwo rolnictwa i obejmuje szeroki zakres projektów i inicjatyw wspierających zrównoważony rozwój i innowacje w sektorze rolnym.",
    "alias": [
      "PROW"
    ],
    "related": [
      "ekoschemata",
      "podminenost",
      "zastropovani",
      "ozeleneni"
    ],
    "faq": [
      {
        "q": "Czym jest Program Rozwoju Obszarów Wiejskich?",
        "a": "Program Rozwoju Obszarów Wiejskich to zestaw środków wspierających rozwój obszarów wiejskich i rolnictwa."
      },
      {
        "q": "Jakie cele ma Program Rozwoju Obszarów Wiejskich?",
        "a": "Celem jest poprawa konkurencyjności rolnictwa, wspieranie zrównoważonej gospodarki i poprawa jakości życia na obszarach wiejskich."
      },
      {
        "q": "Jak finansowany jest Program Rozwoju Obszarów Wiejskich?",
        "a": "Program jest finansowany ze środków Unii Europejskiej i ze źródeł krajowych."
      }
    ]
  },
  {
    "slug": "platba-pro-mlade-zemedelce",
    "term": "Płatność dla młodych rolników",
    "kategorie": "dotace",
    "shortDef": "Płatność dla młodych rolników to wsparcie finansowe przeznaczone dla początkujących rolników do 40. roku życia.",
    "longDef": "Płatność dla młodych rolników to specjalna forma wsparcia finansowego w ramach Wspólnej Polityki Rolnej UE, przeznaczona dla młodych rolników do 40. roku życia. Celem tej płatności jest wspieranie wymiany pokoleniowej w rolnictwie, ułatwienie młodym ludziom wejścia do sektora rolnego oraz wspieranie ich działalności gospodarczej. Wsparcie to jest przyznawane jako płatność dodatkowa do płatności podstawowej i może być łączone z innymi środkami, takimi jak wsparcie inwestycji w gospodarstwach rolnych. Płatność ta jest częścią krajowego planu rozwoju obszarów wiejskich i jest administrowana przez właściwe ministerstwo rolnictwa.",
    "related": [
      "prv",
      "ekoschemata",
      "ozeleneni",
      "redistributivni-platba"
    ],
    "faq": [
      {
        "q": "Czym jest płatność dla młodych rolników?",
        "a": "Płatność dla młodych rolników to wsparcie finansowe przeznaczone dla początkujących rolników do 40. roku życia."
      },
      {
        "q": "Jakie są warunki uzyskania płatności dla młodych rolników?",
        "a": "Warunkiem jest wiek do 40 lat i rozpoczęcie działalności rolniczej."
      },
      {
        "q": "Dlaczego przyznawana jest płatność dla młodych rolników?",
        "a": "Płatność jest przyznawana w celu wspierania wymiany pokoleniowej w rolnictwie."
      }
    ]
  },
  {
    "slug": "ozeleneni",
    "term": "Zazielenienie (greening)",
    "kategorie": "dotace",
    "shortDef": "Zazielenienie to zestaw środków rolniczych ukierunkowanych na poprawę zrównoważenia ekologicznego.",
    "longDef": "Zazielenienie, znane również jako greening, jest częścią Wspólnej Polityki Rolnej UE i obejmuje obowiązkowe środki ekologiczne, które rolnicy muszą stosować, aby uzyskać pełną kwotę płatności bezpośrednich. Środki te obejmują dywersyfikację upraw, utrzymanie trwałych użytków zielonych oraz wyznaczenie obszarów proekologicznych. Celem zazielenienia jest poprawa zrównoważenia ekologicznego rolnictwa, ochrona różnorodności biologicznej i przyczynienie się do walki ze zmianą klimatu. Zazielenienie jest wdrożone w ramach strategii krajowych i jest kontrolowane przez właściwe organy.",
    "alias": [
      "greening"
    ],
    "related": [
      "ekoschemata",
      "podminenost",
      "prv",
      "cap-2024"
    ],
    "faq": [
      {
        "q": "Czym jest zazielenienie w rolnictwie?",
        "a": "Zazielenienie to zestaw środków rolniczych ukierunkowanych na poprawę zrównoważenia ekologicznego."
      },
      {
        "q": "Jakie są główne elementy zazielenienia?",
        "a": "Głównymi elementami są dywersyfikacja upraw, utrzymanie trwałych użytków zielonych i ochrona obszarów ważnych ekologicznie."
      },
      {
        "q": "Dlaczego zazielenienie jest ważne?",
        "a": "Zazielenienie przyczynia się do ograniczenia negatywnego wpływu rolnictwa na środowisko naturalne."
      }
    ]
  },
  {
    "slug": "diskovy-podmitac",
    "term": "Talerzowy agregat ścierniskowy",
    "kategorie": "technologie",
    "shortDef": "Talerzowy agregat ścierniskowy to maszyna rolnicza przeznaczona do płytkiej uprawy ścierniskowej gleby.",
    "longDef": "Talerzowy agregat ścierniskowy to maszyna rolnicza wyposażona w szereg talerzy ustawionych pod kątem do kierunku jazdy. Służy do płytkiej uprawy ścierniskowej gleby, czyli procesu, w którym powierzchniowa warstwa gleby jest spulchniana i mieszana. Proces ten pomaga w zwalczaniu chwastów, poprawia strukturę gleby i wspiera rozkład materii organicznej.\n\nW praktyce talerzowe agregaty ścierniskowe są stosowane głównie po zbiorach, kiedy konieczne jest szybkie i efektywne podoranie ścierniska. Nadają się do różnych typów gleb i umożliwiają sprawną pracę na dużych powierzchniach.\n\nTalerzowe agregaty ścierniskowe są powszechnie stosowane na polach różnych wielkości i stanowią część nowoczesnego rolnictwa, które kładzie nacisk na efektywność i zrównoważony rozwój.",
    "alias": [
      "kultywator talerzowy",
      "pług talerzowy"
    ],
    "related": [
      "radlickovy-kypric",
      "hloubkove-kypreni",
      "strniste"
    ],
    "faq": [
      {
        "q": "Do czego służy talerzowy agregat ścierniskowy?",
        "a": "Talerzowy agregat ścierniskowy służy do płytkiej uprawy ścierniskowej gleby, co pomaga w zwalczaniu chwastów i poprawie struktury gleby."
      },
      {
        "q": "Jaka jest różnica między talerzowym agregatem ścierniskowym a kultywatorem podsztyblowym?",
        "a": "Talerzowy agregat ścierniskowy przeznaczony jest do płytkiej uprawy, natomiast kultywator podsztyblowy stosowany jest do głębszej uprawy gleby."
      }
    ]
  },
  {
    "slug": "radlickovy-kypric",
    "term": "Kultywator podsztyblowy",
    "kategorie": "technologie",
    "shortDef": "Kultywator podsztyblowy to maszyna przeznaczona do głębszej uprawy gleby.",
    "longDef": "Kultywator podsztyblowy to maszyna rolnicza, która wykorzystuje redlice do głębszego spulchniania gleby. Jest zaprojektowany tak, aby naruszyć strukturę gleby i poprawić jej napowietrzenie, co wspiera wzrost roślin uprawnych.\n\nStosowany jest głównie do przygotowania gleby przed siewem, kiedy konieczne jest jej spulchnienie i wyrównanie. Kultywator podsztyblowy nadaje się do różnych typów gleb i umożliwia efektywną pracę na większych powierzchniach.\n\nW polskim rolnictwie kultywator podsztyblowy jest często wykorzystywany jako alternatywa dla tradycyjnej orki, co przyczynia się do ochrony struktury gleby i ograniczenia erozji.",
    "alias": [
      "kultywator skibowy"
    ],
    "related": [
      "diskovy-podmitac",
      "hloubkove-kypreni",
      "orba",
      "predsetova-priprava"
    ],
    "faq": [
      {
        "q": "Jak działa kultywator podsztyblowy?",
        "a": "Kultywator podsztyblowy pracuje za pomocą redlic, które wnikają w glebę i zapewniają jej napowietrzenie oraz wymieszanie."
      },
      {
        "q": "Kiedy stosuje się kultywator podsztyblowy?",
        "a": "Kultywator podsztyblowy stosuje się przy przygotowaniu gleby przed siewem, szczególnie wiosną i jesienią."
      }
    ]
  },
  {
    "slug": "teleskopicky-manipulator",
    "term": "Manipulator teleskopowy",
    "kategorie": "technologie",
    "shortDef": "Manipulator teleskopowy to maszyna przeznaczona do przemieszczania materiałów w gospodarstwach rolnych.",
    "longDef": "Manipulator teleskopowy to wielofunkcyjna maszyna wyposażona w teleskopowe ramię, które umożliwia manipulowanie materiałami na różnych wysokościach i odległościach. Jest szeroko stosowany w rolnictwie do załadunku, rozładunku i transportu materiałów, takich jak bele siana, nawozy czy materiały budowlane.\n\nDzięki swojej elastyczności i zdolności do pracy w ograniczonych przestrzeniach manipulator teleskopowy jest idealny dla gospodarstw różnej wielkości. Jego wszechstronność wynika z możliwości podłączenia różnych narzędzi, takich jak widły, łyżka lub chwytak.\n\nManipulator teleskopowy jest powszechnym elementem wyposażenia rolniczego, który zwiększa efektywność i zmniejsza wysiłek fizyczny przy pracy z materiałami.",
    "alias": [
      "ładowarka teleskopowa"
    ],
    "related": [
      "celni-nakladac",
      "auto-steering",
      "telematika",
      "drony-zemedelstvi"
    ],
    "faq": [
      {
        "q": "Czym jest manipulator teleskopowy?",
        "a": "Manipulator teleskopowy to maszyna przeznaczona do przemieszczania materiałów, często wyposażona w teleskopowe ramię umożliwiające sięganie na większą wysokość."
      },
      {
        "q": "Jakie są zalety manipulatora teleskopowego?",
        "a": "Manipulatory teleskopowe oferują dużą elastyczność i zasięg, co czyni je idealnymi do pracy w ciasnych przestrzeniach."
      }
    ]
  },
  {
    "slug": "celni-nakladac",
    "term": "Ładowacz czołowy",
    "kategorie": "technologie",
    "shortDef": "Ładowacz czołowy to maszyna przeznaczona do załadunku i transportu materiałów.",
    "longDef": "Ładowacz czołowy to maszyna rolnicza wyposażona w łyżkę lub inne narzędzie z przodu, służące do załadunku, transportu i rozładunku materiałów. Jest szeroko stosowany w gospodarstwach do przemieszczania obornika, pasz, ziemi i innych materiałów.\n\nDzięki swojej konstrukcji ładowacz czołowy umożliwia efektywną pracę w ograniczonych przestrzeniach i jest w stanie szybko przemieszczać duże ilości materiału. Jego wszechstronność wynika z możliwości podłączenia różnych narzędzi, co czyni go niezastąpioną maszyną w gospodarstwach rolnych.\n\nŁadowacz czołowy jest powszechnie stosowany zarówno w małych, jak i dużych gospodarstwach rolnych i stanowi ważną część nowoczesnego rolnictwa, które kładzie nacisk na efektywność i produktywność.",
    "alias": [
      "ładowacz frontowy"
    ],
    "related": [
      "teleskopicky-manipulator",
      "telematika",
      "gps-rtk",
      "auto-steering"
    ],
    "faq": [
      {
        "q": "Jak używa się ładowacza czołowego?",
        "a": "Ładowacz czołowy służy do załadunku, przemieszczania i rozładunku materiałów, takich jak piasek, żwir czy ziemia."
      },
      {
        "q": "Jaka jest różnica między ładowaczem czołowym a manipulatorem teleskopowym?",
        "a": "Ładowacz czołowy przeznaczony jest przede wszystkim do załadunku materiału z przodu, natomiast manipulator teleskopowy posiada wysuwane ramię do pracy na wysokości."
      }
    ]
  },
  {
    "slug": "rozmetadlo-hnojiv",
    "term": "Rozsiewacz nawozów mineralnych",
    "kategorie": "technologie",
    "shortDef": "Rozsiewacz nawozów mineralnych to maszyna przeznaczona do równomiernego rozsiewania nawozów na polu.",
    "longDef": "Rozsiewacz nawozów mineralnych to maszyna rolnicza służąca do aplikacji nawozów mineralnych na pola. Jest zaprojektowany tak, aby zapewnić równomierne rozmieszczenie nawozu na powierzchni gleby, co ma kluczowe znaczenie dla optymalizacji wzrostu roślin uprawnych.\n\nMaszyna ta jest wyposażona w mechanizm umożliwiający precyzyjne dozowanie i rozsiewanie nawozu, co minimalizuje straty i zwiększa efektywność nawożenia. Rozsiewacz nadaje się do różnych typów nawozów, w tym do form granulowanych i sypkich.\n\nRozsiewacz nawozów mineralnych jest powszechnie stosowany w nowoczesnym rolnictwie, które kładzie nacisk na efektywne wykorzystanie środków produkcji i zrównoważoność produkcji.",
    "alias": [
      "rozsiewacz nawozów"
    ],
    "related": [
      "cisterna-na-kejdu",
      "npk-hnojivo",
      "mocovina",
      "adjuvant"
    ],
    "faq": [
      {
        "q": "Jak działa rozsiewacz nawozów mineralnych?",
        "a": "Rozsiewacz nawozów mineralnych równomiernie rozsypuje nawozy po polu za pomocą wirujących talerzy lub ramion rozsiewających."
      },
      {
        "q": "Dlaczego ważna jest równomierna aplikacja nawozów?",
        "a": "Równomierna aplikacja nawozów zapewnia optymalny wzrost roślin uprawnych i minimalizuje straty składników odżywczych."
      }
    ]
  },
  {
    "slug": "cisterna-na-kejdu",
    "term": "Wóz asenizacyjny do gnojowicy (aplikator)",
    "kategorie": "technologie",
    "shortDef": "Wóz asenizacyjny do gnojowicy to maszyna przeznaczona do transportu i aplikacji gnojowicy na pola.",
    "longDef": "Wóz asenizacyjny do gnojowicy, znany również jako aplikator gnojowicy, to maszyna rolnicza używana do transportu i stosowania gnojowicy na pola. Gnojowica jest płynnym nawozem organicznym uzyskiwanym jako produkt uboczny produkcji zwierzęcej i jest bogata w składniki odżywcze.\n\nWóz jest wyposażony w system precyzyjnej aplikacji gnojowicy, co umożliwia efektywne wykorzystanie składników odżywczych i minimalizację strat. Aplikacja gnojowicy jest ważna dla poprawy żyzności gleby i wspierania wzrostu roślin uprawnych.\n\nWozy do gnojowicy stosuje się przede wszystkim w gospodarstwach z intensywną produkcją zwierzęcą, gdzie konieczne jest efektywne wykorzystanie dostępnego nawozu organicznego i zapewnienie zrównoważonej gospodarki glebą.",
    "alias": [
      "aplikator gnojowicy"
    ],
    "related": [
      "rozmetadlo-hnojiv",
      "digestat",
      "organicka-hmota",
      "strniste"
    ],
    "faq": [
      {
        "q": "Do czego służy wóz asenizacyjny do gnojowicy?",
        "a": "Wóz asenizacyjny do gnojowicy służy do transportu i aplikacji gnojowicy na pola jako nawóz organiczny."
      },
      {
        "q": "Jak aplikuje się gnojowicę na pola?",
        "a": "Gnojowicę aplikuje się na pola za pomocą dysz rozpryskujących lub iniekcji do gleby."
      }
    ]
  },
  {
    "slug": "svinovaci-lis",
    "term": "Prasa zwijająca (prasa do bel)",
    "kategorie": "technologie",
    "shortDef": "Prasa zwijająca to maszyna rolnicza przeznaczona do prasowania i pakowania pasz w okrągłe bele.",
    "longDef": "Prasa zwijająca, znana również jako prasa do bel, to maszyna rolnicza używana do prasowania pasz, takich jak siano lub słoma, w kompaktowe okrągłe bele. Bele te są łatwe do przechowywania i transportu, co poprawia efektywność obsługi paszy.\n\nMaszyna zbiera paszę z pola i za pomocą obracających się rolek zagęszcza ją w zwartą belę, która jest następnie owijana siatką lub folią. Proces ten pomaga chronić paszę przed wilgocią i utratą składników odżywczych.\n\nPrasy zwijające stosuje się przede wszystkim na obszarach z intensywnym chowem bydła, gdzie konieczne jest efektywne przetwarzanie dużych ilości paszy na potrzeby żywienia zwierząt.",
    "alias": [
      "prasa do bel",
      "owijarka"
    ],
    "related": [
      "teleskopicky-manipulator",
      "cisterna-na-kejdu",
      "rozmetadlo-hnojiv",
      "hloubkove-kypreni"
    ],
    "faq": [
      {
        "q": "Jak działa prasa zwijająca?",
        "a": "Prasa zwijająca zbiera paszę z pola, zagęszcza ją w cylindryczną belę i owija belę siatką lub folią."
      },
      {
        "q": "Do czego służy prasa zwijająca?",
        "a": "Służy do efektywnego pakowania paszy do przechowywania i późniejszego wykorzystania jako karma."
      },
      {
        "q": "Jaka jest różnica między prasą zwijającą a prasą do prostokątnych bel?",
        "a": "Prasa zwijająca tworzy okrągłe bele, natomiast prasa do prostokątnych bel produkuje bele o kształcie prostopadłościanu."
      }
    ]
  },
  {
    "slug": "samochodna-rezacka",
    "term": "Sieczkarnia samojezdna",
    "kategorie": "technologie",
    "shortDef": "Sieczkarnia samojezdna to maszyna przeznaczona do zbioru i siekania pasz na kiszonkę.",
    "longDef": "Sieczkarnia samojezdna to maszyna rolnicza, która zbiera i sieka paszę, na przykład kukurydzę lub trawy, na kiszonkę. Jest wyposażona we własny napęd i zazwyczaj zawiera mechanizm tnący i rozdrabniający, który zapewnia drobne posiekanie materiału.\n\nSieczkarnia jest kluczowa do produkcji wysokiej jakości kiszonki, będącej ważnym produktem paszowym dla bydła. Proces zbioru i siekania jest szybki i efektywny, co minimalizuje straty składników odżywczych podczas żniw.\n\nSieczkarnie samojezdne są często wykorzystywane w połączeniu z innymi maszynami zbiorczymi i technikami w celu optymalizacji produkcji pasz w hodowli zwierząt.",
    "alias": [
      "sieczkarnia",
      "sieczkarnia zbierająca"
    ],
    "related": [
      "svinovaci-lis",
      "rozmetadlo-hnojiv",
      "cisterna-na-kejdu",
      "hloubkove-kypreni"
    ],
    "faq": [
      {
        "q": "Jak działa sieczkarnia samojezdna?",
        "a": "Sieczkarnia samojezdna zbiera paszę i jednocześnie sieka ją na drobne kawałki do zakiszania."
      },
      {
        "q": "Do czego służy sieczkarnia samojezdna?",
        "a": "Służy do efektywnego zbioru i przygotowania pasz do produkcji kiszonki."
      },
      {
        "q": "Jaka jest różnica między sieczkarną samojezdną a ciągniętą?",
        "a": "Sieczkarnia samojezdna posiada własny napęd, natomiast ciągnięta jest podłączona do ciągnika."
      }
    ]
  },
  {
    "slug": "pneumaticky-seci-stroj",
    "term": "Pneumatyczna siewnik",
    "kategorie": "technologie",
    "shortDef": "Pneumatyczny siewnik to urządzenie do precyzyjnego wysiewu nasion za pomocą strumienia powietrza.",
    "longDef": "Pneumatyczny siewnik to urządzenie rolnicze, które wykorzystuje przepływ powietrza do precyzyjnego umieszczania nasion w glebie. Technologia ta umożliwia równomierne rozmieszczenie nasion na polu, co poprawia kiełkowanie i ułatwia późniejszą pielęgnację roślin uprawnych.\n\nMaszyna jest wyposażona w system dysz i przewodów, które transportują nasiona z zasobnika do łoża siewnego. System ten jest sterowany elektronicznie, co umożliwia ustawienie różnych parametrów siewu stosownie do potrzeb konkretnej rośliny uprawnej.\n\nPneumatyczne siewniki są cenione za swoją efektywność i precyzję, szczególnie przy siewie roślin o wysokiej wartości, takich jak kukurydza czy rzepak.",
    "alias": [
      "pneumatyczny siewnik",
      "siewnik"
    ],
    "related": [
      "radlickovy-kypric",
      "hloubkove-kypreni",
      "predsetova-priprava",
      "osevni-postup"
    ],
    "faq": [
      {
        "q": "Jak działa pneumatyczny siewnik?",
        "a": "Pneumatyczny siewnik wykorzystuje przepływ powietrza do precyzyjnego umieszczania nasion w glebie."
      },
      {
        "q": "Do czego służy pneumatyczny siewnik?",
        "a": "Służy do precyzyjnego wysiewu nasion różnych roślin uprawnych, co zwiększa efektywność siewu."
      },
      {
        "q": "Jaka jest różnica między pneumatycznym a mechanicznym siewnikiem?",
        "a": "Pneumatyczny siewnik używa powietrza, natomiast mechaniczny wykorzystuje ruchy mechaniczne do siewu."
      }
    ]
  },
  {
    "slug": "plecka",
    "term": "Pielnik (uprawa międzyrzędowa)",
    "kategorie": "technologie",
    "shortDef": "Pielnik to narzędzie rolnicze stosowane do międzyrzędowej uprawy gleby.",
    "longDef": "Pielnik, znany również jako międzyrzędowy kultywator, to narzędzie stosowane do uprawy gleby między rzędami roślin uprawnych. Proces ten pomaga usuwać chwasty, poprawia napowietrzenie gleby i wspiera zdrowy wzrost roślin.\n\nPielniki mogą być mechaniczne lub zautomatyzowane i często są wyposażone w różne typy redlic lub kółek, które umożliwiają dostosowanie do różnych typów gleb i roślin uprawnych.\n\nPielniki są powszechnie stosowane w różnych typach rolnictwa, od małych gospodarstw po duże przedsiębiorstwa komercyjne, i są kluczowe dla utrzymania optymalnych warunków wzrostu roślin.",
    "alias": [
      "pielnik międzyrzędowy",
      "kultywator"
    ],
    "related": [
      "radlickovy-kypric",
      "hloubkove-kypreni",
      "predsetova-priprava",
      "osevni-postup"
    ],
    "faq": [
      {
        "q": "Jak działa pielnik?",
        "a": "Pielnik narusza glebę między rzędami roślin uprawnych, wspomagając napowietrzenie i zwalczanie chwastów."
      },
      {
        "q": "Do czego służy pielnik?",
        "a": "Służy do międzyrzędowej uprawy gleby i usuwania chwastów."
      },
      {
        "q": "Jaka jest różnica między pielnikiem a glebogryzarką?",
        "a": "Pielnik przeznaczony jest do uprawy międzyrzędowej, natomiast glebogryzarka uprawia całą powierzchnię gleby."
      }
    ]
  },
  {
    "slug": "planetova-prevodovka",
    "term": "Przekładnia planetarna",
    "kategorie": "pohon",
    "shortDef": "Przekładnia planetarna to rodzaj mechanizmu przekładniowego wykorzystującego układ planetarny do przenoszenia momentu obrotowego.",
    "longDef": "Przekładnia planetarna to złożony układ przekładniowy, który wykorzystuje układ kół planetarnych. Mechanizm ten składa się z koła centralnego (słonecznego), kół planetarnych i zewnętrznego wieńca zębatego. Przekładnia planetarna umożliwia efektywne przenoszenie momentu obrotowego i zmianę prędkości.\n\nDzięki swojej zwartej budowie i zdolności do przenoszenia dużych momentów obrotowych ten typ przekładni jest szeroko stosowany w przemyśle motoryzacyjnym, maszynach ciężkich i sprzęcie rolniczym.\n\nPrzekładnie planetarne są często stosowane w ciągnikach i innych maszynach rolniczych, gdzie ważna jest niezawodność i efektywność przenoszenia mocy.",
    "alias": [
      "przekładnia planetarna",
      "przekładnia epicykliczna"
    ],
    "related": [
      "cvt-prevodovka",
      "powershift",
      "auto-steering",
      "common-rail"
    ],
    "externalUrl": "https://pl.wikipedia.org/wiki/Przekładnia_planetarna",
    "externalLabel": "Wikipedia: Przekładnia planetarna",
    "faq": [
      {
        "q": "Jak działa przekładnia planetarna?",
        "a": "Przekładnia planetarna przenosi moment obrotowy za pomocą układu kół zębatych obracających się wokół koła centralnego."
      },
      {
        "q": "Do czego służy przekładnia planetarna?",
        "a": "Służy do uzyskania dużego przełożenia w kompaktowej przestrzeni."
      },
      {
        "q": "Jaka jest różnica między przekładnią planetarną a zwykłą?",
        "a": "Przekładnia planetarna umożliwia zwarte przenoszenie momentu obrotowego i zmianę prędkości w mniejszej przestrzeni niż zwykła przekładnia."
      }
    ]
  },
  {
    "slug": "dvouhmotovy-setrvacnik",
    "term": "Dwumasowe koło zamachowe",
    "kategorie": "pohon",
    "shortDef": "Dwumasowe koło zamachowe to urządzenie przeznaczone do tłumienia drgań w układach napędowych.",
    "longDef": "Dwumasowe koło zamachowe (DMF) to złożony element mechaniczny, który pomaga tłumić wibracje i wstrząsy w układzie napędowym pojazdów. Składa się z dwóch mas zamachowych połączonych układem sprężynowym, który absorbuje i tłumi drgania.\n\nZastosowanie dwumasowego koła zamachowego poprawia komfort jazdy, redukuje hałas i zwiększa żywotność skrzyni biegów i innych elementów układu napędowego. Jest szczególnie ważne w pojazdach z manualną skrzynią biegów.\n\nDwumasowe koła zamachowe są powszechnie stosowane w przemyśle motoryzacyjnym, szczególnie w samochodach osobowych i lekkich pojazdach użytkowych, gdzie kładzie się nacisk na komfort i efektywność układu napędowego.",
    "alias": [
      "DMF",
      "dwumasowe koło zamachowe"
    ],
    "related": [
      "planetova-prevodovka",
      "powershift",
      "common-rail",
      "emisni-normy-stage"
    ],
    "externalUrl": "https://pl.wikipedia.org/wiki/Dwumasowe_ko%C5%82o_zamachowe",
    "externalLabel": "Wikipedia: Dwumasowe koło zamachowe",
    "faq": [
      {
        "q": "Jak działa dwumasowe koło zamachowe?",
        "a": "Dwumasowe koło zamachowe tłumi drgania silnika za pomocą dwóch niezależnych mas połączonych sprężynami."
      },
      {
        "q": "Do czego służy dwumasowe koło zamachowe?",
        "a": "Służy do tłumienia drgań i redukcji hałasu w układzie napędowym pojazdu."
      },
      {
        "q": "Jaka jest różnica między dwumasowym a klasycznym kołem zamachowym?",
        "a": "Dwumasowe koło zamachowe lepiej tłumi drgania dzięki swojej konstrukcji, natomiast klasyczne jest prostsze i tańsze."
      }
    ]
  },
  {
    "slug": "load-sensing",
    "term": "Hydraulika load-sensing",
    "kategorie": "pohon",
    "shortDef": "Hydraulika load-sensing to system automatycznie dostosowujący przepływ oleju do wymagań wydajnościowych.",
    "longDef": "Hydraulika load-sensing to technologia stosowana w układach hydraulicznych, która umożliwia automatyczne dostosowanie przepływu i ciśnienia oleju do bieżących potrzeb. System ten zapewnia efektywne wykorzystanie energii i minimalizuje straty.\n\nSystem działa poprzez pomiar ciśnienia w obiegu hydraulicznym i na tej podstawie reguluje wydajność pompy. Pozwala to na optymalizację wydajności i obniżenie zużycia paliwa, co jest szczególnie korzystne w maszynach rolniczych, gdzie warunki pracy często się zmieniają.\n\nHydraulika load-sensing jest powszechnie stosowana w nowoczesnych ciągnikach i kombajnach, gdzie przyczynia się do wyższej efektywności i obniżenia kosztów eksploatacji.",
    "alias": [
      "load sensing"
    ],
    "related": [
      "hydrostat",
      "cvt-prevodovka",
      "powershift",
      "auto-steering"
    ],
    "faq": [
      {
        "q": "Jak działa hydraulika load-sensing?",
        "a": "Hydraulika load-sensing mierzy różnicę ciśnień i dostosowuje przepływ oleju do bieżących potrzeb systemu."
      },
      {
        "q": "Jakie są zalety systemu load-sensing?",
        "a": "Zalety obejmują oszczędność energii, zmniejszenie zużycia komponentów i wyższą efektywność układu hydraulicznego."
      }
    ]
  },
  {
    "slug": "intercooler",
    "term": "Intercooler (chłodnica powietrza doładowującego)",
    "kategorie": "pohon",
    "shortDef": "Intercooler to urządzenie chłodzące sprężone powietrze między turbosprężarką a silnikiem.",
    "longDef": "Intercooler, znany również jako chłodnica powietrza doładowującego, to urządzenie stosowane w silnikach doładowanych do chłodzenia powietrza sprężonego przez turbosprężarkę lub sprężarkę. Schłodzone powietrze ma wyższą gęstość, co zwiększa efektywność spalania i moc silnika.\n\nIntercooler jest zazwyczaj umieszczony między turbosprężarką a układem dolotowym silnika. Jego główną funkcją jest obniżenie temperatury powietrza, co pomaga zapobiegać spalaniu stukowemu i wydłuża żywotność silnika.\n\nW maszynach rolniczych intercoolery są stosowane do optymalizacji mocy silników, co jest ważne dla efektywnej pracy przy dużym obciążeniu. Są standardowym elementem nowoczesnych ciągników i maszyn żniwnych.",
    "alias": [
      "chłodnica powietrza doładowującego"
    ],
    "related": [
      "vgt-turbo",
      "cvt-prevodovka",
      "common-rail",
      "emisni-normy-stage"
    ],
    "faq": [
      {
        "q": "Do czego służy intercooler?",
        "a": "Intercooler służy do chłodzenia sprężonego powietrza z turbosprężarki, co zwiększa efektywność silnika."
      },
      {
        "q": "Jaka jest różnica między intercooler powietrznym a wodnym?",
        "a": "Intercooler powietrzny wykorzystuje otaczające powietrze do chłodzenia, natomiast wodny używa cieczy chłodzącej."
      }
    ]
  },
  {
    "slug": "vgt-turbo",
    "term": "Turbosprężarka ze zmienną geometrią (VGT)",
    "kategorie": "pohon",
    "shortDef": "Turbosprężarka ze zmienną geometrią umożliwia optymalizację wydajności turbosprężarki w szerokim zakresie obrotów silnika.",
    "longDef": "Turbosprężarka ze zmienną geometrią (VGT) to technologia stosowana w turbosprężarkach, która umożliwia zmianę kąta łopatek turbiny w zależności od obrotów silnika. Dzięki temu optymalizuje się ciśnienie i przepływ powietrza, co poprawia wydajność i efektywność silnika.\n\nVGT zapewnia lepszą responsywność silnika przy niskich obrotach i wyższą moc przy wysokich obrotach. Technologia ta jest szczególnie przydatna w maszynach rolniczych, gdzie konieczna jest szybka reakcja na zmiany obciążenia.\n\nVGT jest powszechnie stosowana w nowoczesnych ciągnikach i maszynach żniwnych, gdzie przyczynia się do efektywnego wykorzystania paliwa i obniżenia emisji spalin.",
    "alias": [
      "VGT",
      "zmiennogeometryczna turbosprężarka"
    ],
    "related": [
      "intercooler",
      "common-rail",
      "emisni-normy-stage",
      "auto-steering"
    ],
    "faq": [
      {
        "q": "Jak działa turbosprężarka ze zmienną geometrią?",
        "a": "Turbosprężarka VGT zmienia kąt łopatek w turbinie, aby zoptymalizować przepływ spalin."
      },
      {
        "q": "Jakie są zalety VGT w porównaniu z tradycyjną turbosprężarką?",
        "a": "VGT oferuje lepszą responsywność silnika i wyższą efektywność w szerokim zakresie obrotów."
      }
    ]
  },
  {
    "slug": "posilovac-rizeni",
    "term": "Hydrauliczne wspomaganie układu kierowniczego",
    "kategorie": "pohon",
    "shortDef": "Hydrauliczne wspomaganie układu kierowniczego ułatwia sterowanie pojazdami poprzez zmniejszenie siły potrzebnej do obrotu kierownicą.",
    "longDef": "Hydrauliczne wspomaganie układu kierowniczego to system wykorzystujący ciśnienie hydrauliczne do ułatwienia kierowania pojazdami. System ten zmniejsza wysiłek fizyczny potrzebny do obrotu kierownicą, co jest szczególnie przydatne w ciężkich maszynach rolniczych.\n\nDziała tak, że pompa hydrauliczna napędzana silnikiem wytwarza ciśnienie, które pomaga obracać kierownicą. Pozwala to na łatwiejsze manewrowanie i zwiększa komfort operatora.\n\nHydrauliczne wspomaganie układu kierowniczego jest standardowym wyposażeniem większości nowoczesnych ciągników i maszyn rolniczych, co przyczynia się do efektywności i bezpieczeństwa pracy w polu.",
    "alias": [
      "wspomaganie kierownicy"
    ],
    "related": [
      "load-sensing",
      "cvt-prevodovka",
      "auto-steering",
      "teleskopicky-manipulator"
    ],
    "faq": [
      {
        "q": "Jak działa hydrauliczne wspomaganie układu kierowniczego?",
        "a": "Hydrauliczne wspomaganie kierownicy wykorzystuje ciśnienie oleju do ułatwienia obrotu kierownicą."
      },
      {
        "q": "Jakie są zalety hydraulicznego wspomagania układu kierowniczego?",
        "a": "Zalety obejmują zmniejszenie wysiłku fizycznego kierowcy i lepszą sterowność pojazdu."
      }
    ]
  },
  {
    "slug": "predni-vyvodovy-hridel",
    "term": "Przedni wał odbioru mocy",
    "kategorie": "pohon",
    "shortDef": "Przedni wał odbioru mocy to urządzenie umożliwiające przenoszenie mocy z ciągnika na przednie przystawki.",
    "longDef": "Przedni wał odbioru mocy (WOM) to element mechaniczny ciągnika, który umożliwia przenoszenie mocy na przednie przystawki, takie jak kosiarki lub frezarki śniegowe. Wał ten zwiększa wszechstronność ciągnika i umożliwia efektywne wykorzystanie różnych narzędzi.\n\nPrzedni WOM jest zazwyczaj napędzany silnikiem ciągnika i może być włączany i wyłączany w zależności od potrzeb. Pozwala to na elastyczne stosowanie różnych narzędzi bez konieczności zmiany podstawowej konfiguracji ciągnika.\n\nPrzedni wał odbioru mocy jest powszechnie stosowany w rolnictwie i usługach komunalnych, gdzie przyczynia się do efektywności i produktywności pracy.",
    "alias": [
      "przedni WOM"
    ],
    "related": [
      "load-sensing",
      "teleskopicky-manipulator",
      "celni-nakladac",
      "auto-steering"
    ],
    "faq": [
      {
        "q": "Do czego służy przedni wał odbioru mocy?",
        "a": "Przedni wał odbioru mocy przenosi moc z ciągnika na przednie przystawki, takie jak kosiarki lub frezarki śniegowe."
      },
      {
        "q": "Jaka jest różnica między przednim a tylnym wałem odbioru mocy?",
        "a": "Przedni wał odbioru mocy znajduje się z przodu ciągnika, natomiast tylny z tyłu. Moc obu wałów zależy od konstrukcji ciągnika."
      }
    ]
  },
  {
    "slug": "smykovani",
    "term": "Poślizg",
    "kategorie": "agrotechnika",
    "shortDef": "Poślizg to zjawisko, gdy koła lub gąsienice ciągnika tracą przyczepność do powierzchni gleby.",
    "longDef": "Poślizg to zjawisko, które występuje, gdy koła lub gąsienice ciągnika tracą przyczepność do powierzchni gleby, co prowadzi do nieefektywnego przenoszenia siły i zwiększonego zużycia paliwa. Zjawisko to jest powszechne na mokrej lub luźnej glebie.\n\nPoślizg można mierzyć i kontrolować za pomocą różnych technik, takich jak regulacja ciśnienia w oponach lub stosowanie obciążników. Właściwe zarządzanie poślizgiem jest kluczowe dla minimalizacji zużycia opon i zwiększenia efektywności pracy.\n\nPoślizg jest monitorowany szczególnie w kontekście optymalizacji operacji rolniczych, gdzie może mieć istotny wpływ na produktywność i koszty operacyjne.",
    "alias": [
      "poślizg kół"
    ],
    "related": [
      "load-sensing",
      "auto-steering",
      "hloubkove-kypreni",
      "predsetova-priprava"
    ],
    "faq": [
      {
        "q": "Co to jest poślizg ciągnika?",
        "a": "Poślizg to zjawisko, gdy koła lub gąsienice ciągnika tracą przyczepność do powierzchni gleby, co może obniżać efektywność pracy."
      },
      {
        "q": "Jak można minimalizować poślizg?",
        "a": "Poślizg można minimalizować poprzez właściwe ciśnienie w oponach i stosowanie odpowiedniego typu opon lub gąsienic."
      }
    ]
  },
  {
    "slug": "valeni",
    "term": "Wałowanie",
    "kategorie": "agrotechnika",
    "shortDef": "Wałowanie to zabieg agrotechniczny zapewniający zagęszczenie powierzchni gleby po siewie.",
    "longDef": "Wałowanie to proces, w którym za pomocą wałów zagęszcza się powierzchnię gleby. Zabieg ten wykonywany jest po siewie, aby zapewnić lepszy kontakt nasion z glebą i pobudzić kiełkowanie. Wałowanie pomaga również wyrównać powierzchnię gleby i poprawić kapilarność, co ułatwia dostęp wody do nasion.\n\nW praktyce stosuje się różne typy wałów, w tym gładkie, palcowe lub pierścieniowe, w zależności od rodzaju gleby i roślin uprawnych. Wałowanie jest szczególnie ważne na lekkich i piaszczystych glebach, gdzie pomaga zapobiegać utracie wilgotności.\n\nWałowanie jest powszechnym elementem zabiegów agrotechnicznych, szczególnie przy uprawie zbóż i innych roślin wymagających równomiernej powierzchni gleby do optymalnego wzrostu.",
    "related": [
      "predsetova-priprava",
      "setove-luzko",
      "utuzeni-pudy",
      "diskovy-podmitac"
    ],
    "faq": [
      {
        "q": "Do czego służy wałowanie gleby?",
        "a": "Wałowanie służy do zagęszczenia powierzchni gleby po siewie, co poprawia kontakt nasion z glebą i zapewnia równomierne wschody."
      },
      {
        "q": "Kiedy wykonuje się wałowanie gleby?",
        "a": "Wałowanie wykonuje się po siewie, kiedy konieczne jest polepszenie kontaktu nasion z glebą."
      }
    ]
  },
  {
    "slug": "vysevek",
    "term": "Norma wysiewu",
    "kategorie": "agrotechnika",
    "shortDef": "Norma wysiewu to ilość materiału siewnego użytego na jednostkę powierzchni podczas siewu.",
    "longDef": "Norma wysiewu oznacza ilość materiału siewnego, która jest wysiewana na określoną powierzchnię, zwykle wyrażoną w kilogramach na hektar. Właściwe ustalenie normy wysiewu jest kluczowe dla uzyskania optymalnej obsady roślin, a tym samym maksymalnego plonu.\n\nNorma wysiewu różni się w zależności od gatunku rośliny uprawnej, warunków glebowych i klimatycznych. Na przykład zboża mają zazwyczaj wyższą normę wysiewu niż rośliny oleiste. Na normę wysiewu wpływa również jakość materiału siewnego i jego zdolność kiełkowania.\n\nZalecane normy wysiewu różnią się w zależności od regionu i typu gleby, a rolnicy często korzystają z zaleceń doradców agronomicznych lub wyników doświadczeń ze stacji badawczych.",
    "related": [
      "setove-luzko",
      "predsetova-priprava",
      "pneumaticky-seci-stroj",
      "osevni-postup"
    ],
    "faq": [
      {
        "q": "Jak oblicza się normę wysiewu?",
        "a": "Normę wysiewu oblicza się jako ilość materiału siewnego potrzebną na jednostkę powierzchni, zwykle w kg/ha."
      },
      {
        "q": "Dlaczego ważna jest właściwa norma wysiewu?",
        "a": "Właściwa norma wysiewu zapewnia optymalną obsadę roślin, co wpływa na plon i jakość zbiorów."
      }
    ]
  },
  {
    "slug": "hloubkove-kypreni",
    "term": "Głęboszowanie (spulchnianie podglebowe)",
    "kategorie": "agrotechnika",
    "shortDef": "Głęboszowanie to zabieg agrotechniczny mający na celu poprawę struktury gleby i jej napowietrzenie.",
    "longDef": "Głęboszowanie, znane również jako spulchnianie podglebowe, to proces, w którym gleba jest spulchniana na większą głębokość bez jej odwracania. Zabieg ten poprawia napowietrzenie gleby, jej odwodnienie i sprzyja rozwojowi systemu korzeniowego roślin uprawnych.\n\nGłęboszowanie wykonywane jest specjalnymi maszynami, które naruszają zagęszczone warstwy gleby, co jest szczególnie ważne na glebach ciężkich lub w obszarach o wysokim ryzyku zagęszczenia. Poprawa struktury gleby prowadzi do lepszej infiltracji wody i ograniczenia erozji.\n\nGłęboszowanie jest stosowane szczególnie na obszarach z intensywnym rolnictwem, gdzie konieczna jest poprawa właściwości fizycznych gleby i wspieranie zrównoważonej produkcji.",
    "related": [
      "predsetova-priprava",
      "utuzeni-pudy",
      "orba",
      "diskovy-podmitac"
    ],
    "faq": [
      {
        "q": "Do czego służy głęboszowanie?",
        "a": "Głęboszowanie poprawia strukturę gleby i jej napowietrzenie, co wspiera wzrost korzeni."
      },
      {
        "q": "Jaka jest różnica między głęboszowaniem a orką?",
        "a": "Głęboszowanie napowietrza glebę bez jej odwracania, natomiast orka glebę odwraca."
      }
    ]
  },
  {
    "slug": "predsetova-priprava",
    "term": "Przedsiewna uprawa gleby",
    "kategorie": "agrotechnika",
    "shortDef": "Przedsiewna uprawa gleby to zestaw zabiegów mających na celu przygotowanie gleby przed siewem.",
    "longDef": "Przedsiewna uprawa gleby obejmuje różne zabiegi agrotechniczne przygotowujące glebę do siewu roślin uprawnych. Celem jest stworzenie optymalnych warunków do kiełkowania nasion i wzrostu młodych roślin.\n\nProces ten może obejmować spulchnianie, wyrównanie powierzchni, usuwanie chwastów i zapewnienie właściwej struktury gleby. Stosuje się różne narzędzia i maszyny, takie jak pługi, agregaty i wały.\n\nPrzedsiewna uprawa gleby jest kluczowym elementem praktyk rolniczych, a jej konkretna forma różni się w zależności od rodzaju rośliny uprawnej, warunków glebowych i klimatycznych.",
    "related": [
      "setove-luzko",
      "valeni",
      "diskovy-podmitac",
      "hloubkove-kypreni"
    ],
    "faq": [
      {
        "q": "Co obejmuje przedsiewna uprawa gleby?",
        "a": "Przedsiewna uprawa gleby obejmuje zabiegi takie jak orka, bronowanie i wałowanie w celu stworzenia optymalnego łoża siewnego."
      },
      {
        "q": "Dlaczego ważna jest przedsiewna uprawa gleby?",
        "a": "Zapewnia właściwą strukturę gleby do kiełkowania i wzrostu nasion."
      }
    ]
  },
  {
    "slug": "setove-luzko",
    "term": "Łoże siewne",
    "kategorie": "agrotechnika",
    "shortDef": "Łoże siewne to przygotowana powierzchnia gleby, na którą wysiewane są nasiona.",
    "longDef": "Łoże siewne to specjalnie przygotowana warstwa gleby zapewniająca optymalne warunki do kiełkowania i wzrostu nasion. Jego jakość jest kluczowa dla uzyskania równomiernych i szybkich wschodów roślin uprawnych.\n\nPrzygotowanie łoża siewnego obejmuje wyrównanie powierzchni, usunięcie grudek i zapewnienie właściwej struktury gleby. Ważna jest również kontrola wilgotności i temperatury gleby, które wpływają na zdolność kiełkowania.\n\nPrzygotowanie łoża siewnego jest standardową praktyką w rolnictwie, przy czym stosuje się różne techniki i narzędzia w zależności od rodzaju rośliny uprawnej i warunków glebowych.",
    "related": [
      "predsetova-priprava",
      "valeni",
      "utuzeni-pudy",
      "vysevek"
    ],
    "faq": [
      {
        "q": "Jak przygotowuje się łoże siewne?",
        "a": "Łoże siewne przygotowuje się za pomocą zabiegów takich jak orka, bronowanie i wałowanie, aby było równomierne i dobrze zagęszczone."
      },
      {
        "q": "Dlaczego ważne jest łoże siewne?",
        "a": "Zapewnia optymalne warunki do kiełkowania nasion i wzrostu roślin."
      }
    ]
  },
  {
    "slug": "kapilarita-pudy",
    "term": "Kapilarność gleby",
    "kategorie": "agrotechnika",
    "shortDef": "Kapilarność gleby to zdolność gleby do transportu wody w drobnych porach wbrew grawitacji.",
    "longDef": "Kapilarność gleby dotyczy zdolności gleby do transportowania wody w drobnych porach i kapilarach. Zjawisko to jest ważne dla zapewnienia dostępności wody dla roślin, szczególnie w okresie suszy.\n\nKapilarność zależy od struktury gleby, wielkości i rozkładu porowatości. Gleby drobnoziarniste, takie jak gliniaste, mają wyższą kapilarność niż gruboziarniste, takie jak piaszczyste.\n\nKapilarność gleby jest ważnym czynnikiem przy planowaniu nawadniania i gospodarowania wodą, szczególnie na obszarach o nieregularnych opadach.",
    "related": [
      "utuzeni-pudy",
      "orba",
      "predsetova-priprava",
      "valeni"
    ],
    "faq": [
      {
        "q": "Czym jest kapilarność gleby?",
        "a": "Kapilarność gleby to zdolność gleby do transportu wody w drobnych porach wbrew grawitacji."
      },
      {
        "q": "Jak kapilarność wpływa na rolnictwo?",
        "a": "Kapilarność wpływa na dostępność wody dla roślin, a tym samym na ich wzrost."
      }
    ]
  },
  {
    "slug": "mineralizace-pudy",
    "term": "Mineralizacja materii organicznej",
    "kategorie": "agrotechnika",
    "shortDef": "Mineralizacja materii organicznej to proces przekształcania substancji organicznych w formy nieorganiczne.",
    "longDef": "Mineralizacja materii organicznej to biologiczny proces, w którym mikroorganizmy rozkładają substancje organiczne w glebie do postaci nieorganicznych, takich jak dwutlenek węgla, woda i składniki mineralne. Proces ten jest kluczowy dla uwalniania składników odżywczych niezbędnych do wzrostu roślin.\n\nW rolnictwie mineralizacja jest ważna dla utrzymania żyzności gleby i zapewnienia dostępności składników odżywczych dla roślin uprawnych. Szybkość mineralizacji zależy od takich czynników jak temperatura, wilgotność i rodzaj gleby.\n\nMineralizacja jest monitorowana jako część oceny żyzności gleby, szczególnie w związku ze stosowaniem nawozów organicznych i kompostów.",
    "alias": [
      "mineralizacja gleby"
    ],
    "related": [
      "kapilarita-pudy",
      "organicka-hmota",
      "eroze-pudy",
      "orba"
    ],
    "faq": [
      {
        "q": "Czym jest mineralizacja gleby?",
        "a": "Mineralizacja gleby to proces, w którym substancje organiczne rozkładają się do form nieorganicznych, takich jak składniki mineralne."
      },
      {
        "q": "Jak przebiega mineralizacja materii organicznej?",
        "a": "Mineralizacja zachodzi przy udziale mikroorganizmów, które rozkładają substancje organiczne w glebie."
      },
      {
        "q": "Dlaczego mineralizacja jest ważna?",
        "a": "Mineralizacja jest kluczowa dla uwalniania składników odżywczych niezbędnych do wzrostu roślin."
      }
    ]
  },
  {
    "slug": "utuzeni-pudy",
    "term": "Zagęszczenie gleby",
    "kategorie": "agrotechnika",
    "shortDef": "Zagęszczenie gleby to proces ubicia struktury glebowej pod wpływem obciążenia mechanicznego.",
    "longDef": "Zagęszczenie gleby, zwane również kompakcją, to proces, w którym dochodzi do ubicia struktury glebowej pod wpływem obciążenia mechanicznego, np. przez ciężkie maszyny lub intensywny ruch zwierząt. Proces ten zmniejsza porowatość gleby i ogranicza przenikanie wody i powietrza.\n\nW rolnictwie zagęszczenie gleby może negatywnie wpływać na wzrost roślin, ponieważ ogranicza dostępność tlenu dla korzeni i utrudnia odwodnienie. Zapobieganie obejmuje stosowanie lżejszego sprzętu i właściwe planowanie ruchu po polu.\n\nProblematyka zagęszczenia gleby jest rozwiązywana w ramach zrównoważonych praktyk rolniczych, które obejmują minimalizację przejazdów po polu i stosowanie nowoczesnych technologii.",
    "alias": [
      "kompakcja gleby"
    ],
    "related": [
      "orba",
      "predsetova-priprava",
      "hloubkove-kypreni",
      "ekoschemata"
    ],
    "faq": [
      {
        "q": "Co powoduje zagęszczenie gleby?",
        "a": "Zagęszczenie gleby powodowane jest obciążeniem mechanicznym, np. przez ciężkie maszyny lub nadmierny ruch pojazdów."
      },
      {
        "q": "Jakie są skutki zagęszczenia gleby?",
        "a": "Zagęszczenie gleby zmniejsza jej przepuszczalność dla wody i powietrza, co może negatywnie wpływać na wzrost roślin."
      },
      {
        "q": "Jak można zapobiegać zagęszczeniu gleby?",
        "a": "Zagęszczeniu można zapobiegać poprzez ograniczenie stosowania ciężkich maszyn i stosowanie właściwych praktyk agrotechnicznych."
      }
    ]
  },
  {
    "slug": "zelene-hnojeni",
    "term": "Zielony nawóz (nawożenie zielone)",
    "kategorie": "agrotechnika",
    "shortDef": "Nawożenie zielone to metoda agrotechniczna polegająca na stosowaniu roślin do wzbogacania gleby w materię organiczną i składniki odżywcze.",
    "longDef": "Nawożenie zielone to metoda, w której uprawia się określone rośliny, które następnie są przyorywane do gleby w celu poprawy jej struktury i wzbogacenia w materię organiczną i składniki odżywcze. Do powszechnie stosowanych roślin należą facelia, koniczyna i łubin.\n\nMetoda ta zwiększa zawartość materii organicznej w glebie, poprawia jej strukturę i zwiększa aktywność biologiczną. Nawożenie zielone pomaga również w walce z erozją i poprawia zdolność gleby do zatrzymywania wody.\n\nNawożenie zielone jest częścią zrównoważonych praktyk rolniczych i jest wspierane w ramach programów ekologicznych i dopłat.",
    "alias": [
      "nawozy zielone"
    ],
    "related": [
      "organicka-hmota",
      "eroze-pudy",
      "osevni-postup",
      "ekoschemata"
    ],
    "faq": [
      {
        "q": "Czym jest nawożenie zielone?",
        "a": "Nawożenie zielone to metoda, w której uprawia się rośliny, które następnie są przyorywane do gleby w celu poprawy jej jakości."
      },
      {
        "q": "Jakie rośliny stosuje się do nawożenia zielonego?",
        "a": "Do nawożenia zielonego często stosuje się rośliny takie jak łubin, lucerna lub gorczyca."
      },
      {
        "q": "Jakie są zalety nawożenia zielonego?",
        "a": "Nawożenie zielone zwiększa zawartość materii organicznej w glebie i poprawia jej strukturę."
      }
    ]
  },
  {
    "slug": "strniste",
    "term": "Ściernisko",
    "kategorie": "agrotechnika",
    "shortDef": "Ściernisko to pozostałość łodyg i korzeni roślin uprawnych po zbiorach.",
    "longDef": "Ściernisko to część roślin, która pozostaje na polu po zbiorach roślin uprawnych. Zwykle obejmuje łodygi, korzenie i niekiedy małe fragmenty liści. Ściernisko może służyć jako ochrona gleby przed erozją i pomaga utrzymać wilgotność.\n\nW rolnictwie ściernisko jest często wykorzystywane jako mulcz lub jest przyorywane do gleby, co zwiększa zawartość materii organicznej i poprawia strukturę gleby. Ściernisko zapewnia również schronienie dla drobnych zwierząt i wspiera różnorodność biologiczną.\n\nZachowanie ścierniska na polu jest często częścią zrównoważonych praktyk rolniczych i jest wspierane w ramach różnych programów agrotechnicznych.",
    "related": [
      "orba",
      "mulcovac",
      "kapilarita-pudy",
      "predsetova-priprava"
    ],
    "faq": [
      {
        "q": "Czym jest ściernisko?",
        "a": "Ściernisko to pozostałość łodyg i korzeni roślin uprawnych, które pozostają na polu po zbiorach."
      },
      {
        "q": "Jak wykorzystuje się ściernisko?",
        "a": "Ściernisko może być przyorywane w celu poprawy struktury gleby i zwiększenia zawartości materii organicznej."
      },
      {
        "q": "Dlaczego ważne jest pozostawienie ścierniska na polu?",
        "a": "Pozostawienie ścierniska pomaga chronić glebę przed erozją i poprawia jej żyzność."
      }
    ]
  },
  {
    "slug": "superfosfat",
    "term": "Superfosfat",
    "kategorie": "hnojivo",
    "shortDef": "Superfosfat to nawóz fosforowy wytwarzany z fosforytów i kwasu siarkowego.",
    "longDef": "Superfosfat to nawóz mineralny zawierający fosfor, wytwarzany w reakcji fosforytów z kwasem siarkowym. Zawiera rozpuszczalny fosforan wapnia, który jest łatwo dostępny dla roślin.\n\nStosuje się go w celu zapewnienia odpowiedniej podaży fosforu dla roślin uprawnych, który jest kluczowym pierwiastkiem dla ich wzrostu i rozwoju. Aplikacja superfosfatu zwiększa plony i poprawia jakość roślin uprawnych.\n\nSuperfosfat jest powszechnie stosowanym nawozem, aplikowanym szczególnie na glebach z niską zawartością fosforu. Jest częścią zintegrowanych planów nawożenia.",
    "related": [
      "npk-hnojivo",
      "organicka-hmota",
      "rozmetadlo-hnojiv",
      "pH-pudy"
    ],
    "externalUrl": "https://pl.wikipedia.org/wiki/Superfosfat",
    "externalLabel": "Wikipedia: Superfosfat",
    "faq": [
      {
        "q": "Czym jest superfosfat?",
        "a": "Superfosfat to nawóz fosforowy wytwarzany z fosforytów i kwasu siarkowego."
      },
      {
        "q": "Jak stosuje się superfosfat?",
        "a": "Superfosfat aplikuje się do gleby w celu zwiększenia zawartości fosforu, który jest kluczowy dla wzrostu roślin."
      },
      {
        "q": "Jakie są zalety stosowania superfosfatu?",
        "a": "Superfosfat poprawia wzrost korzeni i ogólną witalność roślin."
      }
    ]
  },
  {
    "slug": "draselna-sul",
    "term": "Sól potasowa (KCl)",
    "kategorie": "hnojivo",
    "shortDef": "Sól potasowa to nawóz mineralny zawierający potas w postaci chlorku potasu.",
    "longDef": "Sól potasowa, znana również jako chlorek potasu (KCl), to nawóz mineralny stosowany do dostarczania potasu niezbędnego do wzrostu roślin, poprawy odporności na stres i zwiększenia plonów.\n\nAplikacja soli potasowej pomaga poprawić jakość roślin uprawnych, wspiera fotosyntezę i zwiększa odporność roślin na choroby i niekorzystne warunki. Potas jest kluczowy dla regulacji gospodarki wodnej roślin.\n\nSól potasowa jest szeroko stosowana jako część planów nawożenia, szczególnie na glebach z niską zawartością potasu. Jest aplikowana przed siewem lub w trakcie wegetacji.",
    "alias": [
      "chlorek potasu"
    ],
    "related": [
      "npk-hnojivo",
      "rozmetadlo-hnojiv",
      "pH-pudy",
      "organicka-hmota"
    ],
    "externalUrl": "https://pl.wikipedia.org/wiki/Chlorek_potasu",
    "externalLabel": "Wikipedia: Chlorek potasu",
    "faq": [
      {
        "q": "Czym jest sól potasowa?",
        "a": "Sól potasowa to nawóz mineralny zawierający potas w postaci chlorku potasu."
      },
      {
        "q": "Jak stosuje się sól potasową?",
        "a": "Sól potasowa stosowana jest do dostarczania potasu do gleby, co jest niezbędne dla wzrostu i rozwoju roślin."
      },
      {
        "q": "Jakie są zalety soli potasowej?",
        "a": "Sól potasowa poprawia odporność roślin na stres i zwiększa jakość owoców."
      }
    ]
  },
  {
    "slug": "kalimagnesia",
    "term": "Kalimagnesja (Patentkali)",
    "kategorie": "hnojivo",
    "shortDef": "Kalimagnesja to nawóz mineralny zawierający potas i magnez.",
    "longDef": "Kalimagnesja, znana również jako Patentkali, to nawóz mineralny zawierający potas, magnez i siarkę. Stosuje się ją do uzupełnienia tych składników odżywczych w glebie, co jest ważne dla wzrostu roślin i plonów roślin uprawnych.\n\nPotas w kalimagnesji poprawia odporność roślin na stres, taki jak susza lub mróz, i wspiera tworzenie cukrów i skrobi. Magnez jest kluczowy dla fotosyntezy, ponieważ jest składnikiem cząsteczki chlorofilu.\n\nKalimagnesja jest stosowana szczególnie na obszarach z niedoborem tych pierwiastków w glebie. Aplikacja wykonywana jest przed siewem lub w trakcie okresu wegetacji.",
    "alias": [
      "Patentkali"
    ],
    "related": [
      "superfosfat",
      "draselna-sul",
      "dolomiticky-vapenec",
      "npk-hnojivo"
    ],
    "externalUrl": "https://pl.wikipedia.org/wiki/Kalimagnesja",
    "externalLabel": "Wikipedia: Kalimagnesja",
    "faq": [
      {
        "q": "Do czego służy kalimagnesja?",
        "a": "Kalimagnesja stosowana jest do dostarczania potasu i magnezu do gleby, co wspiera wzrost roślin."
      },
      {
        "q": "Jak aplikuje się kalimagnesję?",
        "a": "Aplikuje się ją przez rozsiew na powierzchnię gleby, zazwyczaj przed siewem lub sadzeniem."
      },
      {
        "q": "Jaka jest różnica między kalimagnesją a solą potasową?",
        "a": "Kalimagnesja zawiera dodatkowo magnez, natomiast sól potasowa zawiera wyłącznie potas."
      }
    ]
  },
  {
    "slug": "dolomiticky-vapenec",
    "term": "Wapień dolomityczny",
    "kategorie": "hnojivo",
    "shortDef": "Wapień dolomityczny to naturalny nawóz zawierający wapń i magnez.",
    "longDef": "Wapień dolomityczny to naturalny minerał stosowany jako nawóz w celu poprawy struktury gleby i jej pH. Zawiera wapń i magnez, które są kluczowe dla zdrowego wzrostu roślin.\n\nNawóz ten podnosi pH kwaśnych gleb, co poprawia dostępność składników odżywczych dla roślin. Magnez w wapniu dolomitycznym wspiera fotosyntezę i ogólny metabolizm roślin.\n\nWapień dolomityczny stosuje się szczególnie na glebach kwaśnych, gdzie pomaga poprawić strukturę gleby i wspierać wzrost roślin uprawnych.",
    "related": [
      "kalimagnesia",
      "superfosfat",
      "vapneni",
      "pH-pudy"
    ],
    "externalUrl": "https://pl.wikipedia.org/wiki/Dolomit",
    "externalLabel": "Wikipedia: Dolomit",
    "faq": [
      {
        "q": "Do czego stosuje się wapień dolomityczny?",
        "a": "Stosuje się go do poprawy struktury gleby i podwyższenia pH kwaśnych gleb."
      },
      {
        "q": "Jak aplikuje się wapień dolomityczny?",
        "a": "Aplikuje się przez rozsiew lub wymieszanie z glebą, zazwyczaj jesienią."
      },
      {
        "q": "Jaka jest różnica między wapieniem dolomitycznym a zwykłym wapieniem?",
        "a": "Wapień dolomityczny zawiera oprócz wapnia również magnez."
      }
    ]
  },
  {
    "slug": "digestat",
    "term": "Poferment (digestat)",
    "kategorie": "hnojivo",
    "shortDef": "Poferment to nawóz organiczny powstający jako produkt uboczny biogazowni.",
    "longDef": "Poferment to nawóz organiczny, który powstaje jako produkt uboczny procesu fermentacji beztlenowej w biogazowniach. Zawiera cenne składniki odżywcze, takie jak azot, fosfor i potas, i jest stosowany do poprawy żyzności gleby.\n\nStosuje się go jako alternatywne źródło składników odżywczych dla roślin, co może zmniejszyć zapotrzebowanie na nawozy syntetyczne. Poferment aplikuje się na pola za pomocą rozsiewaczy, cystern lub iniekcji do gleby, co jest często preferowaną metodą ze względu na ograniczenie emisji amoniaku.\n\nStosowanie pofermentu jest regulowane w celu zapobiegania nadmiernemu nawożeniu i ochrony zasobów wodnych.",
    "related": [
      "kejda",
      "hnuj",
      "organicka-hmota",
      "cisterna-na-kejdu"
    ],
    "faq": [
      {
        "q": "Do czego służy poferment?",
        "a": "Poferment służy jako nawóz organiczny bogaty w składniki odżywcze, poprawiający żyzność gleby."
      },
      {
        "q": "Jak aplikuje się poferment?",
        "a": "Aplikuje się na pola za pomocą rozsiewaczy, cystern lub iniekcji do gleby."
      },
      {
        "q": "Jaka jest różnica między pofermentem a kompostem?",
        "a": "Poferment jest ciekły i powstaje w biogazowniach, natomiast kompost jest stały i powstaje w wyniku rozkładu materiału organicznego."
      }
    ]
  },
  {
    "slug": "kejda",
    "term": "Gnojowica",
    "kategorie": "hnojivo",
    "shortDef": "Gnojowica to płynny nawóz organiczny pochodzący z hodowli zwierząt gospodarskich.",
    "longDef": "Gnojowica to płynny nawóz organiczny, który powstaje jako mieszanina odchodów zwierząt gospodarskich i wody. Zawiera ważne składniki odżywcze, takie jak azot, fosfor i potas, i jest stosowana do poprawy żyzności gleby.\n\nAplikacja gnojowicy wykonywana jest za pomocą cystern lub specjalnych rozsiewaczy, zarówno przed siewem, jak i w trakcie okresu wegetacji. Gnojowica przyczynia się do utrzymania materii organicznej w glebie i wspiera aktywność mikrobiologiczną.\n\nStosowanie gnojowicy jest regulowane w celu minimalizowania ryzyka zanieczyszczenia zasobów wodnych i zapobiegania nadmiernemu nawożeniu.",
    "related": [
      "digestat",
      "hnuj",
      "cisterna-na-kejdu",
      "organicka-hmota"
    ],
    "externalUrl": "https://pl.wikipedia.org/wiki/Gnojowica",
    "externalLabel": "Wikipedia: Gnojowica",
    "faq": [
      {
        "q": "Do czego stosuje się gnojowicę?",
        "a": "Gnojowica stosowana jest jako nawóz organiczny do poprawy żyzności gleby."
      },
      {
        "q": "Jak aplikuje się gnojowicę?",
        "a": "Aplikuje się ją za pomocą cystern z rozpryskowaczami na pola."
      },
      {
        "q": "Jaka jest różnica między gnojowicą a obornikiem?",
        "a": "Gnojowica jest ciekła, natomiast obornik jest stały i zawiera ściółkę."
      }
    ]
  },
  {
    "slug": "hnuj",
    "term": "Obornik (stajenny)",
    "kategorie": "hnojivo",
    "shortDef": "Obornik to nawóz organiczny powstający z odchodów zwierząt gospodarskich i ściółki.",
    "longDef": "Obornik to tradycyjny nawóz organiczny, który składa się z odchodów zwierząt gospodarskich wymieszanych ze ściółką, taką jak słoma. Zawiera ważne składniki odżywcze, takie jak azot, fosfor i potas, i jest kluczowy dla poprawy żyzności gleby.\n\nObornik aplikuje się na pola przed orką lub w trakcie okresu wegetacji, co przyczynia się do utrzymania materii organicznej i poprawy struktury gleby. Jego stosowanie wspiera aktywność mikrobiologiczną i długofalowo zwiększa żyzność.\n\nObornik jest nadal szeroko stosowany, szczególnie w rolnictwie ekologicznym, gdzie jest ważny dla zachowania naturalnej równowagi składników odżywczych w glebie.",
    "alias": [
      "obornik stajenny"
    ],
    "related": [
      "kejda",
      "digestat",
      "organicka-hmota",
      "orba"
    ],
    "externalUrl": "https://pl.wikipedia.org/wiki/Obornik",
    "externalLabel": "Wikipedia: Obornik",
    "faq": [
      {
        "q": "Do czego służy obornik?",
        "a": "Obornik służy jako nawóz organiczny, który poprawia strukturę i żyzność gleby."
      },
      {
        "q": "Jak aplikuje się obornik?",
        "a": "Aplikuje się przez rozsiew na pola i następnie wymieszanie z glebą."
      },
      {
        "q": "Jaka jest różnica między obornikiem a kompostem?",
        "a": "Obornik to świeży materiał organiczny, natomiast kompost jest rozłożony i ustabilizowany."
      }
    ]
  },
  {
    "slug": "kostni-moucka",
    "term": "Mączka kostna",
    "kategorie": "hnojivo",
    "shortDef": "Mączka kostna to nawóz organiczny bogaty w fosfor i wapń.",
    "longDef": "Mączka kostna to nawóz organiczny wytwarzany z rozdrobnionych kości, bogaty w fosfor i wapń. Składniki te są kluczowe dla wzrostu i rozwoju roślin, szczególnie dla tworzenia systemu korzeniowego i kwiatów.\n\nStosuje się ją głównie w ogrodnictwie i rolnictwie do wspierania wzrostu roślin o wysokim zapotrzebowaniu na fosfor. Aplikacja wykonywana jest przed siewem lub w trakcie okresu wegetacji.\n\nMączka kostna jest szczególnie popularna w rolnictwie ekologicznym, gdzie jest stosowana jako naturalne źródło fosforu bez chemicznych dodatków.",
    "related": [
      "hnuj",
      "organicka-hmota",
      "superfosfat",
      "npk-hnojivo"
    ],
    "faq": [
      {
        "q": "Do czego stosuje się mączkę kostną?",
        "a": "Mączka kostna stosowana jest jako nawóz bogaty w fosfor i wapń."
      },
      {
        "q": "Jak aplikuje się mączkę kostną?",
        "a": "Aplikuje się przez rozsiew na powierzchnię gleby lub jako dodatek do kompostu."
      },
      {
        "q": "Jaka jest różnica między mączką kostną a nawozami fosforowymi?",
        "a": "Mączka kostna jest pochodzenia organicznego, natomiast nawozy fosforowe są często syntetyczne."
      }
    ]
  },
  {
    "slug": "listova-hnojiva",
    "term": "Nawozy dolistne",
    "kategorie": "hnojivo",
    "shortDef": "Nawozy dolistne to nawozy aplikowane bezpośrednio na liście roślin w celu szybkiego dostarczenia składników odżywczych.",
    "longDef": "Nawozy dolistne to specjalne nawozy przeznaczone do aplikacji na liście roślin, co umożliwia szybkie i efektywne dostarczenie składników odżywczych bezpośrednio do tkanek roślinnych. Stosuje się je szczególnie w przypadkach, gdy konieczna jest szybka reakcja na niedobór składników odżywczych lub przy niekorzystnych warunkach glebowych. Nawozy dolistne są często stosowane w intensywnej produkcji rolniczej, gdzie kładzie się nacisk na optymalizację plonów i jakości roślin uprawnych. Aplikacja nawozów dolistnych jest efektywną metodą wspierania wzrostu roślin i poprawy ich odporności na czynniki stresowe.",
    "alias": [
      "nawozy foliarne"
    ],
    "related": [
      "rozmetadlo-hnojiv",
      "kapilarita-pudy",
      "mineralizace-pudy",
      "npk-hnojivo"
    ],
    "faq": [
      {
        "q": "Jak aplikuje się nawozy dolistne?",
        "a": "Nawozy dolistne aplikuje się przez oprysk bezpośrednio na liście roślin, zazwyczaj w okresie wzrostu."
      },
      {
        "q": "Do czego służą nawozy dolistne?",
        "a": "Nawozy dolistne służą do szybkiego dostarczenia składników odżywczych bezpośrednio do rośliny, co jest przydatne przy niedoborze składników w glebie."
      }
    ]
  },
  {
    "slug": "sira-vyziva",
    "term": "Siarka w żywieniu roślin",
    "kategorie": "hnojivo",
    "shortDef": "Siarka jest kluczowym pierwiastkiem w żywieniu roślin, ważnym dla syntezy aminokwasów i enzymów.",
    "longDef": "Siarka jest niezbędnym składnikiem odżywczym dla roślin, uczestniczącym w syntezie aminokwasów, enzymów i witamin. Jest niezbędna do tworzenia chlorofilu i wspiera metabolizm azotu. Niedobór siarki może prowadzić do ograniczonego wzrostu i obniżonej jakości roślin uprawnych. Siarka jest często aplikowana w postaci nawozów siarczanowych, szczególnie na obszarach z niską zawartością materii organicznej w glebie. Właściwe nawożenie siarką jest kluczowe dla uzyskania wysokich plonów i jakościowych produktów rolnych.",
    "alias": [
      "siarka w roślinach"
    ],
    "related": [
      "npk-hnojivo",
      "mineralizace-pudy",
      "superfosfat",
      "draselna-sul"
    ],
    "faq": [
      {
        "q": "Dlaczego siarka jest ważna dla roślin?",
        "a": "Siarka jest kluczowa dla syntezy aminokwasów, enzymów i witamin w roślinach."
      },
      {
        "q": "Jak objawia się niedobór siarki u roślin?",
        "a": "Niedobór siarki objawia się żółknięciem młodszych liści i spowolnieniem wzrostu."
      }
    ]
  },
  {
    "slug": "padli-travni",
    "term": "Mączniak prawdziwy traw",
    "kategorie": "ochrana",
    "shortDef": "Mączniak prawdziwy traw to choroba grzybowa atakująca przede wszystkim zboża i trawy.",
    "longDef": "Mączniak prawdziwy traw to choroba grzybowa powodowana przez grzyb Blumeria graminis, atakująca zboża i trawy. Objawia się białym nalotem na liściach i źdźbłach, co może prowadzić do osłabienia roślin i obniżenia plonu. Mączniak prawdziwy traw jest powszechnym problemem w intensywnie uprawianych roślinach, takich jak pszenica i jęczmień. Ochrona przed mączniakiem obejmuje działania zapobiegawcze, takie jak właściwa agrotechnika i stosowanie fungicydów.",
    "alias": [
      "mączniak traw"
    ],
    "related": [
      "fungicidy",
      "psenice-ozima",
      "repka-ozima",
      "osevni-postup"
    ],
    "externalUrl": "https://pl.wikipedia.org/wiki/M%C4%85czniak_prawdziwy",
    "externalLabel": "Wikipedia: Mączniak prawdziwy",
    "faq": [
      {
        "q": "Jak objawia się mączniak prawdziwy traw?",
        "a": "Mączniak prawdziwy traw objawia się białym nalotem na liściach i łodygach roślin."
      },
      {
        "q": "Jak leczy się mączniak prawdziwy traw?",
        "a": "Mączniak prawdziwy traw leczy się przez aplikację fungicydów i poprawę warunków wzrostu."
      }
    ]
  },
  {
    "slug": "hlizenka",
    "term": "Twardzik pospolity (Sclerotinia)",
    "kategorie": "ochrana",
    "shortDef": "Twardzik pospolity to choroba grzybowa atakująca szerokie spektrum roślin, w tym rzepak i słonecznik.",
    "longDef": "Twardzik pospolity, wywoływany przez grzyba Sclerotinia sclerotiorum, jest poważną chorobą grzybową atakującą wiele gatunków roślin, w tym rzepak, słonecznik i rośliny strączkowe. Objawia się gniciem łodyg i liści, co może prowadzić do znacznych strat w plonach. W Czechach twardzik pospolity jest szczególnie problematyczny w obszarach o wilgotnym klimacie. Ochrona przed tą chorobą obejmuje stosowanie fungicydów oraz przestrzeganie właściwych zasad zmianowania.",
    "alias": [
      "Sclerotinia sclerotiorum"
    ],
    "related": [
      "fungicidy",
      "repka-ozima",
      "osevni-postup",
      "moreni-osiva"
    ],
    "externalUrl": "https://pl.wikipedia.org/wiki/Sklerotinia_skleroci%C3%B3w",
    "externalLabel": "Wikipedia: Twardzik pospolity",
    "faq": [
      {
        "q": "Jak objawia się twardzik pospolity?",
        "a": "Twardzik pospolity objawia się gniciem łodyg i korzeni, często z białą grzybnią."
      },
      {
        "q": "Jak zwalczać twardzika pospolitego?",
        "a": "Zwalczanie obejmuje zmianowanie roślin i stosowanie fungicydów."
      }
    ]
  },
  {
    "slug": "drepcik",
    "term": "Pchełki ziemne",
    "kategorie": "ochrana",
    "shortDef": "Pchełki ziemne to małe chrząszcze uszkadzające liście i łodygi roślin.",
    "longDef": "Pchełki ziemne to małe chrząszcze z rodziny Chrysomelidae, znane ze skocznego sposobu poruszania się i uszkadzania liści oraz łodyg roślin. Są szczególnie niebezpieczne dla młodych roślin, gdzie mogą powodować znaczne szkody. W Czechach pchełki ziemne są powszechnym szkodnikiem roślin takich jak rzepak, kapusta i inne rośliny krzyżowe. Ochrona przed pchełkami obejmuje stosowanie insektycydów oraz środków agrotechnicznych, takich jak właściwe zmianowanie roślin.",
    "alias": [
      "pchełka"
    ],
    "related": [
      "insekticidy",
      "repka-ozima",
      "osevni-postup",
      "predni-vyvodovy-hridel"
    ],
    "faq": [
      {
        "q": "Jak objawia się uszkodzenie przez pchełki ziemne?",
        "a": "Uszkodzenia objawiają się drobnymi otworami i żerowiskami na liściach i łodygach."
      },
      {
        "q": "Jak zwalczać pchełki ziemne?",
        "a": "Zwalczanie obejmuje stosowanie insektycydów oraz środków agrotechnicznych."
      }
    ]
  },
  {
    "slug": "bazlivec-kukuricny",
    "term": "Diabrotyka kukurydziana",
    "kategorie": "ochrana",
    "shortDef": "Diabrotyka kukurydziana to szkodnik kukurydzy powodujący uszkodzenia korzeni i obniżający plony.",
    "longDef": "Diabrotyka kukurydziana, Diabrotica virgifera, to inwazyjny szkodnik atakujący kukurydzę i powodujący poważne uszkodzenia systemu korzeniowego. Prowadzi to do osłabienia roślin i spadku plonów. W Czechach ten szkodnik stał się problemem w ostatnich dziesięcioleciach, co wymaga wdrożenia integrowanej ochrony roślin, obejmującej stosowanie insektycydów oraz środków agrotechnicznych, takich jak zmianowanie roślin. Skuteczne zarządzanie diabrotyką kukurydzianą jest kluczowe dla utrzymania produktywności pól kukurydzy.",
    "alias": [
      "Diabrotica virgifera"
    ],
    "related": [
      "insekticidy",
      "osevni-postup",
      "predni-vyvodovy-hridel",
      "psenice-ozima"
    ],
    "faq": [
      {
        "q": "Jak objawia się uszkodzenie przez diabrotykę kukurydzianą?",
        "a": "Uszkodzenia objawiają się osłabieniem systemu korzeniowego i wyleganiem roślin."
      },
      {
        "q": "Jak zwalczać diabrotykę kukurydzianą?",
        "a": "Zwalczanie obejmuje zmianowanie roślin i stosowanie insektycydów."
      }
    ]
  },
  {
    "slug": "sviluska-chmelova",
    "term": "Przędziorek chmielowiec",
    "kategorie": "ochrana",
    "shortDef": "Przędziorek chmielowiec to pajęczak wyrządzający szkody w uprawach chmielu i innych roślinach.",
    "longDef": "Przędziorek chmielowiec (Tetranychus urticae) to drobny pajęczak atakujący liście roślin, zwłaszcza chmielu, powodując ich żółknięcie i opadanie. Przędziorki żywią się ssąc soki roślinne, co prowadzi do osłabienia roślin i obniżenia plonu. W walce z przędziorkami stosuje się akarycydy oraz metody biologiczne, takie jak wykorzystanie drapieżnych roztoczy. W Czechach monitorowanie i ochrona przed przędziorkiem chmielowcem jest ważną częścią integrowanej ochrony roślin.",
    "alias": [
      "Tetranychus urticae",
      "czerwony pająk"
    ],
    "related": [
      "padli-travni",
      "ucinna-latka",
      "rezistence-pesticidy"
    ],
    "faq": [
      {
        "q": "Jak rozpoznać porażenie przez przędziorka chmielowca?",
        "a": "Porażenie objawia się żółknięciem i brązowieniem liści, które następnie mogą opadać."
      },
      {
        "q": "Jak zapobiegać przędziorku chmielowcowi?",
        "a": "Regularna kontrola roślin i stosowanie odpowiednich akarycydów pomagają w zapobieganiu."
      }
    ]
  },
  {
    "slug": "molice-sklenikova",
    "term": "Mączlik szklarniowy",
    "kategorie": "ochrana",
    "shortDef": "Mączlik szklarniowy to szkodnik atakujący rośliny w szklarniach.",
    "longDef": "Mączlik szklarniowy (Trialeurodes vaporariorum) to drobny owad atakujący liście roślin w szklarniach, gdzie ssąc soki roślinne powoduje ich osłabienie. Ten szkodnik znany jest ze zdolności do szybkiego rozmnażania się i przenoszenia chorób wirusowych. Zwalczanie mączlika obejmuje stosowanie insektycydów, biologicznych drapieżników oraz środków zapobiegawczych, takich jak utrzymywanie czystości w szklarniach. W Czechach mączlik szklarniowy jest znaczącym szkodnikiem w produkcji warzyw i roślin ozdobnych.",
    "alias": [
      "Trialeurodes vaporariorum"
    ],
    "related": [
      "insekticidy",
      "ucinna-latka",
      "rezistence-pesticidy"
    ],
    "faq": [
      {
        "q": "Jak pozbyć się mączlika szklarniowego?",
        "a": "Stosowanie biologicznych wrogów, takich jak pasożytnicze osówki, jest skuteczną metodą."
      },
      {
        "q": "Jakie rośliny atakuje mączlik szklarniowy?",
        "a": "Atakuje szeroką gamę roślin, w tym pomidory, ogórki i rośliny ozdobne."
      }
    ]
  },
  {
    "slug": "strupovitost-jablone",
    "term": "Parch jabłoni",
    "kategorie": "ochrana",
    "shortDef": "Parch jabłoni to choroba grzybowa powodująca plamy na owocach i liściach jabłoni.",
    "longDef": "Parch jabłoni (Venturia inaequalis) to choroba grzybowa atakująca liście i owoce jabłoni, powodująca czarne plamy i deformacje. Choroba ta może znacznie obniżyć jakość i ilość zbiorów. Ochrona przed parchem obejmuje stosowanie fungicydów, dobór odpornych odmian oraz właściwe zabiegi agrotechniczne. W Czechach parch jabłoni jest jedną z najczęstszych chorób jabłoni, dlatego jego zwalczanie jest kluczowym elementem integrowanej ochrony roślin.",
    "alias": [
      "Venturia inaequalis"
    ],
    "related": [
      "fungicidy",
      "ucinna-latka",
      "padli-travni"
    ],
    "externalUrl": "https://pl.wikipedia.org/wiki/Parch_jabłoni",
    "externalLabel": "Wikipedia: Parch jabłoni",
    "faq": [
      {
        "q": "Jak leczyć parch jabłoni?",
        "a": "Stosowanie fungicydów i usuwanie porażonych części drzewa to powszechne metody."
      },
      {
        "q": "Jak objawia się parch na jabłkach?",
        "a": "Na owocach pojawiają się ciemne, korkowe plamy."
      }
    ]
  },
  {
    "slug": "obalec-jablecny",
    "term": "Owocówka jabłkóweczka",
    "kategorie": "ochrana",
    "shortDef": "Owocówka jabłkóweczka to motyl, którego gąsienice uszkadzają owoce jabłoni.",
    "longDef": "Owocówka jabłkóweczka (Cydia pomonella) to motyl, którego larwy atakują owoce jabłoni, grusz i innych drzew owocowych, powodując ich robaczywiznę i straty w zbiorach. Zwalczanie owocówki obejmuje stosowanie insektycydów, pułapek feromonowych oraz metod biologicznych, takich jak uwalnianie pasożytniczych osówek. W Czechach owocówka jabłkóweczka jest uważana za znaczącego szkodnika w sadownictwie, dlatego jej monitorowanie i zwalczanie jest kluczowym elementem ochrony sadów owocowych.",
    "alias": [
      "Cydia pomonella"
    ],
    "related": [
      "insekticidy",
      "ucinna-latka",
      "rezistence-pesticidy"
    ],
    "externalUrl": "https://pl.wikipedia.org/wiki/Owocówka_jabłkóweczka",
    "externalLabel": "Wikipedia: Owocówka jabłkóweczka",
    "faq": [
      {
        "q": "Jak zwalczać owocówkę jabłkóweczkę?",
        "a": "Stosowanie pułapek feromonowych i insektycydów pomaga w kontroli populacji."
      },
      {
        "q": "Kiedy występuje owocówka jabłkóweczka?",
        "a": "Dorosłe osobniki pojawiają się wiosną, a gąsienice uszkadzają owoce latem."
      }
    ]
  },
  {
    "slug": "monilie",
    "term": "Brunatna zgnilizna (monilioza)",
    "kategorie": "ochrana",
    "shortDef": "Monilioza to choroba grzybowa atakująca kwiaty i owoce drzew pestkowych.",
    "longDef": "Monilioza to choroba grzybowa wywoływana przez grzyby z rodzaju Monilinia, atakująca kwiaty, owoce i gałązki drzew pestkowych, takich jak morele, brzoskwinie i wiśnie. Objawia się gniciem owoców, więdnięciem kwiatów i zamieraniem gałązek. Ochrona przed moniliozą obejmuje stosowanie fungicydów, usuwanie porażonych części roślin oraz przestrzeganie zasad higieny w sadach. W Czechach monilioza jest powszechnym problemem w produkcji owoców pestkowych, dlatego jej zwalczanie jest ważnym elementem integrowanej ochrony roślin.",
    "alias": [
      "Monilinia spp.",
      "zgnilizna pestkowych"
    ],
    "related": [
      "fungicidy",
      "ucinna-latka",
      "padli-travni"
    ],
    "faq": [
      {
        "q": "Jak objawia się monilioza?",
        "a": "Objawia się gniciem owoców oraz więdnięciem kwiatów i gałązek."
      },
      {
        "q": "Jak rozprzestrzenia się monilioza?",
        "a": "Rozprzestrzenia się przez zarodniki przenoszone przez wiatr i deszcz."
      }
    ]
  },
  {
    "slug": "ochranna-lhuta",
    "term": "Okres karencji",
    "kategorie": "ochrana",
    "shortDef": "Okres karencji to czas, który musi upłynąć między zastosowaniem pestycydu a zbiorem plonu.",
    "longDef": "Okres karencji to ustawowo określony czas, który musi upłynąć między zastosowaniem pestycydu a zbiorem rośliny uprawnej, aby zapewnić, że pozostałości chemikaliów nie przekroczą dopuszczalnych limitów. Ten termin jest kluczowy dla zapewnienia bezpieczeństwa żywności i ochrony konsumentów. W praktyce okres karencji różni się w zależności od rodzaju pestycydu, rośliny uprawnej i warunków stosowania. W Czechach przestrzeganie okresów karencji jest częścią przepisów dotyczących stosowania pestycydów i jest kontrolowane przez właściwe organy.",
    "related": [
      "rezistence-pesticidy",
      "ucinna-latka",
      "fungicidy"
    ],
    "faq": [
      {
        "q": "Jak oblicza się okres karencji?",
        "a": "Liczy się od ostatniego zastosowania pestycydu do zbioru rośliny uprawnej."
      },
      {
        "q": "Dlaczego okres karencji jest ważny?",
        "a": "Zapewnia, że pozostałości pestycydów spadną do bezpiecznego poziomu przed spożyciem."
      }
    ]
  },
  {
    "slug": "moreni-osiva",
    "term": "Zaprawianie nasion",
    "kategorie": "ochrana",
    "shortDef": "Zaprawianie nasion to proces obróbki nasion substancjami chemicznymi lub biologicznymi przed siewem.",
    "longDef": "Zaprawianie nasion to technika agronomiczna polegająca na stosowaniu substancji chemicznych lub biologicznych na nasiona przed ich wysiewem. Celem jest ochrona nasion i młodych roślin przed chorobami i szkodnikami, co zwiększa zdolność kiełkowania i plony. W praktyce stosuje się różne zaprawy, które mogą zawierać fungicydy, insektycydy lub stymulatory wzrostu. W Czechach zaprawianie nasion jest powszechną praktyką pomagającą poprawić zdrowotność roślin i efektywność uprawy.",
    "alias": [
      "zaprawianie ziarna"
    ],
    "related": [
      "ochranna-lhuta",
      "fungicidy",
      "insekticidy",
      "ucinna-latka"
    ],
    "faq": [
      {
        "q": "Po co zaprawia się nasiona?",
        "a": "Zaprawianie nasion przeprowadza się w celu ochrony przed chorobami i szkodnikami, co zwiększa prawdopodobieństwo udanego kiełkowania."
      },
      {
        "q": "Jakie substancje stosuje się przy zaprawianiu nasion?",
        "a": "Stosuje się substancje chemiczne, takie jak fungicydy i insektycydy, lub środki biologiczne, na przykład mikroorganizmy."
      },
      {
        "q": "Jaka jest różnica między zaprawianiem chemicznym a biologicznym?",
        "a": "Zaprawianie chemiczne wykorzystuje syntetyczne substancje, podczas gdy zaprawianie biologiczne wykorzystuje naturalne organizmy lub ekstrakty."
      }
    ]
  },
  {
    "slug": "adjuvant",
    "term": "Adiuwant (środek zwilżający)",
    "kategorie": "ochrana",
    "shortDef": "Adiuwant to substancja dodawana do pestycydów w celu zwiększenia ich skuteczności.",
    "longDef": "Adiuwanty, znane również jako środki zwilżające, to substancje dodawane do opryskiwaczy pestycydowych w celu zwiększenia ich skuteczności. Działają poprawiając przyczepność i rozprowadzanie oprysku na powierzchni roślin, co prowadzi do lepszego pokrycia i absorpcji substancji czynnej. Stosowanie adiuwantów jest powszechne w rolnictwie, gdzie pomagają optymalizować aplikację pestycydów i ograniczać ich zużycie. W Czechach adiuwanty są częścią integrowanej ochrony roślin.",
    "alias": [
      "środek zwilżający",
      "substancja powierzchniowo czynna"
    ],
    "related": [
      "ucinna-latka",
      "fungicidy",
      "herbicidy",
      "insekticidy"
    ],
    "faq": [
      {
        "q": "Do czego służą adiuwanty w rolnictwie?",
        "a": "Adiuwanty poprawiają skuteczność pestycydów zwiększając ich przyczepność i przenikanie do roślin."
      },
      {
        "q": "Jakie są rodzaje adiuwantów?",
        "a": "Istnieją środki zwilżające, penetratory, bufory i inne rodzaje adiuwantów."
      }
    ]
  },
  {
    "slug": "rezistence-pesticidy",
    "term": "Odporność na pestycydy",
    "kategorie": "ochrana",
    "shortDef": "Odporność na pestycydy to zdolność szkodników do przeżycia zastosowania pestycydów, które normalnie by je zniszczyły.",
    "longDef": "Odporność na pestycydy to zjawisko, w którym populacja szkodników staje się oporna na substancje chemiczne stosowane do jej zwalczania. Zjawisko to jest wynikiem doboru naturalnego, w którym przeżywają osobniki o genetycznej odporności i przekazują ją kolejnym pokoleniom. Odporność stanowi poważny problem w rolnictwie, ponieważ obniża skuteczność pestycydów i może prowadzić do wyższych kosztów ochrony roślin uprawnych. W Czechach kładzie się nacisk na integrowaną ochronę, obejmującą rotację pestycydów i stosowanie alternatywnych metod zwalczania szkodników.",
    "alias": [
      "oporność na pestycydy"
    ],
    "related": [
      "fungicidy",
      "herbicidy",
      "insekticidy",
      "moreni-osiva"
    ],
    "faq": [
      {
        "q": "Jak powstaje odporność na pestycydy?",
        "a": "Odporność powstaje w wyniku mutacji genetycznych umożliwiających przeżycie szkodników nawet po zastosowaniu pestycydów."
      },
      {
        "q": "Jak zapobiegać odporności na pestycydy?",
        "a": "Poprzez stosowanie różnych pestycydów i zintegrowanych metod ochrony roślin."
      }
    ]
  },
  {
    "slug": "ucinna-latka",
    "term": "Substancja czynna",
    "kategorie": "ochrana",
    "shortDef": "Substancja czynna to chemiczny składnik pestycydu zapewniający jego aktywność biologiczną.",
    "longDef": "Substancja czynna jest kluczowym składnikiem preparatów pestycydowych odpowiedzialnym za ich aktywność biologiczną wobec szkodników, chorób lub chwastów. Substancja ta jest starannie opracowywana i testowana, aby była skuteczna, a jednocześnie bezpieczna dla środowiska i zdrowia ludzkiego. W praktyce substancje czynne stosuje się w połączeniu z innymi składnikami zapewniającymi ich stabilność i skuteczność. W Czechach stosowanie substancji czynnych jest regulowane przepisami zapewniającymi ich bezpieczne użycie w rolnictwie.",
    "alias": [
      "składnik aktywny"
    ],
    "related": [
      "fungicidy",
      "herbicidy",
      "insekticidy",
      "adjuvant"
    ],
    "faq": [
      {
        "q": "Co to jest substancja czynna w pestycydzie?",
        "a": "Substancja czynna to składnik mający bezpośredni wpływ na organizmy docelowe."
      },
      {
        "q": "Jak określa się skuteczność substancji czynnej w pestycydzie?",
        "a": "Skuteczność jest testowana w warunkach laboratoryjnych i polowych."
      }
    ]
  },
  {
    "slug": "azoxystrobin",
    "term": "Azoksystrobina",
    "kategorie": "ochrana",
    "shortDef": "Azoksystrobina to fungicyd o szerokim spektrum działania stosowany do ochrony roślin uprawnych przed chorobami grzybowymi.",
    "longDef": "Azoksystrobina to fungicyd z grupy strobilurin stosowany do ochrony roślin uprawnych przed szerokim spektrum chorób grzybowych. Działa poprzez zakłócanie oddychania komórkowego grzybów, prowadząc do ich obumarcia. Azoksystrobina jest stosowana na różne rośliny uprawne, w tym zboża, warzywa i owoce, i jest ceniona za skuteczność oraz stosunkowo niską toksyczność dla organizmów niecelowych. W Czechach azoksystrobina jest częścią integrowanej ochrony roślin, a jej stosowanie jest regulowane odpowiednimi przepisami.",
    "related": [
      "fungicidy",
      "ucinna-latka",
      "moreni-osiva",
      "rezistence-pesticidy"
    ],
    "faq": [
      {
        "q": "Do czego stosuje się azoksystrobinę?",
        "a": "Azoksystrobina jest stosowana do ochrony roślin uprawnych przed szerokim spektrum chorób grzybowych."
      },
      {
        "q": "Jak działa azoksystrobina?",
        "a": "Hamuje mitochondrialne oddychanie grzybów, zatrzymując ich wzrost."
      }
    ]
  },
  {
    "slug": "prothiokonazol",
    "term": "Protiokonazol",
    "kategorie": "ochrana",
    "shortDef": "Protiokonazol to fungicyd stosowany do ochrony roślin uprawnych przed chorobami grzybowymi.",
    "longDef": "Protiokonazol to systemiczny fungicyd z grupy triazoli stosowany do ochrony roślin uprawnych przed różnymi chorobami grzybowymi. Znany jest ze zdolności do wnikania w tkanki roślinne i zapewniania długotrwałej ochrony. Protiokonazol jest stosowany na szeroką gamę roślin uprawnych, w tym zboża, rzepak i warzywa. W Czechach jego stosowanie jest częścią integrowanej ochrony roślin i podlega rygorystycznym regulacjom zapewniającym bezpieczne użycie.",
    "related": [
      "fungicidy",
      "ucinna-latka",
      "moreni-osiva",
      "rezistence-pesticidy"
    ],
    "faq": [
      {
        "q": "Jakie choroby zwalcza protiokonazol?",
        "a": "Protiokonazol jest skuteczny przeciwko wielu chorobom grzybowym, w tym rdzy i mączniakowi."
      },
      {
        "q": "Jak stosuje się protiokonazol?",
        "a": "Stosuje się go poprzez oprysk na liście roślin uprawnych."
      }
    ]
  },
  {
    "slug": "jetel-lucni",
    "term": "Koniczyna łąkowa",
    "kategorie": "plodiny",
    "shortDef": "Koniczyna łąkowa to wieloletnia roślina pastewna uprawiana jako pasza i do poprawy gleby.",
    "longDef": "Koniczyna łąkowa (Trifolium pratense) to wieloletnia roślina z rodziny bobowatych, powszechnie uprawiana jako roślina pastewna. Jest ceniona za wysoką zawartość białka i zdolność do wiązania azotu, dzięki czemu wzbogaca glebę. W Czechach jest często wykorzystywana w zmianowaniu w celu poprawy struktury gleby i zwiększenia jej żyzności. Koniczyna łąkowa jest również ważnym składnikiem pastwisk i łąk, gdzie służy jako wysokiej jakości pasza dla bydła.",
    "alias": [
      "Trifolium pratense"
    ],
    "related": [
      "zelene-hnojeni",
      "hnuj",
      "organicka-hmota",
      "pH-pudy"
    ],
    "externalUrl": "https://pl.wikipedia.org/wiki/Koniczyna_łąkowa",
    "externalLabel": "Wikipedia: Koniczyna łąkowa",
    "faq": [
      {
        "q": "Do czego służy koniczyna łąkowa?",
        "a": "Koniczyna łąkowa jest stosowana jako pasza dla bydła i do poprawy struktury gleby dzięki wiązaniu azotu."
      },
      {
        "q": "Jakie są wymagania koniczyny łąkowej wobec gleby?",
        "a": "Koniczyna łąkowa preferuje dobrze zdrenowane, żyzne gleby o neutralnym pH."
      }
    ]
  },
  {
    "slug": "lupina",
    "term": "Łubin (wilczy groch)",
    "kategorie": "plodiny",
    "shortDef": "Łubin to rodzaj roślin wykorzystywany do produkcji paszy i nawożenia zielonego.",
    "longDef": "Łubin, znany też jako wilczy groch, należy do rodziny bobowatych i obejmuje kilka gatunków roślin uprawianych dla nasion bogatych w białko. W rolnictwie jest stosowany jako pasza dla bydła oraz jako nawóz zielony dzięki zdolności do wiązania azotu. W Czechach uprawa łubinu jest mniej powszechna, ale jego zastosowanie rośnie w rolnictwie ekologicznym w celu poprawy żyzności gleby i jako alternatywa dla soi.",
    "alias": [
      "Lupinus"
    ],
    "related": [
      "zelene-hnojeni",
      "organicka-hmota",
      "pH-pudy",
      "hnuj"
    ],
    "externalUrl": "https://pl.wikipedia.org/wiki/Łubin",
    "externalLabel": "Wikipedia: Łubin",
    "faq": [
      {
        "q": "Do czego używa się łubinu?",
        "a": "Łubin jest wykorzystywany jako pasza dla zwierząt i do nawożenia zielonego."
      },
      {
        "q": "Jakie są korzyści z uprawy łubinu?",
        "a": "Łubin poprawia glebę poprzez wiązanie azotu i jest odporny na ubogie gleby."
      }
    ]
  },
  {
    "slug": "bob-polni",
    "term": "Bób polny",
    "kategorie": "plodiny",
    "shortDef": "Bób polny to roślina strączkowa uprawiana w celach spożywczych i paszowych.",
    "longDef": "Bób polny (Vicia faba) to roślina z rodziny bobowatych, znana z dużych nasion wykorzystywanych w przemyśle spożywczym i jako pasza dla zwierząt. Jest ceniony za wysoką zawartość białka i błonnika. W Czechach uprawiany jest głównie jako roślina pastewna, jednak jego zastosowanie w żywieniu ludzi rośnie ze względu na rosnące zainteresowanie zdrową dietą i alternatywnymi źródłami białka.",
    "alias": [
      "Vicia faba"
    ],
    "related": [
      "zelene-hnojeni",
      "organicka-hmota",
      "hnuj",
      "pH-pudy"
    ],
    "externalUrl": "https://pl.wikipedia.org/wiki/Bób",
    "externalLabel": "Wikipedia: Bób",
    "faq": [
      {
        "q": "Jakie są główne zastosowania bobu polnego?",
        "a": "Bób polny jest wykorzystywany jako żywność dla ludzi i pasza dla zwierząt."
      },
      {
        "q": "Jaka jest różnica między bobem polnym a fasolą?",
        "a": "Bób polny jest większy i ma odmienną wartość odżywczą niż fasola."
      }
    ]
  },
  {
    "slug": "proso",
    "term": "Proso zwyczajne",
    "kategorie": "plodiny",
    "shortDef": "Proso zwyczajne to zboże uprawiane w celach spożywczych i paszowych.",
    "longDef": "Proso zwyczajne (Panicum miliaceum) to jednoroczne zboże z rodziny wiechlinowatych, znane z małych nasion wykorzystywanych w żywieniu i jako pasza. Jest cenione ze względu na niskie wymagania dotyczące gleby i warunków klimatycznych, co umożliwia jego uprawę nawet w suchszych obszarach. W Czechach proso jest uprawiane głównie na potrzeby produkcji pasz oraz jako surowiec do żywności bezglutenowej, co jest ważne dla osób z celiakią.",
    "alias": [
      "Panicum miliaceum"
    ],
    "related": [
      "osevni-postup",
      "organicka-hmota",
      "pH-pudy",
      "hnuj"
    ],
    "externalUrl": "https://pl.wikipedia.org/wiki/Proso_zwyczajne",
    "externalLabel": "Wikipedia: Proso zwyczajne",
    "faq": [
      {
        "q": "Do czego służy proso zwyczajne?",
        "a": "Proso zwyczajne jest wykorzystywane jako żywność dla ludzi i pasza dla zwierząt."
      },
      {
        "q": "Jakie są zalety uprawy prosa?",
        "a": "Proso jest odporne na suszę i ma krótki cykl wegetacyjny."
      }
    ]
  },
  {
    "slug": "cirok",
    "term": "Sorgo",
    "kategorie": "plodiny",
    "shortDef": "Sorgo to zboże uprawiane w celach spożywczych i paszowych.",
    "longDef": "Sorgo (Sorghum) to rodzaj roślin z rodziny wiechlinowatych, obejmujący kilka gatunków uprawianych jako zboże na potrzeby żywieniowe ludzi i jako pasza dla zwierząt. Jest cenione za odporność na suszę i zdolność do wzrostu w różnych warunkach klimatycznych. W Czechach uprawa sorga jest mniej rozpowszechniona, ale jego znaczenie rośnie ze względu na zainteresowanie żywnością bezglutenową i alternatywnymi źródłami energii, takimi jak bioetanol.",
    "alias": [
      "Sorghum"
    ],
    "related": [
      "osevni-postup",
      "organicka-hmota",
      "pH-pudy",
      "hnuj"
    ],
    "externalUrl": "https://pl.wikipedia.org/wiki/Sorgo",
    "externalLabel": "Wikipedia: Sorgo",
    "faq": [
      {
        "q": "Do czego służy sorgo?",
        "a": "Sorgo jest wykorzystywane jako żywność, pasza i w przemyśle do produkcji biopaliw."
      },
      {
        "q": "Jakie są zalety uprawy sorga?",
        "a": "Sorgo jest odporne na suszę i ma szerokie zastosowanie."
      }
    ]
  },
  {
    "slug": "pohanka",
    "term": "Gryka zwyczajna",
    "kategorie": "plodiny",
    "shortDef": "Gryka zwyczajna to pseudozboże uprawiane w celach spożywczych.",
    "longDef": "Gryka zwyczajna (Fagopyrum esculentum) to jednoroczna roślina z rodziny rdestowatych, uprawiana jako pseudozboże. Jest ceniona ze względu na wartość odżywczą, zwłaszcza wysoką zawartość rutyny i białka, i jest popularna w diecie bezglutenowej. W Czechach gryka jest tradycyjnie uprawiana i spożywana, głównie w postaci kasz, mąki i innych produktów spożywczych. Jej uprawa jest wspierana ze względu na pozytywny wpływ na strukturę gleby i bioróżnorodność.",
    "alias": [
      "Fagopyrum esculentum"
    ],
    "related": [
      "osevni-postup",
      "organicka-hmota",
      "pH-pudy",
      "hnuj"
    ],
    "externalUrl": "https://pl.wikipedia.org/wiki/Gryka_zwyczajna",
    "externalLabel": "Wikipedia: Gryka zwyczajna",
    "faq": [
      {
        "q": "Do czego służy gryka zwyczajna?",
        "a": "Gryka jest stosowana jako żywność dla ludzi, znana ze swoich wartości odżywczych."
      },
      {
        "q": "Jak uprawia się grykę?",
        "a": "Gryka jest nieskomplikowana w uprawie i dobrze rośnie w chłodniejszych obszarach."
      }
    ]
  },
  {
    "slug": "svazenka",
    "term": "Facelia błękitna",
    "kategorie": "plodiny",
    "shortDef": "Facelia błękitna to jednoroczna roślina wykorzystywana jako nawóz zielony.",
    "longDef": "Facelia błękitna (Phacelia tanacetifolia) to jednoroczna roślina z rodziny ogórecznikowatych. W rolnictwie jest wykorzystywana głównie jako roślina wsiewkowa do poprawy struktury gleby i wzbogacenia jej w materię organiczną.\n\nDzięki szybkiemu wzrostowi i zdolności do tłumienia chwastów facelia jest popularna w rolnictwie ekologicznym. Ponadto przyciąga zapylacze, co wspiera bioróżnorodność.\n\nW Czechach facelia jest często stosowana w systemach nawożenia zielonego i jako element zmianowania w celu poprawy żyzności gleby.",
    "related": [
      "zelene-hnojeni",
      "osevni-postup",
      "organicka-hmota"
    ],
    "externalUrl": "https://pl.wikipedia.org/wiki/Facelia_błękitna",
    "externalLabel": "Wikipedia: Facelia błękitna",
    "faq": [
      {
        "q": "Do czego służy facelia błękitna?",
        "a": "Facelia błękitna jest stosowana jako nawóz zielony do poprawy struktury gleby i wzbogacenia jej w składniki odżywcze."
      },
      {
        "q": "Jak uprawia się facelię błękitną?",
        "a": "Facelię wysiewa się wiosną lub jesienią; jest nieskomplikowana w uprawie."
      }
    ]
  },
  {
    "slug": "cizrna",
    "term": "Ciecierzyca",
    "kategorie": "plodiny",
    "shortDef": "Ciecierzyca to roślina strączkowa znana z wysokiej zawartości białka i błonnika.",
    "longDef": "Ciecierzyca (Cicer arietinum) to roślina strączkowa należąca do rodziny bobowatych. Jest ceniona za wysoką zawartość białka, błonnika i innych składników odżywczych.\n\nW rolnictwie ciecierzyca jest uprawiana w obszarach o ciepłym i suchym klimacie. Jej uprawa przyczynia się do wzbogacenia gleby w azot dzięki symbiozie z bakteriami brodawkowymi.\n\nW Czechach uprawa ciecierzycy jest mniej rozpowszechniona, ale jej spożycie rośnie ze względu na popularność zdrowego żywienia.",
    "related": [
      "hnuj",
      "zelene-hnojeni",
      "osevni-postup",
      "organicka-hmota"
    ],
    "externalUrl": "https://pl.wikipedia.org/wiki/Ciecierzyca_pospolita",
    "externalLabel": "Wikipedia: Ciecierzyca",
    "faq": [
      {
        "q": "Jaka jest wartość odżywcza ciecierzycy?",
        "a": "Ciecierzyca jest bogata w białko, błonnik, witaminy i minerały."
      },
      {
        "q": "Jak przygotować ciecierzycę do gotowania?",
        "a": "Ciecierzycę należy namoczyć przed gotowaniem przez kilka godzin, najlepiej przez całą noc."
      }
    ]
  },
  {
    "slug": "vdj",
    "term": "DJP – duża jednostka przeliczeniowa",
    "kategorie": "chov",
    "shortDef": "DJP to standaryzowana jednostka służąca do wyrażenia wielkości chowu zwierząt gospodarskich.",
    "longDef": "Duża jednostka przeliczeniowa (DJP) to standaryzowana jednostka miary stosowana do wyrażenia wielkości chowu zwierząt gospodarskich. Jedna DJP odpowiada masie 500 kg żywej wagi.\n\nJednostka ta umożliwia porównywanie różnych gatunków zwierząt i ich liczebności w ramach statystyk rolniczych i planowania.\n\nW Czechach DJP jest stosowana w ramach dopłat rolniczych i planowania pojemności dla chowu zwierząt gospodarskich.",
    "alias": [
      "duża jednostka przeliczeniowa"
    ],
    "related": [
      "vykrm-skotu",
      "odchov-telat",
      "krizeni-plemen"
    ],
    "faq": [
      {
        "q": "Jak oblicza się dużą jednostkę przeliczeniową (DJP)?",
        "a": "DJP oblicza się na podstawie żywej masy zwierząt — 1 DJP odpowiada 500 kg żywej masy bydła. Dla poszczególnych kategorii i gatunków stosuje się współczynniki przeliczeniowe."
      },
      {
        "q": "Do czego służy DJP?",
        "a": "DJP służy do porównywania i planowania pojemności chowów zwierząt gospodarskich."
      }
    ]
  },
  {
    "slug": "ecm-mleko",
    "term": "ECM – mleko przeliczone na energię",
    "kategorie": "chov",
    "shortDef": "ECM to wskaźnik przeliczający mleko na standaryzowaną wartość energetyczną.",
    "longDef": "ECM (Energy Corrected Milk) to wskaźnik przeliczający ilość mleka na standaryzowaną wartość energetyczną. Przeliczenie to uwzględnia zawartość tłuszczu i białka w mleku.\n\nStosuje się go do obiektywnego porównania produkcji mleka między różnymi chowami i rasami. ECM pozwala rolnikom lepiej oceniać efektywność i ekonomikę produkcji mleka.\n\nW Czechach ECM jest powszechnie wykorzystywane przy ocenie ferm mlecznych i w ramach statystyk rolniczych.",
    "alias": [
      "ECM"
    ],
    "related": [
      "laktacni-krivka",
      "vykrm-skotu",
      "odchov-telat",
      "krizeni-plemen"
    ],
    "faq": [
      {
        "q": "Jak oblicza się mleko ECM?",
        "a": "Mleko ECM jest przeliczane ze zwykłego mleka na podstawie zawartości tłuszczu i białka w celu standaryzacji jego wartości energetycznej."
      },
      {
        "q": "Dlaczego stosuje się mleko ECM?",
        "a": "Mleko ECM umożliwia obiektywne porównanie produkcji mleka między różnymi rasami i fermami."
      }
    ]
  },
  {
    "slug": "zaprahnuti",
    "term": "Zasuszenie (okres zasuszenia)",
    "kategorie": "chov",
    "shortDef": "Zasuszenie to okres, w którym krowa mleczna przestaje być dojona przed porodem.",
    "longDef": "Zasuszenie, czyli okres zasuszenia, to czas w chowie krów mlecznych, gdy krowa przestaje być dojona na około 60 dni przed spodziewanym porodem. Okres ten jest ważny dla regeneracji gruczołu mlecznego i przygotowania do kolejnej laktacji.\n\nW trakcie zasuszenia zmienia się dawka pokarmowa i opieka nad zwierzęciem, aby zapewnić jego zdrowie i optymalne warunki dla zbliżającego się porodu.\n\nW Czechach zasuszenie jest standardowym elementem zarządzania chowem krów mlecznych, który przyczynia się do utrzymania wysokiej produkcji mleka i zdrowia zwierząt.",
    "alias": [
      "okres zasuszenia"
    ],
    "related": [
      "laktacni-krivka",
      "vykrm-skotu",
      "odchov-telat",
      "krizeni-plemen"
    ],
    "faq": [
      {
        "q": "Co to jest zasuszenie u krów mlecznych?",
        "a": "Zasuszenie to okres przed porodem, w którym krowa mleczna przestaje być dojona, aby przygotować się do laktacji."
      },
      {
        "q": "Jak długo trwa zasuszenie?",
        "a": "Zasuszenie (okres zasuszenia) trwa zazwyczaj około 60 dni przed spodziewanym porodem, czyli mniej więcej osiem tygodni."
      }
    ]
  },
  {
    "slug": "stelivo",
    "term": "Ściółka",
    "kategorie": "chov",
    "shortDef": "Ściółka to materiał stosowany w hodowli zwierząt w celu zapewnienia komfortu i higieny.",
    "longDef": "Ściółka to materiał stosowany w hodowli zwierząt gospodarskich w celu zapewnienia im komfortu i higieny. Zazwyczaj jest to słoma, trociny lub specjalne produkty przemysłowe.\n\nŚciółka pomaga utrzymać suche i czyste środowisko w oborach, co przyczynia się do zdrowia zwierząt i zmniejsza ryzyko chorób.\n\nW Czechach dobór ściółki zależy od rodzaju chowu i dostępności materiałów, przy czym coraz częściej stosuje się materiały ekologiczne i nadające się do recyklingu.",
    "related": [
      "hluboka-podestylka",
      "laktacni-krivka",
      "vykrm-skotu",
      "odchov-telat"
    ],
    "faq": [
      {
        "q": "Jakie materiały są stosowane jako ściółka?",
        "a": "Jako ściółka często stosuje się słomę, trociny, piasek lub specjalne materiały przemysłowe."
      },
      {
        "q": "Dlaczego ściółka jest ważna w hodowli zwierząt?",
        "a": "Ściółka zapewnia komfort, higienę i zdrowie zwierząt poprzez absorpcję wilgoci i zmniejszenie ryzyka chorób."
      }
    ]
  },
  {
    "slug": "hluboka-podestylka",
    "term": "Głęboka ściółka",
    "kategorie": "chov",
    "shortDef": "Głęboka ściółka to metoda utrzymywania zwierząt gospodarskich na warstwie słomy lub innego materiału, regularnie uzupełnianej.",
    "longDef": "Głęboka ściółka to sposób utrzymywania zwierząt, w którym są one hodowane na warstwie słomy lub innego materiału organicznego. Materiał ten jest regularnie uzupełniany, ale nie usuwany, co umożliwia jego stopniowe rozkładanie się i wytwarzanie ciepła. \n\nStosuje się ją przede wszystkim w chowie bydła i trzody chlewnej, gdzie zapewnia komfort i ciepło zwierzętom, a jednocześnie przyczynia się do lepszej higieny. \n\nW praktyce głęboka ściółka jest często łączona z innymi systemami utrzymywania i jest popularna ze względu na prostotę i efektywność w mniejszych i średnich fermach.",
    "alias": [
      "głębokie posłanie",
      "głęboka ściółka"
    ],
    "related": [
      "stelivo",
      "hnuj",
      "odchov-telat",
      "vykrm-skotu"
    ],
    "faq": [
      {
        "q": "Jak utrzymywać głęboką ściółkę?",
        "a": "Głęboką ściółkę regularnie uzupełnia się świeżym materiałem, a stary pozostawia do rozkładu na miejscu."
      },
      {
        "q": "Do czego służy głęboka ściółka?",
        "a": "Służy do zapewnienia komfortu i izolacji termicznej zwierzętom gospodarskim."
      },
      {
        "q": "Jaki materiał stosuje się na głęboką ściółkę?",
        "a": "Najczęściej stosuje się słomę, ale można też użyć trocin lub wiórów."
      }
    ]
  },
  {
    "slug": "laktacni-krivka",
    "term": "Krzywa laktacji",
    "kategorie": "chov",
    "shortDef": "Krzywa laktacji to graficzne przedstawienie produkcji mleka u krów mlecznych w trakcie laktacji.",
    "longDef": "Krzywa laktacji przedstawia zmiany w produkcji mleka u krów mlecznych podczas laktacji, trwającej zazwyczaj około 305 dni. \n\nGraficznie ilustruje, jak produkcja mleka wzrasta po porodzie, osiąga szczyt, a następnie spada. \n\nKrzywa ta jest kluczowa dla zarządzania żywieniem i zdrowiem stada, ponieważ pomaga optymalizować żywienie i monitorować stan zdrowia krów mlecznych. W Czechach jest stosowana w ramach nowoczesnych systemów hodowlanych i jest ważna dla zwiększania efektywności produkcji mleka.",
    "alias": [
      "krzywa produkcji"
    ],
    "related": [
      "ecm-mleko",
      "inseminace",
      "odchov-telat",
      "vykrm-skotu"
    ],
    "faq": [
      {
        "q": "Jak oblicza się krzywą laktacji?",
        "a": "Krzywa laktacji jest tworzona na podstawie pomiarów dziennej produkcji mleka w trakcie laktacji."
      },
      {
        "q": "Do czego służy krzywa laktacji?",
        "a": "Służy do monitorowania i optymalizacji produkcji mleka u krów mlecznych."
      },
      {
        "q": "Jaka jest różnica między krzywą laktacji a wydajnością mleczną?",
        "a": "Krzywa laktacji pokazuje przebieg produkcji mleka, podczas gdy wydajność mleczna to łączna ilość mleka za laktację."
      }
    ]
  },
  {
    "slug": "brakace",
    "term": "Brakowanie (wycofywanie zwierząt)",
    "kategorie": "chov",
    "shortDef": "Brakowanie to proces wycofywania zwierząt ze stada na podstawie nieodpowiednich cech lub stanu zdrowia.",
    "longDef": "Brakowanie to metoda selektywnego wycofywania zwierząt ze stada, stosowana w celu utrzymania lub poprawy jego jakości. \n\nZwierzęta mogą być brakowane z powodu wad genetycznych, niskiej produkcji, problemów zdrowotnych lub niewłaściwego zachowania. \n\nW praktyce brakowanie jest ważne dla optymalizacji programów hodowlanych i zapewnienia ekonomicznej efektywności chowu. W Czechach proces ten jest powszechnym elementem zarządzania chowem bydła, trzody chlewnej i drobiu.",
    "alias": [
      "wycofywanie",
      "selektywne wycofanie"
    ],
    "related": [
      "inseminace",
      "odchov-telat",
      "vykrm-skotu",
      "krizeni-plemen"
    ],
    "faq": [
      {
        "q": "Jak przeprowadza się brakowanie zwierząt?",
        "a": "Brakowanie przeprowadza się na podstawie oceny stanu zdrowia i cech produkcyjnych zwierząt."
      },
      {
        "q": "Do czego służy brakowanie?",
        "a": "Służy do utrzymania i poprawy jakości stada."
      },
      {
        "q": "Jaka jest różnica między brakowaniem a selekcją?",
        "a": "Brakowanie to wycofywanie nieodpowiednich zwierząt, natomiast selekcja to wybór najlepszych osobników do hodowli."
      }
    ]
  },
  {
    "slug": "vykrm-skotu",
    "term": "Opas bydła",
    "kategorie": "chov",
    "shortDef": "Opas bydła to proces zwiększania masy bydła w celu produkcji mięsa.",
    "longDef": "Opas bydła skupia się na zwiększaniu masy i poprawie wydajności mięsnej bydła. \n\nStosuje się różne strategie żywienia obejmujące zbilansowaną dietę o wysokiej zawartości energii i białka. \n\nW Czechach opas bydła jest ważną częścią przemysłu mięsnego i jest regulowany przepisami dotyczącymi dobrostanu zwierząt i efektywnego wykorzystania zasobów. Opas jest często prowadzony w warunkach intensywnych, ale także na pastwiskach.",
    "alias": [
      "tucz bydła",
      "intensywny opas"
    ],
    "related": [
      "hluboka-podestylka",
      "odchov-telat",
      "brakace",
      "inseminace"
    ],
    "faq": [
      {
        "q": "Jak przeprowadza się opas bydła?",
        "a": "Opas bydła przeprowadza się poprzez kontrolowaną dietę ukierunkowaną na zwiększanie masy ciała."
      },
      {
        "q": "Do czego służy opas bydła?",
        "a": "Służy do produkcji mięsa i zapewnienia ekonomicznej efektywności chowu."
      },
      {
        "q": "Jaka jest różnica między opasem a hodowlą bydła?",
        "a": "Opas skupia się na zwiększaniu masy ciała, natomiast hodowla obejmuje też rozród i opiekę nad stadem."
      }
    ]
  },
  {
    "slug": "odchov-telat",
    "term": "Odchów cieląt",
    "kategorie": "chov",
    "shortDef": "Odchów cieląt to proces pielęgnacji i żywienia cieląt od urodzenia do odsadzenia.",
    "longDef": "Odchów cieląt obejmuje opiekę nad cielętami od urodzenia aż do momentu, gdy są zdolne samodzielnie pobierać stałą paszę. \n\nObejmuje właściwe żywienie, opiekę weterynaryjną i odpowiednie utrzymanie, które są kluczowe dla zdrowego wzrostu i rozwoju. \n\nW Czechach odchów cieląt jest ważnym elementem zarówno chowu mlecznego, jak i mięsnego, z naciskiem na dobrostan zwierząt i efektywność chowu. Nowoczesne metody obejmują m.in. stosowanie mlekozastępników i zautomatyzowanych systemów żywienia.",
    "alias": [
      "odchów młodych",
      "chów cieląt"
    ],
    "related": [
      "hluboka-podestylka",
      "laktacni-krivka",
      "vykrm-skotu",
      "brakace"
    ],
    "faq": [
      {
        "q": "Jak przeprowadza się odchów cieląt?",
        "a": "Odchów cieląt obejmuje właściwe żywienie, higienę i opiekę weterynaryjną od urodzenia do odsadzenia."
      },
      {
        "q": "Do czego służy odchów cieląt?",
        "a": "Służy do zapewnienia zdrowego wzrostu i rozwoju młodych zwierząt."
      },
      {
        "q": "Jaka jest różnica między odchowem a opasem cieląt?",
        "a": "Odchów skupia się na wzroście i zdrowiu, natomiast opas na zwiększaniu masy ciała."
      }
    ]
  },
  {
    "slug": "krizeni-plemen",
    "term": "Krzyżowanie ras",
    "kategorie": "chov",
    "shortDef": "Krzyżowanie ras to metoda genetyczna stosowana do uzyskiwania potomstwa o pożądanych cechach z różnych ras.",
    "longDef": "Krzyżowanie ras to proces łączenia cech genetycznych dwóch lub więcej ras w celu uzyskania potomstwa o lepszych właściwościach produkcyjnych lub adaptacyjnych. \n\nMetoda ta jest stosowana do zwiększenia odporności na choroby, poprawy wzrostu lub produkcji mleka. \n\nW Czechach krzyżowanie ras jest powszechną praktyką w hodowli bydła, trzody chlewnej i drobiu, regulowaną programami hodowlanymi mającymi na celu zachowanie różnorodności genetycznej i zapewnienie jakości produkcji.",
    "alias": [
      "hybrydyzacja",
      "genetyczne krzyżowanie"
    ],
    "related": [
      "brakace",
      "inseminace",
      "odchov-telat",
      "vykrm-skotu"
    ],
    "faq": [
      {
        "q": "Jak przeprowadza się krzyżowanie ras?",
        "a": "Krzyżowanie ras jest przeprowadzane w celu połączenia pożądanych cech dwóch różnych ras."
      },
      {
        "q": "Do czego służy krzyżowanie ras?",
        "a": "Służy do uzyskiwania potomstwa o lepszych właściwościach produkcyjnych lub zdrowotnych."
      },
      {
        "q": "Jaka jest różnica między krzyżowaniem a hodowlą czystorasową?",
        "a": "Krzyżowanie łączy cechy różnych ras, natomiast hodowla czystorasowa zachowuje linię genetyczną."
      }
    ]
  },
  {
    "slug": "n-senzor",
    "term": "N-sensor (sensor azotowy)",
    "kategorie": "precise-farming",
    "shortDef": "N-sensor to urządzenie służące do optymalizacji dawkowania nawozów azotowych na podstawie aktualnych potrzeb roślin.",
    "longDef": "N-sensor to urządzenie technologiczne mierzące zawartość chlorofilu w roślinach za pomocą analizy spektralnej. Urządzenie to pomaga rolnikom określić optymalną dawkę nawozów azotowych, co prowadzi do efektywniejszego wykorzystania nawozów i zmniejszenia ich nadmiernego stosowania.\n\nStosowanie N-sensora umożliwia zmienne dawkowanie nawozów, co poprawia plony i zmniejsza oddziaływanie na środowisko. Dane uzyskane z N-sensora są często integrowane z mapami aplikacyjnymi, które następnie są wykorzystywane w rolnictwie precyzyjnym.\n\nW Czechach N-sensory stają się coraz częstszym elementem nowoczesnego rolnictwa, szczególnie w dużych gospodarstwach nastawionych na efektywność i zrównoważony rozwój.",
    "related": [
      "mapa-vra",
      "rtk-baze",
      "ec-pudy",
      "senzor-vlhkosti-pudy"
    ],
    "faq": [
      {
        "q": "Do czego służy N-sensor?",
        "a": "N-sensor służy do optymalizacji dawkowania nawozów azotowych zgodnie z aktualnym zapotrzebowaniem roślin."
      },
      {
        "q": "Jak działa N-sensor?",
        "a": "N-sensor mierzy zawartość chlorofilu w roślinach za pomocą analizy spektralnej, co pomaga określić ich zapotrzebowanie na azot."
      }
    ]
  },
  {
    "slug": "mapa-vra",
    "term": "Mapa aplikacyjna (zmienne dawkowanie)",
    "kategorie": "precise-farming",
    "shortDef": "Mapa aplikacyjna to narzędzie do zmiennego dawkowania nawozów i pestycydów zgodnie z potrzebami poszczególnych części pola.",
    "longDef": "Mapa aplikacyjna to cyfrowa mapa zawierająca informacje o zmienności warunków glebowych i roślinnych na polu. Mapy te są tworzone na podstawie danych z różnych sensorów i analiz, takich jak N-sensory lub zdjęcia satelitarne.\n\nWykorzystanie map aplikacyjnych pozwala rolnikom stosować nawozy i pestycydy dokładnie tam, gdzie są najbardziej potrzebne, co zwiększa efektywność i obniża koszty. Podejście to minimalizuje również negatywne oddziaływanie na środowisko.\n\nW Czechach mapy aplikacyjne stają się powszechną praktyką w ramach rolnictwa precyzyjnego, szczególnie w gospodarstwach inwestujących w nowoczesne technologie i zrównoważone gospodarowanie.",
    "related": [
      "n-senzor",
      "rtk-baze",
      "fmis",
      "ec-pudy"
    ],
    "faq": [
      {
        "q": "Jak tworzy się mapę aplikacyjną?",
        "a": "Mapa aplikacyjna jest tworzona na podstawie danych z analiz glebowych i sensorów."
      },
      {
        "q": "Do czego służy mapa aplikacyjna?",
        "a": "Służy do zmiennego dawkowania nawozów i pestycydów na polu."
      }
    ]
  },
  {
    "slug": "rtk-baze",
    "term": "Baza RTK",
    "kategorie": "precise-farming",
    "shortDef": "Baza RTK to stacja referencyjna zapewniająca wysoką dokładność nawigacji GPS w rolnictwie.",
    "longDef": "Baza RTK to stacjonarna stacja GPS dostarczająca sygnały korekcyjne w celu zwiększenia dokładności danych pozycyjnych z odbiorników GPS. Technologia RTK umożliwia osiągnięcie dokładności pozycjonowania na poziomie centymetrów.\n\nW rolnictwie baza RTK jest wykorzystywana do precyzyjnego sterowania maszynami, takimi jak siewniki, rozsiewacze nawozów i kombajny, co zwiększa efektywność i zmniejsza straty. Dokładna nawigacja umożliwia również lepsze wykorzystanie gleby i zmniejszenie zakładek przy opryskach.\n\nW Czechach technologia RTK jest coraz szerzej stosowana, szczególnie w dużych gospodarstwach rolnych inwestujących w rolnictwo precyzyjne w celu zwiększenia produktywności i zrównoważoności.",
    "related": [
      "n-senzor",
      "mapa-vra",
      "fmis",
      "senzor-vlhkosti-pudy"
    ],
    "faq": [
      {
        "q": "Co to jest baza RTK?",
        "a": "Baza RTK to stacja referencyjna zapewniająca wysoką dokładność nawigacji GPS."
      },
      {
        "q": "Jaka jest różnica między RTK a standardowym GPS?",
        "a": "RTK zapewnia dokładność na poziomie centymetrów, podczas gdy standardowy GPS na poziomie metrów."
      }
    ]
  },
  {
    "slug": "fmis",
    "term": "Rolniczy system informacyjny (FMIS)",
    "kategorie": "precise-farming",
    "shortDef": "FMIS to system informatyczny do zarządzania i optymalizacji operacji i zasobów rolniczych.",
    "longDef": "Rolniczy system informacyjny (FMIS) to kompleksowa platforma informatyczna integrująca dane z różnych źródeł, takich jak sensory, GPS i mapy aplikacyjne, w celu efektywnego zarządzania działalnością rolniczą.\n\nFMIS umożliwia rolnikom planowanie i monitorowanie operacji, optymalizację wykorzystania zasobów oraz poprawę procesów decyzyjnych. System wspiera również śledzenie kosztów, plonów i spełnianie wymogów legislacyjnych.\n\nW Czechach FMIS staje się ważnym narzędziem dla nowoczesnych rolników dążących do zwiększenia efektywności i zrównoważoności swoich gospodarstw i jest często integrowany z innymi technologiami rolnictwa precyzyjnego.",
    "related": [
      "n-senzor",
      "mapa-vra",
      "rtk-baze",
      "ec-pudy"
    ],
    "faq": [
      {
        "q": "Co to jest FMIS?",
        "a": "FMIS to system informatyczny do zarządzania i optymalizacji operacji i zasobów rolniczych."
      },
      {
        "q": "Jakie funkcje oferuje FMIS?",
        "a": "FMIS oferuje funkcje takie jak planowanie, monitorowanie i analiza działalności rolniczej."
      }
    ]
  },
  {
    "slug": "ec-pudy",
    "term": "Przewodność elektryczna gleby (EC)",
    "kategorie": "precise-farming",
    "shortDef": "Przewodność elektryczna gleby to pomiar zdolności gleby do przewodzenia prądu elektrycznego, wskazujący na jej właściwości.",
    "longDef": "Przewodność elektryczna gleby (EC) to wskaźnik mierzący zdolność gleby do przewodzenia prądu elektrycznego. Pomiar ten dostarcza informacji o strukturze gleby, zawartości soli i wilgotności, które są kluczowymi czynnikami dla wzrostu roślin.\n\nW rolnictwie pomiar EC jest wykorzystywany do mapowania zmienności gleby na polach, co pomaga w podejmowaniu decyzji o zastosowaniu nawozów i nawadnianiu. Wyższa EC może wskazywać na wyższą zawartość składników odżywczych, ale też na potencjalne problemy z zasoleniem.\n\nW Czechach pomiar EC jest coraz częściej stosowany w ramach rolnictwa precyzyjnego, gdzie pomaga optymalizować praktyki rolnicze i zwiększać plony.",
    "related": [
      "n-senzor",
      "mapa-vra",
      "senzor-vlhkosti-pudy",
      "fmis"
    ],
    "faq": [
      {
        "q": "Co oznacza przewodność elektryczna gleby?",
        "a": "To pomiar zdolności gleby do przewodzenia prądu elektrycznego, wskazujący na jej właściwości."
      },
      {
        "q": "Jak mierzy się przewodność elektryczną gleby?",
        "a": "Mierzy się za pomocą specjalnych sensorów rejestrujących przepływ prądu elektrycznego."
      }
    ]
  },
  {
    "slug": "senzor-vlhkosti-pudy",
    "term": "Sensor wilgotności gleby",
    "kategorie": "precise-farming",
    "shortDef": "Sensor wilgotności gleby to urządzenie do pomiaru zawartości wody w glebie.",
    "longDef": "Sensor wilgotności gleby to urządzenie mierzące ilość wody w glebie. Sensory te dostarczają kluczowych informacji do efektywnego zarządzania nawadnianiem i optymalizacji wzrostu roślin uprawnych.\n\nW rolnictwie sensory wilgotności gleby są stosowane do monitorowania stanu gleby, co umożliwia precyzyjne nawadnianie i minimalizację strat wody. Dane z sensorów mogą być integrowane z rolniczymi systemami informacyjnymi w celu lepszego podejmowania decyzji.\n\nW Czechach sensory wilgotności gleby są coraz częściej stosowane w ramach rolnictwa precyzyjnego, gdzie pomagają zwiększać efektywność wykorzystania wody i poprawiać plony.",
    "related": [
      "n-senzor",
      "mapa-vra",
      "rtk-baze",
      "ec-pudy"
    ],
    "faq": [
      {
        "q": "Co to jest sensor wilgotności gleby?",
        "a": "To urządzenie do pomiaru zawartości wody w glebie."
      },
      {
        "q": "Jak działa sensor wilgotności gleby?",
        "a": "Działa na zasadzie pomiaru przewodności elektrycznej lub pojemności gleby."
      }
    ]
  },
  {
    "slug": "matif",
    "term": "MATIF (paryska giełda towarowa)",
    "kategorie": "dotace",
    "shortDef": "MATIF to paryska giełda towarowa specjalizująca się w obrocie kontraktami futures.",
    "longDef": "MATIF, znana jako paryska giełda towarowa, to znacząca europejska giełda skupiająca się na obrocie kontraktami futures na towary rolne i produkty finansowe. \n\nGiełda zapewnia platformę do handlu towarami, takimi jak pszenica, kukurydza i inne produkty rolne, co umożliwia producentom i handlowcom zabezpieczanie cen i zarządzanie ryzykiem. \n\nW Czechach MATIF służy jako punkt odniesienia do ustalania cen towarów rolnych, co jest ważne dla producentów przy planowaniu i zawieraniu umów handlowych.",
    "alias": [
      "MATIF",
      "Giełda Paryska"
    ],
    "related": [
      "komoditni-burza",
      "forwardovy-kontrakt",
      "bazicka-cena",
      "intervencni-nakup"
    ],
    "faq": [
      {
        "q": "Co to jest MATIF?",
        "a": "MATIF to paryska giełda towarowa specjalizująca się w obrocie kontraktami futures."
      },
      {
        "q": "Jakimi towarami handluje się na MATIF?",
        "a": "Na MATIF handluje się towarami rolnymi, takimi jak pszenica, kukurydza i rzepak."
      },
      {
        "q": "Jak przebiega handel na MATIF?",
        "a": "Handel na MATIF odbywa się za pośrednictwem kontraktów futures umożliwiających spekulację na przyszłe ceny towarów."
      }
    ]
  },
  {
    "slug": "intervencni-nakup",
    "term": "Skup interwencyjny",
    "kategorie": "dotace",
    "shortDef": "Skup interwencyjny to mechanizm, za pomocą którego państwo stabilizuje rynek towarowy.",
    "longDef": "Skup interwencyjny to instrument ekonomiczny stosowany przez państwa lub organizacje ponadnarodowe w celu regulacji cen towarów rolnych na rynku. \n\nCelem skupu interwencyjnego jest stabilizacja cen i ochrona dochodów rolników w czasie, gdy ceny rynkowe spadają poniżej określonego poziomu. \n\nW Czechach instrument ten jest stosowany w ramach wspólnej polityki rolnej UE, gdzie Unia Europejska może skupować nadwyżki produkcji, utrzymując w ten sposób stabilność rynku.",
    "alias": [
      "Interwencja",
      "Zakup interwencyjny"
    ],
    "related": [
      "matif",
      "komoditni-burza",
      "bazicka-cena",
      "forwardovy-kontrakt"
    ],
    "faq": [
      {
        "q": "Do czego służy skup interwencyjny?",
        "a": "Skup interwencyjny służy do stabilizacji rynku towarowego poprzez skup nadwyżek produkcji przez państwo."
      },
      {
        "q": "Jak działa skup interwencyjny?",
        "a": "Państwo ustala cenę, po której jest gotowe skupować towary, gdy cena rynkowa spadnie poniżej tego poziomu."
      },
      {
        "q": "Jakie towary są zazwyczaj objęte skupem interwencyjnym?",
        "a": "Najczęściej dotyczy to podstawowych towarów rolnych, takich jak pszenica i mleko."
      }
    ]
  },
  {
    "slug": "komoditni-burza",
    "term": "Giełda towarowa",
    "kategorie": "dotace",
    "shortDef": "Giełda towarowa to rynek, na którym handluje się towarami, takimi jak produkty rolne i surowce.",
    "longDef": "Giełda towarowa to zorganizowany rynek, na którym handluje się fizycznymi towarami i instrumentami pochodnymi na te towary. Na giełdzie handluje się produktami takimi jak pszenica, kukurydza, ropa, metale i inne surowce, co pozwala producentom i handlowcom zabezpieczać ceny i zarządzać ryzykiem. W Czechach i Europie giełdy towarowe odgrywają kluczową rolę w ustalaniu cen produktów rolnych, co jest ważne dla planowania i strategii handlowych rolników.",
    "alias": [
      "Giełda surowców",
      "Rynek towarowy"
    ],
    "related": [
      "matif",
      "intervencni-nakup",
      "bazicka-cena",
      "forwardovy-kontrakt"
    ],
    "faq": [
      {
        "q": "Co to jest giełda towarowa?",
        "a": "Giełda towarowa to rynek, na którym handluje się fizycznymi towarami i instrumentami na nie pochodnymi."
      },
      {
        "q": "Jakimi towarami handluje się na giełdach towarowych?",
        "a": "Handluje się produktami rolnymi, surowcami energetycznymi i metalami."
      },
      {
        "q": "Jaka jest różnica między giełdą towarową a giełdą akcji?",
        "a": "Giełda towarowa handluje produktami fizycznymi i ich instrumentami pochodnymi, natomiast giełda akcji handluje papierami wartościowymi."
      }
    ]
  },
  {
    "slug": "bazicka-cena",
    "term": "Cena bazowa (basis)",
    "kategorie": "dotace",
    "shortDef": "Cena bazowa to różnica między ceną towaru na rynku lokalnym a jego ceną na rynku futures.",
    "longDef": "Cena bazowa, znana również jako basis, to różnica między ceną spot towaru na rynku lokalnym a jego ceną na rynku futures. \n\nRóżnica ta jest kluczowym wskaźnikiem dla handlowców korzystających z kontraktów futures w celu zabezpieczenia się przed wahaniami cen. \n\nW Czechach śledzenie ceny bazowej jest ważne dla rolników i handlowców przy podejmowaniu decyzji o sprzedaży lub zakupie towarów, szczególnie w związku z cenami na giełdach, takich jak MATIF.",
    "alias": [
      "Basis",
      "Cena podstawowa"
    ],
    "related": [
      "matif",
      "komoditni-burza",
      "forwardovy-kontrakt",
      "intervencni-nakup"
    ],
    "faq": [
      {
        "q": "Jak oblicza się cenę bazową?",
        "a": "Cenę bazową oblicza się jako różnicę między ceną spot towaru a jego ceną na rynku futures."
      },
      {
        "q": "Do czego służy cena bazowa?",
        "a": "Cena bazowa pomaga handlowcom i producentom podejmować decyzje o sprzedaży lub magazynowaniu towaru."
      },
      {
        "q": "Jaka jest różnica między ceną bazową a ceną futures?",
        "a": "Cena futures to cena uzgodniona na przyszłą dostawę, natomiast cena bazowa to różnica między ceną futures a ceną spot."
      }
    ]
  },
  {
    "slug": "forwardovy-kontrakt",
    "term": "Kontrakt forward",
    "kategorie": "dotace",
    "shortDef": "Kontrakt forward to umowa o przyszłej sprzedaży lub zakupie towaru po z góry ustalonej cenie.",
    "longDef": "Kontrakt forward to instrument finansowy umożliwiający dwóm stronom uzgodnienie sprzedaży lub zakupu towaru w określonym terminie w przyszłości po z góry ustalonej cenie. \n\nTen typ kontraktu jest często stosowany w celu zabezpieczenia się przed wahaniami cen na rynku, co jest ważne dla producentów i handlowców. \n\nW Czechach kontrakty forward są powszechnie stosowane w rolnictwie w celu zapewnienia stabilnych dochodów i planowania produkcji, szczególnie w związku z cenami na giełdach, takich jak MATIF.",
    "alias": [
      "Forward",
      "Kontrakt terminowy"
    ],
    "related": [
      "matif",
      "komoditni-burza",
      "bazicka-cena",
      "intervencni-nakup"
    ],
    "faq": [
      {
        "q": "Co to jest kontrakt forward?",
        "a": "Kontrakt forward to umowa o przyszłej sprzedaży lub zakupie towaru po z góry ustalonej cenie."
      },
      {
        "q": "Jaka jest różnica między kontraktem forward a futures?",
        "a": "Kontrakt forward to indywidualna umowa między dwiema stronami, natomiast kontrakt futures jest wystandaryzowany i notowany na giełdzie."
      },
      {
        "q": "Do czego służą kontrakty forward?",
        "a": "Kontrakty forward służą do zabezpieczenia się przed wahaniami cen i planowania przyszłych dostaw."
      }
    ]
  },
  {
    "slug": "skladne",
    "term": "Opłata magazynowa",
    "kategorie": "dotace",
    "shortDef": "Opłata magazynowa to należność za przechowywanie towarów w magazynach.",
    "longDef": "Opłata magazynowa, znana też jako opłata za składowanie, to kwota pobierana za przechowywanie towarów w magazynach przez określony czas. \n\nOpłata ta pokrywa koszty magazynowania, takie jak energia, konserwacja i zabezpieczenie, i jest ważnym czynnikiem przy kalkulacji całkowitych kosztów handlu towarami. \n\nW Czechach opłata magazynowa jest powszechnie pobierana od rolników i handlowców, którzy muszą przechowywać swoje produkty przed ich sprzedażą lub dystrybucją.",
    "alias": [
      "Opłata za magazynowanie",
      "Koszty składowania"
    ],
    "related": [
      "komoditni-burza",
      "forwardovy-kontrakt",
      "bazicka-cena",
      "intervencni-nakup"
    ],
    "faq": [
      {
        "q": "Co to jest opłata magazynowa?",
        "a": "Opłata magazynowa to należność za przechowywanie towarów w magazynach."
      },
      {
        "q": "Jak ustala się wysokość opłaty magazynowej?",
        "a": "Wysokość opłaty magazynowej jest zazwyczaj ustalana na podstawie czasu składowania i objętości towaru."
      },
      {
        "q": "Dlaczego opłata magazynowa jest ważna?",
        "a": "Opłata magazynowa jest ważna dla pokrycia kosztów konserwacji i eksploatacji obiektów magazynowych."
      }
    ]
  },
  {
    "slug": "susina",
    "term": "Sucha masa (% suchej masy)",
    "kategorie": "jednotky",
    "shortDef": "Sucha masa to udział stałej materii w materiale po usunięciu wody, wyrażony w procentach.",
    "longDef": "Sucha masa to ilość stałej materii pozostająca po usunięciu całej wody z materiału, wyrażona w procentach. Stosuje się ją do oceny jakości pasz, roślin uprawnych i innych produktów rolnych, ponieważ dostarcza informacji o zawartości składników odżywczych. W praktyce suchą masę często mierzy się za pomocą suszarek lub specjalistycznego sprzętu laboratoryjnego. W Czechach sucha masa jest ważnym parametrem przy ocenie jakości pasz dla zwierząt gospodarskich.",
    "alias": [
      "sucha masa"
    ],
    "related": [
      "digestat",
      "kejda",
      "hnuj"
    ],
    "faq": [
      {
        "q": "Jak mierzy się suchą masę?",
        "a": "Suchą masę mierzy się poprzez suszenie próbki w określonej temperaturze, aż osiągnie stałą masę."
      },
      {
        "q": "Dlaczego sucha masa jest ważna w rolnictwie?",
        "a": "Sucha masa jest kluczowa dla oceny jakości pasz i szacowania plonów roślin uprawnych."
      }
    ]
  },
  {
    "slug": "nel",
    "term": "NEL – netto energia laktacji",
    "kategorie": "jednotky",
    "shortDef": "NEL to jednostka mierząca dostępną energię do produkcji mleka u krów mlecznych.",
    "longDef": "Netto energia laktacji (NEL) to jednostka stosowana do wyrażenia ilości energii, jaką pasza dostarcza do produkcji mleka u krów mlecznych. Wartość ta uwzględnia energię potrzebną do utrzymania i wzrostu zwierzęcia. NEL oblicza się na podstawie zawartości energii w paszy i jej strawności. W praktyce jest stosowana do optymalizacji dawek pokarmowych i zapewnienia efektywnej produkcji mleka. W Czechach NEL jest kluczowym parametrem przy formułowaniu mieszanek paszowych dla bydła mlecznego.",
    "alias": [
      "netto energia laktacji"
    ],
    "related": [
      "ecm-mleko",
      "laktacni-krivka",
      "krizeni-plemen",
      "vykrm-skotu"
    ],
    "faq": [
      {
        "q": "Jak oblicza się NEL?",
        "a": "NEL oblicza się na podstawie zawartości energetycznej paszy dostępnej do produkcji mleka."
      },
      {
        "q": "Do czego służy NEL w hodowli krów mlecznych?",
        "a": "NEL służy do optymalizacji dawek pokarmowych dla maksymalnej produkcji mleka przy zachowaniu zdrowia krów."
      }
    ]
  },
  {
    "slug": "pdi",
    "term": "PDI – białko strawne",
    "kategorie": "jednotky",
    "shortDef": "PDI to jednostka do pomiaru ilości strawnego białka w paszy.",
    "longDef": "PDI, czyli białko strawne, to jednostka stosowana do wyrażenia ilości białka, które jest rzeczywiście strawne i możliwe do wykorzystania przez zwierzę. Wskaźnik ten jest kluczowy przy ocenie jakości pasz, szczególnie dla przeżuwaczy. Obliczenie PDI obejmuje analizę zawartości białka i jego strawności w przewodzie pokarmowym. W Czechach PDI jest stosowane przy formułowaniu mieszanek paszowych w celu zapewnienia optymalnego żywienia zwierząt gospodarskich.",
    "alias": [
      "białko strawne"
    ],
    "related": [
      "hnuj",
      "digestat",
      "kejda"
    ],
    "faq": [
      {
        "q": "Jak wyznacza się PDI?",
        "a": "PDI wyznacza się za pomocą analiz laboratoryjnych mierzących strawność białek w paszy."
      },
      {
        "q": "Dlaczego PDI jest ważne dla żywienia zwierząt?",
        "a": "PDI pomaga zapewnić, że zwierzęta otrzymują wystarczającą ilość strawnych białek do wzrostu i produkcji."
      }
    ]
  },
  {
    "slug": "vynos-t-ha",
    "term": "Plon (t/ha)",
    "kategorie": "jednotky",
    "shortDef": "Plon to ilość produkcji uzyskana z jednego hektara gleby, wyrażona w tonach.",
    "longDef": "Plon (t/ha) to kluczowa jednostka stosowana do wyrażenia ilości produkcji rolniczej zebranej z jednego hektara gleby. Wskaźnik ten jest zasadniczy dla oceny efektywności uprawy roślin i planowania działalności rolniczej. Plon zależy od wielu czynników, w tym jakości gleby, warunków klimatycznych i stosowanych metod agrotechnicznych. W Czechach plon jest ważnym parametrem do oceny ekonomicznej efektywności gospodarstw rolnych.",
    "alias": [
      "plon"
    ],
    "related": [
      "osevni-postup",
      "strip-till",
      "mulcovac"
    ],
    "faq": [
      {
        "q": "Jak oblicza się plon w tonach na hektar?",
        "a": "Plon oblicza się, dzieląc łączną produkcję w tonach przez powierzchnię uprawianej gleby w hektarach."
      },
      {
        "q": "Co wpływa na plon roślin uprawnych?",
        "a": "Na plon wpływa jakość gleby, warunki klimatyczne, stosowana agrotechnika i odmiana rośliny uprawnej."
      }
    ]
  },
  {
    "slug": "objemova-hmotnost-obili",
    "term": "Gęstość usypowa ziarna",
    "kategorie": "jednotky",
    "shortDef": "Gęstość usypowa ziarna to masa ziarna na jednostkę objętości, wyrażona w kg/m³.",
    "longDef": "Gęstość usypowa ziarna to miara gęstości zboża, wyrażająca masę w kilogramach na metr sześcienny (kg/m³). Wskaźnik ten jest ważny dla oceny jakości i zdolności przechowalniczej ziarna. Wyższa gęstość usypowa zazwyczaj oznacza lepszą jakość ziarna. Pomiar przeprowadza się za pomocą specjalnych urządzeń, takich jak wagomierze objętościowe. W Czechach gęstość usypowa jest kluczowym parametrem przy obrocie zbożem i ustalaniu ceny.",
    "alias": [
      "gęstość usypowa"
    ],
    "related": [
      "komoditni-burza",
      "intervencni-nakup",
      "matif",
      "forwardovy-kontrakt"
    ],
    "faq": [
      {
        "q": "Jak mierzy się gęstość usypową ziarna?",
        "a": "Gęstość usypową mierzy się ważąc znany objętość ziarna i obliczając masę na metr sześcienny."
      },
      {
        "q": "Dlaczego gęstość usypowa jest ważna?",
        "a": "Gęstość usypowa jest wskaźnikiem jakości ziarna."
      }
    ]
  },
  {
    "slug": "davka-l-ha",
    "term": "Dawka aplikacyjna (l/ha)",
    "kategorie": "jednotky",
    "shortDef": "Dawka aplikacyjna to ilość cieczy stosowana na jeden hektar gleby, wyrażona w litrach.",
    "longDef": "Dawka aplikacyjna (l/ha) to jednostka stosowana do wyrażenia ilości ciekłego preparatu, takiego jak nawozy lub pestycydy, stosowanego na jeden hektar gleby. Prawidłowe określenie dawki aplikacyjnej jest kluczowe dla skutecznego i bezpiecznego stosowania agrochemikaliów. Dawka zależy od rodzaju preparatu, rodzaju rośliny uprawnej i warunków środowiskowych. W Czechach dawki aplikacyjne są regulowane normami prawnymi i zaleceniami producentów w celu zapewnienia ochrony środowiska i zdrowia ludzkiego.",
    "alias": [
      "dawka aplikacyjna"
    ],
    "related": [
      "herbicidy",
      "insekticidy",
      "fungicidy",
      "adjuvant"
    ],
    "faq": [
      {
        "q": "Jak wyznacza się dawkę aplikacyjną w litrach na hektar?",
        "a": "Dawkę aplikacyjną wyznacza się na podstawie zaleceń producenta i specyficznych potrzeb rośliny uprawnej."
      },
      {
        "q": "Do czego służy dawka aplikacyjna?",
        "a": "Dawka aplikacyjna zapewnia skuteczne pokrycie powierzchni pestycydami lub nawozami."
      }
    ]
  }
];

export const KATEGORIE_LABELS_PL: Record<SlovnikKategorie, string> = {
  "technologie": "Technologia",
  "pohon": "Napęd i silnik",
  "hnojivo": "Nawozy",
  "dotace": "Dopłaty rolnicze",
  "agrotechnika": "Agrotechnika",
  "regulace": "Przepisy i normy",
  "precise-farming": "Rolnictwo precyzyjne",
  "jednotky": "Jednostki i pomiary",
  "historie": "Historia i pojęcia archaiczne",
  "chov": "Hodowla i produkcja zwierzęca",
  "slang": "Wyrażenia potoczne i slang",
  "ochrana": "Ochrona roślin i opryski",
  "plodiny": "Rośliny uprawne i towary",
  "vcelarstvi": "Pszczelarstwo"
};
