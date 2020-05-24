import * as React from 'react'
import { Box, BoxProps } from 'rebass'
import merge from '../types/xtend'

const Relative: React.FC<BoxProps> = props => (
  <Box {...(props as any)} css={merge({ position: 'relative' }, props.css)} />
)

export default Relative
