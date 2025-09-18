import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ConversationView } from '~components/Messages/ConversationView'
import { ROUTES } from '~src/router/routes'

export const View = () => {
  const { userId } = useParams<{ userId: string }>()
  const navigate = useNavigate()

  if (!userId) {
    // Redirect to conversations list if no userId provided
    navigate(ROUTES.MESSAGES.CONVERSATIONS, { replace: true })
    return null
  }

  const handleBack = () => {
    navigate(ROUTES.MESSAGES.CONVERSATIONS)
  }

  return (
    <ConversationView 
      conversationWith={userId} 
      onBack={handleBack}
    />
  )
}
