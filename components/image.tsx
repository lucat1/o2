import * as React from 'react'
import { Image as RebassImage, ImageProps } from 'rebass'
import merge from '../types/xtend'
import { SSG } from '@quercia/quercia'

import Skeleton from './skeleton'

const Image: React.FC<ImageProps> = ({ src, alt, ...props }) => {
  const sx = Object.assign(
    { borderRadius: 'lg', flexGrow: 0, flexShrink: 0 },
    props.sx
  )

  if (SSG) {
    return <Skeleton sx={sx} {...(props as any)} />
  }

  const [loaded, setLoaded] = React.useState(false)
  const [hidden, setHidden] = React.useState(false)
  return (
    <Skeleton sx={sx} {...(props as any)}>
      <RebassImage
        sx={sx}
        css={merge(
          {
            width: '100%',
            height: '100%',
            transition: 'opacity 300ms ease-in-out',
            userSelect: 'none',
            pointerEvents: 'none',
            outline: 'none'
          },
          props.css
        )}
        style={Object.assign(
          { opacity: loaded ? 1 : 0 },
          hidden ? { display: 'none' } : {}
        )}
        onLoad={() => setLoaded(true)}
        onError={() => setHidden(true)}
        alt={alt}
        src={src}
        {...(props as any)}
      />
    </Skeleton>
  )
}

export default Image
