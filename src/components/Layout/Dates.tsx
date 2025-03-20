import { Skeleton, Text, TextProps } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { lightText } from '~theme/common'

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
      <Text fontSize='md' sx={lightText} {...props}>
        {t('bookings.date_range_total', { date: { begin, end }, format: datef })}
      </Text>
    </Skeleton>
  )
}
