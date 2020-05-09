import * as React from 'react'
import { Head, SSG } from '@quercia/quercia'
import { styled } from 'goober'

import { Parent } from '../components/split'
import User from '../components/profile/user'
import Repos from '../components/profile/repos'
import { User as IUser } from '../types/data'

export interface ProfileProps {
  user?: IUser
  account?: IUser
}

const Container = styled(Parent)`
  padding: 2em 5em;

  @media (max-width: 960px) {
    padding: 2em 0;
  }
`

export default (props: ProfileProps) => (
  <Container>
    <Head>
      <title>{props.user?.username || 'profile'} - o2</title>
      <meta
        name='description'
        content={
          'the user profile page' + SSG ? `of ${props.user?.username}` : ''
        }
      />
    </Head>
    <User {...props} />
    <Repos {...props} />
  </Container>
)
