import { Badge, Box, Button, Flex, FormControl, FormLabel, Heading, Textarea, useToast, VStack } from '@chakra-ui/react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { RatingStars } from '~components/Ratings/RatingStars'
import { useSubmitRating } from './ratingQueries'
import { Rating } from '~components/Ratings/types'
import { useTool } from '~components/Tools/toolsQueries'
import { UserMiniCard } from '~components/User/UserMiniCard'
import { format } from 'date-fns'

interface RatingFormProps {
  rating: Rating
  onSuccess?: () => void
}

interface RatingFormData {
  userRating: number
  comment: string
}

export const RatingForm = ({ rating, onSuccess }: RatingFormProps) => {
  const { t } = useTranslation()
  const submitRating = useSubmitRating()
  const toast = useToast()
  const { data: tool } = useTool(rating.toolId)
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
          title: t('rating.submitSuccess'),
          description: t('rating.submitSuccessDescription'),
          status: 'success',
          duration: 5000,
          isClosable: true,
        })

        onSuccess?.()
      }
    } catch (error) {
      // Show error toast
      toast({
        title: t('rating.submitError'),
        description: t('rating.submitErrorDescription'),
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
      console.error('Error submitting rating:', error)
    }
  }

  return (
    <Box as='form' onSubmit={handleSubmit(onSubmit)}>
      <Box p={6}>
        {tool && (
          <VStack spacing={4} align="stretch">
            <Heading size='md' noOfLines={2}>
              {tool.title}
            </Heading>
            
            <Box>
              <FormLabel fontSize='sm' fontWeight='medium'>
                {t('rating.period')}
              </FormLabel>
              <Badge px={2} py={1} borderRadius='full' fontSize='sm' fontWeight='medium'>
                {format(rating.startDate, 'PP')} - {format(rating.endDate, 'PP')}
              </Badge>
            </Box>

            <Box>
              <FormLabel fontSize='sm' fontWeight='medium'>
                {t('rating.user')}
              </FormLabel>
              <UserMiniCard userId={rating.toUserId} />
            </Box>
          </VStack>
        )}

        <Box borderTopWidth='1px' pt={4} mt={4}>
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
                {t('rating.comment')}
              </FormLabel>
              <Textarea
                value={comment}
                onChange={(e) => setValue('comment', e.target.value)}
                placeholder={t('rating.commentPlaceholder')}
                resize="vertical"
                minHeight="100px"
              />
            </FormControl>

            <Button
              type='submit'
              colorScheme='blue'
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
    </Box>
  )
}
