import { Box, BoxProps, IconButton, Input, InputGroup, InputLeftElement, InputRightElement } from '@chakra-ui/react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { RiCloseCircleFill } from 'react-icons/ri'
import { useNavigate } from 'react-router-dom'
import { useSearch } from '~components/Search/SearchContext'
import { ROUTES } from '~src/router/routes'
import { icons } from '~theme/icons'

export type SearchBarProps = {
  term: string
  setTerm: (term: string) => void
}

export const SearchBar = ({ term, setTerm, ...rest }: SearchBarProps) => {
  const { t } = useTranslation()

  return (
    <InputGroup>
      {!term && (
        <InputLeftElement pointerEvents='none'>
          <icons.search />
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
  )
}
