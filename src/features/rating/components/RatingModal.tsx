import {
  Button,
  FormControl,
  FormLabel,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Textarea,
  useToast,
  VStack,
} from '@chakra-ui/react'
import React from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useCreateRating } from '../../../hooks/queries'
import { RatingStars } from './RatingStars'

interface RatingModalProps {
  isOpen: boolean
  onClose: () => void
  toolId: number
  bookingId: string
}

interface RatingFormData {
  rating: number
  comment: string
}

export const RatingModal = ({ isOpen, onClose, toolId, bookingId }: RatingModalProps) => {
  const { t } = useTranslation()
  const toast = useToast()
  const createRating = useCreateRating()

  const {
    register,
    handleSubmit,
    setValue,
    formState: { isSubmitting },
  } = useForm<RatingFormData>({
    defaultValues: {
      rating: 0,
      comment: '',
    },
  })

  const handleRatingChange = (rating: number) => {
    setValue('rating', rating)
  }

  const onSubmit = async (data: RatingFormData) => {
    try {
      await createRating.mutateAsync({
        toolId,
        bookingId,
        data: {
          rating: data.rating,
          comment: data.comment,
        },
      })

      toast({
        title: t('rating.success'),
        status: 'success',
        duration: 3000,
      })

      onClose()
    } catch (error) {
      console.error('Failed to submit rating:', error)
      toast({
        title: t('rating.error'),
        description: t('rating.tryAgain'),
        status: 'error',
        duration: 5000,
      })
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{t('rating.title')}</ModalHeader>
        <ModalCloseButton />

        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalBody>
            <VStack spacing={6}>
              <FormControl isRequired>
                <FormLabel>{t('rating.stars')}</FormLabel>
                <RatingStars rating={0} isInteractive size='lg' onChange={handleRatingChange} />
              </FormControl>

              <FormControl>
                <FormLabel>{t('rating.comment')}</FormLabel>
                <Textarea
                  {...register('comment')}
                  placeholder={t('rating.commentPlaceholder')}
                  resize='vertical'
                  rows={4}
                />
              </FormControl>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button variant='ghost' mr={3} onClick={onClose}>
              {t('common.cancel')}
            </Button>
            <Button type='submit' isLoading={isSubmitting} loadingText={t('common.submitting')}>
              {t('rating.submit')}
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  )
}
