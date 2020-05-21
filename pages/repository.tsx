import * as React from 'react'
import { Flex, Box } from 'rebass'
import snarkdown from 'snarkdown'
import { Head, SSG } from '@quercia/quercia'

import Base from '../components/base'
import Text from '../components/text'

import Layout from '../components/repository/layout'
import Branch from '../components/repository/branch'
import Tree from '../components/repository/tree'

import Empty from '../components/repository/empty'
import { Ref, Repository, Tree as ITree, User } from '../types/data'

export interface RepositoryProps {
  account: User
  repository: Repository
  owns: boolean
  readme: string
  tree: ITree
  refs: Ref[]
}

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
          <Text css={{ flexShrink: 10 }} width={8} height={4} as='code'>
            {repository?.description}
          </Text>

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
