import { Badge, BadgeProps } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'

const NomadicBadge = (props: BadgeProps) => {
  const { t } = useTranslation()
  return (
    <Badge
      colorScheme={'blue'}
      px={3}
      py={1.5}
      borderRadius='full'
      fontSize='sm'
      fontWeight='medium'
      textTransform='uppercase'
      letterSpacing='wide'
      {...props}
    >
      {t('tools.nomadic')}
    </Badge>
  )
}

export default NomadicBadge
