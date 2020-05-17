import * as React from 'react'
import { Button } from 'rebass'

import Relative from '../relative'
import Arrow from '../svgs/arrow'

import { Content } from './layout'
import Dropdown from '../dropdown'
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
      <Relative display='inline-block' mx='1rem'>
        <Button variant='secondary' onClick={() => setOpen(true)}>
          {types[selected]}
          <Arrow
            style={{ transform: `rotate(${open ? 180 : 0}deg)` }}
            height='1em'
          />
        </Button>
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
