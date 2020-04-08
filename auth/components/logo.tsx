import * as React from 'react'
import { useTheme } from '@emotion/react'

import Theme from '../types/theme'

const Logo: React.FunctionComponent = (
  props: React.SVGProps<SVGSVGElement>
) => {
  const theme = useTheme() as Theme

  return (
    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 520' {...props}>
      <polygon points='300,520 600,0 0,0' fill={theme.color} />
    </svg>
  )
}

export default Logo
