import React, { createContext, useContext } from 'react'
import { useQuery } from '@tanstack/react-query'
import { users } from '../../../services/api'
import { useAuth } from '~components/Auth/AuthContext'

export type ProfilePendings = {
  pendingRatingsCount: number
  pendingRequestsCount: number
  pendingInvitesCount: number
}

type PendingActionsContextType = {
  isLoading: boolean
} & ProfilePendings

const PendingActionsContext = createContext<PendingActionsContextType>({
  pendingRatingsCount: 0,
  pendingRequestsCount: 0,
  pendingInvitesCount: 0,
  isLoading: false,
})

export const usePendingActions = () => useContext(PendingActionsContext)

export const PendingActionsKeys = ['pendingActions']

export const PendingActionsProvider = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth()
  const { data, isLoading } = useQuery({
    queryKey: PendingActionsKeys,
    queryFn: () => users.getPendingActions(),
    refetchInterval: 30000, // Refetch every 30 seconds
    enabled: isAuthenticated,
  })

  const value = {
    pendingRatingsCount: data?.pendingRatingsCount ?? 0,
    pendingRequestsCount: data?.pendingRequestsCount ?? 0,
    pendingInvitesCount: data?.pendingInvitesCount ?? 0,
    isLoading,
  }

  return <PendingActionsContext.Provider value={value}>{children}</PendingActionsContext.Provider>
}
