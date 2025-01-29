import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Navigate, useOutletContext, useParams } from 'react-router-dom'
import { useAuth } from '~components/Auth/AuthContext'
import { EditToolForm } from '~components/Tools/EditToolForm'
import { useTool } from '~components/Tools/toolsQueries'
import { FormLayoutContext } from '~src/pages/FormLayout'
import { ROUTES } from '~src/router/routes'
import { LoadingSpinner } from '~components/Layout/LoadingSpinner'
import { ElementNotFound } from '~components/Layout/ElementNotFound'
import { icons } from '~utils/icons'

export const Edit = () => {
  const { t } = useTranslation()
  const { id } = useParams<{ id: string }>()
  const { user } = useAuth()
  const { setTitle } = useOutletContext<FormLayoutContext>()

  const { data, isLoading, isError } = useTool(id!, {
    retry: false, // Don't retry on error
  })

  useEffect(() => {
    setTitle(t('tools.edit_tool'))
  }, [setTitle])

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (!data || !id || isError) {
    return <ElementNotFound icon={icons.tools} title={t('tools.not_found')} desc={t('tools.find_other')} />
  }

  // Only allow tool owner to access this page
  if (!user || user.id !== data.userId) {
    return <Navigate to={ROUTES.TOOLS.DETAIL.replace(':id', id!)} replace />
  }

  return <EditToolForm initialData={data} />
}
