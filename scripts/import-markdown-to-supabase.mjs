#!/usr/bin/env node
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { marked } from 'marked';
import matter from 'gray-matter';

const SUPABASE_URL = 'https://obhypfuzmknvmknskdwh.supabase.co';
const SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;
const SITE_ID = 'cadc73fd-6bd9-4dc5-a0da-ea33725762e1';
const CONTENT_DIR = 'src/content/novinky';

if (!SERVICE_KEY) {
  console.error('Missing SUPABASE_SERVICE_KEY env var');
  process.exit(1);
}

const files = readdirSync(CONTENT_DIR).filter(f => f.endsWith('.md'));
console.log(`Importing ${files.length} articles…`);

for (const file of files) {
  const raw = readFileSync(join(CONTENT_DIR, file), 'utf8');
  const { data: fm, content: md } = matter(raw);
  const slug = file.replace(/\.md$/, '');
  const html = marked.parse(md);

  const row = {
    site_id: SITE_ID,
    title: fm.title,
    slug,
    perex: fm.description ?? '',
    content: html,
    featured_image_url: fm.heroImage ?? null,
    category: fm.category ?? null,
    tags: Array.isArray(fm.tags) ? fm.tags : [],
    status: 'published',
    author_type: 'manual',
    published_at: fm.publishDate instanceof Date ? fm.publishDate.toISOString() : new Date(fm.publishDate).toISOString(),
  };

  const res = await fetch(`${SUPABASE_URL}/rest/v1/articles`, {
    method: 'POST',
    headers: {
      'apikey': SERVICE_KEY,
      'Authorization': `Bearer ${SERVICE_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation,resolution=merge-duplicates',
      'on_conflict': 'site_id,slug',
    },
    body: JSON.stringify(row),
  });

  if (!res.ok) {
    const txt = await res.text();
    console.error(`❌ ${slug}: ${res.status} ${txt}`);
  } else {
    console.log(`✅ ${slug}`);
  }
}
