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
  showErrors = true,
}: {
  tools: Tool[]
  isLoading?: boolean
  isError?: boolean
  error?: Error
  showErrors?: boolean // Show error messages or empty state when no tools are found, used on authenticated landing page
}) => {
  const { t } = useTranslation()

  if (isLoading) return <LoadingSpinner />

  if (isError && showErrors) {
    return <ErrorComponent error={error} />
  }

  if (tools.length === 0 && showErrors) {
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
