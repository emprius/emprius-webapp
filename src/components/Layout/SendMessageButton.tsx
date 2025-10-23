import { Button, ButtonProps, Icon } from '@chakra-ui/react'
import { icons } from '~theme/icons'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { ROUTES } from '~src/router/routes'
import { Link as RouterLink } from 'react-router-dom'

type SendMessageButtonProps = ButtonProps & { userId: string; onlyIcon?: boolean }

export function SendMessageButton({ userId, onlyIcon, ...props }: SendMessageButtonProps) {
  const { t } = useTranslation()
  return (
    <Button
      as={RouterLink}
      to={ROUTES.MESSAGES.CHAT.replace(':userId', userId)}
      aria-label={t('user.send_message', { defaultValue: 'Send message' })}
      leftIcon={<Icon as={icons.messages} />}
      iconSpacing={onlyIcon && 0}
      size='md'
      {...props}
    >
      {!onlyIcon && t('user.send_message', { defaultValue: 'Send Message' })}
    </Button>
  )
}
