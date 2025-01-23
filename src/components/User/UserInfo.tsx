import { EditIcon } from '@chakra-ui/icons'
import { Badge, Box, Button, Heading, HStack, Stack, Text, useColorModeValue } from '@chakra-ui/react'
import 'leaflet/dist/leaflet.css'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { FiMail, FiStar } from 'react-icons/fi'
import { useAuth } from '~components/Auth/AuthContext'
import { Avatar } from '../Images/Avatar'
import { MapMarker } from '~components/Layout/Map'

interface UserInfoProps {
  onEdit?: () => void
}

export const UserInfo: React.FC<UserInfoProps> = ({ onEdit }) => {
  const { t } = useTranslation()
  const { user } = useAuth()

  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')

  return (
    <Stack spacing={8}>
      <Box p={6} bg={bgColor} borderRadius='lg' borderWidth={1} borderColor={borderColor}>
        <Stack spacing={6}>
          <HStack justify={'space-between'} align={'start'}>
            <Stack direction={{ base: 'column', sm: 'row' }} spacing={6} align={{ base: 'center', sm: 'flex-start' }}>
              <Avatar username={user.name} avatarHash={user.avatarHash} />
              <Stack spacing={3}>
                <Stack direction='row' align='center' spacing={2}>
                  <Heading size='lg'>{user.name}</Heading>
                  <Badge colorScheme={user.active ? 'green' : 'gray'} ml={2}>
                    {user.active ? t('user.active') : t('user.inactive')}
                  </Badge>
                </Stack>
                <Stack direction='row' align='center' spacing={2}>
                  <FiMail />
                  <Text color='gray.500'>{user.email}</Text>
                </Stack>
                <Stack direction='row' align='center' spacing={2}>
                  <FiStar />
                  <Text>{user.rating.toFixed(1)}</Text>
                  <Text color='gray.600'>({t('rating.count', { count: user.ratingCount })})</Text>
                </Stack>
                {user.bio && <Text color='gray.600'>{user.bio}</Text>}
                <Text fontSize='sm' color='gray.500'>
                  {t('user.member_since', {
                    date: new Date(user.createdAt).toLocaleDateString(),
                  })}
                </Text>
              </Stack>
            </Stack>
            <Button aria-label={t('common.edit')} rightIcon={<EditIcon />} size='lg' variant='ghost' onClick={onEdit}>
              {t('user.edit_profile')}
            </Button>
          </HStack>
          {user.location && (
            <Box mt={4} height='200px' width='100%' borderRadius='md' overflow='hidden'>
              <MapMarker {...user.location} />
            </Box>
          )}
        </Stack>
      </Box>
    </Stack>
  )
}
