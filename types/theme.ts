import { Theme } from 'styled-system'

export const base: Theme = {
  colors: {
    primary: '#c792ea',
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
  sizes: ['.5rem', '1rem', '1.5rem', '2rem', '2.5rem', '3rem'],
  radii: {
    sm: '.25rem',
    md: '.5rem',
    lg: '50%'
  },
  fontSizes: {
    sm: '.75em',
    md: 'calc(1rem + 0.25vw)',
    lg: '1.25em'
  }
}
