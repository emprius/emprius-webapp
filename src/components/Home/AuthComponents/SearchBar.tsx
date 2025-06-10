import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { SearchBarForm } from '~components/Search/SearchBarForm'
import { defaultFilterValues, useSearch } from '~components/Search/SearchContext'
import { ROUTES } from '~src/router/routes'

export const LandingSearchBar = () => {
  const [searchValue, setSearchValue] = useState('') // Intermediate state used to not get the initialized term state
  const { setFilters } = useSearch()
  const navigate = useNavigate()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    navigate(ROUTES.SEARCH)
    // Perform search after navigation
    setTimeout(() => {
      setFilters({
        ...defaultFilterValues,
        term: searchValue,
      })
    }, 0)
  }

  const setValue = (value: string) => {
    setSearchValue(value)
  }

  return <SearchBarForm onSubmit={handleSubmit} term={searchValue} setTerm={setValue} w={'full'} maxW={'full'} px={4} />
}
