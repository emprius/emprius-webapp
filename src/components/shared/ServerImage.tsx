import React, { useEffect, useState } from 'react'
import { Image, ImageProps } from '@chakra-ui/react'
import { images } from '../../services/api'
import { ASSETS } from '../../constants'

interface ServerImageProps extends Omit<ImageProps, 'src'> {
  imageId: string
  fallbackSrc?: string
}

export const ServerImage: React.FC<ServerImageProps> = ({ imageId, fallbackSrc = ASSETS.TOOL_FALLBACK, ...props }) => {
  const [imageSrc, setImageSrc] = useState<string>('')

  // todo(konv1): this have to be inside a query, and use the query cache to avoid fetching the same image multiple times
  useEffect(() => {
    const fetchImage = async () => {
      try {
        const response = await images.getImage(imageId)
        if (response?.content) {
          setImageSrc(`data:image/jpeg;base64,${response.content}`)
        }
      } catch (error) {
        console.error('Error fetching image:', error)
      }
    }

    if (imageId) {
      fetchImage()
    }
  }, [imageId])

  if (!imageSrc) {
    return <Image src={fallbackSrc} {...props} />
  }

  return <Image src={imageSrc} fallbackSrc={fallbackSrc} {...props} />
}
