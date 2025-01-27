import { Badge, Box, ImageProps } from '@chakra-ui/react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { ServerImage } from '~components/Images/ServerImage'

type ToolImageProps = {
  imageHash?: string
  title: string
  isAvailable: boolean
  height?: string
} & Omit<ImageProps, 'src'>

export const ToolImage = ({ imageHash, title, isAvailable, height = '200px', ...rest }: ToolImageProps) => {
  const { t } = useTranslation()

  let badge = t(`tools.unavailable`)
  if (isAvailable) {
    badge = t(`tools.available`)
  }
  return (
    <Box position='relative'>
      <ServerImage imageId={imageHash} alt={title} height={height} width='100%' objectFit='cover' {...rest} />
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
