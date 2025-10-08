import React, { createContext, useContext } from 'react'
import { useUnreadMessageCounts } from './queries'

type UnreadMessagesContextType = {
  unreadCount: number
  privateCount: number
  generalForumCount: number
  communitiesCount: Record<string, number>
  isLoading: boolean
}

const UnreadMessagesContext = createContext<UnreadMessagesContextType>({
  unreadCount: 0,
  privateCount: 0,
  generalForumCount: 0,
  communitiesCount: {},
  isLoading: false,
})

export const useUnreadMessages = () => useContext(UnreadMessagesContext)

export const UnreadMessagesProvider = ({ children }: { children: React.ReactNode }) => {
  const { data, isLoading } = useUnreadMessageCounts()

  const value = {
    unreadCount: data?.total ?? 0,
    privateCount: data?.private ?? 0,
    generalForumCount: data?.generalForum ?? 0,
    communitiesCount: data?.communities ?? {},
    isLoading,
  }

  return <UnreadMessagesContext.Provider value={value}>{children}</UnreadMessagesContext.Provider>
}
