export type FeaturedPlan = '7d' | '30d' | '60d';

export interface FeaturedListingShape {
  featured: boolean;
  featured_until: string | Date | null | undefined;
}

export function isFeaturedActive(
  listing: FeaturedListingShape,
  now: Date = new Date(),
): boolean {
  if (!listing.featured) return false;
  if (!listing.featured_until) return false;
  const until = listing.featured_until instanceof Date
    ? listing.featured_until
    : new Date(listing.featured_until);
  return until.getTime() > now.getTime();
}

export function computeFeaturedUntil(
  currentUntil: Date | null,
  days: number,
  now: Date = new Date(),
): Date {
  const base = currentUntil && currentUntil.getTime() > now.getTime()
    ? currentUntil
    : now;
  return new Date(base.getTime() + days * 24 * 60 * 60 * 1000);
}

export function formatFeaturedUntil(
  timestamp: string | Date | null | undefined,
): string {
  if (!timestamp) return '';
  const d = timestamp instanceof Date ? timestamp : new Date(timestamp);
  if (isNaN(d.getTime())) return '';
  return `${d.getDate()}. ${d.getMonth() + 1}. ${d.getFullYear()}`;
}

export function planToDays(plan: FeaturedPlan): number {
  const map: Record<FeaturedPlan, number> = { '7d': 7, '30d': 30, '60d': 60 };
  return map[plan];
}
