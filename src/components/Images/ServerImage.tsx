import { Image, ImageProps, Skeleton, useDisclosure } from '@chakra-ui/react'
import React from 'react'
import api from '~src/services/api'
import { ASSETS } from '~utils/constants'
import { ImageModal } from '~components/Images/ImageModal'

export type ServerImageProps = Omit<ImageProps, 'src'> & {
  imageId: string
  fallbackSrc?: string
  thumbnail?: boolean
  modal?: boolean
  isLoading?: boolean
}

export const ServerImage: React.FC<ServerImageProps> = ({
  imageId,
  fallbackSrc = ASSETS.TOOL_FALLBACK,
  thumbnail = false,
  modal = false,
  isLoading,
  ...props
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  if (isLoading) {
    return <Skeleton height='100%' />
  }

  if (!imageId) {
    return <Image src={fallbackSrc} {...props} />
  }

  return (
    <>
      <Image
        onClick={modal ? onOpen : null}
        cursor={modal ? 'pointer' : 'inherit'}
        src={api.images.getImage(imageId, thumbnail)}
        fallbackSrc={fallbackSrc}
        {...props}
      />
      {modal && <ImageModal isOpen={isOpen} onClose={onClose} imageId={imageId} />}
    </>
  )
}

export type Image = string
