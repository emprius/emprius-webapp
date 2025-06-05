import { Skeleton, Text, TextProps } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'

export const DateRangeTotal = ({
  begin,
  end,
  isLoaded = true,
  ...props
}: {
  begin: Date
  end: Date
  isLoaded?: boolean
} & TextProps) => {
  const { t } = useTranslation()
  const datef = t('bookings.datef')
  return (
    <Skeleton isLoaded={isLoaded}>
      <Text fontSize='md' color='lightText' {...props}>
        {t('bookings.date_range_total', { date: { begin, end }, format: datef })}
      </Text>
    </Skeleton>
  )
}
