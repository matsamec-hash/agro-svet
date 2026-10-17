import { describe, it, expect } from 'vitest';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';

// Formulář /bazar/nahlasit/ musí sbírat náležitosti oznámení podle čl. 16
// odst. 2 DSA: URL, odůvodnění, jméno, e-mail a prohlášení o dobré víře.
// Hlídá se vyrenderované HTML (bez parametru ?listing= stránka nesahá do DB).

async function render(search = ''): Promise<string> {
  const page = await import('../../src/pages/bazar/nahlasit.astro');
  const container = await AstroContainer.create();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return container.renderToString(page.default as any, {
    request: new Request(`https://agro-svet.cz/bazar/nahlasit/${search}`),
    locals: { locale: 'cs' },
  } as any);
}

/** Atributy jednoho prvku podle id (hrubě, stačí na kontrolu required apod.). */
function tagById(html: string, id: string): string {
  const m = html.match(new RegExp(`<(?:input|textarea|select)[^>]*\\bid="${id}"[^>]*>`));
  expect(m, `prvek #${id} ve formuláři chybí`).not.toBeNull();
  return m![0];
}

describe('/bazar/nahlasit/ — formulář podle čl. 16 odst. 2 DSA', () => {
  it('má povinná pole URL, odůvodnění, jméno, e-mail a dobrou víru', async () => {
    const html = await render();
    expect(tagById(html, 'listing_id')).toMatch(/\brequired\b/);
    const desc = tagById(html, 'description');
    expect(desc).toMatch(/\brequired\b/);
    expect(desc).toMatch(/minlength="20"/);
    expect(tagById(html, 'reporter_name')).toMatch(/\brequired\b/);
    const email = tagById(html, 'reporter_email');
    expect(email).toMatch(/\brequired\b/);
    expect(email).toMatch(/type="email"/);
    const gf = tagById(html, 'good_faith');
    expect(gf).toMatch(/type="checkbox"/);
    expect(gf).toMatch(/\brequired\b/);
    expect(html).toContain('Prohlašuji v dobré víře, že informace a tvrzení v tomto oznámení jsou přesné a úplné.');
  });

  it('nabízí důvod pro trestné činy podle směrnice 2011/93/EU', async () => {
    const html = await render();
    expect(html).toContain('value="zneuzivani-deti"');
    expect(html).toContain('data-csam-reason="zneuzivani-deti"');
  });

  it('po odeslání ukáže číslo oznámení a slíbí potvrzení', async () => {
    const id = '11111111-2222-4333-8444-555555555555';
    const html = await render(`?ok=1&id=${id}&potvrzeni=1`);
    expect(html).toContain(id);
    expect(html).toContain('Potvrzení o přijetí vám pošleme na uvedený e-mail');
    expect(html).not.toContain('id="report-form"');
  });

  it('číslo oznámení z URL nepropustí, když to není UUID', async () => {
    const html = await render('?ok=1&id=%3Cscript%3Ex');
    expect(html).not.toContain('<script>x');
    expect(html).not.toContain('Číslo oznámení');
  });
});
