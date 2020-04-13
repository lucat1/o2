import * as React from 'react'
import { usePrerender, Head } from '@quercia/quercia'

interface NotFoundProps {
  path: string
}

export default ({ path }: NotFoundProps) => {
  const isPrerender = usePrerender()

  return (
    <>
      <Head>
        <title>not found {!isPrerender && path} - o2</title>
      </Head>
      <h1>Page not found:</h1>
      <h3>url: {path}</h3>
    </>
  )
}
