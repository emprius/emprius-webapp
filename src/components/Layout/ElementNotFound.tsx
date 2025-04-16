import { Box, BoxProps, Text } from '@chakra-ui/react'
import React from 'react'
import { IconType } from 'react-icons'

type NotFoundProps = { title: string; desc: string; icon?: IconType }

export const ElementNotFound = ({ title, desc, icon, ...props }: NotFoundProps & BoxProps) => {
  return (
    <Box textAlign='center' py={10} {...props}>
      {icon && <Box as={icon} boxSize={12} color='gray.400' mx='auto' mb={4} />}
      <Text fontSize='xl' fontWeight='medium' color='gray.500' mb={2}>
        {title}
      </Text>
      {desc && <Text color='gray.400'>{desc}</Text>}
    </Box>
  )
}
