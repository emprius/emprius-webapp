import React, { useEffect, useRef, useCallback, useState } from 'react'
import {
  Avatar as ChakraAvatar,
  Box,
  Flex,
  VStack,
  IconButton,
  useColorModeValue,
  Center,
  Stack,
  HStack,
  Icon,
  Text,
} from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { FiArrowLeft, FiArrowDown } from 'react-icons/fi'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageInput } from './MessageInput'
import { useChatMessages, useMarkMessagesAsRead, generateChatKey } from './queries'
import { useAuth } from '~components/Auth/AuthContext'
import { ElementNotFound } from '~components/Layout/ElementNotFound'
import { LoadingSpinner } from '~components/Layout/LoadingSpinner'
import { UserCard } from '~components/Users/Card'
import LoadMoreButton from '~components/Layout/Pagination/LoadMoreButton'
import { ChatType } from '~components/Messages/types'
import { CommunityCardLittle } from '~components/Communities/Card'
import ChatMessageBubble from '~components/Messages/ChatMessageBubble'
import { icons } from '~theme/icons'
import { useInfo } from '~components/Layout/Contexts/InfoContext'

interface ChatViewProps {
  chatWith: string // User ID for private conversations
  onBack?: () => void
  type?: ChatType
}

export const ChatView = ({ chatWith, onBack, type = 'private' }: ChatViewProps) => {
  const { t } = useTranslation()
  const { user } = useAuth()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const messageInputContainerRef = useRef<HTMLDivElement>(null)
  const [showScrollToBottom, setShowScrollToBottom] = useState(false)
  const [messageInputHeight, setMessageInputHeight] = useState(90) // Default fallback height
  const [isInitialLoad, setIsInitialLoad] = useState(true)

  const bgColor = useColorModeValue('gray.50', 'gray.900')
  const headerBgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')

  // Fetch conversation messages
  const {
    data: messagesData,
    isLoading,
    error,
    isSuccess,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useChatMessages(chatWith, type)

  // Mark messages as read mutation
  const markMessagesAsRead = useMarkMessagesAsRead()

  // Flatten and reverse messages from all pages to show latest at bottom
  const messages = messagesData?.pages?.flatMap((page) => page.messages).reverse() || []

  // Mark other user's unread messages as read when component mounts or messages change
  useEffect(() => {
    if (!messages || messages.length === 0 || !user?.id) return

    // Filter unread messages from the other user (not sent by current user)
    const unreadOtherMessages = messages.filter((m) => !m.isRead && m.senderId !== user.id)

    if (unreadOtherMessages.length > 0 && !markMessagesAsRead.isPending) {
      const messageIds = unreadOtherMessages.map((m) => m.id)
      const conversationKey = generateChatKey(user.id, chatWith, type)
      markMessagesAsRead.mutate({ messageIds, conversationKey })
    }
  }, [messages, user?.id, chatWith, markMessagesAsRead])

  // Reset initial load flag when switching between chats
  useEffect(() => {
    setIsInitialLoad(true)
  }, [chatWith])

  // Scroll to bottom immediately when component first loads with messages
  useEffect(() => {
    if (messages?.length > 0 && messagesContainerRef.current && isInitialLoad) {
      scrollToBottom()
      // Mark initial load complete after scrolling
      setIsInitialLoad(false)
    }
  }, [isSuccess, messages?.length, isInitialLoad])

  // Handle scroll to detect when user scrolls near top for loading more messages
  // and to show/hide the scroll to bottom button
  const handleScroll = useCallback(() => {
    if (!messagesContainerRef.current) return

    const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current

    // Show scroll-to-bottom button when user has scrolled 100px up from bottom
    const isScrolledUp = scrollTop + clientHeight < scrollHeight - 100
    setShowScrollToBottom(isScrolledUp && messages.length > 0)

    // Skip loading more messages during initial load
    if (isInitialLoad) return

    // Load more messages when scrolled to top
    if (hasNextPage && !isFetchingNextPage) {
      const scrolledToTop = scrollTop < 100 // Load more when within 100px of top

      if (scrolledToTop) {
        fetchNextPage()
      }
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage, messages.length, isInitialLoad])

  // Add scroll listener
  useEffect(() => {
    const container = messagesContainerRef.current
    if (container) {
      container.addEventListener('scroll', handleScroll)
      return () => container.removeEventListener('scroll', handleScroll)
    }
  }, [handleScroll])

  // Track MessageInput container height for dynamic button positioning
  useEffect(() => {
    const element = messageInputContainerRef.current
    if (!element) return

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setMessageInputHeight(entry.contentRect.height + 20) // +20px for spacing above input
      }
    })

    resizeObserver.observe(element)

    // Set initial height
    setMessageInputHeight(element.offsetHeight + 20)

    return () => resizeObserver.disconnect()
  }, [])

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight
      setShowScrollToBottom(false) // Hide the button after scrolling to bottom
    }
  }

  const scrollToBottomDelayed = () => {
    // Wait for React to update the DOM after the mutation's onSuccess callback
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (messagesContainerRef.current) {
          messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight
          setShowScrollToBottom(false)
        }
      })
    })
  }

  const onMessageSent = () => {
    scrollToBottomDelayed()
  }

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (error) {
    return (
      <ElementNotFound
        title={t('messages.error.load_failed', { defaultValue: 'Failed to load chat' })}
        desc={t('messages.error.load_failed_desc', {
          defaultValue: 'There was an error loading the chat. Please try again.',
        })}
      />
    )
  }

  return (
    <Flex direction='column' h='100vh' bg={bgColor} position='relative'>
      {/* Header */}
      <ChatHeader chatWith={chatWith} onBack={onBack} bgColor={headerBgColor} borderColor={borderColor} type={type} />

      {/* Messages Area */}
      <Box
        ref={messagesContainerRef}
        flex={1}
        overflowY='auto'
        overflowX='hidden'
        p={4}
        pb={20} // Add bottom padding to account for floating input
        position='relative'
      >
        <VStack align='stretch' minH='full' justifyContent='flex-end' spacing={0}>
          {/* Loading indicator at top when fetching more */}
          {isFetchingNextPage && (
            <Center py={2}>
              <LoadMoreButton fetchNextPage={fetchNextPage} isFetchingNextPage={isFetchingNextPage} />
            </Center>
          )}

          {messages.length === 0 ? (
            <Center py={8} flex={1}>
              <ElementNotFound
                icon={icons.messages}
                title={t('messages.no_messages_yet', { defaultValue: 'No messages yet!' })}
                desc={t('messages.start_conversation', { defaultValue: ' Start the conversation' })}
              />
            </Center>
          ) : (
            messages.map((message, index) => (
              <ChatMessageBubble key={message.id} type={type} message={message} index={index} messages={messages} />
            ))
          )}
          <div ref={messagesEndRef} />
        </VStack>
      </Box>

      {/* Floating Scroll to Bottom Button - positioned fixed over messages */}
      <AnimatePresence>
        {showScrollToBottom && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.8 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              position: 'fixed',
              bottom: `${messageInputHeight}px`,
              right: '20px',
              zIndex: 1001,
            }}
          >
            <IconButton
              aria-label={t('messages.scroll_to_bottom', { defaultValue: 'Scroll to bottom' })}
              icon={<FiArrowDown />}
              onClick={scrollToBottom}
              size='md'
              borderRadius='full'
              boxShadow='lg'
              colorScheme={'blue'}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Message Input Container - sticky at bottom */}
      <Box ref={messageInputContainerRef} position='sticky' bottom={0} zIndex={1000}>
        <MessageInput
          type={type}
          chatWith={chatWith}
          onMessageSent={onMessageSent}
          placeholder={t('messages.type_message_to', {
            defaultValue: 'Type a message...',
          })}
        />
      </Box>
    </Flex>
  )
}

interface ChatHeaderProps {
  chatWith: string
  onBack?: () => void
  bgColor: string
  borderColor: string
  type: ChatType
}

const ChatHeader = ({ chatWith, onBack, bgColor, borderColor, type }: ChatHeaderProps) => {
  const { t } = useTranslation()

  return (
    <Flex align='center' p={0} bg={bgColor} borderBottom='1px' borderColor={borderColor} gap={3}>
      {onBack && (
        <IconButton
          aria-label={t('common.back', { defaultValue: 'Back' })}
          icon={<FiArrowLeft />}
          variant='ghost'
          onClick={onBack}
        />
      )}

      {type === 'general' && <GeneralChatCard />}

      {type === 'community' && <CommunityCardLittle id={chatWith} direction={'row'} avatarSize={'md'} />}

      {type === 'private' && (
        <UserCard
          userId={chatWith}
          showBorder={false}
          showRating={false}
          direction={'row'}
          avatarSize={'sm'}
          align={'center'}
          justify={'center'}
          alignItems={'center'}
          showLastSeen
        />
      )}
    </Flex>
  )
}

const GeneralChatCard = () => {
  const { data } = useInfo()
  const bgColor = useColorModeValue('white', 'gray.800')
  const { t } = useTranslation()

  const name = t('messages.general', { defaultValue: 'General Chat' })
  return (
    <Flex flex={1} align='center' gap={4} p={4} bg={bgColor}>
      <ChakraAvatar src={'/assets/logos/emprius_logo.png '} name={name} size={'md'} borderRadius={'md'} />{' '}
      <Stack direction={'column'} spacing={1}>
        <HStack spacing={1}>
          <Icon as={icons.communities} />
          <Text fontWeight='bold' wordBreak='break-word'>
            {name}
          </Text>
        </HStack>
        <Text fontSize='sm' color='gray.500'>
          {t('communities.member_count', { defaultValue: '{{ count }} members', count: data?.users })}
        </Text>
      </Stack>
    </Flex>
  )
}
