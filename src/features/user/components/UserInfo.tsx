import { Badge, Box, Heading, IconButton, Stack, Text, useColorModeValue } from '@chakra-ui/react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { FiMail, FiStar } from 'react-icons/fi'
import { EditIcon } from '@chakra-ui/icons'
import { useAuth } from '~src/features/auth/context/AuthContext'
import { MapContainer, Marker, TileLayer } from 'react-leaflet'
import { LatLng } from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { Avatar } from './Avatar'

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
          <Stack direction={{ base: 'column', sm: 'row' }} spacing={6} align={{ base: 'center', sm: 'flex-start' }}>
            <Avatar username={user.name} avatarHash={user.avatarHash} />
            <Stack spacing={3}>
              <Stack direction='row' align='center' spacing={2}>
                <Heading size='lg'>{user.name}</Heading>
                <IconButton
                  aria-label={t('common.edit')}
                  icon={<EditIcon />}
                  size='sm'
                  variant='ghost'
                  onClick={onEdit}
                />
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
                {t('user.memberSince', {
                  date: new Date(user.createdAt).toLocaleDateString(),
                })}
              </Text>
            </Stack>
          </Stack>
          {user.location && (
            <Box mt={4} height='200px' width='100%' borderRadius='md' overflow='hidden'>
              <MapContainer
                center={new LatLng(user.location.latitude / 1000000, user.location.longitude / 1000000)}
                zoom={13}
                scrollWheelZoom={false}
                dragging={false}
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                />
                <Marker position={new LatLng(user.location.latitude / 1000000, user.location.longitude / 1000000)} />
              </MapContainer>
            </Box>
          )}
        </Stack>
      </Box>
    </Stack>
  )
}
