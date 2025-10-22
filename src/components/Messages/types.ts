// Message types based on the API documentation
export type ChatType = 'private' | 'community' | 'general'
// Conversations types
export type ConversationsListTypes = ChatType | 'all'

export interface SendMessageRequest {
  type: ChatType
  recipientId?: string // Required for private messages
  content?: string // Required if no images
  images?: string[] // Array of image hashes, max 10
  replyToId?: string // Optional, for threaded replies (future feature)
}

export interface MessageResponse {
  id: string
  type: ChatType
  senderId: string
  senderName: string
  senderAvatarHash?: string
  recipientId?: string // For private messages
  recipientName?: string // For private messages
  content?: string
  images?: string[]
  createdAt: string // ISO date string
  isRead: boolean
}

export interface ConversationParticipant {
  id: string
  name: string
  avatarHash?: string
  rating?: number
  active: boolean
}

export type ConversationResponse = PrivateConversation | CommunityConversation | GeneralConversation

export type BaseConversation = {
  id: string
  lastMessage?: MessageResponse
  unreadCount: number
  messageCount: number
  lastMessageTime: string // ISO date string
}

export type PrivateConversation = {
  type: 'private'
  participants: ConversationParticipant[]
} & BaseConversation

export type GeneralConversation = {
  type: 'general'
} & BaseConversation

export type CommunityConversation = {
  type: 'community'
  communityId?: string
  community: {
    id: string
    name: string
    image?: string
  }
} & BaseConversation

export interface UnreadMessageSummary {
  total: number
  private: number
  communities: Record<string, number> // community ID -> unread count
  generalForum: number
}

export interface MarkMessagesReadRequest {
  messageIds: string[]
}

export interface MarkConversationReadRequest {
  conversationKey: string
}

export interface PaginatedMessagesResponse {
  messages: MessageResponse[]
}

export interface PaginatedConversationsResponse {
  conversations: ConversationResponse[]
}

// Query parameters for getting messages
export interface GetMessagesParams {
  page?: number
  pageSize?: number
  type?: ChatType
  conversationWith?: string // User ID for private conversations
  unreadOnly?: boolean
}

// Query parameters for getting conversations
export interface GetConversationsParams {
  page?: number
  pageSize?: number
  type?: ConversationsListTypes
}

// Query parameters for searching messages
export interface SearchMessagesParams {
  q: string // Search query
  type?: ChatType
  page?: number
  pageSize?: number
}
