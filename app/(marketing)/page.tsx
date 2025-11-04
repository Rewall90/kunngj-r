import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-base-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-5xl font-bold mb-4">
            Welcome to kunngj-r
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
        </div>
      </div>
    </div>
  )
}
