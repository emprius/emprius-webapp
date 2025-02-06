import { Booking } from '~components/Bookings/queries'
import { useTranslation } from 'react-i18next'
import { Flex, HStack, Icon, Stack, Text } from '@chakra-ui/react'
import { lighterText, lightText } from '~theme/common'
import { FaArrowRight, FaRegCalendarAlt } from 'react-icons/fa'

interface BookingDatesProps {
  booking: Booking
}

export const BookingDates = ({ booking }: BookingDatesProps) => {
  const { t } = useTranslation()

  const begin = new Date(booking.startDate * 1000)
  const end = new Date(booking.endDate * 1000)
  const date = { begin, end }
  const datef = t('bookings.datef')

  return (
    <Stack spacing={1}>
      <HStack sx={lighterText}>
        <Icon as={FaRegCalendarAlt} fontSize='sm' />
        <Text fontSize='sm'> {t('bookings.dates', { defaultValue: 'Dates' })}</Text>
      </HStack>
      <Flex align={'center'} fontSize='md' wrap={'wrap'} sx={lightText}>
        {t('bookings.date_formatted', { date: date.begin, format: datef })}
        <Icon as={FaArrowRight} mx={2} />
        {t('bookings.date_formatted', { date: date.end, format: datef })}
      </Flex>
      <Text fontSize='md' sx={lightText}>
        {t('bookings.date_range_total', { date, format: datef })}
      </Text>
    </Stack>
  )
}
