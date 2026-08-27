// Per-locale texty žebříčků. Struktura, filtry a řazení zůstávají v
// tier-lists.ts (jsou to funkce nad strojními daty, ne text) — tady žije JEN
// próza, kterou má smysl překládat. Chybí-li locale nebo slug, padá se na cs.
//
// Žebříčky jsou odvozené z katalogu strojů, takže nejsou nijak jurisdikčně
// vázané — na rozdíl od /pruvodce (Kč, SZIF) nebo /prehled (české registrace).
export interface TierListCopy {
  title: string;
  description: string;
  methodology: string;
  callToAction: string;
}

export const TIER_LIST_COPY: Record<string, Record<string, TierListCopy>> = {
  pl: {
    'traktory-do-100-koni': {
      title: `Najlepsze traktory do 100 KM`,
      description: `Ranking najwydajniejszych traktorów o mocy do 100 KM (74 kW). Odpowiednie dla mniejszych gospodarstw, sadów i zastosowań komunalnych.`,
      methodology: `Modele uporządkowane według mocy malejąco. Z każdej serii uwzględniona tylko najwydajniejsza wersja, aby ranking nie był zbyt obciążony modelami pokrewnymi.`,
      callToAction: `Szukasz czegoś mocniejszego? Zobacz ranking 100–150 KM lub 150–250 KM.`,
    },
    'traktory-100-150-koni': {
      title: `Najlepsze traktory 100–150 KM`,
      description: `Ranking średniej wielkości traktorów 100–150 KM. Standard do typowych prac polowych w Polsce — orka, siewniki, średniej wielkości maszyny rolnicze.`,
      methodology: `Modele uporządkowane według mocy malejąco. Skupiamy się na głównych europejskich seriach (JD 6M/6R, Fendt 500, NH T6, Case Maxxum, Zetor Forterra, MF 5S/6S).`,
      callToAction: `Dla większych farm sprawdź ranking 150–250 KM.`,
    },
    'traktory-150-250-koni': {
      title: `Najlepsze traktory 150–250 KM`,
      description: `Duże traktory dla średnich i większych farm w Polsce. 150–250 KM pokrywa większość prac polowych, w tym głęboką orkę i zbiory przyczepne.`,
      methodology: `Modele uporządkowane według mocy malejąco. Głównie Fendt 700, JD 6R/7R, NH T7, Case Puma/Magnum, MF 7S/8S, Deutz 7-Series.`,
      callToAction: `Dla największych farm lub specjalnych zadań zobacz ranking powyżej 250 KM.`,
    },
    'traktory-nad-250-koni': {
      title: `Najwydajniejsze traktory powyżej 250 KM`,
      description: `Czołówka rynku — traktory o mocy powyżej 250 KM dla dużych farm, prac leśnych i specjalnych zastosowań. Zwykle flagowce marek.`,
      methodology: `Modele uporządkowane według mocy malejąco. Zawiera JD 8R/9R/9RX, Fendt 900/1000, NH T8/T9, Case Magnum/Steiger/Quadtrac, Claas Xerion.`,
      callToAction: `Szukasz czegoś mniejszego? Ranking 150–250 KM oferuje praktyczniejsze opcje dla przeciętnej polskiej farmy.`,
    },
    'kombajny-nejvykonnejsi': {
      title: `Najbardziej wydajne kombajny`,
      description: `Ranking najbardziej wydajnych kombajnów zbożowych. Oceniane według mocy silnika — szerokość stołu żniwnego oraz pojemność zbiornika są szczegółowo opisane w tekście.`,
      methodology: `Kombajny uporządkowane według mocy silnika malejąco. Klasy IX i X (300+ KM), najlepsze modele Claas Lexion, JD S/T, Case Axial-Flow, NH CR/CX.`,
      callToAction: `Dla mniejszych gospodarstw rozważcie kombajny o niższej mocy — cena zakupu jest znacznie niższa, a pojemność zazwyczaj wystarczająca.`,
    },
    'kombajny-do-300-koni': {
      title: `Najlepsze kombajny do 300 KM`,
      description: `Kombajny zbożowe dla mniejszych i średnich gospodarstw 50–500 ha. Klasy III–VI o mocy do 300 KM — niższa cena zakupu, wystarczająca pojemność na standardowe żniwa.`,
      methodology: `Modele uporządkowane według mocy silnika malejąco. Głównie Claas Avero / Tucano / Trion, JD T-Series 500/600, Case Axial-Flow 4000/5000, NH TC/CX.`,
      callToAction: `Dla dużych gospodarstw powyżej 500 ha zobacz ranking najbardziej wydajnych kombajnów.`,
    },
    'kombajny-nad-500-koni': {
      title: `Flagship kombajny powyżej 500 KM`,
      description: `Czołówka rynku — kombajny o mocy powyżej 500 KM dla dużych gospodarstw i przedsiębiorstw zbiorowych. Klasa X+ z największymi stołami żniwnymi (do 18 m) i zbiornikami (14+ tysięcy litrów).`,
      methodology: `Kombajny uporządkowane według mocy silnika malejąco. Flagshipi Claas Lexion 8000/8900, JD X9, Case Axial-Flow 9250, NH CR10.90, Fendt IDEAL 9/10T.`,
      callToAction: `Dla typowego polskiego gospodarstwa te maszyny są przewymiarowane — zobacz niższe rankingi.`,
    },
    'traktory-klasiky-pre-2000': {
      title: `Klasyczne traktory sprzed 2000 roku`,
      description: `Ranking historycznych traktorów wprowadzonych przed rokiem 2000 — kolekcjonerskie i nadal eksploatowane klasyki. Często z mechanicznymi skrzyniami biegów i solidną konstrukcją, która przetrwa.`,
      methodology: `Modele wprowadzone do 1999 roku, uporządkowane według mocy malejąco. De-dup per seria dla przeglądu wśród marek.`,
      callToAction: `Szukasz aktualnie produkowanej maszyny? Zobacz rankingi według mocy.`,
    },
    'traktory-male-kompaktni': {
      title: `Najlepsze małe / kompaktne traktory (do 60 KM)`,
      description: `Kompaktne traktory do sadów, winnic, użytku komunalnego i gospodarstw hobbystycznych. Moc do 60 KM, krótszy promień skrętu, lepsza manewrowość.`,
      methodology: `Modele o mocy do 60 KM uporządkowane malejąco. Głównie Kubota L-Series, JD 3R, Massey Ferguson 1700E, Iseki, Zetor Major.`,
      callToAction: `Dla średnich gospodarstw zobacz ranking traktorów do 100 KM.`,
    },
    'nejsirsi-diskove-podmitace': {
      title: `Najszersze talerzowe podorywacze`,
      description: `Ranking talerzowych podorywaczy według szerokości roboczej. Szerszy zasięg = wyższa wydajność powierzchniowa, ale wyższe wymagania dotyczące mocy traktora. Odpowiednie do płytkiego przetwarzania słomy.`,
      methodology: `Modele uporządkowane według szerokości roboczej malejąco. Z każdej serii tylko najszersza wersja. Wśród marek Amazone, Bednar, Horsch, Väderstad, Pöttinger.`,
      callToAction: `Szukasz głębszego przetwarzania? Zobacz ranking radlicowych podorywaczy i kultywatorów.`,
    },
    'nejsirsi-radlickove-podmitace': {
      title: `Najszersze radlicowe podorywacze`,
      description: `Ranking radlicowych (dziobowych) podorywaczy według szerokości roboczej. Radlice pracują głębiej niż talerze — odpowiednie do spulchniania i naruszania zagęszczonych warstw.`,
      methodology: `Modele uporządkowane według szerokości roboczej malejąco, de-dup per seria. Wśród marek Amazone, Bednar, Horsch, Väderstad, Pöttinger.`,
      callToAction: `Dla płytkiego przetwarzania słomy zobacz ranking talerzowych podorywaczy.`,
    },
    'nejsirsi-seci-kombinace': {
      title: `Najszersze zestawy siewne`,
      description: `Ranking zestawów siewnych (przygotowanie gleby + siew w jednym przejeździe) według szerokości roboczej. Oszczędność przejazdów i czasu przy zakładaniu upraw.`,
      methodology: `Modele uporządkowane według szerokości roboczej malejąco, de-dup per seria. Wśród marek Amazone, Horsch, Väderstad, Pöttinger, Bednar.`,
      callToAction: `Dla samodzielnych maszyn siewnych zobacz ranking pneumatycznych i precyzyjnych maszyn siewnych.`,
    },
    'nejsirsi-pneumaticke-seci-stroje': {
      title: `Najszersze pneumatyczne siewniki`,
      description: `Ranking pneumatycznych (siewnych) siewników według szerokości roboczej. Pneumatyczne rozprowadzanie nasion umożliwia większy zasięg i dokładniejsze dawkowanie.`,
      methodology: `Modele uporządkowane według szerokości roboczej malejąco, de-dup per seria. Wśród pięciu głównych marek na polskim rynku.`,
      callToAction: `Dla precyzyjnego siewu (kukurydza, burak, słonecznik) zobacz ranking precyzyjnych siewników.`,
    },
    'nejsirsi-presne-seci-stroje': {
      title: `Najszersze precyzyjne siewniki`,
      description: `Ranking precyzyjnych (jednoziarnowych) siewników według szerokości roboczej. Dla kukurydzy, buraka i słonecznika — precyzyjne rozmieszczenie pojedynczych ziaren.`,
      methodology: `Modele uporządkowane według szerokości roboczej malejąco, de-dup per seria. Zasięg w precyzyjnych siewnikach zazwyczaj odpowiada liczbie rzędów × odległość międzyrzędowa.`,
      callToAction: `Dla gęsto siewnych roślin (zboża) zobacz ranking pneumatycznych siewników.`,
    },
    'nejsirsi-kyprice': {
      title: `Najszersze kultywatory`,
      description: `Ranking kultywatorów według szerokości roboczej. Kultywatory przetwarzają glebę na średnią i większą głębokość bez odwracania — podstawowa technologia minimalizacji.`,
      methodology: `Modele uporządkowane według szerokości roboczej malejąco, de-dup per seria. Wśród marek Amazone, Bednar, Horsch, Väderstad, Pöttinger.`,
      callToAction: `Dla płytkiego ścierniskowego zobacz brony talerzowe, dla siewu zobacz kombinacje siewne.`,
    },
    'nejsirsi-zaci-stroje': {
      title: `Najszersze maszyny do koszenia`,
      description: `Ranking maszyn do koszenia (na pasze) według szerokości roboczej. Większy zasięg skraca czas koszenia i wykorzystuje pogodę — kluczowe podczas zbioru pasz objętościowych.`,
      methodology: `Modele uporządkowane według szerokości roboczej malejąco, de-dup per seria. Głównie kombinacje koszące Krone i Pöttinger.`,
      callToAction: `Dla zbierania i odwracania paszy zobacz odpowiednie kategorie maszyn do zbioru pasz.`,
    },
    'nejvykonnejsi-samojizdne-rezacky': {
      title: `Najbardziej wydajne samobieżne sieczkarnie`,
      description: `Ranking samobieżnych sieczkarni według mocy silnika. Do zbioru kukurydzy na kiszonkę i użytków zielonych — najbardziej wydajne maszyny w polu.`,
      methodology: `Modele uporządkowane według mocy silnika malejąco, bez duplikatów w serii. Flagowce Claas Jaguar i Krone BiG X.`,
      callToAction: `Do prasowania i zbioru paszy zobacz inne maszyny do zbioru roślin paszowych.`,
    },
  },
  sk: {
    'traktory-do-100-koni': {
      title: `Najlepšie traktory do 100 koní`,
      description: `Rebríček najvýkonnejších traktorov s výkonom do 100 koní (74 kW). Vhodné pre menšie hospodárstva, sady a komunálne použitie.`,
      methodology: `Modely zoradené podľa výkonu zostupne. Z každej série je zaradený len najvýkonnejší variant, aby rebríček nezahltili súrodenecké modely.`,
      callToAction: `Hľadáte niečo silnejšie? Pozrite rebríček 100–150 koní alebo 150–250 koní.`,
    },
    'traktory-100-150-koni': {
      title: `Najlepšie traktory 100–150 koní`,
      description: `Rebríček stredne veľkých traktorov 100–150 koní. Štandard pre bežné poľné práce na Slovensku — orba, sejacie kombinácie, stredne veľké poľnohospodárske stroje.`,
      methodology: `Modely zoradené podľa výkonu zostupne. Cielime na hlavné európske rady (JD 6M/6R, Fendt 500, NH T6, Case Maxxum, Zetor Forterra, MF 5S/6S).`,
      callToAction: `Pre väčšie farmy si pozrite rebríček 150–250 koní.`,
    },
    'traktory-150-250-koni': {
      title: `Najlepšie traktory 150–250 koní`,
      description: `Veľké traktory pre stredné a väčšie farmy na Slovensku. 150–250 koní pokrýva väčšinu poľných prác vrátane hlbokej orby a ťahaných zberových liniek.`,
      methodology: `Modely zoradené podľa výkonu zostupne. Hlavne Fendt 700, JD 6R/7R, NH T7, Case Puma/Magnum, MF 7S/8S, Deutz 7-Series.`,
      callToAction: `Pre najväčšie farmy alebo špeciálne úlohy pozrite rebríček nad 250 koní.`,
    },
    'traktory-nad-250-koni': {
      title: `Najvýkonnejšie traktory nad 250 koní`,
      description: `Špička trhu — traktory s výkonom nad 250 koní pre veľkofarmy, lesné práce a špeciálne nasadenie. Väčšinou vlajkové modely značiek.`,
      methodology: `Modely zoradené podľa výkonu zostupne. Zahŕňa JD 8R/9R/9RX, Fendt 900/1000, NH T8/T9, Case Magnum/Steiger/Quadtrac, Claas Xerion.`,
      callToAction: `Hľadáte niečo menšie? Rebríček 150–250 koní ponúka praktickejšie voľby pre priemernú slovenskú farmu.`,
    },
    'kombajny-nejvykonnejsi': {
      title: `Najvýkonnejšie kombajny`,
      description: `Rebríček najvýkonnejších zberových mláťačiek. Hodnotené podľa výkonu motora — záber žacieho stola aj kapacita zásobníka sú v texte detailu.`,
      methodology: `Zberové mláťačky zoradené podľa výkonu motora zostupne. Triedy IX a X (300+ koní), top modely Claas Lexion, JD S/T, Case Axial-Flow, NH CR/CX.`,
      callToAction: `Pre menšie farmy zvážte kombajny s nižším výkonom — obstarávacia cena je výrazne nižšia a kapacita väčšinou stačí.`,
    },
    'kombajny-do-300-koni': {
      title: `Najlepšie kombajny do 300 koní`,
      description: `Zberové mláťačky pre menšie a stredné farmy 50–500 ha. Triedy III–VI s výkonom do 300 koní — nižšia obstarávacia cena, dostatočná kapacita pre štandardné žatvy.`,
      methodology: `Modely zoradené podľa výkonu motora zostupne. Hlavne Claas Avero / Tucano / Trion, JD T-Series 500/600, Case Axial-Flow 4000/5000, NH TC/CX.`,
      callToAction: `Pre veľkofarmy nad 500 ha pozrite rebríček najvýkonnejších kombajnov.`,
    },
    'kombajny-nad-500-koni': {
      title: `Vlajkové kombajny nad 500 koní`,
      description: `Špička trhu — kombajny s výkonom nad 500 koní pre veľkofarmy a poskytovateľov zberových služieb. Trieda X+ s najväčšími žacími stolmi (až 18 m) a zásobníkmi (14+ tisíc litrov).`,
      methodology: `Zberové mláťačky zoradené podľa výkonu motora zostupne. Vlajkové lode Claas Lexion 8000/8900, JD X9, Case Axial-Flow 9250, NH CR10.90, Fendt IDEAL 9/10T.`,
      callToAction: `Pre typickú slovenskú farmu sú tieto stroje predimenzované — pozrite nižšie rebríčky.`,
    },
    'traktory-klasiky-pre-2000': {
      title: `Klasické traktory spred roku 2000`,
      description: `Rebríček historických traktorov uvedených pred rokom 2000 — zberateľské a stále prevádzkované klasiky. Často s mechanickými prevodovkami a robustnou konštrukciou, ktorá vydrží.`,
      methodology: `Modely s rokom uvedenia do roku 1999, zoradené podľa výkonu zostupne. De-dup na sériu pre prehľad naprieč značkami.`,
      callToAction: `Hľadáte aktuálne vyrábaný stroj? Pozrite rebríčky podľa výkonu.`,
    },
    'traktory-male-kompaktni': {
      title: `Najlepšie malé / kompaktné traktory (do 60 koní)`,
      description: `Kompaktné traktory pre sady, vinohrady, komunálne použitie a hobby farmy. Výkon do 60 koní, menší polomer otáčania, lepšia manévrovateľnosť.`,
      methodology: `Modely s výkonom do 60 koní zoradené zostupne. Hlavne Kubota L-Series, JD 3R, Massey Ferguson 1700E, Iseki, Zetor Major.`,
      callToAction: `Pre stredne veľké farmy pozrite rebríček traktorov do 100 koní.`,
    },
    'nejsirsi-diskove-podmitace': {
      title: `Najširšie diskové podmietače`,
      description: `Rebríček diskových podmietačov podľa pracovného záberu. Širší záber = vyšší plošný výkon, ale vyšší nárok na výkon traktora. Vhodné na plytké spracovanie strniska.`,
      methodology: `Modely zoradené podľa pracovného záberu zostupne. Z každej série len najširší variant. Naprieč značkami Amazone, Bednar, Horsch, Väderstad, Pöttinger.`,
      callToAction: `Hľadáte hlbšie spracovanie? Pozrite rebríček radličkových podmietačov a kypričov.`,
    },
    'nejsirsi-radlickove-podmitace': {
      title: `Najširšie radličkové podmietače`,
      description: `Rebríček radličkových (dlátových) podmietačov podľa pracovného záberu. Radličky pracujú hlbšie ako disky — vhodné na prekyprenie a narušenie utužených vrstiev.`,
      methodology: `Modely zoradené podľa pracovného záberu zostupne, de-dup na sériu. Naprieč značkami Amazone, Bednar, Horsch, Väderstad, Pöttinger.`,
      callToAction: `Na plytké spracovanie strniska pozrite rebríček diskových podmietačov.`,
    },
    'nejsirsi-seci-kombinace': {
      title: `Najširšie sejacie kombinácie`,
      description: `Rebríček sejacích kombinácií (príprava pôdy + sejba v jednom prejazde) podľa pracovného záberu. Úspora prejazdov a času pri zakladaní porastov.`,
      methodology: `Modely zoradené podľa pracovného záberu zostupne, de-dup na sériu. Naprieč značkami Amazone, Horsch, Väderstad, Pöttinger, Bednar.`,
      callToAction: `Pre samostatné sejačky pozrite rebríček pneumatických a presných sejačiek.`,
    },
    'nejsirsi-pneumaticke-seci-stroje': {
      title: `Najširšie pneumatické sejačky`,
      description: `Rebríček pneumatických (výsevných) sejačiek podľa pracovného záberu. Pneumatická distribúcia osiva umožňuje väčší záber a presnejšie dávkovanie.`,
      methodology: `Modely zoradené podľa pracovného záberu zostupne, de-dup na sériu. Naprieč piatimi hlavnými značkami na slovenskom trhu.`,
      callToAction: `Pre presný výsev (kukurica, repa, slnečnica) pozrite rebríček presných sejačiek.`,
    },
    'nejsirsi-presne-seci-stroje': {
      title: `Najširšie presné sejačky`,
      description: `Rebríček presných (jednozrnných) sejačiek podľa pracovného záberu. Pre kukuricu, repu a slnečnicu — presné rozmiestnenie jednotlivých zŕn.`,
      methodology: `Modely zoradené podľa pracovného záberu zostupne, de-dup na sériu. Záber presných sejačiek zvyčajne zodpovedá počtu riadkov × medziriadková vzdialenosť.`,
      callToAction: `Pre husto siate plodiny (obilniny) pozrite rebríček pneumatických sejačiek.`,
    },
    'nejsirsi-kyprice': {
      title: `Najširšie kypriče`,
      description: `Rebríček kypričov podľa pracovného záberu. Kypriče spracúvajú pôdu do strednej a väčšej hĺbky bez obracania — základ minimalizačných technológií.`,
      methodology: `Modely zoradené podľa pracovného záberu zostupne, de-dup na sériu. Naprieč značkami Amazone, Bednar, Horsch, Väderstad, Pöttinger.`,
      callToAction: `Na plytké strnisko pozrite diskové podmietače, na sejbu sejacie kombinácie.`,
    },
    'nejsirsi-zaci-stroje': {
      title: `Najširšie žacie stroje`,
      description: `Rebríček žacích strojov (na krmoviny) podľa pracovného záberu. Väčší záber skracuje čas kosby a lepšie využíva počasie — kľúčové pri zbere objemových krmív.`,
      methodology: `Modely zoradené podľa pracovného záberu zostupne, de-dup na sériu. Hlavne žacie kombinácie Krone a Pöttinger.`,
      callToAction: `Na zhrňovanie a obracanie krmovín pozrite príslušné kategórie strojov na zber krmovín.`,
    },
    'nejvykonnejsi-samojizdne-rezacky': {
      title: `Najvýkonnejšie samochodné rezačky`,
      description: `Rebríček samochodných zberových rezačiek podľa výkonu motora. Na zber kukurice na siláž a trávnych porastov — najvýkonnejšie stroje na poli.`,
      methodology: `Modely zoradené podľa výkonu motora zostupne, de-dup na sériu. Vlajkové lode Claas Jaguar a Krone BiG X.`,
      callToAction: `Na lisovanie a zber krmovín pozrite ostatné stroje na zber krmovín.`,
    },
  },
};

/** Texty žebříčku pro locale; cs (a neznámé locale) → undefined = použij cs originál. */
export function tierListCopy(slug: string, locale: string): TierListCopy | undefined {
  return TIER_LIST_COPY[locale]?.[slug];
}
