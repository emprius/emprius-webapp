import React, { useEffect, useRef, useCallback, useState } from 'react'
import { Box, Flex, VStack, Text, IconButton, useColorModeValue, Spinner, Center, Button } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { FiArrowLeft, FiArrowDown } from 'react-icons/fi'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageInput } from './MessageInput'
import { useConversationMessages, useSendMessage, useMarkConversationAsReadOnEnter } from './queries'
import { useAuth } from '~components/Auth/AuthContext'
import { ElementNotFound } from '~components/Layout/ElementNotFound'
import { LoadingSpinner } from '~components/Layout/LoadingSpinner'
import { UserCard } from '~components/Users/Card'
import { MessageBubbles } from '~components/Layout/MessageBubbles'
import LoadMoreButton from '~components/Layout/Pagination/LoadMoreButton'

export interface ConversationViewProps {
  conversationWith: string // User ID for private conversations
  onBack?: () => void
}

export const ConversationView = ({ conversationWith, onBack }: ConversationViewProps) => {
  const { t } = useTranslation()
  const { user } = useAuth()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const messageInputContainerRef = useRef<HTMLDivElement>(null)
  const [showScrollToBottom, setShowScrollToBottom] = useState(false)
  const [messageInputHeight, setMessageInputHeight] = useState(90) // Default fallback height

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
  } = useConversationMessages(conversationWith)

  // Mark conversation as read when entering
  const markAsRead = useMarkConversationAsReadOnEnter(conversationWith)

  // Mark as read when component mounts
  useEffect(() => {
    markAsRead()
  }, [markAsRead])

  // Flatten and reverse messages from all pages to show latest at bottom
  const messages = messagesData?.pages?.flatMap((page) => page.messages).reverse() || []

  // Scroll to bottom immediately when component first loads with messages
  useEffect(() => {
    if (messages?.length > 0 && messagesContainerRef.current) {
      scrollToBottom()
    }
  }, [isSuccess])

  // Handle scroll to detect when user scrolls near top for loading more messages
  // and to show/hide the scroll to bottom button
  const handleScroll = useCallback(() => {
    if (!messagesContainerRef.current) return

    const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current

    // Show scroll-to-bottom button when user has scrolled 100px up from bottom
    const isScrolledUp = scrollTop + clientHeight < scrollHeight - 100
    setShowScrollToBottom(isScrolledUp && messages.length > 0)

    // Load more messages when scrolled to top
    if (hasNextPage && !isFetchingNextPage) {
      const scrolledToTop = scrollTop < 100 // Load more when within 100px of top

      if (scrolledToTop) {
        fetchNextPage()
      }
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage, messages.length])

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
        title={t('messages.error.load_failed', { defaultValue: 'Failed to load conversation' })}
        desc={t('messages.error.load_failed_desc', {
          defaultValue: 'There was an error loading the conversation. Please try again.',
        })}
      />
    )
  }

  return (
    <Flex direction='column' h='100vh' bg={bgColor} position='relative'>
      {/* Header */}
      <ConversationHeader
        conversationWith={conversationWith}
        onBack={onBack}
        bgColor={headerBgColor}
        borderColor={borderColor}
      />

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
        <VStack spacing={4} align='stretch' minH='full' justifyContent='flex-end'>
          {/* Loading indicator at top when fetching more */}
          {isFetchingNextPage && (
            <Center py={2}>
              <LoadMoreButton fetchNextPage={fetchNextPage} isFetchingNextPage={isFetchingNextPage} />
            </Center>
          )}

          {messages.length === 0 ? (
            <Center py={8} flex={1}>
              <Text color='gray.500'>
                {t('messages.no_messages', { defaultValue: 'No messages yet. Start the conversation!' })}
              </Text>
            </Center>
          ) : (
            messages.map((message, index) => {
              // const showAvatar = index === 0 || messages[index - 1]?.senderId !== message.senderId
              const isAuthor = message.senderId === user?.id
              return (
                <MessageBubbles
                  key={message.id}
                  isAuthor={isAuthor}
                  isRight={isAuthor}
                  content={message.content}
                  showAvatar={false}
                  at={message.createdAt}
                  images={message.images}
                />
              )
            })
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
          conversationWith={conversationWith}
          onMessageSent={onMessageSent}
          placeholder={t('messages.type_message_to', {
            defaultValue: 'Type a message...',
          })}
        />
      </Box>
    </Flex>
  )
}

interface ConversationHeaderProps {
  conversationWith: string
  onBack?: () => void
  bgColor: string
  borderColor: string
}

const ConversationHeader = ({ conversationWith, onBack, bgColor, borderColor }: ConversationHeaderProps) => {
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

      <UserCard
        userId={conversationWith}
        showBorder={false}
        showRating={false}
        direction={'row'}
        avatarSize={'sm'}
        align={'center'}
        justify={'center'}
        alignItems={'center'}
      />
    </Flex>
  )
}
