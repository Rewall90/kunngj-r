# bltn Clone - File Architecture

## Complete Next.js 14 App Router Structure

Based on thorough analysis of bltn.app, this document outlines the optimal file structure following Next.js 14 best practices with App Router, focusing on simplicity, maintainability, and scalability.

---

## Project Root Structure

```
bltn-clone/
├── app/                          # Next.js 14 App Router
├── components/                   # Reusable React components
├── lib/                          # Core utilities and clients
├── types/                        # TypeScript type definitions
├── supabase/                     # Supabase schema and migrations
├── public/                       # Static assets
├── styles/                       # Global styles
├── hooks/                        # Custom React hooks
├── utils/                        # Helper functions
├── config/                       # Configuration files
└── docs/                         # Documentation
```

---

## Detailed /app Directory Structure

```
app/
├── (auth)/                       # Auth routes group (shared layout)
│   ├── login/
│   │   └── page.tsx              # Login page
│   ├── signup/
│   │   └── page.tsx              # Signup page
│   ├── forgot-password/
│   │   └── page.tsx              # Password reset
│   └── layout.tsx                # Auth layout (centered, no sidebar)
│
├── (marketing)/                  # Public marketing pages
│   ├── page.tsx                  # Homepage
│   ├── pricing/
│   │   └── page.tsx              # Pricing plans
│   ├── about/
│   │   └── page.tsx              # About page
│   └── layout.tsx                # Marketing layout (header, footer)
│
├── (admin)/                      # Protected admin dashboard
│   ├── dashboard/
│   │   └── page.tsx              # Main dashboard (Overview)
│   │
│   ├── announcements/            # Announcements management
│   │   ├── page.tsx              # List view (This Week, All Active, Finished)
│   │   ├── new/
│   │   │   └── page.tsx          # Create new announcement
│   │   └── [id]/
│   │       ├── page.tsx          # View/Edit announcement
│   │       └── edit/
│   │           └── page.tsx      # Edit mode
│   │
│   ├── sermons/                  # Sermon management
│   │   ├── page.tsx              # List view (Future, Past)
│   │   ├── new/
│   │   │   └── page.tsx          # Add sermon/series
│   │   └── [id]/
│   │       ├── page.tsx          # View sermon
│   │       └── edit/
│   │           └── page.tsx      # Edit sermon
│   │
│   ├── giving/                   # Giving/Donations tracking
│   │   ├── page.tsx              # Track view (list of records)
│   │   ├── new/
│   │   │   └── page.tsx          # Add giving record
│   │   └── settings/
│   │       └── page.tsx          # Fiscal year, goals
│   │
│   ├── bulletins/                # Bulletin builder (Mobile, Print, Email)
│   │   ├── mobile/
│   │   │   ├── page.tsx          # Mobile bulletin list
│   │   │   └── [weekId]/
│   │   │       ├── page.tsx      # Mobile bulletin builder
│   │   │       ├── build/
│   │   │       │   └── page.tsx  # Build tab
│   │   │       ├── audience/
│   │   │       │   └── page.tsx  # Audience settings
│   │   │       └── settings/
│   │   │           └── page.tsx  # Bulletin settings
│   │   ├── print/
│   │   │   ├── page.tsx          # Print bulletin list
│   │   │   └── [weekId]/
│   │   │       ├── page.tsx      # Print builder
│   │   │       ├── templates/
│   │   │       │   └── page.tsx  # Template library
│   │   │       └── settings/
│   │   │           └── page.tsx  # Print settings
│   │   └── email/
│   │       ├── page.tsx          # Email bulletin list
│   │       └── [weekId]/
│   │           └── page.tsx      # Email builder
│   │
│   ├── social/                   # Social media management
│   │   ├── page.tsx              # Social media dashboard (Post, Scheduled, Posted)
│   │   ├── new/
│   │   │   └── page.tsx          # Create new post
│   │   ├── schedule/
│   │   │   └── page.tsx          # Calendar view
│   │   └── [postId]/
│   │       ├── page.tsx          # View post
│   │       └── edit/
│   │           └── page.tsx      # Edit post
│   │
│   ├── broadcast/                # SMS broadcast
│   │   ├── page.tsx              # Broadcast dashboard
│   │   └── new/
│   │       └── page.tsx          # Send new broadcast
│   │
│   ├── autoresponders/           # Automated responses
│   │   ├── page.tsx              # List autoresponders
│   │   └── [id]/
│   │       └── page.tsx          # Edit autoresponder
│   │
│   ├── conversations/            # Subscriber conversations
│   │   ├── page.tsx              # Conversations list
│   │   └── [id]/
│   │       └── page.tsx          # Conversation thread
│   │
│   ├── engagement/               # Analytics & statistics
│   │   └── page.tsx              # Engagement dashboard
│   │
│   ├── media/                    # Media library
│   │   ├── page.tsx              # Media library (images, files)
│   │   ├── upload/
│   │   │   └── page.tsx          # Upload interface
│   │   └── stock/
│   │       └── page.tsx          # Stock photos integration
│   │
│   ├── settings/                 # Church settings
│   │   ├── page.tsx              # Redirect to /settings/church
│   │   ├── church/
│   │   │   └── page.tsx          # General church info
│   │   ├── channels/
│   │   │   └── page.tsx          # Channel configurations
│   │   ├── profile/
│   │   │   └── page.tsx          # User profile
│   │   ├── team/
│   │   │   └── page.tsx          # Team members
│   │   └── billing/
│   │       └── page.tsx          # Subscription & billing
│   │
│   ├── notifications/            # Notifications center
│   │   └── page.tsx              # Notifications list
│   │
│   └── layout.tsx                # Admin layout (sidebar, header)
│
├── (public)/                     # Public-facing bulletin views
│   └── [churchSlug]/
│       └── bulletin/
│           └── [bulletinId]/
│               └── page.tsx      # Public bulletin view (SSR for SEO)
│
├── api/                          # API Routes
│   ├── webhooks/
│   │   ├── stripe/
│   │   │   └── route.ts          # Stripe webhooks
│   │   └── twilio/
│   │       └── route.ts          # Twilio SMS webhooks
│   ├── auth/
│   │   └── callback/
│   │       └── route.ts          # OAuth callbacks
│   ├── social/
│   │   ├── facebook/
│   │   │   └── post/
│   │   │       └── route.ts      # Post to Facebook
│   │   ├── twitter/
│   │   │   └── post/
│   │   │       └── route.ts      # Post to Twitter
│   │   └── instagram/
│   │       └── post/
│   │           └── route.ts      # Post to Instagram
│   ├── pdf/
│   │   └── generate/
│   │       └── route.ts          # Generate PDF bulletin
│   ├── email/
│   │   └── send/
│   │       └── route.ts          # Send email bulletin
│   └── sms/
│       └── send/
│           └── route.ts          # Send SMS bulletin
│
├── layout.tsx                    # Root layout
├── loading.tsx                   # Root loading state
├── error.tsx                     # Root error boundary
├── not-found.tsx                 # 404 page
└── globals.css                   # Global CSS (Tailwind)
```

---

## Detailed /components Directory

```
components/
├── announcements/
│   ├── AnnouncementCard.tsx         # Display single announcement
│   ├── AnnouncementList.tsx         # List of announcements
│   ├── AnnouncementEditor.tsx       # Rich text editor for announcements
│   ├── AnnouncementForm.tsx         # Form for creating/editing
│   ├── PromotionSchedule.tsx        # Promotion schedule selector
│   └── AnnouncementHistory.tsx      # History timeline
│
├── sermons/
│   ├── SermonCard.tsx               # Display single sermon
│   ├── SermonList.tsx               # List of sermons
│   ├── SermonForm.tsx               # Create/edit sermon
│   ├── SermonSeries.tsx             # Series management
│   └── SermonPlayer.tsx             # Audio/video player
│
├── bulletins/
│   ├── mobile/
│   │   ├── MobileBulletinBuilder.tsx    # Main builder component
│   │   ├── BlockList.tsx                # Draggable block list
│   │   ├── BulletinPreview.tsx          # Live preview
│   │   ├── BlockEditor.tsx              # Edit individual block
│   │   └── ThemeCustomizer.tsx          # Theme colors, fonts
│   ├── print/
│   │   ├── PrintBulletinBuilder.tsx     # Print builder
│   │   ├── TemplateSelector.tsx         # Template library
│   │   ├── PageLayout.tsx               # Page layout editor
│   │   └── PrintPreview.tsx             # PDF preview
│   └── email/
│       ├── EmailBulletinBuilder.tsx     # Email builder
│       ├── EmailPreview.tsx             # Email preview
│       └── SubjectLineEditor.tsx        # Subject line
│
├── social/
│   ├── SocialPostCard.tsx           # Display social post
│   ├── SocialPostForm.tsx           # Create/edit post
│   ├── SocialCalendar.tsx           # Calendar view
│   ├── PlatformSelector.tsx         # Select platforms
│   ├── PostPreview.tsx              # Preview for each platform
│   └── ScheduleSelector.tsx         # Date/time picker
│
├── giving/
│   ├── GivingChart.tsx              # Chart visualization
│   ├── GivingRecord.tsx             # Single record display
│   ├── GivingForm.tsx               # Add/edit record
│   └── FiscalYearSettings.tsx       # Settings form
│
├── media/
│   ├── MediaGrid.tsx                # Grid of images
│   ├── MediaUploader.tsx            # Drag-drop uploader
│   ├── MediaPicker.tsx              # Modal picker
│   ├── ImageEditor.tsx              # Crop, resize
│   └── StockPhotoSearch.tsx         # Stock photo integration
│
├── team/
│   ├── TeamMemberCard.tsx           # Display team member
│   ├── TeamMemberList.tsx           # List of team members
│   ├── InviteForm.tsx               # Invite new member
│   └── RoleSelector.tsx             # Role picker
│
├── settings/
│   ├── ChurchInfoForm.tsx           # Church details form
│   ├── ChannelSettings.tsx          # Channel configurations
│   ├── BillingSettings.tsx          # Subscription & payment
│   └── IntegrationCard.tsx          # Third-party integrations
│
├── analytics/
│   ├── EngagementChart.tsx          # Charts for engagement
│   ├── StatCard.tsx                 # Stat display card
│   ├── ActivityFeed.tsx             # Recent activity
│   └── ReportExporter.tsx           # Export reports
│
├── layout/
│   ├── Sidebar.tsx                  # Admin sidebar navigation
│   ├── Header.tsx                   # Top header
│   ├── Footer.tsx                   # Footer
│   ├── MobileNav.tsx                # Mobile navigation
│   └── Breadcrumbs.tsx              # Breadcrumb navigation
│
├── editor/
│   ├── RichTextEditor.tsx           # TipTap editor wrapper
│   ├── Toolbar.tsx                  # Editor toolbar
│   ├── BubbleMenu.tsx               # Bubble menu
│   └── EditorExtensions.tsx         # Custom TipTap extensions
│
├── forms/
│   ├── FormField.tsx                # Generic form field
│   ├── Select.tsx                   # Select component
│   ├── DatePicker.tsx               # Date picker
│   ├── TimePicker.tsx               # Time picker
│   ├── ImageUpload.tsx              # Image upload field
│   └── ColorPicker.tsx              # Color picker
│
├── ui/                              # DaisyUI + custom components
│   ├── Button.tsx                   # Button component
│   ├── Modal.tsx                    # Modal dialog
│   ├── Toast.tsx                    # Toast notifications
│   ├── Card.tsx                     # Card component
│   ├── Badge.tsx                    # Badge component
│   ├── Tabs.tsx                     # Tabs component
│   ├── Table.tsx                    # Table component
│   ├── Dropdown.tsx                 # Dropdown menu
│   ├── Avatar.tsx                   # Avatar component
│   ├── Skeleton.tsx                 # Loading skeleton
│   └── EmptyState.tsx               # Empty state placeholder
│
├── auth/
│   ├── LoginForm.tsx                # Login form
│   ├── SignupForm.tsx               # Signup form
│   ├── ResetPasswordForm.tsx        # Password reset
│   └── AuthProvider.tsx             # Auth context provider
│
└── providers/
    ├── SupabaseProvider.tsx         # Supabase client provider
    ├── PostHogProvider.tsx          # Analytics provider
    ├── ThemeProvider.tsx            # Theme context
    └── ToastProvider.tsx            # Toast notifications
```

---

## /lib Directory (Core Utilities)

```
lib/
├── supabase/
│   ├── client.ts                    # Browser Supabase client
│   ├── server.ts                    # Server Supabase client
│   ├── middleware.ts                # Auth middleware
│   └── types.ts                     # Generated types from DB
│
├── stripe/
│   ├── client.ts                    # Stripe client
│   ├── webhooks.ts                  # Webhook handlers
│   └── subscriptions.ts             # Subscription logic
│
├── twilio/
│   ├── client.ts                    # Twilio client
│   ├── sms.ts                       # SMS sending logic
│   └── webhooks.ts                  # SMS webhooks
│
├── resend/
│   ├── client.ts                    # Resend client
│   └── templates.ts                 # Email templates
│
├── social/
│   ├── facebook.ts                  # Facebook Graph API
│   ├── twitter.ts                   # Twitter API
│   ├── instagram.ts                 # Instagram API
│   └── pinterest.ts                 # Pinterest API
│
├── pdf/
│   ├── generator.ts                 # PDF generation logic
│   └── templates.ts                 # PDF templates
│
├── analytics/
│   ├── posthog.ts                   # PostHog client
│   └── events.ts                    # Event tracking
│
└── utils.ts                         # Common utility functions
```

---

## /types Directory (TypeScript Definitions)

```
types/
├── database.types.ts                # Generated from Supabase
├── announcement.ts                  # Announcement types
├── sermon.ts                        # Sermon types
├── bulletin.ts                      # Bulletin types
├── social.ts                        # Social media types
├── giving.ts                        # Giving types
├── user.ts                          # User types
├── church.ts                        # Church types
└── index.ts                         # Export all types
```

---

## /supabase Directory

```
supabase/
├── migrations/
│   ├── 001_initial_schema.sql       # Initial tables
│   ├── 002_rls_policies.sql         # Row-level security
│   ├── 003_functions.sql            # Database functions
│   └── 004_triggers.sql             # Database triggers
│
├── seed.sql                         # Seed data for development
│
├── functions/                       # Edge Functions
│   ├── publish-bulletin/
│   │   └── index.ts                 # Publish bulletin function
│   ├── send-sms/
│   │   └── index.ts                 # Send SMS function
│   └── social-post/
│       └── index.ts                 # Post to social media
│
└── config.toml                      # Supabase config
```

---

## /hooks Directory (Custom React Hooks)

```
hooks/
├── useAnnouncements.ts              # Fetch/mutate announcements
├── useSermons.ts                    # Fetch/mutate sermons
├── useBulletins.ts                  # Fetch/mutate bulletins
├── useSocial.ts                     # Fetch/mutate social posts
├── useGiving.ts                     # Fetch/mutate giving records
├── useMedia.ts                      # Media library operations
├── useTeam.ts                       # Team members
├── useChurch.ts                     # Church settings
├── useAuth.ts                       # Authentication state
├── useRealtime.ts                   # Realtime subscriptions
└── useDebounce.ts                   # Debounce utility
```

---

## Key Design Principles

### 1. **Route Groups for Organization**
- `(auth)` - Authentication pages with special layout
- `(marketing)` - Public marketing pages
- `(admin)` - Protected dashboard pages
- `(public)` - Public bulletin views

### 2. **Colocation**
- Keep related components close to where they're used
- Shared components in `/components`
- Page-specific components can live in `/app/(admin)/page-name/_components`

### 3. **Server vs Client Components**
- **Server Components (default)**: Layouts, data fetching, static content
- **Client Components** (`'use client'`): Interactive UI, forms, state management

### 4. **Data Fetching Patterns**
```typescript
// Server Component (app/dashboard/page.tsx)
async function DashboardPage() {
  const { data } = await supabase.from('churches').select('*');
  return <DashboardView data={data} />;
}

// Client Component hooks (hooks/useAnnouncements.ts)
export function useAnnouncements() {
  return useQuery({
    queryKey: ['announcements'],
    queryFn: () => supabase.from('announcements').select('*')
  });
}
```

### 5. **File Naming Conventions**
- **Components**: PascalCase (`AnnouncementCard.tsx`)
- **Utilities**: camelCase (`formatDate.ts`)
- **Types**: PascalCase (`Announcement.ts`)
- **Hooks**: camelCase with `use` prefix (`useAnnouncements.ts`)

### 6. **Import Aliases**
```typescript
// tsconfig.json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"],
      "@/components/*": ["components/*"],
      "@/lib/*": ["lib/*"],
      "@/types/*": ["types/*"],
      "@/hooks/*": ["hooks/*"]
    }
  }
}
```

---

## Next Steps

1. Initialize project with this structure
2. Set up Supabase database schema
3. Configure TypeScript paths
4. Implement authentication flow
5. Build core components (Sidebar, Header, etc.)
6. Implement feature modules one by one

---

*This architecture prioritizes simplicity, maintainability, and follows Next.js 14 App Router best practices.*
