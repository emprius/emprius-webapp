import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { TitlePageLayoutContext } from '~src/pages/TitlePageLayout'
import { useOutletContext } from 'react-router-dom'
import { RoutedTabs, TabConfig } from '~components/Layout/RoutedTabs'
import { ROUTES } from '~src/router/routes'
import { usePendingActions } from '~components/Layout/Contexts/PendingActionsProvider'
import { BadgeCounter } from '~components/Layout/BadgeIcon'
import { PendingRatings } from '~components/Ratings/PendingRatings'
import { RatingHistory } from '~components/Ratings/RatingsHistory'

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
