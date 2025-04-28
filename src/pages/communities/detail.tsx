import React, { useEffect } from 'react'
import { useOutletContext, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { CommunityDetail } from '~components/communities/Detail'
import { TitlePageLayoutContext } from '~src/pages/TitlePageLayout'
import { useCommunityDetail } from '~components/communities/queries'
import { LoadingSpinner } from '~components/Layout/LoadingSpinner'

export const Detail = () => {
  const { id } = useParams<{ id: string }>()
  const { setTitle } = useOutletContext<TitlePageLayoutContext>()
  const { data: community, isLoading } = useCommunityDetail(id!)

  useEffect(() => {
    // Set the page title when community data is loaded
    if (community) {
      setData(community.name)
    }
  }, [community, setTitle])

  if (isLoading) {
    return <LoadingSpinner />
  }

  return <CommunityDetail />
}
