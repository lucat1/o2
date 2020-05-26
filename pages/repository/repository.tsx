import * as React from 'react'
import { Flex } from 'rebass'
import { Head, SSG } from '@quercia/quercia'
import snarkdown from 'snarkdown'

import Container from '../../components/base'
import Text from '../../components/text'

import Layout from '../../components/repository/layout'
import Branch from '../../components/repository/branch'
import Tree from '../../components/repository/tree'

import Empty from '../../components/repository/empty'
import { Base, RepositoryProps } from '../../types/repository'

export default ({
  repository,
  owns,
  tree,
  readme,
  refs
}: Base<RepositoryProps>) => {
  if (!refs) {
    refs = []
  }

  return (
    <Layout owns={owns} repository={repository} page='Overview'>
      <Head>
        <title>
          {typeof repository === 'object'
            ? `${repository.owner}/${repository.name}`
            : 'repository'}{' '}
          - o2
        </title>
        <meta name='description' content='a git repository on the o2 service' />
      </Head>
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
        <Container
          sx={{ display: 'block', p: 5, overflow: 'auto' }}
          dangerouslySetInnerHTML={{ __html: snarkdown(readme) }}
        />
      )}
    </Layout>
  )
}
