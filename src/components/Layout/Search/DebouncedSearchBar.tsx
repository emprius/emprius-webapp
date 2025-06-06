import React from 'react'
import { InputProps } from '@chakra-ui/react'
import { SearchBar } from '~components/Layout/Search/SearchBar'
import { useDebouncedSearch } from '~components/Layout/Search/DebouncedSearchContext'

interface LocalSearchBarProps extends Omit<InputProps, 'value' | 'onChange'> {
  placeholder?: string
}

export const DebouncedSearchBar = ({ placeholder, ...props }: LocalSearchBarProps) => {
  const { searchTerm, setSearchTerm } = useDebouncedSearch()

  return <SearchBar setTerm={setSearchTerm} term={searchTerm} placeholder={placeholder} />
}
