import 'leaflet/dist/leaflet.css'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { LoadingSpinner } from '~components/Layout/LoadingSpinner'
import { useTool } from '~components/Tools/queries'
import { ToolDetail } from '~components/Tools/Detail'
import { ElementNotFound } from '~components/Layout/ElementNotFound'
import { icons } from '~theme/icons'

export const Detail = () => {
  const { id } = useParams<{ id: string }>()
  const { t } = useTranslation()
  const { data, isLoading, isError } = useTool(id!)

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (!data || !id || isError) {
    return <ElementNotFound icon={icons.tools} title={t('tools.not_found')} desc={t('tools.find_other')} />
  }

  return <ToolDetail tool={data} />
}
