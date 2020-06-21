import * as React from 'react'
import { Flex } from 'rebass'
import { useForm } from 'react-hook-form'
import { Head, navigate } from '@quercia/quercia'

import Layout from '../../components/repository/layout'
import Field from '../../components/settings/field'
import Button from '../../components/button'
import Center from '../../components/center'

import { Base, Issue } from '../../types/repository'

export interface IssuesProps {
  issues: Issue[]
}

interface Data {
  title: string
}

export default ({ repository, owns }: Base<IssuesProps>) => {
  const [isLoading, setLoading] = React.useState(false)
  const { register, errors, handleSubmit } = useForm()

  const onSubmit = (data: Data) => {
    setLoading(true)

    // instantiate the POST form data
    const body = new FormData()
    body.set('title', data.title)

    navigate(window.location.pathname, 'POST', {
      body,
      credentials: 'same-origin'
    })
  }

  return (
    <Layout owns={owns} repository={repository} page='Issues'>
      <Head>
        <title>
          {typeof repository === 'object'
            ? `${repository.owner}/${repository.name}`
            : ''}
          {' new issue'}- o2
        </title>
        <meta
          name='description'
          content='create a new issue on a repository on the o2 service'
        />
      </Head>
      <Flex as='form' flexDirection='column'>
        <Field
          errors={errors}
          disabled={isLoading}
          name='title'
          placeholder='Title'
          description=''
          ref={register({ required: 'Required' })}
        />
        <Button type='submit'>Create</Button>
      </Flex>
    </Layout>
  )
}
