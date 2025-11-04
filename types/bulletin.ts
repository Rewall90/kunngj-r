export type BulletinType = 'mobile' | 'print' | 'email'

export interface Bulletin {
  id: string
  church_id: string
  type: BulletinType
  week_id: string
  title: string
  content: Json
  status: 'draft' | 'published'
  published_at?: string
  created_at: string
  updated_at: string
}

export interface BulletinBlock {
  id: string
  type: string
  content: Json
  order: number
}

type Json = Record<string, unknown>
