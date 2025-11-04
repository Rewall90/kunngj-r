export default function Home() {
  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">Welcome to Next.js with Tailwind CSS and daisyUI</h1>

        <div className="card bg-base-200 shadow-xl p-6 mb-4">
          <h2 className="card-title">Getting Started</h2>
          <p className="mt-2">Edit <code className="bg-base-300 px-2 py-1 rounded">app/page.tsx</code> to get started.</p>
        </div>

        <div className="flex gap-4">
          <button className="btn btn-primary">Primary Button</button>
          <button className="btn btn-secondary">Secondary Button</button>
          <button className="btn btn-accent">Accent Button</button>
        </div>
      </div>
    </main>
  )
}
