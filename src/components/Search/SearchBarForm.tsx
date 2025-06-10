import { Box, BoxProps } from '@chakra-ui/react'
import React, { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useSearch } from '~components/Search/SearchContext'
import { ROUTES } from '~src/router/routes'
import { SearchBar } from '~components/Layout/Search/SearchBar'
import { deserializeFiltersFromURL, hasSearchFiltersInURL } from '~utils/searchParams'

export const SearchBarForm = ({
  onSubmit,
  term,
  setTerm,
  onDelete,
  ...rest
}: {
  onSubmit: (e: React.FormEvent) => void
  term: string
  setTerm: (term: string) => void
  onDelete?: () => void
} & BoxProps) => {
  const { t } = useTranslation()

  return (
    <Box as='form' onSubmit={onSubmit} display='flex' alignItems='center' maxW='600px' flex={1} mx={4} {...rest}>
      <SearchBar term={term} setTerm={setTerm} placeholder={t('search.placeholder')} onDelete={onDelete} />
    </Box>
  )
}

export const ContextSearchBarForm = () => {
  const { t } = useTranslation()
  const { filters, setFilters } = useSearch()
  const navigate = useNavigate()
  const [term, setTerm] = useState<string>('')
  const [hasInitialized, setHasInitialized] = useState(false)
  const [searchParams] = useSearchParams()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    navigate(ROUTES.SEARCH)
    setFilters({ ...filters, term })
  }

  const onDelete = useCallback(() => {
    setFilters({ ...filters, term: undefined })
  }, [filters, setFilters])

  // Set term from filters if available
  useEffect(() => {
    if (!hasInitialized && hasSearchFiltersInURL(searchParams)) {
      const deserializedFilters = deserializeFiltersFromURL(searchParams)
      if (deserializedFilters.term) {
        setTerm(deserializedFilters.term)
      }
      setHasInitialized(true)
    }
  }, [hasInitialized, searchParams, filters, setTerm])

  return <SearchBarForm onSubmit={handleSubmit} term={term} setTerm={setTerm} onDelete={onDelete} />
}
