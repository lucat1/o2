import * as React from 'react'

import Relative from '../relative'

import { Content } from './layout'
import Dropdown from '../dropdown'
import Dropbox from '../dropbox'
import { Item, List } from '../list'

interface HeadProps {
  selected: number
  setSelected(i: number): void
  types: string[]
}

const Head: React.FunctionComponent<HeadProps> = ({
  selected,
  setSelected,
  types
}) => {
  const [open, setOpen] = React.useState(false)
  const select = React.useCallback((i: number) => {
    setOpen(false)
    setSelected(i)
  }, [])

  return (
    <Content>
      <a>
        <strong>Create a new</strong>
      </a>
      <Relative display='inline' mx='1rem'>
        <Dropbox open={open} onClick={() => setOpen(true)}>
          {types[selected]}
        </Dropbox>
        <Dropdown open={open} onClose={() => setOpen(false)}>
          <List>
            {types.map((type, i) => (
              <Item onClick={() => select(i)}>{type}</Item>
            ))}
          </List>
        </Dropdown>
      </Relative>
    </Content>
  )
}

export default Head
