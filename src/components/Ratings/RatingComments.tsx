import { RatingParty, UnifiedRating } from '~components/Ratings/types'
import { Box, Flex, FlexProps, HStack } from '@chakra-ui/react'
import React from 'react'
import { useAuth } from '~components/Auth/AuthContext'
import { MessageBubbles } from '~components/Layout/MessageBubbles'
import { ShowRatingStars } from '~components/Ratings/ShowRatingStars'
import { useTranslation } from 'react-i18next'

export const RatingComments = ({ requester, owner }: UnifiedRating) => {
  const { user } = useAuth()
  return (
    <Flex direction={'row'} wrap={'wrap'} gap={1} pt={4}>
      {/* Show requester's rating if they've rated */}
      {requester?.rating && (
        <Box position='relative' top={-4}>
          <RatingBubbles isAuthor={requester.id === user?.id} {...requester} mb={0} />
        </Box>
      )}
      {/* Show owner's rating if they've rated */}
      {owner?.rating && (
        <Box position='relative' pl={4}>
          <RatingBubbles isAuthor={owner.id === user?.id} {...owner} ml={'auto'} isRight />
        </Box>
      )}
    </Flex>
  )
}

export type MessageBubbleProps = {
  isAuthor: boolean
  isRight?: boolean
} & RatingParty &
  FlexProps

const RatingBubbles = ({
  id,
  ratingComment,
  rating,
  isAuthor,
  images,
  ratedAt,
  isRight = false,
  ...flexProps
}: MessageBubbleProps) => {
  const { t } = useTranslation()
  const datef = t('messages.datef_bubble_date_other_day', { defaultValue: 'd MMM, HH:mm' })
  return (
    <MessageBubbles
      id={id}
      content={ratingComment || undefined}
      isAuthor={isAuthor}
      isRight={isRight}
      at={ratedAt}
      images={images}
      topComponent={
        <HStack justify={isRight ? 'end' : 'start'} pr={isRight ? 0 : '20px'} pl={isRight ? 'auto' : 0}>
          <ShowRatingStars rating={(rating * 100) / 5} size='sm' showCount={false} />
        </HStack>
      }
      bubbleDatef={datef}
      showAvatar
      mb={4}
      gap={2}
      {...flexProps}
    />
  )
}
