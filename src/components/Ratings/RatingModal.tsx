import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { RatingForm } from './RatingForm'
import { Booking } from '~components/Bookings/bookingsQueries'

interface RatingModalProps {
  isOpen: boolean
  onClose: () => void
  booking: Booking
}

export const RatingModal = ({ isOpen, onClose, booking }: RatingModalProps) => {
  const { t } = useTranslation()

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{t('rating.pending_ratings')}</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <RatingForm rating={booking} onSuccess={onClose} />
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
