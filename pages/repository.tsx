import { styled } from 'goober'
import * as React from 'react'
import snarkdown from 'snarkdown'

import { Head, SSG } from '@quercia/quercia'

import Branch from '../components/repository/branch'
import C from '../components/base'
import Empty from '../components/repository/empty'
import Layout from '../components/repository/layout'
import Tree from '../components/repository/tree'
import Skeleton from '../components/skeleton'
import { Ref, Repository, Tree as ITree, User } from '../types/data'

export interface RepositoryProps {
  account: User
  repository: Repository
  tree: ITree
  refs: Ref[]
  readme: string
}

const Container = styled(C)`
  padding: 1.5em;
  overflow: auto;
`

const Description = styled('div')`
  display: flex;
  justify-content: space-between;
  text-overflow: ellipsis;
`

export default ({
  repository,
  tree,
  account,
  readme,
  refs
}: RepositoryProps) => {
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
        {SSG ? (
          <Skeleton width='100%' height='2em' />
        ) : (
          <Description>
            <code>{repository.description}</code>
            <Branch repository={repository} current='master' refs={refs} />
          </Description>
        )}
        {!tree && !SSG && <Empty repository={repository} account={account} />}
        {(tree || SSG) && <Tree repository={repository} tree={tree} />}
        {readme && (
          <Container dangerouslySetInnerHTML={{ __html: snarkdown(readme) }} />
        )}
      </Layout>
    </>
  )
}
