import * as React from 'react'
import { Head, SSG } from '@quercia/quercia'
import { css, styled } from 'goober'
import * as pretty from 'pretty-bytes'
import { highlight, languages } from 'prismjs/components/prism-core'

import Divider from '../components/divider'

import load, { lang } from '../components/code/load'
import Pre from '../components/code/pre'
import Container from '../components/base'
import Layout from '../components/repository/layout'
import Path, { basename } from '../components/repository/path'
import { SpacedA } from '../components/_typography'
import { Blob, Repository } from '../types/data'

export interface RepositoryProps {
  repository: Repository
  owns: boolean

  blob: Blob
  data: string
  ext: string
}

const Code = styled('code')`
  overflow: auto;
  display: grid;
  grid-template-columns: auto 3fr;

  pre {
    margin: 0.25em 0;

    &:nth-child(1) {
      padding: 0 1em;
      user-select: none;
      text-align: right;
    }
  }
`

const Title = styled('nav')`
  display: flex;
  align-items: center;

  padding: 0.35em 0.5em;
`

export default ({ repository, owns, blob, data, ext }: RepositoryProps) => {
  const [loaded, setLoaded] = React.useState(false)

  React.useEffect(() => {
    if (ext != '') {
      load(ext).then(() => setLoaded(true))
    }
  }, [ext])

  const language = lang(ext)

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
      <Layout owns={owns} repository={repository} page='Tree'>
        <Path repository={repository} entry={blob} />
        {blob && data && !SSG && (
          <Container>
            <Title>
              {basename(blob.name)}
              <SpacedA href='?raw'>raw</SpacedA>
              <span
                className={css`
                  flex: 1;
                  text-align: right;
                `}
              >
                {pretty(blob.size)}
              </span>
            </Title>
            <Divider />
            <Code>
              <pre>{data.split('\n').map((_, i) => `${i + 1}\n`)}</pre>
              {loaded && languages[language] ? (
                <Pre
                  dangerouslySetInnerHTML={{
                    __html: highlight(data, languages[language], language)
                  }}
                />
              ) : (
                <Pre>{data}</Pre>
              )}
            </Code>
          </Container>
        )}
      </Layout>
    </>
  )
}
