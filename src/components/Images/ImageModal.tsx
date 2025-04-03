import { IconButton, Modal, ModalBody, ModalCloseButton, ModalContent, ModalOverlay } from '@chakra-ui/react'
import { ServerImage } from '~components/Images/ServerImage'
import React from 'react'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'

export type ImageModalActions = {
  onPrevious?: () => void
  onNext?: () => void
  hasMultipleImages?: boolean
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
}) => {
  if (!imageId) return null

  return (
    <Modal isOpen={isOpen} onClose={onClose} size='6xl' closeOnOverlayClick={true}>
      <ModalOverlay />
      <ModalContent bg='transparent' boxShadow='none' position='relative'>
        <ModalCloseButton color='white' />
        <ModalBody p={0}>
          <ServerImage imageId={imageId} objectFit='contain' width='100%' height='90vh' modal={false} />

          {hasMultipleImages && onPrevious && (
            <IconButton
              aria-label='Previous image'
              icon={<FiChevronLeft size={30} />}
              onClick={onPrevious}
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
              onClick={onNext}
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
