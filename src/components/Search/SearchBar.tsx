import { SearchIcon } from '@chakra-ui/icons'
import { Box, BoxProps, IconButton, Input, InputGroup, InputLeftElement, InputRightElement } from '@chakra-ui/react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { RiCloseCircleFill } from 'react-icons/ri'
import { useNavigate } from 'react-router-dom'
import { useSearch } from '~components/Search/SearchContext'
import { ROUTES } from '~src/router/routes'

export const SearchBar = ({
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
      <InputGroup>
        {!term && (
          <InputLeftElement pointerEvents='none'>
            <SearchIcon color='gray.500' />
          </InputLeftElement>
        )}
        <Input
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          placeholder={t('search.placeholder')}
          bg='white'
          type={'search'}
          w={'full'}
        />
        {term && (
          <InputRightElement>
            <IconButton
              onClick={() => {
                setTerm('')
              }}
              size='md'
              isRound
              aria-label={t('search.delete_search_term')}
              icon={<RiCloseCircleFill />}
              variant='ghost'
              color='primary.300'
              sx={{
                svg: {
                  width: '22px',
                  height: '22px',
                },
              }}
            />
          </InputRightElement>
        )}
      </InputGroup>
    </Box>
  )
}

export const ContextSearchBar = () => {
  const { performSearch, term, setTerm } = useSearch()
  const navigate = useNavigate()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    navigate(ROUTES.SEARCH)
    performSearch()
  }

  return <SearchBar onSubmit={handleSubmit} term={term} setTerm={setTerm} />
}
