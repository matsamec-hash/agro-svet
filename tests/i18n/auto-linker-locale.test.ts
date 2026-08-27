import { describe, it, expect } from 'vitest';
import { injectLinksInText } from '../../src/lib/auto-linker';
import { getSlovnik } from '../../src/lib/slovnik';

// PROČ: glosář auto-linkeru se stavěl jen z ČESKÝCH termínů, zatímco `locale`
// ovlivňoval pouze prefix vygenerované URL. Na /sk, /pl a /uk stránkách se tedy
// nemělo co potkat — ukrajinská věta neobsahuje české slovo — a linker tam
// prakticky nelinkoval (na /uk/plodiny/psenice-ozima/ 1 odkaz proti 9 na cs).
describe('auto-linker používá termíny cílového jazyka', () => {
  for (const locale of ['cs', 'sk', 'pl', 'uk'] as const) {
    it(`${locale}: termín z ${locale} slovníku se prolinkuje na ${locale} URL`, () => {
      const cs = new Map(getSlovnik('cs').map((t) => [t.slug, t.term]));
      // ‼️ Termín musí být JINÝ než český — jinak by test prošel i se starým
      // glosářem (cs termíny + jen lokalizovaná URL) a nic by nedokazoval.
      // „AdBlue" nebo „ISOBUS" jsou napříč jazyky shodné, ty by test uspaly.
      const term = getSlovnik(locale).find((t) =>
        t.term.length >= 6 && !/\d/.test(t.term) && (locale === 'cs' || t.term !== cs.get(t.slug)));
      expect(term, `${locale}: slovník nemá termín odlišný od češtiny`).toBeTruthy();

      const html = injectLinksInText(`Text obsahuje ${term!.term} uprostřed věty.`, '/nekde/', locale);
      const prefix = locale === 'cs' ? '' : `/${locale}`;
      expect(html).toContain(`href="${prefix}/slovnik/${term!.slug}/"`);
    });
  }

  it('cizojazyčný termín se NEprolinkuje v jiné locale (jinak by cache tekla)', () => {
    const uk = getSlovnik('uk').find((t) => /[Ѐ-ӿ]/.test(t.term))!;
    const cs = injectLinksInText(`Text obsahuje ${uk.term} uprostřed věty.`, '/nekde/', 'cs');
    expect(cs).not.toContain('/slovnik/');
  });
});
