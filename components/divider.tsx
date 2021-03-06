import * as React from 'react'
import { Box, BoxProps } from 'rebass'
import merge from '../types/xtend'

const Divider: React.FC<BoxProps> = props => (
  <Box
    {...(props as any)}
    as={props.as || 'hr'}
    css={merge({ border: 0, height: '1px' }, props.css)}
    sx={merge({ bg: 'bg.3' }, props.sx)}
  />
)

export default Divider
