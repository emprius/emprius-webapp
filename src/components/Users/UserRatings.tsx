import React from 'react'
import { useParams } from 'react-router-dom'
import { Stack } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { useGetUserRatings } from '~components/Ratings/queries'
import { LoadingSpinner } from '~components/Layout/LoadingSpinner'
import ErrorComponent from '~components/Layout/ErrorComponent'
import { ElementNotFound } from '~components/Layout/ElementNotFound'
import { icons } from '~theme/icons'
import { UserRatingCard } from '~components/Ratings/UserRatingCard'
import { RoutedPaginationProvider } from '~components/Layout/Pagination/PaginationProvider'
import { RoutedPagination } from '~components/Layout/Pagination/Pagination'

export const UserRatings = () => (
  <RoutedPaginationProvider>
    <UserRatingsPaginated />
  </RoutedPaginationProvider>
)

const UserRatingsPaginated = () => {
  const { t } = useTranslation()
  const { id } = useParams<{ id: string }>()
  const { isLoading, error, data } = useGetUserRatings(id)

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (error) {
    return <ErrorComponent error={error} />
  }

  // Filter out ratings where no one has rated
  const ratingsWithContent =
    data?.ratings?.filter((rating) => rating.owner.rating !== null || rating.requester.rating !== null) || []

  if (!ratingsWithContent.length) {
    return (
      <ElementNotFound
        icon={icons.ratings}
        title={t('rating.no_ratings_history')}
        desc={t('rating.no_ratings_history_desc')}
      />
    )
  }

  return (
    <Stack spacing={4}>
      {ratingsWithContent.map((rating, index) => (
        <UserRatingCard key={index} rating={rating} actualUser={id} />
      ))}
      <RoutedPagination pagination={data.pagination} />
    </Stack>
  )
}
