# Zadání: návody na seřízení strojů — 1. dávka

Větev `content/navody-seridit-1`, worktree `~/agro-svet/wt-navody` (z `origin/master` `901369b2`).

## Proč

Podle Search Console (12. 11. 2026) dělá jediný návod `jak-seridit-pluh` 256 kliků za měsíc, asi 5 % celého webu. Trefil konkrétní dotaz „nastavenie pluhu za malotraktor“. Návody typu „jak vybrat X“ (`/pruvodce`, `/pl/poradniki`) dělají dohromady jen asi 21 kliků měsíčně.

Google našeptávač v češtině, slovenštině a polštině ukazuje, že lidi hledají seřizování konkrétních starých traktorů a nářadí: Zetor 5211–7745 ve všech třech jazycích, Ursus C-330/C-360 v polštině. Polsky nemáme žádný seřizovací návod, `/pl/jak-na-to/jak-seridit-pluh/` přesměruje na češtinu.

## Co vznikne (10 témat, 22 souborů)

| # | Téma | cs `howto/` | sk `howto-sk/` | pl `poradniki-pl/` |
|---|---|---|---|---|
| 1 | Seřízení pluhu (polský překlad hitu) | — | — | `jak-ustawic-plug.md` |
| 2 | Seřízení otočného pluhu | `jak-seridit-otocny-pluh.md` | stejný slug | `regulacja-pluga-obrotowego.md` |
| 3 | Kalibrace postřikovače | `jak-kalibrovat-postrikovac.md` | stejný slug | `jak-ustawic-opryskiwacz.md` |
| 4 | Nastavení rozmetadla hnojiv | `jak-nastavit-rozmetadlo-hnojiv.md` | stejný slug | `ustawienie-rozsiewacza-nawozow.md` |
| 7 | Seřízení spojky Zetor | `serizeni-spojky-zetor.md` | stejný slug | `regulacja-sprzegla-zetor.md` |
| 8 | Seřízení vůle ventilů Zetor | `serizeni-ventilu-zetor.md` | stejný slug | `regulacja-zaworow-zetor.md` |
| 9 | Vstřikovací čerpadlo a předvstřik Zetor | `predvstrik-vstrikovaci-cerpadlo-zetor.md` | stejný slug | `ustawienie-kata-wtrysku-zetor.md` |
| 13 | Regulacja sprzęgła Ursus C-330/C-360 | — | — | `regulacja-sprzegla-ursus-c-360-c-330.md` |
| 14 | Regulacja zaworów Ursus C-330/C-360 | — | — | `regulacja-zaworow-ursus-c-360-c-330.md` |
| 15 | Kąt wtrysku a pompa Ursus C-330/C-360 | — | — | `ustawienie-kata-wtrysku-ursus-c-360-c-330.md` |

Slovenské soubory mají stejný název i `slug` jako české (overlay). Polské jsou samostatná sekce s vlastním polským slugem.

## Pravidla

1. **Každé číslo ze zdroje.** Vůle ventilů, předvstřik, volný chod pedálu, utahovací momenty, tlaky, dávky: jen z dílenské příručky, návodu k obsluze výrobce nebo metodiky výzkumného ústavu. Zdroj se uvede v sekci „Zdroje“ na konci textu (název, vydání nebo rok, kapitola nebo strana, odkaz). Fórum ani blog nejsou zdroj čísla. Když se hodnota nedá doložit, článek nevznikne a agent to nahlásí. Špatná hodnota zničí motor.
2. **Přesně, které modely.** Článek jmenuje modely, pro které hodnoty platí, a upozorní, kde se liší (např. přeplňované 7245/7745 proti 7211/7711).
3. **Formát podle `howto/jak-seridit-pluh.md`.** Frontmatter: `title` do 60 znaků s klíčovým dotazem, `description` 140–160 znaků, `datePublished: 2026-11-12`, `lastVerified: 2026-11-12`, `totalTime`, `obtiznost`, `tools`, `supplies`, `steps` (6–10 kroků), `faq` (4–6 otázek, jak se lidi opravdu ptají), volitelně `relatedUrl` + `relatedLabel`. Tělo: 2–4 odstavce úvodu, tabulka hodnot u servisních návodů, upozornění na bezpečnost, sekce „Zdroje“. `heroImage` zatím nevyplňovat, fotky doplní hlavní relace.
4. **Jazyk.** Slovenština a polština jako od rodilého mluvčího se zemědělskou praxí, žádná čeština v textu (kontrola: v sk/pl nesmí být `ě ř ů`). Polské texty používají polskou terminologii (ciągnik, sprzęgło, luz zaworowy, kąt wyprzedzenia wtrysku).
5. **Odkazy.** Na stránky modelů v katalogu (`/stroje/zetor/ur-i/7211/` a další) jen když na produkci vracejí 200. `relatedUrl` se píše bez jazykové předpony.
6. **Bez nasazení.** Agent nic necommituje ani nepushuje, commit a nasazení dělá hlavní relace po kontrole.

## Ověření

- `npx astro check` / build projde, `npx vitest run` zelené.
- Každé číslo v článku dohledatelné v uvedeném zdroji.
- Po nasazení: každá nová URL 200 a v sitemapě; za 2–3 týdny zobrazení v Search Console, podle nich 2. dávka (seznam v paměti `project-agro-svet-navody-seridit-2026-11-12`).

## Stav

- [ ] Zetor (7, 8, 9)
- [ ] Ursus + polský pluh (1, 13, 14, 15)
- [ ] Postřikovač, rozmetadlo, otočný pluh (2, 3, 4)
- [ ] Fotky, build, testy, commit
- [ ] Nasazení a ověření na produkci
