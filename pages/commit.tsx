import * as React from 'react'
import { Head, usePrerender } from '@quercia/quercia'
import { styled } from 'goober'
import * as diff from 'parse-diff'

import Layout from '../components/repository/layout'
import Commit from '../components/commit/commit'
import Diff from '../components/commit/diff'

import { Repository, DetailedCommit } from '../types/data'

import { P } from '../components/typography'

export interface CommitProps {
  repository: Repository
  commit: DetailedCommit
}

export default ({ repository, commit }: CommitProps) => {
  if (usePrerender()) {
    // TODO: diff prerender
    return null
  }

  const files = diff(commit?.diff)
  const additions = files.reduce((p, f) => p + f.additions, 0)
  const deletions = files.reduce((p, f) => p + f.deletions, 0)

  return (
    <>
      <Head>
        <title>
          {typeof commit === 'object' && typeof repository === 'object'
            ? `${commit.subject} - ${repository.owner}/${repository.name}`
            : ''}
          - o2
        </title>
        <meta
          name='description'
          content='a commit inside of a git repository on the o2 service'
        />
      </Head>
      <Layout repository={repository} page='Commits'>
        <Commit
          base={`/${repository?.owner}/${repository?.name}`}
          commit={commit}
        />
        <P>
          Showing {files.length} changed file{files.length > 1 ? 's' : ''} with{' '}
          <strong>
            {additions} additions and {deletions} deletions
          </strong>
        </P>
        {files.map(file => (
          <Diff key={file.from + '-' + file.to} file={file} />
        ))}
      </Layout>
    </>
  )
}
