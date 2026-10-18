import type { Locale } from '../config';
import { SAZBY, LIMITY, ROK_SAZEB, KURZ_CZK_EUR, ZALOHA_PROCENT, formatSazba, formatKc } from '../../lib/cap-dotace';
import { SAZBY_SK, ROK_SAZIEB_SK, SADZBY_SK_2026_CIASTOCNE } from '../../lib/sk-cap-dotace';

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

const eur = (n: number) => n.toLocaleString('sk-SK', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const sk: DotaceCapContent = {
    title: `Kalkulačka priamych platieb SPP — sadzby ${ROK_SAZIEB_SK} (BISS, CRISS, ekoschéma, VCS)`,
    metaDescription: `Vypočítajte si priame platby zo Spoločnej poľnohospodárskej politiky 2023–2027 na Slovensku podľa sadzieb PPA za rok ${ROK_SAZIEB_SK}: BISS, redistributívna platba, ekoschéma, mladý poľnohospodár a viazané platby v EUR.`,
    kicker: `Kalkulačka · sadzby ${ROK_SAZIEB_SK}`,
    h1: 'Koľko dostanete na priamych platbách',
    lede: `Orientačný výpočet priamych platieb Spoločnej poľnohospodárskej politiky 2023–2027 na Slovensku podľa sadzieb za rok ${ROK_SAZIEB_SK} — spočíta BISS, redistributívnu platbu (CRISS), ekoschému, platbu pre mladých poľnohospodárov a viazané platby (VCS) na plochu.`,
    crumbHome: 'Domov',
    crumbHub: 'Kalkulačky',
    crumbSelf: 'Priame platby SPP',
    faq: [
      { q: 'Aké platby kalkulačka počíta?', a: 'Sčíta hlavné priame platby SPP 2023–2027 na plochu: základnú podporu príjmu (BISS), redistributívnu platbu (CRISS), celofarmovú ekoschému, platbu pre mladých poľnohospodárov a viazané platby (VCS) na vybrané plodiny. Investičné dotácie, AEKO, ANC, podporu pastevného chovu ani viazané platby na zviera nepočíta.' },
      { q: 'Z ktorého roku sú sadzby?', a: `Z roku ${ROK_SAZIEB_SK} — je to posledný rok, za ktorý PPA zverejnila všetky sadzby (tabuľka „Sadzby priamych platieb pre rok 2025“ z 24. 2. 2026 na apa.sk): BISS ${eur(SAZBY_SK.biss)} €/ha, CRISS ${eur(SAZBY_SK.crissTier1)} €/ha do 100,99 ha a ${eur(SAZBY_SK.crissTier2)} €/ha od 101 ha, ekoschéma ${eur(SAZBY_SK.ekoChvu)} €/ha v chránenom území a ${eur(SAZBY_SK.ekoMimoChvu)} €/ha mimo neho, mladý poľnohospodár ${eur(SAZBY_SK.mlady)} €/ha. Za rok 2026 PPA k 23. 9. 2026 zverejnila zatiaľ len časť sadzieb (napr. BISS ${eur(SADZBY_SK_2026_CIASTOCNE.biss)} €/ha). Výsledok je orientačný.` },
      { q: 'Čo je CRISS a prečo dva stupne?', a: `Redistributívna platba podporuje malé a stredné podniky. Podľa § 7 nariadenia vlády č. 436/2022 Z. z. sa vypláca na prvých 100,99 ha vyššou sadzbou (za rok 2025 ${eur(SAZBY_SK.crissTier1)} €/ha) a od 101 ha do 150,99 ha nižšou (${eur(SAZBY_SK.crissTier2)} €/ha); nad 150,99 ha sa neposkytuje.` },
      { q: 'Ako funguje ekoschéma a čo je chránené územie?', a: `Celofarmová ekoschéma má dve sadzby. Vyššia (za rok 2025 ${eur(SAZBY_SK.ekoChvu)} €/ha) platí pre ornú pôdu v chránenom území — súvislú časť ornej pôdy v diele pôdneho bloku, ktorej aspoň 10 % leží v chránenom vtáčom území alebo v území európskeho významu; ostatná plocha dostane ${eur(SAZBY_SK.ekoMimoChvu)} €/ha.` },
      { q: 'Koľko hektárov sa započíta mladému poľnohospodárovi?', a: `Najviac ${SAZBY_SK.mladyMaxHa} ha (§ 8 ods. 8 nariadenia vlády č. 436/2022 Z. z.), najviac päť rokov a najdlhšie do roku 2027. Žiadateľ má v roku podania žiadosti najviac 40 rokov, zakladá podnik prvýkrát a má odbornú prípravu.` },
      { q: 'Počíta kalkulačka ANC?', a: 'Nie. Podpora pre oblasti s prírodnými obmedzeniami (ANC) sa v SR poskytuje samostatne v rámci rozvoja vidieka, nie ako priama platba — pozrite apa.sk.' },
      { q: 'Je výpočet záväzný?', a: 'Nie. Slúži na orientáciu pri plánovaní. Záväzné sumy stanovuje Pôdohospodárska platobná agentúra (PPA) po kontrole; pri nesplnení podmienok sa platby krátia a pri prekročení národného stropu sa všetky priame platby lineárne znížia.' },
    ],
};

export const content: Record<Locale, DotaceCapContent> = { cs, sk, uk: cs };
