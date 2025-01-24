import { Badge, Stack, StackProps } from '@chakra-ui/react'
import React from 'react'
import { Tool } from '~components/Tools/types'
import { useTranslation } from 'react-i18next'

type ToolBadgesProps = {
  tool: Tool
} & StackProps

export const ToolBadges = ({ tool, ...rest }: ToolBadgesProps) => {
  const { t } = useTranslation()
  return (
    <Stack direction='row' spacing={2} {...rest}>
      {tool.mayBeFree && <Badge colorScheme='blue'>{t('tools.may_be_free', { defaultValue: 'Maybe Free' })}</Badge>}
      {tool.askWithFee && (
        <Badge colorScheme='purple'>{t('tools.ask_with_fee', { defaultValue: 'Ask with Fee' })}</Badge>
      )}
    </Stack>
  )
}
