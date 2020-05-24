import * as React from 'react'
import { Flex, ButtonProps } from 'rebass'

import Button from '../button'

const Btn: React.FC<ButtonProps> = props => (
  <Flex flex={1} justifyContent='flex-end' p={2}>
    <Button {...(props as any)} type='submit'>
      Create
    </Button>
  </Flex>
)

export default Btn
