import * as React from 'react'
import { Head, usePrerender } from '@quercia/quercia'
import { styled } from 'goober'

import { Repository, Blob } from '../types/data'

import Layout from '../components/repository/layout'
import Path from '../components/repository/path'
import Container from '../components/repository/container'

export interface RepositoryProps {
  repository: Repository
  blob: Blob
  data: string
}

const Code = styled(Container)`
  overflow: auto;
`

export default ({ repository, blob, data }: RepositoryProps) => {
  return (
    <>
      <Head>
        <title>
          {typeof repository === 'object'
            ? `${repository.name}/${blob.name}`
            : 'blob'}{' '}
          - o2
        </title>
        <meta
          name='description'
          content='the blob of a file inside a git repository on the o2 service'
        />
      </Head>
      <Layout repository={repository} page='Tree'>
        <Path repository={repository} entry={blob} />
        {blob && !usePrerender() && (
          <Code>
            <pre>{data}</pre>
          </Code>
        )}
      </Layout>
    </>
  )
}
