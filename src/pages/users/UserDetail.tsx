import React from 'react'
import { useParams } from 'react-router-dom'
import { UserProfile } from '~components/Users/UserProfile'
import { NotFoundPage } from '../NotFoundPage'

export const UserDetail = () => {
  const { id } = useParams<{ id: string }>()

  if (!id) {
    return <NotFoundPage />
  }

  return <UserProfile userId={id} />
}
