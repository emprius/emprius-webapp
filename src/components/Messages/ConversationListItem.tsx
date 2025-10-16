import { ChatType, MessageResponse } from '~components/Messages/types'
import { useTranslation } from 'react-i18next'
import { useAuth } from '~components/Auth/AuthContext'
import { Link as RouterLink } from 'react-router-dom'
import { Badge, Box, Flex, HStack, Icon, Text, useColorModeValue } from '@chakra-ui/react'
import { convertToDate } from '~utils/dates'
import { ROUTES } from '~src/router/routes'
import { UserAvatar } from '~components/Images/Avatar'
import { ImagesGrid } from '~components/Images/ImagesGrid'
import React from 'react'
import { icons } from '~theme/icons'

interface ConversationListItemProps {
  message: MessageResponse
  otherParticipant: {
    id: string
    name: string
    avatarHash?: string
  }
  unreadCount?: number
  conversationType?: ChatType
}

export const ConversationListItem = ({
  message,
  otherParticipant,
  unreadCount = 0,
  conversationType = 'private',
}: ConversationListItemProps) => {
  const { t } = useTranslation()
  const { user } = useAuth()

  const bgColor = useColorModeValue('white', 'gray.800')
  const hoverBgColor = useColorModeValue('gray.50', 'gray.700')
  const borderColor = useColorModeValue('gray.200', 'gray.600')

  const isCommunity = conversationType === 'community'

  let link = ROUTES.MESSAGES.CHAT.replace(':userId', otherParticipant.id)
  if (isCommunity) {
    link = ROUTES.MESSAGES.COMMUNITY_CHAT.replace(':id', otherParticipant.id)
  }

  return (
    <Box
      p={4}
      bg={bgColor}
      borderBottom='1px'
      borderColor={borderColor}
      cursor='pointer'
      _hover={{ bg: hoverBgColor }}
      as={RouterLink}
      to={link}
    >
      <Flex align='center' gap={3}>
        <UserAvatar
          id={otherParticipant.id}
          size='md'
          linkProfile={false}
          avatarHash={otherParticipant.avatarHash}
          name={otherParticipant.name}
          isSquare={isCommunity}
        />

        <Box flex={1} minW={0}>
          <Flex justify='space-between' align='start' mb={1}>
            <HStack spacing={1}>
              {isCommunity && <Icon as={icons.communities} />}
              <Text fontWeight='semibold' wordBreak='break-word' fontSize='md' noOfLines={1}>
                {otherParticipant.name}
              </Text>
            </HStack>
            <Flex align='center' gap={2}>
              <Text fontSize='xs' color='gray.500'>
                {t('messages.date_formatted', { date: convertToDate(message.createdAt) })}
              </Text>
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
              <Badge variant={'badgeCounter'} borderRadius='full' px={2} flexShrink={0}>
                {unreadCount}
              </Badge>
            )}
          </HStack>
        </Box>
      </Flex>
    </Box>
  )
}
