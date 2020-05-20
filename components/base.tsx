import * as React from 'react'
import { Box, BoxProps } from 'rebass'
import merge from 'deep-extend'

const Base = (props: BoxProps) => {
  return (
    <Box
      {...(props as any)}
      sx={merge(
        {
          display: 'flex',
          borderRadius: 'sm',
          border: '1px solid',
          borderColor: 'bg.3',
          my: 4
        },
        props.sx
      )}
    />
  )
}

export default Base
