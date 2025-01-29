import { SimpleGrid } from '@chakra-ui/react'
import { UseQueryResult } from '@tanstack/react-query'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { RatingCard } from './RatingCard'
import { useGetPendingRatings } from './ratingQueries'
import { Rating } from './types'
import { LoadingSpinner } from '~components/Layout/LoadingSpinner'
import ErrorComponent from '~components/Layout/ErrorComponent'
import { ElementNotFound } from '~components/Layout/ElementNotFound'
import { icons } from '~utils/icons'

export const RatingsList = () => {
  const { t } = useTranslation()
  const { data: pendingRatings, isLoading, error } = useGetPendingRatings() as UseQueryResult<Rating[]>

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (error) {
    return <ErrorComponent error={error} />
  }

  if (!pendingRatings?.length) {
    return (
      <ElementNotFound
        icon={icons.ratings}
        title={t('rating.no_ratings_found')}
        desc={t('rating.no_ratings_found_desc')}
      />
    )
  }

  return (
    <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4} autoRows='auto'>
      {pendingRatings.map((rating: Rating, index) => (
        <RatingCard key={index} {...rating} />
      ))}
    </SimpleGrid>
  )
}
