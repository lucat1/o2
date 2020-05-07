import * as React from 'react'
import { SSG } from '@quercia/quercia'
import { styled } from 'goober'

import { H2, H4, SpacedH4, A } from '../typography'
import Skeleton from '../skeleton'
import Image from '../image'

import { ProfileProps } from '../../pages/profile'
import _Button from '../button'
import _Add from '../svgs/add'

const User = styled('section')`
  width: 15em;
  padding: 0 2.25em;

  display: flex;
  flex-direction: column;
  align-items: center;
  flex-wrap: wrap;
  flex-grow: 1;
`

const Info = styled('div')`
  padding-left: 0;

  @media (max-width: 960px) {
    padding-left: 1em;
  }
`

const Picture = styled(Image)`
  width: 10em;
  height: 10em;
  border-radius: 50%;
`

const Line = styled('div')`
  width: 10em;
  display: flex;
  flex-direction: row;
`

const Description = styled(Line)`
  margin-top: 1em;
`

const Profile = ({ user, account }: ProfileProps) => (
  <User>
    <Picture
      alt={
        user
          ? `${user.username}'s profile picture`
          : "The user's profile picture"
      }
      src={user?.picture + '?s=300'}
    />
    <Info>
      <Line>
        <H2>{user?.username}</H2>
      </Line>
      <Line>
        <H4>{user?.firstname}</H4>
        <SpacedH4>{user?.lastname}</SpacedH4>
      </Line>
      <Description>
        <A known>📍</A>
        <A>{user?.location || (!SSG && 'Earth')}</A>
      </Description>
      <Description>
        {SSG ? (
          <Skeleton width='100%' height='5em' />
        ) : (
          <code>{user.description || (!SSG && 'Empty description')}</code>
        )}
      </Description>
    </Info>
  </User>
)

export default Profile
