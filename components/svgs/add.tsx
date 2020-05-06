import * as React from 'react'

const Add: React.FunctionComponent<React.SVGProps<SVGSVGElement>> = (
  props: React.SVGProps<SVGSVGElement>
) => (
  <svg viewBox='0 0 24 24' {...props}>
    <path d='M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z' fill='currentColor' />
  </svg>
)

export default Add
