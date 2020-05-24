import * as React from 'react'
import { Box, ButtonProps } from 'rebass'
import merge from '../types/xtend'

import Arrow from './svgs/arrow'
import Button from './button'

const Dropbox: React.FC<ButtonProps & { open: boolean }> = ({
  children,
  open,
  ...props
}) => (
  <Button {...(props as any)}>
    {children}
    <Box
      as={Arrow}
      sx={merge(
        { ml: 2, height: 2, transition: 'transform 300ms ease-in-out' },
        props.sx
      )}
      style={{ transform: `rotate(${open ? 180 : 0}deg)` }}
    />
  </Button>
)

export default Dropbox
