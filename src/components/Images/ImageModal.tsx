import { IconButton, Modal, ModalBody, ModalCloseButton, ModalContent, ModalOverlay } from '@chakra-ui/react'
import { ServerImage } from '~components/Images/ServerImage'
import React from 'react'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import api from '~src/services/api'
import { ZoomableImage } from '~components/Images/ZoomableImage'

export type ImageModalActions = {
  onPrevious?: () => void
  onNext?: () => void
  hasMultipleImages?: boolean
  isZoomable?: boolean
}

type ImageModalProps = {
  imageId: string
  isOpen: boolean
  onClose: () => void
} & ImageModalActions

export const ImageModal: React.FC<ImageModalProps> = ({
  imageId,
  isOpen,
  onClose,
  onPrevious,
  onNext,
  hasMultipleImages = false,
  isZoomable = true,
}) => {
  if (!imageId) return null

  return (
    <Modal isOpen={isOpen} onClose={onClose} size='6xl' closeOnOverlayClick={true}>
      <ModalOverlay />
      <ModalContent bg='transparent' boxShadow='none' position='relative'>
        <ModalCloseButton color='white' />
        <ModalBody onClick={onClose} p={4} display='flex' alignItems='center' justifyContent='center' minH='90vh'>
          {!isZoomable && (
            <ServerImage
              imageId={imageId}
              objectFit='contain'
              maxW='90vw'
              maxH='80vh'
              w='auto'
              h='auto'
              modal={false}
              onClick={(e) => {
                e.stopPropagation()
              }}
            />
          )}
          {isZoomable && (
            <ZoomableImage
              src={api.images.getImage(imageId, false)}
              objectFit='contain'
              maxW='90vw'
              maxH='80vh'
              w='auto'
              h='auto'
            />
          )}
          {hasMultipleImages && onPrevious && (
            <IconButton
              aria-label='Previous image'
              icon={<FiChevronLeft size={30} />}
              onClick={(e) => {
                e.stopPropagation()
                onPrevious()
              }}
              position='absolute'
              left={4}
              top='50%'
              transform='translateY(-50%)'
              zIndex={2}
              variant='ghost'
              colorScheme='whiteAlpha'
              bg='blackAlpha.300'
              _hover={{ bg: 'blackAlpha.500' }}
              size='lg'
            />
          )}

          {hasMultipleImages && onNext && (
            <IconButton
              aria-label='Next image'
              icon={<FiChevronRight size={30} />}
              onClick={(e) => {
                e.stopPropagation()
                onNext()
              }}
              position='absolute'
              right={4}
              top='50%'
              transform='translateY(-50%)'
              zIndex={2}
              variant='ghost'
              colorScheme='whiteAlpha'
              bg='blackAlpha.300'
              _hover={{ bg: 'blackAlpha.500' }}
              size='lg'
            />
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
