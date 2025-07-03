import {
  Badge,
  BadgeProps,
  Flex,
  FlexProps,
  HStack,
  Skeleton,
  SkeletonCircle,
  Stack,
  StackProps,
  Text,
  useColorModeValue,
} from '@chakra-ui/react'
import { UseQueryOptions } from '@tanstack/react-query/build/modern'
import React from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { UserPreview, UserProfile, UserProfileDTO } from '~components/Users/types'

import { ROUTES } from '~src/router/routes'
import { Avatar, AvatarSize, avatarSizeToPixels } from '../Images/Avatar'
import { RatingProps, ShowRatingStars } from '../Ratings/ShowRatingStars'
import { useUserProfile } from './queries'
import { ApiError, UnauthorizedError } from '~src/services/api'
import { useTranslation } from 'react-i18next'
import { icons } from '~theme/icons'

type UserMiniCardProps = {
  userId: string
  avatarSize?: AvatarSize
  direction?: StackProps['direction']
  placeholderData?: Partial<UserPreview>
  showRating?: boolean
  showAvatar?: boolean
  ratingProps?: Omit<RatingProps, 'rating'>
  badge?: string
  badgeProps?: BadgeProps
} & FlexProps

export const UserCard: React.FC<UserMiniCardProps> = ({
  userId,
  avatarSize = 'md',
  direction = 'column',
  placeholderData,
  showRating = true,
  showAvatar = true,
  ratingProps,
  badge,
  badgeProps,
  ...flexProps
}) => {
  const { t } = useTranslation()
  // todo(kon): use user preview for that instead of the whole user profile which is not needed
  // @ts-ignore
  const { data, isLoading, error } = useUserProfile(userId, { placeholderData: placeholderData })
  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')

  if (isLoading) {
    return (
      <Flex
        align='center'
        gap={4}
        p={4}
        bg={bgColor}
        borderWidth={1}
        borderColor={borderColor}
        borderRadius='lg'
        {...flexProps}
      >
        <SkeletonCircle size={avatarSizeToPixels[avatarSize]} />
        <Stack spacing={2} direction={direction}>
          <Skeleton height='16px' width='120px' />
          <Skeleton height='14px' width='80px' />
        </Stack>
      </Flex>
    )
  }

  // If we have initial data but the user is not found, provably the user was inactive.
  // In some cases, we will have initial data but the user is not found. We should handle this to show that the info
  // is not available.
  let userNotFound = false
  let user: Partial<UserProfile> = data
  if (placeholderData?.active === false || (error && error instanceof ApiError && error.raw.status === 404)) {
    userNotFound = true
    if (!user) {
      user = {
        id: userId,
        name: placeholderData?.name ?? userId,
        avatarHash: placeholderData?.avatarHash ?? '',
      }
    }
  }

  return (
    <Flex
      align='center'
      gap={4}
      p={4}
      bg={bgColor}
      borderWidth={1}
      borderColor={borderColor}
      borderRadius='lg'
      as={RouterLink}
      to={!userNotFound ? ROUTES.USERS.DETAIL.replace(':id', userId) : ''}
      {...flexProps}
    >
      {showAvatar && !userNotFound && <Avatar username={user?.name} avatarHash={user?.avatarHash} size={avatarSize} />}
      {showAvatar && userNotFound && <Avatar size={avatarSize} avatarHash={user?.avatarHash} />}

      <Stack direction={direction} spacing={1}>
        <HStack>
          <Text fontWeight='bold' wordBreak='break-word' color={userNotFound ? 'lighterText' : 'inherit'}>
            {user?.name}
          </Text>
          {badge && (
            <Badge colorScheme='green' {...badgeProps}>
              {badge}
            </Badge>
          )}
        </HStack>
        {showRating && !userNotFound && (
          <ShowRatingStars rating={user?.rating} ratingCount={user?.ratingCount} size='sm' {...ratingProps} />
        )}
        {userNotFound && (
          <Text color='lighterText' fontSize={'sm'}>
            {t('users.not_active', { defaultValue: 'Not active' })}
          </Text>
        )}
      </Stack>
    </Flex>
  )
}
