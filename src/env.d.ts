/// <reference types="astro/client" />

declare namespace App {
  interface Locals {
    user: import('@supabase/supabase-js').User | null;
    /** Locale odvozený z URL prefixu middlewarem (cs = bez prefixu). */
    locale?: import('./i18n/config').Locale;
    /** Původní (locale-prefixovaná) cesta před rewritem; pro canonical/SEO. */
    localizedPathname?: string;
    /** Jazyky, ve kterých obsah TÉTO stránky reálně existuje (detail s překladem
     *  po položkách — článek, návod, dotační titul). Stránka ho nastaví ve
     *  frontmatteru; Layout podle něj omezí hreflang a přepínač jazyka pošle
     *  chybějící jazyk na hub sekce místo na 404. Nenastaveno = rozhoduje jen
     *  launch sekce (isLaunchedPath). */
    availableLocales?: readonly import('./i18n/config').Locale[];
  }
}
