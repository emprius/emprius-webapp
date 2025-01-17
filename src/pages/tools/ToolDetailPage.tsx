import {
  Badge,
  Box,
  Container,
  Divider,
  Grid,
  GridItem,
  Heading,
  Link,
  Stack,
  Text,
  useColorModeValue,
} from '@chakra-ui/react'
import 'leaflet/dist/leaflet.css'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { FiBox, FiDollarSign, FiTag } from 'react-icons/fi'
import { Link as RouterLink, useParams } from 'react-router-dom'
import { UserMiniCard } from '~components/User/UserMiniCard'
import { useAuth } from '~components/Auth/AuthContext'
import { useInfoContext } from '~components/Auth/InfoContext'
import { BookingForm } from '~components/Bookings/BookingForm'
import { ServerImage } from '~components/Images/ServerImage'
import { LoadingSpinner } from '~components/Layout/LoadingSpinner'
import { OwnerToolButtons } from '~components/Tools/shared/OwnerToolButtons'
import { ToolAvailabilityCalendar } from '~components/Tools/ToolAvailabilityCalendar'
import { useTool } from '~components/Tools/toolsQueries'
import { ROUTES } from '~src/router/router'
import { MapMarker } from '~components/Layout/Map'
import { DisplayRating } from '~src/pages/ratings/DisplayRating'

export const ToolDetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const { t } = useTranslation()
  const { isAuthenticated, user } = useAuth()
  const { categories } = useInfoContext()
  const { data: tool, isLoading: isToolLoading } = useTool(id!)

  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')

  if (isToolLoading) {
    return <LoadingSpinner />
  }

  if (!tool) {
    return null
  }

  const isOwner = user?.email === tool.userId

  return (
    <Container maxW='container.xl' py={8}>
      <Grid templateColumns={{ base: '1fr', lg: '2fr 1fr' }} gap={8}>
        <GridItem>
          <Stack spacing={8}>
            <Box bg={bgColor} borderWidth={1} borderColor={borderColor} borderRadius='lg' overflow='hidden'>
              {tool.images.length > 0 && (
                <ServerImage
                  imageId={tool.images[0].hash}
                  alt={tool.title}
                  height='400px'
                  width='100%'
                  objectFit='cover'
                />
              )}

              <Stack p={6} spacing={6}>
                <Stack spacing={4}>
                  <Stack direction='row' align='center' justify='space-between'>
                    <Heading size='lg'>{tool.title}</Heading>
                    <Badge colorScheme={tool.isAvailable ? 'green' : 'gray'} px={2} py={1} borderRadius='full'>
                      {t(`tools.status.${tool.isAvailable ? 'available' : 'unavailable'}`)}
                    </Badge>
                  </Stack>
                  {/*<UserMiniCard userId={tool.userId} />*/}
                  <UserMiniCard userId={'677d04bfb848190b34321fff'} />
                  <Stack direction='row' align='center' spacing={2}>
                    <FiDollarSign size={20} color='green' />
                    <Text color='primary.500' fontSize='2xl' fontWeight='bold'>
                      {tool.cost}€/day
                    </Text>
                  </Stack>
                  <Text color='gray.600'>{tool.description}</Text>
                  <Stack direction='row' spacing={2}>
                    {tool.mayBeFree && <Badge colorScheme='blue'>{t('tools.mayBeFree')}</Badge>}
                    {tool.askWithFee && <Badge colorScheme='purple'>{t('tools.askWithFee')}</Badge>}
                  </Stack>
                  <Divider />
                  <Stack spacing={4}>
                    <Stack direction='row' align='center' spacing={4}>
                      <DisplayRating rating={tool.rating} size='md' />

                      {tool.estimatedValue && (
                        <Stack direction='row' align='center'>
                          <FiDollarSign size={20} />
                          <Text>
                            {t('tools.estimatedValue')}: {tool.estimatedValue}
                          </Text>
                        </Stack>
                      )}
                    </Stack>

                    {(tool.height || tool.weight) && (
                      <Stack direction='row' align='center'>
                        <FiBox size={20} />
                        <Text>
                          {tool.height && `${tool.height}cm`}
                          {tool.height && tool.weight && ' x '}
                          {tool.weight && `${tool.weight}kg`}
                        </Text>
                      </Stack>
                    )}

                    {tool.category && (
                      <Stack direction='row' align='center'>
                        <FiTag size={20} />
                        <Text>{categories.find((c) => c.id === tool.category)?.name}</Text>
                      </Stack>
                    )}
                  </Stack>
                  F
                  {tool.location && (
                    <Box mt={4} height='200px' borderRadius='lg' overflow='hidden'>
                      <MapMarker {...tool.location} />
                    </Box>
                  )}
                </Stack>
              </Stack>
              <OwnerToolButtons tool={tool} />
            </Box>

            {tool.images.length > 1 && (
              <Box bg={bgColor} borderWidth={1} borderColor={borderColor} borderRadius='lg' overflow='hidden'>
                <Stack p={6} spacing={4}>
                  <Heading size='md'>{t('tools.images')}</Heading>
                  <Grid templateColumns='repeat(auto-fill, minmax(200px, 1fr))' gap={4}>
                    {tool.images.map((image, index) => (
                      <ServerImage
                        key={image.hash}
                        imageId={image.hash}
                        alt={`${tool.title} - ${image.name}`}
                        height='200px'
                        width='100%'
                        objectFit='cover'
                        borderRadius='md'
                      />
                    ))}
                  </Grid>
                </Stack>
              </Box>
            )}
          </Stack>
        </GridItem>

        <GridItem>
          <Stack spacing={4} position='sticky' top='20px'>
            <ToolAvailabilityCalendar reservedDates={tool.reservedDates || []} />
            {isAuthenticated ? (
              tool.isAvailable ? (
                <BookingForm tool={tool} />
              ) : (
                <Box bg={bgColor} p={6} borderRadius='lg' boxShadow='sm' textAlign='center'>
                  <Text color='gray.600' mb={4}>
                    {t('tools.notAvailable')}
                  </Text>
                  <Link as={RouterLink} to={ROUTES.TOOLS.LIST} color='primary.500' fontWeight='medium'>
                    {t('tools.findOther')}
                  </Link>
                </Box>
              )
            ) : (
              <Box bg={bgColor} p={6} borderRadius='lg' boxShadow='sm' textAlign='center'>
                <Text color='gray.600' mb={4}>
                  {t('tools.loginToBook')}
                </Text>
                <Link as={RouterLink} to={ROUTES.AUTH.LOGIN} color='primary.500' fontWeight='medium'>
                  {t('nav.login')}
                </Link>
              </Box>
            )}
          </Stack>
        </GridItem>
      </Grid>
    </Container>
  )
}
