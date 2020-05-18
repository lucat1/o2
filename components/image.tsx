import * as React from 'react'
import { Image as RebassImage, ImageProps } from 'rebass'
import styled from '@emotion/styled'
import { SSG } from '@quercia/quercia'

import Skeleton from './skeleton'

const StyledImage = styled(RebassImage)`
  width: 100%;
  height: 100%;
  transition: opacity 0.2s ease-in-out;

  user-select: none;
  pointer-events: none;
  outline: none;
`

const Image: React.FC<ImageProps> = ({ src, alt, ...props }) => {
  const sx = Object.assign(
    { borderRadius: 'lg', flexGrow: 0, flexShrink: 0 },
    props.sx
  )

  if (SSG) {
    return <Skeleton sx={sx} {...(props as any)} />
  }

  const [loaded, setLoaded] = React.useState(false)
  return (
    <Skeleton sx={sx} {...(props as any)}>
      <StyledImage
        sx={sx}
        style={{ opacity: loaded ? 1 : 0 }}
        onLoad={() => setLoaded(true)}
        alt={alt}
        src={src}
        {...(props as any)}
      />
    </Skeleton>
  )
}

export default Image
