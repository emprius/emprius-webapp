import { Badge, Box, Button, Link, Stack, Tab, TabList, TabPanel, TabPanels, Tabs, Text, useColorModeValue, useDisclosure } from '@chakra-ui/react'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FiStar } from 'react-icons/fi'
import { Link as RouterLink } from 'react-router-dom'
import { useAuth } from '~src/features/auth/context/AuthContext'
import { LoadingSpinner } from '../../../components/shared/LoadingSpinner'
import { RatingModal } from '../../../features/rating/components/RatingModal'
import { useBookingPetitions, useBookingRequests } from '../userQueries'

export const UserBookings = () => {
  const { t } = useTranslation()
  const { user } = useAuth()
  const { data: requests, isLoading: isLoadingRequests } = useBookingRequests()
  const { data: petitions, isLoading: isLoadingPetitions } = useBookingPetitions()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [selectedBooking, setSelectedBooking] = useState<{
    id: string
    toolId: string
  } | null>(null)

  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')

  const handleRateClick = (bookingId: string, toolId: string) => {
    setSelectedBooking({ id: bookingId, toolId })
    onOpen()
  }

  if (isLoadingRequests || isLoadingPetitions) {
    return <LoadingSpinner />
  }

  const renderBookingList = (bookings: typeof requests) => {
    if (!bookings?.length) {
      return (
        <Box p={6} bg={bgColor} borderRadius='lg' borderWidth={1} borderColor={borderColor} textAlign='center'>
          <Text color='gray.600'>{t('user.noBookings')}</Text>
        </Box>
      )
    }

    return (
      <>
        <Stack spacing={4}>
          {bookings.map((booking) => (
            <Box key={booking.id} p={6} bg={bgColor} borderRadius='lg' borderWidth={1} borderColor={borderColor}>
              <Stack spacing={4}>
                <Stack
                  direction={{ base: 'column', sm: 'row' }}
                  justify='space-between'
                  align={{ base: 'flex-start', sm: 'center' }}
                >
                  <Link
                    as={RouterLink}
                    to={`/tools/${booking.tool.id}`}
                    fontWeight='semibold'
                    fontSize='lg'
                    _hover={{ color: 'primary.500', textDecoration: 'none' }}
                  >
                    {booking.tool.name}
                  </Link>
                  <Badge
                    colorScheme={
                      booking.status === 'completed'
                        ? 'green'
                        : booking.status === 'cancelled'
                          ? 'red'
                          : booking.status === 'confirmed'
                            ? 'blue'
                            : 'yellow'
                    }
                    px={2}
                    py={1}
                    borderRadius='full'
                  >
                    {t(`bookings.status.${booking.status}`)}
                  </Badge>
                </Stack>

                <Stack direction={{ base: 'column', sm: 'row' }} spacing={4} color='gray.600'>
                  <Text>
                    {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}
                  </Text>
                  <Text fontWeight='medium'>
                    {t('tools.pricePerDay')}: {booking.tool.price}€
                  </Text>
                  <Text fontWeight='medium'>
                    {t('bookings.total')}: {booking.totalPrice}€
                  </Text>
                </Stack>

                {booking.status === 'completed' && (
                  <Button
                    leftIcon={<FiStar />}
                    variant='outline'
                    onClick={() => handleRateClick(booking.id, booking.tool.id)}
                    alignSelf='flex-start'
                  >
                    {t('rating.rateTool')}
                  </Button>
                )}
              </Stack>
            </Box>
          ))}
        </Stack>

        {selectedBooking && (
          <RatingModal
            isOpen={isOpen}
            onClose={() => {
              onClose()
              setSelectedBooking(null)
            }}
            toolId={selectedBooking.toolId}
            bookingId={selectedBooking.id}
          />
        )}
      </>
    )
  }

  return (
    <Tabs>
      <TabList>
        <Tab>{t('bookings.myPetitions')}</Tab>
        <Tab>{t('bookings.toolRequests')}</Tab>
      </TabList>

      <TabPanels>
        <TabPanel>
          {renderBookingList(petitions)}
        </TabPanel>
        <TabPanel>
          {renderBookingList(requests)}
        </TabPanel>
      </TabPanels>
    </Tabs>
  )
}
