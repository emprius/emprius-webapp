import { tabsAnatomy } from '@chakra-ui/anatomy'
import { createMultiStyleConfigHelpers, defineStyle } from '@chakra-ui/react'
import { theme } from '@chakra-ui/theme'
import { keyframes } from '@emotion/react'

const { definePartsStyle, defineMultiStyleConfig } = createMultiStyleConfigHelpers(tabsAnatomy.keys)

// Define animations for the gradient variant
const slideIn = keyframes`
  from { transform: scaleX(0); opacity: 0; }
  to { transform: scaleX(1); opacity: 1; }
`

// Gradient variant
const gradient = definePartsStyle((props) => {
  const { colorScheme } = props
  return {
    tablist: {
      borderBottom: '2px solid',
      borderColor: 'gray.200',
      gap: 1,
      mb: 1,
      _dark: {
        borderColor: 'gray.700',
      },
    },
    tab: {
      fontWeight: 'medium',
      color: 'gray.600',
      borderBottom: '3px solid',
      borderColor: 'transparent',
      transition: 'all 0.3s ease-in-out',
      position: 'relative',
      boxShadow: 'none',
      borderTopRadius: 'md',
      px: 3,
      pt: 2,
      pb: 1,
      _selected: {
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        bg: `${colorScheme}.500`,
        color: 'white',
        bgGradient: `linear-gradient(135deg, ${colorScheme}.400 0%, ${colorScheme}.600 100%)`,
        _after: {
          content: '""',
          position: 'absolute',
          bottom: '-3px',
          left: '0',
          right: '0',
          height: '3px',
          bg: `${colorScheme}.700`,
          borderRadius: 'full',
          animation: `${slideIn} 0.3s ease-in-out forwards`,
          transformOrigin: 'left',
        },
        _dark: {
          bg: `${colorScheme}.400`,
          color: 'gray.800',
          borderColor: `${colorScheme}.600`,
          _after: {
            bg: `${colorScheme}.600`,
          },
        },
      },
      _hover: {
        color: 'white',
        bgGradient: `linear-gradient(135deg, ${colorScheme}.300 0%, ${colorScheme}.500 100%)`,
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
        _selected: {
          bgGradient: `linear-gradient(135deg, ${colorScheme}.400 0%, ${colorScheme}.600 100%)`,
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        },
      },
      _active: {
        bgGradient: `linear-gradient(135deg, ${colorScheme}.500 0%, ${colorScheme}.700 100%)`,
        color: 'white',
      },
      _dark: {
        color: 'whiteAlpha.700',
        _hover: {
          color: 'gray.800',
          bgGradient: `linear-gradient(135deg, ${colorScheme}.300 0%, ${colorScheme}.500 100%)`,
        },
        _active: {
          color: 'gray.800',
          bgGradient: `linear-gradient(135deg, ${colorScheme}.400 0%, ${colorScheme}.600 100%)`,
        },
      },
    },
    tabpanel: {
      ...theme.components.Tabs.baseStyle(props).tabpanel,
    },
  }
})

const outline = definePartsStyle((props) => {
  const { colorScheme } = props
  return {
    tablist: {
      borderBottom: '2px solid',
      borderColor: 'gray.200',
      mb: 1,
      _dark: {
        borderColor: 'gray.700',
      },
    },
    tab: {
      fontWeight: 'medium',
      color: 'gray.600',
      borderColor: 'transparent',
      position: 'relative',
      boxShadow: 'none',
      borderTopRadius: 'md',
      bg: 'transparent',
      _dark: {
        color: 'gray.300',
      },
      _selected: {
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        border: '1px solid',
        borderColor: `${colorScheme}.500`,
        _after: {
          content: '""',
          position: 'absolute',
          bottom: '-3px',
          left: '0',
          right: '0',
          height: '2px',
          bg: `${colorScheme}.500`,
          borderRadius: 'full',
          animation: `${slideIn} 0.4s ease-in-out forwards`,
          transformOrigin: 'left',
        },
        _dark: {
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
          borderColor: `${colorScheme}.400`,
          _after: {
            bg: `${colorScheme}.400`,
          },
        },
      },
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
    },
    tabpanel: {
      ...theme.components.Tabs.baseStyle(props).tabpanel,
    },
  }
})

export const Tabs = defineMultiStyleConfig({
  baseStyle: theme.components.Tabs.baseStyle,
  variants: {
    gradient,
    outline,
    ...theme.components.Tabs.variants,
  },
  defaultProps: {
    variant: 'line',
    colorScheme: 'primary',
  },
})
