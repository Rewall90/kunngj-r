import Link from 'next/link'

export default function SocialPage() {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Social Media</h1>
        <Link href="/social/new" className="btn btn-primary">
          New Post
        </Link>
      </div>

      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <p className="text-base-content/70">No social posts yet</p>
        </div>
      </div>
    </div>
  )
}
