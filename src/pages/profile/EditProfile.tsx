import React, { useEffect } from 'react'
import { useNavigate, useOutletContext } from 'react-router-dom'
import { useAuth } from '~components/Auth/AuthContext'
import { EditProfileForm } from '~components/User/EditProfileForm'
import { FormLayoutContext } from '~src/pages/FormLayout'

export const EditProfile = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { setTitle } = useOutletContext<FormLayoutContext>()

  useEffect(() => {
    setTitle(null)
  }, [setTitle])

  return (
    <EditProfileForm
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
