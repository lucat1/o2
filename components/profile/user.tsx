import * as React from 'react'
import { Box, Flex, FlexProps } from 'rebass'

import { Left } from '../split'
import Image from '../image'
import Base from '../base'
import Heading from '../heading'
import Text from '../text'
import Link from '../link'

import { User } from '../../types/data'

const Line: React.FC<FlexProps> = props => (
  <Flex width={8} {...(props as any)} />
)

const Organization: React.FC<FlexProps> = props => (
  <Base width={8} p={2} sx={{ outline: 'none' }} {...(props as any)} />
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
      <Line css={{ wordWrap: 'break-word' }}>
        <Heading fontSize='lg'>{profile?.username}</Heading>
      </Line>
      <Line>
        <Heading as={'h3'} width={8} height={3} fontSize='xs'>
          {profile?.firstname + ' ' + profile?.lastname}
        </Heading>
      </Line>
      <Line py={2}>
        <Text known>📍</Text>
        <Text color='primary.default'>{profile?.location || 'Universe'}</Text>
      </Line>
      <Line py={2}>
        <Text as='p' width={8} height={7}>
          {profile?.description || 'Empty description'}
        </Text>
      </Line>

      {(profile?.organizations || []).map(({ name, picture }, i) => (
        <Organization key={i}>
          <Image
            width={3}
            height={3}
            mr={2}
            src={`${picture}?s=50`}
            alt={`${name}'s profile picture`}
          />
          <Link to={`/${name}`}>{name}</Link>
        </Organization>
      ))}
    </Box>
  </Left>
)

export default Profile
