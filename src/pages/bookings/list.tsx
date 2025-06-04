import { Stack, useBreakpointValue } from '@chakra-ui/react'
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, useOutletContext } from 'react-router-dom'
import { BookingCard } from '~components/Bookings/Card'
import { useBookingPetitions, useBookingRequests } from '~components/Bookings/queries'
import { UserBookings } from '~components/Bookings/UserBookings'
import { ElementNotFound } from '~components/Layout/ElementNotFound'
import ErrorComponent from '~components/Layout/ErrorComponent'
import { LoadingSpinner } from '~components/Layout/LoadingSpinner'
import { TitlePageLayoutContext } from '~src/pages/TitlePageLayout'
import { ROUTES } from '~src/router/routes'
import { icons } from '~theme/icons'

const BookingList = ({ type }: { type: 'request' | 'petition' }) => {
  const { t } = useTranslation()
  const { setData } = useOutletContext<TitlePageLayoutContext>()
  const query = type === 'request' ? useBookingRequests() : useBookingPetitions()
  const { data: bookings, isLoading, error } = query

  useEffect(() => {
    setData(type === 'request' ? t('bookings.tool_requests') : t('bookings.my_petitions'))
  }, [setData, type, t])

  if (isLoading) return <LoadingSpinner />
  if (!bookings?.length) {
    return <ElementNotFound icon={icons.ratings} title={t('user.no_bookings')} desc={t('user.no_bookings_desc')} />
  }
  if (error) return <ErrorComponent error={error} />

  return (
    <Stack spacing={4}>
      {bookings.map((booking) => (
        <BookingCard key={booking.id} booking={booking} type={type} />
      ))}
    </Stack>
  )
}

export const List = () => {
  const location = useLocation()
  const isRequests = location.pathname === ROUTES.BOOKINGS.REQUESTS
  const isMobile = useBreakpointValue({ base: true, md: false })

  if (isMobile) {
    return <UserBookings />
  }

  return <BookingList type={isRequests ? 'request' : 'petition'} />
}
