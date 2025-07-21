import { useTranslation } from 'react-i18next'
import { LoadingSpinner } from '~components/Layout/LoadingSpinner'
import { ElementNotFound } from '~components/Layout/ElementNotFound'
import { icons } from '~theme/icons'
import ErrorComponent from '~components/Layout/ErrorComponent'
import { BookingCard, BookingCardType } from '~components/Bookings/Card'
import React from 'react'
import { UseQueryResult } from '@tanstack/react-query'
import { BookingsListResponse } from '~components/Bookings/types'
import { PaginationInfo } from '~src/services/api'
import { useBookingPetitions, useBookingRequests } from '~components/Bookings/queries'
import { RoutedPagination } from '~components/Layout/Pagination/Pagination'
import { Box, SimpleGrid } from '@chakra-ui/react'

export const Requests = () => {
  const query = useBookingRequests()
  return <BookingList type={'loan'} {...query} />
}

export const Petitions = () => {
  const query = useBookingPetitions()
  return <BookingList type={'petition'} {...query} />
}

type BookingListProps = {
  type: BookingCardType
} & UseQueryResult<BookingsListResponse & PaginationInfo, Error>

const BookingList = (data: BookingListProps) => {
  return (
    <>
      <PaginatedBookingList {...data} />
      <Box mt={4}>
        <RoutedPagination pagination={data?.data?.pagination} />
      </Box>
    </>
  )
}

const PaginatedBookingList = ({ data, type, isLoading, error }: BookingListProps) => {
  const { t } = useTranslation()
  const bookings = data?.bookings

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (!bookings?.length) {
    const title = type === 'loan' ? t('user.no_loans') : t('user.petitions')
    const subtitle = type === 'loan' ? t('user.no_loans_desc') : t('user.petitions_desc')
    return <ElementNotFound icon={icons.ratings} title={title} desc={subtitle} />
  }

  if (error) {
    return <ErrorComponent error={error} />
  }

  return (
    <SimpleGrid columns={{ base: 1, sm: 2, md: 1 }} spacing={4} autoRows='auto'>
      {bookings.map((booking) => (
        <BookingCard key={booking.id} booking={booking} type={type} />
      ))}
    </SimpleGrid>
  )
}
