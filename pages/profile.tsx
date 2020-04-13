import * as React from 'react'
import { Head, usePrerender } from '@quercia/quercia'
import styled from '@emotion/styled'

import { H2, H4, SpacedH4, A } from '../components/typography'
import Skeleton, { Base } from '../components/skeleton'

import { User, Repository } from '../types/data'
import Theme from '../types/theme'

interface ProfileProps {
  user?: User
}

const width = 10

const Container = styled.main`
  display: flex;
  flex-direction: row;
  padding-top: 2em;

  @media only screen and (max-width: 600px) {
    flex-direction: column;
  }
`

const User = styled.section`
  width: ${width * 2}em;

  display: flex;
  flex-direction: column;
  align-items: center;

  @media only screen and (max-width: 600px) {
    width: 100%;
  }
`

const Picture = styled(Base)<{ theme?: Theme }>`
  width: ${width}em;
  height: ${width}em;
  border-radius: 50%;
`

const Line = styled.div`
  width: ${width}em;
  display: flex;
  flex-direction: row;
`

const Description = styled(Line)`
  margin-top: 1em;
`

const Repos = styled.section`
  width: 100%;
`

const RepoContainer = styled.div`
  padding: 1em calc(1em + 2vw);

  &:nth-child(1) {
    padding-top: 0;
  }

  @media only screen and (max-width: 600px) {
    &:nth-child(1) {
      padding-top: 2em;
    }
  }
`

const Repo = styled.div`
  border: 1px solid red;
`

export default ({ user }: ProfileProps) => {
  if (usePrerender()) {
    user = {} as any
    user.repositories = Array.from({ length: 3 })
  }

  return (
    <Container>
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
      <Repos>
        {(user?.repositories || []).map((repository, i) => (
          <RepoContainer key={i}>
            {usePrerender() ? (
              <Skeleton width='100%' height='10em' />
            ) : (
              <Repo />
            )}
          </RepoContainer>
        ))}
      </Repos>
    </Container>
  )
}
