import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Button,
  Flex,
  HStack,
  Icon,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { RatingsForm } from './Form'
import { Booking } from '~components/Bookings/queries'
import React, { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { BiSolidParty } from 'react-icons/bi'
import { ShowRatingStars } from '~components/Ratings/ShowRatingStars'

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

export const PickedAlertDialog = ({
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
    <AlertDialog isOpen={isOpen} leastDestructiveRef={React.useRef(null)} onClose={onClose}>
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize='lg' fontWeight='bold'>
            {t('bookings.picked_dialog_title', { defaultValue: 'Mark as picked' })}
          </AlertDialogHeader>

          <AlertDialogBody>
            {t('bookings.picked_dialog_message', {
              defaultValue: 'Are you sure you want to mark this tool as picked?',
            })}
            <HStack mb={4}>
              <Text>{t('bookings.expected_pick_date', { date: expectedDay })}</Text>
              <Text fontWeight={'bold'}>
                {t('bookings.date_formatted', {
                  date: expectedDay,
                  format: datef,
                })}
              </Text>
            </HStack>
            {isLate && <Text style={{ color: 'red' }}>{t('bookings.late_pick_warning')}</Text>}
            {isEarly && <Text style={{ color: 'orange' }}>{t('bookings.early_pick_notice')}</Text>}
            {isOnTime && <Text style={{ color: 'green' }}>{t('bookings.on_time_pick_notice')}</Text>}
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button onClick={onClose} disabled={isLoading}>
              {t('common.cancel')}
            </Button>
            <Button colorScheme='blue' onClick={onConfirm} ml={3} isLoading={isLoading}>
              {t('bookings.picked_dialog_confirm', { defaultValue: 'Mark as picked' })}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  )
}

// Success Modal component
export const SuccessModal = () => {
  const { t } = useTranslation()
  // const [searchParams] = useSearchParams()
  const [searchParams, setSearchParams] = useSearchParams()
  const toolName = searchParams.get('toolName') || ''
  // Convert rating from 1-5 scale to 0-100 scale for ShowRatingStars
  const ratingValue = parseInt(searchParams.get('rating') || '0')
  const rating = ratingValue * 20 // Convert from 1-5 scale to 0-100 scale
  const [showSuccessModal, setShowSuccessModal] = useState(false)

  // Shows success modal when redirected from rating submission
  useEffect(() => {
    if (searchParams.get('submitted') === 'true') {
      setShowSuccessModal(true)
      // We don't remove the parameters here to allow the modal to access them
      // They will be removed when the modal is closed
    }
  }, [searchParams, setSearchParams])

  // Handle modal close and clean up URL parameters
  const handleModalClose = () => {
    setShowSuccessModal(false)
    // Remove the query parameters to prevent showing the modal on refresh
    searchParams.delete('submitted')
    searchParams.delete('toolName')
    searchParams.delete('rating')
    setSearchParams(searchParams)
  }
  return (
    <Modal isOpen={showSuccessModal} onClose={handleModalClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{t('rating.submit_success')}</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <Flex direction='column' align='center' gap={4}>
            <Box color='green.500' fontSize='4xl'>
              <Icon as={BiSolidParty} />
            </Box>
            <Text fontWeight='bold' textAlign='center' mb={2}>
              {t('rating.your_rating_for', { toolName }) || `Your rating for ${toolName} was submitted successfully`}
            </Text>
            <ShowRatingStars rating={rating} size='lg' />
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
