import * as React from 'react'
import { useForm } from 'react-hook-form'
import { Head, navigate } from '@quercia/quercia'
import styled from '@emotion/styled'

const Container = styled.form`
  height: calc(100vh - 3.5rem);
  width: 100vw;
  margin: 0;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

import Input from '../components/input'

interface Data {
  email: string
  username: string
  password: string
}

interface RegisterProps {
  error: string
}

export default ({ error }: RegisterProps, ref) => {
  const [isLoading, setLoading] = React.useState(typeof error == 'string')
  const { handleSubmit, register, errors } = useForm<Data>()

  React.useEffect(() => {
    if (error) {
      setLoading(false)
    }
  }, [error])

  const onSubmit = async (data: Data) => {
    setLoading(true)

    // instantiate the POST form data
    const body = new FormData()
    body.set('email', data.email)
    body.set('username', data.username)
    body.set('password', data.password)

    navigate('/register', 'POST', { body, credentials: 'same-origin' })
  }

  return (
    <>
      <Head>
        <title>register - auth.o2</title>
      </Head>
      <Container onSubmit={handleSubmit(onSubmit)}>
        {error && <h1 style={{ color: 'red' }}>{error}</h1>}

        <Input
          name='email'
          label='Email'
          disabled={isLoading}
          error={errors.email?.message.toString()}
          ref={register({
            required: 'Required',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
              message: 'invalid email address'
            }
          })}
        />

        <Input
          name='username'
          label='Username'
          disabled={isLoading}
          error={errors.username?.message.toString()}
          ref={register({
            required: 'Required',
            pattern: {
              value: /^[a-z0-9_-]{3,15}$/,
              message: 'invalid username'
            }
          })}
        />

        <Input
          name='password'
          label='Password'
          type='password'
          disabled={isLoading}
          error={errors.password?.message.toString()}
          ref={register({
            required: 'Required',
            pattern: {
              value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
              message:
                'invalid password. Must contain at least 8 characters, at least 1 numeric and 1 letter'
            }
          })}
        />

        <button disabled={isLoading} type='submit'>
          Submit
        </button>
      </Container>
    </>
  )
}
