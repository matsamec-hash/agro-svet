// Pricing snapshot pro Topování. Změny ceníku se nesmí retroaktivně promítnout
// do už existujících orders — proto je price_czk uložena na order row v DB.
// Tady jen single source of truth pro UI + endpoint validation.

import type { FeaturedPlan } from './bazar-featured';

export interface PlanInfo {
  plan: FeaturedPlan;
  days: number;
  priceCzk: number;
  /** Per-den indikátor, slouží jen pro UI „nejlepší deal" badge. */
  perDayCzk: number;
  label: string;
  description: string;
}

export const FEATURED_PLANS: PlanInfo[] = [
  {
    plan: '7d',
    days: 7,
    priceCzk: 99,
    perDayCzk: Math.round(99 / 7),
    label: '7 dní',
    description: 'Krátký boost — vhodné pro rychlou likvidaci skladu nebo časově omezenou nabídku.',
  },
  {
    plan: '30d',
    days: 30,
    priceCzk: 249,
    perDayCzk: Math.round(249 / 30),
    label: '30 dní',
    description: 'Nejoblíbenější plán. Standardní inzerát doběhne za 30 dní, topování ho udrží nahoře po celou dobu.',
  },
  {
    plan: '60d',
    days: 60,
    priceCzk: 449,
    perDayCzk: Math.round(449 / 60),
    label: '60 dní',
    description: 'Nejlepší poměr cena/den. Vhodné pro dražší techniku, kde hledání kupce trvá déle.',
  },
];

export function getPlanInfo(plan: FeaturedPlan): PlanInfo {
  const info = FEATURED_PLANS.find((p) => p.plan === plan);
  if (!info) throw new Error(`Unknown plan: ${plan}`);
  return info;
}
