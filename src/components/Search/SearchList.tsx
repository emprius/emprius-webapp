import { Box, Grid } from '@chakra-ui/react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { ElementNotFound } from '~components/Layout/ElementNotFound'
import ErrorComponent from '~components/Layout/ErrorComponent'
import { LoadingSpinner } from '~components/Layout/LoadingSpinner'
import { ToolCard } from '~components/Tools/Card'
import { Tool } from '~components/Tools/types'
import { icons } from '~theme/icons'

export const SearchList = ({
  tools,
  isLoading,
  error,
  isError,
}: {
  tools: Tool[]
  isLoading: boolean
  isError: boolean
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
        <ElementNotFound
          icon={icons.tools}
          title={t('search.no_tools_found', { defaultValue: 'No tools found!' })}
          desc={t('search.no_tools_found_desc', { defaultValue: 'Try search with other filters' })}
        />
      </Box>
    )
  }
  return (
    <Grid
      templateColumns={{
        base: 'repeat(1, 1fr)',
        sm: 'repeat(2, 1fr)',
        md: 'repeat(3, 1fr)',
        lg: 'repeat(4, 1fr)',
        xl: 'repeat(4, 1fr)',
      }}
      gap={6}
      pb={8}
      pt={30}
    >
      {tools.map((tool) => (
        <ToolCard key={tool.id} tool={tool} />
      ))}
    </Grid>
  )
}
