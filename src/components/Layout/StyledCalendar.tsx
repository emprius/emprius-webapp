import { Box, useColorModeValue, useTheme } from '@chakra-ui/react'
import React from 'react'
import Calendar, { CalendarProps } from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import { DateRange } from '~components/Tools/types'

export type StyledCalendarProps = {
  // Core functionality
  reservedDates?: DateRange[]
  selectedRange?: [Date | null, Date | null]
  onDateClick?: (date: Date) => void
  isSelectable?: boolean
  // Custom styling
  calendarWrapperProps?: React.ComponentProps<typeof Box>
} & CalendarProps

export const StyledCalendar = ({
  reservedDates = [],
  selectedRange = [null, null],
  onDateClick,
  isSelectable = true,
  calendarWrapperProps,
  ...calendarProps
}: StyledCalendarProps) => {
  const theme = useTheme()

  // Colors
  const reservedColor = useColorModeValue(theme.colors.secondary[100], theme.colors.secondary[800])
  const selectedColor = useColorModeValue(theme.colors.primary[200], theme.colors.primary[700])
  const rangeColor = useColorModeValue(theme.colors.primary[50], theme.colors.primary[900])
  const todayColor = useColorModeValue(theme.colors.primary[400], theme.colors.primary[500])
  const navButtonColor = useColorModeValue(theme.colors.primary[500], theme.colors.primary[300])
  const navButtonHoverColor = useColorModeValue(theme.colors.primary[600], theme.colors.primary[200])
  const navButtonDisabledColor = useColorModeValue('gray.300', 'gray.600')
  const navLabelColor = useColorModeValue(theme.colors.primary[700], theme.colors.primary[300])

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

  const tileClassName = ({ date, view }: { date: Date; view: string }) => {
    const classes = []

    // Only apply styling to day view
    if (view === 'month') {
      // Check if date is reserved and identify if it's the first or last date in a reserved range
      if (isDateReserved(date)) {
        // Check if it's the first date in a reserved range
        const isFirstReservedDate = reservedDates.some((range) => {
          const fromDate = new Date(range.from * 1000)
          fromDate.setHours(0, 0, 0, 0)
          return date.getTime() === fromDate.getTime()
        })

        // Check if it's the last date in a reserved range
        const isLastReservedDate = reservedDates.some((range) => {
          const toDate = new Date(range.to * 1000)
          toDate.setHours(0, 0, 0, 0)
          return date.getTime() === toDate.getTime()
        })

        if (isFirstReservedDate && isLastReservedDate) {
          // Single day reservation
          classes.push('reserved-single-date')
        } else if (isFirstReservedDate) {
          classes.push('reserved-start-date')
        } else if (isLastReservedDate) {
          classes.push('reserved-end-date')
        } else {
          classes.push('reserved-date')
        }
      }

      // Don't add selection classes if selection is disabled
      if (!isSelectable) {
        return classes.join(' ')
      }

      const [start, end] = selectedRange

      // Mark selected start date
      if (start && date.toDateString() === start.toDateString()) {
        classes.push('selected-start-date')
      }

      // Mark selected end date
      if (end && date.toDateString() === end.toDateString()) {
        classes.push('selected-end-date')
      }

      // Mark dates in the selected range
      if (start && end && date > start && date < end) {
        classes.push('in-range-date')
      }
    }

    return classes.join(' ')
  }

  const tileDisabled = ({ date, view }: { date: Date; view: string }) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // For year view (showing months)
    if (view === 'year') {
      // Disable months in the past if minDate is not provided
      if (!calendarProps?.minDate) {
        const currentMonth = new Date(today.getFullYear(), today.getMonth(), 1)
        const tileMonth = new Date(date.getFullYear(), date.getMonth(), 1)
        return tileMonth < currentMonth
      }
      return false
    }

    // For day view
    if (view === 'month') {
      // Check against minDate
      if (calendarProps?.minDate && date < calendarProps?.minDate) {
        return true
      }

      // Check against maxDate
      if (calendarProps?.maxDate && date > calendarProps?.maxDate) {
        return true
      }

      // Disable dates in the past if minDate is not provided
      if (!calendarProps?.minDate && date < today) {
        return true
      }

      // If selection is disabled, don't disable any future dates
      if (!isSelectable) {
        return false
      }

      // Disable reserved dates for selection if onDateClick is provided
      return onDateClick ? isDateReserved(date) : false
    }

    // For decade view (showing years), don't disable anything
    return false
  }

  return (
    <Box
      sx={{
        '.reserved-date': {
          backgroundColor: `${reservedColor} !important`,
          borderRadius: '0',
          transition: 'all 0.2s ease',
          '&:hover': {
            backgroundColor: `${useColorModeValue(theme.colors.secondary[200], theme.colors.secondary[700])} !important`,
            transform: isSelectable ? 'scale(1.05)' : 'none',
          },
        },
        '.reserved-start-date': {
          backgroundColor: `${reservedColor} !important`,
          borderTopRightRadius: '0',
          borderBottomRightRadius: '0',
          borderTopLeftRadius: '50% !important',
          borderBottomLeftRadius: '50% !important',
          transition: 'all 0.2s ease',
          '&:hover': {
            backgroundColor: `${useColorModeValue(theme.colors.secondary[200], theme.colors.secondary[700])} !important`,
            transform: isSelectable ? 'scale(1.05)' : 'none',
          },
        },
        '.reserved-end-date': {
          backgroundColor: `${reservedColor} !important`,
          borderTopLeftRadius: '0',
          borderBottomLeftRadius: '0',
          borderTopRightRadius: '50% !important',
          borderBottomRightRadius: '50% !important',
          transition: 'all 0.2s ease',
          '&:hover': {
            backgroundColor: `${useColorModeValue(theme.colors.secondary[200], theme.colors.secondary[700])} !important`,
            transform: isSelectable ? 'scale(1.05)' : 'none',
          },
        },
        '.reserved-single-date': {
          backgroundColor: `${reservedColor} !important`,
          borderRadius: '50% !important',
          transition: 'all 0.2s ease',
          '&:hover': {
            backgroundColor: `${useColorModeValue(theme.colors.secondary[200], theme.colors.secondary[700])} !important`,
            transform: isSelectable ? 'scale(1.05)' : 'none',
          },
        },
        '.selected-start-date': {
          borderTopRightRadius: '0',
          borderBottomRightRadius: '0',
          borderTopLeftRadius: '50% !important',
          borderBottomLeftRadius: '50% !important',
          backgroundColor: `${selectedColor} !important`,
          transition: 'all 0.2s ease',
          '&:hover': {
            backgroundColor: `${useColorModeValue(theme.colors.primary[300], theme.colors.primary[600])} !important`,
            transform: isSelectable ? 'scale(1.05)' : 'none',
          },
        },
        '.selected-end-date': {
          borderTopLeftRadius: '0',
          borderBottomLeftRadius: '0',
          borderTopRightRadius: '50% !important',
          borderBottomRightRadius: '50% !important',
          backgroundColor: `${selectedColor} !important`,
          transition: 'all 0.2s ease',
          '&:hover': {
            backgroundColor: `${useColorModeValue(theme.colors.primary[300], theme.colors.primary[600])} !important`,
            transform: isSelectable ? 'scale(1.05)' : 'none',
          },
        },
        '.in-range-date': {
          backgroundColor: `${rangeColor} !important`,
          transition: 'all 0.2s ease',
          '&:hover': {
            backgroundColor: `${useColorModeValue(theme.colors.primary[100], theme.colors.primary[800])} !important`,
            transform: isSelectable ? 'scale(1.05)' : 'none',
          },
        },
        '.react-calendar': {
          width: '100%',
          border: 'none',
          backgroundColor: 'transparent',
          fontFamily: 'inherit',
        },
        '.react-calendar__tile': {
          padding: '1em 0.5em',
          cursor: isSelectable ? 'pointer' : 'default',
          transition: 'all 0.2s ease',
          position: 'relative',
          '&:hover': {
            backgroundColor: isSelectable ? useColorModeValue('gray.100', 'gray.700') : 'transparent',
            transform: isSelectable ? 'scale(1.05)' : 'none',
            borderRadius: '4px',
          },
          '&:disabled': {
            opacity: 0.5,
            cursor: 'not-allowed',
            '&:hover': {
              transform: 'none',
            },
          },
        },
        '.react-calendar__tile--now': {
          backgroundColor: 'transparent !important',
          color: `${todayColor} !important`,
          fontWeight: 'bold',
          position: 'relative',
          '&::after': {
            content: '""',
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '80%',
            height: '80%',
            borderRadius: '50%',
            border: `2px solid ${todayColor}`,
            zIndex: 0,
          },
        },
        // Special styling for when today is also selected as start or end date
        '.react-calendar__tile--now.selected-start-date': {
          backgroundColor: `${selectedColor} !important`,
          color: useColorModeValue('black', 'white') + ' !important',
          borderTopRightRadius: '0 !important',
          borderBottomRightRadius: '0 !important',
          borderTopLeftRadius: '50% !important',
          borderBottomLeftRadius: '50% !important',
          '&::after': {
            border: `2px solid ${useColorModeValue(theme.colors.primary[600], theme.colors.primary[300])}`,
            width: '90%',
            height: '90%',
            borderRadius: '50% 0 0 50%',
          },
        },
        '.react-calendar__tile--now.selected-end-date': {
          backgroundColor: `${selectedColor} !important`,
          color: useColorModeValue('black', 'white') + ' !important',
          borderTopLeftRadius: '0 !important',
          borderBottomLeftRadius: '0 !important',
          borderTopRightRadius: '50% !important',
          borderBottomRightRadius: '50% !important',
          '&::after': {
            border: `2px solid ${useColorModeValue(theme.colors.primary[600], theme.colors.primary[300])}`,
            width: '90%',
            height: '90%',
            borderRadius: '0 50% 50% 0',
          },
        },
        '.react-calendar__tile--now.in-range-date': {
          backgroundColor: `${rangeColor} !important`,
          '&::after': {
            border: `2px solid ${todayColor}`,
          },
        },
        '.react-calendar__month-view__days__day--weekend': {
          color: 'inherit',
        },
        '.react-calendar__navigation': {
          marginBottom: '1rem',
        },
        '.react-calendar__navigation button': {
          color: navLabelColor,
          borderRadius: '4px',
          transition: 'all 0.2s ease',
          '&:hover': {
            backgroundColor: useColorModeValue('gray.100', 'gray.700'),
          },
          '&:disabled': {
            color: navButtonDisabledColor,
            cursor: 'not-allowed',
          },
        },
        '.react-calendar__navigation__arrow': {
          color: navButtonColor,
          '&:hover:not(:disabled)': {
            color: navButtonHoverColor,
            backgroundColor: useColorModeValue('gray.100', 'gray.700'),
          },
        },
        '.react-calendar__navigation__label': {
          fontWeight: 'bold',
          color: navLabelColor,
        },
        '.react-calendar__month-view__weekdays__weekday': {
          color: useColorModeValue(theme.colors.primary[600], theme.colors.primary[300]),
          fontWeight: 'bold',
          textDecoration: 'none',
          abbr: {
            textDecoration: 'none',
          },
        },
      }}
      {...calendarWrapperProps}
    >
      <Calendar tileClassName={tileClassName} tileDisabled={tileDisabled} onClickDay={onDateClick} {...calendarProps} />
    </Box>
  )
}
