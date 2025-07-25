import {
  Box,
  BoxProps,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  InputProps,
  InputRightElement,
} from '@chakra-ui/react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { RiCloseCircleFill } from 'react-icons/ri'
import { useNavigate } from 'react-router-dom'
import { useSearch } from '~components/Search/SearchContext'
import { ROUTES } from '~src/router/routes'
import { icons } from '~theme/icons'

export type SearchApiParams = { term?: string }

export type SearchBarProps = {
  term: string
  placeholder?: string
  setTerm: (term: string) => void
  onDelete?: () => void
}

export const SearchBar = ({ term, setTerm, placeholder, onDelete }: SearchBarProps) => {
  const { t } = useTranslation()

  return (
    <InputGroup>
      {!term && (
        <InputLeftElement pointerEvents='none'>
          <icons.search />
        </InputLeftElement>
      )}
      <Input
        value={term ?? ''}
        onChange={(e) => setTerm(e.target.value)}
        placeholder={placeholder}
        bg='white'
        type={'search'}
        w={'full'}
      />
      {term && (
        <InputRightElement>
          <IconButton
            onClick={() => {
              setTerm('')
              if (onDelete) onDelete()
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
