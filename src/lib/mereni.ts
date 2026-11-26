/**
 * Značka pro měření návštěvnosti — vlastní Umami na `analytika.samecdigital.com`.
 *
 * ‼️ Proč vedle Google Analytics: GA4 se tu spouští až po souhlasu v liště
 *   (`CookieConsent.astro`). Návštěvník, který lištu odmítne nebo ignoruje, je
 *   pro GA neviditelný, takže čísla v přehledech jsou zlomek skutečnosti.
 *   Umami nepoužívá cookies ani úložiště prohlížeče a IP adresu neukládá,
 *   souhlas tedy nepotřebuje a měří všechny.
 *
 * ‼️ Tahle značka NESMÍ sahat do cookies ani localStorage. Kdyby začala,
 *   musí se přesunout do `spustMereni()` v liště (hlídá to
 *   `tests/pravni/cookie-lista.test.ts`) a změnit zásady ve všech 5 jazycích.
 *
 * ‼️ Umami zahazuje headless prohlížeče (odpoví `{"beep":"boop"}`), takže se
 *   zápis neověří Playwrightem — jen ručním `POST /api/send` s běžnou
 *   hlavičkou UA. Skutečný zápis poznáš podle odpovědi s `{"cache": "…"}`.
 *
 * ‼️ Do statistik NESMÍ odejít tajemství z adresy (externí audit 26. 11. 2026,
 *   bod 3): `?code=` z OAuth návratu, `?t=` z přihlašovacího odkazu, token
 *   v cestě `/bazar/prevzit/<token>/`. Proto dvě vrstvy: stránky s tajemstvím se
 *   neměří vůbec (`meritCestu`) a u ostatních se query i hash ořežou na straně
 *   prohlížeče, než zpráva odejde (`exclude-search`, `exclude-hash`, `before-send`).
 *
 * Text značky je tady, a ne přímo v layoutu, aby na něj dosáhly testy.
 */

import { stripLocale } from '../i18n/utils';

export const UMAMI_SKRIPT = 'https://analytika.samecdigital.com/script.js';

/** Není tajné — v HTML je stejně vidět a slouží jen k rozlišení webu. */
export const UMAMI_WEB_ID = '326e844c-60cb-4af3-b569-f403efa97a98';

/** Měří se jen na ostré doméně — lokální vývoj a preview do statistik nepatří. */
export const UMAMI_DOMENY = 'agro-svet.cz,www.agro-svet.cz';

/**
 * Název globální funkce, kterou Umami zavolá těsně před odesláním (`data-before-send`).
 *
 * ‼️ Proč: `data-exclude-search` a `data-exclude-hash` ořežou jen adresu stránky.
 *   Referrer předchozí stránky ze stejné domény si query nechává (prohlížeč ho
 *   pošle celý), takže by se do statistik dostal parametr z minulé stránky
 *   (kód, token, e-mail). Tahle funkce odstraní `?…` i `#…` z `url` i `referrer`
 *   u každé zprávy; tajemství v adrese tak nikdy neodejde na sběrač.
 */
export const UMAMI_OCISTI_NAZEV = '__umamiOcisti';

/** Zdroj funkce jako text, aby šel vložit do značky i spustit v testu. */
export const UMAMI_OCISTI_FUNKCE = [
  'function(t,p){',
  '["url","referrer"].forEach(function(k){',
  'var v=p[k];',
  'if(!v)return;',
  'try{',
  'var u=new URL(v,location.href);',
  'u.search="";u.hash="";',
  'p[k]=v.charAt(0)==="/"?u.pathname:u.toString()',
  '}catch(e){p[k]=""}',
  '});',
  'return p}',
].join('');

/** Načítá se až po `load`, ať nesoutěží o pásmo s obsahem stránky. */
export const UMAMI_ZNACKA = [
  'addEventListener("load",function(){',
  `window.${UMAMI_OCISTI_NAZEV}=${UMAMI_OCISTI_FUNKCE};`,
  'var s=document.createElement("script");',
  's.defer=true;',
  `s.src="${UMAMI_SKRIPT}";`,
  `s.dataset.websiteId="${UMAMI_WEB_ID}";`,
  `s.dataset.domains="${UMAMI_DOMENY}";`,
  's.dataset.excludeSearch="true";',
  's.dataset.excludeHash="true";',
  `s.dataset.beforeSend="${UMAMI_OCISTI_NAZEV}";`,
  'document.head.appendChild(s)})',
].join('');

/**
 * Cesty (bez jazykové předpony), kde se neměří vůbec: přihlášení a registrace,
 * návrat z OAuth a přihlašovací odkaz z e-mailu, převzetí inzerátu (token v cestě),
 * účet přihlášeného a admin. Shoda je po celých segmentech, ne po předponě textu.
 *
 * ‼️ Drž v souladu s `PROTECTED_PATHS` / `ADMIN_PATHS` v `middleware.ts`.
 */
export const NEMERENE_CESTY = [
  '/bazar/prihlaseni',
  '/bazar/registrace',
  '/bazar/auth',
  '/bazar/odhlaseni',
  '/bazar/prevzit',
  '/bazar/novy',
  '/bazar/moje',
  '/bazar/profil',
  '/fotosoutez/nahrat',
  '/fotosoutez/moje',
  '/admin',
] as const;

/** True, když se na stránce smí spustit měření (`pathname` i s jazykovou předponou). */
export function meritCestu(pathname: string): boolean {
  const { path } = stripLocale(pathname);
  return !NEMERENE_CESTY.some((p) => path === p || path.startsWith(`${p}/`));
}
