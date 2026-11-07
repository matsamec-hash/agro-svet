// tests/lib/seznam-feed.test.ts
// Pravidla Seznam Newsfeedu (vyvojari.seznam.cz/newsfeed/dokumentace/rss). Příklady
// jsou opravdové titulky a perexy z produkce k 7. 11. 2026, na kterých /rss.xml
// specifikaci nesplňoval.
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import {
  buildSeznamFeed,
  cleanFeedText,
  cropBox16x9,
  photoCreditLine,
  seznamDescription,
  seznamImageSource,
  seznamTitle,
} from '../../src/lib/seznam-feed';

describe('cleanFeedText', () => {
  it('vyhodí emotikony, šipky a HTML', () => {
    expect(cleanFeedText('Ceny nafty → <b>rostou</b> 🚜')).toBe('Ceny nafty rostou');
  });

  it('nechá běžnou typografii a čísla', () => {
    expect(cleanFeedText('Půda zdražila 3,6× o 12 % — „rekord“')).toBe('Půda zdražila 3,6× o 12 % — „rekord“');
  });
});

describe('seznamTitle', () => {
  it('titulek do 60 znaků nechá být', () => {
    expect(seznamTitle('Top 10 inovací v českém zemědělství 2026', 'Top inovace')).toBe(
      'Top 10 inovací v českém zemědělství 2026',
    );
  });

  it('u dlouhého titulku vezme seo_title, když se vejde', () => {
    expect(
      seznamTitle(
        'Claas Axion 8 CMATIC: nástupce Axionu 800 s výkonem až 313 k a kabinou z Axionu 9',
        'Claas Axion 8 CMATIC: až 313 k a kabina z Axionu 9',
      ),
    ).toBe('Claas Axion 8 CMATIC: až 313 k a kabina z Axionu 9');
  });

  it('jinak zkrátí na hranici věty za čárkou', () => {
    expect(
      seznamTitle(
        'Investice do zemědělství 2026: půda zdražila za 15 let 3,6×, pacht vynáší 1,2 %',
        'Investice do zemědělství 2026: půda, fondy, agro akcie a ETF v číslech',
      ),
    ).toBe('Investice do zemědělství 2026: půda zdražila za 15 let 3,6×');
  });

  it('závorka na konci jde pryč jako první', () => {
    expect(seznamTitle('Dotace 38.73: Investice do obnovy kalamitních ploch (8. kolo)')).toBe(
      'Dotace 38.73: Investice do obnovy kalamitních ploch',
    );
  });

  it('když čárka nepomůže, zkrátí na dvojtečce', () => {
    expect(
      seznamTitle('Startuje 8. kolo dotací ze Strategického plánu SZP: 2,4 miliardy pro potravináře, mladé zemědělce a lesníky'),
    ).toBe('Startuje 8. kolo dotací ze Strategického plánu SZP');
  });

  it('desetinná čárka není hranice věty', () => {
    const t = 'Agronafta se v příštím roce vrací na původních 21,48 centu na litr ve všech zemích';
    expect(seznamTitle(t)).toBe(t);
  });

  it('neusekne podmínku, bez které by titulek lhal', () => {
    const t = 'Německo zruší vratku daně z nafty pro všechny zemědělce, pokud nepřijde nový zákon o půdě';
    expect(seznamTitle(t)).toBe(t);
  });

  it('neusekne ani větu se „že“ a „když“ (slova s háčkem na konci)', () => {
    const t = 'Zemědělci v Česku letos dostanou o něco vyšší podporu, když splní nové podmínky ekoschémat';
    expect(seznamTitle(t)).toBe(t);
  });

  it('bez vhodné hranice vrátí celý titulek, ne useknuté slovo', () => {
    const t = 'Generace porevolučních farmářů v Česku odchází do důchodu a nikdo neví kdo převezme jejich podniky';
    expect(seznamTitle(t)).toBe(t);
  });
});

describe('seznamDescription', () => {
  it('skládá celé věty do 200 znaků', () => {
    expect(
      seznamDescription(
        'Průměrný hektar zemědělské půdy stál v Česku v roce 2025 podle Farmy.cz 372 550 Kč, 3,6× víc než v roce 2010. Pacht ale vynáší jen kolem 1,2 % ročně, méně než třetinu výnosu státního dluhopisu. Akcie agro firem se v roce 2026 rozdělily: výrobci dusíkatých hnojiv a techniky rostou, výrobci fosfátů a přípravků na ochranu rostlin ztrácejí.',
      ),
    ).toBe(
      'Průměrný hektar zemědělské půdy stál v Česku v roce 2025 podle Farmy.cz 372 550 Kč, 3,6× víc než v roce 2010. Pacht ale vynáší jen kolem 1,2 % ročně, méně než třetinu výnosu státního dluhopisu.',
    );
  });

  it('první věta zůstane celá, i když je delší než 200 znaků', () => {
    const veta =
      'Zhruba 400 zemědělských bioplynových stanic v Česku postupně přichází o dvacetiletou provozní podporu a stát je tlačí k výrobě biometanu, v jehož první aukci letos uspělo 11 projektů, přičemž další aukce se teprve chystají.';
    expect(veta.length).toBeGreaterThan(200);
    expect(seznamDescription(`${veta} Druhá věta.`)).toBe(veta);
  });

  it('zkratka „mil.“ před velkým písmenem větu nekončí', () => {
    const perex =
      'Mladí zemědělci mohou v 8. kole získat grant 1,5 mil. Kč (se zpracováním vlastní produkce až 2,03 mil. Kč) na rozjezd podnikání. Žádosti 13. října až 3. listopadu 2026.';
    expect(seznamDescription(perex)).toBe(perex);
  });

  it('nezačne novou větu uvnitř data ani čísla', () => {
    expect(seznamDescription('Lhůta běží od 5. 10. 2026 do konce roku.')).toBe('Lhůta běží od 5. 10. 2026 do konce roku.');
  });

  it('když se druhá věta nevejde, skončí po první', () => {
    expect(
      seznamDescription(
        'Německo podle předběžných oficiálních čísel sklidí 37,4 mil. t obilovin bez kukuřice, o 7,3 % méně než loni. V Rakousku je propad hlubší: Statistik Austria vykazuje 2,65 mil. t, o 16,4 % méně než v roce 2025.',
      ),
    ).toBe('Německo podle předběžných oficiálních čísel sklidí 37,4 mil. t obilovin bez kukuřice, o 7,3 % méně než loni.');
  });

  it('nedokončený konec zahodí', () => {
    expect(seznamDescription('První věta je hotová. Druhá věta skončila uprostřed…')).toBe('První věta je hotová.');
  });

  it('jediný úryvek bez tečky dokončí tečkou', () => {
    expect(seznamDescription('Intervence 38.73 hradí obnovu lesů:')).toBe('Intervence 38.73 hradí obnovu lesů.');
  });

  it('bez perexu vezme seo_description, bez obojího nic', () => {
    expect(seznamDescription(null, 'Popis z SEO pole.')).toBe('Popis z SEO pole.');
    expect(seznamDescription('  ', null)).toBe('');
  });

  it('vyhodí šipky a emotikony', () => {
    expect(seznamDescription('Ceny rostou 📈 → víc zaplatíte.')).toBe('Ceny rostou víc zaplatíte.');
  });
});

describe('cropBox16x9', () => {
  it('přesný poměr nechá celý', () => {
    expect(cropBox16x9(1600, 900)).toEqual({ left: 0, top: 0, width: 1600, height: 900 });
  });

  it('bez ohniska ořízne vysoký obrázek na střed', () => {
    expect(cropBox16x9(1600, 1000)).toEqual({ left: 0, top: 50, width: 1600, height: 900 });
  });

  it('respektuje ohnisko a nevyjede z obrázku', () => {
    expect(cropBox16x9(1600, 1000, { x: 50, y: 0 }).top).toBe(0);
    expect(cropBox16x9(1600, 1000, { x: 50, y: 100 }).top).toBe(100);
    expect(cropBox16x9(2000, 900, { x: 100, y: 50 })).toEqual({ left: 400, top: 0, width: 1600, height: 900 });
  });
});

describe('seznamImageSource', () => {
  it('pustí CDN a vlastní web, relativní cestu doplní', () => {
    expect(seznamImageSource('https://cdn.samecdigital.com/a__v-w1600.webp')).toBe('https://cdn.samecdigital.com/a__v-w1600.webp');
    expect(seznamImageSource('/images/novinky/a.jpg')).toBe('https://agro-svet.cz/images/novinky/a.jpg');
  });

  it('nepustí nic mimo seznam ani bez https', () => {
    for (const u of [
      'https://evil.example/a.jpg',
      'https://cdn.samecdigital.com.evil.example/a.jpg',
      'http://cdn.samecdigital.com/a.jpg',
      'http://169.254.169.254/latest/meta-data/',
      '//evil.example/a.jpg',
      'nesmysl:',
      '',
      null,
    ]) {
      expect(seznamImageSource(u), String(u)).toBeNull();
    }
  });
});

describe('zástupný obrázek', () => {
  // Logo webu místo fotky: Seznam obrázky s logem zakazuje, ale registr fotek ho zná.
  it('jako zdroj neprojde', () => {
    expect(seznamImageSource('https://agro-svet.cz/images/novinky/dotace-49-75.jpg')).toBeNull();
    expect(seznamImageSource('/images/novinky/dotace-49-75.jpg')).toBeNull();
  });
});

describe('photoCreditLine', () => {
  it('autor a licence', () => {
    expect(photoCreditLine({ author: 'Jan Novák', license: 'CC BY-SA 4.0' })).toBe('Foto: Jan Novák, CC BY-SA 4.0');
  });

  it('banka bez autora', () => {
    expect(photoCreditLine({ author: '', license: 'Pexels License' })).toBe('Foto: Pexels License');
  });

  it('bez kreditu nic', () => {
    expect(photoCreditLine(null)).toBe('');
    expect(photoCreditLine({ author: '', license: '' })).toBe('');
  });
});

describe('buildSeznamFeed', () => {
  const row = (i: number, extra: Record<string, unknown> = {}) => ({
    slug: `clanek-${i}`,
    title: `Titulek článku číslo ${i}`,
    seo_title: null,
    perex: `Perex článku číslo ${i} je celá věta.`,
    seo_description: null,
    published_at: '2026-10-27T11:10:24Z',
    category: 'technika',
    featured_image_url: 'https://cdn.samecdigital.com/a__v-w1600.webp',
    featured_image_credit: null,
    ...extra,
  });
  const items = (xml: string) => xml.match(/<item>[\s\S]*?<\/item>/g) ?? [];

  it('má maximálně 20 položek', () => {
    const xml = buildSeznamFeed(Array.from({ length: 30 }, (_, i) => row(i)));
    expect(items(xml)).toHaveLength(20);
    expect(xml).toContain('clanek-19');
    expect(xml).not.toContain('clanek-20');
  });

  it('deklaruje namespace media a odkazuje na feed samotný', () => {
    const xml = buildSeznamFeed([row(1)]);
    expect(xml).toContain('xmlns:media="http://search.yahoo.com/mrss/"');
    expect(xml).toContain('href="https://agro-svet.cz/rss-seznam.xml"');
    expect(xml).toContain('<language>cs-CZ</language>');
  });

  it('obrázek je JPG z vlastní cesty, žádný webp ani enclosure', () => {
    const xml = buildSeznamFeed([row(1)]);
    expect(xml).toContain('<media:content url="https://agro-svet.cz/rss-seznam/clanek-1.jpg" type="image/jpeg" medium="image" />');
    expect(xml).not.toContain('.webp');
    expect(xml).not.toContain('<enclosure');
  });

  it('kredit fotky jde do media:description', () => {
    const xml = buildSeznamFeed([
      row(1, { featured_image_credit: { provider: 'pexels', photographer_name: 'Jan Novák' } }),
    ]);
    expect(xml).toMatch(/<media:description type="text\/plain">Foto: Jan Novák, [^<]+<\/media:description>/);
  });

  it('článek bez obrázku položku má, jen bez media:content', () => {
    const xml = buildSeznamFeed([row(1, { featured_image_url: null })]);
    expect(items(xml)).toHaveLength(1);
    expect(xml).not.toContain('media:content');
  });

  it('položka neslibuje obrázek, který routa nevydá', () => {
    for (const featured_image_url of ['https://agro-svet.cz/images/novinky/dotace-49-75.jpg', 'https://evil.example/a.jpg']) {
      const xml = buildSeznamFeed([row(1, { featured_image_url })]);
      expect(items(xml), featured_image_url).toHaveLength(1);
      expect(xml, featured_image_url).not.toContain('media:');
    }
  });

  it('článek bez jediné věty do feedu nejde a místo uvolní dalšímu', () => {
    const rows = Array.from({ length: 21 }, (_, i) => row(i));
    rows[0] = row(0, { perex: null });
    const xml = buildSeznamFeed(rows);
    expect(items(xml)).toHaveLength(20);
    expect(xml).not.toContain('clanek-0/');
    expect(xml).toContain('clanek-20');
  });

  it('položka má odkaz, stálé guid a datum', () => {
    const [item] = items(buildSeznamFeed([row(1)]));
    expect(item).toContain('<link>https://agro-svet.cz/novinky/clanek-1/</link>');
    expect(item).toContain('<guid isPermaLink="true">https://agro-svet.cz/novinky/clanek-1/</guid>');
    expect(item).toContain('<pubDate>Tue, 27 Oct 2026 11:10:24 GMT</pubDate>');
    expect(item).toContain('<category>Technika</category>');
  });

  it('escapuje XML', () => {
    const xml = buildSeznamFeed([row(1, { title: 'Stroje & <nářadí>', perex: 'Věta s "uvozovkami" & ampersandem.' })]);
    expect(xml).toContain('<title>Stroje &amp;</title>');
    expect(xml).toContain('Věta s &quot;uvozovkami&quot; &amp; ampersandem.');
  });
});

describe('stránka článku', () => {
  it('nese stejný obrázek v <meta name="szn:image">, jen česky', () => {
    // ‼️ Seznam po prvním načtení aktualizuje článek z HTML a mezi zdroji v HTML
    // má szn:image přednost před JSON-LD i og:image. Bez něj by RSS JPG přebil webp.
    const page = fs.readFileSync(path.join(process.cwd(), 'src/pages/novinky/[slug].astro'), 'utf8');
    expect(page).toContain('name="szn:image"');
    expect(page).toContain('seznamImageUrl(article.slug)');
    expect(page).toMatch(/locale === 'cs' && seznamImageSource\(article\.featured_image_url\) && \(\s*<meta/);
  });
});
