import React from 'react'
import { Input, InputProps } from '@chakra-ui/react'
import { useSearchTerm } from './SearchTermContext'
import { useTranslation } from 'react-i18next'

interface LocalSearchBarProps extends Omit<InputProps, 'value' | 'onChange'> {
  placeholder?: string
}

export const SearchTermBar = ({ placeholder, ...props }: LocalSearchBarProps) => {
  const { t } = useTranslation()
  const { searchTerm, setSearchTerm } = useSearchTerm()

  return (
    <Input
      placeholder={placeholder || t('common.search', { defaultValue: 'Search...' })}
      onChange={(e) => setSearchTerm(e.target.value)}
      value={searchTerm}
      {...props}
    />
  )
}
