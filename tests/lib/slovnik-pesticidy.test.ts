import { describe, it, expect } from 'vitest';
import { getSlovnik } from '../../src/lib/slovnik';
import { listChoroby } from '../../src/lib/choroby';

// Účinné látky, které v EU nejsou schválené (EU Pesticides Database, říjen 2026).
// Smí se zmínit jen jako historie („v EU neschválený od …“), ne jako současná volba.
// Kmeny pokrývají cs/sk/pl/uk/de pravopis.
const NESCHVALENE = [
  /man[ck]o[cz]eb|манкоцеб/i,
  /flufenac|флуфенацет/i,
  /metolachl|метолахлор/i,
  /metri?y?buz|метрибузин/i,
  /spirotetramat|спіротетрамат/i,
  /spinetoram|спінеторам/i,
  /spirodi[ck]l?o?fen|спіродиклофен/i,
  /pydiflumetofen|пидіфлуметофен/i,
  /epo[xk]s?[iy][ck]ona[zs]|епоксиконазол/i,
  /propi[ck]ona[zs]|пропіконазол/i,
  /thiophanat|tiofanat|тіофанат/i,
  /dimoxystrobin|димоксистробін/i,
  /indo[xk]s?a[ck]arb|індоксакарб/i,
  /glufosi?y?n|глюфосинат/i,
  /diquat|dikwat|дикват/i,
  /chlorpyrif|хлорпірифос/i,
  /bifent|біфентрин/i,
  /fipronil|фіпроніл/i,
];

// Značka, že řádek mluví o neschválení / historii.
const NEGACE = /neschvál|schválen[éý] (není|nejsou)|není schvál|nejsou schvál|nie (je|sú)\s+schvál|schválený nie je|niezatwierdz|nie (jest|są)( już)? zatwierdz|не схвал|більше не схвал|zakáz|zakaz|заборон|nicht (mehr )?genehmigt|verboten|skončil|wygasł|завершил/i;

/** Odrážka „- **Látka** …“ = typický tvar doporučení v hesle. */
function odrazky(text: string): string[] {
  return text.split('\n').filter((ln) => /^\s*-\s+\*\*[^*]+\*\*/.test(ln));
}

describe('slovník: EU-neschválené pesticidy nejsou doporučené jako současná volba', () => {
  for (const locale of ['cs', 'sk', 'pl', 'uk', 'de']) {
    it(`${locale}: odrážka s neschválenou látkou vždy říká, že není schválená`, () => {
      const bad: string[] = [];
      for (const t of getSlovnik(locale)) {
        for (const ln of odrazky(t.longDef)) {
          const bold = ln.match(/\*\*([^*]+)\*\*/)?.[1] ?? '';
          if (NESCHVALENE.some((re) => re.test(bold)) && !NEGACE.test(ln)) bad.push(`${t.slug}: ${ln.trim()}`);
        }
      }
      expect(bad).toEqual([]);
    });
  }

  for (const locale of ['cs', 'sk', 'pl', 'uk', 'de']) {
    it(`${locale}: atlas chorob nemá v účinných látkách neschválenou látku`, () => {
      const bad = listChoroby(locale).flatMap((c) =>
        (c.ucinne_latky ?? [])
          .filter((l) => NESCHVALENE.some((re) => re.test(l.latka)))
          .map((l) => `${c.slug}: ${l.latka}`),
      );
      expect(bad).toEqual([]);
    });
  }
});
