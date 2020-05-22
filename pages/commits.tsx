import * as React from 'react'
import { Head, navigate, SSG } from '@quercia/quercia'

import Center from '../components/center'
import Button from '../components/button'
import Link from '../components/link'

import Commit from '../components/commit/commit'
import Layout from '../components/repository/layout'

import { Commit as ICommit } from '../types/data'
import { Base } from '../types/repository'

export interface CommitsProps {
  branch: string
  index: number
  prev: boolean
  next: boolean
  commits: ICommit[]
}

// const ButtonContainer = styled('div')`
//   flex: 1;
//   display: flex;
//   flex-direction: row;
//   align-items: center;
//   justify-content: center;
//   padding: 1em;
// `

export default ({
  repository,
  owns,
  commits,
  prev,
  next,
  index,
  branch
}: Base<CommitsProps>) => {
  if (SSG) {
    commits = Array.from({ length: 20 })
  }

  const base = `/${repository?.owner}/${repository?.name}`
  const url = (i: number) => `${base}/commits/${branch}/${i}`

  return (
    <Layout owns={owns} repository={repository} page='Commits'>
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

      {(commits || []).map(commit => (
        <Commit key={commit?.commit} base={base} commit={commit} />
      ))}

      <Center flexDirection='row' p={4}>
        <Link
          m={4}
          to={url(index - 1)}
          css={{ textDecoration: 'none' }}
          color='bg.5'
        >
          <Button disabled={!prev}>Previous</Button>
        </Link>
        <Link
          m={4}
          to={url(index + 1)}
          css={{ textDecoration: 'none' }}
          color='bg.5'
        >
          <Button disabled={!prev}>Next</Button>
        </Link>
      </Center>
    </Layout>
  )
}
