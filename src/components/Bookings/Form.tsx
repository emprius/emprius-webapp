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
import { useForm, UseFormWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useCreateBooking } from '~components/Bookings/queries'
import { DateRangeTotal } from '~components/Layout/Dates'
import { DateRangePicker } from '~components/Layout/Form/DateRangePicker'
import { Tool } from '~components/Tools/types'
import { ROUTES } from '~src/router/routes'
import { TOOL_MAX_DATE_BOOKING } from '~utils/constants'
import { addDayToDate, getDaysBetweenDates } from '~utils/dates'

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
    watch,
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
          <TotalPrice tool={tool} watch={watch} />
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

const calculateTotalDays = (startDate: string, endDate: string): number => {
  if (!startDate || !endDate) return 0
  const start = new Date(startDate)
  const end = new Date(endDate)
  const diffTime = Math.abs(end.getTime() - start.getTime())
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1 // +1 to include both start and end days
}

const TotalPrice = ({ tool, watch }: { tool: Tool; watch: UseFormWatch<BookingFormData> }) => {
  const { t } = useTranslation()
  const begin = watch('startDate')
  const end = watch('endDate')

  if (tool.cost === 0) {
    return (
      <Text fontSize='md' color='primary.500'>
        {t('tools.tool_is_free', { defaultValue: 'This tool is free!' })}
      </Text>
    )
  }

  if (!begin || !end) {
    return null
  }

  const endDate = addDayToDate(end)
  const date = { begin: new Date(begin), end: endDate }

  return (
    <Stack spacing={1}>
      <Text fontSize='lg' fontWeight='bold' color='primary.500'>
        {t('tools.total_cost', {
          total: getDaysBetweenDates(begin, endDate) * tool.cost,
          defaultValue: 'Request for {{total}} {{,tokenSymbol}}',
        })}
      </Text>
      <DateRangeTotal {...date} />
    </Stack>
  )
}
