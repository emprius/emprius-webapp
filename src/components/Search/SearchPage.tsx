import {
  Box,
  Button,
  ButtonProps,
  Flex,
  HStack,
  Stack,
  Text,
  useBreakpointValue,
  useColorModeValue,
  useDisclosure,
  VStack,
} from '@chakra-ui/react'
import React, { useCallback, useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { FaFilter } from 'react-icons/fa'
import { FaRegRectangleList } from 'react-icons/fa6'
import { FiMap } from 'react-icons/fi'
import { useAuth } from '~components/Auth/AuthContext'
import { FiltersDrawer, FiltersForm } from '~components/Search/Filter'
import { defaultFilterValues, SearchFilters, useSearch } from '~components/Search/SearchContext'
import { ToolList } from '~components/Tools/List'
import { Map } from './Map'
import { useNavigate } from 'react-router-dom'
import { PaginationProvider, usePagination } from '~components/Layout/Pagination/PaginationProvider'
import { Pagination } from '~components/Layout/Pagination/Pagination'

export const SearchPage = () => (
  <PaginationProvider>
    <SearchPagePaginated />
  </PaginationProvider>
)

const SearchPagePaginated = () => {
  const { user } = useAuth()
  const { isOpen: isOpenDrawer, onOpen: onOpenDrawer, onClose: onCloseDrawer } = useDisclosure()
  const { isOpen: isOpenSideNav, onToggle: onToggleSideNav } = useDisclosure({ defaultIsOpen: false })
  const [isMapView, setIsMapView] = useState(false)
  const isMobile = useBreakpointValue({ base: true, lg: false })
  const { page } = usePagination()
  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')

  const { filters, setFilters, result, isPending, error, isError } = useSearch()

  const methods = useForm<SearchFilters>({
    defaultValues: { ...defaultFilterValues, ...filters },
  })

  const onSubmit = (data: SearchFilters) => {
    setFilters({ ...filters, ...data })
  }

  const openFilters = useCallback(() => {
    if (isMobile) {
      onOpenDrawer()
    } else {
      onToggleSideNav()
    }
  }, [isMobile, isOpenSideNav])

  // Do a search on load
  useEffect(() => {
    if (!result) {
      setFilters({ ...filters })
    }
  }, [])

  // Add page into filters when change
  useEffect(() => {
    setFilters({ ...filters, page })
  }, [page])

  const toggleView = () => setIsMapView(!isMapView)
  const tools = result?.tools || []
  const mapCenter = user?.location

  return (
    <FormProvider {...methods}>
      <Box h='100vh'>
        <Box h='100vh' position='relative'>
          <Flex h='100vh'>
            <SideNav isMapView={isMapView} isOpen={isOpenSideNav} methods={methods} onSubmit={onSubmit} />
            {/*Floating buttons to open filters and switch view*/}
            <Box position='absolute' top={2} right={4} zIndex={2}>
              <HStack spacing={2}>
                <ToggleFiltersButton onClick={openFilters} zIndex={999} borderRadius={'sm'} size={'sm'} />
                <ToggleMapButton
                  isMapView={isMapView}
                  onClick={toggleView}
                  zIndex={999}
                  borderRadius={'sm'}
                  size={'sm'}
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
              <Box flex={1} px={4} pb={8} pt={{ base: 14, lg: 12 }} overflowY='auto'>
                <ToolList tools={tools} isLoading={isPending} error={error} isError={isError} />
                <HStack w={'full'} justifyContent={'center'} mt={4}>
                  <VStack
                    bg={bgColor}
                    minW={124}
                    w={'min-content'}
                    p={4}
                    borderWidth={1}
                    borderColor={borderColor}
                    borderRadius='lg'
                  >
                    <Pagination pagination={result?.pagination} />
                  </VStack>
                </HStack>
              </Box>
            )}
          </Flex>
        </Box>
        <FiltersDrawer isOpen={isOpenDrawer} onClose={onCloseDrawer} />
      </Box>
    </FormProvider>
  )
}

type ToggleButtonProps = Omit<ButtonProps, 'aria-label' | 'icon'>
const ToggleMapButton = ({ isMapView, ...rest }: { isMapView: boolean } & ToggleButtonProps) => {
  const { t } = useTranslation()
  let text = t('search.switch_to_map_view', { defaultValue: 'Switch map' })
  if (isMapView) {
    text = t('search.switch_to_list_view', { defaultValue: 'Switch list' })
  }
  return (
    <Button aria-label={text} leftIcon={isMapView ? <FaRegRectangleList /> : <FiMap />} variant={'solid'} {...rest}>
      {text}
    </Button>
  )
}

const ToggleFiltersButton = (props: ToggleButtonProps) => {
  const { t } = useTranslation()
  return (
    <Button aria-label='Filters' leftIcon={<FaFilter />} {...props}>
      {t('search.filters')}
    </Button>
  )
}

interface SideNavProps {
  isMapView: boolean
  isOpen: boolean
  methods: any
  onSubmit: (data: SearchFilters) => void
}

const SideNav: React.FC<SideNavProps> = ({ isMapView, isOpen, methods, onSubmit }) => {
  const { t } = useTranslation()
  const isMobile = useBreakpointValue({ base: true, lg: false })
  const borderColor = useColorModeValue('gray.200', 'gray.700')
  const bgColor = useColorModeValue('white', 'gray.800')

  if (isMobile) return null

  return (
    <Stack position={'relative'} mr={!isMapView ? 3 : 0}>
      <Stack
        w={isOpen ? '250px' : 0}
        px={isOpen ? 4 : 0}
        pt={isOpen ? 5 : 0}
        h='100vh'
        bg={bgColor}
        transform={isOpen ? 'translateX(0)' : 'translateX(-100%)'}
        transition='transform 0.3s ease'
        zIndex={3}
        borderRight='1px'
        borderColor={borderColor}
      >
        <Stack display={isOpen ? 'flex' : 'none'}>
          <Text fontSize='xl' fontWeight='bold' mb={4}>
            {t('search.filters', { defaultValue: 'Filters' })}
          </Text>
          <FiltersForm />
          <Button size='lg' onClick={() => methods.handleSubmit(onSubmit)()} mt={4} w='full'>
            {t('search.apply_filters')}
          </Button>
        </Stack>
      </Stack>
    </Stack>
  )
}
