import { Avatar as ChakraAvatar } from '@chakra-ui/react'
import React from 'react'
import { ServerImage } from '~components/Images/ServerImage'
import { ASSETS } from '~utils/constants'

export type AvatarSize = '2xs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'

// Map Chakra Avatar sizes to pixel values for consistent sizing
export const sizeToPixels: Record<AvatarSize, string> = {
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
      boxSize={sizeToPixels[size]}
      objectFit='cover'
    />
  )
}
