import * as React from 'react'
import { styled } from 'goober'

import { Content } from './layout'
import Button from '../button'

const ButtonContent = styled(Content)`
  width: 100%;
  display: flex;
  justify-content: flex-end;

  button {
    margin: 0;
  }
`

const Btn: React.FunctionComponent<React.ClassAttributes<HTMLButtonElement> &
  React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ disabled }) => (
  <ButtonContent>
    <Button disabled={disabled} type='submit'>
      Create
    </Button>
  </ButtonContent>
)

export default Btn
