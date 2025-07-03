import { Avatar as ChakraAvatar, AvatarProps as ChakraAvatarProps, Box, Link } from '@chakra-ui/react'
import React from 'react'
import { useUserProfile } from '~components/Users/queries'
import { Link as RouterLink } from 'react-router-dom'
import { ROUTES } from '~src/router/routes'
import api from '~src/services/api'

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
} & Pick<AvatarProps, 'size' | 'props'>

export const UserAvatar = ({ id, size = '2xl', linkProfile, props }: LinkedAvatarProps) => {
  const { data } = useUserProfile(id)
  if (linkProfile && data) {
    return (
      <Link as={RouterLink} to={ROUTES.USERS.DETAIL.replace(':id', id)} minW={avatarSizeToPixels[size]}>
        <Avatar username={data?.name} avatarHash={data?.avatarHash} size={size} {...props} />
      </Link>
    )
  }
  return <Avatar username={data?.name} avatarHash={data?.avatarHash} size={size} />
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
