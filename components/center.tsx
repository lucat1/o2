import * as React from 'react'
import { Flex, FlexProps } from 'rebass'
import merge from 'deep-extend'

const Center: React.FC<FlexProps> = props => (
  <Flex
    {...(props as any)}
    css={merge(
      {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
      },
      props.css
    )}
  />
)

export default Center
