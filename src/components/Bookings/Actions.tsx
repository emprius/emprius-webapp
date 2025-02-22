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

const AcceptedBookingActions = ({ booking, onOpen: onOpenRatingModal }: { onOpen: () => void } & ActionsProps) => {
  const bookingId = booking.id
  const { t } = useTranslation()
  const toast = useToast()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { mutateAsync, isPending } = useReturnBooking({
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
      <Button leftIcon={<FiCheck />} colorScheme='green' variant='outline' onClick={onOpen}>
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
  const { t } = useTranslation()

  const isRated = booking.isRated
  let text = t('rating.rate_user')
  if (isRated) {
    text = t('rating.already_rated')
  }

  return (
    <Button disabled={isRated} leftIcon={icons.ratings({})} variant='outline' onClick={() => onOpen()}>
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
  let component = null

  if (booking.bookingStatus === BookingStatus.PENDING && type === 'request') {
    component = <PendingRequestActions booking={booking} />
  }

  if (booking.bookingStatus === BookingStatus.PENDING && type === 'petition') {
    component = <PendingPetitionActions booking={booking} />
  }

  if (booking.bookingStatus === BookingStatus.ACCEPTED && type === 'request') {
    component = <AcceptedBookingActions booking={booking} onOpen={onOpen} />
  }

  if (booking.bookingStatus === BookingStatus.RETURNED) {
    component = <ReturnedBookingActions booking={booking} onOpen={onOpen} />
  }

  return (
    <>
      {component}
      <RatingModal isOpen={isOpen} onClose={onClose} booking={booking} />
    </>
  )
}
