import { Box, Stack } from '@chakra-ui/react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { ToolImage } from '~components/Tools/shared/ToolImage'
import type { Tool } from '~components/Tools/types'
import { ToolBadges } from '~components/Tools/shared/ToolBadges'
import { Link as RouterLink } from 'react-router-dom'
import { ROUTES } from '~src/router/routes'

interface ToolTooltipProps {
  tool: Tool
}

export const ToolTooltip = ({ tool }: ToolTooltipProps) => {
  const { t } = useTranslation()

  return (
    <Stack
      spacing={1}
      width='200px'
      py={4}
      gap={2}
      as={RouterLink}
      to={ROUTES.TOOLS.DETAIL.replace(':id', tool.id.toString())}
    >
      <ToolImage imageHash={tool.images[0]} title={tool.title} isAvailable={tool.isAvailable} height='120px' />
      <Stack mt={2} direction='row' align='center' justify='space-between'>
        <Box fontWeight='semibold' fontSize='lg'>
          {tool.title}
        </Box>
        <Box color='gray.600' fontSize='md' fontWeight='bold'>
          {t('tools.cost_unit', { cost: tool.cost })}
        </Box>
      </Stack>
      <ToolBadges tool={tool} />
      <Box fontSize='sm' color='gray.600' noOfLines={2}>
        {tool.description}
      </Box>
    </Stack>
  )
}
