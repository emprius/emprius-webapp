import {Button, useDisclosure, useToast} from '@chakra-ui/react'
import React, {createContext, useContext, useState} from 'react'
import {useTranslation} from 'react-i18next'
import {FiCheck, FiThumbsDown, FiThumbsUp, FiXCircle} from 'react-icons/fi'
import {
  Booking,
  BookingStatus,
  useAcceptBooking,
  useCancelBooking,
  useDenyBooking,
  useReturnBooking,
} from '~components/Bookings/queries'
import {RatingModal, ReturnAlertDialog} from '~components/Ratings/Modal'
import {icons} from '~theme/icons'
import {useAuth} from '~components/Auth/AuthContext'

// Create a context for booking actions
interface BookingActionsContextType {
  error: Error | null
  onSuccess: (message: string) => void
  onError: (error: Error, title: string) => void
  // Rating modal disclosure state
  ratingModalDisclosure: ReturnType<typeof useDisclosure>
}

const BookingActionsContext = createContext<BookingActionsContextType | undefined>(undefined)

// Provider component
export const BookingActionsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [error, setError] = useState<Error | null>()
  const toast = useToast()

  // Add rating modal disclosure
  const ratingModalDisclosure = useDisclosure()

  const onSuccess = (message: string) => {
    toast({
      title: message,
      status: 'success',
      isClosable: true,
    })
    setError(null)
  }

  const onError = (error: Error, title: string) => {
    toast({
      title: title,
      status: 'error',
      isClosable: true,
    })
    setError(error)
    console.error(error)
  }

  return (
    <BookingActionsContext.Provider
      value={{
        error,
        onSuccess,
        onError,
        ratingModalDisclosure,
      }}
    >
      {children}
    </BookingActionsContext.Provider>
  )
}

// Hook to use the booking actions context
export const useBookingActions = () => {
  const context = useContext(BookingActionsContext)
  if (context === undefined) {
    throw new Error('useBookingActions must be used within a BookingActionsProvider')
  }
  return context
}

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

const ReturnedBookingActions = ({ booking }: ActionsProps) => {
  const { user } = useAuth()
  const { t } = useTranslation()
  const { ratingModalDisclosure } = useBookingActions()

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
    component = <AcceptedBookingActions booking={booking} />
  } else if (booking.bookingStatus === BookingStatus.RETURNED) {
    component = <ReturnedBookingActions booking={booking} />
  }

  return (
    <>
      {component}
      <RatingModal isOpen={isOpen} onClose={onClose} booking={booking} />
    </>
  )
}
