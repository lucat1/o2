import * as React from 'react'
import { Flex, FlexProps } from 'rebass'

const Base = (props: FlexProps) => (
  <Flex
    {...(props as any)}
    sx={Object.assign(
      {
        borderRadius: 'sm',
        border: '1px solid',
        borderColor: 'bg.3',
        my: 4
      },
      props.sx
    )}
  />
)

export default Base
