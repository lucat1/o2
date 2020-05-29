import * as React from 'react'
import { Flex, FlexProps } from 'rebass'
import merge from '../types/xtend'

const Body: React.FC<FlexProps> = props => (
  <Flex
    {...(props as any)}
    as='main'
    sx={merge(
      {
        m: 'auto',
        px: 4,
        width: ['100%', 'calc(60rem + 0.5w)', 'calc(60rem + 6vw)']
      },
      props.sx
    )}
  />
)

export default Body
