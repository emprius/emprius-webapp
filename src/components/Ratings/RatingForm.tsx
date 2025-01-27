import {
  Badge,
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Icon,
  Textarea,
  useToast,
  VStack,
} from '@chakra-ui/react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { RatingStars } from '~components/Ratings/RatingStars'
import { useSubmitRating } from './ratingQueries'
import { Rating } from '~components/Ratings/types'
import { useTool } from '~components/Tools/toolsQueries'
import { UserCard } from '~components/User/UserCard'
import { ServerImage } from '~components/Images/ServerImage'
import { FaArrowRight, FaRegCalendarAlt } from 'react-icons/fa'

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

  const datef = t('rating.datef')

  return (
    <Box as='form' onSubmit={handleSubmit(onSubmit)} px={{ base: 2, md: 4 }} py={{ base: 3, md: 5 }}>
      {tool && (
        <Flex direction={{ base: 'column', md: 'row' }} align={{ base: 'center', md: 'stretch' }} gap={4}>
          {tool.images?.[0] && (
            <Box width='100px' height='100px' flexShrink={0} borderRadius='md' overflow='hidden'>
              <ServerImage imageId={tool.images[0]} alt={tool.title} width='100%' height='100%' objectFit='cover' />
            </Box>
          )}
          <VStack align={'start'}>
            <Heading size='md' noOfLines={2}>
              {tool.title}
            </Heading>
            <Badge
              px={2}
              py={1}
              borderRadius='full'
              fontSize='sm'
              fontWeight='medium'
              whiteSpace='normal'
              wordBreak='break-word'
            >
              <Icon as={FaRegCalendarAlt} mr={1} mt={1} />
              {t('rating.date_formatted', { date: rating.startDate * 1000, format: datef })}
              <Icon as={FaArrowRight} mx={2} />
              {t('rating.date_formatted', { date: rating.endDate * 1000, format: datef })}
            </Badge>
            <UserCard
              direction={'row'}
              avatarSize={'sm'}
              userId={rating.toUserId}
              gap={2}
              p={0}
              fontSize={'sm'}
              borderWidth={0}
            />
          </VStack>
        </Flex>
      )}

      <Box borderTopWidth='1px' pt={4} mt={4}>
        <VStack spacing={4} align='stretch'>
          <FormControl>
            <FormLabel fontSize='sm' fontWeight='medium'>
              {t('rating.rate_user')}
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
              placeholder={t('rating.comment_placeholder')}
              resize='vertical'
              minHeight='100px'
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
  )
}
