import { describe, it, expect } from 'vitest';
import { comparisonInsights as csNew } from '../../src/lib/comparison-insights';
import type { StrojFlatModel } from '../../src/lib/stroje';

function mk(o: Partial<StrojFlatModel> & { name: string; brand_slug: string }): StrojFlatModel {
  return {
    slug: o.slug ?? o.name.toLowerCase().replace(/\s+/g, '-'),
    name: o.name,
    year_from: o.year_from ?? 2015,
    year_to: o.year_to ?? null,
    power_hp: o.power_hp ?? 150,
    power_kw: o.power_kw ?? null,
    engine: o.engine,
    transmission: o.transmission,
    weight_kg: o.weight_kg ?? null,
    brand_slug: o.brand_slug,
    brand_name: o.brand_name ?? o.brand_slug,
    category: o.category ?? 'traktory',
    effective_category: o.effective_category ?? o.category ?? 'traktory',
    series_slug: o.series_slug ?? 'series',
    series_name: o.series_name ?? 'Series',
  } as StrojFlatModel;
}

// Matrix covering every branch: stronger/equal hp, lighter, newer/same year,
// engine/transmission combos, brand-pref fallback (mapped + unmapped brand),
// year-diff plural boundaries (1/3/7), null power, traktory + kombajny.
const PAIRS: [StrojFlatModel, StrojFlatModel][] = [
  [mk({ name: '900 Vario', brand_slug: 'fendt', brand_name: 'Fendt', power_hp: 296, power_kw: 218, weight_kg: 11500, year_from: 2017, engine: 'MAN D26 6válec', transmission: 'Vario CVT' }),
   mk({ name: '8R 280', brand_slug: 'john-deere', brand_name: 'John Deere', power_hp: 280, power_kw: 206, weight_kg: 12100, year_from: 2014, engine: 'JD PSS 6válec', transmission: 'e23 PowerShift' })],
  // equal hp traktory
  [mk({ name: 'Puma 150', brand_slug: 'case-ih', brand_name: 'Case IH', power_hp: 150, power_kw: 110, year_from: 2016 }),
   mk({ name: 'T6.150', brand_slug: 'new-holland', brand_name: 'New Holland', power_hp: 150, power_kw: 110, year_from: 2016 })],
  // kombajny, stronger B, weight diff
  [mk({ name: 'Lexion 5300', brand_slug: 'claas', brand_name: 'Claas', category: 'kombajny', power_hp: 313, weight_kg: 13000, year_from: 2019 }),
   mk({ name: 'S790', brand_slug: 'john-deere', brand_name: 'John Deere', category: 'kombajny', power_hp: 543, weight_kg: 17000, year_from: 2018 })],
  // fallback decision: equal hp, no weight, same year; mapped (zetor) vs unmapped (horsch)
  [mk({ name: 'Forterra 135', brand_slug: 'zetor', brand_name: 'Zetor', power_hp: 136, year_from: 2018 }),
   mk({ name: 'Leeb 8', brand_slug: 'horsch', brand_name: 'Horsch', power_hp: 136, year_from: 2018 })],
  // year diff = 1 (rok)
  [mk({ name: 'A', brand_slug: 'valtra', brand_name: 'Valtra', power_hp: 200, year_from: 2016 }),
   mk({ name: 'B', brand_slug: 'deutz-fahr', brand_name: 'Deutz-Fahr', power_hp: 180, year_from: 2015 })],
  // year diff = 7 (let/rokov), only one engine, only one transmission
  [mk({ name: 'C', brand_slug: 'massey-ferguson', brand_name: 'Massey Ferguson', power_hp: 120, year_from: 2021, engine: 'AGCO Power 4válec' }),
   mk({ name: 'D', brand_slug: 'kubota', brand_name: 'Kubota', power_hp: 95, year_from: 2014, transmission: 'Powershift' })],
  // weight diff < 200 (no lighter clause), traktory small
  [mk({ name: 'E', brand_slug: 'fendt', brand_name: 'Fendt', power_hp: 45, weight_kg: 2400, year_from: 2015 }),
   mk({ name: 'F', brand_slug: 'kubota', brand_name: 'Kubota', power_hp: 45, weight_kg: 2300, year_from: 2015 })],
  // null power on one → tldr fallback
  [mk({ name: 'G', brand_slug: 'zetor', brand_name: 'Zetor', power_hp: null, year_from: 2010 }),
   mk({ name: 'H', brand_slug: 'claas', brand_name: 'Claas', power_hp: 130, year_from: 2012 })],
  // big kombajny, year diff 3 (roky), both transmissions differ
  [mk({ name: 'I', brand_slug: 'claas', brand_name: 'Claas', category: 'kombajny', power_hp: 790, year_from: 2020, transmission: 'CMATIC' }),
   mk({ name: 'J', brand_slug: 'new-holland', brand_name: 'New Holland', category: 'kombajny', power_hp: 490, year_from: 2017, transmission: 'IntelliCruise' })],
];

// cs output is pinned to a snapshot captured from the pre-i18n original
// (proven identical at refactor time across the full branch matrix). Any future
// drift in the cs branch fails here. Regenerate intentionally with `vitest -u`.
const norm = (a: StrojFlatModel, b: StrojFlatModel) => {
  const r = csNew(a, b, 'cs');
  return { tldr: r.tldr, shortDescription: r.shortDescription, decisionA: r.decisionA, decisionB: r.decisionB, faqs: r.faqs };
};

describe('comparisonInsights — cs output is stable (byte-identity guard)', () => {
  it('pair 0 (fendt 900 vs JD 8R, full diffs)', () => {
    expect(norm(PAIRS[0][0], PAIRS[0][1])).toMatchInlineSnapshot(`
      {
        "decisionA": "Vyber Fendt 900 Vario pokud potřebuješ vyšší výkon (296 k) než nabízí John Deere, a zároveň hraje pro tebe roli nižší hmotnost (méně utužování půdy, lepší manévrovatelnost), a zároveň chceš novější konstrukci (uvedení 2017) — typicky modernější elektronika, ISOBUS, emisní stupeň Stage V.",
        "decisionB": "Vyber John Deere 8R 280 pokud jsi velkovýroba nad 500 hektarů a chceš maximum z denní produktivity, a zároveň preferuješ amerického giganta John Deere.",
        "faqs": [
          {
            "a": "Výkonnější je Fendt 900 Vario s 296 k oproti 280 k u John Deere 8R 280, rozdíl tedy činí 16 k (přibližně 6 %).",
            "q": "Co je výkonnější — Fendt 900 Vario nebo John Deere 8R 280?",
          },
          {
            "a": "Fendt 900 Vario pohání motor MAN D26 6válec. John Deere 8R 280 motor JD PSS 6válec. Převodovka: Fendt 900 Vario — Vario CVT, John Deere 8R 280 — e23 PowerShift.",
            "q": "Jaký mají motor a převodovku?",
          },
          {
            "a": "Lehčí je Fendt 900 Vario s hmotností 11 500 kg oproti 12 100 kg, rozdíl 600 kg. Nižší hmotnost znamená menší utužování půdy a lepší manévrovatelnost, ale typicky i nižší tažnou sílu.",
            "q": "Který traktor je lehčí?",
          },
          {
            "a": "Fendt 900 Vario: Vlajkový traktor pro velkovýrobu s výměrou nad 500 hektarů. Určen pro nejširší agregace, autonomní řízení a maximální denní produktivitu na poli. John Deere 8R 280: Vlajkový traktor pro velkovýrobu s výměrou nad 500 hektarů. Určen pro nejširší agregace, autonomní řízení a maximální denní produktivitu na poli.",
            "q": "Pro jakou velikost farmy se Fendt 900 Vario a John Deere 8R 280 hodí?",
          },
          {
            "a": "Novější je Fendt 900 Vario uvedený v roce 2017 (oproti 2014). Rozdíl 3 roky typicky znamená modernější emisní stupeň, lepší elektroniku a aktuálnější ISOBUS implementaci.",
            "q": "Který model je novější?",
          },
        ],
        "shortDescription": "Srovnání: Fendt 900 Vario vs John Deere 8R 280. Fendt 900 Vario má +16 k. Motor, převodovka, hmotnost, roky výroby a FAQ vedle sebe.",
        "tldr": "Fendt 900 Vario má vyšší výkon o 16 k (296 vs 280 k, +6 %). Fendt 900 Vario je lehčí o 600 kg. Fendt 900 Vario je novější (uveden 2017).",
      }
    `);
  });
  it('pair 1 (equal hp traktory)', () => {
    expect(norm(PAIRS[1][0], PAIRS[1][1])).toMatchInlineSnapshot(`
      {
        "decisionA": "Vyber Case IH Puma 150 pokud máš střední farmu 100–300 hektarů pro orbu, secí kombinace a postřik, a zároveň preferuješ americkou značku Case IH (koncern CNH).",
        "decisionB": "Vyber New Holland T6.150 pokud máš střední farmu 100–300 hektarů pro orbu, secí kombinace a postřik, a zároveň preferuješ evropskou značku New Holland (koncern CNH).",
        "faqs": [
          {
            "a": "Oba traktory mají shodný výkon 150 k (110 kW). Rozhodující rozdíl je tedy v dalších parametrech — motoru, převodovce a hmotnosti.",
            "q": "Jaký výkon mají Case IH Puma 150 a New Holland T6.150?",
          },
          {
            "a": "Case IH Puma 150: Středně výkonný traktor pro farmy s výměrou 100–300 hektarů. Optimální pro orbu, secí kombinace, polní postřik a lisování. New Holland T6.150: Středně výkonný traktor pro farmy s výměrou 100–300 hektarů. Optimální pro orbu, secí kombinace, polní postřik a lisování.",
            "q": "Pro jakou velikost farmy se Case IH Puma 150 a New Holland T6.150 hodí?",
          },
          {
            "a": "Oba modely byly uvedeny v roce 2016, jde tedy o současníky stejné generace techniky.",
            "q": "Kdy byly Case IH Puma 150 a New Holland T6.150 uvedeny na trh?",
          },
        ],
        "shortDescription": "Srovnání Case IH Puma 150 a New Holland T6.150: výkon, motor, převodovka, hmotnost, FAQ a vhodné použití.",
        "tldr": "Oba traktory mají stejný výkon 150 k.",
      }
    `);
  });
  it('pair 2 (kombajny, stronger B)', () => {
    expect(norm(PAIRS[2][0], PAIRS[2][1])).toMatchInlineSnapshot(`
      {
        "decisionA": "Vyber Claas Lexion 5300 pokud hraje pro tebe roli nižší hmotnost (méně utužování půdy, lepší manévrovatelnost).",
        "decisionB": "Vyber John Deere S790 pokud potřebuješ vyšší výkon (543 k) než nabízí Claas.",
        "faqs": [
          {
            "a": "Výkonnější je John Deere S790 s 543 k oproti 313 k u Claas Lexion 5300, rozdíl tedy činí 230 k (přibližně 42 %).",
            "q": "Co je výkonnější — Claas Lexion 5300 nebo John Deere S790?",
          },
          {
            "a": "Lehčí je Claas Lexion 5300 s hmotností 13 000 kg oproti 17 000 kg, rozdíl 4 000 kg. Nižší hmotnost znamená menší utužování půdy a lepší manévrovatelnost, ale typicky i nižší tažnou sílu.",
            "q": "Který kombajn je lehčí?",
          },
          {
            "a": "Claas Lexion 5300: Středně výkonná sklízecí mlátička pro farmy s plochou obilnin 200–500 hektarů. Záběr 6–9 m, kapacita zásobníku obvykle 8 000–10 000 l. John Deere S790: Výkonná sklízecí mlátička pro velké farmy s plochou obilnin nad 500 hektarů. Záběr 9–12 m, kapacita zásobníku 10 000–14 000 l.",
            "q": "Pro jakou velikost farmy se Claas Lexion 5300 a John Deere S790 hodí?",
          },
          {
            "a": "Novější je Claas Lexion 5300 uvedený v roce 2019 (oproti 2018). Rozdíl 1 rok typicky znamená modernější emisní stupeň, lepší elektroniku a aktuálnější ISOBUS implementaci.",
            "q": "Který model je novější?",
          },
        ],
        "shortDescription": "Srovnání: Claas Lexion 5300 vs John Deere S790. John Deere S790 má +230 k. Motor, převodovka, hmotnost, roky výroby a FAQ vedle sebe.",
        "tldr": "John Deere S790 má vyšší výkon o 230 k (543 vs 313 k, +42 %). Claas Lexion 5300 je lehčí o 4 000 kg.",
      }
    `);
  });
  it('pair 3 (fallback decision, mapped + unmapped brand)', () => {
    expect(norm(PAIRS[3][0], PAIRS[3][1])).toMatchInlineSnapshot(`
      {
        "decisionA": "Vyber Zetor Forterra 135 pokud máš střední farmu 100–300 hektarů pro orbu, secí kombinace a postřik, a zároveň preferuješ českou značku Zetor z Brna.",
        "decisionB": "Vyber Horsch Leeb 8 pokud máš střední farmu 100–300 hektarů pro orbu, secí kombinace a postřik, a zároveň preferuješ značku Horsch.",
        "faqs": [
          {
            "a": "Oba traktory mají shodný výkon 136 k (101 kW). Rozhodující rozdíl je tedy v dalších parametrech — motoru, převodovce a hmotnosti.",
            "q": "Jaký výkon mají Zetor Forterra 135 a Horsch Leeb 8?",
          },
          {
            "a": "Zetor Forterra 135: Středně výkonný traktor pro farmy s výměrou 100–300 hektarů. Optimální pro orbu, secí kombinace, polní postřik a lisování. Horsch Leeb 8: Středně výkonný traktor pro farmy s výměrou 100–300 hektarů. Optimální pro orbu, secí kombinace, polní postřik a lisování.",
            "q": "Pro jakou velikost farmy se Zetor Forterra 135 a Horsch Leeb 8 hodí?",
          },
          {
            "a": "Oba modely byly uvedeny v roce 2018, jde tedy o současníky stejné generace techniky.",
            "q": "Kdy byly Zetor Forterra 135 a Horsch Leeb 8 uvedeny na trh?",
          },
        ],
        "shortDescription": "Srovnání Zetor Forterra 135 a Horsch Leeb 8: výkon, motor, převodovka, hmotnost, FAQ a vhodné použití.",
        "tldr": "Oba traktory mají stejný výkon 136 k.",
      }
    `);
  });
  it('pair 4 (year diff 1 = rok)', () => {
    expect(norm(PAIRS[4][0], PAIRS[4][1])).toMatchInlineSnapshot(`
      {
        "decisionA": "Vyber Valtra A pokud potřebuješ vyšší výkon (200 k) než nabízí Deutz-Fahr.",
        "decisionB": "Vyber Deutz-Fahr B pokud máš velkou farmu 300–600 hektarů a chceš tahat široké secí kombinace nebo samochodné postřikovače, a zároveň preferuješ německou značku Deutz-Fahr (koncern SDF).",
        "faqs": [
          {
            "a": "Výkonnější je Valtra A s 200 k oproti 180 k u Deutz-Fahr B, rozdíl tedy činí 20 k (přibližně 11 %).",
            "q": "Co je výkonnější — Valtra A nebo Deutz-Fahr B?",
          },
          {
            "a": "Valtra A: Výkonný traktor pro velké farmy s výměrou 300–600 hektarů. Plný potenciál uplatní u širokých secích kombinací, kypřičů a samochodných postřikovačů. Deutz-Fahr B: Výkonný traktor pro velké farmy s výměrou 300–600 hektarů. Plný potenciál uplatní u širokých secích kombinací, kypřičů a samochodných postřikovačů.",
            "q": "Pro jakou velikost farmy se Valtra A a Deutz-Fahr B hodí?",
          },
          {
            "a": "Novější je Valtra A uvedený v roce 2016 (oproti 2015). Rozdíl 1 rok typicky znamená modernější emisní stupeň, lepší elektroniku a aktuálnější ISOBUS implementaci.",
            "q": "Který model je novější?",
          },
        ],
        "shortDescription": "Srovnání: Valtra A vs Deutz-Fahr B. Valtra A má +20 k. Motor, převodovka, hmotnost, roky výroby a FAQ vedle sebe.",
        "tldr": "Valtra A má vyšší výkon o 20 k (200 vs 180 k, +11 %).",
      }
    `);
  });
  it('pair 5 (year diff 7 = let, single engine/transmission)', () => {
    expect(norm(PAIRS[5][0], PAIRS[5][1])).toMatchInlineSnapshot(`
      {
        "decisionA": "Vyber Massey Ferguson C pokud potřebuješ vyšší výkon (120 k) než nabízí Kubota, a zároveň chceš novější konstrukci (uvedení 2021) — typicky modernější elektronika, ISOBUS, emisní stupeň Stage V.",
        "decisionB": "Vyber Kubota D pokud máš střední farmu 100–300 hektarů pro orbu, secí kombinace a postřik, a zároveň preferuješ japonskou značku Kubota.",
        "faqs": [
          {
            "a": "Výkonnější je Massey Ferguson C s 120 k oproti 95 k u Kubota D, rozdíl tedy činí 25 k (přibližně 26 %).",
            "q": "Co je výkonnější — Massey Ferguson C nebo Kubota D?",
          },
          {
            "a": "Massey Ferguson C pohání motor AGCO Power 4válec. Převodovka: Powershift.",
            "q": "Jaký mají motor a převodovku?",
          },
          {
            "a": "Massey Ferguson C: Středně výkonný traktor pro farmy s výměrou 100–300 hektarů. Optimální pro orbu, secí kombinace, polní postřik a lisování. Kubota D: Středně výkonný traktor pro farmy s výměrou 100–300 hektarů. Optimální pro orbu, secí kombinace, polní postřik a lisování.",
            "q": "Pro jakou velikost farmy se Massey Ferguson C a Kubota D hodí?",
          },
          {
            "a": "Novější je Massey Ferguson C uvedený v roce 2021 (oproti 2014). Rozdíl 7 let typicky znamená modernější emisní stupeň, lepší elektroniku a aktuálnější ISOBUS implementaci.",
            "q": "Který model je novější?",
          },
        ],
        "shortDescription": "Srovnání: Massey Ferguson C vs Kubota D. Massey Ferguson C má +25 k. Motor, převodovka, hmotnost, roky výroby a FAQ vedle sebe.",
        "tldr": "Massey Ferguson C má vyšší výkon o 25 k (120 vs 95 k, +26 %). Massey Ferguson C je novější (uveden 2021).",
      }
    `);
  });
  it('pair 6 (weight diff < 200)', () => {
    expect(norm(PAIRS[6][0], PAIRS[6][1])).toMatchInlineSnapshot(`
      {
        "decisionA": "Vyber Fendt E pokud máš malé hospodářství do cca 30 hektarů (sady, vinice, komunální využití), a zároveň preferuješ německou prémiovou značku Fendt.",
        "decisionB": "Vyber Kubota F pokud máš malé hospodářství do cca 30 hektarů (sady, vinice, komunální využití), a zároveň preferuješ japonskou značku Kubota.",
        "faqs": [
          {
            "a": "Oba traktory mají shodný výkon 45 k (34 kW). Rozhodující rozdíl je tedy v dalších parametrech — motoru, převodovce a hmotnosti.",
            "q": "Jaký výkon mají Fendt E a Kubota F?",
          },
          {
            "a": "Lehčí je Kubota F s hmotností 2 300 kg oproti 2 400 kg, rozdíl 100 kg. Nižší hmotnost znamená menší utužování půdy a lepší manévrovatelnost, ale typicky i nižší tažnou sílu.",
            "q": "Který traktor je lehčí?",
          },
          {
            "a": "Fendt E: Kompaktní traktor pro malé hospodářství, sady, vinice a komunální využití. Vhodný pro výměru do přibližně 30 hektarů. Kubota F: Kompaktní traktor pro malé hospodářství, sady, vinice a komunální využití. Vhodný pro výměru do přibližně 30 hektarů.",
            "q": "Pro jakou velikost farmy se Fendt E a Kubota F hodí?",
          },
          {
            "a": "Oba modely byly uvedeny v roce 2015, jde tedy o současníky stejné generace techniky.",
            "q": "Kdy byly Fendt E a Kubota F uvedeny na trh?",
          },
        ],
        "shortDescription": "Srovnání Fendt E a Kubota F: výkon, motor, převodovka, hmotnost, FAQ a vhodné použití.",
        "tldr": "Oba traktory mají stejný výkon 45 k. Kubota F je lehčí o 100 kg.",
      }
    `);
  });
  it('pair 7 (null power on one)', () => {
    expect(norm(PAIRS[7][0], PAIRS[7][1])).toMatchInlineSnapshot(`
      {
        "decisionA": "Vyber Zetor G pokud potřebuješ vyšší výkon (150 k) než nabízí Claas.",
        "decisionB": "Vyber Claas H pokud chceš novější konstrukci (uvedení 2012) — typicky modernější elektronika, ISOBUS, emisní stupeň Stage V.",
        "faqs": [
          {
            "a": "Výkonnější je Zetor G s 150 k oproti 130 k u Claas H, rozdíl tedy činí 20 k (přibližně 15 %).",
            "q": "Co je výkonnější — Zetor G nebo Claas H?",
          },
          {
            "a": "Zetor G: Středně výkonný traktor pro farmy s výměrou 100–300 hektarů. Optimální pro orbu, secí kombinace, polní postřik a lisování. Claas H: Středně výkonný traktor pro farmy s výměrou 100–300 hektarů. Optimální pro orbu, secí kombinace, polní postřik a lisování.",
            "q": "Pro jakou velikost farmy se Zetor G a Claas H hodí?",
          },
          {
            "a": "Novější je Claas H uvedený v roce 2012 (oproti 2010). Rozdíl 2 roky typicky znamená modernější emisní stupeň, lepší elektroniku a aktuálnější ISOBUS implementaci.",
            "q": "Který model je novější?",
          },
        ],
        "shortDescription": "Srovnání: Zetor G vs Claas H. Zetor G má +20 k. Motor, převodovka, hmotnost, roky výroby a FAQ vedle sebe.",
        "tldr": "Zetor G má vyšší výkon o 20 k (150 vs 130 k, +15 %). Claas H je novější (uveden 2012).",
      }
    `);
  });
  it('pair 8 (big kombajny, year diff 3 = roky)', () => {
    expect(norm(PAIRS[8][0], PAIRS[8][1])).toMatchInlineSnapshot(`
      {
        "decisionA": "Vyber Claas I pokud potřebuješ vyšší výkon (790 k) než nabízí New Holland, a zároveň chceš novější konstrukci (uvedení 2020) — typicky modernější elektronika, ISOBUS, emisní stupeň Stage V.",
        "decisionB": "Vyber New Holland J pokud sklízíš přes 500 ha obilnin a chceš záběr 9–12 m, a zároveň preferuješ evropskou značku New Holland (koncern CNH).",
        "faqs": [
          {
            "a": "Výkonnější je Claas I s 790 k oproti 490 k u New Holland J, rozdíl tedy činí 300 k (přibližně 61 %).",
            "q": "Co je výkonnější — Claas I nebo New Holland J?",
          },
          {
            "a": "Převodovka: Claas I — CMATIC, New Holland J — IntelliCruise.",
            "q": "Jaký mají motor a převodovku?",
          },
          {
            "a": "Claas I: Vlajková sklízecí mlátička pro velkovýrobu — největší záběry (12 m+), zásobník 14 000+ l, určeno pro nejvyšší denní produktivitu na rozsáhlých polích. New Holland J: Výkonná sklízecí mlátička pro velké farmy s plochou obilnin nad 500 hektarů. Záběr 9–12 m, kapacita zásobníku 10 000–14 000 l.",
            "q": "Pro jakou velikost farmy se Claas I a New Holland J hodí?",
          },
          {
            "a": "Novější je Claas I uvedený v roce 2020 (oproti 2017). Rozdíl 3 roky typicky znamená modernější emisní stupeň, lepší elektroniku a aktuálnější ISOBUS implementaci.",
            "q": "Který model je novější?",
          },
        ],
        "shortDescription": "Srovnání: Claas I vs New Holland J. Claas I má +300 k. Motor, převodovka, hmotnost, roky výroby a FAQ vedle sebe.",
        "tldr": "Claas I má vyšší výkon o 300 k (790 vs 490 k, +61 %). Claas I je novější (uveden 2020).",
      }
    `);
  });
});

describe('comparisonInsights — uk variant je ukrajinština', () => {
  it('uk tldr obsahuje cyrilici a zachovává názvy modelů', () => {
    const a = { brand_slug: 'fendt', brand_name: 'Fendt', name: '942', power_hp: 415, category: 'traktory' } as any;
    const b = { brand_slug: 'john-deere', brand_name: 'John Deere', name: '8R 410', power_hp: 410, category: 'traktory' } as any;
    const out = csNew(a, b, 'uk');
    expect(out.tldr).toMatch(/[Ѐ-ӿ]/);
    expect(out.tldr).toContain('Fendt');
  });
});

describe('comparisonInsights — sk variant is Slovak and fact-preserving', () => {
  it.each(PAIRS.map((p, i) => [i, p[0], p[1]] as const))(
    'pair %i produces SK output with preserved facts',
    (_i, a, b) => {
      const cs = csNew(a, b, 'cs');
      const skR = csNew(a, b, 'sk');
      const blob = [skR.tldr, skR.shortDescription, skR.decisionA, skR.decisionB, ...skR.faqs.flatMap((f) => [f.q, f.a])].join(' ');
      // No leftover Czech-only orthography that SK never uses in our templates.
      expect(blob).not.toMatch(/převodovk|srovnán|hmotnost\b|lehčí|výkonnější|nabízí|stejn/);
      // Same number of FAQs and same structure as cs.
      expect(skR.faqs.length).toBe(cs.faqs.length);
      // Numeric facts (hp) survive translation.
      if (a.power_hp !== null && b.power_hp !== null && a.power_hp !== b.power_hp) {
        const hi = Math.max(a.power_hp, b.power_hp);
        expect(blob).toContain(String(hi));
      }
    },
  );
});
