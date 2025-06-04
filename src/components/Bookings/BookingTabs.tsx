import { Icon } from '@chakra-ui/react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { usePendingActions } from '~components/Layout/Contexts/PendingActionsProvider'
import { BadgeCounter } from '~components/Layout/BadgeIcon'
import { RoutedTabs, TabConfig } from '~components/Layout/RoutedTabs'

import { ROUTES } from '~src/router/routes'
import { icons } from '~theme/icons'
import { Petitions, Requests } from '~components/Bookings/List'

export const BookingTabs = () => {
  const { t } = useTranslation()
  const { pendingRequestsCount } = usePendingActions()

  const tabs: TabConfig[] = [
    {
      path: ROUTES.BOOKINGS.PETITIONS,
      label: (
        <>
          <Icon as={icons.request} mr={2} />
          {t('bookings.my_petitions')}
        </>
      ),
      content: <Petitions />,
    },
    {
      path: ROUTES.BOOKINGS.REQUESTS,
      label: (
        <BadgeCounter count={pendingRequestsCount}>
          <Icon as={icons.loan} mr={2} />
          {t('bookings.tool_requests')}
        </BadgeCounter>
      ),
      content: <Requests />,
    },
  ]

  return <RoutedTabs tabs={tabs} defaultPath={ROUTES.BOOKINGS.PETITIONS} />
}
