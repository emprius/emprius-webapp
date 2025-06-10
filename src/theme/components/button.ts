import { defineStyle, defineStyleConfig } from '@chakra-ui/react'

const baseStyle = {
  fontWeight: 'medium',
  borderRadius: 'lg',
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

const cta = defineStyle({
  boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3), 0 4px 12px rgba(147, 51, 234, 0.3)',
  color: 'white',
  bgGradient: 'linear(to-r, blue.600, purple.600)',
  _hover: {
    bgGradient: 'linear(to-r, blue.500, purple.500)',
    boxShadow: '0 0 20px rgba(59, 130, 246, 0.5), 0 0 20px rgba(147, 51, 234, 0.5)',
    _disabled: {
      bgGradient: 'linear(to-r, blue.600, purple.600)',
      opacity: 0.6,
      transform: 'none',
      cursor: 'not-allowed',
    },
  },
  _active: {
    bgGradient: 'linear(to-r, blue.400, purple.400)',
    boxShadow: '0 0 25px rgba(59, 130, 246, 0.6), 0 0 25px rgba(147, 51, 234, 0.6)',
  },
  _disabled: {
    bgGradient: 'linear(to-r, blue.600, purple.600)',
    opacity: 0.6,
    cursor: 'not-allowed',
  },
  _dark: {
    bgGradient: 'linear(to-r, blue.500, purple.500)',
    boxShadow: '0 4px 12px rgba(96, 165, 250, 0.3), 0 4px 12px rgba(168, 85, 247, 0.3)',
    _hover: {
      bgGradient: 'linear(to-r, blue.400, purple.400)',
      boxShadow: '0 0 20px rgba(96, 165, 250, 0.5), 0 0 20px rgba(168, 85, 247, 0.5)',
      _disabled: {
        bgGradient: 'linear(to-r, blue.500, purple.500)',
        opacity: 0.6,
      },
    },
    _active: {
      bgGradient: 'linear(to-r, blue.300, purple.300)',
      boxShadow: '0 0 25px rgba(96, 165, 250, 0.6), 0 0 25px rgba(168, 85, 247, 0.6)',
    },
  },
})

export const Button = defineStyleConfig({
  baseStyle,
  variants: {
    gradient,
    outline,
    iconButton,
    cta,
  },
  defaultProps: {
    variant: 'gradient',
    colorScheme: 'primary',
  },
})
