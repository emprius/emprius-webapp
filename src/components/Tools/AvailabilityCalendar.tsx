import { Box, Heading, Text, useColorModeValue } from '@chakra-ui/react'
import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '~components/Auth/AuthContext'
import { useFormContext } from 'react-hook-form'
import { StyledCalendar } from '~components/Layout/StyledCalendar'
import { DateRange } from '~components/Tools/types'

interface ToolAvailabilityCalendarProps {
  reservedDates: DateRange[]
  toolUserId: string
  isSelectable?: boolean
}

export const AvailabilityCalendar = ({
  reservedDates,
  toolUserId,
  isSelectable = true,
}: ToolAvailabilityCalendarProps) => {
  const { t } = useTranslation()
  const { user } = useAuth()
  const formContext = useFormContext()
  const bgColor = useColorModeValue('white', 'gray.800')

  // Local state for calendar selection
  const [selectedRange, setSelectedRange] = useState<[Date | null, Date | null]>([null, null])
  const [selectionMode, setSelectionMode] = useState<'start' | 'end'>('start')

  // Get form values if form context is available
  const startDateValue = formContext?.watch?.('startDate')
  const endDateValue = formContext?.watch?.('endDate')

  // Update calendar selection when form values change
  useEffect(() => {
    if (formContext && startDateValue) {
      // Create date object and ensure it's treated as a local date
      const [year, month, day] = startDateValue.split('-').map(Number)
      const startDate = new Date(year, month - 1, day)
      setSelectedRange((prev) => [startDate, prev[1]])
      if (!endDateValue) {
        setSelectionMode('end')
      }
    }
  }, [startDateValue, formContext, endDateValue])

  // Reset to start mode after both dates are selected
  useEffect(() => {
    if (formContext && endDateValue) {
      // Create date object and ensure it's treated as a local date
      const [year, month, day] = endDateValue.split('-').map(Number)
      const endDate = new Date(year, month - 1, day)
      setSelectedRange((prev) => [prev[0], endDate])
      setSelectionMode('start')
    }
  }, [endDateValue, formContext])

  const formatDateToString = (date: Date): string => {
    // Use local timezone instead of UTC to prevent date shifting
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  const isDateReserved = (date: Date) => {
    return reservedDates.some((range) => {
      const fromDate = new Date(range.from * 1000)
      const toDate = new Date(range.to * 1000)
      // Set dates time to 00:00:00 to avoid timezone issues
      fromDate.setHours(0, 0, 0, 0)
      toDate.setHours(0, 0, 0, 0)

      return date >= fromDate && date <= toDate
    })
  }

  // Check if there are any reserved dates between start and end
  const hasReservedDatesInRange = (start: Date, end: Date) => {
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      if (isDateReserved(new Date(d))) {
        return true
      }
    }
    return false
  }

  const handleDateClick = (value: Date) => {
    // Only allow selection if user is not the owner and selection is enabled
    if (user?.id === toolUserId || !isSelectable || !formContext) {
      return
    }

    // Prevent selecting reserved dates
    if (isDateReserved(value)) {
      return
    }

    const dateStr = formatDateToString(value)

    if (selectionMode === 'start') {
      // Set start date and switch to end selection mode
      setSelectedRange([value, null])
      setSelectionMode('end')
      formContext.setValue('startDate', dateStr, { shouldValidate: true })
      formContext.setValue('endDate', '', { shouldValidate: true })
      return
    }
    // We're selecting end date
    const startDate = selectedRange[0]

    if (!startDate) {
      // If somehow we don't have a start date, set it
      setSelectedRange([value, null])
      setSelectionMode('end')
      formContext.setValue('startDate', dateStr, { shouldValidate: true })
      return
    }

    // If user clicks on the same day as start date, set both start and end dates to that day
    if (value.toDateString() === startDate.toDateString()) {
      setSelectedRange([value, value])
      setSelectionMode('start')
      formContext.setValue('endDate', dateStr, { shouldValidate: true })
      return
    }

    // If end date is before start date, change start date to the newly selected date
    // Or Check for reserved dates in range
    if (value < startDate || hasReservedDatesInRange(startDate, value)) {
      setSelectedRange([value, null])
      formContext.setValue('startDate', dateStr, { shouldValidate: true })
      formContext.setValue('endDate', '', { shouldValidate: true })
      return
    }

    // Set end date and switch back to start selection mode
    setSelectedRange([startDate, value])
    setSelectionMode('start')
    formContext.setValue('endDate', dateStr, { shouldValidate: true })
  }

  return (
    <Box bg={bgColor} p={6} borderRadius='lg' boxShadow='sm'>
      <Heading size='md' mb={4}>
        {t('tools.availability')}
      </Heading>

      <StyledCalendar
        reservedDates={reservedDates}
        selectedRange={selectedRange}
        onDateClick={handleDateClick}
        isSelectable={isSelectable && user?.id !== toolUserId}
      />

      {user?.id !== toolUserId && isSelectable && (
        <Text fontSize='md' mt={2} color='gray.500'>
          {selectedRange[0] && selectedRange[1]
            ? t('bookings.dates_selected', { defaultValue: 'Dates selected' })
            : selectionMode === 'start'
              ? t('bookings.select_start_date', { defaultValue: 'Select start date' })
              : t('bookings.select_end_date', { defaultValue: 'Select end date' })}
        </Text>
      )}
    </Box>
  )
}
