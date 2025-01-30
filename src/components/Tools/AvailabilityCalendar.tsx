import { Box, Heading, useColorModeValue } from '@chakra-ui/react'
import React from 'react'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import { useTranslation } from 'react-i18next'
import { DateRange } from '~components/Layout/Form/DateRangePicker'

interface ToolAvailabilityCalendarProps {
  reservedDates: DateRange[]
}

export const AvailabilityCalendar = ({ reservedDates }: ToolAvailabilityCalendarProps) => {
  const { t } = useTranslation()
  const bgColor = useColorModeValue('white', 'gray.800')
  const reservedColor = useColorModeValue('red.100', 'red.900')

  const isDateReserved = (date: Date) => {
    return reservedDates.some((range) => {
      const fromDate = new Date(range.from * 1000)
      const toDate = new Date(range.to * 1000)
      return date >= fromDate && date <= toDate
    })
  }

  const tileClassName = ({ date }: { date: Date }) => {
    return isDateReserved(date) ? 'reserved-date' : ''
  }

  return (
    <Box
      bg={bgColor}
      p={6}
      borderRadius='lg'
      boxShadow='sm'
      sx={{
        '.reserved-date': {
          backgroundColor: reservedColor,
          '&:hover': {
            backgroundColor: reservedColor,
          },
        },
        '.react-calendar': {
          width: '100%',
          border: 'none',
          backgroundColor: 'transparent',
        },
        '.react-calendar__tile': {
          padding: '1em 0.5em',
        },
        '.react-calendar__month-view__days__day--weekend': {
          color: 'inherit',
        },
      }}
    >
      <Heading size='md' mb={4}>
        {t('tools.availability')}
      </Heading>
      <Calendar tileClassName={tileClassName} value={null} locale='en-US' />
    </Box>
  )
}
