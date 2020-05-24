import * as React from 'react'
import { Head, SSG } from '@quercia/quercia'

import { Parent } from '../components/split'
import Repos from '../components/profile/repos'
import Org from '../components/profile/org'

import { Base, Organization } from '../types/data'

export default ({ profile, account }: Base<{ profile: Organization }>) => (
  <Parent p={['2rem 0', '2rem 5rem']}>
    <Head>
      <title>{SSG ? 'user' : profile.name} - o2</title>
      <meta
        name='description'
        content={'the user profile page' + SSG ? '' : `of ${profile.name}`}
      />
    </Head>
    <Org profile={profile} />
    <Repos
      owner={profile?.name}
      repositories={profile?.repositories}
      account={account}
    />
  </Parent>
)
