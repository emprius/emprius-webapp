import { Box, Grid } from '@chakra-ui/react'
import { ElementNotFound } from '~components/Layout/ElementNotFound'
import { icons } from '~theme/icons'
import { ToolCard } from '~components/Tools/Card'
import React from 'react'
import { Tool } from '~components/Tools/types'
import { useTranslation } from 'react-i18next'

export const SearchList = ({ tools }: { tools: Tool[] }) => {
  const { t } = useTranslation()

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
