import * as diff from 'parse-diff'
import * as React from 'react'
import { Head, SSG } from '@quercia/quercia'

import Layout from '../components/repository/layout'
import Text from '../components/text'

import Commit from '../components/commit/commit'
import Diff from '../components/commit/diff'

import { DetailedCommit } from '../types/data'
import { Base } from '../types/repository'

export default ({
  repository,
  commit,
  owns
}: Base<{ commit: DetailedCommit }>) => {
  if (SSG) {
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
      <Layout owns={owns} repository={repository} page='Commits'>
        <Commit
          base={`/${repository?.owner}/${repository?.name}`}
          commit={commit}
        />
        <Text>
          Showing {files.length} changed file{files.length > 1 ? 's' : ''} with{' '}
          <strong>
            {additions} additions and {deletions} deletions
          </strong>
        </Text>
        {files.map(file => (
          <Diff key={file.from + '-' + file.to} file={file} />
        ))}
      </Layout>
    </>
  )
}
