import { InfiniteData, useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { messages, PaginationInfo } from '~src/services/api'
import { useAuth } from '~components/Auth/AuthContext'
import {
  GetConversationsParams,
  GetMessagesParams,
  MarkConversationReadRequest,
  MarkMessagesReadRequest,
  MessageType,
  PaginatedMessagesResponse,
  SearchMessagesParams,
  SendMessageRequest,
} from './types'
import { useCallback } from 'react'
import { CONVERSATIONS_REFETCH_INTERVAL } from '~utils/constants'

// Helper function to generate conversation key for private messages
export const generateChatKey = (userId1: string, userId2: string): string => {
  const sortedIds = [userId1, userId2].sort()
  return `private:${sortedIds[0]}:${sortedIds[1]}`
}

export const MessageKeys = {
  // Base keys
  all: ['messages'] as const,
  conversations: ['messages', 'conversations'] as const,
  unreadCounts: ['messages', 'unread'] as const,

  // Specific message queries
  messages: (params: GetMessagesParams) => ['messages', 'list', params] as const,
  chat: (userId: string, page?: number) => ['messages', 'chat', userId, page] as const,
  search: (params: SearchMessagesParams) => ['messages', 'search', params] as const,

  // Conversation queries
  conversationsList: (params: GetConversationsParams) => ['messages', 'conversations', 'list', params] as const,
}

// Get messages for a specific private conversation (infinite query)
export const useChatMessages = (conversationWith: string) => {
  const { user } = useAuth()
  return useInfiniteQuery({
    queryKey: MessageKeys.chat(generateChatKey(conversationWith, user.id)),
    queryFn: ({ pageParam = 0 }) => {
      const params: GetMessagesParams = {
        type: 'private',
        conversationWith,
        page: pageParam,
        pageSize: 10,
      }
      return messages.getMessages(params)
    },
    getNextPageParam: (lastPage) => {
      const { current, pages } = lastPage.pagination
      return current < pages - 1 ? current + 1 : undefined
    },
    enabled: !!conversationWith,
    refetchInterval: CONVERSATIONS_REFETCH_INTERVAL,
    initialPageParam: 0,
  })
}

// Get conversations list (infinite query)
export const useConversations = (type: MessageType | 'all' = 'private') => {
  return useInfiniteQuery({
    queryKey: MessageKeys.conversationsList({ type }),
    queryFn: ({ pageParam = 0 }) => {
      const params: GetConversationsParams = {
        type,
        page: pageParam,
        pageSize: 1,
      }
      return messages.getConversations(params)
    },
    refetchInterval: CONVERSATIONS_REFETCH_INTERVAL,
    getNextPageParam: (lastPage) => {
      const { current, pages } = lastPage.pagination
      return current < pages - 1 ? current + 1 : undefined
    },
    initialPageParam: 0,
  })
}

// Get unread message counts
export const useUnreadMessageCounts = () => {
  const { isAuthenticated } = useAuth()

  return useQuery({
    queryKey: MessageKeys.unreadCounts,
    queryFn: () => messages.getUnreadCounts(),
    enabled: isAuthenticated,
    refetchInterval: CONVERSATIONS_REFETCH_INTERVAL,
  })
}

// Search messages with infinite query
export const useSearchMessages = (searchTerm: string, type: MessageType = 'private') => {
  return useInfiniteQuery({
    queryKey: MessageKeys.search({ q: searchTerm, type }),
    queryFn: ({ pageParam = 0 }) => {
      const params: SearchMessagesParams = {
        q: searchTerm,
        type,
        page: pageParam,
        pageSize: 20,
      }
      return messages.searchMessages(params)
    },
    getNextPageParam: (lastPage) => {
      const { current, pages } = lastPage.pagination
      return current < pages - 1 ? current + 1 : undefined
    },
    enabled: !!searchTerm && searchTerm.length > 0,
    initialPageParam: 0,
  })
}

// Send a message
export const useSendMessage = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: SendMessageRequest) => messages.sendMessage(data),
    onSuccess: (newMessage, variables) => {
      const queryKey = MessageKeys.chat(generateChatKey(newMessage.recipientId, newMessage.senderId))
      queryClient.invalidateQueries({
        queryKey,
      })
      queryClient.setQueryData<InfiniteData<PaginatedMessagesResponse & PaginationInfo>>(queryKey, (old) => {
        if (!old) return old
        return {
          ...old,
          pages: old.pages.map((page, i) =>
            i === 0
              ? {
                  ...page,
                  messages: [newMessage, ...page.messages], // Add new message to the start of the first page
                }
              : page
          ),
        }
      })
    },
  })
}

// Mark messages as read
export const useMarkMessagesAsRead = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: MarkMessagesReadRequest) => messages.markMessagesAsRead(data),
    onSuccess: () => {
      // Invalidate unread counts
      queryClient.invalidateQueries({ queryKey: MessageKeys.unreadCounts })

      // Invalidate conversations to update unread counts
      queryClient.invalidateQueries({ queryKey: MessageKeys.conversations })

      // Invalidate all message queries to update read status
      queryClient.invalidateQueries({ queryKey: MessageKeys.all })
    },
  })
}

// Mark entire conversation as read
export const useMarkChatAsRead = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: MarkConversationReadRequest) => messages.markConversationAsRead(data),
    onSuccess: (_, variables) => {
      variables.conversationKey
      queryClient.invalidateQueries({ queryKey: MessageKeys.unreadCounts })
      queryClient.invalidateQueries({ queryKey: MessageKeys.conversations })
      queryClient.invalidateQueries({ queryKey: MessageKeys.chat(variables.conversationKey) })
    },
  })
}

// Custom hook to mark conversation as read when user enters it
export const useMarkChatAsReadOnEnter = (otherUserId: string) => {
  const { user } = useAuth()
  const markAsRead = useMarkChatAsRead()

  return useCallback(() => {
    if (user?.id && otherUserId) {
      const conversationKey = generateChatKey(user.id, otherUserId)
      markAsRead.mutate({ conversationKey })
    }
  }, [otherUserId])
}
