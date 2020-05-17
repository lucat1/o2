import styled from '@emotion/styled'
import * as React from 'react'
import { Box, BoxProps } from 'rebass'
import useOnClickOutside from 'use-onclickoutside'

const Base = styled(Box)`
  position: absolute;
  right: 0;
  z-index: 100;
  max-height: 15em;
  min-width: 10em;
  overflow: auto;
`

const Dropdown: React.FunctionComponent<BoxProps & {
  open: boolean
  onClose: () => void
}> = ({ open, onClose, ...props }) => {
  const ref = React.useRef()
  useOnClickOutside(ref, onClose)

  return (
    <Base
      ref={ref as any}
      {...(props as any)}
      sx={Object.assign(
        {
          marginTop: 2,
          py: 3,
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
