import * as React from 'react'
import { Head, SSG } from '@quercia/quercia'

import { Parent } from '../components/split'
import Repos from '../components/profile/repos'
import User from '../components/profile/user'

import { User as IUser, Base } from '../types/data'

export default ({ profile, account }: Base<{ profile: IUser }>) => (
  <Parent py={6} px={[0, 9]}>
    <Head>
      <title>{SSG ? 'user' : profile.username} - o2</title>
      <meta
        name='description'
        content={'the user profile page' + SSG ? '' : `of ${profile.username}`}
      />
    </Head>
    <User profile={profile} />
    <Repos
      owner={profile?.username}
      repositories={profile?.repositories}
      account={account}
    />
  </Parent>
)
