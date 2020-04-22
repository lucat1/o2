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
            ? `${repository.name}@${tree.path}`
            : 'tree'}{' '}
          - o2
        </title>
        <meta
          name='description'
          content='the tree of a git repository on the o2 service'
        />
      </Head>
      <Layout repository={repository} page='Tree'>
        {tree && !usePrerender() && (
          <Tree repository={repository} tree={tree} />
        )}
      </Layout>
    </>
  )
}
