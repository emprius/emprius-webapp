import { CheckCircleIcon } from '@chakra-ui/icons'
import { Badge, Box, Icon, Link, Skeleton, Tooltip } from '@chakra-ui/react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { TiCancel } from 'react-icons/ti'
import { Link as RouterLink } from 'react-router-dom'
import { ServerImage, ServerImageProps } from '~components/Images/ServerImage'
import { ROUTES } from '~src/router/routes'

type ToolImageProps = {
  toolId?: number
} & Omit<ServerImageProps, 'fallbackSrc'>

type ToolImageAvailabilityProps = {
  isAvailable: boolean
  currentlyHolding?: boolean // Active if the auth user is currently holding the tool
  isHolder?: boolean // Active if an external user is currently holding the tool and you are looking its profile
  isLent?: boolean // Active if an external user is currently holding the tool and you are looking its profile
  isGranted?: boolean // Active if the nomadic tool is held by another user and the owner is looking its detail
} & ToolImageProps

export const ToolImageAvailability = ({
  isAvailable,
  currentlyHolding,
  isHolder,
  isGranted,
  ...rest
}: ToolImageAvailabilityProps) => {
  const { t } = useTranslation()
  const tooltipLabel = isAvailable ? t('tools.available') : t('tools.unavailable')

  let holdingText = ''
  if (isHolder) {
    holdingText = t('tools.is_holder', { defaultValue: 'Is holder' })
  }
  if (currentlyHolding) {
    holdingText = t('tools.currently_holding', { defaultValue: 'Holding' })
  }
  if (isGranted) {
    holdingText = t('tools.isGranted', { defaultValue: 'Granted' })
  }

  return (
    <Box position='relative'>
      {!rest.isLoading && holdingText && (
        <Badge
          position='absolute'
          top={2}
          left={2}
          colorScheme={isGranted ? 'gray' : 'orange'}
          p={1}
          display='flex'
          alignItems='center'
          justifyContent='center'
        >
          {holdingText}
        </Badge>
      )}
      <ToolImage height='200px' {...rest} />
      {!rest.isLoading && (
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
      )}
    </Box>
  )
}

export const ToolImage = ({ toolId, isLoading, ...rest }: ToolImageProps) => {
  if (isLoading) {
    return <Skeleton isLoaded={false} {...rest} />
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
