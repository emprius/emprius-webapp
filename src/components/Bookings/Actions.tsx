import { useTranslation } from 'react-i18next'
import {
  Booking,
  BookingStatus,
  useAcceptBooking,
  useCancelBooking,
  useDenyBooking,
  useReturnBooking,
} from '~components/Bookings/queries'
import { Button, useDisclosure, useToast } from '@chakra-ui/react'
import { FiCheck, FiThumbsDown, FiThumbsUp, FiXCircle } from 'react-icons/fi'
import { RatingModal } from '~components/Ratings/Modal'
import React from 'react'
import { icons } from '~theme/icons'

interface ActionsProps {
  booking: Booking
}

const PendingRequestActions = ({ booking }: ActionsProps) => {
  const bookingId = booking.id
  const { t } = useTranslation()
  const toast = useToast()

  const { mutateAsync: acceptBooking, isPending: isAcceptPending } = useAcceptBooking({
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
  const { mutateAsync: denyBooking, isPending: isDenyPending } = useDenyBooking({
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

  const handleDeny = async () => {
    await denyBooking(bookingId).then(() => {
      toast({
        title: t('bookings.deny_success'),
        status: 'success',
        isClosable: true,
      })
    })
  }

  const handleApprove = async () => {
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
  const { mutateAsync, isPending } = useCancelBooking({
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

  const handleCancel = () => {
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

const AcceptedBookingActions = ({ booking }: ActionsProps) => {
  const bookingId = booking.id
  const { t } = useTranslation()
  const toast = useToast()
  const { mutateAsync } = useReturnBooking({
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
    mutateAsync(bookingId).then(() => {
      toast({
        title: t('bookings.return_success'),
        status: 'success',
        isClosable: true,
      })
    })
  }

  return (
    <Button leftIcon={<FiCheck />} colorScheme='green' variant='outline' onClick={handleReturn}>
      {t('bookings.mark_as_returned')}
    </Button>
  )
}

const ReturnedBookingActions = ({ booking }: ActionsProps) => {
  const { t } = useTranslation()
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <>
      <Button leftIcon={icons.ratings({})} variant='outline' onClick={() => onOpen()}>
        {t('rating.rate_user')}
      </Button>
      <RatingModal
        isOpen={isOpen}
        onClose={() => {
          onClose()
        }}
        booking={booking}
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
    return <PendingRequestActions booking={booking} />
  }

  if (booking.bookingStatus === BookingStatus.PENDING && type === 'petition') {
    return <PendingPetitionActions booking={booking} />
  }

  if (booking.bookingStatus === BookingStatus.ACCEPTED && type === 'request') {
    return <AcceptedBookingActions booking={booking} />
  }

  if (booking.bookingStatus === BookingStatus.RETURNED) {
    return <ReturnedBookingActions booking={booking} />
  }

  return null
}
