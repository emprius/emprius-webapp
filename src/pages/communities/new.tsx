import React, { useEffect } from 'react'
import { useOutletContext } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { CommunityForm } from '~components/communities/Form'
import { FormLayoutContext } from '~src/pages/FormLayout'

export const New = () => {
  const { t } = useTranslation()
  const { setTitle } = useOutletContext<FormLayoutContext>()
  
  useEffect(() => {
    // Set the page title
    setTitle(t('communities.create_community'))
  }, [setTitle, t])
  
  return <CommunityForm />
}
