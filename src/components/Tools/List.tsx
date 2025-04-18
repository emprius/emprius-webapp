import { Box } from '@chakra-ui/react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { ElementNotFound } from '~components/Layout/ElementNotFound'
import ErrorComponent from '~components/Layout/ErrorComponent'
import { LoadingSpinner } from '~components/Layout/LoadingSpinner'
import { ToolCard } from '~components/Tools/Card'
import { Tool, ToolDTO } from '~components/Tools/types'
import { icons } from '~theme/icons'
import { ResponsiveSimpleGrid } from '~components/Layout/LayoutComponents'

export const ToolList = ({
  tools,
  isLoading,
  error,
  isError,
}: {
  tools: Tool[]
  isLoading?: boolean
  isError?: boolean
  error?: Error
}) => {
  const { t } = useTranslation()

  if (isLoading) return <LoadingSpinner />

  if (isError) {
    return <ErrorComponent error={error} />
  }

  if (tools.length === 0) {
    return (
      <Box textAlign='center' mt={8}>
        <ElementNotFound icon={icons.tools} title={t('tools.no_tools_found')} desc={t('tools.no_tools_found_desc')} />
      </Box>
    )
  }
  return (
    <ResponsiveSimpleGrid>
      {tools.map((tool) => (
        <ToolCard key={tool.id} tool={tool} />
      ))}
    </ResponsiveSimpleGrid>
  )
}
