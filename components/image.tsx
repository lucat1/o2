import { styled } from 'goober'
import * as React from 'react'

import { SSG } from '@quercia/quercia'

import { Base as B } from './skeleton'

type ImageProps = React.DetailedHTMLProps<
  React.ImgHTMLAttributes<HTMLImageElement>,
  HTMLImageElement
> & {
  src: string
}

const Img = styled('img')`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  transition: opacity 0.2s ease-in-out;
  user-select: none;
  pointer-events: none;
`

const Base = styled(B)`
  border-radius: 50%;
`

const Image: React.FunctionComponent<ImageProps> = ({ src, alt, ...props }) => {
  if (SSG) {
    return <Base {...props} />
  }

  const [loaded, setLoaded] = React.useState(false)

  return (
    <Base {...props}>
      <Img
        style={{ opacity: loaded ? 1 : 0 }}
        onLoad={() => setLoaded(true)}
        alt={alt}
        src={src}
      />
    </Base>
  )
}

export default Image
