// „Kolik stojí…" — landing stránky s vysokým nákupním intentem, napojené na
// kalkulačky, srovnávač a bazar. Čísla jsou ORIENTAČNÍ tržní rozpětí (ČR 2026),
// ne nabídky konkrétních prodejců — přesný výpočet dělají kalkulačky. Žádné
// smyšlené zdroje ani konkrétní ceny modelů (ty se rychle mění).

export interface KsTableRow {
  label: string;
  values: string[];
}
export interface KsTable {
  caption: string;
  columns: string[]; // hlavičky (bez prvního sloupce = label)
  rows: KsTableRow[];
  note?: string;
}
export interface KsFaq {
  q: string;
  a: string;
}
export interface KsCta {
  href: string;
  title: string;
  desc: string;
}
export interface KsTopic {
  slug: string;
  /** H1 = přesně vyhledávaná otázka */
  question: string;
  metaTitle: string;
  metaDescription: string;
  kicker: string;
  /** Krátká přímá odpověď hned pod H1 (pro featured snippet). */
  quickAnswer: string;
  /** 1–2 odstavce kontextu. */
  intro: string[];
  table: KsTable;
  /** Co cenu ovlivňuje — bulletpointy. */
  factors: string[];
  faq: KsFaq[];
  /** Primární CTA na kalkulačku (nebo srovnávač). */
  ctas: KsCta[];
  /** Priorita v sitemap. */
  priority: string;
}

export const KOLIK_STOJI_TOPICS: KsTopic[] = [
  {
    slug: 'traktor',
    question: 'Kolik stojí traktor?',
    metaTitle: 'Kolik stojí traktor? Ceny nových i ojetých podle výkonu (2026)',
    metaDescription:
      'Orientační ceny traktorů podle třídy výkonu — nové i ojeté. Kompaktní od cca 400 tis. Kč, velké nad 6 mil. Kč. Spočítejte si leasing a porovnejte modely.',
    kicker: 'Pořízení techniky',
    quickAnswer:
      'Nový traktor v ČR stojí orientačně od 400 000 Kč za kompaktní stroj do 25 koní až po 6–12 milionů Kč za výkonné modely nad 250 koní. Ojeté stroje se pohybují zhruba na 30–60 % ceny nového podle stáří a motohodin.',
    intro: [
      'Cena traktoru se řídí především výkonem, výbavou a tím, zda kupujete nový, nebo ojetý stroj. Rozpětí je proto široké — od malých komunálních a sadařských traktůrků po těžké kolové traktory pro velkoplošné hospodaření.',
      'Následující tabulka ukazuje orientační tržní rozpětí podle tříd výkonu. Jde o vodítko pro rozpočet; konkrétní cena vždy závisí na značce, roce, výbavě a stavu stroje. Přesnou měsíční splátku při financování si spočítáte v kalkulačce leasingu.',
    ],
    table: {
      caption: 'Orientační ceny traktorů podle třídy výkonu (ČR, 2026)',
      columns: ['Nový', 'Ojetý (typicky)'],
      rows: [
        { label: 'Kompaktní do 50 koní', values: ['400 tis. – 900 tis. Kč', '150 – 500 tis. Kč'] },
        { label: 'Užitkový 50–100 koní', values: ['900 tis. – 2 mil. Kč', '350 tis. – 1,1 mil. Kč'] },
        { label: 'Střední 100–150 koní', values: ['1,8 – 3,5 mil. Kč', '700 tis. – 2 mil. Kč'] },
        { label: 'Výkonný 150–250 koní', values: ['3 – 6 mil. Kč', '1,3 – 3,5 mil. Kč'] },
        { label: 'Těžký nad 250 koní', values: ['6 – 12+ mil. Kč', '2,5 – 7 mil. Kč'] },
      ],
      note: 'Rozpětí je orientační a nezahrnuje DPH ani závěsné nářadí. Ojeté ceny silně kolísají podle motohodin a servisní historie.',
    },
    factors: [
      'Výkon motoru (koně / kW) — hlavní cenotvorný faktor',
      'Značka a řada (prémiové značky jsou o desítky procent dráž)',
      'Výbava: převodovka (CVT vs power-shift), hydraulika, odpružení, GPS navádění',
      'Stáří a motohodiny u ojetých strojů',
      'Sezóna a dostupnost — na jaře před sezónou ceny ojetin rostou',
    ],
    faq: [
      {
        q: 'Vyplatí se nový, nebo ojetý traktor?',
        a: 'Nový traktor má záruku, nižší poruchovost a moderní prvky (GPS, emisní normy), ale ztrácí nejvíc hodnoty v prvních letech. Ojetý stroj s prokazatelnou servisní historií a rozumným počtem motohodin bývá pro menší hospodářství ekonomičtější. Zvažte roční nájezd a náklady na opravy.',
      },
      {
        q: 'Kolik koní traktoru potřebuji?',
        a: 'Orientačně počítejte zhruba 1 koně na 1 hektar orné půdy u smíšeného provozu, ale rozhodující je nejtěžší operace (orba, podmítka). Pro přesnější odhad podle nářadí a výměry použijte srovnávač modelů a katalog techniky.',
      },
      {
        q: 'Dá se traktor pořídit na dotaci?',
        a: 'Mobilní stroje jako traktory bývají v dotačních programech (např. investice do zemědělských podniků) podporované jen omezeně a se stropem. Aktuální podmínky a sazby najdete v sekci dotace a v kalkulačce dotací CAP.',
      },
    ],
    ctas: [
      { href: '/kalkulacka/leasing-traktoru/', title: 'Kalkulačka leasingu', desc: 'Spočítejte měsíční splátku podle akontace a doby splácení' },
      { href: '/srovnani/', title: 'Srovnávač traktorů', desc: 'Porovnejte dva modely vedle sebe podle výkonu a parametrů' },
      { href: '/bazar/', title: 'Agro bazar', desc: 'Aktuální nabídka ojetých traktorů od prodejců' },
    ],
    priority: '0.75',
  },
  {
    slug: 'kombajn',
    question: 'Kolik stojí kombajn?',
    metaTitle: 'Kolik stojí kombajn? Ceny sklízecích mlátiček podle třídy (2026)',
    metaDescription:
      'Orientační ceny sklízecích mlátiček — nové i ojeté. Střední třída od cca 5 mil. Kč, velké rotorové stroje nad 15 mil. Kč. Porovnejte modely a nabídku v bazaru.',
    kicker: 'Pořízení techniky',
    quickAnswer:
      'Nová sklízecí mlátička v ČR stojí orientačně od 5 milionů Kč za menší klasý stroj až po 20–25+ milionů Kč za výkonné rotorové kombajny s širokým žacím stolem. Ojeté stroje bývají na 40–65 % ceny nového.',
    intro: [
      'Kombajn je jedna z nejdražších investic v rostlinné výrobě a využívá se jen několik týdnů v roce. Proto řada podniků kombajn sdílí, najímá službu, nebo kupuje ojetý. Cena roste s hltností (výkonem mlátícího ústrojí), šířkou žacího stolu a mírou automatizace.',
      'Tabulka ukazuje orientační rozpětí podle třídy. U kombajnu počítejte i s cenou žacího stolu, adaptérů (např. na kukuřici) a s vysokými náklady na servis před sezónou.',
    ],
    table: {
      caption: 'Orientační ceny sklízecích mlátiček (ČR, 2026)',
      columns: ['Nový', 'Ojetý (typicky)'],
      rows: [
        { label: 'Menší klasý (do ~250 koní)', values: ['5 – 9 mil. Kč', '2 – 5 mil. Kč'] },
        { label: 'Střední třída (250–400 koní)', values: ['9 – 15 mil. Kč', '4 – 9 mil. Kč'] },
        { label: 'Výkonný rotorový (400+ koní)', values: ['15 – 25+ mil. Kč', '7 – 16 mil. Kč'] },
      ],
      note: 'Ceny bez DPH a obvykle bez žacího stolu, který je samostatná položka (statisíce až jednotky milionů).',
    },
    factors: [
      'Hltnost a systém mlácení (klasý vs rotorový / hybridní)',
      'Šířka a typ žacího stolu + adaptéry',
      'Automatizace: navádění, mapování výnosů, samočinné seřízení',
      'Počet motohodin bubnu a sklizňových hektarů u ojetin',
      'Značka a dostupnost náhradních dílů',
    ],
    faq: [
      {
        q: 'Vyplatí se vlastní kombajn, nebo služba?',
        a: 'Vlastní kombajn se obvykle vyplatí až od určité výměry (často stovky hektarů obilnin ročně), protože stroj většinu roku stojí. Pod touto hranicí bývá levnější sklizňová služba nebo sdílení stroje mezi podniky. Rozhoduje roční počet sklizených hektarů a možnost stroj využít i jinde.',
      },
      {
        q: 'Kolik hektarů zvládne kombajn za sezónu?',
        a: 'Střední kombajn zvládne orientačně 300–600 hektarů obilnin za sezónu podle výnosu, vlhkosti a organizace odvozu. Výkonné rotorové stroje i výrazně více. Pro plánování je klíčové úzké „okno" vhodného počasí.',
      },
    ],
    ctas: [
      { href: '/srovnani/', title: 'Srovnávač kombajnů', desc: 'Porovnejte mlátičky podle výkonu a záběru' },
      { href: '/kalkulacka/leasing-traktoru/', title: 'Kalkulačka financování', desc: 'Orientační měsíční splátka i pro dražší techniku' },
      { href: '/bazar/', title: 'Agro bazar', desc: 'Ojeté kombajny v aktuální nabídce' },
    ],
    priority: '0.7',
  },
  {
    slug: 'provoz-traktoru-na-hektar',
    question: 'Kolik stojí provoz traktoru na hektar?',
    metaTitle: 'Náklady na provoz traktoru na hektar — kolik to reálně stojí (2026)',
    metaDescription:
      'Z čeho se skládají náklady na provoz traktoru na hektar: nafta, servis, opotřebení, obsluha. Orientační rozpětí podle operace + kalkulačka nákladů na hektar.',
    kicker: 'Provozní náklady',
    quickAnswer:
      'Provozní náklady traktoru na hektar tvoří hlavně nafta, servis a opotřebení, mzda obsluhy a odpisy. U polních operací se přímé náklady pohybují orientačně od cca 300 Kč/ha u lehkých operací po 1 500 Kč/ha a více u těžké orby.',
    intro: [
      'Náklady na provoz traktoru nejde vyjádřit jedním číslem — liší se podle operace (orba je mnohem dražší než rozmetání), stáří stroje i ceny nafty. Pro rozpočet je užitečné rozložit je na složky a počítat na hektar.',
      'Největší a nejlépe ovlivnitelnou položkou je spotřeba nafty. Přesný výpočet nákladů na hektar podle vaší spotřeby, ceny paliva a dalších vstupů si udělejte v kalkulačce nákladů na hektar; úsporu paliva pak v kalkulačce úspory nafty.',
    ],
    table: {
      caption: 'Orientační přímé náklady traktoru podle operace (Kč/ha, 2026)',
      columns: ['Spotřeba nafty', 'Přímé náklady*'],
      rows: [
        { label: 'Orba', values: ['18–28 l/ha', '900 – 1 500 Kč/ha'] },
        { label: 'Podmítka / kypření', values: ['10–18 l/ha', '500 – 900 Kč/ha'] },
        { label: 'Setí', values: ['7–12 l/ha', '350 – 650 Kč/ha'] },
        { label: 'Postřik / rozmetání', values: ['3–6 l/ha', '200 – 400 Kč/ha'] },
      ],
      note: '*Přímé náklady = nafta + orientační servis a opotřebení. Bez mzdy obsluhy a odpisů stroje. Hodnoty silně závisí na půdě, hloubce zpracování a stavu techniky.',
    },
    factors: [
      'Typ a hloubka operace (orba je nejnáročnější)',
      'Cena nafty a spotřeba stroje (l/ha)',
      'Stáří traktoru a náklady na údržbu',
      'Půdní podmínky a vlhkost',
      'Šířka záběru nářadí a pracovní rychlost (více ha/hod = nižší fixní náklady na hektar)',
    ],
    faq: [
      {
        q: 'Jak snížit náklady na provoz traktoru na hektar?',
        a: 'Nejúčinnější je snížit spotřebu nafty — správným seřízením nářadí, vhodnou pracovní rychlostí, sníženým zpracováním půdy (mělčí podmítka místo orby) a využitím širších záběrů. Pomáhá i pravidelný servis, správný tlak v pneumatikách a plánování jízd. Konkrétní úsporu spočítá kalkulačka úspory nafty.',
      },
      {
        q: 'Co všechno patří do nákladů na hektar?',
        a: 'Kompletní náklady zahrnují palivo, mazadla, servis a náhradní díly, opotřebení a odpisy stroje, mzdu obsluhy a případně nájem nebo úrok z financování. Kalkulačka nákladů na hektar vám pomůže složky sečíst pro konkrétní operaci.',
      },
    ],
    ctas: [
      { href: '/kalkulacka/naklady-na-hektar/', title: 'Kalkulačka nákladů na hektar', desc: 'Sečtěte palivo, servis a další vstupy na jednu operaci' },
      { href: '/kalkulacka/uspora-nafty/', title: 'Kalkulačka úspory nafty', desc: 'Zjistěte, kolik ušetříte snížením spotřeby' },
    ],
    priority: '0.7',
  },
  {
    slug: 'leasing-traktoru',
    question: 'Kolik stojí leasing traktoru?',
    metaTitle: 'Kolik stojí leasing traktoru? Akontace, splátky a RPSN (2026)',
    metaDescription:
      'Jak funguje leasing traktoru: akontace, doba splácení, úrok a RPSN. Orientační příklad měsíční splátky + kalkulačka, kde si spočítáte vlastní variantu.',
    kicker: 'Financování',
    quickAnswer:
      'Měsíční splátka leasingu traktoru závisí na ceně stroje, akontaci (obvykle 10–30 %), době splácení (36–72 měsíců) a úroku. Orientačně u stroje za 2 miliony Kč s 20% akontací a splácením na 5 let vychází splátka řádově na desítky tisíc Kč měsíčně.',
    intro: [
      'Leasing a účelový úvěr patří k nejčastějším způsobům financování zemědělské techniky. Celková cena je vždy vyšší než pořizovací — připlácíte úrok a poplatky, které shrnuje ukazatel RPSN. Výše splátky se dá výrazně ovlivnit akontací a délkou splácení.',
      'Níže je zjednodušený příklad. Přesnou splátku pro váš stroj, akontaci a dobu splácení — včetně porovnání nabídek — si spočítáte v kalkulačce leasingu traktoru.',
    ],
    table: {
      caption: 'Modelový příklad: traktor za 2 000 000 Kč, úrok ~6 % p.a.',
      columns: ['Akontace 10 %', 'Akontace 30 %'],
      rows: [
        { label: 'Doba 36 měsíců', values: ['~55 000 Kč/měs', '~43 000 Kč/měs'] },
        { label: 'Doba 60 měsíců', values: ['~35 000 Kč/měs', '~27 000 Kč/měs'] },
        { label: 'Doba 72 měsíců', values: ['~30 000 Kč/měs', '~23 000 Kč/měs'] },
      ],
      note: 'Ilustrativní hodnoty pro představu o řádu, ne nabídka. Skutečná splátka závisí na úroku, poplatcích a pojištění konkrétní nabídky.',
    },
    factors: [
      'Pořizovací cena stroje',
      'Výše akontace (první zvýšené splátky) — vyšší akontace = nižší splátky',
      'Doba splácení (36–72 měsíců)',
      'Úroková sazba a poplatky (souhrnně RPSN)',
      'Zůstatková hodnota a případný odkup na konci',
    ],
    faq: [
      {
        q: 'Leasing, nebo úvěr na traktor?',
        a: 'Finanční leasing i účelový úvěr slouží podobně; liší se v tom, kdy přechází vlastnictví stroje a v účetním a daňovém režimu. Pro živnostníky a menší podniky bývá rozhodující cash-flow a možnost odpočtu DPH. Konkrétní porovnání proberte s poskytovatelem; kalkulačka pomůže srovnat splátky.',
      },
      {
        q: 'Jak snížit měsíční splátku?',
        a: 'Splátku snížíte vyšší akontací, delší dobou splácení nebo sjednáním o nižším úroku. Delší splácení ale zvyšuje celkově zaplacenou částku. V kalkulačce si snadno porovnáte varianty vedle sebe.',
      },
    ],
    ctas: [
      { href: '/kalkulacka/leasing-traktoru/', title: 'Kalkulačka leasingu traktoru', desc: 'Spočítejte splátku podle akontace, doby a úroku' },
      { href: '/kolik-stoji/traktor/', title: 'Kolik stojí traktor', desc: 'Orientační ceny podle výkonu — nové i ojeté' },
    ],
    priority: '0.7',
  },
  {
    slug: 'nafta-na-hektar',
    question: 'Kolik stojí nafta na hektar?',
    metaTitle: 'Kolik stojí nafta na hektar? Spotřeba a cena podle operace (2026)',
    metaDescription:
      'Spotřeba nafty na hektar podle operace × cena paliva. Orientační náklady na naftu od orby po postřik + kalkulačka úspory nafty pro váš provoz.',
    kicker: 'Provozní náklady',
    quickAnswer:
      'Náklady na naftu na hektar spočítáte jako spotřeba (l/ha) × cena nafty (Kč/l). Při ceně kolem 35 Kč/l vychází nafta orientačně od cca 100 Kč/ha u lehkého postřiku po 650–1 000 Kč/ha u hluboké orby.',
    intro: [
      'Nafta je největší přímý provozní náklad polních operací a nejlépe se optimalizuje. Výpočet je jednoduchý: vynásobíte spotřebu stroje na hektar aktuální cenou paliva. Rozdíly mezi operacemi jsou přitom několikanásobné.',
      'Tabulka ukazuje orientační spotřebu a náklad při ceně 35 Kč/l. Pro vlastní čísla — jinou cenu paliva i porovnání úspory při nižší spotřebě — použijte kalkulačku úspory nafty.',
    ],
    table: {
      caption: 'Orientační spotřeba a náklad na naftu (cena 35 Kč/l, 2026)',
      columns: ['Spotřeba', 'Náklad na naftu'],
      rows: [
        { label: 'Orba', values: ['18–28 l/ha', '630 – 980 Kč/ha'] },
        { label: 'Podmítka / kypření', values: ['10–18 l/ha', '350 – 630 Kč/ha'] },
        { label: 'Setí', values: ['7–12 l/ha', '245 – 420 Kč/ha'] },
        { label: 'Postřik / rozmetání', values: ['3–6 l/ha', '105 – 210 Kč/ha'] },
      ],
      note: 'Při jiné ceně nafty se náklad přepočítá lineárně. Zemědělská nafta může mít nárok na vratku spotřební daně („zelená nafta") — reálný náklad pak bývá nižší.',
    },
    factors: [
      'Cena nafty (Kč/l) a případná vratka spotřební daně',
      'Typ a hloubka operace',
      'Stav a seřízení stroje a nářadí',
      'Pracovní rychlost a tlak v pneumatikách',
      'Půdní podmínky a vlhkost',
    ],
    faq: [
      {
        q: 'Co je „zelená nafta" a jak ovlivní náklady?',
        a: 'Zemědělci mohou u nafty spotřebované v zemědělské prvovýrobě uplatnit vratku části spotřební daně (tzv. zelená nafta). Reálný náklad na palivo je pak nižší než čerpací cena. Konkrétní sazby a podmínky se řídí aktuální legislativou — sledujte sekci dotace a legislativa.',
      },
      {
        q: 'Jak nejvíc ušetřím na naftě?',
        a: 'Největší úsporu přináší omezení hlubokého zpracování půdy (mělčí podmítka místo orby, případně minimalizační technologie), správné seřízení a rychlost, širší záběry a údržba stroje. I malé snížení spotřeby na hektar se u velké výměry násobí. Spočítejte si to v kalkulačce úspory nafty.',
      },
    ],
    ctas: [
      { href: '/kalkulacka/uspora-nafty/', title: 'Kalkulačka úspory nafty', desc: 'Kolik ušetříte snížením spotřeby na hektar' },
      { href: '/kalkulacka/naklady-na-hektar/', title: 'Kalkulačka nákladů na hektar', desc: 'Sečtěte naftu i další vstupy na operaci' },
    ],
    priority: '0.7',
  },
];

export function getKolikStojiTopic(slug: string): KsTopic | undefined {
  return KOLIK_STOJI_TOPICS.find((t) => t.slug === slug);
}
