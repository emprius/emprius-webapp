import React, { createContext, useContext, useEffect, useState } from 'react'
import { SearchParams, useSearchTools } from '~components/Search/queries'
import { ROUTES } from '~src/router/routes'

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

export const defaultSearchParams: SearchFilters = {
  categories: undefined,
  transportOptions: undefined,
  distance: 50,
  maxCost: 1000,
  mayBeFree: false,
}

export const SearchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [filters, setFilters] = useState<SearchFilters>(defaultSearchParams)
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
