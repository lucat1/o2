import * as React from 'react'
import { navigate } from '@quercia/quercia'
import { Link as RebassLink, LinkProps } from 'rebass'

const route = (to: string) => (
  e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
) => {
  e.preventDefault()
  e.stopPropagation()
  navigate(to)
}

// custom implementation of quercia's Link component with Rebass/styled-system
const Link: React.FC<LinkProps & { to?: string }> = ({ to, ...props }) => {
  if (to) {
    props.onClick = route(to)
    props.href = to
  }

  return <RebassLink color='primary.default' {...(props as any)} />
}

export default Link
