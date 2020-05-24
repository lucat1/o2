import * as React from 'react'
import merge from '../../types/xtend'

import { TextProps } from '../text'
import Pre from './pre'

const Gutter: React.FC<TextProps> = props => (
  <Pre
    {...(props as any)}
    sx={merge(
      {
        px: 3,
        textAlign: 'end',
        pointerEvents: 'none',
        userSelect: 'none',
        borderRight: '1px solid',
        borderColor: 'bg.3',
        flexShrink: 0
      },
      props.sx
    )}
  />
)

export default Gutter
