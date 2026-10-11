-- ==============================================================================
-- VELVET 18+ AI CONTENT PLATFORM - SUPABASE POSTGRESQL SCHEMA & RLS POLICIES
-- PAYMENT GATEWAY: CASHFREE PAYMENTS (UPI, CARDS, NETBANKING)
-- SUPABASE STORAGE: "user-uploads" (Img2Img & Video reference keyframes)
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES TABLE (Mirrors Supabase Auth Users with Role & Credits)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    display_name TEXT DEFAULT 'Creator',
    avatar_url TEXT,
    credits NUMERIC(10, 2) DEFAULT 10.00 NOT NULL,
    plan TEXT DEFAULT 'free' CHECK (plan IN ('free', 'basic', 'pro', 'unlimited')),
    role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')) NOT NULL,
    is_banned BOOLEAN DEFAULT FALSE NOT NULL,
    is_age_verified BOOLEAN DEFAULT FALSE NOT NULL,
    age_verified_at TIMESTAMP WITH TIME ZONE,
    cashfree_customer_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. API PROVIDERS TABLE (Admin AI Endpoint Management)
CREATE TABLE IF NOT EXISTS public.api_providers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    api_key TEXT NOT NULL, -- Encrypted or server-side protected
    base_url TEXT NOT NULL,
    model_name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('image', 'video', 'chat')),
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    credits_cost NUMERIC(5, 2) DEFAULT 1.00 NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. AI MODELS TABLE (User-facing model catalog managed by Admin)
CREATE TABLE IF NOT EXISTS public.ai_models (
    id TEXT PRIMARY KEY,
    display_name TEXT NOT NULL,
    description TEXT,
    provider_id UUID REFERENCES public.api_providers(id) ON DELETE SET NULL,
    type TEXT NOT NULL CHECK (type IN ('image', 'video', 'chat')),
    credits_cost NUMERIC(5, 2) DEFAULT 1.00 NOT NULL,
    is_18_plus BOOLEAN DEFAULT TRUE NOT NULL,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    sort_order INTEGER DEFAULT 1 NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. GENERATIONS TABLE (Supports Image, Video, Chat & Img2Img references)
CREATE TABLE IF NOT EXISTS public.generations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('image', 'video', 'chat')),
    prompt TEXT NOT NULL,
    negative_prompt TEXT,
    model TEXT NOT NULL,
    aspect_ratio TEXT,
    duration INTEGER,
    motion_intensity INTEGER,
    seed BIGINT,
    result_url TEXT,
    reference_image_url TEXT,
    reference_strength NUMERIC(3, 2),
    is_img2img BOOLEAN DEFAULT FALSE,
    media_type TEXT DEFAULT 'image' CHECK (media_type IN ('image', 'video', 'text')),
    credits_used NUMERIC(5, 2) DEFAULT 1.00 NOT NULL,
    status TEXT DEFAULT 'completed' CHECK (status IN ('processing', 'completed', 'failed')),
    flagged BOOLEAN DEFAULT FALSE,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. CREDIT TRANSACTIONS TABLE (LEDGER - CASHFREE INTEGRATED)
CREATE TABLE IF NOT EXISTS public.credit_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    amount NUMERIC(10, 2) NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('generation', 'refund', 'purchase', 'subscription', 'signup_bonus', 'admin_adjustment')),
    description TEXT NOT NULL,
    status TEXT DEFAULT 'succeeded' CHECK (status IN ('succeeded', 'refunded', 'pending', 'failed')),
    invoice_id TEXT,
    cashfree_order_id TEXT,
    cashfree_payment_id TEXT,
    payment_gateway TEXT DEFAULT 'cashfree',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. CASHFREE ORDERS LEDGER
CREATE TABLE IF NOT EXISTS public.cashfree_orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id TEXT NOT NULL UNIQUE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    user_email TEXT NOT NULL,
    amount_inr NUMERIC(10, 2) NOT NULL,
    credits NUMERIC(10, 2) NOT NULL,
    status TEXT DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'PAID', 'FAILED', 'REFUNDED')),
    payment_session_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. API KEYS TABLE (For programmatic developers)
CREATE TABLE IF NOT EXISTS public.api_keys (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    key_prefix TEXT NOT NULL,
    key_hash TEXT NOT NULL,
    last_used_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. CONTENT MODERATION AUDIT LOGS
CREATE TABLE IF NOT EXISTS public.moderation_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    prompt_snippet TEXT NOT NULL,
    violation_category TEXT CHECK (violation_category IN ('underage', 'non_consensual', 'violence', 'real_person', 'illegal', NULL)),
    blocked BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 9. CONTENT REPORTS / FLAGS
CREATE TABLE IF NOT EXISTS public.reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    generation_id UUID NOT NULL REFERENCES public.generations(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    reason TEXT NOT NULL CHECK (reason IN ('inappropriate_content', 'copyright', 'low_quality', 'safety_hazard', 'other')),
    notes TEXT,
    status TEXT DEFAULT 'investigating' CHECK (status IN ('investigating', 'resolved', 'dismissed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 10. SITE SETTINGS TABLE
CREATE TABLE IF NOT EXISTS public.site_settings (
    id TEXT PRIMARY KEY DEFAULT 'default_settings',
    site_name TEXT DEFAULT 'VELVET 18+ AI',
    logo_text TEXT DEFAULT 'VELVET 18+',
    accent_color TEXT DEFAULT '#E11D48',
    age_verification_required BOOLEAN DEFAULT TRUE,
    signup_credits NUMERIC(5, 2) DEFAULT 10.00,
    rate_limit_per_minute INTEGER DEFAULT 10,
    maintenance_mode BOOLEAN DEFAULT FALSE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- SUPABASE STORAGE BUCKET: "user-uploads"
-- ==============================================================================
-- Storage bucket for reference images (Img2Img) and source keyframes
INSERT INTO storage.buckets (id, name, public)
VALUES ('user-uploads', 'user-uploads', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public Read user-uploads" ON storage.objects
    FOR SELECT USING (bucket_id = 'user-uploads');

CREATE POLICY "Authenticated users can upload user-uploads" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'user-uploads' AND auth.role() = 'authenticated');

-- ==============================================================================
-- ROW-LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.api_providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_models ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.generations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credit_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cashfree_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.moderation_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can view and edit only their own profile, Admins can view all
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id OR (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id OR (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin');

-- API Providers: Only Admins can view or manage API providers
CREATE POLICY "Admin can view api providers" ON public.api_providers
    FOR SELECT USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Admin can manage api providers" ON public.api_providers
    FOR ALL USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin');

-- AI Models: Public/users can view active models, Admins can manage all
CREATE POLICY "Anyone can view active models" ON public.ai_models
    FOR SELECT USING (is_active = TRUE OR (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Admin can manage models" ON public.ai_models
    FOR ALL USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin');

-- Generations: Users can access and delete only their own generations, Admins can view all
CREATE POLICY "Users can view own generations" ON public.generations
    FOR SELECT USING (auth.uid() = user_id OR (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Users can insert own generations" ON public.generations
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own generations" ON public.generations
    FOR DELETE USING (auth.uid() = user_id OR (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin');

-- Credit Transactions: Users can view only their own transaction ledger
CREATE POLICY "Users can view own transactions" ON public.credit_transactions
    FOR SELECT USING (auth.uid() = user_id OR (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin');

-- Cashfree Orders: Users can view their own orders
CREATE POLICY "Users can view own orders" ON public.cashfree_orders
    FOR SELECT USING (auth.uid() = user_id OR (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin');

-- API Keys: Users can manage only their own keys
CREATE POLICY "Users can manage own api keys" ON public.api_keys
    FOR ALL USING (auth.uid() = user_id);

-- Reports: Authenticated users can insert reports, Admins can view and resolve
CREATE POLICY "Users can create reports" ON public.reports
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admin can view and update reports" ON public.reports
    FOR ALL USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin');

-- Site Settings: Anyone can read, only admin can update
CREATE POLICY "Public read site settings" ON public.site_settings
    FOR SELECT USING (true);

CREATE POLICY "Admin manage site settings" ON public.site_settings
    FOR ALL USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin');

-- ==============================================================================
-- AUTOMATED USER SIGNUP TRIGGER (New Supabase User gets 10 Free Credits & Role)
-- ==============================================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
    INSERT INTO public.profiles (id, email, display_name, credits, plan, role, is_age_verified, age_verified_at)
    VALUES (
        new.id,
        new.email,
        COALESCE(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1)),
        CASE WHEN LOWER(new.email) = 'rajsiba2005@gmail.com' THEN 9999.00 ELSE 10.00 END,
        CASE WHEN LOWER(new.email) = 'rajsiba2005@gmail.com' THEN 'unlimited' ELSE 'free' END,
        COALESCE(new.raw_user_meta_data->>'role', CASE WHEN LOWER(new.email) = 'rajsiba2005@gmail.com' THEN 'admin' ELSE 'user' END),
        COALESCE((new.raw_user_meta_data->>'is_age_verified')::boolean, true),
        timezone('utc'::text, now())
    );

    -- Log welcome transaction bonus
    INSERT INTO public.credit_transactions (user_id, amount, type, description, status)
    VALUES (
        new.id,
        10.00,
        'signup_bonus',
        'Welcome bonus: 10 free credits (Supabase Auth)',
        'succeeded'
    );

    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
