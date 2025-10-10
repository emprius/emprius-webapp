import React, { useState } from 'react'
import { Button, ButtonGroup, Center, HStack, useColorModeValue, VStack } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { ElementNotFound } from '~components/Layout/ElementNotFound'
import { LoadingSpinner } from '~components/Layout/LoadingSpinner'
import { useConversations, useSearchMessages } from './queries'
import { ChatType, ConversationsListTypes } from './types'
import { useAuth } from '~components/Auth/AuthContext'
import { ROUTES } from '~src/router/routes'
import LoadMoreButton from '~components/Layout/Pagination/LoadMoreButton'
import { SearchAndPagination } from '~components/Layout/Search/SearchAndPagination'
import { DebouncedSearchBar } from '~components/Layout/Search/DebouncedSearchBar'
import { useDebouncedSearch } from '~components/Layout/Search/DebouncedSearchContext'
import { ConversationListItem } from '~components/Messages/ConversationListItem'

export const ConversationsList = () => {
  const { t } = useTranslation()
  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')
  const [selectedType, setSelectedType] = useState<ConversationsListTypes>('all')

  return (
    <SearchAndPagination>
      <VStack spacing={4} w='full' mb={4}>
        <HStack bg={bgColor} borderColor={borderColor} borderRadius='2xl' flex={1} w='full'>
          <DebouncedSearchBar placeholder={t('messages.search_messages', { defaultValue: 'Search messages...' })} />
        </HStack>
        <ChatTypeSelector selectedType={selectedType} setSelectedType={setSelectedType} />
      </VStack>
      <ConversationsListContent selectedType={selectedType} />
    </SearchAndPagination>
  )
}

interface ConversationsListContentProps {
  selectedType: ConversationsListTypes
}

const ConversationsListContent = ({ selectedType }: ConversationsListContentProps) => {
  const { debouncedSearch } = useDebouncedSearch()

  const hasSearchTerm = !!debouncedSearch && debouncedSearch.length > 0

  if (hasSearchTerm) {
    return <SearchResultsLayout selectedType={selectedType} />
  }

  return <ConversationsLayout selectedType={selectedType} />
}

interface ConversationsLayoutProps {
  selectedType: ConversationsListTypes
}

const ConversationsLayout = ({ selectedType }: ConversationsLayoutProps) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { user } = useAuth()

  const {
    data: conversationsData,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useConversations(selectedType)

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (error) {
    return (
      <Center py={8}>
        <ElementNotFound
          title={t('messages.error.load_conversations_failed', {
            defaultValue: 'Failed to load conversations',
          })}
          desc={t('messages.error.load_conversations_failed_desc', {
            defaultValue: 'There was an error loading your conversations. Please try again.',
          })}
        />
      </Center>
    )
  }

  const conversations = conversationsData?.pages?.flatMap((page) => page.conversations) || []

  if (!conversations.length) {
    return (
      <Center py={8}>
        <VStack spacing={4}>
          <ElementNotFound
            title={t('messages.no_conversations', { defaultValue: 'No conversations yet' })}
            desc={t('messages.no_conversations_desc', {
              defaultValue: 'Start a conversation by messaging someone from the users list.',
            })}
          />
          <Button onClick={() => navigate(ROUTES.USERS.LIST)} colorScheme='blue'>
            {t('messages.find_users', { defaultValue: 'Find Users' })}
          </Button>
        </VStack>
      </Center>
    )
  }

  return (
    <VStack spacing={0} align='stretch'>
      {conversations.map((conversation) => {
        // Skip conversations without a last message
        if (!conversation.lastMessage) {
          return null
        }

        // Handle community conversations
        if (conversation.type === 'community') {
          return (
            <ConversationListItem
              key={conversation.id}
              message={conversation.lastMessage}
              otherParticipant={{ avatarHash: conversation.community.image, ...conversation.community }}
              unreadCount={conversation.unreadCount}
              conversationType='community'
            />
          )
        }

        // Handle private conversations
        const participant = conversation.participants?.find((p) => p.id !== user?.id)
        if (!participant) {
          return null
        }

        return (
          <ConversationListItem
            key={conversation.id}
            message={conversation.lastMessage}
            otherParticipant={participant}
            unreadCount={conversation.unreadCount}
            conversationType='private'
          />
        )
      })}

      {hasNextPage && (
        <Center py={4}>
          <LoadMoreButton fetchNextPage={fetchNextPage} isFetchingNextPage={isFetchingNextPage} />
        </Center>
      )}
    </VStack>
  )
}

interface SearchResultsLayoutProps {
  selectedType: ChatType | 'all'
}

const SearchResultsLayout = ({ selectedType }: SearchResultsLayoutProps) => {
  const { t } = useTranslation()
  const { user } = useAuth()
  const { searchTerm } = useDebouncedSearch()

  // Map 'all' to undefined for the search API (searches across all types when type is not specified)
  const searchType = selectedType === 'all' ? undefined : selectedType

  const {
    data: searchData,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useSearchMessages(searchTerm, searchType)

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (error) {
    return (
      <Center py={8}>
        <ElementNotFound
          title={t('messages.error.load_conversations_failed', {
            defaultValue: 'Failed to load conversations',
          })}
          desc={t('messages.error.load_conversations_failed_desc', {
            defaultValue: 'There was an error loading your conversations. Please try again.',
          })}
        />
      </Center>
    )
  }

  const searchResults = searchData?.pages?.flatMap((page) => page.messages) || []

  if (!searchResults.length) {
    return (
      <Center py={8}>
        <ElementNotFound
          title={t('messages.no_search_results', { defaultValue: 'No messages found' })}
          desc={t('messages.no_search_results_desc', {
            defaultValue: "Try adjusting your search terms to find what you're looking for.",
          })}
        />
      </Center>
    )
  }

  return (
    <VStack spacing={0} align='stretch'>
      {searchResults.map((message) => {
        // Determine the other participant based on sender/recipient
        const isCurrentUserSender = message.senderId === user?.id
        const otherParticipant = {
          id: isCurrentUserSender ? message.recipientId! : message.senderId,
          name: isCurrentUserSender ? message.recipientName || 'Unknown User' : message.senderName,
        }

        return (
          <ConversationListItem
            key={message.id}
            message={message}
            otherParticipant={otherParticipant}
            unreadCount={0} // Search results don't show unread counts
          />
        )
      })}

      {hasNextPage && (
        <Center py={4}>
          <LoadMoreButton fetchNextPage={fetchNextPage} isFetchingNextPage={isFetchingNextPage} />
        </Center>
      )}
    </VStack>
  )
}

const ChatTypeSelector = ({
  selectedType,
  setSelectedType,
}: {
  selectedType: ConversationsListTypes
  setSelectedType: (type: ConversationsListTypes) => void
}) => {
  const { t } = useTranslation()
  return (
    <ButtonGroup size='sm' variant='ghost'>
      <Button onClick={() => setSelectedType('all')} variant={selectedType === 'all' ? 'solid' : 'outline'}>
        {t('messages.filter.all', { defaultValue: 'All' })}
      </Button>
      <Button onClick={() => setSelectedType('private')} variant={selectedType === 'private' ? 'solid' : 'outline'}>
        {t('messages.filter.private', { defaultValue: 'Private' })}
      </Button>
      <Button onClick={() => setSelectedType('community')} variant={selectedType === 'community' ? 'solid' : 'outline'}>
        {t('messages.filter.community', { defaultValue: 'Community' })}
      </Button>
    </ButtonGroup>
  )
}
