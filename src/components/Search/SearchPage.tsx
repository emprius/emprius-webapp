import { Box, Button, Divider, Flex, HStack, Text, useColorModeValue, useDisclosure } from '@chakra-ui/react'
import React, { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { FiMap } from 'react-icons/fi'
import { useAuth } from '~components/Auth/AuthContext'
import { SearchFilters, useSearch } from '~components/Providers/SearchContext'
import { FiltersDrawer, FiltersForm } from '~components/Search/Filter'
import { SearchList } from '~components/Search/SearchList'
import { Map } from './Map'

export const MAX_COST_MAX = 1000
export const MAX_COST_DEFAULT = MAX_COST_MAX
export const DISTANCE_MAX = 250
export const DISTANCE_DEFAULT = 50

const defaultValues: Partial<SearchFilters> = {
  categories: undefined,
  transportOptions: undefined,
  distance: DISTANCE_DEFAULT,
  maxCost: MAX_COST_DEFAULT,
  mayBeFree: false,
}

export const SearchPage = () => {
  const { t } = useTranslation()
  const { user } = useAuth()
  const bgColor = useColorModeValue('gray.50', 'gray.900')
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [isMapView, setIsMapView] = useState(false)

  const { filters, setFilters, result, isPending, error, isError } = useSearch()

  const methods = useForm<SearchFilters>({
    defaultValues: { ...defaultValues, ...filters },
  })

  const onSubmit = (data: SearchFilters) => {
    setFilters({ ...filters, ...data })
  }

  const toggleView = () => setIsMapView(!isMapView)
  const tools = result?.tools || []
  const mapCenter = user?.location

  return (
    <FormProvider {...methods}>
      <Box h='100vh'>
        <Box h='100vh' bg={bgColor} position='relative'>
          <Flex gap={2} h='100vh' bg='white'>
            <Box display={{ base: 'none', lg: 'block' }} w='300px' px={4} pt={5}>
              <Text fontSize='xl' fontWeight='bold' mb={4}>
                {t('search.filters', { defaultValue: 'Filters' })}
              </Text>
              <FiltersForm />
              <Button colorScheme='blue' size='lg' onClick={() => methods.handleSubmit(onSubmit)()} mt={4} w='full'>
                {t('search.apply_filters')}
              </Button>
            </Box>
            <Box display={{ base: 'block', lg: 'none' }} position='fixed' bottom={4} right={4} zIndex={2}>
              <HStack spacing={2}>
                <Button colorScheme='blue' onClick={onOpen}>
                  {t('search.filters')}
                </Button>
                <Button
                  colorScheme='blue'
                  onClick={toggleView}
                  variant={isMapView ? 'solid' : 'outline'}
                  leftIcon={<FiMap />}
                >
                  {isMapView ? t('search.list_view') : t('search.map_view')}
                </Button>
              </HStack>
            </Box>
            {isMapView && (
              <Box position='relative' top={0} left={0} right={0} h='100%' w={'full'} zIndex={1} flex={1}>
                <Map tools={tools} center={mapCenter} />
              </Box>
            )}
            {!isMapView && (
              <>
                <Divider
                  display={{ base: 'none', lg: 'block' }}
                  orientation='vertical'
                  borderLeftWidth='2px'
                  h='auto'
                  alignSelf='stretch'
                  borderColor='gray.200'
                />
                <Box flex={1} px={4} py={4} overflowY='auto'>
                  <HStack spacing={4} mb={4} display={{ base: 'none', lg: 'flex' }} justifyContent='flex-end'>
                    <Button
                      colorScheme='blue'
                      onClick={toggleView}
                      variant={isMapView ? 'solid' : 'outline'}
                      leftIcon={<FiMap />}
                    >
                      {isMapView ? t('search.list_view') : t('search.map_view')}
                    </Button>
                  </HStack>
                  <SearchList tools={tools} isLoading={isPending} error={error} isError={isError} />
                </Box>
              </>
            )}
          </Flex>
        </Box>
        <FiltersDrawer
          isOpen={isOpen}
          onClose={() => {
            onClose()
            methods.handleSubmit(onSubmit)()
          }}
        />
      </Box>
    </FormProvider>
  )
}
