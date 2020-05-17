import * as React from 'react'
import { Button, ButtonProps } from 'rebass'
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

const Btn: React.FC<ButtonProps> = ({ disabled, ...props }) => (
  <ButtonContent>
    <Button type='submit' disabled={disabled} {...(props as any)}>
      Create
    </Button>
  </ButtonContent>
)

export default Btn
