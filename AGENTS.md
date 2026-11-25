## Bezpečnost (povinné, viz ~/samec-security/samec-security/SECURITY-STANDARD.md)

Než přidáš nebo změníš veřejný endpoint (POST/PUT/PATCH/DELETE bez přihlášení), formulář, odesílání e-mailů, nahrávání souborů nebo volání placeného API (Anthropic, OpenAI, Resend, Stripe, geokódování):

1. Limit četnosti v databázi (ne v paměti): na IP, na cílovou e-mailovou adresu a celkový strop. Odpověď 429 + `Retry-After`.
2. IP klienta jen přes sdílený `client-ip` modul. NIKDY číst `CF-Connecting-IP` ani první záznam `X-Forwarded-For` přímo.
3. Honeypot ve formuláři, u rizikových míst Cloudflare Turnstile.
4. Validace délek a tvaru vstupu; u souborů skutečný obsah (magic bytes), strop velikosti, kvóty, mazání nevyužitých.
5. Přesměrování jen na adresy v rámci webu (`safeLocalPath`).
6. Test, který ověří limit (429), honeypot a obejití podvrženou hlavičkou.
7. Před nasazením `node scripts/security-check.mjs .` musí skončit bez FAIL. Výjimka jen v `.security-allow.json` s důvodem.
Nic se nenasazuje do produkce ani nemění na produkční infrastruktuře bez výslovného souhlasu uživatele.
