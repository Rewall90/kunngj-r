import Link from 'next/link'

export default function AnnouncementsPage() {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Announcements</h1>
        <Link href="/announcements/new" className="btn btn-primary">
          New Announcement
        </Link>
      </div>

      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <p className="text-base-content/70">No announcements yet</p>
        </div>
      </div>
    </div>
  )
}
