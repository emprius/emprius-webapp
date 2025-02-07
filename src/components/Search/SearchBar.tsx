import { Box, IconButton, Input, InputGroup, InputLeftElement, InputRightElement } from '@chakra-ui/react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useSearch } from '~components/Search/SearchContext'
import { ROUTES } from '~src/router/routes'
import { SearchIcon } from '@chakra-ui/icons'
import { RiCloseCircleFill } from 'react-icons/ri'

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
