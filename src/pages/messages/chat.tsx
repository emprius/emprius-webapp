import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ChatView } from '~components/Messages/ChatView'
import { ROUTES } from '~src/router/routes'
import { useCustomPageTitle } from '~components/Layout/Contexts/TitleContext'
import { useUserProfile } from '~components/Users/queries'

export const View = () => {
  const { userId } = useParams<{ userId: string }>()
  const navigate = useNavigate()

  const { data } = useUserProfile(userId)
  useCustomPageTitle(data?.name)

  if (!userId) {
    // Redirect to conversations list if no userId provided
    navigate(ROUTES.MESSAGES.CONVERSATIONS, { replace: true })
    return null
  }

  const handleBack = () => {
    navigate(-1)
  }

  return <ChatView chatWith={userId} onBack={handleBack} />
}
