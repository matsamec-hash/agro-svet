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
};

/** Texty žebříčku pro locale; cs (a neznámé locale) → undefined = použij cs originál. */
export function tierListCopy(slug: string, locale: string): TierListCopy | undefined {
  return TIER_LIST_COPY[locale]?.[slug];
}
