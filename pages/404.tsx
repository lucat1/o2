import { styled } from 'goober'
import * as React from 'react'

import { Head, SSG } from '@quercia/quercia'

import NotFound from '../components/svgs/notfound'
import { H4 } from '../components/_typography'

const Container = styled('div')`
  height: calc(100% - 2.5em);

  display: flex;
  align-items: center;
  flex-direction: column;
`

interface NotFoundProps {
  path: string
}

export default ({ path }: NotFoundProps) => (
  <>
    <Head>
      <title>not found {!SSG && path} - o2</title>
    </Head>
    <Container>
      <h1>Page not found:</h1>
      <H4>{path}</H4>
      <NotFound style={{ width: '90%', marginTop: '2em' }} />
    </Container>
  </>
)
