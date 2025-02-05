import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Stack } from '@chakra-ui/react'
import { useBookingPetitions } from '~components/Bookings/queries'
import { ElementNotFound } from '~components/Layout/ElementNotFound'
import ErrorComponent from '~components/Layout/ErrorComponent'
import { LoadingSpinner } from '~components/Layout/LoadingSpinner'
import { icons } from '~theme/icons'
import { BookingCard } from '~components/Bookings/Card'
import { useOutletContext } from 'react-router-dom'
import { TitlePageLayoutContext } from '~src/pages/TitlePageLayout'

export const Petitions = () => {
  const { t } = useTranslation()
  const { setTitle } = useOutletContext<TitlePageLayoutContext>()
  const { data: bookings, isLoading, error } = useBookingPetitions()

  useEffect(() => {
    setTitle(t('bookings.my_petitions'))
  }, [setTitle, t])

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
        <BookingCard key={booking.id} booking={booking} type="petition" />
      ))}
    </Stack>
  )
}
