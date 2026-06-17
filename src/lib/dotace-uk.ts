// src/lib/dotace-uk.ts
// Typy pro UK /dotace hub. Kurátovaný UA tvar (NE české SZIF). Každé volatilní pole
// (částka/sazba) nese source+url+asOf; bez derivací/grafů.

export interface DotaceUkStep {
  title: string; text: string; source: string; url: string;
}

export interface DotaceUkProgram {
  name: string;
  type: string;          // např. "Грант" | "Кредит"
  summary: string;
  amount?: string;       // volatilní — jen se source+asOf, jinak vynechat
  amountNote?: string;
  eligibility: string;
  source: string; url: string; asOf: string;
}

export interface DotaceUkDonor { name: string; what: string; url: string; }
export interface DotaceUkSourceLink { label: string; url: string; }

export interface DotaceUkData {
  generated: string;
  warCaveat: string;
  howItWorks: DotaceUkStep[];
  programs: DotaceUkProgram[];
  donors: DotaceUkDonor[];
  sources: DotaceUkSourceLink[];
}
