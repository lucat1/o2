import * as React from 'react'
import { Flex } from 'rebass'
import { Head, SSG } from '@quercia/quercia'
import * as pretty from 'pretty-bytes'
import { highlight, languages } from 'prismjs/components/prism-core'

import Container from '../components/base'
import Divider from '../components/divider'
import Text from '../components/text'
import Link from '../components/link'
import Layout from '../components/repository/layout'
import Path, { basename } from '../components/repository/path'
import Pre from '../components/code/pre'

import load, { lang } from '../components/code/load'
import { Base, BlobProps } from '../types/repository'

// TODO: proper prerender
export default ({ repository, owns, blob, data, ext }: Base<BlobProps>) => {
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

        <Container css={{ alignItems: 'center', flexDirection: 'column' }}>
          <Flex p={2} width='100%'>
            <Text width={8}>{!SSG && basename(blob.name)}</Text>

            <Link mx={2} href='?raw'>
              raw
            </Link>

            <Text flex={1} textAlign='end' css={{ justifyContent: 'flex-end' }}>
              {!SSG && pretty(blob?.size)}
            </Text>
          </Flex>

          <Divider width='100%' />
          <Flex width='100%' overflow='auto' flexDirection='row'>
            <Pre
              px={3}
              sx={{
                textAlign: 'end',
                pointerEvents: 'none',
                borderRight: '1px solid',
                borderColor: 'bg.3',
                flexShrink: 0
              }}
            >
              {data?.split('\n').map((_, i) => `${i + 1}\n`)}
            </Pre>
            {loaded && languages[language] ? (
              <Pre
                dangerouslySetInnerHTML={{
                  __html: highlight(data, languages[language], language)
                }}
              />
            ) : (
              <Pre>{data}</Pre>
            )}
          </Flex>
        </Container>
      </Layout>
    </>
  )
}
