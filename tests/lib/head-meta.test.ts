import { describe, it, expect } from 'vitest';
import { pageTitle, absoluteUrl, metaDescription } from '../../src/lib/head-meta';

describe('pageTitle', () => {
  it('doplní brand, když si ho stránka nedala', () => {
    expect(pageTitle('Kombajny — katalog')).toBe('Kombajny — katalog | agro-svět.cz');
  });

  // GSC/SERP: Layout přidával brand i k titulkům, které končily „| agro-svět"
  // (bez .cz) → „… | agro-svět | agro-svět.cz". 16 titulků v src/i18n.
  it('nezdvojí brand, když titulek končí „| agro-svět" bez .cz', () => {
    expect(pageTitle('Ankety — hlasujte o zemědělské technice | agro-svět')).toBe(
      'Ankety — hlasujte o zemědělské technice | agro-svět.cz',
    );
  });

  it('nezdvojí brand ani při oddělení pomlčkou', () => {
    expect(pageTitle('Přehledy a roční bilance — agro-svět')).toBe(
      'Přehledy a roční bilance | agro-svět.cz',
    );
  });

  it('nezdvojí brand, když titulek končí plným „| agro-svět.cz"', () => {
    expect(pageTitle('Technika — agro-svět.cz')).toBe('Technika | agro-svět.cz');
  });

  it('sjednotí i trojnásobné zopakování brandu', () => {
    expect(pageTitle('Poradniki | agro-svět.cz | agro-svět.cz')).toBe('Poradniki | agro-svět.cz');
  });

  it('nechá titulek beze změny, když je brand součástí věty (homepage, redakce)', () => {
    expect(pageTitle('agro-svět.cz — zemědělská technika, bazar a novinky')).toBe(
      'agro-svět.cz — zemědělská technika, bazar a novinky',
    );
    expect(pageTitle('Redakce agro-svět.cz')).toBe('Redakce agro-svět.cz');
  });

  it('ošetří prázdný titulek', () => {
    expect(pageTitle('')).toBe('agro-svět.cz');
    expect(pageTitle('   ')).toBe('agro-svět.cz');
  });
});

describe('absoluteUrl', () => {
  // Stránky /historie/* předávaly canonical relativně → do <link rel=canonical>
  // i og:url šlo „/historie/" místo absolutní URL (og:url MUSÍ být absolutní).
  it('převede relativní cestu na absolutní', () => {
    expect(absoluteUrl('/historie/')).toBe('https://agro-svet.cz/historie/');
  });

  it('nechá absolutní URL beze změny', () => {
    expect(absoluteUrl('https://agro-svet.cz/historie/technika/')).toBe(
      'https://agro-svet.cz/historie/technika/',
    );
  });

  it('doplní koncové lomítko u cesty bez přípony', () => {
    expect(absoluteUrl('/historie/data')).toBe('https://agro-svet.cz/historie/data/');
  });

  it('nepřidá lomítko k souboru s příponou', () => {
    expect(absoluteUrl('/rss.xml')).toBe('https://agro-svet.cz/rss.xml');
  });
});

describe('metaDescription', () => {
  const long =
    'Přehled akcií firem navázaných na zemědělství — technika (John Deere, AGCO, CNH), agrochemie a osiva (Bayer, BASF, Corteva) i komodity. Profily a burzovní symboly. Není investiční doporučení.';

  it('nechá krátký popis beze změny', () => {
    const d = 'Krátký popis stránky do 160 znaků.';
    expect(metaDescription(d)).toBe(d);
  });

  it('nesahá na popis těsně pod hranicí (165 znaků)', () => {
    const d = 'a'.repeat(165);
    expect(metaDescription(d)).toBe(d);
  });

  it('zkrátí dlouhý popis na max 161 znaků (160 + výpustka)', () => {
    const out = metaDescription(long);
    expect(out.length).toBeLessThanOrEqual(161);
    expect(out.length).toBeGreaterThan(120);
  });

  it('nekončí uprostřed slova', () => {
    const out = metaDescription(long);
    const tail = out.replace(/[…]$/, '');
    expect(long.startsWith(tail)).toBe(true);
    expect(/[\s,;:–—-]$/.test(tail)).toBe(false);
  });

  it('preferuje konec věty před výpustkou, když je blízko limitu', () => {
    const d =
      'První věta nese hlavní sdělení celé stránky pro čtenáře i pro vyhledávač Google a je dost dlouhá na to, aby vyplnila skoro celý dostupný snippet. ' +
      'Druhá věta už je jen doplněk, který se do snippetu stejně nevejde a Google ho ořízne.';
    const out = metaDescription(d);
    expect(out.endsWith('.')).toBe(true);
    expect(out).not.toContain('…');
  });

  it('sjednotí zalomení řádků na mezery', () => {
    expect(metaDescription('První řádek.\n  Druhý   řádek.')).toBe('První řádek. Druhý řádek.');
  });

  it('ošetří prázdný vstup', () => {
    expect(metaDescription('')).toBe('');
  });
});

describe('metaDescription — využití místa ve snippetu', () => {
  // Dřív se u dvouvětého popisu vzal konec první věty (práh 0,6 × max), takže
  // ze 184 znaků zbylo 101 a zbytek snippetu zůstal prázdný.
  it('nezahodí druhou větu, když první končí daleko od limitu', () => {
    const d =
      'Deere & Company: kurz akcie, tržní kapitalizace, sídlo, ředitel, obrat a co firma dělá v zemědělství. ' +
      'Světová jednička v zemědělské technice — traktory, kombajny, precizní zemědělství.';
    const out = metaDescription(d);
    expect(out.length).toBeGreaterThan(140);
    expect(out).toContain('Světová jednička');
  });
});
