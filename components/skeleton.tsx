import { styled } from 'goober'
import * as React from 'react'

export const Base = styled('span')`
  display: inline-block;
  background: var(--bg-3);
  border-radius: 0.5em;
`

export interface SkeletonProps extends React.HTMLAttributes<HTMLSpanElement> {
  width: number | string
  height: number | string
}

const Skeleton: React.FunctionComponent<SkeletonProps> = ({
  width,
  height,
  style,
  ...props
}) => {
  const w =
    typeof width === 'string' ? width : width.toString().substr(0, 3) + 'em'
  const h =
    typeof height === 'string' ? height : height.toString().substr(0, 3) + 'em'

  return <Base style={{ width: w, height: h, ...style }} {...props} />
}

if (process.env.NODE_ENV !== 'production') {
  Skeleton.displayName = 'Skeleton'
}

export default Skeleton
