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
import { ImageCarousel } from '~components/Layout/ImageCarousel'
import { ToolBadges } from '~components/Tools/shared/ToolBadges'
import { FiBox, FiDollarSign, FiTag } from 'react-icons/fi'
import { LuWeight } from 'react-icons/lu'
import { HiOutlineTruck } from 'react-icons/hi2'
import { MdDoneOutline } from 'react-icons/md'
import { UserCard } from '~components/Users/Card'
import { MapMarker } from '~components/Layout/MapMarker'
import { OwnerToolButtons } from '~components/Tools/shared/OwnerToolButtons'
import { AvailabilityCalendar } from '~components/Tools/AvailabilityCalendar'
import { BookingForm } from '~components/Bookings/Form'
import { Link as RouterLink } from 'react-router-dom'
import { ROUTES } from '~src/router/routes'
import React from 'react'
import { Tool } from '~components/Tools/types'
import { useAuth } from '~components/Auth/AuthContext'
import { useInfoContext } from '~components/Providers/InfoContext'
import { useTranslation } from 'react-i18next'
import { lightText } from '~theme/common'

export const ToolDetail = ({ tool }: { tool: Tool }) => {
  const { t } = useTranslation()
  const { isAuthenticated, user } = useAuth()
  const { categories, transports } = useInfoContext()
  const borderColor = useColorModeValue('gray.200', 'gray.700')
  const bgColor = useColorModeValue('white', 'gray.800')

  return (
    <Container maxW='container.xl' py={8}>
      <Grid templateColumns={{ base: '1fr', lg: '2fr 1fr' }} gap={8}>
        <GridItem>
          <Stack spacing={8}>
            <Box bg={bgColor} borderWidth={1} borderColor={borderColor} borderRadius='lg' overflow='hidden'>
              {tool.images.length > 0 && <ImageCarousel imageIds={tool.images} height='400px' width='100%' />}

              <Stack p={6} spacing={6}>
                <Stack spacing={4}>
                  <Stack spacing={1}>
                    <Stack direction='row' align='center' justify='space-between'>
                      <Text sx={lightText} fontSize='2xl' fontWeight='bold'>
                        {t('tools.cost_unit', { cost: tool.cost })}
                      </Text>
                      <Badge colorScheme={tool.isAvailable ? 'green' : 'gray'} px={2} py={1} borderRadius='full'>
                        {t(`tools.${tool.isAvailable ? 'available' : 'unavailable'}`)}
                      </Badge>
                    </Stack>
                  </Stack>
                  {tool?.description && <Text sx={lightText}>{tool.description}</Text>}
                  <ToolBadges tool={tool} />
                  <Divider />
                  <SimpleGrid spacing={4} columns={{ base: 2 }}>
                    <Stack direction='row' align='center' spacing={4}>
                      {tool.estimatedValue && (
                        <Stack direction='row' align='center'>
                          <FiDollarSign size={20} />
                          <Text>
                            {t('tools.estimated_value')}: {tool.estimatedValue}
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
                    <Stack direction={{ base: 'column', sm: 'row' }} align='start' wrap='wrap'>
                      <Stack direction={'row'}>
                        <HiOutlineTruck size={20} />
                        <Text>{t('tools.transport_options')}:</Text>
                      </Stack>
                      <Stack direction={'row'} wrap='wrap'>
                        {tool.transportOptions
                          .map((transport) => transports.find((t) => t.id === transport)?.name)
                          .map((name) => (
                            <Tag key={name} variant='subtle' colorScheme='cyan'>
                              <TagLeftIcon boxSize='12px' as={MdDoneOutline} />
                              <TagLabel>{name}</TagLabel>
                            </Tag>
                          ))}
                      </Stack>
                    </Stack>
                  )}
                  <UserCard userId={tool.userId} />
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
            <AvailabilityCalendar reservedDates={tool.reservedDates || []} />
            {isAuthenticated ? (
              tool.isAvailable ? (
                <BookingForm tool={tool} />
              ) : (
                <Box bg={bgColor} p={6} borderRadius='lg' boxShadow='sm' textAlign='center'>
                  <Text color='gray.600' mb={4}>
                    {t('tools.not_available')}
                  </Text>
                  <Link as={RouterLink} to={ROUTES.TOOLS.LIST} color='primary.500' fontWeight='medium'>
                    {t('tools.find_other')}
                  </Link>
                </Box>
              )
            ) : (
              <Box bg={bgColor} p={6} borderRadius='lg' boxShadow='sm' textAlign='center'>
                <Text color='gray.600' mb={4}>
                  {t('tools.login_to_book')}
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
