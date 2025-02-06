import { defineStyle, defineStyleConfig } from '@chakra-ui/react'

const baseStyle = {
  fontWeight: 'medium',
  borderRadius: '2xl',
  transition: 'all 0.2s ease-in-out',
  _focus: {
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  },
  _active: {
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  },
  _hover: {
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  },
}

const gradient = defineStyle((props) => {
  const { colorScheme } = props
  return {
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    bg: `${colorScheme}.500`,
    color: 'white',
    bgGradient: `linear-gradient(135deg, ${colorScheme}.400 0%, ${colorScheme}.600 100%)`,

    _hover: {
      bg: `${colorScheme}.600`,
      boxShadow: '0 6px 16px rgba(0, 0, 0, 0.15)',
      _disabled: {
        bg: `${colorScheme}.500`,
        transform: 'none',
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

// const gradient = defineStyle((props) => {
//   const { colorScheme } = props
//   return {
//     bgGradient: `linear-gradient(135deg, ${colorScheme}.400 0%, ${colorScheme}.600 100%)`,
//     color: 'white',
//     transition: 'all 0.3s ease',
//     _hover: {
//       transform: 'scale(1.02)',
//       boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
//     },
//     _active: {
//       transform: 'scale(0.98)',
//     },
//   }
// })

const outline = defineStyle((props) => {
  const { colorScheme } = props
  return {
    border: '2px solid',
    borderColor: `${colorScheme}.500`,
    color: `${colorScheme}.500`,
    bg: 'transparent',
    _hover: {
      bg: `${colorScheme}.50`,
      _dark: {
        bg: `${colorScheme}.900`,
      },
    },
    _active: {
      bg: `${colorScheme}.100`,
      _dark: {
        bg: `${colorScheme}.800`,
      },
    },
  }
})

const iconButton = defineStyle({
  borderRadius: 'full',
  aspectRatio: '1/1',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'all 0.2s',
  _hover: {
    transform: 'rotate(5deg)',
  },
})

export const Button = defineStyleConfig({
  baseStyle,
  variants: {
    // floating,
    gradient,
    outline,
    iconButton,
  },
  defaultProps: {
    variant: 'gradient',
    colorScheme: 'primary',
    // size: 'md',
  },
})
