import * as React from 'react'
import { Head } from '@quercia/quercia'

import Layout from '../../components/repository/layout'

import { Base, Issue } from '../../types/repository'
import Heading from '../../components/heading'

export interface IssuesProps {
  issues: Issue[]
}

export default ({ repository, owns }: Base<IssuesProps>) => {
  return (
    <Layout owns={owns} repository={repository} page='Issues'>
      <Head>
        <title>
          {typeof repository === 'object'
            ? `${repository.owner}/${repository.name}`
            : ''}
          {' issues'}- o2
        </title>
        <meta
          name='description'
          content='the issues of a git repository on the o2 service'
        />
      </Head>
      <Heading>Issues page</Heading>
    </Layout>
  )
}
