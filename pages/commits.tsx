import * as React from 'react'
import { Head, usePrerender, navigate } from '@quercia/quercia'
import { styled } from 'goober'

import Layout from '../components/repository/layout'
import Commit from '../components/commit/commit'

import { Repository, Commit as ICommit } from '../types/data'
import Button from '../components/button'

export interface CommitsProps {
  repository: Repository

  branch: string
  index: number
  prev: boolean
  next: boolean
  commits: ICommit[]
}

const ButtonContainer = styled('div')`
  flex: 1;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 1em;
`

export default ({
  repository,
  commits,
  prev,
  next,
  index,
  branch
}: CommitsProps) => {
  if (usePrerender()) {
    commits = Array.from({ length: 20 })
  }

  const base = `/${repository?.owner}/${repository?.name}`
  const goTo = (i: number) => navigate(`${base}/commits/${branch}/${i}`)

  return (
    <>
      <Head>
        <title>
          {typeof repository === 'object'
            ? `${repository.owner}/${repository.name}`
            : ''}
          {' commits'}- o2
        </title>
        <meta
          name='description'
          content='the commits of a git repository on the o2 service'
        />
      </Head>
      <Layout repository={repository} page='Commits'>
        {(commits || []).map(commit => (
          <Commit key={commit?.commit} base={base} commit={commit} />
        ))}

        <ButtonContainer>
          <Button onClick={() => goTo(index - 1)} disabled={!prev}>
            Previous
          </Button>
          <Button onClick={() => goTo(index + 1)} disabled={!next}>
            Next
          </Button>
        </ButtonContainer>
      </Layout>
    </>
  )
}
