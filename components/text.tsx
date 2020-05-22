import * as React from 'react'
import { Text as RebassText, TextProps as RebassTextProps } from 'rebass'
import { SSG } from '@quercia/quercia'
import merge from 'deep-extend'

import Skeleton from './skeleton'

export type TextProps = RebassTextProps & { known?: boolean }

const Text: React.FC<TextProps> = ({
  known,
  fontSize,
  width,
  height,
  ...props
}) => {
  props.sx = Object.assign(
    {
      fontSize: fontSize || 'sm'
    },
    props.sx || {}
  )

  props.as = props.as || 'span'

  if (SSG && !known) {
    // make the width resemble more the size of the text
    let w = props.children?.toString().length || 8
    if (typeof props.children === 'object') {
      w = 8
    }
    if (w && w > 1) {
      w -= 0.5 * (w / 1.75)
    }

    return (
      <RebassText
        {...(props as any)}
        css={merge({ display: 'flex', alignItems: 'center ' }, props.css)}
      >
        <Skeleton width={width || w + 'rem'} height={height || '1.25rem'} />
      </RebassText>
    )
  }

  return <RebassText {...(props as any)} />
}

export default Text
