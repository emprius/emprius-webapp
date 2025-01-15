import React from 'react'
import { Badge, Box, Container, Grid, GridItem, Heading, Link, Stack, Text, useColorModeValue } from '@chakra-ui/react'
import { ServerImage } from '../../../components/shared/ServerImage'
import { Link as RouterLink, useParams } from 'react-router-dom'
import { ROUTES } from '~src/router'
import { useTranslation } from 'react-i18next'
import { FiMapPin, FiStar } from 'react-icons/fi'
import { useToolRatings } from '../../../hooks/queries'
import { BookingForm } from '../components/BookingForm'
import { LoadingSpinner } from '../../../components/shared/LoadingSpinner'
import { RatingList } from '../../../features/rating/components/RatingList'
import { useAuth } from '../../../features/auth/context/AuthContext'
import { ToolAvailabilityCalendar } from '../components/ToolAvailabilityCalendar'
import { useTool } from '~src/features/tools/toolsQueries'

export const ToolDetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const { t } = useTranslation()
  const { isAuthenticated } = useAuth()
  const { data: tool, isLoading: isToolLoading } = useTool(id!)
  const { data: ratings, isLoading: isRatingsLoading } = useToolRatings(id!)

  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')

  if (isToolLoading) {
    return <LoadingSpinner />
  }

  if (!tool) {
    return null
  }

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

                  <Text color='primary.500' fontSize='2xl' fontWeight='bold'>
                    {tool.cost}€/day
                  </Text>

                  <Text color='gray.600'>{tool.description}</Text>

                  <Stack direction='row' spacing={2}>
                    {tool.mayBeFree && <Badge colorScheme='blue'>{t('tools.mayBeFree')}</Badge>}
                    {tool.askWithFee && <Badge colorScheme='purple'>{t('tools.askWithFee')}</Badge>}
                  </Stack>

                  <Stack spacing={4}>
                    <Stack direction='row' align='center' color='gray.600'>
                      <FiMapPin />
                      <Text>
                        {t('tools.coordinates', {
                          lat: String(tool.location.latitude),
                          lng: String(tool.location.longitude),
                        })}
                      </Text>
                    </Stack>

                    <Stack direction='row' align='center' color='orange.400'>
                      <FiStar />
                      <Text>{tool.rating.toFixed(1)}</Text>
                    </Stack>

                    <Stack spacing={2}>
                      <Text color='gray.600'>
                        {t('tools.estimatedValue')}: {tool.estimatedValue}€
                      </Text>
                      <Text color='gray.600'>
                        {t('tools.dimensions')}: {tool.height}cm x {tool.weight}kg
                      </Text>
                    </Stack>
                  </Stack>
                </Stack>
              </Stack>
            </Box>

            {tool.images.length > 0 && (
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

            <Box bg={bgColor} borderWidth={1} borderColor={borderColor} borderRadius='lg' overflow='hidden'>
              <Stack p={6} spacing={4}>
                <Heading size='md'>{t('rating.reviews')}</Heading>
                {isRatingsLoading ? <LoadingSpinner /> : <RatingList ratings={ratings || []} />}
              </Stack>
            </Box>
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
