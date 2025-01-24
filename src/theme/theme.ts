import { extendTheme, type ThemeConfig } from '@chakra-ui/react';

const config: ThemeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: false,
};

const theme = extendTheme({
  config,
  colors: {
    primary: {
      50: '#E6F6FF',
      100: '#BAE3FF',
      200: '#7CC4FA',
      300: '#47A3F3',
      400: '#2186EB',
      500: '#0967D2',
      600: '#0552B5',
      700: '#03449E',
      800: '#01337D',
      900: '#002159',
    },
  },
  fonts: {
    heading: 'Montserrat, system-ui, sans-serif',
    body: 'Roboto, system-ui, sans-serif',
  },
  styles: {
    global: (props: { colorMode: string }) => ({
      body: {
        bg: props.colorMode === 'dark' ? 'gray.800' : 'gray.50',
        color: props.colorMode === 'dark' ? 'white' : 'gray.800',
      },
    }),
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: 'medium',
        borderRadius: 'md',
      },
      defaultProps: {
        colorScheme: 'primary',
      },
    },
    Input: {
      variants: {
        outline: (props: { colorMode: string }) => ({
          field: {
            bg: props.colorMode === 'dark' ? 'whiteAlpha.100' : 'white',
            color: props.colorMode === 'dark' ? 'white' : 'gray.800',
            _placeholder: {
              color: props.colorMode === 'dark' ? 'whiteAlpha.600' : 'gray.500',
            },
          },
        }),
      },
      defaultProps: {
        focusBorderColor: 'primary.500',
      },
    },
    Select: {
      variants: {
        outline: (props: { colorMode: string }) => ({
          field: {
            bg: props.colorMode === 'dark' ? 'whiteAlpha.100' : 'white',
            color: props.colorMode === 'dark' ? 'white' : 'gray.800',
          },
        }),
      },
      defaultProps: {
        focusBorderColor: 'primary.500',
      },
    },
    Textarea: {
      variants: {
        outline: (props: { colorMode: string }) => ({
          bg: props.colorMode === 'dark' ? 'whiteAlpha.100' : 'white',
          color: props.colorMode === 'dark' ? 'white' : 'gray.800',
          _placeholder: {
            color: props.colorMode === 'dark' ? 'whiteAlpha.600' : 'gray.500',
          },
        }),
      },
      defaultProps: {
        focusBorderColor: 'primary.500',
      },
    },
    Menu: {
      baseStyle: (props: { colorMode: string }) => ({
        list: {
          bg: props.colorMode === 'dark' ? 'gray.700' : 'white',
          borderColor: props.colorMode === 'dark' ? 'whiteAlpha.300' : 'gray.200',
        },
        item: {
          bg: props.colorMode === 'dark' ? 'gray.700' : 'white',
          color: props.colorMode === 'dark' ? 'white' : 'gray.800',
          _hover: {
            bg: props.colorMode === 'dark' ? 'whiteAlpha.200' : 'gray.100',
          },
          _focus: {
            bg: props.colorMode === 'dark' ? 'whiteAlpha.200' : 'gray.100',
          },
        },
      }),
    },
    Popover: {
      baseStyle: (props: { colorMode: string }) => ({
        content: {
          bg: props.colorMode === 'dark' ? 'gray.700' : 'white',
          borderColor: props.colorMode === 'dark' ? 'whiteAlpha.300' : 'gray.200',
          color: props.colorMode === 'dark' ? 'white' : 'gray.800',
        },
        header: {
          borderColor: props.colorMode === 'dark' ? 'whiteAlpha.300' : 'gray.200',
        },
        body: {
          color: props.colorMode === 'dark' ? 'white' : 'gray.800',
        },
      }),
    },
    Tooltip: {
      baseStyle: (props: { colorMode: string }) => ({
        bg: props.colorMode === 'dark' ? 'gray.700' : 'gray.700',
        color: props.colorMode === 'dark' ? 'white' : 'white',
        borderRadius: 'md',
        px: '2',
        py: '1',
      }),
    },
    Modal: {
      baseStyle: (props: { colorMode: string }) => ({
        dialog: {
          bg: props.colorMode === 'dark' ? 'gray.800' : 'white',
          borderColor: props.colorMode === 'dark' ? 'whiteAlpha.300' : 'gray.200',
        },
        header: {
          borderColor: props.colorMode === 'dark' ? 'whiteAlpha.300' : 'gray.200',
          color: props.colorMode === 'dark' ? 'white' : 'gray.800',
        },
        body: {
          color: props.colorMode === 'dark' ? 'white' : 'gray.800',
        },
        footer: {
          borderColor: props.colorMode === 'dark' ? 'whiteAlpha.300' : 'gray.200',
        },
      }),
    },
    Link: {
      baseStyle: {
        _hover: {
          textDecoration: 'none',
        },
      },
    },
  },
  shadows: {
    outline: '0 0 0 3px rgba(9, 103, 210, 0.6)',
  },
  radii: {
    sm: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
  },
  space: {
    '4xs': '0.125rem',
    '3xs': '0.25rem',
    '2xs': '0.375rem',
    xs: '0.5rem',
    sm: '0.75rem',
    md: '1rem',
    lg: '1.25rem',
    xl: '1.5rem',
    '2xl': '2rem',
    '3xl': '2.5rem',
    '4xl': '3rem',
  },
  sizes: {
    container: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
    },
  },
  breakpoints: {
    sm: '30em', // 480px
    md: '48em', // 768px
    lg: '62em', // 992px
    xl: '80em', // 1280px
    '2xl': '96em', // 1536px
  },
  transition: {
    easing: {
      'ease-in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
      'ease-out': 'cubic-bezier(0, 0, 0.2, 1)',
      'ease-in': 'cubic-bezier(0.4, 0, 1, 1)',
    },
    duration: {
      'ultra-fast': '50ms',
      faster: '100ms',
      fast: '150ms',
      normal: '200ms',
      slow: '300ms',
      slower: '400ms',
      'ultra-slow': '500ms',
    },
  },
});

export default theme;
