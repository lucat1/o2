import * as React from 'react'
import { Image, ImageProps } from 'rebass'
import styled from '@emotion/styled'
import { SSG } from '@quercia/quercia'

import Skeleton from './skeleton'

const StyledImage = styled(Image)`
  width: 100%;
  height: 100%;
  transition: opacity 0.2s ease-in-out;

  user-select: none;
  pointer-events: none;
  outline: none;
`

const Img: React.FC<ImageProps> = ({ src, alt, ...props }) => {
  if (SSG) {
    return <Skeleton {...(props as any)} />
  }

  const [loaded, setLoaded] = React.useState(false)

  return (
    <Skeleton
      sx={Object.assign({ borderRadius: 'lg' }, props.sx)}
      {...(props as any)}
    >
      <StyledImage
        sx={Object.assign({ borderRadius: 'lg' }, props.sx)}
        style={{ opacity: loaded ? 1 : 0 }}
        onLoad={() => setLoaded(true)}
        alt={alt}
        src={src}
        {...(props as any)}
      />
    </Skeleton>
  )
}

export default Img
