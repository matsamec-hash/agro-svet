# ZADÁNÍ pro další okno — agro-svet.cz po migraci na VPS (co dodělat)

**Datum:** 2026-06-08
**Stav:** ✅ **Migrace CF Workers → VPS Node origin (Coolify) je HOTOVÁ a ŽIVÁ.** Hosting, TLS (Full strict + LE), UK launch, crony i auto-deploy pipeline jedou. Tohle je seznam **zbytkových / navazujících** úkolů — nic z toho neblokuje provoz.
**Spustit:** „Pokračuj v dodělávkách po migraci agro-svet na VPS — viz zadání 2026-06-08." Načti paměť `project-agro-svet-vps-migrace.md`.

**Klíčové údaje:** Coolify app `agro-svet` uuid `n132yjaw951x4x3sy665rnvz`, projekt `agro-svet.cz`, server `187.124.12.96` (panel `srv1723031.hstgr.cloud`, token `/tmp/coolify.env` — možná revokovaný, ověřit). Rollback target = Worker `agro-svet-web` (kód živý, custom domains smazané).

---

## 🔴 HNED / časově citlivé

### 1. Uložit nové secrety do hesláře (než zmizí z /tmp)
`/tmp` je dočasné. Nové hodnoty existují jen tam + zašifrované v GitHub/Coolify (nečitelné):
- `/tmp/agro-cron-secret.txt` → `CRON_SECRET`
- `/tmp/agro-admin-token.txt` → `ADMIN_METRICS_TOKEN`
→ **zkopírovat do hesláře**, pak je lze smazat.

### 2. Ověřit první reálné cron běhy (GitHub Actions)
Crony běží zítra **04:00 UTC** (`cron-akce-maintenance`) a **06:00 UTC** (`cron-saved-search-digest`).
- Zkontrolovat `gh run list --repo matsamec-hash/agro-svet --workflow=cron-saved-search-digest.yml` → poslední run **success** (endpoint vrátí 200 s novým `CRON_SECRET`).
- Když fail (401) → secret mismatch mezi GitHub a Coolify → přegenerovat a sjednotit.

---

## 🟡 PO ~DNI STABILNÍHO PROVOZU

### 3. Part E — úklid (až je rollback jistě netřeba)
**Podmínka: VPS běží stabilně ~den (Coolify logy bez chyb, perf OK).** Teprve pak:
- **Smazat Worker `agro-svet-web`** (Cloudflare → Workers & Pages → Settings → Danger Zone). Tím padne rollback — udělat až s jistotou.
- **Smazat Pages projekt `agro-svet`** (agro-svet.pages.dev — nepoužívaný, auto-build z repa stejně failuje = Node adapter).
- **Z repa odstranit CF artefakty:** `wrangler.toml`, `scripts/cf-purge.mjs`, `npm run deploy`/`purge` skripty v `package.json`, dep `@astrojs/cloudflare`. Případně i CF env z Coolify (`CF_ZONE_ID`/`CF_PURGE_TOKEN`) + cf-purge post-deploy command. **POZOR:** dokud je web za CF proxy, cf-purge se může hodit (purge cache po deployi) — zvážit, jestli mazat, nebo nechat.
- **Uklidit staré agro-svet worktrees** (`git worktree list` → ~11 starých feature větví: disposable, i18n-*, kalendar-akci, uk-faze2, vcelarstvi, slovnik). Ověřit merged → `git worktree remove`.
- Aktualizovat paměť `project-agro-svet-vps-migrace.md` → Part E hotová.

---

## 🟢 VOLITELNÉ / NICE-TO-HAVE

### 4. CF Cache Rule (perf)
Teď `cf-cache-status: DYNAMIC` = CF necachuje HTML, každý request jde na VPS. Origin posílá `cache-control: public, s-maxage=300, stale-while-revalidate=1800`, ale CF ho na HTML defaultně ignoruje.
→ V CF (Rules → Caching) přidat **Cache Rule** na prerendered cesty (Eligible for cache + Edge TTL respektovat origin), aby se 1210+ static stránek cachovalo na edge → rychlejší TTFB + odlehčí VPS. **Pozor nenacachovat** dynamické: `/api/*`, `/admin/*`, `/bazar/prihlaseni*`, cokoli s auth cookie. Ověřit `cf-cache-status: HIT` na `/`, `/novinky/`, `/uk/stroje/`.

### 5. Ruční UAT (co nešlo headless)
Na živém webu proklikat: **Supabase login/registrace** (bazar), **odeslání formuláře** (Turnstile widget + Resend e-mail dorazí), **admin login** (`/admin` s session). Smoke ukázal jen render 200, ne auth round-trip.

### 6. Monitoring kapacity VPS
Pár dní sledovat RAM/CPU na VPS (běží tam CMS + 4 weby + 3 Supabase stacky + teď agro-svet) — Coolify Metrics nebo `ssh root@187.124.12.96 'free -h; uptime'`. Astro Node app ~150–300 MB; 32 GB by mělo stačit.

---

## ⏸️ NAVAZUJÍCÍ (samostatné projekty, NE součást této migrace)

### 7. DB migrace (až bude vhodné)
agro-svet DB = **Supabase cloud `obhypfuzmknvmknskdwh`** (SDÍLENÁ s czechsubaruclub). Hosting se přesunul, **DB záměrně zůstala cloud** (nemíchat 2 rizika). Až se DB zmigruje na self-host (viz `project-migrace-weby-vps-hostinger`), teprve pak odemkne:
- **CMS `/uzivatele` dashboard** — doplnit `USERS_AGROSVET_URL` + service key (čeká na self-host, viz `project-cms-cross-project-users-dashboard`).
- **Disposable e-mail blokace bazaru** — agro-svet je poslední web bez ní (viz `project-disposable-email-blokace`; pozor: bazar signup jde do `bazar_users`, ne čistě `auth.users` → recon kam zapisuje).

---

## Definition of Done (zbytek)
Secrety v hesláři; cron běhy zelené; po stabilizaci Worker/Pages/wrangler uklizené + paměť aktualizovaná; (volitelně) CF Cache Rule + ruční UAT prošlé.
