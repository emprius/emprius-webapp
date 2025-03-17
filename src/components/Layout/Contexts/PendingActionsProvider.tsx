import React, { createContext, useContext } from 'react'
import { useQuery } from '@tanstack/react-query'
import { bookings } from '../../../services/api'
import { useAuth } from '~components/Auth/AuthContext'

export type BookingPendings = {
  pendingRatingsCount: number
  pendingRequestsCount: number
}

type PendingActionsContextType = {
  isLoading: boolean
} & BookingPendings

const PendingActionsContext = createContext<PendingActionsContextType>({
  pendingRatingsCount: 0,
  pendingRequestsCount: 0,
  isLoading: false,
})

export const usePendingActions = () => useContext(PendingActionsContext)

export const PendingActionsKeys = ['pendingActions']

export const PendingActionsProvider = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth()
  const { data, isLoading } = useQuery({
    queryKey: PendingActionsKeys,
    queryFn: () => bookings.getPendingActions(),
    refetchInterval: 30000, // Refetch every 30 seconds
    enabled: isAuthenticated,
  })

  const value = {
    pendingRatingsCount: data?.pendingRatingsCount ?? 0,
    pendingRequestsCount: data?.pendingRequestsCount ?? 0,
    isLoading,
  }

  return <PendingActionsContext.Provider value={value}>{children}</PendingActionsContext.Provider>
}
