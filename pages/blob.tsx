import * as React from 'react'
import { Head, usePrerender } from '@quercia/quercia'
import { styled, css } from 'goober'
import { highlight, languages } from 'prismjs/components/prism-core'
import * as pretty from 'pretty-bytes'

import { Repository, Blob } from '../types/data'

import Layout from '../components/repository/layout'
import Path, { basename } from '../components/repository/path'
import Container from '../components/repository/container'
import { Line } from '../components/repository/empty'
import { SpacedA } from '../components/typography'
import Pre from '../components/code/pre'

import load, { lang } from '../components/code/load'

export interface RepositoryProps {
  repository: Repository

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

export default ({ repository, blob, data, ext }: RepositoryProps) => {
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
      <Layout repository={repository} page='Tree'>
        <Path repository={repository} entry={blob} />
        {blob && data && !usePrerender() && (
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
            <Line />
            <Code>
              <pre>{data.split('\n').map((_, i) => `${i + 1}\n`)}</pre>
              <Pre
                dangerouslySetInnerHTML={{
                  __html:
                    loaded && languages[language]
                      ? highlight(data, languages[language], language)
                      : data
                }}
              />
            </Code>
          </Container>
        )}
      </Layout>
    </>
  )
}
