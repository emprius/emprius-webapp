import { EditIcon } from '@chakra-ui/icons'
import { Badge, Box, Button, Heading, HStack, Stack, Text, useColorModeValue } from '@chakra-ui/react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { BiWallet } from 'react-icons/bi'
import { FiMail } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '~components/Auth/AuthContext'
import { Avatar } from '~components/Images/Avatar'
import { MapMarker } from '~components/Layout/MapMarker'
import { ShowRatingStars } from '~components/Ratings/ShowRatingStars'
import { UserProfile as UserProfileType } from '~components/Users/types'
import { ROUTES } from '~src/router/routes'
import { lightText } from '~theme/common'

export const UserProfile = (user: UserProfileType) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const tabBg = useColorModeValue('white', 'gray.800')
  const { user: currentUser } = useAuth()
  const isCurrentUser = user.id === currentUser?.id

  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')

  return (
    <Box p={6} bg={bgColor} borderRadius='lg' borderWidth={1} borderColor={borderColor}>
      <Stack spacing={6}>
        <HStack justify={'space-between'} align={'start'}>
          <Stack direction={{ base: 'column', sm: 'row' }} spacing={6} align={{ base: 'center', sm: 'flex-start' }}>
            <Avatar username={user.name} avatarHash={user.avatarHash} />
            <Stack spacing={1}>
              <Stack direction='row' align='center' spacing={2}>
                <Heading size='lg'>{user.name}</Heading>
                <Badge colorScheme={user.active ? 'green' : 'gray'} ml={2}>
                  {user.active ? t('user.active') : t('user.inactive')}
                </Badge>
              </Stack>
              <ShowRatingStars rating={user.rating} size='sm' />
              <Stack direction='row' align='center' spacing={2} sx={lightText}>
                <FiMail />
                <Text>{user.email}</Text>
              </Stack>
              <Stack direction='row' align='center' spacing={2} sx={lightText}>
                <BiWallet />
                <Text>{user.tokens} ECO</Text>
              </Stack>
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
        {user.location && (
          <Box mt={4} height='200px' width='100%' borderRadius='md' overflow='hidden'>
            <MapMarker {...user.location} />
          </Box>
        )}
      </Stack>
    </Box>
  )
}
