import * as React from 'react'
import { Heading as RebassHeading, HeadingProps } from 'rebass'
import { SSG } from '@quercia/quercia'

import Skeleton from './skeleton'

const Heading: React.FC<HeadingProps & { known?: boolean }> = ({
  known,
  fontSize,
  width,
  height,
  ...props
}) => {
  props.sx = Object.assign(
    {
      my: 2,
      fontSize: fontSize || 'lg'
    },
    props.sx || {}
  )

  if (SSG && !known) {
    // make the width resemble more the size of the text
    let w = props.children?.toString().length || 6
    if (typeof props.children === 'object') {
      w = 6
    }
    if (w && w > 1) {
      w -= 0.5 * (w / 1.5)
    }

    return (
      <RebassHeading {...(props as any)}>
        <Skeleton width={width || w + 'rem'} height={height || '1.75rem'} />
      </RebassHeading>
    )
  }

  return <RebassHeading {...(props as any)} />
}

export default Heading
