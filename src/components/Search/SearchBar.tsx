import { SearchIcon, SettingsIcon } from '@chakra-ui/icons'
import { Box, Button, HStack, IconButton, Input, InputGroup, InputLeftElement, useDisclosure } from '@chakra-ui/react'
import React from 'react'
import { useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { FiltersDrawer } from '~components/Search/Filter'
import { FiMap } from 'react-icons/fi'

interface SearchBarProps {
  onToggleView: () => void
  isMapView: boolean
}

export const SearchBar = ({ onToggleView, isMapView }: SearchBarProps) => {
  const { t } = useTranslation()
  const { register } = useFormContext()
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <Box
      position='absolute'
      top={2}
      left='50%'
      transform='translateX(-50%)'
      zIndex={900}
      width='90%'
      maxWidth='600px'
      bg='white'
      borderRadius='lg'
      boxShadow='lg'
      p={2}
    >
      <HStack>
        <IconButton
          aria-label='Filters'
          icon={<SettingsIcon />}
          onClick={onOpen}
          display={{ base: 'flex', lg: 'none' }}
        />
        <InputGroup>
          <InputLeftElement pointerEvents='none'>
            <SearchIcon color='gray.500' />
          </InputLeftElement>
          <Input
            {...register('term')}
            placeholder={t('search.placeholder')}
            bg='white'
            _focus={{ boxShadow: 'outline' }}
          />
        </InputGroup>
        <Button type='submit' colorScheme='blue'>
          {t('search.submit')}
        </Button>
        <IconButton
          aria-label={isMapView ? 'Switch to list view' : 'Switch to map view'}
          icon={<FiMap />}
          onClick={onToggleView}
          variant={isMapView ? 'solid' : 'outline'}
          colorScheme='blue'
        />
      </HStack>
      <FiltersDrawer isOpen={isOpen} onClose={onClose} />
    </Box>
  )
}
