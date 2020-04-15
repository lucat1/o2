import * as React from 'react'
import { useForm } from 'react-hook-form'
import { Head, navigate } from '@quercia/quercia'

import Form from '../components/form'
import Input from '../components/input'
import Button from '../components/button'

interface AddProps {
  error?: string
}

interface Data {
  name: string
}

export default ({ error }: AddProps) => {
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
        <Input
          name='name'
          label='Name'
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
