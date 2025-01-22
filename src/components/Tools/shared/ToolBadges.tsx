import { Badge, Stack, StackProps } from '@chakra-ui/react'
import React from 'react'
import { Tool } from '~components/Tools/types'

type ToolBadgesProps = {
  tool: Tool
} & StackProps

export const ToolBadges = ({ tool, ...rest }: ToolBadgesProps) => (
  <Stack direction='row' spacing={2} {...rest}>
    {tool.mayBeFree && <Badge colorScheme='blue'>Maybe Free</Badge>}
    {tool.askWithFee && <Badge colorScheme='purple'>Ask with Fee</Badge>}
  </Stack>
)
