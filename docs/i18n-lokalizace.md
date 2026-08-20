# Lokalizace (cs / sk / pl / uk)

Čeština je kanonická a běží **bez prefixu**. Ostatní jazyky žijí pod `/sk`, `/pl`, `/uk`.
Middleware si z prefixu odvodí `Astro.locals.locale`, přepíše cestu na cs kanonickou
a stránka se pak renderuje jednou a týmž kódem — lokalizuje se až obsah.

```
/pl/stroje/fendt/  →  locals.locale = 'pl'  →  render src/pages/stroje/[brand]/index.astro
```

## Dvě věci, které se dají zapomenout odděleně

Stránka může být **celá polsky** a přesto posílat návštěvníka zpátky do češtiny.
Text a odkazy jsou nezávislé vrstvy a auditují se zvlášť:

| vrstva | čím se hlídá |
|---|---|
| text | `node scripts/audit-locale.mjs pl --sitemap` |
| odkazy | `node scripts/audit-links.mjs pl <url…>` |

## `LAUNCHED_PREFIXES` — jediný zdroj pravdy

`src/i18n/utils.ts` drží pro každý jazyk seznam sekcí, které jsou v něm **hotové**.
Na tom seznamu visí tři věci najednou:

1. **noindex** — nelaunchnutá sekce pod cizím prefixem se neindexuje (`Layout.astro`)
2. **sitemapa** — do `sitemap.xml` jde jen launchnuté
3. **prefixování odkazů** — `localizeInternalHref` → `isLaunchedPath`

> **Nikdy nezaváděj vlastní „co je hotové" flag.** V auto-linkeru byl
> `GlossaryEntry.localizable`, nastavený jen u značek a modelů. Byl to snapshot
> stavu z doby, kdy vznikl — a když později launchly slovník, plemena a žebříčky,
> odkazy na ně zůstávaly české. Odvozuj vždy z `LAUNCHED_PREFIXES`.

## ‼️ `localizePath` vs. `localizeInternalHref`

```ts
localizePath('pl', '/bazar/novy/')          // → '/pl/bazar/novy/'   prefixuje NASLEPO
localizeInternalHref('pl', '/bazar/novy/')  // → '/bazar/novy/'      /bazar není launchnutý
localizeInternalHref('pl', '/slovnik/')     // → '/pl/slovnik/'      /slovnik je launchnutý
```

**V šablonách používej `localizeInternalHref`.** `localizePath` patří jen tam, kde
adresu skládáš pro locale, o kterém víš, že sekci má (canonical, JSON-LD, breadcrumb
vlastní stránky).

Odkaz na sekci, která v daném jazyce **neexistuje** (`/akce`, `/jak-na-to`,
`/kalkulacka/*`, `/bazar`), nech **záměrně bez prefixu**. Poctivý odkaz do češtiny je
lepší než česká stránka pod polskou adresou. Ne každý cs odkaz z PL stránky je chyba.

## Vzory, které opakovaně vyrábějí úniky

**Binárka `locale === 'sk' ? … : česky`.** Do české větve pak spadne pl i uk.
Podmínku vždy stav na `cs`, ne na jednu z cizích mutací:

```ts
locale === 'cs' ? českyLiterál : t(locale, 'klíč')   // ✅
isSk ? přeloženo : českyLiterál                       // ❌ pl a uk dostanou češtinu
```

**Vnořený ternář na `base`.** `locale === 'uk' ? '/uk' : locale === 'sk' ? '/sk' : ''`
zapomněl na pl → `/pl/slovnik/` linkoval všech ~200 hesel na české detaily.
Používej `localizePath(locale, '/')`, pokrývá i jazyky, které přibudou.

**`getCollection('<cs>')` natvrdo.** Overlay kolekce existuje, ale stránka ji nečte —
`/pl/znacky/` servírovalo 22 českých popisů, přestože `znacky-pl` má plnou paritu.
Piš explicitní mapu, ne vnořené ternáře:

```ts
const ZNACKY_COLLECTION = { cs: 'znacky', sk: 'znackySk', pl: 'znackyPl', uk: 'znackyUk' } as const;
```

**Komponenta v `Layout.astro` bez locale.** Lightbox měl `aria-label` natvrdo česky,
takže tekl na **každé stránce webu** ve všech jazycích.

## Data z YAML: tokeny, ne překlad

Katalog strojů drží česká data v polích, která overlay nepokrývá (`engine`,
`youtube_title`). Distinktních hodnot je málo a jsou formulkové:
`„Deutz F3L 912, 3-válec vzduchem chlazený 2,8 L"`. Typová označení (F3L 912,
PowerTech, Stage V, turbo, intercooler) jsou **mezinárodní a překládat se nesmí** —
česká je jen hrstka slov okolo. Řeší to `src/lib/stroje-data-i18n.ts` slovníkem tokenů.

Test `tests/lib/stroje-data-i18n.test.ts` projde všechny YAML a **spadne, jakmile
se objeví česká hodnota, kterou slovník neumí přeložit**. Právě on odhalil titulek
videa, který jsem při ručním výčtu přehlédl.

## Detekce zbytkové češtiny

Čeština má znaky, které cílový jazyk nemá. **Sada musí být per-jazyk:**

| locale | markery |
|---|---|
| `sk` | `ě ř ů` |
| `pl` | `ě ř ů č š ž ď ť ň á é í ú ý` |
| `uk` | totéž co pl (latinka vůbec) |

- **Polská sada je delší, než se zdá** — polština nemá ani `á é í ú ý`. S kratší sadou
  projde „místní produkce" i „Časté dotazy" a audit vyhlásí falešné čisto.
- **Polskou sadu nepouštěj na slovenštinu** — `č š ž ť` slovenština má.
- **Čeština bez diakritiky projde** („dosud", „zpet", „vsechny"). Na to je v
  `audit-locale.mjs` slovník `NO_DIACRITICS`; do něj jen tokeny, které nejsou zároveň
  platným polským slovem (`cena`, `jako`, `domu` byly falešné poplachy).
- **Počítej s vlastními jmény.** Odrůdy a šlechtitelé z ÚKZÚZ, francouzská plemena
  (Montbéliarde, Comté) a ceny v Kč s výslovnou disclosure jsou legitimní.

## ‼️ Auditovat i celistvost HTML

Nedeklarovaný identifikátor v `.astro` šabloně **neshodí build**. Spadne až při renderu
requestu a protože se odpověď streamuje, výjimka **utne HTML uprostřed dokumentu** —
bez patičky, bez `</html>`. Prohlížeč to vykreslí a grep na obsah stránku prohlásí
za v pořádku. Takhle nám ~den běžely obě homepage useknuté.

Hlídá to `audit-locale.mjs` (řádek `TRUNC`) a v testech
`tests/i18n/astro-translator-calls.test.ts`, který projde všechny `.astro` a ověří,
že použitý i18n helper je v souboru zavedený a klíč existuje aspoň v jedné `ui/*.ts`.

> Guard musí sledovat **celý seznam helperů**, ne jen „co vypadá jako překladač".
> První verze hlídala `t/tr/tt/tf` a minula `localizeInternalHref` bez importu.

Před `import { t }` zkontroluj, jestli `t` v souboru už něco neznamená
(`grep -n "^const t" soubor`) — jinak alias `t as tUi`.

## Přidání jazyka / launch sekce

1. Doplnit `src/i18n/ui/<locale>.ts` — parita klíčů je hlídaná testem
2. Overlay data (`src/data/**/<locale>/`, `src/content/*-<locale>/`) + kolekce v `content.config.ts`
3. Přidat prefix do `LAUNCHED_PREFIXES[locale]` — tím se rozsvítí index, sitemapa i odkazy
4. `npm test && npm run build`
5. `node scripts/audit-locale.mjs <locale> --sitemap` a `node scripts/audit-links.mjs <locale> …`
6. Deploy → **ověřit na produkci, ne na localhostu**

## Split-brain databáze

Lokální `.env` míří na cloudový dev Supabase, produkce na self-hosted. Překlady článků
se proto lokálně a na produkci **legitimně liší** — článek, který lokálně 404, může
být na produu živý. Neopravuj to jako bug; obsah ověřuj na produkci.
