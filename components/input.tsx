import * as React from 'react'
import { Input as RebassInput, InputProps } from '@rebass/forms'
import { keyframes } from '@emotion/css'
import merge from '../types/xtend'

const animation = keyframes({
  '100': {
    background: 'transparent',
    color: 'inherit'
  }
})

const Label: React.FC<InputProps> = props => (
  <RebassInput
    {...(props as any)}
    sx={merge(
      {
        'borderRadius': 'md',
        'outline': 'none',
        'transition': 'box-shadow 200ms ease-in-out',
        'borderColor': 'bg.3',
        'fontSize': 'sm',
        'fontFamily': 'default',
        'px': 4,
        'py': 2,

        ':focus': {
          borderColor: 'primary.light',
          boxShadow: 'focus'
        },

        ':-webkit-autofill': {
          animation: `${animation} 0s forwards`
        }
      },
      props.sx
    )}
  />
)

export default Label
