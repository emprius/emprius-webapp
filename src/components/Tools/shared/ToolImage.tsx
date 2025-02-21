import { CheckCircleIcon } from '@chakra-ui/icons'
import { Badge, Box, Icon, ImageProps, Link, Skeleton, Tooltip } from '@chakra-ui/react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { TiCancel } from 'react-icons/ti'
import { Link as RouterLink } from 'react-router-dom'
import { ServerImage } from '~components/Images/ServerImage'
import { Tool } from '~components/Tools/types'
import { ROUTES } from '~src/router/routes'

type ToolImageProps = {
  imageHash?: string
  // id: string
  // isAvailable: boolean
  tool: Tool
  height?: string
} & Omit<ImageProps, 'src'>

export const ToolImage = ({ imageHash, tool, height = '200px', ...rest }: ToolImageProps) => {
  const { t } = useTranslation()

  const isLoading = !tool
  const isAvailable = tool?.isAvailable
  const tooltipLabel = isAvailable ? t('tools.available') : t('tools.unavailable')
  const id = tool?.id
  const title = tool?.title

  if (isLoading) {
    return <Skeleton height='100%' />
  }

  return (
    <Box position='relative'>
      <Link as={RouterLink} to={ROUTES.TOOLS.DETAIL.replace(':id', id?.toString() ?? '')}>
        <ServerImage
          imageId={imageHash}
          alt={title}
          height={height}
          width='100%'
          objectFit='cover'
          thumbnail
          {...rest}
        />
      </Link>
      <Tooltip label={tooltipLabel} hasArrow>
        <Badge
          position='absolute'
          top={2}
          right={2}
          colorScheme={isAvailable ? 'green' : 'orange'}
          p={1}
          borderRadius='full'
          display='flex'
          alignItems='center'
          justifyContent='center'
        >
          <Icon as={isAvailable ? CheckCircleIcon : TiCancel} boxSize={4} />
        </Badge>
      </Tooltip>
    </Box>
  )
}
