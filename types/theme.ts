import { Theme } from 'styled-system'
import { keyframes } from '@emotion/css'

const animation = keyframes`
  100% {
    background: transparent;
    color: inherit;
  }
`

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
  space: [0, '.25rem', '.5rem', '.75rem', '1rem', '1.5rem', '2rem', '4rem'],
  sizes: [
    0,
    '.5rem',
    '1rem',
    '1.5rem',
    '2rem',
    '2.5rem',
    '3rem',
    '5rem',
    '10rem',
    '15rem'
  ],
  radii: {
    sm: '.25rem',
    md: '.5rem',
    lg: '50%'
  },
  fontSizes: {
    xs: '.75em',
    sm: '.85em',
    md: 'calc(1rem + 0.25vw)',
    lg: '1.25em'
  },
  fonts: {
    default: "'Operator Mono', monospace, mono"
  },
  shadows: {
    focus: '0 0 0 4px rgba(var(--primary-rgb), 0.3)',
    sm: '0px 3px 5px rgba(0, 0, 0, 0.04)'
  },
  breakpoints: ['960px'],

  buttons: {
    'primary': {
      'outline': 'none',
      'display': 'flex',
      'alignItems': 'center',
      'justifyContent': 'center',
      'whiteSpace': 'nowrap',
      'transition': 'box-shadow 200ms ease-in-out',
      'cursor': 'pointer',

      'bg': 'primary.default',
      'color': 'bg.5',
      'border': '1px solid',
      'borderColor': 'primary.default',
      'borderRadius': 'md',
      'fontFamily': 'default',
      'fontSize': 'xs',
      'px': 4,
      'py': 2,
      'minWidth': '8em',

      ':focus': {
        boxShadow: 'focus'
      }
    },

    'sm': {
      variant: 'buttons.primary',
      minWidth: '1.25rem',
      py: 1
    },

    'md': {
      variant: 'buttons.primary',
      minWidth: '5.5rem'
    },

    'secondary': {
      variant: 'buttons.primary',
      borderColor: 'bg.3',
      color: 'fg.5',
      bg: 'transparent'
    },

    'md-secondary': {
      variant: 'buttons.secondary',
      minWidth: '5.5rem'
    }
  } as any,

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
