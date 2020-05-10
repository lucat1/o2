import { styled } from 'goober'
import * as React from 'react'

import { Head, SSG } from '@quercia/quercia'

import Repos from '../components/profile/repos'
import User from '../components/profile/user'
import { Parent } from '../components/split'
import { ProfileProps } from './user'

const Container = styled(Parent)`
  padding: 2em 5em;

  @media (max-width: 960px) {
    padding: 2em 0;
  }
`

export default ({ profile, account }: ProfileProps) => (
  <Container>
    <Head>
      <title>{profile?.username || 'organization'} - o2</title>
      <meta
        name='description'
        content={
          'the profile of ' + SSG ? profile?.username : 'an organization'
        }
      />
    </Head>
    <User profile={profile} />
    <Repos profile={profile} account={account} />
  </Container>
)
