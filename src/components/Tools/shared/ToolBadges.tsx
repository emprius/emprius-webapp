import { Badge, Stack, StackProps } from '@chakra-ui/react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Tool } from '~components/Tools/types'

type ToolBadgesProps = {
  tool: Tool
} & StackProps

export const ToolBadges = ({ tool, ...rest }: ToolBadgesProps) => {
  const { t } = useTranslation()
  return (
    <Stack direction='row' spacing={2} wrap='wrap' {...rest}>
      {tool.cost === 0 && <Badge colorScheme='primary'>{t('tools.may_be_free', { defaultValue: 'Maybe Free' })}</Badge>}
    </Stack>
  )
}
