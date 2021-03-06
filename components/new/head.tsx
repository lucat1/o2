import * as React from 'react'
import { Flex } from 'rebass'

import Heading from '../heading'
import Dropdown from '../dropdown'
import Relative from '../relative'
import Dropbox from '../dropbox'
import { Item, List } from '../list'

interface HeadProps {
  selected: number
  setSelected(i: number): void
  types: string[]
}

const Head: React.FC<HeadProps> = ({ selected, setSelected, types }) => {
  const [open, setOpen] = React.useState(false)
  const select = React.useCallback((i: number) => {
    setOpen(false)
    setSelected(i)
  }, [])

  return (
    <Flex p={2} alignItems='center'>
      <Heading m={0} known>
        create a new
      </Heading>
      <Relative mx={2}>
        <Dropbox variant='secondary' open={open} onClick={() => setOpen(true)}>
          {types[selected]}
        </Dropbox>
        <Dropdown open={open} onClose={() => setOpen(false)}>
          <List>
            {types.map((type, i) => (
              <Item selected={selected == i} key={i} onClick={() => select(i)}>
                {type}
              </Item>
            ))}
          </List>
        </Dropdown>
      </Relative>
    </Flex>
  )
}

export default Head
