import React from 'react'
import { Box, Flex, VStack, Text, Badge, useColorModeValue, Center, Button, HStack } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { UserAvatar } from '~components/Images/Avatar'
import { ElementNotFound } from '~components/Layout/ElementNotFound'
import { LoadingSpinner } from '~components/Layout/LoadingSpinner'
import { useConversations, useSearchMessagesInfinite } from './queries'
import { ConversationResponse, MessageResponse } from './types'
import { convertToDate } from '~utils/dates'
import { useAuth } from '~components/Auth/AuthContext'
import { ROUTES } from '~src/router/routes'
import LoadMoreButton from '~components/Layout/Pagination/LoadMoreButton'
import { SearchAndPagination } from '~components/Layout/Search/SearchAndPagination'
import { DebouncedSearchBar } from '~components/Layout/Search/DebouncedSearchBar'
import { useDebouncedSearch } from '~components/Layout/Search/DebouncedSearchContext'
import { ImagesGrid } from '~components/Images/ImagesGrid'

export const ConversationsList = () => {
  const { t } = useTranslation()
  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')

  return (
    <SearchAndPagination>
      <HStack bg={bgColor} borderColor={borderColor} borderRadius='2xl' flex={1} w='full' mb={4}>
        <DebouncedSearchBar placeholder={t('messages.search_messages', { defaultValue: 'Search messages...' })} />
      </HStack>
      <ConversationsListContent />
    </SearchAndPagination>
  )
}

const ConversationsListContent = () => {
  const { debouncedSearch } = useDebouncedSearch()

  const hasSearchTerm = !!debouncedSearch && debouncedSearch.length > 0

  if (hasSearchTerm) {
    return <SearchResultsLayout />
  }

  return <ConversationsLayout />
}

const ConversationsLayout = () => {
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
  } = useConversations('private')

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

        // Find the other participant
        const participant = conversation.participants?.find((p) => p.id !== user?.id)
        if (!participant) {
          return null
        }

        const otherParticipant = {
          id: participant.id,
          name: participant.name,
          avatarHash: participant.avatarHash,
        }

        return (
          <ConversationListItem
            key={conversation.id}
            message={conversation.lastMessage}
            otherParticipant={otherParticipant}
            unreadCount={conversation.unreadCount}
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

const SearchResultsLayout = () => {
  const { t } = useTranslation()
  const { user } = useAuth()
  const { searchTerm } = useDebouncedSearch()

  const {
    data: searchData,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useSearchMessagesInfinite(searchTerm, 'private')

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

interface ConversationListItemProps {
  message: MessageResponse
  otherParticipant: {
    id: string
    name: string
  }
  unreadCount?: number
  onClick?: (conversationWith: string) => void
}

const ConversationListItem = ({ message, otherParticipant, unreadCount = 0, onClick }: ConversationListItemProps) => {
  const { t } = useTranslation()
  const { user } = useAuth()
  const navigate = useNavigate()

  const bgColor = useColorModeValue('white', 'gray.800')
  const hoverBgColor = useColorModeValue('gray.50', 'gray.700')
  const borderColor = useColorModeValue('gray.200', 'gray.600')

  const messageTime = convertToDate(message.createdAt)

  const handleClick = () => {
    if (onClick) {
      onClick(otherParticipant.id)
    } else {
      navigate(ROUTES.MESSAGES.CHAT.replace(':userId', otherParticipant.id))
    }
  }

  return (
    <Box
      p={4}
      bg={bgColor}
      borderBottom='1px'
      borderColor={borderColor}
      cursor='pointer'
      _hover={{ bg: hoverBgColor }}
      onClick={handleClick}
    >
      <Flex align='center' gap={3}>
        <UserAvatar id={otherParticipant.id} size='md' linkProfile={false} />

        <Box flex={1} minW={0}>
          <Flex justify='space-between' align='start' mb={1}>
            <Text fontWeight='semibold' fontSize='md' noOfLines={1}>
              {otherParticipant.name}
            </Text>

            <Flex align='center' gap={2}>
              {messageTime && (
                <Text fontSize='xs' color='gray.500'>
                  {t('rating.rating_date', { date: convertToDate(messageTime) })}
                </Text>
              )}
            </Flex>
          </Flex>

          <HStack spacing={2} w='full' align='center'>
            <HStack spacing={2} w='full' align='center' justify={'space-between'}>
              <Text
                minW={0}
                fontSize='sm'
                color='gray.600'
                noOfLines={1}
                fontWeight={unreadCount > 0 ? 'medium' : 'normal'}
              >
                {message.senderId === user?.id && (
                  <Text as='span' color='lighterText'>
                    {t('messages.you', { defaultValue: 'You: ' })}
                  </Text>
                )}
                {message.content || (
                  <Text as='span' fontStyle='italic'>
                    {t('messages.no_content', { defaultValue: 'No content' })}
                  </Text>
                )}
              </Text>
              {message?.images && (
                <Box minW={0} overflow='hidden' alignItems={'end'} alignSelf={'end'}>
                  <ImagesGrid
                    images={message.images}
                    imageSize='25px'
                    spacing={1}
                    wrap={'nowrap'}
                    overflow={'hidden'}
                  />
                </Box>
              )}
            </HStack>

            {unreadCount > 0 && (
              <Badge colorScheme='red' borderRadius='full' px={2} flexShrink={0}>
                {unreadCount}
              </Badge>
            )}
          </HStack>
        </Box>
      </Flex>
    </Box>
  )
}
