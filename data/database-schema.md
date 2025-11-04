# bltn Clone - Database Schema

## PostgreSQL Database Design for Supabase

This schema follows PostgreSQL best practices with proper indexing, foreign keys, and Row-Level Security (RLS) policies for multi-tenant isolation.

---

## Core Tables

### 1. **profiles** (extends Supabase auth.users)
```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_profiles_email ON profiles(email);
```

### 2. **churches**
```sql
CREATE TABLE churches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,           -- URL-friendly identifier
  name TEXT NOT NULL,
  logo_url TEXT,
  website TEXT,

  -- Location
  address_line1 TEXT,
  address_line2 TEXT,
  city TEXT,
  state TEXT,
  zip TEXT,
  timezone TEXT DEFAULT 'America/New_York',

  -- Service info
  service_day TEXT DEFAULT 'Sunday',
  service_time TIME,

  -- Social media
  facebook_url TEXT,
  twitter_url TEXT,
  instagram_url TEXT,
  vimeo_url TEXT,
  youtube_url TEXT,

  -- SMS/Email subscription code
  subscription_code TEXT UNIQUE,       -- e.g., "temp5015"

  -- Billing
  stripe_customer_id TEXT UNIQUE,
  subscription_status TEXT DEFAULT 'trial',  -- trial, active, cancelled, past_due
  subscription_plan TEXT,              -- starter, growth, premium
  trial_ends_at TIMESTAMPTZ,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_churches_slug ON churches(slug);
CREATE INDEX idx_churches_subscription_code ON churches(subscription_code);
CREATE INDEX idx_churches_stripe_customer_id ON churches(stripe_customer_id);
```

### 3. **church_members** (team members/users)
```sql
CREATE TABLE church_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  church_id UUID NOT NULL REFERENCES churches(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'editor',  -- admin, editor, viewer
  invited_by UUID REFERENCES auth.users(id),
  joined_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(church_id, user_id)
);

CREATE INDEX idx_church_members_church_id ON church_members(church_id);
CREATE INDEX idx_church_members_user_id ON church_members(user_id);
```

---

## Content Tables

### 4. **announcements**
```sql
CREATE TABLE announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  church_id UUID NOT NULL REFERENCES churches(id) ON DELETE CASCADE,

  -- Content
  headline TEXT NOT NULL,
  body TEXT,                           -- Rich text (HTML or JSON)
  image_url TEXT,

  -- Event details (if is_event = true)
  is_event BOOLEAN DEFAULT FALSE,
  event_date DATE,
  event_time TIME,
  event_location TEXT,

  -- Call to action
  has_cta BOOLEAN DEFAULT FALSE,
  cta_text TEXT,
  cta_url TEXT,

  -- Promotion schedule
  promotion_type TEXT DEFAULT 'this_weekend',  -- this_weekend, weekend_before_of, weekly, monthly
  start_date DATE,
  end_date DATE,

  -- Metadata
  status TEXT DEFAULT 'active',        -- active, finished, archived
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_announcements_church_id ON announcements(church_id);
CREATE INDEX idx_announcements_status ON announcements(status);
CREATE INDEX idx_announcements_promotion_dates ON announcements(start_date, end_date);
```

### 5. **sermons**
```sql
CREATE TABLE sermons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  church_id UUID NOT NULL REFERENCES churches(id) ON DELETE CASCADE,

  -- Content
  title TEXT NOT NULL,
  description TEXT,
  speaker TEXT,
  sermon_date DATE NOT NULL,

  -- Series (optional)
  series_name TEXT,
  series_part INTEGER,

  -- Media
  audio_url TEXT,
  video_url TEXT,
  thumbnail_url TEXT,

  -- Scripture references
  scripture_references TEXT[],         -- Array of references

  -- Metadata
  status TEXT DEFAULT 'future',        -- future, past
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_sermons_church_id ON sermons(church_id);
CREATE INDEX idx_sermons_date ON sermons(sermon_date DESC);
CREATE INDEX idx_sermons_series ON sermons(series_name);
```

### 6. **giving_records**
```sql
CREATE TABLE giving_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  church_id UUID NOT NULL REFERENCES churches(id) ON DELETE CASCADE,

  -- Giving data
  amount DECIMAL(10, 2) NOT NULL,
  record_date DATE NOT NULL,
  notes TEXT,

  -- Metadata
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_giving_records_church_id ON giving_records(church_id);
CREATE INDEX idx_giving_records_date ON giving_records(record_date DESC);
```

### 7. **giving_settings**
```sql
CREATE TABLE giving_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  church_id UUID UNIQUE NOT NULL REFERENCES churches(id) ON DELETE CASCADE,

  fiscal_year_start DATE,
  yearly_goal DECIMAL(12, 2),

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## Bulletin Tables

### 8. **bulletins**
```sql
CREATE TABLE bulletins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  church_id UUID NOT NULL REFERENCES churches(id) ON DELETE CASCADE,

  -- Type and week
  type TEXT NOT NULL,                  -- mobile, print, email
  week_start_date DATE NOT NULL,       -- Start of the week

  -- Content (varies by type)
  content JSONB,                       -- Flexible JSON structure
  theme_settings JSONB,                -- Colors, fonts, etc.

  -- Template (for print)
  template_id TEXT,                    -- bountiful, modern, traditional, etc.

  -- Publishing
  status TEXT DEFAULT 'draft',         -- draft, scheduled, published
  published_at TIMESTAMPTZ,
  scheduled_for TIMESTAMPTZ,

  -- PDF (for print)
  pdf_url TEXT,

  -- Metadata
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(church_id, type, week_start_date)
);

CREATE INDEX idx_bulletins_church_id ON bulletins(church_id);
CREATE INDEX idx_bulletins_type ON bulletins(type);
CREATE INDEX idx_bulletins_week ON bulletins(week_start_date DESC);
CREATE INDEX idx_bulletins_status ON bulletins(status);
```

### 9. **bulletin_blocks** (for mobile bulletins)
```sql
CREATE TABLE bulletin_blocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bulletin_id UUID NOT NULL REFERENCES bulletins(id) ON DELETE CASCADE,

  -- Block type and content
  block_type TEXT NOT NULL,            -- announcement, sermon, verse, custom_text, etc.
  content JSONB NOT NULL,              -- Block-specific content

  -- Ordering
  order_index INTEGER NOT NULL,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_bulletin_blocks_bulletin_id ON bulletin_blocks(bulletin_id);
CREATE INDEX idx_bulletin_blocks_order ON bulletin_blocks(bulletin_id, order_index);
```

---

## Social Media Tables

### 10. **social_posts**
```sql
CREATE TABLE social_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  church_id UUID NOT NULL REFERENCES churches(id) ON DELETE CASCADE,

  -- Content
  content TEXT NOT NULL,
  image_url TEXT,

  -- Platforms
  platforms TEXT[] NOT NULL,           -- ['facebook', 'twitter', 'instagram']

  -- Scheduling
  status TEXT DEFAULT 'draft',         -- draft, scheduled, posted, failed
  scheduled_for TIMESTAMPTZ,
  posted_at TIMESTAMPTZ,

  -- External IDs (after posting)
  facebook_post_id TEXT,
  twitter_post_id TEXT,
  instagram_post_id TEXT,
  pinterest_post_id TEXT,

  -- Metadata
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_social_posts_church_id ON social_posts(church_id);
CREATE INDEX idx_social_posts_status ON social_posts(status);
CREATE INDEX idx_social_posts_scheduled ON social_posts(scheduled_for);
```

### 11. **social_connections**
```sql
CREATE TABLE social_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  church_id UUID NOT NULL REFERENCES churches(id) ON DELETE CASCADE,

  platform TEXT NOT NULL,              -- facebook, twitter, instagram, pinterest
  access_token TEXT NOT NULL,          -- Encrypted
  refresh_token TEXT,                  -- Encrypted
  token_expires_at TIMESTAMPTZ,

  -- Platform-specific IDs
  platform_user_id TEXT,
  platform_username TEXT,

  connected_at TIMESTAMPTZ DEFAULT NOW(),
  last_used_at TIMESTAMPTZ,

  UNIQUE(church_id, platform)
);

CREATE INDEX idx_social_connections_church_id ON social_connections(church_id);
```

---

## Subscriber & Communication Tables

### 12. **subscribers**
```sql
CREATE TABLE subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  church_id UUID NOT NULL REFERENCES churches(id) ON DELETE CASCADE,

  -- Contact info
  phone_number TEXT,                   -- E.164 format: +15551234567
  email TEXT,

  -- Name (optional)
  first_name TEXT,
  last_name TEXT,

  -- Subscription preferences
  subscribed_to_mobile BOOLEAN DEFAULT TRUE,
  subscribed_to_email BOOLEAN DEFAULT TRUE,

  -- Metadata
  source TEXT,                         -- web, sms, import, etc.
  subscribed_at TIMESTAMPTZ DEFAULT NOW(),
  unsubscribed_at TIMESTAMPTZ,

  UNIQUE(church_id, phone_number),
  UNIQUE(church_id, email)
);

CREATE INDEX idx_subscribers_church_id ON subscribers(church_id);
CREATE INDEX idx_subscribers_phone ON subscribers(phone_number);
CREATE INDEX idx_subscribers_email ON subscribers(email);
```

### 13. **broadcasts**
```sql
CREATE TABLE broadcasts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  church_id UUID NOT NULL REFERENCES churches(id) ON DELETE CASCADE,

  -- Content
  message TEXT NOT NULL,               -- Max 160 chars for SMS

  -- Scheduling
  status TEXT DEFAULT 'draft',         -- draft, scheduled, sent, failed
  scheduled_for TIMESTAMPTZ,
  sent_at TIMESTAMPTZ,

  -- Stats
  total_recipients INTEGER DEFAULT 0,
  total_sent INTEGER DEFAULT 0,
  total_failed INTEGER DEFAULT 0,
  total_cost DECIMAL(10, 4),           -- Cost in dollars

  -- Metadata
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_broadcasts_church_id ON broadcasts(church_id);
CREATE INDEX idx_broadcasts_status ON broadcasts(status);
```

### 14. **broadcast_deliveries**
```sql
CREATE TABLE broadcast_deliveries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  broadcast_id UUID NOT NULL REFERENCES broadcasts(id) ON DELETE CASCADE,
  subscriber_id UUID NOT NULL REFERENCES subscribers(id) ON DELETE CASCADE,

  status TEXT DEFAULT 'pending',       -- pending, sent, delivered, failed
  twilio_sid TEXT,                     -- Twilio message SID
  error_message TEXT,

  sent_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,

  UNIQUE(broadcast_id, subscriber_id)
);

CREATE INDEX idx_broadcast_deliveries_broadcast_id ON broadcast_deliveries(broadcast_id);
CREATE INDEX idx_broadcast_deliveries_status ON broadcast_deliveries(status);
```

### 15. **conversations**
```sql
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  church_id UUID NOT NULL REFERENCES churches(id) ON DELETE CASCADE,
  subscriber_id UUID NOT NULL REFERENCES subscribers(id) ON DELETE CASCADE,

  -- Conversation state
  status TEXT DEFAULT 'open',          -- open, closed
  last_message_at TIMESTAMPTZ,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(church_id, subscriber_id)
);

CREATE INDEX idx_conversations_church_id ON conversations(church_id);
CREATE INDEX idx_conversations_status ON conversations(status);
```

### 16. **messages**
```sql
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,

  -- Message content
  body TEXT NOT NULL,
  direction TEXT NOT NULL,             -- inbound, outbound

  -- Twilio details
  twilio_sid TEXT,

  -- Metadata
  sent_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX idx_messages_sent_at ON messages(sent_at DESC);
```

---

## Media & Files

### 17. **media_items**
```sql
CREATE TABLE media_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  church_id UUID NOT NULL REFERENCES churches(id) ON DELETE CASCADE,

  -- File info
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,              -- Supabase Storage URL
  file_size INTEGER,                   -- Bytes
  mime_type TEXT,

  -- Image metadata (if applicable)
  width INTEGER,
  height INTEGER,

  -- Organization
  folder TEXT,                         -- For organizing media
  tags TEXT[],

  -- Usage tracking
  used_in_announcements UUID[],        -- Array of announcement IDs
  used_in_bulletins UUID[],            -- Array of bulletin IDs
  used_in_social UUID[],               -- Array of social post IDs

  -- Metadata
  uploaded_by UUID REFERENCES auth.users(id),
  uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_media_items_church_id ON media_items(church_id);
CREATE INDEX idx_media_items_uploaded_at ON media_items(uploaded_at DESC);
```

---

## Analytics & Engagement

### 18. **engagement_stats**
```sql
CREATE TABLE engagement_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  church_id UUID NOT NULL REFERENCES churches(id) ON DELETE CASCADE,

  -- What was viewed
  content_type TEXT NOT NULL,          -- bulletin, announcement, sermon
  content_id UUID,

  -- Who viewed
  subscriber_id UUID REFERENCES subscribers(id),

  -- Event type
  event_type TEXT NOT NULL,            -- view, click, open

  -- Metadata
  device TEXT,                         -- mobile, desktop, tablet
  source TEXT,                         -- sms, email, web
  occurred_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_engagement_stats_church_id ON engagement_stats(church_id);
CREATE INDEX idx_engagement_stats_content ON engagement_stats(content_type, content_id);
CREATE INDEX idx_engagement_stats_date ON engagement_stats(occurred_at DESC);
```

---

## Integrations

### 19. **integrations**
```sql
CREATE TABLE integrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  church_id UUID NOT NULL REFERENCES churches(id) ON DELETE CASCADE,

  -- Integration type
  provider TEXT NOT NULL,              -- planning_center, canva, stock_photos

  -- Credentials (encrypted)
  access_token TEXT,
  refresh_token TEXT,
  api_key TEXT,

  -- Settings
  settings JSONB,

  -- Status
  status TEXT DEFAULT 'active',        -- active, disconnected, error
  last_sync_at TIMESTAMPTZ,

  connected_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(church_id, provider)
);

CREATE INDEX idx_integrations_church_id ON integrations(church_id);
```

---

## System Tables

### 20. **audit_logs**
```sql
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  church_id UUID REFERENCES churches(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),

  -- Action details
  action TEXT NOT NULL,                -- created, updated, deleted, published
  resource_type TEXT NOT NULL,         -- announcement, bulletin, sermon, etc.
  resource_id UUID,

  -- Changes (optional)
  old_values JSONB,
  new_values JSONB,

  -- Metadata
  ip_address INET,
  user_agent TEXT,
  occurred_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_audit_logs_church_id ON audit_logs(church_id);
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_occurred_at ON audit_logs(occurred_at DESC);
```

---

## Row-Level Security (RLS) Policies

### Enable RLS on all tables
```sql
ALTER TABLE churches ENABLE ROW LEVEL SECURITY;
ALTER TABLE church_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE sermons ENABLE ROW LEVEL SECURITY;
ALTER TABLE bulletins ENABLE ROW LEVEL SECURITY;
-- ... enable on all tables
```

### Example RLS Policies

**Church members can only access their church's data:**
```sql
CREATE POLICY "Church members access own church data"
ON announcements
FOR ALL
USING (
  church_id IN (
    SELECT church_id
    FROM church_members
    WHERE user_id = auth.uid()
  )
);
```

**Public bulletins are viewable by anyone:**
```sql
CREATE POLICY "Published bulletins are public"
ON bulletins
FOR SELECT
USING (status = 'published');
```

**Admins can manage team members:**
```sql
CREATE POLICY "Admins manage team"
ON church_members
FOR ALL
USING (
  church_id IN (
    SELECT church_id
    FROM church_members
    WHERE user_id = auth.uid()
    AND role = 'admin'
  )
);
```

---

## Database Functions

### Auto-update `updated_at` timestamp
```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to all tables
CREATE TRIGGER update_churches_updated_at
BEFORE UPDATE ON churches
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Repeat for other tables...
```

### Generate unique subscription codes
```sql
CREATE OR REPLACE FUNCTION generate_subscription_code()
RETURNS TEXT AS $$
DECLARE
  code TEXT;
  exists BOOLEAN;
BEGIN
  LOOP
    code := 'temp' || FLOOR(RANDOM() * 10000)::TEXT;
    SELECT COUNT(*) > 0 INTO exists FROM churches WHERE subscription_code = code;
    EXIT WHEN NOT exists;
  END LOOP;
  RETURN code;
END;
$$ LANGUAGE plpgsql;
```

---

## Indexes Summary

All foreign keys are indexed for performance.
Additional indexes on:
- Frequently queried fields (status, dates)
- Search fields (slug, email, phone)
- Composite indexes for common queries

---

## Data Relationships Diagram

```
churches
  ├── church_members (many)
  ├── announcements (many)
  ├── sermons (many)
  ├── giving_records (many)
  ├── giving_settings (one)
  ├── bulletins (many)
  │   └── bulletin_blocks (many)
  ├── social_posts (many)
  ├── social_connections (many)
  ├── subscribers (many)
  │   └── conversations (many)
  │       └── messages (many)
  ├── broadcasts (many)
  │   └── broadcast_deliveries (many)
  ├── media_items (many)
  ├── engagement_stats (many)
  ├── integrations (many)
  └── audit_logs (many)

auth.users
  ├── profiles (one)
  └── church_members (many)
```

---

## Migration Strategy

1. **Phase 1**: Core tables (churches, profiles, church_members)
2. **Phase 2**: Content tables (announcements, sermons, giving)
3. **Phase 3**: Bulletin system (bulletins, bulletin_blocks)
4. **Phase 4**: Social media (social_posts, social_connections)
5. **Phase 5**: Subscribers & messaging (subscribers, broadcasts, conversations)
6. **Phase 6**: Media & analytics (media_items, engagement_stats)
7. **Phase 7**: Integrations & audit logs

---

*This schema is designed for multi-tenant SaaS with proper data isolation, indexing, and security.*
