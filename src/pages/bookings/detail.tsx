import React, { useEffect } from 'react'
import { useLocation, useOutletContext, useParams } from 'react-router-dom'
import { BookingDetailsPage } from '~components/Bookings/Details'
import { Booking, useBookingDetail } from '~components/Bookings/queries'
import { useTool } from '~components/Tools/queries'
import { LoadingSpinner } from '~components/Layout/LoadingSpinner'
import { ElementNotFound } from '~components/Layout/ElementNotFound'
import { useTranslation } from 'react-i18next'
import { Tool } from '~components/Tools/types'
import { TitlePageLayoutContext } from '~src/pages/TitlePageLayout'
import { useAuth } from '~components/Auth/AuthContext'

export const Detail = () => {
  const { id } = useParams<{ id: string }>()
  const { t } = useTranslation()
  const location = useLocation()
  const { setTitle } = useOutletContext<TitlePageLayoutContext>()
  const { user } = useAuth()

  // Check if we have state passed from navigation
  const {
    booking: bookingFromState,
    tool: toolFromState,
    userId: userIdFromState,
  } = (location.state as { booking?: Booking; tool?: Tool; userId?: string }) || {}

  const {
    data: booking,
    isLoading: isLoadingBooking,
    error: bookingError,
  } = useBookingDetail({
    id,
    options: {
      placeholderData: bookingFromState,
    },
  })
  const { data: tool, isLoading: isLoadingTool } = useTool(booking?.toolId || '', {
    placeholderData: toolFromState,
  })

  // Determine the user ID based on the booking type
  const userId = user.id === booking?.toUserId ? booking?.toUserId : booking?.fromUserId
  const isLoading = isLoadingBooking || isLoadingTool

  // Set title
  useEffect(() => {
    setTitle('')
  }, [setTitle, t])

  // If we don't have an ID, redirect to bookings
  if (!id || bookingError || !booking || !tool) {
    return (
      <ElementNotFound
        title={t('bookings.not_found')}
        desc={t('bookings.not_found_desc', { defaultValue: 'The booking you are looking for could not be found.' })}
      />
    )
  }

  if (isLoading) {
    return <LoadingSpinner />
  }

  return <BookingDetailsPage booking={booking} tool={tool} userId={userId} />
}
