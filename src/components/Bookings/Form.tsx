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
import { useFormContext, UseFormWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useCreateBooking } from '~components/Bookings/queries'
import { DateRangeTotal } from '~components/Layout/Dates'
import { Tool } from '~components/Tools/types'
import { ROUTES } from '~src/router/routes'
import { TOOL_MAX_DATE_BOOKING } from '~utils/constants'
import { addDayToDate, DateToEpoch, getDaysBetweenDates } from '~utils/dates'
import FormSubmitMessage from '~components/Layout/Form/FormSubmitMessage'
import { useAuth } from '~components/Auth/AuthContext'

// Form data uses strings since DateRangePicker returns strings
export interface BookingFormData {
  startDate: string
  endDate: string
  contact?: string
  comments?: string
}

interface BookingFormProps {
  tool: Tool
}

export const BookingForm = ({ tool }: BookingFormProps) => {
  const { t } = useTranslation()
  const toast = useToast()
  const navigate = useNavigate()
  const bgColor = useColorModeValue('white', 'gray.800')
  const { user } = useAuth()
  const isOwner = user?.id === tool.userId

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useFormContext<BookingFormData>()

  const { mutateAsync, isError, isPending, error } = useCreateBooking()

  const onSubmit = async (formData: BookingFormData) => {
    try {
      const bookingData = {
        toolId: tool.id.toString(),
        startDate: DateToEpoch(formData.startDate),
        endDate: DateToEpoch(formData.endDate),
        contact: formData.contact,
        comments: formData.comments,
      }

      await mutateAsync(bookingData)

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

  const startDateValue = watch('startDate')
  const endDateValue = watch('endDate')

  // console.log('AAA startDateValue form', startDateValue)
  return (
    <Box as='form' onSubmit={handleSubmit(onSubmit)} bg={bgColor} p={6} borderRadius='lg' boxShadow='sm'>
      <Stack spacing={6}>
        <Stack spacing={4}>
          {isOwner ? (
            // Show DateRangePicker for owner
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
          ) : (
            // Show selected dates as text for non-owner
            <FormControl isRequired isInvalid={!!errors.startDate || !!errors.endDate}>
              <FormLabel>{t('bookings.dates')}</FormLabel>
              <Box
                p={3}
                borderWidth={1}
                borderRadius='md'
                borderColor={!startDateValue || !endDateValue ? 'red.300' : 'gray.200'}
              >
                {startDateValue && endDateValue ? (
                  <Stack spacing={1}>
                    <DateRangeTotal begin={new Date(startDateValue)} end={addDayToDate(endDateValue)} />
                    <Stack direction='row' spacing={2} mt={1}>
                      <Text fontWeight='bold'>{t('bookings.from', { defaultValue: 'From' })}:</Text>
                      <Text>
                        {new Date(startDateValue).toLocaleDateString(undefined, {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </Text>
                    </Stack>
                    <Stack direction='row' spacing={2}>
                      <Text fontWeight='bold'>{t('bookings.to', { defaultValue: 'To' })}:</Text>
                      <Text>
                        {new Date(endDateValue).toLocaleDateString(undefined, {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </Text>
                    </Stack>
                  </Stack>
                ) : (
                  <Text color='gray.500'>
                    {t('bookings.select_dates_on_calendar', { defaultValue: 'Please select dates on the calendar' })}
                  </Text>
                )}
              </Box>
              {(!startDateValue || !endDateValue) && (
                <FormErrorMessage>{t('validation.required', { field: t('bookings.dates') })}</FormErrorMessage>
              )}
            </FormControl>
          )}

          <FormControl isInvalid={!!errors.contact}>
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
            <FormErrorMessage>{errors.contact?.message?.toString()}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={!!errors.comments}>
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
            <FormErrorMessage>{errors.comments?.message?.toString()}</FormErrorMessage>
          </FormControl>
          <TotalPrice tool={tool} watch={watch} />
        </Stack>
        <FormSubmitMessage isError={isError} error={error} />
        <Button type='submit' colorScheme='primary' size='lg' isLoading={isPending} isDisabled={!tool.isAvailable}>
          {t('bookings.book')}
        </Button>
      </Stack>
    </Box>
  )
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
