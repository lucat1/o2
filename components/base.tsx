import * as React from 'react'
import { Box, BoxProps, FlexProps } from 'rebass'
import merge from '../types/xtend'

const Base: React.FC<BoxProps & FlexProps> = props => (
  <Box
    {...(props as any)}
    sx={merge(
      {
        display: 'flex',
        borderRadius: 'md',
        border: '1px solid',
        borderColor: 'bg.3',
        my: 4
      },
      props.sx
    )}
  />
)

export default Base
