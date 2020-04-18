import * as React from 'react'
import { styled } from 'goober'

export const Base = styled('div')`
  display: inline-block;
  background: var(--background);
  border-radius: 0.25em;
`

export interface SkeletonProps {
  width: number | string
  height: number | string
}

const Skeleton: React.FunctionComponent<SkeletonProps> = ({
  width,
  height,
  ...props
}) => {
  const w =
    typeof width === 'string' ? width : width.toString().substr(0, 3) + 'em'
  const h =
    typeof height === 'string' ? height : height.toString().substr(0, 3) + 'em'

  return <Base style={{ width: w, height: h }} {...props} />
}

if (process.env.NODE_ENV !== 'production') {
  Skeleton.displayName = 'Skeleton'
}

export default Skeleton
