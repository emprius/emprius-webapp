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
  Tooltip,
  Popover,
  PopoverTrigger,
  PopoverContent,
  SimpleGrid,
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
import { convertToDate } from '~utils/dates'
import { UserAvatar } from '~components/Images/Avatar'
import { ShowRatingStars } from '~components/Ratings/ShowRatingStars'
import { UserCard } from '~components/Users/Card'
import { ToolImage } from '~components/Tools/shared/ToolImage'

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
                <ToolImage
                  imageId={tool.images[0]}
                  alt={tool.title}
                  toolId={tool.id}
                  width='100%'
                  height='100%'
                  objectFit='cover'
                />
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
        </RouterLink>

        {/* Chat-like rating messages */}
        <Box maxW={{ base: '100%', lg: '70%' }}>
          {/* Show requester's rating if they've rated */}
          <MessageBubble
            userId={rating.requester.id}
            message={rating.requester?.ratingComment}
            rating={rating.requester?.rating || 0}
            isAuthor={!isOwner}
            images={rating.requester?.images}
            ratedAt={rating.requester?.ratedAt}
          />

          {/*/!* Show owner's rating if they've rated *!/*/}
          <MessageBubble
            userId={rating.owner.id}
            message={rating.owner?.ratingComment}
            rating={rating.owner?.rating || 0}
            isAuthor={isOwner}
            images={rating.owner?.images}
            ratedAt={rating.owner?.ratedAt}
          />
        </Box>
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
  ratedAt?: number | null
}

const MessageBubble = ({ userId, message, rating, isAuthor, images, ratedAt }: MessageBubbleProps) => {
  const { t } = useTranslation()
  const bubbleColor = useColorModeValue(isAuthor ? 'blue.50' : 'gray.100', isAuthor ? 'blue.800' : 'gray.700')
  const textColor = useColorModeValue(isAuthor ? 'gray.800' : 'gray.700', isAuthor ? 'gray.100' : 'gray.200')
  const dateColor = useColorModeValue(isAuthor ? 'gray.500' : 'gray.400', isAuthor ? 'gray.400' : 'gray.500')
  const datef = t('rating.datef_full')

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
        {images && <ImagesGrid images={images} />}
        {ratedAt && (
          <Popover>
            <PopoverTrigger>
              <Text fontSize='xs' color={dateColor} alignSelf='flex-end' mt={1} cursor='pointer'>
                {t('rating.rating_date', { date: convertToDate(ratedAt) })}
              </Text>
            </PopoverTrigger>
            <PopoverContent bg='gray.700' color={'white'} maxW={'170px'} py={1}>
              <Box w={'full'} textAlign={'center'}>
                {t('rating.date_formatted', {
                  date: convertToDate(ratedAt),
                  format: datef,
                })}
              </Box>
            </PopoverContent>
          </Popover>
        )}
      </VStack>
    </Flex>
  )
}

export const ImagesGrid = ({ images }: { images: string[] }) => {
  if (!images) return
  return (
    <HStack wrap={'wrap'} spacing={4}>
      {images.map((image, index) => (
        <Box key={image} position='relative' w={'50px'} h={'50px'}>
          <ServerImage imageId={image} objectFit='cover' w='100%' h='100%' borderRadius='md' thumbnail modal />
        </Box>
      ))}
    </HStack>
  )
}
