import * as React from 'react'
import { styled, css } from 'goober'

import { SSG } from '@quercia/quercia'

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
  border-radius: 50%;
  transition: opacity 0.2s ease-in-out;
  user-select: none;
  pointer-events: none;
`

const border = css`
  border-radius: 50%;
`

const Image: React.FunctionComponent<ImageProps> = ({
  src,
  alt,
  className,
  ...props
}) => {
  if (SSG) {
    return <Base {...props} className={`${className} ${border}`} />
  }

  const [loaded, setLoaded] = React.useState(false)

  return (
    <Base {...props} className={`${className} ${border}`}>
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
