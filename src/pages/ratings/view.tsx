import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { TitlePageLayoutContext } from '~src/pages/TitlePageLayout'
import { useOutletContext } from 'react-router-dom'
import { useGetPendingRatings, useGetReceivedRatings, useGetSubmittedRatings } from '~components/Ratings/queries'
import { LoadingSpinner } from '~components/Layout/LoadingSpinner'
import ErrorComponent from '~components/Layout/ErrorComponent'
import { ElementNotFound } from '~components/Layout/ElementNotFound'
import { icons } from '~theme/icons'
import { ResponsiveSimpleGrid } from '~components/Layout/LayoutComponents'
import { PendingRatingCard, RatingCard } from '~components/Ratings/Card'
import { Booking } from '~components/Bookings/queries'
import { RoutedTabs, TabConfig } from '~components/Layout/RoutedTabs'
import { ROUTES } from '~src/router/routes'
import { usePendingActions } from '~components/InfoProviders/PendingActionsProvider'
import { BadgeCounter } from '~components/Layout/BadgeIcon'

const PendingRatings = () => {
  const { t } = useTranslation()
  const { isLoading, error, data } = useGetPendingRatings()

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

const SubmittedRatings = () => {
  const { t } = useTranslation()
  const { isLoading, error, data } = useGetSubmittedRatings()

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
        title={t('rating.no_submitted_ratings')}
        desc={t('rating.no_submitted_ratings_desc')}
      />
    )
  }

  return (
    <ResponsiveSimpleGrid>
      {data.map((rating, index) => (
        <RatingCard key={index} rating={rating} />
      ))}
    </ResponsiveSimpleGrid>
  )
}

const ReceivedRatings = () => {
  const { t } = useTranslation()
  const { isLoading, error, data } = useGetReceivedRatings()

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
        title={t('rating.no_received_ratings')}
        desc={t('rating.no_received_ratings_desc')}
      />
    )
  }

  return (
    <ResponsiveSimpleGrid>
      {data.map((rating, index) => (
        <RatingCard key={index} rating={rating} />
      ))}
    </ResponsiveSimpleGrid>
  )
}

export const View = () => {
  const { pendingRatingsCount } = usePendingActions()
  const { t } = useTranslation()
  const { setTitle } = useOutletContext<TitlePageLayoutContext>()

  useEffect(() => {
    setTitle(t('rating.ratings'))
  }, [setTitle, t])

  const tabs: TabConfig[] = [
    {
      path: ROUTES.RATINGS.PENDING,
      label: <BadgeCounter count={pendingRatingsCount}> {t('rating.pending_ratings')}</BadgeCounter>,
      content: <PendingRatings />,
    },
    {
      path: ROUTES.RATINGS.SUBMITTED,
      label: t('rating.submitted_ratings'),
      content: <SubmittedRatings />,
    },
    {
      path: ROUTES.RATINGS.RECEIVED,
      label: t('rating.received_ratings'),
      content: <ReceivedRatings />,
    },
  ]

  return <RoutedTabs tabs={tabs} defaultPath={ROUTES.RATINGS.PENDING} />
}
