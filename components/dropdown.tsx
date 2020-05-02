import * as React from 'react'
import useOnClickOutside from 'use-onclickoutside'
import { styled } from 'goober'

const Menu = styled('div', React.forwardRef)`
  position: absolute;
  top: 3em;
  margin-left: -5.5em;

  font-size: 0.75em;
  width: calc(8em - 2px);

  border: 1px solid var(--bg-3);
  border-radius: 0.25em;
  background: var(--bg-5);

  a {
    display: block;
    margin: 0.75em 0.5em;
  }
`

const Dropdown: React.FunctionComponent<React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
> & { open: boolean; onClose: () => void }> = ({ open, onClose, children }) => {
  const ref = React.useRef()
  useOnClickOutside(ref, onClose)

  return (
    <Menu style={{ display: open ? 'block' : 'none' }} ref={ref}>
      {children}
    </Menu>
  )
}

export default Dropdown
