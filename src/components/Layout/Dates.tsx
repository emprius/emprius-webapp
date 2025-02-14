import { Text, TextProps } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { lightText } from '~theme/common'

export const DateRangeTotal = ({ begin, end, ...props }: { begin: Date; end: Date } & TextProps) => {
  const { t } = useTranslation()
  // todo(kon): fix intl keys properly
  const datef = t('bookings.datef')
  return (
    <Text fontSize='md' sx={lightText} {...props}>
      {t('bookings.date_range_total', { date: { begin, end }, format: datef })}
    </Text>
  )
}
