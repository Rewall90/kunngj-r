'use client'

/**
 * Hook for fetching and mutating announcements
 * To be implemented with React Query + Supabase
 */
export function useAnnouncements() {
  // TODO: Implement with React Query
  return {
    announcements: [],
    isLoading: false,
    error: null,
  }
}

export function useCreateAnnouncement() {
  // TODO: Implement mutation
  return {
    mutate: async () => {},
    isLoading: false,
  }
}
