import * as React from 'react'
import { Head, Link } from '@quercia/quercia'

import { BaseData } from '../types/data'

export default ({ account }: BaseData) => {
  return (
    <div>
      <Head>
        <title>Index - auth.o2</title>
        <meta content='the index page of the auth.o2 service' />
      </Head>
      <h1>Index page</h1>
    </div>
  )
}
