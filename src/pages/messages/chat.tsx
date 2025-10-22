import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ChatView } from '~components/Messages/ChatView'
import { ROUTES } from '~src/router/routes'
import { useCustomPageTitle } from '~components/Layout/Contexts/TitleContext'
import { useUserProfile } from '~components/Users/queries'
import { useMatch } from 'react-router-dom'
import { useCommunityDetail } from '~components/Communities/queries'
import { ChatType } from '~components/Messages/types'

export const View = () => {
  const { userId } = useParams<{ userId: string }>()
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const isCommunityChat = !!useMatch(ROUTES.MESSAGES.COMMUNITY_CHAT)
  const isGeneralChat = !!useMatch(ROUTES.MESSAGES.GENERAL_CHAT)

  const { data: userData } = useUserProfile(userId, { enabled: !isCommunityChat && !isGeneralChat })
  const { data: communityData } = useCommunityDetail(id, { enabled: isCommunityChat && !isGeneralChat })

  useCustomPageTitle(userData?.name || communityData?.name)

  let type: ChatType = 'private'
  if (isCommunityChat) {
    type = 'community'
  } else if (isGeneralChat) {
    type = 'general'
  }

  if (!userId && !id && !isGeneralChat) {
    // Redirect to conversations list if no userId provided
    navigate(ROUTES.MESSAGES.CONVERSATIONS, { replace: true })
    return null
  }

  const handleBack = () => {
    navigate(-1)
  }

  return <ChatView chatWith={userId || id} onBack={handleBack} type={type} />
}
