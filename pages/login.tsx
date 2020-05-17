import * as React from 'react'
import { useForm } from 'react-hook-form'
import { Box, Flex, Button } from 'rebass'
import { Input, Label } from '@rebass/forms'

import { Head, navigate } from '@quercia/quercia'

interface Data {
  email: string
  username: string
  password: string
}

interface LoginProps {
  error: string
}

export default ({ error }: LoginProps) => {
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
    body.set('password', data.password)

    navigate(`/login${window.location.search}`, 'POST', {
      body,
      credentials: 'same-origin'
    })
  }

  return (
    <>
      <Head>
        <title>login - o2</title>
      </Head>
      <Flex
        as='form'
        flexDirection='column'
        justifyContent='center'
        alignItems='center'
        flex={1}
        onSubmit={handleSubmit(onSubmit)}
      >
        {error && <h1 style={{ color: 'red' }}>{error}</h1>}

        <Box py={4} width={8}>
          <Input
            name='email'
            placeholder='Email'
            disabled={isLoading}
            ref={register({
              required: 'Required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                message: 'invalid email address'
              }
            })}
          />
          {errors.email && (
            <Label htmlFor='email' variant='error'>
              {errors.email?.message.toString()}
            </Label>
          )}
        </Box>

        <Box py={4} width={8}>
          <Input
            name='password'
            placeholder='Password'
            type='password'
            disabled={isLoading}
            ref={register({
              required: 'Required',
              pattern: {
                value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
                message:
                  'invalid password. Must contain at least 8 characters, at least 1 numeric and 1 letter'
              }
            })}
          />
          {errors.password && (
            <Label htmlFor='password' variant='error'>
              {errors.password?.message.toString()}
            </Label>
          )}
        </Box>

        <Button disabled={isLoading} type='submit'>
          Login
        </Button>
      </Flex>
    </>
  )
}
