import { UseQueryResult } from '@tanstack/react-query'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { RatingCard } from './Card'
import { useGetPendingRatings } from './queries'
import { Rating } from './types'
import { LoadingSpinner } from '~components/Layout/LoadingSpinner'
import ErrorComponent from '~components/Layout/ErrorComponent'
import { ElementNotFound } from '~components/Layout/ElementNotFound'
import { icons } from '~theme/icons'
import { ResponsiveSimpleGrid } from '~components/Layout/LayoutComponents'

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
    <ResponsiveSimpleGrid columns={{ base: 1, sm: 2, md: 2, lg: 3 }}>
      {pendingRatings.map((rating: Rating, index) => (
        <RatingCard key={index} {...rating} />
      ))}
    </ResponsiveSimpleGrid>
  )
}
