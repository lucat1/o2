import * as React from 'react'
import styled from '@emotion/styled'
import { ButtonProps } from 'rebass'

import Arrow from './svgs/arrow'
import Button from './button'

export const ArrowIcon = styled(Arrow)`
  margin-left: 0.5em;
  transition: transform 200ms ease-in-out;
`

const Dropbox: React.FC<ButtonProps & { open: boolean }> = ({
  children,
  open,
  ...props
}) => (
  <Button {...(props as any)}>
    {children}
    <ArrowIcon
      css={{ marginLeft: '.5rem' }}
      style={{ transform: `rotate(${open ? 180 : 0}deg)` }}
      height='1em'
    />
  </Button>
)

export default Dropbox
