import * as React from 'react'
import { Head, SSG } from '@quercia/quercia'

import Center from '../components/center'
import Heading from '../components/heading'
import NotFound from '../components/svgs/notfound'

import { Base } from '../types/data'

export default ({ path }: Base<{ path: string }>) => (
  <Center css={{ height: 'calc(100vh - 3.5rem)', flex: 1 }}>
    <Head>
      <title>not found {!SSG && path} - o2</title>
    </Head>
    <Heading known as='h1'>
      Page not found:
    </Heading>
    <Heading as='h4' width={9}>
      {path}
    </Heading>
    <NotFound style={{ width: '70%', marginTop: '2em' }} />
  </Center>
)
