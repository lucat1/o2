import { Theme } from 'styled-system'
import { keyframes } from '@emotion/css'

const animation = keyframes`
  100% {
    background: transparent;
    color: inherit;
  }
`

const fontFamily = "'Operator Mono', monospace, mono"

export const base: Theme & { forms: any } = {
  colors: {
    primary: {
      default: '#c792ea',
      light: 'rgba(var(--primary-rgb), 0.4);'
    },
    error: '#fd9726',
    bg: {
      3: 'var(--bg-3)',
      4: 'var(--bg-4)',
      5: 'var(--bg-5)',
      6: 'var(--bg-6)'
    },
    fg: {
      5: 'var(--fg-5)'
    }
  },
  space: [
    0,
    '.25rem',
    '.5rem',
    '.75rem',
    '1rem',
    '1.5rem',
    '2rem',
    '3rem',
    '4rem',
    '5rem',
    '6rem'
  ],
  sizes: {
    0: 0,
    1: '.5rem',
    2: '1rem',
    3: '1.5rem',
    4: '2rem',
    5: '2.5rem',
    6: '3rem',
    7: '5rem',
    8: '10rem',
    9: '15rem',

    md: '1.25rem'
  },
  radii: {
    sm: '.25rem',
    md: '.5rem',
    lg: '50%'
  },
  fontSizes: {
    xs: '.75em',
    sm: '.85em',
    md: 'calc(1rem + 0.25vw)',
    lg: '1.5em'
  },
  fonts: {
    default: fontFamily,
    heading: fontFamily
  },
  shadows: {
    focus: '0 0 0 4px rgba(var(--primary-rgb), 0.3)',
    sm: '0px 3px 5px rgba(0, 0, 0, 0.04)'
  },
  breakpoints: ['960px', '1440px'],

  // customization section for @rebass/forms
  forms: {
    input: {
      'borderRadius': 'md',
      'outline': 'none',
      'transition': 'box-shadow 200ms ease-in-out',
      'borderColor': 'bg.3',
      'fontSize': 'sm',
      'fontFamily': 'default',
      'px': 4,
      'py': 2,

      ':focus': {
        borderColor: 'primary.light',
        boxShadow: 'focus'
      },

      ':-webkit-autofill': {
        animation: `${animation} 0s forwards`
      }
    },
    error: {
      my: 2,
      fontSize: 'sm',
      color: 'error'
    },
    label: {
      my: 2
    }
  }
}
