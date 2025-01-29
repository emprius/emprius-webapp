import React from 'react'
import { LoadingSpinner } from '~components/Layout/LoadingSpinner'
import { useTools } from '~components/Tools/toolsQueries'
import ErrorComponent from '~components/Layout/ErrorComponent'
import { ToolsList } from '~components/Tools/ToolsList'

export const List = () => {
  const { data: toolsResponse, isLoading, error, isError } = useTools()

  if (isLoading) {
    return <LoadingSpinner />
  }
  if (isError) {
    return <ErrorComponent error={error} />
  }

  return <ToolsList tools={toolsResponse?.tools || []} />
}
