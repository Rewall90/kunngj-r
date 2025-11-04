export interface Announcement {
  id: string
  church_id: string
  title: string
  content: string
  status: 'draft' | 'active' | 'finished'
  start_date: string
  end_date: string
  created_at: string
  updated_at: string
}

export interface CreateAnnouncementInput {
  title: string
  content: string
  start_date: string
  end_date: string
}

export interface UpdateAnnouncementInput extends Partial<CreateAnnouncementInput> {
  id: string
}
