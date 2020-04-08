import * as React from 'react'
import { usePrerender, Head } from '@quercia/quercia'

import Header from '../components/header'

interface User {
  username: string
}

interface IndexProps {
  user?: User
}

export default ({ user }: IndexProps) => {
  const isPrerender = usePrerender()

  return (
    <>
      <Head>
        <title>Index - auth.o2</title>
        <meta content='the index page of the auth.o2 service' />
      </Head>
      <Header />
      <div>Your username: {user?.username || 'Not logged in'}</div>
    </>
  )
}
