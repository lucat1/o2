import * as React from 'react'
import { Flex, FlexProps } from 'rebass'

const Base = (props: FlexProps) => (
  <Flex
    {...(props as any)}
    sx={{
      borderRadius: 'sm',
      border: '1px solid',
      borderColor: 'bg.3',
      my: 4
    }}
  />
)

export default Base
