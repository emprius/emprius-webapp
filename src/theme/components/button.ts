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
    _dark: {
      bg: `${colorScheme}.300`,
      color: 'gray.800',
      _hover: {
        bg: `${colorScheme}.400`,
        _disabled: {
          bg: `${colorScheme}.300`,
        },
      },
      _active: {
        bg: `${colorScheme}.500`,
      },
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
