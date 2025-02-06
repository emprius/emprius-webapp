import { BookingStatus } from '~components/Bookings/queries'
import { useTranslation } from 'react-i18next'
import { Badge } from '@chakra-ui/react'

interface StatusBadgeProps {
  status: BookingStatus
}

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  const { t } = useTranslation()
  let colorScheme = ''
  let text = ''
  switch (status) {
    case BookingStatus.RETURNED:
      colorScheme = 'green'
      text = t(`bookings.status.RETURNED`)
      break
    case BookingStatus.REJECTED:
      text = t(`bookings.status.REJECTED`)
      colorScheme = 'red'
      break
    case BookingStatus.CANCELLED:
      text = t(`bookings.status.CANCELLED`)
      colorScheme = 'red'
      break
    case BookingStatus.ACCEPTED:
      text = t(`bookings.status.ACCEPTED`)
      colorScheme = 'primary'
      break
    case BookingStatus.PENDING:
      text = t(`bookings.status.PENDING`)
      colorScheme = 'yellow'
      break
    default:
      text = BookingStatus.PENDING
      colorScheme = 'yellow'
  }

  return (
    <Badge
      colorScheme={colorScheme}
      px={3}
      py={1.5}
      borderRadius='full'
      fontSize='sm'
      fontWeight='medium'
      textTransform='uppercase'
      letterSpacing='wide'
    >
      {text}
    </Badge>
  )
}
