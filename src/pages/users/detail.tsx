import React from 'react'
import { useParams } from 'react-router-dom'
import { NotFoundPage } from '../NotFoundPage'
import { useUserProfile } from '~components/Users/userQueries'
import { LoadingSpinner } from '~components/Layout/LoadingSpinner'
import ErrorComponent from '~components/Layout/ErrorComponent'
import { UserInfo } from '~components/Users/UserProfile'

export const Detail = () => {
  const { id } = useParams<{ id: string }>()
  const { data, isError, error, isLoading } = useUserProfile(id, {
    enabled: !!id,
  })

  if (isLoading) return <LoadingSpinner />
  if (!data || !id) return <NotFoundPage />
  if (isError) return <ErrorComponent error={error} />

  return <UserInfo {...data} />
}
