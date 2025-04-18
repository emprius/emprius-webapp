import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useOutletContext } from 'react-router-dom'
import { TitlePageLayoutContext } from '~src/pages/TitlePageLayout'
import { UsersList } from '~components/Users/List'

export const List = () => {
  const { t } = useTranslation()
  const { setTitle } = useOutletContext<TitlePageLayoutContext>()

  useEffect(() => {
    setTitle(t('users.list_title'))
  }, [setTitle])

  return <UsersList />
}
