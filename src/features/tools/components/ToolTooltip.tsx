import { Box, Button, Stack, Text } from '@chakra-ui/react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import type { Tool } from '../../../types'
import { ToolImage, ToolPriceRating } from './shared'

interface ToolTooltipProps {
  tool: Tool
  onSelect: (toolId: string) => void
}

export const ToolTooltip = ({ tool, onSelect }: ToolTooltipProps) => {
  const { t } = useTranslation()

  return (
    <Box width="200px">
      <ToolImage
        imageHash={tool.images[0]?.hash}
        title={tool.title}
        isAvailable={tool.isAvailable}
        height="120px"
      />

      <Stack p={2} spacing={2}>
        <Text fontWeight="semibold" noOfLines={1}>
          {tool.title}
        </Text>
        
        <ToolPriceRating 
          cost={tool.cost} 
          rating={tool.rating}
        />

        <Text fontSize="sm" color="gray.600" noOfLines={2}>
          {tool.description}
        </Text>

        <Button 
          size="sm" 
          colorScheme="primary"
          onClick={() => onSelect(tool.id.toString())}
        >
          {t('common.viewDetails')}
        </Button>
      </Stack>
    </Box>
  )
}
