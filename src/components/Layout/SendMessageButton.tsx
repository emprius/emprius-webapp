import { Button, ButtonProps, Icon } from '@chakra-ui/react'
import { icons } from '~theme/icons'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { ROUTES } from '~src/router/routes'
import { useNavigate } from 'react-router-dom'

type SendMessageButtonProps = ButtonProps & { userId: string; onlyIcon?: boolean }

export function SendMessageButton({ userId, onlyIcon, ...props }: SendMessageButtonProps) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  return (
    <Button
      aria-label={t('user.send_message', { defaultValue: 'Send message' })}
      onClick={() => navigate(ROUTES.MESSAGES.CHAT.replace(':userId', userId))}
      leftIcon={<Icon as={icons.messages} />}
      iconSpacing={onlyIcon && 0}
      size='md'
      {...props}
    >
      {!onlyIcon && t('user.send_message', { defaultValue: 'Send Message' })}
    </Button>
  )
}
