import React, { useEffect } from 'react'
import { useNavigate, useOutletContext } from 'react-router-dom'
import { useAuth } from '~components/Auth/AuthContext'
import { EditUser } from '~components/Users/Edit'
import { FormLayoutContext } from '~src/pages/FormLayout'

export const Edit = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { setTitle } = useOutletContext<FormLayoutContext>()

  useEffect(() => {
    setTitle(null)
  }, [setTitle])

  return (
    <EditUser
      initialData={{
        name: user?.name || '',
        email: user?.email || '',
        location: user?.location,
        active: user?.active || false,
        avatarHash: user?.avatarHash,
      }}
      onSuccess={() => navigate(-1)}
    />
  )
}
