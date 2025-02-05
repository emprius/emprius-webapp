import { SearchIcon } from '@chakra-ui/icons'
import { Box, Button, Input, InputGroup, InputLeftElement } from '@chakra-ui/react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useSearch } from '~components/Search/SearchContext'
import { ROUTES } from '~src/router/routes'

export const SearchBar = () => {
  const { t } = useTranslation()
  const { performSearch, term, setTerm } = useSearch()
  const navigate = useNavigate()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    navigate(ROUTES.SEARCH)
    performSearch()
  }

  return (
    <Box as='form' onSubmit={handleSubmit} display='flex' alignItems='center' maxW='600px' flex={1} mx={4}>
      <InputGroup>
        <InputLeftElement pointerEvents='none'>
          <SearchIcon color='gray.500' />
        </InputLeftElement>
        <Input
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          placeholder={t('search.placeholder')}
          bg='white'
          _focus={{ boxShadow: 'outline' }}
        />
      </InputGroup>
      <Button type='submit' ml={2}>
        {t('search.submit')}
      </Button>
    </Box>
  )
}
