import * as React from 'react'
import { Head } from '@quercia/quercia'
import { styled } from 'goober'

import Layout from '../components/repository/layout'
import Container from '../components/repository/container'

import { Repository, Commit } from '../types/data'

export interface CommitsProps {
  repository: Repository
  commits: Commit[]
}

const CommitContainer = styled(Container)`
  margin: 1em 0;
`

export default ({ repository, commits }: CommitsProps) => {
  return (
    <>
      <Head>
        <title>
          {typeof repository === 'object'
            ? `${repository.owner}/${repository.name}`
            : 'commits'}{' '}
          - o2
        </title>
        <meta
          name='description'
          content='the commits of a git repository on the o2 service'
        />
      </Head>
      <Layout repository={repository} page='Commits'>
        {commits.map(commit => (
          <CommitContainer key={commit.commit}>
            {commit.subject}
          </CommitContainer>
        ))}
      </Layout>
    </>
  )
}
