import { Flex, Icon, Stack } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { FaArrowRight } from 'react-icons/fa'
import { Booking } from '~components/Bookings/queries'
import { DateRangeTotal } from '~components/Layout/Dates'
import { lightText } from '~theme/common'
import { addDayToDate } from '~utils/dates'

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
