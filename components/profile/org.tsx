import { styled } from 'goober'
import * as React from 'react'

import { SSG } from '@quercia/quercia'

import Image from '../image'
import Skeleton from '../skeleton'
import { Left } from '../split'
import { A, H2, H4, SpacedH4 } from '../typography'

import { Organization } from '../../types/data'

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

const Profile = ({ profile }: { profile: Organization }) => (
  <User>
    <Picture
      alt={
        profile
          ? `${profile.name}'s profile picture`
          : "The organization's profile picture"
      }
      src={profile?.picture + '?s=300'}
    />
    <Info>
      <Line>
        <H2>{profile?.name}</H2>
      </Line>
      <Description>
        <A known>📍</A>
        <A>{profile?.location || (!SSG && 'Universe')}</A>
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
