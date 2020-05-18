import * as React from 'react'
import { Box, BoxProps } from 'rebass'

export const Skeleton: React.FC<BoxProps> = ({ height, width, ...props }) => (
  <Box
    {...(props as any)}
    as='span'
    height={height}
    width={width}
    sx={Object.assign(
      {
        bg: 'bg.3',
        borderRadius: 'md',
        display: 'inline-block',
        outline: 'none'
      },
      props.sx
    )}
  />
)

export default Skeleton
