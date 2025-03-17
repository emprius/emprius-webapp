import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalOverlay, useDisclosure } from '@chakra-ui/react'
import { ServerImage } from '~components/Images/ServerImage'
import React from 'react'

export const ImageModal = ({ imageId, isOpen, onClose }: { imageId: string; isOpen: boolean; onClose: () => void }) => {
  if (!imageId) return null

  return (
    <Modal isOpen={isOpen} onClose={onClose} size='6xl' closeOnOverlayClick={true}>
      <ModalOverlay />
      <ModalContent bg='transparent' boxShadow='none'>
        <ModalCloseButton color='white' />
        <ModalBody p={0}>
          <ServerImage imageId={imageId} objectFit='contain' width='100%' height='90vh' modal={false} />
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
