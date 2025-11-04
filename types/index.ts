// Global type definitions

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface User {
  id: string
  email: string
  full_name?: string
  avatar_url?: string
  created_at: string
}

export interface Church {
  id: string
  name: string
  slug: string
  logo_url?: string
  timezone: string
  created_at: string
}

// More types will be added as we build features
