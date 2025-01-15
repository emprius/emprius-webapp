import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Box, Button, FormControl, FormLabel, useToast, VStack } from '@chakra-ui/react'
import { RatingStars } from '../../../components/shared/Rating/RatingStars'
import { useSubmitRating } from '../bookingQueries'

interface RatingFormProps {
  bookingId: number
  onSuccess?: () => void
}

interface RatingFormData {
  userRating: number
  toolRating: number
}

export const RatingForm = ({ bookingId, onSuccess }: RatingFormProps) => {
  const { t } = useTranslation()
  const submitRating = useSubmitRating()
  const toast = useToast()
  const { handleSubmit, setValue, watch } = useForm<RatingFormData>({
    defaultValues: {
      userRating: 0,
      toolRating: 0,
    },
  })

  const userRating = watch('userRating')
  const toolRating = watch('toolRating')

  const onSubmit = async (data: RatingFormData) => {
    try {
      let submittedCount = 0

      // Submit user rating if provided
      if (data.userRating > 0) {
        await submitRating.mutateAsync({
          bookingId,
          rating: data.userRating,
          ratingType: 'USER',
        })
        submittedCount++
      }

      // Submit tool rating if provided
      if (data.toolRating > 0) {
        await submitRating.mutateAsync({
          bookingId,
          rating: data.toolRating,
          ratingType: 'TOOL',
        })
        submittedCount++
      }

      // Show success toast
      toast({
        title: t('rating.submitSuccess'),
        description: t('rating.submitSuccessDescription', { count: submittedCount }),
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: 'top',
      })

      onSuccess?.()
    } catch (error) {
      // Show error toast
      toast({
        title: t('rating.submitError'),
        description: t('rating.submitErrorDescription'),
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top',
      })
      console.error('Error submitting rating:', error)
    }
  }

  return (
    <Box as='form' onSubmit={handleSubmit(onSubmit)}>
      <VStack spacing={4} align='stretch'>
        <FormControl>
          <FormLabel fontSize='sm' fontWeight='medium'>
            {t('rating.rateUser')}
          </FormLabel>
          <RatingStars
            initialRating={userRating}
            onRatingChange={(rating) => setValue('userRating', rating)}
            size='md'
          />
        </FormControl>

        <FormControl>
          <FormLabel fontSize='sm' fontWeight='medium'>
            {t('rating.rateTool')}
          </FormLabel>
          <RatingStars
            initialRating={toolRating}
            onRatingChange={(rating) => setValue('toolRating', rating)}
            size='md'
          />
        </FormControl>

        <Button
          type='submit'
          colorScheme='blue'
          isLoading={submitRating.status === 'pending'}
          loadingText={t('rating.submitting')}
          // spinner={<Spinner size="sm" color="white" />}
          isDisabled={!userRating && !toolRating}
          width='full'
        >
          {t('rating.submit')}
        </Button>
      </VStack>
    </Box>
  )
}
