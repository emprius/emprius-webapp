import React from 'react'
import { Image, ImageProps } from '@chakra-ui/react'
import { ASSETS } from '../../constants'
import { useImage } from '../../hooks/queries'

interface ServerImageProps extends Omit<ImageProps, 'src'> {
  imageId: string
  fallbackSrc?: string
}

export const ServerImage: React.FC<ServerImageProps> = ({ imageId, fallbackSrc = ASSETS.TOOL_FALLBACK, ...props }) => {
  const { data: image, isLoading } = useImage(imageId)

  if (isLoading || !image?.content) {
    return <Image src={fallbackSrc} {...props} />
  }

  return <Image src={`data:image/jpeg;base64,${image.content}`} fallbackSrc={fallbackSrc} {...props} />
}
