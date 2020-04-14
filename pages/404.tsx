import * as React from 'react'
import { usePrerender, Head } from '@quercia/quercia'
import styled from '@emotion/styled'

import { H4 } from '../components/typography'
import NotFound from '../components/svgs/notfound'

const Container = styled.div`
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
      <title>not found {!usePrerender() && path} - o2</title>
    </Head>
    <Container>
      <h1>Page not found:</h1>
      <H4>{path}</H4>
      <NotFound style={{ width: '90%', marginTop: '2em' }} />
    </Container>
  </>
)
