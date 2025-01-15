import {
  Box,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useColorModeValue,
  useDisclosure,
} from '@chakra-ui/react'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { LoadingSpinner } from '../../../components/shared/LoadingSpinner'
import { RatingModal } from '../../../features/bookings/components/RatingModal'
import { useBookingPetitions, useBookingRequests } from '../userQueries'
import { BookingCard } from './BookingCard'

export const UserBookings = () => {
  const { t } = useTranslation()
  const { data: requests, isLoading: isLoadingRequests } = useBookingRequests()
  const { data: petitions, isLoading: isLoadingPetitions } = useBookingPetitions()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [selectedBooking, setSelectedBooking] = useState<{
    id: string
    toolId: number
  } | null>(null)

  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')

  const handleRateClick = (bookingId: string, toolId: string) => {
    setSelectedBooking({ id: bookingId, toolId: parseInt(toolId) })
    onOpen()
  }

  if (isLoadingRequests || isLoadingPetitions) {
    return <LoadingSpinner />
  }

  const renderBookingList = (bookings: typeof requests, type: 'request' | 'petition') => {
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
            <BookingCard
              key={booking.id}
              booking={booking}
              type={type}
              onRateClick={handleRateClick}
            />
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
        <TabPanel>{renderBookingList(petitions, 'petition')}</TabPanel>
        <TabPanel>{renderBookingList(requests, 'request')}</TabPanel>
      </TabPanels>
    </Tabs>
  )
}
