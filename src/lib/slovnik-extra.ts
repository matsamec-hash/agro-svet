import type { SlovnikTerm } from './slovnik';

// 102 nových hesel slovníku (vygenerováno, kurátorováno + fakticky ověřeno).
// Slučováno do SLOVNIK v slovnik.ts.
export const SLOVNIK_EXTRA: SlovnikTerm[] = [
  {
    "slug": "dzes",
    "term": "DZES – dobrý zemědělský a environmentální stav",
    "alias": [
      "DZES"
    ],
    "kategorie": "regulace",
    "shortDef": "DZES je soubor pravidel pro udržení půdy v dobrém zemědělském a environmentálním stavu.",
    "longDef": "DZES představuje soubor pravidel, která zemědělci musí dodržovat, aby udrželi půdu v dobrém zemědělském a environmentálním stavu. Tato pravidla zahrnují opatření na ochranu půdy, vody a biologické rozmanitosti.\n\nDZES je součástí podmíněnosti, což je systém, který propojuje zemědělské dotace s dodržováním určitých standardů. Dodržování DZES je klíčové pro získání přímých plateb a některých dalších dotací.\n\nV České republice je DZES implementován v rámci Společné zemědělské politiky EU a jeho dodržování je kontrolováno příslušnými orgány.",
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
    "shortDef": "SAPS je systém přímých plateb zemědělcům na základě obhospodařované plochy.",
    "longDef": "SAPS (Single Area Payment Scheme) je systém přímých plateb zemědělcům, který je založen na velikosti obhospodařované zemědělské plochy. Tento systém je určen pro země Evropské unie, které vstoupily do EU po roce 2004.\n\nPlatby v rámci SAPS jsou vypláceny ročně a nejsou vázány na konkrétní produkci, což umožňuje zemědělcům větší flexibilitu v rozhodování o využití půdy.\n\nV České republice je SAPS klíčovým nástrojem pro podporu zemědělství a jeho cílem je zajištění stabilního příjmu pro zemědělce.",
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
    "term": "Redistributivní platba",
    "kategorie": "dotace",
    "shortDef": "Redistributivní platba je doplňková platba pro menší a střední zemědělské podniky.",
    "longDef": "Redistributivní platba je součástí systému přímých plateb, která je určena k podpoře menších a středních zemědělských podniků. Tato platba je poskytována na prvních hektarech obhospodařované půdy, což pomáhá vyrovnávat rozdíly mezi velkými a malými farmami.\n\nCílem redistributivní platby je podpořit diverzifikaci zemědělské produkce a udržitelnost menších podniků, které často čelí větším ekonomickým výzvám.\n\nV České republice je redistributivní platba implementována v rámci Společné zemědělské politiky EU a je klíčovým nástrojem pro podporu menších zemědělců.",
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
    ]
  },
  {
    "slug": "nitratova-smernice",
    "term": "Nitrátová směrnice",
    "kategorie": "regulace",
    "shortDef": "Nitrátová směrnice je evropská legislativa zaměřená na ochranu vod před znečištěním dusičnany.",
    "longDef": "Nitrátová směrnice je součástí legislativy Evropské unie, která se zaměřuje na ochranu vodních zdrojů před znečištěním dusičnany pocházejícími z zemědělství. Směrnice stanovuje opatření pro snížení rizika znečištění a podporuje udržitelné zemědělské praktiky.\n\nImplementace směrnice zahrnuje identifikaci zranitelných oblastí, kde je riziko znečištění nejvyšší, a zavedení akčních programů pro snížení vstupu dusičnanů do vod.\n\nV České republice je nitrátová směrnice klíčovým nástrojem pro ochranu kvality vody a je implementována prostřednictvím národních předpisů a kontrolních mechanismů.",
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
    ]
  },
  {
    "slug": "zranitelne-oblasti",
    "term": "Zranitelné oblasti (nitrátové)",
    "kategorie": "regulace",
    "shortDef": "Zranitelné oblasti jsou území, kde je zvýšené riziko znečištění vod dusičnany.",
    "longDef": "Zranitelné oblasti, v kontextu nitrátové směrnice, jsou území identifikovaná jako místa s vyšším rizikem znečištění vod dusičnany z zemědělských zdrojů. Tato území jsou předmětem zvláštních opatření na ochranu kvality vody.\n\nV těchto oblastech jsou zaváděny akční programy, které zahrnují opatření pro snížení vstupu dusičnanů do vodních zdrojů, jako je omezení používání hnojiv a zavádění udržitelných zemědělských praktik.\n\nV České republice jsou zranitelné oblasti pravidelně aktualizovány a kontrolovány, aby byla zajištěna účinná ochrana vodních zdrojů.",
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
    ]
  },
  {
    "slug": "anc-platba",
    "term": "ANC – platba pro oblasti s přírodními omezeními",
    "alias": [
      "ANC"
    ],
    "kategorie": "dotace",
    "shortDef": "ANC je platba pro zemědělce v oblastech s přírodními omezeními.",
    "longDef": "ANC (Areas with Natural Constraints) je platba určená pro zemědělce, kteří hospodaří v oblastech s přírodními omezeními, jako jsou horské oblasti nebo regiony s nepříznivými klimatickými podmínkami. Cílem této platby je kompenzovat dodatečné náklady a ztráty příjmů spojené s obtížnými podmínkami hospodaření.\n\nPlatby ANC pomáhají udržovat zemědělskou činnost v těchto oblastech, což přispívá k udržení krajiny a biodiverzity. Zemědělci v ANC oblastech musí splňovat určité podmínky, aby byli způsobilí pro tuto podporu.\n\nV České republice je ANC platba důležitým nástrojem pro podporu zemědělství v méně příznivých oblastech a je součástí širšího rámce Společné zemědělské politiky EU.",
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
    "shortDef": "Ekoschémata jsou finanční podpory zaměřené na podporu ekologických zemědělských postupů.",
    "longDef": "Ekoschémata představují soubor opatření v rámci Společné zemědělské politiky EU, která poskytují finanční podporu zemědělcům za implementaci ekologických a udržitelných zemědělských postupů. Cílem je motivovat zemědělce k praktikám, které přispívají k ochraně životního prostředí, biodiverzity a zlepšení kvality půdy. V praxi se jedná například o podporu pro ekologické zemědělství, agrolesnictví nebo ochranu vodních zdrojů. V České republice jsou ekoschémata součástí širšího rámce zemědělských dotací a jejich implementace je koordinována Ministerstvem zemědělství.",
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
    "term": "Podmíněnost (kondicionalita)",
    "alias": [
      "kondicionalita"
    ],
    "kategorie": "regulace",
    "shortDef": "Podmíněnost je systém pravidel, které musí zemědělci dodržovat pro získání zemědělských dotací.",
    "longDef": "Podmíněnost, známá také jako kondicionalita, je soubor pravidel a standardů, které musí zemědělci dodržovat, aby byli způsobilí pro přímé platby a některé další zemědělské dotace v rámci EU. Tato pravidla zahrnují požadavky na ochranu životního prostředí, zdraví zvířat a rostlin, bezpečnost potravin a dobré životní podmínky zvířat. Podmíněnost je klíčovou součástí Společné zemědělské politiky a je nástrojem pro zajištění udržitelného zemědělství. V České republice je dodržování podmíněnosti kontrolováno příslušnými orgány a její nedodržení může vést k finančním sankcím.",
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
    "term": "Zastropování přímých plateb",
    "alias": [
      "zastropování"
    ],
    "kategorie": "dotace",
    "shortDef": "Zastropování přímých plateb je omezení maximální výše dotací, které může jeden zemědělský podnik obdržet.",
    "longDef": "Zastropování přímých plateb je mechanismus v rámci Společné zemědělské politiky EU, který stanovuje maximální částku přímých plateb, kterou může jeden zemědělský podnik získat. Cílem je zajistit spravedlivější rozdělení finančních prostředků mezi menší a střední zemědělské podniky a zabránit koncentraci dotací ve velkých podnicích. Tento systém může zahrnovat různé úrovně redukce plateb nad určité limity a může být kombinován s dalšími opatřeními, jako je redistributivní platba. V České republice se zastropování přímých plateb diskutuje v kontextu národní implementace politiky EU.",
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
    "term": "Program rozvoje venkova (PRV)",
    "alias": [
      "PRV"
    ],
    "kategorie": "dotace",
    "shortDef": "Program rozvoje venkova je soubor opatření na podporu rozvoje venkovských oblastí a zemědělství.",
    "longDef": "Program rozvoje venkova (PRV) je klíčovým nástrojem Společné zemědělské politiky EU, který se zaměřuje na podporu rozvoje venkovských oblastí a zlepšení konkurenceschopnosti zemědělství. PRV zahrnuje opatření na modernizaci zemědělských podniků, podporu ekologického zemědělství, rozvoj venkovské infrastruktury a zlepšení kvality života na venkově. V České republice je PRV implementován prostřednictvím Ministerstva zemědělství a zahrnuje širokou škálu projektů a iniciativ, které podporují udržitelný rozvoj a inovace v zemědělském sektoru.",
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
    "term": "Platba pro mladé zemědělce",
    "kategorie": "dotace",
    "shortDef": "Platba pro mladé zemědělce je finanční podpora určená pro začínající zemědělce do 40 let.",
    "longDef": "Platba pro mladé zemědělce je speciální forma finanční podpory v rámci Společné zemědělské politiky EU, která je určena pro mladé zemědělce do 40 let. Cílem této platby je podpořit generační obměnu v zemědělství, usnadnit mladým lidem vstup do zemědělského sektoru a podpořit jejich podnikatelské aktivity. Tato podpora je poskytována jako přímá platba k základní platbě a může být kombinována s dalšími opatřeními, jako je podpora investic do zemědělských podniků. V České republice je tato platba součástí národního plánu rozvoje venkova a je administrována Ministerstvem zemědělství.",
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
    ]
  },
  {
    "slug": "ozeleneni",
    "term": "Ozelenění (greening)",
    "alias": [
      "greening"
    ],
    "kategorie": "dotace",
    "shortDef": "Ozelenění je soubor opatření v zemědělství zaměřených na zlepšení ekologické udržitelnosti.",
    "longDef": "Ozelenění, známé také jako greening, je součástí Společné zemědělské politiky EU, která zahrnuje povinná ekologická opatření, která musí zemědělci dodržovat, aby získali plnou výši přímých plateb. Tato opatření zahrnují diverzifikaci plodin, udržování trvalých travních porostů a vyčlenění ekologických prioritních oblastí. Cílem ozelenění je zlepšit ekologickou udržitelnost zemědělství, chránit biodiverzitu a přispět k boji proti změně klimatu. V České republice je ozelenění implementováno v rámci národních strategií a je kontrolováno příslušnými orgány.",
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
    "shortDef": "Diskový podmítač je zemědělský stroj určený k mělké podmítce půdy.",
    "longDef": "Diskový podmítač je zemědělský stroj vybavený řadou disků, které jsou uspořádány v úhlu k směru jízdy. Slouží k mělké podmítce půdy, což je proces, při kterém se povrchová vrstva půdy narušuje a mísí. Tento proces pomáhá v boji proti plevelům, zlepšuje strukturu půdy a podporuje rozklad organické hmoty.\n\nV praxi se diskové podmítače používají především po sklizni, kdy je třeba rychle a efektivně zpracovat strniště. Jsou vhodné pro různé typy půd a umožňují rychlou práci na velkých plochách.\n\nV České republice jsou diskové podmítače běžně používány na polích různých velikostí a jsou součástí moderního zemědělství, které klade důraz na efektivitu a udržitelnost.",
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
    "term": "Radličkový kypřič",
    "alias": [
      "radličkový kultivátor"
    ],
    "kategorie": "technologie",
    "shortDef": "Radličkový kypřič je stroj určený k hlubšímu zpracování půdy.",
    "longDef": "Radličkový kypřič je zemědělský stroj, který využívá radlice k hlubšímu zpracování půdy. Je navržen tak, aby narušil půdní strukturu a zlepšil její provzdušnění, což podporuje růst plodin.\n\nPoužívá se především pro přípravu půdy před setím, kdy je třeba půdu prokypřit a srovnat. Radličkový kypřič je vhodný pro různé typy půd a umožňuje efektivní práci na větších plochách.\n\nV českém zemědělství je radličkový kypřič často využíván jako alternativa k tradiční orbě, což přispívá k ochraně půdní struktury a snižování eroze.",
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
    "shortDef": "Teleskopický manipulátor je stroj určený k manipulaci s materiálem na farmách.",
    "longDef": "Teleskopický manipulátor je víceúčelový stroj vybavený teleskopickým ramenem, které umožňuje manipulaci s materiálem na různých výškách a vzdálenostech. Je široce používán v zemědělství pro nakládání, vykládání a přepravu materiálů, jako jsou balíky sena, hnojiva nebo stavební materiály.\n\nDíky své flexibilitě a schopnosti pracovat v omezených prostorech je teleskopický manipulátor ideální pro farmy různých velikostí. Jeho univerzálnost je dána možností připojení různých nástrojů, jako jsou vidlice, lžíce nebo kleště.\n\nV České republice je teleskopický manipulátor běžnou součástí zemědělské techniky, která zvyšuje efektivitu a snižuje fyzickou námahu při manipulaci s materiály.",
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
      "frontální nakladač"
    ],
    "kategorie": "technologie",
    "shortDef": "Čelní nakladač je stroj určený k nakládání a přepravě materiálů.",
    "longDef": "Čelní nakladač je zemědělský stroj vybavený lopatou nebo jiným nástrojem na čelní části, který slouží k nakládání, přepravě a vykládání materiálů. Je široce používán na farmách pro manipulaci s hnojem, krmivy, zeminou a dalšími materiály.\n\nDíky své konstrukci umožňuje čelní nakladač efektivní práci v omezených prostorech a je schopen rychle přemístit velké množství materiálu. Jeho univerzálnost je dána možností připojení různých nástrojů, což z něj činí nepostradatelný stroj na farmách.\n\nV České republice je čelní nakladač běžně používán na malých i velkých farmách a je důležitou součástí moderního zemědělství, které klade důraz na efektivitu a produktivitu.",
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
    "term": "Rozmetadlo minerálních hnojiv",
    "alias": [
      "rozmetadlo hnojiv"
    ],
    "kategorie": "technologie",
    "shortDef": "Rozmetadlo minerálních hnojiv je stroj určený k rovnoměrnému rozptylu hnojiv na poli.",
    "longDef": "Rozmetadlo minerálních hnojiv je zemědělský stroj, který slouží k aplikaci minerálních hnojiv na pole. Je navrženo tak, aby zajistilo rovnoměrné rozložení hnojiva na povrchu půdy, což je klíčové pro optimalizaci růstu plodin.\n\nTento stroj je vybaven mechanismem, který umožňuje přesné dávkování a rozptyl hnojiva, čímž se minimalizují ztráty a zvyšuje efektivita hnojení. Rozmetadlo je vhodné pro různé typy hnojiv, včetně granulovaných a práškových forem.\n\nV České republice je rozmetadlo minerálních hnojiv běžně používáno v rámci moderního zemědělství, které klade důraz na efektivní využití vstupů a udržitelnost produkce.",
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
    "shortDef": "Cisterna na kejdu je stroj určený k přepravě a aplikaci kejdy na pole.",
    "longDef": "Cisterna na kejdu, známá také jako aplikátor kejdy, je zemědělský stroj používaný k přepravě a aplikaci kejdy na pole. Kejda je tekuté organické hnojivo, které se získává jako vedlejší produkt živočišné výroby a je bohaté na živiny.\n\nCisterna je vybavena systémem pro přesnou aplikaci kejdy, což umožňuje efektivní využití živin a minimalizaci ztrát. Aplikace kejdy je důležitá pro zlepšení úrodnosti půdy a podporu růstu plodin.\n\nV České republice se cisterny na kejdu používají zejména na farmách s intenzivní živočišnou výrobou, kde je potřeba efektivně využívat dostupné organické hnojivo a zajišťovat udržitelné hospodaření s půdou.",
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
    "shortDef": "Svinovací lis je zemědělský stroj určený k lisování a balení píce do válcových balíků.",
    "longDef": "Svinovací lis, známý také jako lis na balíky, je zemědělský stroj používaný k lisování píce, jako je seno nebo sláma, do kompaktních válcových balíků. Tyto balíky se snadno skladují a přepravují, což zlepšuje efektivitu manipulace s krmivem.\n\nStroj funguje tak, že sbírá píci z pole a pomocí rotačních válců ji stlačuje do pevného balíku, který je následně obalen sítí nebo fólií. Tento proces pomáhá chránit píci před vlhkostí a ztrátou živin.\n\nV České republice se svinovací lisy používají zejména v oblastech s intenzivním chovem dobytka, kde je potřeba efektivně zpracovávat velké množství píce pro krmné účely.",
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
    "term": "Samojízdná řezačka",
    "alias": [
      "řezačka",
      "sklízecí řezačka"
    ],
    "kategorie": "technologie",
    "shortDef": "Samojízdná řezačka je stroj určený pro sklizeň a řezání píce na siláž.",
    "longDef": "Samojízdná řezačka je zemědělský stroj, který sklízí a řeže píci, například kukuřici nebo traviny, na siláž. Je vybavena vlastním pohonem a obvykle obsahuje sekací a drticí mechanismus, který zajišťuje jemné nasekání materiálu.\n\nŘezačka je klíčová pro výrobu kvalitní siláže, což je důležitý krmný produkt pro dobytek. Proces sklizně a řezání je rychlý a efektivní, což minimalizuje ztráty živin během sklizně.\n\nV České republice jsou samojízdné řezačky často využívány v kombinaci s dalšími sklizňovými stroji a technikami pro optimalizaci produkce krmiv v živočišné výrobě.",
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
    "shortDef": "Pneumatický secí stroj je zařízení pro přesné setí semen pomocí vzduchového proudění.",
    "longDef": "Pneumatický secí stroj je zemědělské zařízení, které používá proudění vzduchu k přesnému umístění semen do půdy. Tato technologie umožňuje rovnoměrné rozložení semen na poli, což zlepšuje klíčivost a usnadňuje následnou péči o plodiny.\n\nStroj je vybaven systémem trysek a hadic, které transportují semena z násypky do seťového lůžka. Tento systém je řízen elektronicky, což umožňuje nastavit různé parametry setí podle potřeb konkrétní plodiny.\n\nV České republice jsou pneumatické secí stroje oblíbené pro svou efektivitu a přesnost, zejména při setí plodin s vysokou hodnotou, jako je kukuřice nebo řepka.",
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
    "term": "Plečka (meziřádková kultivace)",
    "alias": [
      "meziřádková plečka",
      "kultivátor"
    ],
    "kategorie": "technologie",
    "shortDef": "Plečka je zemědělský nástroj používaný k meziřádkové kultivaci půdy.",
    "longDef": "Plečka, známá také jako meziřádkový kultivátor, je nástroj používaný k obdělávání půdy mezi řádky plodin. Tento proces pomáhá odstraňovat plevel, zlepšuje provzdušnění půdy a podporuje zdravý růst rostlin.\n\nPlečky mohou být mechanické nebo automatizované a často jsou vybaveny různými typy radlic nebo kotoučů, které umožňují přizpůsobení různým typům půdy a plodin.\n\nV České republice jsou plečky běžně používány v různých typech zemědělství, od malých farem po velké komerční podniky, a jsou klíčové pro udržení optimálních podmínek pro růst plodin.",
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
    "term": "Planetová převodovka",
    "alias": [
      "planetární převodovka",
      "epicyklická převodovka"
    ],
    "kategorie": "pohon",
    "shortDef": "Planetová převodovka je typ převodového mechanismu využívající planetové soukolí pro přenos točivého momentu.",
    "longDef": "Planetová převodovka je složitý převodový systém, který využívá planetové soukolí. Tento mechanismus se skládá z centrálního kola (slunce), planetových kol a vnějšího ozubeného věnce. Planetová převodovka umožňuje efektivní přenos točivého momentu a změnu rychlosti.\n\nDíky své kompaktní konstrukci a schopnosti přenášet vysoké točivé momenty je tento typ převodovky široce používán v automobilovém průmyslu, těžkých strojích a zemědělské technice.\n\nV České republice jsou planetové převodovky často využívány v traktorech a dalších zemědělských strojích, kde je důležitá spolehlivost a efektivita přenosu výkonu.",
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
    "shortDef": "Dvouhmotový setrvačník je zařízení určené k tlumení vibrací v pohonných systémech.",
    "longDef": "Dvouhmotový setrvačník (DMF) je složitý mechanický prvek, který pomáhá tlumit vibrace a rázy v pohonném systému vozidel. Skládá se ze dvou setrvačníkových hmot spojených pružinovým systémem, který absorbuje a tlumí vibrace.\n\nPoužití dvouhmotového setrvačníku zlepšuje komfort jízdy, snižuje hluk a zvyšuje životnost převodovky a dalších součástí pohonného systému. Je obzvláště důležitý u vozidel s manuální převodovkou.\n\nV České republice jsou dvouhmotové setrvačníky běžně používány v automobilovém průmyslu, zejména u osobních a lehkých užitkových vozidel, kde je důraz na komfort a efektivitu pohonu.",
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
    "shortDef": "Load-sensing hydraulika je systém, který automaticky přizpůsobuje průtok oleje požadavkům na výkon.",
    "longDef": "Load-sensing hydraulika je technologie používaná v hydraulických systémech, která umožňuje automatické přizpůsobení průtoku a tlaku oleje aktuálním potřebám. Tento systém zajišťuje efektivní využití energie a minimalizuje ztráty. \n\nSystém funguje tak, že snímá tlak v hydraulickém okruhu a na základě toho upravuje výkon čerpadla. To umožňuje optimalizaci výkonu a snížení spotřeby paliva, což je obzvláště výhodné v zemědělských strojích, kde se často mění pracovní podmínky. \n\nV České republice se load-sensing hydraulika běžně používá v moderních traktorech a kombajnech, kde přispívá k vyšší efektivitě a snížení provozních nákladů.",
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
    "shortDef": "Intercooler je zařízení, které ochlazuje stlačený vzduch mezi turbodmychadlem a motorem.",
    "longDef": "Intercooler, známý také jako mezichladič, je zařízení používané v přeplňovaných motorech k ochlazení vzduchu stlačeného turbodmychadlem nebo kompresorem. Ochlazený vzduch má vyšší hustotu, což zvyšuje účinnost spalování a výkon motoru. \n\nIntercooler je obvykle umístěn mezi turbodmychadlem a sacím potrubím motoru. Jeho hlavní funkcí je snížit teplotu vzduchu, což pomáhá předcházet klepání motoru a zvyšuje jeho životnost. \n\nV zemědělských strojích se intercoolery používají k optimalizaci výkonu motorů, což je důležité pro efektivní provoz při vysoké zátěži. V České republice jsou běžnou součástí moderních traktorů a sklízecích strojů.",
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
    "term": "Variabilní geometrie turba (VGT)",
    "alias": [
      "VGT",
      "variabilní turbo"
    ],
    "kategorie": "pohon",
    "shortDef": "Variabilní geometrie turba umožňuje optimalizaci výkonu turbodmychadla v širokém spektru otáček motoru.",
    "longDef": "Variabilní geometrie turba (VGT) je technologie používaná v turbodmychadlech, která umožňuje měnit úhel lopatek turbodmychadla v závislosti na otáčkách motoru. Tím se optimalizuje tlak a průtok vzduchu, což zlepšuje výkon a účinnost motoru. \n\nVGT zajišťuje lepší odezvu motoru při nízkých otáčkách a vyšší výkon při vysokých otáčkách. Tato technologie je obzvláště užitečná v zemědělských strojích, kde je potřeba rychle reagovat na změny zatížení. \n\nV České republice je VGT běžně používána v moderních traktorech a sklízecích strojích, kde přispívá k efektivnímu využití paliva a snížení emisí.",
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
    "term": "Hydraulický posilovač řízení",
    "alias": [
      "posilovač řízení"
    ],
    "kategorie": "pohon",
    "shortDef": "Hydraulický posilovač řízení usnadňuje ovládání vozidel snížením síly potřebné k otáčení volantem.",
    "longDef": "Hydraulický posilovač řízení je systém, který využívá hydraulický tlak k usnadnění řízení vozidel. Tento systém snižuje fyzickou námahu potřebnou k otáčení volantem, což je zvláště užitečné u těžkých zemědělských strojů. \n\nFunguje tak, že hydraulické čerpadlo poháněné motorem vytváří tlak, který pomáhá otáčet volantem. To umožňuje snadnější manévrování a zvyšuje komfort obsluhy. \n\nV České republice je hydraulický posilovač řízení standardní výbavou většiny moderních traktorů a zemědělských strojů, což přispívá k efektivitě a bezpečnosti při práci na poli.",
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
    "term": "Přední vývodový hřídel",
    "alias": [
      "přední PTO"
    ],
    "kategorie": "pohon",
    "shortDef": "Přední vývodový hřídel je zařízení umožňující přenos výkonu z traktoru na přední přídavná zařízení.",
    "longDef": "Přední vývodový hřídel (PTO) je mechanický prvek traktoru, který umožňuje přenos výkonu na přední přídavná zařízení, jako jsou sekačky nebo sněhové frézy. Tento hřídel zvyšuje univerzálnost traktoru a umožňuje efektivní využití různých nástrojů.\n\nPřední PTO je obvykle poháněn motorem traktoru a může být zapínán a vypínán podle potřeby. To umožňuje flexibilní použití různých nástrojů bez nutnosti měnit základní konfiguraci traktoru.\n\nV České republice je přední vývodový hřídel běžně využíván v zemědělství a komunálních službách, kde přispívá k efektivitě a produktivitě práce.",
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
    "term": "Smykování",
    "alias": [
      "smyk"
    ],
    "kategorie": "agrotechnika",
    "shortDef": "Smykování je jev, kdy kola nebo pásy traktoru ztrácejí přilnavost k povrchu půdy.",
    "longDef": "Smykování je jev, který nastává, když kola nebo pásy traktoru ztrácejí přilnavost k povrchu půdy, což vede k neefektivnímu přenosu síly a zvýšené spotřebě paliva. Tento jev je běžný na mokrých nebo sypkých půdách. \n\nSmykování může být měřeno a kontrolováno pomocí různých technik, jako je úprava tlaku v pneumatikách nebo použití závaží. Správné řízení smykování je klíčové pro minimalizaci opotřebení pneumatik a zvýšení efektivity práce. \n\nV České republice je smykování sledováno zejména v kontextu optimalizace zemědělských operací, kde může mít významný vliv na produktivitu a provozní náklady.",
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
    "term": "Válení",
    "kategorie": "agrotechnika",
    "shortDef": "Válení je agrotechnická operace, která zajišťuje utužení povrchu půdy po setí.",
    "longDef": "Válení je proces, při kterém se pomocí válců utužuje povrch půdy. Tato operace se provádí po setí, aby se zajistil lepší kontakt semen s půdou a podpořila klíčivost. Válení také pomáhá srovnat povrch půdy a zlepšit kapilaritu, což usnadňuje přístup vody k semenům.\n\nV praxi se používají různé typy válců, včetně hladkých, prstových nebo kroužkových, v závislosti na typu půdy a plodin. Válení je důležité zejména na lehkých a písčitých půdách, kde pomáhá zabránit ztrátám vlhkosti.\n\nV České republice je válení běžnou součástí agrotechnických postupů, zejména při pěstování obilovin a dalších plodin vyžadujících rovnoměrný povrch půdy pro optimální růst.",
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
    ]
  },
  {
    "slug": "vysevek",
    "term": "Výsevek",
    "kategorie": "agrotechnika",
    "shortDef": "Výsevek je množství osiva použitého na jednotku plochy při setí.",
    "longDef": "Výsevek označuje množství osiva, které je vyseto na určitou plochu, obvykle vyjádřené v kilogramech na hektar. Správné určení výsevku je klíčové pro dosažení optimální hustoty porostu a tím i maximálního výnosu.\n\nVýsevek se liší podle druhu plodiny, podmínek půdy a klimatických podmínek. Například obiloviny mají obvykle vyšší výsevek než olejniny. Výsevek je také ovlivněn kvalitou osiva a jeho klíčivostí.\n\nV České republice se doporučené výsevky liší podle regionu a typu půdy, přičemž zemědělci často využívají doporučení agronomických poradců nebo výsledky pokusů z výzkumných stanic.",
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
    ]
  },
  {
    "slug": "hloubkove-kypreni",
    "term": "Hloubkové kypření (podrývání)",
    "kategorie": "agrotechnika",
    "shortDef": "Hloubkové kypření je agrotechnická operace zaměřená na zlepšení struktury půdy a její provzdušnění.",
    "longDef": "Hloubkové kypření, také známé jako podrývání, je proces, při kterém se půda kypří do větší hloubky bez obracení. Tento postup zlepšuje provzdušnění půdy, odvodnění a podporuje rozvoj kořenového systému plodin.\n\nPodrývání se provádí speciálními stroji, které naruší zhutněné vrstvy půdy, což je obzvláště důležité na těžkých půdách nebo v oblastech s vysokým rizikem zhutnění. Zlepšení struktury půdy vede k lepší infiltraci vody a snížení eroze.\n\nV České republice je hloubkové kypření využíváno zejména v oblastech s intenzivním zemědělstvím, kde je potřeba zlepšit fyzikální vlastnosti půdy a podpořit udržitelnou produkci.",
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
    ]
  },
  {
    "slug": "predsetova-priprava",
    "term": "Předseťová příprava",
    "kategorie": "agrotechnika",
    "shortDef": "Předseťová příprava je soubor operací zaměřených na úpravu půdy před setím.",
    "longDef": "Předseťová příprava zahrnuje různé agrotechnické operace, které připravují půdu pro setí plodin. Cílem je vytvořit optimální podmínky pro klíčení semen a růst mladých rostlin.\n\nTento proces může zahrnovat kypření, vyrovnání povrchu, odstranění plevelů a zajištění správné struktury půdy. Využívají se různé nástroje a stroje, jako jsou pluhy, kompaktomaty a válce.\n\nV České republice je předseťová příprava klíčovou součástí zemědělských postupů, přičemž její konkrétní podoba se liší podle typu plodiny, půdních a klimatických podmínek.",
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
    ]
  },
  {
    "slug": "setove-luzko",
    "term": "Seťové lůžko",
    "kategorie": "agrotechnika",
    "shortDef": "Seťové lůžko je připravený povrch půdy, na který se vysévají semena.",
    "longDef": "Seťové lůžko je speciálně připravená vrstva půdy, která poskytuje optimální podmínky pro klíčení a růst semen. Jeho kvalita je klíčová pro dosažení rovnoměrného a rychlého vzcházení plodin.\n\nPříprava seťového lůžka zahrnuje vyrovnání povrchu, odstranění hrud a zajištění správné struktury půdy. Důležitá je také kontrola vlhkosti a teploty půdy, které ovlivňují klíčivost.\n\nV České republice je příprava seťového lůžka standardní praxí v zemědělství, přičemž se používají různé techniky a nástroje podle typu plodiny a půdních podmínek.",
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
    ]
  },
  {
    "slug": "kapilarita-pudy",
    "term": "Kapilarita půdy",
    "kategorie": "agrotechnika",
    "shortDef": "Kapilarita půdy je schopnost půdy přenášet vodu v jemných pórech proti gravitaci.",
    "longDef": "Kapilarita půdy se týká schopnosti půdy přenášet vodu v jemných pórech a kapilárách. Tento jev je důležitý pro zajištění dostupnosti vody pro rostliny, zejména v období sucha.\n\nKapilarita je ovlivněna strukturou půdy, velikostí a distribucí pórovitosti. Jemnozrnné půdy, jako jsou jílovité, mají vyšší kapilaritu než hrubozrnné, jako jsou písčité.\n\nV České republice je kapilarita půdy důležitým faktorem při plánování zavlažování a hospodaření s vodou, zejména v oblastech s nepravidelnými srážkami.",
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
    ]
  },
  {
    "slug": "mineralizace-pudy",
    "term": "Mineralizace organické hmoty",
    "alias": [
      "mineralizace půdy"
    ],
    "kategorie": "agrotechnika",
    "shortDef": "Mineralizace organické hmoty je proces přeměny organických látek na anorganické formy.",
    "longDef": "Mineralizace organické hmoty je biologický proces, při kterém mikroorganismy rozkládají organické látky v půdě na anorganické formy, jako jsou oxid uhličitý, voda a minerální živiny. Tento proces je klíčový pro uvolňování živin, které jsou nezbytné pro růst rostlin.\n\nV zemědělství je mineralizace důležitá pro udržení úrodnosti půdy a zajištění dostupnosti živin pro plodiny. Rychlost mineralizace závisí na faktorech jako teplota, vlhkost a typ půdy.\n\nV českém zemědělství se mineralizace sleduje jako součást hodnocení půdní úrodnosti, a to zejména v souvislosti s aplikací organických hnojiv a kompostů.",
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
    "term": "Utužení půdy",
    "alias": [
      "kompakce půdy"
    ],
    "kategorie": "agrotechnika",
    "shortDef": "Utužení půdy je proces zhutnění půdní struktury vlivem mechanického zatížení.",
    "longDef": "Utužení půdy, známé také jako kompakce, je proces, při kterém dochází ke zhutnění půdní struktury vlivem mechanického zatížení, například těžkou technikou nebo intenzivním pohybem zvířat. Tento proces snižuje pórovitost půdy a omezuje průnik vody a vzduchu.\n\nV zemědělství může utužení půdy negativně ovlivnit růst rostlin, protože omezuje dostupnost kyslíku pro kořeny a ztěžuje odvodnění. Prevence zahrnuje používání lehčí techniky a správné plánování pohybu po poli.\n\nV ČR je problematika utužení půdy řešena v rámci udržitelných zemědělských praktik, které zahrnují minimalizaci přejezdů po poli a využívání moderních technologií.",
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
    "term": "Zelené hnojení",
    "alias": [
      "zelené hnoje"
    ],
    "kategorie": "agrotechnika",
    "shortDef": "Zelené hnojení je agrotechnická metoda využívající rostliny k obohacení půdy o organickou hmotu a živiny.",
    "longDef": "Zelené hnojení je metoda, při které se pěstují specifické rostliny, které se následně zaorávají do půdy za účelem zlepšení její struktury a obohacení o organickou hmotu a živiny. Mezi běžně používané plodiny patří svazenka, jetel a lupina.\n\nTato metoda zvyšuje obsah organické hmoty v půdě, zlepšuje její strukturu a zvyšuje biologickou aktivitu. Zelené hnojení také pomáhá v boji proti erozi a zlepšuje schopnost půdy zadržovat vodu.\n\nV České republice je zelené hnojení součástí udržitelných zemědělských praktik a je podporováno v rámci ekologických programů a dotací.",
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
    "term": "Strniště",
    "kategorie": "agrotechnika",
    "shortDef": "Strniště je zbytek stonků a kořenů plodin po sklizni.",
    "longDef": "Strniště je část rostlin, která zůstává na poli po sklizni plodin. Obvykle zahrnuje stonky, kořeny a někdy i malé části listů. Strniště může sloužit jako ochrana půdy proti erozi a pomáhá udržovat vlhkost.\n\nV zemědělství je strniště často využíváno jako mulč nebo je zaoráváno do půdy, čímž se zvyšuje obsah organické hmoty a zlepšuje struktura půdy. Strniště také poskytuje úkryt pro drobné živočichy a podporuje biodiverzitu.\n\nV ČR je zachování strniště na poli často součástí udržitelných zemědělských praktik a je podporováno v rámci různých agrotechnických programů.",
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
    ]
  },
  {
    "slug": "superfosfat",
    "term": "Superfosfát",
    "kategorie": "hnojivo",
    "shortDef": "Superfosfát je fosforečné hnojivo vyráběné z fosfátové horniny a kyseliny sírové.",
    "longDef": "Superfosfát je minerální hnojivo obsahující fosfor, které se vyrábí reakcí fosfátové horniny s kyselinou sírovou. Obsahuje rozpustný fosforečnan vápenatý, který je snadno dostupný pro rostliny.\n\nPoužívá se k zajištění dostatečného přísunu fosforu pro plodiny, což je klíčový prvek pro růst a vývoj rostlin. Aplikace superfosfátu zvyšuje výnosy a zlepšuje kvalitu plodin.\n\nV České republice je superfosfát běžně používaným hnojivem, které je aplikováno zejména na půdy s nízkým obsahem fosforu. Je součástí integrovaných hnojivových plánů.",
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
    ]
  },
  {
    "slug": "draselna-sul",
    "term": "Draselná sůl (KCl)",
    "alias": [
      "chlorid draselný"
    ],
    "kategorie": "hnojivo",
    "shortDef": "Draselná sůl je minerální hnojivo obsahující draslík ve formě chloridu draselného.",
    "longDef": "Draselná sůl, známá také jako chlorid draselný (KCl), je minerální hnojivo používané k dodání draslíku, který je nezbytný pro růst rostlin, zlepšení odolnosti vůči stresu a zvýšení výnosů.\n\nAplikace draselné soli pomáhá zlepšit kvalitu plodin, podporuje fotosyntézu a zvyšuje odolnost rostlin vůči chorobám a nepříznivým podmínkám. Draslík je klíčový pro regulaci vodního režimu rostlin.\n\nV ČR je draselná sůl široce používána jako součást hnojivových plánů, zejména na půdách s nízkým obsahem draslíku. Je aplikována před setím nebo během vegetace.",
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
    "shortDef": "Kalimagnesia je minerální hnojivo obsahující draslík a hořčík.",
    "longDef": "Kalimagnesia, známá také jako Patentkali, je minerální hnojivo, které obsahuje draslík, hořčík a síru. Používá se k doplnění těchto živin v půdě, což je důležité pro růst rostlin a výnosy plodin.\n\nDraslík v kalimagnesii zlepšuje odolnost rostlin vůči stresu, jako je sucho nebo mráz, a podporuje tvorbu cukrů a škrobů. Hořčík je klíčový pro fotosyntézu, protože je součástí molekuly chlorofylu.\n\nV České republice je kalimagnesia využívána zejména v oblastech s nedostatkem těchto prvků v půdě. Aplikace se provádí před setím nebo během vegetačního období.",
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
    "shortDef": "Dolomitický vápenec je přírodní hnojivo obsahující vápník a hořčík.",
    "longDef": "Dolomitický vápenec je přírodní minerál, který se používá jako hnojivo pro zlepšení půdní struktury a pH. Obsahuje vápník a hořčík, které jsou klíčové pro zdravý růst rostlin.\n\nToto hnojivo zvyšuje pH kyselých půd, což zlepšuje dostupnost živin pro rostliny. Hořčík v dolomitickém vápenci podporuje fotosyntézu a celkový metabolismus rostlin.\n\nV České republice se dolomitický vápenec používá zejména na kyselých půdách, kde pomáhá zlepšit strukturu půdy a podpořit růst plodin.",
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
    ]
  },
  {
    "slug": "digestat",
    "term": "Digestát",
    "kategorie": "hnojivo",
    "shortDef": "Digestát je organické hnojivo vznikající jako vedlejší produkt bioplynových stanic.",
    "longDef": "Digestát je organické hnojivo, které vzniká jako vedlejší produkt při anaerobní digesci v bioplynových stanicích. Obsahuje cenné živiny, jako jsou dusík, fosfor a draslík, a je využíván ke zlepšení půdní úrodnosti.\n\nPoužívá se jako alternativní zdroj živin pro rostliny, což může snížit potřebu syntetických hnojiv. Digestát se aplikuje na pole pomocí rozmetadel, cisteren nebo injektáží do půdy, což je často preferovaná metoda kvůli snížení emisí amoniaku.\n\nV České republice je používání digestátu regulováno, aby se zabránilo nadměrnému hnojení a ochraně vodních zdrojů.",
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
    ]
  },
  {
    "slug": "kejda",
    "term": "Kejda",
    "kategorie": "hnojivo",
    "shortDef": "Kejda je tekuté organické hnojivo vznikající z chovu hospodářských zvířat.",
    "longDef": "Kejda je tekuté organické hnojivo, které vzniká jako směs exkrementů hospodářských zvířat a vody. Obsahuje důležité živiny, jako je dusík, fosfor a draslík, a je využívána ke zlepšení úrodnosti půdy.\n\nAplikace kejdy se provádí pomocí cisteren nebo speciálních rozmetadel, a to buď před setím, nebo během vegetačního období. Kejda přispívá k udržení organické hmoty v půdě a podporuje mikrobiální aktivitu.\n\nV České republice je používání kejdy regulováno, aby se minimalizovalo riziko znečištění vodních zdrojů a zabránilo nadměrnému hnojení.",
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
    ]
  },
  {
    "slug": "hnuj",
    "term": "Hnůj (chlévský)",
    "alias": [
      "chlévský hnůj"
    ],
    "kategorie": "hnojivo",
    "shortDef": "Hnůj je organické hnojivo vznikající z exkrementů hospodářských zvířat a podestýlky.",
    "longDef": "Hnůj je tradiční organické hnojivo, které se skládá z exkrementů hospodářských zvířat smíchaných s podestýlkou, jako je sláma. Obsahuje důležité živiny, jako je dusík, fosfor a draslík, a je klíčový pro zlepšení úrodnosti půdy.\n\nHnůj se aplikuje na pole před orbou nebo během vegetačního období, což přispívá k udržení organické hmoty a zlepšení struktury půdy. Jeho používání podporuje mikrobiální aktivitu a dlouhodobě zvyšuje úrodnost.\n\nV České republice je hnůj stále hojně využíván, zejména v ekologickém zemědělství, kde je důležitý pro udržení přirozené rovnováhy živin v půdě.",
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
    "term": "Kostní moučka",
    "kategorie": "hnojivo",
    "shortDef": "Kostní moučka je organické hnojivo bohaté na fosfor a vápník.",
    "longDef": "Kostní moučka je organické hnojivo vyrobené z rozdrcených kostí, které je bohaté na fosfor a vápník. Tyto živiny jsou klíčové pro růst a vývoj rostlin, zejména pro tvorbu kořenového systému a květů.\n\nPoužívá se především na zahradách a v zemědělství k podpoře růstu plodin s vysokou potřebou fosforu. Aplikace se provádí před setím nebo během vegetačního období.\n\nV České republice je kostní moučka oblíbená zejména v ekologickém zemědělství, kde se využívá jako přírodní zdroj fosforu bez chemických přísad.",
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
    ]
  },
  {
    "slug": "listova-hnojiva",
    "term": "Listová hnojiva",
    "alias": [
      "foliární hnojiva"
    ],
    "kategorie": "hnojivo",
    "shortDef": "Listová hnojiva jsou hnojiva aplikovaná přímo na listy rostlin pro rychlé dodání živin.",
    "longDef": "Listová hnojiva jsou speciální hnojiva určená k aplikaci na listy rostlin, což umožňuje rychlé a efektivní dodání živin přímo do rostlinných pletiv. Používají se zejména v případech, kdy je potřeba rychle reagovat na nedostatek živin nebo při nepříznivých půdních podmínkách. V České republice jsou listová hnojiva často využívána v intenzivní zemědělské produkci, kde je kladen důraz na optimalizaci výnosů a kvality plodin. Aplikace listových hnojiv je efektivní metodou, jak podpořit růst rostlin a zlepšit jejich odolnost vůči stresovým faktorům.",
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
    "term": "Síra ve výživě rostlin",
    "alias": [
      "síra v rostlinách"
    ],
    "kategorie": "hnojivo",
    "shortDef": "Síra je klíčový prvek ve výživě rostlin, důležitý pro syntézu aminokyselin a enzymů.",
    "longDef": "Síra je esenciální živina pro rostliny, která se podílí na syntéze aminokyselin, enzymů a vitamínů. Je nezbytná pro tvorbu chlorofylu a podporuje metabolismus dusíku. Nedostatek síry může vést k omezenému růstu a snížené kvalitě plodin. V České republice je síra často aplikována ve formě síranových hnojiv, zejména v oblastech s nízkým obsahem organické hmoty v půdě. Správná výživa sírou je klíčová pro dosažení vysokých výnosů a kvalitních zemědělských produktů.",
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
    "term": "Padlí travní",
    "alias": [
      "padlí trav"
    ],
    "kategorie": "ochrana",
    "shortDef": "Padlí travní je houbové onemocnění, které napadá především obilniny a trávy.",
    "longDef": "Padlí travní je houbové onemocnění způsobené houbou Blumeria graminis, které postihuje obilniny a trávy. Projevuje se bílým povlakem na listech a stéblech, což může vést k oslabení rostlin a snížení výnosu. V České republice je padlí travní běžným problémem v intenzivně pěstovaných plodinách, jako je pšenice a ječmen. Ochrana proti padlí zahrnuje preventivní opatření, jako je správná agrotechnika a použití fungicidů.",
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
    "term": "Hlízenka obecná (Sclerotinia)",
    "alias": [
      "Sclerotinia sclerotiorum"
    ],
    "kategorie": "ochrana",
    "shortDef": "Hlízenka obecná je houbová choroba napadající široké spektrum rostlin, včetně řepky a slunečnice.",
    "longDef": "Hlízenka obecná, způsobená houbou Sclerotinia sclerotiorum, je významná houbová choroba, která napadá mnoho druhů rostlin, včetně řepky, slunečnice a luskovin. Projevuje se hnilobou stonků a listů, což může vést k výrazným ztrátám na výnosech. V České republice je hlízenka obecná zvláště problematická v oblastech s vlhkým klimatem. Ochrana proti této chorobě zahrnuje použití fungicidů a dodržování správných osevních postupů.",
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
    "term": "Dřepčíci",
    "alias": [
      "dřepčík"
    ],
    "kategorie": "ochrana",
    "shortDef": "Dřepčíci jsou drobní brouci, kteří poškozují listy a stonky rostlin.",
    "longDef": "Dřepčíci jsou malí brouci z čeledi Chrysomelidae, kteří jsou známí svým skákavým pohybem a poškozováním listů a stonků rostlin. Jsou obzvláště nebezpeční pro mladé rostliny, kde mohou způsobit značné škody. V České republice jsou dřepčíci běžným škůdcem v plodinách jako je řepka, zelí a další brukvovité rostliny. Ochrana proti dřepčíkům zahrnuje použití insekticidů a agrotechnických opatření, jako je správná rotace plodin.",
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
    "term": "Bázlivec kukuřičný",
    "alias": [
      "Diabrotica virgifera"
    ],
    "kategorie": "ochrana",
    "shortDef": "Bázlivec kukuřičný je škůdce kukuřice, který způsobuje poškození kořenů a snižuje výnosy.",
    "longDef": "Bázlivec kukuřičný, Diabrotica virgifera, je invazivní škůdce, který napadá kukuřici a způsobuje významné poškození kořenového systému. To vede k oslabení rostlin a poklesu výnosů. V České republice se tento škůdce stal problémem v posledních desetiletích, což vyžaduje implementaci integrované ochrany rostlin, včetně použití insekticidů a agrotechnických opatření, jako je střídání plodin. Efektivní management bázlivce kukuřičného je klíčový pro udržení produktivity kukuřičných polí.",
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
    "shortDef": "Sviluška chmelová je pavoukovec způsobující škody na chmelu a dalších plodinách.",
    "longDef": "Sviluška chmelová (Tetranychus urticae) je drobný pavoukovec, který napadá listy rostlin, zejména chmelu, a způsobuje jejich žloutnutí a opadávání. Svilušky se živí sáním rostlinných šťáv, což vede k oslabení rostlin a snížení výnosu. V boji proti sviluškám se používají akaricidy a biologické metody, jako je využití dravých roztočů. V České republice je sledování a ochrana před sviluškou důležitou součástí integrované ochrany rostlin.",
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
    "shortDef": "Molice skleníková je škůdce napadající rostliny ve sklenících.",
    "longDef": "Molice skleníková (Trialeurodes vaporariorum) je drobný hmyz, který napadá listy rostlin ve sklenících, kde sáním rostlinných šťáv způsobuje jejich oslabení. Tento škůdce je známý svou schopností rychle se množit a přenášet virové choroby. Kontrola molice zahrnuje použití insekticidů, biologických predátorů a preventivních opatření, jako je udržování čistoty ve sklenících. V České republice je molice skleníková významným škůdcem v produkci zeleniny a okrasných rostlin.",
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
    "term": "Strupovitost jabloně",
    "alias": [
      "Venturia inaequalis"
    ],
    "kategorie": "ochrana",
    "shortDef": "Strupovitost jabloně je houbová choroba způsobující skvrny na plodech a listech jabloní.",
    "longDef": "Strupovitost jabloně (Venturia inaequalis) je houbová choroba, která napadá listy a plody jabloní, čímž způsobuje černé skvrny a deformace. Tato choroba může výrazně snížit kvalitu a množství sklizně. Ochrana proti strupovitosti zahrnuje použití fungicidů, výběr odolných odrůd a správné agrotechnické postupy. V České republice je strupovitost jednou z nejčastějších chorob jabloní, a proto je její kontrola klíčovou součástí integrované ochrany rostlin.",
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
    "shortDef": "Obaleč jablečný je motýl, jehož housenky poškozují plody jabloní.",
    "longDef": "Obaleč jablečný (Cydia pomonella) je motýl, jehož larvy napadají plody jabloní, hrušní a dalších ovocných stromů, čímž způsobují červivost a ztráty na sklizni. Kontrola obaleče zahrnuje použití insekticidů, feromonových lapačů a biologických metod, jako je uvolňování parazitických vosiček. V České republice je obaleč jablečný považován za významného škůdce v ovocnářství, a proto je jeho sledování a kontrola klíčovou součástí ochrany ovocných sadů.",
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
    "shortDef": "Monilióza je houbová choroba napadající květy a plody peckovin.",
    "longDef": "Monilióza je houbová choroba způsobená houbami rodu Monilinia, která napadá květy, plody a větvičky peckovin, jako jsou meruňky, broskve a třešně. Projevuje se hnilobou plodů, vadnutím květů a odumíráním větviček. Ochrana proti monilióze zahrnuje použití fungicidů, odstranění napadených částí rostlin a dodržování hygienických opatření v sadech. V České republice je monilióza běžným problémem v produkci peckovin, a proto je její kontrola důležitou součástí integrované ochrany rostlin.",
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
    "term": "Ochranná lhůta",
    "kategorie": "ochrana",
    "shortDef": "Ochranná lhůta je doba, která musí uplynout mezi aplikací pesticidu a sklizní.",
    "longDef": "Ochranná lhůta je legislativně stanovená doba, která musí uplynout mezi aplikací pesticidu a sklizní plodiny, aby se zajistilo, že rezidua chemických látek nepřekročí povolené limity. Tato lhůta je klíčová pro zajištění bezpečnosti potravin a ochranu spotřebitelů. V praxi se ochranná lhůta liší podle typu pesticidu, plodiny a podmínek aplikace. V České republice je dodržování ochranných lhůt součástí legislativy týkající se používání pesticidů a je kontrolováno příslušnými úřady.",
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
    ]
  },
  {
    "slug": "moreni-osiva",
    "term": "Moření osiva",
    "alias": [
      "moření semen"
    ],
    "kategorie": "ochrana",
    "shortDef": "Moření osiva je proces úpravy semen chemickými nebo biologickými látkami před výsevem.",
    "longDef": "Moření osiva je agronomická technika, která zahrnuje aplikaci chemických nebo biologických látek na semena před jejich výsevem. Cílem je ochrana semen a mladých rostlin před chorobami a škůdci, což zvyšuje klíčivost a výnosy. V praxi se používají různé mořicí přípravky, které mohou obsahovat fungicidy, insekticidy nebo růstové stimulátory. V České republice je moření osiva běžnou praxí, která pomáhá zlepšit zdraví plodin a efektivitu pěstování.",
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
    "term": "Adjuvant (smáčedlo)",
    "alias": [
      "smáčedlo",
      "povrchově aktivní látka"
    ],
    "kategorie": "ochrana",
    "shortDef": "Adjuvant je látka přidávaná k pesticidům pro zvýšení jejich účinnosti.",
    "longDef": "Adjuvanty, známé také jako smáčedla, jsou látky přidávané k pesticidním postřikům za účelem zvýšení jejich účinnosti. Fungují tak, že zlepšují přilnavost a rozptyl postřiků na povrchu rostlin, což vede k lepšímu pokrytí a absorpci účinné látky. Použití adjuvantů je běžné v zemědělství, kde pomáhají optimalizovat aplikaci pesticidů a snižovat jejich spotřebu. V České republice jsou adjuvanty součástí integrované ochrany rostlin.",
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
    "term": "Rezistence vůči pesticidům",
    "alias": [
      "odolnost vůči pesticidům"
    ],
    "kategorie": "ochrana",
    "shortDef": "Rezistence vůči pesticidům je schopnost škůdců přežít aplikaci pesticidů, které by je normálně zničily.",
    "longDef": "Rezistence vůči pesticidům je fenomén, kdy se populace škůdců stává odolnou vůči chemickým látkám používaným k jejich potlačení. Tento jev je výsledkem přirozeného výběru, kdy přežijí jedinci s genetickou odolností a předají ji dalším generacím. Rezistence představuje významný problém v zemědělství, protože snižuje účinnost pesticidů a může vést k vyšším nákladům na ochranu plodin. V České republice se klade důraz na integrovanou ochranu, která zahrnuje rotaci pesticidů a použití alternativních metod kontroly škůdců.",
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
      "aktivní složka"
    ],
    "kategorie": "ochrana",
    "shortDef": "Účinná látka je chemická složka pesticidu, která zajišťuje jeho biologickou aktivitu.",
    "longDef": "Účinná látka je klíčovou složkou pesticidních přípravků, která je zodpovědná za jejich biologickou aktivitu proti škůdcům, chorobám nebo plevelům. Tato látka je pečlivě vyvíjena a testována, aby byla účinná a zároveň bezpečná pro životní prostředí a lidské zdraví. V praxi se účinné látky používají v kombinaci s dalšími složkami, které zajišťují jejich stabilitu a účinnost. V České republice je používání účinných látek regulováno zákony a předpisy, které zajišťují jejich bezpečné použití v zemědělství.",
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
    "shortDef": "Azoxystrobin je širokospektrální fungicid používaný k ochraně plodin před houbovými chorobami.",
    "longDef": "Azoxystrobin je fungicid ze skupiny strobilurinů, který se používá k ochraně plodin proti širokému spektru houbových chorob. Funguje tak, že narušuje buněčné dýchání hub, což vede k jejich úhynu. Azoxystrobin je aplikován na různé plodiny, včetně obilovin, zeleniny a ovoce, a je ceněn pro svou účinnost a relativně nízkou toxicitu pro necílové organismy. V České republice je azoxystrobin součástí integrované ochrany rostlin a jeho použití je regulováno příslušnými předpisy.",
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
    ]
  },
  {
    "slug": "prothiokonazol",
    "term": "Prothiokonazol",
    "kategorie": "ochrana",
    "shortDef": "Prothiokonazol je fungicid používaný k ochraně plodin před houbovými chorobami.",
    "longDef": "Prothiokonazol je systémový fungicid ze skupiny triazolů, který se používá k ochraně plodin před různými houbovými chorobami. Je známý svou schopností pronikat do rostlinných tkání a poskytovat dlouhodobou ochranu. Prothiokonazol je aplikován na širokou škálu plodin, včetně obilovin, řepky a zeleniny. V České republice je jeho použití součástí integrované ochrany rostlin a podléhá přísným regulačním opatřením, která zajišťují jeho bezpečné použití.",
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
    ]
  },
  {
    "slug": "jetel-lucni",
    "term": "Jetel luční",
    "alias": [
      "Trifolium pratense"
    ],
    "kategorie": "plodiny",
    "shortDef": "Jetel luční je vytrvalá pícnina pěstovaná pro krmivo a zlepšení půdy.",
    "longDef": "Jetel luční (Trifolium pratense) je vytrvalá rostlina z čeledi bobovitých, běžně pěstovaná jako pícnina. Je ceněn pro vysoký obsah bílkovin a schopnost fixovat dusík, čímž obohacuje půdu. V České republice se často využívá v osevních postupech pro zlepšení půdní struktury a zvýšení úrodnosti. Jetel luční je také významnou součástí pastvin a luk, kde slouží jako kvalitní krmivo pro dobytek.",
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
    "shortDef": "Lupina je rod rostlin využívaný k produkci krmiva a zeleného hnojení.",
    "longDef": "Lupina, známá také jako vlčí bob, patří do čeledi bobovitých a zahrnuje několik druhů rostlin, které se pěstují pro semena bohatá na bílkoviny. V zemědělství se používá jako krmivo pro dobytek a jako zelené hnojení díky schopnosti fixovat dusík. V České republice je pěstování lupiny méně časté, ale její využití roste v ekologickém zemědělství pro zlepšení půdní úrodnosti a jako alternativa k sóji.",
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
    "term": "Bob polní",
    "alias": [
      "Vicia faba"
    ],
    "kategorie": "plodiny",
    "shortDef": "Bob polní je luštěnina pěstovaná pro potravinářské a krmné účely.",
    "longDef": "Bob polní (Vicia faba) je rostlina z čeledi bobovitých, známá pro svá velká semena využívaná v potravinářství a jako krmivo pro zvířata. Je ceněn pro vysoký obsah bílkovin a vlákniny. V České republice se pěstuje hlavně jako krmná plodina, ale jeho využití v lidské výživě roste díky rostoucímu zájmu o zdravou stravu a alternativní zdroje bílkovin.",
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
    "shortDef": "Proso seté je obilnina pěstovaná pro potravinářské a krmné účely.",
    "longDef": "Proso seté (Panicum miliaceum) je jednoletá obilnina z čeledi lipnicovitých, známá pro svá malá semena využívaná v potravinářství a jako krmivo. Je ceněno pro svou nenáročnost na půdní a klimatické podmínky, což umožňuje jeho pěstování i v sušších oblastech. V České republice se proso pěstuje především pro výrobu krmiv a jako surovina pro bezlepkové potraviny, což je důležité pro osoby s celiakií.",
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
    "shortDef": "Čirok je obilnina pěstovaná pro potravinářské a krmné účely.",
    "longDef": "Čirok (Sorghum) je rod rostlin z čeledi lipnicovitých, zahrnující několik druhů pěstovaných jako obilnina pro lidskou výživu a krmivo pro zvířata. Je ceněn pro svou odolnost vůči suchu a schopnost růstu v různých klimatických podmínkách. V České republice je pěstování čiroku méně rozšířené, ale jeho význam roste díky zájmu o bezlepkové potraviny a alternativní zdroje energie, jako je bioetanol.",
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
    "term": "Pohanka obecná",
    "alias": [
      "Fagopyrum esculentum"
    ],
    "kategorie": "plodiny",
    "shortDef": "Pohanka obecná je pseudoobilnina pěstovaná pro potravinářské účely.",
    "longDef": "Pohanka obecná (Fagopyrum esculentum) je jednoletá rostlina z čeledi rdesnovitých, pěstovaná jako pseudoobilnina. Je ceněna pro svou nutriční hodnotu, zejména vysoký obsah rutinu a bílkovin, a je oblíbená v bezlepkové dietě. V České republice se pohanka tradičně pěstuje a konzumuje, a to zejména ve formě kaší, mouky a dalších potravinářských výrobků. Její pěstování je podporováno pro její pozitivní vliv na půdní strukturu a biodiverzitu.",
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
    "shortDef": "Svazenka vratičolistá je jednoletá rostlina využívaná jako zelené hnojivo.",
    "longDef": "Svazenka vratičolistá (Phacelia tanacetifolia) je jednoletá rostlina z čeledi brutnákovitých. V zemědělství se využívá především jako meziplodina pro zlepšení struktury půdy a obohacení o organickou hmotu.\n\nDíky rychlému růstu a schopnosti potlačovat plevele je svazenka oblíbená v ekologickém zemědělství. Kromě toho přitahuje opylovače, což podporuje biodiverzitu.\n\nV České republice je svazenka často využívána v systémech zeleného hnojení a jako součást osevních postupů pro zlepšení půdní úrodnosti.",
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
    ]
  },
  {
    "slug": "cizrna",
    "term": "Cizrna",
    "kategorie": "plodiny",
    "shortDef": "Cizrna je luštěnina známá pro vysoký obsah bílkovin a vlákniny.",
    "longDef": "Cizrna (Cicer arietinum) je luštěnina patřící do čeledi bobovitých. Je ceněna pro vysoký obsah bílkovin, vlákniny a dalších živin.\n\nV zemědělství se cizrna pěstuje v oblastech s teplým a suchým klimatem. Její pěstování přispívá k obohacení půdy o dusík díky symbióze s hlízkovými bakteriemi.\n\nV České republice je pěstování cizrny méně rozšířené, ale její spotřeba roste díky popularitě zdravé výživy.",
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
    ]
  },
  {
    "slug": "vdj",
    "term": "VDJ – velká dobytčí jednotka",
    "alias": [
      "velká dobytčí jednotka"
    ],
    "kategorie": "chov",
    "shortDef": "VDJ je standardizovaná jednotka pro vyjádření velikosti chovu hospodářských zvířat.",
    "longDef": "Velká dobytčí jednotka (VDJ) je standardizovaná měrná jednotka používaná k vyjádření velikosti chovu hospodářských zvířat. Jedna VDJ odpovídá hmotnosti 500 kg živé hmotnosti.\n\nTato jednotka umožňuje srovnávání různých druhů zvířat a jejich počtu v rámci zemědělských statistik a plánování.\n\nV České republice je VDJ používána v rámci zemědělských dotací a plánování kapacit pro chov hospodářských zvířat.",
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
    "term": "ECM – mléko přepočtené na energii",
    "alias": [
      "ECM"
    ],
    "kategorie": "chov",
    "shortDef": "ECM je ukazatel přepočítávající mléko na standardizovanou energetickou hodnotu.",
    "longDef": "ECM (Energy Corrected Milk) je ukazatel, který přepočítává množství mléka na standardizovanou energetickou hodnotu. Tento přepočet zohledňuje obsah tuku a bílkovin v mléce.\n\nPoužívá se pro objektivní srovnání produkce mléka mezi různými chovy a plemeny. ECM umožňuje zemědělcům lépe hodnotit efektivitu a ekonomiku mléčné produkce.\n\nV České republice je ECM běžně využíváno při hodnocení mléčných farem a v rámci zemědělských statistik.",
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
    "term": "Zaprahnutí (stání na sucho)",
    "alias": [
      "stání na sucho"
    ],
    "kategorie": "chov",
    "shortDef": "Zaprahnutí je období, kdy dojnice přestává být dojena před porodem.",
    "longDef": "Zaprahnutí, neboli stání na sucho, je období v chovu dojnic, kdy kráva přestává být dojena přibližně 60 dní před očekávaným porodem. Toto období je důležité pro regeneraci mléčné žlázy a přípravu na další laktaci.\n\nBěhem zaprahnutí se mění krmná dávka a péče o zvíře, aby se zajistilo jeho zdraví a optimální podmínky pro nadcházející porod.\n\nV České republice je zaprahnutí standardní součástí managementu chovu dojnic, která přispívá k udržení vysoké produkce mléka a zdraví zvířat.",
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
    "shortDef": "Stelivo je materiál používaný v chovu zvířat pro zajištění pohodlí a hygieny.",
    "longDef": "Stelivo je materiál používaný v chovu hospodářských zvířat k zajištění jejich pohodlí a hygieny. Obvykle se jedná o slámu, piliny nebo speciální průmyslové produkty.\n\nStelivo pomáhá udržovat suché a čisté prostředí ve stájích, což přispívá ke zdraví zvířat a snižuje riziko onemocnění.\n\nV České republice je volba steliva závislá na typu chovu a dostupnosti materiálů, přičemž se stále více využívají ekologické a recyklovatelné materiály.",
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
    ]
  },
  {
    "slug": "hluboka-podestylka",
    "term": "Hluboká podestýlka",
    "alias": [
      "hluboké lože",
      "hluboké stelivo"
    ],
    "kategorie": "chov",
    "shortDef": "Hluboká podestýlka je metoda ustájení hospodářských zvířat na vrstvě slámy nebo jiného materiálu, která se pravidelně doplňuje.",
    "longDef": "Hluboká podestýlka je způsob ustájení, kde se zvířata chovají na vrstvě slámy nebo jiného organického materiálu. Tento materiál se pravidelně doplňuje, ale neodstraňuje, což umožňuje jeho postupné rozkládání a vytváření tepla. \n\nPoužívá se především v chovu skotu a prasat, kde zajišťuje komfort a teplo pro zvířata, a zároveň přispívá k lepší hygieně. \n\nV praxi se hluboká podestýlka často kombinuje s jinými systémy ustájení a je oblíbená pro svou jednoduchost a efektivitu v menších i středně velkých chovech.",
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
    "term": "Laktační křivka",
    "alias": [
      "produkční křivka"
    ],
    "kategorie": "chov",
    "shortDef": "Laktační křivka je grafické znázornění produkce mléka u dojnic v průběhu laktace.",
    "longDef": "Laktační křivka představuje změny v produkci mléka u dojnic během laktace, obvykle trvající kolem 305 dní. \n\nGraficky znázorňuje, jak produkce mléka stoupá po porodu, dosahuje vrcholu a následně klesá. \n\nTato křivka je klíčová pro řízení výživy a zdraví stáda, protože pomáhá optimalizovat krmení a sledovat zdravotní stav dojnic. V ČR se používá v rámci moderních chovatelských systémů a je důležitá pro zvyšování efektivity produkce mléka.",
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
    "term": "Brakace (vyřazování zvířat)",
    "alias": [
      "vyřazování",
      "selektivní vyřazení"
    ],
    "kategorie": "chov",
    "shortDef": "Brakace je proces vyřazování zvířat z chovu na základě nevyhovujících vlastností nebo zdravotního stavu.",
    "longDef": "Brakace je metoda selektivního vyřazování zvířat z chovu, která se používá k udržení nebo zlepšení kvality stáda. \n\nZvířata mohou být vyřazována kvůli genetickým vadám, nízké produkci, zdravotním problémům nebo nevhodnému chování. \n\nV praxi je brakace důležitá pro optimalizaci chovných programů a zajištění ekonomické efektivity chovu. V ČR je tento proces běžnou součástí řízení chovů skotu, prasat i drůbeže.",
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
      "intenzivní výkrm"
    ],
    "kategorie": "chov",
    "shortDef": "Výkrm skotu je proces zvyšování hmotnosti skotu za účelem produkce masa.",
    "longDef": "Výkrm skotu je zaměřen na zvyšování hmotnosti a zlepšení masné výtěžnosti skotu. \n\nPoužívají se různé krmné strategie, které zahrnují vyváženou dietu s vysokým obsahem energie a bílkovin. \n\nV ČR je výkrm skotu důležitou součástí masného průmyslu a je řízen pravidly pro welfare zvířat a efektivní využití zdrojů. Výkrm se často provádí v intenzivních podmínkách, ale i na pastvinách.",
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
    "term": "Odchov telat",
    "alias": [
      "odchov mláďat",
      "chov telat"
    ],
    "kategorie": "chov",
    "shortDef": "Odchov telat je proces péče a výživy telat od narození do odstavu.",
    "longDef": "Odchov telat zahrnuje péči o telata od narození až po dosažení věku, kdy jsou schopna samostatně přijímat pevnou potravu. \n\nZahrnuje správnou výživu, zdravotní péči a vhodné ustájení, které jsou klíčové pro zdravý růst a vývoj. \n\nV ČR je odchov telat důležitou součástí mléčného i masného chovu, s důrazem na welfare zvířat a efektivitu chovu. Moderní metody zahrnují například používání mléčných náhražek a automatizovaných krmných systémů.",
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
    "term": "Křížení plemen",
    "alias": [
      "hybridizace",
      "genetické křížení"
    ],
    "kategorie": "chov",
    "shortDef": "Křížení plemen je genetická metoda využívaná k získání potomstva s žádoucími vlastnostmi z různých plemen.",
    "longDef": "Křížení plemen je proces, při kterém se kombinují genetické vlastnosti dvou nebo více plemen za účelem získání potomstva s lepšími produkčními nebo adaptivními vlastnostmi. \n\nTato metoda se využívá ke zvýšení odolnosti vůči nemocem, zlepšení růstu nebo produkce mléka. \n\nV ČR je křížení plemen běžnou praxí v chovu skotu, prasat a drůbeže, a je regulováno chovatelskými programy pro zachování genetické diverzity a zajištění kvality produkce.",
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
    "shortDef": "N-senzor je zařízení používané k optimalizaci dávkování dusíkatých hnojiv na základě aktuální potřeby rostlin.",
    "longDef": "N-senzor je technologické zařízení, které měří obsah chlorofylu v rostlinách pomocí spektrální analýzy. Tento přístroj pomáhá zemědělcům určit optimální dávku dusíkatých hnojiv, což vede k efektivnějšímu využití hnojiv a snížení jejich nadměrného použití.\n\nPoužití N-senzoru umožňuje variabilní dávkování hnojiv, což zlepšuje výnosy a snižuje environmentální dopady. Data získaná z N-senzoru se často integrují do aplikačních map, které jsou pak využívány při precizním zemědělství.\n\nV České republice se N-senzory stávají stále častější součástí moderního zemědělství, zejména u velkých podniků, které se zaměřují na efektivitu a udržitelnost.",
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
    ]
  },
  {
    "slug": "mapa-vra",
    "term": "Aplikační mapa (variabilní dávkování)",
    "kategorie": "precise-farming",
    "shortDef": "Aplikační mapa je nástroj pro variabilní dávkování hnojiv a pesticidů podle potřeb jednotlivých částí pole.",
    "longDef": "Aplikační mapa je digitální mapa, která obsahuje informace o variabilitě půdních a rostlinných podmínek na poli. Tyto mapy jsou vytvářeny na základě dat z různých senzorů a analýz, jako jsou N-senzory nebo satelitní snímky.\n\nVyužití aplikačních map umožňuje zemědělcům aplikovat hnojiva a pesticidy přesně tam, kde jsou nejvíce potřeba, což zvyšuje efektivitu a snižuje náklady. Tento přístup také minimalizuje negativní dopady na životní prostředí.\n\nV České republice se aplikační mapy stávají běžnou praxí v rámci precizního zemědělství, zejména u podniků, které investují do moderních technologií a udržitelného hospodaření.",
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
    ]
  },
  {
    "slug": "rtk-baze",
    "term": "RTK báze",
    "kategorie": "precise-farming",
    "shortDef": "RTK báze je referenční stanice pro zajištění vysoké přesnosti GPS navigace v zemědělství.",
    "longDef": "RTK báze je stacionární GPS stanice, která poskytuje korekční signály pro zvýšení přesnosti polohových dat z GPS přijímačů. RTK technologie umožňuje dosáhnout přesnosti polohování na úrovni centimetrů.\n\nV zemědělství se RTK báze využívá pro přesné řízení strojů, jako je setí, aplikace hnojiv a sklizeň, což zvyšuje efektivitu a snižuje ztráty. Přesná navigace umožňuje také lepší využití půdy a snížení překryvů při aplikaci.\n\nV České republice je RTK technologie stále více využívána, zejména u velkých zemědělských podniků, které investují do precizního zemědělství pro zvýšení produktivity a udržitelnosti.",
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
    ]
  },
  {
    "slug": "fmis",
    "term": "Farmářský informační systém (FMIS)",
    "kategorie": "precise-farming",
    "shortDef": "FMIS je softwarový systém pro řízení a optimalizaci zemědělských operací a zdrojů.",
    "longDef": "Farmářský informační systém (FMIS) je komplexní softwarová platforma, která integruje data z různých zdrojů, jako jsou senzory, GPS a aplikační mapy, pro efektivní řízení zemědělských činností.\n\nFMIS umožňuje zemědělcům plánovat a monitorovat operace, optimalizovat využití zdrojů a zlepšovat rozhodovací procesy. Systém podporuje také sledování nákladů, výnosů a dodržování legislativních požadavků.\n\nV České republice se FMIS stává důležitým nástrojem pro moderní zemědělce, kteří usilují o zvyšování efektivity a udržitelnosti svých podniků, a je často integrován s dalšími technologiemi precizního zemědělství.",
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
    ]
  },
  {
    "slug": "ec-pudy",
    "term": "Elektrická vodivost půdy (EC)",
    "kategorie": "precise-farming",
    "shortDef": "Elektrická vodivost půdy je měření schopnosti půdy vést elektrický proud, což indikuje její vlastnosti.",
    "longDef": "Elektrická vodivost půdy (EC) je indikátor, který měří schopnost půdy vést elektrický proud. Toto měření poskytuje informace o půdní struktuře, obsahu solí a vlhkosti, což jsou klíčové faktory pro růst rostlin.\n\nV zemědělství se měření EC využívá k mapování variability půdy na polích, což pomáhá při rozhodování o aplikaci hnojiv a zavlažování. Vyšší EC může indikovat vyšší obsah živin, ale také potenciální problémy se zasolením.\n\nV České republice je měření EC stále více využíváno v rámci precizního zemědělství, kde pomáhá optimalizovat zemědělské postupy a zvyšovat výnosy.",
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
    ]
  },
  {
    "slug": "senzor-vlhkosti-pudy",
    "term": "Senzor půdní vlhkosti",
    "kategorie": "precise-farming",
    "shortDef": "Senzor půdní vlhkosti je zařízení pro měření obsahu vody v půdě.",
    "longDef": "Senzor půdní vlhkosti je zařízení, které měří množství vody v půdě. Tyto senzory poskytují klíčové informace pro efektivní řízení zavlažování a optimalizaci růstu plodin.\n\nV zemědělství se senzory půdní vlhkosti používají k monitorování stavu půdy, což umožňuje přesné zavlažování a minimalizaci vodních ztrát. Data ze senzorů mohou být integrována do farmářských informačních systémů pro lepší rozhodování.\n\nV České republice jsou senzory půdní vlhkosti stále častěji využívány v rámci precizního zemědělství, kde pomáhají zvyšovat efektivitu využívání vody a zlepšovat výnosy.",
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
    ]
  },
  {
    "slug": "matif",
    "term": "MATIF (pařížská komoditní burza)",
    "alias": [
      "MATIF",
      "Pařížská burza"
    ],
    "kategorie": "dotace",
    "shortDef": "MATIF je pařížská komoditní burza specializující se na obchodování s futures kontrakty.",
    "longDef": "MATIF, známá jako pařížská komoditní burza, je významná evropská burza zaměřená na obchodování s futures kontrakty na zemědělské komodity a finanční produkty. \n\nBurza poskytuje platformu pro obchodování s komoditami jako jsou pšenice, kukuřice a další zemědělské produkty, což umožňuje producentům a obchodníkům zajišťovat ceny a řídit rizika. \n\nV České republice slouží MATIF jako referenční bod pro stanovení cen zemědělských komodit, což je důležité pro producenty při plánování a uzavírání obchodních smluv.",
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
    "term": "Intervenční nákup",
    "alias": [
      "Intervence",
      "Nákup intervence"
    ],
    "kategorie": "dotace",
    "shortDef": "Intervenční nákup je mechanismus, kterým stát stabilizuje trh s komoditami.",
    "longDef": "Intervenční nákup je ekonomický nástroj, který využívají státy nebo nadnárodní organizace k regulaci cen zemědělských komodit na trhu. \n\nCílem intervenčního nákupu je stabilizace cen a ochrana příjmů zemědělců v době, kdy tržní ceny klesají pod určitou úroveň. \n\nV České republice se tento nástroj používá v rámci společné zemědělské politiky EU, kde Evropská unie může nakupovat přebytky produkce a tím udržovat stabilitu trhu.",
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
    "term": "Komoditní burza",
    "alias": [
      "Burza komodit",
      "Trh komodit"
    ],
    "kategorie": "dotace",
    "shortDef": "Komoditní burza je trh, kde se obchoduje s komoditami jako jsou zemědělské produkty a suroviny.",
    "longDef": "Komoditní burza je organizovaný trh, kde se obchoduje s fyzickými komoditami a deriváty na tyto komodity. Na burze se obchoduje s produkty jako pšenice, kukuřice, ropa, kovy a další suroviny, což umožňuje producentům a obchodníkům zajišťovat ceny a řídit rizika. V České republice a Evropě hrají komoditní burzy klíčovou roli v určování cen zemědělských produktů, což je důležité pro plánování a obchodní strategie zemědělců.",
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
      "Základní cena"
    ],
    "kategorie": "dotace",
    "shortDef": "Bazická cena je rozdíl mezi cenou komodity na místním trhu a její cenou na futures trhu.",
    "longDef": "Bazická cena, známá také jako basis, je rozdíl mezi spotovou cenou komodity na místním trhu a její cenou na futures trhu. \n\nTento rozdíl je klíčovým ukazatelem pro obchodníky, kteří využívají futures kontrakty k zajištění proti cenovým výkyvům. \n\nV České republice je sledování bazické ceny důležité pro zemědělce a obchodníky při rozhodování o prodeji nebo nákupu komodit, zejména v souvislosti s cenami na burzách jako MATIF.",
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
    "shortDef": "Forwardový kontrakt je smlouva o budoucím prodeji nebo nákupu komodity za předem stanovenou cenu.",
    "longDef": "Forwardový kontrakt je finanční nástroj, který umožňuje dvěma stranám dohodnout se na prodeji nebo nákupu komodity k určitému datu v budoucnosti za předem stanovenou cenu. \n\nTento typ kontraktu se často používá k zajištění proti cenovým výkyvům na trhu, což je důležité pro producenty a obchodníky. \n\nV České republice jsou forwardové kontrakty běžně používány v zemědělství pro zajištění stabilních příjmů a plánování produkce, zejména v souvislosti s cenami na burzách jako MATIF.",
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
    "term": "Skladné (skladovací poplatek)",
    "alias": [
      "Skladovací poplatek",
      "Poplatek za skladování"
    ],
    "kategorie": "dotace",
    "shortDef": "Skladné je poplatek za uskladnění komodit ve skladech.",
    "longDef": "Skladné, známé také jako skladovací poplatek, je částka účtovaná za uskladnění komodit ve skladech po určitou dobu. \n\nTento poplatek pokrývá náklady na skladování, jako jsou energie, údržba a bezpečnost, a je důležitým faktorem při kalkulaci celkových nákladů na obchodování s komoditami. \n\nV České republice je skladné běžně účtováno zemědělcům a obchodníkům, kteří potřebují uskladnit své produkty před jejich prodejem nebo distribucí.",
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
    "shortDef": "Sušina je podíl pevné hmoty v materiálu po odstranění vody, vyjádřený v procentech.",
    "longDef": "Sušina představuje množství pevné hmoty, které zůstane po odstranění veškeré vody z materiálu, a je vyjádřena v procentech. Používá se k hodnocení kvality krmiv, plodin a dalších zemědělských produktů, protože poskytuje informace o obsahu živin. V praxi se sušina často měří pomocí sušáren nebo speciálních laboratorních zařízení. V České republice je sušina důležitým parametrem při stanovení kvality krmiv pro hospodářská zvířata.",
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
    "term": "NEL – netto energie laktace",
    "alias": [
      "netto energie laktace"
    ],
    "kategorie": "jednotky",
    "shortDef": "NEL je jednotka měřící dostupnou energii pro produkci mléka u dojnic.",
    "longDef": "Netto energie laktace (NEL) je jednotka používaná k vyjádření množství energie, kterou krmivo poskytuje pro produkci mléka u dojnic. Tato hodnota zohledňuje energii potřebnou pro údržbu a růst zvířete. NEL se vypočítává na základě obsahu energie v krmivu a jeho stravitelnosti. V praxi se využívá k optimalizaci krmných dávek a zajištění efektivní produkce mléka. V České republice je NEL klíčovým parametrem při formulaci krmných směsí pro mléčný skot.",
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
    "term": "PDI – stravitelný protein",
    "alias": [
      "stravitelný protein"
    ],
    "kategorie": "jednotky",
    "shortDef": "PDI je jednotka pro měření množství stravitelného proteinu v krmivu.",
    "longDef": "PDI, neboli stravitelný protein, je jednotka používaná k vyjádření množství proteinu, který je skutečně stravitelný a využitelný zvířetem. Tento ukazatel je klíčový při hodnocení kvality krmiv, zejména pro přežvýkavce. Výpočet PDI zahrnuje analýzu obsahu proteinu a jeho stravitelnosti v zažívacím traktu. V České republice se PDI používá při formulaci krmných směsí, aby byla zajištěna optimální výživa hospodářských zvířat.",
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
    "shortDef": "Výnos je množství produkce získané z jednoho hektaru půdy, vyjádřené v tunách.",
    "longDef": "Výnos (t/ha) je klíčová jednotka používaná k vyjádření množství zemědělské produkce sklizené z jednoho hektaru půdy. Tento ukazatel je zásadní pro hodnocení efektivity pěstování plodin a plánování zemědělských činností. Výnos závisí na mnoha faktorech, včetně kvality půdy, klimatických podmínek a použitých agronomických postupů. V České republice je výnos důležitým parametrem pro hodnocení ekonomické efektivity zemědělských podniků.",
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
    "term": "Objemová hmotnost obilí",
    "alias": [
      "objemová hmotnost"
    ],
    "kategorie": "jednotky",
    "shortDef": "Objemová hmotnost obilí je hmotnost obilí na jednotku objemu, vyjádřená v kg/m³.",
    "longDef": "Objemová hmotnost obilí je měřítko hustoty obilí, které udává hmotnost v kilogramech na metr krychlový (kg/m³). Tento ukazatel je důležitý pro hodnocení kvality a skladovatelnosti obilí. Vyšší objemová hmotnost obvykle značí lepší kvalitu zrna. Měření se provádí pomocí speciálních zařízení, jako jsou objemové hustoměry. V České republice je objemová hmotnost klíčovým parametrem při obchodování s obilím a stanovování ceny.",
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
    "term": "Aplikační dávka (l/ha)",
    "alias": [
      "aplikační dávka"
    ],
    "kategorie": "jednotky",
    "shortDef": "Aplikační dávka je množství kapaliny aplikované na jeden hektar půdy, vyjádřené v litrech.",
    "longDef": "Aplikační dávka (l/ha) je jednotka používaná k vyjádření množství kapalného přípravku, jako jsou hnojiva nebo pesticidy, aplikovaného na jeden hektar půdy. Správné určení aplikační dávky je klíčové pro efektivní a bezpečné použití agrochemikálií. Dávka závisí na druhu přípravku, typu plodiny a podmínkách prostředí. V České republice se aplikační dávky řídí legislativními normami a doporučeními výrobců, aby byla zajištěna ochrana životního prostředí a zdraví lidí.",
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
