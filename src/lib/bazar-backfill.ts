/**
 * Sloučí spočítané atributy do stávajících. Default: doplní jen chybějící klíče
 * (ručně zadané nepřepisuje). force: spočítané vyhrávají. Vrací nový objekt
 * k zápisu, nebo null když by zápis byl no-op (nic nového).
 */
export function mergeBackfillAttributes(
  existing: Record<string, unknown> | null | undefined,
  computed: Record<string, unknown>,
  force: boolean,
): Record<string, unknown> | null {
  const base = existing && typeof existing === 'object' ? existing : {};
  const merged: Record<string, unknown> = { ...base };
  for (const [k, v] of Object.entries(computed)) {
    if (force || !(k in base)) merged[k] = v;
  }
  // no-op detekce (stejný počet klíčů i hodnot)
  const keys = new Set([...Object.keys(base), ...Object.keys(merged)]);
  let changed = false;
  for (const k of keys) if (base[k] !== merged[k]) { changed = true; break; }
  return changed ? merged : null;
}
