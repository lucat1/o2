import * as React from 'react'
import { Head } from '@quercia/quercia'

import Layout from '../../components/repository/layout'

import { Base, Issue } from '../../types/repository'
import Heading from '../../components/heading'

export interface IssuesProps {
  issue: Issue
}

export default ({ repository, owns }: Base<IssuesProps>) => {
  return (
    <Layout owns={owns} repository={repository} page='Issues'>
      <Head>
        <title>
          {typeof repository === 'object'
            ? `${repository.owner}/${repository.name}`
            : ''}
          {' issue'}- o2
        </title>
        <meta
          name='description'
          content='an issue on git repository on the o2 service'
        />
      </Head>
      <Heading>Issue page</Heading>
    </Layout>
  )
}
