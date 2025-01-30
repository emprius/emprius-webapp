import React from 'react'
import { LoadingSpinner } from '~components/Layout/LoadingSpinner'
import { useTools } from '~components/Tools/queries'
import ErrorComponent from '~components/Layout/ErrorComponent'
import { ToolList } from '~components/Tools/List'

export const List = () => {
  const { data: toolsResponse, isLoading, error, isError } = useTools()

  if (isLoading) {
    return <LoadingSpinner />
  }
  if (isError) {
    return <ErrorComponent error={error} />
  }

  return <ToolList tools={toolsResponse?.tools || []} />
}
