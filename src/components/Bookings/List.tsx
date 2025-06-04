import { useTranslation } from 'react-i18next'
import { LoadingSpinner } from '~components/Layout/LoadingSpinner'
import { ElementNotFound } from '~components/Layout/ElementNotFound'
import { icons } from '~theme/icons'
import ErrorComponent from '~components/Layout/ErrorComponent'
import { BookingCard, BookingCardType } from '~components/Bookings/Card'
import React from 'react'
import { UseQueryResult } from '@tanstack/react-query'
import { Booking } from '~components/Bookings/types'
import { PaginationInfo } from '~src/services/api'
import { useBookingPetitions, useBookingRequests } from '~components/Bookings/queries'
import { RoutedPaginationProvider } from '~components/Layout/Pagination/PaginationProvider'
import { RoutedPagination } from '~components/Layout/Pagination/Pagination'
import { Box, Stack, useBreakpointValue } from '@chakra-ui/react'
import { ResponsiveSimpleGrid } from '~components/Layout/LayoutComponents'

export const Requests = () => {
  const query = useBookingRequests()
  return <BookingList type={'request'} {...query} />
}

export const Petitions = () => {
  const query = useBookingPetitions()
  return <BookingList type={'petition'} {...query} />
}

type BookingListProps = {
  type: BookingCardType
} & UseQueryResult<{ bookings: Booking[] } & PaginationInfo, Error>

const BookingList = (data: BookingListProps) => {
  return (
    <RoutedPaginationProvider>
      <PaginatedBookingList {...data} />
      <Box mt={4}>
        <RoutedPagination pagination={data?.data?.pagination} />
      </Box>
    </RoutedPaginationProvider>
  )
}

const PaginatedBookingList = ({ data, type, isLoading, error }: BookingListProps) => {
  const { t } = useTranslation()
  const bookings = data?.bookings
  const isMobile = useBreakpointValue({ base: true, md: false })

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (!bookings?.length) {
    return <ElementNotFound icon={icons.ratings} title={t('user.no_bookings')} desc={t('user.no_bookings_desc')} />
  }

  if (error) {
    return <ErrorComponent error={error} />
  }

  // todo(kon): This is rendered before it becames false, idk why!
  if (isMobile) {
    return (
      <ResponsiveSimpleGrid>
        {bookings.map((booking) => (
          <BookingCard key={booking.id} booking={booking} type={type} />
        ))}
      </ResponsiveSimpleGrid>
    )
  }

  return (
    <Stack spacing={4}>
      {bookings.map((booking) => (
        <BookingCard key={booking.id} booking={booking} type={type} />
      ))}
    </Stack>
  )
  /*return (<>*/
  /*  // <Stack spacing={4}>*/
  /*    {bookings.map((booking) => (*/
  /*      <BookingCard key={booking.id} booking={booking} type={type} />*/
  /*    ))}*/
  /*  // </Stack>*/
  /*)*/
}
