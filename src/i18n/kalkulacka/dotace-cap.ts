import type { Locale } from '../config';
import { SAZBY } from '../../lib/cap-dotace';

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

const cs: DotaceCapContent = {
    title: 'Kalkulačka dotací CAP 2024 — BISS, CISS, EKO, ANC, VCS',
    metaDescription: 'Spočítejte, jaké přímé platby vám připadnou ze Společné zemědělské politiky 2023–2027. Zahrnuje BISS, CISS, EKO, ANC i VCS pro citlivé sektory.',
    kicker: 'Kalkulačka · CAP 2024',
    h1: 'Kolik dostanete na dotacích',
    lede: 'Orientační kalkulátor přímých plateb Společné zemědělské politiky 2023–2027 — sečte BISS, CISS, EKO, ANC a VCS pro citlivé sektory. Sazby vychází z veřejných materiálů SZIF/MZe.',
    crumbHome: 'Domů',
    crumbHub: 'Kalkulačky',
    crumbSelf: 'Dotace CAP',
    faq: [
      {
        q: 'Jaké dotace mi reálně přijdou na účet?',
        a: 'Kalkulačka sčítá hlavní přímé platby SZP 2023–2027 (BISS + CISS + EKO + ANC + VCS pro citlivé sektory + bonus Mladý zemědělec). Investiční dotace (Intervence 33.73, 37.73 a další z PRV) jsou samostatné výzvy a nepočítáme je. Pojistné kompenzace, AEKO smlouvy a Welfare zvířat také ne.',
      },
      {
        q: 'Jsou sazby aktuální?',
        a: `Sazby vychází z veřejně dostupných materiálů SZIF / MZe pro rok 2024 (BISS ${SAZBY.biss} Kč/ha, CISS ${SAZBY.ciss} Kč/ha pro prvních ${SAZBY.cissMaxHa} ha, EKO základní ${SAZBY.ekoBasic} Kč/ha). Oficiální sazby pro daný rok SZIF zveřejňuje až po uzávěrce kampaně, takže celková částka se může lišit o ±5–10 %.`,
      },
      {
        q: 'Co je CISS a proč jen na prvních 150 ha?',
        a: `CISS (Complementary Redistributive Income Support) je redistributivní platba — sníží disproporci mezi malými a velkými farmami. Platí se ${SAZBY.ciss} Kč/ha pouze na prvních ${SAZBY.cissMaxHa} ha. Velká farma s 500 ha dostane CISS jen za prvních ${SAZBY.cissMaxHa} ha, malá s 50 ha dostane CISS na celou výměru.`,
      },
      {
        q: 'Kdy se vyplatí EKO premium?',
        a: `EKO premium režim platí vyšší sazbu (${SAZBY.ekoPremium} Kč/ha) za víc eko-praktik — meziplodiny, krycí plodiny, biopásy, neproduktivní plochy ad. Vyplatí se vždy, kdy je farma schopná praktiky uskutečnit bez výrazného dopadu na hektarový výnos. Rozdíl proti základnímu EKO (${SAZBY.ekoBasic} Kč/ha) je ${SAZBY.ekoPremium - SAZBY.ekoBasic} Kč/ha.`,
      },
      {
        q: 'Co je ANC a komu se vyplatí?',
        a: 'ANC = Areas with Natural Constraints, méně příznivé oblasti. Tři kategorie: horská (H1–H5, nejvyšší sazba ~4500 Kč/ha průměr), ostatní oblast (OA, ~2000 Kč/ha) a oblasti se specifickým omezením (SV, ~2000 Kč/ha). Zařazení LPIS bloku do ANC kategorie je dáno průměrnou nadmořskou výškou, sklonem, půdním typem a podloží — najdete v evidenci LPIS u svého LPIS bloku.',
      },
      {
        q: 'Vyplatí se VCS u méně známých sektorů?',
        a: 'Ano, zejména u chmele (~13000 Kč/ha) a polní zeleniny (~9000 Kč/ha) je sazba významná — i 5 ha přidá 45–65 tis. Kč/rok. U krmných plodin (~1100 Kč/ha) je sazba spíš orientační — citelná až od desítek hektarů.',
      },
      {
        q: 'Kalkulačka je závazná?',
        a: 'NE. Slouží jako orientace pro plánování. Závazné částky stanovuje SZIF (https://www.szif.cz) po uzávěrce roční kampaně a po kontrole LPIS a sankčního systému. Při překročení limitů nebo nesplnění podmínek (např. greening) může být skutečná platba i o desítky procent nižší.',
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
