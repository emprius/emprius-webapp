import React from 'react'
import { useCommunityTools } from '~components/Communities/queries'
import { useParams } from 'react-router-dom'
import { ToolList } from '~components/Tools/List'

export const CommunitySharedTools: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const { data, isLoading, isError, error } = useCommunityTools(id!)

  return <ToolList isLoading={isLoading} isError={isError} error={error} tools={data?.tools} />
}
