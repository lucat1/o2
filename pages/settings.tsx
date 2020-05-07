import * as React from 'react'
import { Head } from '@quercia/quercia'

export default ({ repository }) => {
  return (
    <>
      <Head>
        <title>
          {typeof repository === 'object'
            ? `${repository.owner}/${repository.name}`
            : 'unkown'}{' '}
          settings - o2
        </title>
        <meta
          name='description'
          content='the settings of a git repository on the o2 service'
        />
      </Head>
      <h1>Settings page</h1>
    </>
  )
}
