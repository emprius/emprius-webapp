import { Box, Button, FormControl, FormLabel, Textarea, useToast, VStack } from '@chakra-ui/react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { SetRatingStars } from '~components/Ratings/SetRatingStars'
import { Rating } from '~components/Ratings/types'
import { useSubmitRating } from './queries'
import { RatingCardHeader } from '~components/Ratings/Card'

interface RatingFormProps {
  rating: Rating
  onSuccess?: () => void
}

interface RatingFormData {
  userRating: number
  comment: string
}

export const RatingsForm = ({ rating, onSuccess }: RatingFormProps) => {
  const { t } = useTranslation()
  const submitRating = useSubmitRating()
  const toast = useToast()
  const { handleSubmit, setValue, watch } = useForm<RatingFormData>({
    defaultValues: {
      userRating: 0,
      comment: '',
    },
  })

  const userRating = watch('userRating')
  const comment = watch('comment')

  const onSubmit = async (data: RatingFormData) => {
    try {
      if (data.userRating > 0) {
        await submitRating.mutateAsync({
          bookingId: rating.id,
          rating: data.userRating,
          comment: data.comment,
        })

        // Show success toast
        toast({
          title: t('rating.submit_success'),
          description: t('rating.submit_success_description'),
          status: 'success',
          duration: 5000,
          isClosable: true,
        })

        onSuccess?.()
      }
    } catch (error) {
      // Show error toast
      toast({
        title: t('rating.submit_error'),
        description: t('rating.submit_error_description'),
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
      console.error('Error submitting rating:', error)
    }
  }

  return (
    <Box as='form' onSubmit={handleSubmit(onSubmit)} px={{ base: 2, md: 4 }} py={{ base: 3, md: 5 }}>
      <RatingCardHeader rating={rating} />
      <Box borderTopWidth='1px' pt={4} mt={4}>
        <VStack spacing={4} align='stretch'>
          <FormControl>
            <FormLabel fontSize='sm' fontWeight='medium'>
              {t('rating.rate_user')}
            </FormLabel>
            <SetRatingStars
              initialRating={userRating}
              onRatingChange={(rating) => setValue('userRating', rating)}
              size='md'
            />
          </FormControl>

          <FormControl>
            <FormLabel fontSize='sm' fontWeight='medium'>
              {t('rating.comment')}
            </FormLabel>
            <Textarea
              value={comment}
              onChange={(e) => setValue('comment', e.target.value)}
              placeholder={t('rating.comment_placeholder')}
              resize='vertical'
              minHeight='100px'
            />
          </FormControl>

          <Button
            type='submit'
            isLoading={submitRating.status === 'pending'}
            loadingText={t('rating.submitting')}
            isDisabled={!userRating}
            width='full'
          >
            {t('rating.submit')}
          </Button>
        </VStack>
      </Box>
    </Box>
  )
}
