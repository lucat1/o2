import * as React from 'react'
import { Head, Link } from '@quercia/quercia'

import { BaseData } from '../types/data'

export default ({ loggedUser }: BaseData) => {
  return (
    <div>
      <Head>
        <title>Index - auth.o2</title>
        <meta content='the index page of the auth.o2 service' />
      </Head>
      <a>Your username: {loggedUser?.username || 'Not logged in'}</a>
      <Link to='/test'>broken link</Link>
    </div>
  )
}
