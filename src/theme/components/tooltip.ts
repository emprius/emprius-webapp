import { defineStyle, defineStyleConfig } from '@chakra-ui/react'

const baseStyle = defineStyle({
  bg: 'gray.700',
  color: 'white',
  borderRadius: 'md',
  px: '2',
  py: '1',
  _dark: {
    bg: 'gray.700',
    color: 'white',
  },
})

export const Tooltip = defineStyleConfig({
  baseStyle,
})
