import * as React from 'react'
import { Head, usePrerender } from '@quercia/quercia'

import Layout from '../components/repository/layout'
import Commit from '../components/commit/commit'

import { Repository, Commit as ICommit } from '../types/data'

export interface CommitsProps {
  repository: Repository
  commits: ICommit[]
}

export default ({ repository, commits }: CommitsProps) => {
  if (usePrerender()) {
    commits = Array.from({ length: 20 })
  }

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
          <Commit
            key={commit?.commit}
            base={`/${repository?.owner}/${repository?.name}`}
            commit={commit}
          />
        ))}
      </Layout>
    </>
  )
}
