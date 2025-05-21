import React, { createContext, useContext, useState, useEffect, useMemo, useRef, MutableRefObject } from 'react'
import { useNavigate } from 'react-router-dom'

interface DebouncedSearchContextType {
  searchTerm: string
  debouncedSearch: string
  setSearchTerm: (term: string) => void
  prevTermRef: MutableRefObject<string>
}

interface DebouncedSearchProviderProps {
  children: React.ReactNode
  debounceTime?: number
}

const DebouncedSearchContext = createContext<DebouncedSearchContextType | undefined>(undefined)

export const DebouncedSearchProvider = ({ children, debounceTime = 300 }: DebouncedSearchProviderProps) => {
  const navigate = useNavigate()
  // Read current query params
  const searchParams = useMemo(() => new URLSearchParams(location.search), [location.search])
  const termParam = searchParams.get('term')

  const [searchTerm, setSearchTerm] = useState(termParam)
  const [debouncedSearch, setDebouncedSearch] = useState(termParam)
  const prevTermRef = useRef<string | undefined>(termParam)

  // Implement debounce with useEffect
  useEffect(() => {
    // Debounce the search term to avoid excessive API calls
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm)
      const params = new URLSearchParams(location.search)
      if (searchTerm) {
        params.set('term', searchTerm)
      } else {
        params.delete('term')
      }
      navigate(`${location.pathname}?${params.toString()}`)
    }, debounceTime)

    return () => clearTimeout(timer)
  }, [searchTerm, debounceTime])

  return (
    <DebouncedSearchContext.Provider value={{ searchTerm, debouncedSearch, setSearchTerm, prevTermRef }}>
      {children}
    </DebouncedSearchContext.Provider>
  )
}

export const useDebouncedSearch = () => {
  const context = useContext(DebouncedSearchContext)
  if (context === undefined) {
    throw new Error('useDebouncedSearch must be used within a DebouncedSearchProvider')
  }
  return context
}
