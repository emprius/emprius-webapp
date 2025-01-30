import { defineStyle, defineStyleConfig } from '@chakra-ui/react'

const baseStyle = defineStyle({
  fontWeight: 'medium',
  borderRadius: 'md',
})

const floating = defineStyle((props) => {
  const { colorScheme } = props
  return {
    borderRadius: 'lg',
    boxShadow: 'lg',
    bg: `${colorScheme}.500`,
    color: 'white',
    _hover: {
      bg: `${colorScheme}.600`,
      _disabled: {
        bg: `${colorScheme}.500`,
      },
    },
    _active: {
      bg: `${colorScheme}.700`,
    },
  }
})

export const Button = defineStyleConfig({
  baseStyle,
  variants: {
    floating,
  },
  defaultProps: {
    colorScheme: 'primary',
  },
})
