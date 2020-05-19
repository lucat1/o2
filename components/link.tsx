import * as React from 'react'
import { Link as Anchor, LinkProps as RebassLinkProps } from 'rebass'
import merge from 'deep-extend'

import { navigate } from '@quercia/quercia'

const route = (to: string) => (
  e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
) => {
  e.preventDefault()
  e.stopPropagation()
  navigate(to)
}

export type LinkProps = RebassLinkProps & { to?: string }

// custom implementation of quercia's Link component with Rebass/styled-system
const Link: React.FC<LinkProps & { to?: string }> = ({ to, ...props }) => {
  if (to) {
    props.onClick = route(to)
    props.href = to
  }

  return (
    <Anchor
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
