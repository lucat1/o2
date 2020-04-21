import * as React from 'react'
import { useRouter, usePrerender } from '@quercia/quercia'
import { styled } from 'goober'

const Bar = styled('div')`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 0.15em;
  background: var(--primary);
  opacity: 0;
  transition: opacity 0.2s ease-in-out, width 0.2s ease-in-out;
  z-index: 10;
`

const Progress: React.FunctionComponent = () => {
  if (usePrerender()) {
    return null
  }

  const { loading } = useRouter()
  const [val, setVal] = React.useState(10)

  React.useEffect(() => {
    const bump = () => {
      if (!loading) {
        clearInterval(handle)
        return
      }

      setVal(s => (s >= 85 ? s : s + 20))
    }

    setVal(10)
    const handle = setInterval(bump, 300)
    return () => clearInterval(handle)
  }, [loading])

  return <Bar style={{ width: `${val}%`, opacity: loading ? 1 : 0 }} />
}

export default Progress
