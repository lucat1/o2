import * as React from 'react'
import { Button, ButtonProps } from 'rebass'
import { styled } from 'goober'

import A from './svgs/arrow'

export const Arrow = styled(A)`
  margin-left: 0.5em;
  transition: transform 200ms ease-in-out;
`

//height: 2.35em;

type DropboxProps = ButtonProps & {
  open: boolean
  big?: boolean
}

const Dropbox: React.FunctionComponent<DropboxProps> = ({
  children,
  open,
  onClick,
  big,
  ...props
}) => (
  <Button
    variant={big ? 'secondary' : 'md-secondary'}
    onClick={onClick}
    {...props}
  >
    {children}
    <Arrow style={{ transform: `rotate(${open ? 180 : 0}deg)` }} height='1em' />
  </Button>
)

export default Dropbox
