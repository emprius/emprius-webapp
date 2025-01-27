import { Button, Stack, Text } from '@chakra-ui/react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { ToolImage } from '~components/Tools/shared/ToolImage'
import type { Tool } from '~components/Tools/types'
import { ROUTES } from '~src/router/router'
import { ToolBadges } from '~components/Tools/shared/ToolBadges'
import { Link } from 'react-router-dom'

interface ToolTooltipProps {
  tool: Tool
}

export const ToolTooltip = ({ tool }: ToolTooltipProps) => {
  const { t } = useTranslation()

  return (
    <Stack spacing={2} width='200px' py={4}>
      <ToolImage imageHash={tool.images[0]} title={tool.title} isAvailable={tool.isAvailable} height='120px' />
      <Stack mt={2} direction='row' align='center' justify='space-between'>
        <Text fontWeight='semibold' fontSize='lg' _hover={{ color: 'primary.500', textDecoration: 'none' }}>
          {tool.title}
        </Text>
        <Text color='gray.600' fontSize='md' fontWeight='bold'>
          {t('tools.cost_unit', { cost: tool.cost })}
        </Text>
      </Stack>
      <ToolBadges tool={tool} />
      <Text fontSize='sm' color='gray.600' noOfLines={2}>
        {tool.description}
      </Text>
      <Button size='sm' as={Link} to={ROUTES.TOOLS.DETAIL.replace(':id', tool.id.toString())}>
        {t('common.view_details')}
      </Button>
    </Stack>
  )
}
