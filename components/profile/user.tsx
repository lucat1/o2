import { styled } from 'goober'
import * as React from 'react'

import { SSG } from '@quercia/quercia'

import { ProfileProps } from '../../pages/user'
import _Button from '../button'
import Image from '../image'
import Skeleton from '../skeleton'
import { Left } from '../split'
import _Add from '../svgs/add'
import { A, H2, H4, SpacedH4 } from '../typography'

const User = styled(Left)`
  display: flex;
  flex-direction: column;
  align-items: center;
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
`

const Line = styled('div')`
  width: 10em;
  display: flex;
  flex-direction: row;
`

const Description = styled(Line)`
  margin-top: 1em;
`

const Profile = ({ profile }: ProfileProps) => (
  <User>
    <Picture
      alt={
        profile
          ? `${profile.username}'s profile picture`
          : "The user's profile picture"
      }
      src={profile?.picture + '?s=300'}
    />
    <Info>
      <Line>
        <H2>{profile?.username}</H2>
      </Line>
      <Line>
        <H4>{profile?.firstname}</H4>
        <SpacedH4>{profile?.lastname}</SpacedH4>
      </Line>
      <Description>
        <A known>📍</A>
        <A>{profile?.location || (!SSG && 'Earth')}</A>
      </Description>
      <Description>
        {SSG ? (
          <Skeleton width='100%' height='5em' />
        ) : (
          <code>{profile.description || (!SSG && 'Empty description')}</code>
        )}
      </Description>
    </Info>
  </User>
)

export default Profile
