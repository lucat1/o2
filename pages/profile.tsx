import * as React from 'react'
import { Head, usePrerender } from '@quercia/quercia'
import { styled } from 'goober'

import User from '../components/profile/user'
import Repos from '../components/profile/repos'
import { User as IUser } from '../types/data'

export interface ProfileProps {
  user?: IUser
  account?: IUser
}

const Container = styled('main')`
  display: flex;
  flex-direction: row;
  padding: 2em 5em;

  @media only screen and (max-width: 960px) {
    padding: 2em 0;
    flex-direction: column;
  }
`

export default ({ user, account }: ProfileProps) => (
  <Container>
    <Head>
      <title>{user?.username || 'profile'} - o2</title>
      <meta
        name='description'
        content={
          'the user profile page' + usePrerender() ? `of ${user?.username}` : ''
        }
      />
    </Head>
    <User user={user} />
    <Repos user={user} account={account} />
  </Container>
)
