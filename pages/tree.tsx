import * as React from 'react'

import { Head, SSG } from '@quercia/quercia'

import Layout from '../components/repository/layout'
import Path from '../components/repository/path'
import Tree from '../components/repository/tree'

import { Base, RepositoryProps } from '../types/repository'

export default ({ repository, tree, owns }: Base<RepositoryProps>) => {
  return (
    <Layout owns={owns} repository={repository} page='Tree'>
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

      <Path repository={repository} entry={tree} />
      {(tree || SSG) && <Tree repository={repository} tree={tree} />}
    </Layout>
  )
}
