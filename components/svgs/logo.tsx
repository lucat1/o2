import * as React from 'react'

const Logo: React.FC<React.SVGProps<SVGSVGElement>> = (
  props: React.SVGProps<SVGSVGElement>
) => (
  <svg viewBox='0 0 600 520' {...props}>
    <polygon points='300,520 600,0 0,0' fill='currentColor' />
  </svg>
)

if (process.env.NODE_ENV !== 'production') {
  Logo.displayName = 'Logo'
}

export default Logo
