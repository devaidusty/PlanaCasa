-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── Enums ────────────────────────────────────────────────────────────────────

CREATE TYPE design_style AS ENUM (
  'modern_filipino', 'tropical_modern', 'european_modern',
  'uk_contemporary', 'scandinavian', 'ofw_dream',
  'small_lot', 'two_storey_rental', 'bungalow'
);

CREATE TYPE guide_category AS ENUM (
  'foundation', 'structural', 'roofing', 'electrical',
  'plumbing', 'finishing', 'permits', 'budgeting', 'diy_tips'
);

CREATE TYPE customization_status AS ENUM (
  'pending', 'reviewing', 'quoted', 'completed'
);

CREATE TYPE listing_tier AS ENUM ('free', 'verified', 'featured');

CREATE TYPE user_role AS ENUM ('customer', 'admin');

-- ─── Tables ───────────────────────────────────────────────────────────────────

-- Users table (extends Supabase auth.users)
CREATE TABLE public.users (
  id                UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name         TEXT,
  email             TEXT,
  phone             TEXT,
  location_city     TEXT,
  location_province TEXT,
  location_country  TEXT DEFAULT 'Philippines',
  avatar_url        TEXT,
  role              user_role NOT NULL DEFAULT 'customer',
  created_at        TIMESTAMPTZ DEFAULT NOW()
);

-- Designs table
CREATE TABLE public.designs (
  id                        UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title                     TEXT NOT NULL,
  slug                      TEXT UNIQUE NOT NULL,
  description               TEXT,
  style                     design_style NOT NULL,
  bedrooms                  INTEGER NOT NULL DEFAULT 3,
  bathrooms                 INTEGER NOT NULL DEFAULT 2,
  floor_area_sqm            NUMERIC NOT NULL,
  lot_area_sqm              NUMERIC,
  estimated_build_cost_min  NUMERIC NOT NULL,
  estimated_build_cost_max  NUMERIC NOT NULL,
  plan_price                NUMERIC NOT NULL,
  floors                    INTEGER NOT NULL DEFAULT 1,
  garage                    BOOLEAN DEFAULT FALSE,
  featured                  BOOLEAN DEFAULT FALSE,
  climate_notes             TEXT,
  preview_images            TEXT[] DEFAULT '{}',
  floor_plan_images         TEXT[] DEFAULT '{}',
  tags                      TEXT[] DEFAULT '{}',
  created_at                TIMESTAMPTZ DEFAULT NOW(),
  updated_at                TIMESTAMPTZ DEFAULT NOW()
);

-- Design packages
CREATE TABLE public.design_packages (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  design_id    UUID NOT NULL REFERENCES public.designs(id) ON DELETE CASCADE,
  package_name TEXT NOT NULL CHECK (package_name IN ('Basic', 'Standard', 'Premium')),
  price        NUMERIC NOT NULL,
  includes     TEXT[] DEFAULT '{}',
  file_urls    TEXT[] DEFAULT '{}'
);

-- Purchases
CREATE TABLE public.purchases (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id        UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  design_id      UUID NOT NULL REFERENCES public.designs(id),
  package_id     UUID NOT NULL REFERENCES public.design_packages(id),
  amount_paid    NUMERIC NOT NULL,
  currency       TEXT NOT NULL DEFAULT 'PHP',
  payment_method TEXT NOT NULL DEFAULT 'mock',
  payment_status TEXT NOT NULL DEFAULT 'pending'
                 CHECK (payment_status IN ('pending', 'completed', 'failed')),
  transaction_id TEXT UNIQUE,
  download_count INTEGER DEFAULT 0,
  max_downloads  INTEGER DEFAULT 5,
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

-- Contractors
CREATE TABLE public.contractors (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_name     TEXT NOT NULL,
  owner_name        TEXT,
  description       TEXT,
  city              TEXT,
  province          TEXT,
  region            TEXT,
  coverage_areas    TEXT[] DEFAULT '{}',
  specializations   TEXT[] DEFAULT '{}',
  years_experience  INTEGER DEFAULT 0,
  license_number    TEXT,
  pcab_accredited   BOOLEAN DEFAULT FALSE,
  prc_licensed      BOOLEAN DEFAULT FALSE,
  portfolio_images  TEXT[] DEFAULT '{}',
  contact_phone     TEXT,
  contact_email     TEXT,
  contact_messenger TEXT,
  facebook_page     TEXT,
  price_range_min   NUMERIC,
  price_range_max   NUMERIC,
  is_verified       BOOLEAN DEFAULT FALSE,
  is_featured       BOOLEAN DEFAULT FALSE,
  listing_tier      listing_tier DEFAULT 'free',
  average_rating    NUMERIC DEFAULT 0,
  total_reviews     INTEGER DEFAULT 0,
  created_at        TIMESTAMPTZ DEFAULT NOW()
);

-- Contractor reviews
CREATE TABLE public.contractor_reviews (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  contractor_id    UUID NOT NULL REFERENCES public.contractors(id) ON DELETE CASCADE,
  user_id          UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  purchase_id      UUID REFERENCES public.purchases(id),
  rating           INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  review_text      TEXT,
  project_type     TEXT,
  project_location TEXT,
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(contractor_id, user_id)
);

-- Guides
CREATE TABLE public.guides (
  id                 UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title              TEXT NOT NULL,
  slug               TEXT UNIQUE NOT NULL,
  excerpt            TEXT,
  content            TEXT,
  category           guide_category NOT NULL,
  read_time_minutes  INTEGER DEFAULT 5,
  cover_image        TEXT,
  is_free            BOOLEAN DEFAULT TRUE,
  tags               TEXT[] DEFAULT '{}',
  created_at         TIMESTAMPTZ DEFAULT NOW()
);

-- Cost calculator data
CREATE TABLE public.cost_calculator_data (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  region            TEXT NOT NULL,
  province          TEXT NOT NULL,
  cost_per_sqm_low  NUMERIC NOT NULL,
  cost_per_sqm_mid  NUMERIC NOT NULL,
  cost_per_sqm_high NUMERIC NOT NULL,
  last_updated      TIMESTAMPTZ DEFAULT NOW()
);

-- Customization requests
CREATE TABLE public.customization_requests (
  id                 UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id            UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  design_id          UUID NOT NULL REFERENCES public.designs(id),
  changes_requested  TEXT NOT NULL,
  budget             NUMERIC,
  contact_phone      TEXT,
  status             customization_status DEFAULT 'pending',
  created_at         TIMESTAMPTZ DEFAULT NOW()
);

-- Newsletter subscribers
CREATE TABLE public.newsletter_subscribers (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email         TEXT UNIQUE NOT NULL,
  name          TEXT,
  source        TEXT DEFAULT 'website',
  subscribed_at TIMESTAMPTZ DEFAULT NOW()
);

-- Wishlists
CREATE TABLE public.wishlists (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id    UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  design_id  UUID NOT NULL REFERENCES public.designs(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, design_id)
);

-- ─── Indexes ──────────────────────────────────────────────────────────────────

CREATE INDEX idx_designs_slug       ON public.designs(slug);
CREATE INDEX idx_designs_style      ON public.designs(style);
CREATE INDEX idx_designs_featured   ON public.designs(featured);
CREATE INDEX idx_designs_bedrooms   ON public.designs(bedrooms);
CREATE INDEX idx_contractors_province  ON public.contractors(province);
CREATE INDEX idx_contractors_featured  ON public.contractors(is_featured, is_verified);
CREATE INDEX idx_purchases_user     ON public.purchases(user_id);
CREATE INDEX idx_wishlists_user     ON public.wishlists(user_id);

-- ─── Triggers ─────────────────────────────────────────────────────────────────

-- Auto-update updated_at on designs
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER designs_updated_at
  BEFORE UPDATE ON public.designs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Auto-compute contractor average rating
CREATE OR REPLACE FUNCTION update_contractor_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.contractors
  SET
    average_rating = (
      SELECT AVG(rating)
      FROM public.contractor_reviews
      WHERE contractor_id = COALESCE(NEW.contractor_id, OLD.contractor_id)
    ),
    total_reviews = (
      SELECT COUNT(*)
      FROM public.contractor_reviews
      WHERE contractor_id = COALESCE(NEW.contractor_id, OLD.contractor_id)
    )
  WHERE id = COALESCE(NEW.contractor_id, OLD.contractor_id);
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER contractor_rating_update
  AFTER INSERT OR UPDATE OR DELETE ON public.contractor_reviews
  FOR EACH ROW EXECUTE FUNCTION update_contractor_rating();

-- Auto-create user profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ─── Row Level Security ───────────────────────────────────────────────────────

ALTER TABLE public.users                  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.designs                ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.design_packages        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchases              ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contractors            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contractor_reviews     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guides                 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cost_calculator_data   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customization_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlists              ENABLE ROW LEVEL SECURITY;

-- ─── RLS Policies ─────────────────────────────────────────────────────────────

-- Users
CREATE POLICY "Users can read own profile"
  ON public.users FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.users FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admin reads all users"
  ON public.users FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

-- Designs
CREATE POLICY "Designs are publicly readable"
  ON public.designs FOR SELECT USING (TRUE);

CREATE POLICY "Admin can manage designs"
  ON public.designs FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

-- Design packages
CREATE POLICY "Packages are publicly readable"
  ON public.design_packages FOR SELECT USING (TRUE);

CREATE POLICY "Admin can manage packages"
  ON public.design_packages FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

-- Purchases
CREATE POLICY "Users can read own purchases"
  ON public.purchases FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admin reads all purchases"
  ON public.purchases FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

-- Contractors
CREATE POLICY "Contractors are publicly readable"
  ON public.contractors FOR SELECT USING (TRUE);

CREATE POLICY "Admin can manage contractors"
  ON public.contractors FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

-- Reviews
CREATE POLICY "Reviews are publicly readable"
  ON public.contractor_reviews FOR SELECT USING (TRUE);

CREATE POLICY "Authenticated users can write reviews"
  ON public.contractor_reviews FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reviews"
  ON public.contractor_reviews FOR UPDATE USING (auth.uid() = user_id);

-- Guides
CREATE POLICY "Guides are publicly readable"
  ON public.guides FOR SELECT USING (TRUE);

CREATE POLICY "Admin can manage guides"
  ON public.guides FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

-- Cost data
CREATE POLICY "Cost data is publicly readable"
  ON public.cost_calculator_data FOR SELECT USING (TRUE);

-- Customization requests
CREATE POLICY "Users can manage own requests"
  ON public.customization_requests FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Admin reads all requests"
  ON public.customization_requests FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

-- Newsletter
CREATE POLICY "Anyone can subscribe"
  ON public.newsletter_subscribers FOR INSERT WITH CHECK (TRUE);

CREATE POLICY "Admin reads subscribers"
  ON public.newsletter_subscribers FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

-- Wishlists
CREATE POLICY "Users manage own wishlist"
  ON public.wishlists FOR ALL USING (auth.uid() = user_id);
