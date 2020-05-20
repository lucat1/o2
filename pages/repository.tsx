import * as React from 'react'
import { Flex, Box } from 'rebass'
import snarkdown from 'snarkdown'
import { Head, SSG } from '@quercia/quercia'

import Base from '../components/base'
import Skeleton from '../components/skeleton'

import Branch from '../components/repository/branch'
import Empty from '../components/repository/empty'
import Layout from '../components/repository/layout'
import Tree from '../components/repository/tree'
import { Ref, Repository, Tree as ITree, User } from '../types/data'

export interface RepositoryProps {
  account: User
  repository: Repository
  owns: boolean
  readme: string
  tree: ITree
  refs: Ref[]
}

// const Container = styled(C)`
//   padding: 1.5em;
//   overflow: auto;
// `

// const Description = styled('div')`
//   display: flex;
//   justify-content: space-between;
//   text-overflow: ellipsis;
// `

export default ({
  repository,
  owns,
  tree,
  account,
  readme,
  refs
}: RepositoryProps) => {
  if (!refs) {
    refs = []
  }

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
      <Layout owns={owns} repository={repository} page='Overview'>
        <Flex
          css={{
            justifyContent: 'space-between',
            alignItems: 'center',
            textOverflow: 'ellipsis'
          }}
        >
          {SSG ? (
            <Skeleton width='70%' height='1.5em' />
          ) : (
            <code>{repository.description}</code>
          )}
          <Branch
            repository={repository}
            current={tree?.branch.name}
            refs={refs}
            disabled={refs.length === 0}
          />
        </Flex>
        {!tree && !SSG && <Empty repository={repository} owns={owns} />}
        {(tree || SSG) && <Tree repository={repository} tree={tree} />}
        {readme && (
          <Base
            p={5}
            as={Box}
            overflow='auto'
            dangerouslySetInnerHTML={{ __html: snarkdown(readme) }}
          />
        )}
      </Layout>
    </>
  )
}
