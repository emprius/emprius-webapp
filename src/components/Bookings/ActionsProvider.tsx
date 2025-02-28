// Create a context for booking actions
import React, { createContext, useContext, useState } from 'react'
import { useDisclosure, useToast } from '@chakra-ui/react'

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
