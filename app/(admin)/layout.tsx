export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex">
      {/* Sidebar will go here */}
      <aside className="w-64 bg-base-200 p-4">
        <div className="font-bold text-xl mb-4">kunngj-r</div>
        <p className="text-sm text-base-content/70">Admin Sidebar</p>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  )
}
