import * as React from 'react'
import { Head, SSG } from '@quercia/quercia'

import { Repository, Tree as ITree, User } from '../types/data'

import Layout from '../components/repository/layout'
import Tree from '../components/repository/tree'
import Path from '../components/repository/path'

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
            ? `${repository.name}/${tree.path}`
            : 'tree'}{' '}
          - o2
        </title>
        <meta
          name='description'
          content='the tree of a git repository on the o2 service'
        />
      </Head>
      <Layout repository={repository} page='Tree'>
        <Path repository={repository} entry={tree} />
        {tree && !SSG && <Tree repository={repository} tree={tree} />}
      </Layout>
    </>
  )
}
