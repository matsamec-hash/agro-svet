-- scripts/sql/article_translations.sql
-- Per-locale translations of public.articles. PK (article_id, locale).
-- Slug REUSES the cs slug (URL is /sk/novinky/<cs-slug>/) — column kept for
-- a future localized-slug option. Written by scripts/i18n-translate.py with the
-- service-role key (bypasses RLS); read by the site with the anon key.
create table if not exists public.article_translations (
  article_id       uuid not null references public.articles(id) on delete cascade,
  locale           text not null check (locale in ('sk','uk')),
  title            text,
  perex            text,
  content          text,
  seo_title        text,
  seo_description  text,
  slug             text,
  status           text not null default 'published',
  translated_at    timestamptz not null default now(),
  primary key (article_id, locale)
);

create index if not exists idx_article_translations_locale
  on public.article_translations (locale, status);

alter table public.article_translations enable row level security;

-- Anonymous read of published translations (mirrors the articles anon-read policy).
drop policy if exists "anon read published article_translations" on public.article_translations;
create policy "anon read published article_translations"
  on public.article_translations for select
  using (status = 'published');
