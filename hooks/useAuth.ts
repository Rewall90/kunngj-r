'use client'

import { useState, useEffect } from 'react'

/**
 * Hook for authentication state
 * To be implemented with Supabase Auth
 */
export function useAuth() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // TODO: Implement Supabase auth listener
    setLoading(false)
  }, [])

  return { user, loading }
}
