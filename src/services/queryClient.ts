import { QueryClient } from '@tanstack/react-query'
import { persistQueryClient } from '@tanstack/react-query-persist-client'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // gcTime: 1000 * 60 * 60 * 24, // 24 hours
      // staleTime: 1000 * 60 * 5, // 5 minutes
      retry: (failureCount, error: any) => {
        // Don't retry if we're offline
        if (!navigator.onLine) return false
        // Don't retry on 4xx errors except 408 (timeout)
        if (
          error?.response?.status &&
          error.response.status >= 400 &&
          error.response.status < 500 &&
          error.response.status !== 408
        ) {
          return false
        }
        // Otherwise retry twice
        return failureCount < 2
      },
      // Return cached data when offline
      networkMode: 'always',
    },
    mutations: {
      retry: (failureCount, error: any) => {
        if (!navigator.onLine) return false
        if (
          error?.response?.status &&
          error.response.status >= 400 &&
          error.response.status < 500 &&
          error.response.status !== 408
        ) {
          return false
        }
        return failureCount < 2
      },
    },
  },
})

// Create a persister for localStorage
const localStoragePersister = {
  persistClient: async (client: unknown) => {
    if (typeof window === 'undefined') return
    window.localStorage.setItem('EMPRIUS_QUERY_CACHE', JSON.stringify(client))
  },
  restoreClient: async () => {
    if (typeof window === 'undefined') return
    const client = window.localStorage.getItem('EMPRIUS_QUERY_CACHE')
    if (client) {
      return JSON.parse(client)
    }
  },
  removeClient: async () => {
    if (typeof window === 'undefined') return
    window.localStorage.removeItem('EMPRIUS_QUERY_CACHE')
  },
}

// Configure persistence
void persistQueryClient({
  queryClient,
  persister: localStoragePersister,
  maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
  buster: 'v1', // Update this when cache structure changes
  dehydrateOptions: {
    shouldDehydrateQuery: (query) => {
      // Only persist GET queries that have data and no errors
      return query.state.data !== undefined && !query.state.error
    },
  },
})

export default queryClient
