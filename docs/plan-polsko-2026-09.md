# Polsko na agro-svět.cz — plán, září 2026

Podklad: GSC 10. 6. – 8. 9. 2026 (90 dní), staženo 10. 9. přes `~/.gsc/pull.py`.
Metodika schodku: [[feedback-ctr-schodek-mer-proti-vlastni-krivce]] — počítáno
proti **vlastní CTR křivce webu**, ne proti obecnému benchmarku.

## 1. Co data říkají

| země | zobrazení | prokliky | CTR | pozice |
|---|---|---|---|---|
| Česko | 158 298 | 2 731 | 1,73 % | 9,1 |
| **Polsko** | **106 482** | **860** | **0,81 %** | **16,2** |
| Slovensko | 40 863 | 961 | 2,35 % | 7,9 |
| Německo | 13 206 | 144 | 1,09 % | 16,1 |

Polsko dělá **36 % všech zobrazení webu** a přináší míň prokliků než Slovensko,
které má 2,6× menší objem.

## 2. Tři hypotézy, které data VYVRÁTILA

Tohle je tu proto, aby se k nim nikdo nevracel.

**⛔ „Jsou to špatné titulky a popisky."** Polské stránky konvertují **přesně
podle křivky webu**: 1,09 % na průměrné pozici 10,9, křivka dává na jedenáctce
1,18 %. Není co opravovat. (Tatáž chyba se stala 1. 9. i 10. 9. — pokaždé
z obecného benchmarku místo z vlastní křivky.)

**⛔ „Polský obsah je mělčí."** Není. `/pl/stroje/case-ih/mx-magnum/mx285/` má
53 567 znaků prózy proti 53 930 na české verzi, stejné čtyři sekce, polské
nadpisy. Je to plnohodnotný překlad, ne strojová slupka.

**⛔ „Chybí obsahová parita se Slovenskem."** PL má 29 launchnutých prefixů,
SK 21. Parita byla dosažena v srpnu (fáze 1+2) a pozici to nezlepšilo.

## 3. Co je skutečný rozdíl

Stejný typ dotazu, dva jazyky:

| dotaz | zobrazení | prokliky | CTR | pozice |
|---|---|---|---|---|
| „technické údaje" (cs) | 1 753 | 73 | **4,16 %** | **6,5** |
| „dane techniczne" (pl) | 4 481 | 49 | 1,09 % | 10,9 |

**Polsko má víc poptávky a horší pozici.** Při stejném obsahu a stejné šabloně
zbývá jediné vysvětlení: web nemá v polském prostředí autoritu. Je to `.cz`
doména bez jediného polského odkazu, která soutěží se zavedenými polskými
portály. Slovensko je výjimka daná tím, že Google češtinu a slovenštinu drží
blízko u sebe — Polsko je samostatný trh a chová se jako samostatný trh.

## 4. Cenové dotazy: prohraná bitva, dokud nemáme ceny

| | dotazů | zobrazení | prokliky | pozice |
|---|---|---|---|---|
| dotazy s „cena" | 297 | 1 818 | 26 | 17,8 |
| z toho s **nulou** prokliků | **283** | | | |

Poláci u strojů hledají cenu (`john deere 9rx 830 cena`, `claas lexion 8900
cena`, `massey ferguson 3700 s cena` — všechny nula prokliků). Google nás
zobrazuje, protože stránka o ceně mluví, ale žádnou neukazuje. Popisek dokonce
slibuje „ceny v bazaru", jenže **bazar je z webu schovaný od června 2026** kvůli
rozbité registraci.

To je stejná třída jako `/kalkulacka` (−415) — strukturálně neopravitelné
kosmetikou. Buď se doplní cenová data, nebo se ten slib z popisku vypustí.

## 5. Plán

### Krok 1 — přestat lhát v popisku (hodina práce, hned)
`cat.s.d.descFallback` slibuje „ceny v bazaru" u všech 2 092 modelů ve všech
pěti jazycích, i když bazar není dostupný. Vypustit. Titulek to už umí
(`titleSuffixNoPrice`), popisek ne.
‼️ Nesahat na spec-led tvar („výkon 67 k, roky výroby 1980–1998") — ten je
změřený jako funkční.

### Krok 2 — polské odkazy (hlavní práce, týdny)
Jediná věc, která vysvětluje rozdíl pozic při stejném obsahu. Zmapovat polské
agro kanály stejně, jako se to udělalo pro Česko
([[reference-cesky-agro-pr-linkbuilding-kanaly]]): oborové portály, fóra
(agrofoto.pl a spol.), krajské zemědělské komory, katalogy. Cíl: **první
followed odkazy z polských domén**, ne počet.

### Krok 3 — rozhodnout o cenách (rozhodnutí, ne práce)
Buď cenová data pro stroje sehnat a stát se pro dotaz „cena" relevantní, nebo
se na ně vykašlat a nechat je Googlu. Obojí je legitimní; současný stav —
zobrazovat se a nedodat — je nejhorší ze tří.

### Krok 4 — neopakovat, co nefunguje
Nepřekládat další sekce. Parita už je. Další překlad pozici nezvedne.

## 6. Jak to změřit

⏰ **20.–30. září**, ve stejném okně jako opravy titulků na army-svet,
svetovestadiony a stavebni-svet.

Sledovat **průměrnou pozici Polska** (dnes 16,2), ne CTR. CTR je v pořádku už
teď a jeho zlepšení by znamenalo, že se změřilo něco jiného.

```
~/.gsc/pull.py 90
```
Pak křivku a schodek podle metodiky výš. Hotovo, když se `pol` posune
z 16,2 směrem k 12 — na slovenských 7,9 to nebude ani za rok.
