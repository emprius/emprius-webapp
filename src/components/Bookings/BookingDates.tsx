import { Flex, HStack, Icon, Stack, StackProps, Text } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { FaArrowRight } from 'react-icons/fa'
import { DateRangeTotal } from '~components/Layout/Dates'
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
      <Flex align={'center'} fontSize='md' wrap={'wrap'} color='lightText'>
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
  isLoan,
  ...props
}: {
  booking: Booking
  isLoan: boolean
} & StackProps) => {
  const { t } = useTranslation()
  const now = new Date().getTime() / 1000 // Current time in seconds
  const startDate = booking.startDate // Already in seconds
  const endDate = booking.endDate // Already in seconds

  // Determine booking timing status
  const title = useMemo(() => {
    if (booking.bookingStatus === BookingStatus.RETURNED) {
      return isLoan ? t(`bookings.tool_loan_past_title`) : t(`bookings.tool_petition_past_title`)
    } else if (booking.bookingStatus === BookingStatus.LAPSED) {
      return t(`bookings.tool_lapsed_title`, { defaultValue: 'This booking was lapsed' })
    } else if (booking.bookingStatus === BookingStatus.PICKED) {
      return isLoan
        ? t(`bookings.tool_picked_loan_title`, { defaultValue: 'New holder has picked up the tool' })
        : t(`bookings.tool_picked_petition_title`, { defaultValue: 'You picked up the tool' })
    } else if (!isLoan && booking.bookingStatus === BookingStatus.PENDING) {
      return t(`bookings.tool_pending_title`, { defaultValue: 'Awaiting holder to accept request' })
    } else if (booking.bookingStatus === BookingStatus.REJECTED || booking.bookingStatus === BookingStatus.CANCELLED) {
      return isLoan ? t(`bookings.tool_loan_cancelled_title`) : t(`bookings.tool_petition_cancelled_title`)
    } else if (now < startDate && booking.bookingStatus === BookingStatus.ACCEPTED) {
      return isLoan ? t('bookings.tool_loan_future_title') : t('bookings.tool_petition_future_title')
    } else if (now >= startDate && now <= endDate && booking.bookingStatus === BookingStatus.ACCEPTED) {
      return isLoan ? t(`bookings.tool_loan_present_title`) : t(`bookings.tool_petition_present_title`)
    }
    return isLoan ? t('bookings.tool_loan_title') : t('bookings.tool_petition_title')
  }, [booking, now])

  return (
    <HStack color='lighterText' fontSize={{ base: 'xl', md: '2xl' }} {...props}>
      <Icon as={isLoan ? icons.outbox : icons.inbox} />
      <Text>{title}</Text>
    </HStack>
  )
}
