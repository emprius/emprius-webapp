import { Stack, useBreakpointValue } from '@chakra-ui/react'
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, useOutletContext, useParams } from 'react-router-dom'
import { BookingTabs } from '~components/Bookings/BookingTabs'
import { TitlePageLayoutContext } from '~src/pages/TitlePageLayout'
import { ROUTES } from '~src/router/routes'
import { RoutedPaginationProvider } from '~components/Layout/Pagination/PaginationProvider'
import { Petitions, Requests } from '~components/Bookings/List'

export const List = () => {
  const location = useLocation()
  const isRequests = location.pathname === ROUTES.BOOKINGS.REQUESTS
  const isMobile = useBreakpointValue({ base: true, md: false }, { ssr: false })
  const { t } = useTranslation()
  const { setData } = useOutletContext<TitlePageLayoutContext>()

  useEffect(() => {
    setData(isRequests ? t('bookings.tool_requests') : t('bookings.my_petitions'))
  }, [setData, isRequests, t])

  if (isMobile) {
    return (
      <RoutedPaginationProvider>
        <BookingTabs />
      </RoutedPaginationProvider>
    )
  }

  return (
    <RoutedPaginationProvider>
      {isRequests && <Requests />}
      {!isRequests && <Petitions />}
    </RoutedPaginationProvider>
  )
}
