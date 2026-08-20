# Právní stránky (podmínky, GDPR, DSA)

Tři soubory, každý drží **všechny čtyři jazyky** v jedné větvi
`isSk ? … : isPl ? … : isUk ? … : cs`:

| stránka | soubor | sekcí |
|---|---|---|
| Podmínky použití | `src/pages/podminky-pouziti.astro` | 9 |
| Zpracování osobních údajů | `src/pages/zpracovani-osobnich-udaju.astro` | 9 |
| Kontaktní bod DSA | `src/pages/dsa-kontakt.astro` | 7 |

**Struktura musí zůstat napříč jazyky v paritě.** Když přidáš sekci, přidej ji do všech
čtyř větví a přečísluj následující — jinak si verze téhož dokumentu odporují.

Křížové odkazy mezi právními stránkami jdou přes lokální helper `lp()`, ne natvrdo:
polské podmínky musí odkazovat na **polské** znění zásad, ne na české.

## Fakta, na kterých texty stojí

Při jakékoli změně tyhle údaje ověř — jsou roztroušené ve všech jazykových větvích:

- **Provozovatel:** Samec Digital s.r.o., IČO 29547539, Na Břehu 378, 387 11 Katovice.
  Sídlo zůstává české ve všech jazycích — je to fakt, ne lokalizovatelný údaj.
- **Vedoucí dozorový úřad:** ÚOOÚ (usazení v ČR → one-stop-shop, čl. 56 GDPR).
  Polská verze navíc odkazuje na UODO, ať má polský uživatel kam podat stížnost.
- **Zpracovatelé:** Cloudflare (CDN/anti-DDoS), Supabase (DB/auth), Resend (e-mail),
  **Google Ireland Ltd.** (Google Analytics 4).
- **Rozhodné právo:** české, ale s výslovnou výhradou kogentní ochrany spotřebitele
  podle práva jeho bydliště (čl. 6 odst. 2 Řím I) a jeho práva žalovat doma
  (čl. 18 Brusel I bis).
- **ADR:** ČOI (`adr.coi.cz`), SOI (`soi.sk`), pro PL Inspekcja Handlowa a rzecznicy
  konsumentów, rejstřík vede UOKiK.
  > ⚠️ **Neodkazuj na evropskou ODR platformu** — byla k 20. 7. 2025 zrušena.
- **DSA:** provozovatel je mikropodnik → osvobozen od zpráv o transparentnosti
  (čl. 15 odst. 2) i od oddílu 3 (čl. 19 odst. 2). Není online tržiště — nevybírá
  platby a není stranou kupních smluv mezi uživateli.

## Analytika a souhlas — co musí sedět s kódem

`src/components/CookieConsent.astro` načítá **Google Analytics 4** (`G-HC3JY466RR`)
s `anonymize_ip: true`, a to **až po kliknutí na „Přijmout vše"**. Volba se ukládá do
`localStorage['agrosvet-cookie-consent']`.

Z toho plynou tři povinnosti, které texty musí odrážet:

1. **Google patří mezi vyjmenované příjemce** (čl. 13 odst. 1 písm. e) GDPR).
   Dřív tam nebyl — seznam měl jen Cloudflare, Supabase a Resend.
2. **Sekce Cookies musí GA4 pojmenovat.** Věta „nepoužíváme trackovací cookies bez
   souhlasu" je formálně pravdivá, ale neřekne uživateli, co se vlastně měří.
3. **Souhlas musí jít odvolat stejně snadno jako udělit** (čl. 7 odst. 3 GDPR).
   Odkaz „Nastavení cookies" v patičce (`[data-cc-reopen]`) smaže volbu a vrátí banner.
   > ‼️ Při odvolání **uděleného** souhlasu musí následovat reload — `gtag` se
   > v běžící session neodregistruje a bez reloadu by odvolání bylo jen zdánlivé.

**Když sáhneš na měření, sáhni i na zásady.** Nový nástroj = nový příjemce v sekci 5
a zmínka v sekci 9.

## Datum účinnosti

Každá jazyková větev končí `<p class="effective">`. Při **věcné** změně (nový příjemce,
nová sekce, jiný rozsah zpracování) datum posuň — ve všech čtyřech jazycích naráz.
Typografická oprava datum neposouvá.

## 🔴 Co texty NEMAJÍ

Psané jako obsah, **nikdy neprošly kontrolou právníka**. Než se web začne používat
komerčně (placené topování, inzerce), stojí za posudek hlavně:

- formulace vyloučení odpovědnosti vůči spotřebiteli (sekce 2 podmínek) — ta je
  napsaná velmi široce a vůči spotřebiteli nemusí obstát v plném rozsahu
- licence k obsahu inzerátů (sekce 5 podmínek)
- retenční lhůty v zásadách vs. reálné mazání v DB
