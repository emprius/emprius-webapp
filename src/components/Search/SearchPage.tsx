import {
  Box,
  Button,
  Flex,
  HStack,
  IconButton,
  IconButtonProps,
  Stack,
  Text,
  useBreakpointValue,
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
import { defaultFilterValues, SearchFilters, useSearch } from '~components/Search/SearchContext'
import { ToolList } from '~components/Tools/List'
import { Map } from './Map'

export const SearchPage = () => {
  const { user } = useAuth()
  const bgColor = useColorModeValue('gray.50', 'gray.900')
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [isMapView, setIsMapView] = useState(false)

  const { filters, setFilters, result, isPending, error, isError } = useSearch()

  const methods = useForm<SearchFilters>({
    defaultValues: { ...defaultFilterValues, ...filters },
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
        <Box h='100vh' position='relative'>
          <Flex h='100vh'>
            <SideNav isMapView={isMapView} toggleView={toggleView} methods={methods} onSubmit={onSubmit} />
            {/*Floating buttons to open filters and switch view*/}
            <Box position='fixed' top={20} right={4} zIndex={2} display={{ base: 'flex', lg: 'none' }}>
              <HStack spacing={2}>
                <ToggleFiltersButton onClick={onOpen} />
                <ToggleMapButton isMapView={isMapView} onClick={toggleView} />
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
              <Box flex={1} px={4} pb={8} pt={{ base: 14, lg: 8 }} overflowY='auto'>
                <ToolList tools={tools} isLoading={isPending} error={error} isError={isError} />
              </Box>
            )}
          </Flex>
        </Box>
        <FiltersDrawer isOpen={isOpen} onClose={onClose} />
      </Box>
    </FormProvider>
  )
}

type ToggleButtonProps = Omit<IconButtonProps, 'aria-label' | 'icon'>
const ToggleMapButton = ({ isMapView, ...rest }: { isMapView: boolean } & ToggleButtonProps) => (
  <IconButton
    aria-label={isMapView ? 'Switch to list view' : 'Switch to map view'}
    icon={isMapView ? <FaRegRectangleList /> : <FiMap />}
    variant={'solid'}
    {...rest}
  />
)

const ToggleFiltersButton = (props: ToggleButtonProps) => (
  <IconButton aria-label='Filters' icon={<FaFilter />} {...props} />
)

interface SideNavProps {
  isMapView: boolean
  toggleView: () => void
  methods: any
  onSubmit: (data: SearchFilters) => void
}

const SideNav: React.FC<SideNavProps> = ({ isMapView, toggleView, methods, onSubmit }) => {
  const { t } = useTranslation()
  const { isOpen, onToggle } = useDisclosure({ defaultIsOpen: false })
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
      <ToggleFiltersButton
        position='absolute'
        right='-14px'
        top='5'
        onClick={onToggle}
        zIndex={999}
        borderRadius={'sm'}
        size={'sm'}
      />
      <ToggleMapButton
        position='absolute'
        right='-14px'
        top={16}
        onClick={toggleView}
        isMapView={isMapView}
        zIndex={999}
        borderRadius={'sm'}
        size={'sm'}
      />
    </Stack>
  )
}
