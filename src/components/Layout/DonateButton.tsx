import { Link as RouterLink } from 'react-router-dom'
import { icons } from '~theme/icons'
import { Button, ButtonProps, Text } from '@chakra-ui/react'
import React from 'react'
import { useTranslation } from 'react-i18next'

const DonateButton = ({ onlyIcon = false, ...props }: ButtonProps & { onlyIcon?: boolean }) => {
  const { t } = useTranslation()
  return (
    <Button
      as={RouterLink}
      to={'https://emprius.cat/collabora/'}
      leftIcon={icons.donate({})}
      variant={'cta'}
      iconSpacing={onlyIcon ? '0' : '0.5rem'}
      {...props}
    >
      <Text display={onlyIcon ? 'none' : 'block'}>{t('donate', { defaultValue: 'Donate' })}</Text>
    </Button>
  )
}

export default DonateButton
