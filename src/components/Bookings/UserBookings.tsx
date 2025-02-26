import { Icon } from '@chakra-ui/react'
import { UseQueryResult } from '@tanstack/react-query'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Booking, useBookingPetitions, useBookingRequests } from '~components/Bookings/queries'
import { usePendingActions } from '~components/Layout/Contexts/PendingActionsProvider'
import { BadgeCounter } from '~components/Layout/BadgeIcon'
import { ElementNotFound } from '~components/Layout/ElementNotFound'
import ErrorComponent from '~components/Layout/ErrorComponent'
import { ResponsiveSimpleGrid } from '~components/Layout/LayoutComponents'
import { LoadingSpinner } from '~components/Layout/LoadingSpinner'
import { RoutedTabs, TabConfig } from '~components/Layout/RoutedTabs'

import { ROUTES } from '~src/router/routes'
import { icons } from '~theme/icons'
import { BookingCard, BookingCardType } from './Card'

export const UserBookings = () => {
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

const Requests = () => {
  const query = useBookingRequests()
  return <BookingList type={'request'} {...query} />
}

const Petitions = () => {
  const query = useBookingPetitions()
  return <BookingList type={'petition'} {...query} />
}

type BookingListProps = {
  type: BookingCardType
} & UseQueryResult<Booking[], Error>

const BookingList = ({ data: bookings, type, isLoading, error }: BookingListProps) => {
  const { t } = useTranslation()

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (!bookings?.length) {
    return <ElementNotFound icon={icons.ratings} title={t('user.no_bookings')} desc={t('user.no_bookings_desc')} />
  }

  if (error) {
    return <ErrorComponent error={error} />
  }

  return (
    <ResponsiveSimpleGrid>
      {bookings.map((booking) => (
        <BookingCard key={booking.id} booking={booking} type={type} />
      ))}
    </ResponsiveSimpleGrid>
  )
}
