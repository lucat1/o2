import { styled } from 'goober'
import * as React from 'react'

import { Head, SSG } from '@quercia/quercia'

import Repos from '../components/profile/repos'
import User from '../components/profile/user'
import { Parent } from '../components/split'
import { User as IUser } from '../types/data'

export interface ProfileProps {
  profile?: IUser
  account?: IUser
}

const Container = styled(Parent)`
  padding: 2em 5em;

  @media (max-width: 960px) {
    padding: 2em 0;
  }
`

export default ({ profile, account }: ProfileProps) => (
  <Container>
    <Head>
      <title>{profile?.username || 'user'} - o2</title>
      <meta
        name='description'
        content={'the user profile page' + SSG ? `of ${profile?.username}` : ''}
      />
    </Head>
    <User profile={profile} />
    <Repos profile={profile} account={account} />
  </Container>
)
