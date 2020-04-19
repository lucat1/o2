import * as React from 'react'
import { Head, usePrerender } from '@quercia/quercia'

import Layout from '../components/repository/layout'
import { Repository } from '../types/data'
import Skeleton from '../components/skeleton'

export interface RepositoryProps {
  repository: Repository
}

export default ({ repository }: RepositoryProps) => {
  return (
    <>
      <Head>
        <title>
          {typeof repository === 'object'
            ? `${repository.owner}/${repository.name}`
            : 'repository'}{' '}
          - o2
        </title>
        <meta name='description' content='a git repository on the o2 service' />
      </Head>
      <Layout repository={repository} page='Overview'>
        {usePrerender() ? (
          <Skeleton width='100%' height='5em' />
        ) : (
          <code>{repository.description}</code>
        )}
      </Layout>
    </>
  )
}
