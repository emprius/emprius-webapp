import { defineStyle, defineStyleConfig } from '@chakra-ui/react'

const baseStyle = defineStyle({
  focusBorderColor: 'primary.500',
})

const outline = defineStyle({
  bg: 'white',
  color: 'gray.800',
  _placeholder: {
    color: 'gray.500',
  },
  _dark: {
    bg: 'whiteAlpha.100',
    color: 'white',
    _placeholder: {
      color: 'whiteAlpha.600',
    },
  },
})

export const Textarea = defineStyleConfig({
  baseStyle,
  variants: { outline },
  defaultProps: {
    variant: 'outline',
  },
})
