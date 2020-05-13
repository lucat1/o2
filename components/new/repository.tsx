import * as React from 'react'
import { styled, css } from 'goober'

import Button from './button'
import Input from '../input'
import I from '../image'
import { Line, Center } from '../base'
import Dropdown, { Container as DC } from '../dropdown'
import Dropbox from '../dropbox'
import { Item, List } from '../list'

import { User } from '../../types/data'

const Content = styled(Center)`
  padding: 2em 0;
  flex-direction: row;
`

const Container = styled(DC)`
  display: inline;
  margin: 0 1em;
`

const margin = css`
  margin: 0 1em;
`

const Image = styled(I)`
  width: 1.25em;
  height: 1.25em;
  margin-right: 0.5em;
`

type Type = 'user' | 'org'
interface Option {
  type: Type
  value: string
  picture: string
}

const Repository: React.FunctionComponent<{ user: User }> = ({ user }) => {
  const options: Option[] = React.useMemo(
    () => [
      { type: 'user', value: user?.username, picture: user?.picture },
      ...(user?.organizations || []).map(({ name, picture }) => ({
        type: 'org' as Type,
        value: name,
        picture
      }))
    ],
    [user]
  )

  const [open, setOpen] = React.useState(false)
  const [selected, setSelected] = React.useState(0)
  const select = React.useCallback((i: number) => {
    setOpen(false)
    setSelected(i)
  }, [])

  return (
    <>
      <Content>
        <Container>
          <Dropbox
            big
            className={margin}
            open={open}
            onClick={() => setOpen(true)}
          >
            <Image src={`${options[selected].picture}?s=25`} />
            {options[selected].value || 'user'}
          </Dropbox>
          <Dropdown open={open} onClose={() => setOpen(false)}>
            <List>
              {options.map(({ value, picture }, i) => (
                <Item onClick={() => select(i)}>
                  <Image src={`${picture}?s=25`} />
                  {value}
                </Item>
              ))}
            </List>
          </Dropdown>
        </Container>
        /
        <Input className={margin} />
      </Content>
      <Line />
      <Button disabled={false}>Create</Button>
    </>
  )
}

export default Repository
