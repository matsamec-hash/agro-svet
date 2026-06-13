// Ukrajinská (uk) varianta slovníku — překlad CS hesel (slug = cs slug).
// Naplní se v Tasku 5 (subagent-driven překlad). Zatím prázdné → uk routy 404
// (sekce není launchnutá, noindex).
import type { SlovnikTerm, SlovnikKategorie } from './slovnik';

export const SLOVNIK_UK: SlovnikTerm[] = [];

export const KATEGORIE_LABELS_UK: Record<SlovnikKategorie, string> = {
  technologie: 'Технології',
  pohon: 'Привід і двигун',
  hnojivo: 'Добрива',
  dotace: 'Субсидії та виплати',
  agrotechnika: 'Агротехніка',
  regulace: 'Регулювання та норми',
  'precise-farming': 'Точне землеробство',
  jednotky: 'Одиниці виміру',
  historie: 'Історія',
  chov: 'Тваринництво',
  slang: 'Сленг',
  ochrana: 'Захист рослин',
  plodiny: 'Культури',
  vcelarstvi: 'Бджільництво',
};
