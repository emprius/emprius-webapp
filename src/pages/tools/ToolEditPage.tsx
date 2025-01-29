import { Center, Spinner } from '@chakra-ui/react'
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Navigate, useOutletContext, useParams } from 'react-router-dom'
import { useAuth } from '~components/Auth/AuthContext'
import { EditToolForm } from '~components/Tools/EditToolForm'
import { useTool } from '~components/Tools/toolsQueries'
import { NotFoundPage } from '~src/pages/NotFoundPage'
import { ROUTES } from '~src/router/router'
import { FormLayoutContext } from '~src/pages/FormLayout'

export const ToolEditPage = () => {
  const { t } = useTranslation()
  const { id } = useParams<{ id: string }>()
  const { user } = useAuth()
  const { setTitle } = useOutletContext<FormLayoutContext>()

  const {
    data: tool,
    isLoading,
    isError,
  } = useTool(id!, {
    retry: false, // Don't retry on error
  })

  useEffect(() => {
    setTitle(t('tools.edit_tool'))
  }, [setTitle])

  if (isLoading) {
    return (
      <Center h='100vh'>
        <Spinner size='xl' />
      </Center>
    )
  }

  if (isError) {
    return <NotFoundPage />
  }

  // Only allow tool owner to access this page
  if (!user || !tool || user.id !== tool.userId) {
    return <Navigate to={ROUTES.TOOLS.DETAIL.replace(':id', id!)} replace />
  }

  return <EditToolForm initialData={tool} />
}
