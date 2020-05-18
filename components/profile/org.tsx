import { styled } from 'goober'
import * as React from 'react'

import { SSG, Link } from '@quercia/quercia'

import Image from '../image'
import Skeleton from '../skeleton'
import { Left } from '../split'
import { A, H2 } from '../_typography'

import { Organization } from '../../types/data'

const User = styled(Left)`
  display: flex;
  flex-direction: column;
  align-items: center;
`

const Info = styled('div')`
  max-width: 12em;
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

const Users = styled('div')`
  padding: 1em;
  display: flex;
  justify-content: space-evenly;
`

const UserImg = styled(Image)`
  width: 2em;
  height: 2em;
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

      <Users>
        {(profile?.users || []).map(({ username, picture }, i) => (
          <Link key={i} to={`/${username}`}>
            <UserImg
              alt={`${username}'s profile picture`}
              src={`${picture}?s=50`}
            />
          </Link>
        ))}
      </Users>
    </Info>
  </User>
)

export default Profile
