import { styled } from 'goober'
import * as React from 'react'
import { Box, Flex, FlexProps } from 'rebass'
import { SSG, navigate } from '@quercia/quercia'

import { Left } from '../split'
import Heading from '../heading'
import Text from '../text'
import Image from '../image'
import Skeleton from '../skeleton'

import C from '../base'

import { User } from '../../types/data'

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

const Line: React.FC<FlexProps> = props => (
  <Flex width={8} flexDirection='row' {...(props as any)} />
)

const Profile = ({ profile }: { profile: User }) => (
  <Left flexDirection='column' alignItems='center'>
    <Image
      width={8}
      height={8}
      alt={
        profile
          ? `${profile.username}'s profile picture`
          : "The user's profile picture"
      }
      src={profile?.picture + '?s=300'}
    />
    <Box py={4}>
      <Line>
        <Heading>{profile?.username}</Heading>
      </Line>
      <Line>
        <Heading as={'h3'} width={8} height={3} fontSize='sm'>
          {profile?.firstname + ' ' + profile?.lastname}
        </Heading>
      </Line>
      <Line py={2}>
        <Text known>📍</Text>
        <Text>{profile?.location || (!SSG && 'Earth')}</Text>
      </Line>
      <Line py={2}>
        <Text as='p' width={8} height={7}>
          {profile?.description || 'Empty description'}
        </Text>
      </Line>

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
    </Box>
  </Left>
)

export default Profile
