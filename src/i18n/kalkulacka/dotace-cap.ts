import type { Locale } from '../config';
import { SAZBY, LIMITY, ROK_SAZEB, KURZ_CZK_EUR, ZALOHA_PROCENT, formatSazba, formatKc } from '../../lib/cap-dotace';

export interface DotaceCapFaq { q: string; a: string }

export interface DotaceCapContent {
  title: string;
  metaDescription: string;
  kicker: string;
  h1: string;
  lede: string;
  crumbHome: string;
  crumbHub: string;
  crumbSelf: string;
  faq: DotaceCapFaq[];
}

const kc = (n: number) => `${formatSazba(n)} Kč/ha`;

const cs: DotaceCapContent = {
    title: `Kalkulačka přímých plateb ${ROK_SAZEB} — BISS, redistributivní platba, ekoplatby, CIS`,
    metaDescription: `Spočítejte přímé platby SZP v ČR podle sazeb za rok ${ROK_SAZEB} (MZe, 2. 10. 2026): BISS, redistributivní platba, mladý a malý zemědělec, ekoplatby a podpora vázaná na produkci (CIS).`,
    kicker: `Kalkulačka · sazby ${ROK_SAZEB}`,
    h1: 'Kolik dostanete na přímých platbách',
    lede: `Orientační výpočet přímých plateb Společné zemědělské politiky v ČR podle sazeb za rok ${ROK_SAZEB}, které ministr zemědělství schválil 2. 10. 2026. Sečte základní platbu BISS, redistributivní platbu, platbu pro mladé zemědělce, ekoplatby a podporu vázanou na produkci (CIS).`,
    crumbHome: 'Domů',
    crumbHub: 'Kalkulačky',
    crumbSelf: 'Přímé platby SZP',
    faq: [
      {
        q: 'Jaké platby kalkulačka počítá?',
        a: 'Přímé platby I. pilíře SZP v ČR: základní platbu BISS, redistributivní platbu, platbu pro mladé zemědělce, platbu pro malé zemědělce, ekoplatby (základní, prémiovou, údržbu a vytváření krajinných prvků, hospodaření s živinami, pásové střídání plodin) a podporu vázanou na produkci (CIS) — plodiny na hektar, dojnice, telata masného typu a bahnice s kozami na kus. Platby II. pilíře (ANC, AEKO, ekologické zemědělství, Natura 2000) ani investiční dotace nepočítá.',
      },
      {
        q: 'Jsou sazby aktuální?',
        a: `Ano, jde o sazby za rok ${ROK_SAZEB}, které ministr zemědělství schválil 2. 10. 2026 (tisková zpráva MZe). Z eur je MZe přepočetlo kurzem ECB k 30. 9. 2026, tj. ${KURZ_CZK_EUR.toLocaleString('cs-CZ')} Kč/EUR. Například BISS ${kc(SAZBY.biss)}, redistributivní platba ${kc(SAZBY.redistributivni)}, základní ekoplatba ${kc(SAZBY.ekoZakladni)}. SZIF vyplácí zálohy ve výši ${ZALOHA_PROCENT} %.`,
      },
      {
        q: 'Proč je redistributivní platba jen na prvních 150 ha?',
        a: `Redistributivní platba přesouvá peníze k menším a středním podnikům. Podle § 9 odst. 3 nařízení vlády č. 83/2023 Sb. se poskytuje nejvýše na ${LIMITY.redistributivniMaxHa} ha (${kc(SAZBY.redistributivni)}), a to jen tomu, kdo má nárok na BISS. Podnik s 500 ha ji dostane na ${LIMITY.redistributivniMaxHa} ha, podnik s 50 ha na celou výměru.`,
      },
      {
        q: 'Na co se vyplácí prémiová ekoplatba?',
        a: `Ne na celou výměru. Prémiová ekoplatba (${kc(SAZBY.ekoPremiova)}) se platí jen na neprodukční plochy — krajinné prvky, nektarodárné liniové úhory, ochranné pásy, biopásy — nejvýš do 10 % výměry orné půdy (standardní orná půda, úhor, travní porost), a na ochranné pásy podél vody typu prémiový (§ 24 nařízení vlády č. 83/2023 Sb.). Podmínkou je základní ekoplatba a vyčlenění aspoň 7 % neprodukčních ploch, z toho aspoň 2 % krajinných prvků, liniových úhorů nebo ochranných pásů.`,
      },
      {
        q: 'Vyplatí se platba pro malé zemědělce?',
        a: `Je jen pro podniky, které mají v LPIS nejvýš ${LIMITY.maliMaxVymeraPodnikuHa} ha zemědělské půdy, a platí se nejvýš na ${LIMITY.maliMaxHa} ha (${kc(SAZBY.maliZemedelci)}, tedy nejvýš ${formatKc(LIMITY.maliMaxHa * SAZBY.maliZemedelci)}). Nahrazuje všechny ostatní přímé platby — kdo o ni žádá, nemůže žádat o BISS, redistributivní platbu, platbu pro mladé zemědělce, CIS ani ekoplatby. Platby II. pilíře (ANC, AEKO) zůstávají možné. U podniku do 10 ha kalkulačka ukáže obě varianty vedle sebe.`,
      },
      {
        q: 'Proč kalkulačka nepočítá ANC?',
        a: 'Platba pro oblasti s přírodními omezeními (ANC) není přímá platba, ale opatření II. pilíře podle nařízení vlády č. 61/2023 Sb. Sazba v EUR/ha se liší podle typu oblasti (horské H1–H5, ostatní O1–O3, specifické S) a zaměření podniku a nad 300 ha klesá. Žádá se o ni v Jednotné žádosti u SZIF (szif.gov.cz/cs/jednotna-zadost). Průměrnou sazbu kalkulačka záměrně neuvádí.',
      },
      {
        q: 'Je výpočet závazný?',
        a: 'Ne. Jde o orientační výpočet, závazná jsou rozhodnutí SZIF. Skutečná platba závisí na kontrole ploch a zvířat a na splnění podmínek — podmíněnosti, podmínek ekoplateb a CIS (například minimální výnosy u ovoce a zeleniny). Při porušení se platby krátí nebo neposkytnou.',
      },
    ],
};

const sk: DotaceCapContent = {
    title: 'Kalkulačka priamych platieb SPP 2024 — BISS, CRISS, ekoschéma, VCS',
    metaDescription: 'Vypočítajte si, aké priame platby vám pripadnú zo Spoločnej poľnohospodárskej politiky 2023–2027 na Slovensku. BISS, redistributívna platba, ekoschéma a viazané platby v EUR.',
    kicker: 'Kalkulačka · SPP 2024',
    h1: 'Koľko dostanete na priamych platbách',
    lede: 'Orientačný kalkulátor priamych platieb Spoločnej poľnohospodárskej politiky 2023–2027 na Slovensku — spočíta BISS, redistributívnu platbu (CRISS), ekoschému a viazané platby (VCS). Sadzby vychádzajú z oficiálneho Excelu PPA pre rok 2024.',
    crumbHome: 'Domov',
    crumbHub: 'Kalkulačky',
    crumbSelf: 'Priame platby SPP',
    faq: [
      { q: 'Aké platby kalkulačka počíta?', a: 'Sčíta hlavné priame platby SPP 2023–2027: základnú podporu príjmu (BISS), redistributívnu platbu (CRISS), celofarmskú ekoschému a viazané platby (VCS) na vybrané plodiny. Investičné dotácie, AEKO, welfare zvierat a platby na zviera nepočíta.' },
      { q: 'Sú sadzby aktuálne?', a: 'Vychádzajú z oficiálneho Excelu PPA „Sadzby priamych platieb pre rok 2024" (BISS 103,80 €/ha, CRISS 79 €/ha do 100,99 ha a 40 €/ha do 150 ha, ekoschéma 60,36 €/ha mimo CHVÚ a 110,45 €/ha v CHVÚ). Záväzné sadzby zverejňuje PPA — výsledok je orientačný (±5–10 %).' },
      { q: 'Čo je CRISS a prečo dva stupne?', a: 'Redistributívna platba podporuje malé a stredné podniky. Vypláca sa 79 €/ha na prvých 100,99 ha a 40 €/ha na plochu 100,99–150 ha; nad 150 ha sa neposkytuje.' },
      { q: 'Ako funguje ekoschéma a čo je CHVÚ?', a: 'Celofarmská ekoschéma sa vypláca dvoma sadzbami podľa toho, či plocha leží v chránenom vtáčom území (CHVÚ): 110,45 €/ha v CHVÚ a 60,36 €/ha mimo. Zadajte, koľko ha vašej výmery je v CHVÚ.' },
      { q: 'Počíta kalkulačka ANC?', a: 'Nie. Podpora pre oblasti s prírodnými obmedzeniami (ANC) sa v SR poskytuje samostatne v rámci rozvoja vidieka, nie ako priama platba — pozrite apa.sk.' },
      { q: 'Je výpočet záväzný?', a: 'Nie. Slúži na orientáciu pri plánovaní. Záväzné sumy stanovuje Pôdohospodárska platobná agentúra (PPA) po uzávierke kampane a po kontrole.' },
    ],
};

export const content: Record<Locale, DotaceCapContent> = { cs, sk, uk: cs };
