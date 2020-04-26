import * as React from 'react'

const Logo: React.FunctionComponent<React.SVGProps<SVGSVGElement>> = (
  props: React.SVGProps<SVGSVGElement>
) => (
  <svg viewBox='0 0 24 24' {...props}>
    <path
      d='M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z'
      fill='var(--fg-5)'
    />
  </svg>
)

if (process.env.NODE_ENV !== 'production') {
  Logo.displayName = 'Logo'
}

export default Logo
