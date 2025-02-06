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
        bg: `${colorScheme}.600`,

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

// const sizes = {
//   sm: definePartsStyle({
//     container: { width: '1.875rem', height: '1rem' },
//     thumb: { width: '0.75rem', height: '0.75rem' },
//     track: { width: '1.875rem', height: '1rem' },
//   }),
//   md: definePartsStyle({
//     container: { width: '2.875rem', height: '1.5rem' },
//     thumb: { width: '1.25rem', height: '1.25rem' },
//     track: { width: '2.875rem', height: '1.5rem' },
//   }),
//   lg: definePartsStyle({
//     container: { width: '3.875rem', height: '2rem' },
//     thumb: { width: '1.75rem', height: '1.75rem' },
//     track: { width: '3.875rem', height: '2rem' },
//   }),
// }

export const Switch = defineMultiStyleConfig({
  baseStyle,
  defaultProps: {
    colorScheme: 'primary',
  },
})
