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
import { CHAT_REFETCH_INTERVAL, CONVERSATIONS_REFETCH_INTERVAL } from '~utils/constants'
import type { DefinedInitialDataInfiniteOptions } from '@tanstack/react-query/src/infiniteQueryOptions'

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
export const useChatMessages = (
  conversationWith: string,
  options: Omit<
    DefinedInitialDataInfiniteOptions<
      PaginatedMessagesResponse & PaginationInfo,
      Error,
      InfiniteData<PaginatedMessagesResponse & PaginationInfo, unknown>
    >,
    'queryFn' | 'queryKey' | 'getNextPageParam' | 'enabled' | 'initialPageParam'
  > = { initialData: undefined }
) => {
  const { user } = useAuth()
  return useInfiniteQuery({
    queryKey: MessageKeys.chat(generateChatKey(conversationWith, user.id)),
    queryFn: ({ pageParam = 0 }) => {
      const params: GetMessagesParams = {
        type: 'private',
        conversationWith,
        page: pageParam as number,
        pageSize: 10,
      }
      return messages.getMessages(params)
    },
    getNextPageParam: (lastPage) => {
      const { current, pages } = lastPage.pagination
      return current < pages - 1 ? current + 1 : undefined
    },
    enabled: !!conversationWith,
    refetchInterval: CHAT_REFETCH_INTERVAL,
    initialPageParam: 0,
    ...options,
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
    mutationFn: (data: MarkMessagesReadRequest & { conversationKey: string }) =>
      messages.markMessagesAsRead({ messageIds: data.messageIds }),
    onSuccess: (_, variables) => {
      const { messageIds, conversationKey } = variables

      // Update the chat messages cache directly instead of invalidating
      // Needed to do not await the server response, to avoid resending the mutation.
      queryClient.setQueryData<InfiniteData<PaginatedMessagesResponse & PaginationInfo>>(
        MessageKeys.chat(conversationKey),
        (old) => {
          if (!old) return old
          // Update messages in all pages to mark them as read
          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              messages: page.messages.map((message) =>
                messageIds.includes(message.id) ? { ...message, isRead: true } : message
              ),
            })),
          }
        }
      )

      // Invalidate unread counts
      queryClient.invalidateQueries({ queryKey: MessageKeys.unreadCounts })

      // Invalidate conversations to update unread counts
      queryClient.invalidateQueries({ queryKey: MessageKeys.conversations })
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
