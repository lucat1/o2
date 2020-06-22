import * as React from 'react'
import { Head } from '@quercia/quercia'
import { Flex } from 'rebass'

import Layout from '../../components/repository/layout'
import Text from '../../components/text'
import Divider from '../../components/divider'
import Container from '../../components/base'
import Image from '../../components/image'

import { Base, Issue, Comment } from '../../types/repository'

export interface IssuesProps {
  issue: Issue
  comments: Comment[]
}

export default ({ repository, owns, issue, comments }: Base<IssuesProps>) => {
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

      <Flex
        flexDirection='row'
        justifyContent='space-between'
        alignItems='center'
        py={2}
      >
        <Text height={4} width={9} fontSize='1.25em'>
          {issue?.title}
        </Text>
        <Text width={5} color='primary.default'>
          #{issue?.id}
        </Text>
      </Flex>
      <Divider />

      {(comments || []).map(comment => (
        <Flex my={4} flex={1}>
          <Image width={4} height={4} src={`/picture/${comment.picture}`} />
          <Container flex={1} ml={2} my={0} p={4}>
            {comment.body}
          </Container>
        </Flex>
      ))}
    </Layout>
  )
}
