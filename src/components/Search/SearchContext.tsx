import React, { createContext, useContext, useEffect, useState } from 'react'
import { SearchParams, useSearchTools } from '~components/Search/queries'
import { ROUTES } from '~src/router/routes'

export const DISTANCE_MAX = 250
export const DISTANCE_DEFAULT = DISTANCE_MAX
export const MAX_COST_MAX = 1000
export const MAX_COST_DEFAULT = MAX_COST_MAX

interface SearchContextType {
  filters: SearchParams
  setFilters: (filters: SearchParams) => void
  performSearch: () => void
  term: string
  setTerm: React.Dispatch<React.SetStateAction<string>>
  isPending: ReturnType<typeof useSearchTools>['isPending']
  isError: ReturnType<typeof useSearchTools>['isError']
  error: ReturnType<typeof useSearchTools>['error']
  result: ReturnType<typeof useSearchTools>['data']
}

const SearchContext = createContext<SearchContextType | undefined>(undefined)

export const useSearch = () => {
  const context = useContext(SearchContext)
  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider')
  }
  return context
}

export type SearchFilters = Omit<SearchParams, 'term'>

export const defaultFilterValues: Partial<SearchFilters> = {
  categories: undefined,
  transportOptions: undefined,
  distance: DISTANCE_DEFAULT,
  maxCost: MAX_COST_DEFAULT,
  mayBeFree: false,
}
export const SearchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [filters, setFilters] = useState<SearchFilters>(defaultFilterValues)
  const [term, setTerm] = useState<string>('')
  const { data, mutate, isPending, error, isError } = useSearchTools()

  const performSearch = () => {
    const searchFilters = {
      ...filters,
    }

    if (term) {
      searchFilters['term'] = term
    }

    mutate({
      ...searchFilters,
      distance: searchFilters.distance * 1000, // Convert to meters
    })
  }

  // Perform search on filters change
  useEffect(() => {
    // Perform only if is on search route
    if (window.location.pathname !== ROUTES.SEARCH) return
    performSearch()
  }, [filters])

  return (
    <SearchContext.Provider
      value={{
        filters,
        setFilters,
        performSearch,
        term,
        setTerm,
        isPending,
        error,
        isError,
        result: data,
      }}
    >
      {children}
    </SearchContext.Provider>
  )
}
