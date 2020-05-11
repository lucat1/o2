import * as React from 'react'
import { styled } from 'goober'

import Button from './button'
import A from './svgs/arrow'

export const Arrow = styled(A)`
  margin-left: 0.5em;
  transition: transform 200ms ease-in-out;
`

const Container = styled(Button)`
  margin: 0 0.25em;
  color: var(--fg-5);

  height: 2.35em;
`

type DropboxProps = React.ClassAttributes<HTMLButtonElement> &
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    open: boolean
  }

const Dropbox: React.FunctionComponent<DropboxProps> = ({
  children,
  open,
  onClick,
  ...props
}) => (
  <Container small secondary onClick={onClick} {...props}>
    {children}
    <Arrow style={{ transform: `rotate(${open ? 180 : 0}deg)` }} height='1em' />
  </Container>
)

export default Dropbox
