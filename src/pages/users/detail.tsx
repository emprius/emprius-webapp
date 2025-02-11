import React from 'react'
import { useParams } from 'react-router-dom'
import { useUserProfile } from '~components/Users/queries'
import { LoadingSpinner } from '~components/Layout/LoadingSpinner'
import ErrorComponent from '~components/Layout/ErrorComponent'
import { UserProfile } from '~components/Users/Profile'
import { ElementNotFound } from '~components/Layout/ElementNotFound'
import { icons } from '~theme/icons'
import { useTranslation } from 'react-i18next'
import { MainContainer } from '~components/Layout/LayoutComponents'
import { Box } from '@chakra-ui/react'
import { ToolList } from '~components/Tools/List'
import { useUserTools } from '~components/Tools/queries'

export const Detail = () => {
  const { t } = useTranslation()
  const { id } = useParams<{ id: string }>()
  const {
    data: userData,
    isError: isUserError,
    error: userError,
    isLoading: isUserLoading,
  } = useUserProfile(id, {
    enabled: !!id,
  })
  const {
    data: toolsData,
    isError: isToolsError,
    error: toolsError,
    isLoading: isToolsLoading,
  } = useUserTools(id || '')

  if (isUserLoading) return <LoadingSpinner />
  if (!userData || !id) {
    return <ElementNotFound icon={icons.user} title={t('user.user_not_found')} desc={t('user.user_not_found_desc')} />
  }
  if (isUserError) return <ErrorComponent error={userError} />

  return (
    <MainContainer>
      <UserProfile {...userData} />
      <Box mt={8}>
        <ToolList tools={toolsData?.tools || []} isLoading={isToolsLoading} isError={isToolsError} error={toolsError} />
      </Box>
    </MainContainer>
  )
}
