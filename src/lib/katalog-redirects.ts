// Trvalé (301) přesměrování stránek modelů, které zmizely z katalogu strojů
// (src/data/stroje/*.yaml). Volá je legacyRedirectTarget s cs cestou, takže
// platí pro všechny jazykové mutace najednou.
//
// Kdy sem model patří: výrobce ho nikdy nevyráběl, nebo šlo o duplikát jiného
// záznamu. Ověření a zdroj každé položky je v ~/agro-svet/foto-audit/de/rizika/
// katalog-opravy.md. Cíl je stránka řady, nebo model, který zůstal.
// ‼️ Zdroj nesmí být živá stránka a cíl musí existovat — hlídá
// tests/lib/katalog-redirects.test.ts.

/** cs cesta smazaného modelu (bez koncového lomítka) → cs cíl. */
export const REMOVED_MODEL_PAGES: Record<string, string> = {
  // 2026-10-17 CLAAS Lexion 8900: duplikát ve staré řadě 400–700 a záznam
  // „Lexion 8900 (new)“ sloučené do jednoho modelu v řadě 5000–8000.
  '/stroje/claas/lexion-400-500-600-700/lexion-8900': '/stroje/claas/lexion-5000-8000/lexion-8900/',
  '/stroje/claas/lexion-5000-8000/lexion-8900-new': '/stroje/claas/lexion-5000-8000/lexion-8900/',
};

/** Přejmenované slugy modelů → nový slug. Přesměruje i srovnání /srovnani/<a>-vs-<b>/. */
export const RENAMED_MODEL_SLUGS: Record<string, string> = {
  'claas-lexion-8900-new': 'claas-lexion-8900',
};

const PAIR_DELIMITER = '-vs-';

/** cs cíl pro stránku smazaného modelu nebo srovnání s přejmenovaným modelem, jinak null. */
export function catalogRedirectTarget(csPath: string): string | null {
  const model = csPath.match(/^(\/stroje\/[^/]+\/[^/]+\/[^/]+)\/?$/);
  if (model && Object.hasOwn(REMOVED_MODEL_PAGES, model[1])) return REMOVED_MODEL_PAGES[model[1]];

  const cmp = csPath.match(/^\/srovnani\/([^/]+)\/?$/);
  if (cmp) {
    const combo = cmp[1];
    const idx = combo.indexOf(PAIR_DELIMITER);
    if (idx === -1) return null;
    const a = combo.slice(0, idx);
    const b = combo.slice(idx + PAIR_DELIMITER.length);
    if (!Object.hasOwn(RENAMED_MODEL_SLUGS, a) && !Object.hasOwn(RENAMED_MODEL_SLUGS, b)) return null;
    const na = RENAMED_MODEL_SLUGS[a] ?? a;
    const nb = RENAMED_MODEL_SLUGS[b] ?? b;
    if (na === nb) return null;
    // Stejné kanonické pořadí jako pairCombo() v lib/comparator.ts.
    const [first, second] = na < nb ? [na, nb] : [nb, na];
    return `/srovnani/${first}${PAIR_DELIMITER}${second}/`;
  }
  return null;
}
