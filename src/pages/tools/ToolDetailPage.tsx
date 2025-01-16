import { Badge, Box, Container, Grid, GridItem, Heading, Link, Stack, Text, useColorModeValue } from '@chakra-ui/react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { FiStar } from 'react-icons/fi'
import { Link as RouterLink, useParams } from 'react-router-dom'
import { useAuth } from '~components/Auth/AuthContext'
import { BookingForm } from '~components/Bookings/BookingForm'
import { ServerImage } from '~components/Images/ServerImage'
import { LoadingSpinner } from '~components/Layout/LoadingSpinner'
import { OwnerToolButtons } from '~components/Tools/shared/OwnerToolButtons'
import { ToolAvailabilityCalendar } from '~components/Tools/ToolAvailabilityCalendar'
import { useTool } from '~components/Tools/toolsQueries'
import { ROUTES } from '~src/router/router'

export const ToolDetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const { t } = useTranslation()
  const { isAuthenticated, user } = useAuth()
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

                  <Text color='primary.500' fontSize='2xl' fontWeight='bold'>
                    {tool.cost}€/day
                  </Text>

                  <Text color='gray.600'>{tool.description}</Text>

                  <Stack direction='row' spacing={2}>
                    {tool.mayBeFree && <Badge colorScheme='blue'>{t('tools.mayBeFree')}</Badge>}
                    {tool.askWithFee && <Badge colorScheme='purple'>{t('tools.askWithFee')}</Badge>}
                  </Stack>

                  <Stack spacing={4}>
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
              <OwnerToolButtons tool={tool} />
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
