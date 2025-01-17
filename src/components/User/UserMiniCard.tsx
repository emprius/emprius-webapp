import { Box, Flex, Stack, Text, useColorModeValue } from '@chakra-ui/react'
import React from 'react'
import { FiStar } from 'react-icons/fi'
import { Avatar } from '../Images/Avatar'
import { useUserProfile } from './userQueries'
import { LoadingSpinner } from '../Layout/LoadingSpinner'

interface UserMiniCardProps {
  userId: string
}

export const UserMiniCard: React.FC<UserMiniCardProps> = ({ userId }) => {
  const { data: user, isLoading } = useUserProfile(userId)
  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')

  if (isLoading) {
    return <LoadingSpinner />
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
          <Flex align='center' color='orange.400'>
            <FiStar />
            <Text ml={1} fontSize='sm'>
              {user.rating.toFixed(1)} ({user.ratingCount})
            </Text>
          </Flex>
        </Stack>
      </Flex>
    </Box>
  )
}
