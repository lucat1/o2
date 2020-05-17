import * as React from 'react'
import { Button } from 'rebass'
import { Input } from '@rebass/forms'
import { styled, css } from 'goober'
import { useForm } from 'react-hook-form'
import { navigate } from '@quercia/quercia'

import { Line, Center } from '../base'

import { User } from '../../types/data'

const Content = styled(Center)`
  padding: 2em 0;
  flex-direction: row;
`

const margin = css`
  margin: 0 1em;
`

const Form = styled('form', React.forwardRef)`
  width: auto;
  margin: 0;

  div:first-child {
    width: auto;
  }
`

interface Data {
  name: string
  description: string
}

const Organization: React.FunctionComponent<{ user: User }> = ({ user }) => {
  const { handleSubmit, register, errors } = useForm<Data>()

  const ref = React.useRef<HTMLFormElement>()
  const onSubmit = React.useCallback((data: Data) => {
    // instantiate the POST form data
    const body = new FormData()
    body.set('kind', 'organization')
    body.set('owner', user.username)
    body.set('name', data.name)

    navigate(`/new`, 'POST', {
      body,
      credentials: 'same-origin'
    })
  }, [])

  return (
    <>
      <Content>
        <Form ref={ref} onSubmit={handleSubmit(onSubmit)}>
          <Input
            className={margin}
            name='name'
            label='Organization name'
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

export default Organization
