import * as React from 'react'
import { usePrerender, Link as QLink, LinkProps } from '@quercia/quercia'
import { styled } from 'goober'

import Skeleton from './skeleton'

export interface TypographyProps {
  known?: boolean
}

export const factory = <T extends Object = any>(
  H: React.FunctionComponent,
  height: number = 1.2,
  defaultLength: number = 6
): React.FunctionComponent<TypographyProps & T> => ({ known, ...props }) => {
  if (usePrerender() && !known) {
    // make the width resemble more the size of the text
    let width = props.children?.toString().length || defaultLength
    if (typeof props.children === 'object') {
      width = defaultLength
    }
    if (width && width > 1) {
      width -= 0.5 * (width / 1.5)
    }

    return (
      <H>
        <Skeleton height={height} width={width || defaultLength} />
      </H>
    )
  }

  return <H {...props} />
}

export const H2 = factory(styled('h2')`
  margin: 0.5em 0;
`)

export const H4 = factory(styled('h4')`
  margin: 0;
`)
export const SpacedH4 = factory(styled('h4')`
  margin: 0 0.5em;
`)

type AP = React.DetailedHTMLProps<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  HTMLAnchorElement
>

const makeA = c => styled(c)`
  text-decoration: none;
  color: var(--primary);
`
const _A = makeA('a')
const _QLink = makeA(QLink)

export const A = factory<AP>(props => <_A {...props} />)
export const SpacedA = factory<AP>(styled(_A)`
  margin: 0 0.5em;
`)

export const Link = factory<LinkProps>(_QLink)
export const SpacedLink = factory<LinkProps>(styled(_QLink)`
  margin: 0 0.5em;
`)

if (process.env.NODE_ENV !== 'production') {
  A.displayName = 'Typography(a)'
  SpacedA.displayName = 'Spaced(a)'

  H4.displayName = 'Typography(h4)'
  SpacedH4.displayName = 'Spaced(h4)'

  Link.displayName = 'Typography(Link)'
  SpacedLink.displayName = 'Spaced(Link)'
}
