import { Avatar, Box, Heading, Stack, Text, useColorModeValue } from '@chakra-ui/react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { FiStar } from 'react-icons/fi'
import { useAuth } from '~src/features/auth/context/AuthContext'
import { Rating } from '~src/types'
import { LoadingSpinner } from '../../../components/shared/LoadingSpinner'
import { RatingList } from '../../../features/rating/components/RatingList'
import { useUserRatings } from '../../../hooks/queries'

export const UserInfo = () => {
  const { t } = useTranslation()
  const { user } = useAuth()
  const { data: ratingsResponse, isLoading } = useUserRatings(user?.id)

  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')

  // Transform the paginated response into the format expected by RatingList
  const ratings = ratingsResponse
    ? ratingsResponse?.map((rating: Rating) => ({
        rating: rating.rating,
        comment: rating.comment,
        tool: rating.tool,
        createdAt: rating.createdAt,
      }))
    : []

  return (
    <Stack spacing={8}>
      <Box p={6} bg={bgColor} borderRadius='lg' borderWidth={1} borderColor={borderColor}>
        <Stack spacing={6}>
          <Stack direction={{ base: 'column', sm: 'row' }} spacing={6} align={{ base: 'center', sm: 'flex-start' }}>
            <Avatar size='2xl' name={user.name} src={user.avatar} />
            <Stack spacing={3}>
              <Heading size='lg'>{user.name}</Heading>
              <Stack direction='row' align='center' spacing={2}>
                <FiStar />
                <Text>{user.rating.toFixed(1)}</Text>
                <Text color='gray.600'>({t('rating.count', { count: user.ratingCount })})</Text>
              </Stack>
              {user.bio && <Text color='gray.600'>{user.bio}</Text>}
              <Text fontSize='sm' color='gray.500'>
                {t('user.memberSince', {
                  date: new Date(user.createdAt).toLocaleDateString(),
                })}
              </Text>
            </Stack>
          </Stack>
        </Stack>
      </Box>

      <Box>
        <Heading size='md' mb={4}>
          {t('rating.reviews')}
        </Heading>
        {isLoading ? <LoadingSpinner /> : <RatingList ratings={ratings} showUser={false} showTool={true} />}
      </Box>
    </Stack>
  )
}
