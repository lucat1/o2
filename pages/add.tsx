import * as React from 'react'
import { useForm } from 'react-hook-form'
import { Head, navigate } from '@quercia/quercia'

import Form from '../components/form'
import Input from '../components/input'
import Button from '../components/button'

import { User } from '../types/data'

interface AddProps {
  error?: string
  account?: User
}

interface Data {
  name: string
}

export default ({ error, account }: AddProps) => {
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
    body.set('name', data.name)

    navigate('/add', 'POST', { body, credentials: 'same-origin' })
  }

  return (
    <>
      <Head>
        <title>add - o2</title>
        <meta name='description' content='create a new repositroy in o2' />
      </Head>
      <Form onSubmit={handleSubmit(onSubmit)}>
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

        <Button disabled={isLoading} type='submit'>
          Create
        </Button>
      </Form>
    </>
  )
}
