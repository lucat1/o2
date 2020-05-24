import * as React from 'react'
import { Box } from 'rebass'
import styled from '@emotion/styled'

import { SSG, useRouter } from '@quercia/quercia'

const Bar = styled('div')`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 0.15em;
  background: var(--primary);
  opacity: 0;
  transition: opacity 0.2s ease-in-out, width 0.2s ease-in-out;
  z-index: 11;
`

const Progress: React.FunctionComponent = () => {
  if (SSG) {
    return null
  }

  const { loading } = useRouter()
  const [val, setVal] = React.useState(10)
  const [opacity, setOpacity] = React.useState(0)

  React.useEffect(() => {
    const bump = () => {
      if (!loading) {
        clearInterval(handle)
        return
      }

      setVal(s => (s >= 85 ? s : s + 20))
    }

    // if the loading is done reset the value(200ms later)
    if (!loading) {
      // scroll the page back to the top
      window.scrollTo({ top: 0 })

      // reset the progress value
      setVal(100)
      setTimeout(() => {
        setVal(10)
        setOpacity(0)
      }, 200)
    } else {
      setVal(10)
      setOpacity(1)
    }

    const handle = setInterval(bump, 300)
    return () => clearInterval(handle)
  }, [loading])

  return <Box style={{ width: `${val}%`, opacity: opacity }} />
}

export default Progress
