import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useOutletContext } from 'react-router-dom'
import { TitlePageLayoutContext } from '~src/pages/TitlePageLayout'
import { UsersListNavigator } from '~components/Users/List'

export const List = () => {
  const { t } = useTranslation()
  const { setData } = useOutletContext<TitlePageLayoutContext>()

  useEffect(() => {
    setData(t('users.list_title'))
  }, [setData])

  return <UsersListNavigator />
}
