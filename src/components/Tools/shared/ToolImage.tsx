import { CheckCircleIcon, WarningIcon } from '@chakra-ui/icons'
import { Badge, Box, Icon, ImageProps, Tooltip } from '@chakra-ui/react'
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

  const tooltipLabel = isAvailable ? t('tools.available') : t('tools.unavailable')

  return (
    <Box position='relative'>
      <ServerImage imageId={imageHash} alt={title} height={height} width='100%' objectFit='cover' thumbnail {...rest} />
      <Tooltip label={tooltipLabel} hasArrow>
        <Badge
          position='absolute'
          top={2}
          right={2}
          colorScheme={isAvailable ? 'green' : 'gray'}
          p={1}
          borderRadius='full'
          display='flex'
          alignItems='center'
          justifyContent='center'
        >
          <Icon as={isAvailable ? CheckCircleIcon : WarningIcon} boxSize={4} />
        </Badge>
      </Tooltip>
    </Box>
  )
}
