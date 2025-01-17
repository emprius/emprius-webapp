import { Box, Flex, HStack, Skeleton, Stack, Text, useColorModeValue } from '@chakra-ui/react'
import React from 'react'
import { DisplayRating } from '../../pages/ratings/DisplayRating'
import { Avatar } from '../Images/Avatar'
import { useUserProfile } from './userQueries'

interface UserMiniCardProps {
  userId: string
}

export const UserMiniCard: React.FC<UserMiniCardProps> = ({ userId }) => {
  const { data: user, isLoading } = useUserProfile(userId)
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
    <Box p={4} bg={bgColor} borderWidth={1} borderColor={borderColor} borderRadius='lg'>
      <Flex align='center' gap={4}>
        <Avatar username={user.name} avatarHash={user.avatarHash} size='md' />
        <Stack spacing={1}>
          <Text fontWeight='bold'>{user.name}</Text>
          <DisplayRating rating={user.rating} size="sm" ratingCount={user.ratingCount} />
        </Stack>
      </Flex>
    </Box>
  )
}
