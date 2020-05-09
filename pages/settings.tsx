import * as React from 'react'
import { Head } from '@quercia/quercia'
import { styled } from 'goober'

import Layout from '../components/repository/layout'
import { Left, Right, Parent } from '../components/split'
import { Repository } from '../types/data'

export interface SettingsProps {
  repository: Repository
}

export default ({ repository }: SettingsProps) => {
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
        <Parent>
          <Left>leftbar</Left>
          <Right>right hand side</Right>
        </Parent>
      </Layout>
    </>
  )
}

/*   const {
    handleSubmit,
    register,
    errors,
    formState: { dirty }
  } = useForm()
  
  <form onSubmit={handleSubmit(onSubmit)}>
        <Input
          name='name'
          label='Name'
          defaultValue={repository?.name}
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
*/
