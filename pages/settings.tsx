import * as React from 'react'
import { Head, navigate } from '@quercia/quercia'
import { useForm } from 'react-hook-form'

import Layout from '../components/repository/layout'
import Input from '../components/input'
import Button from '../components/button'

export default ({ repository }) => {
  const {
    handleSubmit,
    register,
    errors,
    formState: { dirty }
  } = useForm()
  const [loading, setLoading] = React.useState(false)

  const onSubmit = (data: { name: string }) => {
    setLoading(true)

    // instantiate the POST form data
    const body = new FormData()
    body.set('name', data.name)

    navigate(window.location.pathname, 'POST', {
      body,
      credentials: 'same-origin'
    })
  }

  return (
    <>
      <Head>
        <title>
          {typeof repository === 'object'
            ? `${repository.owner}/${repository.name}`
            : 'unkown'}{' '}
          settings - o2
        </title>
        <meta
          name='description'
          content='the settings of a git repository on the o2 service'
        />
      </Head>
      <Layout repository={repository} page='Settings'>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Input
            name='name'
            label='Name'
            disabled={loading}
            error={errors.name?.message.toString()}
            ref={register({
              required: 'Required'
            })}
          />

          <Button type='submit' disabled={!dirty || loading}>
            Save
          </Button>
        </form>
      </Layout>
    </>
  )
}
