'use client'

import Link from 'next/link'

export function Sidebar() {
  const navItems = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Announcements', href: '/announcements' },
    { name: 'Sermons', href: '/sermons' },
    { name: 'Bulletins', href: '/bulletins/mobile' },
    { name: 'Social Media', href: '/social' },
    { name: 'Settings', href: '/settings' },
  ]

  return (
    <aside className="w-64 bg-base-200 min-h-screen p-4">
      <div className="font-bold text-xl mb-8">kunngj-r</div>

      <nav className="space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="block px-4 py-2 rounded hover:bg-base-300 transition-colors"
          >
            {item.name}
          </Link>
        ))}
      </nav>
    </aside>
  )
}
