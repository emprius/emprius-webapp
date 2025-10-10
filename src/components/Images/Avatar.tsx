import { Avatar as ChakraAvatar, AvatarProps as ChakraAvatarProps, Box, Link } from '@chakra-ui/react'
import React from 'react'
import { useUserProfile } from '~components/Users/queries'
import { Link as RouterLink } from 'react-router-dom'
import { ROUTES } from '~src/router/routes'
import api from '~src/services/api'
import { useAuth } from '~components/Auth/AuthContext'

export type AvatarSize = '2xs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'

// Map Chakra Avatar sizes to pixel values for consistent sizing
export const avatarSizeToPixels: Record<AvatarSize, string> = {
  '2xs': '16px',
  xs: '24px',
  sm: '32px',
  md: '48px',
  lg: '64px',
  xl: '96px',
  '2xl': '128px',
}

export type AvatarProps = {
  avatarHash?: string
  username?: string
  size?: AvatarSize
  isSquare?: boolean
  props?: Omit<ChakraAvatarProps, 'name' | 'size' | 'borderRadius'>
}

export type LinkedAvatarProps = {
  id: string
  linkProfile?: boolean
  avatarHash?: string
  name?: string
} & Pick<AvatarProps, 'size' | 'props' | 'isSquare'>

export const UserAvatar = ({ id, size = '2xl', linkProfile, avatarHash, name, props, ...rest }: LinkedAvatarProps) => {
  const { user } = useAuth()
  const isCurrentUser = user?.id === id
  const { data: userData } = useUserProfile(id, { enabled: !isCurrentUser && !avatarHash })

  const data = isCurrentUser ? user : userData
  const hash = avatarHash || data?.avatarHash
  const n = name || data?.name

  if (linkProfile) {
    return (
      <Link as={RouterLink} to={ROUTES.USERS.DETAIL.replace(':id', id)} minW={avatarSizeToPixels[size]}>
        <Avatar username={n} avatarHash={hash} size={size} {...props} {...rest} />
      </Link>
    )
  }
  return <Avatar username={n} avatarHash={hash} size={size} {...props} {...rest} />
}

export const Avatar: React.FC<AvatarProps> = ({ avatarHash, username, size = '2xl', isSquare = false, props }) => {
  return (
    <ChakraAvatar
      src={api.images.getImage(avatarHash, true)}
      name={username}
      size={size}
      borderRadius={isSquare ? 'md' : 'full'}
      {...props}
    />
  )
}
