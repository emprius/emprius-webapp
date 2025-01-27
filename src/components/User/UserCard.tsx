import { Flex, FlexProps, HStack, Skeleton, Stack, StackProps, Text, useColorModeValue } from '@chakra-ui/react'
import React from 'react'
import { DisplayRating } from '../Ratings/DisplayRating'
import { Avatar, AvatarSize } from '../Images/Avatar'
import { useUserProfile } from './userQueries'
import { UseQueryOptions } from '@tanstack/react-query/build/modern'
import { UserProfile } from '~components/User/userTypes'
import { Link as RouterLink } from 'react-router-dom'
import { ROUTES } from '~src/router/router'

type UserMiniCardProps = {
  userId: string
  avatarSize?: AvatarSize
  direction?: StackProps['direction']
  placeholderData?: UseQueryOptions<UserProfile>['placeholderData']
} & FlexProps

export const UserCard: React.FC<UserMiniCardProps> = ({
  userId,
  avatarSize = 'md',
  direction = 'column',
  placeholderData,
  ...flexProps
}) => {
  const { data: user, isLoading } = useUserProfile(userId, {
    placeholderData,
  })
  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')

  if (isLoading) {
    return (
      <HStack spacing={4}>
        <Skeleton height='32px' width='32px' borderRadius='full' />
        <Stack spacing={2}>
          <Skeleton height='16px' width='120px' />
          <Skeleton height='14px' width='80px' />
        </Stack>
      </HStack>
    )
  }

  if (!user) {
    return null
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
      to={ROUTES.USERS.DETAIL.replace(':id', userId)}
      {...flexProps}
    >
      <Avatar username={user.name} avatarHash={user.avatarHash} size={avatarSize} />
      <Stack direction={direction} spacing={1}>
        <Text fontWeight='bold'>{user.name}</Text>
        <DisplayRating rating={user.rating} size='sm' ratingCount={user.ratingCount} />
      </Stack>
    </Flex>
  )
}
