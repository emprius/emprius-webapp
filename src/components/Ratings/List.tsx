import React from 'react'
import { useTranslation } from 'react-i18next'
import { ElementNotFound } from '~components/Layout/ElementNotFound'
import ErrorComponent from '~components/Layout/ErrorComponent'
import { ResponsiveSimpleGrid } from '~components/Layout/LayoutComponents'
import { LoadingSpinner } from '~components/Layout/LoadingSpinner'
import { icons } from '~theme/icons'
import { PendingRatingCard } from './Card'
import { useGetPendingRatings } from './queries'
import { Rating } from './types'

export const RatingsList = () => {
  const { isLoading, error, data } = useGetPendingRatings()
  const { t } = useTranslation()

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (error) {
    return <ErrorComponent error={error} />
  }

  if (!data?.length) {
    return (
      <ElementNotFound
        icon={icons.ratings}
        title={t('rating.no_pending_ratings')}
        desc={t('rating.no_pending_ratings_desc')}
      />
    )
  }

  return (
    <ResponsiveSimpleGrid>
      {data.map((rating: Rating, index) => (
        <PendingRatingCard key={index} {...rating} />
      ))}
    </ResponsiveSimpleGrid>
  )
}
