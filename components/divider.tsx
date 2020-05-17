import * as React from 'react'
import { Box, BoxProps } from 'rebass'

const Divider: React.FC<BoxProps> = props => (
  <Box
    {...(props as any)}
    as='hr'
    sx={{
      bg: 'bg.3',
      border: 0,
      height: '1px'
    }}
  />
)

export default Divider
