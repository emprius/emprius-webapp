import {
  Badge,
  BadgeProps,
  Flex,
  FlexProps,
  HStack,
  Icon,
  Skeleton,
  SkeletonCircle,
  Stack,
  StackProps,
  Text,
  useColorModeValue,
} from '@chakra-ui/react'
import React from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { UserPreview, UserProfile } from '~components/Users/types'

import { ROUTES } from '~src/router/routes'
import { Avatar, AvatarSize, avatarSizeToPixels } from '../Images/Avatar'
import { RatingProps, ShowRatingStars } from '../Ratings/ShowRatingStars'
import { useUserProfile } from './queries'
import { ApiError } from '~src/services/api'
import { useTranslation } from 'react-i18next'
import { icons } from '~theme/icons'

type UserMiniCardProps = {
  userId: string
  avatarSize?: AvatarSize
  direction?: StackProps['direction']
  placeholderData?: Partial<UserPreview>
  showRating?: boolean
  showKarma?: boolean
  showAvatar?: boolean
  showLastSeen?: boolean
  showBorder?: boolean
  userNameFirst?: boolean
  to?: string
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
  showKarma = false,
  showAvatar = true,
  showLastSeen = false,
  showBorder = true,
  userNameFirst = false,
  to,
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
        borderWidth={showBorder ? 1 : 0}
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

  const title = userNameFirst
    ? { text: user?.name, icon: icons.user }
    : { text: user?.community, icon: icons.userCommunity }

  const subtitle = userNameFirst
    ? { text: user?.community, icon: icons.userCommunity }
    : { text: user?.name, icon: icons.user }

  const _to = to ?? (!userNotFound ? ROUTES.USERS.DETAIL.replace(':id', userId) : '')
  const datefLastSeen = t('user.datefLastSeen', { defaultValue: 'PPp' })

  return (
    <Flex
      align='center'
      gap={4}
      p={4}
      bg={bgColor}
      borderWidth={showBorder ? 1 : 0}
      borderColor={borderColor}
      borderRadius='lg'
      as={RouterLink}
      to={_to}
      alignItems={'start'}
      {...flexProps}
    >
      {showAvatar && !userNotFound && <Avatar username={user?.name} avatarHash={user?.avatarHash} size={avatarSize} />}
      {showAvatar && userNotFound && <Avatar size={avatarSize} avatarHash={user?.avatarHash} />}
      {/*Show last seen always on bottom. Used only on chats, maybe to improve on the future*/}
      <Stack direction={'column'} spacing={showLastSeen ? 1 : 0} wrap={'wrap'}>
        <Stack direction={direction} spacing={1} wrap={'wrap'}>
          <HStack>
            <Stack direction='row' align='center' spacing={1} fontWeight='bold'>
              <Icon as={title.icon} boxSize={3} />
              <Text wordBreak='break-word' color={userNotFound ? 'lighterText' : 'inherit'}>
                {title.text}
              </Text>
            </Stack>
            {badge && (
              <Badge colorScheme='green' {...badgeProps}>
                {badge}
              </Badge>
            )}
          </HStack>
          <Stack direction='row' align='center' spacing={1} color='lightText'>
            <Icon as={subtitle.icon} boxSize={3} />
            <Text wordBreak='break-word' color={userNotFound ? 'lighterText' : 'inherit'}>
              {subtitle.text}
            </Text>
          </Stack>
          {showRating && !userNotFound && (
            <ShowRatingStars rating={user?.rating} ratingCount={user?.ratingCount} size='xs' {...ratingProps} />
          )}
          {showKarma && !userNotFound && (
            <Stack direction='row' align='center' spacing={1} title={t('profile.karma_desc')}>
              <Icon as={icons.karma} boxSize={3} color='blue.500' />
              <Text color='blue.500'>
                {user?.karma} {t('profile.karma_points', { defaultValue: 'Karma points' })}
              </Text>
            </Stack>
          )}
          {userNotFound && (
            <Text color='lighterText' fontSize={'sm'}>
              {t('users.not_active', { defaultValue: 'Not active' })}
            </Text>
          )}
        </Stack>
        {showLastSeen && !userNotFound && user?.lastSeen && (
          <Text fontSize='sm' color='lightText'>
            {t('user.last_seen_duration', {
              date: new Date(user.lastSeen),
            })}
          </Text>
        )}
      </Stack>
    </Flex>
  )
}
