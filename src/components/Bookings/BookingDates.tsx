import { Flex, HStack, Icon, Stack, StackProps, Text } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { FaArrowRight } from 'react-icons/fa'
import { DateRangeTotal } from '~components/Layout/Dates'
import { lighterText, lightText } from '~theme/common'
import { addDayToDate } from '~utils/dates'
import { useMemo } from 'react'
import { icons } from '~theme/icons'
import { Booking, BookingStatus } from '~components/Bookings/types'

interface BookingDatesProps {
  booking: Booking
}

export const BookingDates = ({ booking }: BookingDatesProps) => {
  const { t } = useTranslation()

  const begin = new Date(booking.startDate * 1000)
  const end = new Date(booking.endDate * 1000)
  const datef = t('rating.datef')

  return (
    <Stack spacing={1}>
      <Flex align={'center'} fontSize='md' wrap={'wrap'} sx={lightText}>
        {t('bookings.date_formatted', { date: begin, format: datef })}
        <Icon as={FaArrowRight} mx={2} />
        {t('bookings.date_formatted', { date: end, format: datef })}
      </Flex>
      <DateRangeTotal begin={begin} end={addDayToDate(end)} />
    </Stack>
  )
}

// Custom component for dynamic booking title based on timing
export const BookingStatusTitle = ({
  booking,
  isRequest,
  ...props
}: {
  booking: Booking
  isRequest: boolean
} & StackProps) => {
  const { t } = useTranslation()
  const now = new Date().getTime() / 1000 // Current time in seconds
  const startDate = booking.startDate // Already in seconds
  const endDate = booking.endDate // Already in seconds

  // Determine booking timing status
  const title = useMemo(() => {
    let text = isRequest ? t('bookings.tool_request_title') : t('bookings.tool_petition_title')
    if (booking.bookingStatus === BookingStatus.RETURNED) {
      text = isRequest ? t(`bookings.tool_request_past_title`) : t(`bookings.tool_petition_past_title`)
    } else if (booking.bookingStatus === BookingStatus.REJECTED || booking.bookingStatus === BookingStatus.CANCELLED) {
      text = isRequest ? t(`bookings.tool_request_cancelled_title`) : t(`bookings.tool_petition_cancelled_title`)
    } else if (now < startDate && booking.bookingStatus === BookingStatus.ACCEPTED) {
      text = isRequest ? t('bookings.tool_request_future_title') : t('bookings.tool_petition_future_title')
    } else if (now >= startDate && now <= endDate && booking.bookingStatus === BookingStatus.ACCEPTED) {
      text = isRequest ? t(`bookings.tool_request_present_title`) : t(`bookings.tool_petition_present_title`)
    }
    return text
  }, [booking, now])

  return (
    <HStack sx={lighterText} fontSize={{ base: 'xl', md: '2xl' }} {...props}>
      <Icon as={isRequest ? icons.outbox : icons.inbox} />
      <Text>{title}</Text>
    </HStack>
  )
}
