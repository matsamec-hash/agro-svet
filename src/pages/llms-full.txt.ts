// /llms-full.txt — plný textový obsah encyklopedie + howto + dotace pro
// hloubkový AI crawl bez nutnosti procházet stovky HTML.

import type { APIRoute } from 'astro';
import { getCollection, render } from 'astro:content';
import { SITE_URL } from '../lib/config';

export const prerender = true;

function stripMd(s: string): string {
  return s
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/[*_`#>~]+/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

export const GET: APIRoute = async () => {
  const [encyklopedie, howto, dotace] = await Promise.all([
    getCollection('encyklopedie'),
    getCollection('howto'),
    getCollection('dotace'),
  ]);

  const sections: string[] = [];

  sections.push('# agro-svět.cz — plný textový obsah');
  sections.push('');
  sections.push(`Generováno automaticky pro AI crawlery. Index s odkazy: ${SITE_URL}/llms.txt`);
  sections.push('');

  // Encyklopedie — hloubkové profily modelů
  sections.push('## Encyklopedie strojů');
  sections.push('');
  for (const item of encyklopedie) {
    const { Content } = await render(item);
    sections.push(`### ${item.data.name}`);
    sections.push(`URL: ${SITE_URL}/encyklopedie/${item.id}/`);
    if (item.data.znacka) sections.push(`Značka: ${item.data.znacka}`);
    if (item.data.kategorie) sections.push(`Kategorie: ${item.data.kategorie}`);
    if (item.data.rok_uvedeni) sections.push(`Rok uvedení: ${item.data.rok_uvedeni}`);
    if (item.data.vykon) sections.push(`Výkon: ${item.data.vykon}`);
    if (item.data.hmotnost) sections.push(`Hmotnost: ${item.data.hmotnost}`);
    sections.push('');
    sections.push(item.data.popis);
    sections.push('');
    if (item.data.highlights?.length) {
      sections.push('Klíčové vlastnosti:');
      for (const h of item.data.highlights) sections.push(`- ${h}`);
      sections.push('');
    }
    if (item.data.faq?.length) {
      sections.push('FAQ:');
      for (const f of item.data.faq) {
        sections.push(`Q: ${f.q}`);
        sections.push(`A: ${f.a}`);
        sections.push('');
      }
    }
    sections.push('---');
    sections.push('');
  }

  // HowTo
  sections.push('## Praktické návody');
  sections.push('');
  for (const item of howto) {
    sections.push(`### ${item.data.title}`);
    sections.push(`URL: ${SITE_URL}/jak-na-to/${item.id}/`);
    sections.push('');
    sections.push(item.data.description);
    sections.push('');
    if (item.data.steps?.length) {
      sections.push('Kroky:');
      for (const [i, s] of item.data.steps.entries()) {
        sections.push(`${i + 1}. ${s.name}`);
        sections.push(`   ${s.text}`);
      }
      sections.push('');
    }
    sections.push('---');
    sections.push('');
  }

  // Dotace
  sections.push('## Dotace SZP 2023–2027');
  sections.push('');
  for (const item of dotace) {
    sections.push(`### ${item.data.name}`);
    sections.push(`URL: ${SITE_URL}/dotace/${item.id}/`);
    sections.push(`Intervence: ${item.data.intervence}`);
    if (item.data.zadatel) sections.push(`Žadatel: ${item.data.zadatel}`);
    sections.push('');
    sections.push(item.data.popis);
    sections.push('');
    if (item.data.highlights?.length) {
      for (const h of item.data.highlights) sections.push(`- ${h}`);
      sections.push('');
    }
    if (item.data.faq?.length) {
      sections.push('FAQ:');
      for (const f of item.data.faq) {
        sections.push(`Q: ${f.q}`);
        sections.push(`A: ${f.a}`);
        sections.push('');
      }
    }
    sections.push(`Zdroj: ${item.data.primarniZdroj}`);
    sections.push('---');
    sections.push('');
  }

  const body = stripMd(sections.join('\n'));

  return new Response(body, {
    status: 200,
    headers: {
      'content-type': 'text/plain; charset=utf-8',
      'cache-control': 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800',
    },
  });
};
