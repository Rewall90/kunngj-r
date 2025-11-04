# kunngj-r

A modern church bulletin and communication platform built with Next.js 16, Supabase, and TypeScript.

## 🚀 Features (Planned)

- 📢 **Announcements** - Create and manage church announcements
- 🎤 **Sermons** - Sermon library with audio/video support
- 📱 **Mobile Bulletins** - Block-based bulletin builder
- 🖨️ **Print Bulletins** - Professional PDF generation
- 📧 **Email Bulletins** - Responsive email templates
- 📱 **Social Media** - Multi-platform post scheduling
- 💬 **SMS Broadcasts** - Twilio-powered messaging
- 📊 **Analytics** - Engagement tracking and insights
- 👥 **Team Collaboration** - Multi-user with roles
- 💰 **Subscriptions** - Stripe-powered billing

## 🛠️ Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + daisyUI
- **Database:** Supabase (PostgreSQL) - To be implemented
- **Authentication:** Supabase Auth - To be implemented
- **Storage:** Supabase Storage - To be implemented
- **Payments:** Stripe - To be implemented
- **SMS:** Twilio - To be implemented
- **Email:** Resend - To be implemented
- **Analytics:** PostHog - To be implemented
- **Deployment:** Vercel

## 📋 Prerequisites

- Node.js 18.17 or higher
- npm
- Git

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Rewall90/kunngj-r.git
cd kunngj-r
```

### 2. Install dependencies

```bash
npm install
```

### 3. Run development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
kunngj-r/
├── app/                      # Next.js 16 App Router
│   ├── (auth)/              # Authentication pages
│   ├── (marketing)/         # Public marketing pages
│   ├── (admin)/             # Protected admin dashboard
│   └── api/                 # API routes
├── components/              # Reusable React components
│   ├── announcements/       # Announcement components
│   ├── bulletins/          # Bulletin components
│   ├── layout/             # Layout components (Sidebar, Header)
│   └── ui/                 # UI components (Button, Card, etc.)
├── lib/                    # Core utilities and clients
│   └── supabase/           # Supabase clients
├── types/                  # TypeScript definitions
├── hooks/                  # Custom React hooks
├── config/                 # Configuration files
├── supabase/              # Database migrations
└── data/                  # Documentation and guides
```

## 🧪 Development

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Run production build
npm start

# Lint code
npm run lint
```

## 📚 Documentation

- [Phase Guides](data/phases/README.md) - Step-by-step development guides
- [Database Schema](data/database-schema.md) - PostgreSQL schema documentation
- [File Architecture](data/file-architecture.md) - Project structure
- [Tech Stack](data/tech-stack.md) - Technology decisions

## 🎯 Development Progress

- ✅ **Phase 1:** Project Setup & Configuration
  - [x] Next.js 16 with TypeScript
  - [x] Tailwind CSS + daisyUI
  - [x] Complete file architecture
  - [x] TypeScript path aliases
  - [x] Git repository initialized
  - [x] GitHub integration

- ⏳ **Phase 2:** Supabase Foundation (In Progress)
- ⏳ **Phase 3:** Authentication
- ⏳ **Phase 4:** Admin Layout
- ... and more phases to come

## 🤝 Contributing

This is a personal project, but contributions are welcome!

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

MIT License - see [LICENSE](LICENSE) file for details

---

**Status:** 🟡 In Development
**Current Phase:** Phase 1 - Project Setup (Complete)
**Progress:** 1/16 phases complete
