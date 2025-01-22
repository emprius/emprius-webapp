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
  Tag,
  TagLabel,
  TagLeftIcon,
  Text,
  useColorModeValue,
} from '@chakra-ui/react'
import 'leaflet/dist/leaflet.css'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { FiBox, FiDollarSign, FiTag } from 'react-icons/fi'
import { Link as RouterLink, useParams } from 'react-router-dom'
import { useAuth } from '~components/Auth/AuthContext'
import { useInfoContext } from '~components/Auth/InfoContext'
import { BookingForm } from '~components/Bookings/BookingForm'
import { ImageCarousel } from '~components/Layout/ImageCarousel'
import { LoadingSpinner } from '~components/Layout/LoadingSpinner'
import { OwnerToolButtons } from '~components/Tools/shared/OwnerToolButtons'
import { ToolAvailabilityCalendar } from '~components/Tools/ToolAvailabilityCalendar'
import { useTool } from '~components/Tools/toolsQueries'
import { ROUTES } from '~src/router/router'
import { MapMarker } from '~components/Layout/Map'
import { UserMiniCard } from '~components/User/UserMiniCard'
import { LuWeight } from 'react-icons/lu'
import { HiOutlineTruck } from 'react-icons/hi2'
import { MdDoneOutline } from 'react-icons/md'
import { ToolBadges } from '~components/Tools/shared/ToolBadges'

export const ToolDetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const { t } = useTranslation()
  const { isAuthenticated, user } = useAuth()
  const { categories, transports } = useInfoContext()
  const { data: tool, isLoading: isToolLoading } = useTool(id!)

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
                <ImageCarousel imageIds={tool.images.map((img) => img.hash)} height='400px' width='100%' />
              )}

              <Stack p={6} spacing={6}>
                <Stack spacing={4}>
                  <Stack spacing={1}>
                    <Stack direction='row' align='center' justify='space-between'>
                      <Text color='gray.600' fontSize='2xl' fontWeight='bold'>
                        {t('tools.costUnit', { cost: tool.cost })}
                      </Text>
                      <Badge colorScheme={tool.isAvailable ? 'green' : 'gray'} px={2} py={1} borderRadius='full'>
                        {t(`tools.status.${tool.isAvailable ? 'available' : 'unavailable'}`)}
                      </Badge>
                    </Stack>
                  </Stack>
                  <Text color='gray.600'>{tool.description}</Text>
                  <ToolBadges tool={tool} />
                  <Divider />
                  <SimpleGrid spacing={4} columns={{ base: 2 }}>
                    <Stack direction='row' align='center' spacing={4}>
                      {tool.estimatedValue && (
                        <Stack direction='row' align='center'>
                          <FiDollarSign size={20} />
                          <Text>
                            {t('tools.estimatedValue')}: {tool.estimatedValue}
                          </Text>
                        </Stack>
                      )}
                    </Stack>

                    {tool.height && (
                      <Stack direction='row' align='center'>
                        <FiBox size={20} />
                        <Text>{tool.height && `${tool.height}cm`}</Text>
                      </Stack>
                    )}
                    {tool.weight && (
                      <Stack direction='row' align='center'>
                        <LuWeight size={20} />
                        <Text>{tool.weight && `${tool.weight}kg`}</Text>
                      </Stack>
                    )}
                    {tool.toolCategory && (
                      <Stack direction='row' align='center'>
                        <FiTag size={20} />
                        <Text>{categories.find((c) => c.id === tool.toolCategory)?.name}</Text>
                      </Stack>
                    )}
                  </SimpleGrid>
                  {tool.transportOptions.length > 0 && (
                    <Stack direction='row' align='center'>
                      <HiOutlineTruck size={20} />
                      <Text>{t('tools.transportOptions')}:</Text>
                      {
                        // todo(konv1): check with https://github.com/emprius/emprius-app-backend/issues/10#issuecomment-2602741976
                        tool.transportOptions
                          .map((transport) => transports.find((t) => t.id === transport.id)?.name)
                          .map((name) => (
                            <Tag key={name} variant='subtle' colorScheme='cyan'>
                              <TagLeftIcon boxSize='12px' as={MdDoneOutline} />
                              <TagLabel>{name}</TagLabel>
                            </Tag>
                          ))
                      }
                    </Stack>
                  )}
                  <UserMiniCard userId={tool.userId} />
                  {tool.location && (
                    <Box mt={4} height='200px' borderRadius='lg' overflow='hidden'>
                      <MapMarker {...tool.location} />
                    </Box>
                  )}
                </Stack>
              </Stack>
              <OwnerToolButtons tool={tool} />
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
