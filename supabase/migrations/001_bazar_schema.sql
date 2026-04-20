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
