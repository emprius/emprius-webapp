import { Image, ImageProps } from '@chakra-ui/react'
import React from 'react'
import api from '~src/services/api'
import { ASSETS } from '~utils/constants'

export type ServerImageProps = Omit<ImageProps, 'src'> & {
  imageId: string
  fallbackSrc?: string
  thumbnail?: boolean
}

export const ServerImage: React.FC<ServerImageProps> = ({
  imageId,
  fallbackSrc = ASSETS.TOOL_FALLBACK,
  thumbnail = false,
  ...props
}) => {
  if (!imageId) {
    return <Image src={fallbackSrc} {...props} />
  }

  return <Image src={api.images.getImage(imageId, thumbnail)} fallbackSrc={fallbackSrc} {...props} />
}

export type Image = string
