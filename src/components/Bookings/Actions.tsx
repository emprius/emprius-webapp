import { Button, useDisclosure, useToast } from '@chakra-ui/react'
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
} from '~components/Bookings/queries'
import { RatingModal, ReturnAlertDialog } from '~components/Ratings/Modal'
import { icons } from '~theme/icons'
import { useAuth } from '~components/Auth/AuthContext'

interface ActionsProps {
  booking: Booking
}

const PendingRequestActions = ({ booking }: ActionsProps) => {
  const bookingId = booking.id
  const { t } = useTranslation()
  const toast = useToast()

  const { mutateAsync: acceptBooking, isPending: isAcceptPending } = useAcceptBooking(booking, {
    onError: (error) => {
      // Show toast error
      toast({
        title: t('bookings.accept_error'),
        status: 'error',
        isClosable: true,
      })
      console.error(error)
    },
  })
  const { mutateAsync: denyBooking, isPending: isDenyPending } = useDenyBooking(booking, {
    onError: (error) => {
      // Show toast error
      toast({
        title: t('bookings.deny_error'),
        status: 'error',
        isClosable: true,
      })
      console.error(error)
    },
  })

  const handleDeny = async (e: React.MouseEvent) => {
    e.stopPropagation()
    await denyBooking(bookingId).then(() => {
      toast({
        title: t('bookings.deny_success'),
        status: 'success',
        isClosable: true,
      })
    })
  }

  const handleApprove = async (e: React.MouseEvent) => {
    e.stopPropagation()
    await acceptBooking(bookingId).then(() => {
      toast({
        title: t('bookings.approve_success'),
        status: 'success',
        isClosable: true,
      })
    })
  }

  const isPending = isDenyPending || isDenyPending

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
  const toast = useToast()
  const { mutateAsync, isPending } = useCancelBooking(booking, {
    onError: (error) => {
      // Show toast error
      toast({
        title: t('bookings.cancel_error'),
        status: 'error',
        isClosable: true,
      })
      console.error(error)
    },
  })

  const handleCancel = (e: React.MouseEvent) => {
    e.stopPropagation()
    mutateAsync(bookingId).then(() => {
      toast({
        title: t('bookings.cancel_success'),
        status: 'success',
        isClosable: true,
      })
    })
  }

  return (
    <Button leftIcon={<FiXCircle />} isLoading={isPending} colorScheme='red' variant='outline' onClick={handleCancel}>
      {t('bookings.cancel')}
    </Button>
  )
}

const AcceptedBookingActions = ({ booking, onOpen: onOpenRatingModal }: { onOpen: () => void } & ActionsProps) => {
  const bookingId = booking.id
  const { t } = useTranslation()
  const toast = useToast()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { mutateAsync, isPending } = useReturnBooking(booking, {
    onError: (error) => {
      // Show toast error
      toast({
        title: t('bookings.return_error'),
        status: 'error',
        isClosable: true,
      })
      console.error(error)
    },
  })

  const handleReturn = () => {
    mutateAsync(bookingId)
      .then(() => {
        toast({
          title: t('bookings.return_success'),
          status: 'success',
          isClosable: true,
        })
        onClose()
        onOpenRatingModal() // Open rating modal after successful return
      })
      .catch(() => {
        onClose()
      })
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

const ReturnedBookingActions = ({ booking, onOpen }: { onOpen: () => void } & ActionsProps) => {
  const { user } = useAuth()
  const { t } = useTranslation()

  if (!booking?.ratings) {
    return null
  }

  const isRated = booking.ratings.some((rating) => rating.fromUserId === user.id)

  let text = t('rating.rate_user')
  if (isRated) {
    text = t('rating.already_rated')
  }

  return (
    <Button
      disabled={isRated}
      leftIcon={icons.ratings({})}
      variant='outline'
      onClick={(e) => {
        e.stopPropagation()
        onOpen()
      }}
    >
      {text}
    </Button>
  )
}

interface ActionButtonsProps {
  booking: Booking
  type: 'request' | 'petition'
}

export const ActionButtons = ({ booking, type }: ActionButtonsProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  if (!booking) return null

  if (booking.bookingStatus === BookingStatus.PENDING && type === 'request') {
    return <PendingRequestActions booking={booking} />
  }

  if (booking.bookingStatus === BookingStatus.PENDING && type === 'petition') {
    return <PendingPetitionActions booking={booking} />
  }

  let component = null
  if (booking.bookingStatus === BookingStatus.ACCEPTED && type === 'request') {
    component = <AcceptedBookingActions booking={booking} onOpen={onOpen} />
  } else if (booking.bookingStatus === BookingStatus.RETURNED) {
    component = <ReturnedBookingActions booking={booking} onOpen={onOpen} />
  }

  return (
    <>
      {component}
      <RatingModal isOpen={isOpen} onClose={onClose} booking={booking} />
    </>
  )
}
