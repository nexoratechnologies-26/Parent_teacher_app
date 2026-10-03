-- ==============================================================================
-- SUPABASE FULL SEED SCRIPT: PARENT TEACHER APP
-- Copy and paste this entire script into your Supabase SQL Editor and click RUN.
-- ==============================================================================

-- 1. Enable pgcrypto for password hashing
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 2. Create Profiles Table (if not already created)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL CHECK (role IN ('PARENT', 'TEACHER', 'ADMIN')),
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public profiles are viewable by authenticated users" ON public.profiles;
CREATE POLICY "Public profiles are viewable by authenticated users"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- 3. Create Demo Users in auth.users (Pre-confirmed with password 'password123')
-- Parent User (UUID: 11111111-1111-1111-1111-111111111111)
INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password,
  email_confirmed_at, recovery_sent_at, last_sign_in_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
  confirmation_token, email_change, email_change_token_new, recovery_token
)
VALUES (
  '00000000-0000-0000-0000-000000000000',
  '11111111-1111-1111-1111-111111111111',
  'authenticated',
  'authenticated',
  'parent.demo@gmail.com',
  crypt('password123', gen_salt('bf')),
  now(), now(), now(),
  '{"provider":"email","providers":["email"]}',
  '{"name":"Kishore Mohan","role":"PARENT","phone":"+91 9876543210"}',
  now(), now(), '', '', '', ''
)
ON CONFLICT (id) DO UPDATE SET
  encrypted_password = crypt('password123', gen_salt('bf')),
  raw_user_meta_data = '{"name":"Kishore Mohan","role":"PARENT","phone":"+91 9876543210"}';

-- Teacher User (UUID: 22222222-2222-2222-2222-222222222222)
INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password,
  email_confirmed_at, recovery_sent_at, last_sign_in_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
  confirmation_token, email_change, email_change_token_new, recovery_token
)
VALUES (
  '00000000-0000-0000-0000-000000000000',
  '22222222-2222-2222-2222-222222222222',
  'authenticated',
  'authenticated',
  'teacher.demo@gmail.com',
  crypt('password123', gen_salt('bf')),
  now(), now(), now(),
  '{"provider":"email","providers":["email"]}',
  '{"name":"Sarah Jenkins","role":"TEACHER","phone":"+91 9876543211"}',
  now(), now(), '', '', '', ''
)
ON CONFLICT (id) DO UPDATE SET
  encrypted_password = crypt('password123', gen_salt('bf')),
  raw_user_meta_data = '{"name":"Sarah Jenkins","role":"TEACHER","phone":"+91 9876543211"}';

-- 4. Seed Profiles Table
INSERT INTO public.profiles (id, name, email, role, phone)
VALUES
  ('11111111-1111-1111-1111-111111111111', 'Kishore Mohan', 'parent.demo@gmail.com', 'PARENT', '+91 9876543210'),
  ('22222222-2222-2222-2222-222222222222', 'Sarah Jenkins', 'teacher.demo@gmail.com', 'TEACHER', '+91 9876543211')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  role = EXCLUDED.role;

-- 5. Seed Announcements Table
CREATE TABLE IF NOT EXISTS public.announcements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  category TEXT NOT NULL,
  author_id UUID REFERENCES public.profiles(id),
  author_name TEXT NOT NULL,
  is_featured BOOLEAN DEFAULT false,
  event_date TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

INSERT INTO public.announcements (title, body, category, author_id, author_name, is_featured, event_date)
VALUES
  ('Annual Sports Day 2026', 'Join us for exciting athletic track events and fun activities!', 'EVENT', '22222222-2222-2222-2222-222222222222', 'Ms. Sarah', true, '24 Aug 2026'),
  ('Midterm Examination Timetable', 'Midterm examinations begin next Monday. Please review the syllabus.', 'EXAM', '22222222-2222-2222-2222-222222222222', 'Ms. Sarah', false, '18 Aug 2026');
