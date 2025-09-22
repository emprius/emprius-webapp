import React from 'react'
import { Box, Flex, VStack, Text, Badge, useColorModeValue, Center, Button, HStack } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { UserAvatar } from '~components/Images/Avatar'
import { ElementNotFound } from '~components/Layout/ElementNotFound'
import { LoadingSpinner } from '~components/Layout/LoadingSpinner'
import { useConversations } from './queries'
import { ConversationResponse } from './types'
import { convertToDate } from '~utils/dates'
import { useAuth } from '~components/Auth/AuthContext'
import { ROUTES } from '~src/router/routes'

export interface ConversationsListProps {
  onConversationSelect?: (conversationWith: string) => void
}

export const ConversationsList = ({ onConversationSelect }: ConversationsListProps) => {
  const { t } = useTranslation()
  const navigate = useNavigate()

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

  // Flatten conversations from all pages
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
      {conversations.map((conversation) => (
        <ConversationListItem key={conversation.id} conversation={conversation} onClick={onConversationSelect} />
      ))}

      {/* Load More Conversations Button */}
      {hasNextPage && (
        <Center py={4}>
          <Button
            onClick={() => fetchNextPage()}
            isLoading={isFetchingNextPage}
            loadingText={t('messages.loading_more', { defaultValue: 'Loading more...' })}
            variant='ghost'
            size='sm'
          >
            {t('messages.load_more_conversations', { defaultValue: 'Load More Conversations' })}
          </Button>
        </Center>
      )}
    </VStack>
  )
}

interface ConversationListItemProps {
  conversation: ConversationResponse
  onClick?: (conversationWith: string) => void
}

const ConversationListItem = ({ conversation, onClick }: ConversationListItemProps) => {
  const { t } = useTranslation()
  const { user } = useAuth()
  const navigate = useNavigate()

  const bgColor = useColorModeValue('white', 'gray.800')
  const hoverBgColor = useColorModeValue('gray.50', 'gray.700')
  const borderColor = useColorModeValue('gray.200', 'gray.600')

  // For private conversations, find the other participant
  const otherParticipant = conversation.participants?.find((p) => p.id !== user?.id)

  if (!otherParticipant) {
    return null // Skip if we can't find the other participant
  }

  const handleClick = () => {
    if (onClick) {
      onClick(otherParticipant.id)
    } else {
      // Navigate to the chat page
      navigate(`/messages/${otherParticipant.id}`)
    }
  }

  const lastMessageTime = conversation.lastMessage?.createdAt ? convertToDate(conversation.lastMessage.createdAt) : null

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
              {lastMessageTime && (
                <Text fontSize='xs' color='gray.500'>
                  {t('rating.rating_date', { date: convertToDate(lastMessageTime) })}
                </Text>
              )}
            </Flex>
          </Flex>

          <HStack justify='space-between'>
            {conversation.lastMessage && (
              <Text
                fontSize='sm'
                color='gray.600'
                noOfLines={1}
                fontWeight={conversation.unreadCount > 0 ? 'medium' : 'normal'}
              >
                {conversation.lastMessage.senderId === user?.id && (
                  <Text as='span' color='lighterText'>
                    {t('messages.you', { defaultValue: 'You: ' })}
                  </Text>
                )}
                {conversation.lastMessage.content || (
                  <Text as='span' fontStyle='italic'>
                    {conversation.lastMessage.images?.length
                      ? t('messages.sent_images', {
                          defaultValue: 'Sent {{count}} image(s)',
                          count: conversation.lastMessage.images.length,
                        })
                      : t('messages.no_content', { defaultValue: 'No content' })}
                  </Text>
                )}
              </Text>
            )}

            {conversation.unreadCount > 0 && (
              <Badge colorScheme='blue' borderRadius='full' px={2}>
                {conversation.unreadCount}
              </Badge>
            )}
          </HStack>
        </Box>
      </Flex>
    </Box>
  )
}
