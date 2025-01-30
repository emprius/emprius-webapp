import { defineStyle, defineStyleConfig } from '@chakra-ui/react'

const baseStyle = defineStyle({
  fontWeight: 'medium',
  borderRadius: 'md',
})

export const Button = defineStyleConfig({
  baseStyle,
  defaultProps: {
    colorScheme: 'primary',
  },
})
