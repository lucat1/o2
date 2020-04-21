import * as React from 'react'
import { Head, usePrerender } from '@quercia/quercia'

import { Repository, Tree as ITree, User } from '../types/data'
import Skeleton from '../components/skeleton'

import Layout from '../components/repository/layout'
import Empty from '../components/repository/empty'
import Tree from '../components/repository/tree'

export interface RepositoryProps {
  account: User
  repository: Repository
  tree: ITree
}

export default ({ repository, tree, account }: RepositoryProps) => {
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
        {!tree && !usePrerender() && (
          <Empty repository={repository} account={account} />
        )}
        {tree && !usePrerender() && <Tree tree={tree} />}
      </Layout>
    </>
  )
}
