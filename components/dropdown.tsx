import { styled } from 'goober'
import * as React from 'react'
import useOnClickOutside from 'use-onclickoutside'

const Base = styled('div', React.forwardRef)`
  border: 1px solid var(--bg-3);
  border-radius: 0.5em;
  background: var(--bg-5);
  box-shadow: 0px 3px 5px rgba(0, 0, 0, 0.04);
  padding: 0.25em 0;
`

const Dropdown: React.FunctionComponent<React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
> & { open: boolean; onClose: () => void }> = ({ open, onClose, ...props }) => {
  const ref = React.useRef()
  useOnClickOutside(ref, onClose)

  return (
    <Base style={{ display: open ? 'block' : 'none' }} ref={ref} {...props} />
  )
}

export default Dropdown
