// Slovenská vrstva sezónní sekce. Vzor sezona.pl.ts.
//
// ‼️ MĚSÍCE SETÍ A SKLIZNĚ SE NEMĚNÍ. Jsou v plodina YAML (seti_mesice /
// sklizen_mesice) a pro Česko i Slovensko vycházejí na měsíční granularitě
// stejně — obě země leží ve stejném pásu. Stránka to říká nahlas (`sez.note`).
//
// ‼️ ODKAZY NA PRÁCE se na rozdíl od pl NEMĚNÍ: /jak-na-to i /pruvodce jsou pro
// sk launchnuté a cílové stránky pod /sk/ existují (ověřeno), takže stačí
// přeložit popisky. localizeInternalHref si prefix doplní sám.
import type { SeasonSlug, SeasonContent } from './sezona';

export const MONTH_NAMES_SK = [
  'január', 'február', 'marec', 'apríl', 'máj', 'jún',
  'júl', 'august', 'september', 'október', 'november', 'december',
];

/** Slovenské zkratky měsíců — „máj/jún/júl" se nekryjí, na rozdíl od češtiny. */
export const MONTH_SHORT_SK = [
  'jan', 'feb', 'mar', 'apr', 'máj', 'jún',
  'júl', 'aug', 'sep', 'okt', 'nov', 'dec',
];

/** Názvy ročních období; slugy zůstávají cs (jsou to URL klíče). */
export const SEASON_NAMES_SK: Record<SeasonSlug, string> = {
  jaro: 'Jar', leto: 'Leto', podzim: 'Jeseň', zima: 'Zima',
};

export const SEASON_CONTENT_SK: Record<SeasonSlug, SeasonContent> = {
  jaro: {
    lead: `Na jar sa na poli sejú jariny — jarný jačmeň, jarná pšenica, mak, slnečnica, cukrová repa aj kukurica. Hlavné práce sú príprava sejbového lôžka, jarné hnojenie dusíkom a včasná sejba; neskorý výsev jarín znižuje úrodu.`,
    workLinks: [
      { href: '/jak-na-to/jak-nastavit-seci-stroj/', label: `Ako nastaviť sejačku` },
      { href: '/pruvodce/jak-vybrat-postrikovac/', label: `Ako vybrať postrekovač` },
      { href: '/pruvodce/jak-vybrat-rozmetadlo-hnojiv/', label: `Ako vybrať rozmetadlo hnojív` },
    ],
    faq: [
      { q: `Čo sa na poli seje na jar?`, a: `Na jar (marec–máj) sa sejú jariny: jarný jačmeň a pšenica (február–marec), ďalej mak, cukrová repa, slnečnica (marec–apríl) a kukurica so sójou (apríl–máj).` },
      { q: `Prečo je pri jarinách dôležitý skorý výsev?`, a: `Skorý výsev využíva jarnú pôdnu vlahu a predlžuje vegetáciu. Každý týždeň omeškania môže pri jarnom jačmeni znížiť úrodu o 0,2–0,3 t/ha a zhoršiť kvalitu.` },
      { q: `Aké sú hlavné jarné práce na poli?`, a: `Príprava sejbového lôžka, smykovanie a vláčenie, jarné prihnojenie ozimín dusíkom, sejba jarín a prvé ošetrenie porastov proti burinám a chorobám.` },
    ],
  },
  leto: {
    lead: `V lete vrcholí zber: ozimný jačmeň (jún), ozimná pšenica, raž, tritikale a hrach (júl), potom repka a jarné obilniny (júl–august). Súbežne prebieha kosba krmovín a balíkovanie slamy a sena.`,
    workLinks: [
      { href: '/pruvodce/jak-vybrat-kombajn-stredni-farma/', label: `Ako vybrať kombajn pre strednú farmu` },
      { href: '/pruvodce/jak-vybrat-seci-stroj/', label: `Ako vybrať žací stroj` },
      { href: '/pruvodce/jak-vybrat-lis-na-baliky/', label: `Ako vybrať lis na balíky` },
    ],
    faq: [
      { q: `Čo sa zbiera v lete?`, a: `V júni ozimný jačmeň, v júli ozimná pšenica, raž, tritikale, repka a hrach, v auguste jarné obilniny, mak a jarná repka.` },
      { q: `Pri akej vlhkosti zrna zbierať obilniny?`, a: `Obilniny sa zbierajú pri vlhkosti zrna približne 13–15 %. Vyššia vlhkosť si vyžaduje dosúšanie, nižšia zvyšuje straty vydrolením.` },
      { q: `Aké letné práce okrem zberu?`, a: `Kosba a zber krmovín (ďatelina, lucerna), lisovanie slamy a sena, podmietka po zbere a príprava na sejbu medziplodín či ozimnej repky.` },
    ],
  },
  podzim: {
    lead: `Na jeseň sa zakladajú oziminy — ozimná repka (august–september), ozimná pšenica, jačmeň, raž a tritikale (september–október). Dokončuje sa zber okopanín: zemiaky, cukrová repa, kukurica a slnečnica. Kľúčová je podmietka a jesenné spracovanie pôdy.`,
    workLinks: [
      { href: '/jak-na-to/jak-seridit-pluh/', label: `Ako nastaviť pluh` },
      { href: '/pruvodce/jak-vybrat-rozmetadlo-hnojiv/', label: `Ako vybrať rozmetadlo hnojív` },
      { href: '/pruvodce/jak-vybrat-kombajn-stredni-farma/', label: `Ako vybrať kombajn pre strednú farmu` },
    ],
    faq: [
      { q: `Čo sa seje na jeseň?`, a: `Oziminy: ozimná repka (august–september), ozimná pšenica, ozimný jačmeň, raž a tritikale (september–október). Termín sejby ozimín je kľúčový pre prezimovanie.` },
      { q: `Čo sa zbiera na jeseň?`, a: `Okopaniny a neskoré plodiny: zemiaky (august–október), cukrová repa (september–november), kukurica a slnečnica (september–október).` },
      { q: `Prečo je dôležitá podmietka?`, a: `Podmietka po zbere prerušuje kapilaritu, podporuje vzchádzanie výdrvu a burín na následnú likvidáciu a zapracúva pozberové zvyšky — základ prípravy pôdy pre oziminy.` },
    ],
  },
  zima: {
    lead: `V zime poľné práce odpočívajú. Je čas na údržbu a nastavenie techniky, plánovanie osevného postupu, nákup osív a hnojív a vybavenie dotácií. Oziminy prezimujú; sleduje sa ich stav a hrozba vyzimovania.`,
    workLinks: [
      { href: '/pruvodce/kontrola-ojeteho-traktoru/', label: `Kontrola jazdeného traktora` },
      { href: '/pruvodce/prvni-traktor-mlady-zemedelec/', label: `Prvý traktor pre mladého farmára` },
    ],
    faq: [
      { q: `Aké práce robiť na poli v zime?`, a: `Poľné práce v zime väčšinou stoja. Čas sa využíva na servis a nastavenie strojov, plánovanie osevných postupov, nákup vstupov (osivo, hnojivá) a administratívu dotácií.` },
      { q: `Čo sa deje s oziminami v zime?`, a: `Oziminy prezimujú v pokojovom stave. Sleduje sa snehová pokrývka, riziko vyzimovania pri holomrazoch a výskyt plesne snežnej; jarná regenerácia sa začína s oteplením.` },
    ],
  },
};
