import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { TitlePageLayoutContext } from '~src/pages/TitlePageLayout'
import { useOutletContext } from 'react-router-dom'
import { useGetPendingRatings } from '~components/Ratings/queries'
import { LoadingSpinner } from '~components/Layout/LoadingSpinner'
import ErrorComponent from '~components/Layout/ErrorComponent'
import { ElementNotFound } from '~components/Layout/ElementNotFound'
import { icons } from '~theme/icons'
import { ResponsiveSimpleGrid } from '~components/Layout/LayoutComponents'
import { PendingRatingCard } from '~components/Ratings/Card'
import { Booking } from '~components/Bookings/queries'

export const View = () => {
  const { t } = useTranslation()
  const { setTitle } = useOutletContext<TitlePageLayoutContext>()
  const { isLoading, error, data } = useGetPendingRatings()

  useEffect(() => {
    setTitle(t('rating.pending_ratings'))
  }, [setTitle])

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
      {data.map((booking: Booking, index) => (
        <PendingRatingCard key={index} {...booking} />
      ))}
    </ResponsiveSimpleGrid>
  )
}
