import * as React from 'react'
import { styled } from 'goober'

import { Content } from './layout'
import Dropdown, { Container as DC } from '../dropdown'
import Dropbox from '../dropbox'
import { Item, List } from '../list'

const Container = styled(DC)`
  display: inline;
  margin: 0 1em;
`

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
      <Container>
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
      </Container>
    </Content>
  )
}

export default Head
