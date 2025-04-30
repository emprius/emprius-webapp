import React, { useEffect } from 'react'
import { useOutletContext, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { CommunityForm } from '~components/Communities/Form'
import { FormLayoutContext } from '~src/pages/FormLayout'
import { useCommunityDetail } from '~components/Communities/queries'
import { LoadingSpinner } from '~components/Layout/LoadingSpinner'
import { ElementNotFound } from '~components/Layout/ElementNotFound'
import { icons } from '~theme/icons'

export const Edit = () => {
  const { t } = useTranslation()
  const { id } = useParams<{ id: string }>()
  const { setTitle } = useOutletContext<FormLayoutContext>()
  const { data: community, isLoading, isError } = useCommunityDetail(id!)

  useEffect(() => {
    // Set the page title when community data is loaded
    if (community) {
      setTitle(t('communities.edit_community_name', { name: community.name }))
    } else {
      setTitle(t('communities.edit_community'))
    }
  }, [community, setTitle, t])

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (isError || !community) {
    return (
      <ElementNotFound icon={icons.users} title={t('communities.not_found')} desc={t('communities.not_found_desc')} />
    )
  }

  return <CommunityForm initialData={community} isEdit />
}
