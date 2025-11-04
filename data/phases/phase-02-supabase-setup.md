# Phase 2: Supabase Foundation

**Duration:** 1 day (6-8 hours)
**Prerequisites:** Phase 1 completed
**Goal:** Set up Supabase project, create database schema, configure authentication, and establish database connection

---

## Overview

In this phase, we'll establish the complete Supabase infrastructure including PostgreSQL database with all tables, Row-Level Security (RLS) policies, authentication configuration, and storage buckets.

## What You'll Build

- ✅ Supabase project created and configured
- ✅ Complete database schema (20 tables)
- ✅ Row-Level Security policies for multi-tenancy
- ✅ Authentication providers configured
- ✅ Storage buckets for media files
- ✅ Supabase client integration in Next.js
- ✅ Database types generated for TypeScript

---

## Step 1: Create Supabase Project (10 minutes)

### 1.1: Sign Up and Create Project

1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project" and sign in with GitHub
3. Click "New Project"
4. Fill in details:
   - **Name:** bltn-clone
   - **Database Password:** Generate strong password (save this!)
   - **Region:** Choose closest to your target audience
   - **Pricing Plan:** Free tier (perfect for development)
5. Click "Create new project"
6. Wait 2-3 minutes for provisioning

### 1.2: Save Your Credentials

In your `.env.local` file, add:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

Find these values in Supabase Dashboard → Settings → API

---

## Step 2: Database Schema Setup (30 minutes)

### 2.1: Create Core Tables

In Supabase Dashboard → SQL Editor → New Query, run this schema:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- CORE TABLES
-- ============================================================================

-- Churches (Tenants)
CREATE TABLE churches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  subdomain TEXT UNIQUE,
  logo_url TEXT,
  primary_color TEXT DEFAULT '#3B82F6',
  address TEXT,
  city TEXT,
  state TEXT,
  zip TEXT,
  phone TEXT,
  email TEXT,
  website TEXT,
  timezone TEXT DEFAULT 'America/Chicago',

  -- Subscription
  subscription_status TEXT DEFAULT 'trial' CHECK (subscription_status IN ('trial', 'active', 'past_due', 'canceled')),
  subscription_plan TEXT DEFAULT 'free' CHECK (subscription_plan IN ('free', 'basic', 'pro', 'enterprise')),
  trial_ends_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '14 days'),
  stripe_customer_id TEXT UNIQUE,
  stripe_subscription_id TEXT UNIQUE,

  -- Limits
  max_members INTEGER DEFAULT 5,
  max_storage_mb INTEGER DEFAULT 100,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Indexes
  CONSTRAINT slug_length CHECK (char_length(slug) >= 3 AND char_length(slug) <= 50)
);

-- Church Members (Users in a church context)
CREATE TABLE church_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  church_id UUID REFERENCES churches(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'editor', 'member')),
  display_name TEXT,
  avatar_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Each user can only be a member of a church once
  UNIQUE(church_id, user_id)
);

-- ============================================================================
-- CONTENT TABLES
-- ============================================================================

-- Announcements
CREATE TABLE announcements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  church_id UUID REFERENCES churches(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT DEFAULT 'general' CHECK (category IN ('general', 'event', 'urgent', 'prayer', 'other')),
  priority INTEGER DEFAULT 0,

  -- Publishing
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'published', 'archived')),
  published_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,

  -- Media
  image_url TEXT,

  -- Tracking
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sermons
CREATE TABLE sermons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  church_id UUID REFERENCES churches(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  speaker TEXT NOT NULL,
  series TEXT,
  scripture_reference TEXT,
  sermon_date DATE NOT NULL,

  -- Media
  audio_url TEXT,
  video_url TEXT,
  thumbnail_url TEXT,
  duration_seconds INTEGER,

  -- Publishing
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  published_at TIMESTAMPTZ,

  -- Tracking
  play_count INTEGER DEFAULT 0,
  download_count INTEGER DEFAULT 0,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Bulletins (Mobile, Print, Email)
CREATE TABLE bulletins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  church_id UUID REFERENCES churches(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  bulletin_type TEXT NOT NULL CHECK (bulletin_type IN ('mobile', 'print', 'email')),
  bulletin_date DATE NOT NULL,

  -- Template
  template_name TEXT DEFAULT 'default',
  theme_color TEXT DEFAULT '#3B82F6',

  -- Publishing
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'published', 'archived')),
  published_at TIMESTAMPTZ,

  -- Stats (for email/mobile)
  sent_count INTEGER DEFAULT 0,
  open_count INTEGER DEFAULT 0,
  click_count INTEGER DEFAULT 0,

  -- Tracking
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Bulletin Blocks (Flexible content blocks for bulletins)
CREATE TABLE bulletin_blocks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  bulletin_id UUID REFERENCES bulletins(id) ON DELETE CASCADE NOT NULL,
  block_type TEXT NOT NULL CHECK (block_type IN ('header', 'text', 'announcement', 'sermon', 'event', 'image', 'divider', 'giving')),
  content JSONB NOT NULL DEFAULT '{}',
  order_index INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Social Media Posts
CREATE TABLE social_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  church_id UUID REFERENCES churches(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  platforms TEXT[] DEFAULT '{}', -- ['facebook', 'instagram', 'twitter']

  -- Media
  media_urls TEXT[] DEFAULT '{}',

  -- Scheduling
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'published', 'failed')),
  scheduled_for TIMESTAMPTZ,
  published_at TIMESTAMPTZ,

  -- External IDs (after posting)
  external_post_ids JSONB DEFAULT '{}', -- {"facebook": "123", "instagram": "456"}

  -- Stats
  engagement_stats JSONB DEFAULT '{}', -- {"likes": 0, "shares": 0, "comments": 0}

  -- Tracking
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- SMS Broadcasts
CREATE TABLE broadcasts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  church_id UUID REFERENCES churches(id) ON DELETE CASCADE NOT NULL,
  message TEXT NOT NULL,

  -- Audience
  recipient_count INTEGER DEFAULT 0,

  -- Scheduling
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'sending', 'sent', 'failed')),
  scheduled_for TIMESTAMPTZ,
  sent_at TIMESTAMPTZ,

  -- Stats
  delivered_count INTEGER DEFAULT 0,
  failed_count INTEGER DEFAULT 0,

  -- Cost tracking
  estimated_cost_cents INTEGER,
  actual_cost_cents INTEGER,

  -- Tracking
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- ENGAGEMENT TABLES
-- ============================================================================

-- Subscribers (for email/SMS)
CREATE TABLE subscribers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  church_id UUID REFERENCES churches(id) ON DELETE CASCADE NOT NULL,
  email TEXT,
  phone TEXT,
  first_name TEXT,
  last_name TEXT,

  -- Preferences
  subscribed_to_email BOOLEAN DEFAULT TRUE,
  subscribed_to_sms BOOLEAN DEFAULT FALSE,

  -- Status
  is_active BOOLEAN DEFAULT TRUE,
  unsubscribed_at TIMESTAMPTZ,

  -- Source tracking
  source TEXT DEFAULT 'manual' CHECK (source IN ('manual', 'import', 'mobile_signup', 'web_signup')),

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- At least one contact method required
  CONSTRAINT contact_method CHECK (email IS NOT NULL OR phone IS NOT NULL)
);

-- Engagement Analytics
CREATE TABLE engagement_stats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  church_id UUID REFERENCES churches(id) ON DELETE CASCADE NOT NULL,

  -- What was engaged with
  content_type TEXT NOT NULL CHECK (content_type IN ('bulletin', 'sermon', 'announcement', 'social_post')),
  content_id UUID NOT NULL,

  -- Engagement type
  event_type TEXT NOT NULL CHECK (event_type IN ('view', 'click', 'share', 'download', 'play', 'open')),

  -- User info (optional - can be anonymous)
  user_id UUID REFERENCES auth.users(id),
  subscriber_id UUID REFERENCES subscribers(id),

  -- Metadata
  metadata JSONB DEFAULT '{}', -- Device, location, referrer, etc.

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- MEDIA LIBRARY
-- ============================================================================

-- Media Items
CREATE TABLE media_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  church_id UUID REFERENCES churches(id) ON DELETE CASCADE NOT NULL,
  filename TEXT NOT NULL,
  storage_path TEXT NOT NULL UNIQUE,
  file_type TEXT NOT NULL CHECK (file_type IN ('image', 'video', 'audio', 'document')),
  mime_type TEXT NOT NULL,
  size_bytes BIGINT NOT NULL,

  -- Metadata
  width INTEGER,
  height INTEGER,
  duration_seconds INTEGER,
  alt_text TEXT,

  -- Organization
  folder TEXT DEFAULT '/',
  tags TEXT[] DEFAULT '{}',

  -- Usage tracking
  used_in_count INTEGER DEFAULT 0,

  uploaded_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

-- Churches
CREATE INDEX idx_churches_slug ON churches(slug);
CREATE INDEX idx_churches_subdomain ON churches(subdomain);
CREATE INDEX idx_churches_subscription_status ON churches(subscription_status);

-- Church Members
CREATE INDEX idx_church_members_church_id ON church_members(church_id);
CREATE INDEX idx_church_members_user_id ON church_members(user_id);
CREATE INDEX idx_church_members_role ON church_members(role);

-- Announcements
CREATE INDEX idx_announcements_church_id ON announcements(church_id);
CREATE INDEX idx_announcements_status ON announcements(status);
CREATE INDEX idx_announcements_published_at ON announcements(published_at);
CREATE INDEX idx_announcements_category ON announcements(category);

-- Sermons
CREATE INDEX idx_sermons_church_id ON sermons(church_id);
CREATE INDEX idx_sermons_status ON sermons(status);
CREATE INDEX idx_sermons_sermon_date ON sermons(sermon_date);
CREATE INDEX idx_sermons_series ON sermons(series);

-- Bulletins
CREATE INDEX idx_bulletins_church_id ON bulletins(church_id);
CREATE INDEX idx_bulletins_type ON bulletins(bulletin_type);
CREATE INDEX idx_bulletins_date ON bulletins(bulletin_date);
CREATE INDEX idx_bulletins_status ON bulletins(status);

-- Bulletin Blocks
CREATE INDEX idx_bulletin_blocks_bulletin_id ON bulletin_blocks(bulletin_id);
CREATE INDEX idx_bulletin_blocks_order ON bulletin_blocks(bulletin_id, order_index);

-- Social Posts
CREATE INDEX idx_social_posts_church_id ON social_posts(church_id);
CREATE INDEX idx_social_posts_status ON social_posts(status);
CREATE INDEX idx_social_posts_scheduled_for ON social_posts(scheduled_for);

-- Broadcasts
CREATE INDEX idx_broadcasts_church_id ON broadcasts(church_id);
CREATE INDEX idx_broadcasts_status ON broadcasts(status);
CREATE INDEX idx_broadcasts_scheduled_for ON broadcasts(scheduled_for);

-- Subscribers
CREATE INDEX idx_subscribers_church_id ON subscribers(church_id);
CREATE INDEX idx_subscribers_email ON subscribers(email);
CREATE INDEX idx_subscribers_phone ON subscribers(phone);
CREATE INDEX idx_subscribers_active ON subscribers(is_active);

-- Engagement Stats
CREATE INDEX idx_engagement_church_id ON engagement_stats(church_id);
CREATE INDEX idx_engagement_content ON engagement_stats(content_type, content_id);
CREATE INDEX idx_engagement_created_at ON engagement_stats(created_at);

-- Media Items
CREATE INDEX idx_media_church_id ON media_items(church_id);
CREATE INDEX idx_media_file_type ON media_items(file_type);
CREATE INDEX idx_media_folder ON media_items(folder);
```

### 2.2: Verify Tables Created

1. Go to Table Editor in Supabase Dashboard
2. You should see all 12 tables listed
3. Click on each table to verify columns

---

## Step 3: Row-Level Security (RLS) Policies (20 minutes)

RLS ensures churches can only access their own data - critical for multi-tenancy.

### 3.1: Enable RLS on All Tables

Run this SQL:

```sql
-- Enable RLS on all tables
ALTER TABLE churches ENABLE ROW LEVEL SECURITY;
ALTER TABLE church_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE sermons ENABLE ROW LEVEL SECURITY;
ALTER TABLE bulletins ENABLE ROW LEVEL SECURITY;
ALTER TABLE bulletin_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE broadcasts ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE engagement_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_items ENABLE ROW LEVEL SECURITY;
```

### 3.2: Create RLS Policies

Run this SQL to create policies for multi-tenant data isolation:

```sql
-- ============================================================================
-- RLS POLICIES - Multi-tenant Data Isolation
-- ============================================================================

-- Helper function to get user's church IDs
CREATE OR REPLACE FUNCTION get_user_church_ids()
RETURNS SETOF UUID AS $$
  SELECT church_id FROM church_members WHERE user_id = auth.uid()
$$ LANGUAGE SQL SECURITY DEFINER;

-- ============================================================================
-- CHURCHES POLICIES
-- ============================================================================

-- Users can view churches they're members of
CREATE POLICY "Users can view their churches"
  ON churches FOR SELECT
  USING (id IN (SELECT get_user_church_ids()));

-- Users with owner/admin role can update their church
CREATE POLICY "Admins can update their church"
  ON churches FOR UPDATE
  USING (
    id IN (
      SELECT church_id FROM church_members
      WHERE user_id = auth.uid()
      AND role IN ('owner', 'admin')
    )
  );

-- ============================================================================
-- CHURCH MEMBERS POLICIES
-- ============================================================================

-- Users can view members of their churches
CREATE POLICY "Users can view church members"
  ON church_members FOR SELECT
  USING (church_id IN (SELECT get_user_church_ids()));

-- Admins can insert new members
CREATE POLICY "Admins can add members"
  ON church_members FOR INSERT
  WITH CHECK (
    church_id IN (
      SELECT church_id FROM church_members
      WHERE user_id = auth.uid()
      AND role IN ('owner', 'admin')
    )
  );

-- Admins can update members
CREATE POLICY "Admins can update members"
  ON church_members FOR UPDATE
  USING (
    church_id IN (
      SELECT church_id FROM church_members
      WHERE user_id = auth.uid()
      AND role IN ('owner', 'admin')
    )
  );

-- Admins can delete members (except owners)
CREATE POLICY "Admins can delete members"
  ON church_members FOR DELETE
  USING (
    church_id IN (
      SELECT church_id FROM church_members
      WHERE user_id = auth.uid()
      AND role IN ('owner', 'admin')
    )
    AND role != 'owner'
  );

-- ============================================================================
-- ANNOUNCEMENTS POLICIES
-- ============================================================================

CREATE POLICY "Users can view announcements"
  ON announcements FOR SELECT
  USING (church_id IN (SELECT get_user_church_ids()));

CREATE POLICY "Editors can create announcements"
  ON announcements FOR INSERT
  WITH CHECK (
    church_id IN (
      SELECT church_id FROM church_members
      WHERE user_id = auth.uid()
      AND role IN ('owner', 'admin', 'editor')
    )
  );

CREATE POLICY "Editors can update announcements"
  ON announcements FOR UPDATE
  USING (
    church_id IN (
      SELECT church_id FROM church_members
      WHERE user_id = auth.uid()
      AND role IN ('owner', 'admin', 'editor')
    )
  );

CREATE POLICY "Editors can delete announcements"
  ON announcements FOR DELETE
  USING (
    church_id IN (
      SELECT church_id FROM church_members
      WHERE user_id = auth.uid()
      AND role IN ('owner', 'admin', 'editor')
    )
  );

-- ============================================================================
-- SERMONS POLICIES (same pattern as announcements)
-- ============================================================================

CREATE POLICY "Users can view sermons"
  ON sermons FOR SELECT
  USING (church_id IN (SELECT get_user_church_ids()));

CREATE POLICY "Editors can create sermons"
  ON sermons FOR INSERT
  WITH CHECK (
    church_id IN (
      SELECT church_id FROM church_members
      WHERE user_id = auth.uid()
      AND role IN ('owner', 'admin', 'editor')
    )
  );

CREATE POLICY "Editors can update sermons"
  ON sermons FOR UPDATE
  USING (
    church_id IN (
      SELECT church_id FROM church_members
      WHERE user_id = auth.uid()
      AND role IN ('owner', 'admin', 'editor')
    )
  );

CREATE POLICY "Editors can delete sermons"
  ON sermons FOR DELETE
  USING (
    church_id IN (
      SELECT church_id FROM church_members
      WHERE user_id = auth.uid()
      AND role IN ('owner', 'admin', 'editor')
    )
  );

-- ============================================================================
-- BULLETINS POLICIES
-- ============================================================================

CREATE POLICY "Users can view bulletins"
  ON bulletins FOR SELECT
  USING (church_id IN (SELECT get_user_church_ids()));

CREATE POLICY "Editors can manage bulletins"
  ON bulletins FOR ALL
  USING (
    church_id IN (
      SELECT church_id FROM church_members
      WHERE user_id = auth.uid()
      AND role IN ('owner', 'admin', 'editor')
    )
  );

-- ============================================================================
-- BULLETIN BLOCKS POLICIES
-- ============================================================================

CREATE POLICY "Users can view bulletin blocks"
  ON bulletin_blocks FOR SELECT
  USING (
    bulletin_id IN (
      SELECT id FROM bulletins
      WHERE church_id IN (SELECT get_user_church_ids())
    )
  );

CREATE POLICY "Editors can manage bulletin blocks"
  ON bulletin_blocks FOR ALL
  USING (
    bulletin_id IN (
      SELECT id FROM bulletins
      WHERE church_id IN (
        SELECT church_id FROM church_members
        WHERE user_id = auth.uid()
        AND role IN ('owner', 'admin', 'editor')
      )
    )
  );

-- ============================================================================
-- SOCIAL POSTS, BROADCASTS, SUBSCRIBERS - Same pattern
-- ============================================================================

-- Social Posts
CREATE POLICY "Users can view social posts"
  ON social_posts FOR SELECT
  USING (church_id IN (SELECT get_user_church_ids()));

CREATE POLICY "Editors can manage social posts"
  ON social_posts FOR ALL
  USING (
    church_id IN (
      SELECT church_id FROM church_members
      WHERE user_id = auth.uid()
      AND role IN ('owner', 'admin', 'editor')
    )
  );

-- Broadcasts
CREATE POLICY "Users can view broadcasts"
  ON broadcasts FOR SELECT
  USING (church_id IN (SELECT get_user_church_ids()));

CREATE POLICY "Editors can manage broadcasts"
  ON broadcasts FOR ALL
  USING (
    church_id IN (
      SELECT church_id FROM church_members
      WHERE user_id = auth.uid()
      AND role IN ('owner', 'admin', 'editor')
    )
  );

-- Subscribers
CREATE POLICY "Users can view subscribers"
  ON subscribers FOR SELECT
  USING (church_id IN (SELECT get_user_church_ids()));

CREATE POLICY "Editors can manage subscribers"
  ON subscribers FOR ALL
  USING (
    church_id IN (
      SELECT church_id FROM church_members
      WHERE user_id = auth.uid()
      AND role IN ('owner', 'admin', 'editor')
    )
  );

-- Media Items
CREATE POLICY "Users can view media"
  ON media_items FOR SELECT
  USING (church_id IN (SELECT get_user_church_ids()));

CREATE POLICY "Editors can manage media"
  ON media_items FOR ALL
  USING (
    church_id IN (
      SELECT church_id FROM church_members
      WHERE user_id = auth.uid()
      AND role IN ('owner', 'admin', 'editor')
    )
  );

-- Engagement Stats (read-only for users)
CREATE POLICY "Users can view engagement stats"
  ON engagement_stats FOR SELECT
  USING (church_id IN (SELECT get_user_church_ids()));

-- Allow system to insert engagement stats
CREATE POLICY "System can insert engagement stats"
  ON engagement_stats FOR INSERT
  WITH CHECK (true);
```

---

## Step 4: Storage Buckets (10 minutes)

### 4.1: Create Storage Buckets

In Supabase Dashboard → Storage → Create bucket:

1. **Bucket name:** `church-media`
   - Public: No
   - File size limit: 50MB
   - Allowed MIME types: `image/*,video/*,audio/*,application/pdf`

2. **Bucket name:** `church-logos`
   - Public: Yes
   - File size limit: 2MB
   - Allowed MIME types: `image/*`

### 4.2: Storage Policies

Run this SQL for storage access:

```sql
-- Church Media Bucket - Only church members can upload
CREATE POLICY "Church members can upload media"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'church-media'
    AND (storage.foldername(name))[1] IN (
      SELECT id::text FROM churches
      WHERE id IN (SELECT get_user_church_ids())
    )
  );

CREATE POLICY "Church members can view their media"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'church-media'
    AND (storage.foldername(name))[1] IN (
      SELECT id::text FROM churches
      WHERE id IN (SELECT get_user_church_ids())
    )
  );

CREATE POLICY "Church members can delete their media"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'church-media'
    AND (storage.foldername(name))[1] IN (
      SELECT id::text FROM churches
      WHERE id IN (SELECT get_user_church_ids())
    )
  );

-- Church Logos - Public read, authenticated write
CREATE POLICY "Anyone can view logos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'church-logos');

CREATE POLICY "Church admins can upload logos"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'church-logos'
    AND (storage.foldername(name))[1] IN (
      SELECT id::text FROM churches
      WHERE id IN (
        SELECT church_id FROM church_members
        WHERE user_id = auth.uid()
        AND role IN ('owner', 'admin')
      )
    )
  );
```

---

## Step 5: Authentication Configuration (15 minutes)

### 5.1: Enable Email Auth

In Supabase Dashboard → Authentication → Providers:

1. **Email** - Already enabled by default
2. Configure email templates:
   - Go to Authentication → Email Templates
   - Customize "Confirm signup" template with your branding
   - Customize "Reset password" template

### 5.2: Configure Site URL

In Authentication → URL Configuration:

```
Site URL: http://localhost:3000
Redirect URLs:
  - http://localhost:3000/auth/callback
  - http://localhost:3000/auth/confirm
```

(We'll update these in Phase 16 for production)

### 5.3: Enable OAuth Providers (Optional)

For future phases, enable:
- Google OAuth
- Microsoft OAuth (for church staff)

---

## Step 6: Supabase Client Setup (20 minutes)

### 6.1: Create Supabase Utilities

Create `lib/supabase/client.ts`:

```typescript
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

### 6.2: Create Server Client

Create `lib/supabase/server.ts`:

```typescript
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch (error) {
            // The `set` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options })
          } catch (error) {
            // The `delete` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )
}
```

### 6.3: Create Middleware for Auth

Create `middleware.ts` in root:

```typescript
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  // Refresh session if expired
  await supabase.auth.getUser()

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
```

---

## Step 7: Generate TypeScript Types (10 minutes)

### 7.1: Install Supabase CLI

```bash
npm install -g supabase
```

### 7.2: Login to Supabase CLI

```bash
supabase login
```

### 7.3: Generate Types

```bash
# Get your project ref from Supabase Dashboard URL
# https://supabase.com/dashboard/project/YOUR_PROJECT_REF

npx supabase gen types typescript --project-id YOUR_PROJECT_REF > types/supabase.ts
```

### 7.4: Create Database Type Helpers

Create `types/database.ts`:

```typescript
import { Database } from './supabase'

export type Church = Database['public']['Tables']['churches']['Row']
export type ChurchInsert = Database['public']['Tables']['churches']['Insert']
export type ChurchUpdate = Database['public']['Tables']['churches']['Update']

export type ChurchMember = Database['public']['Tables']['church_members']['Row']
export type ChurchMemberInsert = Database['public']['Tables']['church_members']['Insert']

export type Announcement = Database['public']['Tables']['announcements']['Row']
export type AnnouncementInsert = Database['public']['Tables']['announcements']['Insert']
export type AnnouncementUpdate = Database['public']['Tables']['announcements']['Update']

export type Sermon = Database['public']['Tables']['sermons']['Row']
export type SermonInsert = Database['public']['Tables']['sermons']['Insert']
export type SermonUpdate = Database['public']['Tables']['sermons']['Update']

export type Bulletin = Database['public']['Tables']['bulletins']['Row']
export type BulletinInsert = Database['public']['Tables']['bulletins']['Insert']
export type BulletinUpdate = Database['public']['Tables']['bulletins']['Update']

export type BulletinBlock = Database['public']['Tables']['bulletin_blocks']['Row']
export type BulletinBlockInsert = Database['public']['Tables']['bulletin_blocks']['Insert']

export type SocialPost = Database['public']['Tables']['social_posts']['Row']
export type SocialPostInsert = Database['public']['Tables']['social_posts']['Insert']

export type Broadcast = Database['public']['Tables']['broadcasts']['Row']
export type BroadcastInsert = Database['public']['Tables']['broadcasts']['Insert']

export type Subscriber = Database['public']['Tables']['subscribers']['Row']
export type SubscriberInsert = Database['public']['Tables']['subscribers']['Insert']

export type EngagementStat = Database['public']['Tables']['engagement_stats']['Row']
export type EngagementStatInsert = Database['public']['Tables']['engagement_stats']['Insert']

export type MediaItem = Database['public']['Tables']['media_items']['Row']
export type MediaItemInsert = Database['public']['Tables']['media_items']['Insert']

// Enums
export type SubscriptionStatus = 'trial' | 'active' | 'past_due' | 'canceled'
export type SubscriptionPlan = 'free' | 'basic' | 'pro' | 'enterprise'
export type UserRole = 'owner' | 'admin' | 'editor' | 'member'
export type ContentStatus = 'draft' | 'scheduled' | 'published' | 'archived'
export type BulletinType = 'mobile' | 'print' | 'email'
export type AnnouncementCategory = 'general' | 'event' | 'urgent' | 'prayer' | 'other'
```

---

## Step 8: Test Database Connection (15 minutes)

### 8.1: Create Test Page

Create `app/test-db/page.tsx`:

```typescript
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function TestDatabasePage() {
  const supabase = await createClient()

  // Test connection
  const { data: churches, error } = await supabase
    .from('churches')
    .select('*')
    .limit(5)

  if (error) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold text-red-600">Database Error</h1>
        <pre className="mt-4 bg-red-50 p-4 rounded">
          {JSON.stringify(error, null, 2)}
        </pre>
      </div>
    )
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-green-600">
        ✅ Database Connected Successfully
      </h1>

      <div className="mt-4">
        <h2 className="text-lg font-semibold">Churches ({churches?.length || 0}):</h2>
        <pre className="mt-2 bg-gray-50 p-4 rounded">
          {JSON.stringify(churches, null, 2)}
        </pre>
      </div>

      <div className="mt-8 space-y-2">
        <h2 className="text-lg font-semibold">Environment Check:</h2>
        <p>✅ NEXT_PUBLIC_SUPABASE_URL: {process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : '❌ Missing'}</p>
        <p>✅ NEXT_PUBLIC_SUPABASE_ANON_KEY: {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set' : '❌ Missing'}</p>
      </div>
    </div>
  )
}
```

### 8.2: Run Test

```bash
npm run dev
```

Visit `http://localhost:3000/test-db`

You should see:
- ✅ Database Connected Successfully
- Empty churches array (we haven't inserted data yet)
- Environment variables confirmed

---

## Step 9: Seed Test Data (Optional - 10 minutes)

### 9.1: Create Seed Script

Create `lib/supabase/seed.sql`:

```sql
-- Insert test church
INSERT INTO churches (slug, name, email, city, state)
VALUES
  ('first-baptist', 'First Baptist Church', 'contact@firstbaptist.com', 'Dallas', 'TX'),
  ('grace-community', 'Grace Community Church', 'hello@gracechurch.com', 'Austin', 'TX')
ON CONFLICT (slug) DO NOTHING;

-- Note: We'll add test users and members in Phase 3 (Authentication)
```

### 9.2: Run Seed

In Supabase Dashboard → SQL Editor → New Query:
- Paste the seed SQL
- Click "Run"

### 9.3: Verify Seed Data

Refresh your `/test-db` page - you should see 2 churches now!

---

## Testing Checklist

Before moving to Phase 3, verify:

- [ ] Supabase project created and accessible
- [ ] All 12 tables created with correct columns
- [ ] RLS enabled on all tables
- [ ] RLS policies created and working
- [ ] Storage buckets created (`church-media`, `church-logos`)
- [ ] Storage policies configured
- [ ] Email authentication enabled
- [ ] Environment variables set in `.env.local`
- [ ] Supabase client utilities created
- [ ] Middleware created for session management
- [ ] TypeScript types generated
- [ ] Database connection test passes
- [ ] Seed data inserted (optional)

---

## Troubleshooting

### "relation does not exist" error
- Make sure you ran all SQL in the correct order
- Check Table Editor to verify tables were created

### RLS policy errors
- Temporarily disable RLS for testing: `ALTER TABLE table_name DISABLE ROW LEVEL SECURITY;`
- Check policies in Dashboard → Authentication → Policies

### Type generation fails
- Verify Supabase CLI is installed: `supabase --version`
- Check project ref is correct
- Make sure you're logged in: `supabase login`

### Environment variables not loading
- Restart dev server after adding to `.env.local`
- Make sure file is in project root
- Check for typos in variable names

---

## Commit Your Changes

```bash
git add .
git commit -m "feat: Complete Phase 2 - Supabase foundation with database schema, RLS policies, and TypeScript types"
git push
```

---

## Next Steps

Phase 2 Complete! 🎉

**Next Phase:** [Phase 3 - Authentication System](phase-03-authentication.md)

In Phase 3, we'll build:
- Login/signup flows
- Email verification
- Password reset
- Protected routes
- User session management

---

**Estimated Time:** 1 day
**Difficulty:** ⭐⭐⭐ Intermediate
**Phase Status:** ⚪ Not Started → 🟢 Complete
