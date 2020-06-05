import * as React from 'react'
import { Head, SSG } from '@quercia/quercia'

import { Parent } from '../components/split'
import Repos from '../components/profile/repos'
import User from '../components/profile/user'

import { User as IUser, Base, Organization } from '../types/data'
import { Repository } from '../types/repository'

export default ({
  profile,
  account,
  organizations,
  repositories
}: Base<{
  repositories: Repository[]
  profile: IUser
  organizations: Organization[]
}>) => (
  <Parent py={6} px={[0, 9]}>
    <Head>
      <title>{SSG ? 'user' : profile.username} - o2</title>
      <meta
        name='description'
        content={'the user profile page' + SSG ? '' : `of ${profile.username}`}
      />
    </Head>
    <User organizations={organizations} profile={profile} />
    <Repos
      owner={profile?.username}
      repositories={repositories}
      account={account}
    />
  </Parent>
)
