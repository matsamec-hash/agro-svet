export interface CrossLink {
  href: string;
  label: string;
  primary: boolean;
}

export interface RelatedLink {
  href: string;
  label: string;
}

/**
 * Per-titul cílené cross-linky. Když titul nemá relatedLinks, vrací fallback
 * (generická tlačítka). base = '' pro cs, '/sk' atd. — prefixuje interní href.
 */
export function resolveCrossLinks(
  related: RelatedLink[] | undefined,
  base: string,
  fallback: CrossLink[],
): CrossLink[] {
  if (!related || related.length === 0) return fallback;
  return related.map((l, i) => ({ href: `${base}${l.href}`, label: l.label, primary: i === 0 }));
}
