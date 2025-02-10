import React from 'react'
import { useParams } from 'react-router-dom'
import { useUserProfile } from '~components/Users/queries'
import { LoadingSpinner } from '~components/Layout/LoadingSpinner'
import ErrorComponent from '~components/Layout/ErrorComponent'
import { UserProfile } from '~components/Users/Profile'
import { ElementNotFound } from '~components/Layout/ElementNotFound'
import { icons } from '~theme/icons'
import { useTranslation } from 'react-i18next'
import { MainContainer } from '~components/Layout/LayoutComponents'

export const Detail = () => {
  const { t } = useTranslation()
  const { id } = useParams<{ id: string }>()
  const { data, isError, error, isLoading } = useUserProfile(id, {
    enabled: !!id,
  })

  if (isLoading) return <LoadingSpinner />
  if (!data || !id) {
    return <ElementNotFound icon={icons.user} title={t('user.user_not_found')} desc={t('user.user_not_found_desc')} />
  }
  if (isError) return <ErrorComponent error={error} />

  return (
    <MainContainer>
      <UserProfile {...data} />
    </MainContainer>
  )
}
