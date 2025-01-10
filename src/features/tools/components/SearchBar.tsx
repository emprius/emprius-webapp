import React from 'react'
import {
  InputGroup,
  InputLeftElement,
  Input,
  IconButton,
  Box,
  useDisclosure,
} from '@chakra-ui/react'
import { SearchIcon, SettingsIcon } from '@chakra-ui/icons'
import { useTranslation } from 'react-i18next'
import { SearchFilters } from '../searchQueries'
import { FilterMenu } from './FilterMenu'

interface SearchBarProps {
  onSearch: (term: string) => void
  onFiltersChange: (filters: Partial<SearchFilters>) => void
  filters: Partial<SearchFilters>
}

export const SearchBar = ({ onSearch, onFiltersChange, filters }: SearchBarProps) => {
  const { t } = useTranslation()
  const { isOpen, onOpen, onClose } = useDisclosure()

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearch(e.target.value)
  }

  return (
    <Box
      position="absolute"
      top={4}
      left="50%"
      transform="translateX(-50%)"
      zIndex={1000}
      width="90%"
      maxWidth="600px"
      bg="white"
      borderRadius="lg"
      boxShadow="lg"
      p={2}
    >
      <InputGroup>
        <InputLeftElement pointerEvents="none">
          <SearchIcon color="gray.300" />
        </InputLeftElement>
        <Input
          placeholder={t('search.placeholder')}
          onChange={handleSearch}
          bg="white"
          _focus={{ boxShadow: 'outline' }}
        />
        <IconButton
          aria-label="Filters"
          icon={<SettingsIcon />}
          ml={2}
          onClick={onOpen}
        />
      </InputGroup>

      <FilterMenu
        isOpen={isOpen}
        onClose={onClose}
        filters={filters}
        onFiltersChange={onFiltersChange}
      />
    </Box>
  )
}
