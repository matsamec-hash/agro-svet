# Kalendář zemědělských akcí — zadání (spec)

**Datum:** 2026-06-05
**Projekt:** agro-svet.cz
**Stav:** schválený design, čeká na implementační plán

## Cíl

Kalendář zemědělských akcí na agro-svet.cz — od velkých celostátních akcí
(Země živitelka, agrosalony) přes regionální polní dny a kurzy až po
hyperlokální dlouhý ocas typu „prodej kachen v Teplýšovicích" a farmářské trhy.
Hlavní strategický směr je **long-tail SEO**: tisíce indexovatelných stránek,
které velké weby nepokryjí, ale jen těch s reálným obsahem.

## Rozsah akcí

Celé spektrum, sedm typů:
- `farmarske-trhy`
- `polni-dny`
- `prodej-ze-dvora`
- `vystavy-veletrhy`
- `kurzy-skoleni`
- `chovatelske-prehlidky`
- `dny-otevrenych-dveri`

## Zdroje dat (4 vrstvy, dodané ve 2 vlnách)

**Vlna 1 — kostra:**
1. **Uživatelské příspěvky** (jádro) — formulář `/akce/pridat/`, navazuje na
   user/auth model bazaru. Pokrývá hyperlokál, který jinde není.
2. **Ruční kurátorský seed** — dataset velkých akcí 2026 jako SQL seed
   (`zdroj='kurator'`, rovnou `stav='zverejneno'`), aby web nebyl prázdný od
   spuštění (důvěra + SEO).

**Vlna 2 — automatizace (samostatná fáze, až kostra žije):**
3. **Strukturované feedy** — scheduled skript `scripts/fetch-akce-feeds.mjs`
   (vzor `fetch-*.mjs`), čte **jen** ICS / RSS / JSON-LD `Event` z whitelistu
   webů pořadatelů. **Žádný scraping cizího HTML.** Dedup přes `feed_uid`.
4. **AI parsování textu** — pomocník u formuláře přes **Cloudflare Workers AI**:
   uživatel vloží volný text („prodej kachen, Teplýšovice, každou sobotu 8–12") →
   LLM předvyplní strukturovaná pole, uživatel potvrdí. Enhancement, ne
   závislost — formulář funguje i bez něj (tichý fallback na ruční vyplnění).

## Datový model

Nová tabulka `akce` v Supabase (vedle `bazar_*`), plus pomocná pro feedy.

**Identita & obsah**
- `id`, `slug` (globálně unikátní → `/akce/[slug]/`)
- `nazev`, `popis` (volný text)
- `typ` (enum, viz Rozsah akcí výše)

**Termín — strukturované opakování (NE plné iCal RRULE)**
- `druh`: `jednorazova` | `opakovana`
- jednorázová → `zacatek`, `konec` (datum+čas)
- opakovaná → `frekvence` (`tydne`), `dny_v_tydnu` (pole, např. `[6]` = sobota),
  `cas_od`, `cas_do`, `plati_od`, `plati_do`
- `pristi_vyskyt` (počítaný/přepočítávaný sloupec) — pro řazení a filtr
  „co je tento týden/víkend"

Zdůvodnění: pokryje „každou sobotu 8–12" i „úterý a pátek" a je testovatelné.
Velké veletrhy jsou stejně jednorázové (1× ročně). RRULE = zbytečná složitost.

**Místo** (znovupoužití geo vzoru z bazaru)
- `misto_nazev`, `adresa`, `obec`, `okres`, `kraj`, `lat`, `lng`
- `okres` a `obec` nesou lokální SEO osy

**Pořadatel & původ**
- `poradatel`, `web`, `email`, `telefon`
- `zdroj`: `uzivatel` | `kurator` | `feed`
- `feed_id`, `feed_uid` (dedup u feedů)

**Stav & monetizace**
- `stav`: `ceka` | `zverejneno` | `zamitnuto` | `probehla`
- `zvyrazneno` + `zvyrazneno_do` (sloupce připravené na topování, zatím nevyužité)
- `created_at`, `updated_at`, `zverejneno_at`, OG obrázek

## Stránky a SEO struktura

Vše SSR (jako zbytek webu), prerender kde to jde.

**Detail & rozcestník**
- `/akce/` — rozcestník: nadcházející akce (řazené dle `pristi_vyskyt`), mapa
  (maplibre, vzor bazaru), filtry (typ, okres, datum)
- `/akce/[slug]/` — detail: termín(y), místo + mapa, pořadatel, popis,
  JSON-LD `Event`, OG (satori), prolink na související akce

**Programatické SEO osy** (každá = indexovatelná sada)
- `/akce/okres/[okres]/` — „Zemědělské akce v okrese Benešov" (76 okresů)
- `/akce/typ/[typ]/` — „Farmářské trhy", „Polní dny 2026", „Prodej ze dvora"
- `/akce/[rok]/[mesic]/` — „Zemědělské akce červen 2026" (sezónní recyklace)
- `/akce/okres/[okres]/[typ]/` — „Farmářské trhy Benešovsko"

### Long-tail vrstva (hlavní směr)

1. **Detail akce = hlavní long-tail magnet.** Každá akce = vlastní landing page.
   Title/H1 šablony cílené na přesné dotazy:
   - „Prodej kachen — Teplýšovice (okres Benešov) | každou sobotu 8–12"
   - „Polní den {firma} — {obec}, {datum}"
2. **Obec-level osa** (nad rámec okresu): `/akce/obec/[obec]/` — „Zemědělské akce
   {obec}", „Farmářské trhy {obec}". Gate: indexuje se jen obec s ≥1 opakovanou
   nebo ≥2 akcemi; jinak `noindex` a obsah nese okres + detail.
3. **Víc kombinací:**
   - `/akce/typ/[typ]/[rok]/[mesic]/` — „Farmářské trhy červen 2026"
   - `/akce/okres/[okres]/[rok]/[mesic]/` — „Akce na Benešovsku v červnu"
4. **Evergreen „čerstvé" stránky:** `/akce/tento-vikend/`, `/akce/tento-tyden/`.

### Anti-thin-content kvalita (vzor kam-tecou-dane)

- Každá programatická stránka má unikátní datovou prózu
  („V okrese Benešov evidujeme 7 akcí, z toho 3 farmářské trhy…") + FAQ + JSON-LD.
- **Žádná prázdná stránka v indexu:** generujeme jen kombinace s reálným obsahem
  (stránka s < 3 akcemi → `noindex` + mimo sitemap, ale zůstává dostupná).
  Kombinace region×typ a region×měsíc se generují jen pro páry s reálnými akcemi
  — žádné prázdné kartézské stránky.
- Husté křížové prolinkování všech os (obec↔okres↔typ↔měsíc) + related akce +
  odkazy z relevantních článků encyklopedie/jak-na-to → silný interní linkbuilding.

**Společné prvky:** JSON-LD `Event`/`ItemList`/`BreadcrumbList`; AdSense sloty na
seznamech a detailech (env-gated, vzor `AdSlot`); napojení do hlavní navigace +
sitemap + news-sitemap kde dává smysl.

## Tok přidání a moderace

**Přidání — `/akce/pridat/`**
1. Formulář: název, typ, termín (přepínač jednorázová/opakovaná → relevantní
   pole), místo (našeptávání obce → doplní okres/kraj/lat/lng), pořadatel,
   kontakt, popis.
2. *(Vlna 2)* tlačítko „Vložit z textu" → Workers AI předvyplní pole.
3. Anti-spam: honeypot + rate-limit (vzor bazaru), povinný e-mail odesílatele.
4. Odeslání → `stav='ceka'`, `zdroj='uzivatel'` → Resend notifikace moderátorovi
   + potvrzení odesílateli.

**Moderace — `agro-svet.cz/admin/akce/`** (on-site, gated `is_admin` přes
`src/middleware.ts`, vzor fotosoutěže — NE centrální admin.samecdigital.com)
- Fronta čekajících: náhled všech polí + mapa.
- Akce jedním klikem: **Schválit** (`stav='zverejneno'`, `zverejneno_at`,
  přepočet `pristi_vyskyt`) / **Upravit a schválit** / **Zamítnout** (volitelný
  důvod → Resend odesílateli).
- API endpointy `src/pages/admin/akce/api/moderate.ts`
  (vzor `src/pages/admin/fotosoutez/api/moderate.ts`).
- Nová dlaždice v `src/pages/admin/index.astro`.

**Životní cyklus & údržba (řeší zastarávání)**
- Scheduled skript / cron přepne proběhlé jednorázové akce na `stav='probehla'`
  → zmizí z „nadcházejících", ale URL žije (SEO + archiv).
- Opakované akce zůstávají živé dle `plati_do`.
- `pristi_vyskyt` se přepočítává → seznamy/kalendář ukazují vždy aktuální termín.

**Nahlašování** (vzor `bazar_reports`): tlačítko „Nahlásit" na detailu →
fronta v adminu.

## Monetizace

- **Vlna 1:** AdSense sloty (env-gated). Jinak čistě traffic/SEO magnet.
- **Později:** topování/zvýraznění akce (sloupce `zvyrazneno*` připravené),
  placené profily pořadatelů — mimo rozsah tohoto zadání.

## Testování, chyby, výkon

**Testování** (vitest, vzor repa)
- Čisté funkce s unit testy: výpočet `pristi_vyskyt`, generátor slugů, gate
  indexovatelnosti (≥N akcí), datová próza, expanze opakovaných termínů na
  výskyty, dedup feedů (`feed_uid`).
- Parsování feedů (ICS/RSS/JSON-LD) testované na fixturách, ne na živé síti.
- Reálná brána = `npm run build` + `vitest` (tsc má v repu pre-existing šum).

**Ošetření chyb**
- Formulář: validace, honeypot, rate-limit, jasné hlášky.
- Feedy: vadný/nedostupný feed se přeskočí a zaloguje, nezhavaruje celý běh.
- Workers AI: při selhání/nevalidním JSON → tichý fallback na ruční vyplnění.
- Moderace: idempotentní akce (dvojklik na Schválit nic nerozbije).

**Výkon**
- Seznamy stránkované, `pristi_vyskyt` indexovaný pro řazení/filtr.
- Mapové markery z lehkého JSON endpointu (vzor bazaru), ne plný payload.
- Programatické stránky prerenderované kde to jde; OG build-time (satori).

## Fázování

- **Fáze 1 (kostra):** schéma `akce` + migrace + formulář `/akce/pridat/` +
  on-site moderace `/admin/akce/` + kurátorský seed velkých akcí + všechny
  SEO/long-tail stránky + JSON-LD + sitemap + AdSense + údržbový cron + nav.
- **Fáze 2 (automatizace):** feedy (ICS/RSS/JSON-LD) + Workers AI parsování textu.

## Mimo rozsah (YAGNI)

- iCal RRULE (řešeno strukturovaným opakováním).
- Topování a placené profily (sloupce připravené, logika později).
- Scraping cizího HTML (jen strukturované feedy).
- Centrální admin v admin.samecdigital.com (moderace je on-site).
