import { defineStyle, defineStyleConfig } from '@chakra-ui/react'

const baseStyle = defineStyle({
  color: 'primary.500',
  _hover: {
    textDecoration: 'none',
    color: 'primary.600',
  },
  _dark: {
    color: 'primary.300',
    _hover: {
      color: 'primary.400',
    },
  },
})

export const Link = defineStyleConfig({
  baseStyle,
})
