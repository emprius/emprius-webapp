import {
  Badge,
  Box,
  Container,
  Divider,
  Grid,
  GridItem,
  Link,
  SimpleGrid,
  Stack,
  Text,
  useColorModeValue,
} from '@chakra-ui/react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { FiBox, FiDollarSign, FiTag } from 'react-icons/fi'
import { LuWeight } from 'react-icons/lu'
import { Link as RouterLink } from 'react-router-dom'
import { useAuth } from '~components/Auth/AuthContext'
import { BookingForm } from '~components/Bookings/Form'
import { useInfoContext } from '~components/InfoProviders/InfoContext'
import { ImageCarousel } from '~components/Layout/ImageCarousel'
import { MapMarker } from '~components/Layout/MapMarker'
import { AvailabilityCalendar } from '~components/Tools/AvailabilityCalendar'
import { AvailabilityToggle, EditToolButton } from '~components/Tools/shared/OwnerToolButtons'
import { ToolBadges } from '~components/Tools/shared/ToolBadges'
import { Tool } from '~components/Tools/types'
import { UserCard } from '~components/Users/Card'
import { ROUTES } from '~src/router/routes'
import { lightText } from '~theme/common'

export const ToolDetail = ({ tool }: { tool: Tool }) => {
  const { t } = useTranslation()
  const { categories, transports } = useInfoContext()
  const borderColor = useColorModeValue('gray.200', 'gray.700')
  const bgColor = useColorModeValue('white', 'gray.800')
  const { isAuthenticated, user } = useAuth()

  return (
    <Container maxW='container.xl' py={8}>
      <Grid templateColumns={{ base: '1fr', lg: '2fr 1fr' }} gap={8}>
        <GridItem>
          <Stack spacing={8}>
            <Box bg={bgColor} borderWidth={1} borderColor={borderColor} borderRadius='lg' overflow='hidden'>
              {tool?.images?.length > 0 && <ImageCarousel imageIds={tool.images} height='400px' width='100%' />}

              <Stack p={6} spacing={6}>
                <Stack spacing={4}>
                  <Stack spacing={1}>
                    <Stack direction='row' align='center' justify='space-between'>
                      <Text fontSize='3xl' fontWeight='bold' color={'primary.500'}>
                        {tool.title}
                      </Text>
                      <Badge colorScheme={tool.isAvailable ? 'green' : 'gray'} px={2} py={1} borderRadius='full'>
                        {t(`tools.${tool.isAvailable ? 'available' : 'unavailable'}`)}
                      </Badge>
                    </Stack>
                    <Text sx={lightText} fontSize='2xl' fontWeight='bold'>
                      {t('tools.cost_unit', { cost: tool.cost })}
                    </Text>
                  </Stack>
                  {tool?.description && <Text sx={lightText}>{tool.description}</Text>}
                  <ToolBadges tool={tool} />
                  <Divider />
                  <SimpleGrid spacing={4} columns={{ base: 2 }}>
                    {!!tool.toolCategory && (
                      <Stack direction='row' align='center'>
                        <FiTag size={20} />
                        <Text>{categories.find((c) => c.id === tool.toolCategory)?.name}</Text>
                      </Stack>
                    )}
                    {!!tool.estimatedValue && (
                      <Stack direction='row' align='center'>
                        <FiDollarSign size={20} />
                        <Text>
                          {t('tools.estimated_value')}: {tool.estimatedValue}
                        </Text>
                      </Stack>
                    )}

                    {!!tool.height && (
                      <Stack direction='row' align='center'>
                        <FiBox size={20} />
                        <Text>{tool.height && `${tool.height}cm`}</Text>
                      </Stack>
                    )}
                    {!!tool.weight && (
                      <Stack direction='row' align='center'>
                        <LuWeight size={20} />
                        <Text>{tool.weight && `${tool.weight}kg`}</Text>
                      </Stack>
                    )}
                  </SimpleGrid>
                  <UserCard userId={tool.userId} />
                  {tool.location && (
                    <Box mt={4} height='200px' borderRadius='lg' overflow='hidden'>
                      <MapMarker {...tool.location} />
                    </Box>
                  )}
                </Stack>
              </Stack>
            </Box>
          </Stack>
        </GridItem>

        <GridItem>
          <Stack spacing={4} position='sticky' top='20px'>
            {user?.id === tool.userId && (
              <Box bg={bgColor} p={6} borderRadius='lg' boxShadow='sm' textAlign='center'>
                <SimpleGrid columns={2} spacing={4}>
                  <Box textAlign='center'>
                    <Text fontSize='sm' color='gray.600' mb={1}>
                      {t('tools.edit')}
                    </Text>
                    <EditToolButton toolId={tool.id} />
                  </Box>
                  <Box textAlign='center'>
                    <Text fontSize='sm' color='gray.600' mb={2}>
                      {t('tools.toggle_availability', { defaultValue: 'Toggle availability' })}
                    </Text>
                    <AvailabilityToggle tool={tool} />
                  </Box>
                </SimpleGrid>
              </Box>
            )}
            <AvailabilityCalendar reservedDates={tool.reservedDates || []} />
            <BookingFormWrapper tool={tool} />
          </Stack>
        </GridItem>
      </Grid>
    </Container>
  )
}

const BookingFormWrapper = ({ tool }: { tool: Tool }) => {
  const { t } = useTranslation()
  const bgColor = useColorModeValue('white', 'gray.800')
  const { isAuthenticated, user } = useAuth()
  if (!isAuthenticated) {
    return (
      <Box bg={bgColor} p={6} borderRadius='lg' boxShadow='sm' textAlign='center'>
        <Text color='gray.600' mb={4}>
          {t('tools.login_to_book')}
        </Text>
        <Link as={RouterLink} to={ROUTES.AUTH.LOGIN} color='primary.500' fontWeight='medium'>
          {t('nav.login')}
        </Link>
      </Box>
    )
  }

  if (!tool.isAvailable) {
    return (
      <Box bg={bgColor} p={6} borderRadius='lg' boxShadow='sm' textAlign='center'>
        <Text color='gray.600' mb={4}>
          {t('tools.not_available')}
        </Text>
        <Link as={RouterLink} to={ROUTES.SEARCH} color='primary.500' fontWeight='medium'>
          {t('tools.find_other')}
        </Link>
      </Box>
    )
  }

  if (user?.id === tool.userId) {
    return null
  }
  return <BookingForm tool={tool} />
}
