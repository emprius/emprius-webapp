import React from 'react'
import { Box, Divider, Flex, Text, useColorModeValue } from '@chakra-ui/react'
import { FormProvider, useForm } from 'react-hook-form'
import { SearchBar } from './SearchBar'
import { SearchFilters, useSearchTools } from './queries'
import { useAuth } from '~components/Auth/AuthContext'
import { Map } from './Map'
import { FiltersForm } from '~components/Search/Filter'
import { useTranslation } from 'react-i18next'
import { SearchList } from '~components/Search/SearchList'

export const MAX_COST_MAX = 1000
export const MAX_COST_DEFAULT = MAX_COST_MAX
export const DISTANCE_MAX = 250
export const DISTANCE_DEFAULT = 50

const defaultValues: Partial<SearchFilters> = {
  term: '',
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
  const [isMapView, setIsMapView] = React.useState(false)
  const methods = useForm<SearchFilters>({
    defaultValues,
  })
  const searchTools = useSearchTools()

  const onSubmit = (data: SearchFilters) => {
    if (!data.term) {
      delete data.term
    }
    searchTools.mutate({
      mayBeFree: data.mayBeFree,
      maxCost: data.maxCost,
      term: data.term,
      distance: data.distance * 1000, // Convert to meters
      categories: data.categories,
      transportOptions: data.transportOptions,
    })
  }

  const toggleView = () => setIsMapView(!isMapView)
  const tools = searchTools.data?.tools || []
  const mapCenter = user?.location

  return (
    <FormProvider {...methods}>
      <Box position='relative' h='100vh'>
        <Box position='absolute' top={0} left={0} right={0} zIndex={2}>
          <form onSubmit={methods.handleSubmit(onSubmit)}>
            <SearchBar onToggleView={toggleView} isMapView={isMapView} />
          </form>
        </Box>
        <Box h='100vh' bg={bgColor} position='relative'>
          <Flex gap={2} h='100vh' bg='white'>
            <Box display={{ base: 'none', lg: 'block' }} w='300px' px={4} pt={5}>
              <Text fontSize='xl' fontWeight='bold' mb={4}>
                {t('search.filters', { defaultValue: 'Filters' })}
              </Text>
              <FiltersForm />
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
                <Box flex={1} pt={20} px={4}>
                  <SearchList tools={tools} />
                </Box>
              </>
            )}
          </Flex>
        </Box>
      </Box>
    </FormProvider>
  )
}
