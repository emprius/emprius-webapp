import {
  Box,
  Button,
  Divider,
  Flex,
  HStack,
  IconButton,
  Stack,
  Text,
  useColorModeValue,
  useDisclosure,
} from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { FaFilter } from 'react-icons/fa'
import { FaRegRectangleList } from 'react-icons/fa6'
import { FiMap } from 'react-icons/fi'
import { useAuth } from '~components/Auth/AuthContext'
import { FiltersDrawer, FiltersForm } from '~components/Search/Filter'
import { SearchFilters, useSearch } from '~components/Search/SearchContext'
import { ToolList } from '~components/Tools/List'
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

  // Do a search on load
  useEffect(() => {
    if (!result) {
      setFilters({ ...filters })
    }
  }, [])

  const toggleView = () => setIsMapView(!isMapView)
  const tools = result?.tools || []
  const mapCenter = user?.location

  return (
    <FormProvider {...methods}>
      <Box h='100vh'>
        <Box h='100vh' bg={bgColor} position='relative'>
          <Flex gap={2} h='100vh' bg='white'>
            {/*Filters side nav*/}
            <Stack display={{ base: 'none', lg: 'block' }} w='300px' px={4} pt={5}>
              <Button
                aria-label={isMapView ? 'Switch to list view' : 'Switch to map view'}
                rightIcon={<FiMap />}
                onClick={toggleView}
                variant={'outline'}
                mb={4}
              >
                {isMapView
                  ? t('search.switch_to_list_view', { defaultValue: 'Switch to list view' })
                  : t('search.switch_to_map_view', { defaultValue: 'Switch to map view' })}
              </Button>
              <Text fontSize='xl' fontWeight='bold' mb={4}>
                {t('search.filters', { defaultValue: 'Filters' })}
              </Text>
              <FiltersForm />
              <Button size='lg' onClick={() => methods.handleSubmit(onSubmit)()} mt={4} w='full'>
                {t('search.apply_filters')}
              </Button>
            </Stack>
            {/*Floating buttons to open filters and switch view*/}
            <Box position='fixed' top={20} right={4} zIndex={2} display={{ base: 'flex', lg: 'none' }}>
              <HStack spacing={2}>
                <IconButton aria-label='Filters' icon={<FaFilter />} onClick={onOpen} />
                <IconButton
                  aria-label={isMapView ? 'Switch to list view' : 'Switch to map view'}
                  icon={isMapView ? <FaRegRectangleList /> : <FiMap />}
                  onClick={toggleView}
                  variant={'solid'}
                />
              </HStack>
            </Box>
            {/*Map View*/}
            {isMapView && (
              <Box position='relative' top={0} left={0} right={0} h='100%' w={'full'} zIndex={1} flex={1}>
                <Map tools={tools} center={mapCenter} />
              </Box>
            )}
            {/*List View*/}
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
                <Box flex={1} px={4} py={8} overflowY='auto'>
                  <ToolList tools={tools} isLoading={isPending} error={error} isError={isError} />
                </Box>
              </>
            )}
          </Flex>
        </Box>
        <FiltersDrawer isOpen={isOpen} onClose={onClose} />
      </Box>
    </FormProvider>
  )
}
