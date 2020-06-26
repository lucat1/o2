import * as React from 'react'
import { Head, usePage } from '@quercia/quercia'
import { Flex } from 'rebass'

import Layout from '../../components/repository/layout'
import Input from '../../components/input'
import Button from '../../components/button'
import Link from '../../components/link'
import Text from '../../components/text'
import Heading from '../../components/heading'
import Container from '../../components/base'

import { Base, Issue } from '../../types/repository'
import elapsed from '../../types/time'

export interface IssuesProps {
  issues: Issue[]
}

export default ({ repository, owns, issues }: Base<IssuesProps>) => {
  const { account } = usePage()[1]
  const base = `/${repository?.owner}/${repository?.name}`
  return (
    <Layout owns={owns} repository={repository} page='Issues'>
      <Head>
        <title>
          {typeof repository === 'object'
            ? `${repository.owner}/${repository.name}`
            : ''}
          {' issues'}- o2
        </title>
        <meta
          name='description'
          content='the issues of a git repository on the o2 service'
        />
      </Head>

      <Flex py={2} flex={1} alignItems='center' justifyContent='space-between'>
        <Input pr={4} placeholder='Search' type='search' sx={{ width: 9 }} />
        <Link disabled={!account} to={`${base}/issues/new`}>
          <Button disabled={!account}>New</Button>
        </Link>
      </Flex>

      {(issues || []).map(issue => (
        <Container flexDirection='column' py={2} px={4} my={2} key={issue.id}>
          <Heading fontSize='md'>
            <Link to={`${base}/issue/${issue.id}`}>{issue.title}</Link>
          </Heading>
          <Text color='bg.3' fontSize='xs'>
            opened by <Link to={`/${issue.name}`}>{issue.name}</Link>{' '}
            {elapsed(issue?.opened)}
          </Text>
        </Container>
      ))}
    </Layout>
  )
}
