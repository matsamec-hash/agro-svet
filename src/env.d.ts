/// <reference types="astro/client" />

declare namespace App {
  interface Locals {
    user: import('@supabase/supabase-js').User | null;
    /** Locale odvozený z URL prefixu middlewarem (cs = bez prefixu). */
    locale?: import('./i18n/config').Locale;
    /** Původní (locale-prefixovaná) cesta před rewritem; pro canonical/SEO. */
    localizedPathname?: string;
  }
}
