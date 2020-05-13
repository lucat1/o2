import * as React from 'react'
import { styled, css } from 'goober'
import { useForm } from 'react-hook-form'

import { Head, navigate } from '@quercia/quercia'

import B, { Center as C } from '../components/base'
import Button from '../components/button'
import Input from '../components/input'
import { H4 as H } from '../components/typography'

import { User } from '../types/data'
import Dropbox from '../components/dropbox'
import DD, { Container as DC } from '../components/dropdown'
import { Item, List } from '../components/list'

interface AddProps {
  error?: string
  account?: User
}

interface Data {
  name: string
}

const Center = styled(C)`
  height: calc(100vh - 3.5rem);
`

const Base = styled(B)`
  padding: 2em;
  width: 50%;

  @media (max-width: 960px) {
    padding: 2em 1em;
    width: 90%;
  }
`

const Container = styled(DC)`
  display: inline;
  margin: 0 1em;
`

const Dropdown = styled(DD)`
  right: 0;
`

const ButtonContainer = styled('div')`
  width: 100%;
  display: flex;
  justify-content: flex-end;

  button {
    margin: 0;
  }
`

const types = ['Repository', 'Organization']

export default ({ error, account }: AddProps) => {
  const [open, setOpen] = React.useState(false)
  const [selected, setSelected] = React.useState(0)
  const [isLoading, setLoading] = React.useState(typeof error == 'string')
  const { handleSubmit, register, errors } = useForm<Data>()

  React.useEffect(() => {
    if (error) {
      setLoading(false)
    }
  }, [error])

  const onSubmit = (data: Data) => {
    setLoading(true)

    // instantiate the POST form data
    const body = new FormData()
    body.set('kind', types[selected].toLowerCase())
    body.set('name', data.name)

    navigate('/new', 'POST', { body, credentials: 'same-origin' })
  }

  const select = React.useCallback((i: number) => {
    setOpen(false)
    setSelected(i)
  }, [])

  return (
    <>
      <Head>
        <title>add - o2</title>
        <meta name='description' content='create a new repositroy in o2' />
      </Head>
      <Center>
        <Base>
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
          <form onSubmit={handleSubmit(onSubmit)}>
            {error && <h1 style={{ color: 'red' }}>{error}</h1>}

            <Input
              name='name'
              label='Name'
              inline={(account?.username || '\u00A0'.repeat(5)) + '/'}
              disabled={isLoading}
              error={errors.name?.message.toString()}
              ref={register({
                required: 'Required'
              })}
            />

            <ButtonContainer>
              <Button disabled={isLoading} type='submit'>
                Create
              </Button>
            </ButtonContainer>
          </form>
        </Base>
      </Center>
    </>
  )
}
