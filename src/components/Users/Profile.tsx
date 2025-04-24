import { Badge, Box, Button, Divider, Flex, Heading, Icon, Stack, Text, useColorModeValue } from '@chakra-ui/react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { BiWallet } from 'react-icons/bi'
import { FiHome, FiMail } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '~components/Auth/AuthContext'
import { Avatar } from '~components/Images/Avatar'
import { MapWithMarker } from '~components/Layout/Map/Map'
import { ShowRatingStars } from '~components/Ratings/ShowRatingStars'
import { BioEditor } from '~components/Users/BioEditor'
import { UserProfile as UserProfileType } from '~components/Users/types'
import { ROUTES } from '~src/router/routes'
import { lightText, lighterText } from '~theme/common'
import { icons } from '~theme/icons'

export const UserProfile = (user: UserProfileType) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { user: currentUser } = useAuth()
  const isCurrentUser = user.id === currentUser?.id

  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')

  const datefMemberSince = t('user.datefMemberSince', { defaultValue: 'PP' })
  const datefLastSeen = t('user.datefLastSeen', { defaultValue: 'PPp' })

  return (
    <Box p={6} bg={bgColor} borderRadius='lg' borderWidth={1} borderColor={borderColor} w={'full'}>
      <Stack spacing={6}>
        <Stack direction={{ base: 'column', sm: 'row' }} justify={'space-between'} align={'start'} w='full'>
          <Stack direction={'row'} spacing={6} align={{ base: 'center', sm: 'flex-start' }} flex='1'>
            <Avatar username={user.name} avatarHash={user.avatarHash} />
            <Stack spacing={1}>
              <Stack direction='row' align='center' spacing={2}>
                <Heading size='lg'>{user.name}</Heading>
                <Badge colorScheme={user.active ? 'green' : 'gray'} ml={2}>
                  {user.active ? t('user.active') : t('user.inactive')}
                </Badge>
              </Stack>
              <Stack direction='row' align='center' spacing={2}>
                <ShowRatingStars rating={user.rating} ratingCount={user.ratingCount} size='sm' />
              </Stack>
              <Stack direction='row' align='center' spacing={2} sx={lighterText}>
                <Text fontSize='sm'>
                  {t('user.member_since', {
                    date: new Date(user.createdAt),
                    format: datefMemberSince,
                    defaultValue: 'Member since {{ date, format }}',
                  })}{' '}
                  •{' '}
                  {t('user.last_seen', {
                    date: new Date(user.lastSeen),
                    format: datefLastSeen,
                    defaultValue: 'Last seen {{ date, format }}',
                  })}
                </Text>
              </Stack>
              <Stack direction='row' align='center' spacing={2} sx={lighterText}>
                <Stack direction='row' align='center' spacing={2} sx={lightText}>
                  <FiMail />
                  <Text>{user.email}</Text>
                </Stack>
                {user.community && (
                  <Stack direction='row' align='center' spacing={2} sx={lightText}>
                    <FiHome />
                    <Text>{user.community}</Text>
                  </Stack>
                )}
              </Stack>
            </Stack>
          </Stack>
          <Flex
            direction='column'
            align={{ base: 'flex-start', sm: 'flex-end' }}
            justify='center'
            mt={{ base: 4, sm: 0 }}
          >
            {isCurrentUser && (
              <Button
                aria-label={t('common.edit')}
                rightIcon={<Icon as={icons.edit} />}
                size='md'
                variant='ghost'
                onClick={() => navigate(ROUTES.PROFILE.EDIT)}
              >
                {t('user.edit_profile')}
              </Button>
            )}
            <Stack
              direction='row'
              align='center'
              spacing={2}
              bg='blue.50'
              _dark={{ bg: 'blue.900' }}
              p={2}
              borderRadius='md'
              mb={2}
            >
              <BiWallet size={20} />
              <Text fontWeight='bold'>
                {user.tokens} {t('common.token_symbol')}
              </Text>
            </Stack>
          </Flex>
        </Stack>

        <BioEditor user={user} isCurrentUser={isCurrentUser} />
        <Divider />

        {user.location && (
          <Box mt={4} height='200px' width='100%' borderRadius='md' overflow='hidden'>
            <MapWithMarker latLng={user.location} markerProps={{ showExactLocation: isCurrentUser }} />
          </Box>
        )}
      </Stack>
    </Box>
  )
}
