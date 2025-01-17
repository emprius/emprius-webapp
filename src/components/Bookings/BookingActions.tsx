import { useTranslation } from 'react-i18next'
import { Booking, BookingStatus, useReturnBooking, useUpdateBookingStatus } from '~components/Bookings/bookingsQueries'
import { useQueryClient } from '@tanstack/react-query'
import { Button, useDisclosure } from '@chakra-ui/react'
import { FiCheck, FiStar, FiThumbsDown, FiThumbsUp } from 'react-icons/fi'
import { RatingModal } from '~components/Ratings/RatingModal'
import React from 'react'

interface ActionsProps {
  bookingId: string
}

const PendingRequestActions = ({ bookingId }: ActionsProps) => {
  const { t } = useTranslation()
  const updateBookingStatus = useUpdateBookingStatus()
  const client = useQueryClient()

  const handleStatusUpdate = (status: 'ACCEPTED' | 'CANCELLED') => {
    updateBookingStatus.mutate({
      bookingId,
      status,
    })
  }

  return (
    <>
      <Button
        leftIcon={<FiThumbsUp />}
        colorScheme='green'
        variant='outline'
        onClick={() => handleStatusUpdate('ACCEPTED')}
      >
        {t('bookings.approve')}
      </Button>
      <Button
        leftIcon={<FiThumbsDown />}
        colorScheme='red'
        variant='outline'
        onClick={() => handleStatusUpdate('CANCELLED')}
      >
        {t('bookings.deny')}
      </Button>
    </>
  )
}

const PendingPetitionActions = ({ bookingId }: ActionsProps) => {
  const { t } = useTranslation()
  const updateBookingStatus = useUpdateBookingStatus()

  const handleCancel = () => {
    updateBookingStatus.mutate({
      bookingId,
      status: 'CANCELLED',
    })
  }

  return (
    <Button leftIcon={<FiThumbsDown />} colorScheme='red' variant='outline' onClick={handleCancel}>
      {t('bookings.cancel')}
    </Button>
  )
}

interface AcceptedBookingActionsProps {
  bookingId: string
}

const AcceptedBookingActions = ({ bookingId }: AcceptedBookingActionsProps) => {
  const { t } = useTranslation()
  const returnBooking = useReturnBooking()

  const handleReturn = () => {
    returnBooking.mutate(bookingId)
  }

  return (
    <Button leftIcon={<FiCheck />} colorScheme='green' variant='outline' onClick={handleReturn}>
      {t('bookings.markAsReturned')}
    </Button>
  )
}

const ReturnedBookingActions = ({ bookingId }: ActionsProps) => {
  const { t } = useTranslation()
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <>
      <Button leftIcon={<FiStar />} variant='outline' onClick={() => onOpen()}>
        {t('rating.rateTool')}
      </Button>
      <RatingModal
        isOpen={isOpen}
        onClose={() => {
          onClose()
        }}
        bookingId={bookingId}
      />
    </>
  )
}

interface ActionButtonsProps {
  booking: Booking
  type: 'request' | 'petition'
}

export const ActionButtons = ({ booking, type }: ActionButtonsProps) => {
  if (booking.bookingStatus === BookingStatus.PENDING && type === 'request') {
    return <PendingRequestActions bookingId={booking.id} />
  }

  if (booking.bookingStatus === BookingStatus.PENDING && type === 'petition') {
    return <PendingPetitionActions bookingId={booking.id} />
  }

  if (booking.bookingStatus === BookingStatus.ACCEPTED) {
    return <AcceptedBookingActions bookingId={booking.id} />
  }

  if (booking.bookingStatus === BookingStatus.RETURNED) {
    return <ReturnedBookingActions bookingId={booking.id} />
  }

  return null
}
