// Centrální registr anket na webu — používá hub /ankety/ i jednotlivá umístění.
// slug musí odpovídat slugu předanému komponentě <Anketa> na cílové stránce
// (drží hlasy v DB), jinak by se výsledky rozešly.
export interface AnketaDef {
  slug: string;
  question: string;
  options: { id: string; label: string }[];
  /** kde anketa primárně žije (odkaz z hubu) */
  kontext?: { label: string; href: string };
}

export const ANKETY: AnketaDef[] = [
  {
    slug: 'nejlepsi-znacka-traktoru',
    question: 'Kterou značku traktoru byste koupili vy?',
    options: [
      { id: 'john-deere', label: 'John Deere' },
      { id: 'zetor', label: 'Zetor' },
      { id: 'fendt', label: 'Fendt' },
      { id: 'new-holland', label: 'New Holland' },
      { id: 'case-ih', label: 'Case IH' },
      { id: 'kubota', label: 'Kubota' },
    ],
    kontext: { label: 'Prodeje techniky', href: '/data/prodeje-techniky/' },
  },
  {
    slug: 'nejspolehlivejsi-znacka',
    question: 'Která značka je podle vás nejspolehlivější?',
    options: [
      { id: 'zetor', label: 'Zetor' },
      { id: 'john-deere', label: 'John Deere' },
      { id: 'fendt', label: 'Fendt' },
      { id: 'new-holland', label: 'New Holland' },
      { id: 'case-ih', label: 'Case IH' },
      { id: 'kubota', label: 'Kubota' },
    ],
    kontext: { label: 'Nejspolehlivější traktory', href: '/prehled/nejspolehlivejsi-traktory/' },
  },
  {
    slug: 'nejuspornejsi-traktor',
    question: 'Který traktor je podle vás nejúspornější?',
    options: [
      { id: 'fendt', label: 'Fendt' },
      { id: 'deutz-fahr', label: 'Deutz-Fahr' },
      { id: 'john-deere', label: 'John Deere' },
      { id: 'valtra', label: 'Valtra' },
      { id: 'zetor', label: 'Zetor' },
    ],
    kontext: { label: 'Nejnižší spotřeba nafty', href: '/prehled/nejlevnejsi-provoz-traktory/' },
  },
  {
    slug: 'nejlepsi-kombajn',
    question: 'Který kombajn je podle vás nejlepší?',
    options: [
      { id: 'claas', label: 'Claas Lexion' },
      { id: 'john-deere', label: 'John Deere S/T' },
      { id: 'new-holland', label: 'New Holland CR' },
      { id: 'case-ih', label: 'Case IH Axial-Flow' },
      { id: 'fendt', label: 'Fendt IDEAL' },
    ],
    kontext: { label: 'Nejprodávanější kombajny 2025', href: '/prehled/nejprodavanejsi-kombajny-2025/' },
  },
  {
    slug: 'traktor-mala-farma',
    question: 'Který traktor byste zvolili na malou farmu?',
    options: [
      { id: 'zetor', label: 'Zetor' },
      { id: 'kubota', label: 'Kubota' },
      { id: 'new-holland', label: 'New Holland' },
      { id: 'john-deere', label: 'John Deere' },
      { id: 'case-ih', label: 'Case IH' },
    ],
    kontext: { label: 'Traktory pro malé farmy', href: '/prehled/traktory-male-farmy-do-80ha/' },
  },
];
