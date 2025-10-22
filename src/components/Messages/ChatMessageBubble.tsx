import { MessageBubbles } from '~components/Layout/MessageBubbles'
import { Box, Text, useAvatarStyles } from '@chakra-ui/react'
import React from 'react'
import { ChatType, MessageResponse } from '~components/Messages/types'
import { useAuth } from '~components/Auth/AuthContext'
import { randomColor } from '@chakra-ui/theme-tools'

const ChatMessageBubble = ({
  message,
  messages,
  index,
  type,
}: {
  message: MessageResponse
  messages: MessageResponse[]
  index: number
  type: ChatType
}) => {
  const { user } = useAuth()

  const isAuthor = message.senderId === user?.id
  const isLast = index === messages.length - 1
  const nextMessage = messages[index + 1]
  const prevMessage = messages[index - 1]
  const nextIsSameSender = nextMessage?.senderId === message.senderId
  const prevIsSameSender = prevMessage?.senderId === message.senderId
  const prevIsOtherSender = prevMessage?.senderId !== message.senderId

  const isMultipleUsersRoom = type === 'community' || type === 'general'

  // Show avatar only for community messages when it's not from the author
  // and it's the last from that sender in the sequence.
  const showAvatar = isMultipleUsersRoom && !isAuthor && (isLast || !nextIsSameSender)

  // Hide the comic tail when message continues from the same sender.
  const hideComicTail = nextIsSameSender

  // Apply left margin only when avatar is shown or message is from the author
  const showAvatarMargin = !isMultipleUsersRoom || isAuthor || showAvatar

  const showUserName = isMultipleUsersRoom && prevIsOtherSender && !isAuthor

  return (
    <MessageBubbles
      key={message.id}
      id={message.senderId}
      isAuthor={isAuthor}
      isRight={isAuthor}
      isDown
      content={message.content}
      showAvatar={showAvatar}
      at={message.createdAt}
      images={message.images}
      isRead={message.isRead}
      hideComicTail={hideComicTail}
      gap={2}
      topComponent={showUserName && <BubbleTop seed={message.senderName} />}
      mt={prevIsSameSender ? 1 : 3}
      ml={showAvatarMargin ? 0 : 10}
      bubbleProps={
        showUserName && {
          pt: 1,
        }
      }
    />
  )
}

const BubbleTop = ({ seed }: { seed: string }) => {
  const color = randomColor({ string: seed })
  return (
    <Box>
      <Text color={color} fontWeight='bold' isTruncated>
        {seed}
      </Text>
    </Box>
  )
}

export default ChatMessageBubble
