import { SearchIcon, SettingsIcon } from '@chakra-ui/icons'
import { Box, Button, HStack, IconButton, Input, InputGroup, InputLeftElement, useDisclosure } from '@chakra-ui/react'
import React from 'react'
import { useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { FilterMenu } from './FilterMenu'

export const SearchBar = () => {
  const { t } = useTranslation()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { register } = useFormContext()

  return (
    <Box
      position='absolute'
      top={4}
      left='50%'
      transform='translateX(-50%)'
      zIndex={1000}
      width='90%'
      maxWidth='600px'
      bg='white'
      borderRadius='lg'
      boxShadow='lg'
      p={2}
    >
      <HStack>
        <InputGroup>
          <InputLeftElement pointerEvents='none'>
            <SearchIcon color='gray.300' />
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
        <IconButton aria-label='Filters' icon={<SettingsIcon />} onClick={onOpen} />
      </HStack>

      <FilterMenu isOpen={isOpen} onClose={onClose} />
    </Box>
  )
}
