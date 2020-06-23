import * as React from 'react'
import { Head } from '@quercia/quercia'
import { Flex, Box } from 'rebass'
import format from 'tinydate'

import Layout from '../../components/repository/layout'
import Text from '../../components/text'
import Divider from '../../components/divider'
import Container from '../../components/base'
import Image from '../../components/image'

import { Base, Issue, Comment } from '../../types/repository'
import elapsed from '../../types/time'

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

      <Flex flexDirection='column' py={2}>
        <Flex flex={1} justifyContent='space-between'>
          <Text height={4} width={9} fontSize='1.25em'>
            {issue?.title}
          </Text>
          <Text width={5} color='primary.default'>
            #{issue?.id}
          </Text>
        </Flex>
        <Flex flex={1}>
          <Text color='bg.3' py={2} fontSize='xs'>
            opened {elapsed(issue?.opened)}
          </Text>
        </Flex>
      </Flex>
      <Divider />

      {(comments || []).map((comment, i) => (
        <Flex key={i} my={4} flex={1}>
          <Image width={4} height={4} src={`/picture/${comment.picture}`} />
          <Container flexDirection='column' flex={1} ml={2} my={0}>
            <Box py={1} px={4}>
              <Text color='bg.3' fontSize='xs'>
                commented {elapsed(comment.commented)}
              </Text>
            </Box>
            <Divider />

            <Box py={2} px={4}>
              {comment.body}
            </Box>
          </Container>
        </Flex>
      ))}
    </Layout>
  )
}
