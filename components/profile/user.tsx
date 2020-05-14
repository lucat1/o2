import { styled } from 'goober'
import * as React from 'react'

import { SSG, navigate } from '@quercia/quercia'

import { ProfileProps } from '../../pages/user'
import Image from '../image'
import Skeleton from '../skeleton'
import { Left } from '../split'
import { A, H2, H4, SpacedH4 } from '../typography'
import C from '../base'

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

const Org = styled(C)`
  font-size: 0.75em;
  padding: 0.75em 0.5em;
  cursor: pointer;
  outline: none;
  transition: box-shadow 200ms ease-in-out;

  &:focus {
    box-shadow: 0 0 0 4px rgba(var(--primary-rgb), 0.3);
  }

  display: flex;
  flex-direction: row;
  align-items: center;
`

const OrgImg = styled(Image)`
  display: block;
  width: 1.5em;
  height: 1.5em;
  margin-right: 0.5em;
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

      {(profile?.organizations || []).map(({ name, picture }, i) => (
        <Org
          key={i}
          tabIndex={0}
          onClick={() => navigate(`/${name}`)}
          onKeyUp={e => e.keyCode === 13 && navigate(`/${name}`)}
        >
          <OrgImg src={`${picture}?s=50`} alt={`${name}'s profile picture`} />
          <span>{name}</span>
        </Org>
      ))}
    </Info>
  </User>
)

export default Profile
