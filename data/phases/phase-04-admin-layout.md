# Phase 4: Admin Layout & Navigation

**Duration:** 2 days (12-16 hours)
**Prerequisites:** Phase 1-3 completed
**Goal:** Build professional admin dashboard layout with sidebar navigation, header, user menu, and responsive mobile design

---

## Overview

In this phase, we'll create the complete admin dashboard layout that will serve as the foundation for all admin features. This includes a responsive sidebar, top navigation bar, breadcrumbs, and a consistent layout structure.

## What You'll Build

- ✅ Responsive sidebar navigation
- ✅ Top header with user menu
- ✅ Breadcrumb navigation
- ✅ Mobile-friendly hamburger menu
- ✅ Theme switcher (light/dark mode)
- ✅ Church switcher dropdown (for multi-tenancy)
- ✅ Professional dashboard layout
- ✅ Navigation state management
- ✅ Active link highlighting

---

## Step 1: Create Layout Components Structure (15 minutes)

### 1.1: Create Components Directory

```bash
mkdir -p components/layout
mkdir -p components/ui
mkdir -p components/admin
```

### 1.2: Create Base Admin Layout

Create `app/(admin)/admin/layout.tsx`:

```typescript
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { AdminSidebar } from '@/components/layout/admin-sidebar'
import { AdminHeader } from '@/components/layout/admin-header'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Get user's churches (we'll expand this in Phase 5)
  const { data: churchMemberships } = await supabase
    .from('church_members')
    .select(`
      *,
      churches (*)
    `)
    .eq('user_id', user.id)
    .eq('is_active', true)

  const churches = churchMemberships?.map(m => m.churches) || []

  return (
    <div className="drawer lg:drawer-open">
      <input id="admin-drawer" type="checkbox" className="drawer-toggle" />

      {/* Main Content */}
      <div className="drawer-content flex flex-col">
        <AdminHeader user={user} churches={churches} />
        <main className="flex-1 bg-base-200 p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>

      {/* Sidebar */}
      <div className="drawer-side">
        <label
          htmlFor="admin-drawer"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <AdminSidebar />
      </div>
    </div>
  )
}
```

---

## Step 2: Create Sidebar Component (45 minutes)

### 2.1: Create Navigation Config

Create `config/navigation.ts`:

```typescript
import {
  HomeIcon,
  MegaphoneIcon,
  MicrophoneIcon,
  DocumentTextIcon,
  DevicePhoneMobileIcon,
  PrinterIcon,
  EnvelopeIcon,
  ShareIcon,
  ChatBubbleBottomCenterTextIcon,
  PhotoIcon,
  ChartBarIcon,
  CogIcon,
  UsersIcon,
} from '@heroicons/react/24/outline'

export interface NavItem {
  name: string
  href: string
  icon: typeof HomeIcon
  badge?: string
  children?: NavItem[]
}

export const navigation: NavItem[] = [
  {
    name: 'Overview',
    href: '/admin',
    icon: HomeIcon,
  },
  {
    name: 'Content',
    href: '/admin/content',
    icon: DocumentTextIcon,
    children: [
      {
        name: 'Announcements',
        href: '/admin/announcements',
        icon: MegaphoneIcon,
      },
      {
        name: 'Sermons',
        href: '/admin/sermons',
        icon: MicrophoneIcon,
      },
    ],
  },
  {
    name: 'Bulletins',
    href: '/admin/bulletins',
    icon: DocumentTextIcon,
    children: [
      {
        name: 'Mobile',
        href: '/admin/bulletins/mobile',
        icon: DevicePhoneMobileIcon,
      },
      {
        name: 'Print',
        href: '/admin/bulletins/print',
        icon: PrinterIcon,
      },
      {
        name: 'Email',
        href: '/admin/bulletins/email',
        icon: EnvelopeIcon,
      },
    ],
  },
  {
    name: 'Channels',
    href: '/admin/channels',
    icon: ShareIcon,
    children: [
      {
        name: 'Social Media',
        href: '/admin/social',
        icon: ShareIcon,
      },
      {
        name: 'SMS Broadcast',
        href: '/admin/broadcasts',
        icon: ChatBubbleBottomCenterTextIcon,
      },
    ],
  },
  {
    name: 'Media Library',
    href: '/admin/media',
    icon: PhotoIcon,
  },
  {
    name: 'Engagement',
    href: '/admin/engagement',
    icon: ChartBarIcon,
  },
  {
    name: 'Subscribers',
    href: '/admin/subscribers',
    icon: UsersIcon,
  },
  {
    name: 'Settings',
    href: '/admin/settings',
    icon: CogIcon,
  },
]
```

### 2.2: Install Heroicons

```bash
npm install @heroicons/react
```

### 2.3: Create Sidebar Component

Create `components/layout/admin-sidebar.tsx`:

```typescript
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { navigation } from '@/config/navigation'
import { cn } from '@/lib/utils'
import { useState } from 'react'

export function AdminSidebar() {
  const pathname = usePathname()
  const [expandedItems, setExpandedItems] = useState<string[]>([])

  const toggleExpand = (name: string) => {
    setExpandedItems((prev) =>
      prev.includes(name)
        ? prev.filter((item) => item !== name)
        : [...prev, name]
    )
  }

  const isActive = (href: string) => {
    if (href === '/admin') {
      return pathname === href
    }
    return pathname.startsWith(href)
  }

  return (
    <aside className="bg-base-100 w-80 min-h-full">
      {/* Logo */}
      <div className="sticky top-0 bg-base-100 z-10 px-6 py-4 border-b border-base-300">
        <Link href="/admin" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-content font-bold text-xl">B</span>
          </div>
          <span className="text-xl font-bold">bltn</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="p-4">
        <ul className="menu menu-lg">
          {navigation.map((item) => {
            const Icon = item.icon
            const active = isActive(item.href)
            const hasChildren = item.children && item.children.length > 0
            const isExpanded = expandedItems.includes(item.name)

            return (
              <li key={item.name}>
                {hasChildren ? (
                  <>
                    <button
                      onClick={() => toggleExpand(item.name)}
                      className={cn(
                        'flex items-center justify-between',
                        active && 'active'
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-5 h-5" />
                        <span>{item.name}</span>
                      </div>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={cn(
                          'w-4 h-4 transition-transform',
                          isExpanded && 'rotate-90'
                        )}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </button>
                    {isExpanded && (
                      <ul className="ml-4">
                        {item.children.map((child) => {
                          const ChildIcon = child.icon
                          const childActive = isActive(child.href)

                          return (
                            <li key={child.name}>
                              <Link
                                href={child.href}
                                className={cn(childActive && 'active')}
                              >
                                <ChildIcon className="w-4 h-4" />
                                {child.name}
                              </Link>
                            </li>
                          )
                        })}
                      </ul>
                    )}
                  </>
                ) : (
                  <Link
                    href={item.href}
                    className={cn(active && 'active')}
                  >
                    <Icon className="w-5 h-5" />
                    {item.name}
                    {item.badge && (
                      <span className="badge badge-primary badge-sm">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                )}
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Upgrade Banner (if free plan) */}
      <div className="p-4 mt-auto">
        <div className="card bg-primary text-primary-content">
          <div className="card-body p-4">
            <h3 className="font-semibold text-sm">Upgrade to Pro</h3>
            <p className="text-xs opacity-90">
              Unlock unlimited features and storage
            </p>
            <button className="btn btn-sm btn-outline border-primary-content text-primary-content mt-2">
              Upgrade Now
            </button>
          </div>
        </div>
      </div>
    </aside>
  )
}
```

---

## Step 3: Create Header Component (30 minutes)

### 3.1: Create Header Component

Create `components/layout/admin-header.tsx`:

```typescript
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Bars3Icon,
  BellIcon,
  ChevronDownIcon,
  MagnifyingGlassIcon,
  MoonIcon,
  SunIcon,
} from '@heroicons/react/24/outline'
import { User } from '@supabase/supabase-js'
import { Church } from '@/types/database'

interface AdminHeaderProps {
  user: User
  churches: Church[]
}

export function AdminHeader({ user, churches }: AdminHeaderProps) {
  const router = useRouter()
  const [theme, setTheme] = useState<'light' | 'dark'>('light')

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    document.documentElement.setAttribute('data-theme', newTheme)
  }

  const handleSignOut = async () => {
    const response = await fetch('/auth/signout', { method: 'POST' })
    if (response.ok) {
      router.push('/login')
      router.refresh()
    }
  }

  return (
    <header className="sticky top-0 z-50 bg-base-100 border-b border-base-300">
      <div className="navbar px-4 md:px-6">
        {/* Left: Mobile Menu + Search */}
        <div className="flex-1 gap-2">
          {/* Mobile Menu Button */}
          <label
            htmlFor="admin-drawer"
            className="btn btn-ghost btn-circle lg:hidden"
          >
            <Bars3Icon className="w-5 h-5" />
          </label>

          {/* Search */}
          <div className="hidden md:flex form-control">
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                className="input input-bordered w-64 pl-10"
              />
              <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-base-content/50" />
            </div>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex-none gap-2">
          {/* Church Switcher */}
          {churches.length > 0 && (
            <div className="dropdown dropdown-end hidden md:block">
              <label
                tabIndex={0}
                className="btn btn-ghost btn-sm gap-2 normal-case"
              >
                <span className="max-w-[150px] truncate">
                  {churches[0]?.name || 'Select Church'}
                </span>
                <ChevronDownIcon className="w-4 h-4" />
              </label>
              <ul
                tabIndex={0}
                className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-64 mt-2"
              >
                {churches.map((church) => (
                  <li key={church.id}>
                    <button>{church.name}</button>
                  </li>
                ))}
                <li className="border-t border-base-300 mt-2 pt-2">
                  <button className="text-primary">+ Add New Church</button>
                </li>
              </ul>
            </div>
          )}

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="btn btn-ghost btn-circle"
            aria-label="Toggle theme"
          >
            {theme === 'light' ? (
              <MoonIcon className="w-5 h-5" />
            ) : (
              <SunIcon className="w-5 h-5" />
            )}
          </button>

          {/* Notifications */}
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-circle">
              <div className="indicator">
                <BellIcon className="w-5 h-5" />
                <span className="badge badge-primary badge-xs indicator-item"></span>
              </div>
            </label>
            <div
              tabIndex={0}
              className="dropdown-content z-[1] card card-compact w-80 p-2 shadow bg-base-100 mt-2"
            >
              <div className="card-body">
                <h3 className="font-bold text-lg">Notifications</h3>
                <p className="text-sm text-base-content/70">
                  No new notifications
                </p>
              </div>
            </div>
          </div>

          {/* User Menu */}
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full bg-primary text-primary-content flex items-center justify-center">
                <span className="text-lg font-semibold">
                  {user.email?.[0].toUpperCase()}
                </span>
              </div>
            </label>
            <ul
              tabIndex={0}
              className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52 mt-2"
            >
              <li className="menu-title">
                <span className="text-xs truncate">{user.email}</span>
              </li>
              <li>
                <a href="/admin/profile">Profile</a>
              </li>
              <li>
                <a href="/admin/settings">Settings</a>
              </li>
              <li className="border-t border-base-300 mt-2 pt-2">
                <button onClick={handleSignOut} className="text-error">
                  Sign Out
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </header>
  )
}
```

---

## Step 4: Create Utility Functions (10 minutes)

### 4.1: Create cn() Utility

Create `lib/utils.ts`:

```typescript
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

### 4.2: Install Dependencies

```bash
npm install clsx tailwind-merge
```

---

## Step 5: Create Breadcrumb Component (20 minutes)

### 5.1: Create Breadcrumb Component

Create `components/ui/breadcrumb.tsx`:

```typescript
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronRightIcon, HomeIcon } from '@heroicons/react/24/outline'
import { Fragment } from 'react'

export function Breadcrumb() {
  const pathname = usePathname()

  // Split path and filter empty strings
  const segments = pathname.split('/').filter(Boolean)

  // Remove 'admin' from breadcrumb
  const breadcrumbs = segments.filter((segment) => segment !== 'admin')

  // Create breadcrumb items
  const items = breadcrumbs.map((segment, index) => {
    const href = '/admin/' + breadcrumbs.slice(0, index + 1).join('/')
    const label = segment
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')

    return { href, label }
  })

  return (
    <div className="text-sm breadcrumbs">
      <ul>
        <li>
          <Link href="/admin" className="flex items-center gap-2">
            <HomeIcon className="w-4 h-4" />
            Dashboard
          </Link>
        </li>
        {items.map((item, index) => (
          <li key={item.href}>
            {index === items.length - 1 ? (
              <span className="text-base-content/70">{item.label}</span>
            ) : (
              <Link href={item.href}>{item.label}</Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
```

### 5.2: Add Breadcrumb to Pages

Create a reusable page header component:

Create `components/admin/page-header.tsx`:

```typescript
import { Breadcrumb } from '@/components/ui/breadcrumb'

interface PageHeaderProps {
  title: string
  description?: string
  action?: React.ReactNode
}

export function PageHeader({ title, description, action }: PageHeaderProps) {
  return (
    <div className="mb-6">
      <Breadcrumb />
      <div className="flex items-center justify-between mt-4">
        <div>
          <h1 className="text-3xl font-bold">{title}</h1>
          {description && (
            <p className="text-base-content/70 mt-1">{description}</p>
          )}
        </div>
        {action && <div>{action}</div>}
      </div>
    </div>
  )
}
```

---

## Step 6: Update Dashboard Page (15 minutes)

### 6.1: Create Dashboard Page with Stats

Update `app/(admin)/admin/page.tsx`:

```typescript
import { createClient } from '@/lib/supabase/server'
import { PageHeader } from '@/components/admin/page-header'
import {
  MegaphoneIcon,
  MicrophoneIcon,
  UsersIcon,
  EyeIcon,
} from '@heroicons/react/24/outline'

export default async function AdminDashboardPage() {
  const supabase = await createClient()

  // Get basic stats (will expand in future phases)
  const { count: announcementsCount } = await supabase
    .from('announcements')
    .select('*', { count: 'exact', head: true })

  const { count: sermonsCount } = await supabase
    .from('sermons')
    .select('*', { count: 'exact', head: true })

  const { count: subscribersCount } = await supabase
    .from('subscribers')
    .select('*', { count: 'exact', head: true })

  const stats = [
    {
      name: 'Total Announcements',
      value: announcementsCount || 0,
      icon: MegaphoneIcon,
      change: '+12%',
      changeType: 'positive' as const,
    },
    {
      name: 'Total Sermons',
      value: sermonsCount || 0,
      icon: MicrophoneIcon,
      change: '+8%',
      changeType: 'positive' as const,
    },
    {
      name: 'Subscribers',
      value: subscribersCount || 0,
      icon: UsersIcon,
      change: '+23%',
      changeType: 'positive' as const,
    },
    {
      name: 'Total Views',
      value: '1,234',
      icon: EyeIcon,
      change: '+5%',
      changeType: 'positive' as const,
    },
  ]

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Welcome back! Here's what's happening with your church."
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.name} className="card bg-base-100 shadow">
              <div className="card-body">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-base-content/70">{stat.name}</p>
                    <p className="text-3xl font-bold mt-1">{stat.value}</p>
                  </div>
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <span
                    className={`text-sm font-medium ${
                      stat.changeType === 'positive'
                        ? 'text-success'
                        : 'text-error'
                    }`}
                  >
                    {stat.change}
                  </span>
                  <span className="text-sm text-base-content/70">
                    from last month
                  </span>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card bg-base-100 shadow">
          <div className="card-body">
            <h2 className="card-title">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <a
                href="/admin/announcements/new"
                className="btn btn-primary btn-outline"
              >
                <MegaphoneIcon className="w-5 h-5" />
                New Announcement
              </a>
              <a
                href="/admin/sermons/new"
                className="btn btn-primary btn-outline"
              >
                <MicrophoneIcon className="w-5 h-5" />
                New Sermon
              </a>
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow">
          <div className="card-body">
            <h2 className="card-title">Recent Activity</h2>
            <div className="text-sm text-base-content/70 mt-4">
              No recent activity to display
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
```

---

## Step 7: Create Placeholder Pages (20 minutes)

### 7.1: Create Announcements Index Page

Create `app/(admin)/admin/announcements/page.tsx`:

```typescript
import { PageHeader } from '@/components/admin/page-header'
import { PlusIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'

export default function AnnouncementsPage() {
  return (
    <div>
      <PageHeader
        title="Announcements"
        description="Manage your church announcements"
        action={
          <Link href="/admin/announcements/new" className="btn btn-primary">
            <PlusIcon className="w-5 h-5" />
            New Announcement
          </Link>
        }
      />

      <div className="card bg-base-100 shadow">
        <div className="card-body">
          <p className="text-base-content/70">
            No announcements yet. Create your first announcement to get started.
          </p>
        </div>
      </div>
    </div>
  )
}
```

### 7.2: Create Sermons Index Page

Create `app/(admin)/admin/sermons/page.tsx`:

```typescript
import { PageHeader } from '@/components/admin/page-header'
import { PlusIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'

export default function SermonsPage() {
  return (
    <div>
      <PageHeader
        title="Sermons"
        description="Manage your sermon library"
        action={
          <Link href="/admin/sermons/new" className="btn btn-primary">
            <PlusIcon className="w-5 h-5" />
            New Sermon
          </Link>
        }
      />

      <div className="card bg-base-100 shadow">
        <div className="card-body">
          <p className="text-base-content/70">
            No sermons yet. Upload your first sermon to get started.
          </p>
        </div>
      </div>
    </div>
  )
}
```

### 7.3: Create Settings Page

Create `app/(admin)/admin/settings/page.tsx`:

```typescript
import { PageHeader } from '@/components/admin/page-header'

export default function SettingsPage() {
  return (
    <div>
      <PageHeader
        title="Settings"
        description="Manage your church and account settings"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card bg-base-100 shadow">
          <div className="card-body">
            <h3 className="card-title text-lg">Church Information</h3>
            <p className="text-sm text-base-content/70">
              Update your church name, logo, and contact details
            </p>
            <div className="card-actions mt-4">
              <button className="btn btn-primary btn-sm">Edit</button>
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow">
          <div className="card-body">
            <h3 className="card-title text-lg">Branding</h3>
            <p className="text-sm text-base-content/70">
              Customize colors, fonts, and bulletin templates
            </p>
            <div className="card-actions mt-4">
              <button className="btn btn-primary btn-sm">Customize</button>
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow">
          <div className="card-body">
            <h3 className="card-title text-lg">Team Members</h3>
            <p className="text-sm text-base-content/70">
              Invite and manage your team members
            </p>
            <div className="card-actions mt-4">
              <button className="btn btn-primary btn-sm">Manage</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
```

---

## Step 8: Add Loading States (10 minutes)

### 8.1: Create Loading Component

Create `app/(admin)/admin/loading.tsx`:

```typescript
export default function AdminLoading() {
  return (
    <div className="space-y-6">
      {/* Page Header Skeleton */}
      <div className="animate-pulse">
        <div className="h-4 bg-base-300 rounded w-48 mb-4"></div>
        <div className="h-8 bg-base-300 rounded w-64"></div>
      </div>

      {/* Stats Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="card bg-base-100 shadow animate-pulse">
            <div className="card-body">
              <div className="h-4 bg-base-300 rounded w-24 mb-2"></div>
              <div className="h-8 bg-base-300 rounded w-16"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Content Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[1, 2].map((i) => (
          <div key={i} className="card bg-base-100 shadow animate-pulse">
            <div className="card-body">
              <div className="h-6 bg-base-300 rounded w-32 mb-4"></div>
              <div className="h-20 bg-base-300 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
```

---

## Step 9: Add Mobile Responsiveness (15 minutes)

### 9.1: Test Mobile Menu

The drawer component from DaisyUI handles mobile responsiveness automatically.

Test by:
1. Open browser dev tools
2. Toggle device toolbar (Ctrl+Shift+M)
3. View at mobile size (375px)
4. Click hamburger menu - sidebar should slide in
5. Click overlay - sidebar should close

### 9.2: Add Mobile Search

Update `components/layout/admin-header.tsx` to add mobile search button:

```typescript
// Add this after the mobile menu button
<button className="btn btn-ghost btn-circle md:hidden">
  <MagnifyingGlassIcon className="w-5 h-5" />
</button>
```

---

## Testing Checklist

Before moving to Phase 5, verify:

- [ ] Sidebar navigation displays correctly
- [ ] All navigation links work
- [ ] Active link highlighting works
- [ ] Collapsible menu items expand/collapse
- [ ] Header displays user email and avatar
- [ ] Theme toggle switches between light/dark
- [ ] Church switcher dropdown works (if churches exist)
- [ ] Notifications dropdown opens
- [ ] User menu dropdown opens
- [ ] Sign out redirects to login
- [ ] Breadcrumbs show correct path
- [ ] Page header component renders properly
- [ ] Dashboard stats display (even if 0)
- [ ] Quick actions are clickable
- [ ] Mobile hamburger menu opens sidebar
- [ ] Mobile menu overlay closes sidebar
- [ ] All pages are responsive on mobile (375px)
- [ ] Loading states display correctly

---

## Troubleshooting

### Sidebar not showing
- Check DaisyUI drawer classes are correct
- Verify `lg:drawer-open` is on parent div
- Clear browser cache and restart dev server

### Navigation links not highlighting
- Verify `usePathname()` hook is working
- Check `isActive()` logic in sidebar component
- Ensure paths match exactly

### Theme toggle not working
- Check `data-theme` attribute on `<html>` element
- Verify DaisyUI themes are configured in `tailwind.config.ts`
- Add themes to config if missing:
  ```typescript
  daisyui: {
    themes: ["light", "dark"],
  }
  ```

### Icons not displaying
- Verify `@heroicons/react` is installed
- Check imports use correct path (`/24/outline` or `/24/solid`)

---

## Commit Your Changes

```bash
git add .
git commit -m "feat: Complete Phase 4 - Admin layout with sidebar navigation, header, breadcrumbs, and responsive design"
git push
```

---

## Next Steps

Phase 4 Complete! 🎉

**Next Phase:** [Phase 5 - Church Setup & Multi-tenancy](phase-05-church-setup.md)

In Phase 5, we'll build:
- Church creation wizard
- Church settings management
- Team member invitations
- Role-based permissions
- Church switcher functionality

---

**Estimated Time:** 2 days
**Difficulty:** ⭐⭐⭐ Intermediate
**Phase Status:** ⚪ Not Started → 🟢 Complete
