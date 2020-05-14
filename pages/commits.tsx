import { styled } from 'goober'
import * as React from 'react'

import { Head, navigate, SSG } from '@quercia/quercia'

import Button from '../components/button'
import Commit from '../components/commit/commit'
import Layout from '../components/repository/layout'
import { Commit as ICommit, Repository } from '../types/data'

export interface CommitsProps {
  repository: Repository
  owns: boolean

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
  owns,
  commits,
  prev,
  next,
  index,
  branch
}: CommitsProps) => {
  if (SSG) {
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
      <Layout owns={owns} repository={repository} page='Commits'>
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
