# bltn Clone - Tech Stack

## Project Overview
- Web-based church bulletin and communication platform
- No native mobile apps (responsive web only)
- Max target: 500 churches
- SMS and email delivery of bulletins

## Quick Start

```bash
# Initialize Next.js project with TypeScript
npx create-next-app@latest bltn-clone --typescript --tailwind --app --use-npm

# Install core dependencies
npm install @supabase/supabase-js @supabase/auth-helpers-nextjs
npm install daisyui
npm install @tiptap/react @tiptap/starter-kit
npm install react-hook-form zod
npm install zustand date-fns

# Install UI libraries
npm install @dnd-kit/core @dnd-kit/sortable
npm install react-dropzone react-big-calendar
npm install lucide-react recharts

# Install PDF/Email
npm install @react-pdf/renderer
npm install react-email

# Install Stripe
npm install stripe @stripe/stripe-js

# Development
npm run dev
```

**Environment Variables (.env.local):**
```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

STRIPE_SECRET_KEY=your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key

TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_PHONE_NUMBER=your_twilio_phone

RESEND_API_KEY=your_resend_key
```

---

## bltn.app Current Stack (Analysis)

### Frontend
- **Vanilla JavaScript + jQuery 3.6.3** (NOT React/Vue/Angular)
- **Lodash 4.17.21** - Utility functions
- **Masonry** - Grid layout library
- **Chart.js** - Analytics and charts
- **Bootstrap** - CSS framework
- **Webpack** - Module bundler
- **Custom routing** - History-based (not hash-based)

### Backend
- **Laravel** - PHP framework for manager.bltn.io API
  - Session cookies: XSRF-TOKEN, the_manager_session
  - RESTful API endpoints
- **Nginx 1.10.3** - Web server (Ubuntu)
- **Firebase Realtime Database** - Primary database
- **Firebase Authentication** - User auth (email/password, OAuth)
- **Firebase Storage** - File storage

### Third-party Services
- **Stripe** - Payment processing
- **Bugsnag** - Error tracking and monitoring
- **Crisp Chat** - Customer support chat
- **Drip** - Email marketing automation
- **Google Analytics** - Web analytics
- **Facebook Pixel** - Social analytics
- **Pinterest SDK** - Social integration
- **Twilio** (likely) - SMS delivery
- **Planning Center Online** - Church management integration

### Key Observations
- Built with traditional tech stack (jQuery era ~2016-2018)
- No modern SPA framework (React/Vue)
- Laravel backend + Firebase database hybrid
- Webpack for asset bundling
- Server-side rendering with client-side interactions

### Why This Stack Was Chosen (Likely)
- Built before React/Vue dominated (2016-2018)
- Laravel was popular for rapid development
- Firebase provided easy real-time features
- jQuery sufficient for UI interactions
- Lower learning curve for traditional PHP developers

---

## Recommended Modern Stack (For Your Clone)

### Why Modernize
- Better developer experience
- Easier to maintain
- Better performance
- Modern tooling and ecosystem
- Component-based architecture
- Lower long-term costs (Supabase vs Firebase)
- Better TypeScript support
- More active community and ecosystem

### Stack Comparison

| Layer | bltn.app Uses | Your Clone Should Use | Reason |
|-------|---------------|----------------------|--------|
| **Frontend** | jQuery + Vanilla JS | Next.js / React | Modern, component-based, better DX |
| **Database** | Firebase Realtime DB | Supabase (PostgreSQL) | Better queries, cheaper, SQL |
| **Backend API** | Laravel (PHP) | Supabase + Edge Functions | Serverless, cheaper, easier |
| **Auth** | Firebase Auth | Supabase Auth | Same features, better pricing |
| **File Storage** | Firebase Storage | Supabase Storage | Cheaper, same functionality |
| **Bundler** | Webpack | Vite (with Next.js) | Faster builds, better HMR |
| **CSS** | Bootstrap | Tailwind CSS | More flexible, modern |
| **Error Tracking** | Bugsnag | Sentry | Better free tier |
| **Analytics** | Google Analytics | PostHog | Open source, better events |
| **Chat** | Crisp | Crisp or Intercom | Keep or upgrade |
| **Email Marketing** | Drip | Resend or Loops | Modern, developer-friendly |
| **SMS** | Twilio (likely) | Twilio | Industry standard, keep |

## Core Stack

### Frontend Stack (Detailed)

**Core Framework:**
- **Next.js 14** (App Router)
  - Server-side rendering for public bulletins (SEO)
  - Client-side rendering for admin dashboard
  - API routes for webhooks and OAuth callbacks
  - Image optimization for bulletin graphics
  - File-based routing

**UI Layer:**
- **React 18**
  - Component-based architecture
  - Rich state management for complex forms
  - Reusable bulletin preview components

**Styling:**
- **Tailwind CSS 3**
  - Responsive mobile-first design
  - Print utilities for PDF bulletins
  - Custom church themes
  - Email-safe classes (with inline conversion)

**Component Library:**
- **DaisyUI 4**
  - Pre-built admin UI components
  - Accessible forms and modals
  - Fast prototyping
  - Theme system for church branding

**Language:**
- **TypeScript**
  - Type safety
  - Better developer experience
  - Catch errors early

### Essential Frontend Libraries

**Rich Text Editor:**
- **TipTap** - Modern, extensible bulletin editor
  - Alternative: Lexical, Slate

**Forms & Validation:**
- **React Hook Form** - Complex church settings forms
- **Zod** - Schema validation

**State Management:**
- **Zustand** - Lightweight state for bulletin drafts, team collaboration
  - Alternative: Jotai, Redux Toolkit

**Date/Time:**
- **date-fns** - Date manipulation for scheduling

**Drag & Drop:**
- **@dnd-kit/core** - Reorder announcements, sermon series

**PDF Generation:**
- **@react-pdf/renderer** - Print bulletin PDFs

**Email Templates:**
- **React Email** - Responsive email bulletins
  - Alternative: MJML

**Image Uploads:**
- **react-dropzone** - Drag-drop file uploads

**Calendar:**
- **react-big-calendar** - Social media scheduler, event calendar

**Icons:**
- **Lucide React** - Modern icon library

**Charts:**
- **Recharts** - Analytics dashboard
  - Alternative: Chart.js (what bltn uses)

### Frontend File Structure

```
/app
  /(public)
    /[church]/bulletin/page.tsx       # Public bulletin (SSR)
    /page.tsx                          # Landing page (SSG)
  /(admin)
    /dashboard/page.tsx                # Admin dashboard (CSR)
    /bulletins/create/page.tsx         # Bulletin editor
    /settings/page.tsx                 # Church settings
  /api
    /webhooks/stripe/route.ts          # Stripe webhooks
    /auth/callback/route.ts            # OAuth callbacks

/components
  /bulletin
    /BulletinEditor.tsx                # Main rich text editor
    /BulletinPreview.tsx               # Live preview
    /AnnouncementCard.tsx              # Reusable component
  /admin
    /Sidebar.tsx                       # Admin navigation
    /TeamMemberManager.tsx             # User management
  /social
    /SocialMediaScheduler.tsx          # Calendar UI
    /PostPreview.tsx                   # Preview posts
  /ui
    /button.tsx                        # DaisyUI components
    /modal.tsx
    /form.tsx

/lib
  /supabase/client.ts                  # Supabase client
  /utils.ts                            # Helper functions
```

### Database & Backend
- **Supabase** (PostgreSQL)
  - Authentication
  - Database
  - File Storage
  - Real-time subscriptions
  - Row-Level Security
  - Edge Functions (serverless backend logic)

### Scheduled Jobs
- **Supabase pg_cron** - Database-triggered tasks
- **Supabase Edge Functions** - Serverless functions
- **GitHub Actions** (optional) - External cron triggers

### Communication
- **Twilio** - SMS notifications ($0.0079/message)
- **Resend** - Email delivery (free 3K/month)

### Payments
- **Stripe** - Subscription billing

### Third-party Services
- **PostHog** - Analytics (free 1M events/month)
- **Sentry** - Error tracking (free 5K errors/month)

## Features

### Core Features
- Bulletin creation and editing
- Multi-channel publishing (web, email, SMS)
- Team collaboration
- Social media scheduling (Facebook, Twitter, Pinterest)
- Sermon management
- Giving tracking
- Planning Center Online integration

### Publishing Channels
- Web (responsive mobile)
- Print PDF export
- Email
- SMS
- Social media

### Scheduled Tasks
- Sunday bulletin publishing
- Weekly email digests
- Social media posts
- Auto-archiving

## Cost Estimates

### Development Phase
- **Total: $0** (all free tiers)

### 10 Churches (1,000 users)
- Supabase: $0
- Twilio: $0-10
- Other: $0
- **Total: $0-10/month**

### 50 Churches (5,000 users)
- Supabase: $25
- Twilio (2K SMS/mo): $15
- Resend: $0
- Other: $0
- **Total: $40/month**

### 200 Churches (20,000 users)
- Supabase: $30-40
- Twilio (8K SMS/mo): $60
- Resend: $20
- Other: $0
- **Total: $110-120/month**

### 500 Churches (50,000 users)
- Supabase: $80-100
- Twilio (20K SMS/mo): $160
- Resend: $20
- Other: $0
- **Total: $260-280/month**

## Firebase Alternative (Not Chosen)

### Reasons Against Firebase
- Higher cost at scale ($300-600/month at 500 churches)
- Mobile SDKs not needed (web-only app)
- Vendor lock-in
- Less powerful database (NoSQL vs PostgreSQL)

### Firebase Would Cost
- 500 churches: $300-600/month vs Supabase: $260-280/month
- Annual savings: $500-4,000

## Key Architectural Decisions

### Why Supabase
- PostgreSQL (powerful queries, relations, aggregations)
- Open source (no vendor lock-in)
- Self-hostable option
- Better cost predictability
- Mature real-time features

### Why No Native Mobile Apps
- Higher engagement via SMS (90% open rate)
- No app download friction
- Works on all devices
- Lower development cost
- Easier maintenance

### Why These Communication Channels
- SMS: Twilio (industry standard, reliable)
- Email: Resend (modern, affordable, great DX)
- Social: Direct API integration (no intermediary)

## Technology Alternatives Considered

### Database
- Firebase: Too expensive at scale
- MongoDB Atlas: No built-in auth/storage
- PocketBase: Limited scale (SQLite)
- **Chosen: Supabase** (best balance)

### Deployment & Hosting

**Frontend Hosting:**
- **Vercel** (Recommended)
  - Zero-config Next.js deployment
  - Edge functions support
  - Automatic HTTPS and CDN
  - Preview deployments for PRs
  - Free tier: Unlimited for personal projects
  - Pro tier: $20/month (for production)

**Backend Hosting:**
- **Supabase Cloud**
  - Managed PostgreSQL
  - Automatic backups
  - Global edge network
  - Free tier: 500MB database, 1GB storage
  - Pro tier: $25/month

**Alternative Hosting:**
- Netlify: Good for static sites, less ideal for Next.js SSR
- Railway: Full-stack option, good for self-hosting Supabase
- Cloudflare Pages: Good for static/edge, limited SSR support

### Complete Package List

```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "typescript": "^5.3.0",

    "tailwindcss": "^3.4.0",
    "daisyui": "^4.4.0",

    "@supabase/supabase-js": "^2.38.0",
    "@supabase/auth-helpers-nextjs": "^0.8.0",

    "@tiptap/react": "^2.1.0",
    "@tiptap/starter-kit": "^2.1.0",

    "react-hook-form": "^7.48.0",
    "zod": "^3.22.0",

    "zustand": "^4.4.0",
    "date-fns": "^2.30.0",

    "@dnd-kit/core": "^6.1.0",
    "@dnd-kit/sortable": "^8.0.0",

    "@react-pdf/renderer": "^3.1.0",
    "react-email": "^1.10.0",

    "react-dropzone": "^14.2.0",
    "react-big-calendar": "^1.8.0",

    "lucide-react": "^0.294.0",
    "recharts": "^2.10.0",

    "stripe": "^14.5.0",
    "@stripe/stripe-js": "^2.2.0"
  },
  "devDependencies": {
    "@types/node": "^20.10.0",
    "@types/react": "^18.2.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0",
    "eslint": "^8.55.0",
    "prettier": "^3.1.0",
    "prettier-plugin-tailwindcss": "^0.5.0"
  }
}
```

### Development Tools

**Code Quality:**
- **ESLint** - JavaScript linting
- **Prettier** - Code formatting
- **TypeScript** - Type checking
- **Husky** - Git hooks for pre-commit checks

**Testing (Optional):**
- **Vitest** - Unit tests
- **Playwright** - E2E tests
- **React Testing Library** - Component tests

**CI/CD:**
- **GitHub Actions** - Automated testing and deployment
- **Vercel** - Automatic deployments on git push

## Integration Requirements

### External APIs
- Planning Center Online (church management sync)
- Stripe API (payments)
- Twilio API (SMS)
- Resend API (email)
- Facebook Graph API (social posting)
- Twitter API v2 (social posting)
- Pinterest API (social posting)

### Authentication Methods
- Email/password
- Google OAuth
- Facebook OAuth
- Apple Sign In

## Security

### Supabase RLS Policies
- Church-level data isolation
- Team member role-based access
- Public bulletin access
- Admin-only settings

### API Security
- Supabase API keys (anon/service)
- Row-Level Security policies
- Rate limiting
- CORS configuration

## Development Phases

### Phase 1: Core Platform
- User authentication
- Church profile setup
- Basic bulletin creation
- Email delivery

### Phase 2: Publishing Channels
- SMS delivery (Twilio)
- Print PDF export
- Social media scheduling

### Phase 3: Advanced Features
- Team collaboration
- PCO integration
- Sermon management
- Giving tracking

### Phase 4: Automation
- Scheduled publishing
- Email digests
- Auto-archiving
- Analytics

## Performance Targets

### Page Load
- Admin dashboard: <2s
- Public bulletin: <1s
- Mobile (3G): <3s

### Database
- Query response: <100ms
- Real-time updates: <500ms latency

### Availability
- Uptime: 99.9% (Supabase SLA)
- SMS delivery: 99% (Twilio SLA)

## Scalability Plan

### 0-50 Churches
- Supabase free/pro tier
- Single region deployment
- No CDN needed

### 50-200 Churches
- Supabase pro tier
- CDN for static assets (Vercel/Cloudflare)
- Database connection pooling

### 200-500 Churches
- Supabase optimized plan
- Multi-CDN
- Database read replicas
- Edge function optimization

### 500+ Churches (Future)
- Consider Supabase self-hosted
- Multi-region deployment
- Dedicated infrastructure

---

## Summary & Next Steps

### Stack Summary

**Frontend:**
- Next.js 14 + React 18 + TypeScript
- Tailwind CSS + DaisyUI
- TipTap (rich text), React Hook Form, Zustand

**Backend:**
- Supabase (PostgreSQL + Auth + Storage + Edge Functions)

**Communication:**
- Twilio (SMS), Resend (Email)

**Payments:**
- Stripe

**Hosting:**
- Vercel (frontend), Supabase Cloud (backend)

**Total Monthly Cost:**
- Development: $0
- 10 churches: $0-10
- 50 churches: $40
- 200 churches: $110-120
- 500 churches: $260-280

### Key Advantages Over bltn.app

| Aspect | bltn.app | Your Clone | Benefit |
|--------|----------|------------|---------|
| **Frontend** | jQuery + Vanilla JS | Next.js + React | Modern, maintainable |
| **Backend** | Laravel (PHP) | Supabase | Serverless, cheaper |
| **Database** | Firebase Realtime | PostgreSQL | Better queries, relations |
| **Styling** | Bootstrap | Tailwind + DaisyUI | Faster, more flexible |
| **Type Safety** | None | TypeScript | Fewer bugs |
| **Build Tool** | Webpack | Vite (via Next.js) | Faster builds |
| **Cost (500 churches)** | $300-600/mo | $260-280/mo | $40-320/mo savings |

### Development Roadmap

**Week 1-2: Setup & Auth**
- Initialize Next.js project
- Setup Supabase
- Implement authentication (email/password, OAuth)
- Create basic admin layout

**Week 3-4: Bulletin Editor**
- Build TipTap rich text editor
- Add image uploads
- Create live preview component
- Implement save/auto-save

**Week 5-6: Publishing Channels**
- Email template system (React Email)
- SMS integration (Twilio)
- Print PDF generation (@react-pdf/renderer)
- Responsive web bulletin view

**Week 7-8: Social Media**
- Social media scheduler UI (react-big-calendar)
- Facebook Graph API integration
- Twitter API integration
- Pinterest API integration

**Week 9-10: Advanced Features**
- Sermon management
- Giving tracking
- Team collaboration (real-time with Supabase)
- Planning Center Online integration

**Week 11-12: Polish & Launch**
- Stripe subscription billing
- Analytics (PostHog)
- Error tracking (Sentry)
- Performance optimization
- Deploy to production

### Immediate Next Steps

1. **Create Supabase account** - supabase.com (free tier)
2. **Create Vercel account** - vercel.com (free tier)
3. **Initialize project** - Run quick start commands above
4. **Setup database schema** - Design tables for churches, bulletins, announcements
5. **Start with auth** - Implement login/signup first

### Learning Resources

**Next.js:**
- https://nextjs.org/learn
- https://www.youtube.com/c/leerob (Lee Robinson - Vercel VP)

**Supabase:**
- https://supabase.com/docs
- https://www.youtube.com/c/Supabase

**TipTap:**
- https://tiptap.dev/docs/editor/introduction
- https://tiptap.dev/examples/default

**Tailwind + DaisyUI:**
- https://tailwindcss.com/docs
- https://daisyui.com/docs

**Full Stack:**
- https://www.youtube.com/@joshtriedcoding (Josh - Next.js + Supabase tutorials)
