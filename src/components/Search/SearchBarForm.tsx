import { Box, BoxProps, IconButton, Input, InputGroup, InputLeftElement, InputRightElement } from '@chakra-ui/react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { RiCloseCircleFill } from 'react-icons/ri'
import { useNavigate } from 'react-router-dom'
import { useSearch } from '~components/Search/SearchContext'
import { ROUTES } from '~src/router/routes'
import { icons } from '~theme/icons'
import { SearchBar } from '~components/Layout/Search/SearchBar'

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
      <SearchBar term={term} setTerm={setTerm} />
    </Box>
  )
}

export const ContextSearchBarForm = () => {
  const { performSearch, term, setTerm } = useSearch()
  const navigate = useNavigate()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    navigate(ROUTES.SEARCH)
    performSearch()
  }

  return <SearchBarForm onSubmit={handleSubmit} term={term} setTerm={setTerm} />
}
