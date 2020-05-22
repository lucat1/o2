import * as React from 'react'
import merge from 'deep-extend'

import Text, { TextProps } from './text'

const Heading: React.FC<TextProps> = props => {
  return (
    <Text
      {...(props as any)}
      as={props.as || 'h2'}
      sx={merge({ my: 1 }, props.sx)}
      height={props.height || 4}
    />
  )
}

export default Heading
