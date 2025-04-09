import { Button, useDisclosure } from '@chakra-ui/react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { FiCheck, FiThumbsDown, FiThumbsUp, FiXCircle } from 'react-icons/fi'
import {
  Booking,
  BookingStatus,
  useAcceptBooking,
  useCancelBooking,
  useDenyBooking,
  useReturnBooking,
  usePickedBooking,
} from '~components/Bookings/queries'
import { PickedAlertDialog, RatingModal, ReturnAlertDialog } from '~components/Ratings/Modal'
import { icons } from '~theme/icons'
import { useAuth } from '~components/Auth/AuthContext'
import { useBookingActions } from '~components/Bookings/ActionsProvider'

interface ActionsProps {
  booking: Booking
}

const PendingRequestActions = ({ booking }: ActionsProps) => {
  const bookingId = booking.id
  const { t } = useTranslation()
  const { error, onSuccess, onError } = useBookingActions()

  const { mutateAsync: acceptBooking, isPending: isAcceptPending } = useAcceptBooking(booking, {
    onError: (error) => onError(error, t('bookings.accept_error')),
  })

  const { mutateAsync: denyBooking, isPending: isDenyPending } = useDenyBooking(booking, {
    onError: (error) => onError(error, t('bookings.deny_error')),
  })

  const handleDeny = async (e: React.MouseEvent) => {
    e.stopPropagation()
    await denyBooking(bookingId)
    onSuccess(t('bookings.deny_success'))
  }

  const handleApprove = async (e: React.MouseEvent) => {
    e.stopPropagation()
    await acceptBooking(bookingId)
    onSuccess(t('bookings.approve_success'))
  }

  const isPending = isAcceptPending || isDenyPending
  const isError = !!error

  return (
    <>
      <Button
        leftIcon={<FiThumbsUp />}
        colorScheme='green'
        variant='outline'
        onClick={handleApprove}
        disabled={isPending}
        isLoading={isAcceptPending}
      >
        {t('bookings.approve')}
      </Button>
      <Button
        leftIcon={<FiThumbsDown />}
        colorScheme='red'
        variant='outline'
        onClick={handleDeny}
        isLoading={isDenyPending}
        disabled={isPending}
      >
        {t('bookings.deny')}
      </Button>
    </>
  )
}

const PendingPetitionActions = ({ booking }: ActionsProps) => {
  const bookingId = booking.id
  const { t } = useTranslation()
  const { onSuccess, onError } = useBookingActions()

  const { mutateAsync, isPending } = useCancelBooking(booking, {
    onError: (error) => onError(error, t('bookings.cancel_error')),
  })

  const handleCancel = async (e: React.MouseEvent) => {
    e.stopPropagation()
    await mutateAsync(bookingId)
    onSuccess(t('bookings.cancel_success'))
  }

  return (
    <Button leftIcon={<FiXCircle />} isLoading={isPending} colorScheme='red' variant='outline' onClick={handleCancel}>
      {t('bookings.cancel')}
    </Button>
  )
}

const AcceptedBookingActions = ({ booking }: ActionsProps) => {
  const bookingId = booking.id
  const { t } = useTranslation()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { onSuccess, onError, ratingModalDisclosure } = useBookingActions()

  const { mutateAsync, isPending } = useReturnBooking(booking, {
    onError: (error) => onError(error, t('bookings.return_error')),
  })

  const handleReturn = async () => {
    try {
      await mutateAsync(bookingId)
      onSuccess(t('bookings.return_success'))
      onClose()
      ratingModalDisclosure.onOpen() // Open rating modal after successful return
    } catch (error) {
      // Error is already handled by the mutation's onError
      onClose()
    }
  }

  return (
    <>
      <Button
        leftIcon={<FiCheck />}
        colorScheme='green'
        variant='outline'
        onClick={(e) => {
          e.stopPropagation()
          onOpen()
        }}
      >
        {t('bookings.mark_as_returned')}
      </Button>
      <ReturnAlertDialog
        isLoading={isPending}
        isOpen={isOpen}
        onClose={onClose}
        onConfirm={handleReturn}
        endDate={booking.endDate}
      />
    </>
  )
}

const NomadAcceptedBookingActions = ({ booking }: ActionsProps) => {
  const bookingId = booking.id
  const { t } = useTranslation()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { onSuccess, onError, ratingModalDisclosure } = useBookingActions()

  const { mutateAsync, isPending } = usePickedBooking(booking, {
    onError: (error) => onError(error, t('bookings.picked_error', { defaultValue: 'Error marking as picked' })),
  })

  const handlePicked = async () => {
    try {
      await mutateAsync(bookingId)
      onSuccess(t('bookings.picked_success', { defaultValue: 'Tool marked as picked successfully' }))
      onClose()
    } catch (error) {
      // Error is already handled by the mutation's onError
      onClose()
    }
  }

  return (
    <>
      <Button
        leftIcon={<FiCheck />}
        colorScheme='blue'
        variant='outline'
        onClick={(e) => {
          e.stopPropagation()
          onOpen()
        }}
      >
        {t('bookings.mark_as_picked', { defaultValue: 'Mark as picked' })}
      </Button>
      <PickedAlertDialog
        isLoading={isPending}
        isOpen={isOpen}
        onClose={onClose}
        onConfirm={handlePicked}
        endDate={booking.endDate}
      />
    </>
  )
}

const RateUserBookingActions = ({ booking }: ActionsProps) => {
  const { t } = useTranslation()
  const { ratingModalDisclosure } = useBookingActions()

  if (!booking?.ratings) {
    return null
  }

  let text = t('rating.rate_user')
  if (booking.isRated) {
    text = t('rating.already_rated')
  }

  return (
    <Button
      disabled={booking.isRated}
      leftIcon={icons.ratings({})}
      variant='outline'
      onClick={(e) => {
        e.stopPropagation()
        ratingModalDisclosure.onOpen()
      }}
    >
      {text}
    </Button>
  )
}

type ActionButtonsProps = {
  type: 'request' | 'petition'
} & ActionsProps

export const ActionButtons = ({ booking, type }: ActionButtonsProps) => {
  const {
    ratingModalDisclosure: { isOpen, onClose },
  } = useBookingActions()

  if (!booking) return null

  let component = null
  if (booking.bookingStatus === BookingStatus.PENDING && type === 'request') {
    component = <PendingRequestActions booking={booking} />
  } else if (booking.bookingStatus === BookingStatus.PENDING && type === 'petition') {
    component = <PendingPetitionActions booking={booking} />
  } else if (booking.bookingStatus === BookingStatus.ACCEPTED && type === 'request') {
    if (booking?.isNomadic) {
      component = <NomadAcceptedBookingActions booking={booking} />
    } else {
      component = <AcceptedBookingActions booking={booking} />
    }
  } else if (booking.bookingStatus === BookingStatus.RETURNED || booking.bookingStatus === BookingStatus.PICKED) {
    component = <RateUserBookingActions booking={booking} />
  }

  return (
    <>
      {component}
      <RatingModal isOpen={isOpen} onClose={onClose} booking={booking} />
    </>
  )
}
