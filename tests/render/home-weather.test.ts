import { describe, it, expect, vi } from 'vitest';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { locales } from '../../src/i18n/config';

// Atribuce MET Norway (CC BY 4.0: zdroj, odkaz na licenci, „upraveno") musí
// být pod každým widgetem počasí v jazyce stránky. Úkol 09db5c97.

vi.setConfig({ testTimeout: 20_000 });

const LABEL: Record<string, string> = {
  cs: 'Data o počasí',
  sk: 'Údaje o počasí',
  pl: 'Dane pogodowe',
  uk: 'Дані про погоду',
  de: 'Wetterdaten',
};

async function render(locale: string, mode: 'strip' | 'puda' | 'commodity'): Promise<string> {
  const comp = await import('../../src/components/HomeWeather.astro');
  const container = await AstroContainer.create();
  const prefix = locale === 'cs' ? '' : `/${locale}`;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return container.renderToString(comp.default as any, {
    props: { mode },
    locals: { locale },
    request: new Request(`https://agro-svet.cz${prefix}/`),
  } as any);
}

describe('HomeWeather — atribuce MET Norway', () => {
  for (const l of locales) {
    for (const mode of ['strip', 'puda', 'commodity'] as const) {
      it(`${l} / ${mode}`, async () => {
        const html = await render(l, mode);
        const attr = html.match(/<p class="aw-attr"[^>]*>([\s\S]*?)<\/p>/);
        expect(attr, 'chybí patička s atribucí').not.toBeNull();
        expect(attr![1]).toContain(`${LABEL[l]}:`);
        expect(attr![1]).toMatch(/href="https:\/\/api\.met\.no\/"[^>]*>MET Norway</);
        expect(attr![1]).toMatch(/href="https:\/\/creativecommons\.org\/licenses\/by\/4\.0\/"[^>]*>CC BY 4\.0</);
        // atribuce je POD obsahem widgetu (poslední prvek sekce)
        expect(html).toMatch(/<p class="aw-attr"[\s\S]*?<\/p>\s*<\/section>/);
        expect(html).not.toMatch(/open-meteo/i);
      });
    }
  }
});
