import * as React from 'react'
import { Box, BoxProps } from 'rebass'
import merge from '../types/xtend'
import useOnClickOutside from 'use-onclickoutside'

const Dropdown: React.FunctionComponent<BoxProps & {
  open: boolean
  onClose: () => void
}> = ({ open, onClose, ...props }) => {
  const ref = React.useRef()
  useOnClickOutside(ref, onClose)

  return (
    <Box
      ref={ref as any}
      {...(props as any)}
      css={merge(
        {
          position: 'absolute',
          right: 0,
          zIndex: 100,
          overflow: 'auto'
        },
        props.css
      )}
      sx={merge(
        {
          marginTop: 2,
          py: 3,
          maxHeight: 8,
          minWidth: 8,
          border: '1px solid',
          borderColor: 'bg.3',
          bg: 'bg.5',
          borderRadius: 'md',
          fontSize: 'sm',
          display: open ? 'block' : 'none',
          boxShadow: 'sm'
        },
        props.sx || {}
      )}
    />
  )
}

export default Dropdown
