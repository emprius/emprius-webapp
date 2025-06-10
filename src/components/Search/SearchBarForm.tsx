import { Box, BoxProps } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { defaultFilterValues, useSearch } from '~components/Search/SearchContext'
import { ROUTES } from '~src/router/routes'
import { SearchBar } from '~components/Layout/Search/SearchBar'
import { deserializeFiltersFromURL, hasSearchFiltersInURL } from '~utils/searchParams'

export const SearchBarForm = ({
  onSubmit,
  term,
  setTerm,
  ...rest
}: {
  onSubmit: (e: React.FormEvent) => void
  term: string
  setTerm: (term: string) => void
} & BoxProps) => {
  const { t } = useTranslation()

  return (
    <Box as='form' onSubmit={onSubmit} display='flex' alignItems='center' maxW='600px' flex={1} mx={4} {...rest}>
      <SearchBar term={term} setTerm={setTerm} placeholder={t('search.placeholder')} />
    </Box>
  )
}

export const ContextSearchBarForm = () => {
  const { filters, setFilters } = useSearch()
  const navigate = useNavigate()
  const [term, setTerm] = useState<string>('')
  const [hasInitialized, setHasInitialized] = useState(false)
  const [searchParams, setSearchParams] = useSearchParams()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    navigate(ROUTES.SEARCH)
    setFilters({ ...filters, term })
  }

  // Set term from filters if available
  useEffect(() => {
    if (!hasInitialized && hasSearchFiltersInURL(searchParams)) {
      const deserializedFilters = deserializeFiltersFromURL(searchParams)
      if (deserializedFilters.term) {
        setTerm(deserializedFilters.term)
      }
    }
  }, [hasInitialized, searchParams, setFilters, filters])

  return <SearchBarForm onSubmit={handleSubmit} term={term} setTerm={setTerm} />
}
