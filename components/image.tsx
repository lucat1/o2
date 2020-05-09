import * as React from 'react'
import { SSG } from '@quercia/quercia'
import { styled } from 'goober'
import { Base } from './skeleton'

type ImageProps = React.DetailedHTMLProps<
  React.ImgHTMLAttributes<HTMLImageElement>,
  HTMLImageElement
> & {
  src: string
}

const Img = styled('img')`
  width: 100%;
  height: 100%;
  transition: opacity 0.2s ease-in-out;
  user-select: none;
`

const Image: React.FunctionComponent<ImageProps> = ({ src, ...props }) => {
  if (SSG) {
    return <Base {...props} />
  }

  const [loaded, setLoaded] = React.useState(false)

  return (
    <Base {...props}>
      <Img
        style={{ opacity: loaded ? 1 : 0 }}
        onLoad={() => setLoaded(true)}
        src={src}
      />
    </Base>
  )
}

export default Image
