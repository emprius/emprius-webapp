import React from 'react'
import { useSearchParams } from 'react-router-dom'
import { Register as RegisterForm } from '~components/Auth/Register'

export const Register = () => {
  const [searchParams] = useSearchParams()
  const invitationToken = searchParams.get('invite') || ''

  return <RegisterForm defaultInvitationToken={invitationToken} />
}
