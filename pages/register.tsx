import * as React from 'react'
import { useForm } from 'react-hook-form'

import { Head, navigate } from '@quercia/quercia'

import Button from '../components/button'
import Form from '../components/form'
import Input from '../components/input'

interface Data {
  email: string
  username: string
  password: string
}

interface RegisterProps {
  error: string
}

export default ({ error }: RegisterProps) => {
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
    body.set('email', data.email)
    body.set('username', data.username)
    body.set('password', data.password)

    navigate('/register', 'POST', { body, credentials: 'same-origin' })
  }

  return (
    <>
      <Head>
        <title>register - o2</title>
      </Head>
      <Form onSubmit={handleSubmit(onSubmit)}>
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

        <Button disabled={isLoading} type='submit'>
          Submit
        </Button>
      </Form>
    </>
  )
}
