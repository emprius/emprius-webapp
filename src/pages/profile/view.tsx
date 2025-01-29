import React from 'react'
import { useAuth } from '~components/Auth/AuthContext'
import { UserInfo } from '~components/Users/UserProfile'

export const View = () => {
  const { user } = useAuth()
  return <UserInfo {...user} />
}
