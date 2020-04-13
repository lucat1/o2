import * as React from 'react'
import styled from '@emotion/styled'
import { darken, lighten } from 'polished'

import Theme from '../types/theme'

const SkeletonBase = styled.div<{ theme?: Theme }>`
  display: inline-block;
  background: ${({ theme }) =>
    theme.dark
      ? lighten(0.1)(theme.background)
      : darken(0.1)(theme.background)};
  border-radius: 0.25rem;
`

export interface SkeletonProps {
  width: number | string
  height: number | string
}

const Skeleton: React.FunctionComponent<SkeletonProps> = props => {
  const width =
    typeof props.width === 'string'
      ? props.width
      : props.width.toString().substr(0, 3) + 'em'
  const height =
    typeof props.height === 'string'
      ? props.height
      : props.height.toString().substr(0, 3) + 'em'

  return <SkeletonBase style={{ width, height }} />
}

if (process.env.NODE_ENV !== 'production') {
  Skeleton.displayName = 'Skeleton'
}

export default Skeleton
