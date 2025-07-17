import { Link as RouterLink } from 'react-router-dom'
import { icons } from '~theme/icons'
import { Button, ButtonProps, Text } from '@chakra-ui/react'
import React from 'react'
import { useTranslation } from 'react-i18next'

const DonateButton = (props: ButtonProps) => {
  const { t } = useTranslation()
  return (
    <Button
      ml={4}
      as={RouterLink}
      to={'https://emprius.cat/collabora/'}
      leftIcon={icons.donate({})}
      variant={'cta'}
      sx={{
        '& .chakra-button__icon': {
          marginEnd: { base: '0', md: '0.5rem' },
        },
      }}
      {...props}
    >
      <Text display={{ base: 'none', md: 'block' }}>{t('donate', { defaultValue: 'Donate' })}</Text>
    </Button>
  )
}

export default DonateButton
