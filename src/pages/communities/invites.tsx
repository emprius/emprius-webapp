import React, { useEffect } from 'react'
import { useOutletContext } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { CommunityInvites } from '~components/communities/Invites'
import { TitlePageLayoutContext } from '~src/pages/TitlePageLayout'

export const Invites = () => {
  const { t } = useTranslation()
  const { setTitle } = useOutletContext<TitlePageLayoutContext>()
  
  useEffect(() => {
    // Set the page title
    setTitle(t('communities.pending_invites'))
  }, [setTitle, t])
  
  return <CommunityInvites />
}
