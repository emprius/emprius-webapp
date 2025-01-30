import React from 'react'
import { useAuth } from '~components/Auth/AuthContext'
import { UserProfile } from '~components/Users/Profile'

export const View = () => {
  const { user } = useAuth()
  return <UserProfile {...user} />
}
