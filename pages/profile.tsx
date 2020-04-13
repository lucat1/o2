import * as React from 'react'
import { Head, usePrerender } from '@quercia/quercia'
import styled from '@emotion/styled'
import { lighten, darken } from 'polished'

import { H2, H4, SpacedH4, A } from '../components/typography'
import Skeleton from '../components/skeleton'
import { User } from '../types/data'
import Theme from '../types/theme'

interface ProfileProps {
  user?: User
}

const width = 10

const User = styled.section`
  width: ${width * 2}em;
  padding: 2em 0;

  display: flex;
  flex-direction: column;
  align-items: center;
`

const Picture = styled.div<{ theme?: Theme }>`
  width: ${width}em;
  height: ${width}em;
  border-radius: 50%;
  background: ${({ theme }) =>
    theme.dark
      ? lighten(0.2)(theme.background)
      : darken(0.2)(theme.background)};
`

const Line = styled.div`
  width: ${width}em;
  display: flex;
  flex-direction: row;
`

const Description = styled(Line)`
  margin-top: 1em;
`

export default ({ user }: ProfileProps) => {
  return (
    <>
      <Head>
        <title>{user?.username || 'profile'} - o2</title>
        <meta content='the index page of the o2 service' />
      </Head>
      <User>
        <Picture />
        <Line>
          <H2>{user?.username}</H2>
        </Line>
        <Line>
          <H4>{user?.firstname}</H4>
          <SpacedH4>{user?.lastname}</SpacedH4>
        </Line>
        <Description>
          <A known>📍</A>
          <A>{user?.location}</A>
        </Description>
        <Description>
          {usePrerender() ? (
            <Skeleton width='100%' height='5em' />
          ) : (
            <code>{user?.description}</code>
          )}
        </Description>
      </User>
    </>
  )
}
