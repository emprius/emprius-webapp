import { CheckCircleIcon } from '@chakra-ui/icons'
import { Badge, Box, Icon, ImageProps, Link, Skeleton, Tooltip } from '@chakra-ui/react'
import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { TiCancel } from 'react-icons/ti'
import { Link as RouterLink } from 'react-router-dom'
import { ServerImage, ServerImageProps } from '~components/Images/ServerImage'
import { Tool } from '~components/Tools/types'
import { ROUTES } from '~src/router/routes'

type ToolImageProps = {
  toolId?: number
} & Omit<ServerImageProps, 'fallbackSrc'>

type ToolImageAvailabilityProps = {
  isAvailable: boolean
} & ToolImageProps

export const ToolImageAvailability = ({ isAvailable, isLoading, ...rest }: ToolImageAvailabilityProps) => {
  const { t } = useTranslation()
  const tooltipLabel = isAvailable ? t('tools.available') : t('tools.unavailable')

  return (
    <Box position='relative'>
      <ToolImage height='200px' {...rest} />
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

export const ToolImage = ({ toolId, isLoading, ...rest }: ToolImageProps) => {
  if (isLoading) {
    return <Skeleton height='100%' />
  }

  if (!toolId) {
    return <Image {...rest} />
  }

  return (
    <Link as={RouterLink} to={ROUTES.TOOLS.DETAIL.replace(':id', toolId?.toString() ?? '')}>
      <Image {...rest} />
    </Link>
  )
}

const Image = (props: ToolImageProps) => (
  <ServerImage width='100%' height='100%' objectFit='cover' thumbnail {...props} />
)
