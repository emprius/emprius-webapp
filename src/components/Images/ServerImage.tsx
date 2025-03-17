import { Image, ImageProps, useDisclosure } from '@chakra-ui/react'
import React from 'react'
import api from '~src/services/api'
import { ASSETS } from '~utils/constants'
import { ImageModal } from '~components/Images/ImageModal'

export type ServerImageProps = Omit<ImageProps, 'src'> & {
  imageId: string
  fallbackSrc?: string
  thumbnail?: boolean
  modal?: boolean
}

export const ServerImage: React.FC<ServerImageProps> = ({
  imageId,
  fallbackSrc = ASSETS.TOOL_FALLBACK,
  thumbnail = false,
  modal = false,
  ...props
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  if (!imageId) {
    return <Image src={fallbackSrc} {...props} />
  }

  return (
    <>
      <Image
        onClick={modal ? onOpen : null}
        cursor={modal ? 'pointer' : 'default'}
        src={api.images.getImage(imageId, thumbnail)}
        fallbackSrc={fallbackSrc}
        {...props}
      />
      {modal && <ImageModal isOpen={isOpen} onClose={onClose} imageId={imageId} />}
    </>
  )
}

export type Image = string
