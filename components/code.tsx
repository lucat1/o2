import * as React from 'react'
import merge from '../types/xtend'

import Text, { TextProps } from './text'

const Code: React.FC<TextProps> = props => {
  return (
    <Text
      {...(props as any)}
      as='code'
      sx={merge({ p: 2, my: 3, borderRadius: 'md', bg: 'bg.3' }, props.sx)}
      css={merge(
        {
          width: '100%',
          overflow: 'auto'
        },
        props.css
      )}
    />
  )
}

export default Code
