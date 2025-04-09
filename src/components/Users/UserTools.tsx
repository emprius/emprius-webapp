import React from 'react'
import { useParams } from 'react-router-dom'
import { useUserTools } from '~components/Tools/queries'
import { ToolList } from '~components/Tools/List'
import { LoadingSpinner } from '~components/Layout/LoadingSpinner'
import ErrorComponent from '~components/Layout/ErrorComponent'

export const UserTools = () => {
  const { id } = useParams<{ id: string }>()
  const {
    data: toolsData,
    isError: isToolsError,
    error: toolsError,
    isLoading: isToolsLoading,
  } = useUserTools(id || '')

  if (isToolsLoading) return <LoadingSpinner />

  return (
    <ToolList tools={toolsData?.tools || []} isLoading={isToolsLoading} isError={isToolsError} error={toolsError} />
  )
}
