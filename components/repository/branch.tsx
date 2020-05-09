import * as React from 'react'
import { styled } from 'goober'

import Button from '../button'
import _Dropdown from '../dropdown'
import _Arrow from '../svgs/arrow'
import { List, Item } from '../list'

const Arrow = styled(_Arrow)`
  margin-left: 0.5em;
`

const Dropbox = styled(Button)`
  margin: 0 0.25em;
  color: var(--fg-5);

  height: 2.35em;
`

const Dropdown = styled(_Dropdown)`
  font-size: 0.75em;
  position: absolute;
  margin-top: 0.75em;

  max-height: 15em;
  overflow: auto;

  @media (min-width: 960px) {
    min-width: 10em;
  }
`

const HideOnSmall = styled('span')`
  @media (max-width: 500px) {
    display: none;
  }
`

const Branch: React.FunctionComponent<{
  current: string
  branches: string[]
}> = ({ current, branches }) => {
  const [open, setOpen] = React.useState(false)

  return (
    <div>
      <Dropbox small secondary onClick={() => setOpen(true)}>
        Branch
        <HideOnSmall>
          : <strong>{current}</strong>
        </HideOnSmall>
        <Arrow height='1em' />
      </Dropbox>
      <Dropdown open={open} onClose={() => setOpen(false)}>
        <List>
          {branches.map(branch => (
            <Item selected={branch == current}>{branch}</Item>
          ))}
        </List>
      </Dropdown>
    </div>
  )
}

export default Branch
