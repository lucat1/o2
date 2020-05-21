import * as React from 'react'
import { LinkProps as RebassLinkProps } from 'rebass'
import { navigate } from '@quercia/quercia'
import merge from 'deep-extend'

import Text, { TextProps } from './text'

const route = (to: string) => (e: Event) => {
  e.preventDefault()
  e.stopPropagation()
  navigate(to)
}

export type LinkProps = RebassLinkProps &
  TextProps & { to?: string; unkown?: boolean }

// custom implementation of quercia's Link component with Rebass/styled-system
const Link: React.FC<LinkProps & { to?: string }> = ({
  to,
  known,
  unkown,
  ...props
}) => {
  if (to) {
    props.onClick = route(to) as any
    props.href = to
  }

  return (
    <Text
      known={known || !unkown}
      as='a'
      css={merge(
        {
          'textDecoration': 'none',
          ':hover': { textDecoration: 'underline' }
        },
        props.css
      )}
      sx={merge({ color: 'primary.default' }, props.sx)}
      {...(props as any)}
    />
  )
}

export default Link
