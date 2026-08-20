// Polská vrstva sezónní sekce.
//
// ‼️ MĚSÍCE SETÍ A SKLIZNĚ SE NEMĚNÍ. Jsou v plodina YAML (seti_mesice /
// sklizen_mesice) a pro Česko i Polsko vycházejí na měsíční granularitě stejně —
// obě země leží ve stejném pásu (Praha 50° / Varšava 52° s. š.). Stránka to ale
// říká nahlas (`sez.note`), aby to nevypadalo jako polsky měřená data.
//
// ‼️ ODKAZY NA PRÁCE se NEPŘEKLÁDAJÍ — cs míří na /jak-na-to a /pruvodce, které
// pro pl nejsou launchnuté. Nahrazené reálnými /poradniki (polský how-to obsah).
import type { SeasonSlug, SeasonContent } from './sezona';

export const MONTH_NAMES_PL = [
  'styczeń', 'luty', 'marzec', 'kwiecień', 'maj', 'czerwiec',
  'lipiec', 'sierpień', 'wrzesień', 'październik', 'listopad', 'grudzień',
];

/** Polské zkratky měsíců — na rozdíl od češtiny se „czerwiec"/„lipiec" nekryjí. */
export const MONTH_SHORT_PL = [
  'sty', 'lut', 'mar', 'kwi', 'maj', 'cze',
  'lip', 'sie', 'wrz', 'paź', 'lis', 'gru',
];

/** Názvy ročních období; slugy zůstávají cs (jsou to URL klíče). */
export const SEASON_NAMES_PL: Record<SeasonSlug, string> = {
  jaro: 'Wiosna', leto: 'Lato', podzim: 'Jesień', zima: 'Zima',
};

export const SEASON_CONTENT_PL: Record<SeasonSlug, SeasonContent> = {
  jaro: {
    lead: `Na wiosnę na polu sieje się zboża jare — jęczmień jary, pszenicę jarą, mak, słonecznik, buraki cukrowe i kukurydzę. Główne prace to przygotowanie łoża siewnego, wiosenne nawożenie azotem i terminowe siewy; opóźniony siew zbóż jarych obniża plon.`,
    workLinks: [
      { href: '/poradniki/regulacja-siewnika-przed-siewem/', label: `Regulacja siewnika przed siewem` },
      { href: '/poradniki/przygotowanie-gleby-pod-siew/', label: `Przygotowanie gleby pod siew` },
      { href: '/poradniki/jak-wybrac-opryskiwacz-polowy/', label: `Jak wybrać opryskiwacz polowy` },
    ],
    faq: [
      { q: `Co się sieje na polu na wiosnę?`, a: `Na wiosnę (marzec–maj) sieje się zboża jare: jęczmień jary i pszenicę jarą (luty–marzec), a także mak, buraki cukrowe, słonecznik (marzec–kwiecień) oraz kukurydzę z soją (kwiecień–maj).` },
      { q: `Dlaczego w przypadku zbóż jarych ważny jest wczesny siew?`, a: `Wczesny siew wykorzystuje wiosenną wilgotność gleby i wydłuża wegetację. Każdy tydzień opóźnienia może obniżyć plon jęczmienia jarego o 0,2–0,3 t/ha i pogorszyć jakość.` },
      { q: `Jakie są główne wiosenne prace na polu?`, a: `Przygotowanie łoża siewnego, włókowanie i bronowanie, wiosenne nawożenie ozimin azotem, siew zbóż jarych oraz pierwsze zabiegi ochrony łanów przed chwastami i chorobami.` },
    ],
  },
  leto: {
    lead: `Latem następuje szczyt zbiorów: jęczmień ozimy (czerwiec), pszenica ozima, żyto, triticale i groch (lipiec), a następnie rzepak i zboża jare (lipiec–sierpień). Równocześnie odbywa się koszenie roślin pastewnych oraz pakowanie słomy i siana.`,
    workLinks: [
      { href: '/poradniki/przygotowanie-kombajnu-do-zniw/', label: `Przygotowanie kombajnu do żniw` },
      { href: '/poradniki/jak-wybrac-prase-do-bel/', label: `Jak wybrać prasę do bel` },
      { href: '/poradniki/przeglad-sezonowy-ciagnika/', label: `Przegląd sezonowy ciągnika` },
    ],
    faq: [
      { q: `Co się zbiera latem?`, a: `W czerwcu jęczmień ozimy, w lipcu pszenica ozima, żyto, triticale, rzepak i groch, w sierpniu zboża jare, mak i rzepak jary.` },
      { q: `Przy jakiej wilgotności ziarna zbierać zboża?`, a: `Zboża zbiera się przy wilgotności ziarna wynoszącej około 13–15 %. Wyższa wilgotność wymaga dosuszania, a niższa zwiększa straty przez wypadanie.` },
      { q: `Jakie prace letnie oprócz zbiorów?`, a: `Koszenie i zbiór roślin pastewnych (koniczyna, lucerna), prasowanie słomy i siana, podorywka po zbiorach oraz przygotowanie do siewu międzyplonów lub ozimego rzepaku.` },
    ],
  },
  podzim: {
    lead: `Na jesieni zakłada się oziminy — rzepak ozimy (sierpień–wrzesień), pszenicę ozimą, jęczmień, żyto i triticale (wrzesień–październik). Kończy się zbiór okopowych: ziemniaków, buraków cukrowych, kukurydzy i słonecznika. Kluczowa jest podorywka i jesienne przygotowanie gleby.`,
    workLinks: [
      { href: '/poradniki/uprawa-pszenicy-ozimej-krok-po-kroku/', label: `Uprawa pszenicy ozimej krok po kroku` },
      { href: '/poradniki/uprawa-rzepaku-ozimego-krok-po-kroku/', label: `Uprawa rzepaku ozimego krok po kroku` },
      { href: '/poradniki/przygotowanie-gleby-pod-siew/', label: `Przygotowanie gleby pod siew` },
    ],
    faq: [
      { q: `Co się sieje na jesieni?`, a: `Oziminy: rzepak ozimy (sierpień–wrzesień), pszenica ozima, jęczmień ozimy, żyto i triticale (wrzesień–październik). Termin siewu ozimin jest kluczowy dla przezimowania.` },
      { q: `Co się zbiera na jesieni?`, a: `Okopowe i późne plony: ziemniaki (sierpień–październik), buraki cukrowe (wrzesień–listopad), kukurydza i słonecznik (wrzesień–październik).` },
      { q: `Dlaczego podorywka jest ważna?`, a: `Podorywka po zbiorach przerywa kapilarność, wspiera wschody samosiewów i chwastów do późniejszej likwidacji oraz zakopuje resztki pożniwne — podstawę przygotowania gleby dla ozimów.` },
    ],
  },
  zima: {
    lead: `Zimą prace polowe odpoczywają. To czas na konserwację i regulację sprzętu, planowanie płodozmianu, zakup nasion i nawozów oraz załatwianie dotacji. Oziminy przezimują; monitoruje się ich stan oraz zagrożenie wymarznięciem.`,
    workLinks: [
      { href: '/poradniki/kontrola-uzywanego-ciagnika-przed-zakupem/', label: `Kontrola używanego ciągnika przed zakupem` },
      { href: '/poradniki/jak-wybrac-ciagnik-do-gospodarstwa/', label: `Jak wybrać ciągnik do gospodarstwa` },
    ],
    faq: [
      { q: `Jakie prace wykonywać na polu zimą?`, a: `Prace polowe zimą zazwyczaj stoją. Wykorzystuje się czas na serwis i regulację maszyn, planowanie płodozmianów, zakup środków (nasiona, nawozy) oraz administrację dotacji.` },
      { q: `Co dzieje się z oziminami zimą?`, a: `Oziminy przezimują w stanie spoczynku. Monitoruje się pokrywę śnieżną, ryzyko wymarznięcia podczas mrozów oraz występowanie pleśni śnieżnej; wiosenna regeneracja zaczyna się wraz z ociepleniem.` },
    ],
  },
};
