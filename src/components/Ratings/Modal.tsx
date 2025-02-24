import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
} from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { RatingsForm } from './Form'
import { Booking } from '~components/Bookings/queries'
import React, { useRef } from 'react'

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
        <ModalHeader>{t('rating.rate')}</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <RatingsForm booking={booking} onSuccess={onClose} />
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export const ReturnAlertDialog = ({
  isOpen,
  onClose,
  onConfirm,
  endDate,
  isLoading,
}: {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  endDate: number
  isLoading: boolean
}) => {
  const cancelRef = useRef<HTMLButtonElement>(null)
  const { t } = useTranslation()

  const expectedDay = new Date(endDate * 1000)
  expectedDay.setHours(0, 0, 0, 0)
  const currentDay = new Date()
  currentDay.setHours(0, 0, 0, 0)

  const isLate = currentDay > expectedDay
  const isEarly = currentDay < expectedDay
  const isOnTime = currentDay === expectedDay
  const datef = t('bookings.datef')

  return (
    <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose}>
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize='lg' fontWeight='bold'>
            {t('bookings.confirm_return')}
          </AlertDialogHeader>

          <AlertDialogBody>
            <HStack mb={4}>
              <Text>{t('bookings.expected_return_date', { date: expectedDay })}</Text>
              <Text fontWeight={'bold'}>
                {t('bookings.date_formatted', {
                  date: expectedDay,
                  format: datef,
                })}
              </Text>
            </HStack>
            {isLate && <Text style={{ color: 'red' }}>{t('bookings.late_return_warning')}</Text>}
            {isEarly && <Text style={{ color: 'orange' }}>{t('bookings.early_return_notice')}</Text>}
            {isOnTime && <Text style={{ color: 'green' }}>{t('bookings.on_time_return_notice')}</Text>}
          </AlertDialogBody>

          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose} disabled={isLoading}>
              {t('common.cancel')}
            </Button>
            <Button colorScheme='green' onClick={onConfirm} ml={3} isLoading={isLoading}>
              {t('common.confirm')}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  )
}
