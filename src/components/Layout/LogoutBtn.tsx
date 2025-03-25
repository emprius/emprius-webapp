import { Button, ButtonProps } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '~components/Auth/AuthContext'
import { FiLogOut } from 'react-icons/fi'
import React from 'react'

export const LogoutBtn = (props: ButtonProps) => {
  const { t } = useTranslation()
  const { logout } = useAuth()
  return (
    <Button aria-label={t('common.logout')} leftIcon={<FiLogOut />} onClick={logout} variant='ghost' {...props}>
      {t('nav.logout')}
    </Button>
  )
}
