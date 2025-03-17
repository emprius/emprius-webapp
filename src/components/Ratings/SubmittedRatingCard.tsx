import React from 'react'
import {
  Box,
  Card,
  CardBody,
  Flex,
  Link,
  Skeleton,
  Text,
  Divider,
  useColorModeValue,
  HStack,
  VStack,
} from '@chakra-ui/react'
import { Trans, useTranslation } from 'react-i18next'
import { Link as RouterLink } from 'react-router-dom'
import { useAuth } from '~components/Auth/AuthContext'
import { ServerImage } from '~components/Images/ServerImage'
import { useTool } from '~components/Tools/queries'
import { ROUTES } from '~src/router/routes'
import { UnifiedRating } from './types'
import { useBookingDetail } from '~components/Bookings/queries'
import { format } from 'date-fns'
import { UserAvatar } from '~components/Images/Avatar'
import { ShowRatingStars } from '~components/Ratings/ShowRatingStars'
import { UserCard } from '~components/Users/Card'

interface UnifiedRatingCardProps {
  rating: UnifiedRating
}

export const SubmittedRatingCard = ({ rating }: UnifiedRatingCardProps) => {
  const { t } = useTranslation()
  const { user } = useAuth()
  const { data: booking } = useBookingDetail({ id: rating.bookingId })
  const { data: tool } = useTool(booking?.toolId, {
    enabled: !!booking?.toolId,
  })

  const isOwner = rating.owner.id === user.id
  const otherUser = isOwner ? rating.requester : rating.owner
  const datef = t('rating.datef')

  const borderColor = useColorModeValue('gray.200', 'gray.700')
  const bgHover = useColorModeValue('gray.50', 'gray.800')

  if (!rating.owner.rating && !rating.requester.rating) {
    return null // Don't show ratings where no one has rated
  }

  let titleText = (
    <Trans
      i18nKey={'rating.you_got_the_tool_from'}
      defaultValue={'You requested'}
      components={{
        toolName: <ToolName tool={tool} />,
      }}
    />
  )

  if (isOwner) {
    titleText = (
      <Trans
        i18nKey={'rating.you_lent_the_tool'}
        defaultValue={'You lent'}
        components={{
          toolName: <ToolName tool={tool} />,
        }}
      />
    )
  }

  return (
    <Card variant='outline' mb={4} borderColor={borderColor} _hover={{ bg: bgHover }} transition='background 0.2s'>
      <CardBody>
        <RouterLink
          to={ROUTES.BOOKINGS.DETAIL.replace(':id', rating.bookingId)}
          state={{
            booking,
            tool,
          }}
        >
          {/* Header with tool info */}
          <Flex gap={4} align='start' mb={4}>
            <Skeleton isLoaded={!!tool} width='50px' height='50px' borderRadius='md' overflow='hidden' flexShrink={0}>
              {tool?.images?.[0] && (
                <Link as={RouterLink} to={ROUTES.TOOLS.DETAIL.replace(':id', tool.id?.toString() ?? '')}>
                  <ServerImage
                    imageId={tool.images[0]}
                    alt={tool.title}
                    width='100%'
                    height='100%'
                    objectFit='cover'
                    thumbnail
                  />
                </Link>
              )}
            </Skeleton>

            <Box flex='1'>
              <HStack fontSize='sm' fontWeight='medium' mb={1} wrap={'wrap'}>
                {titleText}
                <UserCard
                  userId={otherUser.id}
                  direction={'row'}
                  avatarSize={'2xs'}
                  showRating={false}
                  borderWidth={0}
                  p={0}
                  gap={1}
                  bgColor={'transparent'}
                />
              </HStack>
              {booking && (
                <Text fontSize='xs' color='gray.500'>
                  {format(new Date(booking.startDate * 1000), datef)} -{' '}
                  {format(new Date(booking.endDate * 1000), datef)}
                </Text>
              )}
            </Box>
          </Flex>
          {/* Chat-like rating messages */}
          <Box maxW={{ base: '100%', lg: '70%' }}>
            {/* Show requester's rating if they've rated */}
            <MessageBubble
              userId={rating.requester.id}
              message={rating.requester.ratingComment}
              rating={rating.requester.rating || 0}
              isAuthor={!isOwner}
              images={rating.requester.images}
            />

            {/*/!* Show owner's rating if they've rated *!/*/}
            <MessageBubble
              userId={rating.owner.id}
              message={rating.owner.ratingComment}
              rating={rating.owner.rating || 0}
              isAuthor={isOwner}
              images={rating.owner.images}
            />
          </Box>
        </RouterLink>
      </CardBody>
    </Card>
  )
}

const ToolName = ({ tool }) => {
  if (!tool) {
    return <Skeleton ml={1} isLoaded={!!tool} w={10} h={4} display='inline-block' />
  }
  return (
    <Box as={'span'} color={'primary.500'}>
      {tool.title}
    </Box>
  )
}

interface MessageBubbleProps {
  userId: string
  message: string | null
  rating: number
  isAuthor: boolean
  images?: string[] | null
}

const MessageBubble = ({ userId, message, rating, isAuthor, images }: MessageBubbleProps) => {
  const bubbleColor = useColorModeValue(isAuthor ? 'blue.50' : 'gray.100', isAuthor ? 'blue.800' : 'gray.700')
  const textColor = useColorModeValue(isAuthor ? 'gray.800' : 'gray.700', isAuthor ? 'gray.100' : 'gray.200')

  if (!rating) return null

  return (
    <Flex
      justify={{ base: isAuthor ? 'start' : 'end', lg: 'start' }}
      mb={4}
      gap={2}
      direction={isAuthor ? 'row' : 'row-reverse'}
    >
      <UserAvatar userId={userId} size='sm' />
      <VStack
        bg={bubbleColor}
        p={3}
        borderRadius='lg'
        borderBottomRightRadius={isAuthor ? 0 : 'lg'}
        borderBottomLeftRadius={isAuthor ? 'lg' : 0}
        boxShadow='sm'
        align={isAuthor ? 'start' : 'end'}
        minW={'150px'}
      >
        <ShowRatingStars rating={(rating * 100) / 5} size='sm' showCount={false} />
        {message && (
          <Text fontSize='sm' color={textColor} mt={1}>
            {message}
          </Text>
        )}
        {/* TODO: Add image gallery if needed */}
      </VStack>
    </Flex>
  )
}
