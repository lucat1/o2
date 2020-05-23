import * as React from 'react'
import { Flex, FlexProps } from 'rebass'
import merge from '../types/xtend'

export const Parent: React.FC<FlexProps> = props => (
  <Flex
    {...(props as any)}
    css={merge(
      {
        flex: 1,
        flexWrap: 'wrap',
        overflow: 'hidden'
      },
      props.css
    )}
  />
)

export const Left: React.FC<FlexProps> = props => (
  <Flex
    {...(props as any)}
    sx={merge(
      {
        flexBasis: 9,
        flexGrow: 1
      },
      props.sx
    )}
  />
)

export const Right: React.FC<FlexProps> = props => (
  <Flex
    {...(props as any)}
    css={merge(
      {
        flexBasis: 0,
        flexGrow: 999,
        minWidth: '60%'
      },
      props.css
    )}
  />
)
