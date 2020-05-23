import * as React from 'react'
import { variant } from 'styled-system'
import { Button as RebassButton, ButtonProps } from 'rebass'
import merge from '../types/xtend'

const PrimaryButton: React.FC<ButtonProps> = props => (
  <RebassButton
    {...(props as any)}
    css={merge(
      {
        'outline': 'none',
        'display': 'flex',
        'alignItems': 'center',
        'justifyContent': 'center',
        'whiteSpace': 'nowrap',
        'transition': 'box-shadow 200ms ease-in-out',
        'cursor': 'pointer',
        'a, a:hover': {
          textDecoration: 'none'
        }
      },
      props.css
    )}
    sx={merge(
      {
        'bg': 'primary.default',
        'color': 'bg.5',
        'border': '1px solid',
        'borderColor': 'primary.default',
        'borderRadius': 'md',
        'fontFamily': 'default',
        'fontSize': 'xs',
        'px': 4,
        'py': 2,
        'minWidth': '8em',

        ':focus': {
          boxShadow: 'focus'
        }
      },
      props.sx
    )}
  />
)

const Button: React.FC<ButtonProps> = props => {
  const sx = variant({
    variants: {
      'sm': {
        minWidth: '1.25rem',
        py: 1
      },

      'md': {
        minWidth: '5.5rem'
      },

      'secondary': {
        borderColor: 'bg.3',
        color: 'fg.5',
        bg: 'transparent'
      },

      'md-secondary': {
        borderColor: 'bg.3',
        color: 'fg.5',
        bg: 'transparent',
        minWidth: '5.5rem'
      }
    }
  })(props)

  return (
    <PrimaryButton
      {...(props as any)}
      variant={props.variant || 'primary'}
      sx={merge(sx, props.sx)}
    />
  )
}

export default Button
