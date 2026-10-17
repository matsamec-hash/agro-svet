import { describe, it, expect, vi } from 'vitest';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';

/**
 * /de/svet je zpět (2026-10-17): geometrie z Natural Earth místo GISCO
 * a historical-basemaps. Homepage pod de tak zase ukazuje náhled mapy Evropy
 * (ImageAccordion ho gatuje přes isLaunchedPath + isWithdrawnPath).
 */

vi.setConfig({ testTimeout: 60_000 });

describe('homepage — náhled mapy Evropy (Natural Earth)', () => {
  it('pod de se panel s mapou zase ukazuje a vede na /de/svet/mapa/', async () => {
    const ImageAccordion = (await import('../../src/components/ImageAccordion.astro')).default;
    const container = await AstroContainer.create();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const html = await container.renderToString(ImageAccordion as any, {
      locals: { locale: 'de' },
      request: new Request('https://agro-svet.cz/de/'),
    } as any);
    expect(html).toContain('/images/agrimap-wheat-yield.svg');
    expect(html).toContain('href="/de/svet/mapa/"');
  });
});
