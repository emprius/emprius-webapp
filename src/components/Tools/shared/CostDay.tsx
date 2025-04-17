import { Badge, BadgeProps, Stack, StackProps, Text } from '@chakra-ui/react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Tool, ToolDTO } from '~components/Tools/types'
import { lightText } from '~theme/common'

type ToolBadgesProps = {
  tool: Tool
  badgeProps?: BadgeProps
} & StackProps

export const CostDay = ({ tool, badgeProps, ...rest }: ToolBadgesProps) => {
  const { t } = useTranslation()
  if (tool.cost === 0) {
    return (
      <Stack direction='row' spacing={2} wrap='wrap' align={'center'} pt={1} {...rest}>
        <Badge colorScheme='primary' {...badgeProps}>
          {t('tools.free_badge', { defaultValue: 'Free' })}
        </Badge>
      </Stack>
    )
  }
  return (
    <Stack direction='row' spacing={2} wrap='wrap' fontSize='lg' fontWeight='bold' {...rest}>
      <Text sx={lightText} whiteSpace='nowrap'>
        {t('tools.cost_unit', { cost: tool.cost })}
      </Text>
    </Stack>
  )
}
