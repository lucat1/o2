import * as React from 'react'
import { usePrerender, Link as QLink, LinkProps } from '@quercia/quercia'
import styled from '@emotion/styled'

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
    let width = props.children.toString().length || defaultLength
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

export const H4 = factory(props => <h4 {...props} />)
export const SpacedH4 = factory(styled.h4`
  margin: 0 0.5rem;
`)

type AP = React.DetailedHTMLProps<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  HTMLAnchorElement
>

export const A = factory<AP>(props => <a {...props} />)
export const SpacedA = factory<AP>(styled.a`
  margin: 0 0.5rem;
`)

export const Link = factory<LinkProps>(QLink)
export const SpacedLink = factory<LinkProps>(styled(QLink)`
  margin: 0 0.5rem;
`)
