import * as React from 'react'
import { Head, SSG } from '@quercia/quercia'

import { Parent } from '../components/split'
import Repos from '../components/profile/repos'
import Org from '../components/profile/org'

import { Base, Organization, User } from '../types/data'
import { Repository } from '../types/repository'

export default ({
  profile,
  account,
  users,
  repositories
}: Base<{
  profile: Organization
  repositories: Repository[]
  users: User[]
}>) => (
  <Parent p={['2rem 0', '2rem 5rem']}>
    <Head>
      <title>{SSG ? 'user' : profile.name} - o2</title>
      <meta
        name='description'
        content={'the user profile page' + SSG ? '' : `of ${profile.name}`}
      />
    </Head>
    <Org users={users} profile={profile} />
    <Repos
      owner={profile?.name}
      repositories={repositories}
      account={account}
    />
  </Parent>
)
