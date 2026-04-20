# Agro Bazar Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a full marketplace (Agro Bazar) on agro-svet.cz where users register, post listings for agricultural machinery/land/animals/services, and buyers contact sellers directly via displayed phone/email.

**Architecture:** Astro 6 SSR with `@astrojs/cloudflare` adapter. Existing static pages get `prerender: true`. Bazar pages are server-rendered. Supabase handles auth, database (PostgreSQL), and image storage. Shared Supabase project with zenazije — tables prefixed `bazar_`.

**Tech Stack:** Astro 6 SSR, @astrojs/cloudflare, @supabase/supabase-js, Supabase Auth + Storage + RLS, Tailwind CSS v4, TypeScript

---

## File Structure

```
src/
├── lib/
│   ├── supabase.ts              # Server-side Supabase client (service role key)
│   ├── supabase-browser.ts      # Browser Supabase client (anon key, image upload)
│   └── bazar-constants.ts       # Categories, brands arrays
├── middleware.ts                 # Auth middleware — reads session cookie, sets locals.user
├── pages/
│   └── bazar/
│       ├── index.astro          # Listing page with filters + pagination
│       ├── [id].astro           # Listing detail
│       ├── registrace.astro     # Registration form
│       ├── prihlaseni.astro     # Login form
│       ├── odhlaseni.astro      # Logout (POST → clear cookie → redirect)
│       ├── novy.astro           # New listing form (protected)
│       ├── moje/
│       │   ├── index.astro      # My listings dashboard (protected)
│       │   └── [id].astro       # Edit listing (protected)
│       └── profil.astro         # Edit profile (protected)
├── components/
│   └── bazar/
│       ├── BazarListingRow.astro    # Single listing row component
│       ├── BazarFilters.astro       # Search/filter panel
│       ├── BazarPagination.astro    # Pagination component
│       ├── BazarGallery.astro       # Photo gallery for detail page
│       └── ImageUpload.astro        # Client-side image upload island
├── layouts/
│   └── Layout.astro             # (existing — no changes needed)
└── styles/
    └── global.css               # (existing — add form input styles)

supabase/
└── migrations/
    └── 001_bazar_schema.sql     # Full DB schema + RLS policies

astro.config.mjs                 # Add cloudflare adapter, output: 'server'
package.json                     # Add dependencies
.env                             # Add Supabase env vars
```

---

## Task 1: Astro SSR + Supabase Setup

**Files:**
- Modify: `package.json`
- Modify: `astro.config.mjs`
- Create: `src/lib/supabase.ts`
- Create: `src/lib/supabase-browser.ts`
- Create: `src/lib/bazar-constants.ts`
- Modify: `.env`

- [ ] **Step 1: Install dependencies**

```bash
cd /Users/matejsamec/agro-svet
npm install @astrojs/cloudflare @supabase/supabase-js
```

- [ ] **Step 2: Update astro.config.mjs for SSR**

```javascript
// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  output: 'server',
  adapter: cloudflare(),
  vite: {
    plugins: [tailwindcss()],
  },
});
```

- [ ] **Step 3: Add prerender to all existing pages**

Add `export const prerender = true;` to the frontmatter of every existing page:
- `src/pages/index.astro`
- `src/pages/novinky/index.astro`
- `src/pages/novinky/[slug].astro`
- `src/pages/encyklopedie/index.astro`
- `src/pages/encyklopedie/[slug].astro`
- `src/pages/znacky/index.astro`
- `src/pages/znacky/[slug].astro`
- `src/pages/puda/index.astro`
- `src/pages/puda/[slug].astro`
- `src/pages/media/index.astro`
- `src/pages/statistiky/index.astro`

Example for `src/pages/index.astro`:
```astro
---
export const prerender = true;
import Layout from '../layouts/Layout.astro';
// ... rest of existing imports
---
```

- [ ] **Step 4: Create src/lib/supabase.ts**

```typescript
import { createClient } from '@supabase/supabase-js';

export function createServerClient() {
  const url = import.meta.env.SUPABASE_URL;
  const serviceKey = import.meta.env.SUPABASE_SERVICE_KEY;
  if (!url || !serviceKey) throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_KEY');
  return createClient(url, serviceKey);
}

export function createAnonClient() {
  const url = import.meta.env.SUPABASE_URL;
  const anonKey = import.meta.env.SUPABASE_ANON_KEY;
  if (!url || !anonKey) throw new Error('Missing SUPABASE_URL or SUPABASE_ANON_KEY');
  return createClient(url, anonKey);
}
```

- [ ] **Step 5: Create src/lib/supabase-browser.ts**

```typescript
import { createClient } from '@supabase/supabase-js';

let client: ReturnType<typeof createClient> | null = null;

export function getSupabaseBrowser() {
  if (client) return client;
  const url = import.meta.env.PUBLIC_SUPABASE_URL;
  const anonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;
  client = createClient(url, anonKey);
  return client;
}
```

- [ ] **Step 6: Create src/lib/bazar-constants.ts**

```typescript
export const CATEGORIES = [
  { value: 'traktory', label: 'Traktory' },
  { value: 'kombajny', label: 'Kombajny' },
  { value: 'seci-stroje', label: 'Secí stroje' },
  { value: 'postrikovace', label: 'Postřikovače' },
  { value: 'privezy', label: 'Přívěsy' },
  { value: 'nahradni-dily', label: 'Náhradní díly' },
  { value: 'prislusenstvi', label: 'Příslušenství' },
  { value: 'osiva-hnojiva', label: 'Osiva a hnojiva' },
  { value: 'pozemky', label: 'Pozemky' },
  { value: 'zvirata', label: 'Zvířata' },
  { value: 'sluzby', label: 'Služby' },
  { value: 'ostatni', label: 'Ostatní' },
] as const;

export const BRANDS = [
  { value: 'john-deere', label: 'John Deere' },
  { value: 'claas', label: 'CLAAS' },
  { value: 'fendt', label: 'Fendt' },
  { value: 'zetor', label: 'Zetor' },
  { value: 'new-holland', label: 'New Holland' },
  { value: 'kubota', label: 'Kubota' },
  { value: 'case-ih', label: 'Case IH' },
  { value: 'massey-ferguson', label: 'Massey Ferguson' },
  { value: 'deutz-fahr', label: 'Deutz-Fahr' },
  { value: 'jina', label: 'Jiná' },
] as const;

export type Category = typeof CATEGORIES[number]['value'];
export type Brand = typeof BRANDS[number]['value'];
```

- [ ] **Step 7: Add env vars to .env**

```
PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_URL=https://YOUR_PROJECT.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-role-key
```

(User fills in actual values from existing Supabase project)

- [ ] **Step 8: Verify build works**

```bash
npm run build
```

Expected: Build succeeds with Cloudflare adapter, existing pages prerendered.

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "feat(bazar): add Astro SSR + Supabase setup, prerender existing pages"
```

---

## Task 2: Database Schema + RLS

**Files:**
- Create: `supabase/migrations/001_bazar_schema.sql`

- [ ] **Step 1: Create migration file**

```sql
-- Agro Bazar schema (shared Supabase project — prefixed tables)

-- Users profile table (linked to auth.users)
CREATE TABLE bazar_users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  phone text NOT NULL,
  email text NOT NULL,
  location text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Listings
CREATE TABLE bazar_listings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES bazar_users(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  price integer,
  category text NOT NULL,
  subcategory text,
  brand text,
  location text NOT NULL DEFAULT '',
  phone text NOT NULL,
  email text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'sold', 'expired')),
  views integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz NOT NULL DEFAULT (now() + interval '30 days')
);

-- Images (max 5 per listing)
CREATE TABLE bazar_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id uuid NOT NULL REFERENCES bazar_listings(id) ON DELETE CASCADE,
  storage_path text NOT NULL,
  position integer NOT NULL DEFAULT 1 CHECK (position BETWEEN 1 AND 5),
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX idx_bazar_listings_category ON bazar_listings(category);
CREATE INDEX idx_bazar_listings_brand ON bazar_listings(brand);
CREATE INDEX idx_bazar_listings_status ON bazar_listings(status);
CREATE INDEX idx_bazar_listings_created ON bazar_listings(created_at DESC);
CREATE INDEX idx_bazar_listings_user ON bazar_listings(user_id);
CREATE INDEX idx_bazar_images_listing ON bazar_images(listing_id);

-- RLS Policies
ALTER TABLE bazar_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE bazar_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE bazar_images ENABLE ROW LEVEL SECURITY;

-- bazar_users: anyone can read, only owner can update
CREATE POLICY "bazar_users_select" ON bazar_users FOR SELECT USING (true);
CREATE POLICY "bazar_users_insert" ON bazar_users FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "bazar_users_update" ON bazar_users FOR UPDATE USING (auth.uid() = id);

-- bazar_listings: anyone can read active, owner can CUD
CREATE POLICY "bazar_listings_select" ON bazar_listings FOR SELECT USING (true);
CREATE POLICY "bazar_listings_insert" ON bazar_listings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "bazar_listings_update" ON bazar_listings FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "bazar_listings_delete" ON bazar_listings FOR DELETE USING (auth.uid() = user_id);

-- bazar_images: anyone can read, owner (via listing) can CUD
CREATE POLICY "bazar_images_select" ON bazar_images FOR SELECT USING (true);
CREATE POLICY "bazar_images_insert" ON bazar_images FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM bazar_listings WHERE id = listing_id AND user_id = auth.uid()));
CREATE POLICY "bazar_images_delete" ON bazar_images FOR DELETE
  USING (EXISTS (SELECT 1 FROM bazar_listings WHERE id = listing_id AND user_id = auth.uid()));

-- Storage bucket (run in Supabase dashboard or via API)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('bazar-images', 'bazar-images', true);
-- Storage policies:
-- CREATE POLICY "bazar_storage_upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'bazar-images' AND auth.role() = 'authenticated');
-- CREATE POLICY "bazar_storage_read" ON storage.objects FOR SELECT USING (bucket_id = 'bazar-images');
-- CREATE POLICY "bazar_storage_delete" ON storage.objects FOR DELETE USING (bucket_id = 'bazar-images' AND auth.uid()::text = (storage.foldername(name))[1]);
```

- [ ] **Step 2: Run migration in Supabase**

Go to Supabase Dashboard → SQL Editor → paste and run the migration. Also create the storage bucket `bazar-images` (Settings → Storage → New bucket, set to public).

- [ ] **Step 3: Commit**

```bash
git add supabase/
git commit -m "feat(bazar): add database schema with RLS policies"
```

---

## Task 3: Auth Middleware

**Files:**
- Create: `src/middleware.ts`
- Create: `src/env.d.ts` (or modify if exists)

- [ ] **Step 1: Create src/middleware.ts**

```typescript
import { defineMiddleware } from 'astro:middleware';
import { createAnonClient } from './lib/supabase';

const PROTECTED_PATHS = ['/bazar/novy', '/bazar/moje', '/bazar/profil'];

export const onRequest = defineMiddleware(async (context, next) => {
  const { cookies, url, locals, redirect } = context;

  const accessToken = cookies.get('sb-access-token')?.value;
  const refreshToken = cookies.get('sb-refresh-token')?.value;

  if (accessToken && refreshToken) {
    const supabase = createAnonClient();
    const { data, error } = await supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken,
    });

    if (data.session) {
      (locals as any).user = data.session.user;

      // Refresh tokens if they changed
      if (data.session.access_token !== accessToken) {
        cookies.set('sb-access-token', data.session.access_token, {
          path: '/',
          httpOnly: true,
          secure: true,
          sameSite: 'lax',
          maxAge: 60 * 60 * 24 * 7, // 7 days
        });
        cookies.set('sb-refresh-token', data.session.refresh_token!, {
          path: '/',
          httpOnly: true,
          secure: true,
          sameSite: 'lax',
          maxAge: 60 * 60 * 24 * 7,
        });
      }
    } else {
      (locals as any).user = null;
    }
  } else {
    (locals as any).user = null;
  }

  // Protect routes
  const isProtected = PROTECTED_PATHS.some(p => url.pathname.startsWith(p));
  if (isProtected && !(locals as any).user) {
    return redirect('/bazar/prihlaseni/');
  }

  return next();
});
```

- [ ] **Step 2: Create src/env.d.ts**

```typescript
/// <reference types="astro/client" />

declare namespace App {
  interface Locals {
    user: import('@supabase/supabase-js').User | null;
  }
}
```

- [ ] **Step 3: Commit**

```bash
git add src/middleware.ts src/env.d.ts
git commit -m "feat(bazar): add auth middleware with session cookie management"
```

---

## Task 4: Registration + Login Pages

**Files:**
- Create: `src/pages/bazar/registrace.astro`
- Create: `src/pages/bazar/prihlaseni.astro`
- Create: `src/pages/bazar/odhlaseni.astro`
- Modify: `src/styles/global.css` (add form styles)

- [ ] **Step 1: Add form styles to global.css**

Append to `src/styles/global.css`:

```css
/* ===== Form Elements ===== */
.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  font-family: var(--font-heading);
  font-size: 13px;
  font-weight: 500;
  margin-bottom: 6px;
  color: var(--black);
}

.form-input {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  font-family: var(--font-body);
  font-size: 15px;
  color: var(--black);
  background: #fff;
  transition: border-color .2s;
}

.form-input:focus {
  outline: none;
  border-color: var(--yellow);
}

.form-input::placeholder {
  color: #aaa;
}

.form-select {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  font-family: var(--font-body);
  font-size: 15px;
  color: var(--black);
  background: #fff;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23888' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 14px center;
}

.form-select:focus {
  outline: none;
  border-color: var(--yellow);
}

.form-error {
  background: #fff0f0;
  border: 1px solid #ffcdd2;
  color: #c62828;
  padding: 12px 16px;
  border-radius: 10px;
  font-size: 14px;
  margin-bottom: 20px;
}

.form-success {
  background: #f0fff4;
  border: 1px solid #c8e6c9;
  color: #2e7d32;
  padding: 12px 16px;
  border-radius: 10px;
  font-size: 14px;
  margin-bottom: 20px;
}
```

- [ ] **Step 2: Create src/pages/bazar/registrace.astro**

```astro
---
import Layout from '../../layouts/Layout.astro';
import { createAnonClient } from '../../lib/supabase';
import { createServerClient } from '../../lib/supabase';

let error = '';
let success = '';

if (Astro.request.method === 'POST') {
  const form = await Astro.request.formData();
  const email = form.get('email')?.toString().trim() ?? '';
  const password = form.get('password')?.toString() ?? '';
  const name = form.get('name')?.toString().trim() ?? '';
  const phone = form.get('phone')?.toString().trim() ?? '';
  const location = form.get('location')?.toString().trim() ?? '';

  if (!email || !password || !name || !phone) {
    error = 'Vyplňte všechna povinná pole.';
  } else if (password.length < 6) {
    error = 'Heslo musí mít alespoň 6 znaků.';
  } else {
    const supabase = createAnonClient();
    const { data, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name, phone, location } },
    });

    if (authError) {
      error = authError.message;
    } else if (data.user) {
      // Create profile
      const server = createServerClient();
      await server.from('bazar_users').insert({
        id: data.user.id,
        name,
        phone,
        email,
        location,
      });
      success = 'Registrace úspěšná! Zkontrolujte email pro potvrzení účtu.';
    }
  }
}
---

<Layout title="Registrace — Agro bazar">
  <div style="max-width:500px; margin:0 auto; padding:64px 24px 96px;">
    <span class="section-label">Agro bazar</span>
    <h1 style="font-size:clamp(1.8rem,4vw,2.5rem); margin-bottom:32px;">Registrace</h1>

    {error && <div class="form-error">{error}</div>}
    {success && <div class="form-success">{success}</div>}

    {!success && (
      <form method="POST">
        <div class="form-group">
          <label for="name">Jméno / firma *</label>
          <input type="text" id="name" name="name" class="form-input" required />
        </div>
        <div class="form-group">
          <label for="email">Email *</label>
          <input type="email" id="email" name="email" class="form-input" required />
        </div>
        <div class="form-group">
          <label for="password">Heslo *</label>
          <input type="password" id="password" name="password" class="form-input" minlength="6" required />
        </div>
        <div class="form-group">
          <label for="phone">Telefon *</label>
          <input type="tel" id="phone" name="phone" class="form-input" required />
        </div>
        <div class="form-group">
          <label for="location">Město / okres</label>
          <input type="text" id="location" name="location" class="form-input" />
        </div>
        <button type="submit" class="btn-primary" style="width:100%; justify-content:center;">
          Zaregistrovat se
        </button>
      </form>
    )}

    <p style="text-align:center; margin-top:24px; font-size:14px; color:#666;">
      Už máte účet? <a href="/bazar/prihlaseni/" class="link-underline">Přihlásit se</a>
    </p>
  </div>
</Layout>
```

- [ ] **Step 3: Create src/pages/bazar/prihlaseni.astro**

```astro
---
import Layout from '../../layouts/Layout.astro';
import { createAnonClient } from '../../lib/supabase';

let error = '';

if (Astro.request.method === 'POST') {
  const form = await Astro.request.formData();
  const email = form.get('email')?.toString().trim() ?? '';
  const password = form.get('password')?.toString() ?? '';

  if (!email || !password) {
    error = 'Vyplňte email a heslo.';
  } else {
    const supabase = createAnonClient();
    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      error = 'Nesprávný email nebo heslo.';
    } else if (data.session) {
      Astro.cookies.set('sb-access-token', data.session.access_token, {
        path: '/',
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7,
      });
      Astro.cookies.set('sb-refresh-token', data.session.refresh_token!, {
        path: '/',
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7,
      });
      return Astro.redirect('/bazar/moje/');
    }
  }
}
---

<Layout title="Přihlášení — Agro bazar">
  <div style="max-width:500px; margin:0 auto; padding:64px 24px 96px;">
    <span class="section-label">Agro bazar</span>
    <h1 style="font-size:clamp(1.8rem,4vw,2.5rem); margin-bottom:32px;">Přihlášení</h1>

    {error && <div class="form-error">{error}</div>}

    <form method="POST">
      <div class="form-group">
        <label for="email">Email</label>
        <input type="email" id="email" name="email" class="form-input" required />
      </div>
      <div class="form-group">
        <label for="password">Heslo</label>
        <input type="password" id="password" name="password" class="form-input" required />
      </div>
      <button type="submit" class="btn-primary" style="width:100%; justify-content:center;">
        Přihlásit se
      </button>
    </form>

    <p style="text-align:center; margin-top:24px; font-size:14px; color:#666;">
      Nemáte účet? <a href="/bazar/registrace/" class="link-underline">Zaregistrovat se</a>
    </p>
  </div>
</Layout>
```

- [ ] **Step 4: Create src/pages/bazar/odhlaseni.astro**

```astro
---
Astro.cookies.delete('sb-access-token', { path: '/' });
Astro.cookies.delete('sb-refresh-token', { path: '/' });
return Astro.redirect('/bazar/');
---
```

- [ ] **Step 5: Commit**

```bash
git add src/pages/bazar/registrace.astro src/pages/bazar/prihlaseni.astro src/pages/bazar/odhlaseni.astro src/styles/global.css
git commit -m "feat(bazar): add registration, login, and logout pages"
```

---

## Task 5: Listing Page (index) with Filters + Pagination

**Files:**
- Create: `src/pages/bazar/index.astro`
- Create: `src/components/bazar/BazarListingRow.astro`
- Create: `src/components/bazar/BazarFilters.astro`
- Create: `src/components/bazar/BazarPagination.astro`

- [ ] **Step 1: Create src/components/bazar/BazarFilters.astro**

```astro
---
import { CATEGORIES, BRANDS } from '../../lib/bazar-constants';

interface Props {
  query?: string;
  category?: string;
  brand?: string;
  location?: string;
  priceFrom?: string;
  priceTo?: string;
}

const { query = '', category = '', brand = '', location = '', priceFrom = '', priceTo = '' } = Astro.props;
---

<form method="GET" action="/bazar/" class="bazar-filters">
  <input type="text" name="q" value={query} placeholder="Hledat inzerát..." class="form-input" />
  <select name="category" class="form-select">
    <option value="">Všechny kategorie</option>
    {CATEGORIES.map(c => (
      <option value={c.value} selected={c.value === category}>{c.label}</option>
    ))}
  </select>
  <select name="brand" class="form-select">
    <option value="">Všechny značky</option>
    {BRANDS.map(b => (
      <option value={b.value} selected={b.value === brand}>{b.label}</option>
    ))}
  </select>
  <input type="text" name="location" value={location} placeholder="Lokalita" class="form-input" />
  <input type="number" name="price_from" value={priceFrom} placeholder="Cena od" class="form-input" />
  <input type="number" name="price_to" value={priceTo} placeholder="Cena do" class="form-input" />
  <button type="submit" class="btn-primary">Hledat</button>
</form>

<style>
  .bazar-filters {
    display: grid;
    grid-template-columns: 2fr 1fr 1fr 1fr 1fr 1fr auto;
    gap: 10px;
    align-items: end;
    margin-bottom: 24px;
  }

  @media (max-width: 1024px) {
    .bazar-filters {
      grid-template-columns: 1fr 1fr;
    }
  }

  @media (max-width: 600px) {
    .bazar-filters {
      grid-template-columns: 1fr;
    }
  }
</style>
```

- [ ] **Step 2: Create src/components/bazar/BazarListingRow.astro**

```astro
---
interface Props {
  id: string;
  title: string;
  price: number | null;
  location: string;
  category: string;
  brand: string | null;
  imageUrl: string | null;
  createdAt: string;
}

const { id, title, price, location, category, brand, imageUrl, createdAt } = Astro.props;

const date = new Intl.DateTimeFormat('cs-CZ', { day: 'numeric', month: 'long' }).format(new Date(createdAt));
const priceText = price ? `${price.toLocaleString('cs-CZ')} Kč` : 'Dohodou';
---

<a href={`/bazar/${id}/`} class="listing-row">
  <div class="listing-img">
    {imageUrl
      ? <img src={imageUrl} alt={title} loading="lazy" />
      : <div class="listing-placeholder">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ccc" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></svg>
        </div>
    }
  </div>
  <div class="listing-info">
    <h3 class="listing-title">{title}</h3>
    <div class="listing-meta">
      <span class="listing-location">{location}</span>
      <span class="listing-date">{date}</span>
      {brand && <span class="tag">{brand}</span>}
    </div>
  </div>
  <div class="listing-price">{priceText}</div>
</a>

<style>
  .listing-row {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 14px 16px;
    text-decoration: none;
    color: inherit;
    border-bottom: 1px solid #f0f0f0;
    transition: background .15s;
  }
  .listing-row:hover {
    background: #f9f9f9;
  }

  .listing-img {
    width: 120px;
    height: 90px;
    border-radius: 10px;
    overflow: hidden;
    flex-shrink: 0;
    background: #f5f5f5;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .listing-img img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .listing-info {
    flex: 1;
    min-width: 0;
  }

  .listing-title {
    font-family: 'Chakra Petch', sans-serif;
    font-size: 16px;
    font-weight: 400;
    margin-bottom: 6px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .listing-meta {
    display: flex;
    gap: 12px;
    align-items: center;
    font-size: 13px;
    color: #888;
  }

  .listing-price {
    font-family: 'Chakra Petch', sans-serif;
    font-size: 18px;
    font-weight: 700;
    white-space: nowrap;
    color: #1a1a1a;
  }

  @media (max-width: 600px) {
    .listing-row { flex-wrap: wrap; }
    .listing-img { width: 80px; height: 60px; }
    .listing-price { width: 100%; padding-left: 96px; }
  }
</style>
```

- [ ] **Step 3: Create src/components/bazar/BazarPagination.astro**

```astro
---
interface Props {
  currentPage: number;
  totalPages: number;
  baseUrl: string;
}

const { currentPage, totalPages, baseUrl } = Astro.props;

function pageUrl(page: number): string {
  const url = new URL(baseUrl);
  if (page > 1) url.searchParams.set('page', String(page));
  else url.searchParams.delete('page');
  return url.pathname + url.search;
}

const pages: number[] = [];
for (let i = 1; i <= totalPages; i++) {
  if (i === 1 || i === totalPages || Math.abs(i - currentPage) <= 2) {
    pages.push(i);
  }
}
---

{totalPages > 1 && (
  <nav class="pagination">
    {currentPage > 1 && <a href={pageUrl(currentPage - 1)} class="page-link">← Předchozí</a>}
    {pages.map((page, idx) => (
      <>
        {idx > 0 && pages[idx - 1] !== page - 1 && <span class="page-dots">...</span>}
        {page === currentPage
          ? <span class="page-link active">{page}</span>
          : <a href={pageUrl(page)} class="page-link">{page}</a>
        }
      </>
    ))}
    {currentPage < totalPages && <a href={pageUrl(currentPage + 1)} class="page-link">Další →</a>}
  </nav>
)}

<style>
  .pagination {
    display: flex;
    gap: 6px;
    align-items: center;
    justify-content: center;
    padding: 32px 0;
  }

  .page-link {
    font-family: 'Chakra Petch', sans-serif;
    font-size: 14px;
    padding: 8px 14px;
    border-radius: 8px;
    text-decoration: none;
    color: #555;
    border: 1px solid #e0e0e0;
    transition: background .15s;
  }

  .page-link:hover {
    background: #f5f5f5;
  }

  .page-link.active {
    background: var(--yellow);
    color: #000;
    font-weight: 600;
    border-color: var(--yellow);
  }

  .page-dots {
    font-size: 14px;
    color: #aaa;
    padding: 0 4px;
  }
</style>
```

- [ ] **Step 4: Create src/pages/bazar/index.astro**

```astro
---
import Layout from '../../layouts/Layout.astro';
import BazarFilters from '../../components/bazar/BazarFilters.astro';
import BazarListingRow from '../../components/bazar/BazarListingRow.astro';
import BazarPagination from '../../components/bazar/BazarPagination.astro';
import { CATEGORIES } from '../../lib/bazar-constants';
import { createServerClient } from '../../lib/supabase';

const PER_PAGE = 20;

const url = Astro.url;
const query = url.searchParams.get('q') ?? '';
const category = url.searchParams.get('category') ?? '';
const brand = url.searchParams.get('brand') ?? '';
const location = url.searchParams.get('location') ?? '';
const priceFrom = url.searchParams.get('price_from') ?? '';
const priceTo = url.searchParams.get('price_to') ?? '';
const page = Math.max(1, parseInt(url.searchParams.get('page') ?? '1'));

const supabase = createServerClient();

// Build query
let dbQuery = supabase
  .from('bazar_listings')
  .select('id, title, price, location, category, brand, created_at, bazar_images(storage_path, position)', { count: 'exact' })
  .eq('status', 'active')
  .order('created_at', { ascending: false })
  .range((page - 1) * PER_PAGE, page * PER_PAGE - 1);

if (query) dbQuery = dbQuery.ilike('title', `%${query}%`);
if (category) dbQuery = dbQuery.eq('category', category);
if (brand) dbQuery = dbQuery.eq('brand', brand);
if (location) dbQuery = dbQuery.ilike('location', `%${location}%`);
if (priceFrom) dbQuery = dbQuery.gte('price', parseInt(priceFrom));
if (priceTo) dbQuery = dbQuery.lte('price', parseInt(priceTo));

const { data: listings, count } = await dbQuery;

const totalPages = Math.ceil((count ?? 0) / PER_PAGE);

function getImageUrl(listing: any): string | null {
  const images = listing.bazar_images;
  if (!images || images.length === 0) return null;
  const sorted = [...images].sort((a: any, b: any) => a.position - b.position);
  const { data } = supabase.storage.from('bazar-images').getPublicUrl(sorted[0].storage_path);
  return data.publicUrl;
}
---

<Layout title="Agro bazar — inzeráty" description="Bazar zemědělské techniky, pozemků, zvířat a služeb. Vložte inzerát zdarma.">
  <div style="max-width:1280px; margin:0 auto; padding:48px 32px 80px;">

    <div style="display:flex; align-items:flex-end; justify-content:space-between; margin-bottom:24px; flex-wrap:wrap; gap:12px;">
      <div>
        <span class="section-label">Agro bazar</span>
        <h1 style="font-size:clamp(1.8rem,4vw,2.5rem);">Inzeráty</h1>
      </div>
      <a href="/bazar/novy/" class="btn-primary">
        + Přidat inzerát
      </a>
    </div>

    <BazarFilters query={query} category={category} brand={brand} location={location} priceFrom={priceFrom} priceTo={priceTo} />

    <!-- Category pills -->
    <div style="display:flex; gap:8px; flex-wrap:wrap; margin-bottom:24px;">
      <a href="/bazar/" class:list={['tag', { active: !category }]} style={!category ? 'background:#1a1a1a; color:#fff;' : ''}>Vše</a>
      {CATEGORIES.map(c => (
        <a href={`/bazar/?category=${c.value}`} class="tag" style={c.value === category ? 'background:#1a1a1a; color:#fff;' : ''}>{c.label}</a>
      ))}
    </div>

    <!-- Listings -->
    {listings && listings.length > 0 ? (
      <div style="border-top:1px solid #f0f0f0;">
        {listings.map((listing: any) => (
          <BazarListingRow
            id={listing.id}
            title={listing.title}
            price={listing.price}
            location={listing.location}
            category={listing.category}
            brand={listing.brand}
            imageUrl={getImageUrl(listing)}
            createdAt={listing.created_at}
          />
        ))}
      </div>
    ) : (
      <div style="text-align:center; padding:64px 0; color:#888;">
        <p style="font-size:18px;">Žádné inzeráty nenalezeny.</p>
        <p style="font-size:14px; margin-top:8px;">Zkuste změnit filtry nebo <a href="/bazar/novy/" class="link-underline">vložte první inzerát</a>.</p>
      </div>
    )}

    <BazarPagination currentPage={page} totalPages={totalPages} baseUrl={url.toString()} />
  </div>
</Layout>
```

- [ ] **Step 5: Commit**

```bash
git add src/pages/bazar/index.astro src/components/bazar/
git commit -m "feat(bazar): add listing page with filters, rows, and pagination"
```

---

## Task 6: Listing Detail Page

**Files:**
- Create: `src/pages/bazar/[id].astro`
- Create: `src/components/bazar/BazarGallery.astro`

- [ ] **Step 1: Create src/components/bazar/BazarGallery.astro**

```astro
---
interface Props {
  images: { url: string; position: number }[];
}

const { images } = Astro.props;
const sorted = [...images].sort((a, b) => a.position - b.position);
const main = sorted[0];
const thumbs = sorted.slice(1);
---

{sorted.length > 0 && (
  <div class="gallery">
    <div class="gallery-main">
      <img id="gallery-main-img" src={main.url} alt="Hlavní fotka" />
    </div>
    {thumbs.length > 0 && (
      <div class="gallery-thumbs">
        {sorted.map((img, idx) => (
          <button class="gallery-thumb" data-src={img.url} data-idx={idx}>
            <img src={img.url} alt={`Fotka ${idx + 1}`} loading="lazy" />
          </button>
        ))}
      </div>
    )}
  </div>
)}

<style>
  .gallery {
    margin-bottom: 32px;
  }
  .gallery-main {
    width: 100%;
    height: 400px;
    border-radius: 18px;
    overflow: hidden;
    background: #f5f5f5;
    margin-bottom: 10px;
  }
  .gallery-main img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    background: #f5f5f5;
  }
  .gallery-thumbs {
    display: flex;
    gap: 8px;
  }
  .gallery-thumb {
    width: 80px;
    height: 60px;
    border-radius: 8px;
    overflow: hidden;
    border: 2px solid transparent;
    padding: 0;
    cursor: pointer;
    background: none;
    transition: border-color .15s;
  }
  .gallery-thumb:hover,
  .gallery-thumb.active {
    border-color: var(--yellow);
  }
  .gallery-thumb img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  @media (max-width: 600px) {
    .gallery-main { height: 250px; }
  }
</style>

<script>
  document.querySelectorAll('.gallery-thumb').forEach(btn => {
    btn.addEventListener('click', () => {
      const src = (btn as HTMLElement).dataset.src;
      const main = document.getElementById('gallery-main-img') as HTMLImageElement;
      if (src && main) main.src = src;
      document.querySelectorAll('.gallery-thumb').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });
</script>
```

- [ ] **Step 2: Create src/pages/bazar/[id].astro**

```astro
---
import Layout from '../../layouts/Layout.astro';
import BazarGallery from '../../components/bazar/BazarGallery.astro';
import { CATEGORIES, BRANDS } from '../../lib/bazar-constants';
import { createServerClient } from '../../lib/supabase';

const { id } = Astro.params;
const supabase = createServerClient();

// Fetch listing with images and user
const { data: listing } = await supabase
  .from('bazar_listings')
  .select('*, bazar_images(storage_path, position), bazar_users(name)')
  .eq('id', id)
  .single();

if (!listing) {
  return Astro.redirect('/bazar/');
}

// Increment views
await supabase
  .from('bazar_listings')
  .update({ views: (listing.views ?? 0) + 1 })
  .eq('id', id);

// Resolve image URLs
const images = (listing.bazar_images ?? []).map((img: any) => {
  const { data } = supabase.storage.from('bazar-images').getPublicUrl(img.storage_path);
  return { url: data.publicUrl, position: img.position };
});

const categoryLabel = CATEGORIES.find(c => c.value === listing.category)?.label ?? listing.category;
const brandLabel = BRANDS.find(b => b.value === listing.brand)?.label ?? listing.brand;
const date = new Intl.DateTimeFormat('cs-CZ', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(listing.created_at));
const priceText = listing.price ? `${listing.price.toLocaleString('cs-CZ')} Kč` : 'Dohodou';
const sellerName = listing.bazar_users?.name ?? 'Neznámý';
---

<Layout title={`${listing.title} — Agro bazar`}>
  <div style="max-width:1000px; margin:0 auto; padding:32px 24px 80px;">

    <!-- Breadcrumb -->
    <nav style="font-size:13px; color:#888; margin-bottom:20px;">
      <a href="/bazar/" style="color:#888; text-decoration:none;">Bazar</a>
      <span> → </span>
      <a href={`/bazar/?category=${listing.category}`} style="color:#888; text-decoration:none;">{categoryLabel}</a>
      <span> → </span>
      <span style="color:#555;">{listing.title}</span>
    </nav>

    <!-- Gallery -->
    <BazarGallery images={images} />

    <!-- Content -->
    <div class="detail-grid">
      <div class="detail-main">
        <h1 style="font-size:clamp(1.5rem,3vw,2rem); margin-bottom:12px;">{listing.title}</h1>

        <div style="display:flex; gap:10px; flex-wrap:wrap; margin-bottom:24px;">
          <span class="tag">{categoryLabel}</span>
          {brandLabel && <span class="tag">{brandLabel}</span>}
        </div>

        <div class="prose" set:html={listing.description.replace(/\n/g, '<br>')} />
      </div>

      <aside class="detail-sidebar">
        <!-- Price -->
        <div class="sidebar-box">
          <div class="detail-price">{priceText}</div>
        </div>

        <!-- Contact -->
        <div class="sidebar-box">
          <h3 style="font-size:14px; margin-bottom:12px;">Kontakt</h3>
          <p style="font-size:15px; margin-bottom:6px;"><strong>{sellerName}</strong></p>
          {listing.phone && (
            <p style="font-size:15px; margin-bottom:6px;">
              <a href={`tel:${listing.phone}`} style="color:#1a1a1a; text-decoration:none;">📞 {listing.phone}</a>
            </p>
          )}
          {listing.email && (
            <p style="font-size:15px;">
              <a href={`mailto:${listing.email}`} style="color:#1a1a1a; text-decoration:none;">✉️ {listing.email}</a>
            </p>
          )}
        </div>

        <!-- Info -->
        <div class="sidebar-box" style="font-size:13px; color:#888;">
          <p>📍 {listing.location}</p>
          <p>📅 {date}</p>
          <p>👁️ {listing.views ?? 0}× zobrazeno</p>
        </div>
      </aside>
    </div>
  </div>
</Layout>

<style>
  .detail-grid {
    display: grid;
    grid-template-columns: 1fr 320px;
    gap: 32px;
    align-items: start;
  }

  .sidebar-box {
    background: #fff;
    border: 1px solid #e8e8e8;
    border-radius: 18px;
    padding: 20px;
    margin-bottom: 12px;
  }

  .detail-price {
    font-family: 'Chakra Petch', sans-serif;
    font-size: 28px;
    font-weight: 700;
    color: #1a1a1a;
  }

  @media (max-width: 768px) {
    .detail-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
```

- [ ] **Step 3: Commit**

```bash
git add src/pages/bazar/\[id\].astro src/components/bazar/BazarGallery.astro
git commit -m "feat(bazar): add listing detail page with gallery and contact"
```

---

## Task 7: New Listing Form + Image Upload

**Files:**
- Create: `src/pages/bazar/novy.astro`
- Create: `src/components/bazar/ImageUpload.astro`

- [ ] **Step 1: Create src/components/bazar/ImageUpload.astro**

```astro
---
// Client-side island for image upload to Supabase Storage
---

<div class="upload-area" id="upload-area">
  <input type="file" id="file-input" multiple accept="image/jpeg,image/png,image/webp" style="display:none;" />
  <div id="upload-placeholder" class="upload-placeholder">
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#888" stroke-width="1.5"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"/></svg>
    <p>Přetáhněte fotky nebo klikněte (max 5, max 5MB)</p>
  </div>
  <div id="upload-preview" class="upload-preview"></div>
  <input type="hidden" name="image_paths" id="image-paths-input" value="" />
</div>

<style>
  .upload-area {
    border: 2px dashed #e0e0e0;
    border-radius: 18px;
    padding: 32px;
    text-align: center;
    cursor: pointer;
    transition: border-color .2s;
    min-height: 120px;
  }
  .upload-area:hover,
  .upload-area.dragover {
    border-color: var(--yellow);
  }
  .upload-placeholder p {
    font-size: 14px;
    color: #888;
    margin-top: 8px;
  }
  .upload-preview {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    margin-top: 12px;
  }
  .upload-preview .preview-item {
    width: 100px;
    height: 75px;
    border-radius: 8px;
    overflow: hidden;
    position: relative;
  }
  .upload-preview .preview-item img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .upload-preview .preview-item .remove-btn {
    position: absolute;
    top: 4px;
    right: 4px;
    background: rgba(0,0,0,.6);
    color: #fff;
    border: none;
    border-radius: 50%;
    width: 20px;
    height: 20px;
    font-size: 12px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>

<script define:vars={{ supabaseUrl: import.meta.env.PUBLIC_SUPABASE_URL, supabaseKey: import.meta.env.PUBLIC_SUPABASE_ANON_KEY }}>
  const area = document.getElementById('upload-area');
  const input = document.getElementById('file-input');
  const preview = document.getElementById('upload-preview');
  const pathsInput = document.getElementById('image-paths-input');
  const placeholder = document.getElementById('upload-placeholder');

  let uploadedPaths = [];
  const MAX_FILES = 5;
  const MAX_SIZE = 5 * 1024 * 1024;

  area.addEventListener('click', () => input.click());
  area.addEventListener('dragover', (e) => { e.preventDefault(); area.classList.add('dragover'); });
  area.addEventListener('dragleave', () => area.classList.remove('dragover'));
  area.addEventListener('drop', (e) => {
    e.preventDefault();
    area.classList.remove('dragover');
    handleFiles(e.dataTransfer.files);
  });
  input.addEventListener('change', () => handleFiles(input.files));

  async function handleFiles(files) {
    for (const file of files) {
      if (uploadedPaths.length >= MAX_FILES) break;
      if (file.size > MAX_SIZE) { alert(`${file.name} je příliš velký (max 5MB)`); continue; }
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) continue;

      const path = `${crypto.randomUUID()}/${file.name}`;

      const res = await fetch(`${supabaseUrl}/storage/v1/object/bazar-images/${path}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': file.type,
        },
        body: file,
      });

      if (res.ok) {
        uploadedPaths.push(path);
        addPreview(file, path);
        updateInput();
      }
    }
  }

  function addPreview(file, path) {
    const div = document.createElement('div');
    div.className = 'preview-item';
    const img = document.createElement('img');
    img.src = URL.createObjectURL(file);
    const btn = document.createElement('button');
    btn.className = 'remove-btn';
    btn.textContent = '×';
    btn.type = 'button';
    btn.onclick = () => {
      uploadedPaths = uploadedPaths.filter(p => p !== path);
      div.remove();
      updateInput();
      if (uploadedPaths.length === 0) placeholder.style.display = '';
    };
    div.appendChild(img);
    div.appendChild(btn);
    preview.appendChild(div);
    placeholder.style.display = 'none';
  }

  function updateInput() {
    pathsInput.value = JSON.stringify(uploadedPaths);
  }
</script>
```

- [ ] **Step 2: Create src/pages/bazar/novy.astro**

```astro
---
import Layout from '../../layouts/Layout.astro';
import ImageUpload from '../../components/bazar/ImageUpload.astro';
import { CATEGORIES, BRANDS } from '../../lib/bazar-constants';
import { createServerClient } from '../../lib/supabase';

const user = (Astro.locals as any).user;
let error = '';
let success = false;

if (Astro.request.method === 'POST') {
  const form = await Astro.request.formData();
  const title = form.get('title')?.toString().trim() ?? '';
  const description = form.get('description')?.toString().trim() ?? '';
  const priceStr = form.get('price')?.toString().trim() ?? '';
  const category = form.get('category')?.toString() ?? '';
  const brand = form.get('brand')?.toString() || null;
  const location = form.get('location')?.toString().trim() ?? '';
  const phone = form.get('phone')?.toString().trim() ?? '';
  const email = form.get('email')?.toString().trim() ?? '';
  const imagePaths = JSON.parse(form.get('image_paths')?.toString() || '[]');

  if (!title || !category || !phone) {
    error = 'Vyplňte název, kategorii a telefon.';
  } else {
    const supabase = createServerClient();
    const price = priceStr ? parseInt(priceStr) : null;

    const { data: listing, error: insertErr } = await supabase
      .from('bazar_listings')
      .insert({
        user_id: user.id,
        title,
        description,
        price,
        category,
        brand,
        location,
        phone,
        email,
        status: 'active',
      })
      .select('id')
      .single();

    if (insertErr) {
      error = 'Chyba při vkládání inzerátu.';
    } else if (listing) {
      // Save images
      if (imagePaths.length > 0) {
        const imageRows = imagePaths.map((path: string, idx: number) => ({
          listing_id: listing.id,
          storage_path: path,
          position: idx + 1,
        }));
        await supabase.from('bazar_images').insert(imageRows);
      }
      return Astro.redirect(`/bazar/${listing.id}/`);
    }
  }
}

// Pre-fill contact from profile
const supabase = createServerClient();
const { data: profile } = await supabase
  .from('bazar_users')
  .select('phone, email, location')
  .eq('id', user.id)
  .single();
---

<Layout title="Nový inzerát — Agro bazar">
  <div style="max-width:600px; margin:0 auto; padding:64px 24px 96px;">
    <span class="section-label">Agro bazar</span>
    <h1 style="font-size:clamp(1.8rem,4vw,2.5rem); margin-bottom:32px;">Nový inzerát</h1>

    {error && <div class="form-error">{error}</div>}

    <form method="POST">
      <div class="form-group">
        <label for="title">Název inzerátu *</label>
        <input type="text" id="title" name="title" class="form-input" required maxlength="120" />
      </div>

      <div class="form-group">
        <label for="category">Kategorie *</label>
        <select id="category" name="category" class="form-select" required>
          <option value="">Vyberte kategorii</option>
          {CATEGORIES.map(c => <option value={c.value}>{c.label}</option>)}
        </select>
      </div>

      <div class="form-group">
        <label for="brand">Značka</label>
        <select id="brand" name="brand" class="form-select">
          <option value="">Bez značky</option>
          {BRANDS.map(b => <option value={b.value}>{b.label}</option>)}
        </select>
      </div>

      <div class="form-group">
        <label for="price">Cena (Kč) — prázdné = dohodou</label>
        <input type="number" id="price" name="price" class="form-input" min="0" />
      </div>

      <div class="form-group">
        <label for="description">Popis</label>
        <textarea id="description" name="description" class="form-input" rows="6" style="resize:vertical;"></textarea>
      </div>

      <div class="form-group">
        <label>Fotky (max 5)</label>
        <ImageUpload />
      </div>

      <div class="form-group">
        <label for="location">Lokalita *</label>
        <input type="text" id="location" name="location" class="form-input" value={profile?.location ?? ''} required />
      </div>

      <div class="form-group">
        <label for="phone">Telefon *</label>
        <input type="tel" id="phone" name="phone" class="form-input" value={profile?.phone ?? ''} required />
      </div>

      <div class="form-group">
        <label for="email">Email</label>
        <input type="email" id="email" name="email" class="form-input" value={profile?.email ?? ''} />
      </div>

      <button type="submit" class="btn-primary" style="width:100%; justify-content:center;">
        Vložit inzerát
      </button>
    </form>
  </div>
</Layout>
```

- [ ] **Step 3: Commit**

```bash
git add src/pages/bazar/novy.astro src/components/bazar/ImageUpload.astro
git commit -m "feat(bazar): add new listing form with image upload"
```

---

## Task 8: My Listings Dashboard + Edit + Profile

**Files:**
- Create: `src/pages/bazar/moje/index.astro`
- Create: `src/pages/bazar/moje/[id].astro`
- Create: `src/pages/bazar/profil.astro`

- [ ] **Step 1: Create src/pages/bazar/moje/index.astro**

```astro
---
import Layout from '../../../layouts/Layout.astro';
import { createServerClient } from '../../../lib/supabase';
import { CATEGORIES } from '../../../lib/bazar-constants';

const user = (Astro.locals as any).user;
const supabase = createServerClient();

// Handle actions (POST)
if (Astro.request.method === 'POST') {
  const form = await Astro.request.formData();
  const action = form.get('action')?.toString();
  const listingId = form.get('listing_id')?.toString();

  if (listingId) {
    if (action === 'delete') {
      await supabase.from('bazar_listings').delete().eq('id', listingId).eq('user_id', user.id);
    } else if (action === 'sold') {
      await supabase.from('bazar_listings').update({ status: 'sold', updated_at: new Date().toISOString() }).eq('id', listingId).eq('user_id', user.id);
    } else if (action === 'extend') {
      const newExpiry = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
      await supabase.from('bazar_listings').update({ expires_at: newExpiry, status: 'active', updated_at: new Date().toISOString() }).eq('id', listingId).eq('user_id', user.id);
    }
  }
}

const { data: listings } = await supabase
  .from('bazar_listings')
  .select('id, title, price, category, status, created_at, views')
  .eq('user_id', user.id)
  .order('created_at', { ascending: false });
---

<Layout title="Moje inzeráty — Agro bazar">
  <div style="max-width:1000px; margin:0 auto; padding:48px 24px 80px;">

    <div style="display:flex; align-items:flex-end; justify-content:space-between; margin-bottom:32px; flex-wrap:wrap; gap:12px;">
      <div>
        <span class="section-label">Agro bazar</span>
        <h1 style="font-size:clamp(1.8rem,4vw,2.5rem);">Moje inzeráty</h1>
      </div>
      <div style="display:flex; gap:10px;">
        <a href="/bazar/profil/" class="btn-outline">Profil</a>
        <a href="/bazar/novy/" class="btn-primary">+ Nový inzerát</a>
      </div>
    </div>

    {listings && listings.length > 0 ? (
      <div class="my-listings">
        {listings.map(listing => {
          const categoryLabel = CATEGORIES.find(c => c.value === listing.category)?.label ?? listing.category;
          const priceText = listing.price ? `${listing.price.toLocaleString('cs-CZ')} Kč` : 'Dohodou';
          const date = new Intl.DateTimeFormat('cs-CZ', { day: 'numeric', month: 'short' }).format(new Date(listing.created_at));
          const statusColors: Record<string, string> = { active: '#4caf50', sold: '#ff9800', expired: '#999' };
          const statusLabels: Record<string, string> = { active: 'Aktivní', sold: 'Prodáno', expired: 'Expirováno' };
          return (
            <div class="my-listing-row">
              <div class="my-listing-info">
                <a href={`/bazar/${listing.id}/`} style="text-decoration:none; color:inherit;">
                  <h3 style="font-size:16px; margin-bottom:4px;">{listing.title}</h3>
                </a>
                <div style="font-size:13px; color:#888; display:flex; gap:12px;">
                  <span>{categoryLabel}</span>
                  <span>{priceText}</span>
                  <span>{date}</span>
                  <span>{listing.views ?? 0}× zobrazeno</span>
                </div>
              </div>
              <span class="status-badge" style={`background:${statusColors[listing.status]}20; color:${statusColors[listing.status]};`}>
                {statusLabels[listing.status] ?? listing.status}
              </span>
              <div class="my-listing-actions">
                <a href={`/bazar/moje/${listing.id}/`} class="action-btn">Upravit</a>
                <form method="POST" style="display:inline;">
                  <input type="hidden" name="listing_id" value={listing.id} />
                  {listing.status === 'active' && <button type="submit" name="action" value="sold" class="action-btn">Prodáno</button>}
                  {(listing.status === 'expired') && <button type="submit" name="action" value="extend" class="action-btn">Prodloužit</button>}
                  <button type="submit" name="action" value="delete" class="action-btn action-delete" onclick="return confirm('Opravdu smazat?')">Smazat</button>
                </form>
              </div>
            </div>
          );
        })}
      </div>
    ) : (
      <div style="text-align:center; padding:64px 0; color:#888;">
        <p>Zatím nemáte žádné inzeráty.</p>
        <a href="/bazar/novy/" class="btn-primary" style="margin-top:16px; display:inline-flex;">+ Přidat inzerát</a>
      </div>
    )}

    <div style="margin-top:32px; text-align:center;">
      <a href="/bazar/odhlaseni/" class="link-underline" style="font-size:13px; color:#888;">Odhlásit se</a>
    </div>
  </div>
</Layout>

<style>
  .my-listings {
    border: 1px solid #e8e8e8;
    border-radius: 18px;
    overflow: hidden;
  }
  .my-listing-row {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 16px 20px;
    border-bottom: 1px solid #f0f0f0;
  }
  .my-listing-row:last-child { border-bottom: none; }
  .my-listing-info { flex: 1; min-width: 0; }

  .status-badge {
    font-family: 'Chakra Petch', sans-serif;
    font-size: 11px;
    font-weight: 500;
    padding: 4px 10px;
    border-radius: 6px;
    text-transform: uppercase;
    white-space: nowrap;
  }

  .my-listing-actions {
    display: flex;
    gap: 6px;
    flex-shrink: 0;
  }

  .action-btn {
    font-size: 12px;
    padding: 6px 12px;
    border: 1px solid #e0e0e0;
    border-radius: 6px;
    background: #fff;
    cursor: pointer;
    text-decoration: none;
    color: #555;
    font-family: var(--font-body);
  }
  .action-btn:hover { background: #f5f5f5; }
  .action-delete:hover { background: #fff0f0; color: #c62828; border-color: #ffcdd2; }

  @media (max-width: 768px) {
    .my-listing-row { flex-wrap: wrap; }
    .my-listing-actions { width: 100%; justify-content: flex-end; }
  }
</style>
```

- [ ] **Step 2: Create src/pages/bazar/moje/[id].astro**

```astro
---
import Layout from '../../../layouts/Layout.astro';
import { CATEGORIES, BRANDS } from '../../../lib/bazar-constants';
import { createServerClient } from '../../../lib/supabase';

const user = (Astro.locals as any).user;
const { id } = Astro.params;
const supabase = createServerClient();

// Fetch listing (only if owner)
const { data: listing } = await supabase
  .from('bazar_listings')
  .select('*')
  .eq('id', id)
  .eq('user_id', user.id)
  .single();

if (!listing) {
  return Astro.redirect('/bazar/moje/');
}

let error = '';

if (Astro.request.method === 'POST') {
  const form = await Astro.request.formData();
  const title = form.get('title')?.toString().trim() ?? '';
  const description = form.get('description')?.toString().trim() ?? '';
  const priceStr = form.get('price')?.toString().trim() ?? '';
  const category = form.get('category')?.toString() ?? '';
  const brand = form.get('brand')?.toString() || null;
  const location = form.get('location')?.toString().trim() ?? '';
  const phone = form.get('phone')?.toString().trim() ?? '';
  const email = form.get('email')?.toString().trim() ?? '';

  if (!title || !category || !phone) {
    error = 'Vyplňte název, kategorii a telefon.';
  } else {
    const price = priceStr ? parseInt(priceStr) : null;
    const { error: updateErr } = await supabase
      .from('bazar_listings')
      .update({ title, description, price, category, brand, location, phone, email, updated_at: new Date().toISOString() })
      .eq('id', id)
      .eq('user_id', user.id);

    if (updateErr) {
      error = 'Chyba při ukládání.';
    } else {
      return Astro.redirect('/bazar/moje/');
    }
  }
}
---

<Layout title="Upravit inzerát — Agro bazar">
  <div style="max-width:600px; margin:0 auto; padding:64px 24px 96px;">
    <span class="section-label">Agro bazar</span>
    <h1 style="font-size:clamp(1.8rem,4vw,2.5rem); margin-bottom:32px;">Upravit inzerát</h1>

    {error && <div class="form-error">{error}</div>}

    <form method="POST">
      <div class="form-group">
        <label for="title">Název inzerátu *</label>
        <input type="text" id="title" name="title" class="form-input" value={listing.title} required maxlength="120" />
      </div>

      <div class="form-group">
        <label for="category">Kategorie *</label>
        <select id="category" name="category" class="form-select" required>
          {CATEGORIES.map(c => <option value={c.value} selected={c.value === listing.category}>{c.label}</option>)}
        </select>
      </div>

      <div class="form-group">
        <label for="brand">Značka</label>
        <select id="brand" name="brand" class="form-select">
          <option value="">Bez značky</option>
          {BRANDS.map(b => <option value={b.value} selected={b.value === listing.brand}>{b.label}</option>)}
        </select>
      </div>

      <div class="form-group">
        <label for="price">Cena (Kč) — prázdné = dohodou</label>
        <input type="number" id="price" name="price" class="form-input" min="0" value={listing.price ?? ''} />
      </div>

      <div class="form-group">
        <label for="description">Popis</label>
        <textarea id="description" name="description" class="form-input" rows="6" style="resize:vertical;">{listing.description}</textarea>
      </div>

      <div class="form-group">
        <label for="location">Lokalita *</label>
        <input type="text" id="location" name="location" class="form-input" value={listing.location} required />
      </div>

      <div class="form-group">
        <label for="phone">Telefon *</label>
        <input type="tel" id="phone" name="phone" class="form-input" value={listing.phone} required />
      </div>

      <div class="form-group">
        <label for="email">Email</label>
        <input type="email" id="email" name="email" class="form-input" value={listing.email} />
      </div>

      <button type="submit" class="btn-primary" style="width:100%; justify-content:center;">
        Uložit změny
      </button>
    </form>

    <a href="/bazar/moje/" style="display:block; text-align:center; margin-top:16px; font-size:14px; color:#888; text-decoration:none;">← Zpět na moje inzeráty</a>
  </div>
</Layout>
```

- [ ] **Step 3: Create src/pages/bazar/profil.astro**

```astro
---
import Layout from '../../layouts/Layout.astro';
import { createServerClient } from '../../lib/supabase';

const user = (Astro.locals as any).user;
const supabase = createServerClient();

let error = '';
let success = '';

// Fetch profile
const { data: profile } = await supabase
  .from('bazar_users')
  .select('*')
  .eq('id', user.id)
  .single();

if (Astro.request.method === 'POST') {
  const form = await Astro.request.formData();
  const name = form.get('name')?.toString().trim() ?? '';
  const phone = form.get('phone')?.toString().trim() ?? '';
  const email = form.get('email')?.toString().trim() ?? '';
  const location = form.get('location')?.toString().trim() ?? '';

  if (!name || !phone) {
    error = 'Jméno a telefon jsou povinné.';
  } else {
    const { error: updateErr } = await supabase
      .from('bazar_users')
      .update({ name, phone, email, location })
      .eq('id', user.id);

    if (updateErr) {
      error = 'Chyba při ukládání.';
    } else {
      success = 'Profil uložen.';
    }
  }
}

const p = profile ?? { name: '', phone: '', email: '', location: '' };
---

<Layout title="Profil — Agro bazar">
  <div style="max-width:500px; margin:0 auto; padding:64px 24px 96px;">
    <span class="section-label">Agro bazar</span>
    <h1 style="font-size:clamp(1.8rem,4vw,2.5rem); margin-bottom:32px;">Můj profil</h1>

    {error && <div class="form-error">{error}</div>}
    {success && <div class="form-success">{success}</div>}

    <form method="POST">
      <div class="form-group">
        <label for="name">Jméno / firma *</label>
        <input type="text" id="name" name="name" class="form-input" value={p.name} required />
      </div>
      <div class="form-group">
        <label for="phone">Telefon *</label>
        <input type="tel" id="phone" name="phone" class="form-input" value={p.phone} required />
      </div>
      <div class="form-group">
        <label for="email">Kontaktní email</label>
        <input type="email" id="email" name="email" class="form-input" value={p.email} />
      </div>
      <div class="form-group">
        <label for="location">Město / okres</label>
        <input type="text" id="location" name="location" class="form-input" value={p.location} />
      </div>
      <button type="submit" class="btn-primary" style="width:100%; justify-content:center;">
        Uložit profil
      </button>
    </form>

    <a href="/bazar/moje/" style="display:block; text-align:center; margin-top:16px; font-size:14px; color:#888; text-decoration:none;">← Zpět na moje inzeráty</a>
  </div>
</Layout>
```

- [ ] **Step 4: Commit**

```bash
git add src/pages/bazar/moje/ src/pages/bazar/profil.astro
git commit -m "feat(bazar): add dashboard, edit listing, and profile pages"
```

---

## Task 9: Final Integration + Build Verification

**Files:**
- Modify: `src/components/Header.astro` (add login/pridat inzerat links conditionally — already has Agro bazar link, no change needed)

- [ ] **Step 1: Verify all pages render**

```bash
cd /Users/matejsamec/agro-svet
npm run build
```

Expected: Build completes with Cloudflare adapter. Static pages prerendered. Bazar pages compiled for SSR.

- [ ] **Step 2: Test dev server**

```bash
npm run dev
```

Manually verify:
- `/bazar/` loads (will show empty listings if no DB data)
- `/bazar/registrace/` shows form
- `/bazar/prihlaseni/` shows form
- `/bazar/novy/` redirects to login (no session)
- Existing pages (`/`, `/novinky/`, etc.) still work

- [ ] **Step 3: Final commit**

```bash
git add -A
git commit -m "feat(bazar): complete agro bazar marketplace implementation"
```

---

## Summary

| Task | Description | Files |
|------|-------------|-------|
| 1 | Astro SSR + Supabase setup | config, lib/, .env |
| 2 | Database schema + RLS | supabase/migrations/ |
| 3 | Auth middleware | middleware.ts, env.d.ts |
| 4 | Registration + Login | 3 pages + form styles |
| 5 | Listing page + filters | index.astro + 3 components |
| 6 | Listing detail | [id].astro + gallery |
| 7 | New listing form + upload | novy.astro + ImageUpload |
| 8 | Dashboard + edit + profile | moje/, profil |
| 9 | Integration + build verify | final check |
