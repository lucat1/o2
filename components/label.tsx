import * as React from 'react'
import { Label as RebassLabel, LabelProps } from '@rebass/forms'
import { variant } from 'styled-system'
import merge from '../types/xtend'

const Label: React.FC<LabelProps> = props => {
  const sx = variant({
    variants: {
      error: {
        fontSize: 'sm',
        color: 'error'
      }
    }
  })(props)

  return (
    <RebassLabel
      {...(props as any)}
      sx={merge({ fontSize: 'xs', my: 2 }, sx, props.sx)}
    />
  )
}

export default Label
