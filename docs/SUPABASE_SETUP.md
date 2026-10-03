# Supabase Setup Guide for Parent Teacher App

This document provides the SQL schema and instructions to set up **Supabase** as the authentication & database provider for your Parent Teacher App.

---

## 🚀 Quick Setup (3 Steps)

### Step 1: Create a Supabase Project
1. Go to [https://supabase.com](https://supabase.com) and log in.
2. Click **"New Project"**.
3. Choose your organization, project name (e.g. `parent-teacher-app`), and database password.
4. Select a region close to your users.

---

### Step 2: Get Your Supabase API Keys
1. In your Supabase Project Dashboard, go to **Project Settings** (gear icon) ➔ **API**.
2. Copy the following:
   - **Project URL** (`https://<project-ref>.supabase.co`)
   - **Project API Anon Key** (`eyJhbGciOi...`)

Add them to your Vercel Project Environment Variables:

| Key | Example Value | Description |
|---|---|---|
| `EXPO_PUBLIC_SUPABASE_URL` | `https://xyzproject.supabase.co` | Your Supabase Project URL |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGciOi...` | Your Supabase Public Anon Key |

---

### Step 3: Run the SQL Schema in Supabase
1. In the Supabase Dashboard, click **SQL Editor** on the left menu.
2. Click **"New query"** and paste the SQL script below, then click **Run**:

```sql
-- 1. PROFILES TABLE (Auto-synced with Supabase Auth)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL CHECK (role IN ('PARENT', 'TEACHER', 'ADMIN')),
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by authenticated users"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- 2. TRIGGER TO AUTOMATICALLY INSERT PROFILE ON SIGNUP
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, role, phone)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'role', 'PARENT'),
    NEW.raw_user_meta_data->>'phone'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 3. ANNOUNCEMENTS TABLE
CREATE TABLE IF NOT EXISTS public.announcements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('GENERAL', 'ACADEMIC', 'EVENT', 'HOLIDAY', 'EXAM', 'EMERGENCY')),
  author_id UUID REFERENCES public.profiles(id),
  author_name TEXT NOT NULL,
  is_featured BOOLEAN DEFAULT false,
  event_date TEXT,
  attachment_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read announcements" ON public.announcements FOR SELECT TO authenticated USING (true);
CREATE POLICY "Teachers and Admins can create announcements" ON public.announcements FOR INSERT TO authenticated WITH CHECK (true);

-- 4. HOMEWORK TABLE
CREATE TABLE IF NOT EXISTS public.homework (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  subject TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  assigned_date DATE DEFAULT CURRENT_DATE NOT NULL,
  due_date DATE NOT NULL,
  due_label TEXT,
  teacher_id UUID REFERENCES public.profiles(id),
  teacher_name TEXT NOT NULL,
  status TEXT DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'SUBMITTED', 'GRADED')),
  attachment_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.homework ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view homework" ON public.homework FOR SELECT TO authenticated USING (true);
CREATE POLICY "Teachers can insert homework" ON public.homework FOR INSERT TO authenticated WITH CHECK (true);

-- 5. MESSAGES TABLE
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_id UUID REFERENCES public.profiles(id) NOT NULL,
  sender_name TEXT NOT NULL,
  recipient_id UUID REFERENCES public.profiles(id) NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own messages" ON public.messages FOR SELECT TO authenticated
  USING (auth.uid() = sender_id OR auth.uid() = recipient_id);
CREATE POLICY "Users can send messages" ON public.messages FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = sender_id);
```

---

## 📱 How to create users in Supabase:
1. Users can register through the app's **Register** screen.
2. Or you can manually add users in Supabase Dashboard ➔ **Authentication** ➔ **Users** ➔ **Add User** (enter email & password, and in User Metadata add `{"role": "TEACHER", "name": "Sarah"}`).
