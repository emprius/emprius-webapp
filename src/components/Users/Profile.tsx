import {
  Badge,
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  Icon,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Stack,
  Text,
  useColorModeValue,
} from '@chakra-ui/react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { FiMail } from 'react-icons/fi'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '~components/Auth/AuthContext'
import { Avatar } from '~components/Images/Avatar'
import { MapWithMarker } from '~components/Layout/Map/Map'
import { ShowRatingStars } from '~components/Ratings/ShowRatingStars'
import { BioEditor } from '~components/Users/BioEditor'
import { UserProfile as UserProfileType } from '~components/Users/types'
import { ROUTES } from '~src/router/routes'
import { icons } from '~theme/icons'

export const UserProfile = (user: UserProfileType) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { user: currentUser } = useAuth()
  const isCurrentUser = user.id === currentUser?.id
  const { id } = useParams<{ id: string }>() // If urlId defined on the url the user is looking the public profile

  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')

  const datefMemberSince = t('user.datefMemberSince', { defaultValue: 'PP' })
  const datefLastSeen = t('user.datefLastSeen', { defaultValue: 'PPp' })

  return (
    <Box p={6} bg={bgColor} borderRadius='lg' borderWidth={1} borderColor={borderColor} w={'full'}>
      <Stack spacing={6}>
        <Stack direction={{ base: 'column-reverse', md: 'row' }} justify={'space-between'} align={'start'} w='full'>
          <Stack
            direction={{ base: 'column', md: 'row' }}
            spacing={6}
            align={{ base: 'center', md: 'flex-start' }}
            flex='1'
            w={'full'}
          >
            <Avatar username={user.name} avatarHash={user.avatarHash} />
            <Stack spacing={1}>
              <Stack
                direction='row'
                align='center'
                spacing={2}
                justify={{ base: 'center', md: 'inherit' }}
                wrap={'wrap-reverse'}
              >
                <Heading size='lg' textAlign={{ base: 'center', md: 'inherit' }}>
                  {user.name}
                </Heading>
                <Badge colorScheme={user.active ? 'green' : 'gray'}>
                  {user.active ? t('user.active') : t('user.inactive')}
                </Badge>
              </Stack>
              <Stack direction='row' align='center' spacing={2} justify={{ base: 'center', md: 'inherit' }}>
                <ShowRatingStars rating={user.rating} ratingCount={user.ratingCount} size='sm' />
              </Stack>
              <Stack
                direction='row'
                align='center'
                spacing={1}
                color={'lighterText'}
                wrap={'wrap'}
                justify={{ base: 'center', md: 'inherit' }}
              >
                <Text fontSize='sm'>
                  {t('user.member_since', {
                    date: new Date(user.createdAt),
                    format: datefMemberSince,
                    defaultValue: 'Member since {{ date, format }}',
                  })}
                </Text>
                <Text fontSize='sm'>{' • '}</Text>
                <Text fontSize='sm'>
                  {t('user.last_seen', {
                    date: new Date(user.lastSeen),
                    format: datefLastSeen,
                    defaultValue: 'Last seen {{ date, format }}',
                  })}
                </Text>
              </Stack>
              <Stack
                direction={'row'}
                spacing={2}
                color='lighterText'
                wrap={'wrap'}
                justify={{ base: 'center', md: 'inherit' }}
              >
                <Stack direction='row' align='center' spacing={2} color='lightText'>
                  <FiMail />
                  <Text>{user.email}</Text>
                </Stack>
                {user.community && (
                  <Stack direction='row' align='center' spacing={2} color='lightText'>
                    <Icon as={icons.userCommunity} />
                    <Text>{user.community}</Text>
                  </Stack>
                )}
              </Stack>
            </Stack>
          </Stack>
          <Flex
            direction={{ base: 'row-reverse', md: 'column' }}
            align={{ md: 'flex-end' }}
            justify={{ base: 'end', md: 'center' }}
            w={{ base: 'full', md: 'auto' }}
          >
            <Popover>
              <PopoverTrigger>
                <Stack
                  direction='row'
                  align='center'
                  spacing={2}
                  bg='blue.50'
                  _dark={{ bg: 'blue.900' }}
                  p={2}
                  borderRadius='md'
                  mb={2}
                  title={t('profile.karma_desc')}
                >
                  <Icon as={icons.karma} boxSize={5} color='blue.500' />
                  <Text fontWeight='bold'>
                    {user.karma} {t('profile.karma_balance', { defaultValue: 'Karma' })}
                  </Text>
                  <Icon boxSize={'3'} alignSelf={'start'} />
                </Stack>
              </PopoverTrigger>
              <PopoverContent bg='gray.700' color={'white'} maxW={'300px'} py={2} px={3}>
                <Box w={'full'} textAlign={'center'}>
                  {t('profile.karma_desc', {
                    defaultValue:
                      'Karma points shows the balance between loans and petitions. You can earn karma by accepting loans or petitions from other users, and you can spend it by requesting loans or petitions from others.',
                  })}
                </Box>
              </PopoverContent>
            </Popover>

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
          </Flex>
        </Stack>

        <BioEditor user={user} isCurrentUser={isCurrentUser} />
        <Divider />

        {user.location && (
          <Box mt={4} height='200px' width='100%' borderRadius='md' overflow='hidden'>
            <MapWithMarker latLng={user.location} markerProps={{ showExactLocation: !id }} />
          </Box>
        )}
      </Stack>
    </Box>
  )
}
