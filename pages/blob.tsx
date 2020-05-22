import * as React from 'react'
import { Box, Flex } from 'rebass'
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

// const Code = styled('code')`
//   overflow: auto;
//   display: grid;
//   grid-template-columns: auto 3fr;

//   pre {
//     margin: 0.25em 0;

//     &:nth-child(1) {
//       padding: 0 1em;
//       user-select: none;
//       text-align: right;
//     }
//   }
// `

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

        <Container css={{ alignItems: 'center', flexDirection: 'row' }}>
          <Flex px={2} py={1} flex={1}>
            <Text>{!SSG && basename(blob.name)}</Text>
            <Link href='?raw'>raw</Link>
            <Text flex={1} textAlign='right'>
              {!SSG && pretty(blob?.size)}
            </Text>
          </Flex>
          <Divider />
          <Box overflow='auto'>
            {/*
            <pre>{data?.split('\n').map((_, i) => `${i + 1}\n`)}</pre>
            {loaded && languages[language] ? (
              <Pre
                dangerouslySetInnerHTML={{
                  __html: highlight(data, languages[language], language)
                }}
              />
            ) : (
              <Pre>{data}</Pre>
            )}*/}
          </Box>
        </Container>
      </Layout>
    </>
  )
}
