import { EditIcon } from '@chakra-ui/icons'
import { Badge, Box, Button, Heading, HStack, Stack, Text, useColorModeValue } from '@chakra-ui/react'
import 'leaflet/dist/leaflet.css'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { FiMail } from 'react-icons/fi'
import { useAuth } from '~components/Auth/AuthContext'
import { Avatar } from '../Images/Avatar'
import { MapMarker } from '~components/Layout/Map'
import { DisplayRating } from '~components/Ratings/DisplayRating'
import { ROUTES } from '~src/router/router'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { auth, users } from '../../services/api'
import { LoadingSpinner } from '~components/Layout/LoadingSpinner'

interface UserInfoProps {
  userId?: string // Optional - if not provided, shows current user's profile
}

export const UserInfo = ({ userId }: UserInfoProps) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { user: currentUser } = useAuth()

  const { data: userProfile, isLoading } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => userId ? users.getById(userId) : auth.getCurrentUser(),
  })

  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')

  if (isLoading) return <LoadingSpinner />
  if (!userProfile) return null

  const isCurrentUser = !userId || userId === currentUser?.id

  return (
    <Stack spacing={8}>
      <Box p={6} bg={bgColor} borderRadius='lg' borderWidth={1} borderColor={borderColor}>
        <Stack spacing={6}>
          <HStack justify={'space-between'} align={'start'}>
            <Stack direction={{ base: 'column', sm: 'row' }} spacing={6} align={{ base: 'center', sm: 'flex-start' }}>
              <Avatar username={userProfile.name} avatarHash={userProfile.avatarHash} />
              <Stack spacing={3}>
                <Stack direction='row' align='center' spacing={2}>
                  <Heading size='lg'>{userProfile.name}</Heading>
                  <Badge colorScheme={userProfile.active ? 'green' : 'gray'} ml={2}>
                    {userProfile.active ? t('user.active') : t('user.inactive')}
                  </Badge>
                </Stack>
                <Stack direction='row' align='center' spacing={2}>
                  <FiMail />
                  <Text color='gray.500'>{userProfile.email}</Text>
                </Stack>
                <DisplayRating rating={userProfile.rating} size='sm' ratingCount={userProfile.ratingCount} />
                <Text fontSize='sm' color='gray.500'>
                  {t('user.member_since', {
                    date: new Date(userProfile.createdAt).toLocaleDateString(),
                  })}
                </Text>
              </Stack>
            </Stack>
            {isCurrentUser && (
              <Button
                aria-label={t('common.edit')}
                rightIcon={<EditIcon />}
                size='md'
                variant='ghost'
                onClick={() => navigate(ROUTES.PROFILE.EDIT)}
              >
                {t('user.edit_profile')}
              </Button>
            )}
          </HStack>
          {userProfile.location && (
            <Box mt={4} height='200px' width='100%' borderRadius='md' overflow='hidden'>
              <MapMarker {...userProfile.location} />
            </Box>
          )}
        </Stack>
      </Box>
    </Stack>
  )
}
