import * as React from 'react'
import { Head } from '@quercia/quercia'
import { styled } from 'goober'

import { H2 } from '../components/typography'

const Container = styled('main')`
  display: flex;
  flex-direction: row;
  padding: 0 6em;

  @media only screen and (max-width: 960px) {
    padding: 2em 0;
    flex-direction: column;
  }
`

export default () => {
  return (
    <>
      <Head>
        <title>repository - o2</title>
        <meta name='description' content='a git repository on the o2 service' />
      </Head>
      <Container>
        <H2>Repository</H2>
      </Container>
    </>
  )
}
