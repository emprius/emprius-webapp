import { Flex, Text, useColorModeValue } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { convertToDate, DateInput, isToday, isYesterday, isSameYear } from '~utils/dates'

export interface ChatDateSeparatorProps {
  date: DateInput
}

export const ChatDateSeparator = ({ date }: ChatDateSeparatorProps) => {
  const { t } = useTranslation()
  const textColor = useColorModeValue('gray.500', 'gray.400')
  const dateObj = convertToDate(date)
  const showYear = !isSameYear(dateObj, new Date())

  let dateText: string

  if (isToday(dateObj)) {
    dateText = t('messages.separator_today', { defaultValue: 'Today' })
  } else if (isYesterday(dateObj)) {
    dateText = t('messages.separator_yesterday', { defaultValue: 'Yesterday' })
  } else {
    const dateFormat = showYear
      ? t('messages.datef_separator_with_year', { defaultValue: 'eeee, d MMMM yyyy' })
      : t('messages.datef_separator', { defaultValue: 'eeee, d MMMM' })

    dateText = t('messages.date_formatted', { date: dateObj, format: dateFormat })
  }

  return (
    <Flex justify='center' my={4}>
      <Text fontSize='sm' color={textColor} fontWeight='medium'>
        {dateText}
      </Text>
    </Flex>
  )
}
