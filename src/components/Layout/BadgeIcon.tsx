import { Box, BoxProps, IconProps } from '@chakra-ui/react'
import React from 'react'
import { IconType } from 'react-icons'

interface BadgeCounterProps extends BoxProps {
  count: number
  badgeProps?: BoxProps
}

interface BadgeIconProps extends BadgeCounterProps {
  icon: IconType
  'aria-label': string
  iconProps?: IconProps
}

export const BadgeIcon = ({ icon: IconType, 'aria-label': ariaLabel, iconProps, ...props }: BadgeIconProps) => {
  return (
    <BadgeCounter {...props}>
      <Box as={IconType} aria-label={ariaLabel} {...iconProps} />
    </BadgeCounter>
  )
}

export const BadgeCounter = ({ children, count, badgeProps, ...props }: BadgeCounterProps) => {
  return (
    <Box position='relative' {...props}>
      {children}
      {count > 0 && (
        <Box
          position='absolute'
          top='-8px'
          right='-10px'
          px={2}
          py={1}
          fontSize='xs'
          fontWeight='bold'
          lineHeight='none'
          color='white'
          transform='scale(0.8)'
          bg='red.500'
          borderRadius='full'
          {...badgeProps}
        >
          {count}
        </Box>
      )}
    </Box>
  )
}
