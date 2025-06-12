import { useTranslation } from 'react-i18next'
import { useAuth } from '~components/Auth/AuthContext'
import { useGetUserRatings } from '~components/Ratings/queries'
import { LoadingSpinner } from '~components/Layout/LoadingSpinner'
import ErrorComponent from '~components/Layout/ErrorComponent'
import { ElementNotFound } from '~components/Layout/ElementNotFound'
import { icons } from '~theme/icons'
import { SuccessModal } from '~components/Ratings/Modal'
import { Stack } from '@chakra-ui/react'
import { UserRatingCard } from '~components/Ratings/UserRatingCard'
import React from 'react'
import { RoutedPaginationProvider } from '~components/Layout/Pagination/PaginationProvider'
import { RoutedPagination } from '~components/Layout/Pagination/Pagination'

export const RatingHistory = () => (
  <RoutedPaginationProvider>
    <RatingHistoryPaginated />
  </RoutedPaginationProvider>
)

const RatingHistoryPaginated = () => {
  const { t } = useTranslation()
  const { user } = useAuth()
  const { isLoading, error, data } = useGetUserRatings(user.id)

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (error) {
    return <ErrorComponent error={error} />
  }

  if (!data?.ratings?.length) {
    return (
      <ElementNotFound
        icon={icons.ratings}
        title={t('rating.no_ratings_history')}
        desc={t('rating.no_ratings_history_desc')}
      />
    )
  }

  return (
    <>
      <SuccessModal />
      <Stack spacing={4}>
        {data.ratings.map((rating, index) => (
          <UserRatingCard key={index} rating={rating} actualUser={user.id} />
        ))}
      </Stack>
      <RoutedPagination pagination={data.pagination} />
    </>
  )
}
