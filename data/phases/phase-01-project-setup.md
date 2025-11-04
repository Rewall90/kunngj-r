# Phase 1: Project Setup & Configuration

## 📋 Overview

Initialize a Next.js 14 project with TypeScript, Tailwind CSS, DaisyUI, and all necessary development tools. This phase sets the foundation for the entire application.

## ✅ Prerequisites

- **Node.js** 18.17 or higher ([Download](https://nodejs.org/))
- **npm** (comes with Node.js)
- **Git** ([Download](https://git-scm.com/))
- **Code Editor** - VS Code recommended ([Download](https://code.visualstudio.com/))
- **Terminal** - PowerShell (Windows), Terminal (Mac/Linux)

## 🎯 Goals

By the end of this phase, you will have:

- ✅ Next.js 14 project initialized with App Router
- ✅ TypeScript configured with path aliases
- ✅ Tailwind CSS + DaisyUI installed and working
- ✅ ESLint and Prettier configured
- ✅ Git repository initialized
- ✅ Development environment ready to code

## ⏱️ Time Estimate

**1-2 hours** (for experienced developers)
**2-4 hours** (for beginners)

---

## 📝 Step-by-Step Instructions

### Step 1: Create Project Directory (2 minutes)

Open your terminal and navigate to your projects folder:

```bash
# Windows (PowerShell)
cd C:\Users\Petter\Desktop\prosjekter\bltn

# Mac/Linux
cd ~/Desktop/prosjekter/bltn
```

### Step 2: Initialize Next.js Project (5 minutes)

Run the Next.js create command:

```bash
npx create-next-app@latest bltn-clone
```

**When prompted, answer:**

```
✔ Would you like to use TypeScript? … Yes
✔ Would you like to use ESLint? … Yes
✔ Would you like to use Tailwind CSS? … Yes
✔ Would you like to use `src/` directory? … No
✔ Would you like to use App Router? (recommended) … Yes
✔ Would you like to customize the default import alias (@/*)? … No
```

Navigate into the project:

```bash
cd bltn-clone
```

### Step 3: Install Core Dependencies (10 minutes)

Install all required packages:

```bash
# Supabase
npm install @supabase/supabase-js @supabase/auth-helpers-nextjs

# UI & Styling
npm install daisyui

# Rich Text Editor
npm install @tiptap/react @tiptap/starter-kit @tiptap/extension-image @tiptap/extension-link @tiptap/extension-placeholder

# Forms & Validation
npm install react-hook-form zod @hookform/resolvers

# State Management
npm install zustand

# Utilities
npm install date-fns clsx tailwind-merge

# Drag & Drop
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities

# PDF Generation
npm install @react-pdf/renderer

# Email
npm install react-email @react-email/components

# File Upload
npm install react-dropzone

# Calendar
npm install react-big-calendar

# Icons
npm install lucide-react

# Charts
npm install recharts

# Payments
npm install stripe @stripe/stripe-js

# Analytics
npm install posthog-js posthog-node

# React Query
npm install @tanstack/react-query
```

Install development dependencies:

```bash
npm install -D @types/react-big-calendar prettier prettier-plugin-tailwindcss husky lint-staged
```

**⏳ This will take 2-5 minutes to complete.**

### Step 4: Configure TypeScript (5 minutes)

Update **`tsconfig.json`**:

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./*"],
      "@/components/*": ["components/*"],
      "@/lib/*": ["lib/*"],
      "@/types/*": ["types/*"],
      "@/hooks/*": ["hooks/*"],
      "@/utils/*": ["utils/*"],
      "@/config/*": ["config/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

**What this does:**
- Adds path aliases (`@/components`, `@/lib`, etc.)
- Enables strict TypeScript mode
- Configures Next.js plugin support

### Step 5: Configure Tailwind + DaisyUI (5 minutes)

Update **`tailwind.config.ts`**:

```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        church: {
          primary: 'var(--church-primary)',
          secondary: 'var(--church-secondary)',
        },
      },
    },
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: ['light', 'dark'],
    base: true,
    styled: true,
    utils: true,
  },
}
export default config
```

**What this does:**
- Adds DaisyUI plugin
- Configures custom church colors
- Sets up light/dark theme support

### Step 6: Configure Next.js (5 minutes)

Update **`next.config.js`**:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
}

module.exports = nextConfig
```

**What this does:**
- Allows images from Supabase
- Configures server actions
- Sets file upload limits

### Step 7: Configure ESLint (3 minutes)

Update **`.eslintrc.json`**:

```json
{
  "extends": [
    "next/core-web-vitals",
    "plugin:@typescript-eslint/recommended"
  ],
  "rules": {
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/no-explicit-any": "warn",
    "react-hooks/exhaustive-deps": "warn"
  }
}
```

**What this does:**
- Enforces TypeScript best practices
- Warns about unused variables
- Checks React hooks dependencies

### Step 8: Configure Prettier (3 minutes)

Create **`.prettierrc`**:

```json
{
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 80,
  "plugins": ["prettier-plugin-tailwindcss"]
}
```

Create **`.prettierignore`**:

```
node_modules
.next
out
build
dist
public
*.md
```

**What this does:**
- Consistent code formatting
- Auto-sorts Tailwind classes
- Ignores build directories

### Step 9: Set Up Git Hooks (5 minutes)

Initialize Husky:

```bash
npx husky init
```

Create **`.husky/pre-commit`**:

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx lint-staged
```

Update **`package.json`** - add this section:

```json
{
  "lint-staged": {
    "*.{ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ],
    "*.{json,md}": [
      "prettier --write"
    ]
  }
}
```

**What this does:**
- Auto-format code before commits
- Run linting automatically
- Maintain code quality

### Step 10: Create Environment Variables Template (3 minutes)

Create **`.env.local.example`**:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Stripe
STRIPE_SECRET_KEY=your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=your_webhook_secret

# Twilio
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_PHONE_NUMBER=your_twilio_phone

# Resend
RESEND_API_KEY=your_resend_key

# PostHog
NEXT_PUBLIC_POSTHOG_KEY=your_posthog_key
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Create **`.env.local`** (for now):

```bash
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Add to **`.gitignore`**:

```
# Local env files
.env*.local
.env
```

**What this does:**
- Template for all environment variables
- Local development configuration
- Prevents secrets from being committed

### Step 11: Create Project Directories (3 minutes)

Run these commands:

```bash
# Windows PowerShell
mkdir components, lib, types, hooks, utils, config, supabase

# Mac/Linux
mkdir components lib types hooks utils config supabase
```

Or create them in VS Code's file explorer.

### Step 12: Create Basic Utility Files (5 minutes)

Create **`lib/utils.ts`**:

```typescript
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Merge Tailwind classes with proper precedence
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format date for display
 */
export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(date))
}

/**
 * Truncate text with ellipsis
 */
export function truncate(str: string, length: number): string {
  if (str.length <= length) return str
  return str.slice(0, length) + '...'
}
```

Create **`config/site.ts`**:

```typescript
export const siteConfig = {
  name: 'bltn',
  description: 'Church bulletin and communication platform',
  url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
}
```

Create **`types/index.ts`**:

```typescript
// Global type definitions will go here
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]
```

### Step 13: Update Root Layout (5 minutes)

Update **`app/layout.tsx`**:

```typescript
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { siteConfig } from '@/config/site'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: ['church', 'bulletin', 'communication', 'announcements'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" data-theme="light">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}
```

### Step 14: Create Test Homepage (5 minutes)

Update **`app/page.tsx`**:

```typescript
import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-base-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-5xl font-bold mb-4">
            Welcome to bltn Clone
          </h1>
          <p className="text-xl text-base-content/70 mb-8">
            Church bulletin and communication platform
          </p>

          <div className="flex gap-4 justify-center">
            <Link href="/login" className="btn btn-primary">
              Login
            </Link>
            <Link href="/signup" className="btn btn-outline">
              Sign Up
            </Link>
          </div>

          {/* Test DaisyUI Components */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card bg-base-200 shadow-xl">
              <div className="card-body">
                <h2 className="card-title">Announcements</h2>
                <p>Create and manage church announcements</p>
              </div>
            </div>
            <div className="card bg-base-200 shadow-xl">
              <div className="card-body">
                <h2 className="card-title">Bulletins</h2>
                <p>Build beautiful mobile and print bulletins</p>
              </div>
            </div>
            <div className="card bg-base-200 shadow-xl">
              <div className="card-body">
                <h2 className="card-title">Social Media</h2>
                <p>Schedule posts across all platforms</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
```

### Step 15: Initialize Git Repository (5 minutes)

```bash
# Initialize Git
git init

# Add all files
git add .

# First commit
git commit -m "Initial commit: Phase 1 - Project setup complete"
```

### Step 16: GitHub Integration (15 minutes)

#### 16.1: Create GitHub Repository

1. Go to [github.com](https://github.com) and log in
2. Click **"New repository"** (or go to github.com/new)
3. Fill in details:
   - **Repository name:** `bltn-clone`
   - **Description:** `Church bulletin and communication platform built with Next.js 14 and Supabase`
   - **Visibility:** Private (recommended for now)
   - **DO NOT** initialize with README, .gitignore, or license (we already have these)

4. Click **"Create repository"**

#### 16.2: Connect Local Repository to GitHub

```bash
# Add GitHub remote
git remote add origin https://github.com/YOUR_USERNAME/bltn-clone.git

# Verify remote
git remote -v

# Push to GitHub
git branch -M main
git push -u origin main
```

#### 16.3: Create Project README

Create **`README.md`** in your project root:

```markdown
# bltn Clone

A modern church bulletin and communication platform built with Next.js 14, Supabase, and TypeScript.

## 🚀 Features

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

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + DaisyUI
- **Database:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth
- **Storage:** Supabase Storage
- **Payments:** Stripe
- **SMS:** Twilio
- **Email:** Resend
- **Analytics:** PostHog
- **Deployment:** Vercel

## 📋 Prerequisites

- Node.js 18.17 or higher
- npm or pnpm
- Git
- Supabase account
- Stripe account (for billing features)

## 🚀 Getting Started

### 1. Clone the repository

\`\`\`bash
git clone https://github.com/YOUR_USERNAME/bltn-clone.git
cd bltn-clone
\`\`\`

### 2. Install dependencies

\`\`\`bash
npm install
\`\`\`

### 3. Set up environment variables

\`\`\`bash
cp .env.local.example .env.local
\`\`\`

Edit `.env.local` and add your API keys.

### 4. Run development server

\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

\`\`\`
bltn-clone/
├── app/              # Next.js 14 App Router
├── components/       # React components
├── lib/             # Utilities and clients
├── types/           # TypeScript definitions
├── hooks/           # Custom React hooks
├── supabase/        # Database migrations
└── phases/          # Development phase guides
\`\`\`

## 🧪 Development

\`\`\`bash
# Run development server
npm run dev

# Build for production
npm run build

# Run production build
npm start

# Lint code
npm run lint

# Format code
npm run format

# Type check
npm run type-check
\`\`\`

## 📚 Documentation

- [Phase Guides](phases/README.md) - Step-by-step development guides
- [Database Schema](database-schema.md) - PostgreSQL schema documentation
- [File Architecture](file-architecture.md) - Project structure
- [Tech Stack](tech-stack.md) - Technology decisions

## 🤝 Contributing

This is a personal project, but contributions are welcome!

1. Fork the repository
2. Create a feature branch (\`git checkout -b feature/amazing-feature\`)
3. Commit your changes (\`git commit -m 'Add amazing feature'\`)
4. Push to the branch (\`git push origin feature/amazing-feature\`)
5. Open a Pull Request

## 📝 License

MIT License - see [LICENSE](LICENSE) file for details

## 🙏 Acknowledgments

- Inspired by [bltn.app](https://bltn.app)
- Built with modern web technologies
- Designed for churches of all sizes

---

**Status:** 🟡 In Development
**Current Phase:** Phase 1 - Project Setup
**Progress:** 1/16 phases complete
\`\`\`

Commit and push the README:

```bash
git add README.md
git commit -m "docs: Add comprehensive README"
git push
```

#### 16.4: Set Up GitHub Actions (CI/CD)

Create **`.github/workflows/ci.yml`**:

```yaml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  lint-and-type-check:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run ESLint
        run: npm run lint

      - name: Type check
        run: npm run type-check

      - name: Build
        run: npm run build
```

#### 16.5: Add Issue Templates

Create **`.github/ISSUE_TEMPLATE/bug_report.md`**:

```markdown
---
name: Bug Report
about: Report a bug or issue
title: '[BUG] '
labels: bug
assignees: ''
---

## 🐛 Bug Description
A clear description of the bug.

## 📋 Steps to Reproduce
1. Go to '...'
2. Click on '...'
3. See error

## ✅ Expected Behavior
What should happen.

## ❌ Actual Behavior
What actually happens.

## 📸 Screenshots
If applicable, add screenshots.

## 💻 Environment
- OS: [e.g. Windows 11]
- Browser: [e.g. Chrome 120]
- Node version: [e.g. 18.17.0]
```

Create **`.github/ISSUE_TEMPLATE/feature_request.md`**:

```markdown
---
name: Feature Request
about: Suggest a new feature
title: '[FEATURE] '
labels: enhancement
assignees: ''
---

## 💡 Feature Description
A clear description of the feature.

## 🎯 Problem It Solves
What problem does this solve?

## 🚀 Proposed Solution
How should it work?

## 🎨 Design/Mockups
Any mockups or designs?

## 📋 Additional Context
Any other context or examples.
```

#### 16.6: Add Pull Request Template

Create **`.github/pull_request_template.md`**:

```markdown
## 📝 Description
Brief description of changes.

## 🎯 Related Issue
Closes #(issue number)

## ✅ Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## 🧪 How Has This Been Tested?
Describe testing steps.

## 📸 Screenshots
If applicable, add screenshots.

## ✅ Checklist
- [ ] My code follows the project's code style
- [ ] I have performed a self-review
- [ ] I have commented my code where necessary
- [ ] I have updated the documentation
- [ ] My changes generate no new warnings
- [ ] I have tested my changes
```

#### 16.7: Commit GitHub Integration Files

```bash
# Create directories
mkdir -p .github/workflows .github/ISSUE_TEMPLATE

# After creating all files above, commit them
git add .github/
git commit -m "ci: Add GitHub Actions and templates"
git push
```

### Step 17: Test the Development Server (5 minutes)

Start the development server:

```bash
npm run dev
```

Open your browser to **http://localhost:3000**

You should see:
- ✅ Homepage loads successfully
- ✅ DaisyUI styling applied
- ✅ Cards displayed correctly
- ✅ Buttons have proper styling
- ✅ No console errors

---

## 📦 Files Created/Modified

```
bltn-clone/
├── .husky/
│   └── pre-commit
├── app/
│   ├── layout.tsx (updated)
│   └── page.tsx (updated)
├── components/
├── lib/
│   └── utils.ts
├── types/
│   └── index.ts
├── hooks/
├── utils/
├── config/
│   └── site.ts
├── supabase/
├── .env.local
├── .env.local.example
├── .prettierrc
├── .prettierignore
├── next.config.js (updated)
├── tailwind.config.ts (updated)
├── tsconfig.json (updated)
├── .eslintrc.json (updated)
└── package.json (updated)
```

---

## ✅ Testing Checklist

Verify each item before proceeding:

- [ ] `npm run dev` starts without errors
- [ ] Homepage loads at http://localhost:3000
- [ ] DaisyUI components render correctly
- [ ] TypeScript compiles with no errors: `npm run build`
- [ ] ESLint passes: `npx eslint .`
- [ ] Prettier formats code: `npx prettier --write .`
- [ ] Git hooks work: Make a dummy change and commit
- [ ] Path aliases work: Try importing `@/lib/utils`
- [ ] Dark theme toggle works (add manually to test)

---

## 🐛 Troubleshooting

### Problem: `npm install` fails

**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

### Problem: TypeScript errors about path aliases

**Solution:**
- Restart VS Code or TypeScript server
- Run `npm run build` to regenerate types
- Check `tsconfig.json` paths are correct

### Problem: Tailwind classes not applying

**Solution:**
- Verify `tailwind.config.ts` content paths
- Check `globals.css` has Tailwind directives
- Restart dev server

### Problem: Git hooks not working

**Solution:**
```bash
# Make husky hooks executable
chmod +x .husky/pre-commit  # Mac/Linux

# Reinstall husky
npm uninstall husky
npm install -D husky
npx husky init
```

### Problem: Port 3000 already in use

**Solution:**
```bash
# Use different port
npm run dev -- -p 3001

# Or kill process on port 3000 (Windows)
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

---

## 📚 What You Learned

- ✅ How to set up a modern Next.js 14 project
- ✅ TypeScript configuration with path aliases
- ✅ Tailwind CSS + DaisyUI integration
- ✅ Code quality tools (ESLint, Prettier, Husky)
- ✅ Git workflow best practices
- ✅ Environment variable management

---

## 🎯 Next Steps

You're now ready for **Phase 2: Supabase Foundation**!

Next phase covers:
- Creating Supabase project
- Database schema setup
- Environment configuration
- Testing database connection

---

## 📝 Notes

**Keep this terminal command handy:**
```bash
# Start development server
npm run dev

# Type check
npm run build

# Lint code
npx eslint .

# Format code
npx prettier --write .
```

---

**Phase Status:** ✅ Complete
**Time Taken:** ___ hours
**Next Phase:** [Phase 2 - Supabase Foundation](phase-02-supabase-setup.md)
