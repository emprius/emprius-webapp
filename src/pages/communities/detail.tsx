import React, { useEffect } from 'react'
import { useOutletContext, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { CommunityDetail } from '~components/Communities/Detail'
import { TitlePageLayoutContext } from '~src/pages/TitlePageLayout'
import { useCommunityDetail } from '~components/Communities/queries'
import { LoadingSpinner } from '~components/Layout/LoadingSpinner'
import { ElementNotFound } from '~components/Layout/ElementNotFound'
import { icons } from '~theme/icons'

export const Detail = () => {
  const { id } = useParams<{ id: string }>()
  const { setData } = useOutletContext<TitlePageLayoutContext>()
  const { data: community } = useCommunityDetail(id!)

  useEffect(() => {
    // Set the page title when community data is loaded
    if (community) {
      setData(community.name)
    }
  }, [community, setData])

  return <CommunityDetail />
}
