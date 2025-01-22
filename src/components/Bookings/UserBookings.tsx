import { Box, Stack, Tab, TabList, TabPanel, TabPanels, Tabs, Text, useColorModeValue } from '@chakra-ui/react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Booking, useBookingPetitions, useBookingRequests } from '~components/Bookings/bookingsQueries'
import { LoadingSpinner } from '~components/Layout/LoadingSpinner'
import { BookingCard, BookingCardType } from './BookingCard'
import { UseQueryResult } from '@tanstack/react-query'

export const UserBookings = () => {
  const { t } = useTranslation()

  return (
    <Tabs isLazy>
      <TabList>
        <Tab>{t('bookings.myPetitions')}</Tab>
        <Tab>{t('bookings.toolRequests')}</Tab>
      </TabList>

      <TabPanels>
        <TabPanel px={1}>
          <Petitions />
        </TabPanel>
        <TabPanel px={1}>
          <Requests />
        </TabPanel>
      </TabPanels>
    </Tabs>
  )
}

const Requests = () => {
  const query = useBookingRequests()
  return <BookingList type={'request'} {...query} />
}

const Petitions = () => {
  const query = useBookingPetitions()
  return <BookingList type={'petition'} {...query} />
}

type BookingListProps = {
  type: BookingCardType
} & UseQueryResult<Booking[], Error>

const BookingList = ({ data: bookings, type, isLoading, isError }: BookingListProps) => {
  const { t } = useTranslation()
  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (!bookings?.length || isError) {
    return (
      <Box p={6} bg={bgColor} borderRadius='lg' borderWidth={1} borderColor={borderColor} textAlign='center'>
        <Text color='gray.600'>{t('user.noBookings')}</Text>
      </Box>
    )
  }

  return (
    <Stack spacing={4}>
      {bookings.map((booking) => (
        <BookingCard key={booking.id} booking={booking} type={type} />
      ))}
    </Stack>
  )
}
