# SK legal stránky (Fáze 2c) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Lokalizovat 4 právní stránky (`podminky-pouziti`, `zpracovani-osobnich-udaju`, `dsa-kontakt`, `redakce`) pro /sk — slovenský text s českým provozovatelem (Samec Digital s.r.o.) jako právním základem + slovenským dozorovým úřadem jako doplňkem, indexovatelné.

**Architecture:** Option A — locale-branched inline JSX. Každá `.astro` → `prerender=false`, tělo obalené `{isSk ? (<sk JSX>) : (<cs JSX VERBATIM>)}`, locale z `Astro.locals.locale`. Launch přes `SK_LAUNCHED_PREFIXES` + navHref fix ve Footer/CookieConsent/Newsletter. cs výstup obsahově nezměněn (ověření živé).

**Tech Stack:** Astro 6 (`output:'server'`, CF Worker), vitest, Node 22.

**Spec:** `docs/superpowers/specs/2026-06-04-agro-svet-i18n-faze2c-legal-sk-design.md`

**Branch:** `feat/i18n-sk-legal` (z `origin/master` `138d233`, worktree `~/agro-svet-i18n-statistiky`).

**Gate (každý task):** `nvm use 22 && npx astro build` (+ `npx vitest run` u gating tasku). agro-svet NEMÁ tsc/astro check.

**⚠️ Cizí WIP NIKDY necommitovat:** `public/og/howto-*.png` (6 untracked). Vždy `git add <konkrétní soubory>`, NIKDY `git add -A`. Po commitu `git show --stat HEAD` ověřit scope.

**Společná pravidla pro překlad stránek (Tasky 1–4):**
- Locale z `Astro.locals.locale ?? 'cs'`; `const isSk = locale === 'sk'`.
- `export const prerender = false` (u `redakce` flip z `true`; u ostatních 3 doplnit explicitně — už SSR jsou, ale kvůli čitelnosti).
- Tělo (`<main>...</main>`) obalit `{isSk ? (<sk verze>) : (<cs verze VERBATIM>)}`. **cs větev = dnešní markup BEZE ZMĚNY** (každý tag, atribut, class, text, `<table>`).
- `<Layout title=... description=...>`: ternár `isSk ? '<sk>' : '<cs verbatim>'`; `canonical={isSk ? undefined : '<cs canonical pokud byl>'}`.
- SK překlad: zachovej PŘESNĚ stejnou strukturu tagů (jen text content přelož). Spisovná slovenština, diakritika.
- Interní odkazy na nelaunchnuté sekce (`/bazar/...`, `/fotosoutez/...`) v sk větvi **ponech na cs path** (nejsou pod /sk).
- `<style>` blok BEZE ZMĚNY.
- Provozovatel (Samec Digital s.r.o., IČO 29547539, Na Břehu 378, 387 11 Katovice), e-maily, IČO — beze změny i v sk (jen okolní text přeložen).

---

## File Structure

**Modifikovat (page tasky):**
- `src/pages/zpracovani-osobnich-udaju.astro` (Task 1 — jurisdikčně kritická)
- `src/pages/podminky-pouziti.astro` (Task 2)
- `src/pages/dsa-kontakt.astro` (Task 3)
- `src/pages/redakce.astro` (Task 4)

**Modifikovat (gating, Task 5):**
- `src/i18n/utils.ts` (SK_LAUNCHED_PREFIXES)
- `src/components/Footer.astro` (bottom-bar navHref)
- `src/components/CookieConsent.astro` (navHref)
- `src/components/Newsletter.astro` (locale + navHref)
- `src/pages/sitemap.xml.ts` (ověřit mirror)

---

## Task 1: `zpracovani-osobnich-udaju` — SK + SK DPA doplněk

**Files:** Modify `src/pages/zpracovani-osobnich-udaju.astro`.

- [ ] **Step 1: Frontmatter → SSR + locale**

Nahraď frontmatter (ř. 1–3) za:
```astro
---
export const prerender = false;
import Layout from '../layouts/Layout.astro';
const locale = Astro.locals.locale ?? 'cs';
const isSk = locale === 'sk';
---
```

- [ ] **Step 2: Layout title/description branch**

```astro
<Layout
  title={isSk ? 'Spracúvanie osobných údajov — Agro-svet' : 'Zpracování osobních údajů — Agro-svět'}
  description={isSk ? 'Zásady spracúvania osobných údajov na agro-svet.cz — kto sme, aké údaje spracúvame, ako dlho, vaše práva.' : 'Zásady zpracování osobních údajů na Agro-svět.cz — kdo jsme, jaké údaje zpracováváme, jak dlouho, vaše práva.'}
>
```

- [ ] **Step 3: Body locale-branch**

Obal celý obsah `<main class="legal-page">` do ternáru. cs větev = dnešní obsah (ř. 9–112) VERBATIM. sk větev = slovenský překlad TÉŽE struktury (h1, lead, sekce 1–9, tabulka, effective). Struktura:
```astro
<main class="legal-page">
  {isSk ? (
    <Fragment>
      {/* ...SK překlad sekcí 1–9 + tabulka + effective... */}
    </Fragment>
  ) : (
    <Fragment>
      {/* ...dnešní cs obsah ř.9–112 VERBATIM... */}
    </Fragment>
  )}
</main>
```

**SK překladové poznámky:**
- h1 „Zásady spracúvania osobných údajov"; lead přelož (GDPR 2016/679 + zákon 110/2019 Sb. zachovat — provozovatel je CZ).
- Sekce 1 Správce → „Prevádzkovateľ": Samec Digital s.r.o., IČO, sídlo, e-mail BEZE ZMĚNY.
- Sekce 2 (newsletter/bazar/fotosúťaž/technické) přelož; 2.4 odkaz `/fotosoutez/gdpr/` ponech (cs path).
- Sekce 3 tabulka: přelož `<th>`/`<td>` texty, GDPR čl. odkazy zachovej.
- Sekce 4–7, 9 přelož.
- **Sekce 8 „Sťažnosť u dozorného úradu" — KLÍČOVÁ:** zachovej ÚOOÚ jako vedoucí úřad + PŘIDEJ SK DPA. Tvar:
```astro
<h2>8. Sťažnosť u dozorného úradu</h2>
<p>
  Ak sa domnievate, že spracúvaním vašich osobných údajov porušujeme GDPR, môžete podať sťažnosť.
  Keďže prevádzkovateľ je usadený v Českej republike, vedúcim dozorným úradom je
  <strong>Úřad pro ochranu osobních údajů (ČR)</strong>, Pplk. Sochora 27, 170 00 Praha 7,
  <a href="https://www.uoou.cz" rel="noopener">www.uoou.cz</a>.
  Ako používateľ zo Slovenska sa môžete obrátiť aj na
  <strong>Úrad na ochranu osobných údajov Slovenskej republiky</strong>, Hraničná 4826/12,
  820 07 Bratislava 27, <a href="https://dataprotection.gov.sk" rel="noopener">dataprotection.gov.sk</a>.
</p>
```
- effective: „<strong>Účinnosť:</strong> 13. mája 2026".

- [ ] **Step 4: Build + dev smoke**

```bash
nvm use 22 && npx astro build
```
Build passes. (sk verifikace živě po Tasku 5 launchi — `/sk/...` je do launche 307. Volitelně dočasně přidat prefix do SK_LAUNCHED_PREFIXES, ověřit, vrátit — ale to dělá Task 5; zde stačí build + cs nezměněno.)

cs smoke:
```bash
nvm use 22 && (npx astro dev &) ; sleep 8
curl -s localhost:4321/zpracovani-osobnich-udaju/ | grep -oE 'lang="cs"|Úřadu pro ochranu|Správce osobních' | sort -u
pkill -f 'astro dev' || true
```
Expect: `lang="cs"` + dnešní cs text přítomný.

- [ ] **Step 5: Commit**
```bash
git add src/pages/zpracovani-osobnich-udaju.astro
git commit -m "feat(legal-sk): zpracovani-osobnich-udaju SK + SK DPA doplněk (SSR)"
```

---

## Task 2: `podminky-pouziti` — SK překlad

**Files:** Modify `src/pages/podminky-pouziti.astro`.

- [ ] **Step 1: Frontmatter → SSR + locale** (stejný blok jako Task 1 Step 1).

- [ ] **Step 2: Layout title/description**
```astro
<Layout
  title={isSk ? 'Podmienky používania — Agro-svet' : 'Podmínky použití — Agro-svět'}
  description={isSk ? 'Podmienky používania webu agro-svet.cz — orientačný charakter informácií, vylúčenie zodpovednosti, autorské práva, kontakt.' : 'Podmínky použití webu agro-svet.cz — orientační charakter informací, vyloučení odpovědnosti, autorská práva, kontakt.'}
>
```

- [ ] **Step 3: Body locale-branch** — obal `<main class="legal-page">` obsah (ř. 9–187) do `{isSk ? (<Fragment>…sk…</Fragment>) : (<Fragment>…cs VERBATIM…</Fragment>)}`.

**SK překladové poznámky:**
- h1 „Podmienky používania"; lead: provozovatel Samec Digital s.r.o. + IČO + sídlo zachovat, „(ďalej len „prevádzkovateľ")".
- Sekce 1–8 přelož, zachovej strukturu (h2/h3, ul/li). Bazar sekce (3, 3.1–3.4) PŘELOŽ celé (obecné podmínky); interní odkazy `/bazar/pravidla/`, `/bazar/nahlasit/` ponech (cs path — bazar není pod /sk).
- Sekce 6 odkaz `/zpracovani-osobnich-udaju/` — ponech path (navHref se v textu neřeší; je to inline; ponechej cs path, middleware servíruje cs nebo lze ručně `/sk/...`. **Volba: ponechej `/zpracovani-osobnich-udaju/`** — konzistentní s cs, middleware z /sk kontextu nepřepíše inline href; akceptováno jako drobnost).
- Zmínky SZIF/ÚKZÚZ/Ministerstva zemědělství (sekce 2) — to jsou CZ autority kompetentní pro CZ provozovatele; v sk překladu je ZACHOVEJ (GEO pravidlo — neměnit na SK úřady, jde o ověřování u oficiálních zdrojů obecně; přelož okolní text, názvy CZ úřadů ponech). Zákon č. 326/2004 Sb., 119/2002 Sb. (sekce 3.2) zachovej (CZ právo provozovatele).
- effective: „<strong>Účinnosť:</strong> 28. mája 2026".

- [ ] **Step 4: Build + cs smoke**
```bash
nvm use 22 && npx astro build
(npx astro dev &) ; sleep 8
curl -s localhost:4321/podminky-pouziti/ | grep -oE 'lang="cs"|Vyloučení odpovědnosti|provozovaného společností' | sort -u
pkill -f 'astro dev' || true
```
Expect cs text přítomný.

- [ ] **Step 5: Commit**
```bash
git add src/pages/podminky-pouziti.astro
git commit -m "feat(legal-sk): podminky-pouziti SK (SSR)"
```

---

## Task 3: `dsa-kontakt` — SK překlad

**Files:** Modify `src/pages/dsa-kontakt.astro`.

- [ ] **Step 1: Frontmatter → SSR + locale** (stejný blok).

- [ ] **Step 2: Layout title/description**
```astro
<Layout
  title={isSk ? 'DSA kontaktné miesto — Agro-svet' : 'DSA kontaktní bod — Agro-svět'}
  description={isSk ? 'Jednotné kontaktné miesto podľa nariadenia (EÚ) 2022/2065 (Digital Services Act, čl. 11 a 12) — pre orgány a používateľov.' : 'Jednotný kontaktní bod podle nařízení (EU) 2022/2065 (Digital Services Act, čl. 11 a 12) — pro orgány a uživatele.'}
>
```

- [ ] **Step 3: Body locale-branch** — obal `<main class="legal-page">` obsah (ř. 9–105) do ternáru.

**SK překladové poznámky:**
- DSA je EU-wide → přelož vše do slovenštiny. h1 „DSA kontaktné miesto".
- Sekce 1 provozovatel: Samec Digital s.r.o., sídlo „…Katovice, Česká republika" zachovat.
- Sekce 2/3 kontakt: e-mail/jazyk přelož. Odkazy `/bazar/nahlasit/`, `/zpracovani-osobnich-udaju/`, `/podminky-pouziti/`, `/bazar/pravidla/` ponech (cs path).
- Sekce 4–7 přelož (DSA čl. odkazy, kategorie mikropodnik, atd. zachovej čísla/odkazy).
- effective: „<strong>Účinnosť:</strong> 28. mája 2026".

- [ ] **Step 4: Build + cs smoke**
```bash
nvm use 22 && npx astro build
(npx astro dev &) ; sleep 8
curl -s localhost:4321/dsa-kontakt/ | grep -oE 'lang="cs"|kontaktní bod|Provozovatel hostingové' | sort -u
pkill -f 'astro dev' || true
```

- [ ] **Step 5: Commit**
```bash
git add src/pages/dsa-kontakt.astro
git commit -m "feat(legal-sk): dsa-kontakt SK (SSR)"
```

---

## Task 4: `redakce` — SK překlad (prerender flip + JSON-LD)

**Files:** Modify `src/pages/redakce.astro`.

- [ ] **Step 1: Frontmatter → SSR + locale + lokalizace JSON-LD**

Změň `export const prerender = true;` na `false` a přidej locale. Uprav breadcrumb + canonical base-aware. Nahraď frontmatter (ř. 1–49) za:
```astro
---
export const prerender = false;
import Layout from '../layouts/Layout.astro';
import { SITE_URL } from '../lib/config';
import { breadcrumbSchema } from '../lib/structured-data';

const locale = Astro.locals.locale ?? 'cs';
const isSk = locale === 'sk';
const base = isSk ? '/sk' : '';

const breadcrumbJsonLd = breadcrumbSchema([
  { name: isSk ? 'Domov' : 'Domů', url: `${base}/` },
  { name: isSk ? 'Redakcia' : 'Redakce', url: `${base}/redakce/` },
]);

const orgJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'NewsMediaOrganization',
  name: isSk ? 'Redakcia agro-svet.cz' : 'Redakce agro-svět.cz',
  url: `${SITE_URL}${base}/redakce/`,
  logo: { '@type': 'ImageObject', url: `${SITE_URL}/icon-512.png`, width: 512, height: 512 },
  parentOrganization: {
    '@type': 'Organization',
    name: 'Samec Digital s.r.o.',
    legalName: 'Samec Digital s.r.o.',
    identifier: { '@type': 'PropertyValue', propertyID: 'IČO', value: '29547539' },
    address: { '@type': 'PostalAddress', streetAddress: 'Na Břehu 378', postalCode: '387 11', addressLocality: 'Katovice', addressCountry: 'CZ' },
  },
  diversityPolicy: `${SITE_URL}${base}/redakce/`,
  ethicsPolicy: `${SITE_URL}${base}/redakce/`,
  contactPoint: { '@type': 'ContactPoint', contactType: 'editorial', email: 'info@samecdigital.com', availableLanguage: isSk ? 'Slovak' : 'Czech' },
};
---
```

- [ ] **Step 2: Layout title/description/canonical**
```astro
<Layout
  title={isSk ? 'Redakcia agro-svet.cz' : 'Redakce agro-svět.cz'}
  description={isSk ? 'Redakcia poľnohospodárskeho portálu agro-svet.cz — kto stojí za obsahom, redakčné zásady a kontakt.' : 'Redakce zemědělského portálu agro-svět.cz — kdo stojí za obsahem, redakční zásady a kontakt.'}
  canonical={isSk ? undefined : `${SITE_URL}/redakce/`}
>
```

- [ ] **Step 3: Body locale-branch** — obal obsah `<main class="redakce">` (breadcrumb nav + hero + 3 bloky, ř. 60–105) do ternáru. cs větev VERBATIM. sk větev:
  - breadcrumb: href `/` → `${base}/`, „Domů"→„Domov", „Redakce"→„Redakcia".
  - hero kicker „O nás"→„O nás", h1 „Redakcia agro-svet.cz", lead přelož.
  - bloky „Co děláme"→„Čo robíme", „Redakční zásady"→„Redakčné zásady" (ul přelož), „Kontakt" (přelož; provozovatel zachovat).

- [ ] **Step 4: Build + cs smoke**
```bash
nvm use 22 && npx astro build
(npx astro dev &) ; sleep 8
curl -s localhost:4321/redakce/ | grep -oE 'lang="cs"|Redakční zásady|Co děláme' | sort -u
pkill -f 'astro dev' || true
```

- [ ] **Step 5: Commit**
```bash
git add src/pages/redakce.astro
git commit -m "feat(legal-sk): redakce SK (SSR + lokalizovaný JSON-LD)"
```

---

## Task 5: Launch — SK_LAUNCHED_PREFIXES + navHref odkazy

**Files:** Modify `src/i18n/utils.ts`, `src/components/Footer.astro`, `src/components/CookieConsent.astro`, `src/components/Newsletter.astro`, ověřit `src/pages/sitemap.xml.ts`.

- [ ] **Step 1: `utils.ts` — přidat 4 legal prefixy**

V `SK_LAUNCHED_PREFIXES` přidej 4 cesty:
```ts
export const SK_LAUNCHED_PREFIXES = ['/stroje', '/znacky', '/srovnani', '/novinky', '/kalkulacka', '/dotace', '/statistiky', '/puda', '/podminky-pouziti', '/zpracovani-osobnich-udaju', '/dsa-kontakt', '/redakce'];
```

- [ ] **Step 2: `Footer.astro` — bottom-bar navHref**

V bottom-bar (ř. ~41–50) obal legal hrefs `navHref(locale, ...)`. `navHref` + `locale` už importované/definované. Změň:
```astro
<a href={navHref(locale, '/redakce/')}>{tr('footer.editorial')}</a>
...
<a href={navHref(locale, '/podminky-pouziti/')}>{tr('footer.terms')}</a>
...
<a href={navHref(locale, '/dsa-kontakt/')}>{tr('footer.dsa')}</a>
```
(`/hledat/` a `/fotosoutez/gdpr/` můžeš taky obalit `navHref` — vrátí je beze změny, nejsou launchnuté; volitelné. mailto nech.)

- [ ] **Step 3: `CookieConsent.astro` — navHref**

Přidej `navHref` do importu (ř. ~ kde je `useTranslations`): `import { getLocaleFromUrl, useTranslations, navHref } from '../i18n/utils';` (ověř existující import řádek a doplň navHref). Pak (ř. 11):
```astro
<a href={navHref(locale, '/zpracovani-osobnich-udaju/')}>{tr('cc.more')}</a>
```

- [ ] **Step 4: `Newsletter.astro` — locale + navHref**

Newsletter nemá locale/navHref. Do frontmatteru přidej (dle vzoru Footer):
```astro
import { useTranslations, navHref, getLocaleFromUrl } from '../i18n/utils';
const locale = Astro.locals.locale ?? getLocaleFromUrl(Astro.url);
```
(Pokud už `useTranslations`/`getLocaleFromUrl` importuje, jen doplň `navHref` a `locale`. Ověř existující frontmatter.) Pak (ř. ~29):
```astro
<a href={navHref(locale, '/zpracovani-osobnich-udaju/')}>zpracováním osobních údajů</a>
```
> POZOR: text „zpracováním osobních údajů" je cs. Pokud je Newsletter zobrazen i na /sk, měl by být i text sk. Ověř, zda Newsletter má locale-aware text (`tr(...)`); pokud je hardcoded cs a zobrazuje se na /sk, je to pre-existující širší problém MIMO rozsah 2c — zde JEN oprav href přes navHref (odkaz povede na /sk/zpracovani... správně). Text neřeš (mimo scope).

- [ ] **Step 5: `sitemap.xml.ts` — ověřit mirror 4 legal URL**

```bash
grep -nE 'podminky|zpracovani|dsa-kontakt|redakce|skMirror|SK_LAUNCHED|staticPaths|legal' src/pages/sitemap.xml.ts | head
```
Zjisti, zda sitemap legal root stránky vůbec zahrnuje do cs části (z čeho `skMirror` čerpá). Pokud cs `/podminky-pouziti/` atd. v sitemap JSOU a skMirror iteruje launchnuté → `/sk/...` se přidá automaticky (po Step 1). Pokud legal stránky v sitemap NEJSOU vůbec (ani cs), je to pre-existující stav — pak SK mirror taky nebude; v tom případě přidej 4 cs legal URL + jejich sk zrcadla do sitemap dle existujícího vzoru (nebo ponech a zaznamenej jako known-gap, pokud jsou legal záměrně mimo sitemap). **Rozhodni dle toho, co v souboru najdeš; minimální zásah.**

- [ ] **Step 6: Gate — vitest + build + ověř launch**

```bash
nvm use 22 && npx vitest run && npx astro build
```
Vše zelené. Ověř launch lokálně:
```bash
(npx astro dev &) ; sleep 8
echo "sk podminky:"; curl -s localhost:4321/sk/podminky-pouziti/ | grep -oE 'lang="sk"|Podmienky|index, follow' | sort -u
echo "sk gdpr DPA:"; curl -s localhost:4321/sk/zpracovani-osobnich-udaju/ | grep -oE 'dataprotection.gov.sk|Úrad na ochranu' | sort -u
echo "cs unchanged:"; curl -s localhost:4321/podminky-pouziti/ | grep -oE 'lang="cs"|Vyloučení odpovědnosti'
pkill -f 'astro dev' || true
```
Expect: sk stránky `lang="sk"` + `index, follow` + SK text; sk gdpr má SK DPA; cs nezměněno.

- [ ] **Step 7: Commit**
```bash
git add src/i18n/utils.ts src/components/Footer.astro src/components/CookieConsent.astro src/components/Newsletter.astro
# + sitemap.xml.ts pokud editováno:
# git add src/pages/sitemap.xml.ts
git commit -m "feat(legal-sk): launch /sk legal (SK_LAUNCHED + navHref odkazy)"
```

---

## Task 6: QA sweep + plný gate

**Files:** žádné nové (verifikace; případné opravy do příslušných tasků).

- [ ] **Step 1: CZ-kontaminace v sk větvích — case-insensitive**

```bash
for f in zpracovani-osobnich-udaju podminky-pouziti dsa-kontakt redakce; do
  echo "== $f =="
  # vytáhni sk větve a hledej CZ-only ř/ě/ů + slova bez diakritiky
  grep -nE 'aktuální|největší|důležit|spole[čc]nost|zpracování|používá|přesnost|odpovědnost' src/pages/$f.astro | grep -viE "isSk \? '|: '" | head
done
echo "Ruční kontrola: otevři sk větve a ověř, že NEobsahují české ř/ě/ů (kromě CZ proper nouns: ÚOOÚ/Úřad pro ochranu, Na Břehu, Katovice, Samec Digital, Sb., zákony)."
```
SK právní text legitimně obsahuje CZ proper nouns (názvy CZ úřadů, zákonů, adresa provozovatele) — ty jsou OK. Hledáš CZ kontaminaci v běžné próze. Pokud najdeš → oprav v příslušné stránce, recommit.

- [ ] **Step 2: Plný gate**
```bash
nvm use 22 && npx vitest run && npx astro build
```
Expect: vše PASS, build OK.

- [ ] **Step 3: Worker bundle size**
```bash
npx wrangler deploy --dry-run 2>&1 | grep -iE 'Total Upload|gzip' || true
```
Expect: gzip pod 3072 KiB (legal = text, zanedbatelný přírůstek).

- [ ] **Step 4: Commit (jen pokud QA vynutil opravy)**

---

## Task 7: Deploy (USER-GATED) + live smoke + PR

> **⚠️ Deploy na ŽIVOU produkci — vyžádej explicitní svolení uživatele PŘED `npm run deploy`.** Hlídat souběžný deployer.

- [ ] **Step 1: Vyžádat svolení k deployi.**

- [ ] **Step 2: Deploy**
```bash
nvm use 22 && cd ~/agro-svet-i18n-statistiky && npm run build && npm run deploy
```

- [ ] **Step 3: Ověřit aktivní deploy**
```bash
npx wrangler deployments list 2>&1 | head -8
```
Nahoře MŮJ Version. Pokud přepsáno souběžným deployerem → redeploy.

- [ ] **Step 4: Live smoke**
```bash
for u in /podminky-pouziti/ /zpracovani-osobnich-udaju/ /dsa-kontakt/ /redakce/ \
         /sk/podminky-pouziti/ /sk/zpracovani-osobnich-udaju/ /sk/dsa-kontakt/ /sk/redakce/; do
  printf "%-40s " "$u"; curl -s -o /dev/null -w '%{http_code}\n' "https://agro-svet.cz$u"
done
echo "== sk indexovatelnost + DPA =="
curl -s https://agro-svet.cz/sk/zpracovani-osobnich-udaju/ | grep -oE 'lang="sk"|index, follow|dataprotection.gov.sk|Úrad na ochranu' | sort -u
echo "== sk self-canonical + hreflang =="
curl -s https://agro-svet.cz/sk/podminky-pouziti/ | grep -oE 'rel="canonical" href="[^"]*"|hreflang="sk"'
echo "== cs nezměněno =="
curl -s https://agro-svet.cz/zpracovani-osobnich-udaju/ | grep -oE 'lang="cs"|Úřadu pro ochranu|hreflang="sk"' | sort -u
echo "== sitemap =="
curl -s https://agro-svet.cz/sitemap.xml | grep -oE '/sk/(podminky-pouziti|zpracovani-osobnich-udaju|dsa-kontakt|redakce)[^<]*' | sort -u
```
Expect: všechny 200; sk gdpr má `index, follow` + SK DPA + ÚOOÚ; sk self-canonical `/sk/...` + hreflang; cs nezměněno (ÚOOÚ, lang=cs) + reciproční sk hreflang; sitemap má 4 sk legal (pokud Task 5 Step 5 je zařadil).

- [ ] **Step 5: PR (squash do master)**
```bash
git push -u origin feat/i18n-sk-legal
gh pr create --base master --title "feat(i18n): SK legal stránky — Fáze 2c (podmínky/GDPR/DSA/redakce)" --body "$(cat <<'EOF'
## Souhrn
Fáze 2c — lokalizace 4 právních stránek pro /sk.

- **Stránky:** podminky-pouziti, zpracovani-osobnich-udaju, dsa-kontakt, redakce → SSR (`prerender=false`), locale-branched inline JSX (`isSk ? sk : cs VERBATIM`).
- **Jurisdikce:** CZ provozovatel Samec Digital s.r.o. (IČO 29547539) jako právní základ (GDPR + 110/2019, ÚOOÚ vedoucí dle one-stop-shop) + **doplněk SK DPA** (Úrad na ochranu osobných údajov SR) u GDPR stránky.
- **Launch:** `SK_LAUNCHED_PREFIXES += 4` (index,follow + hreflang + sitemap); Footer bottom-bar + CookieConsent + Newsletter legal odkazy přes `navHref` (z /sk vedou na /sk).
- cs výstup obsahově nezměněn (ověřeno živě). Nasazeno přes `npm run deploy`.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

- [ ] **Step 6: Merge po svolení** `gh pr merge <N> --squash --admin`.

---

## Self-Review (autor plánu)

- **Spec coverage:** 4 page tasky (T1–4) + launch (T5) + QA (T6) + deploy/PR (T7). ✅ Všechny 4 stránky + jurisdikční doplněk (T1 sekce 8) + footer/cookie/newsletter navHref (T5) + indexace (T5). ✅
- **Jurisdikce:** CZ základ zachován, SK DPA jako doplněk (ne přepis), GEO pravidlo u CZ úřadů/zákonů v podminky. ✅
- **cs byte-identita:** všechny cs větve = `isSk ? sk : cs VERBATIM`; redakce JSON-LD cs hodnoty zachovány (base='' → identické URL). ✅
- **Lekce:** gate astro build+vitest Node22, cizí 6 OG PNG necommitovat, branch z origin/master, souběžný deployer, QA case-insensitive vč. CZ proper nouns výjimky. ✅
- **Konzistence:** `prerender=false` všude (redakce flip); navHref jen prefixuje launchnuté → bazar/fotosoutez odkazy zůstanou cs (správně). ✅
