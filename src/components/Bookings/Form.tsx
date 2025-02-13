import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Stack,
  Text,
  Textarea,
  useColorModeValue,
  useToast,
} from '@chakra-ui/react'
import React from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useCreateBooking } from '~components/Bookings/queries'
import { DateRangePicker } from '~components/Layout/Form/DateRangePicker'
import { Tool } from '~components/Tools/types'
import { ROUTES } from '~src/router/routes'
import { lightText } from '~theme/common'
import { TOOL_MAX_DATE_BOOKING } from '~utils/constants'

interface BookingFormProps {
  tool: Tool
}

// Form data uses strings since DateRangePicker returns strings
interface BookingFormData {
  startDate: string
  endDate: string
  contact?: string
  comments?: string
}

export const BookingForm = ({ tool }: BookingFormProps) => {
  const { t } = useTranslation()
  const toast = useToast()
  const navigate = useNavigate()
  const bgColor = useColorModeValue('white', 'gray.800')

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BookingFormData>({
    defaultValues: {
      startDate: '',
      endDate: '',
      contact: '',
      comments: '',
    },
    mode: 'onChange',
  })

  const formatDateForApi = (date: string): number => {
    return Math.floor(new Date(date).getTime() / 1000)
  }

  const createBooking = useCreateBooking()

  const onSubmit = async (formData: BookingFormData) => {
    try {
      const bookingData = {
        toolId: tool.id.toString(),
        startDate: formatDateForApi(formData.startDate),
        endDate: formatDateForApi(formData.endDate),
        contact: formData.contact,
        comments: formData.comments,
      }

      await createBooking.mutateAsync(bookingData)

      toast({
        title: t('bookings.success'),
        status: 'success',
        duration: 3000,
      })

      navigate(ROUTES.PROFILE.VIEW)
    } catch (error) {
      console.error('Failed to create booking:', error)
      toast({
        title: t('bookings.error'),
        description: t('bookings.try_again'),
        status: 'error',
        duration: 5000,
      })
    }
  }

  // Get today's date for minDate since there's no availability in the Tool model
  const minDate = new Date()
  // Set maxDate
  const maxDate = new Date()
  maxDate.setMonth(maxDate.getMonth() + TOOL_MAX_DATE_BOOKING)

  return (
    <Box as='form' onSubmit={handleSubmit(onSubmit)} bg={bgColor} p={6} borderRadius='lg' boxShadow='sm'>
      <Stack spacing={6}>
        <Stack spacing={4}>
          <DateRangePicker
            control={control}
            startName='startDate'
            endName='endDate'
            label={t('bookings.dates')}
            isRequired
            minDate={minDate}
            maxDate={maxDate}
            reservedDates={tool.reservedDates}
          />

          <FormControl>
            <FormLabel>{t('bookings.contact')}</FormLabel>
            <Input
              {...register('contact', {
                maxLength: {
                  value: 100,
                  message: t('validation.max_length', { max: 100 }),
                },
              })}
              placeholder={t('bookings.contact_placeholder')}
            />
            {errors.contact && <FormErrorMessage>{errors.contact.message}</FormErrorMessage>}
          </FormControl>

          <FormControl>
            <FormLabel>{t('bookings.comments')}</FormLabel>
            <Textarea
              {...register('comments', {
                maxLength: {
                  value: 500,
                  message: t('validation.max_length', { max: 500 }),
                },
              })}
              placeholder={t('bookings.comments_placeholder')}
              rows={4}
            />
            {errors.comments && <FormErrorMessage>{errors.comments.message}</FormErrorMessage>}
          </FormControl>
          <Text fontSize='sm' sx={lightText}>
            {t('tools.price_per_day_desc', { cost: tool.cost, defaultValue: 'Price per day: {{cost}}/ECO' })}
          </Text>
          {tool.cost === 0 && (
            <Text fontSize='sm' color='primary.500'>
              {t('tools.tool_is_free', { defaultValue: 'This tool is free' })}
            </Text>
          )}
        </Stack>

        <Button
          type='submit'
          colorScheme='primary'
          size='lg'
          isLoading={createBooking.isPending}
          isDisabled={!tool.isAvailable}
        >
          {t('bookings.book')}
        </Button>
      </Stack>
    </Box>
  )
}
