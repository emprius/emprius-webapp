import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { UserBookings } from '~components/Bookings/UserBookings'
import { useOutletContext } from 'react-router-dom'
import { TitlePageLayoutContext } from '~src/pages/TitlePageLayout'

export const View = () => {
  const { t } = useTranslation()
  const { setTitle } = useOutletContext<TitlePageLayoutContext>()

  useEffect(() => {
    setTitle(t('bookings.my_petitions'))
  }, [setTitle])

  return <UserBookings />
}
