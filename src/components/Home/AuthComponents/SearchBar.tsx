import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { SearchBar } from '~components/Search/SearchBar'
import { useSearch } from '~components/Search/SearchContext'
import { ROUTES } from '~src/router/routes'

export const LandingSearchBar = () => {
  const { t } = useTranslation()
  const [searchValue, setSearchValue] = useState('') // Intermediate state used to not get the initialized term state
  const { setTerm, performSearch } = useSearch()
  const navigate = useNavigate()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    navigate(ROUTES.SEARCH)
    // Perform search after navigation
    setTimeout(() => {
      performSearch()
    }, 0)
  }

  const setValue = (value: string) => {
    setSearchValue(value)
    setTerm(value)
  }

  return <SearchBar onSubmit={handleSubmit} term={searchValue} setTerm={setValue} w={'full'} maxW={'full'} px={4} />
}
