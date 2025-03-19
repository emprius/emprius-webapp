import { Avatar as ChakraAvatar, Box, Link } from '@chakra-ui/react'
import React from 'react'
import { ServerImage } from '~components/Images/ServerImage'
import { ASSETS } from '~utils/constants'
import { useUserProfile } from '~components/Users/queries'
import { Link as RouterLink } from 'react-router-dom'
import { ROUTES } from '~src/router/routes'

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

export interface AvatarProps {
  avatarHash?: string
  username?: string
  size?: AvatarSize
}

export const UserAvatar = ({
  userId,
  size = '2xl',
  linkProfile,
}: {
  userId: string
  linkProfile?: boolean
} & Pick<AvatarProps, 'size'>) => {
  const { data: user } = useUserProfile(userId)
  if (linkProfile) {
    return (
      <Link as={RouterLink} to={ROUTES.USERS.DETAIL.replace(':id', userId)} minW={avatarSizeToPixels[size]}>
        <Avatar username={user?.name} avatarHash={user?.avatarHash} size={size} />
      </Link>
    )
  }
  return <Avatar username={user?.name} avatarHash={user?.avatarHash} size={size} />
}

export const Avatar: React.FC<AvatarProps> = ({ avatarHash, username, size = '2xl' }) => {
  if (username && !avatarHash) {
    return <ChakraAvatar name={username} size={size} />
  }

  return (
    <ServerImage
      imageId={avatarHash || ''}
      fallbackSrc={ASSETS.AVATAR_FALLBACK}
      alt='Avatar'
      borderRadius='full'
      boxSize={avatarSizeToPixels[size]}
      objectFit='cover'
      thumbnail
    />
  )
}
