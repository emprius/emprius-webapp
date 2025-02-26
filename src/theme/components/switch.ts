import { switchAnatomy } from '@chakra-ui/anatomy'
import { createMultiStyleConfigHelpers } from '@chakra-ui/react'

const { definePartsStyle, defineMultiStyleConfig } = createMultiStyleConfigHelpers(switchAnatomy.keys)

const baseStyle = definePartsStyle((props) => {
  const { colorScheme } = props

  return {
    container: {
      display: 'inline-block',
    },
    thumb: {
      bg: 'white',
      transition: 'transform 0.2s ease-in-out',
      boxShadow: 'sm',
      _checked: {
        // transform: 'translateX(calc(100% + 0.1rem))',
      },
    },
    track: {
      bg: 'gray.300',
      padding: '0.125rem',
      transition: 'background 0.2s ease-in-out',
      _dark: {
        bg: 'whiteAlpha.200',
      },
      _checked: {
        bgGradient: `linear-gradient(135deg, ${colorScheme}.400 0%, ${colorScheme}.600 100%)`,
        _dark: {
          bg: `${colorScheme}.200`,
        },
      },
      _hover: {
        bg: `${colorScheme}.200`,

        _dark: {
          bg: 'whiteAlpha.300',
        },
        _checked: {
          bg: `${colorScheme}.600`,
          _dark: {
            bg: `${colorScheme}.300`,
          },
        },
      },
    },
  }
})

export const Switch = defineMultiStyleConfig({
  baseStyle,
  defaultProps: {
    colorScheme: 'primary',
  },
})
