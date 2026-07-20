// Centralized site config — single source of truth for site-wide constants.
// Avoids scattered magic strings across pages/components.

export const AGRO_SVET_SITE_ID = 'cadc73fd-6bd9-4dc5-a0da-ea33725762e1';
export const SITE_URL = 'https://agro-svet.cz';

// Topování (placené zvýraznění inzerátu) je dočasně vypnuté — čeká na spuštění
// online platby (Stripe). Zpět zapneš přepnutím na `true`; vstupní CTA, stránka
// /bazar/moje/[id]/topovat i API /api/bazar/featured/request se řídí touto vlajkou.
export const BAZAR_TOPOVANI_ENABLED = false;
