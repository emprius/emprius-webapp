import React from 'react'
import { SearchBar } from '~components/Layout/Search/SearchBar'
import { useDebouncedSearch } from '~components/Layout/Search/DebouncedSearchContext'

interface DebouncedSearchBarProps {
  placeholder?: string
}

export const DebouncedSearchBar = ({ placeholder }: DebouncedSearchBarProps) => {
  const { searchTerm, setSearchTerm } = useDebouncedSearch()

  return <SearchBar setTerm={setSearchTerm} term={searchTerm} placeholder={placeholder} />
}
