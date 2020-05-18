import * as React from 'react'
import { Heading as RebassHeading, HeadingProps } from 'rebass'
import { SSG } from '@quercia/quercia'

import Skeleton from './skeleton'

const Heading: React.FC<HeadingProps & { known?: boolean }> = ({
  known,
  ...props
}) => {
  props.sx = Object.assign(props.sx || {}, {
    py: 2
  })

  if (SSG) {
    // make the width resemble more the size of the text
    let width = props.children?.toString().length || 6
    if (typeof props.children === 'object') {
      width = 6
    }
    if (width && width > 1) {
      width -= 0.5 * (width / 1.5)
    }

    return (
      <RebassHeading {...(props as any)}>
        <Skeleton width={width + 'rem'} height='1.75rem' />
      </RebassHeading>
    )
  }

  return <RebassHeading {...(props as any)} />
}

export default Heading
