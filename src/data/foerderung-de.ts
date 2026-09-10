// src/data/foerderung-de.ts
// Sazby DE/AT podpor, které ukazuje VÍC než jedno místo (detailní stránka
// + německá homepage). ‼️ Číslo opsané z dat do textu driftuje — homepage
// proto nesmí mít vlastní kopii, importuje odsud, a detailní stránky taky.
//
// Zdroje jsou zdokumentované u jednotlivých stránek:
//   /de/direktzahlungen              — Landwirtschaft Sachsen, Bayerische LfL
//   /de/oeko-regelungen              — BMEL / Bundesanzeiger
//   /de/direktzahlungen-oesterreich  — AMA, LKÖ
//   /de/oepul                        — BMLUK, AMA

/** DE — Einkommensgrundstützung für Nachhaltigkeit, FINÁLNÍ sazba pro rok podání 2025. */
export const DE_GRUNDSTUETZUNG_2025 = 152.44;

/** DE — nejvyšší jednotková sazba napříč Öko-Regelungen (ÖR 1a, první stupeň). */
export const DE_OER_MAX = 1300;

/** AT — Basiseinkommensstützung, Heimgutflächen (Acker, Dauergrünland, Dauerkulturen). */
export const AT_BASIS_HEIMGUT = 208;
/** AT — Basiseinkommensstützung, Almweideflächen (vlastní, výrazně nižší sazba). */
export const AT_BASIS_ALM = 41;
/** AT — Umverteilung, 1.–20. hektar (příplatek k základní sazbě). */
export const AT_UMV_20 = 44;
/** AT — Umverteilung, 21.–40. hektar. Od 41. hektaru se nevyplácí. */
export const AT_UMV_40 = 22;
/** AT — Einkommensstützung für Junglandwirte, max. 40 ha po 5 let. */
export const AT_JUNG = 66;

// ‼️ Křížová kontrola LKÖ: efektivní sazba na prvních 20 ha = AT_BASIS_HEIMGUT
// + AT_UMV_20 = 252 €/ha, na 21.–40. ha = 230 €/ha. Kdyby se jedno číslo změnilo
// a druhé ne, FAQ by tvrdilo něco jiného než tabulka — hlídá de-launch.test.ts.

/** AT — nejvyšší sazba ÖPUL Bio Grünland (Tierhalter bis 1,4 RGVE/ha).
 *  ‼️ Rakousko nevyhlašuje roční Einheitsbeträge jako německý Bundesanzeiger —
 *  je to orientační sazba pro období 2023–2027, ne dopočtený roční údaj. */
export const AT_OEPUL_BIO_GRUENLAND_MAX = 215;
