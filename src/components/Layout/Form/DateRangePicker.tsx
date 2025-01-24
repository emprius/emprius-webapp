import { Box, FormControl, FormErrorMessage, FormLabel, Input, Stack, useColorModeValue } from '@chakra-ui/react'
import React from 'react'
import { Control, useController } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

export interface DateRange {
  from: number
  to: number
}

interface DateRangePickerProps {
  startName: string
  endName: string
  control: Control<any>
  label?: string
  isRequired?: boolean
  minDate?: Date
  maxDate?: Date
  reservedDates?: DateRange[] | null
}

export const DateRangePicker = ({
  startName,
  endName,
  control,
  label,
  isRequired = false,
  minDate = new Date(),
  maxDate,
  reservedDates,
}: DateRangePickerProps) => {
  const { t } = useTranslation()
  const borderColor = useColorModeValue('gray.200', 'gray.600')

  const isDateRangeOverlapping = (start: Date, end: Date) => {
    if (!reservedDates) return false

    return reservedDates.some((reservation) => {
      const reservationStart = new Date(reservation.from * 1000)
      const reservationEnd = new Date(reservation.to * 1000)

      // Check if either the start or end date falls within a reserved period
      return (
        (start >= reservationStart && start <= reservationEnd) ||
        (end >= reservationStart && end <= reservationEnd) ||
        // Or if the selected period completely encompasses a reserved period
        (start <= reservationStart && end >= reservationEnd)
      )
    })
  }

  const {
    field: startField,
    fieldState: { error: startError },
  } = useController({
    name: startName,
    control,
    rules: {
      required: isRequired && t('validation.required', { field: t('bookings.start_date') }),
    },
  })

  const {
    field: endField,
    fieldState: { error: endError },
  } = useController({
    name: endName,
    control,
    rules: {
      required: isRequired && t('validation.required', { field: t('bookings.end_date') }),
      validate: (value) => {
        if (!startField.value) return true
        const start = new Date(startField.value)
        const end = new Date(value)

        if (end <= start) {
          return t('validation.end_date_after_start')
        }

        if (isDateRangeOverlapping(start, end)) {
          return t('bookings.date_conflict')
        }

        return true
      },
    },
  })

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0]
  }

  const handleStartChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    startField.onChange(e.target.value)
    // Reset end date if it's before new start date
    if (endField.value && new Date(endField.value) <= new Date(e.target.value)) {
      endField.onChange('')
    }
  }

  return (
    <FormControl isInvalid={!!startError || !!endError} isRequired={isRequired}>
      {label && <FormLabel>{label}</FormLabel>}
      <Stack direction={{ base: 'column', sm: 'row' }} spacing={4}>
        <Box flex={1}>
          <Input
            type='date'
            {...startField}
            onChange={handleStartChange}
            min={formatDate(minDate)}
            max={maxDate ? formatDate(maxDate) : undefined}
            borderColor={borderColor}
          />
          {startError && <FormErrorMessage>{startError.message}</FormErrorMessage>}
        </Box>
        <Box flex={1}>
          <Input
            type='date'
            {...endField}
            min={startField.value || formatDate(minDate)}
            max={maxDate ? formatDate(maxDate) : undefined}
            borderColor={borderColor}
          />
          {endError && <FormErrorMessage>{endError.message}</FormErrorMessage>}
        </Box>
      </Stack>
    </FormControl>
  )
}
