import * as React from 'react'
import styled from '@emotion/styled'
import { Button, ButtonProps } from 'rebass'

import Arrow from './svgs/arrow'

export const ArrowIcon = styled(Arrow)`
  margin-left: 0.5em;
  transition: transform 200ms ease-in-out;
`

//height: 2.35em;

const Dropbox: React.FC<ButtonProps & { open: boolean }> = ({
  children,
  open,
  ...props
}) => (
  <Button {...(props as any)}>
    {children}
    <ArrowIcon
      style={{ transform: `rotate(${open ? 180 : 0}deg)` }}
      height='1em'
    />
  </Button>
)

export default Dropbox
