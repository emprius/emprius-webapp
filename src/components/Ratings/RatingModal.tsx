import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { RatingForm } from './RatingForm'

interface RatingModalProps {
  isOpen: boolean
  onClose: () => void
  bookingId: string
}

export const RatingModal = ({ isOpen, onClose, bookingId }: RatingModalProps) => {
  const { t } = useTranslation()

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{t('rating.pendingRatings')}</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <RatingForm bookingId={bookingId} onSuccess={onClose} />
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
