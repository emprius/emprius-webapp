import {
  Badge,
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Icon,
  Link,
  Skeleton,
  Stack,
  Text,
  Textarea,
  useToast,
  VStack,
} from '@chakra-ui/react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { SetRatingStars } from '~components/Ratings/SetRatingStars'
import { useSubmitRating } from './queries'
import { useTool } from '~components/Tools/queries'
import { ServerImage } from '~components/Images/ServerImage'
import { FaArrowRight, FaRegCalendarAlt } from 'react-icons/fa'
import { UserCard } from '~components/Users/Card'
import React from 'react'
import { MultipleImageSelector } from '~components/Images/MultipleImageSelector'
import FormSubmitMessage from '~components/Layout/Form/FormSubmitMessage'
import { RatingFormData } from '~components/Ratings/types'
import { ImageUploadError } from '~components/Images/queries'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { ROUTES } from '~src/router/routes'
import { ToolImage } from '~components/Tools/shared/ToolImage'
import { useAuth } from '~components/Auth/AuthContext'
import { icons } from '~theme/icons'
import { Booking } from '~components/Bookings/types'

interface RatingFormProps {
  booking: Booking
  onSuccess?: () => void
}

const RatingCardHeader = ({ booking }: { booking: Booking }) => {
  const { t } = useTranslation()
  const { user } = useAuth()
  const { data: tool } = useTool(booking.toolId)
  const datef = t('rating.datef')
  const isOwner = booking.toUserId === user.id
  let otherUser = booking.toUserId
  let title = t('rating.you_got')
  let icon = icons.inbox
  if (isOwner) {
    otherUser = booking.fromUserId
    title = t('rating.you_lent')
    icon = icons.outbox
  }

  return (
    <Flex direction={'column'} gap={2}>
      <HStack color='lighterText' fontSize='sm'>
        <Icon as={icon} />
        <Text>{title}</Text>
      </HStack>
      <Flex direction={'column'} gap={1} align={{ base: 'center', md: 'start' }}>
        <Flex direction={{ base: 'column', md: 'row' }} align={{ base: 'center', md: 'stretch' }} gap={4}>
          <Skeleton isLoaded={!!tool} width='100px' height='100px' flexShrink={0} borderRadius='md'>
            <Box width='100px' height='100px' flexShrink={0} borderRadius='md' overflow='hidden'>
              <ToolImage imageId={tool?.images?.[0] ?? ''} alt={tool?.title} toolId={tool?.id} />
            </Box>
          </Skeleton>
          <Link as={RouterLink} to={ROUTES.BOOKINGS.DETAIL.replace(':id', booking.id)}>
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
          </Link>
        </Flex>
        <UserCard
          direction='row'
          avatarSize='sm'
          userId={otherUser}
          gap={2}
          p={0}
          fontSize='sm'
          borderWidth={0}
          mt={4}
        />
      </Flex>
    </Flex>
  )
}

export const RatingsForm = ({ booking, onSuccess }: RatingFormProps) => {
  const { t } = useTranslation()
  const { data: tool } = useTool(booking.toolId)
  const { error, isError, mutateAsync, isPending } = useSubmitRating({
    bookingId: booking.id,
    onError: (error) => {
      // Image upload errors are handled in the useUploadImages form
      if (error instanceof ImageUploadError) return
      toast({
        title: t('rating.submit_error'),
        description: t('rating.submit_error_description'),
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    },
  })

  const toast = useToast()

  const {
    handleSubmit,
    setValue,
    formState: { errors },
    watch,
    register,
    reset,
  } = useForm<RatingFormData>({
    defaultValues: {
      userRating: 0,
      comment: '',
      images: null,
    },
  })

  const userRating = watch('userRating')
  const comment = watch('comment')

  const navigate = useNavigate()

  const onSubmit = async (data: RatingFormData) => {
    await mutateAsync(data)
    toast({
      title: t('rating.submit_success'),
      description: t('rating.submit_success_description'),
      status: 'success',
      duration: 5000,
      isClosable: true,
    })
    reset({
      userRating: 0,
      comment: '',
      images: null,
    })
    onSuccess?.()
    // Redirect to ratings history page with success parameter and rating info
    navigate(
      `${ROUTES.RATINGS.HISTORY}?submitted=true&toolName=${encodeURIComponent(tool?.title || '')}&rating=${data.userRating}`
    )
  }

  return (
    <Box as='form' onSubmit={handleSubmit(onSubmit)}>
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
            disabled={isPending}
            label={t('tools.images')}
            error={errors.images?.message}
            fileList={watch('images')}
            {...register('images')}
          />

          <Button
            type='submit'
            isLoading={isPending}
            loadingText={t('rating.submitting')}
            isDisabled={!userRating}
            width='full'
          >
            {t('rating.submit')}
          </Button>
          <Stack alignSelf={'end'} p={0}>
            <FormSubmitMessage isError={isError} error={error} pt={0} />
          </Stack>
        </VStack>
      </Box>
    </Box>
  )
}
