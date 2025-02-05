import { Stack, Tab, TabList, TabPanel, TabPanels, Tabs, useBreakpointValue } from '@chakra-ui/react'
import { UseQueryResult } from '@tanstack/react-query'
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'
import { Booking, useBookingPetitions, useBookingRequests } from '~components/Bookings/queries'
import { usePendingActions } from '~components/InfoProviders/PendingActionsProvider'
import { BadgeCounter } from '~components/Layout/BadgeIcon'
import { ElementNotFound } from '~components/Layout/ElementNotFound'
import ErrorComponent from '~components/Layout/ErrorComponent'
import { LoadingSpinner } from '~components/Layout/LoadingSpinner'

import { ROUTES } from '~src/router/routes'
import { icons } from '~theme/icons'
import { BookingCard, BookingCardType } from './Card'

export const UserBookings = () => {
  const { t } = useTranslation()
  const { pendingRequestsCount } = usePendingActions()
  const navigate = useNavigate()
  const location = useLocation()
  const isMobile = useBreakpointValue({ base: true, md: false })

  useEffect(() => {
    if (location.pathname === ROUTES.BOOKINGS.REQUESTS) {
      setTabIndex(1)
    } else {
      setTabIndex(0)
    }
  }, [location.pathname])

  const [tabIndex, setTabIndex] = React.useState(location.pathname === ROUTES.BOOKINGS.REQUESTS ? 1 : 0)

  const handleTabChange = (index: number) => {
    setTabIndex(index)
    if (isMobile) {
      navigate(index === 0 ? ROUTES.BOOKINGS.PETITIONS : ROUTES.BOOKINGS.REQUESTS)
    }
  }

  return (
    <Tabs isLazy index={tabIndex} onChange={handleTabChange} display={{ base: 'block', md: 'none' }}>
      <TabList>
        <Tab>{t('bookings.my_petitions')}</Tab>
        <Tab>
          <BadgeCounter count={pendingRequestsCount}>{t('bookings.tool_requests')}</BadgeCounter>
        </Tab>
      </TabList>
      <TabPanels>
        <TabPanel px={1}>
          <Petitions />
        </TabPanel>
        <TabPanel px={1}>
          <Requests />
        </TabPanel>
      </TabPanels>
    </Tabs>
  )
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
    <Stack spacing={4}>
      {bookings.map((booking) => (
        <BookingCard key={booking.id} booking={booking} type={type} />
      ))}
    </Stack>
  )
}
