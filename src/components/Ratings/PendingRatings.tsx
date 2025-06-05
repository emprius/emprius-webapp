import { useTranslation } from 'react-i18next'
import { useGetPendingRatings } from '~components/Ratings/queries'
import { LoadingSpinner } from '~components/Layout/LoadingSpinner'
import ErrorComponent from '~components/Layout/ErrorComponent'
import { ElementNotFound } from '~components/Layout/ElementNotFound'
import { icons } from '~theme/icons'
import { ResponsiveSimpleGrid } from '~components/Layout/LayoutComponents'
import { Booking } from '~components/Bookings/types'
import { PendingRatingCard } from '~components/Ratings/PendingRatingCard'
import React from 'react'
import { RoutedPaginationProvider } from '~components/Layout/Pagination/PaginationProvider'
import { Box } from '@chakra-ui/react'
import { RoutedPagination } from '~components/Layout/Pagination/Pagination'

export const PendingRatings = () => (
  <RoutedPaginationProvider>
    <PendingRatingsPaginated />
  </RoutedPaginationProvider>
)

const PendingRatingsPaginated = () => {
  const { t } = useTranslation()
  const { isLoading, error, data } = useGetPendingRatings()

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (error) {
    return <ErrorComponent error={error} />
  }

  if (!data?.bookings.length) {
    return (
      <ElementNotFound
        icon={icons.ratings}
        title={t('rating.no_pending_ratings')}
        desc={t('rating.no_pending_ratings_desc')}
      />
    )
  }

  return (
    <>
      <ResponsiveSimpleGrid columns={{ base: 1, sm: 2, md: 2, xl: 3 }}>
        {data.bookings.map((booking: Booking, index) => (
          <PendingRatingCard key={index} {...booking} />
        ))}
      </ResponsiveSimpleGrid>
      <Box mt={4}>
        <RoutedPagination pagination={data?.pagination} />
      </Box>
    </>
  )
}
