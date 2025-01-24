import { Badge, Box } from '@chakra-ui/react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { ServerImage } from '~components/Images/ServerImage'

interface ToolImageProps {
  imageHash?: string
  title: string
  isAvailable: boolean
  height?: string
}

export const ToolImage = ({ imageHash, title, isAvailable, height = '200px' }: ToolImageProps) => {
  const { t } = useTranslation()

  let badge = t(`tools.unavailable`)
  if (isAvailable) {
    badge = t(`tools.available`)
  }
  return (
    <Box position='relative'>
      <ServerImage imageId={imageHash} alt={title} height={height} width='100%' objectFit='cover' />
      <Badge
        position='absolute'
        top={2}
        right={2}
        colorScheme={isAvailable ? 'green' : 'gray'}
        px={2}
        py={1}
        borderRadius='full'
      >
        {badge}
      </Badge>
    </Box>
  )
}
