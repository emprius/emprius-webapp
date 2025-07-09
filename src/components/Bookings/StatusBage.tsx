import { useTranslation } from 'react-i18next'
import { Badge, HStack } from '@chakra-ui/react'
import { BookingStatus } from '~components/Bookings/types'
import NomadicBadge from '~components/Tools/shared/NomadicBadge'

interface StatusBadgeProps {
  status: BookingStatus
  isNomadic?: boolean
}

export const BookingBadges = ({ status, isNomadic }: StatusBadgeProps) => {
  return (
    <HStack>
      {isNomadic && <NomadicBadge fontSize='sm' fontWeight='medium' />}
      <StatusBadge status={status} />
    </HStack>
  )
}
export const StatusBadge = ({ status }: StatusBadgeProps) => {
  const { t } = useTranslation()
  let colorScheme: string
  let text: string
  switch (status) {
    case BookingStatus.PICKED:
      colorScheme = 'green'
      text = t(`bookings.status.PICKED`)
      break
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
    case BookingStatus.LAPSED:
      text = t(`bookings.status.LAPSED`)
      break
    default:
      return null
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
