import { Box, Flex, Stack, Text } from '@chakra-ui/react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { ToolImage } from '~components/Tools/shared/ToolImage'
import type { Tool } from '~components/Tools/types'
import { ToolBadges } from '~components/Tools/shared/ToolBadges'
import { Link as RouterLink } from 'react-router-dom'
import { ROUTES } from '~src/router/routes'
import { lightText } from '~theme/common'

interface ToolTooltipProps {
  tool: Tool
}

export const ToolTooltip = ({ tool }: ToolTooltipProps) => {
  const { t } = useTranslation()

  return (
    <Stack
      spacing={1}
      width='200px'
      pt={6}
      pb={4}
      gap={2}
      as={RouterLink}
      to={ROUTES.TOOLS.DETAIL.replace(':id', tool.id.toString())}
    >
      <ToolImage imageHash={tool?.images?.[0] ?? ''} title={tool.title} isAvailable={tool.isAvailable} height='120px' />
      <Flex align='top' justify='space-between' gap={2} px={4}>
        <Text
          fontWeight='semibold'
          fontSize='lg'
          _hover={{ color: 'primary.500', textDecoration: 'none' }}
          noOfLines={2}
          flex='1'
        >
          {tool.title}
        </Text>
        <Text fontSize='lg' fontWeight='bold' sx={lightText} whiteSpace='nowrap'>
          {t('tools.cost_unit', { cost: tool.cost })}
        </Text>
      </Flex>
      <ToolBadges tool={tool} px={4} />
      <Box fontSize='sm' color='gray.600' noOfLines={2} px={4}>
        {tool.description}
      </Box>
    </Stack>
  )
}
