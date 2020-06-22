import * as React from 'react'
import { Head } from '@quercia/quercia'
import { Box } from 'rebass'

import Layout from '../../components/repository/layout'

import { Base, Issue } from '../../types/repository'
import Heading from '../../components/heading'

export interface IssuesProps {
  issue: Issue
}

export default ({ repository, owns, issue }: Base<IssuesProps>) => {
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

      <Box>{issue?.title}</Box>
      <Box>{issue?.id}</Box>
    </Layout>
  )
}
