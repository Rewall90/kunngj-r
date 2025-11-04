import Link from 'next/link'

export default function SermonsPage() {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Sermons</h1>
        <Link href="/sermons/new" className="btn btn-primary">
          New Sermon
        </Link>
      </div>

      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <p className="text-base-content/70">No sermons yet</p>
        </div>
      </div>
    </div>
  )
}
