import { extendTheme, type ThemeConfig } from '@chakra-ui/react'
import { Button } from './components/button'
import { Checkbox } from './components/checkbox'
import { Input } from './components/input'
import { Link } from './components/link' // import { Text } from './components/text'
import { Menu } from './components/menu'
import { Modal } from './components/modal'
import { Popover } from './components/popover'
import { Select } from './components/select'
import { Slider } from './components/slider'
import { Switch } from './components/switch'
import { Textarea } from './components/textarea'
import { Tooltip } from './components/tooltip'

const config: ThemeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: false,
}

const theme = extendTheme({
  config,
  colors: {
    primary: {
      50: '#F0FFF4',
      100: '#C6F6D5',
      200: '#9AE6B4',
      300: '#68D391',
      400: '#48BB78',
      500: '#38A169',
      600: '#2F855A',
      700: '#276749',
      800: '#22543D',
      900: '#1C4532',
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
      // Map styles
      '.leaflet-container': {
        width: '100%',
        height: '100%',
        'z-index': 1,
      },
      // Custom marker with badge
      '.custom-div-icon': {
        background: 'none',
        border: 'none',
      },
      '.custom-marker': {
        position: 'relative',
        width: '25px',
        height: '41px',
      },
      '.custom-marker img': {
        width: '100%',
        height: '100%',
      },
      '.marker-badge': {
        position: 'absolute',
        top: '-8px',
        right: '-8px',
        backgroundColor: '#E53E3E',
        color: 'white',
        borderRadius: '50%',
        width: '20px',
        height: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '12px',
        fontWeight: 'bold',
        border: '2px solid white',
        boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
      },
      // Marker cluster styles
      '.marker-cluster-small': {
        backgroundColor: 'rgba(181, 226, 140, 0.6)',
      },
      '.marker-cluster-small div': {
        backgroundColor: 'rgba(110, 204, 57, 0.6)',
      },
      '.marker-cluster-medium': {
        backgroundColor: 'rgba(241, 211, 87, 0.6)',
      },
      '.marker-cluster-medium div': {
        backgroundColor: 'rgba(240, 194, 12, 0.6)',
      },
      '.marker-cluster-large': {
        backgroundColor: 'rgba(253, 156, 115, 0.6)',
      },
      '.marker-cluster-large div': {
        backgroundColor: 'rgba(241, 128, 23, 0.6)',
      },
      '.marker-cluster': {
        backgroundClip: 'padding-box',
        borderRadius: '20px',
      },
      '.marker-cluster div': {
        width: '30px',
        height: '30px',
        marginLeft: '5px',
        marginTop: '5px',
        textAlign: 'center',
        borderRadius: '15px',
        font: '12px "Helvetica Neue", Arial, Helvetica, sans-serif',
      },
      '.marker-cluster span': {
        lineHeight: '30px',
      },
      '.leaflet-container a.chakra-button': {
        color: 'white',
      },
      '.leaflet-popup-content, .leaflet-popup-content-wrapper': {
        margin: 0,
        padding: 0,
      },
      '.leaflet-popup-content p': {
        margin: 0,
      },
      '.map-container': {
        height: '300px',
        width: '100%',
        position: 'relative',
        borderRadius: '0.375rem',
        overflow: 'hidden',
      },
    }),
  },
  components: {
    Button,
    Checkbox,
    Input,
    Select,
    Slider,
    Switch,
    Textarea,
    Menu,
    Popover,
    Tooltip,
    Modal,
    Link,
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
})

export default theme
