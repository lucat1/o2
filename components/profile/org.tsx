import * as React from 'react'
import { Box, Flex, FlexProps } from 'rebass'

import { Left } from '../split'
import Image from '../image'
import Heading from '../heading'
import Text from '../text'
import Link from '../link'

import { Organization, User } from '../../types/data'

const Line: React.FC<FlexProps> = props => (
  <Flex width={8} {...(props as any)} />
)

const Profile = ({
  profile,
  users
}: {
  profile: Organization
  users: User[]
}) => (
  <Left flexDirection='column' alignItems='center'>
    <Image
      width={8}
      height={8}
      alt={
        profile
          ? `${profile.name}'s profile picture`
          : "The organization's profile picture"
      }
      src={'/picture/' + profile?.picture + '?s=300'}
    />
    <Box py={4}>
      <Line>
        <Heading>{profile?.name}</Heading>
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

      <Flex py={4}>
        {(users || []).map(({ name, picture }, i) => (
          <Link key={i} to={`/${name}`}>
            <Image
              width={4}
              height={4}
              alt={`${name}'s profile picture`}
              src={`${picture}?s=50`}
            />
          </Link>
        ))}
      </Flex>
    </Box>
  </Left>
)

export default Profile
