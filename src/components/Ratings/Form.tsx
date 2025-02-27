import {
  Badge,
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Icon,
  Skeleton,
  Textarea,
  useToast,
  VStack,
} from '@chakra-ui/react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { SetRatingStars } from '~components/Ratings/SetRatingStars'
import { useSubmitRating } from './queries'
import { Booking } from '~components/Bookings/queries'
import { useTool } from '~components/Tools/queries'
import { ServerImage } from '~components/Images/ServerImage'
import { FaArrowRight, FaRegCalendarAlt } from 'react-icons/fa'
import { UserCard } from '~components/Users/Card'
import React from 'react'
import { MultipleImageSelector } from '~components/Images/MultipleImageSelector'
import { useUploadImages } from '~components/Images/queries'

interface RatingFormProps {
  booking: Booking
  onSuccess?: () => void
}

interface RatingFormData {
  userRating: number
  comment: string
  images?: FileList
  imageHashes?: string[]
}

const RatingCardHeader = ({ booking }: { booking: Booking }) => {
  const { t } = useTranslation()
  const { data: tool } = useTool(booking.toolId)
  const datef = t('rating.datef')
  return (
    <>
      <Flex direction={{ base: 'column', md: 'row' }} align={{ base: 'center', md: 'stretch' }} gap={4}>
        <Skeleton isLoaded={!!tool} width='100px' height='100px' flexShrink={0} borderRadius='md'>
          {tool?.images?.[0] && (
            <Box width='100px' height='100px' flexShrink={0} borderRadius='md' overflow='hidden'>
              <ServerImage
                imageId={tool.images[0]}
                alt={tool.title}
                width='100%'
                height='100%'
                objectFit='cover'
                thumbnail
              />
            </Box>
          )}
        </Skeleton>
        <VStack align='start'>
          <Skeleton isLoaded={!!tool}>
            <Heading size='md' noOfLines={2}>
              {tool?.title}
            </Heading>
          </Skeleton>
          <Badge px={2} py={1} borderRadius='full'>
            <Flex align='center' wrap='wrap' fontSize='sm' fontWeight='medium'>
              <Icon as={FaRegCalendarAlt} mr={1} mt={1} />
              {t('rating.date_formatted', { date: booking.startDate * 1000, format: datef })}
              <Icon as={FaArrowRight} mx={2} />
              {t('rating.date_formatted', { date: booking.endDate * 1000, format: datef })}
            </Flex>
          </Badge>
        </VStack>
      </Flex>
      <UserCard
        direction='row'
        avatarSize='sm'
        userId={booking.toUserId}
        gap={2}
        p={0}
        fontSize='sm'
        borderWidth={0}
        mt={4}
      />
    </>
  )
}

export const RatingsForm = ({ booking, onSuccess }: RatingFormProps) => {
  const { t } = useTranslation()
  const submitRating = useSubmitRating({ bookingId: booking.id })
  const uploadImages = useUploadImages()
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
        // Upload images if any
        let imageHashes: string[] = []
        if (data.images && data.images.length > 0) {
          try {
            imageHashes = await uploadImages.mutateAsync(data.images)
          } catch (imageError) {
            console.error('Error uploading images:', imageError)
            toast({
              title: t('rating.image_upload_error'),
              description: t('rating.image_upload_error_description'),
              status: 'error',
              duration: 5000,
              isClosable: true,
            })
          }
        }

        // Submit rating with image hashes
        await submitRating.mutateAsync({
          bookingId: booking.id,
          rating: data.userRating,
          comment: data.comment,
          images: imageHashes.length > 0 ? imageHashes : undefined,
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
      <RatingCardHeader booking={booking} />
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

          <MultipleImageSelector
            name='images'
            onChange={(e) => setValue('images', e.target.files || undefined)}
            onBlur={() => {}}
            label={t('rating.images')}
          />

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
