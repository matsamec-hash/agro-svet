import { describe, it, expect } from 'vitest';
import cs from '../../src/i18n/ui/cs';
import sk from '../../src/i18n/ui/sk';
import pl from '../../src/i18n/ui/pl';
import uk from '../../src/i18n/ui/uk';

// PROČ: sk.ts měl v `plod.*` klíčích polštinu („Norma wysiewu", „Zmienovanie",
// „Zachowujący odmianę") — sekce /plodiny se pro sk překládala podle pl.ts a
// nikdo si toho nevšiml, protože sekce nebyla launchnutá a stránka se nikdy
// nevykreslila. Fallback t() padá jen na cs, cizí jazyk nikdy nezachytí.
// Test hlídá celou třídu: každý slovník smí obsahovat jen písmena a slova
// svého jazyka.

const BRAND = /agro-svět|agro-svet/gi;
const strip = (v: string) => v.replace(BRAND, '');

describe('slovníky neobsahují cizí jazyk', () => {
  const cases = [
    // Polština nemá ě ř ů ľ ĺ ŕ ô ä; čeština/slovenština nemá ą ę ł ń ś ź ż.
    { name: 'sk', dict: sk, forbidden: /[ąęłńśźżĄĘŁŃŚŹŻ]/, label: 'polská diakritika' },
    { name: 'cs', dict: cs, forbidden: /[ąęłńśźżĄĘŁŃŚŹŻ]/, label: 'polská diakritika' },
    { name: 'pl', dict: pl, forbidden: /[ěřůľĺŕôäĚŘŮĽĹŔÔÄ]/, label: 'česká/slovenská diakritika' },
  ];

  for (const { name, dict, forbidden, label } of cases) {
    it(`${name}.ts neobsahuje ${label}`, () => {
      const bad = Object.entries(dict)
        .filter(([, v]) => forbidden.test(strip(String(v))))
        .map(([k, v]) => `${k}: ${v}`);
      expect(bad).toEqual([]);
    });
  }

  // uk je psané azbukou, takže „cizí jazyk" se pozná obráceně: hodnota bez
  // jediného cyrilického znaku je latinka, tedy neprošlý překlad. Výjimky jsou
  // pojmenované — brand, zkratky, šablony a odkazy na zdroje.
  it('uk.ts nemá hodnotu bez azbuky (kromě pojmenovaných výjimek)', () => {
    const ALLOWED = new Set(['brand.name', 'footer.gdpr', 'footer.dsa', 'nov.kat.count',
      'cat.s.d.asideKickerCount', 'cat.s.d.altPhoto']);
    const bad = Object.entries(uk)
      .filter(([k, v]) => !ALLOWED.has(k) && typeof v === 'string'
        && /[A-Za-zÁ-ž]{3,}/.test(v) && !/[\u0400-\u04FF]/.test(v)
        && !/^https?:\/\//.test(String(v).trim()))
      .map(([k, v]) => `${k}: ${v}`);
    expect(bad).toEqual([]);
  });

  it('sk.ts neobsahuje polská slova bez diakritiky (wysiew / zmianowanie / nawożenie)', () => {
    const PL_WORDS = /wysiew|zmianowan|zmienowan|nawoz|nawoż|zachowuj|roślin|uprawow/i;
    const bad = Object.entries(sk).filter(([, v]) => PL_WORDS.test(String(v))).map(([k, v]) => `${k}: ${v}`);
    expect(bad).toEqual([]);
  });

  it('cs.ts nezůstal v žádném cizím slovníku beze změny u prózy (>60 znaků)', () => {
    // Dlouhé texty shodné s cs = nepřeložený klíč (u krátkých labelů je shoda běžná).
    for (const [name, dict] of [['sk', sk], ['pl', pl], ['uk', uk]] as const) {
      const isUrl = (v: string) => /^(https?:\/\/|\/)/.test(v.trim());
      const untranslated = Object.keys(cs)
        .filter((k) => dict[k] !== undefined && String(cs[k]).length > 60
          && !isUrl(String(cs[k])) && dict[k] === cs[k]);
      expect(untranslated, `${name}.ts: nepřeložené dlouhé texty`).toEqual([]);
    }
  });
});
