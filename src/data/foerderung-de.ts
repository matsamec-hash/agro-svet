// src/data/foerderung-de.ts
// Sazby DE/AT podpor, které ukazuje VÍC než jedno místo (detailní stránka
// + německá homepage). ‼️ Číslo opsané z dat do textu driftuje — homepage
// proto nesmí mít vlastní kopii, importuje odsud, a detailní stránky taky.
//
// Zdroje jsou zdokumentované u jednotlivých stránek:
//   /de/direktzahlungen              — Landwirtschaft Sachsen, Bayerische LfL
//   /de/oeko-regelungen              — BMEL / Bundesanzeiger
//   /de/direktzahlungen-oesterreich  — AMA (Prämienbetrag gem. § 21 Abs. 11 GSP-AV, Merkblatt DIZA 2026)
//   /de/oepul                        — BMLUK, AMA

/** DE — Einkommensgrundstützung für Nachhaltigkeit, FINÁLNÍ sazba pro rok podání 2025. */
export const DE_GRUNDSTUETZUNG_2025 = 152.44;

/** DE — nejvyšší jednotková sazba napříč Öko-Regelungen (ÖR 1a, první stupeň). */
export const DE_OER_MAX = 1300;

/** AT — Einheitsbeträge der Direktzahlungen.
 *  ‼️ Rakousko je vyhlašuje KAŽDÝ ROK (AMA, prosinec, § 21 Abs. 11 GSP-AV):
 *  rozpočet děleno skutečně podanou plochou / RGVE. Do 2026-10 tu stály
 *  „Richtwerte" 208/41/44/22/66 s tvrzením, že roční částky neexistují — špatně.
 *  2025 = konečné (AMA, Stichtag 10. 10. 2025, vyhlášeno 15. 12. 2025),
 *  2026 = předběžné „ca." z Merkblatt Direktzahlungen 2026 (AMA, 13. 11. 2025);
 *  přesné 2026 vyjdou v prosinci 2026. */
export const AT_DZ = {
  2025: { heimgut: 207.64, alm: 38.18, umv20: 45.54, umv40: 22.77, jung: 67.1, almKuehe: 98.08, almRinder: 49.04, almSchafeZiegen: 98.08 },
  2026: { heimgut: 207, alm: 38, umv20: 45, umv40: 22, jung: 67, almKuehe: 98, almRinder: 49, almSchafeZiegen: 98 },
} as const;
export const AT_BASIS_HEIMGUT = AT_DZ[2025].heimgut;
export const AT_BASIS_ALM = AT_DZ[2025].alm;
export const AT_UMV_20 = AT_DZ[2025].umv20;
export const AT_UMV_40 = AT_DZ[2025].umv40;
export const AT_JUNG = AT_DZ[2025].jung;

// Druhý stupeň Umverteilung je přesně polovina prvního (21.–40. ha „in halbem
// Ausmaß", Merkblatt DIZA 2026, bod 4.2) — hlídá de-launch.test.ts.

/** AT — nejvyšší sazba ÖPUL Bio Grünland (tierhaltender Betrieb < 1,40 RGVE/ha).
 *  ÖPUL má pevné sazby podle Sonderrichtlinie (ne roční dopočet): 2023 215 €/ha,
 *  od 2024 232,2 €/ha (Impulsprogramm +8 %). Zdroj: AMA Informationsblatt ÖPUL 2023
 *  Biologische Wirtschaftsweise, stav 10/2026, bod 11.3. */
export const AT_OEPUL_BIO_GRUENLAND_MAX = 232.2;
