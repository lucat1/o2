import * as React from 'react'
import { usePrerender } from '@quercia/quercia'
import styled from '@emotion/styled'

import { H2, H4, SpacedH4, A } from '../typography'
import Skeleton, { Base } from '../skeleton'

import { User } from '../../types/data'
import Theme from '../../types/theme'
import { ProfileProps } from '../../pages/profile'

const User = styled.section`
  width: 15em;
  padding: 0 2.5em;

  display: flex;
  flex-direction: column;
  align-items: center;

  @media only screen and (max-width: 700px) {
    width: 100%;
  }
`

const Picture = styled(Base)<{ theme?: Theme }>`
  width: 10em;
  height: 10em;
  border-radius: 50%;
`

const Line = styled.div`
  width: 10em;
  display: flex;
  flex-direction: row;
`

const Description = styled(Line)`
  margin-top: 1em;
`

const Profile = ({ user }: ProfileProps) => (
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
)

if (process.env.NODE_ENV !== 'production') {
  User.displayName = 'User'
}

export default Profile
