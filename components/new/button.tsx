import * as React from 'react'
import { Button } from 'rebass'
import { styled } from 'goober'

import { Content } from './layout'

const ButtonContent = styled(Content)`
  width: 100%;
  display: flex;
  justify-content: flex-end;

  button {
    margin: 0;
  }
`

const Btn: React.FunctionComponent<React.ClassAttributes<HTMLButtonElement> &
  React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ disabled, ...props }) => (
  <ButtonContent>
    <Button disabled={disabled} type='submit' {...props}>
      Create
    </Button>
  </ButtonContent>
)

export default Btn
