import React, { useEffect } from 'react'
import { useOutletContext } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { CommunitiesList } from '~components/communities/List'
import { TitlePageLayoutContext } from '~src/pages/TitlePageLayout'

export const List = () => {
  const { t } = useTranslation()
  const { setTitle } = useOutletContext<TitlePageLayoutContext>()
  
  useEffect(() => {
    // Set the page title
    setTitle(t('communities.your_communities'))
  }, [setTitle, t])
  
  return <CommunitiesList />
}
