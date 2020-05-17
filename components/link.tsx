import * as React from 'react'
import styled from '@emotion/styled'
import { Link as RebassLink, LinkProps } from 'rebass'

import { navigate } from '@quercia/quercia'

const route = (to: string) => (
  e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
) => {
  e.preventDefault()
  e.stopPropagation()
  navigate(to)
}

const Anchor = styled(RebassLink)`
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`

// custom implementation of quercia's Link component with Rebass/styled-system
const Link: React.FC<LinkProps & { to?: string }> = ({ to, ...props }) => {
  if (to) {
    props.onClick = route(to)
    props.href = to
  }

  return <Anchor color='primary.default' {...(props as any)} />
}

export default Link
