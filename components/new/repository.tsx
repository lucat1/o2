import * as React from 'react'
import { styled, css } from 'goober'
import { useForm } from 'react-hook-form'
import { navigate } from '@quercia/quercia'

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

const Form = styled('form', React.forwardRef)`
  width: auto;
  margin: 0;

  div:first-child {
    width: auto;
  }
`

type Type = 'user' | 'org'
interface Option {
  type: Type
  value: string
  picture: string
}

interface Data {
  name: string
  description: string
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

  const { handleSubmit, register, errors } = useForm<Data>()

  const ref = React.useRef<HTMLFormElement>()
  const onSubmit = React.useCallback(
    (data: Data) => {
      // instantiate the POST form data
      const body = new FormData()
      body.set('kind', 'repository')
      body.set('owner', options[selected].value)
      body.set('name', data.name)

      navigate(`/new`, 'POST', {
        body,
        credentials: 'same-origin'
      })
    },
    [selected]
  )

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
                <Item key={i} onClick={() => select(i)}>
                  <Image src={`${picture}?s=25`} />
                  {value}
                </Item>
              ))}
            </List>
          </Dropdown>
        </Container>
        /
        <Form ref={ref} onSubmit={handleSubmit(onSubmit)}>
          <Input
            className={margin}
            name='name'
            label='Name'
            error={errors.name?.message.toString()}
            ref={register({
              required: 'Required',
              pattern: {
                value: /^[a-z0-9_-]{1,256}$/,
                message: 'invalid repository name'
              }
            })}
          />
        </Form>
      </Content>
      <Line />
      <Button
        onClick={() =>
          ref.current.dispatchEvent(new Event('submit', { cancelable: true }))
        }
        disabled={false}
      >
        Create
      </Button>
    </>
  )
}

export default Repository
