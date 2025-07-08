import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { SearchParams, useSearchTools } from '~components/Search/queries'
import { ROUTES } from '~src/router/routes'
import { deepEqual } from '~utils/compare'

export const DISTANCE_MAX = 250
export const DISTANCE_DEFAULT = DISTANCE_MAX
export const MAX_COST_MAX = 1000
export const MAX_COST_DEFAULT = MAX_COST_MAX

interface SearchContextType {
  filters: SearchParams
  setFilters: (filters: SearchParams) => void
  lastSearchParams: SearchParams
  isPending: ReturnType<typeof useSearchTools>['isPending']
  isError: ReturnType<typeof useSearchTools>['isError']
  error: ReturnType<typeof useSearchTools>['error']
  result: ReturnType<typeof useSearchTools>['data']
  setPage: (page: number | undefined) => void
}

const SearchContext = createContext<SearchContextType | undefined>(undefined)

export const useSearch = () => {
  const context = useContext(SearchContext)
  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider')
  }
  return context
}

export const defaultFilterValues: Partial<SearchParams> = {
  categories: undefined,
  transportOptions: undefined,
  distance: DISTANCE_DEFAULT,
  maxCost: MAX_COST_DEFAULT,
  mayBeFree: false,
  page: 0,
}

export const SearchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [filters, setFilters] = useState<SearchParams>(defaultFilterValues)
  const [lastSearchParams, setLastSearchParams] = useState<SearchParams>()
  const previousFilterRef = useRef<SearchParams>()
  const { data, mutate, isPending, error, isError } = useSearchTools()

  const performSearch = useCallback(
    (actuals: SearchParams) => {
      previousFilterRef.current = filters
      const searchFilters = {
        ...actuals,
      }

      // Store last search parameters to be used on url serialization
      setLastSearchParams({ ...searchFilters })

      mutate({
        ...searchFilters,
        // page: searchFilters?.page,
        distance: searchFilters.distance * 1000, // Convert to meters
      })
    },
    [filters, mutate, setLastSearchParams]
  )

  // Special callback to set page and perform search
  const setPageWithFilters = useCallback(
    (page: number) => {
      performSearch({
        ...filters,
        page,
      })
    },
    [filters]
  )

  // Perform search on filters change. Resets page
  useEffect(() => {
    // Perform only if is on search route
    if (window.location.pathname !== ROUTES.SEARCH) return
    // If filters haven't changed, skip search
    if (data && deepEqual(previousFilterRef.current, filters)) return
    performSearch({ ...filters, page: 0 })
  }, [filters, previousFilterRef])

  return (
    <SearchContext.Provider
      value={{
        filters,
        setFilters,
        lastSearchParams,
        isPending,
        error,
        isError,
        result: data,
        setPage: setPageWithFilters,
      }}
    >
      {children}
    </SearchContext.Provider>
  )
}
