import * as React from 'react'
import { usePrerender } from '@quercia/quercia'
import { styled } from 'goober'
import { Base } from './skeleton'

interface ImageProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLImageElement>,
    HTMLImageElement
  > {
  src: string
}

const Img = styled('img')`
  width: 100%;
  height: 100%;
  transition: opacity 0.2s ease-in-out;
`

const Image: React.FunctionComponent<ImageProps> = ({ src, ...props }) => {
  if (usePrerender()) {
    return <Base {...props} />
  }

  const [loaded, setLoaded] = React.useState(false)

  return (
    <Base {...props}>
      <Img
        style={{ opacity: loaded ? 1 : 0 }}
        onLoad={() => setLoaded(true)}
        src={src}
        {...props}
      />
    </Base>
  )
}

export default Image
