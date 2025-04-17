import { Icon, Skeleton, Stack, Text, TextProps } from '@chakra-ui/react'
import { icons } from '~theme/icons'
import React from 'react'
import { Tool, ToolDTO } from '~components/Tools/types'

/**
 * This component shows the nomadic icon among with tool title
 */
const ToolTitle = ({ tool, ...props }: { tool: Tool } & TextProps) => (
  <Skeleton isLoaded={!!tool}>
    <Text {...props}>
      {tool?.isNomadic && <Icon as={icons.nomadic} />} {tool?.title}
    </Text>
  </Skeleton>
)

export default ToolTitle
