import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { TitlePageLayoutContext } from '~src/pages/TitlePageLayout'
import { useOutletContext } from 'react-router-dom'
import { useGetPendingRatings, useGetUserRatings } from '~components/Ratings/queries'
import { LoadingSpinner } from '~components/Layout/LoadingSpinner'
import ErrorComponent from '~components/Layout/ErrorComponent'
import { ElementNotFound } from '~components/Layout/ElementNotFound'
import { icons } from '~theme/icons'
import { ResponsiveSimpleGrid } from '~components/Layout/LayoutComponents'
import { PendingRatingCard } from '~components/Ratings/PendingRatingCard'
import { UserRatingCard } from '~components/Ratings/UserRatingCard'
import { RoutedTabs, TabConfig } from '~components/Layout/RoutedTabs'
import { ROUTES } from '~src/router/routes'
import { usePendingActions } from '~components/Layout/Contexts/PendingActionsProvider'
import { BadgeCounter } from '~components/Layout/BadgeIcon'
import { Stack } from '@chakra-ui/react'
import { useAuth } from '~components/Auth/AuthContext'
import { SuccessModal } from '~components/Ratings/Modal'
import { Booking } from '~components/Bookings/types'

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
    <ResponsiveSimpleGrid columns={{ base: 1, sm: 2, md: 2, xl: 3 }}>
      {data.map((booking: Booking, index) => (
        <PendingRatingCard key={index} {...booking} />
      ))}
    </ResponsiveSimpleGrid>
  )
}

const RatingHistory = () => {
  const { t } = useTranslation()
  const { user } = useAuth()
  const { isLoading, error, data } = useGetUserRatings(user.id)

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (error) {
    return <ErrorComponent error={error} />
  }

  // Filter out ratings where no one has rated
  // todo(kon): should be deleted after https://github.com/emprius/emprius-app-backend/issues/60
  const ratingsWithContent =
    data?.filter((rating) => rating.owner.rating !== null || rating.requester.rating !== null) || []

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
    <>
      <SuccessModal />
      <Stack spacing={4}>
        {ratingsWithContent.map((rating, index) => (
          <UserRatingCard key={index} rating={rating} actualUser={user.id} />
        ))}
      </Stack>
    </>
  )
}

export const View = () => {
  const { pendingRatingsCount } = usePendingActions()
  const { t } = useTranslation()
  const { setData } = useOutletContext<TitlePageLayoutContext>()

  useEffect(() => {
    setData(t('rating.ratings'))
  }, [setData, t])

  const tabs: TabConfig[] = [
    {
      path: ROUTES.RATINGS.PENDING,
      label: <BadgeCounter count={pendingRatingsCount}> {t('rating.pending_ratings')}</BadgeCounter>,
      content: <PendingRatings />,
    },
    {
      path: ROUTES.RATINGS.HISTORY,
      label: t('rating.ratings_history'),
      content: <RatingHistory />,
    },
  ]

  return (
    <>
      <RoutedTabs tabs={tabs} defaultPath={ROUTES.RATINGS.PENDING} />
    </>
  )
}
