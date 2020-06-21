import * as React from 'react'
import { Flex } from 'rebass'
import { Head } from '@quercia/quercia'

import Layout from '../../components/repository/layout'

import { Base, Issue } from '../../types/repository'
import Input from '../../components/input'
import Button from '../../components/button'
import Link from '../../components/link'
import Container from '../../components/base'

export interface IssuesProps {
  issues: Issue[]
}

export default ({ repository, owns, issues }: Base<IssuesProps>) => {
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
        <Link to={`${base}/issues/new`}>
          <Button>New</Button>
        </Link>
      </Flex>

      {(issues || []).map(issue => (
        <Container py={2} px={4} my={2} key={issue.id}>
          <Link to={`${base}/issue/${issue.id}`}>{issue.title}</Link>
        </Container>
      ))}
    </Layout>
  )
}
