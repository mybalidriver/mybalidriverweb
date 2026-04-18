-- scripts/supabase_schema.sql
-- Production-Ready Supabase Schema for Discovering Bali

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. COMPANIES TABLE
-- Manages service partners and rental providers.
CREATE TABLE IF NOT EXISTS public.companies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    rating NUMERIC(2,1) DEFAULT 5.0,
    reviews INTEGER DEFAULT 0,
    location TEXT,
    fleet_size INTEGER DEFAULT 1,
    phone TEXT,
    joined_year TEXT,
    verified BOOLEAN DEFAULT false,
    image TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. LISTINGS TABLE
-- Unified table handling Tours, Spa, Scooters, and Transport
CREATE TABLE IF NOT EXISTS public.listings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type TEXT NOT NULL CHECK (type IN ('Tour', 'Spa', 'Scooter', 'Transport')),
    title TEXT NOT NULL,
    location TEXT,
    price INTEGER NOT NULL,
    duration TEXT,
    category TEXT,
    rating NUMERIC(2,1) DEFAULT 5.0,
    reviews INTEGER DEFAULT 0,
    status TEXT DEFAULT 'Active' CHECK (status IN ('Active', 'Draft')),
    image TEXT,
    company_name TEXT, -- Keeping as TEXT to guarantee backward-compatibility with UI state
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. BLOGS / PLACES TABLE
-- Handles the main content stream and SEO-optimized hidden beaches, guides, etc.
CREATE TABLE IF NOT EXISTS public.blogs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    location TEXT,
    category TEXT,
    slug TEXT UNIQUE NOT NULL,
    meta_description TEXT,
    views TEXT,
    status TEXT DEFAULT 'Published' CHECK (status IN ('Published', 'Draft')),
    image TEXT,
    content TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Security: Enable Row Level Security (RLS)
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;

-- Access Policies (Public can read active/published items)
CREATE POLICY "Allow public read access to active listings" ON public.listings FOR SELECT USING (status = 'Active');
CREATE POLICY "Allow public read access to verified companies" ON public.companies FOR SELECT USING (verified = true);
CREATE POLICY "Allow public read access to published blogs" ON public.blogs FOR SELECT USING (status = 'Published');

-- Service role will automatically bypass RLS for data manipulation.

-- Structured Schema Enhancements (No AI Data)

-- Automatic update trigger function for updated_at timestamps
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers
CREATE TRIGGER update_companies_modtime BEFORE UPDATE ON public.companies FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TRIGGER update_listings_modtime BEFORE UPDATE ON public.listings FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TRIGGER update_blogs_modtime BEFORE UPDATE ON public.blogs FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_listings_status ON public.listings(status);
CREATE INDEX IF NOT EXISTS idx_listings_type ON public.listings(type);
CREATE INDEX IF NOT EXISTS idx_blogs_slug ON public.blogs(slug);
