import * as React from 'react'
import { Head } from '@quercia/quercia'
import styled from '@emotion/styled'

import User from '../components/profile/user'
import Repos from '../components/profile/repos'
import { User as IUser } from '../types/data'

export interface ProfileProps {
  user?: IUser
}

const Container = styled.main`
  display: flex;
  flex-direction: row;
  padding: 2em 5em;

  @media only screen and (max-width: 960px) {
    padding: 2em 0;
    flex-direction: column;
  }
`

export default ({ user }: ProfileProps) => (
  <Container>
    <Head>
      <title>{user?.username || 'profile'} - o2</title>
      <meta
        content={
          'the user profile page' + user?.username ? `of ${user.username}` : ''
        }
      />
    </Head>
    <User user={user} />
    <Repos />
  </Container>
)
